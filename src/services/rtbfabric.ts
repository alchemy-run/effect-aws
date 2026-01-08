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
  sdkId: "RTBFabric",
  serviceShapeName: "RTBFabric",
});
const auth = T.AwsAuthSigv4({ name: "rtbfabric" });
const ver = T.ServiceVersion("2023-05-15");
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
              `https://rtbfabric-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://rtbfabric-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://rtbfabric.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://rtbfabric.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type RtbTaggableResourceArn = string;
export type TagKey = string;
export type GatewayId = string;
export type LinkId = string;
export type VpcId = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type URL = string;
export type DomainName = string;
export type TagValue = string;
export type CustomerProvidedId = string;
export type Version = string;
export type FlowModuleName = string;
export type Base64EncodedCertificateChain = string | Redacted.Redacted<string>;
export type AutoScalingGroupName = string;
export type KubernetesEndpointsResourceName = string;
export type KubernetesNamespace = string;
export type URI = string;
export type KubernetesClusterName = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface ListRequesterGatewaysRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListRequesterGatewaysRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/requester-gateways" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRequesterGatewaysRequest",
}) as any as S.Schema<ListRequesterGatewaysRequest>;
export interface ListResponderGatewaysRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListResponderGatewaysRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/responder-gateways" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResponderGatewaysRequest",
}) as any as S.Schema<ListResponderGatewaysRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface GetLinkRequest {
  gatewayId: string;
  linkId: string;
}
export const GetLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/gateway/{gatewayId}/link/{linkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLinkRequest",
}) as any as S.Schema<GetLinkRequest>;
export interface DeleteLinkRequest {
  gatewayId: string;
  linkId: string;
}
export const DeleteLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/gateway/{gatewayId}/link/{linkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLinkRequest",
}) as any as S.Schema<DeleteLinkRequest>;
export interface ListLinksRequest {
  gatewayId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListLinksRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/gateway/{gatewayId}/links/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLinksRequest",
}) as any as S.Schema<ListLinksRequest>;
export type ResponderErrorMaskingLoggingTypes = string[];
export const ResponderErrorMaskingLoggingTypes = S.Array(S.String);
export interface ResponderErrorMaskingForHttpCode {
  httpCode: string;
  action: string;
  loggingTypes: ResponderErrorMaskingLoggingTypes;
  responseLoggingPercentage?: number;
}
export const ResponderErrorMaskingForHttpCode = S.suspend(() =>
  S.Struct({
    httpCode: S.String,
    action: S.String,
    loggingTypes: ResponderErrorMaskingLoggingTypes,
    responseLoggingPercentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "ResponderErrorMaskingForHttpCode",
}) as any as S.Schema<ResponderErrorMaskingForHttpCode>;
export type ResponderErrorMasking = ResponderErrorMaskingForHttpCode[];
export const ResponderErrorMasking = S.Array(ResponderErrorMaskingForHttpCode);
export interface LinkAttributes {
  responderErrorMasking?: ResponderErrorMasking;
  customerProvidedId?: string;
}
export const LinkAttributes = S.suspend(() =>
  S.Struct({
    responderErrorMasking: S.optional(ResponderErrorMasking),
    customerProvidedId: S.optional(S.String),
  }),
).annotations({
  identifier: "LinkAttributes",
}) as any as S.Schema<LinkAttributes>;
export interface LinkApplicationLogSampling {
  errorLog: number;
  filterLog: number;
}
export const LinkApplicationLogSampling = S.suspend(() =>
  S.Struct({ errorLog: S.Number, filterLog: S.Number }),
).annotations({
  identifier: "LinkApplicationLogSampling",
}) as any as S.Schema<LinkApplicationLogSampling>;
export interface LinkApplicationLogConfiguration {
  sampling: LinkApplicationLogSampling;
}
export const LinkApplicationLogConfiguration = S.suspend(() =>
  S.Struct({ sampling: LinkApplicationLogSampling }),
).annotations({
  identifier: "LinkApplicationLogConfiguration",
}) as any as S.Schema<LinkApplicationLogConfiguration>;
export interface LinkLogSettings {
  applicationLogs: LinkApplicationLogConfiguration;
}
export const LinkLogSettings = S.suspend(() =>
  S.Struct({ applicationLogs: LinkApplicationLogConfiguration }),
).annotations({
  identifier: "LinkLogSettings",
}) as any as S.Schema<LinkLogSettings>;
export interface AcceptLinkRequest {
  gatewayId: string;
  linkId: string;
  attributes?: LinkAttributes;
  logSettings: LinkLogSettings;
}
export const AcceptLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
    attributes: S.optional(LinkAttributes),
    logSettings: LinkLogSettings,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/gateway/{gatewayId}/link/{linkId}/accept",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptLinkRequest",
}) as any as S.Schema<AcceptLinkRequest>;
export interface RejectLinkRequest {
  gatewayId: string;
  linkId: string;
}
export const RejectLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/gateway/{gatewayId}/link/{linkId}/reject",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectLinkRequest",
}) as any as S.Schema<RejectLinkRequest>;
export interface UpdateLinkRequest {
  gatewayId: string;
  linkId: string;
  logSettings?: LinkLogSettings;
}
export const UpdateLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
    logSettings: S.optional(LinkLogSettings),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/gateway/{gatewayId}/link/{linkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLinkRequest",
}) as any as S.Schema<UpdateLinkRequest>;
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface CreateRequesterGatewayRequest {
  vpcId: string;
  subnetIds: SubnetIdList;
  securityGroupIds: SecurityGroupIdList;
  clientToken: string;
  description?: string;
  tags?: TagsMap;
}
export const CreateRequesterGatewayRequest = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIdList,
    securityGroupIds: SecurityGroupIdList,
    clientToken: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/requester-gateway" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRequesterGatewayRequest",
}) as any as S.Schema<CreateRequesterGatewayRequest>;
export interface GetRequesterGatewayRequest {
  gatewayId: string;
}
export const GetRequesterGatewayRequest = S.suspend(() =>
  S.Struct({ gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/requester-gateway/{gatewayId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRequesterGatewayRequest",
}) as any as S.Schema<GetRequesterGatewayRequest>;
export interface DeleteRequesterGatewayRequest {
  gatewayId: string;
}
export const DeleteRequesterGatewayRequest = S.suspend(() =>
  S.Struct({ gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/requester-gateway/{gatewayId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRequesterGatewayRequest",
}) as any as S.Schema<DeleteRequesterGatewayRequest>;
export interface UpdateRequesterGatewayRequest {
  clientToken: string;
  gatewayId: string;
  description?: string;
}
export const UpdateRequesterGatewayRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/requester-gateway/{gatewayId}/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRequesterGatewayRequest",
}) as any as S.Schema<UpdateRequesterGatewayRequest>;
export interface CreateOutboundExternalLinkRequest {
  clientToken: string;
  gatewayId: string;
  attributes?: LinkAttributes;
  publicEndpoint: string;
  logSettings: LinkLogSettings;
  tags?: TagsMap;
}
export const CreateOutboundExternalLinkRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    attributes: S.optional(LinkAttributes),
    publicEndpoint: S.String,
    logSettings: LinkLogSettings,
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/requester-gateway/{gatewayId}/outbound-external-link",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOutboundExternalLinkRequest",
}) as any as S.Schema<CreateOutboundExternalLinkRequest>;
export interface DeleteOutboundExternalLinkRequest {
  gatewayId: string;
  linkId: string;
}
export const DeleteOutboundExternalLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/requester-gateway/{gatewayId}/outbound-external-link/{linkId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOutboundExternalLinkRequest",
}) as any as S.Schema<DeleteOutboundExternalLinkRequest>;
export interface GetOutboundExternalLinkRequest {
  gatewayId: string;
  linkId: string;
}
export const GetOutboundExternalLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/requester-gateway/{gatewayId}/outbound-external-link/{linkId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOutboundExternalLinkRequest",
}) as any as S.Schema<GetOutboundExternalLinkRequest>;
export interface GetResponderGatewayRequest {
  gatewayId: string;
}
export const GetResponderGatewayRequest = S.suspend(() =>
  S.Struct({ gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/responder-gateway/{gatewayId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResponderGatewayRequest",
}) as any as S.Schema<GetResponderGatewayRequest>;
export interface DeleteResponderGatewayRequest {
  gatewayId: string;
}
export const DeleteResponderGatewayRequest = S.suspend(() =>
  S.Struct({ gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/responder-gateway/{gatewayId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResponderGatewayRequest",
}) as any as S.Schema<DeleteResponderGatewayRequest>;
export type CertificateAuthorityCertificates =
  | string
  | Redacted.Redacted<string>[];
export const CertificateAuthorityCertificates = S.Array(SensitiveString);
export interface TrustStoreConfiguration {
  certificateAuthorityCertificates: CertificateAuthorityCertificates;
}
export const TrustStoreConfiguration = S.suspend(() =>
  S.Struct({
    certificateAuthorityCertificates: CertificateAuthorityCertificates,
  }),
).annotations({
  identifier: "TrustStoreConfiguration",
}) as any as S.Schema<TrustStoreConfiguration>;
export type AutoScalingGroupNameList = string[];
export const AutoScalingGroupNameList = S.Array(S.String);
export interface AutoScalingGroupsConfiguration {
  autoScalingGroupNames: AutoScalingGroupNameList;
  roleArn: string;
}
export const AutoScalingGroupsConfiguration = S.suspend(() =>
  S.Struct({
    autoScalingGroupNames: AutoScalingGroupNameList,
    roleArn: S.String,
  }),
).annotations({
  identifier: "AutoScalingGroupsConfiguration",
}) as any as S.Schema<AutoScalingGroupsConfiguration>;
export interface EksEndpointsConfiguration {
  endpointsResourceName: string;
  endpointsResourceNamespace: string;
  clusterApiServerEndpointUri: string;
  clusterApiServerCaCertificateChain: string | Redacted.Redacted<string>;
  clusterName: string;
  roleArn: string;
}
export const EksEndpointsConfiguration = S.suspend(() =>
  S.Struct({
    endpointsResourceName: S.String,
    endpointsResourceNamespace: S.String,
    clusterApiServerEndpointUri: S.String,
    clusterApiServerCaCertificateChain: SensitiveString,
    clusterName: S.String,
    roleArn: S.String,
  }),
).annotations({
  identifier: "EksEndpointsConfiguration",
}) as any as S.Schema<EksEndpointsConfiguration>;
export type ManagedEndpointConfiguration =
  | { autoScalingGroups: AutoScalingGroupsConfiguration }
  | { eksEndpoints: EksEndpointsConfiguration };
export const ManagedEndpointConfiguration = S.Union(
  S.Struct({ autoScalingGroups: AutoScalingGroupsConfiguration }),
  S.Struct({ eksEndpoints: EksEndpointsConfiguration }),
);
export interface UpdateResponderGatewayRequest {
  domainName?: string;
  port: number;
  protocol: string;
  trustStoreConfiguration?: TrustStoreConfiguration;
  managedEndpointConfiguration?: (typeof ManagedEndpointConfiguration)["Type"];
  clientToken: string;
  gatewayId: string;
  description?: string;
}
export const UpdateResponderGatewayRequest = S.suspend(() =>
  S.Struct({
    domainName: S.optional(S.String),
    port: S.Number,
    protocol: S.String,
    trustStoreConfiguration: S.optional(TrustStoreConfiguration),
    managedEndpointConfiguration: S.optional(ManagedEndpointConfiguration),
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/responder-gateway/{gatewayId}/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResponderGatewayRequest",
}) as any as S.Schema<UpdateResponderGatewayRequest>;
export interface CreateInboundExternalLinkRequest {
  clientToken: string;
  gatewayId: string;
  attributes?: LinkAttributes;
  logSettings: LinkLogSettings;
  tags?: TagsMap;
}
export const CreateInboundExternalLinkRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    attributes: S.optional(LinkAttributes),
    logSettings: LinkLogSettings,
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/responder-gateway/{gatewayId}/inbound-external-link",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInboundExternalLinkRequest",
}) as any as S.Schema<CreateInboundExternalLinkRequest>;
export interface DeleteInboundExternalLinkRequest {
  gatewayId: string;
  linkId: string;
}
export const DeleteInboundExternalLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/responder-gateway/{gatewayId}/inbound-external-link/{linkId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInboundExternalLinkRequest",
}) as any as S.Schema<DeleteInboundExternalLinkRequest>;
export interface GetInboundExternalLinkRequest {
  gatewayId: string;
  linkId: string;
}
export const GetInboundExternalLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/responder-gateway/{gatewayId}/inbound-external-link/{linkId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInboundExternalLinkRequest",
}) as any as S.Schema<GetInboundExternalLinkRequest>;
export type FlowModuleNameList = string[];
export const FlowModuleNameList = S.Array(S.String);
export type GatewayIdList = string[];
export const GatewayIdList = S.Array(S.String);
export interface ListRequesterGatewaysResponse {
  gatewayIds?: GatewayIdList;
  nextToken?: string;
}
export const ListRequesterGatewaysResponse = S.suspend(() =>
  S.Struct({
    gatewayIds: S.optional(GatewayIdList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRequesterGatewaysResponse",
}) as any as S.Schema<ListRequesterGatewaysResponse>;
export interface ListResponderGatewaysResponse {
  gatewayIds?: GatewayIdList;
  nextToken?: string;
}
export const ListResponderGatewaysResponse = S.suspend(() =>
  S.Struct({
    gatewayIds: S.optional(GatewayIdList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResponderGatewaysResponse",
}) as any as S.Schema<ListResponderGatewaysResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagsMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagsMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagsMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface NoBidModuleParameters {
  reason?: string;
  reasonCode?: number;
  passThroughPercentage?: number;
}
export const NoBidModuleParameters = S.suspend(() =>
  S.Struct({
    reason: S.optional(S.String),
    reasonCode: S.optional(S.Number),
    passThroughPercentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "NoBidModuleParameters",
}) as any as S.Schema<NoBidModuleParameters>;
export type ValueList = string[];
export const ValueList = S.Array(S.String);
export interface FilterCriterion {
  path: string;
  values: ValueList;
}
export const FilterCriterion = S.suspend(() =>
  S.Struct({ path: S.String, values: ValueList }),
).annotations({
  identifier: "FilterCriterion",
}) as any as S.Schema<FilterCriterion>;
export type FilterCriteria = FilterCriterion[];
export const FilterCriteria = S.Array(FilterCriterion);
export interface Filter {
  criteria: FilterCriteria;
}
export const Filter = S.suspend(() =>
  S.Struct({ criteria: FilterCriteria }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterConfiguration = Filter[];
export const FilterConfiguration = S.Array(Filter);
export interface NoBidAction {
  noBidReasonCode?: number;
}
export const NoBidAction = S.suspend(() =>
  S.Struct({ noBidReasonCode: S.optional(S.Number) }),
).annotations({ identifier: "NoBidAction" }) as any as S.Schema<NoBidAction>;
export interface HeaderTagAction {
  name: string;
  value: string;
}
export const HeaderTagAction = S.suspend(() =>
  S.Struct({ name: S.String, value: S.String }),
).annotations({
  identifier: "HeaderTagAction",
}) as any as S.Schema<HeaderTagAction>;
export type Action = { noBid: NoBidAction } | { headerTag: HeaderTagAction };
export const Action = S.Union(
  S.Struct({ noBid: NoBidAction }),
  S.Struct({ headerTag: HeaderTagAction }),
);
export interface OpenRtbAttributeModuleParameters {
  filterType: string;
  filterConfiguration: FilterConfiguration;
  action: (typeof Action)["Type"];
  holdbackPercentage: number;
}
export const OpenRtbAttributeModuleParameters = S.suspend(() =>
  S.Struct({
    filterType: S.String,
    filterConfiguration: FilterConfiguration,
    action: Action,
    holdbackPercentage: S.Number,
  }),
).annotations({
  identifier: "OpenRtbAttributeModuleParameters",
}) as any as S.Schema<OpenRtbAttributeModuleParameters>;
export interface RateLimiterModuleParameters {
  tps?: number;
}
export const RateLimiterModuleParameters = S.suspend(() =>
  S.Struct({ tps: S.optional(S.Number) }),
).annotations({
  identifier: "RateLimiterModuleParameters",
}) as any as S.Schema<RateLimiterModuleParameters>;
export type ModuleParameters =
  | { noBid: NoBidModuleParameters }
  | { openRtbAttribute: OpenRtbAttributeModuleParameters }
  | { rateLimiter: RateLimiterModuleParameters };
export const ModuleParameters = S.Union(
  S.Struct({ noBid: NoBidModuleParameters }),
  S.Struct({ openRtbAttribute: OpenRtbAttributeModuleParameters }),
  S.Struct({ rateLimiter: RateLimiterModuleParameters }),
);
export interface ModuleConfiguration {
  version?: string;
  name: string;
  dependsOn?: FlowModuleNameList;
  moduleParameters?: (typeof ModuleParameters)["Type"];
}
export const ModuleConfiguration = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    name: S.String,
    dependsOn: S.optional(FlowModuleNameList),
    moduleParameters: S.optional(ModuleParameters),
  }),
).annotations({
  identifier: "ModuleConfiguration",
}) as any as S.Schema<ModuleConfiguration>;
export type ModuleConfigurationList = ModuleConfiguration[];
export const ModuleConfigurationList = S.Array(ModuleConfiguration);
export interface GetLinkResponse {
  gatewayId: string;
  peerGatewayId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  direction?: string;
  flowModules?: ModuleConfigurationList;
  pendingFlowModules?: ModuleConfigurationList;
  attributes?: LinkAttributes;
  linkId: string;
  tags?: TagsMap;
  logSettings?: LinkLogSettings;
}
export const GetLinkResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    peerGatewayId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    direction: S.optional(S.String),
    flowModules: S.optional(ModuleConfigurationList),
    pendingFlowModules: S.optional(ModuleConfigurationList),
    attributes: S.optional(LinkAttributes),
    linkId: S.String,
    tags: S.optional(TagsMap),
    logSettings: S.optional(LinkLogSettings),
  }),
).annotations({
  identifier: "GetLinkResponse",
}) as any as S.Schema<GetLinkResponse>;
export interface DeleteLinkResponse {
  linkId: string;
  status: string;
}
export const DeleteLinkResponse = S.suspend(() =>
  S.Struct({ linkId: S.String, status: S.String }),
).annotations({
  identifier: "DeleteLinkResponse",
}) as any as S.Schema<DeleteLinkResponse>;
export interface AcceptLinkResponse {
  gatewayId: string;
  peerGatewayId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  direction?: string;
  flowModules?: ModuleConfigurationList;
  pendingFlowModules?: ModuleConfigurationList;
  attributes?: LinkAttributes;
  linkId: string;
}
export const AcceptLinkResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    peerGatewayId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    direction: S.optional(S.String),
    flowModules: S.optional(ModuleConfigurationList),
    pendingFlowModules: S.optional(ModuleConfigurationList),
    attributes: S.optional(LinkAttributes),
    linkId: S.String,
  }),
).annotations({
  identifier: "AcceptLinkResponse",
}) as any as S.Schema<AcceptLinkResponse>;
export interface RejectLinkResponse {
  gatewayId: string;
  peerGatewayId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  direction?: string;
  flowModules?: ModuleConfigurationList;
  pendingFlowModules?: ModuleConfigurationList;
  attributes?: LinkAttributes;
  linkId: string;
}
export const RejectLinkResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    peerGatewayId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    direction: S.optional(S.String),
    flowModules: S.optional(ModuleConfigurationList),
    pendingFlowModules: S.optional(ModuleConfigurationList),
    attributes: S.optional(LinkAttributes),
    linkId: S.String,
  }),
).annotations({
  identifier: "RejectLinkResponse",
}) as any as S.Schema<RejectLinkResponse>;
export interface UpdateLinkResponse {
  linkId: string;
  status: string;
}
export const UpdateLinkResponse = S.suspend(() =>
  S.Struct({ linkId: S.String, status: S.String }),
).annotations({
  identifier: "UpdateLinkResponse",
}) as any as S.Schema<UpdateLinkResponse>;
export interface CreateRequesterGatewayResponse {
  gatewayId: string;
  domainName: string;
  status: string;
}
export const CreateRequesterGatewayResponse = S.suspend(() =>
  S.Struct({ gatewayId: S.String, domainName: S.String, status: S.String }),
).annotations({
  identifier: "CreateRequesterGatewayResponse",
}) as any as S.Schema<CreateRequesterGatewayResponse>;
export interface GetRequesterGatewayResponse {
  status: string;
  domainName: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  vpcId: string;
  subnetIds: SubnetIdList;
  securityGroupIds: SecurityGroupIdList;
  gatewayId: string;
  tags?: TagsMap;
  activeLinksCount?: number;
  totalLinksCount?: number;
}
export const GetRequesterGatewayResponse = S.suspend(() =>
  S.Struct({
    status: S.String,
    domainName: S.String,
    description: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    vpcId: S.String,
    subnetIds: SubnetIdList,
    securityGroupIds: SecurityGroupIdList,
    gatewayId: S.String,
    tags: S.optional(TagsMap),
    activeLinksCount: S.optional(S.Number),
    totalLinksCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetRequesterGatewayResponse",
}) as any as S.Schema<GetRequesterGatewayResponse>;
export interface DeleteRequesterGatewayResponse {
  gatewayId: string;
  status: string;
}
export const DeleteRequesterGatewayResponse = S.suspend(() =>
  S.Struct({ gatewayId: S.String, status: S.String }),
).annotations({
  identifier: "DeleteRequesterGatewayResponse",
}) as any as S.Schema<DeleteRequesterGatewayResponse>;
export interface UpdateRequesterGatewayResponse {
  gatewayId: string;
  status: string;
}
export const UpdateRequesterGatewayResponse = S.suspend(() =>
  S.Struct({ gatewayId: S.String, status: S.String }),
).annotations({
  identifier: "UpdateRequesterGatewayResponse",
}) as any as S.Schema<UpdateRequesterGatewayResponse>;
export interface CreateOutboundExternalLinkResponse {
  gatewayId: string;
  linkId: string;
  status: string;
}
export const CreateOutboundExternalLinkResponse = S.suspend(() =>
  S.Struct({ gatewayId: S.String, linkId: S.String, status: S.String }),
).annotations({
  identifier: "CreateOutboundExternalLinkResponse",
}) as any as S.Schema<CreateOutboundExternalLinkResponse>;
export interface DeleteOutboundExternalLinkResponse {
  linkId: string;
  status: string;
}
export const DeleteOutboundExternalLinkResponse = S.suspend(() =>
  S.Struct({ linkId: S.String, status: S.String }),
).annotations({
  identifier: "DeleteOutboundExternalLinkResponse",
}) as any as S.Schema<DeleteOutboundExternalLinkResponse>;
export interface GetOutboundExternalLinkResponse {
  gatewayId: string;
  linkId: string;
  status: string;
  publicEndpoint: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: TagsMap;
  logSettings?: LinkLogSettings;
}
export const GetOutboundExternalLinkResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    linkId: S.String,
    status: S.String,
    publicEndpoint: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagsMap),
    logSettings: S.optional(LinkLogSettings),
  }),
).annotations({
  identifier: "GetOutboundExternalLinkResponse",
}) as any as S.Schema<GetOutboundExternalLinkResponse>;
export interface GetResponderGatewayResponse {
  vpcId: string;
  subnetIds: SubnetIdList;
  securityGroupIds: SecurityGroupIdList;
  status: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  domainName?: string;
  port: number;
  protocol: string;
  trustStoreConfiguration?: TrustStoreConfiguration;
  managedEndpointConfiguration?: (typeof ManagedEndpointConfiguration)["Type"];
  gatewayId: string;
  tags?: TagsMap;
  activeLinksCount?: number;
  totalLinksCount?: number;
  inboundLinksCount?: number;
}
export const GetResponderGatewayResponse = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIdList,
    securityGroupIds: SecurityGroupIdList,
    status: S.String,
    description: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    domainName: S.optional(S.String),
    port: S.Number,
    protocol: S.String,
    trustStoreConfiguration: S.optional(TrustStoreConfiguration),
    managedEndpointConfiguration: S.optional(ManagedEndpointConfiguration),
    gatewayId: S.String,
    tags: S.optional(TagsMap),
    activeLinksCount: S.optional(S.Number),
    totalLinksCount: S.optional(S.Number),
    inboundLinksCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetResponderGatewayResponse",
}) as any as S.Schema<GetResponderGatewayResponse>;
export interface DeleteResponderGatewayResponse {
  gatewayId: string;
  status: string;
}
export const DeleteResponderGatewayResponse = S.suspend(() =>
  S.Struct({ gatewayId: S.String, status: S.String }),
).annotations({
  identifier: "DeleteResponderGatewayResponse",
}) as any as S.Schema<DeleteResponderGatewayResponse>;
export interface UpdateResponderGatewayResponse {
  gatewayId: string;
  status: string;
}
export const UpdateResponderGatewayResponse = S.suspend(() =>
  S.Struct({ gatewayId: S.String, status: S.String }),
).annotations({
  identifier: "UpdateResponderGatewayResponse",
}) as any as S.Schema<UpdateResponderGatewayResponse>;
export interface CreateInboundExternalLinkResponse {
  gatewayId: string;
  linkId: string;
  status: string;
  domainName: string;
}
export const CreateInboundExternalLinkResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    linkId: S.String,
    status: S.String,
    domainName: S.String,
  }),
).annotations({
  identifier: "CreateInboundExternalLinkResponse",
}) as any as S.Schema<CreateInboundExternalLinkResponse>;
export interface DeleteInboundExternalLinkResponse {
  linkId: string;
  status: string;
}
export const DeleteInboundExternalLinkResponse = S.suspend(() =>
  S.Struct({ linkId: S.String, status: S.String }),
).annotations({
  identifier: "DeleteInboundExternalLinkResponse",
}) as any as S.Schema<DeleteInboundExternalLinkResponse>;
export interface GetInboundExternalLinkResponse {
  gatewayId: string;
  linkId: string;
  status: string;
  domainName: string;
  flowModules?: ModuleConfigurationList;
  pendingFlowModules?: ModuleConfigurationList;
  attributes?: LinkAttributes;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: TagsMap;
  logSettings?: LinkLogSettings;
}
export const GetInboundExternalLinkResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    linkId: S.String,
    status: S.String,
    domainName: S.String,
    flowModules: S.optional(ModuleConfigurationList),
    pendingFlowModules: S.optional(ModuleConfigurationList),
    attributes: S.optional(LinkAttributes),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagsMap),
    logSettings: S.optional(LinkLogSettings),
  }),
).annotations({
  identifier: "GetInboundExternalLinkResponse",
}) as any as S.Schema<GetInboundExternalLinkResponse>;
export interface ListLinksResponseStructure {
  gatewayId: string;
  peerGatewayId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  direction?: string;
  flowModules?: ModuleConfigurationList;
  pendingFlowModules?: ModuleConfigurationList;
  attributes?: LinkAttributes;
  linkId: string;
  tags?: TagsMap;
}
export const ListLinksResponseStructure = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    peerGatewayId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    direction: S.optional(S.String),
    flowModules: S.optional(ModuleConfigurationList),
    pendingFlowModules: S.optional(ModuleConfigurationList),
    attributes: S.optional(LinkAttributes),
    linkId: S.String,
    tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "ListLinksResponseStructure",
}) as any as S.Schema<ListLinksResponseStructure>;
export type LinkList = ListLinksResponseStructure[];
export const LinkList = S.Array(ListLinksResponseStructure);
export interface ListLinksResponse {
  links?: LinkList;
  nextToken?: string;
}
export const ListLinksResponse = S.suspend(() =>
  S.Struct({ links: S.optional(LinkList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListLinksResponse",
}) as any as S.Schema<ListLinksResponse>;
export interface CreateResponderGatewayRequest {
  vpcId: string;
  subnetIds: SubnetIdList;
  securityGroupIds: SecurityGroupIdList;
  domainName?: string;
  port: number;
  protocol: string;
  trustStoreConfiguration?: TrustStoreConfiguration;
  managedEndpointConfiguration?: (typeof ManagedEndpointConfiguration)["Type"];
  clientToken: string;
  description?: string;
  tags?: TagsMap;
}
export const CreateResponderGatewayRequest = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIdList,
    securityGroupIds: SecurityGroupIdList,
    domainName: S.optional(S.String),
    port: S.Number,
    protocol: S.String,
    trustStoreConfiguration: S.optional(TrustStoreConfiguration),
    managedEndpointConfiguration: S.optional(ManagedEndpointConfiguration),
    clientToken: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/responder-gateway" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResponderGatewayRequest",
}) as any as S.Schema<CreateResponderGatewayRequest>;
export interface CreateLinkRequest {
  gatewayId: string;
  peerGatewayId: string;
  attributes?: LinkAttributes;
  httpResponderAllowed?: boolean;
  tags?: TagsMap;
  logSettings: LinkLogSettings;
}
export const CreateLinkRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    peerGatewayId: S.String,
    attributes: S.optional(LinkAttributes),
    httpResponderAllowed: S.optional(S.Boolean),
    tags: S.optional(TagsMap),
    logSettings: LinkLogSettings,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/gateway/{gatewayId}/create-link" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLinkRequest",
}) as any as S.Schema<CreateLinkRequest>;
export interface CreateResponderGatewayResponse {
  gatewayId: string;
  status: string;
}
export const CreateResponderGatewayResponse = S.suspend(() =>
  S.Struct({ gatewayId: S.String, status: S.String }),
).annotations({
  identifier: "CreateResponderGatewayResponse",
}) as any as S.Schema<CreateResponderGatewayResponse>;
export interface CreateLinkResponse {
  gatewayId: string;
  peerGatewayId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  direction?: string;
  flowModules?: ModuleConfigurationList;
  pendingFlowModules?: ModuleConfigurationList;
  attributes?: LinkAttributes;
  linkId: string;
  customerProvidedId?: string;
}
export const CreateLinkResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    peerGatewayId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    direction: S.optional(S.String),
    flowModules: S.optional(ModuleConfigurationList),
    pendingFlowModules: S.optional(ModuleConfigurationList),
    attributes: S.optional(LinkAttributes),
    linkId: S.String,
    customerProvidedId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateLinkResponse",
}) as any as S.Schema<CreateLinkResponse>;
export interface UpdateLinkModuleFlowRequest {
  clientToken: string;
  gatewayId: string;
  linkId: string;
  modules: ModuleConfigurationList;
}
export const UpdateLinkModuleFlowRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
    modules: ModuleConfigurationList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/gateway/{gatewayId}/link/{linkId}/module-flow",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLinkModuleFlowRequest",
}) as any as S.Schema<UpdateLinkModuleFlowRequest>;
export interface UpdateLinkModuleFlowResponse {
  gatewayId: string;
  linkId: string;
  status: string;
}
export const UpdateLinkModuleFlowResponse = S.suspend(() =>
  S.Struct({ gatewayId: S.String, linkId: S.String, status: S.String }),
).annotations({
  identifier: "UpdateLinkModuleFlowResponse",
}) as any as S.Schema<UpdateLinkModuleFlowResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Lists requester gateways.
 */
export const listRequesterGateways: {
  (
    input: ListRequesterGatewaysRequest,
  ): Effect.Effect<
    ListRequesterGatewaysResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRequesterGatewaysRequest,
  ) => Stream.Stream<
    ListRequesterGatewaysResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRequesterGatewaysRequest,
  ) => Stream.Stream<
    GatewayId,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRequesterGatewaysRequest,
  output: ListRequesterGatewaysResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "gatewayIds",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists reponder gateways.
 */
export const listResponderGateways: {
  (
    input: ListResponderGatewaysRequest,
  ): Effect.Effect<
    ListResponderGatewaysResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResponderGatewaysRequest,
  ) => Stream.Stream<
    ListResponderGatewaysResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResponderGatewaysRequest,
  ) => Stream.Stream<
    GatewayId,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResponderGatewaysRequest,
  output: ListResponderGatewaysResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "gatewayIds",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about a link between gateways.
 *
 * Returns detailed information about the link configuration, status, and associated gateways.
 */
export const getLink: (
  input: GetLinkRequest,
) => Effect.Effect<
  GetLinkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLinkRequest,
  output: GetLinkResponse,
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
 * Creates a responder gateway.
 *
 * A domain name or managed endpoint is required.
 */
export const createResponderGateway: (
  input: CreateResponderGatewayRequest,
) => Effect.Effect<
  CreateResponderGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResponderGatewayRequest,
  output: CreateResponderGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists links associated with gateways.
 *
 * Returns a list of all links for the specified gateways, including their status and configuration details.
 */
export const listLinks: {
  (
    input: ListLinksRequest,
  ): Effect.Effect<
    ListLinksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLinksRequest,
  ) => Stream.Stream<
    ListLinksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLinksRequest,
  ) => Stream.Stream<
    ListLinksResponseStructure,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLinksRequest,
  output: ListLinksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "links",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes a tag or tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a requester gateway.
 */
export const getRequesterGateway: (
  input: GetRequesterGatewayRequest,
) => Effect.Effect<
  GetRequesterGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRequesterGatewayRequest,
  output: GetRequesterGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a requester gateway.
 */
export const deleteRequesterGateway: (
  input: DeleteRequesterGatewayRequest,
) => Effect.Effect<
  DeleteRequesterGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRequesterGatewayRequest,
  output: DeleteRequesterGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an outbound external link.
 */
export const getOutboundExternalLink: (
  input: GetOutboundExternalLinkRequest,
) => Effect.Effect<
  GetOutboundExternalLinkResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOutboundExternalLinkRequest,
  output: GetOutboundExternalLinkResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a responder gateway.
 */
export const getResponderGateway: (
  input: GetResponderGatewayRequest,
) => Effect.Effect<
  GetResponderGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResponderGatewayRequest,
  output: GetResponderGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a responder gateway.
 */
export const deleteResponderGateway: (
  input: DeleteResponderGatewayRequest,
) => Effect.Effect<
  DeleteResponderGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResponderGatewayRequest,
  output: DeleteResponderGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an inbound external link.
 */
export const getInboundExternalLink: (
  input: GetInboundExternalLinkRequest,
) => Effect.Effect<
  GetInboundExternalLinkResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInboundExternalLinkRequest,
  output: GetInboundExternalLinkResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a link between gateways.
 *
 * Permanently removes the connection between gateways. This action cannot be undone.
 */
export const deleteLink: (
  input: DeleteLinkRequest,
) => Effect.Effect<
  DeleteLinkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLinkRequest,
  output: DeleteLinkResponse,
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
 * Accepts a link request between gateways.
 *
 * When a requester gateway requests to link with a responder gateway, the responder can use this operation to accept the link request and establish the connection.
 */
export const acceptLink: (
  input: AcceptLinkRequest,
) => Effect.Effect<
  AcceptLinkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptLinkRequest,
  output: AcceptLinkResponse,
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
 * Rejects a link request between gateways.
 *
 * When a requester gateway requests to link with a responder gateway, the responder can use this operation to decline the link request.
 */
export const rejectLink: (
  input: RejectLinkRequest,
) => Effect.Effect<
  RejectLinkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectLinkRequest,
  output: RejectLinkResponse,
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
 * Updates the configuration of a link between gateways.
 *
 * Allows you to modify settings and parameters for an existing link.
 */
export const updateLink: (
  input: UpdateLinkRequest,
) => Effect.Effect<
  UpdateLinkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLinkRequest,
  output: UpdateLinkResponse,
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
 * Updates a requester gateway.
 */
export const updateRequesterGateway: (
  input: UpdateRequesterGatewayRequest,
) => Effect.Effect<
  UpdateRequesterGatewayResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRequesterGatewayRequest,
  output: UpdateRequesterGatewayResponse,
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
 * Deletes an outbound external link.
 */
export const deleteOutboundExternalLink: (
  input: DeleteOutboundExternalLinkRequest,
) => Effect.Effect<
  DeleteOutboundExternalLinkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOutboundExternalLinkRequest,
  output: DeleteOutboundExternalLinkResponse,
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
 * Updates a responder gateway.
 */
export const updateResponderGateway: (
  input: UpdateResponderGatewayRequest,
) => Effect.Effect<
  UpdateResponderGatewayResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResponderGatewayRequest,
  output: UpdateResponderGatewayResponse,
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
 * Deletes an inbound external link.
 */
export const deleteInboundExternalLink: (
  input: DeleteInboundExternalLinkRequest,
) => Effect.Effect<
  DeleteInboundExternalLinkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInboundExternalLinkRequest,
  output: DeleteInboundExternalLinkResponse,
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
 * Creates a requester gateway.
 */
export const createRequesterGateway: (
  input: CreateRequesterGatewayRequest,
) => Effect.Effect<
  CreateRequesterGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRequesterGatewayRequest,
  output: CreateRequesterGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an outbound external link.
 */
export const createOutboundExternalLink: (
  input: CreateOutboundExternalLinkRequest,
) => Effect.Effect<
  CreateOutboundExternalLinkResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOutboundExternalLinkRequest,
  output: CreateOutboundExternalLinkResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an inbound external link.
 */
export const createInboundExternalLink: (
  input: CreateInboundExternalLinkRequest,
) => Effect.Effect<
  CreateInboundExternalLinkResponse,
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
  input: CreateInboundExternalLinkRequest,
  output: CreateInboundExternalLinkResponse,
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
 * Creates a new link between gateways.
 *
 * Establishes a connection that allows gateways to communicate and exchange bid requests and responses.
 */
export const createLink: (
  input: CreateLinkRequest,
) => Effect.Effect<
  CreateLinkResponse,
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
  input: CreateLinkRequest,
  output: CreateLinkResponse,
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
 * Updates a link module flow.
 */
export const updateLinkModuleFlow: (
  input: UpdateLinkModuleFlowRequest,
) => Effect.Effect<
  UpdateLinkModuleFlowResponse,
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
  input: UpdateLinkModuleFlowRequest,
  output: UpdateLinkModuleFlowResponse,
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

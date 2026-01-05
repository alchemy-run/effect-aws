import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "RTBFabric",
  serviceShapeName: "RTBFabric",
});
const auth = T.AwsAuthSigv4({ name: "rtbfabric" });
const ver = T.ServiceVersion("2023-05-15");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
                          endpoint: {
                            url: "https://rtbfabric-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
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
                          endpoint: {
                            url: "https://rtbfabric-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
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
                          endpoint: {
                            url: "https://rtbfabric.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://rtbfabric.{Region}.{PartitionResult#dnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export class ListRequesterGatewaysRequest extends S.Class<ListRequesterGatewaysRequest>(
  "ListRequesterGatewaysRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/requester-gateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResponderGatewaysRequest extends S.Class<ListResponderGatewaysRequest>(
  "ListResponderGatewaysRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/responder-gateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class GetLinkRequest extends S.Class<GetLinkRequest>("GetLinkRequest")(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/gateway/{gatewayId}/link/{linkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLinkRequest extends S.Class<DeleteLinkRequest>(
  "DeleteLinkRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/gateway/{gatewayId}/link/{linkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLinksRequest extends S.Class<ListLinksRequest>(
  "ListLinksRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/gateway/{gatewayId}/links/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResponderErrorMaskingLoggingTypes = S.Array(S.String);
export class ResponderErrorMaskingForHttpCode extends S.Class<ResponderErrorMaskingForHttpCode>(
  "ResponderErrorMaskingForHttpCode",
)({
  httpCode: S.String,
  action: S.String,
  loggingTypes: ResponderErrorMaskingLoggingTypes,
  responseLoggingPercentage: S.optional(S.Number),
}) {}
export const ResponderErrorMasking = S.Array(ResponderErrorMaskingForHttpCode);
export class LinkAttributes extends S.Class<LinkAttributes>("LinkAttributes")({
  responderErrorMasking: S.optional(ResponderErrorMasking),
  customerProvidedId: S.optional(S.String),
}) {}
export class LinkApplicationLogSampling extends S.Class<LinkApplicationLogSampling>(
  "LinkApplicationLogSampling",
)({ errorLog: S.Number, filterLog: S.Number }) {}
export class LinkApplicationLogConfiguration extends S.Class<LinkApplicationLogConfiguration>(
  "LinkApplicationLogConfiguration",
)({ sampling: LinkApplicationLogSampling }) {}
export class LinkLogSettings extends S.Class<LinkLogSettings>(
  "LinkLogSettings",
)({ applicationLogs: LinkApplicationLogConfiguration }) {}
export class AcceptLinkRequest extends S.Class<AcceptLinkRequest>(
  "AcceptLinkRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
    attributes: S.optional(LinkAttributes),
    logSettings: LinkLogSettings,
  },
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
) {}
export class RejectLinkRequest extends S.Class<RejectLinkRequest>(
  "RejectLinkRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  },
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
) {}
export class UpdateLinkRequest extends S.Class<UpdateLinkRequest>(
  "UpdateLinkRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
    logSettings: S.optional(LinkLogSettings),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/gateway/{gatewayId}/link/{linkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class CreateRequesterGatewayRequest extends S.Class<CreateRequesterGatewayRequest>(
  "CreateRequesterGatewayRequest",
)(
  {
    vpcId: S.String,
    subnetIds: SubnetIdList,
    securityGroupIds: SecurityGroupIdList,
    clientToken: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/requester-gateway" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRequesterGatewayRequest extends S.Class<GetRequesterGatewayRequest>(
  "GetRequesterGatewayRequest",
)(
  { gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) },
  T.all(
    T.Http({ method: "GET", uri: "/requester-gateway/{gatewayId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRequesterGatewayRequest extends S.Class<DeleteRequesterGatewayRequest>(
  "DeleteRequesterGatewayRequest",
)(
  { gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/requester-gateway/{gatewayId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRequesterGatewayRequest extends S.Class<UpdateRequesterGatewayRequest>(
  "UpdateRequesterGatewayRequest",
)(
  {
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/requester-gateway/{gatewayId}/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOutboundExternalLinkRequest extends S.Class<CreateOutboundExternalLinkRequest>(
  "CreateOutboundExternalLinkRequest",
)(
  {
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    attributes: S.optional(LinkAttributes),
    publicEndpoint: S.String,
    logSettings: LinkLogSettings,
    tags: S.optional(TagsMap),
  },
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
) {}
export class DeleteOutboundExternalLinkRequest extends S.Class<DeleteOutboundExternalLinkRequest>(
  "DeleteOutboundExternalLinkRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  },
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
) {}
export class GetOutboundExternalLinkRequest extends S.Class<GetOutboundExternalLinkRequest>(
  "GetOutboundExternalLinkRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  },
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
) {}
export class GetResponderGatewayRequest extends S.Class<GetResponderGatewayRequest>(
  "GetResponderGatewayRequest",
)(
  { gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) },
  T.all(
    T.Http({ method: "GET", uri: "/responder-gateway/{gatewayId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResponderGatewayRequest extends S.Class<DeleteResponderGatewayRequest>(
  "DeleteResponderGatewayRequest",
)(
  { gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/responder-gateway/{gatewayId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const CertificateAuthorityCertificates = S.Array(S.String);
export class TrustStoreConfiguration extends S.Class<TrustStoreConfiguration>(
  "TrustStoreConfiguration",
)({ certificateAuthorityCertificates: CertificateAuthorityCertificates }) {}
export const AutoScalingGroupNameList = S.Array(S.String);
export class AutoScalingGroupsConfiguration extends S.Class<AutoScalingGroupsConfiguration>(
  "AutoScalingGroupsConfiguration",
)({ autoScalingGroupNames: AutoScalingGroupNameList, roleArn: S.String }) {}
export class EksEndpointsConfiguration extends S.Class<EksEndpointsConfiguration>(
  "EksEndpointsConfiguration",
)({
  endpointsResourceName: S.String,
  endpointsResourceNamespace: S.String,
  clusterApiServerEndpointUri: S.String,
  clusterApiServerCaCertificateChain: S.String,
  clusterName: S.String,
  roleArn: S.String,
}) {}
export const ManagedEndpointConfiguration = S.Union(
  S.Struct({ autoScalingGroups: AutoScalingGroupsConfiguration }),
  S.Struct({ eksEndpoints: EksEndpointsConfiguration }),
);
export class UpdateResponderGatewayRequest extends S.Class<UpdateResponderGatewayRequest>(
  "UpdateResponderGatewayRequest",
)(
  {
    domainName: S.optional(S.String),
    port: S.Number,
    protocol: S.String,
    trustStoreConfiguration: S.optional(TrustStoreConfiguration),
    managedEndpointConfiguration: S.optional(ManagedEndpointConfiguration),
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/responder-gateway/{gatewayId}/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInboundExternalLinkRequest extends S.Class<CreateInboundExternalLinkRequest>(
  "CreateInboundExternalLinkRequest",
)(
  {
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    attributes: S.optional(LinkAttributes),
    logSettings: LinkLogSettings,
    tags: S.optional(TagsMap),
  },
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
) {}
export class DeleteInboundExternalLinkRequest extends S.Class<DeleteInboundExternalLinkRequest>(
  "DeleteInboundExternalLinkRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  },
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
) {}
export class GetInboundExternalLinkRequest extends S.Class<GetInboundExternalLinkRequest>(
  "GetInboundExternalLinkRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
  },
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
) {}
export const FlowModuleNameList = S.Array(S.String);
export const GatewayIdList = S.Array(S.String);
export class ListRequesterGatewaysResponse extends S.Class<ListRequesterGatewaysResponse>(
  "ListRequesterGatewaysResponse",
)({ gatewayIds: S.optional(GatewayIdList), nextToken: S.optional(S.String) }) {}
export class ListResponderGatewaysResponse extends S.Class<ListResponderGatewaysResponse>(
  "ListResponderGatewaysResponse",
)({ gatewayIds: S.optional(GatewayIdList), nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagsMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class NoBidModuleParameters extends S.Class<NoBidModuleParameters>(
  "NoBidModuleParameters",
)({
  reason: S.optional(S.String),
  reasonCode: S.optional(S.Number),
  passThroughPercentage: S.optional(S.Number),
}) {}
export const ValueList = S.Array(S.String);
export class FilterCriterion extends S.Class<FilterCriterion>(
  "FilterCriterion",
)({ path: S.String, values: ValueList }) {}
export const FilterCriteria = S.Array(FilterCriterion);
export class Filter extends S.Class<Filter>("Filter")({
  criteria: FilterCriteria,
}) {}
export const FilterConfiguration = S.Array(Filter);
export class NoBidAction extends S.Class<NoBidAction>("NoBidAction")({
  noBidReasonCode: S.optional(S.Number),
}) {}
export class HeaderTagAction extends S.Class<HeaderTagAction>(
  "HeaderTagAction",
)({ name: S.String, value: S.String }) {}
export const Action = S.Union(
  S.Struct({ noBid: NoBidAction }),
  S.Struct({ headerTag: HeaderTagAction }),
);
export class OpenRtbAttributeModuleParameters extends S.Class<OpenRtbAttributeModuleParameters>(
  "OpenRtbAttributeModuleParameters",
)({
  filterType: S.String,
  filterConfiguration: FilterConfiguration,
  action: Action,
  holdbackPercentage: S.Number,
}) {}
export class RateLimiterModuleParameters extends S.Class<RateLimiterModuleParameters>(
  "RateLimiterModuleParameters",
)({ tps: S.optional(S.Number) }) {}
export const ModuleParameters = S.Union(
  S.Struct({ noBid: NoBidModuleParameters }),
  S.Struct({ openRtbAttribute: OpenRtbAttributeModuleParameters }),
  S.Struct({ rateLimiter: RateLimiterModuleParameters }),
);
export class ModuleConfiguration extends S.Class<ModuleConfiguration>(
  "ModuleConfiguration",
)({
  version: S.optional(S.String),
  name: S.String,
  dependsOn: S.optional(FlowModuleNameList),
  moduleParameters: S.optional(ModuleParameters),
}) {}
export const ModuleConfigurationList = S.Array(ModuleConfiguration);
export class GetLinkResponse extends S.Class<GetLinkResponse>(
  "GetLinkResponse",
)({
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
}) {}
export class DeleteLinkResponse extends S.Class<DeleteLinkResponse>(
  "DeleteLinkResponse",
)({ linkId: S.String, status: S.String }) {}
export class AcceptLinkResponse extends S.Class<AcceptLinkResponse>(
  "AcceptLinkResponse",
)({
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
}) {}
export class RejectLinkResponse extends S.Class<RejectLinkResponse>(
  "RejectLinkResponse",
)({
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
}) {}
export class UpdateLinkResponse extends S.Class<UpdateLinkResponse>(
  "UpdateLinkResponse",
)({ linkId: S.String, status: S.String }) {}
export class CreateRequesterGatewayResponse extends S.Class<CreateRequesterGatewayResponse>(
  "CreateRequesterGatewayResponse",
)({ gatewayId: S.String, domainName: S.String, status: S.String }) {}
export class GetRequesterGatewayResponse extends S.Class<GetRequesterGatewayResponse>(
  "GetRequesterGatewayResponse",
)({
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
}) {}
export class DeleteRequesterGatewayResponse extends S.Class<DeleteRequesterGatewayResponse>(
  "DeleteRequesterGatewayResponse",
)({ gatewayId: S.String, status: S.String }) {}
export class UpdateRequesterGatewayResponse extends S.Class<UpdateRequesterGatewayResponse>(
  "UpdateRequesterGatewayResponse",
)({ gatewayId: S.String, status: S.String }) {}
export class CreateOutboundExternalLinkResponse extends S.Class<CreateOutboundExternalLinkResponse>(
  "CreateOutboundExternalLinkResponse",
)({ gatewayId: S.String, linkId: S.String, status: S.String }) {}
export class DeleteOutboundExternalLinkResponse extends S.Class<DeleteOutboundExternalLinkResponse>(
  "DeleteOutboundExternalLinkResponse",
)({ linkId: S.String, status: S.String }) {}
export class GetOutboundExternalLinkResponse extends S.Class<GetOutboundExternalLinkResponse>(
  "GetOutboundExternalLinkResponse",
)({
  gatewayId: S.String,
  linkId: S.String,
  status: S.String,
  publicEndpoint: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagsMap),
  logSettings: S.optional(LinkLogSettings),
}) {}
export class GetResponderGatewayResponse extends S.Class<GetResponderGatewayResponse>(
  "GetResponderGatewayResponse",
)({
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
}) {}
export class DeleteResponderGatewayResponse extends S.Class<DeleteResponderGatewayResponse>(
  "DeleteResponderGatewayResponse",
)({ gatewayId: S.String, status: S.String }) {}
export class UpdateResponderGatewayResponse extends S.Class<UpdateResponderGatewayResponse>(
  "UpdateResponderGatewayResponse",
)({ gatewayId: S.String, status: S.String }) {}
export class CreateInboundExternalLinkResponse extends S.Class<CreateInboundExternalLinkResponse>(
  "CreateInboundExternalLinkResponse",
)({
  gatewayId: S.String,
  linkId: S.String,
  status: S.String,
  domainName: S.String,
}) {}
export class DeleteInboundExternalLinkResponse extends S.Class<DeleteInboundExternalLinkResponse>(
  "DeleteInboundExternalLinkResponse",
)({ linkId: S.String, status: S.String }) {}
export class GetInboundExternalLinkResponse extends S.Class<GetInboundExternalLinkResponse>(
  "GetInboundExternalLinkResponse",
)({
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
}) {}
export class ListLinksResponseStructure extends S.Class<ListLinksResponseStructure>(
  "ListLinksResponseStructure",
)({
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
}) {}
export const LinkList = S.Array(ListLinksResponseStructure);
export class ListLinksResponse extends S.Class<ListLinksResponse>(
  "ListLinksResponse",
)({ links: S.optional(LinkList), nextToken: S.optional(S.String) }) {}
export class CreateResponderGatewayRequest extends S.Class<CreateResponderGatewayRequest>(
  "CreateResponderGatewayRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/responder-gateway" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLinkRequest extends S.Class<CreateLinkRequest>(
  "CreateLinkRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    peerGatewayId: S.String,
    attributes: S.optional(LinkAttributes),
    httpResponderAllowed: S.optional(S.Boolean),
    tags: S.optional(TagsMap),
    logSettings: LinkLogSettings,
  },
  T.all(
    T.Http({ method: "POST", uri: "/gateway/{gatewayId}/create-link" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResponderGatewayResponse extends S.Class<CreateResponderGatewayResponse>(
  "CreateResponderGatewayResponse",
)({ gatewayId: S.String, status: S.String }) {}
export class CreateLinkResponse extends S.Class<CreateLinkResponse>(
  "CreateLinkResponse",
)({
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
}) {}
export class UpdateLinkModuleFlowRequest extends S.Class<UpdateLinkModuleFlowRequest>(
  "UpdateLinkModuleFlowRequest",
)(
  {
    clientToken: S.String,
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    linkId: S.String.pipe(T.HttpLabel("linkId")),
    modules: ModuleConfigurationList,
  },
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
) {}
export class UpdateLinkModuleFlowResponse extends S.Class<UpdateLinkModuleFlowResponse>(
  "UpdateLinkModuleFlowResponse",
)({ gatewayId: S.String, linkId: S.String, status: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}

//# Operations
/**
 * Lists requester gateways.
 */
export const listRequesterGateways =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listResponderGateways =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createResponderGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists links associated with gateways.
 *
 * Returns a list of all links for the specified gateways, including their status and configuration details.
 */
export const listLinks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRequesterGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRequesterGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRequesterGatewayRequest,
    output: DeleteRequesterGatewayResponse,
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
 * Retrieves information about an outbound external link.
 */
export const getOutboundExternalLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOutboundExternalLinkRequest,
    output: GetOutboundExternalLinkResponse,
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
 * Retrieves information about a responder gateway.
 */
export const getResponderGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteResponderGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResponderGatewayRequest,
    output: DeleteResponderGatewayResponse,
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
 * Retrieves information about an inbound external link.
 */
export const getInboundExternalLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInboundExternalLinkRequest,
    output: GetInboundExternalLinkResponse,
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
 * Lists tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const acceptLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const rejectLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRequesterGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes an outbound external link.
 */
export const deleteOutboundExternalLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates a responder gateway.
 */
export const updateResponderGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes an inbound external link.
 */
export const deleteInboundExternalLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a requester gateway.
 */
export const createRequesterGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an outbound external link.
 */
export const createOutboundExternalLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an inbound external link.
 */
export const createInboundExternalLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a new link between gateways.
 *
 * Establishes a connection that allows gateways to communicate and exchange bid requests and responses.
 */
export const createLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLinkModuleFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);

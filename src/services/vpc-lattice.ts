import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "VPC Lattice",
  serviceShapeName: "MercuryControlPlane",
});
const auth = T.AwsAuthSigv4({ name: "vpc-lattice" });
const ver = T.ServiceVersion("2022-11-30");
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
                                url: "https://vpc-lattice-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://vpc-lattice-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://vpc-lattice.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://vpc-lattice.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const PortRangeList = S.Array(S.String);
export const SubnetList = S.Array(S.String);
export const SecurityGroupList = S.Array(S.String);
export class DeleteAuthPolicyRequest extends S.Class<DeleteAuthPolicyRequest>(
  "DeleteAuthPolicyRequest",
)(
  { resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/authpolicy/{resourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAuthPolicyResponse extends S.Class<DeleteAuthPolicyResponse>(
  "DeleteAuthPolicyResponse",
)({}) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/resourcepolicy/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export class GetAuthPolicyRequest extends S.Class<GetAuthPolicyRequest>(
  "GetAuthPolicyRequest",
)(
  { resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/authpolicy/{resourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/resourcepolicy/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceNetworkVpcEndpointAssociationsRequest extends S.Class<ListServiceNetworkVpcEndpointAssociationsRequest>(
  "ListServiceNetworkVpcEndpointAssociationsRequest",
)(
  {
    serviceNetworkIdentifier: S.String.pipe(
      T.HttpQuery("serviceNetworkIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/servicenetworkvpcendpointassociations" }),
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
export class PutAuthPolicyRequest extends S.Class<PutAuthPolicyRequest>(
  "PutAuthPolicyRequest",
)(
  {
    resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")),
    policy: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/authpolicy/{resourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), policy: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/resourcepolicy/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateAccessLogSubscriptionRequest extends S.Class<CreateAccessLogSubscriptionRequest>(
  "CreateAccessLogSubscriptionRequest",
)(
  {
    clientToken: S.optional(S.String),
    resourceIdentifier: S.String,
    destinationArn: S.String,
    serviceNetworkLogType: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accesslogsubscriptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAccessLogSubscriptionRequest extends S.Class<GetAccessLogSubscriptionRequest>(
  "GetAccessLogSubscriptionRequest",
)(
  {
    accessLogSubscriptionIdentifier: S.String.pipe(
      T.HttpLabel("accessLogSubscriptionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accesslogsubscriptions/{accessLogSubscriptionIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccessLogSubscriptionRequest extends S.Class<UpdateAccessLogSubscriptionRequest>(
  "UpdateAccessLogSubscriptionRequest",
)(
  {
    accessLogSubscriptionIdentifier: S.String.pipe(
      T.HttpLabel("accessLogSubscriptionIdentifier"),
    ),
    destinationArn: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/accesslogsubscriptions/{accessLogSubscriptionIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessLogSubscriptionRequest extends S.Class<DeleteAccessLogSubscriptionRequest>(
  "DeleteAccessLogSubscriptionRequest",
)(
  {
    accessLogSubscriptionIdentifier: S.String.pipe(
      T.HttpLabel("accessLogSubscriptionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accesslogsubscriptions/{accessLogSubscriptionIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessLogSubscriptionResponse extends S.Class<DeleteAccessLogSubscriptionResponse>(
  "DeleteAccessLogSubscriptionResponse",
)({}) {}
export class ListAccessLogSubscriptionsRequest extends S.Class<ListAccessLogSubscriptionsRequest>(
  "ListAccessLogSubscriptionsRequest",
)(
  {
    resourceIdentifier: S.String.pipe(T.HttpQuery("resourceIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accesslogsubscriptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDomainVerificationRequest extends S.Class<StartDomainVerificationRequest>(
  "StartDomainVerificationRequest",
)(
  {
    clientToken: S.optional(S.String),
    domainName: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domainverifications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainVerificationRequest extends S.Class<GetDomainVerificationRequest>(
  "GetDomainVerificationRequest",
)(
  {
    domainVerificationIdentifier: S.String.pipe(
      T.HttpLabel("domainVerificationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/domainverifications/{domainVerificationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainVerificationRequest extends S.Class<DeleteDomainVerificationRequest>(
  "DeleteDomainVerificationRequest",
)(
  {
    domainVerificationIdentifier: S.String.pipe(
      T.HttpLabel("domainVerificationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/domainverifications/{domainVerificationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainVerificationResponse extends S.Class<DeleteDomainVerificationResponse>(
  "DeleteDomainVerificationResponse",
)({}) {}
export class ListDomainVerificationsRequest extends S.Class<ListDomainVerificationsRequest>(
  "ListDomainVerificationsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domainverifications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetListenerRequest extends S.Class<GetListenerRequest>(
  "GetListenerRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    listenerIdentifier: S.String.pipe(T.HttpLabel("listenerIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/services/{serviceIdentifier}/listeners/{listenerIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class WeightedTargetGroup extends S.Class<WeightedTargetGroup>(
  "WeightedTargetGroup",
)({ targetGroupIdentifier: S.String, weight: S.optional(S.Number) }) {}
export const WeightedTargetGroupList = S.Array(WeightedTargetGroup);
export class ForwardAction extends S.Class<ForwardAction>("ForwardAction")({
  targetGroups: WeightedTargetGroupList,
}) {}
export class FixedResponseAction extends S.Class<FixedResponseAction>(
  "FixedResponseAction",
)({ statusCode: S.Number }) {}
export const RuleAction = S.Union(
  S.Struct({ forward: ForwardAction }),
  S.Struct({ fixedResponse: FixedResponseAction }),
);
export class UpdateListenerRequest extends S.Class<UpdateListenerRequest>(
  "UpdateListenerRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    listenerIdentifier: S.String.pipe(T.HttpLabel("listenerIdentifier")),
    defaultAction: RuleAction,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/services/{serviceIdentifier}/listeners/{listenerIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteListenerRequest extends S.Class<DeleteListenerRequest>(
  "DeleteListenerRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    listenerIdentifier: S.String.pipe(T.HttpLabel("listenerIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/services/{serviceIdentifier}/listeners/{listenerIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteListenerResponse extends S.Class<DeleteListenerResponse>(
  "DeleteListenerResponse",
)({}) {}
export class ListListenersRequest extends S.Class<ListListenersRequest>(
  "ListListenersRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/services/{serviceIdentifier}/listeners" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceConfigurationRequest extends S.Class<GetResourceConfigurationRequest>(
  "GetResourceConfigurationRequest",
)(
  {
    resourceConfigurationIdentifier: S.String.pipe(
      T.HttpLabel("resourceConfigurationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/resourceconfigurations/{resourceConfigurationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DnsResource extends S.Class<DnsResource>("DnsResource")({
  domainName: S.optional(S.String),
  ipAddressType: S.optional(S.String),
}) {}
export class IpResource extends S.Class<IpResource>("IpResource")({
  ipAddress: S.optional(S.String),
}) {}
export class ArnResource extends S.Class<ArnResource>("ArnResource")({
  arn: S.optional(S.String),
}) {}
export const ResourceConfigurationDefinition = S.Union(
  S.Struct({ dnsResource: DnsResource }),
  S.Struct({ ipResource: IpResource }),
  S.Struct({ arnResource: ArnResource }),
);
export class UpdateResourceConfigurationRequest extends S.Class<UpdateResourceConfigurationRequest>(
  "UpdateResourceConfigurationRequest",
)(
  {
    resourceConfigurationIdentifier: S.String.pipe(
      T.HttpLabel("resourceConfigurationIdentifier"),
    ),
    resourceConfigurationDefinition: S.optional(
      ResourceConfigurationDefinition,
    ),
    allowAssociationToShareableServiceNetwork: S.optional(S.Boolean),
    portRanges: S.optional(PortRangeList),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/resourceconfigurations/{resourceConfigurationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourceConfigurationRequest extends S.Class<DeleteResourceConfigurationRequest>(
  "DeleteResourceConfigurationRequest",
)(
  {
    resourceConfigurationIdentifier: S.String.pipe(
      T.HttpLabel("resourceConfigurationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/resourceconfigurations/{resourceConfigurationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourceConfigurationResponse extends S.Class<DeleteResourceConfigurationResponse>(
  "DeleteResourceConfigurationResponse",
)({}) {}
export class ListResourceConfigurationsRequest extends S.Class<ListResourceConfigurationsRequest>(
  "ListResourceConfigurationsRequest",
)(
  {
    resourceGatewayIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("resourceGatewayIdentifier"),
    ),
    resourceConfigurationGroupIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("resourceConfigurationGroupIdentifier"),
    ),
    domainVerificationIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("domainVerificationIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resourceconfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourceEndpointAssociationRequest extends S.Class<DeleteResourceEndpointAssociationRequest>(
  "DeleteResourceEndpointAssociationRequest",
)(
  {
    resourceEndpointAssociationIdentifier: S.String.pipe(
      T.HttpLabel("resourceEndpointAssociationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/resourceendpointassociations/{resourceEndpointAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceEndpointAssociationsRequest extends S.Class<ListResourceEndpointAssociationsRequest>(
  "ListResourceEndpointAssociationsRequest",
)(
  {
    resourceConfigurationIdentifier: S.String.pipe(
      T.HttpQuery("resourceConfigurationIdentifier"),
    ),
    resourceEndpointAssociationIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("resourceEndpointAssociationIdentifier"),
    ),
    vpcEndpointId: S.optional(S.String).pipe(T.HttpQuery("vpcEndpointId")),
    vpcEndpointOwner: S.optional(S.String).pipe(
      T.HttpQuery("vpcEndpointOwner"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resourceendpointassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceGatewayRequest extends S.Class<CreateResourceGatewayRequest>(
  "CreateResourceGatewayRequest",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    vpcIdentifier: S.optional(S.String),
    subnetIds: S.optional(SubnetList),
    securityGroupIds: S.optional(SecurityGroupList),
    ipAddressType: S.optional(S.String),
    ipv4AddressesPerEni: S.optional(S.Number),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resourcegateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceGatewayRequest extends S.Class<GetResourceGatewayRequest>(
  "GetResourceGatewayRequest",
)(
  {
    resourceGatewayIdentifier: S.String.pipe(
      T.HttpLabel("resourceGatewayIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/resourcegateways/{resourceGatewayIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResourceGatewayRequest extends S.Class<UpdateResourceGatewayRequest>(
  "UpdateResourceGatewayRequest",
)(
  {
    resourceGatewayIdentifier: S.String.pipe(
      T.HttpLabel("resourceGatewayIdentifier"),
    ),
    securityGroupIds: S.optional(SecurityGroupList),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/resourcegateways/{resourceGatewayIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourceGatewayRequest extends S.Class<DeleteResourceGatewayRequest>(
  "DeleteResourceGatewayRequest",
)(
  {
    resourceGatewayIdentifier: S.String.pipe(
      T.HttpLabel("resourceGatewayIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/resourcegateways/{resourceGatewayIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceGatewaysRequest extends S.Class<ListResourceGatewaysRequest>(
  "ListResourceGatewaysRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resourcegateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRuleRequest extends S.Class<GetRuleRequest>("GetRuleRequest")(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    listenerIdentifier: S.String.pipe(T.HttpLabel("listenerIdentifier")),
    ruleIdentifier: S.String.pipe(T.HttpLabel("ruleIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/services/{serviceIdentifier}/listeners/{listenerIdentifier}/rules/{ruleIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PathMatchType = S.Union(
  S.Struct({ exact: S.String }),
  S.Struct({ prefix: S.String }),
);
export class PathMatch extends S.Class<PathMatch>("PathMatch")({
  match: PathMatchType,
  caseSensitive: S.optional(S.Boolean),
}) {}
export const HeaderMatchType = S.Union(
  S.Struct({ exact: S.String }),
  S.Struct({ prefix: S.String }),
  S.Struct({ contains: S.String }),
);
export class HeaderMatch extends S.Class<HeaderMatch>("HeaderMatch")({
  name: S.String,
  match: HeaderMatchType,
  caseSensitive: S.optional(S.Boolean),
}) {}
export const HeaderMatchList = S.Array(HeaderMatch);
export class HttpMatch extends S.Class<HttpMatch>("HttpMatch")({
  method: S.optional(S.String),
  pathMatch: S.optional(PathMatch),
  headerMatches: S.optional(HeaderMatchList),
}) {}
export const RuleMatch = S.Union(S.Struct({ httpMatch: HttpMatch }));
export class UpdateRuleRequest extends S.Class<UpdateRuleRequest>(
  "UpdateRuleRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    listenerIdentifier: S.String.pipe(T.HttpLabel("listenerIdentifier")),
    ruleIdentifier: S.String.pipe(T.HttpLabel("ruleIdentifier")),
    match: S.optional(RuleMatch),
    priority: S.optional(S.Number),
    action: S.optional(RuleAction),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/services/{serviceIdentifier}/listeners/{listenerIdentifier}/rules/{ruleIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRuleRequest extends S.Class<DeleteRuleRequest>(
  "DeleteRuleRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    listenerIdentifier: S.String.pipe(T.HttpLabel("listenerIdentifier")),
    ruleIdentifier: S.String.pipe(T.HttpLabel("ruleIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/services/{serviceIdentifier}/listeners/{listenerIdentifier}/rules/{ruleIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRuleResponse extends S.Class<DeleteRuleResponse>(
  "DeleteRuleResponse",
)({}) {}
export class ListRulesRequest extends S.Class<ListRulesRequest>(
  "ListRulesRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    listenerIdentifier: S.String.pipe(T.HttpLabel("listenerIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/services/{serviceIdentifier}/listeners/{listenerIdentifier}/rules",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateServiceRequest extends S.Class<CreateServiceRequest>(
  "CreateServiceRequest",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    tags: S.optional(TagMap),
    customDomainName: S.optional(S.String),
    certificateArn: S.optional(S.String),
    authType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/services" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceRequest extends S.Class<GetServiceRequest>(
  "GetServiceRequest",
)(
  { serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/services/{serviceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateServiceRequest extends S.Class<UpdateServiceRequest>(
  "UpdateServiceRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    certificateArn: S.optional(S.String),
    authType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/services/{serviceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServiceRequest extends S.Class<DeleteServiceRequest>(
  "DeleteServiceRequest",
)(
  { serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/services/{serviceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServicesRequest extends S.Class<ListServicesRequest>(
  "ListServicesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/services" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceNetworkRequest extends S.Class<GetServiceNetworkRequest>(
  "GetServiceNetworkRequest",
)(
  {
    serviceNetworkIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/servicenetworks/{serviceNetworkIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateServiceNetworkRequest extends S.Class<UpdateServiceNetworkRequest>(
  "UpdateServiceNetworkRequest",
)(
  {
    serviceNetworkIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkIdentifier"),
    ),
    authType: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/servicenetworks/{serviceNetworkIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServiceNetworkRequest extends S.Class<DeleteServiceNetworkRequest>(
  "DeleteServiceNetworkRequest",
)(
  {
    serviceNetworkIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/servicenetworks/{serviceNetworkIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServiceNetworkResponse extends S.Class<DeleteServiceNetworkResponse>(
  "DeleteServiceNetworkResponse",
)({}) {}
export class ListServiceNetworksRequest extends S.Class<ListServiceNetworksRequest>(
  "ListServiceNetworksRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/servicenetworks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateServiceNetworkResourceAssociationRequest extends S.Class<CreateServiceNetworkResourceAssociationRequest>(
  "CreateServiceNetworkResourceAssociationRequest",
)(
  {
    clientToken: S.optional(S.String),
    resourceConfigurationIdentifier: S.String,
    serviceNetworkIdentifier: S.String,
    privateDnsEnabled: S.optional(S.Boolean),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/servicenetworkresourceassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceNetworkResourceAssociationRequest extends S.Class<GetServiceNetworkResourceAssociationRequest>(
  "GetServiceNetworkResourceAssociationRequest",
)(
  {
    serviceNetworkResourceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkResourceAssociationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/servicenetworkresourceassociations/{serviceNetworkResourceAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServiceNetworkResourceAssociationRequest extends S.Class<DeleteServiceNetworkResourceAssociationRequest>(
  "DeleteServiceNetworkResourceAssociationRequest",
)(
  {
    serviceNetworkResourceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkResourceAssociationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/servicenetworkresourceassociations/{serviceNetworkResourceAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceNetworkResourceAssociationsRequest extends S.Class<ListServiceNetworkResourceAssociationsRequest>(
  "ListServiceNetworkResourceAssociationsRequest",
)(
  {
    serviceNetworkIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("serviceNetworkIdentifier"),
    ),
    resourceConfigurationIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("resourceConfigurationIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    includeChildren: S.optional(S.Boolean).pipe(T.HttpQuery("includeChildren")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/servicenetworkresourceassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateServiceNetworkServiceAssociationRequest extends S.Class<CreateServiceNetworkServiceAssociationRequest>(
  "CreateServiceNetworkServiceAssociationRequest",
)(
  {
    clientToken: S.optional(S.String),
    serviceIdentifier: S.String,
    serviceNetworkIdentifier: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/servicenetworkserviceassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceNetworkServiceAssociationRequest extends S.Class<GetServiceNetworkServiceAssociationRequest>(
  "GetServiceNetworkServiceAssociationRequest",
)(
  {
    serviceNetworkServiceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkServiceAssociationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/servicenetworkserviceassociations/{serviceNetworkServiceAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServiceNetworkServiceAssociationRequest extends S.Class<DeleteServiceNetworkServiceAssociationRequest>(
  "DeleteServiceNetworkServiceAssociationRequest",
)(
  {
    serviceNetworkServiceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkServiceAssociationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/servicenetworkserviceassociations/{serviceNetworkServiceAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceNetworkServiceAssociationsRequest extends S.Class<ListServiceNetworkServiceAssociationsRequest>(
  "ListServiceNetworkServiceAssociationsRequest",
)(
  {
    serviceNetworkIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("serviceNetworkIdentifier"),
    ),
    serviceIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("serviceIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/servicenetworkserviceassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceNetworkVpcAssociationRequest extends S.Class<GetServiceNetworkVpcAssociationRequest>(
  "GetServiceNetworkVpcAssociationRequest",
)(
  {
    serviceNetworkVpcAssociationIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkVpcAssociationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/servicenetworkvpcassociations/{serviceNetworkVpcAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateServiceNetworkVpcAssociationRequest extends S.Class<UpdateServiceNetworkVpcAssociationRequest>(
  "UpdateServiceNetworkVpcAssociationRequest",
)(
  {
    serviceNetworkVpcAssociationIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkVpcAssociationIdentifier"),
    ),
    securityGroupIds: SecurityGroupList,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/servicenetworkvpcassociations/{serviceNetworkVpcAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServiceNetworkVpcAssociationRequest extends S.Class<DeleteServiceNetworkVpcAssociationRequest>(
  "DeleteServiceNetworkVpcAssociationRequest",
)(
  {
    serviceNetworkVpcAssociationIdentifier: S.String.pipe(
      T.HttpLabel("serviceNetworkVpcAssociationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/servicenetworkvpcassociations/{serviceNetworkVpcAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceNetworkVpcAssociationsRequest extends S.Class<ListServiceNetworkVpcAssociationsRequest>(
  "ListServiceNetworkVpcAssociationsRequest",
)(
  {
    serviceNetworkIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("serviceNetworkIdentifier"),
    ),
    vpcIdentifier: S.optional(S.String).pipe(T.HttpQuery("vpcIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/servicenetworkvpcassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTargetGroupRequest extends S.Class<GetTargetGroupRequest>(
  "GetTargetGroupRequest",
)(
  {
    targetGroupIdentifier: S.String.pipe(T.HttpLabel("targetGroupIdentifier")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/targetgroups/{targetGroupIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTargetGroupRequest extends S.Class<DeleteTargetGroupRequest>(
  "DeleteTargetGroupRequest",
)(
  {
    targetGroupIdentifier: S.String.pipe(T.HttpLabel("targetGroupIdentifier")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/targetgroups/{targetGroupIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTargetGroupsRequest extends S.Class<ListTargetGroupsRequest>(
  "ListTargetGroupsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    vpcIdentifier: S.optional(S.String).pipe(T.HttpQuery("vpcIdentifier")),
    targetGroupType: S.optional(S.String).pipe(T.HttpQuery("targetGroupType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/targetgroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Target extends S.Class<Target>("Target")({
  id: S.String,
  port: S.optional(S.Number),
}) {}
export const TargetList = S.Array(Target);
export class ListTargetsRequest extends S.Class<ListTargetsRequest>(
  "ListTargetsRequest",
)(
  {
    targetGroupIdentifier: S.String.pipe(T.HttpLabel("targetGroupIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    targets: S.optional(TargetList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/targetgroups/{targetGroupIdentifier}/listtargets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterTargetsRequest extends S.Class<RegisterTargetsRequest>(
  "RegisterTargetsRequest",
)(
  {
    targetGroupIdentifier: S.String.pipe(T.HttpLabel("targetGroupIdentifier")),
    targets: TargetList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/targetgroups/{targetGroupIdentifier}/registertargets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PrivateDnsSpecifiedDomainsList = S.Array(S.String);
export class RuleUpdate extends S.Class<RuleUpdate>("RuleUpdate")({
  ruleIdentifier: S.String,
  match: S.optional(RuleMatch),
  priority: S.optional(S.Number),
  action: S.optional(RuleAction),
}) {}
export const RuleUpdateList = S.Array(RuleUpdate);
export class SharingConfig extends S.Class<SharingConfig>("SharingConfig")({
  enabled: S.optional(S.Boolean),
}) {}
export class DnsOptions extends S.Class<DnsOptions>("DnsOptions")({
  privateDnsPreference: S.optional(S.String),
  privateDnsSpecifiedDomains: S.optional(PrivateDnsSpecifiedDomainsList),
}) {}
export const Matcher = S.Union(S.Struct({ httpCode: S.String }));
export class HealthCheckConfig extends S.Class<HealthCheckConfig>(
  "HealthCheckConfig",
)({
  enabled: S.optional(S.Boolean),
  protocol: S.optional(S.String),
  protocolVersion: S.optional(S.String),
  port: S.optional(S.Number),
  path: S.optional(S.String),
  healthCheckIntervalSeconds: S.optional(S.Number),
  healthCheckTimeoutSeconds: S.optional(S.Number),
  healthyThresholdCount: S.optional(S.Number),
  unhealthyThresholdCount: S.optional(S.Number),
  matcher: S.optional(Matcher),
}) {}
export class TargetGroupConfig extends S.Class<TargetGroupConfig>(
  "TargetGroupConfig",
)({
  port: S.optional(S.Number),
  protocol: S.optional(S.String),
  protocolVersion: S.optional(S.String),
  ipAddressType: S.optional(S.String),
  vpcIdentifier: S.optional(S.String),
  healthCheck: S.optional(HealthCheckConfig),
  lambdaEventStructureVersion: S.optional(S.String),
}) {}
export const ServiceArnList = S.Array(S.String);
export class BatchUpdateRuleRequest extends S.Class<BatchUpdateRuleRequest>(
  "BatchUpdateRuleRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    listenerIdentifier: S.String.pipe(T.HttpLabel("listenerIdentifier")),
    rules: RuleUpdateList,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/services/{serviceIdentifier}/listeners/{listenerIdentifier}/rules",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAuthPolicyResponse extends S.Class<GetAuthPolicyResponse>(
  "GetAuthPolicyResponse",
)({
  policy: S.optional(S.String),
  state: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ policy: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class PutAuthPolicyResponse extends S.Class<PutAuthPolicyResponse>(
  "PutAuthPolicyResponse",
)({ policy: S.optional(S.String), state: S.optional(S.String) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
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
export class CreateAccessLogSubscriptionResponse extends S.Class<CreateAccessLogSubscriptionResponse>(
  "CreateAccessLogSubscriptionResponse",
)({
  id: S.String,
  arn: S.String,
  resourceId: S.String,
  resourceArn: S.String,
  serviceNetworkLogType: S.optional(S.String),
  destinationArn: S.String,
}) {}
export class GetAccessLogSubscriptionResponse extends S.Class<GetAccessLogSubscriptionResponse>(
  "GetAccessLogSubscriptionResponse",
)({
  id: S.String,
  arn: S.String,
  resourceId: S.String,
  resourceArn: S.String,
  destinationArn: S.String,
  serviceNetworkLogType: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class UpdateAccessLogSubscriptionResponse extends S.Class<UpdateAccessLogSubscriptionResponse>(
  "UpdateAccessLogSubscriptionResponse",
)({
  id: S.String,
  arn: S.String,
  resourceId: S.String,
  resourceArn: S.String,
  destinationArn: S.String,
}) {}
export class TxtMethodConfig extends S.Class<TxtMethodConfig>(
  "TxtMethodConfig",
)({ value: S.String, name: S.String }) {}
export class GetDomainVerificationResponse extends S.Class<GetDomainVerificationResponse>(
  "GetDomainVerificationResponse",
)({
  id: S.String,
  arn: S.String,
  domainName: S.String,
  status: S.String,
  txtMethodConfig: S.optional(TxtMethodConfig),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastVerifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(TagMap),
}) {}
export class GetListenerResponse extends S.Class<GetListenerResponse>(
  "GetListenerResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  protocol: S.optional(S.String),
  port: S.optional(S.Number),
  serviceArn: S.optional(S.String),
  serviceId: S.optional(S.String),
  defaultAction: S.optional(RuleAction),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateListenerResponse extends S.Class<UpdateListenerResponse>(
  "UpdateListenerResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  protocol: S.optional(S.String),
  port: S.optional(S.Number),
  serviceArn: S.optional(S.String),
  serviceId: S.optional(S.String),
  defaultAction: S.optional(RuleAction),
}) {}
export class GetResourceConfigurationResponse extends S.Class<GetResourceConfigurationResponse>(
  "GetResourceConfigurationResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  resourceGatewayId: S.optional(S.String),
  resourceConfigurationGroupId: S.optional(S.String),
  type: S.optional(S.String),
  allowAssociationToShareableServiceNetwork: S.optional(S.Boolean),
  portRanges: S.optional(PortRangeList),
  protocol: S.optional(S.String),
  customDomainName: S.optional(S.String),
  status: S.optional(S.String),
  resourceConfigurationDefinition: S.optional(ResourceConfigurationDefinition),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  amazonManaged: S.optional(S.Boolean),
  failureReason: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  domainVerificationId: S.optional(S.String),
  domainVerificationArn: S.optional(S.String),
  domainVerificationStatus: S.optional(S.String),
  groupDomain: S.optional(S.String),
}) {}
export class UpdateResourceConfigurationResponse extends S.Class<UpdateResourceConfigurationResponse>(
  "UpdateResourceConfigurationResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  resourceGatewayId: S.optional(S.String),
  resourceConfigurationGroupId: S.optional(S.String),
  type: S.optional(S.String),
  portRanges: S.optional(PortRangeList),
  allowAssociationToShareableServiceNetwork: S.optional(S.Boolean),
  protocol: S.optional(S.String),
  status: S.optional(S.String),
  resourceConfigurationDefinition: S.optional(ResourceConfigurationDefinition),
}) {}
export class DeleteResourceEndpointAssociationResponse extends S.Class<DeleteResourceEndpointAssociationResponse>(
  "DeleteResourceEndpointAssociationResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  resourceConfigurationId: S.optional(S.String),
  resourceConfigurationArn: S.optional(S.String),
  vpcEndpointId: S.optional(S.String),
}) {}
export class CreateResourceGatewayResponse extends S.Class<CreateResourceGatewayResponse>(
  "CreateResourceGatewayResponse",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  vpcIdentifier: S.optional(S.String),
  subnetIds: S.optional(SubnetList),
  securityGroupIds: S.optional(SecurityGroupList),
  ipAddressType: S.optional(S.String),
  ipv4AddressesPerEni: S.optional(S.Number),
}) {}
export class GetResourceGatewayResponse extends S.Class<GetResourceGatewayResponse>(
  "GetResourceGatewayResponse",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  vpcId: S.optional(S.String),
  subnetIds: S.optional(SubnetList),
  securityGroupIds: S.optional(SecurityGroupList),
  ipAddressType: S.optional(S.String),
  ipv4AddressesPerEni: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateResourceGatewayResponse extends S.Class<UpdateResourceGatewayResponse>(
  "UpdateResourceGatewayResponse",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  vpcId: S.optional(S.String),
  subnetIds: S.optional(SubnetList),
  securityGroupIds: S.optional(SecurityGroupList),
  ipAddressType: S.optional(S.String),
}) {}
export class DeleteResourceGatewayResponse extends S.Class<DeleteResourceGatewayResponse>(
  "DeleteResourceGatewayResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class GetRuleResponse extends S.Class<GetRuleResponse>(
  "GetRuleResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  isDefault: S.optional(S.Boolean),
  match: S.optional(RuleMatch),
  priority: S.optional(S.Number),
  action: S.optional(RuleAction),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateRuleResponse extends S.Class<UpdateRuleResponse>(
  "UpdateRuleResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  isDefault: S.optional(S.Boolean),
  match: S.optional(RuleMatch),
  priority: S.optional(S.Number),
  action: S.optional(RuleAction),
}) {}
export class DnsEntry extends S.Class<DnsEntry>("DnsEntry")({
  domainName: S.optional(S.String),
  hostedZoneId: S.optional(S.String),
}) {}
export class GetServiceResponse extends S.Class<GetServiceResponse>(
  "GetServiceResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  dnsEntry: S.optional(DnsEntry),
  customDomainName: S.optional(S.String),
  certificateArn: S.optional(S.String),
  status: S.optional(S.String),
  authType: S.optional(S.String),
  failureCode: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export class UpdateServiceResponse extends S.Class<UpdateServiceResponse>(
  "UpdateServiceResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  customDomainName: S.optional(S.String),
  certificateArn: S.optional(S.String),
  authType: S.optional(S.String),
}) {}
export class DeleteServiceResponse extends S.Class<DeleteServiceResponse>(
  "DeleteServiceResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class CreateServiceNetworkRequest extends S.Class<CreateServiceNetworkRequest>(
  "CreateServiceNetworkRequest",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    authType: S.optional(S.String),
    tags: S.optional(TagMap),
    sharingConfig: S.optional(SharingConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/servicenetworks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceNetworkResponse extends S.Class<GetServiceNetworkResponse>(
  "GetServiceNetworkResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  arn: S.optional(S.String),
  authType: S.optional(S.String),
  sharingConfig: S.optional(SharingConfig),
  numberOfAssociatedVPCs: S.optional(S.Number),
  numberOfAssociatedServices: S.optional(S.Number),
}) {}
export class UpdateServiceNetworkResponse extends S.Class<UpdateServiceNetworkResponse>(
  "UpdateServiceNetworkResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  authType: S.optional(S.String),
}) {}
export class CreateServiceNetworkResourceAssociationResponse extends S.Class<CreateServiceNetworkResourceAssociationResponse>(
  "CreateServiceNetworkResourceAssociationResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  createdBy: S.optional(S.String),
  privateDnsEnabled: S.optional(S.Boolean),
}) {}
export class GetServiceNetworkResourceAssociationResponse extends S.Class<GetServiceNetworkResourceAssociationResponse>(
  "GetServiceNetworkResourceAssociationResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  resourceConfigurationId: S.optional(S.String),
  resourceConfigurationArn: S.optional(S.String),
  resourceConfigurationName: S.optional(S.String),
  serviceNetworkId: S.optional(S.String),
  serviceNetworkArn: S.optional(S.String),
  serviceNetworkName: S.optional(S.String),
  failureReason: S.optional(S.String),
  failureCode: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  privateDnsEntry: S.optional(DnsEntry),
  privateDnsEnabled: S.optional(S.Boolean),
  dnsEntry: S.optional(DnsEntry),
  isManagedAssociation: S.optional(S.Boolean),
  domainVerificationStatus: S.optional(S.String),
}) {}
export class DeleteServiceNetworkResourceAssociationResponse extends S.Class<DeleteServiceNetworkResourceAssociationResponse>(
  "DeleteServiceNetworkResourceAssociationResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class CreateServiceNetworkServiceAssociationResponse extends S.Class<CreateServiceNetworkServiceAssociationResponse>(
  "CreateServiceNetworkServiceAssociationResponse",
)({
  id: S.optional(S.String),
  status: S.optional(S.String),
  arn: S.optional(S.String),
  createdBy: S.optional(S.String),
  customDomainName: S.optional(S.String),
  dnsEntry: S.optional(DnsEntry),
}) {}
export class GetServiceNetworkServiceAssociationResponse extends S.Class<GetServiceNetworkServiceAssociationResponse>(
  "GetServiceNetworkServiceAssociationResponse",
)({
  id: S.optional(S.String),
  status: S.optional(S.String),
  arn: S.optional(S.String),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  serviceId: S.optional(S.String),
  serviceName: S.optional(S.String),
  serviceArn: S.optional(S.String),
  serviceNetworkId: S.optional(S.String),
  serviceNetworkName: S.optional(S.String),
  serviceNetworkArn: S.optional(S.String),
  dnsEntry: S.optional(DnsEntry),
  customDomainName: S.optional(S.String),
  failureMessage: S.optional(S.String),
  failureCode: S.optional(S.String),
}) {}
export class DeleteServiceNetworkServiceAssociationResponse extends S.Class<DeleteServiceNetworkServiceAssociationResponse>(
  "DeleteServiceNetworkServiceAssociationResponse",
)({
  id: S.optional(S.String),
  status: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export class CreateServiceNetworkVpcAssociationRequest extends S.Class<CreateServiceNetworkVpcAssociationRequest>(
  "CreateServiceNetworkVpcAssociationRequest",
)(
  {
    clientToken: S.optional(S.String),
    serviceNetworkIdentifier: S.String,
    vpcIdentifier: S.String,
    privateDnsEnabled: S.optional(S.Boolean),
    securityGroupIds: S.optional(SecurityGroupList),
    tags: S.optional(TagMap),
    dnsOptions: S.optional(DnsOptions),
  },
  T.all(
    T.Http({ method: "POST", uri: "/servicenetworkvpcassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceNetworkVpcAssociationResponse extends S.Class<GetServiceNetworkVpcAssociationResponse>(
  "GetServiceNetworkVpcAssociationResponse",
)({
  id: S.optional(S.String),
  status: S.optional(S.String),
  arn: S.optional(S.String),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  serviceNetworkId: S.optional(S.String),
  serviceNetworkName: S.optional(S.String),
  serviceNetworkArn: S.optional(S.String),
  vpcId: S.optional(S.String),
  securityGroupIds: S.optional(SecurityGroupList),
  privateDnsEnabled: S.optional(S.Boolean),
  failureMessage: S.optional(S.String),
  failureCode: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  dnsOptions: S.optional(DnsOptions),
}) {}
export class UpdateServiceNetworkVpcAssociationResponse extends S.Class<UpdateServiceNetworkVpcAssociationResponse>(
  "UpdateServiceNetworkVpcAssociationResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  createdBy: S.optional(S.String),
  securityGroupIds: S.optional(SecurityGroupList),
}) {}
export class DeleteServiceNetworkVpcAssociationResponse extends S.Class<DeleteServiceNetworkVpcAssociationResponse>(
  "DeleteServiceNetworkVpcAssociationResponse",
)({
  id: S.optional(S.String),
  status: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export class CreateTargetGroupRequest extends S.Class<CreateTargetGroupRequest>(
  "CreateTargetGroupRequest",
)(
  {
    name: S.String,
    type: S.String,
    config: S.optional(TargetGroupConfig),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/targetgroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTargetGroupResponse extends S.Class<GetTargetGroupResponse>(
  "GetTargetGroupResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  config: S.optional(TargetGroupConfig),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  status: S.optional(S.String),
  serviceArns: S.optional(ServiceArnList),
  failureMessage: S.optional(S.String),
  failureCode: S.optional(S.String),
}) {}
export class DeleteTargetGroupResponse extends S.Class<DeleteTargetGroupResponse>(
  "DeleteTargetGroupResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class DeregisterTargetsRequest extends S.Class<DeregisterTargetsRequest>(
  "DeregisterTargetsRequest",
)(
  {
    targetGroupIdentifier: S.String.pipe(T.HttpLabel("targetGroupIdentifier")),
    targets: TargetList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/targetgroups/{targetGroupIdentifier}/deregistertargets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ServiceNetworkEndpointAssociation extends S.Class<ServiceNetworkEndpointAssociation>(
  "ServiceNetworkEndpointAssociation",
)({
  vpcEndpointId: S.optional(S.String),
  vpcId: S.optional(S.String),
  vpcEndpointOwnerId: S.optional(S.String),
  id: S.optional(S.String),
  state: S.optional(S.String),
  serviceNetworkArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ServiceNetworkVpcEndpointAssociationList = S.Array(
  ServiceNetworkEndpointAssociation,
);
export class AccessLogSubscriptionSummary extends S.Class<AccessLogSubscriptionSummary>(
  "AccessLogSubscriptionSummary",
)({
  id: S.String,
  arn: S.String,
  resourceId: S.String,
  resourceArn: S.String,
  destinationArn: S.String,
  serviceNetworkLogType: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AccessLogSubscriptionList = S.Array(AccessLogSubscriptionSummary);
export class DomainVerificationSummary extends S.Class<DomainVerificationSummary>(
  "DomainVerificationSummary",
)({
  id: S.String,
  arn: S.String,
  domainName: S.String,
  status: S.String,
  txtMethodConfig: S.optional(TxtMethodConfig),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastVerifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(TagMap),
}) {}
export const DomainVerificationList = S.Array(DomainVerificationSummary);
export class ListenerSummary extends S.Class<ListenerSummary>(
  "ListenerSummary",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  protocol: S.optional(S.String),
  port: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ListenerSummaryList = S.Array(ListenerSummary);
export class ResourceConfigurationSummary extends S.Class<ResourceConfigurationSummary>(
  "ResourceConfigurationSummary",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  resourceGatewayId: S.optional(S.String),
  resourceConfigurationGroupId: S.optional(S.String),
  type: S.optional(S.String),
  status: S.optional(S.String),
  amazonManaged: S.optional(S.Boolean),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  customDomainName: S.optional(S.String),
  domainVerificationId: S.optional(S.String),
  groupDomain: S.optional(S.String),
}) {}
export const ResourceConfigurationSummaryList = S.Array(
  ResourceConfigurationSummary,
);
export class ResourceEndpointAssociationSummary extends S.Class<ResourceEndpointAssociationSummary>(
  "ResourceEndpointAssociationSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  resourceConfigurationId: S.optional(S.String),
  resourceConfigurationArn: S.optional(S.String),
  resourceConfigurationName: S.optional(S.String),
  vpcEndpointId: S.optional(S.String),
  vpcEndpointOwner: S.optional(S.String),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ResourceEndpointAssociationList = S.Array(
  ResourceEndpointAssociationSummary,
);
export class ResourceGatewaySummary extends S.Class<ResourceGatewaySummary>(
  "ResourceGatewaySummary",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  vpcIdentifier: S.optional(S.String),
  subnetIds: S.optional(SubnetList),
  securityGroupIds: S.optional(SecurityGroupList),
  ipAddressType: S.optional(S.String),
  ipv4AddressesPerEni: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ResourceGatewayList = S.Array(ResourceGatewaySummary);
export class RuleSummary extends S.Class<RuleSummary>("RuleSummary")({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  isDefault: S.optional(S.Boolean),
  priority: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const RuleSummaryList = S.Array(RuleSummary);
export class ServiceSummary extends S.Class<ServiceSummary>("ServiceSummary")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  dnsEntry: S.optional(DnsEntry),
  customDomainName: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export const ServiceList = S.Array(ServiceSummary);
export class ServiceNetworkSummary extends S.Class<ServiceNetworkSummary>(
  "ServiceNetworkSummary",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  numberOfAssociatedVPCs: S.optional(S.Number),
  numberOfAssociatedServices: S.optional(S.Number),
  numberOfAssociatedResourceConfigurations: S.optional(S.Number),
}) {}
export const ServiceNetworkList = S.Array(ServiceNetworkSummary);
export class ServiceNetworkResourceAssociationSummary extends S.Class<ServiceNetworkResourceAssociationSummary>(
  "ServiceNetworkResourceAssociationSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  resourceConfigurationId: S.optional(S.String),
  resourceConfigurationArn: S.optional(S.String),
  resourceConfigurationName: S.optional(S.String),
  serviceNetworkId: S.optional(S.String),
  serviceNetworkArn: S.optional(S.String),
  serviceNetworkName: S.optional(S.String),
  dnsEntry: S.optional(DnsEntry),
  privateDnsEntry: S.optional(DnsEntry),
  isManagedAssociation: S.optional(S.Boolean),
  failureCode: S.optional(S.String),
  privateDnsEnabled: S.optional(S.Boolean),
}) {}
export const ServiceNetworkResourceAssociationList = S.Array(
  ServiceNetworkResourceAssociationSummary,
);
export class ServiceNetworkServiceAssociationSummary extends S.Class<ServiceNetworkServiceAssociationSummary>(
  "ServiceNetworkServiceAssociationSummary",
)({
  id: S.optional(S.String),
  status: S.optional(S.String),
  arn: S.optional(S.String),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  serviceId: S.optional(S.String),
  serviceName: S.optional(S.String),
  serviceArn: S.optional(S.String),
  serviceNetworkId: S.optional(S.String),
  serviceNetworkName: S.optional(S.String),
  serviceNetworkArn: S.optional(S.String),
  dnsEntry: S.optional(DnsEntry),
  customDomainName: S.optional(S.String),
}) {}
export const ServiceNetworkServiceAssociationList = S.Array(
  ServiceNetworkServiceAssociationSummary,
);
export class ServiceNetworkVpcAssociationSummary extends S.Class<ServiceNetworkVpcAssociationSummary>(
  "ServiceNetworkVpcAssociationSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  serviceNetworkId: S.optional(S.String),
  serviceNetworkName: S.optional(S.String),
  serviceNetworkArn: S.optional(S.String),
  privateDnsEnabled: S.optional(S.Boolean),
  dnsOptions: S.optional(DnsOptions),
  vpcId: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ServiceNetworkVpcAssociationList = S.Array(
  ServiceNetworkVpcAssociationSummary,
);
export class TargetGroupSummary extends S.Class<TargetGroupSummary>(
  "TargetGroupSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  port: S.optional(S.Number),
  protocol: S.optional(S.String),
  ipAddressType: S.optional(S.String),
  vpcIdentifier: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  status: S.optional(S.String),
  serviceArns: S.optional(ServiceArnList),
  lambdaEventStructureVersion: S.optional(S.String),
}) {}
export const TargetGroupList = S.Array(TargetGroupSummary);
export class TargetSummary extends S.Class<TargetSummary>("TargetSummary")({
  id: S.optional(S.String),
  port: S.optional(S.Number),
  status: S.optional(S.String),
  reasonCode: S.optional(S.String),
}) {}
export const TargetSummaryList = S.Array(TargetSummary);
export class TargetFailure extends S.Class<TargetFailure>("TargetFailure")({
  id: S.optional(S.String),
  port: S.optional(S.Number),
  failureCode: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export const TargetFailureList = S.Array(TargetFailure);
export class ListServiceNetworkVpcEndpointAssociationsResponse extends S.Class<ListServiceNetworkVpcEndpointAssociationsResponse>(
  "ListServiceNetworkVpcEndpointAssociationsResponse",
)({
  items: ServiceNetworkVpcEndpointAssociationList,
  nextToken: S.optional(S.String),
}) {}
export class ListAccessLogSubscriptionsResponse extends S.Class<ListAccessLogSubscriptionsResponse>(
  "ListAccessLogSubscriptionsResponse",
)({ items: AccessLogSubscriptionList, nextToken: S.optional(S.String) }) {}
export class StartDomainVerificationResponse extends S.Class<StartDomainVerificationResponse>(
  "StartDomainVerificationResponse",
)({
  id: S.String,
  arn: S.String,
  domainName: S.String,
  status: S.String,
  txtMethodConfig: S.optional(TxtMethodConfig),
}) {}
export class ListDomainVerificationsResponse extends S.Class<ListDomainVerificationsResponse>(
  "ListDomainVerificationsResponse",
)({ items: DomainVerificationList, nextToken: S.optional(S.String) }) {}
export class ListListenersResponse extends S.Class<ListListenersResponse>(
  "ListListenersResponse",
)({ items: ListenerSummaryList, nextToken: S.optional(S.String) }) {}
export class CreateResourceConfigurationRequest extends S.Class<CreateResourceConfigurationRequest>(
  "CreateResourceConfigurationRequest",
)(
  {
    name: S.String,
    type: S.String,
    portRanges: S.optional(PortRangeList),
    protocol: S.optional(S.String),
    resourceGatewayIdentifier: S.optional(S.String),
    resourceConfigurationGroupIdentifier: S.optional(S.String),
    resourceConfigurationDefinition: S.optional(
      ResourceConfigurationDefinition,
    ),
    allowAssociationToShareableServiceNetwork: S.optional(S.Boolean),
    customDomainName: S.optional(S.String),
    groupDomain: S.optional(S.String),
    domainVerificationIdentifier: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resourceconfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceConfigurationsResponse extends S.Class<ListResourceConfigurationsResponse>(
  "ListResourceConfigurationsResponse",
)({
  items: S.optional(ResourceConfigurationSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListResourceEndpointAssociationsResponse extends S.Class<ListResourceEndpointAssociationsResponse>(
  "ListResourceEndpointAssociationsResponse",
)({
  items: ResourceEndpointAssociationList,
  nextToken: S.optional(S.String),
}) {}
export class ListResourceGatewaysResponse extends S.Class<ListResourceGatewaysResponse>(
  "ListResourceGatewaysResponse",
)({
  items: S.optional(ResourceGatewayList),
  nextToken: S.optional(S.String),
}) {}
export class ListRulesResponse extends S.Class<ListRulesResponse>(
  "ListRulesResponse",
)({ items: RuleSummaryList, nextToken: S.optional(S.String) }) {}
export class CreateServiceResponse extends S.Class<CreateServiceResponse>(
  "CreateServiceResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  customDomainName: S.optional(S.String),
  certificateArn: S.optional(S.String),
  status: S.optional(S.String),
  authType: S.optional(S.String),
  dnsEntry: S.optional(DnsEntry),
}) {}
export class ListServicesResponse extends S.Class<ListServicesResponse>(
  "ListServicesResponse",
)({ items: S.optional(ServiceList), nextToken: S.optional(S.String) }) {}
export class CreateServiceNetworkResponse extends S.Class<CreateServiceNetworkResponse>(
  "CreateServiceNetworkResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  sharingConfig: S.optional(SharingConfig),
  authType: S.optional(S.String),
}) {}
export class ListServiceNetworksResponse extends S.Class<ListServiceNetworksResponse>(
  "ListServiceNetworksResponse",
)({ items: ServiceNetworkList, nextToken: S.optional(S.String) }) {}
export class ListServiceNetworkResourceAssociationsResponse extends S.Class<ListServiceNetworkResourceAssociationsResponse>(
  "ListServiceNetworkResourceAssociationsResponse",
)({
  items: ServiceNetworkResourceAssociationList,
  nextToken: S.optional(S.String),
}) {}
export class ListServiceNetworkServiceAssociationsResponse extends S.Class<ListServiceNetworkServiceAssociationsResponse>(
  "ListServiceNetworkServiceAssociationsResponse",
)({
  items: ServiceNetworkServiceAssociationList,
  nextToken: S.optional(S.String),
}) {}
export class CreateServiceNetworkVpcAssociationResponse extends S.Class<CreateServiceNetworkVpcAssociationResponse>(
  "CreateServiceNetworkVpcAssociationResponse",
)({
  id: S.optional(S.String),
  status: S.optional(S.String),
  arn: S.optional(S.String),
  createdBy: S.optional(S.String),
  securityGroupIds: S.optional(SecurityGroupList),
  privateDnsEnabled: S.optional(S.Boolean),
  dnsOptions: S.optional(DnsOptions),
}) {}
export class ListServiceNetworkVpcAssociationsResponse extends S.Class<ListServiceNetworkVpcAssociationsResponse>(
  "ListServiceNetworkVpcAssociationsResponse",
)({
  items: ServiceNetworkVpcAssociationList,
  nextToken: S.optional(S.String),
}) {}
export class CreateTargetGroupResponse extends S.Class<CreateTargetGroupResponse>(
  "CreateTargetGroupResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  config: S.optional(TargetGroupConfig),
  status: S.optional(S.String),
}) {}
export class UpdateTargetGroupRequest extends S.Class<UpdateTargetGroupRequest>(
  "UpdateTargetGroupRequest",
)(
  {
    targetGroupIdentifier: S.String.pipe(T.HttpLabel("targetGroupIdentifier")),
    healthCheck: HealthCheckConfig,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/targetgroups/{targetGroupIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTargetGroupsResponse extends S.Class<ListTargetGroupsResponse>(
  "ListTargetGroupsResponse",
)({ items: S.optional(TargetGroupList), nextToken: S.optional(S.String) }) {}
export class DeregisterTargetsResponse extends S.Class<DeregisterTargetsResponse>(
  "DeregisterTargetsResponse",
)({
  successful: S.optional(TargetList),
  unsuccessful: S.optional(TargetFailureList),
}) {}
export class ListTargetsResponse extends S.Class<ListTargetsResponse>(
  "ListTargetsResponse",
)({ items: TargetSummaryList, nextToken: S.optional(S.String) }) {}
export class RegisterTargetsResponse extends S.Class<RegisterTargetsResponse>(
  "RegisterTargetsResponse",
)({
  successful: S.optional(TargetList),
  unsuccessful: S.optional(TargetFailureList),
}) {}
export class RuleUpdateSuccess extends S.Class<RuleUpdateSuccess>(
  "RuleUpdateSuccess",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  isDefault: S.optional(S.Boolean),
  match: S.optional(RuleMatch),
  priority: S.optional(S.Number),
  action: S.optional(RuleAction),
}) {}
export const RuleUpdateSuccessList = S.Array(RuleUpdateSuccess);
export class RuleUpdateFailure extends S.Class<RuleUpdateFailure>(
  "RuleUpdateFailure",
)({
  ruleIdentifier: S.optional(S.String),
  failureCode: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export const RuleUpdateFailureList = S.Array(RuleUpdateFailure);
export class BatchUpdateRuleResponse extends S.Class<BatchUpdateRuleResponse>(
  "BatchUpdateRuleResponse",
)({
  successful: S.optional(RuleUpdateSuccessList),
  unsuccessful: S.optional(RuleUpdateFailureList),
}) {}
export class CreateListenerRequest extends S.Class<CreateListenerRequest>(
  "CreateListenerRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    name: S.String,
    protocol: S.String,
    port: S.optional(S.Number),
    defaultAction: RuleAction,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/services/{serviceIdentifier}/listeners" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceConfigurationResponse extends S.Class<CreateResourceConfigurationResponse>(
  "CreateResourceConfigurationResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  resourceGatewayId: S.optional(S.String),
  resourceConfigurationGroupId: S.optional(S.String),
  type: S.optional(S.String),
  portRanges: S.optional(PortRangeList),
  protocol: S.optional(S.String),
  status: S.optional(S.String),
  resourceConfigurationDefinition: S.optional(ResourceConfigurationDefinition),
  allowAssociationToShareableServiceNetwork: S.optional(S.Boolean),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  failureReason: S.optional(S.String),
  customDomainName: S.optional(S.String),
  domainVerificationId: S.optional(S.String),
  groupDomain: S.optional(S.String),
  domainVerificationArn: S.optional(S.String),
}) {}
export class UpdateTargetGroupResponse extends S.Class<UpdateTargetGroupResponse>(
  "UpdateTargetGroupResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  config: S.optional(TargetGroupConfig),
  status: S.optional(S.String),
}) {}
export class CreateListenerResponse extends S.Class<CreateListenerResponse>(
  "CreateListenerResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  protocol: S.optional(S.String),
  port: S.optional(S.Number),
  serviceArn: S.optional(S.String),
  serviceId: S.optional(S.String),
  defaultAction: S.optional(RuleAction),
}) {}
export class CreateRuleRequest extends S.Class<CreateRuleRequest>(
  "CreateRuleRequest",
)(
  {
    serviceIdentifier: S.String.pipe(T.HttpLabel("serviceIdentifier")),
    listenerIdentifier: S.String.pipe(T.HttpLabel("listenerIdentifier")),
    name: S.String,
    match: RuleMatch,
    priority: S.Number,
    action: RuleAction,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/services/{serviceIdentifier}/listeners/{listenerIdentifier}/rules",
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
export class CreateRuleResponse extends S.Class<CreateRuleResponse>(
  "CreateRuleResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  match: S.optional(RuleMatch),
  priority: S.optional(S.Number),
  action: S.optional(RuleAction),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Lists the associations between a service network and a VPC endpoint.
 */
export const listServiceNetworkVpcEndpointAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceNetworkVpcEndpointAssociationsRequest,
    output: ListServiceNetworkVpcEndpointAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a listener rule. Each listener has a default rule for checking connection requests, but you can define additional rules. Each rule consists of a priority, one or more actions, and one or more conditions. For more information, see Listener rules in the *Amazon VPC Lattice User Guide*.
 */
export const createRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleRequest,
  output: CreateRuleResponse,
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
 * Starts the domain verification process for a custom domain name.
 */
export const startDomainVerification = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartDomainVerificationRequest,
    output: StartDomainVerificationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a resource configuration. A resource configuration defines a specific resource. You can associate a resource configuration with a service network or a VPC endpoint.
 */
export const createResourceConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateResourceConfigurationRequest,
    output: CreateResourceConfigurationResponse,
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
 * Updates the specified target group.
 */
export const updateTargetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTargetGroupRequest,
  output: UpdateTargetGroupResponse,
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
 * Enables access logs to be sent to Amazon CloudWatch, Amazon S3, and Amazon Kinesis Data Firehose. The service network owner can use the access logs to audit the services in the network. The service network owner can only see access logs from clients and services that are associated with their service network. Access log entries represent traffic originated from VPCs associated with that network. For more information, see Access logs in the *Amazon VPC Lattice User Guide*.
 */
export const createAccessLogSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAccessLogSubscriptionRequest,
    output: CreateAccessLogSubscriptionResponse,
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
 * Lists the domain verifications.
 */
export const listDomainVerifications =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDomainVerificationsRequest,
    output: ListDomainVerificationsResponse,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the listeners for the specified service.
 */
export const listListeners = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListListenersRequest,
    output: ListListenersResponse,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the rules for the specified listener.
 */
export const listRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRulesRequest,
  output: ListRulesResponse,
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
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a service. A service is any software application that can run on instances containers, or serverless functions within an account or virtual private cloud (VPC).
 *
 * For more information, see Services in the *Amazon VPC Lattice User Guide*.
 */
export const createService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceRequest,
  output: CreateServiceResponse,
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
 * Creates a service network. A service network is a logical boundary for a collection of services. You can associate services and VPCs with a service network.
 *
 * For more information, see Service networks in the *Amazon VPC Lattice User Guide*.
 */
export const createServiceNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateServiceNetworkRequest,
    output: CreateServiceNetworkResponse,
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
 * Associates a VPC with a service network. When you associate a VPC with the service network, it enables all the resources within that VPC to be clients and communicate with other services in the service network. For more information, see Manage VPC associations in the *Amazon VPC Lattice User Guide*.
 *
 * You can't use this operation if there is a disassociation in progress. If the association fails, retry by deleting the association and recreating it.
 *
 * As a result of this operation, the association gets created in the service network account and the VPC owner account.
 *
 * If you add a security group to the service network and VPC association, the association must continue to always have at least one security group. You can add or edit security groups at any time. However, to remove all security groups, you must first delete the association and recreate it without security groups.
 */
export const createServiceNetworkVpcAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateServiceNetworkVpcAssociationRequest,
    output: CreateServiceNetworkVpcAssociationResponse,
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
 * Creates a target group. A target group is a collection of targets, or compute resources, that run your application or service. A target group can only be used by a single service.
 *
 * For more information, see Target groups in the *Amazon VPC Lattice User Guide*.
 */
export const createTargetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTargetGroupRequest,
  output: CreateTargetGroupResponse,
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
 * Deregisters the specified targets from the specified target group.
 */
export const deregisterTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterTargetsRequest,
  output: DeregisterTargetsResponse,
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
 * Lists the targets for the target group. By default, all targets are included. You can use this API to check the health status of targets. You can also ﬁlter the results by target.
 */
export const listTargets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTargetsRequest,
    output: ListTargetsResponse,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Registers the targets with the target group. If it's a Lambda target, you can only have one target in a target group.
 */
export const registerTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterTargetsRequest,
  output: RegisterTargetsResponse,
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
 * Retrieves information about the auth policy for the specified service or service network.
 */
export const getAuthPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthPolicyRequest,
  output: GetAuthPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified resource policy. The resource policy is an IAM policy created on behalf of the resource owner when they share a resource.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates or updates the auth policy. The policy string in JSON must not contain newlines or blank lines.
 *
 * For more information, see Auth policies in the *Amazon VPC Lattice User Guide*.
 */
export const putAuthPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAuthPolicyRequest,
  output: PutAuthPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds the specified tags to the specified resource.
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
 * Retrieves information about the specified access log subscription.
 */
export const getAccessLogSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccessLogSubscriptionRequest,
    output: GetAccessLogSubscriptionResponse,
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
 * Retrieves information about a domain verification.ß
 */
export const getDomainVerification = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDomainVerificationRequest,
    output: GetDomainVerificationResponse,
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
 * Retrieves information about the specified listener for the specified service.
 */
export const getListener = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetListenerRequest,
  output: GetListenerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified resource configuration.
 */
export const getResourceConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourceConfigurationRequest,
    output: GetResourceConfigurationResponse,
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
 * Updates the specified resource configuration.
 */
export const updateResourceConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateResourceConfigurationRequest,
    output: UpdateResourceConfigurationResponse,
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
 * Disassociates the resource configuration from the resource VPC endpoint.
 */
export const deleteResourceEndpointAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteResourceEndpointAssociationRequest,
    output: DeleteResourceEndpointAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves information about the specified resource gateway.
 */
export const getResourceGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceGatewayRequest,
  output: GetResourceGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified listener rules. You can also retrieve information about the default listener rule. For more information, see Listener rules in the *Amazon VPC Lattice User Guide*.
 */
export const getRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuleRequest,
  output: GetRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified service.
 */
export const getService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceRequest,
  output: GetServiceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified service network.
 */
export const getServiceNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceNetworkRequest,
  output: GetServiceNetworkResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified association between a service network and a resource configuration.
 */
export const getServiceNetworkResourceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetServiceNetworkResourceAssociationRequest,
    output: GetServiceNetworkResourceAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves information about the specified association between a service network and a service.
 */
export const getServiceNetworkServiceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetServiceNetworkServiceAssociationRequest,
    output: GetServiceNetworkServiceAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves information about the specified association between a service network and a VPC.
 */
export const getServiceNetworkVpcAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetServiceNetworkVpcAssociationRequest,
    output: GetServiceNetworkVpcAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves information about the specified target group.
 */
export const getTargetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTargetGroupRequest,
  output: GetTargetGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified resource policy.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
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
 * Attaches a resource-based permission policy to a service or service network. The policy must contain the same actions and condition statements as the Amazon Web Services Resource Access Manager permission for sharing services and service networks.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified access log subscription.
 */
export const deleteAccessLogSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAccessLogSubscriptionRequest,
    output: DeleteAccessLogSubscriptionResponse,
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
 * Deletes the specified domain verification.
 */
export const deleteDomainVerification = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDomainVerificationRequest,
    output: DeleteDomainVerificationResponse,
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
 * Updates the specified access log subscription.
 */
export const updateAccessLogSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccessLogSubscriptionRequest,
    output: UpdateAccessLogSubscriptionResponse,
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
 * Updates the specified listener for the specified service.
 */
export const updateListener = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateListenerRequest,
  output: UpdateListenerResponse,
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
 * A resource gateway is a point of ingress into the VPC where a resource resides. It spans multiple Availability Zones. For your resource to be accessible from all Availability Zones, you should create your resource gateways to span as many Availability Zones as possible. A VPC can have multiple resource gateways.
 */
export const createResourceGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateResourceGatewayRequest,
    output: CreateResourceGatewayResponse,
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
 * Updates the specified resource gateway.
 */
export const updateResourceGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateResourceGatewayRequest,
    output: UpdateResourceGatewayResponse,
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
 * Deletes the specified resource gateway.
 */
export const deleteResourceGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourceGatewayRequest,
    output: DeleteResourceGatewayResponse,
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
 * Updates a specified rule for the listener. You can't modify a default listener rule. To modify a default listener rule, use `UpdateListener`.
 */
export const updateRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleRequest,
  output: UpdateRuleResponse,
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
 * Updates the specified service.
 */
export const updateService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceRequest,
  output: UpdateServiceResponse,
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
 * Deletes a service. A service can't be deleted if it's associated with a service network. If you delete a service, all resources related to the service, such as the resource policy, auth policy, listeners, listener rules, and access log subscriptions, are also deleted. For more information, see Delete a service in the *Amazon VPC Lattice User Guide*.
 */
export const deleteService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceRequest,
  output: DeleteServiceResponse,
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
 * Updates the specified service network.
 */
export const updateServiceNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceNetworkRequest,
    output: UpdateServiceNetworkResponse,
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
 * Associates the specified service network with the specified resource configuration. This allows the resource configuration to receive connections through the service network, including through a service network VPC endpoint.
 */
export const createServiceNetworkResourceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateServiceNetworkResourceAssociationRequest,
    output: CreateServiceNetworkResourceAssociationResponse,
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
 * Deletes the association between a service network and a resource configuration.
 */
export const deleteServiceNetworkResourceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteServiceNetworkResourceAssociationRequest,
    output: DeleteServiceNetworkResourceAssociationResponse,
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
 * Associates the specified service with the specified service network. For more information, see Manage service associations in the *Amazon VPC Lattice User Guide*.
 *
 * You can't use this operation if the service and service network are already associated or if there is a disassociation or deletion in progress. If the association fails, you can retry the operation by deleting the association and recreating it.
 *
 * You cannot associate a service and service network that are shared with a caller. The caller must own either the service or the service network.
 *
 * As a result of this operation, the association is created in the service network account and the association owner account.
 */
export const createServiceNetworkServiceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateServiceNetworkServiceAssociationRequest,
    output: CreateServiceNetworkServiceAssociationResponse,
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
 * Deletes the association between a service and a service network. This operation fails if an association is still in progress.
 */
export const deleteServiceNetworkServiceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteServiceNetworkServiceAssociationRequest,
    output: DeleteServiceNetworkServiceAssociationResponse,
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
 * Updates the service network and VPC association. If you add a security group to the service network and VPC association, the association must continue to have at least one security group. You can add or edit security groups at any time. However, to remove all security groups, you must first delete the association and then recreate it without security groups.
 */
export const updateServiceNetworkVpcAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateServiceNetworkVpcAssociationRequest,
    output: UpdateServiceNetworkVpcAssociationResponse,
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
 * Disassociates the VPC from the service network. You can't disassociate the VPC if there is a create or update association in progress.
 */
export const deleteServiceNetworkVpcAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteServiceNetworkVpcAssociationRequest,
    output: DeleteServiceNetworkVpcAssociationResponse,
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
 * Deletes a target group. You can't delete a target group if it is used in a listener rule or if the target group creation is in progress.
 */
export const deleteTargetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTargetGroupRequest,
  output: DeleteTargetGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified listener.
 */
export const deleteListener = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteListenerRequest,
  output: DeleteListenerResponse,
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
 * Deletes the specified resource configuration.
 */
export const deleteResourceConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourceConfigurationRequest,
    output: DeleteResourceConfigurationResponse,
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
 * Deletes a listener rule. Each listener has a default rule for checking connection requests, but you can define additional rules. Each rule consists of a priority, one or more actions, and one or more conditions. You can delete additional listener rules, but you cannot delete the default rule.
 *
 * For more information, see Listener rules in the *Amazon VPC Lattice User Guide*.
 */
export const deleteRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
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
 * Deletes a service network. You can only delete the service network if there is no service or VPC associated with it. If you delete a service network, all resources related to the service network, such as the resource policy, auth policy, and access log subscriptions, are also deleted. For more information, see Delete a service network in the *Amazon VPC Lattice User Guide*.
 */
export const deleteServiceNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteServiceNetworkRequest,
    output: DeleteServiceNetworkResponse,
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
 * Updates the listener rules in a batch. You can use this operation to change the priority of listener rules. This can be useful when bulk updating or swapping rule priority.
 *
 * **Required permissions:** `vpc-lattice:UpdateRule`
 *
 * For more information, see How Amazon VPC Lattice works with IAM in the *Amazon VPC Lattice User Guide*.
 */
export const batchUpdateRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateRuleRequest,
  output: BatchUpdateRuleResponse,
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
 * Lists the access log subscriptions for the specified service network or service.
 */
export const listAccessLogSubscriptions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAccessLogSubscriptionsRequest,
    output: ListAccessLogSubscriptionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the resource configurations owned by or shared with this account.
 */
export const listResourceConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListResourceConfigurationsRequest,
    output: ListResourceConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the associations for the specified VPC endpoint.
 */
export const listResourceEndpointAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListResourceEndpointAssociationsRequest,
    output: ListResourceEndpointAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the resource gateways that you own or that were shared with you.
 */
export const listResourceGateways =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListResourceGatewaysRequest,
    output: ListResourceGatewaysResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the services owned by the caller account or shared with the caller account.
 */
export const listServices = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListServicesRequest,
    output: ListServicesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the service networks owned by or shared with this account. The account ID in the ARN shows which account owns the service network.
 */
export const listServiceNetworks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceNetworksRequest,
    output: ListServiceNetworksResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the associations between a service network and a resource configuration.
 */
export const listServiceNetworkResourceAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceNetworkResourceAssociationsRequest,
    output: ListServiceNetworkResourceAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the associations between a service network and a service. You can filter the list either by service or service network. You must provide either the service network identifier or the service identifier.
 *
 * Every association in Amazon VPC Lattice has a unique Amazon Resource Name (ARN), such as when a service network is associated with a VPC or when a service is associated with a service network. If the association is for a resource is shared with another account, the association includes the local account ID as the prefix in the ARN.
 */
export const listServiceNetworkServiceAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceNetworkServiceAssociationsRequest,
    output: ListServiceNetworkServiceAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the associations between a service network and a VPC. You can filter the list either by VPC or service network. You must provide either the ID of the service network identifier or the ID of the VPC.
 */
export const listServiceNetworkVpcAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceNetworkVpcAssociationsRequest,
    output: ListServiceNetworkVpcAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists your target groups. You can narrow your search by using the filters below in your request.
 */
export const listTargetGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTargetGroupsRequest,
    output: ListTargetGroupsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Deletes the specified auth policy. If an auth is set to `AWS_IAM` and the auth policy is deleted, all requests are denied. If you are trying to remove the auth policy completely, you must set the auth type to `NONE`. If auth is enabled on the resource, but no auth policy is set, all requests are denied.
 */
export const deleteAuthPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAuthPolicyRequest,
  output: DeleteAuthPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a listener for a service. Before you start using your Amazon VPC Lattice service, you must add one or more listeners. A listener is a process that checks for connection requests to your services. For more information, see Listeners in the *Amazon VPC Lattice User Guide*.
 */
export const createListener = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateListenerRequest,
  output: CreateListenerResponse,
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

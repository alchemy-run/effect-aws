import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "evs",
  serviceShapeName: "AmazonElasticVMwareService",
});
const auth = T.AwsAuthSigv4({ name: "evs" });
const ver = T.ServiceVersion("2023-07-27");
const proto = T.AwsProtocolsAwsJson1_0();
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
                                url: "https://evs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://evs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://evs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://evs.{Region}.{PartitionResult#dnsSuffix}",
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
export const EnvironmentStateList = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class GetEnvironmentRequest extends S.Class<GetEnvironmentRequest>(
  "GetEnvironmentRequest",
)(
  { environmentId: S.String.pipe(T.HttpLabel("environmentId")) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEnvironmentRequest extends S.Class<DeleteEnvironmentRequest>(
  "DeleteEnvironmentRequest",
)(
  {
    clientToken: S.optional(S.String),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentsRequest extends S.Class<ListEnvironmentsRequest>(
  "ListEnvironmentsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    state: S.optional(EnvironmentStateList).pipe(T.HttpQuery("state")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateEipToVlanRequest extends S.Class<AssociateEipToVlanRequest>(
  "AssociateEipToVlanRequest",
)(
  {
    clientToken: S.optional(S.String),
    environmentId: S.String,
    vlanName: S.String,
    allocationId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class HostInfoForCreate extends S.Class<HostInfoForCreate>(
  "HostInfoForCreate",
)({
  hostName: S.String,
  keyName: S.String,
  instanceType: S.String,
  placementGroupId: S.optional(S.String),
  dedicatedHostId: S.optional(S.String),
}) {}
export class CreateEnvironmentHostRequest extends S.Class<CreateEnvironmentHostRequest>(
  "CreateEnvironmentHostRequest",
)(
  {
    clientToken: S.optional(S.String),
    environmentId: S.String,
    host: HostInfoForCreate,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEnvironmentHostRequest extends S.Class<DeleteEnvironmentHostRequest>(
  "DeleteEnvironmentHostRequest",
)(
  {
    clientToken: S.optional(S.String),
    environmentId: S.String,
    hostName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateEipFromVlanRequest extends S.Class<DisassociateEipFromVlanRequest>(
  "DisassociateEipFromVlanRequest",
)(
  {
    clientToken: S.optional(S.String),
    environmentId: S.String,
    vlanName: S.String,
    associationId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentHostsRequest extends S.Class<ListEnvironmentHostsRequest>(
  "ListEnvironmentHostsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentVlansRequest extends S.Class<ListEnvironmentVlansRequest>(
  "ListEnvironmentVlansRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const SecurityGroups = S.Array(S.String);
export const RouteServerPeeringList = S.Array(S.String);
export const RequestTagMap = S.Record({ key: S.String, value: S.String });
export class ServiceAccessSecurityGroups extends S.Class<ServiceAccessSecurityGroups>(
  "ServiceAccessSecurityGroups",
)({ securityGroups: S.optional(SecurityGroups) }) {}
export class LicenseInfo extends S.Class<LicenseInfo>("LicenseInfo")({
  solutionKey: S.String,
  vsanKey: S.String,
}) {}
export const LicenseInfoList = S.Array(LicenseInfo);
export const HostInfoForCreateList = S.Array(HostInfoForCreate);
export class ConnectivityInfo extends S.Class<ConnectivityInfo>(
  "ConnectivityInfo",
)({ privateRouteServerPeerings: RouteServerPeeringList }) {}
export class VcfHostnames extends S.Class<VcfHostnames>("VcfHostnames")({
  vCenter: S.String,
  nsx: S.String,
  nsxManager1: S.String,
  nsxManager2: S.String,
  nsxManager3: S.String,
  nsxEdge1: S.String,
  nsxEdge2: S.String,
  sddcManager: S.String,
  cloudBuilder: S.String,
}) {}
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({ networkInterfaceId: S.optional(S.String) }) {}
export const NetworkInterfaceList = S.Array(NetworkInterface);
export class Host extends S.Class<Host>("Host")({
  hostName: S.optional(S.String),
  ipAddress: S.optional(S.String),
  keyName: S.optional(S.String),
  instanceType: S.optional(S.String),
  placementGroupId: S.optional(S.String),
  dedicatedHostId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  hostState: S.optional(S.String),
  stateDetails: S.optional(S.String),
  ec2InstanceId: S.optional(S.String),
  networkInterfaces: S.optional(NetworkInterfaceList),
}) {}
export const HostList = S.Array(Host);
export class EipAssociation extends S.Class<EipAssociation>("EipAssociation")({
  associationId: S.optional(S.String),
  allocationId: S.optional(S.String),
  ipAddress: S.optional(S.String),
}) {}
export const EipAssociationList = S.Array(EipAssociation);
export class Vlan extends S.Class<Vlan>("Vlan")({
  vlanId: S.optional(S.Number),
  cidr: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  functionName: S.optional(S.String),
  subnetId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  vlanState: S.optional(S.String),
  stateDetails: S.optional(S.String),
  eipAssociations: S.optional(EipAssociationList),
  isPublic: S.optional(S.Boolean),
  networkAclId: S.optional(S.String),
}) {}
export const VlanList = S.Array(Vlan);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: RequestTagMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class Check extends S.Class<Check>("Check")({
  type: S.optional(S.String),
  result: S.optional(S.String),
  impairedSince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ChecksList = S.Array(Check);
export class Secret extends S.Class<Secret>("Secret")({
  secretArn: S.optional(S.String),
}) {}
export const SecretList = S.Array(Secret);
export class Environment extends S.Class<Environment>("Environment")({
  environmentId: S.optional(S.String),
  environmentState: S.optional(S.String),
  stateDetails: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  environmentArn: S.optional(S.String),
  environmentName: S.optional(S.String),
  vpcId: S.optional(S.String),
  serviceAccessSubnetId: S.optional(S.String),
  vcfVersion: S.optional(S.String),
  termsAccepted: S.optional(S.Boolean),
  licenseInfo: S.optional(LicenseInfoList),
  siteId: S.optional(S.String),
  environmentStatus: S.optional(S.String),
  checks: S.optional(ChecksList),
  connectivityInfo: S.optional(ConnectivityInfo),
  vcfHostnames: S.optional(VcfHostnames),
  kmsKeyId: S.optional(S.String),
  serviceAccessSecurityGroups: S.optional(ServiceAccessSecurityGroups),
  credentials: S.optional(SecretList),
}) {}
export class DeleteEnvironmentResponse extends S.Class<DeleteEnvironmentResponse>(
  "DeleteEnvironmentResponse",
)({ environment: S.optional(Environment) }) {}
export class EnvironmentSummary extends S.Class<EnvironmentSummary>(
  "EnvironmentSummary",
)({
  environmentId: S.optional(S.String),
  environmentName: S.optional(S.String),
  vcfVersion: S.optional(S.String),
  environmentStatus: S.optional(S.String),
  environmentState: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  environmentArn: S.optional(S.String),
}) {}
export class DeleteEnvironmentHostResponse extends S.Class<DeleteEnvironmentHostResponse>(
  "DeleteEnvironmentHostResponse",
)({
  environmentSummary: S.optional(EnvironmentSummary),
  host: S.optional(Host),
}) {}
export class DisassociateEipFromVlanResponse extends S.Class<DisassociateEipFromVlanResponse>(
  "DisassociateEipFromVlanResponse",
)({ vlan: S.optional(Vlan) }) {}
export class ListEnvironmentHostsResponse extends S.Class<ListEnvironmentHostsResponse>(
  "ListEnvironmentHostsResponse",
)({
  nextToken: S.optional(S.String),
  environmentHosts: S.optional(HostList),
}) {}
export class ListEnvironmentVlansResponse extends S.Class<ListEnvironmentVlansResponse>(
  "ListEnvironmentVlansResponse",
)({
  nextToken: S.optional(S.String),
  environmentVlans: S.optional(VlanList),
}) {}
export class InitialVlanInfo extends S.Class<InitialVlanInfo>(
  "InitialVlanInfo",
)({ cidr: S.String }) {}
export const ResponseTagMap = S.Record({ key: S.String, value: S.String });
export class InitialVlans extends S.Class<InitialVlans>("InitialVlans")({
  vmkManagement: InitialVlanInfo,
  vmManagement: InitialVlanInfo,
  vMotion: InitialVlanInfo,
  vSan: InitialVlanInfo,
  vTep: InitialVlanInfo,
  edgeVTep: InitialVlanInfo,
  nsxUplink: InitialVlanInfo,
  hcx: InitialVlanInfo,
  expansionVlan1: InitialVlanInfo,
  expansionVlan2: InitialVlanInfo,
  isHcxPublic: S.optional(S.Boolean),
  hcxNetworkAclId: S.optional(S.String),
}) {}
export const EnvironmentSummaryList = S.Array(EnvironmentSummary);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(ResponseTagMap) }) {}
export class CreateEnvironmentRequest extends S.Class<CreateEnvironmentRequest>(
  "CreateEnvironmentRequest",
)(
  {
    clientToken: S.optional(S.String),
    environmentName: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(RequestTagMap),
    serviceAccessSecurityGroups: S.optional(ServiceAccessSecurityGroups),
    vpcId: S.String,
    serviceAccessSubnetId: S.String,
    vcfVersion: S.String,
    termsAccepted: S.Boolean,
    licenseInfo: LicenseInfoList,
    initialVlans: InitialVlans,
    hosts: HostInfoForCreateList,
    connectivityInfo: ConnectivityInfo,
    vcfHostnames: VcfHostnames,
    siteId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentsResponse extends S.Class<ListEnvironmentsResponse>(
  "ListEnvironmentsResponse",
)({
  nextToken: S.optional(S.String),
  environmentSummaries: S.optional(EnvironmentSummaryList),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class CreateEnvironmentResponse extends S.Class<CreateEnvironmentResponse>(
  "CreateEnvironmentResponse",
)({ environment: S.optional(Environment) }) {}
export class GetEnvironmentResponse extends S.Class<GetEnvironmentResponse>(
  "GetEnvironmentResponse",
)({ environment: S.optional(Environment) }) {}
export class AssociateEipToVlanResponse extends S.Class<AssociateEipToVlanResponse>(
  "AssociateEipToVlanResponse",
)({ vlan: S.optional(Vlan) }) {}
export class CreateEnvironmentHostResponse extends S.Class<CreateEnvironmentHostResponse>(
  "CreateEnvironmentHostResponse",
)({
  environmentSummary: S.optional(EnvironmentSummary),
  host: S.optional(Host),
}) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class TagPolicyException extends S.TaggedError<TagPolicyException>()(
  "TagPolicyException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.String },
) {}

//# Operations
/**
 * Lists the tags for an Amazon EVS resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes specified tags from an Amazon EVS resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, TagPolicyException],
}));
/**
 * Deletes an Amazon EVS environment.
 *
 * Amazon EVS environments will only be enabled for deletion once the hosts are deleted. You can delete hosts using the `DeleteEnvironmentHost` action.
 *
 * Environment deletion also deletes the associated Amazon EVS VLAN subnets and Amazon Web Services Secrets Manager secrets that Amazon EVS created. Amazon Web Services resources that you create are not deleted. These resources may continue to incur costs.
 */
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Associates an Elastic IP address with a public HCX VLAN. This operation is only allowed for public HCX VLANs at this time.
 */
export const associateEipToVlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateEipToVlanRequest,
  output: AssociateEipToVlanResponse,
  errors: [ResourceNotFoundException, ThrottlingException, ValidationException],
}));
/**
 * Creates an ESXi host and adds it to an Amazon EVS environment. Amazon EVS supports 4-16 hosts per environment.
 *
 * This action can only be used after the Amazon EVS environment is deployed.
 *
 * You can use the `dedicatedHostId` parameter to specify an Amazon EC2 Dedicated Host for ESXi host creation.
 *
 * You can use the `placementGroupId` parameter to specify a cluster or partition placement group to launch EC2 instances into.
 *
 * You cannot use the `dedicatedHostId` and `placementGroupId` parameters together in the same `CreateEnvironmentHost` action. This results in a `ValidationException` response.
 */
export const createEnvironmentHost = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEnvironmentHostRequest,
    output: CreateEnvironmentHostResponse,
    errors: [ThrottlingException, ValidationException],
  }),
);
/**
 * Associates the specified tags to an Amazon EVS resource with the specified `resourceArn`. If existing tags on a resource are not specified in the request parameters, they aren't changed. When a resource is deleted, the tags associated with that resource are also deleted. Tags that you create for Amazon EVS resources don't propagate to any other resources associated with the environment. For example, if you tag an environment with this operation, that tag doesn't automatically propagate to the VLAN subnets and hosts associated with the environment.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    TagPolicyException,
    TooManyTagsException,
  ],
}));
/**
 * Deletes a host from an Amazon EVS environment.
 *
 * Before deleting a host, you must unassign and decommission the host from within the SDDC Manager user interface. Not doing so could impact the availability of your virtual machines or result in data loss.
 */
export const deleteEnvironmentHost = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEnvironmentHostRequest,
    output: DeleteEnvironmentHostResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }),
);
/**
 * List the hosts within an environment.
 */
export const listEnvironmentHosts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentHostsRequest,
    output: ListEnvironmentHostsResponse,
    errors: [ResourceNotFoundException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "environmentHosts",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists environment VLANs that are associated with the specified environment.
 */
export const listEnvironmentVlans =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentVlansRequest,
    output: ListEnvironmentVlansResponse,
    errors: [ResourceNotFoundException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "environmentVlans",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the Amazon EVS environments in your Amazon Web Services account in the specified Amazon Web Services Region.
 */
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEnvironmentsRequest,
    output: ListEnvironmentsResponse,
    errors: [ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "environmentSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Disassociates an Elastic IP address from a public HCX VLAN. This operation is only allowed for public HCX VLANs at this time.
 */
export const disassociateEipFromVlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateEipFromVlanRequest,
    output: DisassociateEipFromVlanResponse,
    errors: [
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an Amazon EVS environment that runs VCF software, such as SDDC Manager, NSX Manager, and vCenter Server.
 *
 * During environment creation, Amazon EVS performs validations on DNS settings, provisions VLAN subnets and hosts, and deploys the supplied version of VCF.
 *
 * It can take several hours to create an environment. After the deployment completes, you can configure VCF in the vSphere user interface according to your needs.
 *
 * You cannot use the `dedicatedHostId` and `placementGroupId` parameters together in the same `CreateEnvironment` action. This results in a `ValidationException` response.
 */
export const createEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentRequest,
  output: CreateEnvironmentResponse,
  errors: [ValidationException],
}));
/**
 * Returns a description of the specified environment.
 */
export const getEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentRequest,
  output: GetEnvironmentResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));

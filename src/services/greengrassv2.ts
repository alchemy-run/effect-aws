import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "GreengrassV2",
  serviceShapeName: "GreengrassV2",
});
const auth = T.AwsAuthSigv4({ name: "greengrass" });
const ver = T.ServiceVersion("2020-11-30");
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
                        url: "https://greengrass-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://greengrass.us-gov-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://greengrass.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://greengrass-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://greengrass.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [{ ref: "Region" }, "dataplane-us-gov-east-1"],
                },
              ],
              endpoint: {
                url: "https://greengrass-ats.iot.us-gov-east-1.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "greengrass",
                      signingRegion: "us-gov-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [{ ref: "Region" }, "dataplane-us-gov-west-1"],
                },
              ],
              endpoint: {
                url: "https://greengrass-ats.iot.us-gov-west-1.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "greengrass",
                      signingRegion: "us-gov-west-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://greengrass.{Region}.{PartitionResult#dnsSuffix}",
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
export class DisassociateServiceRoleFromAccountRequest extends S.Class<DisassociateServiceRoleFromAccountRequest>(
  "DisassociateServiceRoleFromAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/greengrass/servicerole" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceRoleForAccountRequest extends S.Class<GetServiceRoleForAccountRequest>(
  "GetServiceRoleForAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/servicerole" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagKeyList = S.Array(S.String);
export class AssociateServiceRoleToAccountRequest extends S.Class<AssociateServiceRoleToAccountRequest>(
  "AssociateServiceRoleToAccountRequest",
)(
  { roleArn: S.String.pipe(T.JsonName("RoleArn")) },
  T.all(
    T.Http({ method: "PUT", uri: "/greengrass/servicerole" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelDeploymentRequest extends S.Class<CancelDeploymentRequest>(
  "CancelDeploymentRequest",
)(
  { deploymentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/v2/deployments/{deploymentId}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComponentRequest extends S.Class<DeleteComponentRequest>(
  "DeleteComponentRequest",
)(
  { arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/greengrass/v2/components/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComponentResponse extends S.Class<DeleteComponentResponse>(
  "DeleteComponentResponse",
)({}) {}
export class DeleteCoreDeviceRequest extends S.Class<DeleteCoreDeviceRequest>(
  "DeleteCoreDeviceRequest",
)(
  { coreDeviceThingName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/greengrass/v2/coreDevices/{coreDeviceThingName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCoreDeviceResponse extends S.Class<DeleteCoreDeviceResponse>(
  "DeleteCoreDeviceResponse",
)({}) {}
export class DeleteDeploymentRequest extends S.Class<DeleteDeploymentRequest>(
  "DeleteDeploymentRequest",
)(
  { deploymentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/greengrass/v2/deployments/{deploymentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeploymentResponse extends S.Class<DeleteDeploymentResponse>(
  "DeleteDeploymentResponse",
)({}) {}
export class DescribeComponentRequest extends S.Class<DescribeComponentRequest>(
  "DescribeComponentRequest",
)(
  { arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/v2/components/{arn}/metadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateServiceRoleFromAccountResponse extends S.Class<DisassociateServiceRoleFromAccountResponse>(
  "DisassociateServiceRoleFromAccountResponse",
)({
  disassociatedAt: S.optional(S.String).pipe(T.JsonName("DisassociatedAt")),
}) {}
export class GetComponentRequest extends S.Class<GetComponentRequest>(
  "GetComponentRequest",
)(
  {
    recipeOutputFormat: S.optional(S.String).pipe(
      T.HttpQuery("recipeOutputFormat"),
    ),
    arn: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/v2/components/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetComponentVersionArtifactRequest extends S.Class<GetComponentVersionArtifactRequest>(
  "GetComponentVersionArtifactRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel()),
    artifactName: S.String.pipe(T.HttpLabel()),
    s3EndpointType: S.optional(S.String).pipe(T.HttpQuery("s3EndpointType")),
    iotEndpointType: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-iot-endpoint-type"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/v2/components/{arn}/artifacts/{artifactName+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectivityInfoRequest extends S.Class<GetConnectivityInfoRequest>(
  "GetConnectivityInfoRequest",
)(
  { thingName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/things/{thingName}/connectivityInfo",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCoreDeviceRequest extends S.Class<GetCoreDeviceRequest>(
  "GetCoreDeviceRequest",
)(
  { coreDeviceThingName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/v2/coreDevices/{coreDeviceThingName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeploymentRequest extends S.Class<GetDeploymentRequest>(
  "GetDeploymentRequest",
)(
  { deploymentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/v2/deployments/{deploymentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceRoleForAccountResponse extends S.Class<GetServiceRoleForAccountResponse>(
  "GetServiceRoleForAccountResponse",
)({
  associatedAt: S.optional(S.String).pipe(T.JsonName("AssociatedAt")),
  roleArn: S.optional(S.String).pipe(T.JsonName("RoleArn")),
}) {}
export class ListClientDevicesAssociatedWithCoreDeviceRequest extends S.Class<ListClientDevicesAssociatedWithCoreDeviceRequest>(
  "ListClientDevicesAssociatedWithCoreDeviceRequest",
)(
  {
    coreDeviceThingName: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/v2/coreDevices/{coreDeviceThingName}/associatedClientDevices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListComponentsRequest extends S.Class<ListComponentsRequest>(
  "ListComponentsRequest",
)(
  {
    scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/v2/components" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListComponentVersionsRequest extends S.Class<ListComponentVersionsRequest>(
  "ListComponentVersionsRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/v2/components/{arn}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCoreDevicesRequest extends S.Class<ListCoreDevicesRequest>(
  "ListCoreDevicesRequest",
)(
  {
    thingGroupArn: S.optional(S.String).pipe(T.HttpQuery("thingGroupArn")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    runtime: S.optional(S.String).pipe(T.HttpQuery("runtime")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/v2/coreDevices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeploymentsRequest extends S.Class<ListDeploymentsRequest>(
  "ListDeploymentsRequest",
)(
  {
    targetArn: S.optional(S.String).pipe(T.HttpQuery("targetArn")),
    historyFilter: S.optional(S.String).pipe(T.HttpQuery("historyFilter")),
    parentTargetArn: S.optional(S.String).pipe(T.HttpQuery("parentTargetArn")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/v2/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEffectiveDeploymentsRequest extends S.Class<ListEffectiveDeploymentsRequest>(
  "ListEffectiveDeploymentsRequest",
)(
  {
    coreDeviceThingName: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/v2/coreDevices/{coreDeviceThingName}/effectiveDeployments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInstalledComponentsRequest extends S.Class<ListInstalledComponentsRequest>(
  "ListInstalledComponentsRequest",
)(
  {
    coreDeviceThingName: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    topologyFilter: S.optional(S.String).pipe(T.HttpQuery("topologyFilter")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/v2/coreDevices/{coreDeviceThingName}/installedComponents",
    }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
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
export const PlatformAttributesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ComponentPlatform extends S.Class<ComponentPlatform>(
  "ComponentPlatform",
)({
  name: S.optional(S.String),
  attributes: S.optional(PlatformAttributesMap),
}) {}
export const ComponentPlatformList = S.Array(ComponentPlatform);
export class AssociateClientDeviceWithCoreDeviceEntry extends S.Class<AssociateClientDeviceWithCoreDeviceEntry>(
  "AssociateClientDeviceWithCoreDeviceEntry",
)({ thingName: S.String }) {}
export const AssociateClientDeviceWithCoreDeviceEntryList = S.Array(
  AssociateClientDeviceWithCoreDeviceEntry,
);
export class DisassociateClientDeviceFromCoreDeviceEntry extends S.Class<DisassociateClientDeviceFromCoreDeviceEntry>(
  "DisassociateClientDeviceFromCoreDeviceEntry",
)({ thingName: S.String }) {}
export const DisassociateClientDeviceFromCoreDeviceEntryList = S.Array(
  DisassociateClientDeviceFromCoreDeviceEntry,
);
export class ConnectivityInfo extends S.Class<ConnectivityInfo>(
  "ConnectivityInfo",
)({
  id: S.optional(S.String).pipe(T.JsonName("Id")),
  hostAddress: S.optional(S.String).pipe(T.JsonName("HostAddress")),
  portNumber: S.optional(S.Number).pipe(T.JsonName("PortNumber")),
  metadata: S.optional(S.String).pipe(T.JsonName("Metadata")),
}) {}
export const connectivityInfoList = S.Array(ConnectivityInfo);
export const LambdaExecArgsList = S.Array(S.String);
export class AssociateServiceRoleToAccountResponse extends S.Class<AssociateServiceRoleToAccountResponse>(
  "AssociateServiceRoleToAccountResponse",
)({ associatedAt: S.optional(S.String).pipe(T.JsonName("AssociatedAt")) }) {}
export class BatchAssociateClientDeviceWithCoreDeviceRequest extends S.Class<BatchAssociateClientDeviceWithCoreDeviceRequest>(
  "BatchAssociateClientDeviceWithCoreDeviceRequest",
)(
  {
    entries: S.optional(AssociateClientDeviceWithCoreDeviceEntryList),
    coreDeviceThingName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/v2/coreDevices/{coreDeviceThingName}/associateClientDevices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDisassociateClientDeviceFromCoreDeviceRequest extends S.Class<BatchDisassociateClientDeviceFromCoreDeviceRequest>(
  "BatchDisassociateClientDeviceFromCoreDeviceRequest",
)(
  {
    entries: S.optional(DisassociateClientDeviceFromCoreDeviceEntryList),
    coreDeviceThingName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/v2/coreDevices/{coreDeviceThingName}/disassociateClientDevices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelDeploymentResponse extends S.Class<CancelDeploymentResponse>(
  "CancelDeploymentResponse",
)({ message: S.optional(S.String) }) {}
export class GetComponentResponse extends S.Class<GetComponentResponse>(
  "GetComponentResponse",
)({ recipeOutputFormat: S.String, recipe: T.Blob, tags: S.optional(TagMap) }) {}
export class GetComponentVersionArtifactResponse extends S.Class<GetComponentVersionArtifactResponse>(
  "GetComponentVersionArtifactResponse",
)({ preSignedUrl: S.String }) {}
export class GetConnectivityInfoResponse extends S.Class<GetConnectivityInfoResponse>(
  "GetConnectivityInfoResponse",
)({
  connectivityInfo: S.optional(connectivityInfoList).pipe(
    T.JsonName("ConnectivityInfo"),
  ),
  message: S.optional(S.String).pipe(T.JsonName("Message")),
}) {}
export class GetCoreDeviceResponse extends S.Class<GetCoreDeviceResponse>(
  "GetCoreDeviceResponse",
)({
  coreDeviceThingName: S.optional(S.String),
  coreVersion: S.optional(S.String),
  platform: S.optional(S.String),
  architecture: S.optional(S.String),
  runtime: S.optional(S.String),
  status: S.optional(S.String),
  lastStatusUpdateTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  tags: S.optional(TagMap),
}) {}
export const ComponentConfigurationPathList = S.Array(S.String);
export class ComponentConfigurationUpdate extends S.Class<ComponentConfigurationUpdate>(
  "ComponentConfigurationUpdate",
)({
  merge: S.optional(S.String),
  reset: S.optional(ComponentConfigurationPathList),
}) {}
export class SystemResourceLimits extends S.Class<SystemResourceLimits>(
  "SystemResourceLimits",
)({ memory: S.optional(S.Number), cpus: S.optional(S.Number) }) {}
export class ComponentRunWith extends S.Class<ComponentRunWith>(
  "ComponentRunWith",
)({
  posixUser: S.optional(S.String),
  systemResourceLimits: S.optional(SystemResourceLimits),
  windowsUser: S.optional(S.String),
}) {}
export class ComponentDeploymentSpecification extends S.Class<ComponentDeploymentSpecification>(
  "ComponentDeploymentSpecification",
)({
  componentVersion: S.String,
  configurationUpdate: S.optional(ComponentConfigurationUpdate),
  runWith: S.optional(ComponentRunWith),
}) {}
export const ComponentDeploymentSpecifications = S.Record({
  key: S.String,
  value: ComponentDeploymentSpecification,
});
export class DeploymentComponentUpdatePolicy extends S.Class<DeploymentComponentUpdatePolicy>(
  "DeploymentComponentUpdatePolicy",
)({ timeoutInSeconds: S.optional(S.Number), action: S.optional(S.String) }) {}
export class DeploymentConfigurationValidationPolicy extends S.Class<DeploymentConfigurationValidationPolicy>(
  "DeploymentConfigurationValidationPolicy",
)({ timeoutInSeconds: S.optional(S.Number) }) {}
export class DeploymentPolicies extends S.Class<DeploymentPolicies>(
  "DeploymentPolicies",
)({
  failureHandlingPolicy: S.optional(S.String),
  componentUpdatePolicy: S.optional(DeploymentComponentUpdatePolicy),
  configurationValidationPolicy: S.optional(
    DeploymentConfigurationValidationPolicy,
  ),
}) {}
export class IoTJobRateIncreaseCriteria extends S.Class<IoTJobRateIncreaseCriteria>(
  "IoTJobRateIncreaseCriteria",
)({
  numberOfNotifiedThings: S.optional(S.Number),
  numberOfSucceededThings: S.optional(S.Number),
}) {}
export class IoTJobExponentialRolloutRate extends S.Class<IoTJobExponentialRolloutRate>(
  "IoTJobExponentialRolloutRate",
)({
  baseRatePerMinute: S.Number,
  incrementFactor: S.Number,
  rateIncreaseCriteria: IoTJobRateIncreaseCriteria,
}) {}
export class IoTJobExecutionsRolloutConfig extends S.Class<IoTJobExecutionsRolloutConfig>(
  "IoTJobExecutionsRolloutConfig",
)({
  exponentialRate: S.optional(IoTJobExponentialRolloutRate),
  maximumPerMinute: S.optional(S.Number),
}) {}
export class IoTJobAbortCriteria extends S.Class<IoTJobAbortCriteria>(
  "IoTJobAbortCriteria",
)({
  failureType: S.String,
  action: S.String,
  thresholdPercentage: S.Number,
  minNumberOfExecutedThings: S.Number,
}) {}
export const IoTJobAbortCriteriaList = S.Array(IoTJobAbortCriteria);
export class IoTJobAbortConfig extends S.Class<IoTJobAbortConfig>(
  "IoTJobAbortConfig",
)({ criteriaList: IoTJobAbortCriteriaList }) {}
export class IoTJobTimeoutConfig extends S.Class<IoTJobTimeoutConfig>(
  "IoTJobTimeoutConfig",
)({ inProgressTimeoutInMinutes: S.optional(S.Number) }) {}
export class DeploymentIoTJobConfiguration extends S.Class<DeploymentIoTJobConfiguration>(
  "DeploymentIoTJobConfiguration",
)({
  jobExecutionsRolloutConfig: S.optional(IoTJobExecutionsRolloutConfig),
  abortConfig: S.optional(IoTJobAbortConfig),
  timeoutConfig: S.optional(IoTJobTimeoutConfig),
}) {}
export class GetDeploymentResponse extends S.Class<GetDeploymentResponse>(
  "GetDeploymentResponse",
)({
  targetArn: S.optional(S.String),
  revisionId: S.optional(S.String),
  deploymentId: S.optional(S.String),
  deploymentName: S.optional(S.String),
  deploymentStatus: S.optional(S.String),
  iotJobId: S.optional(S.String),
  iotJobArn: S.optional(S.String),
  components: S.optional(ComponentDeploymentSpecifications),
  deploymentPolicies: S.optional(DeploymentPolicies),
  iotJobConfiguration: S.optional(DeploymentIoTJobConfiguration),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  isLatestForTarget: S.optional(S.Boolean),
  parentTargetArn: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class UpdateConnectivityInfoRequest extends S.Class<UpdateConnectivityInfoRequest>(
  "UpdateConnectivityInfoRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel("thingName"), T.JsonName("ThingName")),
    connectivityInfo: connectivityInfoList.pipe(T.JsonName("ConnectivityInfo")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/things/{thingName}/connectivityInfo",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const InstalledComponentLifecycleStatusCodeList = S.Array(S.String);
export const ComponentVersionRequirementMap = S.Record({
  key: S.String,
  value: S.String,
});
export class AssociatedClientDevice extends S.Class<AssociatedClientDevice>(
  "AssociatedClientDevice",
)({
  thingName: S.optional(S.String),
  associationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const AssociatedClientDeviceList = S.Array(AssociatedClientDevice);
export class ComponentVersionListItem extends S.Class<ComponentVersionListItem>(
  "ComponentVersionListItem",
)({
  componentName: S.optional(S.String),
  componentVersion: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const ComponentVersionList = S.Array(ComponentVersionListItem);
export class CoreDevice extends S.Class<CoreDevice>("CoreDevice")({
  coreDeviceThingName: S.optional(S.String),
  status: S.optional(S.String),
  lastStatusUpdateTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  platform: S.optional(S.String),
  architecture: S.optional(S.String),
  runtime: S.optional(S.String),
}) {}
export const CoreDevicesList = S.Array(CoreDevice);
export class Deployment extends S.Class<Deployment>("Deployment")({
  targetArn: S.optional(S.String),
  revisionId: S.optional(S.String),
  deploymentId: S.optional(S.String),
  deploymentName: S.optional(S.String),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  deploymentStatus: S.optional(S.String),
  isLatestForTarget: S.optional(S.Boolean),
  parentTargetArn: S.optional(S.String),
}) {}
export const DeploymentList = S.Array(Deployment);
export class InstalledComponent extends S.Class<InstalledComponent>(
  "InstalledComponent",
)({
  componentName: S.optional(S.String),
  componentVersion: S.optional(S.String),
  lifecycleState: S.optional(S.String),
  lifecycleStateDetails: S.optional(S.String),
  isRoot: S.optional(S.Boolean),
  lastStatusChangeTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastReportedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastInstallationSource: S.optional(S.String),
  lifecycleStatusCodes: S.optional(InstalledComponentLifecycleStatusCodeList),
}) {}
export const InstalledComponentList = S.Array(InstalledComponent);
export class ComponentCandidate extends S.Class<ComponentCandidate>(
  "ComponentCandidate",
)({
  componentName: S.optional(S.String),
  componentVersion: S.optional(S.String),
  versionRequirements: S.optional(ComponentVersionRequirementMap),
}) {}
export const ComponentCandidateList = S.Array(ComponentCandidate);
export class ComponentDependencyRequirement extends S.Class<ComponentDependencyRequirement>(
  "ComponentDependencyRequirement",
)({
  versionRequirement: S.optional(S.String),
  dependencyType: S.optional(S.String),
}) {}
export class LambdaEventSource extends S.Class<LambdaEventSource>(
  "LambdaEventSource",
)({ topic: S.String, type: S.String }) {}
export const LambdaEventSourceList = S.Array(LambdaEventSource);
export const LambdaEnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export const EffectiveDeploymentErrorStack = S.Array(S.String);
export const EffectiveDeploymentErrorTypeList = S.Array(S.String);
export class ListClientDevicesAssociatedWithCoreDeviceResponse extends S.Class<ListClientDevicesAssociatedWithCoreDeviceResponse>(
  "ListClientDevicesAssociatedWithCoreDeviceResponse",
)({
  associatedClientDevices: S.optional(AssociatedClientDeviceList),
  nextToken: S.optional(S.String),
}) {}
export class ListComponentVersionsResponse extends S.Class<ListComponentVersionsResponse>(
  "ListComponentVersionsResponse",
)({
  componentVersions: S.optional(ComponentVersionList),
  nextToken: S.optional(S.String),
}) {}
export class ListCoreDevicesResponse extends S.Class<ListCoreDevicesResponse>(
  "ListCoreDevicesResponse",
)({
  coreDevices: S.optional(CoreDevicesList),
  nextToken: S.optional(S.String),
}) {}
export class ListDeploymentsResponse extends S.Class<ListDeploymentsResponse>(
  "ListDeploymentsResponse",
)({
  deployments: S.optional(DeploymentList),
  nextToken: S.optional(S.String),
}) {}
export class ListInstalledComponentsResponse extends S.Class<ListInstalledComponentsResponse>(
  "ListInstalledComponentsResponse",
)({
  installedComponents: S.optional(InstalledComponentList),
  nextToken: S.optional(S.String),
}) {}
export class ResolveComponentCandidatesRequest extends S.Class<ResolveComponentCandidatesRequest>(
  "ResolveComponentCandidatesRequest",
)(
  {
    platform: S.optional(ComponentPlatform),
    componentCandidates: S.optional(ComponentCandidateList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/v2/resolveComponentCandidates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConnectivityInfoResponse extends S.Class<UpdateConnectivityInfoResponse>(
  "UpdateConnectivityInfoResponse",
)({
  version: S.optional(S.String).pipe(T.JsonName("Version")),
  message: S.optional(S.String).pipe(T.JsonName("Message")),
}) {}
export const ComponentDependencyMap = S.Record({
  key: S.String,
  value: ComponentDependencyRequirement,
});
export const StringMap = S.Record({ key: S.String, value: S.String });
export class ComponentLatestVersion extends S.Class<ComponentLatestVersion>(
  "ComponentLatestVersion",
)({
  arn: S.optional(S.String),
  componentVersion: S.optional(S.String),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  description: S.optional(S.String),
  publisher: S.optional(S.String),
  platforms: S.optional(ComponentPlatformList),
}) {}
export class EffectiveDeploymentStatusDetails extends S.Class<EffectiveDeploymentStatusDetails>(
  "EffectiveDeploymentStatusDetails",
)({
  errorStack: S.optional(EffectiveDeploymentErrorStack),
  errorTypes: S.optional(EffectiveDeploymentErrorTypeList),
}) {}
export class AssociateClientDeviceWithCoreDeviceErrorEntry extends S.Class<AssociateClientDeviceWithCoreDeviceErrorEntry>(
  "AssociateClientDeviceWithCoreDeviceErrorEntry",
)({
  thingName: S.optional(S.String),
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const AssociateClientDeviceWithCoreDeviceErrorList = S.Array(
  AssociateClientDeviceWithCoreDeviceErrorEntry,
);
export class DisassociateClientDeviceFromCoreDeviceErrorEntry extends S.Class<DisassociateClientDeviceFromCoreDeviceErrorEntry>(
  "DisassociateClientDeviceFromCoreDeviceErrorEntry",
)({
  thingName: S.optional(S.String),
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const DisassociateClientDeviceFromCoreDeviceErrorList = S.Array(
  DisassociateClientDeviceFromCoreDeviceErrorEntry,
);
export class CloudComponentStatus extends S.Class<CloudComponentStatus>(
  "CloudComponentStatus",
)({
  componentState: S.optional(S.String),
  message: S.optional(S.String),
  errors: S.optional(StringMap),
  vendorGuidance: S.optional(S.String),
  vendorGuidanceMessage: S.optional(S.String),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class Component extends S.Class<Component>("Component")({
  arn: S.optional(S.String),
  componentName: S.optional(S.String),
  latestVersion: S.optional(ComponentLatestVersion),
}) {}
export const ComponentList = S.Array(Component);
export class EffectiveDeployment extends S.Class<EffectiveDeployment>(
  "EffectiveDeployment",
)({
  deploymentId: S.String,
  deploymentName: S.String,
  iotJobId: S.optional(S.String),
  iotJobArn: S.optional(S.String),
  description: S.optional(S.String),
  targetArn: S.String,
  coreDeviceExecutionStatus: S.String,
  reason: S.optional(S.String),
  creationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  statusDetails: S.optional(EffectiveDeploymentStatusDetails),
}) {}
export const EffectiveDeploymentsList = S.Array(EffectiveDeployment);
export class BatchAssociateClientDeviceWithCoreDeviceResponse extends S.Class<BatchAssociateClientDeviceWithCoreDeviceResponse>(
  "BatchAssociateClientDeviceWithCoreDeviceResponse",
)({ errorEntries: S.optional(AssociateClientDeviceWithCoreDeviceErrorList) }) {}
export class BatchDisassociateClientDeviceFromCoreDeviceResponse extends S.Class<BatchDisassociateClientDeviceFromCoreDeviceResponse>(
  "BatchDisassociateClientDeviceFromCoreDeviceResponse",
)({
  errorEntries: S.optional(DisassociateClientDeviceFromCoreDeviceErrorList),
}) {}
export class LambdaVolumeMount extends S.Class<LambdaVolumeMount>(
  "LambdaVolumeMount",
)({
  sourcePath: S.String,
  destinationPath: S.String,
  permission: S.optional(S.String),
  addGroupOwner: S.optional(S.Boolean),
}) {}
export const LambdaVolumeList = S.Array(LambdaVolumeMount);
export class LambdaDeviceMount extends S.Class<LambdaDeviceMount>(
  "LambdaDeviceMount",
)({
  path: S.String,
  permission: S.optional(S.String),
  addGroupOwner: S.optional(S.Boolean),
}) {}
export const LambdaDeviceList = S.Array(LambdaDeviceMount);
export class DescribeComponentResponse extends S.Class<DescribeComponentResponse>(
  "DescribeComponentResponse",
)({
  arn: S.optional(S.String),
  componentName: S.optional(S.String),
  componentVersion: S.optional(S.String),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  publisher: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(CloudComponentStatus),
  platforms: S.optional(ComponentPlatformList),
  tags: S.optional(TagMap),
}) {}
export class ListComponentsResponse extends S.Class<ListComponentsResponse>(
  "ListComponentsResponse",
)({ components: S.optional(ComponentList), nextToken: S.optional(S.String) }) {}
export class ListEffectiveDeploymentsResponse extends S.Class<ListEffectiveDeploymentsResponse>(
  "ListEffectiveDeploymentsResponse",
)({
  effectiveDeployments: S.optional(EffectiveDeploymentsList),
  nextToken: S.optional(S.String),
}) {}
export class LambdaContainerParams extends S.Class<LambdaContainerParams>(
  "LambdaContainerParams",
)({
  memorySizeInKB: S.optional(S.Number),
  mountROSysfs: S.optional(S.Boolean),
  volumes: S.optional(LambdaVolumeList),
  devices: S.optional(LambdaDeviceList),
}) {}
export class ResolvedComponentVersion extends S.Class<ResolvedComponentVersion>(
  "ResolvedComponentVersion",
)({
  arn: S.optional(S.String),
  componentName: S.optional(S.String),
  componentVersion: S.optional(S.String),
  recipe: S.optional(T.Blob),
  vendorGuidance: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const ResolvedComponentVersionsList = S.Array(ResolvedComponentVersion);
export class LambdaLinuxProcessParams extends S.Class<LambdaLinuxProcessParams>(
  "LambdaLinuxProcessParams",
)({
  isolationMode: S.optional(S.String),
  containerParams: S.optional(LambdaContainerParams),
}) {}
export class CreateDeploymentRequest extends S.Class<CreateDeploymentRequest>(
  "CreateDeploymentRequest",
)(
  {
    targetArn: S.String,
    deploymentName: S.optional(S.String),
    components: S.optional(ComponentDeploymentSpecifications),
    iotJobConfiguration: S.optional(DeploymentIoTJobConfiguration),
    deploymentPolicies: S.optional(DeploymentPolicies),
    parentTargetArn: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/v2/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResolveComponentCandidatesResponse extends S.Class<ResolveComponentCandidatesResponse>(
  "ResolveComponentCandidatesResponse",
)({ resolvedComponentVersions: S.optional(ResolvedComponentVersionsList) }) {}
export class LambdaExecutionParameters extends S.Class<LambdaExecutionParameters>(
  "LambdaExecutionParameters",
)({
  eventSources: S.optional(LambdaEventSourceList),
  maxQueueSize: S.optional(S.Number),
  maxInstancesCount: S.optional(S.Number),
  maxIdleTimeInSeconds: S.optional(S.Number),
  timeoutInSeconds: S.optional(S.Number),
  statusTimeoutInSeconds: S.optional(S.Number),
  pinned: S.optional(S.Boolean),
  inputPayloadEncodingType: S.optional(S.String),
  execArgs: S.optional(LambdaExecArgsList),
  environmentVariables: S.optional(LambdaEnvironmentVariables),
  linuxProcessParams: S.optional(LambdaLinuxProcessParams),
}) {}
export class LambdaFunctionRecipeSource extends S.Class<LambdaFunctionRecipeSource>(
  "LambdaFunctionRecipeSource",
)({
  lambdaArn: S.String,
  componentName: S.optional(S.String),
  componentVersion: S.optional(S.String),
  componentPlatforms: S.optional(ComponentPlatformList),
  componentDependencies: S.optional(ComponentDependencyMap),
  componentLambdaParameters: S.optional(LambdaExecutionParameters),
}) {}
export class CreateComponentVersionRequest extends S.Class<CreateComponentVersionRequest>(
  "CreateComponentVersionRequest",
)(
  {
    inlineRecipe: S.optional(T.Blob),
    lambdaFunction: S.optional(LambdaFunctionRecipeSource),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/v2/createComponentVersion" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDeploymentResponse extends S.Class<CreateDeploymentResponse>(
  "CreateDeploymentResponse",
)({
  deploymentId: S.optional(S.String),
  iotJobId: S.optional(S.String),
  iotJobArn: S.optional(S.String),
}) {}
export class CreateComponentVersionResponse extends S.Class<CreateComponentVersionResponse>(
  "CreateComponentVersionResponse",
)({
  arn: S.optional(S.String),
  componentName: S.String,
  componentVersion: S.String,
  creationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: CloudComponentStatus,
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
) {}
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
    quotaCode: S.optional(S.String),
    serviceCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(S.String),
    fields: S.optional(ValidationExceptionFieldList),
  },
) {}
export class RequestAlreadyInProgressException extends S.TaggedError<RequestAlreadyInProgressException>()(
  "RequestAlreadyInProgressException",
  { message: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    quotaCode: S.String,
    serviceCode: S.String,
  },
) {}

//# Operations
/**
 * Disassociates the Greengrass service role from IoT Greengrass for your Amazon Web Services account in this Amazon Web Services Region.
 * Without a service role, IoT Greengrass can't verify the identity of client devices or manage core device
 * connectivity information. For more information, see Greengrass service role in
 * the *IoT Greengrass Version 2 Developer Guide*.
 */
export const disassociateServiceRoleFromAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateServiceRoleFromAccountRequest,
    output: DisassociateServiceRoleFromAccountResponse,
    errors: [InternalServerException],
  }));
/**
 * Gets the service role associated with IoT Greengrass for your Amazon Web Services account in this Amazon Web Services Region.
 * IoT Greengrass uses this role to verify the identity of client devices and manage core device
 * connectivity information. For more information, see Greengrass service role in
 * the *IoT Greengrass Version 2 Developer Guide*.
 */
export const getServiceRoleForAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetServiceRoleForAccountRequest,
    output: GetServiceRoleForAccountResponse,
    errors: [InternalServerException],
  }),
);
/**
 * Retrieves connectivity information for a Greengrass core device.
 *
 * Connectivity information includes endpoints and ports where client devices
 * can connect to an MQTT broker on the core device. When a client device
 * calls the IoT Greengrass discovery API,
 * IoT Greengrass returns connectivity information for all of the core devices where the client device can
 * connect. For more information, see Connect client devices to
 * core devices in the *IoT Greengrass Version 2 Developer Guide*.
 */
export const getConnectivityInfo = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectivityInfoRequest,
  output: GetConnectivityInfoResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Retrieves a paginated list of component summaries. This list includes components that you
 * have permission to view.
 */
export const listComponents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListComponentsRequest,
  output: ListComponentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a paginated list of deployment jobs that IoT Greengrass sends to Greengrass core devices.
 */
export const listEffectiveDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEffectiveDeploymentsRequest,
    output: ListEffectiveDeploymentsResponse,
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
 * Retrieves a paginated list of client devices that are associated with a core
 * device.
 */
export const listClientDevicesAssociatedWithCoreDevice =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListClientDevicesAssociatedWithCoreDeviceRequest,
    output: ListClientDevicesAssociatedWithCoreDeviceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a paginated list of all versions for a component. Greater versions are listed
 * first.
 */
export const listComponentVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListComponentVersionsRequest,
    output: ListComponentVersionsResponse,
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
 * Retrieves a paginated list of Greengrass core devices.
 *
 * IoT Greengrass relies on individual devices to send status updates to the Amazon Web Services Cloud. If the
 * IoT Greengrass Core software isn't running on the device, or if device isn't connected to the Amazon Web Services Cloud,
 * then the reported status of that device might not reflect its current status. The status
 * timestamp indicates when the device status was last updated.
 *
 * Core devices send status updates at the following times:
 *
 * - When the IoT Greengrass Core software starts
 *
 * - When the core device receives a deployment from the Amazon Web Services Cloud
 *
 * - For Greengrass nucleus 2.12.2 and earlier, the core device sends status updates when the
 * status of any component on the core device becomes `ERRORED` or
 * `BROKEN`.
 *
 * - For Greengrass nucleus 2.12.3 and later, the core device sends status updates when the
 * status of any component on the core device becomes `ERRORED`,
 * `BROKEN`, `RUNNING`, or `FINISHED`.
 *
 * - At a regular interval that you can configure, which defaults to 24 hours
 *
 * - For IoT Greengrass Core v2.7.0, the core device sends status updates upon local deployment and
 * cloud deployment
 */
export const listCoreDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCoreDevicesRequest,
  output: ListCoreDevicesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a paginated list of deployments.
 */
export const listDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDeploymentsRequest,
  output: ListDeploymentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a paginated list of the components that a Greengrass core device runs. By default,
 * this list doesn't include components that are deployed as dependencies of other components. To
 * include dependencies in the response, set the `topologyFilter` parameter to
 * `ALL`.
 *
 * IoT Greengrass relies on individual devices to send status updates to the Amazon Web Services Cloud. If the
 * IoT Greengrass Core software isn't running on the device, or if device isn't connected to the Amazon Web Services Cloud,
 * then the reported status of that device might not reflect its current status. The status
 * timestamp indicates when the device status was last updated.
 *
 * Core devices send status updates at the following times:
 *
 * - When the IoT Greengrass Core software starts
 *
 * - When the core device receives a deployment from the Amazon Web Services Cloud
 *
 * - When the status of any component on the core device becomes
 * `BROKEN`
 *
 * - At a regular interval that you can configure, which defaults to 24 hours
 *
 * - For IoT Greengrass Core v2.7.0, the core device sends status updates upon local deployment and
 * cloud deployment
 */
export const listInstalledComponents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInstalledComponentsRequest,
    output: ListInstalledComponentsResponse,
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
 * Deletes a Greengrass core device, which is an IoT thing. This operation removes the core
 * device from the list of core devices. This operation doesn't delete the IoT thing. For more
 * information about how to delete the IoT thing, see DeleteThing in the
 * *IoT API Reference*.
 */
export const deleteCoreDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCoreDeviceRequest,
  output: DeleteCoreDeviceResponse,
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
 * Deletes a deployment. To delete an active deployment, you must first cancel it. For more
 * information, see CancelDeployment.
 *
 * Deleting a deployment doesn't affect core devices that run that deployment, because core
 * devices store the deployment's configuration on the device. Additionally, core devices can
 * roll back to a previous deployment that has been deleted.
 */
export const deleteDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentRequest,
  output: DeleteDeploymentResponse,
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
 * Cancels a deployment. This operation cancels the deployment for devices that haven't yet
 * received it. If a device already received the deployment, this operation doesn't change
 * anything for that device.
 */
export const cancelDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelDeploymentRequest,
  output: CancelDeploymentResponse,
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
 * Gets the pre-signed URL to download a public or a Lambda component artifact. Core devices
 * call this operation to identify the URL that they can use to download an artifact to
 * install.
 */
export const getComponentVersionArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetComponentVersionArtifactRequest,
    output: GetComponentVersionArtifactResponse,
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
 * Retrieves metadata for a Greengrass core device.
 *
 * IoT Greengrass relies on individual devices to send status updates to the Amazon Web Services Cloud. If the
 * IoT Greengrass Core software isn't running on the device, or if device isn't connected to the Amazon Web Services Cloud,
 * then the reported status of that device might not reflect its current status. The status
 * timestamp indicates when the device status was last updated.
 *
 * Core devices send status updates at the following times:
 *
 * - When the IoT Greengrass Core software starts
 *
 * - When the core device receives a deployment from the Amazon Web Services Cloud
 *
 * - When the status of any component on the core device becomes
 * `BROKEN`
 *
 * - At a regular interval that you can configure, which defaults to 24 hours
 *
 * - For IoT Greengrass Core v2.7.0, the core device sends status updates upon local deployment and
 * cloud deployment
 */
export const getCoreDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCoreDeviceRequest,
  output: GetCoreDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a deployment. Deployments define the components that run on Greengrass core devices.
 */
export const getDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentRequest,
  output: GetDeploymentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a version of a component from IoT Greengrass.
 *
 * This operation deletes the component's recipe and artifacts. As a result, deployments
 * that refer to this component version will fail. If you have deployments that use this
 * component version, you can remove the component from the deployment or update the deployment
 * to use a valid version.
 */
export const deleteComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComponentRequest,
  output: DeleteComponentResponse,
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
 * Associates a list of client devices with a core device. Use this API operation to specify
 * which client devices can discover a core device through cloud discovery. With cloud discovery,
 * client devices connect to IoT Greengrass to retrieve associated core devices' connectivity information
 * and certificates. For more information, see Configure cloud
 * discovery in the *IoT Greengrass V2 Developer Guide*.
 *
 * Client devices are local IoT devices that connect to and communicate with an IoT Greengrass core
 * device over MQTT. You can connect client devices to a core device to sync MQTT messages and
 * data to Amazon Web Services IoT Core and interact with client devices in Greengrass components. For more information,
 * see Interact with
 * local IoT devices in the *IoT Greengrass V2 Developer Guide*.
 */
export const batchAssociateClientDeviceWithCoreDevice =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchAssociateClientDeviceWithCoreDeviceRequest,
    output: BatchAssociateClientDeviceWithCoreDeviceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Disassociates a list of client devices from a core device. After you disassociate a client
 * device from a core device, the client device won't be able to use cloud discovery to retrieve
 * the core device's connectivity information and certificates.
 */
export const batchDisassociateClientDeviceFromCoreDevice =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDisassociateClientDeviceFromCoreDeviceRequest,
    output: BatchDisassociateClientDeviceFromCoreDeviceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves metadata for a version of a component.
 */
export const describeComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeComponentRequest,
  output: DescribeComponentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates a Greengrass service role with IoT Greengrass for your Amazon Web Services account in this Amazon Web Services Region. IoT Greengrass
 * uses this role to verify the identity of client devices and manage core device connectivity
 * information. The role must include the AWSGreengrassResourceAccessRolePolicy managed policy or a custom policy that
 * defines equivalent permissions for the IoT Greengrass features that you use. For more information, see
 * Greengrass service role in the *IoT Greengrass Version 2 Developer Guide*.
 */
export const associateServiceRoleToAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateServiceRoleToAccountRequest,
    output: AssociateServiceRoleToAccountResponse,
    errors: [InternalServerException, ValidationException],
  }));
/**
 * Updates connectivity information for a Greengrass core device.
 *
 * Connectivity information includes endpoints and ports where client devices
 * can connect to an MQTT broker on the core device. When a client device
 * calls the IoT Greengrass discovery API,
 * IoT Greengrass returns connectivity information for all of the core devices where the client device can
 * connect. For more information, see Connect client devices to
 * core devices in the *IoT Greengrass Version 2 Developer Guide*.
 */
export const updateConnectivityInfo = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConnectivityInfoRequest,
    output: UpdateConnectivityInfoResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Retrieves the list of tags for an IoT Greengrass resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds tags to an IoT Greengrass resource. If a tag already exists for the resource, this operation
 * updates the tag's value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from an IoT Greengrass resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the recipe for a version of a component.
 */
export const getComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentRequest,
  output: GetComponentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of components that meet the component, version, and platform requirements
 * of a deployment. Greengrass core devices call this operation when they receive a deployment to
 * identify the components to install.
 *
 * This operation identifies components that meet all dependency requirements for a
 * deployment. If the requirements conflict, then this operation returns an error and the
 * deployment fails. For example, this occurs if component `A` requires version
 * `>2.0.0` and component `B` requires version `<2.0.0`
 * of a component dependency.
 *
 * When you specify the component candidates to resolve, IoT Greengrass compares each component's
 * digest from the core device with the component's digest in the Amazon Web Services Cloud. If the digests
 * don't match, then IoT Greengrass specifies to use the version from the Amazon Web Services Cloud.
 *
 * To use this operation, you must use the data plane API endpoint and authenticate with an
 * IoT device certificate. For more information, see IoT Greengrass endpoints and quotas.
 */
export const resolveComponentCandidates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResolveComponentCandidatesRequest,
    output: ResolveComponentCandidatesResponse,
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
 * Creates a continuous deployment for a target, which is a Greengrass core device or group of core
 * devices. When you add a new core device to a group of core devices that has a deployment, IoT Greengrass
 * deploys that group's deployment to the new device.
 *
 * You can define one deployment for each target. When you create a new deployment for a
 * target that has an existing deployment, you replace the previous deployment. IoT Greengrass applies the
 * new deployment to the target devices.
 *
 * Every deployment has a revision number that indicates how many deployment revisions you
 * define for a target. Use this operation to create a new revision of an existing
 * deployment.
 *
 * For more information, see the Create deployments in the
 * *IoT Greengrass V2 Developer Guide*.
 */
export const createDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeploymentRequest,
  output: CreateDeploymentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestAlreadyInProgressException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a component. Components are software that run on Greengrass core devices. After you
 * develop and test a component on your core device, you can use this operation to upload your
 * component to IoT Greengrass. Then, you can deploy the component to other core devices.
 *
 * You can use this operation to do the following:
 *
 * - **Create components from recipes**
 *
 * Create a component from a recipe, which is a file that defines the component's
 * metadata, parameters, dependencies, lifecycle, artifacts, and platform capability. For
 * more information, see IoT Greengrass component recipe
 * reference in the *IoT Greengrass V2 Developer Guide*.
 *
 * To create a component from a recipe, specify `inlineRecipe` when you call
 * this operation.
 *
 * - **Create components from Lambda functions**
 *
 * Create a component from an Lambda function that runs on IoT Greengrass. This creates a recipe
 * and artifacts from the Lambda function's deployment package. You can use this operation to
 * migrate Lambda functions from IoT Greengrass V1 to IoT Greengrass V2.
 *
 * This function accepts Lambda functions in all supported versions of Python, Node.js,
 * and Java runtimes. IoT Greengrass doesn't apply any additional restrictions on deprecated Lambda
 * runtime versions.
 *
 * To create a component from a Lambda function, specify `lambdaFunction` when
 * you call this operation.
 *
 * IoT Greengrass currently supports Lambda functions on only Linux core devices.
 */
export const createComponentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateComponentVersionRequest,
    output: CreateComponentVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestAlreadyInProgressException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

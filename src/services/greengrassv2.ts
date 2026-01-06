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

//# Newtypes
export type IoTThingName = string;
export type NonEmptyString = string;
export type ClientTokenString = string;
export type TargetARN = string;
export type DeploymentNameString = string;
export type ThingGroupARN = string;
export type ComponentVersionARN = string;
export type CoreDeviceThingName = string;
export type DefaultMaxResults = number;
export type NextTokenString = string;
export type ComponentARN = string;
export type CoreDeviceRuntimeString = string;
export type GenericV2ARN = string;
export type TagKey = string;
export type ComponentNameString = string;
export type ComponentVersionString = string;
export type TagValue = string;
export type PortNumberInt = number;
export type PublisherString = string;
export type DescriptionString = string;
export type RetryAfterSeconds = number;
export type GGCVersion = string;
export type CoreDevicePlatformString = string;
export type CoreDeviceArchitectureString = string;
export type NullableString = string;
export type IoTJobARN = string;
export type OptionalInteger = number;
export type LambdaExecArg = string;
export type IoTJobMaxExecutionsPerMin = number;
export type IoTJobInProgressTimeoutInMinutes = number;
export type DeploymentID = string;
export type DeploymentName = string;
export type IoTJobId = string;
export type Description = string;
export type Reason = string;
export type LifecycleStateDetails = string;
export type InstalledComponentLifecycleStatusCode = string;
export type TopicString = string;
export type ComponentConfigurationString = string;
export type ComponentConfigurationPath = string;
export type IoTJobRolloutBaseRatePerMinute = number;
export type IoTJobRolloutIncrementFactor = number;
export type IoTJobAbortThresholdPercentage = number;
export type IoTJobMinimumNumberOfExecutedThings = number;
export type EffectiveDeploymentErrorCode = string;
export type EffectiveDeploymentErrorType = string;
export type Memory = number;
export type CPU = number;
export type IoTJobNumberOfThings = number;
export type FileSystemPath = string;

//# Schemas
export interface DisassociateServiceRoleFromAccountRequest {}
export const DisassociateServiceRoleFromAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/greengrass/servicerole" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateServiceRoleFromAccountRequest",
}) as any as S.Schema<DisassociateServiceRoleFromAccountRequest>;
export interface GetServiceRoleForAccountRequest {}
export const GetServiceRoleForAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/greengrass/servicerole" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServiceRoleForAccountRequest",
}) as any as S.Schema<GetServiceRoleForAccountRequest>;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateServiceRoleToAccountRequest {
  roleArn: string;
}
export const AssociateServiceRoleToAccountRequest = S.suspend(() =>
  S.Struct({ roleArn: S.String.pipe(T.JsonName("RoleArn")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/greengrass/servicerole" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateServiceRoleToAccountRequest",
}) as any as S.Schema<AssociateServiceRoleToAccountRequest>;
export interface CancelDeploymentRequest {
  deploymentId: string;
}
export const CancelDeploymentRequest = S.suspend(() =>
  S.Struct({ deploymentId: S.String.pipe(T.HttpLabel("deploymentId")) }).pipe(
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
  ),
).annotations({
  identifier: "CancelDeploymentRequest",
}) as any as S.Schema<CancelDeploymentRequest>;
export interface DeleteComponentRequest {
  arn: string;
}
export const DeleteComponentRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/greengrass/v2/components/{arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteComponentRequest",
}) as any as S.Schema<DeleteComponentRequest>;
export interface DeleteComponentResponse {}
export const DeleteComponentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteComponentResponse",
}) as any as S.Schema<DeleteComponentResponse>;
export interface DeleteCoreDeviceRequest {
  coreDeviceThingName: string;
}
export const DeleteCoreDeviceRequest = S.suspend(() =>
  S.Struct({
    coreDeviceThingName: S.String.pipe(T.HttpLabel("coreDeviceThingName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCoreDeviceRequest",
}) as any as S.Schema<DeleteCoreDeviceRequest>;
export interface DeleteCoreDeviceResponse {}
export const DeleteCoreDeviceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCoreDeviceResponse",
}) as any as S.Schema<DeleteCoreDeviceResponse>;
export interface DeleteDeploymentRequest {
  deploymentId: string;
}
export const DeleteDeploymentRequest = S.suspend(() =>
  S.Struct({ deploymentId: S.String.pipe(T.HttpLabel("deploymentId")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDeploymentRequest",
}) as any as S.Schema<DeleteDeploymentRequest>;
export interface DeleteDeploymentResponse {}
export const DeleteDeploymentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDeploymentResponse",
}) as any as S.Schema<DeleteDeploymentResponse>;
export interface DescribeComponentRequest {
  arn: string;
}
export const DescribeComponentRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/greengrass/v2/components/{arn}/metadata",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeComponentRequest",
}) as any as S.Schema<DescribeComponentRequest>;
export interface DisassociateServiceRoleFromAccountResponse {
  disassociatedAt?: string;
}
export const DisassociateServiceRoleFromAccountResponse = S.suspend(() =>
  S.Struct({
    disassociatedAt: S.optional(S.String).pipe(T.JsonName("DisassociatedAt")),
  }),
).annotations({
  identifier: "DisassociateServiceRoleFromAccountResponse",
}) as any as S.Schema<DisassociateServiceRoleFromAccountResponse>;
export interface GetComponentRequest {
  recipeOutputFormat?: string;
  arn: string;
}
export const GetComponentRequest = S.suspend(() =>
  S.Struct({
    recipeOutputFormat: S.optional(S.String).pipe(
      T.HttpQuery("recipeOutputFormat"),
    ),
    arn: S.String.pipe(T.HttpLabel("arn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/greengrass/v2/components/{arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetComponentRequest",
}) as any as S.Schema<GetComponentRequest>;
export interface GetComponentVersionArtifactRequest {
  arn: string;
  artifactName: string;
  s3EndpointType?: string;
  iotEndpointType?: string;
}
export const GetComponentVersionArtifactRequest = S.suspend(() =>
  S.Struct({
    arn: S.String.pipe(T.HttpLabel("arn")),
    artifactName: S.String.pipe(T.HttpLabel("artifactName")),
    s3EndpointType: S.optional(S.String).pipe(T.HttpQuery("s3EndpointType")),
    iotEndpointType: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-iot-endpoint-type"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetComponentVersionArtifactRequest",
}) as any as S.Schema<GetComponentVersionArtifactRequest>;
export interface GetConnectivityInfoRequest {
  thingName: string;
}
export const GetConnectivityInfoRequest = S.suspend(() =>
  S.Struct({ thingName: S.String.pipe(T.HttpLabel("thingName")) }).pipe(
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
  ),
).annotations({
  identifier: "GetConnectivityInfoRequest",
}) as any as S.Schema<GetConnectivityInfoRequest>;
export interface GetCoreDeviceRequest {
  coreDeviceThingName: string;
}
export const GetCoreDeviceRequest = S.suspend(() =>
  S.Struct({
    coreDeviceThingName: S.String.pipe(T.HttpLabel("coreDeviceThingName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCoreDeviceRequest",
}) as any as S.Schema<GetCoreDeviceRequest>;
export interface GetDeploymentRequest {
  deploymentId: string;
}
export const GetDeploymentRequest = S.suspend(() =>
  S.Struct({ deploymentId: S.String.pipe(T.HttpLabel("deploymentId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/greengrass/v2/deployments/{deploymentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentRequest",
}) as any as S.Schema<GetDeploymentRequest>;
export interface GetServiceRoleForAccountResponse {
  associatedAt?: string;
  roleArn?: string;
}
export const GetServiceRoleForAccountResponse = S.suspend(() =>
  S.Struct({
    associatedAt: S.optional(S.String).pipe(T.JsonName("AssociatedAt")),
    roleArn: S.optional(S.String).pipe(T.JsonName("RoleArn")),
  }),
).annotations({
  identifier: "GetServiceRoleForAccountResponse",
}) as any as S.Schema<GetServiceRoleForAccountResponse>;
export interface ListClientDevicesAssociatedWithCoreDeviceRequest {
  coreDeviceThingName: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListClientDevicesAssociatedWithCoreDeviceRequest = S.suspend(() =>
  S.Struct({
    coreDeviceThingName: S.String.pipe(T.HttpLabel("coreDeviceThingName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListClientDevicesAssociatedWithCoreDeviceRequest",
}) as any as S.Schema<ListClientDevicesAssociatedWithCoreDeviceRequest>;
export interface ListComponentsRequest {
  scope?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListComponentsRequest = S.suspend(() =>
  S.Struct({
    scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/greengrass/v2/components" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComponentsRequest",
}) as any as S.Schema<ListComponentsRequest>;
export interface ListComponentVersionsRequest {
  arn: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListComponentVersionsRequest = S.suspend(() =>
  S.Struct({
    arn: S.String.pipe(T.HttpLabel("arn")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/greengrass/v2/components/{arn}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComponentVersionsRequest",
}) as any as S.Schema<ListComponentVersionsRequest>;
export interface ListCoreDevicesRequest {
  thingGroupArn?: string;
  status?: string;
  maxResults?: number;
  nextToken?: string;
  runtime?: string;
}
export const ListCoreDevicesRequest = S.suspend(() =>
  S.Struct({
    thingGroupArn: S.optional(S.String).pipe(T.HttpQuery("thingGroupArn")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    runtime: S.optional(S.String).pipe(T.HttpQuery("runtime")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/greengrass/v2/coreDevices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCoreDevicesRequest",
}) as any as S.Schema<ListCoreDevicesRequest>;
export interface ListDeploymentsRequest {
  targetArn?: string;
  historyFilter?: string;
  parentTargetArn?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListDeploymentsRequest = S.suspend(() =>
  S.Struct({
    targetArn: S.optional(S.String).pipe(T.HttpQuery("targetArn")),
    historyFilter: S.optional(S.String).pipe(T.HttpQuery("historyFilter")),
    parentTargetArn: S.optional(S.String).pipe(T.HttpQuery("parentTargetArn")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/greengrass/v2/deployments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeploymentsRequest",
}) as any as S.Schema<ListDeploymentsRequest>;
export interface ListEffectiveDeploymentsRequest {
  coreDeviceThingName: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListEffectiveDeploymentsRequest = S.suspend(() =>
  S.Struct({
    coreDeviceThingName: S.String.pipe(T.HttpLabel("coreDeviceThingName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListEffectiveDeploymentsRequest",
}) as any as S.Schema<ListEffectiveDeploymentsRequest>;
export interface ListInstalledComponentsRequest {
  coreDeviceThingName: string;
  maxResults?: number;
  nextToken?: string;
  topologyFilter?: string;
}
export const ListInstalledComponentsRequest = S.suspend(() =>
  S.Struct({
    coreDeviceThingName: S.String.pipe(T.HttpLabel("coreDeviceThingName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    topologyFilter: S.optional(S.String).pipe(T.HttpQuery("topologyFilter")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListInstalledComponentsRequest",
}) as any as S.Schema<ListInstalledComponentsRequest>;
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
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
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
export type PlatformAttributesMap = { [key: string]: string };
export const PlatformAttributesMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface ComponentPlatform {
  name?: string;
  attributes?: PlatformAttributesMap;
}
export const ComponentPlatform = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    attributes: S.optional(PlatformAttributesMap),
  }),
).annotations({
  identifier: "ComponentPlatform",
}) as any as S.Schema<ComponentPlatform>;
export type ComponentPlatformList = ComponentPlatform[];
export const ComponentPlatformList = S.Array(ComponentPlatform);
export interface AssociateClientDeviceWithCoreDeviceEntry {
  thingName: string;
}
export const AssociateClientDeviceWithCoreDeviceEntry = S.suspend(() =>
  S.Struct({ thingName: S.String }),
).annotations({
  identifier: "AssociateClientDeviceWithCoreDeviceEntry",
}) as any as S.Schema<AssociateClientDeviceWithCoreDeviceEntry>;
export type AssociateClientDeviceWithCoreDeviceEntryList =
  AssociateClientDeviceWithCoreDeviceEntry[];
export const AssociateClientDeviceWithCoreDeviceEntryList = S.Array(
  AssociateClientDeviceWithCoreDeviceEntry,
);
export interface DisassociateClientDeviceFromCoreDeviceEntry {
  thingName: string;
}
export const DisassociateClientDeviceFromCoreDeviceEntry = S.suspend(() =>
  S.Struct({ thingName: S.String }),
).annotations({
  identifier: "DisassociateClientDeviceFromCoreDeviceEntry",
}) as any as S.Schema<DisassociateClientDeviceFromCoreDeviceEntry>;
export type DisassociateClientDeviceFromCoreDeviceEntryList =
  DisassociateClientDeviceFromCoreDeviceEntry[];
export const DisassociateClientDeviceFromCoreDeviceEntryList = S.Array(
  DisassociateClientDeviceFromCoreDeviceEntry,
);
export interface ConnectivityInfo {
  id?: string;
  hostAddress?: string;
  portNumber?: number;
  metadata?: string;
}
export const ConnectivityInfo = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String).pipe(T.JsonName("Id")),
    hostAddress: S.optional(S.String).pipe(T.JsonName("HostAddress")),
    portNumber: S.optional(S.Number).pipe(T.JsonName("PortNumber")),
    metadata: S.optional(S.String).pipe(T.JsonName("Metadata")),
  }),
).annotations({
  identifier: "ConnectivityInfo",
}) as any as S.Schema<ConnectivityInfo>;
export type connectivityInfoList = ConnectivityInfo[];
export const connectivityInfoList = S.Array(ConnectivityInfo);
export type LambdaExecArgsList = string[];
export const LambdaExecArgsList = S.Array(S.String);
export interface AssociateServiceRoleToAccountResponse {
  associatedAt?: string;
}
export const AssociateServiceRoleToAccountResponse = S.suspend(() =>
  S.Struct({
    associatedAt: S.optional(S.String).pipe(T.JsonName("AssociatedAt")),
  }),
).annotations({
  identifier: "AssociateServiceRoleToAccountResponse",
}) as any as S.Schema<AssociateServiceRoleToAccountResponse>;
export interface BatchAssociateClientDeviceWithCoreDeviceRequest {
  entries?: AssociateClientDeviceWithCoreDeviceEntryList;
  coreDeviceThingName: string;
}
export const BatchAssociateClientDeviceWithCoreDeviceRequest = S.suspend(() =>
  S.Struct({
    entries: S.optional(AssociateClientDeviceWithCoreDeviceEntryList),
    coreDeviceThingName: S.String.pipe(T.HttpLabel("coreDeviceThingName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchAssociateClientDeviceWithCoreDeviceRequest",
}) as any as S.Schema<BatchAssociateClientDeviceWithCoreDeviceRequest>;
export interface BatchDisassociateClientDeviceFromCoreDeviceRequest {
  entries?: DisassociateClientDeviceFromCoreDeviceEntryList;
  coreDeviceThingName: string;
}
export const BatchDisassociateClientDeviceFromCoreDeviceRequest = S.suspend(
  () =>
    S.Struct({
      entries: S.optional(DisassociateClientDeviceFromCoreDeviceEntryList),
      coreDeviceThingName: S.String.pipe(T.HttpLabel("coreDeviceThingName")),
    }).pipe(
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
    ),
).annotations({
  identifier: "BatchDisassociateClientDeviceFromCoreDeviceRequest",
}) as any as S.Schema<BatchDisassociateClientDeviceFromCoreDeviceRequest>;
export interface CancelDeploymentResponse {
  message?: string;
}
export const CancelDeploymentResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "CancelDeploymentResponse",
}) as any as S.Schema<CancelDeploymentResponse>;
export interface GetComponentResponse {
  recipeOutputFormat: string;
  recipe: Uint8Array;
  tags?: TagMap;
}
export const GetComponentResponse = S.suspend(() =>
  S.Struct({
    recipeOutputFormat: S.String,
    recipe: T.Blob,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetComponentResponse",
}) as any as S.Schema<GetComponentResponse>;
export interface GetComponentVersionArtifactResponse {
  preSignedUrl: string;
}
export const GetComponentVersionArtifactResponse = S.suspend(() =>
  S.Struct({ preSignedUrl: S.String }),
).annotations({
  identifier: "GetComponentVersionArtifactResponse",
}) as any as S.Schema<GetComponentVersionArtifactResponse>;
export interface GetConnectivityInfoResponse {
  connectivityInfo?: connectivityInfoList;
  message?: string;
}
export const GetConnectivityInfoResponse = S.suspend(() =>
  S.Struct({
    connectivityInfo: S.optional(connectivityInfoList).pipe(
      T.JsonName("ConnectivityInfo"),
    ),
    message: S.optional(S.String).pipe(T.JsonName("Message")),
  }),
).annotations({
  identifier: "GetConnectivityInfoResponse",
}) as any as S.Schema<GetConnectivityInfoResponse>;
export interface GetCoreDeviceResponse {
  coreDeviceThingName?: string;
  coreVersion?: string;
  platform?: string;
  architecture?: string;
  runtime?: string;
  status?: string;
  lastStatusUpdateTimestamp?: Date;
  tags?: TagMap;
}
export const GetCoreDeviceResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetCoreDeviceResponse",
}) as any as S.Schema<GetCoreDeviceResponse>;
export type ComponentConfigurationPathList = string[];
export const ComponentConfigurationPathList = S.Array(S.String);
export interface ComponentConfigurationUpdate {
  merge?: string;
  reset?: ComponentConfigurationPathList;
}
export const ComponentConfigurationUpdate = S.suspend(() =>
  S.Struct({
    merge: S.optional(S.String),
    reset: S.optional(ComponentConfigurationPathList),
  }),
).annotations({
  identifier: "ComponentConfigurationUpdate",
}) as any as S.Schema<ComponentConfigurationUpdate>;
export interface SystemResourceLimits {
  memory?: number;
  cpus?: number;
}
export const SystemResourceLimits = S.suspend(() =>
  S.Struct({ memory: S.optional(S.Number), cpus: S.optional(S.Number) }),
).annotations({
  identifier: "SystemResourceLimits",
}) as any as S.Schema<SystemResourceLimits>;
export interface ComponentRunWith {
  posixUser?: string;
  systemResourceLimits?: SystemResourceLimits;
  windowsUser?: string;
}
export const ComponentRunWith = S.suspend(() =>
  S.Struct({
    posixUser: S.optional(S.String),
    systemResourceLimits: S.optional(SystemResourceLimits),
    windowsUser: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentRunWith",
}) as any as S.Schema<ComponentRunWith>;
export interface ComponentDeploymentSpecification {
  componentVersion: string;
  configurationUpdate?: ComponentConfigurationUpdate;
  runWith?: ComponentRunWith;
}
export const ComponentDeploymentSpecification = S.suspend(() =>
  S.Struct({
    componentVersion: S.String,
    configurationUpdate: S.optional(ComponentConfigurationUpdate),
    runWith: S.optional(ComponentRunWith),
  }),
).annotations({
  identifier: "ComponentDeploymentSpecification",
}) as any as S.Schema<ComponentDeploymentSpecification>;
export type ComponentDeploymentSpecifications = {
  [key: string]: ComponentDeploymentSpecification;
};
export const ComponentDeploymentSpecifications = S.Record({
  key: S.String,
  value: ComponentDeploymentSpecification,
});
export interface DeploymentComponentUpdatePolicy {
  timeoutInSeconds?: number;
  action?: string;
}
export const DeploymentComponentUpdatePolicy = S.suspend(() =>
  S.Struct({
    timeoutInSeconds: S.optional(S.Number),
    action: S.optional(S.String),
  }),
).annotations({
  identifier: "DeploymentComponentUpdatePolicy",
}) as any as S.Schema<DeploymentComponentUpdatePolicy>;
export interface DeploymentConfigurationValidationPolicy {
  timeoutInSeconds?: number;
}
export const DeploymentConfigurationValidationPolicy = S.suspend(() =>
  S.Struct({ timeoutInSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "DeploymentConfigurationValidationPolicy",
}) as any as S.Schema<DeploymentConfigurationValidationPolicy>;
export interface DeploymentPolicies {
  failureHandlingPolicy?: string;
  componentUpdatePolicy?: DeploymentComponentUpdatePolicy;
  configurationValidationPolicy?: DeploymentConfigurationValidationPolicy;
}
export const DeploymentPolicies = S.suspend(() =>
  S.Struct({
    failureHandlingPolicy: S.optional(S.String),
    componentUpdatePolicy: S.optional(DeploymentComponentUpdatePolicy),
    configurationValidationPolicy: S.optional(
      DeploymentConfigurationValidationPolicy,
    ),
  }),
).annotations({
  identifier: "DeploymentPolicies",
}) as any as S.Schema<DeploymentPolicies>;
export interface IoTJobRateIncreaseCriteria {
  numberOfNotifiedThings?: number;
  numberOfSucceededThings?: number;
}
export const IoTJobRateIncreaseCriteria = S.suspend(() =>
  S.Struct({
    numberOfNotifiedThings: S.optional(S.Number),
    numberOfSucceededThings: S.optional(S.Number),
  }),
).annotations({
  identifier: "IoTJobRateIncreaseCriteria",
}) as any as S.Schema<IoTJobRateIncreaseCriteria>;
export interface IoTJobExponentialRolloutRate {
  baseRatePerMinute: number;
  incrementFactor: number;
  rateIncreaseCriteria: IoTJobRateIncreaseCriteria;
}
export const IoTJobExponentialRolloutRate = S.suspend(() =>
  S.Struct({
    baseRatePerMinute: S.Number,
    incrementFactor: S.Number,
    rateIncreaseCriteria: IoTJobRateIncreaseCriteria,
  }),
).annotations({
  identifier: "IoTJobExponentialRolloutRate",
}) as any as S.Schema<IoTJobExponentialRolloutRate>;
export interface IoTJobExecutionsRolloutConfig {
  exponentialRate?: IoTJobExponentialRolloutRate;
  maximumPerMinute?: number;
}
export const IoTJobExecutionsRolloutConfig = S.suspend(() =>
  S.Struct({
    exponentialRate: S.optional(IoTJobExponentialRolloutRate),
    maximumPerMinute: S.optional(S.Number),
  }),
).annotations({
  identifier: "IoTJobExecutionsRolloutConfig",
}) as any as S.Schema<IoTJobExecutionsRolloutConfig>;
export interface IoTJobAbortCriteria {
  failureType: string;
  action: string;
  thresholdPercentage: number;
  minNumberOfExecutedThings: number;
}
export const IoTJobAbortCriteria = S.suspend(() =>
  S.Struct({
    failureType: S.String,
    action: S.String,
    thresholdPercentage: S.Number,
    minNumberOfExecutedThings: S.Number,
  }),
).annotations({
  identifier: "IoTJobAbortCriteria",
}) as any as S.Schema<IoTJobAbortCriteria>;
export type IoTJobAbortCriteriaList = IoTJobAbortCriteria[];
export const IoTJobAbortCriteriaList = S.Array(IoTJobAbortCriteria);
export interface IoTJobAbortConfig {
  criteriaList: IoTJobAbortCriteriaList;
}
export const IoTJobAbortConfig = S.suspend(() =>
  S.Struct({ criteriaList: IoTJobAbortCriteriaList }),
).annotations({
  identifier: "IoTJobAbortConfig",
}) as any as S.Schema<IoTJobAbortConfig>;
export interface IoTJobTimeoutConfig {
  inProgressTimeoutInMinutes?: number;
}
export const IoTJobTimeoutConfig = S.suspend(() =>
  S.Struct({ inProgressTimeoutInMinutes: S.optional(S.Number) }),
).annotations({
  identifier: "IoTJobTimeoutConfig",
}) as any as S.Schema<IoTJobTimeoutConfig>;
export interface DeploymentIoTJobConfiguration {
  jobExecutionsRolloutConfig?: IoTJobExecutionsRolloutConfig;
  abortConfig?: IoTJobAbortConfig;
  timeoutConfig?: IoTJobTimeoutConfig;
}
export const DeploymentIoTJobConfiguration = S.suspend(() =>
  S.Struct({
    jobExecutionsRolloutConfig: S.optional(IoTJobExecutionsRolloutConfig),
    abortConfig: S.optional(IoTJobAbortConfig),
    timeoutConfig: S.optional(IoTJobTimeoutConfig),
  }),
).annotations({
  identifier: "DeploymentIoTJobConfiguration",
}) as any as S.Schema<DeploymentIoTJobConfiguration>;
export interface GetDeploymentResponse {
  targetArn?: string;
  revisionId?: string;
  deploymentId?: string;
  deploymentName?: string;
  deploymentStatus?: string;
  iotJobId?: string;
  iotJobArn?: string;
  components?: ComponentDeploymentSpecifications;
  deploymentPolicies?: DeploymentPolicies;
  iotJobConfiguration?: DeploymentIoTJobConfiguration;
  creationTimestamp?: Date;
  isLatestForTarget?: boolean;
  parentTargetArn?: string;
  tags?: TagMap;
}
export const GetDeploymentResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetDeploymentResponse",
}) as any as S.Schema<GetDeploymentResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateConnectivityInfoRequest {
  thingName: string;
  connectivityInfo: connectivityInfoList;
}
export const UpdateConnectivityInfoRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName"), T.JsonName("ThingName")),
    connectivityInfo: connectivityInfoList.pipe(T.JsonName("ConnectivityInfo")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateConnectivityInfoRequest",
}) as any as S.Schema<UpdateConnectivityInfoRequest>;
export type InstalledComponentLifecycleStatusCodeList = string[];
export const InstalledComponentLifecycleStatusCodeList = S.Array(S.String);
export type ComponentVersionRequirementMap = { [key: string]: string };
export const ComponentVersionRequirementMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface AssociatedClientDevice {
  thingName?: string;
  associationTimestamp?: Date;
}
export const AssociatedClientDevice = S.suspend(() =>
  S.Struct({
    thingName: S.optional(S.String),
    associationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AssociatedClientDevice",
}) as any as S.Schema<AssociatedClientDevice>;
export type AssociatedClientDeviceList = AssociatedClientDevice[];
export const AssociatedClientDeviceList = S.Array(AssociatedClientDevice);
export interface ComponentVersionListItem {
  componentName?: string;
  componentVersion?: string;
  arn?: string;
}
export const ComponentVersionListItem = S.suspend(() =>
  S.Struct({
    componentName: S.optional(S.String),
    componentVersion: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentVersionListItem",
}) as any as S.Schema<ComponentVersionListItem>;
export type ComponentVersionList = ComponentVersionListItem[];
export const ComponentVersionList = S.Array(ComponentVersionListItem);
export interface CoreDevice {
  coreDeviceThingName?: string;
  status?: string;
  lastStatusUpdateTimestamp?: Date;
  platform?: string;
  architecture?: string;
  runtime?: string;
}
export const CoreDevice = S.suspend(() =>
  S.Struct({
    coreDeviceThingName: S.optional(S.String),
    status: S.optional(S.String),
    lastStatusUpdateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    platform: S.optional(S.String),
    architecture: S.optional(S.String),
    runtime: S.optional(S.String),
  }),
).annotations({ identifier: "CoreDevice" }) as any as S.Schema<CoreDevice>;
export type CoreDevicesList = CoreDevice[];
export const CoreDevicesList = S.Array(CoreDevice);
export interface Deployment {
  targetArn?: string;
  revisionId?: string;
  deploymentId?: string;
  deploymentName?: string;
  creationTimestamp?: Date;
  deploymentStatus?: string;
  isLatestForTarget?: boolean;
  parentTargetArn?: string;
}
export const Deployment = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Deployment" }) as any as S.Schema<Deployment>;
export type DeploymentList = Deployment[];
export const DeploymentList = S.Array(Deployment);
export interface InstalledComponent {
  componentName?: string;
  componentVersion?: string;
  lifecycleState?: string;
  lifecycleStateDetails?: string;
  isRoot?: boolean;
  lastStatusChangeTimestamp?: Date;
  lastReportedTimestamp?: Date;
  lastInstallationSource?: string;
  lifecycleStatusCodes?: InstalledComponentLifecycleStatusCodeList;
}
export const InstalledComponent = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "InstalledComponent",
}) as any as S.Schema<InstalledComponent>;
export type InstalledComponentList = InstalledComponent[];
export const InstalledComponentList = S.Array(InstalledComponent);
export interface ComponentCandidate {
  componentName?: string;
  componentVersion?: string;
  versionRequirements?: ComponentVersionRequirementMap;
}
export const ComponentCandidate = S.suspend(() =>
  S.Struct({
    componentName: S.optional(S.String),
    componentVersion: S.optional(S.String),
    versionRequirements: S.optional(ComponentVersionRequirementMap),
  }),
).annotations({
  identifier: "ComponentCandidate",
}) as any as S.Schema<ComponentCandidate>;
export type ComponentCandidateList = ComponentCandidate[];
export const ComponentCandidateList = S.Array(ComponentCandidate);
export interface ComponentDependencyRequirement {
  versionRequirement?: string;
  dependencyType?: string;
}
export const ComponentDependencyRequirement = S.suspend(() =>
  S.Struct({
    versionRequirement: S.optional(S.String),
    dependencyType: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentDependencyRequirement",
}) as any as S.Schema<ComponentDependencyRequirement>;
export interface LambdaEventSource {
  topic: string;
  type: string;
}
export const LambdaEventSource = S.suspend(() =>
  S.Struct({ topic: S.String, type: S.String }),
).annotations({
  identifier: "LambdaEventSource",
}) as any as S.Schema<LambdaEventSource>;
export type LambdaEventSourceList = LambdaEventSource[];
export const LambdaEventSourceList = S.Array(LambdaEventSource);
export type LambdaEnvironmentVariables = { [key: string]: string };
export const LambdaEnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export type EffectiveDeploymentErrorStack = string[];
export const EffectiveDeploymentErrorStack = S.Array(S.String);
export type EffectiveDeploymentErrorTypeList = string[];
export const EffectiveDeploymentErrorTypeList = S.Array(S.String);
export interface ListClientDevicesAssociatedWithCoreDeviceResponse {
  associatedClientDevices?: AssociatedClientDeviceList;
  nextToken?: string;
}
export const ListClientDevicesAssociatedWithCoreDeviceResponse = S.suspend(() =>
  S.Struct({
    associatedClientDevices: S.optional(AssociatedClientDeviceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListClientDevicesAssociatedWithCoreDeviceResponse",
}) as any as S.Schema<ListClientDevicesAssociatedWithCoreDeviceResponse>;
export interface ListComponentVersionsResponse {
  componentVersions?: ComponentVersionList;
  nextToken?: string;
}
export const ListComponentVersionsResponse = S.suspend(() =>
  S.Struct({
    componentVersions: S.optional(ComponentVersionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComponentVersionsResponse",
}) as any as S.Schema<ListComponentVersionsResponse>;
export interface ListCoreDevicesResponse {
  coreDevices?: CoreDevicesList;
  nextToken?: string;
}
export const ListCoreDevicesResponse = S.suspend(() =>
  S.Struct({
    coreDevices: S.optional(CoreDevicesList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCoreDevicesResponse",
}) as any as S.Schema<ListCoreDevicesResponse>;
export interface ListDeploymentsResponse {
  deployments?: DeploymentList;
  nextToken?: string;
}
export const ListDeploymentsResponse = S.suspend(() =>
  S.Struct({
    deployments: S.optional(DeploymentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDeploymentsResponse",
}) as any as S.Schema<ListDeploymentsResponse>;
export interface ListInstalledComponentsResponse {
  installedComponents?: InstalledComponentList;
  nextToken?: string;
}
export const ListInstalledComponentsResponse = S.suspend(() =>
  S.Struct({
    installedComponents: S.optional(InstalledComponentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInstalledComponentsResponse",
}) as any as S.Schema<ListInstalledComponentsResponse>;
export interface ResolveComponentCandidatesRequest {
  platform?: ComponentPlatform;
  componentCandidates?: ComponentCandidateList;
}
export const ResolveComponentCandidatesRequest = S.suspend(() =>
  S.Struct({
    platform: S.optional(ComponentPlatform),
    componentCandidates: S.optional(ComponentCandidateList),
  }).pipe(
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
  ),
).annotations({
  identifier: "ResolveComponentCandidatesRequest",
}) as any as S.Schema<ResolveComponentCandidatesRequest>;
export interface UpdateConnectivityInfoResponse {
  version?: string;
  message?: string;
}
export const UpdateConnectivityInfoResponse = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String).pipe(T.JsonName("Version")),
    message: S.optional(S.String).pipe(T.JsonName("Message")),
  }),
).annotations({
  identifier: "UpdateConnectivityInfoResponse",
}) as any as S.Schema<UpdateConnectivityInfoResponse>;
export type ComponentDependencyMap = {
  [key: string]: ComponentDependencyRequirement;
};
export const ComponentDependencyMap = S.Record({
  key: S.String,
  value: ComponentDependencyRequirement,
});
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export interface ComponentLatestVersion {
  arn?: string;
  componentVersion?: string;
  creationTimestamp?: Date;
  description?: string;
  publisher?: string;
  platforms?: ComponentPlatformList;
}
export const ComponentLatestVersion = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    componentVersion: S.optional(S.String),
    creationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    description: S.optional(S.String),
    publisher: S.optional(S.String),
    platforms: S.optional(ComponentPlatformList),
  }),
).annotations({
  identifier: "ComponentLatestVersion",
}) as any as S.Schema<ComponentLatestVersion>;
export interface EffectiveDeploymentStatusDetails {
  errorStack?: EffectiveDeploymentErrorStack;
  errorTypes?: EffectiveDeploymentErrorTypeList;
}
export const EffectiveDeploymentStatusDetails = S.suspend(() =>
  S.Struct({
    errorStack: S.optional(EffectiveDeploymentErrorStack),
    errorTypes: S.optional(EffectiveDeploymentErrorTypeList),
  }),
).annotations({
  identifier: "EffectiveDeploymentStatusDetails",
}) as any as S.Schema<EffectiveDeploymentStatusDetails>;
export interface AssociateClientDeviceWithCoreDeviceErrorEntry {
  thingName?: string;
  code?: string;
  message?: string;
}
export const AssociateClientDeviceWithCoreDeviceErrorEntry = S.suspend(() =>
  S.Struct({
    thingName: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateClientDeviceWithCoreDeviceErrorEntry",
}) as any as S.Schema<AssociateClientDeviceWithCoreDeviceErrorEntry>;
export type AssociateClientDeviceWithCoreDeviceErrorList =
  AssociateClientDeviceWithCoreDeviceErrorEntry[];
export const AssociateClientDeviceWithCoreDeviceErrorList = S.Array(
  AssociateClientDeviceWithCoreDeviceErrorEntry,
);
export interface DisassociateClientDeviceFromCoreDeviceErrorEntry {
  thingName?: string;
  code?: string;
  message?: string;
}
export const DisassociateClientDeviceFromCoreDeviceErrorEntry = S.suspend(() =>
  S.Struct({
    thingName: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "DisassociateClientDeviceFromCoreDeviceErrorEntry",
}) as any as S.Schema<DisassociateClientDeviceFromCoreDeviceErrorEntry>;
export type DisassociateClientDeviceFromCoreDeviceErrorList =
  DisassociateClientDeviceFromCoreDeviceErrorEntry[];
export const DisassociateClientDeviceFromCoreDeviceErrorList = S.Array(
  DisassociateClientDeviceFromCoreDeviceErrorEntry,
);
export interface CloudComponentStatus {
  componentState?: string;
  message?: string;
  errors?: StringMap;
  vendorGuidance?: string;
  vendorGuidanceMessage?: string;
}
export const CloudComponentStatus = S.suspend(() =>
  S.Struct({
    componentState: S.optional(S.String),
    message: S.optional(S.String),
    errors: S.optional(StringMap),
    vendorGuidance: S.optional(S.String),
    vendorGuidanceMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudComponentStatus",
}) as any as S.Schema<CloudComponentStatus>;
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
export interface Component {
  arn?: string;
  componentName?: string;
  latestVersion?: ComponentLatestVersion;
}
export const Component = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    componentName: S.optional(S.String),
    latestVersion: S.optional(ComponentLatestVersion),
  }),
).annotations({ identifier: "Component" }) as any as S.Schema<Component>;
export type ComponentList = Component[];
export const ComponentList = S.Array(Component);
export interface EffectiveDeployment {
  deploymentId: string;
  deploymentName: string;
  iotJobId?: string;
  iotJobArn?: string;
  description?: string;
  targetArn: string;
  coreDeviceExecutionStatus: string;
  reason?: string;
  creationTimestamp: Date;
  modifiedTimestamp: Date;
  statusDetails?: EffectiveDeploymentStatusDetails;
}
export const EffectiveDeployment = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "EffectiveDeployment",
}) as any as S.Schema<EffectiveDeployment>;
export type EffectiveDeploymentsList = EffectiveDeployment[];
export const EffectiveDeploymentsList = S.Array(EffectiveDeployment);
export interface BatchAssociateClientDeviceWithCoreDeviceResponse {
  errorEntries?: AssociateClientDeviceWithCoreDeviceErrorList;
}
export const BatchAssociateClientDeviceWithCoreDeviceResponse = S.suspend(() =>
  S.Struct({
    errorEntries: S.optional(AssociateClientDeviceWithCoreDeviceErrorList),
  }),
).annotations({
  identifier: "BatchAssociateClientDeviceWithCoreDeviceResponse",
}) as any as S.Schema<BatchAssociateClientDeviceWithCoreDeviceResponse>;
export interface BatchDisassociateClientDeviceFromCoreDeviceResponse {
  errorEntries?: DisassociateClientDeviceFromCoreDeviceErrorList;
}
export const BatchDisassociateClientDeviceFromCoreDeviceResponse = S.suspend(
  () =>
    S.Struct({
      errorEntries: S.optional(DisassociateClientDeviceFromCoreDeviceErrorList),
    }),
).annotations({
  identifier: "BatchDisassociateClientDeviceFromCoreDeviceResponse",
}) as any as S.Schema<BatchDisassociateClientDeviceFromCoreDeviceResponse>;
export interface LambdaVolumeMount {
  sourcePath: string;
  destinationPath: string;
  permission?: string;
  addGroupOwner?: boolean;
}
export const LambdaVolumeMount = S.suspend(() =>
  S.Struct({
    sourcePath: S.String,
    destinationPath: S.String,
    permission: S.optional(S.String),
    addGroupOwner: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LambdaVolumeMount",
}) as any as S.Schema<LambdaVolumeMount>;
export type LambdaVolumeList = LambdaVolumeMount[];
export const LambdaVolumeList = S.Array(LambdaVolumeMount);
export interface LambdaDeviceMount {
  path: string;
  permission?: string;
  addGroupOwner?: boolean;
}
export const LambdaDeviceMount = S.suspend(() =>
  S.Struct({
    path: S.String,
    permission: S.optional(S.String),
    addGroupOwner: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LambdaDeviceMount",
}) as any as S.Schema<LambdaDeviceMount>;
export type LambdaDeviceList = LambdaDeviceMount[];
export const LambdaDeviceList = S.Array(LambdaDeviceMount);
export interface DescribeComponentResponse {
  arn?: string;
  componentName?: string;
  componentVersion?: string;
  creationTimestamp?: Date;
  publisher?: string;
  description?: string;
  status?: CloudComponentStatus;
  platforms?: ComponentPlatformList;
  tags?: TagMap;
}
export const DescribeComponentResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribeComponentResponse",
}) as any as S.Schema<DescribeComponentResponse>;
export interface ListComponentsResponse {
  components?: ComponentList;
  nextToken?: string;
}
export const ListComponentsResponse = S.suspend(() =>
  S.Struct({
    components: S.optional(ComponentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComponentsResponse",
}) as any as S.Schema<ListComponentsResponse>;
export interface ListEffectiveDeploymentsResponse {
  effectiveDeployments?: EffectiveDeploymentsList;
  nextToken?: string;
}
export const ListEffectiveDeploymentsResponse = S.suspend(() =>
  S.Struct({
    effectiveDeployments: S.optional(EffectiveDeploymentsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEffectiveDeploymentsResponse",
}) as any as S.Schema<ListEffectiveDeploymentsResponse>;
export interface LambdaContainerParams {
  memorySizeInKB?: number;
  mountROSysfs?: boolean;
  volumes?: LambdaVolumeList;
  devices?: LambdaDeviceList;
}
export const LambdaContainerParams = S.suspend(() =>
  S.Struct({
    memorySizeInKB: S.optional(S.Number),
    mountROSysfs: S.optional(S.Boolean),
    volumes: S.optional(LambdaVolumeList),
    devices: S.optional(LambdaDeviceList),
  }),
).annotations({
  identifier: "LambdaContainerParams",
}) as any as S.Schema<LambdaContainerParams>;
export interface ResolvedComponentVersion {
  arn?: string;
  componentName?: string;
  componentVersion?: string;
  recipe?: Uint8Array;
  vendorGuidance?: string;
  message?: string;
}
export const ResolvedComponentVersion = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    componentName: S.optional(S.String),
    componentVersion: S.optional(S.String),
    recipe: S.optional(T.Blob),
    vendorGuidance: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "ResolvedComponentVersion",
}) as any as S.Schema<ResolvedComponentVersion>;
export type ResolvedComponentVersionsList = ResolvedComponentVersion[];
export const ResolvedComponentVersionsList = S.Array(ResolvedComponentVersion);
export interface LambdaLinuxProcessParams {
  isolationMode?: string;
  containerParams?: LambdaContainerParams;
}
export const LambdaLinuxProcessParams = S.suspend(() =>
  S.Struct({
    isolationMode: S.optional(S.String),
    containerParams: S.optional(LambdaContainerParams),
  }),
).annotations({
  identifier: "LambdaLinuxProcessParams",
}) as any as S.Schema<LambdaLinuxProcessParams>;
export interface CreateDeploymentRequest {
  targetArn: string;
  deploymentName?: string;
  components?: ComponentDeploymentSpecifications;
  iotJobConfiguration?: DeploymentIoTJobConfiguration;
  deploymentPolicies?: DeploymentPolicies;
  parentTargetArn?: string;
  tags?: TagMap;
  clientToken?: string;
}
export const CreateDeploymentRequest = S.suspend(() =>
  S.Struct({
    targetArn: S.String,
    deploymentName: S.optional(S.String),
    components: S.optional(ComponentDeploymentSpecifications),
    iotJobConfiguration: S.optional(DeploymentIoTJobConfiguration),
    deploymentPolicies: S.optional(DeploymentPolicies),
    parentTargetArn: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/greengrass/v2/deployments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDeploymentRequest",
}) as any as S.Schema<CreateDeploymentRequest>;
export interface ResolveComponentCandidatesResponse {
  resolvedComponentVersions?: ResolvedComponentVersionsList;
}
export const ResolveComponentCandidatesResponse = S.suspend(() =>
  S.Struct({
    resolvedComponentVersions: S.optional(ResolvedComponentVersionsList),
  }),
).annotations({
  identifier: "ResolveComponentCandidatesResponse",
}) as any as S.Schema<ResolveComponentCandidatesResponse>;
export interface LambdaExecutionParameters {
  eventSources?: LambdaEventSourceList;
  maxQueueSize?: number;
  maxInstancesCount?: number;
  maxIdleTimeInSeconds?: number;
  timeoutInSeconds?: number;
  statusTimeoutInSeconds?: number;
  pinned?: boolean;
  inputPayloadEncodingType?: string;
  execArgs?: LambdaExecArgsList;
  environmentVariables?: LambdaEnvironmentVariables;
  linuxProcessParams?: LambdaLinuxProcessParams;
}
export const LambdaExecutionParameters = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "LambdaExecutionParameters",
}) as any as S.Schema<LambdaExecutionParameters>;
export interface LambdaFunctionRecipeSource {
  lambdaArn: string;
  componentName?: string;
  componentVersion?: string;
  componentPlatforms?: ComponentPlatformList;
  componentDependencies?: ComponentDependencyMap;
  componentLambdaParameters?: LambdaExecutionParameters;
}
export const LambdaFunctionRecipeSource = S.suspend(() =>
  S.Struct({
    lambdaArn: S.String,
    componentName: S.optional(S.String),
    componentVersion: S.optional(S.String),
    componentPlatforms: S.optional(ComponentPlatformList),
    componentDependencies: S.optional(ComponentDependencyMap),
    componentLambdaParameters: S.optional(LambdaExecutionParameters),
  }),
).annotations({
  identifier: "LambdaFunctionRecipeSource",
}) as any as S.Schema<LambdaFunctionRecipeSource>;
export interface CreateComponentVersionRequest {
  inlineRecipe?: Uint8Array;
  lambdaFunction?: LambdaFunctionRecipeSource;
  tags?: TagMap;
  clientToken?: string;
}
export const CreateComponentVersionRequest = S.suspend(() =>
  S.Struct({
    inlineRecipe: S.optional(T.Blob),
    lambdaFunction: S.optional(LambdaFunctionRecipeSource),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/greengrass/v2/createComponentVersion" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateComponentVersionRequest",
}) as any as S.Schema<CreateComponentVersionRequest>;
export interface CreateDeploymentResponse {
  deploymentId?: string;
  iotJobId?: string;
  iotJobArn?: string;
}
export const CreateDeploymentResponse = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    iotJobId: S.optional(S.String),
    iotJobArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDeploymentResponse",
}) as any as S.Schema<CreateDeploymentResponse>;
export interface CreateComponentVersionResponse {
  arn?: string;
  componentName: string;
  componentVersion: string;
  creationTimestamp: Date;
  status: CloudComponentStatus;
}
export const CreateComponentVersionResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    componentName: S.String,
    componentVersion: S.String,
    creationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: CloudComponentStatus,
  }),
).annotations({
  identifier: "CreateComponentVersionResponse",
}) as any as S.Schema<CreateComponentVersionResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    quotaCode: S.optional(S.String),
    serviceCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(S.String),
    fields: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class RequestAlreadyInProgressException extends S.TaggedError<RequestAlreadyInProgressException>()(
  "RequestAlreadyInProgressException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    quotaCode: S.String,
    serviceCode: S.String,
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Disassociates the Greengrass service role from IoT Greengrass for your Amazon Web Services account in this Amazon Web Services Region.
 * Without a service role, IoT Greengrass can't verify the identity of client devices or manage core device
 * connectivity information. For more information, see Greengrass service role in
 * the *IoT Greengrass Version 2 Developer Guide*.
 */
export const disassociateServiceRoleFromAccount: (
  input: DisassociateServiceRoleFromAccountRequest,
) => Effect.Effect<
  DisassociateServiceRoleFromAccountResponse,
  InternalServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getServiceRoleForAccount: (
  input: GetServiceRoleForAccountRequest,
) => Effect.Effect<
  GetServiceRoleForAccountResponse,
  InternalServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceRoleForAccountRequest,
  output: GetServiceRoleForAccountResponse,
  errors: [InternalServerException],
}));
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
export const getConnectivityInfo: (
  input: GetConnectivityInfoRequest,
) => Effect.Effect<
  GetConnectivityInfoResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectivityInfoRequest,
  output: GetConnectivityInfoResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Retrieves a paginated list of component summaries. This list includes components that you
 * have permission to view.
 */
export const listComponents: {
  (
    input: ListComponentsRequest,
  ): Effect.Effect<
    ListComponentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentsRequest,
  ) => Stream.Stream<
    ListComponentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentsRequest,
  ) => Stream.Stream<
    Component,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentsRequest,
  output: ListComponentsResponse,
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
    items: "components",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of deployment jobs that IoT Greengrass sends to Greengrass core devices.
 */
export const listEffectiveDeployments: {
  (
    input: ListEffectiveDeploymentsRequest,
  ): Effect.Effect<
    ListEffectiveDeploymentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEffectiveDeploymentsRequest,
  ) => Stream.Stream<
    ListEffectiveDeploymentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEffectiveDeploymentsRequest,
  ) => Stream.Stream<
    EffectiveDeployment,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEffectiveDeploymentsRequest,
  output: ListEffectiveDeploymentsResponse,
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
    items: "effectiveDeployments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of client devices that are associated with a core
 * device.
 */
export const listClientDevicesAssociatedWithCoreDevice: {
  (
    input: ListClientDevicesAssociatedWithCoreDeviceRequest,
  ): Effect.Effect<
    ListClientDevicesAssociatedWithCoreDeviceResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClientDevicesAssociatedWithCoreDeviceRequest,
  ) => Stream.Stream<
    ListClientDevicesAssociatedWithCoreDeviceResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClientDevicesAssociatedWithCoreDeviceRequest,
  ) => Stream.Stream<
    AssociatedClientDevice,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClientDevicesAssociatedWithCoreDeviceRequest,
  output: ListClientDevicesAssociatedWithCoreDeviceResponse,
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
    items: "associatedClientDevices",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of all versions for a component. Greater versions are listed
 * first.
 */
export const listComponentVersions: {
  (
    input: ListComponentVersionsRequest,
  ): Effect.Effect<
    ListComponentVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentVersionsRequest,
  ) => Stream.Stream<
    ListComponentVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentVersionsRequest,
  ) => Stream.Stream<
    ComponentVersionListItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentVersionsRequest,
  output: ListComponentVersionsResponse,
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
    items: "componentVersions",
    pageSize: "maxResults",
  } as const,
}));
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
export const listCoreDevices: {
  (
    input: ListCoreDevicesRequest,
  ): Effect.Effect<
    ListCoreDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCoreDevicesRequest,
  ) => Stream.Stream<
    ListCoreDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCoreDevicesRequest,
  ) => Stream.Stream<
    CoreDevice,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCoreDevicesRequest,
  output: ListCoreDevicesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "coreDevices",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of deployments.
 */
export const listDeployments: {
  (
    input: ListDeploymentsRequest,
  ): Effect.Effect<
    ListDeploymentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeploymentsRequest,
  ) => Stream.Stream<
    ListDeploymentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeploymentsRequest,
  ) => Stream.Stream<
    Deployment,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDeploymentsRequest,
  output: ListDeploymentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "deployments",
    pageSize: "maxResults",
  } as const,
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
export const listInstalledComponents: {
  (
    input: ListInstalledComponentsRequest,
  ): Effect.Effect<
    ListInstalledComponentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstalledComponentsRequest,
  ) => Stream.Stream<
    ListInstalledComponentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstalledComponentsRequest,
  ) => Stream.Stream<
    InstalledComponent,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInstalledComponentsRequest,
  output: ListInstalledComponentsResponse,
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
    items: "installedComponents",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes a Greengrass core device, which is an IoT thing. This operation removes the core
 * device from the list of core devices. This operation doesn't delete the IoT thing. For more
 * information about how to delete the IoT thing, see DeleteThing in the
 * *IoT API Reference*.
 */
export const deleteCoreDevice: (
  input: DeleteCoreDeviceRequest,
) => Effect.Effect<
  DeleteCoreDeviceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDeployment: (
  input: DeleteDeploymentRequest,
) => Effect.Effect<
  DeleteDeploymentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelDeployment: (
  input: CancelDeploymentRequest,
) => Effect.Effect<
  CancelDeploymentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getComponentVersionArtifact: (
  input: GetComponentVersionArtifactRequest,
) => Effect.Effect<
  GetComponentVersionArtifactResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentVersionArtifactRequest,
  output: GetComponentVersionArtifactResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
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
export const getCoreDevice: (
  input: GetCoreDeviceRequest,
) => Effect.Effect<
  GetCoreDeviceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDeployment: (
  input: GetDeploymentRequest,
) => Effect.Effect<
  GetDeploymentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteComponent: (
  input: DeleteComponentRequest,
) => Effect.Effect<
  DeleteComponentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchAssociateClientDeviceWithCoreDevice: (
  input: BatchAssociateClientDeviceWithCoreDeviceRequest,
) => Effect.Effect<
  BatchAssociateClientDeviceWithCoreDeviceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDisassociateClientDeviceFromCoreDevice: (
  input: BatchDisassociateClientDeviceFromCoreDeviceRequest,
) => Effect.Effect<
  BatchDisassociateClientDeviceFromCoreDeviceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeComponent: (
  input: DescribeComponentRequest,
) => Effect.Effect<
  DescribeComponentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateServiceRoleToAccount: (
  input: AssociateServiceRoleToAccountRequest,
) => Effect.Effect<
  AssociateServiceRoleToAccountResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateConnectivityInfo: (
  input: UpdateConnectivityInfoRequest,
) => Effect.Effect<
  UpdateConnectivityInfoResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectivityInfoRequest,
  output: UpdateConnectivityInfoResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Retrieves the list of tags for an IoT Greengrass resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
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
 * Adds tags to an IoT Greengrass resource. If a tag already exists for the resource, this operation
 * updates the tag's value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
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
 * Removes a tag from an IoT Greengrass resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
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
 * Gets the recipe for a version of a component.
 */
export const getComponent: (
  input: GetComponentRequest,
) => Effect.Effect<
  GetComponentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resolveComponentCandidates: (
  input: ResolveComponentCandidatesRequest,
) => Effect.Effect<
  ResolveComponentCandidatesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const createDeployment: (
  input: CreateDeploymentRequest,
) => Effect.Effect<
  CreateDeploymentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | RequestAlreadyInProgressException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createComponentVersion: (
  input: CreateComponentVersionRequest,
) => Effect.Effect<
  CreateComponentVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | RequestAlreadyInProgressException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));

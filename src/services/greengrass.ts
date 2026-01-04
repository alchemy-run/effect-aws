import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Greengrass",
  serviceShapeName: "Greengrass",
});
const auth = T.AwsAuthSigv4({ name: "greengrass" });
const ver = T.ServiceVersion("2017-06-07");
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
export const UpdateTargets = S.Array(S.String);
export const __listOf__string = S.Array(S.String);
export class AssociateRoleToGroupRequest extends S.Class<AssociateRoleToGroupRequest>(
  "AssociateRoleToGroupRequest",
)(
  { GroupId: S.String.pipe(T.HttpLabel()), RoleArn: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/greengrass/groups/{GroupId}/role" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateServiceRoleToAccountRequest extends S.Class<AssociateServiceRoleToAccountRequest>(
  "AssociateServiceRoleToAccountRequest",
)(
  { RoleArn: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/greengrass/servicerole" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDeploymentRequest extends S.Class<CreateDeploymentRequest>(
  "CreateDeploymentRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    DeploymentId: S.optional(S.String),
    DeploymentType: S.String,
    GroupId: S.String.pipe(T.HttpLabel()),
    GroupVersionId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/groups/{GroupId}/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGroupCertificateAuthorityRequest extends S.Class<CreateGroupCertificateAuthorityRequest>(
  "CreateGroupCertificateAuthorityRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    GroupId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/groups/{GroupId}/certificateauthorities",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGroupVersionRequest extends S.Class<CreateGroupVersionRequest>(
  "CreateGroupVersionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    ConnectorDefinitionVersionArn: S.optional(S.String),
    CoreDefinitionVersionArn: S.optional(S.String),
    DeviceDefinitionVersionArn: S.optional(S.String),
    FunctionDefinitionVersionArn: S.optional(S.String),
    GroupId: S.String.pipe(T.HttpLabel()),
    LoggerDefinitionVersionArn: S.optional(S.String),
    ResourceDefinitionVersionArn: S.optional(S.String),
    SubscriptionDefinitionVersionArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/groups/{GroupId}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSoftwareUpdateJobRequest extends S.Class<CreateSoftwareUpdateJobRequest>(
  "CreateSoftwareUpdateJobRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    S3UrlSignerRole: S.String,
    SoftwareToUpdate: S.String,
    UpdateAgentLogLevel: S.optional(S.String),
    UpdateTargets: UpdateTargets,
    UpdateTargetsArchitecture: S.String,
    UpdateTargetsOperatingSystem: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/updates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorDefinitionRequest extends S.Class<DeleteConnectorDefinitionRequest>(
  "DeleteConnectorDefinitionRequest",
)(
  { ConnectorDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/greengrass/definition/connectors/{ConnectorDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorDefinitionResponse extends S.Class<DeleteConnectorDefinitionResponse>(
  "DeleteConnectorDefinitionResponse",
)({}) {}
export class DeleteCoreDefinitionRequest extends S.Class<DeleteCoreDefinitionRequest>(
  "DeleteCoreDefinitionRequest",
)(
  { CoreDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/greengrass/definition/cores/{CoreDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCoreDefinitionResponse extends S.Class<DeleteCoreDefinitionResponse>(
  "DeleteCoreDefinitionResponse",
)({}) {}
export class DeleteDeviceDefinitionRequest extends S.Class<DeleteDeviceDefinitionRequest>(
  "DeleteDeviceDefinitionRequest",
)(
  { DeviceDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/greengrass/definition/devices/{DeviceDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeviceDefinitionResponse extends S.Class<DeleteDeviceDefinitionResponse>(
  "DeleteDeviceDefinitionResponse",
)({}) {}
export class DeleteFunctionDefinitionRequest extends S.Class<DeleteFunctionDefinitionRequest>(
  "DeleteFunctionDefinitionRequest",
)(
  { FunctionDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/greengrass/definition/functions/{FunctionDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFunctionDefinitionResponse extends S.Class<DeleteFunctionDefinitionResponse>(
  "DeleteFunctionDefinitionResponse",
)({}) {}
export class DeleteGroupRequest extends S.Class<DeleteGroupRequest>(
  "DeleteGroupRequest",
)(
  { GroupId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/greengrass/groups/{GroupId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGroupResponse extends S.Class<DeleteGroupResponse>(
  "DeleteGroupResponse",
)({}) {}
export class DeleteLoggerDefinitionRequest extends S.Class<DeleteLoggerDefinitionRequest>(
  "DeleteLoggerDefinitionRequest",
)(
  { LoggerDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/greengrass/definition/loggers/{LoggerDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLoggerDefinitionResponse extends S.Class<DeleteLoggerDefinitionResponse>(
  "DeleteLoggerDefinitionResponse",
)({}) {}
export class DeleteResourceDefinitionRequest extends S.Class<DeleteResourceDefinitionRequest>(
  "DeleteResourceDefinitionRequest",
)(
  { ResourceDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/greengrass/definition/resources/{ResourceDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourceDefinitionResponse extends S.Class<DeleteResourceDefinitionResponse>(
  "DeleteResourceDefinitionResponse",
)({}) {}
export class DeleteSubscriptionDefinitionRequest extends S.Class<DeleteSubscriptionDefinitionRequest>(
  "DeleteSubscriptionDefinitionRequest",
)(
  { SubscriptionDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/greengrass/definition/subscriptions/{SubscriptionDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSubscriptionDefinitionResponse extends S.Class<DeleteSubscriptionDefinitionResponse>(
  "DeleteSubscriptionDefinitionResponse",
)({}) {}
export class DisassociateRoleFromGroupRequest extends S.Class<DisassociateRoleFromGroupRequest>(
  "DisassociateRoleFromGroupRequest",
)(
  { GroupId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/greengrass/groups/{GroupId}/role" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateServiceRoleFromAccountResponse extends S.Class<DisassociateServiceRoleFromAccountResponse>(
  "DisassociateServiceRoleFromAccountResponse",
)({ DisassociatedAt: S.optional(S.String) }) {}
export class GetAssociatedRoleRequest extends S.Class<GetAssociatedRoleRequest>(
  "GetAssociatedRoleRequest",
)(
  { GroupId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/groups/{GroupId}/role" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBulkDeploymentStatusRequest extends S.Class<GetBulkDeploymentStatusRequest>(
  "GetBulkDeploymentStatusRequest",
)(
  { BulkDeploymentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/bulk/deployments/{BulkDeploymentId}/status",
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
  { ThingName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/things/{ThingName}/connectivityInfo",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectorDefinitionRequest extends S.Class<GetConnectorDefinitionRequest>(
  "GetConnectorDefinitionRequest",
)(
  { ConnectorDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/connectors/{ConnectorDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectorDefinitionVersionRequest extends S.Class<GetConnectorDefinitionVersionRequest>(
  "GetConnectorDefinitionVersionRequest",
)(
  {
    ConnectorDefinitionId: S.String.pipe(T.HttpLabel()),
    ConnectorDefinitionVersionId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/connectors/{ConnectorDefinitionId}/versions/{ConnectorDefinitionVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCoreDefinitionRequest extends S.Class<GetCoreDefinitionRequest>(
  "GetCoreDefinitionRequest",
)(
  { CoreDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/cores/{CoreDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCoreDefinitionVersionRequest extends S.Class<GetCoreDefinitionVersionRequest>(
  "GetCoreDefinitionVersionRequest",
)(
  {
    CoreDefinitionId: S.String.pipe(T.HttpLabel()),
    CoreDefinitionVersionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/cores/{CoreDefinitionId}/versions/{CoreDefinitionVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeploymentStatusRequest extends S.Class<GetDeploymentStatusRequest>(
  "GetDeploymentStatusRequest",
)(
  {
    DeploymentId: S.String.pipe(T.HttpLabel()),
    GroupId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/groups/{GroupId}/deployments/{DeploymentId}/status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeviceDefinitionRequest extends S.Class<GetDeviceDefinitionRequest>(
  "GetDeviceDefinitionRequest",
)(
  { DeviceDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/devices/{DeviceDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeviceDefinitionVersionRequest extends S.Class<GetDeviceDefinitionVersionRequest>(
  "GetDeviceDefinitionVersionRequest",
)(
  {
    DeviceDefinitionId: S.String.pipe(T.HttpLabel()),
    DeviceDefinitionVersionId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/devices/{DeviceDefinitionId}/versions/{DeviceDefinitionVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFunctionDefinitionRequest extends S.Class<GetFunctionDefinitionRequest>(
  "GetFunctionDefinitionRequest",
)(
  { FunctionDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/functions/{FunctionDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFunctionDefinitionVersionRequest extends S.Class<GetFunctionDefinitionVersionRequest>(
  "GetFunctionDefinitionVersionRequest",
)(
  {
    FunctionDefinitionId: S.String.pipe(T.HttpLabel()),
    FunctionDefinitionVersionId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/functions/{FunctionDefinitionId}/versions/{FunctionDefinitionVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGroupRequest extends S.Class<GetGroupRequest>(
  "GetGroupRequest",
)(
  { GroupId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/groups/{GroupId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGroupCertificateAuthorityRequest extends S.Class<GetGroupCertificateAuthorityRequest>(
  "GetGroupCertificateAuthorityRequest",
)(
  {
    CertificateAuthorityId: S.String.pipe(T.HttpLabel()),
    GroupId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/groups/{GroupId}/certificateauthorities/{CertificateAuthorityId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGroupCertificateConfigurationRequest extends S.Class<GetGroupCertificateConfigurationRequest>(
  "GetGroupCertificateConfigurationRequest",
)(
  { GroupId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/groups/{GroupId}/certificateauthorities/configuration/expiry",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGroupVersionRequest extends S.Class<GetGroupVersionRequest>(
  "GetGroupVersionRequest",
)(
  {
    GroupId: S.String.pipe(T.HttpLabel()),
    GroupVersionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/groups/{GroupId}/versions/{GroupVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoggerDefinitionRequest extends S.Class<GetLoggerDefinitionRequest>(
  "GetLoggerDefinitionRequest",
)(
  { LoggerDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/loggers/{LoggerDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoggerDefinitionVersionRequest extends S.Class<GetLoggerDefinitionVersionRequest>(
  "GetLoggerDefinitionVersionRequest",
)(
  {
    LoggerDefinitionId: S.String.pipe(T.HttpLabel()),
    LoggerDefinitionVersionId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/loggers/{LoggerDefinitionId}/versions/{LoggerDefinitionVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceDefinitionRequest extends S.Class<GetResourceDefinitionRequest>(
  "GetResourceDefinitionRequest",
)(
  { ResourceDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/resources/{ResourceDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceDefinitionVersionRequest extends S.Class<GetResourceDefinitionVersionRequest>(
  "GetResourceDefinitionVersionRequest",
)(
  {
    ResourceDefinitionId: S.String.pipe(T.HttpLabel()),
    ResourceDefinitionVersionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/resources/{ResourceDefinitionId}/versions/{ResourceDefinitionVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceRoleForAccountResponse extends S.Class<GetServiceRoleForAccountResponse>(
  "GetServiceRoleForAccountResponse",
)({ AssociatedAt: S.optional(S.String), RoleArn: S.optional(S.String) }) {}
export class GetSubscriptionDefinitionRequest extends S.Class<GetSubscriptionDefinitionRequest>(
  "GetSubscriptionDefinitionRequest",
)(
  { SubscriptionDefinitionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/subscriptions/{SubscriptionDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSubscriptionDefinitionVersionRequest extends S.Class<GetSubscriptionDefinitionVersionRequest>(
  "GetSubscriptionDefinitionVersionRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    SubscriptionDefinitionId: S.String.pipe(T.HttpLabel()),
    SubscriptionDefinitionVersionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/subscriptions/{SubscriptionDefinitionId}/versions/{SubscriptionDefinitionVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetThingRuntimeConfigurationRequest extends S.Class<GetThingRuntimeConfigurationRequest>(
  "GetThingRuntimeConfigurationRequest",
)(
  { ThingName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/things/{ThingName}/runtimeconfig",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBulkDeploymentDetailedReportsRequest extends S.Class<ListBulkDeploymentDetailedReportsRequest>(
  "ListBulkDeploymentDetailedReportsRequest",
)(
  {
    BulkDeploymentId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/bulk/deployments/{BulkDeploymentId}/detailed-reports",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBulkDeploymentsRequest extends S.Class<ListBulkDeploymentsRequest>(
  "ListBulkDeploymentsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/bulk/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectorDefinitionsRequest extends S.Class<ListConnectorDefinitionsRequest>(
  "ListConnectorDefinitionsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/definition/connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectorDefinitionVersionsRequest extends S.Class<ListConnectorDefinitionVersionsRequest>(
  "ListConnectorDefinitionVersionsRequest",
)(
  {
    ConnectorDefinitionId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/connectors/{ConnectorDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCoreDefinitionsRequest extends S.Class<ListCoreDefinitionsRequest>(
  "ListCoreDefinitionsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/definition/cores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCoreDefinitionVersionsRequest extends S.Class<ListCoreDefinitionVersionsRequest>(
  "ListCoreDefinitionVersionsRequest",
)(
  {
    CoreDefinitionId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/cores/{CoreDefinitionId}/versions",
    }),
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
    GroupId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/groups/{GroupId}/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeviceDefinitionsRequest extends S.Class<ListDeviceDefinitionsRequest>(
  "ListDeviceDefinitionsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/definition/devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeviceDefinitionVersionsRequest extends S.Class<ListDeviceDefinitionVersionsRequest>(
  "ListDeviceDefinitionVersionsRequest",
)(
  {
    DeviceDefinitionId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/devices/{DeviceDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFunctionDefinitionsRequest extends S.Class<ListFunctionDefinitionsRequest>(
  "ListFunctionDefinitionsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/definition/functions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFunctionDefinitionVersionsRequest extends S.Class<ListFunctionDefinitionVersionsRequest>(
  "ListFunctionDefinitionVersionsRequest",
)(
  {
    FunctionDefinitionId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/functions/{FunctionDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupCertificateAuthoritiesRequest extends S.Class<ListGroupCertificateAuthoritiesRequest>(
  "ListGroupCertificateAuthoritiesRequest",
)(
  { GroupId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/groups/{GroupId}/certificateauthorities",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupsRequest extends S.Class<ListGroupsRequest>(
  "ListGroupsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupVersionsRequest extends S.Class<ListGroupVersionsRequest>(
  "ListGroupVersionsRequest",
)(
  {
    GroupId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/groups/{GroupId}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLoggerDefinitionsRequest extends S.Class<ListLoggerDefinitionsRequest>(
  "ListLoggerDefinitionsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/definition/loggers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLoggerDefinitionVersionsRequest extends S.Class<ListLoggerDefinitionVersionsRequest>(
  "ListLoggerDefinitionVersionsRequest",
)(
  {
    LoggerDefinitionId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/loggers/{LoggerDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceDefinitionsRequest extends S.Class<ListResourceDefinitionsRequest>(
  "ListResourceDefinitionsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/definition/resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceDefinitionVersionsRequest extends S.Class<ListResourceDefinitionVersionsRequest>(
  "ListResourceDefinitionVersionsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    ResourceDefinitionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/resources/{ResourceDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubscriptionDefinitionsRequest extends S.Class<ListSubscriptionDefinitionsRequest>(
  "ListSubscriptionDefinitionsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/greengrass/definition/subscriptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubscriptionDefinitionVersionsRequest extends S.Class<ListSubscriptionDefinitionVersionsRequest>(
  "ListSubscriptionDefinitionVersionsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    SubscriptionDefinitionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/greengrass/definition/subscriptions/{SubscriptionDefinitionId}/versions",
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
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetDeploymentsRequest extends S.Class<ResetDeploymentsRequest>(
  "ResetDeploymentsRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    Force: S.optional(S.Boolean),
    GroupId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/groups/{GroupId}/deployments/$reset",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class StartBulkDeploymentRequest extends S.Class<StartBulkDeploymentRequest>(
  "StartBulkDeploymentRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    ExecutionRoleArn: S.String,
    InputFileUri: S.String,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/bulk/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopBulkDeploymentRequest extends S.Class<StopBulkDeploymentRequest>(
  "StopBulkDeploymentRequest",
)(
  { BulkDeploymentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/bulk/deployments/{BulkDeploymentId}/$stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopBulkDeploymentResponse extends S.Class<StopBulkDeploymentResponse>(
  "StopBulkDeploymentResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), tags: S.optional(Tags) },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export class UpdateConnectorDefinitionRequest extends S.Class<UpdateConnectorDefinitionRequest>(
  "UpdateConnectorDefinitionRequest",
)(
  {
    ConnectorDefinitionId: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/definition/connectors/{ConnectorDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConnectorDefinitionResponse extends S.Class<UpdateConnectorDefinitionResponse>(
  "UpdateConnectorDefinitionResponse",
)({}) {}
export class UpdateCoreDefinitionRequest extends S.Class<UpdateCoreDefinitionRequest>(
  "UpdateCoreDefinitionRequest",
)(
  {
    CoreDefinitionId: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/definition/cores/{CoreDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCoreDefinitionResponse extends S.Class<UpdateCoreDefinitionResponse>(
  "UpdateCoreDefinitionResponse",
)({}) {}
export class UpdateDeviceDefinitionRequest extends S.Class<UpdateDeviceDefinitionRequest>(
  "UpdateDeviceDefinitionRequest",
)(
  {
    DeviceDefinitionId: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/definition/devices/{DeviceDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDeviceDefinitionResponse extends S.Class<UpdateDeviceDefinitionResponse>(
  "UpdateDeviceDefinitionResponse",
)({}) {}
export class UpdateFunctionDefinitionRequest extends S.Class<UpdateFunctionDefinitionRequest>(
  "UpdateFunctionDefinitionRequest",
)(
  {
    FunctionDefinitionId: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/definition/functions/{FunctionDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFunctionDefinitionResponse extends S.Class<UpdateFunctionDefinitionResponse>(
  "UpdateFunctionDefinitionResponse",
)({}) {}
export class UpdateGroupRequest extends S.Class<UpdateGroupRequest>(
  "UpdateGroupRequest",
)(
  { GroupId: S.String.pipe(T.HttpLabel()), Name: S.optional(S.String) },
  T.all(
    T.Http({ method: "PUT", uri: "/greengrass/groups/{GroupId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGroupResponse extends S.Class<UpdateGroupResponse>(
  "UpdateGroupResponse",
)({}) {}
export class UpdateGroupCertificateConfigurationRequest extends S.Class<UpdateGroupCertificateConfigurationRequest>(
  "UpdateGroupCertificateConfigurationRequest",
)(
  {
    CertificateExpiryInMilliseconds: S.optional(S.String),
    GroupId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/groups/{GroupId}/certificateauthorities/configuration/expiry",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLoggerDefinitionRequest extends S.Class<UpdateLoggerDefinitionRequest>(
  "UpdateLoggerDefinitionRequest",
)(
  {
    LoggerDefinitionId: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/definition/loggers/{LoggerDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLoggerDefinitionResponse extends S.Class<UpdateLoggerDefinitionResponse>(
  "UpdateLoggerDefinitionResponse",
)({}) {}
export class UpdateResourceDefinitionRequest extends S.Class<UpdateResourceDefinitionRequest>(
  "UpdateResourceDefinitionRequest",
)(
  {
    Name: S.optional(S.String),
    ResourceDefinitionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/definition/resources/{ResourceDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResourceDefinitionResponse extends S.Class<UpdateResourceDefinitionResponse>(
  "UpdateResourceDefinitionResponse",
)({}) {}
export class UpdateSubscriptionDefinitionRequest extends S.Class<UpdateSubscriptionDefinitionRequest>(
  "UpdateSubscriptionDefinitionRequest",
)(
  {
    Name: S.optional(S.String),
    SubscriptionDefinitionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/definition/subscriptions/{SubscriptionDefinitionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSubscriptionDefinitionResponse extends S.Class<UpdateSubscriptionDefinitionResponse>(
  "UpdateSubscriptionDefinitionResponse",
)({}) {}
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export class Connector extends S.Class<Connector>("Connector")({
  ConnectorArn: S.String,
  Id: S.String,
  Parameters: S.optional(__mapOf__string),
}) {}
export const __listOfConnector = S.Array(Connector);
export class ConnectorDefinitionVersion extends S.Class<ConnectorDefinitionVersion>(
  "ConnectorDefinitionVersion",
)({ Connectors: S.optional(__listOfConnector) }) {}
export class Core extends S.Class<Core>("Core")({
  CertificateArn: S.String,
  Id: S.String,
  SyncShadow: S.optional(S.Boolean),
  ThingArn: S.String,
}) {}
export const __listOfCore = S.Array(Core);
export class CoreDefinitionVersion extends S.Class<CoreDefinitionVersion>(
  "CoreDefinitionVersion",
)({ Cores: S.optional(__listOfCore) }) {}
export class Device extends S.Class<Device>("Device")({
  CertificateArn: S.String,
  Id: S.String,
  SyncShadow: S.optional(S.Boolean),
  ThingArn: S.String,
}) {}
export const __listOfDevice = S.Array(Device);
export class DeviceDefinitionVersion extends S.Class<DeviceDefinitionVersion>(
  "DeviceDefinitionVersion",
)({ Devices: S.optional(__listOfDevice) }) {}
export class FunctionRunAsConfig extends S.Class<FunctionRunAsConfig>(
  "FunctionRunAsConfig",
)({ Gid: S.optional(S.Number), Uid: S.optional(S.Number) }) {}
export class FunctionDefaultExecutionConfig extends S.Class<FunctionDefaultExecutionConfig>(
  "FunctionDefaultExecutionConfig",
)({
  IsolationMode: S.optional(S.String),
  RunAs: S.optional(FunctionRunAsConfig),
}) {}
export class FunctionDefaultConfig extends S.Class<FunctionDefaultConfig>(
  "FunctionDefaultConfig",
)({ Execution: S.optional(FunctionDefaultExecutionConfig) }) {}
export class FunctionExecutionConfig extends S.Class<FunctionExecutionConfig>(
  "FunctionExecutionConfig",
)({
  IsolationMode: S.optional(S.String),
  RunAs: S.optional(FunctionRunAsConfig),
}) {}
export class ResourceAccessPolicy extends S.Class<ResourceAccessPolicy>(
  "ResourceAccessPolicy",
)({ Permission: S.optional(S.String), ResourceId: S.String }) {}
export const __listOfResourceAccessPolicy = S.Array(ResourceAccessPolicy);
export class FunctionConfigurationEnvironment extends S.Class<FunctionConfigurationEnvironment>(
  "FunctionConfigurationEnvironment",
)({
  AccessSysfs: S.optional(S.Boolean),
  Execution: S.optional(FunctionExecutionConfig),
  ResourceAccessPolicies: S.optional(__listOfResourceAccessPolicy),
  Variables: S.optional(__mapOf__string),
}) {}
export class FunctionConfiguration extends S.Class<FunctionConfiguration>(
  "FunctionConfiguration",
)({
  EncodingType: S.optional(S.String),
  Environment: S.optional(FunctionConfigurationEnvironment),
  ExecArgs: S.optional(S.String),
  Executable: S.optional(S.String),
  MemorySize: S.optional(S.Number),
  Pinned: S.optional(S.Boolean),
  Timeout: S.optional(S.Number),
  FunctionRuntimeOverride: S.optional(S.String),
}) {}
export class Function extends S.Class<Function>("Function")({
  FunctionArn: S.optional(S.String),
  FunctionConfiguration: S.optional(FunctionConfiguration),
  Id: S.String,
}) {}
export const __listOfFunction = S.Array(Function);
export class FunctionDefinitionVersion extends S.Class<FunctionDefinitionVersion>(
  "FunctionDefinitionVersion",
)({
  DefaultConfig: S.optional(FunctionDefaultConfig),
  Functions: S.optional(__listOfFunction),
}) {}
export class GroupVersion extends S.Class<GroupVersion>("GroupVersion")({
  ConnectorDefinitionVersionArn: S.optional(S.String),
  CoreDefinitionVersionArn: S.optional(S.String),
  DeviceDefinitionVersionArn: S.optional(S.String),
  FunctionDefinitionVersionArn: S.optional(S.String),
  LoggerDefinitionVersionArn: S.optional(S.String),
  ResourceDefinitionVersionArn: S.optional(S.String),
  SubscriptionDefinitionVersionArn: S.optional(S.String),
}) {}
export class Logger extends S.Class<Logger>("Logger")({
  Component: S.String,
  Id: S.String,
  Level: S.String,
  Space: S.optional(S.Number),
  Type: S.String,
}) {}
export const __listOfLogger = S.Array(Logger);
export class LoggerDefinitionVersion extends S.Class<LoggerDefinitionVersion>(
  "LoggerDefinitionVersion",
)({ Loggers: S.optional(__listOfLogger) }) {}
export class GroupOwnerSetting extends S.Class<GroupOwnerSetting>(
  "GroupOwnerSetting",
)({
  AutoAddGroupOwner: S.optional(S.Boolean),
  GroupOwner: S.optional(S.String),
}) {}
export class LocalDeviceResourceData extends S.Class<LocalDeviceResourceData>(
  "LocalDeviceResourceData",
)({
  GroupOwnerSetting: S.optional(GroupOwnerSetting),
  SourcePath: S.optional(S.String),
}) {}
export class LocalVolumeResourceData extends S.Class<LocalVolumeResourceData>(
  "LocalVolumeResourceData",
)({
  DestinationPath: S.optional(S.String),
  GroupOwnerSetting: S.optional(GroupOwnerSetting),
  SourcePath: S.optional(S.String),
}) {}
export class ResourceDownloadOwnerSetting extends S.Class<ResourceDownloadOwnerSetting>(
  "ResourceDownloadOwnerSetting",
)({ GroupOwner: S.String, GroupPermission: S.String }) {}
export class S3MachineLearningModelResourceData extends S.Class<S3MachineLearningModelResourceData>(
  "S3MachineLearningModelResourceData",
)({
  DestinationPath: S.optional(S.String),
  OwnerSetting: S.optional(ResourceDownloadOwnerSetting),
  S3Uri: S.optional(S.String),
}) {}
export class SageMakerMachineLearningModelResourceData extends S.Class<SageMakerMachineLearningModelResourceData>(
  "SageMakerMachineLearningModelResourceData",
)({
  DestinationPath: S.optional(S.String),
  OwnerSetting: S.optional(ResourceDownloadOwnerSetting),
  SageMakerJobArn: S.optional(S.String),
}) {}
export class SecretsManagerSecretResourceData extends S.Class<SecretsManagerSecretResourceData>(
  "SecretsManagerSecretResourceData",
)({
  ARN: S.optional(S.String),
  AdditionalStagingLabelsToDownload: S.optional(__listOf__string),
}) {}
export class ResourceDataContainer extends S.Class<ResourceDataContainer>(
  "ResourceDataContainer",
)({
  LocalDeviceResourceData: S.optional(LocalDeviceResourceData),
  LocalVolumeResourceData: S.optional(LocalVolumeResourceData),
  S3MachineLearningModelResourceData: S.optional(
    S3MachineLearningModelResourceData,
  ),
  SageMakerMachineLearningModelResourceData: S.optional(
    SageMakerMachineLearningModelResourceData,
  ),
  SecretsManagerSecretResourceData: S.optional(
    SecretsManagerSecretResourceData,
  ),
}) {}
export class Resource extends S.Class<Resource>("Resource")({
  Id: S.String,
  Name: S.String,
  ResourceDataContainer: ResourceDataContainer,
}) {}
export const __listOfResource = S.Array(Resource);
export class ResourceDefinitionVersion extends S.Class<ResourceDefinitionVersion>(
  "ResourceDefinitionVersion",
)({ Resources: S.optional(__listOfResource) }) {}
export class Subscription extends S.Class<Subscription>("Subscription")({
  Id: S.String,
  Source: S.String,
  Subject: S.String,
  Target: S.String,
}) {}
export const __listOfSubscription = S.Array(Subscription);
export class SubscriptionDefinitionVersion extends S.Class<SubscriptionDefinitionVersion>(
  "SubscriptionDefinitionVersion",
)({ Subscriptions: S.optional(__listOfSubscription) }) {}
export class ConnectivityInfo extends S.Class<ConnectivityInfo>(
  "ConnectivityInfo",
)({
  HostAddress: S.optional(S.String),
  Id: S.optional(S.String),
  Metadata: S.optional(S.String),
  PortNumber: S.optional(S.Number),
}) {}
export const __listOfConnectivityInfo = S.Array(ConnectivityInfo);
export class TelemetryConfigurationUpdate extends S.Class<TelemetryConfigurationUpdate>(
  "TelemetryConfigurationUpdate",
)({ Telemetry: S.String }) {}
export class AssociateRoleToGroupResponse extends S.Class<AssociateRoleToGroupResponse>(
  "AssociateRoleToGroupResponse",
)({ AssociatedAt: S.optional(S.String) }) {}
export class AssociateServiceRoleToAccountResponse extends S.Class<AssociateServiceRoleToAccountResponse>(
  "AssociateServiceRoleToAccountResponse",
)({ AssociatedAt: S.optional(S.String) }) {}
export class CreateConnectorDefinitionRequest extends S.Class<CreateConnectorDefinitionRequest>(
  "CreateConnectorDefinitionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    InitialVersion: S.optional(ConnectorDefinitionVersion),
    Name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/definition/connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCoreDefinitionRequest extends S.Class<CreateCoreDefinitionRequest>(
  "CreateCoreDefinitionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    InitialVersion: S.optional(CoreDefinitionVersion),
    Name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/definition/cores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCoreDefinitionVersionRequest extends S.Class<CreateCoreDefinitionVersionRequest>(
  "CreateCoreDefinitionVersionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    CoreDefinitionId: S.String.pipe(T.HttpLabel()),
    Cores: S.optional(__listOfCore),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/definition/cores/{CoreDefinitionId}/versions",
    }),
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
  DeploymentArn: S.optional(S.String),
  DeploymentId: S.optional(S.String),
}) {}
export class CreateDeviceDefinitionRequest extends S.Class<CreateDeviceDefinitionRequest>(
  "CreateDeviceDefinitionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    InitialVersion: S.optional(DeviceDefinitionVersion),
    Name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/definition/devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDeviceDefinitionVersionRequest extends S.Class<CreateDeviceDefinitionVersionRequest>(
  "CreateDeviceDefinitionVersionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    DeviceDefinitionId: S.String.pipe(T.HttpLabel()),
    Devices: S.optional(__listOfDevice),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/definition/devices/{DeviceDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFunctionDefinitionRequest extends S.Class<CreateFunctionDefinitionRequest>(
  "CreateFunctionDefinitionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    InitialVersion: S.optional(FunctionDefinitionVersion),
    Name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/definition/functions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGroupRequest extends S.Class<CreateGroupRequest>(
  "CreateGroupRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    InitialVersion: S.optional(GroupVersion),
    Name: S.String,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGroupCertificateAuthorityResponse extends S.Class<CreateGroupCertificateAuthorityResponse>(
  "CreateGroupCertificateAuthorityResponse",
)({ GroupCertificateAuthorityArn: S.optional(S.String) }) {}
export class CreateGroupVersionResponse extends S.Class<CreateGroupVersionResponse>(
  "CreateGroupVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class CreateLoggerDefinitionRequest extends S.Class<CreateLoggerDefinitionRequest>(
  "CreateLoggerDefinitionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    InitialVersion: S.optional(LoggerDefinitionVersion),
    Name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/definition/loggers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLoggerDefinitionVersionRequest extends S.Class<CreateLoggerDefinitionVersionRequest>(
  "CreateLoggerDefinitionVersionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    LoggerDefinitionId: S.String.pipe(T.HttpLabel()),
    Loggers: S.optional(__listOfLogger),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/definition/loggers/{LoggerDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceDefinitionRequest extends S.Class<CreateResourceDefinitionRequest>(
  "CreateResourceDefinitionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    InitialVersion: S.optional(ResourceDefinitionVersion),
    Name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/definition/resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSoftwareUpdateJobResponse extends S.Class<CreateSoftwareUpdateJobResponse>(
  "CreateSoftwareUpdateJobResponse",
)({
  IotJobArn: S.optional(S.String),
  IotJobId: S.optional(S.String),
  PlatformSoftwareVersion: S.optional(S.String),
}) {}
export class CreateSubscriptionDefinitionRequest extends S.Class<CreateSubscriptionDefinitionRequest>(
  "CreateSubscriptionDefinitionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    InitialVersion: S.optional(SubscriptionDefinitionVersion),
    Name: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/greengrass/definition/subscriptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSubscriptionDefinitionVersionRequest extends S.Class<CreateSubscriptionDefinitionVersionRequest>(
  "CreateSubscriptionDefinitionVersionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    SubscriptionDefinitionId: S.String.pipe(T.HttpLabel()),
    Subscriptions: S.optional(__listOfSubscription),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/definition/subscriptions/{SubscriptionDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateRoleFromGroupResponse extends S.Class<DisassociateRoleFromGroupResponse>(
  "DisassociateRoleFromGroupResponse",
)({ DisassociatedAt: S.optional(S.String) }) {}
export class GetAssociatedRoleResponse extends S.Class<GetAssociatedRoleResponse>(
  "GetAssociatedRoleResponse",
)({ AssociatedAt: S.optional(S.String), RoleArn: S.optional(S.String) }) {}
export class GetConnectivityInfoResponse extends S.Class<GetConnectivityInfoResponse>(
  "GetConnectivityInfoResponse",
)({
  ConnectivityInfo: S.optional(__listOfConnectivityInfo),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
}) {}
export class GetConnectorDefinitionResponse extends S.Class<GetConnectorDefinitionResponse>(
  "GetConnectorDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetConnectorDefinitionVersionResponse extends S.Class<GetConnectorDefinitionVersionResponse>(
  "GetConnectorDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Definition: S.optional(ConnectorDefinitionVersion),
  Id: S.optional(S.String),
  NextToken: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class GetCoreDefinitionResponse extends S.Class<GetCoreDefinitionResponse>(
  "GetCoreDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetCoreDefinitionVersionResponse extends S.Class<GetCoreDefinitionVersionResponse>(
  "GetCoreDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Definition: S.optional(CoreDefinitionVersion),
  Id: S.optional(S.String),
  NextToken: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class ErrorDetail extends S.Class<ErrorDetail>("ErrorDetail")({
  DetailedErrorCode: S.optional(S.String),
  DetailedErrorMessage: S.optional(S.String),
}) {}
export const ErrorDetails = S.Array(ErrorDetail);
export class GetDeploymentStatusResponse extends S.Class<GetDeploymentStatusResponse>(
  "GetDeploymentStatusResponse",
)({
  DeploymentStatus: S.optional(S.String),
  DeploymentType: S.optional(S.String),
  ErrorDetails: S.optional(ErrorDetails),
  ErrorMessage: S.optional(S.String),
  UpdatedAt: S.optional(S.String),
}) {}
export class GetDeviceDefinitionResponse extends S.Class<GetDeviceDefinitionResponse>(
  "GetDeviceDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetDeviceDefinitionVersionResponse extends S.Class<GetDeviceDefinitionVersionResponse>(
  "GetDeviceDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Definition: S.optional(DeviceDefinitionVersion),
  Id: S.optional(S.String),
  NextToken: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class GetFunctionDefinitionResponse extends S.Class<GetFunctionDefinitionResponse>(
  "GetFunctionDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetFunctionDefinitionVersionResponse extends S.Class<GetFunctionDefinitionVersionResponse>(
  "GetFunctionDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Definition: S.optional(FunctionDefinitionVersion),
  Id: S.optional(S.String),
  NextToken: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class GetGroupResponse extends S.Class<GetGroupResponse>(
  "GetGroupResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetGroupCertificateAuthorityResponse extends S.Class<GetGroupCertificateAuthorityResponse>(
  "GetGroupCertificateAuthorityResponse",
)({
  GroupCertificateAuthorityArn: S.optional(S.String),
  GroupCertificateAuthorityId: S.optional(S.String),
  PemEncodedCertificate: S.optional(S.String),
}) {}
export class GetGroupCertificateConfigurationResponse extends S.Class<GetGroupCertificateConfigurationResponse>(
  "GetGroupCertificateConfigurationResponse",
)({
  CertificateAuthorityExpiryInMilliseconds: S.optional(S.String),
  CertificateExpiryInMilliseconds: S.optional(S.String),
  GroupId: S.optional(S.String),
}) {}
export class GetGroupVersionResponse extends S.Class<GetGroupVersionResponse>(
  "GetGroupVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Definition: S.optional(GroupVersion),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class GetLoggerDefinitionResponse extends S.Class<GetLoggerDefinitionResponse>(
  "GetLoggerDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetLoggerDefinitionVersionResponse extends S.Class<GetLoggerDefinitionVersionResponse>(
  "GetLoggerDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Definition: S.optional(LoggerDefinitionVersion),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class GetResourceDefinitionResponse extends S.Class<GetResourceDefinitionResponse>(
  "GetResourceDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetResourceDefinitionVersionResponse extends S.Class<GetResourceDefinitionVersionResponse>(
  "GetResourceDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Definition: S.optional(ResourceDefinitionVersion),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class GetSubscriptionDefinitionResponse extends S.Class<GetSubscriptionDefinitionResponse>(
  "GetSubscriptionDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetSubscriptionDefinitionVersionResponse extends S.Class<GetSubscriptionDefinitionVersionResponse>(
  "GetSubscriptionDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Definition: S.optional(SubscriptionDefinitionVersion),
  Id: S.optional(S.String),
  NextToken: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class DefinitionInformation extends S.Class<DefinitionInformation>(
  "DefinitionInformation",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfDefinitionInformation = S.Array(DefinitionInformation);
export class ListCoreDefinitionsResponse extends S.Class<ListCoreDefinitionsResponse>(
  "ListCoreDefinitionsResponse",
)({
  Definitions: S.optional(__listOfDefinitionInformation),
  NextToken: S.optional(S.String),
}) {}
export class VersionInformation extends S.Class<VersionInformation>(
  "VersionInformation",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export const __listOfVersionInformation = S.Array(VersionInformation);
export class ListCoreDefinitionVersionsResponse extends S.Class<ListCoreDefinitionVersionsResponse>(
  "ListCoreDefinitionVersionsResponse",
)({
  NextToken: S.optional(S.String),
  Versions: S.optional(__listOfVersionInformation),
}) {}
export class ListDeviceDefinitionsResponse extends S.Class<ListDeviceDefinitionsResponse>(
  "ListDeviceDefinitionsResponse",
)({
  Definitions: S.optional(__listOfDefinitionInformation),
  NextToken: S.optional(S.String),
}) {}
export class ListDeviceDefinitionVersionsResponse extends S.Class<ListDeviceDefinitionVersionsResponse>(
  "ListDeviceDefinitionVersionsResponse",
)({
  NextToken: S.optional(S.String),
  Versions: S.optional(__listOfVersionInformation),
}) {}
export class ListFunctionDefinitionsResponse extends S.Class<ListFunctionDefinitionsResponse>(
  "ListFunctionDefinitionsResponse",
)({
  Definitions: S.optional(__listOfDefinitionInformation),
  NextToken: S.optional(S.String),
}) {}
export class ListFunctionDefinitionVersionsResponse extends S.Class<ListFunctionDefinitionVersionsResponse>(
  "ListFunctionDefinitionVersionsResponse",
)({
  NextToken: S.optional(S.String),
  Versions: S.optional(__listOfVersionInformation),
}) {}
export class ListGroupVersionsResponse extends S.Class<ListGroupVersionsResponse>(
  "ListGroupVersionsResponse",
)({
  NextToken: S.optional(S.String),
  Versions: S.optional(__listOfVersionInformation),
}) {}
export class ListLoggerDefinitionsResponse extends S.Class<ListLoggerDefinitionsResponse>(
  "ListLoggerDefinitionsResponse",
)({
  Definitions: S.optional(__listOfDefinitionInformation),
  NextToken: S.optional(S.String),
}) {}
export class ListLoggerDefinitionVersionsResponse extends S.Class<ListLoggerDefinitionVersionsResponse>(
  "ListLoggerDefinitionVersionsResponse",
)({
  NextToken: S.optional(S.String),
  Versions: S.optional(__listOfVersionInformation),
}) {}
export class ListResourceDefinitionsResponse extends S.Class<ListResourceDefinitionsResponse>(
  "ListResourceDefinitionsResponse",
)({
  Definitions: S.optional(__listOfDefinitionInformation),
  NextToken: S.optional(S.String),
}) {}
export class ListResourceDefinitionVersionsResponse extends S.Class<ListResourceDefinitionVersionsResponse>(
  "ListResourceDefinitionVersionsResponse",
)({
  NextToken: S.optional(S.String),
  Versions: S.optional(__listOfVersionInformation),
}) {}
export class ListSubscriptionDefinitionsResponse extends S.Class<ListSubscriptionDefinitionsResponse>(
  "ListSubscriptionDefinitionsResponse",
)({
  Definitions: S.optional(__listOfDefinitionInformation),
  NextToken: S.optional(S.String),
}) {}
export class ListSubscriptionDefinitionVersionsResponse extends S.Class<ListSubscriptionDefinitionVersionsResponse>(
  "ListSubscriptionDefinitionVersionsResponse",
)({
  NextToken: S.optional(S.String),
  Versions: S.optional(__listOfVersionInformation),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class ResetDeploymentsResponse extends S.Class<ResetDeploymentsResponse>(
  "ResetDeploymentsResponse",
)({
  DeploymentArn: S.optional(S.String),
  DeploymentId: S.optional(S.String),
}) {}
export class StartBulkDeploymentResponse extends S.Class<StartBulkDeploymentResponse>(
  "StartBulkDeploymentResponse",
)({
  BulkDeploymentArn: S.optional(S.String),
  BulkDeploymentId: S.optional(S.String),
}) {}
export class UpdateConnectivityInfoRequest extends S.Class<UpdateConnectivityInfoRequest>(
  "UpdateConnectivityInfoRequest",
)(
  {
    ConnectivityInfo: S.optional(__listOfConnectivityInfo),
    ThingName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/things/{ThingName}/connectivityInfo",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGroupCertificateConfigurationResponse extends S.Class<UpdateGroupCertificateConfigurationResponse>(
  "UpdateGroupCertificateConfigurationResponse",
)({
  CertificateAuthorityExpiryInMilliseconds: S.optional(S.String),
  CertificateExpiryInMilliseconds: S.optional(S.String),
  GroupId: S.optional(S.String),
}) {}
export class UpdateThingRuntimeConfigurationRequest extends S.Class<UpdateThingRuntimeConfigurationRequest>(
  "UpdateThingRuntimeConfigurationRequest",
)(
  {
    TelemetryConfiguration: S.optional(TelemetryConfigurationUpdate),
    ThingName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/greengrass/things/{ThingName}/runtimeconfig",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThingRuntimeConfigurationResponse extends S.Class<UpdateThingRuntimeConfigurationResponse>(
  "UpdateThingRuntimeConfigurationResponse",
)({}) {}
export class BulkDeploymentMetrics extends S.Class<BulkDeploymentMetrics>(
  "BulkDeploymentMetrics",
)({
  InvalidInputRecords: S.optional(S.Number),
  RecordsProcessed: S.optional(S.Number),
  RetryAttempts: S.optional(S.Number),
}) {}
export class BulkDeploymentResult extends S.Class<BulkDeploymentResult>(
  "BulkDeploymentResult",
)({
  CreatedAt: S.optional(S.String),
  DeploymentArn: S.optional(S.String),
  DeploymentId: S.optional(S.String),
  DeploymentStatus: S.optional(S.String),
  DeploymentType: S.optional(S.String),
  ErrorDetails: S.optional(ErrorDetails),
  ErrorMessage: S.optional(S.String),
  GroupArn: S.optional(S.String),
}) {}
export const BulkDeploymentResults = S.Array(BulkDeploymentResult);
export class BulkDeployment extends S.Class<BulkDeployment>("BulkDeployment")({
  BulkDeploymentArn: S.optional(S.String),
  BulkDeploymentId: S.optional(S.String),
  CreatedAt: S.optional(S.String),
}) {}
export const BulkDeployments = S.Array(BulkDeployment);
export class Deployment extends S.Class<Deployment>("Deployment")({
  CreatedAt: S.optional(S.String),
  DeploymentArn: S.optional(S.String),
  DeploymentId: S.optional(S.String),
  DeploymentType: S.optional(S.String),
  GroupArn: S.optional(S.String),
}) {}
export const Deployments = S.Array(Deployment);
export class GroupCertificateAuthorityProperties extends S.Class<GroupCertificateAuthorityProperties>(
  "GroupCertificateAuthorityProperties",
)({
  GroupCertificateAuthorityArn: S.optional(S.String),
  GroupCertificateAuthorityId: S.optional(S.String),
}) {}
export const __listOfGroupCertificateAuthorityProperties = S.Array(
  GroupCertificateAuthorityProperties,
);
export class GroupInformation extends S.Class<GroupInformation>(
  "GroupInformation",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const __listOfGroupInformation = S.Array(GroupInformation);
export class CreateConnectorDefinitionResponse extends S.Class<CreateConnectorDefinitionResponse>(
  "CreateConnectorDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class CreateConnectorDefinitionVersionRequest extends S.Class<CreateConnectorDefinitionVersionRequest>(
  "CreateConnectorDefinitionVersionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    ConnectorDefinitionId: S.String.pipe(T.HttpLabel()),
    Connectors: S.optional(__listOfConnector),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/definition/connectors/{ConnectorDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCoreDefinitionResponse extends S.Class<CreateCoreDefinitionResponse>(
  "CreateCoreDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class CreateCoreDefinitionVersionResponse extends S.Class<CreateCoreDefinitionVersionResponse>(
  "CreateCoreDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class CreateDeviceDefinitionResponse extends S.Class<CreateDeviceDefinitionResponse>(
  "CreateDeviceDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class CreateDeviceDefinitionVersionResponse extends S.Class<CreateDeviceDefinitionVersionResponse>(
  "CreateDeviceDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class CreateFunctionDefinitionResponse extends S.Class<CreateFunctionDefinitionResponse>(
  "CreateFunctionDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class CreateGroupResponse extends S.Class<CreateGroupResponse>(
  "CreateGroupResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class CreateLoggerDefinitionResponse extends S.Class<CreateLoggerDefinitionResponse>(
  "CreateLoggerDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class CreateLoggerDefinitionVersionResponse extends S.Class<CreateLoggerDefinitionVersionResponse>(
  "CreateLoggerDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class CreateResourceDefinitionResponse extends S.Class<CreateResourceDefinitionResponse>(
  "CreateResourceDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class CreateSubscriptionDefinitionResponse extends S.Class<CreateSubscriptionDefinitionResponse>(
  "CreateSubscriptionDefinitionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.String),
  LatestVersion: S.optional(S.String),
  LatestVersionArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class CreateSubscriptionDefinitionVersionResponse extends S.Class<CreateSubscriptionDefinitionVersionResponse>(
  "CreateSubscriptionDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class GetBulkDeploymentStatusResponse extends S.Class<GetBulkDeploymentStatusResponse>(
  "GetBulkDeploymentStatusResponse",
)({
  BulkDeploymentMetrics: S.optional(BulkDeploymentMetrics),
  BulkDeploymentStatus: S.optional(S.String),
  CreatedAt: S.optional(S.String),
  ErrorDetails: S.optional(ErrorDetails),
  ErrorMessage: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class ListBulkDeploymentDetailedReportsResponse extends S.Class<ListBulkDeploymentDetailedReportsResponse>(
  "ListBulkDeploymentDetailedReportsResponse",
)({
  Deployments: S.optional(BulkDeploymentResults),
  NextToken: S.optional(S.String),
}) {}
export class ListBulkDeploymentsResponse extends S.Class<ListBulkDeploymentsResponse>(
  "ListBulkDeploymentsResponse",
)({
  BulkDeployments: S.optional(BulkDeployments),
  NextToken: S.optional(S.String),
}) {}
export class ListConnectorDefinitionsResponse extends S.Class<ListConnectorDefinitionsResponse>(
  "ListConnectorDefinitionsResponse",
)({
  Definitions: S.optional(__listOfDefinitionInformation),
  NextToken: S.optional(S.String),
}) {}
export class ListConnectorDefinitionVersionsResponse extends S.Class<ListConnectorDefinitionVersionsResponse>(
  "ListConnectorDefinitionVersionsResponse",
)({
  NextToken: S.optional(S.String),
  Versions: S.optional(__listOfVersionInformation),
}) {}
export class ListDeploymentsResponse extends S.Class<ListDeploymentsResponse>(
  "ListDeploymentsResponse",
)({ Deployments: S.optional(Deployments), NextToken: S.optional(S.String) }) {}
export class ListGroupCertificateAuthoritiesResponse extends S.Class<ListGroupCertificateAuthoritiesResponse>(
  "ListGroupCertificateAuthoritiesResponse",
)({
  GroupCertificateAuthorities: S.optional(
    __listOfGroupCertificateAuthorityProperties,
  ),
}) {}
export class ListGroupsResponse extends S.Class<ListGroupsResponse>(
  "ListGroupsResponse",
)({
  Groups: S.optional(__listOfGroupInformation),
  NextToken: S.optional(S.String),
}) {}
export class UpdateConnectivityInfoResponse extends S.Class<UpdateConnectivityInfoResponse>(
  "UpdateConnectivityInfoResponse",
)({
  Message: S.optional(S.String).pipe(T.JsonName("message")),
  Version: S.optional(S.String),
}) {}
export class TelemetryConfiguration extends S.Class<TelemetryConfiguration>(
  "TelemetryConfiguration",
)({ ConfigurationSyncStatus: S.optional(S.String), Telemetry: S.String }) {}
export class RuntimeConfiguration extends S.Class<RuntimeConfiguration>(
  "RuntimeConfiguration",
)({ TelemetryConfiguration: S.optional(TelemetryConfiguration) }) {}
export class CreateConnectorDefinitionVersionResponse extends S.Class<CreateConnectorDefinitionVersionResponse>(
  "CreateConnectorDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class GetThingRuntimeConfigurationResponse extends S.Class<GetThingRuntimeConfigurationResponse>(
  "GetThingRuntimeConfigurationResponse",
)({ RuntimeConfiguration: S.optional(RuntimeConfiguration) }) {}
export class CreateFunctionDefinitionVersionRequest extends S.Class<CreateFunctionDefinitionVersionRequest>(
  "CreateFunctionDefinitionVersionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    DefaultConfig: S.optional(FunctionDefaultConfig),
    FunctionDefinitionId: S.String.pipe(T.HttpLabel()),
    Functions: S.optional(__listOfFunction),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/definition/functions/{FunctionDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceDefinitionVersionRequest extends S.Class<CreateResourceDefinitionVersionRequest>(
  "CreateResourceDefinitionVersionRequest",
)(
  {
    AmznClientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
    ),
    ResourceDefinitionId: S.String.pipe(T.HttpLabel()),
    Resources: S.optional(__listOfResource),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/greengrass/definition/resources/{ResourceDefinitionId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFunctionDefinitionVersionResponse extends S.Class<CreateFunctionDefinitionVersionResponse>(
  "CreateFunctionDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class CreateResourceDefinitionVersionResponse extends S.Class<CreateResourceDefinitionVersionResponse>(
  "CreateResourceDefinitionVersionResponse",
)({
  Arn: S.optional(S.String),
  CreationTimestamp: S.optional(S.String),
  Id: S.optional(S.String),
  Version: S.optional(S.String),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {},
) {}

//# Operations
/**
 * Deletes a core definition.
 */
export const deleteCoreDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCoreDefinitionRequest,
    output: DeleteCoreDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Deletes a device definition.
 */
export const deleteDeviceDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDeviceDefinitionRequest,
    output: DeleteDeviceDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Deletes a Lambda function definition.
 */
export const deleteFunctionDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFunctionDefinitionRequest,
    output: DeleteFunctionDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Deletes a group.
 */
export const deleteGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [BadRequestException],
}));
/**
 * Deletes a logger definition.
 */
export const deleteLoggerDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLoggerDefinitionRequest,
    output: DeleteLoggerDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Deletes a resource definition.
 */
export const deleteResourceDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourceDefinitionRequest,
    output: DeleteResourceDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Deletes a subscription definition.
 */
export const deleteSubscriptionDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteSubscriptionDefinitionRequest,
    output: DeleteSubscriptionDefinitionResponse,
    errors: [BadRequestException],
  }));
/**
 * Retrieves the service role that is attached to your account.
 */
export const getServiceRoleForAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetServiceRoleForAccountRequest,
    output: GetServiceRoleForAccountResponse,
    errors: [InternalServerErrorException],
  }),
);
/**
 * Stops the execution of a bulk deployment. This action returns a status of ''Stopping'' until the deployment is stopped. You cannot start a new bulk deployment while a previous deployment is in the ''Stopping'' state. This action doesn't rollback completed deployments or cancel pending deployments.
 */
export const stopBulkDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBulkDeploymentRequest,
  output: StopBulkDeploymentResponse,
  errors: [BadRequestException],
}));
/**
 * Adds tags to a Greengrass resource. Valid resources are 'Group', 'ConnectorDefinition', 'CoreDefinition', 'DeviceDefinition', 'FunctionDefinition', 'LoggerDefinition', 'SubscriptionDefinition', 'ResourceDefinition', and 'BulkDeployment'.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [BadRequestException],
}));
/**
 * Remove resource tags from a Greengrass Resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [BadRequestException],
}));
/**
 * Updates a connector definition.
 */
export const updateConnectorDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConnectorDefinitionRequest,
    output: UpdateConnectorDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Updates a core definition.
 */
export const updateCoreDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCoreDefinitionRequest,
    output: UpdateCoreDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Updates a device definition.
 */
export const updateDeviceDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDeviceDefinitionRequest,
    output: UpdateDeviceDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Updates a Lambda function definition.
 */
export const updateFunctionDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFunctionDefinitionRequest,
    output: UpdateFunctionDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Updates a group.
 */
export const updateGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResponse,
  errors: [BadRequestException],
}));
/**
 * Updates a logger definition.
 */
export const updateLoggerDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLoggerDefinitionRequest,
    output: UpdateLoggerDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Updates a resource definition.
 */
export const updateResourceDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateResourceDefinitionRequest,
    output: UpdateResourceDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Updates a subscription definition.
 */
export const updateSubscriptionDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSubscriptionDefinitionRequest,
    output: UpdateSubscriptionDefinitionResponse,
    errors: [BadRequestException],
  }));
/**
 * Associates a role with a group. Your Greengrass core will use the role to access AWS cloud services. The role's permissions should allow Greengrass core Lambda functions to perform actions against the cloud.
 */
export const associateRoleToGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateRoleToGroupRequest,
    output: AssociateRoleToGroupResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Associates a role with your account. AWS IoT Greengrass will use the role to access your Lambda functions and AWS IoT resources. This is necessary for deployments to succeed. The role must have at least minimum permissions in the policy ''AWSGreengrassResourceAccessRolePolicy''.
 */
export const associateServiceRoleToAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateServiceRoleToAccountRequest,
    output: AssociateServiceRoleToAccountResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Creates a deployment. ''CreateDeployment'' requests are idempotent with respect to the ''X-Amzn-Client-Token'' token and the request parameters.
 */
export const createDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeploymentRequest,
  output: CreateDeploymentResponse,
  errors: [BadRequestException],
}));
/**
 * Creates a CA for the group. If a CA already exists, it will rotate the existing CA.
 */
export const createGroupCertificateAuthority =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateGroupCertificateAuthorityRequest,
    output: CreateGroupCertificateAuthorityResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Creates a version of a group which has already been defined.
 */
export const createGroupVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupVersionRequest,
  output: CreateGroupVersionResponse,
  errors: [BadRequestException],
}));
/**
 * Creates a software update for a core or group of cores (specified as an IoT thing group.) Use this to update the OTA Agent as well as the Greengrass core software. It makes use of the IoT Jobs feature which provides additional commands to manage a Greengrass core software update job.
 */
export const createSoftwareUpdateJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSoftwareUpdateJobRequest,
    output: CreateSoftwareUpdateJobResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Disassociates the role from a group.
 */
export const disassociateRoleFromGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateRoleFromGroupRequest,
    output: DisassociateRoleFromGroupResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Disassociates the service role from your account. Without a service role, deployments will not work.
 */
export const disassociateServiceRoleFromAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateServiceRoleFromAccountRequest,
    output: DisassociateServiceRoleFromAccountResponse,
    errors: [InternalServerErrorException],
  }));
/**
 * Retrieves the role associated with a particular group.
 */
export const getAssociatedRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssociatedRoleRequest,
  output: GetAssociatedRoleResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the connectivity information for a core.
 */
export const getConnectivityInfo = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectivityInfoRequest,
  output: GetConnectivityInfoResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves information about a connector definition.
 */
export const getConnectorDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConnectorDefinitionRequest,
    output: GetConnectorDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Retrieves information about a connector definition version, including the connectors that the version contains. Connectors are prebuilt modules that interact with local infrastructure, device protocols, AWS, and other cloud services.
 */
export const getConnectorDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConnectorDefinitionVersionRequest,
    output: GetConnectorDefinitionVersionResponse,
    errors: [BadRequestException],
  }));
/**
 * Retrieves information about a core definition version.
 */
export const getCoreDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCoreDefinitionRequest,
  output: GetCoreDefinitionResponse,
  errors: [BadRequestException],
}));
/**
 * Retrieves information about a core definition version.
 */
export const getCoreDefinitionVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCoreDefinitionVersionRequest,
    output: GetCoreDefinitionVersionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Returns the status of a deployment.
 */
export const getDeploymentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentStatusRequest,
  output: GetDeploymentStatusResponse,
  errors: [BadRequestException],
}));
/**
 * Retrieves information about a device definition.
 */
export const getDeviceDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceDefinitionRequest,
  output: GetDeviceDefinitionResponse,
  errors: [BadRequestException],
}));
/**
 * Retrieves information about a device definition version.
 */
export const getDeviceDefinitionVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDeviceDefinitionVersionRequest,
    output: GetDeviceDefinitionVersionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Retrieves information about a Lambda function definition, including its creation time and latest version.
 */
export const getFunctionDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFunctionDefinitionRequest,
    output: GetFunctionDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Retrieves information about a Lambda function definition version, including which Lambda functions are included in the version and their configurations.
 */
export const getFunctionDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFunctionDefinitionVersionRequest,
    output: GetFunctionDefinitionVersionResponse,
    errors: [BadRequestException],
  }));
/**
 * Retrieves information about a group.
 */
export const getGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupRequest,
  output: GetGroupResponse,
  errors: [BadRequestException],
}));
/**
 * Retreives the CA associated with a group. Returns the public key of the CA.
 */
export const getGroupCertificateAuthority =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetGroupCertificateAuthorityRequest,
    output: GetGroupCertificateAuthorityResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Retrieves the current configuration for the CA used by the group.
 */
export const getGroupCertificateConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetGroupCertificateConfigurationRequest,
    output: GetGroupCertificateConfigurationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Retrieves information about a group version.
 */
export const getGroupVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupVersionRequest,
  output: GetGroupVersionResponse,
  errors: [BadRequestException],
}));
/**
 * Retrieves information about a logger definition.
 */
export const getLoggerDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoggerDefinitionRequest,
  output: GetLoggerDefinitionResponse,
  errors: [BadRequestException],
}));
/**
 * Retrieves information about a logger definition version.
 */
export const getLoggerDefinitionVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLoggerDefinitionVersionRequest,
    output: GetLoggerDefinitionVersionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Retrieves information about a resource definition, including its creation time and latest version.
 */
export const getResourceDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourceDefinitionRequest,
    output: GetResourceDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Retrieves information about a resource definition version, including which resources are included in the version.
 */
export const getResourceDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetResourceDefinitionVersionRequest,
    output: GetResourceDefinitionVersionResponse,
    errors: [BadRequestException],
  }));
/**
 * Retrieves information about a subscription definition.
 */
export const getSubscriptionDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSubscriptionDefinitionRequest,
    output: GetSubscriptionDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Retrieves information about a subscription definition version.
 */
export const getSubscriptionDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSubscriptionDefinitionVersionRequest,
    output: GetSubscriptionDefinitionVersionResponse,
    errors: [BadRequestException],
  }));
/**
 * Retrieves a list of core definitions.
 */
export const listCoreDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCoreDefinitionsRequest,
  output: ListCoreDefinitionsResponse,
  errors: [],
}));
/**
 * Lists the versions of a core definition.
 */
export const listCoreDefinitionVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCoreDefinitionVersionsRequest,
    output: ListCoreDefinitionVersionsResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Retrieves a list of device definitions.
 */
export const listDeviceDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDeviceDefinitionsRequest,
    output: ListDeviceDefinitionsResponse,
    errors: [],
  }),
);
/**
 * Lists the versions of a device definition.
 */
export const listDeviceDefinitionVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDeviceDefinitionVersionsRequest,
    output: ListDeviceDefinitionVersionsResponse,
    errors: [BadRequestException],
  }));
/**
 * Retrieves a list of Lambda function definitions.
 */
export const listFunctionDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFunctionDefinitionsRequest,
    output: ListFunctionDefinitionsResponse,
    errors: [],
  }),
);
/**
 * Lists the versions of a Lambda function definition.
 */
export const listFunctionDefinitionVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListFunctionDefinitionVersionsRequest,
    output: ListFunctionDefinitionVersionsResponse,
    errors: [BadRequestException],
  }));
/**
 * Lists the versions of a group.
 */
export const listGroupVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGroupVersionsRequest,
  output: ListGroupVersionsResponse,
  errors: [BadRequestException],
}));
/**
 * Retrieves a list of logger definitions.
 */
export const listLoggerDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLoggerDefinitionsRequest,
    output: ListLoggerDefinitionsResponse,
    errors: [],
  }),
);
/**
 * Lists the versions of a logger definition.
 */
export const listLoggerDefinitionVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListLoggerDefinitionVersionsRequest,
    output: ListLoggerDefinitionVersionsResponse,
    errors: [BadRequestException],
  }));
/**
 * Retrieves a list of resource definitions.
 */
export const listResourceDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourceDefinitionsRequest,
    output: ListResourceDefinitionsResponse,
    errors: [],
  }),
);
/**
 * Lists the versions of a resource definition.
 */
export const listResourceDefinitionVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListResourceDefinitionVersionsRequest,
    output: ListResourceDefinitionVersionsResponse,
    errors: [BadRequestException],
  }));
/**
 * Retrieves a list of subscription definitions.
 */
export const listSubscriptionDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSubscriptionDefinitionsRequest,
    output: ListSubscriptionDefinitionsResponse,
    errors: [],
  }),
);
/**
 * Lists the versions of a subscription definition.
 */
export const listSubscriptionDefinitionVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSubscriptionDefinitionVersionsRequest,
    output: ListSubscriptionDefinitionVersionsResponse,
    errors: [BadRequestException],
  }));
/**
 * Retrieves a list of resource tags for a resource arn.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [BadRequestException],
}));
/**
 * Resets a group's deployments.
 */
export const resetDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetDeploymentsRequest,
  output: ResetDeploymentsResponse,
  errors: [BadRequestException],
}));
/**
 * Deploys multiple groups in one operation. This action starts the bulk deployment of a specified set of group versions. Each group version deployment will be triggered with an adaptive rate that has a fixed upper limit. We recommend that you include an ''X-Amzn-Client-Token'' token in every ''StartBulkDeployment'' request. These requests are idempotent with respect to the token and the request parameters.
 */
export const startBulkDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBulkDeploymentRequest,
  output: StartBulkDeploymentResponse,
  errors: [BadRequestException],
}));
/**
 * Updates the Certificate expiry time for a group.
 */
export const updateGroupCertificateConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateGroupCertificateConfigurationRequest,
    output: UpdateGroupCertificateConfigurationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Updates the runtime configuration of a thing.
 */
export const updateThingRuntimeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateThingRuntimeConfigurationRequest,
    output: UpdateThingRuntimeConfigurationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Creates a connector definition. You may provide the initial version of the connector definition now or use ''CreateConnectorDefinitionVersion'' at a later time.
 */
export const createConnectorDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConnectorDefinitionRequest,
    output: CreateConnectorDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Creates a core definition. You may provide the initial version of the core definition now or use ''CreateCoreDefinitionVersion'' at a later time. Greengrass groups must each contain exactly one Greengrass core.
 */
export const createCoreDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCoreDefinitionRequest,
    output: CreateCoreDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Creates a version of a core definition that has already been defined. Greengrass groups must each contain exactly one Greengrass core.
 */
export const createCoreDefinitionVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCoreDefinitionVersionRequest,
    output: CreateCoreDefinitionVersionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Creates a device definition. You may provide the initial version of the device definition now or use ''CreateDeviceDefinitionVersion'' at a later time.
 */
export const createDeviceDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDeviceDefinitionRequest,
    output: CreateDeviceDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Creates a version of a device definition that has already been defined.
 */
export const createDeviceDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDeviceDefinitionVersionRequest,
    output: CreateDeviceDefinitionVersionResponse,
    errors: [BadRequestException],
  }));
/**
 * Creates a Lambda function definition which contains a list of Lambda functions and their configurations to be used in a group. You can create an initial version of the definition by providing a list of Lambda functions and their configurations now, or use ''CreateFunctionDefinitionVersion'' later.
 */
export const createFunctionDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFunctionDefinitionRequest,
    output: CreateFunctionDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Creates a group. You may provide the initial version of the group or use ''CreateGroupVersion'' at a later time. Tip: You can use the ''gg_group_setup'' package (https://github.com/awslabs/aws-greengrass-group-setup) as a library or command-line application to create and deploy Greengrass groups.
 */
export const createGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [BadRequestException],
}));
/**
 * Creates a logger definition. You may provide the initial version of the logger definition now or use ''CreateLoggerDefinitionVersion'' at a later time.
 */
export const createLoggerDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLoggerDefinitionRequest,
    output: CreateLoggerDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Creates a version of a logger definition that has already been defined.
 */
export const createLoggerDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateLoggerDefinitionVersionRequest,
    output: CreateLoggerDefinitionVersionResponse,
    errors: [BadRequestException],
  }));
/**
 * Creates a resource definition which contains a list of resources to be used in a group. You can create an initial version of the definition by providing a list of resources now, or use ''CreateResourceDefinitionVersion'' later.
 */
export const createResourceDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateResourceDefinitionRequest,
    output: CreateResourceDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Creates a subscription definition. You may provide the initial version of the subscription definition now or use ''CreateSubscriptionDefinitionVersion'' at a later time.
 */
export const createSubscriptionDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateSubscriptionDefinitionRequest,
    output: CreateSubscriptionDefinitionResponse,
    errors: [BadRequestException],
  }));
/**
 * Creates a version of a subscription definition which has already been defined.
 */
export const createSubscriptionDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateSubscriptionDefinitionVersionRequest,
    output: CreateSubscriptionDefinitionVersionResponse,
    errors: [BadRequestException],
  }));
/**
 * Deletes a connector definition.
 */
export const deleteConnectorDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConnectorDefinitionRequest,
    output: DeleteConnectorDefinitionResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Returns the status of a bulk deployment.
 */
export const getBulkDeploymentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBulkDeploymentStatusRequest,
    output: GetBulkDeploymentStatusResponse,
    errors: [BadRequestException],
  }),
);
/**
 * Gets a paginated list of the deployments that have been started in a bulk deployment operation, and their current deployment status.
 */
export const listBulkDeploymentDetailedReports =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListBulkDeploymentDetailedReportsRequest,
    output: ListBulkDeploymentDetailedReportsResponse,
    errors: [BadRequestException],
  }));
/**
 * Returns a list of bulk deployments.
 */
export const listBulkDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBulkDeploymentsRequest,
  output: ListBulkDeploymentsResponse,
  errors: [BadRequestException],
}));
/**
 * Retrieves a list of connector definitions.
 */
export const listConnectorDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConnectorDefinitionsRequest,
    output: ListConnectorDefinitionsResponse,
    errors: [],
  }),
);
/**
 * Lists the versions of a connector definition, which are containers for connectors. Connectors run on the Greengrass core and contain built-in integration with local infrastructure, device protocols, AWS, and other cloud services.
 */
export const listConnectorDefinitionVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListConnectorDefinitionVersionsRequest,
    output: ListConnectorDefinitionVersionsResponse,
    errors: [BadRequestException],
  }));
/**
 * Returns a history of deployments for the group.
 */
export const listDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDeploymentsRequest,
  output: ListDeploymentsResponse,
  errors: [BadRequestException],
}));
/**
 * Retrieves the current CAs for a group.
 */
export const listGroupCertificateAuthorities =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListGroupCertificateAuthoritiesRequest,
    output: ListGroupCertificateAuthoritiesResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Retrieves a list of groups.
 */
export const listGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [],
}));
/**
 * Updates the connectivity information for the core. Any devices that belong to the group which has this core will receive this information in order to find the location of the core and connect to it.
 */
export const updateConnectivityInfo = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConnectivityInfoRequest,
    output: UpdateConnectivityInfoResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Creates a version of a connector definition which has already been defined.
 */
export const createConnectorDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConnectorDefinitionVersionRequest,
    output: CreateConnectorDefinitionVersionResponse,
    errors: [BadRequestException],
  }));
/**
 * Get the runtime configuration of a thing.
 */
export const getThingRuntimeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetThingRuntimeConfigurationRequest,
    output: GetThingRuntimeConfigurationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Creates a version of a Lambda function definition that has already been defined.
 */
export const createFunctionDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateFunctionDefinitionVersionRequest,
    output: CreateFunctionDefinitionVersionResponse,
    errors: [BadRequestException],
  }));
/**
 * Creates a version of a resource definition that has already been defined.
 */
export const createResourceDefinitionVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateResourceDefinitionVersionRequest,
    output: CreateResourceDefinitionVersionResponse,
    errors: [BadRequestException],
  }));

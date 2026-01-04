import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "IoT Wireless",
  serviceShapeName: "iotwireless",
});
const auth = T.AwsAuthSigv4({ name: "iotwireless" });
const ver = T.ServiceVersion("2020-11-22");
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
                        url: "https://api.iotwireless-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [],
                      endpoint: {
                        url: "https://api.iotwireless-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://api.iotwireless.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://api.iotwireless.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetEventConfigurationByResourceTypesRequest extends S.Class<GetEventConfigurationByResourceTypesRequest>(
  "GetEventConfigurationByResourceTypesRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/event-configurations-resource-types" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLogLevelsByResourceTypesRequest extends S.Class<GetLogLevelsByResourceTypesRequest>(
  "GetLogLevelsByResourceTypesRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/log-levels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMetricConfigurationRequest extends S.Class<GetMetricConfigurationRequest>(
  "GetMetricConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/metric-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetAllResourceLogLevelsRequest extends S.Class<ResetAllResourceLogLevelsRequest>(
  "ResetAllResourceLogLevelsRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/log-levels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetAllResourceLogLevelsResponse extends S.Class<ResetAllResourceLogLevelsResponse>(
  "ResetAllResourceLogLevelsResponse",
)({}) {}
export class SidewalkCreateDeviceProfile extends S.Class<SidewalkCreateDeviceProfile>(
  "SidewalkCreateDeviceProfile",
)({}) {}
export const WirelessDeviceList = S.Array(S.String);
export const WirelessGatewayList = S.Array(S.String);
export const NetworkAnalyzerMulticastGroupList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const PositionCoordinate = S.Array(S.Number);
export const JoinEuiRange = S.Array(S.String);
export const JoinEuiFilters = S.Array(JoinEuiRange);
export const NetIdFilters = S.Array(S.String);
export class AssociateMulticastGroupWithFuotaTaskRequest extends S.Class<AssociateMulticastGroupWithFuotaTaskRequest>(
  "AssociateMulticastGroupWithFuotaTaskRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()), MulticastGroupId: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/fuota-tasks/{Id}/multicast-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateMulticastGroupWithFuotaTaskResponse extends S.Class<AssociateMulticastGroupWithFuotaTaskResponse>(
  "AssociateMulticastGroupWithFuotaTaskResponse",
)({}) {}
export class AssociateWirelessDeviceWithFuotaTaskRequest extends S.Class<AssociateWirelessDeviceWithFuotaTaskRequest>(
  "AssociateWirelessDeviceWithFuotaTaskRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()), WirelessDeviceId: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/fuota-tasks/{Id}/wireless-device" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateWirelessDeviceWithFuotaTaskResponse extends S.Class<AssociateWirelessDeviceWithFuotaTaskResponse>(
  "AssociateWirelessDeviceWithFuotaTaskResponse",
)({}) {}
export class AssociateWirelessDeviceWithMulticastGroupRequest extends S.Class<AssociateWirelessDeviceWithMulticastGroupRequest>(
  "AssociateWirelessDeviceWithMulticastGroupRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()), WirelessDeviceId: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/multicast-groups/{Id}/wireless-device" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateWirelessDeviceWithMulticastGroupResponse extends S.Class<AssociateWirelessDeviceWithMulticastGroupResponse>(
  "AssociateWirelessDeviceWithMulticastGroupResponse",
)({}) {}
export class AssociateWirelessDeviceWithThingRequest extends S.Class<AssociateWirelessDeviceWithThingRequest>(
  "AssociateWirelessDeviceWithThingRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()), ThingArn: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/wireless-devices/{Id}/thing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateWirelessDeviceWithThingResponse extends S.Class<AssociateWirelessDeviceWithThingResponse>(
  "AssociateWirelessDeviceWithThingResponse",
)({}) {}
export class AssociateWirelessGatewayWithCertificateRequest extends S.Class<AssociateWirelessGatewayWithCertificateRequest>(
  "AssociateWirelessGatewayWithCertificateRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()), IotCertificateId: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/wireless-gateways/{Id}/certificate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateWirelessGatewayWithThingRequest extends S.Class<AssociateWirelessGatewayWithThingRequest>(
  "AssociateWirelessGatewayWithThingRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()), ThingArn: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/wireless-gateways/{Id}/thing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateWirelessGatewayWithThingResponse extends S.Class<AssociateWirelessGatewayWithThingResponse>(
  "AssociateWirelessGatewayWithThingResponse",
)({}) {}
export class CancelMulticastGroupSessionRequest extends S.Class<CancelMulticastGroupSessionRequest>(
  "CancelMulticastGroupSessionRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/multicast-groups/{Id}/session" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelMulticastGroupSessionResponse extends S.Class<CancelMulticastGroupSessionResponse>(
  "CancelMulticastGroupSessionResponse",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateDestinationRequest extends S.Class<CreateDestinationRequest>(
  "CreateDestinationRequest",
)(
  {
    Name: S.String,
    ExpressionType: S.String,
    Expression: S.String,
    Description: S.optional(S.String),
    RoleArn: S.String,
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/destinations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWirelessGatewayTaskRequest extends S.Class<CreateWirelessGatewayTaskRequest>(
  "CreateWirelessGatewayTaskRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    WirelessGatewayTaskDefinitionId: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/wireless-gateways/{Id}/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDestinationRequest extends S.Class<DeleteDestinationRequest>(
  "DeleteDestinationRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/destinations/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDestinationResponse extends S.Class<DeleteDestinationResponse>(
  "DeleteDestinationResponse",
)({}) {}
export class DeleteDeviceProfileRequest extends S.Class<DeleteDeviceProfileRequest>(
  "DeleteDeviceProfileRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/device-profiles/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeviceProfileResponse extends S.Class<DeleteDeviceProfileResponse>(
  "DeleteDeviceProfileResponse",
)({}) {}
export class DeleteFuotaTaskRequest extends S.Class<DeleteFuotaTaskRequest>(
  "DeleteFuotaTaskRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/fuota-tasks/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFuotaTaskResponse extends S.Class<DeleteFuotaTaskResponse>(
  "DeleteFuotaTaskResponse",
)({}) {}
export class DeleteMulticastGroupRequest extends S.Class<DeleteMulticastGroupRequest>(
  "DeleteMulticastGroupRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/multicast-groups/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMulticastGroupResponse extends S.Class<DeleteMulticastGroupResponse>(
  "DeleteMulticastGroupResponse",
)({}) {}
export class DeleteNetworkAnalyzerConfigurationRequest extends S.Class<DeleteNetworkAnalyzerConfigurationRequest>(
  "DeleteNetworkAnalyzerConfigurationRequest",
)(
  { ConfigurationName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/network-analyzer-configurations/{ConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNetworkAnalyzerConfigurationResponse extends S.Class<DeleteNetworkAnalyzerConfigurationResponse>(
  "DeleteNetworkAnalyzerConfigurationResponse",
)({}) {}
export class DeleteQueuedMessagesRequest extends S.Class<DeleteQueuedMessagesRequest>(
  "DeleteQueuedMessagesRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    MessageId: S.String.pipe(T.HttpQuery("messageId")),
    WirelessDeviceType: S.optional(S.String).pipe(
      T.HttpQuery("WirelessDeviceType"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/wireless-devices/{Id}/data" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueuedMessagesResponse extends S.Class<DeleteQueuedMessagesResponse>(
  "DeleteQueuedMessagesResponse",
)({}) {}
export class DeleteServiceProfileRequest extends S.Class<DeleteServiceProfileRequest>(
  "DeleteServiceProfileRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/service-profiles/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServiceProfileResponse extends S.Class<DeleteServiceProfileResponse>(
  "DeleteServiceProfileResponse",
)({}) {}
export class DeleteWirelessDeviceRequest extends S.Class<DeleteWirelessDeviceRequest>(
  "DeleteWirelessDeviceRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/wireless-devices/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWirelessDeviceResponse extends S.Class<DeleteWirelessDeviceResponse>(
  "DeleteWirelessDeviceResponse",
)({}) {}
export class DeleteWirelessDeviceImportTaskRequest extends S.Class<DeleteWirelessDeviceImportTaskRequest>(
  "DeleteWirelessDeviceImportTaskRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/wireless_device_import_task/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWirelessDeviceImportTaskResponse extends S.Class<DeleteWirelessDeviceImportTaskResponse>(
  "DeleteWirelessDeviceImportTaskResponse",
)({}) {}
export class DeleteWirelessGatewayRequest extends S.Class<DeleteWirelessGatewayRequest>(
  "DeleteWirelessGatewayRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/wireless-gateways/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWirelessGatewayResponse extends S.Class<DeleteWirelessGatewayResponse>(
  "DeleteWirelessGatewayResponse",
)({}) {}
export class DeleteWirelessGatewayTaskRequest extends S.Class<DeleteWirelessGatewayTaskRequest>(
  "DeleteWirelessGatewayTaskRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/wireless-gateways/{Id}/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWirelessGatewayTaskResponse extends S.Class<DeleteWirelessGatewayTaskResponse>(
  "DeleteWirelessGatewayTaskResponse",
)({}) {}
export class DeleteWirelessGatewayTaskDefinitionRequest extends S.Class<DeleteWirelessGatewayTaskDefinitionRequest>(
  "DeleteWirelessGatewayTaskDefinitionRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/wireless-gateway-task-definitions/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWirelessGatewayTaskDefinitionResponse extends S.Class<DeleteWirelessGatewayTaskDefinitionResponse>(
  "DeleteWirelessGatewayTaskDefinitionResponse",
)({}) {}
export class DeregisterWirelessDeviceRequest extends S.Class<DeregisterWirelessDeviceRequest>(
  "DeregisterWirelessDeviceRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    WirelessDeviceType: S.optional(S.String).pipe(
      T.HttpQuery("WirelessDeviceType"),
    ),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/wireless-devices/{Identifier}/deregister",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterWirelessDeviceResponse extends S.Class<DeregisterWirelessDeviceResponse>(
  "DeregisterWirelessDeviceResponse",
)({}) {}
export class DisassociateAwsAccountFromPartnerAccountRequest extends S.Class<DisassociateAwsAccountFromPartnerAccountRequest>(
  "DisassociateAwsAccountFromPartnerAccountRequest",
)(
  {
    PartnerAccountId: S.String.pipe(T.HttpLabel()),
    PartnerType: S.String.pipe(T.HttpQuery("partnerType")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/partner-accounts/{PartnerAccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAwsAccountFromPartnerAccountResponse extends S.Class<DisassociateAwsAccountFromPartnerAccountResponse>(
  "DisassociateAwsAccountFromPartnerAccountResponse",
)({}) {}
export class DisassociateMulticastGroupFromFuotaTaskRequest extends S.Class<DisassociateMulticastGroupFromFuotaTaskRequest>(
  "DisassociateMulticastGroupFromFuotaTaskRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    MulticastGroupId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/fuota-tasks/{Id}/multicast-groups/{MulticastGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMulticastGroupFromFuotaTaskResponse extends S.Class<DisassociateMulticastGroupFromFuotaTaskResponse>(
  "DisassociateMulticastGroupFromFuotaTaskResponse",
)({}) {}
export class DisassociateWirelessDeviceFromFuotaTaskRequest extends S.Class<DisassociateWirelessDeviceFromFuotaTaskRequest>(
  "DisassociateWirelessDeviceFromFuotaTaskRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    WirelessDeviceId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/fuota-tasks/{Id}/wireless-devices/{WirelessDeviceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateWirelessDeviceFromFuotaTaskResponse extends S.Class<DisassociateWirelessDeviceFromFuotaTaskResponse>(
  "DisassociateWirelessDeviceFromFuotaTaskResponse",
)({}) {}
export class DisassociateWirelessDeviceFromMulticastGroupRequest extends S.Class<DisassociateWirelessDeviceFromMulticastGroupRequest>(
  "DisassociateWirelessDeviceFromMulticastGroupRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    WirelessDeviceId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/multicast-groups/{Id}/wireless-devices/{WirelessDeviceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateWirelessDeviceFromMulticastGroupResponse extends S.Class<DisassociateWirelessDeviceFromMulticastGroupResponse>(
  "DisassociateWirelessDeviceFromMulticastGroupResponse",
)({}) {}
export class DisassociateWirelessDeviceFromThingRequest extends S.Class<DisassociateWirelessDeviceFromThingRequest>(
  "DisassociateWirelessDeviceFromThingRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/wireless-devices/{Id}/thing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateWirelessDeviceFromThingResponse extends S.Class<DisassociateWirelessDeviceFromThingResponse>(
  "DisassociateWirelessDeviceFromThingResponse",
)({}) {}
export class DisassociateWirelessGatewayFromCertificateRequest extends S.Class<DisassociateWirelessGatewayFromCertificateRequest>(
  "DisassociateWirelessGatewayFromCertificateRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/wireless-gateways/{Id}/certificate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateWirelessGatewayFromCertificateResponse extends S.Class<DisassociateWirelessGatewayFromCertificateResponse>(
  "DisassociateWirelessGatewayFromCertificateResponse",
)({}) {}
export class DisassociateWirelessGatewayFromThingRequest extends S.Class<DisassociateWirelessGatewayFromThingRequest>(
  "DisassociateWirelessGatewayFromThingRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/wireless-gateways/{Id}/thing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateWirelessGatewayFromThingResponse extends S.Class<DisassociateWirelessGatewayFromThingResponse>(
  "DisassociateWirelessGatewayFromThingResponse",
)({}) {}
export class GetDestinationRequest extends S.Class<GetDestinationRequest>(
  "GetDestinationRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/destinations/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeviceProfileRequest extends S.Class<GetDeviceProfileRequest>(
  "GetDeviceProfileRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/device-profiles/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFuotaTaskRequest extends S.Class<GetFuotaTaskRequest>(
  "GetFuotaTaskRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/fuota-tasks/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMulticastGroupRequest extends S.Class<GetMulticastGroupRequest>(
  "GetMulticastGroupRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/multicast-groups/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMulticastGroupSessionRequest extends S.Class<GetMulticastGroupSessionRequest>(
  "GetMulticastGroupSessionRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/multicast-groups/{Id}/session" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNetworkAnalyzerConfigurationRequest extends S.Class<GetNetworkAnalyzerConfigurationRequest>(
  "GetNetworkAnalyzerConfigurationRequest",
)(
  { ConfigurationName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/network-analyzer-configurations/{ConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPartnerAccountRequest extends S.Class<GetPartnerAccountRequest>(
  "GetPartnerAccountRequest",
)(
  {
    PartnerAccountId: S.String.pipe(T.HttpLabel()),
    PartnerType: S.String.pipe(T.HttpQuery("partnerType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/partner-accounts/{PartnerAccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPositionRequest extends S.Class<GetPositionRequest>(
  "GetPositionRequest",
)(
  {
    ResourceIdentifier: S.String.pipe(T.HttpLabel()),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/positions/{ResourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPositionConfigurationRequest extends S.Class<GetPositionConfigurationRequest>(
  "GetPositionConfigurationRequest",
)(
  {
    ResourceIdentifier: S.String.pipe(T.HttpLabel()),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/position-configurations/{ResourceIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceEventConfigurationRequest extends S.Class<GetResourceEventConfigurationRequest>(
  "GetResourceEventConfigurationRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    IdentifierType: S.String.pipe(T.HttpQuery("identifierType")),
    PartnerType: S.optional(S.String).pipe(T.HttpQuery("partnerType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/event-configurations/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceLogLevelRequest extends S.Class<GetResourceLogLevelRequest>(
  "GetResourceLogLevelRequest",
)(
  {
    ResourceIdentifier: S.String.pipe(T.HttpLabel()),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/log-levels/{ResourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePositionRequest extends S.Class<GetResourcePositionRequest>(
  "GetResourcePositionRequest",
)(
  {
    ResourceIdentifier: S.String.pipe(T.HttpLabel()),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resource-positions/{ResourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceEndpointRequest extends S.Class<GetServiceEndpointRequest>(
  "GetServiceEndpointRequest",
)(
  { ServiceType: S.optional(S.String).pipe(T.HttpQuery("serviceType")) },
  T.all(
    T.Http({ method: "GET", uri: "/service-endpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceProfileRequest extends S.Class<GetServiceProfileRequest>(
  "GetServiceProfileRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/service-profiles/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWirelessDeviceRequest extends S.Class<GetWirelessDeviceRequest>(
  "GetWirelessDeviceRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    IdentifierType: S.String.pipe(T.HttpQuery("identifierType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/wireless-devices/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWirelessDeviceImportTaskRequest extends S.Class<GetWirelessDeviceImportTaskRequest>(
  "GetWirelessDeviceImportTaskRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/wireless_device_import_task/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWirelessDeviceStatisticsRequest extends S.Class<GetWirelessDeviceStatisticsRequest>(
  "GetWirelessDeviceStatisticsRequest",
)(
  { WirelessDeviceId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/wireless-devices/{WirelessDeviceId}/statistics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWirelessGatewayRequest extends S.Class<GetWirelessGatewayRequest>(
  "GetWirelessGatewayRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    IdentifierType: S.String.pipe(T.HttpQuery("identifierType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/wireless-gateways/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWirelessGatewayCertificateRequest extends S.Class<GetWirelessGatewayCertificateRequest>(
  "GetWirelessGatewayCertificateRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/wireless-gateways/{Id}/certificate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWirelessGatewayFirmwareInformationRequest extends S.Class<GetWirelessGatewayFirmwareInformationRequest>(
  "GetWirelessGatewayFirmwareInformationRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/wireless-gateways/{Id}/firmware-information",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWirelessGatewayStatisticsRequest extends S.Class<GetWirelessGatewayStatisticsRequest>(
  "GetWirelessGatewayStatisticsRequest",
)(
  { WirelessGatewayId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/wireless-gateways/{WirelessGatewayId}/statistics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWirelessGatewayTaskRequest extends S.Class<GetWirelessGatewayTaskRequest>(
  "GetWirelessGatewayTaskRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/wireless-gateways/{Id}/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWirelessGatewayTaskDefinitionRequest extends S.Class<GetWirelessGatewayTaskDefinitionRequest>(
  "GetWirelessGatewayTaskDefinitionRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/wireless-gateway-task-definitions/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDestinationsRequest extends S.Class<ListDestinationsRequest>(
  "ListDestinationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/destinations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeviceProfilesRequest extends S.Class<ListDeviceProfilesRequest>(
  "ListDeviceProfilesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    DeviceProfileType: S.optional(S.String).pipe(
      T.HttpQuery("deviceProfileType"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/device-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDevicesForWirelessDeviceImportTaskRequest extends S.Class<ListDevicesForWirelessDeviceImportTaskRequest>(
  "ListDevicesForWirelessDeviceImportTaskRequest",
)(
  {
    Id: S.String.pipe(T.HttpQuery("id")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/wireless_device_import_task" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventConfigurationsRequest extends S.Class<ListEventConfigurationsRequest>(
  "ListEventConfigurationsRequest",
)(
  {
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/event-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFuotaTasksRequest extends S.Class<ListFuotaTasksRequest>(
  "ListFuotaTasksRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/fuota-tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMulticastGroupsRequest extends S.Class<ListMulticastGroupsRequest>(
  "ListMulticastGroupsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/multicast-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMulticastGroupsByFuotaTaskRequest extends S.Class<ListMulticastGroupsByFuotaTaskRequest>(
  "ListMulticastGroupsByFuotaTaskRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/fuota-tasks/{Id}/multicast-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNetworkAnalyzerConfigurationsRequest extends S.Class<ListNetworkAnalyzerConfigurationsRequest>(
  "ListNetworkAnalyzerConfigurationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/network-analyzer-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPartnerAccountsRequest extends S.Class<ListPartnerAccountsRequest>(
  "ListPartnerAccountsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/partner-accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPositionConfigurationsRequest extends S.Class<ListPositionConfigurationsRequest>(
  "ListPositionConfigurationsRequest",
)(
  {
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/position-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueuedMessagesRequest extends S.Class<ListQueuedMessagesRequest>(
  "ListQueuedMessagesRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    WirelessDeviceType: S.optional(S.String).pipe(
      T.HttpQuery("WirelessDeviceType"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/wireless-devices/{Id}/data" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceProfilesRequest extends S.Class<ListServiceProfilesRequest>(
  "ListServiceProfilesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/service-profiles" }),
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
  { ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class ListWirelessDeviceImportTasksRequest extends S.Class<ListWirelessDeviceImportTasksRequest>(
  "ListWirelessDeviceImportTasksRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/wireless_device_import_tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWirelessDevicesRequest extends S.Class<ListWirelessDevicesRequest>(
  "ListWirelessDevicesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    DestinationName: S.optional(S.String).pipe(T.HttpQuery("destinationName")),
    DeviceProfileId: S.optional(S.String).pipe(T.HttpQuery("deviceProfileId")),
    ServiceProfileId: S.optional(S.String).pipe(
      T.HttpQuery("serviceProfileId"),
    ),
    WirelessDeviceType: S.optional(S.String).pipe(
      T.HttpQuery("wirelessDeviceType"),
    ),
    FuotaTaskId: S.optional(S.String).pipe(T.HttpQuery("fuotaTaskId")),
    MulticastGroupId: S.optional(S.String).pipe(
      T.HttpQuery("multicastGroupId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/wireless-devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWirelessGatewaysRequest extends S.Class<ListWirelessGatewaysRequest>(
  "ListWirelessGatewaysRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/wireless-gateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWirelessGatewayTaskDefinitionsRequest extends S.Class<ListWirelessGatewayTaskDefinitionsRequest>(
  "ListWirelessGatewayTaskDefinitionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    TaskDefinitionType: S.optional(S.String).pipe(
      T.HttpQuery("taskDefinitionType"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/wireless-gateway-task-definitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourceLogLevelRequest extends S.Class<PutResourceLogLevelRequest>(
  "PutResourceLogLevelRequest",
)(
  {
    ResourceIdentifier: S.String.pipe(T.HttpLabel()),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
    LogLevel: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/log-levels/{ResourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourceLogLevelResponse extends S.Class<PutResourceLogLevelResponse>(
  "PutResourceLogLevelResponse",
)({}) {}
export class ResetResourceLogLevelRequest extends S.Class<ResetResourceLogLevelRequest>(
  "ResetResourceLogLevelRequest",
)(
  {
    ResourceIdentifier: S.String.pipe(T.HttpLabel()),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/log-levels/{ResourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetResourceLogLevelResponse extends S.Class<ResetResourceLogLevelResponse>(
  "ResetResourceLogLevelResponse",
)({}) {}
export class StartBulkAssociateWirelessDeviceWithMulticastGroupRequest extends S.Class<StartBulkAssociateWirelessDeviceWithMulticastGroupRequest>(
  "StartBulkAssociateWirelessDeviceWithMulticastGroupRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    QueryString: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/multicast-groups/{Id}/bulk" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartBulkAssociateWirelessDeviceWithMulticastGroupResponse extends S.Class<StartBulkAssociateWirelessDeviceWithMulticastGroupResponse>(
  "StartBulkAssociateWirelessDeviceWithMulticastGroupResponse",
)({}) {}
export class StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest extends S.Class<StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest>(
  "StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    QueryString: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/multicast-groups/{Id}/bulk" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse extends S.Class<StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse>(
  "StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")), Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class TestWirelessDeviceRequest extends S.Class<TestWirelessDeviceRequest>(
  "TestWirelessDeviceRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/wireless-devices/{Id}/test" }),
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
    ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags" }),
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
export class UpdateDestinationRequest extends S.Class<UpdateDestinationRequest>(
  "UpdateDestinationRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    ExpressionType: S.optional(S.String),
    Expression: S.optional(S.String),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/destinations/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDestinationResponse extends S.Class<UpdateDestinationResponse>(
  "UpdateDestinationResponse",
)({}) {}
export class SidewalkResourceTypeEventConfiguration extends S.Class<SidewalkResourceTypeEventConfiguration>(
  "SidewalkResourceTypeEventConfiguration",
)({ WirelessDeviceEventTopic: S.optional(S.String) }) {}
export class DeviceRegistrationStateResourceTypeEventConfiguration extends S.Class<DeviceRegistrationStateResourceTypeEventConfiguration>(
  "DeviceRegistrationStateResourceTypeEventConfiguration",
)({ Sidewalk: S.optional(SidewalkResourceTypeEventConfiguration) }) {}
export class ProximityResourceTypeEventConfiguration extends S.Class<ProximityResourceTypeEventConfiguration>(
  "ProximityResourceTypeEventConfiguration",
)({ Sidewalk: S.optional(SidewalkResourceTypeEventConfiguration) }) {}
export class LoRaWANJoinResourceTypeEventConfiguration extends S.Class<LoRaWANJoinResourceTypeEventConfiguration>(
  "LoRaWANJoinResourceTypeEventConfiguration",
)({ WirelessDeviceEventTopic: S.optional(S.String) }) {}
export class JoinResourceTypeEventConfiguration extends S.Class<JoinResourceTypeEventConfiguration>(
  "JoinResourceTypeEventConfiguration",
)({ LoRaWAN: S.optional(LoRaWANJoinResourceTypeEventConfiguration) }) {}
export class LoRaWANConnectionStatusResourceTypeEventConfiguration extends S.Class<LoRaWANConnectionStatusResourceTypeEventConfiguration>(
  "LoRaWANConnectionStatusResourceTypeEventConfiguration",
)({ WirelessGatewayEventTopic: S.optional(S.String) }) {}
export class ConnectionStatusResourceTypeEventConfiguration extends S.Class<ConnectionStatusResourceTypeEventConfiguration>(
  "ConnectionStatusResourceTypeEventConfiguration",
)({
  LoRaWAN: S.optional(LoRaWANConnectionStatusResourceTypeEventConfiguration),
}) {}
export class MessageDeliveryStatusResourceTypeEventConfiguration extends S.Class<MessageDeliveryStatusResourceTypeEventConfiguration>(
  "MessageDeliveryStatusResourceTypeEventConfiguration",
)({ Sidewalk: S.optional(SidewalkResourceTypeEventConfiguration) }) {}
export class UpdateEventConfigurationByResourceTypesRequest extends S.Class<UpdateEventConfigurationByResourceTypesRequest>(
  "UpdateEventConfigurationByResourceTypesRequest",
)(
  {
    DeviceRegistrationState: S.optional(
      DeviceRegistrationStateResourceTypeEventConfiguration,
    ),
    Proximity: S.optional(ProximityResourceTypeEventConfiguration),
    Join: S.optional(JoinResourceTypeEventConfiguration),
    ConnectionStatus: S.optional(
      ConnectionStatusResourceTypeEventConfiguration,
    ),
    MessageDeliveryStatus: S.optional(
      MessageDeliveryStatusResourceTypeEventConfiguration,
    ),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/event-configurations-resource-types" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEventConfigurationByResourceTypesResponse extends S.Class<UpdateEventConfigurationByResourceTypesResponse>(
  "UpdateEventConfigurationByResourceTypesResponse",
)({}) {}
export class LoRaWANFuotaTask extends S.Class<LoRaWANFuotaTask>(
  "LoRaWANFuotaTask",
)({ RfRegion: S.optional(S.String) }) {}
export class UpdateFuotaTaskRequest extends S.Class<UpdateFuotaTaskRequest>(
  "UpdateFuotaTaskRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANFuotaTask),
    FirmwareUpdateImage: S.optional(S.String),
    FirmwareUpdateRole: S.optional(S.String),
    RedundancyPercent: S.optional(S.Number),
    FragmentSizeBytes: S.optional(S.Number),
    FragmentIntervalMS: S.optional(S.Number),
    Descriptor: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/fuota-tasks/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFuotaTaskResponse extends S.Class<UpdateFuotaTaskResponse>(
  "UpdateFuotaTaskResponse",
)({}) {}
export class FuotaTaskEventLogOption extends S.Class<FuotaTaskEventLogOption>(
  "FuotaTaskEventLogOption",
)({ Event: S.String, LogLevel: S.String }) {}
export const FuotaTaskEventLogOptionList = S.Array(FuotaTaskEventLogOption);
export class FuotaTaskLogOption extends S.Class<FuotaTaskLogOption>(
  "FuotaTaskLogOption",
)({
  Type: S.String,
  LogLevel: S.String,
  Events: S.optional(FuotaTaskEventLogOptionList),
}) {}
export const FuotaTaskLogOptionList = S.Array(FuotaTaskLogOption);
export class WirelessDeviceEventLogOption extends S.Class<WirelessDeviceEventLogOption>(
  "WirelessDeviceEventLogOption",
)({ Event: S.String, LogLevel: S.String }) {}
export const WirelessDeviceEventLogOptionList = S.Array(
  WirelessDeviceEventLogOption,
);
export class WirelessDeviceLogOption extends S.Class<WirelessDeviceLogOption>(
  "WirelessDeviceLogOption",
)({
  Type: S.String,
  LogLevel: S.String,
  Events: S.optional(WirelessDeviceEventLogOptionList),
}) {}
export const WirelessDeviceLogOptionList = S.Array(WirelessDeviceLogOption);
export class WirelessGatewayEventLogOption extends S.Class<WirelessGatewayEventLogOption>(
  "WirelessGatewayEventLogOption",
)({ Event: S.String, LogLevel: S.String }) {}
export const WirelessGatewayEventLogOptionList = S.Array(
  WirelessGatewayEventLogOption,
);
export class WirelessGatewayLogOption extends S.Class<WirelessGatewayLogOption>(
  "WirelessGatewayLogOption",
)({
  Type: S.String,
  LogLevel: S.String,
  Events: S.optional(WirelessGatewayEventLogOptionList),
}) {}
export const WirelessGatewayLogOptionList = S.Array(WirelessGatewayLogOption);
export class UpdateLogLevelsByResourceTypesRequest extends S.Class<UpdateLogLevelsByResourceTypesRequest>(
  "UpdateLogLevelsByResourceTypesRequest",
)(
  {
    DefaultLogLevel: S.optional(S.String),
    FuotaTaskLogOptions: S.optional(FuotaTaskLogOptionList),
    WirelessDeviceLogOptions: S.optional(WirelessDeviceLogOptionList),
    WirelessGatewayLogOptions: S.optional(WirelessGatewayLogOptionList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/log-levels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLogLevelsByResourceTypesResponse extends S.Class<UpdateLogLevelsByResourceTypesResponse>(
  "UpdateLogLevelsByResourceTypesResponse",
)({}) {}
export class SummaryMetricConfiguration extends S.Class<SummaryMetricConfiguration>(
  "SummaryMetricConfiguration",
)({ Status: S.optional(S.String) }) {}
export class UpdateMetricConfigurationRequest extends S.Class<UpdateMetricConfigurationRequest>(
  "UpdateMetricConfigurationRequest",
)(
  { SummaryMetric: S.optional(SummaryMetricConfiguration) },
  T.all(
    T.Http({ method: "PUT", uri: "/metric-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMetricConfigurationResponse extends S.Class<UpdateMetricConfigurationResponse>(
  "UpdateMetricConfigurationResponse",
)({}) {}
export const GatewayListMulticast = S.Array(S.String);
export class ParticipatingGatewaysMulticast extends S.Class<ParticipatingGatewaysMulticast>(
  "ParticipatingGatewaysMulticast",
)({
  GatewayList: S.optional(GatewayListMulticast),
  TransmissionInterval: S.optional(S.Number),
}) {}
export class LoRaWANMulticast extends S.Class<LoRaWANMulticast>(
  "LoRaWANMulticast",
)({
  RfRegion: S.optional(S.String),
  DlClass: S.optional(S.String),
  ParticipatingGateways: S.optional(ParticipatingGatewaysMulticast),
}) {}
export class UpdateMulticastGroupRequest extends S.Class<UpdateMulticastGroupRequest>(
  "UpdateMulticastGroupRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANMulticast),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/multicast-groups/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMulticastGroupResponse extends S.Class<UpdateMulticastGroupResponse>(
  "UpdateMulticastGroupResponse",
)({}) {}
export class TraceContent extends S.Class<TraceContent>("TraceContent")({
  WirelessDeviceFrameInfo: S.optional(S.String),
  LogLevel: S.optional(S.String),
  MulticastFrameInfo: S.optional(S.String),
}) {}
export class UpdateNetworkAnalyzerConfigurationRequest extends S.Class<UpdateNetworkAnalyzerConfigurationRequest>(
  "UpdateNetworkAnalyzerConfigurationRequest",
)(
  {
    ConfigurationName: S.String.pipe(T.HttpLabel()),
    TraceContent: S.optional(TraceContent),
    WirelessDevicesToAdd: S.optional(WirelessDeviceList),
    WirelessDevicesToRemove: S.optional(WirelessDeviceList),
    WirelessGatewaysToAdd: S.optional(WirelessGatewayList),
    WirelessGatewaysToRemove: S.optional(WirelessGatewayList),
    Description: S.optional(S.String),
    MulticastGroupsToAdd: S.optional(NetworkAnalyzerMulticastGroupList),
    MulticastGroupsToRemove: S.optional(NetworkAnalyzerMulticastGroupList),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/network-analyzer-configurations/{ConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNetworkAnalyzerConfigurationResponse extends S.Class<UpdateNetworkAnalyzerConfigurationResponse>(
  "UpdateNetworkAnalyzerConfigurationResponse",
)({}) {}
export class UpdatePositionRequest extends S.Class<UpdatePositionRequest>(
  "UpdatePositionRequest",
)(
  {
    ResourceIdentifier: S.String.pipe(T.HttpLabel()),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
    Position: PositionCoordinate,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/positions/{ResourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePositionResponse extends S.Class<UpdatePositionResponse>(
  "UpdatePositionResponse",
)({}) {}
export class UpdateResourcePositionRequest extends S.Class<UpdateResourcePositionRequest>(
  "UpdateResourcePositionRequest",
)(
  {
    ResourceIdentifier: S.String.pipe(T.HttpLabel()),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
    GeoJsonPayload: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/resource-positions/{ResourceIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResourcePositionResponse extends S.Class<UpdateResourcePositionResponse>(
  "UpdateResourcePositionResponse",
)({}) {}
export class UpdateWirelessGatewayRequest extends S.Class<UpdateWirelessGatewayRequest>(
  "UpdateWirelessGatewayRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    JoinEuiFilters: S.optional(JoinEuiFilters),
    NetIdFilters: S.optional(NetIdFilters),
    MaxEirp: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/wireless-gateways/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWirelessGatewayResponse extends S.Class<UpdateWirelessGatewayResponse>(
  "UpdateWirelessGatewayResponse",
)({}) {}
export const FactoryPresetFreqsList = S.Array(S.Number);
export const SubBands = S.Array(S.Number);
export const AssistPosition = S.Array(S.Number);
export class SidewalkAccountInfo extends S.Class<SidewalkAccountInfo>(
  "SidewalkAccountInfo",
)({
  AmazonId: S.optional(S.String),
  AppServerPrivateKey: S.optional(S.String),
}) {}
export class LoRaWANDeviceProfile extends S.Class<LoRaWANDeviceProfile>(
  "LoRaWANDeviceProfile",
)({
  SupportsClassB: S.optional(S.Boolean),
  ClassBTimeout: S.optional(S.Number),
  PingSlotPeriod: S.optional(S.Number),
  PingSlotDr: S.optional(S.Number),
  PingSlotFreq: S.optional(S.Number),
  SupportsClassC: S.optional(S.Boolean),
  ClassCTimeout: S.optional(S.Number),
  MacVersion: S.optional(S.String),
  RegParamsRevision: S.optional(S.String),
  RxDelay1: S.optional(S.Number),
  RxDrOffset1: S.optional(S.Number),
  RxDataRate2: S.optional(S.Number),
  RxFreq2: S.optional(S.Number),
  FactoryPresetFreqsList: S.optional(FactoryPresetFreqsList),
  MaxEirp: S.optional(S.Number),
  MaxDutyCycle: S.optional(S.Number),
  RfRegion: S.optional(S.String),
  SupportsJoin: S.optional(S.Boolean),
  Supports32BitFCnt: S.optional(S.Boolean),
}) {}
export class LoRaWANServiceProfile extends S.Class<LoRaWANServiceProfile>(
  "LoRaWANServiceProfile",
)({
  AddGwMetadata: S.optional(S.Boolean),
  DrMin: S.optional(S.Number),
  DrMax: S.optional(S.Number),
  PrAllowed: S.optional(S.Boolean),
  RaAllowed: S.optional(S.Boolean),
  TxPowerIndexMin: S.optional(S.Number),
  TxPowerIndexMax: S.optional(S.Number),
  NbTransMin: S.optional(S.Number),
  NbTransMax: S.optional(S.Number),
}) {}
export class WiFiAccessPoint extends S.Class<WiFiAccessPoint>(
  "WiFiAccessPoint",
)({ MacAddress: S.String, Rss: S.Number }) {}
export const WiFiAccessPoints = S.Array(WiFiAccessPoint);
export class Ip extends S.Class<Ip>("Ip")({ IpAddress: S.String }) {}
export class Gnss extends S.Class<Gnss>("Gnss")({
  Payload: S.String,
  CaptureTime: S.optional(S.Number),
  CaptureTimeAccuracy: S.optional(S.Number),
  AssistPosition: S.optional(AssistPosition),
  AssistAltitude: S.optional(S.Number),
  Use2DSolver: S.optional(S.Boolean),
}) {}
export class SidewalkAccountInfoWithFingerprint extends S.Class<SidewalkAccountInfoWithFingerprint>(
  "SidewalkAccountInfoWithFingerprint",
)({
  AmazonId: S.optional(S.String),
  Fingerprint: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export const SidewalkAccountList = S.Array(SidewalkAccountInfoWithFingerprint);
export class LoRaWANStartFuotaTask extends S.Class<LoRaWANStartFuotaTask>(
  "LoRaWANStartFuotaTask",
)({ StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))) }) {}
export class LoRaWANMulticastSession extends S.Class<LoRaWANMulticastSession>(
  "LoRaWANMulticastSession",
)({
  DlDr: S.optional(S.Number),
  DlFreq: S.optional(S.Number),
  SessionStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SessionTimeout: S.optional(S.Number),
  PingSlotPeriod: S.optional(S.Number),
}) {}
export class SidewalkPositioning extends S.Class<SidewalkPositioning>(
  "SidewalkPositioning",
)({ DestinationName: S.optional(S.String) }) {}
export class SidewalkSingleStartImportInfo extends S.Class<SidewalkSingleStartImportInfo>(
  "SidewalkSingleStartImportInfo",
)({
  SidewalkManufacturingSn: S.optional(S.String),
  Positioning: S.optional(SidewalkPositioning),
}) {}
export class SidewalkStartImportInfo extends S.Class<SidewalkStartImportInfo>(
  "SidewalkStartImportInfo",
)({
  DeviceCreationFile: S.optional(S.String),
  Role: S.optional(S.String),
  Positioning: S.optional(SidewalkPositioning),
}) {}
export class SidewalkUpdateAccount extends S.Class<SidewalkUpdateAccount>(
  "SidewalkUpdateAccount",
)({ AppServerPrivateKey: S.optional(S.String) }) {}
export class SidewalkEventNotificationConfigurations extends S.Class<SidewalkEventNotificationConfigurations>(
  "SidewalkEventNotificationConfigurations",
)({ AmazonIdEventTopic: S.optional(S.String) }) {}
export class ProximityEventConfiguration extends S.Class<ProximityEventConfiguration>(
  "ProximityEventConfiguration",
)({
  Sidewalk: S.optional(SidewalkEventNotificationConfigurations),
  WirelessDeviceIdEventTopic: S.optional(S.String),
}) {}
export class MessageDeliveryStatusEventConfiguration extends S.Class<MessageDeliveryStatusEventConfiguration>(
  "MessageDeliveryStatusEventConfiguration",
)({
  Sidewalk: S.optional(SidewalkEventNotificationConfigurations),
  WirelessDeviceIdEventTopic: S.optional(S.String),
}) {}
export class SidewalkUpdateWirelessDevice extends S.Class<SidewalkUpdateWirelessDevice>(
  "SidewalkUpdateWirelessDevice",
)({ Positioning: S.optional(SidewalkPositioning) }) {}
export class SidewalkUpdateImportInfo extends S.Class<SidewalkUpdateImportInfo>(
  "SidewalkUpdateImportInfo",
)({ DeviceCreationFile: S.optional(S.String) }) {}
export const BeaconingFrequencies = S.Array(S.Number);
export class AssociateAwsAccountWithPartnerAccountRequest extends S.Class<AssociateAwsAccountWithPartnerAccountRequest>(
  "AssociateAwsAccountWithPartnerAccountRequest",
)(
  {
    Sidewalk: SidewalkAccountInfo,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/partner-accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateWirelessGatewayWithCertificateResponse extends S.Class<AssociateWirelessGatewayWithCertificateResponse>(
  "AssociateWirelessGatewayWithCertificateResponse",
)({ IotCertificateId: S.optional(S.String) }) {}
export class CreateDestinationResponse extends S.Class<CreateDestinationResponse>(
  "CreateDestinationResponse",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }) {}
export class CreateDeviceProfileRequest extends S.Class<CreateDeviceProfileRequest>(
  "CreateDeviceProfileRequest",
)(
  {
    Name: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANDeviceProfile),
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String),
    Sidewalk: S.optional(SidewalkCreateDeviceProfile),
  },
  T.all(
    T.Http({ method: "POST", uri: "/device-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFuotaTaskRequest extends S.Class<CreateFuotaTaskRequest>(
  "CreateFuotaTaskRequest",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANFuotaTask),
    FirmwareUpdateImage: S.String,
    FirmwareUpdateRole: S.String,
    Tags: S.optional(TagList),
    RedundancyPercent: S.optional(S.Number),
    FragmentSizeBytes: S.optional(S.Number),
    FragmentIntervalMS: S.optional(S.Number),
    Descriptor: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/fuota-tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNetworkAnalyzerConfigurationRequest extends S.Class<CreateNetworkAnalyzerConfigurationRequest>(
  "CreateNetworkAnalyzerConfigurationRequest",
)(
  {
    Name: S.String,
    TraceContent: S.optional(TraceContent),
    WirelessDevices: S.optional(WirelessDeviceList),
    WirelessGateways: S.optional(WirelessGatewayList),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String),
    MulticastGroups: S.optional(NetworkAnalyzerMulticastGroupList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/network-analyzer-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateServiceProfileRequest extends S.Class<CreateServiceProfileRequest>(
  "CreateServiceProfileRequest",
)(
  {
    Name: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANServiceProfile),
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/service-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWirelessGatewayTaskResponse extends S.Class<CreateWirelessGatewayTaskResponse>(
  "CreateWirelessGatewayTaskResponse",
)({
  WirelessGatewayTaskDefinitionId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class GetDestinationResponse extends S.Class<GetDestinationResponse>(
  "GetDestinationResponse",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Expression: S.optional(S.String),
  ExpressionType: S.optional(S.String),
  Description: S.optional(S.String),
  RoleArn: S.optional(S.String),
}) {}
export class GetMetricConfigurationResponse extends S.Class<GetMetricConfigurationResponse>(
  "GetMetricConfigurationResponse",
)({ SummaryMetric: S.optional(SummaryMetricConfiguration) }) {}
export class GetMulticastGroupSessionResponse extends S.Class<GetMulticastGroupSessionResponse>(
  "GetMulticastGroupSessionResponse",
)({ LoRaWAN: S.optional(LoRaWANMulticastSession) }) {}
export class GetNetworkAnalyzerConfigurationResponse extends S.Class<GetNetworkAnalyzerConfigurationResponse>(
  "GetNetworkAnalyzerConfigurationResponse",
)({
  TraceContent: S.optional(TraceContent),
  WirelessDevices: S.optional(WirelessDeviceList),
  WirelessGateways: S.optional(WirelessGatewayList),
  Description: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  MulticastGroups: S.optional(NetworkAnalyzerMulticastGroupList),
}) {}
export class DeviceRegistrationStateEventConfiguration extends S.Class<DeviceRegistrationStateEventConfiguration>(
  "DeviceRegistrationStateEventConfiguration",
)({
  Sidewalk: S.optional(SidewalkEventNotificationConfigurations),
  WirelessDeviceIdEventTopic: S.optional(S.String),
}) {}
export class LoRaWANJoinEventNotificationConfigurations extends S.Class<LoRaWANJoinEventNotificationConfigurations>(
  "LoRaWANJoinEventNotificationConfigurations",
)({ DevEuiEventTopic: S.optional(S.String) }) {}
export class JoinEventConfiguration extends S.Class<JoinEventConfiguration>(
  "JoinEventConfiguration",
)({
  LoRaWAN: S.optional(LoRaWANJoinEventNotificationConfigurations),
  WirelessDeviceIdEventTopic: S.optional(S.String),
}) {}
export class LoRaWANConnectionStatusEventNotificationConfigurations extends S.Class<LoRaWANConnectionStatusEventNotificationConfigurations>(
  "LoRaWANConnectionStatusEventNotificationConfigurations",
)({ GatewayEuiEventTopic: S.optional(S.String) }) {}
export class ConnectionStatusEventConfiguration extends S.Class<ConnectionStatusEventConfiguration>(
  "ConnectionStatusEventConfiguration",
)({
  LoRaWAN: S.optional(LoRaWANConnectionStatusEventNotificationConfigurations),
  WirelessGatewayIdEventTopic: S.optional(S.String),
}) {}
export class GetResourceEventConfigurationResponse extends S.Class<GetResourceEventConfigurationResponse>(
  "GetResourceEventConfigurationResponse",
)({
  DeviceRegistrationState: S.optional(
    DeviceRegistrationStateEventConfiguration,
  ),
  Proximity: S.optional(ProximityEventConfiguration),
  Join: S.optional(JoinEventConfiguration),
  ConnectionStatus: S.optional(ConnectionStatusEventConfiguration),
  MessageDeliveryStatus: S.optional(MessageDeliveryStatusEventConfiguration),
}) {}
export class GetResourceLogLevelResponse extends S.Class<GetResourceLogLevelResponse>(
  "GetResourceLogLevelResponse",
)({ LogLevel: S.optional(S.String) }) {}
export class GetResourcePositionResponse extends S.Class<GetResourcePositionResponse>(
  "GetResourcePositionResponse",
)({ GeoJsonPayload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class GetServiceEndpointResponse extends S.Class<GetServiceEndpointResponse>(
  "GetServiceEndpointResponse",
)({
  ServiceType: S.optional(S.String),
  ServiceEndpoint: S.optional(S.String),
  ServerTrust: S.optional(S.String),
}) {}
export class Beaconing extends S.Class<Beaconing>("Beaconing")({
  DataRate: S.optional(S.Number),
  Frequencies: S.optional(BeaconingFrequencies),
}) {}
export class LoRaWANGateway extends S.Class<LoRaWANGateway>("LoRaWANGateway")({
  GatewayEui: S.optional(S.String),
  RfRegion: S.optional(S.String),
  JoinEuiFilters: S.optional(JoinEuiFilters),
  NetIdFilters: S.optional(NetIdFilters),
  SubBands: S.optional(SubBands),
  Beaconing: S.optional(Beaconing),
  MaxEirp: S.optional(S.Number),
}) {}
export class GetWirelessGatewayResponse extends S.Class<GetWirelessGatewayResponse>(
  "GetWirelessGatewayResponse",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANGateway),
  Arn: S.optional(S.String),
  ThingName: S.optional(S.String),
  ThingArn: S.optional(S.String),
}) {}
export class GetWirelessGatewayCertificateResponse extends S.Class<GetWirelessGatewayCertificateResponse>(
  "GetWirelessGatewayCertificateResponse",
)({
  IotCertificateId: S.optional(S.String),
  LoRaWANNetworkServerCertificateId: S.optional(S.String),
}) {}
export class GetWirelessGatewayStatisticsResponse extends S.Class<GetWirelessGatewayStatisticsResponse>(
  "GetWirelessGatewayStatisticsResponse",
)({
  WirelessGatewayId: S.optional(S.String),
  LastUplinkReceivedAt: S.optional(S.String),
  ConnectionStatus: S.optional(S.String),
}) {}
export class GetWirelessGatewayTaskResponse extends S.Class<GetWirelessGatewayTaskResponse>(
  "GetWirelessGatewayTaskResponse",
)({
  WirelessGatewayId: S.optional(S.String),
  WirelessGatewayTaskDefinitionId: S.optional(S.String),
  LastUplinkReceivedAt: S.optional(S.String),
  TaskCreatedAt: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class LoRaWANGatewayVersion extends S.Class<LoRaWANGatewayVersion>(
  "LoRaWANGatewayVersion",
)({
  PackageVersion: S.optional(S.String),
  Model: S.optional(S.String),
  Station: S.optional(S.String),
}) {}
export class LoRaWANUpdateGatewayTaskCreate extends S.Class<LoRaWANUpdateGatewayTaskCreate>(
  "LoRaWANUpdateGatewayTaskCreate",
)({
  UpdateSignature: S.optional(S.String),
  SigKeyCrc: S.optional(S.Number),
  CurrentVersion: S.optional(LoRaWANGatewayVersion),
  UpdateVersion: S.optional(LoRaWANGatewayVersion),
}) {}
export class UpdateWirelessGatewayTaskCreate extends S.Class<UpdateWirelessGatewayTaskCreate>(
  "UpdateWirelessGatewayTaskCreate",
)({
  UpdateDataSource: S.optional(S.String),
  UpdateDataRole: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANUpdateGatewayTaskCreate),
}) {}
export class GetWirelessGatewayTaskDefinitionResponse extends S.Class<GetWirelessGatewayTaskDefinitionResponse>(
  "GetWirelessGatewayTaskDefinitionResponse",
)({
  AutoCreateTasks: S.optional(S.Boolean),
  Name: S.optional(S.String),
  Update: S.optional(UpdateWirelessGatewayTaskCreate),
  Arn: S.optional(S.String),
}) {}
export class ListPartnerAccountsResponse extends S.Class<ListPartnerAccountsResponse>(
  "ListPartnerAccountsResponse",
)({
  NextToken: S.optional(S.String),
  Sidewalk: S.optional(SidewalkAccountList),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class StartFuotaTaskRequest extends S.Class<StartFuotaTaskRequest>(
  "StartFuotaTaskRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    LoRaWAN: S.optional(LoRaWANStartFuotaTask),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/fuota-tasks/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartFuotaTaskResponse extends S.Class<StartFuotaTaskResponse>(
  "StartFuotaTaskResponse",
)({}) {}
export class StartMulticastGroupSessionRequest extends S.Class<StartMulticastGroupSessionRequest>(
  "StartMulticastGroupSessionRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()), LoRaWAN: LoRaWANMulticastSession },
  T.all(
    T.Http({ method: "PUT", uri: "/multicast-groups/{Id}/session" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMulticastGroupSessionResponse extends S.Class<StartMulticastGroupSessionResponse>(
  "StartMulticastGroupSessionResponse",
)({}) {}
export class StartSingleWirelessDeviceImportTaskRequest extends S.Class<StartSingleWirelessDeviceImportTaskRequest>(
  "StartSingleWirelessDeviceImportTaskRequest",
)(
  {
    DestinationName: S.String,
    ClientRequestToken: S.optional(S.String),
    DeviceName: S.optional(S.String),
    Tags: S.optional(TagList),
    Positioning: S.optional(S.String),
    Sidewalk: SidewalkSingleStartImportInfo,
  },
  T.all(
    T.Http({ method: "POST", uri: "/wireless_single_device_import_task" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartWirelessDeviceImportTaskRequest extends S.Class<StartWirelessDeviceImportTaskRequest>(
  "StartWirelessDeviceImportTaskRequest",
)(
  {
    DestinationName: S.String,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
    Positioning: S.optional(S.String),
    Sidewalk: SidewalkStartImportInfo,
  },
  T.all(
    T.Http({ method: "POST", uri: "/wireless_device_import_task" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TestWirelessDeviceResponse extends S.Class<TestWirelessDeviceResponse>(
  "TestWirelessDeviceResponse",
)({ Result: S.optional(S.String) }) {}
export class UpdatePartnerAccountRequest extends S.Class<UpdatePartnerAccountRequest>(
  "UpdatePartnerAccountRequest",
)(
  {
    Sidewalk: SidewalkUpdateAccount,
    PartnerAccountId: S.String.pipe(T.HttpLabel()),
    PartnerType: S.String.pipe(T.HttpQuery("partnerType")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/partner-accounts/{PartnerAccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePartnerAccountResponse extends S.Class<UpdatePartnerAccountResponse>(
  "UpdatePartnerAccountResponse",
)({}) {}
export class UpdateWirelessDeviceImportTaskRequest extends S.Class<UpdateWirelessDeviceImportTaskRequest>(
  "UpdateWirelessDeviceImportTaskRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()), Sidewalk: SidewalkUpdateImportInfo },
  T.all(
    T.Http({ method: "PATCH", uri: "/wireless_device_import_task/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWirelessDeviceImportTaskResponse extends S.Class<UpdateWirelessDeviceImportTaskResponse>(
  "UpdateWirelessDeviceImportTaskResponse",
)({}) {}
export class OtaaV1_1 extends S.Class<OtaaV1_1>("OtaaV1_1")({
  AppKey: S.optional(S.String),
  NwkKey: S.optional(S.String),
  JoinEui: S.optional(S.String),
}) {}
export class OtaaV1_0_x extends S.Class<OtaaV1_0_x>("OtaaV1_0_x")({
  AppKey: S.optional(S.String),
  AppEui: S.optional(S.String),
  JoinEui: S.optional(S.String),
  GenAppKey: S.optional(S.String),
}) {}
export class Dimension extends S.Class<Dimension>("Dimension")({
  name: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const Dimensions = S.Array(Dimension);
export class CertificateList extends S.Class<CertificateList>(
  "CertificateList",
)({ SigningAlg: S.String, Value: S.String }) {}
export const PrivateKeysList = S.Array(CertificateList);
export const DeviceCreationFileList = S.Array(S.String);
export class SemtechGnssConfiguration extends S.Class<SemtechGnssConfiguration>(
  "SemtechGnssConfiguration",
)({ Status: S.String, Fec: S.String }) {}
export class LoRaWANMulticastMetadata extends S.Class<LoRaWANMulticastMetadata>(
  "LoRaWANMulticastMetadata",
)({ FPort: S.optional(S.Number) }) {}
export class SidewalkSendDataToDevice extends S.Class<SidewalkSendDataToDevice>(
  "SidewalkSendDataToDevice",
)({
  Seq: S.optional(S.Number),
  MessageType: S.optional(S.String),
  AckModeRetryDurationSecs: S.optional(S.Number),
}) {}
export class UpdateAbpV1_1 extends S.Class<UpdateAbpV1_1>("UpdateAbpV1_1")({
  FCntStart: S.optional(S.Number),
}) {}
export class UpdateAbpV1_0_x extends S.Class<UpdateAbpV1_0_x>(
  "UpdateAbpV1_0_x",
)({ FCntStart: S.optional(S.Number) }) {}
export class Positioning extends S.Class<Positioning>("Positioning")({
  ClockSync: S.optional(S.Number),
  Stream: S.optional(S.Number),
  Gnss: S.optional(S.Number),
}) {}
export class ApplicationConfig extends S.Class<ApplicationConfig>(
  "ApplicationConfig",
)({
  FPort: S.optional(S.Number),
  Type: S.optional(S.String),
  DestinationName: S.optional(S.String),
}) {}
export const Applications = S.Array(ApplicationConfig);
export class UpdateFPorts extends S.Class<UpdateFPorts>("UpdateFPorts")({
  Positioning: S.optional(Positioning),
  Applications: S.optional(Applications),
}) {}
export class SidewalkCreateWirelessDevice extends S.Class<SidewalkCreateWirelessDevice>(
  "SidewalkCreateWirelessDevice",
)({
  DeviceProfileId: S.optional(S.String),
  Positioning: S.optional(SidewalkPositioning),
  SidewalkManufacturingSn: S.optional(S.String),
}) {}
export class LoRaWANFuotaTaskGetInfo extends S.Class<LoRaWANFuotaTaskGetInfo>(
  "LoRaWANFuotaTaskGetInfo",
)({
  RfRegion: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class SummaryMetricQuery extends S.Class<SummaryMetricQuery>(
  "SummaryMetricQuery",
)({
  QueryId: S.optional(S.String),
  MetricName: S.optional(S.String),
  Dimensions: S.optional(Dimensions),
  AggregationPeriod: S.optional(S.String),
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SummaryMetricQueries = S.Array(SummaryMetricQuery);
export class LoRaWANMulticastGet extends S.Class<LoRaWANMulticastGet>(
  "LoRaWANMulticastGet",
)({
  RfRegion: S.optional(S.String),
  DlClass: S.optional(S.String),
  NumberOfDevicesRequested: S.optional(S.Number),
  NumberOfDevicesInGroup: S.optional(S.Number),
  ParticipatingGateways: S.optional(ParticipatingGatewaysMulticast),
}) {}
export class Accuracy extends S.Class<Accuracy>("Accuracy")({
  HorizontalAccuracy: S.optional(S.Number),
  VerticalAccuracy: S.optional(S.Number),
}) {}
export class LoRaWANGetServiceProfileInfo extends S.Class<LoRaWANGetServiceProfileInfo>(
  "LoRaWANGetServiceProfileInfo",
)({
  UlRate: S.optional(S.Number),
  UlBucketSize: S.optional(S.Number),
  UlRatePolicy: S.optional(S.String),
  DlRate: S.optional(S.Number),
  DlBucketSize: S.optional(S.Number),
  DlRatePolicy: S.optional(S.String),
  AddGwMetadata: S.optional(S.Boolean),
  DevStatusReqFreq: S.optional(S.Number),
  ReportDevStatusBattery: S.optional(S.Boolean),
  ReportDevStatusMargin: S.optional(S.Boolean),
  DrMin: S.optional(S.Number),
  DrMax: S.optional(S.Number),
  ChannelMask: S.optional(S.String),
  PrAllowed: S.optional(S.Boolean),
  HrAllowed: S.optional(S.Boolean),
  RaAllowed: S.optional(S.Boolean),
  NwkGeoLoc: S.optional(S.Boolean),
  TargetPer: S.optional(S.Number),
  MinGwDiversity: S.optional(S.Number),
  TxPowerIndexMin: S.optional(S.Number),
  TxPowerIndexMax: S.optional(S.Number),
  NbTransMin: S.optional(S.Number),
  NbTransMax: S.optional(S.Number),
}) {}
export class SidewalkGetStartImportInfo extends S.Class<SidewalkGetStartImportInfo>(
  "SidewalkGetStartImportInfo",
)({
  DeviceCreationFileList: S.optional(DeviceCreationFileList),
  Role: S.optional(S.String),
  Positioning: S.optional(SidewalkPositioning),
}) {}
export class SidewalkDeviceMetadata extends S.Class<SidewalkDeviceMetadata>(
  "SidewalkDeviceMetadata",
)({
  Rssi: S.optional(S.Number),
  BatteryLevel: S.optional(S.String),
  Event: S.optional(S.String),
  DeviceState: S.optional(S.String),
}) {}
export class LoRaWANGatewayCurrentVersion extends S.Class<LoRaWANGatewayCurrentVersion>(
  "LoRaWANGatewayCurrentVersion",
)({ CurrentVersion: S.optional(LoRaWANGatewayVersion) }) {}
export class Destinations extends S.Class<Destinations>("Destinations")({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  ExpressionType: S.optional(S.String),
  Expression: S.optional(S.String),
  Description: S.optional(S.String),
  RoleArn: S.optional(S.String),
}) {}
export const DestinationList = S.Array(Destinations);
export class DeviceProfile extends S.Class<DeviceProfile>("DeviceProfile")({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Id: S.optional(S.String),
}) {}
export const DeviceProfileList = S.Array(DeviceProfile);
export class SidewalkListDevicesForImportInfo extends S.Class<SidewalkListDevicesForImportInfo>(
  "SidewalkListDevicesForImportInfo",
)({ Positioning: S.optional(SidewalkPositioning) }) {}
export class FuotaTask extends S.Class<FuotaTask>("FuotaTask")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const FuotaTaskList = S.Array(FuotaTask);
export class MulticastGroup extends S.Class<MulticastGroup>("MulticastGroup")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const MulticastGroupList = S.Array(MulticastGroup);
export class MulticastGroupByFuotaTask extends S.Class<MulticastGroupByFuotaTask>(
  "MulticastGroupByFuotaTask",
)({ Id: S.optional(S.String) }) {}
export const MulticastGroupListByFuotaTask = S.Array(MulticastGroupByFuotaTask);
export class NetworkAnalyzerConfigurations extends S.Class<NetworkAnalyzerConfigurations>(
  "NetworkAnalyzerConfigurations",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }) {}
export const NetworkAnalyzerConfigurationList = S.Array(
  NetworkAnalyzerConfigurations,
);
export class SemtechGnssDetail extends S.Class<SemtechGnssDetail>(
  "SemtechGnssDetail",
)({
  Provider: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  Fec: S.optional(S.String),
}) {}
export class PositionSolverDetails extends S.Class<PositionSolverDetails>(
  "PositionSolverDetails",
)({ SemtechGnss: S.optional(SemtechGnssDetail) }) {}
export class PositionConfigurationItem extends S.Class<PositionConfigurationItem>(
  "PositionConfigurationItem",
)({
  ResourceIdentifier: S.optional(S.String),
  ResourceType: S.optional(S.String),
  Solvers: S.optional(PositionSolverDetails),
  Destination: S.optional(S.String),
}) {}
export const PositionConfigurationList = S.Array(PositionConfigurationItem);
export class GatewayListItem extends S.Class<GatewayListItem>(
  "GatewayListItem",
)({ GatewayId: S.String, DownlinkFrequency: S.Number }) {}
export const GatewayList = S.Array(GatewayListItem);
export class ParticipatingGateways extends S.Class<ParticipatingGateways>(
  "ParticipatingGateways",
)({
  DownlinkMode: S.String,
  GatewayList: GatewayList,
  TransmissionInterval: S.Number,
}) {}
export class LoRaWANSendDataToDevice extends S.Class<LoRaWANSendDataToDevice>(
  "LoRaWANSendDataToDevice",
)({
  FPort: S.optional(S.Number),
  ParticipatingGateways: S.optional(ParticipatingGateways),
}) {}
export class DownlinkQueueMessage extends S.Class<DownlinkQueueMessage>(
  "DownlinkQueueMessage",
)({
  MessageId: S.optional(S.String),
  TransmitMode: S.optional(S.Number),
  ReceivedAt: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANSendDataToDevice),
}) {}
export const DownlinkQueueMessagesList = S.Array(DownlinkQueueMessage);
export class ServiceProfile extends S.Class<ServiceProfile>("ServiceProfile")({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Id: S.optional(S.String),
}) {}
export const ServiceProfileList = S.Array(ServiceProfile);
export class WirelessDeviceImportTask extends S.Class<WirelessDeviceImportTask>(
  "WirelessDeviceImportTask",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  DestinationName: S.optional(S.String),
  Positioning: S.optional(S.String),
  Sidewalk: S.optional(SidewalkGetStartImportInfo),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  InitializedImportedDeviceCount: S.optional(S.Number),
  PendingImportedDeviceCount: S.optional(S.Number),
  OnboardedImportedDeviceCount: S.optional(S.Number),
  FailedImportedDeviceCount: S.optional(S.Number),
}) {}
export const WirelessDeviceImportTaskList = S.Array(WirelessDeviceImportTask);
export class WirelessGatewayStatistics extends S.Class<WirelessGatewayStatistics>(
  "WirelessGatewayStatistics",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANGateway),
  LastUplinkReceivedAt: S.optional(S.String),
}) {}
export const WirelessGatewayStatisticsList = S.Array(WirelessGatewayStatistics);
export class PositionSolverConfigurations extends S.Class<PositionSolverConfigurations>(
  "PositionSolverConfigurations",
)({ SemtechGnss: S.optional(SemtechGnssConfiguration) }) {}
export class MulticastWirelessMetadata extends S.Class<MulticastWirelessMetadata>(
  "MulticastWirelessMetadata",
)({ LoRaWAN: S.optional(LoRaWANMulticastMetadata) }) {}
export class LoRaWANUpdateDevice extends S.Class<LoRaWANUpdateDevice>(
  "LoRaWANUpdateDevice",
)({
  DeviceProfileId: S.optional(S.String),
  ServiceProfileId: S.optional(S.String),
  AbpV1_1: S.optional(UpdateAbpV1_1),
  AbpV1_0_x: S.optional(UpdateAbpV1_0_x),
  FPorts: S.optional(UpdateFPorts),
}) {}
export class SessionKeysAbpV1_1 extends S.Class<SessionKeysAbpV1_1>(
  "SessionKeysAbpV1_1",
)({
  FNwkSIntKey: S.optional(S.String),
  SNwkSIntKey: S.optional(S.String),
  NwkSEncKey: S.optional(S.String),
  AppSKey: S.optional(S.String),
}) {}
export class SessionKeysAbpV1_0_x extends S.Class<SessionKeysAbpV1_0_x>(
  "SessionKeysAbpV1_0_x",
)({ NwkSKey: S.optional(S.String), AppSKey: S.optional(S.String) }) {}
export class GsmLocalId extends S.Class<GsmLocalId>("GsmLocalId")({
  Bsic: S.Number,
  Bcch: S.Number,
}) {}
export class WcdmaLocalId extends S.Class<WcdmaLocalId>("WcdmaLocalId")({
  Uarfcndl: S.Number,
  Psc: S.Number,
}) {}
export class WcdmaNmrObj extends S.Class<WcdmaNmrObj>("WcdmaNmrObj")({
  Uarfcndl: S.Number,
  Psc: S.Number,
  UtranCid: S.Number,
  Rscp: S.optional(S.Number),
  PathLoss: S.optional(S.Number),
}) {}
export const WcdmaNmrList = S.Array(WcdmaNmrObj);
export class TdscdmaLocalId extends S.Class<TdscdmaLocalId>("TdscdmaLocalId")({
  Uarfcn: S.Number,
  CellParams: S.Number,
}) {}
export class TdscdmaNmrObj extends S.Class<TdscdmaNmrObj>("TdscdmaNmrObj")({
  Uarfcn: S.Number,
  CellParams: S.Number,
  UtranCid: S.optional(S.Number),
  Rscp: S.optional(S.Number),
  PathLoss: S.optional(S.Number),
}) {}
export const TdscdmaNmrList = S.Array(TdscdmaNmrObj);
export class LteLocalId extends S.Class<LteLocalId>("LteLocalId")({
  Pci: S.Number,
  Earfcn: S.Number,
}) {}
export class LteNmrObj extends S.Class<LteNmrObj>("LteNmrObj")({
  Pci: S.Number,
  Earfcn: S.Number,
  EutranCid: S.optional(S.Number),
  Rsrp: S.optional(S.Number),
  Rsrq: S.optional(S.Number),
}) {}
export const LteNmrList = S.Array(LteNmrObj);
export class CdmaLocalId extends S.Class<CdmaLocalId>("CdmaLocalId")({
  PnOffset: S.Number,
  CdmaChannel: S.Number,
}) {}
export class CdmaNmrObj extends S.Class<CdmaNmrObj>("CdmaNmrObj")({
  PnOffset: S.Number,
  CdmaChannel: S.Number,
  PilotPower: S.optional(S.Number),
  BaseStationId: S.optional(S.Number),
}) {}
export const CdmaNmrList = S.Array(CdmaNmrObj);
export class AssociateAwsAccountWithPartnerAccountResponse extends S.Class<AssociateAwsAccountWithPartnerAccountResponse>(
  "AssociateAwsAccountWithPartnerAccountResponse",
)({ Sidewalk: S.optional(SidewalkAccountInfo), Arn: S.optional(S.String) }) {}
export class CreateDeviceProfileResponse extends S.Class<CreateDeviceProfileResponse>(
  "CreateDeviceProfileResponse",
)({ Arn: S.optional(S.String), Id: S.optional(S.String) }) {}
export class CreateFuotaTaskResponse extends S.Class<CreateFuotaTaskResponse>(
  "CreateFuotaTaskResponse",
)({ Arn: S.optional(S.String), Id: S.optional(S.String) }) {}
export class CreateMulticastGroupRequest extends S.Class<CreateMulticastGroupRequest>(
  "CreateMulticastGroupRequest",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    LoRaWAN: LoRaWANMulticast,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/multicast-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNetworkAnalyzerConfigurationResponse extends S.Class<CreateNetworkAnalyzerConfigurationResponse>(
  "CreateNetworkAnalyzerConfigurationResponse",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }) {}
export class CreateServiceProfileResponse extends S.Class<CreateServiceProfileResponse>(
  "CreateServiceProfileResponse",
)({ Arn: S.optional(S.String), Id: S.optional(S.String) }) {}
export class CreateWirelessGatewayRequest extends S.Class<CreateWirelessGatewayRequest>(
  "CreateWirelessGatewayRequest",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: LoRaWANGateway,
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/wireless-gateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEventConfigurationByResourceTypesResponse extends S.Class<GetEventConfigurationByResourceTypesResponse>(
  "GetEventConfigurationByResourceTypesResponse",
)({
  DeviceRegistrationState: S.optional(
    DeviceRegistrationStateResourceTypeEventConfiguration,
  ),
  Proximity: S.optional(ProximityResourceTypeEventConfiguration),
  Join: S.optional(JoinResourceTypeEventConfiguration),
  ConnectionStatus: S.optional(ConnectionStatusResourceTypeEventConfiguration),
  MessageDeliveryStatus: S.optional(
    MessageDeliveryStatusResourceTypeEventConfiguration,
  ),
}) {}
export class GetFuotaTaskResponse extends S.Class<GetFuotaTaskResponse>(
  "GetFuotaTaskResponse",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Status: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANFuotaTaskGetInfo),
  FirmwareUpdateImage: S.optional(S.String),
  FirmwareUpdateRole: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RedundancyPercent: S.optional(S.Number),
  FragmentSizeBytes: S.optional(S.Number),
  FragmentIntervalMS: S.optional(S.Number),
  Descriptor: S.optional(S.String),
}) {}
export class GetLogLevelsByResourceTypesResponse extends S.Class<GetLogLevelsByResourceTypesResponse>(
  "GetLogLevelsByResourceTypesResponse",
)({
  DefaultLogLevel: S.optional(S.String),
  WirelessGatewayLogOptions: S.optional(WirelessGatewayLogOptionList),
  WirelessDeviceLogOptions: S.optional(WirelessDeviceLogOptionList),
  FuotaTaskLogOptions: S.optional(FuotaTaskLogOptionList),
}) {}
export class GetMetricsRequest extends S.Class<GetMetricsRequest>(
  "GetMetricsRequest",
)(
  { SummaryMetricQueries: S.optional(SummaryMetricQueries) },
  T.all(
    T.Http({ method: "POST", uri: "/metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMulticastGroupResponse extends S.Class<GetMulticastGroupResponse>(
  "GetMulticastGroupResponse",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANMulticastGet),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetPartnerAccountResponse extends S.Class<GetPartnerAccountResponse>(
  "GetPartnerAccountResponse",
)({
  Sidewalk: S.optional(SidewalkAccountInfoWithFingerprint),
  AccountLinked: S.optional(S.Boolean),
}) {}
export class GetPositionResponse extends S.Class<GetPositionResponse>(
  "GetPositionResponse",
)({
  Position: S.optional(PositionCoordinate),
  Accuracy: S.optional(Accuracy),
  SolverType: S.optional(S.String),
  SolverProvider: S.optional(S.String),
  SolverVersion: S.optional(S.String),
  Timestamp: S.optional(S.String),
}) {}
export class GetServiceProfileResponse extends S.Class<GetServiceProfileResponse>(
  "GetServiceProfileResponse",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANGetServiceProfileInfo),
}) {}
export class GetWirelessDeviceImportTaskResponse extends S.Class<GetWirelessDeviceImportTaskResponse>(
  "GetWirelessDeviceImportTaskResponse",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  DestinationName: S.optional(S.String),
  Positioning: S.optional(S.String),
  Sidewalk: S.optional(SidewalkGetStartImportInfo),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  InitializedImportedDeviceCount: S.optional(S.Number),
  PendingImportedDeviceCount: S.optional(S.Number),
  OnboardedImportedDeviceCount: S.optional(S.Number),
  FailedImportedDeviceCount: S.optional(S.Number),
}) {}
export class GetWirelessGatewayFirmwareInformationResponse extends S.Class<GetWirelessGatewayFirmwareInformationResponse>(
  "GetWirelessGatewayFirmwareInformationResponse",
)({ LoRaWAN: S.optional(LoRaWANGatewayCurrentVersion) }) {}
export class ListDestinationsResponse extends S.Class<ListDestinationsResponse>(
  "ListDestinationsResponse",
)({
  NextToken: S.optional(S.String),
  DestinationList: S.optional(DestinationList),
}) {}
export class ListDeviceProfilesResponse extends S.Class<ListDeviceProfilesResponse>(
  "ListDeviceProfilesResponse",
)({
  NextToken: S.optional(S.String),
  DeviceProfileList: S.optional(DeviceProfileList),
}) {}
export class ListFuotaTasksResponse extends S.Class<ListFuotaTasksResponse>(
  "ListFuotaTasksResponse",
)({
  NextToken: S.optional(S.String),
  FuotaTaskList: S.optional(FuotaTaskList),
}) {}
export class ListMulticastGroupsResponse extends S.Class<ListMulticastGroupsResponse>(
  "ListMulticastGroupsResponse",
)({
  NextToken: S.optional(S.String),
  MulticastGroupList: S.optional(MulticastGroupList),
}) {}
export class ListMulticastGroupsByFuotaTaskResponse extends S.Class<ListMulticastGroupsByFuotaTaskResponse>(
  "ListMulticastGroupsByFuotaTaskResponse",
)({
  NextToken: S.optional(S.String),
  MulticastGroupList: S.optional(MulticastGroupListByFuotaTask),
}) {}
export class ListNetworkAnalyzerConfigurationsResponse extends S.Class<ListNetworkAnalyzerConfigurationsResponse>(
  "ListNetworkAnalyzerConfigurationsResponse",
)({
  NextToken: S.optional(S.String),
  NetworkAnalyzerConfigurationList: S.optional(
    NetworkAnalyzerConfigurationList,
  ),
}) {}
export class ListPositionConfigurationsResponse extends S.Class<ListPositionConfigurationsResponse>(
  "ListPositionConfigurationsResponse",
)({
  PositionConfigurationList: S.optional(PositionConfigurationList),
  NextToken: S.optional(S.String),
}) {}
export class ListQueuedMessagesResponse extends S.Class<ListQueuedMessagesResponse>(
  "ListQueuedMessagesResponse",
)({
  NextToken: S.optional(S.String),
  DownlinkQueueMessagesList: S.optional(DownlinkQueueMessagesList),
}) {}
export class ListServiceProfilesResponse extends S.Class<ListServiceProfilesResponse>(
  "ListServiceProfilesResponse",
)({
  NextToken: S.optional(S.String),
  ServiceProfileList: S.optional(ServiceProfileList),
}) {}
export class ListWirelessDeviceImportTasksResponse extends S.Class<ListWirelessDeviceImportTasksResponse>(
  "ListWirelessDeviceImportTasksResponse",
)({
  NextToken: S.optional(S.String),
  WirelessDeviceImportTaskList: S.optional(WirelessDeviceImportTaskList),
}) {}
export class ListWirelessGatewaysResponse extends S.Class<ListWirelessGatewaysResponse>(
  "ListWirelessGatewaysResponse",
)({
  NextToken: S.optional(S.String),
  WirelessGatewayList: S.optional(WirelessGatewayStatisticsList),
}) {}
export class PutPositionConfigurationRequest extends S.Class<PutPositionConfigurationRequest>(
  "PutPositionConfigurationRequest",
)(
  {
    ResourceIdentifier: S.String.pipe(T.HttpLabel()),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
    Solvers: S.optional(PositionSolverConfigurations),
    Destination: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/position-configurations/{ResourceIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutPositionConfigurationResponse extends S.Class<PutPositionConfigurationResponse>(
  "PutPositionConfigurationResponse",
)({}) {}
export class SendDataToMulticastGroupRequest extends S.Class<SendDataToMulticastGroupRequest>(
  "SendDataToMulticastGroupRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    PayloadData: S.String,
    WirelessMetadata: MulticastWirelessMetadata,
  },
  T.all(
    T.Http({ method: "POST", uri: "/multicast-groups/{Id}/data" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartSingleWirelessDeviceImportTaskResponse extends S.Class<StartSingleWirelessDeviceImportTaskResponse>(
  "StartSingleWirelessDeviceImportTaskResponse",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class StartWirelessDeviceImportTaskResponse extends S.Class<StartWirelessDeviceImportTaskResponse>(
  "StartWirelessDeviceImportTaskResponse",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class UpdateResourceEventConfigurationRequest extends S.Class<UpdateResourceEventConfigurationRequest>(
  "UpdateResourceEventConfigurationRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    IdentifierType: S.String.pipe(T.HttpQuery("identifierType")),
    PartnerType: S.optional(S.String).pipe(T.HttpQuery("partnerType")),
    DeviceRegistrationState: S.optional(
      DeviceRegistrationStateEventConfiguration,
    ),
    Proximity: S.optional(ProximityEventConfiguration),
    Join: S.optional(JoinEventConfiguration),
    ConnectionStatus: S.optional(ConnectionStatusEventConfiguration),
    MessageDeliveryStatus: S.optional(MessageDeliveryStatusEventConfiguration),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/event-configurations/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResourceEventConfigurationResponse extends S.Class<UpdateResourceEventConfigurationResponse>(
  "UpdateResourceEventConfigurationResponse",
)({}) {}
export class UpdateWirelessDeviceRequest extends S.Class<UpdateWirelessDeviceRequest>(
  "UpdateWirelessDeviceRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    DestinationName: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANUpdateDevice),
    Positioning: S.optional(S.String),
    Sidewalk: S.optional(SidewalkUpdateWirelessDevice),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/wireless-devices/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWirelessDeviceResponse extends S.Class<UpdateWirelessDeviceResponse>(
  "UpdateWirelessDeviceResponse",
)({}) {}
export class AbpV1_1 extends S.Class<AbpV1_1>("AbpV1_1")({
  DevAddr: S.optional(S.String),
  SessionKeys: S.optional(SessionKeysAbpV1_1),
  FCntStart: S.optional(S.Number),
}) {}
export class AbpV1_0_x extends S.Class<AbpV1_0_x>("AbpV1_0_x")({
  DevAddr: S.optional(S.String),
  SessionKeys: S.optional(SessionKeysAbpV1_0_x),
  FCntStart: S.optional(S.Number),
}) {}
export class FPorts extends S.Class<FPorts>("FPorts")({
  Fuota: S.optional(S.Number),
  Multicast: S.optional(S.Number),
  ClockSync: S.optional(S.Number),
  Positioning: S.optional(Positioning),
  Applications: S.optional(Applications),
}) {}
export class DakCertificateMetadata extends S.Class<DakCertificateMetadata>(
  "DakCertificateMetadata",
)({
  CertificateId: S.String,
  MaxAllowedSignature: S.optional(S.Number),
  FactorySupport: S.optional(S.Boolean),
  ApId: S.optional(S.String),
  DeviceTypeId: S.optional(S.String),
}) {}
export const DakCertificateMetadataList = S.Array(DakCertificateMetadata);
export class WcdmaObj extends S.Class<WcdmaObj>("WcdmaObj")({
  Mcc: S.Number,
  Mnc: S.Number,
  Lac: S.optional(S.Number),
  UtranCid: S.Number,
  WcdmaLocalId: S.optional(WcdmaLocalId),
  Rscp: S.optional(S.Number),
  PathLoss: S.optional(S.Number),
  WcdmaNmr: S.optional(WcdmaNmrList),
}) {}
export const WcdmaList = S.Array(WcdmaObj);
export class TdscdmaObj extends S.Class<TdscdmaObj>("TdscdmaObj")({
  Mcc: S.Number,
  Mnc: S.Number,
  Lac: S.optional(S.Number),
  UtranCid: S.Number,
  TdscdmaLocalId: S.optional(TdscdmaLocalId),
  TdscdmaTimingAdvance: S.optional(S.Number),
  Rscp: S.optional(S.Number),
  PathLoss: S.optional(S.Number),
  TdscdmaNmr: S.optional(TdscdmaNmrList),
}) {}
export const TdscdmaList = S.Array(TdscdmaObj);
export class LteObj extends S.Class<LteObj>("LteObj")({
  Mcc: S.Number,
  Mnc: S.Number,
  EutranCid: S.Number,
  Tac: S.optional(S.Number),
  LteLocalId: S.optional(LteLocalId),
  LteTimingAdvance: S.optional(S.Number),
  Rsrp: S.optional(S.Number),
  Rsrq: S.optional(S.Number),
  NrCapable: S.optional(S.Boolean),
  LteNmr: S.optional(LteNmrList),
}) {}
export const LteList = S.Array(LteObj);
export class CdmaObj extends S.Class<CdmaObj>("CdmaObj")({
  SystemId: S.Number,
  NetworkId: S.Number,
  BaseStationId: S.Number,
  RegistrationZone: S.optional(S.Number),
  CdmaLocalId: S.optional(CdmaLocalId),
  PilotPower: S.optional(S.Number),
  BaseLat: S.optional(S.Number),
  BaseLng: S.optional(S.Number),
  CdmaNmr: S.optional(CdmaNmrList),
}) {}
export const CdmaList = S.Array(CdmaObj);
export const DeviceCertificateList = S.Array(CertificateList);
export class LoRaWANGatewayMetadata extends S.Class<LoRaWANGatewayMetadata>(
  "LoRaWANGatewayMetadata",
)({
  GatewayEui: S.optional(S.String),
  Snr: S.optional(S.Number),
  Rssi: S.optional(S.Number),
}) {}
export const LoRaWANGatewayMetadataList = S.Array(LoRaWANGatewayMetadata);
export class LoRaWANPublicGatewayMetadata extends S.Class<LoRaWANPublicGatewayMetadata>(
  "LoRaWANPublicGatewayMetadata",
)({
  ProviderNetId: S.optional(S.String),
  Id: S.optional(S.String),
  Rssi: S.optional(S.Number),
  Snr: S.optional(S.Number),
  RfRegion: S.optional(S.String),
  DlAllowed: S.optional(S.Boolean),
}) {}
export const LoRaWANPublicGatewayMetadataList = S.Array(
  LoRaWANPublicGatewayMetadata,
);
export class ImportedSidewalkDevice extends S.Class<ImportedSidewalkDevice>(
  "ImportedSidewalkDevice",
)({
  SidewalkManufacturingSn: S.optional(S.String),
  OnboardingStatus: S.optional(S.String),
  OnboardingStatusReason: S.optional(S.String),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class EventNotificationItemConfigurations extends S.Class<EventNotificationItemConfigurations>(
  "EventNotificationItemConfigurations",
)({
  DeviceRegistrationState: S.optional(
    DeviceRegistrationStateEventConfiguration,
  ),
  Proximity: S.optional(ProximityEventConfiguration),
  Join: S.optional(JoinEventConfiguration),
  ConnectionStatus: S.optional(ConnectionStatusEventConfiguration),
  MessageDeliveryStatus: S.optional(MessageDeliveryStatusEventConfiguration),
}) {}
export class LoRaWANListDevice extends S.Class<LoRaWANListDevice>(
  "LoRaWANListDevice",
)({ DevEui: S.optional(S.String) }) {}
export class SidewalkListDevice extends S.Class<SidewalkListDevice>(
  "SidewalkListDevice",
)({
  AmazonId: S.optional(S.String),
  SidewalkId: S.optional(S.String),
  SidewalkManufacturingSn: S.optional(S.String),
  DeviceCertificates: S.optional(DeviceCertificateList),
  DeviceProfileId: S.optional(S.String),
  Status: S.optional(S.String),
  Positioning: S.optional(SidewalkPositioning),
}) {}
export class LoRaWANUpdateGatewayTaskEntry extends S.Class<LoRaWANUpdateGatewayTaskEntry>(
  "LoRaWANUpdateGatewayTaskEntry",
)({
  CurrentVersion: S.optional(LoRaWANGatewayVersion),
  UpdateVersion: S.optional(LoRaWANGatewayVersion),
}) {}
export class GlobalIdentity extends S.Class<GlobalIdentity>("GlobalIdentity")({
  Lac: S.Number,
  GeranCid: S.Number,
}) {}
export class LoRaWANDevice extends S.Class<LoRaWANDevice>("LoRaWANDevice")({
  DevEui: S.optional(S.String),
  DeviceProfileId: S.optional(S.String),
  ServiceProfileId: S.optional(S.String),
  OtaaV1_1: S.optional(OtaaV1_1),
  OtaaV1_0_x: S.optional(OtaaV1_0_x),
  AbpV1_1: S.optional(AbpV1_1),
  AbpV1_0_x: S.optional(AbpV1_0_x),
  FPorts: S.optional(FPorts),
}) {}
export class SidewalkGetDeviceProfile extends S.Class<SidewalkGetDeviceProfile>(
  "SidewalkGetDeviceProfile",
)({
  ApplicationServerPublicKey: S.optional(S.String),
  QualificationStatus: S.optional(S.Boolean),
  DakCertificateMetadata: S.optional(DakCertificateMetadataList),
}) {}
export class SidewalkDevice extends S.Class<SidewalkDevice>("SidewalkDevice")({
  AmazonId: S.optional(S.String),
  SidewalkId: S.optional(S.String),
  SidewalkManufacturingSn: S.optional(S.String),
  DeviceCertificates: S.optional(DeviceCertificateList),
  PrivateKeys: S.optional(PrivateKeysList),
  DeviceProfileId: S.optional(S.String),
  CertificateId: S.optional(S.String),
  Status: S.optional(S.String),
  Positioning: S.optional(SidewalkPositioning),
}) {}
export class LoRaWANDeviceMetadata extends S.Class<LoRaWANDeviceMetadata>(
  "LoRaWANDeviceMetadata",
)({
  DevEui: S.optional(S.String),
  FPort: S.optional(S.Number),
  DataRate: S.optional(S.Number),
  Frequency: S.optional(S.Number),
  Timestamp: S.optional(S.String),
  Gateways: S.optional(LoRaWANGatewayMetadataList),
  PublicGateways: S.optional(LoRaWANPublicGatewayMetadataList),
}) {}
export class ImportedWirelessDevice extends S.Class<ImportedWirelessDevice>(
  "ImportedWirelessDevice",
)({ Sidewalk: S.optional(ImportedSidewalkDevice) }) {}
export const ImportedWirelessDeviceList = S.Array(ImportedWirelessDevice);
export class EventConfigurationItem extends S.Class<EventConfigurationItem>(
  "EventConfigurationItem",
)({
  Identifier: S.optional(S.String),
  IdentifierType: S.optional(S.String),
  PartnerType: S.optional(S.String),
  Events: S.optional(EventNotificationItemConfigurations),
}) {}
export const EventConfigurationsList = S.Array(EventConfigurationItem);
export class WirelessDeviceStatistics extends S.Class<WirelessDeviceStatistics>(
  "WirelessDeviceStatistics",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  DestinationName: S.optional(S.String),
  LastUplinkReceivedAt: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANListDevice),
  Sidewalk: S.optional(SidewalkListDevice),
  FuotaDeviceStatus: S.optional(S.String),
  MulticastDeviceStatus: S.optional(S.String),
  McGroupId: S.optional(S.Number),
  Positioning: S.optional(S.String),
}) {}
export const WirelessDeviceStatisticsList = S.Array(WirelessDeviceStatistics);
export class UpdateWirelessGatewayTaskEntry extends S.Class<UpdateWirelessGatewayTaskEntry>(
  "UpdateWirelessGatewayTaskEntry",
)({
  Id: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANUpdateGatewayTaskEntry),
  Arn: S.optional(S.String),
}) {}
export const WirelessGatewayTaskDefinitionList = S.Array(
  UpdateWirelessGatewayTaskEntry,
);
export class GsmNmrObj extends S.Class<GsmNmrObj>("GsmNmrObj")({
  Bsic: S.Number,
  Bcch: S.Number,
  RxLevel: S.optional(S.Number),
  GlobalIdentity: S.optional(GlobalIdentity),
}) {}
export const GsmNmrList = S.Array(GsmNmrObj);
export class CreateMulticastGroupResponse extends S.Class<CreateMulticastGroupResponse>(
  "CreateMulticastGroupResponse",
)({ Arn: S.optional(S.String), Id: S.optional(S.String) }) {}
export class CreateWirelessDeviceRequest extends S.Class<CreateWirelessDeviceRequest>(
  "CreateWirelessDeviceRequest",
)(
  {
    Type: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    DestinationName: S.String,
    ClientRequestToken: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANDevice),
    Tags: S.optional(TagList),
    Positioning: S.optional(S.String),
    Sidewalk: S.optional(SidewalkCreateWirelessDevice),
  },
  T.all(
    T.Http({ method: "POST", uri: "/wireless-devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWirelessGatewayResponse extends S.Class<CreateWirelessGatewayResponse>(
  "CreateWirelessGatewayResponse",
)({ Arn: S.optional(S.String), Id: S.optional(S.String) }) {}
export class CreateWirelessGatewayTaskDefinitionRequest extends S.Class<CreateWirelessGatewayTaskDefinitionRequest>(
  "CreateWirelessGatewayTaskDefinitionRequest",
)(
  {
    AutoCreateTasks: S.Boolean,
    Name: S.optional(S.String),
    Update: S.optional(UpdateWirelessGatewayTaskCreate),
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/wireless-gateway-task-definitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeviceProfileResponse extends S.Class<GetDeviceProfileResponse>(
  "GetDeviceProfileResponse",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANDeviceProfile),
  Sidewalk: S.optional(SidewalkGetDeviceProfile),
}) {}
export class GetPositionConfigurationResponse extends S.Class<GetPositionConfigurationResponse>(
  "GetPositionConfigurationResponse",
)({
  Solvers: S.optional(PositionSolverDetails),
  Destination: S.optional(S.String),
}) {}
export class GetWirelessDeviceResponse extends S.Class<GetWirelessDeviceResponse>(
  "GetWirelessDeviceResponse",
)({
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  DestinationName: S.optional(S.String),
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  ThingName: S.optional(S.String),
  ThingArn: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANDevice),
  Sidewalk: S.optional(SidewalkDevice),
  Positioning: S.optional(S.String),
}) {}
export class GetWirelessDeviceStatisticsResponse extends S.Class<GetWirelessDeviceStatisticsResponse>(
  "GetWirelessDeviceStatisticsResponse",
)({
  WirelessDeviceId: S.optional(S.String),
  LastUplinkReceivedAt: S.optional(S.String),
  LoRaWAN: S.optional(LoRaWANDeviceMetadata),
  Sidewalk: S.optional(SidewalkDeviceMetadata),
}) {}
export class ListDevicesForWirelessDeviceImportTaskResponse extends S.Class<ListDevicesForWirelessDeviceImportTaskResponse>(
  "ListDevicesForWirelessDeviceImportTaskResponse",
)({
  NextToken: S.optional(S.String),
  DestinationName: S.optional(S.String),
  Positioning: S.optional(S.String),
  Sidewalk: S.optional(SidewalkListDevicesForImportInfo),
  ImportedWirelessDeviceList: S.optional(ImportedWirelessDeviceList),
}) {}
export class ListEventConfigurationsResponse extends S.Class<ListEventConfigurationsResponse>(
  "ListEventConfigurationsResponse",
)({
  NextToken: S.optional(S.String),
  EventConfigurationsList: S.optional(EventConfigurationsList),
}) {}
export class ListWirelessDevicesResponse extends S.Class<ListWirelessDevicesResponse>(
  "ListWirelessDevicesResponse",
)({
  NextToken: S.optional(S.String),
  WirelessDeviceList: S.optional(WirelessDeviceStatisticsList),
}) {}
export class ListWirelessGatewayTaskDefinitionsResponse extends S.Class<ListWirelessGatewayTaskDefinitionsResponse>(
  "ListWirelessGatewayTaskDefinitionsResponse",
)({
  NextToken: S.optional(S.String),
  TaskDefinitions: S.optional(WirelessGatewayTaskDefinitionList),
}) {}
export class SendDataToMulticastGroupResponse extends S.Class<SendDataToMulticastGroupResponse>(
  "SendDataToMulticastGroupResponse",
)({ MessageId: S.optional(S.String) }) {}
export const MetricQueryTimestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export class GsmObj extends S.Class<GsmObj>("GsmObj")({
  Mcc: S.Number,
  Mnc: S.Number,
  Lac: S.Number,
  GeranCid: S.Number,
  GsmLocalId: S.optional(GsmLocalId),
  GsmTimingAdvance: S.optional(S.Number),
  RxLevel: S.optional(S.Number),
  GsmNmr: S.optional(GsmNmrList),
}) {}
export const GsmList = S.Array(GsmObj);
export class CellTowers extends S.Class<CellTowers>("CellTowers")({
  Gsm: S.optional(GsmList),
  Wcdma: S.optional(WcdmaList),
  Tdscdma: S.optional(TdscdmaList),
  Lte: S.optional(LteList),
  Cdma: S.optional(CdmaList),
}) {}
export class WirelessMetadata extends S.Class<WirelessMetadata>(
  "WirelessMetadata",
)({
  LoRaWAN: S.optional(LoRaWANSendDataToDevice),
  Sidewalk: S.optional(SidewalkSendDataToDevice),
}) {}
export class CreateWirelessDeviceResponse extends S.Class<CreateWirelessDeviceResponse>(
  "CreateWirelessDeviceResponse",
)({ Arn: S.optional(S.String), Id: S.optional(S.String) }) {}
export class CreateWirelessGatewayTaskDefinitionResponse extends S.Class<CreateWirelessGatewayTaskDefinitionResponse>(
  "CreateWirelessGatewayTaskDefinitionResponse",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class GetPositionEstimateRequest extends S.Class<GetPositionEstimateRequest>(
  "GetPositionEstimateRequest",
)(
  {
    WiFiAccessPoints: S.optional(WiFiAccessPoints),
    CellTowers: S.optional(CellTowers),
    Ip: S.optional(Ip),
    Gnss: S.optional(Gnss),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(
    T.Http({ method: "POST", uri: "/position-estimate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendDataToWirelessDeviceRequest extends S.Class<SendDataToWirelessDeviceRequest>(
  "SendDataToWirelessDeviceRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    TransmitMode: S.Number,
    PayloadData: S.String,
    WirelessMetadata: S.optional(WirelessMetadata),
  },
  T.all(
    T.Http({ method: "POST", uri: "/wireless-devices/{Id}/data" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MetricQueryValue extends S.Class<MetricQueryValue>(
  "MetricQueryValue",
)({
  Min: S.optional(S.Number),
  Max: S.optional(S.Number),
  Sum: S.optional(S.Number),
  Avg: S.optional(S.Number),
  Std: S.optional(S.Number),
  P90: S.optional(S.Number),
}) {}
export const MetricQueryValues = S.Array(MetricQueryValue);
export class SummaryMetricQueryResult extends S.Class<SummaryMetricQueryResult>(
  "SummaryMetricQueryResult",
)({
  QueryId: S.optional(S.String),
  QueryStatus: S.optional(S.String),
  Error: S.optional(S.String),
  MetricName: S.optional(S.String),
  Dimensions: S.optional(Dimensions),
  AggregationPeriod: S.optional(S.String),
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Timestamps: S.optional(MetricQueryTimestamps),
  Values: S.optional(MetricQueryValues),
  Unit: S.optional(S.String),
}) {}
export const SummaryMetricQueryResults = S.Array(SummaryMetricQueryResult);
export class GetMetricsResponse extends S.Class<GetMetricsResponse>(
  "GetMetricsResponse",
)({ SummaryMetricQueryResults: S.optional(SummaryMetricQueryResults) }) {}
export class GetPositionEstimateResponse extends S.Class<GetPositionEstimateResponse>(
  "GetPositionEstimateResponse",
)({ GeoJsonPayload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class SendDataToWirelessDeviceResponse extends S.Class<SendDataToWirelessDeviceResponse>(
  "SendDataToWirelessDeviceResponse",
)({ MessageId: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}

//# Operations
/**
 * Cancels an existing multicast group session.
 */
export const cancelMulticastGroupSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelMulticastGroupSessionRequest,
    output: CancelMulticastGroupSessionResponse,
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
 * Deletes a destination.
 */
export const deleteDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDestinationRequest,
  output: DeleteDestinationResponse,
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
 * Deletes a device profile.
 */
export const deleteDeviceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeviceProfileRequest,
  output: DeleteDeviceProfileResponse,
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
 * Deletes a FUOTA task.
 */
export const deleteFuotaTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFuotaTaskRequest,
  output: DeleteFuotaTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a multicast group if it is not in use by a FUOTA task.
 */
export const deleteMulticastGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMulticastGroupRequest,
    output: DeleteMulticastGroupResponse,
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
 * Deletes a network analyzer configuration.
 */
export const deleteNetworkAnalyzerConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteNetworkAnalyzerConfigurationRequest,
    output: DeleteNetworkAnalyzerConfigurationResponse,
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
 * Remove queued messages from the downlink queue.
 */
export const deleteQueuedMessages = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteQueuedMessagesRequest,
    output: DeleteQueuedMessagesResponse,
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
 * Deletes a service profile.
 */
export const deleteServiceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteServiceProfileRequest,
    output: DeleteServiceProfileResponse,
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
 * Deletes a wireless device.
 */
export const deleteWirelessDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWirelessDeviceRequest,
    output: DeleteWirelessDeviceResponse,
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
 * Delete an import task.
 */
export const deleteWirelessDeviceImportTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteWirelessDeviceImportTaskRequest,
    output: DeleteWirelessDeviceImportTaskResponse,
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
 * Deletes a wireless gateway.
 *
 * When deleting a wireless gateway, you might run into duplication errors for the
 * following reasons.
 *
 * - If you specify a `GatewayEui` value that already exists.
 *
 * - If you used a `ClientRequestToken` with the same parameters
 * within the last 10 minutes.
 *
 * To avoid this error, make sure that you use unique identifiers and parameters for
 * each request within the specified time period.
 */
export const deleteWirelessGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWirelessGatewayRequest,
    output: DeleteWirelessGatewayResponse,
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
 * Deletes a wireless gateway task.
 */
export const deleteWirelessGatewayTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWirelessGatewayTaskRequest,
    output: DeleteWirelessGatewayTaskResponse,
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
 * Deletes a wireless gateway task definition. Deleting this task definition does not
 * affect tasks that are currently in progress.
 */
export const deleteWirelessGatewayTaskDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteWirelessGatewayTaskDefinitionRequest,
    output: DeleteWirelessGatewayTaskDefinitionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deregister a wireless device from AWS IoT Wireless.
 */
export const deregisterWirelessDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterWirelessDeviceRequest,
    output: DeregisterWirelessDeviceResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates your AWS account from a partner account. If
 * `PartnerAccountId` and `PartnerType` are `null`,
 * disassociates your AWS account from all partner accounts.
 */
export const disassociateAwsAccountFromPartnerAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateAwsAccountFromPartnerAccountRequest,
    output: DisassociateAwsAccountFromPartnerAccountResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Disassociates a multicast group from a FUOTA task.
 */
export const disassociateMulticastGroupFromFuotaTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateMulticastGroupFromFuotaTaskRequest,
    output: DisassociateMulticastGroupFromFuotaTaskResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Disassociates a wireless device from a FUOTA task.
 */
export const disassociateWirelessDeviceFromFuotaTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateWirelessDeviceFromFuotaTaskRequest,
    output: DisassociateWirelessDeviceFromFuotaTaskResponse,
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
 * Disassociates a wireless device from a multicast group.
 */
export const disassociateWirelessDeviceFromMulticastGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateWirelessDeviceFromMulticastGroupRequest,
    output: DisassociateWirelessDeviceFromMulticastGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Disassociates a wireless device from its currently associated thing.
 */
export const disassociateWirelessDeviceFromThing =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateWirelessDeviceFromThingRequest,
    output: DisassociateWirelessDeviceFromThingResponse,
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
 * Disassociates a wireless gateway from its currently associated certificate.
 */
export const disassociateWirelessGatewayFromCertificate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateWirelessGatewayFromCertificateRequest,
    output: DisassociateWirelessGatewayFromCertificateResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Disassociates a wireless gateway from its currently associated thing.
 */
export const disassociateWirelessGatewayFromThing =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateWirelessGatewayFromThingRequest,
    output: DisassociateWirelessGatewayFromThingResponse,
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
 * Sets the log-level override for a resource ID and resource type. A limit of 200 log
 * level override can be set per account.
 */
export const putResourceLogLevel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourceLogLevelRequest,
  output: PutResourceLogLevelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the log-level overrides for all resources; wireless devices, wireless
 * gateways, and FUOTA tasks.
 */
export const resetAllResourceLogLevels = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetAllResourceLogLevelsRequest,
    output: ResetAllResourceLogLevelsResponse,
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
 * Removes the log-level override, if any, for a specific resource ID and resource type.
 * It can be used for a wireless device, a wireless gateway, or a FUOTA task.
 */
export const resetResourceLogLevel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetResourceLogLevelRequest,
    output: ResetResourceLogLevelResponse,
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
 * Starts a bulk association of all qualifying wireless devices with a multicast
 * group.
 */
export const startBulkAssociateWirelessDeviceWithMulticastGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartBulkAssociateWirelessDeviceWithMulticastGroupRequest,
    output: StartBulkAssociateWirelessDeviceWithMulticastGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Starts a bulk disassociatin of all qualifying wireless devices from a multicast
 * group.
 */
export const startBulkDisassociateWirelessDeviceFromMulticastGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest,
    output: StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Removes one or more tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates properties of a destination.
 */
export const updateDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDestinationRequest,
  output: UpdateDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the event configuration based on resource types.
 */
export const updateEventConfigurationByResourceTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEventConfigurationByResourceTypesRequest,
    output: UpdateEventConfigurationByResourceTypesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates properties of a FUOTA task.
 */
export const updateFuotaTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFuotaTaskRequest,
  output: UpdateFuotaTaskResponse,
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
 * Set default log level, or log levels by resource types. This can be for wireless
 * device, wireless gateway, or FUOTA task log options, and is used to control the log
 * messages that'll be displayed in CloudWatch.
 */
export const updateLogLevelsByResourceTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateLogLevelsByResourceTypesRequest,
    output: UpdateLogLevelsByResourceTypesResponse,
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
 * Update the summary metric configuration.
 */
export const updateMetricConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMetricConfigurationRequest,
    output: UpdateMetricConfigurationResponse,
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
 * Updates properties of a multicast group session.
 */
export const updateMulticastGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMulticastGroupRequest,
    output: UpdateMulticastGroupResponse,
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
 * Update network analyzer configuration.
 */
export const updateNetworkAnalyzerConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateNetworkAnalyzerConfigurationRequest,
    output: UpdateNetworkAnalyzerConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Update the position information of a resource.
 *
 * This action is no longer supported. Calls to update the position information
 * should use the UpdateResourcePosition API operation instead.
 */
export const updatePosition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePositionRequest,
  output: UpdatePositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the position information of a given wireless device or a wireless gateway
 * resource. The position coordinates are based on the World Geodetic System
 * (WGS84).
 */
export const updateResourcePosition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateResourcePositionRequest,
    output: UpdateResourcePositionResponse,
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
 * Updates properties of a wireless gateway.
 */
export const updateWirelessGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWirelessGatewayRequest,
    output: UpdateWirelessGatewayResponse,
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
 * Associate a multicast group with a FUOTA task.
 */
export const associateMulticastGroupWithFuotaTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateMulticastGroupWithFuotaTaskRequest,
    output: AssociateMulticastGroupWithFuotaTaskResponse,
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
 * Associate a wireless device with a FUOTA task.
 */
export const associateWirelessDeviceWithFuotaTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateWirelessDeviceWithFuotaTaskRequest,
    output: AssociateWirelessDeviceWithFuotaTaskResponse,
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
 * Associates a wireless device with a multicast group.
 */
export const associateWirelessDeviceWithMulticastGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateWirelessDeviceWithMulticastGroupRequest,
    output: AssociateWirelessDeviceWithMulticastGroupResponse,
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
 * Associates a wireless device with a thing.
 */
export const associateWirelessDeviceWithThing =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateWirelessDeviceWithThingRequest,
    output: AssociateWirelessDeviceWithThingResponse,
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
 * Associates a wireless gateway with a certificate.
 */
export const associateWirelessGatewayWithCertificate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateWirelessGatewayWithCertificateRequest,
    output: AssociateWirelessGatewayWithCertificateResponse,
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
 * Associates a wireless gateway with a thing.
 */
export const associateWirelessGatewayWithThing =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateWirelessGatewayWithThingRequest,
    output: AssociateWirelessGatewayWithThingResponse,
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
 * Creates a new destination that maps a device message to an AWS IoT rule.
 */
export const createDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDestinationRequest,
  output: CreateDestinationResponse,
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
 * Creates a task for a wireless gateway.
 */
export const createWirelessGatewayTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWirelessGatewayTaskRequest,
    output: CreateWirelessGatewayTaskResponse,
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
 * Gets information about a destination.
 */
export const getDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDestinationRequest,
  output: GetDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the metric configuration status for this AWS account.
 */
export const getMetricConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMetricConfigurationRequest,
    output: GetMetricConfigurationResponse,
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
 * Gets information about a multicast group session.
 */
export const getMulticastGroupSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMulticastGroupSessionRequest,
    output: GetMulticastGroupSessionResponse,
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
 * Get network analyzer configuration.
 */
export const getNetworkAnalyzerConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetNetworkAnalyzerConfigurationRequest,
    output: GetNetworkAnalyzerConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Get the event configuration for a particular resource identifier.
 */
export const getResourceEventConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetResourceEventConfigurationRequest,
    output: GetResourceEventConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Fetches the log-level override, if any, for a given resource ID and resource
 * type..
 */
export const getResourceLogLevel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceLogLevelRequest,
  output: GetResourceLogLevelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the position information for a given wireless device or a wireless gateway
 * resource. The position information uses the World Geodetic System
 * (WGS84).
 */
export const getResourcePosition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePositionRequest,
  output: GetResourcePositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the account-specific endpoint for Configuration and Update Server (CUPS) protocol
 * or LoRaWAN Network Server (LNS) connections.
 */
export const getServiceEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceEndpointRequest,
  output: GetServiceEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a wireless gateway.
 */
export const getWirelessGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessGatewayRequest,
  output: GetWirelessGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the ID of the certificate that is currently associated with a wireless
 * gateway.
 */
export const getWirelessGatewayCertificate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetWirelessGatewayCertificateRequest,
    output: GetWirelessGatewayCertificateResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets operating information about a wireless gateway.
 */
export const getWirelessGatewayStatistics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetWirelessGatewayStatisticsRequest,
    output: GetWirelessGatewayStatisticsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets information about a wireless gateway task.
 */
export const getWirelessGatewayTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWirelessGatewayTaskRequest,
    output: GetWirelessGatewayTaskResponse,
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
 * Gets information about a wireless gateway task definition.
 */
export const getWirelessGatewayTaskDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetWirelessGatewayTaskDefinitionRequest,
    output: GetWirelessGatewayTaskDefinitionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the partner accounts associated with your AWS account.
 */
export const listPartnerAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPartnerAccountsRequest,
  output: ListPartnerAccountsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags (metadata) you have assigned to the resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a FUOTA task.
 */
export const startFuotaTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFuotaTaskRequest,
  output: StartFuotaTaskResponse,
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
 * Starts a multicast group session.
 */
export const startMulticastGroupSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMulticastGroupSessionRequest,
    output: StartMulticastGroupSessionResponse,
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
 * Adds a tag to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Simulates a provisioned device by sending an uplink data payload of
 * `Hello`.
 */
export const testWirelessDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestWirelessDeviceRequest,
  output: TestWirelessDeviceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates properties of a partner account.
 */
export const updatePartnerAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePartnerAccountRequest,
    output: UpdatePartnerAccountResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Update an import task to add more devices to the task.
 */
export const updateWirelessDeviceImportTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateWirelessDeviceImportTaskRequest,
    output: UpdateWirelessDeviceImportTaskResponse,
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
 * Associates a partner account with your AWS account.
 */
export const associateAwsAccountWithPartnerAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateAwsAccountWithPartnerAccountRequest,
    output: AssociateAwsAccountWithPartnerAccountResponse,
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
 * Creates a new device profile.
 */
export const createDeviceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeviceProfileRequest,
  output: CreateDeviceProfileResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a FUOTA task.
 */
export const createFuotaTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFuotaTaskRequest,
  output: CreateFuotaTaskResponse,
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
 * Creates a new network analyzer configuration.
 */
export const createNetworkAnalyzerConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateNetworkAnalyzerConfigurationRequest,
    output: CreateNetworkAnalyzerConfigurationResponse,
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
 * Creates a new service profile.
 */
export const createServiceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateServiceProfileRequest,
    output: CreateServiceProfileResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Get the event configuration based on resource types.
 */
export const getEventConfigurationByResourceTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEventConfigurationByResourceTypesRequest,
    output: GetEventConfigurationByResourceTypesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
    ],
  }));
/**
 * Gets information about a FUOTA task.
 */
export const getFuotaTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFuotaTaskRequest,
  output: GetFuotaTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns current default log levels or log levels by resource types. Based on the
 * resource type, log levels can be returned for wireless device, wireless gateway, or
 * FUOTA task log options.
 */
export const getLogLevelsByResourceTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLogLevelsByResourceTypesRequest,
    output: GetLogLevelsByResourceTypesResponse,
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
 * Gets information about a multicast group.
 */
export const getMulticastGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMulticastGroupRequest,
  output: GetMulticastGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a partner account. If `PartnerAccountId` and
 * `PartnerType` are `null`, returns all partner accounts.
 */
export const getPartnerAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPartnerAccountRequest,
  output: GetPartnerAccountResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the position information for a given resource.
 *
 * This action is no longer supported. Calls to retrieve the position information
 * should use the GetResourcePosition API operation instead.
 */
export const getPosition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPositionRequest,
  output: GetPositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a service profile.
 */
export const getServiceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceProfileRequest,
  output: GetServiceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get information about an import task and count of device onboarding summary
 * information for the import task.
 */
export const getWirelessDeviceImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWirelessDeviceImportTaskRequest,
    output: GetWirelessDeviceImportTaskResponse,
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
 * Gets the firmware version and other information about a wireless gateway.
 */
export const getWirelessGatewayFirmwareInformation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetWirelessGatewayFirmwareInformationRequest,
    output: GetWirelessGatewayFirmwareInformationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the destinations registered to your AWS account.
 */
export const listDestinations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDestinationsRequest,
  output: ListDestinationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the device profiles registered to your AWS account.
 */
export const listDeviceProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDeviceProfilesRequest,
  output: ListDeviceProfilesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the FUOTA tasks registered to your AWS account.
 */
export const listFuotaTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFuotaTasksRequest,
  output: ListFuotaTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the multicast groups registered to your AWS account.
 */
export const listMulticastGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMulticastGroupsRequest,
  output: ListMulticastGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all multicast groups associated with a FUOTA task.
 */
export const listMulticastGroupsByFuotaTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListMulticastGroupsByFuotaTaskRequest,
    output: ListMulticastGroupsByFuotaTaskResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the network analyzer configurations.
 */
export const listNetworkAnalyzerConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListNetworkAnalyzerConfigurationsRequest,
    output: ListNetworkAnalyzerConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * List position configurations for a given resource, such as positioning solvers.
 *
 * This action is no longer supported. Calls to retrieve position information should
 * use the GetResourcePosition API operation instead.
 */
export const listPositionConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPositionConfigurationsRequest,
    output: ListPositionConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * List queued messages in the downlink queue.
 */
export const listQueuedMessages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListQueuedMessagesRequest,
  output: ListQueuedMessagesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the service profiles registered to your AWS account.
 */
export const listServiceProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServiceProfilesRequest,
  output: ListServiceProfilesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List of import tasks and summary information of onboarding status of devices in each
 * import task.
 */
export const listWirelessDeviceImportTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListWirelessDeviceImportTasksRequest,
    output: ListWirelessDeviceImportTasksResponse,
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
 * Lists the wireless gateways registered to your AWS account.
 */
export const listWirelessGateways = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListWirelessGatewaysRequest,
    output: ListWirelessGatewaysResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Put position configuration for a given resource.
 *
 * This action is no longer supported. Calls to update the position configuration
 * should use the UpdateResourcePosition API operation instead.
 */
export const putPositionConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutPositionConfigurationRequest,
    output: PutPositionConfigurationResponse,
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
 * Start import task for a single wireless device.
 */
export const startSingleWirelessDeviceImportTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartSingleWirelessDeviceImportTaskRequest,
    output: StartSingleWirelessDeviceImportTaskResponse,
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
 * Start import task for provisioning Sidewalk devices in bulk using an S3 CSV
 * file.
 */
export const startWirelessDeviceImportTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartWirelessDeviceImportTaskRequest,
    output: StartWirelessDeviceImportTaskResponse,
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
 * Update the event configuration for a particular resource identifier.
 */
export const updateResourceEventConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateResourceEventConfigurationRequest,
    output: UpdateResourceEventConfigurationResponse,
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
 * Updates properties of a wireless device.
 */
export const updateWirelessDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWirelessDeviceRequest,
    output: UpdateWirelessDeviceResponse,
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
 * Creates a multicast group.
 */
export const createMulticastGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMulticastGroupRequest,
    output: CreateMulticastGroupResponse,
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
 * Provisions a wireless gateway.
 *
 * When provisioning a wireless gateway, you might run into duplication errors for
 * the following reasons.
 *
 * - If you specify a `GatewayEui` value that already exists.
 *
 * - If you used a `ClientRequestToken` with the same parameters
 * within the last 10 minutes.
 *
 * To avoid this error, make sure that you use unique identifiers and parameters for
 * each request within the specified time period.
 */
export const createWirelessGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWirelessGatewayRequest,
    output: CreateWirelessGatewayResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about a device profile.
 */
export const getDeviceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceProfileRequest,
  output: GetDeviceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get position configuration for a given resource.
 *
 * This action is no longer supported. Calls to retrieve the position configuration
 * should use the GetResourcePosition API operation instead.
 */
export const getPositionConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPositionConfigurationRequest,
    output: GetPositionConfigurationResponse,
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
 * Gets information about a wireless device.
 */
export const getWirelessDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessDeviceRequest,
  output: GetWirelessDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets operating information about a wireless device.
 */
export const getWirelessDeviceStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWirelessDeviceStatisticsRequest,
    output: GetWirelessDeviceStatisticsResponse,
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
 * List the Sidewalk devices in an import task and their onboarding status.
 */
export const listDevicesForWirelessDeviceImportTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDevicesForWirelessDeviceImportTaskRequest,
    output: ListDevicesForWirelessDeviceImportTaskResponse,
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
 * List event configurations where at least one event topic has been enabled.
 */
export const listEventConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEventConfigurationsRequest,
    output: ListEventConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the wireless devices registered to your AWS account.
 */
export const listWirelessDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWirelessDevicesRequest,
  output: ListWirelessDevicesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List the wireless gateway tasks definitions registered to your AWS account.
 */
export const listWirelessGatewayTaskDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListWirelessGatewayTaskDefinitionsRequest,
    output: ListWirelessGatewayTaskDefinitionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Sends the specified data to a multicast group.
 */
export const sendDataToMulticastGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendDataToMulticastGroupRequest,
    output: SendDataToMulticastGroupResponse,
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
 * Provisions a wireless device.
 */
export const createWirelessDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWirelessDeviceRequest,
    output: CreateWirelessDeviceResponse,
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
 * Creates a gateway task definition.
 */
export const createWirelessGatewayTaskDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateWirelessGatewayTaskDefinitionRequest,
    output: CreateWirelessGatewayTaskDefinitionResponse,
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
 * Get the summary metrics for this AWS account.
 */
export const getMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetricsRequest,
  output: GetMetricsResponse,
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
 * Get estimated position information as a payload in GeoJSON format. The payload
 * measurement data is resolved using solvers that are provided by third-party
 * vendors.
 */
export const getPositionEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPositionEstimateRequest,
  output: GetPositionEstimateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends a decrypted application data frame to a device.
 */
export const sendDataToWirelessDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendDataToWirelessDeviceRequest,
    output: SendDataToWirelessDeviceResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

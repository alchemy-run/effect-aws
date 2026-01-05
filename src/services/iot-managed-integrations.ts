import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "IoT Managed Integrations",
  serviceShapeName: "IotManagedIntegrations",
});
const auth = T.AwsAuthSigv4({ name: "iotmanagedintegrations" });
const ver = T.ServiceVersion("2025-03-03");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
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
                  ],
                  endpoint: {
                    url: "https://api.iotmanagedintegrations-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://api.iotmanagedintegrations.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
export class GetCustomEndpointRequest extends S.Class<GetCustomEndpointRequest>(
  "GetCustomEndpointRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/custom-endpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterCustomEndpointRequest extends S.Class<RegisterCustomEndpointRequest>(
  "RegisterCustomEndpointRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/custom-endpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetHubConfigurationRequest extends S.Class<GetHubConfigurationRequest>(
  "GetHubConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/hub-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDefaultEncryptionConfigurationRequest extends S.Class<GetDefaultEncryptionConfigurationRequest>(
  "GetDefaultEncryptionConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/configuration/account/encryption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagKeyList = S.Array(S.String);
export const Target = S.Array(S.String);
export class GetCustomEndpointResponse extends S.Class<GetCustomEndpointResponse>(
  "GetCustomEndpointResponse",
)({ EndpointAddress: S.String }) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterCustomEndpointResponse extends S.Class<RegisterCustomEndpointResponse>(
  "RegisterCustomEndpointResponse",
)({ EndpointAddress: S.String }) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class CreateAccountAssociationRequest extends S.Class<CreateAccountAssociationRequest>(
  "CreateAccountAssociationRequest",
)(
  {
    ClientToken: S.optional(S.String),
    ConnectorDestinationId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/account-associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAccountAssociationRequest extends S.Class<GetAccountAssociationRequest>(
  "GetAccountAssociationRequest",
)(
  { AccountAssociationId: S.String.pipe(T.HttpLabel("AccountAssociationId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/account-associations/{AccountAssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccountAssociationRequest extends S.Class<UpdateAccountAssociationRequest>(
  "UpdateAccountAssociationRequest",
)(
  {
    AccountAssociationId: S.String.pipe(T.HttpLabel("AccountAssociationId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/account-associations/{AccountAssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccountAssociationResponse extends S.Class<UpdateAccountAssociationResponse>(
  "UpdateAccountAssociationResponse",
)({}) {}
export class DeleteAccountAssociationRequest extends S.Class<DeleteAccountAssociationRequest>(
  "DeleteAccountAssociationRequest",
)(
  { AccountAssociationId: S.String.pipe(T.HttpLabel("AccountAssociationId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/account-associations/{AccountAssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountAssociationResponse extends S.Class<DeleteAccountAssociationResponse>(
  "DeleteAccountAssociationResponse",
)({}) {}
export class ListAccountAssociationsRequest extends S.Class<ListAccountAssociationsRequest>(
  "ListAccountAssociationsRequest",
)(
  {
    ConnectorDestinationId: S.optional(S.String).pipe(
      T.HttpQuery("ConnectorDestinationId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/account-associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartAccountAssociationRefreshRequest extends S.Class<StartAccountAssociationRefreshRequest>(
  "StartAccountAssociationRefreshRequest",
)(
  { AccountAssociationId: S.String.pipe(T.HttpLabel("AccountAssociationId")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/account-associations/{AccountAssociationId}/refresh",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCloudConnectorRequest extends S.Class<GetCloudConnectorRequest>(
  "GetCloudConnectorRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/cloud-connectors/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCloudConnectorRequest extends S.Class<UpdateCloudConnectorRequest>(
  "UpdateCloudConnectorRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/cloud-connectors/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCloudConnectorResponse extends S.Class<UpdateCloudConnectorResponse>(
  "UpdateCloudConnectorResponse",
)({}) {}
export class DeleteCloudConnectorRequest extends S.Class<DeleteCloudConnectorRequest>(
  "DeleteCloudConnectorRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/cloud-connectors/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCloudConnectorResponse extends S.Class<DeleteCloudConnectorResponse>(
  "DeleteCloudConnectorResponse",
)({}) {}
export class ListCloudConnectorsRequest extends S.Class<ListCloudConnectorsRequest>(
  "ListCloudConnectorsRequest",
)(
  {
    Type: S.optional(S.String).pipe(T.HttpQuery("Type")),
    LambdaArn: S.optional(S.String).pipe(T.HttpQuery("LambdaArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/cloud-connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectorDestinationRequest extends S.Class<GetConnectorDestinationRequest>(
  "GetConnectorDestinationRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/connector-destinations/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorDestinationRequest extends S.Class<DeleteConnectorDestinationRequest>(
  "DeleteConnectorDestinationRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/connector-destinations/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorDestinationResponse extends S.Class<DeleteConnectorDestinationResponse>(
  "DeleteConnectorDestinationResponse",
)({}) {}
export class ListConnectorDestinationsRequest extends S.Class<ListConnectorDestinationsRequest>(
  "ListConnectorDestinationsRequest",
)(
  {
    CloudConnectorId: S.optional(S.String).pipe(
      T.HttpQuery("CloudConnectorId"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/connector-destinations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCredentialLockerRequest extends S.Class<CreateCredentialLockerRequest>(
  "CreateCredentialLockerRequest",
)(
  {
    Name: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/credential-lockers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCredentialLockerRequest extends S.Class<GetCredentialLockerRequest>(
  "GetCredentialLockerRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/credential-lockers/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCredentialLockerRequest extends S.Class<DeleteCredentialLockerRequest>(
  "DeleteCredentialLockerRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/credential-lockers/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCredentialLockerResponse extends S.Class<DeleteCredentialLockerResponse>(
  "DeleteCredentialLockerResponse",
)({}) {}
export class ListCredentialLockersRequest extends S.Class<ListCredentialLockersRequest>(
  "ListCredentialLockersRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/credential-lockers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDestinationRequest extends S.Class<CreateDestinationRequest>(
  "CreateDestinationRequest",
)(
  {
    DeliveryDestinationArn: S.String,
    DeliveryDestinationType: S.String,
    Name: S.String,
    RoleArn: S.String,
    ClientToken: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagsMap),
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
export class DeleteDestinationRequest extends S.Class<DeleteDestinationRequest>(
  "DeleteDestinationRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
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
export class GetDestinationRequest extends S.Class<GetDestinationRequest>(
  "GetDestinationRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "GET", uri: "/destinations/{Name}" }),
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
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
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
export class UpdateDestinationRequest extends S.Class<UpdateDestinationRequest>(
  "UpdateDestinationRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    DeliveryDestinationArn: S.optional(S.String),
    DeliveryDestinationType: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/destinations/{Name}" }),
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
export class GetDeviceDiscoveryRequest extends S.Class<GetDeviceDiscoveryRequest>(
  "GetDeviceDiscoveryRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/device-discoveries/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeviceDiscoveriesRequest extends S.Class<ListDeviceDiscoveriesRequest>(
  "ListDeviceDiscoveriesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    TypeFilter: S.optional(S.String).pipe(T.HttpQuery("TypeFilter")),
    StatusFilter: S.optional(S.String).pipe(T.HttpQuery("StatusFilter")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/device-discoveries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDiscoveredDevicesRequest extends S.Class<ListDiscoveredDevicesRequest>(
  "ListDiscoveredDevicesRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/device-discoveries/{Identifier}/devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEventLogConfigurationRequest extends S.Class<CreateEventLogConfigurationRequest>(
  "CreateEventLogConfigurationRequest",
)(
  {
    ResourceType: S.String,
    ResourceId: S.optional(S.String),
    EventLogLevel: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/event-log-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventLogConfigurationRequest extends S.Class<DeleteEventLogConfigurationRequest>(
  "DeleteEventLogConfigurationRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/event-log-configurations/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventLogConfigurationResponse extends S.Class<DeleteEventLogConfigurationResponse>(
  "DeleteEventLogConfigurationResponse",
)({}) {}
export class GetEventLogConfigurationRequest extends S.Class<GetEventLogConfigurationRequest>(
  "GetEventLogConfigurationRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "GET", uri: "/event-log-configurations/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventLogConfigurationsRequest extends S.Class<ListEventLogConfigurationsRequest>(
  "ListEventLogConfigurationsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/event-log-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEventLogConfigurationRequest extends S.Class<UpdateEventLogConfigurationRequest>(
  "UpdateEventLogConfigurationRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")), EventLogLevel: S.String },
  T.all(
    T.Http({ method: "PATCH", uri: "/event-log-configurations/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEventLogConfigurationResponse extends S.Class<UpdateEventLogConfigurationResponse>(
  "UpdateEventLogConfigurationResponse",
)({}) {}
export class GetHubConfigurationResponse extends S.Class<GetHubConfigurationResponse>(
  "GetHubConfigurationResponse",
)({
  HubTokenTimerExpirySettingInSeconds: S.optional(S.Number),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class PutHubConfigurationRequest extends S.Class<PutHubConfigurationRequest>(
  "PutHubConfigurationRequest",
)(
  { HubTokenTimerExpirySettingInSeconds: S.Number },
  T.all(
    T.Http({ method: "PUT", uri: "/hub-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDefaultEncryptionConfigurationRequest extends S.Class<PutDefaultEncryptionConfigurationRequest>(
  "PutDefaultEncryptionConfigurationRequest",
)(
  { encryptionType: S.String, kmsKeyArn: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/configuration/account/encryption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterAccountAssociationRequest extends S.Class<DeregisterAccountAssociationRequest>(
  "DeregisterAccountAssociationRequest",
)(
  { ManagedThingId: S.String, AccountAssociationId: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/managed-thing-associations/deregister" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterAccountAssociationResponse extends S.Class<DeregisterAccountAssociationResponse>(
  "DeregisterAccountAssociationResponse",
)({}) {}
export class ListManagedThingAccountAssociationsRequest extends S.Class<ListManagedThingAccountAssociationsRequest>(
  "ListManagedThingAccountAssociationsRequest",
)(
  {
    ManagedThingId: S.optional(S.String).pipe(T.HttpQuery("ManagedThingId")),
    AccountAssociationId: S.optional(S.String).pipe(
      T.HttpQuery("AccountAssociationId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-thing-associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterAccountAssociationRequest extends S.Class<RegisterAccountAssociationRequest>(
  "RegisterAccountAssociationRequest",
)(
  {
    ManagedThingId: S.String,
    AccountAssociationId: S.String,
    DeviceDiscoveryId: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/managed-thing-associations/register" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedThingRequest extends S.Class<GetManagedThingRequest>(
  "GetManagedThingRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/managed-things/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DeviceTypes = S.Array(S.String);
export const CapabilityReportProperties = S.Array(S.String);
export const CapabilityReportActions = S.Array(S.String);
export const CapabilityReportEvents = S.Array(S.String);
export class CapabilityReportCapability extends S.Class<CapabilityReportCapability>(
  "CapabilityReportCapability",
)({
  id: S.String,
  name: S.String,
  version: S.String,
  properties: CapabilityReportProperties,
  actions: CapabilityReportActions,
  events: CapabilityReportEvents,
}) {}
export const CapabilityReportCapabilities = S.Array(CapabilityReportCapability);
export class CapabilityReportEndpoint extends S.Class<CapabilityReportEndpoint>(
  "CapabilityReportEndpoint",
)({
  id: S.String,
  deviceTypes: DeviceTypes,
  capabilities: CapabilityReportCapabilities,
}) {}
export const CapabilityReportEndpoints = S.Array(CapabilityReportEndpoint);
export class CapabilityReport extends S.Class<CapabilityReport>(
  "CapabilityReport",
)({
  version: S.String,
  nodeId: S.optional(S.String),
  endpoints: CapabilityReportEndpoints,
}) {}
export class CapabilitySchemaItem extends S.Class<CapabilitySchemaItem>(
  "CapabilitySchemaItem",
)({
  Format: S.String,
  CapabilityId: S.String,
  ExtrinsicId: S.String,
  ExtrinsicVersion: S.Number,
  Schema: S.Any,
}) {}
export const CapabilitySchemas = S.Array(CapabilitySchemaItem);
export const MetaData = S.Record({ key: S.String, value: S.String });
export class UpdateManagedThingRequest extends S.Class<UpdateManagedThingRequest>(
  "UpdateManagedThingRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Owner: S.optional(S.String),
    CredentialLockerId: S.optional(S.String),
    SerialNumber: S.optional(S.String),
    Brand: S.optional(S.String),
    Model: S.optional(S.String),
    Name: S.optional(S.String),
    CapabilityReport: S.optional(CapabilityReport),
    CapabilitySchemas: S.optional(CapabilitySchemas),
    Capabilities: S.optional(S.String),
    Classification: S.optional(S.String),
    HubNetworkMode: S.optional(S.String),
    MetaData: S.optional(MetaData),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/managed-things/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateManagedThingResponse extends S.Class<UpdateManagedThingResponse>(
  "UpdateManagedThingResponse",
)({}) {}
export class DeleteManagedThingRequest extends S.Class<DeleteManagedThingRequest>(
  "DeleteManagedThingRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Force: S.optional(S.Boolean).pipe(T.HttpQuery("Force")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/managed-things/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteManagedThingResponse extends S.Class<DeleteManagedThingResponse>(
  "DeleteManagedThingResponse",
)({}) {}
export class ListManagedThingsRequest extends S.Class<ListManagedThingsRequest>(
  "ListManagedThingsRequest",
)(
  {
    OwnerFilter: S.optional(S.String).pipe(T.HttpQuery("OwnerFilter")),
    CredentialLockerFilter: S.optional(S.String).pipe(
      T.HttpQuery("CredentialLockerFilter"),
    ),
    RoleFilter: S.optional(S.String).pipe(T.HttpQuery("RoleFilter")),
    ParentControllerIdentifierFilter: S.optional(S.String).pipe(
      T.HttpQuery("ParentControllerIdentifierFilter"),
    ),
    ConnectorPolicyIdFilter: S.optional(S.String).pipe(
      T.HttpQuery("ConnectorPolicyIdFilter"),
    ),
    ConnectorDestinationIdFilter: S.optional(S.String).pipe(
      T.HttpQuery("ConnectorDestinationIdFilter"),
    ),
    ConnectorDeviceIdFilter: S.optional(S.String).pipe(
      T.HttpQuery("ConnectorDeviceIdFilter"),
    ),
    SerialNumberFilter: S.optional(S.String).pipe(
      T.HttpQuery("SerialNumberFilter"),
    ),
    ProvisioningStatusFilter: S.optional(S.String).pipe(
      T.HttpQuery("ProvisioningStatusFilter"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-things" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedThingCapabilitiesRequest extends S.Class<GetManagedThingCapabilitiesRequest>(
  "GetManagedThingCapabilitiesRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/managed-things-capabilities/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedThingCertificateRequest extends S.Class<GetManagedThingCertificateRequest>(
  "GetManagedThingCertificateRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/managed-things-certificate/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedThingConnectivityDataRequest extends S.Class<GetManagedThingConnectivityDataRequest>(
  "GetManagedThingConnectivityDataRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/managed-things-connectivity-data/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedThingMetaDataRequest extends S.Class<GetManagedThingMetaDataRequest>(
  "GetManagedThingMetaDataRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/managed-things-metadata/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedThingSchemasRequest extends S.Class<ListManagedThingSchemasRequest>(
  "ListManagedThingSchemasRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    EndpointIdFilter: S.optional(S.String).pipe(
      T.HttpQuery("EndpointIdFilter"),
    ),
    CapabilityIdFilter: S.optional(S.String).pipe(
      T.HttpQuery("CapabilityIdFilter"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-thing-schemas/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedThingStateRequest extends S.Class<GetManagedThingStateRequest>(
  "GetManagedThingStateRequest",
)(
  { ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")) },
  T.all(
    T.Http({ method: "GET", uri: "/managed-thing-states/{ManagedThingId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNotificationConfigurationRequest extends S.Class<CreateNotificationConfigurationRequest>(
  "CreateNotificationConfigurationRequest",
)(
  {
    EventType: S.String,
    DestinationName: S.String,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/notification-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNotificationConfigurationRequest extends S.Class<DeleteNotificationConfigurationRequest>(
  "DeleteNotificationConfigurationRequest",
)(
  { EventType: S.String.pipe(T.HttpLabel("EventType")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/notification-configurations/{EventType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNotificationConfigurationResponse extends S.Class<DeleteNotificationConfigurationResponse>(
  "DeleteNotificationConfigurationResponse",
)({}) {}
export class GetNotificationConfigurationRequest extends S.Class<GetNotificationConfigurationRequest>(
  "GetNotificationConfigurationRequest",
)(
  { EventType: S.String.pipe(T.HttpLabel("EventType")) },
  T.all(
    T.Http({ method: "GET", uri: "/notification-configurations/{EventType}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNotificationConfigurationsRequest extends S.Class<ListNotificationConfigurationsRequest>(
  "ListNotificationConfigurationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/notification-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNotificationConfigurationRequest extends S.Class<UpdateNotificationConfigurationRequest>(
  "UpdateNotificationConfigurationRequest",
)(
  {
    EventType: S.String.pipe(T.HttpLabel("EventType")),
    DestinationName: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/notification-configurations/{EventType}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNotificationConfigurationResponse extends S.Class<UpdateNotificationConfigurationResponse>(
  "UpdateNotificationConfigurationResponse",
)({}) {}
export class DeleteOtaTaskConfigurationRequest extends S.Class<DeleteOtaTaskConfigurationRequest>(
  "DeleteOtaTaskConfigurationRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/ota-task-configurations/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOtaTaskConfigurationResponse extends S.Class<DeleteOtaTaskConfigurationResponse>(
  "DeleteOtaTaskConfigurationResponse",
)({}) {}
export class GetOtaTaskConfigurationRequest extends S.Class<GetOtaTaskConfigurationRequest>(
  "GetOtaTaskConfigurationRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/ota-task-configurations/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOtaTaskConfigurationsRequest extends S.Class<ListOtaTaskConfigurationsRequest>(
  "ListOtaTaskConfigurationsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ota-task-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOtaTaskRequest extends S.Class<GetOtaTaskRequest>(
  "GetOtaTaskRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/ota-tasks/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateOtaTaskRequest extends S.Class<UpdateOtaTaskRequest>(
  "UpdateOtaTaskRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Description: S.optional(S.String),
    TaskConfigurationId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/ota-tasks/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateOtaTaskResponse extends S.Class<UpdateOtaTaskResponse>(
  "UpdateOtaTaskResponse",
)({}) {}
export class DeleteOtaTaskRequest extends S.Class<DeleteOtaTaskRequest>(
  "DeleteOtaTaskRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/ota-tasks/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOtaTaskResponse extends S.Class<DeleteOtaTaskResponse>(
  "DeleteOtaTaskResponse",
)({}) {}
export class ListOtaTasksRequest extends S.Class<ListOtaTasksRequest>(
  "ListOtaTasksRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ota-tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOtaTaskExecutionsRequest extends S.Class<ListOtaTaskExecutionsRequest>(
  "ListOtaTaskExecutionsRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ota-tasks/{Identifier}/devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProvisioningProfileRequest extends S.Class<CreateProvisioningProfileRequest>(
  "CreateProvisioningProfileRequest",
)(
  {
    ProvisioningType: S.String,
    CaCertificate: S.optional(S.String),
    Name: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/provisioning-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProvisioningProfileRequest extends S.Class<GetProvisioningProfileRequest>(
  "GetProvisioningProfileRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/provisioning-profiles/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProvisioningProfileRequest extends S.Class<DeleteProvisioningProfileRequest>(
  "DeleteProvisioningProfileRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/provisioning-profiles/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProvisioningProfileResponse extends S.Class<DeleteProvisioningProfileResponse>(
  "DeleteProvisioningProfileResponse",
)({}) {}
export class ListProvisioningProfilesRequest extends S.Class<ListProvisioningProfilesRequest>(
  "ListProvisioningProfilesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/provisioning-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRuntimeLogConfigurationRequest extends S.Class<GetRuntimeLogConfigurationRequest>(
  "GetRuntimeLogConfigurationRequest",
)(
  { ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/runtime-log-configurations/{ManagedThingId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetRuntimeLogConfigurationRequest extends S.Class<ResetRuntimeLogConfigurationRequest>(
  "ResetRuntimeLogConfigurationRequest",
)(
  { ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/runtime-log-configurations/{ManagedThingId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetRuntimeLogConfigurationResponse extends S.Class<ResetRuntimeLogConfigurationResponse>(
  "ResetRuntimeLogConfigurationResponse",
)({}) {}
export class GetSchemaVersionRequest extends S.Class<GetSchemaVersionRequest>(
  "GetSchemaVersionRequest",
)(
  {
    Type: S.String.pipe(T.HttpLabel("Type")),
    SchemaVersionedId: S.String.pipe(T.HttpLabel("SchemaVersionedId")),
    Format: S.optional(S.String).pipe(T.HttpQuery("Format")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/schema-versions/{Type}/{SchemaVersionedId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSchemaVersionsRequest extends S.Class<ListSchemaVersionsRequest>(
  "ListSchemaVersionsRequest",
)(
  {
    Type: S.String.pipe(T.HttpLabel("Type")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    SchemaId: S.optional(S.String).pipe(T.HttpQuery("SchemaIdFilter")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("NamespaceFilter")),
    Visibility: S.optional(S.String).pipe(T.HttpQuery("VisibilityFilter")),
    SemanticVersion: S.optional(S.String).pipe(
      T.HttpQuery("SemanticVersionFilter"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/schema-versions/{Type}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SecretsManager extends S.Class<SecretsManager>("SecretsManager")({
  arn: S.String,
  versionId: S.String,
}) {}
export const CustomProtocolDetail = S.Record({
  key: S.String,
  value: S.String,
});
export class RuntimeLogConfigurations extends S.Class<RuntimeLogConfigurations>(
  "RuntimeLogConfigurations",
)({
  LogLevel: S.optional(S.String),
  LogFlushLevel: S.optional(S.String),
  LocalStoreLocation: S.optional(S.String),
  LocalStoreFileRotationMaxFiles: S.optional(S.Number),
  LocalStoreFileRotationMaxBytes: S.optional(S.Number),
  UploadLog: S.optional(S.Boolean),
  UploadPeriodMinutes: S.optional(S.Number),
  DeleteLocalStoreAfterUpload: S.optional(S.Boolean),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagsMap },
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
export class CreateAccountAssociationResponse extends S.Class<CreateAccountAssociationResponse>(
  "CreateAccountAssociationResponse",
)({
  OAuthAuthorizationUrl: S.String,
  AccountAssociationId: S.String,
  AssociationState: S.String,
  Arn: S.optional(S.String),
}) {}
export class GetAccountAssociationResponse extends S.Class<GetAccountAssociationResponse>(
  "GetAccountAssociationResponse",
)({
  AccountAssociationId: S.String,
  AssociationState: S.String,
  ErrorMessage: S.optional(S.String),
  ConnectorDestinationId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Arn: S.optional(S.String),
  OAuthAuthorizationUrl: S.String,
  Tags: S.optional(TagsMap),
}) {}
export class StartAccountAssociationRefreshResponse extends S.Class<StartAccountAssociationRefreshResponse>(
  "StartAccountAssociationRefreshResponse",
)({ OAuthAuthorizationUrl: S.String }) {}
export class LambdaConfig extends S.Class<LambdaConfig>("LambdaConfig")({
  arn: S.String,
}) {}
export class EndpointConfig extends S.Class<EndpointConfig>("EndpointConfig")({
  lambda: S.optional(LambdaConfig),
}) {}
export class GetCloudConnectorResponse extends S.Class<GetCloudConnectorResponse>(
  "GetCloudConnectorResponse",
)({
  Name: S.String,
  EndpointConfig: EndpointConfig,
  Description: S.optional(S.String),
  EndpointType: S.optional(S.String),
  Id: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export class ProactiveRefreshTokenRenewal extends S.Class<ProactiveRefreshTokenRenewal>(
  "ProactiveRefreshTokenRenewal",
)({
  enabled: S.optional(S.Boolean),
  DaysBeforeRenewal: S.optional(S.Number),
}) {}
export class OAuthConfig extends S.Class<OAuthConfig>("OAuthConfig")({
  authUrl: S.String,
  tokenUrl: S.String,
  scope: S.optional(S.String),
  tokenEndpointAuthenticationScheme: S.String,
  oAuthCompleteRedirectUrl: S.optional(S.String),
  proactiveRefreshTokenRenewal: S.optional(ProactiveRefreshTokenRenewal),
}) {}
export class AuthConfig extends S.Class<AuthConfig>("AuthConfig")({
  oAuth: S.optional(OAuthConfig),
}) {}
export class GetConnectorDestinationResponse extends S.Class<GetConnectorDestinationResponse>(
  "GetConnectorDestinationResponse",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CloudConnectorId: S.optional(S.String),
  Id: S.optional(S.String),
  AuthType: S.optional(S.String),
  AuthConfig: S.optional(AuthConfig),
  SecretsManager: S.optional(SecretsManager),
  OAuthCompleteRedirectUrl: S.optional(S.String),
}) {}
export class CreateCredentialLockerResponse extends S.Class<CreateCredentialLockerResponse>(
  "CreateCredentialLockerResponse",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetCredentialLockerResponse extends S.Class<GetCredentialLockerResponse>(
  "GetCredentialLockerResponse",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagsMap),
}) {}
export class CreateDestinationResponse extends S.Class<CreateDestinationResponse>(
  "CreateDestinationResponse",
)({ Name: S.optional(S.String) }) {}
export class GetDestinationResponse extends S.Class<GetDestinationResponse>(
  "GetDestinationResponse",
)({
  Description: S.optional(S.String),
  DeliveryDestinationArn: S.optional(S.String),
  DeliveryDestinationType: S.optional(S.String),
  Name: S.optional(S.String),
  RoleArn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagsMap),
}) {}
export class StartDeviceDiscoveryRequest extends S.Class<StartDeviceDiscoveryRequest>(
  "StartDeviceDiscoveryRequest",
)(
  {
    DiscoveryType: S.String,
    CustomProtocolDetail: S.optional(CustomProtocolDetail),
    ControllerIdentifier: S.optional(S.String),
    ConnectorAssociationIdentifier: S.optional(S.String),
    AccountAssociationId: S.optional(S.String),
    AuthenticationMaterial: S.optional(S.String),
    AuthenticationMaterialType: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/device-discoveries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeviceDiscoveryResponse extends S.Class<GetDeviceDiscoveryResponse>(
  "GetDeviceDiscoveryResponse",
)({
  Id: S.String,
  Arn: S.String,
  DiscoveryType: S.String,
  Status: S.String,
  StartedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ControllerId: S.optional(S.String),
  ConnectorAssociationId: S.optional(S.String),
  AccountAssociationId: S.optional(S.String),
  FinishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagsMap),
}) {}
export class CreateEventLogConfigurationResponse extends S.Class<CreateEventLogConfigurationResponse>(
  "CreateEventLogConfigurationResponse",
)({ Id: S.optional(S.String) }) {}
export class GetEventLogConfigurationResponse extends S.Class<GetEventLogConfigurationResponse>(
  "GetEventLogConfigurationResponse",
)({
  Id: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  EventLogLevel: S.optional(S.String),
}) {}
export class PutHubConfigurationResponse extends S.Class<PutHubConfigurationResponse>(
  "PutHubConfigurationResponse",
)({ HubTokenTimerExpirySettingInSeconds: S.optional(S.Number) }) {}
export class ConfigurationError extends S.Class<ConfigurationError>(
  "ConfigurationError",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class ConfigurationStatus extends S.Class<ConfigurationStatus>(
  "ConfigurationStatus",
)({ error: S.optional(ConfigurationError), state: S.String }) {}
export class PutDefaultEncryptionConfigurationResponse extends S.Class<PutDefaultEncryptionConfigurationResponse>(
  "PutDefaultEncryptionConfigurationResponse",
)({
  configurationStatus: ConfigurationStatus,
  encryptionType: S.String,
  kmsKeyArn: S.optional(S.String),
}) {}
export class RegisterAccountAssociationResponse extends S.Class<RegisterAccountAssociationResponse>(
  "RegisterAccountAssociationResponse",
)({
  AccountAssociationId: S.optional(S.String),
  DeviceDiscoveryId: S.optional(S.String),
  ManagedThingId: S.optional(S.String),
}) {}
export class GetManagedThingResponse extends S.Class<GetManagedThingResponse>(
  "GetManagedThingResponse",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Owner: S.optional(S.String),
  CredentialLockerId: S.optional(S.String),
  AdvertisedProductId: S.optional(S.String),
  Role: S.optional(S.String),
  ProvisioningStatus: S.optional(S.String),
  Name: S.optional(S.String),
  Model: S.optional(S.String),
  Brand: S.optional(S.String),
  SerialNumber: S.optional(S.String),
  UniversalProductCode: S.optional(S.String),
  InternationalArticleNumber: S.optional(S.String),
  ConnectorPolicyId: S.optional(S.String),
  ConnectorDestinationId: S.optional(S.String),
  ConnectorDeviceId: S.optional(S.String),
  DeviceSpecificKey: S.optional(S.String),
  MacAddress: S.optional(S.String),
  ParentControllerId: S.optional(S.String),
  Classification: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ActivatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HubNetworkMode: S.optional(S.String),
  MetaData: S.optional(MetaData),
  Tags: S.optional(TagsMap),
}) {}
export class GetManagedThingCapabilitiesResponse extends S.Class<GetManagedThingCapabilitiesResponse>(
  "GetManagedThingCapabilitiesResponse",
)({
  ManagedThingId: S.optional(S.String),
  Capabilities: S.optional(S.String),
  CapabilityReport: S.optional(CapabilityReport),
}) {}
export class GetManagedThingCertificateResponse extends S.Class<GetManagedThingCertificateResponse>(
  "GetManagedThingCertificateResponse",
)({
  ManagedThingId: S.optional(S.String),
  CertificatePem: S.optional(S.String),
}) {}
export class GetManagedThingConnectivityDataResponse extends S.Class<GetManagedThingConnectivityDataResponse>(
  "GetManagedThingConnectivityDataResponse",
)({
  ManagedThingId: S.optional(S.String),
  Connected: S.optional(S.Boolean),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DisconnectReason: S.optional(S.String),
}) {}
export class GetManagedThingMetaDataResponse extends S.Class<GetManagedThingMetaDataResponse>(
  "GetManagedThingMetaDataResponse",
)({ ManagedThingId: S.optional(S.String), MetaData: S.optional(MetaData) }) {}
export class CreateNotificationConfigurationResponse extends S.Class<CreateNotificationConfigurationResponse>(
  "CreateNotificationConfigurationResponse",
)({ EventType: S.optional(S.String) }) {}
export class GetNotificationConfigurationResponse extends S.Class<GetNotificationConfigurationResponse>(
  "GetNotificationConfigurationResponse",
)({
  EventType: S.optional(S.String),
  DestinationName: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagsMap),
}) {}
export class AbortConfigCriteria extends S.Class<AbortConfigCriteria>(
  "AbortConfigCriteria",
)({
  Action: S.optional(S.String),
  FailureType: S.optional(S.String),
  MinNumberOfExecutedThings: S.optional(S.Number),
  ThresholdPercentage: S.optional(S.Number),
}) {}
export const AbortConfigCriteriaList = S.Array(AbortConfigCriteria);
export class OtaTaskAbortConfig extends S.Class<OtaTaskAbortConfig>(
  "OtaTaskAbortConfig",
)({ AbortConfigCriteriaList: S.optional(AbortConfigCriteriaList) }) {}
export class RolloutRateIncreaseCriteria extends S.Class<RolloutRateIncreaseCriteria>(
  "RolloutRateIncreaseCriteria",
)({
  numberOfNotifiedThings: S.optional(S.Number),
  numberOfSucceededThings: S.optional(S.Number),
}) {}
export class ExponentialRolloutRate extends S.Class<ExponentialRolloutRate>(
  "ExponentialRolloutRate",
)({
  BaseRatePerMinute: S.optional(S.Number),
  IncrementFactor: S.optional(S.Number),
  RateIncreaseCriteria: S.optional(RolloutRateIncreaseCriteria),
}) {}
export class OtaTaskExecutionRolloutConfig extends S.Class<OtaTaskExecutionRolloutConfig>(
  "OtaTaskExecutionRolloutConfig",
)({
  ExponentialRolloutRate: S.optional(ExponentialRolloutRate),
  MaximumPerMinute: S.optional(S.Number),
}) {}
export class OtaTaskTimeoutConfig extends S.Class<OtaTaskTimeoutConfig>(
  "OtaTaskTimeoutConfig",
)({ InProgressTimeoutInMinutes: S.optional(S.Number) }) {}
export class PushConfig extends S.Class<PushConfig>("PushConfig")({
  AbortConfig: S.optional(OtaTaskAbortConfig),
  RolloutConfig: S.optional(OtaTaskExecutionRolloutConfig),
  TimeoutConfig: S.optional(OtaTaskTimeoutConfig),
}) {}
export class GetOtaTaskConfigurationResponse extends S.Class<GetOtaTaskConfigurationResponse>(
  "GetOtaTaskConfigurationResponse",
)({
  TaskConfigurationId: S.optional(S.String),
  Name: S.optional(S.String),
  PushConfig: S.optional(PushConfig),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateProvisioningProfileResponse extends S.Class<CreateProvisioningProfileResponse>(
  "CreateProvisioningProfileResponse",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  ProvisioningType: S.optional(S.String),
  Id: S.optional(S.String),
  ClaimCertificate: S.optional(S.String),
  ClaimCertificatePrivateKey: S.optional(S.String),
}) {}
export class GetProvisioningProfileResponse extends S.Class<GetProvisioningProfileResponse>(
  "GetProvisioningProfileResponse",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  ProvisioningType: S.optional(S.String),
  Id: S.optional(S.String),
  ClaimCertificate: S.optional(S.String),
  Tags: S.optional(TagsMap),
}) {}
export class GetRuntimeLogConfigurationResponse extends S.Class<GetRuntimeLogConfigurationResponse>(
  "GetRuntimeLogConfigurationResponse",
)({
  ManagedThingId: S.optional(S.String),
  RuntimeLogConfigurations: S.optional(RuntimeLogConfigurations),
}) {}
export class PutRuntimeLogConfigurationRequest extends S.Class<PutRuntimeLogConfigurationRequest>(
  "PutRuntimeLogConfigurationRequest",
)(
  {
    ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")),
    RuntimeLogConfigurations: RuntimeLogConfigurations,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/runtime-log-configurations/{ManagedThingId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRuntimeLogConfigurationResponse extends S.Class<PutRuntimeLogConfigurationResponse>(
  "PutRuntimeLogConfigurationResponse",
)({}) {}
export class GetSchemaVersionResponse extends S.Class<GetSchemaVersionResponse>(
  "GetSchemaVersionResponse",
)({
  SchemaId: S.optional(S.String),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
  Namespace: S.optional(S.String),
  SemanticVersion: S.optional(S.String),
  Visibility: S.optional(S.String),
  Schema: S.optional(S.Any),
}) {}
export class OAuthUpdate extends S.Class<OAuthUpdate>("OAuthUpdate")({
  oAuthCompleteRedirectUrl: S.optional(S.String),
  proactiveRefreshTokenRenewal: S.optional(ProactiveRefreshTokenRenewal),
}) {}
export const DeviceTypeList = S.Array(S.String);
export class ScheduleMaintenanceWindow extends S.Class<ScheduleMaintenanceWindow>(
  "ScheduleMaintenanceWindow",
)({
  DurationInMinutes: S.optional(S.Number),
  StartTime: S.optional(S.String),
}) {}
export const ScheduleMaintenanceWindowList = S.Array(ScheduleMaintenanceWindow);
export class RetryConfigCriteria extends S.Class<RetryConfigCriteria>(
  "RetryConfigCriteria",
)({
  FailureType: S.optional(S.String),
  MinNumberOfRetries: S.optional(S.Number),
}) {}
export const RetryConfigCriteriaList = S.Array(RetryConfigCriteria);
export const MatterCapabilityReportEndpointParts = S.Array(S.String);
export const MatterCapabilityReportEndpointSemanticTags = S.Array(S.String);
export const MatterCapabilityReportEndpointClientClusters = S.Array(S.String);
export class AccountAssociationItem extends S.Class<AccountAssociationItem>(
  "AccountAssociationItem",
)({
  AccountAssociationId: S.String,
  AssociationState: S.String,
  ErrorMessage: S.optional(S.String),
  ConnectorDestinationId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export const AccountAssociationListDefinition = S.Array(AccountAssociationItem);
export class ConnectorItem extends S.Class<ConnectorItem>("ConnectorItem")({
  Name: S.String,
  EndpointConfig: EndpointConfig,
  Description: S.optional(S.String),
  EndpointType: S.optional(S.String),
  Id: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const ConnectorList = S.Array(ConnectorItem);
export class AuthConfigUpdate extends S.Class<AuthConfigUpdate>(
  "AuthConfigUpdate",
)({ oAuthUpdate: S.optional(OAuthUpdate) }) {}
export class ConnectorDestinationSummary extends S.Class<ConnectorDestinationSummary>(
  "ConnectorDestinationSummary",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CloudConnectorId: S.optional(S.String),
  Id: S.optional(S.String),
}) {}
export const ConnectorDestinationListDefinition = S.Array(
  ConnectorDestinationSummary,
);
export class CredentialLockerSummary extends S.Class<CredentialLockerSummary>(
  "CredentialLockerSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CredentialLockerListDefinition = S.Array(CredentialLockerSummary);
export class DestinationSummary extends S.Class<DestinationSummary>(
  "DestinationSummary",
)({
  Description: S.optional(S.String),
  DeliveryDestinationArn: S.optional(S.String),
  DeliveryDestinationType: S.optional(S.String),
  Name: S.optional(S.String),
  RoleArn: S.optional(S.String),
}) {}
export const DestinationListDefinition = S.Array(DestinationSummary);
export class DeviceDiscoverySummary extends S.Class<DeviceDiscoverySummary>(
  "DeviceDiscoverySummary",
)({
  Id: S.optional(S.String),
  DiscoveryType: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const DeviceDiscoveryListDefinition = S.Array(DeviceDiscoverySummary);
export class DiscoveredDeviceSummary extends S.Class<DiscoveredDeviceSummary>(
  "DiscoveredDeviceSummary",
)({
  ConnectorDeviceId: S.optional(S.String),
  ConnectorDeviceName: S.optional(S.String),
  DeviceTypes: S.optional(DeviceTypeList),
  ManagedThingId: S.optional(S.String),
  Modification: S.optional(S.String),
  DiscoveredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Brand: S.optional(S.String),
  Model: S.optional(S.String),
  AuthenticationMaterial: S.optional(S.String),
}) {}
export const DiscoveredDeviceListDefinition = S.Array(DiscoveredDeviceSummary);
export class EventLogConfigurationSummary extends S.Class<EventLogConfigurationSummary>(
  "EventLogConfigurationSummary",
)({
  Id: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  EventLogLevel: S.optional(S.String),
}) {}
export const EventLogConfigurationListDefinition = S.Array(
  EventLogConfigurationSummary,
);
export class ManagedThingAssociation extends S.Class<ManagedThingAssociation>(
  "ManagedThingAssociation",
)({
  ManagedThingId: S.optional(S.String),
  AccountAssociationId: S.optional(S.String),
}) {}
export const ManagedThingAssociationList = S.Array(ManagedThingAssociation);
export class ManagedThingSummary extends S.Class<ManagedThingSummary>(
  "ManagedThingSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  AdvertisedProductId: S.optional(S.String),
  Brand: S.optional(S.String),
  Classification: S.optional(S.String),
  ConnectorDeviceId: S.optional(S.String),
  ConnectorPolicyId: S.optional(S.String),
  ConnectorDestinationId: S.optional(S.String),
  Model: S.optional(S.String),
  Name: S.optional(S.String),
  Owner: S.optional(S.String),
  CredentialLockerId: S.optional(S.String),
  ParentControllerId: S.optional(S.String),
  ProvisioningStatus: S.optional(S.String),
  Role: S.optional(S.String),
  SerialNumber: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ActivatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ManagedThingListDefinition = S.Array(ManagedThingSummary);
export class ManagedThingSchemaListItem extends S.Class<ManagedThingSchemaListItem>(
  "ManagedThingSchemaListItem",
)({
  EndpointId: S.optional(S.String),
  CapabilityId: S.optional(S.String),
  Schema: S.optional(S.Any),
}) {}
export const ManagedThingSchemaListDefinition = S.Array(
  ManagedThingSchemaListItem,
);
export class NotificationConfigurationSummary extends S.Class<NotificationConfigurationSummary>(
  "NotificationConfigurationSummary",
)({ EventType: S.optional(S.String), DestinationName: S.optional(S.String) }) {}
export const NotificationConfigurationListDefinition = S.Array(
  NotificationConfigurationSummary,
);
export class OtaTaskConfigurationSummary extends S.Class<OtaTaskConfigurationSummary>(
  "OtaTaskConfigurationSummary",
)({
  TaskConfigurationId: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OtaTaskConfigurationListDefinition = S.Array(
  OtaTaskConfigurationSummary,
);
export class OtaTaskSchedulingConfig extends S.Class<OtaTaskSchedulingConfig>(
  "OtaTaskSchedulingConfig",
)({
  EndBehavior: S.optional(S.String),
  EndTime: S.optional(S.String),
  MaintenanceWindows: S.optional(ScheduleMaintenanceWindowList),
  StartTime: S.optional(S.String),
}) {}
export class OtaTaskExecutionRetryConfig extends S.Class<OtaTaskExecutionRetryConfig>(
  "OtaTaskExecutionRetryConfig",
)({ RetryConfigCriteria: S.optional(RetryConfigCriteriaList) }) {}
export class TaskProcessingDetails extends S.Class<TaskProcessingDetails>(
  "TaskProcessingDetails",
)({
  NumberOfCanceledThings: S.optional(S.Number),
  NumberOfFailedThings: S.optional(S.Number),
  NumberOfInProgressThings: S.optional(S.Number),
  numberOfQueuedThings: S.optional(S.Number),
  numberOfRejectedThings: S.optional(S.Number),
  numberOfRemovedThings: S.optional(S.Number),
  numberOfSucceededThings: S.optional(S.Number),
  numberOfTimedOutThings: S.optional(S.Number),
  processingTargets: S.optional(Target),
}) {}
export class OtaTaskSummary extends S.Class<OtaTaskSummary>("OtaTaskSummary")({
  TaskId: S.optional(S.String),
  TaskArn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TaskConfigurationId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const OtaTaskListDefinition = S.Array(OtaTaskSummary);
export class ProvisioningProfileSummary extends S.Class<ProvisioningProfileSummary>(
  "ProvisioningProfileSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  ProvisioningType: S.optional(S.String),
}) {}
export const ProvisioningProfileListDefinition = S.Array(
  ProvisioningProfileSummary,
);
export class SchemaVersionListItem extends S.Class<SchemaVersionListItem>(
  "SchemaVersionListItem",
)({
  SchemaId: S.optional(S.String),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
  Namespace: S.optional(S.String),
  SemanticVersion: S.optional(S.String),
  Visibility: S.optional(S.String),
}) {}
export const SchemaVersionList = S.Array(SchemaVersionListItem);
export const MatterCommands = S.Record({ key: S.String, value: S.Any });
export const MatterEvents = S.Record({ key: S.String, value: S.Any });
export class CapabilityAction extends S.Class<CapabilityAction>(
  "CapabilityAction",
)({
  name: S.String,
  ref: S.optional(S.String),
  actionTraceId: S.optional(S.String),
  parameters: S.optional(S.Any),
}) {}
export const CapabilityActions = S.Array(CapabilityAction);
export const MatterCapabilityReportCommands = S.Array(S.String);
export const MatterCapabilityReportEvents = S.Array(S.String);
export const MatterCapabilityReportGeneratedCommands = S.Array(S.String);
export class ListAccountAssociationsResponse extends S.Class<ListAccountAssociationsResponse>(
  "ListAccountAssociationsResponse",
)({
  Items: S.optional(AccountAssociationListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class CreateCloudConnectorRequest extends S.Class<CreateCloudConnectorRequest>(
  "CreateCloudConnectorRequest",
)(
  {
    Name: S.String,
    EndpointConfig: EndpointConfig,
    Description: S.optional(S.String),
    EndpointType: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cloud-connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCloudConnectorsResponse extends S.Class<ListCloudConnectorsResponse>(
  "ListCloudConnectorsResponse",
)({ Items: S.optional(ConnectorList), NextToken: S.optional(S.String) }) {}
export class UpdateConnectorDestinationRequest extends S.Class<UpdateConnectorDestinationRequest>(
  "UpdateConnectorDestinationRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Description: S.optional(S.String),
    Name: S.optional(S.String),
    AuthType: S.optional(S.String),
    AuthConfig: S.optional(AuthConfigUpdate),
    SecretsManager: S.optional(SecretsManager),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/connector-destinations/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConnectorDestinationResponse extends S.Class<UpdateConnectorDestinationResponse>(
  "UpdateConnectorDestinationResponse",
)({}) {}
export class ListConnectorDestinationsResponse extends S.Class<ListConnectorDestinationsResponse>(
  "ListConnectorDestinationsResponse",
)({
  ConnectorDestinationList: S.optional(ConnectorDestinationListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListCredentialLockersResponse extends S.Class<ListCredentialLockersResponse>(
  "ListCredentialLockersResponse",
)({
  Items: S.optional(CredentialLockerListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListDestinationsResponse extends S.Class<ListDestinationsResponse>(
  "ListDestinationsResponse",
)({
  DestinationList: S.optional(DestinationListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class StartDeviceDiscoveryResponse extends S.Class<StartDeviceDiscoveryResponse>(
  "StartDeviceDiscoveryResponse",
)({
  Id: S.optional(S.String),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListDeviceDiscoveriesResponse extends S.Class<ListDeviceDiscoveriesResponse>(
  "ListDeviceDiscoveriesResponse",
)({
  Items: S.optional(DeviceDiscoveryListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListDiscoveredDevicesResponse extends S.Class<ListDiscoveredDevicesResponse>(
  "ListDiscoveredDevicesResponse",
)({
  Items: S.optional(DiscoveredDeviceListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListEventLogConfigurationsResponse extends S.Class<ListEventLogConfigurationsResponse>(
  "ListEventLogConfigurationsResponse",
)({
  EventLogConfigurationList: S.optional(EventLogConfigurationListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class GetDefaultEncryptionConfigurationResponse extends S.Class<GetDefaultEncryptionConfigurationResponse>(
  "GetDefaultEncryptionConfigurationResponse",
)({
  configurationStatus: ConfigurationStatus,
  encryptionType: S.String,
  kmsKeyArn: S.optional(S.String),
}) {}
export class ListManagedThingAccountAssociationsResponse extends S.Class<ListManagedThingAccountAssociationsResponse>(
  "ListManagedThingAccountAssociationsResponse",
)({
  Items: S.optional(ManagedThingAssociationList),
  NextToken: S.optional(S.String),
}) {}
export class ListManagedThingsResponse extends S.Class<ListManagedThingsResponse>(
  "ListManagedThingsResponse",
)({
  Items: S.optional(ManagedThingListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListManagedThingSchemasResponse extends S.Class<ListManagedThingSchemasResponse>(
  "ListManagedThingSchemasResponse",
)({
  Items: S.optional(ManagedThingSchemaListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListNotificationConfigurationsResponse extends S.Class<ListNotificationConfigurationsResponse>(
  "ListNotificationConfigurationsResponse",
)({
  NotificationConfigurationList: S.optional(
    NotificationConfigurationListDefinition,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListOtaTaskConfigurationsResponse extends S.Class<ListOtaTaskConfigurationsResponse>(
  "ListOtaTaskConfigurationsResponse",
)({
  Items: S.optional(OtaTaskConfigurationListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class CreateOtaTaskRequest extends S.Class<CreateOtaTaskRequest>(
  "CreateOtaTaskRequest",
)(
  {
    Description: S.optional(S.String),
    S3Url: S.String,
    Protocol: S.optional(S.String),
    Target: S.optional(Target),
    TaskConfigurationId: S.optional(S.String),
    OtaMechanism: S.optional(S.String),
    OtaType: S.String,
    OtaTargetQueryString: S.optional(S.String),
    ClientToken: S.optional(S.String),
    OtaSchedulingConfig: S.optional(OtaTaskSchedulingConfig),
    OtaTaskExecutionRetryConfig: S.optional(OtaTaskExecutionRetryConfig),
    Tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ota-tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOtaTaskResponse extends S.Class<GetOtaTaskResponse>(
  "GetOtaTaskResponse",
)({
  TaskId: S.optional(S.String),
  TaskArn: S.optional(S.String),
  Description: S.optional(S.String),
  S3Url: S.optional(S.String),
  Protocol: S.optional(S.String),
  OtaType: S.optional(S.String),
  OtaTargetQueryString: S.optional(S.String),
  OtaMechanism: S.optional(S.String),
  Target: S.optional(Target),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TaskConfigurationId: S.optional(S.String),
  TaskProcessingDetails: S.optional(TaskProcessingDetails),
  OtaSchedulingConfig: S.optional(OtaTaskSchedulingConfig),
  OtaTaskExecutionRetryConfig: S.optional(OtaTaskExecutionRetryConfig),
  Status: S.optional(S.String),
  Tags: S.optional(TagsMap),
}) {}
export class ListOtaTasksResponse extends S.Class<ListOtaTasksResponse>(
  "ListOtaTasksResponse",
)({
  Tasks: S.optional(OtaTaskListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListProvisioningProfilesResponse extends S.Class<ListProvisioningProfilesResponse>(
  "ListProvisioningProfilesResponse",
)({
  Items: S.optional(ProvisioningProfileListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListSchemaVersionsResponse extends S.Class<ListSchemaVersionsResponse>(
  "ListSchemaVersionsResponse",
)({ Items: S.optional(SchemaVersionList), NextToken: S.optional(S.String) }) {}
export class MatterCluster extends S.Class<MatterCluster>("MatterCluster")({
  id: S.optional(S.String),
  attributes: S.optional(S.Any),
  commands: S.optional(MatterCommands),
  events: S.optional(MatterEvents),
}) {}
export const MatterClusters = S.Array(MatterCluster);
export class CommandCapability extends S.Class<CommandCapability>(
  "CommandCapability",
)({
  id: S.String,
  name: S.String,
  version: S.String,
  actions: CapabilityActions,
}) {}
export const CommandCapabilities = S.Array(CommandCapability);
export class StateCapability extends S.Class<StateCapability>(
  "StateCapability",
)({
  id: S.String,
  name: S.String,
  version: S.String,
  properties: S.optional(S.Any),
}) {}
export const StateCapabilities = S.Array(StateCapability);
export class OtaTaskExecutionSummary extends S.Class<OtaTaskExecutionSummary>(
  "OtaTaskExecutionSummary",
)({
  ExecutionNumber: S.optional(S.Number),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  QueuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RetryAttempt: S.optional(S.Number),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
}) {}
export class MatterEndpoint extends S.Class<MatterEndpoint>("MatterEndpoint")({
  id: S.optional(S.String),
  clusters: S.optional(MatterClusters),
}) {}
export class CommandEndpoint extends S.Class<CommandEndpoint>(
  "CommandEndpoint",
)({ endpointId: S.String, capabilities: CommandCapabilities }) {}
export const CommandEndpoints = S.Array(CommandEndpoint);
export class StateEndpoint extends S.Class<StateEndpoint>("StateEndpoint")({
  endpointId: S.String,
  capabilities: StateCapabilities,
}) {}
export const StateEndpoints = S.Array(StateEndpoint);
export class OtaTaskExecutionSummaries extends S.Class<OtaTaskExecutionSummaries>(
  "OtaTaskExecutionSummaries",
)({
  TaskExecutionSummary: S.optional(OtaTaskExecutionSummary),
  ManagedThingId: S.optional(S.String),
}) {}
export const OtaTaskExecutionSummariesListDefinition = S.Array(
  OtaTaskExecutionSummaries,
);
export class MatterCapabilityReportAttribute extends S.Class<MatterCapabilityReportAttribute>(
  "MatterCapabilityReportAttribute",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  value: S.optional(S.Any),
}) {}
export const MatterCapabilityReportAttributes = S.Array(
  MatterCapabilityReportAttribute,
);
export class CreateCloudConnectorResponse extends S.Class<CreateCloudConnectorResponse>(
  "CreateCloudConnectorResponse",
)({ Id: S.optional(S.String) }) {}
export class CreateConnectorDestinationRequest extends S.Class<CreateConnectorDestinationRequest>(
  "CreateConnectorDestinationRequest",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CloudConnectorId: S.String,
    AuthType: S.String,
    AuthConfig: AuthConfig,
    SecretsManager: SecretsManager,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/connector-destinations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendManagedThingCommandRequest extends S.Class<SendManagedThingCommandRequest>(
  "SendManagedThingCommandRequest",
)(
  {
    ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")),
    Endpoints: CommandEndpoints,
    ConnectorAssociationId: S.optional(S.String),
    AccountAssociationId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/managed-things-command/{ManagedThingId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateManagedThingRequest extends S.Class<CreateManagedThingRequest>(
  "CreateManagedThingRequest",
)(
  {
    Role: S.String,
    Owner: S.optional(S.String),
    CredentialLockerId: S.optional(S.String),
    AuthenticationMaterial: S.String,
    AuthenticationMaterialType: S.String,
    SerialNumber: S.optional(S.String),
    Brand: S.optional(S.String),
    Model: S.optional(S.String),
    Name: S.optional(S.String),
    CapabilityReport: S.optional(CapabilityReport),
    CapabilitySchemas: S.optional(CapabilitySchemas),
    Capabilities: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Classification: S.optional(S.String),
    Tags: S.optional(TagsMap),
    MetaData: S.optional(MetaData),
  },
  T.all(
    T.Http({ method: "POST", uri: "/managed-things" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedThingStateResponse extends S.Class<GetManagedThingStateResponse>(
  "GetManagedThingStateResponse",
)({ Endpoints: StateEndpoints }) {}
export class CreateOtaTaskResponse extends S.Class<CreateOtaTaskResponse>(
  "CreateOtaTaskResponse",
)({
  TaskId: S.optional(S.String),
  TaskArn: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class ListOtaTaskExecutionsResponse extends S.Class<ListOtaTaskExecutionsResponse>(
  "ListOtaTaskExecutionsResponse",
)({
  ExecutionSummaries: S.optional(OtaTaskExecutionSummariesListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class MatterCapabilityReportCluster extends S.Class<MatterCapabilityReportCluster>(
  "MatterCapabilityReportCluster",
)({
  id: S.String,
  revision: S.Number,
  publicId: S.optional(S.String),
  name: S.optional(S.String),
  specVersion: S.optional(S.String),
  attributes: S.optional(MatterCapabilityReportAttributes),
  commands: S.optional(MatterCapabilityReportCommands),
  events: S.optional(MatterCapabilityReportEvents),
  featureMap: S.optional(S.Number),
  generatedCommands: S.optional(MatterCapabilityReportGeneratedCommands),
  fabricIndex: S.optional(S.Number),
}) {}
export const MatterCapabilityReportClusters = S.Array(
  MatterCapabilityReportCluster,
);
export class MatterCapabilityReportEndpoint extends S.Class<MatterCapabilityReportEndpoint>(
  "MatterCapabilityReportEndpoint",
)({
  id: S.String,
  deviceTypes: DeviceTypes,
  clusters: MatterCapabilityReportClusters,
  parts: S.optional(MatterCapabilityReportEndpointParts),
  semanticTags: S.optional(MatterCapabilityReportEndpointSemanticTags),
  clientClusters: S.optional(MatterCapabilityReportEndpointClientClusters),
}) {}
export const MatterCapabilityReportEndpoints = S.Array(
  MatterCapabilityReportEndpoint,
);
export class CreateConnectorDestinationResponse extends S.Class<CreateConnectorDestinationResponse>(
  "CreateConnectorDestinationResponse",
)({ Id: S.optional(S.String) }) {}
export class SendManagedThingCommandResponse extends S.Class<SendManagedThingCommandResponse>(
  "SendManagedThingCommandResponse",
)({ TraceId: S.optional(S.String) }) {}
export class CreateManagedThingResponse extends S.Class<CreateManagedThingResponse>(
  "CreateManagedThingResponse",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateOtaTaskConfigurationRequest extends S.Class<CreateOtaTaskConfigurationRequest>(
  "CreateOtaTaskConfigurationRequest",
)(
  {
    Description: S.optional(S.String),
    Name: S.optional(S.String),
    PushConfig: S.optional(PushConfig),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ota-task-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MatterCapabilityReport extends S.Class<MatterCapabilityReport>(
  "MatterCapabilityReport",
)({
  version: S.String,
  nodeId: S.optional(S.String),
  endpoints: MatterCapabilityReportEndpoints,
}) {}
export class Device extends S.Class<Device>("Device")({
  ConnectorDeviceId: S.String,
  ConnectorDeviceName: S.optional(S.String),
  CapabilityReport: MatterCapabilityReport,
  CapabilitySchemas: S.optional(CapabilitySchemas),
  DeviceMetadata: S.optional(S.Any),
}) {}
export const Devices = S.Array(Device);
export class SendConnectorEventRequest extends S.Class<SendConnectorEventRequest>(
  "SendConnectorEventRequest",
)(
  {
    ConnectorId: S.String.pipe(T.HttpLabel("ConnectorId")),
    UserId: S.optional(S.String),
    Operation: S.String,
    OperationVersion: S.optional(S.String),
    StatusCode: S.optional(S.Number),
    Message: S.optional(S.String),
    DeviceDiscoveryId: S.optional(S.String),
    ConnectorDeviceId: S.optional(S.String),
    TraceId: S.optional(S.String),
    Devices: S.optional(Devices),
    MatterEndpoint: S.optional(MatterEndpoint),
  },
  T.all(
    T.Http({ method: "POST", uri: "/connector-event/{ConnectorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOtaTaskConfigurationResponse extends S.Class<CreateOtaTaskConfigurationResponse>(
  "CreateOtaTaskConfigurationResponse",
)({ TaskConfigurationId: S.optional(S.String) }) {}
export class SendConnectorEventResponse extends S.Class<SendConnectorEventResponse>(
  "SendConnectorEventResponse",
)({ ConnectorId: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns a list of connectors filtered by its Lambda Amazon Resource Name (ARN) and `type`.
 */
export const listCloudConnectors =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCloudConnectorsRequest,
    output: ListCloudConnectorsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns the managed thing state for the given device Id.
 */
export const getManagedThingState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetManagedThingStateRequest,
    output: GetManagedThingStateResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * List all of the over-the-air (OTA) task executions.
 */
export const listOtaTaskExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOtaTaskExecutionsRequest,
    output: ListOtaTaskExecutionsResponse,
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
      items: "ExecutionSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Create a credential locker.
 *
 * This operation will not trigger the creation of all the manufacturing resources.
 */
export const createCredentialLocker = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCredentialLockerRequest,
    output: CreateCredentialLockerResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Delete the over-the-air (OTA) task.
 */
export const deleteOtaTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOtaTaskRequest,
  output: DeleteOtaTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the properties of an existing connector destination.
 */
export const updateConnectorDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConnectorDestinationRequest,
    output: UpdateConnectorDestinationResponse,
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
 * Get details of the over-the-air (OTA) task by its task id.
 */
export const getOtaTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOtaTaskRequest,
  output: GetOtaTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all of the over-the-air (OTA) tasks.
 */
export const listOtaTasks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListOtaTasksRequest,
    output: ListOtaTasksResponse,
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
      items: "Tasks",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Get an account association for an Amazon Web Services account linked to a customer-managed destination.
 */
export const getAccountAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccountAssociationRequest,
    output: GetAccountAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Initiates a refresh of an existing account association to update its authorization and connection status.
 */
export const startAccountAssociationRefresh =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartAccountAssociationRefreshRequest,
    output: StartAccountAssociationRefreshResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Get configuration details for a cloud connector.
 */
export const getCloudConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCloudConnectorRequest,
  output: GetCloudConnectorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get connector destination details linked to a cloud-to-cloud (C2C) connector.
 */
export const getConnectorDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConnectorDestinationRequest,
    output: GetConnectorDestinationResponse,
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
 * Get information on an existing credential locker
 */
export const getCredentialLocker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCredentialLockerRequest,
  output: GetCredentialLockerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a destination by name.
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
 * Get an event log configuration.
 */
export const getEventLogConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEventLogConfigurationRequest,
    output: GetEventLogConfigurationResponse,
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
 * Update a hub configuration.
 */
export const putHubConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutHubConfigurationRequest,
  output: PutHubConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Registers an account association with a managed thing, establishing a connection between a device and a third-party account.
 */
export const registerAccountAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterAccountAssociationRequest,
    output: RegisterAccountAssociationResponse,
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
 * Get a notification configuration for a specified event type.
 */
export const getNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetNotificationConfigurationRequest,
    output: GetNotificationConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Get a configuraiton for the over-the-air (OTA) task.
 */
export const getOtaTaskConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOtaTaskConfigurationRequest,
    output: GetOtaTaskConfigurationResponse,
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
 * Get the runtime log configuration for a specific managed thing.
 */
export const getRuntimeLogConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRuntimeLogConfigurationRequest,
    output: GetRuntimeLogConfigurationResponse,
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
 * Set the runtime log configuration for a specific managed thing or for all managed things as a group.
 */
export const putRuntimeLogConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRuntimeLogConfigurationRequest,
    output: PutRuntimeLogConfigurationResponse,
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
 * Gets a schema version with the provided information.
 */
export const getSchemaVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaVersionRequest,
  output: GetSchemaVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the properties of an existing account association.
 */
export const updateAccountAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountAssociationRequest,
    output: UpdateAccountAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Remove a third-party account association for an end user.
 *
 * You must first call the `DeregisterAccountAssociation` to remove the connection between the managed thing and the third-party account before calling the `DeleteAccountAssociation` API.
 */
export const deleteAccountAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAccountAssociationRequest,
    output: DeleteAccountAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Delete a connector destination linked to a cloud-to-cloud (C2C) connector.
 *
 * Deletion can't be done if the account association has used this connector destination.
 */
export const deleteConnectorDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConnectorDestinationRequest,
    output: DeleteConnectorDestinationResponse,
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
 * Delete a credential locker.
 *
 * This operation can't be undone and any existing device won't be able to use IoT managed integrations.
 */
export const deleteCredentialLocker = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCredentialLockerRequest,
    output: DeleteCredentialLockerResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a notification destination specified by name.
 */
export const deleteDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDestinationRequest,
  output: DeleteDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a destination specified by name.
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
 * Delete an event log configuration.
 */
export const deleteEventLogConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventLogConfigurationRequest,
    output: DeleteEventLogConfigurationResponse,
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
 * Update an event log configuration by log configuration ID.
 */
export const updateEventLogConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEventLogConfigurationRequest,
    output: UpdateEventLogConfigurationResponse,
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
 * Get a hub configuration.
 */
export const getHubConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHubConfigurationRequest,
  output: GetHubConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deregister an account association from a managed thing.
 */
export const deregisterAccountAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterAccountAssociationRequest,
    output: DeregisterAccountAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes a notification configuration.
 */
export const deleteNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteNotificationConfigurationRequest,
    output: DeleteNotificationConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Update a notification configuration.
 */
export const updateNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateNotificationConfigurationRequest,
    output: UpdateNotificationConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Delete the over-the-air (OTA) task configuration.
 */
export const deleteOtaTaskConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOtaTaskConfigurationRequest,
    output: DeleteOtaTaskConfigurationResponse,
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
 * Update an over-the-air (OTA) task.
 */
export const updateOtaTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOtaTaskRequest,
  output: UpdateOtaTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Reset a runtime log configuration for a specific managed thing.
 */
export const resetRuntimeLogConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ResetRuntimeLogConfigurationRequest,
    output: ResetRuntimeLogConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * List information on an existing credential locker.
 */
export const listCredentialLockers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCredentialLockersRequest,
    output: ListCredentialLockersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists schema versions with the provided information.
 */
export const listSchemaVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSchemaVersionsRequest,
    output: ListSchemaVersionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all connector destinations, with optional filtering by cloud connector ID.
 */
export const listConnectorDestinations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListConnectorDestinationsRequest,
    output: ListConnectorDestinationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ConnectorDestinationList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * List all notification destinations.
 */
export const listDestinations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDestinationsRequest,
    output: ListDestinationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DestinationList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * List all event log configurations for an account.
 */
export const listEventLogConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEventLogConfigurationsRequest,
    output: ListEventLogConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "EventLogConfigurationList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all account associations for a specific managed thing.
 */
export const listManagedThingAccountAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedThingAccountAssociationsRequest,
    output: ListManagedThingAccountAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * List all notification configurations.
 */
export const listNotificationConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListNotificationConfigurationsRequest,
    output: ListNotificationConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "NotificationConfigurationList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * List all of the over-the-air (OTA) task configurations.
 */
export const listOtaTaskConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOtaTaskConfigurationsRequest,
    output: ListOtaTaskConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Create a notification destination such as Kinesis Data Streams that receive events and notifications from Managed integrations. Managed integrations uses the destination to determine where to deliver notifications.
 */
export const createDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDestinationRequest,
  output: CreateDestinationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a notification configuration. A configuration is a connection between an event type and a destination that you have already created.
 */
export const createNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateNotificationConfigurationRequest,
    output: CreateNotificationConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists all account associations, with optional filtering by connector destination ID.
 */
export const listAccountAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAccountAssociationsRequest,
    output: ListAccountAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Creates a C2C (cloud-to-cloud) connector.
 */
export const createCloudConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCloudConnectorRequest,
    output: CreateCloudConnectorResponse,
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
 * Set the event log configuration for the account, resource type, or specific resource.
 */
export const createEventLogConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEventLogConfigurationRequest,
    output: CreateEventLogConfigurationResponse,
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
 * Create an over-the-air (OTA) task to target a device.
 */
export const createOtaTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOtaTaskRequest,
  output: CreateOtaTaskResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * List tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * This API is used to start device discovery for hub-connected and third-party-connected devices. The authentication material (install code) is delivered as a message to the controller instructing it to start the discovery.
 */
export const startDeviceDiscovery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartDeviceDiscoveryRequest,
    output: StartDeviceDiscoveryResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all devices discovered during a specific device discovery task.
 */
export const listDiscoveredDevices =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDiscoveredDevicesRequest,
    output: ListDiscoveredDevicesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Sets the default encryption configuration for the Amazon Web Services account. For more information, see Key management in the AWS IoT SiteWise User Guide.
 */
export const putDefaultEncryptionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutDefaultEncryptionConfigurationRequest,
    output: PutDefaultEncryptionConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * List schemas associated with a managed thing.
 */
export const listManagedThingSchemas =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedThingSchemasRequest,
    output: ListManagedThingSchemasResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Creates a new account association via the destination id.
 */
export const createAccountAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAccountAssociationRequest,
    output: CreateAccountAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Get the current state of a device discovery.
 */
export const getDeviceDiscovery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceDiscoveryRequest,
  output: GetDeviceDiscoveryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Get details of a managed thing including its attributes and capabilities.
 */
export const getManagedThing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetManagedThingRequest,
  output: GetManagedThingResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Get the capabilities for a managed thing using the device ID.
 */
export const getManagedThingCapabilities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetManagedThingCapabilitiesRequest,
    output: GetManagedThingCapabilitiesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the certificate PEM for a managed IoT thing.
 */
export const getManagedThingCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetManagedThingCertificateRequest,
    output: GetManagedThingCertificateResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Get the connectivity status of a managed thing.
 */
export const getManagedThingConnectivityData =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetManagedThingConnectivityDataRequest,
    output: GetManagedThingConnectivityDataResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Get the metadata information for a managed thing.
 *
 * The `managedThing` `metadata` parameter is used for associating attributes with a `managedThing` that can be used for grouping over-the-air (OTA) tasks. Name value pairs in `metadata` can be used in the `OtaTargetQueryString` parameter for the `CreateOtaTask` API operation.
 */
export const getManagedThingMetaData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetManagedThingMetaDataRequest,
    output: GetManagedThingMetaDataResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Create a provisioning profile for a device to execute the provisioning flows using a provisioning template. The provisioning template is a document that defines the set of resources and policies applied to a device during the provisioning process.
 */
export const createProvisioningProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProvisioningProfileRequest,
    output: CreateProvisioningProfileResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Get a provisioning profile by template name.
 */
export const getProvisioningProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetProvisioningProfileRequest,
    output: GetProvisioningProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Update an existing cloud connector.
 */
export const updateCloudConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCloudConnectorRequest,
    output: UpdateCloudConnectorResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Delete a cloud connector.
 */
export const deleteCloudConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCloudConnectorRequest,
    output: DeleteCloudConnectorResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Update the attributes and capabilities associated with a managed thing.
 */
export const updateManagedThing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateManagedThingRequest,
  output: UpdateManagedThingResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Delete a managed thing. For direct-connected and hub-connected devices connecting with Managed integrations via a controller, all of the devices connected to it will have their status changed to `PENDING`. It is not possible to remove a cloud-to-cloud device.
 */
export const deleteManagedThing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteManagedThingRequest,
  output: DeleteManagedThingResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Delete a provisioning profile.
 */
export const deleteProvisioningProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProvisioningProfileRequest,
    output: DeleteProvisioningProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Remove tags for the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConflictException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Add tags for the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConflictException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves information about the default encryption configuration for the Amazon Web Services account in the default or specified region. For more information, see Key management in the *AWS IoT SiteWise User Guide*.
 */
export const getDefaultEncryptionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDefaultEncryptionConfigurationRequest,
    output: GetDefaultEncryptionConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Lists all device discovery tasks, with optional filtering by type and status.
 */
export const listDeviceDiscoveries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDeviceDiscoveriesRequest,
    output: ListDeviceDiscoveriesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Listing all managed things with provision for filters.
 */
export const listManagedThings = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListManagedThingsRequest,
    output: ListManagedThingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * List the provisioning profiles within the Amazon Web Services account.
 */
export const listProvisioningProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProvisioningProfilesRequest,
    output: ListProvisioningProfilesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Customers can request IoT managed integrations to manage the server trust for them or bring their own external server trusts for the custom domain. Returns an IoT managed integrations endpoint.
 */
export const registerCustomEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterCustomEndpointRequest,
    output: RegisterCustomEndpointResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Returns the IoT managed integrations custom endpoint.
 */
export const getCustomEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomEndpointRequest,
  output: GetCustomEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Create a connector destination for connecting a cloud-to-cloud (C2C) connector to the customer's Amazon Web Services account.
 */
export const createConnectorDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConnectorDestinationRequest,
    output: CreateConnectorDestinationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Send the command to the device represented by the managed thing.
 */
export const sendManagedThingCommand = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendManagedThingCommandRequest,
    output: SendManagedThingCommandResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a managed thing. A managed thing contains the device identifier, protocol supported, and capabilities of the device in a data model format defined by Managed integrations.
 */
export const createManagedThing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateManagedThingRequest,
  output: CreateManagedThingResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Create a configuraiton for the over-the-air (OTA) task.
 */
export const createOtaTaskConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateOtaTaskConfigurationRequest,
    output: CreateOtaTaskConfigurationResponse,
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
 * Relays third-party device events for a connector such as a new device or a device state change event.
 */
export const sendConnectorEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendConnectorEventRequest,
  output: SendConnectorEventResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));

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

//# Newtypes
export type EndpointAddress = string;
export type IoTManagedIntegrationsResourceARN = string;
export type ConnectorId = string;
export type ThirdPartyUserId = string | Redacted.Redacted<string>;
export type ConnectorEventOperationVersion = string | Redacted.Redacted<string>;
export type ConnectorEventStatusCode = number;
export type ConnectorEventMessage = string | Redacted.Redacted<string>;
export type DeviceDiscoveryId = string;
export type ConnectorDeviceId = string | Redacted.Redacted<string>;
export type TraceId = string;
export type TagKey = string;
export type ClientToken = string;
export type ConnectorDestinationId = string;
export type AccountAssociationName = string;
export type AccountAssociationDescription = string;
export type AccountAssociationId = string;
export type MaxResults = number;
export type NextToken = string;
export type DisplayName = string;
export type CloudConnectorDescription = string;
export type CloudConnectorId = string;
export type LambdaArn = string;
export type ConnectorDestinationName = string;
export type ConnectorDestinationDescription = string;
export type CredentialLockerName = string | Redacted.Redacted<string>;
export type CredentialLockerId = string;
export type DeliveryDestinationArn = string;
export type DestinationName = string;
export type DeliveryDestinationRoleArn = string;
export type DestinationDescription = string;
export type ManagedThingId = string;
export type ConnectorAssociationId = string;
export type DiscoveryAuthMaterialString = string | Redacted.Redacted<string>;
export type SmartHomeResourceType = string;
export type SmartHomeResourceId = string;
export type LogConfigurationId = string;
export type HubTokenTimerExpirySettingInSeconds = number;
export type KmsKeyArn = string;
export type Owner = string | Redacted.Redacted<string>;
export type AuthMaterialString = string | Redacted.Redacted<string>;
export type SerialNumber = string | Redacted.Redacted<string>;
export type Brand = string | Redacted.Redacted<string>;
export type Model = string | Redacted.Redacted<string>;
export type Name = string;
export type Capabilities = string;
export type Classification = string | Redacted.Redacted<string>;
export type ParentControllerId = string;
export type ConnectorPolicyId = string;
export type EndpointId = string;
export type CapabilityId = string;
export type OtaDescription = string;
export type OtaTaskConfigurationName = string | Redacted.Redacted<string>;
export type OtaTaskConfigurationId = string;
export type S3Url = string;
export type OtaTargetQueryString = string;
export type OtaTaskId = string;
export type OtaNextToken = string;
export type CaCertificate = string | Redacted.Redacted<string>;
export type ProvisioningProfileName = string;
export type ProvisioningProfileId = string;
export type SchemaVersionedId = string;
export type SchemaId = string;
export type SchemaVersionNamespaceName = string;
export type SchemaVersionVersion = string;
export type ConnectorDeviceName = string | Redacted.Redacted<string>;
export type TagValue = string;
export type SecretsManagerArn = string;
export type SecretsManagerVersionId = string;
export type CustomProtocolDetailKey = string;
export type CustomProtocolDetailValue = string;
export type CapabilityReportVersion = string;
export type NodeId = string;
export type ExtrinsicSchemaId = string;
export type MatterCapabilityReportClusterRevisionId = number;
export type AttributeName = string;
export type AttributeValue = string;
export type EndTime = string;
export type ScheduleStartTime = string;
export type LocalStoreLocation = string;
export type LocalStoreFileRotationMaxFiles = number;
export type LocalStoreFileRotationMaxBytes = number;
export type UploadPeriodMinutes = number;
export type ErrorMessage = string;
export type OAuthAuthorizationUrl = string | Redacted.Redacted<string>;
export type AccountAssociationArn = string;
export type AccountAssociationErrorMessage = string;
export type OAuthCompleteRedirectUrl = string;
export type CredentialLockerArn = string;
export type DeviceDiscoveryArn = string;
export type ManagedThingArn = string;
export type AdvertisedProductId = string;
export type UniversalProductCode = string | Redacted.Redacted<string>;
export type InternationalArticleNumber = string | Redacted.Redacted<string>;
export type DeviceSpecificKey = string | Redacted.Redacted<string>;
export type MacAddress = string | Redacted.Redacted<string>;
export type CertificatePem = string;
export type OtaTaskArn = string;
export type ProvisioningProfileArn = string;
export type ClaimCertificate = string | Redacted.Redacted<string>;
export type ClaimCertificatePrivateKey = string | Redacted.Redacted<string>;
export type SchemaVersionDescription = string;
export type ClusterId = string;
export type AuthUrl = string;
export type TokenUrl = string;
export type ConfigurationErrorCode = string;
export type ConfigurationErrorMessage = string;
export type CapabilityName = string;
export type CapabilityVersion = string;
export type DeviceType = string;
export type MaximumPerMinute = number;
export type InProgressTimeoutInMinutes = number;
export type DurationInMinutes = number;
export type StartTime = string;
export type MinNumberOfRetries = number;
export type EndpointSemanticTag = string;
export type MatterCommandId = string;
export type MatterEventId = string;
export type CapabilityActionName = string;
export type ActionReference = string;
export type ActionTraceId = string;
export type PropertyName = string;
export type ActionName = string;
export type EventName = string;
export type MinNumberOfExecutedThings = number;
export type ThresholdPercentage = number;
export type BaseRatePerMinute = number;
export type IncrementFactor = number;
export type ExecutionNumber = number;
export type RetryAttempt = number;
export type SpecVersion = string;
export type MatterCapabilityReportFeatureMap = number;
export type MatterCapabilityReportFabricIndex = number;
export type NumberOfNotifiedThings = number;
export type NumberOfSucceededThings = number;
export type ErrorResourceId = string;
export type ErrorResourceType = string;
export type MatterAttributeId = string;

//# Schemas
export interface GetCustomEndpointRequest {}
export const GetCustomEndpointRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/custom-endpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCustomEndpointRequest",
}) as any as S.Schema<GetCustomEndpointRequest>;
export interface RegisterCustomEndpointRequest {}
export const RegisterCustomEndpointRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/custom-endpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterCustomEndpointRequest",
}) as any as S.Schema<RegisterCustomEndpointRequest>;
export interface GetHubConfigurationRequest {}
export const GetHubConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/hub-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHubConfigurationRequest",
}) as any as S.Schema<GetHubConfigurationRequest>;
export interface GetDefaultEncryptionConfigurationRequest {}
export const GetDefaultEncryptionConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configuration/account/encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDefaultEncryptionConfigurationRequest",
}) as any as S.Schema<GetDefaultEncryptionConfigurationRequest>;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type Target = string[];
export const Target = S.Array(S.String);
export interface GetCustomEndpointResponse {
  EndpointAddress: string;
}
export const GetCustomEndpointResponse = S.suspend(() =>
  S.Struct({ EndpointAddress: S.String }),
).annotations({
  identifier: "GetCustomEndpointResponse",
}) as any as S.Schema<GetCustomEndpointResponse>;
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
export interface RegisterCustomEndpointResponse {
  EndpointAddress: string;
}
export const RegisterCustomEndpointResponse = S.suspend(() =>
  S.Struct({ EndpointAddress: S.String }),
).annotations({
  identifier: "RegisterCustomEndpointResponse",
}) as any as S.Schema<RegisterCustomEndpointResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface CreateAccountAssociationRequest {
  ClientToken?: string;
  ConnectorDestinationId: string;
  Name?: string;
  Description?: string;
  Tags?: TagsMap;
}
export const CreateAccountAssociationRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    ConnectorDestinationId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/account-associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccountAssociationRequest",
}) as any as S.Schema<CreateAccountAssociationRequest>;
export interface GetAccountAssociationRequest {
  AccountAssociationId: string;
}
export const GetAccountAssociationRequest = S.suspend(() =>
  S.Struct({
    AccountAssociationId: S.String.pipe(T.HttpLabel("AccountAssociationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetAccountAssociationRequest",
}) as any as S.Schema<GetAccountAssociationRequest>;
export interface UpdateAccountAssociationRequest {
  AccountAssociationId: string;
  Name?: string;
  Description?: string;
}
export const UpdateAccountAssociationRequest = S.suspend(() =>
  S.Struct({
    AccountAssociationId: S.String.pipe(T.HttpLabel("AccountAssociationId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateAccountAssociationRequest",
}) as any as S.Schema<UpdateAccountAssociationRequest>;
export interface UpdateAccountAssociationResponse {}
export const UpdateAccountAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAccountAssociationResponse",
}) as any as S.Schema<UpdateAccountAssociationResponse>;
export interface DeleteAccountAssociationRequest {
  AccountAssociationId: string;
}
export const DeleteAccountAssociationRequest = S.suspend(() =>
  S.Struct({
    AccountAssociationId: S.String.pipe(T.HttpLabel("AccountAssociationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteAccountAssociationRequest",
}) as any as S.Schema<DeleteAccountAssociationRequest>;
export interface DeleteAccountAssociationResponse {}
export const DeleteAccountAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccountAssociationResponse",
}) as any as S.Schema<DeleteAccountAssociationResponse>;
export interface ListAccountAssociationsRequest {
  ConnectorDestinationId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAccountAssociationsRequest = S.suspend(() =>
  S.Struct({
    ConnectorDestinationId: S.optional(S.String).pipe(
      T.HttpQuery("ConnectorDestinationId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/account-associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccountAssociationsRequest",
}) as any as S.Schema<ListAccountAssociationsRequest>;
export interface StartAccountAssociationRefreshRequest {
  AccountAssociationId: string;
}
export const StartAccountAssociationRefreshRequest = S.suspend(() =>
  S.Struct({
    AccountAssociationId: S.String.pipe(T.HttpLabel("AccountAssociationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartAccountAssociationRefreshRequest",
}) as any as S.Schema<StartAccountAssociationRefreshRequest>;
export interface GetCloudConnectorRequest {
  Identifier: string;
}
export const GetCloudConnectorRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cloud-connectors/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCloudConnectorRequest",
}) as any as S.Schema<GetCloudConnectorRequest>;
export interface UpdateCloudConnectorRequest {
  Identifier: string;
  Name?: string;
  Description?: string;
}
export const UpdateCloudConnectorRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/cloud-connectors/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCloudConnectorRequest",
}) as any as S.Schema<UpdateCloudConnectorRequest>;
export interface UpdateCloudConnectorResponse {}
export const UpdateCloudConnectorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCloudConnectorResponse",
}) as any as S.Schema<UpdateCloudConnectorResponse>;
export interface DeleteCloudConnectorRequest {
  Identifier: string;
}
export const DeleteCloudConnectorRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/cloud-connectors/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCloudConnectorRequest",
}) as any as S.Schema<DeleteCloudConnectorRequest>;
export interface DeleteCloudConnectorResponse {}
export const DeleteCloudConnectorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCloudConnectorResponse",
}) as any as S.Schema<DeleteCloudConnectorResponse>;
export interface ListCloudConnectorsRequest {
  Type?: string;
  LambdaArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCloudConnectorsRequest = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String).pipe(T.HttpQuery("Type")),
    LambdaArn: S.optional(S.String).pipe(T.HttpQuery("LambdaArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cloud-connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCloudConnectorsRequest",
}) as any as S.Schema<ListCloudConnectorsRequest>;
export interface GetConnectorDestinationRequest {
  Identifier: string;
}
export const GetConnectorDestinationRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connector-destinations/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectorDestinationRequest",
}) as any as S.Schema<GetConnectorDestinationRequest>;
export interface DeleteConnectorDestinationRequest {
  Identifier: string;
}
export const DeleteConnectorDestinationRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/connector-destinations/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectorDestinationRequest",
}) as any as S.Schema<DeleteConnectorDestinationRequest>;
export interface DeleteConnectorDestinationResponse {}
export const DeleteConnectorDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectorDestinationResponse",
}) as any as S.Schema<DeleteConnectorDestinationResponse>;
export interface ListConnectorDestinationsRequest {
  CloudConnectorId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListConnectorDestinationsRequest = S.suspend(() =>
  S.Struct({
    CloudConnectorId: S.optional(S.String).pipe(
      T.HttpQuery("CloudConnectorId"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connector-destinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectorDestinationsRequest",
}) as any as S.Schema<ListConnectorDestinationsRequest>;
export interface CreateCredentialLockerRequest {
  Name?: string | Redacted.Redacted<string>;
  ClientToken?: string;
  Tags?: TagsMap;
}
export const CreateCredentialLockerRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/credential-lockers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCredentialLockerRequest",
}) as any as S.Schema<CreateCredentialLockerRequest>;
export interface GetCredentialLockerRequest {
  Identifier: string;
}
export const GetCredentialLockerRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/credential-lockers/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCredentialLockerRequest",
}) as any as S.Schema<GetCredentialLockerRequest>;
export interface DeleteCredentialLockerRequest {
  Identifier: string;
}
export const DeleteCredentialLockerRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/credential-lockers/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCredentialLockerRequest",
}) as any as S.Schema<DeleteCredentialLockerRequest>;
export interface DeleteCredentialLockerResponse {}
export const DeleteCredentialLockerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCredentialLockerResponse",
}) as any as S.Schema<DeleteCredentialLockerResponse>;
export interface ListCredentialLockersRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListCredentialLockersRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/credential-lockers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCredentialLockersRequest",
}) as any as S.Schema<ListCredentialLockersRequest>;
export interface CreateDestinationRequest {
  DeliveryDestinationArn: string;
  DeliveryDestinationType: string;
  Name: string;
  RoleArn: string;
  ClientToken?: string;
  Description?: string;
  Tags?: TagsMap;
}
export const CreateDestinationRequest = S.suspend(() =>
  S.Struct({
    DeliveryDestinationArn: S.String,
    DeliveryDestinationType: S.String,
    Name: S.String,
    RoleArn: S.String,
    ClientToken: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/destinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDestinationRequest",
}) as any as S.Schema<CreateDestinationRequest>;
export interface DeleteDestinationRequest {
  Name: string;
}
export const DeleteDestinationRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/destinations/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDestinationRequest",
}) as any as S.Schema<DeleteDestinationRequest>;
export interface DeleteDestinationResponse {}
export const DeleteDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDestinationResponse",
}) as any as S.Schema<DeleteDestinationResponse>;
export interface GetDestinationRequest {
  Name: string;
}
export const GetDestinationRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/destinations/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDestinationRequest",
}) as any as S.Schema<GetDestinationRequest>;
export interface ListDestinationsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListDestinationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/destinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDestinationsRequest",
}) as any as S.Schema<ListDestinationsRequest>;
export interface UpdateDestinationRequest {
  Name: string;
  DeliveryDestinationArn?: string;
  DeliveryDestinationType?: string;
  RoleArn?: string;
  Description?: string;
}
export const UpdateDestinationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    DeliveryDestinationArn: S.optional(S.String),
    DeliveryDestinationType: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/destinations/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDestinationRequest",
}) as any as S.Schema<UpdateDestinationRequest>;
export interface UpdateDestinationResponse {}
export const UpdateDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDestinationResponse",
}) as any as S.Schema<UpdateDestinationResponse>;
export interface GetDeviceDiscoveryRequest {
  Identifier: string;
}
export const GetDeviceDiscoveryRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/device-discoveries/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeviceDiscoveryRequest",
}) as any as S.Schema<GetDeviceDiscoveryRequest>;
export interface ListDeviceDiscoveriesRequest {
  NextToken?: string;
  MaxResults?: number;
  TypeFilter?: string;
  StatusFilter?: string;
}
export const ListDeviceDiscoveriesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    TypeFilter: S.optional(S.String).pipe(T.HttpQuery("TypeFilter")),
    StatusFilter: S.optional(S.String).pipe(T.HttpQuery("StatusFilter")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/device-discoveries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeviceDiscoveriesRequest",
}) as any as S.Schema<ListDeviceDiscoveriesRequest>;
export interface ListDiscoveredDevicesRequest {
  Identifier: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDiscoveredDevicesRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/device-discoveries/{Identifier}/devices",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDiscoveredDevicesRequest",
}) as any as S.Schema<ListDiscoveredDevicesRequest>;
export interface CreateEventLogConfigurationRequest {
  ResourceType: string;
  ResourceId?: string;
  EventLogLevel: string;
  ClientToken?: string;
}
export const CreateEventLogConfigurationRequest = S.suspend(() =>
  S.Struct({
    ResourceType: S.String,
    ResourceId: S.optional(S.String),
    EventLogLevel: S.String,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/event-log-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventLogConfigurationRequest",
}) as any as S.Schema<CreateEventLogConfigurationRequest>;
export interface DeleteEventLogConfigurationRequest {
  Id: string;
}
export const DeleteEventLogConfigurationRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/event-log-configurations/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventLogConfigurationRequest",
}) as any as S.Schema<DeleteEventLogConfigurationRequest>;
export interface DeleteEventLogConfigurationResponse {}
export const DeleteEventLogConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEventLogConfigurationResponse",
}) as any as S.Schema<DeleteEventLogConfigurationResponse>;
export interface GetEventLogConfigurationRequest {
  Id: string;
}
export const GetEventLogConfigurationRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/event-log-configurations/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventLogConfigurationRequest",
}) as any as S.Schema<GetEventLogConfigurationRequest>;
export interface ListEventLogConfigurationsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListEventLogConfigurationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/event-log-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventLogConfigurationsRequest",
}) as any as S.Schema<ListEventLogConfigurationsRequest>;
export interface UpdateEventLogConfigurationRequest {
  Id: string;
  EventLogLevel: string;
}
export const UpdateEventLogConfigurationRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    EventLogLevel: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/event-log-configurations/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventLogConfigurationRequest",
}) as any as S.Schema<UpdateEventLogConfigurationRequest>;
export interface UpdateEventLogConfigurationResponse {}
export const UpdateEventLogConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateEventLogConfigurationResponse",
}) as any as S.Schema<UpdateEventLogConfigurationResponse>;
export interface GetHubConfigurationResponse {
  HubTokenTimerExpirySettingInSeconds?: number;
  UpdatedAt?: Date;
}
export const GetHubConfigurationResponse = S.suspend(() =>
  S.Struct({
    HubTokenTimerExpirySettingInSeconds: S.optional(S.Number),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetHubConfigurationResponse",
}) as any as S.Schema<GetHubConfigurationResponse>;
export interface PutHubConfigurationRequest {
  HubTokenTimerExpirySettingInSeconds: number;
}
export const PutHubConfigurationRequest = S.suspend(() =>
  S.Struct({ HubTokenTimerExpirySettingInSeconds: S.Number }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/hub-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutHubConfigurationRequest",
}) as any as S.Schema<PutHubConfigurationRequest>;
export interface PutDefaultEncryptionConfigurationRequest {
  encryptionType: string;
  kmsKeyArn?: string;
}
export const PutDefaultEncryptionConfigurationRequest = S.suspend(() =>
  S.Struct({ encryptionType: S.String, kmsKeyArn: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configuration/account/encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDefaultEncryptionConfigurationRequest",
}) as any as S.Schema<PutDefaultEncryptionConfigurationRequest>;
export interface DeregisterAccountAssociationRequest {
  ManagedThingId: string;
  AccountAssociationId: string;
}
export const DeregisterAccountAssociationRequest = S.suspend(() =>
  S.Struct({ ManagedThingId: S.String, AccountAssociationId: S.String }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/managed-thing-associations/deregister" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterAccountAssociationRequest",
}) as any as S.Schema<DeregisterAccountAssociationRequest>;
export interface DeregisterAccountAssociationResponse {}
export const DeregisterAccountAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterAccountAssociationResponse",
}) as any as S.Schema<DeregisterAccountAssociationResponse>;
export interface ListManagedThingAccountAssociationsRequest {
  ManagedThingId?: string;
  AccountAssociationId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListManagedThingAccountAssociationsRequest = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.optional(S.String).pipe(T.HttpQuery("ManagedThingId")),
    AccountAssociationId: S.optional(S.String).pipe(
      T.HttpQuery("AccountAssociationId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managed-thing-associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListManagedThingAccountAssociationsRequest",
}) as any as S.Schema<ListManagedThingAccountAssociationsRequest>;
export interface RegisterAccountAssociationRequest {
  ManagedThingId: string;
  AccountAssociationId: string;
  DeviceDiscoveryId: string;
}
export const RegisterAccountAssociationRequest = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.String,
    AccountAssociationId: S.String,
    DeviceDiscoveryId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/managed-thing-associations/register" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterAccountAssociationRequest",
}) as any as S.Schema<RegisterAccountAssociationRequest>;
export interface GetManagedThingRequest {
  Identifier: string;
}
export const GetManagedThingRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managed-things/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedThingRequest",
}) as any as S.Schema<GetManagedThingRequest>;
export type DeviceTypes = string[];
export const DeviceTypes = S.Array(S.String);
export type CapabilityReportProperties = string[];
export const CapabilityReportProperties = S.Array(S.String);
export type CapabilityReportActions = string[];
export const CapabilityReportActions = S.Array(S.String);
export type CapabilityReportEvents = string[];
export const CapabilityReportEvents = S.Array(S.String);
export interface CapabilityReportCapability {
  id: string;
  name: string;
  version: string;
  properties: CapabilityReportProperties;
  actions: CapabilityReportActions;
  events: CapabilityReportEvents;
}
export const CapabilityReportCapability = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    version: S.String,
    properties: CapabilityReportProperties,
    actions: CapabilityReportActions,
    events: CapabilityReportEvents,
  }),
).annotations({
  identifier: "CapabilityReportCapability",
}) as any as S.Schema<CapabilityReportCapability>;
export type CapabilityReportCapabilities = CapabilityReportCapability[];
export const CapabilityReportCapabilities = S.Array(CapabilityReportCapability);
export interface CapabilityReportEndpoint {
  id: string;
  deviceTypes: DeviceTypes;
  capabilities: CapabilityReportCapabilities;
}
export const CapabilityReportEndpoint = S.suspend(() =>
  S.Struct({
    id: S.String,
    deviceTypes: DeviceTypes,
    capabilities: CapabilityReportCapabilities,
  }),
).annotations({
  identifier: "CapabilityReportEndpoint",
}) as any as S.Schema<CapabilityReportEndpoint>;
export type CapabilityReportEndpoints = CapabilityReportEndpoint[];
export const CapabilityReportEndpoints = S.Array(CapabilityReportEndpoint);
export interface CapabilityReport {
  version: string;
  nodeId?: string;
  endpoints: CapabilityReportEndpoints;
}
export const CapabilityReport = S.suspend(() =>
  S.Struct({
    version: S.String,
    nodeId: S.optional(S.String),
    endpoints: CapabilityReportEndpoints,
  }),
).annotations({
  identifier: "CapabilityReport",
}) as any as S.Schema<CapabilityReport>;
export interface CapabilitySchemaItem {
  Format: string;
  CapabilityId: string;
  ExtrinsicId: string;
  ExtrinsicVersion: number;
  Schema: any;
}
export const CapabilitySchemaItem = S.suspend(() =>
  S.Struct({
    Format: S.String,
    CapabilityId: S.String,
    ExtrinsicId: S.String,
    ExtrinsicVersion: S.Number,
    Schema: S.Any,
  }),
).annotations({
  identifier: "CapabilitySchemaItem",
}) as any as S.Schema<CapabilitySchemaItem>;
export type CapabilitySchemas = CapabilitySchemaItem[];
export const CapabilitySchemas = S.Array(CapabilitySchemaItem);
export type MetaData = { [key: string]: string };
export const MetaData = S.Record({ key: S.String, value: S.String });
export interface UpdateManagedThingRequest {
  Identifier: string;
  Owner?: string | Redacted.Redacted<string>;
  CredentialLockerId?: string;
  SerialNumber?: string | Redacted.Redacted<string>;
  Brand?: string | Redacted.Redacted<string>;
  Model?: string | Redacted.Redacted<string>;
  Name?: string;
  CapabilityReport?: CapabilityReport;
  CapabilitySchemas?: CapabilitySchemas;
  Capabilities?: string;
  Classification?: string | Redacted.Redacted<string>;
  HubNetworkMode?: string;
  MetaData?: MetaData;
}
export const UpdateManagedThingRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Owner: S.optional(SensitiveString),
    CredentialLockerId: S.optional(S.String),
    SerialNumber: S.optional(SensitiveString),
    Brand: S.optional(SensitiveString),
    Model: S.optional(SensitiveString),
    Name: S.optional(S.String),
    CapabilityReport: S.optional(CapabilityReport),
    CapabilitySchemas: S.optional(CapabilitySchemas),
    Capabilities: S.optional(S.String),
    Classification: S.optional(SensitiveString),
    HubNetworkMode: S.optional(S.String),
    MetaData: S.optional(MetaData),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/managed-things/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateManagedThingRequest",
}) as any as S.Schema<UpdateManagedThingRequest>;
export interface UpdateManagedThingResponse {}
export const UpdateManagedThingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateManagedThingResponse",
}) as any as S.Schema<UpdateManagedThingResponse>;
export interface DeleteManagedThingRequest {
  Identifier: string;
  Force?: boolean;
}
export const DeleteManagedThingRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Force: S.optional(S.Boolean).pipe(T.HttpQuery("Force")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/managed-things/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteManagedThingRequest",
}) as any as S.Schema<DeleteManagedThingRequest>;
export interface DeleteManagedThingResponse {}
export const DeleteManagedThingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteManagedThingResponse",
}) as any as S.Schema<DeleteManagedThingResponse>;
export interface ListManagedThingsRequest {
  OwnerFilter?: string | Redacted.Redacted<string>;
  CredentialLockerFilter?: string;
  RoleFilter?: string;
  ParentControllerIdentifierFilter?: string;
  ConnectorPolicyIdFilter?: string;
  ConnectorDestinationIdFilter?: string;
  ConnectorDeviceIdFilter?: string | Redacted.Redacted<string>;
  SerialNumberFilter?: string | Redacted.Redacted<string>;
  ProvisioningStatusFilter?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListManagedThingsRequest = S.suspend(() =>
  S.Struct({
    OwnerFilter: S.optional(SensitiveString).pipe(T.HttpQuery("OwnerFilter")),
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
    ConnectorDeviceIdFilter: S.optional(SensitiveString).pipe(
      T.HttpQuery("ConnectorDeviceIdFilter"),
    ),
    SerialNumberFilter: S.optional(SensitiveString).pipe(
      T.HttpQuery("SerialNumberFilter"),
    ),
    ProvisioningStatusFilter: S.optional(S.String).pipe(
      T.HttpQuery("ProvisioningStatusFilter"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managed-things" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListManagedThingsRequest",
}) as any as S.Schema<ListManagedThingsRequest>;
export interface GetManagedThingCapabilitiesRequest {
  Identifier: string;
}
export const GetManagedThingCapabilitiesRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/managed-things-capabilities/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedThingCapabilitiesRequest",
}) as any as S.Schema<GetManagedThingCapabilitiesRequest>;
export interface GetManagedThingCertificateRequest {
  Identifier: string;
}
export const GetManagedThingCertificateRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/managed-things-certificate/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedThingCertificateRequest",
}) as any as S.Schema<GetManagedThingCertificateRequest>;
export interface GetManagedThingConnectivityDataRequest {
  Identifier: string;
}
export const GetManagedThingConnectivityDataRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
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
  ),
).annotations({
  identifier: "GetManagedThingConnectivityDataRequest",
}) as any as S.Schema<GetManagedThingConnectivityDataRequest>;
export interface GetManagedThingMetaDataRequest {
  Identifier: string;
}
export const GetManagedThingMetaDataRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managed-things-metadata/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedThingMetaDataRequest",
}) as any as S.Schema<GetManagedThingMetaDataRequest>;
export interface ListManagedThingSchemasRequest {
  Identifier: string;
  EndpointIdFilter?: string;
  CapabilityIdFilter?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListManagedThingSchemasRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    EndpointIdFilter: S.optional(S.String).pipe(
      T.HttpQuery("EndpointIdFilter"),
    ),
    CapabilityIdFilter: S.optional(S.String).pipe(
      T.HttpQuery("CapabilityIdFilter"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managed-thing-schemas/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListManagedThingSchemasRequest",
}) as any as S.Schema<ListManagedThingSchemasRequest>;
export interface GetManagedThingStateRequest {
  ManagedThingId: string;
}
export const GetManagedThingStateRequest = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managed-thing-states/{ManagedThingId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedThingStateRequest",
}) as any as S.Schema<GetManagedThingStateRequest>;
export interface CreateNotificationConfigurationRequest {
  EventType: string;
  DestinationName: string;
  ClientToken?: string;
  Tags?: TagsMap;
}
export const CreateNotificationConfigurationRequest = S.suspend(() =>
  S.Struct({
    EventType: S.String,
    DestinationName: S.String,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/notification-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNotificationConfigurationRequest",
}) as any as S.Schema<CreateNotificationConfigurationRequest>;
export interface DeleteNotificationConfigurationRequest {
  EventType: string;
}
export const DeleteNotificationConfigurationRequest = S.suspend(() =>
  S.Struct({ EventType: S.String.pipe(T.HttpLabel("EventType")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteNotificationConfigurationRequest",
}) as any as S.Schema<DeleteNotificationConfigurationRequest>;
export interface DeleteNotificationConfigurationResponse {}
export const DeleteNotificationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteNotificationConfigurationResponse",
}) as any as S.Schema<DeleteNotificationConfigurationResponse>;
export interface GetNotificationConfigurationRequest {
  EventType: string;
}
export const GetNotificationConfigurationRequest = S.suspend(() =>
  S.Struct({ EventType: S.String.pipe(T.HttpLabel("EventType")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/notification-configurations/{EventType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetNotificationConfigurationRequest",
}) as any as S.Schema<GetNotificationConfigurationRequest>;
export interface ListNotificationConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListNotificationConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/notification-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNotificationConfigurationsRequest",
}) as any as S.Schema<ListNotificationConfigurationsRequest>;
export interface UpdateNotificationConfigurationRequest {
  EventType: string;
  DestinationName: string;
}
export const UpdateNotificationConfigurationRequest = S.suspend(() =>
  S.Struct({
    EventType: S.String.pipe(T.HttpLabel("EventType")),
    DestinationName: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/notification-configurations/{EventType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNotificationConfigurationRequest",
}) as any as S.Schema<UpdateNotificationConfigurationRequest>;
export interface UpdateNotificationConfigurationResponse {}
export const UpdateNotificationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateNotificationConfigurationResponse",
}) as any as S.Schema<UpdateNotificationConfigurationResponse>;
export interface DeleteOtaTaskConfigurationRequest {
  Identifier: string;
}
export const DeleteOtaTaskConfigurationRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/ota-task-configurations/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOtaTaskConfigurationRequest",
}) as any as S.Schema<DeleteOtaTaskConfigurationRequest>;
export interface DeleteOtaTaskConfigurationResponse {}
export const DeleteOtaTaskConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteOtaTaskConfigurationResponse",
}) as any as S.Schema<DeleteOtaTaskConfigurationResponse>;
export interface GetOtaTaskConfigurationRequest {
  Identifier: string;
}
export const GetOtaTaskConfigurationRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ota-task-configurations/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOtaTaskConfigurationRequest",
}) as any as S.Schema<GetOtaTaskConfigurationRequest>;
export interface ListOtaTaskConfigurationsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListOtaTaskConfigurationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ota-task-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOtaTaskConfigurationsRequest",
}) as any as S.Schema<ListOtaTaskConfigurationsRequest>;
export interface GetOtaTaskRequest {
  Identifier: string;
}
export const GetOtaTaskRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ota-tasks/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOtaTaskRequest",
}) as any as S.Schema<GetOtaTaskRequest>;
export interface UpdateOtaTaskRequest {
  Identifier: string;
  Description?: string;
  TaskConfigurationId?: string;
}
export const UpdateOtaTaskRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Description: S.optional(S.String),
    TaskConfigurationId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/ota-tasks/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateOtaTaskRequest",
}) as any as S.Schema<UpdateOtaTaskRequest>;
export interface UpdateOtaTaskResponse {}
export const UpdateOtaTaskResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateOtaTaskResponse",
}) as any as S.Schema<UpdateOtaTaskResponse>;
export interface DeleteOtaTaskRequest {
  Identifier: string;
}
export const DeleteOtaTaskRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/ota-tasks/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOtaTaskRequest",
}) as any as S.Schema<DeleteOtaTaskRequest>;
export interface DeleteOtaTaskResponse {}
export const DeleteOtaTaskResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteOtaTaskResponse",
}) as any as S.Schema<DeleteOtaTaskResponse>;
export interface ListOtaTasksRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListOtaTasksRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ota-tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOtaTasksRequest",
}) as any as S.Schema<ListOtaTasksRequest>;
export interface ListOtaTaskExecutionsRequest {
  Identifier: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListOtaTaskExecutionsRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ota-tasks/{Identifier}/devices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOtaTaskExecutionsRequest",
}) as any as S.Schema<ListOtaTaskExecutionsRequest>;
export interface CreateProvisioningProfileRequest {
  ProvisioningType: string;
  CaCertificate?: string | Redacted.Redacted<string>;
  Name?: string;
  ClientToken?: string;
  Tags?: TagsMap;
}
export const CreateProvisioningProfileRequest = S.suspend(() =>
  S.Struct({
    ProvisioningType: S.String,
    CaCertificate: S.optional(SensitiveString),
    Name: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/provisioning-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProvisioningProfileRequest",
}) as any as S.Schema<CreateProvisioningProfileRequest>;
export interface GetProvisioningProfileRequest {
  Identifier: string;
}
export const GetProvisioningProfileRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/provisioning-profiles/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProvisioningProfileRequest",
}) as any as S.Schema<GetProvisioningProfileRequest>;
export interface DeleteProvisioningProfileRequest {
  Identifier: string;
}
export const DeleteProvisioningProfileRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/provisioning-profiles/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProvisioningProfileRequest",
}) as any as S.Schema<DeleteProvisioningProfileRequest>;
export interface DeleteProvisioningProfileResponse {}
export const DeleteProvisioningProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProvisioningProfileResponse",
}) as any as S.Schema<DeleteProvisioningProfileResponse>;
export interface ListProvisioningProfilesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListProvisioningProfilesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/provisioning-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProvisioningProfilesRequest",
}) as any as S.Schema<ListProvisioningProfilesRequest>;
export interface GetRuntimeLogConfigurationRequest {
  ManagedThingId: string;
}
export const GetRuntimeLogConfigurationRequest = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetRuntimeLogConfigurationRequest",
}) as any as S.Schema<GetRuntimeLogConfigurationRequest>;
export interface ResetRuntimeLogConfigurationRequest {
  ManagedThingId: string;
}
export const ResetRuntimeLogConfigurationRequest = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ResetRuntimeLogConfigurationRequest",
}) as any as S.Schema<ResetRuntimeLogConfigurationRequest>;
export interface ResetRuntimeLogConfigurationResponse {}
export const ResetRuntimeLogConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ResetRuntimeLogConfigurationResponse",
}) as any as S.Schema<ResetRuntimeLogConfigurationResponse>;
export interface GetSchemaVersionRequest {
  Type: string;
  SchemaVersionedId: string;
  Format?: string;
}
export const GetSchemaVersionRequest = S.suspend(() =>
  S.Struct({
    Type: S.String.pipe(T.HttpLabel("Type")),
    SchemaVersionedId: S.String.pipe(T.HttpLabel("SchemaVersionedId")),
    Format: S.optional(S.String).pipe(T.HttpQuery("Format")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSchemaVersionRequest",
}) as any as S.Schema<GetSchemaVersionRequest>;
export interface ListSchemaVersionsRequest {
  Type: string;
  MaxResults?: number;
  NextToken?: string;
  SchemaId?: string;
  Namespace?: string;
  Visibility?: string;
  SemanticVersion?: string;
}
export const ListSchemaVersionsRequest = S.suspend(() =>
  S.Struct({
    Type: S.String.pipe(T.HttpLabel("Type")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    SchemaId: S.optional(S.String).pipe(T.HttpQuery("SchemaIdFilter")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("NamespaceFilter")),
    Visibility: S.optional(S.String).pipe(T.HttpQuery("VisibilityFilter")),
    SemanticVersion: S.optional(S.String).pipe(
      T.HttpQuery("SemanticVersionFilter"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/schema-versions/{Type}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSchemaVersionsRequest",
}) as any as S.Schema<ListSchemaVersionsRequest>;
export interface SecretsManager {
  arn: string;
  versionId: string;
}
export const SecretsManager = S.suspend(() =>
  S.Struct({ arn: S.String, versionId: S.String }),
).annotations({
  identifier: "SecretsManager",
}) as any as S.Schema<SecretsManager>;
export type CustomProtocolDetail = { [key: string]: string };
export const CustomProtocolDetail = S.Record({
  key: S.String,
  value: S.String,
});
export interface RuntimeLogConfigurations {
  LogLevel?: string;
  LogFlushLevel?: string;
  LocalStoreLocation?: string;
  LocalStoreFileRotationMaxFiles?: number;
  LocalStoreFileRotationMaxBytes?: number;
  UploadLog?: boolean;
  UploadPeriodMinutes?: number;
  DeleteLocalStoreAfterUpload?: boolean;
}
export const RuntimeLogConfigurations = S.suspend(() =>
  S.Struct({
    LogLevel: S.optional(S.String),
    LogFlushLevel: S.optional(S.String),
    LocalStoreLocation: S.optional(S.String),
    LocalStoreFileRotationMaxFiles: S.optional(S.Number),
    LocalStoreFileRotationMaxBytes: S.optional(S.Number),
    UploadLog: S.optional(S.Boolean),
    UploadPeriodMinutes: S.optional(S.Number),
    DeleteLocalStoreAfterUpload: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RuntimeLogConfigurations",
}) as any as S.Schema<RuntimeLogConfigurations>;
export interface ListTagsForResourceResponse {
  tags?: TagsMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagsMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagsMap,
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
export interface CreateAccountAssociationResponse {
  OAuthAuthorizationUrl: string | Redacted.Redacted<string>;
  AccountAssociationId: string;
  AssociationState: string;
  Arn?: string;
}
export const CreateAccountAssociationResponse = S.suspend(() =>
  S.Struct({
    OAuthAuthorizationUrl: SensitiveString,
    AccountAssociationId: S.String,
    AssociationState: S.String,
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAccountAssociationResponse",
}) as any as S.Schema<CreateAccountAssociationResponse>;
export interface GetAccountAssociationResponse {
  AccountAssociationId: string;
  AssociationState: string;
  ErrorMessage?: string;
  ConnectorDestinationId?: string;
  Name?: string;
  Description?: string;
  Arn?: string;
  OAuthAuthorizationUrl: string | Redacted.Redacted<string>;
  Tags?: TagsMap;
}
export const GetAccountAssociationResponse = S.suspend(() =>
  S.Struct({
    AccountAssociationId: S.String,
    AssociationState: S.String,
    ErrorMessage: S.optional(S.String),
    ConnectorDestinationId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Arn: S.optional(S.String),
    OAuthAuthorizationUrl: SensitiveString,
    Tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "GetAccountAssociationResponse",
}) as any as S.Schema<GetAccountAssociationResponse>;
export interface StartAccountAssociationRefreshResponse {
  OAuthAuthorizationUrl: string | Redacted.Redacted<string>;
}
export const StartAccountAssociationRefreshResponse = S.suspend(() =>
  S.Struct({ OAuthAuthorizationUrl: SensitiveString }),
).annotations({
  identifier: "StartAccountAssociationRefreshResponse",
}) as any as S.Schema<StartAccountAssociationRefreshResponse>;
export interface LambdaConfig {
  arn: string;
}
export const LambdaConfig = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({ identifier: "LambdaConfig" }) as any as S.Schema<LambdaConfig>;
export interface EndpointConfig {
  lambda?: LambdaConfig;
}
export const EndpointConfig = S.suspend(() =>
  S.Struct({ lambda: S.optional(LambdaConfig) }),
).annotations({
  identifier: "EndpointConfig",
}) as any as S.Schema<EndpointConfig>;
export interface GetCloudConnectorResponse {
  Name: string;
  EndpointConfig: EndpointConfig;
  Description?: string;
  EndpointType?: string;
  Id?: string;
  Type?: string;
}
export const GetCloudConnectorResponse = S.suspend(() =>
  S.Struct({
    Name: S.String,
    EndpointConfig: EndpointConfig,
    Description: S.optional(S.String),
    EndpointType: S.optional(S.String),
    Id: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCloudConnectorResponse",
}) as any as S.Schema<GetCloudConnectorResponse>;
export interface ProactiveRefreshTokenRenewal {
  enabled?: boolean;
  DaysBeforeRenewal?: number;
}
export const ProactiveRefreshTokenRenewal = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    DaysBeforeRenewal: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProactiveRefreshTokenRenewal",
}) as any as S.Schema<ProactiveRefreshTokenRenewal>;
export interface OAuthConfig {
  authUrl: string;
  tokenUrl: string;
  scope?: string;
  tokenEndpointAuthenticationScheme: string;
  oAuthCompleteRedirectUrl?: string;
  proactiveRefreshTokenRenewal?: ProactiveRefreshTokenRenewal;
}
export const OAuthConfig = S.suspend(() =>
  S.Struct({
    authUrl: S.String,
    tokenUrl: S.String,
    scope: S.optional(S.String),
    tokenEndpointAuthenticationScheme: S.String,
    oAuthCompleteRedirectUrl: S.optional(S.String),
    proactiveRefreshTokenRenewal: S.optional(ProactiveRefreshTokenRenewal),
  }),
).annotations({ identifier: "OAuthConfig" }) as any as S.Schema<OAuthConfig>;
export interface AuthConfig {
  oAuth?: OAuthConfig;
}
export const AuthConfig = S.suspend(() =>
  S.Struct({ oAuth: S.optional(OAuthConfig) }),
).annotations({ identifier: "AuthConfig" }) as any as S.Schema<AuthConfig>;
export interface GetConnectorDestinationResponse {
  Name?: string;
  Description?: string;
  CloudConnectorId?: string;
  Id?: string;
  AuthType?: string;
  AuthConfig?: AuthConfig;
  SecretsManager?: SecretsManager;
  OAuthCompleteRedirectUrl?: string;
}
export const GetConnectorDestinationResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CloudConnectorId: S.optional(S.String),
    Id: S.optional(S.String),
    AuthType: S.optional(S.String),
    AuthConfig: S.optional(AuthConfig),
    SecretsManager: S.optional(SecretsManager),
    OAuthCompleteRedirectUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "GetConnectorDestinationResponse",
}) as any as S.Schema<GetConnectorDestinationResponse>;
export interface CreateCredentialLockerResponse {
  Id?: string;
  Arn?: string;
  CreatedAt?: Date;
}
export const CreateCredentialLockerResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateCredentialLockerResponse",
}) as any as S.Schema<CreateCredentialLockerResponse>;
export interface GetCredentialLockerResponse {
  Id?: string;
  Arn?: string;
  Name?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  Tags?: TagsMap;
}
export const GetCredentialLockerResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "GetCredentialLockerResponse",
}) as any as S.Schema<GetCredentialLockerResponse>;
export interface CreateDestinationResponse {
  Name?: string;
}
export const CreateDestinationResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateDestinationResponse",
}) as any as S.Schema<CreateDestinationResponse>;
export interface GetDestinationResponse {
  Description?: string;
  DeliveryDestinationArn?: string;
  DeliveryDestinationType?: string;
  Name?: string;
  RoleArn?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Tags?: TagsMap;
}
export const GetDestinationResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DeliveryDestinationArn: S.optional(S.String),
    DeliveryDestinationType: S.optional(S.String),
    Name: S.optional(S.String),
    RoleArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "GetDestinationResponse",
}) as any as S.Schema<GetDestinationResponse>;
export interface StartDeviceDiscoveryRequest {
  DiscoveryType: string;
  CustomProtocolDetail?: CustomProtocolDetail;
  ControllerIdentifier?: string;
  ConnectorAssociationIdentifier?: string;
  AccountAssociationId?: string;
  AuthenticationMaterial?: string | Redacted.Redacted<string>;
  AuthenticationMaterialType?: string;
  ClientToken?: string;
  Tags?: TagsMap;
}
export const StartDeviceDiscoveryRequest = S.suspend(() =>
  S.Struct({
    DiscoveryType: S.String,
    CustomProtocolDetail: S.optional(CustomProtocolDetail),
    ControllerIdentifier: S.optional(S.String),
    ConnectorAssociationIdentifier: S.optional(S.String),
    AccountAssociationId: S.optional(S.String),
    AuthenticationMaterial: S.optional(SensitiveString),
    AuthenticationMaterialType: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/device-discoveries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDeviceDiscoveryRequest",
}) as any as S.Schema<StartDeviceDiscoveryRequest>;
export interface GetDeviceDiscoveryResponse {
  Id: string;
  Arn: string;
  DiscoveryType: string;
  Status: string;
  StartedAt: Date;
  ControllerId?: string;
  ConnectorAssociationId?: string;
  AccountAssociationId?: string;
  FinishedAt?: Date;
  Tags?: TagsMap;
}
export const GetDeviceDiscoveryResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetDeviceDiscoveryResponse",
}) as any as S.Schema<GetDeviceDiscoveryResponse>;
export interface CreateEventLogConfigurationResponse {
  Id?: string;
}
export const CreateEventLogConfigurationResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateEventLogConfigurationResponse",
}) as any as S.Schema<CreateEventLogConfigurationResponse>;
export interface GetEventLogConfigurationResponse {
  Id?: string;
  ResourceType?: string;
  ResourceId?: string;
  EventLogLevel?: string;
}
export const GetEventLogConfigurationResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    EventLogLevel: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEventLogConfigurationResponse",
}) as any as S.Schema<GetEventLogConfigurationResponse>;
export interface PutHubConfigurationResponse {
  HubTokenTimerExpirySettingInSeconds?: number;
}
export const PutHubConfigurationResponse = S.suspend(() =>
  S.Struct({ HubTokenTimerExpirySettingInSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "PutHubConfigurationResponse",
}) as any as S.Schema<PutHubConfigurationResponse>;
export interface ConfigurationError {
  code?: string;
  message?: string;
}
export const ConfigurationError = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "ConfigurationError",
}) as any as S.Schema<ConfigurationError>;
export interface ConfigurationStatus {
  error?: ConfigurationError;
  state: string;
}
export const ConfigurationStatus = S.suspend(() =>
  S.Struct({ error: S.optional(ConfigurationError), state: S.String }),
).annotations({
  identifier: "ConfigurationStatus",
}) as any as S.Schema<ConfigurationStatus>;
export interface PutDefaultEncryptionConfigurationResponse {
  configurationStatus: ConfigurationStatus;
  encryptionType: string;
  kmsKeyArn?: string;
}
export const PutDefaultEncryptionConfigurationResponse = S.suspend(() =>
  S.Struct({
    configurationStatus: ConfigurationStatus,
    encryptionType: S.String,
    kmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "PutDefaultEncryptionConfigurationResponse",
}) as any as S.Schema<PutDefaultEncryptionConfigurationResponse>;
export interface RegisterAccountAssociationResponse {
  AccountAssociationId?: string;
  DeviceDiscoveryId?: string;
  ManagedThingId?: string;
}
export const RegisterAccountAssociationResponse = S.suspend(() =>
  S.Struct({
    AccountAssociationId: S.optional(S.String),
    DeviceDiscoveryId: S.optional(S.String),
    ManagedThingId: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterAccountAssociationResponse",
}) as any as S.Schema<RegisterAccountAssociationResponse>;
export interface GetManagedThingResponse {
  Id?: string;
  Arn?: string;
  Owner?: string | Redacted.Redacted<string>;
  CredentialLockerId?: string;
  AdvertisedProductId?: string;
  Role?: string;
  ProvisioningStatus?: string;
  Name?: string;
  Model?: string | Redacted.Redacted<string>;
  Brand?: string | Redacted.Redacted<string>;
  SerialNumber?: string | Redacted.Redacted<string>;
  UniversalProductCode?: string | Redacted.Redacted<string>;
  InternationalArticleNumber?: string | Redacted.Redacted<string>;
  ConnectorPolicyId?: string;
  ConnectorDestinationId?: string;
  ConnectorDeviceId?: string | Redacted.Redacted<string>;
  DeviceSpecificKey?: string | Redacted.Redacted<string>;
  MacAddress?: string | Redacted.Redacted<string>;
  ParentControllerId?: string;
  Classification?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ActivatedAt?: Date;
  HubNetworkMode?: string;
  MetaData?: MetaData;
  Tags?: TagsMap;
}
export const GetManagedThingResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Owner: S.optional(SensitiveString),
    CredentialLockerId: S.optional(S.String),
    AdvertisedProductId: S.optional(S.String),
    Role: S.optional(S.String),
    ProvisioningStatus: S.optional(S.String),
    Name: S.optional(S.String),
    Model: S.optional(SensitiveString),
    Brand: S.optional(SensitiveString),
    SerialNumber: S.optional(SensitiveString),
    UniversalProductCode: S.optional(SensitiveString),
    InternationalArticleNumber: S.optional(SensitiveString),
    ConnectorPolicyId: S.optional(S.String),
    ConnectorDestinationId: S.optional(S.String),
    ConnectorDeviceId: S.optional(SensitiveString),
    DeviceSpecificKey: S.optional(SensitiveString),
    MacAddress: S.optional(SensitiveString),
    ParentControllerId: S.optional(S.String),
    Classification: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ActivatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HubNetworkMode: S.optional(S.String),
    MetaData: S.optional(MetaData),
    Tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "GetManagedThingResponse",
}) as any as S.Schema<GetManagedThingResponse>;
export interface GetManagedThingCapabilitiesResponse {
  ManagedThingId?: string;
  Capabilities?: string;
  CapabilityReport?: CapabilityReport;
}
export const GetManagedThingCapabilitiesResponse = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.optional(S.String),
    Capabilities: S.optional(S.String),
    CapabilityReport: S.optional(CapabilityReport),
  }),
).annotations({
  identifier: "GetManagedThingCapabilitiesResponse",
}) as any as S.Schema<GetManagedThingCapabilitiesResponse>;
export interface GetManagedThingCertificateResponse {
  ManagedThingId?: string;
  CertificatePem?: string;
}
export const GetManagedThingCertificateResponse = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.optional(S.String),
    CertificatePem: S.optional(S.String),
  }),
).annotations({
  identifier: "GetManagedThingCertificateResponse",
}) as any as S.Schema<GetManagedThingCertificateResponse>;
export interface GetManagedThingConnectivityDataResponse {
  ManagedThingId?: string;
  Connected?: boolean;
  Timestamp?: Date;
  DisconnectReason?: string;
}
export const GetManagedThingConnectivityDataResponse = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.optional(S.String),
    Connected: S.optional(S.Boolean),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisconnectReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetManagedThingConnectivityDataResponse",
}) as any as S.Schema<GetManagedThingConnectivityDataResponse>;
export interface GetManagedThingMetaDataResponse {
  ManagedThingId?: string;
  MetaData?: MetaData;
}
export const GetManagedThingMetaDataResponse = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.optional(S.String),
    MetaData: S.optional(MetaData),
  }),
).annotations({
  identifier: "GetManagedThingMetaDataResponse",
}) as any as S.Schema<GetManagedThingMetaDataResponse>;
export interface CreateNotificationConfigurationResponse {
  EventType?: string;
}
export const CreateNotificationConfigurationResponse = S.suspend(() =>
  S.Struct({ EventType: S.optional(S.String) }),
).annotations({
  identifier: "CreateNotificationConfigurationResponse",
}) as any as S.Schema<CreateNotificationConfigurationResponse>;
export interface GetNotificationConfigurationResponse {
  EventType?: string;
  DestinationName?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Tags?: TagsMap;
}
export const GetNotificationConfigurationResponse = S.suspend(() =>
  S.Struct({
    EventType: S.optional(S.String),
    DestinationName: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "GetNotificationConfigurationResponse",
}) as any as S.Schema<GetNotificationConfigurationResponse>;
export interface AbortConfigCriteria {
  Action?: string;
  FailureType?: string;
  MinNumberOfExecutedThings?: number;
  ThresholdPercentage?: number;
}
export const AbortConfigCriteria = S.suspend(() =>
  S.Struct({
    Action: S.optional(S.String),
    FailureType: S.optional(S.String),
    MinNumberOfExecutedThings: S.optional(S.Number),
    ThresholdPercentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "AbortConfigCriteria",
}) as any as S.Schema<AbortConfigCriteria>;
export type AbortConfigCriteriaList = AbortConfigCriteria[];
export const AbortConfigCriteriaList = S.Array(AbortConfigCriteria);
export interface OtaTaskAbortConfig {
  AbortConfigCriteriaList?: AbortConfigCriteriaList;
}
export const OtaTaskAbortConfig = S.suspend(() =>
  S.Struct({ AbortConfigCriteriaList: S.optional(AbortConfigCriteriaList) }),
).annotations({
  identifier: "OtaTaskAbortConfig",
}) as any as S.Schema<OtaTaskAbortConfig>;
export interface RolloutRateIncreaseCriteria {
  numberOfNotifiedThings?: number;
  numberOfSucceededThings?: number;
}
export const RolloutRateIncreaseCriteria = S.suspend(() =>
  S.Struct({
    numberOfNotifiedThings: S.optional(S.Number),
    numberOfSucceededThings: S.optional(S.Number),
  }),
).annotations({
  identifier: "RolloutRateIncreaseCriteria",
}) as any as S.Schema<RolloutRateIncreaseCriteria>;
export interface ExponentialRolloutRate {
  BaseRatePerMinute?: number;
  IncrementFactor?: number;
  RateIncreaseCriteria?: RolloutRateIncreaseCriteria;
}
export const ExponentialRolloutRate = S.suspend(() =>
  S.Struct({
    BaseRatePerMinute: S.optional(S.Number),
    IncrementFactor: S.optional(S.Number),
    RateIncreaseCriteria: S.optional(RolloutRateIncreaseCriteria),
  }),
).annotations({
  identifier: "ExponentialRolloutRate",
}) as any as S.Schema<ExponentialRolloutRate>;
export interface OtaTaskExecutionRolloutConfig {
  ExponentialRolloutRate?: ExponentialRolloutRate;
  MaximumPerMinute?: number;
}
export const OtaTaskExecutionRolloutConfig = S.suspend(() =>
  S.Struct({
    ExponentialRolloutRate: S.optional(ExponentialRolloutRate),
    MaximumPerMinute: S.optional(S.Number),
  }),
).annotations({
  identifier: "OtaTaskExecutionRolloutConfig",
}) as any as S.Schema<OtaTaskExecutionRolloutConfig>;
export interface OtaTaskTimeoutConfig {
  InProgressTimeoutInMinutes?: number;
}
export const OtaTaskTimeoutConfig = S.suspend(() =>
  S.Struct({ InProgressTimeoutInMinutes: S.optional(S.Number) }),
).annotations({
  identifier: "OtaTaskTimeoutConfig",
}) as any as S.Schema<OtaTaskTimeoutConfig>;
export interface PushConfig {
  AbortConfig?: OtaTaskAbortConfig;
  RolloutConfig?: OtaTaskExecutionRolloutConfig;
  TimeoutConfig?: OtaTaskTimeoutConfig;
}
export const PushConfig = S.suspend(() =>
  S.Struct({
    AbortConfig: S.optional(OtaTaskAbortConfig),
    RolloutConfig: S.optional(OtaTaskExecutionRolloutConfig),
    TimeoutConfig: S.optional(OtaTaskTimeoutConfig),
  }),
).annotations({ identifier: "PushConfig" }) as any as S.Schema<PushConfig>;
export interface GetOtaTaskConfigurationResponse {
  TaskConfigurationId?: string;
  Name?: string | Redacted.Redacted<string>;
  PushConfig?: PushConfig;
  Description?: string;
  CreatedAt?: Date;
}
export const GetOtaTaskConfigurationResponse = S.suspend(() =>
  S.Struct({
    TaskConfigurationId: S.optional(S.String),
    Name: S.optional(SensitiveString),
    PushConfig: S.optional(PushConfig),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetOtaTaskConfigurationResponse",
}) as any as S.Schema<GetOtaTaskConfigurationResponse>;
export interface CreateProvisioningProfileResponse {
  Arn?: string;
  Name?: string;
  ProvisioningType?: string;
  Id?: string;
  ClaimCertificate?: string | Redacted.Redacted<string>;
  ClaimCertificatePrivateKey?: string | Redacted.Redacted<string>;
}
export const CreateProvisioningProfileResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    ProvisioningType: S.optional(S.String),
    Id: S.optional(S.String),
    ClaimCertificate: S.optional(SensitiveString),
    ClaimCertificatePrivateKey: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CreateProvisioningProfileResponse",
}) as any as S.Schema<CreateProvisioningProfileResponse>;
export interface GetProvisioningProfileResponse {
  Arn?: string;
  Name?: string;
  ProvisioningType?: string;
  Id?: string;
  ClaimCertificate?: string | Redacted.Redacted<string>;
  Tags?: TagsMap;
}
export const GetProvisioningProfileResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    ProvisioningType: S.optional(S.String),
    Id: S.optional(S.String),
    ClaimCertificate: S.optional(SensitiveString),
    Tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "GetProvisioningProfileResponse",
}) as any as S.Schema<GetProvisioningProfileResponse>;
export interface GetRuntimeLogConfigurationResponse {
  ManagedThingId?: string;
  RuntimeLogConfigurations?: RuntimeLogConfigurations;
}
export const GetRuntimeLogConfigurationResponse = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.optional(S.String),
    RuntimeLogConfigurations: S.optional(RuntimeLogConfigurations),
  }),
).annotations({
  identifier: "GetRuntimeLogConfigurationResponse",
}) as any as S.Schema<GetRuntimeLogConfigurationResponse>;
export interface PutRuntimeLogConfigurationRequest {
  ManagedThingId: string;
  RuntimeLogConfigurations: RuntimeLogConfigurations;
}
export const PutRuntimeLogConfigurationRequest = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")),
    RuntimeLogConfigurations: RuntimeLogConfigurations,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutRuntimeLogConfigurationRequest",
}) as any as S.Schema<PutRuntimeLogConfigurationRequest>;
export interface PutRuntimeLogConfigurationResponse {}
export const PutRuntimeLogConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutRuntimeLogConfigurationResponse",
}) as any as S.Schema<PutRuntimeLogConfigurationResponse>;
export interface GetSchemaVersionResponse {
  SchemaId?: string;
  Type?: string;
  Description?: string;
  Namespace?: string;
  SemanticVersion?: string;
  Visibility?: string;
  Schema?: any;
}
export const GetSchemaVersionResponse = S.suspend(() =>
  S.Struct({
    SchemaId: S.optional(S.String),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
    Namespace: S.optional(S.String),
    SemanticVersion: S.optional(S.String),
    Visibility: S.optional(S.String),
    Schema: S.optional(S.Any),
  }),
).annotations({
  identifier: "GetSchemaVersionResponse",
}) as any as S.Schema<GetSchemaVersionResponse>;
export interface OAuthUpdate {
  oAuthCompleteRedirectUrl?: string;
  proactiveRefreshTokenRenewal?: ProactiveRefreshTokenRenewal;
}
export const OAuthUpdate = S.suspend(() =>
  S.Struct({
    oAuthCompleteRedirectUrl: S.optional(S.String),
    proactiveRefreshTokenRenewal: S.optional(ProactiveRefreshTokenRenewal),
  }),
).annotations({ identifier: "OAuthUpdate" }) as any as S.Schema<OAuthUpdate>;
export type DeviceTypeList = string[];
export const DeviceTypeList = S.Array(S.String);
export interface ScheduleMaintenanceWindow {
  DurationInMinutes?: number;
  StartTime?: string;
}
export const ScheduleMaintenanceWindow = S.suspend(() =>
  S.Struct({
    DurationInMinutes: S.optional(S.Number),
    StartTime: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduleMaintenanceWindow",
}) as any as S.Schema<ScheduleMaintenanceWindow>;
export type ScheduleMaintenanceWindowList = ScheduleMaintenanceWindow[];
export const ScheduleMaintenanceWindowList = S.Array(ScheduleMaintenanceWindow);
export interface RetryConfigCriteria {
  FailureType?: string;
  MinNumberOfRetries?: number;
}
export const RetryConfigCriteria = S.suspend(() =>
  S.Struct({
    FailureType: S.optional(S.String),
    MinNumberOfRetries: S.optional(S.Number),
  }),
).annotations({
  identifier: "RetryConfigCriteria",
}) as any as S.Schema<RetryConfigCriteria>;
export type RetryConfigCriteriaList = RetryConfigCriteria[];
export const RetryConfigCriteriaList = S.Array(RetryConfigCriteria);
export type MatterCapabilityReportEndpointParts = string[];
export const MatterCapabilityReportEndpointParts = S.Array(S.String);
export type MatterCapabilityReportEndpointSemanticTags = string[];
export const MatterCapabilityReportEndpointSemanticTags = S.Array(S.String);
export type MatterCapabilityReportEndpointClientClusters = string[];
export const MatterCapabilityReportEndpointClientClusters = S.Array(S.String);
export interface AccountAssociationItem {
  AccountAssociationId: string;
  AssociationState: string;
  ErrorMessage?: string;
  ConnectorDestinationId?: string;
  Name?: string;
  Description?: string;
  Arn?: string;
}
export const AccountAssociationItem = S.suspend(() =>
  S.Struct({
    AccountAssociationId: S.String,
    AssociationState: S.String,
    ErrorMessage: S.optional(S.String),
    ConnectorDestinationId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountAssociationItem",
}) as any as S.Schema<AccountAssociationItem>;
export type AccountAssociationListDefinition = AccountAssociationItem[];
export const AccountAssociationListDefinition = S.Array(AccountAssociationItem);
export interface ConnectorItem {
  Name: string;
  EndpointConfig: EndpointConfig;
  Description?: string;
  EndpointType?: string;
  Id?: string;
  Type?: string;
}
export const ConnectorItem = S.suspend(() =>
  S.Struct({
    Name: S.String,
    EndpointConfig: EndpointConfig,
    Description: S.optional(S.String),
    EndpointType: S.optional(S.String),
    Id: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectorItem",
}) as any as S.Schema<ConnectorItem>;
export type ConnectorList = ConnectorItem[];
export const ConnectorList = S.Array(ConnectorItem);
export interface AuthConfigUpdate {
  oAuthUpdate?: OAuthUpdate;
}
export const AuthConfigUpdate = S.suspend(() =>
  S.Struct({ oAuthUpdate: S.optional(OAuthUpdate) }),
).annotations({
  identifier: "AuthConfigUpdate",
}) as any as S.Schema<AuthConfigUpdate>;
export interface ConnectorDestinationSummary {
  Name?: string;
  Description?: string;
  CloudConnectorId?: string;
  Id?: string;
}
export const ConnectorDestinationSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CloudConnectorId: S.optional(S.String),
    Id: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectorDestinationSummary",
}) as any as S.Schema<ConnectorDestinationSummary>;
export type ConnectorDestinationListDefinition = ConnectorDestinationSummary[];
export const ConnectorDestinationListDefinition = S.Array(
  ConnectorDestinationSummary,
);
export interface CredentialLockerSummary {
  Id?: string;
  Arn?: string;
  Name?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
}
export const CredentialLockerSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CredentialLockerSummary",
}) as any as S.Schema<CredentialLockerSummary>;
export type CredentialLockerListDefinition = CredentialLockerSummary[];
export const CredentialLockerListDefinition = S.Array(CredentialLockerSummary);
export interface DestinationSummary {
  Description?: string;
  DeliveryDestinationArn?: string;
  DeliveryDestinationType?: string;
  Name?: string;
  RoleArn?: string;
}
export const DestinationSummary = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DeliveryDestinationArn: S.optional(S.String),
    DeliveryDestinationType: S.optional(S.String),
    Name: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DestinationSummary",
}) as any as S.Schema<DestinationSummary>;
export type DestinationListDefinition = DestinationSummary[];
export const DestinationListDefinition = S.Array(DestinationSummary);
export interface DeviceDiscoverySummary {
  Id?: string;
  DiscoveryType?: string;
  Status?: string;
}
export const DeviceDiscoverySummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    DiscoveryType: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "DeviceDiscoverySummary",
}) as any as S.Schema<DeviceDiscoverySummary>;
export type DeviceDiscoveryListDefinition = DeviceDiscoverySummary[];
export const DeviceDiscoveryListDefinition = S.Array(DeviceDiscoverySummary);
export interface DiscoveredDeviceSummary {
  ConnectorDeviceId?: string | Redacted.Redacted<string>;
  ConnectorDeviceName?: string | Redacted.Redacted<string>;
  DeviceTypes?: DeviceTypeList;
  ManagedThingId?: string;
  Modification?: string;
  DiscoveredAt?: Date;
  Brand?: string | Redacted.Redacted<string>;
  Model?: string | Redacted.Redacted<string>;
  AuthenticationMaterial?: string | Redacted.Redacted<string>;
}
export const DiscoveredDeviceSummary = S.suspend(() =>
  S.Struct({
    ConnectorDeviceId: S.optional(SensitiveString),
    ConnectorDeviceName: S.optional(SensitiveString),
    DeviceTypes: S.optional(DeviceTypeList),
    ManagedThingId: S.optional(S.String),
    Modification: S.optional(S.String),
    DiscoveredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Brand: S.optional(SensitiveString),
    Model: S.optional(SensitiveString),
    AuthenticationMaterial: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "DiscoveredDeviceSummary",
}) as any as S.Schema<DiscoveredDeviceSummary>;
export type DiscoveredDeviceListDefinition = DiscoveredDeviceSummary[];
export const DiscoveredDeviceListDefinition = S.Array(DiscoveredDeviceSummary);
export interface EventLogConfigurationSummary {
  Id?: string;
  ResourceType?: string;
  ResourceId?: string;
  EventLogLevel?: string;
}
export const EventLogConfigurationSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    EventLogLevel: S.optional(S.String),
  }),
).annotations({
  identifier: "EventLogConfigurationSummary",
}) as any as S.Schema<EventLogConfigurationSummary>;
export type EventLogConfigurationListDefinition =
  EventLogConfigurationSummary[];
export const EventLogConfigurationListDefinition = S.Array(
  EventLogConfigurationSummary,
);
export interface ManagedThingAssociation {
  ManagedThingId?: string;
  AccountAssociationId?: string;
}
export const ManagedThingAssociation = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.optional(S.String),
    AccountAssociationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedThingAssociation",
}) as any as S.Schema<ManagedThingAssociation>;
export type ManagedThingAssociationList = ManagedThingAssociation[];
export const ManagedThingAssociationList = S.Array(ManagedThingAssociation);
export interface ManagedThingSummary {
  Id?: string;
  Arn?: string;
  AdvertisedProductId?: string;
  Brand?: string | Redacted.Redacted<string>;
  Classification?: string | Redacted.Redacted<string>;
  ConnectorDeviceId?: string | Redacted.Redacted<string>;
  ConnectorPolicyId?: string;
  ConnectorDestinationId?: string;
  Model?: string | Redacted.Redacted<string>;
  Name?: string;
  Owner?: string | Redacted.Redacted<string>;
  CredentialLockerId?: string;
  ParentControllerId?: string;
  ProvisioningStatus?: string;
  Role?: string;
  SerialNumber?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ActivatedAt?: Date;
}
export const ManagedThingSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    AdvertisedProductId: S.optional(S.String),
    Brand: S.optional(SensitiveString),
    Classification: S.optional(SensitiveString),
    ConnectorDeviceId: S.optional(SensitiveString),
    ConnectorPolicyId: S.optional(S.String),
    ConnectorDestinationId: S.optional(S.String),
    Model: S.optional(SensitiveString),
    Name: S.optional(S.String),
    Owner: S.optional(SensitiveString),
    CredentialLockerId: S.optional(S.String),
    ParentControllerId: S.optional(S.String),
    ProvisioningStatus: S.optional(S.String),
    Role: S.optional(S.String),
    SerialNumber: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ActivatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ManagedThingSummary",
}) as any as S.Schema<ManagedThingSummary>;
export type ManagedThingListDefinition = ManagedThingSummary[];
export const ManagedThingListDefinition = S.Array(ManagedThingSummary);
export interface ManagedThingSchemaListItem {
  EndpointId?: string;
  CapabilityId?: string;
  Schema?: any;
}
export const ManagedThingSchemaListItem = S.suspend(() =>
  S.Struct({
    EndpointId: S.optional(S.String),
    CapabilityId: S.optional(S.String),
    Schema: S.optional(S.Any),
  }),
).annotations({
  identifier: "ManagedThingSchemaListItem",
}) as any as S.Schema<ManagedThingSchemaListItem>;
export type ManagedThingSchemaListDefinition = ManagedThingSchemaListItem[];
export const ManagedThingSchemaListDefinition = S.Array(
  ManagedThingSchemaListItem,
);
export interface NotificationConfigurationSummary {
  EventType?: string;
  DestinationName?: string;
}
export const NotificationConfigurationSummary = S.suspend(() =>
  S.Struct({
    EventType: S.optional(S.String),
    DestinationName: S.optional(S.String),
  }),
).annotations({
  identifier: "NotificationConfigurationSummary",
}) as any as S.Schema<NotificationConfigurationSummary>;
export type NotificationConfigurationListDefinition =
  NotificationConfigurationSummary[];
export const NotificationConfigurationListDefinition = S.Array(
  NotificationConfigurationSummary,
);
export interface OtaTaskConfigurationSummary {
  TaskConfigurationId?: string;
  Name?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
}
export const OtaTaskConfigurationSummary = S.suspend(() =>
  S.Struct({
    TaskConfigurationId: S.optional(S.String),
    Name: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OtaTaskConfigurationSummary",
}) as any as S.Schema<OtaTaskConfigurationSummary>;
export type OtaTaskConfigurationListDefinition = OtaTaskConfigurationSummary[];
export const OtaTaskConfigurationListDefinition = S.Array(
  OtaTaskConfigurationSummary,
);
export interface OtaTaskSchedulingConfig {
  EndBehavior?: string;
  EndTime?: string;
  MaintenanceWindows?: ScheduleMaintenanceWindowList;
  StartTime?: string;
}
export const OtaTaskSchedulingConfig = S.suspend(() =>
  S.Struct({
    EndBehavior: S.optional(S.String),
    EndTime: S.optional(S.String),
    MaintenanceWindows: S.optional(ScheduleMaintenanceWindowList),
    StartTime: S.optional(S.String),
  }),
).annotations({
  identifier: "OtaTaskSchedulingConfig",
}) as any as S.Schema<OtaTaskSchedulingConfig>;
export interface OtaTaskExecutionRetryConfig {
  RetryConfigCriteria?: RetryConfigCriteriaList;
}
export const OtaTaskExecutionRetryConfig = S.suspend(() =>
  S.Struct({ RetryConfigCriteria: S.optional(RetryConfigCriteriaList) }),
).annotations({
  identifier: "OtaTaskExecutionRetryConfig",
}) as any as S.Schema<OtaTaskExecutionRetryConfig>;
export interface TaskProcessingDetails {
  NumberOfCanceledThings?: number;
  NumberOfFailedThings?: number;
  NumberOfInProgressThings?: number;
  numberOfQueuedThings?: number;
  numberOfRejectedThings?: number;
  numberOfRemovedThings?: number;
  numberOfSucceededThings?: number;
  numberOfTimedOutThings?: number;
  processingTargets?: Target;
}
export const TaskProcessingDetails = S.suspend(() =>
  S.Struct({
    NumberOfCanceledThings: S.optional(S.Number),
    NumberOfFailedThings: S.optional(S.Number),
    NumberOfInProgressThings: S.optional(S.Number),
    numberOfQueuedThings: S.optional(S.Number),
    numberOfRejectedThings: S.optional(S.Number),
    numberOfRemovedThings: S.optional(S.Number),
    numberOfSucceededThings: S.optional(S.Number),
    numberOfTimedOutThings: S.optional(S.Number),
    processingTargets: S.optional(Target),
  }),
).annotations({
  identifier: "TaskProcessingDetails",
}) as any as S.Schema<TaskProcessingDetails>;
export interface OtaTaskSummary {
  TaskId?: string;
  TaskArn?: string;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  TaskConfigurationId?: string;
  Status?: string;
}
export const OtaTaskSummary = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TaskConfigurationId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "OtaTaskSummary",
}) as any as S.Schema<OtaTaskSummary>;
export type OtaTaskListDefinition = OtaTaskSummary[];
export const OtaTaskListDefinition = S.Array(OtaTaskSummary);
export interface ProvisioningProfileSummary {
  Name?: string;
  Id?: string;
  Arn?: string;
  ProvisioningType?: string;
}
export const ProvisioningProfileSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    ProvisioningType: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisioningProfileSummary",
}) as any as S.Schema<ProvisioningProfileSummary>;
export type ProvisioningProfileListDefinition = ProvisioningProfileSummary[];
export const ProvisioningProfileListDefinition = S.Array(
  ProvisioningProfileSummary,
);
export interface SchemaVersionListItem {
  SchemaId?: string;
  Type?: string;
  Description?: string;
  Namespace?: string;
  SemanticVersion?: string;
  Visibility?: string;
}
export const SchemaVersionListItem = S.suspend(() =>
  S.Struct({
    SchemaId: S.optional(S.String),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
    Namespace: S.optional(S.String),
    SemanticVersion: S.optional(S.String),
    Visibility: S.optional(S.String),
  }),
).annotations({
  identifier: "SchemaVersionListItem",
}) as any as S.Schema<SchemaVersionListItem>;
export type SchemaVersionList = SchemaVersionListItem[];
export const SchemaVersionList = S.Array(SchemaVersionListItem);
export type MatterCommands = { [key: string]: any };
export const MatterCommands = S.Record({ key: S.String, value: S.Any });
export type MatterEvents = { [key: string]: any };
export const MatterEvents = S.Record({ key: S.String, value: S.Any });
export interface CapabilityAction {
  name: string;
  ref?: string;
  actionTraceId?: string;
  parameters?: any;
}
export const CapabilityAction = S.suspend(() =>
  S.Struct({
    name: S.String,
    ref: S.optional(S.String),
    actionTraceId: S.optional(S.String),
    parameters: S.optional(S.Any),
  }),
).annotations({
  identifier: "CapabilityAction",
}) as any as S.Schema<CapabilityAction>;
export type CapabilityActions = CapabilityAction[];
export const CapabilityActions = S.Array(CapabilityAction);
export type MatterCapabilityReportCommands = string[];
export const MatterCapabilityReportCommands = S.Array(S.String);
export type MatterCapabilityReportEvents = string[];
export const MatterCapabilityReportEvents = S.Array(S.String);
export type MatterCapabilityReportGeneratedCommands = string[];
export const MatterCapabilityReportGeneratedCommands = S.Array(S.String);
export interface ListAccountAssociationsResponse {
  Items?: AccountAssociationListDefinition;
  NextToken?: string;
}
export const ListAccountAssociationsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(AccountAssociationListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccountAssociationsResponse",
}) as any as S.Schema<ListAccountAssociationsResponse>;
export interface CreateCloudConnectorRequest {
  Name: string;
  EndpointConfig: EndpointConfig;
  Description?: string;
  EndpointType?: string;
  ClientToken?: string;
}
export const CreateCloudConnectorRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    EndpointConfig: EndpointConfig,
    Description: S.optional(S.String),
    EndpointType: S.optional(S.String),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cloud-connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCloudConnectorRequest",
}) as any as S.Schema<CreateCloudConnectorRequest>;
export interface ListCloudConnectorsResponse {
  Items?: ConnectorList;
  NextToken?: string;
}
export const ListCloudConnectorsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ConnectorList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCloudConnectorsResponse",
}) as any as S.Schema<ListCloudConnectorsResponse>;
export interface UpdateConnectorDestinationRequest {
  Identifier: string;
  Description?: string;
  Name?: string;
  AuthType?: string;
  AuthConfig?: AuthConfigUpdate;
  SecretsManager?: SecretsManager;
}
export const UpdateConnectorDestinationRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Description: S.optional(S.String),
    Name: S.optional(S.String),
    AuthType: S.optional(S.String),
    AuthConfig: S.optional(AuthConfigUpdate),
    SecretsManager: S.optional(SecretsManager),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/connector-destinations/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectorDestinationRequest",
}) as any as S.Schema<UpdateConnectorDestinationRequest>;
export interface UpdateConnectorDestinationResponse {}
export const UpdateConnectorDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateConnectorDestinationResponse",
}) as any as S.Schema<UpdateConnectorDestinationResponse>;
export interface ListConnectorDestinationsResponse {
  ConnectorDestinationList?: ConnectorDestinationListDefinition;
  NextToken?: string;
}
export const ListConnectorDestinationsResponse = S.suspend(() =>
  S.Struct({
    ConnectorDestinationList: S.optional(ConnectorDestinationListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectorDestinationsResponse",
}) as any as S.Schema<ListConnectorDestinationsResponse>;
export interface ListCredentialLockersResponse {
  Items?: CredentialLockerListDefinition;
  NextToken?: string;
}
export const ListCredentialLockersResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(CredentialLockerListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCredentialLockersResponse",
}) as any as S.Schema<ListCredentialLockersResponse>;
export interface ListDestinationsResponse {
  DestinationList?: DestinationListDefinition;
  NextToken?: string;
}
export const ListDestinationsResponse = S.suspend(() =>
  S.Struct({
    DestinationList: S.optional(DestinationListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDestinationsResponse",
}) as any as S.Schema<ListDestinationsResponse>;
export interface StartDeviceDiscoveryResponse {
  Id?: string;
  StartedAt?: Date;
}
export const StartDeviceDiscoveryResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StartDeviceDiscoveryResponse",
}) as any as S.Schema<StartDeviceDiscoveryResponse>;
export interface ListDeviceDiscoveriesResponse {
  Items?: DeviceDiscoveryListDefinition;
  NextToken?: string;
}
export const ListDeviceDiscoveriesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(DeviceDiscoveryListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDeviceDiscoveriesResponse",
}) as any as S.Schema<ListDeviceDiscoveriesResponse>;
export interface ListDiscoveredDevicesResponse {
  Items?: DiscoveredDeviceListDefinition;
  NextToken?: string;
}
export const ListDiscoveredDevicesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(DiscoveredDeviceListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDiscoveredDevicesResponse",
}) as any as S.Schema<ListDiscoveredDevicesResponse>;
export interface ListEventLogConfigurationsResponse {
  EventLogConfigurationList?: EventLogConfigurationListDefinition;
  NextToken?: string;
}
export const ListEventLogConfigurationsResponse = S.suspend(() =>
  S.Struct({
    EventLogConfigurationList: S.optional(EventLogConfigurationListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEventLogConfigurationsResponse",
}) as any as S.Schema<ListEventLogConfigurationsResponse>;
export interface GetDefaultEncryptionConfigurationResponse {
  configurationStatus: ConfigurationStatus;
  encryptionType: string;
  kmsKeyArn?: string;
}
export const GetDefaultEncryptionConfigurationResponse = S.suspend(() =>
  S.Struct({
    configurationStatus: ConfigurationStatus,
    encryptionType: S.String,
    kmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDefaultEncryptionConfigurationResponse",
}) as any as S.Schema<GetDefaultEncryptionConfigurationResponse>;
export interface ListManagedThingAccountAssociationsResponse {
  Items?: ManagedThingAssociationList;
  NextToken?: string;
}
export const ListManagedThingAccountAssociationsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ManagedThingAssociationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListManagedThingAccountAssociationsResponse",
}) as any as S.Schema<ListManagedThingAccountAssociationsResponse>;
export interface ListManagedThingsResponse {
  Items?: ManagedThingListDefinition;
  NextToken?: string;
}
export const ListManagedThingsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ManagedThingListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListManagedThingsResponse",
}) as any as S.Schema<ListManagedThingsResponse>;
export interface ListManagedThingSchemasResponse {
  Items?: ManagedThingSchemaListDefinition;
  NextToken?: string;
}
export const ListManagedThingSchemasResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ManagedThingSchemaListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListManagedThingSchemasResponse",
}) as any as S.Schema<ListManagedThingSchemasResponse>;
export interface ListNotificationConfigurationsResponse {
  NotificationConfigurationList?: NotificationConfigurationListDefinition;
  NextToken?: string;
}
export const ListNotificationConfigurationsResponse = S.suspend(() =>
  S.Struct({
    NotificationConfigurationList: S.optional(
      NotificationConfigurationListDefinition,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNotificationConfigurationsResponse",
}) as any as S.Schema<ListNotificationConfigurationsResponse>;
export interface ListOtaTaskConfigurationsResponse {
  Items?: OtaTaskConfigurationListDefinition;
  NextToken?: string;
}
export const ListOtaTaskConfigurationsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(OtaTaskConfigurationListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOtaTaskConfigurationsResponse",
}) as any as S.Schema<ListOtaTaskConfigurationsResponse>;
export interface CreateOtaTaskRequest {
  Description?: string;
  S3Url: string;
  Protocol?: string;
  Target?: Target;
  TaskConfigurationId?: string;
  OtaMechanism?: string;
  OtaType: string;
  OtaTargetQueryString?: string;
  ClientToken?: string;
  OtaSchedulingConfig?: OtaTaskSchedulingConfig;
  OtaTaskExecutionRetryConfig?: OtaTaskExecutionRetryConfig;
  Tags?: TagsMap;
}
export const CreateOtaTaskRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ota-tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOtaTaskRequest",
}) as any as S.Schema<CreateOtaTaskRequest>;
export interface GetOtaTaskResponse {
  TaskId?: string;
  TaskArn?: string;
  Description?: string;
  S3Url?: string;
  Protocol?: string;
  OtaType?: string;
  OtaTargetQueryString?: string;
  OtaMechanism?: string;
  Target?: Target;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  TaskConfigurationId?: string;
  TaskProcessingDetails?: TaskProcessingDetails;
  OtaSchedulingConfig?: OtaTaskSchedulingConfig;
  OtaTaskExecutionRetryConfig?: OtaTaskExecutionRetryConfig;
  Status?: string;
  Tags?: TagsMap;
}
export const GetOtaTaskResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetOtaTaskResponse",
}) as any as S.Schema<GetOtaTaskResponse>;
export interface ListOtaTasksResponse {
  Tasks?: OtaTaskListDefinition;
  NextToken?: string;
}
export const ListOtaTasksResponse = S.suspend(() =>
  S.Struct({
    Tasks: S.optional(OtaTaskListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOtaTasksResponse",
}) as any as S.Schema<ListOtaTasksResponse>;
export interface ListProvisioningProfilesResponse {
  Items?: ProvisioningProfileListDefinition;
  NextToken?: string;
}
export const ListProvisioningProfilesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ProvisioningProfileListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProvisioningProfilesResponse",
}) as any as S.Schema<ListProvisioningProfilesResponse>;
export interface ListSchemaVersionsResponse {
  Items?: SchemaVersionList;
  NextToken?: string;
}
export const ListSchemaVersionsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(SchemaVersionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSchemaVersionsResponse",
}) as any as S.Schema<ListSchemaVersionsResponse>;
export interface MatterCluster {
  id?: string;
  attributes?: any;
  commands?: MatterCommands;
  events?: MatterEvents;
}
export const MatterCluster = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    attributes: S.optional(S.Any),
    commands: S.optional(MatterCommands),
    events: S.optional(MatterEvents),
  }),
).annotations({
  identifier: "MatterCluster",
}) as any as S.Schema<MatterCluster>;
export type MatterClusters = MatterCluster[];
export const MatterClusters = S.Array(MatterCluster);
export interface CommandCapability {
  id: string;
  name: string;
  version: string;
  actions: CapabilityActions;
}
export const CommandCapability = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    version: S.String,
    actions: CapabilityActions,
  }),
).annotations({
  identifier: "CommandCapability",
}) as any as S.Schema<CommandCapability>;
export type CommandCapabilities = CommandCapability[];
export const CommandCapabilities = S.Array(CommandCapability);
export interface StateCapability {
  id: string;
  name: string;
  version: string;
  properties?: any;
}
export const StateCapability = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    version: S.String,
    properties: S.optional(S.Any),
  }),
).annotations({
  identifier: "StateCapability",
}) as any as S.Schema<StateCapability>;
export type StateCapabilities = StateCapability[];
export const StateCapabilities = S.Array(StateCapability);
export interface OtaTaskExecutionSummary {
  ExecutionNumber?: number;
  LastUpdatedAt?: Date;
  QueuedAt?: Date;
  RetryAttempt?: number;
  StartedAt?: Date;
  Status?: string;
}
export const OtaTaskExecutionSummary = S.suspend(() =>
  S.Struct({
    ExecutionNumber: S.optional(S.Number),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    QueuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RetryAttempt: S.optional(S.Number),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "OtaTaskExecutionSummary",
}) as any as S.Schema<OtaTaskExecutionSummary>;
export interface MatterEndpoint {
  id?: string;
  clusters?: MatterClusters;
}
export const MatterEndpoint = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), clusters: S.optional(MatterClusters) }),
).annotations({
  identifier: "MatterEndpoint",
}) as any as S.Schema<MatterEndpoint>;
export interface CommandEndpoint {
  endpointId: string;
  capabilities: CommandCapabilities;
}
export const CommandEndpoint = S.suspend(() =>
  S.Struct({ endpointId: S.String, capabilities: CommandCapabilities }),
).annotations({
  identifier: "CommandEndpoint",
}) as any as S.Schema<CommandEndpoint>;
export type CommandEndpoints = CommandEndpoint[];
export const CommandEndpoints = S.Array(CommandEndpoint);
export interface StateEndpoint {
  endpointId: string;
  capabilities: StateCapabilities;
}
export const StateEndpoint = S.suspend(() =>
  S.Struct({ endpointId: S.String, capabilities: StateCapabilities }),
).annotations({
  identifier: "StateEndpoint",
}) as any as S.Schema<StateEndpoint>;
export type StateEndpoints = StateEndpoint[];
export const StateEndpoints = S.Array(StateEndpoint);
export interface OtaTaskExecutionSummaries {
  TaskExecutionSummary?: OtaTaskExecutionSummary;
  ManagedThingId?: string;
}
export const OtaTaskExecutionSummaries = S.suspend(() =>
  S.Struct({
    TaskExecutionSummary: S.optional(OtaTaskExecutionSummary),
    ManagedThingId: S.optional(S.String),
  }),
).annotations({
  identifier: "OtaTaskExecutionSummaries",
}) as any as S.Schema<OtaTaskExecutionSummaries>;
export type OtaTaskExecutionSummariesListDefinition =
  OtaTaskExecutionSummaries[];
export const OtaTaskExecutionSummariesListDefinition = S.Array(
  OtaTaskExecutionSummaries,
);
export interface MatterCapabilityReportAttribute {
  id?: string;
  name?: string;
  value?: any;
}
export const MatterCapabilityReportAttribute = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    value: S.optional(S.Any),
  }),
).annotations({
  identifier: "MatterCapabilityReportAttribute",
}) as any as S.Schema<MatterCapabilityReportAttribute>;
export type MatterCapabilityReportAttributes =
  MatterCapabilityReportAttribute[];
export const MatterCapabilityReportAttributes = S.Array(
  MatterCapabilityReportAttribute,
);
export interface CreateCloudConnectorResponse {
  Id?: string;
}
export const CreateCloudConnectorResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateCloudConnectorResponse",
}) as any as S.Schema<CreateCloudConnectorResponse>;
export interface CreateConnectorDestinationRequest {
  Name?: string;
  Description?: string;
  CloudConnectorId: string;
  AuthType: string;
  AuthConfig: AuthConfig;
  SecretsManager: SecretsManager;
  ClientToken?: string;
}
export const CreateConnectorDestinationRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CloudConnectorId: S.String,
    AuthType: S.String,
    AuthConfig: AuthConfig,
    SecretsManager: SecretsManager,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/connector-destinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectorDestinationRequest",
}) as any as S.Schema<CreateConnectorDestinationRequest>;
export interface SendManagedThingCommandRequest {
  ManagedThingId: string;
  Endpoints: CommandEndpoints;
  ConnectorAssociationId?: string;
  AccountAssociationId?: string;
}
export const SendManagedThingCommandRequest = S.suspend(() =>
  S.Struct({
    ManagedThingId: S.String.pipe(T.HttpLabel("ManagedThingId")),
    Endpoints: CommandEndpoints,
    ConnectorAssociationId: S.optional(S.String),
    AccountAssociationId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/managed-things-command/{ManagedThingId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendManagedThingCommandRequest",
}) as any as S.Schema<SendManagedThingCommandRequest>;
export interface CreateManagedThingRequest {
  Role: string;
  Owner?: string | Redacted.Redacted<string>;
  CredentialLockerId?: string;
  AuthenticationMaterial: string | Redacted.Redacted<string>;
  AuthenticationMaterialType: string;
  SerialNumber?: string | Redacted.Redacted<string>;
  Brand?: string | Redacted.Redacted<string>;
  Model?: string | Redacted.Redacted<string>;
  Name?: string;
  CapabilityReport?: CapabilityReport;
  CapabilitySchemas?: CapabilitySchemas;
  Capabilities?: string;
  ClientToken?: string;
  Classification?: string | Redacted.Redacted<string>;
  Tags?: TagsMap;
  MetaData?: MetaData;
}
export const CreateManagedThingRequest = S.suspend(() =>
  S.Struct({
    Role: S.String,
    Owner: S.optional(SensitiveString),
    CredentialLockerId: S.optional(S.String),
    AuthenticationMaterial: SensitiveString,
    AuthenticationMaterialType: S.String,
    SerialNumber: S.optional(SensitiveString),
    Brand: S.optional(SensitiveString),
    Model: S.optional(SensitiveString),
    Name: S.optional(S.String),
    CapabilityReport: S.optional(CapabilityReport),
    CapabilitySchemas: S.optional(CapabilitySchemas),
    Capabilities: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Classification: S.optional(SensitiveString),
    Tags: S.optional(TagsMap),
    MetaData: S.optional(MetaData),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/managed-things" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateManagedThingRequest",
}) as any as S.Schema<CreateManagedThingRequest>;
export interface GetManagedThingStateResponse {
  Endpoints: StateEndpoints;
}
export const GetManagedThingStateResponse = S.suspend(() =>
  S.Struct({ Endpoints: StateEndpoints }),
).annotations({
  identifier: "GetManagedThingStateResponse",
}) as any as S.Schema<GetManagedThingStateResponse>;
export interface CreateOtaTaskResponse {
  TaskId?: string;
  TaskArn?: string;
  Description?: string;
}
export const CreateOtaTaskResponse = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateOtaTaskResponse",
}) as any as S.Schema<CreateOtaTaskResponse>;
export interface ListOtaTaskExecutionsResponse {
  ExecutionSummaries?: OtaTaskExecutionSummariesListDefinition;
  NextToken?: string;
}
export const ListOtaTaskExecutionsResponse = S.suspend(() =>
  S.Struct({
    ExecutionSummaries: S.optional(OtaTaskExecutionSummariesListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOtaTaskExecutionsResponse",
}) as any as S.Schema<ListOtaTaskExecutionsResponse>;
export interface MatterCapabilityReportCluster {
  id: string;
  revision: number;
  publicId?: string;
  name?: string;
  specVersion?: string;
  attributes?: MatterCapabilityReportAttributes;
  commands?: MatterCapabilityReportCommands;
  events?: MatterCapabilityReportEvents;
  featureMap?: number;
  generatedCommands?: MatterCapabilityReportGeneratedCommands;
  fabricIndex?: number;
}
export const MatterCapabilityReportCluster = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "MatterCapabilityReportCluster",
}) as any as S.Schema<MatterCapabilityReportCluster>;
export type MatterCapabilityReportClusters = MatterCapabilityReportCluster[];
export const MatterCapabilityReportClusters = S.Array(
  MatterCapabilityReportCluster,
);
export interface MatterCapabilityReportEndpoint {
  id: string;
  deviceTypes: DeviceTypes;
  clusters: MatterCapabilityReportClusters;
  parts?: MatterCapabilityReportEndpointParts;
  semanticTags?: MatterCapabilityReportEndpointSemanticTags;
  clientClusters?: MatterCapabilityReportEndpointClientClusters;
}
export const MatterCapabilityReportEndpoint = S.suspend(() =>
  S.Struct({
    id: S.String,
    deviceTypes: DeviceTypes,
    clusters: MatterCapabilityReportClusters,
    parts: S.optional(MatterCapabilityReportEndpointParts),
    semanticTags: S.optional(MatterCapabilityReportEndpointSemanticTags),
    clientClusters: S.optional(MatterCapabilityReportEndpointClientClusters),
  }),
).annotations({
  identifier: "MatterCapabilityReportEndpoint",
}) as any as S.Schema<MatterCapabilityReportEndpoint>;
export type MatterCapabilityReportEndpoints = MatterCapabilityReportEndpoint[];
export const MatterCapabilityReportEndpoints = S.Array(
  MatterCapabilityReportEndpoint,
);
export interface CreateConnectorDestinationResponse {
  Id?: string;
}
export const CreateConnectorDestinationResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateConnectorDestinationResponse",
}) as any as S.Schema<CreateConnectorDestinationResponse>;
export interface SendManagedThingCommandResponse {
  TraceId?: string;
}
export const SendManagedThingCommandResponse = S.suspend(() =>
  S.Struct({ TraceId: S.optional(S.String) }),
).annotations({
  identifier: "SendManagedThingCommandResponse",
}) as any as S.Schema<SendManagedThingCommandResponse>;
export interface CreateManagedThingResponse {
  Id?: string;
  Arn?: string;
  CreatedAt?: Date;
}
export const CreateManagedThingResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateManagedThingResponse",
}) as any as S.Schema<CreateManagedThingResponse>;
export interface CreateOtaTaskConfigurationRequest {
  Description?: string;
  Name?: string | Redacted.Redacted<string>;
  PushConfig?: PushConfig;
  ClientToken?: string;
}
export const CreateOtaTaskConfigurationRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Name: S.optional(SensitiveString),
    PushConfig: S.optional(PushConfig),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ota-task-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOtaTaskConfigurationRequest",
}) as any as S.Schema<CreateOtaTaskConfigurationRequest>;
export interface MatterCapabilityReport {
  version: string;
  nodeId?: string;
  endpoints: MatterCapabilityReportEndpoints;
}
export const MatterCapabilityReport = S.suspend(() =>
  S.Struct({
    version: S.String,
    nodeId: S.optional(S.String),
    endpoints: MatterCapabilityReportEndpoints,
  }),
).annotations({
  identifier: "MatterCapabilityReport",
}) as any as S.Schema<MatterCapabilityReport>;
export interface Device {
  ConnectorDeviceId: string | Redacted.Redacted<string>;
  ConnectorDeviceName?: string | Redacted.Redacted<string>;
  CapabilityReport: MatterCapabilityReport;
  CapabilitySchemas?: CapabilitySchemas;
  DeviceMetadata?: any;
}
export const Device = S.suspend(() =>
  S.Struct({
    ConnectorDeviceId: SensitiveString,
    ConnectorDeviceName: S.optional(SensitiveString),
    CapabilityReport: MatterCapabilityReport,
    CapabilitySchemas: S.optional(CapabilitySchemas),
    DeviceMetadata: S.optional(S.Any),
  }),
).annotations({ identifier: "Device" }) as any as S.Schema<Device>;
export type Devices = Device[];
export const Devices = S.Array(Device);
export interface SendConnectorEventRequest {
  ConnectorId: string;
  UserId?: string | Redacted.Redacted<string>;
  Operation: string;
  OperationVersion?: string | Redacted.Redacted<string>;
  StatusCode?: number;
  Message?: string | Redacted.Redacted<string>;
  DeviceDiscoveryId?: string;
  ConnectorDeviceId?: string | Redacted.Redacted<string>;
  TraceId?: string;
  Devices?: Devices;
  MatterEndpoint?: MatterEndpoint;
}
export const SendConnectorEventRequest = S.suspend(() =>
  S.Struct({
    ConnectorId: S.String.pipe(T.HttpLabel("ConnectorId")),
    UserId: S.optional(SensitiveString),
    Operation: S.String,
    OperationVersion: S.optional(SensitiveString),
    StatusCode: S.optional(S.Number),
    Message: S.optional(SensitiveString),
    DeviceDiscoveryId: S.optional(S.String),
    ConnectorDeviceId: S.optional(SensitiveString),
    TraceId: S.optional(S.String),
    Devices: S.optional(Devices),
    MatterEndpoint: S.optional(MatterEndpoint),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/connector-event/{ConnectorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendConnectorEventRequest",
}) as any as S.Schema<SendConnectorEventRequest>;
export interface CreateOtaTaskConfigurationResponse {
  TaskConfigurationId?: string;
}
export const CreateOtaTaskConfigurationResponse = S.suspend(() =>
  S.Struct({ TaskConfigurationId: S.optional(S.String) }),
).annotations({
  identifier: "CreateOtaTaskConfigurationResponse",
}) as any as S.Schema<CreateOtaTaskConfigurationResponse>;
export interface SendConnectorEventResponse {
  ConnectorId: string;
}
export const SendConnectorEventResponse = S.suspend(() =>
  S.Struct({ ConnectorId: S.String }),
).annotations({
  identifier: "SendConnectorEventResponse",
}) as any as S.Schema<SendConnectorEventResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Returns a list of connectors filtered by its Lambda Amazon Resource Name (ARN) and `type`.
 */
export const listCloudConnectors: {
  (
    input: ListCloudConnectorsRequest,
  ): Effect.Effect<
    ListCloudConnectorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCloudConnectorsRequest,
  ) => Stream.Stream<
    ListCloudConnectorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCloudConnectorsRequest,
  ) => Stream.Stream<
    ConnectorItem,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getManagedThingState: (
  input: GetManagedThingStateRequest,
) => Effect.Effect<
  GetManagedThingStateResponse,
  | AccessDeniedException
  | InternalFailureException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * List all of the over-the-air (OTA) task executions.
 */
export const listOtaTaskExecutions: {
  (
    input: ListOtaTaskExecutionsRequest,
  ): Effect.Effect<
    ListOtaTaskExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOtaTaskExecutionsRequest,
  ) => Stream.Stream<
    ListOtaTaskExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOtaTaskExecutionsRequest,
  ) => Stream.Stream<
    OtaTaskExecutionSummaries,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createCredentialLocker: (
  input: CreateCredentialLockerRequest,
) => Effect.Effect<
  CreateCredentialLockerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Delete the over-the-air (OTA) task.
 */
export const deleteOtaTask: (
  input: DeleteOtaTaskRequest,
) => Effect.Effect<
  DeleteOtaTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateConnectorDestination: (
  input: UpdateConnectorDestinationRequest,
) => Effect.Effect<
  UpdateConnectorDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectorDestinationRequest,
  output: UpdateConnectorDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get details of the over-the-air (OTA) task by its task id.
 */
export const getOtaTask: (
  input: GetOtaTaskRequest,
) => Effect.Effect<
  GetOtaTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listOtaTasks: {
  (
    input: ListOtaTasksRequest,
  ): Effect.Effect<
    ListOtaTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOtaTasksRequest,
  ) => Stream.Stream<
    ListOtaTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOtaTasksRequest,
  ) => Stream.Stream<
    OtaTaskSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Get an account association for an Amazon Web Services account linked to a customer-managed destination.
 */
export const getAccountAssociation: (
  input: GetAccountAssociationRequest,
) => Effect.Effect<
  GetAccountAssociationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Initiates a refresh of an existing account association to update its authorization and connection status.
 */
export const startAccountAssociationRefresh: (
  input: StartAccountAssociationRefreshRequest,
) => Effect.Effect<
  StartAccountAssociationRefreshResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCloudConnector: (
  input: GetCloudConnectorRequest,
) => Effect.Effect<
  GetCloudConnectorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getConnectorDestination: (
  input: GetConnectorDestinationRequest,
) => Effect.Effect<
  GetConnectorDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectorDestinationRequest,
  output: GetConnectorDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get information on an existing credential locker
 */
export const getCredentialLocker: (
  input: GetCredentialLockerRequest,
) => Effect.Effect<
  GetCredentialLockerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDestination: (
  input: GetDestinationRequest,
) => Effect.Effect<
  GetDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getEventLogConfiguration: (
  input: GetEventLogConfigurationRequest,
) => Effect.Effect<
  GetEventLogConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventLogConfigurationRequest,
  output: GetEventLogConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a hub configuration.
 */
export const putHubConfiguration: (
  input: PutHubConfigurationRequest,
) => Effect.Effect<
  PutHubConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const registerAccountAssociation: (
  input: RegisterAccountAssociationRequest,
) => Effect.Effect<
  RegisterAccountAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Get a notification configuration for a specified event type.
 */
export const getNotificationConfiguration: (
  input: GetNotificationConfigurationRequest,
) => Effect.Effect<
  GetNotificationConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getOtaTaskConfiguration: (
  input: GetOtaTaskConfigurationRequest,
) => Effect.Effect<
  GetOtaTaskConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOtaTaskConfigurationRequest,
  output: GetOtaTaskConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the runtime log configuration for a specific managed thing.
 */
export const getRuntimeLogConfiguration: (
  input: GetRuntimeLogConfigurationRequest,
) => Effect.Effect<
  GetRuntimeLogConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuntimeLogConfigurationRequest,
  output: GetRuntimeLogConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Set the runtime log configuration for a specific managed thing or for all managed things as a group.
 */
export const putRuntimeLogConfiguration: (
  input: PutRuntimeLogConfigurationRequest,
) => Effect.Effect<
  PutRuntimeLogConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRuntimeLogConfigurationRequest,
  output: PutRuntimeLogConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a schema version with the provided information.
 */
export const getSchemaVersion: (
  input: GetSchemaVersionRequest,
) => Effect.Effect<
  GetSchemaVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAccountAssociation: (
  input: UpdateAccountAssociationRequest,
) => Effect.Effect<
  UpdateAccountAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Remove a third-party account association for an end user.
 *
 * You must first call the `DeregisterAccountAssociation` to remove the connection between the managed thing and the third-party account before calling the `DeleteAccountAssociation` API.
 */
export const deleteAccountAssociation: (
  input: DeleteAccountAssociationRequest,
) => Effect.Effect<
  DeleteAccountAssociationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Delete a connector destination linked to a cloud-to-cloud (C2C) connector.
 *
 * Deletion can't be done if the account association has used this connector destination.
 */
export const deleteConnectorDestination: (
  input: DeleteConnectorDestinationRequest,
) => Effect.Effect<
  DeleteConnectorDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorDestinationRequest,
  output: DeleteConnectorDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a credential locker.
 *
 * This operation can't be undone and any existing device won't be able to use IoT managed integrations.
 */
export const deleteCredentialLocker: (
  input: DeleteCredentialLockerRequest,
) => Effect.Effect<
  DeleteCredentialLockerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a notification destination specified by name.
 */
export const deleteDestination: (
  input: DeleteDestinationRequest,
) => Effect.Effect<
  DeleteDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDestination: (
  input: UpdateDestinationRequest,
) => Effect.Effect<
  UpdateDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteEventLogConfiguration: (
  input: DeleteEventLogConfigurationRequest,
) => Effect.Effect<
  DeleteEventLogConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventLogConfigurationRequest,
  output: DeleteEventLogConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update an event log configuration by log configuration ID.
 */
export const updateEventLogConfiguration: (
  input: UpdateEventLogConfigurationRequest,
) => Effect.Effect<
  UpdateEventLogConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventLogConfigurationRequest,
  output: UpdateEventLogConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a hub configuration.
 */
export const getHubConfiguration: (
  input: GetHubConfigurationRequest,
) => Effect.Effect<
  GetHubConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deregisterAccountAssociation: (
  input: DeregisterAccountAssociationRequest,
) => Effect.Effect<
  DeregisterAccountAssociationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteNotificationConfiguration: (
  input: DeleteNotificationConfigurationRequest,
) => Effect.Effect<
  DeleteNotificationConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateNotificationConfiguration: (
  input: UpdateNotificationConfigurationRequest,
) => Effect.Effect<
  UpdateNotificationConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteOtaTaskConfiguration: (
  input: DeleteOtaTaskConfigurationRequest,
) => Effect.Effect<
  DeleteOtaTaskConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOtaTaskConfigurationRequest,
  output: DeleteOtaTaskConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update an over-the-air (OTA) task.
 */
export const updateOtaTask: (
  input: UpdateOtaTaskRequest,
) => Effect.Effect<
  UpdateOtaTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resetRuntimeLogConfiguration: (
  input: ResetRuntimeLogConfigurationRequest,
) => Effect.Effect<
  ResetRuntimeLogConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCredentialLockers: {
  (
    input: ListCredentialLockersRequest,
  ): Effect.Effect<
    ListCredentialLockersResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCredentialLockersRequest,
  ) => Stream.Stream<
    ListCredentialLockersResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCredentialLockersRequest,
  ) => Stream.Stream<
    CredentialLockerSummary,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSchemaVersions: {
  (
    input: ListSchemaVersionsRequest,
  ): Effect.Effect<
    ListSchemaVersionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemaVersionsRequest,
  ) => Stream.Stream<
    ListSchemaVersionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemaVersionsRequest,
  ) => Stream.Stream<
    SchemaVersionListItem,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all connector destinations, with optional filtering by cloud connector ID.
 */
export const listConnectorDestinations: {
  (
    input: ListConnectorDestinationsRequest,
  ): Effect.Effect<
    ListConnectorDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectorDestinationsRequest,
  ) => Stream.Stream<
    ListConnectorDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectorDestinationsRequest,
  ) => Stream.Stream<
    ConnectorDestinationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listDestinations: {
  (
    input: ListDestinationsRequest,
  ): Effect.Effect<
    ListDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDestinationsRequest,
  ) => Stream.Stream<
    ListDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDestinationsRequest,
  ) => Stream.Stream<
    DestinationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * List all event log configurations for an account.
 */
export const listEventLogConfigurations: {
  (
    input: ListEventLogConfigurationsRequest,
  ): Effect.Effect<
    ListEventLogConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventLogConfigurationsRequest,
  ) => Stream.Stream<
    ListEventLogConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventLogConfigurationsRequest,
  ) => Stream.Stream<
    EventLogConfigurationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listManagedThingAccountAssociations: {
  (
    input: ListManagedThingAccountAssociationsRequest,
  ): Effect.Effect<
    ListManagedThingAccountAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedThingAccountAssociationsRequest,
  ) => Stream.Stream<
    ListManagedThingAccountAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedThingAccountAssociationsRequest,
  ) => Stream.Stream<
    ManagedThingAssociation,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listNotificationConfigurations: {
  (
    input: ListNotificationConfigurationsRequest,
  ): Effect.Effect<
    ListNotificationConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNotificationConfigurationsRequest,
  ) => Stream.Stream<
    ListNotificationConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNotificationConfigurationsRequest,
  ) => Stream.Stream<
    NotificationConfigurationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listOtaTaskConfigurations: {
  (
    input: ListOtaTaskConfigurationsRequest,
  ): Effect.Effect<
    ListOtaTaskConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOtaTaskConfigurationsRequest,
  ) => Stream.Stream<
    ListOtaTaskConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOtaTaskConfigurationsRequest,
  ) => Stream.Stream<
    OtaTaskConfigurationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createDestination: (
  input: CreateDestinationRequest,
) => Effect.Effect<
  CreateDestinationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createNotificationConfiguration: (
  input: CreateNotificationConfigurationRequest,
) => Effect.Effect<
  CreateNotificationConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAccountAssociations: {
  (
    input: ListAccountAssociationsRequest,
  ): Effect.Effect<
    ListAccountAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountAssociationsRequest,
  ) => Stream.Stream<
    ListAccountAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountAssociationsRequest,
  ) => Stream.Stream<
    AccountAssociationItem,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createCloudConnector: (
  input: CreateCloudConnectorRequest,
) => Effect.Effect<
  CreateCloudConnectorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCloudConnectorRequest,
  output: CreateCloudConnectorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Set the event log configuration for the account, resource type, or specific resource.
 */
export const createEventLogConfiguration: (
  input: CreateEventLogConfigurationRequest,
) => Effect.Effect<
  CreateEventLogConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Create an over-the-air (OTA) task to target a device.
 */
export const createOtaTask: (
  input: CreateOtaTaskRequest,
) => Effect.Effect<
  CreateOtaTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startDeviceDiscovery: (
  input: StartDeviceDiscoveryRequest,
) => Effect.Effect<
  StartDeviceDiscoveryResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists all devices discovered during a specific device discovery task.
 */
export const listDiscoveredDevices: {
  (
    input: ListDiscoveredDevicesRequest,
  ): Effect.Effect<
    ListDiscoveredDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDiscoveredDevicesRequest,
  ) => Stream.Stream<
    ListDiscoveredDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDiscoveredDevicesRequest,
  ) => Stream.Stream<
    DiscoveredDeviceSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putDefaultEncryptionConfiguration: (
  input: PutDefaultEncryptionConfigurationRequest,
) => Effect.Effect<
  PutDefaultEncryptionConfigurationResponse,
  | AccessDeniedException
  | InternalFailureException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listManagedThingSchemas: {
  (
    input: ListManagedThingSchemasRequest,
  ): Effect.Effect<
    ListManagedThingSchemasResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedThingSchemasRequest,
  ) => Stream.Stream<
    ListManagedThingSchemasResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedThingSchemasRequest,
  ) => Stream.Stream<
    ManagedThingSchemaListItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createAccountAssociation: (
  input: CreateAccountAssociationRequest,
) => Effect.Effect<
  CreateAccountAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Get the current state of a device discovery.
 */
export const getDeviceDiscovery: (
  input: GetDeviceDiscoveryRequest,
) => Effect.Effect<
  GetDeviceDiscoveryResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getManagedThing: (
  input: GetManagedThingRequest,
) => Effect.Effect<
  GetManagedThingResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getManagedThingCapabilities: (
  input: GetManagedThingCapabilitiesRequest,
) => Effect.Effect<
  GetManagedThingCapabilitiesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves the certificate PEM for a managed IoT thing.
 */
export const getManagedThingCertificate: (
  input: GetManagedThingCertificateRequest,
) => Effect.Effect<
  GetManagedThingCertificateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Get the connectivity status of a managed thing.
 */
export const getManagedThingConnectivityData: (
  input: GetManagedThingConnectivityDataRequest,
) => Effect.Effect<
  GetManagedThingConnectivityDataResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getManagedThingMetaData: (
  input: GetManagedThingMetaDataRequest,
) => Effect.Effect<
  GetManagedThingMetaDataResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Create a provisioning profile for a device to execute the provisioning flows using a provisioning template. The provisioning template is a document that defines the set of resources and policies applied to a device during the provisioning process.
 */
export const createProvisioningProfile: (
  input: CreateProvisioningProfileRequest,
) => Effect.Effect<
  CreateProvisioningProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Get a provisioning profile by template name.
 */
export const getProvisioningProfile: (
  input: GetProvisioningProfileRequest,
) => Effect.Effect<
  GetProvisioningProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Update an existing cloud connector.
 */
export const updateCloudConnector: (
  input: UpdateCloudConnectorRequest,
) => Effect.Effect<
  UpdateCloudConnectorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Delete a cloud connector.
 */
export const deleteCloudConnector: (
  input: DeleteCloudConnectorRequest,
) => Effect.Effect<
  DeleteCloudConnectorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Update the attributes and capabilities associated with a managed thing.
 */
export const updateManagedThing: (
  input: UpdateManagedThingRequest,
) => Effect.Effect<
  UpdateManagedThingResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteManagedThing: (
  input: DeleteManagedThingRequest,
) => Effect.Effect<
  DeleteManagedThingResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProvisioningProfile: (
  input: DeleteProvisioningProfileRequest,
) => Effect.Effect<
  DeleteProvisioningProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Remove tags for the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | ConflictException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | ConflictException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDefaultEncryptionConfiguration: (
  input: GetDefaultEncryptionConfigurationRequest,
) => Effect.Effect<
  GetDefaultEncryptionConfigurationResponse,
  | AccessDeniedException
  | InternalFailureException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDeviceDiscoveries: {
  (
    input: ListDeviceDiscoveriesRequest,
  ): Effect.Effect<
    ListDeviceDiscoveriesResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeviceDiscoveriesRequest,
  ) => Stream.Stream<
    ListDeviceDiscoveriesResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeviceDiscoveriesRequest,
  ) => Stream.Stream<
    DeviceDiscoverySummary,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listManagedThings: {
  (
    input: ListManagedThingsRequest,
  ): Effect.Effect<
    ListManagedThingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedThingsRequest,
  ) => Stream.Stream<
    ListManagedThingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedThingsRequest,
  ) => Stream.Stream<
    ManagedThingSummary,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * List the provisioning profiles within the Amazon Web Services account.
 */
export const listProvisioningProfiles: {
  (
    input: ListProvisioningProfilesRequest,
  ): Effect.Effect<
    ListProvisioningProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProvisioningProfilesRequest,
  ) => Stream.Stream<
    ListProvisioningProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProvisioningProfilesRequest,
  ) => Stream.Stream<
    ProvisioningProfileSummary,
    | AccessDeniedException
    | InternalServerException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const registerCustomEndpoint: (
  input: RegisterCustomEndpointRequest,
) => Effect.Effect<
  RegisterCustomEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns the IoT managed integrations custom endpoint.
 */
export const getCustomEndpoint: (
  input: GetCustomEndpointRequest,
) => Effect.Effect<
  GetCustomEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createConnectorDestination: (
  input: CreateConnectorDestinationRequest,
) => Effect.Effect<
  CreateConnectorDestinationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Send the command to the device represented by the managed thing.
 */
export const sendManagedThingCommand: (
  input: SendManagedThingCommandRequest,
) => Effect.Effect<
  SendManagedThingCommandResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a managed thing. A managed thing contains the device identifier, protocol supported, and capabilities of the device in a data model format defined by Managed integrations.
 */
export const createManagedThing: (
  input: CreateManagedThingRequest,
) => Effect.Effect<
  CreateManagedThingResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createOtaTaskConfiguration: (
  input: CreateOtaTaskConfigurationRequest,
) => Effect.Effect<
  CreateOtaTaskConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOtaTaskConfigurationRequest,
  output: CreateOtaTaskConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Relays third-party device events for a connector such as a new device or a device state change event.
 */
export const sendConnectorEvent: (
  input: SendConnectorEventRequest,
) => Effect.Effect<
  SendConnectorEventResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

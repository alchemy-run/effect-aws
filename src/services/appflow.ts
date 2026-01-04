import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Appflow",
  serviceShapeName: "SandstoneConfigurationServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "appflow" });
const ver = T.ServiceVersion("2020-08-23");
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
                        url: "https://appflow-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://appflow-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://appflow.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://appflow.{Region}.{PartitionResult#dnsSuffix}",
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
export const ExecutionIds = S.Array(S.String);
export const ConnectorProfileNameList = S.Array(S.String);
export const ConnectorTypeList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CancelFlowExecutionsRequest extends S.Class<CancelFlowExecutionsRequest>(
  "CancelFlowExecutionsRequest",
)(
  { flowName: S.String, executionIds: S.optional(ExecutionIds) },
  T.all(
    T.Http({ method: "POST", uri: "/cancel-flow-executions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorProfileRequest extends S.Class<DeleteConnectorProfileRequest>(
  "DeleteConnectorProfileRequest",
)(
  { connectorProfileName: S.String, forceDelete: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/delete-connector-profile" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorProfileResponse extends S.Class<DeleteConnectorProfileResponse>(
  "DeleteConnectorProfileResponse",
)({}) {}
export class DeleteFlowRequest extends S.Class<DeleteFlowRequest>(
  "DeleteFlowRequest",
)(
  { flowName: S.String, forceDelete: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/delete-flow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFlowResponse extends S.Class<DeleteFlowResponse>(
  "DeleteFlowResponse",
)({}) {}
export class DescribeConnectorRequest extends S.Class<DescribeConnectorRequest>(
  "DescribeConnectorRequest",
)(
  { connectorType: S.String, connectorLabel: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/describe-connector" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConnectorEntityRequest extends S.Class<DescribeConnectorEntityRequest>(
  "DescribeConnectorEntityRequest",
)(
  {
    connectorEntityName: S.String,
    connectorType: S.optional(S.String),
    connectorProfileName: S.optional(S.String),
    apiVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/describe-connector-entity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConnectorProfilesRequest extends S.Class<DescribeConnectorProfilesRequest>(
  "DescribeConnectorProfilesRequest",
)(
  {
    connectorProfileNames: S.optional(ConnectorProfileNameList),
    connectorType: S.optional(S.String),
    connectorLabel: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/describe-connector-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConnectorsRequest extends S.Class<DescribeConnectorsRequest>(
  "DescribeConnectorsRequest",
)(
  {
    connectorTypes: S.optional(ConnectorTypeList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/describe-connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFlowRequest extends S.Class<DescribeFlowRequest>(
  "DescribeFlowRequest",
)(
  { flowName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describe-flow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFlowExecutionRecordsRequest extends S.Class<DescribeFlowExecutionRecordsRequest>(
  "DescribeFlowExecutionRecordsRequest",
)(
  {
    flowName: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/describe-flow-execution-records" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectorEntitiesRequest extends S.Class<ListConnectorEntitiesRequest>(
  "ListConnectorEntitiesRequest",
)(
  {
    connectorProfileName: S.optional(S.String),
    connectorType: S.optional(S.String),
    entitiesPath: S.optional(S.String),
    apiVersion: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-connector-entities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectorsRequest extends S.Class<ListConnectorsRequest>(
  "ListConnectorsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/list-connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFlowsRequest extends S.Class<ListFlowsRequest>(
  "ListFlowsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/list-flows" }),
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
export class ResetConnectorMetadataCacheRequest extends S.Class<ResetConnectorMetadataCacheRequest>(
  "ResetConnectorMetadataCacheRequest",
)(
  {
    connectorProfileName: S.optional(S.String),
    connectorType: S.optional(S.String),
    connectorEntityName: S.optional(S.String),
    entitiesPath: S.optional(S.String),
    apiVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/reset-connector-metadata-cache" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetConnectorMetadataCacheResponse extends S.Class<ResetConnectorMetadataCacheResponse>(
  "ResetConnectorMetadataCacheResponse",
)({}) {}
export class StartFlowRequest extends S.Class<StartFlowRequest>(
  "StartFlowRequest",
)(
  { flowName: S.String, clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/start-flow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopFlowRequest extends S.Class<StopFlowRequest>(
  "StopFlowRequest",
)(
  { flowName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/stop-flow" }),
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
export class UnregisterConnectorRequest extends S.Class<UnregisterConnectorRequest>(
  "UnregisterConnectorRequest",
)(
  { connectorLabel: S.String, forceDelete: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/unregister-connector" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UnregisterConnectorResponse extends S.Class<UnregisterConnectorResponse>(
  "UnregisterConnectorResponse",
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
export class AmplitudeConnectorProfileProperties extends S.Class<AmplitudeConnectorProfileProperties>(
  "AmplitudeConnectorProfileProperties",
)({}) {}
export class DatadogConnectorProfileProperties extends S.Class<DatadogConnectorProfileProperties>(
  "DatadogConnectorProfileProperties",
)({ instanceUrl: S.String }) {}
export class DynatraceConnectorProfileProperties extends S.Class<DynatraceConnectorProfileProperties>(
  "DynatraceConnectorProfileProperties",
)({ instanceUrl: S.String }) {}
export class GoogleAnalyticsConnectorProfileProperties extends S.Class<GoogleAnalyticsConnectorProfileProperties>(
  "GoogleAnalyticsConnectorProfileProperties",
)({}) {}
export class HoneycodeConnectorProfileProperties extends S.Class<HoneycodeConnectorProfileProperties>(
  "HoneycodeConnectorProfileProperties",
)({}) {}
export class InforNexusConnectorProfileProperties extends S.Class<InforNexusConnectorProfileProperties>(
  "InforNexusConnectorProfileProperties",
)({ instanceUrl: S.String }) {}
export class MarketoConnectorProfileProperties extends S.Class<MarketoConnectorProfileProperties>(
  "MarketoConnectorProfileProperties",
)({ instanceUrl: S.String }) {}
export class RedshiftConnectorProfileProperties extends S.Class<RedshiftConnectorProfileProperties>(
  "RedshiftConnectorProfileProperties",
)({
  databaseUrl: S.optional(S.String),
  bucketName: S.String,
  bucketPrefix: S.optional(S.String),
  roleArn: S.String,
  dataApiRoleArn: S.optional(S.String),
  isRedshiftServerless: S.optional(S.Boolean),
  clusterIdentifier: S.optional(S.String),
  workgroupName: S.optional(S.String),
  databaseName: S.optional(S.String),
}) {}
export class SalesforceConnectorProfileProperties extends S.Class<SalesforceConnectorProfileProperties>(
  "SalesforceConnectorProfileProperties",
)({
  instanceUrl: S.optional(S.String),
  isSandboxEnvironment: S.optional(S.Boolean),
  usePrivateLinkForMetadataAndAuthorization: S.optional(S.Boolean),
}) {}
export class ServiceNowConnectorProfileProperties extends S.Class<ServiceNowConnectorProfileProperties>(
  "ServiceNowConnectorProfileProperties",
)({ instanceUrl: S.String }) {}
export class SingularConnectorProfileProperties extends S.Class<SingularConnectorProfileProperties>(
  "SingularConnectorProfileProperties",
)({}) {}
export class SlackConnectorProfileProperties extends S.Class<SlackConnectorProfileProperties>(
  "SlackConnectorProfileProperties",
)({ instanceUrl: S.String }) {}
export class SnowflakeConnectorProfileProperties extends S.Class<SnowflakeConnectorProfileProperties>(
  "SnowflakeConnectorProfileProperties",
)({
  warehouse: S.String,
  stage: S.String,
  bucketName: S.String,
  bucketPrefix: S.optional(S.String),
  privateLinkServiceName: S.optional(S.String),
  accountName: S.optional(S.String),
  region: S.optional(S.String),
}) {}
export class TrendmicroConnectorProfileProperties extends S.Class<TrendmicroConnectorProfileProperties>(
  "TrendmicroConnectorProfileProperties",
)({}) {}
export class VeevaConnectorProfileProperties extends S.Class<VeevaConnectorProfileProperties>(
  "VeevaConnectorProfileProperties",
)({ instanceUrl: S.String }) {}
export class ZendeskConnectorProfileProperties extends S.Class<ZendeskConnectorProfileProperties>(
  "ZendeskConnectorProfileProperties",
)({ instanceUrl: S.String }) {}
export const OAuthScopeList = S.Array(S.String);
export class OAuthProperties extends S.Class<OAuthProperties>(
  "OAuthProperties",
)({ tokenUrl: S.String, authCodeUrl: S.String, oAuthScopes: OAuthScopeList }) {}
export class SAPODataConnectorProfileProperties extends S.Class<SAPODataConnectorProfileProperties>(
  "SAPODataConnectorProfileProperties",
)({
  applicationHostUrl: S.String,
  applicationServicePath: S.String,
  portNumber: S.Number,
  clientNumber: S.String,
  logonLanguage: S.optional(S.String),
  privateLinkServiceName: S.optional(S.String),
  oAuthProperties: S.optional(OAuthProperties),
  disableSSO: S.optional(S.Boolean),
}) {}
export const ProfilePropertiesMap = S.Record({
  key: S.String,
  value: S.String,
});
export const TokenUrlCustomProperties = S.Record({
  key: S.String,
  value: S.String,
});
export class OAuth2Properties extends S.Class<OAuth2Properties>(
  "OAuth2Properties",
)({
  tokenUrl: S.String,
  oAuth2GrantType: S.String,
  tokenUrlCustomProperties: S.optional(TokenUrlCustomProperties),
}) {}
export class CustomConnectorProfileProperties extends S.Class<CustomConnectorProfileProperties>(
  "CustomConnectorProfileProperties",
)({
  profileProperties: S.optional(ProfilePropertiesMap),
  oAuth2Properties: S.optional(OAuth2Properties),
}) {}
export class PardotConnectorProfileProperties extends S.Class<PardotConnectorProfileProperties>(
  "PardotConnectorProfileProperties",
)({
  instanceUrl: S.optional(S.String),
  isSandboxEnvironment: S.optional(S.Boolean),
  businessUnitId: S.optional(S.String),
}) {}
export class ConnectorProfileProperties extends S.Class<ConnectorProfileProperties>(
  "ConnectorProfileProperties",
)({
  Amplitude: S.optional(AmplitudeConnectorProfileProperties),
  Datadog: S.optional(DatadogConnectorProfileProperties),
  Dynatrace: S.optional(DynatraceConnectorProfileProperties),
  GoogleAnalytics: S.optional(GoogleAnalyticsConnectorProfileProperties),
  Honeycode: S.optional(HoneycodeConnectorProfileProperties),
  InforNexus: S.optional(InforNexusConnectorProfileProperties),
  Marketo: S.optional(MarketoConnectorProfileProperties),
  Redshift: S.optional(RedshiftConnectorProfileProperties),
  Salesforce: S.optional(SalesforceConnectorProfileProperties),
  ServiceNow: S.optional(ServiceNowConnectorProfileProperties),
  Singular: S.optional(SingularConnectorProfileProperties),
  Slack: S.optional(SlackConnectorProfileProperties),
  Snowflake: S.optional(SnowflakeConnectorProfileProperties),
  Trendmicro: S.optional(TrendmicroConnectorProfileProperties),
  Veeva: S.optional(VeevaConnectorProfileProperties),
  Zendesk: S.optional(ZendeskConnectorProfileProperties),
  SAPOData: S.optional(SAPODataConnectorProfileProperties),
  CustomConnector: S.optional(CustomConnectorProfileProperties),
  Pardot: S.optional(PardotConnectorProfileProperties),
}) {}
export class AmplitudeConnectorProfileCredentials extends S.Class<AmplitudeConnectorProfileCredentials>(
  "AmplitudeConnectorProfileCredentials",
)({ apiKey: S.String, secretKey: S.String }) {}
export class DatadogConnectorProfileCredentials extends S.Class<DatadogConnectorProfileCredentials>(
  "DatadogConnectorProfileCredentials",
)({ apiKey: S.String, applicationKey: S.String }) {}
export class DynatraceConnectorProfileCredentials extends S.Class<DynatraceConnectorProfileCredentials>(
  "DynatraceConnectorProfileCredentials",
)({ apiToken: S.String }) {}
export class ConnectorOAuthRequest extends S.Class<ConnectorOAuthRequest>(
  "ConnectorOAuthRequest",
)({ authCode: S.optional(S.String), redirectUri: S.optional(S.String) }) {}
export class GoogleAnalyticsConnectorProfileCredentials extends S.Class<GoogleAnalyticsConnectorProfileCredentials>(
  "GoogleAnalyticsConnectorProfileCredentials",
)({
  clientId: S.String,
  clientSecret: S.String,
  accessToken: S.optional(S.String),
  refreshToken: S.optional(S.String),
  oAuthRequest: S.optional(ConnectorOAuthRequest),
}) {}
export class HoneycodeConnectorProfileCredentials extends S.Class<HoneycodeConnectorProfileCredentials>(
  "HoneycodeConnectorProfileCredentials",
)({
  accessToken: S.optional(S.String),
  refreshToken: S.optional(S.String),
  oAuthRequest: S.optional(ConnectorOAuthRequest),
}) {}
export class InforNexusConnectorProfileCredentials extends S.Class<InforNexusConnectorProfileCredentials>(
  "InforNexusConnectorProfileCredentials",
)({
  accessKeyId: S.String,
  userId: S.String,
  secretAccessKey: S.String,
  datakey: S.String,
}) {}
export class MarketoConnectorProfileCredentials extends S.Class<MarketoConnectorProfileCredentials>(
  "MarketoConnectorProfileCredentials",
)({
  clientId: S.String,
  clientSecret: S.String,
  accessToken: S.optional(S.String),
  oAuthRequest: S.optional(ConnectorOAuthRequest),
}) {}
export class RedshiftConnectorProfileCredentials extends S.Class<RedshiftConnectorProfileCredentials>(
  "RedshiftConnectorProfileCredentials",
)({ username: S.optional(S.String), password: S.optional(S.String) }) {}
export class SalesforceConnectorProfileCredentials extends S.Class<SalesforceConnectorProfileCredentials>(
  "SalesforceConnectorProfileCredentials",
)({
  accessToken: S.optional(S.String),
  refreshToken: S.optional(S.String),
  oAuthRequest: S.optional(ConnectorOAuthRequest),
  clientCredentialsArn: S.optional(S.String),
  oAuth2GrantType: S.optional(S.String),
  jwtToken: S.optional(S.String),
}) {}
export class OAuth2Credentials extends S.Class<OAuth2Credentials>(
  "OAuth2Credentials",
)({
  clientId: S.optional(S.String),
  clientSecret: S.optional(S.String),
  accessToken: S.optional(S.String),
  refreshToken: S.optional(S.String),
  oAuthRequest: S.optional(ConnectorOAuthRequest),
}) {}
export class ServiceNowConnectorProfileCredentials extends S.Class<ServiceNowConnectorProfileCredentials>(
  "ServiceNowConnectorProfileCredentials",
)({
  username: S.optional(S.String),
  password: S.optional(S.String),
  oAuth2Credentials: S.optional(OAuth2Credentials),
}) {}
export class SingularConnectorProfileCredentials extends S.Class<SingularConnectorProfileCredentials>(
  "SingularConnectorProfileCredentials",
)({ apiKey: S.String }) {}
export class SlackConnectorProfileCredentials extends S.Class<SlackConnectorProfileCredentials>(
  "SlackConnectorProfileCredentials",
)({
  clientId: S.String,
  clientSecret: S.String,
  accessToken: S.optional(S.String),
  oAuthRequest: S.optional(ConnectorOAuthRequest),
}) {}
export class SnowflakeConnectorProfileCredentials extends S.Class<SnowflakeConnectorProfileCredentials>(
  "SnowflakeConnectorProfileCredentials",
)({ username: S.String, password: S.String }) {}
export class TrendmicroConnectorProfileCredentials extends S.Class<TrendmicroConnectorProfileCredentials>(
  "TrendmicroConnectorProfileCredentials",
)({ apiSecretKey: S.String }) {}
export class VeevaConnectorProfileCredentials extends S.Class<VeevaConnectorProfileCredentials>(
  "VeevaConnectorProfileCredentials",
)({ username: S.String, password: S.String }) {}
export class ZendeskConnectorProfileCredentials extends S.Class<ZendeskConnectorProfileCredentials>(
  "ZendeskConnectorProfileCredentials",
)({
  clientId: S.String,
  clientSecret: S.String,
  accessToken: S.optional(S.String),
  oAuthRequest: S.optional(ConnectorOAuthRequest),
}) {}
export class BasicAuthCredentials extends S.Class<BasicAuthCredentials>(
  "BasicAuthCredentials",
)({ username: S.String, password: S.String }) {}
export class OAuthCredentials extends S.Class<OAuthCredentials>(
  "OAuthCredentials",
)({
  clientId: S.String,
  clientSecret: S.String,
  accessToken: S.optional(S.String),
  refreshToken: S.optional(S.String),
  oAuthRequest: S.optional(ConnectorOAuthRequest),
}) {}
export class SAPODataConnectorProfileCredentials extends S.Class<SAPODataConnectorProfileCredentials>(
  "SAPODataConnectorProfileCredentials",
)({
  basicAuthCredentials: S.optional(BasicAuthCredentials),
  oAuthCredentials: S.optional(OAuthCredentials),
}) {}
export class ApiKeyCredentials extends S.Class<ApiKeyCredentials>(
  "ApiKeyCredentials",
)({ apiKey: S.String, apiSecretKey: S.optional(S.String) }) {}
export const CredentialsMap = S.Record({ key: S.String, value: S.String });
export class CustomAuthCredentials extends S.Class<CustomAuthCredentials>(
  "CustomAuthCredentials",
)({
  customAuthenticationType: S.String,
  credentialsMap: S.optional(CredentialsMap),
}) {}
export class CustomConnectorProfileCredentials extends S.Class<CustomConnectorProfileCredentials>(
  "CustomConnectorProfileCredentials",
)({
  authenticationType: S.String,
  basic: S.optional(BasicAuthCredentials),
  oauth2: S.optional(OAuth2Credentials),
  apiKey: S.optional(ApiKeyCredentials),
  custom: S.optional(CustomAuthCredentials),
}) {}
export class PardotConnectorProfileCredentials extends S.Class<PardotConnectorProfileCredentials>(
  "PardotConnectorProfileCredentials",
)({
  accessToken: S.optional(S.String),
  refreshToken: S.optional(S.String),
  oAuthRequest: S.optional(ConnectorOAuthRequest),
  clientCredentialsArn: S.optional(S.String),
}) {}
export class ConnectorProfileCredentials extends S.Class<ConnectorProfileCredentials>(
  "ConnectorProfileCredentials",
)({
  Amplitude: S.optional(AmplitudeConnectorProfileCredentials),
  Datadog: S.optional(DatadogConnectorProfileCredentials),
  Dynatrace: S.optional(DynatraceConnectorProfileCredentials),
  GoogleAnalytics: S.optional(GoogleAnalyticsConnectorProfileCredentials),
  Honeycode: S.optional(HoneycodeConnectorProfileCredentials),
  InforNexus: S.optional(InforNexusConnectorProfileCredentials),
  Marketo: S.optional(MarketoConnectorProfileCredentials),
  Redshift: S.optional(RedshiftConnectorProfileCredentials),
  Salesforce: S.optional(SalesforceConnectorProfileCredentials),
  ServiceNow: S.optional(ServiceNowConnectorProfileCredentials),
  Singular: S.optional(SingularConnectorProfileCredentials),
  Slack: S.optional(SlackConnectorProfileCredentials),
  Snowflake: S.optional(SnowflakeConnectorProfileCredentials),
  Trendmicro: S.optional(TrendmicroConnectorProfileCredentials),
  Veeva: S.optional(VeevaConnectorProfileCredentials),
  Zendesk: S.optional(ZendeskConnectorProfileCredentials),
  SAPOData: S.optional(SAPODataConnectorProfileCredentials),
  CustomConnector: S.optional(CustomConnectorProfileCredentials),
  Pardot: S.optional(PardotConnectorProfileCredentials),
}) {}
export class ConnectorProfileConfig extends S.Class<ConnectorProfileConfig>(
  "ConnectorProfileConfig",
)({
  connectorProfileProperties: ConnectorProfileProperties,
  connectorProfileCredentials: S.optional(ConnectorProfileCredentials),
}) {}
export class UpdateConnectorProfileRequest extends S.Class<UpdateConnectorProfileRequest>(
  "UpdateConnectorProfileRequest",
)(
  {
    connectorProfileName: S.String,
    connectionMode: S.String,
    connectorProfileConfig: ConnectorProfileConfig,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-connector-profile" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LambdaConnectorProvisioningConfig extends S.Class<LambdaConnectorProvisioningConfig>(
  "LambdaConnectorProvisioningConfig",
)({ lambdaArn: S.String }) {}
export class ConnectorProvisioningConfig extends S.Class<ConnectorProvisioningConfig>(
  "ConnectorProvisioningConfig",
)({ lambda: S.optional(LambdaConnectorProvisioningConfig) }) {}
export class UpdateConnectorRegistrationRequest extends S.Class<UpdateConnectorRegistrationRequest>(
  "UpdateConnectorRegistrationRequest",
)(
  {
    connectorLabel: S.String,
    description: S.optional(S.String),
    connectorProvisioningConfig: S.optional(ConnectorProvisioningConfig),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-connector-registration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ScheduledTriggerProperties extends S.Class<ScheduledTriggerProperties>(
  "ScheduledTriggerProperties",
)({
  scheduleExpression: S.String,
  dataPullMode: S.optional(S.String),
  scheduleStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  scheduleEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  timezone: S.optional(S.String),
  scheduleOffset: S.optional(S.Number),
  firstExecutionFrom: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  flowErrorDeactivationThreshold: S.optional(S.Number),
}) {}
export class TriggerProperties extends S.Class<TriggerProperties>(
  "TriggerProperties",
)({ Scheduled: S.optional(ScheduledTriggerProperties) }) {}
export class TriggerConfig extends S.Class<TriggerConfig>("TriggerConfig")({
  triggerType: S.String,
  triggerProperties: S.optional(TriggerProperties),
}) {}
export class AmplitudeSourceProperties extends S.Class<AmplitudeSourceProperties>(
  "AmplitudeSourceProperties",
)({ object: S.String }) {}
export class DatadogSourceProperties extends S.Class<DatadogSourceProperties>(
  "DatadogSourceProperties",
)({ object: S.String }) {}
export class DynatraceSourceProperties extends S.Class<DynatraceSourceProperties>(
  "DynatraceSourceProperties",
)({ object: S.String }) {}
export class GoogleAnalyticsSourceProperties extends S.Class<GoogleAnalyticsSourceProperties>(
  "GoogleAnalyticsSourceProperties",
)({ object: S.String }) {}
export class InforNexusSourceProperties extends S.Class<InforNexusSourceProperties>(
  "InforNexusSourceProperties",
)({ object: S.String }) {}
export class MarketoSourceProperties extends S.Class<MarketoSourceProperties>(
  "MarketoSourceProperties",
)({ object: S.String }) {}
export class S3InputFormatConfig extends S.Class<S3InputFormatConfig>(
  "S3InputFormatConfig",
)({ s3InputFileType: S.optional(S.String) }) {}
export class S3SourceProperties extends S.Class<S3SourceProperties>(
  "S3SourceProperties",
)({
  bucketName: S.String,
  bucketPrefix: S.optional(S.String),
  s3InputFormatConfig: S.optional(S3InputFormatConfig),
}) {}
export class SalesforceSourceProperties extends S.Class<SalesforceSourceProperties>(
  "SalesforceSourceProperties",
)({
  object: S.String,
  enableDynamicFieldUpdate: S.optional(S.Boolean),
  includeDeletedRecords: S.optional(S.Boolean),
  dataTransferApi: S.optional(S.String),
}) {}
export class ServiceNowSourceProperties extends S.Class<ServiceNowSourceProperties>(
  "ServiceNowSourceProperties",
)({ object: S.String }) {}
export class SingularSourceProperties extends S.Class<SingularSourceProperties>(
  "SingularSourceProperties",
)({ object: S.String }) {}
export class SlackSourceProperties extends S.Class<SlackSourceProperties>(
  "SlackSourceProperties",
)({ object: S.String }) {}
export class TrendmicroSourceProperties extends S.Class<TrendmicroSourceProperties>(
  "TrendmicroSourceProperties",
)({ object: S.String }) {}
export class VeevaSourceProperties extends S.Class<VeevaSourceProperties>(
  "VeevaSourceProperties",
)({
  object: S.String,
  documentType: S.optional(S.String),
  includeSourceFiles: S.optional(S.Boolean),
  includeRenditions: S.optional(S.Boolean),
  includeAllVersions: S.optional(S.Boolean),
}) {}
export class ZendeskSourceProperties extends S.Class<ZendeskSourceProperties>(
  "ZendeskSourceProperties",
)({ object: S.String }) {}
export class SAPODataParallelismConfig extends S.Class<SAPODataParallelismConfig>(
  "SAPODataParallelismConfig",
)({ maxParallelism: S.Number }) {}
export class SAPODataPaginationConfig extends S.Class<SAPODataPaginationConfig>(
  "SAPODataPaginationConfig",
)({ maxPageSize: S.Number }) {}
export class SAPODataSourceProperties extends S.Class<SAPODataSourceProperties>(
  "SAPODataSourceProperties",
)({
  objectPath: S.optional(S.String),
  parallelismConfig: S.optional(SAPODataParallelismConfig),
  paginationConfig: S.optional(SAPODataPaginationConfig),
}) {}
export const CustomProperties = S.Record({ key: S.String, value: S.String });
export class DataTransferApi extends S.Class<DataTransferApi>(
  "DataTransferApi",
)({ Name: S.optional(S.String), Type: S.optional(S.String) }) {}
export class CustomConnectorSourceProperties extends S.Class<CustomConnectorSourceProperties>(
  "CustomConnectorSourceProperties",
)({
  entityName: S.String,
  customProperties: S.optional(CustomProperties),
  dataTransferApi: S.optional(DataTransferApi),
}) {}
export class PardotSourceProperties extends S.Class<PardotSourceProperties>(
  "PardotSourceProperties",
)({ object: S.String }) {}
export class SourceConnectorProperties extends S.Class<SourceConnectorProperties>(
  "SourceConnectorProperties",
)({
  Amplitude: S.optional(AmplitudeSourceProperties),
  Datadog: S.optional(DatadogSourceProperties),
  Dynatrace: S.optional(DynatraceSourceProperties),
  GoogleAnalytics: S.optional(GoogleAnalyticsSourceProperties),
  InforNexus: S.optional(InforNexusSourceProperties),
  Marketo: S.optional(MarketoSourceProperties),
  S3: S.optional(S3SourceProperties),
  Salesforce: S.optional(SalesforceSourceProperties),
  ServiceNow: S.optional(ServiceNowSourceProperties),
  Singular: S.optional(SingularSourceProperties),
  Slack: S.optional(SlackSourceProperties),
  Trendmicro: S.optional(TrendmicroSourceProperties),
  Veeva: S.optional(VeevaSourceProperties),
  Zendesk: S.optional(ZendeskSourceProperties),
  SAPOData: S.optional(SAPODataSourceProperties),
  CustomConnector: S.optional(CustomConnectorSourceProperties),
  Pardot: S.optional(PardotSourceProperties),
}) {}
export class IncrementalPullConfig extends S.Class<IncrementalPullConfig>(
  "IncrementalPullConfig",
)({ datetimeTypeFieldName: S.optional(S.String) }) {}
export class SourceFlowConfig extends S.Class<SourceFlowConfig>(
  "SourceFlowConfig",
)({
  connectorType: S.String,
  apiVersion: S.optional(S.String),
  connectorProfileName: S.optional(S.String),
  sourceConnectorProperties: SourceConnectorProperties,
  incrementalPullConfig: S.optional(IncrementalPullConfig),
}) {}
export class ErrorHandlingConfig extends S.Class<ErrorHandlingConfig>(
  "ErrorHandlingConfig",
)({
  failOnFirstDestinationError: S.optional(S.Boolean),
  bucketPrefix: S.optional(S.String),
  bucketName: S.optional(S.String),
}) {}
export class RedshiftDestinationProperties extends S.Class<RedshiftDestinationProperties>(
  "RedshiftDestinationProperties",
)({
  object: S.String,
  intermediateBucketName: S.String,
  bucketPrefix: S.optional(S.String),
  errorHandlingConfig: S.optional(ErrorHandlingConfig),
}) {}
export const PathPrefixHierarchy = S.Array(S.String);
export class PrefixConfig extends S.Class<PrefixConfig>("PrefixConfig")({
  prefixType: S.optional(S.String),
  prefixFormat: S.optional(S.String),
  pathPrefixHierarchy: S.optional(PathPrefixHierarchy),
}) {}
export class AggregationConfig extends S.Class<AggregationConfig>(
  "AggregationConfig",
)({
  aggregationType: S.optional(S.String),
  targetFileSize: S.optional(S.Number),
}) {}
export class S3OutputFormatConfig extends S.Class<S3OutputFormatConfig>(
  "S3OutputFormatConfig",
)({
  fileType: S.optional(S.String),
  prefixConfig: S.optional(PrefixConfig),
  aggregationConfig: S.optional(AggregationConfig),
  preserveSourceDataTyping: S.optional(S.Boolean),
}) {}
export class S3DestinationProperties extends S.Class<S3DestinationProperties>(
  "S3DestinationProperties",
)({
  bucketName: S.String,
  bucketPrefix: S.optional(S.String),
  s3OutputFormatConfig: S.optional(S3OutputFormatConfig),
}) {}
export const IdFieldNameList = S.Array(S.String);
export class SalesforceDestinationProperties extends S.Class<SalesforceDestinationProperties>(
  "SalesforceDestinationProperties",
)({
  object: S.String,
  idFieldNames: S.optional(IdFieldNameList),
  errorHandlingConfig: S.optional(ErrorHandlingConfig),
  writeOperationType: S.optional(S.String),
  dataTransferApi: S.optional(S.String),
}) {}
export class SnowflakeDestinationProperties extends S.Class<SnowflakeDestinationProperties>(
  "SnowflakeDestinationProperties",
)({
  object: S.String,
  intermediateBucketName: S.String,
  bucketPrefix: S.optional(S.String),
  errorHandlingConfig: S.optional(ErrorHandlingConfig),
}) {}
export class EventBridgeDestinationProperties extends S.Class<EventBridgeDestinationProperties>(
  "EventBridgeDestinationProperties",
)({ object: S.String, errorHandlingConfig: S.optional(ErrorHandlingConfig) }) {}
export class LookoutMetricsDestinationProperties extends S.Class<LookoutMetricsDestinationProperties>(
  "LookoutMetricsDestinationProperties",
)({}) {}
export class UpsolverS3OutputFormatConfig extends S.Class<UpsolverS3OutputFormatConfig>(
  "UpsolverS3OutputFormatConfig",
)({
  fileType: S.optional(S.String),
  prefixConfig: PrefixConfig,
  aggregationConfig: S.optional(AggregationConfig),
}) {}
export class UpsolverDestinationProperties extends S.Class<UpsolverDestinationProperties>(
  "UpsolverDestinationProperties",
)({
  bucketName: S.String,
  bucketPrefix: S.optional(S.String),
  s3OutputFormatConfig: UpsolverS3OutputFormatConfig,
}) {}
export class HoneycodeDestinationProperties extends S.Class<HoneycodeDestinationProperties>(
  "HoneycodeDestinationProperties",
)({ object: S.String, errorHandlingConfig: S.optional(ErrorHandlingConfig) }) {}
export class CustomerProfilesDestinationProperties extends S.Class<CustomerProfilesDestinationProperties>(
  "CustomerProfilesDestinationProperties",
)({ domainName: S.String, objectTypeName: S.optional(S.String) }) {}
export class ZendeskDestinationProperties extends S.Class<ZendeskDestinationProperties>(
  "ZendeskDestinationProperties",
)({
  object: S.String,
  idFieldNames: S.optional(IdFieldNameList),
  errorHandlingConfig: S.optional(ErrorHandlingConfig),
  writeOperationType: S.optional(S.String),
}) {}
export class MarketoDestinationProperties extends S.Class<MarketoDestinationProperties>(
  "MarketoDestinationProperties",
)({ object: S.String, errorHandlingConfig: S.optional(ErrorHandlingConfig) }) {}
export class CustomConnectorDestinationProperties extends S.Class<CustomConnectorDestinationProperties>(
  "CustomConnectorDestinationProperties",
)({
  entityName: S.String,
  errorHandlingConfig: S.optional(ErrorHandlingConfig),
  writeOperationType: S.optional(S.String),
  idFieldNames: S.optional(IdFieldNameList),
  customProperties: S.optional(CustomProperties),
}) {}
export class SuccessResponseHandlingConfig extends S.Class<SuccessResponseHandlingConfig>(
  "SuccessResponseHandlingConfig",
)({ bucketPrefix: S.optional(S.String), bucketName: S.optional(S.String) }) {}
export class SAPODataDestinationProperties extends S.Class<SAPODataDestinationProperties>(
  "SAPODataDestinationProperties",
)({
  objectPath: S.String,
  successResponseHandlingConfig: S.optional(SuccessResponseHandlingConfig),
  idFieldNames: S.optional(IdFieldNameList),
  errorHandlingConfig: S.optional(ErrorHandlingConfig),
  writeOperationType: S.optional(S.String),
}) {}
export class DestinationConnectorProperties extends S.Class<DestinationConnectorProperties>(
  "DestinationConnectorProperties",
)({
  Redshift: S.optional(RedshiftDestinationProperties),
  S3: S.optional(S3DestinationProperties),
  Salesforce: S.optional(SalesforceDestinationProperties),
  Snowflake: S.optional(SnowflakeDestinationProperties),
  EventBridge: S.optional(EventBridgeDestinationProperties),
  LookoutMetrics: S.optional(LookoutMetricsDestinationProperties),
  Upsolver: S.optional(UpsolverDestinationProperties),
  Honeycode: S.optional(HoneycodeDestinationProperties),
  CustomerProfiles: S.optional(CustomerProfilesDestinationProperties),
  Zendesk: S.optional(ZendeskDestinationProperties),
  Marketo: S.optional(MarketoDestinationProperties),
  CustomConnector: S.optional(CustomConnectorDestinationProperties),
  SAPOData: S.optional(SAPODataDestinationProperties),
}) {}
export class DestinationFlowConfig extends S.Class<DestinationFlowConfig>(
  "DestinationFlowConfig",
)({
  connectorType: S.String,
  apiVersion: S.optional(S.String),
  connectorProfileName: S.optional(S.String),
  destinationConnectorProperties: DestinationConnectorProperties,
}) {}
export const DestinationFlowConfigList = S.Array(DestinationFlowConfig);
export const SourceFields = S.Array(S.String);
export class ConnectorOperator extends S.Class<ConnectorOperator>(
  "ConnectorOperator",
)({
  Amplitude: S.optional(S.String),
  Datadog: S.optional(S.String),
  Dynatrace: S.optional(S.String),
  GoogleAnalytics: S.optional(S.String),
  InforNexus: S.optional(S.String),
  Marketo: S.optional(S.String),
  S3: S.optional(S.String),
  Salesforce: S.optional(S.String),
  ServiceNow: S.optional(S.String),
  Singular: S.optional(S.String),
  Slack: S.optional(S.String),
  Trendmicro: S.optional(S.String),
  Veeva: S.optional(S.String),
  Zendesk: S.optional(S.String),
  SAPOData: S.optional(S.String),
  CustomConnector: S.optional(S.String),
  Pardot: S.optional(S.String),
}) {}
export const TaskPropertiesMap = S.Record({ key: S.String, value: S.String });
export class Task extends S.Class<Task>("Task")({
  sourceFields: SourceFields,
  connectorOperator: S.optional(ConnectorOperator),
  destinationField: S.optional(S.String),
  taskType: S.String,
  taskProperties: S.optional(TaskPropertiesMap),
}) {}
export const Tasks = S.Array(Task);
export class GlueDataCatalogConfig extends S.Class<GlueDataCatalogConfig>(
  "GlueDataCatalogConfig",
)({ roleArn: S.String, databaseName: S.String, tablePrefix: S.String }) {}
export class MetadataCatalogConfig extends S.Class<MetadataCatalogConfig>(
  "MetadataCatalogConfig",
)({ glueDataCatalog: S.optional(GlueDataCatalogConfig) }) {}
export class UpdateFlowRequest extends S.Class<UpdateFlowRequest>(
  "UpdateFlowRequest",
)(
  {
    flowName: S.String,
    description: S.optional(S.String),
    triggerConfig: TriggerConfig,
    sourceFlowConfig: SourceFlowConfig,
    destinationFlowConfigList: DestinationFlowConfigList,
    tasks: Tasks,
    metadataCatalogConfig: S.optional(MetadataCatalogConfig),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-flow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelFlowExecutionsResponse extends S.Class<CancelFlowExecutionsResponse>(
  "CancelFlowExecutionsResponse",
)({ invalidExecutions: S.optional(ExecutionIds) }) {}
export const ConnectorModeList = S.Array(S.String);
export const SupportedDataTransferTypeList = S.Array(S.String);
export class ConnectorDetail extends S.Class<ConnectorDetail>(
  "ConnectorDetail",
)({
  connectorDescription: S.optional(S.String),
  connectorName: S.optional(S.String),
  connectorOwner: S.optional(S.String),
  connectorVersion: S.optional(S.String),
  applicationType: S.optional(S.String),
  connectorType: S.optional(S.String),
  connectorLabel: S.optional(S.String),
  registeredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  registeredBy: S.optional(S.String),
  connectorProvisioningType: S.optional(S.String),
  connectorModes: S.optional(ConnectorModeList),
  supportedDataTransferTypes: S.optional(SupportedDataTransferTypeList),
}) {}
export const ConnectorList = S.Array(ConnectorDetail);
export class ListConnectorsResponse extends S.Class<ListConnectorsResponse>(
  "ListConnectorsResponse",
)({ connectors: S.optional(ConnectorList), nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class StartFlowResponse extends S.Class<StartFlowResponse>(
  "StartFlowResponse",
)({
  flowArn: S.optional(S.String),
  flowStatus: S.optional(S.String),
  executionId: S.optional(S.String),
}) {}
export class StopFlowResponse extends S.Class<StopFlowResponse>(
  "StopFlowResponse",
)({ flowArn: S.optional(S.String), flowStatus: S.optional(S.String) }) {}
export class UpdateConnectorProfileResponse extends S.Class<UpdateConnectorProfileResponse>(
  "UpdateConnectorProfileResponse",
)({ connectorProfileArn: S.optional(S.String) }) {}
export class UpdateConnectorRegistrationResponse extends S.Class<UpdateConnectorRegistrationResponse>(
  "UpdateConnectorRegistrationResponse",
)({ connectorArn: S.optional(S.String) }) {}
export class UpdateFlowResponse extends S.Class<UpdateFlowResponse>(
  "UpdateFlowResponse",
)({ flowStatus: S.optional(S.String) }) {}
export const SchedulingFrequencyTypeList = S.Array(S.String);
export const TriggerTypeList = S.Array(S.String);
export const SupportedApiVersionList = S.Array(S.String);
export const SupportedOperatorList = S.Array(S.String);
export const SupportedWriteOperationList = S.Array(S.String);
export class AmplitudeMetadata extends S.Class<AmplitudeMetadata>(
  "AmplitudeMetadata",
)({}) {}
export class DatadogMetadata extends S.Class<DatadogMetadata>(
  "DatadogMetadata",
)({}) {}
export class DynatraceMetadata extends S.Class<DynatraceMetadata>(
  "DynatraceMetadata",
)({}) {}
export class GoogleAnalyticsMetadata extends S.Class<GoogleAnalyticsMetadata>(
  "GoogleAnalyticsMetadata",
)({ oAuthScopes: S.optional(OAuthScopeList) }) {}
export class InforNexusMetadata extends S.Class<InforNexusMetadata>(
  "InforNexusMetadata",
)({}) {}
export class MarketoMetadata extends S.Class<MarketoMetadata>(
  "MarketoMetadata",
)({}) {}
export class RedshiftMetadata extends S.Class<RedshiftMetadata>(
  "RedshiftMetadata",
)({}) {}
export class S3Metadata extends S.Class<S3Metadata>("S3Metadata")({}) {}
export const SalesforceDataTransferApiList = S.Array(S.String);
export const OAuth2GrantTypeSupportedList = S.Array(S.String);
export class SalesforceMetadata extends S.Class<SalesforceMetadata>(
  "SalesforceMetadata",
)({
  oAuthScopes: S.optional(OAuthScopeList),
  dataTransferApis: S.optional(SalesforceDataTransferApiList),
  oauth2GrantTypesSupported: S.optional(OAuth2GrantTypeSupportedList),
}) {}
export class ServiceNowMetadata extends S.Class<ServiceNowMetadata>(
  "ServiceNowMetadata",
)({}) {}
export class SingularMetadata extends S.Class<SingularMetadata>(
  "SingularMetadata",
)({}) {}
export class SlackMetadata extends S.Class<SlackMetadata>("SlackMetadata")({
  oAuthScopes: S.optional(OAuthScopeList),
}) {}
export const RegionList = S.Array(S.String);
export class SnowflakeMetadata extends S.Class<SnowflakeMetadata>(
  "SnowflakeMetadata",
)({ supportedRegions: S.optional(RegionList) }) {}
export class TrendmicroMetadata extends S.Class<TrendmicroMetadata>(
  "TrendmicroMetadata",
)({}) {}
export class VeevaMetadata extends S.Class<VeevaMetadata>("VeevaMetadata")(
  {},
) {}
export class ZendeskMetadata extends S.Class<ZendeskMetadata>(
  "ZendeskMetadata",
)({ oAuthScopes: S.optional(OAuthScopeList) }) {}
export class EventBridgeMetadata extends S.Class<EventBridgeMetadata>(
  "EventBridgeMetadata",
)({}) {}
export class UpsolverMetadata extends S.Class<UpsolverMetadata>(
  "UpsolverMetadata",
)({}) {}
export class CustomerProfilesMetadata extends S.Class<CustomerProfilesMetadata>(
  "CustomerProfilesMetadata",
)({}) {}
export class HoneycodeMetadata extends S.Class<HoneycodeMetadata>(
  "HoneycodeMetadata",
)({ oAuthScopes: S.optional(OAuthScopeList) }) {}
export class SAPODataMetadata extends S.Class<SAPODataMetadata>(
  "SAPODataMetadata",
)({}) {}
export class PardotMetadata extends S.Class<PardotMetadata>("PardotMetadata")(
  {},
) {}
export class ConnectorMetadata extends S.Class<ConnectorMetadata>(
  "ConnectorMetadata",
)({
  Amplitude: S.optional(AmplitudeMetadata),
  Datadog: S.optional(DatadogMetadata),
  Dynatrace: S.optional(DynatraceMetadata),
  GoogleAnalytics: S.optional(GoogleAnalyticsMetadata),
  InforNexus: S.optional(InforNexusMetadata),
  Marketo: S.optional(MarketoMetadata),
  Redshift: S.optional(RedshiftMetadata),
  S3: S.optional(S3Metadata),
  Salesforce: S.optional(SalesforceMetadata),
  ServiceNow: S.optional(ServiceNowMetadata),
  Singular: S.optional(SingularMetadata),
  Slack: S.optional(SlackMetadata),
  Snowflake: S.optional(SnowflakeMetadata),
  Trendmicro: S.optional(TrendmicroMetadata),
  Veeva: S.optional(VeevaMetadata),
  Zendesk: S.optional(ZendeskMetadata),
  EventBridge: S.optional(EventBridgeMetadata),
  Upsolver: S.optional(UpsolverMetadata),
  CustomerProfiles: S.optional(CustomerProfilesMetadata),
  Honeycode: S.optional(HoneycodeMetadata),
  SAPOData: S.optional(SAPODataMetadata),
  Pardot: S.optional(PardotMetadata),
}) {}
export const TokenUrlList = S.Array(S.String);
export const AuthCodeUrlList = S.Array(S.String);
export const ConnectorSuppliedValueList = S.Array(S.String);
export class OAuth2CustomParameter extends S.Class<OAuth2CustomParameter>(
  "OAuth2CustomParameter",
)({
  key: S.optional(S.String),
  isRequired: S.optional(S.Boolean),
  label: S.optional(S.String),
  description: S.optional(S.String),
  isSensitiveField: S.optional(S.Boolean),
  connectorSuppliedValues: S.optional(ConnectorSuppliedValueList),
  type: S.optional(S.String),
}) {}
export const OAuth2CustomPropertiesList = S.Array(OAuth2CustomParameter);
export class OAuth2Defaults extends S.Class<OAuth2Defaults>("OAuth2Defaults")({
  oauthScopes: S.optional(OAuthScopeList),
  tokenUrls: S.optional(TokenUrlList),
  authCodeUrls: S.optional(AuthCodeUrlList),
  oauth2GrantTypesSupported: S.optional(OAuth2GrantTypeSupportedList),
  oauth2CustomProperties: S.optional(OAuth2CustomPropertiesList),
}) {}
export class AuthParameter extends S.Class<AuthParameter>("AuthParameter")({
  key: S.optional(S.String),
  isRequired: S.optional(S.Boolean),
  label: S.optional(S.String),
  description: S.optional(S.String),
  isSensitiveField: S.optional(S.Boolean),
  connectorSuppliedValues: S.optional(ConnectorSuppliedValueList),
}) {}
export const AuthParameterList = S.Array(AuthParameter);
export class CustomAuthConfig extends S.Class<CustomAuthConfig>(
  "CustomAuthConfig",
)({
  customAuthenticationType: S.optional(S.String),
  authParameters: S.optional(AuthParameterList),
}) {}
export const CustomAuthConfigList = S.Array(CustomAuthConfig);
export class AuthenticationConfig extends S.Class<AuthenticationConfig>(
  "AuthenticationConfig",
)({
  isBasicAuthSupported: S.optional(S.Boolean),
  isApiKeyAuthSupported: S.optional(S.Boolean),
  isOAuth2Supported: S.optional(S.Boolean),
  isCustomAuthSupported: S.optional(S.Boolean),
  oAuth2Defaults: S.optional(OAuth2Defaults),
  customAuthConfigs: S.optional(CustomAuthConfigList),
}) {}
export const ConnectorSuppliedValueOptionList = S.Array(S.String);
export class ConnectorRuntimeSetting extends S.Class<ConnectorRuntimeSetting>(
  "ConnectorRuntimeSetting",
)({
  key: S.optional(S.String),
  dataType: S.optional(S.String),
  isRequired: S.optional(S.Boolean),
  label: S.optional(S.String),
  description: S.optional(S.String),
  scope: S.optional(S.String),
  connectorSuppliedValueOptions: S.optional(ConnectorSuppliedValueOptionList),
}) {}
export const ConnectorRuntimeSettingList = S.Array(ConnectorRuntimeSetting);
export const SupportedDataTransferApis = S.Array(DataTransferApi);
export class ConnectorConfiguration extends S.Class<ConnectorConfiguration>(
  "ConnectorConfiguration",
)({
  canUseAsSource: S.optional(S.Boolean),
  canUseAsDestination: S.optional(S.Boolean),
  supportedDestinationConnectors: S.optional(ConnectorTypeList),
  supportedSchedulingFrequencies: S.optional(SchedulingFrequencyTypeList),
  isPrivateLinkEnabled: S.optional(S.Boolean),
  isPrivateLinkEndpointUrlRequired: S.optional(S.Boolean),
  supportedTriggerTypes: S.optional(TriggerTypeList),
  connectorMetadata: S.optional(ConnectorMetadata),
  connectorType: S.optional(S.String),
  connectorLabel: S.optional(S.String),
  connectorDescription: S.optional(S.String),
  connectorOwner: S.optional(S.String),
  connectorName: S.optional(S.String),
  connectorVersion: S.optional(S.String),
  connectorArn: S.optional(S.String),
  connectorModes: S.optional(ConnectorModeList),
  authenticationConfig: S.optional(AuthenticationConfig),
  connectorRuntimeSettings: S.optional(ConnectorRuntimeSettingList),
  supportedApiVersions: S.optional(SupportedApiVersionList),
  supportedOperators: S.optional(SupportedOperatorList),
  supportedWriteOperations: S.optional(SupportedWriteOperationList),
  connectorProvisioningType: S.optional(S.String),
  connectorProvisioningConfig: S.optional(ConnectorProvisioningConfig),
  logoURL: S.optional(S.String),
  registeredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  registeredBy: S.optional(S.String),
  supportedDataTransferTypes: S.optional(SupportedDataTransferTypeList),
  supportedDataTransferApis: S.optional(SupportedDataTransferApis),
}) {}
export const ConnectorConfigurationsMap = S.Record({
  key: S.String,
  value: ConnectorConfiguration,
});
export class ExecutionDetails extends S.Class<ExecutionDetails>(
  "ExecutionDetails",
)({
  mostRecentExecutionMessage: S.optional(S.String),
  mostRecentExecutionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  mostRecentExecutionStatus: S.optional(S.String),
}) {}
export class FlowDefinition extends S.Class<FlowDefinition>("FlowDefinition")({
  flowArn: S.optional(S.String),
  description: S.optional(S.String),
  flowName: S.optional(S.String),
  flowStatus: S.optional(S.String),
  sourceConnectorType: S.optional(S.String),
  sourceConnectorLabel: S.optional(S.String),
  destinationConnectorType: S.optional(S.String),
  destinationConnectorLabel: S.optional(S.String),
  triggerType: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  lastUpdatedBy: S.optional(S.String),
  tags: S.optional(TagMap),
  lastRunExecutionDetails: S.optional(ExecutionDetails),
}) {}
export const FlowList = S.Array(FlowDefinition);
export class DescribeConnectorsResponse extends S.Class<DescribeConnectorsResponse>(
  "DescribeConnectorsResponse",
)({
  connectorConfigurations: S.optional(ConnectorConfigurationsMap),
  connectors: S.optional(ConnectorList),
  nextToken: S.optional(S.String),
}) {}
export class ListFlowsResponse extends S.Class<ListFlowsResponse>(
  "ListFlowsResponse",
)({ flows: S.optional(FlowList), nextToken: S.optional(S.String) }) {}
export class RegisterConnectorRequest extends S.Class<RegisterConnectorRequest>(
  "RegisterConnectorRequest",
)(
  {
    connectorLabel: S.optional(S.String),
    description: S.optional(S.String),
    connectorProvisioningType: S.optional(S.String),
    connectorProvisioningConfig: S.optional(ConnectorProvisioningConfig),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/register-connector" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SourceFieldProperties extends S.Class<SourceFieldProperties>(
  "SourceFieldProperties",
)({
  isRetrievable: S.optional(S.Boolean),
  isQueryable: S.optional(S.Boolean),
  isTimestampFieldForIncrementalQueries: S.optional(S.Boolean),
}) {}
export class DestinationFieldProperties extends S.Class<DestinationFieldProperties>(
  "DestinationFieldProperties",
)({
  isCreatable: S.optional(S.Boolean),
  isNullable: S.optional(S.Boolean),
  isUpsertable: S.optional(S.Boolean),
  isUpdatable: S.optional(S.Boolean),
  isDefaultedOnCreate: S.optional(S.Boolean),
  supportedWriteOperations: S.optional(SupportedWriteOperationList),
}) {}
export class PrivateConnectionProvisioningState extends S.Class<PrivateConnectionProvisioningState>(
  "PrivateConnectionProvisioningState",
)({
  status: S.optional(S.String),
  failureMessage: S.optional(S.String),
  failureCause: S.optional(S.String),
}) {}
export class RegistrationOutput extends S.Class<RegistrationOutput>(
  "RegistrationOutput",
)({
  message: S.optional(S.String),
  result: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class ConnectorEntity extends S.Class<ConnectorEntity>(
  "ConnectorEntity",
)({
  name: S.String,
  label: S.optional(S.String),
  hasNestedEntities: S.optional(S.Boolean),
}) {}
export const ConnectorEntityList = S.Array(ConnectorEntity);
export const FilterOperatorList = S.Array(S.String);
export const SupportedValueList = S.Array(S.String);
export class ConnectorProfile extends S.Class<ConnectorProfile>(
  "ConnectorProfile",
)({
  connectorProfileArn: S.optional(S.String),
  connectorProfileName: S.optional(S.String),
  connectorType: S.optional(S.String),
  connectorLabel: S.optional(S.String),
  connectionMode: S.optional(S.String),
  credentialsArn: S.optional(S.String),
  connectorProfileProperties: S.optional(ConnectorProfileProperties),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  privateConnectionProvisioningState: S.optional(
    PrivateConnectionProvisioningState,
  ),
}) {}
export const ConnectorProfileDetailList = S.Array(ConnectorProfile);
export class MetadataCatalogDetail extends S.Class<MetadataCatalogDetail>(
  "MetadataCatalogDetail",
)({
  catalogType: S.optional(S.String),
  tableName: S.optional(S.String),
  tableRegistrationOutput: S.optional(RegistrationOutput),
  partitionRegistrationOutput: S.optional(RegistrationOutput),
}) {}
export const MetadataCatalogDetails = S.Array(MetadataCatalogDetail);
export const ConnectorEntityMap = S.Record({
  key: S.String,
  value: ConnectorEntityList,
});
export class ErrorInfo extends S.Class<ErrorInfo>("ErrorInfo")({
  putFailuresCount: S.optional(S.Number),
  executionMessage: S.optional(S.String),
}) {}
export class DescribeConnectorProfilesResponse extends S.Class<DescribeConnectorProfilesResponse>(
  "DescribeConnectorProfilesResponse",
)({
  connectorProfileDetails: S.optional(ConnectorProfileDetailList),
  nextToken: S.optional(S.String),
}) {}
export class DescribeFlowResponse extends S.Class<DescribeFlowResponse>(
  "DescribeFlowResponse",
)({
  flowArn: S.optional(S.String),
  description: S.optional(S.String),
  flowName: S.optional(S.String),
  kmsArn: S.optional(S.String),
  flowStatus: S.optional(S.String),
  flowStatusMessage: S.optional(S.String),
  sourceFlowConfig: S.optional(SourceFlowConfig),
  destinationFlowConfigList: S.optional(DestinationFlowConfigList),
  lastRunExecutionDetails: S.optional(ExecutionDetails),
  triggerConfig: S.optional(TriggerConfig),
  tasks: S.optional(Tasks),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  lastUpdatedBy: S.optional(S.String),
  tags: S.optional(TagMap),
  metadataCatalogConfig: S.optional(MetadataCatalogConfig),
  lastRunMetadataCatalogDetails: S.optional(MetadataCatalogDetails),
  schemaVersion: S.optional(S.Number),
}) {}
export class ListConnectorEntitiesResponse extends S.Class<ListConnectorEntitiesResponse>(
  "ListConnectorEntitiesResponse",
)({
  connectorEntityMap: ConnectorEntityMap,
  nextToken: S.optional(S.String),
}) {}
export class RegisterConnectorResponse extends S.Class<RegisterConnectorResponse>(
  "RegisterConnectorResponse",
)({ connectorArn: S.optional(S.String) }) {}
export class ExecutionResult extends S.Class<ExecutionResult>(
  "ExecutionResult",
)({
  errorInfo: S.optional(ErrorInfo),
  bytesProcessed: S.optional(S.Number),
  bytesWritten: S.optional(S.Number),
  recordsProcessed: S.optional(S.Number),
  numParallelProcesses: S.optional(S.Number),
  maxPageSize: S.optional(S.Number),
}) {}
export class Range extends S.Class<Range>("Range")({
  maximum: S.optional(S.Number),
  minimum: S.optional(S.Number),
}) {}
export class ExecutionRecord extends S.Class<ExecutionRecord>(
  "ExecutionRecord",
)({
  executionId: S.optional(S.String),
  executionStatus: S.optional(S.String),
  executionResult: S.optional(ExecutionResult),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  dataPullStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  dataPullEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  metadataCatalogDetails: S.optional(MetadataCatalogDetails),
}) {}
export const FlowExecutionList = S.Array(ExecutionRecord);
export class FieldTypeDetails extends S.Class<FieldTypeDetails>(
  "FieldTypeDetails",
)({
  fieldType: S.String,
  filterOperators: FilterOperatorList,
  supportedValues: S.optional(SupportedValueList),
  valueRegexPattern: S.optional(S.String),
  supportedDateFormat: S.optional(S.String),
  fieldValueRange: S.optional(Range),
  fieldLengthRange: S.optional(Range),
}) {}
export class DescribeFlowExecutionRecordsResponse extends S.Class<DescribeFlowExecutionRecordsResponse>(
  "DescribeFlowExecutionRecordsResponse",
)({
  flowExecutions: S.optional(FlowExecutionList),
  nextToken: S.optional(S.String),
}) {}
export class SupportedFieldTypeDetails extends S.Class<SupportedFieldTypeDetails>(
  "SupportedFieldTypeDetails",
)({ v1: FieldTypeDetails }) {}
export class ConnectorEntityField extends S.Class<ConnectorEntityField>(
  "ConnectorEntityField",
)({
  identifier: S.String,
  parentIdentifier: S.optional(S.String),
  label: S.optional(S.String),
  isPrimaryKey: S.optional(S.Boolean),
  defaultValue: S.optional(S.String),
  isDeprecated: S.optional(S.Boolean),
  supportedFieldTypeDetails: S.optional(SupportedFieldTypeDetails),
  description: S.optional(S.String),
  sourceProperties: S.optional(SourceFieldProperties),
  destinationProperties: S.optional(DestinationFieldProperties),
  customProperties: S.optional(CustomProperties),
}) {}
export const ConnectorEntityFieldList = S.Array(ConnectorEntityField);
export class CreateConnectorProfileRequest extends S.Class<CreateConnectorProfileRequest>(
  "CreateConnectorProfileRequest",
)(
  {
    connectorProfileName: S.String,
    kmsArn: S.optional(S.String),
    connectorType: S.String,
    connectorLabel: S.optional(S.String),
    connectionMode: S.String,
    connectorProfileConfig: ConnectorProfileConfig,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-connector-profile" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFlowRequest extends S.Class<CreateFlowRequest>(
  "CreateFlowRequest",
)(
  {
    flowName: S.String,
    description: S.optional(S.String),
    kmsArn: S.optional(S.String),
    triggerConfig: TriggerConfig,
    sourceFlowConfig: SourceFlowConfig,
    destinationFlowConfigList: DestinationFlowConfigList,
    tasks: Tasks,
    tags: S.optional(TagMap),
    metadataCatalogConfig: S.optional(MetadataCatalogConfig),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-flow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConnectorResponse extends S.Class<DescribeConnectorResponse>(
  "DescribeConnectorResponse",
)({ connectorConfiguration: S.optional(ConnectorConfiguration) }) {}
export class DescribeConnectorEntityResponse extends S.Class<DescribeConnectorEntityResponse>(
  "DescribeConnectorEntityResponse",
)({ connectorEntityFields: ConnectorEntityFieldList }) {}
export class CreateConnectorProfileResponse extends S.Class<CreateConnectorProfileResponse>(
  "CreateConnectorProfileResponse",
)({ connectorProfileArn: S.optional(S.String) }) {}
export class CreateFlowResponse extends S.Class<CreateFlowResponse>(
  "CreateFlowResponse",
)({ flowArn: S.optional(S.String), flowStatus: S.optional(S.String) }) {}

//# Errors
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
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConnectorAuthenticationException extends S.TaggedError<ConnectorAuthenticationException>()(
  "ConnectorAuthenticationException",
  {},
) {}
export class ConnectorServerException extends S.TaggedError<ConnectorServerException>()(
  "ConnectorServerException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}

//# Operations
/**
 * Unregisters the custom connector registered in your account that matches the connector
 * label provided in the request.
 */
export const unregisterConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnregisterConnectorRequest,
  output: UnregisterConnectorResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes a tag from the specified flow.
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
 * Enables you to delete an existing connector profile.
 */
export const deleteConnectorProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConnectorProfileRequest,
    output: DeleteConnectorProfileResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Enables your application to delete an existing flow. Before deleting the flow, Amazon AppFlow validates the request by checking the flow configuration and status. You can
 * delete flows one at a time.
 */
export const deleteFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFlowRequest,
  output: DeleteFlowResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the list of all registered custom connectors in your Amazon Web Services account.
 * This API lists only custom connectors registered in this account, not the Amazon Web Services
 * authored connectors.
 */
export const listConnectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConnectorsRequest,
  output: ListConnectorsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Retrieves the tags that are associated with a specified flow.
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
 * Resets metadata about your connector entities that Amazon AppFlow stored in its
 * cache. Use this action when you want Amazon AppFlow to return the latest information
 * about the data that you have in a source application.
 *
 * Amazon AppFlow returns metadata about your entities when you use the
 * ListConnectorEntities or DescribeConnectorEntities actions. Following these actions, Amazon AppFlow caches the metadata to reduce the number of API requests that it must send to
 * the source application. Amazon AppFlow automatically resets the cache once every hour,
 * but you can use this action when you want to get the latest metadata right away.
 */
export const resetConnectorMetadataCache = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetConnectorMetadataCacheRequest,
    output: ResetConnectorMetadataCacheResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Applies a tag to the specified flow.
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
 * Updates an existing flow.
 */
export const updateFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlowRequest,
  output: UpdateFlowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ConnectorAuthenticationException,
    ConnectorServerException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Describes the connectors vended by Amazon AppFlow for specified connector types. If
 * you don't specify a connector type, this operation describes all connectors vended by Amazon AppFlow. If there are more connectors than can be returned in one page, the response
 * contains a `nextToken` object, which can be be passed in to the next call to the
 * `DescribeConnectors` API operation to retrieve the next page.
 */
export const describeConnectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectorsRequest,
  output: DescribeConnectorsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists all of the flows associated with your account.
 */
export const listFlows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFlowsRequest,
  output: ListFlowsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Activates an existing flow. For on-demand flows, this operation runs the flow
 * immediately. For schedule and event-triggered flows, this operation activates the flow.
 */
export const startFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFlowRequest,
  output: StartFlowResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Deactivates the existing flow. For on-demand flows, this operation returns an
 * `unsupportedOperationException` error message. For schedule and event-triggered
 * flows, this operation deactivates the flow.
 */
export const stopFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopFlowRequest,
  output: StopFlowResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates a given connector profile associated with your account.
 */
export const updateConnectorProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConnectorProfileRequest,
    output: UpdateConnectorProfileResponse,
    errors: [
      ConflictException,
      ConnectorAuthenticationException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a custom connector that you've previously registered. This operation updates the
 * connector with one of the following:
 *
 * - The latest version of the AWS Lambda function that's assigned to the connector
 *
 * - A new AWS Lambda function that you specify
 */
export const updateConnectorRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConnectorRegistrationRequest,
    output: UpdateConnectorRegistrationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ConnectorAuthenticationException,
      ConnectorServerException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Cancels active runs for a flow.
 *
 * You can cancel all of the active runs for a flow, or you can cancel specific runs by
 * providing their IDs.
 *
 * You can cancel a flow run only when the run is in progress. You can't cancel a run that
 * has already completed or failed. You also can't cancel a run that's scheduled to occur but
 * hasn't started yet. To prevent a scheduled run, you can deactivate the flow with the
 * `StopFlow` action.
 *
 * You cannot resume a run after you cancel it.
 *
 * When you send your request, the status for each run becomes `CancelStarted`.
 * When the cancellation completes, the status becomes `Canceled`.
 *
 * When you cancel a run, you still incur charges for any data that the run already
 * processed before the cancellation. If the run had already written some data to the flow
 * destination, then that data remains in the destination. If you configured the flow to use a
 * batch API (such as the Salesforce Bulk API 2.0), then the run will finish reading or writing
 * its entire batch of data after the cancellation. For these operations, the data processing
 * charges for Amazon AppFlow apply. For the pricing information, see Amazon AppFlow pricing.
 */
export const cancelFlowExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelFlowExecutionsRequest,
    output: CancelFlowExecutionsResponse,
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
 * Returns a list of `connector-profile` details matching the provided
 * `connector-profile` names and `connector-types`. Both input lists are
 * optional, and you can use them to filter the result.
 *
 * If no names or `connector-types` are provided, returns all connector profiles
 * in a paginated form. If there is no match, this operation returns an empty list.
 */
export const describeConnectorProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConnectorProfilesRequest,
    output: DescribeConnectorProfilesResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Provides a description of the specified flow.
 */
export const describeFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFlowRequest,
  output: DescribeFlowResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Returns the list of available connector entities supported by Amazon AppFlow. For
 * example, you can query Salesforce for *Account* and
 * *Opportunity* entities, or query ServiceNow for the
 * *Incident* entity.
 */
export const listConnectorEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConnectorEntitiesRequest,
    output: ListConnectorEntitiesResponse,
    errors: [
      ConnectorAuthenticationException,
      ConnectorServerException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Registers a new custom connector with your Amazon Web Services account. Before you can
 * register the connector, you must deploy the associated AWS lambda function in your
 * account.
 */
export const registerConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterConnectorRequest,
  output: RegisterConnectorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ConnectorAuthenticationException,
    ConnectorServerException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Fetches the execution history of the flow.
 */
export const describeFlowExecutionRecords =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeFlowExecutionRecordsRequest,
    output: DescribeFlowExecutionRecordsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Describes the given custom connector registered in your Amazon Web Services account. This
 * API can be used for custom connectors that are registered in your account and also for Amazon
 * authored connectors.
 */
export const describeConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectorRequest,
  output: DescribeConnectorResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Provides details regarding the entity used with the connector, with a description of the
 * data model for each field in that entity.
 */
export const describeConnectorEntity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConnectorEntityRequest,
    output: DescribeConnectorEntityResponse,
    errors: [
      ConnectorAuthenticationException,
      ConnectorServerException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new connector profile associated with your Amazon Web Services account. There is
 * a soft quota of 100 connector profiles per Amazon Web Services account. If you need more
 * connector profiles than this quota allows, you can submit a request to the Amazon AppFlow
 * team through the Amazon AppFlow support channel. In each connector profile that you
 * create, you can provide the credentials and properties for only one connector.
 */
export const createConnectorProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConnectorProfileRequest,
    output: CreateConnectorProfileResponse,
    errors: [
      ConflictException,
      ConnectorAuthenticationException,
      InternalServerException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Enables your application to create a new flow using Amazon AppFlow. You must create
 * a connector profile before calling this API. Please note that the Request Syntax below shows
 * syntax for multiple destinations, however, you can only transfer data to one item in this list
 * at a time. Amazon AppFlow does not currently support flows to multiple destinations at
 * once.
 */
export const createFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFlowRequest,
  output: CreateFlowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ConnectorAuthenticationException,
    ConnectorServerException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));

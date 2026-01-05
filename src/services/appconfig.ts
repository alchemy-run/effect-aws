import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "AppConfig",
  serviceShapeName: "AmazonAppConfig",
});
const auth = T.AwsAuthSigv4({ name: "appconfig" });
const ver = T.ServiceVersion("2019-10-09");
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
                        url: "https://appconfig-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://appconfig.us-gov-east-1.amazonaws.com",
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
                        url: "https://appconfig.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://appconfig-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://appconfig.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://appconfig.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetAccountSettingsRequest extends S.Class<GetAccountSettingsRequest>(
  "GetAccountSettingsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagKeyList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateDeploymentStrategyRequest extends S.Class<CreateDeploymentStrategyRequest>(
  "CreateDeploymentStrategyRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    DeploymentDurationInMinutes: S.Number,
    FinalBakeTimeInMinutes: S.optional(S.Number),
    GrowthFactor: S.Number,
    GrowthType: S.optional(S.String),
    ReplicateTo: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/deploymentstrategies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateHostedConfigurationVersionRequest extends S.Class<CreateHostedConfigurationVersionRequest>(
  "CreateHostedConfigurationVersionRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ConfigurationProfileId: S.String.pipe(
      T.HttpLabel("ConfigurationProfileId"),
    ),
    Description: S.optional(S.String).pipe(T.HttpHeader("Description")),
    Content: T.StreamingInput.pipe(T.HttpPayload()),
    ContentType: S.String.pipe(T.HttpHeader("Content-Type")),
    LatestVersionNumber: S.optional(S.Number).pipe(
      T.HttpHeader("Latest-Version-Number"),
    ),
    VersionLabel: S.optional(S.String).pipe(T.HttpHeader("VersionLabel")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/applications/{ApplicationId}/configurationprofiles/{ConfigurationProfileId}/hostedconfigurationversions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/applications/{ApplicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}) {}
export class DeleteConfigurationProfileRequest extends S.Class<DeleteConfigurationProfileRequest>(
  "DeleteConfigurationProfileRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ConfigurationProfileId: S.String.pipe(
      T.HttpLabel("ConfigurationProfileId"),
    ),
    DeletionProtectionCheck: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-deletion-protection-check"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/applications/{ApplicationId}/configurationprofiles/{ConfigurationProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigurationProfileResponse extends S.Class<DeleteConfigurationProfileResponse>(
  "DeleteConfigurationProfileResponse",
)({}) {}
export class DeleteDeploymentStrategyRequest extends S.Class<DeleteDeploymentStrategyRequest>(
  "DeleteDeploymentStrategyRequest",
)(
  { DeploymentStrategyId: S.String.pipe(T.HttpLabel("DeploymentStrategyId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/deployementstrategies/{DeploymentStrategyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeploymentStrategyResponse extends S.Class<DeleteDeploymentStrategyResponse>(
  "DeleteDeploymentStrategyResponse",
)({}) {}
export class DeleteEnvironmentRequest extends S.Class<DeleteEnvironmentRequest>(
  "DeleteEnvironmentRequest",
)(
  {
    EnvironmentId: S.String.pipe(T.HttpLabel("EnvironmentId")),
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    DeletionProtectionCheck: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-deletion-protection-check"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/applications/{ApplicationId}/environments/{EnvironmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentResponse extends S.Class<DeleteEnvironmentResponse>(
  "DeleteEnvironmentResponse",
)({}) {}
export class DeleteExtensionRequest extends S.Class<DeleteExtensionRequest>(
  "DeleteExtensionRequest",
)(
  {
    ExtensionIdentifier: S.String.pipe(T.HttpLabel("ExtensionIdentifier")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/extensions/{ExtensionIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteExtensionResponse extends S.Class<DeleteExtensionResponse>(
  "DeleteExtensionResponse",
)({}) {}
export class DeleteExtensionAssociationRequest extends S.Class<DeleteExtensionAssociationRequest>(
  "DeleteExtensionAssociationRequest",
)(
  {
    ExtensionAssociationId: S.String.pipe(
      T.HttpLabel("ExtensionAssociationId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/extensionassociations/{ExtensionAssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteExtensionAssociationResponse extends S.Class<DeleteExtensionAssociationResponse>(
  "DeleteExtensionAssociationResponse",
)({}) {}
export class DeleteHostedConfigurationVersionRequest extends S.Class<DeleteHostedConfigurationVersionRequest>(
  "DeleteHostedConfigurationVersionRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ConfigurationProfileId: S.String.pipe(
      T.HttpLabel("ConfigurationProfileId"),
    ),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/applications/{ApplicationId}/configurationprofiles/{ConfigurationProfileId}/hostedconfigurationversions/{VersionNumber}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteHostedConfigurationVersionResponse extends S.Class<DeleteHostedConfigurationVersionResponse>(
  "DeleteHostedConfigurationVersionResponse",
)({}) {}
export class GetApplicationRequest extends S.Class<GetApplicationRequest>(
  "GetApplicationRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{ApplicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfigurationRequest extends S.Class<GetConfigurationRequest>(
  "GetConfigurationRequest",
)(
  {
    Application: S.String.pipe(T.HttpLabel("Application")),
    Environment: S.String.pipe(T.HttpLabel("Environment")),
    Configuration: S.String.pipe(T.HttpLabel("Configuration")),
    ClientId: S.String.pipe(T.HttpQuery("client_id")),
    ClientConfigurationVersion: S.optional(S.String).pipe(
      T.HttpQuery("client_configuration_version"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{Application}/environments/{Environment}/configurations/{Configuration}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfigurationProfileRequest extends S.Class<GetConfigurationProfileRequest>(
  "GetConfigurationProfileRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ConfigurationProfileId: S.String.pipe(
      T.HttpLabel("ConfigurationProfileId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/configurationprofiles/{ConfigurationProfileId}",
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
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EnvironmentId: S.String.pipe(T.HttpLabel("EnvironmentId")),
    DeploymentNumber: S.Number.pipe(T.HttpLabel("DeploymentNumber")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/environments/{EnvironmentId}/deployments/{DeploymentNumber}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeploymentStrategyRequest extends S.Class<GetDeploymentStrategyRequest>(
  "GetDeploymentStrategyRequest",
)(
  { DeploymentStrategyId: S.String.pipe(T.HttpLabel("DeploymentStrategyId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/deploymentstrategies/{DeploymentStrategyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnvironmentRequest extends S.Class<GetEnvironmentRequest>(
  "GetEnvironmentRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EnvironmentId: S.String.pipe(T.HttpLabel("EnvironmentId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/environments/{EnvironmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExtensionRequest extends S.Class<GetExtensionRequest>(
  "GetExtensionRequest",
)(
  {
    ExtensionIdentifier: S.String.pipe(T.HttpLabel("ExtensionIdentifier")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version_number")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/extensions/{ExtensionIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExtensionAssociationRequest extends S.Class<GetExtensionAssociationRequest>(
  "GetExtensionAssociationRequest",
)(
  {
    ExtensionAssociationId: S.String.pipe(
      T.HttpLabel("ExtensionAssociationId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/extensionassociations/{ExtensionAssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetHostedConfigurationVersionRequest extends S.Class<GetHostedConfigurationVersionRequest>(
  "GetHostedConfigurationVersionRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ConfigurationProfileId: S.String.pipe(
      T.HttpLabel("ConfigurationProfileId"),
    ),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/configurationprofiles/{ConfigurationProfileId}/hostedconfigurationversions/{VersionNumber}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigurationProfilesRequest extends S.Class<ListConfigurationProfilesRequest>(
  "ListConfigurationProfilesRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    Type: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/configurationprofiles",
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
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EnvironmentId: S.String.pipe(T.HttpLabel("EnvironmentId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/environments/{EnvironmentId}/deployments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeploymentStrategiesRequest extends S.Class<ListDeploymentStrategiesRequest>(
  "ListDeploymentStrategiesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/deploymentstrategies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentsRequest extends S.Class<ListEnvironmentsRequest>(
  "ListEnvironmentsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/environments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExtensionAssociationsRequest extends S.Class<ListExtensionAssociationsRequest>(
  "ListExtensionAssociationsRequest",
)(
  {
    ResourceIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("resource_identifier"),
    ),
    ExtensionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("extension_identifier"),
    ),
    ExtensionVersionNumber: S.optional(S.Number).pipe(
      T.HttpQuery("extension_version_number"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/extensionassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExtensionsRequest extends S.Class<ListExtensionsRequest>(
  "ListExtensionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    Name: S.optional(S.String).pipe(T.HttpQuery("name")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/extensions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListHostedConfigurationVersionsRequest extends S.Class<ListHostedConfigurationVersionsRequest>(
  "ListHostedConfigurationVersionsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ConfigurationProfileId: S.String.pipe(
      T.HttpLabel("ConfigurationProfileId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    VersionLabel: S.optional(S.String).pipe(T.HttpQuery("version_label")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/configurationprofiles/{ConfigurationProfileId}/hostedconfigurationversions",
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
export class StopDeploymentRequest extends S.Class<StopDeploymentRequest>(
  "StopDeploymentRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EnvironmentId: S.String.pipe(T.HttpLabel("EnvironmentId")),
    DeploymentNumber: S.Number.pipe(T.HttpLabel("DeploymentNumber")),
    AllowRevert: S.optional(S.Boolean).pipe(T.HttpHeader("Allow-Revert")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/applications/{ApplicationId}/environments/{EnvironmentId}/deployments/{DeploymentNumber}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagMap },
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
export class DeletionProtectionSettings extends S.Class<DeletionProtectionSettings>(
  "DeletionProtectionSettings",
)({
  Enabled: S.optional(S.Boolean),
  ProtectionPeriodInMinutes: S.optional(S.Number),
}) {}
export class UpdateAccountSettingsRequest extends S.Class<UpdateAccountSettingsRequest>(
  "UpdateAccountSettingsRequest",
)(
  { DeletionProtection: S.optional(DeletionProtectionSettings) },
  T.all(
    T.Http({ method: "PATCH", uri: "/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/applications/{ApplicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Validator extends S.Class<Validator>("Validator")({
  Type: S.String,
  Content: S.String,
}) {}
export const ValidatorList = S.Array(Validator);
export class UpdateConfigurationProfileRequest extends S.Class<UpdateConfigurationProfileRequest>(
  "UpdateConfigurationProfileRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ConfigurationProfileId: S.String.pipe(
      T.HttpLabel("ConfigurationProfileId"),
    ),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    RetrievalRoleArn: S.optional(S.String),
    Validators: S.optional(ValidatorList),
    KmsKeyIdentifier: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/applications/{ApplicationId}/configurationprofiles/{ConfigurationProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDeploymentStrategyRequest extends S.Class<UpdateDeploymentStrategyRequest>(
  "UpdateDeploymentStrategyRequest",
)(
  {
    DeploymentStrategyId: S.String.pipe(T.HttpLabel("DeploymentStrategyId")),
    Description: S.optional(S.String),
    DeploymentDurationInMinutes: S.optional(S.Number),
    FinalBakeTimeInMinutes: S.optional(S.Number),
    GrowthFactor: S.optional(S.Number),
    GrowthType: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/deploymentstrategies/{DeploymentStrategyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Monitor extends S.Class<Monitor>("Monitor")({
  AlarmArn: S.String,
  AlarmRoleArn: S.optional(S.String),
}) {}
export const MonitorList = S.Array(Monitor);
export class UpdateEnvironmentRequest extends S.Class<UpdateEnvironmentRequest>(
  "UpdateEnvironmentRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EnvironmentId: S.String.pipe(T.HttpLabel("EnvironmentId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Monitors: S.optional(MonitorList),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/applications/{ApplicationId}/environments/{EnvironmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Action extends S.Class<Action>("Action")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Uri: S.optional(S.String),
  RoleArn: S.optional(S.String),
}) {}
export const ActionList = S.Array(Action);
export const ActionsMap = S.Record({ key: S.String, value: ActionList });
export class Parameter extends S.Class<Parameter>("Parameter")({
  Description: S.optional(S.String),
  Required: S.optional(S.Boolean),
  Dynamic: S.optional(S.Boolean),
}) {}
export const ParameterMap = S.Record({ key: S.String, value: Parameter });
export class UpdateExtensionRequest extends S.Class<UpdateExtensionRequest>(
  "UpdateExtensionRequest",
)(
  {
    ExtensionIdentifier: S.String.pipe(T.HttpLabel("ExtensionIdentifier")),
    Description: S.optional(S.String),
    Actions: S.optional(ActionsMap),
    Parameters: S.optional(ParameterMap),
    VersionNumber: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/extensions/{ExtensionIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ParameterValueMap = S.Record({ key: S.String, value: S.String });
export class UpdateExtensionAssociationRequest extends S.Class<UpdateExtensionAssociationRequest>(
  "UpdateExtensionAssociationRequest",
)(
  {
    ExtensionAssociationId: S.String.pipe(
      T.HttpLabel("ExtensionAssociationId"),
    ),
    Parameters: S.optional(ParameterValueMap),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/extensionassociations/{ExtensionAssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidateConfigurationRequest extends S.Class<ValidateConfigurationRequest>(
  "ValidateConfigurationRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ConfigurationProfileId: S.String.pipe(
      T.HttpLabel("ConfigurationProfileId"),
    ),
    ConfigurationVersion: S.String.pipe(T.HttpQuery("configuration_version")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/applications/{ApplicationId}/configurationprofiles/{ConfigurationProfileId}/validators",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidateConfigurationResponse extends S.Class<ValidateConfigurationResponse>(
  "ValidateConfigurationResponse",
)({}) {}
export class Application extends S.Class<Application>("Application")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const ApplicationList = S.Array(Application);
export class DeploymentStrategy extends S.Class<DeploymentStrategy>(
  "DeploymentStrategy",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  DeploymentDurationInMinutes: S.optional(S.Number),
  GrowthType: S.optional(S.String),
  GrowthFactor: S.optional(S.Number),
  FinalBakeTimeInMinutes: S.optional(S.Number),
  ReplicateTo: S.optional(S.String),
}) {}
export const DeploymentStrategyList = S.Array(DeploymentStrategy);
export class Environment extends S.Class<Environment>("Environment")({
  ApplicationId: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  State: S.optional(S.String),
  Monitors: S.optional(MonitorList),
}) {}
export const EnvironmentList = S.Array(Environment);
export const DynamicParameterMap = S.Record({ key: S.String, value: S.String });
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConfigurationProfileRequest extends S.Class<CreateConfigurationProfileRequest>(
  "CreateConfigurationProfileRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    Name: S.String,
    Description: S.optional(S.String),
    LocationUri: S.String,
    RetrievalRoleArn: S.optional(S.String),
    Validators: S.optional(ValidatorList),
    Tags: S.optional(TagMap),
    Type: S.optional(S.String),
    KmsKeyIdentifier: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/applications/{ApplicationId}/configurationprofiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEnvironmentRequest extends S.Class<CreateEnvironmentRequest>(
  "CreateEnvironmentRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    Name: S.String,
    Description: S.optional(S.String),
    Monitors: S.optional(MonitorList),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/applications/{ApplicationId}/environments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateExtensionAssociationRequest extends S.Class<CreateExtensionAssociationRequest>(
  "CreateExtensionAssociationRequest",
)(
  {
    ExtensionIdentifier: S.String,
    ExtensionVersionNumber: S.optional(S.Number),
    ResourceIdentifier: S.String,
    Parameters: S.optional(ParameterValueMap),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/extensionassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class HostedConfigurationVersion extends S.Class<HostedConfigurationVersion>(
  "HostedConfigurationVersion",
)({
  ApplicationId: S.optional(S.String).pipe(T.HttpHeader("Application-Id")),
  ConfigurationProfileId: S.optional(S.String).pipe(
    T.HttpHeader("Configuration-Profile-Id"),
  ),
  VersionNumber: S.optional(S.Number).pipe(T.HttpHeader("Version-Number")),
  Description: S.optional(S.String).pipe(T.HttpHeader("Description")),
  Content: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  VersionLabel: S.optional(S.String).pipe(T.HttpHeader("VersionLabel")),
  KmsKeyArn: S.optional(S.String).pipe(T.HttpHeader("KmsKeyArn")),
}) {}
export class AccountSettings extends S.Class<AccountSettings>(
  "AccountSettings",
)({ DeletionProtection: S.optional(DeletionProtectionSettings) }) {}
export class Configuration extends S.Class<Configuration>("Configuration")({
  Content: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  ConfigurationVersion: S.optional(S.String).pipe(
    T.HttpHeader("Configuration-Version"),
  ),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
}) {}
export class ConfigurationProfile extends S.Class<ConfigurationProfile>(
  "ConfigurationProfile",
)({
  ApplicationId: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  LocationUri: S.optional(S.String),
  RetrievalRoleArn: S.optional(S.String),
  Validators: S.optional(ValidatorList),
  Type: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  KmsKeyIdentifier: S.optional(S.String),
}) {}
export class Extension extends S.Class<Extension>("Extension")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  VersionNumber: S.optional(S.Number),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  Actions: S.optional(ActionsMap),
  Parameters: S.optional(ParameterMap),
}) {}
export class ExtensionAssociation extends S.Class<ExtensionAssociation>(
  "ExtensionAssociation",
)({
  Id: S.optional(S.String),
  ExtensionArn: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  Arn: S.optional(S.String),
  Parameters: S.optional(ParameterValueMap),
  ExtensionVersionNumber: S.optional(S.Number),
}) {}
export class Applications extends S.Class<Applications>("Applications")({
  Items: S.optional(ApplicationList),
  NextToken: S.optional(S.String),
}) {}
export class DeploymentStrategies extends S.Class<DeploymentStrategies>(
  "DeploymentStrategies",
)({
  Items: S.optional(DeploymentStrategyList),
  NextToken: S.optional(S.String),
}) {}
export class Environments extends S.Class<Environments>("Environments")({
  Items: S.optional(EnvironmentList),
  NextToken: S.optional(S.String),
}) {}
export class ResourceTags extends S.Class<ResourceTags>("ResourceTags")({
  Tags: S.optional(TagMap),
}) {}
export class StartDeploymentRequest extends S.Class<StartDeploymentRequest>(
  "StartDeploymentRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EnvironmentId: S.String.pipe(T.HttpLabel("EnvironmentId")),
    DeploymentStrategyId: S.String,
    ConfigurationProfileId: S.String,
    ConfigurationVersion: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
    KmsKeyIdentifier: S.optional(S.String),
    DynamicExtensionParameters: S.optional(DynamicParameterMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/applications/{ApplicationId}/environments/{EnvironmentId}/deployments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ValidatorTypeList = S.Array(S.String);
export class AppliedExtension extends S.Class<AppliedExtension>(
  "AppliedExtension",
)({
  ExtensionId: S.optional(S.String),
  ExtensionAssociationId: S.optional(S.String),
  VersionNumber: S.optional(S.Number),
  Parameters: S.optional(ParameterValueMap),
}) {}
export const AppliedExtensions = S.Array(AppliedExtension);
export class ConfigurationProfileSummary extends S.Class<ConfigurationProfileSummary>(
  "ConfigurationProfileSummary",
)({
  ApplicationId: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  LocationUri: S.optional(S.String),
  ValidatorTypes: S.optional(ValidatorTypeList),
  Type: S.optional(S.String),
}) {}
export const ConfigurationProfileSummaryList = S.Array(
  ConfigurationProfileSummary,
);
export class DeploymentSummary extends S.Class<DeploymentSummary>(
  "DeploymentSummary",
)({
  DeploymentNumber: S.optional(S.Number),
  ConfigurationName: S.optional(S.String),
  ConfigurationVersion: S.optional(S.String),
  DeploymentDurationInMinutes: S.optional(S.Number),
  GrowthType: S.optional(S.String),
  GrowthFactor: S.optional(S.Number),
  FinalBakeTimeInMinutes: S.optional(S.Number),
  State: S.optional(S.String),
  PercentageComplete: S.optional(S.Number),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  VersionLabel: S.optional(S.String),
}) {}
export const DeploymentList = S.Array(DeploymentSummary);
export class ExtensionAssociationSummary extends S.Class<ExtensionAssociationSummary>(
  "ExtensionAssociationSummary",
)({
  Id: S.optional(S.String),
  ExtensionArn: S.optional(S.String),
  ResourceArn: S.optional(S.String),
}) {}
export const ExtensionAssociationSummaries = S.Array(
  ExtensionAssociationSummary,
);
export class ExtensionSummary extends S.Class<ExtensionSummary>(
  "ExtensionSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  VersionNumber: S.optional(S.Number),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const ExtensionSummaries = S.Array(ExtensionSummary);
export class HostedConfigurationVersionSummary extends S.Class<HostedConfigurationVersionSummary>(
  "HostedConfigurationVersionSummary",
)({
  ApplicationId: S.optional(S.String),
  ConfigurationProfileId: S.optional(S.String),
  VersionNumber: S.optional(S.Number),
  Description: S.optional(S.String),
  ContentType: S.optional(S.String),
  VersionLabel: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
}) {}
export const HostedConfigurationVersionSummaryList = S.Array(
  HostedConfigurationVersionSummary,
);
export class CreateExtensionRequest extends S.Class<CreateExtensionRequest>(
  "CreateExtensionRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Actions: ActionsMap,
    Parameters: S.optional(ParameterMap),
    Tags: S.optional(TagMap),
    LatestVersionNumber: S.optional(S.Number).pipe(
      T.HttpHeader("Latest-Version-Number"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/extensions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ConfigurationProfiles extends S.Class<ConfigurationProfiles>(
  "ConfigurationProfiles",
)({
  Items: S.optional(ConfigurationProfileSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class Deployments extends S.Class<Deployments>("Deployments")({
  Items: S.optional(DeploymentList),
  NextToken: S.optional(S.String),
}) {}
export class ExtensionAssociations extends S.Class<ExtensionAssociations>(
  "ExtensionAssociations",
)({
  Items: S.optional(ExtensionAssociationSummaries),
  NextToken: S.optional(S.String),
}) {}
export class Extensions extends S.Class<Extensions>("Extensions")({
  Items: S.optional(ExtensionSummaries),
  NextToken: S.optional(S.String),
}) {}
export class HostedConfigurationVersions extends S.Class<HostedConfigurationVersions>(
  "HostedConfigurationVersions",
)({
  Items: S.optional(HostedConfigurationVersionSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class InvalidConfigurationDetail extends S.Class<InvalidConfigurationDetail>(
  "InvalidConfigurationDetail",
)({
  Constraint: S.optional(S.String),
  Location: S.optional(S.String),
  Reason: S.optional(S.String),
  Type: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const InvalidConfigurationDetailList = S.Array(
  InvalidConfigurationDetail,
);
export class ActionInvocation extends S.Class<ActionInvocation>(
  "ActionInvocation",
)({
  ExtensionIdentifier: S.optional(S.String),
  ActionName: S.optional(S.String),
  Uri: S.optional(S.String),
  RoleArn: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  InvocationId: S.optional(S.String),
}) {}
export const ActionInvocations = S.Array(ActionInvocation);
export const BadRequestDetails = S.Union(
  S.Struct({ InvalidConfiguration: InvalidConfigurationDetailList }),
);
export class DeploymentEvent extends S.Class<DeploymentEvent>(
  "DeploymentEvent",
)({
  EventType: S.optional(S.String),
  TriggeredBy: S.optional(S.String),
  Description: S.optional(S.String),
  ActionInvocations: S.optional(ActionInvocations),
  OccurredAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const DeploymentEvents = S.Array(DeploymentEvent);
export class Deployment extends S.Class<Deployment>("Deployment")({
  ApplicationId: S.optional(S.String),
  EnvironmentId: S.optional(S.String),
  DeploymentStrategyId: S.optional(S.String),
  ConfigurationProfileId: S.optional(S.String),
  DeploymentNumber: S.optional(S.Number),
  ConfigurationName: S.optional(S.String),
  ConfigurationLocationUri: S.optional(S.String),
  ConfigurationVersion: S.optional(S.String),
  Description: S.optional(S.String),
  DeploymentDurationInMinutes: S.optional(S.Number),
  GrowthType: S.optional(S.String),
  GrowthFactor: S.optional(S.Number),
  FinalBakeTimeInMinutes: S.optional(S.Number),
  State: S.optional(S.String),
  EventLog: S.optional(DeploymentEvents),
  PercentageComplete: S.optional(S.Number),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  AppliedExtensions: S.optional(AppliedExtensions),
  KmsKeyArn: S.optional(S.String),
  KmsKeyIdentifier: S.optional(S.String),
  VersionLabel: S.optional(S.String),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(S.String),
    Details: S.optional(BadRequestDetails),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class PayloadTooLargeException extends S.TaggedError<PayloadTooLargeException>()(
  "PayloadTooLargeException",
  {
    Message: S.optional(S.String),
    Measure: S.optional(S.String),
    Limit: S.optional(S.Number),
    Size: S.optional(S.Number),
  },
) {}

//# Operations
/**
 * Updates the value of the `DeletionProtection` parameter.
 */
export const updateAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountSettingsRequest,
    output: AccountSettings,
    errors: [BadRequestException, InternalServerException],
  }),
);
/**
 * Returns information about the status of the `DeletionProtection`
 * parameter.
 */
export const getAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: AccountSettings,
  errors: [BadRequestException, InternalServerException],
}));
/**
 * Lists all applications in your Amazon Web Services account.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListApplicationsRequest,
    output: Applications,
    errors: [BadRequestException, InternalServerException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists deployment strategies.
 */
export const listDeploymentStrategies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDeploymentStrategiesRequest,
    output: DeploymentStrategies,
    errors: [BadRequestException, InternalServerException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all AppConfig extension associations in the account. For more
 * information about extensions and associations, see Extending
 * workflows in the *AppConfig User Guide*.
 */
export const listExtensionAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListExtensionAssociationsRequest,
    output: ExtensionAssociations,
    errors: [BadRequestException, InternalServerException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all custom and Amazon Web Services authored AppConfig extensions in the
 * account. For more information about extensions, see Extending
 * workflows in the *AppConfig User Guide*.
 */
export const listExtensions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListExtensionsRequest,
    output: Extensions,
    errors: [BadRequestException, InternalServerException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Deletes an application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an application. In AppConfig, an application is simply an
 * organizational construct like a folder. This organizational construct has a relationship
 * with some unit of executable code. For example, you could create an application called
 * MyMobileApp to organize and manage configuration data for a mobile application installed by
 * your users.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: Application,
  errors: [
    BadRequestException,
    InternalServerException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Deletes a configuration profile.
 *
 * To prevent users from unintentionally deleting actively-used configuration profiles,
 * enable deletion
 * protection.
 */
export const deleteConfigurationProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConfigurationProfileRequest,
    output: DeleteConfigurationProfileResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves information about a configuration deployment.
 */
export const getDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentRequest,
  output: Deployment,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a deployment strategy.
 */
export const deleteDeploymentStrategy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDeploymentStrategyRequest,
    output: DeleteDeploymentStrategyResponse,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes an AppConfig extension. You must delete all associations to an
 * extension before you delete the extension.
 */
export const deleteExtension = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExtensionRequest,
  output: DeleteExtensionResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an extension association. This action doesn't delete extensions defined in the
 * association.
 */
export const deleteExtensionAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteExtensionAssociationRequest,
    output: DeleteExtensionAssociationResponse,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a version of a configuration from the AppConfig hosted configuration
 * store.
 */
export const deleteHostedConfigurationVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteHostedConfigurationVersionRequest,
    output: DeleteHostedConfigurationVersionResponse,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Retrieves information about a deployment strategy. A deployment strategy defines
 * important criteria for rolling out your configuration to the designated targets. A
 * deployment strategy includes the overall duration required, a percentage of targets to
 * receive the deployment during each interval, an algorithm that defines how percentage
 * grows, and bake time.
 */
export const getDeploymentStrategy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDeploymentStrategyRequest,
    output: DeploymentStrategy,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves information about a specific configuration version.
 */
export const getHostedConfigurationVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetHostedConfigurationVersionRequest,
    output: HostedConfigurationVersion,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Stops a deployment. This API action works only on deployments that have a status of
 * `DEPLOYING`, unless an `AllowRevert` parameter is supplied. If the
 * `AllowRevert` parameter is supplied, the status of an in-progress deployment
 * will be `ROLLED_BACK`. The status of a completed deployment will be
 * `REVERTED`. AppConfig only allows a revert within 72 hours of
 * deployment completion.
 */
export const stopDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDeploymentRequest,
  output: Deployment,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Assigns metadata to an AppConfig resource. Tags help organize and categorize
 * your AppConfig resources. Each tag consists of a key and an optional value, both
 * of which you define. You can specify a maximum of 50 tags for a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a tag key and value from an AppConfig resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an application.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: Application,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates a configuration profile.
 */
export const updateConfigurationProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConfigurationProfileRequest,
    output: ConfigurationProfile,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates a deployment strategy.
 */
export const updateDeploymentStrategy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDeploymentStrategyRequest,
    output: DeploymentStrategy,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates an environment.
 */
export const updateEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentRequest,
  output: Environment,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an association. For more information about extensions and associations, see
 * Extending
 * workflows in the *AppConfig User Guide*.
 */
export const updateExtensionAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateExtensionAssociationRequest,
    output: ExtensionAssociation,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Uses the validators in a configuration profile to validate a configuration.
 */
export const validateConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ValidateConfigurationRequest,
    output: ValidateConfigurationResponse,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a configuration profile, which is information that enables AppConfig
 * to access the configuration source. Valid configuration sources include the
 * following:
 *
 * - Configuration data in YAML, JSON, and other formats stored in the AppConfig hosted configuration store
 *
 * - Configuration data stored as objects in an Amazon Simple Storage Service (Amazon S3)
 * bucket
 *
 * - Pipelines stored in CodePipeline
 *
 * - Secrets stored in Secrets Manager
 *
 * - Standard and secure string parameters stored in Amazon Web Services Systems Manager Parameter Store
 *
 * - Configuration data in SSM documents stored in the Systems Manager document store
 *
 * A configuration profile includes the following information:
 *
 * - The URI location of the configuration data.
 *
 * - The Identity and Access Management (IAM) role that provides access to the configuration data.
 *
 * - A validator for the configuration data. Available validators include either a JSON
 * Schema or an Amazon Web Services Lambda function.
 *
 * For more information, see Create a
 * Configuration and a Configuration Profile in the AppConfig
 * User Guide.
 */
export const createConfigurationProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConfigurationProfileRequest,
    output: ConfigurationProfile,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }),
);
/**
 * Creates an environment. For each application, you define one or more environments. An
 * environment is a deployment group of AppConfig targets, such as applications in a
 * `Beta` or `Production` environment. You can also define
 * environments for application subcomponents such as the `Web`,
 * `Mobile` and `Back-end` components for your application. You can
 * configure Amazon CloudWatch alarms for each environment. The system monitors alarms during a
 * configuration deployment. If an alarm is triggered, the system rolls back the
 * configuration.
 */
export const createEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentRequest,
  output: Environment,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * When you create an extension or configure an Amazon Web Services authored extension, you
 * associate the extension with an AppConfig application, environment, or
 * configuration profile. For example, you can choose to run the AppConfig
 * deployment events to Amazon SNS
 * Amazon Web Services authored extension and receive notifications on an Amazon SNS
 * topic anytime a configuration deployment is started for a specific application. Defining
 * which extension to associate with an AppConfig resource is called an
 * *extension association*. An extension association is a specified
 * relationship between an extension and an AppConfig resource, such as an
 * application or a configuration profile. For more information about extensions and
 * associations, see Extending
 * workflows in the *AppConfig User Guide*.
 */
export const createExtensionAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateExtensionAssociationRequest,
    output: ExtensionAssociation,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }),
);
/**
 * Retrieves information about an application.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: Application,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * (Deprecated) Retrieves the latest deployed configuration.
 *
 * Note the following important information.
 *
 * - This API action is deprecated. Calls to receive configuration data should use
 * the StartConfigurationSession and GetLatestConfiguration APIs instead.
 *
 * - GetConfiguration is a priced call. For more information, see
 * Pricing.
 */
export const getConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationRequest,
  output: Configuration,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves information about a configuration profile.
 */
export const getConfigurationProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConfigurationProfileRequest,
    output: ConfigurationProfile,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves information about an environment. An environment is a deployment group of
 * AppConfig applications, such as applications in a `Production`
 * environment or in an `EU_Region` environment. Each configuration deployment
 * targets an environment. You can enable one or more Amazon CloudWatch alarms for an environment. If
 * an alarm is triggered during a deployment, AppConfig roles back the
 * configuration.
 */
export const getEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentRequest,
  output: Environment,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about an AppConfig extension.
 */
export const getExtension = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExtensionRequest,
  output: Extension,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about an AppConfig extension association. For more
 * information about extensions and associations, see Extending
 * workflows in the *AppConfig User Guide*.
 */
export const getExtensionAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetExtensionAssociationRequest,
    output: ExtensionAssociation,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Lists the environments for an application.
 */
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEnvironmentsRequest,
    output: Environments,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
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
 * Retrieves the list of key-value tags assigned to the resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ResourceTags,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the configuration profiles for an application.
 */
export const listConfigurationProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListConfigurationProfilesRequest,
    output: ConfigurationProfiles,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the deployments for an environment in descending deployment number order.
 */
export const listDeployments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDeploymentsRequest,
    output: Deployments,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
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
 * Lists configurations stored in the AppConfig hosted configuration store by
 * version.
 */
export const listHostedConfigurationVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListHostedConfigurationVersionsRequest,
    output: HostedConfigurationVersions,
    errors: [
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Deletes an environment.
 *
 * To prevent users from unintentionally deleting actively-used environments, enable deletion
 * protection.
 */
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an AppConfig extension. For more information about extensions, see
 * Extending
 * workflows in the *AppConfig User Guide*.
 */
export const updateExtension = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExtensionRequest,
  output: Extension,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts a deployment.
 */
export const startDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDeploymentRequest,
  output: Deployment,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a new configuration in the AppConfig hosted configuration store. If
 * you're creating a feature flag, we recommend you familiarize yourself with the JSON schema
 * for feature flag data. For more information, see Type reference for AWS.AppConfig.FeatureFlags in the
 * *AppConfig User Guide*.
 */
export const createHostedConfigurationVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateHostedConfigurationVersionRequest,
    output: HostedConfigurationVersion,
    errors: [
      BadRequestException,
      ConflictException,
      InternalServerException,
      PayloadTooLargeException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Creates a deployment strategy that defines important criteria for rolling out your
 * configuration to the designated targets. A deployment strategy includes the overall
 * duration required, a percentage of targets to receive the deployment during each interval,
 * an algorithm that defines how percentage grows, and bake time.
 */
export const createDeploymentStrategy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDeploymentStrategyRequest,
    output: DeploymentStrategy,
    errors: [
      BadRequestException,
      InternalServerException,
      ServiceQuotaExceededException,
    ],
  }),
);
/**
 * Creates an AppConfig extension. An extension augments your ability to inject
 * logic or behavior at different points during the AppConfig workflow of creating
 * or deploying a configuration.
 *
 * You can create your own extensions or use the Amazon Web Services authored extensions provided by
 * AppConfig. For an AppConfig extension that uses Lambda, you must create a Lambda function to perform any computation and processing
 * defined in the extension. If you plan to create custom versions of the Amazon Web Services
 * authored notification extensions, you only need to specify an Amazon Resource Name (ARN) in
 * the `Uri` field for the new extension version.
 *
 * - For a custom EventBridge notification extension, enter the ARN of the EventBridge
 * default events in the `Uri` field.
 *
 * - For a custom Amazon SNS notification extension, enter the ARN of an Amazon SNS
 * topic in the `Uri` field.
 *
 * - For a custom Amazon SQS notification extension, enter the ARN of an Amazon SQS
 * message queue in the `Uri` field.
 *
 * For more information about extensions, see Extending
 * workflows in the *AppConfig User Guide*.
 */
export const createExtension = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExtensionRequest,
  output: Extension,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
  ],
}));

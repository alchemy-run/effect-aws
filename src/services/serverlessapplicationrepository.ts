import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "ServerlessApplicationRepository",
  serviceShapeName: "ServerlessApplicationRepository",
});
const auth = T.AwsAuthSigv4({ name: "serverlessrepo" });
const ver = T.ServiceVersion("2017-09-08");
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
                        url: "https://serverlessrepo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://serverlessrepo.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://serverlessrepo-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://serverlessrepo.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://serverlessrepo.{Region}.{PartitionResult#dnsSuffix}",
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
export const __listOf__string = S.Array(S.String);
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    Author: S.String.pipe(T.JsonName("author")),
    Description: S.String.pipe(T.JsonName("description")),
    HomePageUrl: S.optional(S.String).pipe(T.JsonName("homePageUrl")),
    Labels: S.optional(__listOf__string).pipe(T.JsonName("labels")),
    LicenseBody: S.optional(S.String).pipe(T.JsonName("licenseBody")),
    LicenseUrl: S.optional(S.String).pipe(T.JsonName("licenseUrl")),
    Name: S.String.pipe(T.JsonName("name")),
    ReadmeBody: S.optional(S.String).pipe(T.JsonName("readmeBody")),
    ReadmeUrl: S.optional(S.String).pipe(T.JsonName("readmeUrl")),
    SemanticVersion: S.optional(S.String).pipe(T.JsonName("semanticVersion")),
    SourceCodeArchiveUrl: S.optional(S.String).pipe(
      T.JsonName("sourceCodeArchiveUrl"),
    ),
    SourceCodeUrl: S.optional(S.String).pipe(T.JsonName("sourceCodeUrl")),
    SpdxLicenseId: S.optional(S.String).pipe(T.JsonName("spdxLicenseId")),
    TemplateBody: S.optional(S.String).pipe(T.JsonName("templateBody")),
    TemplateUrl: S.optional(S.String).pipe(T.JsonName("templateUrl")),
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
export class CreateApplicationVersionRequest extends S.Class<CreateApplicationVersionRequest>(
  "CreateApplicationVersionRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SemanticVersion: S.String.pipe(T.HttpLabel()),
    SourceCodeArchiveUrl: S.optional(S.String).pipe(
      T.JsonName("sourceCodeArchiveUrl"),
    ),
    SourceCodeUrl: S.optional(S.String).pipe(T.JsonName("sourceCodeUrl")),
    TemplateBody: S.optional(S.String).pipe(T.JsonName("templateBody")),
    TemplateUrl: S.optional(S.String).pipe(T.JsonName("templateUrl")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/applications/{ApplicationId}/versions/{SemanticVersion}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCloudFormationTemplateRequest extends S.Class<CreateCloudFormationTemplateRequest>(
  "CreateCloudFormationTemplateRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SemanticVersion: S.optional(S.String).pipe(T.JsonName("semanticVersion")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications/{ApplicationId}/templates" }),
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
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
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
export class GetApplicationRequest extends S.Class<GetApplicationRequest>(
  "GetApplicationRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SemanticVersion: S.optional(S.String).pipe(T.HttpQuery("semanticVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{ApplicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApplicationPolicyRequest extends S.Class<GetApplicationPolicyRequest>(
  "GetApplicationPolicyRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{ApplicationId}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCloudFormationTemplateRequest extends S.Class<GetCloudFormationTemplateRequest>(
  "GetCloudFormationTemplateRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    TemplateId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/templates/{TemplateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApplicationDependenciesRequest extends S.Class<ListApplicationDependenciesRequest>(
  "ListApplicationDependenciesRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SemanticVersion: S.optional(S.String).pipe(T.HttpQuery("semanticVersion")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{ApplicationId}/dependencies",
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
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
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
export class ListApplicationVersionsRequest extends S.Class<ListApplicationVersionsRequest>(
  "ListApplicationVersionsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{ApplicationId}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UnshareApplicationRequest extends S.Class<UnshareApplicationRequest>(
  "UnshareApplicationRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    OrganizationId: S.String.pipe(T.JsonName("organizationId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications/{ApplicationId}/unshare" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UnshareApplicationResponse extends S.Class<UnshareApplicationResponse>(
  "UnshareApplicationResponse",
)({}) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    Author: S.optional(S.String).pipe(T.JsonName("author")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HomePageUrl: S.optional(S.String).pipe(T.JsonName("homePageUrl")),
    Labels: S.optional(__listOf__string).pipe(T.JsonName("labels")),
    ReadmeBody: S.optional(S.String).pipe(T.JsonName("readmeBody")),
    ReadmeUrl: S.optional(S.String).pipe(T.JsonName("readmeUrl")),
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
export const __listOfCapability = S.Array(S.String);
export class ParameterValue extends S.Class<ParameterValue>("ParameterValue")({
  Name: S.String.pipe(T.JsonName("name")),
  Value: S.String.pipe(T.JsonName("value")),
}) {}
export const __listOfParameterValue = S.Array(ParameterValue);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String.pipe(T.JsonName("key")),
  Value: S.String.pipe(T.JsonName("value")),
}) {}
export const __listOfTag = S.Array(Tag);
export class ApplicationPolicyStatement extends S.Class<ApplicationPolicyStatement>(
  "ApplicationPolicyStatement",
)({
  Actions: __listOf__string.pipe(T.JsonName("actions")),
  PrincipalOrgIDs: S.optional(__listOf__string).pipe(
    T.JsonName("principalOrgIDs"),
  ),
  Principals: __listOf__string.pipe(T.JsonName("principals")),
  StatementId: S.optional(S.String).pipe(T.JsonName("statementId")),
}) {}
export const __listOfApplicationPolicyStatement = S.Array(
  ApplicationPolicyStatement,
);
export class CreateCloudFormationTemplateResponse extends S.Class<CreateCloudFormationTemplateResponse>(
  "CreateCloudFormationTemplateResponse",
)({
  ApplicationId: S.optional(S.String).pipe(T.JsonName("applicationId")),
  CreationTime: S.optional(S.String).pipe(T.JsonName("creationTime")),
  ExpirationTime: S.optional(S.String).pipe(T.JsonName("expirationTime")),
  SemanticVersion: S.optional(S.String).pipe(T.JsonName("semanticVersion")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  TemplateId: S.optional(S.String).pipe(T.JsonName("templateId")),
  TemplateUrl: S.optional(S.String).pipe(T.JsonName("templateUrl")),
}) {}
export class ParameterDefinition extends S.Class<ParameterDefinition>(
  "ParameterDefinition",
)({
  AllowedPattern: S.optional(S.String).pipe(T.JsonName("allowedPattern")),
  AllowedValues: S.optional(__listOf__string).pipe(T.JsonName("allowedValues")),
  ConstraintDescription: S.optional(S.String).pipe(
    T.JsonName("constraintDescription"),
  ),
  DefaultValue: S.optional(S.String).pipe(T.JsonName("defaultValue")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  MaxLength: S.optional(S.Number).pipe(T.JsonName("maxLength")),
  MaxValue: S.optional(S.Number).pipe(T.JsonName("maxValue")),
  MinLength: S.optional(S.Number).pipe(T.JsonName("minLength")),
  MinValue: S.optional(S.Number).pipe(T.JsonName("minValue")),
  Name: S.String.pipe(T.JsonName("name")),
  NoEcho: S.optional(S.Boolean).pipe(T.JsonName("noEcho")),
  ReferencedByResources: __listOf__string.pipe(
    T.JsonName("referencedByResources"),
  ),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfParameterDefinition = S.Array(ParameterDefinition);
export class Version extends S.Class<Version>("Version")({
  ApplicationId: S.String.pipe(T.JsonName("applicationId")),
  CreationTime: S.String.pipe(T.JsonName("creationTime")),
  ParameterDefinitions: __listOfParameterDefinition.pipe(
    T.JsonName("parameterDefinitions"),
  ),
  RequiredCapabilities: __listOfCapability.pipe(
    T.JsonName("requiredCapabilities"),
  ),
  ResourcesSupported: S.Boolean.pipe(T.JsonName("resourcesSupported")),
  SemanticVersion: S.String.pipe(T.JsonName("semanticVersion")),
  SourceCodeArchiveUrl: S.optional(S.String).pipe(
    T.JsonName("sourceCodeArchiveUrl"),
  ),
  SourceCodeUrl: S.optional(S.String).pipe(T.JsonName("sourceCodeUrl")),
  TemplateUrl: S.String.pipe(T.JsonName("templateUrl")),
}) {}
export class GetApplicationResponse extends S.Class<GetApplicationResponse>(
  "GetApplicationResponse",
)({
  ApplicationId: S.optional(S.String).pipe(T.JsonName("applicationId")),
  Author: S.optional(S.String).pipe(T.JsonName("author")),
  CreationTime: S.optional(S.String).pipe(T.JsonName("creationTime")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  HomePageUrl: S.optional(S.String).pipe(T.JsonName("homePageUrl")),
  IsVerifiedAuthor: S.optional(S.Boolean).pipe(T.JsonName("isVerifiedAuthor")),
  Labels: S.optional(__listOf__string).pipe(T.JsonName("labels")),
  LicenseUrl: S.optional(S.String).pipe(T.JsonName("licenseUrl")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  ReadmeUrl: S.optional(S.String).pipe(T.JsonName("readmeUrl")),
  SpdxLicenseId: S.optional(S.String).pipe(T.JsonName("spdxLicenseId")),
  VerifiedAuthorUrl: S.optional(S.String).pipe(T.JsonName("verifiedAuthorUrl")),
  Version: S.optional(Version).pipe(T.JsonName("version")),
}) {}
export class GetApplicationPolicyResponse extends S.Class<GetApplicationPolicyResponse>(
  "GetApplicationPolicyResponse",
)({
  Statements: S.optional(__listOfApplicationPolicyStatement).pipe(
    T.JsonName("statements"),
  ),
}) {}
export class GetCloudFormationTemplateResponse extends S.Class<GetCloudFormationTemplateResponse>(
  "GetCloudFormationTemplateResponse",
)({
  ApplicationId: S.optional(S.String).pipe(T.JsonName("applicationId")),
  CreationTime: S.optional(S.String).pipe(T.JsonName("creationTime")),
  ExpirationTime: S.optional(S.String).pipe(T.JsonName("expirationTime")),
  SemanticVersion: S.optional(S.String).pipe(T.JsonName("semanticVersion")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  TemplateId: S.optional(S.String).pipe(T.JsonName("templateId")),
  TemplateUrl: S.optional(S.String).pipe(T.JsonName("templateUrl")),
}) {}
export class PutApplicationPolicyRequest extends S.Class<PutApplicationPolicyRequest>(
  "PutApplicationPolicyRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    Statements: __listOfApplicationPolicyStatement.pipe(
      T.JsonName("statements"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/applications/{ApplicationId}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({
  ApplicationId: S.optional(S.String).pipe(T.JsonName("applicationId")),
  Author: S.optional(S.String).pipe(T.JsonName("author")),
  CreationTime: S.optional(S.String).pipe(T.JsonName("creationTime")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  HomePageUrl: S.optional(S.String).pipe(T.JsonName("homePageUrl")),
  IsVerifiedAuthor: S.optional(S.Boolean).pipe(T.JsonName("isVerifiedAuthor")),
  Labels: S.optional(__listOf__string).pipe(T.JsonName("labels")),
  LicenseUrl: S.optional(S.String).pipe(T.JsonName("licenseUrl")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  ReadmeUrl: S.optional(S.String).pipe(T.JsonName("readmeUrl")),
  SpdxLicenseId: S.optional(S.String).pipe(T.JsonName("spdxLicenseId")),
  VerifiedAuthorUrl: S.optional(S.String).pipe(T.JsonName("verifiedAuthorUrl")),
  Version: S.optional(Version).pipe(T.JsonName("version")),
}) {}
export class RollbackTrigger extends S.Class<RollbackTrigger>(
  "RollbackTrigger",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Type: S.String.pipe(T.JsonName("type")),
}) {}
export const __listOfRollbackTrigger = S.Array(RollbackTrigger);
export class RollbackConfiguration extends S.Class<RollbackConfiguration>(
  "RollbackConfiguration",
)({
  MonitoringTimeInMinutes: S.optional(S.Number).pipe(
    T.JsonName("monitoringTimeInMinutes"),
  ),
  RollbackTriggers: S.optional(__listOfRollbackTrigger).pipe(
    T.JsonName("rollbackTriggers"),
  ),
}) {}
export class ApplicationDependencySummary extends S.Class<ApplicationDependencySummary>(
  "ApplicationDependencySummary",
)({
  ApplicationId: S.String.pipe(T.JsonName("applicationId")),
  SemanticVersion: S.String.pipe(T.JsonName("semanticVersion")),
}) {}
export const __listOfApplicationDependencySummary = S.Array(
  ApplicationDependencySummary,
);
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
  ApplicationId: S.String.pipe(T.JsonName("applicationId")),
  Author: S.String.pipe(T.JsonName("author")),
  CreationTime: S.optional(S.String).pipe(T.JsonName("creationTime")),
  Description: S.String.pipe(T.JsonName("description")),
  HomePageUrl: S.optional(S.String).pipe(T.JsonName("homePageUrl")),
  Labels: S.optional(__listOf__string).pipe(T.JsonName("labels")),
  Name: S.String.pipe(T.JsonName("name")),
  SpdxLicenseId: S.optional(S.String).pipe(T.JsonName("spdxLicenseId")),
}) {}
export const __listOfApplicationSummary = S.Array(ApplicationSummary);
export class VersionSummary extends S.Class<VersionSummary>("VersionSummary")({
  ApplicationId: S.String.pipe(T.JsonName("applicationId")),
  CreationTime: S.String.pipe(T.JsonName("creationTime")),
  SemanticVersion: S.String.pipe(T.JsonName("semanticVersion")),
  SourceCodeUrl: S.optional(S.String).pipe(T.JsonName("sourceCodeUrl")),
}) {}
export const __listOfVersionSummary = S.Array(VersionSummary);
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({
  ApplicationId: S.optional(S.String).pipe(T.JsonName("applicationId")),
  Author: S.optional(S.String).pipe(T.JsonName("author")),
  CreationTime: S.optional(S.String).pipe(T.JsonName("creationTime")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  HomePageUrl: S.optional(S.String).pipe(T.JsonName("homePageUrl")),
  IsVerifiedAuthor: S.optional(S.Boolean).pipe(T.JsonName("isVerifiedAuthor")),
  Labels: S.optional(__listOf__string).pipe(T.JsonName("labels")),
  LicenseUrl: S.optional(S.String).pipe(T.JsonName("licenseUrl")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  ReadmeUrl: S.optional(S.String).pipe(T.JsonName("readmeUrl")),
  SpdxLicenseId: S.optional(S.String).pipe(T.JsonName("spdxLicenseId")),
  VerifiedAuthorUrl: S.optional(S.String).pipe(T.JsonName("verifiedAuthorUrl")),
  Version: S.optional(Version).pipe(T.JsonName("version")),
}) {}
export class CreateApplicationVersionResponse extends S.Class<CreateApplicationVersionResponse>(
  "CreateApplicationVersionResponse",
)({
  ApplicationId: S.optional(S.String).pipe(T.JsonName("applicationId")),
  CreationTime: S.optional(S.String).pipe(T.JsonName("creationTime")),
  ParameterDefinitions: S.optional(__listOfParameterDefinition).pipe(
    T.JsonName("parameterDefinitions"),
  ),
  RequiredCapabilities: S.optional(__listOfCapability).pipe(
    T.JsonName("requiredCapabilities"),
  ),
  ResourcesSupported: S.optional(S.Boolean).pipe(
    T.JsonName("resourcesSupported"),
  ),
  SemanticVersion: S.optional(S.String).pipe(T.JsonName("semanticVersion")),
  SourceCodeArchiveUrl: S.optional(S.String).pipe(
    T.JsonName("sourceCodeArchiveUrl"),
  ),
  SourceCodeUrl: S.optional(S.String).pipe(T.JsonName("sourceCodeUrl")),
  TemplateUrl: S.optional(S.String).pipe(T.JsonName("templateUrl")),
}) {}
export class CreateCloudFormationChangeSetRequest extends S.Class<CreateCloudFormationChangeSetRequest>(
  "CreateCloudFormationChangeSetRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    Capabilities: S.optional(__listOf__string).pipe(T.JsonName("capabilities")),
    ChangeSetName: S.optional(S.String).pipe(T.JsonName("changeSetName")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    NotificationArns: S.optional(__listOf__string).pipe(
      T.JsonName("notificationArns"),
    ),
    ParameterOverrides: S.optional(__listOfParameterValue).pipe(
      T.JsonName("parameterOverrides"),
    ),
    ResourceTypes: S.optional(__listOf__string).pipe(
      T.JsonName("resourceTypes"),
    ),
    RollbackConfiguration: S.optional(RollbackConfiguration).pipe(
      T.JsonName("rollbackConfiguration"),
    ),
    SemanticVersion: S.optional(S.String).pipe(T.JsonName("semanticVersion")),
    StackName: S.String.pipe(T.JsonName("stackName")),
    Tags: S.optional(__listOfTag).pipe(T.JsonName("tags")),
    TemplateId: S.optional(S.String).pipe(T.JsonName("templateId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications/{ApplicationId}/changesets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApplicationDependenciesResponse extends S.Class<ListApplicationDependenciesResponse>(
  "ListApplicationDependenciesResponse",
)({
  Dependencies: S.optional(__listOfApplicationDependencySummary).pipe(
    T.JsonName("dependencies"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)({
  Applications: S.optional(__listOfApplicationSummary).pipe(
    T.JsonName("applications"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListApplicationVersionsResponse extends S.Class<ListApplicationVersionsResponse>(
  "ListApplicationVersionsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Versions: S.optional(__listOfVersionSummary).pipe(T.JsonName("versions")),
}) {}
export class PutApplicationPolicyResponse extends S.Class<PutApplicationPolicyResponse>(
  "PutApplicationPolicyResponse",
)({
  Statements: S.optional(__listOfApplicationPolicyStatement).pipe(
    T.JsonName("statements"),
  ),
}) {}
export class CreateCloudFormationChangeSetResponse extends S.Class<CreateCloudFormationChangeSetResponse>(
  "CreateCloudFormationChangeSetResponse",
)({
  ApplicationId: S.optional(S.String).pipe(T.JsonName("applicationId")),
  ChangeSetId: S.optional(S.String).pipe(T.JsonName("changeSetId")),
  SemanticVersion: S.optional(S.String).pipe(T.JsonName("semanticVersion")),
  StackId: S.optional(S.String).pipe(T.JsonName("stackId")),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}

//# Operations
/**
 * Gets the specified AWS CloudFormation template.
 */
export const getCloudFormationTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCloudFormationTemplateRequest,
    output: GetCloudFormationTemplateResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Unshares an application from an AWS Organization.
 *
 * This operation can be called only from the organization's master account.
 */
export const unshareApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnshareApplicationRequest,
  output: UnshareApplicationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the specified application.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an application, optionally including an AWS SAM file to create the first application version in the same call.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an application version.
 */
export const createApplicationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateApplicationVersionRequest,
    output: CreateApplicationVersionResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates an AWS CloudFormation template.
 */
export const createCloudFormationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCloudFormationTemplateRequest,
    output: CreateCloudFormationTemplateResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Deletes the specified application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the specified application.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the policy for the application.
 */
export const getApplicationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApplicationPolicyRequest,
    output: GetApplicationPolicyResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves the list of applications nested in the containing application.
 */
export const listApplicationDependencies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListApplicationDependenciesRequest,
    output: ListApplicationDependenciesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Lists applications owned by the requester.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Lists versions for the specified application.
 */
export const listApplicationVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListApplicationVersionsRequest,
    output: ListApplicationVersionsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Sets the permission policy for an application. For the list of actions supported for this operation, see
 * Application
 * Permissions
 * .
 */
export const putApplicationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutApplicationPolicyRequest,
    output: PutApplicationPolicyResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates an AWS CloudFormation change set for the given application.
 */
export const createCloudFormationChangeSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCloudFormationChangeSetRequest,
    output: CreateCloudFormationChangeSetResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      TooManyRequestsException,
    ],
  }));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "Ssm Sap", serviceShapeName: "SsmSap" });
const auth = T.AwsAuthSigv4({ name: "ssm-sap" });
const ver = T.ServiceVersion("2018-05-10");
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
                                url: "https://ssm-sap-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://ssm-sap-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://ssm-sap.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ssm-sap.{Region}.{PartitionResult#dnsSuffix}",
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
export const InstanceList = S.Array(S.String);
export const ConfigurationCheckTypeList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteResourcePermissionInput extends S.Class<DeleteResourcePermissionInput>(
  "DeleteResourcePermissionInput",
)(
  {
    ActionType: S.optional(S.String),
    SourceResourceArn: S.optional(S.String),
    ResourceArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/delete-resource-permission" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterApplicationInput extends S.Class<DeregisterApplicationInput>(
  "DeregisterApplicationInput",
)(
  { ApplicationId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/deregister-application" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterApplicationOutput extends S.Class<DeregisterApplicationOutput>(
  "DeregisterApplicationOutput",
)({}) {}
export class GetApplicationInput extends S.Class<GetApplicationInput>(
  "GetApplicationInput",
)(
  {
    ApplicationId: S.optional(S.String),
    ApplicationArn: S.optional(S.String),
    AppRegistryArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/get-application" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetComponentInput extends S.Class<GetComponentInput>(
  "GetComponentInput",
)(
  { ApplicationId: S.String, ComponentId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-component" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfigurationCheckOperationInput extends S.Class<GetConfigurationCheckOperationInput>(
  "GetConfigurationCheckOperationInput",
)(
  { OperationId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-configuration-check-operation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDatabaseInput extends S.Class<GetDatabaseInput>(
  "GetDatabaseInput",
)(
  {
    ApplicationId: S.optional(S.String),
    ComponentId: S.optional(S.String),
    DatabaseId: S.optional(S.String),
    DatabaseArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/get-database" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOperationInput extends S.Class<GetOperationInput>(
  "GetOperationInput",
)(
  { OperationId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-operation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePermissionInput extends S.Class<GetResourcePermissionInput>(
  "GetResourcePermissionInput",
)(
  { ActionType: S.optional(S.String), ResourceArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-resource-permission" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListComponentsInput extends S.Class<ListComponentsInput>(
  "ListComponentsInput",
)(
  {
    ApplicationId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-components" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigurationCheckDefinitionsInput extends S.Class<ListConfigurationCheckDefinitionsInput>(
  "ListConfigurationCheckDefinitionsInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/list-configuration-check-definitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.String,
  Value: S.String,
  Operator: S.String,
}) {}
export const FilterList = S.Array(Filter);
export class ListConfigurationCheckOperationsInput extends S.Class<ListConfigurationCheckOperationsInput>(
  "ListConfigurationCheckOperationsInput",
)(
  {
    ApplicationId: S.String,
    ListMode: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(FilterList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-configuration-check-operations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDatabasesInput extends S.Class<ListDatabasesInput>(
  "ListDatabasesInput",
)(
  {
    ApplicationId: S.optional(S.String),
    ComponentId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-databases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOperationEventsInput extends S.Class<ListOperationEventsInput>(
  "ListOperationEventsInput",
)(
  {
    OperationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(FilterList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-operation-events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOperationsInput extends S.Class<ListOperationsInput>(
  "ListOperationsInput",
)(
  {
    ApplicationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(FilterList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-operations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubCheckResultsInput extends S.Class<ListSubCheckResultsInput>(
  "ListSubCheckResultsInput",
)(
  {
    OperationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-sub-check-results" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubCheckRuleResultsInput extends S.Class<ListSubCheckRuleResultsInput>(
  "ListSubCheckRuleResultsInput",
)(
  {
    SubCheckResultId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-sub-check-rule-results" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePermissionInput extends S.Class<PutResourcePermissionInput>(
  "PutResourcePermissionInput",
)(
  { ActionType: S.String, SourceResourceArn: S.String, ResourceArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/put-resource-permission" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartApplicationInput extends S.Class<StartApplicationInput>(
  "StartApplicationInput",
)(
  { ApplicationId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/start-application" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartApplicationRefreshInput extends S.Class<StartApplicationRefreshInput>(
  "StartApplicationRefreshInput",
)(
  { ApplicationId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/start-application-refresh" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartConfigurationChecksInput extends S.Class<StartConfigurationChecksInput>(
  "StartConfigurationChecksInput",
)(
  {
    ApplicationId: S.String,
    ConfigurationCheckIds: S.optional(ConfigurationCheckTypeList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/start-configuration-checks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopApplicationInput extends S.Class<StopApplicationInput>(
  "StopApplicationInput",
)(
  {
    ApplicationId: S.String,
    StopConnectedEntity: S.optional(S.String),
    IncludeEc2InstanceShutdown: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/stop-application" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
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
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
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
export class RuleStatusCounts extends S.Class<RuleStatusCounts>(
  "RuleStatusCounts",
)({
  Failed: S.optional(S.Number),
  Warning: S.optional(S.Number),
  Info: S.optional(S.Number),
  Passed: S.optional(S.Number),
  Unknown: S.optional(S.Number),
}) {}
export class ConfigurationCheckOperation extends S.Class<ConfigurationCheckOperation>(
  "ConfigurationCheckOperation",
)({
  Id: S.optional(S.String),
  ApplicationId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  ConfigurationCheckId: S.optional(S.String),
  ConfigurationCheckName: S.optional(S.String),
  ConfigurationCheckDescription: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RuleStatusCounts: S.optional(RuleStatusCounts),
}) {}
export const ConfigurationCheckOperationList = S.Array(
  ConfigurationCheckOperation,
);
export const OperationProperties = S.Record({
  key: S.String,
  value: S.String,
}).pipe(T.Sparse());
export class Operation extends S.Class<Operation>("Operation")({
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  Properties: S.optional(OperationProperties),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OperationList = S.Array(Operation);
export class ApplicationCredential extends S.Class<ApplicationCredential>(
  "ApplicationCredential",
)({ DatabaseName: S.String, CredentialType: S.String, SecretId: S.String }) {}
export const ApplicationCredentialList = S.Array(ApplicationCredential);
export class ComponentInfo extends S.Class<ComponentInfo>("ComponentInfo")({
  ComponentType: S.String,
  Sid: S.String,
  Ec2InstanceId: S.String,
}) {}
export const ComponentInfoList = S.Array(ComponentInfo);
export class BackintConfig extends S.Class<BackintConfig>("BackintConfig")({
  BackintMode: S.String,
  EnsureNoBackupInProcess: S.Boolean,
}) {}
export class DeleteResourcePermissionOutput extends S.Class<DeleteResourcePermissionOutput>(
  "DeleteResourcePermissionOutput",
)({ Policy: S.optional(S.String) }) {}
export class GetResourcePermissionOutput extends S.Class<GetResourcePermissionOutput>(
  "GetResourcePermissionOutput",
)({ Policy: S.optional(S.String) }) {}
export class ListApplicationsInput extends S.Class<ListApplicationsInput>(
  "ListApplicationsInput",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigurationCheckOperationsOutput extends S.Class<ListConfigurationCheckOperationsOutput>(
  "ListConfigurationCheckOperationsOutput",
)({
  ConfigurationCheckOperations: S.optional(ConfigurationCheckOperationList),
  NextToken: S.optional(S.String),
}) {}
export class ListOperationsOutput extends S.Class<ListOperationsOutput>(
  "ListOperationsOutput",
)({ Operations: S.optional(OperationList), NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class PutResourcePermissionOutput extends S.Class<PutResourcePermissionOutput>(
  "PutResourcePermissionOutput",
)({ Policy: S.optional(S.String) }) {}
export class RegisterApplicationInput extends S.Class<RegisterApplicationInput>(
  "RegisterApplicationInput",
)(
  {
    ApplicationId: S.String,
    ApplicationType: S.String,
    Instances: InstanceList,
    SapInstanceNumber: S.optional(S.String),
    Sid: S.optional(S.String),
    Tags: S.optional(TagMap),
    Credentials: S.optional(ApplicationCredentialList),
    DatabaseArn: S.optional(S.String),
    ComponentsInfo: S.optional(ComponentInfoList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/register-application" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartApplicationOutput extends S.Class<StartApplicationOutput>(
  "StartApplicationOutput",
)({ OperationId: S.optional(S.String) }) {}
export class StartApplicationRefreshOutput extends S.Class<StartApplicationRefreshOutput>(
  "StartApplicationRefreshOutput",
)({ OperationId: S.optional(S.String) }) {}
export class StartConfigurationChecksOutput extends S.Class<StartConfigurationChecksOutput>(
  "StartConfigurationChecksOutput",
)({
  ConfigurationCheckOperations: S.optional(ConfigurationCheckOperationList),
}) {}
export class StopApplicationOutput extends S.Class<StopApplicationOutput>(
  "StopApplicationOutput",
)({ OperationId: S.optional(S.String) }) {}
export class UpdateApplicationSettingsInput extends S.Class<UpdateApplicationSettingsInput>(
  "UpdateApplicationSettingsInput",
)(
  {
    ApplicationId: S.String,
    CredentialsToAddOrUpdate: S.optional(ApplicationCredentialList),
    CredentialsToRemove: S.optional(ApplicationCredentialList),
    Backint: S.optional(BackintConfig),
    DatabaseArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-application-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ComponentIdList = S.Array(S.String);
export const ApplicationArnList = S.Array(S.String);
export const DatabaseIdList = S.Array(S.String);
export const ComponentArnList = S.Array(S.String);
export const ApplicationTypeList = S.Array(S.String);
export const SubCheckReferencesList = S.Array(S.String);
export class Application extends S.Class<Application>("Application")({
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  Arn: S.optional(S.String),
  AppRegistryArn: S.optional(S.String),
  Status: S.optional(S.String),
  DiscoveryStatus: S.optional(S.String),
  Components: S.optional(ComponentIdList),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StatusMessage: S.optional(S.String),
  AssociatedApplicationArns: S.optional(ApplicationArnList),
}) {}
export class Database extends S.Class<Database>("Database")({
  ApplicationId: S.optional(S.String),
  ComponentId: S.optional(S.String),
  Credentials: S.optional(ApplicationCredentialList),
  DatabaseId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  DatabaseType: S.optional(S.String),
  Arn: S.optional(S.String),
  Status: S.optional(S.String),
  PrimaryHost: S.optional(S.String),
  SQLPort: S.optional(S.Number),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ConnectedComponentArns: S.optional(ComponentArnList),
}) {}
export class ComponentSummary extends S.Class<ComponentSummary>(
  "ComponentSummary",
)({
  ApplicationId: S.optional(S.String),
  ComponentId: S.optional(S.String),
  ComponentType: S.optional(S.String),
  Tags: S.optional(TagMap),
  Arn: S.optional(S.String),
}) {}
export const ComponentSummaryList = S.Array(ComponentSummary);
export class ConfigurationCheckDefinition extends S.Class<ConfigurationCheckDefinition>(
  "ConfigurationCheckDefinition",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  ApplicableApplicationTypes: S.optional(ApplicationTypeList),
}) {}
export const ConfigurationCheckDefinitionList = S.Array(
  ConfigurationCheckDefinition,
);
export class DatabaseSummary extends S.Class<DatabaseSummary>(
  "DatabaseSummary",
)({
  ApplicationId: S.optional(S.String),
  ComponentId: S.optional(S.String),
  DatabaseId: S.optional(S.String),
  DatabaseType: S.optional(S.String),
  Arn: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export const DatabaseSummaryList = S.Array(DatabaseSummary);
export class SubCheckResult extends S.Class<SubCheckResult>("SubCheckResult")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  References: S.optional(SubCheckReferencesList),
}) {}
export const SubCheckResultList = S.Array(SubCheckResult);
export const OperationIdList = S.Array(S.String);
export class GetApplicationOutput extends S.Class<GetApplicationOutput>(
  "GetApplicationOutput",
)({ Application: S.optional(Application), Tags: S.optional(TagMap) }) {}
export class GetDatabaseOutput extends S.Class<GetDatabaseOutput>(
  "GetDatabaseOutput",
)({ Database: S.optional(Database), Tags: S.optional(TagMap) }) {}
export class ListComponentsOutput extends S.Class<ListComponentsOutput>(
  "ListComponentsOutput",
)({
  Components: S.optional(ComponentSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListConfigurationCheckDefinitionsOutput extends S.Class<ListConfigurationCheckDefinitionsOutput>(
  "ListConfigurationCheckDefinitionsOutput",
)({
  ConfigurationChecks: S.optional(ConfigurationCheckDefinitionList),
  NextToken: S.optional(S.String),
}) {}
export class ListDatabasesOutput extends S.Class<ListDatabasesOutput>(
  "ListDatabasesOutput",
)({
  Databases: S.optional(DatabaseSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListSubCheckResultsOutput extends S.Class<ListSubCheckResultsOutput>(
  "ListSubCheckResultsOutput",
)({
  SubCheckResults: S.optional(SubCheckResultList),
  NextToken: S.optional(S.String),
}) {}
export class RegisterApplicationOutput extends S.Class<RegisterApplicationOutput>(
  "RegisterApplicationOutput",
)({
  Application: S.optional(Application),
  OperationId: S.optional(S.String),
}) {}
export class UpdateApplicationSettingsOutput extends S.Class<UpdateApplicationSettingsOutput>(
  "UpdateApplicationSettingsOutput",
)({
  Message: S.optional(S.String),
  OperationIds: S.optional(OperationIdList),
}) {}
export class Resilience extends S.Class<Resilience>("Resilience")({
  HsrTier: S.optional(S.String),
  HsrReplicationMode: S.optional(S.String),
  HsrOperationMode: S.optional(S.String),
  ClusterStatus: S.optional(S.String),
  EnqueueReplication: S.optional(S.Boolean),
}) {}
export class Host extends S.Class<Host>("Host")({
  HostName: S.optional(S.String),
  HostIp: S.optional(S.String),
  EC2InstanceId: S.optional(S.String),
  InstanceId: S.optional(S.String),
  HostRole: S.optional(S.String),
  OsVersion: S.optional(S.String),
}) {}
export const HostList = S.Array(Host);
export class DatabaseConnection extends S.Class<DatabaseConnection>(
  "DatabaseConnection",
)({
  DatabaseConnectionMethod: S.optional(S.String),
  DatabaseArn: S.optional(S.String),
  ConnectionIp: S.optional(S.String),
}) {}
export class Resource extends S.Class<Resource>("Resource")({
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
}) {}
export const RuleResultMetadata = S.Record({ key: S.String, value: S.String });
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
  Id: S.optional(S.String),
  DiscoveryStatus: S.optional(S.String),
  Type: S.optional(S.String),
  Arn: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export const ApplicationSummaryList = S.Array(ApplicationSummary);
export class OperationEvent extends S.Class<OperationEvent>("OperationEvent")({
  Description: S.optional(S.String),
  Resource: S.optional(Resource),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OperationEventList = S.Array(OperationEvent);
export class RuleResult extends S.Class<RuleResult>("RuleResult")({
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  Metadata: S.optional(RuleResultMetadata),
}) {}
export const RuleResultList = S.Array(RuleResult);
export class IpAddressMember extends S.Class<IpAddressMember>(
  "IpAddressMember",
)({
  IpAddress: S.optional(S.String),
  Primary: S.optional(S.Boolean),
  AllocationType: S.optional(S.String),
}) {}
export const IpAddressList = S.Array(IpAddressMember);
export class GetConfigurationCheckOperationOutput extends S.Class<GetConfigurationCheckOperationOutput>(
  "GetConfigurationCheckOperationOutput",
)({ ConfigurationCheckOperation: S.optional(ConfigurationCheckOperation) }) {}
export class GetOperationOutput extends S.Class<GetOperationOutput>(
  "GetOperationOutput",
)({ Operation: S.optional(Operation) }) {}
export class ListApplicationsOutput extends S.Class<ListApplicationsOutput>(
  "ListApplicationsOutput",
)({
  Applications: S.optional(ApplicationSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListOperationEventsOutput extends S.Class<ListOperationEventsOutput>(
  "ListOperationEventsOutput",
)({
  OperationEvents: S.optional(OperationEventList),
  NextToken: S.optional(S.String),
}) {}
export class ListSubCheckRuleResultsOutput extends S.Class<ListSubCheckRuleResultsOutput>(
  "ListSubCheckRuleResultsOutput",
)({
  RuleResults: S.optional(RuleResultList),
  NextToken: S.optional(S.String),
}) {}
export class AssociatedHost extends S.Class<AssociatedHost>("AssociatedHost")({
  Hostname: S.optional(S.String),
  Ec2InstanceId: S.optional(S.String),
  IpAddresses: S.optional(IpAddressList),
  OsVersion: S.optional(S.String),
}) {}
export class Component extends S.Class<Component>("Component")({
  ComponentId: S.optional(S.String),
  Sid: S.optional(S.String),
  SystemNumber: S.optional(S.String),
  ParentComponent: S.optional(S.String),
  ChildComponents: S.optional(ComponentIdList),
  ApplicationId: S.optional(S.String),
  ComponentType: S.optional(S.String),
  Status: S.optional(S.String),
  SapHostname: S.optional(S.String),
  SapFeature: S.optional(S.String),
  SapKernelVersion: S.optional(S.String),
  HdbVersion: S.optional(S.String),
  Resilience: S.optional(Resilience),
  AssociatedHost: S.optional(AssociatedHost),
  Databases: S.optional(DatabaseIdList),
  Hosts: S.optional(HostList),
  PrimaryHost: S.optional(S.String),
  DatabaseConnection: S.optional(DatabaseConnection),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Arn: S.optional(S.String),
}) {}
export class GetComponentOutput extends S.Class<GetComponentOutput>(
  "GetComponentOutput",
)({ Component: S.optional(Component), Tags: S.optional(TagMap) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the operations performed by AWS Systems Manager for SAP.
 */
export const listOperations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOperationsInput,
  output: ListOperationsOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists the sub-check results of a specified configuration check operation.
 */
export const listSubCheckResults = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSubCheckResultsInput,
  output: ListSubCheckResultsOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Register an SAP application with AWS Systems Manager for SAP. You must meet the following requirements before registering.
 *
 * The SAP application you want to register with AWS Systems Manager for SAP is running on Amazon EC2.
 *
 * AWS Systems Manager Agent must be setup on an Amazon EC2 instance along with the required IAM permissions.
 *
 * Amazon EC2 instance(s) must have access to the secrets created in AWS Secrets Manager to manage SAP applications and components.
 */
export const registerApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterApplicationInput,
  output: RegisterApplicationOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the settings of an application registered with AWS Systems Manager for SAP.
 */
export const updateApplicationSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateApplicationSettingsInput,
    output: UpdateApplicationSettingsOutput,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the configuration check operations performed by AWS Systems Manager for SAP.
 */
export const listConfigurationCheckOperations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListConfigurationCheckOperationsInput,
    output: ListConfigurationCheckOperationsOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Adds permissions to the target database.
 */
export const putResourcePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutResourcePermissionInput,
    output: PutResourcePermissionOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Creates tag for a resource by specifying the ARN.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Removes permissions associated with the target database.
 */
export const deleteResourcePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePermissionInput,
    output: DeleteResourcePermissionOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Delete the tags for a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Lists all tags on an SAP HANA application and/or database registered with AWS Systems Manager for SAP.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Request is an operation which starts an application.
 *
 * Parameter `ApplicationId` is required.
 */
export const startApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartApplicationInput,
  output: StartApplicationOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Refreshes a registered application.
 */
export const startApplicationRefresh = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartApplicationRefreshInput,
    output: StartApplicationRefreshOutput,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Initiates configuration check operations against a specified application.
 */
export const startConfigurationChecks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartConfigurationChecksInput,
    output: StartConfigurationChecksOutput,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Request is an operation to stop an application.
 *
 * Parameter `ApplicationId` is required. Parameters `StopConnectedEntity` and `IncludeEc2InstanceShutdown` are optional.
 */
export const stopApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopApplicationInput,
  output: StopApplicationOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deregister an SAP application with AWS Systems Manager for SAP. This action does not aﬀect the existing setup of your SAP workloads on Amazon EC2.
 */
export const deregisterApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterApplicationInput,
    output: DeregisterApplicationOutput,
    errors: [
      InternalServerException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Gets an application registered with AWS Systems Manager for SAP. It also returns the components of the application.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationInput,
  output: GetApplicationOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Gets the SAP HANA database of an application registered with AWS Systems Manager for SAP.
 */
export const getDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDatabaseInput,
  output: GetDatabaseOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Gets permissions associated with the target database.
 */
export const getResourcePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourcePermissionInput,
    output: GetResourcePermissionOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all the components registered with AWS Systems Manager for SAP.
 */
export const listComponents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListComponentsInput,
  output: ListComponentsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists all configuration check types supported by AWS Systems Manager for SAP.
 */
export const listConfigurationCheckDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListConfigurationCheckDefinitionsInput,
    output: ListConfigurationCheckDefinitionsOutput,
    errors: [InternalServerException, ValidationException],
  }));
/**
 * Lists the SAP HANA databases of an application registered with AWS Systems Manager for SAP.
 */
export const listDatabases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatabasesInput,
  output: ListDatabasesOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the details of a configuration check operation by specifying the operation ID.
 */
export const getConfigurationCheckOperation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfigurationCheckOperationInput,
    output: GetConfigurationCheckOperationOutput,
    errors: [InternalServerException, ValidationException],
  }));
/**
 * Gets the details of an operation by specifying the operation ID.
 */
export const getOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationInput,
  output: GetOperationOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists all the applications registered with AWS Systems Manager for SAP.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApplicationsInput,
  output: ListApplicationsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of operations events.
 *
 * Available parameters include `OperationID`, as well as optional parameters `MaxResults`, `NextToken`, and `Filters`.
 */
export const listOperationEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOperationEventsInput,
  output: ListOperationEventsOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists the rules of a specified sub-check belonging to a configuration check operation.
 */
export const listSubCheckRuleResults = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSubCheckRuleResultsInput,
    output: ListSubCheckRuleResultsOutput,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Gets the component of an application registered with AWS Systems Manager for SAP.
 */
export const getComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentInput,
  output: GetComponentOutput,
  errors: [InternalServerException, UnauthorizedException, ValidationException],
}));

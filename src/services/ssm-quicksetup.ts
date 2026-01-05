import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SSM QuickSetup",
  serviceShapeName: "QuickSetup",
});
const auth = T.AwsAuthSigv4({ name: "ssm-quicksetup" });
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
                                url: "https://ssm-quicksetup-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://ssm-quicksetup-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://ssm-quicksetup.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ssm-quicksetup.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetServiceSettingsRequest extends S.Class<GetServiceSettingsRequest>(
  "GetServiceSettingsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListQuickSetupTypesRequest extends S.Class<ListQuickSetupTypesRequest>(
  "ListQuickSetupTypesRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagKeys = S.Array(S.String);
export class DeleteConfigurationManagerInput extends S.Class<DeleteConfigurationManagerInput>(
  "DeleteConfigurationManagerInput",
)(
  { ManagerArn: S.String.pipe(T.HttpLabel("ManagerArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/configurationManager/{ManagerArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigurationManagerResponse extends S.Class<DeleteConfigurationManagerResponse>(
  "DeleteConfigurationManagerResponse",
)({}) {}
export class GetConfigurationInput extends S.Class<GetConfigurationInput>(
  "GetConfigurationInput",
)(
  { ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")) },
  T.all(
    T.Http({ method: "GET", uri: "/getConfiguration/{ConfigurationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfigurationManagerInput extends S.Class<GetConfigurationManagerInput>(
  "GetConfigurationManagerInput",
)(
  { ManagerArn: S.String.pipe(T.HttpLabel("ManagerArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/configurationManager/{ManagerArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FilterValues = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  Key: S.String,
  Values: FilterValues,
}) {}
export const FiltersList = S.Array(Filter);
export class ListConfigurationsInput extends S.Class<ListConfigurationsInput>(
  "ListConfigurationsInput",
)(
  {
    StartingToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Filters: S.optional(FiltersList),
    ManagerArn: S.optional(S.String),
    ConfigurationDefinitionId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listConfigurations" }),
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
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagsMap },
  T.all(
    T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export class UpdateConfigurationManagerInput extends S.Class<UpdateConfigurationManagerInput>(
  "UpdateConfigurationManagerInput",
)(
  {
    ManagerArn: S.String.pipe(T.HttpLabel("ManagerArn")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/configurationManager/{ManagerArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConfigurationManagerResponse extends S.Class<UpdateConfigurationManagerResponse>(
  "UpdateConfigurationManagerResponse",
)({}) {}
export class UpdateServiceSettingsInput extends S.Class<UpdateServiceSettingsInput>(
  "UpdateServiceSettingsInput",
)(
  { ExplorerEnablingRoleArn: S.optional(S.String) },
  T.all(
    T.Http({ method: "PUT", uri: "/serviceSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateServiceSettingsResponse extends S.Class<UpdateServiceSettingsResponse>(
  "UpdateServiceSettingsResponse",
)({}) {}
export const ConfigurationParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ConfigurationDefinitionInput extends S.Class<ConfigurationDefinitionInput>(
  "ConfigurationDefinitionInput",
)({
  Type: S.String,
  Parameters: ConfigurationParametersMap,
  TypeVersion: S.optional(S.String),
  LocalDeploymentExecutionRoleName: S.optional(S.String),
  LocalDeploymentAdministrationRoleArn: S.optional(S.String),
}) {}
export const ConfigurationDefinitionsInputList = S.Array(
  ConfigurationDefinitionInput,
);
export class ServiceSettings extends S.Class<ServiceSettings>(
  "ServiceSettings",
)({ ExplorerEnablingRoleArn: S.optional(S.String) }) {}
export class QuickSetupTypeOutput extends S.Class<QuickSetupTypeOutput>(
  "QuickSetupTypeOutput",
)({ Type: S.optional(S.String), LatestVersion: S.optional(S.String) }) {}
export const QuickSetupTypeList = S.Array(QuickSetupTypeOutput);
export class CreateConfigurationManagerInput extends S.Class<CreateConfigurationManagerInput>(
  "CreateConfigurationManagerInput",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ConfigurationDefinitions: ConfigurationDefinitionsInputList,
    Tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/configurationManager" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceSettingsOutput extends S.Class<GetServiceSettingsOutput>(
  "GetServiceSettingsOutput",
)({ ServiceSettings: S.optional(ServiceSettings) }) {}
export class ListConfigurationManagersInput extends S.Class<ListConfigurationManagersInput>(
  "ListConfigurationManagersInput",
)(
  {
    StartingToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Filters: S.optional(FiltersList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listConfigurationManagers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQuickSetupTypesOutput extends S.Class<ListQuickSetupTypesOutput>(
  "ListQuickSetupTypesOutput",
)({ QuickSetupTypeList: S.optional(QuickSetupTypeList) }) {}
export class UpdateConfigurationDefinitionInput extends S.Class<UpdateConfigurationDefinitionInput>(
  "UpdateConfigurationDefinitionInput",
)(
  {
    ManagerArn: S.String.pipe(T.HttpLabel("ManagerArn")),
    Id: S.String.pipe(T.HttpLabel("Id")),
    TypeVersion: S.optional(S.String),
    Parameters: S.optional(ConfigurationParametersMap),
    LocalDeploymentExecutionRoleName: S.optional(S.String),
    LocalDeploymentAdministrationRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/configurationDefinition/{ManagerArn}/{Id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConfigurationDefinitionResponse extends S.Class<UpdateConfigurationDefinitionResponse>(
  "UpdateConfigurationDefinitionResponse",
)({}) {}
export class ConfigurationDefinition extends S.Class<ConfigurationDefinition>(
  "ConfigurationDefinition",
)({
  Type: S.String,
  Parameters: ConfigurationParametersMap,
  TypeVersion: S.optional(S.String),
  LocalDeploymentExecutionRoleName: S.optional(S.String),
  LocalDeploymentAdministrationRoleArn: S.optional(S.String),
  Id: S.optional(S.String),
}) {}
export const ConfigurationDefinitionsList = S.Array(ConfigurationDefinition);
export const StatusDetails = S.Record({ key: S.String, value: S.String });
export class StatusSummary extends S.Class<StatusSummary>("StatusSummary")({
  StatusType: S.String,
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  StatusDetails: S.optional(StatusDetails),
}) {}
export const StatusSummariesList = S.Array(StatusSummary);
export class ConfigurationSummary extends S.Class<ConfigurationSummary>(
  "ConfigurationSummary",
)({
  Id: S.optional(S.String),
  ManagerArn: S.optional(S.String),
  ConfigurationDefinitionId: S.optional(S.String),
  Type: S.optional(S.String),
  TypeVersion: S.optional(S.String),
  Region: S.optional(S.String),
  Account: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  FirstClassParameters: S.optional(ConfigurationParametersMap),
  StatusSummaries: S.optional(StatusSummariesList),
}) {}
export const ConfigurationsList = S.Array(ConfigurationSummary);
export class TagEntry extends S.Class<TagEntry>("TagEntry")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const Tags = S.Array(TagEntry);
export class CreateConfigurationManagerOutput extends S.Class<CreateConfigurationManagerOutput>(
  "CreateConfigurationManagerOutput",
)({ ManagerArn: S.String }) {}
export class GetConfigurationManagerOutput extends S.Class<GetConfigurationManagerOutput>(
  "GetConfigurationManagerOutput",
)({
  ManagerArn: S.String,
  Description: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StatusSummaries: S.optional(StatusSummariesList),
  ConfigurationDefinitions: S.optional(ConfigurationDefinitionsList),
  Tags: S.optional(TagsMap),
}) {}
export class ListConfigurationsOutput extends S.Class<ListConfigurationsOutput>(
  "ListConfigurationsOutput",
)({
  ConfigurationsList: S.optional(ConfigurationsList),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }) {}
export class GetConfigurationOutput extends S.Class<GetConfigurationOutput>(
  "GetConfigurationOutput",
)({
  Id: S.optional(S.String),
  ManagerArn: S.optional(S.String),
  ConfigurationDefinitionId: S.optional(S.String),
  Type: S.optional(S.String),
  TypeVersion: S.optional(S.String),
  Account: S.optional(S.String),
  Region: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StatusSummaries: S.optional(StatusSummariesList),
  Parameters: S.optional(ConfigurationParametersMap),
}) {}
export class ConfigurationDefinitionSummary extends S.Class<ConfigurationDefinitionSummary>(
  "ConfigurationDefinitionSummary",
)({
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  TypeVersion: S.optional(S.String),
  FirstClassParameters: S.optional(ConfigurationParametersMap),
}) {}
export const ConfigurationDefinitionSummariesList = S.Array(
  ConfigurationDefinitionSummary,
);
export class ConfigurationManagerSummary extends S.Class<ConfigurationManagerSummary>(
  "ConfigurationManagerSummary",
)({
  ManagerArn: S.String,
  Description: S.optional(S.String),
  Name: S.optional(S.String),
  StatusSummaries: S.optional(StatusSummariesList),
  ConfigurationDefinitionSummaries: S.optional(
    ConfigurationDefinitionSummariesList,
  ),
}) {}
export const ConfigurationManagerList = S.Array(ConfigurationManagerSummary);
export class ListConfigurationManagersOutput extends S.Class<ListConfigurationManagersOutput>(
  "ListConfigurationManagersOutput",
)({
  ConfigurationManagersList: S.optional(ConfigurationManagerList),
  NextToken: S.optional(S.String),
}) {}

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
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns settings configured for Quick Setup in the requesting Amazon Web Services account and Amazon Web Services Region.
 */
export const getServiceSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceSettingsRequest,
  output: GetServiceSettingsOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
  ],
}));
/**
 * Returns the available Quick Setup types.
 */
export const listQuickSetupTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListQuickSetupTypesRequest,
  output: ListQuickSetupTypesOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
  ],
}));
/**
 * Returns details about the specified configuration.
 */
export const getConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationInput,
  output: GetConfigurationOutput,
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
 * Returns a configuration manager.
 */
export const getConfigurationManager = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConfigurationManagerInput,
    output: GetConfigurationManagerOutput,
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
 * Returns configurations deployed by Quick Setup in the requesting Amazon Web Services account and Amazon Web Services Region.
 */
export const listConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListConfigurationsInput,
    output: ListConfigurationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "StartingToken",
      outputToken: "NextToken",
      items: "ConfigurationsList",
      pageSize: "MaxItems",
    } as const,
  }),
);
/**
 * Returns tags assigned to the resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
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
 * Updates a Quick Setup configuration definition.
 */
export const updateConfigurationDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfigurationDefinitionInput,
    output: UpdateConfigurationDefinitionResponse,
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
 * Assigns key-value pairs of metadata to Amazon Web Services resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
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
 * Removes tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
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
 * Updates a Quick Setup configuration manager.
 */
export const updateConfigurationManager = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConfigurationManagerInput,
    output: UpdateConfigurationManagerResponse,
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
 * Updates settings configured for Quick Setup.
 */
export const updateServiceSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceSettingsInput,
    output: UpdateServiceSettingsResponse,
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
 * Creates a Quick Setup configuration manager resource. This object is a collection
 * of desired state configurations for multiple configuration definitions and
 * summaries describing the deployments of those definitions.
 */
export const createConfigurationManager = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConfigurationManagerInput,
    output: CreateConfigurationManagerOutput,
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
 * Deletes a configuration manager.
 */
export const deleteConfigurationManager = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConfigurationManagerInput,
    output: DeleteConfigurationManagerResponse,
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
 * Returns Quick Setup configuration managers.
 */
export const listConfigurationManagers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListConfigurationManagersInput,
    output: ListConfigurationManagersOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "StartingToken",
      outputToken: "NextToken",
      items: "ConfigurationManagersList",
      pageSize: "MaxItems",
    } as const,
  }));

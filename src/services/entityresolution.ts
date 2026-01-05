import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "EntityResolution",
  serviceShapeName: "AWSVeniceService",
});
const auth = T.AwsAuthSigv4({ name: "entityresolution" });
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
                                url: "https://entityresolution-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://entityresolution-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://entityresolution.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://entityresolution.{Region}.{PartitionResult#dnsSuffix}",
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
export const StatementActionList = S.Array(S.String);
export const StatementPrincipalList = S.Array(S.String);
export const UniqueIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AddPolicyStatementInput extends S.Class<AddPolicyStatementInput>(
  "AddPolicyStatementInput",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    statementId: S.String.pipe(T.HttpLabel("statementId")),
    effect: S.String,
    action: StatementActionList,
    principal: StatementPrincipalList,
    condition: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policies/{arn}/{statementId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteUniqueIdInput extends S.Class<BatchDeleteUniqueIdInput>(
  "BatchDeleteUniqueIdInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    inputSource: S.optional(S.String).pipe(T.HttpHeader("inputSource")),
    uniqueIds: UniqueIdList.pipe(T.HttpHeader("uniqueIds")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/matchingworkflows/{workflowName}/uniqueids",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdMappingWorkflowInput extends S.Class<DeleteIdMappingWorkflowInput>(
  "DeleteIdMappingWorkflowInput",
)(
  { workflowName: S.String.pipe(T.HttpLabel("workflowName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/idmappingworkflows/{workflowName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdNamespaceInput extends S.Class<DeleteIdNamespaceInput>(
  "DeleteIdNamespaceInput",
)(
  { idNamespaceName: S.String.pipe(T.HttpLabel("idNamespaceName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/idnamespaces/{idNamespaceName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMatchingWorkflowInput extends S.Class<DeleteMatchingWorkflowInput>(
  "DeleteMatchingWorkflowInput",
)(
  { workflowName: S.String.pipe(T.HttpLabel("workflowName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/matchingworkflows/{workflowName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePolicyStatementInput extends S.Class<DeletePolicyStatementInput>(
  "DeletePolicyStatementInput",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    statementId: S.String.pipe(T.HttpLabel("statementId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/policies/{arn}/{statementId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSchemaMappingInput extends S.Class<DeleteSchemaMappingInput>(
  "DeleteSchemaMappingInput",
)(
  { schemaName: S.String.pipe(T.HttpLabel("schemaName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/schemas/{schemaName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdMappingJobInput extends S.Class<GetIdMappingJobInput>(
  "GetIdMappingJobInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/idmappingworkflows/{workflowName}/jobs/{jobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdMappingWorkflowInput extends S.Class<GetIdMappingWorkflowInput>(
  "GetIdMappingWorkflowInput",
)(
  { workflowName: S.String.pipe(T.HttpLabel("workflowName")) },
  T.all(
    T.Http({ method: "GET", uri: "/idmappingworkflows/{workflowName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdNamespaceInput extends S.Class<GetIdNamespaceInput>(
  "GetIdNamespaceInput",
)(
  { idNamespaceName: S.String.pipe(T.HttpLabel("idNamespaceName")) },
  T.all(
    T.Http({ method: "GET", uri: "/idnamespaces/{idNamespaceName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMatchingJobInput extends S.Class<GetMatchingJobInput>(
  "GetMatchingJobInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/matchingworkflows/{workflowName}/jobs/{jobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMatchingWorkflowInput extends S.Class<GetMatchingWorkflowInput>(
  "GetMatchingWorkflowInput",
)(
  { workflowName: S.String.pipe(T.HttpLabel("workflowName")) },
  T.all(
    T.Http({ method: "GET", uri: "/matchingworkflows/{workflowName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPolicyInput extends S.Class<GetPolicyInput>("GetPolicyInput")(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/policies/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProviderServiceInput extends S.Class<GetProviderServiceInput>(
  "GetProviderServiceInput",
)(
  {
    providerName: S.String.pipe(T.HttpLabel("providerName")),
    providerServiceName: S.String.pipe(T.HttpLabel("providerServiceName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/providerservices/{providerName}/{providerServiceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSchemaMappingInput extends S.Class<GetSchemaMappingInput>(
  "GetSchemaMappingInput",
)(
  { schemaName: S.String.pipe(T.HttpLabel("schemaName")) },
  T.all(
    T.Http({ method: "GET", uri: "/schemas/{schemaName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIdMappingJobsInput extends S.Class<ListIdMappingJobsInput>(
  "ListIdMappingJobsInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/idmappingworkflows/{workflowName}/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIdMappingWorkflowsInput extends S.Class<ListIdMappingWorkflowsInput>(
  "ListIdMappingWorkflowsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/idmappingworkflows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIdNamespacesInput extends S.Class<ListIdNamespacesInput>(
  "ListIdNamespacesInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/idnamespaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMatchingJobsInput extends S.Class<ListMatchingJobsInput>(
  "ListMatchingJobsInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/matchingworkflows/{workflowName}/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMatchingWorkflowsInput extends S.Class<ListMatchingWorkflowsInput>(
  "ListMatchingWorkflowsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/matchingworkflows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProviderServicesInput extends S.Class<ListProviderServicesInput>(
  "ListProviderServicesInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    providerName: S.optional(S.String).pipe(T.HttpQuery("providerName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/providerservices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSchemaMappingsInput extends S.Class<ListSchemaMappingsInput>(
  "ListSchemaMappingsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/schemas" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
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
export class PutPolicyInput extends S.Class<PutPolicyInput>("PutPolicyInput")(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    token: S.optional(S.String),
    policy: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/policies/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMatchingJobInput extends S.Class<StartMatchingJobInput>(
  "StartMatchingJobInput",
)(
  { workflowName: S.String.pipe(T.HttpLabel("workflowName")) },
  T.all(
    T.Http({ method: "POST", uri: "/matchingworkflows/{workflowName}/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
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
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
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
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class IdMappingWorkflowInputSource extends S.Class<IdMappingWorkflowInputSource>(
  "IdMappingWorkflowInputSource",
)({
  inputSourceARN: S.String,
  schemaName: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const IdMappingWorkflowInputSourceConfig = S.Array(
  IdMappingWorkflowInputSource,
);
export class IdMappingWorkflowOutputSource extends S.Class<IdMappingWorkflowOutputSource>(
  "IdMappingWorkflowOutputSource",
)({ KMSArn: S.optional(S.String), outputS3Path: S.String }) {}
export const IdMappingWorkflowOutputSourceConfig = S.Array(
  IdMappingWorkflowOutputSource,
);
export const MatchingKeys = S.Array(S.String);
export class Rule extends S.Class<Rule>("Rule")({
  ruleName: S.String,
  matchingKeys: MatchingKeys,
}) {}
export const RuleList = S.Array(Rule);
export class IdMappingRuleBasedProperties extends S.Class<IdMappingRuleBasedProperties>(
  "IdMappingRuleBasedProperties",
)({
  rules: S.optional(RuleList),
  ruleDefinitionType: S.String,
  attributeMatchingModel: S.String,
  recordMatchingModel: S.String,
}) {}
export class IntermediateSourceConfiguration extends S.Class<IntermediateSourceConfiguration>(
  "IntermediateSourceConfiguration",
)({ intermediateS3Path: S.String }) {}
export class ProviderProperties extends S.Class<ProviderProperties>(
  "ProviderProperties",
)({
  providerServiceArn: S.String,
  providerConfiguration: S.optional(S.Any),
  intermediateSourceConfiguration: S.optional(IntermediateSourceConfiguration),
}) {}
export class IdMappingTechniques extends S.Class<IdMappingTechniques>(
  "IdMappingTechniques",
)({
  idMappingType: S.String,
  ruleBasedProperties: S.optional(IdMappingRuleBasedProperties),
  providerProperties: S.optional(ProviderProperties),
}) {}
export class IdMappingIncrementalRunConfig extends S.Class<IdMappingIncrementalRunConfig>(
  "IdMappingIncrementalRunConfig",
)({ incrementalRunType: S.optional(S.String) }) {}
export class UpdateIdMappingWorkflowInput extends S.Class<UpdateIdMappingWorkflowInput>(
  "UpdateIdMappingWorkflowInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    description: S.optional(S.String),
    inputSourceConfig: IdMappingWorkflowInputSourceConfig,
    outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
    idMappingTechniques: IdMappingTechniques,
    incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
    roleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/idmappingworkflows/{workflowName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IdNamespaceInputSource extends S.Class<IdNamespaceInputSource>(
  "IdNamespaceInputSource",
)({ inputSourceARN: S.String, schemaName: S.optional(S.String) }) {}
export const IdNamespaceInputSourceConfig = S.Array(IdNamespaceInputSource);
export const IdMappingWorkflowRuleDefinitionTypeList = S.Array(S.String);
export const RecordMatchingModelList = S.Array(S.String);
export class NamespaceRuleBasedProperties extends S.Class<NamespaceRuleBasedProperties>(
  "NamespaceRuleBasedProperties",
)({
  rules: S.optional(RuleList),
  ruleDefinitionTypes: S.optional(IdMappingWorkflowRuleDefinitionTypeList),
  attributeMatchingModel: S.optional(S.String),
  recordMatchingModels: S.optional(RecordMatchingModelList),
}) {}
export class NamespaceProviderProperties extends S.Class<NamespaceProviderProperties>(
  "NamespaceProviderProperties",
)({ providerServiceArn: S.String, providerConfiguration: S.optional(S.Any) }) {}
export class IdNamespaceIdMappingWorkflowProperties extends S.Class<IdNamespaceIdMappingWorkflowProperties>(
  "IdNamespaceIdMappingWorkflowProperties",
)({
  idMappingType: S.String,
  ruleBasedProperties: S.optional(NamespaceRuleBasedProperties),
  providerProperties: S.optional(NamespaceProviderProperties),
}) {}
export const IdNamespaceIdMappingWorkflowPropertiesList = S.Array(
  IdNamespaceIdMappingWorkflowProperties,
);
export class UpdateIdNamespaceInput extends S.Class<UpdateIdNamespaceInput>(
  "UpdateIdNamespaceInput",
)(
  {
    idNamespaceName: S.String.pipe(T.HttpLabel("idNamespaceName")),
    description: S.optional(S.String),
    inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
    idMappingWorkflowProperties: S.optional(
      IdNamespaceIdMappingWorkflowPropertiesList,
    ),
    roleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/idnamespaces/{idNamespaceName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InputSource extends S.Class<InputSource>("InputSource")({
  inputSourceARN: S.String,
  schemaName: S.String,
  applyNormalization: S.optional(S.Boolean),
}) {}
export const InputSourceConfig = S.Array(InputSource);
export class OutputAttribute extends S.Class<OutputAttribute>(
  "OutputAttribute",
)({ name: S.String, hashed: S.optional(S.Boolean) }) {}
export const OutputAttributes = S.Array(OutputAttribute);
export class CustomerProfilesIntegrationConfig extends S.Class<CustomerProfilesIntegrationConfig>(
  "CustomerProfilesIntegrationConfig",
)({ domainArn: S.String, objectTypeArn: S.String }) {}
export class OutputSource extends S.Class<OutputSource>("OutputSource")({
  KMSArn: S.optional(S.String),
  outputS3Path: S.optional(S.String),
  output: OutputAttributes,
  applyNormalization: S.optional(S.Boolean),
  customerProfilesIntegrationConfig: S.optional(
    CustomerProfilesIntegrationConfig,
  ),
}) {}
export const OutputSourceConfig = S.Array(OutputSource);
export class RuleBasedProperties extends S.Class<RuleBasedProperties>(
  "RuleBasedProperties",
)({
  rules: RuleList,
  attributeMatchingModel: S.String,
  matchPurpose: S.optional(S.String),
}) {}
export class RuleCondition extends S.Class<RuleCondition>("RuleCondition")({
  ruleName: S.String,
  condition: S.String,
}) {}
export const RuleConditionList = S.Array(RuleCondition);
export class RuleConditionProperties extends S.Class<RuleConditionProperties>(
  "RuleConditionProperties",
)({ rules: RuleConditionList }) {}
export class ResolutionTechniques extends S.Class<ResolutionTechniques>(
  "ResolutionTechniques",
)({
  resolutionType: S.String,
  ruleBasedProperties: S.optional(RuleBasedProperties),
  ruleConditionProperties: S.optional(RuleConditionProperties),
  providerProperties: S.optional(ProviderProperties),
}) {}
export class IncrementalRunConfig extends S.Class<IncrementalRunConfig>(
  "IncrementalRunConfig",
)({ incrementalRunType: S.optional(S.String) }) {}
export class UpdateMatchingWorkflowInput extends S.Class<UpdateMatchingWorkflowInput>(
  "UpdateMatchingWorkflowInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    description: S.optional(S.String),
    inputSourceConfig: InputSourceConfig,
    outputSourceConfig: OutputSourceConfig,
    resolutionTechniques: ResolutionTechniques,
    incrementalRunConfig: S.optional(IncrementalRunConfig),
    roleArn: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/matchingworkflows/{workflowName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SchemaInputAttribute extends S.Class<SchemaInputAttribute>(
  "SchemaInputAttribute",
)({
  fieldName: S.String,
  type: S.String,
  groupName: S.optional(S.String),
  matchKey: S.optional(S.String),
  subType: S.optional(S.String),
  hashed: S.optional(S.Boolean),
}) {}
export const SchemaInputAttributes = S.Array(SchemaInputAttribute);
export class UpdateSchemaMappingInput extends S.Class<UpdateSchemaMappingInput>(
  "UpdateSchemaMappingInput",
)(
  {
    schemaName: S.String.pipe(T.HttpLabel("schemaName")),
    description: S.optional(S.String),
    mappedInputFields: SchemaInputAttributes,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/schemas/{schemaName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DisconnectedUniqueIdsList = S.Array(S.String);
export const RecordAttributeMap = S.Record({ key: S.String, value: S.String });
export class IdMappingJobOutputSource extends S.Class<IdMappingJobOutputSource>(
  "IdMappingJobOutputSource",
)({
  roleArn: S.String,
  outputS3Path: S.String,
  KMSArn: S.optional(S.String),
}) {}
export const IdMappingJobOutputSourceConfig = S.Array(IdMappingJobOutputSource);
export class AddPolicyStatementOutput extends S.Class<AddPolicyStatementOutput>(
  "AddPolicyStatementOutput",
)({ arn: S.String, token: S.String, policy: S.optional(S.String) }) {}
export class CreateSchemaMappingInput extends S.Class<CreateSchemaMappingInput>(
  "CreateSchemaMappingInput",
)(
  {
    schemaName: S.String,
    description: S.optional(S.String),
    mappedInputFields: SchemaInputAttributes,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/schemas" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdMappingWorkflowOutput extends S.Class<DeleteIdMappingWorkflowOutput>(
  "DeleteIdMappingWorkflowOutput",
)({ message: S.String }) {}
export class DeleteIdNamespaceOutput extends S.Class<DeleteIdNamespaceOutput>(
  "DeleteIdNamespaceOutput",
)({ message: S.String }) {}
export class DeleteMatchingWorkflowOutput extends S.Class<DeleteMatchingWorkflowOutput>(
  "DeleteMatchingWorkflowOutput",
)({ message: S.String }) {}
export class DeletePolicyStatementOutput extends S.Class<DeletePolicyStatementOutput>(
  "DeletePolicyStatementOutput",
)({ arn: S.String, token: S.String, policy: S.optional(S.String) }) {}
export class DeleteSchemaMappingOutput extends S.Class<DeleteSchemaMappingOutput>(
  "DeleteSchemaMappingOutput",
)({ message: S.String }) {}
export class GetIdMappingWorkflowOutput extends S.Class<GetIdMappingWorkflowOutput>(
  "GetIdMappingWorkflowOutput",
)({
  workflowName: S.String,
  workflowArn: S.String,
  description: S.optional(S.String),
  inputSourceConfig: IdMappingWorkflowInputSourceConfig,
  outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
  idMappingTechniques: IdMappingTechniques,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
  roleArn: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class GetIdNamespaceOutput extends S.Class<GetIdNamespaceOutput>(
  "GetIdNamespaceOutput",
)({
  idNamespaceName: S.String,
  idNamespaceArn: S.String,
  description: S.optional(S.String),
  inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
  idMappingWorkflowProperties: S.optional(
    IdNamespaceIdMappingWorkflowPropertiesList,
  ),
  type: S.String,
  roleArn: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export class GetMatchIdInput extends S.Class<GetMatchIdInput>(
  "GetMatchIdInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    record: RecordAttributeMap,
    applyNormalization: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/matchingworkflows/{workflowName}/matches",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMatchingWorkflowOutput extends S.Class<GetMatchingWorkflowOutput>(
  "GetMatchingWorkflowOutput",
)({
  workflowName: S.String,
  workflowArn: S.String,
  description: S.optional(S.String),
  inputSourceConfig: InputSourceConfig,
  outputSourceConfig: OutputSourceConfig,
  resolutionTechniques: ResolutionTechniques,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  incrementalRunConfig: S.optional(IncrementalRunConfig),
  roleArn: S.String,
  tags: S.optional(TagMap),
}) {}
export class GetPolicyOutput extends S.Class<GetPolicyOutput>(
  "GetPolicyOutput",
)({ arn: S.String, token: S.String, policy: S.optional(S.String) }) {}
export class GetSchemaMappingOutput extends S.Class<GetSchemaMappingOutput>(
  "GetSchemaMappingOutput",
)({
  schemaName: S.String,
  schemaArn: S.String,
  description: S.optional(S.String),
  mappedInputFields: SchemaInputAttributes,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
  hasWorkflows: S.Boolean,
}) {}
export class JobSummary extends S.Class<JobSummary>("JobSummary")({
  jobId: S.String,
  status: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const JobList = S.Array(JobSummary);
export class ListMatchingJobsOutput extends S.Class<ListMatchingJobsOutput>(
  "ListMatchingJobsOutput",
)({ jobs: S.optional(JobList), nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: TagMap }) {}
export class PutPolicyOutput extends S.Class<PutPolicyOutput>(
  "PutPolicyOutput",
)({ arn: S.String, token: S.String, policy: S.optional(S.String) }) {}
export class StartIdMappingJobInput extends S.Class<StartIdMappingJobInput>(
  "StartIdMappingJobInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    outputSourceConfig: S.optional(IdMappingJobOutputSourceConfig),
    jobType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/idmappingworkflows/{workflowName}/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMatchingJobOutput extends S.Class<StartMatchingJobOutput>(
  "StartMatchingJobOutput",
)({ jobId: S.String }) {}
export class UpdateIdMappingWorkflowOutput extends S.Class<UpdateIdMappingWorkflowOutput>(
  "UpdateIdMappingWorkflowOutput",
)({
  workflowName: S.String,
  workflowArn: S.String,
  description: S.optional(S.String),
  inputSourceConfig: IdMappingWorkflowInputSourceConfig,
  outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
  idMappingTechniques: IdMappingTechniques,
  incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
  roleArn: S.optional(S.String),
}) {}
export class UpdateIdNamespaceOutput extends S.Class<UpdateIdNamespaceOutput>(
  "UpdateIdNamespaceOutput",
)({
  idNamespaceName: S.String,
  idNamespaceArn: S.String,
  description: S.optional(S.String),
  inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
  idMappingWorkflowProperties: S.optional(
    IdNamespaceIdMappingWorkflowPropertiesList,
  ),
  type: S.String,
  roleArn: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateMatchingWorkflowOutput extends S.Class<UpdateMatchingWorkflowOutput>(
  "UpdateMatchingWorkflowOutput",
)({
  workflowName: S.String,
  description: S.optional(S.String),
  inputSourceConfig: InputSourceConfig,
  outputSourceConfig: OutputSourceConfig,
  resolutionTechniques: ResolutionTechniques,
  incrementalRunConfig: S.optional(IncrementalRunConfig),
  roleArn: S.String,
}) {}
export class UpdateSchemaMappingOutput extends S.Class<UpdateSchemaMappingOutput>(
  "UpdateSchemaMappingOutput",
)({
  schemaName: S.String,
  schemaArn: S.String,
  description: S.optional(S.String),
  mappedInputFields: SchemaInputAttributes,
}) {}
export const RecordAttributeMapString255 = S.Record({
  key: S.String,
  value: S.String,
});
export const AwsAccountIdList = S.Array(S.String);
export const RequiredBucketActionsList = S.Array(S.String);
export const SchemaList = S.Array(S.String);
export const Schemas = S.Array(SchemaList);
export class DeleteUniqueIdError extends S.Class<DeleteUniqueIdError>(
  "DeleteUniqueIdError",
)({ uniqueId: S.String, errorType: S.String }) {}
export const DeleteUniqueIdErrorsList = S.Array(DeleteUniqueIdError);
export class DeletedUniqueId extends S.Class<DeletedUniqueId>(
  "DeletedUniqueId",
)({ uniqueId: S.String }) {}
export const DeletedUniqueIdList = S.Array(DeletedUniqueId);
export class Record extends S.Class<Record>("Record")({
  inputSourceARN: S.String,
  uniqueId: S.String,
  recordAttributeMap: RecordAttributeMapString255,
}) {}
export const RecordList = S.Array(Record);
export class IdMappingJobMetrics extends S.Class<IdMappingJobMetrics>(
  "IdMappingJobMetrics",
)({
  inputRecords: S.optional(S.Number),
  totalRecordsProcessed: S.optional(S.Number),
  recordsNotProcessed: S.optional(S.Number),
  deleteRecordsProcessed: S.optional(S.Number),
  totalMappedRecords: S.optional(S.Number),
  totalMappedSourceRecords: S.optional(S.Number),
  totalMappedTargetRecords: S.optional(S.Number),
  uniqueRecordsLoaded: S.optional(S.Number),
  newMappedRecords: S.optional(S.Number),
  newMappedSourceRecords: S.optional(S.Number),
  newMappedTargetRecords: S.optional(S.Number),
  newUniqueRecordsLoaded: S.optional(S.Number),
  mappedRecordsRemoved: S.optional(S.Number),
  mappedSourceRecordsRemoved: S.optional(S.Number),
  mappedTargetRecordsRemoved: S.optional(S.Number),
}) {}
export class ErrorDetails extends S.Class<ErrorDetails>("ErrorDetails")({
  errorMessage: S.optional(S.String),
}) {}
export class JobMetrics extends S.Class<JobMetrics>("JobMetrics")({
  inputRecords: S.optional(S.Number),
  totalRecordsProcessed: S.optional(S.Number),
  recordsNotProcessed: S.optional(S.Number),
  deleteRecordsProcessed: S.optional(S.Number),
  matchIDs: S.optional(S.Number),
}) {}
export class JobOutputSource extends S.Class<JobOutputSource>(
  "JobOutputSource",
)({
  roleArn: S.String,
  outputS3Path: S.String,
  KMSArn: S.optional(S.String),
}) {}
export const JobOutputSourceConfig = S.Array(JobOutputSource);
export class ProviderIdNameSpaceConfiguration extends S.Class<ProviderIdNameSpaceConfiguration>(
  "ProviderIdNameSpaceConfiguration",
)({
  description: S.optional(S.String),
  providerTargetConfigurationDefinition: S.optional(S.Any),
  providerSourceConfigurationDefinition: S.optional(S.Any),
}) {}
export class ProviderIntermediateDataAccessConfiguration extends S.Class<ProviderIntermediateDataAccessConfiguration>(
  "ProviderIntermediateDataAccessConfiguration",
)({
  awsAccountIds: S.optional(AwsAccountIdList),
  requiredBucketActions: S.optional(RequiredBucketActionsList),
}) {}
export class IdMappingWorkflowSummary extends S.Class<IdMappingWorkflowSummary>(
  "IdMappingWorkflowSummary",
)({
  workflowName: S.String,
  workflowArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const IdMappingWorkflowList = S.Array(IdMappingWorkflowSummary);
export class MatchingWorkflowSummary extends S.Class<MatchingWorkflowSummary>(
  "MatchingWorkflowSummary",
)({
  workflowName: S.String,
  workflowArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  resolutionType: S.String,
}) {}
export const MatchingWorkflowList = S.Array(MatchingWorkflowSummary);
export class ProviderServiceSummary extends S.Class<ProviderServiceSummary>(
  "ProviderServiceSummary",
)({
  providerServiceArn: S.String,
  providerName: S.String,
  providerServiceDisplayName: S.String,
  providerServiceName: S.String,
  providerServiceType: S.String,
}) {}
export const ProviderServiceList = S.Array(ProviderServiceSummary);
export class SchemaMappingSummary extends S.Class<SchemaMappingSummary>(
  "SchemaMappingSummary",
)({
  schemaName: S.String,
  schemaArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  hasWorkflows: S.Boolean,
}) {}
export const SchemaMappingList = S.Array(SchemaMappingSummary);
export class BatchDeleteUniqueIdOutput extends S.Class<BatchDeleteUniqueIdOutput>(
  "BatchDeleteUniqueIdOutput",
)({
  status: S.String,
  errors: DeleteUniqueIdErrorsList,
  deleted: DeletedUniqueIdList,
  disconnectedUniqueIds: DisconnectedUniqueIdsList,
}) {}
export class CreateIdNamespaceInput extends S.Class<CreateIdNamespaceInput>(
  "CreateIdNamespaceInput",
)(
  {
    idNamespaceName: S.String,
    description: S.optional(S.String),
    inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
    idMappingWorkflowProperties: S.optional(
      IdNamespaceIdMappingWorkflowPropertiesList,
    ),
    type: S.String,
    roleArn: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/idnamespaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSchemaMappingOutput extends S.Class<CreateSchemaMappingOutput>(
  "CreateSchemaMappingOutput",
)({
  schemaName: S.String,
  schemaArn: S.String,
  description: S.String,
  mappedInputFields: SchemaInputAttributes,
}) {}
export class GenerateMatchIdInput extends S.Class<GenerateMatchIdInput>(
  "GenerateMatchIdInput",
)(
  {
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    records: RecordList,
    processingType: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/matchingworkflows/{workflowName}/generateMatches",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdMappingJobOutput extends S.Class<GetIdMappingJobOutput>(
  "GetIdMappingJobOutput",
)({
  jobId: S.String,
  status: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  metrics: S.optional(IdMappingJobMetrics),
  errorDetails: S.optional(ErrorDetails),
  outputSourceConfig: S.optional(IdMappingJobOutputSourceConfig),
  jobType: S.optional(S.String),
}) {}
export class GetMatchIdOutput extends S.Class<GetMatchIdOutput>(
  "GetMatchIdOutput",
)({ matchId: S.optional(S.String), matchRule: S.optional(S.String) }) {}
export class GetMatchingJobOutput extends S.Class<GetMatchingJobOutput>(
  "GetMatchingJobOutput",
)({
  jobId: S.String,
  status: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  metrics: S.optional(JobMetrics),
  errorDetails: S.optional(ErrorDetails),
  outputSourceConfig: S.optional(JobOutputSourceConfig),
}) {}
export class ListIdMappingJobsOutput extends S.Class<ListIdMappingJobsOutput>(
  "ListIdMappingJobsOutput",
)({ jobs: S.optional(JobList), nextToken: S.optional(S.String) }) {}
export class ListIdMappingWorkflowsOutput extends S.Class<ListIdMappingWorkflowsOutput>(
  "ListIdMappingWorkflowsOutput",
)({
  workflowSummaries: S.optional(IdMappingWorkflowList),
  nextToken: S.optional(S.String),
}) {}
export class ListMatchingWorkflowsOutput extends S.Class<ListMatchingWorkflowsOutput>(
  "ListMatchingWorkflowsOutput",
)({
  workflowSummaries: S.optional(MatchingWorkflowList),
  nextToken: S.optional(S.String),
}) {}
export class ListProviderServicesOutput extends S.Class<ListProviderServicesOutput>(
  "ListProviderServicesOutput",
)({
  providerServiceSummaries: S.optional(ProviderServiceList),
  nextToken: S.optional(S.String),
}) {}
export class ListSchemaMappingsOutput extends S.Class<ListSchemaMappingsOutput>(
  "ListSchemaMappingsOutput",
)({
  schemaList: S.optional(SchemaMappingList),
  nextToken: S.optional(S.String),
}) {}
export class StartIdMappingJobOutput extends S.Class<StartIdMappingJobOutput>(
  "StartIdMappingJobOutput",
)({
  jobId: S.String,
  outputSourceConfig: S.optional(IdMappingJobOutputSourceConfig),
  jobType: S.optional(S.String),
}) {}
export class ProviderMarketplaceConfiguration extends S.Class<ProviderMarketplaceConfiguration>(
  "ProviderMarketplaceConfiguration",
)({
  dataSetId: S.String,
  revisionId: S.String,
  assetId: S.String,
  listingId: S.String,
}) {}
export class ProviderSchemaAttribute extends S.Class<ProviderSchemaAttribute>(
  "ProviderSchemaAttribute",
)({
  fieldName: S.String,
  type: S.String,
  subType: S.optional(S.String),
  hashing: S.optional(S.Boolean),
}) {}
export const ProviderSchemaAttributes = S.Array(ProviderSchemaAttribute);
export class IdNamespaceIdMappingWorkflowMetadata extends S.Class<IdNamespaceIdMappingWorkflowMetadata>(
  "IdNamespaceIdMappingWorkflowMetadata",
)({ idMappingType: S.String }) {}
export const IdNamespaceIdMappingWorkflowMetadataList = S.Array(
  IdNamespaceIdMappingWorkflowMetadata,
);
export const ProviderEndpointConfiguration = S.Union(
  S.Struct({ marketplaceConfiguration: ProviderMarketplaceConfiguration }),
);
export class ProviderComponentSchema extends S.Class<ProviderComponentSchema>(
  "ProviderComponentSchema",
)({
  schemas: S.optional(Schemas),
  providerSchemaAttributes: S.optional(ProviderSchemaAttributes),
}) {}
export class IdNamespaceSummary extends S.Class<IdNamespaceSummary>(
  "IdNamespaceSummary",
)({
  idNamespaceName: S.String,
  idNamespaceArn: S.String,
  description: S.optional(S.String),
  idMappingWorkflowProperties: S.optional(
    IdNamespaceIdMappingWorkflowMetadataList,
  ),
  type: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const IdNamespaceList = S.Array(IdNamespaceSummary);
export class CreateIdMappingWorkflowInput extends S.Class<CreateIdMappingWorkflowInput>(
  "CreateIdMappingWorkflowInput",
)(
  {
    workflowName: S.String,
    description: S.optional(S.String),
    inputSourceConfig: IdMappingWorkflowInputSourceConfig,
    outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
    idMappingTechniques: IdMappingTechniques,
    incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
    roleArn: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/idmappingworkflows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIdNamespaceOutput extends S.Class<CreateIdNamespaceOutput>(
  "CreateIdNamespaceOutput",
)({
  idNamespaceName: S.String,
  idNamespaceArn: S.String,
  description: S.optional(S.String),
  inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
  idMappingWorkflowProperties: S.optional(
    IdNamespaceIdMappingWorkflowPropertiesList,
  ),
  type: S.String,
  roleArn: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export class CreateMatchingWorkflowInput extends S.Class<CreateMatchingWorkflowInput>(
  "CreateMatchingWorkflowInput",
)(
  {
    workflowName: S.String,
    description: S.optional(S.String),
    inputSourceConfig: InputSourceConfig,
    outputSourceConfig: OutputSourceConfig,
    resolutionTechniques: ResolutionTechniques,
    incrementalRunConfig: S.optional(IncrementalRunConfig),
    roleArn: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/matchingworkflows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProviderServiceOutput extends S.Class<GetProviderServiceOutput>(
  "GetProviderServiceOutput",
)({
  providerName: S.String,
  providerServiceName: S.String,
  providerServiceDisplayName: S.String,
  providerServiceType: S.String,
  providerServiceArn: S.String,
  providerConfigurationDefinition: S.optional(S.Any),
  providerIdNameSpaceConfiguration: S.optional(
    ProviderIdNameSpaceConfiguration,
  ),
  providerJobConfiguration: S.optional(S.Any),
  providerEndpointConfiguration: ProviderEndpointConfiguration,
  anonymizedOutput: S.Boolean,
  providerEntityOutputDefinition: S.Any,
  providerIntermediateDataAccessConfiguration: S.optional(
    ProviderIntermediateDataAccessConfiguration,
  ),
  providerComponentSchema: S.optional(ProviderComponentSchema),
}) {}
export class ListIdNamespacesOutput extends S.Class<ListIdNamespacesOutput>(
  "ListIdNamespacesOutput",
)({
  idNamespaceSummaries: S.optional(IdNamespaceList),
  nextToken: S.optional(S.String),
}) {}
export class FailedRecord extends S.Class<FailedRecord>("FailedRecord")({
  inputSourceARN: S.String,
  uniqueId: S.String,
  errorMessage: S.String,
}) {}
export const FailedRecordsList = S.Array(FailedRecord);
export class CreateIdMappingWorkflowOutput extends S.Class<CreateIdMappingWorkflowOutput>(
  "CreateIdMappingWorkflowOutput",
)({
  workflowName: S.String,
  workflowArn: S.String,
  description: S.optional(S.String),
  inputSourceConfig: IdMappingWorkflowInputSourceConfig,
  outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
  idMappingTechniques: IdMappingTechniques,
  incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
  roleArn: S.optional(S.String),
}) {}
export class CreateMatchingWorkflowOutput extends S.Class<CreateMatchingWorkflowOutput>(
  "CreateMatchingWorkflowOutput",
)({
  workflowName: S.String,
  workflowArn: S.String,
  description: S.optional(S.String),
  inputSourceConfig: InputSourceConfig,
  outputSourceConfig: OutputSourceConfig,
  resolutionTechniques: ResolutionTechniques,
  incrementalRunConfig: S.optional(IncrementalRunConfig),
  roleArn: S.String,
}) {}
export class MatchedRecord extends S.Class<MatchedRecord>("MatchedRecord")({
  inputSourceARN: S.String,
  recordId: S.String,
}) {}
export const MatchedRecordsList = S.Array(MatchedRecord);
export class MatchGroup extends S.Class<MatchGroup>("MatchGroup")({
  records: MatchedRecordsList,
  matchId: S.String,
  matchRule: S.String,
}) {}
export const MatchGroupsList = S.Array(MatchGroup);
export class GenerateMatchIdOutput extends S.Class<GenerateMatchIdOutput>(
  "GenerateMatchIdOutput",
)({ matchGroups: MatchGroupsList, failedRecords: FailedRecordsList }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ExceedsLimitException extends S.TaggedError<ExceedsLimitException>()(
  "ExceedsLimitException",
  {
    message: S.optional(S.String),
    quotaName: S.optional(S.String),
    quotaValue: S.optional(S.Number),
  },
) {}

//# Operations
/**
 * Removes one or more tags from the specified Entity Resolution resource. In Entity Resolution, `SchemaMapping`, and `MatchingWorkflow` can be tagged.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified Entity Resolution resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. In Entity Resolution, `SchemaMapping` and `MatchingWorkflow` can be tagged. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the `TagResource` action with a resource that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the `IdMappingWorkflow` with a given name. This operation will succeed even if a workflow with the given name does not exist.
 */
export const deleteIdMappingWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIdMappingWorkflowInput,
    output: DeleteIdMappingWorkflowOutput,
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
 * Deletes the `MatchingWorkflow` with a given name. This operation will succeed even if a workflow with the given name does not exist.
 */
export const deleteMatchingWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMatchingWorkflowInput,
    output: DeleteMatchingWorkflowOutput,
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
 * Deletes the policy statement.
 */
export const deletePolicyStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePolicyStatementInput,
    output: DeletePolicyStatementOutput,
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
 * Deletes the `SchemaMapping` with a given name. This operation will succeed even if a schema with the given name does not exist. This operation will fail if there is a `MatchingWorkflow` object that references the `SchemaMapping` in the workflow's `InputSourceConfig`.
 */
export const deleteSchemaMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSchemaMappingInput,
  output: DeleteSchemaMappingOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the resource-based policy.
 */
export const putPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPolicyInput,
  output: PutPolicyOutput,
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
 * Updates a schema mapping.
 *
 * A schema is immutable if it is being used by a workflow. Therefore, you can't update a schema mapping if it's associated with a workflow.
 */
export const updateSchemaMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSchemaMappingInput,
  output: UpdateSchemaMappingOutput,
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
 * Returns a list of all the `MatchingWorkflows` that have been created for an Amazon Web Services account.
 */
export const listMatchingWorkflows =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMatchingWorkflowsInput,
    output: ListMatchingWorkflowsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workflowSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of all the `ProviderServices` that are available in this Amazon Web Services Region.
 */
export const listProviderServices =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProviderServicesInput,
    output: ListProviderServicesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "providerServiceSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of all the `SchemaMappings` that have been created for an Amazon Web Services account.
 */
export const listSchemaMappings = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSchemaMappingsInput,
    output: ListSchemaMappingsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "schemaList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Deletes the `IdNamespace` with a given name.
 */
export const deleteIdNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdNamespaceInput,
  output: DeleteIdNamespaceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the `IdMappingWorkflow` with a given name, if it exists.
 */
export const getIdMappingWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIdMappingWorkflowInput,
    output: GetIdMappingWorkflowOutput,
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
 * Returns the `IdNamespace` with a given name, if it exists.
 */
export const getIdNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdNamespaceInput,
  output: GetIdNamespaceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the `MatchingWorkflow` with a given name, if it exists.
 */
export const getMatchingWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMatchingWorkflowInput,
  output: GetMatchingWorkflowOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the resource-based policy.
 */
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyInput,
  output: GetPolicyOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the SchemaMapping of a given name.
 */
export const getSchemaMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaMappingInput,
  output: GetSchemaMappingOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all jobs for a given workflow.
 */
export const listMatchingJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMatchingJobsInput,
    output: ListMatchingJobsOutput,
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
      items: "jobs",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates an existing `IdMappingWorkflow`. This method is identical to CreateIdMappingWorkflow, except it uses an HTTP `PUT` request instead of a `POST` request, and the `IdMappingWorkflow` must already exist for the method to succeed.
 *
 * Incremental processing is not supported for ID mapping workflows.
 */
export const updateIdMappingWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateIdMappingWorkflowInput,
    output: UpdateIdMappingWorkflowOutput,
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
 * Updates an existing ID namespace.
 */
export const updateIdNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIdNamespaceInput,
  output: UpdateIdNamespaceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing matching workflow. The workflow must already exist for this operation to succeed.
 *
 * For workflows where `resolutionType` is `ML_MATCHING` or `PROVIDER`, incremental processing is not supported.
 */
export const updateMatchingWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMatchingWorkflowInput,
    output: UpdateMatchingWorkflowOutput,
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
 * Returns the status, metrics, and errors (if there are any) that are associated with a job.
 */
export const getIdMappingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdMappingJobInput,
  output: GetIdMappingJobOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the corresponding Match ID of a customer record if the record has been processed in a rule-based matching workflow.
 *
 * You can call this API as a dry run of an incremental load on the rule-based matching workflow.
 */
export const getMatchId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMatchIdInput,
  output: GetMatchIdOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the status, metrics, and errors (if there are any) that are associated with a job.
 */
export const getMatchingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMatchingJobInput,
  output: GetMatchingJobOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all ID mapping jobs for a given workflow.
 */
export const listIdMappingJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListIdMappingJobsInput,
    output: ListIdMappingJobsOutput,
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
      items: "jobs",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Adds a policy statement object. To retrieve a list of existing policy statements, use the `GetPolicy` API.
 */
export const addPolicyStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddPolicyStatementInput,
  output: AddPolicyStatementOutput,
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
 * Returns the `ProviderService` of a given name.
 */
export const getProviderService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProviderServiceInput,
  output: GetProviderServiceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Displays the tags associated with an Entity Resolution resource. In Entity Resolution, `SchemaMapping`, and `MatchingWorkflow` can be tagged.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes multiple unique IDs in a matching workflow.
 */
export const batchDeleteUniqueId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteUniqueIdInput,
  output: BatchDeleteUniqueIdOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all the `IdMappingWorkflows` that have been created for an Amazon Web Services account.
 */
export const listIdMappingWorkflows =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIdMappingWorkflowsInput,
    output: ListIdMappingWorkflowsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workflowSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of all ID namespaces.
 */
export const listIdNamespaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListIdNamespacesInput,
    output: ListIdNamespacesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "idNamespaceSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates an ID namespace object which will help customers provide metadata explaining their dataset and how to use it. Each ID namespace must have a unique name. To modify an existing ID namespace, use the UpdateIdNamespace API.
 */
export const createIdNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIdNamespaceInput,
  output: CreateIdNamespaceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a matching workflow that defines the configuration for a data processing job. The workflow name must be unique. To modify an existing workflow, use `UpdateMatchingWorkflow`.
 *
 * For workflows where `resolutionType` is `ML_MATCHING` or `PROVIDER`, incremental processing is not supported.
 */
export const createMatchingWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMatchingWorkflowInput,
    output: CreateMatchingWorkflowOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      ExceedsLimitException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a schema mapping, which defines the schema of the input customer records table. The `SchemaMapping` also provides Entity Resolution with some metadata about the table, such as the attribute types of the columns and which columns to match on.
 */
export const createSchemaMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSchemaMappingInput,
  output: CreateSchemaMappingOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts the `IdMappingJob` of a workflow. The workflow must have previously been created using the `CreateIdMappingWorkflow` endpoint.
 */
export const startIdMappingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartIdMappingJobInput,
  output: StartIdMappingJobOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts the `MatchingJob` of a workflow. The workflow must have previously been created using the `CreateMatchingWorkflow` endpoint.
 */
export const startMatchingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMatchingJobInput,
  output: StartMatchingJobOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an `IdMappingWorkflow` object which stores the configuration of the data processing job to be run. Each `IdMappingWorkflow` must have a unique workflow name. To modify an existing workflow, use the UpdateIdMappingWorkflow API.
 *
 * Incremental processing is not supported for ID mapping workflows.
 */
export const createIdMappingWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIdMappingWorkflowInput,
    output: CreateIdMappingWorkflowOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      ExceedsLimitException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Generates or retrieves Match IDs for records using a rule-based matching workflow. When you call this operation, it processes your records against the workflow's matching rules to identify potential matches. For existing records, it retrieves their Match IDs and associated rules. For records without matches, it generates new Match IDs. The operation saves results to Amazon S3.
 *
 * The processing type (`processingType`) you choose affects both the accuracy and response time of the operation. Additional charges apply for each API call, whether made through the Entity Resolution console or directly via the API. The rule-based matching workflow must exist and be active before calling this operation.
 */
export const generateMatchId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateMatchIdInput,
  output: GenerateMatchIdOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

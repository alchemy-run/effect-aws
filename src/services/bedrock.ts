import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Bedrock",
  serviceShapeName: "AmazonBedrockControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "bedrock" });
const ver = T.ServiceVersion("2023-04-20");
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
                                url: "https://bedrock-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://bedrock-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://bedrock.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://bedrock.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetUseCaseForModelAccessRequest extends S.Class<GetUseCaseForModelAccessRequest>(
  "GetUseCaseForModelAccessRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/use-case-for-model-access" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteModelInvocationLoggingConfigurationRequest extends S.Class<DeleteModelInvocationLoggingConfigurationRequest>(
  "DeleteModelInvocationLoggingConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/logging/modelinvocations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteModelInvocationLoggingConfigurationResponse extends S.Class<DeleteModelInvocationLoggingConfigurationResponse>(
  "DeleteModelInvocationLoggingConfigurationResponse",
)({}) {}
export class GetModelInvocationLoggingConfigurationRequest extends S.Class<GetModelInvocationLoggingConfigurationRequest>(
  "GetModelInvocationLoggingConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/logging/modelinvocations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AutomatedReasoningPolicyTestCaseIdList = S.Array(S.String);
export const EvaluationJobIdentifiers = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class GetUseCaseForModelAccessResponse extends S.Class<GetUseCaseForModelAccessResponse>(
  "GetUseCaseForModelAccessResponse",
)({ formData: T.Blob }) {}
export class PutUseCaseForModelAccessRequest extends S.Class<PutUseCaseForModelAccessRequest>(
  "PutUseCaseForModelAccessRequest",
)(
  { formData: T.Blob },
  T.all(
    T.Http({ method: "POST", uri: "/use-case-for-model-access" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutUseCaseForModelAccessResponse extends S.Class<PutUseCaseForModelAccessResponse>(
  "PutUseCaseForModelAccessResponse",
)({}) {}
export class GetAutomatedReasoningPolicyRequest extends S.Class<GetAutomatedReasoningPolicyRequest>(
  "GetAutomatedReasoningPolicyRequest",
)(
  { policyArn: S.String.pipe(T.HttpLabel("policyArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/automated-reasoning-policies/{policyArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AutomatedReasoningPolicyDefinitionTypeValue extends S.Class<AutomatedReasoningPolicyDefinitionTypeValue>(
  "AutomatedReasoningPolicyDefinitionTypeValue",
)({ value: S.String, description: S.optional(S.String) }) {}
export const AutomatedReasoningPolicyDefinitionTypeValueList = S.Array(
  AutomatedReasoningPolicyDefinitionTypeValue,
);
export class AutomatedReasoningPolicyDefinitionType extends S.Class<AutomatedReasoningPolicyDefinitionType>(
  "AutomatedReasoningPolicyDefinitionType",
)({
  name: S.String,
  description: S.optional(S.String),
  values: AutomatedReasoningPolicyDefinitionTypeValueList,
}) {}
export const AutomatedReasoningPolicyDefinitionTypeList = S.Array(
  AutomatedReasoningPolicyDefinitionType,
);
export class AutomatedReasoningPolicyDefinitionRule extends S.Class<AutomatedReasoningPolicyDefinitionRule>(
  "AutomatedReasoningPolicyDefinitionRule",
)({
  id: S.String,
  expression: S.String,
  alternateExpression: S.optional(S.String),
}) {}
export const AutomatedReasoningPolicyDefinitionRuleList = S.Array(
  AutomatedReasoningPolicyDefinitionRule,
);
export class AutomatedReasoningPolicyDefinitionVariable extends S.Class<AutomatedReasoningPolicyDefinitionVariable>(
  "AutomatedReasoningPolicyDefinitionVariable",
)({ name: S.String, type: S.String, description: S.String }) {}
export const AutomatedReasoningPolicyDefinitionVariableList = S.Array(
  AutomatedReasoningPolicyDefinitionVariable,
);
export class AutomatedReasoningPolicyDefinition extends S.Class<AutomatedReasoningPolicyDefinition>(
  "AutomatedReasoningPolicyDefinition",
)({
  version: S.optional(S.String),
  types: S.optional(AutomatedReasoningPolicyDefinitionTypeList),
  rules: S.optional(AutomatedReasoningPolicyDefinitionRuleList),
  variables: S.optional(AutomatedReasoningPolicyDefinitionVariableList),
}) {}
export class UpdateAutomatedReasoningPolicyRequest extends S.Class<UpdateAutomatedReasoningPolicyRequest>(
  "UpdateAutomatedReasoningPolicyRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    policyDefinition: AutomatedReasoningPolicyDefinition,
    name: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/automated-reasoning-policies/{policyArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAutomatedReasoningPolicyRequest extends S.Class<DeleteAutomatedReasoningPolicyRequest>(
  "DeleteAutomatedReasoningPolicyRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/automated-reasoning-policies/{policyArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAutomatedReasoningPolicyResponse extends S.Class<DeleteAutomatedReasoningPolicyResponse>(
  "DeleteAutomatedReasoningPolicyResponse",
)({}) {}
export class ListAutomatedReasoningPoliciesRequest extends S.Class<ListAutomatedReasoningPoliciesRequest>(
  "ListAutomatedReasoningPoliciesRequest",
)(
  {
    policyArn: S.optional(S.String).pipe(T.HttpQuery("policyArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/automated-reasoning-policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelAutomatedReasoningPolicyBuildWorkflowRequest extends S.Class<CancelAutomatedReasoningPolicyBuildWorkflowRequest>(
  "CancelAutomatedReasoningPolicyBuildWorkflowRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelAutomatedReasoningPolicyBuildWorkflowResponse extends S.Class<CancelAutomatedReasoningPolicyBuildWorkflowResponse>(
  "CancelAutomatedReasoningPolicyBuildWorkflowResponse",
)({}) {}
export class CreateAutomatedReasoningPolicyTestCaseRequest extends S.Class<CreateAutomatedReasoningPolicyTestCaseRequest>(
  "CreateAutomatedReasoningPolicyTestCaseRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    guardContent: S.String,
    queryContent: S.optional(S.String),
    expectedAggregatedFindingsResult: S.String,
    clientRequestToken: S.optional(S.String),
    confidenceThreshold: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/automated-reasoning-policies/{policyArn}/test-cases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateAutomatedReasoningPolicyVersionRequest extends S.Class<CreateAutomatedReasoningPolicyVersionRequest>(
  "CreateAutomatedReasoningPolicyVersionRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    clientRequestToken: S.optional(S.String),
    lastUpdatedDefinitionHash: S.String,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/automated-reasoning-policies/{policyArn}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAutomatedReasoningPolicyBuildWorkflowRequest extends S.Class<DeleteAutomatedReasoningPolicyBuildWorkflowRequest>(
  "DeleteAutomatedReasoningPolicyBuildWorkflowRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.HttpQuery("updatedAt"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAutomatedReasoningPolicyBuildWorkflowResponse extends S.Class<DeleteAutomatedReasoningPolicyBuildWorkflowResponse>(
  "DeleteAutomatedReasoningPolicyBuildWorkflowResponse",
)({}) {}
export class DeleteAutomatedReasoningPolicyTestCaseRequest extends S.Class<DeleteAutomatedReasoningPolicyTestCaseRequest>(
  "DeleteAutomatedReasoningPolicyTestCaseRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    testCaseId: S.String.pipe(T.HttpLabel("testCaseId")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.HttpQuery("updatedAt"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/automated-reasoning-policies/{policyArn}/test-cases/{testCaseId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAutomatedReasoningPolicyTestCaseResponse extends S.Class<DeleteAutomatedReasoningPolicyTestCaseResponse>(
  "DeleteAutomatedReasoningPolicyTestCaseResponse",
)({}) {}
export class ExportAutomatedReasoningPolicyVersionRequest extends S.Class<ExportAutomatedReasoningPolicyVersionRequest>(
  "ExportAutomatedReasoningPolicyVersionRequest",
)(
  { policyArn: S.String.pipe(T.HttpLabel("policyArn")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/export",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutomatedReasoningPolicyAnnotationsRequest extends S.Class<GetAutomatedReasoningPolicyAnnotationsRequest>(
  "GetAutomatedReasoningPolicyAnnotationsRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/annotations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutomatedReasoningPolicyBuildWorkflowRequest extends S.Class<GetAutomatedReasoningPolicyBuildWorkflowRequest>(
  "GetAutomatedReasoningPolicyBuildWorkflowRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest extends S.Class<GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest>(
  "GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    assetType: S.String.pipe(T.HttpQuery("assetType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/result-assets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutomatedReasoningPolicyNextScenarioRequest extends S.Class<GetAutomatedReasoningPolicyNextScenarioRequest>(
  "GetAutomatedReasoningPolicyNextScenarioRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/scenarios",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutomatedReasoningPolicyTestCaseRequest extends S.Class<GetAutomatedReasoningPolicyTestCaseRequest>(
  "GetAutomatedReasoningPolicyTestCaseRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    testCaseId: S.String.pipe(T.HttpLabel("testCaseId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/test-cases/{testCaseId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutomatedReasoningPolicyTestResultRequest extends S.Class<GetAutomatedReasoningPolicyTestResultRequest>(
  "GetAutomatedReasoningPolicyTestResultRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    testCaseId: S.String.pipe(T.HttpLabel("testCaseId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/test-cases/{testCaseId}/test-results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAutomatedReasoningPolicyBuildWorkflowsRequest extends S.Class<ListAutomatedReasoningPolicyBuildWorkflowsRequest>(
  "ListAutomatedReasoningPolicyBuildWorkflowsRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAutomatedReasoningPolicyTestCasesRequest extends S.Class<ListAutomatedReasoningPolicyTestCasesRequest>(
  "ListAutomatedReasoningPolicyTestCasesRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/test-cases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAutomatedReasoningPolicyTestResultsRequest extends S.Class<ListAutomatedReasoningPolicyTestResultsRequest>(
  "ListAutomatedReasoningPolicyTestResultsRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/test-results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartAutomatedReasoningPolicyTestWorkflowRequest extends S.Class<StartAutomatedReasoningPolicyTestWorkflowRequest>(
  "StartAutomatedReasoningPolicyTestWorkflowRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    testCaseIds: S.optional(AutomatedReasoningPolicyTestCaseIdList),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/test-workflows",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAutomatedReasoningPolicyTestCaseRequest extends S.Class<UpdateAutomatedReasoningPolicyTestCaseRequest>(
  "UpdateAutomatedReasoningPolicyTestCaseRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    testCaseId: S.String.pipe(T.HttpLabel("testCaseId")),
    guardContent: S.String,
    queryContent: S.optional(S.String),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    expectedAggregatedFindingsResult: S.String,
    confidenceThreshold: S.optional(S.Number),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/automated-reasoning-policies/{policyArn}/test-cases/{testCaseId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMarketplaceModelEndpointRequest extends S.Class<DeleteMarketplaceModelEndpointRequest>(
  "DeleteMarketplaceModelEndpointRequest",
)(
  { endpointArn: S.String.pipe(T.HttpLabel("endpointArn")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/marketplace-model/endpoints/{endpointArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMarketplaceModelEndpointResponse extends S.Class<DeleteMarketplaceModelEndpointResponse>(
  "DeleteMarketplaceModelEndpointResponse",
)({}) {}
export class DeregisterMarketplaceModelEndpointRequest extends S.Class<DeregisterMarketplaceModelEndpointRequest>(
  "DeregisterMarketplaceModelEndpointRequest",
)(
  { endpointArn: S.String.pipe(T.HttpLabel("endpointArn")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/marketplace-model/endpoints/{endpointArn}/registration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterMarketplaceModelEndpointResponse extends S.Class<DeregisterMarketplaceModelEndpointResponse>(
  "DeregisterMarketplaceModelEndpointResponse",
)({}) {}
export class GetMarketplaceModelEndpointRequest extends S.Class<GetMarketplaceModelEndpointRequest>(
  "GetMarketplaceModelEndpointRequest",
)(
  { endpointArn: S.String.pipe(T.HttpLabel("endpointArn")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/marketplace-model/endpoints/{endpointArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMarketplaceModelEndpointsRequest extends S.Class<ListMarketplaceModelEndpointsRequest>(
  "ListMarketplaceModelEndpointsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    modelSourceEquals: S.optional(S.String).pipe(
      T.HttpQuery("modelSourceIdentifier"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/marketplace-model/endpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterMarketplaceModelEndpointRequest extends S.Class<RegisterMarketplaceModelEndpointRequest>(
  "RegisterMarketplaceModelEndpointRequest",
)(
  {
    endpointIdentifier: S.String.pipe(T.HttpLabel("endpointIdentifier")),
    modelSourceIdentifier: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/marketplace-model/endpoints/{endpointIdentifier}/registration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class VpcConfig extends S.Class<VpcConfig>("VpcConfig")({
  subnetIds: SubnetIds,
  securityGroupIds: SecurityGroupIds,
}) {}
export class SageMakerEndpoint extends S.Class<SageMakerEndpoint>(
  "SageMakerEndpoint",
)({
  initialInstanceCount: S.Number,
  instanceType: S.String,
  executionRole: S.String,
  kmsEncryptionKey: S.optional(S.String),
  vpc: S.optional(VpcConfig),
}) {}
export const EndpointConfig = S.Union(
  S.Struct({ sageMaker: SageMakerEndpoint }),
);
export class UpdateMarketplaceModelEndpointRequest extends S.Class<UpdateMarketplaceModelEndpointRequest>(
  "UpdateMarketplaceModelEndpointRequest",
)(
  {
    endpointArn: S.String.pipe(T.HttpLabel("endpointArn")),
    endpointConfig: EndpointConfig,
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/marketplace-model/endpoints/{endpointArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCustomModelDeploymentRequest extends S.Class<CreateCustomModelDeploymentRequest>(
  "CreateCustomModelDeploymentRequest",
)(
  {
    modelDeploymentName: S.String,
    modelArn: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/model-customization/custom-model-deployments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomModelDeploymentRequest extends S.Class<DeleteCustomModelDeploymentRequest>(
  "DeleteCustomModelDeploymentRequest",
)(
  {
    customModelDeploymentIdentifier: S.String.pipe(
      T.HttpLabel("customModelDeploymentIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/model-customization/custom-model-deployments/{customModelDeploymentIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomModelDeploymentResponse extends S.Class<DeleteCustomModelDeploymentResponse>(
  "DeleteCustomModelDeploymentResponse",
)({}) {}
export class GetCustomModelDeploymentRequest extends S.Class<GetCustomModelDeploymentRequest>(
  "GetCustomModelDeploymentRequest",
)(
  {
    customModelDeploymentIdentifier: S.String.pipe(
      T.HttpLabel("customModelDeploymentIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/model-customization/custom-model-deployments/{customModelDeploymentIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomModelDeploymentsRequest extends S.Class<ListCustomModelDeploymentsRequest>(
  "ListCustomModelDeploymentsRequest",
)(
  {
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    modelArnEquals: S.optional(S.String).pipe(T.HttpQuery("modelArnEquals")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/model-customization/custom-model-deployments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCustomModelDeploymentRequest extends S.Class<UpdateCustomModelDeploymentRequest>(
  "UpdateCustomModelDeploymentRequest",
)(
  {
    modelArn: S.String,
    customModelDeploymentIdentifier: S.String.pipe(
      T.HttpLabel("customModelDeploymentIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/model-customization/custom-model-deployments/{customModelDeploymentIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomModelRequest extends S.Class<DeleteCustomModelRequest>(
  "DeleteCustomModelRequest",
)(
  { modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/custom-models/{modelIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomModelResponse extends S.Class<DeleteCustomModelResponse>(
  "DeleteCustomModelResponse",
)({}) {}
export class GetCustomModelRequest extends S.Class<GetCustomModelRequest>(
  "GetCustomModelRequest",
)(
  { modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/custom-models/{modelIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomModelsRequest extends S.Class<ListCustomModelsRequest>(
  "ListCustomModelsRequest",
)(
  {
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    baseModelArnEquals: S.optional(S.String).pipe(
      T.HttpQuery("baseModelArnEquals"),
    ),
    foundationModelArnEquals: S.optional(S.String).pipe(
      T.HttpQuery("foundationModelArnEquals"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    isOwned: S.optional(S.Boolean).pipe(T.HttpQuery("isOwned")),
    modelStatus: S.optional(S.String).pipe(T.HttpQuery("modelStatus")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/custom-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnforcedGuardrailConfigurationRequest extends S.Class<DeleteEnforcedGuardrailConfigurationRequest>(
  "DeleteEnforcedGuardrailConfigurationRequest",
)(
  { configId: S.String.pipe(T.HttpLabel("configId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/enforcedGuardrailsConfiguration/{configId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnforcedGuardrailConfigurationResponse extends S.Class<DeleteEnforcedGuardrailConfigurationResponse>(
  "DeleteEnforcedGuardrailConfigurationResponse",
)({}) {}
export class ListEnforcedGuardrailsConfigurationRequest extends S.Class<ListEnforcedGuardrailsConfigurationRequest>(
  "ListEnforcedGuardrailsConfigurationRequest",
)(
  { nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")) },
  T.all(
    T.Http({ method: "GET", uri: "/enforcedGuardrailsConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteEvaluationJobRequest extends S.Class<BatchDeleteEvaluationJobRequest>(
  "BatchDeleteEvaluationJobRequest",
)(
  { jobIdentifiers: EvaluationJobIdentifiers },
  T.all(
    T.Http({ method: "POST", uri: "/evaluation-jobs/batch-delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEvaluationJobRequest extends S.Class<GetEvaluationJobRequest>(
  "GetEvaluationJobRequest",
)(
  { jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/evaluation-jobs/{jobIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEvaluationJobsRequest extends S.Class<ListEvaluationJobsRequest>(
  "ListEvaluationJobsRequest",
)(
  {
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    applicationTypeEquals: S.optional(S.String).pipe(
      T.HttpQuery("applicationTypeEquals"),
    ),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/evaluation-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopEvaluationJobRequest extends S.Class<StopEvaluationJobRequest>(
  "StopEvaluationJobRequest",
)(
  { jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) },
  T.all(
    T.Http({ method: "POST", uri: "/evaluation-job/{jobIdentifier}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopEvaluationJobResponse extends S.Class<StopEvaluationJobResponse>(
  "StopEvaluationJobResponse",
)({}) {}
export class GetGuardrailRequest extends S.Class<GetGuardrailRequest>(
  "GetGuardrailRequest",
)(
  {
    guardrailIdentifier: S.String.pipe(T.HttpLabel("guardrailIdentifier")),
    guardrailVersion: S.optional(S.String).pipe(
      T.HttpQuery("guardrailVersion"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/guardrails/{guardrailIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const GuardrailTopicExamples = S.Array(S.String);
export class GuardrailTopicConfig extends S.Class<GuardrailTopicConfig>(
  "GuardrailTopicConfig",
)({
  name: S.String,
  definition: S.String,
  examples: S.optional(GuardrailTopicExamples),
  type: S.String,
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailTopicsConfig = S.Array(GuardrailTopicConfig);
export class GuardrailTopicsTierConfig extends S.Class<GuardrailTopicsTierConfig>(
  "GuardrailTopicsTierConfig",
)({ tierName: S.String }) {}
export class GuardrailTopicPolicyConfig extends S.Class<GuardrailTopicPolicyConfig>(
  "GuardrailTopicPolicyConfig",
)({
  topicsConfig: GuardrailTopicsConfig,
  tierConfig: S.optional(GuardrailTopicsTierConfig),
}) {}
export const GuardrailModalities = S.Array(S.String);
export class GuardrailContentFilterConfig extends S.Class<GuardrailContentFilterConfig>(
  "GuardrailContentFilterConfig",
)({
  type: S.String,
  inputStrength: S.String,
  outputStrength: S.String,
  inputModalities: S.optional(GuardrailModalities),
  outputModalities: S.optional(GuardrailModalities),
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailContentFiltersConfig = S.Array(
  GuardrailContentFilterConfig,
);
export class GuardrailContentFiltersTierConfig extends S.Class<GuardrailContentFiltersTierConfig>(
  "GuardrailContentFiltersTierConfig",
)({ tierName: S.String }) {}
export class GuardrailContentPolicyConfig extends S.Class<GuardrailContentPolicyConfig>(
  "GuardrailContentPolicyConfig",
)({
  filtersConfig: GuardrailContentFiltersConfig,
  tierConfig: S.optional(GuardrailContentFiltersTierConfig),
}) {}
export class GuardrailWordConfig extends S.Class<GuardrailWordConfig>(
  "GuardrailWordConfig",
)({
  text: S.String,
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailWordsConfig = S.Array(GuardrailWordConfig);
export class GuardrailManagedWordsConfig extends S.Class<GuardrailManagedWordsConfig>(
  "GuardrailManagedWordsConfig",
)({
  type: S.String,
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailManagedWordListsConfig = S.Array(
  GuardrailManagedWordsConfig,
);
export class GuardrailWordPolicyConfig extends S.Class<GuardrailWordPolicyConfig>(
  "GuardrailWordPolicyConfig",
)({
  wordsConfig: S.optional(GuardrailWordsConfig),
  managedWordListsConfig: S.optional(GuardrailManagedWordListsConfig),
}) {}
export class GuardrailPiiEntityConfig extends S.Class<GuardrailPiiEntityConfig>(
  "GuardrailPiiEntityConfig",
)({
  type: S.String,
  action: S.String,
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailPiiEntitiesConfig = S.Array(GuardrailPiiEntityConfig);
export class GuardrailRegexConfig extends S.Class<GuardrailRegexConfig>(
  "GuardrailRegexConfig",
)({
  name: S.String,
  description: S.optional(S.String),
  pattern: S.String,
  action: S.String,
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailRegexesConfig = S.Array(GuardrailRegexConfig);
export class GuardrailSensitiveInformationPolicyConfig extends S.Class<GuardrailSensitiveInformationPolicyConfig>(
  "GuardrailSensitiveInformationPolicyConfig",
)({
  piiEntitiesConfig: S.optional(GuardrailPiiEntitiesConfig),
  regexesConfig: S.optional(GuardrailRegexesConfig),
}) {}
export class GuardrailContextualGroundingFilterConfig extends S.Class<GuardrailContextualGroundingFilterConfig>(
  "GuardrailContextualGroundingFilterConfig",
)({
  type: S.String,
  threshold: S.Number,
  action: S.optional(S.String),
  enabled: S.optional(S.Boolean),
}) {}
export const GuardrailContextualGroundingFiltersConfig = S.Array(
  GuardrailContextualGroundingFilterConfig,
);
export class GuardrailContextualGroundingPolicyConfig extends S.Class<GuardrailContextualGroundingPolicyConfig>(
  "GuardrailContextualGroundingPolicyConfig",
)({ filtersConfig: GuardrailContextualGroundingFiltersConfig }) {}
export const AutomatedReasoningPolicyArnList = S.Array(S.String);
export class GuardrailAutomatedReasoningPolicyConfig extends S.Class<GuardrailAutomatedReasoningPolicyConfig>(
  "GuardrailAutomatedReasoningPolicyConfig",
)({
  policies: AutomatedReasoningPolicyArnList,
  confidenceThreshold: S.optional(S.Number),
}) {}
export class GuardrailCrossRegionConfig extends S.Class<GuardrailCrossRegionConfig>(
  "GuardrailCrossRegionConfig",
)({ guardrailProfileIdentifier: S.String }) {}
export class UpdateGuardrailRequest extends S.Class<UpdateGuardrailRequest>(
  "UpdateGuardrailRequest",
)(
  {
    guardrailIdentifier: S.String.pipe(T.HttpLabel("guardrailIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    topicPolicyConfig: S.optional(GuardrailTopicPolicyConfig),
    contentPolicyConfig: S.optional(GuardrailContentPolicyConfig),
    wordPolicyConfig: S.optional(GuardrailWordPolicyConfig),
    sensitiveInformationPolicyConfig: S.optional(
      GuardrailSensitiveInformationPolicyConfig,
    ),
    contextualGroundingPolicyConfig: S.optional(
      GuardrailContextualGroundingPolicyConfig,
    ),
    automatedReasoningPolicyConfig: S.optional(
      GuardrailAutomatedReasoningPolicyConfig,
    ),
    crossRegionConfig: S.optional(GuardrailCrossRegionConfig),
    blockedInputMessaging: S.String,
    blockedOutputsMessaging: S.String,
    kmsKeyId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/guardrails/{guardrailIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGuardrailRequest extends S.Class<DeleteGuardrailRequest>(
  "DeleteGuardrailRequest",
)(
  {
    guardrailIdentifier: S.String.pipe(T.HttpLabel("guardrailIdentifier")),
    guardrailVersion: S.optional(S.String).pipe(
      T.HttpQuery("guardrailVersion"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/guardrails/{guardrailIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGuardrailResponse extends S.Class<DeleteGuardrailResponse>(
  "DeleteGuardrailResponse",
)({}) {}
export class ListGuardrailsRequest extends S.Class<ListGuardrailsRequest>(
  "ListGuardrailsRequest",
)(
  {
    guardrailIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("guardrailIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/guardrails" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGuardrailVersionRequest extends S.Class<CreateGuardrailVersionRequest>(
  "CreateGuardrailVersionRequest",
)(
  {
    guardrailIdentifier: S.String.pipe(T.HttpLabel("guardrailIdentifier")),
    description: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/guardrails/{guardrailIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInferenceProfileRequest extends S.Class<GetInferenceProfileRequest>(
  "GetInferenceProfileRequest",
)(
  {
    inferenceProfileIdentifier: S.String.pipe(
      T.HttpLabel("inferenceProfileIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/inference-profiles/{inferenceProfileIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInferenceProfileRequest extends S.Class<DeleteInferenceProfileRequest>(
  "DeleteInferenceProfileRequest",
)(
  {
    inferenceProfileIdentifier: S.String.pipe(
      T.HttpLabel("inferenceProfileIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/inference-profiles/{inferenceProfileIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInferenceProfileResponse extends S.Class<DeleteInferenceProfileResponse>(
  "DeleteInferenceProfileResponse",
)({}) {}
export class ListInferenceProfilesRequest extends S.Class<ListInferenceProfilesRequest>(
  "ListInferenceProfilesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    typeEquals: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/inference-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Config extends S.Class<S3Config>("S3Config")({
  bucketName: S.String,
  keyPrefix: S.optional(S.String),
}) {}
export class CloudWatchConfig extends S.Class<CloudWatchConfig>(
  "CloudWatchConfig",
)({
  logGroupName: S.String,
  roleArn: S.String,
  largeDataDeliveryS3Config: S.optional(S3Config),
}) {}
export class LoggingConfig extends S.Class<LoggingConfig>("LoggingConfig")({
  cloudWatchConfig: S.optional(CloudWatchConfig),
  s3Config: S.optional(S3Config),
  textDataDeliveryEnabled: S.optional(S.Boolean),
  imageDataDeliveryEnabled: S.optional(S.Boolean),
  embeddingDataDeliveryEnabled: S.optional(S.Boolean),
  videoDataDeliveryEnabled: S.optional(S.Boolean),
  audioDataDeliveryEnabled: S.optional(S.Boolean),
}) {}
export class PutModelInvocationLoggingConfigurationRequest extends S.Class<PutModelInvocationLoggingConfigurationRequest>(
  "PutModelInvocationLoggingConfigurationRequest",
)(
  { loggingConfig: LoggingConfig },
  T.all(
    T.Http({ method: "PUT", uri: "/logging/modelinvocations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutModelInvocationLoggingConfigurationResponse extends S.Class<PutModelInvocationLoggingConfigurationResponse>(
  "PutModelInvocationLoggingConfigurationResponse",
)({}) {}
export class CreateModelCopyJobRequest extends S.Class<CreateModelCopyJobRequest>(
  "CreateModelCopyJobRequest",
)(
  {
    sourceModelArn: S.String,
    targetModelName: S.String,
    modelKmsKeyId: S.optional(S.String),
    targetModelTags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/model-copy-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetModelCopyJobRequest extends S.Class<GetModelCopyJobRequest>(
  "GetModelCopyJobRequest",
)(
  { jobArn: S.String.pipe(T.HttpLabel("jobArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/model-copy-jobs/{jobArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListModelCopyJobsRequest extends S.Class<ListModelCopyJobsRequest>(
  "ListModelCopyJobsRequest",
)(
  {
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    sourceAccountEquals: S.optional(S.String).pipe(
      T.HttpQuery("sourceAccountEquals"),
    ),
    sourceModelArnEquals: S.optional(S.String).pipe(
      T.HttpQuery("sourceModelArnEquals"),
    ),
    targetModelNameContains: S.optional(S.String).pipe(
      T.HttpQuery("outputModelNameContains"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/model-copy-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteImportedModelRequest extends S.Class<DeleteImportedModelRequest>(
  "DeleteImportedModelRequest",
)(
  { modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/imported-models/{modelIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteImportedModelResponse extends S.Class<DeleteImportedModelResponse>(
  "DeleteImportedModelResponse",
)({}) {}
export class GetImportedModelRequest extends S.Class<GetImportedModelRequest>(
  "GetImportedModelRequest",
)(
  { modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/imported-models/{modelIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetModelImportJobRequest extends S.Class<GetModelImportJobRequest>(
  "GetModelImportJobRequest",
)(
  { jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/model-import-jobs/{jobIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImportedModelsRequest extends S.Class<ListImportedModelsRequest>(
  "ListImportedModelsRequest",
)(
  {
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/imported-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListModelImportJobsRequest extends S.Class<ListModelImportJobsRequest>(
  "ListModelImportJobsRequest",
)(
  {
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/model-import-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetModelInvocationJobRequest extends S.Class<GetModelInvocationJobRequest>(
  "GetModelInvocationJobRequest",
)(
  { jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/model-invocation-job/{jobIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListModelInvocationJobsRequest extends S.Class<ListModelInvocationJobsRequest>(
  "ListModelInvocationJobsRequest",
)(
  {
    submitTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("submitTimeAfter")),
    submitTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("submitTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/model-invocation-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopModelInvocationJobRequest extends S.Class<StopModelInvocationJobRequest>(
  "StopModelInvocationJobRequest",
)(
  { jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/model-invocation-job/{jobIdentifier}/stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopModelInvocationJobResponse extends S.Class<StopModelInvocationJobResponse>(
  "StopModelInvocationJobResponse",
)({}) {}
export class GetFoundationModelRequest extends S.Class<GetFoundationModelRequest>(
  "GetFoundationModelRequest",
)(
  { modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/foundation-models/{modelIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFoundationModelsRequest extends S.Class<ListFoundationModelsRequest>(
  "ListFoundationModelsRequest",
)(
  {
    byProvider: S.optional(S.String).pipe(T.HttpQuery("byProvider")),
    byCustomizationType: S.optional(S.String).pipe(
      T.HttpQuery("byCustomizationType"),
    ),
    byOutputModality: S.optional(S.String).pipe(
      T.HttpQuery("byOutputModality"),
    ),
    byInferenceType: S.optional(S.String).pipe(T.HttpQuery("byInferenceType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/foundation-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPromptRouterRequest extends S.Class<GetPromptRouterRequest>(
  "GetPromptRouterRequest",
)(
  { promptRouterArn: S.String.pipe(T.HttpLabel("promptRouterArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/prompt-routers/{promptRouterArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePromptRouterRequest extends S.Class<DeletePromptRouterRequest>(
  "DeletePromptRouterRequest",
)(
  { promptRouterArn: S.String.pipe(T.HttpLabel("promptRouterArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prompt-routers/{promptRouterArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePromptRouterResponse extends S.Class<DeletePromptRouterResponse>(
  "DeletePromptRouterResponse",
)({}) {}
export class ListPromptRoutersRequest extends S.Class<ListPromptRoutersRequest>(
  "ListPromptRoutersRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prompt-routers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProvisionedModelThroughputRequest extends S.Class<CreateProvisionedModelThroughputRequest>(
  "CreateProvisionedModelThroughputRequest",
)(
  {
    clientRequestToken: S.optional(S.String),
    modelUnits: S.Number,
    provisionedModelName: S.String,
    modelId: S.String,
    commitmentDuration: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/provisioned-model-throughput" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProvisionedModelThroughputRequest extends S.Class<DeleteProvisionedModelThroughputRequest>(
  "DeleteProvisionedModelThroughputRequest",
)(
  { provisionedModelId: S.String.pipe(T.HttpLabel("provisionedModelId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/provisioned-model-throughput/{provisionedModelId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProvisionedModelThroughputResponse extends S.Class<DeleteProvisionedModelThroughputResponse>(
  "DeleteProvisionedModelThroughputResponse",
)({}) {}
export class GetProvisionedModelThroughputRequest extends S.Class<GetProvisionedModelThroughputRequest>(
  "GetProvisionedModelThroughputRequest",
)(
  { provisionedModelId: S.String.pipe(T.HttpLabel("provisionedModelId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/provisioned-model-throughput/{provisionedModelId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProvisionedModelThroughputsRequest extends S.Class<ListProvisionedModelThroughputsRequest>(
  "ListProvisionedModelThroughputsRequest",
)(
  {
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    modelArnEquals: S.optional(S.String).pipe(T.HttpQuery("modelArnEquals")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/provisioned-model-throughputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProvisionedModelThroughputRequest extends S.Class<UpdateProvisionedModelThroughputRequest>(
  "UpdateProvisionedModelThroughputRequest",
)(
  {
    provisionedModelId: S.String.pipe(T.HttpLabel("provisionedModelId")),
    desiredProvisionedModelName: S.optional(S.String),
    desiredModelId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/provisioned-model-throughput/{provisionedModelId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProvisionedModelThroughputResponse extends S.Class<UpdateProvisionedModelThroughputResponse>(
  "UpdateProvisionedModelThroughputResponse",
)({}) {}
export class CreateFoundationModelAgreementRequest extends S.Class<CreateFoundationModelAgreementRequest>(
  "CreateFoundationModelAgreementRequest",
)(
  { offerToken: S.String, modelId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/create-foundation-model-agreement" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFoundationModelAgreementRequest extends S.Class<DeleteFoundationModelAgreementRequest>(
  "DeleteFoundationModelAgreementRequest",
)(
  { modelId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/delete-foundation-model-agreement" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFoundationModelAgreementResponse extends S.Class<DeleteFoundationModelAgreementResponse>(
  "DeleteFoundationModelAgreementResponse",
)({}) {}
export class GetFoundationModelAvailabilityRequest extends S.Class<GetFoundationModelAvailabilityRequest>(
  "GetFoundationModelAvailabilityRequest",
)(
  { modelId: S.String.pipe(T.HttpLabel("modelId")) },
  T.all(
    T.Http({ method: "GET", uri: "/foundation-model-availability/{modelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFoundationModelAgreementOffersRequest extends S.Class<ListFoundationModelAgreementOffersRequest>(
  "ListFoundationModelAgreementOffersRequest",
)(
  {
    modelId: S.String.pipe(T.HttpLabel("modelId")),
    offerType: S.optional(S.String).pipe(T.HttpQuery("offerType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/list-foundation-model-agreement-offers/{modelId}",
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
  { resourceARN: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/listTagsForResource" }),
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
  { resourceARN: S.String, tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tagResource" }),
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
  { resourceARN: S.String, tagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/untagResource" }),
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
export class GetModelCustomizationJobRequest extends S.Class<GetModelCustomizationJobRequest>(
  "GetModelCustomizationJobRequest",
)(
  { jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/model-customization-jobs/{jobIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListModelCustomizationJobsRequest extends S.Class<ListModelCustomizationJobsRequest>(
  "ListModelCustomizationJobsRequest",
)(
  {
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/model-customization-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopModelCustomizationJobRequest extends S.Class<StopModelCustomizationJobRequest>(
  "StopModelCustomizationJobRequest",
)(
  { jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/model-customization-jobs/{jobIdentifier}/stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopModelCustomizationJobResponse extends S.Class<StopModelCustomizationJobResponse>(
  "StopModelCustomizationJobResponse",
)({}) {}
export class AutomatedReasoningPolicyTestCase extends S.Class<AutomatedReasoningPolicyTestCase>(
  "AutomatedReasoningPolicyTestCase",
)({
  testCaseId: S.String,
  guardContent: S.String,
  queryContent: S.optional(S.String),
  expectedAggregatedFindingsResult: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  confidenceThreshold: S.optional(S.Number),
}) {}
export const AutomatedReasoningPolicyTestCaseList = S.Array(
  AutomatedReasoningPolicyTestCase,
);
export class AutomatedReasoningLogicStatement extends S.Class<AutomatedReasoningLogicStatement>(
  "AutomatedReasoningLogicStatement",
)({ logic: S.String, naturalLanguage: S.optional(S.String) }) {}
export const AutomatedReasoningLogicStatementList = S.Array(
  AutomatedReasoningLogicStatement,
);
export class AutomatedReasoningCheckInputTextReference extends S.Class<AutomatedReasoningCheckInputTextReference>(
  "AutomatedReasoningCheckInputTextReference",
)({ text: S.optional(S.String) }) {}
export const AutomatedReasoningCheckInputTextReferenceList = S.Array(
  AutomatedReasoningCheckInputTextReference,
);
export class AutomatedReasoningCheckTranslation extends S.Class<AutomatedReasoningCheckTranslation>(
  "AutomatedReasoningCheckTranslation",
)({
  premises: S.optional(AutomatedReasoningLogicStatementList),
  claims: AutomatedReasoningLogicStatementList,
  untranslatedPremises: S.optional(
    AutomatedReasoningCheckInputTextReferenceList,
  ),
  untranslatedClaims: S.optional(AutomatedReasoningCheckInputTextReferenceList),
  confidence: S.Number,
}) {}
export class AutomatedReasoningCheckScenario extends S.Class<AutomatedReasoningCheckScenario>(
  "AutomatedReasoningCheckScenario",
)({ statements: S.optional(AutomatedReasoningLogicStatementList) }) {}
export class AutomatedReasoningCheckRule extends S.Class<AutomatedReasoningCheckRule>(
  "AutomatedReasoningCheckRule",
)({ id: S.optional(S.String), policyVersionArn: S.optional(S.String) }) {}
export const AutomatedReasoningCheckRuleList = S.Array(
  AutomatedReasoningCheckRule,
);
export class AutomatedReasoningCheckLogicWarning extends S.Class<AutomatedReasoningCheckLogicWarning>(
  "AutomatedReasoningCheckLogicWarning",
)({
  type: S.optional(S.String),
  premises: S.optional(AutomatedReasoningLogicStatementList),
  claims: S.optional(AutomatedReasoningLogicStatementList),
}) {}
export class AutomatedReasoningCheckValidFinding extends S.Class<AutomatedReasoningCheckValidFinding>(
  "AutomatedReasoningCheckValidFinding",
)({
  translation: S.optional(AutomatedReasoningCheckTranslation),
  claimsTrueScenario: S.optional(AutomatedReasoningCheckScenario),
  supportingRules: S.optional(AutomatedReasoningCheckRuleList),
  logicWarning: S.optional(AutomatedReasoningCheckLogicWarning),
}) {}
export class AutomatedReasoningCheckInvalidFinding extends S.Class<AutomatedReasoningCheckInvalidFinding>(
  "AutomatedReasoningCheckInvalidFinding",
)({
  translation: S.optional(AutomatedReasoningCheckTranslation),
  contradictingRules: S.optional(AutomatedReasoningCheckRuleList),
  logicWarning: S.optional(AutomatedReasoningCheckLogicWarning),
}) {}
export class AutomatedReasoningCheckSatisfiableFinding extends S.Class<AutomatedReasoningCheckSatisfiableFinding>(
  "AutomatedReasoningCheckSatisfiableFinding",
)({
  translation: S.optional(AutomatedReasoningCheckTranslation),
  claimsTrueScenario: S.optional(AutomatedReasoningCheckScenario),
  claimsFalseScenario: S.optional(AutomatedReasoningCheckScenario),
  logicWarning: S.optional(AutomatedReasoningCheckLogicWarning),
}) {}
export class AutomatedReasoningCheckImpossibleFinding extends S.Class<AutomatedReasoningCheckImpossibleFinding>(
  "AutomatedReasoningCheckImpossibleFinding",
)({
  translation: S.optional(AutomatedReasoningCheckTranslation),
  contradictingRules: S.optional(AutomatedReasoningCheckRuleList),
  logicWarning: S.optional(AutomatedReasoningCheckLogicWarning),
}) {}
export const AutomatedReasoningCheckTranslationList = S.Array(
  AutomatedReasoningCheckTranslation,
);
export class AutomatedReasoningCheckTranslationOption extends S.Class<AutomatedReasoningCheckTranslationOption>(
  "AutomatedReasoningCheckTranslationOption",
)({ translations: S.optional(AutomatedReasoningCheckTranslationList) }) {}
export const AutomatedReasoningCheckTranslationOptionList = S.Array(
  AutomatedReasoningCheckTranslationOption,
);
export const AutomatedReasoningCheckDifferenceScenarioList = S.Array(
  AutomatedReasoningCheckScenario,
);
export class AutomatedReasoningCheckTranslationAmbiguousFinding extends S.Class<AutomatedReasoningCheckTranslationAmbiguousFinding>(
  "AutomatedReasoningCheckTranslationAmbiguousFinding",
)({
  options: S.optional(AutomatedReasoningCheckTranslationOptionList),
  differenceScenarios: S.optional(
    AutomatedReasoningCheckDifferenceScenarioList,
  ),
}) {}
export class AutomatedReasoningCheckTooComplexFinding extends S.Class<AutomatedReasoningCheckTooComplexFinding>(
  "AutomatedReasoningCheckTooComplexFinding",
)({}) {}
export class AutomatedReasoningCheckNoTranslationsFinding extends S.Class<AutomatedReasoningCheckNoTranslationsFinding>(
  "AutomatedReasoningCheckNoTranslationsFinding",
)({}) {}
export const AutomatedReasoningCheckFinding = S.Union(
  S.Struct({ valid: AutomatedReasoningCheckValidFinding }),
  S.Struct({ invalid: AutomatedReasoningCheckInvalidFinding }),
  S.Struct({ satisfiable: AutomatedReasoningCheckSatisfiableFinding }),
  S.Struct({ impossible: AutomatedReasoningCheckImpossibleFinding }),
  S.Struct({
    translationAmbiguous: AutomatedReasoningCheckTranslationAmbiguousFinding,
  }),
  S.Struct({ tooComplex: AutomatedReasoningCheckTooComplexFinding }),
  S.Struct({ noTranslations: AutomatedReasoningCheckNoTranslationsFinding }),
);
export const AutomatedReasoningCheckFindingList = S.Array(
  AutomatedReasoningCheckFinding,
);
export class AutomatedReasoningPolicyTestResult extends S.Class<AutomatedReasoningPolicyTestResult>(
  "AutomatedReasoningPolicyTestResult",
)({
  testCase: AutomatedReasoningPolicyTestCase,
  policyArn: S.String,
  testRunStatus: S.String,
  testFindings: S.optional(AutomatedReasoningCheckFindingList),
  testRunResult: S.optional(S.String),
  aggregatedTestFindingsResult: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AutomatedReasoningPolicyTestList = S.Array(
  AutomatedReasoningPolicyTestResult,
);
export class AccountEnforcedGuardrailInferenceInputConfiguration extends S.Class<AccountEnforcedGuardrailInferenceInputConfiguration>(
  "AccountEnforcedGuardrailInferenceInputConfiguration",
)({
  guardrailIdentifier: S.String,
  guardrailVersion: S.String,
  inputTags: S.String,
}) {}
export class EvaluationOutputDataConfig extends S.Class<EvaluationOutputDataConfig>(
  "EvaluationOutputDataConfig",
)({ s3Uri: S.String }) {}
export const ErrorMessages = S.Array(S.String);
export const GuardrailStatusReasons = S.Array(S.String);
export const GuardrailFailureRecommendations = S.Array(S.String);
export const InferenceProfileModelSource = S.Union(
  S.Struct({ copyFrom: S.String }),
);
export class PromptRouterTargetModel extends S.Class<PromptRouterTargetModel>(
  "PromptRouterTargetModel",
)({ modelArn: S.String }) {}
export const PromptRouterTargetModels = S.Array(PromptRouterTargetModel);
export class RoutingCriteria extends S.Class<RoutingCriteria>(
  "RoutingCriteria",
)({ responseQualityDifference: S.Number }) {}
export class OutputDataConfig extends S.Class<OutputDataConfig>(
  "OutputDataConfig",
)({ s3Uri: S.String }) {}
export const ModelCustomizationHyperParameters = S.Record({
  key: S.String,
  value: S.String,
});
export const AutomatedReasoningPolicyDefinitionRuleIdList = S.Array(S.String);
export class GetAutomatedReasoningPolicyResponse extends S.Class<GetAutomatedReasoningPolicyResponse>(
  "GetAutomatedReasoningPolicyResponse",
)({
  policyArn: S.String,
  name: S.String,
  version: S.String,
  policyId: S.String,
  description: S.optional(S.String),
  definitionHash: S.String,
  kmsKeyArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class UpdateAutomatedReasoningPolicyResponse extends S.Class<UpdateAutomatedReasoningPolicyResponse>(
  "UpdateAutomatedReasoningPolicyResponse",
)({
  policyArn: S.String,
  name: S.String,
  definitionHash: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class CreateAutomatedReasoningPolicyTestCaseResponse extends S.Class<CreateAutomatedReasoningPolicyTestCaseResponse>(
  "CreateAutomatedReasoningPolicyTestCaseResponse",
)({ policyArn: S.String, testCaseId: S.String }) {}
export class CreateAutomatedReasoningPolicyVersionResponse extends S.Class<CreateAutomatedReasoningPolicyVersionResponse>(
  "CreateAutomatedReasoningPolicyVersionResponse",
)({
  policyArn: S.String,
  version: S.String,
  name: S.String,
  description: S.optional(S.String),
  definitionHash: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ExportAutomatedReasoningPolicyVersionResponse extends S.Class<ExportAutomatedReasoningPolicyVersionResponse>(
  "ExportAutomatedReasoningPolicyVersionResponse",
)({
  policyDefinition: AutomatedReasoningPolicyDefinition.pipe(T.HttpPayload()),
}) {}
export class AutomatedReasoningPolicyAddTypeAnnotation extends S.Class<AutomatedReasoningPolicyAddTypeAnnotation>(
  "AutomatedReasoningPolicyAddTypeAnnotation",
)({
  name: S.String,
  description: S.String,
  values: AutomatedReasoningPolicyDefinitionTypeValueList,
}) {}
export class AutomatedReasoningPolicyAddTypeValue extends S.Class<AutomatedReasoningPolicyAddTypeValue>(
  "AutomatedReasoningPolicyAddTypeValue",
)({ value: S.String, description: S.optional(S.String) }) {}
export class AutomatedReasoningPolicyUpdateTypeValue extends S.Class<AutomatedReasoningPolicyUpdateTypeValue>(
  "AutomatedReasoningPolicyUpdateTypeValue",
)({
  value: S.String,
  newValue: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class AutomatedReasoningPolicyDeleteTypeValue extends S.Class<AutomatedReasoningPolicyDeleteTypeValue>(
  "AutomatedReasoningPolicyDeleteTypeValue",
)({ value: S.String }) {}
export const AutomatedReasoningPolicyTypeValueAnnotation = S.Union(
  S.Struct({ addTypeValue: AutomatedReasoningPolicyAddTypeValue }),
  S.Struct({ updateTypeValue: AutomatedReasoningPolicyUpdateTypeValue }),
  S.Struct({ deleteTypeValue: AutomatedReasoningPolicyDeleteTypeValue }),
);
export const AutomatedReasoningPolicyTypeValueAnnotationList = S.Array(
  AutomatedReasoningPolicyTypeValueAnnotation,
);
export class AutomatedReasoningPolicyUpdateTypeAnnotation extends S.Class<AutomatedReasoningPolicyUpdateTypeAnnotation>(
  "AutomatedReasoningPolicyUpdateTypeAnnotation",
)({
  name: S.String,
  newName: S.optional(S.String),
  description: S.optional(S.String),
  values: AutomatedReasoningPolicyTypeValueAnnotationList,
}) {}
export class AutomatedReasoningPolicyDeleteTypeAnnotation extends S.Class<AutomatedReasoningPolicyDeleteTypeAnnotation>(
  "AutomatedReasoningPolicyDeleteTypeAnnotation",
)({ name: S.String }) {}
export class AutomatedReasoningPolicyAddVariableAnnotation extends S.Class<AutomatedReasoningPolicyAddVariableAnnotation>(
  "AutomatedReasoningPolicyAddVariableAnnotation",
)({ name: S.String, type: S.String, description: S.String }) {}
export class AutomatedReasoningPolicyUpdateVariableAnnotation extends S.Class<AutomatedReasoningPolicyUpdateVariableAnnotation>(
  "AutomatedReasoningPolicyUpdateVariableAnnotation",
)({
  name: S.String,
  newName: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class AutomatedReasoningPolicyDeleteVariableAnnotation extends S.Class<AutomatedReasoningPolicyDeleteVariableAnnotation>(
  "AutomatedReasoningPolicyDeleteVariableAnnotation",
)({ name: S.String }) {}
export class AutomatedReasoningPolicyAddRuleAnnotation extends S.Class<AutomatedReasoningPolicyAddRuleAnnotation>(
  "AutomatedReasoningPolicyAddRuleAnnotation",
)({ expression: S.String }) {}
export class AutomatedReasoningPolicyUpdateRuleAnnotation extends S.Class<AutomatedReasoningPolicyUpdateRuleAnnotation>(
  "AutomatedReasoningPolicyUpdateRuleAnnotation",
)({ ruleId: S.String, expression: S.String }) {}
export class AutomatedReasoningPolicyDeleteRuleAnnotation extends S.Class<AutomatedReasoningPolicyDeleteRuleAnnotation>(
  "AutomatedReasoningPolicyDeleteRuleAnnotation",
)({ ruleId: S.String }) {}
export class AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation extends S.Class<AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation>(
  "AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation",
)({ naturalLanguage: S.String }) {}
export class AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation extends S.Class<AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation>(
  "AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation",
)({
  ruleIds: S.optional(AutomatedReasoningPolicyDefinitionRuleIdList),
  feedback: S.String,
}) {}
export class AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation extends S.Class<AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation>(
  "AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation",
)({
  ruleIds: S.optional(AutomatedReasoningPolicyDefinitionRuleIdList),
  scenarioExpression: S.String,
  feedback: S.optional(S.String),
}) {}
export class AutomatedReasoningPolicyIngestContentAnnotation extends S.Class<AutomatedReasoningPolicyIngestContentAnnotation>(
  "AutomatedReasoningPolicyIngestContentAnnotation",
)({ content: S.String }) {}
export const AutomatedReasoningPolicyAnnotation = S.Union(
  S.Struct({ addType: AutomatedReasoningPolicyAddTypeAnnotation }),
  S.Struct({ updateType: AutomatedReasoningPolicyUpdateTypeAnnotation }),
  S.Struct({ deleteType: AutomatedReasoningPolicyDeleteTypeAnnotation }),
  S.Struct({ addVariable: AutomatedReasoningPolicyAddVariableAnnotation }),
  S.Struct({
    updateVariable: AutomatedReasoningPolicyUpdateVariableAnnotation,
  }),
  S.Struct({
    deleteVariable: AutomatedReasoningPolicyDeleteVariableAnnotation,
  }),
  S.Struct({ addRule: AutomatedReasoningPolicyAddRuleAnnotation }),
  S.Struct({ updateRule: AutomatedReasoningPolicyUpdateRuleAnnotation }),
  S.Struct({ deleteRule: AutomatedReasoningPolicyDeleteRuleAnnotation }),
  S.Struct({
    addRuleFromNaturalLanguage:
      AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation,
  }),
  S.Struct({
    updateFromRulesFeedback:
      AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation,
  }),
  S.Struct({
    updateFromScenarioFeedback:
      AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation,
  }),
  S.Struct({ ingestContent: AutomatedReasoningPolicyIngestContentAnnotation }),
);
export const AutomatedReasoningPolicyAnnotationList = S.Array(
  AutomatedReasoningPolicyAnnotation,
);
export class GetAutomatedReasoningPolicyAnnotationsResponse extends S.Class<GetAutomatedReasoningPolicyAnnotationsResponse>(
  "GetAutomatedReasoningPolicyAnnotationsResponse",
)({
  policyArn: S.String,
  name: S.String,
  buildWorkflowId: S.String,
  annotations: AutomatedReasoningPolicyAnnotationList,
  annotationSetHash: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetAutomatedReasoningPolicyBuildWorkflowResponse extends S.Class<GetAutomatedReasoningPolicyBuildWorkflowResponse>(
  "GetAutomatedReasoningPolicyBuildWorkflowResponse",
)({
  policyArn: S.String,
  buildWorkflowId: S.String,
  status: S.String,
  buildWorkflowType: S.String,
  documentName: S.optional(S.String),
  documentContentType: S.optional(S.String),
  documentDescription: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListAutomatedReasoningPolicyTestCasesResponse extends S.Class<ListAutomatedReasoningPolicyTestCasesResponse>(
  "ListAutomatedReasoningPolicyTestCasesResponse",
)({
  testCases: AutomatedReasoningPolicyTestCaseList,
  nextToken: S.optional(S.String),
}) {}
export class ListAutomatedReasoningPolicyTestResultsResponse extends S.Class<ListAutomatedReasoningPolicyTestResultsResponse>(
  "ListAutomatedReasoningPolicyTestResultsResponse",
)({
  testResults: AutomatedReasoningPolicyTestList,
  nextToken: S.optional(S.String),
}) {}
export class StartAutomatedReasoningPolicyTestWorkflowResponse extends S.Class<StartAutomatedReasoningPolicyTestWorkflowResponse>(
  "StartAutomatedReasoningPolicyTestWorkflowResponse",
)({ policyArn: S.String }) {}
export class UpdateAutomatedReasoningPolicyTestCaseResponse extends S.Class<UpdateAutomatedReasoningPolicyTestCaseResponse>(
  "UpdateAutomatedReasoningPolicyTestCaseResponse",
)({ policyArn: S.String, testCaseId: S.String }) {}
export class MarketplaceModelEndpoint extends S.Class<MarketplaceModelEndpoint>(
  "MarketplaceModelEndpoint",
)({
  endpointArn: S.String,
  modelSourceIdentifier: S.String,
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  endpointConfig: EndpointConfig,
  endpointStatus: S.String,
  endpointStatusMessage: S.optional(S.String),
}) {}
export class RegisterMarketplaceModelEndpointResponse extends S.Class<RegisterMarketplaceModelEndpointResponse>(
  "RegisterMarketplaceModelEndpointResponse",
)({ marketplaceModelEndpoint: MarketplaceModelEndpoint }) {}
export class UpdateMarketplaceModelEndpointResponse extends S.Class<UpdateMarketplaceModelEndpointResponse>(
  "UpdateMarketplaceModelEndpointResponse",
)({ marketplaceModelEndpoint: MarketplaceModelEndpoint }) {}
export class CreateCustomModelDeploymentResponse extends S.Class<CreateCustomModelDeploymentResponse>(
  "CreateCustomModelDeploymentResponse",
)({ customModelDeploymentArn: S.String }) {}
export class UpdateCustomModelDeploymentResponse extends S.Class<UpdateCustomModelDeploymentResponse>(
  "UpdateCustomModelDeploymentResponse",
)({ customModelDeploymentArn: S.String }) {}
export class PutEnforcedGuardrailConfigurationRequest extends S.Class<PutEnforcedGuardrailConfigurationRequest>(
  "PutEnforcedGuardrailConfigurationRequest",
)(
  {
    configId: S.optional(S.String),
    guardrailInferenceConfig:
      AccountEnforcedGuardrailInferenceInputConfiguration,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/enforcedGuardrailsConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const EvaluationDatasetLocation = S.Union(S.Struct({ s3Uri: S.String }));
export class EvaluationDataset extends S.Class<EvaluationDataset>(
  "EvaluationDataset",
)({ name: S.String, datasetLocation: S.optional(EvaluationDatasetLocation) }) {}
export const EvaluationMetricNames = S.Array(S.String);
export class EvaluationDatasetMetricConfig extends S.Class<EvaluationDatasetMetricConfig>(
  "EvaluationDatasetMetricConfig",
)({
  taskType: S.String,
  dataset: EvaluationDataset,
  metricNames: EvaluationMetricNames,
}) {}
export const EvaluationDatasetMetricConfigs = S.Array(
  EvaluationDatasetMetricConfig,
);
export class BedrockEvaluatorModel extends S.Class<BedrockEvaluatorModel>(
  "BedrockEvaluatorModel",
)({ modelIdentifier: S.String }) {}
export const BedrockEvaluatorModels = S.Array(BedrockEvaluatorModel);
export const EvaluatorModelConfig = S.Union(
  S.Struct({ bedrockEvaluatorModels: BedrockEvaluatorModels }),
);
export const RatingScaleItemValue = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ floatValue: S.Number }),
);
export class RatingScaleItem extends S.Class<RatingScaleItem>(
  "RatingScaleItem",
)({ definition: S.String, value: RatingScaleItemValue }) {}
export const RatingScale = S.Array(RatingScaleItem);
export class CustomMetricDefinition extends S.Class<CustomMetricDefinition>(
  "CustomMetricDefinition",
)({
  name: S.String,
  instructions: S.String,
  ratingScale: S.optional(RatingScale),
}) {}
export const AutomatedEvaluationCustomMetricSource = S.Union(
  S.Struct({ customMetricDefinition: CustomMetricDefinition }),
);
export const AutomatedEvaluationCustomMetrics = S.Array(
  AutomatedEvaluationCustomMetricSource,
);
export class CustomMetricBedrockEvaluatorModel extends S.Class<CustomMetricBedrockEvaluatorModel>(
  "CustomMetricBedrockEvaluatorModel",
)({ modelIdentifier: S.String }) {}
export const CustomMetricBedrockEvaluatorModels = S.Array(
  CustomMetricBedrockEvaluatorModel,
);
export class CustomMetricEvaluatorModelConfig extends S.Class<CustomMetricEvaluatorModelConfig>(
  "CustomMetricEvaluatorModelConfig",
)({ bedrockEvaluatorModels: CustomMetricBedrockEvaluatorModels }) {}
export class AutomatedEvaluationCustomMetricConfig extends S.Class<AutomatedEvaluationCustomMetricConfig>(
  "AutomatedEvaluationCustomMetricConfig",
)({
  customMetrics: AutomatedEvaluationCustomMetrics,
  evaluatorModelConfig: CustomMetricEvaluatorModelConfig,
}) {}
export class AutomatedEvaluationConfig extends S.Class<AutomatedEvaluationConfig>(
  "AutomatedEvaluationConfig",
)({
  datasetMetricConfigs: EvaluationDatasetMetricConfigs,
  evaluatorModelConfig: S.optional(EvaluatorModelConfig),
  customMetricConfig: S.optional(AutomatedEvaluationCustomMetricConfig),
}) {}
export class HumanWorkflowConfig extends S.Class<HumanWorkflowConfig>(
  "HumanWorkflowConfig",
)({ flowDefinitionArn: S.String, instructions: S.optional(S.String) }) {}
export class HumanEvaluationCustomMetric extends S.Class<HumanEvaluationCustomMetric>(
  "HumanEvaluationCustomMetric",
)({
  name: S.String,
  description: S.optional(S.String),
  ratingMethod: S.String,
}) {}
export const HumanEvaluationCustomMetrics = S.Array(
  HumanEvaluationCustomMetric,
);
export class HumanEvaluationConfig extends S.Class<HumanEvaluationConfig>(
  "HumanEvaluationConfig",
)({
  humanWorkflowConfig: S.optional(HumanWorkflowConfig),
  customMetrics: S.optional(HumanEvaluationCustomMetrics),
  datasetMetricConfigs: EvaluationDatasetMetricConfigs,
}) {}
export const EvaluationConfig = S.Union(
  S.Struct({ automated: AutomatedEvaluationConfig }),
  S.Struct({ human: HumanEvaluationConfig }),
);
export class PerformanceConfiguration extends S.Class<PerformanceConfiguration>(
  "PerformanceConfiguration",
)({ latency: S.optional(S.String) }) {}
export class EvaluationBedrockModel extends S.Class<EvaluationBedrockModel>(
  "EvaluationBedrockModel",
)({
  modelIdentifier: S.String,
  inferenceParams: S.optional(S.String),
  performanceConfig: S.optional(PerformanceConfiguration),
}) {}
export class EvaluationPrecomputedInferenceSource extends S.Class<EvaluationPrecomputedInferenceSource>(
  "EvaluationPrecomputedInferenceSource",
)({ inferenceSourceIdentifier: S.String }) {}
export const EvaluationModelConfig = S.Union(
  S.Struct({ bedrockModel: EvaluationBedrockModel }),
  S.Struct({
    precomputedInferenceSource: EvaluationPrecomputedInferenceSource,
  }),
);
export const EvaluationModelConfigs = S.Array(EvaluationModelConfig);
export class FilterAttribute extends S.Class<FilterAttribute>(
  "FilterAttribute",
)({ key: S.String, value: S.Any }) {}
export type RetrievalFilter =
  | { equals: FilterAttribute }
  | { notEquals: FilterAttribute }
  | { greaterThan: FilterAttribute }
  | { greaterThanOrEquals: FilterAttribute }
  | { lessThan: FilterAttribute }
  | { lessThanOrEquals: FilterAttribute }
  | { in: FilterAttribute }
  | { notIn: FilterAttribute }
  | { startsWith: FilterAttribute }
  | { listContains: FilterAttribute }
  | { stringContains: FilterAttribute }
  | { andAll: RetrievalFilterList }
  | { orAll: RetrievalFilterList };
export const RetrievalFilter = S.Union(
  S.Struct({ equals: FilterAttribute }),
  S.Struct({ notEquals: FilterAttribute }),
  S.Struct({ greaterThan: FilterAttribute }),
  S.Struct({ greaterThanOrEquals: FilterAttribute }),
  S.Struct({ lessThan: FilterAttribute }),
  S.Struct({ lessThanOrEquals: FilterAttribute }),
  S.Struct({ in: FilterAttribute }),
  S.Struct({ notIn: FilterAttribute }),
  S.Struct({ startsWith: FilterAttribute }),
  S.Struct({ listContains: FilterAttribute }),
  S.Struct({ stringContains: FilterAttribute }),
  S.Struct({ andAll: S.suspend(() => RetrievalFilterList) }),
  S.Struct({ orAll: S.suspend(() => RetrievalFilterList) }),
) as any as S.Schema<RetrievalFilter>;
export class MetadataAttributeSchema extends S.Class<MetadataAttributeSchema>(
  "MetadataAttributeSchema",
)({ key: S.String, type: S.String, description: S.String }) {}
export const MetadataAttributeSchemaList = S.Array(MetadataAttributeSchema);
export class ImplicitFilterConfiguration extends S.Class<ImplicitFilterConfiguration>(
  "ImplicitFilterConfiguration",
)({ metadataAttributes: MetadataAttributeSchemaList, modelArn: S.String }) {}
export const AdditionalModelRequestFields = S.Record({
  key: S.String,
  value: S.Any,
});
export class VectorSearchBedrockRerankingModelConfiguration extends S.Class<VectorSearchBedrockRerankingModelConfiguration>(
  "VectorSearchBedrockRerankingModelConfiguration",
)({
  modelArn: S.String,
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
}) {}
export class FieldForReranking extends S.Class<FieldForReranking>(
  "FieldForReranking",
)({ fieldName: S.String }) {}
export const FieldsForReranking = S.Array(FieldForReranking);
export const RerankingMetadataSelectiveModeConfiguration = S.Union(
  S.Struct({ fieldsToInclude: FieldsForReranking }),
  S.Struct({ fieldsToExclude: FieldsForReranking }),
);
export class MetadataConfigurationForReranking extends S.Class<MetadataConfigurationForReranking>(
  "MetadataConfigurationForReranking",
)({
  selectionMode: S.String,
  selectiveModeConfiguration: S.optional(
    RerankingMetadataSelectiveModeConfiguration,
  ),
}) {}
export class VectorSearchBedrockRerankingConfiguration extends S.Class<VectorSearchBedrockRerankingConfiguration>(
  "VectorSearchBedrockRerankingConfiguration",
)({
  modelConfiguration: VectorSearchBedrockRerankingModelConfiguration,
  numberOfRerankedResults: S.optional(S.Number),
  metadataConfiguration: S.optional(MetadataConfigurationForReranking),
}) {}
export class VectorSearchRerankingConfiguration extends S.Class<VectorSearchRerankingConfiguration>(
  "VectorSearchRerankingConfiguration",
)({
  type: S.String,
  bedrockRerankingConfiguration: S.optional(
    VectorSearchBedrockRerankingConfiguration,
  ),
}) {}
export class KnowledgeBaseVectorSearchConfiguration extends S.Class<KnowledgeBaseVectorSearchConfiguration>(
  "KnowledgeBaseVectorSearchConfiguration",
)({
  numberOfResults: S.optional(S.Number),
  overrideSearchType: S.optional(S.String),
  filter: S.optional(RetrievalFilter),
  implicitFilterConfiguration: S.optional(ImplicitFilterConfiguration),
  rerankingConfiguration: S.optional(VectorSearchRerankingConfiguration),
}) {}
export class KnowledgeBaseRetrievalConfiguration extends S.Class<KnowledgeBaseRetrievalConfiguration>(
  "KnowledgeBaseRetrievalConfiguration",
)({ vectorSearchConfiguration: KnowledgeBaseVectorSearchConfiguration }) {}
export class RetrieveConfig extends S.Class<RetrieveConfig>("RetrieveConfig")({
  knowledgeBaseId: S.String,
  knowledgeBaseRetrievalConfiguration: KnowledgeBaseRetrievalConfiguration,
}) {}
export class PromptTemplate extends S.Class<PromptTemplate>("PromptTemplate")({
  textPromptTemplate: S.optional(S.String),
}) {}
export class GuardrailConfiguration extends S.Class<GuardrailConfiguration>(
  "GuardrailConfiguration",
)({ guardrailId: S.String, guardrailVersion: S.String }) {}
export const RAGStopSequences = S.Array(S.String);
export class TextInferenceConfig extends S.Class<TextInferenceConfig>(
  "TextInferenceConfig",
)({
  temperature: S.optional(S.Number),
  topP: S.optional(S.Number),
  maxTokens: S.optional(S.Number),
  stopSequences: S.optional(RAGStopSequences),
}) {}
export class KbInferenceConfig extends S.Class<KbInferenceConfig>(
  "KbInferenceConfig",
)({ textInferenceConfig: S.optional(TextInferenceConfig) }) {}
export class GenerationConfiguration extends S.Class<GenerationConfiguration>(
  "GenerationConfiguration",
)({
  promptTemplate: S.optional(PromptTemplate),
  guardrailConfiguration: S.optional(GuardrailConfiguration),
  kbInferenceConfig: S.optional(KbInferenceConfig),
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
}) {}
export class QueryTransformationConfiguration extends S.Class<QueryTransformationConfiguration>(
  "QueryTransformationConfiguration",
)({ type: S.String }) {}
export class OrchestrationConfiguration extends S.Class<OrchestrationConfiguration>(
  "OrchestrationConfiguration",
)({ queryTransformationConfiguration: QueryTransformationConfiguration }) {}
export class KnowledgeBaseRetrieveAndGenerateConfiguration extends S.Class<KnowledgeBaseRetrieveAndGenerateConfiguration>(
  "KnowledgeBaseRetrieveAndGenerateConfiguration",
)({
  knowledgeBaseId: S.String,
  modelArn: S.String,
  retrievalConfiguration: S.optional(KnowledgeBaseRetrievalConfiguration),
  generationConfiguration: S.optional(GenerationConfiguration),
  orchestrationConfiguration: S.optional(OrchestrationConfiguration),
}) {}
export class S3ObjectDoc extends S.Class<S3ObjectDoc>("S3ObjectDoc")({
  uri: S.String,
}) {}
export class ByteContentDoc extends S.Class<ByteContentDoc>("ByteContentDoc")({
  identifier: S.String,
  contentType: S.String,
  data: T.Blob,
}) {}
export class ExternalSource extends S.Class<ExternalSource>("ExternalSource")({
  sourceType: S.String,
  s3Location: S.optional(S3ObjectDoc),
  byteContent: S.optional(ByteContentDoc),
}) {}
export const ExternalSources = S.Array(ExternalSource);
export class ExternalSourcesGenerationConfiguration extends S.Class<ExternalSourcesGenerationConfiguration>(
  "ExternalSourcesGenerationConfiguration",
)({
  promptTemplate: S.optional(PromptTemplate),
  guardrailConfiguration: S.optional(GuardrailConfiguration),
  kbInferenceConfig: S.optional(KbInferenceConfig),
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
}) {}
export class ExternalSourcesRetrieveAndGenerateConfiguration extends S.Class<ExternalSourcesRetrieveAndGenerateConfiguration>(
  "ExternalSourcesRetrieveAndGenerateConfiguration",
)({
  modelArn: S.String,
  sources: ExternalSources,
  generationConfiguration: S.optional(ExternalSourcesGenerationConfiguration),
}) {}
export class RetrieveAndGenerateConfiguration extends S.Class<RetrieveAndGenerateConfiguration>(
  "RetrieveAndGenerateConfiguration",
)({
  type: S.String,
  knowledgeBaseConfiguration: S.optional(
    KnowledgeBaseRetrieveAndGenerateConfiguration,
  ),
  externalSourcesConfiguration: S.optional(
    ExternalSourcesRetrieveAndGenerateConfiguration,
  ),
}) {}
export const KnowledgeBaseConfig = S.Union(
  S.Struct({ retrieveConfig: RetrieveConfig }),
  S.Struct({ retrieveAndGenerateConfig: RetrieveAndGenerateConfiguration }),
);
export class EvaluationPrecomputedRetrieveSourceConfig extends S.Class<EvaluationPrecomputedRetrieveSourceConfig>(
  "EvaluationPrecomputedRetrieveSourceConfig",
)({ ragSourceIdentifier: S.String }) {}
export class EvaluationPrecomputedRetrieveAndGenerateSourceConfig extends S.Class<EvaluationPrecomputedRetrieveAndGenerateSourceConfig>(
  "EvaluationPrecomputedRetrieveAndGenerateSourceConfig",
)({ ragSourceIdentifier: S.String }) {}
export const EvaluationPrecomputedRagSourceConfig = S.Union(
  S.Struct({ retrieveSourceConfig: EvaluationPrecomputedRetrieveSourceConfig }),
  S.Struct({
    retrieveAndGenerateSourceConfig:
      EvaluationPrecomputedRetrieveAndGenerateSourceConfig,
  }),
);
export const RAGConfig = S.Union(
  S.Struct({ knowledgeBaseConfig: KnowledgeBaseConfig }),
  S.Struct({
    precomputedRagSourceConfig: EvaluationPrecomputedRagSourceConfig,
  }),
);
export const RagConfigs = S.Array(RAGConfig);
export const EvaluationInferenceConfig = S.Union(
  S.Struct({ models: EvaluationModelConfigs }),
  S.Struct({ ragConfigs: RagConfigs }),
);
export class GetEvaluationJobResponse extends S.Class<GetEvaluationJobResponse>(
  "GetEvaluationJobResponse",
)({
  jobName: S.String,
  status: S.String,
  jobArn: S.String,
  jobDescription: S.optional(S.String),
  roleArn: S.String,
  customerEncryptionKeyId: S.optional(S.String),
  jobType: S.String,
  applicationType: S.optional(S.String),
  evaluationConfig: EvaluationConfig,
  inferenceConfig: EvaluationInferenceConfig,
  outputDataConfig: EvaluationOutputDataConfig,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  failureMessages: S.optional(ErrorMessages),
}) {}
export class UpdateGuardrailResponse extends S.Class<UpdateGuardrailResponse>(
  "UpdateGuardrailResponse",
)({
  guardrailId: S.String,
  guardrailArn: S.String,
  version: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class CreateGuardrailVersionResponse extends S.Class<CreateGuardrailVersionResponse>(
  "CreateGuardrailVersionResponse",
)({ guardrailId: S.String, version: S.String }) {}
export class CreateInferenceProfileRequest extends S.Class<CreateInferenceProfileRequest>(
  "CreateInferenceProfileRequest",
)(
  {
    inferenceProfileName: S.String,
    description: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    modelSource: InferenceProfileModelSource,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/inference-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateModelCopyJobResponse extends S.Class<CreateModelCopyJobResponse>(
  "CreateModelCopyJobResponse",
)({ jobArn: S.String }) {}
export class GetModelCopyJobResponse extends S.Class<GetModelCopyJobResponse>(
  "GetModelCopyJobResponse",
)({
  jobArn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  targetModelArn: S.String,
  targetModelName: S.optional(S.String),
  sourceAccountId: S.String,
  sourceModelArn: S.String,
  targetModelKmsKeyArn: S.optional(S.String),
  targetModelTags: S.optional(TagList),
  failureMessage: S.optional(S.String),
  sourceModelName: S.optional(S.String),
}) {}
export class S3DataSource extends S.Class<S3DataSource>("S3DataSource")({
  s3Uri: S.String,
}) {}
export const ModelDataSource = S.Union(
  S.Struct({ s3DataSource: S3DataSource }),
);
export class CreateModelImportJobRequest extends S.Class<CreateModelImportJobRequest>(
  "CreateModelImportJobRequest",
)(
  {
    jobName: S.String,
    importedModelName: S.String,
    roleArn: S.String,
    modelDataSource: ModelDataSource,
    jobTags: S.optional(TagList),
    importedModelTags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
    vpcConfig: S.optional(VpcConfig),
    importedModelKmsKeyId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/model-import-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetModelImportJobResponse extends S.Class<GetModelImportJobResponse>(
  "GetModelImportJobResponse",
)({
  jobArn: S.optional(S.String),
  jobName: S.optional(S.String),
  importedModelName: S.optional(S.String),
  importedModelArn: S.optional(S.String),
  roleArn: S.optional(S.String),
  modelDataSource: S.optional(ModelDataSource),
  status: S.optional(S.String),
  failureMessage: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  vpcConfig: S.optional(VpcConfig),
  importedModelKmsKeyArn: S.optional(S.String),
}) {}
export class ModelInvocationJobS3InputDataConfig extends S.Class<ModelInvocationJobS3InputDataConfig>(
  "ModelInvocationJobS3InputDataConfig",
)({
  s3InputFormat: S.optional(S.String),
  s3Uri: S.String,
  s3BucketOwner: S.optional(S.String),
}) {}
export const ModelInvocationJobInputDataConfig = S.Union(
  S.Struct({ s3InputDataConfig: ModelInvocationJobS3InputDataConfig }),
);
export class ModelInvocationJobS3OutputDataConfig extends S.Class<ModelInvocationJobS3OutputDataConfig>(
  "ModelInvocationJobS3OutputDataConfig",
)({
  s3Uri: S.String,
  s3EncryptionKeyId: S.optional(S.String),
  s3BucketOwner: S.optional(S.String),
}) {}
export const ModelInvocationJobOutputDataConfig = S.Union(
  S.Struct({ s3OutputDataConfig: ModelInvocationJobS3OutputDataConfig }),
);
export class GetModelInvocationJobResponse extends S.Class<GetModelInvocationJobResponse>(
  "GetModelInvocationJobResponse",
)({
  jobArn: S.String,
  jobName: S.optional(S.String),
  modelId: S.String,
  clientRequestToken: S.optional(S.String),
  roleArn: S.String,
  status: S.optional(S.String),
  message: S.optional(S.String),
  submitTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  inputDataConfig: ModelInvocationJobInputDataConfig,
  outputDataConfig: ModelInvocationJobOutputDataConfig,
  vpcConfig: S.optional(VpcConfig),
  timeoutDurationInHours: S.optional(S.Number),
  jobExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CreatePromptRouterRequest extends S.Class<CreatePromptRouterRequest>(
  "CreatePromptRouterRequest",
)(
  {
    clientRequestToken: S.optional(S.String),
    promptRouterName: S.String,
    models: PromptRouterTargetModels,
    description: S.optional(S.String),
    routingCriteria: RoutingCriteria,
    fallbackModel: PromptRouterTargetModel,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prompt-routers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPromptRouterResponse extends S.Class<GetPromptRouterResponse>(
  "GetPromptRouterResponse",
)({
  promptRouterName: S.String,
  routingCriteria: RoutingCriteria,
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  promptRouterArn: S.String,
  models: PromptRouterTargetModels,
  fallbackModel: PromptRouterTargetModel,
  status: S.String,
  type: S.String,
}) {}
export class CreateProvisionedModelThroughputResponse extends S.Class<CreateProvisionedModelThroughputResponse>(
  "CreateProvisionedModelThroughputResponse",
)({ provisionedModelArn: S.String }) {}
export class GetProvisionedModelThroughputResponse extends S.Class<GetProvisionedModelThroughputResponse>(
  "GetProvisionedModelThroughputResponse",
)({
  modelUnits: S.Number,
  desiredModelUnits: S.Number,
  provisionedModelName: S.String,
  provisionedModelArn: S.String,
  modelArn: S.String,
  desiredModelArn: S.String,
  foundationModelArn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  failureMessage: S.optional(S.String),
  commitmentDuration: S.optional(S.String),
  commitmentExpirationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class CreateFoundationModelAgreementResponse extends S.Class<CreateFoundationModelAgreementResponse>(
  "CreateFoundationModelAgreementResponse",
)({ modelId: S.String }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export const EvaluationTaskTypes = S.Array(S.String);
export const EvaluationBedrockModelIdentifiers = S.Array(S.String);
export const EvaluationBedrockKnowledgeBaseIdentifiers = S.Array(S.String);
export const EvaluatorModelIdentifiers = S.Array(S.String);
export const ModelModalityList = S.Array(S.String);
export const ModelCustomizationList = S.Array(S.String);
export const InferenceTypeList = S.Array(S.String);
export class Validator extends S.Class<Validator>("Validator")({
  s3Uri: S.String,
}) {}
export const Validators = S.Array(Validator);
export class AutomatedReasoningPolicySummary extends S.Class<AutomatedReasoningPolicySummary>(
  "AutomatedReasoningPolicySummary",
)({
  policyArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  version: S.String,
  policyId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AutomatedReasoningPolicySummaries = S.Array(
  AutomatedReasoningPolicySummary,
);
export class AutomatedReasoningPolicyScenario extends S.Class<AutomatedReasoningPolicyScenario>(
  "AutomatedReasoningPolicyScenario",
)({
  expression: S.String,
  alternateExpression: S.String,
  expectedResult: S.String,
  ruleIds: AutomatedReasoningPolicyDefinitionRuleIdList,
}) {}
export class AutomatedReasoningPolicyBuildWorkflowSummary extends S.Class<AutomatedReasoningPolicyBuildWorkflowSummary>(
  "AutomatedReasoningPolicyBuildWorkflowSummary",
)({
  policyArn: S.String,
  buildWorkflowId: S.String,
  status: S.String,
  buildWorkflowType: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AutomatedReasoningPolicyBuildWorkflowSummaries = S.Array(
  AutomatedReasoningPolicyBuildWorkflowSummary,
);
export class MarketplaceModelEndpointSummary extends S.Class<MarketplaceModelEndpointSummary>(
  "MarketplaceModelEndpointSummary",
)({
  endpointArn: S.String,
  modelSourceIdentifier: S.String,
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const MarketplaceModelEndpointSummaries = S.Array(
  MarketplaceModelEndpointSummary,
);
export class CustomModelDeploymentUpdateDetails extends S.Class<CustomModelDeploymentUpdateDetails>(
  "CustomModelDeploymentUpdateDetails",
)({ modelArn: S.String, updateStatus: S.String }) {}
export class CustomModelDeploymentSummary extends S.Class<CustomModelDeploymentSummary>(
  "CustomModelDeploymentSummary",
)({
  customModelDeploymentArn: S.String,
  customModelDeploymentName: S.String,
  modelArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  failureMessage: S.optional(S.String),
}) {}
export const CustomModelDeploymentSummaryList = S.Array(
  CustomModelDeploymentSummary,
);
export class TrainingMetrics extends S.Class<TrainingMetrics>(
  "TrainingMetrics",
)({ trainingLoss: S.optional(S.Number) }) {}
export class ValidatorMetric extends S.Class<ValidatorMetric>(
  "ValidatorMetric",
)({ validationLoss: S.optional(S.Number) }) {}
export const ValidationMetrics = S.Array(ValidatorMetric);
export class CustomModelSummary extends S.Class<CustomModelSummary>(
  "CustomModelSummary",
)({
  modelArn: S.String,
  modelName: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  baseModelArn: S.String,
  baseModelName: S.String,
  customizationType: S.optional(S.String),
  ownerAccountId: S.optional(S.String),
  modelStatus: S.optional(S.String),
}) {}
export const CustomModelSummaryList = S.Array(CustomModelSummary);
export class AccountEnforcedGuardrailOutputConfiguration extends S.Class<AccountEnforcedGuardrailOutputConfiguration>(
  "AccountEnforcedGuardrailOutputConfiguration",
)({
  configId: S.optional(S.String),
  guardrailArn: S.optional(S.String),
  guardrailId: S.optional(S.String),
  inputTags: S.optional(S.String),
  guardrailVersion: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  owner: S.optional(S.String),
}) {}
export const AccountEnforcedGuardrailsOutputConfiguration = S.Array(
  AccountEnforcedGuardrailOutputConfiguration,
);
export class BatchDeleteEvaluationJobError extends S.Class<BatchDeleteEvaluationJobError>(
  "BatchDeleteEvaluationJobError",
)({ jobIdentifier: S.String, code: S.String, message: S.optional(S.String) }) {}
export const BatchDeleteEvaluationJobErrors = S.Array(
  BatchDeleteEvaluationJobError,
);
export class BatchDeleteEvaluationJobItem extends S.Class<BatchDeleteEvaluationJobItem>(
  "BatchDeleteEvaluationJobItem",
)({ jobIdentifier: S.String, jobStatus: S.String }) {}
export const BatchDeleteEvaluationJobItems = S.Array(
  BatchDeleteEvaluationJobItem,
);
export class GuardrailAutomatedReasoningPolicy extends S.Class<GuardrailAutomatedReasoningPolicy>(
  "GuardrailAutomatedReasoningPolicy",
)({
  policies: AutomatedReasoningPolicyArnList,
  confidenceThreshold: S.optional(S.Number),
}) {}
export class GuardrailCrossRegionDetails extends S.Class<GuardrailCrossRegionDetails>(
  "GuardrailCrossRegionDetails",
)({
  guardrailProfileId: S.optional(S.String),
  guardrailProfileArn: S.optional(S.String),
}) {}
export class GuardrailSummary extends S.Class<GuardrailSummary>(
  "GuardrailSummary",
)({
  id: S.String,
  arn: S.String,
  status: S.String,
  name: S.String,
  description: S.optional(S.String),
  version: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  crossRegionDetails: S.optional(GuardrailCrossRegionDetails),
}) {}
export const GuardrailSummaries = S.Array(GuardrailSummary);
export class InferenceProfileModel extends S.Class<InferenceProfileModel>(
  "InferenceProfileModel",
)({ modelArn: S.optional(S.String) }) {}
export const InferenceProfileModels = S.Array(InferenceProfileModel);
export class InferenceProfileSummary extends S.Class<InferenceProfileSummary>(
  "InferenceProfileSummary",
)({
  inferenceProfileName: S.String,
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  inferenceProfileArn: S.String,
  models: InferenceProfileModels,
  inferenceProfileId: S.String,
  status: S.String,
  type: S.String,
}) {}
export const InferenceProfileSummaries = S.Array(InferenceProfileSummary);
export class ModelCopyJobSummary extends S.Class<ModelCopyJobSummary>(
  "ModelCopyJobSummary",
)({
  jobArn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  targetModelArn: S.String,
  targetModelName: S.optional(S.String),
  sourceAccountId: S.String,
  sourceModelArn: S.String,
  targetModelKmsKeyArn: S.optional(S.String),
  targetModelTags: S.optional(TagList),
  failureMessage: S.optional(S.String),
  sourceModelName: S.optional(S.String),
}) {}
export const ModelCopyJobSummaries = S.Array(ModelCopyJobSummary);
export class CustomModelUnits extends S.Class<CustomModelUnits>(
  "CustomModelUnits",
)({
  customModelUnitsPerModelCopy: S.optional(S.Number),
  customModelUnitsVersion: S.optional(S.String),
}) {}
export class ImportedModelSummary extends S.Class<ImportedModelSummary>(
  "ImportedModelSummary",
)({
  modelArn: S.String,
  modelName: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  instructSupported: S.optional(S.Boolean),
  modelArchitecture: S.optional(S.String),
}) {}
export const ImportedModelSummaryList = S.Array(ImportedModelSummary);
export class ModelImportJobSummary extends S.Class<ModelImportJobSummary>(
  "ModelImportJobSummary",
)({
  jobArn: S.String,
  jobName: S.String,
  status: S.String,
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  importedModelArn: S.optional(S.String),
  importedModelName: S.optional(S.String),
}) {}
export const ModelImportJobSummaries = S.Array(ModelImportJobSummary);
export class ModelInvocationJobSummary extends S.Class<ModelInvocationJobSummary>(
  "ModelInvocationJobSummary",
)({
  jobArn: S.String,
  jobName: S.String,
  modelId: S.String,
  clientRequestToken: S.optional(S.String),
  roleArn: S.String,
  status: S.optional(S.String),
  message: S.optional(S.String),
  submitTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  inputDataConfig: ModelInvocationJobInputDataConfig,
  outputDataConfig: ModelInvocationJobOutputDataConfig,
  vpcConfig: S.optional(VpcConfig),
  timeoutDurationInHours: S.optional(S.Number),
  jobExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ModelInvocationJobSummaries = S.Array(ModelInvocationJobSummary);
export class FoundationModelLifecycle extends S.Class<FoundationModelLifecycle>(
  "FoundationModelLifecycle",
)({ status: S.String }) {}
export class FoundationModelSummary extends S.Class<FoundationModelSummary>(
  "FoundationModelSummary",
)({
  modelArn: S.String,
  modelId: S.String,
  modelName: S.optional(S.String),
  providerName: S.optional(S.String),
  inputModalities: S.optional(ModelModalityList),
  outputModalities: S.optional(ModelModalityList),
  responseStreamingSupported: S.optional(S.Boolean),
  customizationsSupported: S.optional(ModelCustomizationList),
  inferenceTypesSupported: S.optional(InferenceTypeList),
  modelLifecycle: S.optional(FoundationModelLifecycle),
}) {}
export const FoundationModelSummaryList = S.Array(FoundationModelSummary);
export class PromptRouterSummary extends S.Class<PromptRouterSummary>(
  "PromptRouterSummary",
)({
  promptRouterName: S.String,
  routingCriteria: RoutingCriteria,
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  promptRouterArn: S.String,
  models: PromptRouterTargetModels,
  fallbackModel: PromptRouterTargetModel,
  status: S.String,
  type: S.String,
}) {}
export const PromptRouterSummaries = S.Array(PromptRouterSummary);
export class ProvisionedModelSummary extends S.Class<ProvisionedModelSummary>(
  "ProvisionedModelSummary",
)({
  provisionedModelName: S.String,
  provisionedModelArn: S.String,
  modelArn: S.String,
  desiredModelArn: S.String,
  foundationModelArn: S.String,
  modelUnits: S.Number,
  desiredModelUnits: S.Number,
  status: S.String,
  commitmentDuration: S.optional(S.String),
  commitmentExpirationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ProvisionedModelSummaries = S.Array(ProvisionedModelSummary);
export class AgreementAvailability extends S.Class<AgreementAvailability>(
  "AgreementAvailability",
)({ status: S.String, errorMessage: S.optional(S.String) }) {}
export class ValidationDataConfig extends S.Class<ValidationDataConfig>(
  "ValidationDataConfig",
)({ validators: Validators }) {}
export class ValidationDetails extends S.Class<ValidationDetails>(
  "ValidationDetails",
)({
  status: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class DataProcessingDetails extends S.Class<DataProcessingDetails>(
  "DataProcessingDetails",
)({
  status: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class TrainingDetails extends S.Class<TrainingDetails>(
  "TrainingDetails",
)({
  status: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class StatusDetails extends S.Class<StatusDetails>("StatusDetails")({
  validationDetails: S.optional(ValidationDetails),
  dataProcessingDetails: S.optional(DataProcessingDetails),
  trainingDetails: S.optional(TrainingDetails),
}) {}
export class ModelCustomizationJobSummary extends S.Class<ModelCustomizationJobSummary>(
  "ModelCustomizationJobSummary",
)({
  jobArn: S.String,
  baseModelArn: S.String,
  jobName: S.String,
  status: S.String,
  statusDetails: S.optional(StatusDetails),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  customModelArn: S.optional(S.String),
  customModelName: S.optional(S.String),
  customizationType: S.optional(S.String),
}) {}
export const ModelCustomizationJobSummaries = S.Array(
  ModelCustomizationJobSummary,
);
export const AutomatedReasoningPolicyDefinitionTypeNameList = S.Array(S.String);
export const AutomatedReasoningPolicyDefinitionVariableNameList = S.Array(
  S.String,
);
export const AutomatedReasoningPolicyConflictedRuleIdList = S.Array(S.String);
export const AutomatedReasoningPolicyScenarioList = S.Array(
  AutomatedReasoningPolicyScenario,
);
export class AutomatedReasoningPolicyBuildWorkflowDocument extends S.Class<AutomatedReasoningPolicyBuildWorkflowDocument>(
  "AutomatedReasoningPolicyBuildWorkflowDocument",
)({
  document: T.Blob,
  documentContentType: S.String,
  documentName: S.String,
  documentDescription: S.optional(S.String),
}) {}
export const AutomatedReasoningPolicyBuildWorkflowDocumentList = S.Array(
  AutomatedReasoningPolicyBuildWorkflowDocument,
);
export class AutomatedReasoningPolicyBuildWorkflowRepairContent extends S.Class<AutomatedReasoningPolicyBuildWorkflowRepairContent>(
  "AutomatedReasoningPolicyBuildWorkflowRepairContent",
)({ annotations: AutomatedReasoningPolicyAnnotationList }) {}
export const InvocationLogSource = S.Union(S.Struct({ s3Uri: S.String }));
export class TeacherModelConfig extends S.Class<TeacherModelConfig>(
  "TeacherModelConfig",
)({
  teacherModelIdentifier: S.String,
  maxResponseLengthForInference: S.optional(S.Number),
}) {}
export class RFTHyperParameters extends S.Class<RFTHyperParameters>(
  "RFTHyperParameters",
)({
  epochCount: S.optional(S.Number),
  batchSize: S.optional(S.Number),
  learningRate: S.optional(S.Number),
  maxPromptLength: S.optional(S.Number),
  trainingSamplePerPrompt: S.optional(S.Number),
  inferenceMaxTokens: S.optional(S.Number),
  reasoningEffort: S.optional(S.String),
  evalInterval: S.optional(S.Number),
}) {}
export class ListAutomatedReasoningPoliciesResponse extends S.Class<ListAutomatedReasoningPoliciesResponse>(
  "ListAutomatedReasoningPoliciesResponse",
)({
  automatedReasoningPolicySummaries: AutomatedReasoningPolicySummaries,
  nextToken: S.optional(S.String),
}) {}
export class GetAutomatedReasoningPolicyNextScenarioResponse extends S.Class<GetAutomatedReasoningPolicyNextScenarioResponse>(
  "GetAutomatedReasoningPolicyNextScenarioResponse",
)({
  policyArn: S.String,
  scenario: S.optional(AutomatedReasoningPolicyScenario),
}) {}
export class GetAutomatedReasoningPolicyTestCaseResponse extends S.Class<GetAutomatedReasoningPolicyTestCaseResponse>(
  "GetAutomatedReasoningPolicyTestCaseResponse",
)({ policyArn: S.String, testCase: AutomatedReasoningPolicyTestCase }) {}
export class ListAutomatedReasoningPolicyBuildWorkflowsResponse extends S.Class<ListAutomatedReasoningPolicyBuildWorkflowsResponse>(
  "ListAutomatedReasoningPolicyBuildWorkflowsResponse",
)({
  automatedReasoningPolicyBuildWorkflowSummaries:
    AutomatedReasoningPolicyBuildWorkflowSummaries,
  nextToken: S.optional(S.String),
}) {}
export class CreateMarketplaceModelEndpointRequest extends S.Class<CreateMarketplaceModelEndpointRequest>(
  "CreateMarketplaceModelEndpointRequest",
)(
  {
    modelSourceIdentifier: S.String,
    endpointConfig: EndpointConfig,
    acceptEula: S.optional(S.Boolean),
    endpointName: S.String,
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/marketplace-model/endpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMarketplaceModelEndpointResponse extends S.Class<GetMarketplaceModelEndpointResponse>(
  "GetMarketplaceModelEndpointResponse",
)({ marketplaceModelEndpoint: S.optional(MarketplaceModelEndpoint) }) {}
export class ListMarketplaceModelEndpointsResponse extends S.Class<ListMarketplaceModelEndpointsResponse>(
  "ListMarketplaceModelEndpointsResponse",
)({
  marketplaceModelEndpoints: S.optional(MarketplaceModelEndpointSummaries),
  nextToken: S.optional(S.String),
}) {}
export class GetCustomModelDeploymentResponse extends S.Class<GetCustomModelDeploymentResponse>(
  "GetCustomModelDeploymentResponse",
)({
  customModelDeploymentArn: S.String,
  modelDeploymentName: S.String,
  modelArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  description: S.optional(S.String),
  updateDetails: S.optional(CustomModelDeploymentUpdateDetails),
  failureMessage: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ListCustomModelDeploymentsResponse extends S.Class<ListCustomModelDeploymentsResponse>(
  "ListCustomModelDeploymentsResponse",
)({
  nextToken: S.optional(S.String),
  modelDeploymentSummaries: S.optional(CustomModelDeploymentSummaryList),
}) {}
export class CreateCustomModelRequest extends S.Class<CreateCustomModelRequest>(
  "CreateCustomModelRequest",
)(
  {
    modelName: S.String,
    modelSourceConfig: ModelDataSource,
    modelKmsKeyArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    modelTags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/custom-models/create-custom-model" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const RequestMetadataMap = S.Record({ key: S.String, value: S.String });
export class RequestMetadataBaseFilters extends S.Class<RequestMetadataBaseFilters>(
  "RequestMetadataBaseFilters",
)({
  equals: S.optional(RequestMetadataMap),
  notEquals: S.optional(RequestMetadataMap),
}) {}
export const RequestMetadataFiltersList = S.Array(RequestMetadataBaseFilters);
export const RequestMetadataFilters = S.Union(
  S.Struct({ equals: RequestMetadataMap }),
  S.Struct({ notEquals: RequestMetadataMap }),
  S.Struct({ andAll: RequestMetadataFiltersList }),
  S.Struct({ orAll: RequestMetadataFiltersList }),
);
export class InvocationLogsConfig extends S.Class<InvocationLogsConfig>(
  "InvocationLogsConfig",
)({
  usePromptResponse: S.optional(S.Boolean),
  invocationLogSource: InvocationLogSource,
  requestMetadataFilters: S.optional(RequestMetadataFilters),
}) {}
export class TrainingDataConfig extends S.Class<TrainingDataConfig>(
  "TrainingDataConfig",
)({
  s3Uri: S.optional(S.String),
  invocationLogsConfig: S.optional(InvocationLogsConfig),
}) {}
export class DistillationConfig extends S.Class<DistillationConfig>(
  "DistillationConfig",
)({ teacherModelConfig: TeacherModelConfig }) {}
export class LambdaGraderConfig extends S.Class<LambdaGraderConfig>(
  "LambdaGraderConfig",
)({ lambdaArn: S.String }) {}
export const GraderConfig = S.Union(
  S.Struct({ lambdaGrader: LambdaGraderConfig }),
);
export class RFTConfig extends S.Class<RFTConfig>("RFTConfig")({
  graderConfig: S.optional(GraderConfig),
  hyperParameters: S.optional(RFTHyperParameters),
}) {}
export const CustomizationConfig = S.Union(
  S.Struct({ distillationConfig: DistillationConfig }),
  S.Struct({ rftConfig: RFTConfig }),
);
export class GetCustomModelResponse extends S.Class<GetCustomModelResponse>(
  "GetCustomModelResponse",
)({
  modelArn: S.String,
  modelName: S.String,
  jobName: S.optional(S.String),
  jobArn: S.optional(S.String),
  baseModelArn: S.optional(S.String),
  customizationType: S.optional(S.String),
  modelKmsKeyArn: S.optional(S.String),
  hyperParameters: S.optional(ModelCustomizationHyperParameters),
  trainingDataConfig: S.optional(TrainingDataConfig),
  validationDataConfig: S.optional(ValidationDataConfig),
  outputDataConfig: S.optional(OutputDataConfig),
  trainingMetrics: S.optional(TrainingMetrics),
  validationMetrics: S.optional(ValidationMetrics),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  customizationConfig: S.optional(CustomizationConfig),
  modelStatus: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export class ListCustomModelsResponse extends S.Class<ListCustomModelsResponse>(
  "ListCustomModelsResponse",
)({
  nextToken: S.optional(S.String),
  modelSummaries: S.optional(CustomModelSummaryList),
}) {}
export class ListEnforcedGuardrailsConfigurationResponse extends S.Class<ListEnforcedGuardrailsConfigurationResponse>(
  "ListEnforcedGuardrailsConfigurationResponse",
)({
  guardrailsConfig: AccountEnforcedGuardrailsOutputConfiguration,
  nextToken: S.optional(S.String),
}) {}
export class PutEnforcedGuardrailConfigurationResponse extends S.Class<PutEnforcedGuardrailConfigurationResponse>(
  "PutEnforcedGuardrailConfigurationResponse",
)({
  configId: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export class BatchDeleteEvaluationJobResponse extends S.Class<BatchDeleteEvaluationJobResponse>(
  "BatchDeleteEvaluationJobResponse",
)({
  errors: BatchDeleteEvaluationJobErrors,
  evaluationJobs: BatchDeleteEvaluationJobItems,
}) {}
export class CreateGuardrailRequest extends S.Class<CreateGuardrailRequest>(
  "CreateGuardrailRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    topicPolicyConfig: S.optional(GuardrailTopicPolicyConfig),
    contentPolicyConfig: S.optional(GuardrailContentPolicyConfig),
    wordPolicyConfig: S.optional(GuardrailWordPolicyConfig),
    sensitiveInformationPolicyConfig: S.optional(
      GuardrailSensitiveInformationPolicyConfig,
    ),
    contextualGroundingPolicyConfig: S.optional(
      GuardrailContextualGroundingPolicyConfig,
    ),
    automatedReasoningPolicyConfig: S.optional(
      GuardrailAutomatedReasoningPolicyConfig,
    ),
    crossRegionConfig: S.optional(GuardrailCrossRegionConfig),
    blockedInputMessaging: S.String,
    blockedOutputsMessaging: S.String,
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/guardrails" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGuardrailsResponse extends S.Class<ListGuardrailsResponse>(
  "ListGuardrailsResponse",
)({ guardrails: GuardrailSummaries, nextToken: S.optional(S.String) }) {}
export class CreateInferenceProfileResponse extends S.Class<CreateInferenceProfileResponse>(
  "CreateInferenceProfileResponse",
)({ inferenceProfileArn: S.String, status: S.optional(S.String) }) {}
export class GetInferenceProfileResponse extends S.Class<GetInferenceProfileResponse>(
  "GetInferenceProfileResponse",
)({
  inferenceProfileName: S.String,
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  inferenceProfileArn: S.String,
  models: InferenceProfileModels,
  inferenceProfileId: S.String,
  status: S.String,
  type: S.String,
}) {}
export class ListInferenceProfilesResponse extends S.Class<ListInferenceProfilesResponse>(
  "ListInferenceProfilesResponse",
)({
  inferenceProfileSummaries: S.optional(InferenceProfileSummaries),
  nextToken: S.optional(S.String),
}) {}
export class GetModelInvocationLoggingConfigurationResponse extends S.Class<GetModelInvocationLoggingConfigurationResponse>(
  "GetModelInvocationLoggingConfigurationResponse",
)({ loggingConfig: S.optional(LoggingConfig) }) {}
export class ListModelCopyJobsResponse extends S.Class<ListModelCopyJobsResponse>(
  "ListModelCopyJobsResponse",
)({
  nextToken: S.optional(S.String),
  modelCopyJobSummaries: S.optional(ModelCopyJobSummaries),
}) {}
export class CreateModelImportJobResponse extends S.Class<CreateModelImportJobResponse>(
  "CreateModelImportJobResponse",
)({ jobArn: S.String }) {}
export class GetImportedModelResponse extends S.Class<GetImportedModelResponse>(
  "GetImportedModelResponse",
)({
  modelArn: S.optional(S.String),
  modelName: S.optional(S.String),
  jobName: S.optional(S.String),
  jobArn: S.optional(S.String),
  modelDataSource: S.optional(ModelDataSource),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  modelArchitecture: S.optional(S.String),
  modelKmsKeyArn: S.optional(S.String),
  instructSupported: S.optional(S.Boolean),
  customModelUnits: S.optional(CustomModelUnits),
}) {}
export class ListImportedModelsResponse extends S.Class<ListImportedModelsResponse>(
  "ListImportedModelsResponse",
)({
  nextToken: S.optional(S.String),
  modelSummaries: S.optional(ImportedModelSummaryList),
}) {}
export class ListModelImportJobsResponse extends S.Class<ListModelImportJobsResponse>(
  "ListModelImportJobsResponse",
)({
  nextToken: S.optional(S.String),
  modelImportJobSummaries: S.optional(ModelImportJobSummaries),
}) {}
export class CreateModelInvocationJobRequest extends S.Class<CreateModelInvocationJobRequest>(
  "CreateModelInvocationJobRequest",
)(
  {
    jobName: S.String,
    roleArn: S.String,
    clientRequestToken: S.optional(S.String),
    modelId: S.String,
    inputDataConfig: ModelInvocationJobInputDataConfig,
    outputDataConfig: ModelInvocationJobOutputDataConfig,
    vpcConfig: S.optional(VpcConfig),
    timeoutDurationInHours: S.optional(S.Number),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/model-invocation-job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListModelInvocationJobsResponse extends S.Class<ListModelInvocationJobsResponse>(
  "ListModelInvocationJobsResponse",
)({
  nextToken: S.optional(S.String),
  invocationJobSummaries: S.optional(ModelInvocationJobSummaries),
}) {}
export class ListFoundationModelsResponse extends S.Class<ListFoundationModelsResponse>(
  "ListFoundationModelsResponse",
)({ modelSummaries: S.optional(FoundationModelSummaryList) }) {}
export class CreatePromptRouterResponse extends S.Class<CreatePromptRouterResponse>(
  "CreatePromptRouterResponse",
)({ promptRouterArn: S.optional(S.String) }) {}
export class ListPromptRoutersResponse extends S.Class<ListPromptRoutersResponse>(
  "ListPromptRoutersResponse",
)({
  promptRouterSummaries: S.optional(PromptRouterSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListProvisionedModelThroughputsResponse extends S.Class<ListProvisionedModelThroughputsResponse>(
  "ListProvisionedModelThroughputsResponse",
)({
  nextToken: S.optional(S.String),
  provisionedModelSummaries: S.optional(ProvisionedModelSummaries),
}) {}
export class GetFoundationModelAvailabilityResponse extends S.Class<GetFoundationModelAvailabilityResponse>(
  "GetFoundationModelAvailabilityResponse",
)({
  modelId: S.String,
  agreementAvailability: AgreementAvailability,
  authorizationStatus: S.String,
  entitlementAvailability: S.String,
  regionAvailability: S.String,
}) {}
export class ListModelCustomizationJobsResponse extends S.Class<ListModelCustomizationJobsResponse>(
  "ListModelCustomizationJobsResponse",
)({
  nextToken: S.optional(S.String),
  modelCustomizationJobSummaries: S.optional(ModelCustomizationJobSummaries),
}) {}
export class AutomatedReasoningPolicyScenarios extends S.Class<AutomatedReasoningPolicyScenarios>(
  "AutomatedReasoningPolicyScenarios",
)({ policyScenarios: AutomatedReasoningPolicyScenarioList }) {}
export const AutomatedReasoningPolicyWorkflowTypeContent = S.Union(
  S.Struct({ documents: AutomatedReasoningPolicyBuildWorkflowDocumentList }),
  S.Struct({
    policyRepairAssets: AutomatedReasoningPolicyBuildWorkflowRepairContent,
  }),
);
export class GuardrailTopic extends S.Class<GuardrailTopic>("GuardrailTopic")({
  name: S.String,
  definition: S.String,
  examples: S.optional(GuardrailTopicExamples),
  type: S.optional(S.String),
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailTopics = S.Array(GuardrailTopic);
export class GuardrailTopicsTier extends S.Class<GuardrailTopicsTier>(
  "GuardrailTopicsTier",
)({ tierName: S.String }) {}
export class GuardrailContentFilter extends S.Class<GuardrailContentFilter>(
  "GuardrailContentFilter",
)({
  type: S.String,
  inputStrength: S.String,
  outputStrength: S.String,
  inputModalities: S.optional(GuardrailModalities),
  outputModalities: S.optional(GuardrailModalities),
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailContentFilters = S.Array(GuardrailContentFilter);
export class GuardrailContentFiltersTier extends S.Class<GuardrailContentFiltersTier>(
  "GuardrailContentFiltersTier",
)({ tierName: S.String }) {}
export class GuardrailWord extends S.Class<GuardrailWord>("GuardrailWord")({
  text: S.String,
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailWords = S.Array(GuardrailWord);
export class GuardrailManagedWords extends S.Class<GuardrailManagedWords>(
  "GuardrailManagedWords",
)({
  type: S.String,
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailManagedWordLists = S.Array(GuardrailManagedWords);
export class GuardrailPiiEntity extends S.Class<GuardrailPiiEntity>(
  "GuardrailPiiEntity",
)({
  type: S.String,
  action: S.String,
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailPiiEntities = S.Array(GuardrailPiiEntity);
export class GuardrailRegex extends S.Class<GuardrailRegex>("GuardrailRegex")({
  name: S.String,
  description: S.optional(S.String),
  pattern: S.String,
  action: S.String,
  inputAction: S.optional(S.String),
  outputAction: S.optional(S.String),
  inputEnabled: S.optional(S.Boolean),
  outputEnabled: S.optional(S.Boolean),
}) {}
export const GuardrailRegexes = S.Array(GuardrailRegex);
export class GuardrailContextualGroundingFilter extends S.Class<GuardrailContextualGroundingFilter>(
  "GuardrailContextualGroundingFilter",
)({
  type: S.String,
  threshold: S.Number,
  action: S.optional(S.String),
  enabled: S.optional(S.Boolean),
}) {}
export const GuardrailContextualGroundingFilters = S.Array(
  GuardrailContextualGroundingFilter,
);
export const AutomatedReasoningPolicyDisjointedRuleIdList = S.Array(S.String);
export const EvaluationPrecomputedInferenceSourceIdentifiers = S.Array(
  S.String,
);
export const EvaluationPrecomputedRagSourceIdentifiers = S.Array(S.String);
export class AutomatedReasoningPolicyBuildWorkflowSource extends S.Class<AutomatedReasoningPolicyBuildWorkflowSource>(
  "AutomatedReasoningPolicyBuildWorkflowSource",
)({
  policyDefinition: S.optional(AutomatedReasoningPolicyDefinition),
  workflowContent: S.optional(AutomatedReasoningPolicyWorkflowTypeContent),
}) {}
export class GuardrailTopicPolicy extends S.Class<GuardrailTopicPolicy>(
  "GuardrailTopicPolicy",
)({ topics: GuardrailTopics, tier: S.optional(GuardrailTopicsTier) }) {}
export class GuardrailContentPolicy extends S.Class<GuardrailContentPolicy>(
  "GuardrailContentPolicy",
)({
  filters: S.optional(GuardrailContentFilters),
  tier: S.optional(GuardrailContentFiltersTier),
}) {}
export class GuardrailWordPolicy extends S.Class<GuardrailWordPolicy>(
  "GuardrailWordPolicy",
)({
  words: S.optional(GuardrailWords),
  managedWordLists: S.optional(GuardrailManagedWordLists),
}) {}
export class GuardrailSensitiveInformationPolicy extends S.Class<GuardrailSensitiveInformationPolicy>(
  "GuardrailSensitiveInformationPolicy",
)({
  piiEntities: S.optional(GuardrailPiiEntities),
  regexes: S.optional(GuardrailRegexes),
}) {}
export class GuardrailContextualGroundingPolicy extends S.Class<GuardrailContextualGroundingPolicy>(
  "GuardrailContextualGroundingPolicy",
)({ filters: GuardrailContextualGroundingFilters }) {}
export class FoundationModelDetails extends S.Class<FoundationModelDetails>(
  "FoundationModelDetails",
)({
  modelArn: S.String,
  modelId: S.String,
  modelName: S.optional(S.String),
  providerName: S.optional(S.String),
  inputModalities: S.optional(ModelModalityList),
  outputModalities: S.optional(ModelModalityList),
  responseStreamingSupported: S.optional(S.Boolean),
  customizationsSupported: S.optional(ModelCustomizationList),
  inferenceTypesSupported: S.optional(InferenceTypeList),
  modelLifecycle: S.optional(FoundationModelLifecycle),
}) {}
export class AutomatedReasoningPolicyDefinitionTypeValuePair extends S.Class<AutomatedReasoningPolicyDefinitionTypeValuePair>(
  "AutomatedReasoningPolicyDefinitionTypeValuePair",
)({ typeName: S.String, valueName: S.String }) {}
export const AutomatedReasoningPolicyDefinitionTypeValuePairList = S.Array(
  AutomatedReasoningPolicyDefinitionTypeValuePair,
);
export class AutomatedReasoningPolicyDisjointRuleSet extends S.Class<AutomatedReasoningPolicyDisjointRuleSet>(
  "AutomatedReasoningPolicyDisjointRuleSet",
)({
  variables: AutomatedReasoningPolicyDefinitionVariableNameList,
  rules: AutomatedReasoningPolicyDisjointedRuleIdList,
}) {}
export const AutomatedReasoningPolicyDisjointRuleSetList = S.Array(
  AutomatedReasoningPolicyDisjointRuleSet,
);
export class AutomatedReasoningPolicyGeneratedTestCase extends S.Class<AutomatedReasoningPolicyGeneratedTestCase>(
  "AutomatedReasoningPolicyGeneratedTestCase",
)({
  queryContent: S.String,
  guardContent: S.String,
  expectedAggregatedFindingsResult: S.String,
}) {}
export const AutomatedReasoningPolicyGeneratedTestCaseList = S.Array(
  AutomatedReasoningPolicyGeneratedTestCase,
);
export class EvaluationModelConfigSummary extends S.Class<EvaluationModelConfigSummary>(
  "EvaluationModelConfigSummary",
)({
  bedrockModelIdentifiers: S.optional(EvaluationBedrockModelIdentifiers),
  precomputedInferenceSourceIdentifiers: S.optional(
    EvaluationPrecomputedInferenceSourceIdentifiers,
  ),
}) {}
export class EvaluationRagConfigSummary extends S.Class<EvaluationRagConfigSummary>(
  "EvaluationRagConfigSummary",
)({
  bedrockKnowledgeBaseIdentifiers: S.optional(
    EvaluationBedrockKnowledgeBaseIdentifiers,
  ),
  precomputedRagSourceIdentifiers: S.optional(
    EvaluationPrecomputedRagSourceIdentifiers,
  ),
}) {}
export class LegalTerm extends S.Class<LegalTerm>("LegalTerm")({
  url: S.optional(S.String),
}) {}
export class SupportTerm extends S.Class<SupportTerm>("SupportTerm")({
  refundPolicyDescription: S.optional(S.String),
}) {}
export class ValidityTerm extends S.Class<ValidityTerm>("ValidityTerm")({
  agreementDuration: S.optional(S.String),
}) {}
export class CreateAutomatedReasoningPolicyRequest extends S.Class<CreateAutomatedReasoningPolicyRequest>(
  "CreateAutomatedReasoningPolicyRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    policyDefinition: S.optional(AutomatedReasoningPolicyDefinition),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/automated-reasoning-policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartAutomatedReasoningPolicyBuildWorkflowRequest extends S.Class<StartAutomatedReasoningPolicyBuildWorkflowRequest>(
  "StartAutomatedReasoningPolicyBuildWorkflowRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowType: S.String.pipe(T.HttpLabel("buildWorkflowType")),
    clientRequestToken: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-client-token"),
    ),
    sourceContent: AutomatedReasoningPolicyBuildWorkflowSource.pipe(
      T.HttpPayload(),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowType}/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMarketplaceModelEndpointResponse extends S.Class<CreateMarketplaceModelEndpointResponse>(
  "CreateMarketplaceModelEndpointResponse",
)({ marketplaceModelEndpoint: MarketplaceModelEndpoint }) {}
export class CreateCustomModelResponse extends S.Class<CreateCustomModelResponse>(
  "CreateCustomModelResponse",
)({ modelArn: S.String }) {}
export class CreateGuardrailResponse extends S.Class<CreateGuardrailResponse>(
  "CreateGuardrailResponse",
)({
  guardrailId: S.String,
  guardrailArn: S.String,
  version: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetGuardrailResponse extends S.Class<GetGuardrailResponse>(
  "GetGuardrailResponse",
)({
  name: S.String,
  description: S.optional(S.String),
  guardrailId: S.String,
  guardrailArn: S.String,
  version: S.String,
  status: S.String,
  topicPolicy: S.optional(GuardrailTopicPolicy),
  contentPolicy: S.optional(GuardrailContentPolicy),
  wordPolicy: S.optional(GuardrailWordPolicy),
  sensitiveInformationPolicy: S.optional(GuardrailSensitiveInformationPolicy),
  contextualGroundingPolicy: S.optional(GuardrailContextualGroundingPolicy),
  automatedReasoningPolicy: S.optional(GuardrailAutomatedReasoningPolicy),
  crossRegionDetails: S.optional(GuardrailCrossRegionDetails),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  statusReasons: S.optional(GuardrailStatusReasons),
  failureRecommendations: S.optional(GuardrailFailureRecommendations),
  blockedInputMessaging: S.String,
  blockedOutputsMessaging: S.String,
  kmsKeyArn: S.optional(S.String),
}) {}
export class CreateModelInvocationJobResponse extends S.Class<CreateModelInvocationJobResponse>(
  "CreateModelInvocationJobResponse",
)({ jobArn: S.String }) {}
export class GetFoundationModelResponse extends S.Class<GetFoundationModelResponse>(
  "GetFoundationModelResponse",
)({ modelDetails: S.optional(FoundationModelDetails) }) {}
export class GetModelCustomizationJobResponse extends S.Class<GetModelCustomizationJobResponse>(
  "GetModelCustomizationJobResponse",
)({
  jobArn: S.String,
  jobName: S.String,
  outputModelName: S.String,
  outputModelArn: S.optional(S.String),
  clientRequestToken: S.optional(S.String),
  roleArn: S.String,
  status: S.optional(S.String),
  statusDetails: S.optional(StatusDetails),
  failureMessage: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  baseModelArn: S.String,
  hyperParameters: S.optional(ModelCustomizationHyperParameters),
  trainingDataConfig: TrainingDataConfig,
  validationDataConfig: ValidationDataConfig,
  outputDataConfig: OutputDataConfig,
  customizationType: S.optional(S.String),
  outputModelKmsKeyArn: S.optional(S.String),
  trainingMetrics: S.optional(TrainingMetrics),
  validationMetrics: S.optional(ValidationMetrics),
  vpcConfig: S.optional(VpcConfig),
  customizationConfig: S.optional(CustomizationConfig),
}) {}
export class AutomatedReasoningPolicyDefinitionQualityReport extends S.Class<AutomatedReasoningPolicyDefinitionQualityReport>(
  "AutomatedReasoningPolicyDefinitionQualityReport",
)({
  typeCount: S.Number,
  variableCount: S.Number,
  ruleCount: S.Number,
  unusedTypes: AutomatedReasoningPolicyDefinitionTypeNameList,
  unusedTypeValues: AutomatedReasoningPolicyDefinitionTypeValuePairList,
  unusedVariables: AutomatedReasoningPolicyDefinitionVariableNameList,
  conflictingRules: AutomatedReasoningPolicyConflictedRuleIdList,
  disjointRuleSets: AutomatedReasoningPolicyDisjointRuleSetList,
}) {}
export class AutomatedReasoningPolicyGeneratedTestCases extends S.Class<AutomatedReasoningPolicyGeneratedTestCases>(
  "AutomatedReasoningPolicyGeneratedTestCases",
)({ generatedTestCases: AutomatedReasoningPolicyGeneratedTestCaseList }) {}
export class EvaluationInferenceConfigSummary extends S.Class<EvaluationInferenceConfigSummary>(
  "EvaluationInferenceConfigSummary",
)({
  modelConfigSummary: S.optional(EvaluationModelConfigSummary),
  ragConfigSummary: S.optional(EvaluationRagConfigSummary),
}) {}
export class DimensionalPriceRate extends S.Class<DimensionalPriceRate>(
  "DimensionalPriceRate",
)({
  dimension: S.optional(S.String),
  price: S.optional(S.String),
  description: S.optional(S.String),
  unit: S.optional(S.String),
}) {}
export const RateCard = S.Array(DimensionalPriceRate);
export class AutomatedReasoningPolicyPlanning extends S.Class<AutomatedReasoningPolicyPlanning>(
  "AutomatedReasoningPolicyPlanning",
)({}) {}
export class EvaluationSummary extends S.Class<EvaluationSummary>(
  "EvaluationSummary",
)({
  jobArn: S.String,
  jobName: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  jobType: S.String,
  evaluationTaskTypes: EvaluationTaskTypes,
  modelIdentifiers: S.optional(EvaluationBedrockModelIdentifiers),
  ragIdentifiers: S.optional(EvaluationBedrockKnowledgeBaseIdentifiers),
  evaluatorModelIdentifiers: S.optional(EvaluatorModelIdentifiers),
  customMetricsEvaluatorModelIdentifiers: S.optional(EvaluatorModelIdentifiers),
  inferenceConfigSummary: S.optional(EvaluationInferenceConfigSummary),
  applicationType: S.optional(S.String),
}) {}
export const EvaluationSummaries = S.Array(EvaluationSummary);
export type RetrievalFilterList = RetrievalFilter[];
export const RetrievalFilterList = S.Array(
  S.suspend(() => RetrievalFilter),
) as any as S.Schema<RetrievalFilterList>;
export class PricingTerm extends S.Class<PricingTerm>("PricingTerm")({
  rateCard: RateCard,
}) {}
export class CreateAutomatedReasoningPolicyResponse extends S.Class<CreateAutomatedReasoningPolicyResponse>(
  "CreateAutomatedReasoningPolicyResponse",
)({
  policyArn: S.String,
  version: S.String,
  name: S.String,
  description: S.optional(S.String),
  definitionHash: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AutomatedReasoningPolicyDefinitionElement = S.Union(
  S.Struct({
    policyDefinitionVariable: AutomatedReasoningPolicyDefinitionVariable,
  }),
  S.Struct({ policyDefinitionType: AutomatedReasoningPolicyDefinitionType }),
  S.Struct({ policyDefinitionRule: AutomatedReasoningPolicyDefinitionRule }),
);
export class AutomatedReasoningPolicyBuildStepMessage extends S.Class<AutomatedReasoningPolicyBuildStepMessage>(
  "AutomatedReasoningPolicyBuildStepMessage",
)({ message: S.String, messageType: S.String }) {}
export const AutomatedReasoningPolicyBuildStepMessageList = S.Array(
  AutomatedReasoningPolicyBuildStepMessage,
);
export class StartAutomatedReasoningPolicyBuildWorkflowResponse extends S.Class<StartAutomatedReasoningPolicyBuildWorkflowResponse>(
  "StartAutomatedReasoningPolicyBuildWorkflowResponse",
)({ policyArn: S.String, buildWorkflowId: S.String }) {}
export class UpdateAutomatedReasoningPolicyAnnotationsRequest extends S.Class<UpdateAutomatedReasoningPolicyAnnotationsRequest>(
  "UpdateAutomatedReasoningPolicyAnnotationsRequest",
)(
  {
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    annotations: AutomatedReasoningPolicyAnnotationList,
    lastUpdatedAnnotationSetHash: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/annotations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEvaluationJobsResponse extends S.Class<ListEvaluationJobsResponse>(
  "ListEvaluationJobsResponse",
)({
  nextToken: S.optional(S.String),
  jobSummaries: S.optional(EvaluationSummaries),
}) {}
export class CreateModelCustomizationJobRequest extends S.Class<CreateModelCustomizationJobRequest>(
  "CreateModelCustomizationJobRequest",
)(
  {
    jobName: S.String,
    customModelName: S.String,
    roleArn: S.String,
    clientRequestToken: S.optional(S.String),
    baseModelIdentifier: S.String,
    customizationType: S.optional(S.String),
    customModelKmsKeyId: S.optional(S.String),
    jobTags: S.optional(TagList),
    customModelTags: S.optional(TagList),
    trainingDataConfig: TrainingDataConfig,
    validationDataConfig: S.optional(ValidationDataConfig),
    outputDataConfig: OutputDataConfig,
    hyperParameters: S.optional(ModelCustomizationHyperParameters),
    vpcConfig: S.optional(VpcConfig),
    customizationConfig: S.optional(CustomizationConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/model-customization-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TermDetails extends S.Class<TermDetails>("TermDetails")({
  usageBasedPricingTerm: PricingTerm,
  legalTerm: LegalTerm,
  supportTerm: SupportTerm,
  validityTerm: S.optional(ValidityTerm),
}) {}
export class Offer extends S.Class<Offer>("Offer")({
  offerId: S.optional(S.String),
  offerToken: S.String,
  termDetails: TermDetails,
}) {}
export const Offers = S.Array(Offer);
export class UpdateAutomatedReasoningPolicyAnnotationsResponse extends S.Class<UpdateAutomatedReasoningPolicyAnnotationsResponse>(
  "UpdateAutomatedReasoningPolicyAnnotationsResponse",
)({
  policyArn: S.String,
  buildWorkflowId: S.String,
  annotationSetHash: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListFoundationModelAgreementOffersResponse extends S.Class<ListFoundationModelAgreementOffersResponse>(
  "ListFoundationModelAgreementOffersResponse",
)({ modelId: S.String, offers: Offers }) {}
export class CreateModelCustomizationJobResponse extends S.Class<CreateModelCustomizationJobResponse>(
  "CreateModelCustomizationJobResponse",
)({ jobArn: S.String }) {}
export class AutomatedReasoningPolicyAddTypeMutation extends S.Class<AutomatedReasoningPolicyAddTypeMutation>(
  "AutomatedReasoningPolicyAddTypeMutation",
)({ type: AutomatedReasoningPolicyDefinitionType }) {}
export class AutomatedReasoningPolicyUpdateTypeMutation extends S.Class<AutomatedReasoningPolicyUpdateTypeMutation>(
  "AutomatedReasoningPolicyUpdateTypeMutation",
)({ type: AutomatedReasoningPolicyDefinitionType }) {}
export class AutomatedReasoningPolicyDeleteTypeMutation extends S.Class<AutomatedReasoningPolicyDeleteTypeMutation>(
  "AutomatedReasoningPolicyDeleteTypeMutation",
)({ name: S.String }) {}
export class AutomatedReasoningPolicyAddVariableMutation extends S.Class<AutomatedReasoningPolicyAddVariableMutation>(
  "AutomatedReasoningPolicyAddVariableMutation",
)({ variable: AutomatedReasoningPolicyDefinitionVariable }) {}
export class AutomatedReasoningPolicyUpdateVariableMutation extends S.Class<AutomatedReasoningPolicyUpdateVariableMutation>(
  "AutomatedReasoningPolicyUpdateVariableMutation",
)({ variable: AutomatedReasoningPolicyDefinitionVariable }) {}
export class AutomatedReasoningPolicyDeleteVariableMutation extends S.Class<AutomatedReasoningPolicyDeleteVariableMutation>(
  "AutomatedReasoningPolicyDeleteVariableMutation",
)({ name: S.String }) {}
export class AutomatedReasoningPolicyAddRuleMutation extends S.Class<AutomatedReasoningPolicyAddRuleMutation>(
  "AutomatedReasoningPolicyAddRuleMutation",
)({ rule: AutomatedReasoningPolicyDefinitionRule }) {}
export class AutomatedReasoningPolicyUpdateRuleMutation extends S.Class<AutomatedReasoningPolicyUpdateRuleMutation>(
  "AutomatedReasoningPolicyUpdateRuleMutation",
)({ rule: AutomatedReasoningPolicyDefinitionRule }) {}
export class AutomatedReasoningPolicyDeleteRuleMutation extends S.Class<AutomatedReasoningPolicyDeleteRuleMutation>(
  "AutomatedReasoningPolicyDeleteRuleMutation",
)({ id: S.String }) {}
export const AutomatedReasoningPolicyMutation = S.Union(
  S.Struct({ addType: AutomatedReasoningPolicyAddTypeMutation }),
  S.Struct({ updateType: AutomatedReasoningPolicyUpdateTypeMutation }),
  S.Struct({ deleteType: AutomatedReasoningPolicyDeleteTypeMutation }),
  S.Struct({ addVariable: AutomatedReasoningPolicyAddVariableMutation }),
  S.Struct({ updateVariable: AutomatedReasoningPolicyUpdateVariableMutation }),
  S.Struct({ deleteVariable: AutomatedReasoningPolicyDeleteVariableMutation }),
  S.Struct({ addRule: AutomatedReasoningPolicyAddRuleMutation }),
  S.Struct({ updateRule: AutomatedReasoningPolicyUpdateRuleMutation }),
  S.Struct({ deleteRule: AutomatedReasoningPolicyDeleteRuleMutation }),
);
export const AutomatedReasoningPolicyBuildStepContext = S.Union(
  S.Struct({ planning: AutomatedReasoningPolicyPlanning }),
  S.Struct({ mutation: AutomatedReasoningPolicyMutation }),
);
export class GetAutomatedReasoningPolicyTestResultResponse extends S.Class<GetAutomatedReasoningPolicyTestResultResponse>(
  "GetAutomatedReasoningPolicyTestResultResponse",
)({ testResult: AutomatedReasoningPolicyTestResult }) {}
export class AutomatedReasoningPolicyBuildStep extends S.Class<AutomatedReasoningPolicyBuildStep>(
  "AutomatedReasoningPolicyBuildStep",
)({
  context: AutomatedReasoningPolicyBuildStepContext,
  priorElement: S.optional(AutomatedReasoningPolicyDefinitionElement),
  messages: AutomatedReasoningPolicyBuildStepMessageList,
}) {}
export const AutomatedReasoningPolicyBuildStepList = S.Array(
  AutomatedReasoningPolicyBuildStep,
);
export class AutomatedReasoningPolicyBuildLogEntry extends S.Class<AutomatedReasoningPolicyBuildLogEntry>(
  "AutomatedReasoningPolicyBuildLogEntry",
)({
  annotation: AutomatedReasoningPolicyAnnotation,
  status: S.String,
  buildSteps: AutomatedReasoningPolicyBuildStepList,
}) {}
export const AutomatedReasoningPolicyBuildLogEntryList = S.Array(
  AutomatedReasoningPolicyBuildLogEntry,
);
export class AutomatedReasoningPolicyBuildLog extends S.Class<AutomatedReasoningPolicyBuildLog>(
  "AutomatedReasoningPolicyBuildLog",
)({ entries: AutomatedReasoningPolicyBuildLogEntryList }) {}
export const AutomatedReasoningPolicyBuildResultAssets = S.Union(
  S.Struct({ policyDefinition: AutomatedReasoningPolicyDefinition }),
  S.Struct({ qualityReport: AutomatedReasoningPolicyDefinitionQualityReport }),
  S.Struct({ buildLog: AutomatedReasoningPolicyBuildLog }),
  S.Struct({ generatedTestCases: AutomatedReasoningPolicyGeneratedTestCases }),
  S.Struct({ policyScenarios: AutomatedReasoningPolicyScenarios }),
);
export class GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse extends S.Class<GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse>(
  "GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse",
)({
  policyArn: S.String,
  buildWorkflowId: S.String,
  buildWorkflowAssets: S.optional(AutomatedReasoningPolicyBuildResultAssets),
}) {}
export class CreateEvaluationJobRequest extends S.Class<CreateEvaluationJobRequest>(
  "CreateEvaluationJobRequest",
)(
  {
    jobName: S.String,
    jobDescription: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    roleArn: S.String,
    customerEncryptionKeyId: S.optional(S.String),
    jobTags: S.optional(TagList),
    applicationType: S.optional(S.String),
    evaluationConfig: EvaluationConfig,
    inferenceConfig: EvaluationInferenceConfig,
    outputDataConfig: EvaluationOutputDataConfig,
  },
  T.all(
    T.Http({ method: "POST", uri: "/evaluation-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEvaluationJobResponse extends S.Class<CreateEvaluationJobResponse>(
  "CreateEvaluationJobResponse",
)({ jobArn: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}

//# Operations
/**
 * Delete the invocation logging.
 */
export const deleteModelInvocationLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteModelInvocationLoggingConfigurationRequest,
    output: DeleteModelInvocationLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
    ],
  }));
/**
 * Get the current configuration values for model invocation logging.
 */
export const getModelInvocationLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetModelInvocationLoggingConfigurationRequest,
    output: GetModelInvocationLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves details about an Automated Reasoning policy or policy version. Returns information including the policy definition, metadata, and timestamps.
 */
export const getAutomatedReasoningPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAutomatedReasoningPolicyRequest,
    output: GetAutomatedReasoningPolicyResponse,
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
 * Registers an existing Amazon SageMaker endpoint with Amazon Bedrock Marketplace, allowing it to be used with Amazon Bedrock APIs.
 */
export const registerMarketplaceModelEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterMarketplaceModelEndpointRequest,
    output: RegisterMarketplaceModelEndpointResponse,
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
 * Copies a model to another region so that it can be used there. For more information, see Copy models to be used in other regions in the Amazon Bedrock User Guide.
 */
export const createModelCopyJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelCopyJobRequest,
  output: CreateModelCopyJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a model import job to import model that you have customized in other environments, such as Amazon SageMaker. For more information, see Import a customized model
 */
export const createModelImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateModelImportJobRequest,
    output: CreateModelImportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      TooManyTagsException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a prompt router that manages the routing of requests between multiple foundation models based on the routing criteria.
 */
export const createPromptRouter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePromptRouterRequest,
  output: CreatePromptRouterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Lists test results for an Automated Reasoning policy, showing how the policy performed against various test scenarios and validation checks.
 */
export const listAutomatedReasoningPolicyTestResults =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAutomatedReasoningPolicyTestResultsRequest,
    output: ListAutomatedReasoningPolicyTestResultsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "testResults",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Deploys a custom model for on-demand inference in Amazon Bedrock. After you deploy your custom model, you use the deployment's Amazon Resource Name (ARN) as the `modelId` parameter when you submit prompts and generate responses with model inference.
 *
 * For more information about setting up on-demand inference for custom models, see Set up inference for a custom model.
 *
 * The following actions are related to the `CreateCustomModelDeployment` operation:
 *
 * - GetCustomModelDeployment
 *
 * - ListCustomModelDeployments
 *
 * - DeleteCustomModelDeployment
 */
export const createCustomModelDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCustomModelDeploymentRequest,
    output: CreateCustomModelDeploymentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      TooManyTagsException,
      ValidationException,
    ],
  }),
);
/**
 * Creates dedicated throughput for a base or custom model with the model units and for the duration that you specify. For pricing details, see Amazon Bedrock Pricing. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const createProvisionedModelThroughput =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateProvisionedModelThroughputRequest,
    output: CreateProvisionedModelThroughputResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      TooManyTagsException,
      ValidationException,
    ],
  }));
/**
 * Creates a test for an Automated Reasoning policy. Tests validate that your policy works as expected by providing sample inputs and expected outcomes. Use tests to verify policy behavior before deploying to production.
 */
export const createAutomatedReasoningPolicyTestCase =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAutomatedReasoningPolicyTestCaseRequest,
    output: CreateAutomatedReasoningPolicyTestCaseResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a new version of an existing Automated Reasoning policy. This allows you to iterate on your policy rules while maintaining previous versions for rollback or comparison purposes.
 */
export const createAutomatedReasoningPolicyVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAutomatedReasoningPolicyVersionRequest,
    output: CreateAutomatedReasoningPolicyVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      TooManyTagsException,
      ValidationException,
    ],
  }));
/**
 * Updates the configuration of an existing endpoint for a model from Amazon Bedrock Marketplace.
 */
export const updateMarketplaceModelEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateMarketplaceModelEndpointRequest,
    output: UpdateMarketplaceModelEndpointResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates a guardrail with the values you specify.
 *
 * - Specify a `name` and optional `description`.
 *
 * - Specify messages for when the guardrail successfully blocks a prompt or a model response in the `blockedInputMessaging` and `blockedOutputsMessaging` fields.
 *
 * - Specify topics for the guardrail to deny in the `topicPolicyConfig` object. Each GuardrailTopicConfig object in the `topicsConfig` list pertains to one topic.
 *
 * - Give a `name` and `description` so that the guardrail can properly identify the topic.
 *
 * - Specify `DENY` in the `type` field.
 *
 * - (Optional) Provide up to five prompts that you would categorize as belonging to the topic in the `examples` list.
 *
 * - Specify filter strengths for the harmful categories defined in Amazon Bedrock in the `contentPolicyConfig` object. Each GuardrailContentFilterConfig object in the `filtersConfig` list pertains to a harmful category. For more information, see Content filters. For more information about the fields in a content filter, see GuardrailContentFilterConfig.
 *
 * - Specify the category in the `type` field.
 *
 * - Specify the strength of the filter for prompts in the `inputStrength` field and for model responses in the `strength` field of the GuardrailContentFilterConfig.
 *
 * - (Optional) For security, include the ARN of a KMS key in the `kmsKeyId` field.
 */
export const updateGuardrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGuardrailRequest,
  output: UpdateGuardrailResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a version of the guardrail. Use this API to create a snapshot of the guardrail when you are satisfied with a configuration, or to compare the configuration with another version.
 */
export const createGuardrailVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateGuardrailVersionRequest,
    output: CreateGuardrailVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an endpoint for a model from Amazon Bedrock Marketplace. The endpoint is hosted by Amazon SageMaker.
 */
export const createMarketplaceModelEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateMarketplaceModelEndpointRequest,
    output: CreateMarketplaceModelEndpointResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a new custom model in Amazon Bedrock. After the model is active, you can use it for inference.
 *
 * To use the model for inference, you must purchase Provisioned Throughput for it. You can't use On-demand inference with these custom models. For more information about Provisioned Throughput, see Provisioned Throughput.
 *
 * The model appears in `ListCustomModels` with a `customizationType` of `imported`. To track the status of the new model, you use the `GetCustomModel` API operation. The model can be in the following states:
 *
 * - `Creating` - Initial state during validation and registration
 *
 * - `Active` - Model is ready for use in inference
 *
 * - `Failed` - Creation process encountered an error
 *
 * **Related APIs**
 *
 * - GetCustomModel
 *
 * - ListCustomModels
 *
 * - DeleteCustomModel
 */
export const createCustomModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomModelRequest,
  output: CreateCustomModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates a guardrail to block topics and to implement safeguards for your generative AI applications.
 *
 * You can configure the following policies in a guardrail to avoid undesirable and harmful content, filter out denied topics and words, and remove sensitive information for privacy protection.
 *
 * - **Content filters** - Adjust filter strengths to block input prompts or model responses containing harmful content.
 *
 * - **Denied topics** - Define a set of topics that are undesirable in the context of your application. These topics will be blocked if detected in user queries or model responses.
 *
 * - **Word filters** - Configure filters to block undesirable words, phrases, and profanity. Such words can include offensive terms, competitor names etc.
 *
 * - **Sensitive information filters** - Block or mask sensitive information such as personally identifiable information (PII) or custom regex in user inputs and model responses.
 *
 * In addition to the above policies, you can also configure the messages to be returned to the user if a user input or model response is in violation of the policies defined in the guardrail.
 *
 * For more information, see Amazon Bedrock Guardrails in the *Amazon Bedrock User Guide*.
 */
export const createGuardrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGuardrailRequest,
  output: CreateGuardrailResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Exports the policy definition for an Automated Reasoning policy version. Returns the complete policy definition including rules, variables, and custom variable types in a structured format.
 */
export const exportAutomatedReasoningPolicyVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportAutomatedReasoningPolicyVersionRequest,
    output: ExportAutomatedReasoningPolicyVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the current annotations for an Automated Reasoning policy build workflow. Annotations contain corrections to the rules, variables and types to be applied to the policy.
 */
export const getAutomatedReasoningPolicyAnnotations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAutomatedReasoningPolicyAnnotationsRequest,
    output: GetAutomatedReasoningPolicyAnnotationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves detailed information about an Automated Reasoning policy build workflow, including its status, configuration, and metadata.
 */
export const getAutomatedReasoningPolicyBuildWorkflow =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAutomatedReasoningPolicyBuildWorkflowRequest,
    output: GetAutomatedReasoningPolicyBuildWorkflowResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists tests for an Automated Reasoning policy. We recommend using pagination to ensure that the operation returns quickly and successfully.
 */
export const listAutomatedReasoningPolicyTestCases =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAutomatedReasoningPolicyTestCasesRequest,
    output: ListAutomatedReasoningPolicyTestCasesResponse,
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
      items: "testCases",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Updates a custom model deployment with a new custom model. This allows you to deploy updated models without creating new deployment endpoints.
 */
export const updateCustomModelDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCustomModelDeploymentRequest,
    output: UpdateCustomModelDeploymentResponse,
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
 * Gets information about an evaluation job, such as the status of the job.
 */
export const getEvaluationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEvaluationJobRequest,
  output: GetEvaluationJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a model copy job. For more information, see Copy models to be used in other regions in the Amazon Bedrock User Guide.
 */
export const getModelCopyJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelCopyJobRequest,
  output: GetModelCopyJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a custom model that you imported earlier. For more information, see Import a customized model in the Amazon Bedrock User Guide.
 */
export const deleteImportedModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImportedModelRequest,
  output: DeleteImportedModelResponse,
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
 * Retrieves the properties associated with import model job, including the status of the job. For more information, see Import a customized model in the Amazon Bedrock User Guide.
 */
export const getModelImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelImportJobRequest,
  output: GetModelImportJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets details about a batch inference job. For more information, see Monitor batch inference jobs
 */
export const getModelInvocationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetModelInvocationJobRequest,
    output: GetModelInvocationJobResponse,
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
 * Retrieves details about a prompt router.
 */
export const getPromptRouter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPromptRouterRequest,
  output: GetPromptRouterResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns details for a Provisioned Throughput. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const getProvisionedModelThroughput =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetProvisionedModelThroughputRequest,
    output: GetProvisionedModelThroughputResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Request a model access agreement for the specified model.
 */
export const createFoundationModelAgreement =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateFoundationModelAgreementRequest,
    output: CreateFoundationModelAgreementResponse,
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
 * List the tags associated with the specified resource.
 *
 * For more information, see Tagging resources in the Amazon Bedrock User Guide.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a specified prompt router. This action cannot be undone.
 */
export const deletePromptRouter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePromptRouterRequest,
  output: DeletePromptRouterResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the name or associated model for a Provisioned Throughput. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const updateProvisionedModelThroughput =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateProvisionedModelThroughputRequest,
    output: UpdateProvisionedModelThroughputResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Remove one or more tags from a resource. For more information, see Tagging resources in the Amazon Bedrock User Guide.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels a running Automated Reasoning policy build workflow. This stops the policy generation process and prevents further processing of the source documents.
 */
export const cancelAutomatedReasoningPolicyBuildWorkflow =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelAutomatedReasoningPolicyBuildWorkflowRequest,
    output: CancelAutomatedReasoningPolicyBuildWorkflowResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes an endpoint for a model from Amazon Bedrock Marketplace.
 */
export const deleteMarketplaceModelEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteMarketplaceModelEndpointRequest,
    output: DeleteMarketplaceModelEndpointResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes the account-level enforced guardrail configuration.
 */
export const deleteEnforcedGuardrailConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteEnforcedGuardrailConfigurationRequest,
    output: DeleteEnforcedGuardrailConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Stops a batch inference job. You're only charged for tokens that were already processed. For more information, see Stop a batch inference job.
 */
export const stopModelInvocationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopModelInvocationJobRequest,
    output: StopModelInvocationJobResponse,
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
 * Deletes a Provisioned Throughput. You can't delete a Provisioned Throughput before the commitment term is over. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const deleteProvisionedModelThroughput =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteProvisionedModelThroughputRequest,
    output: DeleteProvisionedModelThroughputResponse,
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
 * Delete the model access agreement for the specified model.
 */
export const deleteFoundationModelAgreement =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteFoundationModelAgreementRequest,
    output: DeleteFoundationModelAgreementResponse,
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
 * Stops an active model customization job. For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const stopModelCustomizationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopModelCustomizationJobRequest,
    output: StopModelCustomizationJobResponse,
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
 * Deletes a custom model deployment. This operation stops the deployment and removes it from your account. After deletion, the deployment ARN can no longer be used for inference requests.
 *
 * The following actions are related to the `DeleteCustomModelDeployment` operation:
 *
 * - CreateCustomModelDeployment
 *
 * - GetCustomModelDeployment
 *
 * - ListCustomModelDeployments
 */
export const deleteCustomModelDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCustomModelDeploymentRequest,
    output: DeleteCustomModelDeploymentResponse,
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
 * Deletes a custom model that you created earlier. For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const deleteCustomModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomModelRequest,
  output: DeleteCustomModelResponse,
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
 * Stops an evaluation job that is current being created or running.
 */
export const stopEvaluationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopEvaluationJobRequest,
  output: StopEvaluationJobResponse,
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
 * Deletes a guardrail.
 *
 * - To delete a guardrail, only specify the ARN of the guardrail in the `guardrailIdentifier` field. If you delete a guardrail, all of its versions will be deleted.
 *
 * - To delete a version of a guardrail, specify the ARN of the guardrail in the `guardrailIdentifier` field and the version in the `guardrailVersion` field.
 */
export const deleteGuardrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGuardrailRequest,
  output: DeleteGuardrailResponse,
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
 * Deletes an application inference profile. For more information, see Increase throughput and resilience with cross-region inference in Amazon Bedrock. in the Amazon Bedrock User Guide.
 */
export const deleteInferenceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInferenceProfileRequest,
    output: DeleteInferenceProfileResponse,
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
 * Deletes an Automated Reasoning policy or policy version. This operation is idempotent. If you delete a policy more than once, each call succeeds. Deleting a policy removes it permanently and cannot be undone.
 */
export const deleteAutomatedReasoningPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAutomatedReasoningPolicyRequest,
    output: DeleteAutomatedReasoningPolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes an Automated Reasoning policy build workflow and its associated artifacts. This permanently removes the workflow history and any generated assets.
 */
export const deleteAutomatedReasoningPolicyBuildWorkflow =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAutomatedReasoningPolicyBuildWorkflowRequest,
    output: DeleteAutomatedReasoningPolicyBuildWorkflowResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes an Automated Reasoning policy test. This operation is idempotent; if you delete a test more than once, each call succeeds.
 */
export const deleteAutomatedReasoningPolicyTestCase =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAutomatedReasoningPolicyTestCaseRequest,
    output: DeleteAutomatedReasoningPolicyTestCaseResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates an existing Automated Reasoning policy test. You can modify the content, query, expected result, and confidence threshold.
 */
export const updateAutomatedReasoningPolicyTestCase =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAutomatedReasoningPolicyTestCaseRequest,
    output: UpdateAutomatedReasoningPolicyTestCaseResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Set the configuration values for model invocation logging.
 */
export const putModelInvocationLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutModelInvocationLoggingConfigurationRequest,
    output: PutModelInvocationLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Put usecase for model access.
 */
export const putUseCaseForModelAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutUseCaseForModelAccessRequest,
    output: PutUseCaseForModelAccessResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Get usecase for model access.
 */
export const getUseCaseForModelAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetUseCaseForModelAccessRequest,
    output: GetUseCaseForModelAccessResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all Automated Reasoning policies in your account, with optional filtering by policy ARN. This helps you manage and discover existing policies.
 */
export const listAutomatedReasoningPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAutomatedReasoningPoliciesRequest,
    output: ListAutomatedReasoningPoliciesResponse,
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
      items: "automatedReasoningPolicySummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves the next test scenario for validating an Automated Reasoning policy. This is used during the interactive policy refinement process to test policy behavior.
 */
export const getAutomatedReasoningPolicyNextScenario =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAutomatedReasoningPolicyNextScenarioRequest,
    output: GetAutomatedReasoningPolicyNextScenarioResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves details about a specific Automated Reasoning policy test.
 */
export const getAutomatedReasoningPolicyTestCase =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAutomatedReasoningPolicyTestCaseRequest,
    output: GetAutomatedReasoningPolicyTestCaseResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists all build workflows for an Automated Reasoning policy, showing the history of policy creation and modification attempts.
 */
export const listAutomatedReasoningPolicyBuildWorkflows =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAutomatedReasoningPolicyBuildWorkflowsRequest,
    output: ListAutomatedReasoningPolicyBuildWorkflowsResponse,
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
      items: "automatedReasoningPolicyBuildWorkflowSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Initiates a test workflow to validate Automated Reasoning policy tests. The workflow executes the specified tests against the policy and generates validation results.
 */
export const startAutomatedReasoningPolicyTestWorkflow =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartAutomatedReasoningPolicyTestWorkflowRequest,
    output: StartAutomatedReasoningPolicyTestWorkflowResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves details about a specific endpoint for a model from Amazon Bedrock Marketplace.
 */
export const getMarketplaceModelEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMarketplaceModelEndpointRequest,
    output: GetMarketplaceModelEndpointResponse,
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
 * Lists the endpoints for models from Amazon Bedrock Marketplace in your Amazon Web Services account.
 */
export const listMarketplaceModelEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMarketplaceModelEndpointsRequest,
    output: ListMarketplaceModelEndpointsResponse,
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
      items: "marketplaceModelEndpoints",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves information about a custom model deployment, including its status, configuration, and metadata. Use this operation to monitor the deployment status and retrieve details needed for inference requests.
 *
 * The following actions are related to the `GetCustomModelDeployment` operation:
 *
 * - CreateCustomModelDeployment
 *
 * - ListCustomModelDeployments
 *
 * - DeleteCustomModelDeployment
 */
export const getCustomModelDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCustomModelDeploymentRequest,
    output: GetCustomModelDeploymentResponse,
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
 * Lists custom model deployments in your account. You can filter the results by creation time, name, status, and associated model. Use this operation to manage and monitor your custom model deployments.
 *
 * We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * The following actions are related to the `ListCustomModelDeployments` operation:
 *
 * - CreateCustomModelDeployment
 *
 * - GetCustomModelDeployment
 *
 * - DeleteCustomModelDeployment
 */
export const listCustomModelDeployments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCustomModelDeploymentsRequest,
    output: ListCustomModelDeploymentsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "modelDeploymentSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Get the properties associated with a Amazon Bedrock custom model that you have created. For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const getCustomModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomModelRequest,
  output: GetCustomModelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the custom models that you have created with the `CreateModelCustomizationJob` operation.
 *
 * For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const listCustomModels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCustomModelsRequest,
    output: ListCustomModelsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "modelSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the account-level enforced guardrail configurations.
 */
export const listEnforcedGuardrailsConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnforcedGuardrailsConfigurationRequest,
    output: ListEnforcedGuardrailsConfigurationResponse,
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
      items: "guardrailsConfig",
    } as const,
  }));
/**
 * Sets the account-level enforced guardrail configuration.
 */
export const putEnforcedGuardrailConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutEnforcedGuardrailConfigurationRequest,
    output: PutEnforcedGuardrailConfigurationResponse,
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
 * Deletes a batch of evaluation jobs. An evaluation job can only be deleted if it has following status `FAILED`, `COMPLETED`, and `STOPPED`. You can request up to 25 model evaluation jobs be deleted in a single request.
 */
export const batchDeleteEvaluationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteEvaluationJobRequest,
    output: BatchDeleteEvaluationJobResponse,
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
 * Lists details about all the guardrails in an account. To list the `DRAFT` version of all your guardrails, don't specify the `guardrailIdentifier` field. To list all versions of a guardrail, specify the ARN of the guardrail in the `guardrailIdentifier` field.
 *
 * You can set the maximum number of results to return in a response in the `maxResults` field. If there are more results than the number you set, the response returns a `nextToken` that you can send in another `ListGuardrails` request to see the next batch of results.
 */
export const listGuardrails = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGuardrailsRequest,
    output: ListGuardrailsResponse,
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
      items: "guardrails",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets information about an inference profile. For more information, see Increase throughput and resilience with cross-region inference in Amazon Bedrock. in the Amazon Bedrock User Guide.
 */
export const getInferenceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInferenceProfileRequest,
  output: GetInferenceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of inference profiles that you can use. For more information, see Increase throughput and resilience with cross-region inference in Amazon Bedrock. in the Amazon Bedrock User Guide.
 */
export const listInferenceProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListInferenceProfilesRequest,
    output: ListInferenceProfilesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "inferenceProfileSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of model copy jobs that you have submitted. You can filter the jobs to return based on one or more criteria. For more information, see Copy models to be used in other regions in the Amazon Bedrock User Guide.
 */
export const listModelCopyJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListModelCopyJobsRequest,
    output: ListModelCopyJobsResponse,
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
      items: "modelCopyJobSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets properties associated with a customized model you imported.
 */
export const getImportedModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportedModelRequest,
  output: GetImportedModelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of models you've imported. You can filter the results to return based on one or more criteria. For more information, see Import a customized model in the Amazon Bedrock User Guide.
 */
export const listImportedModels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImportedModelsRequest,
    output: ListImportedModelsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "modelSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of import jobs you've submitted. You can filter the results to return based on one or more criteria. For more information, see Import a customized model in the Amazon Bedrock User Guide.
 */
export const listModelImportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListModelImportJobsRequest,
    output: ListModelImportJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "modelImportJobSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all batch inference jobs in the account. For more information, see View details about a batch inference job.
 */
export const listModelInvocationJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListModelInvocationJobsRequest,
    output: ListModelInvocationJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "invocationJobSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists Amazon Bedrock foundation models that you can use. You can filter the results with the request parameters. For more information, see Foundation models in the Amazon Bedrock User Guide.
 */
export const listFoundationModels = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFoundationModelsRequest,
    output: ListFoundationModelsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of prompt routers.
 */
export const listPromptRouters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPromptRoutersRequest,
    output: ListPromptRoutersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "promptRouterSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the Provisioned Throughputs in the account. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const listProvisionedModelThroughputs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProvisionedModelThroughputsRequest,
    output: ListProvisionedModelThroughputsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "provisionedModelSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Get information about the Foundation model availability.
 */
export const getFoundationModelAvailability =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFoundationModelAvailabilityRequest,
    output: GetFoundationModelAvailabilityResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of model customization jobs that you have submitted. You can filter the jobs to return based on one or more criteria.
 *
 * For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const listModelCustomizationJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListModelCustomizationJobsRequest,
    output: ListModelCustomizationJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "modelCustomizationJobSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets details about a guardrail. If you don't specify a version, the response returns details for the `DRAFT` version.
 */
export const getGuardrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGuardrailRequest,
  output: GetGuardrailResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a batch inference job to invoke a model on multiple prompts. Format your data according to Format your inference data and upload it to an Amazon S3 bucket. For more information, see Process multiple prompts with batch inference.
 *
 * The response returns a `jobArn` that you can use to stop or get details about the job.
 */
export const createModelInvocationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateModelInvocationJobRequest,
    output: CreateModelInvocationJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Get details about a Amazon Bedrock foundation model.
 */
export const getFoundationModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFoundationModelRequest,
  output: GetFoundationModelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the properties associated with a model-customization job, including the status of the job. For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const getModelCustomizationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetModelCustomizationJobRequest,
    output: GetModelCustomizationJobResponse,
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
 * Deregisters an endpoint for a model from Amazon Bedrock Marketplace. This operation removes the endpoint's association with Amazon Bedrock but does not delete the underlying Amazon SageMaker endpoint.
 */
export const deregisterMarketplaceModelEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterMarketplaceModelEndpointRequest,
    output: DeregisterMarketplaceModelEndpointResponse,
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
 * Associate tags with a resource. For more information, see Tagging resources in the Amazon Bedrock User Guide.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Updates an existing Automated Reasoning policy with new rules, variables, or configuration. This creates a new version of the policy while preserving the previous version.
 */
export const updateAutomatedReasoningPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAutomatedReasoningPolicyRequest,
    output: UpdateAutomatedReasoningPolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      TooManyTagsException,
      ValidationException,
    ],
  }));
/**
 * Creates an application inference profile to track metrics and costs when invoking a model. To create an application inference profile for a foundation model in one region, specify the ARN of the model in that region. To create an application inference profile for a foundation model across multiple regions, specify the ARN of the system-defined inference profile that contains the regions that you want to route requests to. For more information, see Increase throughput and resilience with cross-region inference in Amazon Bedrock. in the Amazon Bedrock User Guide.
 */
export const createInferenceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateInferenceProfileRequest,
    output: CreateInferenceProfileResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      TooManyTagsException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an Automated Reasoning policy for Amazon Bedrock Guardrails. Automated Reasoning policies use mathematical techniques to detect hallucinations, suggest corrections, and highlight unstated assumptions in the responses of your GenAI application.
 *
 * To create a policy, you upload a source document that describes the rules that you're encoding. Automated Reasoning extracts important concepts from the source document that will become variables in the policy and infers policy rules.
 */
export const createAutomatedReasoningPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAutomatedReasoningPolicyRequest,
    output: CreateAutomatedReasoningPolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      TooManyTagsException,
      ValidationException,
    ],
  }));
/**
 * Starts a new build workflow for an Automated Reasoning policy. This initiates the process of analyzing source documents and generating policy rules, variables, and types.
 */
export const startAutomatedReasoningPolicyBuildWorkflow =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartAutomatedReasoningPolicyBuildWorkflowRequest,
    output: StartAutomatedReasoningPolicyBuildWorkflowResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists all existing evaluation jobs.
 */
export const listEvaluationJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEvaluationJobsRequest,
    output: ListEvaluationJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "jobSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates the annotations for an Automated Reasoning policy build workflow. This allows you to modify extracted rules, variables, and types before finalizing the policy.
 */
export const updateAutomatedReasoningPolicyAnnotations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAutomatedReasoningPolicyAnnotationsRequest,
    output: UpdateAutomatedReasoningPolicyAnnotationsResponse,
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
 * Get the offers associated with the specified model.
 */
export const listFoundationModelAgreementOffers =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListFoundationModelAgreementOffersRequest,
    output: ListFoundationModelAgreementOffersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a fine-tuning job to customize a base model.
 *
 * You specify the base foundation model and the location of the training data. After the model-customization job completes successfully, your custom model resource will be ready to use. Amazon Bedrock returns validation loss metrics and output generations after the job completes.
 *
 * For information on the format of training and validation data, see Prepare the datasets.
 *
 * Model-customization jobs are asynchronous and the completion time depends on the base model and the training/validation data size. To monitor a job, use the `GetModelCustomizationJob` operation to retrieve the job status.
 *
 * For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const createModelCustomizationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateModelCustomizationJobRequest,
    output: CreateModelCustomizationJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      TooManyTagsException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the test result for a specific Automated Reasoning policy test. Returns detailed validation findings and execution status.
 */
export const getAutomatedReasoningPolicyTestResult =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAutomatedReasoningPolicyTestResultRequest,
    output: GetAutomatedReasoningPolicyTestResultResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the resulting assets from a completed Automated Reasoning policy build workflow, including build logs, quality reports, and generated policy artifacts.
 */
export const getAutomatedReasoningPolicyBuildWorkflowResultAssets =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest,
    output: GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates an evaluation job.
 */
export const createEvaluationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEvaluationJobRequest,
  output: CreateEvaluationJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

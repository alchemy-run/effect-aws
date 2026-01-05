import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Launch Wizard",
  serviceShapeName: "LaunchWizard",
});
const auth = T.AwsAuthSigv4({ name: "launchwizard" });
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
                                url: "https://launchwizard-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://launchwizard-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://launchwizard.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://launchwizard.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
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
export class GetDeploymentInput extends S.Class<GetDeploymentInput>(
  "GetDeploymentInput",
)(
  { deploymentId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/getDeployment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeploymentInput extends S.Class<DeleteDeploymentInput>(
  "DeleteDeploymentInput",
)(
  { deploymentId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/deleteDeployment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeploymentEventsInput extends S.Class<ListDeploymentEventsInput>(
  "ListDeploymentEventsInput",
)(
  {
    deploymentId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listDeploymentEvents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkloadInput extends S.Class<GetWorkloadInput>(
  "GetWorkloadInput",
)(
  { workloadName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/getWorkload" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkloadsInput extends S.Class<ListWorkloadsInput>(
  "ListWorkloadsInput",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/listWorkloads" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkloadDeploymentPatternInput extends S.Class<GetWorkloadDeploymentPatternInput>(
  "GetWorkloadDeploymentPatternInput",
)(
  { workloadName: S.String, deploymentPatternName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/getWorkloadDeploymentPattern" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkloadDeploymentPatternsInput extends S.Class<ListWorkloadDeploymentPatternsInput>(
  "ListWorkloadDeploymentPatternsInput",
)(
  {
    workloadName: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listWorkloadDeploymentPatterns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DeploymentFilterValues = S.Array(S.String);
export const Tags = S.Record({ key: S.String, value: S.String });
export const DeploymentSpecifications = S.Record({
  key: S.String,
  value: S.String,
});
export class DeploymentFilter extends S.Class<DeploymentFilter>(
  "DeploymentFilter",
)({ name: S.optional(S.String), values: S.optional(DeploymentFilterValues) }) {}
export const DeploymentFilterList = S.Array(DeploymentFilter);
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(Tags) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
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
export class CreateDeploymentInput extends S.Class<CreateDeploymentInput>(
  "CreateDeploymentInput",
)(
  {
    workloadName: S.String,
    deploymentPatternName: S.String,
    name: S.String,
    specifications: DeploymentSpecifications,
    dryRun: S.optional(S.Boolean),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/createDeployment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeploymentOutput extends S.Class<DeleteDeploymentOutput>(
  "DeleteDeploymentOutput",
)({ status: S.optional(S.String), statusReason: S.optional(S.String) }) {}
export class ListDeploymentsInput extends S.Class<ListDeploymentsInput>(
  "ListDeploymentsInput",
)(
  {
    filters: S.optional(DeploymentFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listDeployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeploymentData extends S.Class<DeploymentData>("DeploymentData")({
  name: S.optional(S.String),
  id: S.optional(S.String),
  workloadName: S.optional(S.String),
  patternName: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  specifications: S.optional(DeploymentSpecifications),
  resourceGroup: S.optional(S.String),
  deletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(Tags),
  deploymentArn: S.optional(S.String),
}) {}
export class DeploymentEventDataSummary extends S.Class<DeploymentEventDataSummary>(
  "DeploymentEventDataSummary",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DeploymentEventDataSummaryList = S.Array(
  DeploymentEventDataSummary,
);
export class WorkloadData extends S.Class<WorkloadData>("WorkloadData")({
  workloadName: S.optional(S.String),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  documentationUrl: S.optional(S.String),
  iconUrl: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
}) {}
export class WorkloadDataSummary extends S.Class<WorkloadDataSummary>(
  "WorkloadDataSummary",
)({ workloadName: S.optional(S.String), displayName: S.optional(S.String) }) {}
export const WorkloadDataSummaryList = S.Array(WorkloadDataSummary);
export class WorkloadDeploymentPatternDataSummary extends S.Class<WorkloadDeploymentPatternDataSummary>(
  "WorkloadDeploymentPatternDataSummary",
)({
  workloadName: S.optional(S.String),
  deploymentPatternName: S.optional(S.String),
  workloadVersionName: S.optional(S.String),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
}) {}
export const WorkloadDeploymentPatternDataSummaryList = S.Array(
  WorkloadDeploymentPatternDataSummary,
);
export const AllowedValues = S.Array(S.String);
export class CreateDeploymentOutput extends S.Class<CreateDeploymentOutput>(
  "CreateDeploymentOutput",
)({ deploymentId: S.optional(S.String) }) {}
export class GetDeploymentOutput extends S.Class<GetDeploymentOutput>(
  "GetDeploymentOutput",
)({ deployment: S.optional(DeploymentData) }) {}
export class ListDeploymentEventsOutput extends S.Class<ListDeploymentEventsOutput>(
  "ListDeploymentEventsOutput",
)({
  deploymentEvents: S.optional(DeploymentEventDataSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class GetWorkloadOutput extends S.Class<GetWorkloadOutput>(
  "GetWorkloadOutput",
)({ workload: S.optional(WorkloadData) }) {}
export class ListWorkloadsOutput extends S.Class<ListWorkloadsOutput>(
  "ListWorkloadsOutput",
)({
  workloads: S.optional(WorkloadDataSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListWorkloadDeploymentPatternsOutput extends S.Class<ListWorkloadDeploymentPatternsOutput>(
  "ListWorkloadDeploymentPatternsOutput",
)({
  workloadDeploymentPatterns: S.optional(
    WorkloadDeploymentPatternDataSummaryList,
  ),
  nextToken: S.optional(S.String),
}) {}
export class DeploymentDataSummary extends S.Class<DeploymentDataSummary>(
  "DeploymentDataSummary",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  workloadName: S.optional(S.String),
  patternName: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DeploymentDataSummaryList = S.Array(DeploymentDataSummary);
export class DeploymentConditionalField extends S.Class<DeploymentConditionalField>(
  "DeploymentConditionalField",
)({
  name: S.optional(S.String),
  value: S.optional(S.String),
  comparator: S.optional(S.String),
}) {}
export const SpecificationsConditionalData = S.Array(
  DeploymentConditionalField,
);
export class ListDeploymentsOutput extends S.Class<ListDeploymentsOutput>(
  "ListDeploymentsOutput",
)({
  deployments: S.optional(DeploymentDataSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class DeploymentSpecificationsField extends S.Class<DeploymentSpecificationsField>(
  "DeploymentSpecificationsField",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  allowedValues: S.optional(AllowedValues),
  required: S.optional(S.String),
  conditionals: S.optional(SpecificationsConditionalData),
}) {}
export const DeploymentSpecificationsData = S.Array(
  DeploymentSpecificationsField,
);
export class WorkloadDeploymentPatternData extends S.Class<WorkloadDeploymentPatternData>(
  "WorkloadDeploymentPatternData",
)({
  workloadName: S.optional(S.String),
  deploymentPatternName: S.optional(S.String),
  workloadVersionName: S.optional(S.String),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  specifications: S.optional(DeploymentSpecificationsData),
}) {}
export class GetWorkloadDeploymentPatternOutput extends S.Class<GetWorkloadDeploymentPatternOutput>(
  "GetWorkloadDeploymentPatternOutput",
)({ workloadDeploymentPattern: S.optional(WorkloadDeploymentPatternData) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ResourceLimitException extends S.TaggedError<ResourceLimitException>()(
  "ResourceLimitException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes the specified tags from the given resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the deployments that have been created.
 */
export const listDeployments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDeploymentsInput,
    output: ListDeploymentsOutput,
    errors: [InternalServerException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "deployments",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns information about the deployment.
 */
export const getDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentInput,
  output: GetDeploymentOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a deployment.
 */
export const deleteDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentInput,
  output: DeleteDeploymentOutput,
  errors: [
    InternalServerException,
    ResourceLimitException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the events of a deployment.
 */
export const listDeploymentEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDeploymentEventsInput,
    output: ListDeploymentEventsOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "deploymentEvents",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns information about a workload.
 */
export const getWorkload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkloadInput,
  output: GetWorkloadOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the available workload names. You can use the ListWorkloadDeploymentPatterns operation to discover the available deployment patterns for a given workload.
 */
export const listWorkloads = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkloadsInput,
    output: ListWorkloadsOutput,
    errors: [InternalServerException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workloads",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the workload deployment patterns for a given workload name. You can use the ListWorkloads operation to discover the available workload names.
 */
export const listWorkloadDeploymentPatterns =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkloadDeploymentPatternsInput,
    output: ListWorkloadDeploymentPatternsOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workloadDeploymentPatterns",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the tags associated with a specified resource.
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
 * Adds the specified tags to the given resource.
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
 * Creates a deployment for the given workload. Deployments created by this operation are
 * not available in the Launch Wizard console to use the `Clone deployment` action
 * on.
 */
export const createDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeploymentInput,
  output: CreateDeploymentOutput,
  errors: [
    InternalServerException,
    ResourceLimitException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns details for a given workload and deployment pattern, including the available
 * specifications. You can use the ListWorkloads
 * operation to discover the available workload names and the ListWorkloadDeploymentPatterns operation to discover the available deployment
 * pattern names of a given workload.
 */
export const getWorkloadDeploymentPattern =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetWorkloadDeploymentPatternInput,
    output: GetWorkloadDeploymentPatternOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));

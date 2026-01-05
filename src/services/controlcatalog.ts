import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ControlCatalog",
  serviceShapeName: "ControlCatalog",
});
const auth = T.AwsAuthSigv4({ name: "controlcatalog" });
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
                                url: "https://controlcatalog-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://controlcatalog-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://controlcatalog.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://controlcatalog.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetControlRequest extends S.Class<GetControlRequest>(
  "GetControlRequest",
)(
  { ControlArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-control" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainsRequest extends S.Class<ListDomainsRequest>(
  "ListDomainsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ControlArnFilterList = S.Array(S.String);
export const CommonControlArnFilterList = S.Array(S.String);
export const MappingTypeFilterList = S.Array(S.String);
export class ControlMappingFilter extends S.Class<ControlMappingFilter>(
  "ControlMappingFilter",
)({
  ControlArns: S.optional(ControlArnFilterList),
  CommonControlArns: S.optional(CommonControlArnFilterList),
  MappingTypes: S.optional(MappingTypeFilterList),
}) {}
export const ControlAliases = S.Array(S.String);
export const GovernedResources = S.Array(S.String);
export const ImplementationTypeFilterList = S.Array(S.String);
export const ImplementationIdentifierFilterList = S.Array(S.String);
export class ListControlMappingsRequest extends S.Class<ListControlMappingsRequest>(
  "ListControlMappingsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    Filter: S.optional(ControlMappingFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-control-mappings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ObjectiveResourceFilter extends S.Class<ObjectiveResourceFilter>(
  "ObjectiveResourceFilter",
)({ Arn: S.optional(S.String) }) {}
export const ObjectiveResourceFilterList = S.Array(ObjectiveResourceFilter);
export const DeployableRegions = S.Array(S.String);
export class ImplementationFilter extends S.Class<ImplementationFilter>(
  "ImplementationFilter",
)({
  Types: S.optional(ImplementationTypeFilterList),
  Identifiers: S.optional(ImplementationIdentifierFilterList),
}) {}
export class DomainResourceFilter extends S.Class<DomainResourceFilter>(
  "DomainResourceFilter",
)({ Arn: S.optional(S.String) }) {}
export const DomainResourceFilterList = S.Array(DomainResourceFilter);
export class CommonControlFilter extends S.Class<CommonControlFilter>(
  "CommonControlFilter",
)({ Objectives: S.optional(ObjectiveResourceFilterList) }) {}
export class RegionConfiguration extends S.Class<RegionConfiguration>(
  "RegionConfiguration",
)({ Scope: S.String, DeployableRegions: S.optional(DeployableRegions) }) {}
export class ImplementationDetails extends S.Class<ImplementationDetails>(
  "ImplementationDetails",
)({ Type: S.String, Identifier: S.optional(S.String) }) {}
export class ControlParameter extends S.Class<ControlParameter>(
  "ControlParameter",
)({ Name: S.String }) {}
export const ControlParameters = S.Array(ControlParameter);
export class ControlFilter extends S.Class<ControlFilter>("ControlFilter")({
  Implementations: S.optional(ImplementationFilter),
}) {}
export class DomainSummary extends S.Class<DomainSummary>("DomainSummary")({
  Arn: S.String,
  Name: S.String,
  Description: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const DomainSummaryList = S.Array(DomainSummary);
export class ObjectiveFilter extends S.Class<ObjectiveFilter>(
  "ObjectiveFilter",
)({ Domains: S.optional(DomainResourceFilterList) }) {}
export class ListCommonControlsRequest extends S.Class<ListCommonControlsRequest>(
  "ListCommonControlsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    CommonControlFilter: S.optional(CommonControlFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/common-controls" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetControlResponse extends S.Class<GetControlResponse>(
  "GetControlResponse",
)({
  Arn: S.String,
  Aliases: S.optional(ControlAliases),
  Name: S.String,
  Description: S.String,
  Behavior: S.String,
  Severity: S.optional(S.String),
  RegionConfiguration: RegionConfiguration,
  Implementation: S.optional(ImplementationDetails),
  Parameters: S.optional(ControlParameters),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  GovernedResources: S.optional(GovernedResources),
}) {}
export class ListControlsRequest extends S.Class<ListControlsRequest>(
  "ListControlsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    Filter: S.optional(ControlFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-controls" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainsResponse extends S.Class<ListDomainsResponse>(
  "ListDomainsResponse",
)({ Domains: DomainSummaryList, NextToken: S.optional(S.String) }) {}
export class ListObjectivesRequest extends S.Class<ListObjectivesRequest>(
  "ListObjectivesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ObjectiveFilter: S.optional(ObjectiveFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/objectives" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociatedDomainSummary extends S.Class<AssociatedDomainSummary>(
  "AssociatedDomainSummary",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }) {}
export class ObjectiveSummary extends S.Class<ObjectiveSummary>(
  "ObjectiveSummary",
)({
  Arn: S.String,
  Name: S.String,
  Description: S.String,
  Domain: AssociatedDomainSummary,
  CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ObjectiveSummaryList = S.Array(ObjectiveSummary);
export class FrameworkMappingDetails extends S.Class<FrameworkMappingDetails>(
  "FrameworkMappingDetails",
)({ Name: S.String, Item: S.String }) {}
export class CommonControlMappingDetails extends S.Class<CommonControlMappingDetails>(
  "CommonControlMappingDetails",
)({ CommonControlArn: S.String }) {}
export class RelatedControlMappingDetails extends S.Class<RelatedControlMappingDetails>(
  "RelatedControlMappingDetails",
)({ ControlArn: S.optional(S.String), RelationType: S.String }) {}
export class ListObjectivesResponse extends S.Class<ListObjectivesResponse>(
  "ListObjectivesResponse",
)({ Objectives: ObjectiveSummaryList, NextToken: S.optional(S.String) }) {}
export const Mapping = S.Union(
  S.Struct({ Framework: FrameworkMappingDetails }),
  S.Struct({ CommonControl: CommonControlMappingDetails }),
  S.Struct({ RelatedControl: RelatedControlMappingDetails }),
);
export class AssociatedObjectiveSummary extends S.Class<AssociatedObjectiveSummary>(
  "AssociatedObjectiveSummary",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }) {}
export class ImplementationSummary extends S.Class<ImplementationSummary>(
  "ImplementationSummary",
)({ Type: S.String, Identifier: S.optional(S.String) }) {}
export class ControlMapping extends S.Class<ControlMapping>("ControlMapping")({
  ControlArn: S.String,
  MappingType: S.String,
  Mapping: Mapping,
}) {}
export const ControlMappings = S.Array(ControlMapping);
export class CommonControlSummary extends S.Class<CommonControlSummary>(
  "CommonControlSummary",
)({
  Arn: S.String,
  Name: S.String,
  Description: S.String,
  Domain: AssociatedDomainSummary,
  Objective: AssociatedObjectiveSummary,
  CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const CommonControlSummaryList = S.Array(CommonControlSummary);
export class ControlSummary extends S.Class<ControlSummary>("ControlSummary")({
  Arn: S.String,
  Aliases: S.optional(ControlAliases),
  Name: S.String,
  Description: S.String,
  Behavior: S.optional(S.String),
  Severity: S.optional(S.String),
  Implementation: S.optional(ImplementationSummary),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  GovernedResources: S.optional(GovernedResources),
}) {}
export const Controls = S.Array(ControlSummary);
export class ListControlMappingsResponse extends S.Class<ListControlMappingsResponse>(
  "ListControlMappingsResponse",
)({ ControlMappings: ControlMappings, NextToken: S.optional(S.String) }) {}
export class ListCommonControlsResponse extends S.Class<ListCommonControlsResponse>(
  "ListCommonControlsResponse",
)({
  CommonControls: CommonControlSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ListControlsResponse extends S.Class<ListControlsResponse>(
  "ListControlsResponse",
)({ Controls: Controls, NextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
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
  { Message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns a paginated list of objectives from the Control Catalog.
 *
 * You can apply an optional filter to see the objectives that belong to a specific domain. If you don’t provide a filter, the operation returns all objectives.
 */
export const listObjectives = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListObjectivesRequest,
    output: ListObjectivesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Objectives",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a paginated list of domains from the Control Catalog.
 */
export const listDomains = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDomainsRequest,
    output: ListDomainsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Domains",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a paginated list of control mappings from the Control Catalog. Control mappings show relationships between controls and other entities, such as common controls or compliance frameworks.
 */
export const listControlMappings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListControlMappingsRequest,
    output: ListControlMappingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ControlMappings",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a paginated list of common controls from the Amazon Web Services Control Catalog.
 *
 * You can apply an optional filter to see common controls that have a specific objective. If you don’t provide a filter, the operation returns all common controls.
 */
export const listCommonControls = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCommonControlsRequest,
    output: ListCommonControlsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CommonControls",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns details about a specific control, most notably a list of Amazon Web Services Regions where this control is supported. Input a value for the *ControlArn* parameter, in ARN form. `GetControl` accepts *controltower* or *controlcatalog* control ARNs as input. Returns a *controlcatalog* ARN format.
 *
 * In the API response, controls that have the value `GLOBAL` in the `Scope` field do not show the `DeployableRegions` field, because it does not apply. Controls that have the value `REGIONAL` in the `Scope` field return a value for the `DeployableRegions` field, as shown in the example.
 */
export const getControl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetControlRequest,
  output: GetControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a paginated list of all available controls in the Control Catalog library. Allows you to discover available controls. The list of controls is given as structures of type *controlSummary*. The ARN is returned in the global *controlcatalog* format, as shown in the examples.
 */
export const listControls = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListControlsRequest,
    output: ListControlsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Controls",
      pageSize: "MaxResults",
    } as const,
  }),
);

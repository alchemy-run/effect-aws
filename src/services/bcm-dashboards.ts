import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "BCM Dashboards",
  serviceShapeName: "AWSBCMDashboardsService",
});
const auth = T.AwsAuthSigv4({ name: "bcm-dashboards" });
const ver = T.ServiceVersion("2025-08-18");
const proto = T.AwsProtocolsAwsJson1_0();
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
                    url: "https://bcm-dashboards-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://bcm-dashboards.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
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

//# Schemas
export const ResourceTagKeyList = S.Array(S.String);
export class DeleteDashboardRequest extends S.Class<DeleteDashboardRequest>(
  "DeleteDashboardRequest",
)(
  { arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDashboardRequest extends S.Class<GetDashboardRequest>(
  "GetDashboardRequest",
)(
  { arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDashboardsRequest extends S.Class<ListDashboardsRequest>(
  "ListDashboardsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  key: S.String,
  value: S.String,
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, resourceTags: ResourceTagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, resourceTagKeys: ResourceTagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const MetricNames = S.Array(S.String);
export class DateTimeValue extends S.Class<DateTimeValue>("DateTimeValue")({
  type: S.String,
  value: S.String,
}) {}
export class DateTimeRange extends S.Class<DateTimeRange>("DateTimeRange")({
  startTime: DateTimeValue,
  endTime: DateTimeValue,
}) {}
export class GroupDefinition extends S.Class<GroupDefinition>(
  "GroupDefinition",
)({ key: S.String, type: S.optional(S.String) }) {}
export const GroupDefinitions = S.Array(GroupDefinition);
export const StringList = S.Array(S.String);
export const MatchOptions = S.Array(S.String);
export class DimensionValues extends S.Class<DimensionValues>(
  "DimensionValues",
)({
  key: S.String,
  values: StringList,
  matchOptions: S.optional(MatchOptions),
}) {}
export class TagValues extends S.Class<TagValues>("TagValues")({
  key: S.optional(S.String),
  values: S.optional(StringList),
  matchOptions: S.optional(MatchOptions),
}) {}
export class CostCategoryValues extends S.Class<CostCategoryValues>(
  "CostCategoryValues",
)({
  key: S.optional(S.String),
  values: S.optional(StringList),
  matchOptions: S.optional(MatchOptions),
}) {}
export class Expression extends S.Class<Expression>("Expression")({
  or: S.optional(S.suspend(() => Expressions)),
  and: S.optional(S.suspend(() => Expressions)),
  not: S.optional(S.suspend((): S.Schema<Expression, any> => Expression)),
  dimensions: S.optional(DimensionValues),
  tags: S.optional(TagValues),
  costCategories: S.optional(CostCategoryValues),
}) {}
export class CostAndUsageQuery extends S.Class<CostAndUsageQuery>(
  "CostAndUsageQuery",
)({
  metrics: MetricNames,
  timeRange: DateTimeRange,
  granularity: S.String,
  groupBy: S.optional(GroupDefinitions),
  filter: S.optional(Expression),
}) {}
export class SavingsPlansCoverageQuery extends S.Class<SavingsPlansCoverageQuery>(
  "SavingsPlansCoverageQuery",
)({
  timeRange: DateTimeRange,
  metrics: S.optional(MetricNames),
  granularity: S.optional(S.String),
  groupBy: S.optional(GroupDefinitions),
  filter: S.optional(Expression),
}) {}
export class SavingsPlansUtilizationQuery extends S.Class<SavingsPlansUtilizationQuery>(
  "SavingsPlansUtilizationQuery",
)({
  timeRange: DateTimeRange,
  granularity: S.optional(S.String),
  filter: S.optional(Expression),
}) {}
export class ReservationCoverageQuery extends S.Class<ReservationCoverageQuery>(
  "ReservationCoverageQuery",
)({
  timeRange: DateTimeRange,
  groupBy: S.optional(GroupDefinitions),
  granularity: S.optional(S.String),
  filter: S.optional(Expression),
  metrics: S.optional(MetricNames),
}) {}
export class ReservationUtilizationQuery extends S.Class<ReservationUtilizationQuery>(
  "ReservationUtilizationQuery",
)({
  timeRange: DateTimeRange,
  groupBy: S.optional(GroupDefinitions),
  granularity: S.optional(S.String),
  filter: S.optional(Expression),
}) {}
export const QueryParameters = S.Union(
  S.Struct({ costAndUsage: CostAndUsageQuery }),
  S.Struct({ savingsPlansCoverage: SavingsPlansCoverageQuery }),
  S.Struct({ savingsPlansUtilization: SavingsPlansUtilizationQuery }),
  S.Struct({ reservationCoverage: ReservationCoverageQuery }),
  S.Struct({ reservationUtilization: ReservationUtilizationQuery }),
);
export class GraphDisplayConfig extends S.Class<GraphDisplayConfig>(
  "GraphDisplayConfig",
)({ visualType: S.String }) {}
export const GraphDisplayConfigMap = S.Record({
  key: S.String,
  value: GraphDisplayConfig,
});
export class TableDisplayConfigStruct extends S.Class<TableDisplayConfigStruct>(
  "TableDisplayConfigStruct",
)({}) {}
export const DisplayConfig = S.Union(
  S.Struct({ graph: GraphDisplayConfigMap }),
  S.Struct({ table: TableDisplayConfigStruct }),
);
export class WidgetConfig extends S.Class<WidgetConfig>("WidgetConfig")({
  queryParameters: QueryParameters,
  displayConfig: DisplayConfig,
}) {}
export const WidgetConfigList = S.Array(WidgetConfig);
export class Widget extends S.Class<Widget>("Widget")({
  title: S.String,
  description: S.optional(S.String),
  width: S.optional(S.Number),
  height: S.optional(S.Number),
  horizontalOffset: S.optional(S.Number),
  configs: WidgetConfigList,
}) {}
export const WidgetList = S.Array(Widget);
export class UpdateDashboardRequest extends S.Class<UpdateDashboardRequest>(
  "UpdateDashboardRequest",
)(
  {
    arn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    widgets: S.optional(WidgetList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDashboardResponse extends S.Class<DeleteDashboardResponse>(
  "DeleteDashboardResponse",
)({ arn: S.String }) {}
export class GetDashboardResponse extends S.Class<GetDashboardResponse>(
  "GetDashboardResponse",
)({
  arn: S.String,
  name: S.String,
  description: S.optional(S.String),
  type: S.String,
  widgets: WidgetList,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ resourceArn: S.String, policyDocument: S.String }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ resourceTags: S.optional(ResourceTagList) }) {}
export class UpdateDashboardResponse extends S.Class<UpdateDashboardResponse>(
  "UpdateDashboardResponse",
)({ arn: S.String }) {}
export class DashboardReference extends S.Class<DashboardReference>(
  "DashboardReference",
)({
  arn: S.String,
  name: S.String,
  description: S.optional(S.String),
  type: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const DashboardReferenceList = S.Array(DashboardReference);
export class ListDashboardsResponse extends S.Class<ListDashboardsResponse>(
  "ListDashboardsResponse",
)({ dashboards: DashboardReferenceList, nextToken: S.optional(S.String) }) {}
export type Expressions = Expression[];
export const Expressions = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression),
) as any as S.Schema<Expressions>;
export class CreateDashboardRequest extends S.Class<CreateDashboardRequest>(
  "CreateDashboardRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    widgets: WidgetList,
    resourceTags: S.optional(ResourceTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDashboardResponse extends S.Class<CreateDashboardResponse>(
  "CreateDashboardResponse",
)({ arn: S.String }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}

//# Operations
/**
 * Returns a list of all tags associated with a specified dashboard resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds or updates tags for a specified dashboard resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes specified tags from a dashboard resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing dashboard's properties, including its name, description, and widget configurations.
 */
export const updateDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDashboardRequest,
  output: UpdateDashboardResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a specified dashboard. This action cannot be undone.
 */
export const deleteDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDashboardRequest,
  output: DeleteDashboardResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the configuration and metadata of a specified dashboard, including its widgets and layout settings.
 */
export const getDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDashboardRequest,
  output: GetDashboardResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the resource-based policy attached to a dashboard, showing sharing configurations and permissions.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all dashboards in your account.
 */
export const listDashboards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDashboardsRequest,
  output: ListDashboardsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new dashboard that can contain multiple widgets displaying cost and usage data. You can add custom widgets or use predefined widgets, arranging them in your preferred layout.
 */
export const createDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDashboardRequest,
  output: CreateDashboardResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

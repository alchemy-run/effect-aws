import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "resiliencehub",
  serviceShapeName: "AwsResilienceHub",
});
const auth = T.AwsAuthSigv4({ name: "resiliencehub" });
const ver = T.ServiceVersion("2020-04-30");
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
                        url: "https://resiliencehub-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://resiliencehub-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://resiliencehub.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://resiliencehub.{Region}.{PartitionResult#dnsSuffix}",
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
export const AppComponentNameList = S.Array(S.String);
export const RecommendationIdList = S.Array(S.String);
export const RenderRecommendationTypeList = S.Array(S.String);
export const ArnList = S.Array(S.String);
export class TerraformSource extends S.Class<TerraformSource>(
  "TerraformSource",
)({ s3StateFileUrl: S.String }) {}
export const TerraformSourceList = S.Array(TerraformSource);
export const AssessmentStatusList = S.Array(S.String);
export const RecommendationTemplateStatusList = S.Array(S.String);
export const EntityNameList = S.Array(S.String);
export const String255List = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateRecommendationTemplateRequest extends S.Class<CreateRecommendationTemplateRequest>(
  "CreateRecommendationTemplateRequest",
)(
  {
    recommendationIds: S.optional(RecommendationIdList),
    format: S.optional(S.String),
    recommendationTypes: S.optional(RenderRecommendationTypeList),
    assessmentArn: S.String,
    name: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
    bucketName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-recommendation-template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppRequest extends S.Class<DeleteAppRequest>(
  "DeleteAppRequest",
)(
  {
    appArn: S.String,
    forceDelete: S.optional(S.Boolean),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/delete-app" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppAssessmentRequest extends S.Class<DeleteAppAssessmentRequest>(
  "DeleteAppAssessmentRequest",
)(
  { assessmentArn: S.String, clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/delete-app-assessment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppVersionAppComponentRequest extends S.Class<DeleteAppVersionAppComponentRequest>(
  "DeleteAppVersionAppComponentRequest",
)(
  { appArn: S.String, id: S.String, clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/delete-app-version-app-component" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LogicalResourceId extends S.Class<LogicalResourceId>(
  "LogicalResourceId",
)({
  identifier: S.String,
  logicalStackName: S.optional(S.String),
  resourceGroupName: S.optional(S.String),
  terraformSourceName: S.optional(S.String),
  eksSourceName: S.optional(S.String),
}) {}
export class DeleteAppVersionResourceRequest extends S.Class<DeleteAppVersionResourceRequest>(
  "DeleteAppVersionResourceRequest",
)(
  {
    appArn: S.String,
    resourceName: S.optional(S.String),
    logicalResourceId: S.optional(LogicalResourceId),
    physicalResourceId: S.optional(S.String),
    awsRegion: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/delete-app-version-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecommendationTemplateRequest extends S.Class<DeleteRecommendationTemplateRequest>(
  "DeleteRecommendationTemplateRequest",
)(
  { recommendationTemplateArn: S.String, clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/delete-recommendation-template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResiliencyPolicyRequest extends S.Class<DeleteResiliencyPolicyRequest>(
  "DeleteResiliencyPolicyRequest",
)(
  { policyArn: S.String, clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/delete-resiliency-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppRequest extends S.Class<DescribeAppRequest>(
  "DescribeAppRequest",
)(
  { appArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describe-app" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppAssessmentRequest extends S.Class<DescribeAppAssessmentRequest>(
  "DescribeAppAssessmentRequest",
)(
  { assessmentArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describe-app-assessment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppVersionRequest extends S.Class<DescribeAppVersionRequest>(
  "DescribeAppVersionRequest",
)(
  { appArn: S.String, appVersion: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describe-app-version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppVersionAppComponentRequest extends S.Class<DescribeAppVersionAppComponentRequest>(
  "DescribeAppVersionAppComponentRequest",
)(
  { appArn: S.String, appVersion: S.String, id: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describe-app-version-app-component" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppVersionResourceRequest extends S.Class<DescribeAppVersionResourceRequest>(
  "DescribeAppVersionResourceRequest",
)(
  {
    appArn: S.String,
    appVersion: S.String,
    resourceName: S.optional(S.String),
    logicalResourceId: S.optional(LogicalResourceId),
    physicalResourceId: S.optional(S.String),
    awsRegion: S.optional(S.String),
    awsAccountId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/describe-app-version-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppVersionResourcesResolutionStatusRequest extends S.Class<DescribeAppVersionResourcesResolutionStatusRequest>(
  "DescribeAppVersionResourcesResolutionStatusRequest",
)(
  {
    appArn: S.String,
    appVersion: S.String,
    resolutionId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/describe-app-version-resources-resolution-status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppVersionTemplateRequest extends S.Class<DescribeAppVersionTemplateRequest>(
  "DescribeAppVersionTemplateRequest",
)(
  { appArn: S.String, appVersion: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describe-app-version-template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDraftAppVersionResourcesImportStatusRequest extends S.Class<DescribeDraftAppVersionResourcesImportStatusRequest>(
  "DescribeDraftAppVersionResourcesImportStatusRequest",
)(
  { appArn: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/describe-draft-app-version-resources-import-status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMetricsExportRequest extends S.Class<DescribeMetricsExportRequest>(
  "DescribeMetricsExportRequest",
)(
  { metricsExportId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describe-metrics-export" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeResiliencyPolicyRequest extends S.Class<DescribeResiliencyPolicyRequest>(
  "DescribeResiliencyPolicyRequest",
)(
  { policyArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describe-resiliency-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeResourceGroupingRecommendationTaskRequest extends S.Class<DescribeResourceGroupingRecommendationTaskRequest>(
  "DescribeResourceGroupingRecommendationTaskRequest",
)(
  { appArn: S.String, groupingId: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/describe-resource-grouping-recommendation-task",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAlarmRecommendationsRequest extends S.Class<ListAlarmRecommendationsRequest>(
  "ListAlarmRecommendationsRequest",
)(
  {
    assessmentArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-alarm-recommendations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppAssessmentComplianceDriftsRequest extends S.Class<ListAppAssessmentComplianceDriftsRequest>(
  "ListAppAssessmentComplianceDriftsRequest",
)(
  {
    assessmentArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-app-assessment-compliance-drifts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppAssessmentResourceDriftsRequest extends S.Class<ListAppAssessmentResourceDriftsRequest>(
  "ListAppAssessmentResourceDriftsRequest",
)(
  {
    assessmentArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-app-assessment-resource-drifts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppAssessmentsRequest extends S.Class<ListAppAssessmentsRequest>(
  "ListAppAssessmentsRequest",
)(
  {
    appArn: S.optional(S.String).pipe(T.HttpQuery("appArn")),
    assessmentName: S.optional(S.String).pipe(T.HttpQuery("assessmentName")),
    assessmentStatus: S.optional(AssessmentStatusList).pipe(
      T.HttpQuery("assessmentStatus"),
    ),
    complianceStatus: S.optional(S.String).pipe(
      T.HttpQuery("complianceStatus"),
    ),
    invoker: S.optional(S.String).pipe(T.HttpQuery("invoker")),
    reverseOrder: S.optional(S.Boolean).pipe(T.HttpQuery("reverseOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-app-assessments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppComponentCompliancesRequest extends S.Class<ListAppComponentCompliancesRequest>(
  "ListAppComponentCompliancesRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    assessmentArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-app-component-compliances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppComponentRecommendationsRequest extends S.Class<ListAppComponentRecommendationsRequest>(
  "ListAppComponentRecommendationsRequest",
)(
  {
    assessmentArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-app-component-recommendations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppInputSourcesRequest extends S.Class<ListAppInputSourcesRequest>(
  "ListAppInputSourcesRequest",
)(
  {
    appArn: S.String,
    appVersion: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-app-input-sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppsRequest extends S.Class<ListAppsRequest>(
  "ListAppsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    appArn: S.optional(S.String).pipe(T.HttpQuery("appArn")),
    fromLastAssessmentTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("fromLastAssessmentTime")),
    toLastAssessmentTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("toLastAssessmentTime")),
    reverseOrder: S.optional(S.Boolean).pipe(T.HttpQuery("reverseOrder")),
    awsApplicationArn: S.optional(S.String).pipe(
      T.HttpQuery("awsApplicationArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-apps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppVersionAppComponentsRequest extends S.Class<ListAppVersionAppComponentsRequest>(
  "ListAppVersionAppComponentsRequest",
)(
  {
    appArn: S.String,
    appVersion: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-app-version-app-components" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppVersionResourceMappingsRequest extends S.Class<ListAppVersionResourceMappingsRequest>(
  "ListAppVersionResourceMappingsRequest",
)(
  {
    appArn: S.String,
    appVersion: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-app-version-resource-mappings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppVersionResourcesRequest extends S.Class<ListAppVersionResourcesRequest>(
  "ListAppVersionResourcesRequest",
)(
  {
    appArn: S.String,
    appVersion: S.String,
    resolutionId: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-app-version-resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppVersionsRequest extends S.Class<ListAppVersionsRequest>(
  "ListAppVersionsRequest",
)(
  {
    appArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-app-versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecommendationTemplatesRequest extends S.Class<ListRecommendationTemplatesRequest>(
  "ListRecommendationTemplatesRequest",
)(
  {
    assessmentArn: S.optional(S.String).pipe(T.HttpQuery("assessmentArn")),
    reverseOrder: S.optional(S.Boolean).pipe(T.HttpQuery("reverseOrder")),
    status: S.optional(RecommendationTemplateStatusList).pipe(
      T.HttpQuery("status"),
    ),
    recommendationTemplateArn: S.optional(S.String).pipe(
      T.HttpQuery("recommendationTemplateArn"),
    ),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-recommendation-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResiliencyPoliciesRequest extends S.Class<ListResiliencyPoliciesRequest>(
  "ListResiliencyPoliciesRequest",
)(
  {
    policyName: S.optional(S.String).pipe(T.HttpQuery("policyName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-resiliency-policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceGroupingRecommendationsRequest extends S.Class<ListResourceGroupingRecommendationsRequest>(
  "ListResourceGroupingRecommendationsRequest",
)(
  {
    appArn: S.optional(S.String).pipe(T.HttpQuery("appArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-resource-grouping-recommendations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSopRecommendationsRequest extends S.Class<ListSopRecommendationsRequest>(
  "ListSopRecommendationsRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    assessmentArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-sop-recommendations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSuggestedResiliencyPoliciesRequest extends S.Class<ListSuggestedResiliencyPoliciesRequest>(
  "ListSuggestedResiliencyPoliciesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-suggested-resiliency-policies" }),
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
export class ListTestRecommendationsRequest extends S.Class<ListTestRecommendationsRequest>(
  "ListTestRecommendationsRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    assessmentArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-test-recommendations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUnsupportedAppVersionResourcesRequest extends S.Class<ListUnsupportedAppVersionResourcesRequest>(
  "ListUnsupportedAppVersionResourcesRequest",
)(
  {
    appArn: S.String,
    appVersion: S.String,
    resolutionId: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-unsupported-app-version-resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishAppVersionRequest extends S.Class<PublishAppVersionRequest>(
  "PublishAppVersionRequest",
)(
  { appArn: S.String, versionName: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/publish-app-version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDraftAppVersionTemplateRequest extends S.Class<PutDraftAppVersionTemplateRequest>(
  "PutDraftAppVersionTemplateRequest",
)(
  { appArn: S.String, appTemplateBody: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/put-draft-app-version-template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveDraftAppVersionResourceMappingsRequest extends S.Class<RemoveDraftAppVersionResourceMappingsRequest>(
  "RemoveDraftAppVersionResourceMappingsRequest",
)(
  {
    appArn: S.String,
    resourceNames: S.optional(EntityNameList),
    logicalStackNames: S.optional(String255List),
    appRegistryAppNames: S.optional(EntityNameList),
    resourceGroupNames: S.optional(EntityNameList),
    terraformSourceNames: S.optional(String255List),
    eksSourceNames: S.optional(String255List),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/remove-draft-app-version-resource-mappings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResolveAppVersionResourcesRequest extends S.Class<ResolveAppVersionResourcesRequest>(
  "ResolveAppVersionResourcesRequest",
)(
  { appArn: S.String, appVersion: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/resolve-app-version-resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartAppAssessmentRequest extends S.Class<StartAppAssessmentRequest>(
  "StartAppAssessmentRequest",
)(
  {
    appArn: S.String,
    appVersion: S.String,
    assessmentName: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/start-app-assessment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMetricsExportRequest extends S.Class<StartMetricsExportRequest>(
  "StartMetricsExportRequest",
)(
  { bucketName: S.optional(S.String), clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/start-metrics-export" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartResourceGroupingRecommendationTaskRequest extends S.Class<StartResourceGroupingRecommendationTaskRequest>(
  "StartResourceGroupingRecommendationTaskRequest",
)(
  { appArn: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/start-resource-grouping-recommendation-task",
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
export const IamRoleArnList = S.Array(S.String);
export class PermissionModel extends S.Class<PermissionModel>(
  "PermissionModel",
)({
  type: S.String,
  invokerRoleName: S.optional(S.String),
  crossAccountRoleArns: S.optional(IamRoleArnList),
}) {}
export class EventSubscription extends S.Class<EventSubscription>(
  "EventSubscription",
)({ name: S.String, eventType: S.String, snsTopicArn: S.optional(S.String) }) {}
export const EventSubscriptionList = S.Array(EventSubscription);
export class UpdateAppRequest extends S.Class<UpdateAppRequest>(
  "UpdateAppRequest",
)(
  {
    appArn: S.String,
    description: S.optional(S.String),
    policyArn: S.optional(S.String),
    clearResiliencyPolicyArn: S.optional(S.Boolean),
    assessmentSchedule: S.optional(S.String),
    permissionModel: S.optional(PermissionModel),
    eventSubscriptions: S.optional(EventSubscriptionList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-app" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AdditionalInfoValueList = S.Array(S.String);
export const AdditionalInfoMap = S.Record({
  key: S.String,
  value: AdditionalInfoValueList,
});
export class UpdateAppVersionRequest extends S.Class<UpdateAppVersionRequest>(
  "UpdateAppVersionRequest",
)(
  { appArn: S.String, additionalInfo: S.optional(AdditionalInfoMap) },
  T.all(
    T.Http({ method: "POST", uri: "/update-app-version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAppVersionAppComponentRequest extends S.Class<UpdateAppVersionAppComponentRequest>(
  "UpdateAppVersionAppComponentRequest",
)(
  {
    appArn: S.String,
    id: S.String,
    name: S.optional(S.String),
    type: S.optional(S.String),
    additionalInfo: S.optional(AdditionalInfoMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-app-version-app-component" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAppVersionResourceRequest extends S.Class<UpdateAppVersionResourceRequest>(
  "UpdateAppVersionResourceRequest",
)(
  {
    appArn: S.String,
    resourceName: S.optional(S.String),
    logicalResourceId: S.optional(LogicalResourceId),
    physicalResourceId: S.optional(S.String),
    awsRegion: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    resourceType: S.optional(S.String),
    appComponents: S.optional(AppComponentNameList),
    additionalInfo: S.optional(AdditionalInfoMap),
    excluded: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-app-version-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FailurePolicy extends S.Class<FailurePolicy>("FailurePolicy")({
  rtoInSecs: S.Number,
  rpoInSecs: S.Number,
}) {}
export const DisruptionPolicy = S.Record({
  key: S.String,
  value: FailurePolicy,
});
export class UpdateResiliencyPolicyRequest extends S.Class<UpdateResiliencyPolicyRequest>(
  "UpdateResiliencyPolicyRequest",
)(
  {
    policyArn: S.String,
    policyName: S.optional(S.String),
    policyDescription: S.optional(S.String),
    dataLocationConstraint: S.optional(S.String),
    tier: S.optional(S.String),
    policy: S.optional(DisruptionPolicy),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-resiliency-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const EksNamespaceList = S.Array(S.String);
export class AcceptGroupingRecommendationEntry extends S.Class<AcceptGroupingRecommendationEntry>(
  "AcceptGroupingRecommendationEntry",
)({ groupingRecommendationId: S.String }) {}
export const AcceptGroupingRecommendationEntries = S.Array(
  AcceptGroupingRecommendationEntry,
);
export class EksSourceClusterNamespace extends S.Class<EksSourceClusterNamespace>(
  "EksSourceClusterNamespace",
)({ eksClusterArn: S.String, namespace: S.String }) {}
export class EksSource extends S.Class<EksSource>("EksSource")({
  eksClusterArn: S.String,
  namespaces: EksNamespaceList,
}) {}
export const EksSourceList = S.Array(EksSource);
export class AppComponent extends S.Class<AppComponent>("AppComponent")({
  name: S.String,
  type: S.String,
  id: S.optional(S.String),
  additionalInfo: S.optional(AdditionalInfoMap),
}) {}
export const AppComponentList = S.Array(AppComponent);
export class PhysicalResourceId extends S.Class<PhysicalResourceId>(
  "PhysicalResourceId",
)({
  identifier: S.String,
  type: S.String,
  awsRegion: S.optional(S.String),
  awsAccountId: S.optional(S.String),
}) {}
export class PhysicalResource extends S.Class<PhysicalResource>(
  "PhysicalResource",
)({
  resourceName: S.optional(S.String),
  logicalResourceId: LogicalResourceId,
  physicalResourceId: PhysicalResourceId,
  resourceType: S.String,
  appComponents: S.optional(AppComponentList),
  additionalInfo: S.optional(AdditionalInfoMap),
  excluded: S.optional(S.Boolean),
  sourceType: S.optional(S.String),
  parentResourceName: S.optional(S.String),
}) {}
export const PhysicalResourceList = S.Array(PhysicalResource);
export class Field extends S.Class<Field>("Field")({
  name: S.String,
  aggregation: S.optional(S.String),
}) {}
export const FieldList = S.Array(Field);
export class Condition extends S.Class<Condition>("Condition")({
  field: S.String,
  operator: S.String,
  value: S.optional(S.String),
}) {}
export const ConditionList = S.Array(Condition);
export class Sort extends S.Class<Sort>("Sort")({
  field: S.String,
  ascending: S.optional(S.Boolean),
}) {}
export const SortList = S.Array(Sort);
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucket: S.optional(S.String),
  prefix: S.optional(S.String),
}) {}
export class RecommendationTemplate extends S.Class<RecommendationTemplate>(
  "RecommendationTemplate",
)({
  templatesLocation: S.optional(S3Location),
  assessmentArn: S.String,
  appArn: S.optional(S.String),
  recommendationIds: S.optional(RecommendationIdList),
  recommendationTypes: RenderRecommendationTypeList,
  format: S.String,
  recommendationTemplateArn: S.String,
  message: S.optional(S.String),
  status: S.String,
  name: S.String,
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
  needsReplacements: S.optional(S.Boolean),
}) {}
export const RecommendationTemplateList = S.Array(RecommendationTemplate);
export class ResiliencyPolicy extends S.Class<ResiliencyPolicy>(
  "ResiliencyPolicy",
)({
  policyArn: S.optional(S.String),
  policyName: S.optional(S.String),
  policyDescription: S.optional(S.String),
  dataLocationConstraint: S.optional(S.String),
  tier: S.optional(S.String),
  estimatedCostTier: S.optional(S.String),
  policy: S.optional(DisruptionPolicy),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export const ResiliencyPolicies = S.Array(ResiliencyPolicy);
export class RejectGroupingRecommendationEntry extends S.Class<RejectGroupingRecommendationEntry>(
  "RejectGroupingRecommendationEntry",
)({
  groupingRecommendationId: S.String,
  rejectionReason: S.optional(S.String),
}) {}
export const RejectGroupingRecommendationEntries = S.Array(
  RejectGroupingRecommendationEntry,
);
export class AcceptResourceGroupingRecommendationsRequest extends S.Class<AcceptResourceGroupingRecommendationsRequest>(
  "AcceptResourceGroupingRecommendationsRequest",
)(
  { appArn: S.String, entries: AcceptGroupingRecommendationEntries },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accept-resource-grouping-recommendations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAppRequest extends S.Class<CreateAppRequest>(
  "CreateAppRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    policyArn: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
    assessmentSchedule: S.optional(S.String),
    permissionModel: S.optional(PermissionModel),
    eventSubscriptions: S.optional(EventSubscriptionList),
    awsApplicationArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-app" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAppVersionAppComponentRequest extends S.Class<CreateAppVersionAppComponentRequest>(
  "CreateAppVersionAppComponentRequest",
)(
  {
    appArn: S.String,
    id: S.optional(S.String),
    name: S.String,
    type: S.String,
    additionalInfo: S.optional(AdditionalInfoMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-app-version-app-component" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAppVersionResourceRequest extends S.Class<CreateAppVersionResourceRequest>(
  "CreateAppVersionResourceRequest",
)(
  {
    appArn: S.String,
    resourceName: S.optional(S.String),
    logicalResourceId: LogicalResourceId,
    physicalResourceId: S.String,
    awsRegion: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    resourceType: S.String,
    appComponents: AppComponentNameList,
    additionalInfo: S.optional(AdditionalInfoMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-app-version-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppResponse extends S.Class<DeleteAppResponse>(
  "DeleteAppResponse",
)({ appArn: S.String }) {}
export class DeleteAppAssessmentResponse extends S.Class<DeleteAppAssessmentResponse>(
  "DeleteAppAssessmentResponse",
)({ assessmentArn: S.String, assessmentStatus: S.String }) {}
export class DeleteAppInputSourceRequest extends S.Class<DeleteAppInputSourceRequest>(
  "DeleteAppInputSourceRequest",
)(
  {
    appArn: S.String,
    sourceArn: S.optional(S.String),
    terraformSource: S.optional(TerraformSource),
    clientToken: S.optional(S.String),
    eksSourceClusterNamespace: S.optional(EksSourceClusterNamespace),
  },
  T.all(
    T.Http({ method: "POST", uri: "/delete-app-input-source" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecommendationTemplateResponse extends S.Class<DeleteRecommendationTemplateResponse>(
  "DeleteRecommendationTemplateResponse",
)({ recommendationTemplateArn: S.String, status: S.String }) {}
export class DeleteResiliencyPolicyResponse extends S.Class<DeleteResiliencyPolicyResponse>(
  "DeleteResiliencyPolicyResponse",
)({ policyArn: S.String }) {}
export class DescribeAppVersionResponse extends S.Class<DescribeAppVersionResponse>(
  "DescribeAppVersionResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  additionalInfo: S.optional(AdditionalInfoMap),
}) {}
export class DescribeAppVersionAppComponentResponse extends S.Class<DescribeAppVersionAppComponentResponse>(
  "DescribeAppVersionAppComponentResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  appComponent: S.optional(AppComponent),
}) {}
export class DescribeAppVersionResourceResponse extends S.Class<DescribeAppVersionResourceResponse>(
  "DescribeAppVersionResourceResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  physicalResource: S.optional(PhysicalResource),
}) {}
export class DescribeAppVersionResourcesResolutionStatusResponse extends S.Class<DescribeAppVersionResourcesResolutionStatusResponse>(
  "DescribeAppVersionResourcesResolutionStatusResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  resolutionId: S.String,
  status: S.String,
  errorMessage: S.optional(S.String),
}) {}
export class DescribeAppVersionTemplateResponse extends S.Class<DescribeAppVersionTemplateResponse>(
  "DescribeAppVersionTemplateResponse",
)({ appArn: S.String, appVersion: S.String, appTemplateBody: S.String }) {}
export class DescribeResourceGroupingRecommendationTaskResponse extends S.Class<DescribeResourceGroupingRecommendationTaskResponse>(
  "DescribeResourceGroupingRecommendationTaskResponse",
)({
  groupingId: S.String,
  status: S.String,
  errorMessage: S.optional(S.String),
}) {}
export class ImportResourcesToDraftAppVersionRequest extends S.Class<ImportResourcesToDraftAppVersionRequest>(
  "ImportResourcesToDraftAppVersionRequest",
)(
  {
    appArn: S.String,
    sourceArns: S.optional(ArnList),
    terraformSources: S.optional(TerraformSourceList),
    importStrategy: S.optional(S.String),
    eksSources: S.optional(EksSourceList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/import-resources-to-draft-app-version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppVersionAppComponentsResponse extends S.Class<ListAppVersionAppComponentsResponse>(
  "ListAppVersionAppComponentsResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  appComponents: S.optional(AppComponentList),
  nextToken: S.optional(S.String),
}) {}
export class ResourceMapping extends S.Class<ResourceMapping>(
  "ResourceMapping",
)({
  resourceName: S.optional(S.String),
  logicalStackName: S.optional(S.String),
  appRegistryAppName: S.optional(S.String),
  resourceGroupName: S.optional(S.String),
  mappingType: S.String,
  physicalResourceId: PhysicalResourceId,
  terraformSourceName: S.optional(S.String),
  eksSourceName: S.optional(S.String),
}) {}
export const ResourceMappingList = S.Array(ResourceMapping);
export class ListAppVersionResourceMappingsResponse extends S.Class<ListAppVersionResourceMappingsResponse>(
  "ListAppVersionResourceMappingsResponse",
)({ resourceMappings: ResourceMappingList, nextToken: S.optional(S.String) }) {}
export class ListAppVersionResourcesResponse extends S.Class<ListAppVersionResourcesResponse>(
  "ListAppVersionResourcesResponse",
)({
  physicalResources: PhysicalResourceList,
  resolutionId: S.String,
  nextToken: S.optional(S.String),
}) {}
export class ListMetricsRequest extends S.Class<ListMetricsRequest>(
  "ListMetricsRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    fields: S.optional(FieldList),
    dataSource: S.optional(S.String),
    conditions: S.optional(ConditionList),
    sorts: S.optional(SortList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecommendationTemplatesResponse extends S.Class<ListRecommendationTemplatesResponse>(
  "ListRecommendationTemplatesResponse",
)({
  nextToken: S.optional(S.String),
  recommendationTemplates: S.optional(RecommendationTemplateList),
}) {}
export class ListResiliencyPoliciesResponse extends S.Class<ListResiliencyPoliciesResponse>(
  "ListResiliencyPoliciesResponse",
)({
  resiliencyPolicies: ResiliencyPolicies,
  nextToken: S.optional(S.String),
}) {}
export class ListSuggestedResiliencyPoliciesResponse extends S.Class<ListSuggestedResiliencyPoliciesResponse>(
  "ListSuggestedResiliencyPoliciesResponse",
)({
  resiliencyPolicies: ResiliencyPolicies,
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class PublishAppVersionResponse extends S.Class<PublishAppVersionResponse>(
  "PublishAppVersionResponse",
)({
  appArn: S.String,
  appVersion: S.optional(S.String),
  identifier: S.optional(S.Number),
  versionName: S.optional(S.String),
}) {}
export class PutDraftAppVersionTemplateResponse extends S.Class<PutDraftAppVersionTemplateResponse>(
  "PutDraftAppVersionTemplateResponse",
)({ appArn: S.optional(S.String), appVersion: S.optional(S.String) }) {}
export class RejectResourceGroupingRecommendationsRequest extends S.Class<RejectResourceGroupingRecommendationsRequest>(
  "RejectResourceGroupingRecommendationsRequest",
)(
  { appArn: S.String, entries: RejectGroupingRecommendationEntries },
  T.all(
    T.Http({
      method: "POST",
      uri: "/reject-resource-grouping-recommendations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveDraftAppVersionResourceMappingsResponse extends S.Class<RemoveDraftAppVersionResourceMappingsResponse>(
  "RemoveDraftAppVersionResourceMappingsResponse",
)({ appArn: S.optional(S.String), appVersion: S.optional(S.String) }) {}
export class ResolveAppVersionResourcesResponse extends S.Class<ResolveAppVersionResourcesResponse>(
  "ResolveAppVersionResourcesResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  resolutionId: S.String,
  status: S.String,
}) {}
export class Cost extends S.Class<Cost>("Cost")({
  amount: S.Number,
  currency: S.String,
  frequency: S.String,
}) {}
export const DisruptionResiliencyScore = S.Record({
  key: S.String,
  value: S.Number,
});
export class ScoringComponentResiliencyScore extends S.Class<ScoringComponentResiliencyScore>(
  "ScoringComponentResiliencyScore",
)({
  score: S.optional(S.Number),
  possibleScore: S.optional(S.Number),
  outstandingCount: S.optional(S.Number),
  excludedCount: S.optional(S.Number),
}) {}
export const ScoringComponentResiliencyScores = S.Record({
  key: S.String,
  value: ScoringComponentResiliencyScore,
});
export class ResiliencyScore extends S.Class<ResiliencyScore>(
  "ResiliencyScore",
)({
  score: S.Number,
  disruptionScore: DisruptionResiliencyScore,
  componentScore: S.optional(ScoringComponentResiliencyScores),
}) {}
export class DisruptionCompliance extends S.Class<DisruptionCompliance>(
  "DisruptionCompliance",
)({
  achievableRtoInSecs: S.optional(S.Number),
  currentRtoInSecs: S.optional(S.Number),
  rtoReferenceId: S.optional(S.String),
  rtoDescription: S.optional(S.String),
  currentRpoInSecs: S.optional(S.Number),
  rpoReferenceId: S.optional(S.String),
  rpoDescription: S.optional(S.String),
  complianceStatus: S.String,
  achievableRpoInSecs: S.optional(S.Number),
  message: S.optional(S.String),
}) {}
export const AssessmentCompliance = S.Record({
  key: S.String,
  value: DisruptionCompliance,
});
export class ResourceError extends S.Class<ResourceError>("ResourceError")({
  logicalResourceId: S.optional(S.String),
  physicalResourceId: S.optional(S.String),
  reason: S.optional(S.String),
}) {}
export const ResourceErrorList = S.Array(ResourceError);
export class ResourceErrorsDetails extends S.Class<ResourceErrorsDetails>(
  "ResourceErrorsDetails",
)({
  resourceErrors: S.optional(ResourceErrorList),
  hasMoreErrors: S.optional(S.Boolean),
}) {}
export class AssessmentRiskRecommendation extends S.Class<AssessmentRiskRecommendation>(
  "AssessmentRiskRecommendation",
)({
  risk: S.optional(S.String),
  recommendation: S.optional(S.String),
  appComponents: S.optional(AppComponentNameList),
}) {}
export const AssessmentRiskRecommendationList = S.Array(
  AssessmentRiskRecommendation,
);
export class AssessmentSummary extends S.Class<AssessmentSummary>(
  "AssessmentSummary",
)({
  summary: S.optional(S.String),
  riskRecommendations: S.optional(AssessmentRiskRecommendationList),
}) {}
export class AppAssessment extends S.Class<AppAssessment>("AppAssessment")({
  appArn: S.optional(S.String),
  appVersion: S.optional(S.String),
  invoker: S.String,
  cost: S.optional(Cost),
  resiliencyScore: S.optional(ResiliencyScore),
  compliance: S.optional(AssessmentCompliance),
  complianceStatus: S.optional(S.String),
  assessmentStatus: S.String,
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
  assessmentName: S.optional(S.String),
  assessmentArn: S.String,
  policy: S.optional(ResiliencyPolicy),
  tags: S.optional(TagMap),
  resourceErrorsDetails: S.optional(ResourceErrorsDetails),
  versionName: S.optional(S.String),
  driftStatus: S.optional(S.String),
  summary: S.optional(AssessmentSummary),
}) {}
export class StartAppAssessmentResponse extends S.Class<StartAppAssessmentResponse>(
  "StartAppAssessmentResponse",
)({ assessment: AppAssessment }) {}
export class StartMetricsExportResponse extends S.Class<StartMetricsExportResponse>(
  "StartMetricsExportResponse",
)({ metricsExportId: S.String, status: S.String }) {}
export class StartResourceGroupingRecommendationTaskResponse extends S.Class<StartResourceGroupingRecommendationTaskResponse>(
  "StartResourceGroupingRecommendationTaskResponse",
)({
  appArn: S.String,
  groupingId: S.String,
  status: S.String,
  errorMessage: S.optional(S.String),
}) {}
export class App extends S.Class<App>("App")({
  appArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  policyArn: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.optional(S.String),
  complianceStatus: S.optional(S.String),
  lastAppComplianceEvaluationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  resiliencyScore: S.optional(S.Number),
  lastResiliencyScoreEvaluationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  tags: S.optional(TagMap),
  assessmentSchedule: S.optional(S.String),
  permissionModel: S.optional(PermissionModel),
  eventSubscriptions: S.optional(EventSubscriptionList),
  driftStatus: S.optional(S.String),
  lastDriftEvaluationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  rtoInSecs: S.optional(S.Number),
  rpoInSecs: S.optional(S.Number),
  awsApplicationArn: S.optional(S.String),
}) {}
export class UpdateAppResponse extends S.Class<UpdateAppResponse>(
  "UpdateAppResponse",
)({ app: App }) {}
export class UpdateAppVersionResponse extends S.Class<UpdateAppVersionResponse>(
  "UpdateAppVersionResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  additionalInfo: S.optional(AdditionalInfoMap),
}) {}
export class UpdateAppVersionAppComponentResponse extends S.Class<UpdateAppVersionAppComponentResponse>(
  "UpdateAppVersionAppComponentResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  appComponent: S.optional(AppComponent),
}) {}
export class UpdateAppVersionResourceResponse extends S.Class<UpdateAppVersionResourceResponse>(
  "UpdateAppVersionResourceResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  physicalResource: S.optional(PhysicalResource),
}) {}
export class UpdateResiliencyPolicyResponse extends S.Class<UpdateResiliencyPolicyResponse>(
  "UpdateResiliencyPolicyResponse",
)({ policy: ResiliencyPolicy }) {}
export class UpdateRecommendationStatusItem extends S.Class<UpdateRecommendationStatusItem>(
  "UpdateRecommendationStatusItem",
)({
  resourceId: S.optional(S.String),
  targetAccountId: S.optional(S.String),
  targetRegion: S.optional(S.String),
}) {}
export const AlarmReferenceIdList = S.Array(S.String);
export class UpdateRecommendationStatusRequestEntry extends S.Class<UpdateRecommendationStatusRequestEntry>(
  "UpdateRecommendationStatusRequestEntry",
)({
  entryId: S.String,
  referenceId: S.String,
  item: S.optional(UpdateRecommendationStatusItem),
  excluded: S.Boolean,
  appComponentId: S.optional(S.String),
  excludeReason: S.optional(S.String),
}) {}
export const UpdateRecommendationStatusRequestEntries = S.Array(
  UpdateRecommendationStatusRequestEntry,
);
export class ErrorDetail extends S.Class<ErrorDetail>("ErrorDetail")({
  errorMessage: S.optional(S.String),
}) {}
export const ErrorDetailList = S.Array(ErrorDetail);
export class ComplianceDrift extends S.Class<ComplianceDrift>(
  "ComplianceDrift",
)({
  entityId: S.optional(S.String),
  entityType: S.optional(S.String),
  driftType: S.optional(S.String),
  appId: S.optional(S.String),
  appVersion: S.optional(S.String),
  expectedReferenceId: S.optional(S.String),
  expectedValue: S.optional(AssessmentCompliance),
  actualReferenceId: S.optional(S.String),
  actualValue: S.optional(AssessmentCompliance),
  diffType: S.optional(S.String),
}) {}
export const ComplianceDriftList = S.Array(ComplianceDrift);
export class AppAssessmentSummary extends S.Class<AppAssessmentSummary>(
  "AppAssessmentSummary",
)({
  appArn: S.optional(S.String),
  appVersion: S.optional(S.String),
  assessmentStatus: S.String,
  invoker: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
  assessmentName: S.optional(S.String),
  assessmentArn: S.String,
  complianceStatus: S.optional(S.String),
  cost: S.optional(Cost),
  resiliencyScore: S.optional(S.Number),
  versionName: S.optional(S.String),
  driftStatus: S.optional(S.String),
}) {}
export const AppAssessmentSummaryList = S.Array(AppAssessmentSummary);
export class AppComponentCompliance extends S.Class<AppComponentCompliance>(
  "AppComponentCompliance",
)({
  cost: S.optional(Cost),
  appComponentName: S.optional(S.String),
  compliance: S.optional(AssessmentCompliance),
  message: S.optional(S.String),
  status: S.optional(S.String),
  resiliencyScore: S.optional(ResiliencyScore),
}) {}
export const ComponentCompliancesList = S.Array(AppComponentCompliance);
export class AppInputSource extends S.Class<AppInputSource>("AppInputSource")({
  sourceName: S.optional(S.String),
  importType: S.String,
  sourceArn: S.optional(S.String),
  terraformSource: S.optional(TerraformSource),
  resourceCount: S.optional(S.Number),
  eksSourceClusterNamespace: S.optional(EksSourceClusterNamespace),
}) {}
export const AppInputSourceList = S.Array(AppInputSource);
export class AppSummary extends S.Class<AppSummary>("AppSummary")({
  appArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  complianceStatus: S.optional(S.String),
  resiliencyScore: S.optional(S.Number),
  assessmentSchedule: S.optional(S.String),
  status: S.optional(S.String),
  driftStatus: S.optional(S.String),
  lastAppComplianceEvaluationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  rtoInSecs: S.optional(S.Number),
  rpoInSecs: S.optional(S.Number),
  awsApplicationArn: S.optional(S.String),
}) {}
export const AppSummaryList = S.Array(AppSummary);
export class AppVersionSummary extends S.Class<AppVersionSummary>(
  "AppVersionSummary",
)({
  appVersion: S.String,
  identifier: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  versionName: S.optional(S.String),
}) {}
export const AppVersionList = S.Array(AppVersionSummary);
export const Row = S.Array(S.String);
export const RowList = S.Array(Row);
export class Experiment extends S.Class<Experiment>("Experiment")({
  experimentArn: S.optional(S.String),
  experimentTemplateId: S.optional(S.String),
}) {}
export class Alarm extends S.Class<Alarm>("Alarm")({
  alarmArn: S.optional(S.String),
  source: S.optional(S.String),
}) {}
export class RecommendationItem extends S.Class<RecommendationItem>(
  "RecommendationItem",
)({
  resourceId: S.optional(S.String),
  targetAccountId: S.optional(S.String),
  targetRegion: S.optional(S.String),
  alreadyImplemented: S.optional(S.Boolean),
  excluded: S.optional(S.Boolean),
  excludeReason: S.optional(S.String),
  latestDiscoveredExperiment: S.optional(Experiment),
  discoveredAlarm: S.optional(Alarm),
}) {}
export const RecommendationItemList = S.Array(RecommendationItem);
export class SopRecommendation extends S.Class<SopRecommendation>(
  "SopRecommendation",
)({
  serviceType: S.String,
  appComponentName: S.optional(S.String),
  description: S.optional(S.String),
  recommendationId: S.String,
  name: S.optional(S.String),
  items: S.optional(RecommendationItemList),
  referenceId: S.String,
  prerequisite: S.optional(S.String),
  recommendationStatus: S.optional(S.String),
}) {}
export const SopRecommendationList = S.Array(SopRecommendation);
export class TestRecommendation extends S.Class<TestRecommendation>(
  "TestRecommendation",
)({
  recommendationId: S.optional(S.String),
  referenceId: S.String,
  appComponentId: S.optional(S.String),
  appComponentName: S.optional(S.String),
  name: S.optional(S.String),
  intent: S.optional(S.String),
  risk: S.optional(S.String),
  type: S.optional(S.String),
  description: S.optional(S.String),
  items: S.optional(RecommendationItemList),
  prerequisite: S.optional(S.String),
  dependsOnAlarms: S.optional(AlarmReferenceIdList),
  recommendationStatus: S.optional(S.String),
}) {}
export const TestRecommendationList = S.Array(TestRecommendation);
export class UnsupportedResource extends S.Class<UnsupportedResource>(
  "UnsupportedResource",
)({
  logicalResourceId: LogicalResourceId,
  physicalResourceId: PhysicalResourceId,
  resourceType: S.String,
  unsupportedResourceStatus: S.optional(S.String),
}) {}
export const UnsupportedResourceList = S.Array(UnsupportedResource);
export const SuggestedChangesList = S.Array(S.String);
export class AddDraftAppVersionResourceMappingsRequest extends S.Class<AddDraftAppVersionResourceMappingsRequest>(
  "AddDraftAppVersionResourceMappingsRequest",
)(
  { appArn: S.String, resourceMappings: ResourceMappingList },
  T.all(
    T.Http({ method: "POST", uri: "/add-draft-app-version-resource-mappings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateRecommendationStatusRequest extends S.Class<BatchUpdateRecommendationStatusRequest>(
  "BatchUpdateRecommendationStatusRequest",
)(
  {
    appArn: S.String,
    requestEntries: UpdateRecommendationStatusRequestEntries,
  },
  T.all(
    T.Http({ method: "POST", uri: "/batch-update-recommendation-status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAppResponse extends S.Class<CreateAppResponse>(
  "CreateAppResponse",
)({ app: App }) {}
export class CreateAppVersionAppComponentResponse extends S.Class<CreateAppVersionAppComponentResponse>(
  "CreateAppVersionAppComponentResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  appComponent: S.optional(AppComponent),
}) {}
export class CreateAppVersionResourceResponse extends S.Class<CreateAppVersionResourceResponse>(
  "CreateAppVersionResourceResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  physicalResource: S.optional(PhysicalResource),
}) {}
export class CreateRecommendationTemplateResponse extends S.Class<CreateRecommendationTemplateResponse>(
  "CreateRecommendationTemplateResponse",
)({ recommendationTemplate: S.optional(RecommendationTemplate) }) {}
export class CreateResiliencyPolicyRequest extends S.Class<CreateResiliencyPolicyRequest>(
  "CreateResiliencyPolicyRequest",
)(
  {
    policyName: S.String,
    policyDescription: S.optional(S.String),
    dataLocationConstraint: S.optional(S.String),
    tier: S.String,
    policy: DisruptionPolicy,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-resiliency-policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppInputSourceResponse extends S.Class<DeleteAppInputSourceResponse>(
  "DeleteAppInputSourceResponse",
)({
  appArn: S.optional(S.String),
  appInputSource: S.optional(AppInputSource),
}) {}
export class DeleteAppVersionAppComponentResponse extends S.Class<DeleteAppVersionAppComponentResponse>(
  "DeleteAppVersionAppComponentResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  appComponent: S.optional(AppComponent),
}) {}
export class DeleteAppVersionResourceResponse extends S.Class<DeleteAppVersionResourceResponse>(
  "DeleteAppVersionResourceResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  physicalResource: S.optional(PhysicalResource),
}) {}
export class DescribeAppResponse extends S.Class<DescribeAppResponse>(
  "DescribeAppResponse",
)({ app: App }) {}
export class DescribeDraftAppVersionResourcesImportStatusResponse extends S.Class<DescribeDraftAppVersionResourcesImportStatusResponse>(
  "DescribeDraftAppVersionResourcesImportStatusResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  status: S.String,
  statusChangeTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  errorMessage: S.optional(S.String),
  errorDetails: S.optional(ErrorDetailList),
}) {}
export class DescribeMetricsExportResponse extends S.Class<DescribeMetricsExportResponse>(
  "DescribeMetricsExportResponse",
)({
  metricsExportId: S.String,
  status: S.String,
  exportLocation: S.optional(S3Location),
  errorMessage: S.optional(S.String),
}) {}
export class DescribeResiliencyPolicyResponse extends S.Class<DescribeResiliencyPolicyResponse>(
  "DescribeResiliencyPolicyResponse",
)({ policy: ResiliencyPolicy }) {}
export class ImportResourcesToDraftAppVersionResponse extends S.Class<ImportResourcesToDraftAppVersionResponse>(
  "ImportResourcesToDraftAppVersionResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  sourceArns: S.optional(ArnList),
  status: S.String,
  terraformSources: S.optional(TerraformSourceList),
  eksSources: S.optional(EksSourceList),
}) {}
export class ListAppAssessmentComplianceDriftsResponse extends S.Class<ListAppAssessmentComplianceDriftsResponse>(
  "ListAppAssessmentComplianceDriftsResponse",
)({ complianceDrifts: ComplianceDriftList, nextToken: S.optional(S.String) }) {}
export class ListAppAssessmentsResponse extends S.Class<ListAppAssessmentsResponse>(
  "ListAppAssessmentsResponse",
)({
  nextToken: S.optional(S.String),
  assessmentSummaries: AppAssessmentSummaryList,
}) {}
export class ListAppComponentCompliancesResponse extends S.Class<ListAppComponentCompliancesResponse>(
  "ListAppComponentCompliancesResponse",
)({
  componentCompliances: ComponentCompliancesList,
  nextToken: S.optional(S.String),
}) {}
export class ListAppInputSourcesResponse extends S.Class<ListAppInputSourcesResponse>(
  "ListAppInputSourcesResponse",
)({ appInputSources: AppInputSourceList, nextToken: S.optional(S.String) }) {}
export class ListAppsResponse extends S.Class<ListAppsResponse>(
  "ListAppsResponse",
)({ appSummaries: AppSummaryList, nextToken: S.optional(S.String) }) {}
export class ListAppVersionsResponse extends S.Class<ListAppVersionsResponse>(
  "ListAppVersionsResponse",
)({ appVersions: AppVersionList, nextToken: S.optional(S.String) }) {}
export class ListMetricsResponse extends S.Class<ListMetricsResponse>(
  "ListMetricsResponse",
)({ rows: RowList, nextToken: S.optional(S.String) }) {}
export class ListSopRecommendationsResponse extends S.Class<ListSopRecommendationsResponse>(
  "ListSopRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  sopRecommendations: SopRecommendationList,
}) {}
export class ListTestRecommendationsResponse extends S.Class<ListTestRecommendationsResponse>(
  "ListTestRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  testRecommendations: TestRecommendationList,
}) {}
export class ListUnsupportedAppVersionResourcesResponse extends S.Class<ListUnsupportedAppVersionResourcesResponse>(
  "ListUnsupportedAppVersionResourcesResponse",
)({
  unsupportedResources: UnsupportedResourceList,
  resolutionId: S.String,
  nextToken: S.optional(S.String),
}) {}
export class FailedGroupingRecommendationEntry extends S.Class<FailedGroupingRecommendationEntry>(
  "FailedGroupingRecommendationEntry",
)({ groupingRecommendationId: S.String, errorMessage: S.String }) {}
export const FailedGroupingRecommendationEntries = S.Array(
  FailedGroupingRecommendationEntry,
);
export class RejectResourceGroupingRecommendationsResponse extends S.Class<RejectResourceGroupingRecommendationsResponse>(
  "RejectResourceGroupingRecommendationsResponse",
)({ appArn: S.String, failedEntries: FailedGroupingRecommendationEntries }) {}
export class ResourceIdentifier extends S.Class<ResourceIdentifier>(
  "ResourceIdentifier",
)({
  logicalResourceId: S.optional(LogicalResourceId),
  resourceType: S.optional(S.String),
}) {}
export class GroupingAppComponent extends S.Class<GroupingAppComponent>(
  "GroupingAppComponent",
)({
  appComponentId: S.String,
  appComponentType: S.String,
  appComponentName: S.String,
}) {}
export class GroupingResource extends S.Class<GroupingResource>(
  "GroupingResource",
)({
  resourceName: S.String,
  resourceType: S.String,
  physicalResourceId: PhysicalResourceId,
  logicalResourceId: LogicalResourceId,
  sourceAppComponentIds: String255List,
}) {}
export const GroupingResourceList = S.Array(GroupingResource);
export class ResourceDrift extends S.Class<ResourceDrift>("ResourceDrift")({
  appArn: S.optional(S.String),
  appVersion: S.optional(S.String),
  referenceId: S.optional(S.String),
  resourceIdentifier: S.optional(ResourceIdentifier),
  diffType: S.optional(S.String),
}) {}
export const ResourceDriftList = S.Array(ResourceDrift);
export class GroupingRecommendation extends S.Class<GroupingRecommendation>(
  "GroupingRecommendation",
)({
  groupingRecommendationId: S.String,
  groupingAppComponent: GroupingAppComponent,
  resources: GroupingResourceList,
  score: S.Number,
  recommendationReasons: String255List,
  status: S.String,
  confidenceLevel: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  rejectionReason: S.optional(S.String),
}) {}
export const GroupingRecommendationList = S.Array(GroupingRecommendation);
export class AcceptResourceGroupingRecommendationsResponse extends S.Class<AcceptResourceGroupingRecommendationsResponse>(
  "AcceptResourceGroupingRecommendationsResponse",
)({ appArn: S.String, failedEntries: FailedGroupingRecommendationEntries }) {}
export class AddDraftAppVersionResourceMappingsResponse extends S.Class<AddDraftAppVersionResourceMappingsResponse>(
  "AddDraftAppVersionResourceMappingsResponse",
)({
  appArn: S.String,
  appVersion: S.String,
  resourceMappings: ResourceMappingList,
}) {}
export class CreateResiliencyPolicyResponse extends S.Class<CreateResiliencyPolicyResponse>(
  "CreateResiliencyPolicyResponse",
)({ policy: ResiliencyPolicy }) {}
export class ListAppAssessmentResourceDriftsResponse extends S.Class<ListAppAssessmentResourceDriftsResponse>(
  "ListAppAssessmentResourceDriftsResponse",
)({ resourceDrifts: ResourceDriftList, nextToken: S.optional(S.String) }) {}
export class ListResourceGroupingRecommendationsResponse extends S.Class<ListResourceGroupingRecommendationsResponse>(
  "ListResourceGroupingRecommendationsResponse",
)({
  groupingRecommendations: GroupingRecommendationList,
  nextToken: S.optional(S.String),
}) {}
export class RecommendationDisruptionCompliance extends S.Class<RecommendationDisruptionCompliance>(
  "RecommendationDisruptionCompliance",
)({
  expectedComplianceStatus: S.String,
  expectedRtoInSecs: S.optional(S.Number),
  expectedRtoDescription: S.optional(S.String),
  expectedRpoInSecs: S.optional(S.Number),
  expectedRpoDescription: S.optional(S.String),
}) {}
export class BatchUpdateRecommendationStatusSuccessfulEntry extends S.Class<BatchUpdateRecommendationStatusSuccessfulEntry>(
  "BatchUpdateRecommendationStatusSuccessfulEntry",
)({
  entryId: S.String,
  referenceId: S.String,
  item: S.optional(UpdateRecommendationStatusItem),
  excluded: S.Boolean,
  appComponentId: S.optional(S.String),
  excludeReason: S.optional(S.String),
}) {}
export const BatchUpdateRecommendationStatusSuccessfulEntries = S.Array(
  BatchUpdateRecommendationStatusSuccessfulEntry,
);
export class BatchUpdateRecommendationStatusFailedEntry extends S.Class<BatchUpdateRecommendationStatusFailedEntry>(
  "BatchUpdateRecommendationStatusFailedEntry",
)({ entryId: S.String, errorMessage: S.String }) {}
export const BatchUpdateRecommendationStatusFailedEntries = S.Array(
  BatchUpdateRecommendationStatusFailedEntry,
);
export class AlarmRecommendation extends S.Class<AlarmRecommendation>(
  "AlarmRecommendation",
)({
  recommendationId: S.String,
  referenceId: S.String,
  name: S.String,
  description: S.optional(S.String),
  type: S.String,
  appComponentName: S.optional(S.String),
  items: S.optional(RecommendationItemList),
  prerequisite: S.optional(S.String),
  appComponentNames: S.optional(AppComponentNameList),
  recommendationStatus: S.optional(S.String),
}) {}
export const AlarmRecommendationList = S.Array(AlarmRecommendation);
export const RecommendationCompliance = S.Record({
  key: S.String,
  value: RecommendationDisruptionCompliance,
});
export class BatchUpdateRecommendationStatusResponse extends S.Class<BatchUpdateRecommendationStatusResponse>(
  "BatchUpdateRecommendationStatusResponse",
)({
  appArn: S.String,
  successfulEntries: BatchUpdateRecommendationStatusSuccessfulEntries,
  failedEntries: BatchUpdateRecommendationStatusFailedEntries,
}) {}
export class ListAlarmRecommendationsResponse extends S.Class<ListAlarmRecommendationsResponse>(
  "ListAlarmRecommendationsResponse",
)({
  alarmRecommendations: AlarmRecommendationList,
  nextToken: S.optional(S.String),
}) {}
export class ConfigRecommendation extends S.Class<ConfigRecommendation>(
  "ConfigRecommendation",
)({
  cost: S.optional(Cost),
  appComponentName: S.optional(S.String),
  compliance: S.optional(AssessmentCompliance),
  recommendationCompliance: S.optional(RecommendationCompliance),
  optimizationType: S.String,
  name: S.String,
  description: S.optional(S.String),
  suggestedChanges: S.optional(SuggestedChangesList),
  haArchitecture: S.optional(S.String),
  referenceId: S.String,
}) {}
export const ConfigRecommendationList = S.Array(ConfigRecommendation);
export class ComponentRecommendation extends S.Class<ComponentRecommendation>(
  "ComponentRecommendation",
)({
  appComponentName: S.String,
  recommendationStatus: S.String,
  configRecommendations: ConfigRecommendationList,
}) {}
export const ComponentRecommendationList = S.Array(ComponentRecommendation);
export class DescribeAppAssessmentResponse extends S.Class<DescribeAppAssessmentResponse>(
  "DescribeAppAssessmentResponse",
)({ assessment: AppAssessment }) {}
export class ListAppComponentRecommendationsResponse extends S.Class<ListAppComponentRecommendationsResponse>(
  "ListAppComponentRecommendationsResponse",
)({
  componentRecommendations: ComponentRecommendationList,
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
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
  {},
) {}

//# Operations
/**
 * Describes the Resilience Hub application version.
 */
export const describeAppVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppVersionRequest,
  output: DescribeAppVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes an Application Component in the Resilience Hub application.
 */
export const describeAppVersionAppComponent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAppVersionAppComponentRequest,
    output: DescribeAppVersionAppComponentResponse,
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
 * Describes a resource of the Resilience Hub application.
 *
 * This API accepts only one of the following parameters to describe the resource:
 *
 * - `resourceName`
 *
 * - `logicalResourceId`
 *
 * - `physicalResourceId` (Along with `physicalResourceId`, you can
 * also provide `awsAccountId`, and `awsRegion`)
 */
export const describeAppVersionResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAppVersionResourceRequest,
    output: DescribeAppVersionResourceResponse,
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
 * Returns the resolution status for the specified resolution identifier for an application
 * version. If `resolutionId` is not specified, the current resolution status is
 * returned.
 */
export const describeAppVersionResourcesResolutionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAppVersionResourcesResolutionStatusRequest,
    output: DescribeAppVersionResourcesResolutionStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Describes details about an Resilience Hub application.
 */
export const describeAppVersionTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAppVersionTemplateRequest,
    output: DescribeAppVersionTemplateResponse,
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
 * Describes the resource grouping recommendation tasks run by Resilience Hub for your application.
 */
export const describeResourceGroupingRecommendationTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeResourceGroupingRecommendationTaskRequest,
    output: DescribeResourceGroupingRecommendationTaskResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists all the Application Components in the Resilience Hub application.
 */
export const listAppVersionAppComponents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAppVersionAppComponentsRequest,
    output: ListAppVersionAppComponentsResponse,
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
 * Lists how the resources in an application version are mapped/sourced from. Mappings can be
 * physical resource identifiers, CloudFormation stacks, resource-groups, or an application registry
 * app.
 */
export const listAppVersionResourceMappings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAppVersionResourceMappingsRequest,
    output: ListAppVersionResourceMappingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists all the resources in an Resilience Hub application.
 */
export const listAppVersionResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAppVersionResourcesRequest,
    output: ListAppVersionResourcesResponse,
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
 * Lists the recommendation templates for the Resilience Hub applications.
 */
export const listRecommendationTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRecommendationTemplatesRequest,
    output: ListRecommendationTemplatesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the resiliency policies for the Resilience Hub applications.
 */
export const listResiliencyPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResiliencyPoliciesRequest,
    output: ListResiliencyPoliciesResponse,
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
 * Lists the suggested resiliency policies for the Resilience Hub
 * applications.
 */
export const listSuggestedResiliencyPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSuggestedResiliencyPoliciesRequest,
    output: ListSuggestedResiliencyPoliciesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the tags for your resources in your Resilience Hub applications.
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
 * Publishes a new version of a specific Resilience Hub application.
 */
export const publishAppVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishAppVersionRequest,
  output: PublishAppVersionResponse,
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
 * Adds or updates the app template for an Resilience Hub application draft
 * version.
 */
export const putDraftAppVersionTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutDraftAppVersionTemplateRequest,
    output: PutDraftAppVersionTemplateResponse,
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
 * Removes resource mappings from a draft application version.
 */
export const removeDraftAppVersionResourceMappings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveDraftAppVersionResourceMappingsRequest,
    output: RemoveDraftAppVersionResourceMappingsResponse,
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
 * Resolves the resources for an application version.
 */
export const resolveAppVersionResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResolveAppVersionResourcesRequest,
    output: ResolveAppVersionResourcesResponse,
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
 * Initiates the export task of metrics.
 */
export const startMetricsExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMetricsExportRequest,
  output: StartMetricsExportResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts grouping recommendation task.
 */
export const startResourceGroupingRecommendationTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartResourceGroupingRecommendationTaskRequest,
    output: StartResourceGroupingRecommendationTaskResponse,
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
 * Applies one or more tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from a resource.
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
 * Updates an application.
 */
export const updateApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppRequest,
  output: UpdateAppResponse,
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
 * Updates the Resilience Hub application version.
 *
 * This API updates the Resilience Hub application draft version. To use this
 * information for running resiliency assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 */
export const updateAppVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppVersionRequest,
  output: UpdateAppVersionResponse,
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
 * Updates an existing Application Component in the Resilience Hub application.
 *
 * This API updates the Resilience Hub application draft version. To use this
 * Application Component for running assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 */
export const updateAppVersionAppComponent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAppVersionAppComponentRequest,
    output: UpdateAppVersionAppComponentResponse,
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
 * Updates the resource details in the Resilience Hub application.
 *
 * - This action has no effect outside Resilience Hub.
 *
 * - This API updates the Resilience Hub application draft version. To use this
 * resource for running resiliency assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 *
 * - To update application version with new `physicalResourceID`, you must
 * call `ResolveAppVersionResources` API.
 */
export const updateAppVersionResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAppVersionResourceRequest,
    output: UpdateAppVersionResourceResponse,
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
 * Updates a resiliency policy.
 *
 * Resilience Hub allows you to provide a value of zero for `rtoInSecs`
 * and `rpoInSecs` of your resiliency policy. But, while assessing your application,
 * the lowest possible assessment result is near zero. Hence, if you provide value zero for
 * `rtoInSecs` and `rpoInSecs`, the estimated workload RTO and
 * estimated workload RPO result will be near zero and the Compliance
 * status for your application will be set to Policy
 * breached.
 */
export const updateResiliencyPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateResiliencyPolicyRequest,
    output: UpdateResiliencyPolicyResponse,
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
 * Creates an Resilience Hub application. An Resilience Hub application is a
 * collection of Amazon Web Services resources structured to prevent and recover Amazon Web Services application disruptions. To describe a Resilience Hub application, you provide an
 * application name, resources from one or more CloudFormation stacks, Resource Groups, Terraform state files, AppRegistry applications, and an appropriate
 * resiliency policy. In addition, you can also add resources that are located on Amazon Elastic Kubernetes Service (Amazon EKS) clusters as optional resources. For more information
 * about the number of resources supported per application, see Service
 * quotas.
 *
 * After you create an Resilience Hub application, you publish it so that you can run
 * a resiliency assessment on it. You can then use recommendations from the assessment to improve
 * resiliency by running another assessment, comparing results, and then iterating the process
 * until you achieve your goals for recovery time objective (RTO) and recovery point objective
 * (RPO).
 */
export const createApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppRequest,
  output: CreateAppResponse,
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
 * Creates a new Application Component in the Resilience Hub application.
 *
 * This API updates the Resilience Hub application draft version. To use this
 * Application Component for running assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 */
export const createAppVersionAppComponent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAppVersionAppComponentRequest,
    output: CreateAppVersionAppComponentResponse,
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
 * Adds a resource to the Resilience Hub application and assigns it to the specified
 * Application Components. If you specify a new Application Component, Resilience Hub will
 * automatically create the Application Component.
 *
 * - This action has no effect outside Resilience Hub.
 *
 * - This API updates the Resilience Hub application draft version. To use this
 * resource for running resiliency assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 *
 * - To update application version with new `physicalResourceID`, you must
 * call `ResolveAppVersionResources` API.
 */
export const createAppVersionResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAppVersionResourceRequest,
    output: CreateAppVersionResourceResponse,
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
 * Creates a new recommendation template for the Resilience Hub application.
 */
export const createRecommendationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRecommendationTemplateRequest,
    output: CreateRecommendationTemplateResponse,
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
 * Deletes an Resilience Hub application. This is a destructive action that can't be
 * undone.
 */
export const deleteApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppRequest,
  output: DeleteAppResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an Resilience Hub application assessment. This is a destructive action
 * that can't be undone.
 */
export const deleteAppAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppAssessmentRequest,
  output: DeleteAppAssessmentResponse,
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
 * Deletes the input source and all of its imported resources from the Resilience Hub
 * application.
 */
export const deleteAppInputSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAppInputSourceRequest,
    output: DeleteAppInputSourceResponse,
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
 * Deletes an Application Component from the Resilience Hub application.
 *
 * - This API updates the Resilience Hub application draft version. To use this
 * Application Component for running assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 *
 * - You will not be able to delete an Application Component if it has resources associated
 * with it.
 */
export const deleteAppVersionAppComponent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAppVersionAppComponentRequest,
    output: DeleteAppVersionAppComponentResponse,
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
 * Deletes a resource from the Resilience Hub application.
 *
 * - You can only delete a manually added resource. To exclude non-manually added
 * resources, use the `UpdateAppVersionResource` API.
 *
 * - This action has no effect outside Resilience Hub.
 *
 * - This API updates the Resilience Hub application draft version. To use this
 * resource for running resiliency assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 */
export const deleteAppVersionResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAppVersionResourceRequest,
    output: DeleteAppVersionResourceResponse,
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
 * Deletes a recommendation template. This is a destructive action that can't be
 * undone.
 */
export const deleteRecommendationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRecommendationTemplateRequest,
    output: DeleteRecommendationTemplateResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes a resiliency policy. This is a destructive action that can't be undone.
 */
export const deleteResiliencyPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResiliencyPolicyRequest,
    output: DeleteResiliencyPolicyResponse,
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
 * Describes an Resilience Hub application.
 */
export const describeApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppRequest,
  output: DescribeAppResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the status of importing resources to an application version.
 *
 * If you get a 404 error with
 * `ResourceImportStatusNotFoundAppMetadataException`, you must call
 * `importResourcesToDraftAppVersion` after creating the application and before
 * calling `describeDraftAppVersionResourcesImportStatus` to obtain the
 * status.
 */
export const describeDraftAppVersionResourcesImportStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDraftAppVersionResourcesImportStatusRequest,
    output: DescribeDraftAppVersionResourcesImportStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Describes the metrics of the application configuration being exported.
 */
export const describeMetricsExport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMetricsExportRequest,
    output: DescribeMetricsExportResponse,
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
 * Describes a specified resiliency policy for an Resilience Hub application. The
 * returned policy object includes creation time, data location constraints, the Amazon Resource
 * Name (ARN) for the policy, tags, tier, and more.
 */
export const describeResiliencyPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeResiliencyPolicyRequest,
    output: DescribeResiliencyPolicyResponse,
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
 * Imports resources to Resilience Hub application draft version from different input
 * sources. For more information about the input sources supported by Resilience Hub, see
 * Discover the structure and describe your Resilience Hub application.
 */
export const importResourcesToDraftAppVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ImportResourcesToDraftAppVersionRequest,
    output: ImportResourcesToDraftAppVersionResponse,
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
 * List of compliance drifts that were detected while running an
 * assessment.
 */
export const listAppAssessmentComplianceDrifts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAppAssessmentComplianceDriftsRequest,
    output: ListAppAssessmentComplianceDriftsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the assessments for an Resilience Hub application. You can use request
 * parameters to refine the results for the response object.
 */
export const listAppAssessments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAppAssessmentsRequest,
  output: ListAppAssessmentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the compliances for an Resilience Hub Application Component.
 */
export const listAppComponentCompliances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAppComponentCompliancesRequest,
    output: ListAppComponentCompliancesResponse,
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
 * Lists all the input sources of the Resilience Hub application. For more
 * information about the input sources supported by Resilience Hub, see Discover
 * the structure and describe your Resilience Hub application.
 */
export const listAppInputSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAppInputSourcesRequest,
  output: ListAppInputSourcesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists your Resilience Hub applications.
 *
 * You can filter applications using only one filter at a time or without using any filter.
 * If you try to filter applications using multiple filters, you will get the following
 * error:
 *
 * An error occurred (ValidationException) when calling the ListApps operation: Only
 * one filter is supported for this operation.
 */
export const listApps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAppsRequest,
  output: ListAppsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the different versions for the Resilience Hub applications.
 */
export const listAppVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAppVersionsRequest,
  output: ListAppVersionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the metrics that can be exported.
 */
export const listMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMetricsRequest,
  output: ListMetricsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the standard operating procedure (SOP) recommendations for the Resilience Hub applications.
 */
export const listSopRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSopRecommendationsRequest,
    output: ListSopRecommendationsResponse,
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
 * Lists the test recommendations for the Resilience Hub application.
 */
export const listTestRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTestRecommendationsRequest,
    output: ListTestRecommendationsResponse,
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
 * Lists the resources that are not currently supported in Resilience Hub. An
 * unsupported resource is a resource that exists in the object that was used to create an app,
 * but is not supported by Resilience Hub.
 */
export const listUnsupportedAppVersionResources =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListUnsupportedAppVersionResourcesRequest,
    output: ListUnsupportedAppVersionResourcesResponse,
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
 * Rejects resource grouping recommendations.
 */
export const rejectResourceGroupingRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RejectResourceGroupingRecommendationsRequest,
    output: RejectResourceGroupingRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a new application assessment for an application.
 */
export const startAppAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAppAssessmentRequest,
  output: StartAppAssessmentResponse,
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
 * Accepts the resource grouping recommendations suggested by Resilience Hub for your application.
 */
export const acceptResourceGroupingRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptResourceGroupingRecommendationsRequest,
    output: AcceptResourceGroupingRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Adds the source of resource-maps to the draft version of an application. During
 * assessment, Resilience Hub will use these resource-maps to resolve the latest physical
 * ID for each resource in the application template. For more information about different types
 * of resources supported by Resilience Hub and how to add them in your application, see
 * Step
 * 2: How is your application managed? in the Resilience Hub User Guide.
 */
export const addDraftAppVersionResourceMappings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AddDraftAppVersionResourceMappingsRequest,
    output: AddDraftAppVersionResourceMappingsResponse,
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
 * Creates a resiliency policy for an application.
 *
 * Resilience Hub allows you to provide a value of zero for `rtoInSecs`
 * and `rpoInSecs` of your resiliency policy. But, while assessing your application,
 * the lowest possible assessment result is near zero. Hence, if you provide value zero for
 * `rtoInSecs` and `rpoInSecs`, the estimated workload RTO and
 * estimated workload RPO result will be near zero and the Compliance
 * status for your application will be set to Policy
 * breached.
 */
export const createResiliencyPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateResiliencyPolicyRequest,
    output: CreateResiliencyPolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * List of resource drifts that were detected while running an
 * assessment.
 */
export const listAppAssessmentResourceDrifts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAppAssessmentResourceDriftsRequest,
    output: ListAppAssessmentResourceDriftsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the resource grouping recommendations suggested by Resilience Hub for your application.
 */
export const listResourceGroupingRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListResourceGroupingRecommendationsRequest,
    output: ListResourceGroupingRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Enables you to include or exclude one or more operational recommendations.
 */
export const batchUpdateRecommendationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchUpdateRecommendationStatusRequest,
    output: BatchUpdateRecommendationStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the alarm recommendations for an Resilience Hub application.
 */
export const listAlarmRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAlarmRecommendationsRequest,
    output: ListAlarmRecommendationsResponse,
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
 * Describes an assessment for an Resilience Hub application.
 */
export const describeAppAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAppAssessmentRequest,
    output: DescribeAppAssessmentResponse,
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
 * Lists the recommendations for an Resilience Hub Application Component.
 */
export const listAppComponentRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAppComponentRecommendationsRequest,
    output: ListAppComponentRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "amp",
  serviceShapeName: "AmazonPrometheusService",
});
const auth = T.AwsAuthSigv4({ name: "aps" });
const ver = T.ServiceVersion("2020-08-01");
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
                        url: "https://aps-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://aps-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://aps.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://aps.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetDefaultScraperConfigurationRequest extends S.Class<GetDefaultScraperConfigurationRequest>(
  "GetDefaultScraperConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/scraperconfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagKeys = S.Array(S.String);
export class GetDefaultScraperConfigurationResponse extends S.Class<GetDefaultScraperConfigurationResponse>(
  "GetDefaultScraperConfigurationResponse",
)({ configuration: T.Blob }) {}
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export class DescribeScraperRequest extends S.Class<DescribeScraperRequest>(
  "DescribeScraperRequest",
)(
  { scraperId: S.String.pipe(T.HttpLabel("scraperId")) },
  T.all(
    T.Http({ method: "GET", uri: "/scrapers/{scraperId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ScrapeConfiguration = S.Union(
  S.Struct({ configurationBlob: T.Blob }),
);
export class AmpConfiguration extends S.Class<AmpConfiguration>(
  "AmpConfiguration",
)({ workspaceArn: S.String }) {}
export const Destination = S.Union(
  S.Struct({ ampConfiguration: AmpConfiguration }),
);
export class RoleConfiguration extends S.Class<RoleConfiguration>(
  "RoleConfiguration",
)({
  sourceRoleArn: S.optional(S.String),
  targetRoleArn: S.optional(S.String),
}) {}
export class UpdateScraperRequest extends S.Class<UpdateScraperRequest>(
  "UpdateScraperRequest",
)(
  {
    scraperId: S.String.pipe(T.HttpLabel("scraperId")),
    alias: S.optional(S.String),
    scrapeConfiguration: S.optional(ScrapeConfiguration),
    destination: S.optional(Destination),
    roleConfiguration: S.optional(RoleConfiguration),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/scrapers/{scraperId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScraperRequest extends S.Class<DeleteScraperRequest>(
  "DeleteScraperRequest",
)(
  {
    scraperId: S.String.pipe(T.HttpLabel("scraperId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/scrapers/{scraperId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeScraperLoggingConfigurationRequest extends S.Class<DescribeScraperLoggingConfigurationRequest>(
  "DescribeScraperLoggingConfigurationRequest",
)(
  { scraperId: S.String.pipe(T.HttpLabel("scraperId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/scrapers/{scraperId}/logging-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScraperLoggingConfigurationRequest extends S.Class<DeleteScraperLoggingConfigurationRequest>(
  "DeleteScraperLoggingConfigurationRequest",
)(
  {
    scraperId: S.String.pipe(T.HttpLabel("scraperId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/scrapers/{scraperId}/logging-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScraperLoggingConfigurationResponse extends S.Class<DeleteScraperLoggingConfigurationResponse>(
  "DeleteScraperLoggingConfigurationResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateWorkspaceRequest extends S.Class<CreateWorkspaceRequest>(
  "CreateWorkspaceRequest",
)(
  {
    alias: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workspaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeWorkspaceRequest extends S.Class<DescribeWorkspaceRequest>(
  "DescribeWorkspaceRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkspaceAliasRequest extends S.Class<UpdateWorkspaceAliasRequest>(
  "UpdateWorkspaceAliasRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    alias: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workspaces/{workspaceId}/alias" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkspaceAliasResponse extends S.Class<UpdateWorkspaceAliasResponse>(
  "UpdateWorkspaceAliasResponse",
)({}) {}
export class DeleteWorkspaceRequest extends S.Class<DeleteWorkspaceRequest>(
  "DeleteWorkspaceRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/workspaces/{workspaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkspaceResponse extends S.Class<DeleteWorkspaceResponse>(
  "DeleteWorkspaceResponse",
)({}) {}
export class ListWorkspacesRequest extends S.Class<ListWorkspacesRequest>(
  "ListWorkspacesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    alias: S.optional(S.String).pipe(T.HttpQuery("alias")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAlertManagerDefinitionRequest extends S.Class<CreateAlertManagerDefinitionRequest>(
  "CreateAlertManagerDefinitionRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    data: T.Blob,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{workspaceId}/alertmanager/definition",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAlertManagerDefinitionRequest extends S.Class<DescribeAlertManagerDefinitionRequest>(
  "DescribeAlertManagerDefinitionRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workspaces/{workspaceId}/alertmanager/definition",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAlertManagerDefinitionRequest extends S.Class<PutAlertManagerDefinitionRequest>(
  "PutAlertManagerDefinitionRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    data: T.Blob,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workspaces/{workspaceId}/alertmanager/definition",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAlertManagerDefinitionRequest extends S.Class<DeleteAlertManagerDefinitionRequest>(
  "DeleteAlertManagerDefinitionRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{workspaceId}/alertmanager/definition",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAlertManagerDefinitionResponse extends S.Class<DeleteAlertManagerDefinitionResponse>(
  "DeleteAlertManagerDefinitionResponse",
)({}) {}
export const AnomalyDetectorMissingDataAction = S.Union(
  S.Struct({ markAsAnomaly: S.Boolean }),
  S.Struct({ skip: S.Boolean }),
);
export const IgnoreNearExpected = S.Union(
  S.Struct({ amount: S.Number }),
  S.Struct({ ratio: S.Number }),
);
export class RandomCutForestConfiguration extends S.Class<RandomCutForestConfiguration>(
  "RandomCutForestConfiguration",
)({
  query: S.String,
  shingleSize: S.optional(S.Number),
  sampleSize: S.optional(S.Number),
  ignoreNearExpectedFromAbove: S.optional(IgnoreNearExpected),
  ignoreNearExpectedFromBelow: S.optional(IgnoreNearExpected),
}) {}
export const AnomalyDetectorConfiguration = S.Union(
  S.Struct({ randomCutForest: RandomCutForestConfiguration }),
);
export const PrometheusMetricLabelMap = S.Record({
  key: S.String,
  value: S.String,
});
export class PutAnomalyDetectorRequest extends S.Class<PutAnomalyDetectorRequest>(
  "PutAnomalyDetectorRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    anomalyDetectorId: S.String.pipe(T.HttpLabel("anomalyDetectorId")),
    evaluationIntervalInSeconds: S.optional(S.Number),
    missingDataAction: S.optional(AnomalyDetectorMissingDataAction),
    configuration: AnomalyDetectorConfiguration,
    labels: S.optional(PrometheusMetricLabelMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workspaces/{workspaceId}/anomalydetectors/{anomalyDetectorId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAnomalyDetectorRequest extends S.Class<DescribeAnomalyDetectorRequest>(
  "DescribeAnomalyDetectorRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    anomalyDetectorId: S.String.pipe(T.HttpLabel("anomalyDetectorId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workspaces/{workspaceId}/anomalydetectors/{anomalyDetectorId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnomalyDetectorRequest extends S.Class<DeleteAnomalyDetectorRequest>(
  "DeleteAnomalyDetectorRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    anomalyDetectorId: S.String.pipe(T.HttpLabel("anomalyDetectorId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{workspaceId}/anomalydetectors/{anomalyDetectorId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnomalyDetectorResponse extends S.Class<DeleteAnomalyDetectorResponse>(
  "DeleteAnomalyDetectorResponse",
)({}) {}
export class ListAnomalyDetectorsRequest extends S.Class<ListAnomalyDetectorsRequest>(
  "ListAnomalyDetectorsRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    alias: S.optional(S.String).pipe(T.HttpQuery("alias")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workspaces/{workspaceId}/anomalydetectors",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLoggingConfigurationRequest extends S.Class<CreateLoggingConfigurationRequest>(
  "CreateLoggingConfigurationRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    logGroupArn: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workspaces/{workspaceId}/logging" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeLoggingConfigurationRequest extends S.Class<DescribeLoggingConfigurationRequest>(
  "DescribeLoggingConfigurationRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}/logging" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLoggingConfigurationRequest extends S.Class<UpdateLoggingConfigurationRequest>(
  "UpdateLoggingConfigurationRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    logGroupArn: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/workspaces/{workspaceId}/logging" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLoggingConfigurationRequest extends S.Class<DeleteLoggingConfigurationRequest>(
  "DeleteLoggingConfigurationRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/workspaces/{workspaceId}/logging" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLoggingConfigurationResponse extends S.Class<DeleteLoggingConfigurationResponse>(
  "DeleteLoggingConfigurationResponse",
)({}) {}
export class DescribeQueryLoggingConfigurationRequest extends S.Class<DescribeQueryLoggingConfigurationRequest>(
  "DescribeQueryLoggingConfigurationRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}/logging/query" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CloudWatchLogDestination extends S.Class<CloudWatchLogDestination>(
  "CloudWatchLogDestination",
)({ logGroupArn: S.String }) {}
export class LoggingFilter extends S.Class<LoggingFilter>("LoggingFilter")({
  qspThreshold: S.Number,
}) {}
export class LoggingDestination extends S.Class<LoggingDestination>(
  "LoggingDestination",
)({ cloudWatchLogs: CloudWatchLogDestination, filters: LoggingFilter }) {}
export const LoggingDestinations = S.Array(LoggingDestination);
export class UpdateQueryLoggingConfigurationRequest extends S.Class<UpdateQueryLoggingConfigurationRequest>(
  "UpdateQueryLoggingConfigurationRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    destinations: LoggingDestinations,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/workspaces/{workspaceId}/logging/query" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueryLoggingConfigurationRequest extends S.Class<DeleteQueryLoggingConfigurationRequest>(
  "DeleteQueryLoggingConfigurationRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{workspaceId}/logging/query",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueryLoggingConfigurationResponse extends S.Class<DeleteQueryLoggingConfigurationResponse>(
  "DeleteQueryLoggingConfigurationResponse",
)({}) {}
export class CreateRuleGroupsNamespaceRequest extends S.Class<CreateRuleGroupsNamespaceRequest>(
  "CreateRuleGroupsNamespaceRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    name: S.String,
    data: T.Blob,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{workspaceId}/rulegroupsnamespaces",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRuleGroupsNamespaceRequest extends S.Class<DescribeRuleGroupsNamespaceRequest>(
  "DescribeRuleGroupsNamespaceRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workspaces/{workspaceId}/rulegroupsnamespaces/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRuleGroupsNamespaceRequest extends S.Class<PutRuleGroupsNamespaceRequest>(
  "PutRuleGroupsNamespaceRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    data: T.Blob,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workspaces/{workspaceId}/rulegroupsnamespaces/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRuleGroupsNamespaceRequest extends S.Class<DeleteRuleGroupsNamespaceRequest>(
  "DeleteRuleGroupsNamespaceRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{workspaceId}/rulegroupsnamespaces/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRuleGroupsNamespaceResponse extends S.Class<DeleteRuleGroupsNamespaceResponse>(
  "DeleteRuleGroupsNamespaceResponse",
)({}) {}
export class ListRuleGroupsNamespacesRequest extends S.Class<ListRuleGroupsNamespacesRequest>(
  "ListRuleGroupsNamespacesRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workspaces/{workspaceId}/rulegroupsnamespaces",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeWorkspaceConfigurationRequest extends S.Class<DescribeWorkspaceConfigurationRequest>(
  "DescribeWorkspaceConfigurationRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    policyDocument: S.String,
    clientToken: S.optional(S.String),
    revisionId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/workspaces/{workspaceId}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeResourcePolicyRequest extends S.Class<DescribeResourcePolicyRequest>(
  "DescribeResourcePolicyRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    revisionId: S.optional(S.String).pipe(T.HttpQuery("revisionId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/workspaces/{workspaceId}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export const FilterValues = S.Array(S.String);
export const ScraperFilters = S.Record({ key: S.String, value: FilterValues });
export const SecurityGroupIds = S.Array(S.String);
export const SubnetIds = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
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
export class ScraperStatus extends S.Class<ScraperStatus>("ScraperStatus")({
  statusCode: S.String,
}) {}
export class DeleteScraperResponse extends S.Class<DeleteScraperResponse>(
  "DeleteScraperResponse",
)({ scraperId: S.String, status: ScraperStatus }) {}
export class ListScrapersRequest extends S.Class<ListScrapersRequest>(
  "ListScrapersRequest",
)(
  {
    filters: S.optional(ScraperFilters).pipe(T.HttpQueryParams()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/scrapers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AlertManagerDefinitionStatus extends S.Class<AlertManagerDefinitionStatus>(
  "AlertManagerDefinitionStatus",
)({ statusCode: S.String, statusReason: S.optional(S.String) }) {}
export class PutAlertManagerDefinitionResponse extends S.Class<PutAlertManagerDefinitionResponse>(
  "PutAlertManagerDefinitionResponse",
)({ status: AlertManagerDefinitionStatus }) {}
export class LoggingConfigurationStatus extends S.Class<LoggingConfigurationStatus>(
  "LoggingConfigurationStatus",
)({ statusCode: S.String, statusReason: S.optional(S.String) }) {}
export class UpdateLoggingConfigurationResponse extends S.Class<UpdateLoggingConfigurationResponse>(
  "UpdateLoggingConfigurationResponse",
)({ status: LoggingConfigurationStatus }) {}
export class RuleGroupsNamespaceStatus extends S.Class<RuleGroupsNamespaceStatus>(
  "RuleGroupsNamespaceStatus",
)({ statusCode: S.String, statusReason: S.optional(S.String) }) {}
export class PutRuleGroupsNamespaceResponse extends S.Class<PutRuleGroupsNamespaceResponse>(
  "PutRuleGroupsNamespaceResponse",
)({
  name: S.String,
  arn: S.String,
  status: RuleGroupsNamespaceStatus,
  tags: S.optional(TagMap),
}) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({ policyStatus: S.String, revisionId: S.String }) {}
export class DescribeResourcePolicyResponse extends S.Class<DescribeResourcePolicyResponse>(
  "DescribeResourcePolicyResponse",
)({ policyDocument: S.String, policyStatus: S.String, revisionId: S.String }) {}
export class EksConfiguration extends S.Class<EksConfiguration>(
  "EksConfiguration",
)({
  clusterArn: S.String,
  securityGroupIds: S.optional(SecurityGroupIds),
  subnetIds: SubnetIds,
}) {}
export class VpcConfiguration extends S.Class<VpcConfiguration>(
  "VpcConfiguration",
)({ securityGroupIds: SecurityGroupIds, subnetIds: SubnetIds }) {}
export class LimitsPerLabelSetEntry extends S.Class<LimitsPerLabelSetEntry>(
  "LimitsPerLabelSetEntry",
)({ maxSeries: S.optional(S.Number) }) {}
export const LabelSet = S.Record({ key: S.String, value: S.String });
export const Source = S.Union(
  S.Struct({ eksConfiguration: EksConfiguration }),
  S.Struct({ vpcConfiguration: VpcConfiguration }),
);
export class ScraperDescription extends S.Class<ScraperDescription>(
  "ScraperDescription",
)({
  alias: S.optional(S.String),
  scraperId: S.String,
  arn: S.String,
  roleArn: S.String,
  status: ScraperStatus,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
  statusReason: S.optional(S.String),
  scrapeConfiguration: ScrapeConfiguration,
  source: Source,
  destination: Destination,
  roleConfiguration: S.optional(RoleConfiguration),
}) {}
export const ScraperLoggingDestination = S.Union(
  S.Struct({ cloudWatchLogs: CloudWatchLogDestination }),
);
export class ScraperLoggingConfigurationStatus extends S.Class<ScraperLoggingConfigurationStatus>(
  "ScraperLoggingConfigurationStatus",
)({ statusCode: S.String, statusReason: S.optional(S.String) }) {}
export class WorkspaceStatus extends S.Class<WorkspaceStatus>(
  "WorkspaceStatus",
)({ statusCode: S.String }) {}
export class WorkspaceDescription extends S.Class<WorkspaceDescription>(
  "WorkspaceDescription",
)({
  workspaceId: S.String,
  alias: S.optional(S.String),
  arn: S.String,
  status: WorkspaceStatus,
  prometheusEndpoint: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
  kmsKeyArn: S.optional(S.String),
}) {}
export class WorkspaceSummary extends S.Class<WorkspaceSummary>(
  "WorkspaceSummary",
)({
  workspaceId: S.String,
  alias: S.optional(S.String),
  arn: S.String,
  status: WorkspaceStatus,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
  kmsKeyArn: S.optional(S.String),
}) {}
export const WorkspaceSummaryList = S.Array(WorkspaceSummary);
export class AlertManagerDefinitionDescription extends S.Class<AlertManagerDefinitionDescription>(
  "AlertManagerDefinitionDescription",
)({
  status: AlertManagerDefinitionStatus,
  data: T.Blob,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class AnomalyDetectorStatus extends S.Class<AnomalyDetectorStatus>(
  "AnomalyDetectorStatus",
)({ statusCode: S.String, statusReason: S.optional(S.String) }) {}
export class AnomalyDetectorDescription extends S.Class<AnomalyDetectorDescription>(
  "AnomalyDetectorDescription",
)({
  arn: S.String,
  anomalyDetectorId: S.String,
  alias: S.String,
  evaluationIntervalInSeconds: S.optional(S.Number),
  missingDataAction: S.optional(AnomalyDetectorMissingDataAction),
  configuration: S.optional(AnomalyDetectorConfiguration),
  labels: S.optional(PrometheusMetricLabelMap),
  status: AnomalyDetectorStatus,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export class AnomalyDetectorSummary extends S.Class<AnomalyDetectorSummary>(
  "AnomalyDetectorSummary",
)({
  arn: S.String,
  anomalyDetectorId: S.String,
  alias: S.String,
  status: AnomalyDetectorStatus,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export const AnomalyDetectorSummaryList = S.Array(AnomalyDetectorSummary);
export class LoggingConfigurationMetadata extends S.Class<LoggingConfigurationMetadata>(
  "LoggingConfigurationMetadata",
)({
  status: LoggingConfigurationStatus,
  workspace: S.String,
  logGroupArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class QueryLoggingConfigurationStatus extends S.Class<QueryLoggingConfigurationStatus>(
  "QueryLoggingConfigurationStatus",
)({ statusCode: S.String, statusReason: S.optional(S.String) }) {}
export class QueryLoggingConfigurationMetadata extends S.Class<QueryLoggingConfigurationMetadata>(
  "QueryLoggingConfigurationMetadata",
)({
  status: QueryLoggingConfigurationStatus,
  workspace: S.String,
  destinations: LoggingDestinations,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class RuleGroupsNamespaceDescription extends S.Class<RuleGroupsNamespaceDescription>(
  "RuleGroupsNamespaceDescription",
)({
  arn: S.String,
  name: S.String,
  status: RuleGroupsNamespaceStatus,
  data: T.Blob,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export class RuleGroupsNamespaceSummary extends S.Class<RuleGroupsNamespaceSummary>(
  "RuleGroupsNamespaceSummary",
)({
  arn: S.String,
  name: S.String,
  status: RuleGroupsNamespaceStatus,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export const RuleGroupsNamespaceSummaryList = S.Array(
  RuleGroupsNamespaceSummary,
);
export class LimitsPerLabelSet extends S.Class<LimitsPerLabelSet>(
  "LimitsPerLabelSet",
)({ limits: LimitsPerLabelSetEntry, labelSet: LabelSet }) {}
export const LimitsPerLabelSetList = S.Array(LimitsPerLabelSet);
export const StringMap = S.Record({ key: S.String, value: S.String });
export class CreateScraperRequest extends S.Class<CreateScraperRequest>(
  "CreateScraperRequest",
)(
  {
    alias: S.optional(S.String),
    scrapeConfiguration: ScrapeConfiguration,
    source: Source,
    destination: Destination,
    roleConfiguration: S.optional(RoleConfiguration),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/scrapers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeScraperResponse extends S.Class<DescribeScraperResponse>(
  "DescribeScraperResponse",
)({ scraper: ScraperDescription }) {}
export class UpdateScraperResponse extends S.Class<UpdateScraperResponse>(
  "UpdateScraperResponse",
)({
  scraperId: S.String,
  arn: S.String,
  status: ScraperStatus,
  tags: S.optional(TagMap),
}) {}
export class ComponentConfig extends S.Class<ComponentConfig>(
  "ComponentConfig",
)({ options: S.optional(StringMap) }) {}
export class ScraperComponent extends S.Class<ScraperComponent>(
  "ScraperComponent",
)({ type: S.String, config: S.optional(ComponentConfig) }) {}
export const ScraperComponents = S.Array(ScraperComponent);
export class DescribeScraperLoggingConfigurationResponse extends S.Class<DescribeScraperLoggingConfigurationResponse>(
  "DescribeScraperLoggingConfigurationResponse",
)({
  status: ScraperLoggingConfigurationStatus,
  scraperId: S.String,
  loggingDestination: ScraperLoggingDestination,
  scraperComponents: ScraperComponents,
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class CreateWorkspaceResponse extends S.Class<CreateWorkspaceResponse>(
  "CreateWorkspaceResponse",
)({
  workspaceId: S.String,
  arn: S.String,
  status: WorkspaceStatus,
  tags: S.optional(TagMap),
  kmsKeyArn: S.optional(S.String),
}) {}
export class DescribeWorkspaceResponse extends S.Class<DescribeWorkspaceResponse>(
  "DescribeWorkspaceResponse",
)({ workspace: WorkspaceDescription }) {}
export class ListWorkspacesResponse extends S.Class<ListWorkspacesResponse>(
  "ListWorkspacesResponse",
)({ workspaces: WorkspaceSummaryList, nextToken: S.optional(S.String) }) {}
export class CreateAlertManagerDefinitionResponse extends S.Class<CreateAlertManagerDefinitionResponse>(
  "CreateAlertManagerDefinitionResponse",
)({ status: AlertManagerDefinitionStatus }) {}
export class DescribeAlertManagerDefinitionResponse extends S.Class<DescribeAlertManagerDefinitionResponse>(
  "DescribeAlertManagerDefinitionResponse",
)({ alertManagerDefinition: AlertManagerDefinitionDescription }) {}
export class PutAnomalyDetectorResponse extends S.Class<PutAnomalyDetectorResponse>(
  "PutAnomalyDetectorResponse",
)({
  anomalyDetectorId: S.String,
  arn: S.String,
  status: AnomalyDetectorStatus,
  tags: S.optional(TagMap),
}) {}
export class DescribeAnomalyDetectorResponse extends S.Class<DescribeAnomalyDetectorResponse>(
  "DescribeAnomalyDetectorResponse",
)({ anomalyDetector: AnomalyDetectorDescription }) {}
export class ListAnomalyDetectorsResponse extends S.Class<ListAnomalyDetectorsResponse>(
  "ListAnomalyDetectorsResponse",
)({
  anomalyDetectors: AnomalyDetectorSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateLoggingConfigurationResponse extends S.Class<CreateLoggingConfigurationResponse>(
  "CreateLoggingConfigurationResponse",
)({ status: LoggingConfigurationStatus }) {}
export class DescribeLoggingConfigurationResponse extends S.Class<DescribeLoggingConfigurationResponse>(
  "DescribeLoggingConfigurationResponse",
)({ loggingConfiguration: LoggingConfigurationMetadata }) {}
export class CreateQueryLoggingConfigurationRequest extends S.Class<CreateQueryLoggingConfigurationRequest>(
  "CreateQueryLoggingConfigurationRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    destinations: LoggingDestinations,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workspaces/{workspaceId}/logging/query" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeQueryLoggingConfigurationResponse extends S.Class<DescribeQueryLoggingConfigurationResponse>(
  "DescribeQueryLoggingConfigurationResponse",
)({ queryLoggingConfiguration: QueryLoggingConfigurationMetadata }) {}
export class UpdateQueryLoggingConfigurationResponse extends S.Class<UpdateQueryLoggingConfigurationResponse>(
  "UpdateQueryLoggingConfigurationResponse",
)({ status: QueryLoggingConfigurationStatus }) {}
export class CreateRuleGroupsNamespaceResponse extends S.Class<CreateRuleGroupsNamespaceResponse>(
  "CreateRuleGroupsNamespaceResponse",
)({
  name: S.String,
  arn: S.String,
  status: RuleGroupsNamespaceStatus,
  tags: S.optional(TagMap),
}) {}
export class DescribeRuleGroupsNamespaceResponse extends S.Class<DescribeRuleGroupsNamespaceResponse>(
  "DescribeRuleGroupsNamespaceResponse",
)({ ruleGroupsNamespace: RuleGroupsNamespaceDescription }) {}
export class ListRuleGroupsNamespacesResponse extends S.Class<ListRuleGroupsNamespacesResponse>(
  "ListRuleGroupsNamespacesResponse",
)({
  ruleGroupsNamespaces: RuleGroupsNamespaceSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class UpdateWorkspaceConfigurationRequest extends S.Class<UpdateWorkspaceConfigurationRequest>(
  "UpdateWorkspaceConfigurationRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    clientToken: S.optional(S.String),
    limitsPerLabelSet: S.optional(LimitsPerLabelSetList),
    retentionPeriodInDays: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/workspaces/{workspaceId}/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class WorkspaceConfigurationStatus extends S.Class<WorkspaceConfigurationStatus>(
  "WorkspaceConfigurationStatus",
)({ statusCode: S.String, statusReason: S.optional(S.String) }) {}
export class ScraperSummary extends S.Class<ScraperSummary>("ScraperSummary")({
  alias: S.optional(S.String),
  scraperId: S.String,
  arn: S.String,
  roleArn: S.String,
  status: ScraperStatus,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
  statusReason: S.optional(S.String),
  source: Source,
  destination: Destination,
  roleConfiguration: S.optional(RoleConfiguration),
}) {}
export const ScraperSummaryList = S.Array(ScraperSummary);
export class WorkspaceConfigurationDescription extends S.Class<WorkspaceConfigurationDescription>(
  "WorkspaceConfigurationDescription",
)({
  status: WorkspaceConfigurationStatus,
  limitsPerLabelSet: S.optional(LimitsPerLabelSetList),
  retentionPeriodInDays: S.optional(S.Number),
}) {}
export class CreateScraperResponse extends S.Class<CreateScraperResponse>(
  "CreateScraperResponse",
)({
  scraperId: S.String,
  arn: S.String,
  status: ScraperStatus,
  tags: S.optional(TagMap),
}) {}
export class ListScrapersResponse extends S.Class<ListScrapersResponse>(
  "ListScrapersResponse",
)({ scrapers: ScraperSummaryList, nextToken: S.optional(S.String) }) {}
export class UpdateScraperLoggingConfigurationRequest extends S.Class<UpdateScraperLoggingConfigurationRequest>(
  "UpdateScraperLoggingConfigurationRequest",
)(
  {
    scraperId: S.String.pipe(T.HttpLabel("scraperId")),
    loggingDestination: ScraperLoggingDestination,
    scraperComponents: S.optional(ScraperComponents),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/scrapers/{scraperId}/logging-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAnomalyDetectorRequest extends S.Class<CreateAnomalyDetectorRequest>(
  "CreateAnomalyDetectorRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    alias: S.String,
    evaluationIntervalInSeconds: S.optional(S.Number),
    missingDataAction: S.optional(AnomalyDetectorMissingDataAction),
    configuration: AnomalyDetectorConfiguration,
    labels: S.optional(PrometheusMetricLabelMap),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{workspaceId}/anomalydetectors",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQueryLoggingConfigurationResponse extends S.Class<CreateQueryLoggingConfigurationResponse>(
  "CreateQueryLoggingConfigurationResponse",
)({ status: QueryLoggingConfigurationStatus }) {}
export class DescribeWorkspaceConfigurationResponse extends S.Class<DescribeWorkspaceConfigurationResponse>(
  "DescribeWorkspaceConfigurationResponse",
)({ workspaceConfiguration: WorkspaceConfigurationDescription }) {}
export class UpdateWorkspaceConfigurationResponse extends S.Class<UpdateWorkspaceConfigurationResponse>(
  "UpdateWorkspaceConfigurationResponse",
)({ status: WorkspaceConfigurationStatus }) {}
export class UpdateScraperLoggingConfigurationResponse extends S.Class<UpdateScraperLoggingConfigurationResponse>(
  "UpdateScraperLoggingConfigurationResponse",
)({ status: ScraperLoggingConfigurationStatus }) {}
export class CreateAnomalyDetectorResponse extends S.Class<CreateAnomalyDetectorResponse>(
  "CreateAnomalyDetectorResponse",
)({
  anomalyDetectorId: S.String,
  arn: S.String,
  status: AnomalyDetectorStatus,
  tags: S.optional(TagMap),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * The `GetDefaultScraperConfiguration` operation returns the default scraper configuration used when Amazon EKS creates a scraper for you.
 */
export const getDefaultScraperConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDefaultScraperConfigurationRequest,
    output: GetDefaultScraperConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
    ],
  }));
/**
 * The `DescribeScraper` operation displays information about an existing scraper.
 */
export const describeScraper = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeScraperRequest,
  output: DescribeScraperResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The `ListScrapers` operation lists all of the scrapers in your account. This includes scrapers being created or deleted. You can optionally filter the returned list.
 */
export const listScrapers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListScrapersRequest,
    output: ListScrapersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "scrapers",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a Prometheus workspace. A workspace is a logical space dedicated to the storage and querying of Prometheus metrics. You can have one or more workspaces in each Region in your account.
 */
export const createWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkspaceRequest,
  output: CreateWorkspaceResponse,
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
 * Creates a query logging configuration for the specified workspace. This operation enables logging of queries that exceed the specified QSP threshold.
 */
export const createQueryLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateQueryLoggingConfigurationRequest,
    output: CreateQueryLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Use this operation to return information about the configuration of a workspace. The configuration details returned include workspace configuration status, label set limits, and retention period.
 */
export const describeWorkspaceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeWorkspaceConfigurationRequest,
    output: DescribeWorkspaceConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Use this operation to create or update the label sets, label set limits, and retention period of a workspace.
 *
 * You must specify at least one of `limitsPerLabelSet` or `retentionPeriodInDays` for the request to be valid.
 */
export const updateWorkspaceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateWorkspaceConfigurationRequest,
    output: UpdateWorkspaceConfigurationResponse,
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
 * Lists all of the Amazon Managed Service for Prometheus workspaces in your account. This includes workspaces being created or deleted.
 */
export const listWorkspaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkspacesRequest,
    output: ListWorkspacesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workspaces",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * The `DeleteScraper` operation deletes one scraper, and stops any metrics collection that the scraper performs.
 */
export const deleteScraper = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScraperRequest,
  output: DeleteScraperResponse,
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
 * Describes the logging configuration for a Amazon Managed Service for Prometheus scraper.
 */
export const describeScraperLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeScraperLoggingConfigurationRequest,
    output: DescribeScraperLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns information about an existing workspace.
 */
export const describeWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkspaceRequest,
  output: DescribeWorkspaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The `CreateAlertManagerDefinition` operation creates the alert manager definition in a workspace. If a workspace already has an alert manager definition, don't use this operation to update it. Instead, use `PutAlertManagerDefinition`.
 */
export const createAlertManagerDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAlertManagerDefinitionRequest,
    output: CreateAlertManagerDefinitionResponse,
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
 * Retrieves the full information about the alert manager definition for a workspace.
 */
export const describeAlertManagerDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAlertManagerDefinitionRequest,
    output: DescribeAlertManagerDefinitionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves detailed information about a specific anomaly detector, including its status and configuration.
 */
export const describeAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAnomalyDetectorRequest,
    output: DescribeAnomalyDetectorResponse,
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
 * Returns a paginated list of anomaly detectors for a workspace with optional filtering by alias.
 */
export const listAnomalyDetectors =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAnomalyDetectorsRequest,
    output: ListAnomalyDetectorsResponse,
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
      items: "anomalyDetectors",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * The `CreateLoggingConfiguration` operation creates rules and alerting logging configuration for the workspace. Use this operation to set the CloudWatch log group to which the logs will be published to.
 *
 * These logging configurations are only for rules and alerting logs.
 */
export const createLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLoggingConfigurationRequest,
    output: CreateLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns complete information about the current rules and alerting logging configuration of the workspace.
 *
 * These logging configurations are only for rules and alerting logs.
 */
export const describeLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeLoggingConfigurationRequest,
    output: DescribeLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the details of the query logging configuration for the specified workspace.
 */
export const describeQueryLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeQueryLoggingConfigurationRequest,
    output: DescribeQueryLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Updates the query logging configuration for the specified workspace.
 */
export const updateQueryLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateQueryLoggingConfigurationRequest,
    output: UpdateQueryLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * The `CreateRuleGroupsNamespace` operation creates a rule groups namespace within a workspace. A rule groups namespace is associated with exactly one rules file. A workspace can have multiple rule groups namespaces.
 *
 * The combined length of a rule group namespace and a rule group name cannot exceed 721 UTF-8 bytes.
 *
 * Use this operation only to create new rule groups namespaces. To update an existing rule groups namespace, use `PutRuleGroupsNamespace`.
 */
export const createRuleGroupsNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRuleGroupsNamespaceRequest,
    output: CreateRuleGroupsNamespaceResponse,
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
 * Returns complete information about one rule groups namespace. To retrieve a list of rule groups namespaces, use `ListRuleGroupsNamespaces`.
 */
export const describeRuleGroupsNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRuleGroupsNamespaceRequest,
    output: DescribeRuleGroupsNamespaceResponse,
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
 * Returns a list of rule groups namespaces in a workspace.
 */
export const listRuleGroupsNamespaces =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRuleGroupsNamespacesRequest,
    output: ListRuleGroupsNamespacesResponse,
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
      items: "ruleGroupsNamespaces",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * The `ListTagsForResource` operation returns the tags that are associated with an Amazon Managed Service for Prometheus resource. Currently, the only resources that can be tagged are scrapers, workspaces, and rule groups namespaces.
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
 * The `TagResource` operation associates tags with an Amazon Managed Service for Prometheus resource. The only resources that can be tagged are rule groups namespaces, scrapers, and workspaces.
 *
 * If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. To remove a tag, use `UntagResource`.
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
 * Returns information about the resource-based policy attached to an Amazon Managed Service for Prometheus workspace.
 */
export const describeResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeResourcePolicyRequest,
    output: DescribeResourcePolicyResponse,
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
 * Removes the specified tags from an Amazon Managed Service for Prometheus resource. The only resources that can be tagged are rule groups namespaces, scrapers, and workspaces.
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
 * Updates an existing alert manager definition in a workspace. If the workspace does not already have an alert manager definition, don't use this operation to create it. Instead, use `CreateAlertManagerDefinition`.
 */
export const putAlertManagerDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAlertManagerDefinitionRequest,
    output: PutAlertManagerDefinitionResponse,
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
 * Updates the log group ARN or the workspace ID of the current rules and alerting logging configuration.
 *
 * These logging configurations are only for rules and alerting logs.
 */
export const updateLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLoggingConfigurationRequest,
    output: UpdateLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an existing rule groups namespace within a workspace. A rule groups namespace is associated with exactly one rules file. A workspace can have multiple rule groups namespaces.
 *
 * The combined length of a rule group namespace and a rule group name cannot exceed 721 UTF-8 bytes.
 *
 * Use this operation only to update existing rule groups namespaces. To create a new rule groups namespace, use `CreateRuleGroupsNamespace`.
 *
 * You can't use this operation to add tags to an existing rule groups namespace. Instead, use `TagResource`.
 */
export const putRuleGroupsNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRuleGroupsNamespaceRequest,
    output: PutRuleGroupsNamespaceResponse,
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
 * Creates or updates a resource-based policy for an Amazon Managed Service for Prometheus workspace. Use resource-based policies to grant permissions to other AWS accounts or services to access your workspace.
 *
 * Only Prometheus-compatible APIs can be used for workspace sharing. You can add non-Prometheus-compatible APIs to the policy, but they will be ignored. For more information, see Prometheus-compatible APIs in the *Amazon Managed Service for Prometheus User Guide*.
 *
 * If your workspace uses customer-managed KMS keys for encryption, you must grant the principals in your resource-based policy access to those KMS keys. You can do this by creating KMS grants. For more information, see CreateGrant in the *AWS Key Management Service API Reference* and Encryption at rest in the *Amazon Managed Service for Prometheus User Guide*.
 *
 * For more information about working with IAM, see Using Amazon Managed Service for Prometheus with IAM in the *Amazon Managed Service for Prometheus User Guide*.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
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
 * Deletes the logging configuration for a Amazon Managed Service for Prometheus scraper.
 */
export const deleteScraperLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteScraperLoggingConfigurationRequest,
    output: DeleteScraperLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Updates the alias of an existing workspace.
 */
export const updateWorkspaceAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWorkspaceAliasRequest,
    output: UpdateWorkspaceAliasResponse,
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
 * Deletes an existing workspace.
 *
 * When you delete a workspace, the data that has been ingested into it is not immediately deleted. It will be permanently deleted within one month.
 */
export const deleteWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkspaceRequest,
  output: DeleteWorkspaceResponse,
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
 * Deletes the alert manager definition from a workspace.
 */
export const deleteAlertManagerDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAlertManagerDefinitionRequest,
    output: DeleteAlertManagerDefinitionResponse,
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
 * Removes an anomaly detector from a workspace. This operation is idempotent.
 */
export const deleteAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAnomalyDetectorRequest,
    output: DeleteAnomalyDetectorResponse,
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
 * Deletes the rules and alerting logging configuration for a workspace.
 *
 * These logging configurations are only for rules and alerting logs.
 */
export const deleteLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLoggingConfigurationRequest,
    output: DeleteLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the query logging configuration for the specified workspace.
 */
export const deleteQueryLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteQueryLoggingConfigurationRequest,
    output: DeleteQueryLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes one rule groups namespace and its associated rule groups definition.
 */
export const deleteRuleGroupsNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRuleGroupsNamespaceRequest,
    output: DeleteRuleGroupsNamespaceResponse,
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
 * Deletes the resource-based policy attached to an Amazon Managed Service for Prometheus workspace.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
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
 * Updates an existing scraper.
 *
 * You can't use this function to update the source from which the scraper is collecting metrics. To change the source, delete the scraper and create a new one.
 */
export const updateScraper = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScraperRequest,
  output: UpdateScraperResponse,
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
 * The `CreateScraper` operation creates a scraper to collect metrics. A scraper pulls metrics from Prometheus-compatible sources and sends them to your Amazon Managed Service for Prometheus workspace. You can configure scrapers to collect metrics from Amazon EKS clusters, Amazon MSK clusters, or from VPC-based sources that support DNS-based service discovery. Scrapers are flexible, and can be configured to control what metrics are collected, the frequency of collection, what transformations are applied to the metrics, and more.
 *
 * An IAM role will be created for you that Amazon Managed Service for Prometheus uses to access the metrics in your source. You must configure this role with a policy that allows it to scrape metrics from your source. For Amazon EKS sources, see Configuring your Amazon EKS cluster in the *Amazon Managed Service for Prometheus User Guide*.
 *
 * The `scrapeConfiguration` parameter contains the base-64 encoded YAML configuration for the scraper.
 *
 * When creating a scraper, the service creates a `Network Interface` in each **Availability Zone** that are passed into `CreateScraper` through subnets. These network interfaces are used to connect to your source within the VPC for scraping metrics.
 *
 * For more information about collectors, including what metrics are collected, and how to configure the scraper, see Using an Amazon Web Services managed collector in the *Amazon Managed Service for Prometheus User Guide*.
 */
export const createScraper = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScraperRequest,
  output: CreateScraperResponse,
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
 * When you call `PutAnomalyDetector`, the operation creates a new anomaly detector if one doesn't exist, or updates an existing one. Each call to this operation triggers a complete retraining of the detector, which includes querying the minimum required samples and backfilling the detector with historical data. This process occurs regardless of whether you're making a minor change like updating the evaluation interval or making more substantial modifications. The operation serves as the single method for creating, updating, and retraining anomaly detectors.
 */
export const putAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAnomalyDetectorRequest,
  output: PutAnomalyDetectorResponse,
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
 * Updates the logging configuration for a Amazon Managed Service for Prometheus scraper.
 */
export const updateScraperLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateScraperLoggingConfigurationRequest,
    output: UpdateScraperLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Creates an anomaly detector within a workspace using the Random Cut Forest algorithm for time-series analysis. The anomaly detector analyzes Amazon Managed Service for Prometheus metrics to identify unusual patterns and behaviors.
 */
export const createAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAnomalyDetectorRequest,
    output: CreateAnomalyDetectorResponse,
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

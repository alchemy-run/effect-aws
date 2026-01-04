import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://monitoring.amazonaws.com/doc/2014-03-28/");
const svc = T.AwsApiService({
  sdkId: "CloudWatch Logs",
  serviceShapeName: "Logs_20140328",
});
const auth = T.AwsAuthSigv4({ name: "logs" });
const ver = T.ServiceVersion("2014-03-28");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://logs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [{ ref: "Region" }, "us-gov-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://logs.us-gov-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://logs.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://logs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://logs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://logs.{Region}.{PartitionResult#dnsSuffix}",
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
export const RecordFields = S.Array(S.String);
export const LogGroupArnList = S.Array(S.String);
export const ScheduledQueryLogGroupIdentifiers = S.Array(S.String);
export const AccountIds = S.Array(S.String);
export const LogTypes = S.Array(S.String);
export const ResourceTypes = S.Array(S.String);
export const DeliveryDestinationTypes = S.Array(S.String);
export const DescribeFieldIndexesLogGroupIdentifiers = S.Array(S.String);
export const ImportStatusList = S.Array(S.String);
export const DescribeIndexPoliciesLogGroupIdentifiers = S.Array(S.String);
export const DescribeLogGroupsLogGroupIdentifiers = S.Array(S.String);
export const InputLogStreamNames = S.Array(S.String);
export const ExecutionStatusList = S.Array(S.String);
export const FieldIndexNames = S.Array(S.String);
export const EmitSystemFields = S.Array(S.String);
export const LogGroupNames = S.Array(S.String);
export const StartLiveTailLogGroupIdentifiers = S.Array(S.String);
export const LogGroupIdentifiers = S.Array(S.String);
export const TestEventMessages = S.Array(S.String);
export const TagList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateKmsKeyRequest extends S.Class<AssociateKmsKeyRequest>(
  "AssociateKmsKeyRequest",
)(
  {
    logGroupName: S.optional(S.String),
    kmsKeyId: S.String,
    resourceIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateKmsKeyResponse extends S.Class<AssociateKmsKeyResponse>(
  "AssociateKmsKeyResponse",
)({}, ns) {}
export class CancelExportTaskRequest extends S.Class<CancelExportTaskRequest>(
  "CancelExportTaskRequest",
)(
  { taskId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelExportTaskResponse extends S.Class<CancelExportTaskResponse>(
  "CancelExportTaskResponse",
)({}, ns) {}
export class CancelImportTaskRequest extends S.Class<CancelImportTaskRequest>(
  "CancelImportTaskRequest",
)(
  { importId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateExportTaskRequest extends S.Class<CreateExportTaskRequest>(
  "CreateExportTaskRequest",
)(
  {
    taskName: S.optional(S.String),
    logGroupName: S.String,
    logStreamNamePrefix: S.optional(S.String),
    from: S.Number,
    to: S.Number,
    destination: S.String,
    destinationPrefix: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateLogAnomalyDetectorRequest extends S.Class<CreateLogAnomalyDetectorRequest>(
  "CreateLogAnomalyDetectorRequest",
)(
  {
    logGroupArnList: LogGroupArnList,
    detectorName: S.optional(S.String),
    evaluationFrequency: S.optional(S.String),
    filterPattern: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    anomalyVisibilityTime: S.optional(S.Number),
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLogGroupRequest extends S.Class<CreateLogGroupRequest>(
  "CreateLogGroupRequest",
)(
  {
    logGroupName: S.String,
    kmsKeyId: S.optional(S.String),
    tags: S.optional(Tags),
    logGroupClass: S.optional(S.String),
    deletionProtectionEnabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLogGroupResponse extends S.Class<CreateLogGroupResponse>(
  "CreateLogGroupResponse",
)({}, ns) {}
export class CreateLogStreamRequest extends S.Class<CreateLogStreamRequest>(
  "CreateLogStreamRequest",
)(
  { logGroupName: S.String, logStreamName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLogStreamResponse extends S.Class<CreateLogStreamResponse>(
  "CreateLogStreamResponse",
)({}, ns) {}
export class DeleteAccountPolicyRequest extends S.Class<DeleteAccountPolicyRequest>(
  "DeleteAccountPolicyRequest",
)(
  { policyName: S.String, policyType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccountPolicyResponse extends S.Class<DeleteAccountPolicyResponse>(
  "DeleteAccountPolicyResponse",
)({}, ns) {}
export class DeleteDataProtectionPolicyRequest extends S.Class<DeleteDataProtectionPolicyRequest>(
  "DeleteDataProtectionPolicyRequest",
)(
  { logGroupIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDataProtectionPolicyResponse extends S.Class<DeleteDataProtectionPolicyResponse>(
  "DeleteDataProtectionPolicyResponse",
)({}, ns) {}
export class DeleteDeliveryRequest extends S.Class<DeleteDeliveryRequest>(
  "DeleteDeliveryRequest",
)(
  { id: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeliveryResponse extends S.Class<DeleteDeliveryResponse>(
  "DeleteDeliveryResponse",
)({}, ns) {}
export class DeleteDeliveryDestinationRequest extends S.Class<DeleteDeliveryDestinationRequest>(
  "DeleteDeliveryDestinationRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeliveryDestinationResponse extends S.Class<DeleteDeliveryDestinationResponse>(
  "DeleteDeliveryDestinationResponse",
)({}, ns) {}
export class DeleteDeliveryDestinationPolicyRequest extends S.Class<DeleteDeliveryDestinationPolicyRequest>(
  "DeleteDeliveryDestinationPolicyRequest",
)(
  { deliveryDestinationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeliveryDestinationPolicyResponse extends S.Class<DeleteDeliveryDestinationPolicyResponse>(
  "DeleteDeliveryDestinationPolicyResponse",
)({}, ns) {}
export class DeleteDeliverySourceRequest extends S.Class<DeleteDeliverySourceRequest>(
  "DeleteDeliverySourceRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeliverySourceResponse extends S.Class<DeleteDeliverySourceResponse>(
  "DeleteDeliverySourceResponse",
)({}, ns) {}
export class DeleteDestinationRequest extends S.Class<DeleteDestinationRequest>(
  "DeleteDestinationRequest",
)(
  { destinationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDestinationResponse extends S.Class<DeleteDestinationResponse>(
  "DeleteDestinationResponse",
)({}, ns) {}
export class DeleteIndexPolicyRequest extends S.Class<DeleteIndexPolicyRequest>(
  "DeleteIndexPolicyRequest",
)(
  { logGroupIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIndexPolicyResponse extends S.Class<DeleteIndexPolicyResponse>(
  "DeleteIndexPolicyResponse",
)({}, ns) {}
export class DeleteIntegrationRequest extends S.Class<DeleteIntegrationRequest>(
  "DeleteIntegrationRequest",
)(
  { integrationName: S.String, force: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIntegrationResponse extends S.Class<DeleteIntegrationResponse>(
  "DeleteIntegrationResponse",
)({}, ns) {}
export class DeleteLogAnomalyDetectorRequest extends S.Class<DeleteLogAnomalyDetectorRequest>(
  "DeleteLogAnomalyDetectorRequest",
)(
  { anomalyDetectorArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLogAnomalyDetectorResponse extends S.Class<DeleteLogAnomalyDetectorResponse>(
  "DeleteLogAnomalyDetectorResponse",
)({}, ns) {}
export class DeleteLogGroupRequest extends S.Class<DeleteLogGroupRequest>(
  "DeleteLogGroupRequest",
)(
  { logGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLogGroupResponse extends S.Class<DeleteLogGroupResponse>(
  "DeleteLogGroupResponse",
)({}, ns) {}
export class DeleteLogStreamRequest extends S.Class<DeleteLogStreamRequest>(
  "DeleteLogStreamRequest",
)(
  { logGroupName: S.String, logStreamName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLogStreamResponse extends S.Class<DeleteLogStreamResponse>(
  "DeleteLogStreamResponse",
)({}, ns) {}
export class DeleteMetricFilterRequest extends S.Class<DeleteMetricFilterRequest>(
  "DeleteMetricFilterRequest",
)(
  { logGroupName: S.String, filterName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMetricFilterResponse extends S.Class<DeleteMetricFilterResponse>(
  "DeleteMetricFilterResponse",
)({}, ns) {}
export class DeleteQueryDefinitionRequest extends S.Class<DeleteQueryDefinitionRequest>(
  "DeleteQueryDefinitionRequest",
)(
  { queryDefinitionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  {
    policyName: S.optional(S.String),
    resourceArn: S.optional(S.String),
    expectedRevisionId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}, ns) {}
export class DeleteRetentionPolicyRequest extends S.Class<DeleteRetentionPolicyRequest>(
  "DeleteRetentionPolicyRequest",
)(
  { logGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRetentionPolicyResponse extends S.Class<DeleteRetentionPolicyResponse>(
  "DeleteRetentionPolicyResponse",
)({}, ns) {}
export class DeleteScheduledQueryRequest extends S.Class<DeleteScheduledQueryRequest>(
  "DeleteScheduledQueryRequest",
)(
  { identifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScheduledQueryResponse extends S.Class<DeleteScheduledQueryResponse>(
  "DeleteScheduledQueryResponse",
)({}, ns) {}
export class DeleteSubscriptionFilterRequest extends S.Class<DeleteSubscriptionFilterRequest>(
  "DeleteSubscriptionFilterRequest",
)(
  { logGroupName: S.String, filterName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSubscriptionFilterResponse extends S.Class<DeleteSubscriptionFilterResponse>(
  "DeleteSubscriptionFilterResponse",
)({}, ns) {}
export class DeleteTransformerRequest extends S.Class<DeleteTransformerRequest>(
  "DeleteTransformerRequest",
)(
  { logGroupIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTransformerResponse extends S.Class<DeleteTransformerResponse>(
  "DeleteTransformerResponse",
)({}, ns) {}
export class DescribeAccountPoliciesRequest extends S.Class<DescribeAccountPoliciesRequest>(
  "DescribeAccountPoliciesRequest",
)(
  {
    policyType: S.String,
    policyName: S.optional(S.String),
    accountIdentifiers: S.optional(AccountIds),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConfigurationTemplatesRequest extends S.Class<DescribeConfigurationTemplatesRequest>(
  "DescribeConfigurationTemplatesRequest",
)(
  {
    service: S.optional(S.String),
    logTypes: S.optional(LogTypes),
    resourceTypes: S.optional(ResourceTypes),
    deliveryDestinationTypes: S.optional(DeliveryDestinationTypes),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDeliveriesRequest extends S.Class<DescribeDeliveriesRequest>(
  "DescribeDeliveriesRequest",
)(
  { nextToken: S.optional(S.String), limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDeliveryDestinationsRequest extends S.Class<DescribeDeliveryDestinationsRequest>(
  "DescribeDeliveryDestinationsRequest",
)(
  { nextToken: S.optional(S.String), limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDeliverySourcesRequest extends S.Class<DescribeDeliverySourcesRequest>(
  "DescribeDeliverySourcesRequest",
)(
  { nextToken: S.optional(S.String), limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDestinationsRequest extends S.Class<DescribeDestinationsRequest>(
  "DescribeDestinationsRequest",
)(
  {
    DestinationNamePrefix: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExportTasksRequest extends S.Class<DescribeExportTasksRequest>(
  "DescribeExportTasksRequest",
)(
  {
    taskId: S.optional(S.String),
    statusCode: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFieldIndexesRequest extends S.Class<DescribeFieldIndexesRequest>(
  "DescribeFieldIndexesRequest",
)(
  {
    logGroupIdentifiers: DescribeFieldIndexesLogGroupIdentifiers,
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeImportTaskBatchesRequest extends S.Class<DescribeImportTaskBatchesRequest>(
  "DescribeImportTaskBatchesRequest",
)(
  {
    importId: S.String,
    batchImportStatus: S.optional(ImportStatusList),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeImportTasksRequest extends S.Class<DescribeImportTasksRequest>(
  "DescribeImportTasksRequest",
)(
  {
    importId: S.optional(S.String),
    importStatus: S.optional(S.String),
    importSourceArn: S.optional(S.String),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeIndexPoliciesRequest extends S.Class<DescribeIndexPoliciesRequest>(
  "DescribeIndexPoliciesRequest",
)(
  {
    logGroupIdentifiers: DescribeIndexPoliciesLogGroupIdentifiers,
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLogGroupsRequest extends S.Class<DescribeLogGroupsRequest>(
  "DescribeLogGroupsRequest",
)(
  {
    accountIdentifiers: S.optional(AccountIds),
    logGroupNamePrefix: S.optional(S.String),
    logGroupNamePattern: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    includeLinkedAccounts: S.optional(S.Boolean),
    logGroupClass: S.optional(S.String),
    logGroupIdentifiers: S.optional(DescribeLogGroupsLogGroupIdentifiers),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLogStreamsRequest extends S.Class<DescribeLogStreamsRequest>(
  "DescribeLogStreamsRequest",
)(
  {
    logGroupName: S.optional(S.String),
    logGroupIdentifier: S.optional(S.String),
    logStreamNamePrefix: S.optional(S.String),
    orderBy: S.optional(S.String),
    descending: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetricFiltersRequest extends S.Class<DescribeMetricFiltersRequest>(
  "DescribeMetricFiltersRequest",
)(
  {
    logGroupName: S.optional(S.String),
    filterNamePrefix: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    metricName: S.optional(S.String),
    metricNamespace: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeQueriesRequest extends S.Class<DescribeQueriesRequest>(
  "DescribeQueriesRequest",
)(
  {
    logGroupName: S.optional(S.String),
    status: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    queryLanguage: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeQueryDefinitionsRequest extends S.Class<DescribeQueryDefinitionsRequest>(
  "DescribeQueryDefinitionsRequest",
)(
  {
    queryLanguage: S.optional(S.String),
    queryDefinitionNamePrefix: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeResourcePoliciesRequest extends S.Class<DescribeResourcePoliciesRequest>(
  "DescribeResourcePoliciesRequest",
)(
  {
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    resourceArn: S.optional(S.String),
    policyScope: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSubscriptionFiltersRequest extends S.Class<DescribeSubscriptionFiltersRequest>(
  "DescribeSubscriptionFiltersRequest",
)(
  {
    logGroupName: S.String,
    filterNamePrefix: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateKmsKeyRequest extends S.Class<DisassociateKmsKeyRequest>(
  "DisassociateKmsKeyRequest",
)(
  {
    logGroupName: S.optional(S.String),
    resourceIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateKmsKeyResponse extends S.Class<DisassociateKmsKeyResponse>(
  "DisassociateKmsKeyResponse",
)({}, ns) {}
export class DisassociateSourceFromS3TableIntegrationRequest extends S.Class<DisassociateSourceFromS3TableIntegrationRequest>(
  "DisassociateSourceFromS3TableIntegrationRequest",
)(
  { identifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FilterLogEventsRequest extends S.Class<FilterLogEventsRequest>(
  "FilterLogEventsRequest",
)(
  {
    logGroupName: S.optional(S.String),
    logGroupIdentifier: S.optional(S.String),
    logStreamNames: S.optional(InputLogStreamNames),
    logStreamNamePrefix: S.optional(S.String),
    startTime: S.optional(S.Number),
    endTime: S.optional(S.Number),
    filterPattern: S.optional(S.String),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    interleaved: S.optional(S.Boolean),
    unmask: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataProtectionPolicyRequest extends S.Class<GetDataProtectionPolicyRequest>(
  "GetDataProtectionPolicyRequest",
)(
  { logGroupIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeliveryRequest extends S.Class<GetDeliveryRequest>(
  "GetDeliveryRequest",
)(
  { id: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeliveryDestinationRequest extends S.Class<GetDeliveryDestinationRequest>(
  "GetDeliveryDestinationRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeliveryDestinationPolicyRequest extends S.Class<GetDeliveryDestinationPolicyRequest>(
  "GetDeliveryDestinationPolicyRequest",
)(
  { deliveryDestinationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeliverySourceRequest extends S.Class<GetDeliverySourceRequest>(
  "GetDeliverySourceRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIntegrationRequest extends S.Class<GetIntegrationRequest>(
  "GetIntegrationRequest",
)(
  { integrationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLogAnomalyDetectorRequest extends S.Class<GetLogAnomalyDetectorRequest>(
  "GetLogAnomalyDetectorRequest",
)(
  { anomalyDetectorArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLogEventsRequest extends S.Class<GetLogEventsRequest>(
  "GetLogEventsRequest",
)(
  {
    logGroupName: S.optional(S.String),
    logGroupIdentifier: S.optional(S.String),
    logStreamName: S.String,
    startTime: S.optional(S.Number),
    endTime: S.optional(S.Number),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    startFromHead: S.optional(S.Boolean),
    unmask: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLogFieldsRequest extends S.Class<GetLogFieldsRequest>(
  "GetLogFieldsRequest",
)(
  { dataSourceName: S.String, dataSourceType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLogGroupFieldsRequest extends S.Class<GetLogGroupFieldsRequest>(
  "GetLogGroupFieldsRequest",
)(
  {
    logGroupName: S.optional(S.String),
    time: S.optional(S.Number),
    logGroupIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLogObjectRequest extends S.Class<GetLogObjectRequest>(
  "GetLogObjectRequest",
)(
  { unmask: S.optional(S.Boolean), logObjectPointer: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLogRecordRequest extends S.Class<GetLogRecordRequest>(
  "GetLogRecordRequest",
)(
  { logRecordPointer: S.String, unmask: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetQueryResultsRequest extends S.Class<GetQueryResultsRequest>(
  "GetQueryResultsRequest",
)(
  { queryId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetScheduledQueryRequest extends S.Class<GetScheduledQueryRequest>(
  "GetScheduledQueryRequest",
)(
  { identifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetScheduledQueryHistoryRequest extends S.Class<GetScheduledQueryHistoryRequest>(
  "GetScheduledQueryHistoryRequest",
)(
  {
    identifier: S.String,
    startTime: S.Number,
    endTime: S.Number,
    executionStatuses: S.optional(ExecutionStatusList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTransformerRequest extends S.Class<GetTransformerRequest>(
  "GetTransformerRequest",
)(
  { logGroupIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAnomaliesRequest extends S.Class<ListAnomaliesRequest>(
  "ListAnomaliesRequest",
)(
  {
    anomalyDetectorArn: S.optional(S.String),
    suppressionState: S.optional(S.String),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIntegrationsRequest extends S.Class<ListIntegrationsRequest>(
  "ListIntegrationsRequest",
)(
  {
    integrationNamePrefix: S.optional(S.String),
    integrationType: S.optional(S.String),
    integrationStatus: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLogAnomalyDetectorsRequest extends S.Class<ListLogAnomalyDetectorsRequest>(
  "ListLogAnomalyDetectorsRequest",
)(
  {
    filterLogGroupArn: S.optional(S.String),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DataSourceFilter extends S.Class<DataSourceFilter>(
  "DataSourceFilter",
)({ name: S.String, type: S.optional(S.String) }) {}
export const DataSourceFilters = S.Array(DataSourceFilter);
export class ListLogGroupsRequest extends S.Class<ListLogGroupsRequest>(
  "ListLogGroupsRequest",
)(
  {
    logGroupNamePattern: S.optional(S.String),
    logGroupClass: S.optional(S.String),
    includeLinkedAccounts: S.optional(S.Boolean),
    accountIdentifiers: S.optional(AccountIds),
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
    dataSources: S.optional(DataSourceFilters),
    fieldIndexNames: S.optional(FieldIndexNames),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLogGroupsForQueryRequest extends S.Class<ListLogGroupsForQueryRequest>(
  "ListLogGroupsForQueryRequest",
)(
  {
    queryId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListScheduledQueriesRequest extends S.Class<ListScheduledQueriesRequest>(
  "ListScheduledQueriesRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    state: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSourcesForS3TableIntegrationRequest extends S.Class<ListSourcesForS3TableIntegrationRequest>(
  "ListSourcesForS3TableIntegrationRequest",
)(
  {
    integrationArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsLogGroupRequest extends S.Class<ListTagsLogGroupRequest>(
  "ListTagsLogGroupRequest",
)(
  { logGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAccountPolicyRequest extends S.Class<PutAccountPolicyRequest>(
  "PutAccountPolicyRequest",
)(
  {
    policyName: S.String,
    policyDocument: S.String,
    policyType: S.String,
    scope: S.optional(S.String),
    selectionCriteria: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDataProtectionPolicyRequest extends S.Class<PutDataProtectionPolicyRequest>(
  "PutDataProtectionPolicyRequest",
)(
  { logGroupIdentifier: S.String, policyDocument: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDeliveryDestinationPolicyRequest extends S.Class<PutDeliveryDestinationPolicyRequest>(
  "PutDeliveryDestinationPolicyRequest",
)(
  { deliveryDestinationName: S.String, deliveryDestinationPolicy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDeliverySourceRequest extends S.Class<PutDeliverySourceRequest>(
  "PutDeliverySourceRequest",
)(
  {
    name: S.String,
    resourceArn: S.String,
    logType: S.String,
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDestinationRequest extends S.Class<PutDestinationRequest>(
  "PutDestinationRequest",
)(
  {
    destinationName: S.String,
    targetArn: S.String,
    roleArn: S.String,
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDestinationPolicyRequest extends S.Class<PutDestinationPolicyRequest>(
  "PutDestinationPolicyRequest",
)(
  {
    destinationName: S.String,
    accessPolicy: S.String,
    forceUpdate: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDestinationPolicyResponse extends S.Class<PutDestinationPolicyResponse>(
  "PutDestinationPolicyResponse",
)({}, ns) {}
export class PutIndexPolicyRequest extends S.Class<PutIndexPolicyRequest>(
  "PutIndexPolicyRequest",
)(
  { logGroupIdentifier: S.String, policyDocument: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutLogGroupDeletionProtectionRequest extends S.Class<PutLogGroupDeletionProtectionRequest>(
  "PutLogGroupDeletionProtectionRequest",
)(
  { logGroupIdentifier: S.String, deletionProtectionEnabled: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutLogGroupDeletionProtectionResponse extends S.Class<PutLogGroupDeletionProtectionResponse>(
  "PutLogGroupDeletionProtectionResponse",
)({}, ns) {}
export class PutQueryDefinitionRequest extends S.Class<PutQueryDefinitionRequest>(
  "PutQueryDefinitionRequest",
)(
  {
    queryLanguage: S.optional(S.String),
    name: S.String,
    queryDefinitionId: S.optional(S.String),
    logGroupNames: S.optional(LogGroupNames),
    queryString: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  {
    policyName: S.optional(S.String),
    policyDocument: S.optional(S.String),
    resourceArn: S.optional(S.String),
    expectedRevisionId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRetentionPolicyRequest extends S.Class<PutRetentionPolicyRequest>(
  "PutRetentionPolicyRequest",
)(
  { logGroupName: S.String, retentionInDays: S.Number },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRetentionPolicyResponse extends S.Class<PutRetentionPolicyResponse>(
  "PutRetentionPolicyResponse",
)({}, ns) {}
export class PutSubscriptionFilterRequest extends S.Class<PutSubscriptionFilterRequest>(
  "PutSubscriptionFilterRequest",
)(
  {
    logGroupName: S.String,
    filterName: S.String,
    filterPattern: S.String,
    destinationArn: S.String,
    roleArn: S.optional(S.String),
    distribution: S.optional(S.String),
    applyOnTransformedLogs: S.optional(S.Boolean),
    fieldSelectionCriteria: S.optional(S.String),
    emitSystemFields: S.optional(EmitSystemFields),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutSubscriptionFilterResponse extends S.Class<PutSubscriptionFilterResponse>(
  "PutSubscriptionFilterResponse",
)({}, ns) {}
export class StartLiveTailRequest extends S.Class<StartLiveTailRequest>(
  "StartLiveTailRequest",
)(
  {
    logGroupIdentifiers: StartLiveTailLogGroupIdentifiers,
    logStreamNames: S.optional(InputLogStreamNames),
    logStreamNamePrefixes: S.optional(InputLogStreamNames),
    logEventFilterPattern: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartQueryRequest extends S.Class<StartQueryRequest>(
  "StartQueryRequest",
)(
  {
    queryLanguage: S.optional(S.String),
    logGroupName: S.optional(S.String),
    logGroupNames: S.optional(LogGroupNames),
    logGroupIdentifiers: S.optional(LogGroupIdentifiers),
    startTime: S.Number,
    endTime: S.Number,
    queryString: S.String,
    limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopQueryRequest extends S.Class<StopQueryRequest>(
  "StopQueryRequest",
)(
  { queryId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagLogGroupRequest extends S.Class<TagLogGroupRequest>(
  "TagLogGroupRequest",
)(
  { logGroupName: S.String, tags: Tags },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagLogGroupResponse extends S.Class<TagLogGroupResponse>(
  "TagLogGroupResponse",
)({}, ns) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: Tags },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class TestMetricFilterRequest extends S.Class<TestMetricFilterRequest>(
  "TestMetricFilterRequest",
)(
  { filterPattern: S.String, logEventMessages: TestEventMessages },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddKeyEntry extends S.Class<AddKeyEntry>("AddKeyEntry")({
  key: S.String,
  value: S.String,
  overwriteIfExists: S.optional(S.Boolean),
}) {}
export const AddKeyEntries = S.Array(AddKeyEntry);
export class AddKeys extends S.Class<AddKeys>("AddKeys")({
  entries: AddKeyEntries,
}) {}
export class CopyValueEntry extends S.Class<CopyValueEntry>("CopyValueEntry")({
  source: S.String,
  target: S.String,
  overwriteIfExists: S.optional(S.Boolean),
}) {}
export const CopyValueEntries = S.Array(CopyValueEntry);
export class CopyValue extends S.Class<CopyValue>("CopyValue")({
  entries: CopyValueEntries,
}) {}
export const Columns = S.Array(S.String);
export class CSV extends S.Class<CSV>("CSV")({
  quoteCharacter: S.optional(S.String),
  delimiter: S.optional(S.String),
  columns: S.optional(Columns),
  source: S.optional(S.String),
}) {}
export const MatchPatterns = S.Array(S.String);
export class DateTimeConverter extends S.Class<DateTimeConverter>(
  "DateTimeConverter",
)({
  source: S.String,
  target: S.String,
  targetFormat: S.optional(S.String),
  matchPatterns: MatchPatterns,
  sourceTimezone: S.optional(S.String),
  targetTimezone: S.optional(S.String),
  locale: S.optional(S.String),
}) {}
export const DeleteWithKeys = S.Array(S.String);
export class DeleteKeys extends S.Class<DeleteKeys>("DeleteKeys")({
  withKeys: DeleteWithKeys,
}) {}
export class Grok extends S.Class<Grok>("Grok")({
  source: S.optional(S.String),
  match: S.String,
}) {}
export class ListToMap extends S.Class<ListToMap>("ListToMap")({
  source: S.String,
  key: S.String,
  valueKey: S.optional(S.String),
  target: S.optional(S.String),
  flatten: S.optional(S.Boolean),
  flattenedElement: S.optional(S.String),
}) {}
export const LowerCaseStringWithKeys = S.Array(S.String);
export class LowerCaseString extends S.Class<LowerCaseString>(
  "LowerCaseString",
)({ withKeys: LowerCaseStringWithKeys }) {}
export class MoveKeyEntry extends S.Class<MoveKeyEntry>("MoveKeyEntry")({
  source: S.String,
  target: S.String,
  overwriteIfExists: S.optional(S.Boolean),
}) {}
export const MoveKeyEntries = S.Array(MoveKeyEntry);
export class MoveKeys extends S.Class<MoveKeys>("MoveKeys")({
  entries: MoveKeyEntries,
}) {}
export class ParseCloudfront extends S.Class<ParseCloudfront>(
  "ParseCloudfront",
)({ source: S.optional(S.String) }) {}
export class ParseJSON extends S.Class<ParseJSON>("ParseJSON")({
  source: S.optional(S.String),
  destination: S.optional(S.String),
}) {}
export class ParseKeyValue extends S.Class<ParseKeyValue>("ParseKeyValue")({
  source: S.optional(S.String),
  destination: S.optional(S.String),
  fieldDelimiter: S.optional(S.String),
  keyValueDelimiter: S.optional(S.String),
  keyPrefix: S.optional(S.String),
  nonMatchValue: S.optional(S.String),
  overwriteIfExists: S.optional(S.Boolean),
}) {}
export class ParseRoute53 extends S.Class<ParseRoute53>("ParseRoute53")({
  source: S.optional(S.String),
}) {}
export class ParseToOCSF extends S.Class<ParseToOCSF>("ParseToOCSF")({
  source: S.optional(S.String),
  eventSource: S.String,
  ocsfVersion: S.String,
  mappingVersion: S.optional(S.String),
}) {}
export class ParsePostgres extends S.Class<ParsePostgres>("ParsePostgres")({
  source: S.optional(S.String),
}) {}
export class ParseVPC extends S.Class<ParseVPC>("ParseVPC")({
  source: S.optional(S.String),
}) {}
export class ParseWAF extends S.Class<ParseWAF>("ParseWAF")({
  source: S.optional(S.String),
}) {}
export class RenameKeyEntry extends S.Class<RenameKeyEntry>("RenameKeyEntry")({
  key: S.String,
  renameTo: S.String,
  overwriteIfExists: S.optional(S.Boolean),
}) {}
export const RenameKeyEntries = S.Array(RenameKeyEntry);
export class RenameKeys extends S.Class<RenameKeys>("RenameKeys")({
  entries: RenameKeyEntries,
}) {}
export class SplitStringEntry extends S.Class<SplitStringEntry>(
  "SplitStringEntry",
)({ source: S.String, delimiter: S.String }) {}
export const SplitStringEntries = S.Array(SplitStringEntry);
export class SplitString extends S.Class<SplitString>("SplitString")({
  entries: SplitStringEntries,
}) {}
export class SubstituteStringEntry extends S.Class<SubstituteStringEntry>(
  "SubstituteStringEntry",
)({ source: S.String, from: S.String, to: S.String }) {}
export const SubstituteStringEntries = S.Array(SubstituteStringEntry);
export class SubstituteString extends S.Class<SubstituteString>(
  "SubstituteString",
)({ entries: SubstituteStringEntries }) {}
export const TrimStringWithKeys = S.Array(S.String);
export class TrimString extends S.Class<TrimString>("TrimString")({
  withKeys: TrimStringWithKeys,
}) {}
export class TypeConverterEntry extends S.Class<TypeConverterEntry>(
  "TypeConverterEntry",
)({ key: S.String, type: S.String }) {}
export const TypeConverterEntries = S.Array(TypeConverterEntry);
export class TypeConverter extends S.Class<TypeConverter>("TypeConverter")({
  entries: TypeConverterEntries,
}) {}
export const UpperCaseStringWithKeys = S.Array(S.String);
export class UpperCaseString extends S.Class<UpperCaseString>(
  "UpperCaseString",
)({ withKeys: UpperCaseStringWithKeys }) {}
export class Processor extends S.Class<Processor>("Processor")({
  addKeys: S.optional(AddKeys),
  copyValue: S.optional(CopyValue),
  csv: S.optional(CSV),
  dateTimeConverter: S.optional(DateTimeConverter),
  deleteKeys: S.optional(DeleteKeys),
  grok: S.optional(Grok),
  listToMap: S.optional(ListToMap),
  lowerCaseString: S.optional(LowerCaseString),
  moveKeys: S.optional(MoveKeys),
  parseCloudfront: S.optional(ParseCloudfront),
  parseJSON: S.optional(ParseJSON),
  parseKeyValue: S.optional(ParseKeyValue),
  parseRoute53: S.optional(ParseRoute53),
  parseToOCSF: S.optional(ParseToOCSF),
  parsePostgres: S.optional(ParsePostgres),
  parseVPC: S.optional(ParseVPC),
  parseWAF: S.optional(ParseWAF),
  renameKeys: S.optional(RenameKeys),
  splitString: S.optional(SplitString),
  substituteString: S.optional(SubstituteString),
  trimString: S.optional(TrimString),
  typeConverter: S.optional(TypeConverter),
  upperCaseString: S.optional(UpperCaseString),
}) {}
export const Processors = S.Array(Processor);
export class TestTransformerRequest extends S.Class<TestTransformerRequest>(
  "TestTransformerRequest",
)(
  { transformerConfig: Processors, logEventMessages: TestEventMessages },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagLogGroupRequest extends S.Class<UntagLogGroupRequest>(
  "UntagLogGroupRequest",
)(
  { logGroupName: S.String, tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagLogGroupResponse extends S.Class<UntagLogGroupResponse>(
  "UntagLogGroupResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class S3DeliveryConfiguration extends S.Class<S3DeliveryConfiguration>(
  "S3DeliveryConfiguration",
)({
  suffixPath: S.optional(S.String),
  enableHiveCompatiblePath: S.optional(S.Boolean),
}) {}
export class UpdateDeliveryConfigurationRequest extends S.Class<UpdateDeliveryConfigurationRequest>(
  "UpdateDeliveryConfigurationRequest",
)(
  {
    id: S.String,
    recordFields: S.optional(RecordFields),
    fieldDelimiter: S.optional(S.String),
    s3DeliveryConfiguration: S.optional(S3DeliveryConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDeliveryConfigurationResponse extends S.Class<UpdateDeliveryConfigurationResponse>(
  "UpdateDeliveryConfigurationResponse",
)({}, ns) {}
export class UpdateLogAnomalyDetectorRequest extends S.Class<UpdateLogAnomalyDetectorRequest>(
  "UpdateLogAnomalyDetectorRequest",
)(
  {
    anomalyDetectorArn: S.String,
    evaluationFrequency: S.optional(S.String),
    filterPattern: S.optional(S.String),
    anomalyVisibilityTime: S.optional(S.Number),
    enabled: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLogAnomalyDetectorResponse extends S.Class<UpdateLogAnomalyDetectorResponse>(
  "UpdateLogAnomalyDetectorResponse",
)({}, ns) {}
export class S3Configuration extends S.Class<S3Configuration>(
  "S3Configuration",
)({ destinationIdentifier: S.String, roleArn: S.String }) {}
export class DestinationConfiguration extends S.Class<DestinationConfiguration>(
  "DestinationConfiguration",
)({ s3Configuration: S3Configuration }) {}
export class UpdateScheduledQueryRequest extends S.Class<UpdateScheduledQueryRequest>(
  "UpdateScheduledQueryRequest",
)(
  {
    identifier: S.String,
    description: S.optional(S.String),
    queryLanguage: S.String,
    queryString: S.String,
    logGroupIdentifiers: S.optional(ScheduledQueryLogGroupIdentifiers),
    scheduleExpression: S.String,
    timezone: S.optional(S.String),
    startTimeOffset: S.optional(S.Number),
    destinationConfiguration: S.optional(DestinationConfiguration),
    scheduleStartTime: S.optional(S.Number),
    scheduleEndTime: S.optional(S.Number),
    executionRoleArn: S.String,
    state: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  name: S.String,
  type: S.optional(S.String),
}) {}
export class ImportFilter extends S.Class<ImportFilter>("ImportFilter")({
  startEventTime: S.optional(S.Number),
  endEventTime: S.optional(S.Number),
}) {}
export class DeliveryDestinationConfiguration extends S.Class<DeliveryDestinationConfiguration>(
  "DeliveryDestinationConfiguration",
)({ destinationResourceArn: S.String }) {}
export class InputLogEvent extends S.Class<InputLogEvent>("InputLogEvent")({
  timestamp: S.Number,
  message: S.String,
}) {}
export const InputLogEvents = S.Array(InputLogEvent);
export class SuppressionPeriod extends S.Class<SuppressionPeriod>(
  "SuppressionPeriod",
)({ value: S.optional(S.Number), suppressionUnit: S.optional(S.String) }) {}
export const DashboardViewerPrincipals = S.Array(S.String);
export class AssociateSourceToS3TableIntegrationRequest extends S.Class<AssociateSourceToS3TableIntegrationRequest>(
  "AssociateSourceToS3TableIntegrationRequest",
)(
  { integrationArn: S.String, dataSource: DataSource },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDeliveryRequest extends S.Class<CreateDeliveryRequest>(
  "CreateDeliveryRequest",
)(
  {
    deliverySourceName: S.String,
    deliveryDestinationArn: S.String,
    recordFields: S.optional(RecordFields),
    fieldDelimiter: S.optional(S.String),
    s3DeliveryConfiguration: S.optional(S3DeliveryConfiguration),
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateExportTaskResponse extends S.Class<CreateExportTaskResponse>(
  "CreateExportTaskResponse",
)({ taskId: S.optional(S.String) }, ns) {}
export class CreateImportTaskRequest extends S.Class<CreateImportTaskRequest>(
  "CreateImportTaskRequest",
)(
  {
    importSourceArn: S.String,
    importRoleArn: S.String,
    importFilter: S.optional(ImportFilter),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLogAnomalyDetectorResponse extends S.Class<CreateLogAnomalyDetectorResponse>(
  "CreateLogAnomalyDetectorResponse",
)({ anomalyDetectorArn: S.optional(S.String) }, ns) {}
export class DeleteQueryDefinitionResponse extends S.Class<DeleteQueryDefinitionResponse>(
  "DeleteQueryDefinitionResponse",
)({ success: S.optional(S.Boolean) }, ns) {}
export class DisassociateSourceFromS3TableIntegrationResponse extends S.Class<DisassociateSourceFromS3TableIntegrationResponse>(
  "DisassociateSourceFromS3TableIntegrationResponse",
)({ identifier: S.optional(S.String) }, ns) {}
export class GetDataProtectionPolicyResponse extends S.Class<GetDataProtectionPolicyResponse>(
  "GetDataProtectionPolicyResponse",
)(
  {
    logGroupIdentifier: S.optional(S.String),
    policyDocument: S.optional(S.String),
    lastUpdatedTime: S.optional(S.Number),
  },
  ns,
) {}
export class Delivery extends S.Class<Delivery>("Delivery")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  deliverySourceName: S.optional(S.String),
  deliveryDestinationArn: S.optional(S.String),
  deliveryDestinationType: S.optional(S.String),
  recordFields: S.optional(RecordFields),
  fieldDelimiter: S.optional(S.String),
  s3DeliveryConfiguration: S.optional(S3DeliveryConfiguration),
  tags: S.optional(Tags),
}) {}
export class GetDeliveryResponse extends S.Class<GetDeliveryResponse>(
  "GetDeliveryResponse",
)({ delivery: S.optional(Delivery) }, ns) {}
export class DeliveryDestination extends S.Class<DeliveryDestination>(
  "DeliveryDestination",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  deliveryDestinationType: S.optional(S.String),
  outputFormat: S.optional(S.String),
  deliveryDestinationConfiguration: S.optional(
    DeliveryDestinationConfiguration,
  ),
  tags: S.optional(Tags),
}) {}
export class GetDeliveryDestinationResponse extends S.Class<GetDeliveryDestinationResponse>(
  "GetDeliveryDestinationResponse",
)({ deliveryDestination: S.optional(DeliveryDestination) }, ns) {}
export const ResourceArns = S.Array(S.String);
export class DeliverySource extends S.Class<DeliverySource>("DeliverySource")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  resourceArns: S.optional(ResourceArns),
  service: S.optional(S.String),
  logType: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetDeliverySourceResponse extends S.Class<GetDeliverySourceResponse>(
  "GetDeliverySourceResponse",
)({ deliverySource: S.optional(DeliverySource) }, ns) {}
export class GetLogAnomalyDetectorResponse extends S.Class<GetLogAnomalyDetectorResponse>(
  "GetLogAnomalyDetectorResponse",
)(
  {
    detectorName: S.optional(S.String),
    logGroupArnList: S.optional(LogGroupArnList),
    evaluationFrequency: S.optional(S.String),
    filterPattern: S.optional(S.String),
    anomalyDetectorStatus: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    creationTimeStamp: S.optional(S.Number),
    lastModifiedTimeStamp: S.optional(S.Number),
    anomalyVisibilityTime: S.optional(S.Number),
  },
  ns,
) {}
export class GetScheduledQueryResponse extends S.Class<GetScheduledQueryResponse>(
  "GetScheduledQueryResponse",
)(
  {
    scheduledQueryArn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    queryLanguage: S.optional(S.String),
    queryString: S.optional(S.String),
    logGroupIdentifiers: S.optional(ScheduledQueryLogGroupIdentifiers),
    scheduleExpression: S.optional(S.String),
    timezone: S.optional(S.String),
    startTimeOffset: S.optional(S.Number),
    destinationConfiguration: S.optional(DestinationConfiguration),
    state: S.optional(S.String),
    lastTriggeredTime: S.optional(S.Number),
    lastExecutionStatus: S.optional(S.String),
    scheduleStartTime: S.optional(S.Number),
    scheduleEndTime: S.optional(S.Number),
    executionRoleArn: S.optional(S.String),
    creationTime: S.optional(S.Number),
    lastUpdatedTime: S.optional(S.Number),
  },
  ns,
) {}
export class GetTransformerResponse extends S.Class<GetTransformerResponse>(
  "GetTransformerResponse",
)(
  {
    logGroupIdentifier: S.optional(S.String),
    creationTime: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
    transformerConfig: S.optional(Processors),
  },
  ns,
) {}
export class ListAggregateLogGroupSummariesRequest extends S.Class<ListAggregateLogGroupSummariesRequest>(
  "ListAggregateLogGroupSummariesRequest",
)(
  {
    accountIdentifiers: S.optional(AccountIds),
    includeLinkedAccounts: S.optional(S.Boolean),
    logGroupClass: S.optional(S.String),
    logGroupNamePattern: S.optional(S.String),
    dataSources: S.optional(DataSourceFilters),
    groupBy: S.String,
    nextToken: S.optional(S.String),
    limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLogGroupsForQueryResponse extends S.Class<ListLogGroupsForQueryResponse>(
  "ListLogGroupsForQueryResponse",
)(
  {
    logGroupIdentifiers: S.optional(LogGroupIdentifiers),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }, ns) {}
export class ListTagsLogGroupResponse extends S.Class<ListTagsLogGroupResponse>(
  "ListTagsLogGroupResponse",
)({ tags: S.optional(Tags) }, ns) {}
export class AccountPolicy extends S.Class<AccountPolicy>("AccountPolicy")({
  policyName: S.optional(S.String),
  policyDocument: S.optional(S.String),
  lastUpdatedTime: S.optional(S.Number),
  policyType: S.optional(S.String),
  scope: S.optional(S.String),
  selectionCriteria: S.optional(S.String),
  accountId: S.optional(S.String),
}) {}
export class PutAccountPolicyResponse extends S.Class<PutAccountPolicyResponse>(
  "PutAccountPolicyResponse",
)({ accountPolicy: S.optional(AccountPolicy) }, ns) {}
export class PutDataProtectionPolicyResponse extends S.Class<PutDataProtectionPolicyResponse>(
  "PutDataProtectionPolicyResponse",
)(
  {
    logGroupIdentifier: S.optional(S.String),
    policyDocument: S.optional(S.String),
    lastUpdatedTime: S.optional(S.Number),
  },
  ns,
) {}
export class PutDeliveryDestinationRequest extends S.Class<PutDeliveryDestinationRequest>(
  "PutDeliveryDestinationRequest",
)(
  {
    name: S.String,
    outputFormat: S.optional(S.String),
    deliveryDestinationConfiguration: S.optional(
      DeliveryDestinationConfiguration,
    ),
    deliveryDestinationType: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Policy extends S.Class<Policy>("Policy")({
  deliveryDestinationPolicy: S.optional(S.String),
}) {}
export class PutDeliveryDestinationPolicyResponse extends S.Class<PutDeliveryDestinationPolicyResponse>(
  "PutDeliveryDestinationPolicyResponse",
)({ policy: S.optional(Policy) }, ns) {}
export class PutDeliverySourceResponse extends S.Class<PutDeliverySourceResponse>(
  "PutDeliverySourceResponse",
)({ deliverySource: S.optional(DeliverySource) }, ns) {}
export class Destination extends S.Class<Destination>("Destination")({
  destinationName: S.optional(S.String),
  targetArn: S.optional(S.String),
  roleArn: S.optional(S.String),
  accessPolicy: S.optional(S.String),
  arn: S.optional(S.String),
  creationTime: S.optional(S.Number),
}) {}
export class PutDestinationResponse extends S.Class<PutDestinationResponse>(
  "PutDestinationResponse",
)({ destination: S.optional(Destination) }, ns) {}
export class IndexPolicy extends S.Class<IndexPolicy>("IndexPolicy")({
  logGroupIdentifier: S.optional(S.String),
  lastUpdateTime: S.optional(S.Number),
  policyDocument: S.optional(S.String),
  policyName: S.optional(S.String),
  source: S.optional(S.String),
}) {}
export class PutIndexPolicyResponse extends S.Class<PutIndexPolicyResponse>(
  "PutIndexPolicyResponse",
)({ indexPolicy: S.optional(IndexPolicy) }, ns) {}
export class PutQueryDefinitionResponse extends S.Class<PutQueryDefinitionResponse>(
  "PutQueryDefinitionResponse",
)({ queryDefinitionId: S.optional(S.String) }, ns) {}
export class ResourcePolicy extends S.Class<ResourcePolicy>("ResourcePolicy")({
  policyName: S.optional(S.String),
  policyDocument: S.optional(S.String),
  lastUpdatedTime: S.optional(S.Number),
  policyScope: S.optional(S.String),
  resourceArn: S.optional(S.String),
  revisionId: S.optional(S.String),
}) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)(
  {
    resourcePolicy: S.optional(ResourcePolicy),
    revisionId: S.optional(S.String),
  },
  ns,
) {}
export class StartQueryResponse extends S.Class<StartQueryResponse>(
  "StartQueryResponse",
)({ queryId: S.optional(S.String) }, ns) {}
export class StopQueryResponse extends S.Class<StopQueryResponse>(
  "StopQueryResponse",
)({ success: S.optional(S.Boolean) }, ns) {}
export class UpdateAnomalyRequest extends S.Class<UpdateAnomalyRequest>(
  "UpdateAnomalyRequest",
)(
  {
    anomalyId: S.optional(S.String),
    patternId: S.optional(S.String),
    anomalyDetectorArn: S.String,
    suppressionType: S.optional(S.String),
    suppressionPeriod: S.optional(SuppressionPeriod),
    baseline: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAnomalyResponse extends S.Class<UpdateAnomalyResponse>(
  "UpdateAnomalyResponse",
)({}, ns) {}
export class UpdateScheduledQueryResponse extends S.Class<UpdateScheduledQueryResponse>(
  "UpdateScheduledQueryResponse",
)(
  {
    scheduledQueryArn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    queryLanguage: S.optional(S.String),
    queryString: S.optional(S.String),
    logGroupIdentifiers: S.optional(ScheduledQueryLogGroupIdentifiers),
    scheduleExpression: S.optional(S.String),
    timezone: S.optional(S.String),
    startTimeOffset: S.optional(S.Number),
    destinationConfiguration: S.optional(DestinationConfiguration),
    state: S.optional(S.String),
    lastTriggeredTime: S.optional(S.Number),
    lastExecutionStatus: S.optional(S.String),
    scheduleStartTime: S.optional(S.Number),
    scheduleEndTime: S.optional(S.Number),
    executionRoleArn: S.optional(S.String),
    creationTime: S.optional(S.Number),
    lastUpdatedTime: S.optional(S.Number),
  },
  ns,
) {}
export const OutputFormats = S.Array(S.String);
export const AllowedFieldDelimiters = S.Array(S.String);
export const InheritedProperties = S.Array(S.String);
export class OpenSearchResourceConfig extends S.Class<OpenSearchResourceConfig>(
  "OpenSearchResourceConfig",
)({
  kmsKeyArn: S.optional(S.String),
  dataSourceRoleArn: S.String,
  dashboardViewerPrincipals: DashboardViewerPrincipals,
  applicationArn: S.optional(S.String),
  retentionDays: S.Number,
}) {}
export const EntityKeyAttributes = S.Record({ key: S.String, value: S.String });
export const EntityAttributes = S.Record({ key: S.String, value: S.String });
export const Dimensions = S.Record({ key: S.String, value: S.String });
export class ImportStatistics extends S.Class<ImportStatistics>(
  "ImportStatistics",
)({ bytesImported: S.optional(S.Number) }) {}
export const AccountPolicies = S.Array(AccountPolicy);
export const Deliveries = S.Array(Delivery);
export const DeliveryDestinations = S.Array(DeliveryDestination);
export const DeliverySources = S.Array(DeliverySource);
export const Destinations = S.Array(Destination);
export class FieldIndex extends S.Class<FieldIndex>("FieldIndex")({
  logGroupIdentifier: S.optional(S.String),
  fieldIndexName: S.optional(S.String),
  lastScanTime: S.optional(S.Number),
  firstEventTime: S.optional(S.Number),
  lastEventTime: S.optional(S.Number),
  type: S.optional(S.String),
}) {}
export const FieldIndexes = S.Array(FieldIndex);
export class ImportBatch extends S.Class<ImportBatch>("ImportBatch")({
  batchId: S.String,
  status: S.String,
  errorMessage: S.optional(S.String),
}) {}
export const ImportBatchList = S.Array(ImportBatch);
export class Import extends S.Class<Import>("Import")({
  importId: S.optional(S.String),
  importSourceArn: S.optional(S.String),
  importStatus: S.optional(S.String),
  importDestinationArn: S.optional(S.String),
  importStatistics: S.optional(ImportStatistics),
  importFilter: S.optional(ImportFilter),
  creationTime: S.optional(S.Number),
  lastUpdatedTime: S.optional(S.Number),
  errorMessage: S.optional(S.String),
}) {}
export const ImportList = S.Array(Import);
export const IndexPolicies = S.Array(IndexPolicy);
export class LogGroup extends S.Class<LogGroup>("LogGroup")({
  logGroupName: S.optional(S.String),
  creationTime: S.optional(S.Number),
  retentionInDays: S.optional(S.Number),
  metricFilterCount: S.optional(S.Number),
  arn: S.optional(S.String),
  storedBytes: S.optional(S.Number),
  kmsKeyId: S.optional(S.String),
  dataProtectionStatus: S.optional(S.String),
  inheritedProperties: S.optional(InheritedProperties),
  logGroupClass: S.optional(S.String),
  logGroupArn: S.optional(S.String),
  deletionProtectionEnabled: S.optional(S.Boolean),
}) {}
export const LogGroups = S.Array(LogGroup);
export class LogStream extends S.Class<LogStream>("LogStream")({
  logStreamName: S.optional(S.String),
  creationTime: S.optional(S.Number),
  firstEventTimestamp: S.optional(S.Number),
  lastEventTimestamp: S.optional(S.Number),
  lastIngestionTime: S.optional(S.Number),
  uploadSequenceToken: S.optional(S.String),
  arn: S.optional(S.String),
  storedBytes: S.optional(S.Number),
}) {}
export const LogStreams = S.Array(LogStream);
export class MetricTransformation extends S.Class<MetricTransformation>(
  "MetricTransformation",
)({
  metricName: S.String,
  metricNamespace: S.String,
  metricValue: S.String,
  defaultValue: S.optional(S.Number),
  dimensions: S.optional(Dimensions),
  unit: S.optional(S.String),
}) {}
export const MetricTransformations = S.Array(MetricTransformation);
export class MetricFilter extends S.Class<MetricFilter>("MetricFilter")({
  filterName: S.optional(S.String),
  filterPattern: S.optional(S.String),
  metricTransformations: S.optional(MetricTransformations),
  creationTime: S.optional(S.Number),
  logGroupName: S.optional(S.String),
  applyOnTransformedLogs: S.optional(S.Boolean),
  fieldSelectionCriteria: S.optional(S.String),
  emitSystemFieldDimensions: S.optional(EmitSystemFields),
}) {}
export const MetricFilters = S.Array(MetricFilter);
export class QueryInfo extends S.Class<QueryInfo>("QueryInfo")({
  queryLanguage: S.optional(S.String),
  queryId: S.optional(S.String),
  queryString: S.optional(S.String),
  status: S.optional(S.String),
  createTime: S.optional(S.Number),
  logGroupName: S.optional(S.String),
}) {}
export const QueryInfoList = S.Array(QueryInfo);
export class QueryDefinition extends S.Class<QueryDefinition>(
  "QueryDefinition",
)({
  queryLanguage: S.optional(S.String),
  queryDefinitionId: S.optional(S.String),
  name: S.optional(S.String),
  queryString: S.optional(S.String),
  lastModified: S.optional(S.Number),
  logGroupNames: S.optional(LogGroupNames),
}) {}
export const QueryDefinitionList = S.Array(QueryDefinition);
export const ResourcePolicies = S.Array(ResourcePolicy);
export class SubscriptionFilter extends S.Class<SubscriptionFilter>(
  "SubscriptionFilter",
)({
  filterName: S.optional(S.String),
  logGroupName: S.optional(S.String),
  filterPattern: S.optional(S.String),
  destinationArn: S.optional(S.String),
  roleArn: S.optional(S.String),
  distribution: S.optional(S.String),
  applyOnTransformedLogs: S.optional(S.Boolean),
  creationTime: S.optional(S.Number),
  fieldSelectionCriteria: S.optional(S.String),
  emitSystemFields: S.optional(EmitSystemFields),
}) {}
export const SubscriptionFilters = S.Array(SubscriptionFilter);
export class FilteredLogEvent extends S.Class<FilteredLogEvent>(
  "FilteredLogEvent",
)({
  logStreamName: S.optional(S.String),
  timestamp: S.optional(S.Number),
  message: S.optional(S.String),
  ingestionTime: S.optional(S.Number),
  eventId: S.optional(S.String),
}) {}
export const FilteredLogEvents = S.Array(FilteredLogEvent);
export class SearchedLogStream extends S.Class<SearchedLogStream>(
  "SearchedLogStream",
)({
  logStreamName: S.optional(S.String),
  searchedCompletely: S.optional(S.Boolean),
}) {}
export const SearchedLogStreams = S.Array(SearchedLogStream);
export class OutputLogEvent extends S.Class<OutputLogEvent>("OutputLogEvent")({
  timestamp: S.optional(S.Number),
  message: S.optional(S.String),
  ingestionTime: S.optional(S.Number),
}) {}
export const OutputLogEvents = S.Array(OutputLogEvent);
export class LogGroupField extends S.Class<LogGroupField>("LogGroupField")({
  name: S.optional(S.String),
  percent: S.optional(S.Number),
}) {}
export const LogGroupFieldList = S.Array(LogGroupField);
export const LogRecord = S.Record({ key: S.String, value: S.String });
export class ResultField extends S.Class<ResultField>("ResultField")({
  field: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const ResultRows = S.Array(ResultField);
export const QueryResults = S.Array(ResultRows);
export class QueryStatistics extends S.Class<QueryStatistics>(
  "QueryStatistics",
)({
  recordsMatched: S.optional(S.Number),
  recordsScanned: S.optional(S.Number),
  estimatedRecordsSkipped: S.optional(S.Number),
  bytesScanned: S.optional(S.Number),
  estimatedBytesSkipped: S.optional(S.Number),
  logGroupsScanned: S.optional(S.Number),
}) {}
export class IntegrationSummary extends S.Class<IntegrationSummary>(
  "IntegrationSummary",
)({
  integrationName: S.optional(S.String),
  integrationType: S.optional(S.String),
  integrationStatus: S.optional(S.String),
}) {}
export const IntegrationSummaries = S.Array(IntegrationSummary);
export class AnomalyDetector extends S.Class<AnomalyDetector>(
  "AnomalyDetector",
)({
  anomalyDetectorArn: S.optional(S.String),
  detectorName: S.optional(S.String),
  logGroupArnList: S.optional(LogGroupArnList),
  evaluationFrequency: S.optional(S.String),
  filterPattern: S.optional(S.String),
  anomalyDetectorStatus: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  creationTimeStamp: S.optional(S.Number),
  lastModifiedTimeStamp: S.optional(S.Number),
  anomalyVisibilityTime: S.optional(S.Number),
}) {}
export const AnomalyDetectors = S.Array(AnomalyDetector);
export class LogGroupSummary extends S.Class<LogGroupSummary>(
  "LogGroupSummary",
)({
  logGroupName: S.optional(S.String),
  logGroupArn: S.optional(S.String),
  logGroupClass: S.optional(S.String),
}) {}
export const LogGroupSummaries = S.Array(LogGroupSummary);
export class ScheduledQuerySummary extends S.Class<ScheduledQuerySummary>(
  "ScheduledQuerySummary",
)({
  scheduledQueryArn: S.optional(S.String),
  name: S.optional(S.String),
  state: S.optional(S.String),
  lastTriggeredTime: S.optional(S.Number),
  lastExecutionStatus: S.optional(S.String),
  scheduleExpression: S.optional(S.String),
  timezone: S.optional(S.String),
  destinationConfiguration: S.optional(DestinationConfiguration),
  creationTime: S.optional(S.Number),
  lastUpdatedTime: S.optional(S.Number),
}) {}
export const ScheduledQuerySummaryList = S.Array(ScheduledQuerySummary);
export class S3TableIntegrationSource extends S.Class<S3TableIntegrationSource>(
  "S3TableIntegrationSource",
)({
  identifier: S.optional(S.String),
  dataSource: S.optional(DataSource),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createdTimeStamp: S.optional(S.Number),
}) {}
export const S3TableIntegrationSources = S.Array(S3TableIntegrationSource);
export const ResourceConfig = S.Union(
  S.Struct({ openSearchResourceConfig: OpenSearchResourceConfig }),
);
export class Entity extends S.Class<Entity>("Entity")({
  keyAttributes: S.optional(EntityKeyAttributes),
  attributes: S.optional(EntityAttributes),
}) {}
export class TransformedLogRecord extends S.Class<TransformedLogRecord>(
  "TransformedLogRecord",
)({
  eventNumber: S.optional(S.Number),
  eventMessage: S.optional(S.String),
  transformedEventMessage: S.optional(S.String),
}) {}
export const TransformedLogs = S.Array(TransformedLogRecord);
export class AssociateSourceToS3TableIntegrationResponse extends S.Class<AssociateSourceToS3TableIntegrationResponse>(
  "AssociateSourceToS3TableIntegrationResponse",
)({ identifier: S.optional(S.String) }, ns) {}
export class CancelImportTaskResponse extends S.Class<CancelImportTaskResponse>(
  "CancelImportTaskResponse",
)(
  {
    importId: S.optional(S.String),
    importStatistics: S.optional(ImportStatistics),
    importStatus: S.optional(S.String),
    creationTime: S.optional(S.Number),
    lastUpdatedTime: S.optional(S.Number),
  },
  ns,
) {}
export class CreateDeliveryResponse extends S.Class<CreateDeliveryResponse>(
  "CreateDeliveryResponse",
)({ delivery: S.optional(Delivery) }, ns) {}
export class CreateImportTaskResponse extends S.Class<CreateImportTaskResponse>(
  "CreateImportTaskResponse",
)(
  {
    importId: S.optional(S.String),
    importDestinationArn: S.optional(S.String),
    creationTime: S.optional(S.Number),
  },
  ns,
) {}
export class CreateScheduledQueryRequest extends S.Class<CreateScheduledQueryRequest>(
  "CreateScheduledQueryRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    queryLanguage: S.String,
    queryString: S.String,
    logGroupIdentifiers: S.optional(ScheduledQueryLogGroupIdentifiers),
    scheduleExpression: S.String,
    timezone: S.optional(S.String),
    startTimeOffset: S.optional(S.Number),
    destinationConfiguration: S.optional(DestinationConfiguration),
    scheduleStartTime: S.optional(S.Number),
    scheduleEndTime: S.optional(S.Number),
    executionRoleArn: S.String,
    state: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAccountPoliciesResponse extends S.Class<DescribeAccountPoliciesResponse>(
  "DescribeAccountPoliciesResponse",
)(
  {
    accountPolicies: S.optional(AccountPolicies),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDeliveriesResponse extends S.Class<DescribeDeliveriesResponse>(
  "DescribeDeliveriesResponse",
)(
  { deliveries: S.optional(Deliveries), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeDeliveryDestinationsResponse extends S.Class<DescribeDeliveryDestinationsResponse>(
  "DescribeDeliveryDestinationsResponse",
)(
  {
    deliveryDestinations: S.optional(DeliveryDestinations),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDeliverySourcesResponse extends S.Class<DescribeDeliverySourcesResponse>(
  "DescribeDeliverySourcesResponse",
)(
  {
    deliverySources: S.optional(DeliverySources),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDestinationsResponse extends S.Class<DescribeDestinationsResponse>(
  "DescribeDestinationsResponse",
)(
  { destinations: S.optional(Destinations), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeFieldIndexesResponse extends S.Class<DescribeFieldIndexesResponse>(
  "DescribeFieldIndexesResponse",
)(
  { fieldIndexes: S.optional(FieldIndexes), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeImportTaskBatchesResponse extends S.Class<DescribeImportTaskBatchesResponse>(
  "DescribeImportTaskBatchesResponse",
)(
  {
    importSourceArn: S.optional(S.String),
    importId: S.optional(S.String),
    importBatches: S.optional(ImportBatchList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeImportTasksResponse extends S.Class<DescribeImportTasksResponse>(
  "DescribeImportTasksResponse",
)({ imports: S.optional(ImportList), nextToken: S.optional(S.String) }, ns) {}
export class DescribeIndexPoliciesResponse extends S.Class<DescribeIndexPoliciesResponse>(
  "DescribeIndexPoliciesResponse",
)(
  { indexPolicies: S.optional(IndexPolicies), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeLogGroupsResponse extends S.Class<DescribeLogGroupsResponse>(
  "DescribeLogGroupsResponse",
)({ logGroups: S.optional(LogGroups), nextToken: S.optional(S.String) }, ns) {}
export class DescribeLogStreamsResponse extends S.Class<DescribeLogStreamsResponse>(
  "DescribeLogStreamsResponse",
)(
  { logStreams: S.optional(LogStreams), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeMetricFiltersResponse extends S.Class<DescribeMetricFiltersResponse>(
  "DescribeMetricFiltersResponse",
)(
  { metricFilters: S.optional(MetricFilters), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeQueriesResponse extends S.Class<DescribeQueriesResponse>(
  "DescribeQueriesResponse",
)(
  { queries: S.optional(QueryInfoList), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeQueryDefinitionsResponse extends S.Class<DescribeQueryDefinitionsResponse>(
  "DescribeQueryDefinitionsResponse",
)(
  {
    queryDefinitions: S.optional(QueryDefinitionList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeResourcePoliciesResponse extends S.Class<DescribeResourcePoliciesResponse>(
  "DescribeResourcePoliciesResponse",
)(
  {
    resourcePolicies: S.optional(ResourcePolicies),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeSubscriptionFiltersResponse extends S.Class<DescribeSubscriptionFiltersResponse>(
  "DescribeSubscriptionFiltersResponse",
)(
  {
    subscriptionFilters: S.optional(SubscriptionFilters),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class FilterLogEventsResponse extends S.Class<FilterLogEventsResponse>(
  "FilterLogEventsResponse",
)(
  {
    events: S.optional(FilteredLogEvents),
    searchedLogStreams: S.optional(SearchedLogStreams),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetDeliveryDestinationPolicyResponse extends S.Class<GetDeliveryDestinationPolicyResponse>(
  "GetDeliveryDestinationPolicyResponse",
)({ policy: S.optional(Policy) }, ns) {}
export class GetLogEventsResponse extends S.Class<GetLogEventsResponse>(
  "GetLogEventsResponse",
)(
  {
    events: S.optional(OutputLogEvents),
    nextForwardToken: S.optional(S.String),
    nextBackwardToken: S.optional(S.String),
  },
  ns,
) {}
export class GetLogGroupFieldsResponse extends S.Class<GetLogGroupFieldsResponse>(
  "GetLogGroupFieldsResponse",
)({ logGroupFields: S.optional(LogGroupFieldList) }, ns) {}
export class GetLogRecordResponse extends S.Class<GetLogRecordResponse>(
  "GetLogRecordResponse",
)({ logRecord: S.optional(LogRecord) }, ns) {}
export class GetQueryResultsResponse extends S.Class<GetQueryResultsResponse>(
  "GetQueryResultsResponse",
)(
  {
    queryLanguage: S.optional(S.String),
    results: S.optional(QueryResults),
    statistics: S.optional(QueryStatistics),
    status: S.optional(S.String),
    encryptionKey: S.optional(S.String),
  },
  ns,
) {}
export class ListIntegrationsResponse extends S.Class<ListIntegrationsResponse>(
  "ListIntegrationsResponse",
)({ integrationSummaries: S.optional(IntegrationSummaries) }, ns) {}
export class ListLogAnomalyDetectorsResponse extends S.Class<ListLogAnomalyDetectorsResponse>(
  "ListLogAnomalyDetectorsResponse",
)(
  {
    anomalyDetectors: S.optional(AnomalyDetectors),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLogGroupsResponse extends S.Class<ListLogGroupsResponse>(
  "ListLogGroupsResponse",
)(
  { logGroups: S.optional(LogGroupSummaries), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListScheduledQueriesResponse extends S.Class<ListScheduledQueriesResponse>(
  "ListScheduledQueriesResponse",
)(
  {
    nextToken: S.optional(S.String),
    scheduledQueries: S.optional(ScheduledQuerySummaryList),
  },
  ns,
) {}
export class ListSourcesForS3TableIntegrationResponse extends S.Class<ListSourcesForS3TableIntegrationResponse>(
  "ListSourcesForS3TableIntegrationResponse",
)(
  {
    sources: S.optional(S3TableIntegrationSources),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class PutDeliveryDestinationResponse extends S.Class<PutDeliveryDestinationResponse>(
  "PutDeliveryDestinationResponse",
)({ deliveryDestination: S.optional(DeliveryDestination) }, ns) {}
export class PutIntegrationRequest extends S.Class<PutIntegrationRequest>(
  "PutIntegrationRequest",
)(
  {
    integrationName: S.String,
    resourceConfig: ResourceConfig,
    integrationType: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutLogEventsRequest extends S.Class<PutLogEventsRequest>(
  "PutLogEventsRequest",
)(
  {
    logGroupName: S.String,
    logStreamName: S.String,
    logEvents: InputLogEvents,
    sequenceToken: S.optional(S.String),
    entity: S.optional(Entity),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutMetricFilterRequest extends S.Class<PutMetricFilterRequest>(
  "PutMetricFilterRequest",
)(
  {
    logGroupName: S.String,
    filterName: S.String,
    filterPattern: S.String,
    metricTransformations: MetricTransformations,
    applyOnTransformedLogs: S.optional(S.Boolean),
    fieldSelectionCriteria: S.optional(S.String),
    emitSystemFieldDimensions: S.optional(EmitSystemFields),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutMetricFilterResponse extends S.Class<PutMetricFilterResponse>(
  "PutMetricFilterResponse",
)({}, ns) {}
export class TestTransformerResponse extends S.Class<TestTransformerResponse>(
  "TestTransformerResponse",
)({ transformedLogs: S.optional(TransformedLogs) }, ns) {}
export class ConfigurationTemplateDeliveryConfigValues extends S.Class<ConfigurationTemplateDeliveryConfigValues>(
  "ConfigurationTemplateDeliveryConfigValues",
)({
  recordFields: S.optional(RecordFields),
  fieldDelimiter: S.optional(S.String),
  s3DeliveryConfiguration: S.optional(S3DeliveryConfiguration),
}) {}
export class RecordField extends S.Class<RecordField>("RecordField")({
  name: S.optional(S.String),
  mandatory: S.optional(S.Boolean),
}) {}
export const AllowedFields = S.Array(RecordField);
export class ExportTaskStatus extends S.Class<ExportTaskStatus>(
  "ExportTaskStatus",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class ExportTaskExecutionInfo extends S.Class<ExportTaskExecutionInfo>(
  "ExportTaskExecutionInfo",
)({
  creationTime: S.optional(S.Number),
  completionTime: S.optional(S.Number),
}) {}
export class LogFieldType extends S.Class<LogFieldType>("LogFieldType")({
  type: S.optional(S.String),
  element: S.optional(
    S.suspend((): S.Schema<LogFieldType, any> => LogFieldType),
  ),
  fields: S.optional(S.suspend(() => LogFieldsList)),
}) {}
export class FieldsData extends S.Class<FieldsData>("FieldsData")({
  data: S.optional(T.Blob),
}) {}
export class InternalStreamingException extends S.Class<InternalStreamingException>(
  "InternalStreamingException",
)({ message: S.optional(S.String) }) {}
export class ScheduledQueryDestination extends S.Class<ScheduledQueryDestination>(
  "ScheduledQueryDestination",
)({
  destinationType: S.optional(S.String),
  destinationIdentifier: S.optional(S.String),
  status: S.optional(S.String),
  processedIdentifier: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const ScheduledQueryDestinationList = S.Array(ScheduledQueryDestination);
export const Histogram = S.Record({ key: S.String, value: S.Number });
export class LogEvent extends S.Class<LogEvent>("LogEvent")({
  timestamp: S.optional(S.Number),
  message: S.optional(S.String),
}) {}
export const LogSamples = S.Array(LogEvent);
export class LiveTailSessionStart extends S.Class<LiveTailSessionStart>(
  "LiveTailSessionStart",
)({
  requestId: S.optional(S.String),
  sessionId: S.optional(S.String),
  logGroupIdentifiers: S.optional(StartLiveTailLogGroupIdentifiers),
  logStreamNames: S.optional(InputLogStreamNames),
  logStreamNamePrefixes: S.optional(InputLogStreamNames),
  logEventFilterPattern: S.optional(S.String),
}) {}
export class SessionTimeoutException extends S.Class<SessionTimeoutException>(
  "SessionTimeoutException",
)({ message: S.optional(S.String) }) {}
export class SessionStreamingException extends S.Class<SessionStreamingException>(
  "SessionStreamingException",
)({ message: S.optional(S.String) }) {}
export const ExtractedValues = S.Record({ key: S.String, value: S.String });
export class ConfigurationTemplate extends S.Class<ConfigurationTemplate>(
  "ConfigurationTemplate",
)({
  service: S.optional(S.String),
  logType: S.optional(S.String),
  resourceType: S.optional(S.String),
  deliveryDestinationType: S.optional(S.String),
  defaultDeliveryConfigValues: S.optional(
    ConfigurationTemplateDeliveryConfigValues,
  ),
  allowedFields: S.optional(AllowedFields),
  allowedOutputFormats: S.optional(OutputFormats),
  allowedActionForAllowVendedLogsDeliveryForResource: S.optional(S.String),
  allowedFieldDelimiters: S.optional(AllowedFieldDelimiters),
  allowedSuffixPathFields: S.optional(RecordFields),
}) {}
export const ConfigurationTemplates = S.Array(ConfigurationTemplate);
export class ExportTask extends S.Class<ExportTask>("ExportTask")({
  taskId: S.optional(S.String),
  taskName: S.optional(S.String),
  logGroupName: S.optional(S.String),
  from: S.optional(S.Number),
  to: S.optional(S.Number),
  destination: S.optional(S.String),
  destinationPrefix: S.optional(S.String),
  status: S.optional(ExportTaskStatus),
  executionInfo: S.optional(ExportTaskExecutionInfo),
}) {}
export const ExportTasks = S.Array(ExportTask);
export class LogFieldsListItem extends S.Class<LogFieldsListItem>(
  "LogFieldsListItem",
)({
  logFieldName: S.optional(S.String),
  logFieldType: S.optional(
    S.suspend((): S.Schema<LogFieldType, any> => LogFieldType),
  ),
}) {}
export type LogFieldsList = LogFieldsListItem[];
export const LogFieldsList = S.Array(
  S.suspend((): S.Schema<LogFieldsListItem, any> => LogFieldsListItem),
) as any as S.Schema<LogFieldsList>;
export const GetLogObjectResponseStream = T.EventStream(
  S.Union(
    S.Struct({ fields: FieldsData }),
    S.Struct({ InternalStreamingException: InternalStreamingException }),
  ),
);
export class TriggerHistoryRecord extends S.Class<TriggerHistoryRecord>(
  "TriggerHistoryRecord",
)({
  queryId: S.optional(S.String),
  executionStatus: S.optional(S.String),
  triggeredTimestamp: S.optional(S.Number),
  errorMessage: S.optional(S.String),
  destinations: S.optional(ScheduledQueryDestinationList),
}) {}
export const TriggerHistoryRecordList = S.Array(TriggerHistoryRecord);
export class MetricFilterMatchRecord extends S.Class<MetricFilterMatchRecord>(
  "MetricFilterMatchRecord",
)({
  eventNumber: S.optional(S.Number),
  eventMessage: S.optional(S.String),
  extractedValues: S.optional(ExtractedValues),
}) {}
export const MetricFilterMatches = S.Array(MetricFilterMatchRecord);
export class OpenSearchResourceStatus extends S.Class<OpenSearchResourceStatus>(
  "OpenSearchResourceStatus",
)({ status: S.optional(S.String), statusMessage: S.optional(S.String) }) {}
export class OpenSearchApplication extends S.Class<OpenSearchApplication>(
  "OpenSearchApplication",
)({
  applicationEndpoint: S.optional(S.String),
  applicationArn: S.optional(S.String),
  applicationId: S.optional(S.String),
  status: S.optional(OpenSearchResourceStatus),
}) {}
export class OpenSearchCollection extends S.Class<OpenSearchCollection>(
  "OpenSearchCollection",
)({
  collectionEndpoint: S.optional(S.String),
  collectionArn: S.optional(S.String),
  status: S.optional(OpenSearchResourceStatus),
}) {}
export class OpenSearchWorkspace extends S.Class<OpenSearchWorkspace>(
  "OpenSearchWorkspace",
)({
  workspaceId: S.optional(S.String),
  status: S.optional(OpenSearchResourceStatus),
}) {}
export class OpenSearchEncryptionPolicy extends S.Class<OpenSearchEncryptionPolicy>(
  "OpenSearchEncryptionPolicy",
)({
  policyName: S.optional(S.String),
  status: S.optional(OpenSearchResourceStatus),
}) {}
export class OpenSearchNetworkPolicy extends S.Class<OpenSearchNetworkPolicy>(
  "OpenSearchNetworkPolicy",
)({
  policyName: S.optional(S.String),
  status: S.optional(OpenSearchResourceStatus),
}) {}
export class OpenSearchDataAccessPolicy extends S.Class<OpenSearchDataAccessPolicy>(
  "OpenSearchDataAccessPolicy",
)({
  policyName: S.optional(S.String),
  status: S.optional(OpenSearchResourceStatus),
}) {}
export class OpenSearchLifecyclePolicy extends S.Class<OpenSearchLifecyclePolicy>(
  "OpenSearchLifecyclePolicy",
)({
  policyName: S.optional(S.String),
  status: S.optional(OpenSearchResourceStatus),
}) {}
export const Enumerations = S.Record({ key: S.String, value: S.Number });
export class LiveTailSessionMetadata extends S.Class<LiveTailSessionMetadata>(
  "LiveTailSessionMetadata",
)({ sampled: S.optional(S.Boolean) }) {}
export class LiveTailSessionLogEvent extends S.Class<LiveTailSessionLogEvent>(
  "LiveTailSessionLogEvent",
)({
  logStreamName: S.optional(S.String),
  logGroupIdentifier: S.optional(S.String),
  message: S.optional(S.String),
  timestamp: S.optional(S.Number),
  ingestionTime: S.optional(S.Number),
}) {}
export const LiveTailSessionResults = S.Array(LiveTailSessionLogEvent);
export class CreateScheduledQueryResponse extends S.Class<CreateScheduledQueryResponse>(
  "CreateScheduledQueryResponse",
)(
  { scheduledQueryArn: S.optional(S.String), state: S.optional(S.String) },
  ns,
) {}
export class DescribeConfigurationTemplatesResponse extends S.Class<DescribeConfigurationTemplatesResponse>(
  "DescribeConfigurationTemplatesResponse",
)(
  {
    configurationTemplates: S.optional(ConfigurationTemplates),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeExportTasksResponse extends S.Class<DescribeExportTasksResponse>(
  "DescribeExportTasksResponse",
)(
  { exportTasks: S.optional(ExportTasks), nextToken: S.optional(S.String) },
  ns,
) {}
export class GetLogFieldsResponse extends S.Class<GetLogFieldsResponse>(
  "GetLogFieldsResponse",
)({ logFields: S.optional(LogFieldsList) }, ns) {}
export class GetLogObjectResponse extends S.Class<GetLogObjectResponse>(
  "GetLogObjectResponse",
)({ fieldStream: S.optional(GetLogObjectResponseStream) }, ns) {}
export class GetScheduledQueryHistoryResponse extends S.Class<GetScheduledQueryHistoryResponse>(
  "GetScheduledQueryHistoryResponse",
)(
  {
    name: S.optional(S.String),
    scheduledQueryArn: S.optional(S.String),
    triggerHistory: S.optional(TriggerHistoryRecordList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class PutIntegrationResponse extends S.Class<PutIntegrationResponse>(
  "PutIntegrationResponse",
)(
  {
    integrationName: S.optional(S.String),
    integrationStatus: S.optional(S.String),
  },
  ns,
) {}
export class PutTransformerRequest extends S.Class<PutTransformerRequest>(
  "PutTransformerRequest",
)(
  { logGroupIdentifier: S.String, transformerConfig: Processors },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutTransformerResponse extends S.Class<PutTransformerResponse>(
  "PutTransformerResponse",
)({}, ns) {}
export class TestMetricFilterResponse extends S.Class<TestMetricFilterResponse>(
  "TestMetricFilterResponse",
)({ matches: S.optional(MetricFilterMatches) }, ns) {}
export class GroupingIdentifier extends S.Class<GroupingIdentifier>(
  "GroupingIdentifier",
)({ key: S.optional(S.String), value: S.optional(S.String) }) {}
export const GroupingIdentifiers = S.Array(GroupingIdentifier);
export class PatternToken extends S.Class<PatternToken>("PatternToken")({
  dynamicTokenPosition: S.optional(S.Number),
  isDynamic: S.optional(S.Boolean),
  tokenString: S.optional(S.String),
  enumerations: S.optional(Enumerations),
  inferredTokenName: S.optional(S.String),
}) {}
export const PatternTokens = S.Array(PatternToken);
export class LiveTailSessionUpdate extends S.Class<LiveTailSessionUpdate>(
  "LiveTailSessionUpdate",
)({
  sessionMetadata: S.optional(LiveTailSessionMetadata),
  sessionResults: S.optional(LiveTailSessionResults),
}) {}
export class QueryCompileErrorLocation extends S.Class<QueryCompileErrorLocation>(
  "QueryCompileErrorLocation",
)({
  startCharOffset: S.optional(S.Number),
  endCharOffset: S.optional(S.Number),
}) {}
export class AggregateLogGroupSummary extends S.Class<AggregateLogGroupSummary>(
  "AggregateLogGroupSummary",
)({
  logGroupCount: S.optional(S.Number),
  groupingIdentifiers: S.optional(GroupingIdentifiers),
}) {}
export const AggregateLogGroupSummaries = S.Array(AggregateLogGroupSummary);
export class Anomaly extends S.Class<Anomaly>("Anomaly")({
  anomalyId: S.String,
  patternId: S.String,
  anomalyDetectorArn: S.String,
  patternString: S.String,
  patternRegex: S.optional(S.String),
  priority: S.optional(S.String),
  firstSeen: S.Number,
  lastSeen: S.Number,
  description: S.String,
  active: S.Boolean,
  state: S.String,
  histogram: Histogram,
  logSamples: LogSamples,
  patternTokens: PatternTokens,
  logGroupArnList: LogGroupArnList,
  suppressed: S.optional(S.Boolean),
  suppressedDate: S.optional(S.Number),
  suppressedUntil: S.optional(S.Number),
  isPatternLevelSuppression: S.optional(S.Boolean),
}) {}
export const Anomalies = S.Array(Anomaly);
export class RejectedLogEventsInfo extends S.Class<RejectedLogEventsInfo>(
  "RejectedLogEventsInfo",
)({
  tooNewLogEventStartIndex: S.optional(S.Number),
  tooOldLogEventEndIndex: S.optional(S.Number),
  expiredLogEventEndIndex: S.optional(S.Number),
}) {}
export class RejectedEntityInfo extends S.Class<RejectedEntityInfo>(
  "RejectedEntityInfo",
)({ errorType: S.String }) {}
export const StartLiveTailResponseStream = T.EventStream(
  S.Union(
    S.Struct({ sessionStart: LiveTailSessionStart }),
    S.Struct({ sessionUpdate: LiveTailSessionUpdate }),
    S.Struct({ SessionTimeoutException: SessionTimeoutException }),
    S.Struct({ SessionStreamingException: SessionStreamingException }),
  ),
);
export class QueryCompileError extends S.Class<QueryCompileError>(
  "QueryCompileError",
)({
  location: S.optional(QueryCompileErrorLocation),
  message: S.optional(S.String),
}) {}
export class OpenSearchDataSource extends S.Class<OpenSearchDataSource>(
  "OpenSearchDataSource",
)({
  dataSourceName: S.optional(S.String),
  status: S.optional(OpenSearchResourceStatus),
}) {}
export class ListAggregateLogGroupSummariesResponse extends S.Class<ListAggregateLogGroupSummariesResponse>(
  "ListAggregateLogGroupSummariesResponse",
)(
  {
    aggregateLogGroupSummaries: S.optional(AggregateLogGroupSummaries),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListAnomaliesResponse extends S.Class<ListAnomaliesResponse>(
  "ListAnomaliesResponse",
)({ anomalies: S.optional(Anomalies), nextToken: S.optional(S.String) }, ns) {}
export class PutLogEventsResponse extends S.Class<PutLogEventsResponse>(
  "PutLogEventsResponse",
)(
  {
    nextSequenceToken: S.optional(S.String),
    rejectedLogEventsInfo: S.optional(RejectedLogEventsInfo),
    rejectedEntityInfo: S.optional(RejectedEntityInfo),
  },
  ns,
) {}
export class StartLiveTailResponse extends S.Class<StartLiveTailResponse>(
  "StartLiveTailResponse",
)({ responseStream: S.optional(StartLiveTailResponseStream) }, ns) {}
export class OpenSearchIntegrationDetails extends S.Class<OpenSearchIntegrationDetails>(
  "OpenSearchIntegrationDetails",
)({
  dataSource: S.optional(OpenSearchDataSource),
  application: S.optional(OpenSearchApplication),
  collection: S.optional(OpenSearchCollection),
  workspace: S.optional(OpenSearchWorkspace),
  encryptionPolicy: S.optional(OpenSearchEncryptionPolicy),
  networkPolicy: S.optional(OpenSearchNetworkPolicy),
  accessPolicy: S.optional(OpenSearchDataAccessPolicy),
  lifecyclePolicy: S.optional(OpenSearchLifecyclePolicy),
}) {}
export const IntegrationDetails = S.Union(
  S.Struct({ openSearchIntegrationDetails: OpenSearchIntegrationDetails }),
);
export class GetIntegrationResponse extends S.Class<GetIntegrationResponse>(
  "GetIntegrationResponse",
)(
  {
    integrationName: S.optional(S.String),
    integrationType: S.optional(S.String),
    integrationStatus: S.optional(S.String),
    integrationDetails: S.optional(IntegrationDetails),
  },
  ns,
) {}

//# Errors
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class OperationAbortedException extends S.TaggedError<OperationAbortedException>()(
  "OperationAbortedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class MalformedQueryException extends S.TaggedError<MalformedQueryException>()(
  "MalformedQueryException",
  {
    queryCompileError: S.optional(QueryCompileError),
    message: S.optional(S.String),
  },
) {}
export class DataAlreadyAcceptedException extends S.TaggedError<DataAlreadyAcceptedException>()(
  "DataAlreadyAcceptedException",
  {
    expectedSequenceToken: S.optional(S.String),
    message: S.optional(S.String),
  },
) {}
export class InvalidSequenceTokenException extends S.TaggedError<InvalidSequenceTokenException>()(
  "InvalidSequenceTokenException",
  {
    expectedSequenceToken: S.optional(S.String),
    message: S.optional(S.String),
  },
) {}
export class UnrecognizedClientException extends S.TaggedError<UnrecognizedClientException>()(
  "UnrecognizedClientException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes the specified destination, and eventually disables all the subscription filters
 * that publish to it. This operation does not delete the physical resource encapsulated by the
 * destination.
 */
export const deleteDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDestinationRequest,
  output: DeleteDestinationResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes a log-group level field index policy that was applied to a single log group. The
 * indexing of the log events that happened before you delete the policy will still be used for
 * as many as 30 days to improve CloudWatch Logs Insights queries.
 *
 * If the deleted policy included facet configurations, those facets will no longer be
 * available for interactive exploration in the CloudWatch Logs Insights console for this log
 * group. However, facet data is retained for up to 30 days.
 *
 * You can't use this operation to delete an account-level index policy. Instead, use DeleteAccountPolicy.
 *
 * If you delete a log-group level field index policy and there is an account-level field
 * index policy, in a few minutes the log group begins using that account-wide policy to index
 * new incoming log events. This operation only affects log group-level policies, including any
 * facet configurations, and preserves any data source-based account policies that may apply to
 * the log group.
 */
export const deleteIndexPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexPolicyRequest,
  output: DeleteIndexPolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the specified CloudWatch Logs anomaly detector.
 */
export const deleteLogAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLogAnomalyDetectorRequest,
    output: DeleteLogAnomalyDetectorResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes the specified log group and permanently deletes all the archived log events
 * associated with the log group.
 */
export const deleteLogGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLogGroupRequest,
  output: DeleteLogGroupResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified log stream and permanently deletes all the archived log events
 * associated with the log stream.
 */
export const deleteLogStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLogStreamRequest,
  output: DeleteLogStreamResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified metric filter.
 */
export const deleteMetricFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMetricFilterRequest,
  output: DeleteMetricFilterResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes a resource policy from this account. This revokes the access of the identities
 * in that policy to put log events to this account.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes the specified retention policy.
 *
 * Log events do not expire if they belong to log groups without a retention
 * policy.
 */
export const deleteRetentionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRetentionPolicyRequest,
    output: DeleteRetentionPolicyResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes the specified subscription filter.
 */
export const deleteSubscriptionFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSubscriptionFilterRequest,
    output: DeleteSubscriptionFilterResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes the log transformer for the specified log group. As soon as you do this, the
 * transformation of incoming log events according to that transformer stops. If this account has
 * an account-level transformer that applies to this log group, the log group begins using that
 * account-level transformer when this log-group level transformer is deleted.
 *
 * After you delete a transformer, be sure to edit any metric filters or subscription filters
 * that relied on the transformed versions of the log events.
 */
export const deleteTransformer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTransformerRequest,
  output: DeleteTransformerResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Disassociates the specified KMS key from the specified log group or
 * from all CloudWatch Logs Insights query results in the account.
 *
 * When you use `DisassociateKmsKey`, you specify either the
 * `logGroupName` parameter or the `resourceIdentifier` parameter. You
 * can't specify both of those parameters in the same operation.
 *
 * - Specify the `logGroupName` parameter to stop using the KMS key to encrypt future log events ingested and stored in the log group.
 * Instead, they will be encrypted with the default CloudWatch Logs method. The log events
 * that were ingested while the key was associated with the log group are still encrypted
 * with that key. Therefore, CloudWatch Logs will need permissions for the key whenever
 * that data is accessed.
 *
 * - Specify the `resourceIdentifier` parameter with the
 * `query-result` resource to stop using the KMS key to
 * encrypt the results of all future StartQuery
 * operations in the account. They will instead be encrypted with the default CloudWatch Logs method. The results from queries that ran while the key was associated with
 * the account are still encrypted with that key. Therefore, CloudWatch Logs will need
 * permissions for the key whenever that data is accessed.
 *
 * It can take up to 5 minutes for this operation to take effect.
 */
export const disassociateKmsKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateKmsKeyRequest,
  output: DisassociateKmsKeyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates an access policy associated with an existing destination. An access
 * policy is an IAM
 * policy document that is used to authorize claims to register a subscription filter
 * against a given destination.
 */
export const putDestinationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutDestinationPolicyRequest,
    output: PutDestinationPolicyResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Enables or disables deletion protection for the specified log group. When enabled on a
 * log group, deletion protection blocks all deletion operations until it is explicitly
 * disabled.
 *
 * For information about the parameters that are common to all actions, see Common Parameters.
 */
export const putLogGroupDeletionProtection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutLogGroupDeletionProtectionRequest,
    output: PutLogGroupDeletionProtectionResponse,
    errors: [
      AccessDeniedException,
      InvalidOperationException,
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Sets the retention of the specified log group. With a retention policy, you can
 * configure the number of days for which to retain log events in the specified log
 * group.
 *
 * CloudWatch Logs doesn't immediately delete log events when they reach their retention
 * setting. It typically takes up to 72 hours after that before log events are deleted, but in
 * rare situations might take longer.
 *
 * To illustrate, imagine that you change a log group to have a longer retention setting
 * when it contains log events that are past the expiration date, but haven't been deleted.
 * Those log events will take up to 72 hours to be deleted after the new retention date is
 * reached. To make sure that log data is deleted permanently, keep a log group at its lower
 * retention setting until 72 hours after the previous retention period ends. Alternatively,
 * wait to change the retention setting until you confirm that the earlier log events are
 * deleted.
 *
 * When log events reach their retention setting they are marked for deletion. After they
 * are marked for deletion, they do not add to your archival storage costs anymore, even if
 * they are not actually deleted until later. These log events marked for deletion are also not
 * included when you use an API to retrieve the `storedBytes` value to see how many
 * bytes a log group is storing.
 */
export const putRetentionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRetentionPolicyRequest,
  output: PutRetentionPolicyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates a subscription filter and associates it with the specified log
 * group. With subscription filters, you can subscribe to a real-time stream of log events
 * ingested through PutLogEvents
 * and have them delivered to a specific destination. When log events are sent to the receiving
 * service, they are Base64 encoded and compressed with the GZIP format.
 *
 * The following destinations are supported for subscription filters:
 *
 * - An Amazon Kinesis data stream belonging to the same account as the subscription
 * filter, for same-account delivery.
 *
 * - A logical destination created with PutDestination that belongs to a different account, for cross-account delivery.
 * We currently support Kinesis Data Streams and Firehose as logical
 * destinations.
 *
 * - An Amazon Kinesis Data Firehose delivery stream that belongs to the same account as
 * the subscription filter, for same-account delivery.
 *
 * - An Lambda function that belongs to the same account as the
 * subscription filter, for same-account delivery.
 *
 * Each log group can have up to two subscription filters associated with it. If you are
 * updating an existing filter, you must specify the correct name in `filterName`.
 *
 * Using regular expressions in filter patterns is supported. For these filters, there is a
 * quotas of quota of two regular expression patterns within a single filter pattern. There is
 * also a quota of five regular expression patterns per log group. For more information about
 * using regular expressions in filter patterns, see Filter pattern syntax for
 * metric filters, subscription filters, filter log events, and Live Tail.
 *
 * To perform a `PutSubscriptionFilter` operation for any destination except a
 * Lambda function, you must also have the `iam:PassRole`
 * permission.
 */
export const putSubscriptionFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutSubscriptionFilterRequest,
    output: PutSubscriptionFilterResponse,
    errors: [
      InvalidOperationException,
      InvalidParameterException,
      LimitExceededException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * The TagLogGroup operation is on the path to deprecation. We recommend that you use
 * TagResource
 * instead.
 *
 * Adds or updates the specified tags for the specified log group.
 *
 * To list the tags for a log group, use ListTagsForResource. To remove tags, use UntagResource.
 *
 * For more information about tags, see Tag Log Groups in Amazon CloudWatch Logs in the Amazon CloudWatch Logs
 * User Guide.
 *
 * CloudWatch Logs doesn't support IAM policies that prevent users from assigning specified
 * tags to log groups using the aws:Resource/*key-name*
 * or
 * `aws:TagKeys` condition keys. For more information about using tags to control
 * access, see Controlling access to Amazon Web Services resources using tags.
 */
export const tagLogGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagLogGroupRequest,
  output: TagLogGroupResponse,
  errors: [InvalidParameterException, ResourceNotFoundException],
}));
/**
 * The UntagLogGroup operation is on the path to deprecation. We recommend that you use
 * UntagResource instead.
 *
 * Removes the specified tags from the specified log group.
 *
 * To list the tags for a log group, use ListTagsForResource. To add tags, use TagResource.
 *
 * When using IAM policies to control tag management for CloudWatch Logs log groups, the
 * condition keys `aws:Resource/key-name` and `aws:TagKeys` cannot be used
 * to restrict which tags users can assign.
 */
export const untagLogGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagLogGroupRequest,
  output: UntagLogGroupResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Use this operation to update the configuration of a delivery to change
 * either the S3 path pattern or the format of the delivered logs. You can't use this operation
 * to change the source or destination of the delivery.
 */
export const updateDeliveryConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDeliveryConfigurationRequest,
    output: UpdateDeliveryConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an existing log anomaly detector.
 */
export const updateLogAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLogAnomalyDetectorRequest,
    output: UpdateLogAnomalyDetectorResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Associates the specified KMS key with either one log group in the
 * account, or with all stored CloudWatch Logs query insights results in the
 * account.
 *
 * When you use `AssociateKmsKey`, you specify either the
 * `logGroupName` parameter or the `resourceIdentifier` parameter. You
 * can't specify both of those parameters in the same operation.
 *
 * - Specify the `logGroupName` parameter to cause log events ingested into that
 * log group to be encrypted with that key. Only the log events ingested after the key is
 * associated are encrypted with that key.
 *
 * Associating a KMS key with a log group overrides any existing
 * associations between the log group and a KMS key. After a KMS key is associated with a log group, all newly ingested data for the log group
 * is encrypted using the KMS key. This association is stored as long as the
 * data encrypted with the KMS key is still within CloudWatch Logs. This
 * enables CloudWatch Logs to decrypt this data whenever it is requested.
 *
 * Associating a key with a log group does not cause the results of queries of that log
 * group to be encrypted with that key. To have query results encrypted with a KMS key, you must use an `AssociateKmsKey` operation with the
 * `resourceIdentifier` parameter that specifies a `query-result`
 * resource.
 *
 * - Specify the `resourceIdentifier` parameter with a `query-result`
 * resource, to use that key to encrypt the stored results of all future StartQuery operations in the account. The response from a GetQueryResults operation will still return the query results in plain
 * text.
 *
 * Even if you have not associated a key with your query results, the query results are
 * encrypted when stored, using the default CloudWatch Logs method.
 *
 * If you run a query from a monitoring account that queries logs in a source account,
 * the query results key from the monitoring account, if any, is used.
 *
 * If you delete the key that is used to encrypt log events or log group query results,
 * then all the associated stored log events or query results that were encrypted with that key
 * will be unencryptable and unusable.
 *
 * CloudWatch Logs supports only symmetric KMS keys. Do not associate an
 * asymmetric KMS key with your log group or query results. For more
 * information, see Using Symmetric and Asymmetric
 * Keys.
 *
 * It can take up to 5 minutes for this operation to take effect.
 *
 * If you attempt to associate a KMS key with a log group but the KMS key does not exist or the KMS key is disabled, you receive an
 * `InvalidParameterException` error.
 */
export const associateKmsKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateKmsKeyRequest,
  output: AssociateKmsKeyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Cancels the specified export task.
 *
 * The task must be in the `PENDING` or `RUNNING` state.
 */
export const cancelExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelExportTaskRequest,
  output: CancelExportTaskResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates an export task so that you can efficiently export data from a log group to an
 * Amazon S3 bucket. When you perform a `CreateExportTask` operation, you must use
 * credentials that have permission to write to the S3 bucket that you specify as the
 * destination.
 *
 * Exporting log data to S3 buckets that are encrypted by KMS is supported.
 * Exporting log data to Amazon S3 buckets that have S3 Object Lock enabled with a
 * retention period is also supported.
 *
 * Exporting to S3 buckets that are encrypted with AES-256 is supported.
 *
 * This is an asynchronous call. If all the required information is provided, this
 * operation initiates an export task and responds with the ID of the task. After the task has
 * started, you can use DescribeExportTasks to get the status of the export task. Each account can only
 * have one active (`RUNNING` or `PENDING`) export task at a time. To
 * cancel an export task, use CancelExportTask.
 *
 * You can export logs from multiple log groups or multiple time ranges to the same S3
 * bucket. To separate log data for each export task, specify a prefix to be used as the Amazon
 * S3 key prefix for all exported objects.
 *
 * We recommend that you don't regularly export to Amazon S3 as a way to
 * continuously archive your logs. For that use case, we instead recommend that you use
 * subscriptions. For more information about subscriptions, see Real-time processing of log data
 * with subscriptions.
 *
 * Time-based sorting on chunks of log data inside an exported file is not guaranteed. You
 * can sort the exported log field data by using Linux utilities.
 */
export const createExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExportTaskRequest,
  output: CreateExportTaskResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates an *anomaly detector* that regularly scans one or more log
 * groups and look for patterns and anomalies in the logs.
 *
 * An anomaly detector can help surface issues by automatically discovering anomalies in your
 * log event traffic. An anomaly detector uses machine learning algorithms to scan log events and
 * find *patterns*. A pattern is a shared text structure that recurs among
 * your log fields. Patterns provide a useful tool for analyzing large sets of logs because a
 * large number of log events can often be compressed into a few patterns.
 *
 * The anomaly detector uses pattern recognition to find `anomalies`, which are
 * unusual log events. It uses the `evaluationFrequency` to compare current log events
 * and patterns with trained baselines.
 *
 * Fields within a pattern are called *tokens*. Fields that vary within a
 * pattern, such as a request ID or timestamp, are referred to as dynamic
 * tokens and represented by ``.
 *
 * The following is an example of a pattern:
 *
 * `[INFO] Request time: ms`
 *
 * This pattern represents log events like `[INFO] Request time: 327 ms` and other
 * similar log events that differ only by the number, in this csse 327. When the pattern is
 * displayed, the different numbers are replaced by ``
 *
 * Any parts of log events that are masked as sensitive data are not scanned for anomalies.
 * For more information about masking sensitive data, see Help protect sensitive log
 * data with masking.
 */
export const createLogAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLogAnomalyDetectorRequest,
    output: CreateLogAnomalyDetectorResponse,
    errors: [
      InvalidParameterException,
      LimitExceededException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Creates a log group with the specified name. You can create up to 1,000,000 log groups
 * per Region per account.
 *
 * You must use the following guidelines when naming a log group:
 *
 * - Log group names must be unique within a Region for an Amazon Web Services
 * account.
 *
 * - Log group names can be between 1 and 512 characters long.
 *
 * - Log group names consist of the following characters: a-z, A-Z, 0-9, '_'
 * (underscore), '-' (hyphen), '/' (forward slash), '.' (period), and '#' (number
 * sign)
 *
 * - Log group names can't start with the string `aws/`
 *
 * When you create a log group, by default the log events in the log group do not expire.
 * To set a retention policy so that events expire and are deleted after a specified time, use
 * PutRetentionPolicy.
 *
 * If you associate an KMS key with the log group, ingested data is
 * encrypted using the KMS key. This association is stored as long as the data
 * encrypted with the KMS key is still within CloudWatch Logs. This enables
 * CloudWatch Logs to decrypt this data whenever it is requested.
 *
 * If you attempt to associate a KMS key with the log group but the KMS key does not exist or the KMS key is disabled, you receive an
 * `InvalidParameterException` error.
 *
 * CloudWatch Logs supports only symmetric KMS keys. Do not associate an
 * asymmetric KMS key with your log group. For more information, see Using
 * Symmetric and Asymmetric Keys.
 */
export const createLogGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLogGroupRequest,
  output: CreateLogGroupResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a log stream for the specified log group. A log stream is a sequence of log
 * events that originate from a single source, such as an application instance or a resource that
 * is being monitored.
 *
 * There is no limit on the number of log streams that you can create for a log group.
 * There is a limit of 50 TPS on `CreateLogStream` operations, after which
 * transactions are throttled.
 *
 * You must use the following guidelines when naming a log stream:
 *
 * - Log stream names must be unique within the log group.
 *
 * - Log stream names can be between 1 and 512 characters long.
 *
 * - Don't use ':' (colon) or '*' (asterisk) characters.
 */
export const createLogStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLogStreamRequest,
  output: CreateLogStreamResponse,
  errors: [
    InvalidParameterException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes a CloudWatch Logs account policy. This stops the account-wide policy from
 * applying to log groups or data sources in the account. If you delete a data protection policy
 * or subscription filter policy, any log-group level policies of those types remain in effect.
 * This operation supports deletion of data source-based field index policies, including facet
 * configurations, in addition to log group-based policies.
 *
 * To use this operation, you must be signed on with the correct permissions depending on the
 * type of policy that you are deleting.
 *
 * - To delete a data protection policy, you must have the
 * `logs:DeleteDataProtectionPolicy` and `logs:DeleteAccountPolicy`
 * permissions.
 *
 * - To delete a subscription filter policy, you must have the
 * `logs:DeleteSubscriptionFilter` and `logs:DeleteAccountPolicy`
 * permissions.
 *
 * - To delete a transformer policy, you must have the `logs:DeleteTransformer`
 * and `logs:DeleteAccountPolicy` permissions.
 *
 * - To delete a field index policy, you must have the `logs:DeleteIndexPolicy`
 * and `logs:DeleteAccountPolicy` permissions.
 *
 * If you delete a field index policy that included facet configurations, those facets
 * will no longer be available for interactive exploration in the CloudWatch Logs Insights
 * console. However, facet data is retained for up to 30 days.
 *
 * If you delete a field index policy, the indexing of the log events that happened before
 * you deleted the policy will still be used for up to 30 days to improve CloudWatch Logs
 * Insights queries.
 */
export const deleteAccountPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountPolicyRequest,
  output: DeleteAccountPolicyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the data protection policy from the specified log group.
 *
 * For more information about data protection policies, see PutDataProtectionPolicy.
 */
export const deleteDataProtectionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataProtectionPolicyRequest,
    output: DeleteDataProtectionPolicyResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes a *delivery*. A delivery is a connection between a logical
 * *delivery source* and a logical delivery
 * destination. Deleting a delivery only deletes the connection between the delivery
 * source and delivery destination. It does not delete the delivery destination or the delivery
 * source.
 */
export const deleteDelivery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeliveryRequest,
  output: DeleteDeliveryResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a *delivery destination*. A delivery is a connection between a
 * logical *delivery source* and a logical delivery
 * destination.
 *
 * You can't delete a delivery destination if any current deliveries are associated with it.
 * To find whether any deliveries are associated with this delivery destination, use the DescribeDeliveries operation and check the `deliveryDestinationArn`
 * field in the results.
 */
export const deleteDeliveryDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDeliveryDestinationRequest,
    output: DeleteDeliveryDestinationResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a delivery destination policy. For more information about these policies, see
 * PutDeliveryDestinationPolicy.
 */
export const deleteDeliveryDestinationPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDeliveryDestinationPolicyRequest,
    output: DeleteDeliveryDestinationPolicyResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ValidationException,
    ],
  }));
/**
 * Deletes a *delivery source*. A delivery is a connection between a
 * logical *delivery source* and a logical delivery
 * destination.
 *
 * You can't delete a delivery source if any current deliveries are associated with it. To
 * find whether any deliveries are associated with this delivery source, use the DescribeDeliveries operation and check the `deliverySourceName` field in
 * the results.
 */
export const deleteDeliverySource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDeliverySourceRequest,
    output: DeleteDeliverySourceResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the integration between CloudWatch Logs and OpenSearch Service. If your
 * integration has active vended logs dashboards, you must specify `true` for the
 * `force` parameter, otherwise the operation will fail. If you delete the
 * integration by setting `force` to `true`, all your vended logs
 * dashboards powered by OpenSearch Service will be deleted and the data that was on them will no
 * longer be accessible.
 */
export const deleteIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationRequest,
  output: DeleteIntegrationResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Deletes a saved CloudWatch Logs Insights query definition. A query definition contains
 * details about a saved CloudWatch Logs Insights query.
 *
 * Each `DeleteQueryDefinition` operation can delete one query definition.
 *
 * You must have the `logs:DeleteQueryDefinition` permission to be able to perform
 * this operation.
 */
export const deleteQueryDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteQueryDefinitionRequest,
    output: DeleteQueryDefinitionResponse,
    errors: [
      InvalidParameterException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Disassociates a data source from an S3 Table Integration, removing query access and
 * deleting all associated data from the integration.
 */
export const disassociateSourceFromS3TableIntegration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateSourceFromS3TableIntegrationRequest,
    output: DisassociateSourceFromS3TableIntegrationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns information about a log group data protection policy.
 */
export const getDataProtectionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataProtectionPolicyRequest,
    output: GetDataProtectionPolicyResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns complete information about one logical *delivery*. A delivery
 * is a connection between a
 * delivery
 * source
 * and a
 * *delivery destination*
 * .
 *
 * A delivery source represents an Amazon Web Services resource that sends logs to an logs
 * delivery destination. The destination can be CloudWatch Logs, Amazon S3, or Firehose. Only some Amazon Web Services services support being configured as a delivery
 * source. These services are listed in Enable logging from
 * Amazon Web Services services.
 *
 * You need to specify the delivery `id` in this operation. You can find the IDs
 * of the deliveries in your account with the DescribeDeliveries operation.
 */
export const getDelivery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeliveryRequest,
  output: GetDeliveryResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves complete information about one delivery destination.
 */
export const getDeliveryDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDeliveryDestinationRequest,
    output: GetDeliveryDestinationResponse,
    errors: [
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves complete information about one delivery source.
 */
export const getDeliverySource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeliverySourceRequest,
  output: GetDeliverySourceResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the log anomaly detector that you specify. The KMS key ARN detected is valid.
 */
export const getLogAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLogAnomalyDetectorRequest,
    output: GetLogAnomalyDetectorResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Retrieves details about a specific scheduled query, including its configuration, execution
 * status, and metadata.
 */
export const getScheduledQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetScheduledQueryRequest,
  output: GetScheduledQueryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the information about the log transformer associated with this log group.
 *
 * This operation returns data only for transformers created at the log group level. To get
 * information for an account-level transformer, use DescribeAccountPolicies.
 */
export const getTransformer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTransformerRequest,
  output: GetTransformerResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a list of the log groups that were analyzed during a single CloudWatch Logs
 * Insights query. This can be useful for queries that use log group name prefixes or the
 * `filterIndex` command, because the log groups are dynamically selected in these
 * cases.
 *
 * For more information about field indexes, see Create field indexes
 * to improve query performance and reduce costs.
 */
export const listLogGroupsForQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLogGroupsForQueryRequest,
    output: ListLogGroupsForQueryResponse,
    errors: [
      AccessDeniedException,
      InvalidParameterException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Displays the tags associated with a CloudWatch Logs resource. Currently, log groups and
 * destinations support tagging.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * The ListTagsLogGroup operation is on the path to deprecation. We recommend that you use
 * ListTagsForResource instead.
 *
 * Lists the tags for the specified log group.
 */
export const listTagsLogGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsLogGroupRequest,
  output: ListTagsLogGroupResponse,
  errors: [ResourceNotFoundException, ServiceUnavailableException],
}));
/**
 * Creates an account-level data protection policy, subscription filter policy, field index
 * policy, transformer policy, or metric extraction policy that applies to all log groups, a
 * subset of log groups, or a data source name and type combination in the account.
 *
 * For field index policies, you can configure indexed fields as *facets*
 * to enable interactive exploration of your logs. Facets provide value distributions and counts
 * for indexed fields in the CloudWatch Logs Insights console without requiring query
 * execution. For more information, see Use facets to group and
 * explore logs.
 *
 * To use this operation, you must be signed on with the correct permissions depending on the
 * type of policy that you are creating.
 *
 * - To create a data protection policy, you must have the
 * `logs:PutDataProtectionPolicy` and `logs:PutAccountPolicy`
 * permissions.
 *
 * - To create a subscription filter policy, you must have the
 * `logs:PutSubscriptionFilter` and `logs:PutAccountPolicy`
 * permissions.
 *
 * - To create a transformer policy, you must have the `logs:PutTransformer` and
 * `logs:PutAccountPolicy` permissions.
 *
 * - To create a field index policy, you must have the `logs:PutIndexPolicy` and
 * `logs:PutAccountPolicy` permissions.
 *
 * - To configure facets for field index policies, you must have the
 * `logs:PutIndexPolicy` and `logs:PutAccountPolicy`
 * permissions.
 *
 * - To create a metric extraction policy, you must have the
 * `logs:PutMetricExtractionPolicy` and `logs:PutAccountPolicy`
 * permissions.
 *
 * **Data protection policy**
 *
 * A data protection policy can help safeguard sensitive data that's ingested by your log
 * groups by auditing and masking the sensitive log data. Each account can have only one
 * account-level data protection policy.
 *
 * Sensitive data is detected and masked when it is ingested into a log group. When you set
 * a data protection policy, log events ingested into the log groups before that time are not
 * masked.
 *
 * If you use `PutAccountPolicy` to create a data protection policy for your whole
 * account, it applies to both existing log groups and all log groups that are created later in
 * this account. The account-level policy is applied to existing log groups with eventual
 * consistency. It might take up to 5 minutes before sensitive data in existing log groups begins
 * to be masked.
 *
 * By default, when a user views a log event that includes masked data, the sensitive data is
 * replaced by asterisks. A user who has the `logs:Unmask` permission can use a GetLogEvents or FilterLogEvents operation with the `unmask` parameter set to
 * `true` to view the unmasked log events. Users with the `logs:Unmask`
 * can also view unmasked data in the CloudWatch Logs console by running a CloudWatch Logs
 * Insights query with the `unmask` query command.
 *
 * For more information, including a list of types of data that can be audited and masked,
 * see Protect sensitive log data
 * with masking.
 *
 * To use the `PutAccountPolicy` operation for a data protection policy, you must
 * be signed on with the `logs:PutDataProtectionPolicy` and
 * `logs:PutAccountPolicy` permissions.
 *
 * The `PutAccountPolicy` operation applies to all log groups in the account. You
 * can use PutDataProtectionPolicy to create a data protection policy that applies to just one
 * log group. If a log group has its own data protection policy and the account also has an
 * account-level data protection policy, then the two policies are cumulative. Any sensitive term
 * specified in either policy is masked.
 *
 * **Subscription filter policy**
 *
 * A subscription filter policy sets up a real-time feed of log events from CloudWatch Logs to other Amazon Web Services services. Account-level subscription filter policies apply to
 * both existing log groups and log groups that are created later in this account. Supported
 * destinations are Kinesis Data Streams, Firehose, and Lambda. When log
 * events are sent to the receiving service, they are Base64 encoded and compressed with the GZIP
 * format.
 *
 * The following destinations are supported for subscription filters:
 *
 * - An Kinesis Data Streams data stream in the same account as the subscription policy, for
 * same-account delivery.
 *
 * - An Firehose data stream in the same account as the subscription policy, for
 * same-account delivery.
 *
 * - A Lambda function in the same account as the subscription policy, for
 * same-account delivery.
 *
 * - A logical destination in a different account created with PutDestination, for cross-account delivery. Kinesis Data Streams and Firehose are supported as logical destinations.
 *
 * Each account can have one account-level subscription filter policy per Region. If you are
 * updating an existing filter, you must specify the correct name in `PolicyName`. To
 * perform a `PutAccountPolicy` subscription filter operation for any destination
 * except a Lambda function, you must also have the `iam:PassRole`
 * permission.
 *
 * **Transformer policy**
 *
 * Creates or updates a *log transformer policy* for your account. You use
 * log transformers to transform log events into a different format, making them easier for you
 * to process and analyze. You can also transform logs from different sources into standardized
 * formats that contain relevant, source-specific information. After you have created a
 * transformer, CloudWatch Logs performs this transformation at the time of log ingestion. You
 * can then refer to the transformed versions of the logs during operations such as querying with
 * CloudWatch Logs Insights or creating metric filters or subscription filters.
 *
 * You can also use a transformer to copy metadata from metadata keys into the log events
 * themselves. This metadata can include log group name, log stream name, account ID and
 * Region.
 *
 * A transformer for a log group is a series of processors, where each processor applies one
 * type of transformation to the log events ingested into this log group. For more information
 * about the available processors to use in a transformer, see Processors that you can use.
 *
 * Having log events in standardized format enables visibility across your applications for
 * your log analysis, reporting, and alarming needs. CloudWatch Logs provides transformation
 * for common log types with out-of-the-box transformation templates for major Amazon Web Services
 * log sources such as VPC flow logs, Lambda, and Amazon RDS. You can use
 * pre-built transformation templates or create custom transformation policies.
 *
 * You can create transformers only for the log groups in the Standard log class.
 *
 * You can have one account-level transformer policy that applies to all log groups in the
 * account. Or you can create as many as 20 account-level transformer policies that are each
 * scoped to a subset of log groups with the `selectionCriteria` parameter. If you
 * have multiple account-level transformer policies with selection criteria, no two of them can
 * use the same or overlapping log group name prefixes. For example, if you have one policy
 * filtered to log groups that start with `my-log`, you can't have another transformer
 * policy filtered to `my-logpprod` or `my-logging`.
 *
 * You can also set up a transformer at the log-group level. For more information, see PutTransformer. If there is both a log-group level transformer created with
 * `PutTransformer` and an account-level transformer that could apply to the same
 * log group, the log group uses only the log-group level transformer. It ignores the
 * account-level transformer.
 *
 * **Field index policy**
 *
 * You can use field index policies to create indexes on fields found in log events for a log
 * group or data source name and type combination. Creating field indexes can help lower the scan
 * volume for CloudWatch Logs Insights queries that reference those fields, because these
 * queries attempt to skip the processing of log events that are known to not match the indexed
 * field. Good fields to index are fields that you often need to query for and fields or values
 * that match only a small fraction of the total log events. Common examples of indexes include
 * request ID, session ID, user IDs, or instance IDs. For more information, see Create field indexes to improve query performance and reduce costs
 *
 * To find the fields that are in your log group events, use the GetLogGroupFields operation. To find the fields for a data source use the GetLogFields operation.
 *
 * For example, suppose you have created a field index for `requestId`. Then, any
 * CloudWatch Logs Insights query on that log group that includes requestId =
 * *value*
 * or requestId in [*value*,
 * *value*, ...] will attempt to process only the log events where
 * the indexed field matches the specified value.
 *
 * Matches of log events to the names of indexed fields are case-sensitive. For example, an
 * indexed field of `RequestId` won't match a log event containing
 * `requestId`.
 *
 * You can have one account-level field index policy that applies to all log groups in the
 * account. Or you can create as many as 20 account-level field index policies that are each
 * scoped to a subset of log groups using `LogGroupNamePrefix` with the
 * `selectionCriteria` parameter. You can have another 20 account-level field index
 * policies using `DataSourceName` and `DataSourceType` for the
 * `selectionCriteria` parameter. If you have multiple account-level index policies
 * with `LogGroupNamePrefix` selection criteria, no two of them can use the same or
 * overlapping log group name prefixes. For example, if you have one policy filtered to log
 * groups that start with *my-log*, you can't have another field index policy
 * filtered to *my-logpprod* or *my-logging*. Similarly, if
 * you have multiple account-level index policies with `DataSourceName` and
 * `DataSourceType` selection criteria, no two of them can use the same data source
 * name and type combination. For example, if you have one policy filtered to the data source
 * name `amazon_vpc` and data source type `flow` you cannot create another
 * policy with this combination.
 *
 * If you create an account-level field index policy in a monitoring account in cross-account
 * observability, the policy is applied only to the monitoring account and not to any source
 * accounts.
 *
 * CloudWatch Logs provides default field indexes for all log groups in the Standard log
 * class. Default field indexes are automatically available for the following fields:
 *
 * - `@logStream`
 *
 * - `@aws.region`
 *
 * - `@aws.account`
 *
 * - `@source.log`
 *
 * - `@data_source_name`
 *
 * - `@data_source_type`
 *
 * - `@data_format`
 *
 * - `traceId`
 *
 * - `severityText`
 *
 * - `attributes.session.id`
 *
 * CloudWatch Logs provides default field indexes for certain data source name and type
 * combinations as well. Default field indexes are automatically available for the following data
 * source name and type combinations as identified in the following list:
 *
 * `amazon_vpc.flow`
 *
 * - `action`
 *
 * - `logStatus`
 *
 * - `region`
 *
 * - `flowDirection`
 *
 * - `type`
 *
 * `amazon_route53.resolver_query`
 *
 * - `transport`
 *
 * - `rcode`
 *
 * `aws_waf.access`
 *
 * - `action`
 *
 * - `httpRequest.country`
 *
 * `aws_cloudtrail.data`, `aws_cloudtrail.management`
 *
 * - `eventSource`
 *
 * - `eventName`
 *
 * - `awsRegion`
 *
 * - `userAgent`
 *
 * - `errorCode`
 *
 * - `eventType`
 *
 * - `managementEvent`
 *
 * - `readOnly`
 *
 * - `eventCategory`
 *
 * - `requestId`
 *
 * Default field indexes are in addition to any custom field indexes you define within your
 * policy. Default field indexes are not counted towards your field index
 * quota.
 *
 * If you want to create a field index policy for a single log group, you can use PutIndexPolicy instead of `PutAccountPolicy`. If you do so, that log
 * group will use that log-group level policy and any account-level policies that match at the
 * data source level; any account-level policy that matches at the log group level (for example,
 * no selection criteria or log group name prefix selection criteria) will be ignored.
 *
 * **Metric extraction policy**
 *
 * A metric extraction policy controls whether CloudWatch Metrics can be created through the
 * Embedded Metrics Format (EMF) for log groups in your account. By default, EMF metric creation
 * is enabled for all log groups. You can use metric extraction policies to disable EMF metric
 * creation for your entire account or specific log groups.
 *
 * When a policy disables EMF metric creation for a log group, log events in the EMF format
 * are still ingested, but no CloudWatch Metrics are created from them.
 *
 * Creating a policy disables metrics for AWS features that use EMF to create metrics, such
 * as CloudWatch Container Insights and CloudWatch Application Signals. To prevent turning off
 * those features by accident, we recommend that you exclude the underlying log-groups through
 * a selection-criteria such as LogGroupNamePrefix NOT IN ["/aws/containerinsights",
 * "/aws/ecs/containerinsights", "/aws/application-signals/data"].
 *
 * Each account can have either one account-level metric extraction policy that applies to
 * all log groups, or up to 5 policies that are each scoped to a subset of log groups with the
 * `selectionCriteria` parameter. The selection criteria supports filtering by
 * `LogGroupName` and `LogGroupNamePrefix` using the operators
 * `IN` and `NOT IN`. You can specify up to 50 values in each
 * `IN` or `NOT IN` list.
 *
 * The selection criteria can be specified in these formats:
 *
 * `LogGroupName IN ["log-group-1", "log-group-2"]`
 *
 * `LogGroupNamePrefix NOT IN ["/aws/prefix1", "/aws/prefix2"]`
 *
 * If you have multiple account-level metric extraction policies with selection criteria, no
 * two of them can have overlapping criteria. For example, if you have one policy with selection
 * criteria `LogGroupNamePrefix IN ["my-log"]`, you can't have another metric
 * extraction policy with selection criteria `LogGroupNamePrefix IN ["/my-log-prod"]`
 * or `LogGroupNamePrefix IN ["/my-logging"]`, as the set of log groups matching these
 * prefixes would be a subset of the log groups matching the first policy's prefix, creating an
 * overlap.
 *
 * When using `NOT IN`, only one policy with this operator is allowed per
 * account.
 *
 * When combining policies with `IN` and `NOT IN` operators, the
 * overlap check ensures that policies don't have conflicting effects. Two policies with
 * `IN` and `NOT IN` operators do not overlap if and only if every value
 * in the `IN `policy is completely contained within some value in the NOT
 * IN policy. For example:
 *
 * - If you have a `NOT IN` policy for prefix `"/aws/lambda"`, you
 * can create an `IN` policy for the exact log group name
 * `"/aws/lambda/function1"` because the set of log groups matching
 * `"/aws/lambda/function1"` is a subset of the log groups matching
 * `"/aws/lambda"`.
 *
 * - If you have a `NOT IN` policy for prefix `"/aws/lambda"`, you
 * cannot create an `IN` policy for prefix `"/aws"` because the set of
 * log groups matching `"/aws"` is not a subset of the log groups matching
 * `"/aws/lambda"`.
 */
export const putAccountPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountPolicyRequest,
  output: PutAccountPolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a data protection policy for the specified log group. A data protection policy can
 * help safeguard sensitive data that's ingested by the log group by auditing and masking the
 * sensitive log data.
 *
 * Sensitive data is detected and masked when it is ingested into the log group. When you
 * set a data protection policy, log events ingested into the log group before that time are
 * not masked.
 *
 * By default, when a user views a log event that includes masked data, the sensitive data is
 * replaced by asterisks. A user who has the `logs:Unmask` permission can use a GetLogEvents or FilterLogEvents operation with the `unmask` parameter set to
 * `true` to view the unmasked log events. Users with the `logs:Unmask`
 * can also view unmasked data in the CloudWatch Logs console by running a CloudWatch Logs
 * Insights query with the `unmask` query command.
 *
 * For more information, including a list of types of data that can be audited and masked,
 * see Protect sensitive log data
 * with masking.
 *
 * The `PutDataProtectionPolicy` operation applies to only the specified log
 * group. You can also use PutAccountPolicy to create an account-level data protection policy that applies to
 * all log groups in the account, including both existing log groups and log groups that are
 * created level. If a log group has its own data protection policy and the account also has an
 * account-level data protection policy, then the two policies are cumulative. Any sensitive term
 * specified in either policy is masked.
 */
export const putDataProtectionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutDataProtectionPolicyRequest,
    output: PutDataProtectionPolicyResponse,
    errors: [
      InvalidParameterException,
      LimitExceededException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Creates and assigns an IAM policy that grants permissions to CloudWatch Logs to deliver logs cross-account to a specified destination in this account. To
 * configure the delivery of logs from an Amazon Web Services service in another account to a logs
 * delivery destination in the current account, you must do the following:
 *
 * - Create a delivery source, which is a logical object that represents the resource that
 * is actually sending the logs. For more information, see PutDeliverySource.
 *
 * - Create a *delivery destination*, which is a logical object that
 * represents the actual delivery destination. For more information, see PutDeliveryDestination.
 *
 * - Use this operation in the destination account to assign an IAM policy
 * to the destination. This policy allows delivery to that destination.
 *
 * - Create a *delivery* by pairing exactly one delivery source and one
 * delivery destination. For more information, see CreateDelivery.
 *
 * Only some Amazon Web Services services support being configured as a delivery source. These
 * services are listed as **Supported [V2 Permissions]** in the
 * table at Enabling logging from
 * Amazon Web Services services.
 *
 * The contents of the policy must include two statements. One statement enables general logs
 * delivery, and the other allows delivery to the chosen destination. See the examples for the
 * needed policies.
 */
export const putDeliveryDestinationPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutDeliveryDestinationPolicyRequest,
    output: PutDeliveryDestinationPolicyResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ValidationException,
    ],
  }));
/**
 * Creates or updates a logical *delivery source*. A delivery source
 * represents an Amazon Web Services resource that sends logs to an logs delivery destination. The
 * destination can be CloudWatch Logs, Amazon S3, Firehose or X-Ray for sending traces.
 *
 * To configure logs delivery between a delivery destination and an Amazon Web Services
 * service that is supported as a delivery source, you must do the following:
 *
 * - Use `PutDeliverySource` to create a delivery source, which is a logical
 * object that represents the resource that is actually sending the logs.
 *
 * - Use `PutDeliveryDestination` to create a delivery
 * destination, which is a logical object that represents the actual delivery
 * destination. For more information, see PutDeliveryDestination.
 *
 * - If you are delivering logs cross-account, you must use PutDeliveryDestinationPolicy in the destination account to assign an IAM policy to the destination. This policy allows delivery to that destination.
 *
 * - Use `CreateDelivery` to create a *delivery* by pairing
 * exactly one delivery source and one delivery destination. For more information, see CreateDelivery.
 *
 * You can configure a single delivery source to send logs to multiple destinations by
 * creating multiple deliveries. You can also create multiple deliveries to configure multiple
 * delivery sources to send logs to the same delivery destination.
 *
 * Only some Amazon Web Services services support being configured as a delivery source. These
 * services are listed as **Supported [V2 Permissions]** in the
 * table at Enabling logging from
 * Amazon Web Services services.
 *
 * If you use this operation to update an existing delivery source, all the current delivery
 * source parameters are overwritten with the new parameter values that you specify.
 */
export const putDeliverySource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDeliverySourceRequest,
  output: PutDeliverySourceResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a destination. This operation is used only to create destinations
 * for cross-account subscriptions.
 *
 * A destination encapsulates a physical resource (such as an Amazon Kinesis stream). With
 * a destination, you can subscribe to a real-time stream of log events for a different account,
 * ingested using PutLogEvents.
 *
 * Through an access policy, a destination controls what is written to it. By default,
 * `PutDestination` does not set any access policy with the destination, which means
 * a cross-account user cannot call PutSubscriptionFilter against this destination. To enable this, the destination
 * owner must call PutDestinationPolicy after `PutDestination`.
 *
 * To perform a `PutDestination` operation, you must also have the
 * `iam:PassRole` permission.
 */
export const putDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDestinationRequest,
  output: PutDestinationResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates a *field index policy* for the specified log group.
 * Only log groups in the Standard log class support field index policies. For more information
 * about log classes, see Log
 * classes.
 *
 * You can use field index policies to create *field indexes* on fields
 * found in log events in the log group. Creating field indexes speeds up and lowers the costs
 * for CloudWatch Logs Insights queries that reference those field indexes, because these
 * queries attempt to skip the processing of log events that are known to not match the indexed
 * field. Good fields to index are fields that you often need to query for and fields or values
 * that match only a small fraction of the total log events. Common examples of indexes include
 * request ID, session ID, userID, and instance IDs. For more information, see Create field indexes to improve query performance and reduce costs.
 *
 * You can configure indexed fields as *facets* to enable interactive
 * exploration and filtering of your logs in the CloudWatch Logs Insights console. Facets
 * allow you to view value distributions and counts for indexed fields without running queries.
 * When you create a field index, you can optionally set it as a facet to enable this interactive
 * analysis capability. For more information, see Use facets to group and
 * explore logs.
 *
 * To find the fields that are in your log group events, use the GetLogGroupFields operation.
 *
 * For example, suppose you have created a field index for `requestId`. Then, any
 * CloudWatch Logs Insights query on that log group that includes requestId =
 * *value*
 * or requestId IN [*value*,
 * *value*, ...] will process fewer log events to reduce costs, and
 * have improved performance.
 *
 * CloudWatch Logs provides default field indexes for all log groups in the Standard log
 * class. Default field indexes are automatically available for the following fields:
 *
 * - `@logStream`
 *
 * - `@aws.region`
 *
 * - `@aws.account`
 *
 * - `@source.log`
 *
 * - `traceId`
 *
 * Default field indexes are in addition to any custom field indexes you define within your
 * policy. Default field indexes are not counted towards your field index quota.
 *
 * Each index policy has the following quotas and restrictions:
 *
 * - As many as 20 fields can be included in the policy.
 *
 * - Each field name can include as many as 100 characters.
 *
 * Matches of log events to the names of indexed fields are case-sensitive. For example, a
 * field index of `RequestId` won't match a log event containing
 * `requestId`.
 *
 * Log group-level field index policies created with `PutIndexPolicy` override
 * account-level field index policies created with PutAccountPolicy that apply to log groups. If you use `PutIndexPolicy`
 * to create a field index policy for a log group, that log group uses only that policy for log
 * group-level indexing, including any facet configurations. The log group ignores any
 * account-wide field index policy that applies to log groups, but data source-based account
 * policies may still apply.
 */
export const putIndexPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIndexPolicyRequest,
  output: PutIndexPolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates a query definition for CloudWatch Logs Insights. For more information,
 * see Analyzing Log Data with CloudWatch Logs Insights.
 *
 * To update a query definition, specify its `queryDefinitionId` in your request.
 * The values of `name`, `queryString`, and `logGroupNames` are
 * changed to the values that you specify in your update operation. No current values are
 * retained from the current query definition. For example, imagine updating a current query
 * definition that includes log groups. If you don't specify the `logGroupNames`
 * parameter in your update operation, the query definition changes to contain no log
 * groups.
 *
 * You must have the `logs:PutQueryDefinition` permission to be able to perform
 * this operation.
 */
export const putQueryDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutQueryDefinitionRequest,
  output: PutQueryDefinitionResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates or updates a resource policy allowing other Amazon Web Services services to put
 * log events to this account, such as Amazon Route 53. This API has the following
 * restrictions:
 *
 * - **Supported actions** - Policy only supports
 * `logs:PutLogEvents` and `logs:CreateLogStream ` actions
 *
 * - **Supported principals** - Policy only applies when
 * operations are invoked by Amazon Web Services service principals (not IAM
 * users, roles, or cross-account principals
 *
 * - **Policy limits** - An account can have a maximum of 10
 * policies without resourceARN and one per LogGroup resourceARN
 *
 * Resource policies with actions invoked by non-Amazon Web Services service principals
 * (such as IAM users, roles, or other Amazon Web Services accounts) will not be
 * enforced. For access control involving these principals, use the IAM
 * policies.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Stops a CloudWatch Logs Insights query that is in progress. If the query has already
 * ended, the operation returns an error indicating that the specified query is not
 * running.
 *
 * This operation can be used to cancel both interactive queries and individual scheduled
 * query executions. When used with scheduled queries, `StopQuery` cancels only the
 * specific execution identified by the query ID, not the scheduled query configuration
 * itself.
 */
export const stopQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopQueryRequest,
  output: StopQueryResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified CloudWatch Logs resource.
 * Currently, the only CloudWatch Logs resources that can be tagged are log groups and
 * destinations.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope
 * user permissions by granting a user permission to access or change only resources with certain
 * tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as
 * strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags. If
 * you specify a new tag key for the alarm, this tag is appended to the list of tags associated
 * with the alarm. If you specify a tag key that is already associated with the alarm, the new
 * tag value that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a CloudWatch Logs resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    TooManyTagsException,
  ],
}));
/**
 * Use this operation to *suppress* anomaly detection for a specified
 * anomaly or pattern. If you suppress an anomaly, CloudWatch Logs won't report new
 * occurrences of that anomaly and won't update that anomaly with new data. If you suppress a
 * pattern, CloudWatch Logs won't report any anomalies related to that pattern.
 *
 * You must specify either `anomalyId` or `patternId`, but you can't
 * specify both parameters in the same operation.
 *
 * If you have previously used this operation to suppress detection of a pattern or anomaly,
 * you can use it again to cause CloudWatch Logs to end the suppression. To do this, use this
 * operation and specify the anomaly or pattern to stop suppressing, and omit the
 * `suppressionType` and `suppressionPeriod` parameters.
 */
export const updateAnomaly = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAnomalyRequest,
  output: UpdateAnomalyResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates an existing scheduled query with new configuration. This operation uses PUT
 * semantics, allowing modification of query parameters, schedule, and destinations.
 */
export const updateScheduledQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateScheduledQueryRequest,
    output: UpdateScheduledQueryResponse,
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
 * Associates a data source with an S3 Table Integration for query access in the 'logs'
 * namespace. This enables querying log data using analytics engines that support Iceberg such as
 * Amazon Athena, Amazon Redshift, and Apache Spark.
 */
export const associateSourceToS3TableIntegration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateSourceToS3TableIntegrationRequest,
    output: AssociateSourceToS3TableIntegrationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Cancels an active import task and stops importing data from the CloudTrail Lake Event Data Store.
 */
export const cancelImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelImportTaskRequest,
  output: CancelImportTaskResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a *delivery*. A delivery is a connection between a logical
 * *delivery source* and a logical *delivery destination*
 * that you have already created.
 *
 * Only some Amazon Web Services services support being configured as a delivery source using
 * this operation. These services are listed as Supported [V2
 * Permissions] in the table at Enabling logging from
 * Amazon Web Services services.
 *
 * A delivery destination can represent a log group in CloudWatch Logs, an Amazon S3 bucket, a delivery stream in Firehose, or X-Ray.
 *
 * To configure logs delivery between a supported Amazon Web Services service and a
 * destination, you must do the following:
 *
 * - Create a delivery source, which is a logical object that represents the resource that
 * is actually sending the logs. For more information, see PutDeliverySource.
 *
 * - Create a *delivery destination*, which is a logical object that
 * represents the actual delivery destination. For more information, see PutDeliveryDestination.
 *
 * - If you are delivering logs cross-account, you must use PutDeliveryDestinationPolicy in the destination account to assign an IAM policy to the destination. This policy allows delivery to that destination.
 *
 * - Use `CreateDelivery` to create a *delivery* by pairing
 * exactly one delivery source and one delivery destination.
 *
 * You can configure a single delivery source to send logs to multiple destinations by
 * creating multiple deliveries. You can also create multiple deliveries to configure multiple
 * delivery sources to send logs to the same delivery destination.
 *
 * To update an existing delivery configuration, use UpdateDeliveryConfiguration.
 */
export const createDelivery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeliveryRequest,
  output: CreateDeliveryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts an import from a data source to CloudWatch Log and creates a managed log group as the destination for the imported data.
 * Currently, CloudTrail Event Data Store is the only supported data source.
 *
 * The import task must satisfy the following constraints:
 *
 * - The specified source must be in an ACTIVE state.
 *
 * - The API caller must have permissions to access the data in the provided source and to perform iam:PassRole on the
 * provided import role which has the same permissions, as described below.
 *
 * - The provided IAM role must trust the "cloudtrail.amazonaws.com" principal and have the following permissions:
 *
 * - cloudtrail:GetEventDataStoreData
 *
 * - logs:CreateLogGroup
 *
 * - logs:CreateLogStream
 *
 * - logs:PutResourcePolicy
 *
 * - (If source has an associated AWS KMS Key) kms:Decrypt
 *
 * - (If source has an associated AWS KMS Key) kms:GenerateDataKey
 *
 * Example IAM policy for provided import role:
 *
 * `[ { "Effect": "Allow", "Action": "iam:PassRole", "Resource": "arn:aws:iam::123456789012:role/apiCallerCredentials", "Condition": { "StringLike": { "iam:AssociatedResourceARN": "arn:aws:logs:us-east-1:123456789012:log-group:aws/cloudtrail/f1d45bff-d0e3-4868-b5d9-2eb678aa32fb:*" } } }, { "Effect": "Allow", "Action": [ "cloudtrail:GetEventDataStoreData" ], "Resource": [ "arn:aws:cloudtrail:us-east-1:123456789012:eventdatastore/f1d45bff-d0e3-4868-b5d9-2eb678aa32fb" ] }, { "Effect": "Allow", "Action": [ "logs:CreateImportTask", "logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutResourcePolicy" ], "Resource": [ "arn:aws:logs:us-east-1:123456789012:log-group:/aws/cloudtrail/*" ] }, { "Effect": "Allow", "Action": [ "kms:Decrypt", "kms:GenerateDataKey" ], "Resource": [ "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012" ] } ]`
 *
 * - If the import source has a customer managed key, the "cloudtrail.amazonaws.com" principal needs permissions to perform kms:Decrypt and kms:GenerateDataKey.
 *
 * - There can be no more than 3 active imports per account at a given time.
 *
 * - The startEventTime must be less than or equal to endEventTime.
 *
 * - The data being imported must be within the specified source's retention period.
 */
export const createImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImportTaskRequest,
  output: CreateImportTaskResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a scheduled query and stops all future executions. This operation also removes any
 * configured actions and associated resources.
 */
export const deleteScheduledQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteScheduledQueryRequest,
    output: DeleteScheduledQueryResponse,
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
 * Returns a list of all CloudWatch Logs account policies in the account.
 *
 * To use this operation, you must be signed on with the correct permissions depending on the
 * type of policy that you are retrieving information for.
 *
 * - To see data protection policies, you must have the
 * `logs:GetDataProtectionPolicy` and `logs:DescribeAccountPolicies`
 * permissions.
 *
 * - To see subscription filter policies, you must have the
 * `logs:DescribeSubscriptionFilters` and
 * `logs:DescribeAccountPolicies` permissions.
 *
 * - To see transformer policies, you must have the `logs:GetTransformer` and
 * `logs:DescribeAccountPolicies` permissions.
 *
 * - To see field index policies, you must have the `logs:DescribeIndexPolicies`
 * and `logs:DescribeAccountPolicies` permissions.
 */
export const describeAccountPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountPoliciesRequest,
    output: DescribeAccountPoliciesResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Retrieves a list of the deliveries that have been created in the account.
 *
 * A *delivery* is a connection between a
 * delivery
 * source
 * and a
 * *delivery destination*
 * .
 *
 * A delivery source represents an Amazon Web Services resource that sends logs to an logs
 * delivery destination. The destination can be CloudWatch Logs, Amazon S3, Firehose or X-Ray. Only some Amazon Web Services services support being
 * configured as a delivery source. These services are listed in Enable logging from
 * Amazon Web Services services.
 */
export const describeDeliveries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDeliveriesRequest,
  output: DescribeDeliveriesResponse,
  errors: [
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of the delivery destinations that have been created in the
 * account.
 */
export const describeDeliveryDestinations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDeliveryDestinationsRequest,
    output: DescribeDeliveryDestinationsResponse,
    errors: [
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a list of the delivery sources that have been created in the account.
 */
export const describeDeliverySources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDeliverySourcesRequest,
    output: DescribeDeliverySourcesResponse,
    errors: [
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all your destinations. The results are ASCII-sorted by destination
 * name.
 */
export const describeDestinations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDestinationsRequest,
    output: DescribeDestinationsResponse,
    errors: [InvalidParameterException, ServiceUnavailableException],
  }),
);
/**
 * Returns a list of custom and default field indexes which are discovered in log data. For
 * more information about field index policies, see PutIndexPolicy.
 */
export const describeFieldIndexes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFieldIndexesRequest,
    output: DescribeFieldIndexesResponse,
    errors: [
      InvalidParameterException,
      LimitExceededException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Gets detailed information about the individual batches within an import task, including their status and any error messages.
 * For CloudTrail Event Data Store sources, a batch refers to a subset of stored events grouped by their eventTime.
 */
export const describeImportTaskBatches = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeImportTaskBatchesRequest,
    output: DescribeImportTaskBatchesResponse,
    errors: [
      AccessDeniedException,
      InvalidOperationException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists and describes import tasks, with optional filtering by import status and source ARN.
 */
export const describeImportTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImportTasksRequest,
  output: DescribeImportTasksResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the field index policies of the specified log group. For more information about
 * field index policies, see PutIndexPolicy.
 *
 * If a specified log group has a log-group level index policy, that policy is returned by
 * this operation.
 *
 * If a specified log group doesn't have a log-group level index policy, but an account-wide
 * index policy applies to it, that account-wide policy is returned by this operation.
 *
 * To find information about only account-level policies, use DescribeAccountPolicies instead.
 */
export const describeIndexPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeIndexPoliciesRequest,
    output: DescribeIndexPoliciesResponse,
    errors: [
      InvalidParameterException,
      LimitExceededException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns information about log groups, including data sources that ingest into each log
 * group. You can return all your log groups or filter the results by prefix. The results are
 * ASCII-sorted by log group name.
 *
 * CloudWatch Logs doesn't support IAM policies that control access to the
 * `DescribeLogGroups` action by using the
 * aws:ResourceTag/*key-name*
 * condition key. Other CloudWatch
 * Logs actions do support the use of the
 * aws:ResourceTag/*key-name*
 * condition key to control access.
 * For more information about using tags to control access, see Controlling access to Amazon Web Services
 * resources using tags.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 */
export const describeLogGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLogGroupsRequest,
  output: DescribeLogGroupsResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Lists the log streams for the specified log group. You can list all the log streams or
 * filter the results by prefix. You can also control how the results are ordered.
 *
 * You can specify the log group to search by using either `logGroupIdentifier` or
 * `logGroupName`. You must include one of these two parameters, but you can't
 * include both.
 *
 * This operation has a limit of 25 transactions per second, after which transactions are
 * throttled.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 */
export const describeLogStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLogStreamsRequest,
  output: DescribeLogStreamsResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists the specified metric filters. You can list all of the metric filters or filter
 * the results by log name, prefix, metric name, or metric namespace. The results are
 * ASCII-sorted by filter name.
 */
export const describeMetricFilters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMetricFiltersRequest,
    output: DescribeMetricFiltersResponse,
    errors: [
      InvalidParameterException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns a list of CloudWatch Logs Insights queries that are scheduled, running, or have
 * been run recently in this account. You can request all queries or limit it to queries of a
 * specific log group or queries with a certain status.
 *
 * This operation includes both interactive queries started directly by users and automated
 * queries executed by scheduled query configurations. Scheduled query executions appear in the
 * results alongside manually initiated queries, providing visibility into all query activity in
 * your account.
 */
export const describeQueries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeQueriesRequest,
  output: DescribeQueriesResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation returns a paginated list of your saved CloudWatch Logs Insights query
 * definitions. You can retrieve query definitions from the current account or from a source
 * account that is linked to the current account.
 *
 * You can use the `queryDefinitionNamePrefix` parameter to limit the results to
 * only the query definitions that have names that start with a certain string.
 */
export const describeQueryDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeQueryDefinitionsRequest,
    output: DescribeQueryDefinitionsResponse,
    errors: [InvalidParameterException, ServiceUnavailableException],
  }),
);
/**
 * Lists the resource policies in this account.
 */
export const describeResourcePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeResourcePoliciesRequest,
    output: DescribeResourcePoliciesResponse,
    errors: [InvalidParameterException, ServiceUnavailableException],
  }),
);
/**
 * Lists the subscription filters for the specified log group. You can list all the
 * subscription filters or filter the results by prefix. The results are ASCII-sorted by filter
 * name.
 */
export const describeSubscriptionFilters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSubscriptionFiltersRequest,
    output: DescribeSubscriptionFiltersResponse,
    errors: [
      InvalidParameterException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Lists log events from the specified log group. You can list all the log events or
 * filter the results using one or more of the following:
 *
 * - A filter pattern
 *
 * - A time range
 *
 * - The log stream name, or a log stream name prefix that matches multiple log
 * streams
 *
 * You must have the `logs:FilterLogEvents` permission to perform this
 * operation.
 *
 * You can specify the log group to search by using either `logGroupIdentifier` or
 * `logGroupName`. You must include one of these two parameters, but you can't
 * include both.
 *
 * `FilterLogEvents` is a paginated operation. Each page returned can contain up
 * to 1 MB of log events or up to 10,000 log events. A returned page might only be partially
 * full, or even empty. For example, if the result of a query would return 15,000 log events, the
 * first page isn't guaranteed to have 10,000 log events even if they all fit into 1 MB.
 *
 * Partially full or empty pages don't necessarily mean that pagination is finished. If the
 * results include a `nextToken`, there might be more log events available. You can
 * return these additional log events by providing the nextToken in a subsequent
 * `FilterLogEvents` operation. If the results don't include a
 * `nextToken`, then pagination is finished.
 *
 * Specifying the `limit` parameter only guarantees that a single page doesn't
 * return more log events than the specified limit, but it might return fewer events than the
 * limit. This is the expected API behavior.
 *
 * The returned log events are sorted by event timestamp, the timestamp when the event was
 * ingested by CloudWatch Logs, and the ID of the `PutLogEvents` request.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 *
 * If you are using log
 * transformation, the `FilterLogEvents` operation returns only the
 * original versions of log events, before they were transformed. To view the transformed
 * versions, you must use a CloudWatch Logs
 * query.
 */
export const filterLogEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FilterLogEventsRequest,
  output: FilterLogEventsResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Retrieves the delivery destination policy assigned to the delivery destination that you
 * specify. For more information about delivery destinations and their policies, see PutDeliveryDestinationPolicy.
 */
export const getDeliveryDestinationPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDeliveryDestinationPolicyRequest,
    output: GetDeliveryDestinationPolicyResponse,
    errors: [
      ResourceNotFoundException,
      ServiceUnavailableException,
      ValidationException,
    ],
  }));
/**
 * Lists log events from the specified log stream. You can list all of the log events or
 * filter using a time range.
 *
 * `GetLogEvents` is a paginated operation. Each page returned can contain up to 1
 * MB of log events or up to 10,000 log events. A returned page might only be partially full, or
 * even empty. For example, if the result of a query would return 15,000 log events, the first
 * page isn't guaranteed to have 10,000 log events even if they all fit into 1 MB.
 *
 * Partially full or empty pages don't necessarily mean that pagination is finished. As long
 * as the `nextBackwardToken` or `nextForwardToken` returned is NOT equal
 * to the `nextToken` that you passed into the API call, there might be more log
 * events available. The token that you use depends on the direction you want to move in along
 * the log stream. The returned tokens are never null.
 *
 * If you set `startFromHead` to `true` and you don’t include
 * `endTime` in your request, you can end up in a situation where the pagination
 * doesn't terminate. This can happen when the new log events are being added to the target log
 * streams faster than they are being read. This situation is a good use case for the CloudWatch Logs
 * Live Tail feature.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 *
 * You can specify the log group to search by using either `logGroupIdentifier` or
 * `logGroupName`. You must include one of these two parameters, but you can't
 * include both.
 *
 * If you are using log
 * transformation, the `GetLogEvents` operation returns only the original
 * versions of log events, before they were transformed. To view the transformed versions, you
 * must use a CloudWatch Logs
 * query.
 */
export const getLogEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogEventsRequest,
  output: GetLogEventsResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a list of the fields that are included in log events in the specified log group.
 * Includes the percentage of log events that contain each field. The search is limited to a time
 * period that you specify.
 *
 * This operation is used for discovering fields within log group events. For discovering
 * fields across data sources, use the GetLogFields operation.
 *
 * You can specify the log group to search by using either `logGroupIdentifier` or
 * `logGroupName`. You must specify one of these parameters, but you can't specify
 * both.
 *
 * In the results, fields that start with `@` are fields generated by CloudWatch
 * Logs. For example, `@timestamp` is the timestamp of each log event. For more
 * information about the fields that are generated by CloudWatch logs, see Supported
 * Logs and Discovered Fields.
 *
 * The response results are sorted by the frequency percentage, starting with the highest
 * percentage.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account and view data from the linked source accounts. For more information,
 * see CloudWatch cross-account observability.
 */
export const getLogGroupFields = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogGroupFieldsRequest,
  output: GetLogGroupFieldsResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Retrieves all of the fields and values of a single log event. All fields are retrieved,
 * even if the original query that produced the `logRecordPointer` retrieved only a
 * subset of fields. Fields are returned as field name/field value pairs.
 *
 * The full unparsed log event is returned within `@message`.
 */
export const getLogRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogRecordRequest,
  output: GetLogRecordResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the results from the specified query.
 *
 * Only the fields requested in the query are returned, along with a `@ptr` field,
 * which is the identifier for the log record. You can use the value of `@ptr` in a
 * GetLogRecord
 * operation to get the full log record.
 *
 * `GetQueryResults` does not start running a query. To run a query, use StartQuery. For more information about how long results of previous queries are
 * available, see CloudWatch Logs
 * quotas.
 *
 * If the value of the `Status` field in the output is `Running`, this
 * operation returns only partial results. If you see a value of `Scheduled` or
 * `Running` for the status, you can retry the operation later to see the final
 * results.
 *
 * This operation is used both for retrieving results from interactive queries and from
 * automated scheduled query executions. Scheduled queries use `GetQueryResults`
 * internally to retrieve query results for processing and delivery to configured
 * destinations.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account to start queries in linked source accounts. For more information, see
 * CloudWatch cross-account observability.
 */
export const getQueryResults = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryResultsRequest,
  output: GetQueryResultsResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a list of integrations between CloudWatch Logs and other services in this
 * account. Currently, only one integration can be created in an account, and this integration
 * must be with OpenSearch Service.
 */
export const listIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIntegrationsRequest,
  output: ListIntegrationsResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Retrieves a list of the log anomaly detectors in the account.
 */
export const listLogAnomalyDetectors = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLogAnomalyDetectorsRequest,
    output: ListLogAnomalyDetectorsResponse,
    errors: [
      InvalidParameterException,
      OperationAbortedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns a list of log groups in the Region in your account. If you are performing this
 * action in a monitoring account, you can choose to also return log groups from source accounts
 * that are linked to the monitoring account. For more information about using cross-account
 * observability to set up monitoring accounts and source accounts, see
 * CloudWatch cross-account observability.
 *
 * You can optionally filter the list by log group class, by using regular expressions in
 * your request to match strings in the log group names, by using the fieldIndexes parameter to
 * filter log groups based on which field indexes are configured, by using the dataSources
 * parameter to filter log groups by data source types, and by using the fieldIndexNames
 * parameter to filter by specific field index names.
 *
 * This operation is paginated. By default, your first use of this operation returns 50
 * results, and includes a token to use in a subsequent operation to return more results.
 */
export const listLogGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLogGroupsRequest,
  output: ListLogGroupsResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Lists all scheduled queries in your account and region. You can filter results by state to
 * show only enabled or disabled queries.
 */
export const listScheduledQueries = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListScheduledQueriesRequest,
    output: ListScheduledQueriesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of data source associations for a specified S3 Table Integration, showing
 * which data sources are currently associated for query access.
 */
export const listSourcesForS3TableIntegration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSourcesForS3TableIntegrationRequest,
    output: ListSourcesForS3TableIntegrationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates or updates a logical *delivery destination*. A delivery
 * destination is an Amazon Web Services resource that represents an Amazon Web Services service
 * that logs can be sent to. CloudWatch Logs, Amazon S3, and Firehose are
 * supported as logs delivery destinations and X-Ray as the trace delivery
 * destination.
 *
 * To configure logs delivery between a supported Amazon Web Services service and a
 * destination, you must do the following:
 *
 * - Create a delivery source, which is a logical object that represents the resource that
 * is actually sending the logs. For more information, see PutDeliverySource.
 *
 * - Use `PutDeliveryDestination` to create a delivery
 * destination in the same account of the actual delivery destination. The
 * delivery destination that you create is a logical object that represents the actual
 * delivery destination.
 *
 * - If you are delivering logs cross-account, you must use PutDeliveryDestinationPolicy in the destination account to assign an IAM policy to the destination. This policy allows delivery to that destination.
 *
 * - Use `CreateDelivery` to create a *delivery* by pairing
 * exactly one delivery source and one delivery destination. For more information, see CreateDelivery.
 *
 * You can configure a single delivery source to send logs to multiple destinations by
 * creating multiple deliveries. You can also create multiple deliveries to configure multiple
 * delivery sources to send logs to the same delivery destination.
 *
 * Only some Amazon Web Services services support being configured as a delivery source. These
 * services are listed as **Supported [V2 Permissions]** in the
 * table at Enabling logging from
 * Amazon Web Services services.
 *
 * If you use this operation to update an existing delivery destination, all the current
 * delivery destination parameters are overwritten with the new parameter values that you
 * specify.
 */
export const putDeliveryDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutDeliveryDestinationRequest,
    output: PutDeliveryDestinationResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates or updates a metric filter and associates it with the specified log group. With
 * metric filters, you can configure rules to extract metric data from log events ingested
 * through PutLogEvents.
 *
 * The maximum number of metric filters that can be associated with a log group is
 * 100.
 *
 * Using regular expressions in filter patterns is supported. For these filters, there is a
 * quota of two regular expression patterns within a single filter pattern. There is also a quota
 * of five regular expression patterns per log group. For more information about using regular
 * expressions in filter patterns, see Filter pattern syntax for
 * metric filters, subscription filters, filter log events, and Live Tail.
 *
 * When you create a metric filter, you can also optionally assign a unit and dimensions to
 * the metric that is created.
 *
 * Metrics extracted from log events are charged as custom metrics. To prevent unexpected
 * high charges, do not specify high-cardinality fields such as `IPAddress` or
 * `requestID` as dimensions. Each different value found for a dimension is
 * treated as a separate metric and accrues charges as a separate custom metric.
 *
 * CloudWatch Logs might disable a metric filter if it generates 1,000 different
 * name/value pairs for your specified dimensions within one hour.
 *
 * You can also set up a billing alarm to alert you if your charges are higher than
 * expected. For more information, see
 * Creating a Billing Alarm to Monitor Your Estimated Amazon Web Services Charges.
 */
export const putMetricFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetricFilterRequest,
  output: PutMetricFilterResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Use this operation to test a log transformer. You enter the transformer configuration and
 * a set of log events to test with. The operation responds with an array that includes the
 * original log events and the transformed versions.
 */
export const testTransformer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestTransformerRequest,
  output: TestTransformerResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a scheduled query that runs CloudWatch Logs Insights queries at regular intervals.
 * Scheduled queries enable proactive monitoring by automatically executing queries to detect
 * patterns and anomalies in your log data. Query results can be delivered to Amazon S3 for analysis
 * or further processing.
 */
export const createScheduledQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateScheduledQueryRequest,
    output: CreateScheduledQueryResponse,
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
 * Use this operation to return the valid and default values that are used when creating
 * delivery sources, delivery destinations, and deliveries. For more information about
 * deliveries, see CreateDelivery.
 */
export const describeConfigurationTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConfigurationTemplatesRequest,
    output: DescribeConfigurationTemplatesResponse,
    errors: [
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the specified export tasks. You can list all your export tasks or filter the
 * results based on task ID or task status.
 */
export const describeExportTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExportTasksRequest,
  output: DescribeExportTasksResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Discovers available fields for a specific data source and type. The response includes any
 * field modifications introduced through pipelines, such as new fields or changed field types.
 */
export const getLogFields = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogFieldsRequest,
  output: GetLogFieldsResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Retrieves a large logging object (LLO) and streams it back. This API is used to fetch the
 * content of large portions of log events that have been ingested through the
 * PutOpenTelemetryLogs API. When log events contain fields that would cause the total event size
 * to exceed 1MB, CloudWatch Logs automatically processes up to 10 fields, starting with the
 * largest fields. Each field is truncated as needed to keep the total event size as close to 1MB
 * as possible. The excess portions are stored as Large Log Objects (LLOs) and these fields are
 * processed separately and LLO reference system fields (in the format
 * `@ptr.$[path.to.field]`) are added. The path in the reference field reflects the
 * original JSON structure where the large field was located. For example, this could be
 * `@ptr.$['input']['message']`, `@ptr.$['AAA']['BBB']['CCC']['DDD']`,
 * `@ptr.$['AAA']`, or any other path matching your log structure.
 */
export const getLogObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogObjectRequest,
  output: GetLogObjectResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the execution history of a scheduled query within a specified time range,
 * including query results and destination processing status.
 */
export const getScheduledQueryHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetScheduledQueryHistoryRequest,
    output: GetScheduledQueryHistoryResponse,
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
 * Creates an integration between CloudWatch Logs and another service in this account.
 * Currently, only integrations with OpenSearch Service are supported, and currently you can have
 * only one integration in your account.
 *
 * Integrating with OpenSearch Service makes it possible for you to create curated vended
 * logs dashboards, powered by OpenSearch Service analytics. For more information, see Vended log
 * dashboards powered by Amazon OpenSearch Service.
 *
 * You can use this operation only to create a new integration. You can't modify an existing
 * integration.
 */
export const putIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIntegrationRequest,
  output: PutIntegrationResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a *log transformer* for a single log group. You use
 * log transformers to transform log events into a different format, making them easier for you
 * to process and analyze. You can also transform logs from different sources into standardized
 * formats that contains relevant, source-specific information.
 *
 * After you have created a transformer, CloudWatch Logs performs the transformations at
 * the time of log ingestion. You can then refer to the transformed versions of the logs during
 * operations such as querying with CloudWatch Logs Insights or creating metric filters or
 * subscription filers.
 *
 * You can also use a transformer to copy metadata from metadata keys into the log events
 * themselves. This metadata can include log group name, log stream name, account ID and
 * Region.
 *
 * A transformer for a log group is a series of processors, where each processor applies one
 * type of transformation to the log events ingested into this log group. The processors work one
 * after another, in the order that you list them, like a pipeline. For more information about
 * the available processors to use in a transformer, see Processors that you can use.
 *
 * Having log events in standardized format enables visibility across your applications for
 * your log analysis, reporting, and alarming needs. CloudWatch Logs provides transformation
 * for common log types with out-of-the-box transformation templates for major Amazon Web Services
 * log sources such as VPC flow logs, Lambda, and Amazon RDS. You can use
 * pre-built transformation templates or create custom transformation policies.
 *
 * You can create transformers only for the log groups in the Standard log class.
 *
 * You can also set up a transformer at the account level. For more information, see PutAccountPolicy. If there is both a log-group level transformer created with
 * `PutTransformer` and an account-level transformer that could apply to the same
 * log group, the log group uses only the log-group level transformer. It ignores the
 * account-level transformer.
 */
export const putTransformer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTransformerRequest,
  output: PutTransformerResponse,
  errors: [
    InvalidOperationException,
    InvalidParameterException,
    LimitExceededException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Tests the filter pattern of a metric filter against a sample of log event messages. You
 * can use this operation to validate the correctness of a metric filter pattern.
 */
export const testMetricFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestMetricFilterRequest,
  output: TestMetricFilterResponse,
  errors: [InvalidParameterException, ServiceUnavailableException],
}));
/**
 * Returns an aggregate summary of all log groups in the Region grouped by specified data
 * source characteristics. Supports optional filtering by log group class, name patterns, and
 * data sources. If you perform this action in a monitoring account, you can also return
 * aggregated summaries of log groups from source accounts that are linked to the monitoring
 * account. For more information about using cross-account observability to set up monitoring
 * accounts and source accounts, see CloudWatch
 * cross-account observability.
 *
 * The operation aggregates log groups by data source name and type and optionally format,
 * providing counts of log groups that share these characteristics. The operation paginates
 * results. By default, it returns up to 50 results and includes a token to retrieve more
 * results.
 */
export const listAggregateLogGroupSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAggregateLogGroupSummariesRequest,
    output: ListAggregateLogGroupSummariesResponse,
    errors: [
      InvalidParameterException,
      ServiceUnavailableException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of anomalies that log anomaly detectors have found. For details about the
 * structure format of each anomaly object that is returned, see the example in this
 * section.
 */
export const listAnomalies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAnomaliesRequest,
  output: ListAnomaliesResponse,
  errors: [
    InvalidParameterException,
    OperationAbortedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Starts a Live Tail streaming session for one or more log groups. A Live Tail session
 * returns a stream of log events that have been recently ingested in the log groups. For more
 * information, see Use Live Tail to view logs
 * in near real time.
 *
 * The response to this operation is a response stream, over which the server sends live log
 * events and the client receives them.
 *
 * The following objects are sent over the stream:
 *
 * - A single LiveTailSessionStart object is sent at the start of the session.
 *
 * - Every second, a LiveTailSessionUpdate object is sent. Each of these objects contains an array
 * of the actual log events.
 *
 * If no new log events were ingested in the past second, the
 * `LiveTailSessionUpdate` object will contain an empty array.
 *
 * The array of log events contained in a `LiveTailSessionUpdate` can include
 * as many as 500 log events. If the number of log events matching the request exceeds 500
 * per second, the log events are sampled down to 500 log events to be included in each
 * `LiveTailSessionUpdate` object.
 *
 * If your client consumes the log events slower than the server produces them, CloudWatch Logs buffers up to 10 `LiveTailSessionUpdate` events or 5000 log
 * events, after which it starts dropping the oldest events.
 *
 * - A SessionStreamingException object is returned if an unknown error occurs on the
 * server side.
 *
 * - A SessionTimeoutException object is returned when the session times out, after it
 * has been kept open for three hours.
 *
 * The `StartLiveTail` API routes requests to
 * `streaming-logs.*Region*.amazonaws.com` using SDK host
 * prefix injection. VPC endpoint support is not available for this API.
 *
 * You can end a session before it times out by closing the session stream or by closing
 * the client that is receiving the stream. The session also ends if the established connection
 * between the client and the server breaks.
 *
 * For examples of using an SDK to start a Live Tail session, see Start
 * a Live Tail session using an Amazon Web Services SDK.
 */
export const startLiveTail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLiveTailRequest,
  output: StartLiveTailResponse,
  errors: [
    AccessDeniedException,
    InvalidOperationException,
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts a query of one or more log groups or data sources using CloudWatch Logs
 * Insights. You specify the log groups or data sources and time range to query and the query
 * string to use. You can query up to 10 data sources in a single query.
 *
 * For more information, see CloudWatch Logs Insights Query
 * Syntax.
 *
 * After you run a query using `StartQuery`, the query results are stored by
 * CloudWatch Logs. You can use GetQueryResults to retrieve the results of a query, using the `queryId`
 * that `StartQuery` returns.
 *
 * Interactive queries started with `StartQuery` share concurrency limits with
 * automated scheduled query executions. Both types of queries count toward the same regional
 * concurrent query quota, so high scheduled query activity may affect the availability of
 * concurrent slots for interactive queries.
 *
 * To specify the log groups to query, a `StartQuery` operation must include one
 * of the following:
 *
 * - Either exactly one of the following parameters: `logGroupName`,
 * `logGroupNames`, or `logGroupIdentifiers`
 *
 * - Or the `queryString` must include a `SOURCE` command to select
 * log groups for the query. The `SOURCE` command can select log groups based on
 * log group name prefix, account ID, and log class, or select data sources using
 * dataSource syntax in LogsQL, PPL, and SQL.
 *
 * For more information about the `SOURCE` command, see SOURCE.
 *
 * If you have associated a KMS key with the query results in this
 * account, then StartQuery uses
 * that key to encrypt the results when it stores them. If no key is associated with query
 * results, the query results are encrypted with the default CloudWatch Logs encryption
 * method.
 *
 * Queries time out after 60 minutes of runtime. If your queries are timing out, reduce the
 * time range being searched or partition your query into a number of queries.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation
 * in a monitoring account to start a query in a linked source account. For more information, see
 * CloudWatch cross-account observability. For a cross-account `StartQuery`
 * operation, the query definition must be defined in the monitoring account.
 *
 * You can have up to 30 concurrent CloudWatch Logs insights queries, including queries
 * that have been added to dashboards.
 */
export const startQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartQueryRequest,
  output: StartQueryResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    MalformedQueryException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns information about one integration between CloudWatch Logs and OpenSearch Service.
 */
export const getIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationRequest,
  output: GetIntegrationResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Uploads a batch of log events to the specified log stream.
 *
 * The sequence token is now ignored in `PutLogEvents` actions.
 * `PutLogEvents` actions are always accepted and never return
 * `InvalidSequenceTokenException` or `DataAlreadyAcceptedException`
 * even if the sequence token is not valid. You can use parallel `PutLogEvents`
 * actions on the same log stream.
 *
 * The batch of events must satisfy the following constraints:
 *
 * - The maximum batch size is 1,048,576 bytes. This size is calculated as the sum of
 * all event messages in UTF-8, plus 26 bytes for each log event.
 *
 * - Events more than 2 hours in the future are rejected while processing remaining
 * valid events.
 *
 * - Events older than 14 days or preceding the log group's retention period are
 * rejected while processing remaining valid events.
 *
 * - The log events in the batch must be in chronological order by their timestamp. The
 * timestamp is the time that the event occurred, expressed as the number of milliseconds
 * after `Jan 1, 1970 00:00:00 UTC`. (In Amazon Web Services Tools for PowerShell
 * and the Amazon Web Services SDK for .NET, the timestamp is specified in .NET format:
 * `yyyy-mm-ddThh:mm:ss`. For example, `2017-09-15T13:45:30`.)
 *
 * - A batch of log events in a single request must be in a chronological order.
 * Otherwise, the operation fails.
 *
 * - Each log event can be no larger than 1 MB.
 *
 * - The maximum number of log events in a batch is 10,000.
 *
 * - For valid events (within 14 days in the past to 2 hours in future), the time span
 * in a single batch cannot exceed 24 hours. Otherwise, the operation fails.
 *
 * The quota of five requests per second per log stream has been removed. Instead,
 * `PutLogEvents` actions are throttled based on a per-second per-account quota.
 * You can request an increase to the per-second throttling quota by using the Service Quotas service.
 *
 * If a call to `PutLogEvents` returns "UnrecognizedClientException" the most
 * likely cause is a non-valid Amazon Web Services access key ID or secret key.
 */
export const putLogEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLogEventsRequest,
  output: PutLogEventsResponse,
  errors: [
    DataAlreadyAcceptedException,
    InvalidParameterException,
    InvalidSequenceTokenException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    UnrecognizedClientException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "IoTSiteWise",
  serviceShapeName: "AWSIoTSiteWise",
});
const auth = T.AwsAuthSigv4({ name: "iotsitewise" });
const ver = T.ServiceVersion("2019-12-02");
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
                        url: "https://iotsitewise-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://iotsitewise-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://iotsitewise.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://iotsitewise.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeDefaultEncryptionConfigurationRequest extends S.Class<DescribeDefaultEncryptionConfigurationRequest>(
  "DescribeDefaultEncryptionConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/configuration/account/encryption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeLoggingOptionsRequest extends S.Class<DescribeLoggingOptionsRequest>(
  "DescribeLoggingOptionsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/logging" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeStorageConfigurationRequest extends S.Class<DescribeStorageConfigurationRequest>(
  "DescribeStorageConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/configuration/account/storage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IDs = S.Array(S.String);
export const AggregateTypes = S.Array(S.String);
export const Qualities = S.Array(S.String);
export const ListAssetModelsTypeFilter = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateAssetsRequest extends S.Class<AssociateAssetsRequest>(
  "AssociateAssetsRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    hierarchyId: S.String,
    childAssetId: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assets/{assetId}/associate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateAssetsResponse extends S.Class<AssociateAssetsResponse>(
  "AssociateAssetsResponse",
)({}) {}
export class AssociateTimeSeriesToAssetPropertyRequest extends S.Class<AssociateTimeSeriesToAssetPropertyRequest>(
  "AssociateTimeSeriesToAssetPropertyRequest",
)(
  {
    alias: S.String.pipe(T.HttpQuery("alias")),
    assetId: S.String.pipe(T.HttpQuery("assetId")),
    propertyId: S.String.pipe(T.HttpQuery("propertyId")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/timeseries/associate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateTimeSeriesToAssetPropertyResponse extends S.Class<AssociateTimeSeriesToAssetPropertyResponse>(
  "AssociateTimeSeriesToAssetPropertyResponse",
)({}) {}
export class BatchAssociateProjectAssetsRequest extends S.Class<BatchAssociateProjectAssetsRequest>(
  "BatchAssociateProjectAssetsRequest",
)(
  {
    projectId: S.String.pipe(T.HttpLabel()),
    assetIds: IDs,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/projects/{projectId}/assets/associate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDisassociateProjectAssetsRequest extends S.Class<BatchDisassociateProjectAssetsRequest>(
  "BatchDisassociateProjectAssetsRequest",
)(
  {
    projectId: S.String.pipe(T.HttpLabel()),
    assetIds: IDs,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/projects/{projectId}/assets/disassociate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateAssetRequest extends S.Class<CreateAssetRequest>(
  "CreateAssetRequest",
)(
  {
    assetName: S.String,
    assetModelId: S.String,
    assetId: S.optional(S.String),
    assetExternalId: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
    assetDescription: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Attribute extends S.Class<Attribute>("Attribute")({
  defaultValue: S.optional(S.String),
}) {}
export class ForwardingConfig extends S.Class<ForwardingConfig>(
  "ForwardingConfig",
)({ state: S.String }) {}
export class MeasurementProcessingConfig extends S.Class<MeasurementProcessingConfig>(
  "MeasurementProcessingConfig",
)({ forwardingConfig: ForwardingConfig }) {}
export class Measurement extends S.Class<Measurement>("Measurement")({
  processingConfig: S.optional(MeasurementProcessingConfig),
}) {}
export class AssetModelPropertyPathSegment extends S.Class<AssetModelPropertyPathSegment>(
  "AssetModelPropertyPathSegment",
)({ id: S.optional(S.String), name: S.optional(S.String) }) {}
export const AssetModelPropertyPath = S.Array(AssetModelPropertyPathSegment);
export class VariableValue extends S.Class<VariableValue>("VariableValue")({
  propertyId: S.optional(S.String),
  hierarchyId: S.optional(S.String),
  propertyPath: S.optional(AssetModelPropertyPath),
}) {}
export class ExpressionVariable extends S.Class<ExpressionVariable>(
  "ExpressionVariable",
)({ name: S.String, value: VariableValue }) {}
export const ExpressionVariables = S.Array(ExpressionVariable);
export class TransformProcessingConfig extends S.Class<TransformProcessingConfig>(
  "TransformProcessingConfig",
)({
  computeLocation: S.String,
  forwardingConfig: S.optional(ForwardingConfig),
}) {}
export class Transform extends S.Class<Transform>("Transform")({
  expression: S.String,
  variables: ExpressionVariables,
  processingConfig: S.optional(TransformProcessingConfig),
}) {}
export class TumblingWindow extends S.Class<TumblingWindow>("TumblingWindow")({
  interval: S.String,
  offset: S.optional(S.String),
}) {}
export class MetricWindow extends S.Class<MetricWindow>("MetricWindow")({
  tumbling: S.optional(TumblingWindow),
}) {}
export class MetricProcessingConfig extends S.Class<MetricProcessingConfig>(
  "MetricProcessingConfig",
)({ computeLocation: S.String }) {}
export class Metric extends S.Class<Metric>("Metric")({
  expression: S.optional(S.String),
  variables: S.optional(ExpressionVariables),
  window: MetricWindow,
  processingConfig: S.optional(MetricProcessingConfig),
}) {}
export class PropertyType extends S.Class<PropertyType>("PropertyType")({
  attribute: S.optional(Attribute),
  measurement: S.optional(Measurement),
  transform: S.optional(Transform),
  metric: S.optional(Metric),
}) {}
export class AssetModelPropertyDefinition extends S.Class<AssetModelPropertyDefinition>(
  "AssetModelPropertyDefinition",
)({
  id: S.optional(S.String),
  externalId: S.optional(S.String),
  name: S.String,
  dataType: S.String,
  dataTypeSpec: S.optional(S.String),
  unit: S.optional(S.String),
  type: PropertyType,
}) {}
export const AssetModelPropertyDefinitions = S.Array(
  AssetModelPropertyDefinition,
);
export class CreateAssetModelCompositeModelRequest extends S.Class<CreateAssetModelCompositeModelRequest>(
  "CreateAssetModelCompositeModelRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    assetModelCompositeModelExternalId: S.optional(S.String),
    parentAssetModelCompositeModelId: S.optional(S.String),
    assetModelCompositeModelId: S.optional(S.String),
    assetModelCompositeModelDescription: S.optional(S.String),
    assetModelCompositeModelName: S.String,
    assetModelCompositeModelType: S.String,
    clientToken: S.optional(S.String),
    composedAssetModelId: S.optional(S.String),
    assetModelCompositeModelProperties: S.optional(
      AssetModelPropertyDefinitions,
    ),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/asset-models/{assetModelId}/composite-models",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDashboardRequest extends S.Class<CreateDashboardRequest>(
  "CreateDashboardRequest",
)(
  {
    projectId: S.String,
    dashboardName: S.String,
    dashboardDescription: S.optional(S.String),
    dashboardDefinition: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/dashboards" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProjectRequest extends S.Class<CreateProjectRequest>(
  "CreateProjectRequest",
)(
  {
    portalId: S.String,
    projectName: S.String,
    projectDescription: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/projects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessPolicyRequest extends S.Class<DeleteAccessPolicyRequest>(
  "DeleteAccessPolicyRequest",
)(
  {
    accessPolicyId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/access-policies/{accessPolicyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessPolicyResponse extends S.Class<DeleteAccessPolicyResponse>(
  "DeleteAccessPolicyResponse",
)({}) {}
export class DeleteAssetRequest extends S.Class<DeleteAssetRequest>(
  "DeleteAssetRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/assets/{assetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetModelRequest extends S.Class<DeleteAssetModelRequest>(
  "DeleteAssetModelRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/asset-models/{assetModelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetModelCompositeModelRequest extends S.Class<DeleteAssetModelCompositeModelRequest>(
  "DeleteAssetModelCompositeModelRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    assetModelCompositeModelId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/asset-models/{assetModelId}/composite-models/{assetModelCompositeModelId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetModelInterfaceRelationshipRequest extends S.Class<DeleteAssetModelInterfaceRelationshipRequest>(
  "DeleteAssetModelInterfaceRelationshipRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    interfaceAssetModelId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/asset-models/{assetModelId}/interface/{interfaceAssetModelId}/asset-model-interface-relationship",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComputationModelRequest extends S.Class<DeleteComputationModelRequest>(
  "DeleteComputationModelRequest",
)(
  {
    computationModelId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/computation-models/{computationModelId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDashboardRequest extends S.Class<DeleteDashboardRequest>(
  "DeleteDashboardRequest",
)(
  {
    dashboardId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/dashboards/{dashboardId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDashboardResponse extends S.Class<DeleteDashboardResponse>(
  "DeleteDashboardResponse",
)({}) {}
export class DeleteDatasetRequest extends S.Class<DeleteDatasetRequest>(
  "DeleteDatasetRequest",
)(
  {
    datasetId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/datasets/{datasetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGatewayRequest extends S.Class<DeleteGatewayRequest>(
  "DeleteGatewayRequest",
)(
  { gatewayId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/20200301/gateways/{gatewayId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGatewayResponse extends S.Class<DeleteGatewayResponse>(
  "DeleteGatewayResponse",
)({}) {}
export class DeletePortalRequest extends S.Class<DeletePortalRequest>(
  "DeletePortalRequest",
)(
  {
    portalId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/portals/{portalId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProjectRequest extends S.Class<DeleteProjectRequest>(
  "DeleteProjectRequest",
)(
  {
    projectId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/projects/{projectId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProjectResponse extends S.Class<DeleteProjectResponse>(
  "DeleteProjectResponse",
)({}) {}
export class DeleteTimeSeriesRequest extends S.Class<DeleteTimeSeriesRequest>(
  "DeleteTimeSeriesRequest",
)(
  {
    alias: S.optional(S.String).pipe(T.HttpQuery("alias")),
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/timeseries/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTimeSeriesResponse extends S.Class<DeleteTimeSeriesResponse>(
  "DeleteTimeSeriesResponse",
)({}) {}
export class DescribeAccessPolicyRequest extends S.Class<DescribeAccessPolicyRequest>(
  "DescribeAccessPolicyRequest",
)(
  { accessPolicyId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/access-policies/{accessPolicyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeActionRequest extends S.Class<DescribeActionRequest>(
  "DescribeActionRequest",
)(
  { actionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/actions/{actionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAssetRequest extends S.Class<DescribeAssetRequest>(
  "DescribeAssetRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    excludeProperties: S.optional(S.Boolean).pipe(
      T.HttpQuery("excludeProperties"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assets/{assetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAssetCompositeModelRequest extends S.Class<DescribeAssetCompositeModelRequest>(
  "DescribeAssetCompositeModelRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    assetCompositeModelId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/assets/{assetId}/composite-models/{assetCompositeModelId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAssetModelRequest extends S.Class<DescribeAssetModelRequest>(
  "DescribeAssetModelRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    excludeProperties: S.optional(S.Boolean).pipe(
      T.HttpQuery("excludeProperties"),
    ),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/asset-models/{assetModelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAssetModelCompositeModelRequest extends S.Class<DescribeAssetModelCompositeModelRequest>(
  "DescribeAssetModelCompositeModelRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    assetModelCompositeModelId: S.String.pipe(T.HttpLabel()),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/asset-models/{assetModelId}/composite-models/{assetModelCompositeModelId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAssetModelInterfaceRelationshipRequest extends S.Class<DescribeAssetModelInterfaceRelationshipRequest>(
  "DescribeAssetModelInterfaceRelationshipRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    interfaceAssetModelId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/asset-models/{assetModelId}/interface/{interfaceAssetModelId}/asset-model-interface-relationship",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAssetPropertyRequest extends S.Class<DescribeAssetPropertyRequest>(
  "DescribeAssetPropertyRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    propertyId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assets/{assetId}/properties/{propertyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBulkImportJobRequest extends S.Class<DescribeBulkImportJobRequest>(
  "DescribeBulkImportJobRequest",
)(
  { jobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeComputationModelRequest extends S.Class<DescribeComputationModelRequest>(
  "DescribeComputationModelRequest",
)(
  {
    computationModelId: S.String.pipe(T.HttpLabel()),
    computationModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("computationModelVersion"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/computation-models/{computationModelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeComputationModelExecutionSummaryRequest extends S.Class<DescribeComputationModelExecutionSummaryRequest>(
  "DescribeComputationModelExecutionSummaryRequest",
)(
  {
    computationModelId: S.String.pipe(T.HttpLabel()),
    resolveToResourceType: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceType"),
    ),
    resolveToResourceId: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/computation-models/{computationModelId}/execution-summary",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDashboardRequest extends S.Class<DescribeDashboardRequest>(
  "DescribeDashboardRequest",
)(
  { dashboardId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/dashboards/{dashboardId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDatasetRequest extends S.Class<DescribeDatasetRequest>(
  "DescribeDatasetRequest",
)(
  { datasetId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/datasets/{datasetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeExecutionRequest extends S.Class<DescribeExecutionRequest>(
  "DescribeExecutionRequest",
)(
  { executionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/executions/{executionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGatewayRequest extends S.Class<DescribeGatewayRequest>(
  "DescribeGatewayRequest",
)(
  { gatewayId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/20200301/gateways/{gatewayId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGatewayCapabilityConfigurationRequest extends S.Class<DescribeGatewayCapabilityConfigurationRequest>(
  "DescribeGatewayCapabilityConfigurationRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel()),
    capabilityNamespace: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/20200301/gateways/{gatewayId}/capability/{capabilityNamespace}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePortalRequest extends S.Class<DescribePortalRequest>(
  "DescribePortalRequest",
)(
  { portalId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/portals/{portalId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeProjectRequest extends S.Class<DescribeProjectRequest>(
  "DescribeProjectRequest",
)(
  { projectId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/projects/{projectId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTimeSeriesRequest extends S.Class<DescribeTimeSeriesRequest>(
  "DescribeTimeSeriesRequest",
)(
  {
    alias: S.optional(S.String).pipe(T.HttpQuery("alias")),
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/timeseries/describe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAssetsRequest extends S.Class<DisassociateAssetsRequest>(
  "DisassociateAssetsRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    hierarchyId: S.String,
    childAssetId: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assets/{assetId}/disassociate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAssetsResponse extends S.Class<DisassociateAssetsResponse>(
  "DisassociateAssetsResponse",
)({}) {}
export class DisassociateTimeSeriesFromAssetPropertyRequest extends S.Class<DisassociateTimeSeriesFromAssetPropertyRequest>(
  "DisassociateTimeSeriesFromAssetPropertyRequest",
)(
  {
    alias: S.String.pipe(T.HttpQuery("alias")),
    assetId: S.String.pipe(T.HttpQuery("assetId")),
    propertyId: S.String.pipe(T.HttpQuery("propertyId")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/timeseries/disassociate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateTimeSeriesFromAssetPropertyResponse extends S.Class<DisassociateTimeSeriesFromAssetPropertyResponse>(
  "DisassociateTimeSeriesFromAssetPropertyResponse",
)({}) {}
export class ExecuteQueryRequest extends S.Class<ExecuteQueryRequest>(
  "ExecuteQueryRequest",
)(
  {
    queryStatement: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/queries/execution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssetPropertyAggregatesRequest extends S.Class<GetAssetPropertyAggregatesRequest>(
  "GetAssetPropertyAggregatesRequest",
)(
  {
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    propertyAlias: S.optional(S.String).pipe(T.HttpQuery("propertyAlias")),
    aggregateTypes: AggregateTypes.pipe(T.HttpQuery("aggregateTypes")),
    resolution: S.String.pipe(T.HttpQuery("resolution")),
    qualities: S.optional(Qualities).pipe(T.HttpQuery("qualities")),
    startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startDate"),
    ),
    endDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endDate"),
    ),
    timeOrdering: S.optional(S.String).pipe(T.HttpQuery("timeOrdering")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/properties/aggregates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssetPropertyValueRequest extends S.Class<GetAssetPropertyValueRequest>(
  "GetAssetPropertyValueRequest",
)(
  {
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    propertyAlias: S.optional(S.String).pipe(T.HttpQuery("propertyAlias")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/properties/latest" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssetPropertyValueHistoryRequest extends S.Class<GetAssetPropertyValueHistoryRequest>(
  "GetAssetPropertyValueHistoryRequest",
)(
  {
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    propertyAlias: S.optional(S.String).pipe(T.HttpQuery("propertyAlias")),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startDate"),
    ),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endDate"),
    ),
    qualities: S.optional(Qualities).pipe(T.HttpQuery("qualities")),
    timeOrdering: S.optional(S.String).pipe(T.HttpQuery("timeOrdering")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/properties/history" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInterpolatedAssetPropertyValuesRequest extends S.Class<GetInterpolatedAssetPropertyValuesRequest>(
  "GetInterpolatedAssetPropertyValuesRequest",
)(
  {
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    propertyAlias: S.optional(S.String).pipe(T.HttpQuery("propertyAlias")),
    startTimeInSeconds: S.Number.pipe(T.HttpQuery("startTimeInSeconds")),
    startTimeOffsetInNanos: S.optional(S.Number).pipe(
      T.HttpQuery("startTimeOffsetInNanos"),
    ),
    endTimeInSeconds: S.Number.pipe(T.HttpQuery("endTimeInSeconds")),
    endTimeOffsetInNanos: S.optional(S.Number).pipe(
      T.HttpQuery("endTimeOffsetInNanos"),
    ),
    quality: S.String.pipe(T.HttpQuery("quality")),
    intervalInSeconds: S.Number.pipe(T.HttpQuery("intervalInSeconds")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    type: S.String.pipe(T.HttpQuery("type")),
    intervalWindowInSeconds: S.optional(S.Number).pipe(
      T.HttpQuery("intervalWindowInSeconds"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/properties/interpolated" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeAssistantRequest extends S.Class<InvokeAssistantRequest>(
  "InvokeAssistantRequest",
)(
  {
    conversationId: S.optional(S.String),
    message: S.String,
    enableTrace: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistant/invocation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccessPoliciesRequest extends S.Class<ListAccessPoliciesRequest>(
  "ListAccessPoliciesRequest",
)(
  {
    identityType: S.optional(S.String).pipe(T.HttpQuery("identityType")),
    identityId: S.optional(S.String).pipe(T.HttpQuery("identityId")),
    resourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    resourceId: S.optional(S.String).pipe(T.HttpQuery("resourceId")),
    iamArn: S.optional(S.String).pipe(T.HttpQuery("iamArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/access-policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListActionsRequest extends S.Class<ListActionsRequest>(
  "ListActionsRequest",
)(
  {
    targetResourceType: S.String.pipe(T.HttpQuery("targetResourceType")),
    targetResourceId: S.String.pipe(T.HttpQuery("targetResourceId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    resolveToResourceType: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceType"),
    ),
    resolveToResourceId: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/actions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetModelCompositeModelsRequest extends S.Class<ListAssetModelCompositeModelsRequest>(
  "ListAssetModelCompositeModelsRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/asset-models/{assetModelId}/composite-models",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetModelPropertiesRequest extends S.Class<ListAssetModelPropertiesRequest>(
  "ListAssetModelPropertiesRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/asset-models/{assetModelId}/properties" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetModelsRequest extends S.Class<ListAssetModelsRequest>(
  "ListAssetModelsRequest",
)(
  {
    assetModelTypes: S.optional(ListAssetModelsTypeFilter).pipe(
      T.HttpQuery("assetModelTypes"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/asset-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetPropertiesRequest extends S.Class<ListAssetPropertiesRequest>(
  "ListAssetPropertiesRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assets/{assetId}/properties" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetRelationshipsRequest extends S.Class<ListAssetRelationshipsRequest>(
  "ListAssetRelationshipsRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    traversalType: S.String.pipe(T.HttpQuery("traversalType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assets/{assetId}/assetRelationships" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetsRequest extends S.Class<ListAssetsRequest>(
  "ListAssetsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assetModelId: S.optional(S.String).pipe(T.HttpQuery("assetModelId")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssociatedAssetsRequest extends S.Class<ListAssociatedAssetsRequest>(
  "ListAssociatedAssetsRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    hierarchyId: S.optional(S.String).pipe(T.HttpQuery("hierarchyId")),
    traversalDirection: S.optional(S.String).pipe(
      T.HttpQuery("traversalDirection"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assets/{assetId}/hierarchies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBulkImportJobsRequest extends S.Class<ListBulkImportJobsRequest>(
  "ListBulkImportJobsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
  },
  T.all(T.Http({ method: "GET", uri: "/jobs" }), svc, auth, proto, ver, rules),
) {}
export class ListCompositionRelationshipsRequest extends S.Class<ListCompositionRelationshipsRequest>(
  "ListCompositionRelationshipsRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/asset-models/{assetModelId}/composition-relationships",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListComputationModelResolveToResourcesRequest extends S.Class<ListComputationModelResolveToResourcesRequest>(
  "ListComputationModelResolveToResourcesRequest",
)(
  {
    computationModelId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/computation-models/{computationModelId}/resolve-to-resources",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListComputationModelsRequest extends S.Class<ListComputationModelsRequest>(
  "ListComputationModelsRequest",
)(
  {
    computationModelType: S.optional(S.String).pipe(
      T.HttpQuery("computationModelType"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/computation-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDashboardsRequest extends S.Class<ListDashboardsRequest>(
  "ListDashboardsRequest",
)(
  {
    projectId: S.String.pipe(T.HttpQuery("projectId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/dashboards" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDatasetsRequest extends S.Class<ListDatasetsRequest>(
  "ListDatasetsRequest",
)(
  {
    sourceType: S.String.pipe(T.HttpQuery("sourceType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/datasets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExecutionsRequest extends S.Class<ListExecutionsRequest>(
  "ListExecutionsRequest",
)(
  {
    targetResourceType: S.String.pipe(T.HttpQuery("targetResourceType")),
    targetResourceId: S.String.pipe(T.HttpQuery("targetResourceId")),
    resolveToResourceType: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceType"),
    ),
    resolveToResourceId: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceId"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    actionType: S.optional(S.String).pipe(T.HttpQuery("actionType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/executions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGatewaysRequest extends S.Class<ListGatewaysRequest>(
  "ListGatewaysRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/20200301/gateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInterfaceRelationshipsRequest extends S.Class<ListInterfaceRelationshipsRequest>(
  "ListInterfaceRelationshipsRequest",
)(
  {
    interfaceAssetModelId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/interface/{interfaceAssetModelId}/asset-models",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPortalsRequest extends S.Class<ListPortalsRequest>(
  "ListPortalsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/portals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProjectAssetsRequest extends S.Class<ListProjectAssetsRequest>(
  "ListProjectAssetsRequest",
)(
  {
    projectId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/projects/{projectId}/assets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProjectsRequest extends S.Class<ListProjectsRequest>(
  "ListProjectsRequest",
)(
  {
    portalId: S.String.pipe(T.HttpQuery("portalId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/projects" }),
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
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class ListTimeSeriesRequest extends S.Class<ListTimeSeriesRequest>(
  "ListTimeSeriesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    aliasPrefix: S.optional(S.String).pipe(T.HttpQuery("aliasPrefix")),
    timeSeriesType: S.optional(S.String).pipe(T.HttpQuery("timeSeriesType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/timeseries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDefaultEncryptionConfigurationRequest extends S.Class<PutDefaultEncryptionConfigurationRequest>(
  "PutDefaultEncryptionConfigurationRequest",
)(
  { encryptionType: S.String, kmsKeyId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/configuration/account/encryption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LoggingOptions extends S.Class<LoggingOptions>("LoggingOptions")({
  level: S.String,
}) {}
export class PutLoggingOptionsRequest extends S.Class<PutLoggingOptionsRequest>(
  "PutLoggingOptionsRequest",
)(
  { loggingOptions: LoggingOptions },
  T.all(
    T.Http({ method: "PUT", uri: "/logging" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutLoggingOptionsResponse extends S.Class<PutLoggingOptionsResponse>(
  "PutLoggingOptionsResponse",
)({}) {}
export class CustomerManagedS3Storage extends S.Class<CustomerManagedS3Storage>(
  "CustomerManagedS3Storage",
)({ s3ResourceArn: S.String, roleArn: S.String }) {}
export class MultiLayerStorage extends S.Class<MultiLayerStorage>(
  "MultiLayerStorage",
)({ customerManagedS3Storage: CustomerManagedS3Storage }) {}
export class RetentionPeriod extends S.Class<RetentionPeriod>(
  "RetentionPeriod",
)({ numberOfDays: S.optional(S.Number), unlimited: S.optional(S.Boolean) }) {}
export class WarmTierRetentionPeriod extends S.Class<WarmTierRetentionPeriod>(
  "WarmTierRetentionPeriod",
)({ numberOfDays: S.optional(S.Number), unlimited: S.optional(S.Boolean) }) {}
export class PutStorageConfigurationRequest extends S.Class<PutStorageConfigurationRequest>(
  "PutStorageConfigurationRequest",
)(
  {
    storageType: S.String,
    multiLayerStorage: S.optional(MultiLayerStorage),
    disassociatedDataStorage: S.optional(S.String),
    retentionPeriod: S.optional(RetentionPeriod),
    warmTier: S.optional(S.String),
    warmTierRetentionPeriod: S.optional(WarmTierRetentionPeriod),
    disallowIngestNullNaN: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/configuration/account/storage" }),
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
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")), tags: TagMap },
  T.all(T.Http({ method: "POST", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags" }),
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
export class UserIdentity extends S.Class<UserIdentity>("UserIdentity")({
  id: S.String,
}) {}
export class GroupIdentity extends S.Class<GroupIdentity>("GroupIdentity")({
  id: S.String,
}) {}
export class IAMUserIdentity extends S.Class<IAMUserIdentity>(
  "IAMUserIdentity",
)({ arn: S.String }) {}
export class IAMRoleIdentity extends S.Class<IAMRoleIdentity>(
  "IAMRoleIdentity",
)({ arn: S.String }) {}
export class Identity extends S.Class<Identity>("Identity")({
  user: S.optional(UserIdentity),
  group: S.optional(GroupIdentity),
  iamUser: S.optional(IAMUserIdentity),
  iamRole: S.optional(IAMRoleIdentity),
}) {}
export class PortalResource extends S.Class<PortalResource>("PortalResource")({
  id: S.String,
}) {}
export class ProjectResource extends S.Class<ProjectResource>(
  "ProjectResource",
)({ id: S.String }) {}
export class Resource extends S.Class<Resource>("Resource")({
  portal: S.optional(PortalResource),
  project: S.optional(ProjectResource),
}) {}
export class UpdateAccessPolicyRequest extends S.Class<UpdateAccessPolicyRequest>(
  "UpdateAccessPolicyRequest",
)(
  {
    accessPolicyId: S.String.pipe(T.HttpLabel()),
    accessPolicyIdentity: Identity,
    accessPolicyResource: Resource,
    accessPolicyPermission: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/access-policies/{accessPolicyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccessPolicyResponse extends S.Class<UpdateAccessPolicyResponse>(
  "UpdateAccessPolicyResponse",
)({}) {}
export class UpdateAssetRequest extends S.Class<UpdateAssetRequest>(
  "UpdateAssetRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    assetExternalId: S.optional(S.String),
    assetName: S.String,
    clientToken: S.optional(S.String),
    assetDescription: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/assets/{assetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssetModelProperty extends S.Class<AssetModelProperty>(
  "AssetModelProperty",
)({
  id: S.optional(S.String),
  externalId: S.optional(S.String),
  name: S.String,
  dataType: S.String,
  dataTypeSpec: S.optional(S.String),
  unit: S.optional(S.String),
  type: PropertyType,
  path: S.optional(AssetModelPropertyPath),
}) {}
export const AssetModelProperties = S.Array(AssetModelProperty);
export class UpdateAssetModelCompositeModelRequest extends S.Class<UpdateAssetModelCompositeModelRequest>(
  "UpdateAssetModelCompositeModelRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    assetModelCompositeModelId: S.String.pipe(T.HttpLabel()),
    assetModelCompositeModelExternalId: S.optional(S.String),
    assetModelCompositeModelDescription: S.optional(S.String),
    assetModelCompositeModelName: S.String,
    clientToken: S.optional(S.String),
    assetModelCompositeModelProperties: S.optional(AssetModelProperties),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/asset-models/{assetModelId}/composite-models/{assetModelCompositeModelId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssetPropertyRequest extends S.Class<UpdateAssetPropertyRequest>(
  "UpdateAssetPropertyRequest",
)(
  {
    assetId: S.String.pipe(T.HttpLabel()),
    propertyId: S.String.pipe(T.HttpLabel()),
    propertyAlias: S.optional(S.String),
    propertyNotificationState: S.optional(S.String),
    clientToken: S.optional(S.String),
    propertyUnit: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/assets/{assetId}/properties/{propertyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssetPropertyResponse extends S.Class<UpdateAssetPropertyResponse>(
  "UpdateAssetPropertyResponse",
)({}) {}
export class ComputationModelAnomalyDetectionConfiguration extends S.Class<ComputationModelAnomalyDetectionConfiguration>(
  "ComputationModelAnomalyDetectionConfiguration",
)({ inputProperties: S.String, resultProperty: S.String }) {}
export class ComputationModelConfiguration extends S.Class<ComputationModelConfiguration>(
  "ComputationModelConfiguration",
)({
  anomalyDetection: S.optional(ComputationModelAnomalyDetectionConfiguration),
}) {}
export class AssetModelPropertyBindingValue extends S.Class<AssetModelPropertyBindingValue>(
  "AssetModelPropertyBindingValue",
)({ assetModelId: S.String, propertyId: S.String }) {}
export class AssetPropertyBindingValue extends S.Class<AssetPropertyBindingValue>(
  "AssetPropertyBindingValue",
)({ assetId: S.String, propertyId: S.String }) {}
export class ComputationModelDataBindingValue extends S.Class<ComputationModelDataBindingValue>(
  "ComputationModelDataBindingValue",
)({
  assetModelProperty: S.optional(AssetModelPropertyBindingValue),
  assetProperty: S.optional(AssetPropertyBindingValue),
  list: S.optional(S.suspend(() => BindingValueList)),
}) {}
export const ComputationModelDataBinding = S.Record({
  key: S.String,
  value: S.suspend(
    (): S.Schema<ComputationModelDataBindingValue, any> =>
      ComputationModelDataBindingValue,
  ),
});
export class UpdateComputationModelRequest extends S.Class<UpdateComputationModelRequest>(
  "UpdateComputationModelRequest",
)(
  {
    computationModelId: S.String.pipe(T.HttpLabel()),
    computationModelName: S.String,
    computationModelDescription: S.optional(S.String),
    computationModelConfiguration: ComputationModelConfiguration,
    computationModelDataBinding: ComputationModelDataBinding,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/computation-models/{computationModelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDashboardRequest extends S.Class<UpdateDashboardRequest>(
  "UpdateDashboardRequest",
)(
  {
    dashboardId: S.String.pipe(T.HttpLabel()),
    dashboardName: S.String,
    dashboardDescription: S.optional(S.String),
    dashboardDefinition: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/dashboards/{dashboardId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDashboardResponse extends S.Class<UpdateDashboardResponse>(
  "UpdateDashboardResponse",
)({}) {}
export class KendraSourceDetail extends S.Class<KendraSourceDetail>(
  "KendraSourceDetail",
)({ knowledgeBaseArn: S.String, roleArn: S.String }) {}
export class SourceDetail extends S.Class<SourceDetail>("SourceDetail")({
  kendra: S.optional(KendraSourceDetail),
}) {}
export class DatasetSource extends S.Class<DatasetSource>("DatasetSource")({
  sourceType: S.String,
  sourceFormat: S.String,
  sourceDetail: S.optional(SourceDetail),
}) {}
export class UpdateDatasetRequest extends S.Class<UpdateDatasetRequest>(
  "UpdateDatasetRequest",
)(
  {
    datasetId: S.String.pipe(T.HttpLabel()),
    datasetName: S.String,
    datasetDescription: S.optional(S.String),
    datasetSource: DatasetSource,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/datasets/{datasetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGatewayRequest extends S.Class<UpdateGatewayRequest>(
  "UpdateGatewayRequest",
)(
  { gatewayId: S.String.pipe(T.HttpLabel()), gatewayName: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/20200301/gateways/{gatewayId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGatewayResponse extends S.Class<UpdateGatewayResponse>(
  "UpdateGatewayResponse",
)({}) {}
export class UpdateGatewayCapabilityConfigurationRequest extends S.Class<UpdateGatewayCapabilityConfigurationRequest>(
  "UpdateGatewayCapabilityConfigurationRequest",
)(
  {
    gatewayId: S.String.pipe(T.HttpLabel()),
    capabilityNamespace: S.String,
    capabilityConfiguration: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/20200301/gateways/{gatewayId}/capability",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProjectRequest extends S.Class<UpdateProjectRequest>(
  "UpdateProjectRequest",
)(
  {
    projectId: S.String.pipe(T.HttpLabel()),
    projectName: S.String,
    projectDescription: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/projects/{projectId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProjectResponse extends S.Class<UpdateProjectResponse>(
  "UpdateProjectResponse",
)({}) {}
export class AssetErrorDetails extends S.Class<AssetErrorDetails>(
  "AssetErrorDetails",
)({ assetId: S.String, code: S.String, message: S.String }) {}
export const BatchDisassociateProjectAssetsErrors = S.Array(AssetErrorDetails);
export class BatchGetAssetPropertyAggregatesEntry extends S.Class<BatchGetAssetPropertyAggregatesEntry>(
  "BatchGetAssetPropertyAggregatesEntry",
)({
  entryId: S.String,
  assetId: S.optional(S.String),
  propertyId: S.optional(S.String),
  propertyAlias: S.optional(S.String),
  aggregateTypes: AggregateTypes,
  resolution: S.String,
  startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  qualities: S.optional(Qualities),
  timeOrdering: S.optional(S.String),
}) {}
export const BatchGetAssetPropertyAggregatesEntries = S.Array(
  BatchGetAssetPropertyAggregatesEntry,
);
export class BatchGetAssetPropertyValueEntry extends S.Class<BatchGetAssetPropertyValueEntry>(
  "BatchGetAssetPropertyValueEntry",
)({
  entryId: S.String,
  assetId: S.optional(S.String),
  propertyId: S.optional(S.String),
  propertyAlias: S.optional(S.String),
}) {}
export const BatchGetAssetPropertyValueEntries = S.Array(
  BatchGetAssetPropertyValueEntry,
);
export class BatchGetAssetPropertyValueHistoryEntry extends S.Class<BatchGetAssetPropertyValueHistoryEntry>(
  "BatchGetAssetPropertyValueHistoryEntry",
)({
  entryId: S.String,
  assetId: S.optional(S.String),
  propertyId: S.optional(S.String),
  propertyAlias: S.optional(S.String),
  startDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  qualities: S.optional(Qualities),
  timeOrdering: S.optional(S.String),
}) {}
export const BatchGetAssetPropertyValueHistoryEntries = S.Array(
  BatchGetAssetPropertyValueHistoryEntry,
);
export class AssetModelHierarchyDefinition extends S.Class<AssetModelHierarchyDefinition>(
  "AssetModelHierarchyDefinition",
)({
  id: S.optional(S.String),
  externalId: S.optional(S.String),
  name: S.String,
  childAssetModelId: S.String,
}) {}
export const AssetModelHierarchyDefinitions = S.Array(
  AssetModelHierarchyDefinition,
);
export class AssetModelCompositeModelDefinition extends S.Class<AssetModelCompositeModelDefinition>(
  "AssetModelCompositeModelDefinition",
)({
  id: S.optional(S.String),
  externalId: S.optional(S.String),
  name: S.String,
  description: S.optional(S.String),
  type: S.String,
  properties: S.optional(AssetModelPropertyDefinitions),
}) {}
export const AssetModelCompositeModelDefinitions = S.Array(
  AssetModelCompositeModelDefinition,
);
export class File extends S.Class<File>("File")({
  bucket: S.String,
  key: S.String,
  versionId: S.optional(S.String),
}) {}
export const Files = S.Array(File);
export class ErrorReportLocation extends S.Class<ErrorReportLocation>(
  "ErrorReportLocation",
)({ bucket: S.String, prefix: S.String }) {}
export class ImageFile extends S.Class<ImageFile>("ImageFile")({
  data: T.Blob,
  type: S.String,
}) {}
export class Alarms extends S.Class<Alarms>("Alarms")({
  alarmRoleArn: S.String,
  notificationLambdaArn: S.optional(S.String),
}) {}
export class TargetResource extends S.Class<TargetResource>("TargetResource")({
  assetId: S.optional(S.String),
  computationModelId: S.optional(S.String),
}) {}
export class ActionPayload extends S.Class<ActionPayload>("ActionPayload")({
  stringValue: S.String,
}) {}
export class ResolveTo extends S.Class<ResolveTo>("ResolveTo")({
  assetId: S.String,
}) {}
export class PropertyValueNullValue extends S.Class<PropertyValueNullValue>(
  "PropertyValueNullValue",
)({ valueType: S.String }) {}
export class Variant extends S.Class<Variant>("Variant")({
  stringValue: S.optional(S.String),
  integerValue: S.optional(S.Number),
  doubleValue: S.optional(S.Number),
  booleanValue: S.optional(S.Boolean),
  nullValue: S.optional(PropertyValueNullValue),
}) {}
export class TimeInNanos extends S.Class<TimeInNanos>("TimeInNanos")({
  timeInSeconds: S.Number,
  offsetInNanos: S.optional(S.Number),
}) {}
export class AssetPropertyValue extends S.Class<AssetPropertyValue>(
  "AssetPropertyValue",
)({ value: Variant, timestamp: TimeInNanos, quality: S.optional(S.String) }) {}
export const AssetPropertyValueHistory = S.Array(AssetPropertyValue);
export const AssetIDs = S.Array(S.String);
export class AssetModelHierarchy extends S.Class<AssetModelHierarchy>(
  "AssetModelHierarchy",
)({
  id: S.optional(S.String),
  externalId: S.optional(S.String),
  name: S.String,
  childAssetModelId: S.String,
}) {}
export const AssetModelHierarchies = S.Array(AssetModelHierarchy);
export class AssetModelCompositeModel extends S.Class<AssetModelCompositeModel>(
  "AssetModelCompositeModel",
)({
  name: S.String,
  description: S.optional(S.String),
  type: S.String,
  properties: S.optional(AssetModelProperties),
  id: S.optional(S.String),
  externalId: S.optional(S.String),
}) {}
export const AssetModelCompositeModels = S.Array(AssetModelCompositeModel);
export class Image extends S.Class<Image>("Image")({
  id: S.optional(S.String),
  file: S.optional(ImageFile),
}) {}
export class Parquet extends S.Class<Parquet>("Parquet")({}) {}
export type BindingValueList = ComputationModelDataBindingValue[];
export const BindingValueList = S.Array(
  S.suspend(
    (): S.Schema<ComputationModelDataBindingValue, any> =>
      ComputationModelDataBindingValue,
  ),
) as any as S.Schema<BindingValueList>;
export const PortalTools = S.Array(S.String);
export class BatchDisassociateProjectAssetsResponse extends S.Class<BatchDisassociateProjectAssetsResponse>(
  "BatchDisassociateProjectAssetsResponse",
)({ errors: S.optional(BatchDisassociateProjectAssetsErrors) }) {}
export class BatchGetAssetPropertyAggregatesRequest extends S.Class<BatchGetAssetPropertyAggregatesRequest>(
  "BatchGetAssetPropertyAggregatesRequest",
)(
  {
    entries: BatchGetAssetPropertyAggregatesEntries,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/properties/batch/aggregates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetAssetPropertyValueRequest extends S.Class<BatchGetAssetPropertyValueRequest>(
  "BatchGetAssetPropertyValueRequest",
)(
  {
    entries: BatchGetAssetPropertyValueEntries,
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/properties/batch/latest" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetAssetPropertyValueHistoryRequest extends S.Class<BatchGetAssetPropertyValueHistoryRequest>(
  "BatchGetAssetPropertyValueHistoryRequest",
)(
  {
    entries: BatchGetAssetPropertyValueHistoryEntries,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/properties/batch/history" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDashboardResponse extends S.Class<CreateDashboardResponse>(
  "CreateDashboardResponse",
)({ dashboardId: S.String, dashboardArn: S.String }) {}
export class CreateProjectResponse extends S.Class<CreateProjectResponse>(
  "CreateProjectResponse",
)({ projectId: S.String, projectArn: S.String }) {}
export class DetailedError extends S.Class<DetailedError>("DetailedError")({
  code: S.String,
  message: S.String,
}) {}
export const DetailedErrors = S.Array(DetailedError);
export class ErrorDetails extends S.Class<ErrorDetails>("ErrorDetails")({
  code: S.String,
  message: S.String,
  details: S.optional(DetailedErrors),
}) {}
export class AssetStatus extends S.Class<AssetStatus>("AssetStatus")({
  state: S.String,
  error: S.optional(ErrorDetails),
}) {}
export class DeleteAssetResponse extends S.Class<DeleteAssetResponse>(
  "DeleteAssetResponse",
)({ assetStatus: AssetStatus }) {}
export class AssetModelStatus extends S.Class<AssetModelStatus>(
  "AssetModelStatus",
)({ state: S.String, error: S.optional(ErrorDetails) }) {}
export class DeleteAssetModelResponse extends S.Class<DeleteAssetModelResponse>(
  "DeleteAssetModelResponse",
)({ assetModelStatus: AssetModelStatus }) {}
export class DeleteAssetModelCompositeModelResponse extends S.Class<DeleteAssetModelCompositeModelResponse>(
  "DeleteAssetModelCompositeModelResponse",
)({ assetModelStatus: AssetModelStatus }) {}
export class DeleteAssetModelInterfaceRelationshipResponse extends S.Class<DeleteAssetModelInterfaceRelationshipResponse>(
  "DeleteAssetModelInterfaceRelationshipResponse",
)({
  assetModelId: S.String,
  interfaceAssetModelId: S.String,
  assetModelArn: S.String,
  assetModelStatus: AssetModelStatus,
}) {}
export class DescribeAccessPolicyResponse extends S.Class<DescribeAccessPolicyResponse>(
  "DescribeAccessPolicyResponse",
)({
  accessPolicyId: S.String,
  accessPolicyArn: S.String,
  accessPolicyIdentity: Identity,
  accessPolicyResource: Resource,
  accessPolicyPermission: S.String,
  accessPolicyCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  accessPolicyLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DescribeActionResponse extends S.Class<DescribeActionResponse>(
  "DescribeActionResponse",
)({
  actionId: S.String,
  targetResource: TargetResource,
  actionDefinitionId: S.String,
  actionPayload: ActionPayload,
  executionTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  resolveTo: S.optional(ResolveTo),
}) {}
export const ColumnNames = S.Array(S.String);
export class Csv extends S.Class<Csv>("Csv")({ columnNames: ColumnNames }) {}
export class FileFormat extends S.Class<FileFormat>("FileFormat")({
  csv: S.optional(Csv),
  parquet: S.optional(Parquet),
}) {}
export class JobConfiguration extends S.Class<JobConfiguration>(
  "JobConfiguration",
)({ fileFormat: FileFormat }) {}
export class DescribeBulkImportJobResponse extends S.Class<DescribeBulkImportJobResponse>(
  "DescribeBulkImportJobResponse",
)({
  jobId: S.String,
  jobName: S.String,
  jobStatus: S.String,
  jobRoleArn: S.String,
  files: Files,
  errorReportLocation: ErrorReportLocation,
  jobConfiguration: JobConfiguration,
  jobCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  jobLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  adaptiveIngestion: S.optional(S.Boolean),
  deleteFilesAfterImport: S.optional(S.Boolean),
}) {}
export class ComputationModelStatus extends S.Class<ComputationModelStatus>(
  "ComputationModelStatus",
)({ state: S.String, error: S.optional(ErrorDetails) }) {}
export class ActionDefinition extends S.Class<ActionDefinition>(
  "ActionDefinition",
)({
  actionDefinitionId: S.String,
  actionName: S.String,
  actionType: S.String,
}) {}
export const ActionDefinitions = S.Array(ActionDefinition);
export class DescribeComputationModelResponse extends S.Class<DescribeComputationModelResponse>(
  "DescribeComputationModelResponse",
)({
  computationModelId: S.String,
  computationModelArn: S.String,
  computationModelName: S.String,
  computationModelDescription: S.optional(S.String),
  computationModelConfiguration: ComputationModelConfiguration,
  computationModelDataBinding: ComputationModelDataBinding,
  computationModelCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  computationModelLastUpdateDate: S.Date.pipe(
    T.TimestampFormat("epoch-seconds"),
  ),
  computationModelStatus: ComputationModelStatus,
  computationModelVersion: S.String,
  actionDefinitions: ActionDefinitions,
}) {}
export class DescribeDashboardResponse extends S.Class<DescribeDashboardResponse>(
  "DescribeDashboardResponse",
)({
  dashboardId: S.String,
  dashboardArn: S.String,
  dashboardName: S.String,
  projectId: S.String,
  dashboardDescription: S.optional(S.String),
  dashboardDefinition: S.String,
  dashboardCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  dashboardLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DatasetStatus extends S.Class<DatasetStatus>("DatasetStatus")({
  state: S.String,
  error: S.optional(ErrorDetails),
}) {}
export class DescribeDatasetResponse extends S.Class<DescribeDatasetResponse>(
  "DescribeDatasetResponse",
)({
  datasetId: S.String,
  datasetArn: S.String,
  datasetName: S.String,
  datasetDescription: S.String,
  datasetSource: DatasetSource,
  datasetStatus: DatasetStatus,
  datasetCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  datasetLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  datasetVersion: S.optional(S.String),
}) {}
export class DescribeGatewayCapabilityConfigurationResponse extends S.Class<DescribeGatewayCapabilityConfigurationResponse>(
  "DescribeGatewayCapabilityConfigurationResponse",
)({
  gatewayId: S.String,
  capabilityNamespace: S.String,
  capabilityConfiguration: S.String,
  capabilitySyncStatus: S.String,
}) {}
export class DescribeLoggingOptionsResponse extends S.Class<DescribeLoggingOptionsResponse>(
  "DescribeLoggingOptionsResponse",
)({ loggingOptions: LoggingOptions }) {}
export class DescribeProjectResponse extends S.Class<DescribeProjectResponse>(
  "DescribeProjectResponse",
)({
  projectId: S.String,
  projectArn: S.String,
  projectName: S.String,
  portalId: S.String,
  projectDescription: S.optional(S.String),
  projectCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  projectLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DescribeTimeSeriesResponse extends S.Class<DescribeTimeSeriesResponse>(
  "DescribeTimeSeriesResponse",
)({
  assetId: S.optional(S.String),
  propertyId: S.optional(S.String),
  alias: S.optional(S.String),
  timeSeriesId: S.String,
  dataType: S.String,
  dataTypeSpec: S.optional(S.String),
  timeSeriesCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  timeSeriesLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  timeSeriesArn: S.String,
}) {}
export class ExecuteActionRequest extends S.Class<ExecuteActionRequest>(
  "ExecuteActionRequest",
)(
  {
    targetResource: TargetResource,
    actionDefinitionId: S.String,
    actionPayload: ActionPayload,
    clientToken: S.optional(S.String),
    resolveTo: S.optional(ResolveTo),
  },
  T.all(
    T.Http({ method: "POST", uri: "/actions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssetPropertyValueResponse extends S.Class<GetAssetPropertyValueResponse>(
  "GetAssetPropertyValueResponse",
)({ propertyValue: S.optional(AssetPropertyValue) }) {}
export class GetAssetPropertyValueHistoryResponse extends S.Class<GetAssetPropertyValueHistoryResponse>(
  "GetAssetPropertyValueHistoryResponse",
)({
  assetPropertyValueHistory: AssetPropertyValueHistory,
  nextToken: S.optional(S.String),
}) {}
export class AssetModelCompositeModelPathSegment extends S.Class<AssetModelCompositeModelPathSegment>(
  "AssetModelCompositeModelPathSegment",
)({ id: S.optional(S.String), name: S.optional(S.String) }) {}
export const AssetModelCompositeModelPath = S.Array(
  AssetModelCompositeModelPathSegment,
);
export class AssetModelCompositeModelSummary extends S.Class<AssetModelCompositeModelSummary>(
  "AssetModelCompositeModelSummary",
)({
  id: S.String,
  externalId: S.optional(S.String),
  name: S.String,
  type: S.String,
  description: S.optional(S.String),
  path: S.optional(AssetModelCompositeModelPath),
}) {}
export const AssetModelCompositeModelSummaries = S.Array(
  AssetModelCompositeModelSummary,
);
export class ListAssetModelCompositeModelsResponse extends S.Class<ListAssetModelCompositeModelsResponse>(
  "ListAssetModelCompositeModelsResponse",
)({
  assetModelCompositeModelSummaries: AssetModelCompositeModelSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListProjectAssetsResponse extends S.Class<ListProjectAssetsResponse>(
  "ListProjectAssetsResponse",
)({ assetIds: AssetIDs, nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class ConfigurationErrorDetails extends S.Class<ConfigurationErrorDetails>(
  "ConfigurationErrorDetails",
)({ code: S.String, message: S.String }) {}
export class ConfigurationStatus extends S.Class<ConfigurationStatus>(
  "ConfigurationStatus",
)({ state: S.String, error: S.optional(ConfigurationErrorDetails) }) {}
export class PutDefaultEncryptionConfigurationResponse extends S.Class<PutDefaultEncryptionConfigurationResponse>(
  "PutDefaultEncryptionConfigurationResponse",
)({
  encryptionType: S.String,
  kmsKeyArn: S.optional(S.String),
  configurationStatus: ConfigurationStatus,
}) {}
export class PutStorageConfigurationResponse extends S.Class<PutStorageConfigurationResponse>(
  "PutStorageConfigurationResponse",
)({
  storageType: S.String,
  multiLayerStorage: S.optional(MultiLayerStorage),
  disassociatedDataStorage: S.optional(S.String),
  retentionPeriod: S.optional(RetentionPeriod),
  configurationStatus: ConfigurationStatus,
  warmTier: S.optional(S.String),
  warmTierRetentionPeriod: S.optional(WarmTierRetentionPeriod),
  disallowIngestNullNaN: S.optional(S.Boolean),
}) {}
export class UpdateAssetResponse extends S.Class<UpdateAssetResponse>(
  "UpdateAssetResponse",
)({ assetStatus: AssetStatus }) {}
export class UpdateAssetModelCompositeModelResponse extends S.Class<UpdateAssetModelCompositeModelResponse>(
  "UpdateAssetModelCompositeModelResponse",
)({
  assetModelCompositeModelPath: AssetModelCompositeModelPath,
  assetModelStatus: AssetModelStatus,
}) {}
export class UpdateComputationModelResponse extends S.Class<UpdateComputationModelResponse>(
  "UpdateComputationModelResponse",
)({ computationModelStatus: ComputationModelStatus }) {}
export class UpdateDatasetResponse extends S.Class<UpdateDatasetResponse>(
  "UpdateDatasetResponse",
)({
  datasetId: S.optional(S.String),
  datasetArn: S.optional(S.String),
  datasetStatus: S.optional(DatasetStatus),
}) {}
export class UpdateGatewayCapabilityConfigurationResponse extends S.Class<UpdateGatewayCapabilityConfigurationResponse>(
  "UpdateGatewayCapabilityConfigurationResponse",
)({ capabilityNamespace: S.String, capabilitySyncStatus: S.String }) {}
export class PortalTypeEntry extends S.Class<PortalTypeEntry>(
  "PortalTypeEntry",
)({ portalTools: S.optional(PortalTools) }) {}
export const PortalTypeConfiguration = S.Record({
  key: S.String,
  value: PortalTypeEntry,
});
export class UpdatePortalRequest extends S.Class<UpdatePortalRequest>(
  "UpdatePortalRequest",
)(
  {
    portalId: S.String.pipe(T.HttpLabel()),
    portalName: S.String,
    portalDescription: S.optional(S.String),
    portalContactEmail: S.String,
    portalLogoImage: S.optional(Image),
    roleArn: S.String,
    clientToken: S.optional(S.String),
    notificationSenderEmail: S.optional(S.String),
    alarms: S.optional(Alarms),
    portalType: S.optional(S.String),
    portalTypeConfiguration: S.optional(PortalTypeConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/portals/{portalId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Greengrass extends S.Class<Greengrass>("Greengrass")({
  groupArn: S.String,
}) {}
export class GreengrassV2 extends S.Class<GreengrassV2>("GreengrassV2")({
  coreDeviceThingName: S.String,
  coreDeviceOperatingSystem: S.optional(S.String),
}) {}
export class SiemensIE extends S.Class<SiemensIE>("SiemensIE")({
  iotCoreThingName: S.String,
}) {}
export class AssetBindingValueFilter extends S.Class<AssetBindingValueFilter>(
  "AssetBindingValueFilter",
)({ assetId: S.String }) {}
export class AssetModelBindingValueFilter extends S.Class<AssetModelBindingValueFilter>(
  "AssetModelBindingValueFilter",
)({ assetModelId: S.String }) {}
export class AssetPropertyBindingValueFilter extends S.Class<AssetPropertyBindingValueFilter>(
  "AssetPropertyBindingValueFilter",
)({ assetId: S.String, propertyId: S.String }) {}
export class AssetModelPropertyBindingValueFilter extends S.Class<AssetModelPropertyBindingValueFilter>(
  "AssetModelPropertyBindingValueFilter",
)({ assetModelId: S.String, propertyId: S.String }) {}
export class PropertyMapping extends S.Class<PropertyMapping>(
  "PropertyMapping",
)({
  assetModelPropertyId: S.String,
  interfaceAssetModelPropertyId: S.String,
}) {}
export const PropertyMappings = S.Array(PropertyMapping);
export const BatchAssociateProjectAssetsErrors = S.Array(AssetErrorDetails);
export class GatewayPlatform extends S.Class<GatewayPlatform>(
  "GatewayPlatform",
)({
  greengrass: S.optional(Greengrass),
  greengrassV2: S.optional(GreengrassV2),
  siemensIE: S.optional(SiemensIE),
}) {}
export class AssetHierarchy extends S.Class<AssetHierarchy>("AssetHierarchy")({
  id: S.optional(S.String),
  externalId: S.optional(S.String),
  name: S.String,
}) {}
export const AssetHierarchies = S.Array(AssetHierarchy);
export class PropertyNotification extends S.Class<PropertyNotification>(
  "PropertyNotification",
)({ topic: S.String, state: S.String }) {}
export class AssetPropertyPathSegment extends S.Class<AssetPropertyPathSegment>(
  "AssetPropertyPathSegment",
)({ id: S.optional(S.String), name: S.optional(S.String) }) {}
export const AssetPropertyPath = S.Array(AssetPropertyPathSegment);
export class AssetProperty extends S.Class<AssetProperty>("AssetProperty")({
  id: S.String,
  externalId: S.optional(S.String),
  name: S.String,
  alias: S.optional(S.String),
  notification: S.optional(PropertyNotification),
  dataType: S.String,
  dataTypeSpec: S.optional(S.String),
  unit: S.optional(S.String),
  path: S.optional(AssetPropertyPath),
}) {}
export const AssetProperties = S.Array(AssetProperty);
export class AssetCompositeModel extends S.Class<AssetCompositeModel>(
  "AssetCompositeModel",
)({
  name: S.String,
  description: S.optional(S.String),
  type: S.String,
  properties: AssetProperties,
  id: S.optional(S.String),
  externalId: S.optional(S.String),
}) {}
export const AssetCompositeModels = S.Array(AssetCompositeModel);
export class AssetCompositeModelPathSegment extends S.Class<AssetCompositeModelPathSegment>(
  "AssetCompositeModelPathSegment",
)({ id: S.optional(S.String), name: S.optional(S.String) }) {}
export const AssetCompositeModelPath = S.Array(AssetCompositeModelPathSegment);
export class AssetCompositeModelSummary extends S.Class<AssetCompositeModelSummary>(
  "AssetCompositeModelSummary",
)({
  id: S.String,
  externalId: S.optional(S.String),
  name: S.String,
  type: S.String,
  description: S.String,
  path: AssetCompositeModelPath,
}) {}
export const AssetCompositeModelSummaries = S.Array(AssetCompositeModelSummary);
export class InterfaceRelationship extends S.Class<InterfaceRelationship>(
  "InterfaceRelationship",
)({ id: S.String }) {}
export const InterfaceDetails = S.Array(InterfaceRelationship);
export class HierarchyMapping extends S.Class<HierarchyMapping>(
  "HierarchyMapping",
)({
  assetModelHierarchyId: S.String,
  interfaceAssetModelHierarchyId: S.String,
}) {}
export const HierarchyMappings = S.Array(HierarchyMapping);
export class Property extends S.Class<Property>("Property")({
  id: S.String,
  externalId: S.optional(S.String),
  name: S.String,
  alias: S.optional(S.String),
  notification: S.optional(PropertyNotification),
  dataType: S.String,
  unit: S.optional(S.String),
  type: S.optional(PropertyType),
  path: S.optional(AssetPropertyPath),
}) {}
export class CompositeModelProperty extends S.Class<CompositeModelProperty>(
  "CompositeModelProperty",
)({
  name: S.String,
  type: S.String,
  assetProperty: Property,
  id: S.optional(S.String),
  externalId: S.optional(S.String),
}) {}
export const ComputationModelExecutionSummary = S.Record({
  key: S.String,
  value: S.String,
});
export class ExecutionStatus extends S.Class<ExecutionStatus>(
  "ExecutionStatus",
)({ state: S.String }) {}
export const ExecutionResult = S.Record({ key: S.String, value: S.String });
export const ExecutionDetails = S.Record({ key: S.String, value: S.String });
export class GatewayCapabilitySummary extends S.Class<GatewayCapabilitySummary>(
  "GatewayCapabilitySummary",
)({ capabilityNamespace: S.String, capabilitySyncStatus: S.String }) {}
export const GatewayCapabilitySummaries = S.Array(GatewayCapabilitySummary);
export class ImageLocation extends S.Class<ImageLocation>("ImageLocation")({
  id: S.String,
  url: S.String,
}) {}
export class InterpolatedAssetPropertyValue extends S.Class<InterpolatedAssetPropertyValue>(
  "InterpolatedAssetPropertyValue",
)({ timestamp: TimeInNanos, value: Variant }) {}
export const InterpolatedAssetPropertyValues = S.Array(
  InterpolatedAssetPropertyValue,
);
export class AccessPolicySummary extends S.Class<AccessPolicySummary>(
  "AccessPolicySummary",
)({
  id: S.String,
  identity: Identity,
  resource: Resource,
  permission: S.String,
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AccessPolicySummaries = S.Array(AccessPolicySummary);
export class ActionSummary extends S.Class<ActionSummary>("ActionSummary")({
  actionId: S.optional(S.String),
  actionDefinitionId: S.optional(S.String),
  targetResource: S.optional(TargetResource),
  resolveTo: S.optional(ResolveTo),
}) {}
export const ActionSummaries = S.Array(ActionSummary);
export class AssetModelSummary extends S.Class<AssetModelSummary>(
  "AssetModelSummary",
)({
  id: S.String,
  externalId: S.optional(S.String),
  arn: S.String,
  name: S.String,
  assetModelType: S.optional(S.String),
  description: S.String,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: AssetModelStatus,
  version: S.optional(S.String),
}) {}
export const AssetModelSummaries = S.Array(AssetModelSummary);
export class AssetPropertySummary extends S.Class<AssetPropertySummary>(
  "AssetPropertySummary",
)({
  id: S.String,
  externalId: S.optional(S.String),
  alias: S.optional(S.String),
  unit: S.optional(S.String),
  notification: S.optional(PropertyNotification),
  assetCompositeModelId: S.optional(S.String),
  path: S.optional(AssetPropertyPath),
}) {}
export const AssetPropertySummaries = S.Array(AssetPropertySummary);
export class AssetSummary extends S.Class<AssetSummary>("AssetSummary")({
  id: S.String,
  externalId: S.optional(S.String),
  arn: S.String,
  name: S.String,
  assetModelId: S.String,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: AssetStatus,
  hierarchies: AssetHierarchies,
  description: S.optional(S.String),
}) {}
export const AssetSummaries = S.Array(AssetSummary);
export class AssociatedAssetsSummary extends S.Class<AssociatedAssetsSummary>(
  "AssociatedAssetsSummary",
)({
  id: S.String,
  externalId: S.optional(S.String),
  arn: S.String,
  name: S.String,
  assetModelId: S.String,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: AssetStatus,
  hierarchies: AssetHierarchies,
  description: S.optional(S.String),
}) {}
export const AssociatedAssetsSummaries = S.Array(AssociatedAssetsSummary);
export class JobSummary extends S.Class<JobSummary>("JobSummary")({
  id: S.String,
  name: S.String,
  status: S.String,
}) {}
export const JobSummaries = S.Array(JobSummary);
export class CompositionRelationshipSummary extends S.Class<CompositionRelationshipSummary>(
  "CompositionRelationshipSummary",
)({
  assetModelId: S.String,
  assetModelCompositeModelId: S.String,
  assetModelCompositeModelType: S.String,
}) {}
export const CompositionRelationshipSummaries = S.Array(
  CompositionRelationshipSummary,
);
export class DataBindingValueFilter extends S.Class<DataBindingValueFilter>(
  "DataBindingValueFilter",
)({
  asset: S.optional(AssetBindingValueFilter),
  assetModel: S.optional(AssetModelBindingValueFilter),
  assetProperty: S.optional(AssetPropertyBindingValueFilter),
  assetModelProperty: S.optional(AssetModelPropertyBindingValueFilter),
}) {}
export class ComputationModelResolveToResourceSummary extends S.Class<ComputationModelResolveToResourceSummary>(
  "ComputationModelResolveToResourceSummary",
)({ resolveTo: S.optional(ResolveTo) }) {}
export const ComputationModelResolveToResourceSummaries = S.Array(
  ComputationModelResolveToResourceSummary,
);
export class ComputationModelSummary extends S.Class<ComputationModelSummary>(
  "ComputationModelSummary",
)({
  id: S.String,
  arn: S.String,
  name: S.String,
  description: S.optional(S.String),
  type: S.String,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: ComputationModelStatus,
  version: S.String,
}) {}
export const ComputationModelSummaries = S.Array(ComputationModelSummary);
export class DashboardSummary extends S.Class<DashboardSummary>(
  "DashboardSummary",
)({
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DashboardSummaries = S.Array(DashboardSummary);
export class DatasetSummary extends S.Class<DatasetSummary>("DatasetSummary")({
  id: S.String,
  arn: S.String,
  name: S.String,
  description: S.String,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: DatasetStatus,
}) {}
export const DatasetSummaries = S.Array(DatasetSummary);
export class ExecutionSummary extends S.Class<ExecutionSummary>(
  "ExecutionSummary",
)({
  executionId: S.String,
  actionType: S.optional(S.String),
  targetResource: TargetResource,
  targetResourceVersion: S.String,
  resolveTo: S.optional(ResolveTo),
  executionStartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  executionEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  executionStatus: ExecutionStatus,
  executionEntityVersion: S.optional(S.String),
}) {}
export const ExecutionSummaries = S.Array(ExecutionSummary);
export class GatewaySummary extends S.Class<GatewaySummary>("GatewaySummary")({
  gatewayId: S.String,
  gatewayName: S.String,
  gatewayPlatform: S.optional(GatewayPlatform),
  gatewayVersion: S.optional(S.String),
  gatewayCapabilitySummaries: S.optional(GatewayCapabilitySummaries),
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const GatewaySummaries = S.Array(GatewaySummary);
export class InterfaceRelationshipSummary extends S.Class<InterfaceRelationshipSummary>(
  "InterfaceRelationshipSummary",
)({ id: S.String }) {}
export const InterfaceRelationshipSummaries = S.Array(
  InterfaceRelationshipSummary,
);
export class MonitorErrorDetails extends S.Class<MonitorErrorDetails>(
  "MonitorErrorDetails",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class PortalStatus extends S.Class<PortalStatus>("PortalStatus")({
  state: S.String,
  error: S.optional(MonitorErrorDetails),
}) {}
export class PortalSummary extends S.Class<PortalSummary>("PortalSummary")({
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  startUrl: S.String,
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  roleArn: S.optional(S.String),
  status: PortalStatus,
  portalType: S.optional(S.String),
}) {}
export const PortalSummaries = S.Array(PortalSummary);
export class ProjectSummary extends S.Class<ProjectSummary>("ProjectSummary")({
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ProjectSummaries = S.Array(ProjectSummary);
export class TimeSeriesSummary extends S.Class<TimeSeriesSummary>(
  "TimeSeriesSummary",
)({
  assetId: S.optional(S.String),
  propertyId: S.optional(S.String),
  alias: S.optional(S.String),
  timeSeriesId: S.String,
  dataType: S.String,
  dataTypeSpec: S.optional(S.String),
  timeSeriesCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  timeSeriesLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  timeSeriesArn: S.String,
}) {}
export const TimeSeriesSummaries = S.Array(TimeSeriesSummary);
export class PropertyMappingConfiguration extends S.Class<PropertyMappingConfiguration>(
  "PropertyMappingConfiguration",
)({
  matchByPropertyName: S.optional(S.Boolean),
  createMissingProperty: S.optional(S.Boolean),
  overrides: S.optional(PropertyMappings),
}) {}
export class BatchAssociateProjectAssetsResponse extends S.Class<BatchAssociateProjectAssetsResponse>(
  "BatchAssociateProjectAssetsResponse",
)({ errors: S.optional(BatchAssociateProjectAssetsErrors) }) {}
export class CreateAccessPolicyRequest extends S.Class<CreateAccessPolicyRequest>(
  "CreateAccessPolicyRequest",
)(
  {
    accessPolicyIdentity: Identity,
    accessPolicyResource: Resource,
    accessPolicyPermission: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/access-policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAssetModelCompositeModelResponse extends S.Class<CreateAssetModelCompositeModelResponse>(
  "CreateAssetModelCompositeModelResponse",
)({
  assetModelCompositeModelId: S.String,
  assetModelCompositeModelPath: AssetModelCompositeModelPath,
  assetModelStatus: AssetModelStatus,
}) {}
export class CreateGatewayRequest extends S.Class<CreateGatewayRequest>(
  "CreateGatewayRequest",
)(
  {
    gatewayName: S.String,
    gatewayPlatform: GatewayPlatform,
    gatewayVersion: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/20200301/gateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePortalRequest extends S.Class<CreatePortalRequest>(
  "CreatePortalRequest",
)(
  {
    portalName: S.String,
    portalDescription: S.optional(S.String),
    portalContactEmail: S.String,
    clientToken: S.optional(S.String),
    portalLogoImageFile: S.optional(ImageFile),
    roleArn: S.String,
    tags: S.optional(TagMap),
    portalAuthMode: S.optional(S.String),
    notificationSenderEmail: S.optional(S.String),
    alarms: S.optional(Alarms),
    portalType: S.optional(S.String),
    portalTypeConfiguration: S.optional(PortalTypeConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/portals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComputationModelResponse extends S.Class<DeleteComputationModelResponse>(
  "DeleteComputationModelResponse",
)({ computationModelStatus: ComputationModelStatus }) {}
export class DeleteDatasetResponse extends S.Class<DeleteDatasetResponse>(
  "DeleteDatasetResponse",
)({ datasetStatus: DatasetStatus }) {}
export class DescribeAssetCompositeModelResponse extends S.Class<DescribeAssetCompositeModelResponse>(
  "DescribeAssetCompositeModelResponse",
)({
  assetId: S.String,
  assetCompositeModelId: S.String,
  assetCompositeModelExternalId: S.optional(S.String),
  assetCompositeModelPath: AssetCompositeModelPath,
  assetCompositeModelName: S.String,
  assetCompositeModelDescription: S.String,
  assetCompositeModelType: S.String,
  assetCompositeModelProperties: AssetProperties,
  assetCompositeModelSummaries: AssetCompositeModelSummaries,
  actionDefinitions: S.optional(ActionDefinitions),
}) {}
export class DescribeAssetModelResponse extends S.Class<DescribeAssetModelResponse>(
  "DescribeAssetModelResponse",
)({
  assetModelId: S.String,
  assetModelExternalId: S.optional(S.String),
  assetModelArn: S.String,
  assetModelName: S.String,
  assetModelType: S.optional(S.String),
  assetModelDescription: S.String,
  assetModelProperties: AssetModelProperties,
  assetModelHierarchies: AssetModelHierarchies,
  assetModelCompositeModels: S.optional(AssetModelCompositeModels),
  assetModelCompositeModelSummaries: S.optional(
    AssetModelCompositeModelSummaries,
  ),
  assetModelCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  assetModelLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  assetModelStatus: AssetModelStatus,
  assetModelVersion: S.optional(S.String),
  interfaceDetails: S.optional(InterfaceDetails),
  eTag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
}) {}
export class DescribeAssetModelInterfaceRelationshipResponse extends S.Class<DescribeAssetModelInterfaceRelationshipResponse>(
  "DescribeAssetModelInterfaceRelationshipResponse",
)({
  assetModelId: S.String,
  interfaceAssetModelId: S.String,
  propertyMappings: PropertyMappings,
  hierarchyMappings: HierarchyMappings,
}) {}
export class DescribeAssetPropertyResponse extends S.Class<DescribeAssetPropertyResponse>(
  "DescribeAssetPropertyResponse",
)({
  assetId: S.String,
  assetExternalId: S.optional(S.String),
  assetName: S.String,
  assetModelId: S.String,
  assetProperty: S.optional(Property),
  compositeModel: S.optional(CompositeModelProperty),
}) {}
export class DescribeComputationModelExecutionSummaryResponse extends S.Class<DescribeComputationModelExecutionSummaryResponse>(
  "DescribeComputationModelExecutionSummaryResponse",
)({
  computationModelId: S.String,
  resolveTo: S.optional(ResolveTo),
  computationModelExecutionSummary: ComputationModelExecutionSummary,
}) {}
export class DescribeDefaultEncryptionConfigurationResponse extends S.Class<DescribeDefaultEncryptionConfigurationResponse>(
  "DescribeDefaultEncryptionConfigurationResponse",
)({
  encryptionType: S.String,
  kmsKeyArn: S.optional(S.String),
  configurationStatus: ConfigurationStatus,
}) {}
export class DescribeExecutionResponse extends S.Class<DescribeExecutionResponse>(
  "DescribeExecutionResponse",
)({
  executionId: S.String,
  actionType: S.optional(S.String),
  targetResource: TargetResource,
  targetResourceVersion: S.String,
  resolveTo: S.optional(ResolveTo),
  executionStartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  executionEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  executionStatus: ExecutionStatus,
  executionResult: S.optional(ExecutionResult),
  executionDetails: S.optional(ExecutionDetails),
  executionEntityVersion: S.optional(S.String),
}) {}
export class DescribeGatewayResponse extends S.Class<DescribeGatewayResponse>(
  "DescribeGatewayResponse",
)({
  gatewayId: S.String,
  gatewayName: S.String,
  gatewayArn: S.String,
  gatewayPlatform: S.optional(GatewayPlatform),
  gatewayVersion: S.optional(S.String),
  gatewayCapabilitySummaries: GatewayCapabilitySummaries,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DescribePortalResponse extends S.Class<DescribePortalResponse>(
  "DescribePortalResponse",
)({
  portalId: S.String,
  portalArn: S.String,
  portalName: S.String,
  portalDescription: S.optional(S.String),
  portalClientId: S.String,
  portalStartUrl: S.String,
  portalContactEmail: S.String,
  portalStatus: PortalStatus,
  portalCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  portalLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  portalLogoImageLocation: S.optional(ImageLocation),
  roleArn: S.optional(S.String),
  portalAuthMode: S.optional(S.String),
  notificationSenderEmail: S.optional(S.String),
  alarms: S.optional(Alarms),
  portalType: S.optional(S.String),
  portalTypeConfiguration: S.optional(PortalTypeConfiguration),
}) {}
export class DescribeStorageConfigurationResponse extends S.Class<DescribeStorageConfigurationResponse>(
  "DescribeStorageConfigurationResponse",
)({
  storageType: S.String,
  multiLayerStorage: S.optional(MultiLayerStorage),
  disassociatedDataStorage: S.optional(S.String),
  retentionPeriod: S.optional(RetentionPeriod),
  configurationStatus: ConfigurationStatus,
  lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  warmTier: S.optional(S.String),
  warmTierRetentionPeriod: S.optional(WarmTierRetentionPeriod),
  disallowIngestNullNaN: S.optional(S.Boolean),
}) {}
export class ExecuteActionResponse extends S.Class<ExecuteActionResponse>(
  "ExecuteActionResponse",
)({ actionId: S.String }) {}
export class GetInterpolatedAssetPropertyValuesResponse extends S.Class<GetInterpolatedAssetPropertyValuesResponse>(
  "GetInterpolatedAssetPropertyValuesResponse",
)({
  interpolatedAssetPropertyValues: InterpolatedAssetPropertyValues,
  nextToken: S.optional(S.String),
}) {}
export class ListAccessPoliciesResponse extends S.Class<ListAccessPoliciesResponse>(
  "ListAccessPoliciesResponse",
)({
  accessPolicySummaries: AccessPolicySummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListActionsResponse extends S.Class<ListActionsResponse>(
  "ListActionsResponse",
)({ actionSummaries: ActionSummaries, nextToken: S.String }) {}
export class ListAssetModelsResponse extends S.Class<ListAssetModelsResponse>(
  "ListAssetModelsResponse",
)({
  assetModelSummaries: AssetModelSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListAssetPropertiesResponse extends S.Class<ListAssetPropertiesResponse>(
  "ListAssetPropertiesResponse",
)({
  assetPropertySummaries: AssetPropertySummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListAssetsResponse extends S.Class<ListAssetsResponse>(
  "ListAssetsResponse",
)({ assetSummaries: AssetSummaries, nextToken: S.optional(S.String) }) {}
export class ListAssociatedAssetsResponse extends S.Class<ListAssociatedAssetsResponse>(
  "ListAssociatedAssetsResponse",
)({
  assetSummaries: AssociatedAssetsSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListBulkImportJobsResponse extends S.Class<ListBulkImportJobsResponse>(
  "ListBulkImportJobsResponse",
)({ jobSummaries: JobSummaries, nextToken: S.optional(S.String) }) {}
export class ListCompositionRelationshipsResponse extends S.Class<ListCompositionRelationshipsResponse>(
  "ListCompositionRelationshipsResponse",
)({
  compositionRelationshipSummaries: CompositionRelationshipSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListComputationModelDataBindingUsagesRequest extends S.Class<ListComputationModelDataBindingUsagesRequest>(
  "ListComputationModelDataBindingUsagesRequest",
)(
  {
    dataBindingValueFilter: DataBindingValueFilter,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/computation-models/data-binding-usages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListComputationModelResolveToResourcesResponse extends S.Class<ListComputationModelResolveToResourcesResponse>(
  "ListComputationModelResolveToResourcesResponse",
)({
  computationModelResolveToResourceSummaries:
    ComputationModelResolveToResourceSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListComputationModelsResponse extends S.Class<ListComputationModelsResponse>(
  "ListComputationModelsResponse",
)({
  computationModelSummaries: ComputationModelSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListDashboardsResponse extends S.Class<ListDashboardsResponse>(
  "ListDashboardsResponse",
)({
  dashboardSummaries: DashboardSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListDatasetsResponse extends S.Class<ListDatasetsResponse>(
  "ListDatasetsResponse",
)({ datasetSummaries: DatasetSummaries, nextToken: S.optional(S.String) }) {}
export class ListExecutionsResponse extends S.Class<ListExecutionsResponse>(
  "ListExecutionsResponse",
)({
  executionSummaries: ExecutionSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListGatewaysResponse extends S.Class<ListGatewaysResponse>(
  "ListGatewaysResponse",
)({ gatewaySummaries: GatewaySummaries, nextToken: S.optional(S.String) }) {}
export class ListInterfaceRelationshipsResponse extends S.Class<ListInterfaceRelationshipsResponse>(
  "ListInterfaceRelationshipsResponse",
)({
  interfaceRelationshipSummaries: InterfaceRelationshipSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListPortalsResponse extends S.Class<ListPortalsResponse>(
  "ListPortalsResponse",
)({
  portalSummaries: S.optional(PortalSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListProjectsResponse extends S.Class<ListProjectsResponse>(
  "ListProjectsResponse",
)({ projectSummaries: ProjectSummaries, nextToken: S.optional(S.String) }) {}
export class ListTimeSeriesResponse extends S.Class<ListTimeSeriesResponse>(
  "ListTimeSeriesResponse",
)({
  TimeSeriesSummaries: TimeSeriesSummaries,
  nextToken: S.optional(S.String),
}) {}
export class PutAssetModelInterfaceRelationshipRequest extends S.Class<PutAssetModelInterfaceRelationshipRequest>(
  "PutAssetModelInterfaceRelationshipRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    interfaceAssetModelId: S.String.pipe(T.HttpLabel()),
    propertyMappingConfiguration: PropertyMappingConfiguration,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/asset-models/{assetModelId}/interface/{interfaceAssetModelId}/asset-model-interface-relationship",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssetModelRequest extends S.Class<UpdateAssetModelRequest>(
  "UpdateAssetModelRequest",
)(
  {
    assetModelId: S.String.pipe(T.HttpLabel()),
    assetModelExternalId: S.optional(S.String),
    assetModelName: S.String,
    assetModelDescription: S.optional(S.String),
    assetModelProperties: S.optional(AssetModelProperties),
    assetModelHierarchies: S.optional(AssetModelHierarchies),
    assetModelCompositeModels: S.optional(AssetModelCompositeModels),
    clientToken: S.optional(S.String),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/asset-models/{assetModelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePortalResponse extends S.Class<UpdatePortalResponse>(
  "UpdatePortalResponse",
)({ portalStatus: PortalStatus }) {}
export class CompositionRelationshipItem extends S.Class<CompositionRelationshipItem>(
  "CompositionRelationshipItem",
)({ id: S.optional(S.String) }) {}
export const CompositionRelationship = S.Array(CompositionRelationshipItem);
export class ColumnType extends S.Class<ColumnType>("ColumnType")({
  scalarType: S.optional(S.String),
}) {}
export class Datum extends S.Class<Datum>("Datum")({
  scalarValue: S.optional(S.String),
  arrayValue: S.optional(S.suspend(() => DatumList)),
  rowValue: S.optional(S.suspend((): S.Schema<Row, any> => Row)),
  nullValue: S.optional(S.Boolean),
}) {}
export type DatumList = Datum[];
export const DatumList = S.Array(
  S.suspend((): S.Schema<Datum, any> => Datum),
) as any as S.Schema<DatumList>;
export class Aggregates extends S.Class<Aggregates>("Aggregates")({
  average: S.optional(S.Number),
  count: S.optional(S.Number),
  maximum: S.optional(S.Number),
  minimum: S.optional(S.Number),
  sum: S.optional(S.Number),
  standardDeviation: S.optional(S.Number),
}) {}
export class Trace extends S.Class<Trace>("Trace")({
  text: S.optional(S.String),
}) {}
export class InterfaceSummary extends S.Class<InterfaceSummary>(
  "InterfaceSummary",
)({
  interfaceAssetModelId: S.String,
  interfaceAssetModelPropertyId: S.String,
}) {}
export const InterfaceSummaries = S.Array(InterfaceSummary);
export class AssetHierarchyInfo extends S.Class<AssetHierarchyInfo>(
  "AssetHierarchyInfo",
)({
  parentAssetId: S.optional(S.String),
  childAssetId: S.optional(S.String),
}) {}
export class BatchGetAssetPropertyAggregatesErrorEntry extends S.Class<BatchGetAssetPropertyAggregatesErrorEntry>(
  "BatchGetAssetPropertyAggregatesErrorEntry",
)({ errorCode: S.String, errorMessage: S.String, entryId: S.String }) {}
export const BatchGetAssetPropertyAggregatesErrorEntries = S.Array(
  BatchGetAssetPropertyAggregatesErrorEntry,
);
export class AggregatedValue extends S.Class<AggregatedValue>(
  "AggregatedValue",
)({
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  quality: S.optional(S.String),
  value: Aggregates,
}) {}
export const AggregatedValues = S.Array(AggregatedValue);
export class BatchGetAssetPropertyAggregatesSuccessEntry extends S.Class<BatchGetAssetPropertyAggregatesSuccessEntry>(
  "BatchGetAssetPropertyAggregatesSuccessEntry",
)({ entryId: S.String, aggregatedValues: AggregatedValues }) {}
export const BatchGetAssetPropertyAggregatesSuccessEntries = S.Array(
  BatchGetAssetPropertyAggregatesSuccessEntry,
);
export class BatchGetAssetPropertyValueErrorEntry extends S.Class<BatchGetAssetPropertyValueErrorEntry>(
  "BatchGetAssetPropertyValueErrorEntry",
)({ errorCode: S.String, errorMessage: S.String, entryId: S.String }) {}
export const BatchGetAssetPropertyValueErrorEntries = S.Array(
  BatchGetAssetPropertyValueErrorEntry,
);
export class BatchGetAssetPropertyValueSuccessEntry extends S.Class<BatchGetAssetPropertyValueSuccessEntry>(
  "BatchGetAssetPropertyValueSuccessEntry",
)({ entryId: S.String, assetPropertyValue: S.optional(AssetPropertyValue) }) {}
export const BatchGetAssetPropertyValueSuccessEntries = S.Array(
  BatchGetAssetPropertyValueSuccessEntry,
);
export class BatchGetAssetPropertyValueHistoryErrorEntry extends S.Class<BatchGetAssetPropertyValueHistoryErrorEntry>(
  "BatchGetAssetPropertyValueHistoryErrorEntry",
)({ errorCode: S.String, errorMessage: S.String, entryId: S.String }) {}
export const BatchGetAssetPropertyValueHistoryErrorEntries = S.Array(
  BatchGetAssetPropertyValueHistoryErrorEntry,
);
export class BatchGetAssetPropertyValueHistorySuccessEntry extends S.Class<BatchGetAssetPropertyValueHistorySuccessEntry>(
  "BatchGetAssetPropertyValueHistorySuccessEntry",
)({
  entryId: S.String,
  assetPropertyValueHistory: AssetPropertyValueHistory,
}) {}
export const BatchGetAssetPropertyValueHistorySuccessEntries = S.Array(
  BatchGetAssetPropertyValueHistorySuccessEntry,
);
export class CompositionDetails extends S.Class<CompositionDetails>(
  "CompositionDetails",
)({ compositionRelationship: S.optional(CompositionRelationship) }) {}
export class ColumnInfo extends S.Class<ColumnInfo>("ColumnInfo")({
  name: S.optional(S.String),
  type: S.optional(ColumnType),
}) {}
export const ColumnsList = S.Array(ColumnInfo);
export class Row extends S.Class<Row>("Row")({
  data: S.suspend(() => DatumList),
}) {}
export const Rows = S.Array(S.suspend((): S.Schema<Row, any> => Row));
export class AssetModelPropertySummary extends S.Class<AssetModelPropertySummary>(
  "AssetModelPropertySummary",
)({
  id: S.optional(S.String),
  externalId: S.optional(S.String),
  name: S.String,
  dataType: S.String,
  dataTypeSpec: S.optional(S.String),
  unit: S.optional(S.String),
  type: PropertyType,
  assetModelCompositeModelId: S.optional(S.String),
  path: S.optional(AssetModelPropertyPath),
  interfaceSummaries: S.optional(InterfaceSummaries),
}) {}
export const AssetModelPropertySummaries = S.Array(AssetModelPropertySummary);
export class AssetRelationshipSummary extends S.Class<AssetRelationshipSummary>(
  "AssetRelationshipSummary",
)({
  hierarchyInfo: S.optional(AssetHierarchyInfo),
  relationshipType: S.String,
}) {}
export const AssetRelationshipSummaries = S.Array(AssetRelationshipSummary);
export class CreateAccessPolicyResponse extends S.Class<CreateAccessPolicyResponse>(
  "CreateAccessPolicyResponse",
)({ accessPolicyId: S.String, accessPolicyArn: S.String }) {}
export class CreateBulkImportJobRequest extends S.Class<CreateBulkImportJobRequest>(
  "CreateBulkImportJobRequest",
)(
  {
    jobName: S.String,
    jobRoleArn: S.String,
    files: Files,
    errorReportLocation: ErrorReportLocation,
    jobConfiguration: JobConfiguration,
    adaptiveIngestion: S.optional(S.Boolean),
    deleteFilesAfterImport: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/jobs" }), svc, auth, proto, ver, rules),
) {}
export class CreateComputationModelRequest extends S.Class<CreateComputationModelRequest>(
  "CreateComputationModelRequest",
)(
  {
    computationModelName: S.String,
    computationModelDescription: S.optional(S.String),
    computationModelConfiguration: ComputationModelConfiguration,
    computationModelDataBinding: ComputationModelDataBinding,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/computation-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDatasetRequest extends S.Class<CreateDatasetRequest>(
  "CreateDatasetRequest",
)(
  {
    datasetId: S.optional(S.String),
    datasetName: S.String,
    datasetDescription: S.optional(S.String),
    datasetSource: DatasetSource,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/datasets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGatewayResponse extends S.Class<CreateGatewayResponse>(
  "CreateGatewayResponse",
)({ gatewayId: S.String, gatewayArn: S.String }) {}
export class CreatePortalResponse extends S.Class<CreatePortalResponse>(
  "CreatePortalResponse",
)({
  portalId: S.String,
  portalArn: S.String,
  portalStartUrl: S.String,
  portalStatus: PortalStatus,
  ssoApplicationId: S.String,
}) {}
export class DeletePortalResponse extends S.Class<DeletePortalResponse>(
  "DeletePortalResponse",
)({ portalStatus: PortalStatus }) {}
export class DescribeAssetResponse extends S.Class<DescribeAssetResponse>(
  "DescribeAssetResponse",
)({
  assetId: S.String,
  assetExternalId: S.optional(S.String),
  assetArn: S.String,
  assetName: S.String,
  assetModelId: S.String,
  assetProperties: AssetProperties,
  assetHierarchies: AssetHierarchies,
  assetCompositeModels: S.optional(AssetCompositeModels),
  assetCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  assetLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  assetStatus: AssetStatus,
  assetDescription: S.optional(S.String),
  assetCompositeModelSummaries: S.optional(AssetCompositeModelSummaries),
}) {}
export class DescribeAssetModelCompositeModelResponse extends S.Class<DescribeAssetModelCompositeModelResponse>(
  "DescribeAssetModelCompositeModelResponse",
)({
  assetModelId: S.String,
  assetModelCompositeModelId: S.String,
  assetModelCompositeModelExternalId: S.optional(S.String),
  assetModelCompositeModelPath: AssetModelCompositeModelPath,
  assetModelCompositeModelName: S.String,
  assetModelCompositeModelDescription: S.String,
  assetModelCompositeModelType: S.String,
  assetModelCompositeModelProperties: AssetModelProperties,
  compositionDetails: S.optional(CompositionDetails),
  assetModelCompositeModelSummaries: AssetModelCompositeModelSummaries,
  actionDefinitions: S.optional(ActionDefinitions),
}) {}
export class ExecuteQueryResponse extends S.Class<ExecuteQueryResponse>(
  "ExecuteQueryResponse",
)({
  columns: S.optional(ColumnsList),
  rows: S.optional(Rows),
  nextToken: S.optional(S.String),
}) {}
export class GetAssetPropertyAggregatesResponse extends S.Class<GetAssetPropertyAggregatesResponse>(
  "GetAssetPropertyAggregatesResponse",
)({ aggregatedValues: AggregatedValues, nextToken: S.optional(S.String) }) {}
export class ListAssetModelPropertiesResponse extends S.Class<ListAssetModelPropertiesResponse>(
  "ListAssetModelPropertiesResponse",
)({
  assetModelPropertySummaries: AssetModelPropertySummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListAssetRelationshipsResponse extends S.Class<ListAssetRelationshipsResponse>(
  "ListAssetRelationshipsResponse",
)({
  assetRelationshipSummaries: AssetRelationshipSummaries,
  nextToken: S.optional(S.String),
}) {}
export class PutAssetModelInterfaceRelationshipResponse extends S.Class<PutAssetModelInterfaceRelationshipResponse>(
  "PutAssetModelInterfaceRelationshipResponse",
)({
  assetModelId: S.String,
  interfaceAssetModelId: S.String,
  assetModelArn: S.String,
  assetModelStatus: AssetModelStatus,
}) {}
export class UpdateAssetModelResponse extends S.Class<UpdateAssetModelResponse>(
  "UpdateAssetModelResponse",
)({ assetModelStatus: AssetModelStatus }) {}
export class BatchGetAssetPropertyAggregatesErrorInfo extends S.Class<BatchGetAssetPropertyAggregatesErrorInfo>(
  "BatchGetAssetPropertyAggregatesErrorInfo",
)({
  errorCode: S.String,
  errorTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class BatchGetAssetPropertyValueErrorInfo extends S.Class<BatchGetAssetPropertyValueErrorInfo>(
  "BatchGetAssetPropertyValueErrorInfo",
)({
  errorCode: S.String,
  errorTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class BatchGetAssetPropertyValueHistoryErrorInfo extends S.Class<BatchGetAssetPropertyValueHistoryErrorInfo>(
  "BatchGetAssetPropertyValueHistoryErrorInfo",
)({
  errorCode: S.String,
  errorTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const AssetPropertyValues = S.Array(AssetPropertyValue);
export const ComputationModelIdList = S.Array(S.String);
export class Content extends S.Class<Content>("Content")({
  text: S.optional(S.String),
}) {}
export class BatchGetAssetPropertyAggregatesSkippedEntry extends S.Class<BatchGetAssetPropertyAggregatesSkippedEntry>(
  "BatchGetAssetPropertyAggregatesSkippedEntry",
)({
  entryId: S.String,
  completionStatus: S.String,
  errorInfo: S.optional(BatchGetAssetPropertyAggregatesErrorInfo),
}) {}
export const BatchGetAssetPropertyAggregatesSkippedEntries = S.Array(
  BatchGetAssetPropertyAggregatesSkippedEntry,
);
export class BatchGetAssetPropertyValueSkippedEntry extends S.Class<BatchGetAssetPropertyValueSkippedEntry>(
  "BatchGetAssetPropertyValueSkippedEntry",
)({
  entryId: S.String,
  completionStatus: S.String,
  errorInfo: S.optional(BatchGetAssetPropertyValueErrorInfo),
}) {}
export const BatchGetAssetPropertyValueSkippedEntries = S.Array(
  BatchGetAssetPropertyValueSkippedEntry,
);
export class BatchGetAssetPropertyValueHistorySkippedEntry extends S.Class<BatchGetAssetPropertyValueHistorySkippedEntry>(
  "BatchGetAssetPropertyValueHistorySkippedEntry",
)({
  entryId: S.String,
  completionStatus: S.String,
  errorInfo: S.optional(BatchGetAssetPropertyValueHistoryErrorInfo),
}) {}
export const BatchGetAssetPropertyValueHistorySkippedEntries = S.Array(
  BatchGetAssetPropertyValueHistorySkippedEntry,
);
export class PutAssetPropertyValueEntry extends S.Class<PutAssetPropertyValueEntry>(
  "PutAssetPropertyValueEntry",
)({
  entryId: S.String,
  assetId: S.optional(S.String),
  propertyId: S.optional(S.String),
  propertyAlias: S.optional(S.String),
  propertyValues: AssetPropertyValues,
}) {}
export const PutAssetPropertyValueEntries = S.Array(PutAssetPropertyValueEntry);
export class BatchGetAssetPropertyAggregatesResponse extends S.Class<BatchGetAssetPropertyAggregatesResponse>(
  "BatchGetAssetPropertyAggregatesResponse",
)({
  errorEntries: BatchGetAssetPropertyAggregatesErrorEntries,
  successEntries: BatchGetAssetPropertyAggregatesSuccessEntries,
  skippedEntries: BatchGetAssetPropertyAggregatesSkippedEntries,
  nextToken: S.optional(S.String),
}) {}
export class BatchGetAssetPropertyValueResponse extends S.Class<BatchGetAssetPropertyValueResponse>(
  "BatchGetAssetPropertyValueResponse",
)({
  errorEntries: BatchGetAssetPropertyValueErrorEntries,
  successEntries: BatchGetAssetPropertyValueSuccessEntries,
  skippedEntries: BatchGetAssetPropertyValueSkippedEntries,
  nextToken: S.optional(S.String),
}) {}
export class BatchGetAssetPropertyValueHistoryResponse extends S.Class<BatchGetAssetPropertyValueHistoryResponse>(
  "BatchGetAssetPropertyValueHistoryResponse",
)({
  errorEntries: BatchGetAssetPropertyValueHistoryErrorEntries,
  successEntries: BatchGetAssetPropertyValueHistorySuccessEntries,
  skippedEntries: BatchGetAssetPropertyValueHistorySkippedEntries,
  nextToken: S.optional(S.String),
}) {}
export class BatchPutAssetPropertyValueRequest extends S.Class<BatchPutAssetPropertyValueRequest>(
  "BatchPutAssetPropertyValueRequest",
)(
  {
    enablePartialEntryProcessing: S.optional(S.Boolean),
    entries: PutAssetPropertyValueEntries,
  },
  T.all(
    T.Http({ method: "POST", uri: "/properties" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAssetResponse extends S.Class<CreateAssetResponse>(
  "CreateAssetResponse",
)({ assetId: S.String, assetArn: S.String, assetStatus: AssetStatus }) {}
export class CreateBulkImportJobResponse extends S.Class<CreateBulkImportJobResponse>(
  "CreateBulkImportJobResponse",
)({ jobId: S.String, jobName: S.String, jobStatus: S.String }) {}
export class CreateComputationModelResponse extends S.Class<CreateComputationModelResponse>(
  "CreateComputationModelResponse",
)({
  computationModelId: S.String,
  computationModelArn: S.String,
  computationModelStatus: ComputationModelStatus,
}) {}
export class CreateDatasetResponse extends S.Class<CreateDatasetResponse>(
  "CreateDatasetResponse",
)({
  datasetId: S.String,
  datasetArn: S.String,
  datasetStatus: DatasetStatus,
}) {}
export class DataBindingValue extends S.Class<DataBindingValue>(
  "DataBindingValue",
)({
  assetModelProperty: S.optional(AssetModelPropertyBindingValue),
  assetProperty: S.optional(AssetPropertyBindingValue),
}) {}
export class CreateAssetModelRequest extends S.Class<CreateAssetModelRequest>(
  "CreateAssetModelRequest",
)(
  {
    assetModelName: S.String,
    assetModelType: S.optional(S.String),
    assetModelId: S.optional(S.String),
    assetModelExternalId: S.optional(S.String),
    assetModelDescription: S.optional(S.String),
    assetModelProperties: S.optional(AssetModelPropertyDefinitions),
    assetModelHierarchies: S.optional(AssetModelHierarchyDefinitions),
    assetModelCompositeModels: S.optional(AssetModelCompositeModelDefinitions),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/asset-models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Location extends S.Class<Location>("Location")({
  uri: S.optional(S.String),
}) {}
export class MatchedDataBinding extends S.Class<MatchedDataBinding>(
  "MatchedDataBinding",
)({ value: DataBindingValue }) {}
export class Source extends S.Class<Source>("Source")({
  arn: S.optional(S.String),
  location: S.optional(Location),
}) {}
export class ComputationModelDataBindingUsageSummary extends S.Class<ComputationModelDataBindingUsageSummary>(
  "ComputationModelDataBindingUsageSummary",
)({
  computationModelIds: ComputationModelIdList,
  matchedDataBinding: MatchedDataBinding,
}) {}
export const ComputationModelDataBindingUsageSummaries = S.Array(
  ComputationModelDataBindingUsageSummary,
);
export const Timestamps = S.Array(TimeInNanos);
export class CreateAssetModelResponse extends S.Class<CreateAssetModelResponse>(
  "CreateAssetModelResponse",
)({
  assetModelId: S.String,
  assetModelArn: S.String,
  assetModelStatus: AssetModelStatus,
}) {}
export class DataSetReference extends S.Class<DataSetReference>(
  "DataSetReference",
)({ datasetArn: S.optional(S.String), source: S.optional(Source) }) {}
export class ListComputationModelDataBindingUsagesResponse extends S.Class<ListComputationModelDataBindingUsagesResponse>(
  "ListComputationModelDataBindingUsagesResponse",
)({
  dataBindingUsageSummaries: ComputationModelDataBindingUsageSummaries,
  nextToken: S.optional(S.String),
}) {}
export class BatchPutAssetPropertyError extends S.Class<BatchPutAssetPropertyError>(
  "BatchPutAssetPropertyError",
)({ errorCode: S.String, errorMessage: S.String, timestamps: Timestamps }) {}
export const BatchPutAssetPropertyErrors = S.Array(BatchPutAssetPropertyError);
export class Reference extends S.Class<Reference>("Reference")({
  dataset: S.optional(DataSetReference),
}) {}
export class BatchPutAssetPropertyErrorEntry extends S.Class<BatchPutAssetPropertyErrorEntry>(
  "BatchPutAssetPropertyErrorEntry",
)({ entryId: S.String, errors: BatchPutAssetPropertyErrors }) {}
export const BatchPutAssetPropertyErrorEntries = S.Array(
  BatchPutAssetPropertyErrorEntry,
);
export class Citation extends S.Class<Citation>("Citation")({
  reference: S.optional(Reference),
  content: S.optional(Content),
}) {}
export const Citations = S.Array(Citation);
export class BatchPutAssetPropertyValueResponse extends S.Class<BatchPutAssetPropertyValueResponse>(
  "BatchPutAssetPropertyValueResponse",
)({ errorEntries: BatchPutAssetPropertyErrorEntries }) {}
export class InvocationOutput extends S.Class<InvocationOutput>(
  "InvocationOutput",
)({ message: S.optional(S.String), citations: S.optional(Citations) }) {}
export const ResponseStream = T.EventStream(
  S.Union(
    S.Struct({ trace: Trace }),
    S.Struct({ output: InvocationOutput }),
    S.Struct({ accessDeniedException: S.suspend(() => AccessDeniedException) }),
    S.Struct({
      conflictingOperationException: S.suspend(
        () => ConflictingOperationException,
      ),
    }),
    S.Struct({
      internalFailureException: S.suspend(() => InternalFailureException),
    }),
    S.Struct({
      invalidRequestException: S.suspend(() => InvalidRequestException),
    }),
    S.Struct({
      limitExceededException: S.suspend(() => LimitExceededException),
    }),
    S.Struct({
      resourceNotFoundException: S.suspend(() => ResourceNotFoundException),
    }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
  ),
);
export class InvokeAssistantResponse extends S.Class<InvokeAssistantResponse>(
  "InvokeAssistantResponse",
)({
  body: ResponseStream.pipe(T.HttpPayload()),
  conversationId: S.String.pipe(
    T.HttpHeader("x-amz-iotsitewise-assistant-conversation-id"),
  ),
}) {}

//# Errors
export class ConflictingOperationException extends S.TaggedError<ConflictingOperationException>()(
  "ConflictingOperationException",
  {},
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
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
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {},
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class QueryTimeoutException extends S.TaggedError<QueryTimeoutException>()(
  "QueryTimeoutException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a project from IoT SiteWise Monitor.
 */
export const deleteProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a time series (data stream). If you delete a time series that's associated with an
 * asset property, the asset property still exists, but the time series will no longer be
 * associated with this asset property.
 *
 * To identify a time series, do one of the following:
 *
 * - If the time series isn't associated with an asset property,
 * specify the `alias` of the time series.
 *
 * - If the time series is associated with an asset property,
 * specify one of the following:
 *
 * - The `alias` of the time series.
 *
 * - The `assetId` and `propertyId` that identifies the asset property.
 */
export const deleteTimeSeries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTimeSeriesRequest,
  output: DeleteTimeSeriesResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates a child asset from the given parent asset through a hierarchy defined in the
 * parent asset's model.
 */
export const disassociateAssets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAssetsRequest,
  output: DisassociateAssetsResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates a time series (data stream) from an asset property.
 */
export const disassociateTimeSeriesFromAssetProperty =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateTimeSeriesFromAssetPropertyRequest,
    output: DisassociateTimeSeriesFromAssetPropertyResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Sets logging options for IoT SiteWise.
 */
export const putLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLoggingOptionsRequest,
  output: PutLoggingOptionsResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an existing access policy that specifies an identity's access to an IoT SiteWise Monitor
 * portal or project resource.
 */
export const updateAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessPolicyRequest,
  output: UpdateAccessPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an asset property's alias and notification state.
 *
 * This operation overwrites the property's existing alias and notification state. To keep
 * your existing property's alias or notification state, you must include the existing values
 * in the UpdateAssetProperty request. For more information, see DescribeAssetProperty.
 */
export const updateAssetProperty = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetPropertyRequest,
  output: UpdateAssetPropertyResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an IoT SiteWise Monitor dashboard.
 */
export const updateDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDashboardRequest,
  output: UpdateDashboardResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a gateway's name.
 */
export const updateGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayRequest,
  output: UpdateGatewayResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an IoT SiteWise Monitor project.
 */
export const updateProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates a time series (data stream) with an asset property.
 */
export const associateTimeSeriesToAssetProperty =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateTimeSeriesToAssetPropertyRequest,
    output: AssociateTimeSeriesToAssetPropertyResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Disassociates a group (batch) of assets from an IoT SiteWise Monitor project.
 */
export const batchDisassociateProjectAssets =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDisassociateProjectAssetsRequest,
    output: BatchDisassociateProjectAssetsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates a dashboard in an IoT SiteWise Monitor project.
 */
export const createDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDashboardRequest,
  output: CreateDashboardResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a project in the specified portal.
 *
 * Make sure that the project name and description don't contain confidential
 * information.
 */
export const createProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an access policy that grants the specified identity access to the specified
 * IoT SiteWise Monitor resource. You can use this operation to revoke access to an IoT SiteWise Monitor
 * resource.
 */
export const deleteAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPolicyRequest,
  output: DeleteAccessPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an asset. This action can't be undone. For more information, see Deleting assets and
 * models in the *IoT SiteWise User Guide*.
 *
 * You can't delete an asset that's associated to another asset. For more information, see
 * DisassociateAssets.
 */
export const deleteAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetRequest,
  output: DeleteAssetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a composite model. This action can't be undone. You must delete all assets created
 * from a composite model before you can delete the model. Also, you can't delete a composite
 * model if a parent asset model exists that contains a property formula expression that depends
 * on the asset model that you want to delete. For more information, see Deleting assets and
 * models in the *IoT SiteWise User Guide*.
 */
export const deleteAssetModelCompositeModel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAssetModelCompositeModelRequest,
    output: DeleteAssetModelCompositeModelResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      PreconditionFailedException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes an interface relationship between an asset model and an interface asset
 * model.
 */
export const deleteAssetModelInterfaceRelationship =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAssetModelInterfaceRelationshipRequest,
    output: DeleteAssetModelInterfaceRelationshipResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes a dashboard from IoT SiteWise Monitor.
 */
export const deleteDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDashboardRequest,
  output: DeleteDashboardResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a gateway from IoT SiteWise. When you delete a gateway, some of the gateway's files remain
 * in your gateway's file system.
 */
export const deleteGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayRequest,
  output: DeleteGatewayResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes an access policy, which specifies an identity's access to an IoT SiteWise Monitor portal or
 * project.
 */
export const describeAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccessPolicyRequest,
    output: DescribeAccessPolicyResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves information about an action.
 */
export const describeAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeActionRequest,
  output: DescribeActionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a bulk import job request. For more information, see Describe
 * a bulk import job (CLI) in the *Amazon Simple Storage Service User Guide*.
 */
export const describeBulkImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBulkImportJobRequest,
    output: DescribeBulkImportJobResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves information about a computation model.
 */
export const describeComputationModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeComputationModelRequest,
    output: DescribeComputationModelResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves information about a dashboard.
 */
export const describeDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDashboardRequest,
  output: DescribeDashboardResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a dataset.
 */
export const describeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Each gateway capability defines data sources for a gateway. This is the namespace of the gateway capability.
 *
 * . The namespace follows the format `service:capability:version`, where:
 *
 * - `service` - The service providing the capability, or `iotsitewise`.
 *
 * - `capability` - The specific capability type. Options include: `opcuacollector` for the OPC UA data source collector, or `publisher` for data publisher capability.
 *
 * - `version` - The version number of the capability. Option include `2` for Classic streams, V2 gateways, and `3` for MQTT-enabled, V3 gateways.
 *
 * After updating a capability configuration, the sync status becomes `OUT_OF_SYNC` until the gateway processes the configuration.Use `DescribeGatewayCapabilityConfiguration` to check the sync status and verify the configuration was applied.
 *
 * A gateway can have multiple capability configurations with different namespaces.
 */
export const describeGatewayCapabilityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeGatewayCapabilityConfigurationRequest,
    output: DescribeGatewayCapabilityConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the current IoT SiteWise logging options.
 */
export const describeLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLoggingOptionsRequest,
    output: DescribeLoggingOptionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves information about a project.
 */
export const describeProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProjectRequest,
  output: DescribeProjectResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a time series (data stream).
 *
 * To identify a time series, do one of the following:
 *
 * - If the time series isn't associated with an asset property,
 * specify the `alias` of the time series.
 *
 * - If the time series is associated with an asset property,
 * specify one of the following:
 *
 * - The `alias` of the time series.
 *
 * - The `assetId` and `propertyId` that identifies the asset property.
 */
export const describeTimeSeries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTimeSeriesRequest,
  output: DescribeTimeSeriesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the history of an asset property's values. For more information, see Querying
 * historical values in the *IoT SiteWise User Guide*.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 */
export const getAssetPropertyValueHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAssetPropertyValueHistoryRequest,
    output: GetAssetPropertyValueHistoryResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves a paginated list of composite models associated with the asset model
 */
export const listAssetModelCompositeModels =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAssetModelCompositeModelsRequest,
    output: ListAssetModelCompositeModelsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves a paginated list of assets associated with an IoT SiteWise Monitor project.
 */
export const listProjectAssets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProjectAssetsRequest,
  output: ListProjectAssetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the list of tags for an IoT SiteWise resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Sets the default encryption configuration for the Amazon Web Services account. For more information, see
 * Key management in
 * the *IoT SiteWise User Guide*.
 */
export const putDefaultEncryptionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutDefaultEncryptionConfigurationRequest,
    output: PutDefaultEncryptionConfigurationResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ThrottlingException,
    ],
  }));
/**
 * Configures storage settings for IoT SiteWise.
 */
export const putStorageConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutStorageConfigurationRequest,
    output: PutStorageConfigurationResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Removes a tag from an IoT SiteWise resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates an asset's name. For more information, see Updating assets and models in the
 * *IoT SiteWise User Guide*.
 */
export const updateAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetRequest,
  output: UpdateAssetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a composite model and all of the assets that were created from the model. Each
 * asset created from the model inherits the updated asset model's property and hierarchy
 * definitions. For more information, see Updating assets and models in the
 * *IoT SiteWise User Guide*.
 *
 * If you remove a property from a composite asset model, IoT SiteWise deletes all previous data
 * for that property. You can’t change the type or data type of an existing property.
 *
 * To replace an existing composite asset model property with a new one with the same
 * `name`, do the following:
 *
 * - Submit an `UpdateAssetModelCompositeModel` request with the entire
 * existing property removed.
 *
 * - Submit a second `UpdateAssetModelCompositeModel` request that includes
 * the new property. The new asset property will have the same `name` as the
 * previous one and IoT SiteWise will generate a new unique `id`.
 */
export const updateAssetModelCompositeModel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAssetModelCompositeModelRequest,
    output: UpdateAssetModelCompositeModelResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      PreconditionFailedException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the computation model.
 */
export const updateComputationModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateComputationModelRequest,
    output: UpdateComputationModelResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a dataset.
 */
export const updateDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetRequest,
  output: UpdateDatasetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a gateway capability configuration or defines a new capability configuration. Each gateway capability defines data sources for a gateway.
 *
 * Important workflow notes:
 *
 * Each gateway capability defines data sources for a gateway. This is the namespace of the gateway capability.
 *
 * . The namespace follows the format `service:capability:version`, where:
 *
 * - `service` - The service providing the capability, or `iotsitewise`.
 *
 * - `capability` - The specific capability type. Options include: `opcuacollector` for the OPC UA data source collector, or `publisher` for data publisher capability.
 *
 * - `version` - The version number of the capability. Option include `2` for Classic streams, V2 gateways, and `3` for MQTT-enabled, V3 gateways.
 *
 * After updating a capability configuration, the sync status becomes `OUT_OF_SYNC` until the gateway processes the configuration.Use `DescribeGatewayCapabilityConfiguration` to check the sync status and verify the configuration was applied.
 *
 * A gateway can have multiple capability configurations with different namespaces.
 */
export const updateGatewayCapabilityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateGatewayCapabilityConfigurationRequest,
    output: UpdateGatewayCapabilityConfigurationResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Associates a child asset with the given parent asset through a hierarchy defined in the
 * parent asset's model. For more information, see Associating assets in the
 * *IoT SiteWise User Guide*.
 */
export const associateAssets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAssetsRequest,
  output: AssociateAssetsResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates a group (batch) of assets with an IoT SiteWise Monitor project.
 */
export const batchAssociateProjectAssets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchAssociateProjectAssetsRequest,
    output: BatchAssociateProjectAssetsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a custom composite model from specified property and hierarchy definitions. There
 * are two types of custom composite models, `inline` and
 * `component-model-based`.
 *
 * Use component-model-based custom composite models to define standard, reusable components.
 * A component-model-based custom composite model consists of a name, a description, and the ID
 * of the component model it references. A component-model-based custom composite model has no
 * properties of its own; its referenced component model provides its associated properties to
 * any created assets. For more information, see Custom composite models (Components)
 * in the *IoT SiteWise User Guide*.
 *
 * Use inline custom composite models to organize the properties of an asset model. The
 * properties of inline custom composite models are local to the asset model where they are
 * included and can't be used to create multiple assets.
 *
 * To create a component-model-based model, specify the `composedAssetModelId` of
 * an existing asset model with `assetModelType` of
 * `COMPONENT_MODEL`.
 *
 * To create an inline model, specify the `assetModelCompositeModelProperties` and
 * don't include an `composedAssetModelId`.
 */
export const createAssetModelCompositeModel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAssetModelCompositeModelRequest,
    output: CreateAssetModelCompositeModelResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      PreconditionFailedException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes an asset model. This action can't be undone. You must delete all assets created
 * from an asset model before you can delete the model. Also, you can't delete an asset model if
 * a parent asset model exists that contains a property formula expression that depends on the
 * asset model that you want to delete. For more information, see Deleting assets and models in the
 * *IoT SiteWise User Guide*.
 */
export const deleteAssetModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetModelRequest,
  output: DeleteAssetModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a computation model. This action can't be undone.
 */
export const deleteComputationModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteComputationModelRequest,
    output: DeleteComputationModelResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a dataset. This cannot be undone.
 */
export const deleteDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an asset composite model (also known as an asset component).
 * An `AssetCompositeModel` is an instance of an
 * `AssetModelCompositeModel`. If you want to see information about the model this is
 * based on, call DescribeAssetModelCompositeModel.
 */
export const describeAssetCompositeModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAssetCompositeModelRequest,
    output: DescribeAssetCompositeModelResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves information about an asset model. This includes details about the asset model's
 * properties, hierarchies, composite models, and any interface relationships if the asset model
 * implements interfaces.
 */
export const describeAssetModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssetModelRequest,
  output: DescribeAssetModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an interface relationship between an asset model and an
 * interface asset model.
 */
export const describeAssetModelInterfaceRelationship =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAssetModelInterfaceRelationshipRequest,
    output: DescribeAssetModelInterfaceRelationshipResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves information about an asset property.
 *
 * When you call this operation for an attribute property, this response includes the
 * default attribute value that you define in the asset model. If you update the default value
 * in the model, this operation's response includes the new default value.
 *
 * This operation doesn't return the value of the asset property. To get the value of an
 * asset property, use GetAssetPropertyValue.
 */
export const describeAssetProperty = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAssetPropertyRequest,
    output: DescribeAssetPropertyResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves information about the execution summary of a computation model.
 */
export const describeComputationModelExecutionSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeComputationModelExecutionSummaryRequest,
    output: DescribeComputationModelExecutionSummaryResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves information about the default encryption configuration for the Amazon Web Services account in
 * the default or specified Region. For more information, see Key management in the
 * *IoT SiteWise User Guide*.
 */
export const describeDefaultEncryptionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDefaultEncryptionConfigurationRequest,
    output: DescribeDefaultEncryptionConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves information about the execution.
 */
export const describeExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExecutionRequest,
  output: DescribeExecutionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a gateway.
 */
export const describeGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGatewayRequest,
  output: DescribeGatewayResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a portal.
 */
export const describePortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePortalRequest,
  output: DescribePortalResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about the storage configuration for IoT SiteWise.
 */
export const describeStorageConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeStorageConfigurationRequest,
    output: DescribeStorageConfigurationResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Executes an action on a target resource.
 */
export const executeAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteActionRequest,
  output: ExecuteActionResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets an asset property's current value. For more information, see Querying
 * current values in the *IoT SiteWise User Guide*.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 */
export const getAssetPropertyValue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAssetPropertyValueRequest,
    output: GetAssetPropertyValueResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Get interpolated values for an asset property for a specified time interval, during a
 * period of time. If your time series is missing data points during the specified time interval,
 * you can use interpolation to estimate the missing data.
 *
 * For example, you can use this operation to return the interpolated temperature values for
 * a wind turbine every 24 hours over a duration of 7 days.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 */
export const getInterpolatedAssetPropertyValues =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetInterpolatedAssetPropertyValuesRequest,
    output: GetInterpolatedAssetPropertyValuesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves a paginated list of access policies for an identity (an IAM Identity Center user, an IAM Identity Center
 * group, or an IAM user) or an IoT SiteWise Monitor resource (a portal or project).
 */
export const listAccessPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccessPoliciesRequest,
  output: ListAccessPoliciesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of actions for a specific target resource.
 */
export const listActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListActionsRequest,
  output: ListActionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of summaries of all asset models.
 */
export const listAssetModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssetModelsRequest,
  output: ListAssetModelsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of properties associated with an asset.
 * If you update properties associated with the model before you finish listing all the properties,
 * you need to start all over again.
 */
export const listAssetProperties = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssetPropertiesRequest,
  output: ListAssetPropertiesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of asset summaries.
 *
 * You can use this operation to do the following:
 *
 * - List assets based on a specific asset model.
 *
 * - List top-level assets.
 *
 * You can't use this operation to list all assets. To retrieve summaries for all of your
 * assets, use ListAssetModels to get all of your asset model IDs. Then, use ListAssets to get all
 * assets for each asset model.
 */
export const listAssets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssetsRequest,
  output: ListAssetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of associated assets.
 *
 * You can use this operation to do the following:
 *
 * - `CHILD` - List all child assets associated to the asset.
 *
 * - `PARENT` - List the asset's parent asset.
 */
export const listAssociatedAssets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssociatedAssetsRequest,
    output: ListAssociatedAssetsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a paginated list of bulk import job requests. For more information, see List bulk
 * import jobs (CLI) in the *IoT SiteWise User Guide*.
 */
export const listBulkImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBulkImportJobsRequest,
  output: ListBulkImportJobsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of composition relationships for an asset model of type
 * `COMPONENT_MODEL`.
 */
export const listCompositionRelationships =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCompositionRelationshipsRequest,
    output: ListCompositionRelationshipsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Lists all distinct resources that are resolved from the executed actions of the
 * computation model.
 */
export const listComputationModelResolveToResources =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListComputationModelResolveToResourcesRequest,
    output: ListComputationModelResolveToResourcesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves a paginated list of summaries of all computation models.
 */
export const listComputationModels = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListComputationModelsRequest,
    output: ListComputationModelsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a paginated list of dashboards for an IoT SiteWise Monitor project.
 */
export const listDashboards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDashboardsRequest,
  output: ListDashboardsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of datasets for a specific target resource.
 */
export const listDatasets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of summaries of all executions.
 */
export const listExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExecutionsRequest,
  output: ListExecutionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of gateways.
 */
export const listGateways = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGatewaysRequest,
  output: ListGatewaysResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of asset models that have a specific interface asset model
 * applied to them.
 */
export const listInterfaceRelationships = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInterfaceRelationshipsRequest,
    output: ListInterfaceRelationshipsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a paginated list of IoT SiteWise Monitor portals.
 */
export const listPortals = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPortalsRequest,
  output: ListPortalsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of projects for an IoT SiteWise Monitor portal.
 */
export const listProjects = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProjectsRequest,
  output: ListProjectsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of time series (data streams).
 */
export const listTimeSeries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTimeSeriesRequest,
  output: ListTimeSeriesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds tags to an IoT SiteWise resource. If a tag already exists for the resource, this operation
 * updates the tag's value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates an IoT SiteWise Monitor portal.
 */
export const updatePortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePortalRequest,
  output: UpdatePortalResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an access policy that grants the specified identity (IAM Identity Center user, IAM Identity Center group, or
 * IAM user) access to the specified IoT SiteWise Monitor portal or project resource.
 *
 * Support for access policies that use an SSO Group as the identity is not supported at this time.
 */
export const createAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPolicyRequest,
  output: CreateAccessPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a gateway, which is a virtual or edge device that delivers industrial data streams
 * from local servers to IoT SiteWise. For more information, see Ingesting data using a gateway in the
 * *IoT SiteWise User Guide*.
 */
export const createGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGatewayRequest,
  output: CreateGatewayResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates a portal, which can contain projects and dashboards. IoT SiteWise Monitor uses IAM Identity Center or IAM
 * to authenticate portal users and manage user permissions.
 *
 * Before you can sign in to a new portal, you must add at least one identity to that
 * portal. For more information, see Adding or removing portal
 * administrators in the *IoT SiteWise User Guide*.
 */
export const createPortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePortalRequest,
  output: CreatePortalResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a portal from IoT SiteWise Monitor.
 */
export const deletePortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePortalRequest,
  output: DeletePortalResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an asset.
 */
export const describeAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssetRequest,
  output: DescribeAssetResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an asset model composite model (also known as an asset model
 * component). For more information, see Custom composite models
 * (Components) in the *IoT SiteWise User Guide*.
 */
export const describeAssetModelCompositeModel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAssetModelCompositeModelRequest,
    output: DescribeAssetModelCompositeModelResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Gets aggregated values for an asset property. For more information, see Querying
 * aggregates in the *IoT SiteWise User Guide*.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 */
export const getAssetPropertyAggregates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAssetPropertyAggregatesRequest,
    output: GetAssetPropertyAggregatesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a paginated list of properties associated with an asset model.
 * If you update properties associated with the model before you finish listing all the properties,
 * you need to start all over again.
 */
export const listAssetModelProperties = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssetModelPropertiesRequest,
    output: ListAssetModelPropertiesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a paginated list of asset relationships for an asset. You can use this operation
 * to identify an asset's root asset and all associated assets between that asset and its
 * root.
 */
export const listAssetRelationships = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssetRelationshipsRequest,
    output: ListAssetRelationshipsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates or updates an interface relationship between an asset model and an interface asset
 * model. This operation applies an interface to an asset model.
 */
export const putAssetModelInterfaceRelationship =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutAssetModelInterfaceRelationshipRequest,
    output: PutAssetModelInterfaceRelationshipResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates an asset model and all of the assets that were created from the model. Each asset
 * created from the model inherits the updated asset model's property and hierarchy definitions.
 * For more information, see Updating assets and models in the
 * *IoT SiteWise User Guide*.
 *
 * If you remove a property from an asset model, IoT SiteWise deletes all previous data for that
 * property. You can’t change the type or data type of an existing property.
 *
 * To replace an existing asset model property with a new one with the same
 * `name`, do the following:
 *
 * - Submit an `UpdateAssetModel` request with the entire existing property
 * removed.
 *
 * - Submit a second `UpdateAssetModel` request that includes the new
 * property. The new asset property will have the same `name` as the previous
 * one and IoT SiteWise will generate a new unique `id`.
 */
export const updateAssetModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetModelRequest,
  output: UpdateAssetModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    PreconditionFailedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets aggregated values (for example, average, minimum, and maximum) for one or more asset
 * properties. For more information, see Querying aggregates in the
 * *IoT SiteWise User Guide*.
 */
export const batchGetAssetPropertyAggregates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetAssetPropertyAggregatesRequest,
    output: BatchGetAssetPropertyAggregatesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Gets the current value for one or more asset properties. For more information, see Querying
 * current values in the *IoT SiteWise User Guide*.
 */
export const batchGetAssetPropertyValue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetAssetPropertyValueRequest,
    output: BatchGetAssetPropertyValueResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets the historical values for one or more asset properties. For more information, see
 * Querying historical values in the *IoT SiteWise User Guide*.
 */
export const batchGetAssetPropertyValueHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetAssetPropertyValueHistoryRequest,
    output: BatchGetAssetPropertyValueHistoryResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Creates an asset from an existing asset model. For more information, see Creating assets in the
 * *IoT SiteWise User Guide*.
 */
export const createAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetRequest,
  output: CreateAssetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Defines a job to ingest data to IoT SiteWise from Amazon S3. For more information, see Create a
 * bulk import job (CLI) in the *Amazon Simple Storage Service User Guide*.
 *
 * Before you create a bulk import job, you must enable IoT SiteWise warm tier or IoT SiteWise cold tier.
 * For more information about how to configure storage settings, see PutStorageConfiguration.
 *
 * Bulk import is designed to store historical data to IoT SiteWise.
 *
 * - Newly ingested data in the hot tier triggers notifications and computations.
 *
 * - After data moves from the hot tier to the warm or cold tier based on retention
 * settings, it does not trigger computations or notifications.
 *
 * - Data older than 7 days does not trigger computations or notifications.
 */
export const createBulkImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBulkImportJobRequest,
  output: CreateBulkImportJobResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Create a computation model with a configuration and data binding.
 */
export const createComputationModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateComputationModelRequest,
    output: CreateComputationModelResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a dataset to connect an external datasource.
 */
export const createDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Run SQL queries to retrieve metadata and time-series data from asset models, assets,
 * measurements, metrics, transforms, and aggregates.
 */
export const executeQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteQueryRequest,
  output: ExecuteQueryResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidRequestException,
    QueryTimeoutException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an asset model from specified property and hierarchy definitions. You create
 * assets from asset models. With asset models, you can easily create assets of the same type
 * that have standardized definitions. Each asset created from a model inherits the asset model's
 * property and hierarchy definitions. For more information, see Defining asset models in the
 * *IoT SiteWise User Guide*.
 *
 * You can create three types of asset models, `ASSET_MODEL`,
 * `COMPONENT_MODEL`, or an `INTERFACE`.
 *
 * - **ASSET_MODEL** – (default) An asset model that
 * you can use to create assets. Can't be included as a component in another asset
 * model.
 *
 * - **COMPONENT_MODEL** – A reusable component that
 * you can include in the composite models of other asset models. You can't create
 * assets directly from this type of asset model.
 *
 * - **INTERFACE** – An interface is a type of model
 * that defines a standard structure that can be applied to different asset models.
 */
export const createAssetModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetModelRequest,
  output: CreateAssetModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all data binding usages for computation models. This allows to identify where
 * specific data bindings are being utilized across the computation models. This track
 * dependencies between data sources and computation models.
 */
export const listComputationModelDataBindingUsages =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListComputationModelDataBindingUsagesRequest,
    output: ListComputationModelDataBindingUsagesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * Sends a list of asset property values to IoT SiteWise. Each value is a timestamp-quality-value
 * (TQV) data point. For more information, see Ingesting data using the API in the
 * *IoT SiteWise User Guide*.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 *
 * With respect to Unix epoch time, IoT SiteWise accepts only TQVs that have a timestamp of no more
 * than 7 days in the past and no more than 10 minutes in the future. IoT SiteWise rejects timestamps
 * outside of the inclusive range of [-7 days, +10 minutes] and returns a
 * `TimestampOutOfRangeException` error.
 *
 * For each asset property, IoT SiteWise overwrites TQVs with duplicate timestamps unless the newer
 * TQV has a different quality. For example, if you store a TQV `{T1, GOOD, V1}`,
 * then storing `{T1, GOOD, V2}` replaces the existing TQV.
 *
 * IoT SiteWise authorizes access to each `BatchPutAssetPropertyValue` entry individually.
 * For more information, see BatchPutAssetPropertyValue authorization in the
 * *IoT SiteWise User Guide*.
 */
export const batchPutAssetPropertyValue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchPutAssetPropertyValueRequest,
    output: BatchPutAssetPropertyValueResponse,
    errors: [
      ConflictingOperationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Invokes SiteWise Assistant to start or continue a conversation.
 */
export const invokeAssistant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeAssistantRequest,
  output: InvokeAssistantResponse,
  errors: [
    AccessDeniedException,
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));

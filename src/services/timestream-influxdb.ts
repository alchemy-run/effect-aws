import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Timestream InfluxDB",
  serviceShapeName: "AmazonTimestreamInfluxDB",
});
const auth = T.AwsAuthSigv4({ name: "timestream-influxdb" });
const ver = T.ServiceVersion("2023-01-27");
const proto = T.AwsProtocolsAwsJson1_0();
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
                                url: "https://timestream-influxdb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://timestream-influxdb-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://timestream-influxdb.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://timestream-influxdb.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const VpcSubnetIdList = S.Array(S.String);
export const VpcSecurityGroupIdList = S.Array(S.String);
export const DbInstanceIdList = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class GetDbClusterInput extends S.Class<GetDbClusterInput>(
  "GetDbClusterInput",
)(
  { dbClusterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class S3Configuration extends S.Class<S3Configuration>(
  "S3Configuration",
)({ bucketName: S.String, enabled: S.Boolean }) {}
export class LogDeliveryConfiguration extends S.Class<LogDeliveryConfiguration>(
  "LogDeliveryConfiguration",
)({ s3Configuration: S3Configuration }) {}
export class UpdateDbClusterInput extends S.Class<UpdateDbClusterInput>(
  "UpdateDbClusterInput",
)(
  {
    dbClusterId: S.String,
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    dbParameterGroupIdentifier: S.optional(S.String),
    port: S.optional(S.Number),
    dbInstanceType: S.optional(S.String),
    failoverMode: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDbClusterInput extends S.Class<DeleteDbClusterInput>(
  "DeleteDbClusterInput",
)(
  { dbClusterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDbClustersInput extends S.Class<ListDbClustersInput>(
  "ListDbClustersInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDbInstancesForClusterInput extends S.Class<ListDbInstancesForClusterInput>(
  "ListDbInstancesForClusterInput",
)(
  {
    dbClusterId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootDbClusterInput extends S.Class<RebootDbClusterInput>(
  "RebootDbClusterInput",
)(
  { dbClusterId: S.String, instanceIds: S.optional(DbInstanceIdList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const RequestTagMap = S.Record({ key: S.String, value: S.String });
export class CreateDbInstanceInput extends S.Class<CreateDbInstanceInput>(
  "CreateDbInstanceInput",
)(
  {
    name: S.String,
    username: S.optional(S.String),
    password: S.String,
    organization: S.optional(S.String),
    bucket: S.optional(S.String),
    dbInstanceType: S.String,
    vpcSubnetIds: VpcSubnetIdList,
    vpcSecurityGroupIds: VpcSecurityGroupIdList,
    publiclyAccessible: S.optional(S.Boolean),
    dbStorageType: S.optional(S.String),
    allocatedStorage: S.Number,
    dbParameterGroupIdentifier: S.optional(S.String),
    deploymentType: S.optional(S.String),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    tags: S.optional(RequestTagMap),
    port: S.optional(S.Number),
    networkType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDbInstanceInput extends S.Class<GetDbInstanceInput>(
  "GetDbInstanceInput",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDbInstanceInput extends S.Class<UpdateDbInstanceInput>(
  "UpdateDbInstanceInput",
)(
  {
    identifier: S.String,
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    dbParameterGroupIdentifier: S.optional(S.String),
    port: S.optional(S.Number),
    dbInstanceType: S.optional(S.String),
    deploymentType: S.optional(S.String),
    dbStorageType: S.optional(S.String),
    allocatedStorage: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDbInstanceInput extends S.Class<DeleteDbInstanceInput>(
  "DeleteDbInstanceInput",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDbInstancesInput extends S.Class<ListDbInstancesInput>(
  "ListDbInstancesInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootDbInstanceInput extends S.Class<RebootDbInstanceInput>(
  "RebootDbInstanceInput",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDbParameterGroupInput extends S.Class<GetDbParameterGroupInput>(
  "GetDbParameterGroupInput",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDbParameterGroupsInput extends S.Class<ListDbParameterGroupsInput>(
  "ListDbParameterGroupsInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const InstanceModeList = S.Array(S.String);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: RequestTagMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class GetDbClusterOutput extends S.Class<GetDbClusterOutput>(
  "GetDbClusterOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  endpoint: S.optional(S.String),
  readerEndpoint: S.optional(S.String),
  port: S.optional(S.Number),
  deploymentType: S.optional(S.String),
  dbInstanceType: S.optional(S.String),
  networkType: S.optional(S.String),
  dbStorageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  engineType: S.optional(S.String),
  publiclyAccessible: S.optional(S.Boolean),
  dbParameterGroupIdentifier: S.optional(S.String),
  logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
  influxAuthParametersSecretArn: S.optional(S.String),
  vpcSubnetIds: S.optional(VpcSubnetIdList),
  vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  failoverMode: S.optional(S.String),
}) {}
export class UpdateDbClusterOutput extends S.Class<UpdateDbClusterOutput>(
  "UpdateDbClusterOutput",
)({ dbClusterStatus: S.optional(S.String) }) {}
export class DeleteDbClusterOutput extends S.Class<DeleteDbClusterOutput>(
  "DeleteDbClusterOutput",
)({ dbClusterStatus: S.optional(S.String) }) {}
export class RebootDbClusterOutput extends S.Class<RebootDbClusterOutput>(
  "RebootDbClusterOutput",
)({ dbClusterStatus: S.optional(S.String) }) {}
export class CreateDbInstanceOutput extends S.Class<CreateDbInstanceOutput>(
  "CreateDbInstanceOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  endpoint: S.optional(S.String),
  port: S.optional(S.Number),
  networkType: S.optional(S.String),
  dbInstanceType: S.optional(S.String),
  dbStorageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  deploymentType: S.optional(S.String),
  vpcSubnetIds: VpcSubnetIdList,
  publiclyAccessible: S.optional(S.Boolean),
  vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  dbParameterGroupIdentifier: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  secondaryAvailabilityZone: S.optional(S.String),
  logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
  influxAuthParametersSecretArn: S.optional(S.String),
  dbClusterId: S.optional(S.String),
  instanceMode: S.optional(S.String),
  instanceModes: S.optional(InstanceModeList),
}) {}
export class GetDbInstanceOutput extends S.Class<GetDbInstanceOutput>(
  "GetDbInstanceOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  endpoint: S.optional(S.String),
  port: S.optional(S.Number),
  networkType: S.optional(S.String),
  dbInstanceType: S.optional(S.String),
  dbStorageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  deploymentType: S.optional(S.String),
  vpcSubnetIds: VpcSubnetIdList,
  publiclyAccessible: S.optional(S.Boolean),
  vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  dbParameterGroupIdentifier: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  secondaryAvailabilityZone: S.optional(S.String),
  logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
  influxAuthParametersSecretArn: S.optional(S.String),
  dbClusterId: S.optional(S.String),
  instanceMode: S.optional(S.String),
  instanceModes: S.optional(InstanceModeList),
}) {}
export class UpdateDbInstanceOutput extends S.Class<UpdateDbInstanceOutput>(
  "UpdateDbInstanceOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  endpoint: S.optional(S.String),
  port: S.optional(S.Number),
  networkType: S.optional(S.String),
  dbInstanceType: S.optional(S.String),
  dbStorageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  deploymentType: S.optional(S.String),
  vpcSubnetIds: VpcSubnetIdList,
  publiclyAccessible: S.optional(S.Boolean),
  vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  dbParameterGroupIdentifier: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  secondaryAvailabilityZone: S.optional(S.String),
  logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
  influxAuthParametersSecretArn: S.optional(S.String),
  dbClusterId: S.optional(S.String),
  instanceMode: S.optional(S.String),
  instanceModes: S.optional(InstanceModeList),
}) {}
export class DeleteDbInstanceOutput extends S.Class<DeleteDbInstanceOutput>(
  "DeleteDbInstanceOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  endpoint: S.optional(S.String),
  port: S.optional(S.Number),
  networkType: S.optional(S.String),
  dbInstanceType: S.optional(S.String),
  dbStorageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  deploymentType: S.optional(S.String),
  vpcSubnetIds: VpcSubnetIdList,
  publiclyAccessible: S.optional(S.Boolean),
  vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  dbParameterGroupIdentifier: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  secondaryAvailabilityZone: S.optional(S.String),
  logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
  influxAuthParametersSecretArn: S.optional(S.String),
  dbClusterId: S.optional(S.String),
  instanceMode: S.optional(S.String),
  instanceModes: S.optional(InstanceModeList),
}) {}
export class RebootDbInstanceOutput extends S.Class<RebootDbInstanceOutput>(
  "RebootDbInstanceOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  endpoint: S.optional(S.String),
  port: S.optional(S.Number),
  networkType: S.optional(S.String),
  dbInstanceType: S.optional(S.String),
  dbStorageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  deploymentType: S.optional(S.String),
  vpcSubnetIds: VpcSubnetIdList,
  publiclyAccessible: S.optional(S.Boolean),
  vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  dbParameterGroupIdentifier: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  secondaryAvailabilityZone: S.optional(S.String),
  logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
  influxAuthParametersSecretArn: S.optional(S.String),
  dbClusterId: S.optional(S.String),
  instanceMode: S.optional(S.String),
  instanceModes: S.optional(InstanceModeList),
}) {}
export class Duration extends S.Class<Duration>("Duration")({
  durationType: S.String,
  value: S.Number,
}) {}
export class InfluxDBv2Parameters extends S.Class<InfluxDBv2Parameters>(
  "InfluxDBv2Parameters",
)({
  fluxLogEnabled: S.optional(S.Boolean),
  logLevel: S.optional(S.String),
  noTasks: S.optional(S.Boolean),
  queryConcurrency: S.optional(S.Number),
  queryQueueSize: S.optional(S.Number),
  tracingType: S.optional(S.String),
  metricsDisabled: S.optional(S.Boolean),
  httpIdleTimeout: S.optional(Duration),
  httpReadHeaderTimeout: S.optional(Duration),
  httpReadTimeout: S.optional(Duration),
  httpWriteTimeout: S.optional(Duration),
  influxqlMaxSelectBuckets: S.optional(S.Number),
  influxqlMaxSelectPoint: S.optional(S.Number),
  influxqlMaxSelectSeries: S.optional(S.Number),
  pprofDisabled: S.optional(S.Boolean),
  queryInitialMemoryBytes: S.optional(S.Number),
  queryMaxMemoryBytes: S.optional(S.Number),
  queryMemoryBytes: S.optional(S.Number),
  sessionLength: S.optional(S.Number),
  sessionRenewDisabled: S.optional(S.Boolean),
  storageCacheMaxMemorySize: S.optional(S.Number),
  storageCacheSnapshotMemorySize: S.optional(S.Number),
  storageCacheSnapshotWriteColdDuration: S.optional(Duration),
  storageCompactFullWriteColdDuration: S.optional(Duration),
  storageCompactThroughputBurst: S.optional(S.Number),
  storageMaxConcurrentCompactions: S.optional(S.Number),
  storageMaxIndexLogFileSize: S.optional(S.Number),
  storageNoValidateFieldSize: S.optional(S.Boolean),
  storageRetentionCheckInterval: S.optional(Duration),
  storageSeriesFileMaxConcurrentSnapshotCompactions: S.optional(S.Number),
  storageSeriesIdSetCacheSize: S.optional(S.Number),
  storageWalMaxConcurrentWrites: S.optional(S.Number),
  storageWalMaxWriteDelay: S.optional(Duration),
  uiDisabled: S.optional(S.Boolean),
}) {}
export const PercentOrAbsoluteLong = S.Union(
  S.Struct({ percent: S.String }),
  S.Struct({ absolute: S.Number }),
);
export class InfluxDBv3CoreParameters extends S.Class<InfluxDBv3CoreParameters>(
  "InfluxDBv3CoreParameters",
)({
  queryFileLimit: S.optional(S.Number),
  queryLogSize: S.optional(S.Number),
  logFilter: S.optional(S.String),
  logFormat: S.optional(S.String),
  dataFusionNumThreads: S.optional(S.Number),
  dataFusionRuntimeType: S.optional(S.String),
  dataFusionRuntimeDisableLifoSlot: S.optional(S.Boolean),
  dataFusionRuntimeEventInterval: S.optional(S.Number),
  dataFusionRuntimeGlobalQueueInterval: S.optional(S.Number),
  dataFusionRuntimeMaxBlockingThreads: S.optional(S.Number),
  dataFusionRuntimeMaxIoEventsPerTick: S.optional(S.Number),
  dataFusionRuntimeThreadKeepAlive: S.optional(Duration),
  dataFusionRuntimeThreadPriority: S.optional(S.Number),
  dataFusionMaxParquetFanout: S.optional(S.Number),
  dataFusionUseCachedParquetLoader: S.optional(S.Boolean),
  dataFusionConfig: S.optional(S.String),
  maxHttpRequestSize: S.optional(S.Number),
  forceSnapshotMemThreshold: S.optional(PercentOrAbsoluteLong),
  walSnapshotSize: S.optional(S.Number),
  walMaxWriteBufferSize: S.optional(S.Number),
  snapshottedWalFilesToKeep: S.optional(S.Number),
  preemptiveCacheAge: S.optional(Duration),
  parquetMemCachePrunePercentage: S.optional(S.Number),
  parquetMemCachePruneInterval: S.optional(Duration),
  disableParquetMemCache: S.optional(S.Boolean),
  parquetMemCacheQueryPathDuration: S.optional(Duration),
  lastCacheEvictionInterval: S.optional(Duration),
  distinctCacheEvictionInterval: S.optional(Duration),
  gen1Duration: S.optional(Duration),
  execMemPoolBytes: S.optional(PercentOrAbsoluteLong),
  parquetMemCacheSize: S.optional(PercentOrAbsoluteLong),
  walReplayFailOnError: S.optional(S.Boolean),
  walReplayConcurrencyLimit: S.optional(S.Number),
  tableIndexCacheMaxEntries: S.optional(S.Number),
  tableIndexCacheConcurrencyLimit: S.optional(S.Number),
  gen1LookbackDuration: S.optional(Duration),
  retentionCheckInterval: S.optional(Duration),
  deleteGracePeriod: S.optional(Duration),
  hardDeleteDefaultDuration: S.optional(Duration),
}) {}
export class InfluxDBv3EnterpriseParameters extends S.Class<InfluxDBv3EnterpriseParameters>(
  "InfluxDBv3EnterpriseParameters",
)({
  queryFileLimit: S.optional(S.Number),
  queryLogSize: S.optional(S.Number),
  logFilter: S.optional(S.String),
  logFormat: S.optional(S.String),
  dataFusionNumThreads: S.optional(S.Number),
  dataFusionRuntimeType: S.optional(S.String),
  dataFusionRuntimeDisableLifoSlot: S.optional(S.Boolean),
  dataFusionRuntimeEventInterval: S.optional(S.Number),
  dataFusionRuntimeGlobalQueueInterval: S.optional(S.Number),
  dataFusionRuntimeMaxBlockingThreads: S.optional(S.Number),
  dataFusionRuntimeMaxIoEventsPerTick: S.optional(S.Number),
  dataFusionRuntimeThreadKeepAlive: S.optional(Duration),
  dataFusionRuntimeThreadPriority: S.optional(S.Number),
  dataFusionMaxParquetFanout: S.optional(S.Number),
  dataFusionUseCachedParquetLoader: S.optional(S.Boolean),
  dataFusionConfig: S.optional(S.String),
  maxHttpRequestSize: S.optional(S.Number),
  forceSnapshotMemThreshold: S.optional(PercentOrAbsoluteLong),
  walSnapshotSize: S.optional(S.Number),
  walMaxWriteBufferSize: S.optional(S.Number),
  snapshottedWalFilesToKeep: S.optional(S.Number),
  preemptiveCacheAge: S.optional(Duration),
  parquetMemCachePrunePercentage: S.optional(S.Number),
  parquetMemCachePruneInterval: S.optional(Duration),
  disableParquetMemCache: S.optional(S.Boolean),
  parquetMemCacheQueryPathDuration: S.optional(Duration),
  lastCacheEvictionInterval: S.optional(Duration),
  distinctCacheEvictionInterval: S.optional(Duration),
  gen1Duration: S.optional(Duration),
  execMemPoolBytes: S.optional(PercentOrAbsoluteLong),
  parquetMemCacheSize: S.optional(PercentOrAbsoluteLong),
  walReplayFailOnError: S.optional(S.Boolean),
  walReplayConcurrencyLimit: S.optional(S.Number),
  tableIndexCacheMaxEntries: S.optional(S.Number),
  tableIndexCacheConcurrencyLimit: S.optional(S.Number),
  gen1LookbackDuration: S.optional(Duration),
  retentionCheckInterval: S.optional(Duration),
  deleteGracePeriod: S.optional(Duration),
  hardDeleteDefaultDuration: S.optional(Duration),
  ingestQueryInstances: S.Number,
  queryOnlyInstances: S.Number,
  dedicatedCompactor: S.Boolean,
  compactionRowLimit: S.optional(S.Number),
  compactionMaxNumFilesPerPlan: S.optional(S.Number),
  compactionGen2Duration: S.optional(Duration),
  compactionMultipliers: S.optional(S.String),
  compactionCleanupWait: S.optional(Duration),
  compactionCheckInterval: S.optional(Duration),
  lastValueCacheDisableFromHistory: S.optional(S.Boolean),
  distinctValueCacheDisableFromHistory: S.optional(S.Boolean),
  replicationInterval: S.optional(Duration),
  catalogSyncInterval: S.optional(Duration),
}) {}
export const Parameters = S.Union(
  S.Struct({ InfluxDBv2: InfluxDBv2Parameters }),
  S.Struct({ InfluxDBv3Core: InfluxDBv3CoreParameters }),
  S.Struct({ InfluxDBv3Enterprise: InfluxDBv3EnterpriseParameters }),
);
export class GetDbParameterGroupOutput extends S.Class<GetDbParameterGroupOutput>(
  "GetDbParameterGroupOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  description: S.optional(S.String),
  parameters: S.optional(Parameters),
}) {}
export const ResponseTagMap = S.Record({ key: S.String, value: S.String });
export class DbClusterSummary extends S.Class<DbClusterSummary>(
  "DbClusterSummary",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  endpoint: S.optional(S.String),
  readerEndpoint: S.optional(S.String),
  port: S.optional(S.Number),
  deploymentType: S.optional(S.String),
  dbInstanceType: S.optional(S.String),
  networkType: S.optional(S.String),
  dbStorageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  engineType: S.optional(S.String),
}) {}
export const DbClusterSummaryList = S.Array(DbClusterSummary);
export class DbInstanceForClusterSummary extends S.Class<DbInstanceForClusterSummary>(
  "DbInstanceForClusterSummary",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  endpoint: S.optional(S.String),
  port: S.optional(S.Number),
  networkType: S.optional(S.String),
  dbInstanceType: S.optional(S.String),
  dbStorageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  deploymentType: S.optional(S.String),
  instanceMode: S.optional(S.String),
  instanceModes: S.optional(InstanceModeList),
}) {}
export const DbInstanceForClusterSummaryList = S.Array(
  DbInstanceForClusterSummary,
);
export class DbInstanceSummary extends S.Class<DbInstanceSummary>(
  "DbInstanceSummary",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  endpoint: S.optional(S.String),
  port: S.optional(S.Number),
  networkType: S.optional(S.String),
  dbInstanceType: S.optional(S.String),
  dbStorageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  deploymentType: S.optional(S.String),
}) {}
export const DbInstanceSummaryList = S.Array(DbInstanceSummary);
export class DbParameterGroupSummary extends S.Class<DbParameterGroupSummary>(
  "DbParameterGroupSummary",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  description: S.optional(S.String),
}) {}
export const DbParameterGroupSummaryList = S.Array(DbParameterGroupSummary);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(ResponseTagMap) }) {}
export class CreateDbClusterInput extends S.Class<CreateDbClusterInput>(
  "CreateDbClusterInput",
)(
  {
    name: S.String,
    username: S.optional(S.String),
    password: S.optional(S.String),
    organization: S.optional(S.String),
    bucket: S.optional(S.String),
    port: S.optional(S.Number),
    dbParameterGroupIdentifier: S.optional(S.String),
    dbInstanceType: S.String,
    dbStorageType: S.optional(S.String),
    allocatedStorage: S.optional(S.Number),
    networkType: S.optional(S.String),
    publiclyAccessible: S.optional(S.Boolean),
    vpcSubnetIds: VpcSubnetIdList,
    vpcSecurityGroupIds: VpcSecurityGroupIdList,
    deploymentType: S.optional(S.String),
    failoverMode: S.optional(S.String),
    logDeliveryConfiguration: S.optional(LogDeliveryConfiguration),
    tags: S.optional(RequestTagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDbClustersOutput extends S.Class<ListDbClustersOutput>(
  "ListDbClustersOutput",
)({ items: DbClusterSummaryList, nextToken: S.optional(S.String) }) {}
export class ListDbInstancesForClusterOutput extends S.Class<ListDbInstancesForClusterOutput>(
  "ListDbInstancesForClusterOutput",
)({
  items: DbInstanceForClusterSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListDbInstancesOutput extends S.Class<ListDbInstancesOutput>(
  "ListDbInstancesOutput",
)({ items: DbInstanceSummaryList, nextToken: S.optional(S.String) }) {}
export class ListDbParameterGroupsOutput extends S.Class<ListDbParameterGroupsOutput>(
  "ListDbParameterGroupsOutput",
)({ items: DbParameterGroupSummaryList, nextToken: S.optional(S.String) }) {}
export class CreateDbClusterOutput extends S.Class<CreateDbClusterOutput>(
  "CreateDbClusterOutput",
)({
  dbClusterId: S.optional(S.String),
  dbClusterStatus: S.optional(S.String),
}) {}
export class CreateDbParameterGroupInput extends S.Class<CreateDbParameterGroupInput>(
  "CreateDbParameterGroupInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    parameters: S.optional(Parameters),
    tags: S.optional(RequestTagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDbParameterGroupOutput extends S.Class<CreateDbParameterGroupOutput>(
  "CreateDbParameterGroupOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  description: S.optional(S.String),
  parameters: S.optional(Parameters),
}) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
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
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String, reason: S.String },
) {}

//# Operations
/**
 * Removes the tag from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * A list of tags applied to the resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Tags are composed of a Key/Value pairs. You can use tags to categorize and track your Timestream for InfluxDB resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * Retrieves information about a Timestream for InfluxDB cluster.
 */
export const getDbCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDbClusterInput,
  output: GetDbClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Timestream for InfluxDB DB parameter group to associate with DB instances.
 */
export const createDbParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDbParameterGroupInput,
    output: CreateDbParameterGroupOutput,
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
 * Updates a Timestream for InfluxDB cluster.
 */
export const updateDbCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDbClusterInput,
  output: UpdateDbClusterOutput,
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
 * Returns a list of Timestream for InfluxDB DB clusters.
 */
export const listDbClusters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDbClustersInput,
    output: ListDbClustersOutput,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of Timestream for InfluxDB clusters.
 */
export const listDbInstancesForCluster =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDbInstancesForClusterInput,
    output: ListDbInstancesForClusterOutput,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of Timestream for InfluxDB DB instances.
 */
export const listDbInstances = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDbInstancesInput,
    output: ListDbInstancesOutput,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of Timestream for InfluxDB DB parameter groups.
 */
export const listDbParameterGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDbParameterGroupsInput,
    output: ListDbParameterGroupsOutput,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a Timestream for InfluxDB DB instance.
 */
export const getDbInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDbInstanceInput,
  output: GetDbInstanceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a Timestream for InfluxDB DB parameter group.
 */
export const getDbParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDbParameterGroupInput,
  output: GetDbParameterGroupOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a Timestream for InfluxDB cluster.
 */
export const deleteDbCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDbClusterInput,
  output: DeleteDbClusterOutput,
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
 * Reboots a Timestream for InfluxDB cluster.
 */
export const rebootDbCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDbClusterInput,
  output: RebootDbClusterOutput,
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
 * Creates a new Timestream for InfluxDB DB instance.
 */
export const createDbInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDbInstanceInput,
  output: CreateDbInstanceOutput,
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
 * Updates a Timestream for InfluxDB DB instance.
 */
export const updateDbInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDbInstanceInput,
  output: UpdateDbInstanceOutput,
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
 * Deletes a Timestream for InfluxDB DB instance.
 */
export const deleteDbInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDbInstanceInput,
  output: DeleteDbInstanceOutput,
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
 * Reboots a Timestream for InfluxDB instance.
 */
export const rebootDbInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDbInstanceInput,
  output: RebootDbInstanceOutput,
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
 * Creates a new Timestream for InfluxDB cluster.
 */
export const createDbCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDbClusterInput,
  output: CreateDbClusterOutput,
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

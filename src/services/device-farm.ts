import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://devicefarm.amazonaws.com/doc/2015-06-23/");
const svc = T.AwsApiService({
  sdkId: "Device Farm",
  serviceShapeName: "DeviceFarm_20150623",
});
const auth = T.AwsAuthSigv4({ name: "devicefarm" });
const ver = T.ServiceVersion("2015-06-23");
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
                        url: "https://devicefarm-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://devicefarm-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://devicefarm.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://devicefarm.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetAccountSettingsRequest extends S.Class<GetAccountSettingsRequest>(
  "GetAccountSettingsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const PackageIds = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const InstanceLabels = S.Array(S.String);
export class CreateInstanceProfileRequest extends S.Class<CreateInstanceProfileRequest>(
  "CreateInstanceProfileRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    packageCleanup: S.optional(S.Boolean),
    excludeAppPackagesFromCleanup: S.optional(PackageIds),
    rebootAfterUse: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateNetworkProfileRequest extends S.Class<CreateNetworkProfileRequest>(
  "CreateNetworkProfileRequest",
)(
  {
    projectArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    type: S.optional(S.String),
    uplinkBandwidthBits: S.optional(S.Number),
    downlinkBandwidthBits: S.optional(S.Number),
    uplinkDelayMs: S.optional(S.Number),
    downlinkDelayMs: S.optional(S.Number),
    uplinkJitterMs: S.optional(S.Number),
    downlinkJitterMs: S.optional(S.Number),
    uplinkLossPercent: S.optional(S.Number),
    downlinkLossPercent: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTestGridUrlRequest extends S.Class<CreateTestGridUrlRequest>(
  "CreateTestGridUrlRequest",
)(
  { projectArn: S.String, expiresInSeconds: S.Number },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUploadRequest extends S.Class<CreateUploadRequest>(
  "CreateUploadRequest",
)(
  {
    projectArn: S.String,
    name: S.String,
    type: S.String,
    contentType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVPCEConfigurationRequest extends S.Class<CreateVPCEConfigurationRequest>(
  "CreateVPCEConfigurationRequest",
)(
  {
    vpceConfigurationName: S.String,
    vpceServiceName: S.String,
    serviceDnsName: S.String,
    vpceConfigurationDescription: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDevicePoolRequest extends S.Class<DeleteDevicePoolRequest>(
  "DeleteDevicePoolRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDevicePoolResult extends S.Class<DeleteDevicePoolResult>(
  "DeleteDevicePoolResult",
)({}, ns) {}
export class DeleteInstanceProfileRequest extends S.Class<DeleteInstanceProfileRequest>(
  "DeleteInstanceProfileRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInstanceProfileResult extends S.Class<DeleteInstanceProfileResult>(
  "DeleteInstanceProfileResult",
)({}, ns) {}
export class DeleteNetworkProfileRequest extends S.Class<DeleteNetworkProfileRequest>(
  "DeleteNetworkProfileRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNetworkProfileResult extends S.Class<DeleteNetworkProfileResult>(
  "DeleteNetworkProfileResult",
)({}, ns) {}
export class DeleteProjectRequest extends S.Class<DeleteProjectRequest>(
  "DeleteProjectRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProjectResult extends S.Class<DeleteProjectResult>(
  "DeleteProjectResult",
)({}, ns) {}
export class DeleteRemoteAccessSessionRequest extends S.Class<DeleteRemoteAccessSessionRequest>(
  "DeleteRemoteAccessSessionRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRemoteAccessSessionResult extends S.Class<DeleteRemoteAccessSessionResult>(
  "DeleteRemoteAccessSessionResult",
)({}, ns) {}
export class DeleteRunRequest extends S.Class<DeleteRunRequest>(
  "DeleteRunRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRunResult extends S.Class<DeleteRunResult>(
  "DeleteRunResult",
)({}, ns) {}
export class DeleteTestGridProjectRequest extends S.Class<DeleteTestGridProjectRequest>(
  "DeleteTestGridProjectRequest",
)(
  { projectArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTestGridProjectResult extends S.Class<DeleteTestGridProjectResult>(
  "DeleteTestGridProjectResult",
)({}, ns) {}
export class DeleteUploadRequest extends S.Class<DeleteUploadRequest>(
  "DeleteUploadRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUploadResult extends S.Class<DeleteUploadResult>(
  "DeleteUploadResult",
)({}, ns) {}
export class DeleteVPCEConfigurationRequest extends S.Class<DeleteVPCEConfigurationRequest>(
  "DeleteVPCEConfigurationRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVPCEConfigurationResult extends S.Class<DeleteVPCEConfigurationResult>(
  "DeleteVPCEConfigurationResult",
)({}, ns) {}
export class GetDeviceRequest extends S.Class<GetDeviceRequest>(
  "GetDeviceRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeviceInstanceRequest extends S.Class<GetDeviceInstanceRequest>(
  "GetDeviceInstanceRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDevicePoolRequest extends S.Class<GetDevicePoolRequest>(
  "GetDevicePoolRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInstanceProfileRequest extends S.Class<GetInstanceProfileRequest>(
  "GetInstanceProfileRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetJobRequest extends S.Class<GetJobRequest>("GetJobRequest")(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetNetworkProfileRequest extends S.Class<GetNetworkProfileRequest>(
  "GetNetworkProfileRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOfferingStatusRequest extends S.Class<GetOfferingStatusRequest>(
  "GetOfferingStatusRequest",
)(
  { nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetProjectRequest extends S.Class<GetProjectRequest>(
  "GetProjectRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRemoteAccessSessionRequest extends S.Class<GetRemoteAccessSessionRequest>(
  "GetRemoteAccessSessionRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRunRequest extends S.Class<GetRunRequest>("GetRunRequest")(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSuiteRequest extends S.Class<GetSuiteRequest>(
  "GetSuiteRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTestRequest extends S.Class<GetTestRequest>("GetTestRequest")(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTestGridProjectRequest extends S.Class<GetTestGridProjectRequest>(
  "GetTestGridProjectRequest",
)(
  { projectArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTestGridSessionRequest extends S.Class<GetTestGridSessionRequest>(
  "GetTestGridSessionRequest",
)(
  {
    projectArn: S.optional(S.String),
    sessionId: S.optional(S.String),
    sessionArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUploadRequest extends S.Class<GetUploadRequest>(
  "GetUploadRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetVPCEConfigurationRequest extends S.Class<GetVPCEConfigurationRequest>(
  "GetVPCEConfigurationRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InstallToRemoteAccessSessionRequest extends S.Class<InstallToRemoteAccessSessionRequest>(
  "InstallToRemoteAccessSessionRequest",
)(
  { remoteAccessSessionArn: S.String, appArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListArtifactsRequest extends S.Class<ListArtifactsRequest>(
  "ListArtifactsRequest",
)(
  { arn: S.String, type: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDeviceInstancesRequest extends S.Class<ListDeviceInstancesRequest>(
  "ListDeviceInstancesRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDevicePoolsRequest extends S.Class<ListDevicePoolsRequest>(
  "ListDevicePoolsRequest",
)(
  {
    arn: S.String,
    type: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstanceProfilesRequest extends S.Class<ListInstanceProfilesRequest>(
  "ListInstanceProfilesRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListJobsRequest extends S.Class<ListJobsRequest>(
  "ListJobsRequest",
)(
  { arn: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListNetworkProfilesRequest extends S.Class<ListNetworkProfilesRequest>(
  "ListNetworkProfilesRequest",
)(
  {
    arn: S.String,
    type: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOfferingPromotionsRequest extends S.Class<ListOfferingPromotionsRequest>(
  "ListOfferingPromotionsRequest",
)(
  { nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOfferingsRequest extends S.Class<ListOfferingsRequest>(
  "ListOfferingsRequest",
)(
  { nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOfferingTransactionsRequest extends S.Class<ListOfferingTransactionsRequest>(
  "ListOfferingTransactionsRequest",
)(
  { nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProjectsRequest extends S.Class<ListProjectsRequest>(
  "ListProjectsRequest",
)(
  { arn: S.optional(S.String), nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRemoteAccessSessionsRequest extends S.Class<ListRemoteAccessSessionsRequest>(
  "ListRemoteAccessSessionsRequest",
)(
  { arn: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRunsRequest extends S.Class<ListRunsRequest>(
  "ListRunsRequest",
)(
  { arn: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSamplesRequest extends S.Class<ListSamplesRequest>(
  "ListSamplesRequest",
)(
  { arn: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSuitesRequest extends S.Class<ListSuitesRequest>(
  "ListSuitesRequest",
)(
  { arn: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTestGridProjectsRequest extends S.Class<ListTestGridProjectsRequest>(
  "ListTestGridProjectsRequest",
)(
  { maxResult: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTestGridSessionActionsRequest extends S.Class<ListTestGridSessionActionsRequest>(
  "ListTestGridSessionActionsRequest",
)(
  {
    sessionArn: S.String,
    maxResult: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTestGridSessionArtifactsRequest extends S.Class<ListTestGridSessionArtifactsRequest>(
  "ListTestGridSessionArtifactsRequest",
)(
  {
    sessionArn: S.String,
    type: S.optional(S.String),
    maxResult: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTestGridSessionsRequest extends S.Class<ListTestGridSessionsRequest>(
  "ListTestGridSessionsRequest",
)(
  {
    projectArn: S.String,
    status: S.optional(S.String),
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    endTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    maxResult: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTestsRequest extends S.Class<ListTestsRequest>(
  "ListTestsRequest",
)(
  { arn: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUniqueProblemsRequest extends S.Class<ListUniqueProblemsRequest>(
  "ListUniqueProblemsRequest",
)(
  { arn: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUploadsRequest extends S.Class<ListUploadsRequest>(
  "ListUploadsRequest",
)(
  {
    arn: S.String,
    type: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVPCEConfigurationsRequest extends S.Class<ListVPCEConfigurationsRequest>(
  "ListVPCEConfigurationsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PurchaseOfferingRequest extends S.Class<PurchaseOfferingRequest>(
  "PurchaseOfferingRequest",
)(
  {
    offeringId: S.String,
    quantity: S.Number,
    offeringPromotionId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RenewOfferingRequest extends S.Class<RenewOfferingRequest>(
  "RenewOfferingRequest",
)(
  { offeringId: S.String, quantity: S.Number },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopJobRequest extends S.Class<StopJobRequest>("StopJobRequest")(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopRemoteAccessSessionRequest extends S.Class<StopRemoteAccessSessionRequest>(
  "StopRemoteAccessSessionRequest",
)(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopRunRequest extends S.Class<StopRunRequest>("StopRunRequest")(
  { arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class UpdateDeviceInstanceRequest extends S.Class<UpdateDeviceInstanceRequest>(
  "UpdateDeviceInstanceRequest",
)(
  {
    arn: S.String,
    profileArn: S.optional(S.String),
    labels: S.optional(InstanceLabels),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Rule extends S.Class<Rule>("Rule")({
  attribute: S.optional(S.String),
  operator: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const Rules = S.Array(Rule);
export class UpdateDevicePoolRequest extends S.Class<UpdateDevicePoolRequest>(
  "UpdateDevicePoolRequest",
)(
  {
    arn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    rules: S.optional(Rules),
    maxDevices: S.optional(S.Number),
    clearMaxDevices: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateInstanceProfileRequest extends S.Class<UpdateInstanceProfileRequest>(
  "UpdateInstanceProfileRequest",
)(
  {
    arn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    packageCleanup: S.optional(S.Boolean),
    excludeAppPackagesFromCleanup: S.optional(PackageIds),
    rebootAfterUse: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNetworkProfileRequest extends S.Class<UpdateNetworkProfileRequest>(
  "UpdateNetworkProfileRequest",
)(
  {
    arn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    type: S.optional(S.String),
    uplinkBandwidthBits: S.optional(S.Number),
    downlinkBandwidthBits: S.optional(S.Number),
    uplinkDelayMs: S.optional(S.Number),
    downlinkDelayMs: S.optional(S.Number),
    uplinkJitterMs: S.optional(S.Number),
    downlinkJitterMs: S.optional(S.Number),
    uplinkLossPercent: S.optional(S.Number),
    downlinkLossPercent: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const VpcSecurityGroupIds = S.Array(S.String);
export const VpcSubnetIds = S.Array(S.String);
export class VpcConfig extends S.Class<VpcConfig>("VpcConfig")({
  securityGroupIds: VpcSecurityGroupIds,
  subnetIds: VpcSubnetIds,
  vpcId: S.String,
}) {}
export class EnvironmentVariable extends S.Class<EnvironmentVariable>(
  "EnvironmentVariable",
)({ name: S.String, value: S.String }) {}
export const EnvironmentVariables = S.Array(EnvironmentVariable);
export class UpdateProjectRequest extends S.Class<UpdateProjectRequest>(
  "UpdateProjectRequest",
)(
  {
    arn: S.String,
    name: S.optional(S.String),
    defaultJobTimeoutMinutes: S.optional(S.Number),
    vpcConfig: S.optional(VpcConfig),
    environmentVariables: S.optional(EnvironmentVariables),
    executionRoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const SecurityGroupIds = S.Array(S.String);
export const SubnetIds = S.Array(S.String);
export class TestGridVpcConfig extends S.Class<TestGridVpcConfig>(
  "TestGridVpcConfig",
)({
  securityGroupIds: SecurityGroupIds,
  subnetIds: SubnetIds,
  vpcId: S.String,
}) {}
export class UpdateTestGridProjectRequest extends S.Class<UpdateTestGridProjectRequest>(
  "UpdateTestGridProjectRequest",
)(
  {
    projectArn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    vpcConfig: S.optional(TestGridVpcConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateUploadRequest extends S.Class<UpdateUploadRequest>(
  "UpdateUploadRequest",
)(
  {
    arn: S.String,
    name: S.optional(S.String),
    contentType: S.optional(S.String),
    editContent: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateVPCEConfigurationRequest extends S.Class<UpdateVPCEConfigurationRequest>(
  "UpdateVPCEConfigurationRequest",
)(
  {
    arn: S.String,
    vpceConfigurationName: S.optional(S.String),
    vpceServiceName: S.optional(S.String),
    serviceDnsName: S.optional(S.String),
    vpceConfigurationDescription: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const AuxiliaryAppArnList = S.Array(S.String);
export const AmazonResourceNames = S.Array(S.String);
export const DeviceFilterValues = S.Array(S.String);
export class InstanceProfile extends S.Class<InstanceProfile>(
  "InstanceProfile",
)({
  arn: S.optional(S.String),
  packageCleanup: S.optional(S.Boolean),
  excludeAppPackagesFromCleanup: S.optional(PackageIds),
  rebootAfterUse: S.optional(S.Boolean),
  name: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class DeviceInstance extends S.Class<DeviceInstance>("DeviceInstance")({
  arn: S.optional(S.String),
  deviceArn: S.optional(S.String),
  labels: S.optional(InstanceLabels),
  status: S.optional(S.String),
  udid: S.optional(S.String),
  instanceProfile: S.optional(InstanceProfile),
}) {}
export const DeviceInstances = S.Array(DeviceInstance);
export class DevicePool extends S.Class<DevicePool>("DevicePool")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  type: S.optional(S.String),
  rules: S.optional(Rules),
  maxDevices: S.optional(S.Number),
}) {}
export const DevicePools = S.Array(DevicePool);
export class DeviceFilter extends S.Class<DeviceFilter>("DeviceFilter")({
  attribute: S.String,
  operator: S.String,
  values: DeviceFilterValues,
}) {}
export const DeviceFilters = S.Array(DeviceFilter);
export const InstanceProfiles = S.Array(InstanceProfile);
export class Counters extends S.Class<Counters>("Counters")({
  total: S.optional(S.Number),
  passed: S.optional(S.Number),
  failed: S.optional(S.Number),
  warned: S.optional(S.Number),
  errored: S.optional(S.Number),
  stopped: S.optional(S.Number),
  skipped: S.optional(S.Number),
}) {}
export class CPU extends S.Class<CPU>("CPU")({
  frequency: S.optional(S.String),
  architecture: S.optional(S.String),
  clock: S.optional(S.Number),
}) {}
export class Resolution extends S.Class<Resolution>("Resolution")({
  width: S.optional(S.Number),
  height: S.optional(S.Number),
}) {}
export class Device extends S.Class<Device>("Device")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  manufacturer: S.optional(S.String),
  model: S.optional(S.String),
  modelId: S.optional(S.String),
  formFactor: S.optional(S.String),
  platform: S.optional(S.String),
  os: S.optional(S.String),
  cpu: S.optional(CPU),
  resolution: S.optional(Resolution),
  heapSize: S.optional(S.Number),
  memory: S.optional(S.Number),
  image: S.optional(S.String),
  carrier: S.optional(S.String),
  radio: S.optional(S.String),
  remoteAccessEnabled: S.optional(S.Boolean),
  remoteDebugEnabled: S.optional(S.Boolean),
  fleetType: S.optional(S.String),
  fleetName: S.optional(S.String),
  instances: S.optional(DeviceInstances),
  availability: S.optional(S.String),
}) {}
export class DeviceMinutes extends S.Class<DeviceMinutes>("DeviceMinutes")({
  total: S.optional(S.Number),
  metered: S.optional(S.Number),
  unmetered: S.optional(S.Number),
}) {}
export class Job extends S.Class<Job>("Job")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  result: S.optional(S.String),
  started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  counters: S.optional(Counters),
  message: S.optional(S.String),
  device: S.optional(Device),
  instanceArn: S.optional(S.String),
  deviceMinutes: S.optional(DeviceMinutes),
  videoEndpoint: S.optional(S.String),
  videoCapture: S.optional(S.Boolean),
}) {}
export const Jobs = S.Array(Job);
export class NetworkProfile extends S.Class<NetworkProfile>("NetworkProfile")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  type: S.optional(S.String),
  uplinkBandwidthBits: S.optional(S.Number),
  downlinkBandwidthBits: S.optional(S.Number),
  uplinkDelayMs: S.optional(S.Number),
  downlinkDelayMs: S.optional(S.Number),
  uplinkJitterMs: S.optional(S.Number),
  downlinkJitterMs: S.optional(S.Number),
  uplinkLossPercent: S.optional(S.Number),
  downlinkLossPercent: S.optional(S.Number),
}) {}
export const NetworkProfiles = S.Array(NetworkProfile);
export class Project extends S.Class<Project>("Project")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  defaultJobTimeoutMinutes: S.optional(S.Number),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  vpcConfig: S.optional(VpcConfig),
  environmentVariables: S.optional(EnvironmentVariables),
  executionRoleArn: S.optional(S.String),
}) {}
export const Projects = S.Array(Project);
export class DeviceProxy extends S.Class<DeviceProxy>("DeviceProxy")({
  host: S.String,
  port: S.Number,
}) {}
export class RemoteAccessEndpoints extends S.Class<RemoteAccessEndpoints>(
  "RemoteAccessEndpoints",
)({
  remoteDriverEndpoint: S.optional(S.String),
  interactiveEndpoint: S.optional(S.String),
}) {}
export class RemoteAccessSession extends S.Class<RemoteAccessSession>(
  "RemoteAccessSession",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  result: S.optional(S.String),
  message: S.optional(S.String),
  started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  device: S.optional(Device),
  instanceArn: S.optional(S.String),
  billingMethod: S.optional(S.String),
  deviceMinutes: S.optional(DeviceMinutes),
  endpoint: S.optional(S.String),
  deviceUdid: S.optional(S.String),
  interactionMode: S.optional(S.String),
  skipAppResign: S.optional(S.Boolean),
  vpcConfig: S.optional(VpcConfig),
  deviceProxy: S.optional(DeviceProxy),
  appUpload: S.optional(S.String),
  endpoints: S.optional(RemoteAccessEndpoints),
}) {}
export const RemoteAccessSessions = S.Array(RemoteAccessSession);
export class Radios extends S.Class<Radios>("Radios")({
  wifi: S.optional(S.Boolean),
  bluetooth: S.optional(S.Boolean),
  nfc: S.optional(S.Boolean),
  gps: S.optional(S.Boolean),
}) {}
export class Location extends S.Class<Location>("Location")({
  latitude: S.Number,
  longitude: S.Number,
}) {}
export const IosPaths = S.Array(S.String);
export const AndroidPaths = S.Array(S.String);
export const DeviceHostPaths = S.Array(S.String);
export class CustomerArtifactPaths extends S.Class<CustomerArtifactPaths>(
  "CustomerArtifactPaths",
)({
  iosPaths: S.optional(IosPaths),
  androidPaths: S.optional(AndroidPaths),
  deviceHostPaths: S.optional(DeviceHostPaths),
}) {}
export class DeviceSelectionResult extends S.Class<DeviceSelectionResult>(
  "DeviceSelectionResult",
)({
  filters: S.optional(DeviceFilters),
  matchedDevicesCount: S.optional(S.Number),
  maxDevices: S.optional(S.Number),
}) {}
export class Run extends S.Class<Run>("Run")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  platform: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  result: S.optional(S.String),
  started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  counters: S.optional(Counters),
  message: S.optional(S.String),
  totalJobs: S.optional(S.Number),
  completedJobs: S.optional(S.Number),
  billingMethod: S.optional(S.String),
  deviceMinutes: S.optional(DeviceMinutes),
  networkProfile: S.optional(NetworkProfile),
  deviceProxy: S.optional(DeviceProxy),
  parsingResultUrl: S.optional(S.String),
  resultCode: S.optional(S.String),
  seed: S.optional(S.Number),
  appUpload: S.optional(S.String),
  eventCount: S.optional(S.Number),
  jobTimeoutMinutes: S.optional(S.Number),
  devicePoolArn: S.optional(S.String),
  locale: S.optional(S.String),
  radios: S.optional(Radios),
  location: S.optional(Location),
  customerArtifactPaths: S.optional(CustomerArtifactPaths),
  webUrl: S.optional(S.String),
  skipAppResign: S.optional(S.Boolean),
  testSpecArn: S.optional(S.String),
  deviceSelectionResult: S.optional(DeviceSelectionResult),
  vpcConfig: S.optional(VpcConfig),
  executionRoleArn: S.optional(S.String),
  environmentVariables: S.optional(EnvironmentVariables),
}) {}
export const Runs = S.Array(Run);
export class Suite extends S.Class<Suite>("Suite")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  result: S.optional(S.String),
  started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  counters: S.optional(Counters),
  message: S.optional(S.String),
  deviceMinutes: S.optional(DeviceMinutes),
}) {}
export const Suites = S.Array(Suite);
export class TestGridProject extends S.Class<TestGridProject>(
  "TestGridProject",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  vpcConfig: S.optional(TestGridVpcConfig),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TestGridProjects = S.Array(TestGridProject);
export class TestGridSession extends S.Class<TestGridSession>(
  "TestGridSession",
)({
  arn: S.optional(S.String),
  status: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ended: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  billingMinutes: S.optional(S.Number),
  seleniumProperties: S.optional(S.String),
}) {}
export const TestGridSessions = S.Array(TestGridSession);
export class Test extends S.Class<Test>("Test")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  result: S.optional(S.String),
  started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  counters: S.optional(Counters),
  message: S.optional(S.String),
  deviceMinutes: S.optional(DeviceMinutes),
}) {}
export const Tests = S.Array(Test);
export class Upload extends S.Class<Upload>("Upload")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  type: S.optional(S.String),
  status: S.optional(S.String),
  url: S.optional(S.String),
  metadata: S.optional(S.String),
  contentType: S.optional(S.String),
  message: S.optional(S.String),
  category: S.optional(S.String),
}) {}
export const Uploads = S.Array(Upload);
export class VPCEConfiguration extends S.Class<VPCEConfiguration>(
  "VPCEConfiguration",
)({
  arn: S.optional(S.String),
  vpceConfigurationName: S.optional(S.String),
  vpceServiceName: S.optional(S.String),
  serviceDnsName: S.optional(S.String),
  vpceConfigurationDescription: S.optional(S.String),
}) {}
export const VPCEConfigurations = S.Array(VPCEConfiguration);
export class DeviceSelectionConfiguration extends S.Class<DeviceSelectionConfiguration>(
  "DeviceSelectionConfiguration",
)({ filters: DeviceFilters, maxDevices: S.Number }) {}
export class ExecutionConfiguration extends S.Class<ExecutionConfiguration>(
  "ExecutionConfiguration",
)({
  jobTimeoutMinutes: S.optional(S.Number),
  accountsCleanup: S.optional(S.Boolean),
  appPackagesCleanup: S.optional(S.Boolean),
  videoCapture: S.optional(S.Boolean),
  skipAppResign: S.optional(S.Boolean),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateDevicePoolRequest extends S.Class<CreateDevicePoolRequest>(
  "CreateDevicePoolRequest",
)(
  {
    projectArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    rules: Rules,
    maxDevices: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProjectRequest extends S.Class<CreateProjectRequest>(
  "CreateProjectRequest",
)(
  {
    name: S.String,
    defaultJobTimeoutMinutes: S.optional(S.Number),
    vpcConfig: S.optional(VpcConfig),
    environmentVariables: S.optional(EnvironmentVariables),
    executionRoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTestGridProjectRequest extends S.Class<CreateTestGridProjectRequest>(
  "CreateTestGridProjectRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    vpcConfig: S.optional(TestGridVpcConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTestGridUrlResult extends S.Class<CreateTestGridUrlResult>(
  "CreateTestGridUrlResult",
)(
  {
    url: S.optional(S.String),
    expires: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class GetInstanceProfileResult extends S.Class<GetInstanceProfileResult>(
  "GetInstanceProfileResult",
)({ instanceProfile: S.optional(InstanceProfile) }, ns) {}
export class GetNetworkProfileResult extends S.Class<GetNetworkProfileResult>(
  "GetNetworkProfileResult",
)({ networkProfile: S.optional(NetworkProfile) }, ns) {}
export class GetUploadResult extends S.Class<GetUploadResult>(
  "GetUploadResult",
)({ upload: S.optional(Upload) }, ns) {}
export class GetVPCEConfigurationResult extends S.Class<GetVPCEConfigurationResult>(
  "GetVPCEConfigurationResult",
)({ vpceConfiguration: S.optional(VPCEConfiguration) }, ns) {}
export class InstallToRemoteAccessSessionResult extends S.Class<InstallToRemoteAccessSessionResult>(
  "InstallToRemoteAccessSessionResult",
)({ appUpload: S.optional(Upload) }, ns) {}
export class ListDeviceInstancesResult extends S.Class<ListDeviceInstancesResult>(
  "ListDeviceInstancesResult",
)(
  {
    deviceInstances: S.optional(DeviceInstances),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDevicePoolsResult extends S.Class<ListDevicePoolsResult>(
  "ListDevicePoolsResult",
)(
  { devicePools: S.optional(DevicePools), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListDevicesRequest extends S.Class<ListDevicesRequest>(
  "ListDevicesRequest",
)(
  {
    arn: S.optional(S.String),
    nextToken: S.optional(S.String),
    filters: S.optional(DeviceFilters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstanceProfilesResult extends S.Class<ListInstanceProfilesResult>(
  "ListInstanceProfilesResult",
)(
  {
    instanceProfiles: S.optional(InstanceProfiles),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListJobsResult extends S.Class<ListJobsResult>("ListJobsResult")(
  { jobs: S.optional(Jobs), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListNetworkProfilesResult extends S.Class<ListNetworkProfilesResult>(
  "ListNetworkProfilesResult",
)(
  {
    networkProfiles: S.optional(NetworkProfiles),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListProjectsResult extends S.Class<ListProjectsResult>(
  "ListProjectsResult",
)({ projects: S.optional(Projects), nextToken: S.optional(S.String) }, ns) {}
export class ListRemoteAccessSessionsResult extends S.Class<ListRemoteAccessSessionsResult>(
  "ListRemoteAccessSessionsResult",
)(
  {
    remoteAccessSessions: S.optional(RemoteAccessSessions),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListRunsResult extends S.Class<ListRunsResult>("ListRunsResult")(
  { runs: S.optional(Runs), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListSuitesResult extends S.Class<ListSuitesResult>(
  "ListSuitesResult",
)({ suites: S.optional(Suites), nextToken: S.optional(S.String) }, ns) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class ListTestGridProjectsResult extends S.Class<ListTestGridProjectsResult>(
  "ListTestGridProjectsResult",
)(
  {
    testGridProjects: S.optional(TestGridProjects),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTestGridSessionsResult extends S.Class<ListTestGridSessionsResult>(
  "ListTestGridSessionsResult",
)(
  {
    testGridSessions: S.optional(TestGridSessions),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTestsResult extends S.Class<ListTestsResult>(
  "ListTestsResult",
)({ tests: S.optional(Tests), nextToken: S.optional(S.String) }, ns) {}
export class ListUploadsResult extends S.Class<ListUploadsResult>(
  "ListUploadsResult",
)({ uploads: S.optional(Uploads), nextToken: S.optional(S.String) }, ns) {}
export class ListVPCEConfigurationsResult extends S.Class<ListVPCEConfigurationsResult>(
  "ListVPCEConfigurationsResult",
)(
  {
    vpceConfigurations: S.optional(VPCEConfigurations),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class MonetaryAmount extends S.Class<MonetaryAmount>("MonetaryAmount")({
  amount: S.optional(S.Number),
  currencyCode: S.optional(S.String),
}) {}
export class RecurringCharge extends S.Class<RecurringCharge>(
  "RecurringCharge",
)({ cost: S.optional(MonetaryAmount), frequency: S.optional(S.String) }) {}
export const RecurringCharges = S.Array(RecurringCharge);
export class Offering extends S.Class<Offering>("Offering")({
  id: S.optional(S.String),
  description: S.optional(S.String),
  type: S.optional(S.String),
  platform: S.optional(S.String),
  recurringCharges: S.optional(RecurringCharges),
}) {}
export class OfferingStatus extends S.Class<OfferingStatus>("OfferingStatus")({
  type: S.optional(S.String),
  offering: S.optional(Offering),
  quantity: S.optional(S.Number),
  effectiveOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class OfferingTransaction extends S.Class<OfferingTransaction>(
  "OfferingTransaction",
)({
  offeringStatus: S.optional(OfferingStatus),
  transactionId: S.optional(S.String),
  offeringPromotionId: S.optional(S.String),
  createdOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  cost: S.optional(MonetaryAmount),
}) {}
export class PurchaseOfferingResult extends S.Class<PurchaseOfferingResult>(
  "PurchaseOfferingResult",
)({ offeringTransaction: S.optional(OfferingTransaction) }, ns) {}
export class RenewOfferingResult extends S.Class<RenewOfferingResult>(
  "RenewOfferingResult",
)({ offeringTransaction: S.optional(OfferingTransaction) }, ns) {}
export const TestParameters = S.Record({ key: S.String, value: S.String });
export class ScheduleRunTest extends S.Class<ScheduleRunTest>(
  "ScheduleRunTest",
)({
  type: S.String,
  testPackageArn: S.optional(S.String),
  testSpecArn: S.optional(S.String),
  filter: S.optional(S.String),
  parameters: S.optional(TestParameters),
}) {}
export class ScheduleRunConfiguration extends S.Class<ScheduleRunConfiguration>(
  "ScheduleRunConfiguration",
)({
  extraDataPackageArn: S.optional(S.String),
  networkProfileArn: S.optional(S.String),
  locale: S.optional(S.String),
  location: S.optional(Location),
  vpceConfigurationArns: S.optional(AmazonResourceNames),
  deviceProxy: S.optional(DeviceProxy),
  customerArtifactPaths: S.optional(CustomerArtifactPaths),
  radios: S.optional(Radios),
  auxiliaryApps: S.optional(AmazonResourceNames),
  billingMethod: S.optional(S.String),
  environmentVariables: S.optional(EnvironmentVariables),
  executionRoleArn: S.optional(S.String),
}) {}
export class ScheduleRunRequest extends S.Class<ScheduleRunRequest>(
  "ScheduleRunRequest",
)(
  {
    projectArn: S.String,
    appArn: S.optional(S.String),
    devicePoolArn: S.optional(S.String),
    deviceSelectionConfiguration: S.optional(DeviceSelectionConfiguration),
    name: S.optional(S.String),
    test: ScheduleRunTest,
    configuration: S.optional(ScheduleRunConfiguration),
    executionConfiguration: S.optional(ExecutionConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopJobResult extends S.Class<StopJobResult>("StopJobResult")(
  { job: S.optional(Job) },
  ns,
) {}
export class StopRemoteAccessSessionResult extends S.Class<StopRemoteAccessSessionResult>(
  "StopRemoteAccessSessionResult",
)({ remoteAccessSession: S.optional(RemoteAccessSession) }, ns) {}
export class StopRunResult extends S.Class<StopRunResult>("StopRunResult")(
  { run: S.optional(Run) },
  ns,
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UpdateDeviceInstanceResult extends S.Class<UpdateDeviceInstanceResult>(
  "UpdateDeviceInstanceResult",
)({ deviceInstance: S.optional(DeviceInstance) }, ns) {}
export class UpdateDevicePoolResult extends S.Class<UpdateDevicePoolResult>(
  "UpdateDevicePoolResult",
)({ devicePool: S.optional(DevicePool) }, ns) {}
export class UpdateInstanceProfileResult extends S.Class<UpdateInstanceProfileResult>(
  "UpdateInstanceProfileResult",
)({ instanceProfile: S.optional(InstanceProfile) }, ns) {}
export class UpdateNetworkProfileResult extends S.Class<UpdateNetworkProfileResult>(
  "UpdateNetworkProfileResult",
)({ networkProfile: S.optional(NetworkProfile) }, ns) {}
export class UpdateProjectResult extends S.Class<UpdateProjectResult>(
  "UpdateProjectResult",
)({ project: S.optional(Project) }, ns) {}
export class UpdateTestGridProjectResult extends S.Class<UpdateTestGridProjectResult>(
  "UpdateTestGridProjectResult",
)({ testGridProject: S.optional(TestGridProject) }, ns) {}
export class UpdateUploadResult extends S.Class<UpdateUploadResult>(
  "UpdateUploadResult",
)({ upload: S.optional(Upload) }, ns) {}
export class UpdateVPCEConfigurationResult extends S.Class<UpdateVPCEConfigurationResult>(
  "UpdateVPCEConfigurationResult",
)({ vpceConfiguration: S.optional(VPCEConfiguration) }, ns) {}
export const PurchasedDevicesMap = S.Record({ key: S.String, value: S.Number });
export class TrialMinutes extends S.Class<TrialMinutes>("TrialMinutes")({
  total: S.optional(S.Number),
  remaining: S.optional(S.Number),
}) {}
export const MaxSlotMap = S.Record({ key: S.String, value: S.Number });
export class CreateRemoteAccessSessionConfiguration extends S.Class<CreateRemoteAccessSessionConfiguration>(
  "CreateRemoteAccessSessionConfiguration",
)({
  auxiliaryApps: S.optional(AuxiliaryAppArnList),
  billingMethod: S.optional(S.String),
  vpceConfigurationArns: S.optional(AmazonResourceNames),
  deviceProxy: S.optional(DeviceProxy),
}) {}
export class AccountSettings extends S.Class<AccountSettings>(
  "AccountSettings",
)({
  awsAccountNumber: S.optional(S.String),
  unmeteredDevices: S.optional(PurchasedDevicesMap),
  unmeteredRemoteAccessDevices: S.optional(PurchasedDevicesMap),
  maxJobTimeoutMinutes: S.optional(S.Number),
  trialMinutes: S.optional(TrialMinutes),
  maxSlots: S.optional(MaxSlotMap),
  defaultJobTimeoutMinutes: S.optional(S.Number),
  skipAppResign: S.optional(S.Boolean),
}) {}
export class Artifact extends S.Class<Artifact>("Artifact")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  extension: S.optional(S.String),
  url: S.optional(S.String),
}) {}
export const Artifacts = S.Array(Artifact);
export const Devices = S.Array(Device);
export class OfferingPromotion extends S.Class<OfferingPromotion>(
  "OfferingPromotion",
)({ id: S.optional(S.String), description: S.optional(S.String) }) {}
export const OfferingPromotions = S.Array(OfferingPromotion);
export class Sample extends S.Class<Sample>("Sample")({
  arn: S.optional(S.String),
  type: S.optional(S.String),
  url: S.optional(S.String),
}) {}
export const Samples = S.Array(Sample);
export class TestGridSessionAction extends S.Class<TestGridSessionAction>(
  "TestGridSessionAction",
)({
  action: S.optional(S.String),
  started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  duration: S.optional(S.Number),
  statusCode: S.optional(S.String),
  requestMethod: S.optional(S.String),
}) {}
export const TestGridSessionActions = S.Array(TestGridSessionAction);
export class TestGridSessionArtifact extends S.Class<TestGridSessionArtifact>(
  "TestGridSessionArtifact",
)({
  filename: S.optional(S.String),
  type: S.optional(S.String),
  url: S.optional(S.String),
}) {}
export const TestGridSessionArtifacts = S.Array(TestGridSessionArtifact);
export class CreateDevicePoolResult extends S.Class<CreateDevicePoolResult>(
  "CreateDevicePoolResult",
)({ devicePool: S.optional(DevicePool) }, ns) {}
export class CreateInstanceProfileResult extends S.Class<CreateInstanceProfileResult>(
  "CreateInstanceProfileResult",
)({ instanceProfile: S.optional(InstanceProfile) }, ns) {}
export class CreateNetworkProfileResult extends S.Class<CreateNetworkProfileResult>(
  "CreateNetworkProfileResult",
)({ networkProfile: S.optional(NetworkProfile) }, ns) {}
export class CreateProjectResult extends S.Class<CreateProjectResult>(
  "CreateProjectResult",
)({ project: S.optional(Project) }, ns) {}
export class CreateRemoteAccessSessionRequest extends S.Class<CreateRemoteAccessSessionRequest>(
  "CreateRemoteAccessSessionRequest",
)(
  {
    projectArn: S.String,
    deviceArn: S.String,
    appArn: S.optional(S.String),
    instanceArn: S.optional(S.String),
    name: S.optional(S.String),
    configuration: S.optional(CreateRemoteAccessSessionConfiguration),
    interactionMode: S.optional(S.String),
    skipAppResign: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTestGridProjectResult extends S.Class<CreateTestGridProjectResult>(
  "CreateTestGridProjectResult",
)({ testGridProject: S.optional(TestGridProject) }, ns) {}
export class CreateUploadResult extends S.Class<CreateUploadResult>(
  "CreateUploadResult",
)({ upload: S.optional(Upload) }, ns) {}
export class CreateVPCEConfigurationResult extends S.Class<CreateVPCEConfigurationResult>(
  "CreateVPCEConfigurationResult",
)({ vpceConfiguration: S.optional(VPCEConfiguration) }, ns) {}
export class GetAccountSettingsResult extends S.Class<GetAccountSettingsResult>(
  "GetAccountSettingsResult",
)({ accountSettings: S.optional(AccountSettings) }, ns) {}
export class GetDeviceInstanceResult extends S.Class<GetDeviceInstanceResult>(
  "GetDeviceInstanceResult",
)({ deviceInstance: S.optional(DeviceInstance) }, ns) {}
export class GetDevicePoolResult extends S.Class<GetDevicePoolResult>(
  "GetDevicePoolResult",
)({ devicePool: S.optional(DevicePool) }, ns) {}
export class GetDevicePoolCompatibilityRequest extends S.Class<GetDevicePoolCompatibilityRequest>(
  "GetDevicePoolCompatibilityRequest",
)(
  {
    devicePoolArn: S.String,
    appArn: S.optional(S.String),
    testType: S.optional(S.String),
    test: S.optional(ScheduleRunTest),
    configuration: S.optional(ScheduleRunConfiguration),
    projectArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetProjectResult extends S.Class<GetProjectResult>(
  "GetProjectResult",
)({ project: S.optional(Project) }, ns) {}
export class GetSuiteResult extends S.Class<GetSuiteResult>("GetSuiteResult")(
  { suite: S.optional(Suite) },
  ns,
) {}
export class GetTestResult extends S.Class<GetTestResult>("GetTestResult")(
  { test: S.optional(Test) },
  ns,
) {}
export class GetTestGridProjectResult extends S.Class<GetTestGridProjectResult>(
  "GetTestGridProjectResult",
)({ testGridProject: S.optional(TestGridProject) }, ns) {}
export class GetTestGridSessionResult extends S.Class<GetTestGridSessionResult>(
  "GetTestGridSessionResult",
)({ testGridSession: S.optional(TestGridSession) }, ns) {}
export class ListArtifactsResult extends S.Class<ListArtifactsResult>(
  "ListArtifactsResult",
)({ artifacts: S.optional(Artifacts), nextToken: S.optional(S.String) }, ns) {}
export class ListDevicesResult extends S.Class<ListDevicesResult>(
  "ListDevicesResult",
)({ devices: S.optional(Devices), nextToken: S.optional(S.String) }, ns) {}
export class ListOfferingPromotionsResult extends S.Class<ListOfferingPromotionsResult>(
  "ListOfferingPromotionsResult",
)(
  {
    offeringPromotions: S.optional(OfferingPromotions),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListSamplesResult extends S.Class<ListSamplesResult>(
  "ListSamplesResult",
)({ samples: S.optional(Samples), nextToken: S.optional(S.String) }, ns) {}
export class ListTestGridSessionActionsResult extends S.Class<ListTestGridSessionActionsResult>(
  "ListTestGridSessionActionsResult",
)(
  {
    actions: S.optional(TestGridSessionActions),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTestGridSessionArtifactsResult extends S.Class<ListTestGridSessionArtifactsResult>(
  "ListTestGridSessionArtifactsResult",
)(
  {
    artifacts: S.optional(TestGridSessionArtifacts),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ScheduleRunResult extends S.Class<ScheduleRunResult>(
  "ScheduleRunResult",
)({ run: S.optional(Run) }, ns) {}
export const OfferingStatusMap = S.Record({
  key: S.String,
  value: OfferingStatus,
});
export const Offerings = S.Array(Offering);
export const OfferingTransactions = S.Array(OfferingTransaction);
export class CreateRemoteAccessSessionResult extends S.Class<CreateRemoteAccessSessionResult>(
  "CreateRemoteAccessSessionResult",
)({ remoteAccessSession: S.optional(RemoteAccessSession) }, ns) {}
export class GetDeviceResult extends S.Class<GetDeviceResult>(
  "GetDeviceResult",
)({ device: S.optional(Device) }, ns) {}
export class GetJobResult extends S.Class<GetJobResult>("GetJobResult")(
  { job: S.optional(Job) },
  ns,
) {}
export class GetOfferingStatusResult extends S.Class<GetOfferingStatusResult>(
  "GetOfferingStatusResult",
)(
  {
    current: S.optional(OfferingStatusMap),
    nextPeriod: S.optional(OfferingStatusMap),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetRemoteAccessSessionResult extends S.Class<GetRemoteAccessSessionResult>(
  "GetRemoteAccessSessionResult",
)({ remoteAccessSession: S.optional(RemoteAccessSession) }, ns) {}
export class GetRunResult extends S.Class<GetRunResult>("GetRunResult")(
  { run: S.optional(Run) },
  ns,
) {}
export class ListOfferingsResult extends S.Class<ListOfferingsResult>(
  "ListOfferingsResult",
)({ offerings: S.optional(Offerings), nextToken: S.optional(S.String) }, ns) {}
export class ListOfferingTransactionsResult extends S.Class<ListOfferingTransactionsResult>(
  "ListOfferingTransactionsResult",
)(
  {
    offeringTransactions: S.optional(OfferingTransactions),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ProblemDetail extends S.Class<ProblemDetail>("ProblemDetail")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
}) {}
export class Problem extends S.Class<Problem>("Problem")({
  run: S.optional(ProblemDetail),
  job: S.optional(ProblemDetail),
  suite: S.optional(ProblemDetail),
  test: S.optional(ProblemDetail),
  device: S.optional(Device),
  result: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const Problems = S.Array(Problem);
export class IncompatibilityMessage extends S.Class<IncompatibilityMessage>(
  "IncompatibilityMessage",
)({ message: S.optional(S.String), type: S.optional(S.String) }) {}
export const IncompatibilityMessages = S.Array(IncompatibilityMessage);
export class UniqueProblem extends S.Class<UniqueProblem>("UniqueProblem")({
  message: S.optional(S.String),
  problems: S.optional(Problems),
}) {}
export const UniqueProblems = S.Array(UniqueProblem);
export class DevicePoolCompatibilityResult extends S.Class<DevicePoolCompatibilityResult>(
  "DevicePoolCompatibilityResult",
)({
  device: S.optional(Device),
  compatible: S.optional(S.Boolean),
  incompatibilityMessages: S.optional(IncompatibilityMessages),
}) {}
export const DevicePoolCompatibilityResults = S.Array(
  DevicePoolCompatibilityResult,
);
export const UniqueProblemsByExecutionResultMap = S.Record({
  key: S.String,
  value: UniqueProblems,
});
export class GetDevicePoolCompatibilityResult extends S.Class<GetDevicePoolCompatibilityResult>(
  "GetDevicePoolCompatibilityResult",
)(
  {
    compatibleDevices: S.optional(DevicePoolCompatibilityResults),
    incompatibleDevices: S.optional(DevicePoolCompatibilityResults),
  },
  ns,
) {}
export class ListUniqueProblemsResult extends S.Class<ListUniqueProblemsResult>(
  "ListUniqueProblemsResult",
)(
  {
    uniqueProblems: S.optional(UniqueProblemsByExecutionResultMap),
    nextToken: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class ArgumentException extends S.TaggedError<ArgumentException>()(
  "ArgumentException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class ServiceAccountException extends S.TaggedError<ServiceAccountException>()(
  "ServiceAccountException",
  {},
) {}
export class CannotDeleteException extends S.TaggedError<CannotDeleteException>()(
  "CannotDeleteException",
  { message: S.optional(S.String) },
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  {},
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { message: S.optional(S.String) },
) {}
export class TagOperationException extends S.TaggedError<TagOperationException>()(
  "TagOperationException",
  {},
) {}
export class NotEligibleException extends S.TaggedError<NotEligibleException>()(
  "NotEligibleException",
  {},
) {}
export class TagPolicyException extends S.TaggedError<TagPolicyException>()(
  "TagPolicyException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class IdempotencyException extends S.TaggedError<IdempotencyException>()(
  "IdempotencyException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a completed remote access session and its results. You cannot delete a remote access session if it is still active.
 *
 * You cannot undo this operation.
 */
export const deleteRemoteAccessSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRemoteAccessSessionRequest,
    output: DeleteRemoteAccessSessionResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Deletes the run, given the run ARN. You cannot delete a run if it is still active.
 *
 * You cannot undo this operation.
 */
export const deleteRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRunRequest,
  output: DeleteRunResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes an upload given the upload ARN.
 */
export const deleteUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUploadRequest,
  output: DeleteUploadResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes a device pool given the pool ARN. Does not allow deletion of curated pools
 * owned by the system.
 */
export const deleteDevicePool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDevicePoolRequest,
  output: DeleteDevicePoolResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes a profile that can be applied to one or more private device instances.
 */
export const deleteInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInstanceProfileRequest,
    output: DeleteInstanceProfileResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Deletes a network profile.
 */
export const deleteNetworkProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteNetworkProfileRequest,
    output: DeleteNetworkProfileResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Deletes an AWS Device Farm project, given the project ARN. You cannot delete a project if it has an active run or session.
 *
 * You cannot undo this operation.
 */
export const deleteProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes a Selenium testing project and all content generated under it. You cannot delete a project if it has active sessions.
 *
 * You cannot undo this operation.
 */
export const deleteTestGridProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTestGridProjectRequest,
    output: DeleteTestGridProjectResult,
    errors: [
      ArgumentException,
      CannotDeleteException,
      InternalServiceException,
      NotFoundException,
    ],
  }),
);
/**
 * Deletes a configuration for your Amazon Virtual Private Cloud (VPC) endpoint.
 */
export const deleteVPCEConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVPCEConfigurationRequest,
    output: DeleteVPCEConfigurationResult,
    errors: [
      ArgumentException,
      InvalidOperationException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Returns information about the specified instance profile.
 */
export const getInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceProfileRequest,
  output: GetInstanceProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns information about a network profile.
 */
export const getNetworkProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNetworkProfileRequest,
  output: GetNetworkProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about an upload.
 */
export const getUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUploadRequest,
  output: GetUploadResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns information about the configuration settings for your Amazon Virtual Private
 * Cloud (VPC) endpoint.
 */
export const getVPCEConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetVPCEConfigurationRequest,
    output: GetVPCEConfigurationResult,
    errors: [ArgumentException, NotFoundException, ServiceAccountException],
  }),
);
/**
 * Installs an application to the device in a remote access session. For Android
 * applications, the file must be in .apk format. For iOS applications, the file must be in
 * .ipa format.
 */
export const installToRemoteAccessSession =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: InstallToRemoteAccessSessionRequest,
    output: InstallToRemoteAccessSessionResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }));
/**
 * Returns information about the private device instances associated with one or more AWS
 * accounts.
 */
export const listDeviceInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDeviceInstancesRequest,
  output: ListDeviceInstancesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about device pools.
 */
export const listDevicePools = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevicePoolsRequest,
  output: ListDevicePoolsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns information about all the instance profiles in an AWS account.
 */
export const listInstanceProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInstanceProfilesRequest,
    output: ListInstanceProfilesResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Gets information about jobs for a given test run.
 */
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJobsRequest,
  output: ListJobsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns the list of available network profiles.
 */
export const listNetworkProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNetworkProfilesRequest,
  output: ListNetworkProfilesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about projects.
 */
export const listProjects = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProjectsRequest,
  output: ListProjectsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns a list of all currently running remote access sessions.
 */
export const listRemoteAccessSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRemoteAccessSessionsRequest,
    output: ListRemoteAccessSessionsResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Gets information about runs, given an AWS Device Farm project ARN.
 */
export const listRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRunsRequest,
  output: ListRunsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about test suites for a given job.
 */
export const listSuites = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSuitesRequest,
  output: ListSuitesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * List the tags for an AWS Device Farm resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ArgumentException, NotFoundException, TagOperationException],
}));
/**
 * Gets a list of all Selenium testing projects in your account.
 */
export const listTestGridProjects = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTestGridProjectsRequest,
    output: ListTestGridProjectsResult,
    errors: [ArgumentException, InternalServiceException],
  }),
);
/**
 * Retrieves a list of sessions for a TestGridProject.
 */
export const listTestGridSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTestGridSessionsRequest,
    output: ListTestGridSessionsResult,
    errors: [ArgumentException, InternalServiceException, NotFoundException],
  }),
);
/**
 * Gets information about tests in a given test suite.
 */
export const listTests = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTestsRequest,
  output: ListTestsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about uploads, given an AWS Device Farm project ARN.
 */
export const listUploads = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUploadsRequest,
  output: ListUploadsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns information about all Amazon Virtual Private Cloud (VPC) endpoint
 * configurations in the AWS account.
 */
export const listVPCEConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListVPCEConfigurationsRequest,
    output: ListVPCEConfigurationsResult,
    errors: [ArgumentException, ServiceAccountException],
  }),
);
/**
 * Explicitly sets the quantity of devices to renew for an offering, starting from the
 * `effectiveDate` of the next period. The API returns a `NotEligible` error if the
 * user is not permitted to invoke the operation. If you must be able to invoke this operation, contact aws-devicefarm-support@amazon.com.
 */
export const renewOffering = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RenewOfferingRequest,
  output: RenewOfferingResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Initiates a stop request for the current job. AWS Device Farm immediately stops the job on the device
 * where tests have not started. You are not billed for this device. On the device where tests have started,
 * setup suite and teardown suite tests run to completion on the device. You are billed for setup, teardown,
 * and any tests that were in progress or already completed.
 */
export const stopJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopJobRequest,
  output: StopJobResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Ends a specified remote access session.
 */
export const stopRemoteAccessSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopRemoteAccessSessionRequest,
    output: StopRemoteAccessSessionResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Initiates a stop request for the current test run. AWS Device Farm immediately stops the run on devices
 * where tests have not started. You are not billed for these devices. On devices where tests have started
 * executing, setup suite and teardown suite tests run to completion on those devices. You are billed for
 * setup, teardown, and any tests that were in progress or already completed.
 */
export const stopRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRunRequest,
  output: StopRunResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes the specified tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ArgumentException, NotFoundException, TagOperationException],
}));
/**
 * Updates information about a private device instance.
 */
export const updateDeviceInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDeviceInstanceRequest,
    output: UpdateDeviceInstanceResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Modifies the name, description, and rules in a device pool given the attributes and
 * the pool ARN. Rule updates are all-or-nothing, meaning they can only be updated as a
 * whole (or not at all).
 */
export const updateDevicePool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDevicePoolRequest,
  output: UpdateDevicePoolResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Updates information about an existing private device instance profile.
 */
export const updateInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateInstanceProfileRequest,
    output: UpdateInstanceProfileResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Updates the network profile.
 */
export const updateNetworkProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateNetworkProfileRequest,
    output: UpdateNetworkProfileResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Modifies the specified project name, given the project ARN and a new
 * name.
 */
export const updateProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Change details of a project.
 */
export const updateTestGridProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTestGridProjectRequest,
    output: UpdateTestGridProjectResult,
    errors: [
      ArgumentException,
      InternalServiceException,
      LimitExceededException,
      NotFoundException,
    ],
  }),
);
/**
 * Updates an uploaded test spec.
 */
export const updateUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUploadRequest,
  output: UpdateUploadResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Updates information about an Amazon Virtual Private Cloud (VPC) endpoint configuration.
 */
export const updateVPCEConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateVPCEConfigurationRequest,
    output: UpdateVPCEConfigurationResult,
    errors: [
      ArgumentException,
      InvalidOperationException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Creates a device pool.
 */
export const createDevicePool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDevicePoolRequest,
  output: CreateDevicePoolResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Creates a profile that can be applied to one or more private fleet device
 * instances.
 */
export const createInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateInstanceProfileRequest,
    output: CreateInstanceProfileResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Creates a network profile.
 */
export const createNetworkProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateNetworkProfileRequest,
    output: CreateNetworkProfileResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Creates a project.
 */
export const createProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
    TagOperationException,
  ],
}));
/**
 * Creates a Selenium testing project. Projects are used to track TestGridSession
 * instances.
 */
export const createTestGridProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTestGridProjectRequest,
    output: CreateTestGridProjectResult,
    errors: [
      ArgumentException,
      InternalServiceException,
      LimitExceededException,
    ],
  }),
);
/**
 * Creates a signed, short-term URL that can be passed to a Selenium `RemoteWebDriver`
 * constructor.
 */
export const createTestGridUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTestGridUrlRequest,
  output: CreateTestGridUrlResult,
  errors: [ArgumentException, InternalServiceException, NotFoundException],
}));
/**
 * Uploads an app or test scripts.
 */
export const createUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUploadRequest,
  output: CreateUploadResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Creates a configuration record in Device Farm for your Amazon Virtual Private Cloud
 * (VPC) endpoint.
 */
export const createVPCEConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVPCEConfigurationRequest,
    output: CreateVPCEConfigurationResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Returns the number of unmetered iOS or unmetered Android devices that have been purchased by the
 * account.
 */
export const getAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns information about a device instance that belongs to a private device fleet.
 */
export const getDeviceInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceInstanceRequest,
  output: GetDeviceInstanceResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a device pool.
 */
export const getDevicePool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDevicePoolRequest,
  output: GetDevicePoolResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a project.
 */
export const getProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectRequest,
  output: GetProjectResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a suite.
 */
export const getSuite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSuiteRequest,
  output: GetSuiteResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a test.
 */
export const getTest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTestRequest,
  output: GetTestResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Retrieves information about a Selenium testing project.
 */
export const getTestGridProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTestGridProjectRequest,
  output: GetTestGridProjectResult,
  errors: [ArgumentException, InternalServiceException, NotFoundException],
}));
/**
 * A session is an instance of a browser created through a `RemoteWebDriver` with the URL from CreateTestGridUrlResult$url. You can use the following to look up sessions:
 *
 * - The session ARN (GetTestGridSessionRequest$sessionArn).
 *
 * - The project ARN and a session ID (GetTestGridSessionRequest$projectArn and GetTestGridSessionRequest$sessionId).
 */
export const getTestGridSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTestGridSessionRequest,
  output: GetTestGridSessionResult,
  errors: [ArgumentException, InternalServiceException, NotFoundException],
}));
/**
 * Gets information about artifacts.
 */
export const listArtifacts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListArtifactsRequest,
  output: ListArtifactsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about unique device types.
 */
export const listDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevicesRequest,
  output: ListDevicesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns a list of offering promotions. Each offering promotion record contains the ID and description
 * of the promotion. The API returns a `NotEligible` error if the caller is not permitted to invoke
 * the operation. Contact aws-devicefarm-support@amazon.com if you must be able to invoke this operation.
 */
export const listOfferingPromotions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOfferingPromotionsRequest,
    output: ListOfferingPromotionsResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotEligibleException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Gets information about samples, given an AWS Device Farm job ARN.
 */
export const listSamples = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSamplesRequest,
  output: ListSamplesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns a list of the actions taken in a TestGridSession.
 */
export const listTestGridSessionActions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTestGridSessionActionsRequest,
    output: ListTestGridSessionActionsResult,
    errors: [ArgumentException, InternalServiceException, NotFoundException],
  }),
);
/**
 * Retrieves a list of artifacts created during the session.
 */
export const listTestGridSessionArtifacts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListTestGridSessionArtifactsRequest,
    output: ListTestGridSessionArtifactsResult,
    errors: [ArgumentException, InternalServiceException, NotFoundException],
  }));
/**
 * Immediately purchases offerings for an AWS account. Offerings renew with the latest total purchased
 * quantity for an offering, unless the renewal was overridden. The API returns a `NotEligible`
 * error if the user is not permitted to invoke the operation. If you must be able to invoke this operation,
 * contact aws-devicefarm-support@amazon.com.
 */
export const purchaseOffering = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseOfferingRequest,
  output: PurchaseOfferingResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Specifies and starts a remote access session.
 */
export const createRemoteAccessSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRemoteAccessSessionRequest,
    output: CreateRemoteAccessSessionResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Gets information about a unique device type.
 */
export const getDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceRequest,
  output: GetDeviceResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a job.
 */
export const getJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRequest,
  output: GetJobResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets the current status and future status of all offerings purchased by an AWS account. The response
 * indicates how many offerings are currently available and the offerings that will be available in the next
 * period. The API returns a `NotEligible` error if the user is not permitted to invoke the
 * operation. If you must be able to invoke this operation, contact aws-devicefarm-support@amazon.com.
 */
export const getOfferingStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOfferingStatusRequest,
  output: GetOfferingStatusResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns a link to a currently running remote access session.
 */
export const getRemoteAccessSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRemoteAccessSessionRequest,
    output: GetRemoteAccessSessionResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Gets information about a run.
 */
export const getRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRunRequest,
  output: GetRunResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns a list of products or offerings that the user can manage through the API. Each offering record
 * indicates the recurring price per unit and the frequency for that offering. The API returns a
 * `NotEligible` error if the user is not permitted to invoke the operation. If you must be
 * able to invoke this operation, contact aws-devicefarm-support@amazon.com.
 */
export const listOfferings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOfferingsRequest,
  output: ListOfferingsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns a list of all historical purchases, renewals, and system renewal transactions for an AWS
 * account. The list is paginated and ordered by a descending timestamp (most recent transactions are first).
 * The API returns a `NotEligible` error if the user is not permitted to invoke the operation. If
 * you must be able to invoke this operation, contact aws-devicefarm-support@amazon.com.
 */
export const listOfferingTransactions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOfferingTransactionsRequest,
    output: ListOfferingTransactionsResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotEligibleException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Schedules a run.
 */
export const scheduleRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScheduleRunRequest,
  output: ScheduleRunResult,
  errors: [
    ArgumentException,
    IdempotencyException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Associates the specified tags to a resource with the specified `resourceArn`. If existing tags
 * on a resource are not specified in the request parameters, they are not changed. When a resource is deleted,
 * the tags associated with that resource are also deleted.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ArgumentException,
    NotFoundException,
    TagOperationException,
    TagPolicyException,
    TooManyTagsException,
  ],
}));
/**
 * Gets information about compatibility with a device pool.
 */
export const getDevicePoolCompatibility = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDevicePoolCompatibilityRequest,
    output: GetDevicePoolCompatibilityResult,
    errors: [
      ArgumentException,
      LimitExceededException,
      NotFoundException,
      ServiceAccountException,
    ],
  }),
);
/**
 * Gets information about unique problems, such as exceptions or crashes.
 *
 * Unique problems are defined as a single instance of an error across a run, job, or suite. For example,
 * if a call in your application consistently raises an exception (OutOfBoundsException in
 * MyActivity.java:386), `ListUniqueProblems` returns a single entry instead of many
 * individual entries for that exception.
 */
export const listUniqueProblems = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUniqueProblemsRequest,
  output: ListUniqueProblemsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));

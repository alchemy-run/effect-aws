import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Lightsail",
  serviceShapeName: "Lightsail_20161128",
});
const auth = T.AwsAuthSigv4({ name: "lightsail" });
const ver = T.ServiceVersion("2016-11-28");
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
                        url: "https://lightsail-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://lightsail-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://lightsail.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://lightsail.{Region}.{PartitionResult#dnsSuffix}",
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
export class CreateContainerServiceRegistryLoginRequest extends S.Class<CreateContainerServiceRegistryLoginRequest>(
  "CreateContainerServiceRegistryLoginRequest",
)(
  {},
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/container-registry-login",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DownloadDefaultKeyPairRequest extends S.Class<DownloadDefaultKeyPairRequest>(
  "DownloadDefaultKeyPairRequest",
)(
  {},
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/DownloadDefaultKeyPair",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContainerAPIMetadataRequest extends S.Class<GetContainerAPIMetadataRequest>(
  "GetContainerAPIMetadataRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/ls/api/2016-11-28/container-api-metadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContainerServicePowersRequest extends S.Class<GetContainerServicePowersRequest>(
  "GetContainerServicePowersRequest",
)(
  {},
  T.all(
    T.Http({
      method: "GET",
      uri: "/ls/api/2016-11-28/container-service-powers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDistributionBundlesRequest extends S.Class<GetDistributionBundlesRequest>(
  "GetDistributionBundlesRequest",
)(
  {},
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetDistributionBundles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IsVpcPeeredRequest extends S.Class<IsVpcPeeredRequest>(
  "IsVpcPeeredRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/IsVpcPeered" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PeerVpcRequest extends S.Class<PeerVpcRequest>("PeerVpcRequest")(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/PeerVpc" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UnpeerVpcRequest extends S.Class<UnpeerVpcRequest>(
  "UnpeerVpcRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UnpeerVpc" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResourceNameList = S.Array(S.String);
export const SubjectAlternativeNameList = S.Array(S.String);
export const StringList = S.Array(S.String);
export const DomainNameList = S.Array(S.String);
export const MetricStatisticList = S.Array(S.String);
export const CertificateStatusList = S.Array(S.String);
export const ContactProtocolsList = S.Array(S.String);
export const NotificationTriggerList = S.Array(S.String);
export class PortInfo extends S.Class<PortInfo>("PortInfo")({
  fromPort: S.optional(S.Number),
  toPort: S.optional(S.Number),
  protocol: S.optional(S.String),
  cidrs: S.optional(StringList),
  ipv6Cidrs: S.optional(StringList),
  cidrListAliases: S.optional(StringList),
}) {}
export const PortInfoList = S.Array(PortInfo);
export const SetupDomainNameList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const PartnerIdList = S.Array(S.String);
export class AllocateStaticIpRequest extends S.Class<AllocateStaticIpRequest>(
  "AllocateStaticIpRequest",
)(
  { staticIpName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/AllocateStaticIp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachCertificateToDistributionRequest extends S.Class<AttachCertificateToDistributionRequest>(
  "AttachCertificateToDistributionRequest",
)(
  { distributionName: S.String, certificateName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/AttachCertificateToDistribution",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachDiskRequest extends S.Class<AttachDiskRequest>(
  "AttachDiskRequest",
)(
  {
    diskName: S.String,
    instanceName: S.String,
    diskPath: S.String,
    autoMounting: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/AttachDisk" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachInstancesToLoadBalancerRequest extends S.Class<AttachInstancesToLoadBalancerRequest>(
  "AttachInstancesToLoadBalancerRequest",
)(
  { loadBalancerName: S.String, instanceNames: ResourceNameList },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/AttachInstancesToLoadBalancer",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachLoadBalancerTlsCertificateRequest extends S.Class<AttachLoadBalancerTlsCertificateRequest>(
  "AttachLoadBalancerTlsCertificateRequest",
)(
  { loadBalancerName: S.String, certificateName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/AttachLoadBalancerTlsCertificate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachStaticIpRequest extends S.Class<AttachStaticIpRequest>(
  "AttachStaticIpRequest",
)(
  { staticIpName: S.String, instanceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/AttachStaticIp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CopySnapshotRequest extends S.Class<CopySnapshotRequest>(
  "CopySnapshotRequest",
)(
  {
    sourceSnapshotName: S.optional(S.String),
    sourceResourceName: S.optional(S.String),
    restoreDate: S.optional(S.String),
    useLatestRestorableAutoSnapshot: S.optional(S.Boolean),
    targetSnapshotName: S.String,
    sourceRegion: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CopySnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBucketAccessKeyRequest extends S.Class<CreateBucketAccessKeyRequest>(
  "CreateBucketAccessKeyRequest",
)(
  { bucketName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateBucketAccessKey" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateCertificateRequest extends S.Class<CreateCertificateRequest>(
  "CreateCertificateRequest",
)(
  {
    certificateName: S.String,
    domainName: S.String,
    subjectAlternativeNames: S.optional(SubjectAlternativeNameList),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateCertificate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateContactMethodRequest extends S.Class<CreateContactMethodRequest>(
  "CreateContactMethodRequest",
)(
  { protocol: S.String, contactEndpoint: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateContactMethod" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AutoSnapshotAddOnRequest extends S.Class<AutoSnapshotAddOnRequest>(
  "AutoSnapshotAddOnRequest",
)({ snapshotTimeOfDay: S.optional(S.String) }) {}
export class StopInstanceOnIdleRequest extends S.Class<StopInstanceOnIdleRequest>(
  "StopInstanceOnIdleRequest",
)({ threshold: S.optional(S.String), duration: S.optional(S.String) }) {}
export class AddOnRequest extends S.Class<AddOnRequest>("AddOnRequest")({
  addOnType: S.String,
  autoSnapshotAddOnRequest: S.optional(AutoSnapshotAddOnRequest),
  stopInstanceOnIdleRequest: S.optional(StopInstanceOnIdleRequest),
}) {}
export const AddOnRequestList = S.Array(AddOnRequest);
export class CreateDiskFromSnapshotRequest extends S.Class<CreateDiskFromSnapshotRequest>(
  "CreateDiskFromSnapshotRequest",
)(
  {
    diskName: S.String,
    diskSnapshotName: S.optional(S.String),
    availabilityZone: S.String,
    sizeInGb: S.Number,
    tags: S.optional(TagList),
    addOns: S.optional(AddOnRequestList),
    sourceDiskName: S.optional(S.String),
    restoreDate: S.optional(S.String),
    useLatestRestorableAutoSnapshot: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/CreateDiskFromSnapshot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDiskSnapshotRequest extends S.Class<CreateDiskSnapshotRequest>(
  "CreateDiskSnapshotRequest",
)(
  {
    diskName: S.optional(S.String),
    diskSnapshotName: S.String,
    instanceName: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDiskSnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDomainRequest extends S.Class<CreateDomainRequest>(
  "CreateDomainRequest",
)(
  { domainName: S.String, tags: S.optional(TagList) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDomain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGUISessionAccessDetailsRequest extends S.Class<CreateGUISessionAccessDetailsRequest>(
  "CreateGUISessionAccessDetailsRequest",
)(
  { resourceName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/create-gui-session-access-details",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInstancesRequest extends S.Class<CreateInstancesRequest>(
  "CreateInstancesRequest",
)(
  {
    instanceNames: StringList,
    availabilityZone: S.String,
    customImageName: S.optional(S.String),
    blueprintId: S.String,
    bundleId: S.String,
    userData: S.optional(S.String),
    keyPairName: S.optional(S.String),
    tags: S.optional(TagList),
    addOns: S.optional(AddOnRequestList),
    ipAddressType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateInstances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInstanceSnapshotRequest extends S.Class<CreateInstanceSnapshotRequest>(
  "CreateInstanceSnapshotRequest",
)(
  {
    instanceSnapshotName: S.String,
    instanceName: S.String,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/CreateInstanceSnapshot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKeyPairRequest extends S.Class<CreateKeyPairRequest>(
  "CreateKeyPairRequest",
)(
  { keyPairName: S.String, tags: S.optional(TagList) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateKeyPair" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLoadBalancerRequest extends S.Class<CreateLoadBalancerRequest>(
  "CreateLoadBalancerRequest",
)(
  {
    loadBalancerName: S.String,
    instancePort: S.Number,
    healthCheckPath: S.optional(S.String),
    certificateName: S.optional(S.String),
    certificateDomainName: S.optional(S.String),
    certificateAlternativeNames: S.optional(DomainNameList),
    tags: S.optional(TagList),
    ipAddressType: S.optional(S.String),
    tlsPolicyName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateLoadBalancer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLoadBalancerTlsCertificateRequest extends S.Class<CreateLoadBalancerTlsCertificateRequest>(
  "CreateLoadBalancerTlsCertificateRequest",
)(
  {
    loadBalancerName: S.String,
    certificateName: S.String,
    certificateDomainName: S.String,
    certificateAlternativeNames: S.optional(DomainNameList),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/CreateLoadBalancerTlsCertificate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRelationalDatabaseRequest extends S.Class<CreateRelationalDatabaseRequest>(
  "CreateRelationalDatabaseRequest",
)(
  {
    relationalDatabaseName: S.String,
    availabilityZone: S.optional(S.String),
    relationalDatabaseBlueprintId: S.String,
    relationalDatabaseBundleId: S.String,
    masterDatabaseName: S.String,
    masterUsername: S.String,
    masterUserPassword: S.optional(S.String),
    preferredBackupWindow: S.optional(S.String),
    preferredMaintenanceWindow: S.optional(S.String),
    publiclyAccessible: S.optional(S.Boolean),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/CreateRelationalDatabase",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRelationalDatabaseFromSnapshotRequest extends S.Class<CreateRelationalDatabaseFromSnapshotRequest>(
  "CreateRelationalDatabaseFromSnapshotRequest",
)(
  {
    relationalDatabaseName: S.String,
    availabilityZone: S.optional(S.String),
    publiclyAccessible: S.optional(S.Boolean),
    relationalDatabaseSnapshotName: S.optional(S.String),
    relationalDatabaseBundleId: S.optional(S.String),
    sourceRelationalDatabaseName: S.optional(S.String),
    restoreTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    useLatestRestorableTime: S.optional(S.Boolean),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/CreateRelationalDatabaseFromSnapshot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRelationalDatabaseSnapshotRequest extends S.Class<CreateRelationalDatabaseSnapshotRequest>(
  "CreateRelationalDatabaseSnapshotRequest",
)(
  {
    relationalDatabaseName: S.String,
    relationalDatabaseSnapshotName: S.String,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/CreateRelationalDatabaseSnapshot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAlarmRequest extends S.Class<DeleteAlarmRequest>(
  "DeleteAlarmRequest",
)(
  { alarmName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/ls/api/2016-11-28/DeleteAlarm/{alarmName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAutoSnapshotRequest extends S.Class<DeleteAutoSnapshotRequest>(
  "DeleteAutoSnapshotRequest",
)(
  { resourceName: S.String, date: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteAutoSnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBucketRequest extends S.Class<DeleteBucketRequest>(
  "DeleteBucketRequest",
)(
  { bucketName: S.String, forceDelete: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteBucket" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBucketAccessKeyRequest extends S.Class<DeleteBucketAccessKeyRequest>(
  "DeleteBucketAccessKeyRequest",
)(
  { bucketName: S.String, accessKeyId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteBucketAccessKey" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCertificateRequest extends S.Class<DeleteCertificateRequest>(
  "DeleteCertificateRequest",
)(
  { certificateName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteCertificate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContactMethodRequest extends S.Class<DeleteContactMethodRequest>(
  "DeleteContactMethodRequest",
)(
  { protocol: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteContactMethod" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContainerImageRequest extends S.Class<DeleteContainerImageRequest>(
  "DeleteContainerImageRequest",
)(
  {
    serviceName: S.String.pipe(T.HttpLabel()),
    image: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/ls/api/2016-11-28/container-services/{serviceName}/images/{image}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContainerImageResult extends S.Class<DeleteContainerImageResult>(
  "DeleteContainerImageResult",
)({}) {}
export class DeleteContainerServiceRequest extends S.Class<DeleteContainerServiceRequest>(
  "DeleteContainerServiceRequest",
)(
  { serviceName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/ls/api/2016-11-28/container-services/{serviceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContainerServiceResult extends S.Class<DeleteContainerServiceResult>(
  "DeleteContainerServiceResult",
)({}) {}
export class DeleteDiskRequest extends S.Class<DeleteDiskRequest>(
  "DeleteDiskRequest",
)(
  { diskName: S.String, forceDeleteAddOns: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDisk" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDiskSnapshotRequest extends S.Class<DeleteDiskSnapshotRequest>(
  "DeleteDiskSnapshotRequest",
)(
  { diskSnapshotName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDiskSnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDistributionRequest extends S.Class<DeleteDistributionRequest>(
  "DeleteDistributionRequest",
)(
  { distributionName: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDistribution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainRequest extends S.Class<DeleteDomainRequest>(
  "DeleteDomainRequest",
)(
  { domainName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDomain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DomainEntryOptions = S.Record({ key: S.String, value: S.String });
export class DomainEntry extends S.Class<DomainEntry>("DomainEntry")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  target: S.optional(S.String),
  isAlias: S.optional(S.Boolean),
  type: S.optional(S.String),
  options: S.optional(DomainEntryOptions),
}) {}
export class DeleteDomainEntryRequest extends S.Class<DeleteDomainEntryRequest>(
  "DeleteDomainEntryRequest",
)(
  { domainName: S.String, domainEntry: DomainEntry },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteDomainEntry" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInstanceRequest extends S.Class<DeleteInstanceRequest>(
  "DeleteInstanceRequest",
)(
  { instanceName: S.String, forceDeleteAddOns: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteInstance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInstanceSnapshotRequest extends S.Class<DeleteInstanceSnapshotRequest>(
  "DeleteInstanceSnapshotRequest",
)(
  { instanceSnapshotName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/DeleteInstanceSnapshot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKeyPairRequest extends S.Class<DeleteKeyPairRequest>(
  "DeleteKeyPairRequest",
)(
  { keyPairName: S.String, expectedFingerprint: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteKeyPair" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKnownHostKeysRequest extends S.Class<DeleteKnownHostKeysRequest>(
  "DeleteKnownHostKeysRequest",
)(
  { instanceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteKnownHostKeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLoadBalancerRequest extends S.Class<DeleteLoadBalancerRequest>(
  "DeleteLoadBalancerRequest",
)(
  { loadBalancerName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DeleteLoadBalancer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLoadBalancerTlsCertificateRequest extends S.Class<DeleteLoadBalancerTlsCertificateRequest>(
  "DeleteLoadBalancerTlsCertificateRequest",
)(
  {
    loadBalancerName: S.String,
    certificateName: S.String,
    force: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/DeleteLoadBalancerTlsCertificate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRelationalDatabaseRequest extends S.Class<DeleteRelationalDatabaseRequest>(
  "DeleteRelationalDatabaseRequest",
)(
  {
    relationalDatabaseName: S.String,
    skipFinalSnapshot: S.optional(S.Boolean),
    finalRelationalDatabaseSnapshotName: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/DeleteRelationalDatabase",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRelationalDatabaseSnapshotRequest extends S.Class<DeleteRelationalDatabaseSnapshotRequest>(
  "DeleteRelationalDatabaseSnapshotRequest",
)(
  { relationalDatabaseSnapshotName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/DeleteRelationalDatabaseSnapshot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachCertificateFromDistributionRequest extends S.Class<DetachCertificateFromDistributionRequest>(
  "DetachCertificateFromDistributionRequest",
)(
  { distributionName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/DetachCertificateFromDistribution",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachDiskRequest extends S.Class<DetachDiskRequest>(
  "DetachDiskRequest",
)(
  { diskName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DetachDisk" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachInstancesFromLoadBalancerRequest extends S.Class<DetachInstancesFromLoadBalancerRequest>(
  "DetachInstancesFromLoadBalancerRequest",
)(
  { loadBalancerName: S.String, instanceNames: ResourceNameList },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/DetachInstancesFromLoadBalancer",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachStaticIpRequest extends S.Class<DetachStaticIpRequest>(
  "DetachStaticIpRequest",
)(
  { staticIpName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DetachStaticIp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableAddOnRequest extends S.Class<DisableAddOnRequest>(
  "DisableAddOnRequest",
)(
  { addOnType: S.String, resourceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/DisableAddOn" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DownloadDefaultKeyPairResult extends S.Class<DownloadDefaultKeyPairResult>(
  "DownloadDefaultKeyPairResult",
)({
  publicKeyBase64: S.optional(S.String),
  privateKeyBase64: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class EnableAddOnRequest extends S.Class<EnableAddOnRequest>(
  "EnableAddOnRequest",
)(
  { resourceName: S.String, addOnRequest: AddOnRequest },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/EnableAddOn" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportSnapshotRequest extends S.Class<ExportSnapshotRequest>(
  "ExportSnapshotRequest",
)(
  { sourceSnapshotName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/ExportSnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetActiveNamesRequest extends S.Class<GetActiveNamesRequest>(
  "GetActiveNamesRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetActiveNames" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAlarmsRequest extends S.Class<GetAlarmsRequest>(
  "GetAlarmsRequest",
)(
  {
    alarmName: S.optional(S.String).pipe(T.HttpQuery("alarmName")),
    pageToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
    monitoredResourceName: S.optional(S.String).pipe(
      T.HttpQuery("monitoredResourceName"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ls/api/2016-11-28/GetAlarms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutoSnapshotsRequest extends S.Class<GetAutoSnapshotsRequest>(
  "GetAutoSnapshotsRequest",
)(
  { resourceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetAutoSnapshots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBlueprintsRequest extends S.Class<GetBlueprintsRequest>(
  "GetBlueprintsRequest",
)(
  {
    includeInactive: S.optional(S.Boolean),
    pageToken: S.optional(S.String),
    appCategory: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBlueprints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBucketAccessKeysRequest extends S.Class<GetBucketAccessKeysRequest>(
  "GetBucketAccessKeysRequest",
)(
  { bucketName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBucketAccessKeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBucketBundlesRequest extends S.Class<GetBucketBundlesRequest>(
  "GetBucketBundlesRequest",
)(
  { includeInactive: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBucketBundles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBucketMetricDataRequest extends S.Class<GetBucketMetricDataRequest>(
  "GetBucketMetricDataRequest",
)(
  {
    bucketName: S.String,
    metricName: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    period: S.Number,
    statistics: MetricStatisticList,
    unit: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBucketMetricData" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBucketsRequest extends S.Class<GetBucketsRequest>(
  "GetBucketsRequest",
)(
  {
    bucketName: S.optional(S.String),
    pageToken: S.optional(S.String),
    includeConnectedResources: S.optional(S.Boolean),
    includeCors: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBuckets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBundlesRequest extends S.Class<GetBundlesRequest>(
  "GetBundlesRequest",
)(
  {
    includeInactive: S.optional(S.Boolean),
    pageToken: S.optional(S.String),
    appCategory: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetBundles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCertificatesRequest extends S.Class<GetCertificatesRequest>(
  "GetCertificatesRequest",
)(
  {
    certificateStatuses: S.optional(CertificateStatusList),
    includeCertificateDetails: S.optional(S.Boolean),
    certificateName: S.optional(S.String),
    pageToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetCertificates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCloudFormationStackRecordsRequest extends S.Class<GetCloudFormationStackRecordsRequest>(
  "GetCloudFormationStackRecordsRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetCloudFormationStackRecords",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContactMethodsRequest extends S.Class<GetContactMethodsRequest>(
  "GetContactMethodsRequest",
)(
  {
    protocols: S.optional(ContactProtocolsList).pipe(T.HttpQuery("protocols")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ls/api/2016-11-28/GetContactMethods" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContainerImagesRequest extends S.Class<GetContainerImagesRequest>(
  "GetContainerImagesRequest",
)(
  { serviceName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/ls/api/2016-11-28/container-services/{serviceName}/images",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContainerLogRequest extends S.Class<GetContainerLogRequest>(
  "GetContainerLogRequest",
)(
  {
    serviceName: S.String.pipe(T.HttpLabel()),
    containerName: S.String.pipe(T.HttpLabel()),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endTime"),
    ),
    filterPattern: S.optional(S.String).pipe(T.HttpQuery("filterPattern")),
    pageToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/ls/api/2016-11-28/container-services/{serviceName}/containers/{containerName}/log",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContainerServiceDeploymentsRequest extends S.Class<GetContainerServiceDeploymentsRequest>(
  "GetContainerServiceDeploymentsRequest",
)(
  { serviceName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/ls/api/2016-11-28/container-services/{serviceName}/deployments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContainerServiceMetricDataRequest extends S.Class<GetContainerServiceMetricDataRequest>(
  "GetContainerServiceMetricDataRequest",
)(
  {
    serviceName: S.String.pipe(T.HttpLabel()),
    metricName: S.String.pipe(T.HttpQuery("metricName")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
    period: S.Number.pipe(T.HttpQuery("period")),
    statistics: MetricStatisticList.pipe(T.HttpQuery("statistics")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/ls/api/2016-11-28/container-services/{serviceName}/metrics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContainerServicesRequest extends S.Class<GetContainerServicesRequest>(
  "GetContainerServicesRequest",
)(
  { serviceName: S.optional(S.String).pipe(T.HttpQuery("serviceName")) },
  T.all(
    T.Http({ method: "GET", uri: "/ls/api/2016-11-28/container-services" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCostEstimateRequest extends S.Class<GetCostEstimateRequest>(
  "GetCostEstimateRequest",
)(
  {
    resourceName: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/budgettracker/getCostEstimate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDiskRequest extends S.Class<GetDiskRequest>("GetDiskRequest")(
  { diskName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDisk" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDisksRequest extends S.Class<GetDisksRequest>(
  "GetDisksRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDisks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDiskSnapshotRequest extends S.Class<GetDiskSnapshotRequest>(
  "GetDiskSnapshotRequest",
)(
  { diskSnapshotName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDiskSnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDiskSnapshotsRequest extends S.Class<GetDiskSnapshotsRequest>(
  "GetDiskSnapshotsRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDiskSnapshots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDistributionLatestCacheResetRequest extends S.Class<GetDistributionLatestCacheResetRequest>(
  "GetDistributionLatestCacheResetRequest",
)(
  { distributionName: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetDistributionLatestCacheReset",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDistributionMetricDataRequest extends S.Class<GetDistributionMetricDataRequest>(
  "GetDistributionMetricDataRequest",
)(
  {
    distributionName: S.String,
    metricName: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    period: S.Number,
    unit: S.String,
    statistics: MetricStatisticList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetDistributionMetricData",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDistributionsRequest extends S.Class<GetDistributionsRequest>(
  "GetDistributionsRequest",
)(
  { distributionName: S.optional(S.String), pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDistributions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainRequest extends S.Class<GetDomainRequest>(
  "GetDomainRequest",
)(
  { domainName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDomain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainsRequest extends S.Class<GetDomainsRequest>(
  "GetDomainsRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetDomains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExportSnapshotRecordsRequest extends S.Class<GetExportSnapshotRecordsRequest>(
  "GetExportSnapshotRecordsRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetExportSnapshotRecords",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstanceRequest extends S.Class<GetInstanceRequest>(
  "GetInstanceRequest",
)(
  { instanceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstanceAccessDetailsRequest extends S.Class<GetInstanceAccessDetailsRequest>(
  "GetInstanceAccessDetailsRequest",
)(
  { instanceName: S.String, protocol: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetInstanceAccessDetails",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstanceMetricDataRequest extends S.Class<GetInstanceMetricDataRequest>(
  "GetInstanceMetricDataRequest",
)(
  {
    instanceName: S.String,
    metricName: S.String,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    unit: S.String,
    statistics: MetricStatisticList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstanceMetricData" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstancePortStatesRequest extends S.Class<GetInstancePortStatesRequest>(
  "GetInstancePortStatesRequest",
)(
  { instanceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstancePortStates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstancesRequest extends S.Class<GetInstancesRequest>(
  "GetInstancesRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstanceSnapshotRequest extends S.Class<GetInstanceSnapshotRequest>(
  "GetInstanceSnapshotRequest",
)(
  { instanceSnapshotName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstanceSnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstanceSnapshotsRequest extends S.Class<GetInstanceSnapshotsRequest>(
  "GetInstanceSnapshotsRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstanceSnapshots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstanceStateRequest extends S.Class<GetInstanceStateRequest>(
  "GetInstanceStateRequest",
)(
  { instanceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetInstanceState" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKeyPairRequest extends S.Class<GetKeyPairRequest>(
  "GetKeyPairRequest",
)(
  { keyPairName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetKeyPair" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKeyPairsRequest extends S.Class<GetKeyPairsRequest>(
  "GetKeyPairsRequest",
)(
  {
    pageToken: S.optional(S.String),
    includeDefaultKeyPair: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetKeyPairs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoadBalancerRequest extends S.Class<GetLoadBalancerRequest>(
  "GetLoadBalancerRequest",
)(
  { loadBalancerName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetLoadBalancer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoadBalancerMetricDataRequest extends S.Class<GetLoadBalancerMetricDataRequest>(
  "GetLoadBalancerMetricDataRequest",
)(
  {
    loadBalancerName: S.String,
    metricName: S.String,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    unit: S.String,
    statistics: MetricStatisticList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetLoadBalancerMetricData",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoadBalancersRequest extends S.Class<GetLoadBalancersRequest>(
  "GetLoadBalancersRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetLoadBalancers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoadBalancerTlsCertificatesRequest extends S.Class<GetLoadBalancerTlsCertificatesRequest>(
  "GetLoadBalancerTlsCertificatesRequest",
)(
  { loadBalancerName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetLoadBalancerTlsCertificates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoadBalancerTlsPoliciesRequest extends S.Class<GetLoadBalancerTlsPoliciesRequest>(
  "GetLoadBalancerTlsPoliciesRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetLoadBalancerTlsPolicies",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOperationRequest extends S.Class<GetOperationRequest>(
  "GetOperationRequest",
)(
  { operationId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetOperation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOperationsRequest extends S.Class<GetOperationsRequest>(
  "GetOperationsRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetOperations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOperationsForResourceRequest extends S.Class<GetOperationsForResourceRequest>(
  "GetOperationsForResourceRequest",
)(
  { resourceName: S.String, pageToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetOperationsForResource",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRegionsRequest extends S.Class<GetRegionsRequest>(
  "GetRegionsRequest",
)(
  {
    includeAvailabilityZones: S.optional(S.Boolean),
    includeRelationalDatabaseAvailabilityZones: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetRegions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseRequest extends S.Class<GetRelationalDatabaseRequest>(
  "GetRelationalDatabaseRequest",
)(
  { relationalDatabaseName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetRelationalDatabase" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseBlueprintsRequest extends S.Class<GetRelationalDatabaseBlueprintsRequest>(
  "GetRelationalDatabaseBlueprintsRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseBlueprints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseBundlesRequest extends S.Class<GetRelationalDatabaseBundlesRequest>(
  "GetRelationalDatabaseBundlesRequest",
)(
  { pageToken: S.optional(S.String), includeInactive: S.optional(S.Boolean) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseBundles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseEventsRequest extends S.Class<GetRelationalDatabaseEventsRequest>(
  "GetRelationalDatabaseEventsRequest",
)(
  {
    relationalDatabaseName: S.String,
    durationInMinutes: S.optional(S.Number),
    pageToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseEvents",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseLogEventsRequest extends S.Class<GetRelationalDatabaseLogEventsRequest>(
  "GetRelationalDatabaseLogEventsRequest",
)(
  {
    relationalDatabaseName: S.String,
    logStreamName: S.String,
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startFromHead: S.optional(S.Boolean),
    pageToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseLogEvents",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseLogStreamsRequest extends S.Class<GetRelationalDatabaseLogStreamsRequest>(
  "GetRelationalDatabaseLogStreamsRequest",
)(
  { relationalDatabaseName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseLogStreams",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseMasterUserPasswordRequest extends S.Class<GetRelationalDatabaseMasterUserPasswordRequest>(
  "GetRelationalDatabaseMasterUserPasswordRequest",
)(
  { relationalDatabaseName: S.String, passwordVersion: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseMasterUserPassword",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseMetricDataRequest extends S.Class<GetRelationalDatabaseMetricDataRequest>(
  "GetRelationalDatabaseMetricDataRequest",
)(
  {
    relationalDatabaseName: S.String,
    metricName: S.String,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    unit: S.String,
    statistics: MetricStatisticList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseMetricData",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseParametersRequest extends S.Class<GetRelationalDatabaseParametersRequest>(
  "GetRelationalDatabaseParametersRequest",
)(
  { relationalDatabaseName: S.String, pageToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseParameters",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabasesRequest extends S.Class<GetRelationalDatabasesRequest>(
  "GetRelationalDatabasesRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseSnapshotRequest extends S.Class<GetRelationalDatabaseSnapshotRequest>(
  "GetRelationalDatabaseSnapshotRequest",
)(
  { relationalDatabaseSnapshotName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseSnapshot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationalDatabaseSnapshotsRequest extends S.Class<GetRelationalDatabaseSnapshotsRequest>(
  "GetRelationalDatabaseSnapshotsRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/GetRelationalDatabaseSnapshots",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSetupHistoryRequest extends S.Class<GetSetupHistoryRequest>(
  "GetSetupHistoryRequest",
)(
  { resourceName: S.String, pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/get-setup-history" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStaticIpRequest extends S.Class<GetStaticIpRequest>(
  "GetStaticIpRequest",
)(
  { staticIpName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetStaticIp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStaticIpsRequest extends S.Class<GetStaticIpsRequest>(
  "GetStaticIpsRequest",
)(
  { pageToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/GetStaticIps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportKeyPairRequest extends S.Class<ImportKeyPairRequest>(
  "ImportKeyPairRequest",
)(
  { keyPairName: S.String, publicKeyBase64: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/ImportKeyPair" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IsVpcPeeredResult extends S.Class<IsVpcPeeredResult>(
  "IsVpcPeeredResult",
)({ isPeered: S.optional(S.Boolean) }) {}
export class OpenInstancePublicPortsRequest extends S.Class<OpenInstancePublicPortsRequest>(
  "OpenInstancePublicPortsRequest",
)(
  { portInfo: PortInfo, instanceName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/OpenInstancePublicPorts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAlarmRequest extends S.Class<PutAlarmRequest>(
  "PutAlarmRequest",
)(
  {
    alarmName: S.String,
    metricName: S.String,
    monitoredResourceName: S.String,
    comparisonOperator: S.String,
    threshold: S.Number,
    evaluationPeriods: S.Number,
    datapointsToAlarm: S.optional(S.Number),
    treatMissingData: S.optional(S.String),
    contactProtocols: S.optional(ContactProtocolsList),
    notificationTriggers: S.optional(NotificationTriggerList),
    notificationEnabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/PutAlarm" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutInstancePublicPortsRequest extends S.Class<PutInstancePublicPortsRequest>(
  "PutInstancePublicPortsRequest",
)(
  { portInfos: PortInfoList, instanceName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/PutInstancePublicPorts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RebootInstanceRequest extends S.Class<RebootInstanceRequest>(
  "RebootInstanceRequest",
)(
  { instanceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/RebootInstance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RebootRelationalDatabaseRequest extends S.Class<RebootRelationalDatabaseRequest>(
  "RebootRelationalDatabaseRequest",
)(
  { relationalDatabaseName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/RebootRelationalDatabase",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterContainerImageRequest extends S.Class<RegisterContainerImageRequest>(
  "RegisterContainerImageRequest",
)(
  {
    serviceName: S.String.pipe(T.HttpLabel()),
    label: S.String,
    digest: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/container-services/{serviceName}/images",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReleaseStaticIpRequest extends S.Class<ReleaseStaticIpRequest>(
  "ReleaseStaticIpRequest",
)(
  { staticIpName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/ReleaseStaticIp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetDistributionCacheRequest extends S.Class<ResetDistributionCacheRequest>(
  "ResetDistributionCacheRequest",
)(
  { distributionName: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/ResetDistributionCache",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendContactMethodVerificationRequest extends S.Class<SendContactMethodVerificationRequest>(
  "SendContactMethodVerificationRequest",
)(
  { protocol: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/SendContactMethodVerification",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetIpAddressTypeRequest extends S.Class<SetIpAddressTypeRequest>(
  "SetIpAddressTypeRequest",
)(
  {
    resourceType: S.String,
    resourceName: S.String,
    ipAddressType: S.String,
    acceptBundleUpdate: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/SetIpAddressType" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetResourceAccessForBucketRequest extends S.Class<SetResourceAccessForBucketRequest>(
  "SetResourceAccessForBucketRequest",
)(
  { resourceName: S.String, bucketName: S.String, access: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/SetResourceAccessForBucket",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetupInstanceHttpsRequest extends S.Class<SetupInstanceHttpsRequest>(
  "SetupInstanceHttpsRequest",
)(
  {
    instanceName: S.String,
    emailAddress: S.String,
    domainNames: SetupDomainNameList,
    certificateProvider: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/setup-instance-https" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartGUISessionRequest extends S.Class<StartGUISessionRequest>(
  "StartGUISessionRequest",
)(
  { resourceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/start-gui-session" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartInstanceRequest extends S.Class<StartInstanceRequest>(
  "StartInstanceRequest",
)(
  { instanceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/StartInstance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartRelationalDatabaseRequest extends S.Class<StartRelationalDatabaseRequest>(
  "StartRelationalDatabaseRequest",
)(
  { relationalDatabaseName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/StartRelationalDatabase",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopGUISessionRequest extends S.Class<StopGUISessionRequest>(
  "StopGUISessionRequest",
)(
  { resourceName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/stop-gui-session" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopInstanceRequest extends S.Class<StopInstanceRequest>(
  "StopInstanceRequest",
)(
  { instanceName: S.String, force: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/StopInstance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopRelationalDatabaseRequest extends S.Class<StopRelationalDatabaseRequest>(
  "StopRelationalDatabaseRequest",
)(
  {
    relationalDatabaseName: S.String,
    relationalDatabaseSnapshotName: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/StopRelationalDatabase",
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
  { resourceName: S.String, resourceArn: S.optional(S.String), tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/TagResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TestAlarmRequest extends S.Class<TestAlarmRequest>(
  "TestAlarmRequest",
)(
  {
    alarmName: S.String.pipe(T.HttpLabel()),
    state: S.String.pipe(T.HttpQuery("state")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ls/api/2016-11-28/TestAlarm/{alarmName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResourceLocation extends S.Class<ResourceLocation>(
  "ResourceLocation",
)({
  availabilityZone: S.optional(S.String),
  regionName: S.optional(S.String),
}) {}
export class Operation extends S.Class<Operation>("Operation")({
  id: S.optional(S.String),
  resourceName: S.optional(S.String),
  resourceType: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  isTerminal: S.optional(S.Boolean),
  operationDetails: S.optional(S.String),
  operationType: S.optional(S.String),
  status: S.optional(S.String),
  statusChangedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  errorCode: S.optional(S.String),
  errorDetails: S.optional(S.String),
}) {}
export class UnpeerVpcResult extends S.Class<UnpeerVpcResult>(
  "UnpeerVpcResult",
)({ operation: S.optional(Operation) }) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceName: S.String,
    resourceArn: S.optional(S.String),
    tagKeys: TagKeyList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UntagResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBucketBundleRequest extends S.Class<UpdateBucketBundleRequest>(
  "UpdateBucketBundleRequest",
)(
  { bucketName: S.String, bundleId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UpdateBucketBundle" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ContainerServicePublicDomainsList = S.Array(S.String);
export const ContainerServicePublicDomains = S.Record({
  key: S.String,
  value: ContainerServicePublicDomainsList,
});
export class ContainerServiceECRImagePullerRoleRequest extends S.Class<ContainerServiceECRImagePullerRoleRequest>(
  "ContainerServiceECRImagePullerRoleRequest",
)({ isActive: S.optional(S.Boolean) }) {}
export class PrivateRegistryAccessRequest extends S.Class<PrivateRegistryAccessRequest>(
  "PrivateRegistryAccessRequest",
)({
  ecrImagePullerRole: S.optional(ContainerServiceECRImagePullerRoleRequest),
}) {}
export class UpdateContainerServiceRequest extends S.Class<UpdateContainerServiceRequest>(
  "UpdateContainerServiceRequest",
)(
  {
    serviceName: S.String.pipe(T.HttpLabel()),
    power: S.optional(S.String),
    scale: S.optional(S.Number),
    isDisabled: S.optional(S.Boolean),
    publicDomainNames: S.optional(ContainerServicePublicDomains),
    privateRegistryAccess: S.optional(PrivateRegistryAccessRequest),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/ls/api/2016-11-28/container-services/{serviceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InputOrigin extends S.Class<InputOrigin>("InputOrigin")({
  name: S.optional(S.String),
  regionName: S.optional(S.String),
  protocolPolicy: S.optional(S.String),
  responseTimeout: S.optional(S.Number),
}) {}
export class CacheBehavior extends S.Class<CacheBehavior>("CacheBehavior")({
  behavior: S.optional(S.String),
}) {}
export class CookieObject extends S.Class<CookieObject>("CookieObject")({
  option: S.optional(S.String),
  cookiesAllowList: S.optional(StringList),
}) {}
export const HeaderForwardList = S.Array(S.String);
export class HeaderObject extends S.Class<HeaderObject>("HeaderObject")({
  option: S.optional(S.String),
  headersAllowList: S.optional(HeaderForwardList),
}) {}
export class QueryStringObject extends S.Class<QueryStringObject>(
  "QueryStringObject",
)({
  option: S.optional(S.Boolean),
  queryStringsAllowList: S.optional(StringList),
}) {}
export class CacheSettings extends S.Class<CacheSettings>("CacheSettings")({
  defaultTTL: S.optional(S.Number),
  minimumTTL: S.optional(S.Number),
  maximumTTL: S.optional(S.Number),
  allowedHTTPMethods: S.optional(S.String),
  cachedHTTPMethods: S.optional(S.String),
  forwardedCookies: S.optional(CookieObject),
  forwardedHeaders: S.optional(HeaderObject),
  forwardedQueryStrings: S.optional(QueryStringObject),
}) {}
export class CacheBehaviorPerPath extends S.Class<CacheBehaviorPerPath>(
  "CacheBehaviorPerPath",
)({ path: S.optional(S.String), behavior: S.optional(S.String) }) {}
export const CacheBehaviorList = S.Array(CacheBehaviorPerPath);
export class UpdateDistributionRequest extends S.Class<UpdateDistributionRequest>(
  "UpdateDistributionRequest",
)(
  {
    distributionName: S.String,
    origin: S.optional(InputOrigin),
    defaultCacheBehavior: S.optional(CacheBehavior),
    cacheBehaviorSettings: S.optional(CacheSettings),
    cacheBehaviors: S.optional(CacheBehaviorList),
    isEnabled: S.optional(S.Boolean),
    viewerMinimumTlsProtocolVersion: S.optional(S.String),
    certificateName: S.optional(S.String),
    useDefaultCertificate: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UpdateDistribution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDistributionBundleRequest extends S.Class<UpdateDistributionBundleRequest>(
  "UpdateDistributionBundleRequest",
)(
  { distributionName: S.optional(S.String), bundleId: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/UpdateDistributionBundle",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDomainEntryRequest extends S.Class<UpdateDomainEntryRequest>(
  "UpdateDomainEntryRequest",
)(
  { domainName: S.String, domainEntry: DomainEntry },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UpdateDomainEntry" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateInstanceMetadataOptionsRequest extends S.Class<UpdateInstanceMetadataOptionsRequest>(
  "UpdateInstanceMetadataOptionsRequest",
)(
  {
    instanceName: S.String,
    httpTokens: S.optional(S.String),
    httpEndpoint: S.optional(S.String),
    httpPutResponseHopLimit: S.optional(S.Number),
    httpProtocolIpv6: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/UpdateInstanceMetadataOptions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLoadBalancerAttributeRequest extends S.Class<UpdateLoadBalancerAttributeRequest>(
  "UpdateLoadBalancerAttributeRequest",
)(
  {
    loadBalancerName: S.String,
    attributeName: S.String,
    attributeValue: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/UpdateLoadBalancerAttribute",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRelationalDatabaseRequest extends S.Class<UpdateRelationalDatabaseRequest>(
  "UpdateRelationalDatabaseRequest",
)(
  {
    relationalDatabaseName: S.String,
    masterUserPassword: S.optional(S.String),
    rotateMasterUserPassword: S.optional(S.Boolean),
    preferredBackupWindow: S.optional(S.String),
    preferredMaintenanceWindow: S.optional(S.String),
    enableBackupRetention: S.optional(S.Boolean),
    disableBackupRetention: S.optional(S.Boolean),
    publiclyAccessible: S.optional(S.Boolean),
    applyImmediately: S.optional(S.Boolean),
    caCertificateIdentifier: S.optional(S.String),
    relationalDatabaseBlueprintId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/UpdateRelationalDatabase",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const OperationList = S.Array(Operation);
export class InstanceEntry extends S.Class<InstanceEntry>("InstanceEntry")({
  sourceName: S.String,
  instanceType: S.String,
  portInfoSource: S.String,
  userData: S.optional(S.String),
  availabilityZone: S.String,
}) {}
export const InstanceEntryList = S.Array(InstanceEntry);
export const Environment = S.Record({ key: S.String, value: S.String });
export const PortMap = S.Record({ key: S.String, value: S.String });
export class Container extends S.Class<Container>("Container")({
  image: S.optional(S.String),
  command: S.optional(StringList),
  environment: S.optional(Environment),
  ports: S.optional(PortMap),
}) {}
export const ContainerMap = S.Record({ key: S.String, value: Container });
export class ContainerServiceHealthCheckConfig extends S.Class<ContainerServiceHealthCheckConfig>(
  "ContainerServiceHealthCheckConfig",
)({
  healthyThreshold: S.optional(S.Number),
  unhealthyThreshold: S.optional(S.Number),
  timeoutSeconds: S.optional(S.Number),
  intervalSeconds: S.optional(S.Number),
  path: S.optional(S.String),
  successCodes: S.optional(S.String),
}) {}
export class EndpointRequest extends S.Class<EndpointRequest>(
  "EndpointRequest",
)({
  containerName: S.String,
  containerPort: S.Number,
  healthCheck: S.optional(ContainerServiceHealthCheckConfig),
}) {}
export class ContainerServiceDeploymentRequest extends S.Class<ContainerServiceDeploymentRequest>(
  "ContainerServiceDeploymentRequest",
)({
  containers: S.optional(ContainerMap),
  publicEndpoint: S.optional(EndpointRequest),
}) {}
export class ContainerServiceRegistryLogin extends S.Class<ContainerServiceRegistryLogin>(
  "ContainerServiceRegistryLogin",
)({
  username: S.optional(S.String),
  password: S.optional(S.String),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  registry: S.optional(S.String),
}) {}
export class AccessKeyLastUsed extends S.Class<AccessKeyLastUsed>(
  "AccessKeyLastUsed",
)({
  lastUsedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  region: S.optional(S.String),
  serviceName: S.optional(S.String),
}) {}
export class AccessKey extends S.Class<AccessKey>("AccessKey")({
  accessKeyId: S.optional(S.String),
  secretAccessKey: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUsed: S.optional(AccessKeyLastUsed),
}) {}
export const AccessKeyList = S.Array(AccessKey);
export class ResourceRecord extends S.Class<ResourceRecord>("ResourceRecord")({
  name: S.optional(S.String),
  type: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export class DnsRecordCreationState extends S.Class<DnsRecordCreationState>(
  "DnsRecordCreationState",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class DomainValidationRecord extends S.Class<DomainValidationRecord>(
  "DomainValidationRecord",
)({
  domainName: S.optional(S.String),
  resourceRecord: S.optional(ResourceRecord),
  dnsRecordCreationState: S.optional(DnsRecordCreationState),
  validationStatus: S.optional(S.String),
}) {}
export const DomainValidationRecordList = S.Array(DomainValidationRecord);
export class RenewalSummary extends S.Class<RenewalSummary>("RenewalSummary")({
  domainValidationRecords: S.optional(DomainValidationRecordList),
  renewalStatus: S.optional(S.String),
  renewalStatusReason: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Certificate extends S.Class<Certificate>("Certificate")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  domainName: S.optional(S.String),
  status: S.optional(S.String),
  serialNumber: S.optional(S.String),
  subjectAlternativeNames: S.optional(SubjectAlternativeNameList),
  domainValidationRecords: S.optional(DomainValidationRecordList),
  requestFailureReason: S.optional(S.String),
  inUseResourceCount: S.optional(S.Number),
  keyAlgorithm: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  issuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  issuerCA: S.optional(S.String),
  notBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  notAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  eligibleToRenew: S.optional(S.String),
  renewalSummary: S.optional(RenewalSummary),
  revokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  revocationReason: S.optional(S.String),
  tags: S.optional(TagList),
  supportCode: S.optional(S.String),
}) {}
export class CertificateSummary extends S.Class<CertificateSummary>(
  "CertificateSummary",
)({
  certificateArn: S.optional(S.String),
  certificateName: S.optional(S.String),
  domainName: S.optional(S.String),
  certificateDetail: S.optional(Certificate),
  tags: S.optional(TagList),
}) {}
export const CertificateSummaryList = S.Array(CertificateSummary);
export const ContainerServiceMetadataEntry = S.Record({
  key: S.String,
  value: S.String,
});
export const ContainerServiceMetadataEntryList = S.Array(
  ContainerServiceMetadataEntry,
);
export class ContainerServicePower extends S.Class<ContainerServicePower>(
  "ContainerServicePower",
)({
  powerId: S.optional(S.String),
  price: S.optional(S.Number),
  cpuCount: S.optional(S.Number),
  ramSizeInGb: S.optional(S.Number),
  name: S.optional(S.String),
  isActive: S.optional(S.Boolean),
}) {}
export const ContainerServicePowerList = S.Array(ContainerServicePower);
export class AddOn extends S.Class<AddOn>("AddOn")({
  name: S.optional(S.String),
  status: S.optional(S.String),
  snapshotTimeOfDay: S.optional(S.String),
  nextSnapshotTimeOfDay: S.optional(S.String),
  threshold: S.optional(S.String),
  duration: S.optional(S.String),
}) {}
export const AddOnList = S.Array(AddOn);
export class Disk extends S.Class<Disk>("Disk")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  addOns: S.optional(AddOnList),
  sizeInGb: S.optional(S.Number),
  isSystemDisk: S.optional(S.Boolean),
  iops: S.optional(S.Number),
  path: S.optional(S.String),
  state: S.optional(S.String),
  attachedTo: S.optional(S.String),
  isAttached: S.optional(S.Boolean),
  attachmentState: S.optional(S.String),
  gbInUse: S.optional(S.Number),
  autoMountStatus: S.optional(S.String),
}) {}
export const DiskList = S.Array(Disk);
export class DiskSnapshot extends S.Class<DiskSnapshot>("DiskSnapshot")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  sizeInGb: S.optional(S.Number),
  state: S.optional(S.String),
  progress: S.optional(S.String),
  fromDiskName: S.optional(S.String),
  fromDiskArn: S.optional(S.String),
  fromInstanceName: S.optional(S.String),
  fromInstanceArn: S.optional(S.String),
  isFromAutoSnapshot: S.optional(S.Boolean),
}) {}
export const DiskSnapshotList = S.Array(DiskSnapshot);
export class DistributionBundle extends S.Class<DistributionBundle>(
  "DistributionBundle",
)({
  bundleId: S.optional(S.String),
  name: S.optional(S.String),
  price: S.optional(S.Number),
  transferPerMonthInGb: S.optional(S.Number),
  isActive: S.optional(S.Boolean),
}) {}
export const DistributionBundleList = S.Array(DistributionBundle);
export const DomainEntryList = S.Array(DomainEntry);
export class NameServersUpdateState extends S.Class<NameServersUpdateState>(
  "NameServersUpdateState",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class R53HostedZoneDeletionState extends S.Class<R53HostedZoneDeletionState>(
  "R53HostedZoneDeletionState",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class RegisteredDomainDelegationInfo extends S.Class<RegisteredDomainDelegationInfo>(
  "RegisteredDomainDelegationInfo",
)({
  nameServersUpdateState: S.optional(NameServersUpdateState),
  r53HostedZoneDeletionState: S.optional(R53HostedZoneDeletionState),
}) {}
export class Domain extends S.Class<Domain>("Domain")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  domainEntries: S.optional(DomainEntryList),
  registeredDomainDelegationInfo: S.optional(RegisteredDomainDelegationInfo),
}) {}
export const DomainList = S.Array(Domain);
export const Ipv6AddressList = S.Array(S.String);
export class InstanceHardware extends S.Class<InstanceHardware>(
  "InstanceHardware",
)({
  cpuCount: S.optional(S.Number),
  disks: S.optional(DiskList),
  ramSizeInGb: S.optional(S.Number),
}) {}
export class MonthlyTransfer extends S.Class<MonthlyTransfer>(
  "MonthlyTransfer",
)({ gbPerMonthAllocated: S.optional(S.Number) }) {}
export class InstancePortInfo extends S.Class<InstancePortInfo>(
  "InstancePortInfo",
)({
  fromPort: S.optional(S.Number),
  toPort: S.optional(S.Number),
  protocol: S.optional(S.String),
  accessFrom: S.optional(S.String),
  accessType: S.optional(S.String),
  commonName: S.optional(S.String),
  accessDirection: S.optional(S.String),
  cidrs: S.optional(StringList),
  ipv6Cidrs: S.optional(StringList),
  cidrListAliases: S.optional(StringList),
}) {}
export const InstancePortInfoList = S.Array(InstancePortInfo);
export class InstanceNetworking extends S.Class<InstanceNetworking>(
  "InstanceNetworking",
)({
  monthlyTransfer: S.optional(MonthlyTransfer),
  ports: S.optional(InstancePortInfoList),
}) {}
export class InstanceState extends S.Class<InstanceState>("InstanceState")({
  code: S.optional(S.Number),
  name: S.optional(S.String),
}) {}
export class InstanceMetadataOptions extends S.Class<InstanceMetadataOptions>(
  "InstanceMetadataOptions",
)({
  state: S.optional(S.String),
  httpTokens: S.optional(S.String),
  httpEndpoint: S.optional(S.String),
  httpPutResponseHopLimit: S.optional(S.Number),
  httpProtocolIpv6: S.optional(S.String),
}) {}
export class Instance extends S.Class<Instance>("Instance")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  blueprintId: S.optional(S.String),
  blueprintName: S.optional(S.String),
  bundleId: S.optional(S.String),
  addOns: S.optional(AddOnList),
  isStaticIp: S.optional(S.Boolean),
  privateIpAddress: S.optional(S.String),
  publicIpAddress: S.optional(S.String),
  ipv6Addresses: S.optional(Ipv6AddressList),
  ipAddressType: S.optional(S.String),
  hardware: S.optional(InstanceHardware),
  networking: S.optional(InstanceNetworking),
  state: S.optional(InstanceState),
  username: S.optional(S.String),
  sshKeyName: S.optional(S.String),
  metadataOptions: S.optional(InstanceMetadataOptions),
}) {}
export const InstanceList = S.Array(Instance);
export class InstanceSnapshot extends S.Class<InstanceSnapshot>(
  "InstanceSnapshot",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  state: S.optional(S.String),
  progress: S.optional(S.String),
  fromAttachedDisks: S.optional(DiskList),
  fromInstanceName: S.optional(S.String),
  fromInstanceArn: S.optional(S.String),
  fromBlueprintId: S.optional(S.String),
  fromBundleId: S.optional(S.String),
  isFromAutoSnapshot: S.optional(S.Boolean),
  sizeInGb: S.optional(S.Number),
}) {}
export const InstanceSnapshotList = S.Array(InstanceSnapshot);
export class KeyPair extends S.Class<KeyPair>("KeyPair")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  fingerprint: S.optional(S.String),
}) {}
export const KeyPairList = S.Array(KeyPair);
export const PortList = S.Array(S.Number);
export class InstanceHealthSummary extends S.Class<InstanceHealthSummary>(
  "InstanceHealthSummary",
)({
  instanceName: S.optional(S.String),
  instanceHealth: S.optional(S.String),
  instanceHealthReason: S.optional(S.String),
}) {}
export const InstanceHealthSummaryList = S.Array(InstanceHealthSummary);
export class LoadBalancerTlsCertificateSummary extends S.Class<LoadBalancerTlsCertificateSummary>(
  "LoadBalancerTlsCertificateSummary",
)({ name: S.optional(S.String), isAttached: S.optional(S.Boolean) }) {}
export const LoadBalancerTlsCertificateSummaryList = S.Array(
  LoadBalancerTlsCertificateSummary,
);
export const LoadBalancerConfigurationOptions = S.Record({
  key: S.String,
  value: S.String,
});
export class LoadBalancer extends S.Class<LoadBalancer>("LoadBalancer")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  dnsName: S.optional(S.String),
  state: S.optional(S.String),
  protocol: S.optional(S.String),
  publicPorts: S.optional(PortList),
  healthCheckPath: S.optional(S.String),
  instancePort: S.optional(S.Number),
  instanceHealthSummary: S.optional(InstanceHealthSummaryList),
  tlsCertificateSummaries: S.optional(LoadBalancerTlsCertificateSummaryList),
  configurationOptions: S.optional(LoadBalancerConfigurationOptions),
  ipAddressType: S.optional(S.String),
  httpsRedirectionEnabled: S.optional(S.Boolean),
  tlsPolicyName: S.optional(S.String),
}) {}
export const LoadBalancerList = S.Array(LoadBalancer);
export class RelationalDatabaseHardware extends S.Class<RelationalDatabaseHardware>(
  "RelationalDatabaseHardware",
)({
  cpuCount: S.optional(S.Number),
  diskSizeInGb: S.optional(S.Number),
  ramSizeInGb: S.optional(S.Number),
}) {}
export class PendingModifiedRelationalDatabaseValues extends S.Class<PendingModifiedRelationalDatabaseValues>(
  "PendingModifiedRelationalDatabaseValues",
)({
  masterUserPassword: S.optional(S.String),
  engineVersion: S.optional(S.String),
  backupRetentionEnabled: S.optional(S.Boolean),
}) {}
export class RelationalDatabaseEndpoint extends S.Class<RelationalDatabaseEndpoint>(
  "RelationalDatabaseEndpoint",
)({ port: S.optional(S.Number), address: S.optional(S.String) }) {}
export class PendingMaintenanceAction extends S.Class<PendingMaintenanceAction>(
  "PendingMaintenanceAction",
)({
  action: S.optional(S.String),
  description: S.optional(S.String),
  currentApplyDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PendingMaintenanceActionList = S.Array(PendingMaintenanceAction);
export class RelationalDatabase extends S.Class<RelationalDatabase>(
  "RelationalDatabase",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  relationalDatabaseBlueprintId: S.optional(S.String),
  relationalDatabaseBundleId: S.optional(S.String),
  masterDatabaseName: S.optional(S.String),
  hardware: S.optional(RelationalDatabaseHardware),
  state: S.optional(S.String),
  secondaryAvailabilityZone: S.optional(S.String),
  backupRetentionEnabled: S.optional(S.Boolean),
  pendingModifiedValues: S.optional(PendingModifiedRelationalDatabaseValues),
  engine: S.optional(S.String),
  engineVersion: S.optional(S.String),
  latestRestorableTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  masterUsername: S.optional(S.String),
  parameterApplyStatus: S.optional(S.String),
  preferredBackupWindow: S.optional(S.String),
  preferredMaintenanceWindow: S.optional(S.String),
  publiclyAccessible: S.optional(S.Boolean),
  masterEndpoint: S.optional(RelationalDatabaseEndpoint),
  pendingMaintenanceActions: S.optional(PendingMaintenanceActionList),
  caCertificateIdentifier: S.optional(S.String),
}) {}
export const RelationalDatabaseList = S.Array(RelationalDatabase);
export class RelationalDatabaseSnapshot extends S.Class<RelationalDatabaseSnapshot>(
  "RelationalDatabaseSnapshot",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  engine: S.optional(S.String),
  engineVersion: S.optional(S.String),
  sizeInGb: S.optional(S.Number),
  state: S.optional(S.String),
  fromRelationalDatabaseName: S.optional(S.String),
  fromRelationalDatabaseArn: S.optional(S.String),
  fromRelationalDatabaseBundleId: S.optional(S.String),
  fromRelationalDatabaseBlueprintId: S.optional(S.String),
}) {}
export const RelationalDatabaseSnapshotList = S.Array(
  RelationalDatabaseSnapshot,
);
export class StaticIp extends S.Class<StaticIp>("StaticIp")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  ipAddress: S.optional(S.String),
  attachedTo: S.optional(S.String),
  isAttached: S.optional(S.Boolean),
}) {}
export const StaticIpList = S.Array(StaticIp);
export class AccessRules extends S.Class<AccessRules>("AccessRules")({
  getObject: S.optional(S.String),
  allowPublicOverrides: S.optional(S.Boolean),
}) {}
export class BucketAccessLogConfig extends S.Class<BucketAccessLogConfig>(
  "BucketAccessLogConfig",
)({
  enabled: S.Boolean,
  destination: S.optional(S.String),
  prefix: S.optional(S.String),
}) {}
export class RelationalDatabaseParameter extends S.Class<RelationalDatabaseParameter>(
  "RelationalDatabaseParameter",
)({
  allowedValues: S.optional(S.String),
  applyMethod: S.optional(S.String),
  applyType: S.optional(S.String),
  dataType: S.optional(S.String),
  description: S.optional(S.String),
  isModifiable: S.optional(S.Boolean),
  parameterName: S.optional(S.String),
  parameterValue: S.optional(S.String),
}) {}
export const RelationalDatabaseParameterList = S.Array(
  RelationalDatabaseParameter,
);
export const BucketCorsAllowedMethods = S.Array(S.String);
export const BucketCorsAllowedOrigins = S.Array(S.String);
export const BucketCorsAllowedHeaders = S.Array(S.String);
export const BucketCorsExposeHeaders = S.Array(S.String);
export class AllocateStaticIpResult extends S.Class<AllocateStaticIpResult>(
  "AllocateStaticIpResult",
)({ operations: S.optional(OperationList) }) {}
export class AttachCertificateToDistributionResult extends S.Class<AttachCertificateToDistributionResult>(
  "AttachCertificateToDistributionResult",
)({ operation: S.optional(Operation) }) {}
export class AttachDiskResult extends S.Class<AttachDiskResult>(
  "AttachDiskResult",
)({ operations: S.optional(OperationList) }) {}
export class AttachInstancesToLoadBalancerResult extends S.Class<AttachInstancesToLoadBalancerResult>(
  "AttachInstancesToLoadBalancerResult",
)({ operations: S.optional(OperationList) }) {}
export class AttachLoadBalancerTlsCertificateResult extends S.Class<AttachLoadBalancerTlsCertificateResult>(
  "AttachLoadBalancerTlsCertificateResult",
)({ operations: S.optional(OperationList) }) {}
export class AttachStaticIpResult extends S.Class<AttachStaticIpResult>(
  "AttachStaticIpResult",
)({ operations: S.optional(OperationList) }) {}
export class CloseInstancePublicPortsRequest extends S.Class<CloseInstancePublicPortsRequest>(
  "CloseInstancePublicPortsRequest",
)(
  { portInfo: PortInfo, instanceName: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/CloseInstancePublicPorts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CopySnapshotResult extends S.Class<CopySnapshotResult>(
  "CopySnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateBucketRequest extends S.Class<CreateBucketRequest>(
  "CreateBucketRequest",
)(
  {
    bucketName: S.String,
    bundleId: S.String,
    tags: S.optional(TagList),
    enableObjectVersioning: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateBucket" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCloudFormationStackRequest extends S.Class<CreateCloudFormationStackRequest>(
  "CreateCloudFormationStackRequest",
)(
  { instances: InstanceEntryList },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/CreateCloudFormationStack",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateContactMethodResult extends S.Class<CreateContactMethodResult>(
  "CreateContactMethodResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateContainerServiceRegistryLoginResult extends S.Class<CreateContainerServiceRegistryLoginResult>(
  "CreateContainerServiceRegistryLoginResult",
)({ registryLogin: S.optional(ContainerServiceRegistryLogin) }) {}
export class CreateDiskFromSnapshotResult extends S.Class<CreateDiskFromSnapshotResult>(
  "CreateDiskFromSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateDiskSnapshotResult extends S.Class<CreateDiskSnapshotResult>(
  "CreateDiskSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateDomainResult extends S.Class<CreateDomainResult>(
  "CreateDomainResult",
)({ operation: S.optional(Operation) }) {}
export class CreateInstancesResult extends S.Class<CreateInstancesResult>(
  "CreateInstancesResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateInstanceSnapshotResult extends S.Class<CreateInstanceSnapshotResult>(
  "CreateInstanceSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateLoadBalancerResult extends S.Class<CreateLoadBalancerResult>(
  "CreateLoadBalancerResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateLoadBalancerTlsCertificateResult extends S.Class<CreateLoadBalancerTlsCertificateResult>(
  "CreateLoadBalancerTlsCertificateResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateRelationalDatabaseResult extends S.Class<CreateRelationalDatabaseResult>(
  "CreateRelationalDatabaseResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateRelationalDatabaseFromSnapshotResult extends S.Class<CreateRelationalDatabaseFromSnapshotResult>(
  "CreateRelationalDatabaseFromSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateRelationalDatabaseSnapshotResult extends S.Class<CreateRelationalDatabaseSnapshotResult>(
  "CreateRelationalDatabaseSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteAlarmResult extends S.Class<DeleteAlarmResult>(
  "DeleteAlarmResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteAutoSnapshotResult extends S.Class<DeleteAutoSnapshotResult>(
  "DeleteAutoSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteBucketResult extends S.Class<DeleteBucketResult>(
  "DeleteBucketResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteBucketAccessKeyResult extends S.Class<DeleteBucketAccessKeyResult>(
  "DeleteBucketAccessKeyResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteCertificateResult extends S.Class<DeleteCertificateResult>(
  "DeleteCertificateResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteContactMethodResult extends S.Class<DeleteContactMethodResult>(
  "DeleteContactMethodResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteDiskResult extends S.Class<DeleteDiskResult>(
  "DeleteDiskResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteDiskSnapshotResult extends S.Class<DeleteDiskSnapshotResult>(
  "DeleteDiskSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteDistributionResult extends S.Class<DeleteDistributionResult>(
  "DeleteDistributionResult",
)({ operation: S.optional(Operation) }) {}
export class DeleteDomainResult extends S.Class<DeleteDomainResult>(
  "DeleteDomainResult",
)({ operation: S.optional(Operation) }) {}
export class DeleteDomainEntryResult extends S.Class<DeleteDomainEntryResult>(
  "DeleteDomainEntryResult",
)({ operation: S.optional(Operation) }) {}
export class DeleteInstanceResult extends S.Class<DeleteInstanceResult>(
  "DeleteInstanceResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteInstanceSnapshotResult extends S.Class<DeleteInstanceSnapshotResult>(
  "DeleteInstanceSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteKeyPairResult extends S.Class<DeleteKeyPairResult>(
  "DeleteKeyPairResult",
)({ operation: S.optional(Operation) }) {}
export class DeleteKnownHostKeysResult extends S.Class<DeleteKnownHostKeysResult>(
  "DeleteKnownHostKeysResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteLoadBalancerResult extends S.Class<DeleteLoadBalancerResult>(
  "DeleteLoadBalancerResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteLoadBalancerTlsCertificateResult extends S.Class<DeleteLoadBalancerTlsCertificateResult>(
  "DeleteLoadBalancerTlsCertificateResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteRelationalDatabaseResult extends S.Class<DeleteRelationalDatabaseResult>(
  "DeleteRelationalDatabaseResult",
)({ operations: S.optional(OperationList) }) {}
export class DeleteRelationalDatabaseSnapshotResult extends S.Class<DeleteRelationalDatabaseSnapshotResult>(
  "DeleteRelationalDatabaseSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class DetachCertificateFromDistributionResult extends S.Class<DetachCertificateFromDistributionResult>(
  "DetachCertificateFromDistributionResult",
)({ operation: S.optional(Operation) }) {}
export class DetachDiskResult extends S.Class<DetachDiskResult>(
  "DetachDiskResult",
)({ operations: S.optional(OperationList) }) {}
export class DetachInstancesFromLoadBalancerResult extends S.Class<DetachInstancesFromLoadBalancerResult>(
  "DetachInstancesFromLoadBalancerResult",
)({ operations: S.optional(OperationList) }) {}
export class DetachStaticIpResult extends S.Class<DetachStaticIpResult>(
  "DetachStaticIpResult",
)({ operations: S.optional(OperationList) }) {}
export class DisableAddOnResult extends S.Class<DisableAddOnResult>(
  "DisableAddOnResult",
)({ operations: S.optional(OperationList) }) {}
export class EnableAddOnResult extends S.Class<EnableAddOnResult>(
  "EnableAddOnResult",
)({ operations: S.optional(OperationList) }) {}
export class ExportSnapshotResult extends S.Class<ExportSnapshotResult>(
  "ExportSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class GetActiveNamesResult extends S.Class<GetActiveNamesResult>(
  "GetActiveNamesResult",
)({
  activeNames: S.optional(StringList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetBucketAccessKeysResult extends S.Class<GetBucketAccessKeysResult>(
  "GetBucketAccessKeysResult",
)({ accessKeys: S.optional(AccessKeyList) }) {}
export class GetCertificatesResult extends S.Class<GetCertificatesResult>(
  "GetCertificatesResult",
)({
  certificates: S.optional(CertificateSummaryList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetContainerAPIMetadataResult extends S.Class<GetContainerAPIMetadataResult>(
  "GetContainerAPIMetadataResult",
)({ metadata: S.optional(ContainerServiceMetadataEntryList) }) {}
export class MetricDatapoint extends S.Class<MetricDatapoint>(
  "MetricDatapoint",
)({
  average: S.optional(S.Number),
  maximum: S.optional(S.Number),
  minimum: S.optional(S.Number),
  sampleCount: S.optional(S.Number),
  sum: S.optional(S.Number),
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  unit: S.optional(S.String),
}) {}
export const MetricDatapointList = S.Array(MetricDatapoint);
export class GetContainerServiceMetricDataResult extends S.Class<GetContainerServiceMetricDataResult>(
  "GetContainerServiceMetricDataResult",
)({
  metricName: S.optional(S.String),
  metricData: S.optional(MetricDatapointList),
}) {}
export class GetContainerServicePowersResult extends S.Class<GetContainerServicePowersResult>(
  "GetContainerServicePowersResult",
)({ powers: S.optional(ContainerServicePowerList) }) {}
export class GetDisksResult extends S.Class<GetDisksResult>("GetDisksResult")({
  disks: S.optional(DiskList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetDiskSnapshotsResult extends S.Class<GetDiskSnapshotsResult>(
  "GetDiskSnapshotsResult",
)({
  diskSnapshots: S.optional(DiskSnapshotList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetDistributionBundlesResult extends S.Class<GetDistributionBundlesResult>(
  "GetDistributionBundlesResult",
)({ bundles: S.optional(DistributionBundleList) }) {}
export class GetDistributionLatestCacheResetResult extends S.Class<GetDistributionLatestCacheResetResult>(
  "GetDistributionLatestCacheResetResult",
)({
  status: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetDistributionMetricDataResult extends S.Class<GetDistributionMetricDataResult>(
  "GetDistributionMetricDataResult",
)({
  metricName: S.optional(S.String),
  metricData: S.optional(MetricDatapointList),
}) {}
export class GetDomainsResult extends S.Class<GetDomainsResult>(
  "GetDomainsResult",
)({ domains: S.optional(DomainList), nextPageToken: S.optional(S.String) }) {}
export class GetInstanceMetricDataResult extends S.Class<GetInstanceMetricDataResult>(
  "GetInstanceMetricDataResult",
)({
  metricName: S.optional(S.String),
  metricData: S.optional(MetricDatapointList),
}) {}
export class GetInstancesResult extends S.Class<GetInstancesResult>(
  "GetInstancesResult",
)({
  instances: S.optional(InstanceList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetInstanceSnapshotsResult extends S.Class<GetInstanceSnapshotsResult>(
  "GetInstanceSnapshotsResult",
)({
  instanceSnapshots: S.optional(InstanceSnapshotList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetKeyPairResult extends S.Class<GetKeyPairResult>(
  "GetKeyPairResult",
)({ keyPair: S.optional(KeyPair) }) {}
export class GetKeyPairsResult extends S.Class<GetKeyPairsResult>(
  "GetKeyPairsResult",
)({ keyPairs: S.optional(KeyPairList), nextPageToken: S.optional(S.String) }) {}
export class GetLoadBalancerMetricDataResult extends S.Class<GetLoadBalancerMetricDataResult>(
  "GetLoadBalancerMetricDataResult",
)({
  metricName: S.optional(S.String),
  metricData: S.optional(MetricDatapointList),
}) {}
export class GetLoadBalancersResult extends S.Class<GetLoadBalancersResult>(
  "GetLoadBalancersResult",
)({
  loadBalancers: S.optional(LoadBalancerList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetOperationResult extends S.Class<GetOperationResult>(
  "GetOperationResult",
)({ operation: S.optional(Operation) }) {}
export class GetOperationsResult extends S.Class<GetOperationsResult>(
  "GetOperationsResult",
)({
  operations: S.optional(OperationList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetOperationsForResourceResult extends S.Class<GetOperationsForResourceResult>(
  "GetOperationsForResourceResult",
)({
  operations: S.optional(OperationList),
  nextPageCount: S.optional(S.String),
  nextPageToken: S.optional(S.String),
}) {}
export class GetRelationalDatabaseLogStreamsResult extends S.Class<GetRelationalDatabaseLogStreamsResult>(
  "GetRelationalDatabaseLogStreamsResult",
)({ logStreams: S.optional(StringList) }) {}
export class GetRelationalDatabaseMasterUserPasswordResult extends S.Class<GetRelationalDatabaseMasterUserPasswordResult>(
  "GetRelationalDatabaseMasterUserPasswordResult",
)({
  masterUserPassword: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetRelationalDatabaseMetricDataResult extends S.Class<GetRelationalDatabaseMetricDataResult>(
  "GetRelationalDatabaseMetricDataResult",
)({
  metricName: S.optional(S.String),
  metricData: S.optional(MetricDatapointList),
}) {}
export class GetRelationalDatabaseParametersResult extends S.Class<GetRelationalDatabaseParametersResult>(
  "GetRelationalDatabaseParametersResult",
)({
  parameters: S.optional(RelationalDatabaseParameterList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetRelationalDatabasesResult extends S.Class<GetRelationalDatabasesResult>(
  "GetRelationalDatabasesResult",
)({
  relationalDatabases: S.optional(RelationalDatabaseList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetRelationalDatabaseSnapshotsResult extends S.Class<GetRelationalDatabaseSnapshotsResult>(
  "GetRelationalDatabaseSnapshotsResult",
)({
  relationalDatabaseSnapshots: S.optional(RelationalDatabaseSnapshotList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetStaticIpsResult extends S.Class<GetStaticIpsResult>(
  "GetStaticIpsResult",
)({
  staticIps: S.optional(StaticIpList),
  nextPageToken: S.optional(S.String),
}) {}
export class ImportKeyPairResult extends S.Class<ImportKeyPairResult>(
  "ImportKeyPairResult",
)({ operation: S.optional(Operation) }) {}
export class OpenInstancePublicPortsResult extends S.Class<OpenInstancePublicPortsResult>(
  "OpenInstancePublicPortsResult",
)({ operation: S.optional(Operation) }) {}
export class PutAlarmResult extends S.Class<PutAlarmResult>("PutAlarmResult")({
  operations: S.optional(OperationList),
}) {}
export class PutInstancePublicPortsResult extends S.Class<PutInstancePublicPortsResult>(
  "PutInstancePublicPortsResult",
)({ operation: S.optional(Operation) }) {}
export class RebootInstanceResult extends S.Class<RebootInstanceResult>(
  "RebootInstanceResult",
)({ operations: S.optional(OperationList) }) {}
export class RebootRelationalDatabaseResult extends S.Class<RebootRelationalDatabaseResult>(
  "RebootRelationalDatabaseResult",
)({ operations: S.optional(OperationList) }) {}
export class ContainerImage extends S.Class<ContainerImage>("ContainerImage")({
  image: S.optional(S.String),
  digest: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RegisterContainerImageResult extends S.Class<RegisterContainerImageResult>(
  "RegisterContainerImageResult",
)({ containerImage: S.optional(ContainerImage) }) {}
export class ReleaseStaticIpResult extends S.Class<ReleaseStaticIpResult>(
  "ReleaseStaticIpResult",
)({ operations: S.optional(OperationList) }) {}
export class ResetDistributionCacheResult extends S.Class<ResetDistributionCacheResult>(
  "ResetDistributionCacheResult",
)({
  status: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  operation: S.optional(Operation),
}) {}
export class SendContactMethodVerificationResult extends S.Class<SendContactMethodVerificationResult>(
  "SendContactMethodVerificationResult",
)({ operations: S.optional(OperationList) }) {}
export class SetIpAddressTypeResult extends S.Class<SetIpAddressTypeResult>(
  "SetIpAddressTypeResult",
)({ operations: S.optional(OperationList) }) {}
export class SetResourceAccessForBucketResult extends S.Class<SetResourceAccessForBucketResult>(
  "SetResourceAccessForBucketResult",
)({ operations: S.optional(OperationList) }) {}
export class SetupInstanceHttpsResult extends S.Class<SetupInstanceHttpsResult>(
  "SetupInstanceHttpsResult",
)({ operations: S.optional(OperationList) }) {}
export class StartGUISessionResult extends S.Class<StartGUISessionResult>(
  "StartGUISessionResult",
)({ operations: S.optional(OperationList) }) {}
export class StartInstanceResult extends S.Class<StartInstanceResult>(
  "StartInstanceResult",
)({ operations: S.optional(OperationList) }) {}
export class StartRelationalDatabaseResult extends S.Class<StartRelationalDatabaseResult>(
  "StartRelationalDatabaseResult",
)({ operations: S.optional(OperationList) }) {}
export class StopGUISessionResult extends S.Class<StopGUISessionResult>(
  "StopGUISessionResult",
)({ operations: S.optional(OperationList) }) {}
export class StopInstanceResult extends S.Class<StopInstanceResult>(
  "StopInstanceResult",
)({ operations: S.optional(OperationList) }) {}
export class StopRelationalDatabaseResult extends S.Class<StopRelationalDatabaseResult>(
  "StopRelationalDatabaseResult",
)({ operations: S.optional(OperationList) }) {}
export class TagResourceResult extends S.Class<TagResourceResult>(
  "TagResourceResult",
)({ operations: S.optional(OperationList) }) {}
export class TestAlarmResult extends S.Class<TestAlarmResult>(
  "TestAlarmResult",
)({ operations: S.optional(OperationList) }) {}
export class UntagResourceResult extends S.Class<UntagResourceResult>(
  "UntagResourceResult",
)({ operations: S.optional(OperationList) }) {}
export class UpdateBucketBundleResult extends S.Class<UpdateBucketBundleResult>(
  "UpdateBucketBundleResult",
)({ operations: S.optional(OperationList) }) {}
export class ContainerServiceStateDetail extends S.Class<ContainerServiceStateDetail>(
  "ContainerServiceStateDetail",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class ContainerServiceEndpoint extends S.Class<ContainerServiceEndpoint>(
  "ContainerServiceEndpoint",
)({
  containerName: S.optional(S.String),
  containerPort: S.optional(S.Number),
  healthCheck: S.optional(ContainerServiceHealthCheckConfig),
}) {}
export class ContainerServiceDeployment extends S.Class<ContainerServiceDeployment>(
  "ContainerServiceDeployment",
)({
  version: S.optional(S.Number),
  state: S.optional(S.String),
  containers: S.optional(ContainerMap),
  publicEndpoint: S.optional(ContainerServiceEndpoint),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ContainerServiceECRImagePullerRole extends S.Class<ContainerServiceECRImagePullerRole>(
  "ContainerServiceECRImagePullerRole",
)({ isActive: S.optional(S.Boolean), principalArn: S.optional(S.String) }) {}
export class PrivateRegistryAccess extends S.Class<PrivateRegistryAccess>(
  "PrivateRegistryAccess",
)({ ecrImagePullerRole: S.optional(ContainerServiceECRImagePullerRole) }) {}
export class ContainerService extends S.Class<ContainerService>(
  "ContainerService",
)({
  containerServiceName: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  power: S.optional(S.String),
  powerId: S.optional(S.String),
  state: S.optional(S.String),
  stateDetail: S.optional(ContainerServiceStateDetail),
  scale: S.optional(S.Number),
  currentDeployment: S.optional(ContainerServiceDeployment),
  nextDeployment: S.optional(ContainerServiceDeployment),
  isDisabled: S.optional(S.Boolean),
  principalArn: S.optional(S.String),
  privateDomainName: S.optional(S.String),
  publicDomainNames: S.optional(ContainerServicePublicDomains),
  url: S.optional(S.String),
  privateRegistryAccess: S.optional(PrivateRegistryAccess),
}) {}
export class UpdateContainerServiceResult extends S.Class<UpdateContainerServiceResult>(
  "UpdateContainerServiceResult",
)({ containerService: S.optional(ContainerService) }) {}
export class UpdateDistributionResult extends S.Class<UpdateDistributionResult>(
  "UpdateDistributionResult",
)({ operation: S.optional(Operation) }) {}
export class UpdateDistributionBundleResult extends S.Class<UpdateDistributionBundleResult>(
  "UpdateDistributionBundleResult",
)({ operation: S.optional(Operation) }) {}
export class UpdateDomainEntryResult extends S.Class<UpdateDomainEntryResult>(
  "UpdateDomainEntryResult",
)({ operations: S.optional(OperationList) }) {}
export class UpdateInstanceMetadataOptionsResult extends S.Class<UpdateInstanceMetadataOptionsResult>(
  "UpdateInstanceMetadataOptionsResult",
)({ operation: S.optional(Operation) }) {}
export class UpdateLoadBalancerAttributeResult extends S.Class<UpdateLoadBalancerAttributeResult>(
  "UpdateLoadBalancerAttributeResult",
)({ operations: S.optional(OperationList) }) {}
export class UpdateRelationalDatabaseResult extends S.Class<UpdateRelationalDatabaseResult>(
  "UpdateRelationalDatabaseResult",
)({ operations: S.optional(OperationList) }) {}
export class UpdateRelationalDatabaseParametersRequest extends S.Class<UpdateRelationalDatabaseParametersRequest>(
  "UpdateRelationalDatabaseParametersRequest",
)(
  {
    relationalDatabaseName: S.String,
    parameters: RelationalDatabaseParameterList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/UpdateRelationalDatabaseParameters",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DiskMap extends S.Class<DiskMap>("DiskMap")({
  originalDiskPath: S.optional(S.String),
  newDiskName: S.optional(S.String),
}) {}
export const DiskMapList = S.Array(DiskMap);
export const InstancePlatformList = S.Array(S.String);
export const AppCategoryList = S.Array(S.String);
export class BucketCorsRule extends S.Class<BucketCorsRule>("BucketCorsRule")({
  id: S.optional(S.String),
  allowedMethods: BucketCorsAllowedMethods,
  allowedOrigins: BucketCorsAllowedOrigins,
  allowedHeaders: S.optional(BucketCorsAllowedHeaders),
  exposeHeaders: S.optional(BucketCorsExposeHeaders),
  maxAgeSeconds: S.optional(S.Number),
}) {}
export const BucketCorsRules = S.Array(BucketCorsRule);
export class Session extends S.Class<Session>("Session")({
  name: S.optional(S.String),
  url: S.optional(S.String),
  isPrimary: S.optional(S.Boolean),
}) {}
export const Sessions = S.Array(Session);
export const AttachedDiskMap = S.Record({ key: S.String, value: DiskMapList });
export class Blueprint extends S.Class<Blueprint>("Blueprint")({
  blueprintId: S.optional(S.String),
  name: S.optional(S.String),
  group: S.optional(S.String),
  type: S.optional(S.String),
  description: S.optional(S.String),
  isActive: S.optional(S.Boolean),
  minPower: S.optional(S.Number),
  version: S.optional(S.String),
  versionCode: S.optional(S.String),
  productUrl: S.optional(S.String),
  licenseUrl: S.optional(S.String),
  platform: S.optional(S.String),
  appCategory: S.optional(S.String),
}) {}
export const BlueprintList = S.Array(Blueprint);
export class BucketBundle extends S.Class<BucketBundle>("BucketBundle")({
  bundleId: S.optional(S.String),
  name: S.optional(S.String),
  price: S.optional(S.Number),
  storagePerMonthInGb: S.optional(S.Number),
  transferPerMonthInGb: S.optional(S.Number),
  isActive: S.optional(S.Boolean),
}) {}
export const BucketBundleList = S.Array(BucketBundle);
export class AccountLevelBpaSync extends S.Class<AccountLevelBpaSync>(
  "AccountLevelBpaSync",
)({
  status: S.optional(S.String),
  lastSyncedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
  bpaImpactsLightsail: S.optional(S.Boolean),
}) {}
export class Bundle extends S.Class<Bundle>("Bundle")({
  price: S.optional(S.Number),
  cpuCount: S.optional(S.Number),
  diskSizeInGb: S.optional(S.Number),
  bundleId: S.optional(S.String),
  instanceType: S.optional(S.String),
  isActive: S.optional(S.Boolean),
  name: S.optional(S.String),
  power: S.optional(S.Number),
  ramSizeInGb: S.optional(S.Number),
  transferPerMonthInGb: S.optional(S.Number),
  supportedPlatforms: S.optional(InstancePlatformList),
  supportedAppCategories: S.optional(AppCategoryList),
  publicIpv4AddressCount: S.optional(S.Number),
}) {}
export const BundleList = S.Array(Bundle);
export class ContactMethod extends S.Class<ContactMethod>("ContactMethod")({
  contactEndpoint: S.optional(S.String),
  status: S.optional(S.String),
  protocol: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  supportCode: S.optional(S.String),
}) {}
export const ContactMethodsList = S.Array(ContactMethod);
export const ContainerImageList = S.Array(ContainerImage);
export class ContainerServiceLogEvent extends S.Class<ContainerServiceLogEvent>(
  "ContainerServiceLogEvent",
)({
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
}) {}
export const ContainerServiceLogEventList = S.Array(ContainerServiceLogEvent);
export class InstancePortState extends S.Class<InstancePortState>(
  "InstancePortState",
)({
  fromPort: S.optional(S.Number),
  toPort: S.optional(S.Number),
  protocol: S.optional(S.String),
  state: S.optional(S.String),
  cidrs: S.optional(StringList),
  ipv6Cidrs: S.optional(StringList),
  cidrListAliases: S.optional(StringList),
}) {}
export const InstancePortStateList = S.Array(InstancePortState);
export class LoadBalancerTlsPolicy extends S.Class<LoadBalancerTlsPolicy>(
  "LoadBalancerTlsPolicy",
)({
  name: S.optional(S.String),
  isDefault: S.optional(S.Boolean),
  description: S.optional(S.String),
  protocols: S.optional(StringList),
  ciphers: S.optional(StringList),
}) {}
export const LoadBalancerTlsPolicyList = S.Array(LoadBalancerTlsPolicy);
export class RelationalDatabaseBlueprint extends S.Class<RelationalDatabaseBlueprint>(
  "RelationalDatabaseBlueprint",
)({
  blueprintId: S.optional(S.String),
  engine: S.optional(S.String),
  engineVersion: S.optional(S.String),
  engineDescription: S.optional(S.String),
  engineVersionDescription: S.optional(S.String),
  isEngineDefault: S.optional(S.Boolean),
}) {}
export const RelationalDatabaseBlueprintList = S.Array(
  RelationalDatabaseBlueprint,
);
export class RelationalDatabaseBundle extends S.Class<RelationalDatabaseBundle>(
  "RelationalDatabaseBundle",
)({
  bundleId: S.optional(S.String),
  name: S.optional(S.String),
  price: S.optional(S.Number),
  ramSizeInGb: S.optional(S.Number),
  diskSizeInGb: S.optional(S.Number),
  transferPerMonthInGb: S.optional(S.Number),
  cpuCount: S.optional(S.Number),
  isEncrypted: S.optional(S.Boolean),
  isActive: S.optional(S.Boolean),
}) {}
export const RelationalDatabaseBundleList = S.Array(RelationalDatabaseBundle);
export class RelationalDatabaseEvent extends S.Class<RelationalDatabaseEvent>(
  "RelationalDatabaseEvent",
)({
  resource: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
  eventCategories: S.optional(StringList),
}) {}
export const RelationalDatabaseEventList = S.Array(RelationalDatabaseEvent);
export class LogEvent extends S.Class<LogEvent>("LogEvent")({
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
}) {}
export const LogEventList = S.Array(LogEvent);
export class BucketCorsConfig extends S.Class<BucketCorsConfig>(
  "BucketCorsConfig",
)({ rules: S.optional(BucketCorsRules) }) {}
export class CloseInstancePublicPortsResult extends S.Class<CloseInstancePublicPortsResult>(
  "CloseInstancePublicPortsResult",
)({ operation: S.optional(Operation) }) {}
export class ResourceReceivingAccess extends S.Class<ResourceReceivingAccess>(
  "ResourceReceivingAccess",
)({ name: S.optional(S.String), resourceType: S.optional(S.String) }) {}
export const AccessReceiverList = S.Array(ResourceReceivingAccess);
export class BucketState extends S.Class<BucketState>("BucketState")({
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export class Bucket extends S.Class<Bucket>("Bucket")({
  resourceType: S.optional(S.String),
  accessRules: S.optional(AccessRules),
  arn: S.optional(S.String),
  bundleId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  url: S.optional(S.String),
  location: S.optional(ResourceLocation),
  name: S.optional(S.String),
  supportCode: S.optional(S.String),
  tags: S.optional(TagList),
  objectVersioning: S.optional(S.String),
  ableToUpdateBundle: S.optional(S.Boolean),
  readonlyAccessAccounts: S.optional(PartnerIdList),
  resourcesReceivingAccess: S.optional(AccessReceiverList),
  state: S.optional(BucketState),
  accessLogConfig: S.optional(BucketAccessLogConfig),
  cors: S.optional(BucketCorsConfig),
}) {}
export class CreateBucketResult extends S.Class<CreateBucketResult>(
  "CreateBucketResult",
)({ bucket: S.optional(Bucket), operations: S.optional(OperationList) }) {}
export class CreateCloudFormationStackResult extends S.Class<CreateCloudFormationStackResult>(
  "CreateCloudFormationStackResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateContainerServiceRequest extends S.Class<CreateContainerServiceRequest>(
  "CreateContainerServiceRequest",
)(
  {
    serviceName: S.String,
    power: S.String,
    scale: S.Number,
    tags: S.optional(TagList),
    publicDomainNames: S.optional(ContainerServicePublicDomains),
    deployment: S.optional(ContainerServiceDeploymentRequest),
    privateRegistryAccess: S.optional(PrivateRegistryAccessRequest),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/container-services" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDiskRequest extends S.Class<CreateDiskRequest>(
  "CreateDiskRequest",
)(
  {
    diskName: S.String,
    availabilityZone: S.String,
    sizeInGb: S.Number,
    tags: S.optional(TagList),
    addOns: S.optional(AddOnRequestList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDisk" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDistributionRequest extends S.Class<CreateDistributionRequest>(
  "CreateDistributionRequest",
)(
  {
    distributionName: S.String,
    origin: InputOrigin,
    defaultCacheBehavior: CacheBehavior,
    cacheBehaviorSettings: S.optional(CacheSettings),
    cacheBehaviors: S.optional(CacheBehaviorList),
    bundleId: S.String,
    ipAddressType: S.optional(S.String),
    tags: S.optional(TagList),
    certificateName: S.optional(S.String),
    viewerMinimumTlsProtocolVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDistribution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDomainEntryRequest extends S.Class<CreateDomainEntryRequest>(
  "CreateDomainEntryRequest",
)(
  { domainName: S.String, domainEntry: DomainEntry },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/CreateDomainEntry" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGUISessionAccessDetailsResult extends S.Class<CreateGUISessionAccessDetailsResult>(
  "CreateGUISessionAccessDetailsResult",
)({
  resourceName: S.optional(S.String),
  status: S.optional(S.String),
  percentageComplete: S.optional(S.Number),
  failureReason: S.optional(S.String),
  sessions: S.optional(Sessions),
}) {}
export class CreateInstancesFromSnapshotRequest extends S.Class<CreateInstancesFromSnapshotRequest>(
  "CreateInstancesFromSnapshotRequest",
)(
  {
    instanceNames: StringList,
    attachedDiskMapping: S.optional(AttachedDiskMap),
    availabilityZone: S.String,
    instanceSnapshotName: S.optional(S.String),
    bundleId: S.String,
    userData: S.optional(S.String),
    keyPairName: S.optional(S.String),
    tags: S.optional(TagList),
    addOns: S.optional(AddOnRequestList),
    ipAddressType: S.optional(S.String),
    sourceInstanceName: S.optional(S.String),
    restoreDate: S.optional(S.String),
    useLatestRestorableAutoSnapshot: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/CreateInstancesFromSnapshot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKeyPairResult extends S.Class<CreateKeyPairResult>(
  "CreateKeyPairResult",
)({
  keyPair: S.optional(KeyPair),
  publicKeyBase64: S.optional(S.String),
  privateKeyBase64: S.optional(S.String),
  operation: S.optional(Operation),
}) {}
export class GetBlueprintsResult extends S.Class<GetBlueprintsResult>(
  "GetBlueprintsResult",
)({
  blueprints: S.optional(BlueprintList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetBucketBundlesResult extends S.Class<GetBucketBundlesResult>(
  "GetBucketBundlesResult",
)({ bundles: S.optional(BucketBundleList) }) {}
export class GetBucketMetricDataResult extends S.Class<GetBucketMetricDataResult>(
  "GetBucketMetricDataResult",
)({
  metricName: S.optional(S.String),
  metricData: S.optional(MetricDatapointList),
}) {}
export class GetBundlesResult extends S.Class<GetBundlesResult>(
  "GetBundlesResult",
)({ bundles: S.optional(BundleList), nextPageToken: S.optional(S.String) }) {}
export class GetContactMethodsResult extends S.Class<GetContactMethodsResult>(
  "GetContactMethodsResult",
)({ contactMethods: S.optional(ContactMethodsList) }) {}
export class GetContainerImagesResult extends S.Class<GetContainerImagesResult>(
  "GetContainerImagesResult",
)({ containerImages: S.optional(ContainerImageList) }) {}
export class GetContainerLogResult extends S.Class<GetContainerLogResult>(
  "GetContainerLogResult",
)({
  logEvents: S.optional(ContainerServiceLogEventList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetDiskSnapshotResult extends S.Class<GetDiskSnapshotResult>(
  "GetDiskSnapshotResult",
)({ diskSnapshot: S.optional(DiskSnapshot) }) {}
export class GetInstancePortStatesResult extends S.Class<GetInstancePortStatesResult>(
  "GetInstancePortStatesResult",
)({ portStates: S.optional(InstancePortStateList) }) {}
export class GetInstanceSnapshotResult extends S.Class<GetInstanceSnapshotResult>(
  "GetInstanceSnapshotResult",
)({ instanceSnapshot: S.optional(InstanceSnapshot) }) {}
export class GetInstanceStateResult extends S.Class<GetInstanceStateResult>(
  "GetInstanceStateResult",
)({ state: S.optional(InstanceState) }) {}
export class GetLoadBalancerTlsPoliciesResult extends S.Class<GetLoadBalancerTlsPoliciesResult>(
  "GetLoadBalancerTlsPoliciesResult",
)({
  tlsPolicies: S.optional(LoadBalancerTlsPolicyList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetRelationalDatabaseBlueprintsResult extends S.Class<GetRelationalDatabaseBlueprintsResult>(
  "GetRelationalDatabaseBlueprintsResult",
)({
  blueprints: S.optional(RelationalDatabaseBlueprintList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetRelationalDatabaseBundlesResult extends S.Class<GetRelationalDatabaseBundlesResult>(
  "GetRelationalDatabaseBundlesResult",
)({
  bundles: S.optional(RelationalDatabaseBundleList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetRelationalDatabaseEventsResult extends S.Class<GetRelationalDatabaseEventsResult>(
  "GetRelationalDatabaseEventsResult",
)({
  relationalDatabaseEvents: S.optional(RelationalDatabaseEventList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetRelationalDatabaseLogEventsResult extends S.Class<GetRelationalDatabaseLogEventsResult>(
  "GetRelationalDatabaseLogEventsResult",
)({
  resourceLogEvents: S.optional(LogEventList),
  nextBackwardToken: S.optional(S.String),
  nextForwardToken: S.optional(S.String),
}) {}
export class GetRelationalDatabaseSnapshotResult extends S.Class<GetRelationalDatabaseSnapshotResult>(
  "GetRelationalDatabaseSnapshotResult",
)({ relationalDatabaseSnapshot: S.optional(RelationalDatabaseSnapshot) }) {}
export class GetStaticIpResult extends S.Class<GetStaticIpResult>(
  "GetStaticIpResult",
)({ staticIp: S.optional(StaticIp) }) {}
export class PeerVpcResult extends S.Class<PeerVpcResult>("PeerVpcResult")({
  operation: S.optional(Operation),
}) {}
export class UpdateBucketRequest extends S.Class<UpdateBucketRequest>(
  "UpdateBucketRequest",
)(
  {
    bucketName: S.String,
    accessRules: S.optional(AccessRules),
    versioning: S.optional(S.String),
    readonlyAccessAccounts: S.optional(PartnerIdList),
    accessLogConfig: S.optional(BucketAccessLogConfig),
    cors: S.optional(BucketCorsConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ls/api/2016-11-28/UpdateBucket" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRelationalDatabaseParametersResult extends S.Class<UpdateRelationalDatabaseParametersResult>(
  "UpdateRelationalDatabaseParametersResult",
)({ operations: S.optional(OperationList) }) {}
export class MonitoredResourceInfo extends S.Class<MonitoredResourceInfo>(
  "MonitoredResourceInfo",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  resourceType: S.optional(S.String),
}) {}
export class AttachedDisk extends S.Class<AttachedDisk>("AttachedDisk")({
  path: S.optional(S.String),
  sizeInGb: S.optional(S.Number),
}) {}
export const AttachedDiskList = S.Array(AttachedDisk);
export class CloudFormationStackRecordSourceInfo extends S.Class<CloudFormationStackRecordSourceInfo>(
  "CloudFormationStackRecordSourceInfo",
)({
  resourceType: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const CloudFormationStackRecordSourceInfoList = S.Array(
  CloudFormationStackRecordSourceInfo,
);
export class DestinationInfo extends S.Class<DestinationInfo>(
  "DestinationInfo",
)({ id: S.optional(S.String), service: S.optional(S.String) }) {}
export class Origin extends S.Class<Origin>("Origin")({
  name: S.optional(S.String),
  resourceType: S.optional(S.String),
  regionName: S.optional(S.String),
  protocolPolicy: S.optional(S.String),
  responseTimeout: S.optional(S.Number),
}) {}
export class PasswordData extends S.Class<PasswordData>("PasswordData")({
  ciphertext: S.optional(S.String),
  keyPairName: S.optional(S.String),
}) {}
export class HostKeyAttributes extends S.Class<HostKeyAttributes>(
  "HostKeyAttributes",
)({
  algorithm: S.optional(S.String),
  publicKey: S.optional(S.String),
  witnessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  fingerprintSHA1: S.optional(S.String),
  fingerprintSHA256: S.optional(S.String),
  notValidBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  notValidAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const HostKeysList = S.Array(HostKeyAttributes);
export class AvailabilityZone extends S.Class<AvailabilityZone>(
  "AvailabilityZone",
)({ zoneName: S.optional(S.String), state: S.optional(S.String) }) {}
export const AvailabilityZoneList = S.Array(AvailabilityZone);
export class SetupRequest extends S.Class<SetupRequest>("SetupRequest")({
  instanceName: S.optional(S.String),
  domainNames: S.optional(SetupDomainNameList),
  certificateProvider: S.optional(S.String),
}) {}
export class SetupHistoryResource extends S.Class<SetupHistoryResource>(
  "SetupHistoryResource",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
}) {}
export class SetupExecutionDetails extends S.Class<SetupExecutionDetails>(
  "SetupExecutionDetails",
)({
  command: S.optional(S.String),
  dateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  name: S.optional(S.String),
  status: S.optional(S.String),
  standardError: S.optional(S.String),
  standardOutput: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export const SetupExecutionDetailsList = S.Array(SetupExecutionDetails);
export class Alarm extends S.Class<Alarm>("Alarm")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  supportCode: S.optional(S.String),
  monitoredResourceInfo: S.optional(MonitoredResourceInfo),
  comparisonOperator: S.optional(S.String),
  evaluationPeriods: S.optional(S.Number),
  period: S.optional(S.Number),
  threshold: S.optional(S.Number),
  datapointsToAlarm: S.optional(S.Number),
  treatMissingData: S.optional(S.String),
  statistic: S.optional(S.String),
  metricName: S.optional(S.String),
  state: S.optional(S.String),
  unit: S.optional(S.String),
  contactProtocols: S.optional(ContactProtocolsList),
  notificationTriggers: S.optional(NotificationTriggerList),
  notificationEnabled: S.optional(S.Boolean),
}) {}
export const AlarmsList = S.Array(Alarm);
export class AutoSnapshotDetails extends S.Class<AutoSnapshotDetails>(
  "AutoSnapshotDetails",
)({
  date: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  fromAttachedDisks: S.optional(AttachedDiskList),
}) {}
export const AutoSnapshotDetailsList = S.Array(AutoSnapshotDetails);
export const BucketList = S.Array(Bucket);
export class CloudFormationStackRecord extends S.Class<CloudFormationStackRecord>(
  "CloudFormationStackRecord",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  state: S.optional(S.String),
  sourceInfo: S.optional(CloudFormationStackRecordSourceInfoList),
  destinationInfo: S.optional(DestinationInfo),
}) {}
export const CloudFormationStackRecordList = S.Array(CloudFormationStackRecord);
export const ContainerServiceDeploymentList = S.Array(
  ContainerServiceDeployment,
);
export class LightsailDistribution extends S.Class<LightsailDistribution>(
  "LightsailDistribution",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  alternativeDomainNames: S.optional(StringList),
  status: S.optional(S.String),
  isEnabled: S.optional(S.Boolean),
  domainName: S.optional(S.String),
  bundleId: S.optional(S.String),
  certificateName: S.optional(S.String),
  origin: S.optional(Origin),
  originPublicDNS: S.optional(S.String),
  defaultCacheBehavior: S.optional(CacheBehavior),
  cacheBehaviorSettings: S.optional(CacheSettings),
  cacheBehaviors: S.optional(CacheBehaviorList),
  ableToUpdateBundle: S.optional(S.Boolean),
  ipAddressType: S.optional(S.String),
  tags: S.optional(TagList),
  viewerMinimumTlsProtocolVersion: S.optional(S.String),
}) {}
export const DistributionList = S.Array(LightsailDistribution);
export class InstanceAccessDetails extends S.Class<InstanceAccessDetails>(
  "InstanceAccessDetails",
)({
  certKey: S.optional(S.String),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ipAddress: S.optional(S.String),
  ipv6Addresses: S.optional(Ipv6AddressList),
  password: S.optional(S.String),
  passwordData: S.optional(PasswordData),
  privateKey: S.optional(S.String),
  protocol: S.optional(S.String),
  instanceName: S.optional(S.String),
  username: S.optional(S.String),
  hostKeys: S.optional(HostKeysList),
}) {}
export class Region extends S.Class<Region>("Region")({
  continentCode: S.optional(S.String),
  description: S.optional(S.String),
  displayName: S.optional(S.String),
  name: S.optional(S.String),
  availabilityZones: S.optional(AvailabilityZoneList),
  relationalDatabaseAvailabilityZones: S.optional(AvailabilityZoneList),
}) {}
export const RegionList = S.Array(Region);
export class SetupHistory extends S.Class<SetupHistory>("SetupHistory")({
  operationId: S.optional(S.String),
  request: S.optional(SetupRequest),
  resource: S.optional(SetupHistoryResource),
  executionDetails: S.optional(SetupExecutionDetailsList),
  status: S.optional(S.String),
}) {}
export const setupHistoryList = S.Array(SetupHistory);
export class DiskSnapshotInfo extends S.Class<DiskSnapshotInfo>(
  "DiskSnapshotInfo",
)({ sizeInGb: S.optional(S.Number) }) {}
export class LoadBalancerTlsCertificateDnsRecordCreationState extends S.Class<LoadBalancerTlsCertificateDnsRecordCreationState>(
  "LoadBalancerTlsCertificateDnsRecordCreationState",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class LoadBalancerTlsCertificateDomainValidationOption extends S.Class<LoadBalancerTlsCertificateDomainValidationOption>(
  "LoadBalancerTlsCertificateDomainValidationOption",
)({
  domainName: S.optional(S.String),
  validationStatus: S.optional(S.String),
}) {}
export const LoadBalancerTlsCertificateDomainValidationOptionList = S.Array(
  LoadBalancerTlsCertificateDomainValidationOption,
);
export class CreateBucketAccessKeyResult extends S.Class<CreateBucketAccessKeyResult>(
  "CreateBucketAccessKeyResult",
)({
  accessKey: S.optional(AccessKey),
  operations: S.optional(OperationList),
}) {}
export class CreateContainerServiceResult extends S.Class<CreateContainerServiceResult>(
  "CreateContainerServiceResult",
)({ containerService: S.optional(ContainerService) }) {}
export class CreateContainerServiceDeploymentRequest extends S.Class<CreateContainerServiceDeploymentRequest>(
  "CreateContainerServiceDeploymentRequest",
)(
  {
    serviceName: S.String.pipe(T.HttpLabel()),
    containers: S.optional(ContainerMap),
    publicEndpoint: S.optional(EndpointRequest),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ls/api/2016-11-28/container-services/{serviceName}/deployments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDiskResult extends S.Class<CreateDiskResult>(
  "CreateDiskResult",
)({ operations: S.optional(OperationList) }) {}
export class CreateDistributionResult extends S.Class<CreateDistributionResult>(
  "CreateDistributionResult",
)({
  distribution: S.optional(LightsailDistribution),
  operation: S.optional(Operation),
}) {}
export class CreateDomainEntryResult extends S.Class<CreateDomainEntryResult>(
  "CreateDomainEntryResult",
)({ operation: S.optional(Operation) }) {}
export class CreateInstancesFromSnapshotResult extends S.Class<CreateInstancesFromSnapshotResult>(
  "CreateInstancesFromSnapshotResult",
)({ operations: S.optional(OperationList) }) {}
export class GetAlarmsResult extends S.Class<GetAlarmsResult>(
  "GetAlarmsResult",
)({ alarms: S.optional(AlarmsList), nextPageToken: S.optional(S.String) }) {}
export class GetAutoSnapshotsResult extends S.Class<GetAutoSnapshotsResult>(
  "GetAutoSnapshotsResult",
)({
  resourceName: S.optional(S.String),
  resourceType: S.optional(S.String),
  autoSnapshots: S.optional(AutoSnapshotDetailsList),
}) {}
export class GetBucketsResult extends S.Class<GetBucketsResult>(
  "GetBucketsResult",
)({
  buckets: S.optional(BucketList),
  nextPageToken: S.optional(S.String),
  accountLevelBpaSync: S.optional(AccountLevelBpaSync),
}) {}
export class GetCloudFormationStackRecordsResult extends S.Class<GetCloudFormationStackRecordsResult>(
  "GetCloudFormationStackRecordsResult",
)({
  cloudFormationStackRecords: S.optional(CloudFormationStackRecordList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetContainerServiceDeploymentsResult extends S.Class<GetContainerServiceDeploymentsResult>(
  "GetContainerServiceDeploymentsResult",
)({ deployments: S.optional(ContainerServiceDeploymentList) }) {}
export class GetDiskResult extends S.Class<GetDiskResult>("GetDiskResult")({
  disk: S.optional(Disk),
}) {}
export class GetDistributionsResult extends S.Class<GetDistributionsResult>(
  "GetDistributionsResult",
)({
  distributions: S.optional(DistributionList),
  nextPageToken: S.optional(S.String),
}) {}
export class GetInstanceAccessDetailsResult extends S.Class<GetInstanceAccessDetailsResult>(
  "GetInstanceAccessDetailsResult",
)({ accessDetails: S.optional(InstanceAccessDetails) }) {}
export class GetLoadBalancerResult extends S.Class<GetLoadBalancerResult>(
  "GetLoadBalancerResult",
)({ loadBalancer: S.optional(LoadBalancer) }) {}
export class GetRegionsResult extends S.Class<GetRegionsResult>(
  "GetRegionsResult",
)({ regions: S.optional(RegionList) }) {}
export class GetRelationalDatabaseResult extends S.Class<GetRelationalDatabaseResult>(
  "GetRelationalDatabaseResult",
)({ relationalDatabase: S.optional(RelationalDatabase) }) {}
export class GetSetupHistoryResult extends S.Class<GetSetupHistoryResult>(
  "GetSetupHistoryResult",
)({
  setupHistory: S.optional(setupHistoryList),
  nextPageToken: S.optional(S.String),
}) {}
export class UpdateBucketResult extends S.Class<UpdateBucketResult>(
  "UpdateBucketResult",
)({ bucket: S.optional(Bucket), operations: S.optional(OperationList) }) {}
export class LoadBalancerTlsCertificateDomainValidationRecord extends S.Class<LoadBalancerTlsCertificateDomainValidationRecord>(
  "LoadBalancerTlsCertificateDomainValidationRecord",
)({
  name: S.optional(S.String),
  type: S.optional(S.String),
  value: S.optional(S.String),
  validationStatus: S.optional(S.String),
  domainName: S.optional(S.String),
  dnsRecordCreationState: S.optional(
    LoadBalancerTlsCertificateDnsRecordCreationState,
  ),
}) {}
export const LoadBalancerTlsCertificateDomainValidationRecordList = S.Array(
  LoadBalancerTlsCertificateDomainValidationRecord,
);
export class LoadBalancerTlsCertificateRenewalSummary extends S.Class<LoadBalancerTlsCertificateRenewalSummary>(
  "LoadBalancerTlsCertificateRenewalSummary",
)({
  renewalStatus: S.optional(S.String),
  domainValidationOptions: S.optional(
    LoadBalancerTlsCertificateDomainValidationOptionList,
  ),
}) {}
export class TimePeriod extends S.Class<TimePeriod>("TimePeriod")({
  start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  end: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DiskInfo extends S.Class<DiskInfo>("DiskInfo")({
  name: S.optional(S.String),
  path: S.optional(S.String),
  sizeInGb: S.optional(S.Number),
  isSystemDisk: S.optional(S.Boolean),
}) {}
export const DiskInfoList = S.Array(DiskInfo);
export const ContainerServiceList = S.Array(ContainerService);
export class LoadBalancerTlsCertificate extends S.Class<LoadBalancerTlsCertificate>(
  "LoadBalancerTlsCertificate",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  supportCode: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  tags: S.optional(TagList),
  loadBalancerName: S.optional(S.String),
  isAttached: S.optional(S.Boolean),
  status: S.optional(S.String),
  domainName: S.optional(S.String),
  domainValidationRecords: S.optional(
    LoadBalancerTlsCertificateDomainValidationRecordList,
  ),
  failureReason: S.optional(S.String),
  issuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  issuer: S.optional(S.String),
  keyAlgorithm: S.optional(S.String),
  notAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  notBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  renewalSummary: S.optional(LoadBalancerTlsCertificateRenewalSummary),
  revocationReason: S.optional(S.String),
  revokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  serial: S.optional(S.String),
  signatureAlgorithm: S.optional(S.String),
  subject: S.optional(S.String),
  subjectAlternativeNames: S.optional(StringList),
}) {}
export const LoadBalancerTlsCertificateList = S.Array(
  LoadBalancerTlsCertificate,
);
export class EstimateByTime extends S.Class<EstimateByTime>("EstimateByTime")({
  usageCost: S.optional(S.Number),
  pricingUnit: S.optional(S.String),
  unit: S.optional(S.Number),
  currency: S.optional(S.String),
  timePeriod: S.optional(TimePeriod),
}) {}
export const EstimatesByTime = S.Array(EstimateByTime);
export class InstanceSnapshotInfo extends S.Class<InstanceSnapshotInfo>(
  "InstanceSnapshotInfo",
)({
  fromBundleId: S.optional(S.String),
  fromBlueprintId: S.optional(S.String),
  fromDiskInfo: S.optional(DiskInfoList),
}) {}
export class CreateContainerServiceDeploymentResult extends S.Class<CreateContainerServiceDeploymentResult>(
  "CreateContainerServiceDeploymentResult",
)({ containerService: S.optional(ContainerService) }) {}
export class ContainerServicesListResult extends S.Class<ContainerServicesListResult>(
  "ContainerServicesListResult",
)({ containerServices: S.optional(ContainerServiceList) }) {}
export class GetDomainResult extends S.Class<GetDomainResult>(
  "GetDomainResult",
)({ domain: S.optional(Domain) }) {}
export class GetInstanceResult extends S.Class<GetInstanceResult>(
  "GetInstanceResult",
)({ instance: S.optional(Instance) }) {}
export class GetLoadBalancerTlsCertificatesResult extends S.Class<GetLoadBalancerTlsCertificatesResult>(
  "GetLoadBalancerTlsCertificatesResult",
)({ tlsCertificates: S.optional(LoadBalancerTlsCertificateList) }) {}
export class CostEstimate extends S.Class<CostEstimate>("CostEstimate")({
  usageType: S.optional(S.String),
  resultsByTime: S.optional(EstimatesByTime),
}) {}
export const CostEstimates = S.Array(CostEstimate);
export class ExportSnapshotRecordSourceInfo extends S.Class<ExportSnapshotRecordSourceInfo>(
  "ExportSnapshotRecordSourceInfo",
)({
  resourceType: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  fromResourceName: S.optional(S.String),
  fromResourceArn: S.optional(S.String),
  instanceSnapshotInfo: S.optional(InstanceSnapshotInfo),
  diskSnapshotInfo: S.optional(DiskSnapshotInfo),
}) {}
export class ResourceBudgetEstimate extends S.Class<ResourceBudgetEstimate>(
  "ResourceBudgetEstimate",
)({
  resourceName: S.optional(S.String),
  resourceType: S.optional(S.String),
  costEstimates: S.optional(CostEstimates),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ResourcesBudgetEstimate = S.Array(ResourceBudgetEstimate);
export class ExportSnapshotRecord extends S.Class<ExportSnapshotRecord>(
  "ExportSnapshotRecord",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  location: S.optional(ResourceLocation),
  resourceType: S.optional(S.String),
  state: S.optional(S.String),
  sourceInfo: S.optional(ExportSnapshotRecordSourceInfo),
  destinationInfo: S.optional(DestinationInfo),
}) {}
export const ExportSnapshotRecordList = S.Array(ExportSnapshotRecord);
export class CreateCertificateResult extends S.Class<CreateCertificateResult>(
  "CreateCertificateResult",
)({
  certificate: S.optional(CertificateSummary),
  operations: S.optional(OperationList),
}) {}
export class GetCostEstimateResult extends S.Class<GetCostEstimateResult>(
  "GetCostEstimateResult",
)({ resourcesBudgetEstimate: S.optional(ResourcesBudgetEstimate) }) {}
export class GetExportSnapshotRecordsResult extends S.Class<GetExportSnapshotRecordsResult>(
  "GetExportSnapshotRecordsResult",
)({
  exportSnapshotRecords: S.optional(ExportSnapshotRecordList),
  nextPageToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class AccountSetupInProgressException extends S.TaggedError<AccountSetupInProgressException>()(
  "AccountSetupInProgressException",
  {},
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class OperationFailureException extends S.TaggedError<OperationFailureException>()(
  "OperationFailureException",
  {},
) {}
export class RegionSetupInProgressException extends S.TaggedError<RegionSetupInProgressException>()(
  "RegionSetupInProgressException",
  {},
) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  {},
) {}
export class UnauthenticatedException extends S.TaggedError<UnauthenticatedException>()(
  "UnauthenticatedException",
  {},
) {}

//# Operations
/**
 * Attaches one or more Lightsail instances to a load balancer.
 *
 * After some time, the instances are attached to the load balancer and the health check
 * status is available.
 *
 * The `attach instances to load balancer` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Lightsail Developer Guide.
 */
export const attachInstancesToLoadBalancer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AttachInstancesToLoadBalancerRequest,
    output: AttachInstancesToLoadBalancerResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Attaches a Transport Layer Security (TLS) certificate to your load balancer. TLS is just
 * an updated, more secure version of Secure Socket Layer (SSL).
 *
 * Once you create and validate your certificate, you can attach it to your load balancer.
 * You can also use this API to rotate the certificates on your account. Use the
 * `AttachLoadBalancerTlsCertificate` action with the non-attached certificate, and
 * it will replace the existing one and become the attached certificate.
 *
 * The `AttachLoadBalancerTlsCertificate` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const attachLoadBalancerTlsCertificate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AttachLoadBalancerTlsCertificateRequest,
    output: AttachLoadBalancerTlsCertificateResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Attaches a static IP address to a specific Amazon Lightsail instance.
 */
export const attachStaticIp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachStaticIpRequest,
  output: AttachStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Copies a manual snapshot of an instance or disk as another manual snapshot, or copies an
 * automatic snapshot of an instance or disk as a manual snapshot. This operation can also be
 * used to copy a manual or automatic snapshot of an instance or a disk from one Amazon Web Services Region to another in Amazon Lightsail.
 *
 * When copying a *manual snapshot*, be sure to define the source
 * region, `source snapshot name`, and `target snapshot name`
 * parameters.
 *
 * When copying an *automatic snapshot*, be sure to define the
 * `source region`, `source resource name`, target snapshot
 * name, and either the `restore date` or the use latest restorable
 * auto snapshot parameters.
 */
export const copySnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopySnapshotRequest,
  output: CopySnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an email or SMS text message contact method.
 *
 * A contact method is used to send you notifications about your Amazon Lightsail resources.
 * You can add one email address and one mobile phone number contact method in each Amazon Web Services Region. However, SMS text messaging is not supported in some Amazon Web Services
 * Regions, and SMS text messages cannot be sent to some countries/regions. For more information,
 * see Notifications in Amazon Lightsail.
 */
export const createContactMethod = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContactMethodRequest,
  output: CreateContactMethodResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a temporary set of log in credentials that you can use to log in to the Docker
 * process on your local machine. After you're logged in, you can use the native Docker commands
 * to push your local container images to the container image registry of your Amazon Lightsail
 * account so that you can use them with your Lightsail container service. The log in
 * credentials expire 12 hours after they are created, at which point you will need to create a
 * new set of log in credentials.
 *
 * You can only push container images to the container service registry of your Lightsail
 * account. You cannot pull container images or perform any other container image management
 * actions on the container service registry.
 *
 * After you push your container images to the container image registry of your Lightsail
 * account, use the `RegisterContainerImage` action to register the pushed images to a
 * specific Lightsail container service.
 *
 * This action is not required if you install and use the Lightsail Control
 * (lightsailctl) plugin to push container images to your Lightsail container service. For
 * more information, see Pushing and managing container images on your Amazon Lightsail container services
 * in the *Amazon Lightsail Developer Guide*.
 */
export const createContainerServiceRegistryLogin =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateContainerServiceRegistryLoginRequest,
    output: CreateContainerServiceRegistryLoginResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Creates a block storage disk from a manual or automatic snapshot of a disk. The resulting
 * disk can be attached to an Amazon Lightsail instance in the same Availability Zone
 * (`us-east-2a`).
 *
 * The `create disk from snapshot` operation supports tag-based access control via
 * request tags and resource tags applied to the resource identified by disk snapshot
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createDiskFromSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDiskFromSnapshotRequest,
    output: CreateDiskFromSnapshotResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Creates a snapshot of a block storage disk. You can use snapshots for backups, to make
 * copies of disks, and to save data before shutting down a Lightsail instance.
 *
 * You can take a snapshot of an attached disk that is in use; however, snapshots only
 * capture data that has been written to your disk at the time the snapshot command is issued.
 * This may exclude any data that has been cached by any applications or the operating system. If
 * you can pause any file systems on the disk long enough to take a snapshot, your snapshot
 * should be complete. Nevertheless, if you cannot pause all file writes to the disk, you should
 * unmount the disk from within the Lightsail instance, issue the create disk snapshot command,
 * and then remount the disk to ensure a consistent and complete snapshot. You may remount and
 * use your disk while the snapshot status is pending.
 *
 * You can also use this operation to create a snapshot of an instance's system volume. You
 * might want to do this, for example, to recover data from the system volume of a botched
 * instance or to create a backup of the system volume like you would for a block storage disk.
 * To create a snapshot of a system volume, just define the `instance name` parameter
 * when issuing the snapshot command, and a snapshot of the defined instance's system volume will
 * be created. After the snapshot is available, you can create a block storage disk from the
 * snapshot and attach it to a running instance to access the data on the disk.
 *
 * The `create disk snapshot` operation supports tag-based access control via
 * request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createDiskSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDiskSnapshotRequest,
  output: CreateDiskSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a domain resource for the specified domain (example.com).
 *
 * The `create domain` operation supports tag-based access control via request
 * tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainRequest,
  output: CreateDomainResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates one or more Amazon Lightsail instances.
 *
 * The `create instances` operation supports tag-based access control via request
 * tags. For more information, see the Lightsail Developer Guide.
 */
export const createInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInstancesRequest,
  output: CreateInstancesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a snapshot of a specific virtual private server, or *instance*.
 * You can use a snapshot to create a new instance that is based on that snapshot.
 *
 * The `create instance snapshot` operation supports tag-based access control via
 * request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createInstanceSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateInstanceSnapshotRequest,
    output: CreateInstanceSnapshotResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Creates a Lightsail load balancer. To learn more about deciding whether to load balance
 * your application, see Configure your Lightsail instances for load balancing. You can create up to 10
 * load balancers per AWS Region in your account.
 *
 * When you create a load balancer, you can specify a unique name and port settings. To
 * change additional load balancer settings, use the `UpdateLoadBalancerAttribute`
 * operation.
 *
 * The `create load balancer` operation supports tag-based access control via
 * request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createLoadBalancer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLoadBalancerRequest,
  output: CreateLoadBalancerResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an SSL/TLS certificate for an Amazon Lightsail load balancer.
 *
 * TLS is just an updated, more secure version of Secure Socket Layer (SSL).
 *
 * The `CreateLoadBalancerTlsCertificate` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createLoadBalancerTlsCertificate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateLoadBalancerTlsCertificateRequest,
    output: CreateLoadBalancerTlsCertificateResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Creates a new database in Amazon Lightsail.
 *
 * The `create relational database` operation supports tag-based access control
 * via request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createRelationalDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRelationalDatabaseRequest,
    output: CreateRelationalDatabaseResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Creates a new database from an existing database snapshot in Amazon Lightsail.
 *
 * You can create a new database from a snapshot in if something goes wrong with your
 * original database, or to change it to a different plan, such as a high availability or
 * standard plan.
 *
 * The `create relational database from snapshot` operation supports tag-based
 * access control via request tags and resource tags applied to the resource identified by
 * relationalDatabaseSnapshotName. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createRelationalDatabaseFromSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRelationalDatabaseFromSnapshotRequest,
    output: CreateRelationalDatabaseFromSnapshotResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Creates a snapshot of your database in Amazon Lightsail. You can use snapshots for backups,
 * to make copies of a database, and to save data before deleting a database.
 *
 * The `create relational database snapshot` operation supports tag-based access
 * control via request tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createRelationalDatabaseSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRelationalDatabaseSnapshotRequest,
    output: CreateRelationalDatabaseSnapshotResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Deletes an alarm.
 *
 * An alarm is used to monitor a single metric for one of your resources. When a metric
 * condition is met, the alarm can notify you by email, SMS text message, and a banner displayed
 * on the Amazon Lightsail console. For more information, see Alarms
 * in Amazon Lightsail.
 */
export const deleteAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAlarmRequest,
  output: DeleteAlarmResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an automatic snapshot of an instance or disk. For more information, see the Amazon Lightsail Developer Guide.
 */
export const deleteAutoSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutoSnapshotRequest,
  output: DeleteAutoSnapshotResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a Amazon Lightsail bucket.
 *
 * When you delete your bucket, the bucket name is released and can be reused for a new
 * bucket in your account or another Amazon Web Services account.
 */
export const deleteBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketRequest,
  output: DeleteBucketResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an access key for the specified Amazon Lightsail bucket.
 *
 * We recommend that you delete an access key if the secret access key is compromised.
 *
 * For more information about access keys, see Creating access keys for a bucket in Amazon Lightsail in the
 * *Amazon Lightsail Developer Guide*.
 */
export const deleteBucketAccessKey = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBucketAccessKeyRequest,
    output: DeleteBucketAccessKeyResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Deletes an SSL/TLS certificate for your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * Certificates that are currently attached to a distribution cannot be deleted. Use the
 * `DetachCertificateFromDistribution` action to detach a certificate from a
 * distribution.
 */
export const deleteCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCertificateRequest,
  output: DeleteCertificateResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a contact method.
 *
 * A contact method is used to send you notifications about your Amazon Lightsail resources.
 * You can add one email address and one mobile phone number contact method in each Amazon Web Services Region. However, SMS text messaging is not supported in some Amazon Web Services
 * Regions, and SMS text messages cannot be sent to some countries/regions. For more information,
 * see Notifications in Amazon Lightsail.
 */
export const deleteContactMethod = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContactMethodRequest,
  output: DeleteContactMethodResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a container image that is registered to your Amazon Lightsail container
 * service.
 */
export const deleteContainerImage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContainerImageRequest,
    output: DeleteContainerImageResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Deletes your Amazon Lightsail container service.
 */
export const deleteContainerService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContainerServiceRequest,
    output: DeleteContainerServiceResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Deletes the specified block storage disk. The disk must be in the `available`
 * state (not attached to a Lightsail instance).
 *
 * The disk may remain in the `deleting` state for several minutes.
 *
 * The `delete disk` operation supports tag-based access control via resource tags
 * applied to the resource identified by `disk name`. For more information, see the
 * Amazon Lightsail Developer Guide.
 */
export const deleteDisk = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDiskRequest,
  output: DeleteDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the specified disk snapshot.
 *
 * When you make periodic snapshots of a disk, the snapshots are incremental, and only the
 * blocks on the device that have changed since your last snapshot are saved in the new snapshot.
 * When you delete a snapshot, only the data not needed for any other snapshot is removed. So
 * regardless of which prior snapshots have been deleted, all active snapshots will have access
 * to all the information needed to restore the disk.
 *
 * The `delete disk snapshot` operation supports tag-based access control via
 * resource tags applied to the resource identified by `disk snapshot name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const deleteDiskSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDiskSnapshotRequest,
  output: DeleteDiskSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes your Amazon Lightsail content delivery network (CDN) distribution.
 */
export const deleteDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDistributionRequest,
  output: DeleteDistributionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the specified domain recordset and all of its domain records.
 *
 * The `delete domain` operation supports tag-based access control via resource
 * tags applied to the resource identified by `domain name`. For more information, see
 * the Amazon Lightsail Developer Guide.
 */
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a specific domain entry.
 *
 * The `delete domain entry` operation supports tag-based access control via
 * resource tags applied to the resource identified by `domain name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const deleteDomainEntry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainEntryRequest,
  output: DeleteDomainEntryResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an Amazon Lightsail instance.
 *
 * The `delete instance` operation supports tag-based access control via resource
 * tags applied to the resource identified by `instance name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const deleteInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInstanceRequest,
  output: DeleteInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a specific snapshot of a virtual private server (or
 * *instance*).
 *
 * The `delete instance snapshot` operation supports tag-based access control via
 * resource tags applied to the resource identified by `instance snapshot name`. For
 * more information, see the Amazon Lightsail Developer Guide.
 */
export const deleteInstanceSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInstanceSnapshotRequest,
    output: DeleteInstanceSnapshotResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Deletes the specified key pair by removing the public key from Amazon Lightsail.
 *
 * You can delete key pairs that were created using the ImportKeyPair and
 * CreateKeyPair actions, as well as the Lightsail default key pair. A new default
 * key pair will not be created unless you launch an instance without specifying a custom key
 * pair, or you call the DownloadDefaultKeyPair API.
 *
 * The `delete key pair` operation supports tag-based access control via resource
 * tags applied to the resource identified by `key pair name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const deleteKeyPair = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeyPairRequest,
  output: DeleteKeyPairResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the known host key or certificate used by the Amazon Lightsail browser-based SSH or
 * RDP clients to authenticate an instance. This operation enables the Lightsail browser-based
 * SSH or RDP clients to connect to the instance after a host key mismatch.
 *
 * Perform this operation only if you were expecting the host key or certificate mismatch
 * or if you are familiar with the new host key or certificate on the instance. For more
 * information, see Troubleshooting connection issues when using the Amazon Lightsail browser-based SSH or RDP
 * client.
 */
export const deleteKnownHostKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKnownHostKeysRequest,
  output: DeleteKnownHostKeysResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes a Lightsail load balancer and all its associated SSL/TLS certificates. Once the
 * load balancer is deleted, you will need to create a new load balancer, create a new
 * certificate, and verify domain ownership again.
 *
 * The `delete load balancer` operation supports tag-based access control via
 * resource tags applied to the resource identified by `load balancer name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const deleteLoadBalancer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoadBalancerRequest,
  output: DeleteLoadBalancerResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes an SSL/TLS certificate associated with a Lightsail load balancer.
 *
 * The `DeleteLoadBalancerTlsCertificate` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const deleteLoadBalancerTlsCertificate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteLoadBalancerTlsCertificateRequest,
    output: DeleteLoadBalancerTlsCertificateResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Deletes a database in Amazon Lightsail.
 *
 * The `delete relational database` operation supports tag-based access control
 * via resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const deleteRelationalDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRelationalDatabaseRequest,
    output: DeleteRelationalDatabaseResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Deletes a database snapshot in Amazon Lightsail.
 *
 * The `delete relational database snapshot` operation supports tag-based access
 * control via resource tags applied to the resource identified by relationalDatabaseName. For
 * more information, see the Amazon Lightsail Developer Guide.
 */
export const deleteRelationalDatabaseSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRelationalDatabaseSnapshotRequest,
    output: DeleteRelationalDatabaseSnapshotResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Detaches an SSL/TLS certificate from your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * After the certificate is detached, your distribution stops accepting traffic for all of
 * the domains that are associated with the certificate.
 */
export const detachCertificateFromDistribution =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DetachCertificateFromDistributionRequest,
    output: DetachCertificateFromDistributionResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Detaches a stopped block storage disk from a Lightsail instance. Make sure to unmount
 * any file systems on the device within your operating system before stopping the instance and
 * detaching the disk.
 *
 * The `detach disk` operation supports tag-based access control via resource tags
 * applied to the resource identified by `disk name`. For more information, see the
 * Amazon Lightsail Developer Guide.
 */
export const detachDisk = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachDiskRequest,
  output: DetachDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Detaches the specified instances from a Lightsail load balancer.
 *
 * This operation waits until the instances are no longer needed before they are detached
 * from the load balancer.
 *
 * The `detach instances from load balancer` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const detachInstancesFromLoadBalancer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DetachInstancesFromLoadBalancerRequest,
    output: DetachInstancesFromLoadBalancerResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Detaches a static IP from the Amazon Lightsail instance to which it is attached.
 */
export const detachStaticIp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachStaticIpRequest,
  output: DetachStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Disables an add-on for an Amazon Lightsail resource. For more information, see the Amazon Lightsail Developer Guide.
 */
export const disableAddOn = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableAddOnRequest,
  output: DisableAddOnResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Downloads the regional Amazon Lightsail default key pair.
 *
 * This action also creates a Lightsail default key pair if a default key pair
 * does not currently exist in the Amazon Web Services Region.
 */
export const downloadDefaultKeyPair = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DownloadDefaultKeyPairRequest,
    output: DownloadDefaultKeyPairResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Enables or modifies an add-on for an Amazon Lightsail resource. For more information, see
 * the Amazon Lightsail Developer Guide.
 */
export const enableAddOn = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableAddOnRequest,
  output: EnableAddOnResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Exports an Amazon Lightsail instance or block storage disk snapshot to Amazon Elastic Compute Cloud (Amazon EC2).
 * This operation results in an export snapshot record that can be used with the create
 * cloud formation stack operation to create new Amazon EC2 instances.
 *
 * Exported instance snapshots appear in Amazon EC2 as Amazon Machine Images (AMIs), and the
 * instance system disk appears as an Amazon Elastic Block Store (Amazon EBS) volume. Exported disk snapshots appear in
 * Amazon EC2 as Amazon EBS volumes. Snapshots are exported to the same Amazon Web Services Region in
 * Amazon EC2 as the source Lightsail snapshot.
 *
 * The `export snapshot` operation supports tag-based access control via resource
 * tags applied to the resource identified by `source snapshot name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 *
 * Use the `get instance snapshots` or `get disk snapshots`
 * operations to get a list of snapshots that you can export to Amazon EC2.
 */
export const exportSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportSnapshotRequest,
  output: ExportSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the names of all active (not deleted) resources.
 */
export const getActiveNames = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetActiveNamesRequest,
  output: GetActiveNamesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the existing access key IDs for the specified Amazon Lightsail bucket.
 *
 * This action does not return the secret access key value of an access key. You can get a
 * secret access key only when you create it from the response of the CreateBucketAccessKey action. If you lose the secret access key, you must create
 * a new access key.
 */
export const getBucketAccessKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketAccessKeysRequest,
  output: GetBucketAccessKeysResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about one or more Amazon Lightsail SSL/TLS certificates.
 *
 * To get a summary of a certificate, omit `includeCertificateDetails` from your
 * request. The response will include only the certificate Amazon Resource Name (ARN),
 * certificate name, domain name, and tags.
 */
export const getCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCertificatesRequest,
  output: GetCertificatesResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about Amazon Lightsail containers, such as the current version of the
 * Lightsail Control (lightsailctl) plugin.
 */
export const getContainerAPIMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetContainerAPIMetadataRequest,
    output: GetContainerAPIMetadataResult,
    errors: [
      AccessDeniedException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns the data points of a specific metric of your Amazon Lightsail container
 * service.
 *
 * Metrics report the utilization of your resources. Monitor and collect metric data
 * regularly to maintain the reliability, availability, and performance of your resources.
 */
export const getContainerServiceMetricData =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetContainerServiceMetricDataRequest,
    output: GetContainerServiceMetricDataResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns the list of powers that can be specified for your Amazon Lightsail container
 * services.
 *
 * The power specifies the amount of memory, the number of vCPUs, and the base price of the
 * container service.
 */
export const getContainerServicePowers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetContainerServicePowersRequest,
    output: GetContainerServicePowersResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns information about all block storage disks in your AWS account and region.
 */
export const getDisks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDisksRequest,
  output: GetDisksResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all block storage disk snapshots in your AWS account and
 * region.
 */
export const getDiskSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDiskSnapshotsRequest,
  output: GetDiskSnapshotsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the bundles that can be applied to your Amazon Lightsail content delivery network
 * (CDN) distributions.
 *
 * A distribution bundle specifies the monthly network transfer quota and monthly cost of
 * your distribution.
 */
export const getDistributionBundles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDistributionBundlesRequest,
    output: GetDistributionBundlesResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns the timestamp and status of the last cache reset of a specific Amazon Lightsail
 * content delivery network (CDN) distribution.
 */
export const getDistributionLatestCacheReset =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDistributionLatestCacheResetRequest,
    output: GetDistributionLatestCacheResetResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns the data points of a specific metric for an Amazon Lightsail content delivery
 * network (CDN) distribution.
 *
 * Metrics report the utilization of your resources, and the error counts generated by them.
 * Monitor and collect metric data regularly to maintain the reliability, availability, and
 * performance of your resources.
 */
export const getDistributionMetricData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDistributionMetricDataRequest,
    output: GetDistributionMetricDataResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns a list of all domains in the user's account.
 */
export const getDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainsRequest,
  output: GetDomainsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the data points for the specified Amazon Lightsail instance metric, given an
 * instance name.
 *
 * Metrics report the utilization of your resources, and the error counts generated by them.
 * Monitor and collect metric data regularly to maintain the reliability, availability, and
 * performance of your resources.
 */
export const getInstanceMetricData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInstanceMetricDataRequest,
    output: GetInstanceMetricDataResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns information about all Amazon Lightsail virtual private servers, or
 * *instances*.
 */
export const getInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstancesRequest,
  output: GetInstancesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns all instance snapshots for the user's account.
 */
export const getInstanceSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInstanceSnapshotsRequest,
    output: GetInstanceSnapshotsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns information about a specific key pair.
 */
export const getKeyPair = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyPairRequest,
  output: GetKeyPairResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all key pairs in the user's account.
 */
export const getKeyPairs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyPairsRequest,
  output: GetKeyPairsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about health metrics for your Lightsail load balancer.
 *
 * Metrics report the utilization of your resources, and the error counts generated by them.
 * Monitor and collect metric data regularly to maintain the reliability, availability, and
 * performance of your resources.
 */
export const getLoadBalancerMetricData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLoadBalancerMetricDataRequest,
    output: GetLoadBalancerMetricDataResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns information about all load balancers in an account.
 */
export const getLoadBalancers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoadBalancersRequest,
  output: GetLoadBalancersResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific operation. Operations include events such as when you
 * create an instance, allocate a static IP, attach a static IP, and so on.
 */
export const getOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationRequest,
  output: GetOperationResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about all operations.
 *
 * Results are returned from oldest to newest, up to a maximum of 200. Results can be paged
 * by making each subsequent call to `GetOperations` use the maximum (last)
 * `statusChangedAt` value from the previous request.
 */
export const getOperations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationsRequest,
  output: GetOperationsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Gets operations for a specific resource (an instance or a static IP).
 */
export const getOperationsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOperationsForResourceRequest,
    output: GetOperationsForResourceResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns a list of available log streams for a specific database in Amazon Lightsail.
 */
export const getRelationalDatabaseLogStreams =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRelationalDatabaseLogStreamsRequest,
    output: GetRelationalDatabaseLogStreamsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns the current, previous, or pending versions of the master user password for a
 * Lightsail database.
 *
 * The `GetRelationalDatabaseMasterUserPassword` operation supports tag-based
 * access control via resource tags applied to the resource identified by
 * relationalDatabaseName.
 */
export const getRelationalDatabaseMasterUserPassword =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRelationalDatabaseMasterUserPasswordRequest,
    output: GetRelationalDatabaseMasterUserPasswordResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns the data points of the specified metric for a database in Amazon Lightsail.
 *
 * Metrics report the utilization of your resources, and the error counts generated by them.
 * Monitor and collect metric data regularly to maintain the reliability, availability, and
 * performance of your resources.
 */
export const getRelationalDatabaseMetricData =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRelationalDatabaseMetricDataRequest,
    output: GetRelationalDatabaseMetricDataResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns all of the runtime parameters offered by the underlying database software, or
 * engine, for a specific database in Amazon Lightsail.
 *
 * In addition to the parameter names and values, this operation returns other information
 * about each parameter. This information includes whether changes require a reboot, whether the
 * parameter is modifiable, the allowed values, and the data types.
 */
export const getRelationalDatabaseParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRelationalDatabaseParametersRequest,
    output: GetRelationalDatabaseParametersResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns information about all of your databases in Amazon Lightsail.
 */
export const getRelationalDatabases = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRelationalDatabasesRequest,
    output: GetRelationalDatabasesResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns information about all of your database snapshots in Amazon Lightsail.
 */
export const getRelationalDatabaseSnapshots =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRelationalDatabaseSnapshotsRequest,
    output: GetRelationalDatabaseSnapshotsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns information about all static IPs in the user's account.
 */
export const getStaticIps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStaticIpsRequest,
  output: GetStaticIpsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Imports a public SSH key from a specific key pair.
 */
export const importKeyPair = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportKeyPairRequest,
  output: ImportKeyPairResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a Boolean value indicating whether your Lightsail VPC is peered.
 */
export const isVpcPeered = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IsVpcPeeredRequest,
  output: IsVpcPeeredResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Opens ports for a specific Amazon Lightsail instance, and specifies the IP addresses
 * allowed to connect to the instance through the ports, and the protocol.
 *
 * The `OpenInstancePublicPorts` action supports tag-based access control via
 * resource tags applied to the resource identified by `instanceName`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const openInstancePublicPorts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: OpenInstancePublicPortsRequest,
    output: OpenInstancePublicPortsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Creates or updates an alarm, and associates it with the specified metric.
 *
 * An alarm is used to monitor a single metric for one of your resources. When a metric
 * condition is met, the alarm can notify you by email, SMS text message, and a banner displayed
 * on the Amazon Lightsail console. For more information, see Alarms
 * in Amazon Lightsail.
 *
 * When this action creates an alarm, the alarm state is immediately set to
 * `INSUFFICIENT_DATA`. The alarm is then evaluated and its state is set
 * appropriately. Any actions associated with the new state are then executed.
 *
 * When you update an existing alarm, its state is left unchanged, but the update completely
 * overwrites the previous configuration of the alarm. The alarm is then evaluated with the
 * updated configuration.
 */
export const putAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAlarmRequest,
  output: PutAlarmResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Opens ports for a specific Amazon Lightsail instance, and specifies the IP addresses
 * allowed to connect to the instance through the ports, and the protocol. This action also
 * closes all currently open ports that are not included in the request. Include all of the ports
 * and the protocols you want to open in your `PutInstancePublicPorts`request. Or use
 * the `OpenInstancePublicPorts` action to open ports without closing currently open
 * ports.
 *
 * The `PutInstancePublicPorts` action supports tag-based access control via
 * resource tags applied to the resource identified by `instanceName`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const putInstancePublicPorts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutInstancePublicPortsRequest,
    output: PutInstancePublicPortsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Restarts a specific instance.
 *
 * The `reboot instance` operation supports tag-based access control via resource
 * tags applied to the resource identified by `instance name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const rebootInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootInstanceRequest,
  output: RebootInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Restarts a specific database in Amazon Lightsail.
 *
 * The `reboot relational database` operation supports tag-based access control
 * via resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const rebootRelationalDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RebootRelationalDatabaseRequest,
    output: RebootRelationalDatabaseResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Registers a container image to your Amazon Lightsail container service.
 *
 * This action is not required if you install and use the Lightsail Control
 * (lightsailctl) plugin to push container images to your Lightsail container service. For
 * more information, see Pushing and managing container images on your Amazon Lightsail container services
 * in the *Amazon Lightsail Developer Guide*.
 */
export const registerContainerImage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterContainerImageRequest,
    output: RegisterContainerImageResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Deletes a specific static IP from your account.
 */
export const releaseStaticIp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReleaseStaticIpRequest,
  output: ReleaseStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes currently cached content from your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * After resetting the cache, the next time a content request is made, your distribution
 * pulls, serves, and caches it from the origin.
 */
export const resetDistributionCache = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetDistributionCacheRequest,
    output: ResetDistributionCacheResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Sends a verification request to an email contact method to ensure it's owned by the
 * requester. SMS contact methods don't need to be verified.
 *
 * A contact method is used to send you notifications about your Amazon Lightsail resources.
 * You can add one email address and one mobile phone number contact method in each Amazon Web Services Region. However, SMS text messaging is not supported in some Amazon Web Services
 * Regions, and SMS text messages cannot be sent to some countries/regions. For more information,
 * see Notifications in Amazon Lightsail.
 *
 * A verification request is sent to the contact method when you initially create it. Use
 * this action to send another verification request if a previous verification request was
 * deleted, or has expired.
 *
 * Notifications are not sent to an email contact method until after it is verified, and
 * confirmed as valid.
 */
export const sendContactMethodVerification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SendContactMethodVerificationRequest,
    output: SendContactMethodVerificationResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Sets the IP address type for an Amazon Lightsail resource.
 *
 * Use this action to enable dual-stack for a resource, which enables IPv4 and IPv6 for the
 * specified resource. Alternately, you can use this action to disable dual-stack, and enable
 * IPv4 only.
 */
export const setIpAddressType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetIpAddressTypeRequest,
  output: SetIpAddressTypeResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Sets the Amazon Lightsail resources that can access the specified Lightsail
 * bucket.
 *
 * Lightsail buckets currently support setting access for Lightsail instances in the same
 * Amazon Web Services Region.
 */
export const setResourceAccessForBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetResourceAccessForBucketRequest,
    output: SetResourceAccessForBucketResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Creates an SSL/TLS certificate that secures traffic for your website. After the
 * certificate is created, it is installed on the specified Lightsail instance.
 *
 * If you provide more than one domain name in the request, at least one name must be less
 * than or equal to 63 characters in length.
 */
export const setupInstanceHttps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetupInstanceHttpsRequest,
  output: SetupInstanceHttpsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Initiates a graphical user interface (GUI) session that’s used to access a virtual
 * computer’s operating system and application. The session will be active for 1 hour. Use this
 * action to resume the session after it expires.
 */
export const startGUISession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartGUISessionRequest,
  output: StartGUISessionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Starts a specific Amazon Lightsail instance from a stopped state. To restart an instance,
 * use the `reboot instance` operation.
 *
 * When you start a stopped instance, Lightsail assigns a new public IP address to the
 * instance. To use the same IP address after stopping and starting an instance, create a
 * static IP address and attach it to the instance. For more information, see the Amazon Lightsail Developer Guide.
 *
 * The `start instance` operation supports tag-based access control via resource
 * tags applied to the resource identified by `instance name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const startInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartInstanceRequest,
  output: StartInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Starts a specific database from a stopped state in Amazon Lightsail. To restart a database,
 * use the `reboot relational database` operation.
 *
 * The `start relational database` operation supports tag-based access control via
 * resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const startRelationalDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartRelationalDatabaseRequest,
    output: StartRelationalDatabaseResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Terminates a web-based Amazon DCV session that’s used to access a virtual computer’s
 * operating system or application. The session will close and any unsaved data will be
 * lost.
 */
export const stopGUISession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopGUISessionRequest,
  output: StopGUISessionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Stops a specific Amazon Lightsail instance that is currently running.
 *
 * When you start a stopped instance, Lightsail assigns a new public IP address to the
 * instance. To use the same IP address after stopping and starting an instance, create a
 * static IP address and attach it to the instance. For more information, see the Amazon Lightsail Developer Guide.
 *
 * The `stop instance` operation supports tag-based access control via resource
 * tags applied to the resource identified by `instance name`. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const stopInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopInstanceRequest,
  output: StopInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Stops a specific database that is currently running in Amazon Lightsail.
 *
 * If you don't manually start your database instance after it has been stopped for seven
 * consecutive days, Amazon Lightsail automatically starts it for you. This action helps ensure
 * that your database instance doesn't fall behind on any required maintenance updates.
 *
 * The `stop relational database` operation supports tag-based access control via
 * resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const stopRelationalDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopRelationalDatabaseRequest,
    output: StopRelationalDatabaseResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Adds one or more tags to the specified Amazon Lightsail resource. Each resource can have a
 * maximum of 50 tags. Each tag consists of a key and an optional value. Tag keys must be unique
 * per resource. For more information about tags, see the Amazon Lightsail Developer Guide.
 *
 * The `tag resource` operation supports tag-based access control via request tags
 * and resource tags applied to the resource identified by `resource name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Tests an alarm by displaying a banner on the Amazon Lightsail console. If a notification
 * trigger is configured for the specified alarm, the test also sends a notification to the
 * notification protocol (`Email` and/or `SMS`) configured for the
 * alarm.
 *
 * An alarm is used to monitor a single metric for one of your resources. When a metric
 * condition is met, the alarm can notify you by email, SMS text message, and a banner displayed
 * on the Amazon Lightsail console. For more information, see Alarms
 * in Amazon Lightsail.
 */
export const testAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestAlarmRequest,
  output: TestAlarmResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Unpeers the Lightsail VPC from the user's default VPC.
 */
export const unpeerVpc = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnpeerVpcRequest,
  output: UnpeerVpcResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Deletes the specified set of tag keys and their values from the specified Amazon Lightsail
 * resource.
 *
 * The `untag resource` operation supports tag-based access control via request
 * tags and resource tags applied to the resource identified by `resource name`. For
 * more information, see the Amazon Lightsail Developer Guide.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates the bundle, or storage plan, of an existing Amazon Lightsail bucket.
 *
 * A bucket bundle specifies the monthly cost, storage space, and data transfer quota for a
 * bucket. You can update a bucket's bundle only one time within a monthly Amazon Web Services
 * billing cycle. To determine if you can update a bucket's bundle, use the GetBuckets action. The
 * `ableToUpdateBundle` parameter in the response will indicate whether you can
 * currently update a bucket's bundle.
 *
 * Update a bucket's bundle if it's consistently going over its storage space or data
 * transfer quota, or if a bucket's usage is consistently in the lower range of its storage space
 * or data transfer quota. Due to the unpredictable usage fluctuations that a bucket might
 * experience, we strongly recommend that you update a bucket's bundle only as a long-term
 * strategy, instead of as a short-term, monthly cost-cutting measure. Choose a bucket bundle
 * that will provide the bucket with ample storage space and data transfer for a long time to
 * come.
 */
export const updateBucketBundle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBucketBundleRequest,
  output: UpdateBucketBundleResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates the configuration of your Amazon Lightsail container service, such as its power,
 * scale, and public domain names.
 */
export const updateContainerService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContainerServiceRequest,
    output: UpdateContainerServiceResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Updates an existing Amazon Lightsail content delivery network (CDN) distribution.
 *
 * Use this action to update the configuration of your existing distribution.
 */
export const updateDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDistributionRequest,
  output: UpdateDistributionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates the bundle of your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * A distribution bundle specifies the monthly network transfer quota and monthly cost of
 * your distribution.
 *
 * Update your distribution's bundle if your distribution is going over its monthly network
 * transfer quota and is incurring an overage fee.
 *
 * You can update your distribution's bundle only one time within your monthly Amazon Web Services billing cycle. To determine if you can update your distribution's bundle, use the
 * `GetDistributions` action. The `ableToUpdateBundle` parameter in the
 * result will indicate whether you can currently update your distribution's bundle.
 */
export const updateDistributionBundle = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDistributionBundleRequest,
    output: UpdateDistributionBundleResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Updates a domain recordset after it is created.
 *
 * The `update domain entry` operation supports tag-based access control via
 * resource tags applied to the resource identified by `domain name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const updateDomainEntry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainEntryRequest,
  output: UpdateDomainEntryResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Modifies the Amazon Lightsail instance metadata parameters on a running or stopped
 * instance. When you modify the parameters on a running instance, the `GetInstance`
 * or `GetInstances` API operation initially responds with a state of
 * `pending`. After the parameter modifications are successfully applied, the state
 * changes to `applied` in subsequent `GetInstance` or
 * `GetInstances` API calls. For more information, see Use IMDSv2 with an Amazon Lightsail instance in the *Amazon Lightsail Developer Guide*.
 */
export const updateInstanceMetadataOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateInstanceMetadataOptionsRequest,
    output: UpdateInstanceMetadataOptionsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Updates the specified attribute for a load balancer. You can only update one attribute at
 * a time.
 *
 * The `update load balancer attribute` operation supports tag-based access
 * control via resource tags applied to the resource identified by load balancer
 * name. For more information, see the Amazon Lightsail Developer Guide.
 */
export const updateLoadBalancerAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLoadBalancerAttributeRequest,
    output: UpdateLoadBalancerAttributeResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Allows the update of one or more attributes of a database in Amazon Lightsail.
 *
 * Updates are applied immediately, or in cases where the updates could result in an outage,
 * are applied during the database's predefined maintenance window.
 *
 * The `update relational database` operation supports tag-based access control
 * via resource tags applied to the resource identified by relationalDatabaseName. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const updateRelationalDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRelationalDatabaseRequest,
    output: UpdateRelationalDatabaseResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Allocates a static IP address.
 */
export const allocateStaticIp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AllocateStaticIpRequest,
  output: AllocateStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Attaches an SSL/TLS certificate to your Amazon Lightsail content delivery network (CDN)
 * distribution.
 *
 * After the certificate is attached, your distribution accepts HTTPS traffic for all of the
 * domains that are associated with the certificate.
 *
 * Use the `CreateCertificate` action to create a certificate that you can attach
 * to your distribution.
 *
 * Only certificates created in the `us-east-1`
 * Amazon Web Services Region can be attached to Lightsail distributions. Lightsail
 * distributions are global resources that can reference an origin in any Amazon Web Services
 * Region, and distribute its content globally. However, all distributions are located in the
 * `us-east-1` Region.
 */
export const attachCertificateToDistribution =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AttachCertificateToDistributionRequest,
    output: AttachCertificateToDistributionResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Attaches a block storage disk to a running or stopped Lightsail instance and exposes it
 * to the instance with the specified disk name.
 *
 * The `attach disk` operation supports tag-based access control via resource tags
 * applied to the resource identified by `disk name`. For more information, see the
 * Amazon Lightsail Developer Guide.
 */
export const attachDisk = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachDiskRequest,
  output: AttachDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Closes ports for a specific Amazon Lightsail instance.
 *
 * The `CloseInstancePublicPorts` action supports tag-based access control via
 * resource tags applied to the resource identified by `instanceName`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const closeInstancePublicPorts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CloseInstancePublicPortsRequest,
    output: CloseInstancePublicPortsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Creates an Amazon Lightsail bucket.
 *
 * A bucket is a cloud storage resource available in the Lightsail object storage service.
 * Use buckets to store objects such as data and its descriptive metadata. For more information
 * about buckets, see Buckets in Amazon Lightsail in the Amazon Lightsail Developer
 * Guide.
 */
export const createBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBucketRequest,
  output: CreateBucketResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an AWS CloudFormation stack, which creates a new Amazon EC2 instance from an exported
 * Amazon Lightsail snapshot. This operation results in a CloudFormation stack record that can be
 * used to track the AWS CloudFormation stack created. Use the get cloud formation stack
 * records operation to get a list of the CloudFormation stacks created.
 *
 * Wait until after your new Amazon EC2 instance is created before running the create
 * cloud formation stack operation again with the same export snapshot record.
 */
export const createCloudFormationStack = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCloudFormationStackRequest,
    output: CreateCloudFormationStackResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Creates two URLs that are used to access a virtual computer’s graphical user interface
 * (GUI) session. The primary URL initiates a web-based Amazon DCV session to the virtual
 * computer's application. The secondary URL initiates a web-based Amazon DCV session to the
 * virtual computer's operating session.
 *
 * Use `StartGUISession` to open the session.
 */
export const createGUISessionAccessDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateGUISessionAccessDetailsRequest,
    output: CreateGUISessionAccessDetailsResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Creates a custom SSH key pair that you can use with an Amazon Lightsail
 * instance.
 *
 * Use the DownloadDefaultKeyPair action to create a Lightsail default key
 * pair in an Amazon Web Services Region where a default key pair does not currently
 * exist.
 *
 * The `create key pair` operation supports tag-based access control via request
 * tags. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createKeyPair = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeyPairRequest,
  output: CreateKeyPairResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the list of available instance images, or *blueprints*. You can
 * use a blueprint to create a new instance already running a specific operating system, as well
 * as a preinstalled app or development stack. The software each instance is running depends on
 * the blueprint image you choose.
 *
 * Use active blueprints when creating new instances. Inactive blueprints are listed to
 * support customers with existing instances and are not necessarily available to create new
 * instances. Blueprints are marked inactive when they become outdated due to operating system
 * updates or new application releases.
 */
export const getBlueprints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlueprintsRequest,
  output: GetBlueprintsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the bundles that you can apply to a Amazon Lightsail bucket.
 *
 * The bucket bundle specifies the monthly cost, storage quota, and data transfer quota for a
 * bucket.
 *
 * Use the UpdateBucketBundle action to update the
 * bundle for a bucket.
 */
export const getBucketBundles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketBundlesRequest,
  output: GetBucketBundlesResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the data points of a specific metric for an Amazon Lightsail bucket.
 *
 * Metrics report the utilization of a bucket. View and collect metric data regularly to
 * monitor the number of objects stored in a bucket (including object versions) and the storage
 * space used by those objects.
 */
export const getBucketMetricData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketMetricDataRequest,
  output: GetBucketMetricDataResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the bundles that you can apply to an Amazon Lightsail instance when you create
 * it.
 *
 * A bundle describes the specifications of an instance, such as the monthly cost, amount of
 * memory, the number of vCPUs, amount of storage space, and monthly network data transfer
 * quota.
 *
 * Bundles are referred to as *instance plans* in the Lightsail
 * console.
 */
export const getBundles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBundlesRequest,
  output: GetBundlesResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about the configured contact methods. Specify a protocol in your
 * request to return information about a specific contact method.
 *
 * A contact method is used to send you notifications about your Amazon Lightsail resources.
 * You can add one email address and one mobile phone number contact method in each Amazon Web Services Region. However, SMS text messaging is not supported in some Amazon Web Services
 * Regions, and SMS text messages cannot be sent to some countries/regions. For more information,
 * see Notifications in Amazon Lightsail.
 */
export const getContactMethods = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContactMethodsRequest,
  output: GetContactMethodsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the container images that are registered to your Amazon Lightsail container
 * service.
 *
 * If you created a deployment on your Lightsail container service that uses container
 * images from a public registry like Docker Hub, those images are not returned as part of this
 * action. Those images are not registered to your Lightsail container service.
 */
export const getContainerImages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerImagesRequest,
  output: GetContainerImagesResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the log events of a container of your Amazon Lightsail container service.
 *
 * If your container service has more than one node (i.e., a scale greater than 1), then the
 * log events that are returned for the specified container are merged from all nodes on your
 * container service.
 *
 * Container logs are retained for a certain amount of time. For more information, see
 * Amazon Lightsail
 * endpoints and quotas in the Amazon Web Services General
 * Reference.
 */
export const getContainerLog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerLogRequest,
  output: GetContainerLogResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific block storage disk snapshot.
 */
export const getDiskSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDiskSnapshotRequest,
  output: GetDiskSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the firewall port states for a specific Amazon Lightsail instance, the IP addresses
 * allowed to connect to the instance through the ports, and the protocol.
 */
export const getInstancePortStates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInstancePortStatesRequest,
    output: GetInstancePortStatesResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns information about a specific instance snapshot.
 */
export const getInstanceSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceSnapshotRequest,
  output: GetInstanceSnapshotResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the state of a specific instance. Works on one instance at a time.
 */
export const getInstanceState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceStateRequest,
  output: GetInstanceStateResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a list of TLS security policies that you can apply to Lightsail load
 * balancers.
 *
 * For more information about load balancer TLS security policies, see Configuring TLS security policies on your Amazon Lightsail load
 * balancers in the *Amazon Lightsail Developer Guide*.
 */
export const getLoadBalancerTlsPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLoadBalancerTlsPoliciesRequest,
    output: GetLoadBalancerTlsPoliciesResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns a list of available database blueprints in Amazon Lightsail. A blueprint describes
 * the major engine version of a database.
 *
 * You can use a blueprint ID to create a new database that runs a specific database
 * engine.
 */
export const getRelationalDatabaseBlueprints =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRelationalDatabaseBlueprintsRequest,
    output: GetRelationalDatabaseBlueprintsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns the list of bundles that are available in Amazon Lightsail. A bundle describes the
 * performance specifications for a database.
 *
 * You can use a bundle ID to create a new database with explicit performance
 * specifications.
 */
export const getRelationalDatabaseBundles =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRelationalDatabaseBundlesRequest,
    output: GetRelationalDatabaseBundlesResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns a list of events for a specific database in Amazon Lightsail.
 */
export const getRelationalDatabaseEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRelationalDatabaseEventsRequest,
    output: GetRelationalDatabaseEventsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns a list of log events for a database in Amazon Lightsail.
 */
export const getRelationalDatabaseLogEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRelationalDatabaseLogEventsRequest,
    output: GetRelationalDatabaseLogEventsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns information about a specific database snapshot in Amazon Lightsail.
 */
export const getRelationalDatabaseSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRelationalDatabaseSnapshotRequest,
    output: GetRelationalDatabaseSnapshotResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns information about an Amazon Lightsail static IP.
 */
export const getStaticIp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStaticIpRequest,
  output: GetStaticIpResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Peers the Lightsail VPC with the user's default VPC.
 */
export const peerVpc = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PeerVpcRequest,
  output: PeerVpcResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Allows the update of one or more parameters of a database in Amazon Lightsail.
 *
 * Parameter updates don't cause outages; therefore, their application is not subject to the
 * preferred maintenance window. However, there are two ways in which parameter updates are
 * applied: `dynamic` or `pending-reboot`. Parameters marked with a
 * `dynamic` apply type are applied immediately. Parameters marked with a
 * `pending-reboot` apply type are applied only after the database is rebooted using
 * the `reboot relational database` operation.
 *
 * The `update relational database parameters` operation supports tag-based access
 * control via resource tags applied to the resource identified by relationalDatabaseName. For
 * more information, see the Amazon Lightsail Developer Guide.
 */
export const updateRelationalDatabaseParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateRelationalDatabaseParametersRequest,
    output: UpdateRelationalDatabaseParametersResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Creates a new access key for the specified Amazon Lightsail bucket. Access keys consist of
 * an access key ID and corresponding secret access key.
 *
 * Access keys grant full programmatic access to the specified bucket and its objects. You
 * can have a maximum of two access keys per bucket. Use the GetBucketAccessKeys action to get a list of current access keys for a specific bucket. For more
 * information about access keys, see Creating access keys for a bucket in Amazon Lightsail in the
 * *Amazon Lightsail Developer Guide*.
 *
 * The `secretAccessKey` value is returned only in response to the
 * `CreateBucketAccessKey` action. You can get a secret access key only when you
 * first create an access key; you cannot get the secret access key later. If you lose the
 * secret access key, you must create a new access key.
 */
export const createBucketAccessKey = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateBucketAccessKeyRequest,
    output: CreateBucketAccessKeyResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Creates an Amazon Lightsail container service.
 *
 * A Lightsail container service is a compute resource to which you can deploy containers.
 * For more information, see Container services in Amazon Lightsail in the Lightsail Dev
 * Guide.
 */
export const createContainerService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateContainerServiceRequest,
    output: CreateContainerServiceResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Creates a block storage disk that can be attached to an Amazon Lightsail instance in the
 * same Availability Zone (`us-east-2a`).
 *
 * The `create disk` operation supports tag-based access control via request tags.
 * For more information, see the Amazon Lightsail Developer Guide.
 */
export const createDisk = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDiskRequest,
  output: CreateDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates an Amazon Lightsail content delivery network (CDN) distribution.
 *
 * A distribution is a globally distributed network of caching servers that improve the
 * performance of your website or web application hosted on a Lightsail instance. For more
 * information, see Content delivery networks in Amazon Lightsail.
 */
export const createDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDistributionRequest,
  output: CreateDistributionResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates one of the following domain name system (DNS) records in a domain DNS zone:
 * Address (A), canonical name (CNAME), mail exchanger (MX), name server (NS), start of authority
 * (SOA), service locator (SRV), or text (TXT).
 *
 * The `create domain entry` operation supports tag-based access control via
 * resource tags applied to the resource identified by `domain name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const createDomainEntry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainEntryRequest,
  output: CreateDomainEntryResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates one or more new instances from a manual or automatic snapshot of an
 * instance.
 *
 * The `create instances from snapshot` operation supports tag-based access
 * control via request tags and resource tags applied to the resource identified by
 * `instance snapshot name`. For more information, see the Amazon Lightsail Developer Guide.
 */
export const createInstancesFromSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateInstancesFromSnapshotRequest,
    output: CreateInstancesFromSnapshotResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns information about the configured alarms. Specify an alarm name in your request to
 * return information about a specific alarm, or specify a monitored resource name to return
 * information about all alarms for a specific resource.
 *
 * An alarm is used to monitor a single metric for one of your resources. When a metric
 * condition is met, the alarm can notify you by email, SMS text message, and a banner displayed
 * on the Amazon Lightsail console. For more information, see Alarms
 * in Amazon Lightsail.
 */
export const getAlarms = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAlarmsRequest,
  output: GetAlarmsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the available automatic snapshots for an instance or disk. For more information,
 * see the Amazon Lightsail Developer Guide.
 */
export const getAutoSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutoSnapshotsRequest,
  output: GetAutoSnapshotsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about one or more Amazon Lightsail buckets. The information returned
 * includes the synchronization status of the Amazon Simple Storage Service (Amazon S3)
 * account-level block public access feature for your Lightsail buckets.
 *
 * For more information about buckets, see Buckets in Amazon Lightsail in the Amazon Lightsail Developer
 * Guide.
 */
export const getBuckets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketsRequest,
  output: GetBucketsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns the CloudFormation stack record created as a result of the create cloud
 * formation stack operation.
 *
 * An AWS CloudFormation stack is used to create a new Amazon EC2 instance from an exported Lightsail
 * snapshot.
 */
export const getCloudFormationStackRecords =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCloudFormationStackRecordsRequest,
    output: GetCloudFormationStackRecordsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns the deployments for your Amazon Lightsail container service
 *
 * A deployment specifies the settings, such as the ports and launch command, of containers
 * that are deployed to your container service.
 *
 * The deployments are ordered by version in ascending order. The newest version is listed at
 * the top of the response.
 *
 * A set number of deployments are kept before the oldest one is replaced with the newest
 * one. For more information, see Amazon Lightsail
 * endpoints and quotas in the Amazon Web Services General
 * Reference.
 */
export const getContainerServiceDeployments =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetContainerServiceDeploymentsRequest,
    output: GetContainerServiceDeploymentsResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns information about a specific block storage disk.
 */
export const getDisk = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDiskRequest,
  output: GetDiskResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about one or more of your Amazon Lightsail content delivery network
 * (CDN) distributions.
 */
export const getDistributions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDistributionsRequest,
  output: GetDistributionsResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns temporary SSH keys you can use to connect to a specific virtual private server, or
 * *instance*.
 *
 * The `get instance access details` operation supports tag-based access control
 * via resource tags applied to the resource identified by `instance name`. For more
 * information, see the Amazon Lightsail Developer Guide.
 */
export const getInstanceAccessDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInstanceAccessDetailsRequest,
    output: GetInstanceAccessDetailsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns information about the specified Lightsail load balancer.
 */
export const getLoadBalancer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoadBalancerRequest,
  output: GetLoadBalancerResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns a list of all valid regions for Amazon Lightsail. Use the include
 * availability zones parameter to also return the Availability Zones in a
 * region.
 */
export const getRegions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegionsRequest,
  output: GetRegionsResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific database in Amazon Lightsail.
 */
export const getRelationalDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRelationalDatabaseRequest,
    output: GetRelationalDatabaseResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns detailed information for five of the most recent `SetupInstanceHttps`
 * requests that were ran on the target instance.
 */
export const getSetupHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSetupHistoryRequest,
  output: GetSetupHistoryResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Updates an existing Amazon Lightsail bucket.
 *
 * Use this action to update the configuration of an existing bucket, such as versioning,
 * public accessibility, and the Amazon Web Services accounts that can access the bucket.
 */
export const updateBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBucketRequest,
  output: UpdateBucketResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Creates a deployment for your Amazon Lightsail container service.
 *
 * A deployment specifies the containers that will be launched on the container service and
 * their settings, such as the ports to open, the environment variables to apply, and the launch
 * command to run. It also specifies the container that will serve as the public endpoint of the
 * deployment and its settings, such as the HTTP or HTTPS port to use, and the health check
 * configuration.
 *
 * You can deploy containers to your container service using container images from a public
 * registry such as Amazon ECR Public, or from your local machine. For more information, see
 * Creating container images for your Amazon Lightsail container services in the
 * *Amazon Lightsail Developer Guide*.
 */
export const createContainerServiceDeployment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateContainerServiceDeploymentRequest,
    output: CreateContainerServiceDeploymentResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Returns information about one or more of your Amazon Lightsail container services.
 */
export const getContainerServices = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetContainerServicesRequest,
    output: ContainerServicesListResult,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      NotFoundException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);
/**
 * Returns information about a specific domain recordset.
 */
export const getDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainRequest,
  output: GetDomainResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about a specific Amazon Lightsail instance, which is a virtual private
 * server.
 */
export const getInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceRequest,
  output: GetInstanceResult,
  errors: [
    AccessDeniedException,
    AccountSetupInProgressException,
    InvalidInputException,
    NotFoundException,
    OperationFailureException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns information about the TLS certificates that are associated with the specified
 * Lightsail load balancer.
 *
 * TLS is just an updated, more secure version of Secure Socket Layer (SSL).
 *
 * You can have a maximum of 2 certificates associated with a Lightsail load balancer. One
 * is active and the other is inactive.
 */
export const getLoadBalancerTlsCertificates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetLoadBalancerTlsCertificatesRequest,
    output: GetLoadBalancerTlsCertificatesResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }));
/**
 * Creates an SSL/TLS certificate for an Amazon Lightsail content delivery network (CDN)
 * distribution and a container service.
 *
 * After the certificate is valid, use the `AttachCertificateToDistribution`
 * action to use the certificate and its domains with your distribution. Or use the
 * `UpdateContainerService` action to use the certificate and its domains with your
 * container service.
 *
 * Only certificates created in the `us-east-1`
 * Amazon Web Services Region can be attached to Lightsail distributions. Lightsail
 * distributions are global resources that can reference an origin in any Amazon Web Services
 * Region, and distribute its content globally. However, all distributions are located in the
 * `us-east-1` Region.
 */
export const createCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCertificateRequest,
  output: CreateCertificateResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Retrieves information about the cost estimate for a specified resource. A cost estimate
 * will not generate for a resource that has been deleted.
 */
export const getCostEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCostEstimateRequest,
  output: GetCostEstimateResult,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    NotFoundException,
    RegionSetupInProgressException,
    ServiceException,
    UnauthenticatedException,
  ],
}));
/**
 * Returns all export snapshot records created as a result of the export
 * snapshot operation.
 *
 * An export snapshot record can be used to create a new Amazon EC2 instance and its related
 * resources with the CreateCloudFormationStack
 * action.
 */
export const getExportSnapshotRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetExportSnapshotRecordsRequest,
    output: GetExportSnapshotRecordsResult,
    errors: [
      AccessDeniedException,
      AccountSetupInProgressException,
      InvalidInputException,
      NotFoundException,
      OperationFailureException,
      RegionSetupInProgressException,
      ServiceException,
      UnauthenticatedException,
    ],
  }),
);

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CloudHSM V2",
  serviceShapeName: "BaldrApiService",
});
const auth = T.AwsAuthSigv4({ name: "cloudhsm" });
const ver = T.ServiceVersion("2017-04-28");
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
                        url: "https://cloudhsmv2-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cloudhsmv2-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cloudhsmv2.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://cloudhsmv2.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws-us-gov",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://cloudhsmv2.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://cloudhsmv2.{Region}.{PartitionResult#dnsSuffix}",
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
export const SubnetIds = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CreateHsmRequest extends S.Class<CreateHsmRequest>(
  "CreateHsmRequest",
)(
  {
    ClusterId: S.String,
    AvailabilityZone: S.String,
    IpAddress: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBackupRequest extends S.Class<DeleteBackupRequest>(
  "DeleteBackupRequest",
)(
  { BackupId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterRequest extends S.Class<DeleteClusterRequest>(
  "DeleteClusterRequest",
)(
  { ClusterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHsmRequest extends S.Class<DeleteHsmRequest>(
  "DeleteHsmRequest",
)(
  {
    ClusterId: S.String,
    HsmId: S.optional(S.String),
    EniId: S.optional(S.String),
    EniIp: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { ResourceArn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Strings = S.Array(S.String);
export const Filters = S.Record({ key: S.String, value: Strings });
export class DescribeClustersRequest extends S.Class<DescribeClustersRequest>(
  "DescribeClustersRequest",
)(
  {
    Filters: S.optional(Filters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { ResourceArn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InitializeClusterRequest extends S.Class<InitializeClusterRequest>(
  "InitializeClusterRequest",
)(
  { ClusterId: S.String, SignedCert: S.String, TrustAnchor: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsRequest extends S.Class<ListTagsRequest>(
  "ListTagsRequest",
)(
  {
    ResourceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyBackupAttributesRequest extends S.Class<ModifyBackupAttributesRequest>(
  "ModifyBackupAttributesRequest",
)(
  { BackupId: S.String, NeverExpires: S.Boolean },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BackupRetentionPolicy extends S.Class<BackupRetentionPolicy>(
  "BackupRetentionPolicy",
)({ Type: S.optional(S.String), Value: S.optional(S.String) }) {}
export class ModifyClusterRequest extends S.Class<ModifyClusterRequest>(
  "ModifyClusterRequest",
)(
  {
    HsmType: S.optional(S.String),
    BackupRetentionPolicy: S.optional(BackupRetentionPolicy),
    ClusterId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { ResourceArn: S.optional(S.String), Policy: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreBackupRequest extends S.Class<RestoreBackupRequest>(
  "RestoreBackupRequest",
)(
  { BackupId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceId: S.String, TagList: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceId: S.String, TagKeyList: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class Hsm extends S.Class<Hsm>("Hsm")({
  AvailabilityZone: S.optional(S.String),
  ClusterId: S.optional(S.String),
  SubnetId: S.optional(S.String),
  EniId: S.optional(S.String),
  EniIp: S.optional(S.String),
  EniIpV6: S.optional(S.String),
  HsmId: S.String,
  HsmType: S.optional(S.String),
  State: S.optional(S.String),
  StateMessage: S.optional(S.String),
}) {}
export const Hsms = S.Array(Hsm);
export const ExternalSubnetMapping = S.Record({
  key: S.String,
  value: S.String,
});
export class Certificates extends S.Class<Certificates>("Certificates")({
  ClusterCsr: S.optional(S.String),
  HsmCertificate: S.optional(S.String),
  AwsHardwareCertificate: S.optional(S.String),
  ManufacturerHardwareCertificate: S.optional(S.String),
  ClusterCertificate: S.optional(S.String),
}) {}
export class Cluster extends S.Class<Cluster>("Cluster")({
  BackupPolicy: S.optional(S.String),
  BackupRetentionPolicy: S.optional(BackupRetentionPolicy),
  ClusterId: S.optional(S.String),
  CreateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Hsms: S.optional(Hsms),
  HsmType: S.optional(S.String),
  HsmTypeRollbackExpiration: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  PreCoPassword: S.optional(S.String),
  SecurityGroup: S.optional(S.String),
  SourceBackupId: S.optional(S.String),
  State: S.optional(S.String),
  StateMessage: S.optional(S.String),
  SubnetMapping: S.optional(ExternalSubnetMapping),
  VpcId: S.optional(S.String),
  NetworkType: S.optional(S.String),
  Certificates: S.optional(Certificates),
  TagList: S.optional(TagList),
  Mode: S.optional(S.String),
}) {}
export const Clusters = S.Array(Cluster);
export class CopyBackupToRegionRequest extends S.Class<CopyBackupToRegionRequest>(
  "CopyBackupToRegionRequest",
)(
  {
    DestinationRegion: S.String,
    BackupId: S.String,
    TagList: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClusterRequest extends S.Class<CreateClusterRequest>(
  "CreateClusterRequest",
)(
  {
    BackupRetentionPolicy: S.optional(BackupRetentionPolicy),
    HsmType: S.String,
    SourceBackupId: S.optional(S.String),
    SubnetIds: SubnetIds,
    NetworkType: S.optional(S.String),
    TagList: S.optional(TagList),
    Mode: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHsmResponse extends S.Class<DeleteHsmResponse>(
  "DeleteHsmResponse",
)({ HsmId: S.optional(S.String) }) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({ ResourceArn: S.optional(S.String), Policy: S.optional(S.String) }) {}
export class DescribeBackupsRequest extends S.Class<DescribeBackupsRequest>(
  "DescribeBackupsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
    Shared: S.optional(S.Boolean),
    SortAscending: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClustersResponse extends S.Class<DescribeClustersResponse>(
  "DescribeClustersResponse",
)({ Clusters: S.optional(Clusters), NextToken: S.optional(S.String) }) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ Policy: S.optional(S.String) }) {}
export class InitializeClusterResponse extends S.Class<InitializeClusterResponse>(
  "InitializeClusterResponse",
)({ State: S.optional(S.String), StateMessage: S.optional(S.String) }) {}
export class ListTagsResponse extends S.Class<ListTagsResponse>(
  "ListTagsResponse",
)({ TagList: TagList, NextToken: S.optional(S.String) }) {}
export class Backup extends S.Class<Backup>("Backup")({
  BackupId: S.String,
  BackupArn: S.optional(S.String),
  BackupState: S.optional(S.String),
  ClusterId: S.optional(S.String),
  CreateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CopyTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NeverExpires: S.optional(S.Boolean),
  SourceRegion: S.optional(S.String),
  SourceBackup: S.optional(S.String),
  SourceCluster: S.optional(S.String),
  DeleteTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TagList: S.optional(TagList),
  HsmType: S.optional(S.String),
  Mode: S.optional(S.String),
}) {}
export class ModifyBackupAttributesResponse extends S.Class<ModifyBackupAttributesResponse>(
  "ModifyBackupAttributesResponse",
)({ Backup: S.optional(Backup) }) {}
export class ModifyClusterResponse extends S.Class<ModifyClusterResponse>(
  "ModifyClusterResponse",
)({ Cluster: S.optional(Cluster) }) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({ ResourceArn: S.optional(S.String), Policy: S.optional(S.String) }) {}
export class RestoreBackupResponse extends S.Class<RestoreBackupResponse>(
  "RestoreBackupResponse",
)({ Backup: S.optional(Backup) }) {}
export const Backups = S.Array(Backup);
export class CreateClusterResponse extends S.Class<CreateClusterResponse>(
  "CreateClusterResponse",
)({ Cluster: S.optional(Cluster) }) {}
export class CreateHsmResponse extends S.Class<CreateHsmResponse>(
  "CreateHsmResponse",
)({ Hsm: S.optional(Hsm) }) {}
export class DeleteBackupResponse extends S.Class<DeleteBackupResponse>(
  "DeleteBackupResponse",
)({ Backup: S.optional(Backup) }) {}
export class DescribeBackupsResponse extends S.Class<DescribeBackupsResponse>(
  "DescribeBackupsResponse",
)({ Backups: S.optional(Backups), NextToken: S.optional(S.String) }) {}
export class DestinationBackup extends S.Class<DestinationBackup>(
  "DestinationBackup",
)({
  CreateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceRegion: S.optional(S.String),
  SourceBackup: S.optional(S.String),
  SourceCluster: S.optional(S.String),
}) {}
export class CopyBackupToRegionResponse extends S.Class<CopyBackupToRegionResponse>(
  "CopyBackupToRegionResponse",
)({ DestinationBackup: S.optional(DestinationBackup) }) {}
export class DeleteClusterResponse extends S.Class<DeleteClusterResponse>(
  "DeleteClusterResponse",
)({ Cluster: S.optional(Cluster) }) {}

//# Errors
export class CloudHsmAccessDeniedException extends S.TaggedError<CloudHsmAccessDeniedException>()(
  "CloudHsmAccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class CloudHsmInternalFailureException extends S.TaggedError<CloudHsmInternalFailureException>()(
  "CloudHsmInternalFailureException",
  { Message: S.optional(S.String) },
) {}
export class CloudHsmInvalidRequestException extends S.TaggedError<CloudHsmInvalidRequestException>()(
  "CloudHsmInvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class CloudHsmResourceLimitExceededException extends S.TaggedError<CloudHsmResourceLimitExceededException>()(
  "CloudHsmResourceLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class CloudHsmResourceNotFoundException extends S.TaggedError<CloudHsmResourceNotFoundException>()(
  "CloudHsmResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class CloudHsmServiceException extends S.TaggedError<CloudHsmServiceException>()(
  "CloudHsmServiceException",
  { Message: S.optional(S.String) },
) {}
export class CloudHsmTagException extends S.TaggedError<CloudHsmTagException>()(
  "CloudHsmTagException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes the specified HSM. To specify an HSM, you can use its identifier (ID), the IP
 * address of the HSM's elastic network interface (ENI), or the ID of the HSM's ENI. You need to
 * specify only one of these values. To find these values, use DescribeClusters.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM hsm in a different Amazon Web Services account.
 */
export const deleteHsm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHsmRequest,
  output: DeleteHsmResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
  ],
}));
/**
 * Deletes an CloudHSM resource policy. Deleting a resource policy will result in the resource being unshared and removed from
 * any RAM resource shares. Deleting the resource policy attached to a backup will not impact any clusters created from that
 * backup.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM resource in a different Amazon Web Services account.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      CloudHsmAccessDeniedException,
      CloudHsmInternalFailureException,
      CloudHsmInvalidRequestException,
      CloudHsmResourceNotFoundException,
      CloudHsmServiceException,
    ],
  }),
);
/**
 * Retrieves the resource policy document attached to a given resource.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM resource in a different Amazon Web Services account.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
  ],
}));
/**
 * Claims an CloudHSM cluster by submitting the cluster certificate issued by your
 * issuing certificate authority (CA) and the CA's root certificate. Before you can claim a
 * cluster, you must sign the cluster's certificate signing request (CSR) with your issuing CA.
 * To get the cluster's CSR, use DescribeClusters.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM cluster in a different Amazon Web Services account.
 */
export const initializeCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitializeClusterRequest,
  output: InitializeClusterResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
  ],
}));
/**
 * Modifies attributes for CloudHSM backup.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM backup in a different Amazon Web Services account.
 */
export const modifyBackupAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyBackupAttributesRequest,
    output: ModifyBackupAttributesResponse,
    errors: [
      CloudHsmAccessDeniedException,
      CloudHsmInternalFailureException,
      CloudHsmInvalidRequestException,
      CloudHsmResourceNotFoundException,
      CloudHsmServiceException,
    ],
  }),
);
/**
 * Modifies CloudHSM cluster.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM cluster in a different Amazon Web Services account.
 */
export const modifyCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterRequest,
  output: ModifyClusterResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
  ],
}));
/**
 * Creates or updates an CloudHSM resource policy. A resource policy helps you to define the IAM entity
 * (for example, an Amazon Web Services account) that can manage your CloudHSM resources. The following resources support
 * CloudHSM resource policies:
 *
 * - Backup - The resource policy allows you to describe the backup and restore a cluster from the backup in another Amazon Web Services account.
 *
 * In order to share a backup, it must be in a 'READY' state and you must own it.
 *
 * While you can share a backup using the CloudHSM PutResourcePolicy operation, we recommend using Resource Access Manager
 * (RAM) instead. Using RAM provides multiple benefits as it creates the policy for you, allows multiple resources to be shared at
 * one time, and increases the discoverability of shared resources. If you use PutResourcePolicy and want consumers to be able to
 * describe the backups you share with them, you must promote the backup to a standard RAM
 * Resource Share using the RAM PromoteResourceShareCreatedFromPolicy API operation.
 *
 * For more information, see Working with shared backups in the CloudHSM User Guide
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM resource in a different Amazon Web Services account.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
  ],
}));
/**
 * Restores a specified CloudHSM backup that is in the
 * `PENDING_DELETION` state. For more information on deleting a backup, see
 * DeleteBackup.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM backup in a different Amazon Web Services account.
 */
export const restoreBackup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreBackupRequest,
  output: RestoreBackupResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
  ],
}));
/**
 * Creates a new hardware security module (HSM) in the specified CloudHSM
 * cluster.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM cluster in a different Amazon Web Service account.
 */
export const createHsm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHsmRequest,
  output: CreateHsmResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
  ],
}));
/**
 * Deletes a specified CloudHSM backup. A backup can be restored up to 7 days
 * after the DeleteBackup request is made. For more information on restoring a backup, see
 * RestoreBackup.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM backup in a different Amazon Web Services account.
 */
export const deleteBackup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackupRequest,
  output: DeleteBackupResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
  ],
}));
/**
 * Gets information about CloudHSM clusters.
 *
 * This is a paginated operation, which means that each response might contain only a
 * subset of all the clusters. When the response contains only a subset of clusters, it includes
 * a `NextToken` value. Use this value in a subsequent `DescribeClusters`
 * request to get more clusters. When you receive a response with no `NextToken` (or
 * an empty or null value), that means there are no more clusters to get.
 *
 * **Cross-account use:** No. You cannot perform this operation on CloudHSM clusters in a different Amazon Web Services account.
 */
export const describeClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClustersRequest,
  output: DescribeClustersResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmServiceException,
    CloudHsmTagException,
  ],
}));
/**
 * Gets a list of tags for the specified CloudHSM cluster.
 *
 * This is a paginated operation, which means that each response might contain only a
 * subset of all the tags. When the response contains only a subset of tags, it includes a
 * `NextToken` value. Use this value in a subsequent `ListTags` request to
 * get more tags. When you receive a response with no `NextToken` (or an empty or null
 * value), that means there are no more tags to get.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM resource in a different Amazon Web Services account.
 */
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
    CloudHsmTagException,
  ],
}));
/**
 * Creates a new CloudHSM cluster.
 *
 * **Cross-account use:** Yes. To perform this operation with an CloudHSM backup in a different AWS account, specify the full backup
 * ARN in the value of the SourceBackupId parameter.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
    CloudHsmTagException,
  ],
}));
/**
 * Gets information about backups of CloudHSM clusters. Lists either the backups you own or the backups shared with you when the Shared parameter is true.
 *
 * This is a paginated operation, which means that each response might contain only a
 * subset of all the backups. When the response contains only a subset of backups, it includes a
 * `NextToken` value. Use this value in a subsequent `DescribeBackups`
 * request to get more backups. When you receive a response with no `NextToken` (or an
 * empty or null value), that means there are no more backups to get.
 *
 * **Cross-account use:** Yes. Customers can describe backups in other Amazon Web Services accounts that are shared with them.
 */
export const describeBackups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBackupsRequest,
  output: DescribeBackupsResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
    CloudHsmTagException,
  ],
}));
/**
 * Copy an CloudHSM cluster backup to a different region.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM backup in a different Amazon Web Services account.
 */
export const copyBackupToRegion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyBackupToRegionRequest,
  output: CopyBackupToRegionResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
    CloudHsmTagException,
  ],
}));
/**
 * Deletes the specified CloudHSM cluster. Before you can delete a cluster, you must
 * delete all HSMs in the cluster. To see if the cluster contains any HSMs, use DescribeClusters. To delete an HSM, use DeleteHsm.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM cluster in a different Amazon Web Services account.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
    CloudHsmTagException,
  ],
}));
/**
 * Adds or overwrites one or more tags for the specified CloudHSM cluster.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM resource in a different Amazon Web Services account.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceLimitExceededException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
    CloudHsmTagException,
  ],
}));
/**
 * Removes the specified tag or tags from the specified CloudHSM cluster.
 *
 * **Cross-account use:** No. You cannot perform this operation on an CloudHSM resource in a different Amazon Web Services account.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    CloudHsmAccessDeniedException,
    CloudHsmInternalFailureException,
    CloudHsmInvalidRequestException,
    CloudHsmResourceNotFoundException,
    CloudHsmServiceException,
    CloudHsmTagException,
  ],
}));

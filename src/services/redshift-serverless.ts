import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Redshift Serverless",
  serviceShapeName: "RedshiftServerless",
});
const auth = T.AwsAuthSigv4({ name: "redshift-serverless" });
const ver = T.ServiceVersion("2021-04-21");
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
                        url: "https://redshift-serverless-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://redshift-serverless-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://redshift-serverless.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://redshift-serverless.{Region}.{PartitionResult#dnsSuffix}",
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
export const WorkgroupNameList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const SubnetIdList = S.Array(S.String);
export const VpcSecurityGroupIdList = S.Array(S.String);
export const IamRoleArnList = S.Array(S.String);
export const LogExportList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export class CreateCustomDomainAssociationRequest extends S.Class<CreateCustomDomainAssociationRequest>(
  "CreateCustomDomainAssociationRequest",
)(
  {
    workgroupName: S.String,
    customDomainName: S.String,
    customDomainCertificateArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCustomDomainAssociationRequest extends S.Class<DeleteCustomDomainAssociationRequest>(
  "DeleteCustomDomainAssociationRequest",
)(
  { workgroupName: S.String, customDomainName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCustomDomainAssociationResponse extends S.Class<DeleteCustomDomainAssociationResponse>(
  "DeleteCustomDomainAssociationResponse",
)({}) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export class GetCredentialsRequest extends S.Class<GetCredentialsRequest>(
  "GetCredentialsRequest",
)(
  {
    dbName: S.optional(S.String),
    durationSeconds: S.optional(S.Number),
    workgroupName: S.optional(S.String),
    customDomainName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCustomDomainAssociationRequest extends S.Class<GetCustomDomainAssociationRequest>(
  "GetCustomDomainAssociationRequest",
)(
  { customDomainName: S.String, workgroupName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentityCenterAuthTokenRequest extends S.Class<GetIdentityCenterAuthTokenRequest>(
  "GetIdentityCenterAuthTokenRequest",
)(
  { workgroupNames: WorkgroupNameList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTrackRequest extends S.Class<GetTrackRequest>(
  "GetTrackRequest",
)(
  { trackName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCustomDomainAssociationsRequest extends S.Class<ListCustomDomainAssociationsRequest>(
  "ListCustomDomainAssociationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    customDomainName: S.optional(S.String),
    customDomainCertificateArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTracksRequest extends S.Class<ListTracksRequest>(
  "ListTracksRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { resourceArn: S.String, policy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateCustomDomainAssociationRequest extends S.Class<UpdateCustomDomainAssociationRequest>(
  "UpdateCustomDomainAssociationRequest",
)(
  {
    workgroupName: S.String,
    customDomainName: S.String,
    customDomainCertificateArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEndpointAccessRequest extends S.Class<CreateEndpointAccessRequest>(
  "CreateEndpointAccessRequest",
)(
  {
    endpointName: S.String,
    subnetIds: SubnetIdList,
    workgroupName: S.String,
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    ownerAccount: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEndpointAccessRequest extends S.Class<DeleteEndpointAccessRequest>(
  "DeleteEndpointAccessRequest",
)(
  { endpointName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEndpointAccessRequest extends S.Class<GetEndpointAccessRequest>(
  "GetEndpointAccessRequest",
)(
  { endpointName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEndpointAccessRequest extends S.Class<ListEndpointAccessRequest>(
  "ListEndpointAccessRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    workgroupName: S.optional(S.String),
    vpcId: S.optional(S.String),
    ownerAccount: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEndpointAccessRequest extends S.Class<UpdateEndpointAccessRequest>(
  "UpdateEndpointAccessRequest",
)(
  {
    endpointName: S.String,
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListManagedWorkgroupsRequest extends S.Class<ListManagedWorkgroupsRequest>(
  "ListManagedWorkgroupsRequest",
)(
  {
    sourceArn: S.optional(S.String),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateNamespaceRequest extends S.Class<CreateNamespaceRequest>(
  "CreateNamespaceRequest",
)(
  {
    namespaceName: S.String,
    adminUsername: S.optional(S.String),
    adminUserPassword: S.optional(S.String),
    dbName: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    defaultIamRoleArn: S.optional(S.String),
    iamRoles: S.optional(IamRoleArnList),
    logExports: S.optional(LogExportList),
    tags: S.optional(TagList),
    manageAdminPassword: S.optional(S.Boolean),
    adminPasswordSecretKmsKeyId: S.optional(S.String),
    redshiftIdcApplicationArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetNamespaceRequest extends S.Class<GetNamespaceRequest>(
  "GetNamespaceRequest",
)(
  { namespaceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNamespaceRequest extends S.Class<UpdateNamespaceRequest>(
  "UpdateNamespaceRequest",
)(
  {
    namespaceName: S.String,
    adminUserPassword: S.optional(S.String),
    adminUsername: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    defaultIamRoleArn: S.optional(S.String),
    iamRoles: S.optional(IamRoleArnList),
    logExports: S.optional(LogExportList),
    manageAdminPassword: S.optional(S.Boolean),
    adminPasswordSecretKmsKeyId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNamespaceRequest extends S.Class<DeleteNamespaceRequest>(
  "DeleteNamespaceRequest",
)(
  {
    namespaceName: S.String,
    finalSnapshotName: S.optional(S.String),
    finalSnapshotRetentionPeriod: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListNamespacesRequest extends S.Class<ListNamespacesRequest>(
  "ListNamespacesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLakehouseConfigurationRequest extends S.Class<UpdateLakehouseConfigurationRequest>(
  "UpdateLakehouseConfigurationRequest",
)(
  {
    namespaceName: S.String,
    lakehouseRegistration: S.optional(S.String),
    catalogName: S.optional(S.String),
    lakehouseIdcRegistration: S.optional(S.String),
    lakehouseIdcApplicationArn: S.optional(S.String),
    dryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConvertRecoveryPointToSnapshotRequest extends S.Class<ConvertRecoveryPointToSnapshotRequest>(
  "ConvertRecoveryPointToSnapshotRequest",
)(
  {
    recoveryPointId: S.String,
    snapshotName: S.String,
    retentionPeriod: S.optional(S.Number),
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRecoveryPointRequest extends S.Class<GetRecoveryPointRequest>(
  "GetRecoveryPointRequest",
)(
  { recoveryPointId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRecoveryPointsRequest extends S.Class<ListRecoveryPointsRequest>(
  "ListRecoveryPointsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    namespaceName: S.optional(S.String),
    namespaceArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreFromRecoveryPointRequest extends S.Class<RestoreFromRecoveryPointRequest>(
  "RestoreFromRecoveryPointRequest",
)(
  {
    recoveryPointId: S.String,
    namespaceName: S.String,
    workgroupName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreTableFromRecoveryPointRequest extends S.Class<RestoreTableFromRecoveryPointRequest>(
  "RestoreTableFromRecoveryPointRequest",
)(
  {
    namespaceName: S.String,
    workgroupName: S.String,
    recoveryPointId: S.String,
    sourceDatabaseName: S.String,
    sourceSchemaName: S.optional(S.String),
    sourceTableName: S.String,
    targetDatabaseName: S.optional(S.String),
    targetSchemaName: S.optional(S.String),
    newTableName: S.String,
    activateCaseSensitiveIdentifier: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReservationRequest extends S.Class<CreateReservationRequest>(
  "CreateReservationRequest",
)(
  {
    capacity: S.Number,
    offeringId: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetReservationRequest extends S.Class<GetReservationRequest>(
  "GetReservationRequest",
)(
  { reservationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetReservationOfferingRequest extends S.Class<GetReservationOfferingRequest>(
  "GetReservationOfferingRequest",
)(
  { offeringId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReservationOfferingsRequest extends S.Class<ListReservationOfferingsRequest>(
  "ListReservationOfferingsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReservationsRequest extends S.Class<ListReservationsRequest>(
  "ListReservationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScheduledActionRequest extends S.Class<DeleteScheduledActionRequest>(
  "DeleteScheduledActionRequest",
)(
  { scheduledActionName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetScheduledActionRequest extends S.Class<GetScheduledActionRequest>(
  "GetScheduledActionRequest",
)(
  { scheduledActionName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListScheduledActionsRequest extends S.Class<ListScheduledActionsRequest>(
  "ListScheduledActionsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    namespaceName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSnapshotScheduleActionParameters extends S.Class<CreateSnapshotScheduleActionParameters>(
  "CreateSnapshotScheduleActionParameters",
)({
  namespaceName: S.String,
  snapshotNamePrefix: S.String,
  retentionPeriod: S.optional(S.Number),
  tags: S.optional(TagList),
}) {}
export const TargetAction = S.Union(
  S.Struct({ createSnapshot: CreateSnapshotScheduleActionParameters }),
);
export const Schedule = S.Union(
  S.Struct({ at: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ cron: S.String }),
);
export class UpdateScheduledActionRequest extends S.Class<UpdateScheduledActionRequest>(
  "UpdateScheduledActionRequest",
)(
  {
    scheduledActionName: S.String,
    targetAction: S.optional(TargetAction),
    schedule: S.optional(Schedule),
    roleArn: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    scheduledActionDescription: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSnapshotRequest extends S.Class<CreateSnapshotRequest>(
  "CreateSnapshotRequest",
)(
  {
    namespaceName: S.String,
    snapshotName: S.String,
    retentionPeriod: S.optional(S.Number),
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSnapshotCopyConfigurationRequest extends S.Class<CreateSnapshotCopyConfigurationRequest>(
  "CreateSnapshotCopyConfigurationRequest",
)(
  {
    namespaceName: S.String,
    destinationRegion: S.String,
    snapshotRetentionPeriod: S.optional(S.Number),
    destinationKmsKeyId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSnapshotRequest extends S.Class<DeleteSnapshotRequest>(
  "DeleteSnapshotRequest",
)(
  { snapshotName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSnapshotCopyConfigurationRequest extends S.Class<DeleteSnapshotCopyConfigurationRequest>(
  "DeleteSnapshotCopyConfigurationRequest",
)(
  { snapshotCopyConfigurationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSnapshotRequest extends S.Class<GetSnapshotRequest>(
  "GetSnapshotRequest",
)(
  {
    snapshotName: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    snapshotArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTableRestoreStatusRequest extends S.Class<GetTableRestoreStatusRequest>(
  "GetTableRestoreStatusRequest",
)(
  { tableRestoreRequestId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSnapshotCopyConfigurationsRequest extends S.Class<ListSnapshotCopyConfigurationsRequest>(
  "ListSnapshotCopyConfigurationsRequest",
)(
  {
    namespaceName: S.optional(S.String),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSnapshotsRequest extends S.Class<ListSnapshotsRequest>(
  "ListSnapshotsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    namespaceName: S.optional(S.String),
    namespaceArn: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTableRestoreStatusRequest extends S.Class<ListTableRestoreStatusRequest>(
  "ListTableRestoreStatusRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    namespaceName: S.optional(S.String),
    workgroupName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreFromSnapshotRequest extends S.Class<RestoreFromSnapshotRequest>(
  "RestoreFromSnapshotRequest",
)(
  {
    namespaceName: S.String,
    workgroupName: S.String,
    snapshotName: S.optional(S.String),
    snapshotArn: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    manageAdminPassword: S.optional(S.Boolean),
    adminPasswordSecretKmsKeyId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreTableFromSnapshotRequest extends S.Class<RestoreTableFromSnapshotRequest>(
  "RestoreTableFromSnapshotRequest",
)(
  {
    namespaceName: S.String,
    workgroupName: S.String,
    snapshotName: S.String,
    sourceDatabaseName: S.String,
    sourceSchemaName: S.optional(S.String),
    sourceTableName: S.String,
    targetDatabaseName: S.optional(S.String),
    targetSchemaName: S.optional(S.String),
    newTableName: S.String,
    activateCaseSensitiveIdentifier: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSnapshotRequest extends S.Class<UpdateSnapshotRequest>(
  "UpdateSnapshotRequest",
)(
  { snapshotName: S.String, retentionPeriod: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSnapshotCopyConfigurationRequest extends S.Class<UpdateSnapshotCopyConfigurationRequest>(
  "UpdateSnapshotCopyConfigurationRequest",
)(
  {
    snapshotCopyConfigurationId: S.String,
    snapshotRetentionPeriod: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUsageLimitRequest extends S.Class<CreateUsageLimitRequest>(
  "CreateUsageLimitRequest",
)(
  {
    resourceArn: S.String,
    usageType: S.String,
    amount: S.Number,
    period: S.optional(S.String),
    breachAction: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUsageLimitRequest extends S.Class<DeleteUsageLimitRequest>(
  "DeleteUsageLimitRequest",
)(
  { usageLimitId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUsageLimitRequest extends S.Class<GetUsageLimitRequest>(
  "GetUsageLimitRequest",
)(
  { usageLimitId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUsageLimitsRequest extends S.Class<ListUsageLimitsRequest>(
  "ListUsageLimitsRequest",
)(
  {
    resourceArn: S.optional(S.String),
    usageType: S.optional(S.String),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateUsageLimitRequest extends S.Class<UpdateUsageLimitRequest>(
  "UpdateUsageLimitRequest",
)(
  {
    usageLimitId: S.String,
    amount: S.optional(S.Number),
    breachAction: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWorkgroupRequest extends S.Class<GetWorkgroupRequest>(
  "GetWorkgroupRequest",
)(
  { workgroupName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConfigParameter extends S.Class<ConfigParameter>(
  "ConfigParameter",
)({
  parameterKey: S.optional(S.String),
  parameterValue: S.optional(S.String),
}) {}
export const ConfigParameterList = S.Array(ConfigParameter);
export class PerformanceTarget extends S.Class<PerformanceTarget>(
  "PerformanceTarget",
)({ status: S.optional(S.String), level: S.optional(S.Number) }) {}
export class UpdateWorkgroupRequest extends S.Class<UpdateWorkgroupRequest>(
  "UpdateWorkgroupRequest",
)(
  {
    workgroupName: S.String,
    baseCapacity: S.optional(S.Number),
    enhancedVpcRouting: S.optional(S.Boolean),
    configParameters: S.optional(ConfigParameterList),
    publiclyAccessible: S.optional(S.Boolean),
    subnetIds: S.optional(SubnetIdList),
    securityGroupIds: S.optional(SecurityGroupIdList),
    port: S.optional(S.Number),
    maxCapacity: S.optional(S.Number),
    ipAddressType: S.optional(S.String),
    pricePerformanceTarget: S.optional(PerformanceTarget),
    trackName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWorkgroupRequest extends S.Class<DeleteWorkgroupRequest>(
  "DeleteWorkgroupRequest",
)(
  { workgroupName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWorkgroupsRequest extends S.Class<ListWorkgroupsRequest>(
  "ListWorkgroupsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ownerAccount: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTarget extends S.Class<UpdateTarget>("UpdateTarget")({
  trackName: S.optional(S.String),
  workgroupVersion: S.optional(S.String),
}) {}
export const UpdateTargetsList = S.Array(UpdateTarget);
export class ServerlessTrack extends S.Class<ServerlessTrack>(
  "ServerlessTrack",
)({
  trackName: S.optional(S.String),
  workgroupVersion: S.optional(S.String),
  updateTargets: S.optional(UpdateTargetsList),
}) {}
export const TrackList = S.Array(ServerlessTrack);
export class VpcSecurityGroupMembership extends S.Class<VpcSecurityGroupMembership>(
  "VpcSecurityGroupMembership",
)({ vpcSecurityGroupId: S.optional(S.String), status: S.optional(S.String) }) {}
export const VpcSecurityGroupMembershipList = S.Array(
  VpcSecurityGroupMembership,
);
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  networkInterfaceId: S.optional(S.String),
  subnetId: S.optional(S.String),
  privateIpAddress: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  ipv6Address: S.optional(S.String),
}) {}
export const NetworkInterfaceList = S.Array(NetworkInterface);
export class VpcEndpoint extends S.Class<VpcEndpoint>("VpcEndpoint")({
  vpcEndpointId: S.optional(S.String),
  vpcId: S.optional(S.String),
  networkInterfaces: S.optional(NetworkInterfaceList),
}) {}
export class EndpointAccess extends S.Class<EndpointAccess>("EndpointAccess")({
  endpointName: S.optional(S.String),
  endpointStatus: S.optional(S.String),
  workgroupName: S.optional(S.String),
  endpointCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  port: S.optional(S.Number),
  address: S.optional(S.String),
  subnetIds: S.optional(SubnetIdList),
  vpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
  vpcEndpoint: S.optional(VpcEndpoint),
  endpointArn: S.optional(S.String),
}) {}
export const EndpointAccessList = S.Array(EndpointAccess);
export class Namespace extends S.Class<Namespace>("Namespace")({
  namespaceArn: S.optional(S.String),
  namespaceId: S.optional(S.String),
  namespaceName: S.optional(S.String),
  adminUsername: S.optional(S.String),
  dbName: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  defaultIamRoleArn: S.optional(S.String),
  iamRoles: S.optional(IamRoleArnList),
  logExports: S.optional(LogExportList),
  status: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  adminPasswordSecretArn: S.optional(S.String),
  adminPasswordSecretKmsKeyId: S.optional(S.String),
  lakehouseRegistrationStatus: S.optional(S.String),
  catalogArn: S.optional(S.String),
}) {}
export const NamespaceList = S.Array(Namespace);
export class RecoveryPoint extends S.Class<RecoveryPoint>("RecoveryPoint")({
  recoveryPointId: S.optional(S.String),
  recoveryPointCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  totalSizeInMegaBytes: S.optional(S.Number),
  namespaceName: S.optional(S.String),
  workgroupName: S.optional(S.String),
  namespaceArn: S.optional(S.String),
}) {}
export const RecoveryPointList = S.Array(RecoveryPoint);
export class ReservationOffering extends S.Class<ReservationOffering>(
  "ReservationOffering",
)({
  offeringId: S.optional(S.String),
  duration: S.optional(S.Number),
  upfrontCharge: S.optional(S.Number),
  hourlyCharge: S.optional(S.Number),
  currencyCode: S.optional(S.String),
  offeringType: S.optional(S.String),
}) {}
export const ReservationOfferingsList = S.Array(ReservationOffering);
export class Reservation extends S.Class<Reservation>("Reservation")({
  reservationId: S.optional(S.String),
  reservationArn: S.optional(S.String),
  startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  capacity: S.optional(S.Number),
  offering: S.optional(ReservationOffering),
  status: S.optional(S.String),
}) {}
export const ReservationsList = S.Array(Reservation);
export class SnapshotCopyConfiguration extends S.Class<SnapshotCopyConfiguration>(
  "SnapshotCopyConfiguration",
)({
  snapshotCopyConfigurationId: S.optional(S.String),
  snapshotCopyConfigurationArn: S.optional(S.String),
  namespaceName: S.optional(S.String),
  destinationRegion: S.optional(S.String),
  snapshotRetentionPeriod: S.optional(S.Number),
  destinationKmsKeyId: S.optional(S.String),
}) {}
export const SnapshotCopyConfigurations = S.Array(SnapshotCopyConfiguration);
export const AccountIdList = S.Array(S.String);
export class Snapshot extends S.Class<Snapshot>("Snapshot")({
  namespaceName: S.optional(S.String),
  namespaceArn: S.optional(S.String),
  snapshotName: S.optional(S.String),
  snapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  adminUsername: S.optional(S.String),
  status: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  ownerAccount: S.optional(S.String),
  totalBackupSizeInMegaBytes: S.optional(S.Number),
  actualIncrementalBackupSizeInMegaBytes: S.optional(S.Number),
  backupProgressInMegaBytes: S.optional(S.Number),
  currentBackupRateInMegaBytesPerSecond: S.optional(S.Number),
  estimatedSecondsToCompletion: S.optional(S.Number),
  elapsedTimeInSeconds: S.optional(S.Number),
  snapshotRetentionPeriod: S.optional(S.Number),
  snapshotRemainingDays: S.optional(S.Number),
  snapshotRetentionStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  snapshotArn: S.optional(S.String),
  accountsWithRestoreAccess: S.optional(AccountIdList),
  accountsWithProvisionedRestoreAccess: S.optional(AccountIdList),
  adminPasswordSecretArn: S.optional(S.String),
  adminPasswordSecretKmsKeyId: S.optional(S.String),
}) {}
export const SnapshotList = S.Array(Snapshot);
export class TableRestoreStatus extends S.Class<TableRestoreStatus>(
  "TableRestoreStatus",
)({
  tableRestoreRequestId: S.optional(S.String),
  status: S.optional(S.String),
  message: S.optional(S.String),
  requestTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  namespaceName: S.optional(S.String),
  workgroupName: S.optional(S.String),
  snapshotName: S.optional(S.String),
  progressInMegaBytes: S.optional(S.Number),
  totalDataInMegaBytes: S.optional(S.Number),
  sourceDatabaseName: S.optional(S.String),
  sourceSchemaName: S.optional(S.String),
  sourceTableName: S.optional(S.String),
  targetDatabaseName: S.optional(S.String),
  targetSchemaName: S.optional(S.String),
  newTableName: S.optional(S.String),
  recoveryPointId: S.optional(S.String),
}) {}
export const TableRestoreStatusList = S.Array(TableRestoreStatus);
export class UsageLimit extends S.Class<UsageLimit>("UsageLimit")({
  usageLimitId: S.optional(S.String),
  usageLimitArn: S.optional(S.String),
  resourceArn: S.optional(S.String),
  usageType: S.optional(S.String),
  amount: S.optional(S.Number),
  period: S.optional(S.String),
  breachAction: S.optional(S.String),
}) {}
export const UsageLimits = S.Array(UsageLimit);
export const VpcEndpointList = S.Array(VpcEndpoint);
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  address: S.optional(S.String),
  port: S.optional(S.Number),
  vpcEndpoints: S.optional(VpcEndpointList),
}) {}
export const VpcIds = S.Array(S.String);
export class Workgroup extends S.Class<Workgroup>("Workgroup")({
  workgroupId: S.optional(S.String),
  workgroupArn: S.optional(S.String),
  workgroupName: S.optional(S.String),
  namespaceName: S.optional(S.String),
  baseCapacity: S.optional(S.Number),
  enhancedVpcRouting: S.optional(S.Boolean),
  configParameters: S.optional(ConfigParameterList),
  securityGroupIds: S.optional(SecurityGroupIdList),
  subnetIds: S.optional(SubnetIdList),
  status: S.optional(S.String),
  endpoint: S.optional(Endpoint),
  publiclyAccessible: S.optional(S.Boolean),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  port: S.optional(S.Number),
  customDomainName: S.optional(S.String),
  customDomainCertificateArn: S.optional(S.String),
  customDomainCertificateExpiryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  workgroupVersion: S.optional(S.String),
  patchVersion: S.optional(S.String),
  maxCapacity: S.optional(S.Number),
  crossAccountVpcs: S.optional(VpcIds),
  ipAddressType: S.optional(S.String),
  pricePerformanceTarget: S.optional(PerformanceTarget),
  trackName: S.optional(S.String),
  pendingTrackName: S.optional(S.String),
}) {}
export const WorkgroupList = S.Array(Workgroup);
export class CreateCustomDomainAssociationResponse extends S.Class<CreateCustomDomainAssociationResponse>(
  "CreateCustomDomainAssociationResponse",
)({
  customDomainName: S.optional(S.String),
  workgroupName: S.optional(S.String),
  customDomainCertificateArn: S.optional(S.String),
  customDomainCertificateExpiryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class GetCredentialsResponse extends S.Class<GetCredentialsResponse>(
  "GetCredentialsResponse",
)({
  dbUser: S.optional(S.String),
  dbPassword: S.optional(S.String),
  expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  nextRefreshTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetCustomDomainAssociationResponse extends S.Class<GetCustomDomainAssociationResponse>(
  "GetCustomDomainAssociationResponse",
)({
  customDomainName: S.optional(S.String),
  workgroupName: S.optional(S.String),
  customDomainCertificateArn: S.optional(S.String),
  customDomainCertificateExpiryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class GetIdentityCenterAuthTokenResponse extends S.Class<GetIdentityCenterAuthTokenResponse>(
  "GetIdentityCenterAuthTokenResponse",
)({
  token: S.optional(S.String).pipe(T.JsonName("Token")),
  expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("ExpirationTime"),
  ),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class ListTracksResponse extends S.Class<ListTracksResponse>(
  "ListTracksResponse",
)({ tracks: S.optional(TrackList), nextToken: S.optional(S.String) }) {}
export class ResourcePolicy extends S.Class<ResourcePolicy>("ResourcePolicy")({
  resourceArn: S.optional(S.String),
  policy: S.optional(S.String),
}) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({ resourcePolicy: S.optional(ResourcePolicy) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UpdateCustomDomainAssociationResponse extends S.Class<UpdateCustomDomainAssociationResponse>(
  "UpdateCustomDomainAssociationResponse",
)({
  customDomainName: S.optional(S.String),
  workgroupName: S.optional(S.String),
  customDomainCertificateArn: S.optional(S.String),
  customDomainCertificateExpiryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class DeleteEndpointAccessResponse extends S.Class<DeleteEndpointAccessResponse>(
  "DeleteEndpointAccessResponse",
)({ endpoint: S.optional(EndpointAccess) }) {}
export class GetEndpointAccessResponse extends S.Class<GetEndpointAccessResponse>(
  "GetEndpointAccessResponse",
)({ endpoint: S.optional(EndpointAccess) }) {}
export class ListEndpointAccessResponse extends S.Class<ListEndpointAccessResponse>(
  "ListEndpointAccessResponse",
)({ nextToken: S.optional(S.String), endpoints: EndpointAccessList }) {}
export class UpdateEndpointAccessResponse extends S.Class<UpdateEndpointAccessResponse>(
  "UpdateEndpointAccessResponse",
)({ endpoint: S.optional(EndpointAccess) }) {}
export class GetNamespaceResponse extends S.Class<GetNamespaceResponse>(
  "GetNamespaceResponse",
)({ namespace: Namespace }) {}
export class UpdateNamespaceResponse extends S.Class<UpdateNamespaceResponse>(
  "UpdateNamespaceResponse",
)({ namespace: Namespace }) {}
export class DeleteNamespaceResponse extends S.Class<DeleteNamespaceResponse>(
  "DeleteNamespaceResponse",
)({ namespace: Namespace }) {}
export class ListNamespacesResponse extends S.Class<ListNamespacesResponse>(
  "ListNamespacesResponse",
)({ nextToken: S.optional(S.String), namespaces: NamespaceList }) {}
export class UpdateLakehouseConfigurationResponse extends S.Class<UpdateLakehouseConfigurationResponse>(
  "UpdateLakehouseConfigurationResponse",
)({
  namespaceName: S.optional(S.String),
  lakehouseIdcApplicationArn: S.optional(S.String),
  lakehouseRegistrationStatus: S.optional(S.String),
  catalogArn: S.optional(S.String),
}) {}
export class ListRecoveryPointsResponse extends S.Class<ListRecoveryPointsResponse>(
  "ListRecoveryPointsResponse",
)({
  recoveryPoints: S.optional(RecoveryPointList),
  nextToken: S.optional(S.String),
}) {}
export class RestoreFromRecoveryPointResponse extends S.Class<RestoreFromRecoveryPointResponse>(
  "RestoreFromRecoveryPointResponse",
)({
  recoveryPointId: S.optional(S.String),
  namespace: S.optional(Namespace),
}) {}
export class GetReservationResponse extends S.Class<GetReservationResponse>(
  "GetReservationResponse",
)({ reservation: Reservation }) {}
export class ListReservationOfferingsResponse extends S.Class<ListReservationOfferingsResponse>(
  "ListReservationOfferingsResponse",
)({
  reservationOfferingsList: ReservationOfferingsList,
  nextToken: S.optional(S.String),
}) {}
export class ListReservationsResponse extends S.Class<ListReservationsResponse>(
  "ListReservationsResponse",
)({ reservationsList: ReservationsList, nextToken: S.optional(S.String) }) {}
export const NextInvocationsList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export class ScheduledActionResponse extends S.Class<ScheduledActionResponse>(
  "ScheduledActionResponse",
)({
  scheduledActionName: S.optional(S.String),
  schedule: S.optional(Schedule),
  scheduledActionDescription: S.optional(S.String),
  nextInvocations: S.optional(NextInvocationsList),
  roleArn: S.optional(S.String),
  state: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  targetAction: S.optional(TargetAction),
  namespaceName: S.optional(S.String),
  scheduledActionUuid: S.optional(S.String),
}) {}
export class GetScheduledActionResponse extends S.Class<GetScheduledActionResponse>(
  "GetScheduledActionResponse",
)({ scheduledAction: S.optional(ScheduledActionResponse) }) {}
export class UpdateScheduledActionResponse extends S.Class<UpdateScheduledActionResponse>(
  "UpdateScheduledActionResponse",
)({ scheduledAction: S.optional(ScheduledActionResponse) }) {}
export class CreateSnapshotResponse extends S.Class<CreateSnapshotResponse>(
  "CreateSnapshotResponse",
)({ snapshot: S.optional(Snapshot) }) {}
export class DeleteSnapshotResponse extends S.Class<DeleteSnapshotResponse>(
  "DeleteSnapshotResponse",
)({ snapshot: S.optional(Snapshot) }) {}
export class DeleteSnapshotCopyConfigurationResponse extends S.Class<DeleteSnapshotCopyConfigurationResponse>(
  "DeleteSnapshotCopyConfigurationResponse",
)({ snapshotCopyConfiguration: SnapshotCopyConfiguration }) {}
export class GetSnapshotResponse extends S.Class<GetSnapshotResponse>(
  "GetSnapshotResponse",
)({ snapshot: S.optional(Snapshot) }) {}
export class GetTableRestoreStatusResponse extends S.Class<GetTableRestoreStatusResponse>(
  "GetTableRestoreStatusResponse",
)({ tableRestoreStatus: S.optional(TableRestoreStatus) }) {}
export class ListSnapshotCopyConfigurationsResponse extends S.Class<ListSnapshotCopyConfigurationsResponse>(
  "ListSnapshotCopyConfigurationsResponse",
)({
  nextToken: S.optional(S.String),
  snapshotCopyConfigurations: SnapshotCopyConfigurations,
}) {}
export class ListSnapshotsResponse extends S.Class<ListSnapshotsResponse>(
  "ListSnapshotsResponse",
)({ nextToken: S.optional(S.String), snapshots: S.optional(SnapshotList) }) {}
export class ListTableRestoreStatusResponse extends S.Class<ListTableRestoreStatusResponse>(
  "ListTableRestoreStatusResponse",
)({
  nextToken: S.optional(S.String),
  tableRestoreStatuses: S.optional(TableRestoreStatusList),
}) {}
export class RestoreFromSnapshotResponse extends S.Class<RestoreFromSnapshotResponse>(
  "RestoreFromSnapshotResponse",
)({
  snapshotName: S.optional(S.String),
  ownerAccount: S.optional(S.String),
  namespace: S.optional(Namespace),
}) {}
export class RestoreTableFromSnapshotResponse extends S.Class<RestoreTableFromSnapshotResponse>(
  "RestoreTableFromSnapshotResponse",
)({ tableRestoreStatus: S.optional(TableRestoreStatus) }) {}
export class UpdateSnapshotResponse extends S.Class<UpdateSnapshotResponse>(
  "UpdateSnapshotResponse",
)({ snapshot: S.optional(Snapshot) }) {}
export class UpdateSnapshotCopyConfigurationResponse extends S.Class<UpdateSnapshotCopyConfigurationResponse>(
  "UpdateSnapshotCopyConfigurationResponse",
)({ snapshotCopyConfiguration: SnapshotCopyConfiguration }) {}
export class DeleteUsageLimitResponse extends S.Class<DeleteUsageLimitResponse>(
  "DeleteUsageLimitResponse",
)({ usageLimit: S.optional(UsageLimit) }) {}
export class GetUsageLimitResponse extends S.Class<GetUsageLimitResponse>(
  "GetUsageLimitResponse",
)({ usageLimit: S.optional(UsageLimit) }) {}
export class ListUsageLimitsResponse extends S.Class<ListUsageLimitsResponse>(
  "ListUsageLimitsResponse",
)({ usageLimits: S.optional(UsageLimits), nextToken: S.optional(S.String) }) {}
export class UpdateUsageLimitResponse extends S.Class<UpdateUsageLimitResponse>(
  "UpdateUsageLimitResponse",
)({ usageLimit: S.optional(UsageLimit) }) {}
export class CreateWorkgroupRequest extends S.Class<CreateWorkgroupRequest>(
  "CreateWorkgroupRequest",
)(
  {
    workgroupName: S.String,
    namespaceName: S.String,
    baseCapacity: S.optional(S.Number),
    enhancedVpcRouting: S.optional(S.Boolean),
    configParameters: S.optional(ConfigParameterList),
    securityGroupIds: S.optional(SecurityGroupIdList),
    subnetIds: S.optional(SubnetIdList),
    publiclyAccessible: S.optional(S.Boolean),
    tags: S.optional(TagList),
    port: S.optional(S.Number),
    maxCapacity: S.optional(S.Number),
    pricePerformanceTarget: S.optional(PerformanceTarget),
    ipAddressType: S.optional(S.String),
    trackName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateWorkgroupResponse extends S.Class<UpdateWorkgroupResponse>(
  "UpdateWorkgroupResponse",
)({ workgroup: Workgroup }) {}
export class DeleteWorkgroupResponse extends S.Class<DeleteWorkgroupResponse>(
  "DeleteWorkgroupResponse",
)({ workgroup: Workgroup }) {}
export class ListWorkgroupsResponse extends S.Class<ListWorkgroupsResponse>(
  "ListWorkgroupsResponse",
)({ nextToken: S.optional(S.String), workgroups: WorkgroupList }) {}
export class Association extends S.Class<Association>("Association")({
  customDomainCertificateArn: S.optional(S.String),
  customDomainCertificateExpiryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  customDomainName: S.optional(S.String),
  workgroupName: S.optional(S.String),
}) {}
export const AssociationList = S.Array(Association);
export class ManagedWorkgroupListItem extends S.Class<ManagedWorkgroupListItem>(
  "ManagedWorkgroupListItem",
)({
  managedWorkgroupName: S.optional(S.String),
  managedWorkgroupId: S.optional(S.String),
  sourceArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ManagedWorkgroups = S.Array(ManagedWorkgroupListItem);
export class ScheduledActionAssociation extends S.Class<ScheduledActionAssociation>(
  "ScheduledActionAssociation",
)({
  namespaceName: S.optional(S.String),
  scheduledActionName: S.optional(S.String),
}) {}
export const ScheduledActionsList = S.Array(ScheduledActionAssociation);
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ resourcePolicy: S.optional(ResourcePolicy) }) {}
export class ListCustomDomainAssociationsResponse extends S.Class<ListCustomDomainAssociationsResponse>(
  "ListCustomDomainAssociationsResponse",
)({
  nextToken: S.optional(S.String),
  associations: S.optional(AssociationList),
}) {}
export class ListManagedWorkgroupsResponse extends S.Class<ListManagedWorkgroupsResponse>(
  "ListManagedWorkgroupsResponse",
)({
  nextToken: S.optional(S.String),
  managedWorkgroups: S.optional(ManagedWorkgroups),
}) {}
export class CreateNamespaceResponse extends S.Class<CreateNamespaceResponse>(
  "CreateNamespaceResponse",
)({ namespace: S.optional(Namespace) }) {}
export class ConvertRecoveryPointToSnapshotResponse extends S.Class<ConvertRecoveryPointToSnapshotResponse>(
  "ConvertRecoveryPointToSnapshotResponse",
)({ snapshot: S.optional(Snapshot) }) {}
export class GetRecoveryPointResponse extends S.Class<GetRecoveryPointResponse>(
  "GetRecoveryPointResponse",
)({ recoveryPoint: S.optional(RecoveryPoint) }) {}
export class RestoreTableFromRecoveryPointResponse extends S.Class<RestoreTableFromRecoveryPointResponse>(
  "RestoreTableFromRecoveryPointResponse",
)({ tableRestoreStatus: S.optional(TableRestoreStatus) }) {}
export class CreateReservationResponse extends S.Class<CreateReservationResponse>(
  "CreateReservationResponse",
)({ reservation: S.optional(Reservation) }) {}
export class GetReservationOfferingResponse extends S.Class<GetReservationOfferingResponse>(
  "GetReservationOfferingResponse",
)({ reservationOffering: ReservationOffering }) {}
export class CreateScheduledActionRequest extends S.Class<CreateScheduledActionRequest>(
  "CreateScheduledActionRequest",
)(
  {
    scheduledActionName: S.String,
    targetAction: TargetAction,
    schedule: Schedule,
    roleArn: S.String,
    namespaceName: S.String,
    enabled: S.optional(S.Boolean),
    scheduledActionDescription: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScheduledActionResponse extends S.Class<DeleteScheduledActionResponse>(
  "DeleteScheduledActionResponse",
)({ scheduledAction: S.optional(ScheduledActionResponse) }) {}
export class ListScheduledActionsResponse extends S.Class<ListScheduledActionsResponse>(
  "ListScheduledActionsResponse",
)({
  nextToken: S.optional(S.String),
  scheduledActions: S.optional(ScheduledActionsList),
}) {}
export class CreateSnapshotCopyConfigurationResponse extends S.Class<CreateSnapshotCopyConfigurationResponse>(
  "CreateSnapshotCopyConfigurationResponse",
)({ snapshotCopyConfiguration: SnapshotCopyConfiguration }) {}
export class CreateUsageLimitResponse extends S.Class<CreateUsageLimitResponse>(
  "CreateUsageLimitResponse",
)({ usageLimit: S.optional(UsageLimit) }) {}
export class CreateWorkgroupResponse extends S.Class<CreateWorkgroupResponse>(
  "CreateWorkgroupResponse",
)({ workgroup: S.optional(Workgroup) }) {}
export class GetTrackResponse extends S.Class<GetTrackResponse>(
  "GetTrackResponse",
)({ track: S.optional(ServerlessTrack) }) {}
export class CreateScheduledActionResponse extends S.Class<CreateScheduledActionResponse>(
  "CreateScheduledActionResponse",
)({ scheduledAction: S.optional(ScheduledActionResponse) }) {}
export class GetWorkgroupResponse extends S.Class<GetWorkgroupResponse>(
  "GetWorkgroupResponse",
)({ workgroup: Workgroup }) {}
export class CreateEndpointAccessResponse extends S.Class<CreateEndpointAccessResponse>(
  "CreateEndpointAccessResponse",
)({ endpoint: S.optional(EndpointAccess) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { code: S.optional(S.String), message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceName: S.optional(S.String) },
) {}
export class InvalidPaginationException extends S.TaggedError<InvalidPaginationException>()(
  "InvalidPaginationException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { code: S.optional(S.String), message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class InsufficientCapacityException extends S.TaggedError<InsufficientCapacityException>()(
  "InsufficientCapacityException",
  { message: S.String },
  T.Retryable(),
) {}
export class DryRunException extends S.TaggedError<DryRunException>()(
  "DryRunException",
  { message: S.String },
) {}
export class Ipv6CidrBlockNotFoundException extends S.TaggedError<Ipv6CidrBlockNotFoundException>()(
  "Ipv6CidrBlockNotFoundException",
  { message: S.String },
) {}

//# Operations
/**
 * Returns information about a list of specified managed workgroups in your account.
 */
export const listManagedWorkgroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedWorkgroupsRequest,
    output: ListManagedWorkgroupsResponse,
    errors: [AccessDeniedException, InternalServerException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "managedWorkgroups",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns information about a list of specified namespaces.
 */
export const listNamespaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListNamespacesRequest,
    output: ListNamespacesResponse,
    errors: [InternalServerException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "namespaces",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns information about a recovery point.
 */
export const getRecoveryPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecoveryPointRequest,
  output: GetRecoveryPointResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Restores a table from a recovery point to your Amazon Redshift Serverless instance. You can't use this operation to restore tables with interleaved sort keys.
 */
export const restoreTableFromRecoveryPoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreTableFromRecoveryPointRequest,
    output: RestoreTableFromRecoveryPointResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns the current reservation offerings in your account.
 */
export const listReservationOfferings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListReservationOfferingsRequest,
    output: ListReservationOfferingsResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "reservationOfferingsList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Deletes a scheduled action.
 */
export const deleteScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteScheduledActionRequest,
    output: DeleteScheduledActionResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of scheduled actions. You can use the flags to filter the list of returned scheduled actions.
 */
export const listScheduledActions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListScheduledActionsRequest,
    output: ListScheduledActionsResponse,
    errors: [
      InternalServerException,
      InvalidPaginationException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "scheduledActions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets information about a specific custom domain association.
 */
export const getCustomDomainAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCustomDomainAssociationRequest,
    output: GetCustomDomainAssociationResponse,
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
 * Updates an Amazon Redshift Serverless certificate associated with a custom domain.
 */
export const updateCustomDomainAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCustomDomainAssociationRequest,
    output: UpdateCustomDomainAssociationResponse,
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
 * Deletes an Amazon Redshift Serverless managed VPC endpoint.
 */
export const deleteEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEndpointAccessRequest,
    output: DeleteEndpointAccessResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information, such as the name, about a VPC endpoint.
 */
export const getEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEndpointAccessRequest,
  output: GetEndpointAccessResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns an array of `EndpointAccess` objects and relevant information.
 */
export const listEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEndpointAccessRequest,
    output: ListEndpointAccessResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "endpoints",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates an Amazon Redshift Serverless managed endpoint.
 */
export const updateEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEndpointAccessRequest,
    output: UpdateEndpointAccessResponse,
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
 * Updates a namespace with the specified settings. Unless required, you can't update multiple parameters in one request. For example, you must specify both `adminUsername` and `adminUserPassword` to update either field, but you can't update both `kmsKeyId` and `logExports` in a single request.
 */
export const updateNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNamespaceRequest,
  output: UpdateNamespaceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a namespace from Amazon Redshift Serverless. Before you delete the namespace, you can create a final snapshot that has all of the data within the namespace.
 */
export const deleteNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamespaceRequest,
  output: DeleteNamespaceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Restore the data from a recovery point.
 */
export const restoreFromRecoveryPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreFromRecoveryPointRequest,
    output: RestoreFromRecoveryPointResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a scheduled action.
 */
export const updateScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateScheduledActionRequest,
    output: UpdateScheduledActionResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a snapshot from Amazon Redshift Serverless.
 */
export const deleteSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotRequest,
  output: DeleteSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a snapshot copy configuration
 */
export const deleteSnapshotCopyConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteSnapshotCopyConfigurationRequest,
    output: DeleteSnapshotCopyConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of snapshot copy configurations.
 */
export const listSnapshotCopyConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSnapshotCopyConfigurationsRequest,
    output: ListSnapshotCopyConfigurationsResponse,
    errors: [
      ConflictException,
      InternalServerException,
      InvalidPaginationException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "snapshotCopyConfigurations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Restores a table from a snapshot to your Amazon Redshift Serverless instance. You can't use this operation to restore tables with interleaved sort keys.
 */
export const restoreTableFromSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreTableFromSnapshotRequest,
    output: RestoreTableFromSnapshotResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a snapshot.
 */
export const updateSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSnapshotRequest,
  output: UpdateSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a snapshot copy configuration.
 */
export const updateSnapshotCopyConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSnapshotCopyConfigurationRequest,
    output: UpdateSnapshotCopyConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes a usage limit from Amazon Redshift Serverless.
 */
export const deleteUsageLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUsageLimitRequest,
  output: DeleteUsageLimitResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a usage limit.
 */
export const getUsageLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsageLimitRequest,
  output: GetUsageLimitResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all usage limits within Amazon Redshift Serverless.
 */
export const listUsageLimits = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListUsageLimitsRequest,
    output: ListUsageLimitsResponse,
    errors: [
      ConflictException,
      InternalServerException,
      InvalidPaginationException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "usageLimits",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Update a usage limit in Amazon Redshift Serverless. You can't update the usage type or period of a usage limit.
 */
export const updateUsageLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUsageLimitRequest,
  output: UpdateUsageLimitResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a workgroup.
 */
export const deleteWorkgroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkgroupRequest,
  output: DeleteWorkgroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a custom domain association for Amazon Redshift Serverless.
 */
export const createCustomDomainAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCustomDomainAssociationRequest,
    output: CreateCustomDomainAssociationResponse,
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
 * Returns a database user name and temporary password with temporary authorization to log in to Amazon Redshift Serverless.
 *
 * By default, the temporary credentials expire in 900 seconds. You can optionally specify a duration between 900 seconds (15 minutes) and 3600 seconds (60 minutes).
 *
 * The Identity and Access Management (IAM) user or role that runs GetCredentials must have an IAM policy attached that allows access to all necessary actions and resources.
 *
 * If the `DbName` parameter is specified, the IAM policy must allow access to the resource dbname for the specified database name.
 */
export const getCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCredentialsRequest,
  output: GetCredentialsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags assigned to a resource.
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
 * Returns information about a namespace in Amazon Redshift Serverless.
 */
export const getNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNamespaceRequest,
  output: GetNamespaceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets an Amazon Redshift Serverless reservation. A reservation gives you the option to commit to a specified number of Redshift Processing Units (RPUs) for a year at a discount from Serverless on-demand (OD) rates.
 */
export const getReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReservationRequest,
  output: GetReservationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a scheduled action.
 */
export const getScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetScheduledActionRequest,
  output: GetScheduledActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific snapshot.
 */
export const getSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSnapshotRequest,
  output: GetSnapshotResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a `TableRestoreStatus` object.
 */
export const getTableRestoreStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTableRestoreStatusRequest,
    output: GetTableRestoreStatusResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Returns a list of snapshots.
 */
export const listSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSnapshotsRequest,
    output: ListSnapshotsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "snapshots",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Removes a tag or set of tags from a resource.
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
 * Deletes a custom domain association for Amazon Redshift Serverless.
 */
export const deleteCustomDomainAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCustomDomainAssociationRequest,
    output: DeleteCustomDomainAssociationResponse,
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
 * Returns information about an array of `TableRestoreStatus` objects.
 */
export const listTableRestoreStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTableRestoreStatusRequest,
    output: ListTableRestoreStatusResponse,
    errors: [
      InvalidPaginationException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "tableRestoreStatuses",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists custom domain associations for Amazon Redshift Serverless.
 */
export const listCustomDomainAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCustomDomainAssociationsRequest,
    output: ListCustomDomainAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidPaginationException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "associations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns an array of recovery points.
 */
export const listRecoveryPoints = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRecoveryPointsRequest,
    output: ListRecoveryPointsResponse,
    errors: [InternalServerException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "recoveryPoints",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns information about a list of specified workgroups.
 */
export const listWorkgroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkgroupsRequest,
    output: ListWorkgroupsResponse,
    errors: [InternalServerException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workgroups",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Deletes the specified resource policy.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a resource policy.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of Reservation objects.
 */
export const listReservations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListReservationsRequest,
    output: ListReservationsResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "reservationsList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List the Amazon Redshift Serverless versions.
 */
export const listTracks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTracksRequest,
  output: ListTracksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidPaginationException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tracks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the reservation offering. The offering determines the payment schedule for the reservation.
 */
export const getReservationOffering = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetReservationOfferingRequest,
    output: GetReservationOfferingResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a namespace in Amazon Redshift Serverless.
 */
export const createNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNamespaceRequest,
  output: CreateNamespaceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Converts a recovery point to a snapshot. For more information about recovery points and snapshots, see Working with snapshots and recovery points.
 */
export const convertRecoveryPointToSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ConvertRecoveryPointToSnapshotRequest,
    output: ConvertRecoveryPointToSnapshotResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      TooManyTagsException,
      ValidationException,
    ],
  }));
/**
 * Creates a scheduled action. A scheduled action contains a schedule and an Amazon Redshift API action. For example, you can create a schedule of when to run the `CreateSnapshot` API operation.
 */
export const createScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateScheduledActionRequest,
    output: CreateScheduledActionResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about a specific workgroup.
 */
export const getWorkgroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkgroupRequest,
  output: GetWorkgroupResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns an Identity Center authentication token for accessing Amazon Redshift Serverless workgroups.
 *
 * The token provides secure access to data within the specified workgroups using Identity Center identity propagation. The token expires after a specified duration and must be refreshed for continued access.
 *
 * The Identity and Access Management (IAM) user or role that runs GetIdentityCenterAuthToken must have appropriate permissions to access the specified workgroups and Identity Center integration must be configured for the workgroups.
 */
export const getIdentityCenterAuthToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIdentityCenterAuthTokenRequest,
    output: GetIdentityCenterAuthTokenResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      DryRunException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Assigns one or more tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Redshift Serverless reservation, which gives you the option to commit to a specified number of Redshift Processing Units (RPUs) for a year at a discount from Serverless on-demand (OD) rates.
 */
export const createReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReservationRequest,
  output: CreateReservationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates a snapshot copy configuration that lets you copy snapshots to another Amazon Web Services Region.
 */
export const createSnapshotCopyConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateSnapshotCopyConfigurationRequest,
    output: CreateSnapshotCopyConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }));
/**
 * Creates a usage limit for a specified Amazon Redshift Serverless usage type. The usage limit is identified by the returned usage limit identifier.
 */
export const createUsageLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUsageLimitRequest,
  output: CreateUsageLimitResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a resource policy. Currently, you can use policies to share snapshots across Amazon Web Services accounts.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a snapshot of all databases in a namespace. For more information about snapshots, see Working with snapshots and recovery points.
 */
export const createSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotRequest,
  output: CreateSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Restores a namespace from a snapshot.
 */
export const restoreFromSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreFromSnapshotRequest,
  output: RestoreFromSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Modifies the lakehouse configuration for a namespace. This operation allows you to manage Amazon Redshift federated permissions and Amazon Web Services IAM Identity Center trusted identity propagation.
 */
export const updateLakehouseConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateLakehouseConfigurationRequest,
    output: UpdateLakehouseConfigurationResponse,
    errors: [
      ConflictException,
      DryRunException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Get the Redshift Serverless version for a specified track.
 */
export const getTrack = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrackRequest,
  output: GetTrackResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DryRunException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Redshift Serverless managed VPC endpoint.
 */
export const createEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEndpointAccessRequest,
    output: CreateEndpointAccessResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an workgroup in Amazon Redshift Serverless.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that you own in a Region from reaching or being reached from the internet through internet gateways and egress-only internet gateways. If a workgroup is in an account with VPC BPA turned on, the following capabilities are blocked:
 *
 * - Creating a public access workgroup
 *
 * - Modifying a private workgroup to public
 *
 * - Adding a subnet with VPC BPA turned on to the workgroup when the workgroup is public
 *
 * For more information about VPC BPA, see Block public access to VPCs and subnets in the *Amazon VPC User Guide*.
 */
export const createWorkgroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkgroupRequest,
  output: CreateWorkgroupResponse,
  errors: [
    ConflictException,
    InsufficientCapacityException,
    InternalServerException,
    Ipv6CidrBlockNotFoundException,
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Updates a workgroup with the specified configuration settings. You can't update multiple parameters in one request. For example, you can update `baseCapacity` or `port` in a single request, but you can't update both in the same request.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that you own in a Region from reaching or being reached from the internet through internet gateways and egress-only internet gateways. If a workgroup is in an account with VPC BPA turned on, the following capabilities are blocked:
 *
 * - Creating a public access workgroup
 *
 * - Modifying a private workgroup to public
 *
 * - Adding a subnet with VPC BPA turned on to the workgroup when the workgroup is public
 *
 * For more information about VPC BPA, see Block public access to VPCs and subnets in the *Amazon VPC User Guide*.
 */
export const updateWorkgroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkgroupRequest,
  output: UpdateWorkgroupResponse,
  errors: [
    ConflictException,
    InsufficientCapacityException,
    InternalServerException,
    Ipv6CidrBlockNotFoundException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));

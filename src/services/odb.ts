import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "odb", serviceShapeName: "Odb" });
const auth = T.AwsAuthSigv4({ name: "odb" });
const ver = T.ServiceVersion("2024-08-20");
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
                                url: "https://odb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://odb-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://odb.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://odb.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetOciOnboardingStatusInput extends S.Class<GetOciOnboardingStatusInput>(
  "GetOciOnboardingStatusInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagKeys = S.Array(S.String);
export const StringList = S.Array(S.String);
export const PeeredCidrList = S.Array(S.String);
export class AcceptMarketplaceRegistrationInput extends S.Class<AcceptMarketplaceRegistrationInput>(
  "AcceptMarketplaceRegistrationInput",
)(
  { marketplaceRegistrationToken: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AcceptMarketplaceRegistrationOutput extends S.Class<AcceptMarketplaceRegistrationOutput>(
  "AcceptMarketplaceRegistrationOutput",
)({}) {}
export class AssociateIamRoleToResourceInput extends S.Class<AssociateIamRoleToResourceInput>(
  "AssociateIamRoleToResourceInput",
)(
  { iamRoleArn: S.String, awsIntegration: S.String, resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateIamRoleToResourceOutput extends S.Class<AssociateIamRoleToResourceOutput>(
  "AssociateIamRoleToResourceOutput",
)({}) {}
export class DisassociateIamRoleFromResourceInput extends S.Class<DisassociateIamRoleFromResourceInput>(
  "DisassociateIamRoleFromResourceInput",
)(
  { iamRoleArn: S.String, awsIntegration: S.String, resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateIamRoleFromResourceOutput extends S.Class<DisassociateIamRoleFromResourceOutput>(
  "DisassociateIamRoleFromResourceOutput",
)({}) {}
export class InitializeServiceInput extends S.Class<InitializeServiceInput>(
  "InitializeServiceInput",
)(
  { ociIdentityDomain: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InitializeServiceOutput extends S.Class<InitializeServiceOutput>(
  "InitializeServiceOutput",
)({}) {}
export class ListDbSystemShapesInput extends S.Class<ListDbSystemShapesInput>(
  "ListDbSystemShapesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    availabilityZone: S.optional(S.String),
    availabilityZoneId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGiVersionsInput extends S.Class<ListGiVersionsInput>(
  "ListGiVersionsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    shape: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSystemVersionsInput extends S.Class<ListSystemVersionsInput>(
  "ListSystemVersionsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    giVersion: S.String,
    shape: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
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
export class GetCloudAutonomousVmClusterInput extends S.Class<GetCloudAutonomousVmClusterInput>(
  "GetCloudAutonomousVmClusterInput",
)(
  {
    cloudAutonomousVmClusterId: S.String.pipe(
      T.HttpLabel("cloudAutonomousVmClusterId"),
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCloudAutonomousVmClusterInput extends S.Class<DeleteCloudAutonomousVmClusterInput>(
  "DeleteCloudAutonomousVmClusterInput",
)(
  {
    cloudAutonomousVmClusterId: S.String.pipe(
      T.HttpLabel("cloudAutonomousVmClusterId"),
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCloudAutonomousVmClusterOutput extends S.Class<DeleteCloudAutonomousVmClusterOutput>(
  "DeleteCloudAutonomousVmClusterOutput",
)({}) {}
export class ListCloudAutonomousVmClustersInput extends S.Class<ListCloudAutonomousVmClustersInput>(
  "ListCloudAutonomousVmClustersInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    cloudExadataInfrastructureId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAutonomousVirtualMachinesInput extends S.Class<ListAutonomousVirtualMachinesInput>(
  "ListAutonomousVirtualMachinesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    cloudAutonomousVmClusterId: S.String.pipe(
      T.HttpLabel("cloudAutonomousVmClusterId"),
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCloudExadataInfrastructureInput extends S.Class<GetCloudExadataInfrastructureInput>(
  "GetCloudExadataInfrastructureInput",
)(
  {
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DayOfWeek extends S.Class<DayOfWeek>("DayOfWeek")({
  name: S.optional(S.String),
}) {}
export const DaysOfWeek = S.Array(DayOfWeek);
export const HoursOfDay = S.Array(S.Number);
export class Month extends S.Class<Month>("Month")({
  name: S.optional(S.String),
}) {}
export const Months = S.Array(Month);
export const WeeksOfMonth = S.Array(S.Number);
export class MaintenanceWindow extends S.Class<MaintenanceWindow>(
  "MaintenanceWindow",
)({
  customActionTimeoutInMins: S.optional(S.Number),
  daysOfWeek: S.optional(DaysOfWeek),
  hoursOfDay: S.optional(HoursOfDay),
  isCustomActionTimeoutEnabled: S.optional(S.Boolean),
  leadTimeInWeeks: S.optional(S.Number),
  months: S.optional(Months),
  patchingMode: S.optional(S.String),
  preference: S.optional(S.String),
  skipRu: S.optional(S.Boolean),
  weeksOfMonth: S.optional(WeeksOfMonth),
}) {}
export class UpdateCloudExadataInfrastructureInput extends S.Class<UpdateCloudExadataInfrastructureInput>(
  "UpdateCloudExadataInfrastructureInput",
)(
  {
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
    maintenanceWindow: S.optional(MaintenanceWindow),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCloudExadataInfrastructureInput extends S.Class<DeleteCloudExadataInfrastructureInput>(
  "DeleteCloudExadataInfrastructureInput",
)(
  {
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCloudExadataInfrastructureOutput extends S.Class<DeleteCloudExadataInfrastructureOutput>(
  "DeleteCloudExadataInfrastructureOutput",
)({}) {}
export class ListCloudExadataInfrastructuresInput extends S.Class<ListCloudExadataInfrastructuresInput>(
  "ListCloudExadataInfrastructuresInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCloudExadataInfrastructureUnallocatedResourcesInput extends S.Class<GetCloudExadataInfrastructureUnallocatedResourcesInput>(
  "GetCloudExadataInfrastructureUnallocatedResourcesInput",
)(
  {
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
    dbServers: S.optional(StringList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDbServerInput extends S.Class<GetDbServerInput>(
  "GetDbServerInput",
)(
  {
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
    dbServerId: S.String.pipe(T.HttpLabel("dbServerId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDbServersInput extends S.Class<ListDbServersInput>(
  "ListDbServersInput",
)(
  {
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCloudVmClusterInput extends S.Class<GetCloudVmClusterInput>(
  "GetCloudVmClusterInput",
)(
  { cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCloudVmClusterInput extends S.Class<DeleteCloudVmClusterInput>(
  "DeleteCloudVmClusterInput",
)(
  { cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCloudVmClusterOutput extends S.Class<DeleteCloudVmClusterOutput>(
  "DeleteCloudVmClusterOutput",
)({}) {}
export class ListCloudVmClustersInput extends S.Class<ListCloudVmClustersInput>(
  "ListCloudVmClustersInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    cloudExadataInfrastructureId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDbNodeInput extends S.Class<GetDbNodeInput>("GetDbNodeInput")(
  {
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
    dbNodeId: S.String.pipe(T.HttpLabel("dbNodeId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDbNodesInput extends S.Class<ListDbNodesInput>(
  "ListDbNodesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootDbNodeInput extends S.Class<RebootDbNodeInput>(
  "RebootDbNodeInput",
)(
  {
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
    dbNodeId: S.String.pipe(T.HttpLabel("dbNodeId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDbNodeInput extends S.Class<StartDbNodeInput>(
  "StartDbNodeInput",
)(
  {
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
    dbNodeId: S.String.pipe(T.HttpLabel("dbNodeId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDbNodeInput extends S.Class<StopDbNodeInput>(
  "StopDbNodeInput",
)(
  {
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
    dbNodeId: S.String.pipe(T.HttpLabel("dbNodeId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const RequestTagMap = S.Record({ key: S.String, value: S.String });
export class CreateOdbNetworkInput extends S.Class<CreateOdbNetworkInput>(
  "CreateOdbNetworkInput",
)(
  {
    displayName: S.String,
    availabilityZone: S.optional(S.String),
    availabilityZoneId: S.optional(S.String),
    clientSubnetCidr: S.String,
    backupSubnetCidr: S.optional(S.String),
    customDomainName: S.optional(S.String),
    defaultDnsPrefix: S.optional(S.String),
    clientToken: S.optional(S.String),
    s3Access: S.optional(S.String),
    zeroEtlAccess: S.optional(S.String),
    stsAccess: S.optional(S.String),
    kmsAccess: S.optional(S.String),
    s3PolicyDocument: S.optional(S.String),
    stsPolicyDocument: S.optional(S.String),
    kmsPolicyDocument: S.optional(S.String),
    crossRegionS3RestoreSourcesToEnable: S.optional(StringList),
    tags: S.optional(RequestTagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOdbNetworkInput extends S.Class<GetOdbNetworkInput>(
  "GetOdbNetworkInput",
)(
  { odbNetworkId: S.String.pipe(T.HttpLabel("odbNetworkId")) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateOdbNetworkInput extends S.Class<UpdateOdbNetworkInput>(
  "UpdateOdbNetworkInput",
)(
  {
    odbNetworkId: S.String.pipe(T.HttpLabel("odbNetworkId")),
    displayName: S.optional(S.String),
    peeredCidrsToBeAdded: S.optional(StringList),
    peeredCidrsToBeRemoved: S.optional(StringList),
    s3Access: S.optional(S.String),
    zeroEtlAccess: S.optional(S.String),
    stsAccess: S.optional(S.String),
    kmsAccess: S.optional(S.String),
    s3PolicyDocument: S.optional(S.String),
    stsPolicyDocument: S.optional(S.String),
    kmsPolicyDocument: S.optional(S.String),
    crossRegionS3RestoreSourcesToEnable: S.optional(StringList),
    crossRegionS3RestoreSourcesToDisable: S.optional(StringList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOdbNetworkInput extends S.Class<DeleteOdbNetworkInput>(
  "DeleteOdbNetworkInput",
)(
  {
    odbNetworkId: S.String.pipe(T.HttpLabel("odbNetworkId")),
    deleteAssociatedResources: S.Boolean,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOdbNetworkOutput extends S.Class<DeleteOdbNetworkOutput>(
  "DeleteOdbNetworkOutput",
)({}) {}
export class ListOdbNetworksInput extends S.Class<ListOdbNetworksInput>(
  "ListOdbNetworksInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateOdbPeeringConnectionInput extends S.Class<CreateOdbPeeringConnectionInput>(
  "CreateOdbPeeringConnectionInput",
)(
  {
    odbNetworkId: S.String,
    peerNetworkId: S.String,
    displayName: S.optional(S.String),
    peerNetworkCidrsToBeAdded: S.optional(PeeredCidrList),
    clientToken: S.optional(S.String),
    tags: S.optional(RequestTagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOdbPeeringConnectionInput extends S.Class<GetOdbPeeringConnectionInput>(
  "GetOdbPeeringConnectionInput",
)(
  {
    odbPeeringConnectionId: S.String.pipe(
      T.HttpLabel("odbPeeringConnectionId"),
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateOdbPeeringConnectionInput extends S.Class<UpdateOdbPeeringConnectionInput>(
  "UpdateOdbPeeringConnectionInput",
)(
  {
    odbPeeringConnectionId: S.String.pipe(
      T.HttpLabel("odbPeeringConnectionId"),
    ),
    displayName: S.optional(S.String),
    peerNetworkCidrsToBeAdded: S.optional(PeeredCidrList),
    peerNetworkCidrsToBeRemoved: S.optional(PeeredCidrList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOdbPeeringConnectionInput extends S.Class<DeleteOdbPeeringConnectionInput>(
  "DeleteOdbPeeringConnectionInput",
)(
  {
    odbPeeringConnectionId: S.String.pipe(
      T.HttpLabel("odbPeeringConnectionId"),
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOdbPeeringConnectionOutput extends S.Class<DeleteOdbPeeringConnectionOutput>(
  "DeleteOdbPeeringConnectionOutput",
)({}) {}
export class ListOdbPeeringConnectionsInput extends S.Class<ListOdbPeeringConnectionsInput>(
  "ListOdbPeeringConnectionsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    odbNetworkId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class OciIdentityDomain extends S.Class<OciIdentityDomain>(
  "OciIdentityDomain",
)({
  ociIdentityDomainId: S.optional(S.String),
  ociIdentityDomainResourceUrl: S.optional(S.String),
  ociIdentityDomainUrl: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  accountSetupCloudFormationUrl: S.optional(S.String),
}) {}
export class CustomerContact extends S.Class<CustomerContact>(
  "CustomerContact",
)({ email: S.optional(S.String) }) {}
export const CustomerContacts = S.Array(CustomerContact);
export class DataCollectionOptions extends S.Class<DataCollectionOptions>(
  "DataCollectionOptions",
)({
  isDiagnosticsEventsEnabled: S.optional(S.Boolean),
  isHealthMonitoringEnabled: S.optional(S.Boolean),
  isIncidentLogsEnabled: S.optional(S.Boolean),
}) {}
export class GetOciOnboardingStatusOutput extends S.Class<GetOciOnboardingStatusOutput>(
  "GetOciOnboardingStatusOutput",
)({
  status: S.optional(S.String),
  existingTenancyActivationLink: S.optional(S.String),
  newTenancyActivationLink: S.optional(S.String),
  ociIdentityDomain: S.optional(OciIdentityDomain),
}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: RequestTagMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class CreateCloudExadataInfrastructureInput extends S.Class<CreateCloudExadataInfrastructureInput>(
  "CreateCloudExadataInfrastructureInput",
)(
  {
    displayName: S.String,
    shape: S.String,
    availabilityZone: S.optional(S.String),
    availabilityZoneId: S.optional(S.String),
    tags: S.optional(RequestTagMap),
    computeCount: S.Number,
    customerContactsToSendToOCI: S.optional(CustomerContacts),
    maintenanceWindow: S.optional(MaintenanceWindow),
    storageCount: S.Number,
    clientToken: S.optional(S.String),
    databaseServerType: S.optional(S.String),
    storageServerType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCloudExadataInfrastructureOutput extends S.Class<UpdateCloudExadataInfrastructureOutput>(
  "UpdateCloudExadataInfrastructureOutput",
)({
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudExadataInfrastructureId: S.String,
}) {}
export class CreateCloudVmClusterInput extends S.Class<CreateCloudVmClusterInput>(
  "CreateCloudVmClusterInput",
)(
  {
    cloudExadataInfrastructureId: S.String,
    cpuCoreCount: S.Number,
    displayName: S.String,
    giVersion: S.String,
    hostname: S.String,
    sshPublicKeys: StringList,
    odbNetworkId: S.String,
    clusterName: S.optional(S.String),
    dataCollectionOptions: S.optional(DataCollectionOptions),
    dataStorageSizeInTBs: S.optional(S.Number),
    dbNodeStorageSizeInGBs: S.optional(S.Number),
    dbServers: S.optional(StringList),
    tags: S.optional(RequestTagMap),
    isLocalBackupEnabled: S.optional(S.Boolean),
    isSparseDiskgroupEnabled: S.optional(S.Boolean),
    licenseModel: S.optional(S.String),
    memorySizeInGBs: S.optional(S.Number),
    systemVersion: S.optional(S.String),
    timeZone: S.optional(S.String),
    clientToken: S.optional(S.String),
    scanListenerPortTcp: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootDbNodeOutput extends S.Class<RebootDbNodeOutput>(
  "RebootDbNodeOutput",
)({
  dbNodeId: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
}) {}
export class StartDbNodeOutput extends S.Class<StartDbNodeOutput>(
  "StartDbNodeOutput",
)({
  dbNodeId: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
}) {}
export class StopDbNodeOutput extends S.Class<StopDbNodeOutput>(
  "StopDbNodeOutput",
)({
  dbNodeId: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
}) {}
export class CreateOdbNetworkOutput extends S.Class<CreateOdbNetworkOutput>(
  "CreateOdbNetworkOutput",
)({
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  odbNetworkId: S.String,
}) {}
export class UpdateOdbNetworkOutput extends S.Class<UpdateOdbNetworkOutput>(
  "UpdateOdbNetworkOutput",
)({
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  odbNetworkId: S.String,
}) {}
export class CreateOdbPeeringConnectionOutput extends S.Class<CreateOdbPeeringConnectionOutput>(
  "CreateOdbPeeringConnectionOutput",
)({
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  odbPeeringConnectionId: S.String,
}) {}
export class UpdateOdbPeeringConnectionOutput extends S.Class<UpdateOdbPeeringConnectionOutput>(
  "UpdateOdbPeeringConnectionOutput",
)({
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  odbPeeringConnectionId: S.String,
}) {}
export const SensitiveStringList = S.Array(S.String);
export class DbSystemShapeSummary extends S.Class<DbSystemShapeSummary>(
  "DbSystemShapeSummary",
)({
  availableCoreCount: S.optional(S.Number),
  availableCoreCountPerNode: S.optional(S.Number),
  availableDataStorageInTBs: S.optional(S.Number),
  availableDataStoragePerServerInTBs: S.optional(S.Number),
  availableDbNodePerNodeInGBs: S.optional(S.Number),
  availableDbNodeStorageInGBs: S.optional(S.Number),
  availableMemoryInGBs: S.optional(S.Number),
  availableMemoryPerNodeInGBs: S.optional(S.Number),
  coreCountIncrement: S.optional(S.Number),
  maxStorageCount: S.optional(S.Number),
  maximumNodeCount: S.optional(S.Number),
  minCoreCountPerNode: S.optional(S.Number),
  minDataStorageInTBs: S.optional(S.Number),
  minDbNodeStoragePerNodeInGBs: S.optional(S.Number),
  minMemoryPerNodeInGBs: S.optional(S.Number),
  minStorageCount: S.optional(S.Number),
  minimumCoreCount: S.optional(S.Number),
  minimumNodeCount: S.optional(S.Number),
  runtimeMinimumCoreCount: S.optional(S.Number),
  shapeFamily: S.optional(S.String),
  shapeType: S.optional(S.String),
  name: S.optional(S.String),
  computeModel: S.optional(S.String),
  areServerTypesSupported: S.optional(S.Boolean),
}) {}
export const DbSystemShapeList = S.Array(DbSystemShapeSummary);
export class GiVersionSummary extends S.Class<GiVersionSummary>(
  "GiVersionSummary",
)({ version: S.optional(S.String) }) {}
export const GiVersionList = S.Array(GiVersionSummary);
export class SystemVersionSummary extends S.Class<SystemVersionSummary>(
  "SystemVersionSummary",
)({
  giVersion: S.optional(S.String),
  shape: S.optional(S.String),
  systemVersions: S.optional(StringList),
}) {}
export const SystemVersionList = S.Array(SystemVersionSummary);
export const ResponseTagMap = S.Record({ key: S.String, value: S.String });
export class CloudAutonomousVmCluster extends S.Class<CloudAutonomousVmCluster>(
  "CloudAutonomousVmCluster",
)({
  cloudAutonomousVmClusterId: S.String,
  cloudAutonomousVmClusterArn: S.optional(S.String),
  odbNetworkId: S.optional(S.String),
  odbNetworkArn: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  percentProgress: S.optional(S.Number),
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudExadataInfrastructureId: S.optional(S.String),
  cloudExadataInfrastructureArn: S.optional(S.String),
  autonomousDataStoragePercentage: S.optional(S.Number),
  autonomousDataStorageSizeInTBs: S.optional(S.Number),
  availableAutonomousDataStorageSizeInTBs: S.optional(S.Number),
  availableContainerDatabases: S.optional(S.Number),
  availableCpus: S.optional(S.Number),
  computeModel: S.optional(S.String),
  cpuCoreCount: S.optional(S.Number),
  cpuCoreCountPerNode: S.optional(S.Number),
  cpuPercentage: S.optional(S.Number),
  dataStorageSizeInGBs: S.optional(S.Number),
  dataStorageSizeInTBs: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServers: S.optional(StringList),
  description: S.optional(S.String),
  domain: S.optional(S.String),
  exadataStorageInTBsLowestScaledValue: S.optional(S.Number),
  hostname: S.optional(S.String),
  ocid: S.optional(S.String),
  ociUrl: S.optional(S.String),
  isMtlsEnabledVmCluster: S.optional(S.Boolean),
  licenseModel: S.optional(S.String),
  maintenanceWindow: S.optional(MaintenanceWindow),
  maxAcdsLowestScaledValue: S.optional(S.Number),
  memoryPerOracleComputeUnitInGBs: S.optional(S.Number),
  memorySizeInGBs: S.optional(S.Number),
  nodeCount: S.optional(S.Number),
  nonProvisionableAutonomousContainerDatabases: S.optional(S.Number),
  provisionableAutonomousContainerDatabases: S.optional(S.Number),
  provisionedAutonomousContainerDatabases: S.optional(S.Number),
  provisionedCpus: S.optional(S.Number),
  reclaimableCpus: S.optional(S.Number),
  reservedCpus: S.optional(S.Number),
  scanListenerPortNonTls: S.optional(S.Number),
  scanListenerPortTls: S.optional(S.Number),
  shape: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  timeDatabaseSslCertificateExpires: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  timeOrdsCertificateExpires: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  timeZone: S.optional(S.String),
  totalContainerDatabases: S.optional(S.Number),
}) {}
export class CloudAutonomousVmClusterSummary extends S.Class<CloudAutonomousVmClusterSummary>(
  "CloudAutonomousVmClusterSummary",
)({
  cloudAutonomousVmClusterId: S.String,
  cloudAutonomousVmClusterArn: S.optional(S.String),
  odbNetworkId: S.optional(S.String),
  odbNetworkArn: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  percentProgress: S.optional(S.Number),
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudExadataInfrastructureId: S.optional(S.String),
  cloudExadataInfrastructureArn: S.optional(S.String),
  autonomousDataStoragePercentage: S.optional(S.Number),
  autonomousDataStorageSizeInTBs: S.optional(S.Number),
  availableAutonomousDataStorageSizeInTBs: S.optional(S.Number),
  availableContainerDatabases: S.optional(S.Number),
  availableCpus: S.optional(S.Number),
  computeModel: S.optional(S.String),
  cpuCoreCount: S.optional(S.Number),
  cpuCoreCountPerNode: S.optional(S.Number),
  cpuPercentage: S.optional(S.Number),
  dataStorageSizeInGBs: S.optional(S.Number),
  dataStorageSizeInTBs: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServers: S.optional(StringList),
  description: S.optional(S.String),
  domain: S.optional(S.String),
  exadataStorageInTBsLowestScaledValue: S.optional(S.Number),
  hostname: S.optional(S.String),
  ocid: S.optional(S.String),
  ociUrl: S.optional(S.String),
  isMtlsEnabledVmCluster: S.optional(S.Boolean),
  licenseModel: S.optional(S.String),
  maintenanceWindow: S.optional(MaintenanceWindow),
  maxAcdsLowestScaledValue: S.optional(S.Number),
  memoryPerOracleComputeUnitInGBs: S.optional(S.Number),
  memorySizeInGBs: S.optional(S.Number),
  nodeCount: S.optional(S.Number),
  nonProvisionableAutonomousContainerDatabases: S.optional(S.Number),
  provisionableAutonomousContainerDatabases: S.optional(S.Number),
  provisionedAutonomousContainerDatabases: S.optional(S.Number),
  provisionedCpus: S.optional(S.Number),
  reclaimableCpus: S.optional(S.Number),
  reservedCpus: S.optional(S.Number),
  scanListenerPortNonTls: S.optional(S.Number),
  scanListenerPortTls: S.optional(S.Number),
  shape: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  timeDatabaseSslCertificateExpires: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  timeOrdsCertificateExpires: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  timeZone: S.optional(S.String),
  totalContainerDatabases: S.optional(S.Number),
}) {}
export const CloudAutonomousVmClusterList = S.Array(
  CloudAutonomousVmClusterSummary,
);
export class AutonomousVirtualMachineSummary extends S.Class<AutonomousVirtualMachineSummary>(
  "AutonomousVirtualMachineSummary",
)({
  autonomousVirtualMachineId: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  vmName: S.optional(S.String),
  dbServerId: S.optional(S.String),
  dbServerDisplayName: S.optional(S.String),
  cpuCoreCount: S.optional(S.Number),
  memorySizeInGBs: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  clientIpAddress: S.optional(S.String),
  cloudAutonomousVmClusterId: S.optional(S.String),
  ocid: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
}) {}
export const AutonomousVirtualMachineList = S.Array(
  AutonomousVirtualMachineSummary,
);
export class CloudExadataInfrastructure extends S.Class<CloudExadataInfrastructure>(
  "CloudExadataInfrastructure",
)({
  cloudExadataInfrastructureId: S.String,
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudExadataInfrastructureArn: S.optional(S.String),
  activatedStorageCount: S.optional(S.Number),
  additionalStorageCount: S.optional(S.Number),
  availableStorageSizeInGBs: S.optional(S.Number),
  availabilityZone: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  computeCount: S.optional(S.Number),
  cpuCount: S.optional(S.Number),
  customerContactsToSendToOCI: S.optional(CustomerContacts),
  dataStorageSizeInTBs: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServerVersion: S.optional(S.String),
  lastMaintenanceRunId: S.optional(S.String),
  maintenanceWindow: S.optional(MaintenanceWindow),
  maxCpuCount: S.optional(S.Number),
  maxDataStorageInTBs: S.optional(S.Number),
  maxDbNodeStorageSizeInGBs: S.optional(S.Number),
  maxMemoryInGBs: S.optional(S.Number),
  memorySizeInGBs: S.optional(S.Number),
  monthlyDbServerVersion: S.optional(S.String),
  monthlyStorageServerVersion: S.optional(S.String),
  nextMaintenanceRunId: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  ociUrl: S.optional(S.String),
  ocid: S.optional(S.String),
  shape: S.optional(S.String),
  storageCount: S.optional(S.Number),
  storageServerVersion: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  totalStorageSizeInGBs: S.optional(S.Number),
  percentProgress: S.optional(S.Number),
  databaseServerType: S.optional(S.String),
  storageServerType: S.optional(S.String),
  computeModel: S.optional(S.String),
}) {}
export class CloudExadataInfrastructureSummary extends S.Class<CloudExadataInfrastructureSummary>(
  "CloudExadataInfrastructureSummary",
)({
  cloudExadataInfrastructureId: S.String,
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudExadataInfrastructureArn: S.optional(S.String),
  activatedStorageCount: S.optional(S.Number),
  additionalStorageCount: S.optional(S.Number),
  availableStorageSizeInGBs: S.optional(S.Number),
  availabilityZone: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  computeCount: S.optional(S.Number),
  cpuCount: S.optional(S.Number),
  customerContactsToSendToOCI: S.optional(CustomerContacts),
  dataStorageSizeInTBs: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServerVersion: S.optional(S.String),
  lastMaintenanceRunId: S.optional(S.String),
  maintenanceWindow: S.optional(MaintenanceWindow),
  maxCpuCount: S.optional(S.Number),
  maxDataStorageInTBs: S.optional(S.Number),
  maxDbNodeStorageSizeInGBs: S.optional(S.Number),
  maxMemoryInGBs: S.optional(S.Number),
  memorySizeInGBs: S.optional(S.Number),
  monthlyDbServerVersion: S.optional(S.String),
  monthlyStorageServerVersion: S.optional(S.String),
  nextMaintenanceRunId: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  ociUrl: S.optional(S.String),
  ocid: S.optional(S.String),
  shape: S.optional(S.String),
  storageCount: S.optional(S.Number),
  storageServerVersion: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  totalStorageSizeInGBs: S.optional(S.Number),
  percentProgress: S.optional(S.Number),
  databaseServerType: S.optional(S.String),
  storageServerType: S.optional(S.String),
  computeModel: S.optional(S.String),
}) {}
export const CloudExadataInfrastructureList = S.Array(
  CloudExadataInfrastructureSummary,
);
export class DbServerPatchingDetails extends S.Class<DbServerPatchingDetails>(
  "DbServerPatchingDetails",
)({
  estimatedPatchDuration: S.optional(S.Number),
  patchingStatus: S.optional(S.String),
  timePatchingEnded: S.optional(S.String),
  timePatchingStarted: S.optional(S.String),
}) {}
export class DbServerSummary extends S.Class<DbServerSummary>(
  "DbServerSummary",
)({
  dbServerId: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cpuCoreCount: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServerPatchingDetails: S.optional(DbServerPatchingDetails),
  displayName: S.optional(S.String),
  exadataInfrastructureId: S.optional(S.String),
  ocid: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  maxCpuCount: S.optional(S.Number),
  maxDbNodeStorageInGBs: S.optional(S.Number),
  maxMemoryInGBs: S.optional(S.Number),
  memorySizeInGBs: S.optional(S.Number),
  shape: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  vmClusterIds: S.optional(StringList),
  computeModel: S.optional(S.String),
  autonomousVmClusterIds: S.optional(StringList),
  autonomousVirtualMachineIds: S.optional(StringList),
}) {}
export const DbServerList = S.Array(DbServerSummary);
export class DbIormConfig extends S.Class<DbIormConfig>("DbIormConfig")({
  dbName: S.optional(S.String),
  flashCacheLimit: S.optional(S.String),
  share: S.optional(S.Number),
}) {}
export const DbIormConfigList = S.Array(DbIormConfig);
export class ExadataIormConfig extends S.Class<ExadataIormConfig>(
  "ExadataIormConfig",
)({
  dbPlans: S.optional(DbIormConfigList),
  lifecycleDetails: S.optional(S.String),
  lifecycleState: S.optional(S.String),
  objective: S.optional(S.String),
}) {}
export class IamRole extends S.Class<IamRole>("IamRole")({
  iamRoleArn: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  awsIntegration: S.optional(S.String),
}) {}
export const IamRoleList = S.Array(IamRole);
export class CloudVmClusterSummary extends S.Class<CloudVmClusterSummary>(
  "CloudVmClusterSummary",
)({
  cloudVmClusterId: S.String,
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudVmClusterArn: S.optional(S.String),
  cloudExadataInfrastructureId: S.optional(S.String),
  cloudExadataInfrastructureArn: S.optional(S.String),
  clusterName: S.optional(S.String),
  cpuCoreCount: S.optional(S.Number),
  dataCollectionOptions: S.optional(DataCollectionOptions),
  dataStorageSizeInTBs: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServers: S.optional(StringList),
  diskRedundancy: S.optional(S.String),
  giVersion: S.optional(S.String),
  hostname: S.optional(S.String),
  iormConfigCache: S.optional(ExadataIormConfig),
  isLocalBackupEnabled: S.optional(S.Boolean),
  isSparseDiskgroupEnabled: S.optional(S.Boolean),
  lastUpdateHistoryEntryId: S.optional(S.String),
  licenseModel: S.optional(S.String),
  listenerPort: S.optional(S.Number),
  memorySizeInGBs: S.optional(S.Number),
  nodeCount: S.optional(S.Number),
  ocid: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  ociUrl: S.optional(S.String),
  domain: S.optional(S.String),
  scanDnsName: S.optional(S.String),
  scanDnsRecordId: S.optional(S.String),
  scanIpIds: S.optional(StringList),
  shape: S.optional(S.String),
  sshPublicKeys: S.optional(SensitiveStringList),
  storageSizeInGBs: S.optional(S.Number),
  systemVersion: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  timeZone: S.optional(S.String),
  vipIds: S.optional(StringList),
  odbNetworkId: S.optional(S.String),
  odbNetworkArn: S.optional(S.String),
  percentProgress: S.optional(S.Number),
  computeModel: S.optional(S.String),
  iamRoles: S.optional(IamRoleList),
}) {}
export const CloudVmClusterList = S.Array(CloudVmClusterSummary);
export class DbNode extends S.Class<DbNode>("DbNode")({
  dbNodeId: S.optional(S.String),
  dbNodeArn: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  additionalDetails: S.optional(S.String),
  backupIpId: S.optional(S.String),
  backupVnic2Id: S.optional(S.String),
  backupVnicId: S.optional(S.String),
  cpuCoreCount: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServerId: S.optional(S.String),
  dbSystemId: S.optional(S.String),
  faultDomain: S.optional(S.String),
  hostIpId: S.optional(S.String),
  hostname: S.optional(S.String),
  ocid: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  maintenanceType: S.optional(S.String),
  memorySizeInGBs: S.optional(S.Number),
  softwareStorageSizeInGB: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  timeMaintenanceWindowEnd: S.optional(S.String),
  timeMaintenanceWindowStart: S.optional(S.String),
  totalCpuCoreCount: S.optional(S.Number),
  vnic2Id: S.optional(S.String),
  vnicId: S.optional(S.String),
  privateIpAddress: S.optional(S.String),
  floatingIpAddress: S.optional(S.String),
}) {}
export class DbNodeSummary extends S.Class<DbNodeSummary>("DbNodeSummary")({
  dbNodeId: S.optional(S.String),
  dbNodeArn: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  additionalDetails: S.optional(S.String),
  backupIpId: S.optional(S.String),
  backupVnic2Id: S.optional(S.String),
  backupVnicId: S.optional(S.String),
  cpuCoreCount: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServerId: S.optional(S.String),
  dbSystemId: S.optional(S.String),
  faultDomain: S.optional(S.String),
  hostIpId: S.optional(S.String),
  hostname: S.optional(S.String),
  ocid: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  maintenanceType: S.optional(S.String),
  memorySizeInGBs: S.optional(S.Number),
  softwareStorageSizeInGB: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  timeMaintenanceWindowEnd: S.optional(S.String),
  timeMaintenanceWindowStart: S.optional(S.String),
  totalCpuCoreCount: S.optional(S.Number),
  vnic2Id: S.optional(S.String),
  vnicId: S.optional(S.String),
}) {}
export const DbNodeList = S.Array(DbNodeSummary);
export class OciDnsForwardingConfig extends S.Class<OciDnsForwardingConfig>(
  "OciDnsForwardingConfig",
)({
  domainName: S.optional(S.String),
  ociDnsListenerIp: S.optional(S.String),
}) {}
export const OciDnsForwardingConfigList = S.Array(OciDnsForwardingConfig);
export class ServiceNetworkEndpoint extends S.Class<ServiceNetworkEndpoint>(
  "ServiceNetworkEndpoint",
)({
  vpcEndpointId: S.optional(S.String),
  vpcEndpointType: S.optional(S.String),
}) {}
export class ManagedS3BackupAccess extends S.Class<ManagedS3BackupAccess>(
  "ManagedS3BackupAccess",
)({ status: S.optional(S.String), ipv4Addresses: S.optional(StringList) }) {}
export class ZeroEtlAccess extends S.Class<ZeroEtlAccess>("ZeroEtlAccess")({
  status: S.optional(S.String),
  cidr: S.optional(S.String),
}) {}
export class S3Access extends S.Class<S3Access>("S3Access")({
  status: S.optional(S.String),
  ipv4Addresses: S.optional(StringList),
  domainName: S.optional(S.String),
  s3PolicyDocument: S.optional(S.String),
}) {}
export class StsAccess extends S.Class<StsAccess>("StsAccess")({
  status: S.optional(S.String),
  ipv4Addresses: S.optional(StringList),
  domainName: S.optional(S.String),
  stsPolicyDocument: S.optional(S.String),
}) {}
export class KmsAccess extends S.Class<KmsAccess>("KmsAccess")({
  status: S.optional(S.String),
  ipv4Addresses: S.optional(StringList),
  domainName: S.optional(S.String),
  kmsPolicyDocument: S.optional(S.String),
}) {}
export class CrossRegionS3RestoreSourcesAccess extends S.Class<CrossRegionS3RestoreSourcesAccess>(
  "CrossRegionS3RestoreSourcesAccess",
)({
  region: S.optional(S.String),
  ipv4Addresses: S.optional(StringList),
  status: S.optional(S.String),
}) {}
export const CrossRegionS3RestoreSourcesAccessList = S.Array(
  CrossRegionS3RestoreSourcesAccess,
);
export class ManagedServices extends S.Class<ManagedServices>(
  "ManagedServices",
)({
  serviceNetworkArn: S.optional(S.String),
  resourceGatewayArn: S.optional(S.String),
  managedServicesIpv4Cidrs: S.optional(StringList),
  serviceNetworkEndpoint: S.optional(ServiceNetworkEndpoint),
  managedS3BackupAccess: S.optional(ManagedS3BackupAccess),
  zeroEtlAccess: S.optional(ZeroEtlAccess),
  s3Access: S.optional(S3Access),
  stsAccess: S.optional(StsAccess),
  kmsAccess: S.optional(KmsAccess),
  crossRegionS3RestoreSourcesAccess: S.optional(
    CrossRegionS3RestoreSourcesAccessList,
  ),
}) {}
export class OdbNetworkSummary extends S.Class<OdbNetworkSummary>(
  "OdbNetworkSummary",
)({
  odbNetworkId: S.String,
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  odbNetworkArn: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  clientSubnetCidr: S.optional(S.String),
  backupSubnetCidr: S.optional(S.String),
  customDomainName: S.optional(S.String),
  defaultDnsPrefix: S.optional(S.String),
  peeredCidrs: S.optional(StringList),
  ociNetworkAnchorId: S.optional(S.String),
  ociNetworkAnchorUrl: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  ociVcnId: S.optional(S.String),
  ociVcnUrl: S.optional(S.String),
  ociDnsForwardingConfigs: S.optional(OciDnsForwardingConfigList),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  percentProgress: S.optional(S.Number),
  managedServices: S.optional(ManagedServices),
}) {}
export const OdbNetworkList = S.Array(OdbNetworkSummary);
export class OdbPeeringConnection extends S.Class<OdbPeeringConnection>(
  "OdbPeeringConnection",
)({
  odbPeeringConnectionId: S.String,
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  odbPeeringConnectionArn: S.optional(S.String),
  odbNetworkArn: S.optional(S.String),
  peerNetworkArn: S.optional(S.String),
  odbPeeringConnectionType: S.optional(S.String),
  peerNetworkCidrs: S.optional(PeeredCidrList),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  percentProgress: S.optional(S.Number),
}) {}
export class OdbPeeringConnectionSummary extends S.Class<OdbPeeringConnectionSummary>(
  "OdbPeeringConnectionSummary",
)({
  odbPeeringConnectionId: S.String,
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  odbPeeringConnectionArn: S.optional(S.String),
  odbNetworkArn: S.optional(S.String),
  peerNetworkArn: S.optional(S.String),
  odbPeeringConnectionType: S.optional(S.String),
  peerNetworkCidrs: S.optional(PeeredCidrList),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  percentProgress: S.optional(S.Number),
}) {}
export const OdbPeeringConnectionList = S.Array(OdbPeeringConnectionSummary);
export class ListDbSystemShapesOutput extends S.Class<ListDbSystemShapesOutput>(
  "ListDbSystemShapesOutput",
)({ nextToken: S.optional(S.String), dbSystemShapes: DbSystemShapeList }) {}
export class ListGiVersionsOutput extends S.Class<ListGiVersionsOutput>(
  "ListGiVersionsOutput",
)({ nextToken: S.optional(S.String), giVersions: GiVersionList }) {}
export class ListSystemVersionsOutput extends S.Class<ListSystemVersionsOutput>(
  "ListSystemVersionsOutput",
)({ nextToken: S.optional(S.String), systemVersions: SystemVersionList }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(ResponseTagMap) }) {}
export class CreateCloudAutonomousVmClusterInput extends S.Class<CreateCloudAutonomousVmClusterInput>(
  "CreateCloudAutonomousVmClusterInput",
)(
  {
    cloudExadataInfrastructureId: S.String,
    odbNetworkId: S.String,
    displayName: S.String,
    clientToken: S.optional(S.String),
    autonomousDataStorageSizeInTBs: S.Number,
    cpuCoreCountPerNode: S.Number,
    dbServers: S.optional(StringList),
    description: S.optional(S.String),
    isMtlsEnabledVmCluster: S.optional(S.Boolean),
    licenseModel: S.optional(S.String),
    maintenanceWindow: S.optional(MaintenanceWindow),
    memoryPerOracleComputeUnitInGBs: S.Number,
    scanListenerPortNonTls: S.optional(S.Number),
    scanListenerPortTls: S.optional(S.Number),
    tags: S.optional(RequestTagMap),
    timeZone: S.optional(S.String),
    totalContainerDatabases: S.Number,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCloudAutonomousVmClusterOutput extends S.Class<GetCloudAutonomousVmClusterOutput>(
  "GetCloudAutonomousVmClusterOutput",
)({ cloudAutonomousVmCluster: S.optional(CloudAutonomousVmCluster) }) {}
export class ListCloudAutonomousVmClustersOutput extends S.Class<ListCloudAutonomousVmClustersOutput>(
  "ListCloudAutonomousVmClustersOutput",
)({
  nextToken: S.optional(S.String),
  cloudAutonomousVmClusters: CloudAutonomousVmClusterList,
}) {}
export class ListAutonomousVirtualMachinesOutput extends S.Class<ListAutonomousVirtualMachinesOutput>(
  "ListAutonomousVirtualMachinesOutput",
)({
  nextToken: S.optional(S.String),
  autonomousVirtualMachines: AutonomousVirtualMachineList,
}) {}
export class CreateCloudExadataInfrastructureOutput extends S.Class<CreateCloudExadataInfrastructureOutput>(
  "CreateCloudExadataInfrastructureOutput",
)({
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudExadataInfrastructureId: S.String,
}) {}
export class GetCloudExadataInfrastructureOutput extends S.Class<GetCloudExadataInfrastructureOutput>(
  "GetCloudExadataInfrastructureOutput",
)({ cloudExadataInfrastructure: S.optional(CloudExadataInfrastructure) }) {}
export class ListCloudExadataInfrastructuresOutput extends S.Class<ListCloudExadataInfrastructuresOutput>(
  "ListCloudExadataInfrastructuresOutput",
)({
  nextToken: S.optional(S.String),
  cloudExadataInfrastructures: CloudExadataInfrastructureList,
}) {}
export class ListDbServersOutput extends S.Class<ListDbServersOutput>(
  "ListDbServersOutput",
)({ nextToken: S.optional(S.String), dbServers: DbServerList }) {}
export class CreateCloudVmClusterOutput extends S.Class<CreateCloudVmClusterOutput>(
  "CreateCloudVmClusterOutput",
)({
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudVmClusterId: S.String,
}) {}
export class ListCloudVmClustersOutput extends S.Class<ListCloudVmClustersOutput>(
  "ListCloudVmClustersOutput",
)({ nextToken: S.optional(S.String), cloudVmClusters: CloudVmClusterList }) {}
export class GetDbNodeOutput extends S.Class<GetDbNodeOutput>(
  "GetDbNodeOutput",
)({ dbNode: S.optional(DbNode) }) {}
export class ListDbNodesOutput extends S.Class<ListDbNodesOutput>(
  "ListDbNodesOutput",
)({ nextToken: S.optional(S.String), dbNodes: DbNodeList }) {}
export class ListOdbNetworksOutput extends S.Class<ListOdbNetworksOutput>(
  "ListOdbNetworksOutput",
)({ nextToken: S.optional(S.String), odbNetworks: OdbNetworkList }) {}
export class GetOdbPeeringConnectionOutput extends S.Class<GetOdbPeeringConnectionOutput>(
  "GetOdbPeeringConnectionOutput",
)({ odbPeeringConnection: S.optional(OdbPeeringConnection) }) {}
export class ListOdbPeeringConnectionsOutput extends S.Class<ListOdbPeeringConnectionsOutput>(
  "ListOdbPeeringConnectionsOutput",
)({
  nextToken: S.optional(S.String),
  odbPeeringConnections: OdbPeeringConnectionList,
}) {}
export class CloudAutonomousVmClusterResourceDetails extends S.Class<CloudAutonomousVmClusterResourceDetails>(
  "CloudAutonomousVmClusterResourceDetails",
)({
  cloudAutonomousVmClusterId: S.optional(S.String),
  unallocatedAdbStorageInTBs: S.optional(S.Number),
}) {}
export const CloudAutonomousVmClusterResourceDetailsList = S.Array(
  CloudAutonomousVmClusterResourceDetails,
);
export class CloudExadataInfrastructureUnallocatedResources extends S.Class<CloudExadataInfrastructureUnallocatedResources>(
  "CloudExadataInfrastructureUnallocatedResources",
)({
  cloudAutonomousVmClusters: S.optional(
    CloudAutonomousVmClusterResourceDetailsList,
  ),
  cloudExadataInfrastructureDisplayName: S.optional(S.String),
  exadataStorageInTBs: S.optional(S.Number),
  cloudExadataInfrastructureId: S.optional(S.String),
  localStorageInGBs: S.optional(S.Number),
  memoryInGBs: S.optional(S.Number),
  ocpus: S.optional(S.Number),
}) {}
export class DbServer extends S.Class<DbServer>("DbServer")({
  dbServerId: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cpuCoreCount: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServerPatchingDetails: S.optional(DbServerPatchingDetails),
  displayName: S.optional(S.String),
  exadataInfrastructureId: S.optional(S.String),
  ocid: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  maxCpuCount: S.optional(S.Number),
  maxDbNodeStorageInGBs: S.optional(S.Number),
  maxMemoryInGBs: S.optional(S.Number),
  memorySizeInGBs: S.optional(S.Number),
  shape: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  vmClusterIds: S.optional(StringList),
  computeModel: S.optional(S.String),
  autonomousVmClusterIds: S.optional(StringList),
  autonomousVirtualMachineIds: S.optional(StringList),
}) {}
export class CreateCloudAutonomousVmClusterOutput extends S.Class<CreateCloudAutonomousVmClusterOutput>(
  "CreateCloudAutonomousVmClusterOutput",
)({
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudAutonomousVmClusterId: S.String,
}) {}
export class GetCloudExadataInfrastructureUnallocatedResourcesOutput extends S.Class<GetCloudExadataInfrastructureUnallocatedResourcesOutput>(
  "GetCloudExadataInfrastructureUnallocatedResourcesOutput",
)({
  cloudExadataInfrastructureUnallocatedResources: S.optional(
    CloudExadataInfrastructureUnallocatedResources,
  ),
}) {}
export class GetDbServerOutput extends S.Class<GetDbServerOutput>(
  "GetDbServerOutput",
)({ dbServer: S.optional(DbServer) }) {}
export class CloudVmCluster extends S.Class<CloudVmCluster>("CloudVmCluster")({
  cloudVmClusterId: S.String,
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  cloudVmClusterArn: S.optional(S.String),
  cloudExadataInfrastructureId: S.optional(S.String),
  cloudExadataInfrastructureArn: S.optional(S.String),
  clusterName: S.optional(S.String),
  cpuCoreCount: S.optional(S.Number),
  dataCollectionOptions: S.optional(DataCollectionOptions),
  dataStorageSizeInTBs: S.optional(S.Number),
  dbNodeStorageSizeInGBs: S.optional(S.Number),
  dbServers: S.optional(StringList),
  diskRedundancy: S.optional(S.String),
  giVersion: S.optional(S.String),
  hostname: S.optional(S.String),
  iormConfigCache: S.optional(ExadataIormConfig),
  isLocalBackupEnabled: S.optional(S.Boolean),
  isSparseDiskgroupEnabled: S.optional(S.Boolean),
  lastUpdateHistoryEntryId: S.optional(S.String),
  licenseModel: S.optional(S.String),
  listenerPort: S.optional(S.Number),
  memorySizeInGBs: S.optional(S.Number),
  nodeCount: S.optional(S.Number),
  ocid: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  ociUrl: S.optional(S.String),
  domain: S.optional(S.String),
  scanDnsName: S.optional(S.String),
  scanDnsRecordId: S.optional(S.String),
  scanIpIds: S.optional(StringList),
  shape: S.optional(S.String),
  sshPublicKeys: S.optional(SensitiveStringList),
  storageSizeInGBs: S.optional(S.Number),
  systemVersion: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  timeZone: S.optional(S.String),
  vipIds: S.optional(StringList),
  odbNetworkId: S.optional(S.String),
  odbNetworkArn: S.optional(S.String),
  percentProgress: S.optional(S.Number),
  computeModel: S.optional(S.String),
  iamRoles: S.optional(IamRoleList),
}) {}
export class OdbNetwork extends S.Class<OdbNetwork>("OdbNetwork")({
  odbNetworkId: S.String,
  displayName: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  odbNetworkArn: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  clientSubnetCidr: S.optional(S.String),
  backupSubnetCidr: S.optional(S.String),
  customDomainName: S.optional(S.String),
  defaultDnsPrefix: S.optional(S.String),
  peeredCidrs: S.optional(StringList),
  ociNetworkAnchorId: S.optional(S.String),
  ociNetworkAnchorUrl: S.optional(S.String),
  ociResourceAnchorName: S.optional(S.String),
  ociVcnId: S.optional(S.String),
  ociVcnUrl: S.optional(S.String),
  ociDnsForwardingConfigs: S.optional(OciDnsForwardingConfigList),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  percentProgress: S.optional(S.Number),
  managedServices: S.optional(ManagedServices),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class GetCloudVmClusterOutput extends S.Class<GetCloudVmClusterOutput>(
  "GetCloudVmClusterOutput",
)({ cloudVmCluster: S.optional(CloudVmCluster) }) {}
export class GetOdbNetworkOutput extends S.Class<GetOdbNetworkOutput>(
  "GetOdbNetworkOutput",
)({ odbNetwork: S.optional(OdbNetwork) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    quotaCode: S.String,
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
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
 * Removes tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns information about the tags applied to this resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Applies tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * Deletes an Autonomous VM cluster.
 */
export const deleteCloudAutonomousVmCluster =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCloudAutonomousVmClusterInput,
    output: DeleteCloudAutonomousVmClusterOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes the specified VM cluster.
 */
export const deleteCloudVmCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCloudVmClusterInput,
    output: DeleteCloudVmClusterOutput,
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
 * Returns the tenancy activation link and onboarding status for your Amazon Web Services account.
 */
export const getOciOnboardingStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOciOnboardingStatusInput,
    output: GetOciOnboardingStatusOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new Autonomous VM cluster in the specified Exadata infrastructure.
 */
export const createCloudAutonomousVmCluster =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCloudAutonomousVmClusterInput,
    output: CreateCloudAutonomousVmClusterOutput,
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
 * Retrieves information about unallocated resources in a specified Cloud Exadata Infrastructure.
 */
export const getCloudExadataInfrastructureUnallocatedResources =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCloudExadataInfrastructureUnallocatedResourcesInput,
    output: GetCloudExadataInfrastructureUnallocatedResourcesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns information about the specified database server.
 */
export const getDbServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDbServerInput,
  output: GetDbServerOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the shapes that are available for an Exadata infrastructure.
 */
export const listDbSystemShapes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDbSystemShapesInput,
    output: ListDbSystemShapesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "dbSystemShapes",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns information about Oracle Grid Infrastructure (GI) software versions that are available for a VM cluster for the specified shape.
 */
export const listGiVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGiVersionsInput,
    output: ListGiVersionsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "giVersions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns information about the system versions that are available for a VM cluster for the specified `giVersion` and `shape`.
 */
export const listSystemVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSystemVersionsInput,
    output: ListSystemVersionsOutput,
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
      items: "systemVersions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets information about a specific Autonomous VM cluster.
 */
export const getCloudAutonomousVmCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCloudAutonomousVmClusterInput,
    output: GetCloudAutonomousVmClusterOutput,
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
 * Lists all Autonomous VM clusters in a specified Cloud Exadata infrastructure.
 */
export const listCloudAutonomousVmClusters =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCloudAutonomousVmClustersInput,
    output: ListCloudAutonomousVmClustersOutput,
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
      items: "cloudAutonomousVmClusters",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all Autonomous VMs in an Autonomous VM cluster.
 */
export const listAutonomousVirtualMachines =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAutonomousVirtualMachinesInput,
    output: ListAutonomousVirtualMachinesOutput,
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
      items: "autonomousVirtualMachines",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns information about the specified Exadata infrastructure.
 */
export const getCloudExadataInfrastructure =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCloudExadataInfrastructureInput,
    output: GetCloudExadataInfrastructureOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns information about the Exadata infrastructures owned by your Amazon Web Services account.
 */
export const listCloudExadataInfrastructures =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCloudExadataInfrastructuresInput,
    output: ListCloudExadataInfrastructuresOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "cloudExadataInfrastructures",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns information about the database servers that belong to the specified Exadata infrastructure.
 */
export const listDbServers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDbServersInput,
    output: ListDbServersOutput,
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
      items: "dbServers",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns information about the VM clusters owned by your Amazon Web Services account or only the ones on the specified Exadata infrastructure.
 */
export const listCloudVmClusters =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCloudVmClustersInput,
    output: ListCloudVmClustersOutput,
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
      items: "cloudVmClusters",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns information about the specified DB node.
 */
export const getDbNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDbNodeInput,
  output: GetDbNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the DB nodes for the specified VM cluster.
 */
export const listDbNodes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDbNodesInput,
    output: ListDbNodesOutput,
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
      items: "dbNodes",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns information about the ODB networks owned by your Amazon Web Services account.
 */
export const listOdbNetworks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListOdbNetworksInput,
    output: ListOdbNetworksOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "odbNetworks",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves information about an ODB peering connection.
 */
export const getOdbPeeringConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOdbPeeringConnectionInput,
    output: GetOdbPeeringConnectionOutput,
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
 * Lists all ODB peering connections or those associated with a specific ODB network.
 */
export const listOdbPeeringConnections =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOdbPeeringConnectionsInput,
    output: ListOdbPeeringConnectionsOutput,
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
      items: "odbPeeringConnections",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Updates the properties of an Exadata infrastructure resource.
 */
export const updateCloudExadataInfrastructure =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCloudExadataInfrastructureInput,
    output: UpdateCloudExadataInfrastructureOutput,
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
 * Updates properties of a specified ODB network.
 */
export const updateOdbNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOdbNetworkInput,
  output: UpdateOdbNetworkOutput,
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
 * Creates a peering connection between an ODB network and a VPC.
 *
 * A peering connection enables private connectivity between the networks for application-tier communication.
 */
export const createOdbPeeringConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateOdbPeeringConnectionInput,
    output: CreateOdbPeeringConnectionOutput,
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
 * Modifies the settings of an Oracle Database@Amazon Web Services peering connection. You can update the display name and add or remove CIDR blocks from the peering connection.
 */
export const updateOdbPeeringConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateOdbPeeringConnectionInput,
    output: UpdateOdbPeeringConnectionOutput,
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
 * Associates an Amazon Web Services Identity and Access Management (IAM) service role with a specified resource to enable Amazon Web Services service integration.
 */
export const associateIamRoleToResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateIamRoleToResourceInput,
    output: AssociateIamRoleToResourceOutput,
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
 * Disassociates an Amazon Web Services Identity and Access Management (IAM) service role from a specified resource to disable Amazon Web Services service integration.
 */
export const disassociateIamRoleFromResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateIamRoleFromResourceInput,
    output: DisassociateIamRoleFromResourceOutput,
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
 * Deletes the specified Exadata infrastructure. Before you use this operation, make sure to delete all of the VM clusters that are hosted on this Exadata infrastructure.
 */
export const deleteCloudExadataInfrastructure =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCloudExadataInfrastructureInput,
    output: DeleteCloudExadataInfrastructureOutput,
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
 * Reboots the specified DB node in a VM cluster.
 */
export const rebootDbNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDbNodeInput,
  output: RebootDbNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts the specified DB node in a VM cluster.
 */
export const startDbNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDbNodeInput,
  output: StartDbNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops the specified DB node in a VM cluster.
 */
export const stopDbNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDbNodeInput,
  output: StopDbNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Initializes the ODB service for the first time in an account.
 */
export const initializeService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitializeServiceInput,
  output: InitializeServiceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified ODB network.
 */
export const deleteOdbNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOdbNetworkInput,
  output: DeleteOdbNetworkOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an ODB peering connection.
 *
 * When you delete an ODB peering connection, the underlying VPC peering connection is also deleted.
 */
export const deleteOdbPeeringConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOdbPeeringConnectionInput,
    output: DeleteOdbPeeringConnectionOutput,
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
 * Registers the Amazon Web Services Marketplace token for your Amazon Web Services account to activate your Oracle Database@Amazon Web Services subscription.
 */
export const acceptMarketplaceRegistration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptMarketplaceRegistrationInput,
    output: AcceptMarketplaceRegistrationOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates an Exadata infrastructure.
 */
export const createCloudExadataInfrastructure =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCloudExadataInfrastructureInput,
    output: CreateCloudExadataInfrastructureOutput,
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
 * Creates a VM cluster on the specified Exadata infrastructure.
 */
export const createCloudVmCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCloudVmClusterInput,
    output: CreateCloudVmClusterOutput,
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
 * Creates an ODB network.
 */
export const createOdbNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOdbNetworkInput,
  output: CreateOdbNetworkOutput,
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
 * Returns information about the specified VM cluster.
 */
export const getCloudVmCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCloudVmClusterInput,
  output: GetCloudVmClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the specified ODB network.
 */
export const getOdbNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOdbNetworkInput,
  output: GetOdbNetworkOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

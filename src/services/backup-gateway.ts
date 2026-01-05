import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Backup Gateway",
  serviceShapeName: "BackupOnPremises_v20210101",
});
const auth = T.AwsAuthSigv4({ name: "backup-gateway" });
const ver = T.ServiceVersion("2021-01-01");
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
                        url: "https://backup-gateway-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://backup-gateway-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://backup-gateway.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://backup-gateway.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { ResourceARN: S.String, TagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class CreateGatewayInput extends S.Class<CreateGatewayInput>(
  "CreateGatewayInput",
)(
  {
    ActivationKey: S.String,
    GatewayDisplayName: S.String,
    GatewayType: S.String,
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetGatewayInput extends S.Class<GetGatewayInput>(
  "GetGatewayInput",
)(
  { GatewayArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGatewayInformationInput extends S.Class<UpdateGatewayInformationInput>(
  "UpdateGatewayInformationInput",
)(
  { GatewayArn: S.String, GatewayDisplayName: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGatewayInput extends S.Class<DeleteGatewayInput>(
  "DeleteGatewayInput",
)(
  { GatewayArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGatewaysInput extends S.Class<ListGatewaysInput>(
  "ListGatewaysInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateGatewayToServerInput extends S.Class<AssociateGatewayToServerInput>(
  "AssociateGatewayToServerInput",
)(
  { GatewayArn: S.String, ServerArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateGatewayFromServerInput extends S.Class<DisassociateGatewayFromServerInput>(
  "DisassociateGatewayFromServerInput",
)(
  { GatewayArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutMaintenanceStartTimeInput extends S.Class<PutMaintenanceStartTimeInput>(
  "PutMaintenanceStartTimeInput",
)(
  {
    GatewayArn: S.String,
    HourOfDay: S.Number,
    MinuteOfHour: S.Number,
    DayOfWeek: S.optional(S.Number),
    DayOfMonth: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestHypervisorConfigurationInput extends S.Class<TestHypervisorConfigurationInput>(
  "TestHypervisorConfigurationInput",
)(
  {
    GatewayArn: S.String,
    Host: S.String,
    Username: S.optional(S.String),
    Password: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestHypervisorConfigurationOutput extends S.Class<TestHypervisorConfigurationOutput>(
  "TestHypervisorConfigurationOutput",
)({}) {}
export class UpdateGatewaySoftwareNowInput extends S.Class<UpdateGatewaySoftwareNowInput>(
  "UpdateGatewaySoftwareNowInput",
)(
  { GatewayArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBandwidthRateLimitScheduleInput extends S.Class<GetBandwidthRateLimitScheduleInput>(
  "GetBandwidthRateLimitScheduleInput",
)(
  { GatewayArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportHypervisorConfigurationInput extends S.Class<ImportHypervisorConfigurationInput>(
  "ImportHypervisorConfigurationInput",
)(
  {
    Name: S.String,
    Host: S.String,
    Username: S.optional(S.String),
    Password: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetHypervisorInput extends S.Class<GetHypervisorInput>(
  "GetHypervisorInput",
)(
  { HypervisorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateHypervisorInput extends S.Class<UpdateHypervisorInput>(
  "UpdateHypervisorInput",
)(
  {
    HypervisorArn: S.String,
    Host: S.optional(S.String),
    Username: S.optional(S.String),
    Password: S.optional(S.String),
    Name: S.optional(S.String),
    LogGroupArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHypervisorInput extends S.Class<DeleteHypervisorInput>(
  "DeleteHypervisorInput",
)(
  { HypervisorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListHypervisorsInput extends S.Class<ListHypervisorsInput>(
  "ListHypervisorsInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartVirtualMachinesMetadataSyncInput extends S.Class<StartVirtualMachinesMetadataSyncInput>(
  "StartVirtualMachinesMetadataSyncInput",
)(
  { HypervisorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetHypervisorPropertyMappingsInput extends S.Class<GetHypervisorPropertyMappingsInput>(
  "GetHypervisorPropertyMappingsInput",
)(
  { HypervisorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetVirtualMachineInput extends S.Class<GetVirtualMachineInput>(
  "GetVirtualMachineInput",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVirtualMachinesInput extends S.Class<ListVirtualMachinesInput>(
  "ListVirtualMachinesInput",
)(
  {
    HypervisorArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const DaysOfWeek = S.Array(S.Number);
export class BandwidthRateLimitInterval extends S.Class<BandwidthRateLimitInterval>(
  "BandwidthRateLimitInterval",
)({
  AverageUploadRateLimitInBitsPerSec: S.optional(S.Number),
  StartHourOfDay: S.Number,
  EndHourOfDay: S.Number,
  StartMinuteOfHour: S.Number,
  EndMinuteOfHour: S.Number,
  DaysOfWeek: DaysOfWeek,
}) {}
export const BandwidthRateLimitIntervals = S.Array(BandwidthRateLimitInterval);
export class VmwareToAwsTagMapping extends S.Class<VmwareToAwsTagMapping>(
  "VmwareToAwsTagMapping",
)({
  VmwareCategory: S.String,
  VmwareTagName: S.String,
  AwsTagKey: S.String,
  AwsTagValue: S.String,
}) {}
export const VmwareToAwsTagMappings = S.Array(VmwareToAwsTagMapping);
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ ResourceArn: S.optional(S.String), Tags: S.optional(Tags) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceARN: S.String, Tags: Tags },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({ ResourceARN: S.optional(S.String) }) {}
export class CreateGatewayOutput extends S.Class<CreateGatewayOutput>(
  "CreateGatewayOutput",
)({ GatewayArn: S.optional(S.String) }) {}
export class UpdateGatewayInformationOutput extends S.Class<UpdateGatewayInformationOutput>(
  "UpdateGatewayInformationOutput",
)({ GatewayArn: S.optional(S.String) }) {}
export class DeleteGatewayOutput extends S.Class<DeleteGatewayOutput>(
  "DeleteGatewayOutput",
)({ GatewayArn: S.optional(S.String) }) {}
export class AssociateGatewayToServerOutput extends S.Class<AssociateGatewayToServerOutput>(
  "AssociateGatewayToServerOutput",
)({ GatewayArn: S.optional(S.String) }) {}
export class DisassociateGatewayFromServerOutput extends S.Class<DisassociateGatewayFromServerOutput>(
  "DisassociateGatewayFromServerOutput",
)({ GatewayArn: S.optional(S.String) }) {}
export class PutMaintenanceStartTimeOutput extends S.Class<PutMaintenanceStartTimeOutput>(
  "PutMaintenanceStartTimeOutput",
)({ GatewayArn: S.optional(S.String) }) {}
export class UpdateGatewaySoftwareNowOutput extends S.Class<UpdateGatewaySoftwareNowOutput>(
  "UpdateGatewaySoftwareNowOutput",
)({ GatewayArn: S.optional(S.String) }) {}
export class PutBandwidthRateLimitScheduleInput extends S.Class<PutBandwidthRateLimitScheduleInput>(
  "PutBandwidthRateLimitScheduleInput",
)(
  {
    GatewayArn: S.String,
    BandwidthRateLimitIntervals: BandwidthRateLimitIntervals,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBandwidthRateLimitScheduleOutput extends S.Class<GetBandwidthRateLimitScheduleOutput>(
  "GetBandwidthRateLimitScheduleOutput",
)({
  GatewayArn: S.optional(S.String),
  BandwidthRateLimitIntervals: S.optional(BandwidthRateLimitIntervals),
}) {}
export class ImportHypervisorConfigurationOutput extends S.Class<ImportHypervisorConfigurationOutput>(
  "ImportHypervisorConfigurationOutput",
)({ HypervisorArn: S.optional(S.String) }) {}
export class UpdateHypervisorOutput extends S.Class<UpdateHypervisorOutput>(
  "UpdateHypervisorOutput",
)({ HypervisorArn: S.optional(S.String) }) {}
export class DeleteHypervisorOutput extends S.Class<DeleteHypervisorOutput>(
  "DeleteHypervisorOutput",
)({ HypervisorArn: S.optional(S.String) }) {}
export class StartVirtualMachinesMetadataSyncOutput extends S.Class<StartVirtualMachinesMetadataSyncOutput>(
  "StartVirtualMachinesMetadataSyncOutput",
)({ HypervisorArn: S.optional(S.String) }) {}
export class PutHypervisorPropertyMappingsInput extends S.Class<PutHypervisorPropertyMappingsInput>(
  "PutHypervisorPropertyMappingsInput",
)(
  {
    HypervisorArn: S.String,
    VmwareToAwsTagMappings: VmwareToAwsTagMappings,
    IamRoleArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetHypervisorPropertyMappingsOutput extends S.Class<GetHypervisorPropertyMappingsOutput>(
  "GetHypervisorPropertyMappingsOutput",
)({
  HypervisorArn: S.optional(S.String),
  VmwareToAwsTagMappings: S.optional(VmwareToAwsTagMappings),
  IamRoleArn: S.optional(S.String),
}) {}
export class Gateway extends S.Class<Gateway>("Gateway")({
  GatewayArn: S.optional(S.String),
  GatewayDisplayName: S.optional(S.String),
  GatewayType: S.optional(S.String),
  HypervisorId: S.optional(S.String),
  LastSeenTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const Gateways = S.Array(Gateway);
export class HypervisorDetails extends S.Class<HypervisorDetails>(
  "HypervisorDetails",
)({
  Host: S.optional(S.String),
  HypervisorArn: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  Name: S.optional(S.String),
  LogGroupArn: S.optional(S.String),
  State: S.optional(S.String),
  LastSuccessfulMetadataSyncTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LatestMetadataSyncStatusMessage: S.optional(S.String),
  LatestMetadataSyncStatus: S.optional(S.String),
}) {}
export class Hypervisor extends S.Class<Hypervisor>("Hypervisor")({
  Host: S.optional(S.String),
  HypervisorArn: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  Name: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const Hypervisors = S.Array(Hypervisor);
export class VirtualMachine extends S.Class<VirtualMachine>("VirtualMachine")({
  HostName: S.optional(S.String),
  HypervisorId: S.optional(S.String),
  Name: S.optional(S.String),
  Path: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  LastBackupDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const VirtualMachines = S.Array(VirtualMachine);
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({ ResourceARN: S.optional(S.String) }) {}
export class ListGatewaysOutput extends S.Class<ListGatewaysOutput>(
  "ListGatewaysOutput",
)({ Gateways: S.optional(Gateways), NextToken: S.optional(S.String) }) {}
export class PutBandwidthRateLimitScheduleOutput extends S.Class<PutBandwidthRateLimitScheduleOutput>(
  "PutBandwidthRateLimitScheduleOutput",
)({ GatewayArn: S.optional(S.String) }) {}
export class GetHypervisorOutput extends S.Class<GetHypervisorOutput>(
  "GetHypervisorOutput",
)({ Hypervisor: S.optional(HypervisorDetails) }) {}
export class ListHypervisorsOutput extends S.Class<ListHypervisorsOutput>(
  "ListHypervisorsOutput",
)({ Hypervisors: S.optional(Hypervisors), NextToken: S.optional(S.String) }) {}
export class PutHypervisorPropertyMappingsOutput extends S.Class<PutHypervisorPropertyMappingsOutput>(
  "PutHypervisorPropertyMappingsOutput",
)({ HypervisorArn: S.optional(S.String) }) {}
export class ListVirtualMachinesOutput extends S.Class<ListVirtualMachinesOutput>(
  "ListVirtualMachinesOutput",
)({
  VirtualMachines: S.optional(VirtualMachines),
  NextToken: S.optional(S.String),
}) {}
export class MaintenanceStartTime extends S.Class<MaintenanceStartTime>(
  "MaintenanceStartTime",
)({
  DayOfMonth: S.optional(S.Number),
  DayOfWeek: S.optional(S.Number),
  HourOfDay: S.Number,
  MinuteOfHour: S.Number,
}) {}
export class VmwareTag extends S.Class<VmwareTag>("VmwareTag")({
  VmwareCategory: S.optional(S.String),
  VmwareTagName: S.optional(S.String),
  VmwareTagDescription: S.optional(S.String),
}) {}
export const VmwareTags = S.Array(VmwareTag);
export class GatewayDetails extends S.Class<GatewayDetails>("GatewayDetails")({
  GatewayArn: S.optional(S.String),
  GatewayDisplayName: S.optional(S.String),
  GatewayType: S.optional(S.String),
  HypervisorId: S.optional(S.String),
  LastSeenTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MaintenanceStartTime: S.optional(MaintenanceStartTime),
  NextUpdateAvailabilityTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  VpcEndpoint: S.optional(S.String),
}) {}
export class VirtualMachineDetails extends S.Class<VirtualMachineDetails>(
  "VirtualMachineDetails",
)({
  HostName: S.optional(S.String),
  HypervisorId: S.optional(S.String),
  Name: S.optional(S.String),
  Path: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  LastBackupDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VmwareTags: S.optional(VmwareTags),
}) {}
export class GetGatewayOutput extends S.Class<GetGatewayOutput>(
  "GetGatewayOutput",
)({ Gateway: S.optional(GatewayDetails) }) {}
export class GetVirtualMachineOutput extends S.Class<GetVirtualMachineOutput>(
  "GetVirtualMachineOutput",
)({ VirtualMachine: S.optional(VirtualMachineDetails) }) {}

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Creates a backup gateway. After you create a gateway, you can associate it with a server
 * using the `AssociateGatewayToServer` operation.
 */
export const createGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGatewayInput,
  output: CreateGatewayOutput,
  errors: [],
}));
/**
 * Associates a backup gateway with your server. After you complete the association process,
 * you can back up and restore your VMs through the gateway.
 */
export const associateGatewayToServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateGatewayToServerInput,
    output: AssociateGatewayToServerOutput,
    errors: [ConflictException],
  }),
);
/**
 * Lists the tags applied to the resource identified by its Amazon Resource Name
 * (ARN).
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Tag the resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists backup gateways owned by an Amazon Web Services account in an Amazon Web Services Region. The returned list is ordered by gateway Amazon Resource Name (ARN).
 */
export const listGateways = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGatewaysInput,
    output: ListGatewaysOutput,
    errors: [],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Gateways",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This action sets the bandwidth rate limit schedule for a specified gateway.
 * By default, gateways do not have a bandwidth rate limit schedule, which means
 * no bandwidth rate limiting is in effect. Use this to initiate a
 * gateway's bandwidth rate limit schedule.
 */
export const putBandwidthRateLimitSchedule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutBandwidthRateLimitScheduleInput,
    output: PutBandwidthRateLimitScheduleOutput,
    errors: [ResourceNotFoundException],
  }));
/**
 * Connect to a hypervisor by importing its configuration.
 */
export const importHypervisorConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ImportHypervisorConfigurationInput,
    output: ImportHypervisorConfigurationOutput,
    errors: [AccessDeniedException, ConflictException],
  }));
/**
 * This action requests information about the specified hypervisor to which the gateway will connect.
 * A hypervisor is hardware, software, or firmware that creates and manages virtual machines,
 * and allocates resources to them.
 */
export const getHypervisor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHypervisorInput,
  output: GetHypervisorOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists your hypervisors.
 */
export const listHypervisors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListHypervisorsInput,
    output: ListHypervisorsOutput,
    errors: [],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Hypervisors",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This action sets the property mappings for the specified hypervisor.
 * A hypervisor property mapping displays the relationship of entity properties
 * available from the on-premises hypervisor to the properties available in Amazon Web Services.
 */
export const putHypervisorPropertyMappings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutHypervisorPropertyMappingsInput,
    output: PutHypervisorPropertyMappingsOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Lists your virtual machines.
 */
export const listVirtualMachines =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListVirtualMachinesInput,
    output: ListVirtualMachinesOutput,
    errors: [],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "VirtualMachines",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Removes tags from the resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes a backup gateway.
 */
export const deleteGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayInput,
  output: DeleteGatewayOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Tests your hypervisor configuration to validate that backup gateway can connect with the
 * hypervisor and its resources.
 */
export const testHypervisorConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TestHypervisorConfigurationInput,
    output: TestHypervisorConfigurationOutput,
    errors: [ConflictException, ResourceNotFoundException],
  }),
);
/**
 * Updates the gateway virtual machine (VM) software.
 * The request immediately triggers the software update.
 *
 * When you make this request, you get a `200 OK`
 * success response immediately. However, it might take some
 * time for the update to complete.
 */
export const updateGatewaySoftwareNow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGatewaySoftwareNowInput,
    output: UpdateGatewaySoftwareNowOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * Retrieves the bandwidth rate limit schedule for a specified gateway.
 * By default, gateways do not have bandwidth rate limit schedules, which means
 * no bandwidth rate limiting is in effect. Use this to get a gateway's
 * bandwidth rate limit schedule.
 */
export const getBandwidthRateLimitSchedule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetBandwidthRateLimitScheduleInput,
    output: GetBandwidthRateLimitScheduleOutput,
    errors: [ResourceNotFoundException],
  }));
/**
 * This action retrieves the property mappings for the specified hypervisor.
 * A hypervisor property mapping displays the relationship of entity properties
 * available from the on-premises hypervisor to the properties available in Amazon Web Services.
 */
export const getHypervisorPropertyMappings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetHypervisorPropertyMappingsInput,
    output: GetHypervisorPropertyMappingsOutput,
    errors: [ResourceNotFoundException],
  }));
/**
 * Updates a gateway's name. Specify which gateway to update using the Amazon Resource Name
 * (ARN) of the gateway in your request.
 */
export const updateGatewayInformation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGatewayInformationInput,
    output: UpdateGatewayInformationOutput,
    errors: [ConflictException, ResourceNotFoundException],
  }),
);
/**
 * Disassociates a backup gateway from the specified server. After the disassociation process
 * finishes, the gateway can no longer access the virtual machines on the server.
 */
export const disassociateGatewayFromServer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateGatewayFromServerInput,
    output: DisassociateGatewayFromServerOutput,
    errors: [ConflictException, ResourceNotFoundException],
  }));
/**
 * Set the maintenance start time for a gateway.
 */
export const putMaintenanceStartTime = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutMaintenanceStartTimeInput,
    output: PutMaintenanceStartTimeOutput,
    errors: [ConflictException, ResourceNotFoundException],
  }),
);
/**
 * Updates a hypervisor metadata, including its host, username, and password. Specify which
 * hypervisor to update using the Amazon Resource Name (ARN) of the hypervisor in your
 * request.
 */
export const updateHypervisor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHypervisorInput,
  output: UpdateHypervisorOutput,
  errors: [AccessDeniedException, ConflictException, ResourceNotFoundException],
}));
/**
 * Deletes a hypervisor.
 */
export const deleteHypervisor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHypervisorInput,
  output: DeleteHypervisorOutput,
  errors: [AccessDeniedException, ConflictException, ResourceNotFoundException],
}));
/**
 * This action sends a request to sync metadata across the specified virtual machines.
 */
export const startVirtualMachinesMetadataSync =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartVirtualMachinesMetadataSyncInput,
    output: StartVirtualMachinesMetadataSyncOutput,
    errors: [AccessDeniedException, ResourceNotFoundException],
  }));
/**
 * By providing the ARN (Amazon Resource Name), this
 * API returns the gateway.
 */
export const getGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGatewayInput,
  output: GetGatewayOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * By providing the ARN (Amazon Resource Name), this API returns the virtual machine.
 */
export const getVirtualMachine = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVirtualMachineInput,
  output: GetVirtualMachineOutput,
  errors: [ResourceNotFoundException],
}));

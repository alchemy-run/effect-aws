import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Backup Gateway",
  serviceShapeName: "BackupOnPremises_v20210101",
});
const auth = T.AwsAuthSigv4({ name: "backup-gateway" });
const ver = T.ServiceVersion("2021-01-01");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://backup-gateway-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://backup-gateway-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://backup-gateway.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://backup-gateway.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceArn = string;
export type TagKey = string;
export type ActivationKey = string;
export type Name = string;
export type GatewayType = string;
export type GatewayArn = string;
export type MaxResults = number;
export type NextToken = string;
export type ServerArn = string;
export type HourOfDay = number;
export type MinuteOfHour = number;
export type DayOfWeek = number;
export type DayOfMonth = number;
export type Host = string;
export type Username = string | Redacted.Redacted<string>;
export type Password = string | Redacted.Redacted<string>;
export type KmsKeyArn = string;
export type LogGroupArn = string;
export type IamRoleArn = string;
export type TagValue = string;
export type AverageUploadRateLimit = number;
export type VmwareCategory = string;
export type VmwareTagName = string;
export type HypervisorId = string;
export type VpcEndpoint = string;
export type HypervisorState = string;
export type SyncMetadataStatus = string;
export type Path = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface ListTagsForResourceInput {
  ResourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface UntagResourceInput {
  ResourceARN: string;
  TagKeys: TagKeys;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateGatewayInput {
  ActivationKey: string;
  GatewayDisplayName: string;
  GatewayType: string;
  Tags?: Tags;
}
export const CreateGatewayInput = S.suspend(() =>
  S.Struct({
    ActivationKey: S.String,
    GatewayDisplayName: S.String,
    GatewayType: S.String,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateGatewayInput",
}) as any as S.Schema<CreateGatewayInput>;
export interface GetGatewayInput {
  GatewayArn: string;
}
export const GetGatewayInput = S.suspend(() =>
  S.Struct({ GatewayArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetGatewayInput",
}) as any as S.Schema<GetGatewayInput>;
export interface UpdateGatewayInformationInput {
  GatewayArn: string;
  GatewayDisplayName?: string;
}
export const UpdateGatewayInformationInput = S.suspend(() =>
  S.Struct({
    GatewayArn: S.String,
    GatewayDisplayName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateGatewayInformationInput",
}) as any as S.Schema<UpdateGatewayInformationInput>;
export interface DeleteGatewayInput {
  GatewayArn: string;
}
export const DeleteGatewayInput = S.suspend(() =>
  S.Struct({ GatewayArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteGatewayInput",
}) as any as S.Schema<DeleteGatewayInput>;
export interface ListGatewaysInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListGatewaysInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListGatewaysInput",
}) as any as S.Schema<ListGatewaysInput>;
export interface AssociateGatewayToServerInput {
  GatewayArn: string;
  ServerArn: string;
}
export const AssociateGatewayToServerInput = S.suspend(() =>
  S.Struct({ GatewayArn: S.String, ServerArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateGatewayToServerInput",
}) as any as S.Schema<AssociateGatewayToServerInput>;
export interface DisassociateGatewayFromServerInput {
  GatewayArn: string;
}
export const DisassociateGatewayFromServerInput = S.suspend(() =>
  S.Struct({ GatewayArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateGatewayFromServerInput",
}) as any as S.Schema<DisassociateGatewayFromServerInput>;
export interface PutMaintenanceStartTimeInput {
  GatewayArn: string;
  HourOfDay: number;
  MinuteOfHour: number;
  DayOfWeek?: number;
  DayOfMonth?: number;
}
export const PutMaintenanceStartTimeInput = S.suspend(() =>
  S.Struct({
    GatewayArn: S.String,
    HourOfDay: S.Number,
    MinuteOfHour: S.Number,
    DayOfWeek: S.optional(S.Number),
    DayOfMonth: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutMaintenanceStartTimeInput",
}) as any as S.Schema<PutMaintenanceStartTimeInput>;
export interface TestHypervisorConfigurationInput {
  GatewayArn: string;
  Host: string;
  Username?: string | Redacted.Redacted<string>;
  Password?: string | Redacted.Redacted<string>;
}
export const TestHypervisorConfigurationInput = S.suspend(() =>
  S.Struct({
    GatewayArn: S.String,
    Host: S.String,
    Username: S.optional(SensitiveString),
    Password: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TestHypervisorConfigurationInput",
}) as any as S.Schema<TestHypervisorConfigurationInput>;
export interface TestHypervisorConfigurationOutput {}
export const TestHypervisorConfigurationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "TestHypervisorConfigurationOutput",
}) as any as S.Schema<TestHypervisorConfigurationOutput>;
export interface UpdateGatewaySoftwareNowInput {
  GatewayArn: string;
}
export const UpdateGatewaySoftwareNowInput = S.suspend(() =>
  S.Struct({ GatewayArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateGatewaySoftwareNowInput",
}) as any as S.Schema<UpdateGatewaySoftwareNowInput>;
export interface GetBandwidthRateLimitScheduleInput {
  GatewayArn: string;
}
export const GetBandwidthRateLimitScheduleInput = S.suspend(() =>
  S.Struct({ GatewayArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetBandwidthRateLimitScheduleInput",
}) as any as S.Schema<GetBandwidthRateLimitScheduleInput>;
export interface ImportHypervisorConfigurationInput {
  Name: string;
  Host: string;
  Username?: string | Redacted.Redacted<string>;
  Password?: string | Redacted.Redacted<string>;
  KmsKeyArn?: string;
  Tags?: Tags;
}
export const ImportHypervisorConfigurationInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Host: S.String,
    Username: S.optional(SensitiveString),
    Password: S.optional(SensitiveString),
    KmsKeyArn: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportHypervisorConfigurationInput",
}) as any as S.Schema<ImportHypervisorConfigurationInput>;
export interface GetHypervisorInput {
  HypervisorArn: string;
}
export const GetHypervisorInput = S.suspend(() =>
  S.Struct({ HypervisorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetHypervisorInput",
}) as any as S.Schema<GetHypervisorInput>;
export interface UpdateHypervisorInput {
  HypervisorArn: string;
  Host?: string;
  Username?: string | Redacted.Redacted<string>;
  Password?: string | Redacted.Redacted<string>;
  Name?: string;
  LogGroupArn?: string;
}
export const UpdateHypervisorInput = S.suspend(() =>
  S.Struct({
    HypervisorArn: S.String,
    Host: S.optional(S.String),
    Username: S.optional(SensitiveString),
    Password: S.optional(SensitiveString),
    Name: S.optional(S.String),
    LogGroupArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateHypervisorInput",
}) as any as S.Schema<UpdateHypervisorInput>;
export interface DeleteHypervisorInput {
  HypervisorArn: string;
}
export const DeleteHypervisorInput = S.suspend(() =>
  S.Struct({ HypervisorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteHypervisorInput",
}) as any as S.Schema<DeleteHypervisorInput>;
export interface ListHypervisorsInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListHypervisorsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListHypervisorsInput",
}) as any as S.Schema<ListHypervisorsInput>;
export interface StartVirtualMachinesMetadataSyncInput {
  HypervisorArn: string;
}
export const StartVirtualMachinesMetadataSyncInput = S.suspend(() =>
  S.Struct({ HypervisorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartVirtualMachinesMetadataSyncInput",
}) as any as S.Schema<StartVirtualMachinesMetadataSyncInput>;
export interface GetHypervisorPropertyMappingsInput {
  HypervisorArn: string;
}
export const GetHypervisorPropertyMappingsInput = S.suspend(() =>
  S.Struct({ HypervisorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetHypervisorPropertyMappingsInput",
}) as any as S.Schema<GetHypervisorPropertyMappingsInput>;
export interface GetVirtualMachineInput {
  ResourceArn: string;
}
export const GetVirtualMachineInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetVirtualMachineInput",
}) as any as S.Schema<GetVirtualMachineInput>;
export interface ListVirtualMachinesInput {
  HypervisorArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListVirtualMachinesInput = S.suspend(() =>
  S.Struct({
    HypervisorArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListVirtualMachinesInput",
}) as any as S.Schema<ListVirtualMachinesInput>;
export type DaysOfWeek = number[];
export const DaysOfWeek = S.Array(S.Number);
export interface BandwidthRateLimitInterval {
  AverageUploadRateLimitInBitsPerSec?: number;
  StartHourOfDay: number;
  EndHourOfDay: number;
  StartMinuteOfHour: number;
  EndMinuteOfHour: number;
  DaysOfWeek: DaysOfWeek;
}
export const BandwidthRateLimitInterval = S.suspend(() =>
  S.Struct({
    AverageUploadRateLimitInBitsPerSec: S.optional(S.Number),
    StartHourOfDay: S.Number,
    EndHourOfDay: S.Number,
    StartMinuteOfHour: S.Number,
    EndMinuteOfHour: S.Number,
    DaysOfWeek: DaysOfWeek,
  }),
).annotations({
  identifier: "BandwidthRateLimitInterval",
}) as any as S.Schema<BandwidthRateLimitInterval>;
export type BandwidthRateLimitIntervals = BandwidthRateLimitInterval[];
export const BandwidthRateLimitIntervals = S.Array(BandwidthRateLimitInterval);
export interface VmwareToAwsTagMapping {
  VmwareCategory: string;
  VmwareTagName: string;
  AwsTagKey: string;
  AwsTagValue: string;
}
export const VmwareToAwsTagMapping = S.suspend(() =>
  S.Struct({
    VmwareCategory: S.String,
    VmwareTagName: S.String,
    AwsTagKey: S.String,
    AwsTagValue: S.String,
  }),
).annotations({
  identifier: "VmwareToAwsTagMapping",
}) as any as S.Schema<VmwareToAwsTagMapping>;
export type VmwareToAwsTagMappings = VmwareToAwsTagMapping[];
export const VmwareToAwsTagMappings = S.Array(VmwareToAwsTagMapping);
export interface ListTagsForResourceOutput {
  ResourceArn?: string;
  Tags?: Tags;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String), Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  ResourceARN: string;
  Tags: Tags;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: Tags }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface UntagResourceOutput {
  ResourceARN?: string;
}
export const UntagResourceOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.optional(S.String) }),
).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface CreateGatewayOutput {
  GatewayArn?: string;
}
export const CreateGatewayOutput = S.suspend(() =>
  S.Struct({ GatewayArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateGatewayOutput",
}) as any as S.Schema<CreateGatewayOutput>;
export interface UpdateGatewayInformationOutput {
  GatewayArn?: string;
}
export const UpdateGatewayInformationOutput = S.suspend(() =>
  S.Struct({ GatewayArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateGatewayInformationOutput",
}) as any as S.Schema<UpdateGatewayInformationOutput>;
export interface DeleteGatewayOutput {
  GatewayArn?: string;
}
export const DeleteGatewayOutput = S.suspend(() =>
  S.Struct({ GatewayArn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteGatewayOutput",
}) as any as S.Schema<DeleteGatewayOutput>;
export interface AssociateGatewayToServerOutput {
  GatewayArn?: string;
}
export const AssociateGatewayToServerOutput = S.suspend(() =>
  S.Struct({ GatewayArn: S.optional(S.String) }),
).annotations({
  identifier: "AssociateGatewayToServerOutput",
}) as any as S.Schema<AssociateGatewayToServerOutput>;
export interface DisassociateGatewayFromServerOutput {
  GatewayArn?: string;
}
export const DisassociateGatewayFromServerOutput = S.suspend(() =>
  S.Struct({ GatewayArn: S.optional(S.String) }),
).annotations({
  identifier: "DisassociateGatewayFromServerOutput",
}) as any as S.Schema<DisassociateGatewayFromServerOutput>;
export interface PutMaintenanceStartTimeOutput {
  GatewayArn?: string;
}
export const PutMaintenanceStartTimeOutput = S.suspend(() =>
  S.Struct({ GatewayArn: S.optional(S.String) }),
).annotations({
  identifier: "PutMaintenanceStartTimeOutput",
}) as any as S.Schema<PutMaintenanceStartTimeOutput>;
export interface UpdateGatewaySoftwareNowOutput {
  GatewayArn?: string;
}
export const UpdateGatewaySoftwareNowOutput = S.suspend(() =>
  S.Struct({ GatewayArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateGatewaySoftwareNowOutput",
}) as any as S.Schema<UpdateGatewaySoftwareNowOutput>;
export interface PutBandwidthRateLimitScheduleInput {
  GatewayArn: string;
  BandwidthRateLimitIntervals: BandwidthRateLimitIntervals;
}
export const PutBandwidthRateLimitScheduleInput = S.suspend(() =>
  S.Struct({
    GatewayArn: S.String,
    BandwidthRateLimitIntervals: BandwidthRateLimitIntervals,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutBandwidthRateLimitScheduleInput",
}) as any as S.Schema<PutBandwidthRateLimitScheduleInput>;
export interface GetBandwidthRateLimitScheduleOutput {
  GatewayArn?: string;
  BandwidthRateLimitIntervals?: BandwidthRateLimitIntervals;
}
export const GetBandwidthRateLimitScheduleOutput = S.suspend(() =>
  S.Struct({
    GatewayArn: S.optional(S.String),
    BandwidthRateLimitIntervals: S.optional(BandwidthRateLimitIntervals),
  }),
).annotations({
  identifier: "GetBandwidthRateLimitScheduleOutput",
}) as any as S.Schema<GetBandwidthRateLimitScheduleOutput>;
export interface ImportHypervisorConfigurationOutput {
  HypervisorArn?: string;
}
export const ImportHypervisorConfigurationOutput = S.suspend(() =>
  S.Struct({ HypervisorArn: S.optional(S.String) }),
).annotations({
  identifier: "ImportHypervisorConfigurationOutput",
}) as any as S.Schema<ImportHypervisorConfigurationOutput>;
export interface UpdateHypervisorOutput {
  HypervisorArn?: string;
}
export const UpdateHypervisorOutput = S.suspend(() =>
  S.Struct({ HypervisorArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateHypervisorOutput",
}) as any as S.Schema<UpdateHypervisorOutput>;
export interface DeleteHypervisorOutput {
  HypervisorArn?: string;
}
export const DeleteHypervisorOutput = S.suspend(() =>
  S.Struct({ HypervisorArn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteHypervisorOutput",
}) as any as S.Schema<DeleteHypervisorOutput>;
export interface StartVirtualMachinesMetadataSyncOutput {
  HypervisorArn?: string;
}
export const StartVirtualMachinesMetadataSyncOutput = S.suspend(() =>
  S.Struct({ HypervisorArn: S.optional(S.String) }),
).annotations({
  identifier: "StartVirtualMachinesMetadataSyncOutput",
}) as any as S.Schema<StartVirtualMachinesMetadataSyncOutput>;
export interface PutHypervisorPropertyMappingsInput {
  HypervisorArn: string;
  VmwareToAwsTagMappings: VmwareToAwsTagMappings;
  IamRoleArn: string;
}
export const PutHypervisorPropertyMappingsInput = S.suspend(() =>
  S.Struct({
    HypervisorArn: S.String,
    VmwareToAwsTagMappings: VmwareToAwsTagMappings,
    IamRoleArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutHypervisorPropertyMappingsInput",
}) as any as S.Schema<PutHypervisorPropertyMappingsInput>;
export interface GetHypervisorPropertyMappingsOutput {
  HypervisorArn?: string;
  VmwareToAwsTagMappings?: VmwareToAwsTagMappings;
  IamRoleArn?: string;
}
export const GetHypervisorPropertyMappingsOutput = S.suspend(() =>
  S.Struct({
    HypervisorArn: S.optional(S.String),
    VmwareToAwsTagMappings: S.optional(VmwareToAwsTagMappings),
    IamRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetHypervisorPropertyMappingsOutput",
}) as any as S.Schema<GetHypervisorPropertyMappingsOutput>;
export interface Gateway {
  GatewayArn?: string;
  GatewayDisplayName?: string;
  GatewayType?: string;
  HypervisorId?: string;
  LastSeenTime?: Date;
}
export const Gateway = S.suspend(() =>
  S.Struct({
    GatewayArn: S.optional(S.String),
    GatewayDisplayName: S.optional(S.String),
    GatewayType: S.optional(S.String),
    HypervisorId: S.optional(S.String),
    LastSeenTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Gateway" }) as any as S.Schema<Gateway>;
export type Gateways = Gateway[];
export const Gateways = S.Array(Gateway);
export interface HypervisorDetails {
  Host?: string;
  HypervisorArn?: string;
  KmsKeyArn?: string;
  Name?: string;
  LogGroupArn?: string;
  State?: string;
  LastSuccessfulMetadataSyncTime?: Date;
  LatestMetadataSyncStatusMessage?: string;
  LatestMetadataSyncStatus?: string;
}
export const HypervisorDetails = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "HypervisorDetails",
}) as any as S.Schema<HypervisorDetails>;
export interface Hypervisor {
  Host?: string;
  HypervisorArn?: string;
  KmsKeyArn?: string;
  Name?: string;
  State?: string;
}
export const Hypervisor = S.suspend(() =>
  S.Struct({
    Host: S.optional(S.String),
    HypervisorArn: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    Name: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({ identifier: "Hypervisor" }) as any as S.Schema<Hypervisor>;
export type Hypervisors = Hypervisor[];
export const Hypervisors = S.Array(Hypervisor);
export interface VirtualMachine {
  HostName?: string;
  HypervisorId?: string;
  Name?: string;
  Path?: string;
  ResourceArn?: string;
  LastBackupDate?: Date;
}
export const VirtualMachine = S.suspend(() =>
  S.Struct({
    HostName: S.optional(S.String),
    HypervisorId: S.optional(S.String),
    Name: S.optional(S.String),
    Path: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    LastBackupDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "VirtualMachine",
}) as any as S.Schema<VirtualMachine>;
export type VirtualMachines = VirtualMachine[];
export const VirtualMachines = S.Array(VirtualMachine);
export interface TagResourceOutput {
  ResourceARN?: string;
}
export const TagResourceOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.optional(S.String) }),
).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface ListGatewaysOutput {
  Gateways?: Gateways;
  NextToken?: string;
}
export const ListGatewaysOutput = S.suspend(() =>
  S.Struct({ Gateways: S.optional(Gateways), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListGatewaysOutput",
}) as any as S.Schema<ListGatewaysOutput>;
export interface PutBandwidthRateLimitScheduleOutput {
  GatewayArn?: string;
}
export const PutBandwidthRateLimitScheduleOutput = S.suspend(() =>
  S.Struct({ GatewayArn: S.optional(S.String) }),
).annotations({
  identifier: "PutBandwidthRateLimitScheduleOutput",
}) as any as S.Schema<PutBandwidthRateLimitScheduleOutput>;
export interface GetHypervisorOutput {
  Hypervisor?: HypervisorDetails;
}
export const GetHypervisorOutput = S.suspend(() =>
  S.Struct({ Hypervisor: S.optional(HypervisorDetails) }),
).annotations({
  identifier: "GetHypervisorOutput",
}) as any as S.Schema<GetHypervisorOutput>;
export interface ListHypervisorsOutput {
  Hypervisors?: Hypervisors;
  NextToken?: string;
}
export const ListHypervisorsOutput = S.suspend(() =>
  S.Struct({
    Hypervisors: S.optional(Hypervisors),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListHypervisorsOutput",
}) as any as S.Schema<ListHypervisorsOutput>;
export interface PutHypervisorPropertyMappingsOutput {
  HypervisorArn?: string;
}
export const PutHypervisorPropertyMappingsOutput = S.suspend(() =>
  S.Struct({ HypervisorArn: S.optional(S.String) }),
).annotations({
  identifier: "PutHypervisorPropertyMappingsOutput",
}) as any as S.Schema<PutHypervisorPropertyMappingsOutput>;
export interface ListVirtualMachinesOutput {
  VirtualMachines?: VirtualMachines;
  NextToken?: string;
}
export const ListVirtualMachinesOutput = S.suspend(() =>
  S.Struct({
    VirtualMachines: S.optional(VirtualMachines),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVirtualMachinesOutput",
}) as any as S.Schema<ListVirtualMachinesOutput>;
export interface MaintenanceStartTime {
  DayOfMonth?: number;
  DayOfWeek?: number;
  HourOfDay: number;
  MinuteOfHour: number;
}
export const MaintenanceStartTime = S.suspend(() =>
  S.Struct({
    DayOfMonth: S.optional(S.Number),
    DayOfWeek: S.optional(S.Number),
    HourOfDay: S.Number,
    MinuteOfHour: S.Number,
  }),
).annotations({
  identifier: "MaintenanceStartTime",
}) as any as S.Schema<MaintenanceStartTime>;
export interface VmwareTag {
  VmwareCategory?: string;
  VmwareTagName?: string;
  VmwareTagDescription?: string;
}
export const VmwareTag = S.suspend(() =>
  S.Struct({
    VmwareCategory: S.optional(S.String),
    VmwareTagName: S.optional(S.String),
    VmwareTagDescription: S.optional(S.String),
  }),
).annotations({ identifier: "VmwareTag" }) as any as S.Schema<VmwareTag>;
export type VmwareTags = VmwareTag[];
export const VmwareTags = S.Array(VmwareTag);
export interface GatewayDetails {
  GatewayArn?: string;
  GatewayDisplayName?: string;
  GatewayType?: string;
  HypervisorId?: string;
  LastSeenTime?: Date;
  MaintenanceStartTime?: MaintenanceStartTime;
  NextUpdateAvailabilityTime?: Date;
  VpcEndpoint?: string;
}
export const GatewayDetails = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GatewayDetails",
}) as any as S.Schema<GatewayDetails>;
export interface VirtualMachineDetails {
  HostName?: string;
  HypervisorId?: string;
  Name?: string;
  Path?: string;
  ResourceArn?: string;
  LastBackupDate?: Date;
  VmwareTags?: VmwareTags;
}
export const VirtualMachineDetails = S.suspend(() =>
  S.Struct({
    HostName: S.optional(S.String),
    HypervisorId: S.optional(S.String),
    Name: S.optional(S.String),
    Path: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    LastBackupDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    VmwareTags: S.optional(VmwareTags),
  }),
).annotations({
  identifier: "VirtualMachineDetails",
}) as any as S.Schema<VirtualMachineDetails>;
export interface GetGatewayOutput {
  Gateway?: GatewayDetails;
}
export const GetGatewayOutput = S.suspend(() =>
  S.Struct({ Gateway: S.optional(GatewayDetails) }),
).annotations({
  identifier: "GetGatewayOutput",
}) as any as S.Schema<GetGatewayOutput>;
export interface GetVirtualMachineOutput {
  VirtualMachine?: VirtualMachineDetails;
}
export const GetVirtualMachineOutput = S.suspend(() =>
  S.Struct({ VirtualMachine: S.optional(VirtualMachineDetails) }),
).annotations({
  identifier: "GetVirtualMachineOutput",
}) as any as S.Schema<GetVirtualMachineOutput>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Creates a backup gateway. After you create a gateway, you can associate it with a server
 * using the `AssociateGatewayToServer` operation.
 */
export const createGateway: (
  input: CreateGatewayInput,
) => Effect.Effect<
  CreateGatewayOutput,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGatewayInput,
  output: CreateGatewayOutput,
  errors: [],
}));
/**
 * Associates a backup gateway with your server. After you complete the association process,
 * you can back up and restore your VMs through the gateway.
 */
export const associateGatewayToServer: (
  input: AssociateGatewayToServerInput,
) => Effect.Effect<
  AssociateGatewayToServerOutput,
  ConflictException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateGatewayToServerInput,
  output: AssociateGatewayToServerOutput,
  errors: [ConflictException],
}));
/**
 * Lists the tags applied to the resource identified by its Amazon Resource Name
 * (ARN).
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Tag the resource.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists backup gateways owned by an Amazon Web Services account in an Amazon Web Services Region. The returned list is ordered by gateway Amazon Resource Name (ARN).
 */
export const listGateways: {
  (
    input: ListGatewaysInput,
  ): Effect.Effect<
    ListGatewaysOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGatewaysInput,
  ) => Stream.Stream<
    ListGatewaysOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGatewaysInput,
  ) => Stream.Stream<
    Gateway,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGatewaysInput,
  output: ListGatewaysOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Gateways",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This action sets the bandwidth rate limit schedule for a specified gateway.
 * By default, gateways do not have a bandwidth rate limit schedule, which means
 * no bandwidth rate limiting is in effect. Use this to initiate a
 * gateway's bandwidth rate limit schedule.
 */
export const putBandwidthRateLimitSchedule: (
  input: PutBandwidthRateLimitScheduleInput,
) => Effect.Effect<
  PutBandwidthRateLimitScheduleOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBandwidthRateLimitScheduleInput,
  output: PutBandwidthRateLimitScheduleOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Connect to a hypervisor by importing its configuration.
 */
export const importHypervisorConfiguration: (
  input: ImportHypervisorConfigurationInput,
) => Effect.Effect<
  ImportHypervisorConfigurationOutput,
  AccessDeniedException | ConflictException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportHypervisorConfigurationInput,
  output: ImportHypervisorConfigurationOutput,
  errors: [AccessDeniedException, ConflictException],
}));
/**
 * This action requests information about the specified hypervisor to which the gateway will connect.
 * A hypervisor is hardware, software, or firmware that creates and manages virtual machines,
 * and allocates resources to them.
 */
export const getHypervisor: (
  input: GetHypervisorInput,
) => Effect.Effect<
  GetHypervisorOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHypervisorInput,
  output: GetHypervisorOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists your hypervisors.
 */
export const listHypervisors: {
  (
    input: ListHypervisorsInput,
  ): Effect.Effect<
    ListHypervisorsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHypervisorsInput,
  ) => Stream.Stream<
    ListHypervisorsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHypervisorsInput,
  ) => Stream.Stream<
    Hypervisor,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHypervisorsInput,
  output: ListHypervisorsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Hypervisors",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This action sets the property mappings for the specified hypervisor.
 * A hypervisor property mapping displays the relationship of entity properties
 * available from the on-premises hypervisor to the properties available in Amazon Web Services.
 */
export const putHypervisorPropertyMappings: (
  input: PutHypervisorPropertyMappingsInput,
) => Effect.Effect<
  PutHypervisorPropertyMappingsOutput,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutHypervisorPropertyMappingsInput,
  output: PutHypervisorPropertyMappingsOutput,
  errors: [AccessDeniedException, ConflictException, ResourceNotFoundException],
}));
/**
 * Lists your virtual machines.
 */
export const listVirtualMachines: {
  (
    input: ListVirtualMachinesInput,
  ): Effect.Effect<
    ListVirtualMachinesOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVirtualMachinesInput,
  ) => Stream.Stream<
    ListVirtualMachinesOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVirtualMachinesInput,
  ) => Stream.Stream<
    VirtualMachine,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes a backup gateway.
 */
export const deleteGateway: (
  input: DeleteGatewayInput,
) => Effect.Effect<
  DeleteGatewayOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayInput,
  output: DeleteGatewayOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Tests your hypervisor configuration to validate that backup gateway can connect with the
 * hypervisor and its resources.
 */
export const testHypervisorConfiguration: (
  input: TestHypervisorConfigurationInput,
) => Effect.Effect<
  TestHypervisorConfigurationOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestHypervisorConfigurationInput,
  output: TestHypervisorConfigurationOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Updates the gateway virtual machine (VM) software.
 * The request immediately triggers the software update.
 *
 * When you make this request, you get a `200 OK`
 * success response immediately. However, it might take some
 * time for the update to complete.
 */
export const updateGatewaySoftwareNow: (
  input: UpdateGatewaySoftwareNowInput,
) => Effect.Effect<
  UpdateGatewaySoftwareNowOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewaySoftwareNowInput,
  output: UpdateGatewaySoftwareNowOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves the bandwidth rate limit schedule for a specified gateway.
 * By default, gateways do not have bandwidth rate limit schedules, which means
 * no bandwidth rate limiting is in effect. Use this to get a gateway's
 * bandwidth rate limit schedule.
 */
export const getBandwidthRateLimitSchedule: (
  input: GetBandwidthRateLimitScheduleInput,
) => Effect.Effect<
  GetBandwidthRateLimitScheduleOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBandwidthRateLimitScheduleInput,
  output: GetBandwidthRateLimitScheduleOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * This action retrieves the property mappings for the specified hypervisor.
 * A hypervisor property mapping displays the relationship of entity properties
 * available from the on-premises hypervisor to the properties available in Amazon Web Services.
 */
export const getHypervisorPropertyMappings: (
  input: GetHypervisorPropertyMappingsInput,
) => Effect.Effect<
  GetHypervisorPropertyMappingsOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHypervisorPropertyMappingsInput,
  output: GetHypervisorPropertyMappingsOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Updates a gateway's name. Specify which gateway to update using the Amazon Resource Name
 * (ARN) of the gateway in your request.
 */
export const updateGatewayInformation: (
  input: UpdateGatewayInformationInput,
) => Effect.Effect<
  UpdateGatewayInformationOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayInformationInput,
  output: UpdateGatewayInformationOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Disassociates a backup gateway from the specified server. After the disassociation process
 * finishes, the gateway can no longer access the virtual machines on the server.
 */
export const disassociateGatewayFromServer: (
  input: DisassociateGatewayFromServerInput,
) => Effect.Effect<
  DisassociateGatewayFromServerOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateGatewayFromServerInput,
  output: DisassociateGatewayFromServerOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Set the maintenance start time for a gateway.
 */
export const putMaintenanceStartTime: (
  input: PutMaintenanceStartTimeInput,
) => Effect.Effect<
  PutMaintenanceStartTimeOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMaintenanceStartTimeInput,
  output: PutMaintenanceStartTimeOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Updates a hypervisor metadata, including its host, username, and password. Specify which
 * hypervisor to update using the Amazon Resource Name (ARN) of the hypervisor in your
 * request.
 */
export const updateHypervisor: (
  input: UpdateHypervisorInput,
) => Effect.Effect<
  UpdateHypervisorOutput,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHypervisorInput,
  output: UpdateHypervisorOutput,
  errors: [AccessDeniedException, ConflictException, ResourceNotFoundException],
}));
/**
 * Deletes a hypervisor.
 */
export const deleteHypervisor: (
  input: DeleteHypervisorInput,
) => Effect.Effect<
  DeleteHypervisorOutput,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHypervisorInput,
  output: DeleteHypervisorOutput,
  errors: [AccessDeniedException, ConflictException, ResourceNotFoundException],
}));
/**
 * This action sends a request to sync metadata across the specified virtual machines.
 */
export const startVirtualMachinesMetadataSync: (
  input: StartVirtualMachinesMetadataSyncInput,
) => Effect.Effect<
  StartVirtualMachinesMetadataSyncOutput,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartVirtualMachinesMetadataSyncInput,
  output: StartVirtualMachinesMetadataSyncOutput,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * By providing the ARN (Amazon Resource Name), this
 * API returns the gateway.
 */
export const getGateway: (
  input: GetGatewayInput,
) => Effect.Effect<
  GetGatewayOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGatewayInput,
  output: GetGatewayOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * By providing the ARN (Amazon Resource Name), this API returns the virtual machine.
 */
export const getVirtualMachine: (
  input: GetVirtualMachineInput,
) => Effect.Effect<
  GetVirtualMachineOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVirtualMachineInput,
  output: GetVirtualMachineOutput,
  errors: [ResourceNotFoundException],
}));

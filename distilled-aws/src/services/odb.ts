import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({ sdkId: "odb", serviceShapeName: "Odb" });
const auth = T.AwsAuthSigv4({ name: "odb" });
const ver = T.ServiceVersion("2024-08-20");
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
              `https://odb-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://odb-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://odb.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://odb.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type RoleArn = string;
export type Arn = string;
export type ResourceArn = string;
export type TagKey = string;
export type ResourceIdOrArn = string;
export type ResourceDisplayName = string;
export type GeneralInputString = string;
export type ResourceId = string;
export type PolicyDocument = string;
export type PeeredCidr = string;
export type TagValue = string;
export type SensitiveString = string | redacted.Redacted<string>;

//# Schemas
export interface GetOciOnboardingStatusInput {}
export const GetOciOnboardingStatusInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetOciOnboardingStatusInput",
}) as any as S.Schema<GetOciOnboardingStatusInput>;
export type SupportedAwsIntegration = "KmsTde" | (string & {});
export const SupportedAwsIntegration = S.String;
export type OciOnboardingStatus =
  | "NOT_STARTED"
  | "PENDING_LINK_GENERATION"
  | "PENDING_CUSTOMER_ACTION"
  | "PENDING_INITIALIZATION"
  | "ACTIVATING"
  | "ACTIVE_IN_HOME_REGION"
  | "ACTIVE"
  | "ACTIVE_LIMITED"
  | "FAILED"
  | "PUBLIC_OFFER_UNSUPPORTED"
  | "SUSPENDED"
  | "CANCELED"
  | (string & {});
export const OciOnboardingStatus = S.String;
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type LicenseModel =
  | "BRING_YOUR_OWN_LICENSE"
  | "LICENSE_INCLUDED"
  | (string & {});
export const LicenseModel = S.String;
export type Access = "ENABLED" | "DISABLED" | (string & {});
export const Access = S.String;
export type PeeredCidrList = string[];
export const PeeredCidrList = S.Array(S.String);
export interface AcceptMarketplaceRegistrationInput {
  marketplaceRegistrationToken: string;
}
export const AcceptMarketplaceRegistrationInput = S.suspend(() =>
  S.Struct({ marketplaceRegistrationToken: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AcceptMarketplaceRegistrationInput",
}) as any as S.Schema<AcceptMarketplaceRegistrationInput>;
export interface AcceptMarketplaceRegistrationOutput {}
export const AcceptMarketplaceRegistrationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AcceptMarketplaceRegistrationOutput",
}) as any as S.Schema<AcceptMarketplaceRegistrationOutput>;
export interface AssociateIamRoleToResourceInput {
  iamRoleArn: string;
  awsIntegration: SupportedAwsIntegration;
  resourceArn: string;
}
export const AssociateIamRoleToResourceInput = S.suspend(() =>
  S.Struct({
    iamRoleArn: S.String,
    awsIntegration: SupportedAwsIntegration,
    resourceArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateIamRoleToResourceInput",
}) as any as S.Schema<AssociateIamRoleToResourceInput>;
export interface AssociateIamRoleToResourceOutput {}
export const AssociateIamRoleToResourceOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateIamRoleToResourceOutput",
}) as any as S.Schema<AssociateIamRoleToResourceOutput>;
export interface DisassociateIamRoleFromResourceInput {
  iamRoleArn: string;
  awsIntegration: SupportedAwsIntegration;
  resourceArn: string;
}
export const DisassociateIamRoleFromResourceInput = S.suspend(() =>
  S.Struct({
    iamRoleArn: S.String,
    awsIntegration: SupportedAwsIntegration,
    resourceArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateIamRoleFromResourceInput",
}) as any as S.Schema<DisassociateIamRoleFromResourceInput>;
export interface DisassociateIamRoleFromResourceOutput {}
export const DisassociateIamRoleFromResourceOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateIamRoleFromResourceOutput",
}) as any as S.Schema<DisassociateIamRoleFromResourceOutput>;
export interface InitializeServiceInput {
  ociIdentityDomain?: boolean;
}
export const InitializeServiceInput = S.suspend(() =>
  S.Struct({ ociIdentityDomain: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "InitializeServiceInput",
}) as any as S.Schema<InitializeServiceInput>;
export interface InitializeServiceOutput {}
export const InitializeServiceOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "InitializeServiceOutput",
}) as any as S.Schema<InitializeServiceOutput>;
export interface ListDbSystemShapesInput {
  maxResults?: number;
  nextToken?: string;
  availabilityZone?: string;
  availabilityZoneId?: string;
}
export const ListDbSystemShapesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    availabilityZone: S.optional(S.String),
    availabilityZoneId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDbSystemShapesInput",
}) as any as S.Schema<ListDbSystemShapesInput>;
export interface ListGiVersionsInput {
  maxResults?: number;
  nextToken?: string;
  shape?: string;
}
export const ListGiVersionsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    shape: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListGiVersionsInput",
}) as any as S.Schema<ListGiVersionsInput>;
export interface ListSystemVersionsInput {
  maxResults?: number;
  nextToken?: string;
  giVersion: string;
  shape: string;
}
export const ListSystemVersionsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    giVersion: S.String,
    shape: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSystemVersionsInput",
}) as any as S.Schema<ListSystemVersionsInput>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface GetCloudAutonomousVmClusterInput {
  cloudAutonomousVmClusterId: string;
}
export const GetCloudAutonomousVmClusterInput = S.suspend(() =>
  S.Struct({
    cloudAutonomousVmClusterId: S.String.pipe(
      T.HttpLabel("cloudAutonomousVmClusterId"),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCloudAutonomousVmClusterInput",
}) as any as S.Schema<GetCloudAutonomousVmClusterInput>;
export interface DeleteCloudAutonomousVmClusterInput {
  cloudAutonomousVmClusterId: string;
}
export const DeleteCloudAutonomousVmClusterInput = S.suspend(() =>
  S.Struct({
    cloudAutonomousVmClusterId: S.String.pipe(
      T.HttpLabel("cloudAutonomousVmClusterId"),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCloudAutonomousVmClusterInput",
}) as any as S.Schema<DeleteCloudAutonomousVmClusterInput>;
export interface DeleteCloudAutonomousVmClusterOutput {}
export const DeleteCloudAutonomousVmClusterOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCloudAutonomousVmClusterOutput",
}) as any as S.Schema<DeleteCloudAutonomousVmClusterOutput>;
export interface ListCloudAutonomousVmClustersInput {
  maxResults?: number;
  nextToken?: string;
  cloudExadataInfrastructureId?: string;
}
export const ListCloudAutonomousVmClustersInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    cloudExadataInfrastructureId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCloudAutonomousVmClustersInput",
}) as any as S.Schema<ListCloudAutonomousVmClustersInput>;
export interface ListAutonomousVirtualMachinesInput {
  maxResults?: number;
  nextToken?: string;
  cloudAutonomousVmClusterId: string;
}
export const ListAutonomousVirtualMachinesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    cloudAutonomousVmClusterId: S.String.pipe(
      T.HttpLabel("cloudAutonomousVmClusterId"),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAutonomousVirtualMachinesInput",
}) as any as S.Schema<ListAutonomousVirtualMachinesInput>;
export interface GetCloudExadataInfrastructureInput {
  cloudExadataInfrastructureId: string;
}
export const GetCloudExadataInfrastructureInput = S.suspend(() =>
  S.Struct({
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCloudExadataInfrastructureInput",
}) as any as S.Schema<GetCloudExadataInfrastructureInput>;
export type DayOfWeekName =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"
  | (string & {});
export const DayOfWeekName = S.String;
export interface DayOfWeek {
  name?: DayOfWeekName;
}
export const DayOfWeek = S.suspend(() =>
  S.Struct({ name: S.optional(DayOfWeekName) }),
).annotations({ identifier: "DayOfWeek" }) as any as S.Schema<DayOfWeek>;
export type DaysOfWeek = DayOfWeek[];
export const DaysOfWeek = S.Array(DayOfWeek);
export type HoursOfDay = number[];
export const HoursOfDay = S.Array(S.Number);
export type MonthName =
  | "JANUARY"
  | "FEBRUARY"
  | "MARCH"
  | "APRIL"
  | "MAY"
  | "JUNE"
  | "JULY"
  | "AUGUST"
  | "SEPTEMBER"
  | "OCTOBER"
  | "NOVEMBER"
  | "DECEMBER"
  | (string & {});
export const MonthName = S.String;
export interface Month {
  name?: MonthName;
}
export const Month = S.suspend(() =>
  S.Struct({ name: S.optional(MonthName) }),
).annotations({ identifier: "Month" }) as any as S.Schema<Month>;
export type Months = Month[];
export const Months = S.Array(Month);
export type PatchingModeType = "ROLLING" | "NONROLLING" | (string & {});
export const PatchingModeType = S.String;
export type PreferenceType =
  | "NO_PREFERENCE"
  | "CUSTOM_PREFERENCE"
  | (string & {});
export const PreferenceType = S.String;
export type WeeksOfMonth = number[];
export const WeeksOfMonth = S.Array(S.Number);
export interface MaintenanceWindow {
  customActionTimeoutInMins?: number;
  daysOfWeek?: DayOfWeek[];
  hoursOfDay?: number[];
  isCustomActionTimeoutEnabled?: boolean;
  leadTimeInWeeks?: number;
  months?: Month[];
  patchingMode?: PatchingModeType;
  preference?: PreferenceType;
  skipRu?: boolean;
  weeksOfMonth?: number[];
}
export const MaintenanceWindow = S.suspend(() =>
  S.Struct({
    customActionTimeoutInMins: S.optional(S.Number),
    daysOfWeek: S.optional(DaysOfWeek),
    hoursOfDay: S.optional(HoursOfDay),
    isCustomActionTimeoutEnabled: S.optional(S.Boolean),
    leadTimeInWeeks: S.optional(S.Number),
    months: S.optional(Months),
    patchingMode: S.optional(PatchingModeType),
    preference: S.optional(PreferenceType),
    skipRu: S.optional(S.Boolean),
    weeksOfMonth: S.optional(WeeksOfMonth),
  }),
).annotations({
  identifier: "MaintenanceWindow",
}) as any as S.Schema<MaintenanceWindow>;
export interface UpdateCloudExadataInfrastructureInput {
  cloudExadataInfrastructureId: string;
  maintenanceWindow?: MaintenanceWindow;
}
export const UpdateCloudExadataInfrastructureInput = S.suspend(() =>
  S.Struct({
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
    maintenanceWindow: S.optional(MaintenanceWindow),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCloudExadataInfrastructureInput",
}) as any as S.Schema<UpdateCloudExadataInfrastructureInput>;
export interface DeleteCloudExadataInfrastructureInput {
  cloudExadataInfrastructureId: string;
}
export const DeleteCloudExadataInfrastructureInput = S.suspend(() =>
  S.Struct({
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCloudExadataInfrastructureInput",
}) as any as S.Schema<DeleteCloudExadataInfrastructureInput>;
export interface DeleteCloudExadataInfrastructureOutput {}
export const DeleteCloudExadataInfrastructureOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCloudExadataInfrastructureOutput",
}) as any as S.Schema<DeleteCloudExadataInfrastructureOutput>;
export interface ListCloudExadataInfrastructuresInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListCloudExadataInfrastructuresInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCloudExadataInfrastructuresInput",
}) as any as S.Schema<ListCloudExadataInfrastructuresInput>;
export interface GetCloudExadataInfrastructureUnallocatedResourcesInput {
  cloudExadataInfrastructureId: string;
  dbServers?: string[];
}
export const GetCloudExadataInfrastructureUnallocatedResourcesInput = S.suspend(
  () =>
    S.Struct({
      cloudExadataInfrastructureId: S.String.pipe(
        T.HttpLabel("cloudExadataInfrastructureId"),
      ),
      dbServers: S.optional(StringList),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "GetCloudExadataInfrastructureUnallocatedResourcesInput",
}) as any as S.Schema<GetCloudExadataInfrastructureUnallocatedResourcesInput>;
export interface GetDbServerInput {
  cloudExadataInfrastructureId: string;
  dbServerId: string;
}
export const GetDbServerInput = S.suspend(() =>
  S.Struct({
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
    dbServerId: S.String.pipe(T.HttpLabel("dbServerId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDbServerInput",
}) as any as S.Schema<GetDbServerInput>;
export interface ListDbServersInput {
  cloudExadataInfrastructureId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListDbServersInput = S.suspend(() =>
  S.Struct({
    cloudExadataInfrastructureId: S.String.pipe(
      T.HttpLabel("cloudExadataInfrastructureId"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDbServersInput",
}) as any as S.Schema<ListDbServersInput>;
export interface GetCloudVmClusterInput {
  cloudVmClusterId: string;
}
export const GetCloudVmClusterInput = S.suspend(() =>
  S.Struct({
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCloudVmClusterInput",
}) as any as S.Schema<GetCloudVmClusterInput>;
export interface DeleteCloudVmClusterInput {
  cloudVmClusterId: string;
}
export const DeleteCloudVmClusterInput = S.suspend(() =>
  S.Struct({
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCloudVmClusterInput",
}) as any as S.Schema<DeleteCloudVmClusterInput>;
export interface DeleteCloudVmClusterOutput {}
export const DeleteCloudVmClusterOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCloudVmClusterOutput",
}) as any as S.Schema<DeleteCloudVmClusterOutput>;
export interface ListCloudVmClustersInput {
  maxResults?: number;
  nextToken?: string;
  cloudExadataInfrastructureId?: string;
}
export const ListCloudVmClustersInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    cloudExadataInfrastructureId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCloudVmClustersInput",
}) as any as S.Schema<ListCloudVmClustersInput>;
export interface GetDbNodeInput {
  cloudVmClusterId: string;
  dbNodeId: string;
}
export const GetDbNodeInput = S.suspend(() =>
  S.Struct({
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
    dbNodeId: S.String.pipe(T.HttpLabel("dbNodeId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDbNodeInput",
}) as any as S.Schema<GetDbNodeInput>;
export interface ListDbNodesInput {
  maxResults?: number;
  nextToken?: string;
  cloudVmClusterId: string;
}
export const ListDbNodesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDbNodesInput",
}) as any as S.Schema<ListDbNodesInput>;
export interface RebootDbNodeInput {
  cloudVmClusterId: string;
  dbNodeId: string;
}
export const RebootDbNodeInput = S.suspend(() =>
  S.Struct({
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
    dbNodeId: S.String.pipe(T.HttpLabel("dbNodeId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RebootDbNodeInput",
}) as any as S.Schema<RebootDbNodeInput>;
export interface StartDbNodeInput {
  cloudVmClusterId: string;
  dbNodeId: string;
}
export const StartDbNodeInput = S.suspend(() =>
  S.Struct({
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
    dbNodeId: S.String.pipe(T.HttpLabel("dbNodeId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartDbNodeInput",
}) as any as S.Schema<StartDbNodeInput>;
export interface StopDbNodeInput {
  cloudVmClusterId: string;
  dbNodeId: string;
}
export const StopDbNodeInput = S.suspend(() =>
  S.Struct({
    cloudVmClusterId: S.String.pipe(T.HttpLabel("cloudVmClusterId")),
    dbNodeId: S.String.pipe(T.HttpLabel("dbNodeId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopDbNodeInput",
}) as any as S.Schema<StopDbNodeInput>;
export type RequestTagMap = { [key: string]: string | undefined };
export const RequestTagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateOdbNetworkInput {
  displayName: string;
  availabilityZone?: string;
  availabilityZoneId?: string;
  clientSubnetCidr: string;
  backupSubnetCidr?: string;
  customDomainName?: string;
  defaultDnsPrefix?: string;
  clientToken?: string;
  s3Access?: Access;
  zeroEtlAccess?: Access;
  stsAccess?: Access;
  kmsAccess?: Access;
  s3PolicyDocument?: string;
  stsPolicyDocument?: string;
  kmsPolicyDocument?: string;
  crossRegionS3RestoreSourcesToEnable?: string[];
  tags?: { [key: string]: string | undefined };
}
export const CreateOdbNetworkInput = S.suspend(() =>
  S.Struct({
    displayName: S.String,
    availabilityZone: S.optional(S.String),
    availabilityZoneId: S.optional(S.String),
    clientSubnetCidr: S.String,
    backupSubnetCidr: S.optional(S.String),
    customDomainName: S.optional(S.String),
    defaultDnsPrefix: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    s3Access: S.optional(Access),
    zeroEtlAccess: S.optional(Access),
    stsAccess: S.optional(Access),
    kmsAccess: S.optional(Access),
    s3PolicyDocument: S.optional(S.String),
    stsPolicyDocument: S.optional(S.String),
    kmsPolicyDocument: S.optional(S.String),
    crossRegionS3RestoreSourcesToEnable: S.optional(StringList),
    tags: S.optional(RequestTagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateOdbNetworkInput",
}) as any as S.Schema<CreateOdbNetworkInput>;
export interface GetOdbNetworkInput {
  odbNetworkId: string;
}
export const GetOdbNetworkInput = S.suspend(() =>
  S.Struct({ odbNetworkId: S.String.pipe(T.HttpLabel("odbNetworkId")) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetOdbNetworkInput",
}) as any as S.Schema<GetOdbNetworkInput>;
export interface UpdateOdbNetworkInput {
  odbNetworkId: string;
  displayName?: string;
  peeredCidrsToBeAdded?: string[];
  peeredCidrsToBeRemoved?: string[];
  s3Access?: Access;
  zeroEtlAccess?: Access;
  stsAccess?: Access;
  kmsAccess?: Access;
  s3PolicyDocument?: string;
  stsPolicyDocument?: string;
  kmsPolicyDocument?: string;
  crossRegionS3RestoreSourcesToEnable?: string[];
  crossRegionS3RestoreSourcesToDisable?: string[];
}
export const UpdateOdbNetworkInput = S.suspend(() =>
  S.Struct({
    odbNetworkId: S.String.pipe(T.HttpLabel("odbNetworkId")),
    displayName: S.optional(S.String),
    peeredCidrsToBeAdded: S.optional(StringList),
    peeredCidrsToBeRemoved: S.optional(StringList),
    s3Access: S.optional(Access),
    zeroEtlAccess: S.optional(Access),
    stsAccess: S.optional(Access),
    kmsAccess: S.optional(Access),
    s3PolicyDocument: S.optional(S.String),
    stsPolicyDocument: S.optional(S.String),
    kmsPolicyDocument: S.optional(S.String),
    crossRegionS3RestoreSourcesToEnable: S.optional(StringList),
    crossRegionS3RestoreSourcesToDisable: S.optional(StringList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateOdbNetworkInput",
}) as any as S.Schema<UpdateOdbNetworkInput>;
export interface DeleteOdbNetworkInput {
  odbNetworkId: string;
  deleteAssociatedResources: boolean;
}
export const DeleteOdbNetworkInput = S.suspend(() =>
  S.Struct({
    odbNetworkId: S.String.pipe(T.HttpLabel("odbNetworkId")),
    deleteAssociatedResources: S.Boolean,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteOdbNetworkInput",
}) as any as S.Schema<DeleteOdbNetworkInput>;
export interface DeleteOdbNetworkOutput {}
export const DeleteOdbNetworkOutput = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteOdbNetworkOutput" },
) as any as S.Schema<DeleteOdbNetworkOutput>;
export interface ListOdbNetworksInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListOdbNetworksInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListOdbNetworksInput",
}) as any as S.Schema<ListOdbNetworksInput>;
export interface CreateOdbPeeringConnectionInput {
  odbNetworkId: string;
  peerNetworkId: string;
  displayName?: string;
  peerNetworkCidrsToBeAdded?: string[];
  clientToken?: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateOdbPeeringConnectionInput = S.suspend(() =>
  S.Struct({
    odbNetworkId: S.String,
    peerNetworkId: S.String,
    displayName: S.optional(S.String),
    peerNetworkCidrsToBeAdded: S.optional(PeeredCidrList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(RequestTagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateOdbPeeringConnectionInput",
}) as any as S.Schema<CreateOdbPeeringConnectionInput>;
export interface GetOdbPeeringConnectionInput {
  odbPeeringConnectionId: string;
}
export const GetOdbPeeringConnectionInput = S.suspend(() =>
  S.Struct({
    odbPeeringConnectionId: S.String.pipe(
      T.HttpLabel("odbPeeringConnectionId"),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetOdbPeeringConnectionInput",
}) as any as S.Schema<GetOdbPeeringConnectionInput>;
export interface UpdateOdbPeeringConnectionInput {
  odbPeeringConnectionId: string;
  displayName?: string;
  peerNetworkCidrsToBeAdded?: string[];
  peerNetworkCidrsToBeRemoved?: string[];
}
export const UpdateOdbPeeringConnectionInput = S.suspend(() =>
  S.Struct({
    odbPeeringConnectionId: S.String.pipe(
      T.HttpLabel("odbPeeringConnectionId"),
    ),
    displayName: S.optional(S.String),
    peerNetworkCidrsToBeAdded: S.optional(PeeredCidrList),
    peerNetworkCidrsToBeRemoved: S.optional(PeeredCidrList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateOdbPeeringConnectionInput",
}) as any as S.Schema<UpdateOdbPeeringConnectionInput>;
export interface DeleteOdbPeeringConnectionInput {
  odbPeeringConnectionId: string;
}
export const DeleteOdbPeeringConnectionInput = S.suspend(() =>
  S.Struct({
    odbPeeringConnectionId: S.String.pipe(
      T.HttpLabel("odbPeeringConnectionId"),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteOdbPeeringConnectionInput",
}) as any as S.Schema<DeleteOdbPeeringConnectionInput>;
export interface DeleteOdbPeeringConnectionOutput {}
export const DeleteOdbPeeringConnectionOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteOdbPeeringConnectionOutput",
}) as any as S.Schema<DeleteOdbPeeringConnectionOutput>;
export interface ListOdbPeeringConnectionsInput {
  maxResults?: number;
  nextToken?: string;
  odbNetworkId?: string;
}
export const ListOdbPeeringConnectionsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    odbNetworkId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListOdbPeeringConnectionsInput",
}) as any as S.Schema<ListOdbPeeringConnectionsInput>;
export type ResourceStatus =
  | "AVAILABLE"
  | "FAILED"
  | "PROVISIONING"
  | "TERMINATED"
  | "TERMINATING"
  | "UPDATING"
  | "MAINTENANCE_IN_PROGRESS"
  | (string & {});
export const ResourceStatus = S.String;
export interface OciIdentityDomain {
  ociIdentityDomainId?: string;
  ociIdentityDomainResourceUrl?: string;
  ociIdentityDomainUrl?: string;
  status?: ResourceStatus;
  statusReason?: string;
  accountSetupCloudFormationUrl?: string;
}
export const OciIdentityDomain = S.suspend(() =>
  S.Struct({
    ociIdentityDomainId: S.optional(S.String),
    ociIdentityDomainResourceUrl: S.optional(S.String),
    ociIdentityDomainUrl: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    accountSetupCloudFormationUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "OciIdentityDomain",
}) as any as S.Schema<OciIdentityDomain>;
export interface CustomerContact {
  email?: string | redacted.Redacted<string>;
}
export const CustomerContact = S.suspend(() =>
  S.Struct({ email: S.optional(SensitiveString) }),
).annotations({
  identifier: "CustomerContact",
}) as any as S.Schema<CustomerContact>;
export type CustomerContacts = CustomerContact[];
export const CustomerContacts = S.Array(CustomerContact);
export interface DataCollectionOptions {
  isDiagnosticsEventsEnabled?: boolean;
  isHealthMonitoringEnabled?: boolean;
  isIncidentLogsEnabled?: boolean;
}
export const DataCollectionOptions = S.suspend(() =>
  S.Struct({
    isDiagnosticsEventsEnabled: S.optional(S.Boolean),
    isHealthMonitoringEnabled: S.optional(S.Boolean),
    isIncidentLogsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DataCollectionOptions",
}) as any as S.Schema<DataCollectionOptions>;
export type DbNodeResourceStatus =
  | "AVAILABLE"
  | "FAILED"
  | "PROVISIONING"
  | "TERMINATED"
  | "TERMINATING"
  | "UPDATING"
  | "STOPPING"
  | "STOPPED"
  | "STARTING"
  | (string & {});
export const DbNodeResourceStatus = S.String;
export interface GetOciOnboardingStatusOutput {
  status?: OciOnboardingStatus;
  existingTenancyActivationLink?: string;
  newTenancyActivationLink?: string;
  ociIdentityDomain?: OciIdentityDomain;
}
export const GetOciOnboardingStatusOutput = S.suspend(() =>
  S.Struct({
    status: S.optional(OciOnboardingStatus),
    existingTenancyActivationLink: S.optional(S.String),
    newTenancyActivationLink: S.optional(S.String),
    ociIdentityDomain: S.optional(OciIdentityDomain),
  }),
).annotations({
  identifier: "GetOciOnboardingStatusOutput",
}) as any as S.Schema<GetOciOnboardingStatusOutput>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: RequestTagMap }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateCloudExadataInfrastructureInput {
  displayName: string;
  shape: string;
  availabilityZone?: string;
  availabilityZoneId?: string;
  tags?: { [key: string]: string | undefined };
  computeCount: number;
  customerContactsToSendToOCI?: CustomerContact[];
  maintenanceWindow?: MaintenanceWindow;
  storageCount: number;
  clientToken?: string;
  databaseServerType?: string;
  storageServerType?: string;
}
export const CreateCloudExadataInfrastructureInput = S.suspend(() =>
  S.Struct({
    displayName: S.String,
    shape: S.String,
    availabilityZone: S.optional(S.String),
    availabilityZoneId: S.optional(S.String),
    tags: S.optional(RequestTagMap),
    computeCount: S.Number,
    customerContactsToSendToOCI: S.optional(CustomerContacts),
    maintenanceWindow: S.optional(MaintenanceWindow),
    storageCount: S.Number,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    databaseServerType: S.optional(S.String),
    storageServerType: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCloudExadataInfrastructureInput",
}) as any as S.Schema<CreateCloudExadataInfrastructureInput>;
export interface UpdateCloudExadataInfrastructureOutput {
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudExadataInfrastructureId: string;
}
export const UpdateCloudExadataInfrastructureOutput = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    cloudExadataInfrastructureId: S.String,
  }),
).annotations({
  identifier: "UpdateCloudExadataInfrastructureOutput",
}) as any as S.Schema<UpdateCloudExadataInfrastructureOutput>;
export interface CreateCloudVmClusterInput {
  cloudExadataInfrastructureId: string;
  cpuCoreCount: number;
  displayName: string;
  giVersion: string;
  hostname: string;
  sshPublicKeys: string[];
  odbNetworkId: string;
  clusterName?: string;
  dataCollectionOptions?: DataCollectionOptions;
  dataStorageSizeInTBs?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServers?: string[];
  tags?: { [key: string]: string | undefined };
  isLocalBackupEnabled?: boolean;
  isSparseDiskgroupEnabled?: boolean;
  licenseModel?: LicenseModel;
  memorySizeInGBs?: number;
  systemVersion?: string;
  timeZone?: string;
  clientToken?: string;
  scanListenerPortTcp?: number;
}
export const CreateCloudVmClusterInput = S.suspend(() =>
  S.Struct({
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
    licenseModel: S.optional(LicenseModel),
    memorySizeInGBs: S.optional(S.Number),
    systemVersion: S.optional(S.String),
    timeZone: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    scanListenerPortTcp: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCloudVmClusterInput",
}) as any as S.Schema<CreateCloudVmClusterInput>;
export interface RebootDbNodeOutput {
  dbNodeId: string;
  status?: DbNodeResourceStatus;
  statusReason?: string;
}
export const RebootDbNodeOutput = S.suspend(() =>
  S.Struct({
    dbNodeId: S.String,
    status: S.optional(DbNodeResourceStatus),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "RebootDbNodeOutput",
}) as any as S.Schema<RebootDbNodeOutput>;
export interface StartDbNodeOutput {
  dbNodeId: string;
  status?: DbNodeResourceStatus;
  statusReason?: string;
}
export const StartDbNodeOutput = S.suspend(() =>
  S.Struct({
    dbNodeId: S.String,
    status: S.optional(DbNodeResourceStatus),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "StartDbNodeOutput",
}) as any as S.Schema<StartDbNodeOutput>;
export interface StopDbNodeOutput {
  dbNodeId: string;
  status?: DbNodeResourceStatus;
  statusReason?: string;
}
export const StopDbNodeOutput = S.suspend(() =>
  S.Struct({
    dbNodeId: S.String,
    status: S.optional(DbNodeResourceStatus),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "StopDbNodeOutput",
}) as any as S.Schema<StopDbNodeOutput>;
export interface CreateOdbNetworkOutput {
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  odbNetworkId: string;
}
export const CreateOdbNetworkOutput = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    odbNetworkId: S.String,
  }),
).annotations({
  identifier: "CreateOdbNetworkOutput",
}) as any as S.Schema<CreateOdbNetworkOutput>;
export interface UpdateOdbNetworkOutput {
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  odbNetworkId: string;
}
export const UpdateOdbNetworkOutput = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    odbNetworkId: S.String,
  }),
).annotations({
  identifier: "UpdateOdbNetworkOutput",
}) as any as S.Schema<UpdateOdbNetworkOutput>;
export interface CreateOdbPeeringConnectionOutput {
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  odbPeeringConnectionId: string;
}
export const CreateOdbPeeringConnectionOutput = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    odbPeeringConnectionId: S.String,
  }),
).annotations({
  identifier: "CreateOdbPeeringConnectionOutput",
}) as any as S.Schema<CreateOdbPeeringConnectionOutput>;
export interface UpdateOdbPeeringConnectionOutput {
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  odbPeeringConnectionId: string;
}
export const UpdateOdbPeeringConnectionOutput = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    odbPeeringConnectionId: S.String,
  }),
).annotations({
  identifier: "UpdateOdbPeeringConnectionOutput",
}) as any as S.Schema<UpdateOdbPeeringConnectionOutput>;
export type ShapeType =
  | "AMD"
  | "INTEL"
  | "INTEL_FLEX_X9"
  | "AMPERE_FLEX_A1"
  | (string & {});
export const ShapeType = S.String;
export type ComputeModel = "ECPU" | "OCPU" | (string & {});
export const ComputeModel = S.String;
export type DiskRedundancy = "HIGH" | "NORMAL" | (string & {});
export const DiskRedundancy = S.String;
export type SensitiveStringList = string | redacted.Redacted<string>[];
export const SensitiveStringList = S.Array(SensitiveString);
export type DbNodeMaintenanceType = "VMDB_REBOOT_MIGRATION" | (string & {});
export const DbNodeMaintenanceType = S.String;
export interface DbSystemShapeSummary {
  availableCoreCount?: number;
  availableCoreCountPerNode?: number;
  availableDataStorageInTBs?: number;
  availableDataStoragePerServerInTBs?: number;
  availableDbNodePerNodeInGBs?: number;
  availableDbNodeStorageInGBs?: number;
  availableMemoryInGBs?: number;
  availableMemoryPerNodeInGBs?: number;
  coreCountIncrement?: number;
  maxStorageCount?: number;
  maximumNodeCount?: number;
  minCoreCountPerNode?: number;
  minDataStorageInTBs?: number;
  minDbNodeStoragePerNodeInGBs?: number;
  minMemoryPerNodeInGBs?: number;
  minStorageCount?: number;
  minimumCoreCount?: number;
  minimumNodeCount?: number;
  runtimeMinimumCoreCount?: number;
  shapeFamily?: string;
  shapeType?: ShapeType;
  name?: string;
  computeModel?: ComputeModel;
  areServerTypesSupported?: boolean;
}
export const DbSystemShapeSummary = S.suspend(() =>
  S.Struct({
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
    shapeType: S.optional(ShapeType),
    name: S.optional(S.String),
    computeModel: S.optional(ComputeModel),
    areServerTypesSupported: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DbSystemShapeSummary",
}) as any as S.Schema<DbSystemShapeSummary>;
export type DbSystemShapeList = DbSystemShapeSummary[];
export const DbSystemShapeList = S.Array(DbSystemShapeSummary);
export interface GiVersionSummary {
  version?: string;
}
export const GiVersionSummary = S.suspend(() =>
  S.Struct({ version: S.optional(S.String) }),
).annotations({
  identifier: "GiVersionSummary",
}) as any as S.Schema<GiVersionSummary>;
export type GiVersionList = GiVersionSummary[];
export const GiVersionList = S.Array(GiVersionSummary);
export interface SystemVersionSummary {
  giVersion?: string;
  shape?: string;
  systemVersions?: string[];
}
export const SystemVersionSummary = S.suspend(() =>
  S.Struct({
    giVersion: S.optional(S.String),
    shape: S.optional(S.String),
    systemVersions: S.optional(StringList),
  }),
).annotations({
  identifier: "SystemVersionSummary",
}) as any as S.Schema<SystemVersionSummary>;
export type SystemVersionList = SystemVersionSummary[];
export const SystemVersionList = S.Array(SystemVersionSummary);
export type ResponseTagMap = { [key: string]: string | undefined };
export const ResponseTagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CloudAutonomousVmCluster {
  cloudAutonomousVmClusterId: string;
  cloudAutonomousVmClusterArn?: string;
  odbNetworkId?: string;
  odbNetworkArn?: string;
  ociResourceAnchorName?: string;
  percentProgress?: number;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudExadataInfrastructureId?: string;
  cloudExadataInfrastructureArn?: string;
  autonomousDataStoragePercentage?: number;
  autonomousDataStorageSizeInTBs?: number;
  availableAutonomousDataStorageSizeInTBs?: number;
  availableContainerDatabases?: number;
  availableCpus?: number;
  computeModel?: ComputeModel;
  cpuCoreCount?: number;
  cpuCoreCountPerNode?: number;
  cpuPercentage?: number;
  dataStorageSizeInGBs?: number;
  dataStorageSizeInTBs?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServers?: string[];
  description?: string;
  domain?: string;
  exadataStorageInTBsLowestScaledValue?: number;
  hostname?: string;
  ocid?: string;
  ociUrl?: string;
  isMtlsEnabledVmCluster?: boolean;
  licenseModel?: LicenseModel;
  maintenanceWindow?: MaintenanceWindow;
  maxAcdsLowestScaledValue?: number;
  memoryPerOracleComputeUnitInGBs?: number;
  memorySizeInGBs?: number;
  nodeCount?: number;
  nonProvisionableAutonomousContainerDatabases?: number;
  provisionableAutonomousContainerDatabases?: number;
  provisionedAutonomousContainerDatabases?: number;
  provisionedCpus?: number;
  reclaimableCpus?: number;
  reservedCpus?: number;
  scanListenerPortNonTls?: number;
  scanListenerPortTls?: number;
  shape?: string;
  createdAt?: Date;
  timeDatabaseSslCertificateExpires?: Date;
  timeOrdsCertificateExpires?: Date;
  timeZone?: string;
  totalContainerDatabases?: number;
}
export const CloudAutonomousVmCluster = S.suspend(() =>
  S.Struct({
    cloudAutonomousVmClusterId: S.String,
    cloudAutonomousVmClusterArn: S.optional(S.String),
    odbNetworkId: S.optional(S.String),
    odbNetworkArn: S.optional(S.String),
    ociResourceAnchorName: S.optional(S.String),
    percentProgress: S.optional(S.Number),
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    cloudExadataInfrastructureId: S.optional(S.String),
    cloudExadataInfrastructureArn: S.optional(S.String),
    autonomousDataStoragePercentage: S.optional(S.Number),
    autonomousDataStorageSizeInTBs: S.optional(S.Number),
    availableAutonomousDataStorageSizeInTBs: S.optional(S.Number),
    availableContainerDatabases: S.optional(S.Number),
    availableCpus: S.optional(S.Number),
    computeModel: S.optional(ComputeModel),
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
    licenseModel: S.optional(LicenseModel),
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
  }),
).annotations({
  identifier: "CloudAutonomousVmCluster",
}) as any as S.Schema<CloudAutonomousVmCluster>;
export interface CloudAutonomousVmClusterSummary {
  cloudAutonomousVmClusterId: string;
  cloudAutonomousVmClusterArn?: string;
  odbNetworkId?: string;
  odbNetworkArn?: string;
  ociResourceAnchorName?: string;
  percentProgress?: number;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudExadataInfrastructureId?: string;
  cloudExadataInfrastructureArn?: string;
  autonomousDataStoragePercentage?: number;
  autonomousDataStorageSizeInTBs?: number;
  availableAutonomousDataStorageSizeInTBs?: number;
  availableContainerDatabases?: number;
  availableCpus?: number;
  computeModel?: ComputeModel;
  cpuCoreCount?: number;
  cpuCoreCountPerNode?: number;
  cpuPercentage?: number;
  dataStorageSizeInGBs?: number;
  dataStorageSizeInTBs?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServers?: string[];
  description?: string;
  domain?: string;
  exadataStorageInTBsLowestScaledValue?: number;
  hostname?: string;
  ocid?: string;
  ociUrl?: string;
  isMtlsEnabledVmCluster?: boolean;
  licenseModel?: LicenseModel;
  maintenanceWindow?: MaintenanceWindow;
  maxAcdsLowestScaledValue?: number;
  memoryPerOracleComputeUnitInGBs?: number;
  memorySizeInGBs?: number;
  nodeCount?: number;
  nonProvisionableAutonomousContainerDatabases?: number;
  provisionableAutonomousContainerDatabases?: number;
  provisionedAutonomousContainerDatabases?: number;
  provisionedCpus?: number;
  reclaimableCpus?: number;
  reservedCpus?: number;
  scanListenerPortNonTls?: number;
  scanListenerPortTls?: number;
  shape?: string;
  createdAt?: Date;
  timeDatabaseSslCertificateExpires?: Date;
  timeOrdsCertificateExpires?: Date;
  timeZone?: string;
  totalContainerDatabases?: number;
}
export const CloudAutonomousVmClusterSummary = S.suspend(() =>
  S.Struct({
    cloudAutonomousVmClusterId: S.String,
    cloudAutonomousVmClusterArn: S.optional(S.String),
    odbNetworkId: S.optional(S.String),
    odbNetworkArn: S.optional(S.String),
    ociResourceAnchorName: S.optional(S.String),
    percentProgress: S.optional(S.Number),
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    cloudExadataInfrastructureId: S.optional(S.String),
    cloudExadataInfrastructureArn: S.optional(S.String),
    autonomousDataStoragePercentage: S.optional(S.Number),
    autonomousDataStorageSizeInTBs: S.optional(S.Number),
    availableAutonomousDataStorageSizeInTBs: S.optional(S.Number),
    availableContainerDatabases: S.optional(S.Number),
    availableCpus: S.optional(S.Number),
    computeModel: S.optional(ComputeModel),
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
    licenseModel: S.optional(LicenseModel),
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
  }),
).annotations({
  identifier: "CloudAutonomousVmClusterSummary",
}) as any as S.Schema<CloudAutonomousVmClusterSummary>;
export type CloudAutonomousVmClusterList = CloudAutonomousVmClusterSummary[];
export const CloudAutonomousVmClusterList = S.Array(
  CloudAutonomousVmClusterSummary,
);
export interface AutonomousVirtualMachineSummary {
  autonomousVirtualMachineId?: string;
  status?: ResourceStatus;
  statusReason?: string;
  vmName?: string;
  dbServerId?: string;
  dbServerDisplayName?: string;
  cpuCoreCount?: number;
  memorySizeInGBs?: number;
  dbNodeStorageSizeInGBs?: number;
  clientIpAddress?: string;
  cloudAutonomousVmClusterId?: string;
  ocid?: string;
  ociResourceAnchorName?: string;
}
export const AutonomousVirtualMachineSummary = S.suspend(() =>
  S.Struct({
    autonomousVirtualMachineId: S.optional(S.String),
    status: S.optional(ResourceStatus),
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
  }),
).annotations({
  identifier: "AutonomousVirtualMachineSummary",
}) as any as S.Schema<AutonomousVirtualMachineSummary>;
export type AutonomousVirtualMachineList = AutonomousVirtualMachineSummary[];
export const AutonomousVirtualMachineList = S.Array(
  AutonomousVirtualMachineSummary,
);
export interface CloudExadataInfrastructure {
  cloudExadataInfrastructureId: string;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudExadataInfrastructureArn?: string;
  activatedStorageCount?: number;
  additionalStorageCount?: number;
  availableStorageSizeInGBs?: number;
  availabilityZone?: string;
  availabilityZoneId?: string;
  computeCount?: number;
  cpuCount?: number;
  customerContactsToSendToOCI?: CustomerContact[];
  dataStorageSizeInTBs?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServerVersion?: string;
  lastMaintenanceRunId?: string;
  maintenanceWindow?: MaintenanceWindow;
  maxCpuCount?: number;
  maxDataStorageInTBs?: number;
  maxDbNodeStorageSizeInGBs?: number;
  maxMemoryInGBs?: number;
  memorySizeInGBs?: number;
  monthlyDbServerVersion?: string;
  monthlyStorageServerVersion?: string;
  nextMaintenanceRunId?: string;
  ociResourceAnchorName?: string;
  ociUrl?: string;
  ocid?: string;
  shape?: string;
  storageCount?: number;
  storageServerVersion?: string;
  createdAt?: Date;
  totalStorageSizeInGBs?: number;
  percentProgress?: number;
  databaseServerType?: string;
  storageServerType?: string;
  computeModel?: ComputeModel;
}
export const CloudExadataInfrastructure = S.suspend(() =>
  S.Struct({
    cloudExadataInfrastructureId: S.String,
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
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
    computeModel: S.optional(ComputeModel),
  }),
).annotations({
  identifier: "CloudExadataInfrastructure",
}) as any as S.Schema<CloudExadataInfrastructure>;
export interface CloudExadataInfrastructureSummary {
  cloudExadataInfrastructureId: string;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudExadataInfrastructureArn?: string;
  activatedStorageCount?: number;
  additionalStorageCount?: number;
  availableStorageSizeInGBs?: number;
  availabilityZone?: string;
  availabilityZoneId?: string;
  computeCount?: number;
  cpuCount?: number;
  customerContactsToSendToOCI?: CustomerContact[];
  dataStorageSizeInTBs?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServerVersion?: string;
  lastMaintenanceRunId?: string;
  maintenanceWindow?: MaintenanceWindow;
  maxCpuCount?: number;
  maxDataStorageInTBs?: number;
  maxDbNodeStorageSizeInGBs?: number;
  maxMemoryInGBs?: number;
  memorySizeInGBs?: number;
  monthlyDbServerVersion?: string;
  monthlyStorageServerVersion?: string;
  nextMaintenanceRunId?: string;
  ociResourceAnchorName?: string;
  ociUrl?: string;
  ocid?: string;
  shape?: string;
  storageCount?: number;
  storageServerVersion?: string;
  createdAt?: Date;
  totalStorageSizeInGBs?: number;
  percentProgress?: number;
  databaseServerType?: string;
  storageServerType?: string;
  computeModel?: ComputeModel;
}
export const CloudExadataInfrastructureSummary = S.suspend(() =>
  S.Struct({
    cloudExadataInfrastructureId: S.String,
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
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
    computeModel: S.optional(ComputeModel),
  }),
).annotations({
  identifier: "CloudExadataInfrastructureSummary",
}) as any as S.Schema<CloudExadataInfrastructureSummary>;
export type CloudExadataInfrastructureList =
  CloudExadataInfrastructureSummary[];
export const CloudExadataInfrastructureList = S.Array(
  CloudExadataInfrastructureSummary,
);
export type DbServerPatchingStatus =
  | "COMPLETE"
  | "FAILED"
  | "MAINTENANCE_IN_PROGRESS"
  | "SCHEDULED"
  | (string & {});
export const DbServerPatchingStatus = S.String;
export interface DbServerPatchingDetails {
  estimatedPatchDuration?: number;
  patchingStatus?: DbServerPatchingStatus;
  timePatchingEnded?: string;
  timePatchingStarted?: string;
}
export const DbServerPatchingDetails = S.suspend(() =>
  S.Struct({
    estimatedPatchDuration: S.optional(S.Number),
    patchingStatus: S.optional(DbServerPatchingStatus),
    timePatchingEnded: S.optional(S.String),
    timePatchingStarted: S.optional(S.String),
  }),
).annotations({
  identifier: "DbServerPatchingDetails",
}) as any as S.Schema<DbServerPatchingDetails>;
export interface DbServerSummary {
  dbServerId?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cpuCoreCount?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServerPatchingDetails?: DbServerPatchingDetails;
  displayName?: string;
  exadataInfrastructureId?: string;
  ocid?: string;
  ociResourceAnchorName?: string;
  maxCpuCount?: number;
  maxDbNodeStorageInGBs?: number;
  maxMemoryInGBs?: number;
  memorySizeInGBs?: number;
  shape?: string;
  createdAt?: Date;
  vmClusterIds?: string[];
  computeModel?: ComputeModel;
  autonomousVmClusterIds?: string[];
  autonomousVirtualMachineIds?: string[];
}
export const DbServerSummary = S.suspend(() =>
  S.Struct({
    dbServerId: S.optional(S.String),
    status: S.optional(ResourceStatus),
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
    computeModel: S.optional(ComputeModel),
    autonomousVmClusterIds: S.optional(StringList),
    autonomousVirtualMachineIds: S.optional(StringList),
  }),
).annotations({
  identifier: "DbServerSummary",
}) as any as S.Schema<DbServerSummary>;
export type DbServerList = DbServerSummary[];
export const DbServerList = S.Array(DbServerSummary);
export interface DbIormConfig {
  dbName?: string;
  flashCacheLimit?: string;
  share?: number;
}
export const DbIormConfig = S.suspend(() =>
  S.Struct({
    dbName: S.optional(S.String),
    flashCacheLimit: S.optional(S.String),
    share: S.optional(S.Number),
  }),
).annotations({ identifier: "DbIormConfig" }) as any as S.Schema<DbIormConfig>;
export type DbIormConfigList = DbIormConfig[];
export const DbIormConfigList = S.Array(DbIormConfig);
export type IormLifecycleState =
  | "BOOTSTRAPPING"
  | "DISABLED"
  | "ENABLED"
  | "FAILED"
  | "UPDATING"
  | (string & {});
export const IormLifecycleState = S.String;
export type Objective =
  | "AUTO"
  | "BALANCED"
  | "BASIC"
  | "HIGH_THROUGHPUT"
  | "LOW_LATENCY"
  | (string & {});
export const Objective = S.String;
export interface ExadataIormConfig {
  dbPlans?: DbIormConfig[];
  lifecycleDetails?: string;
  lifecycleState?: IormLifecycleState;
  objective?: Objective;
}
export const ExadataIormConfig = S.suspend(() =>
  S.Struct({
    dbPlans: S.optional(DbIormConfigList),
    lifecycleDetails: S.optional(S.String),
    lifecycleState: S.optional(IormLifecycleState),
    objective: S.optional(Objective),
  }),
).annotations({
  identifier: "ExadataIormConfig",
}) as any as S.Schema<ExadataIormConfig>;
export type IamRoleStatus =
  | "ASSOCIATING"
  | "DISASSOCIATING"
  | "FAILED"
  | "CONNECTED"
  | "DISCONNECTED"
  | "PARTIALLY_CONNECTED"
  | "UNKNOWN"
  | (string & {});
export const IamRoleStatus = S.String;
export interface IamRole {
  iamRoleArn?: string;
  status?: IamRoleStatus;
  statusReason?: string;
  awsIntegration?: SupportedAwsIntegration;
}
export const IamRole = S.suspend(() =>
  S.Struct({
    iamRoleArn: S.optional(S.String),
    status: S.optional(IamRoleStatus),
    statusReason: S.optional(S.String),
    awsIntegration: S.optional(SupportedAwsIntegration),
  }),
).annotations({ identifier: "IamRole" }) as any as S.Schema<IamRole>;
export type IamRoleList = IamRole[];
export const IamRoleList = S.Array(IamRole);
export interface CloudVmClusterSummary {
  cloudVmClusterId: string;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudVmClusterArn?: string;
  cloudExadataInfrastructureId?: string;
  cloudExadataInfrastructureArn?: string;
  clusterName?: string;
  cpuCoreCount?: number;
  dataCollectionOptions?: DataCollectionOptions;
  dataStorageSizeInTBs?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServers?: string[];
  diskRedundancy?: DiskRedundancy;
  giVersion?: string;
  hostname?: string;
  iormConfigCache?: ExadataIormConfig;
  isLocalBackupEnabled?: boolean;
  isSparseDiskgroupEnabled?: boolean;
  lastUpdateHistoryEntryId?: string;
  licenseModel?: LicenseModel;
  listenerPort?: number;
  memorySizeInGBs?: number;
  nodeCount?: number;
  ocid?: string;
  ociResourceAnchorName?: string;
  ociUrl?: string;
  domain?: string;
  scanDnsName?: string;
  scanDnsRecordId?: string;
  scanIpIds?: string[];
  shape?: string;
  sshPublicKeys?: string | redacted.Redacted<string>[];
  storageSizeInGBs?: number;
  systemVersion?: string;
  createdAt?: Date;
  timeZone?: string;
  vipIds?: string[];
  odbNetworkId?: string;
  odbNetworkArn?: string;
  percentProgress?: number;
  computeModel?: ComputeModel;
  iamRoles?: IamRole[];
}
export const CloudVmClusterSummary = S.suspend(() =>
  S.Struct({
    cloudVmClusterId: S.String,
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
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
    diskRedundancy: S.optional(DiskRedundancy),
    giVersion: S.optional(S.String),
    hostname: S.optional(S.String),
    iormConfigCache: S.optional(ExadataIormConfig),
    isLocalBackupEnabled: S.optional(S.Boolean),
    isSparseDiskgroupEnabled: S.optional(S.Boolean),
    lastUpdateHistoryEntryId: S.optional(S.String),
    licenseModel: S.optional(LicenseModel),
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
    computeModel: S.optional(ComputeModel),
    iamRoles: S.optional(IamRoleList),
  }),
).annotations({
  identifier: "CloudVmClusterSummary",
}) as any as S.Schema<CloudVmClusterSummary>;
export type CloudVmClusterList = CloudVmClusterSummary[];
export const CloudVmClusterList = S.Array(CloudVmClusterSummary);
export interface DbNode {
  dbNodeId?: string;
  dbNodeArn?: string;
  status?: DbNodeResourceStatus;
  statusReason?: string;
  additionalDetails?: string;
  backupIpId?: string;
  backupVnic2Id?: string;
  backupVnicId?: string;
  cpuCoreCount?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServerId?: string;
  dbSystemId?: string;
  faultDomain?: string;
  hostIpId?: string;
  hostname?: string;
  ocid?: string;
  ociResourceAnchorName?: string;
  maintenanceType?: DbNodeMaintenanceType;
  memorySizeInGBs?: number;
  softwareStorageSizeInGB?: number;
  createdAt?: Date;
  timeMaintenanceWindowEnd?: string;
  timeMaintenanceWindowStart?: string;
  totalCpuCoreCount?: number;
  vnic2Id?: string;
  vnicId?: string;
  privateIpAddress?: string;
  floatingIpAddress?: string;
}
export const DbNode = S.suspend(() =>
  S.Struct({
    dbNodeId: S.optional(S.String),
    dbNodeArn: S.optional(S.String),
    status: S.optional(DbNodeResourceStatus),
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
    maintenanceType: S.optional(DbNodeMaintenanceType),
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
  }),
).annotations({ identifier: "DbNode" }) as any as S.Schema<DbNode>;
export interface DbNodeSummary {
  dbNodeId?: string;
  dbNodeArn?: string;
  status?: DbNodeResourceStatus;
  statusReason?: string;
  additionalDetails?: string;
  backupIpId?: string;
  backupVnic2Id?: string;
  backupVnicId?: string;
  cpuCoreCount?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServerId?: string;
  dbSystemId?: string;
  faultDomain?: string;
  hostIpId?: string;
  hostname?: string;
  ocid?: string;
  ociResourceAnchorName?: string;
  maintenanceType?: DbNodeMaintenanceType;
  memorySizeInGBs?: number;
  softwareStorageSizeInGB?: number;
  createdAt?: Date;
  timeMaintenanceWindowEnd?: string;
  timeMaintenanceWindowStart?: string;
  totalCpuCoreCount?: number;
  vnic2Id?: string;
  vnicId?: string;
}
export const DbNodeSummary = S.suspend(() =>
  S.Struct({
    dbNodeId: S.optional(S.String),
    dbNodeArn: S.optional(S.String),
    status: S.optional(DbNodeResourceStatus),
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
    maintenanceType: S.optional(DbNodeMaintenanceType),
    memorySizeInGBs: S.optional(S.Number),
    softwareStorageSizeInGB: S.optional(S.Number),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    timeMaintenanceWindowEnd: S.optional(S.String),
    timeMaintenanceWindowStart: S.optional(S.String),
    totalCpuCoreCount: S.optional(S.Number),
    vnic2Id: S.optional(S.String),
    vnicId: S.optional(S.String),
  }),
).annotations({
  identifier: "DbNodeSummary",
}) as any as S.Schema<DbNodeSummary>;
export type DbNodeList = DbNodeSummary[];
export const DbNodeList = S.Array(DbNodeSummary);
export interface OciDnsForwardingConfig {
  domainName?: string;
  ociDnsListenerIp?: string;
}
export const OciDnsForwardingConfig = S.suspend(() =>
  S.Struct({
    domainName: S.optional(S.String),
    ociDnsListenerIp: S.optional(S.String),
  }),
).annotations({
  identifier: "OciDnsForwardingConfig",
}) as any as S.Schema<OciDnsForwardingConfig>;
export type OciDnsForwardingConfigList = OciDnsForwardingConfig[];
export const OciDnsForwardingConfigList = S.Array(OciDnsForwardingConfig);
export type VpcEndpointType = "SERVICENETWORK" | (string & {});
export const VpcEndpointType = S.String;
export interface ServiceNetworkEndpoint {
  vpcEndpointId?: string;
  vpcEndpointType?: VpcEndpointType;
}
export const ServiceNetworkEndpoint = S.suspend(() =>
  S.Struct({
    vpcEndpointId: S.optional(S.String),
    vpcEndpointType: S.optional(VpcEndpointType),
  }),
).annotations({
  identifier: "ServiceNetworkEndpoint",
}) as any as S.Schema<ServiceNetworkEndpoint>;
export type ManagedResourceStatus =
  | "ENABLED"
  | "ENABLING"
  | "DISABLED"
  | "DISABLING"
  | (string & {});
export const ManagedResourceStatus = S.String;
export interface ManagedS3BackupAccess {
  status?: ManagedResourceStatus;
  ipv4Addresses?: string[];
}
export const ManagedS3BackupAccess = S.suspend(() =>
  S.Struct({
    status: S.optional(ManagedResourceStatus),
    ipv4Addresses: S.optional(StringList),
  }),
).annotations({
  identifier: "ManagedS3BackupAccess",
}) as any as S.Schema<ManagedS3BackupAccess>;
export interface ZeroEtlAccess {
  status?: ManagedResourceStatus;
  cidr?: string;
}
export const ZeroEtlAccess = S.suspend(() =>
  S.Struct({
    status: S.optional(ManagedResourceStatus),
    cidr: S.optional(S.String),
  }),
).annotations({
  identifier: "ZeroEtlAccess",
}) as any as S.Schema<ZeroEtlAccess>;
export interface S3Access {
  status?: ManagedResourceStatus;
  ipv4Addresses?: string[];
  domainName?: string;
  s3PolicyDocument?: string;
}
export const S3Access = S.suspend(() =>
  S.Struct({
    status: S.optional(ManagedResourceStatus),
    ipv4Addresses: S.optional(StringList),
    domainName: S.optional(S.String),
    s3PolicyDocument: S.optional(S.String),
  }),
).annotations({ identifier: "S3Access" }) as any as S.Schema<S3Access>;
export interface StsAccess {
  status?: ManagedResourceStatus;
  ipv4Addresses?: string[];
  domainName?: string;
  stsPolicyDocument?: string;
}
export const StsAccess = S.suspend(() =>
  S.Struct({
    status: S.optional(ManagedResourceStatus),
    ipv4Addresses: S.optional(StringList),
    domainName: S.optional(S.String),
    stsPolicyDocument: S.optional(S.String),
  }),
).annotations({ identifier: "StsAccess" }) as any as S.Schema<StsAccess>;
export interface KmsAccess {
  status?: ManagedResourceStatus;
  ipv4Addresses?: string[];
  domainName?: string;
  kmsPolicyDocument?: string;
}
export const KmsAccess = S.suspend(() =>
  S.Struct({
    status: S.optional(ManagedResourceStatus),
    ipv4Addresses: S.optional(StringList),
    domainName: S.optional(S.String),
    kmsPolicyDocument: S.optional(S.String),
  }),
).annotations({ identifier: "KmsAccess" }) as any as S.Schema<KmsAccess>;
export interface CrossRegionS3RestoreSourcesAccess {
  region?: string;
  ipv4Addresses?: string[];
  status?: ManagedResourceStatus;
}
export const CrossRegionS3RestoreSourcesAccess = S.suspend(() =>
  S.Struct({
    region: S.optional(S.String),
    ipv4Addresses: S.optional(StringList),
    status: S.optional(ManagedResourceStatus),
  }),
).annotations({
  identifier: "CrossRegionS3RestoreSourcesAccess",
}) as any as S.Schema<CrossRegionS3RestoreSourcesAccess>;
export type CrossRegionS3RestoreSourcesAccessList =
  CrossRegionS3RestoreSourcesAccess[];
export const CrossRegionS3RestoreSourcesAccessList = S.Array(
  CrossRegionS3RestoreSourcesAccess,
);
export interface ManagedServices {
  serviceNetworkArn?: string;
  resourceGatewayArn?: string;
  managedServicesIpv4Cidrs?: string[];
  serviceNetworkEndpoint?: ServiceNetworkEndpoint;
  managedS3BackupAccess?: ManagedS3BackupAccess;
  zeroEtlAccess?: ZeroEtlAccess;
  s3Access?: S3Access;
  stsAccess?: StsAccess;
  kmsAccess?: KmsAccess;
  crossRegionS3RestoreSourcesAccess?: CrossRegionS3RestoreSourcesAccess[];
}
export const ManagedServices = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ManagedServices",
}) as any as S.Schema<ManagedServices>;
export interface OdbNetworkSummary {
  odbNetworkId: string;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  odbNetworkArn?: string;
  availabilityZone?: string;
  availabilityZoneId?: string;
  clientSubnetCidr?: string;
  backupSubnetCidr?: string;
  customDomainName?: string;
  defaultDnsPrefix?: string;
  peeredCidrs?: string[];
  ociNetworkAnchorId?: string;
  ociNetworkAnchorUrl?: string;
  ociResourceAnchorName?: string;
  ociVcnId?: string;
  ociVcnUrl?: string;
  ociDnsForwardingConfigs?: OciDnsForwardingConfig[];
  createdAt?: Date;
  percentProgress?: number;
  managedServices?: ManagedServices;
}
export const OdbNetworkSummary = S.suspend(() =>
  S.Struct({
    odbNetworkId: S.String,
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
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
  }),
).annotations({
  identifier: "OdbNetworkSummary",
}) as any as S.Schema<OdbNetworkSummary>;
export type OdbNetworkList = OdbNetworkSummary[];
export const OdbNetworkList = S.Array(OdbNetworkSummary);
export interface OdbPeeringConnection {
  odbPeeringConnectionId: string;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  odbPeeringConnectionArn?: string;
  odbNetworkArn?: string;
  peerNetworkArn?: string;
  odbPeeringConnectionType?: string;
  peerNetworkCidrs?: string[];
  createdAt?: Date;
  percentProgress?: number;
}
export const OdbPeeringConnection = S.suspend(() =>
  S.Struct({
    odbPeeringConnectionId: S.String,
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    odbPeeringConnectionArn: S.optional(S.String),
    odbNetworkArn: S.optional(S.String),
    peerNetworkArn: S.optional(S.String),
    odbPeeringConnectionType: S.optional(S.String),
    peerNetworkCidrs: S.optional(PeeredCidrList),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    percentProgress: S.optional(S.Number),
  }),
).annotations({
  identifier: "OdbPeeringConnection",
}) as any as S.Schema<OdbPeeringConnection>;
export interface OdbPeeringConnectionSummary {
  odbPeeringConnectionId: string;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  odbPeeringConnectionArn?: string;
  odbNetworkArn?: string;
  peerNetworkArn?: string;
  odbPeeringConnectionType?: string;
  peerNetworkCidrs?: string[];
  createdAt?: Date;
  percentProgress?: number;
}
export const OdbPeeringConnectionSummary = S.suspend(() =>
  S.Struct({
    odbPeeringConnectionId: S.String,
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    odbPeeringConnectionArn: S.optional(S.String),
    odbNetworkArn: S.optional(S.String),
    peerNetworkArn: S.optional(S.String),
    odbPeeringConnectionType: S.optional(S.String),
    peerNetworkCidrs: S.optional(PeeredCidrList),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    percentProgress: S.optional(S.Number),
  }),
).annotations({
  identifier: "OdbPeeringConnectionSummary",
}) as any as S.Schema<OdbPeeringConnectionSummary>;
export type OdbPeeringConnectionList = OdbPeeringConnectionSummary[];
export const OdbPeeringConnectionList = S.Array(OdbPeeringConnectionSummary);
export interface ListDbSystemShapesOutput {
  nextToken?: string;
  dbSystemShapes: DbSystemShapeSummary[];
}
export const ListDbSystemShapesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    dbSystemShapes: DbSystemShapeList,
  }),
).annotations({
  identifier: "ListDbSystemShapesOutput",
}) as any as S.Schema<ListDbSystemShapesOutput>;
export interface ListGiVersionsOutput {
  nextToken?: string;
  giVersions: GiVersionSummary[];
}
export const ListGiVersionsOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), giVersions: GiVersionList }),
).annotations({
  identifier: "ListGiVersionsOutput",
}) as any as S.Schema<ListGiVersionsOutput>;
export interface ListSystemVersionsOutput {
  nextToken?: string;
  systemVersions: SystemVersionSummary[];
}
export const ListSystemVersionsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    systemVersions: SystemVersionList,
  }),
).annotations({
  identifier: "ListSystemVersionsOutput",
}) as any as S.Schema<ListSystemVersionsOutput>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(ResponseTagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface CreateCloudAutonomousVmClusterInput {
  cloudExadataInfrastructureId: string;
  odbNetworkId: string;
  displayName: string;
  clientToken?: string;
  autonomousDataStorageSizeInTBs: number;
  cpuCoreCountPerNode: number;
  dbServers?: string[];
  description?: string;
  isMtlsEnabledVmCluster?: boolean;
  licenseModel?: LicenseModel;
  maintenanceWindow?: MaintenanceWindow;
  memoryPerOracleComputeUnitInGBs: number;
  scanListenerPortNonTls?: number;
  scanListenerPortTls?: number;
  tags?: { [key: string]: string | undefined };
  timeZone?: string;
  totalContainerDatabases: number;
}
export const CreateCloudAutonomousVmClusterInput = S.suspend(() =>
  S.Struct({
    cloudExadataInfrastructureId: S.String,
    odbNetworkId: S.String,
    displayName: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    autonomousDataStorageSizeInTBs: S.Number,
    cpuCoreCountPerNode: S.Number,
    dbServers: S.optional(StringList),
    description: S.optional(S.String),
    isMtlsEnabledVmCluster: S.optional(S.Boolean),
    licenseModel: S.optional(LicenseModel),
    maintenanceWindow: S.optional(MaintenanceWindow),
    memoryPerOracleComputeUnitInGBs: S.Number,
    scanListenerPortNonTls: S.optional(S.Number),
    scanListenerPortTls: S.optional(S.Number),
    tags: S.optional(RequestTagMap),
    timeZone: S.optional(S.String),
    totalContainerDatabases: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCloudAutonomousVmClusterInput",
}) as any as S.Schema<CreateCloudAutonomousVmClusterInput>;
export interface GetCloudAutonomousVmClusterOutput {
  cloudAutonomousVmCluster?: CloudAutonomousVmCluster;
}
export const GetCloudAutonomousVmClusterOutput = S.suspend(() =>
  S.Struct({ cloudAutonomousVmCluster: S.optional(CloudAutonomousVmCluster) }),
).annotations({
  identifier: "GetCloudAutonomousVmClusterOutput",
}) as any as S.Schema<GetCloudAutonomousVmClusterOutput>;
export interface ListCloudAutonomousVmClustersOutput {
  nextToken?: string;
  cloudAutonomousVmClusters: CloudAutonomousVmClusterSummary[];
}
export const ListCloudAutonomousVmClustersOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    cloudAutonomousVmClusters: CloudAutonomousVmClusterList,
  }),
).annotations({
  identifier: "ListCloudAutonomousVmClustersOutput",
}) as any as S.Schema<ListCloudAutonomousVmClustersOutput>;
export interface ListAutonomousVirtualMachinesOutput {
  nextToken?: string;
  autonomousVirtualMachines: AutonomousVirtualMachineSummary[];
}
export const ListAutonomousVirtualMachinesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    autonomousVirtualMachines: AutonomousVirtualMachineList,
  }),
).annotations({
  identifier: "ListAutonomousVirtualMachinesOutput",
}) as any as S.Schema<ListAutonomousVirtualMachinesOutput>;
export interface CreateCloudExadataInfrastructureOutput {
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudExadataInfrastructureId: string;
}
export const CreateCloudExadataInfrastructureOutput = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    cloudExadataInfrastructureId: S.String,
  }),
).annotations({
  identifier: "CreateCloudExadataInfrastructureOutput",
}) as any as S.Schema<CreateCloudExadataInfrastructureOutput>;
export interface GetCloudExadataInfrastructureOutput {
  cloudExadataInfrastructure?: CloudExadataInfrastructure;
}
export const GetCloudExadataInfrastructureOutput = S.suspend(() =>
  S.Struct({
    cloudExadataInfrastructure: S.optional(CloudExadataInfrastructure),
  }),
).annotations({
  identifier: "GetCloudExadataInfrastructureOutput",
}) as any as S.Schema<GetCloudExadataInfrastructureOutput>;
export interface ListCloudExadataInfrastructuresOutput {
  nextToken?: string;
  cloudExadataInfrastructures: CloudExadataInfrastructureSummary[];
}
export const ListCloudExadataInfrastructuresOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    cloudExadataInfrastructures: CloudExadataInfrastructureList,
  }),
).annotations({
  identifier: "ListCloudExadataInfrastructuresOutput",
}) as any as S.Schema<ListCloudExadataInfrastructuresOutput>;
export interface ListDbServersOutput {
  nextToken?: string;
  dbServers: DbServerSummary[];
}
export const ListDbServersOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), dbServers: DbServerList }),
).annotations({
  identifier: "ListDbServersOutput",
}) as any as S.Schema<ListDbServersOutput>;
export interface CreateCloudVmClusterOutput {
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudVmClusterId: string;
}
export const CreateCloudVmClusterOutput = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    cloudVmClusterId: S.String,
  }),
).annotations({
  identifier: "CreateCloudVmClusterOutput",
}) as any as S.Schema<CreateCloudVmClusterOutput>;
export interface ListCloudVmClustersOutput {
  nextToken?: string;
  cloudVmClusters: CloudVmClusterSummary[];
}
export const ListCloudVmClustersOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    cloudVmClusters: CloudVmClusterList,
  }),
).annotations({
  identifier: "ListCloudVmClustersOutput",
}) as any as S.Schema<ListCloudVmClustersOutput>;
export interface GetDbNodeOutput {
  dbNode?: DbNode;
}
export const GetDbNodeOutput = S.suspend(() =>
  S.Struct({ dbNode: S.optional(DbNode) }),
).annotations({
  identifier: "GetDbNodeOutput",
}) as any as S.Schema<GetDbNodeOutput>;
export interface ListDbNodesOutput {
  nextToken?: string;
  dbNodes: DbNodeSummary[];
}
export const ListDbNodesOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), dbNodes: DbNodeList }),
).annotations({
  identifier: "ListDbNodesOutput",
}) as any as S.Schema<ListDbNodesOutput>;
export interface ListOdbNetworksOutput {
  nextToken?: string;
  odbNetworks: OdbNetworkSummary[];
}
export const ListOdbNetworksOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), odbNetworks: OdbNetworkList }),
).annotations({
  identifier: "ListOdbNetworksOutput",
}) as any as S.Schema<ListOdbNetworksOutput>;
export interface GetOdbPeeringConnectionOutput {
  odbPeeringConnection?: OdbPeeringConnection;
}
export const GetOdbPeeringConnectionOutput = S.suspend(() =>
  S.Struct({ odbPeeringConnection: S.optional(OdbPeeringConnection) }),
).annotations({
  identifier: "GetOdbPeeringConnectionOutput",
}) as any as S.Schema<GetOdbPeeringConnectionOutput>;
export interface ListOdbPeeringConnectionsOutput {
  nextToken?: string;
  odbPeeringConnections: OdbPeeringConnectionSummary[];
}
export const ListOdbPeeringConnectionsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    odbPeeringConnections: OdbPeeringConnectionList,
  }),
).annotations({
  identifier: "ListOdbPeeringConnectionsOutput",
}) as any as S.Schema<ListOdbPeeringConnectionsOutput>;
export interface CloudAutonomousVmClusterResourceDetails {
  cloudAutonomousVmClusterId?: string;
  unallocatedAdbStorageInTBs?: number;
}
export const CloudAutonomousVmClusterResourceDetails = S.suspend(() =>
  S.Struct({
    cloudAutonomousVmClusterId: S.optional(S.String),
    unallocatedAdbStorageInTBs: S.optional(S.Number),
  }),
).annotations({
  identifier: "CloudAutonomousVmClusterResourceDetails",
}) as any as S.Schema<CloudAutonomousVmClusterResourceDetails>;
export type CloudAutonomousVmClusterResourceDetailsList =
  CloudAutonomousVmClusterResourceDetails[];
export const CloudAutonomousVmClusterResourceDetailsList = S.Array(
  CloudAutonomousVmClusterResourceDetails,
);
export interface CloudExadataInfrastructureUnallocatedResources {
  cloudAutonomousVmClusters?: CloudAutonomousVmClusterResourceDetails[];
  cloudExadataInfrastructureDisplayName?: string;
  exadataStorageInTBs?: number;
  cloudExadataInfrastructureId?: string;
  localStorageInGBs?: number;
  memoryInGBs?: number;
  ocpus?: number;
}
export const CloudExadataInfrastructureUnallocatedResources = S.suspend(() =>
  S.Struct({
    cloudAutonomousVmClusters: S.optional(
      CloudAutonomousVmClusterResourceDetailsList,
    ),
    cloudExadataInfrastructureDisplayName: S.optional(S.String),
    exadataStorageInTBs: S.optional(S.Number),
    cloudExadataInfrastructureId: S.optional(S.String),
    localStorageInGBs: S.optional(S.Number),
    memoryInGBs: S.optional(S.Number),
    ocpus: S.optional(S.Number),
  }),
).annotations({
  identifier: "CloudExadataInfrastructureUnallocatedResources",
}) as any as S.Schema<CloudExadataInfrastructureUnallocatedResources>;
export interface DbServer {
  dbServerId?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cpuCoreCount?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServerPatchingDetails?: DbServerPatchingDetails;
  displayName?: string;
  exadataInfrastructureId?: string;
  ocid?: string;
  ociResourceAnchorName?: string;
  maxCpuCount?: number;
  maxDbNodeStorageInGBs?: number;
  maxMemoryInGBs?: number;
  memorySizeInGBs?: number;
  shape?: string;
  createdAt?: Date;
  vmClusterIds?: string[];
  computeModel?: ComputeModel;
  autonomousVmClusterIds?: string[];
  autonomousVirtualMachineIds?: string[];
}
export const DbServer = S.suspend(() =>
  S.Struct({
    dbServerId: S.optional(S.String),
    status: S.optional(ResourceStatus),
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
    computeModel: S.optional(ComputeModel),
    autonomousVmClusterIds: S.optional(StringList),
    autonomousVirtualMachineIds: S.optional(StringList),
  }),
).annotations({ identifier: "DbServer" }) as any as S.Schema<DbServer>;
export type ValidationExceptionReason =
  | "unknownOperation"
  | "cannotParse"
  | "fieldValidationFailed"
  | "other"
  | (string & {});
export const ValidationExceptionReason = S.String;
export interface CreateCloudAutonomousVmClusterOutput {
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudAutonomousVmClusterId: string;
}
export const CreateCloudAutonomousVmClusterOutput = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
    statusReason: S.optional(S.String),
    cloudAutonomousVmClusterId: S.String,
  }),
).annotations({
  identifier: "CreateCloudAutonomousVmClusterOutput",
}) as any as S.Schema<CreateCloudAutonomousVmClusterOutput>;
export interface GetCloudExadataInfrastructureUnallocatedResourcesOutput {
  cloudExadataInfrastructureUnallocatedResources?: CloudExadataInfrastructureUnallocatedResources;
}
export const GetCloudExadataInfrastructureUnallocatedResourcesOutput =
  S.suspend(() =>
    S.Struct({
      cloudExadataInfrastructureUnallocatedResources: S.optional(
        CloudExadataInfrastructureUnallocatedResources,
      ),
    }),
  ).annotations({
    identifier: "GetCloudExadataInfrastructureUnallocatedResourcesOutput",
  }) as any as S.Schema<GetCloudExadataInfrastructureUnallocatedResourcesOutput>;
export interface GetDbServerOutput {
  dbServer?: DbServer;
}
export const GetDbServerOutput = S.suspend(() =>
  S.Struct({ dbServer: S.optional(DbServer) }),
).annotations({
  identifier: "GetDbServerOutput",
}) as any as S.Schema<GetDbServerOutput>;
export interface CloudVmCluster {
  cloudVmClusterId: string;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  cloudVmClusterArn?: string;
  cloudExadataInfrastructureId?: string;
  cloudExadataInfrastructureArn?: string;
  clusterName?: string;
  cpuCoreCount?: number;
  dataCollectionOptions?: DataCollectionOptions;
  dataStorageSizeInTBs?: number;
  dbNodeStorageSizeInGBs?: number;
  dbServers?: string[];
  diskRedundancy?: DiskRedundancy;
  giVersion?: string;
  hostname?: string;
  iormConfigCache?: ExadataIormConfig;
  isLocalBackupEnabled?: boolean;
  isSparseDiskgroupEnabled?: boolean;
  lastUpdateHistoryEntryId?: string;
  licenseModel?: LicenseModel;
  listenerPort?: number;
  memorySizeInGBs?: number;
  nodeCount?: number;
  ocid?: string;
  ociResourceAnchorName?: string;
  ociUrl?: string;
  domain?: string;
  scanDnsName?: string;
  scanDnsRecordId?: string;
  scanIpIds?: string[];
  shape?: string;
  sshPublicKeys?: string | redacted.Redacted<string>[];
  storageSizeInGBs?: number;
  systemVersion?: string;
  createdAt?: Date;
  timeZone?: string;
  vipIds?: string[];
  odbNetworkId?: string;
  odbNetworkArn?: string;
  percentProgress?: number;
  computeModel?: ComputeModel;
  iamRoles?: IamRole[];
}
export const CloudVmCluster = S.suspend(() =>
  S.Struct({
    cloudVmClusterId: S.String,
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
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
    diskRedundancy: S.optional(DiskRedundancy),
    giVersion: S.optional(S.String),
    hostname: S.optional(S.String),
    iormConfigCache: S.optional(ExadataIormConfig),
    isLocalBackupEnabled: S.optional(S.Boolean),
    isSparseDiskgroupEnabled: S.optional(S.Boolean),
    lastUpdateHistoryEntryId: S.optional(S.String),
    licenseModel: S.optional(LicenseModel),
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
    computeModel: S.optional(ComputeModel),
    iamRoles: S.optional(IamRoleList),
  }),
).annotations({
  identifier: "CloudVmCluster",
}) as any as S.Schema<CloudVmCluster>;
export interface OdbNetwork {
  odbNetworkId: string;
  displayName?: string;
  status?: ResourceStatus;
  statusReason?: string;
  odbNetworkArn?: string;
  availabilityZone?: string;
  availabilityZoneId?: string;
  clientSubnetCidr?: string;
  backupSubnetCidr?: string;
  customDomainName?: string;
  defaultDnsPrefix?: string;
  peeredCidrs?: string[];
  ociNetworkAnchorId?: string;
  ociNetworkAnchorUrl?: string;
  ociResourceAnchorName?: string;
  ociVcnId?: string;
  ociVcnUrl?: string;
  ociDnsForwardingConfigs?: OciDnsForwardingConfig[];
  createdAt?: Date;
  percentProgress?: number;
  managedServices?: ManagedServices;
}
export const OdbNetwork = S.suspend(() =>
  S.Struct({
    odbNetworkId: S.String,
    displayName: S.optional(S.String),
    status: S.optional(ResourceStatus),
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
  }),
).annotations({ identifier: "OdbNetwork" }) as any as S.Schema<OdbNetwork>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface GetCloudVmClusterOutput {
  cloudVmCluster?: CloudVmCluster;
}
export const GetCloudVmClusterOutput = S.suspend(() =>
  S.Struct({ cloudVmCluster: S.optional(CloudVmCluster) }),
).annotations({
  identifier: "GetCloudVmClusterOutput",
}) as any as S.Schema<GetCloudVmClusterOutput>;
export interface GetOdbNetworkOutput {
  odbNetwork?: OdbNetwork;
}
export const GetOdbNetworkOutput = S.suspend(() =>
  S.Struct({ odbNetwork: S.optional(OdbNetwork) }),
).annotations({
  identifier: "GetOdbNetworkOutput",
}) as any as S.Schema<GetOdbNetworkOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: ValidationExceptionReason,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Removes tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns information about the tags applied to this resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Applies tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | ServiceQuotaExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * Deletes an Autonomous VM cluster.
 */
export const deleteCloudAutonomousVmCluster: (
  input: DeleteCloudAutonomousVmClusterInput,
) => effect.Effect<
  DeleteCloudAutonomousVmClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCloudVmCluster: (
  input: DeleteCloudVmClusterInput,
) => effect.Effect<
  DeleteCloudVmClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCloudVmClusterInput,
  output: DeleteCloudVmClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the tenancy activation link and onboarding status for your Amazon Web Services account.
 */
export const getOciOnboardingStatus: (
  input: GetOciOnboardingStatusInput,
) => effect.Effect<
  GetOciOnboardingStatusOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOciOnboardingStatusInput,
  output: GetOciOnboardingStatusOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Autonomous VM cluster in the specified Exadata infrastructure.
 */
export const createCloudAutonomousVmCluster: (
  input: CreateCloudAutonomousVmClusterInput,
) => effect.Effect<
  CreateCloudAutonomousVmClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCloudExadataInfrastructureUnallocatedResources: (
  input: GetCloudExadataInfrastructureUnallocatedResourcesInput,
) => effect.Effect<
  GetCloudExadataInfrastructureUnallocatedResourcesOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDbServer: (
  input: GetDbServerInput,
) => effect.Effect<
  GetDbServerOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDbSystemShapes: {
  (
    input: ListDbSystemShapesInput,
  ): effect.Effect<
    ListDbSystemShapesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDbSystemShapesInput,
  ) => stream.Stream<
    ListDbSystemShapesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDbSystemShapesInput,
  ) => stream.Stream<
    DbSystemShapeSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns information about Oracle Grid Infrastructure (GI) software versions that are available for a VM cluster for the specified shape.
 */
export const listGiVersions: {
  (
    input: ListGiVersionsInput,
  ): effect.Effect<
    ListGiVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGiVersionsInput,
  ) => stream.Stream<
    ListGiVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGiVersionsInput,
  ) => stream.Stream<
    GiVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns information about the system versions that are available for a VM cluster for the specified `giVersion` and `shape`.
 */
export const listSystemVersions: {
  (
    input: ListSystemVersionsInput,
  ): effect.Effect<
    ListSystemVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSystemVersionsInput,
  ) => stream.Stream<
    ListSystemVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSystemVersionsInput,
  ) => stream.Stream<
    SystemVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Gets information about a specific Autonomous VM cluster.
 */
export const getCloudAutonomousVmCluster: (
  input: GetCloudAutonomousVmClusterInput,
) => effect.Effect<
  GetCloudAutonomousVmClusterOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCloudAutonomousVmClusterInput,
  output: GetCloudAutonomousVmClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all Autonomous VM clusters in a specified Cloud Exadata infrastructure.
 */
export const listCloudAutonomousVmClusters: {
  (
    input: ListCloudAutonomousVmClustersInput,
  ): effect.Effect<
    ListCloudAutonomousVmClustersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCloudAutonomousVmClustersInput,
  ) => stream.Stream<
    ListCloudAutonomousVmClustersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCloudAutonomousVmClustersInput,
  ) => stream.Stream<
    CloudAutonomousVmClusterSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listAutonomousVirtualMachines: {
  (
    input: ListAutonomousVirtualMachinesInput,
  ): effect.Effect<
    ListAutonomousVirtualMachinesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutonomousVirtualMachinesInput,
  ) => stream.Stream<
    ListAutonomousVirtualMachinesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutonomousVirtualMachinesInput,
  ) => stream.Stream<
    AutonomousVirtualMachineSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getCloudExadataInfrastructure: (
  input: GetCloudExadataInfrastructureInput,
) => effect.Effect<
  GetCloudExadataInfrastructureOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCloudExadataInfrastructures: {
  (
    input: ListCloudExadataInfrastructuresInput,
  ): effect.Effect<
    ListCloudExadataInfrastructuresOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCloudExadataInfrastructuresInput,
  ) => stream.Stream<
    ListCloudExadataInfrastructuresOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCloudExadataInfrastructuresInput,
  ) => stream.Stream<
    CloudExadataInfrastructureSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listDbServers: {
  (
    input: ListDbServersInput,
  ): effect.Effect<
    ListDbServersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDbServersInput,
  ) => stream.Stream<
    ListDbServersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDbServersInput,
  ) => stream.Stream<
    DbServerSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns information about the VM clusters owned by your Amazon Web Services account or only the ones on the specified Exadata infrastructure.
 */
export const listCloudVmClusters: {
  (
    input: ListCloudVmClustersInput,
  ): effect.Effect<
    ListCloudVmClustersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCloudVmClustersInput,
  ) => stream.Stream<
    ListCloudVmClustersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCloudVmClustersInput,
  ) => stream.Stream<
    CloudVmClusterSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getDbNode: (
  input: GetDbNodeInput,
) => effect.Effect<
  GetDbNodeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDbNodes: {
  (
    input: ListDbNodesInput,
  ): effect.Effect<
    ListDbNodesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDbNodesInput,
  ) => stream.Stream<
    ListDbNodesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDbNodesInput,
  ) => stream.Stream<
    DbNodeSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns information about the ODB networks owned by your Amazon Web Services account.
 */
export const listOdbNetworks: {
  (
    input: ListOdbNetworksInput,
  ): effect.Effect<
    ListOdbNetworksOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOdbNetworksInput,
  ) => stream.Stream<
    ListOdbNetworksOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOdbNetworksInput,
  ) => stream.Stream<
    OdbNetworkSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Retrieves information about an ODB peering connection.
 */
export const getOdbPeeringConnection: (
  input: GetOdbPeeringConnectionInput,
) => effect.Effect<
  GetOdbPeeringConnectionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOdbPeeringConnectionInput,
  output: GetOdbPeeringConnectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all ODB peering connections or those associated with a specific ODB network.
 */
export const listOdbPeeringConnections: {
  (
    input: ListOdbPeeringConnectionsInput,
  ): effect.Effect<
    ListOdbPeeringConnectionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOdbPeeringConnectionsInput,
  ) => stream.Stream<
    ListOdbPeeringConnectionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOdbPeeringConnectionsInput,
  ) => stream.Stream<
    OdbPeeringConnectionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateCloudExadataInfrastructure: (
  input: UpdateCloudExadataInfrastructureInput,
) => effect.Effect<
  UpdateCloudExadataInfrastructureOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateOdbNetwork: (
  input: UpdateOdbNetworkInput,
) => effect.Effect<
  UpdateOdbNetworkOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createOdbPeeringConnection: (
  input: CreateOdbPeeringConnectionInput,
) => effect.Effect<
  CreateOdbPeeringConnectionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Modifies the settings of an Oracle Database@Amazon Web Services peering connection. You can update the display name and add or remove CIDR blocks from the peering connection.
 */
export const updateOdbPeeringConnection: (
  input: UpdateOdbPeeringConnectionInput,
) => effect.Effect<
  UpdateOdbPeeringConnectionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates an Amazon Web Services Identity and Access Management (IAM) service role with a specified resource to enable Amazon Web Services service integration.
 */
export const associateIamRoleToResource: (
  input: AssociateIamRoleToResourceInput,
) => effect.Effect<
  AssociateIamRoleToResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates an Amazon Web Services Identity and Access Management (IAM) service role from a specified resource to disable Amazon Web Services service integration.
 */
export const disassociateIamRoleFromResource: (
  input: DisassociateIamRoleFromResourceInput,
) => effect.Effect<
  DisassociateIamRoleFromResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCloudExadataInfrastructure: (
  input: DeleteCloudExadataInfrastructureInput,
) => effect.Effect<
  DeleteCloudExadataInfrastructureOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const rebootDbNode: (
  input: RebootDbNodeInput,
) => effect.Effect<
  RebootDbNodeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startDbNode: (
  input: StartDbNodeInput,
) => effect.Effect<
  StartDbNodeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopDbNode: (
  input: StopDbNodeInput,
) => effect.Effect<
  StopDbNodeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const initializeService: (
  input: InitializeServiceInput,
) => effect.Effect<
  InitializeServiceOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteOdbNetwork: (
  input: DeleteOdbNetworkInput,
) => effect.Effect<
  DeleteOdbNetworkOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteOdbPeeringConnection: (
  input: DeleteOdbPeeringConnectionInput,
) => effect.Effect<
  DeleteOdbPeeringConnectionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOdbPeeringConnectionInput,
  output: DeleteOdbPeeringConnectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Registers the Amazon Web Services Marketplace token for your Amazon Web Services account to activate your Oracle Database@Amazon Web Services subscription.
 */
export const acceptMarketplaceRegistration: (
  input: AcceptMarketplaceRegistrationInput,
) => effect.Effect<
  AcceptMarketplaceRegistrationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCloudExadataInfrastructure: (
  input: CreateCloudExadataInfrastructureInput,
) => effect.Effect<
  CreateCloudExadataInfrastructureOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCloudVmCluster: (
  input: CreateCloudVmClusterInput,
) => effect.Effect<
  CreateCloudVmClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates an ODB network.
 */
export const createOdbNetwork: (
  input: CreateOdbNetworkInput,
) => effect.Effect<
  CreateOdbNetworkOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCloudVmCluster: (
  input: GetCloudVmClusterInput,
) => effect.Effect<
  GetCloudVmClusterOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getOdbNetwork: (
  input: GetOdbNetworkInput,
) => effect.Effect<
  GetOdbNetworkOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

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
const svc = T.AwsApiService({
  sdkId: "GuardDuty",
  serviceShapeName: "GuardDutyAPIService",
});
const auth = T.AwsAuthSigv4({ name: "guardduty" });
const ver = T.ServiceVersion("2017-11-28");
const proto = T.AwsProtocolsRestJson1();
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
              `https://guardduty-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://guardduty.${Region}.amazonaws.com`);
            }
            return e(
              `https://guardduty-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://guardduty.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://guardduty.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DetectorId = string;
export type FindingId = string;
export type ClientToken = string;
export type FilterName = string;
export type FilterDescription = string;
export type FilterRank = number;
export type Name = string;
export type Location = string;
export type AccountId = string;
export type FindingType = string;
export type ExpectedBucketOwner = string;
export type IntegerValueWithMax = number;
export type MaxResults = number;
export type MaxResults100 = number;
export type GuardDutyArn = string;
export type ResourceArn = string;
export type TagKey = string;
export type SensitiveString = string | redacted.Redacted<string>;
export type TagValue = string;
export type Email = string | redacted.Redacted<string>;
export type NonEmptyString = string;
export type NonNegativeInteger = number;
export type PositiveLong = number;
export type Match = string;
export type NotMatch = string;
export type LongValue = number;
export type SequenceDescription = string;
export type SignalDescription = string;
export type IndicatorValueString = string;
export type IndicatorTitle = string;
export type ProcessName = string;
export type ProcessPath = string;
export type ProcessSha256 = string;
export type InstanceArn = string;
export type Ec2InstanceUid = string;
export type ContainerUid = string;
export type ContainerImageUid = string;
export type LaunchTemplateVersion = string;

//# Schemas
export interface GetInvitationsCountRequest {}
export const GetInvitationsCountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/invitation/count" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInvitationsCountRequest",
}) as any as S.Schema<GetInvitationsCountRequest>;
export interface GetOrganizationStatisticsRequest {}
export const GetOrganizationStatisticsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetOrganizationStatisticsRequest",
}) as any as S.Schema<GetOrganizationStatisticsRequest>;
export type FindingIds = string[];
export const FindingIds = S.Array(S.String);
export type FindingPublishingFrequency =
  | "FIFTEEN_MINUTES"
  | "ONE_HOUR"
  | "SIX_HOURS";
export const FindingPublishingFrequency = S.Literal(
  "FIFTEEN_MINUTES",
  "ONE_HOUR",
  "SIX_HOURS",
);
export type FilterAction = "NOOP" | "ARCHIVE";
export const FilterAction = S.Literal("NOOP", "ARCHIVE");
export type IpSetFormat =
  | "TXT"
  | "STIX"
  | "OTX_CSV"
  | "ALIEN_VAULT"
  | "PROOF_POINT"
  | "FIRE_EYE";
export const IpSetFormat = S.Literal(
  "TXT",
  "STIX",
  "OTX_CSV",
  "ALIEN_VAULT",
  "PROOF_POINT",
  "FIRE_EYE",
);
export type DestinationType = "S3";
export const DestinationType = S.Literal("S3");
export type FindingTypes = string[];
export const FindingTypes = S.Array(S.String);
export type ThreatEntitySetFormat =
  | "TXT"
  | "STIX"
  | "OTX_CSV"
  | "ALIEN_VAULT"
  | "PROOF_POINT"
  | "FIRE_EYE";
export const ThreatEntitySetFormat = S.Literal(
  "TXT",
  "STIX",
  "OTX_CSV",
  "ALIEN_VAULT",
  "PROOF_POINT",
  "FIRE_EYE",
);
export type ThreatIntelSetFormat =
  | "TXT"
  | "STIX"
  | "OTX_CSV"
  | "ALIEN_VAULT"
  | "PROOF_POINT"
  | "FIRE_EYE";
export const ThreatIntelSetFormat = S.Literal(
  "TXT",
  "STIX",
  "OTX_CSV",
  "ALIEN_VAULT",
  "PROOF_POINT",
  "FIRE_EYE",
);
export type TrustedEntitySetFormat =
  | "TXT"
  | "STIX"
  | "OTX_CSV"
  | "ALIEN_VAULT"
  | "PROOF_POINT"
  | "FIRE_EYE";
export const TrustedEntitySetFormat = S.Literal(
  "TXT",
  "STIX",
  "OTX_CSV",
  "ALIEN_VAULT",
  "PROOF_POINT",
  "FIRE_EYE",
);
export type AccountIds = string[];
export const AccountIds = S.Array(S.String);
export type CoverageStatisticsType =
  | "COUNT_BY_RESOURCE_TYPE"
  | "COUNT_BY_COVERAGE_STATUS";
export const CoverageStatisticsType = S.Literal(
  "COUNT_BY_RESOURCE_TYPE",
  "COUNT_BY_COVERAGE_STATUS",
);
export type CoverageStatisticsTypeList = CoverageStatisticsType[];
export const CoverageStatisticsTypeList = S.Array(CoverageStatisticsType);
export type FindingStatisticType = "COUNT_BY_SEVERITY";
export const FindingStatisticType = S.Literal("COUNT_BY_SEVERITY");
export type FindingStatisticTypes = FindingStatisticType[];
export const FindingStatisticTypes = S.Array(FindingStatisticType);
export type GroupByType =
  | "ACCOUNT"
  | "DATE"
  | "FINDING_TYPE"
  | "RESOURCE"
  | "SEVERITY";
export const GroupByType = S.Literal(
  "ACCOUNT",
  "DATE",
  "FINDING_TYPE",
  "RESOURCE",
  "SEVERITY",
);
export type OrderBy = "ASC" | "DESC";
export const OrderBy = S.Literal("ASC", "DESC");
export type UsageStatisticType =
  | "SUM_BY_ACCOUNT"
  | "SUM_BY_DATA_SOURCE"
  | "SUM_BY_RESOURCE"
  | "TOP_RESOURCES"
  | "SUM_BY_FEATURES"
  | "TOP_ACCOUNTS_BY_FEATURE";
export const UsageStatisticType = S.Literal(
  "SUM_BY_ACCOUNT",
  "SUM_BY_DATA_SOURCE",
  "SUM_BY_RESOURCE",
  "TOP_RESOURCES",
  "SUM_BY_FEATURES",
  "TOP_ACCOUNTS_BY_FEATURE",
);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type Feedback = "USEFUL" | "NOT_USEFUL";
export const Feedback = S.Literal("USEFUL", "NOT_USEFUL");
export type EbsSnapshotPreservation = "NO_RETENTION" | "RETENTION_WITH_FINDING";
export const EbsSnapshotPreservation = S.Literal(
  "NO_RETENTION",
  "RETENTION_WITH_FINDING",
);
export type AutoEnableMembers = "NEW" | "ALL" | "NONE";
export const AutoEnableMembers = S.Literal("NEW", "ALL", "NONE");
export interface AcceptAdministratorInvitationRequest {
  DetectorId: string;
  AdministratorId?: string;
  InvitationId?: string;
}
export const AcceptAdministratorInvitationRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AdministratorId: S.optional(S.String).pipe(T.JsonName("administratorId")),
    InvitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/administrator" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptAdministratorInvitationRequest",
}) as any as S.Schema<AcceptAdministratorInvitationRequest>;
export interface AcceptAdministratorInvitationResponse {}
export const AcceptAdministratorInvitationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AcceptAdministratorInvitationResponse",
}) as any as S.Schema<AcceptAdministratorInvitationResponse>;
export interface AcceptInvitationRequest {
  DetectorId: string;
  MasterId?: string;
  InvitationId?: string;
}
export const AcceptInvitationRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MasterId: S.optional(S.String).pipe(T.JsonName("masterId")),
    InvitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/master" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptInvitationRequest",
}) as any as S.Schema<AcceptInvitationRequest>;
export interface AcceptInvitationResponse {}
export const AcceptInvitationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AcceptInvitationResponse",
}) as any as S.Schema<AcceptInvitationResponse>;
export interface ArchiveFindingsRequest {
  DetectorId: string;
  FindingIds?: string[];
}
export const ArchiveFindingsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingIds: S.optional(FindingIds).pipe(T.JsonName("findingIds")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/findings/archive",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ArchiveFindingsRequest",
}) as any as S.Schema<ArchiveFindingsRequest>;
export interface ArchiveFindingsResponse {}
export const ArchiveFindingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ArchiveFindingsResponse",
}) as any as S.Schema<ArchiveFindingsResponse>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateIPSetRequest {
  DetectorId: string;
  Name?: string;
  Format?: IpSetFormat;
  Location?: string;
  Activate?: boolean;
  ClientToken?: string;
  Tags?: { [key: string]: string };
  ExpectedBucketOwner?: string;
}
export const CreateIPSetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Format: S.optional(IpSetFormat).pipe(T.JsonName("format")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/ipset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIPSetRequest",
}) as any as S.Schema<CreateIPSetRequest>;
export interface CreateSampleFindingsRequest {
  DetectorId: string;
  FindingTypes?: string[];
}
export const CreateSampleFindingsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingTypes: S.optional(FindingTypes).pipe(T.JsonName("findingTypes")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/findings/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSampleFindingsRequest",
}) as any as S.Schema<CreateSampleFindingsRequest>;
export interface CreateSampleFindingsResponse {}
export const CreateSampleFindingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateSampleFindingsResponse",
}) as any as S.Schema<CreateSampleFindingsResponse>;
export interface CreateThreatEntitySetRequest {
  DetectorId: string;
  Name?: string;
  Format?: ThreatEntitySetFormat;
  Location?: string;
  ExpectedBucketOwner?: string;
  Activate?: boolean;
  ClientToken?: string;
  Tags?: { [key: string]: string };
}
export const CreateThreatEntitySetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Format: S.optional(ThreatEntitySetFormat).pipe(T.JsonName("format")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/threatentityset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateThreatEntitySetRequest",
}) as any as S.Schema<CreateThreatEntitySetRequest>;
export interface CreateThreatIntelSetRequest {
  DetectorId: string;
  Name?: string;
  Format?: ThreatIntelSetFormat;
  Location?: string;
  Activate?: boolean;
  ClientToken?: string;
  Tags?: { [key: string]: string };
  ExpectedBucketOwner?: string;
}
export const CreateThreatIntelSetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Format: S.optional(ThreatIntelSetFormat).pipe(T.JsonName("format")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/threatintelset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateThreatIntelSetRequest",
}) as any as S.Schema<CreateThreatIntelSetRequest>;
export interface CreateTrustedEntitySetRequest {
  DetectorId: string;
  Name?: string;
  Format?: TrustedEntitySetFormat;
  Location?: string;
  ExpectedBucketOwner?: string;
  Activate?: boolean;
  ClientToken?: string;
  Tags?: { [key: string]: string };
}
export const CreateTrustedEntitySetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Format: S.optional(TrustedEntitySetFormat).pipe(T.JsonName("format")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/trustedentityset",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrustedEntitySetRequest",
}) as any as S.Schema<CreateTrustedEntitySetRequest>;
export interface DeclineInvitationsRequest {
  AccountIds?: string[];
}
export const DeclineInvitationsRequest = S.suspend(() =>
  S.Struct({
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/invitation/decline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeclineInvitationsRequest",
}) as any as S.Schema<DeclineInvitationsRequest>;
export interface DeleteDetectorRequest {
  DetectorId: string;
}
export const DeleteDetectorRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/detector/{DetectorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDetectorRequest",
}) as any as S.Schema<DeleteDetectorRequest>;
export interface DeleteDetectorResponse {}
export const DeleteDetectorResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteDetectorResponse" },
) as any as S.Schema<DeleteDetectorResponse>;
export interface DeleteFilterRequest {
  DetectorId: string;
  FilterName: string;
}
export const DeleteFilterRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FilterName: S.String.pipe(
      T.HttpLabel("FilterName"),
      T.JsonName("filterName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/detector/{DetectorId}/filter/{FilterName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFilterRequest",
}) as any as S.Schema<DeleteFilterRequest>;
export interface DeleteFilterResponse {}
export const DeleteFilterResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFilterResponse",
}) as any as S.Schema<DeleteFilterResponse>;
export interface DeleteInvitationsRequest {
  AccountIds?: string[];
}
export const DeleteInvitationsRequest = S.suspend(() =>
  S.Struct({
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/invitation/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInvitationsRequest",
}) as any as S.Schema<DeleteInvitationsRequest>;
export interface DeleteIPSetRequest {
  DetectorId: string;
  IpSetId: string;
}
export const DeleteIPSetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    IpSetId: S.String.pipe(T.HttpLabel("IpSetId"), T.JsonName("ipSetId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/detector/{DetectorId}/ipset/{IpSetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIPSetRequest",
}) as any as S.Schema<DeleteIPSetRequest>;
export interface DeleteIPSetResponse {}
export const DeleteIPSetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteIPSetResponse",
}) as any as S.Schema<DeleteIPSetResponse>;
export interface DeleteMalwareProtectionPlanRequest {
  MalwareProtectionPlanId: string;
}
export const DeleteMalwareProtectionPlanRequest = S.suspend(() =>
  S.Struct({
    MalwareProtectionPlanId: S.String.pipe(
      T.HttpLabel("MalwareProtectionPlanId"),
      T.JsonName("malwareProtectionPlanId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/malware-protection-plan/{MalwareProtectionPlanId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMalwareProtectionPlanRequest",
}) as any as S.Schema<DeleteMalwareProtectionPlanRequest>;
export interface DeleteMalwareProtectionPlanResponse {}
export const DeleteMalwareProtectionPlanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMalwareProtectionPlanResponse",
}) as any as S.Schema<DeleteMalwareProtectionPlanResponse>;
export interface DeleteMembersRequest {
  DetectorId: string;
  AccountIds?: string[];
}
export const DeleteMembersRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMembersRequest",
}) as any as S.Schema<DeleteMembersRequest>;
export interface DeletePublishingDestinationRequest {
  DetectorId: string;
  DestinationId: string;
}
export const DeletePublishingDestinationRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    DestinationId: S.String.pipe(
      T.HttpLabel("DestinationId"),
      T.JsonName("destinationId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/detector/{DetectorId}/publishingDestination/{DestinationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePublishingDestinationRequest",
}) as any as S.Schema<DeletePublishingDestinationRequest>;
export interface DeletePublishingDestinationResponse {}
export const DeletePublishingDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePublishingDestinationResponse",
}) as any as S.Schema<DeletePublishingDestinationResponse>;
export interface DeleteThreatEntitySetRequest {
  DetectorId: string;
  ThreatEntitySetId: string;
}
export const DeleteThreatEntitySetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatEntitySetId: S.String.pipe(
      T.HttpLabel("ThreatEntitySetId"),
      T.JsonName("threatEntitySetId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/detector/{DetectorId}/threatentityset/{ThreatEntitySetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteThreatEntitySetRequest",
}) as any as S.Schema<DeleteThreatEntitySetRequest>;
export interface DeleteThreatEntitySetResponse {}
export const DeleteThreatEntitySetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteThreatEntitySetResponse",
}) as any as S.Schema<DeleteThreatEntitySetResponse>;
export interface DeleteThreatIntelSetRequest {
  DetectorId: string;
  ThreatIntelSetId: string;
}
export const DeleteThreatIntelSetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatIntelSetId: S.String.pipe(
      T.HttpLabel("ThreatIntelSetId"),
      T.JsonName("threatIntelSetId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/detector/{DetectorId}/threatintelset/{ThreatIntelSetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteThreatIntelSetRequest",
}) as any as S.Schema<DeleteThreatIntelSetRequest>;
export interface DeleteThreatIntelSetResponse {}
export const DeleteThreatIntelSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteThreatIntelSetResponse",
}) as any as S.Schema<DeleteThreatIntelSetResponse>;
export interface DeleteTrustedEntitySetRequest {
  DetectorId: string;
  TrustedEntitySetId: string;
}
export const DeleteTrustedEntitySetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    TrustedEntitySetId: S.String.pipe(
      T.HttpLabel("TrustedEntitySetId"),
      T.JsonName("trustedEntitySetId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/detector/{DetectorId}/trustedentityset/{TrustedEntitySetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTrustedEntitySetRequest",
}) as any as S.Schema<DeleteTrustedEntitySetRequest>;
export interface DeleteTrustedEntitySetResponse {}
export const DeleteTrustedEntitySetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTrustedEntitySetResponse",
}) as any as S.Schema<DeleteTrustedEntitySetResponse>;
export interface DescribeOrganizationConfigurationRequest {
  DetectorId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeOrganizationConfigurationRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/admin" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOrganizationConfigurationRequest",
}) as any as S.Schema<DescribeOrganizationConfigurationRequest>;
export interface DescribePublishingDestinationRequest {
  DetectorId: string;
  DestinationId: string;
}
export const DescribePublishingDestinationRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    DestinationId: S.String.pipe(
      T.HttpLabel("DestinationId"),
      T.JsonName("destinationId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/detector/{DetectorId}/publishingDestination/{DestinationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePublishingDestinationRequest",
}) as any as S.Schema<DescribePublishingDestinationRequest>;
export interface DisableOrganizationAdminAccountRequest {
  AdminAccountId?: string;
}
export const DisableOrganizationAdminAccountRequest = S.suspend(() =>
  S.Struct({
    AdminAccountId: S.optional(S.String).pipe(T.JsonName("adminAccountId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/admin/disable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableOrganizationAdminAccountRequest",
}) as any as S.Schema<DisableOrganizationAdminAccountRequest>;
export interface DisableOrganizationAdminAccountResponse {}
export const DisableOrganizationAdminAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisableOrganizationAdminAccountResponse",
}) as any as S.Schema<DisableOrganizationAdminAccountResponse>;
export interface DisassociateFromAdministratorAccountRequest {
  DetectorId: string;
}
export const DisassociateFromAdministratorAccountRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/administrator/disassociate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateFromAdministratorAccountRequest",
}) as any as S.Schema<DisassociateFromAdministratorAccountRequest>;
export interface DisassociateFromAdministratorAccountResponse {}
export const DisassociateFromAdministratorAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateFromAdministratorAccountResponse",
}) as any as S.Schema<DisassociateFromAdministratorAccountResponse>;
export interface DisassociateFromMasterAccountRequest {
  DetectorId: string;
}
export const DisassociateFromMasterAccountRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/master/disassociate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateFromMasterAccountRequest",
}) as any as S.Schema<DisassociateFromMasterAccountRequest>;
export interface DisassociateFromMasterAccountResponse {}
export const DisassociateFromMasterAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateFromMasterAccountResponse",
}) as any as S.Schema<DisassociateFromMasterAccountResponse>;
export interface DisassociateMembersRequest {
  DetectorId: string;
  AccountIds?: string[];
}
export const DisassociateMembersRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/member/disassociate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateMembersRequest",
}) as any as S.Schema<DisassociateMembersRequest>;
export interface EnableOrganizationAdminAccountRequest {
  AdminAccountId?: string;
}
export const EnableOrganizationAdminAccountRequest = S.suspend(() =>
  S.Struct({
    AdminAccountId: S.optional(S.String).pipe(T.JsonName("adminAccountId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/admin/enable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableOrganizationAdminAccountRequest",
}) as any as S.Schema<EnableOrganizationAdminAccountRequest>;
export interface EnableOrganizationAdminAccountResponse {}
export const EnableOrganizationAdminAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "EnableOrganizationAdminAccountResponse",
}) as any as S.Schema<EnableOrganizationAdminAccountResponse>;
export interface GetAdministratorAccountRequest {
  DetectorId: string;
}
export const GetAdministratorAccountRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/administrator" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAdministratorAccountRequest",
}) as any as S.Schema<GetAdministratorAccountRequest>;
export interface GetDetectorRequest {
  DetectorId: string;
}
export const GetDetectorRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDetectorRequest",
}) as any as S.Schema<GetDetectorRequest>;
export interface GetFilterRequest {
  DetectorId: string;
  FilterName: string;
}
export const GetFilterRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FilterName: S.String.pipe(
      T.HttpLabel("FilterName"),
      T.JsonName("filterName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/detector/{DetectorId}/filter/{FilterName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFilterRequest",
}) as any as S.Schema<GetFilterRequest>;
export interface SortCriteria {
  AttributeName?: string;
  OrderBy?: OrderBy;
}
export const SortCriteria = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
    OrderBy: S.optional(OrderBy).pipe(T.JsonName("orderBy")),
  }),
).annotations({ identifier: "SortCriteria" }) as any as S.Schema<SortCriteria>;
export interface GetFindingsRequest {
  DetectorId: string;
  FindingIds?: string[];
  SortCriteria?: SortCriteria;
}
export const GetFindingsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingIds: S.optional(FindingIds).pipe(T.JsonName("findingIds")),
    SortCriteria: S.optional(SortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "SortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/findings/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingsRequest",
}) as any as S.Schema<GetFindingsRequest>;
export type Eq = string[];
export const Eq = S.Array(S.String);
export type Neq = string[];
export const Neq = S.Array(S.String);
export type Equals = string[];
export const Equals = S.Array(S.String);
export type NotEquals = string[];
export const NotEquals = S.Array(S.String);
export type Matches = string[];
export const Matches = S.Array(S.String);
export type NotMatches = string[];
export const NotMatches = S.Array(S.String);
export interface Condition {
  Eq?: string[];
  Neq?: string[];
  Gt?: number;
  Gte?: number;
  Lt?: number;
  Lte?: number;
  Equals?: string[];
  NotEquals?: string[];
  GreaterThan?: number;
  GreaterThanOrEqual?: number;
  LessThan?: number;
  LessThanOrEqual?: number;
  Matches?: string[];
  NotMatches?: string[];
}
export const Condition = S.suspend(() =>
  S.Struct({
    Eq: S.optional(Eq).pipe(T.JsonName("eq")),
    Neq: S.optional(Neq).pipe(T.JsonName("neq")),
    Gt: S.optional(S.Number).pipe(T.JsonName("gt")),
    Gte: S.optional(S.Number).pipe(T.JsonName("gte")),
    Lt: S.optional(S.Number).pipe(T.JsonName("lt")),
    Lte: S.optional(S.Number).pipe(T.JsonName("lte")),
    Equals: S.optional(Equals).pipe(T.JsonName("equals")),
    NotEquals: S.optional(NotEquals).pipe(T.JsonName("notEquals")),
    GreaterThan: S.optional(S.Number).pipe(T.JsonName("greaterThan")),
    GreaterThanOrEqual: S.optional(S.Number).pipe(
      T.JsonName("greaterThanOrEqual"),
    ),
    LessThan: S.optional(S.Number).pipe(T.JsonName("lessThan")),
    LessThanOrEqual: S.optional(S.Number).pipe(T.JsonName("lessThanOrEqual")),
    Matches: S.optional(Matches).pipe(T.JsonName("matches")),
    NotMatches: S.optional(NotMatches).pipe(T.JsonName("notMatches")),
  }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export type Criterion = { [key: string]: Condition };
export const Criterion = S.Record({ key: S.String, value: Condition });
export interface FindingCriteria {
  Criterion?: { [key: string]: Condition };
}
export const FindingCriteria = S.suspend(() =>
  S.Struct({ Criterion: S.optional(Criterion).pipe(T.JsonName("criterion")) }),
).annotations({
  identifier: "FindingCriteria",
}) as any as S.Schema<FindingCriteria>;
export interface GetFindingsStatisticsRequest {
  DetectorId: string;
  FindingStatisticTypes?: FindingStatisticType[];
  FindingCriteria?: FindingCriteria;
  GroupBy?: GroupByType;
  OrderBy?: OrderBy;
  MaxResults?: number;
}
export const GetFindingsStatisticsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingStatisticTypes: S.optional(FindingStatisticTypes).pipe(
      T.JsonName("findingStatisticTypes"),
    ),
    FindingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
    GroupBy: S.optional(GroupByType).pipe(T.JsonName("groupBy")),
    OrderBy: S.optional(OrderBy).pipe(T.JsonName("orderBy")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/findings/statistics",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingsStatisticsRequest",
}) as any as S.Schema<GetFindingsStatisticsRequest>;
export interface GetInvitationsCountResponse {
  InvitationsCount?: number;
}
export const GetInvitationsCountResponse = S.suspend(() =>
  S.Struct({
    InvitationsCount: S.optional(S.Number).pipe(T.JsonName("invitationsCount")),
  }),
).annotations({
  identifier: "GetInvitationsCountResponse",
}) as any as S.Schema<GetInvitationsCountResponse>;
export interface GetIPSetRequest {
  DetectorId: string;
  IpSetId: string;
}
export const GetIPSetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    IpSetId: S.String.pipe(T.HttpLabel("IpSetId"), T.JsonName("ipSetId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/ipset/{IpSetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIPSetRequest",
}) as any as S.Schema<GetIPSetRequest>;
export interface GetMalwareProtectionPlanRequest {
  MalwareProtectionPlanId: string;
}
export const GetMalwareProtectionPlanRequest = S.suspend(() =>
  S.Struct({
    MalwareProtectionPlanId: S.String.pipe(
      T.HttpLabel("MalwareProtectionPlanId"),
      T.JsonName("malwareProtectionPlanId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/malware-protection-plan/{MalwareProtectionPlanId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMalwareProtectionPlanRequest",
}) as any as S.Schema<GetMalwareProtectionPlanRequest>;
export interface GetMalwareScanRequest {
  ScanId: string;
}
export const GetMalwareScanRequest = S.suspend(() =>
  S.Struct({
    ScanId: S.String.pipe(T.HttpLabel("ScanId"), T.JsonName("scanId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/malware-scan/{ScanId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMalwareScanRequest",
}) as any as S.Schema<GetMalwareScanRequest>;
export interface GetMalwareScanSettingsRequest {
  DetectorId: string;
}
export const GetMalwareScanSettingsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/detector/{DetectorId}/malware-scan-settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMalwareScanSettingsRequest",
}) as any as S.Schema<GetMalwareScanSettingsRequest>;
export interface GetMasterAccountRequest {
  DetectorId: string;
}
export const GetMasterAccountRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/master" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMasterAccountRequest",
}) as any as S.Schema<GetMasterAccountRequest>;
export interface GetMemberDetectorsRequest {
  DetectorId: string;
  AccountIds?: string[];
}
export const GetMemberDetectorsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/member/detector/get",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMemberDetectorsRequest",
}) as any as S.Schema<GetMemberDetectorsRequest>;
export interface GetMembersRequest {
  DetectorId: string;
  AccountIds?: string[];
}
export const GetMembersRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMembersRequest",
}) as any as S.Schema<GetMembersRequest>;
export interface GetRemainingFreeTrialDaysRequest {
  DetectorId: string;
  AccountIds?: string[];
}
export const GetRemainingFreeTrialDaysRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/freeTrial/daysRemaining",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRemainingFreeTrialDaysRequest",
}) as any as S.Schema<GetRemainingFreeTrialDaysRequest>;
export interface GetThreatEntitySetRequest {
  DetectorId: string;
  ThreatEntitySetId: string;
}
export const GetThreatEntitySetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatEntitySetId: S.String.pipe(
      T.HttpLabel("ThreatEntitySetId"),
      T.JsonName("threatEntitySetId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/detector/{DetectorId}/threatentityset/{ThreatEntitySetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetThreatEntitySetRequest",
}) as any as S.Schema<GetThreatEntitySetRequest>;
export interface GetThreatIntelSetRequest {
  DetectorId: string;
  ThreatIntelSetId: string;
}
export const GetThreatIntelSetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatIntelSetId: S.String.pipe(
      T.HttpLabel("ThreatIntelSetId"),
      T.JsonName("threatIntelSetId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/detector/{DetectorId}/threatintelset/{ThreatIntelSetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetThreatIntelSetRequest",
}) as any as S.Schema<GetThreatIntelSetRequest>;
export interface GetTrustedEntitySetRequest {
  DetectorId: string;
  TrustedEntitySetId: string;
}
export const GetTrustedEntitySetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    TrustedEntitySetId: S.String.pipe(
      T.HttpLabel("TrustedEntitySetId"),
      T.JsonName("trustedEntitySetId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/detector/{DetectorId}/trustedentityset/{TrustedEntitySetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrustedEntitySetRequest",
}) as any as S.Schema<GetTrustedEntitySetRequest>;
export interface InviteMembersRequest {
  DetectorId: string;
  AccountIds?: string[];
  DisableEmailNotification?: boolean;
  Message?: string;
}
export const InviteMembersRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
    DisableEmailNotification: S.optional(S.Boolean).pipe(
      T.JsonName("disableEmailNotification"),
    ),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/invite" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InviteMembersRequest",
}) as any as S.Schema<InviteMembersRequest>;
export interface ListDetectorsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListDetectorsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDetectorsRequest",
}) as any as S.Schema<ListDetectorsRequest>;
export interface ListFiltersRequest {
  DetectorId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListFiltersRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/filter" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFiltersRequest",
}) as any as S.Schema<ListFiltersRequest>;
export interface ListFindingsRequest {
  DetectorId: string;
  FindingCriteria?: FindingCriteria;
  SortCriteria?: SortCriteria;
  MaxResults?: number;
  NextToken?: string;
}
export const ListFindingsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
    SortCriteria: S.optional(SortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "SortCriteria" }),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/findings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFindingsRequest",
}) as any as S.Schema<ListFindingsRequest>;
export interface ListInvitationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListInvitationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/invitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInvitationsRequest",
}) as any as S.Schema<ListInvitationsRequest>;
export interface ListIPSetsRequest {
  DetectorId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListIPSetsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/ipset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIPSetsRequest",
}) as any as S.Schema<ListIPSetsRequest>;
export interface ListMalwareProtectionPlansRequest {
  NextToken?: string;
}
export const ListMalwareProtectionPlansRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/malware-protection-plan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMalwareProtectionPlansRequest",
}) as any as S.Schema<ListMalwareProtectionPlansRequest>;
export interface ListMembersRequest {
  DetectorId: string;
  MaxResults?: number;
  NextToken?: string;
  OnlyAssociated?: string;
}
export const ListMembersRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
    OnlyAssociated: S.optional(S.String).pipe(
      T.HttpQuery("onlyAssociated"),
      T.JsonName("onlyAssociated"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/member" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMembersRequest",
}) as any as S.Schema<ListMembersRequest>;
export interface ListOrganizationAdminAccountsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListOrganizationAdminAccountsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/admin" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOrganizationAdminAccountsRequest",
}) as any as S.Schema<ListOrganizationAdminAccountsRequest>;
export interface ListPublishingDestinationsRequest {
  DetectorId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPublishingDestinationsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/detector/{DetectorId}/publishingDestination",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPublishingDestinationsRequest",
}) as any as S.Schema<ListPublishingDestinationsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(
      T.HttpLabel("ResourceArn"),
      T.JsonName("resourceArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListThreatEntitySetsRequest {
  DetectorId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListThreatEntitySetsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/threatentityset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThreatEntitySetsRequest",
}) as any as S.Schema<ListThreatEntitySetsRequest>;
export interface ListThreatIntelSetsRequest {
  DetectorId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListThreatIntelSetsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/threatintelset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThreatIntelSetsRequest",
}) as any as S.Schema<ListThreatIntelSetsRequest>;
export interface ListTrustedEntitySetsRequest {
  DetectorId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTrustedEntitySetsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detector/{DetectorId}/trustedentityset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrustedEntitySetsRequest",
}) as any as S.Schema<ListTrustedEntitySetsRequest>;
export interface StartMonitoringMembersRequest {
  DetectorId: string;
  AccountIds?: string[];
}
export const StartMonitoringMembersRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMonitoringMembersRequest",
}) as any as S.Schema<StartMonitoringMembersRequest>;
export interface StopMonitoringMembersRequest {
  DetectorId: string;
  AccountIds?: string[];
}
export const StopMonitoringMembersRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopMonitoringMembersRequest",
}) as any as S.Schema<StopMonitoringMembersRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(
      T.HttpLabel("ResourceArn"),
      T.JsonName("resourceArn"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UnarchiveFindingsRequest {
  DetectorId: string;
  FindingIds?: string[];
}
export const UnarchiveFindingsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingIds: S.optional(FindingIds).pipe(T.JsonName("findingIds")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/findings/unarchive",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UnarchiveFindingsRequest",
}) as any as S.Schema<UnarchiveFindingsRequest>;
export interface UnarchiveFindingsResponse {}
export const UnarchiveFindingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UnarchiveFindingsResponse",
}) as any as S.Schema<UnarchiveFindingsResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(
      T.HttpLabel("ResourceArn"),
      T.JsonName("resourceArn"),
    ),
    TagKeys: S.optional(TagKeyList).pipe(
      T.HttpQuery("tagKeys"),
      T.JsonName("tagKeys"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface S3LogsConfiguration {
  Enable?: boolean;
}
export const S3LogsConfiguration = S.suspend(() =>
  S.Struct({ Enable: S.optional(S.Boolean).pipe(T.JsonName("enable")) }),
).annotations({
  identifier: "S3LogsConfiguration",
}) as any as S.Schema<S3LogsConfiguration>;
export interface KubernetesAuditLogsConfiguration {
  Enable?: boolean;
}
export const KubernetesAuditLogsConfiguration = S.suspend(() =>
  S.Struct({ Enable: S.optional(S.Boolean).pipe(T.JsonName("enable")) }),
).annotations({
  identifier: "KubernetesAuditLogsConfiguration",
}) as any as S.Schema<KubernetesAuditLogsConfiguration>;
export interface KubernetesConfiguration {
  AuditLogs?: KubernetesAuditLogsConfiguration;
}
export const KubernetesConfiguration = S.suspend(() =>
  S.Struct({
    AuditLogs: S.optional(KubernetesAuditLogsConfiguration)
      .pipe(T.JsonName("auditLogs"))
      .annotations({ identifier: "KubernetesAuditLogsConfiguration" }),
  }),
).annotations({
  identifier: "KubernetesConfiguration",
}) as any as S.Schema<KubernetesConfiguration>;
export interface ScanEc2InstanceWithFindings {
  EbsVolumes?: boolean;
}
export const ScanEc2InstanceWithFindings = S.suspend(() =>
  S.Struct({
    EbsVolumes: S.optional(S.Boolean).pipe(T.JsonName("ebsVolumes")),
  }),
).annotations({
  identifier: "ScanEc2InstanceWithFindings",
}) as any as S.Schema<ScanEc2InstanceWithFindings>;
export interface MalwareProtectionConfiguration {
  ScanEc2InstanceWithFindings?: ScanEc2InstanceWithFindings;
}
export const MalwareProtectionConfiguration = S.suspend(() =>
  S.Struct({
    ScanEc2InstanceWithFindings: S.optional(ScanEc2InstanceWithFindings)
      .pipe(T.JsonName("scanEc2InstanceWithFindings"))
      .annotations({ identifier: "ScanEc2InstanceWithFindings" }),
  }),
).annotations({
  identifier: "MalwareProtectionConfiguration",
}) as any as S.Schema<MalwareProtectionConfiguration>;
export interface DataSourceConfigurations {
  S3Logs?: S3LogsConfiguration;
  Kubernetes?: KubernetesConfiguration;
  MalwareProtection?: MalwareProtectionConfiguration;
}
export const DataSourceConfigurations = S.suspend(() =>
  S.Struct({
    S3Logs: S.optional(S3LogsConfiguration)
      .pipe(T.JsonName("s3Logs"))
      .annotations({ identifier: "S3LogsConfiguration" }),
    Kubernetes: S.optional(KubernetesConfiguration)
      .pipe(T.JsonName("kubernetes"))
      .annotations({ identifier: "KubernetesConfiguration" }),
    MalwareProtection: S.optional(MalwareProtectionConfiguration)
      .pipe(T.JsonName("malwareProtection"))
      .annotations({ identifier: "MalwareProtectionConfiguration" }),
  }),
).annotations({
  identifier: "DataSourceConfigurations",
}) as any as S.Schema<DataSourceConfigurations>;
export type DetectorFeature =
  | "S3_DATA_EVENTS"
  | "EKS_AUDIT_LOGS"
  | "EBS_MALWARE_PROTECTION"
  | "RDS_LOGIN_EVENTS"
  | "EKS_RUNTIME_MONITORING"
  | "LAMBDA_NETWORK_LOGS"
  | "RUNTIME_MONITORING";
export const DetectorFeature = S.Literal(
  "S3_DATA_EVENTS",
  "EKS_AUDIT_LOGS",
  "EBS_MALWARE_PROTECTION",
  "RDS_LOGIN_EVENTS",
  "EKS_RUNTIME_MONITORING",
  "LAMBDA_NETWORK_LOGS",
  "RUNTIME_MONITORING",
);
export type FeatureStatus = "ENABLED" | "DISABLED";
export const FeatureStatus = S.Literal("ENABLED", "DISABLED");
export type FeatureAdditionalConfiguration =
  | "EKS_ADDON_MANAGEMENT"
  | "ECS_FARGATE_AGENT_MANAGEMENT"
  | "EC2_AGENT_MANAGEMENT";
export const FeatureAdditionalConfiguration = S.Literal(
  "EKS_ADDON_MANAGEMENT",
  "ECS_FARGATE_AGENT_MANAGEMENT",
  "EC2_AGENT_MANAGEMENT",
);
export interface DetectorAdditionalConfiguration {
  Name?: FeatureAdditionalConfiguration;
  Status?: FeatureStatus;
}
export const DetectorAdditionalConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.optional(FeatureAdditionalConfiguration).pipe(T.JsonName("name")),
    Status: S.optional(FeatureStatus).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "DetectorAdditionalConfiguration",
}) as any as S.Schema<DetectorAdditionalConfiguration>;
export type DetectorAdditionalConfigurations =
  DetectorAdditionalConfiguration[];
export const DetectorAdditionalConfigurations = S.Array(
  DetectorAdditionalConfiguration,
);
export interface DetectorFeatureConfiguration {
  Name?: DetectorFeature;
  Status?: FeatureStatus;
  AdditionalConfiguration?: DetectorAdditionalConfiguration[];
}
export const DetectorFeatureConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.optional(DetectorFeature).pipe(T.JsonName("name")),
    Status: S.optional(FeatureStatus).pipe(T.JsonName("status")),
    AdditionalConfiguration: S.optional(DetectorAdditionalConfigurations).pipe(
      T.JsonName("additionalConfiguration"),
    ),
  }),
).annotations({
  identifier: "DetectorFeatureConfiguration",
}) as any as S.Schema<DetectorFeatureConfiguration>;
export type DetectorFeatureConfigurations = DetectorFeatureConfiguration[];
export const DetectorFeatureConfigurations = S.Array(
  DetectorFeatureConfiguration,
);
export interface UpdateDetectorRequest {
  DetectorId: string;
  Enable?: boolean;
  FindingPublishingFrequency?: FindingPublishingFrequency;
  DataSources?: DataSourceConfigurations;
  Features?: DetectorFeatureConfiguration[];
}
export const UpdateDetectorRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Enable: S.optional(S.Boolean).pipe(T.JsonName("enable")),
    FindingPublishingFrequency: S.optional(FindingPublishingFrequency).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    DataSources: S.optional(DataSourceConfigurations)
      .pipe(T.JsonName("dataSources"))
      .annotations({ identifier: "DataSourceConfigurations" }),
    Features: S.optional(DetectorFeatureConfigurations).pipe(
      T.JsonName("features"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDetectorRequest",
}) as any as S.Schema<UpdateDetectorRequest>;
export interface UpdateDetectorResponse {}
export const UpdateDetectorResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateDetectorResponse" },
) as any as S.Schema<UpdateDetectorResponse>;
export interface UpdateFilterRequest {
  DetectorId: string;
  FilterName: string;
  Description?: string;
  Action?: FilterAction;
  Rank?: number;
  FindingCriteria?: FindingCriteria;
}
export const UpdateFilterRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FilterName: S.String.pipe(
      T.HttpLabel("FilterName"),
      T.JsonName("filterName"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Action: S.optional(FilterAction).pipe(T.JsonName("action")),
    Rank: S.optional(S.Number).pipe(T.JsonName("rank")),
    FindingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/filter/{FilterName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFilterRequest",
}) as any as S.Schema<UpdateFilterRequest>;
export interface UpdateFindingsFeedbackRequest {
  DetectorId: string;
  FindingIds?: string[];
  Feedback?: Feedback;
  Comments?: string | redacted.Redacted<string>;
}
export const UpdateFindingsFeedbackRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingIds: S.optional(FindingIds).pipe(T.JsonName("findingIds")),
    Feedback: S.optional(Feedback).pipe(T.JsonName("feedback")),
    Comments: S.optional(SensitiveString).pipe(T.JsonName("comments")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/findings/feedback",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFindingsFeedbackRequest",
}) as any as S.Schema<UpdateFindingsFeedbackRequest>;
export interface UpdateFindingsFeedbackResponse {}
export const UpdateFindingsFeedbackResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateFindingsFeedbackResponse",
}) as any as S.Schema<UpdateFindingsFeedbackResponse>;
export interface UpdateIPSetRequest {
  DetectorId: string;
  IpSetId: string;
  Name?: string;
  Location?: string;
  Activate?: boolean;
  ExpectedBucketOwner?: string;
}
export const UpdateIPSetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    IpSetId: S.String.pipe(T.HttpLabel("IpSetId"), T.JsonName("ipSetId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/ipset/{IpSetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIPSetRequest",
}) as any as S.Schema<UpdateIPSetRequest>;
export interface UpdateIPSetResponse {}
export const UpdateIPSetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateIPSetResponse",
}) as any as S.Schema<UpdateIPSetResponse>;
export interface DestinationProperties {
  DestinationArn?: string;
  KmsKeyArn?: string;
}
export const DestinationProperties = S.suspend(() =>
  S.Struct({
    DestinationArn: S.optional(S.String).pipe(T.JsonName("destinationArn")),
    KmsKeyArn: S.optional(S.String).pipe(T.JsonName("kmsKeyArn")),
  }),
).annotations({
  identifier: "DestinationProperties",
}) as any as S.Schema<DestinationProperties>;
export interface UpdatePublishingDestinationRequest {
  DetectorId: string;
  DestinationId: string;
  DestinationProperties?: DestinationProperties;
}
export const UpdatePublishingDestinationRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    DestinationId: S.String.pipe(
      T.HttpLabel("DestinationId"),
      T.JsonName("destinationId"),
    ),
    DestinationProperties: S.optional(DestinationProperties)
      .pipe(T.JsonName("destinationProperties"))
      .annotations({ identifier: "DestinationProperties" }),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/publishingDestination/{DestinationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePublishingDestinationRequest",
}) as any as S.Schema<UpdatePublishingDestinationRequest>;
export interface UpdatePublishingDestinationResponse {}
export const UpdatePublishingDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePublishingDestinationResponse",
}) as any as S.Schema<UpdatePublishingDestinationResponse>;
export interface UpdateThreatEntitySetRequest {
  DetectorId: string;
  ThreatEntitySetId: string;
  Name?: string;
  Location?: string;
  ExpectedBucketOwner?: string;
  Activate?: boolean;
}
export const UpdateThreatEntitySetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatEntitySetId: S.String.pipe(
      T.HttpLabel("ThreatEntitySetId"),
      T.JsonName("threatEntitySetId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/threatentityset/{ThreatEntitySetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateThreatEntitySetRequest",
}) as any as S.Schema<UpdateThreatEntitySetRequest>;
export interface UpdateThreatEntitySetResponse {}
export const UpdateThreatEntitySetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateThreatEntitySetResponse",
}) as any as S.Schema<UpdateThreatEntitySetResponse>;
export interface UpdateThreatIntelSetRequest {
  DetectorId: string;
  ThreatIntelSetId: string;
  Name?: string;
  Location?: string;
  Activate?: boolean;
  ExpectedBucketOwner?: string;
}
export const UpdateThreatIntelSetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatIntelSetId: S.String.pipe(
      T.HttpLabel("ThreatIntelSetId"),
      T.JsonName("threatIntelSetId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/threatintelset/{ThreatIntelSetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateThreatIntelSetRequest",
}) as any as S.Schema<UpdateThreatIntelSetRequest>;
export interface UpdateThreatIntelSetResponse {}
export const UpdateThreatIntelSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateThreatIntelSetResponse",
}) as any as S.Schema<UpdateThreatIntelSetResponse>;
export interface UpdateTrustedEntitySetRequest {
  DetectorId: string;
  TrustedEntitySetId: string;
  Name?: string;
  Location?: string;
  ExpectedBucketOwner?: string;
  Activate?: boolean;
}
export const UpdateTrustedEntitySetRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    TrustedEntitySetId: S.String.pipe(
      T.HttpLabel("TrustedEntitySetId"),
      T.JsonName("trustedEntitySetId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/trustedentityset/{TrustedEntitySetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTrustedEntitySetRequest",
}) as any as S.Schema<UpdateTrustedEntitySetRequest>;
export interface UpdateTrustedEntitySetResponse {}
export const UpdateTrustedEntitySetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTrustedEntitySetResponse",
}) as any as S.Schema<UpdateTrustedEntitySetResponse>;
export type DataSource =
  | "FLOW_LOGS"
  | "CLOUD_TRAIL"
  | "DNS_LOGS"
  | "S3_LOGS"
  | "KUBERNETES_AUDIT_LOGS"
  | "EC2_MALWARE_SCAN";
export const DataSource = S.Literal(
  "FLOW_LOGS",
  "CLOUD_TRAIL",
  "DNS_LOGS",
  "S3_LOGS",
  "KUBERNETES_AUDIT_LOGS",
  "EC2_MALWARE_SCAN",
);
export type DataSourceList = DataSource[];
export const DataSourceList = S.Array(DataSource);
export type ResourceList = string[];
export const ResourceList = S.Array(S.String);
export type UsageFeature =
  | "FLOW_LOGS"
  | "CLOUD_TRAIL"
  | "DNS_LOGS"
  | "S3_DATA_EVENTS"
  | "EKS_AUDIT_LOGS"
  | "EBS_MALWARE_PROTECTION"
  | "RDS_LOGIN_EVENTS"
  | "LAMBDA_NETWORK_LOGS"
  | "EKS_RUNTIME_MONITORING"
  | "FARGATE_RUNTIME_MONITORING"
  | "EC2_RUNTIME_MONITORING"
  | "RDS_DBI_PROTECTION_PROVISIONED"
  | "RDS_DBI_PROTECTION_SERVERLESS";
export const UsageFeature = S.Literal(
  "FLOW_LOGS",
  "CLOUD_TRAIL",
  "DNS_LOGS",
  "S3_DATA_EVENTS",
  "EKS_AUDIT_LOGS",
  "EBS_MALWARE_PROTECTION",
  "RDS_LOGIN_EVENTS",
  "LAMBDA_NETWORK_LOGS",
  "EKS_RUNTIME_MONITORING",
  "FARGATE_RUNTIME_MONITORING",
  "EC2_RUNTIME_MONITORING",
  "RDS_DBI_PROTECTION_PROVISIONED",
  "RDS_DBI_PROTECTION_SERVERLESS",
);
export type UsageFeatureList = UsageFeature[];
export const UsageFeatureList = S.Array(UsageFeature);
export type CoverageSortKey =
  | "ACCOUNT_ID"
  | "CLUSTER_NAME"
  | "COVERAGE_STATUS"
  | "ISSUE"
  | "ADDON_VERSION"
  | "UPDATED_AT"
  | "EKS_CLUSTER_NAME"
  | "ECS_CLUSTER_NAME"
  | "INSTANCE_ID";
export const CoverageSortKey = S.Literal(
  "ACCOUNT_ID",
  "CLUSTER_NAME",
  "COVERAGE_STATUS",
  "ISSUE",
  "ADDON_VERSION",
  "UPDATED_AT",
  "EKS_CLUSTER_NAME",
  "ECS_CLUSTER_NAME",
  "INSTANCE_ID",
);
export type OrgFeature =
  | "S3_DATA_EVENTS"
  | "EKS_AUDIT_LOGS"
  | "EBS_MALWARE_PROTECTION"
  | "RDS_LOGIN_EVENTS"
  | "EKS_RUNTIME_MONITORING"
  | "LAMBDA_NETWORK_LOGS"
  | "RUNTIME_MONITORING";
export const OrgFeature = S.Literal(
  "S3_DATA_EVENTS",
  "EKS_AUDIT_LOGS",
  "EBS_MALWARE_PROTECTION",
  "RDS_LOGIN_EVENTS",
  "EKS_RUNTIME_MONITORING",
  "LAMBDA_NETWORK_LOGS",
  "RUNTIME_MONITORING",
);
export type OrgFeatureStatus = "NEW" | "NONE" | "ALL";
export const OrgFeatureStatus = S.Literal("NEW", "NONE", "ALL");
export interface AccountDetail {
  AccountId?: string;
  Email?: string | redacted.Redacted<string>;
}
export const AccountDetail = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    Email: S.optional(SensitiveString).pipe(T.JsonName("email")),
  }),
).annotations({
  identifier: "AccountDetail",
}) as any as S.Schema<AccountDetail>;
export type AccountDetails = AccountDetail[];
export const AccountDetails = S.Array(AccountDetail);
export type PublishingStatus =
  | "PENDING_VERIFICATION"
  | "PUBLISHING"
  | "UNABLE_TO_PUBLISH_FIX_DESTINATION_PROPERTY"
  | "STOPPED";
export const PublishingStatus = S.Literal(
  "PENDING_VERIFICATION",
  "PUBLISHING",
  "UNABLE_TO_PUBLISH_FIX_DESTINATION_PROPERTY",
  "STOPPED",
);
export type DetectorStatus = "ENABLED" | "DISABLED";
export const DetectorStatus = S.Literal("ENABLED", "DISABLED");
export type IpSetStatus =
  | "INACTIVE"
  | "ACTIVATING"
  | "ACTIVE"
  | "DEACTIVATING"
  | "ERROR"
  | "DELETE_PENDING"
  | "DELETED";
export const IpSetStatus = S.Literal(
  "INACTIVE",
  "ACTIVATING",
  "ACTIVE",
  "DEACTIVATING",
  "ERROR",
  "DELETE_PENDING",
  "DELETED",
);
export type MalwareProtectionPlanStatus = "ACTIVE" | "WARNING" | "ERROR";
export const MalwareProtectionPlanStatus = S.Literal(
  "ACTIVE",
  "WARNING",
  "ERROR",
);
export type MalwareProtectionResourceType =
  | "EBS_RECOVERY_POINT"
  | "EBS_SNAPSHOT"
  | "EBS_VOLUME"
  | "EC2_AMI"
  | "EC2_INSTANCE"
  | "EC2_RECOVERY_POINT"
  | "S3_RECOVERY_POINT"
  | "S3_BUCKET";
export const MalwareProtectionResourceType = S.Literal(
  "EBS_RECOVERY_POINT",
  "EBS_SNAPSHOT",
  "EBS_VOLUME",
  "EC2_AMI",
  "EC2_INSTANCE",
  "EC2_RECOVERY_POINT",
  "S3_RECOVERY_POINT",
  "S3_BUCKET",
);
export type ScanCategory = "FULL_SCAN" | "INCREMENTAL_SCAN";
export const ScanCategory = S.Literal("FULL_SCAN", "INCREMENTAL_SCAN");
export type MalwareProtectionScanStatus =
  | "RUNNING"
  | "COMPLETED"
  | "COMPLETED_WITH_ISSUES"
  | "FAILED"
  | "SKIPPED";
export const MalwareProtectionScanStatus = S.Literal(
  "RUNNING",
  "COMPLETED",
  "COMPLETED_WITH_ISSUES",
  "FAILED",
  "SKIPPED",
);
export type ScanStatusReason =
  | "ACCESS_DENIED"
  | "RESOURCE_NOT_FOUND"
  | "SNAPSHOT_SIZE_LIMIT_EXCEEDED"
  | "RESOURCE_UNAVAILABLE"
  | "INCONSISTENT_SOURCE"
  | "INCREMENTAL_NO_DIFFERENCE"
  | "NO_EBS_VOLUMES_FOUND"
  | "UNSUPPORTED_PRODUCT_CODE_TYPE"
  | "AMI_SNAPSHOT_LIMIT_EXCEEDED"
  | "UNRELATED_RESOURCES"
  | "BASE_RESOURCE_NOT_SCANNED"
  | "BASE_CREATED_AFTER_TARGET"
  | "UNSUPPORTED_FOR_INCREMENTAL"
  | "UNSUPPORTED_AMI"
  | "UNSUPPORTED_SNAPSHOT"
  | "UNSUPPORTED_COMPOSITE_RECOVERY_POINT";
export const ScanStatusReason = S.Literal(
  "ACCESS_DENIED",
  "RESOURCE_NOT_FOUND",
  "SNAPSHOT_SIZE_LIMIT_EXCEEDED",
  "RESOURCE_UNAVAILABLE",
  "INCONSISTENT_SOURCE",
  "INCREMENTAL_NO_DIFFERENCE",
  "NO_EBS_VOLUMES_FOUND",
  "UNSUPPORTED_PRODUCT_CODE_TYPE",
  "AMI_SNAPSHOT_LIMIT_EXCEEDED",
  "UNRELATED_RESOURCES",
  "BASE_RESOURCE_NOT_SCANNED",
  "BASE_CREATED_AFTER_TARGET",
  "UNSUPPORTED_FOR_INCREMENTAL",
  "UNSUPPORTED_AMI",
  "UNSUPPORTED_SNAPSHOT",
  "UNSUPPORTED_COMPOSITE_RECOVERY_POINT",
);
export type MalwareProtectionScanType =
  | "BACKUP_INITIATED"
  | "ON_DEMAND"
  | "GUARDDUTY_INITIATED";
export const MalwareProtectionScanType = S.Literal(
  "BACKUP_INITIATED",
  "ON_DEMAND",
  "GUARDDUTY_INITIATED",
);
export type ThreatEntitySetStatus =
  | "INACTIVE"
  | "ACTIVATING"
  | "ACTIVE"
  | "DEACTIVATING"
  | "ERROR"
  | "DELETE_PENDING"
  | "DELETED";
export const ThreatEntitySetStatus = S.Literal(
  "INACTIVE",
  "ACTIVATING",
  "ACTIVE",
  "DEACTIVATING",
  "ERROR",
  "DELETE_PENDING",
  "DELETED",
);
export type ThreatIntelSetStatus =
  | "INACTIVE"
  | "ACTIVATING"
  | "ACTIVE"
  | "DEACTIVATING"
  | "ERROR"
  | "DELETE_PENDING"
  | "DELETED";
export const ThreatIntelSetStatus = S.Literal(
  "INACTIVE",
  "ACTIVATING",
  "ACTIVE",
  "DEACTIVATING",
  "ERROR",
  "DELETE_PENDING",
  "DELETED",
);
export type TrustedEntitySetStatus =
  | "INACTIVE"
  | "ACTIVATING"
  | "ACTIVE"
  | "DEACTIVATING"
  | "ERROR"
  | "DELETE_PENDING"
  | "DELETED";
export const TrustedEntitySetStatus = S.Literal(
  "INACTIVE",
  "ACTIVATING",
  "ACTIVE",
  "DEACTIVATING",
  "ERROR",
  "DELETE_PENDING",
  "DELETED",
);
export interface UsageCriteria {
  AccountIds?: string[];
  DataSources?: DataSource[];
  Resources?: string[];
  Features?: UsageFeature[];
}
export const UsageCriteria = S.suspend(() =>
  S.Struct({
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
    DataSources: S.optional(DataSourceList).pipe(T.JsonName("dataSources")),
    Resources: S.optional(ResourceList).pipe(T.JsonName("resources")),
    Features: S.optional(UsageFeatureList).pipe(T.JsonName("features")),
  }),
).annotations({
  identifier: "UsageCriteria",
}) as any as S.Schema<UsageCriteria>;
export interface CoverageSortCriteria {
  AttributeName?: CoverageSortKey;
  OrderBy?: OrderBy;
}
export const CoverageSortCriteria = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(CoverageSortKey).pipe(
      T.JsonName("attributeName"),
    ),
    OrderBy: S.optional(OrderBy).pipe(T.JsonName("orderBy")),
  }),
).annotations({
  identifier: "CoverageSortCriteria",
}) as any as S.Schema<CoverageSortCriteria>;
export type DetectorIds = string[];
export const DetectorIds = S.Array(S.String);
export type FilterNames = string[];
export const FilterNames = S.Array(S.String);
export type IpSetIds = string[];
export const IpSetIds = S.Array(S.String);
export type ThreatEntitySetIds = string[];
export const ThreatEntitySetIds = S.Array(S.String);
export type ThreatIntelSetIds = string[];
export const ThreatIntelSetIds = S.Array(S.String);
export type TrustedEntitySetIds = string[];
export const TrustedEntitySetIds = S.Array(S.String);
export interface S3ObjectForSendObjectMalwareScan {
  Bucket?: string;
  Key?: string;
  VersionId?: string;
}
export const S3ObjectForSendObjectMalwareScan = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String).pipe(T.JsonName("bucket")),
    Key: S.optional(S.String).pipe(T.JsonName("key")),
    VersionId: S.optional(S.String).pipe(T.JsonName("versionId")),
  }),
).annotations({
  identifier: "S3ObjectForSendObjectMalwareScan",
}) as any as S.Schema<S3ObjectForSendObjectMalwareScan>;
export type MalwareProtectionPlanObjectPrefixesList = string[];
export const MalwareProtectionPlanObjectPrefixesList = S.Array(S.String);
export type MalwareProtectionPlanTaggingActionStatus = "ENABLED" | "DISABLED";
export const MalwareProtectionPlanTaggingActionStatus = S.Literal(
  "ENABLED",
  "DISABLED",
);
export type CriterionKey =
  | "EC2_INSTANCE_ARN"
  | "SCAN_ID"
  | "ACCOUNT_ID"
  | "GUARDDUTY_FINDING_ID"
  | "SCAN_START_TIME"
  | "SCAN_STATUS"
  | "SCAN_TYPE";
export const CriterionKey = S.Literal(
  "EC2_INSTANCE_ARN",
  "SCAN_ID",
  "ACCOUNT_ID",
  "GUARDDUTY_FINDING_ID",
  "SCAN_START_TIME",
  "SCAN_STATUS",
  "SCAN_TYPE",
);
export type CoverageFilterCriterionKey =
  | "ACCOUNT_ID"
  | "CLUSTER_NAME"
  | "RESOURCE_TYPE"
  | "COVERAGE_STATUS"
  | "ADDON_VERSION"
  | "MANAGEMENT_TYPE"
  | "EKS_CLUSTER_NAME"
  | "ECS_CLUSTER_NAME"
  | "AGENT_VERSION"
  | "INSTANCE_ID"
  | "CLUSTER_ARN";
export const CoverageFilterCriterionKey = S.Literal(
  "ACCOUNT_ID",
  "CLUSTER_NAME",
  "RESOURCE_TYPE",
  "COVERAGE_STATUS",
  "ADDON_VERSION",
  "MANAGEMENT_TYPE",
  "EKS_CLUSTER_NAME",
  "ECS_CLUSTER_NAME",
  "AGENT_VERSION",
  "INSTANCE_ID",
  "CLUSTER_ARN",
);
export type ListMalwareScansCriterionKey =
  | "RESOURCE_ARN"
  | "SCAN_ID"
  | "ACCOUNT_ID"
  | "GUARDDUTY_FINDING_ID"
  | "RESOURCE_TYPE"
  | "SCAN_START_TIME"
  | "SCAN_STATUS"
  | "SCAN_TYPE";
export const ListMalwareScansCriterionKey = S.Literal(
  "RESOURCE_ARN",
  "SCAN_ID",
  "ACCOUNT_ID",
  "GUARDDUTY_FINDING_ID",
  "RESOURCE_TYPE",
  "SCAN_START_TIME",
  "SCAN_STATUS",
  "SCAN_TYPE",
);
export type ScanCriterionKey = "EC2_INSTANCE_TAG";
export const ScanCriterionKey = S.Literal("EC2_INSTANCE_TAG");
export type OrgFeatureAdditionalConfiguration =
  | "EKS_ADDON_MANAGEMENT"
  | "ECS_FARGATE_AGENT_MANAGEMENT"
  | "EC2_AGENT_MANAGEMENT";
export const OrgFeatureAdditionalConfiguration = S.Literal(
  "EKS_ADDON_MANAGEMENT",
  "ECS_FARGATE_AGENT_MANAGEMENT",
  "EC2_AGENT_MANAGEMENT",
);
export interface CreateIPSetResponse {
  IpSetId: string;
}
export const CreateIPSetResponse = S.suspend(() =>
  S.Struct({ IpSetId: S.optional(S.String).pipe(T.JsonName("ipSetId")) }),
).annotations({
  identifier: "CreateIPSetResponse",
}) as any as S.Schema<CreateIPSetResponse>;
export interface CreateMembersRequest {
  DetectorId: string;
  AccountDetails?: AccountDetail[];
}
export const CreateMembersRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountDetails: S.optional(AccountDetails).pipe(
      T.JsonName("accountDetails"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/member" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMembersRequest",
}) as any as S.Schema<CreateMembersRequest>;
export interface CreatePublishingDestinationRequest {
  DetectorId: string;
  DestinationType?: DestinationType;
  DestinationProperties?: DestinationProperties;
  ClientToken?: string;
  Tags?: { [key: string]: string };
}
export const CreatePublishingDestinationRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    DestinationType: S.optional(DestinationType).pipe(
      T.JsonName("destinationType"),
    ),
    DestinationProperties: S.optional(DestinationProperties)
      .pipe(T.JsonName("destinationProperties"))
      .annotations({ identifier: "DestinationProperties" }),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/publishingDestination",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePublishingDestinationRequest",
}) as any as S.Schema<CreatePublishingDestinationRequest>;
export interface CreateThreatEntitySetResponse {
  ThreatEntitySetId: string;
}
export const CreateThreatEntitySetResponse = S.suspend(() =>
  S.Struct({
    ThreatEntitySetId: S.optional(S.String).pipe(
      T.JsonName("threatEntitySetId"),
    ),
  }),
).annotations({
  identifier: "CreateThreatEntitySetResponse",
}) as any as S.Schema<CreateThreatEntitySetResponse>;
export interface CreateThreatIntelSetResponse {
  ThreatIntelSetId: string;
}
export const CreateThreatIntelSetResponse = S.suspend(() =>
  S.Struct({
    ThreatIntelSetId: S.optional(S.String).pipe(T.JsonName("threatIntelSetId")),
  }),
).annotations({
  identifier: "CreateThreatIntelSetResponse",
}) as any as S.Schema<CreateThreatIntelSetResponse>;
export interface CreateTrustedEntitySetResponse {
  TrustedEntitySetId: string;
}
export const CreateTrustedEntitySetResponse = S.suspend(() =>
  S.Struct({
    TrustedEntitySetId: S.optional(S.String).pipe(
      T.JsonName("trustedEntitySetId"),
    ),
  }),
).annotations({
  identifier: "CreateTrustedEntitySetResponse",
}) as any as S.Schema<CreateTrustedEntitySetResponse>;
export interface UnprocessedAccount {
  AccountId?: string;
  Result?: string;
}
export const UnprocessedAccount = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    Result: S.optional(S.String).pipe(T.JsonName("result")),
  }),
).annotations({
  identifier: "UnprocessedAccount",
}) as any as S.Schema<UnprocessedAccount>;
export type UnprocessedAccounts = UnprocessedAccount[];
export const UnprocessedAccounts = S.Array(UnprocessedAccount);
export interface DeleteInvitationsResponse {
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const DeleteInvitationsResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "DeleteInvitationsResponse",
}) as any as S.Schema<DeleteInvitationsResponse>;
export interface DeleteMembersResponse {
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const DeleteMembersResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "DeleteMembersResponse",
}) as any as S.Schema<DeleteMembersResponse>;
export interface DescribePublishingDestinationResponse {
  DestinationId: string;
  DestinationType: DestinationType;
  Status: PublishingStatus;
  PublishingFailureStartTimestamp: number;
  DestinationProperties: DestinationProperties;
  Tags?: { [key: string]: string };
}
export const DescribePublishingDestinationResponse = S.suspend(() =>
  S.Struct({
    DestinationId: S.optional(S.String).pipe(T.JsonName("destinationId")),
    DestinationType: S.optional(DestinationType).pipe(
      T.JsonName("destinationType"),
    ),
    Status: S.optional(PublishingStatus).pipe(T.JsonName("status")),
    PublishingFailureStartTimestamp: S.optional(S.Number).pipe(
      T.JsonName("publishingFailureStartTimestamp"),
    ),
    DestinationProperties: S.optional(DestinationProperties)
      .pipe(T.JsonName("destinationProperties"))
      .annotations({ identifier: "DestinationProperties" }),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribePublishingDestinationResponse",
}) as any as S.Schema<DescribePublishingDestinationResponse>;
export interface DisassociateMembersResponse {
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const DisassociateMembersResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "DisassociateMembersResponse",
}) as any as S.Schema<DisassociateMembersResponse>;
export interface GetFilterResponse {
  Name: string;
  Description?: string;
  Action: FilterAction;
  Rank?: number;
  FindingCriteria: FindingCriteria;
  Tags?: { [key: string]: string };
}
export const GetFilterResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Action: S.optional(FilterAction).pipe(T.JsonName("action")),
    Rank: S.optional(S.Number).pipe(T.JsonName("rank")),
    FindingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetFilterResponse",
}) as any as S.Schema<GetFilterResponse>;
export interface GetIPSetResponse {
  Name: string;
  Format: IpSetFormat;
  Location: string;
  Status: IpSetStatus;
  Tags?: { [key: string]: string };
  ExpectedBucketOwner?: string;
}
export const GetIPSetResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Format: S.optional(IpSetFormat).pipe(T.JsonName("format")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    Status: S.optional(IpSetStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  }),
).annotations({
  identifier: "GetIPSetResponse",
}) as any as S.Schema<GetIPSetResponse>;
export interface ScanConditionPair {
  Key?: string;
  Value?: string;
}
export const ScanConditionPair = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String).pipe(T.JsonName("key")),
    Value: S.optional(S.String).pipe(T.JsonName("value")),
  }),
).annotations({
  identifier: "ScanConditionPair",
}) as any as S.Schema<ScanConditionPair>;
export type MapEquals = ScanConditionPair[];
export const MapEquals = S.Array(ScanConditionPair);
export interface ScanCondition {
  MapEquals?: ScanConditionPair[];
}
export const ScanCondition = S.suspend(() =>
  S.Struct({ MapEquals: S.optional(MapEquals).pipe(T.JsonName("mapEquals")) }),
).annotations({
  identifier: "ScanCondition",
}) as any as S.Schema<ScanCondition>;
export type ScanCriterion = { [key in ScanCriterionKey]?: ScanCondition };
export const ScanCriterion = S.partial(
  S.Record({ key: ScanCriterionKey, value: ScanCondition }),
);
export interface ScanResourceCriteria {
  Include?: { [key: string]: ScanCondition };
  Exclude?: { [key: string]: ScanCondition };
}
export const ScanResourceCriteria = S.suspend(() =>
  S.Struct({
    Include: S.optional(ScanCriterion).pipe(T.JsonName("include")),
    Exclude: S.optional(ScanCriterion).pipe(T.JsonName("exclude")),
  }),
).annotations({
  identifier: "ScanResourceCriteria",
}) as any as S.Schema<ScanResourceCriteria>;
export interface GetMalwareScanSettingsResponse {
  ScanResourceCriteria?: ScanResourceCriteria & {
    Include: {
      [key: string]: ScanCondition & {
        MapEquals: (ScanConditionPair & { Key: TagKey })[];
      };
    };
    Exclude: {
      [key: string]: ScanCondition & {
        MapEquals: (ScanConditionPair & { Key: TagKey })[];
      };
    };
  };
  EbsSnapshotPreservation?: EbsSnapshotPreservation;
}
export const GetMalwareScanSettingsResponse = S.suspend(() =>
  S.Struct({
    ScanResourceCriteria: S.optional(ScanResourceCriteria)
      .pipe(T.JsonName("scanResourceCriteria"))
      .annotations({ identifier: "ScanResourceCriteria" }),
    EbsSnapshotPreservation: S.optional(EbsSnapshotPreservation).pipe(
      T.JsonName("ebsSnapshotPreservation"),
    ),
  }),
).annotations({
  identifier: "GetMalwareScanSettingsResponse",
}) as any as S.Schema<GetMalwareScanSettingsResponse>;
export interface GetThreatEntitySetResponse {
  Name: string;
  Format: ThreatEntitySetFormat;
  Location: string;
  ExpectedBucketOwner?: string;
  Status: ThreatEntitySetStatus;
  Tags?: { [key: string]: string };
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ErrorDetails?: string;
}
export const GetThreatEntitySetResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Format: S.optional(ThreatEntitySetFormat).pipe(T.JsonName("format")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Status: S.optional(ThreatEntitySetStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("updatedAt"),
    ),
    ErrorDetails: S.optional(S.String).pipe(T.JsonName("errorDetails")),
  }),
).annotations({
  identifier: "GetThreatEntitySetResponse",
}) as any as S.Schema<GetThreatEntitySetResponse>;
export interface GetThreatIntelSetResponse {
  Name: string;
  Format: ThreatIntelSetFormat;
  Location: string;
  Status: ThreatIntelSetStatus;
  Tags?: { [key: string]: string };
  ExpectedBucketOwner?: string;
}
export const GetThreatIntelSetResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Format: S.optional(ThreatIntelSetFormat).pipe(T.JsonName("format")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    Status: S.optional(ThreatIntelSetStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  }),
).annotations({
  identifier: "GetThreatIntelSetResponse",
}) as any as S.Schema<GetThreatIntelSetResponse>;
export interface GetTrustedEntitySetResponse {
  Name: string;
  Format: TrustedEntitySetFormat;
  Location: string;
  ExpectedBucketOwner?: string;
  Status: TrustedEntitySetStatus;
  Tags?: { [key: string]: string };
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ErrorDetails?: string;
}
export const GetTrustedEntitySetResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Format: S.optional(TrustedEntitySetFormat).pipe(T.JsonName("format")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Status: S.optional(TrustedEntitySetStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("updatedAt"),
    ),
    ErrorDetails: S.optional(S.String).pipe(T.JsonName("errorDetails")),
  }),
).annotations({
  identifier: "GetTrustedEntitySetResponse",
}) as any as S.Schema<GetTrustedEntitySetResponse>;
export interface GetUsageStatisticsRequest {
  DetectorId: string;
  UsageStatisticType?: UsageStatisticType;
  UsageCriteria?: UsageCriteria;
  Unit?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetUsageStatisticsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    UsageStatisticType: S.optional(UsageStatisticType).pipe(
      T.JsonName("usageStatisticsType"),
    ),
    UsageCriteria: S.optional(UsageCriteria)
      .pipe(T.JsonName("usageCriteria"))
      .annotations({ identifier: "UsageCriteria" }),
    Unit: S.optional(S.String).pipe(T.JsonName("unit")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/usage/statistics",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUsageStatisticsRequest",
}) as any as S.Schema<GetUsageStatisticsRequest>;
export interface InviteMembersResponse {
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const InviteMembersResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "InviteMembersResponse",
}) as any as S.Schema<InviteMembersResponse>;
export interface CoverageFilterCondition {
  Equals?: string[];
  NotEquals?: string[];
}
export const CoverageFilterCondition = S.suspend(() =>
  S.Struct({
    Equals: S.optional(Equals).pipe(T.JsonName("equals")),
    NotEquals: S.optional(NotEquals).pipe(T.JsonName("notEquals")),
  }),
).annotations({
  identifier: "CoverageFilterCondition",
}) as any as S.Schema<CoverageFilterCondition>;
export interface CoverageFilterCriterion {
  CriterionKey?: CoverageFilterCriterionKey;
  FilterCondition?: CoverageFilterCondition;
}
export const CoverageFilterCriterion = S.suspend(() =>
  S.Struct({
    CriterionKey: S.optional(CoverageFilterCriterionKey).pipe(
      T.JsonName("criterionKey"),
    ),
    FilterCondition: S.optional(CoverageFilterCondition)
      .pipe(T.JsonName("filterCondition"))
      .annotations({ identifier: "CoverageFilterCondition" }),
  }),
).annotations({
  identifier: "CoverageFilterCriterion",
}) as any as S.Schema<CoverageFilterCriterion>;
export type CoverageFilterCriterionList = CoverageFilterCriterion[];
export const CoverageFilterCriterionList = S.Array(CoverageFilterCriterion);
export interface CoverageFilterCriteria {
  FilterCriterion?: CoverageFilterCriterion[];
}
export const CoverageFilterCriteria = S.suspend(() =>
  S.Struct({
    FilterCriterion: S.optional(CoverageFilterCriterionList).pipe(
      T.JsonName("filterCriterion"),
    ),
  }),
).annotations({
  identifier: "CoverageFilterCriteria",
}) as any as S.Schema<CoverageFilterCriteria>;
export interface ListCoverageRequest {
  DetectorId: string;
  NextToken?: string;
  MaxResults?: number;
  FilterCriteria?: CoverageFilterCriteria;
  SortCriteria?: CoverageSortCriteria;
}
export const ListCoverageRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    FilterCriteria: S.optional(CoverageFilterCriteria)
      .pipe(T.JsonName("filterCriteria"))
      .annotations({ identifier: "CoverageFilterCriteria" }),
    SortCriteria: S.optional(CoverageSortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "CoverageSortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/coverage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCoverageRequest",
}) as any as S.Schema<ListCoverageRequest>;
export interface ListDetectorsResponse {
  DetectorIds: string[];
  NextToken?: string;
}
export const ListDetectorsResponse = S.suspend(() =>
  S.Struct({
    DetectorIds: S.optional(DetectorIds).pipe(T.JsonName("detectorIds")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListDetectorsResponse",
}) as any as S.Schema<ListDetectorsResponse>;
export interface ListFiltersResponse {
  FilterNames: string[];
  NextToken?: string;
}
export const ListFiltersResponse = S.suspend(() =>
  S.Struct({
    FilterNames: S.optional(FilterNames).pipe(T.JsonName("filterNames")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListFiltersResponse",
}) as any as S.Schema<ListFiltersResponse>;
export interface ListFindingsResponse {
  FindingIds: string[];
  NextToken?: string;
}
export const ListFindingsResponse = S.suspend(() =>
  S.Struct({
    FindingIds: S.optional(FindingIds).pipe(T.JsonName("findingIds")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListFindingsResponse",
}) as any as S.Schema<ListFindingsResponse>;
export interface ListIPSetsResponse {
  IpSetIds: string[];
  NextToken?: string;
}
export const ListIPSetsResponse = S.suspend(() =>
  S.Struct({
    IpSetIds: S.optional(IpSetIds).pipe(T.JsonName("ipSetIds")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListIPSetsResponse",
}) as any as S.Schema<ListIPSetsResponse>;
export interface Member {
  AccountId?: string;
  DetectorId?: string;
  MasterId?: string;
  Email?: string | redacted.Redacted<string>;
  RelationshipStatus?: string;
  InvitedAt?: string;
  UpdatedAt?: string;
  AdministratorId?: string;
}
export const Member = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
    MasterId: S.optional(S.String).pipe(T.JsonName("masterId")),
    Email: S.optional(SensitiveString).pipe(T.JsonName("email")),
    RelationshipStatus: S.optional(S.String).pipe(
      T.JsonName("relationshipStatus"),
    ),
    InvitedAt: S.optional(S.String).pipe(T.JsonName("invitedAt")),
    UpdatedAt: S.optional(S.String).pipe(T.JsonName("updatedAt")),
    AdministratorId: S.optional(S.String).pipe(T.JsonName("administratorId")),
  }),
).annotations({ identifier: "Member" }) as any as S.Schema<Member>;
export type Members = Member[];
export const Members = S.Array(Member);
export interface ListMembersResponse {
  Members?: (Member & {
    AccountId: AccountId;
    MasterId: string;
    Email: Email;
    RelationshipStatus: string;
    UpdatedAt: string;
  })[];
  NextToken?: string;
}
export const ListMembersResponse = S.suspend(() =>
  S.Struct({
    Members: S.optional(Members).pipe(T.JsonName("members")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListMembersResponse",
}) as any as S.Schema<ListMembersResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListThreatEntitySetsResponse {
  ThreatEntitySetIds: string[];
  NextToken?: string;
}
export const ListThreatEntitySetsResponse = S.suspend(() =>
  S.Struct({
    ThreatEntitySetIds: S.optional(ThreatEntitySetIds).pipe(
      T.JsonName("threatEntitySetIds"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListThreatEntitySetsResponse",
}) as any as S.Schema<ListThreatEntitySetsResponse>;
export interface ListThreatIntelSetsResponse {
  ThreatIntelSetIds: string[];
  NextToken?: string;
}
export const ListThreatIntelSetsResponse = S.suspend(() =>
  S.Struct({
    ThreatIntelSetIds: S.optional(ThreatIntelSetIds).pipe(
      T.JsonName("threatIntelSetIds"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListThreatIntelSetsResponse",
}) as any as S.Schema<ListThreatIntelSetsResponse>;
export interface ListTrustedEntitySetsResponse {
  TrustedEntitySetIds: string[];
  NextToken?: string;
}
export const ListTrustedEntitySetsResponse = S.suspend(() =>
  S.Struct({
    TrustedEntitySetIds: S.optional(TrustedEntitySetIds).pipe(
      T.JsonName("trustedEntitySetIds"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListTrustedEntitySetsResponse",
}) as any as S.Schema<ListTrustedEntitySetsResponse>;
export interface SendObjectMalwareScanRequest {
  S3Object?: S3ObjectForSendObjectMalwareScan;
}
export const SendObjectMalwareScanRequest = S.suspend(() =>
  S.Struct({
    S3Object: S.optional(S3ObjectForSendObjectMalwareScan)
      .pipe(T.JsonName("s3Object"))
      .annotations({ identifier: "S3ObjectForSendObjectMalwareScan" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/object-malware-scan/send" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendObjectMalwareScanRequest",
}) as any as S.Schema<SendObjectMalwareScanRequest>;
export interface SendObjectMalwareScanResponse {}
export const SendObjectMalwareScanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SendObjectMalwareScanResponse",
}) as any as S.Schema<SendObjectMalwareScanResponse>;
export interface StartMonitoringMembersResponse {
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const StartMonitoringMembersResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "StartMonitoringMembersResponse",
}) as any as S.Schema<StartMonitoringMembersResponse>;
export interface StopMonitoringMembersResponse {
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const StopMonitoringMembersResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "StopMonitoringMembersResponse",
}) as any as S.Schema<StopMonitoringMembersResponse>;
export interface UpdateFilterResponse {
  Name: string;
}
export const UpdateFilterResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String).pipe(T.JsonName("name")) }),
).annotations({
  identifier: "UpdateFilterResponse",
}) as any as S.Schema<UpdateFilterResponse>;
export interface CreateS3BucketResource {
  BucketName?: string;
  ObjectPrefixes?: string[];
}
export const CreateS3BucketResource = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    ObjectPrefixes: S.optional(MalwareProtectionPlanObjectPrefixesList).pipe(
      T.JsonName("objectPrefixes"),
    ),
  }),
).annotations({
  identifier: "CreateS3BucketResource",
}) as any as S.Schema<CreateS3BucketResource>;
export interface MalwareProtectionPlanTaggingAction {
  Status?: MalwareProtectionPlanTaggingActionStatus;
}
export const MalwareProtectionPlanTaggingAction = S.suspend(() =>
  S.Struct({
    Status: S.optional(MalwareProtectionPlanTaggingActionStatus).pipe(
      T.JsonName("status"),
    ),
  }),
).annotations({
  identifier: "MalwareProtectionPlanTaggingAction",
}) as any as S.Schema<MalwareProtectionPlanTaggingAction>;
export type DetectorFeatureResult =
  | "FLOW_LOGS"
  | "CLOUD_TRAIL"
  | "DNS_LOGS"
  | "S3_DATA_EVENTS"
  | "EKS_AUDIT_LOGS"
  | "EBS_MALWARE_PROTECTION"
  | "RDS_LOGIN_EVENTS"
  | "EKS_RUNTIME_MONITORING"
  | "LAMBDA_NETWORK_LOGS"
  | "RUNTIME_MONITORING";
export const DetectorFeatureResult = S.Literal(
  "FLOW_LOGS",
  "CLOUD_TRAIL",
  "DNS_LOGS",
  "S3_DATA_EVENTS",
  "EKS_AUDIT_LOGS",
  "EBS_MALWARE_PROTECTION",
  "RDS_LOGIN_EVENTS",
  "EKS_RUNTIME_MONITORING",
  "LAMBDA_NETWORK_LOGS",
  "RUNTIME_MONITORING",
);
export type ScanResultStatus = "NO_THREATS_FOUND" | "THREATS_FOUND";
export const ScanResultStatus = S.Literal("NO_THREATS_FOUND", "THREATS_FOUND");
export interface FilterCondition {
  EqualsValue?: string;
  GreaterThan?: number;
  LessThan?: number;
}
export const FilterCondition = S.suspend(() =>
  S.Struct({
    EqualsValue: S.optional(S.String).pipe(T.JsonName("equalsValue")),
    GreaterThan: S.optional(S.Number).pipe(T.JsonName("greaterThan")),
    LessThan: S.optional(S.Number).pipe(T.JsonName("lessThan")),
  }),
).annotations({
  identifier: "FilterCondition",
}) as any as S.Schema<FilterCondition>;
export interface ListMalwareScansFilterCriterion {
  ListMalwareScansCriterionKey?: ListMalwareScansCriterionKey;
  FilterCondition?: FilterCondition;
}
export const ListMalwareScansFilterCriterion = S.suspend(() =>
  S.Struct({
    ListMalwareScansCriterionKey: S.optional(ListMalwareScansCriterionKey).pipe(
      T.JsonName("criterionKey"),
    ),
    FilterCondition: S.optional(FilterCondition)
      .pipe(T.JsonName("filterCondition"))
      .annotations({ identifier: "FilterCondition" }),
  }),
).annotations({
  identifier: "ListMalwareScansFilterCriterion",
}) as any as S.Schema<ListMalwareScansFilterCriterion>;
export type ListMalwareScansFilterCriterionList =
  ListMalwareScansFilterCriterion[];
export const ListMalwareScansFilterCriterionList = S.Array(
  ListMalwareScansFilterCriterion,
);
export type AdminStatus = "ENABLED" | "DISABLE_IN_PROGRESS";
export const AdminStatus = S.Literal("ENABLED", "DISABLE_IN_PROGRESS");
export interface IncrementalScanDetails {
  BaselineResourceArn?: string;
}
export const IncrementalScanDetails = S.suspend(() =>
  S.Struct({
    BaselineResourceArn: S.optional(S.String).pipe(
      T.JsonName("baselineResourceArn"),
    ),
  }),
).annotations({
  identifier: "IncrementalScanDetails",
}) as any as S.Schema<IncrementalScanDetails>;
export interface RecoveryPoint {
  BackupVaultName?: string;
}
export const RecoveryPoint = S.suspend(() =>
  S.Struct({
    BackupVaultName: S.optional(S.String).pipe(T.JsonName("backupVaultName")),
  }),
).annotations({
  identifier: "RecoveryPoint",
}) as any as S.Schema<RecoveryPoint>;
export interface UpdateS3BucketResource {
  ObjectPrefixes?: string[];
}
export const UpdateS3BucketResource = S.suspend(() =>
  S.Struct({
    ObjectPrefixes: S.optional(MalwareProtectionPlanObjectPrefixesList).pipe(
      T.JsonName("objectPrefixes"),
    ),
  }),
).annotations({
  identifier: "UpdateS3BucketResource",
}) as any as S.Schema<UpdateS3BucketResource>;
export interface MemberAdditionalConfiguration {
  Name?: OrgFeatureAdditionalConfiguration;
  Status?: FeatureStatus;
}
export const MemberAdditionalConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.optional(OrgFeatureAdditionalConfiguration).pipe(
      T.JsonName("name"),
    ),
    Status: S.optional(FeatureStatus).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "MemberAdditionalConfiguration",
}) as any as S.Schema<MemberAdditionalConfiguration>;
export type MemberAdditionalConfigurations = MemberAdditionalConfiguration[];
export const MemberAdditionalConfigurations = S.Array(
  MemberAdditionalConfiguration,
);
export interface OrganizationS3LogsConfiguration {
  AutoEnable?: boolean;
}
export const OrganizationS3LogsConfiguration = S.suspend(() =>
  S.Struct({
    AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
  }),
).annotations({
  identifier: "OrganizationS3LogsConfiguration",
}) as any as S.Schema<OrganizationS3LogsConfiguration>;
export interface OrganizationAdditionalConfiguration {
  Name?: OrgFeatureAdditionalConfiguration;
  AutoEnable?: OrgFeatureStatus;
}
export const OrganizationAdditionalConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.optional(OrgFeatureAdditionalConfiguration).pipe(
      T.JsonName("name"),
    ),
    AutoEnable: S.optional(OrgFeatureStatus).pipe(T.JsonName("autoEnable")),
  }),
).annotations({
  identifier: "OrganizationAdditionalConfiguration",
}) as any as S.Schema<OrganizationAdditionalConfiguration>;
export type OrganizationAdditionalConfigurations =
  OrganizationAdditionalConfiguration[];
export const OrganizationAdditionalConfigurations = S.Array(
  OrganizationAdditionalConfiguration,
);
export interface CreateProtectedResource {
  S3Bucket?: CreateS3BucketResource;
}
export const CreateProtectedResource = S.suspend(() =>
  S.Struct({
    S3Bucket: S.optional(CreateS3BucketResource)
      .pipe(T.JsonName("s3Bucket"))
      .annotations({ identifier: "CreateS3BucketResource" }),
  }),
).annotations({
  identifier: "CreateProtectedResource",
}) as any as S.Schema<CreateProtectedResource>;
export interface MalwareProtectionPlanActions {
  Tagging?: MalwareProtectionPlanTaggingAction;
}
export const MalwareProtectionPlanActions = S.suspend(() =>
  S.Struct({
    Tagging: S.optional(MalwareProtectionPlanTaggingAction)
      .pipe(T.JsonName("tagging"))
      .annotations({ identifier: "MalwareProtectionPlanTaggingAction" }),
  }),
).annotations({
  identifier: "MalwareProtectionPlanActions",
}) as any as S.Schema<MalwareProtectionPlanActions>;
export interface Administrator {
  AccountId?: string;
  InvitationId?: string;
  RelationshipStatus?: string;
  InvitedAt?: string;
}
export const Administrator = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    InvitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
    RelationshipStatus: S.optional(S.String).pipe(
      T.JsonName("relationshipStatus"),
    ),
    InvitedAt: S.optional(S.String).pipe(T.JsonName("invitedAt")),
  }),
).annotations({
  identifier: "Administrator",
}) as any as S.Schema<Administrator>;
export interface MalwareProtectionPlanStatusReason {
  Code?: string;
  Message?: string;
}
export const MalwareProtectionPlanStatusReason = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String).pipe(T.JsonName("code")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "MalwareProtectionPlanStatusReason",
}) as any as S.Schema<MalwareProtectionPlanStatusReason>;
export type MalwareProtectionPlanStatusReasonsList =
  MalwareProtectionPlanStatusReason[];
export const MalwareProtectionPlanStatusReasonsList = S.Array(
  MalwareProtectionPlanStatusReason,
);
export interface Master {
  AccountId?: string;
  InvitationId?: string;
  RelationshipStatus?: string;
  InvitedAt?: string;
}
export const Master = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    InvitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
    RelationshipStatus: S.optional(S.String).pipe(
      T.JsonName("relationshipStatus"),
    ),
    InvitedAt: S.optional(S.String).pipe(T.JsonName("invitedAt")),
  }),
).annotations({ identifier: "Master" }) as any as S.Schema<Master>;
export interface Invitation {
  AccountId?: string;
  InvitationId?: string;
  RelationshipStatus?: string;
  InvitedAt?: string;
}
export const Invitation = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    InvitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
    RelationshipStatus: S.optional(S.String).pipe(
      T.JsonName("relationshipStatus"),
    ),
    InvitedAt: S.optional(S.String).pipe(T.JsonName("invitedAt")),
  }),
).annotations({ identifier: "Invitation" }) as any as S.Schema<Invitation>;
export type Invitations = Invitation[];
export const Invitations = S.Array(Invitation);
export interface MalwareProtectionPlanSummary {
  MalwareProtectionPlanId?: string;
}
export const MalwareProtectionPlanSummary = S.suspend(() =>
  S.Struct({
    MalwareProtectionPlanId: S.optional(S.String).pipe(
      T.JsonName("malwareProtectionPlanId"),
    ),
  }),
).annotations({
  identifier: "MalwareProtectionPlanSummary",
}) as any as S.Schema<MalwareProtectionPlanSummary>;
export type MalwareProtectionPlansSummary = MalwareProtectionPlanSummary[];
export const MalwareProtectionPlansSummary = S.Array(
  MalwareProtectionPlanSummary,
);
export interface ListMalwareScansFilterCriteria {
  ListMalwareScansFilterCriterion?: ListMalwareScansFilterCriterion[];
}
export const ListMalwareScansFilterCriteria = S.suspend(() =>
  S.Struct({
    ListMalwareScansFilterCriterion: S.optional(
      ListMalwareScansFilterCriterionList,
    ).pipe(T.JsonName("filterCriterion")),
  }),
).annotations({
  identifier: "ListMalwareScansFilterCriteria",
}) as any as S.Schema<ListMalwareScansFilterCriteria>;
export interface AdminAccount {
  AdminAccountId?: string;
  AdminStatus?: AdminStatus;
}
export const AdminAccount = S.suspend(() =>
  S.Struct({
    AdminAccountId: S.optional(S.String).pipe(T.JsonName("adminAccountId")),
    AdminStatus: S.optional(AdminStatus).pipe(T.JsonName("adminStatus")),
  }),
).annotations({ identifier: "AdminAccount" }) as any as S.Schema<AdminAccount>;
export type AdminAccounts = AdminAccount[];
export const AdminAccounts = S.Array(AdminAccount);
export interface Destination {
  DestinationId?: string;
  DestinationType?: DestinationType;
  Status?: PublishingStatus;
}
export const Destination = S.suspend(() =>
  S.Struct({
    DestinationId: S.optional(S.String).pipe(T.JsonName("destinationId")),
    DestinationType: S.optional(DestinationType).pipe(
      T.JsonName("destinationType"),
    ),
    Status: S.optional(PublishingStatus).pipe(T.JsonName("status")),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export type Destinations = Destination[];
export const Destinations = S.Array(Destination);
export interface StartMalwareScanConfiguration {
  Role?: string;
  IncrementalScanDetails?: IncrementalScanDetails;
  RecoveryPoint?: RecoveryPoint;
}
export const StartMalwareScanConfiguration = S.suspend(() =>
  S.Struct({
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    IncrementalScanDetails: S.optional(IncrementalScanDetails)
      .pipe(T.JsonName("incrementalScanDetails"))
      .annotations({ identifier: "IncrementalScanDetails" }),
    RecoveryPoint: S.optional(RecoveryPoint)
      .pipe(T.JsonName("recoveryPoint"))
      .annotations({ identifier: "RecoveryPoint" }),
  }),
).annotations({
  identifier: "StartMalwareScanConfiguration",
}) as any as S.Schema<StartMalwareScanConfiguration>;
export interface UpdateProtectedResource {
  S3Bucket?: UpdateS3BucketResource;
}
export const UpdateProtectedResource = S.suspend(() =>
  S.Struct({
    S3Bucket: S.optional(UpdateS3BucketResource)
      .pipe(T.JsonName("s3Bucket"))
      .annotations({ identifier: "UpdateS3BucketResource" }),
  }),
).annotations({
  identifier: "UpdateProtectedResource",
}) as any as S.Schema<UpdateProtectedResource>;
export interface MemberFeaturesConfiguration {
  Name?: OrgFeature;
  Status?: FeatureStatus;
  AdditionalConfiguration?: MemberAdditionalConfiguration[];
}
export const MemberFeaturesConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.optional(OrgFeature).pipe(T.JsonName("name")),
    Status: S.optional(FeatureStatus).pipe(T.JsonName("status")),
    AdditionalConfiguration: S.optional(MemberAdditionalConfigurations).pipe(
      T.JsonName("additionalConfiguration"),
    ),
  }),
).annotations({
  identifier: "MemberFeaturesConfiguration",
}) as any as S.Schema<MemberFeaturesConfiguration>;
export type MemberFeaturesConfigurations = MemberFeaturesConfiguration[];
export const MemberFeaturesConfigurations = S.Array(
  MemberFeaturesConfiguration,
);
export interface OrganizationFeatureConfiguration {
  Name?: OrgFeature;
  AutoEnable?: OrgFeatureStatus;
  AdditionalConfiguration?: OrganizationAdditionalConfiguration[];
}
export const OrganizationFeatureConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.optional(OrgFeature).pipe(T.JsonName("name")),
    AutoEnable: S.optional(OrgFeatureStatus).pipe(T.JsonName("autoEnable")),
    AdditionalConfiguration: S.optional(
      OrganizationAdditionalConfigurations,
    ).pipe(T.JsonName("additionalConfiguration")),
  }),
).annotations({
  identifier: "OrganizationFeatureConfiguration",
}) as any as S.Schema<OrganizationFeatureConfiguration>;
export type OrganizationFeaturesConfigurations =
  OrganizationFeatureConfiguration[];
export const OrganizationFeaturesConfigurations = S.Array(
  OrganizationFeatureConfiguration,
);
export type DataSourceStatus = "ENABLED" | "DISABLED";
export const DataSourceStatus = S.Literal("ENABLED", "DISABLED");
export type TriggerType = "BACKUP" | "GUARDDUTY";
export const TriggerType = S.Literal("BACKUP", "GUARDDUTY");
export type DetectionSource = "AMAZON" | "BITDEFENDER";
export const DetectionSource = S.Literal("AMAZON", "BITDEFENDER");
export type FreeTrialFeatureResult =
  | "FLOW_LOGS"
  | "CLOUD_TRAIL"
  | "DNS_LOGS"
  | "S3_DATA_EVENTS"
  | "EKS_AUDIT_LOGS"
  | "EBS_MALWARE_PROTECTION"
  | "RDS_LOGIN_EVENTS"
  | "EKS_RUNTIME_MONITORING"
  | "LAMBDA_NETWORK_LOGS"
  | "FARGATE_RUNTIME_MONITORING"
  | "EC2_RUNTIME_MONITORING";
export const FreeTrialFeatureResult = S.Literal(
  "FLOW_LOGS",
  "CLOUD_TRAIL",
  "DNS_LOGS",
  "S3_DATA_EVENTS",
  "EKS_AUDIT_LOGS",
  "EBS_MALWARE_PROTECTION",
  "RDS_LOGIN_EVENTS",
  "EKS_RUNTIME_MONITORING",
  "LAMBDA_NETWORK_LOGS",
  "FARGATE_RUNTIME_MONITORING",
  "EC2_RUNTIME_MONITORING",
);
export interface OrganizationKubernetesAuditLogsConfiguration {
  AutoEnable?: boolean;
}
export const OrganizationKubernetesAuditLogsConfiguration = S.suspend(() =>
  S.Struct({
    AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
  }),
).annotations({
  identifier: "OrganizationKubernetesAuditLogsConfiguration",
}) as any as S.Schema<OrganizationKubernetesAuditLogsConfiguration>;
export interface CreateMalwareProtectionPlanRequest {
  ClientToken?: string;
  Role?: string;
  ProtectedResource?: CreateProtectedResource;
  Actions?: MalwareProtectionPlanActions;
  Tags?: { [key: string]: string };
}
export const CreateMalwareProtectionPlanRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    ProtectedResource: S.optional(CreateProtectedResource)
      .pipe(T.JsonName("protectedResource"))
      .annotations({ identifier: "CreateProtectedResource" }),
    Actions: S.optional(MalwareProtectionPlanActions)
      .pipe(T.JsonName("actions"))
      .annotations({ identifier: "MalwareProtectionPlanActions" }),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/malware-protection-plan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMalwareProtectionPlanRequest",
}) as any as S.Schema<CreateMalwareProtectionPlanRequest>;
export interface CreateMembersResponse {
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const CreateMembersResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "CreateMembersResponse",
}) as any as S.Schema<CreateMembersResponse>;
export interface CreatePublishingDestinationResponse {
  DestinationId: string;
}
export const CreatePublishingDestinationResponse = S.suspend(() =>
  S.Struct({
    DestinationId: S.optional(S.String).pipe(T.JsonName("destinationId")),
  }),
).annotations({
  identifier: "CreatePublishingDestinationResponse",
}) as any as S.Schema<CreatePublishingDestinationResponse>;
export interface DeclineInvitationsResponse {
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const DeclineInvitationsResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "DeclineInvitationsResponse",
}) as any as S.Schema<DeclineInvitationsResponse>;
export interface GetAdministratorAccountResponse {
  Administrator: Administrator;
}
export const GetAdministratorAccountResponse = S.suspend(() =>
  S.Struct({
    Administrator: S.optional(Administrator)
      .pipe(T.JsonName("administrator"))
      .annotations({ identifier: "Administrator" }),
  }),
).annotations({
  identifier: "GetAdministratorAccountResponse",
}) as any as S.Schema<GetAdministratorAccountResponse>;
export interface GetMalwareProtectionPlanResponse {
  Arn?: string;
  Role?: string;
  ProtectedResource?: CreateProtectedResource;
  Actions?: MalwareProtectionPlanActions;
  CreatedAt?: Date;
  Status?: MalwareProtectionPlanStatus;
  StatusReasons?: MalwareProtectionPlanStatusReason[];
  Tags?: { [key: string]: string };
}
export const GetMalwareProtectionPlanResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    ProtectedResource: S.optional(CreateProtectedResource)
      .pipe(T.JsonName("protectedResource"))
      .annotations({ identifier: "CreateProtectedResource" }),
    Actions: S.optional(MalwareProtectionPlanActions)
      .pipe(T.JsonName("actions"))
      .annotations({ identifier: "MalwareProtectionPlanActions" }),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    Status: S.optional(MalwareProtectionPlanStatus).pipe(T.JsonName("status")),
    StatusReasons: S.optional(MalwareProtectionPlanStatusReasonsList).pipe(
      T.JsonName("statusReasons"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetMalwareProtectionPlanResponse",
}) as any as S.Schema<GetMalwareProtectionPlanResponse>;
export interface GetMasterAccountResponse {
  Master: Master;
}
export const GetMasterAccountResponse = S.suspend(() =>
  S.Struct({
    Master: S.optional(Master)
      .pipe(T.JsonName("master"))
      .annotations({ identifier: "Master" }),
  }),
).annotations({
  identifier: "GetMasterAccountResponse",
}) as any as S.Schema<GetMasterAccountResponse>;
export interface GetMembersResponse {
  Members: (Member & {
    AccountId: AccountId;
    MasterId: string;
    Email: Email;
    RelationshipStatus: string;
    UpdatedAt: string;
  })[];
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const GetMembersResponse = S.suspend(() =>
  S.Struct({
    Members: S.optional(Members).pipe(T.JsonName("members")),
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "GetMembersResponse",
}) as any as S.Schema<GetMembersResponse>;
export interface ListInvitationsResponse {
  Invitations?: Invitation[];
  NextToken?: string;
}
export const ListInvitationsResponse = S.suspend(() =>
  S.Struct({
    Invitations: S.optional(Invitations).pipe(T.JsonName("invitations")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListInvitationsResponse",
}) as any as S.Schema<ListInvitationsResponse>;
export interface ListMalwareProtectionPlansResponse {
  MalwareProtectionPlans?: MalwareProtectionPlanSummary[];
  NextToken?: string;
}
export const ListMalwareProtectionPlansResponse = S.suspend(() =>
  S.Struct({
    MalwareProtectionPlans: S.optional(MalwareProtectionPlansSummary).pipe(
      T.JsonName("malwareProtectionPlans"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListMalwareProtectionPlansResponse",
}) as any as S.Schema<ListMalwareProtectionPlansResponse>;
export interface ListMalwareScansRequest {
  MaxResults?: number;
  NextToken?: string;
  FilterCriteria?: ListMalwareScansFilterCriteria;
  SortCriteria?: SortCriteria;
}
export const ListMalwareScansRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
    FilterCriteria: S.optional(ListMalwareScansFilterCriteria)
      .pipe(T.JsonName("filterCriteria"))
      .annotations({ identifier: "ListMalwareScansFilterCriteria" }),
    SortCriteria: S.optional(SortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "SortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/malware-scan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMalwareScansRequest",
}) as any as S.Schema<ListMalwareScansRequest>;
export interface ListOrganizationAdminAccountsResponse {
  AdminAccounts?: AdminAccount[];
  NextToken?: string;
}
export const ListOrganizationAdminAccountsResponse = S.suspend(() =>
  S.Struct({
    AdminAccounts: S.optional(AdminAccounts).pipe(T.JsonName("adminAccounts")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListOrganizationAdminAccountsResponse",
}) as any as S.Schema<ListOrganizationAdminAccountsResponse>;
export interface ListPublishingDestinationsResponse {
  Destinations: (Destination & {
    DestinationId: string;
    DestinationType: DestinationType;
    Status: PublishingStatus;
  })[];
  NextToken?: string;
}
export const ListPublishingDestinationsResponse = S.suspend(() =>
  S.Struct({
    Destinations: S.optional(Destinations).pipe(T.JsonName("destinations")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListPublishingDestinationsResponse",
}) as any as S.Schema<ListPublishingDestinationsResponse>;
export interface StartMalwareScanRequest {
  ResourceArn?: string;
  ClientToken?: string;
  ScanConfiguration?: StartMalwareScanConfiguration;
}
export const StartMalwareScanRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    ScanConfiguration: S.optional(StartMalwareScanConfiguration)
      .pipe(T.JsonName("scanConfiguration"))
      .annotations({ identifier: "StartMalwareScanConfiguration" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/malware-scan/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMalwareScanRequest",
}) as any as S.Schema<StartMalwareScanRequest>;
export interface UpdateMalwareProtectionPlanRequest {
  MalwareProtectionPlanId: string;
  Role?: string;
  Actions?: MalwareProtectionPlanActions;
  ProtectedResource?: UpdateProtectedResource;
}
export const UpdateMalwareProtectionPlanRequest = S.suspend(() =>
  S.Struct({
    MalwareProtectionPlanId: S.String.pipe(
      T.HttpLabel("MalwareProtectionPlanId"),
      T.JsonName("malwareProtectionPlanId"),
    ),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    Actions: S.optional(MalwareProtectionPlanActions)
      .pipe(T.JsonName("actions"))
      .annotations({ identifier: "MalwareProtectionPlanActions" }),
    ProtectedResource: S.optional(UpdateProtectedResource)
      .pipe(T.JsonName("protectedResource"))
      .annotations({ identifier: "UpdateProtectedResource" }),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/malware-protection-plan/{MalwareProtectionPlanId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMalwareProtectionPlanRequest",
}) as any as S.Schema<UpdateMalwareProtectionPlanRequest>;
export interface UpdateMalwareProtectionPlanResponse {}
export const UpdateMalwareProtectionPlanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateMalwareProtectionPlanResponse",
}) as any as S.Schema<UpdateMalwareProtectionPlanResponse>;
export interface UpdateMemberDetectorsRequest {
  DetectorId: string;
  AccountIds?: string[];
  DataSources?: DataSourceConfigurations;
  Features?: MemberFeaturesConfiguration[];
}
export const UpdateMemberDetectorsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
    DataSources: S.optional(DataSourceConfigurations)
      .pipe(T.JsonName("dataSources"))
      .annotations({ identifier: "DataSourceConfigurations" }),
    Features: S.optional(MemberFeaturesConfigurations).pipe(
      T.JsonName("features"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/member/detector/update",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMemberDetectorsRequest",
}) as any as S.Schema<UpdateMemberDetectorsRequest>;
export interface FilterCriterion {
  CriterionKey?: CriterionKey;
  FilterCondition?: FilterCondition;
}
export const FilterCriterion = S.suspend(() =>
  S.Struct({
    CriterionKey: S.optional(CriterionKey).pipe(T.JsonName("criterionKey")),
    FilterCondition: S.optional(FilterCondition)
      .pipe(T.JsonName("filterCondition"))
      .annotations({ identifier: "FilterCondition" }),
  }),
).annotations({
  identifier: "FilterCriterion",
}) as any as S.Schema<FilterCriterion>;
export type FilterCriterionList = FilterCriterion[];
export const FilterCriterionList = S.Array(FilterCriterion);
export interface OrganizationS3LogsConfigurationResult {
  AutoEnable?: boolean;
}
export const OrganizationS3LogsConfigurationResult = S.suspend(() =>
  S.Struct({
    AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
  }),
).annotations({
  identifier: "OrganizationS3LogsConfigurationResult",
}) as any as S.Schema<OrganizationS3LogsConfigurationResult>;
export interface OrganizationAdditionalConfigurationResult {
  Name?: OrgFeatureAdditionalConfiguration;
  AutoEnable?: OrgFeatureStatus;
}
export const OrganizationAdditionalConfigurationResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(OrgFeatureAdditionalConfiguration).pipe(
      T.JsonName("name"),
    ),
    AutoEnable: S.optional(OrgFeatureStatus).pipe(T.JsonName("autoEnable")),
  }),
).annotations({
  identifier: "OrganizationAdditionalConfigurationResult",
}) as any as S.Schema<OrganizationAdditionalConfigurationResult>;
export type OrganizationAdditionalConfigurationResults =
  OrganizationAdditionalConfigurationResult[];
export const OrganizationAdditionalConfigurationResults = S.Array(
  OrganizationAdditionalConfigurationResult,
);
export interface CloudTrailConfigurationResult {
  Status?: DataSourceStatus;
}
export const CloudTrailConfigurationResult = S.suspend(() =>
  S.Struct({ Status: S.optional(DataSourceStatus).pipe(T.JsonName("status")) }),
).annotations({
  identifier: "CloudTrailConfigurationResult",
}) as any as S.Schema<CloudTrailConfigurationResult>;
export interface DNSLogsConfigurationResult {
  Status?: DataSourceStatus;
}
export const DNSLogsConfigurationResult = S.suspend(() =>
  S.Struct({ Status: S.optional(DataSourceStatus).pipe(T.JsonName("status")) }),
).annotations({
  identifier: "DNSLogsConfigurationResult",
}) as any as S.Schema<DNSLogsConfigurationResult>;
export interface FlowLogsConfigurationResult {
  Status?: DataSourceStatus;
}
export const FlowLogsConfigurationResult = S.suspend(() =>
  S.Struct({ Status: S.optional(DataSourceStatus).pipe(T.JsonName("status")) }),
).annotations({
  identifier: "FlowLogsConfigurationResult",
}) as any as S.Schema<FlowLogsConfigurationResult>;
export interface S3LogsConfigurationResult {
  Status?: DataSourceStatus;
}
export const S3LogsConfigurationResult = S.suspend(() =>
  S.Struct({ Status: S.optional(DataSourceStatus).pipe(T.JsonName("status")) }),
).annotations({
  identifier: "S3LogsConfigurationResult",
}) as any as S.Schema<S3LogsConfigurationResult>;
export interface DetectorAdditionalConfigurationResult {
  Name?: FeatureAdditionalConfiguration;
  Status?: FeatureStatus;
  UpdatedAt?: Date;
}
export const DetectorAdditionalConfigurationResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(FeatureAdditionalConfiguration).pipe(T.JsonName("name")),
    Status: S.optional(FeatureStatus).pipe(T.JsonName("status")),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({
  identifier: "DetectorAdditionalConfigurationResult",
}) as any as S.Schema<DetectorAdditionalConfigurationResult>;
export type DetectorAdditionalConfigurationResults =
  DetectorAdditionalConfigurationResult[];
export const DetectorAdditionalConfigurationResults = S.Array(
  DetectorAdditionalConfigurationResult,
);
export type CountBySeverity = { [key: string]: number };
export const CountBySeverity = S.Record({ key: S.String, value: S.Number });
export interface AccountStatistics {
  AccountId?: string;
  LastGeneratedAt?: Date;
  TotalFindings?: number;
}
export const AccountStatistics = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    LastGeneratedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastGeneratedAt")),
    TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
  }),
).annotations({
  identifier: "AccountStatistics",
}) as any as S.Schema<AccountStatistics>;
export type GroupedByAccount = AccountStatistics[];
export const GroupedByAccount = S.Array(AccountStatistics);
export interface DateStatistics {
  Date?: Date;
  LastGeneratedAt?: Date;
  Severity?: number;
  TotalFindings?: number;
}
export const DateStatistics = S.suspend(() =>
  S.Struct({
    Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("date"),
    ),
    LastGeneratedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastGeneratedAt")),
    Severity: S.optional(S.Number).pipe(T.JsonName("severity")),
    TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
  }),
).annotations({
  identifier: "DateStatistics",
}) as any as S.Schema<DateStatistics>;
export type GroupedByDate = DateStatistics[];
export const GroupedByDate = S.Array(DateStatistics);
export interface FindingTypeStatistics {
  FindingType?: string;
  LastGeneratedAt?: Date;
  TotalFindings?: number;
}
export const FindingTypeStatistics = S.suspend(() =>
  S.Struct({
    FindingType: S.optional(S.String).pipe(T.JsonName("findingType")),
    LastGeneratedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastGeneratedAt")),
    TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
  }),
).annotations({
  identifier: "FindingTypeStatistics",
}) as any as S.Schema<FindingTypeStatistics>;
export type GroupedByFindingType = FindingTypeStatistics[];
export const GroupedByFindingType = S.Array(FindingTypeStatistics);
export interface ResourceStatistics {
  AccountId?: string;
  LastGeneratedAt?: Date;
  ResourceId?: string;
  ResourceType?: string;
  TotalFindings?: number;
}
export const ResourceStatistics = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    LastGeneratedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastGeneratedAt")),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
    TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
  }),
).annotations({
  identifier: "ResourceStatistics",
}) as any as S.Schema<ResourceStatistics>;
export type GroupedByResource = ResourceStatistics[];
export const GroupedByResource = S.Array(ResourceStatistics);
export interface SeverityStatistics {
  LastGeneratedAt?: Date;
  Severity?: number;
  TotalFindings?: number;
}
export const SeverityStatistics = S.suspend(() =>
  S.Struct({
    LastGeneratedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastGeneratedAt")),
    Severity: S.optional(S.Number).pipe(T.JsonName("severity")),
    TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
  }),
).annotations({
  identifier: "SeverityStatistics",
}) as any as S.Schema<SeverityStatistics>;
export type GroupedBySeverity = SeverityStatistics[];
export const GroupedBySeverity = S.Array(SeverityStatistics);
export interface TriggerDetails {
  GuardDutyFindingId?: string;
  Description?: string;
  TriggerType?: TriggerType;
}
export const TriggerDetails = S.suspend(() =>
  S.Struct({
    GuardDutyFindingId: S.optional(S.String).pipe(
      T.JsonName("guardDutyFindingId"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    TriggerType: S.optional(TriggerType).pipe(T.JsonName("triggerType")),
  }),
).annotations({
  identifier: "TriggerDetails",
}) as any as S.Schema<TriggerDetails>;
export interface ScanConfigurationRecoveryPoint {
  BackupVaultName?: string;
}
export const ScanConfigurationRecoveryPoint = S.suspend(() =>
  S.Struct({
    BackupVaultName: S.optional(S.String).pipe(T.JsonName("backupVaultName")),
  }),
).annotations({
  identifier: "ScanConfigurationRecoveryPoint",
}) as any as S.Schema<ScanConfigurationRecoveryPoint>;
export interface FreeTrialFeatureConfigurationResult {
  Name?: FreeTrialFeatureResult;
  FreeTrialDaysRemaining?: number;
}
export const FreeTrialFeatureConfigurationResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(FreeTrialFeatureResult).pipe(T.JsonName("name")),
    FreeTrialDaysRemaining: S.optional(S.Number).pipe(
      T.JsonName("freeTrialDaysRemaining"),
    ),
  }),
).annotations({
  identifier: "FreeTrialFeatureConfigurationResult",
}) as any as S.Schema<FreeTrialFeatureConfigurationResult>;
export type FreeTrialFeatureConfigurationsResults =
  FreeTrialFeatureConfigurationResult[];
export const FreeTrialFeatureConfigurationsResults = S.Array(
  FreeTrialFeatureConfigurationResult,
);
export type CoverageStatus = "HEALTHY" | "UNHEALTHY";
export const CoverageStatus = S.Literal("HEALTHY", "UNHEALTHY");
export interface OrganizationKubernetesConfiguration {
  AuditLogs?: OrganizationKubernetesAuditLogsConfiguration;
}
export const OrganizationKubernetesConfiguration = S.suspend(() =>
  S.Struct({
    AuditLogs: S.optional(OrganizationKubernetesAuditLogsConfiguration)
      .pipe(T.JsonName("auditLogs"))
      .annotations({
        identifier: "OrganizationKubernetesAuditLogsConfiguration",
      }),
  }),
).annotations({
  identifier: "OrganizationKubernetesConfiguration",
}) as any as S.Schema<OrganizationKubernetesConfiguration>;
export interface VolumeDetail {
  VolumeArn?: string;
  VolumeType?: string;
  DeviceName?: string;
  VolumeSizeInGB?: number;
  EncryptionType?: string;
  SnapshotArn?: string;
  KmsKeyArn?: string;
}
export const VolumeDetail = S.suspend(() =>
  S.Struct({
    VolumeArn: S.optional(S.String).pipe(T.JsonName("volumeArn")),
    VolumeType: S.optional(S.String).pipe(T.JsonName("volumeType")),
    DeviceName: S.optional(S.String).pipe(T.JsonName("deviceName")),
    VolumeSizeInGB: S.optional(S.Number).pipe(T.JsonName("volumeSizeInGB")),
    EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
    SnapshotArn: S.optional(S.String).pipe(T.JsonName("snapshotArn")),
    KmsKeyArn: S.optional(S.String).pipe(T.JsonName("kmsKeyArn")),
  }),
).annotations({ identifier: "VolumeDetail" }) as any as S.Schema<VolumeDetail>;
export type VolumeDetails = VolumeDetail[];
export const VolumeDetails = S.Array(VolumeDetail);
export type Sources = string[];
export const Sources = S.Array(S.String);
export type ScanType = "GUARDDUTY_INITIATED" | "ON_DEMAND";
export const ScanType = S.Literal("GUARDDUTY_INITIATED", "ON_DEMAND");
export interface OrganizationFeatureStatisticsAdditionalConfiguration {
  Name?: OrgFeatureAdditionalConfiguration;
  EnabledAccountsCount?: number;
}
export const OrganizationFeatureStatisticsAdditionalConfiguration = S.suspend(
  () =>
    S.Struct({
      Name: S.optional(OrgFeatureAdditionalConfiguration).pipe(
        T.JsonName("name"),
      ),
      EnabledAccountsCount: S.optional(S.Number).pipe(
        T.JsonName("enabledAccountsCount"),
      ),
    }),
).annotations({
  identifier: "OrganizationFeatureStatisticsAdditionalConfiguration",
}) as any as S.Schema<OrganizationFeatureStatisticsAdditionalConfiguration>;
export type OrganizationFeatureStatisticsAdditionalConfigurations =
  OrganizationFeatureStatisticsAdditionalConfiguration[];
export const OrganizationFeatureStatisticsAdditionalConfigurations = S.Array(
  OrganizationFeatureStatisticsAdditionalConfiguration,
);
export interface OrganizationEbsVolumes {
  AutoEnable?: boolean;
}
export const OrganizationEbsVolumes = S.suspend(() =>
  S.Struct({
    AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
  }),
).annotations({
  identifier: "OrganizationEbsVolumes",
}) as any as S.Schema<OrganizationEbsVolumes>;
export interface FilterCriteria {
  FilterCriterion?: FilterCriterion[];
}
export const FilterCriteria = S.suspend(() =>
  S.Struct({
    FilterCriterion: S.optional(FilterCriterionList).pipe(
      T.JsonName("filterCriterion"),
    ),
  }),
).annotations({
  identifier: "FilterCriteria",
}) as any as S.Schema<FilterCriteria>;
export interface OrganizationFeatureConfigurationResult {
  Name?: OrgFeature;
  AutoEnable?: OrgFeatureStatus;
  AdditionalConfiguration?: OrganizationAdditionalConfigurationResult[];
}
export const OrganizationFeatureConfigurationResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(OrgFeature).pipe(T.JsonName("name")),
    AutoEnable: S.optional(OrgFeatureStatus).pipe(T.JsonName("autoEnable")),
    AdditionalConfiguration: S.optional(
      OrganizationAdditionalConfigurationResults,
    ).pipe(T.JsonName("additionalConfiguration")),
  }),
).annotations({
  identifier: "OrganizationFeatureConfigurationResult",
}) as any as S.Schema<OrganizationFeatureConfigurationResult>;
export type OrganizationFeaturesConfigurationsResults =
  OrganizationFeatureConfigurationResult[];
export const OrganizationFeaturesConfigurationsResults = S.Array(
  OrganizationFeatureConfigurationResult,
);
export interface DetectorFeatureConfigurationResult {
  Name?: DetectorFeatureResult;
  Status?: FeatureStatus;
  UpdatedAt?: Date;
  AdditionalConfiguration?: DetectorAdditionalConfigurationResult[];
}
export const DetectorFeatureConfigurationResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(DetectorFeatureResult).pipe(T.JsonName("name")),
    Status: S.optional(FeatureStatus).pipe(T.JsonName("status")),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("updatedAt"),
    ),
    AdditionalConfiguration: S.optional(
      DetectorAdditionalConfigurationResults,
    ).pipe(T.JsonName("additionalConfiguration")),
  }),
).annotations({
  identifier: "DetectorFeatureConfigurationResult",
}) as any as S.Schema<DetectorFeatureConfigurationResult>;
export type DetectorFeatureConfigurationsResults =
  DetectorFeatureConfigurationResult[];
export const DetectorFeatureConfigurationsResults = S.Array(
  DetectorFeatureConfigurationResult,
);
export interface FindingStatistics {
  CountBySeverity?: { [key: string]: number };
  GroupedByAccount?: AccountStatistics[];
  GroupedByDate?: DateStatistics[];
  GroupedByFindingType?: FindingTypeStatistics[];
  GroupedByResource?: ResourceStatistics[];
  GroupedBySeverity?: SeverityStatistics[];
}
export const FindingStatistics = S.suspend(() =>
  S.Struct({
    CountBySeverity: S.optional(CountBySeverity).pipe(
      T.JsonName("countBySeverity"),
    ),
    GroupedByAccount: S.optional(GroupedByAccount).pipe(
      T.JsonName("groupedByAccount"),
    ),
    GroupedByDate: S.optional(GroupedByDate).pipe(T.JsonName("groupedByDate")),
    GroupedByFindingType: S.optional(GroupedByFindingType).pipe(
      T.JsonName("groupedByFindingType"),
    ),
    GroupedByResource: S.optional(GroupedByResource).pipe(
      T.JsonName("groupedByResource"),
    ),
    GroupedBySeverity: S.optional(GroupedBySeverity).pipe(
      T.JsonName("groupedBySeverity"),
    ),
  }),
).annotations({
  identifier: "FindingStatistics",
}) as any as S.Schema<FindingStatistics>;
export interface ScanConfiguration {
  Role?: string;
  TriggerDetails?: TriggerDetails;
  IncrementalScanDetails?: IncrementalScanDetails;
  RecoveryPoint?: ScanConfigurationRecoveryPoint;
}
export const ScanConfiguration = S.suspend(() =>
  S.Struct({
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    TriggerDetails: S.optional(TriggerDetails)
      .pipe(T.JsonName("triggerDetails"))
      .annotations({ identifier: "TriggerDetails" }),
    IncrementalScanDetails: S.optional(IncrementalScanDetails)
      .pipe(T.JsonName("incrementalScanDetails"))
      .annotations({ identifier: "IncrementalScanDetails" }),
    RecoveryPoint: S.optional(ScanConfigurationRecoveryPoint)
      .pipe(T.JsonName("recoveryPoint"))
      .annotations({ identifier: "ScanConfigurationRecoveryPoint" }),
  }),
).annotations({
  identifier: "ScanConfiguration",
}) as any as S.Schema<ScanConfiguration>;
export interface OrganizationKubernetesAuditLogsConfigurationResult {
  AutoEnable?: boolean;
}
export const OrganizationKubernetesAuditLogsConfigurationResult = S.suspend(
  () =>
    S.Struct({
      AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
    }),
).annotations({
  identifier: "OrganizationKubernetesAuditLogsConfigurationResult",
}) as any as S.Schema<OrganizationKubernetesAuditLogsConfigurationResult>;
export interface KubernetesAuditLogsConfigurationResult {
  Status?: DataSourceStatus;
}
export const KubernetesAuditLogsConfigurationResult = S.suspend(() =>
  S.Struct({ Status: S.optional(DataSourceStatus).pipe(T.JsonName("status")) }),
).annotations({
  identifier: "KubernetesAuditLogsConfigurationResult",
}) as any as S.Schema<KubernetesAuditLogsConfigurationResult>;
export interface AccessKeyDetails {
  AccessKeyId?: string;
  PrincipalId?: string;
  UserName?: string;
  UserType?: string;
}
export const AccessKeyDetails = S.suspend(() =>
  S.Struct({
    AccessKeyId: S.optional(S.String).pipe(T.JsonName("accessKeyId")),
    PrincipalId: S.optional(S.String).pipe(T.JsonName("principalId")),
    UserName: S.optional(S.String).pipe(T.JsonName("userName")),
    UserType: S.optional(S.String).pipe(T.JsonName("userType")),
  }),
).annotations({
  identifier: "AccessKeyDetails",
}) as any as S.Schema<AccessKeyDetails>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String).pipe(T.JsonName("key")),
    Value: S.optional(S.String).pipe(T.JsonName("value")),
  }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface EksClusterDetails {
  Name?: string;
  Arn?: string;
  VpcId?: string;
  Status?: string;
  Tags?: Tag[];
  CreatedAt?: Date;
}
export const EksClusterDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
  }),
).annotations({
  identifier: "EksClusterDetails",
}) as any as S.Schema<EksClusterDetails>;
export interface EbsVolumeDetails {
  ScannedVolumeDetails?: VolumeDetail[];
  SkippedVolumeDetails?: VolumeDetail[];
}
export const EbsVolumeDetails = S.suspend(() =>
  S.Struct({
    ScannedVolumeDetails: S.optional(VolumeDetails).pipe(
      T.JsonName("scannedVolumeDetails"),
    ),
    SkippedVolumeDetails: S.optional(VolumeDetails).pipe(
      T.JsonName("skippedVolumeDetails"),
    ),
  }),
).annotations({
  identifier: "EbsVolumeDetails",
}) as any as S.Schema<EbsVolumeDetails>;
export interface RdsDbInstanceDetails {
  DbInstanceIdentifier?: string;
  Engine?: string;
  EngineVersion?: string;
  DbClusterIdentifier?: string;
  DbInstanceArn?: string;
  DbiResourceId?: string;
  Tags?: Tag[];
}
export const RdsDbInstanceDetails = S.suspend(() =>
  S.Struct({
    DbInstanceIdentifier: S.optional(S.String).pipe(
      T.JsonName("dbInstanceIdentifier"),
    ),
    Engine: S.optional(S.String).pipe(T.JsonName("engine")),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    DbClusterIdentifier: S.optional(S.String).pipe(
      T.JsonName("dbClusterIdentifier"),
    ),
    DbInstanceArn: S.optional(S.String).pipe(T.JsonName("dbInstanceArn")),
    DbiResourceId: S.optional(S.String).pipe(T.JsonName("dbiResourceId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "RdsDbInstanceDetails",
}) as any as S.Schema<RdsDbInstanceDetails>;
export interface RdsLimitlessDbDetails {
  DbShardGroupIdentifier?: string;
  DbShardGroupResourceId?: string;
  DbShardGroupArn?: string;
  Engine?: string;
  EngineVersion?: string;
  DbClusterIdentifier?: string;
  Tags?: Tag[];
}
export const RdsLimitlessDbDetails = S.suspend(() =>
  S.Struct({
    DbShardGroupIdentifier: S.optional(S.String).pipe(
      T.JsonName("dbShardGroupIdentifier"),
    ),
    DbShardGroupResourceId: S.optional(S.String).pipe(
      T.JsonName("dbShardGroupResourceId"),
    ),
    DbShardGroupArn: S.optional(S.String).pipe(T.JsonName("dbShardGroupArn")),
    Engine: S.optional(S.String).pipe(T.JsonName("engine")),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    DbClusterIdentifier: S.optional(S.String).pipe(
      T.JsonName("dbClusterIdentifier"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "RdsLimitlessDbDetails",
}) as any as S.Schema<RdsLimitlessDbDetails>;
export interface RdsDbUserDetails {
  User?: string;
  Application?: string;
  Database?: string;
  Ssl?: string;
  AuthMethod?: string;
}
export const RdsDbUserDetails = S.suspend(() =>
  S.Struct({
    User: S.optional(S.String).pipe(T.JsonName("user")),
    Application: S.optional(S.String).pipe(T.JsonName("application")),
    Database: S.optional(S.String).pipe(T.JsonName("database")),
    Ssl: S.optional(S.String).pipe(T.JsonName("ssl")),
    AuthMethod: S.optional(S.String).pipe(T.JsonName("authMethod")),
  }),
).annotations({
  identifier: "RdsDbUserDetails",
}) as any as S.Schema<RdsDbUserDetails>;
export interface EbsSnapshotDetails {
  SnapshotArn?: string;
}
export const EbsSnapshotDetails = S.suspend(() =>
  S.Struct({
    SnapshotArn: S.optional(S.String).pipe(T.JsonName("snapshotArn")),
  }),
).annotations({
  identifier: "EbsSnapshotDetails",
}) as any as S.Schema<EbsSnapshotDetails>;
export interface Ec2ImageDetails {
  ImageArn?: string;
}
export const Ec2ImageDetails = S.suspend(() =>
  S.Struct({ ImageArn: S.optional(S.String).pipe(T.JsonName("imageArn")) }),
).annotations({
  identifier: "Ec2ImageDetails",
}) as any as S.Schema<Ec2ImageDetails>;
export interface RecoveryPointDetails {
  RecoveryPointArn?: string;
  BackupVaultName?: string;
}
export const RecoveryPointDetails = S.suspend(() =>
  S.Struct({
    RecoveryPointArn: S.optional(S.String).pipe(T.JsonName("recoveryPointArn")),
    BackupVaultName: S.optional(S.String).pipe(T.JsonName("backupVaultName")),
  }),
).annotations({
  identifier: "RecoveryPointDetails",
}) as any as S.Schema<RecoveryPointDetails>;
export interface ServiceAdditionalInfo {
  Value?: string;
  Type?: string;
}
export const ServiceAdditionalInfo = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String).pipe(T.JsonName("value")),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "ServiceAdditionalInfo",
}) as any as S.Schema<ServiceAdditionalInfo>;
export interface EbsSnapshot {
  DeviceName?: string;
}
export const EbsSnapshot = S.suspend(() =>
  S.Struct({ DeviceName: S.optional(S.String).pipe(T.JsonName("deviceName")) }),
).annotations({ identifier: "EbsSnapshot" }) as any as S.Schema<EbsSnapshot>;
export interface MemberAdditionalConfigurationResult {
  Name?: OrgFeatureAdditionalConfiguration;
  Status?: FeatureStatus;
  UpdatedAt?: Date;
}
export const MemberAdditionalConfigurationResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(OrgFeatureAdditionalConfiguration).pipe(
      T.JsonName("name"),
    ),
    Status: S.optional(FeatureStatus).pipe(T.JsonName("status")),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({
  identifier: "MemberAdditionalConfigurationResult",
}) as any as S.Schema<MemberAdditionalConfigurationResult>;
export type MemberAdditionalConfigurationResults =
  MemberAdditionalConfigurationResult[];
export const MemberAdditionalConfigurationResults = S.Array(
  MemberAdditionalConfigurationResult,
);
export interface OrganizationFeatureStatistics {
  Name?: OrgFeature;
  EnabledAccountsCount?: number;
  AdditionalConfiguration?: OrganizationFeatureStatisticsAdditionalConfiguration[];
}
export const OrganizationFeatureStatistics = S.suspend(() =>
  S.Struct({
    Name: S.optional(OrgFeature).pipe(T.JsonName("name")),
    EnabledAccountsCount: S.optional(S.Number).pipe(
      T.JsonName("enabledAccountsCount"),
    ),
    AdditionalConfiguration: S.optional(
      OrganizationFeatureStatisticsAdditionalConfigurations,
    ).pipe(T.JsonName("additionalConfiguration")),
  }),
).annotations({
  identifier: "OrganizationFeatureStatistics",
}) as any as S.Schema<OrganizationFeatureStatistics>;
export type OrganizationFeatureStatisticsResults =
  OrganizationFeatureStatistics[];
export const OrganizationFeatureStatisticsResults = S.Array(
  OrganizationFeatureStatistics,
);
export interface DataSourceFreeTrial {
  FreeTrialDaysRemaining?: number;
}
export const DataSourceFreeTrial = S.suspend(() =>
  S.Struct({
    FreeTrialDaysRemaining: S.optional(S.Number).pipe(
      T.JsonName("freeTrialDaysRemaining"),
    ),
  }),
).annotations({
  identifier: "DataSourceFreeTrial",
}) as any as S.Schema<DataSourceFreeTrial>;
export interface KubernetesDataSourceFreeTrial {
  AuditLogs?: DataSourceFreeTrial;
}
export const KubernetesDataSourceFreeTrial = S.suspend(() =>
  S.Struct({
    AuditLogs: S.optional(DataSourceFreeTrial)
      .pipe(T.JsonName("auditLogs"))
      .annotations({ identifier: "DataSourceFreeTrial" }),
  }),
).annotations({
  identifier: "KubernetesDataSourceFreeTrial",
}) as any as S.Schema<KubernetesDataSourceFreeTrial>;
export interface MalwareProtectionDataSourceFreeTrial {
  ScanEc2InstanceWithFindings?: DataSourceFreeTrial;
}
export const MalwareProtectionDataSourceFreeTrial = S.suspend(() =>
  S.Struct({
    ScanEc2InstanceWithFindings: S.optional(DataSourceFreeTrial)
      .pipe(T.JsonName("scanEc2InstanceWithFindings"))
      .annotations({ identifier: "DataSourceFreeTrial" }),
  }),
).annotations({
  identifier: "MalwareProtectionDataSourceFreeTrial",
}) as any as S.Schema<MalwareProtectionDataSourceFreeTrial>;
export type ResourceType = "EKS" | "ECS" | "EC2";
export const ResourceType = S.Literal("EKS", "ECS", "EC2");
export interface OrganizationScanEc2InstanceWithFindings {
  EbsVolumes?: OrganizationEbsVolumes;
}
export const OrganizationScanEc2InstanceWithFindings = S.suspend(() =>
  S.Struct({
    EbsVolumes: S.optional(OrganizationEbsVolumes)
      .pipe(T.JsonName("ebsVolumes"))
      .annotations({ identifier: "OrganizationEbsVolumes" }),
  }),
).annotations({
  identifier: "OrganizationScanEc2InstanceWithFindings",
}) as any as S.Schema<OrganizationScanEc2InstanceWithFindings>;
export interface CreateDetectorRequest {
  Enable?: boolean;
  ClientToken?: string;
  FindingPublishingFrequency?: FindingPublishingFrequency;
  DataSources?: DataSourceConfigurations;
  Tags?: { [key: string]: string };
  Features?: DetectorFeatureConfiguration[];
}
export const CreateDetectorRequest = S.suspend(() =>
  S.Struct({
    Enable: S.optional(S.Boolean).pipe(T.JsonName("enable")),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    FindingPublishingFrequency: S.optional(FindingPublishingFrequency).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    DataSources: S.optional(DataSourceConfigurations)
      .pipe(T.JsonName("dataSources"))
      .annotations({ identifier: "DataSourceConfigurations" }),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    Features: S.optional(DetectorFeatureConfigurations).pipe(
      T.JsonName("features"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDetectorRequest",
}) as any as S.Schema<CreateDetectorRequest>;
export interface CreateFilterRequest {
  DetectorId: string;
  Name?: string;
  Description?: string;
  Action?: FilterAction;
  Rank?: number;
  FindingCriteria?: FindingCriteria;
  ClientToken?: string;
  Tags?: { [key: string]: string };
}
export const CreateFilterRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Action: S.optional(FilterAction).pipe(T.JsonName("action")),
    Rank: S.optional(S.Number).pipe(T.JsonName("rank")),
    FindingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/filter" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFilterRequest",
}) as any as S.Schema<CreateFilterRequest>;
export interface CreateMalwareProtectionPlanResponse {
  MalwareProtectionPlanId?: string;
}
export const CreateMalwareProtectionPlanResponse = S.suspend(() =>
  S.Struct({
    MalwareProtectionPlanId: S.optional(S.String).pipe(
      T.JsonName("malwareProtectionPlanId"),
    ),
  }),
).annotations({
  identifier: "CreateMalwareProtectionPlanResponse",
}) as any as S.Schema<CreateMalwareProtectionPlanResponse>;
export interface DescribeMalwareScansRequest {
  DetectorId: string;
  NextToken?: string;
  MaxResults?: number;
  FilterCriteria?: FilterCriteria;
  SortCriteria?: SortCriteria;
}
export const DescribeMalwareScansRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    FilterCriteria: S.optional(FilterCriteria)
      .pipe(T.JsonName("filterCriteria"))
      .annotations({ identifier: "FilterCriteria" }),
    SortCriteria: S.optional(SortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "SortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/malware-scans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMalwareScansRequest",
}) as any as S.Schema<DescribeMalwareScansRequest>;
export interface GetCoverageStatisticsRequest {
  DetectorId: string;
  FilterCriteria?: CoverageFilterCriteria;
  StatisticsType?: CoverageStatisticsType[];
}
export const GetCoverageStatisticsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FilterCriteria: S.optional(CoverageFilterCriteria)
      .pipe(T.JsonName("filterCriteria"))
      .annotations({ identifier: "CoverageFilterCriteria" }),
    StatisticsType: S.optional(CoverageStatisticsTypeList).pipe(
      T.JsonName("statisticsType"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/coverage/statistics",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCoverageStatisticsRequest",
}) as any as S.Schema<GetCoverageStatisticsRequest>;
export type Ipv6Addresses = string[];
export const Ipv6Addresses = S.Array(S.String);
export type Groups = string[];
export const Groups = S.Array(S.String);
export type SessionNameList = string[];
export const SessionNameList = S.Array(S.String);
export interface VolumeMount {
  Name?: string;
  MountPath?: string;
}
export const VolumeMount = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    MountPath: S.optional(S.String).pipe(T.JsonName("mountPath")),
  }),
).annotations({ identifier: "VolumeMount" }) as any as S.Schema<VolumeMount>;
export type VolumeMounts = VolumeMount[];
export const VolumeMounts = S.Array(VolumeMount);
export interface SecurityContext {
  Privileged?: boolean;
  AllowPrivilegeEscalation?: boolean;
}
export const SecurityContext = S.suspend(() =>
  S.Struct({
    Privileged: S.optional(S.Boolean).pipe(T.JsonName("privileged")),
    AllowPrivilegeEscalation: S.optional(S.Boolean).pipe(
      T.JsonName("allowPrivilegeEscalation"),
    ),
  }),
).annotations({
  identifier: "SecurityContext",
}) as any as S.Schema<SecurityContext>;
export interface Container {
  ContainerRuntime?: string;
  Id?: string;
  Name?: string;
  Image?: string;
  ImagePrefix?: string;
  VolumeMounts?: VolumeMount[];
  SecurityContext?: SecurityContext;
}
export const Container = S.suspend(() =>
  S.Struct({
    ContainerRuntime: S.optional(S.String).pipe(T.JsonName("containerRuntime")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Image: S.optional(S.String).pipe(T.JsonName("image")),
    ImagePrefix: S.optional(S.String).pipe(T.JsonName("imagePrefix")),
    VolumeMounts: S.optional(VolumeMounts).pipe(T.JsonName("volumeMounts")),
    SecurityContext: S.optional(SecurityContext)
      .pipe(T.JsonName("securityContext"))
      .annotations({ identifier: "SecurityContext" }),
  }),
).annotations({ identifier: "Container" }) as any as S.Schema<Container>;
export type Containers = Container[];
export const Containers = S.Array(Container);
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SourceIps = string[];
export const SourceIps = S.Array(S.String);
export type ThreatNames = string[];
export const ThreatNames = S.Array(S.String);
export type FlagsList = string[];
export const FlagsList = S.Array(S.String);
export type MemoryRegionsList = string[];
export const MemoryRegionsList = S.Array(S.String);
export type AdditionalSequenceTypes = string[];
export const AdditionalSequenceTypes = S.Array(S.String);
export interface GetFindingsStatisticsResponse {
  FindingStatistics: FindingStatistics;
  NextToken?: string;
}
export const GetFindingsStatisticsResponse = S.suspend(() =>
  S.Struct({
    FindingStatistics: S.optional(FindingStatistics)
      .pipe(T.JsonName("findingStatistics"))
      .annotations({ identifier: "FindingStatistics" }),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetFindingsStatisticsResponse",
}) as any as S.Schema<GetFindingsStatisticsResponse>;
export interface StartMalwareScanResponse {
  ScanId?: string;
}
export const StartMalwareScanResponse = S.suspend(() =>
  S.Struct({ ScanId: S.optional(S.String).pipe(T.JsonName("scanId")) }),
).annotations({
  identifier: "StartMalwareScanResponse",
}) as any as S.Schema<StartMalwareScanResponse>;
export interface UpdateMemberDetectorsResponse {
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const UpdateMemberDetectorsResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "UpdateMemberDetectorsResponse",
}) as any as S.Schema<UpdateMemberDetectorsResponse>;
export interface OrganizationKubernetesConfigurationResult {
  AuditLogs?: OrganizationKubernetesAuditLogsConfigurationResult;
}
export const OrganizationKubernetesConfigurationResult = S.suspend(() =>
  S.Struct({
    AuditLogs: S.optional(OrganizationKubernetesAuditLogsConfigurationResult)
      .pipe(T.JsonName("auditLogs"))
      .annotations({
        identifier: "OrganizationKubernetesAuditLogsConfigurationResult",
      }),
  }),
).annotations({
  identifier: "OrganizationKubernetesConfigurationResult",
}) as any as S.Schema<OrganizationKubernetesConfigurationResult>;
export interface KubernetesConfigurationResult {
  AuditLogs?: KubernetesAuditLogsConfigurationResult;
}
export const KubernetesConfigurationResult = S.suspend(() =>
  S.Struct({
    AuditLogs: S.optional(KubernetesAuditLogsConfigurationResult)
      .pipe(T.JsonName("auditLogs"))
      .annotations({ identifier: "KubernetesAuditLogsConfigurationResult" }),
  }),
).annotations({
  identifier: "KubernetesConfigurationResult",
}) as any as S.Schema<KubernetesConfigurationResult>;
export interface ScannedResourceDetails {
  EbsVolume?: VolumeDetail;
  EbsSnapshot?: EbsSnapshot;
}
export const ScannedResourceDetails = S.suspend(() =>
  S.Struct({
    EbsVolume: S.optional(VolumeDetail)
      .pipe(T.JsonName("ebsVolume"))
      .annotations({ identifier: "VolumeDetail" }),
    EbsSnapshot: S.optional(EbsSnapshot)
      .pipe(T.JsonName("ebsSnapshot"))
      .annotations({ identifier: "EbsSnapshot" }),
  }),
).annotations({
  identifier: "ScannedResourceDetails",
}) as any as S.Schema<ScannedResourceDetails>;
export interface MemberFeaturesConfigurationResult {
  Name?: OrgFeature;
  Status?: FeatureStatus;
  UpdatedAt?: Date;
  AdditionalConfiguration?: MemberAdditionalConfigurationResult[];
}
export const MemberFeaturesConfigurationResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(OrgFeature).pipe(T.JsonName("name")),
    Status: S.optional(FeatureStatus).pipe(T.JsonName("status")),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("updatedAt"),
    ),
    AdditionalConfiguration: S.optional(
      MemberAdditionalConfigurationResults,
    ).pipe(T.JsonName("additionalConfiguration")),
  }),
).annotations({
  identifier: "MemberFeaturesConfigurationResult",
}) as any as S.Schema<MemberFeaturesConfigurationResult>;
export type MemberFeaturesConfigurationsResults =
  MemberFeaturesConfigurationResult[];
export const MemberFeaturesConfigurationsResults = S.Array(
  MemberFeaturesConfigurationResult,
);
export interface OrganizationStatistics {
  TotalAccountsCount?: number;
  MemberAccountsCount?: number;
  ActiveAccountsCount?: number;
  EnabledAccountsCount?: number;
  CountByFeature?: OrganizationFeatureStatistics[];
}
export const OrganizationStatistics = S.suspend(() =>
  S.Struct({
    TotalAccountsCount: S.optional(S.Number).pipe(
      T.JsonName("totalAccountsCount"),
    ),
    MemberAccountsCount: S.optional(S.Number).pipe(
      T.JsonName("memberAccountsCount"),
    ),
    ActiveAccountsCount: S.optional(S.Number).pipe(
      T.JsonName("activeAccountsCount"),
    ),
    EnabledAccountsCount: S.optional(S.Number).pipe(
      T.JsonName("enabledAccountsCount"),
    ),
    CountByFeature: S.optional(OrganizationFeatureStatisticsResults).pipe(
      T.JsonName("countByFeature"),
    ),
  }),
).annotations({
  identifier: "OrganizationStatistics",
}) as any as S.Schema<OrganizationStatistics>;
export interface DataSourcesFreeTrial {
  CloudTrail?: DataSourceFreeTrial;
  DnsLogs?: DataSourceFreeTrial;
  FlowLogs?: DataSourceFreeTrial;
  S3Logs?: DataSourceFreeTrial;
  Kubernetes?: KubernetesDataSourceFreeTrial;
  MalwareProtection?: MalwareProtectionDataSourceFreeTrial;
}
export const DataSourcesFreeTrial = S.suspend(() =>
  S.Struct({
    CloudTrail: S.optional(DataSourceFreeTrial)
      .pipe(T.JsonName("cloudTrail"))
      .annotations({ identifier: "DataSourceFreeTrial" }),
    DnsLogs: S.optional(DataSourceFreeTrial)
      .pipe(T.JsonName("dnsLogs"))
      .annotations({ identifier: "DataSourceFreeTrial" }),
    FlowLogs: S.optional(DataSourceFreeTrial)
      .pipe(T.JsonName("flowLogs"))
      .annotations({ identifier: "DataSourceFreeTrial" }),
    S3Logs: S.optional(DataSourceFreeTrial)
      .pipe(T.JsonName("s3Logs"))
      .annotations({ identifier: "DataSourceFreeTrial" }),
    Kubernetes: S.optional(KubernetesDataSourceFreeTrial)
      .pipe(T.JsonName("kubernetes"))
      .annotations({ identifier: "KubernetesDataSourceFreeTrial" }),
    MalwareProtection: S.optional(MalwareProtectionDataSourceFreeTrial)
      .pipe(T.JsonName("malwareProtection"))
      .annotations({ identifier: "MalwareProtectionDataSourceFreeTrial" }),
  }),
).annotations({
  identifier: "DataSourcesFreeTrial",
}) as any as S.Schema<DataSourcesFreeTrial>;
export interface Total {
  Amount?: string;
  Unit?: string;
}
export const Total = S.suspend(() =>
  S.Struct({
    Amount: S.optional(S.String).pipe(T.JsonName("amount")),
    Unit: S.optional(S.String).pipe(T.JsonName("unit")),
  }),
).annotations({ identifier: "Total" }) as any as S.Schema<Total>;
export interface UsageDataSourceResult {
  DataSource?: DataSource;
  Total?: Total;
}
export const UsageDataSourceResult = S.suspend(() =>
  S.Struct({
    DataSource: S.optional(DataSource).pipe(T.JsonName("dataSource")),
    Total: S.optional(Total)
      .pipe(T.JsonName("total"))
      .annotations({ identifier: "Total" }),
  }),
).annotations({
  identifier: "UsageDataSourceResult",
}) as any as S.Schema<UsageDataSourceResult>;
export type UsageDataSourceResultList = UsageDataSourceResult[];
export const UsageDataSourceResultList = S.Array(UsageDataSourceResult);
export interface UsageResourceResult {
  Resource?: string;
  Total?: Total;
}
export const UsageResourceResult = S.suspend(() =>
  S.Struct({
    Resource: S.optional(S.String).pipe(T.JsonName("resource")),
    Total: S.optional(Total)
      .pipe(T.JsonName("total"))
      .annotations({ identifier: "Total" }),
  }),
).annotations({
  identifier: "UsageResourceResult",
}) as any as S.Schema<UsageResourceResult>;
export type UsageResourceResultList = UsageResourceResult[];
export const UsageResourceResultList = S.Array(UsageResourceResult);
export interface UsageFeatureResult {
  Feature?: UsageFeature;
  Total?: Total;
}
export const UsageFeatureResult = S.suspend(() =>
  S.Struct({
    Feature: S.optional(UsageFeature).pipe(T.JsonName("feature")),
    Total: S.optional(Total)
      .pipe(T.JsonName("total"))
      .annotations({ identifier: "Total" }),
  }),
).annotations({
  identifier: "UsageFeatureResult",
}) as any as S.Schema<UsageFeatureResult>;
export type UsageFeatureResultList = UsageFeatureResult[];
export const UsageFeatureResultList = S.Array(UsageFeatureResult);
export interface OrganizationMalwareProtectionConfiguration {
  ScanEc2InstanceWithFindings?: OrganizationScanEc2InstanceWithFindings;
}
export const OrganizationMalwareProtectionConfiguration = S.suspend(() =>
  S.Struct({
    ScanEc2InstanceWithFindings: S.optional(
      OrganizationScanEc2InstanceWithFindings,
    )
      .pipe(T.JsonName("scanEc2InstanceWithFindings"))
      .annotations({ identifier: "OrganizationScanEc2InstanceWithFindings" }),
  }),
).annotations({
  identifier: "OrganizationMalwareProtectionConfiguration",
}) as any as S.Schema<OrganizationMalwareProtectionConfiguration>;
export interface OrganizationEbsVolumesResult {
  AutoEnable?: boolean;
}
export const OrganizationEbsVolumesResult = S.suspend(() =>
  S.Struct({
    AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
  }),
).annotations({
  identifier: "OrganizationEbsVolumesResult",
}) as any as S.Schema<OrganizationEbsVolumesResult>;
export interface EbsVolumesResult {
  Status?: DataSourceStatus;
  Reason?: string;
}
export const EbsVolumesResult = S.suspend(() =>
  S.Struct({
    Status: S.optional(DataSourceStatus).pipe(T.JsonName("status")),
    Reason: S.optional(S.String).pipe(T.JsonName("reason")),
  }),
).annotations({
  identifier: "EbsVolumesResult",
}) as any as S.Schema<EbsVolumesResult>;
export interface Owner {
  Id?: string;
}
export const Owner = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String).pipe(T.JsonName("id")) }),
).annotations({ identifier: "Owner" }) as any as S.Schema<Owner>;
export interface DefaultServerSideEncryption {
  EncryptionType?: string;
  KmsMasterKeyArn?: string;
}
export const DefaultServerSideEncryption = S.suspend(() =>
  S.Struct({
    EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
    KmsMasterKeyArn: S.optional(S.String).pipe(T.JsonName("kmsMasterKeyArn")),
  }),
).annotations({
  identifier: "DefaultServerSideEncryption",
}) as any as S.Schema<DefaultServerSideEncryption>;
export interface S3ObjectDetail {
  ObjectArn?: string;
  Key?: string;
  ETag?: string;
  Hash?: string;
  VersionId?: string;
}
export const S3ObjectDetail = S.suspend(() =>
  S.Struct({
    ObjectArn: S.optional(S.String).pipe(T.JsonName("objectArn")),
    Key: S.optional(S.String).pipe(T.JsonName("key")),
    ETag: S.optional(S.String).pipe(T.JsonName("eTag")),
    Hash: S.optional(S.String).pipe(T.JsonName("hash")),
    VersionId: S.optional(S.String).pipe(T.JsonName("versionId")),
  }),
).annotations({
  identifier: "S3ObjectDetail",
}) as any as S.Schema<S3ObjectDetail>;
export type S3ObjectDetails = S3ObjectDetail[];
export const S3ObjectDetails = S.Array(S3ObjectDetail);
export interface IamInstanceProfile {
  Arn?: string;
  Id?: string;
}
export const IamInstanceProfile = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
  }),
).annotations({
  identifier: "IamInstanceProfile",
}) as any as S.Schema<IamInstanceProfile>;
export interface ProductCode {
  Code?: string;
  ProductType?: string;
}
export const ProductCode = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String).pipe(T.JsonName("productCodeId")),
    ProductType: S.optional(S.String).pipe(T.JsonName("productCodeType")),
  }),
).annotations({ identifier: "ProductCode" }) as any as S.Schema<ProductCode>;
export type ProductCodes = ProductCode[];
export const ProductCodes = S.Array(ProductCode);
export interface HostPath {
  Path?: string;
}
export const HostPath = S.suspend(() =>
  S.Struct({ Path: S.optional(S.String).pipe(T.JsonName("path")) }),
).annotations({ identifier: "HostPath" }) as any as S.Schema<HostPath>;
export interface Volume {
  Name?: string;
  HostPath?: HostPath;
}
export const Volume = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    HostPath: S.optional(HostPath)
      .pipe(T.JsonName("hostPath"))
      .annotations({ identifier: "HostPath" }),
  }),
).annotations({ identifier: "Volume" }) as any as S.Schema<Volume>;
export type Volumes = Volume[];
export const Volumes = S.Array(Volume);
export interface EcsTaskDetails {
  Arn?: string;
  DefinitionArn?: string;
  Version?: string;
  TaskCreatedAt?: Date;
  StartedAt?: Date;
  StartedBy?: string;
  Tags?: Tag[];
  Volumes?: Volume[];
  Containers?: Container[];
  Group?: string;
  LaunchType?: string;
}
export const EcsTaskDetails = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    DefinitionArn: S.optional(S.String).pipe(T.JsonName("definitionArn")),
    Version: S.optional(S.String).pipe(T.JsonName("version")),
    TaskCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("createdAt")),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("startedAt"),
    ),
    StartedBy: S.optional(S.String).pipe(T.JsonName("startedBy")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Volumes: S.optional(Volumes).pipe(T.JsonName("volumes")),
    Containers: S.optional(Containers).pipe(T.JsonName("containers")),
    Group: S.optional(S.String).pipe(T.JsonName("group")),
    LaunchType: S.optional(S.String).pipe(T.JsonName("launchType")),
  }),
).annotations({
  identifier: "EcsTaskDetails",
}) as any as S.Schema<EcsTaskDetails>;
export interface SecurityGroup {
  GroupId?: string;
  GroupName?: string;
}
export const SecurityGroup = S.suspend(() =>
  S.Struct({
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    GroupName: S.optional(S.String).pipe(T.JsonName("groupName")),
  }),
).annotations({
  identifier: "SecurityGroup",
}) as any as S.Schema<SecurityGroup>;
export type SecurityGroups = SecurityGroup[];
export const SecurityGroups = S.Array(SecurityGroup);
export interface VpcConfig {
  SubnetIds?: string[];
  VpcId?: string;
  SecurityGroups?: SecurityGroup[];
}
export const VpcConfig = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(SubnetIds).pipe(T.JsonName("subnetIds")),
    VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
    SecurityGroups: S.optional(SecurityGroups).pipe(
      T.JsonName("securityGroups"),
    ),
  }),
).annotations({ identifier: "VpcConfig" }) as any as S.Schema<VpcConfig>;
export interface DnsRequestAction {
  Domain?: string;
  Protocol?: string;
  Blocked?: boolean;
  DomainWithSuffix?: string;
  VpcOwnerAccountId?: string;
}
export const DnsRequestAction = S.suspend(() =>
  S.Struct({
    Domain: S.optional(S.String).pipe(T.JsonName("domain")),
    Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
    Blocked: S.optional(S.Boolean).pipe(T.JsonName("blocked")),
    DomainWithSuffix: S.optional(S.String).pipe(T.JsonName("domainWithSuffix")),
    VpcOwnerAccountId: S.optional(S.String).pipe(
      T.JsonName("vpcOwnerAccountId"),
    ),
  }),
).annotations({
  identifier: "DnsRequestAction",
}) as any as S.Schema<DnsRequestAction>;
export interface City {
  CityName?: string;
}
export const City = S.suspend(() =>
  S.Struct({ CityName: S.optional(S.String).pipe(T.JsonName("cityName")) }),
).annotations({ identifier: "City" }) as any as S.Schema<City>;
export interface Country {
  CountryCode?: string;
  CountryName?: string;
}
export const Country = S.suspend(() =>
  S.Struct({
    CountryCode: S.optional(S.String).pipe(T.JsonName("countryCode")),
    CountryName: S.optional(S.String).pipe(T.JsonName("countryName")),
  }),
).annotations({ identifier: "Country" }) as any as S.Schema<Country>;
export interface GeoLocation {
  Lat?: number;
  Lon?: number;
}
export const GeoLocation = S.suspend(() =>
  S.Struct({
    Lat: S.optional(S.Number).pipe(T.JsonName("lat")),
    Lon: S.optional(S.Number).pipe(T.JsonName("lon")),
  }),
).annotations({ identifier: "GeoLocation" }) as any as S.Schema<GeoLocation>;
export interface Organization {
  Asn?: string;
  AsnOrg?: string;
  Isp?: string;
  Org?: string;
}
export const Organization = S.suspend(() =>
  S.Struct({
    Asn: S.optional(S.String).pipe(T.JsonName("asn")),
    AsnOrg: S.optional(S.String).pipe(T.JsonName("asnOrg")),
    Isp: S.optional(S.String).pipe(T.JsonName("isp")),
    Org: S.optional(S.String).pipe(T.JsonName("org")),
  }),
).annotations({ identifier: "Organization" }) as any as S.Schema<Organization>;
export interface RemoteIpDetails {
  City?: City;
  Country?: Country;
  GeoLocation?: GeoLocation;
  IpAddressV4?: string | redacted.Redacted<string>;
  IpAddressV6?: string | redacted.Redacted<string>;
  Organization?: Organization;
}
export const RemoteIpDetails = S.suspend(() =>
  S.Struct({
    City: S.optional(City)
      .pipe(T.JsonName("city"))
      .annotations({ identifier: "City" }),
    Country: S.optional(Country)
      .pipe(T.JsonName("country"))
      .annotations({ identifier: "Country" }),
    GeoLocation: S.optional(GeoLocation)
      .pipe(T.JsonName("geoLocation"))
      .annotations({ identifier: "GeoLocation" }),
    IpAddressV4: S.optional(SensitiveString).pipe(T.JsonName("ipAddressV4")),
    IpAddressV6: S.optional(SensitiveString).pipe(T.JsonName("ipAddressV6")),
    Organization: S.optional(Organization)
      .pipe(T.JsonName("organization"))
      .annotations({ identifier: "Organization" }),
  }),
).annotations({
  identifier: "RemoteIpDetails",
}) as any as S.Schema<RemoteIpDetails>;
export interface KubernetesApiCallAction {
  RequestUri?: string;
  Verb?: string;
  SourceIps?: string[];
  UserAgent?: string;
  RemoteIpDetails?: RemoteIpDetails;
  StatusCode?: number;
  Parameters?: string;
  Resource?: string;
  Subresource?: string;
  Namespace?: string;
  ResourceName?: string;
}
export const KubernetesApiCallAction = S.suspend(() =>
  S.Struct({
    RequestUri: S.optional(S.String).pipe(T.JsonName("requestUri")),
    Verb: S.optional(S.String).pipe(T.JsonName("verb")),
    SourceIps: S.optional(SourceIps).pipe(T.JsonName("sourceIPs")),
    UserAgent: S.optional(S.String).pipe(T.JsonName("userAgent")),
    RemoteIpDetails: S.optional(RemoteIpDetails)
      .pipe(T.JsonName("remoteIpDetails"))
      .annotations({ identifier: "RemoteIpDetails" }),
    StatusCode: S.optional(S.Number).pipe(T.JsonName("statusCode")),
    Parameters: S.optional(S.String).pipe(T.JsonName("parameters")),
    Resource: S.optional(S.String).pipe(T.JsonName("resource")),
    Subresource: S.optional(S.String).pipe(T.JsonName("subresource")),
    Namespace: S.optional(S.String).pipe(T.JsonName("namespace")),
    ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
  }),
).annotations({
  identifier: "KubernetesApiCallAction",
}) as any as S.Schema<KubernetesApiCallAction>;
export interface KubernetesPermissionCheckedDetails {
  Verb?: string;
  Resource?: string;
  Namespace?: string;
  Allowed?: boolean;
}
export const KubernetesPermissionCheckedDetails = S.suspend(() =>
  S.Struct({
    Verb: S.optional(S.String).pipe(T.JsonName("verb")),
    Resource: S.optional(S.String).pipe(T.JsonName("resource")),
    Namespace: S.optional(S.String).pipe(T.JsonName("namespace")),
    Allowed: S.optional(S.Boolean).pipe(T.JsonName("allowed")),
  }),
).annotations({
  identifier: "KubernetesPermissionCheckedDetails",
}) as any as S.Schema<KubernetesPermissionCheckedDetails>;
export interface KubernetesRoleBindingDetails {
  Kind?: string;
  Name?: string;
  Uid?: string;
  RoleRefName?: string;
  RoleRefKind?: string;
}
export const KubernetesRoleBindingDetails = S.suspend(() =>
  S.Struct({
    Kind: S.optional(S.String).pipe(T.JsonName("kind")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
    RoleRefName: S.optional(S.String).pipe(T.JsonName("roleRefName")),
    RoleRefKind: S.optional(S.String).pipe(T.JsonName("roleRefKind")),
  }),
).annotations({
  identifier: "KubernetesRoleBindingDetails",
}) as any as S.Schema<KubernetesRoleBindingDetails>;
export interface KubernetesRoleDetails {
  Kind?: string;
  Name?: string;
  Uid?: string;
}
export const KubernetesRoleDetails = S.suspend(() =>
  S.Struct({
    Kind: S.optional(S.String).pipe(T.JsonName("kind")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
  }),
).annotations({
  identifier: "KubernetesRoleDetails",
}) as any as S.Schema<KubernetesRoleDetails>;
export interface ThreatIntelligenceDetail {
  ThreatListName?: string;
  ThreatNames?: string[];
  ThreatFileSha256?: string;
}
export const ThreatIntelligenceDetail = S.suspend(() =>
  S.Struct({
    ThreatListName: S.optional(S.String).pipe(T.JsonName("threatListName")),
    ThreatNames: S.optional(ThreatNames).pipe(T.JsonName("threatNames")),
    ThreatFileSha256: S.optional(S.String).pipe(T.JsonName("threatFileSha256")),
  }),
).annotations({
  identifier: "ThreatIntelligenceDetail",
}) as any as S.Schema<ThreatIntelligenceDetail>;
export type ThreatIntelligenceDetails = ThreatIntelligenceDetail[];
export const ThreatIntelligenceDetails = S.Array(ThreatIntelligenceDetail);
export interface LineageObject {
  StartTime?: Date;
  NamespacePid?: number;
  UserId?: number;
  Name?: string;
  Pid?: number;
  Uuid?: string;
  ExecutablePath?: string;
  Euid?: number;
  ParentUuid?: string;
}
export const LineageObject = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("startTime"),
    ),
    NamespacePid: S.optional(S.Number).pipe(T.JsonName("namespacePid")),
    UserId: S.optional(S.Number).pipe(T.JsonName("userId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
    Uuid: S.optional(S.String).pipe(T.JsonName("uuid")),
    ExecutablePath: S.optional(S.String).pipe(T.JsonName("executablePath")),
    Euid: S.optional(S.Number).pipe(T.JsonName("euid")),
    ParentUuid: S.optional(S.String).pipe(T.JsonName("parentUuid")),
  }),
).annotations({
  identifier: "LineageObject",
}) as any as S.Schema<LineageObject>;
export type Lineage = LineageObject[];
export const Lineage = S.Array(LineageObject);
export interface ProcessDetails {
  Name?: string;
  ExecutablePath?: string;
  ExecutableSha256?: string;
  NamespacePid?: number;
  Pwd?: string;
  Pid?: number;
  StartTime?: Date;
  Uuid?: string;
  ParentUuid?: string;
  User?: string;
  UserId?: number;
  Euid?: number;
  Lineage?: LineageObject[];
}
export const ProcessDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    ExecutablePath: S.optional(S.String).pipe(T.JsonName("executablePath")),
    ExecutableSha256: S.optional(S.String).pipe(T.JsonName("executableSha256")),
    NamespacePid: S.optional(S.Number).pipe(T.JsonName("namespacePid")),
    Pwd: S.optional(S.String).pipe(T.JsonName("pwd")),
    Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("startTime"),
    ),
    Uuid: S.optional(S.String).pipe(T.JsonName("uuid")),
    ParentUuid: S.optional(S.String).pipe(T.JsonName("parentUuid")),
    User: S.optional(S.String).pipe(T.JsonName("user")),
    UserId: S.optional(S.Number).pipe(T.JsonName("userId")),
    Euid: S.optional(S.Number).pipe(T.JsonName("euid")),
    Lineage: S.optional(Lineage).pipe(T.JsonName("lineage")),
  }),
).annotations({
  identifier: "ProcessDetails",
}) as any as S.Schema<ProcessDetails>;
export interface RuntimeContext {
  ModifyingProcess?: ProcessDetails;
  ModifiedAt?: Date;
  ScriptPath?: string;
  LibraryPath?: string;
  LdPreloadValue?: string;
  SocketPath?: string;
  RuncBinaryPath?: string;
  ReleaseAgentPath?: string;
  MountSource?: string;
  MountTarget?: string;
  FileSystemType?: string;
  Flags?: string[];
  ModuleName?: string;
  ModuleFilePath?: string;
  ModuleSha256?: string;
  ShellHistoryFilePath?: string;
  TargetProcess?: ProcessDetails;
  AddressFamily?: string;
  IanaProtocolNumber?: number;
  MemoryRegions?: string[];
  ToolName?: string;
  ToolCategory?: string;
  ServiceName?: string;
  CommandLineExample?: string;
  ThreatFilePath?: string;
}
export const RuntimeContext = S.suspend(() =>
  S.Struct({
    ModifyingProcess: S.optional(ProcessDetails)
      .pipe(T.JsonName("modifyingProcess"))
      .annotations({ identifier: "ProcessDetails" }),
    ModifiedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("modifiedAt")),
    ScriptPath: S.optional(S.String).pipe(T.JsonName("scriptPath")),
    LibraryPath: S.optional(S.String).pipe(T.JsonName("libraryPath")),
    LdPreloadValue: S.optional(S.String).pipe(T.JsonName("ldPreloadValue")),
    SocketPath: S.optional(S.String).pipe(T.JsonName("socketPath")),
    RuncBinaryPath: S.optional(S.String).pipe(T.JsonName("runcBinaryPath")),
    ReleaseAgentPath: S.optional(S.String).pipe(T.JsonName("releaseAgentPath")),
    MountSource: S.optional(S.String).pipe(T.JsonName("mountSource")),
    MountTarget: S.optional(S.String).pipe(T.JsonName("mountTarget")),
    FileSystemType: S.optional(S.String).pipe(T.JsonName("fileSystemType")),
    Flags: S.optional(FlagsList).pipe(T.JsonName("flags")),
    ModuleName: S.optional(S.String).pipe(T.JsonName("moduleName")),
    ModuleFilePath: S.optional(S.String).pipe(T.JsonName("moduleFilePath")),
    ModuleSha256: S.optional(S.String).pipe(T.JsonName("moduleSha256")),
    ShellHistoryFilePath: S.optional(S.String).pipe(
      T.JsonName("shellHistoryFilePath"),
    ),
    TargetProcess: S.optional(ProcessDetails)
      .pipe(T.JsonName("targetProcess"))
      .annotations({ identifier: "ProcessDetails" }),
    AddressFamily: S.optional(S.String).pipe(T.JsonName("addressFamily")),
    IanaProtocolNumber: S.optional(S.Number).pipe(
      T.JsonName("ianaProtocolNumber"),
    ),
    MemoryRegions: S.optional(MemoryRegionsList).pipe(
      T.JsonName("memoryRegions"),
    ),
    ToolName: S.optional(S.String).pipe(T.JsonName("toolName")),
    ToolCategory: S.optional(S.String).pipe(T.JsonName("toolCategory")),
    ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
    CommandLineExample: S.optional(S.String).pipe(
      T.JsonName("commandLineExample"),
    ),
    ThreatFilePath: S.optional(S.String).pipe(T.JsonName("threatFilePath")),
  }),
).annotations({
  identifier: "RuntimeContext",
}) as any as S.Schema<RuntimeContext>;
export interface MalwareProtectionFindingsScanConfiguration {
  TriggerType?: TriggerType;
  IncrementalScanDetails?: IncrementalScanDetails;
}
export const MalwareProtectionFindingsScanConfiguration = S.suspend(() =>
  S.Struct({
    TriggerType: S.optional(TriggerType).pipe(T.JsonName("triggerType")),
    IncrementalScanDetails: S.optional(IncrementalScanDetails)
      .pipe(T.JsonName("incrementalScanDetails"))
      .annotations({ identifier: "IncrementalScanDetails" }),
  }),
).annotations({
  identifier: "MalwareProtectionFindingsScanConfiguration",
}) as any as S.Schema<MalwareProtectionFindingsScanConfiguration>;
export interface AdditionalInfo {
  VersionId?: string;
  DeviceName?: string;
}
export const AdditionalInfo = S.suspend(() =>
  S.Struct({
    VersionId: S.optional(S.String).pipe(T.JsonName("versionId")),
    DeviceName: S.optional(S.String).pipe(T.JsonName("deviceName")),
  }),
).annotations({
  identifier: "AdditionalInfo",
}) as any as S.Schema<AdditionalInfo>;
export type ManagementType = "AUTO_MANAGED" | "MANUAL" | "DISABLED";
export const ManagementType = S.Literal("AUTO_MANAGED", "MANUAL", "DISABLED");
export type FindingResourceType =
  | "EC2_INSTANCE"
  | "EC2_NETWORK_INTERFACE"
  | "S3_BUCKET"
  | "S3_OBJECT"
  | "ACCESS_KEY"
  | "EKS_CLUSTER"
  | "KUBERNETES_WORKLOAD"
  | "CONTAINER"
  | "ECS_CLUSTER"
  | "ECS_TASK"
  | "AUTOSCALING_AUTO_SCALING_GROUP"
  | "IAM_INSTANCE_PROFILE"
  | "CLOUDFORMATION_STACK"
  | "EC2_LAUNCH_TEMPLATE"
  | "EC2_VPC"
  | "EC2_IMAGE";
export const FindingResourceType = S.Literal(
  "EC2_INSTANCE",
  "EC2_NETWORK_INTERFACE",
  "S3_BUCKET",
  "S3_OBJECT",
  "ACCESS_KEY",
  "EKS_CLUSTER",
  "KUBERNETES_WORKLOAD",
  "CONTAINER",
  "ECS_CLUSTER",
  "ECS_TASK",
  "AUTOSCALING_AUTO_SCALING_GROUP",
  "IAM_INSTANCE_PROFILE",
  "CLOUDFORMATION_STACK",
  "EC2_LAUNCH_TEMPLATE",
  "EC2_VPC",
  "EC2_IMAGE",
);
export type SignalType =
  | "FINDING"
  | "CLOUD_TRAIL"
  | "S3_DATA_EVENTS"
  | "EKS_AUDIT_LOGS"
  | "FLOW_LOGS"
  | "DNS_LOGS"
  | "RUNTIME_MONITORING";
export const SignalType = S.Literal(
  "FINDING",
  "CLOUD_TRAIL",
  "S3_DATA_EVENTS",
  "EKS_AUDIT_LOGS",
  "FLOW_LOGS",
  "DNS_LOGS",
  "RUNTIME_MONITORING",
);
export type ResourceUids = string[];
export const ResourceUids = S.Array(S.String);
export type ActorIds = string[];
export const ActorIds = S.Array(S.String);
export type EndpointIds = string[];
export const EndpointIds = S.Array(S.String);
export type IndicatorType =
  | "SUSPICIOUS_USER_AGENT"
  | "SUSPICIOUS_NETWORK"
  | "MALICIOUS_IP"
  | "TOR_IP"
  | "ATTACK_TACTIC"
  | "HIGH_RISK_API"
  | "ATTACK_TECHNIQUE"
  | "UNUSUAL_API_FOR_ACCOUNT"
  | "UNUSUAL_ASN_FOR_ACCOUNT"
  | "UNUSUAL_ASN_FOR_USER"
  | "SUSPICIOUS_PROCESS"
  | "MALICIOUS_DOMAIN"
  | "MALICIOUS_PROCESS"
  | "CRYPTOMINING_IP"
  | "CRYPTOMINING_DOMAIN"
  | "CRYPTOMINING_PROCESS";
export const IndicatorType = S.Literal(
  "SUSPICIOUS_USER_AGENT",
  "SUSPICIOUS_NETWORK",
  "MALICIOUS_IP",
  "TOR_IP",
  "ATTACK_TACTIC",
  "HIGH_RISK_API",
  "ATTACK_TECHNIQUE",
  "UNUSUAL_API_FOR_ACCOUNT",
  "UNUSUAL_ASN_FOR_ACCOUNT",
  "UNUSUAL_ASN_FOR_USER",
  "SUSPICIOUS_PROCESS",
  "MALICIOUS_DOMAIN",
  "MALICIOUS_PROCESS",
  "CRYPTOMINING_IP",
  "CRYPTOMINING_DOMAIN",
  "CRYPTOMINING_PROCESS",
);
export type IndicatorValues = string[];
export const IndicatorValues = S.Array(S.String);
export interface ScannedResource {
  ScannedResourceArn?: string;
  ScannedResourceType?: MalwareProtectionResourceType;
  ScannedResourceStatus?: MalwareProtectionScanStatus;
  ScanStatusReason?: ScanStatusReason;
  ResourceDetails?: ScannedResourceDetails;
}
export const ScannedResource = S.suspend(() =>
  S.Struct({
    ScannedResourceArn: S.optional(S.String).pipe(
      T.JsonName("scannedResourceArn"),
    ),
    ScannedResourceType: S.optional(MalwareProtectionResourceType).pipe(
      T.JsonName("scannedResourceType"),
    ),
    ScannedResourceStatus: S.optional(MalwareProtectionScanStatus).pipe(
      T.JsonName("scannedResourceStatus"),
    ),
    ScanStatusReason: S.optional(ScanStatusReason).pipe(
      T.JsonName("scanStatusReason"),
    ),
    ResourceDetails: S.optional(ScannedResourceDetails)
      .pipe(T.JsonName("resourceDetails"))
      .annotations({ identifier: "ScannedResourceDetails" }),
  }),
).annotations({
  identifier: "ScannedResource",
}) as any as S.Schema<ScannedResource>;
export type ScannedResources = ScannedResource[];
export const ScannedResources = S.Array(ScannedResource);
export interface ScanEc2InstanceWithFindingsResult {
  EbsVolumes?: EbsVolumesResult;
}
export const ScanEc2InstanceWithFindingsResult = S.suspend(() =>
  S.Struct({
    EbsVolumes: S.optional(EbsVolumesResult)
      .pipe(T.JsonName("ebsVolumes"))
      .annotations({ identifier: "EbsVolumesResult" }),
  }),
).annotations({
  identifier: "ScanEc2InstanceWithFindingsResult",
}) as any as S.Schema<ScanEc2InstanceWithFindingsResult>;
export interface MalwareProtectionConfigurationResult {
  ScanEc2InstanceWithFindings?: ScanEc2InstanceWithFindingsResult;
  ServiceRole?: string;
}
export const MalwareProtectionConfigurationResult = S.suspend(() =>
  S.Struct({
    ScanEc2InstanceWithFindings: S.optional(ScanEc2InstanceWithFindingsResult)
      .pipe(T.JsonName("scanEc2InstanceWithFindings"))
      .annotations({ identifier: "ScanEc2InstanceWithFindingsResult" }),
    ServiceRole: S.optional(S.String).pipe(T.JsonName("serviceRole")),
  }),
).annotations({
  identifier: "MalwareProtectionConfigurationResult",
}) as any as S.Schema<MalwareProtectionConfigurationResult>;
export interface DataSourceConfigurationsResult {
  CloudTrail?: CloudTrailConfigurationResult;
  DNSLogs?: DNSLogsConfigurationResult;
  FlowLogs?: FlowLogsConfigurationResult;
  S3Logs?: S3LogsConfigurationResult;
  Kubernetes?: KubernetesConfigurationResult;
  MalwareProtection?: MalwareProtectionConfigurationResult;
}
export const DataSourceConfigurationsResult = S.suspend(() =>
  S.Struct({
    CloudTrail: S.optional(CloudTrailConfigurationResult)
      .pipe(T.JsonName("cloudTrail"))
      .annotations({ identifier: "CloudTrailConfigurationResult" }),
    DNSLogs: S.optional(DNSLogsConfigurationResult)
      .pipe(T.JsonName("dnsLogs"))
      .annotations({ identifier: "DNSLogsConfigurationResult" }),
    FlowLogs: S.optional(FlowLogsConfigurationResult)
      .pipe(T.JsonName("flowLogs"))
      .annotations({ identifier: "FlowLogsConfigurationResult" }),
    S3Logs: S.optional(S3LogsConfigurationResult)
      .pipe(T.JsonName("s3Logs"))
      .annotations({ identifier: "S3LogsConfigurationResult" }),
    Kubernetes: S.optional(KubernetesConfigurationResult)
      .pipe(T.JsonName("kubernetes"))
      .annotations({ identifier: "KubernetesConfigurationResult" }),
    MalwareProtection: S.optional(MalwareProtectionConfigurationResult)
      .pipe(T.JsonName("malwareProtection"))
      .annotations({ identifier: "MalwareProtectionConfigurationResult" }),
  }),
).annotations({
  identifier: "DataSourceConfigurationsResult",
}) as any as S.Schema<DataSourceConfigurationsResult>;
export interface MemberDataSourceConfiguration {
  AccountId?: string;
  DataSources?: DataSourceConfigurationsResult;
  Features?: MemberFeaturesConfigurationResult[];
}
export const MemberDataSourceConfiguration = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    DataSources: S.optional(DataSourceConfigurationsResult)
      .pipe(T.JsonName("dataSources"))
      .annotations({ identifier: "DataSourceConfigurationsResult" }),
    Features: S.optional(MemberFeaturesConfigurationsResults).pipe(
      T.JsonName("features"),
    ),
  }),
).annotations({
  identifier: "MemberDataSourceConfiguration",
}) as any as S.Schema<MemberDataSourceConfiguration>;
export type MemberDataSourceConfigurations = MemberDataSourceConfiguration[];
export const MemberDataSourceConfigurations = S.Array(
  MemberDataSourceConfiguration,
);
export interface OrganizationDetails {
  UpdatedAt?: Date;
  OrganizationStatistics?: OrganizationStatistics;
}
export const OrganizationDetails = S.suspend(() =>
  S.Struct({
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("updatedAt"),
    ),
    OrganizationStatistics: S.optional(OrganizationStatistics)
      .pipe(T.JsonName("organizationStatistics"))
      .annotations({ identifier: "OrganizationStatistics" }),
  }),
).annotations({
  identifier: "OrganizationDetails",
}) as any as S.Schema<OrganizationDetails>;
export interface AccountFreeTrialInfo {
  AccountId?: string;
  DataSources?: DataSourcesFreeTrial;
  Features?: FreeTrialFeatureConfigurationResult[];
}
export const AccountFreeTrialInfo = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    DataSources: S.optional(DataSourcesFreeTrial)
      .pipe(T.JsonName("dataSources"))
      .annotations({ identifier: "DataSourcesFreeTrial" }),
    Features: S.optional(FreeTrialFeatureConfigurationsResults).pipe(
      T.JsonName("features"),
    ),
  }),
).annotations({
  identifier: "AccountFreeTrialInfo",
}) as any as S.Schema<AccountFreeTrialInfo>;
export type AccountFreeTrialInfos = AccountFreeTrialInfo[];
export const AccountFreeTrialInfos = S.Array(AccountFreeTrialInfo);
export interface MalwareScan {
  ResourceArn?: string;
  ResourceType?: MalwareProtectionResourceType;
  ScanId?: string;
  ScanStatus?: MalwareProtectionScanStatus;
  ScanResultStatus?: ScanResultStatus;
  ScanType?: MalwareProtectionScanType;
  ScanStartedAt?: Date;
  ScanCompletedAt?: Date;
}
export const MalwareScan = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
    ResourceType: S.optional(MalwareProtectionResourceType).pipe(
      T.JsonName("resourceType"),
    ),
    ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
    ScanStatus: S.optional(MalwareProtectionScanStatus).pipe(
      T.JsonName("scanStatus"),
    ),
    ScanResultStatus: S.optional(ScanResultStatus).pipe(
      T.JsonName("scanResultStatus"),
    ),
    ScanType: S.optional(MalwareProtectionScanType).pipe(
      T.JsonName("scanType"),
    ),
    ScanStartedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("scanStartedAt")),
    ScanCompletedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("scanCompletedAt")),
  }),
).annotations({ identifier: "MalwareScan" }) as any as S.Schema<MalwareScan>;
export type MalwareScans = MalwareScan[];
export const MalwareScans = S.Array(MalwareScan);
export interface OrganizationDataSourceConfigurations {
  S3Logs?: OrganizationS3LogsConfiguration;
  Kubernetes?: OrganizationKubernetesConfiguration;
  MalwareProtection?: OrganizationMalwareProtectionConfiguration;
}
export const OrganizationDataSourceConfigurations = S.suspend(() =>
  S.Struct({
    S3Logs: S.optional(OrganizationS3LogsConfiguration)
      .pipe(T.JsonName("s3Logs"))
      .annotations({ identifier: "OrganizationS3LogsConfiguration" }),
    Kubernetes: S.optional(OrganizationKubernetesConfiguration)
      .pipe(T.JsonName("kubernetes"))
      .annotations({ identifier: "OrganizationKubernetesConfiguration" }),
    MalwareProtection: S.optional(OrganizationMalwareProtectionConfiguration)
      .pipe(T.JsonName("malwareProtection"))
      .annotations({
        identifier: "OrganizationMalwareProtectionConfiguration",
      }),
  }),
).annotations({
  identifier: "OrganizationDataSourceConfigurations",
}) as any as S.Schema<OrganizationDataSourceConfigurations>;
export interface OrganizationScanEc2InstanceWithFindingsResult {
  EbsVolumes?: OrganizationEbsVolumesResult;
}
export const OrganizationScanEc2InstanceWithFindingsResult = S.suspend(() =>
  S.Struct({
    EbsVolumes: S.optional(OrganizationEbsVolumesResult)
      .pipe(T.JsonName("ebsVolumes"))
      .annotations({ identifier: "OrganizationEbsVolumesResult" }),
  }),
).annotations({
  identifier: "OrganizationScanEc2InstanceWithFindingsResult",
}) as any as S.Schema<OrganizationScanEc2InstanceWithFindingsResult>;
export interface EcsClusterDetails {
  Name?: string;
  Arn?: string;
  Status?: string;
  ActiveServicesCount?: number;
  RegisteredContainerInstancesCount?: number;
  RunningTasksCount?: number;
  Tags?: Tag[];
  TaskDetails?: EcsTaskDetails;
}
export const EcsClusterDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    ActiveServicesCount: S.optional(S.Number).pipe(
      T.JsonName("activeServicesCount"),
    ),
    RegisteredContainerInstancesCount: S.optional(S.Number).pipe(
      T.JsonName("registeredContainerInstancesCount"),
    ),
    RunningTasksCount: S.optional(S.Number).pipe(
      T.JsonName("runningTasksCount"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    TaskDetails: S.optional(EcsTaskDetails)
      .pipe(T.JsonName("taskDetails"))
      .annotations({ identifier: "EcsTaskDetails" }),
  }),
).annotations({
  identifier: "EcsClusterDetails",
}) as any as S.Schema<EcsClusterDetails>;
export interface LambdaDetails {
  FunctionArn?: string;
  FunctionName?: string;
  Description?: string;
  LastModifiedAt?: Date;
  RevisionId?: string;
  FunctionVersion?: string;
  Role?: string;
  VpcConfig?: VpcConfig;
  Tags?: Tag[];
}
export const LambdaDetails = S.suspend(() =>
  S.Struct({
    FunctionArn: S.optional(S.String).pipe(T.JsonName("functionArn")),
    FunctionName: S.optional(S.String).pipe(T.JsonName("functionName")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    LastModifiedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastModifiedAt")),
    RevisionId: S.optional(S.String).pipe(T.JsonName("revisionId")),
    FunctionVersion: S.optional(S.String).pipe(T.JsonName("functionVersion")),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    VpcConfig: S.optional(VpcConfig)
      .pipe(T.JsonName("vpcConfig"))
      .annotations({ identifier: "VpcConfig" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "LambdaDetails",
}) as any as S.Schema<LambdaDetails>;
export interface Evidence {
  ThreatIntelligenceDetails?: ThreatIntelligenceDetail[];
}
export const Evidence = S.suspend(() =>
  S.Struct({
    ThreatIntelligenceDetails: S.optional(ThreatIntelligenceDetails).pipe(
      T.JsonName("threatIntelligenceDetails"),
    ),
  }),
).annotations({ identifier: "Evidence" }) as any as S.Schema<Evidence>;
export interface ItemDetails {
  ResourceArn?: string;
  ItemPath?: string;
  Hash?: string;
  AdditionalInfo?: AdditionalInfo;
}
export const ItemDetails = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
    ItemPath: S.optional(S.String).pipe(T.JsonName("itemPath")),
    Hash: S.optional(S.String).pipe(T.JsonName("hash")),
    AdditionalInfo: S.optional(AdditionalInfo)
      .pipe(T.JsonName("additionalInfo"))
      .annotations({ identifier: "AdditionalInfo" }),
  }),
).annotations({ identifier: "ItemDetails" }) as any as S.Schema<ItemDetails>;
export type ItemDetailsList = ItemDetails[];
export const ItemDetailsList = S.Array(ItemDetails);
export interface UsageTopAccountResult {
  AccountId?: string;
  Total?: Total;
}
export const UsageTopAccountResult = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    Total: S.optional(Total)
      .pipe(T.JsonName("total"))
      .annotations({ identifier: "Total" }),
  }),
).annotations({
  identifier: "UsageTopAccountResult",
}) as any as S.Schema<UsageTopAccountResult>;
export type UsageTopAccountsByFeatureList = UsageTopAccountResult[];
export const UsageTopAccountsByFeatureList = S.Array(UsageTopAccountResult);
export interface CreateFilterResponse {
  Name: string;
}
export const CreateFilterResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String).pipe(T.JsonName("name")) }),
).annotations({
  identifier: "CreateFilterResponse",
}) as any as S.Schema<CreateFilterResponse>;
export interface PrivateIpAddressDetails {
  PrivateDnsName?: string;
  PrivateIpAddress?: string | redacted.Redacted<string>;
}
export const PrivateIpAddressDetails = S.suspend(() =>
  S.Struct({
    PrivateDnsName: S.optional(S.String).pipe(T.JsonName("privateDnsName")),
    PrivateIpAddress: S.optional(SensitiveString).pipe(
      T.JsonName("privateIpAddress"),
    ),
  }),
).annotations({
  identifier: "PrivateIpAddressDetails",
}) as any as S.Schema<PrivateIpAddressDetails>;
export type PrivateIpAddresses = PrivateIpAddressDetails[];
export const PrivateIpAddresses = S.Array(PrivateIpAddressDetails);
export interface ImpersonatedUser {
  Username?: string;
  Groups?: string[];
}
export const ImpersonatedUser = S.suspend(() =>
  S.Struct({
    Username: S.optional(S.String).pipe(T.JsonName("username")),
    Groups: S.optional(Groups).pipe(T.JsonName("groups")),
  }),
).annotations({
  identifier: "ImpersonatedUser",
}) as any as S.Schema<ImpersonatedUser>;
export interface DomainDetails {
  Domain?: string;
}
export const DomainDetails = S.suspend(() =>
  S.Struct({ Domain: S.optional(S.String).pipe(T.JsonName("domain")) }),
).annotations({
  identifier: "DomainDetails",
}) as any as S.Schema<DomainDetails>;
export interface RemoteAccountDetails {
  AccountId?: string;
  Affiliated?: boolean;
}
export const RemoteAccountDetails = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    Affiliated: S.optional(S.Boolean).pipe(T.JsonName("affiliated")),
  }),
).annotations({
  identifier: "RemoteAccountDetails",
}) as any as S.Schema<RemoteAccountDetails>;
export type AffectedResources = { [key: string]: string };
export const AffectedResources = S.Record({ key: S.String, value: S.String });
export interface LocalPortDetails {
  Port?: number;
  PortName?: string;
}
export const LocalPortDetails = S.suspend(() =>
  S.Struct({
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    PortName: S.optional(S.String).pipe(T.JsonName("portName")),
  }),
).annotations({
  identifier: "LocalPortDetails",
}) as any as S.Schema<LocalPortDetails>;
export interface LocalIpDetails {
  IpAddressV4?: string | redacted.Redacted<string>;
  IpAddressV6?: string | redacted.Redacted<string>;
}
export const LocalIpDetails = S.suspend(() =>
  S.Struct({
    IpAddressV4: S.optional(SensitiveString).pipe(T.JsonName("ipAddressV4")),
    IpAddressV6: S.optional(SensitiveString).pipe(T.JsonName("ipAddressV6")),
  }),
).annotations({
  identifier: "LocalIpDetails",
}) as any as S.Schema<LocalIpDetails>;
export interface RemotePortDetails {
  Port?: number;
  PortName?: string;
}
export const RemotePortDetails = S.suspend(() =>
  S.Struct({
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    PortName: S.optional(S.String).pipe(T.JsonName("portName")),
  }),
).annotations({
  identifier: "RemotePortDetails",
}) as any as S.Schema<RemotePortDetails>;
export interface PortProbeDetail {
  LocalPortDetails?: LocalPortDetails;
  LocalIpDetails?: LocalIpDetails;
  RemoteIpDetails?: RemoteIpDetails;
}
export const PortProbeDetail = S.suspend(() =>
  S.Struct({
    LocalPortDetails: S.optional(LocalPortDetails)
      .pipe(T.JsonName("localPortDetails"))
      .annotations({ identifier: "LocalPortDetails" }),
    LocalIpDetails: S.optional(LocalIpDetails)
      .pipe(T.JsonName("localIpDetails"))
      .annotations({ identifier: "LocalIpDetails" }),
    RemoteIpDetails: S.optional(RemoteIpDetails)
      .pipe(T.JsonName("remoteIpDetails"))
      .annotations({ identifier: "RemoteIpDetails" }),
  }),
).annotations({
  identifier: "PortProbeDetail",
}) as any as S.Schema<PortProbeDetail>;
export type PortProbeDetails = PortProbeDetail[];
export const PortProbeDetails = S.Array(PortProbeDetail);
export interface LoginAttribute {
  User?: string;
  Application?: string;
  FailedLoginAttempts?: number;
  SuccessfulLoginAttempts?: number;
}
export const LoginAttribute = S.suspend(() =>
  S.Struct({
    User: S.optional(S.String).pipe(T.JsonName("user")),
    Application: S.optional(S.String).pipe(T.JsonName("application")),
    FailedLoginAttempts: S.optional(S.Number).pipe(
      T.JsonName("failedLoginAttempts"),
    ),
    SuccessfulLoginAttempts: S.optional(S.Number).pipe(
      T.JsonName("successfulLoginAttempts"),
    ),
  }),
).annotations({
  identifier: "LoginAttribute",
}) as any as S.Schema<LoginAttribute>;
export type LoginAttributes = LoginAttribute[];
export const LoginAttributes = S.Array(LoginAttribute);
export interface ScannedItemCount {
  TotalGb?: number;
  Files?: number;
  Volumes?: number;
}
export const ScannedItemCount = S.suspend(() =>
  S.Struct({
    TotalGb: S.optional(S.Number).pipe(T.JsonName("totalGb")),
    Files: S.optional(S.Number).pipe(T.JsonName("files")),
    Volumes: S.optional(S.Number).pipe(T.JsonName("volumes")),
  }),
).annotations({
  identifier: "ScannedItemCount",
}) as any as S.Schema<ScannedItemCount>;
export interface ThreatsDetectedItemCount {
  Files?: number;
}
export const ThreatsDetectedItemCount = S.suspend(() =>
  S.Struct({ Files: S.optional(S.Number).pipe(T.JsonName("files")) }),
).annotations({
  identifier: "ThreatsDetectedItemCount",
}) as any as S.Schema<ThreatsDetectedItemCount>;
export interface HighestSeverityThreatDetails {
  Severity?: string;
  ThreatName?: string;
  Count?: number;
}
export const HighestSeverityThreatDetails = S.suspend(() =>
  S.Struct({
    Severity: S.optional(S.String).pipe(T.JsonName("severity")),
    ThreatName: S.optional(S.String).pipe(T.JsonName("threatName")),
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
  }),
).annotations({
  identifier: "HighestSeverityThreatDetails",
}) as any as S.Schema<HighestSeverityThreatDetails>;
export interface Indicator {
  Key?: IndicatorType;
  Values?: string[];
  Title?: string;
}
export const Indicator = S.suspend(() =>
  S.Struct({
    Key: S.optional(IndicatorType).pipe(T.JsonName("key")),
    Values: S.optional(IndicatorValues).pipe(T.JsonName("values")),
    Title: S.optional(S.String).pipe(T.JsonName("title")),
  }),
).annotations({ identifier: "Indicator" }) as any as S.Schema<Indicator>;
export type Indicators = Indicator[];
export const Indicators = S.Array(Indicator);
export interface Signal {
  Uid?: string;
  Type?: SignalType;
  Description?: string;
  Name?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  FirstSeenAt?: Date;
  LastSeenAt?: Date;
  Severity?: number;
  Count?: number;
  ResourceUids?: string[];
  ActorIds?: string[];
  EndpointIds?: string[];
  SignalIndicators?: Indicator[];
}
export const Signal = S.suspend(() =>
  S.Struct({
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
    Type: S.optional(SignalType).pipe(T.JsonName("type")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("updatedAt"),
    ),
    FirstSeenAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("firstSeenAt")),
    LastSeenAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastSeenAt")),
    Severity: S.optional(S.Number).pipe(T.JsonName("severity")),
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
    ResourceUids: S.optional(ResourceUids).pipe(T.JsonName("resourceUids")),
    ActorIds: S.optional(ActorIds).pipe(T.JsonName("actorIds")),
    EndpointIds: S.optional(EndpointIds).pipe(T.JsonName("endpointIds")),
    SignalIndicators: S.optional(Indicators).pipe(
      T.JsonName("signalIndicators"),
    ),
  }),
).annotations({ identifier: "Signal" }) as any as S.Schema<Signal>;
export type Signals = Signal[];
export const Signals = S.Array(Signal);
export interface ItemPath {
  NestedItemPath?: string;
  Hash?: string;
}
export const ItemPath = S.suspend(() =>
  S.Struct({
    NestedItemPath: S.optional(S.String).pipe(T.JsonName("nestedItemPath")),
    Hash: S.optional(S.String).pipe(T.JsonName("hash")),
  }),
).annotations({ identifier: "ItemPath" }) as any as S.Schema<ItemPath>;
export type ItemPaths = ItemPath[];
export const ItemPaths = S.Array(ItemPath);
export interface GetMemberDetectorsResponse {
  MemberDataSourceConfigurations: (MemberDataSourceConfiguration & {
    AccountId: AccountId;
    DataSources: DataSourceConfigurationsResult & {
      CloudTrail: CloudTrailConfigurationResult & { Status: DataSourceStatus };
      DNSLogs: DNSLogsConfigurationResult & { Status: DataSourceStatus };
      FlowLogs: FlowLogsConfigurationResult & { Status: DataSourceStatus };
      S3Logs: S3LogsConfigurationResult & { Status: DataSourceStatus };
      Kubernetes: KubernetesConfigurationResult & {
        AuditLogs: KubernetesAuditLogsConfigurationResult & {
          Status: DataSourceStatus;
        };
      };
    };
  })[];
  UnprocessedAccounts: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const GetMemberDetectorsResponse = S.suspend(() =>
  S.Struct({
    MemberDataSourceConfigurations: S.optional(
      MemberDataSourceConfigurations,
    ).pipe(T.JsonName("members")),
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "GetMemberDetectorsResponse",
}) as any as S.Schema<GetMemberDetectorsResponse>;
export interface GetOrganizationStatisticsResponse {
  OrganizationDetails?: OrganizationDetails;
}
export const GetOrganizationStatisticsResponse = S.suspend(() =>
  S.Struct({
    OrganizationDetails: S.optional(OrganizationDetails)
      .pipe(T.JsonName("organizationDetails"))
      .annotations({ identifier: "OrganizationDetails" }),
  }),
).annotations({
  identifier: "GetOrganizationStatisticsResponse",
}) as any as S.Schema<GetOrganizationStatisticsResponse>;
export interface GetRemainingFreeTrialDaysResponse {
  Accounts?: AccountFreeTrialInfo[];
  UnprocessedAccounts?: (UnprocessedAccount & {
    AccountId: AccountId;
    Result: string;
  })[];
}
export const GetRemainingFreeTrialDaysResponse = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(AccountFreeTrialInfos).pipe(T.JsonName("accounts")),
    UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "GetRemainingFreeTrialDaysResponse",
}) as any as S.Schema<GetRemainingFreeTrialDaysResponse>;
export type Issues = string[];
export const Issues = S.Array(S.String);
export interface ListMalwareScansResponse {
  Scans: MalwareScan[];
  NextToken?: string;
}
export const ListMalwareScansResponse = S.suspend(() =>
  S.Struct({
    Scans: S.optional(MalwareScans).pipe(T.JsonName("scans")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListMalwareScansResponse",
}) as any as S.Schema<ListMalwareScansResponse>;
export interface UpdateMalwareScanSettingsRequest {
  DetectorId: string;
  ScanResourceCriteria?: ScanResourceCriteria;
  EbsSnapshotPreservation?: EbsSnapshotPreservation;
}
export const UpdateMalwareScanSettingsRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ScanResourceCriteria: S.optional(ScanResourceCriteria)
      .pipe(T.JsonName("scanResourceCriteria"))
      .annotations({ identifier: "ScanResourceCriteria" }),
    EbsSnapshotPreservation: S.optional(EbsSnapshotPreservation).pipe(
      T.JsonName("ebsSnapshotPreservation"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/detector/{DetectorId}/malware-scan-settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMalwareScanSettingsRequest",
}) as any as S.Schema<UpdateMalwareScanSettingsRequest>;
export interface UpdateMalwareScanSettingsResponse {}
export const UpdateMalwareScanSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateMalwareScanSettingsResponse",
}) as any as S.Schema<UpdateMalwareScanSettingsResponse>;
export interface UpdateOrganizationConfigurationRequest {
  DetectorId: string;
  AutoEnable?: boolean;
  DataSources?: OrganizationDataSourceConfigurations;
  Features?: OrganizationFeatureConfiguration[];
  AutoEnableOrganizationMembers?: AutoEnableMembers;
}
export const UpdateOrganizationConfigurationRequest = S.suspend(() =>
  S.Struct({
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
    DataSources: S.optional(OrganizationDataSourceConfigurations)
      .pipe(T.JsonName("dataSources"))
      .annotations({ identifier: "OrganizationDataSourceConfigurations" }),
    Features: S.optional(OrganizationFeaturesConfigurations).pipe(
      T.JsonName("features"),
    ),
    AutoEnableOrganizationMembers: S.optional(AutoEnableMembers).pipe(
      T.JsonName("autoEnableOrganizationMembers"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/detector/{DetectorId}/admin" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateOrganizationConfigurationRequest",
}) as any as S.Schema<UpdateOrganizationConfigurationRequest>;
export interface UpdateOrganizationConfigurationResponse {}
export const UpdateOrganizationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateOrganizationConfigurationResponse",
}) as any as S.Schema<UpdateOrganizationConfigurationResponse>;
export type ScanStatus = "RUNNING" | "COMPLETED" | "FAILED" | "SKIPPED";
export const ScanStatus = S.Literal(
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "SKIPPED",
);
export interface OrganizationMalwareProtectionConfigurationResult {
  ScanEc2InstanceWithFindings?: OrganizationScanEc2InstanceWithFindingsResult;
}
export const OrganizationMalwareProtectionConfigurationResult = S.suspend(() =>
  S.Struct({
    ScanEc2InstanceWithFindings: S.optional(
      OrganizationScanEc2InstanceWithFindingsResult,
    )
      .pipe(T.JsonName("scanEc2InstanceWithFindings"))
      .annotations({
        identifier: "OrganizationScanEc2InstanceWithFindingsResult",
      }),
  }),
).annotations({
  identifier: "OrganizationMalwareProtectionConfigurationResult",
}) as any as S.Schema<OrganizationMalwareProtectionConfigurationResult>;
export type MfaStatus = "ENABLED" | "DISABLED";
export const MfaStatus = S.Literal("ENABLED", "DISABLED");
export type NetworkDirection = "INBOUND" | "OUTBOUND";
export const NetworkDirection = S.Literal("INBOUND", "OUTBOUND");
export interface ScanResultThreat {
  Name?: string;
  Source?: DetectionSource;
  Count?: number;
  Hash?: string;
  ItemDetails?: ItemDetails[];
}
export const ScanResultThreat = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Source: S.optional(DetectionSource).pipe(T.JsonName("source")),
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
    Hash: S.optional(S.String).pipe(T.JsonName("hash")),
    ItemDetails: S.optional(ItemDetailsList).pipe(T.JsonName("itemDetails")),
  }),
).annotations({
  identifier: "ScanResultThreat",
}) as any as S.Schema<ScanResultThreat>;
export type ScanResultThreats = ScanResultThreat[];
export const ScanResultThreats = S.Array(ScanResultThreat);
export interface UsageAccountResult {
  AccountId?: string;
  Total?: Total;
}
export const UsageAccountResult = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    Total: S.optional(Total)
      .pipe(T.JsonName("total"))
      .annotations({ identifier: "Total" }),
  }),
).annotations({
  identifier: "UsageAccountResult",
}) as any as S.Schema<UsageAccountResult>;
export type UsageAccountResultList = UsageAccountResult[];
export const UsageAccountResultList = S.Array(UsageAccountResult);
export interface UsageTopAccountsResult {
  Feature?: UsageFeature;
  Accounts?: UsageTopAccountResult[];
}
export const UsageTopAccountsResult = S.suspend(() =>
  S.Struct({
    Feature: S.optional(UsageFeature).pipe(T.JsonName("feature")),
    Accounts: S.optional(UsageTopAccountsByFeatureList).pipe(
      T.JsonName("accounts"),
    ),
  }),
).annotations({
  identifier: "UsageTopAccountsResult",
}) as any as S.Schema<UsageTopAccountsResult>;
export type UsageTopAccountsResultList = UsageTopAccountsResult[];
export const UsageTopAccountsResultList = S.Array(UsageTopAccountsResult);
export interface NetworkInterface {
  Ipv6Addresses?: string[];
  NetworkInterfaceId?: string;
  PrivateDnsName?: string;
  PrivateIpAddress?: string | redacted.Redacted<string>;
  PrivateIpAddresses?: PrivateIpAddressDetails[];
  PublicDnsName?: string;
  PublicIp?: string;
  SecurityGroups?: SecurityGroup[];
  SubnetId?: string;
  VpcId?: string;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    Ipv6Addresses: S.optional(Ipv6Addresses).pipe(T.JsonName("ipv6Addresses")),
    NetworkInterfaceId: S.optional(S.String).pipe(
      T.JsonName("networkInterfaceId"),
    ),
    PrivateDnsName: S.optional(S.String).pipe(T.JsonName("privateDnsName")),
    PrivateIpAddress: S.optional(SensitiveString).pipe(
      T.JsonName("privateIpAddress"),
    ),
    PrivateIpAddresses: S.optional(PrivateIpAddresses).pipe(
      T.JsonName("privateIpAddresses"),
    ),
    PublicDnsName: S.optional(S.String).pipe(T.JsonName("publicDnsName")),
    PublicIp: S.optional(S.String).pipe(T.JsonName("publicIp")),
    SecurityGroups: S.optional(SecurityGroups).pipe(
      T.JsonName("securityGroups"),
    ),
    SubnetId: S.optional(S.String).pipe(T.JsonName("subnetId")),
    VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaces = NetworkInterface[];
export const NetworkInterfaces = S.Array(NetworkInterface);
export interface KubernetesUserDetails {
  Username?: string;
  Uid?: string;
  Groups?: string[];
  SessionName?: string[];
  ImpersonatedUser?: ImpersonatedUser;
}
export const KubernetesUserDetails = S.suspend(() =>
  S.Struct({
    Username: S.optional(S.String).pipe(T.JsonName("username")),
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
    Groups: S.optional(Groups).pipe(T.JsonName("groups")),
    SessionName: S.optional(SessionNameList).pipe(T.JsonName("sessionName")),
    ImpersonatedUser: S.optional(ImpersonatedUser)
      .pipe(T.JsonName("impersonatedUser"))
      .annotations({ identifier: "ImpersonatedUser" }),
  }),
).annotations({
  identifier: "KubernetesUserDetails",
}) as any as S.Schema<KubernetesUserDetails>;
export interface NetworkConnectionAction {
  Blocked?: boolean;
  ConnectionDirection?: string;
  LocalPortDetails?: LocalPortDetails;
  Protocol?: string;
  LocalIpDetails?: LocalIpDetails;
  LocalNetworkInterface?: string;
  RemoteIpDetails?: RemoteIpDetails;
  RemotePortDetails?: RemotePortDetails;
}
export const NetworkConnectionAction = S.suspend(() =>
  S.Struct({
    Blocked: S.optional(S.Boolean).pipe(T.JsonName("blocked")),
    ConnectionDirection: S.optional(S.String).pipe(
      T.JsonName("connectionDirection"),
    ),
    LocalPortDetails: S.optional(LocalPortDetails)
      .pipe(T.JsonName("localPortDetails"))
      .annotations({ identifier: "LocalPortDetails" }),
    Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
    LocalIpDetails: S.optional(LocalIpDetails)
      .pipe(T.JsonName("localIpDetails"))
      .annotations({ identifier: "LocalIpDetails" }),
    LocalNetworkInterface: S.optional(S.String).pipe(
      T.JsonName("localNetworkInterface"),
    ),
    RemoteIpDetails: S.optional(RemoteIpDetails)
      .pipe(T.JsonName("remoteIpDetails"))
      .annotations({ identifier: "RemoteIpDetails" }),
    RemotePortDetails: S.optional(RemotePortDetails)
      .pipe(T.JsonName("remotePortDetails"))
      .annotations({ identifier: "RemotePortDetails" }),
  }),
).annotations({
  identifier: "NetworkConnectionAction",
}) as any as S.Schema<NetworkConnectionAction>;
export interface PortProbeAction {
  Blocked?: boolean;
  PortProbeDetails?: PortProbeDetail[];
}
export const PortProbeAction = S.suspend(() =>
  S.Struct({
    Blocked: S.optional(S.Boolean).pipe(T.JsonName("blocked")),
    PortProbeDetails: S.optional(PortProbeDetails).pipe(
      T.JsonName("portProbeDetails"),
    ),
  }),
).annotations({
  identifier: "PortProbeAction",
}) as any as S.Schema<PortProbeAction>;
export interface RdsLoginAttemptAction {
  RemoteIpDetails?: RemoteIpDetails;
  LoginAttributes?: LoginAttribute[];
}
export const RdsLoginAttemptAction = S.suspend(() =>
  S.Struct({
    RemoteIpDetails: S.optional(RemoteIpDetails)
      .pipe(T.JsonName("remoteIpDetails"))
      .annotations({ identifier: "RemoteIpDetails" }),
    LoginAttributes: S.optional(LoginAttributes),
  }),
).annotations({
  identifier: "RdsLoginAttemptAction",
}) as any as S.Schema<RdsLoginAttemptAction>;
export interface Threat {
  Name?: string;
  Source?: string;
  ItemPaths?: ItemPath[];
  Count?: number;
  Hash?: string;
  ItemDetails?: ItemDetails[];
}
export const Threat = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Source: S.optional(S.String).pipe(T.JsonName("source")),
    ItemPaths: S.optional(ItemPaths).pipe(T.JsonName("itemPaths")),
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
    Hash: S.optional(S.String).pipe(T.JsonName("hash")),
    ItemDetails: S.optional(ItemDetailsList).pipe(T.JsonName("itemDetails")),
  }),
).annotations({ identifier: "Threat" }) as any as S.Schema<Threat>;
export type Threats = Threat[];
export const Threats = S.Array(Threat);
export interface AddonDetails {
  AddonVersion?: string;
  AddonStatus?: string;
}
export const AddonDetails = S.suspend(() =>
  S.Struct({
    AddonVersion: S.optional(S.String).pipe(T.JsonName("addonVersion")),
    AddonStatus: S.optional(S.String).pipe(T.JsonName("addonStatus")),
  }),
).annotations({ identifier: "AddonDetails" }) as any as S.Schema<AddonDetails>;
export interface FargateDetails {
  Issues?: string[];
  ManagementType?: ManagementType;
}
export const FargateDetails = S.suspend(() =>
  S.Struct({
    Issues: S.optional(Issues).pipe(T.JsonName("issues")),
    ManagementType: S.optional(ManagementType).pipe(
      T.JsonName("managementType"),
    ),
  }),
).annotations({
  identifier: "FargateDetails",
}) as any as S.Schema<FargateDetails>;
export interface ContainerInstanceDetails {
  CoveredContainerInstances?: number;
  CompatibleContainerInstances?: number;
}
export const ContainerInstanceDetails = S.suspend(() =>
  S.Struct({
    CoveredContainerInstances: S.optional(S.Number).pipe(
      T.JsonName("coveredContainerInstances"),
    ),
    CompatibleContainerInstances: S.optional(S.Number).pipe(
      T.JsonName("compatibleContainerInstances"),
    ),
  }),
).annotations({
  identifier: "ContainerInstanceDetails",
}) as any as S.Schema<ContainerInstanceDetails>;
export interface AgentDetails {
  Version?: string;
}
export const AgentDetails = S.suspend(() =>
  S.Struct({ Version: S.optional(S.String).pipe(T.JsonName("version")) }),
).annotations({ identifier: "AgentDetails" }) as any as S.Schema<AgentDetails>;
export interface UnprocessedDataSourcesResult {
  MalwareProtection?: MalwareProtectionConfigurationResult;
}
export const UnprocessedDataSourcesResult = S.suspend(() =>
  S.Struct({
    MalwareProtection: S.optional(MalwareProtectionConfigurationResult)
      .pipe(T.JsonName("malwareProtection"))
      .annotations({ identifier: "MalwareProtectionConfigurationResult" }),
  }),
).annotations({
  identifier: "UnprocessedDataSourcesResult",
}) as any as S.Schema<UnprocessedDataSourcesResult>;
export interface OrganizationDataSourceConfigurationsResult {
  S3Logs?: OrganizationS3LogsConfigurationResult;
  Kubernetes?: OrganizationKubernetesConfigurationResult;
  MalwareProtection?: OrganizationMalwareProtectionConfigurationResult;
}
export const OrganizationDataSourceConfigurationsResult = S.suspend(() =>
  S.Struct({
    S3Logs: S.optional(OrganizationS3LogsConfigurationResult)
      .pipe(T.JsonName("s3Logs"))
      .annotations({ identifier: "OrganizationS3LogsConfigurationResult" }),
    Kubernetes: S.optional(OrganizationKubernetesConfigurationResult)
      .pipe(T.JsonName("kubernetes"))
      .annotations({ identifier: "OrganizationKubernetesConfigurationResult" }),
    MalwareProtection: S.optional(
      OrganizationMalwareProtectionConfigurationResult,
    )
      .pipe(T.JsonName("malwareProtection"))
      .annotations({
        identifier: "OrganizationMalwareProtectionConfigurationResult",
      }),
  }),
).annotations({
  identifier: "OrganizationDataSourceConfigurationsResult",
}) as any as S.Schema<OrganizationDataSourceConfigurationsResult>;
export interface BlockPublicAccess {
  IgnorePublicAcls?: boolean;
  RestrictPublicBuckets?: boolean;
  BlockPublicAcls?: boolean;
  BlockPublicPolicy?: boolean;
}
export const BlockPublicAccess = S.suspend(() =>
  S.Struct({
    IgnorePublicAcls: S.optional(S.Boolean).pipe(
      T.JsonName("ignorePublicAcls"),
    ),
    RestrictPublicBuckets: S.optional(S.Boolean).pipe(
      T.JsonName("restrictPublicBuckets"),
    ),
    BlockPublicAcls: S.optional(S.Boolean).pipe(T.JsonName("blockPublicAcls")),
    BlockPublicPolicy: S.optional(S.Boolean).pipe(
      T.JsonName("blockPublicPolicy"),
    ),
  }),
).annotations({
  identifier: "BlockPublicAccess",
}) as any as S.Schema<BlockPublicAccess>;
export interface AccountLevelPermissions {
  BlockPublicAccess?: BlockPublicAccess;
}
export const AccountLevelPermissions = S.suspend(() =>
  S.Struct({
    BlockPublicAccess: S.optional(BlockPublicAccess)
      .pipe(T.JsonName("blockPublicAccess"))
      .annotations({ identifier: "BlockPublicAccess" }),
  }),
).annotations({
  identifier: "AccountLevelPermissions",
}) as any as S.Schema<AccountLevelPermissions>;
export interface Session {
  Uid?: string;
  MfaStatus?: MfaStatus;
  CreatedTime?: Date;
  Issuer?: string;
}
export const Session = S.suspend(() =>
  S.Struct({
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
    MfaStatus: S.optional(MfaStatus).pipe(T.JsonName("mfaStatus")),
    CreatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("createdTime")),
    Issuer: S.optional(S.String).pipe(T.JsonName("issuer")),
  }),
).annotations({ identifier: "Session" }) as any as S.Schema<Session>;
export interface ActorProcess {
  Name?: string;
  Path?: string;
  Sha256?: string;
}
export const ActorProcess = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Path: S.optional(S.String).pipe(T.JsonName("path")),
    Sha256: S.optional(S.String).pipe(T.JsonName("sha256")),
  }),
).annotations({ identifier: "ActorProcess" }) as any as S.Schema<ActorProcess>;
export interface NetworkGeoLocation {
  City?: string;
  Country?: string;
  Latitude?: number;
  Longitude?: number;
}
export const NetworkGeoLocation = S.suspend(() =>
  S.Struct({
    City: S.optional(S.String).pipe(T.JsonName("city")),
    Country: S.optional(S.String).pipe(T.JsonName("country")),
    Latitude: S.optional(S.Number).pipe(T.JsonName("lat")),
    Longitude: S.optional(S.Number).pipe(T.JsonName("lon")),
  }),
).annotations({
  identifier: "NetworkGeoLocation",
}) as any as S.Schema<NetworkGeoLocation>;
export interface AutonomousSystem {
  Name?: string;
  Number?: number;
}
export const AutonomousSystem = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Number: S.optional(S.Number).pipe(T.JsonName("number")),
  }),
).annotations({
  identifier: "AutonomousSystem",
}) as any as S.Schema<AutonomousSystem>;
export interface NetworkConnection {
  Direction?: NetworkDirection;
}
export const NetworkConnection = S.suspend(() =>
  S.Struct({
    Direction: S.optional(NetworkDirection).pipe(T.JsonName("direction")),
  }),
).annotations({
  identifier: "NetworkConnection",
}) as any as S.Schema<NetworkConnection>;
export interface GetMalwareScanResultDetails {
  ScanResultStatus?: ScanResultStatus;
  SkippedFileCount?: number;
  FailedFileCount?: number;
  ThreatFoundFileCount?: number;
  TotalFileCount?: number;
  TotalBytes?: number;
  UniqueThreatCount?: number;
  Threats?: ScanResultThreat[];
}
export const GetMalwareScanResultDetails = S.suspend(() =>
  S.Struct({
    ScanResultStatus: S.optional(ScanResultStatus).pipe(
      T.JsonName("scanResultStatus"),
    ),
    SkippedFileCount: S.optional(S.Number).pipe(T.JsonName("skippedFileCount")),
    FailedFileCount: S.optional(S.Number).pipe(T.JsonName("failedFileCount")),
    ThreatFoundFileCount: S.optional(S.Number).pipe(
      T.JsonName("threatFoundFileCount"),
    ),
    TotalFileCount: S.optional(S.Number).pipe(T.JsonName("totalFileCount")),
    TotalBytes: S.optional(S.Number).pipe(T.JsonName("totalBytes")),
    UniqueThreatCount: S.optional(S.Number).pipe(
      T.JsonName("uniqueThreatCount"),
    ),
    Threats: S.optional(ScanResultThreats).pipe(T.JsonName("threats")),
  }),
).annotations({
  identifier: "GetMalwareScanResultDetails",
}) as any as S.Schema<GetMalwareScanResultDetails>;
export interface UsageStatistics {
  SumByAccount?: UsageAccountResult[];
  TopAccountsByFeature?: UsageTopAccountsResult[];
  SumByDataSource?: UsageDataSourceResult[];
  SumByResource?: UsageResourceResult[];
  TopResources?: UsageResourceResult[];
  SumByFeature?: UsageFeatureResult[];
}
export const UsageStatistics = S.suspend(() =>
  S.Struct({
    SumByAccount: S.optional(UsageAccountResultList).pipe(
      T.JsonName("sumByAccount"),
    ),
    TopAccountsByFeature: S.optional(UsageTopAccountsResultList).pipe(
      T.JsonName("topAccountsByFeature"),
    ),
    SumByDataSource: S.optional(UsageDataSourceResultList).pipe(
      T.JsonName("sumByDataSource"),
    ),
    SumByResource: S.optional(UsageResourceResultList).pipe(
      T.JsonName("sumByResource"),
    ),
    TopResources: S.optional(UsageResourceResultList).pipe(
      T.JsonName("topResources"),
    ),
    SumByFeature: S.optional(UsageFeatureResultList).pipe(
      T.JsonName("sumByFeature"),
    ),
  }),
).annotations({
  identifier: "UsageStatistics",
}) as any as S.Schema<UsageStatistics>;
export type ScanResult = "CLEAN" | "INFECTED";
export const ScanResult = S.Literal("CLEAN", "INFECTED");
export interface InstanceDetails {
  AvailabilityZone?: string;
  IamInstanceProfile?: IamInstanceProfile;
  ImageDescription?: string;
  ImageId?: string;
  InstanceId?: string;
  InstanceState?: string;
  InstanceType?: string;
  OutpostArn?: string;
  LaunchTime?: string;
  NetworkInterfaces?: NetworkInterface[];
  Platform?: string;
  ProductCodes?: ProductCode[];
  Tags?: Tag[];
}
export const InstanceDetails = S.suspend(() =>
  S.Struct({
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    IamInstanceProfile: S.optional(IamInstanceProfile)
      .pipe(T.JsonName("iamInstanceProfile"))
      .annotations({ identifier: "IamInstanceProfile" }),
    ImageDescription: S.optional(S.String).pipe(T.JsonName("imageDescription")),
    ImageId: S.optional(S.String).pipe(T.JsonName("imageId")),
    InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
    InstanceState: S.optional(S.String).pipe(T.JsonName("instanceState")),
    InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
    OutpostArn: S.optional(S.String).pipe(T.JsonName("outpostArn")),
    LaunchTime: S.optional(S.String).pipe(T.JsonName("launchTime")),
    NetworkInterfaces: S.optional(NetworkInterfaces).pipe(
      T.JsonName("networkInterfaces"),
    ),
    Platform: S.optional(S.String).pipe(T.JsonName("platform")),
    ProductCodes: S.optional(ProductCodes).pipe(T.JsonName("productCodes")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "InstanceDetails",
}) as any as S.Schema<InstanceDetails>;
export interface RuntimeDetails {
  Process?: ProcessDetails;
  Context?: RuntimeContext;
}
export const RuntimeDetails = S.suspend(() =>
  S.Struct({
    Process: S.optional(ProcessDetails)
      .pipe(T.JsonName("process"))
      .annotations({ identifier: "ProcessDetails" }),
    Context: S.optional(RuntimeContext)
      .pipe(T.JsonName("context"))
      .annotations({ identifier: "RuntimeContext" }),
  }),
).annotations({
  identifier: "RuntimeDetails",
}) as any as S.Schema<RuntimeDetails>;
export type ProfileType = "FREQUENCY";
export const ProfileType = S.Literal("FREQUENCY");
export type ProfileSubtype = "FREQUENT" | "INFREQUENT" | "UNSEEN" | "RARE";
export const ProfileSubtype = S.Literal(
  "FREQUENT",
  "INFREQUENT",
  "UNSEEN",
  "RARE",
);
export type PublicAccessStatus = "BLOCKED" | "ALLOWED";
export const PublicAccessStatus = S.Literal("BLOCKED", "ALLOWED");
export type S3ObjectUids = string[];
export const S3ObjectUids = S.Array(S.String);
export type Ec2NetworkInterfaceUids = string[];
export const Ec2NetworkInterfaceUids = S.Array(S.String);
export type ClusterStatus =
  | "CREATING"
  | "ACTIVE"
  | "DELETING"
  | "FAILED"
  | "UPDATING"
  | "PENDING";
export const ClusterStatus = S.Literal(
  "CREATING",
  "ACTIVE",
  "DELETING",
  "FAILED",
  "UPDATING",
  "PENDING",
);
export type Ec2InstanceUids = string[];
export const Ec2InstanceUids = S.Array(S.String);
export type ContainerUids = string[];
export const ContainerUids = S.Array(S.String);
export type KubernetesResourcesTypes =
  | "PODS"
  | "JOBS"
  | "CRONJOBS"
  | "DEPLOYMENTS"
  | "DAEMONSETS"
  | "STATEFULSETS"
  | "REPLICASETS"
  | "REPLICATIONCONTROLLERS";
export const KubernetesResourcesTypes = S.Literal(
  "PODS",
  "JOBS",
  "CRONJOBS",
  "DEPLOYMENTS",
  "DAEMONSETS",
  "STATEFULSETS",
  "REPLICASETS",
  "REPLICATIONCONTROLLERS",
);
export type EcsClusterStatus =
  | "ACTIVE"
  | "PROVISIONING"
  | "DEPROVISIONING"
  | "FAILED"
  | "INACTIVE";
export const EcsClusterStatus = S.Literal(
  "ACTIVE",
  "PROVISIONING",
  "DEPROVISIONING",
  "FAILED",
  "INACTIVE",
);
export type EcsLaunchType = "FARGATE" | "EC2";
export const EcsLaunchType = S.Literal("FARGATE", "EC2");
export interface MalwareScanDetails {
  Threats?: Threat[];
  ScanId?: string;
  ScanType?: MalwareProtectionScanType;
  ScanCategory?: ScanCategory;
  ScanConfiguration?: MalwareProtectionFindingsScanConfiguration;
  UniqueThreatCount?: number;
}
export const MalwareScanDetails = S.suspend(() =>
  S.Struct({
    Threats: S.optional(Threats).pipe(T.JsonName("threats")),
    ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
    ScanType: S.optional(MalwareProtectionScanType).pipe(
      T.JsonName("scanType"),
    ),
    ScanCategory: S.optional(ScanCategory).pipe(T.JsonName("scanCategory")),
    ScanConfiguration: S.optional(MalwareProtectionFindingsScanConfiguration)
      .pipe(T.JsonName("scanConfiguration"))
      .annotations({
        identifier: "MalwareProtectionFindingsScanConfiguration",
      }),
    UniqueThreatCount: S.optional(S.Number).pipe(
      T.JsonName("uniqueThreatCount"),
    ),
  }),
).annotations({
  identifier: "MalwareScanDetails",
}) as any as S.Schema<MalwareScanDetails>;
export interface CoverageEksClusterDetails {
  ClusterName?: string;
  CoveredNodes?: number;
  CompatibleNodes?: number;
  AddonDetails?: AddonDetails;
  ManagementType?: ManagementType;
}
export const CoverageEksClusterDetails = S.suspend(() =>
  S.Struct({
    ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
    CoveredNodes: S.optional(S.Number).pipe(T.JsonName("coveredNodes")),
    CompatibleNodes: S.optional(S.Number).pipe(T.JsonName("compatibleNodes")),
    AddonDetails: S.optional(AddonDetails)
      .pipe(T.JsonName("addonDetails"))
      .annotations({ identifier: "AddonDetails" }),
    ManagementType: S.optional(ManagementType).pipe(
      T.JsonName("managementType"),
    ),
  }),
).annotations({
  identifier: "CoverageEksClusterDetails",
}) as any as S.Schema<CoverageEksClusterDetails>;
export interface CoverageEcsClusterDetails {
  ClusterName?: string;
  FargateDetails?: FargateDetails;
  ContainerInstanceDetails?: ContainerInstanceDetails;
}
export const CoverageEcsClusterDetails = S.suspend(() =>
  S.Struct({
    ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
    FargateDetails: S.optional(FargateDetails)
      .pipe(T.JsonName("fargateDetails"))
      .annotations({ identifier: "FargateDetails" }),
    ContainerInstanceDetails: S.optional(ContainerInstanceDetails)
      .pipe(T.JsonName("containerInstanceDetails"))
      .annotations({ identifier: "ContainerInstanceDetails" }),
  }),
).annotations({
  identifier: "CoverageEcsClusterDetails",
}) as any as S.Schema<CoverageEcsClusterDetails>;
export interface CoverageEc2InstanceDetails {
  InstanceId?: string;
  InstanceType?: string;
  ClusterArn?: string;
  AgentDetails?: AgentDetails;
  ManagementType?: ManagementType;
}
export const CoverageEc2InstanceDetails = S.suspend(() =>
  S.Struct({
    InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
    InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
    ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
    AgentDetails: S.optional(AgentDetails)
      .pipe(T.JsonName("agentDetails"))
      .annotations({ identifier: "AgentDetails" }),
    ManagementType: S.optional(ManagementType).pipe(
      T.JsonName("managementType"),
    ),
  }),
).annotations({
  identifier: "CoverageEc2InstanceDetails",
}) as any as S.Schema<CoverageEc2InstanceDetails>;
export interface CreateDetectorResponse {
  DetectorId?: string;
  UnprocessedDataSources?: UnprocessedDataSourcesResult;
}
export const CreateDetectorResponse = S.suspend(() =>
  S.Struct({
    DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
    UnprocessedDataSources: S.optional(UnprocessedDataSourcesResult)
      .pipe(T.JsonName("unprocessedDataSources"))
      .annotations({ identifier: "UnprocessedDataSourcesResult" }),
  }),
).annotations({
  identifier: "CreateDetectorResponse",
}) as any as S.Schema<CreateDetectorResponse>;
export interface DescribeOrganizationConfigurationResponse {
  AutoEnable?: boolean;
  MemberAccountLimitReached: boolean;
  DataSources?: OrganizationDataSourceConfigurationsResult & {
    S3Logs: OrganizationS3LogsConfigurationResult & { AutoEnable: boolean };
    Kubernetes: OrganizationKubernetesConfigurationResult & {
      AuditLogs: OrganizationKubernetesAuditLogsConfigurationResult & {
        AutoEnable: boolean;
      };
    };
  };
  Features?: OrganizationFeatureConfigurationResult[];
  NextToken?: string;
  AutoEnableOrganizationMembers?: AutoEnableMembers;
}
export const DescribeOrganizationConfigurationResponse = S.suspend(() =>
  S.Struct({
    AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
    MemberAccountLimitReached: S.optional(S.Boolean).pipe(
      T.JsonName("memberAccountLimitReached"),
    ),
    DataSources: S.optional(OrganizationDataSourceConfigurationsResult)
      .pipe(T.JsonName("dataSources"))
      .annotations({
        identifier: "OrganizationDataSourceConfigurationsResult",
      }),
    Features: S.optional(OrganizationFeaturesConfigurationsResults).pipe(
      T.JsonName("features"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    AutoEnableOrganizationMembers: S.optional(AutoEnableMembers).pipe(
      T.JsonName("autoEnableOrganizationMembers"),
    ),
  }),
).annotations({
  identifier: "DescribeOrganizationConfigurationResponse",
}) as any as S.Schema<DescribeOrganizationConfigurationResponse>;
export interface GetDetectorResponse {
  CreatedAt?: string;
  FindingPublishingFrequency?: FindingPublishingFrequency;
  ServiceRole: string;
  Status: DetectorStatus;
  UpdatedAt?: string;
  DataSources?: DataSourceConfigurationsResult & {
    CloudTrail: CloudTrailConfigurationResult & { Status: DataSourceStatus };
    DNSLogs: DNSLogsConfigurationResult & { Status: DataSourceStatus };
    FlowLogs: FlowLogsConfigurationResult & { Status: DataSourceStatus };
    S3Logs: S3LogsConfigurationResult & { Status: DataSourceStatus };
    Kubernetes: KubernetesConfigurationResult & {
      AuditLogs: KubernetesAuditLogsConfigurationResult & {
        Status: DataSourceStatus;
      };
    };
  };
  Tags?: { [key: string]: string };
  Features?: DetectorFeatureConfigurationResult[];
}
export const GetDetectorResponse = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    FindingPublishingFrequency: S.optional(FindingPublishingFrequency).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    ServiceRole: S.optional(S.String).pipe(T.JsonName("serviceRole")),
    Status: S.optional(DetectorStatus).pipe(T.JsonName("status")),
    UpdatedAt: S.optional(S.String).pipe(T.JsonName("updatedAt")),
    DataSources: S.optional(DataSourceConfigurationsResult)
      .pipe(T.JsonName("dataSources"))
      .annotations({ identifier: "DataSourceConfigurationsResult" }),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    Features: S.optional(DetectorFeatureConfigurationsResults).pipe(
      T.JsonName("features"),
    ),
  }),
).annotations({
  identifier: "GetDetectorResponse",
}) as any as S.Schema<GetDetectorResponse>;
export interface NetworkEndpoint {
  Id?: string;
  Ip?: string;
  Domain?: string;
  Port?: number;
  Location?: NetworkGeoLocation;
  AutonomousSystem?: AutonomousSystem;
  Connection?: NetworkConnection;
}
export const NetworkEndpoint = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Ip: S.optional(S.String).pipe(T.JsonName("ip")),
    Domain: S.optional(S.String).pipe(T.JsonName("domain")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Location: S.optional(NetworkGeoLocation)
      .pipe(T.JsonName("location"))
      .annotations({ identifier: "NetworkGeoLocation" }),
    AutonomousSystem: S.optional(AutonomousSystem)
      .pipe(T.JsonName("autonomousSystem"))
      .annotations({ identifier: "AutonomousSystem" }),
    Connection: S.optional(NetworkConnection)
      .pipe(T.JsonName("connection"))
      .annotations({ identifier: "NetworkConnection" }),
  }),
).annotations({
  identifier: "NetworkEndpoint",
}) as any as S.Schema<NetworkEndpoint>;
export type NetworkEndpoints = NetworkEndpoint[];
export const NetworkEndpoints = S.Array(NetworkEndpoint);
export interface GetMalwareScanResponse {
  ScanId?: string;
  DetectorId?: string;
  AdminDetectorId?: string;
  ResourceArn?: string;
  ResourceType?: MalwareProtectionResourceType;
  ScannedResourcesCount?: number;
  SkippedResourcesCount?: number;
  FailedResourcesCount?: number;
  ScannedResources?: ScannedResource[];
  ScanConfiguration?: ScanConfiguration & {
    IncrementalScanDetails: IncrementalScanDetails & {
      BaselineResourceArn: NonEmptyString;
    };
  };
  ScanCategory?: ScanCategory;
  ScanStatus?: MalwareProtectionScanStatus;
  ScanStatusReason?: ScanStatusReason;
  ScanType?: MalwareProtectionScanType;
  ScanStartedAt?: Date;
  ScanCompletedAt?: Date;
  ScanResultDetails?: GetMalwareScanResultDetails;
}
export const GetMalwareScanResponse = S.suspend(() =>
  S.Struct({
    ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
    DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
    AdminDetectorId: S.optional(S.String).pipe(T.JsonName("adminDetectorId")),
    ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
    ResourceType: S.optional(MalwareProtectionResourceType).pipe(
      T.JsonName("resourceType"),
    ),
    ScannedResourcesCount: S.optional(S.Number).pipe(
      T.JsonName("scannedResourcesCount"),
    ),
    SkippedResourcesCount: S.optional(S.Number).pipe(
      T.JsonName("skippedResourcesCount"),
    ),
    FailedResourcesCount: S.optional(S.Number).pipe(
      T.JsonName("failedResourcesCount"),
    ),
    ScannedResources: S.optional(ScannedResources).pipe(
      T.JsonName("scannedResources"),
    ),
    ScanConfiguration: S.optional(ScanConfiguration)
      .pipe(T.JsonName("scanConfiguration"))
      .annotations({ identifier: "ScanConfiguration" }),
    ScanCategory: S.optional(ScanCategory).pipe(T.JsonName("scanCategory")),
    ScanStatus: S.optional(MalwareProtectionScanStatus).pipe(
      T.JsonName("scanStatus"),
    ),
    ScanStatusReason: S.optional(ScanStatusReason).pipe(
      T.JsonName("scanStatusReason"),
    ),
    ScanType: S.optional(MalwareProtectionScanType).pipe(
      T.JsonName("scanType"),
    ),
    ScanStartedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("scanStartedAt")),
    ScanCompletedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("scanCompletedAt")),
    ScanResultDetails: S.optional(GetMalwareScanResultDetails)
      .pipe(T.JsonName("scanResultDetails"))
      .annotations({ identifier: "GetMalwareScanResultDetails" }),
  }),
).annotations({
  identifier: "GetMalwareScanResponse",
}) as any as S.Schema<GetMalwareScanResponse>;
export interface GetUsageStatisticsResponse {
  UsageStatistics?: UsageStatistics;
  NextToken?: string;
}
export const GetUsageStatisticsResponse = S.suspend(() =>
  S.Struct({
    UsageStatistics: S.optional(UsageStatistics)
      .pipe(T.JsonName("usageStatistics"))
      .annotations({ identifier: "UsageStatistics" }),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetUsageStatisticsResponse",
}) as any as S.Schema<GetUsageStatisticsResponse>;
export interface ResourceDetails {
  InstanceArn?: string;
}
export const ResourceDetails = S.suspend(() =>
  S.Struct({
    InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
  }),
).annotations({
  identifier: "ResourceDetails",
}) as any as S.Schema<ResourceDetails>;
export interface ScanResultDetails {
  ScanResult?: ScanResult;
}
export const ScanResultDetails = S.suspend(() =>
  S.Struct({
    ScanResult: S.optional(ScanResult).pipe(T.JsonName("scanResult")),
  }),
).annotations({
  identifier: "ScanResultDetails",
}) as any as S.Schema<ScanResultDetails>;
export type CountByResourceType = { [key in ResourceType]?: number };
export const CountByResourceType = S.partial(
  S.Record({ key: ResourceType, value: S.Number }),
);
export type CountByCoverageStatus = { [key in CoverageStatus]?: number };
export const CountByCoverageStatus = S.partial(
  S.Record({ key: CoverageStatus, value: S.Number }),
);
export interface AccessControlList {
  AllowsPublicReadAccess?: boolean;
  AllowsPublicWriteAccess?: boolean;
}
export const AccessControlList = S.suspend(() =>
  S.Struct({
    AllowsPublicReadAccess: S.optional(S.Boolean).pipe(
      T.JsonName("allowsPublicReadAccess"),
    ),
    AllowsPublicWriteAccess: S.optional(S.Boolean).pipe(
      T.JsonName("allowsPublicWriteAccess"),
    ),
  }),
).annotations({
  identifier: "AccessControlList",
}) as any as S.Schema<AccessControlList>;
export interface BucketPolicy {
  AllowsPublicReadAccess?: boolean;
  AllowsPublicWriteAccess?: boolean;
}
export const BucketPolicy = S.suspend(() =>
  S.Struct({
    AllowsPublicReadAccess: S.optional(S.Boolean).pipe(
      T.JsonName("allowsPublicReadAccess"),
    ),
    AllowsPublicWriteAccess: S.optional(S.Boolean).pipe(
      T.JsonName("allowsPublicWriteAccess"),
    ),
  }),
).annotations({ identifier: "BucketPolicy" }) as any as S.Schema<BucketPolicy>;
export interface ScanFilePath {
  FilePath?: string;
  VolumeArn?: string;
  Hash?: string;
  FileName?: string;
}
export const ScanFilePath = S.suspend(() =>
  S.Struct({
    FilePath: S.optional(S.String).pipe(T.JsonName("filePath")),
    VolumeArn: S.optional(S.String).pipe(T.JsonName("volumeArn")),
    Hash: S.optional(S.String).pipe(T.JsonName("hash")),
    FileName: S.optional(S.String).pipe(T.JsonName("fileName")),
  }),
).annotations({ identifier: "ScanFilePath" }) as any as S.Schema<ScanFilePath>;
export type FilePaths = ScanFilePath[];
export const FilePaths = S.Array(ScanFilePath);
export type ObservationTexts = string[];
export const ObservationTexts = S.Array(S.String);
export interface Observations {
  Text?: string[];
}
export const Observations = S.suspend(() =>
  S.Struct({ Text: S.optional(ObservationTexts).pipe(T.JsonName("text")) }),
).annotations({ identifier: "Observations" }) as any as S.Schema<Observations>;
export interface AnomalyObject {
  ProfileType?: ProfileType;
  ProfileSubtype?: ProfileSubtype;
  Observations?: Observations;
}
export const AnomalyObject = S.suspend(() =>
  S.Struct({
    ProfileType: S.optional(ProfileType).pipe(T.JsonName("profileType")),
    ProfileSubtype: S.optional(ProfileSubtype).pipe(
      T.JsonName("profileSubtype"),
    ),
    Observations: S.optional(Observations)
      .pipe(T.JsonName("observations"))
      .annotations({ identifier: "Observations" }),
  }),
).annotations({
  identifier: "AnomalyObject",
}) as any as S.Schema<AnomalyObject>;
export type AnomalyUnusualBehaviorFeature = { [key: string]: AnomalyObject };
export const AnomalyUnusualBehaviorFeature = S.Record({
  key: S.String,
  value: AnomalyObject,
});
export interface Account {
  Uid?: string;
  Name?: string;
}
export const Account = S.suspend(() =>
  S.Struct({
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
    Name: S.optional(S.String).pipe(T.JsonName("account")),
  }),
).annotations({ identifier: "Account" }) as any as S.Schema<Account>;
export interface Ec2Instance {
  AvailabilityZone?: string;
  ImageDescription?: string;
  InstanceState?: string;
  IamInstanceProfile?: IamInstanceProfile;
  InstanceType?: string;
  OutpostArn?: string;
  Platform?: string;
  ProductCodes?: ProductCode[];
  Ec2NetworkInterfaceUids?: string[];
}
export const Ec2Instance = S.suspend(() =>
  S.Struct({
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    ImageDescription: S.optional(S.String).pipe(T.JsonName("imageDescription")),
    InstanceState: S.optional(S.String).pipe(T.JsonName("instanceState")),
    IamInstanceProfile: S.optional(IamInstanceProfile),
    InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
    OutpostArn: S.optional(S.String).pipe(T.JsonName("outpostArn")),
    Platform: S.optional(S.String).pipe(T.JsonName("platform")),
    ProductCodes: S.optional(ProductCodes).pipe(T.JsonName("productCodes")),
    Ec2NetworkInterfaceUids: S.optional(Ec2NetworkInterfaceUids).pipe(
      T.JsonName("ec2NetworkInterfaceUids"),
    ),
  }),
).annotations({ identifier: "Ec2Instance" }) as any as S.Schema<Ec2Instance>;
export interface AccessKey {
  PrincipalId?: string;
  UserName?: string;
  UserType?: string;
}
export const AccessKey = S.suspend(() =>
  S.Struct({
    PrincipalId: S.optional(S.String).pipe(T.JsonName("principalId")),
    UserName: S.optional(S.String).pipe(T.JsonName("userName")),
    UserType: S.optional(S.String).pipe(T.JsonName("userType")),
  }),
).annotations({ identifier: "AccessKey" }) as any as S.Schema<AccessKey>;
export interface Ec2NetworkInterface {
  Ipv6Addresses?: string[];
  PrivateIpAddresses?: PrivateIpAddressDetails[];
  PublicIp?: string;
  SecurityGroups?: SecurityGroup[];
  SubNetId?: string;
  VpcId?: string;
}
export const Ec2NetworkInterface = S.suspend(() =>
  S.Struct({
    Ipv6Addresses: S.optional(Ipv6Addresses).pipe(T.JsonName("ipv6Addresses")),
    PrivateIpAddresses: S.optional(PrivateIpAddresses).pipe(
      T.JsonName("privateIpAddresses"),
    ),
    PublicIp: S.optional(S.String).pipe(T.JsonName("publicIp")),
    SecurityGroups: S.optional(SecurityGroups).pipe(
      T.JsonName("securityGroups"),
    ),
    SubNetId: S.optional(S.String).pipe(T.JsonName("subNetId")),
    VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
  }),
).annotations({
  identifier: "Ec2NetworkInterface",
}) as any as S.Schema<Ec2NetworkInterface>;
export interface S3Object {
  ETag?: string;
  Key?: string;
  VersionId?: string;
}
export const S3Object = S.suspend(() =>
  S.Struct({
    ETag: S.optional(S.String).pipe(T.JsonName("eTag")),
    Key: S.optional(S.String).pipe(T.JsonName("key")),
    VersionId: S.optional(S.String).pipe(T.JsonName("versionId")),
  }),
).annotations({ identifier: "S3Object" }) as any as S.Schema<S3Object>;
export interface EksCluster {
  Arn?: string;
  CreatedAt?: Date;
  Status?: ClusterStatus;
  VpcId?: string;
  Ec2InstanceUids?: string[];
}
export const EksCluster = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    Status: S.optional(ClusterStatus).pipe(T.JsonName("status")),
    VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
    Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
      T.JsonName("ec2InstanceUids"),
    ),
  }),
).annotations({ identifier: "EksCluster" }) as any as S.Schema<EksCluster>;
export interface KubernetesWorkload {
  ContainerUids?: string[];
  Namespace?: string;
  KubernetesResourcesTypes?: KubernetesResourcesTypes;
}
export const KubernetesWorkload = S.suspend(() =>
  S.Struct({
    ContainerUids: S.optional(ContainerUids).pipe(T.JsonName("containerUids")),
    Namespace: S.optional(S.String).pipe(T.JsonName("namespace")),
    KubernetesResourcesTypes: S.optional(KubernetesResourcesTypes).pipe(
      T.JsonName("type"),
    ),
  }),
).annotations({
  identifier: "KubernetesWorkload",
}) as any as S.Schema<KubernetesWorkload>;
export interface ContainerFindingResource {
  Image?: string;
  ImageUid?: string;
}
export const ContainerFindingResource = S.suspend(() =>
  S.Struct({
    Image: S.optional(S.String).pipe(T.JsonName("image")),
    ImageUid: S.optional(S.String).pipe(T.JsonName("imageUid")),
  }),
).annotations({
  identifier: "ContainerFindingResource",
}) as any as S.Schema<ContainerFindingResource>;
export interface EcsCluster {
  Status?: EcsClusterStatus;
  Ec2InstanceUids?: string[];
}
export const EcsCluster = S.suspend(() =>
  S.Struct({
    Status: S.optional(EcsClusterStatus).pipe(T.JsonName("status")),
    Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
      T.JsonName("ec2InstanceUids"),
    ),
  }),
).annotations({ identifier: "EcsCluster" }) as any as S.Schema<EcsCluster>;
export interface EcsTask {
  CreatedAt?: Date;
  TaskDefinitionArn?: string;
  LaunchType?: EcsLaunchType;
  ContainerUids?: string[];
}
export const EcsTask = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    TaskDefinitionArn: S.optional(S.String).pipe(
      T.JsonName("taskDefinitionArn"),
    ),
    LaunchType: S.optional(EcsLaunchType).pipe(T.JsonName("launchType")),
    ContainerUids: S.optional(ContainerUids).pipe(T.JsonName("containerUids")),
  }),
).annotations({ identifier: "EcsTask" }) as any as S.Schema<EcsTask>;
export interface IamInstanceProfileV2 {
  Ec2InstanceUids?: string[];
}
export const IamInstanceProfileV2 = S.suspend(() =>
  S.Struct({
    Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
      T.JsonName("ec2InstanceUids"),
    ),
  }),
).annotations({
  identifier: "IamInstanceProfileV2",
}) as any as S.Schema<IamInstanceProfileV2>;
export interface AutoscalingAutoScalingGroup {
  Ec2InstanceUids?: string[];
}
export const AutoscalingAutoScalingGroup = S.suspend(() =>
  S.Struct({
    Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
      T.JsonName("ec2InstanceUids"),
    ),
  }),
).annotations({
  identifier: "AutoscalingAutoScalingGroup",
}) as any as S.Schema<AutoscalingAutoScalingGroup>;
export interface Ec2LaunchTemplate {
  Ec2InstanceUids?: string[];
  Version?: string;
}
export const Ec2LaunchTemplate = S.suspend(() =>
  S.Struct({
    Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
      T.JsonName("ec2InstanceUids"),
    ),
    Version: S.optional(S.String).pipe(T.JsonName("version")),
  }),
).annotations({
  identifier: "Ec2LaunchTemplate",
}) as any as S.Schema<Ec2LaunchTemplate>;
export interface Ec2Vpc {
  Ec2InstanceUids?: string[];
}
export const Ec2Vpc = S.suspend(() =>
  S.Struct({
    Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
      T.JsonName("ec2InstanceUids"),
    ),
  }),
).annotations({ identifier: "Ec2Vpc" }) as any as S.Schema<Ec2Vpc>;
export interface Ec2Image {
  Ec2InstanceUids?: string[];
}
export const Ec2Image = S.suspend(() =>
  S.Struct({
    Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
      T.JsonName("ec2InstanceUids"),
    ),
  }),
).annotations({ identifier: "Ec2Image" }) as any as S.Schema<Ec2Image>;
export interface CloudformationStack {
  Ec2InstanceUids?: string[];
}
export const CloudformationStack = S.suspend(() =>
  S.Struct({
    Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
      T.JsonName("ec2InstanceUids"),
    ),
  }),
).annotations({
  identifier: "CloudformationStack",
}) as any as S.Schema<CloudformationStack>;
export interface CoverageResourceDetails {
  EksClusterDetails?: CoverageEksClusterDetails;
  ResourceType?: ResourceType;
  EcsClusterDetails?: CoverageEcsClusterDetails;
  Ec2InstanceDetails?: CoverageEc2InstanceDetails;
}
export const CoverageResourceDetails = S.suspend(() =>
  S.Struct({
    EksClusterDetails: S.optional(CoverageEksClusterDetails)
      .pipe(T.JsonName("eksClusterDetails"))
      .annotations({ identifier: "CoverageEksClusterDetails" }),
    ResourceType: S.optional(ResourceType).pipe(T.JsonName("resourceType")),
    EcsClusterDetails: S.optional(CoverageEcsClusterDetails)
      .pipe(T.JsonName("ecsClusterDetails"))
      .annotations({ identifier: "CoverageEcsClusterDetails" }),
    Ec2InstanceDetails: S.optional(CoverageEc2InstanceDetails)
      .pipe(T.JsonName("ec2InstanceDetails"))
      .annotations({ identifier: "CoverageEc2InstanceDetails" }),
  }),
).annotations({
  identifier: "CoverageResourceDetails",
}) as any as S.Schema<CoverageResourceDetails>;
export interface KubernetesWorkloadDetails {
  Name?: string;
  Type?: string;
  Uid?: string;
  Namespace?: string;
  HostNetwork?: boolean;
  Containers?: Container[];
  Volumes?: Volume[];
  ServiceAccountName?: string;
  HostIPC?: boolean;
  HostPID?: boolean;
}
export const KubernetesWorkloadDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
    Namespace: S.optional(S.String).pipe(T.JsonName("namespace")),
    HostNetwork: S.optional(S.Boolean).pipe(T.JsonName("hostNetwork")),
    Containers: S.optional(Containers).pipe(T.JsonName("containers")),
    Volumes: S.optional(Volumes).pipe(T.JsonName("volumes")),
    ServiceAccountName: S.optional(S.String).pipe(
      T.JsonName("serviceAccountName"),
    ),
    HostIPC: S.optional(S.Boolean).pipe(T.JsonName("hostIPC")),
    HostPID: S.optional(S.Boolean).pipe(T.JsonName("hostPID")),
  }),
).annotations({
  identifier: "KubernetesWorkloadDetails",
}) as any as S.Schema<KubernetesWorkloadDetails>;
export interface AwsApiCallAction {
  Api?: string;
  CallerType?: string;
  DomainDetails?: DomainDetails;
  ErrorCode?: string;
  UserAgent?: string;
  RemoteIpDetails?: RemoteIpDetails;
  ServiceName?: string;
  RemoteAccountDetails?: RemoteAccountDetails;
  AffectedResources?: { [key: string]: string };
}
export const AwsApiCallAction = S.suspend(() =>
  S.Struct({
    Api: S.optional(S.String).pipe(T.JsonName("api")),
    CallerType: S.optional(S.String).pipe(T.JsonName("callerType")),
    DomainDetails: S.optional(DomainDetails)
      .pipe(T.JsonName("domainDetails"))
      .annotations({ identifier: "DomainDetails" }),
    ErrorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
    UserAgent: S.optional(S.String).pipe(T.JsonName("userAgent")),
    RemoteIpDetails: S.optional(RemoteIpDetails)
      .pipe(T.JsonName("remoteIpDetails"))
      .annotations({ identifier: "RemoteIpDetails" }),
    ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
    RemoteAccountDetails: S.optional(RemoteAccountDetails)
      .pipe(T.JsonName("remoteAccountDetails"))
      .annotations({ identifier: "RemoteAccountDetails" }),
    AffectedResources: S.optional(AffectedResources).pipe(
      T.JsonName("affectedResources"),
    ),
  }),
).annotations({
  identifier: "AwsApiCallAction",
}) as any as S.Schema<AwsApiCallAction>;
export type PublicAclIgnoreBehavior = "IGNORED" | "NOT_IGNORED";
export const PublicAclIgnoreBehavior = S.Literal("IGNORED", "NOT_IGNORED");
export type PublicBucketRestrictBehavior = "RESTRICTED" | "NOT_RESTRICTED";
export const PublicBucketRestrictBehavior = S.Literal(
  "RESTRICTED",
  "NOT_RESTRICTED",
);
export interface Scan {
  DetectorId?: string;
  AdminDetectorId?: string;
  ScanId?: string;
  ScanStatus?: ScanStatus;
  FailureReason?: string;
  ScanStartTime?: Date;
  ScanEndTime?: Date;
  TriggerDetails?: TriggerDetails;
  ResourceDetails?: ResourceDetails;
  ScanResultDetails?: ScanResultDetails;
  AccountId?: string;
  TotalBytes?: number;
  FileCount?: number;
  AttachedVolumes?: VolumeDetail[];
  ScanType?: ScanType;
}
export const Scan = S.suspend(() =>
  S.Struct({
    DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
    AdminDetectorId: S.optional(S.String).pipe(T.JsonName("adminDetectorId")),
    ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
    ScanStatus: S.optional(ScanStatus).pipe(T.JsonName("scanStatus")),
    FailureReason: S.optional(S.String).pipe(T.JsonName("failureReason")),
    ScanStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("scanStartTime")),
    ScanEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("scanEndTime")),
    TriggerDetails: S.optional(TriggerDetails)
      .pipe(T.JsonName("triggerDetails"))
      .annotations({ identifier: "TriggerDetails" }),
    ResourceDetails: S.optional(ResourceDetails)
      .pipe(T.JsonName("resourceDetails"))
      .annotations({ identifier: "ResourceDetails" }),
    ScanResultDetails: S.optional(ScanResultDetails)
      .pipe(T.JsonName("scanResultDetails"))
      .annotations({ identifier: "ScanResultDetails" }),
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    TotalBytes: S.optional(S.Number).pipe(T.JsonName("totalBytes")),
    FileCount: S.optional(S.Number).pipe(T.JsonName("fileCount")),
    AttachedVolumes: S.optional(VolumeDetails).pipe(
      T.JsonName("attachedVolumes"),
    ),
    ScanType: S.optional(ScanType).pipe(T.JsonName("scanType")),
  }),
).annotations({ identifier: "Scan" }) as any as S.Schema<Scan>;
export type Scans = Scan[];
export const Scans = S.Array(Scan);
export interface CoverageStatistics {
  CountByResourceType?: { [key: string]: number };
  CountByCoverageStatus?: { [key: string]: number };
}
export const CoverageStatistics = S.suspend(() =>
  S.Struct({
    CountByResourceType: S.optional(CountByResourceType).pipe(
      T.JsonName("countByResourceType"),
    ),
    CountByCoverageStatus: S.optional(CountByCoverageStatus).pipe(
      T.JsonName("countByCoverageStatus"),
    ),
  }),
).annotations({
  identifier: "CoverageStatistics",
}) as any as S.Schema<CoverageStatistics>;
export interface BucketLevelPermissions {
  AccessControlList?: AccessControlList;
  BucketPolicy?: BucketPolicy;
  BlockPublicAccess?: BlockPublicAccess;
}
export const BucketLevelPermissions = S.suspend(() =>
  S.Struct({
    AccessControlList: S.optional(AccessControlList)
      .pipe(T.JsonName("accessControlList"))
      .annotations({ identifier: "AccessControlList" }),
    BucketPolicy: S.optional(BucketPolicy)
      .pipe(T.JsonName("bucketPolicy"))
      .annotations({ identifier: "BucketPolicy" }),
    BlockPublicAccess: S.optional(BlockPublicAccess)
      .pipe(T.JsonName("blockPublicAccess"))
      .annotations({ identifier: "BlockPublicAccess" }),
  }),
).annotations({
  identifier: "BucketLevelPermissions",
}) as any as S.Schema<BucketLevelPermissions>;
export interface ScanThreatName {
  Name?: string;
  Severity?: string;
  ItemCount?: number;
  FilePaths?: ScanFilePath[];
}
export const ScanThreatName = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Severity: S.optional(S.String).pipe(T.JsonName("severity")),
    ItemCount: S.optional(S.Number).pipe(T.JsonName("itemCount")),
    FilePaths: S.optional(FilePaths).pipe(T.JsonName("filePaths")),
  }),
).annotations({
  identifier: "ScanThreatName",
}) as any as S.Schema<ScanThreatName>;
export type ScanThreatNames = ScanThreatName[];
export const ScanThreatNames = S.Array(ScanThreatName);
export type Behavior = { [key: string]: { [key: string]: AnomalyObject } };
export const Behavior = S.Record({
  key: S.String,
  value: AnomalyUnusualBehaviorFeature,
});
export interface User {
  Name?: string;
  Uid?: string;
  Type?: string;
  CredentialUid?: string;
  Account?: Account;
}
export const User = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
    CredentialUid: S.optional(S.String).pipe(T.JsonName("credentialUid")),
    Account: S.optional(Account)
      .pipe(T.JsonName("account"))
      .annotations({ identifier: "Account" }),
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export interface CoverageResource {
  ResourceId?: string;
  DetectorId?: string;
  AccountId?: string;
  ResourceDetails?: CoverageResourceDetails;
  CoverageStatus?: CoverageStatus;
  Issue?: string;
  UpdatedAt?: Date;
}
export const CoverageResource = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    ResourceDetails: S.optional(CoverageResourceDetails)
      .pipe(T.JsonName("resourceDetails"))
      .annotations({ identifier: "CoverageResourceDetails" }),
    CoverageStatus: S.optional(CoverageStatus).pipe(
      T.JsonName("coverageStatus"),
    ),
    Issue: S.optional(S.String).pipe(T.JsonName("issue")),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({
  identifier: "CoverageResource",
}) as any as S.Schema<CoverageResource>;
export type CoverageResources = CoverageResource[];
export const CoverageResources = S.Array(CoverageResource);
export interface KubernetesDetails {
  KubernetesUserDetails?: KubernetesUserDetails;
  KubernetesWorkloadDetails?: KubernetesWorkloadDetails;
}
export const KubernetesDetails = S.suspend(() =>
  S.Struct({
    KubernetesUserDetails: S.optional(KubernetesUserDetails)
      .pipe(T.JsonName("kubernetesUserDetails"))
      .annotations({ identifier: "KubernetesUserDetails" }),
    KubernetesWorkloadDetails: S.optional(KubernetesWorkloadDetails)
      .pipe(T.JsonName("kubernetesWorkloadDetails"))
      .annotations({ identifier: "KubernetesWorkloadDetails" }),
  }),
).annotations({
  identifier: "KubernetesDetails",
}) as any as S.Schema<KubernetesDetails>;
export interface Action {
  ActionType?: string;
  AwsApiCallAction?: AwsApiCallAction;
  DnsRequestAction?: DnsRequestAction;
  NetworkConnectionAction?: NetworkConnectionAction;
  PortProbeAction?: PortProbeAction;
  KubernetesApiCallAction?: KubernetesApiCallAction;
  RdsLoginAttemptAction?: RdsLoginAttemptAction;
  KubernetesPermissionCheckedDetails?: KubernetesPermissionCheckedDetails;
  KubernetesRoleBindingDetails?: KubernetesRoleBindingDetails;
  KubernetesRoleDetails?: KubernetesRoleDetails;
}
export const Action = S.suspend(() =>
  S.Struct({
    ActionType: S.optional(S.String).pipe(T.JsonName("actionType")),
    AwsApiCallAction: S.optional(AwsApiCallAction)
      .pipe(T.JsonName("awsApiCallAction"))
      .annotations({ identifier: "AwsApiCallAction" }),
    DnsRequestAction: S.optional(DnsRequestAction)
      .pipe(T.JsonName("dnsRequestAction"))
      .annotations({ identifier: "DnsRequestAction" }),
    NetworkConnectionAction: S.optional(NetworkConnectionAction)
      .pipe(T.JsonName("networkConnectionAction"))
      .annotations({ identifier: "NetworkConnectionAction" }),
    PortProbeAction: S.optional(PortProbeAction)
      .pipe(T.JsonName("portProbeAction"))
      .annotations({ identifier: "PortProbeAction" }),
    KubernetesApiCallAction: S.optional(KubernetesApiCallAction)
      .pipe(T.JsonName("kubernetesApiCallAction"))
      .annotations({ identifier: "KubernetesApiCallAction" }),
    RdsLoginAttemptAction: S.optional(RdsLoginAttemptAction)
      .pipe(T.JsonName("rdsLoginAttemptAction"))
      .annotations({ identifier: "RdsLoginAttemptAction" }),
    KubernetesPermissionCheckedDetails: S.optional(
      KubernetesPermissionCheckedDetails,
    )
      .pipe(T.JsonName("kubernetesPermissionCheckedDetails"))
      .annotations({ identifier: "KubernetesPermissionCheckedDetails" }),
    KubernetesRoleBindingDetails: S.optional(KubernetesRoleBindingDetails)
      .pipe(T.JsonName("kubernetesRoleBindingDetails"))
      .annotations({ identifier: "KubernetesRoleBindingDetails" }),
    KubernetesRoleDetails: S.optional(KubernetesRoleDetails)
      .pipe(T.JsonName("kubernetesRoleDetails"))
      .annotations({ identifier: "KubernetesRoleDetails" }),
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export interface PublicAccessConfiguration {
  PublicAclAccess?: PublicAccessStatus;
  PublicPolicyAccess?: PublicAccessStatus;
  PublicAclIgnoreBehavior?: PublicAclIgnoreBehavior;
  PublicBucketRestrictBehavior?: PublicBucketRestrictBehavior;
}
export const PublicAccessConfiguration = S.suspend(() =>
  S.Struct({
    PublicAclAccess: S.optional(PublicAccessStatus).pipe(
      T.JsonName("publicAclAccess"),
    ),
    PublicPolicyAccess: S.optional(PublicAccessStatus).pipe(
      T.JsonName("publicPolicyAccess"),
    ),
    PublicAclIgnoreBehavior: S.optional(PublicAclIgnoreBehavior).pipe(
      T.JsonName("publicAclIgnoreBehavior"),
    ),
    PublicBucketRestrictBehavior: S.optional(PublicBucketRestrictBehavior).pipe(
      T.JsonName("publicBucketRestrictBehavior"),
    ),
  }),
).annotations({
  identifier: "PublicAccessConfiguration",
}) as any as S.Schema<PublicAccessConfiguration>;
export interface DescribeMalwareScansResponse {
  Scans: Scan[];
  NextToken?: string;
}
export const DescribeMalwareScansResponse = S.suspend(() =>
  S.Struct({
    Scans: S.optional(Scans).pipe(T.JsonName("scans")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "DescribeMalwareScansResponse",
}) as any as S.Schema<DescribeMalwareScansResponse>;
export interface GetCoverageStatisticsResponse {
  CoverageStatistics?: CoverageStatistics;
}
export const GetCoverageStatisticsResponse = S.suspend(() =>
  S.Struct({
    CoverageStatistics: S.optional(CoverageStatistics)
      .pipe(T.JsonName("coverageStatistics"))
      .annotations({ identifier: "CoverageStatistics" }),
  }),
).annotations({
  identifier: "GetCoverageStatisticsResponse",
}) as any as S.Schema<GetCoverageStatisticsResponse>;
export interface PermissionConfiguration {
  BucketLevelPermissions?: BucketLevelPermissions;
  AccountLevelPermissions?: AccountLevelPermissions;
}
export const PermissionConfiguration = S.suspend(() =>
  S.Struct({
    BucketLevelPermissions: S.optional(BucketLevelPermissions)
      .pipe(T.JsonName("bucketLevelPermissions"))
      .annotations({ identifier: "BucketLevelPermissions" }),
    AccountLevelPermissions: S.optional(AccountLevelPermissions)
      .pipe(T.JsonName("accountLevelPermissions"))
      .annotations({ identifier: "AccountLevelPermissions" }),
  }),
).annotations({
  identifier: "PermissionConfiguration",
}) as any as S.Schema<PermissionConfiguration>;
export interface ThreatDetectedByName {
  ItemCount?: number;
  UniqueThreatNameCount?: number;
  Shortened?: boolean;
  ThreatNames?: ScanThreatName[];
}
export const ThreatDetectedByName = S.suspend(() =>
  S.Struct({
    ItemCount: S.optional(S.Number).pipe(T.JsonName("itemCount")),
    UniqueThreatNameCount: S.optional(S.Number).pipe(
      T.JsonName("uniqueThreatNameCount"),
    ),
    Shortened: S.optional(S.Boolean).pipe(T.JsonName("shortened")),
    ThreatNames: S.optional(ScanThreatNames).pipe(T.JsonName("threatNames")),
  }),
).annotations({
  identifier: "ThreatDetectedByName",
}) as any as S.Schema<ThreatDetectedByName>;
export interface AnomalyUnusual {
  Behavior?: { [key: string]: { [key: string]: AnomalyObject } };
}
export const AnomalyUnusual = S.suspend(() =>
  S.Struct({ Behavior: S.optional(Behavior).pipe(T.JsonName("behavior")) }),
).annotations({
  identifier: "AnomalyUnusual",
}) as any as S.Schema<AnomalyUnusual>;
export interface Actor {
  Id?: string;
  User?: User;
  Session?: Session;
  Process?: ActorProcess;
}
export const Actor = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    User: S.optional(User)
      .pipe(T.JsonName("user"))
      .annotations({ identifier: "User" }),
    Session: S.optional(Session)
      .pipe(T.JsonName("session"))
      .annotations({ identifier: "Session" }),
    Process: S.optional(ActorProcess)
      .pipe(T.JsonName("process"))
      .annotations({ identifier: "ActorProcess" }),
  }),
).annotations({ identifier: "Actor" }) as any as S.Schema<Actor>;
export type Actors = Actor[];
export const Actors = S.Array(Actor);
export interface ListCoverageResponse {
  Resources: CoverageResource[];
  NextToken?: string;
}
export const ListCoverageResponse = S.suspend(() =>
  S.Struct({
    Resources: S.optional(CoverageResources).pipe(T.JsonName("resources")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListCoverageResponse",
}) as any as S.Schema<ListCoverageResponse>;
export type AnomalyProfileFeatureObjects = AnomalyObject[];
export const AnomalyProfileFeatureObjects = S.Array(AnomalyObject);
export interface S3Bucket {
  OwnerId?: string;
  CreatedAt?: Date;
  EncryptionType?: string;
  EncryptionKeyArn?: string;
  EffectivePermission?: string;
  PublicReadAccess?: PublicAccessStatus;
  PublicWriteAccess?: PublicAccessStatus;
  AccountPublicAccess?: PublicAccessConfiguration;
  BucketPublicAccess?: PublicAccessConfiguration;
  S3ObjectUids?: string[];
}
export const S3Bucket = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String).pipe(T.JsonName("ownerId")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
    EncryptionKeyArn: S.optional(S.String).pipe(T.JsonName("encryptionKeyArn")),
    EffectivePermission: S.optional(S.String).pipe(
      T.JsonName("effectivePermission"),
    ),
    PublicReadAccess: S.optional(PublicAccessStatus).pipe(
      T.JsonName("publicReadAccess"),
    ),
    PublicWriteAccess: S.optional(PublicAccessStatus).pipe(
      T.JsonName("publicWriteAccess"),
    ),
    AccountPublicAccess: S.optional(PublicAccessConfiguration)
      .pipe(T.JsonName("accountPublicAccess"))
      .annotations({ identifier: "PublicAccessConfiguration" }),
    BucketPublicAccess: S.optional(PublicAccessConfiguration)
      .pipe(T.JsonName("bucketPublicAccess"))
      .annotations({ identifier: "PublicAccessConfiguration" }),
    S3ObjectUids: S.optional(S3ObjectUids).pipe(T.JsonName("s3ObjectUids")),
  }),
).annotations({ identifier: "S3Bucket" }) as any as S.Schema<S3Bucket>;
export interface PublicAccess {
  PermissionConfiguration?: PermissionConfiguration;
  EffectivePermission?: string;
}
export const PublicAccess = S.suspend(() =>
  S.Struct({
    PermissionConfiguration: S.optional(PermissionConfiguration)
      .pipe(T.JsonName("permissionConfiguration"))
      .annotations({ identifier: "PermissionConfiguration" }),
    EffectivePermission: S.optional(S.String).pipe(
      T.JsonName("effectivePermission"),
    ),
  }),
).annotations({ identifier: "PublicAccess" }) as any as S.Schema<PublicAccess>;
export interface ScanDetections {
  ScannedItemCount?: ScannedItemCount;
  ThreatsDetectedItemCount?: ThreatsDetectedItemCount;
  HighestSeverityThreatDetails?: HighestSeverityThreatDetails;
  ThreatDetectedByName?: ThreatDetectedByName;
}
export const ScanDetections = S.suspend(() =>
  S.Struct({
    ScannedItemCount: S.optional(ScannedItemCount)
      .pipe(T.JsonName("scannedItemCount"))
      .annotations({ identifier: "ScannedItemCount" }),
    ThreatsDetectedItemCount: S.optional(ThreatsDetectedItemCount)
      .pipe(T.JsonName("threatsDetectedItemCount"))
      .annotations({ identifier: "ThreatsDetectedItemCount" }),
    HighestSeverityThreatDetails: S.optional(HighestSeverityThreatDetails)
      .pipe(T.JsonName("highestSeverityThreatDetails"))
      .annotations({ identifier: "HighestSeverityThreatDetails" }),
    ThreatDetectedByName: S.optional(ThreatDetectedByName)
      .pipe(T.JsonName("threatDetectedByName"))
      .annotations({ identifier: "ThreatDetectedByName" }),
  }),
).annotations({
  identifier: "ScanDetections",
}) as any as S.Schema<ScanDetections>;
export type AnomalyProfileFeatures = { [key: string]: AnomalyObject[] };
export const AnomalyProfileFeatures = S.Record({
  key: S.String,
  value: AnomalyProfileFeatureObjects,
});
export interface ResourceData {
  S3Bucket?: S3Bucket;
  Ec2Instance?: Ec2Instance;
  AccessKey?: AccessKey;
  Ec2NetworkInterface?: Ec2NetworkInterface;
  S3Object?: S3Object;
  EksCluster?: EksCluster;
  KubernetesWorkload?: KubernetesWorkload;
  Container?: ContainerFindingResource;
  EcsCluster?: EcsCluster;
  EcsTask?: EcsTask;
  IamInstanceProfile?: IamInstanceProfileV2;
  AutoscalingAutoScalingGroup?: AutoscalingAutoScalingGroup;
  Ec2LaunchTemplate?: Ec2LaunchTemplate;
  Ec2Vpc?: Ec2Vpc;
  Ec2Image?: Ec2Image;
  CloudformationStack?: CloudformationStack;
}
export const ResourceData = S.suspend(() =>
  S.Struct({
    S3Bucket: S.optional(S3Bucket)
      .pipe(T.JsonName("s3Bucket"))
      .annotations({ identifier: "S3Bucket" }),
    Ec2Instance: S.optional(Ec2Instance)
      .pipe(T.JsonName("ec2Instance"))
      .annotations({ identifier: "Ec2Instance" }),
    AccessKey: S.optional(AccessKey)
      .pipe(T.JsonName("accessKey"))
      .annotations({ identifier: "AccessKey" }),
    Ec2NetworkInterface: S.optional(Ec2NetworkInterface)
      .pipe(T.JsonName("ec2NetworkInterface"))
      .annotations({ identifier: "Ec2NetworkInterface" }),
    S3Object: S.optional(S3Object)
      .pipe(T.JsonName("s3Object"))
      .annotations({ identifier: "S3Object" }),
    EksCluster: S.optional(EksCluster)
      .pipe(T.JsonName("eksCluster"))
      .annotations({ identifier: "EksCluster" }),
    KubernetesWorkload: S.optional(KubernetesWorkload)
      .pipe(T.JsonName("kubernetesWorkload"))
      .annotations({ identifier: "KubernetesWorkload" }),
    Container: S.optional(ContainerFindingResource)
      .pipe(T.JsonName("container"))
      .annotations({ identifier: "ContainerFindingResource" }),
    EcsCluster: S.optional(EcsCluster)
      .pipe(T.JsonName("ecsCluster"))
      .annotations({ identifier: "EcsCluster" }),
    EcsTask: S.optional(EcsTask)
      .pipe(T.JsonName("ecsTask"))
      .annotations({ identifier: "EcsTask" }),
    IamInstanceProfile: S.optional(IamInstanceProfileV2)
      .pipe(T.JsonName("iamInstanceProfile"))
      .annotations({ identifier: "IamInstanceProfileV2" }),
    AutoscalingAutoScalingGroup: S.optional(AutoscalingAutoScalingGroup)
      .pipe(T.JsonName("autoscalingAutoScalingGroup"))
      .annotations({ identifier: "AutoscalingAutoScalingGroup" }),
    Ec2LaunchTemplate: S.optional(Ec2LaunchTemplate)
      .pipe(T.JsonName("ec2LaunchTemplate"))
      .annotations({ identifier: "Ec2LaunchTemplate" }),
    Ec2Vpc: S.optional(Ec2Vpc)
      .pipe(T.JsonName("ec2Vpc"))
      .annotations({ identifier: "Ec2Vpc" }),
    Ec2Image: S.optional(Ec2Image)
      .pipe(T.JsonName("ec2Image"))
      .annotations({ identifier: "Ec2Image" }),
    CloudformationStack: S.optional(CloudformationStack)
      .pipe(T.JsonName("cloudformationStack"))
      .annotations({ identifier: "CloudformationStack" }),
  }),
).annotations({ identifier: "ResourceData" }) as any as S.Schema<ResourceData>;
export interface S3BucketDetail {
  Arn?: string;
  Name?: string;
  Type?: string;
  CreatedAt?: Date;
  Owner?: Owner;
  Tags?: Tag[];
  DefaultServerSideEncryption?: DefaultServerSideEncryption;
  PublicAccess?: PublicAccess;
  S3ObjectDetails?: S3ObjectDetail[];
}
export const S3BucketDetail = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    Owner: S.optional(Owner)
      .pipe(T.JsonName("owner"))
      .annotations({ identifier: "Owner" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    DefaultServerSideEncryption: S.optional(DefaultServerSideEncryption)
      .pipe(T.JsonName("defaultServerSideEncryption"))
      .annotations({ identifier: "DefaultServerSideEncryption" }),
    PublicAccess: S.optional(PublicAccess)
      .pipe(T.JsonName("publicAccess"))
      .annotations({ identifier: "PublicAccess" }),
    S3ObjectDetails: S.optional(S3ObjectDetails).pipe(
      T.JsonName("s3ObjectDetails"),
    ),
  }),
).annotations({
  identifier: "S3BucketDetail",
}) as any as S.Schema<S3BucketDetail>;
export type S3BucketDetails = S3BucketDetail[];
export const S3BucketDetails = S.Array(S3BucketDetail);
export interface EbsVolumeScanDetails {
  ScanId?: string;
  ScanStartedAt?: Date;
  ScanCompletedAt?: Date;
  TriggerFindingId?: string;
  Sources?: string[];
  ScanDetections?: ScanDetections;
  ScanType?: ScanType;
}
export const EbsVolumeScanDetails = S.suspend(() =>
  S.Struct({
    ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
    ScanStartedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("scanStartedAt")),
    ScanCompletedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("scanCompletedAt")),
    TriggerFindingId: S.optional(S.String).pipe(T.JsonName("triggerFindingId")),
    Sources: S.optional(Sources).pipe(T.JsonName("sources")),
    ScanDetections: S.optional(ScanDetections)
      .pipe(T.JsonName("scanDetections"))
      .annotations({ identifier: "ScanDetections" }),
    ScanType: S.optional(ScanType).pipe(T.JsonName("scanType")),
  }),
).annotations({
  identifier: "EbsVolumeScanDetails",
}) as any as S.Schema<EbsVolumeScanDetails>;
export type AnomalyProfiles = {
  [key: string]: { [key: string]: AnomalyObject[] };
};
export const AnomalyProfiles = S.Record({
  key: S.String,
  value: AnomalyProfileFeatures,
});
export interface ResourceV2 {
  Uid?: string;
  Name?: string;
  AccountId?: string;
  ResourceType?: FindingResourceType;
  Region?: string;
  Service?: string;
  CloudPartition?: string;
  Tags?: Tag[];
  Data?: ResourceData;
}
export const ResourceV2 = S.suspend(() =>
  S.Struct({
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    ResourceType: S.optional(FindingResourceType).pipe(
      T.JsonName("resourceType"),
    ),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
    Service: S.optional(S.String).pipe(T.JsonName("service")),
    CloudPartition: S.optional(S.String).pipe(T.JsonName("cloudPartition")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Data: S.optional(ResourceData)
      .pipe(T.JsonName("data"))
      .annotations({ identifier: "ResourceData" }),
  }),
).annotations({ identifier: "ResourceV2" }) as any as S.Schema<ResourceV2>;
export type Resources = ResourceV2[];
export const Resources = S.Array(ResourceV2);
export interface Resource {
  AccessKeyDetails?: AccessKeyDetails;
  S3BucketDetails?: S3BucketDetail[];
  InstanceDetails?: InstanceDetails;
  EksClusterDetails?: EksClusterDetails;
  KubernetesDetails?: KubernetesDetails;
  ResourceType?: string;
  EbsVolumeDetails?: EbsVolumeDetails;
  EcsClusterDetails?: EcsClusterDetails;
  ContainerDetails?: Container;
  RdsDbInstanceDetails?: RdsDbInstanceDetails;
  RdsLimitlessDbDetails?: RdsLimitlessDbDetails;
  RdsDbUserDetails?: RdsDbUserDetails;
  LambdaDetails?: LambdaDetails;
  EbsSnapshotDetails?: EbsSnapshotDetails;
  Ec2ImageDetails?: Ec2ImageDetails;
  RecoveryPointDetails?: RecoveryPointDetails;
}
export const Resource = S.suspend(() =>
  S.Struct({
    AccessKeyDetails: S.optional(AccessKeyDetails)
      .pipe(T.JsonName("accessKeyDetails"))
      .annotations({ identifier: "AccessKeyDetails" }),
    S3BucketDetails: S.optional(S3BucketDetails).pipe(
      T.JsonName("s3BucketDetails"),
    ),
    InstanceDetails: S.optional(InstanceDetails)
      .pipe(T.JsonName("instanceDetails"))
      .annotations({ identifier: "InstanceDetails" }),
    EksClusterDetails: S.optional(EksClusterDetails)
      .pipe(T.JsonName("eksClusterDetails"))
      .annotations({ identifier: "EksClusterDetails" }),
    KubernetesDetails: S.optional(KubernetesDetails)
      .pipe(T.JsonName("kubernetesDetails"))
      .annotations({ identifier: "KubernetesDetails" }),
    ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
    EbsVolumeDetails: S.optional(EbsVolumeDetails)
      .pipe(T.JsonName("ebsVolumeDetails"))
      .annotations({ identifier: "EbsVolumeDetails" }),
    EcsClusterDetails: S.optional(EcsClusterDetails)
      .pipe(T.JsonName("ecsClusterDetails"))
      .annotations({ identifier: "EcsClusterDetails" }),
    ContainerDetails: S.optional(Container)
      .pipe(T.JsonName("containerDetails"))
      .annotations({ identifier: "Container" }),
    RdsDbInstanceDetails: S.optional(RdsDbInstanceDetails)
      .pipe(T.JsonName("rdsDbInstanceDetails"))
      .annotations({ identifier: "RdsDbInstanceDetails" }),
    RdsLimitlessDbDetails: S.optional(RdsLimitlessDbDetails)
      .pipe(T.JsonName("rdsLimitlessDbDetails"))
      .annotations({ identifier: "RdsLimitlessDbDetails" }),
    RdsDbUserDetails: S.optional(RdsDbUserDetails)
      .pipe(T.JsonName("rdsDbUserDetails"))
      .annotations({ identifier: "RdsDbUserDetails" }),
    LambdaDetails: S.optional(LambdaDetails)
      .pipe(T.JsonName("lambdaDetails"))
      .annotations({ identifier: "LambdaDetails" }),
    EbsSnapshotDetails: S.optional(EbsSnapshotDetails)
      .pipe(T.JsonName("ebsSnapshotDetails"))
      .annotations({ identifier: "EbsSnapshotDetails" }),
    Ec2ImageDetails: S.optional(Ec2ImageDetails)
      .pipe(T.JsonName("ec2ImageDetails"))
      .annotations({ identifier: "Ec2ImageDetails" }),
    RecoveryPointDetails: S.optional(RecoveryPointDetails)
      .pipe(T.JsonName("recoveryPointDetails"))
      .annotations({ identifier: "RecoveryPointDetails" }),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export interface Anomaly {
  Profiles?: { [key: string]: { [key: string]: AnomalyObject[] } };
  Unusual?: AnomalyUnusual;
}
export const Anomaly = S.suspend(() =>
  S.Struct({
    Profiles: S.optional(AnomalyProfiles).pipe(T.JsonName("profiles")),
    Unusual: S.optional(AnomalyUnusual)
      .pipe(T.JsonName("unusual"))
      .annotations({ identifier: "AnomalyUnusual" }),
  }),
).annotations({ identifier: "Anomaly" }) as any as S.Schema<Anomaly>;
export interface Sequence {
  Uid?: string;
  Description?: string;
  Actors?: Actor[];
  Resources?: ResourceV2[];
  Endpoints?: NetworkEndpoint[];
  Signals?: Signal[];
  SequenceIndicators?: Indicator[];
  AdditionalSequenceTypes?: string[];
}
export const Sequence = S.suspend(() =>
  S.Struct({
    Uid: S.optional(S.String).pipe(T.JsonName("uid")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Actors: S.optional(Actors).pipe(T.JsonName("actors")),
    Resources: S.optional(Resources).pipe(T.JsonName("resources")),
    Endpoints: S.optional(NetworkEndpoints).pipe(T.JsonName("endpoints")),
    Signals: S.optional(Signals).pipe(T.JsonName("signals")),
    SequenceIndicators: S.optional(Indicators).pipe(
      T.JsonName("sequenceIndicators"),
    ),
    AdditionalSequenceTypes: S.optional(AdditionalSequenceTypes).pipe(
      T.JsonName("additionalSequenceTypes"),
    ),
  }),
).annotations({ identifier: "Sequence" }) as any as S.Schema<Sequence>;
export interface Detection {
  Anomaly?: Anomaly;
  Sequence?: Sequence;
}
export const Detection = S.suspend(() =>
  S.Struct({
    Anomaly: S.optional(Anomaly)
      .pipe(T.JsonName("anomaly"))
      .annotations({ identifier: "Anomaly" }),
    Sequence: S.optional(Sequence)
      .pipe(T.JsonName("sequence"))
      .annotations({ identifier: "Sequence" }),
  }),
).annotations({ identifier: "Detection" }) as any as S.Schema<Detection>;
export interface Service {
  Action?: Action;
  Evidence?: Evidence;
  Archived?: boolean;
  Count?: number;
  DetectorId?: string;
  EventFirstSeen?: string;
  EventLastSeen?: string;
  ResourceRole?: string;
  ServiceName?: string;
  UserFeedback?: string;
  AdditionalInfo?: ServiceAdditionalInfo;
  FeatureName?: string;
  EbsVolumeScanDetails?: EbsVolumeScanDetails;
  RuntimeDetails?: RuntimeDetails;
  Detection?: Detection;
  MalwareScanDetails?: MalwareScanDetails;
}
export const Service = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action)
      .pipe(T.JsonName("action"))
      .annotations({ identifier: "Action" }),
    Evidence: S.optional(Evidence)
      .pipe(T.JsonName("evidence"))
      .annotations({ identifier: "Evidence" }),
    Archived: S.optional(S.Boolean).pipe(T.JsonName("archived")),
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
    DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
    EventFirstSeen: S.optional(S.String).pipe(T.JsonName("eventFirstSeen")),
    EventLastSeen: S.optional(S.String).pipe(T.JsonName("eventLastSeen")),
    ResourceRole: S.optional(S.String).pipe(T.JsonName("resourceRole")),
    ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
    UserFeedback: S.optional(S.String).pipe(T.JsonName("userFeedback")),
    AdditionalInfo: S.optional(ServiceAdditionalInfo)
      .pipe(T.JsonName("additionalInfo"))
      .annotations({ identifier: "ServiceAdditionalInfo" }),
    FeatureName: S.optional(S.String).pipe(T.JsonName("featureName")),
    EbsVolumeScanDetails: S.optional(EbsVolumeScanDetails)
      .pipe(T.JsonName("ebsVolumeScanDetails"))
      .annotations({ identifier: "EbsVolumeScanDetails" }),
    RuntimeDetails: S.optional(RuntimeDetails)
      .pipe(T.JsonName("runtimeDetails"))
      .annotations({ identifier: "RuntimeDetails" }),
    Detection: S.optional(Detection)
      .pipe(T.JsonName("detection"))
      .annotations({ identifier: "Detection" }),
    MalwareScanDetails: S.optional(MalwareScanDetails)
      .pipe(T.JsonName("malwareScanDetails"))
      .annotations({ identifier: "MalwareScanDetails" }),
  }),
).annotations({ identifier: "Service" }) as any as S.Schema<Service>;
export interface Finding {
  AccountId?: string;
  Arn?: string;
  Confidence?: number;
  CreatedAt?: string;
  Description?: string;
  Id?: string;
  Partition?: string;
  Region?: string;
  Resource?: Resource;
  SchemaVersion?: string;
  Service?: Service;
  Severity?: number;
  Title?: string;
  Type?: string;
  UpdatedAt?: string;
  AssociatedAttackSequenceArn?: string;
}
export const Finding = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Confidence: S.optional(S.Number).pipe(T.JsonName("confidence")),
    CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Partition: S.optional(S.String).pipe(T.JsonName("partition")),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
    Resource: S.optional(Resource)
      .pipe(T.JsonName("resource"))
      .annotations({ identifier: "Resource" }),
    SchemaVersion: S.optional(S.String).pipe(T.JsonName("schemaVersion")),
    Service: S.optional(Service)
      .pipe(T.JsonName("service"))
      .annotations({ identifier: "Service" }),
    Severity: S.optional(S.Number).pipe(T.JsonName("severity")),
    Title: S.optional(S.String).pipe(T.JsonName("title")),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
    UpdatedAt: S.optional(S.String).pipe(T.JsonName("updatedAt")),
    AssociatedAttackSequenceArn: S.optional(S.String).pipe(
      T.JsonName("associatedAttackSequenceArn"),
    ),
  }),
).annotations({ identifier: "Finding" }) as any as S.Schema<Finding>;
export type Findings = Finding[];
export const Findings = S.Array(Finding);
export interface GetFindingsResponse {
  Findings: (Finding & {
    AccountId: string;
    Arn: string;
    CreatedAt: string;
    Id: string;
    Region: string;
    Resource: Resource;
    SchemaVersion: string;
    Severity: number;
    Type: FindingType;
    UpdatedAt: string;
    Service: Service & {
      Detection: Detection & {
        Sequence: Sequence & {
          Uid: string;
          Description: SequenceDescription;
          Signals: (Signal & {
            Uid: string;
            Type: SignalType;
            Name: string;
            CreatedAt: Date;
            UpdatedAt: Date;
            FirstSeenAt: Date;
            LastSeenAt: Date;
            Count: number;
            SignalIndicators: (Indicator & { Key: IndicatorType })[];
          })[];
          Actors: (Actor & {
            Id: string;
            User: User & {
              Name: string;
              Uid: string;
              Type: string;
              Account: Account & { Uid: string };
            };
            Process: ActorProcess & { Name: ProcessName; Path: ProcessPath };
          })[];
          Resources: (ResourceV2 & {
            Uid: string;
            ResourceType: FindingResourceType;
            Data: ResourceData & {
              Container: ContainerFindingResource & { Image: string };
            };
          })[];
          Endpoints: (NetworkEndpoint & {
            Id: string;
            Location: NetworkGeoLocation & {
              City: string;
              Country: string;
              Latitude: number;
              Longitude: number;
            };
            AutonomousSystem: AutonomousSystem & {
              Name: string;
              Number: number;
            };
            Connection: NetworkConnection & { Direction: NetworkDirection };
          })[];
          SequenceIndicators: (Indicator & { Key: IndicatorType })[];
        };
      };
      MalwareScanDetails: MalwareScanDetails & {
        ScanConfiguration: MalwareProtectionFindingsScanConfiguration & {
          IncrementalScanDetails: IncrementalScanDetails & {
            BaselineResourceArn: NonEmptyString;
          };
        };
      };
    };
  })[];
}
export const GetFindingsResponse = S.suspend(() =>
  S.Struct({ Findings: S.optional(Findings).pipe(T.JsonName("findings")) }),
).annotations({
  identifier: "GetFindingsResponse",
}) as any as S.Schema<GetFindingsResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
).pipe(C.withAuthError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Accepts the invitation to be a member account and get monitored by a GuardDuty
 * administrator account that sent the invitation.
 */
export const acceptAdministratorInvitation: (
  input: AcceptAdministratorInvitationRequest,
) => effect.Effect<
  AcceptAdministratorInvitationResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptAdministratorInvitationRequest,
  output: AcceptAdministratorInvitationResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Creates member accounts of the current Amazon Web Services account by specifying a list of Amazon Web Services account
 * IDs. This step is a prerequisite for managing the associated member accounts either by
 * invitation or through an organization.
 *
 * As a delegated administrator, using `CreateMembers` will enable GuardDuty in
 * the added member accounts, with the exception of the
 * organization delegated administrator account. A delegated administrator must enable GuardDuty
 * prior to being added as a member.
 *
 * When you use CreateMembers as an Organizations delegated
 * administrator, GuardDuty applies your organization's auto-enable settings to the member
 * accounts in this request, irrespective of the accounts being new or existing members. For
 * more information about the existing auto-enable settings for your organization, see
 * DescribeOrganizationConfiguration.
 *
 * If you disassociate a member account that was added by invitation, the member account details
 * obtained from this API, including the associated email addresses, will be retained.
 * This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * When the member accounts added through Organizations are later disassociated, you (administrator)
 * can't invite them by calling the InviteMembers API. You can create an association with these
 * member accounts again only by calling the CreateMembers API.
 */
export const createMembers: (
  input: CreateMembersRequest,
) => effect.Effect<
  CreateMembersResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMembersRequest,
  output: CreateMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Creates a publishing destination where you can export your GuardDuty findings. Before you start exporting the
 * findings, the destination resource must exist.
 */
export const createPublishingDestination: (
  input: CreatePublishingDestinationRequest,
) => effect.Effect<
  CreatePublishingDestinationResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePublishingDestinationRequest,
  output: CreatePublishingDestinationResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Declines invitations sent to the current member account by Amazon Web Services accounts specified by
 * their account IDs.
 */
export const declineInvitations: (
  input: DeclineInvitationsRequest,
) => effect.Effect<
  DeclineInvitationsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeclineInvitationsRequest,
  output: DeclineInvitationsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Provides the details of the GuardDuty administrator account associated with the current
 * GuardDuty member account.
 *
 * Based on the type of account that runs this API, the following list shows how the API behavior varies:
 *
 * - When the GuardDuty administrator account runs this API, it will return success (`HTTP 200`) but no content.
 *
 * - When a member account runs this API, it will return the details of the GuardDuty administrator account that is associated
 * with this calling member account.
 *
 * - When an individual account (not associated with an organization) runs this API, it will return success (`HTTP 200`)
 * but no content.
 */
export const getAdministratorAccount: (
  input: GetAdministratorAccountRequest,
) => effect.Effect<
  GetAdministratorAccountResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAdministratorAccountRequest,
  output: GetAdministratorAccountResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Provides the details for the GuardDuty administrator account associated with the current
 * GuardDuty member account.
 */
export const getMasterAccount: (
  input: GetMasterAccountRequest,
) => effect.Effect<
  GetMasterAccountResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMasterAccountRequest,
  output: GetMasterAccountResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves GuardDuty member accounts (of the current GuardDuty administrator account)
 * specified by the account IDs.
 */
export const getMembers: (
  input: GetMembersRequest,
) => effect.Effect<
  GetMembersResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMembersRequest,
  output: GetMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Lists all GuardDuty membership invitations that were sent to the current Amazon Web Services
 * account.
 */
export const listInvitations: {
  (
    input: ListInvitationsRequest,
  ): effect.Effect<
    ListInvitationsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvitationsRequest,
  ) => stream.Stream<
    ListInvitationsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvitationsRequest,
  ) => stream.Stream<
    Invitation,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInvitationsRequest,
  output: ListInvitationsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Invitations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the Malware Protection plan IDs associated with the protected
 * resources in your Amazon Web Services account.
 */
export const listMalwareProtectionPlans: (
  input: ListMalwareProtectionPlansRequest,
) => effect.Effect<
  ListMalwareProtectionPlansResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMalwareProtectionPlansRequest,
  output: ListMalwareProtectionPlansResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Lists the accounts designated as GuardDuty delegated administrators.
 * Only the organization's management account can run this
 * API operation.
 */
export const listOrganizationAdminAccounts: {
  (
    input: ListOrganizationAdminAccountsRequest,
  ): effect.Effect<
    ListOrganizationAdminAccountsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationAdminAccountsRequest,
  ) => stream.Stream<
    ListOrganizationAdminAccountsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationAdminAccountsRequest,
  ) => stream.Stream<
    AdminAccount,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOrganizationAdminAccountsRequest,
  output: ListOrganizationAdminAccountsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AdminAccounts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of publishing destinations associated with the specified
 * `detectorId`.
 */
export const listPublishingDestinations: {
  (
    input: ListPublishingDestinationsRequest,
  ): effect.Effect<
    ListPublishingDestinationsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPublishingDestinationsRequest,
  ) => stream.Stream<
    ListPublishingDestinationsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPublishingDestinationsRequest,
  ) => stream.Stream<
    unknown,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPublishingDestinationsRequest,
  output: ListPublishingDestinationsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a new threat entity set. In a threat entity set, you can provide known malicious
 * IP addresses and domains for your Amazon Web Services environment.
 * GuardDuty generates findings based on the entries in the threat entity sets.
 * Only users of the administrator account can manage entity sets, which automatically apply
 * to member accounts.
 */
export const createThreatEntitySet: (
  input: CreateThreatEntitySetRequest,
) => effect.Effect<
  CreateThreatEntitySetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThreatEntitySetRequest,
  output: CreateThreatEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Creates a new trusted entity set. In the trusted entity set, you can provide IP addresses
 * and domains that you believe are secure for communication in your Amazon Web Services environment. GuardDuty
 * will not generate findings for the entries that are specified in a trusted entity set. At any
 * given time, you can have only one trusted entity set.
 *
 * Only users of the administrator account can manage the entity sets, which automatically
 * apply to member accounts.
 */
export const createTrustedEntitySet: (
  input: CreateTrustedEntitySetRequest,
) => effect.Effect<
  CreateTrustedEntitySetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrustedEntitySetRequest,
  output: CreateTrustedEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes invitations sent to the current member account by Amazon Web Services accounts specified by
 * their account IDs.
 */
export const deleteInvitations: (
  input: DeleteInvitationsRequest,
) => effect.Effect<
  DeleteInvitationsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInvitationsRequest,
  output: DeleteInvitationsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes GuardDuty member accounts (to the current GuardDuty administrator account)
 * specified by the account IDs.
 *
 * With `autoEnableOrganizationMembers` configuration for your organization set to
 * `ALL`, you'll receive an error if you attempt to disable GuardDuty for a member
 * account in your organization.
 */
export const deleteMembers: (
  input: DeleteMembersRequest,
) => effect.Effect<
  DeleteMembersResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMembersRequest,
  output: DeleteMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns information about the publishing destination specified by the provided
 * `destinationId`.
 */
export const describePublishingDestination: (
  input: DescribePublishingDestinationRequest,
) => effect.Effect<
  DescribePublishingDestinationResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePublishingDestinationRequest,
  output: DescribePublishingDestinationResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Disassociates GuardDuty member accounts (from the current administrator account) specified
 * by the account IDs.
 *
 * When you
 * disassociate an invited member from a GuardDuty delegated administrator, the member account details
 * obtained from the CreateMembers API, including the associated email addresses, are retained. This is
 * done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * With `autoEnableOrganizationMembers` configuration for your organization set to
 * `ALL`, you'll receive an error if you attempt to disassociate a member account
 * before removing them from your organization.
 *
 * If you disassociate a member account that was added by invitation, the member account details
 * obtained from this API, including the associated email addresses, will be retained.
 * This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * When the member accounts added through Organizations are later disassociated, you (administrator)
 * can't invite them by calling the InviteMembers API. You can create an association with these
 * member accounts again only by calling the CreateMembers API.
 */
export const disassociateMembers: (
  input: DisassociateMembersRequest,
) => effect.Effect<
  DisassociateMembersResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMembersRequest,
  output: DisassociateMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns the details of the filter specified by the filter name.
 */
export const getFilter: (
  input: GetFilterRequest,
) => effect.Effect<
  GetFilterResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFilterRequest,
  output: GetFilterResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the IPSet specified by the `ipSetId`.
 */
export const getIPSet: (
  input: GetIPSetRequest,
) => effect.Effect<
  GetIPSetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIPSetRequest,
  output: GetIPSetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns the details of the malware scan settings.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const getMalwareScanSettings: (
  input: GetMalwareScanSettingsRequest,
) => effect.Effect<
  GetMalwareScanSettingsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMalwareScanSettingsRequest,
  output: GetMalwareScanSettingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the threat entity set associated with the specified `threatEntitySetId`.
 */
export const getThreatEntitySet: (
  input: GetThreatEntitySetRequest,
) => effect.Effect<
  GetThreatEntitySetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThreatEntitySetRequest,
  output: GetThreatEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the ThreatIntelSet that is specified by the ThreatIntelSet ID.
 */
export const getThreatIntelSet: (
  input: GetThreatIntelSetRequest,
) => effect.Effect<
  GetThreatIntelSetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThreatIntelSetRequest,
  output: GetThreatIntelSetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the trusted entity set associated with the specified `trustedEntitySetId`.
 */
export const getTrustedEntitySet: (
  input: GetTrustedEntitySetRequest,
) => effect.Effect<
  GetTrustedEntitySetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrustedEntitySetRequest,
  output: GetTrustedEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Invites Amazon Web Services accounts to become members of an organization administered by the Amazon Web Services account
 * that invokes this API. If you are using Amazon Web Services Organizations to manage your GuardDuty environment, this step is not
 * needed. For more information, see Managing accounts with organizations.
 *
 * To invite Amazon Web Services accounts, the first step is
 * to ensure that GuardDuty has been enabled in the potential member accounts. You can now invoke this API
 * to add accounts by invitation. The
 * invited accounts can either accept or decline the invitation from their GuardDuty accounts. Each invited Amazon Web Services account can
 * choose to accept the invitation from only one Amazon Web Services account. For more information, see
 * Managing GuardDuty accounts
 * by invitation.
 *
 * After the invite has been accepted and you choose to disassociate a member account
 * (by using DisassociateMembers) from your account,
 * the details of the member account obtained by invoking CreateMembers, including the
 * associated email addresses, will be retained.
 * This is done so that you can invoke InviteMembers without the need to invoke
 * CreateMembers again. To
 * remove the details associated with a member account, you must also invoke
 * DeleteMembers.
 *
 * If you disassociate a member account that was added by invitation, the member account details
 * obtained from this API, including the associated email addresses, will be retained.
 * This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * When the member accounts added through Organizations are later disassociated, you (administrator)
 * can't invite them by calling the InviteMembers API. You can create an association with these
 * member accounts again only by calling the CreateMembers API.
 */
export const inviteMembers: (
  input: InviteMembersRequest,
) => effect.Effect<
  InviteMembersResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InviteMembersRequest,
  output: InviteMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Lists detectorIds of all the existing Amazon GuardDuty detector resources.
 */
export const listDetectors: {
  (
    input: ListDetectorsRequest,
  ): effect.Effect<
    ListDetectorsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDetectorsRequest,
  ) => stream.Stream<
    ListDetectorsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDetectorsRequest,
  ) => stream.Stream<
    DetectorId,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDetectorsRequest,
  output: ListDetectorsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DetectorIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of the current filters.
 */
export const listFilters: {
  (
    input: ListFiltersRequest,
  ): effect.Effect<
    ListFiltersResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFiltersRequest,
  ) => stream.Stream<
    ListFiltersResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFiltersRequest,
  ) => stream.Stream<
    FilterName,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFiltersRequest,
  output: ListFiltersResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "FilterNames",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists GuardDuty findings for the specified detector ID.
 *
 * There might be regional differences because some flags might not be available in all the Regions where GuardDuty
 * is currently supported. For more information, see Regions and endpoints.
 */
export const listFindings: {
  (
    input: ListFindingsRequest,
  ): effect.Effect<
    ListFindingsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFindingsRequest,
  ) => stream.Stream<
    ListFindingsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFindingsRequest,
  ) => stream.Stream<
    FindingId,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFindingsRequest,
  output: ListFindingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "FindingIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the IPSets of the GuardDuty service specified by the detector ID. If you use this
 * operation from a member account, the IPSets returned are the IPSets from the associated
 * administrator account.
 */
export const listIPSets: {
  (
    input: ListIPSetsRequest,
  ): effect.Effect<
    ListIPSetsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIPSetsRequest,
  ) => stream.Stream<
    ListIPSetsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIPSetsRequest,
  ) => stream.Stream<
    string,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIPSetsRequest,
  output: ListIPSetsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "IpSetIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists details about all member accounts for the current GuardDuty administrator
 * account.
 */
export const listMembers: {
  (
    input: ListMembersRequest,
  ): effect.Effect<
    ListMembersResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMembersRequest,
  ) => stream.Stream<
    ListMembersResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMembersRequest,
  ) => stream.Stream<
    Member,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMembersRequest,
  output: ListMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Members",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists tags for a resource. Tagging is currently supported for detectors, finding filters,
 * IP sets, threat intel sets, and publishing destination, with a limit of 50 tags per resource.
 * When invoked, this
 * operation returns all assigned tags for a given resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Lists the threat entity sets associated with the specified GuardDuty detector ID. If you use this
 * operation from a member account, the threat entity sets that are returned as a response, belong to the
 * administrator account.
 */
export const listThreatEntitySets: {
  (
    input: ListThreatEntitySetsRequest,
  ): effect.Effect<
    ListThreatEntitySetsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThreatEntitySetsRequest,
  ) => stream.Stream<
    ListThreatEntitySetsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThreatEntitySetsRequest,
  ) => stream.Stream<
    string,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThreatEntitySetsRequest,
  output: ListThreatEntitySetsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ThreatEntitySetIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the ThreatIntelSets of the GuardDuty service specified by the detector ID. If you
 * use this operation from a member account, the ThreatIntelSets associated with the
 * administrator account are returned.
 */
export const listThreatIntelSets: {
  (
    input: ListThreatIntelSetsRequest,
  ): effect.Effect<
    ListThreatIntelSetsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThreatIntelSetsRequest,
  ) => stream.Stream<
    ListThreatIntelSetsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThreatIntelSetsRequest,
  ) => stream.Stream<
    string,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThreatIntelSetsRequest,
  output: ListThreatIntelSetsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ThreatIntelSetIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the trusted entity sets associated with the specified GuardDuty detector ID. If you use this
 * operation from a member account, the trusted entity sets that are returned as a response, belong to the
 * administrator account.
 */
export const listTrustedEntitySets: {
  (
    input: ListTrustedEntitySetsRequest,
  ): effect.Effect<
    ListTrustedEntitySetsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrustedEntitySetsRequest,
  ) => stream.Stream<
    ListTrustedEntitySetsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrustedEntitySetsRequest,
  ) => stream.Stream<
    string,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTrustedEntitySetsRequest,
  output: ListTrustedEntitySetsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TrustedEntitySetIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Initiates a malware scan for a specific S3 object. This API allows you to perform on-demand malware scanning of individual objects in S3 buckets that have Malware Protection for S3 enabled.
 *
 * When you use this API, the Amazon Web Services service terms for GuardDuty Malware
 * Protection apply. For more information, see Amazon Web Services service terms for GuardDuty Malware Protection.
 */
export const sendObjectMalwareScan: (
  input: SendObjectMalwareScanRequest,
) => effect.Effect<
  SendObjectMalwareScanResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendObjectMalwareScanRequest,
  output: SendObjectMalwareScanResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Turns on GuardDuty monitoring of the specified member accounts. Use this operation to
 * restart monitoring of accounts that you stopped monitoring with the StopMonitoringMembers operation.
 */
export const startMonitoringMembers: (
  input: StartMonitoringMembersRequest,
) => effect.Effect<
  StartMonitoringMembersResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMonitoringMembersRequest,
  output: StartMonitoringMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Stops GuardDuty monitoring for the specified member accounts. Use the
 * `StartMonitoringMembers` operation to restart monitoring for those
 * accounts.
 *
 * With `autoEnableOrganizationMembers` configuration for your organization set to
 * `ALL`, you'll receive an error if you attempt to stop monitoring the member
 * accounts in your organization.
 */
export const stopMonitoringMembers: (
  input: StopMonitoringMembersRequest,
) => effect.Effect<
  StopMonitoringMembersResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopMonitoringMembersRequest,
  output: StopMonitoringMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Updates the filter specified by the filter name.
 */
export const updateFilter: (
  input: UpdateFilterRequest,
) => effect.Effect<
  UpdateFilterResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFilterRequest,
  output: UpdateFilterResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Accepts the invitation to be monitored by a GuardDuty administrator account.
 */
export const acceptInvitation: (
  input: AcceptInvitationRequest,
) => effect.Effect<
  AcceptInvitationResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptInvitationRequest,
  output: AcceptInvitationResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Archives GuardDuty findings that are specified by the list of finding IDs.
 *
 * Only the administrator account can archive findings. Member accounts don't have
 * permission to archive findings from their accounts.
 */
export const archiveFindings: (
  input: ArchiveFindingsRequest,
) => effect.Effect<
  ArchiveFindingsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ArchiveFindingsRequest,
  output: ArchiveFindingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Generates sample findings of types specified by the list of finding types. If 'NULL' is
 * specified for `findingTypes`, the API generates sample findings of all supported
 * finding types.
 */
export const createSampleFindings: (
  input: CreateSampleFindingsRequest,
) => effect.Effect<
  CreateSampleFindingsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSampleFindingsRequest,
  output: CreateSampleFindingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes an Amazon GuardDuty detector that is specified by the detector ID.
 */
export const deleteDetector: (
  input: DeleteDetectorRequest,
) => effect.Effect<
  DeleteDetectorResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDetectorRequest,
  output: DeleteDetectorResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes the filter specified by the filter name.
 */
export const deleteFilter: (
  input: DeleteFilterRequest,
) => effect.Effect<
  DeleteFilterResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFilterRequest,
  output: DeleteFilterResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes the IPSet specified by the `ipSetId`. IPSets are called trusted IP
 * lists in the console user interface.
 */
export const deleteIPSet: (
  input: DeleteIPSetRequest,
) => effect.Effect<
  DeleteIPSetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIPSetRequest,
  output: DeleteIPSetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes the publishing definition with the specified `destinationId`.
 */
export const deletePublishingDestination: (
  input: DeletePublishingDestinationRequest,
) => effect.Effect<
  DeletePublishingDestinationResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePublishingDestinationRequest,
  output: DeletePublishingDestinationResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes the threat entity set that is associated with the specified
 * `threatEntitySetId`.
 */
export const deleteThreatEntitySet: (
  input: DeleteThreatEntitySetRequest,
) => effect.Effect<
  DeleteThreatEntitySetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThreatEntitySetRequest,
  output: DeleteThreatEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes the ThreatIntelSet specified by the ThreatIntelSet ID.
 */
export const deleteThreatIntelSet: (
  input: DeleteThreatIntelSetRequest,
) => effect.Effect<
  DeleteThreatIntelSetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThreatIntelSetRequest,
  output: DeleteThreatIntelSetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes the trusted entity set that is associated with the specified
 * `trustedEntitySetId`.
 */
export const deleteTrustedEntitySet: (
  input: DeleteTrustedEntitySetRequest,
) => effect.Effect<
  DeleteTrustedEntitySetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrustedEntitySetRequest,
  output: DeleteTrustedEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Removes the existing GuardDuty delegated
 * administrator of the organization. Only the organization's management account can run this
 * API operation.
 */
export const disableOrganizationAdminAccount: (
  input: DisableOrganizationAdminAccountRequest,
) => effect.Effect<
  DisableOrganizationAdminAccountResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableOrganizationAdminAccountRequest,
  output: DisableOrganizationAdminAccountResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Disassociates the current GuardDuty member account from its administrator account.
 *
 * When you
 * disassociate an invited member from a GuardDuty delegated administrator, the member account details
 * obtained from the CreateMembers API, including the associated email addresses, are retained. This is
 * done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * With `autoEnableOrganizationMembers` configuration for your organization set to
 * `ALL`, you'll receive an error if you attempt to disable GuardDuty in a member
 * account.
 */
export const disassociateFromAdministratorAccount: (
  input: DisassociateFromAdministratorAccountRequest,
) => effect.Effect<
  DisassociateFromAdministratorAccountResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFromAdministratorAccountRequest,
  output: DisassociateFromAdministratorAccountResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Disassociates the current GuardDuty member account from its administrator account.
 *
 * When you
 * disassociate an invited member from a GuardDuty delegated administrator, the member account details
 * obtained from the CreateMembers API, including the associated email addresses, are retained. This is
 * done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 */
export const disassociateFromMasterAccount: (
  input: DisassociateFromMasterAccountRequest,
) => effect.Effect<
  DisassociateFromMasterAccountResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFromMasterAccountRequest,
  output: DisassociateFromMasterAccountResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Designates an Amazon Web Services account within the organization as your GuardDuty delegated
 * administrator. Only the organization's management account can run this
 * API operation.
 */
export const enableOrganizationAdminAccount: (
  input: EnableOrganizationAdminAccountRequest,
) => effect.Effect<
  EnableOrganizationAdminAccountResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableOrganizationAdminAccountRequest,
  output: EnableOrganizationAdminAccountResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns the count of all GuardDuty membership invitations that were sent to the current
 * member account except the currently accepted invitation.
 */
export const getInvitationsCount: (
  input: GetInvitationsCountRequest,
) => effect.Effect<
  GetInvitationsCountResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvitationsCountRequest,
  output: GetInvitationsCountResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Unarchives GuardDuty findings specified by the `findingIds`.
 */
export const unarchiveFindings: (
  input: UnarchiveFindingsRequest,
) => effect.Effect<
  UnarchiveFindingsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnarchiveFindingsRequest,
  output: UnarchiveFindingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Updates the GuardDuty detector specified by the detector ID.
 *
 * Specifying both EKS Runtime Monitoring (`EKS_RUNTIME_MONITORING`)
 * and Runtime Monitoring (`RUNTIME_MONITORING`) will cause an error.
 * You can add only one of these two features because Runtime Monitoring already includes the
 * threat detection for Amazon EKS resources. For more information, see
 * Runtime Monitoring.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const updateDetector: (
  input: UpdateDetectorRequest,
) => effect.Effect<
  UpdateDetectorResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDetectorRequest,
  output: UpdateDetectorResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Marks the specified GuardDuty findings as useful or not useful.
 */
export const updateFindingsFeedback: (
  input: UpdateFindingsFeedbackRequest,
) => effect.Effect<
  UpdateFindingsFeedbackResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFindingsFeedbackRequest,
  output: UpdateFindingsFeedbackResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Updates information about the publishing destination specified by the
 * `destinationId`.
 */
export const updatePublishingDestination: (
  input: UpdatePublishingDestinationRequest,
) => effect.Effect<
  UpdatePublishingDestinationResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePublishingDestinationRequest,
  output: UpdatePublishingDestinationResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Updates the threat entity set associated with the specified `threatEntitySetId`.
 */
export const updateThreatEntitySet: (
  input: UpdateThreatEntitySetRequest,
) => effect.Effect<
  UpdateThreatEntitySetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThreatEntitySetRequest,
  output: UpdateThreatEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Updates the trusted entity set associated with the specified `trustedEntitySetId`.
 */
export const updateTrustedEntitySet: (
  input: UpdateTrustedEntitySetRequest,
) => effect.Effect<
  UpdateTrustedEntitySetResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrustedEntitySetRequest,
  output: UpdateTrustedEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Adds tags to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Updates the IPSet specified by the IPSet ID.
 */
export const updateIPSet: (
  input: UpdateIPSetRequest,
) => effect.Effect<
  UpdateIPSetResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIPSetRequest,
  output: UpdateIPSetResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Updates the ThreatIntelSet specified by the ThreatIntelSet ID.
 */
export const updateThreatIntelSet: (
  input: UpdateThreatIntelSetRequest,
) => effect.Effect<
  UpdateThreatIntelSetResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThreatIntelSetRequest,
  output: UpdateThreatIntelSetResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Creates a new IPSet, which is called a trusted IP list in the console user interface. An
 * IPSet is a list of IP addresses that are trusted for secure communication with Amazon Web Services
 * infrastructure and applications. GuardDuty doesn't generate findings for IP addresses that are
 * included in IPSets. Only users from the administrator account can use this operation.
 */
export const createIPSet: (
  input: CreateIPSetRequest,
) => effect.Effect<
  CreateIPSetResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIPSetRequest,
  output: CreateIPSetResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Creates a new ThreatIntelSet. ThreatIntelSets consist of known malicious IP addresses.
 * GuardDuty generates findings based on ThreatIntelSets. Only users of the administrator
 * account can use this operation.
 */
export const createThreatIntelSet: (
  input: CreateThreatIntelSetRequest,
) => effect.Effect<
  CreateThreatIntelSetResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThreatIntelSetRequest,
  output: CreateThreatIntelSetResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Lists GuardDuty findings statistics for the specified detector ID.
 *
 * You must provide either `findingStatisticTypes` or
 * `groupBy` parameter, and not both. You can use the `maxResults` and `orderBy`
 * parameters only when using `groupBy`.
 *
 * There might be regional differences because some flags might not be available in all the Regions where GuardDuty
 * is currently supported. For more information, see Regions and endpoints.
 */
export const getFindingsStatistics: (
  input: GetFindingsStatisticsRequest,
) => effect.Effect<
  GetFindingsStatisticsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingsStatisticsRequest,
  output: GetFindingsStatisticsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the Malware Protection plan details associated with a Malware Protection
 * plan ID.
 */
export const getMalwareProtectionPlan: (
  input: GetMalwareProtectionPlanRequest,
) => effect.Effect<
  GetMalwareProtectionPlanResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMalwareProtectionPlanRequest,
  output: GetMalwareProtectionPlanResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
    ResourceNotFoundException,
  ],
}));
/**
 * Contains information on member accounts to be updated.
 *
 * Specifying both EKS Runtime Monitoring (`EKS_RUNTIME_MONITORING`)
 * and Runtime Monitoring (`RUNTIME_MONITORING`) will cause an error.
 * You can add only one of these two features because Runtime Monitoring already includes the
 * threat detection for Amazon EKS resources. For more information, see
 * Runtime Monitoring.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const updateMemberDetectors: (
  input: UpdateMemberDetectorsRequest,
) => effect.Effect<
  UpdateMemberDetectorsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMemberDetectorsRequest,
  output: UpdateMemberDetectorsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Updates an existing Malware Protection plan resource.
 */
export const updateMalwareProtectionPlan: (
  input: UpdateMalwareProtectionPlanRequest,
) => effect.Effect<
  UpdateMalwareProtectionPlanResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMalwareProtectionPlanRequest,
  output: UpdateMalwareProtectionPlanResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the Malware Protection plan ID associated with the Malware Protection plan resource.
 * Use this API only when you no longer want to protect the resource associated with this
 * Malware Protection plan ID.
 */
export const deleteMalwareProtectionPlan: (
  input: DeleteMalwareProtectionPlanRequest,
) => effect.Effect<
  DeleteMalwareProtectionPlanResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerErrorException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMalwareProtectionPlanRequest,
  output: DeleteMalwareProtectionPlanResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a filter using the specified finding criteria. The maximum number of saved filters
 * per Amazon Web Services account per Region is 100. For more information, see Quotas for GuardDuty.
 */
export const createFilter: (
  input: CreateFilterRequest,
) => effect.Effect<
  CreateFilterResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFilterRequest,
  output: CreateFilterResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Creates a new Malware Protection plan for the protected resource.
 *
 * When you create a Malware Protection plan, the Amazon Web Services service terms for GuardDuty Malware
 * Protection apply. For more information, see Amazon Web Services service terms for GuardDuty Malware Protection.
 */
export const createMalwareProtectionPlan: (
  input: CreateMalwareProtectionPlanRequest,
) => effect.Effect<
  CreateMalwareProtectionPlanResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMalwareProtectionPlanRequest,
  output: CreateMalwareProtectionPlanResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
  ],
}));
/**
 * Describes which data sources are enabled for the member account's detector.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const getMemberDetectors: (
  input: GetMemberDetectorsRequest,
) => effect.Effect<
  GetMemberDetectorsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMemberDetectorsRequest,
  output: GetMemberDetectorsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves how many active member accounts have
 * each feature enabled within GuardDuty. Only a delegated GuardDuty administrator of an organization can run this API.
 *
 * When you create a new organization, it might take up to 24
 * hours to generate the statistics for the entire organization.
 */
export const getOrganizationStatistics: (
  input: GetOrganizationStatisticsRequest,
) => effect.Effect<
  GetOrganizationStatisticsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOrganizationStatisticsRequest,
  output: GetOrganizationStatisticsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Provides the number of days left for each data source used in the free trial
 * period.
 */
export const getRemainingFreeTrialDays: (
  input: GetRemainingFreeTrialDaysRequest,
) => effect.Effect<
  GetRemainingFreeTrialDaysResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRemainingFreeTrialDaysRequest,
  output: GetRemainingFreeTrialDaysResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns a list of malware scans. Each member account can view the malware scans for their
 * own accounts. An administrator can view the malware scans for all of its members' accounts.
 */
export const listMalwareScans: {
  (
    input: ListMalwareScansRequest,
  ): effect.Effect<
    ListMalwareScansResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMalwareScansRequest,
  ) => stream.Stream<
    ListMalwareScansResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMalwareScansRequest,
  ) => stream.Stream<
    MalwareScan,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMalwareScansRequest,
  output: ListMalwareScansResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Scans",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the malware scan settings.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const updateMalwareScanSettings: (
  input: UpdateMalwareScanSettingsRequest,
) => effect.Effect<
  UpdateMalwareScanSettingsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMalwareScanSettingsRequest,
  output: UpdateMalwareScanSettingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Configures the delegated administrator account with the provided values. You must provide
 * a value for either `autoEnableOrganizationMembers` or `autoEnable`, but not both.
 *
 * Specifying both EKS Runtime Monitoring (`EKS_RUNTIME_MONITORING`)
 * and Runtime Monitoring (`RUNTIME_MONITORING`) will cause an error.
 * You can add only one of these two features because Runtime Monitoring already includes the
 * threat detection for Amazon EKS resources. For more information, see
 * Runtime Monitoring.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const updateOrganizationConfiguration: (
  input: UpdateOrganizationConfigurationRequest,
) => effect.Effect<
  UpdateOrganizationConfigurationResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOrganizationConfigurationRequest,
  output: UpdateOrganizationConfigurationResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Initiates the malware scan. Invoking this API will automatically create the Service-linked role in
 * the corresponding account if the resourceArn belongs to an EC2 instance.
 *
 * When the malware scan starts, you can use the associated scan ID to track the status of the scan. For more information,
 * see ListMalwareScans and GetMalwareScan.
 *
 * When you use this API, the Amazon Web Services service terms for GuardDuty Malware
 * Protection apply. For more information, see Amazon Web Services service terms for GuardDuty Malware Protection.
 */
export const startMalwareScan: (
  input: StartMalwareScanRequest,
) => effect.Effect<
  StartMalwareScanResponse,
  | BadRequestException
  | ConflictException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMalwareScanRequest,
  output: StartMalwareScanResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
  ],
}));
/**
 * Creates a single GuardDuty detector. A detector is a resource that represents the
 * GuardDuty service. To start using GuardDuty, you must create a detector in each Region where
 * you enable the service. You can have only one detector per account per Region. All data
 * sources are enabled in a new detector by default.
 *
 * - When you don't specify any `features`, with an
 * exception to `RUNTIME_MONITORING`, all the optional features are
 * enabled by default.
 *
 * - When you specify some of the `features`, any feature that is not specified in the
 * API call gets enabled by default, with an exception to `RUNTIME_MONITORING`.
 *
 * Specifying both EKS Runtime Monitoring (`EKS_RUNTIME_MONITORING`)
 * and Runtime Monitoring (`RUNTIME_MONITORING`) will cause an error.
 * You can add only one of these two features because Runtime Monitoring already includes the
 * threat detection for Amazon EKS resources. For more information, see
 * Runtime Monitoring.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const createDetector: (
  input: CreateDetectorRequest,
) => effect.Effect<
  CreateDetectorResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDetectorRequest,
  output: CreateDetectorResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns information about the account selected as the delegated administrator for
 * GuardDuty.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const describeOrganizationConfiguration: {
  (
    input: DescribeOrganizationConfigurationRequest,
  ): effect.Effect<
    DescribeOrganizationConfigurationResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOrganizationConfigurationRequest,
  ) => stream.Stream<
    DescribeOrganizationConfigurationResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOrganizationConfigurationRequest,
  ) => stream.Stream<
    unknown,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOrganizationConfigurationRequest,
  output: DescribeOrganizationConfigurationResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a GuardDuty detector specified by the detectorId.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const getDetector: (
  input: GetDetectorRequest,
) => effect.Effect<
  GetDetectorResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDetectorRequest,
  output: GetDetectorResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the detailed information for a specific malware scan. Each member account can view the malware scan details for their
 * own account. An administrator can view malware scan details for all accounts in the organization.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const getMalwareScan: (
  input: GetMalwareScanRequest,
) => effect.Effect<
  GetMalwareScanResponse,
  | BadRequestException
  | InternalServerErrorException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMalwareScanRequest,
  output: GetMalwareScanResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists Amazon GuardDuty usage statistics over the last 30 days for the specified detector
 * ID. For newly enabled detectors or data sources, the cost returned will include only the usage
 * so far under 30 days. This may differ from the cost metrics in the console, which project
 * usage over 30 days to provide a monthly cost estimate. For more information, see Understanding How Usage Costs are Calculated.
 */
export const getUsageStatistics: {
  (
    input: GetUsageStatisticsRequest,
  ): effect.Effect<
    GetUsageStatisticsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetUsageStatisticsRequest,
  ) => stream.Stream<
    GetUsageStatisticsResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetUsageStatisticsRequest,
  ) => stream.Stream<
    unknown,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetUsageStatisticsRequest,
  output: GetUsageStatisticsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of malware scans. Each member account can view the malware scans for their
 * own accounts. An administrator can view the malware scans for all the member accounts.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const describeMalwareScans: {
  (
    input: DescribeMalwareScansRequest,
  ): effect.Effect<
    DescribeMalwareScansResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMalwareScansRequest,
  ) => stream.Stream<
    DescribeMalwareScansResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMalwareScansRequest,
  ) => stream.Stream<
    Scan,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMalwareScansRequest,
  output: DescribeMalwareScansResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Scans",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves aggregated statistics for your account. If you are a GuardDuty administrator, you
 * can retrieve the statistics for all the resources associated with the active member accounts
 * in your organization who have enabled Runtime Monitoring and have the GuardDuty security agent running
 * on their resources.
 */
export const getCoverageStatistics: (
  input: GetCoverageStatisticsRequest,
) => effect.Effect<
  GetCoverageStatisticsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCoverageStatisticsRequest,
  output: GetCoverageStatisticsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Lists coverage details for your GuardDuty account. If you're a GuardDuty administrator, you can
 * retrieve all resources associated with the active member accounts in your organization.
 *
 * Make sure the accounts have Runtime Monitoring enabled and GuardDuty agent running on
 * their resources.
 */
export const listCoverage: {
  (
    input: ListCoverageRequest,
  ): effect.Effect<
    ListCoverageResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCoverageRequest,
  ) => stream.Stream<
    ListCoverageResponse,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCoverageRequest,
  ) => stream.Stream<
    CoverageResource,
    BadRequestException | InternalServerErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCoverageRequest,
  output: ListCoverageResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Resources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes Amazon GuardDuty findings specified by finding IDs.
 */
export const getFindings: (
  input: GetFindingsRequest,
) => effect.Effect<
  GetFindingsResponse,
  BadRequestException | InternalServerErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingsRequest,
  output: GetFindingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));

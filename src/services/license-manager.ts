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
const ns = T.XmlNamespace(
  "https://license-manager.amazonaws.com/doc/2018_08_01",
);
const svc = T.AwsApiService({
  sdkId: "License Manager",
  serviceShapeName: "AWSLicenseManager",
});
const auth = T.AwsAuthSigv4({ name: "license-manager" });
const ver = T.ServiceVersion("2018-08-01");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://license-manager-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://license-manager-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://license-manager.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://license-manager.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type ClientToken = string;
export type StatusReasonMessage = string;
export type LicenseAssetResourceName = string;
export type LicenseAssetResourceDescription = string;
export type BoxLong = number;
export type BoxBoolean = boolean;
export type ReportGeneratorName = string;
export type ClientRequestToken = string;
export type TokenString = string;
export type LicenseConversionTaskId = string;
export type BoxInteger = number;
export type MaxSize100 = number;
export type ISO8601DateTime = string;
export type UsageOperation = string;
export type FilterName = string;
export type FilterValue = string;
export type Message = string;
export type SignedToken = string;
export type ProductCodeId = string;
export type Location = string;

//# Schemas
export interface GetServiceSettingsRequest {}
export const GetServiceSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServiceSettingsRequest",
}) as any as S.Schema<GetServiceSettingsRequest>;
export type DigitalSignatureMethod = "JWT_PS384";
export const DigitalSignatureMethod = S.Literal("JWT_PS384");
export type CheckoutType = "PROVISIONAL" | "PERPETUAL";
export const CheckoutType = S.Literal("PROVISIONAL", "PERPETUAL");
export type PrincipalArnList = string[];
export const PrincipalArnList = S.Array(S.String);
export type AllowedOperation =
  | "CreateGrant"
  | "CheckoutLicense"
  | "CheckoutBorrowLicense"
  | "CheckInLicense"
  | "ExtendConsumptionLicense"
  | "ListPurchasedLicenses"
  | "CreateToken";
export const AllowedOperation = S.Literal(
  "CreateGrant",
  "CheckoutLicense",
  "CheckoutBorrowLicense",
  "CheckInLicense",
  "ExtendConsumptionLicense",
  "ListPurchasedLicenses",
  "CreateToken",
);
export type AllowedOperationList = AllowedOperation[];
export const AllowedOperationList = S.Array(AllowedOperation);
export type GrantStatus =
  | "PENDING_WORKFLOW"
  | "PENDING_ACCEPT"
  | "REJECTED"
  | "ACTIVE"
  | "FAILED_WORKFLOW"
  | "DELETED"
  | "PENDING_DELETE"
  | "DISABLED"
  | "WORKFLOW_COMPLETED";
export const GrantStatus = S.Literal(
  "PENDING_WORKFLOW",
  "PENDING_ACCEPT",
  "REJECTED",
  "ACTIVE",
  "FAILED_WORKFLOW",
  "DELETED",
  "PENDING_DELETE",
  "DISABLED",
  "WORKFLOW_COMPLETED",
);
export type LicenseAssetRulesetArnList = string[];
export const LicenseAssetRulesetArnList = S.Array(S.String);
export type LicenseCountingType = "vCPU" | "Instance" | "Core" | "Socket";
export const LicenseCountingType = S.Literal(
  "vCPU",
  "Instance",
  "Core",
  "Socket",
);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type ReportType =
  | "LicenseConfigurationSummaryReport"
  | "LicenseConfigurationUsageReport"
  | "LicenseAssetGroupUsageReport";
export const ReportType = S.Literal(
  "LicenseConfigurationSummaryReport",
  "LicenseConfigurationUsageReport",
  "LicenseAssetGroupUsageReport",
);
export type ReportTypeList = ReportType[];
export const ReportTypeList = S.Array(ReportType);
export type LicenseStatus =
  | "AVAILABLE"
  | "PENDING_AVAILABLE"
  | "DEACTIVATED"
  | "SUSPENDED"
  | "EXPIRED"
  | "PENDING_DELETE"
  | "DELETED";
export const LicenseStatus = S.Literal(
  "AVAILABLE",
  "PENDING_AVAILABLE",
  "DEACTIVATED",
  "SUSPENDED",
  "EXPIRED",
  "PENDING_DELETE",
  "DELETED",
);
export type ArnList = string[];
export const ArnList = S.Array(S.String);
export type MaxSize3StringList = string[];
export const MaxSize3StringList = S.Array(S.String);
export type FilterValues = string[];
export const FilterValues = S.Array(S.String.pipe(T.XmlName("item")));
export interface Filter {
  Name?: string;
  Values?: string[];
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Values: S.optional(FilterValues) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(
  Filter.pipe(T.XmlName("item")).annotations({ identifier: "Filter" }),
);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type LicenseAssetGroupStatus = "ACTIVE" | "DISABLED" | "DELETED";
export const LicenseAssetGroupStatus = S.Literal(
  "ACTIVE",
  "DISABLED",
  "DELETED",
);
export type LicenseConfigurationStatus = "AVAILABLE" | "DISABLED";
export const LicenseConfigurationStatus = S.Literal("AVAILABLE", "DISABLED");
export interface AcceptGrantRequest {
  GrantArn: string;
}
export const AcceptGrantRequest = S.suspend(() =>
  S.Struct({ GrantArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptGrantRequest",
}) as any as S.Schema<AcceptGrantRequest>;
export interface CheckInLicenseRequest {
  LicenseConsumptionToken: string;
  Beneficiary?: string;
}
export const CheckInLicenseRequest = S.suspend(() =>
  S.Struct({
    LicenseConsumptionToken: S.String,
    Beneficiary: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CheckInLicenseRequest",
}) as any as S.Schema<CheckInLicenseRequest>;
export interface CheckInLicenseResponse {}
export const CheckInLicenseResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CheckInLicenseResponse",
}) as any as S.Schema<CheckInLicenseResponse>;
export type EntitlementDataUnit =
  | "Count"
  | "None"
  | "Seconds"
  | "Microseconds"
  | "Milliseconds"
  | "Bytes"
  | "Kilobytes"
  | "Megabytes"
  | "Gigabytes"
  | "Terabytes"
  | "Bits"
  | "Kilobits"
  | "Megabits"
  | "Gigabits"
  | "Terabits"
  | "Percent"
  | "Bytes/Second"
  | "Kilobytes/Second"
  | "Megabytes/Second"
  | "Gigabytes/Second"
  | "Terabytes/Second"
  | "Bits/Second"
  | "Kilobits/Second"
  | "Megabits/Second"
  | "Gigabits/Second"
  | "Terabits/Second"
  | "Count/Second";
export const EntitlementDataUnit = S.Literal(
  "Count",
  "None",
  "Seconds",
  "Microseconds",
  "Milliseconds",
  "Bytes",
  "Kilobytes",
  "Megabytes",
  "Gigabytes",
  "Terabytes",
  "Bits",
  "Kilobits",
  "Megabits",
  "Gigabits",
  "Terabits",
  "Percent",
  "Bytes/Second",
  "Kilobytes/Second",
  "Megabytes/Second",
  "Gigabytes/Second",
  "Terabytes/Second",
  "Bits/Second",
  "Kilobits/Second",
  "Megabits/Second",
  "Gigabits/Second",
  "Terabits/Second",
  "Count/Second",
);
export interface EntitlementData {
  Name: string;
  Value?: string;
  Unit: EntitlementDataUnit;
}
export const EntitlementData = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Value: S.optional(S.String),
    Unit: EntitlementDataUnit,
  }),
).annotations({
  identifier: "EntitlementData",
}) as any as S.Schema<EntitlementData>;
export type EntitlementDataList = EntitlementData[];
export const EntitlementDataList = S.Array(EntitlementData);
export interface CheckoutLicenseRequest {
  ProductSKU: string;
  CheckoutType: CheckoutType;
  KeyFingerprint: string;
  Entitlements: EntitlementData[];
  ClientToken: string;
  Beneficiary?: string;
  NodeId?: string;
}
export const CheckoutLicenseRequest = S.suspend(() =>
  S.Struct({
    ProductSKU: S.String,
    CheckoutType: CheckoutType,
    KeyFingerprint: S.String,
    Entitlements: EntitlementDataList,
    ClientToken: S.String,
    Beneficiary: S.optional(S.String),
    NodeId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CheckoutLicenseRequest",
}) as any as S.Schema<CheckoutLicenseRequest>;
export interface Issuer {
  Name: string;
  SignKey?: string;
}
export const Issuer = S.suspend(() =>
  S.Struct({ Name: S.String, SignKey: S.optional(S.String) }),
).annotations({ identifier: "Issuer" }) as any as S.Schema<Issuer>;
export interface DatetimeRange {
  Begin: string;
  End?: string;
}
export const DatetimeRange = S.suspend(() =>
  S.Struct({ Begin: S.String, End: S.optional(S.String) }),
).annotations({
  identifier: "DatetimeRange",
}) as any as S.Schema<DatetimeRange>;
export interface Metadata {
  Name?: string;
  Value?: string;
}
export const Metadata = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Metadata" }) as any as S.Schema<Metadata>;
export type MetadataList = Metadata[];
export const MetadataList = S.Array(Metadata);
export type EntitlementUnit =
  | "Count"
  | "None"
  | "Seconds"
  | "Microseconds"
  | "Milliseconds"
  | "Bytes"
  | "Kilobytes"
  | "Megabytes"
  | "Gigabytes"
  | "Terabytes"
  | "Bits"
  | "Kilobits"
  | "Megabits"
  | "Gigabits"
  | "Terabits"
  | "Percent"
  | "Bytes/Second"
  | "Kilobytes/Second"
  | "Megabytes/Second"
  | "Gigabytes/Second"
  | "Terabytes/Second"
  | "Bits/Second"
  | "Kilobits/Second"
  | "Megabits/Second"
  | "Gigabits/Second"
  | "Terabits/Second"
  | "Count/Second";
export const EntitlementUnit = S.Literal(
  "Count",
  "None",
  "Seconds",
  "Microseconds",
  "Milliseconds",
  "Bytes",
  "Kilobytes",
  "Megabytes",
  "Gigabytes",
  "Terabytes",
  "Bits",
  "Kilobits",
  "Megabits",
  "Gigabits",
  "Terabits",
  "Percent",
  "Bytes/Second",
  "Kilobytes/Second",
  "Megabytes/Second",
  "Gigabytes/Second",
  "Terabytes/Second",
  "Bits/Second",
  "Kilobits/Second",
  "Megabits/Second",
  "Gigabits/Second",
  "Terabits/Second",
  "Count/Second",
);
export interface Entitlement {
  Name: string;
  Value?: string;
  MaxCount?: number;
  Overage?: boolean;
  Unit: EntitlementUnit;
  AllowCheckIn?: boolean;
}
export const Entitlement = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Value: S.optional(S.String),
    MaxCount: S.optional(S.Number),
    Overage: S.optional(S.Boolean),
    Unit: EntitlementUnit,
    AllowCheckIn: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Entitlement" }) as any as S.Schema<Entitlement>;
export type EntitlementList = Entitlement[];
export const EntitlementList = S.Array(Entitlement);
export type RenewType = "None" | "Weekly" | "Monthly";
export const RenewType = S.Literal("None", "Weekly", "Monthly");
export interface ProvisionalConfiguration {
  MaxTimeToLiveInMinutes: number;
}
export const ProvisionalConfiguration = S.suspend(() =>
  S.Struct({ MaxTimeToLiveInMinutes: S.Number }),
).annotations({
  identifier: "ProvisionalConfiguration",
}) as any as S.Schema<ProvisionalConfiguration>;
export interface BorrowConfiguration {
  AllowEarlyCheckIn: boolean;
  MaxTimeToLiveInMinutes: number;
}
export const BorrowConfiguration = S.suspend(() =>
  S.Struct({ AllowEarlyCheckIn: S.Boolean, MaxTimeToLiveInMinutes: S.Number }),
).annotations({
  identifier: "BorrowConfiguration",
}) as any as S.Schema<BorrowConfiguration>;
export interface ConsumptionConfiguration {
  RenewType?: RenewType;
  ProvisionalConfiguration?: ProvisionalConfiguration;
  BorrowConfiguration?: BorrowConfiguration;
}
export const ConsumptionConfiguration = S.suspend(() =>
  S.Struct({
    RenewType: S.optional(RenewType),
    ProvisionalConfiguration: S.optional(ProvisionalConfiguration),
    BorrowConfiguration: S.optional(BorrowConfiguration),
  }),
).annotations({
  identifier: "ConsumptionConfiguration",
}) as any as S.Schema<ConsumptionConfiguration>;
export interface CreateLicenseVersionRequest {
  LicenseArn: string;
  LicenseName: string;
  ProductName: string;
  Issuer: Issuer;
  HomeRegion: string;
  Validity: DatetimeRange;
  LicenseMetadata?: Metadata[];
  Entitlements: Entitlement[];
  ConsumptionConfiguration: ConsumptionConfiguration;
  Status: LicenseStatus;
  ClientToken: string;
  SourceVersion?: string;
}
export const CreateLicenseVersionRequest = S.suspend(() =>
  S.Struct({
    LicenseArn: S.String,
    LicenseName: S.String,
    ProductName: S.String,
    Issuer: Issuer,
    HomeRegion: S.String,
    Validity: DatetimeRange,
    LicenseMetadata: S.optional(MetadataList),
    Entitlements: EntitlementList,
    ConsumptionConfiguration: ConsumptionConfiguration,
    Status: LicenseStatus,
    ClientToken: S.String,
    SourceVersion: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLicenseVersionRequest",
}) as any as S.Schema<CreateLicenseVersionRequest>;
export interface CreateTokenRequest {
  LicenseArn: string;
  RoleArns?: string[];
  ExpirationInDays?: number;
  TokenProperties?: string[];
  ClientToken: string;
}
export const CreateTokenRequest = S.suspend(() =>
  S.Struct({
    LicenseArn: S.String,
    RoleArns: S.optional(ArnList),
    ExpirationInDays: S.optional(S.Number),
    TokenProperties: S.optional(MaxSize3StringList),
    ClientToken: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTokenRequest",
}) as any as S.Schema<CreateTokenRequest>;
export interface DeleteGrantRequest {
  GrantArn: string;
  StatusReason?: string;
  Version: string;
}
export const DeleteGrantRequest = S.suspend(() =>
  S.Struct({
    GrantArn: S.String,
    StatusReason: S.optional(S.String),
    Version: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGrantRequest",
}) as any as S.Schema<DeleteGrantRequest>;
export interface DeleteLicenseRequest {
  LicenseArn: string;
  SourceVersion: string;
}
export const DeleteLicenseRequest = S.suspend(() =>
  S.Struct({ LicenseArn: S.String, SourceVersion: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLicenseRequest",
}) as any as S.Schema<DeleteLicenseRequest>;
export interface DeleteLicenseAssetGroupRequest {
  LicenseAssetGroupArn: string;
}
export const DeleteLicenseAssetGroupRequest = S.suspend(() =>
  S.Struct({ LicenseAssetGroupArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLicenseAssetGroupRequest",
}) as any as S.Schema<DeleteLicenseAssetGroupRequest>;
export interface DeleteLicenseAssetRulesetRequest {
  LicenseAssetRulesetArn: string;
}
export const DeleteLicenseAssetRulesetRequest = S.suspend(() =>
  S.Struct({ LicenseAssetRulesetArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLicenseAssetRulesetRequest",
}) as any as S.Schema<DeleteLicenseAssetRulesetRequest>;
export interface DeleteLicenseAssetRulesetResponse {}
export const DeleteLicenseAssetRulesetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLicenseAssetRulesetResponse",
}) as any as S.Schema<DeleteLicenseAssetRulesetResponse>;
export interface DeleteLicenseConfigurationRequest {
  LicenseConfigurationArn: string;
}
export const DeleteLicenseConfigurationRequest = S.suspend(() =>
  S.Struct({ LicenseConfigurationArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLicenseConfigurationRequest",
}) as any as S.Schema<DeleteLicenseConfigurationRequest>;
export interface DeleteLicenseConfigurationResponse {}
export const DeleteLicenseConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLicenseConfigurationResponse",
}) as any as S.Schema<DeleteLicenseConfigurationResponse>;
export interface DeleteLicenseManagerReportGeneratorRequest {
  LicenseManagerReportGeneratorArn: string;
}
export const DeleteLicenseManagerReportGeneratorRequest = S.suspend(() =>
  S.Struct({ LicenseManagerReportGeneratorArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLicenseManagerReportGeneratorRequest",
}) as any as S.Schema<DeleteLicenseManagerReportGeneratorRequest>;
export interface DeleteLicenseManagerReportGeneratorResponse {}
export const DeleteLicenseManagerReportGeneratorResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLicenseManagerReportGeneratorResponse",
}) as any as S.Schema<DeleteLicenseManagerReportGeneratorResponse>;
export interface DeleteTokenRequest {
  TokenId: string;
}
export const DeleteTokenRequest = S.suspend(() =>
  S.Struct({ TokenId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTokenRequest",
}) as any as S.Schema<DeleteTokenRequest>;
export interface DeleteTokenResponse {}
export const DeleteTokenResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTokenResponse",
}) as any as S.Schema<DeleteTokenResponse>;
export interface ExtendLicenseConsumptionRequest {
  LicenseConsumptionToken: string;
  DryRun?: boolean;
}
export const ExtendLicenseConsumptionRequest = S.suspend(() =>
  S.Struct({
    LicenseConsumptionToken: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExtendLicenseConsumptionRequest",
}) as any as S.Schema<ExtendLicenseConsumptionRequest>;
export interface GetAccessTokenRequest {
  Token: string;
  TokenProperties?: string[];
}
export const GetAccessTokenRequest = S.suspend(() =>
  S.Struct({
    Token: S.String,
    TokenProperties: S.optional(MaxSize3StringList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccessTokenRequest",
}) as any as S.Schema<GetAccessTokenRequest>;
export interface GetGrantRequest {
  GrantArn: string;
  Version?: string;
}
export const GetGrantRequest = S.suspend(() =>
  S.Struct({ GrantArn: S.String, Version: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGrantRequest",
}) as any as S.Schema<GetGrantRequest>;
export interface GetLicenseRequest {
  LicenseArn: string;
  Version?: string;
}
export const GetLicenseRequest = S.suspend(() =>
  S.Struct({ LicenseArn: S.String, Version: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLicenseRequest",
}) as any as S.Schema<GetLicenseRequest>;
export interface GetLicenseAssetGroupRequest {
  LicenseAssetGroupArn: string;
}
export const GetLicenseAssetGroupRequest = S.suspend(() =>
  S.Struct({ LicenseAssetGroupArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLicenseAssetGroupRequest",
}) as any as S.Schema<GetLicenseAssetGroupRequest>;
export interface GetLicenseAssetRulesetRequest {
  LicenseAssetRulesetArn: string;
}
export const GetLicenseAssetRulesetRequest = S.suspend(() =>
  S.Struct({ LicenseAssetRulesetArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLicenseAssetRulesetRequest",
}) as any as S.Schema<GetLicenseAssetRulesetRequest>;
export interface GetLicenseConfigurationRequest {
  LicenseConfigurationArn: string;
}
export const GetLicenseConfigurationRequest = S.suspend(() =>
  S.Struct({ LicenseConfigurationArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLicenseConfigurationRequest",
}) as any as S.Schema<GetLicenseConfigurationRequest>;
export interface GetLicenseConversionTaskRequest {
  LicenseConversionTaskId: string;
}
export const GetLicenseConversionTaskRequest = S.suspend(() =>
  S.Struct({ LicenseConversionTaskId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLicenseConversionTaskRequest",
}) as any as S.Schema<GetLicenseConversionTaskRequest>;
export interface GetLicenseManagerReportGeneratorRequest {
  LicenseManagerReportGeneratorArn: string;
}
export const GetLicenseManagerReportGeneratorRequest = S.suspend(() =>
  S.Struct({ LicenseManagerReportGeneratorArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLicenseManagerReportGeneratorRequest",
}) as any as S.Schema<GetLicenseManagerReportGeneratorRequest>;
export interface GetLicenseUsageRequest {
  LicenseArn: string;
}
export const GetLicenseUsageRequest = S.suspend(() =>
  S.Struct({ LicenseArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLicenseUsageRequest",
}) as any as S.Schema<GetLicenseUsageRequest>;
export interface ListAssetsForLicenseAssetGroupRequest {
  LicenseAssetGroupArn: string;
  AssetType: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAssetsForLicenseAssetGroupRequest = S.suspend(() =>
  S.Struct({
    LicenseAssetGroupArn: S.String,
    AssetType: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetsForLicenseAssetGroupRequest",
}) as any as S.Schema<ListAssetsForLicenseAssetGroupRequest>;
export interface ListAssociationsForLicenseConfigurationRequest {
  LicenseConfigurationArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAssociationsForLicenseConfigurationRequest = S.suspend(() =>
  S.Struct({
    LicenseConfigurationArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociationsForLicenseConfigurationRequest",
}) as any as S.Schema<ListAssociationsForLicenseConfigurationRequest>;
export interface ListFailuresForLicenseConfigurationOperationsRequest {
  LicenseConfigurationArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListFailuresForLicenseConfigurationOperationsRequest = S.suspend(
  () =>
    S.Struct({
      LicenseConfigurationArn: S.String,
      MaxResults: S.optional(S.Number),
      NextToken: S.optional(S.String),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "ListFailuresForLicenseConfigurationOperationsRequest",
}) as any as S.Schema<ListFailuresForLicenseConfigurationOperationsRequest>;
export interface ListLicenseAssetGroupsRequest {
  Filters?: Filter[];
  MaxResults?: number;
  NextToken?: string;
}
export const ListLicenseAssetGroupsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(Filters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicenseAssetGroupsRequest",
}) as any as S.Schema<ListLicenseAssetGroupsRequest>;
export interface ListLicenseAssetRulesetsRequest {
  Filters?: Filter[];
  ShowAWSManagedLicenseAssetRulesets?: boolean;
  MaxResults?: number;
  NextToken?: string;
}
export const ListLicenseAssetRulesetsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(Filters),
    ShowAWSManagedLicenseAssetRulesets: S.optional(S.Boolean),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicenseAssetRulesetsRequest",
}) as any as S.Schema<ListLicenseAssetRulesetsRequest>;
export interface ListLicenseConfigurationsRequest {
  LicenseConfigurationArns?: string[];
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filter[];
}
export const ListLicenseConfigurationsRequest = S.suspend(() =>
  S.Struct({
    LicenseConfigurationArns: S.optional(StringList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicenseConfigurationsRequest",
}) as any as S.Schema<ListLicenseConfigurationsRequest>;
export interface ListLicenseConfigurationsForOrganizationRequest {
  LicenseConfigurationArns?: string[];
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filter[];
}
export const ListLicenseConfigurationsForOrganizationRequest = S.suspend(() =>
  S.Struct({
    LicenseConfigurationArns: S.optional(StringList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicenseConfigurationsForOrganizationRequest",
}) as any as S.Schema<ListLicenseConfigurationsForOrganizationRequest>;
export interface ListLicenseConversionTasksRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListLicenseConversionTasksRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicenseConversionTasksRequest",
}) as any as S.Schema<ListLicenseConversionTasksRequest>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface ListLicenseManagerReportGeneratorsRequest {
  Filters?: Filter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListLicenseManagerReportGeneratorsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicenseManagerReportGeneratorsRequest",
}) as any as S.Schema<ListLicenseManagerReportGeneratorsRequest>;
export interface ListLicensesRequest {
  LicenseArns?: string[];
  Filters?: Filter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListLicensesRequest = S.suspend(() =>
  S.Struct({
    LicenseArns: S.optional(ArnList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicensesRequest",
}) as any as S.Schema<ListLicensesRequest>;
export interface ListLicenseSpecificationsForResourceRequest {
  ResourceArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListLicenseSpecificationsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicenseSpecificationsForResourceRequest",
}) as any as S.Schema<ListLicenseSpecificationsForResourceRequest>;
export interface ListLicenseVersionsRequest {
  LicenseArn: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListLicenseVersionsRequest = S.suspend(() =>
  S.Struct({
    LicenseArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicenseVersionsRequest",
}) as any as S.Schema<ListLicenseVersionsRequest>;
export interface ListReceivedGrantsRequest {
  GrantArns?: string[];
  Filters?: Filter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListReceivedGrantsRequest = S.suspend(() =>
  S.Struct({
    GrantArns: S.optional(ArnList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReceivedGrantsRequest",
}) as any as S.Schema<ListReceivedGrantsRequest>;
export interface ListReceivedGrantsForOrganizationRequest {
  LicenseArn: string;
  Filters?: Filter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListReceivedGrantsForOrganizationRequest = S.suspend(() =>
  S.Struct({
    LicenseArn: S.String,
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReceivedGrantsForOrganizationRequest",
}) as any as S.Schema<ListReceivedGrantsForOrganizationRequest>;
export interface ListReceivedLicensesRequest {
  LicenseArns?: string[];
  Filters?: Filter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListReceivedLicensesRequest = S.suspend(() =>
  S.Struct({
    LicenseArns: S.optional(ArnList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReceivedLicensesRequest",
}) as any as S.Schema<ListReceivedLicensesRequest>;
export interface ListReceivedLicensesForOrganizationRequest {
  Filters?: Filter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListReceivedLicensesForOrganizationRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReceivedLicensesForOrganizationRequest",
}) as any as S.Schema<ListReceivedLicensesForOrganizationRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface ListTokensRequest {
  TokenIds?: string[];
  Filters?: Filter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListTokensRequest = S.suspend(() =>
  S.Struct({
    TokenIds: S.optional(StringList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTokensRequest",
}) as any as S.Schema<ListTokensRequest>;
export interface ListUsageForLicenseConfigurationRequest {
  LicenseConfigurationArn: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filter[];
}
export const ListUsageForLicenseConfigurationRequest = S.suspend(() =>
  S.Struct({
    LicenseConfigurationArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUsageForLicenseConfigurationRequest",
}) as any as S.Schema<ListUsageForLicenseConfigurationRequest>;
export interface RejectGrantRequest {
  GrantArn: string;
}
export const RejectGrantRequest = S.suspend(() =>
  S.Struct({ GrantArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectGrantRequest",
}) as any as S.Schema<RejectGrantRequest>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface LicenseAssetGroupConfiguration {
  UsageDimension?: string;
}
export const LicenseAssetGroupConfiguration = S.suspend(() =>
  S.Struct({ UsageDimension: S.optional(S.String) }),
).annotations({
  identifier: "LicenseAssetGroupConfiguration",
}) as any as S.Schema<LicenseAssetGroupConfiguration>;
export type LicenseAssetGroupConfigurationList =
  LicenseAssetGroupConfiguration[];
export const LicenseAssetGroupConfigurationList = S.Array(
  LicenseAssetGroupConfiguration,
);
export interface LicenseAssetGroupProperty {
  Key: string;
  Value: string;
}
export const LicenseAssetGroupProperty = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({
  identifier: "LicenseAssetGroupProperty",
}) as any as S.Schema<LicenseAssetGroupProperty>;
export type LicenseAssetGroupPropertyList = LicenseAssetGroupProperty[];
export const LicenseAssetGroupPropertyList = S.Array(LicenseAssetGroupProperty);
export interface UpdateLicenseAssetGroupRequest {
  Name?: string;
  Description?: string;
  LicenseAssetGroupConfigurations?: LicenseAssetGroupConfiguration[];
  AssociatedLicenseAssetRulesetARNs: string[];
  Properties?: LicenseAssetGroupProperty[];
  LicenseAssetGroupArn: string;
  Status?: LicenseAssetGroupStatus;
  ClientToken: string;
}
export const UpdateLicenseAssetGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LicenseAssetGroupConfigurations: S.optional(
      LicenseAssetGroupConfigurationList,
    ),
    AssociatedLicenseAssetRulesetARNs: LicenseAssetRulesetArnList,
    Properties: S.optional(LicenseAssetGroupPropertyList),
    LicenseAssetGroupArn: S.String,
    Status: S.optional(LicenseAssetGroupStatus),
    ClientToken: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLicenseAssetGroupRequest",
}) as any as S.Schema<UpdateLicenseAssetGroupRequest>;
export interface MatchingRuleStatement {
  KeyToMatch: string;
  Constraint: string;
  ValueToMatch: string[];
}
export const MatchingRuleStatement = S.suspend(() =>
  S.Struct({
    KeyToMatch: S.String,
    Constraint: S.String,
    ValueToMatch: StringList,
  }),
).annotations({
  identifier: "MatchingRuleStatement",
}) as any as S.Schema<MatchingRuleStatement>;
export type MatchingRuleStatementList = MatchingRuleStatement[];
export const MatchingRuleStatementList = S.Array(MatchingRuleStatement);
export interface ScriptRuleStatement {
  KeyToMatch: string;
  Script: string;
}
export const ScriptRuleStatement = S.suspend(() =>
  S.Struct({ KeyToMatch: S.String, Script: S.String }),
).annotations({
  identifier: "ScriptRuleStatement",
}) as any as S.Schema<ScriptRuleStatement>;
export type ScriptRuleStatementList = ScriptRuleStatement[];
export const ScriptRuleStatementList = S.Array(ScriptRuleStatement);
export interface AndRuleStatement {
  MatchingRuleStatements?: MatchingRuleStatement[];
  ScriptRuleStatements?: ScriptRuleStatement[];
}
export const AndRuleStatement = S.suspend(() =>
  S.Struct({
    MatchingRuleStatements: S.optional(MatchingRuleStatementList),
    ScriptRuleStatements: S.optional(ScriptRuleStatementList),
  }),
).annotations({
  identifier: "AndRuleStatement",
}) as any as S.Schema<AndRuleStatement>;
export interface OrRuleStatement {
  MatchingRuleStatements?: MatchingRuleStatement[];
  ScriptRuleStatements?: ScriptRuleStatement[];
}
export const OrRuleStatement = S.suspend(() =>
  S.Struct({
    MatchingRuleStatements: S.optional(MatchingRuleStatementList),
    ScriptRuleStatements: S.optional(ScriptRuleStatementList),
  }),
).annotations({
  identifier: "OrRuleStatement",
}) as any as S.Schema<OrRuleStatement>;
export interface LicenseConfigurationRuleStatement {
  AndRuleStatement?: AndRuleStatement;
  OrRuleStatement?: OrRuleStatement;
  MatchingRuleStatement?: MatchingRuleStatement;
}
export const LicenseConfigurationRuleStatement = S.suspend(() =>
  S.Struct({
    AndRuleStatement: S.optional(AndRuleStatement),
    OrRuleStatement: S.optional(OrRuleStatement),
    MatchingRuleStatement: S.optional(MatchingRuleStatement),
  }),
).annotations({
  identifier: "LicenseConfigurationRuleStatement",
}) as any as S.Schema<LicenseConfigurationRuleStatement>;
export interface LicenseRuleStatement {
  AndRuleStatement?: AndRuleStatement;
  OrRuleStatement?: OrRuleStatement;
  MatchingRuleStatement?: MatchingRuleStatement;
}
export const LicenseRuleStatement = S.suspend(() =>
  S.Struct({
    AndRuleStatement: S.optional(AndRuleStatement),
    OrRuleStatement: S.optional(OrRuleStatement),
    MatchingRuleStatement: S.optional(MatchingRuleStatement),
  }),
).annotations({
  identifier: "LicenseRuleStatement",
}) as any as S.Schema<LicenseRuleStatement>;
export interface InstanceRuleStatement {
  AndRuleStatement?: AndRuleStatement;
  OrRuleStatement?: OrRuleStatement;
  MatchingRuleStatement?: MatchingRuleStatement;
  ScriptRuleStatement?: ScriptRuleStatement;
}
export const InstanceRuleStatement = S.suspend(() =>
  S.Struct({
    AndRuleStatement: S.optional(AndRuleStatement),
    OrRuleStatement: S.optional(OrRuleStatement),
    MatchingRuleStatement: S.optional(MatchingRuleStatement),
    ScriptRuleStatement: S.optional(ScriptRuleStatement),
  }),
).annotations({
  identifier: "InstanceRuleStatement",
}) as any as S.Schema<InstanceRuleStatement>;
export interface RuleStatement {
  LicenseConfigurationRuleStatement?: LicenseConfigurationRuleStatement;
  LicenseRuleStatement?: LicenseRuleStatement;
  InstanceRuleStatement?: InstanceRuleStatement;
}
export const RuleStatement = S.suspend(() =>
  S.Struct({
    LicenseConfigurationRuleStatement: S.optional(
      LicenseConfigurationRuleStatement,
    ),
    LicenseRuleStatement: S.optional(LicenseRuleStatement),
    InstanceRuleStatement: S.optional(InstanceRuleStatement),
  }),
).annotations({
  identifier: "RuleStatement",
}) as any as S.Schema<RuleStatement>;
export interface LicenseAssetRule {
  RuleStatement: RuleStatement;
}
export const LicenseAssetRule = S.suspend(() =>
  S.Struct({ RuleStatement: RuleStatement }),
).annotations({
  identifier: "LicenseAssetRule",
}) as any as S.Schema<LicenseAssetRule>;
export type LicenseAssetRuleList = LicenseAssetRule[];
export const LicenseAssetRuleList = S.Array(LicenseAssetRule);
export interface UpdateLicenseAssetRulesetRequest {
  Name?: string;
  Description?: string;
  Rules: LicenseAssetRule[];
  LicenseAssetRulesetArn: string;
  ClientToken: string;
}
export const UpdateLicenseAssetRulesetRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Rules: LicenseAssetRuleList,
    LicenseAssetRulesetArn: S.String,
    ClientToken: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLicenseAssetRulesetRequest",
}) as any as S.Schema<UpdateLicenseAssetRulesetRequest>;
export interface ProductInformationFilter {
  ProductInformationFilterName: string;
  ProductInformationFilterValue?: string[];
  ProductInformationFilterComparator: string;
}
export const ProductInformationFilter = S.suspend(() =>
  S.Struct({
    ProductInformationFilterName: S.String,
    ProductInformationFilterValue: S.optional(StringList),
    ProductInformationFilterComparator: S.String,
  }),
).annotations({
  identifier: "ProductInformationFilter",
}) as any as S.Schema<ProductInformationFilter>;
export type ProductInformationFilterList = ProductInformationFilter[];
export const ProductInformationFilterList = S.Array(ProductInformationFilter);
export interface ProductInformation {
  ResourceType: string;
  ProductInformationFilterList: ProductInformationFilter[];
}
export const ProductInformation = S.suspend(() =>
  S.Struct({
    ResourceType: S.String,
    ProductInformationFilterList: ProductInformationFilterList,
  }),
).annotations({
  identifier: "ProductInformation",
}) as any as S.Schema<ProductInformation>;
export type ProductInformationList = ProductInformation[];
export const ProductInformationList = S.Array(ProductInformation);
export interface UpdateLicenseConfigurationRequest {
  LicenseConfigurationArn: string;
  LicenseConfigurationStatus?: LicenseConfigurationStatus;
  LicenseRules?: string[];
  LicenseCount?: number;
  LicenseCountHardLimit?: boolean;
  Name?: string;
  Description?: string;
  ProductInformationList?: ProductInformation[];
  DisassociateWhenNotFound?: boolean;
  LicenseExpiry?: number;
}
export const UpdateLicenseConfigurationRequest = S.suspend(() =>
  S.Struct({
    LicenseConfigurationArn: S.String,
    LicenseConfigurationStatus: S.optional(LicenseConfigurationStatus),
    LicenseRules: S.optional(StringList),
    LicenseCount: S.optional(S.Number),
    LicenseCountHardLimit: S.optional(S.Boolean),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ProductInformationList: S.optional(ProductInformationList),
    DisassociateWhenNotFound: S.optional(S.Boolean),
    LicenseExpiry: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLicenseConfigurationRequest",
}) as any as S.Schema<UpdateLicenseConfigurationRequest>;
export interface UpdateLicenseConfigurationResponse {}
export const UpdateLicenseConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateLicenseConfigurationResponse",
}) as any as S.Schema<UpdateLicenseConfigurationResponse>;
export interface ReportContext {
  licenseConfigurationArns?: string[];
  licenseAssetGroupArns?: string[];
  reportStartDate?: Date;
  reportEndDate?: Date;
}
export const ReportContext = S.suspend(() =>
  S.Struct({
    licenseConfigurationArns: S.optional(ArnList),
    licenseAssetGroupArns: S.optional(ArnList),
    reportStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    reportEndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ReportContext",
}) as any as S.Schema<ReportContext>;
export type ReportFrequencyType = "DAY" | "WEEK" | "MONTH" | "ONE_TIME";
export const ReportFrequencyType = S.Literal(
  "DAY",
  "WEEK",
  "MONTH",
  "ONE_TIME",
);
export interface ReportFrequency {
  value?: number;
  period?: ReportFrequencyType;
}
export const ReportFrequency = S.suspend(() =>
  S.Struct({
    value: S.optional(S.Number),
    period: S.optional(ReportFrequencyType),
  }),
).annotations({
  identifier: "ReportFrequency",
}) as any as S.Schema<ReportFrequency>;
export interface UpdateLicenseManagerReportGeneratorRequest {
  LicenseManagerReportGeneratorArn: string;
  ReportGeneratorName: string;
  Type: ReportType[];
  ReportContext: ReportContext;
  ReportFrequency: ReportFrequency;
  ClientToken: string;
  Description?: string;
}
export const UpdateLicenseManagerReportGeneratorRequest = S.suspend(() =>
  S.Struct({
    LicenseManagerReportGeneratorArn: S.String,
    ReportGeneratorName: S.String,
    Type: ReportTypeList,
    ReportContext: ReportContext,
    ReportFrequency: ReportFrequency,
    ClientToken: S.String,
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLicenseManagerReportGeneratorRequest",
}) as any as S.Schema<UpdateLicenseManagerReportGeneratorRequest>;
export interface UpdateLicenseManagerReportGeneratorResponse {}
export const UpdateLicenseManagerReportGeneratorResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateLicenseManagerReportGeneratorResponse",
}) as any as S.Schema<UpdateLicenseManagerReportGeneratorResponse>;
export interface OrganizationConfiguration {
  EnableIntegration: boolean;
}
export const OrganizationConfiguration = S.suspend(() =>
  S.Struct({ EnableIntegration: S.Boolean }),
).annotations({
  identifier: "OrganizationConfiguration",
}) as any as S.Schema<OrganizationConfiguration>;
export interface UpdateServiceSettingsRequest {
  S3BucketArn?: string;
  SnsTopicArn?: string;
  OrganizationConfiguration?: OrganizationConfiguration;
  EnableCrossAccountsDiscovery?: boolean;
  EnabledDiscoverySourceRegions?: string[];
}
export const UpdateServiceSettingsRequest = S.suspend(() =>
  S.Struct({
    S3BucketArn: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    OrganizationConfiguration: S.optional(OrganizationConfiguration),
    EnableCrossAccountsDiscovery: S.optional(S.Boolean),
    EnabledDiscoverySourceRegions: S.optional(StringList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateServiceSettingsRequest",
}) as any as S.Schema<UpdateServiceSettingsRequest>;
export interface UpdateServiceSettingsResponse {}
export const UpdateServiceSettingsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateServiceSettingsResponse",
}) as any as S.Schema<UpdateServiceSettingsResponse>;
export type ActivationOverrideBehavior =
  | "DISTRIBUTED_GRANTS_ONLY"
  | "ALL_GRANTS_PERMITTED_BY_ISSUER";
export const ActivationOverrideBehavior = S.Literal(
  "DISTRIBUTED_GRANTS_ONLY",
  "ALL_GRANTS_PERMITTED_BY_ISSUER",
);
export type InventoryFilterCondition =
  | "EQUALS"
  | "NOT_EQUALS"
  | "BEGINS_WITH"
  | "CONTAINS";
export const InventoryFilterCondition = S.Literal(
  "EQUALS",
  "NOT_EQUALS",
  "BEGINS_WITH",
  "CONTAINS",
);
export interface Options {
  ActivationOverrideBehavior?: ActivationOverrideBehavior;
}
export const Options = S.suspend(() =>
  S.Struct({
    ActivationOverrideBehavior: S.optional(ActivationOverrideBehavior),
  }),
).annotations({ identifier: "Options" }) as any as S.Schema<Options>;
export type TokenType = "REFRESH_TOKEN";
export const TokenType = S.Literal("REFRESH_TOKEN");
export type LicenseDeletionStatus = "PENDING_DELETE" | "DELETED";
export const LicenseDeletionStatus = S.Literal("PENDING_DELETE", "DELETED");
export type LicenseConversionTaskStatus =
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED";
export const LicenseConversionTaskStatus = S.Literal(
  "IN_PROGRESS",
  "SUCCEEDED",
  "FAILED",
);
export interface LicenseAssetGroup {
  Name: string;
  Description?: string;
  LicenseAssetGroupConfigurations?: LicenseAssetGroupConfiguration[];
  AssociatedLicenseAssetRulesetARNs: string[];
  Properties?: LicenseAssetGroupProperty[];
  LicenseAssetGroupArn: string;
  Status: LicenseAssetGroupStatus;
  StatusMessage?: string;
  LatestUsageAnalysisTime?: Date;
  LatestResourceDiscoveryTime?: Date;
}
export const LicenseAssetGroup = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    LicenseAssetGroupConfigurations: S.optional(
      LicenseAssetGroupConfigurationList,
    ),
    AssociatedLicenseAssetRulesetARNs: LicenseAssetRulesetArnList,
    Properties: S.optional(LicenseAssetGroupPropertyList),
    LicenseAssetGroupArn: S.String,
    Status: LicenseAssetGroupStatus,
    StatusMessage: S.optional(S.String),
    LatestUsageAnalysisTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestResourceDiscoveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "LicenseAssetGroup",
}) as any as S.Schema<LicenseAssetGroup>;
export type LicenseAssetGroupList = LicenseAssetGroup[];
export const LicenseAssetGroupList = S.Array(LicenseAssetGroup);
export interface LicenseAssetRuleset {
  Name: string;
  Description?: string;
  Rules: LicenseAssetRule[];
  LicenseAssetRulesetArn: string;
}
export const LicenseAssetRuleset = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Rules: LicenseAssetRuleList,
    LicenseAssetRulesetArn: S.String,
  }),
).annotations({
  identifier: "LicenseAssetRuleset",
}) as any as S.Schema<LicenseAssetRuleset>;
export type LicenseAssetRulesetList = LicenseAssetRuleset[];
export const LicenseAssetRulesetList = S.Array(LicenseAssetRuleset);
export interface S3Location {
  bucket?: string;
  keyPrefix?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ bucket: S.optional(S.String), keyPrefix: S.optional(S.String) }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface ReportGenerator {
  ReportGeneratorName?: string;
  ReportType?: ReportType[];
  ReportContext?: ReportContext;
  ReportFrequency?: ReportFrequency;
  LicenseManagerReportGeneratorArn?: string;
  LastRunStatus?: string;
  LastRunFailureReason?: string;
  LastReportGenerationTime?: string;
  ReportCreatorAccount?: string;
  Description?: string;
  S3Location?: S3Location;
  CreateTime?: string;
  Tags?: Tag[];
}
export const ReportGenerator = S.suspend(() =>
  S.Struct({
    ReportGeneratorName: S.optional(S.String),
    ReportType: S.optional(ReportTypeList),
    ReportContext: S.optional(ReportContext),
    ReportFrequency: S.optional(ReportFrequency),
    LicenseManagerReportGeneratorArn: S.optional(S.String),
    LastRunStatus: S.optional(S.String),
    LastRunFailureReason: S.optional(S.String),
    LastReportGenerationTime: S.optional(S.String),
    ReportCreatorAccount: S.optional(S.String),
    Description: S.optional(S.String),
    S3Location: S.optional(S3Location),
    CreateTime: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "ReportGenerator",
}) as any as S.Schema<ReportGenerator>;
export type ReportGeneratorList = ReportGenerator[];
export const ReportGeneratorList = S.Array(ReportGenerator);
export interface IssuerDetails {
  Name?: string;
  SignKey?: string;
  KeyFingerprint?: string;
}
export const IssuerDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    SignKey: S.optional(S.String),
    KeyFingerprint: S.optional(S.String),
  }),
).annotations({
  identifier: "IssuerDetails",
}) as any as S.Schema<IssuerDetails>;
export interface License {
  LicenseArn?: string;
  LicenseName?: string;
  ProductName?: string;
  ProductSKU?: string;
  Issuer?: IssuerDetails;
  HomeRegion?: string;
  Status?: LicenseStatus;
  Validity?: DatetimeRange;
  Beneficiary?: string;
  Entitlements?: Entitlement[];
  ConsumptionConfiguration?: ConsumptionConfiguration;
  LicenseMetadata?: Metadata[];
  CreateTime?: string;
  Version?: string;
}
export const License = S.suspend(() =>
  S.Struct({
    LicenseArn: S.optional(S.String),
    LicenseName: S.optional(S.String),
    ProductName: S.optional(S.String),
    ProductSKU: S.optional(S.String),
    Issuer: S.optional(IssuerDetails),
    HomeRegion: S.optional(S.String),
    Status: S.optional(LicenseStatus),
    Validity: S.optional(DatetimeRange),
    Beneficiary: S.optional(S.String),
    Entitlements: S.optional(EntitlementList),
    ConsumptionConfiguration: S.optional(ConsumptionConfiguration),
    LicenseMetadata: S.optional(MetadataList),
    CreateTime: S.optional(S.String),
    Version: S.optional(S.String),
  }),
).annotations({ identifier: "License" }) as any as S.Schema<License>;
export type LicenseList = License[];
export const LicenseList = S.Array(License);
export interface Grant {
  GrantArn: string;
  GrantName: string;
  ParentArn: string;
  LicenseArn: string;
  GranteePrincipalArn: string;
  HomeRegion: string;
  GrantStatus: GrantStatus;
  StatusReason?: string;
  Version: string;
  GrantedOperations: AllowedOperation[];
  Options?: Options;
}
export const Grant = S.suspend(() =>
  S.Struct({
    GrantArn: S.String,
    GrantName: S.String,
    ParentArn: S.String,
    LicenseArn: S.String,
    GranteePrincipalArn: S.String,
    HomeRegion: S.String,
    GrantStatus: GrantStatus,
    StatusReason: S.optional(S.String),
    Version: S.String,
    GrantedOperations: AllowedOperationList,
    Options: S.optional(Options),
  }),
).annotations({ identifier: "Grant" }) as any as S.Schema<Grant>;
export type GrantList = Grant[];
export const GrantList = S.Array(Grant);
export interface InventoryFilter {
  Name: string;
  Condition: InventoryFilterCondition;
  Value?: string;
}
export const InventoryFilter = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Condition: InventoryFilterCondition,
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "InventoryFilter",
}) as any as S.Schema<InventoryFilter>;
export type InventoryFilterList = InventoryFilter[];
export const InventoryFilterList = S.Array(InventoryFilter);
export interface LicenseSpecification {
  LicenseConfigurationArn: string;
  AmiAssociationScope?: string;
}
export const LicenseSpecification = S.suspend(() =>
  S.Struct({
    LicenseConfigurationArn: S.String,
    AmiAssociationScope: S.optional(S.String),
  }),
).annotations({
  identifier: "LicenseSpecification",
}) as any as S.Schema<LicenseSpecification>;
export type LicenseSpecifications = LicenseSpecification[];
export const LicenseSpecifications = S.Array(LicenseSpecification);
export type ProductCodeType = "marketplace";
export const ProductCodeType = S.Literal("marketplace");
export interface AcceptGrantResponse {
  GrantArn?: string;
  Status?: GrantStatus;
  Version?: string;
}
export const AcceptGrantResponse = S.suspend(() =>
  S.Struct({
    GrantArn: S.optional(S.String),
    Status: S.optional(GrantStatus),
    Version: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AcceptGrantResponse",
}) as any as S.Schema<AcceptGrantResponse>;
export interface CheckoutBorrowLicenseRequest {
  LicenseArn: string;
  Entitlements: EntitlementData[];
  DigitalSignatureMethod: DigitalSignatureMethod;
  NodeId?: string;
  CheckoutMetadata?: Metadata[];
  ClientToken: string;
}
export const CheckoutBorrowLicenseRequest = S.suspend(() =>
  S.Struct({
    LicenseArn: S.String,
    Entitlements: EntitlementDataList,
    DigitalSignatureMethod: DigitalSignatureMethod,
    NodeId: S.optional(S.String),
    CheckoutMetadata: S.optional(MetadataList),
    ClientToken: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CheckoutBorrowLicenseRequest",
}) as any as S.Schema<CheckoutBorrowLicenseRequest>;
export interface CheckoutLicenseResponse {
  CheckoutType?: CheckoutType;
  LicenseConsumptionToken?: string;
  EntitlementsAllowed?: EntitlementData[];
  SignedToken?: string;
  NodeId?: string;
  IssuedAt?: string;
  Expiration?: string;
  LicenseArn?: string;
}
export const CheckoutLicenseResponse = S.suspend(() =>
  S.Struct({
    CheckoutType: S.optional(CheckoutType),
    LicenseConsumptionToken: S.optional(S.String),
    EntitlementsAllowed: S.optional(EntitlementDataList),
    SignedToken: S.optional(S.String),
    NodeId: S.optional(S.String),
    IssuedAt: S.optional(S.String),
    Expiration: S.optional(S.String),
    LicenseArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CheckoutLicenseResponse",
}) as any as S.Schema<CheckoutLicenseResponse>;
export interface CreateGrantRequest {
  ClientToken: string;
  GrantName: string;
  LicenseArn: string;
  Principals: string[];
  HomeRegion: string;
  AllowedOperations: AllowedOperation[];
  Tags?: Tag[];
}
export const CreateGrantRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.String,
    GrantName: S.String,
    LicenseArn: S.String,
    Principals: PrincipalArnList,
    HomeRegion: S.String,
    AllowedOperations: AllowedOperationList,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGrantRequest",
}) as any as S.Schema<CreateGrantRequest>;
export interface CreateGrantVersionRequest {
  ClientToken: string;
  GrantArn: string;
  GrantName?: string;
  AllowedOperations?: AllowedOperation[];
  Status?: GrantStatus;
  StatusReason?: string;
  SourceVersion?: string;
  Options?: Options;
}
export const CreateGrantVersionRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.String,
    GrantArn: S.String,
    GrantName: S.optional(S.String),
    AllowedOperations: S.optional(AllowedOperationList),
    Status: S.optional(GrantStatus),
    StatusReason: S.optional(S.String),
    SourceVersion: S.optional(S.String),
    Options: S.optional(Options),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGrantVersionRequest",
}) as any as S.Schema<CreateGrantVersionRequest>;
export interface CreateLicenseAssetGroupRequest {
  Name: string;
  Description?: string;
  LicenseAssetGroupConfigurations: LicenseAssetGroupConfiguration[];
  AssociatedLicenseAssetRulesetARNs: string[];
  Properties?: LicenseAssetGroupProperty[];
  Tags?: Tag[];
  ClientToken: string;
}
export const CreateLicenseAssetGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    LicenseAssetGroupConfigurations: LicenseAssetGroupConfigurationList,
    AssociatedLicenseAssetRulesetARNs: LicenseAssetRulesetArnList,
    Properties: S.optional(LicenseAssetGroupPropertyList),
    Tags: S.optional(TagList),
    ClientToken: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLicenseAssetGroupRequest",
}) as any as S.Schema<CreateLicenseAssetGroupRequest>;
export interface CreateLicenseManagerReportGeneratorRequest {
  ReportGeneratorName: string;
  Type: ReportType[];
  ReportContext: ReportContext;
  ReportFrequency: ReportFrequency;
  ClientToken: string;
  Description?: string;
  Tags?: Tag[];
}
export const CreateLicenseManagerReportGeneratorRequest = S.suspend(() =>
  S.Struct({
    ReportGeneratorName: S.String,
    Type: ReportTypeList,
    ReportContext: ReportContext,
    ReportFrequency: ReportFrequency,
    ClientToken: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLicenseManagerReportGeneratorRequest",
}) as any as S.Schema<CreateLicenseManagerReportGeneratorRequest>;
export interface CreateLicenseVersionResponse {
  LicenseArn?: string;
  Version?: string;
  Status?: LicenseStatus;
}
export const CreateLicenseVersionResponse = S.suspend(() =>
  S.Struct({
    LicenseArn: S.optional(S.String),
    Version: S.optional(S.String),
    Status: S.optional(LicenseStatus),
  }).pipe(ns),
).annotations({
  identifier: "CreateLicenseVersionResponse",
}) as any as S.Schema<CreateLicenseVersionResponse>;
export interface CreateTokenResponse {
  TokenId?: string;
  TokenType?: TokenType;
  Token?: string;
}
export const CreateTokenResponse = S.suspend(() =>
  S.Struct({
    TokenId: S.optional(S.String),
    TokenType: S.optional(TokenType),
    Token: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateTokenResponse",
}) as any as S.Schema<CreateTokenResponse>;
export interface DeleteGrantResponse {
  GrantArn?: string;
  Status?: GrantStatus;
  Version?: string;
}
export const DeleteGrantResponse = S.suspend(() =>
  S.Struct({
    GrantArn: S.optional(S.String),
    Status: S.optional(GrantStatus),
    Version: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeleteGrantResponse",
}) as any as S.Schema<DeleteGrantResponse>;
export interface DeleteLicenseResponse {
  Status?: LicenseDeletionStatus;
  DeletionDate?: string;
}
export const DeleteLicenseResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(LicenseDeletionStatus),
    DeletionDate: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeleteLicenseResponse",
}) as any as S.Schema<DeleteLicenseResponse>;
export interface DeleteLicenseAssetGroupResponse {
  Status: LicenseAssetGroupStatus;
}
export const DeleteLicenseAssetGroupResponse = S.suspend(() =>
  S.Struct({ Status: LicenseAssetGroupStatus }).pipe(ns),
).annotations({
  identifier: "DeleteLicenseAssetGroupResponse",
}) as any as S.Schema<DeleteLicenseAssetGroupResponse>;
export interface ExtendLicenseConsumptionResponse {
  LicenseConsumptionToken?: string;
  Expiration?: string;
}
export const ExtendLicenseConsumptionResponse = S.suspend(() =>
  S.Struct({
    LicenseConsumptionToken: S.optional(S.String),
    Expiration: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ExtendLicenseConsumptionResponse",
}) as any as S.Schema<ExtendLicenseConsumptionResponse>;
export interface GetAccessTokenResponse {
  AccessToken?: string;
}
export const GetAccessTokenResponse = S.suspend(() =>
  S.Struct({ AccessToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetAccessTokenResponse",
}) as any as S.Schema<GetAccessTokenResponse>;
export interface ProductCodeListItem {
  ProductCodeId: string;
  ProductCodeType: ProductCodeType;
}
export const ProductCodeListItem = S.suspend(() =>
  S.Struct({ ProductCodeId: S.String, ProductCodeType: ProductCodeType }),
).annotations({
  identifier: "ProductCodeListItem",
}) as any as S.Schema<ProductCodeListItem>;
export type ProductCodeList = ProductCodeListItem[];
export const ProductCodeList = S.Array(ProductCodeListItem);
export interface LicenseConversionContext {
  UsageOperation?: string;
  ProductCodes?: ProductCodeListItem[];
}
export const LicenseConversionContext = S.suspend(() =>
  S.Struct({
    UsageOperation: S.optional(S.String),
    ProductCodes: S.optional(ProductCodeList),
  }),
).annotations({
  identifier: "LicenseConversionContext",
}) as any as S.Schema<LicenseConversionContext>;
export interface GetLicenseConversionTaskResponse {
  LicenseConversionTaskId?: string;
  ResourceArn?: string;
  SourceLicenseContext?: LicenseConversionContext;
  DestinationLicenseContext?: LicenseConversionContext;
  StatusMessage?: string;
  Status?: LicenseConversionTaskStatus;
  StartTime?: Date;
  LicenseConversionTime?: Date;
  EndTime?: Date;
}
export const GetLicenseConversionTaskResponse = S.suspend(() =>
  S.Struct({
    LicenseConversionTaskId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    SourceLicenseContext: S.optional(LicenseConversionContext),
    DestinationLicenseContext: S.optional(LicenseConversionContext),
    StatusMessage: S.optional(S.String),
    Status: S.optional(LicenseConversionTaskStatus),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LicenseConversionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "GetLicenseConversionTaskResponse",
}) as any as S.Schema<GetLicenseConversionTaskResponse>;
export interface ListDistributedGrantsRequest {
  GrantArns?: string[];
  Filters?: Filter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListDistributedGrantsRequest = S.suspend(() =>
  S.Struct({
    GrantArns: S.optional(ArnList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDistributedGrantsRequest",
}) as any as S.Schema<ListDistributedGrantsRequest>;
export interface ListLicenseAssetGroupsResponse {
  LicenseAssetGroups?: LicenseAssetGroup[];
  NextToken?: string;
}
export const ListLicenseAssetGroupsResponse = S.suspend(() =>
  S.Struct({
    LicenseAssetGroups: S.optional(LicenseAssetGroupList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLicenseAssetGroupsResponse",
}) as any as S.Schema<ListLicenseAssetGroupsResponse>;
export interface ListLicenseAssetRulesetsResponse {
  LicenseAssetRulesets?: LicenseAssetRuleset[];
  NextToken?: string;
}
export const ListLicenseAssetRulesetsResponse = S.suspend(() =>
  S.Struct({
    LicenseAssetRulesets: S.optional(LicenseAssetRulesetList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLicenseAssetRulesetsResponse",
}) as any as S.Schema<ListLicenseAssetRulesetsResponse>;
export type ResourceType =
  | "EC2_INSTANCE"
  | "EC2_HOST"
  | "EC2_AMI"
  | "RDS"
  | "SYSTEMS_MANAGER_MANAGED_INSTANCE";
export const ResourceType = S.Literal(
  "EC2_INSTANCE",
  "EC2_HOST",
  "EC2_AMI",
  "RDS",
  "SYSTEMS_MANAGER_MANAGED_INSTANCE",
);
export interface ConsumedLicenseSummary {
  ResourceType?: ResourceType;
  ConsumedLicenses?: number;
}
export const ConsumedLicenseSummary = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(ResourceType),
    ConsumedLicenses: S.optional(S.Number),
  }),
).annotations({
  identifier: "ConsumedLicenseSummary",
}) as any as S.Schema<ConsumedLicenseSummary>;
export type ConsumedLicenseSummaryList = ConsumedLicenseSummary[];
export const ConsumedLicenseSummaryList = S.Array(ConsumedLicenseSummary);
export interface ManagedResourceSummary {
  ResourceType?: ResourceType;
  AssociationCount?: number;
}
export const ManagedResourceSummary = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(ResourceType),
    AssociationCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ManagedResourceSummary",
}) as any as S.Schema<ManagedResourceSummary>;
export type ManagedResourceSummaryList = ManagedResourceSummary[];
export const ManagedResourceSummaryList = S.Array(ManagedResourceSummary);
export interface AutomatedDiscoveryInformation {
  LastRunTime?: Date;
}
export const AutomatedDiscoveryInformation = S.suspend(() =>
  S.Struct({
    LastRunTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AutomatedDiscoveryInformation",
}) as any as S.Schema<AutomatedDiscoveryInformation>;
export interface LicenseConfiguration {
  LicenseConfigurationId?: string;
  LicenseConfigurationArn?: string;
  Name?: string;
  Description?: string;
  LicenseCountingType?: LicenseCountingType;
  LicenseRules?: string[];
  LicenseCount?: number;
  LicenseCountHardLimit?: boolean;
  DisassociateWhenNotFound?: boolean;
  ConsumedLicenses?: number;
  Status?: string;
  OwnerAccountId?: string;
  ConsumedLicenseSummaryList?: ConsumedLicenseSummary[];
  ManagedResourceSummaryList?: ManagedResourceSummary[];
  ProductInformationList?: ProductInformation[];
  AutomatedDiscoveryInformation?: AutomatedDiscoveryInformation;
  LicenseExpiry?: number;
}
export const LicenseConfiguration = S.suspend(() =>
  S.Struct({
    LicenseConfigurationId: S.optional(S.String),
    LicenseConfigurationArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LicenseCountingType: S.optional(LicenseCountingType),
    LicenseRules: S.optional(StringList),
    LicenseCount: S.optional(S.Number),
    LicenseCountHardLimit: S.optional(S.Boolean),
    DisassociateWhenNotFound: S.optional(S.Boolean),
    ConsumedLicenses: S.optional(S.Number),
    Status: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    ConsumedLicenseSummaryList: S.optional(ConsumedLicenseSummaryList),
    ManagedResourceSummaryList: S.optional(ManagedResourceSummaryList),
    ProductInformationList: S.optional(ProductInformationList),
    AutomatedDiscoveryInformation: S.optional(AutomatedDiscoveryInformation),
    LicenseExpiry: S.optional(S.Number),
  }),
).annotations({
  identifier: "LicenseConfiguration",
}) as any as S.Schema<LicenseConfiguration>;
export type LicenseConfigurations = LicenseConfiguration[];
export const LicenseConfigurations = S.Array(LicenseConfiguration);
export interface ListLicenseConfigurationsForOrganizationResponse {
  LicenseConfigurations?: LicenseConfiguration[];
  NextToken?: string;
}
export const ListLicenseConfigurationsForOrganizationResponse = S.suspend(() =>
  S.Struct({
    LicenseConfigurations: S.optional(LicenseConfigurations),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLicenseConfigurationsForOrganizationResponse",
}) as any as S.Schema<ListLicenseConfigurationsForOrganizationResponse>;
export interface ListLicenseManagerReportGeneratorsResponse {
  ReportGenerators?: ReportGenerator[];
  NextToken?: string;
}
export const ListLicenseManagerReportGeneratorsResponse = S.suspend(() =>
  S.Struct({
    ReportGenerators: S.optional(ReportGeneratorList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLicenseManagerReportGeneratorsResponse",
}) as any as S.Schema<ListLicenseManagerReportGeneratorsResponse>;
export interface ListLicensesResponse {
  Licenses?: License[];
  NextToken?: string;
}
export const ListLicensesResponse = S.suspend(() =>
  S.Struct({
    Licenses: S.optional(LicenseList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLicensesResponse",
}) as any as S.Schema<ListLicensesResponse>;
export interface ListLicenseSpecificationsForResourceResponse {
  LicenseSpecifications?: LicenseSpecification[];
  NextToken?: string;
}
export const ListLicenseSpecificationsForResourceResponse = S.suspend(() =>
  S.Struct({
    LicenseSpecifications: S.optional(LicenseSpecifications),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLicenseSpecificationsForResourceResponse",
}) as any as S.Schema<ListLicenseSpecificationsForResourceResponse>;
export interface ListLicenseVersionsResponse {
  Licenses?: License[];
  NextToken?: string;
}
export const ListLicenseVersionsResponse = S.suspend(() =>
  S.Struct({
    Licenses: S.optional(LicenseList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLicenseVersionsResponse",
}) as any as S.Schema<ListLicenseVersionsResponse>;
export interface ListReceivedGrantsResponse {
  Grants?: Grant[];
  NextToken?: string;
}
export const ListReceivedGrantsResponse = S.suspend(() =>
  S.Struct({
    Grants: S.optional(GrantList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListReceivedGrantsResponse",
}) as any as S.Schema<ListReceivedGrantsResponse>;
export interface ListReceivedGrantsForOrganizationResponse {
  Grants?: Grant[];
  NextToken?: string;
}
export const ListReceivedGrantsForOrganizationResponse = S.suspend(() =>
  S.Struct({
    Grants: S.optional(GrantList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListReceivedGrantsForOrganizationResponse",
}) as any as S.Schema<ListReceivedGrantsForOrganizationResponse>;
export type ReceivedStatus =
  | "PENDING_WORKFLOW"
  | "PENDING_ACCEPT"
  | "REJECTED"
  | "ACTIVE"
  | "FAILED_WORKFLOW"
  | "DELETED"
  | "DISABLED"
  | "WORKFLOW_COMPLETED";
export const ReceivedStatus = S.Literal(
  "PENDING_WORKFLOW",
  "PENDING_ACCEPT",
  "REJECTED",
  "ACTIVE",
  "FAILED_WORKFLOW",
  "DELETED",
  "DISABLED",
  "WORKFLOW_COMPLETED",
);
export interface ReceivedMetadata {
  ReceivedStatus?: ReceivedStatus;
  ReceivedStatusReason?: string;
  AllowedOperations?: AllowedOperation[];
}
export const ReceivedMetadata = S.suspend(() =>
  S.Struct({
    ReceivedStatus: S.optional(ReceivedStatus),
    ReceivedStatusReason: S.optional(S.String),
    AllowedOperations: S.optional(AllowedOperationList),
  }),
).annotations({
  identifier: "ReceivedMetadata",
}) as any as S.Schema<ReceivedMetadata>;
export interface GrantedLicense {
  LicenseArn?: string;
  LicenseName?: string;
  ProductName?: string;
  ProductSKU?: string;
  Issuer?: IssuerDetails;
  HomeRegion?: string;
  Status?: LicenseStatus;
  Validity?: DatetimeRange;
  Beneficiary?: string;
  Entitlements?: Entitlement[];
  ConsumptionConfiguration?: ConsumptionConfiguration;
  LicenseMetadata?: Metadata[];
  CreateTime?: string;
  Version?: string;
  ReceivedMetadata?: ReceivedMetadata;
}
export const GrantedLicense = S.suspend(() =>
  S.Struct({
    LicenseArn: S.optional(S.String),
    LicenseName: S.optional(S.String),
    ProductName: S.optional(S.String),
    ProductSKU: S.optional(S.String),
    Issuer: S.optional(IssuerDetails),
    HomeRegion: S.optional(S.String),
    Status: S.optional(LicenseStatus),
    Validity: S.optional(DatetimeRange),
    Beneficiary: S.optional(S.String),
    Entitlements: S.optional(EntitlementList),
    ConsumptionConfiguration: S.optional(ConsumptionConfiguration),
    LicenseMetadata: S.optional(MetadataList),
    CreateTime: S.optional(S.String),
    Version: S.optional(S.String),
    ReceivedMetadata: S.optional(ReceivedMetadata),
  }),
).annotations({
  identifier: "GrantedLicense",
}) as any as S.Schema<GrantedLicense>;
export type GrantedLicenseList = GrantedLicense[];
export const GrantedLicenseList = S.Array(GrantedLicense);
export interface ListReceivedLicensesForOrganizationResponse {
  Licenses?: GrantedLicense[];
  NextToken?: string;
}
export const ListReceivedLicensesForOrganizationResponse = S.suspend(() =>
  S.Struct({
    Licenses: S.optional(GrantedLicenseList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListReceivedLicensesForOrganizationResponse",
}) as any as S.Schema<ListReceivedLicensesForOrganizationResponse>;
export interface ListResourceInventoryRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: InventoryFilter[];
}
export const ListResourceInventoryRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(InventoryFilterList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceInventoryRequest",
}) as any as S.Schema<ListResourceInventoryRequest>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RejectGrantResponse {
  GrantArn?: string;
  Status?: GrantStatus;
  Version?: string;
}
export const RejectGrantResponse = S.suspend(() =>
  S.Struct({
    GrantArn: S.optional(S.String),
    Status: S.optional(GrantStatus),
    Version: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "RejectGrantResponse",
}) as any as S.Schema<RejectGrantResponse>;
export interface UpdateLicenseAssetGroupResponse {
  LicenseAssetGroupArn: string;
  Status: string;
}
export const UpdateLicenseAssetGroupResponse = S.suspend(() =>
  S.Struct({ LicenseAssetGroupArn: S.String, Status: S.String }).pipe(ns),
).annotations({
  identifier: "UpdateLicenseAssetGroupResponse",
}) as any as S.Schema<UpdateLicenseAssetGroupResponse>;
export interface UpdateLicenseAssetRulesetResponse {
  LicenseAssetRulesetArn: string;
}
export const UpdateLicenseAssetRulesetResponse = S.suspend(() =>
  S.Struct({ LicenseAssetRulesetArn: S.String }).pipe(ns),
).annotations({
  identifier: "UpdateLicenseAssetRulesetResponse",
}) as any as S.Schema<UpdateLicenseAssetRulesetResponse>;
export interface UpdateLicenseSpecificationsForResourceRequest {
  ResourceArn: string;
  AddLicenseSpecifications?: LicenseSpecification[];
  RemoveLicenseSpecifications?: LicenseSpecification[];
}
export const UpdateLicenseSpecificationsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    AddLicenseSpecifications: S.optional(LicenseSpecifications),
    RemoveLicenseSpecifications: S.optional(LicenseSpecifications),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLicenseSpecificationsForResourceRequest",
}) as any as S.Schema<UpdateLicenseSpecificationsForResourceRequest>;
export interface UpdateLicenseSpecificationsForResourceResponse {}
export const UpdateLicenseSpecificationsForResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateLicenseSpecificationsForResourceResponse",
}) as any as S.Schema<UpdateLicenseSpecificationsForResourceResponse>;
export interface CrossAccountDiscoveryServiceStatus {
  Message?: string;
}
export const CrossAccountDiscoveryServiceStatus = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "CrossAccountDiscoveryServiceStatus",
}) as any as S.Schema<CrossAccountDiscoveryServiceStatus>;
export interface Asset {
  AssetArn?: string;
  LatestAssetDiscoveryTime?: Date;
}
export const Asset = S.suspend(() =>
  S.Struct({
    AssetArn: S.optional(S.String),
    LatestAssetDiscoveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Asset" }) as any as S.Schema<Asset>;
export type AssetList = Asset[];
export const AssetList = S.Array(Asset);
export interface LicenseConfigurationAssociation {
  ResourceArn?: string;
  ResourceType?: ResourceType;
  ResourceOwnerId?: string;
  AssociationTime?: Date;
  AmiAssociationScope?: string;
}
export const LicenseConfigurationAssociation = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
    ResourceOwnerId: S.optional(S.String),
    AssociationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AmiAssociationScope: S.optional(S.String),
  }),
).annotations({
  identifier: "LicenseConfigurationAssociation",
}) as any as S.Schema<LicenseConfigurationAssociation>;
export type LicenseConfigurationAssociations =
  LicenseConfigurationAssociation[];
export const LicenseConfigurationAssociations = S.Array(
  LicenseConfigurationAssociation,
);
export interface LicenseOperationFailure {
  ResourceArn?: string;
  ResourceType?: ResourceType;
  ErrorMessage?: string;
  FailureTime?: Date;
  OperationName?: string;
  ResourceOwnerId?: string;
  OperationRequestedBy?: string;
  MetadataList?: Metadata[];
}
export const LicenseOperationFailure = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
    ErrorMessage: S.optional(S.String),
    FailureTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    OperationName: S.optional(S.String),
    ResourceOwnerId: S.optional(S.String),
    OperationRequestedBy: S.optional(S.String),
    MetadataList: S.optional(MetadataList),
  }),
).annotations({
  identifier: "LicenseOperationFailure",
}) as any as S.Schema<LicenseOperationFailure>;
export type LicenseOperationFailureList = LicenseOperationFailure[];
export const LicenseOperationFailureList = S.Array(LicenseOperationFailure);
export interface LicenseConversionTask {
  LicenseConversionTaskId?: string;
  ResourceArn?: string;
  SourceLicenseContext?: LicenseConversionContext;
  DestinationLicenseContext?: LicenseConversionContext;
  Status?: LicenseConversionTaskStatus;
  StatusMessage?: string;
  StartTime?: Date;
  LicenseConversionTime?: Date;
  EndTime?: Date;
}
export const LicenseConversionTask = S.suspend(() =>
  S.Struct({
    LicenseConversionTaskId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    SourceLicenseContext: S.optional(LicenseConversionContext),
    DestinationLicenseContext: S.optional(LicenseConversionContext),
    Status: S.optional(LicenseConversionTaskStatus),
    StatusMessage: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LicenseConversionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "LicenseConversionTask",
}) as any as S.Schema<LicenseConversionTask>;
export type LicenseConversionTasks = LicenseConversionTask[];
export const LicenseConversionTasks = S.Array(LicenseConversionTask);
export interface TokenData {
  TokenId?: string;
  TokenType?: string;
  LicenseArn?: string;
  ExpirationTime?: string;
  TokenProperties?: string[];
  RoleArns?: string[];
  Status?: string;
}
export const TokenData = S.suspend(() =>
  S.Struct({
    TokenId: S.optional(S.String),
    TokenType: S.optional(S.String),
    LicenseArn: S.optional(S.String),
    ExpirationTime: S.optional(S.String),
    TokenProperties: S.optional(MaxSize3StringList),
    RoleArns: S.optional(ArnList),
    Status: S.optional(S.String),
  }),
).annotations({ identifier: "TokenData" }) as any as S.Schema<TokenData>;
export type TokenList = TokenData[];
export const TokenList = S.Array(TokenData);
export interface LicenseConfigurationUsage {
  ResourceArn?: string;
  ResourceType?: ResourceType;
  ResourceStatus?: string;
  ResourceOwnerId?: string;
  AssociationTime?: Date;
  ConsumedLicenses?: number;
}
export const LicenseConfigurationUsage = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
    ResourceStatus: S.optional(S.String),
    ResourceOwnerId: S.optional(S.String),
    AssociationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ConsumedLicenses: S.optional(S.Number),
  }),
).annotations({
  identifier: "LicenseConfigurationUsage",
}) as any as S.Schema<LicenseConfigurationUsage>;
export type LicenseConfigurationUsageList = LicenseConfigurationUsage[];
export const LicenseConfigurationUsageList = S.Array(LicenseConfigurationUsage);
export interface CheckoutBorrowLicenseResponse {
  LicenseArn?: string;
  LicenseConsumptionToken?: string;
  EntitlementsAllowed?: EntitlementData[];
  NodeId?: string;
  SignedToken?: string;
  IssuedAt?: string;
  Expiration?: string;
  CheckoutMetadata?: Metadata[];
}
export const CheckoutBorrowLicenseResponse = S.suspend(() =>
  S.Struct({
    LicenseArn: S.optional(S.String),
    LicenseConsumptionToken: S.optional(S.String),
    EntitlementsAllowed: S.optional(EntitlementDataList),
    NodeId: S.optional(S.String),
    SignedToken: S.optional(S.String),
    IssuedAt: S.optional(S.String),
    Expiration: S.optional(S.String),
    CheckoutMetadata: S.optional(MetadataList),
  }).pipe(ns),
).annotations({
  identifier: "CheckoutBorrowLicenseResponse",
}) as any as S.Schema<CheckoutBorrowLicenseResponse>;
export interface CreateGrantResponse {
  GrantArn?: string;
  Status?: GrantStatus;
  Version?: string;
}
export const CreateGrantResponse = S.suspend(() =>
  S.Struct({
    GrantArn: S.optional(S.String),
    Status: S.optional(GrantStatus),
    Version: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateGrantResponse",
}) as any as S.Schema<CreateGrantResponse>;
export interface CreateGrantVersionResponse {
  GrantArn?: string;
  Status?: GrantStatus;
  Version?: string;
}
export const CreateGrantVersionResponse = S.suspend(() =>
  S.Struct({
    GrantArn: S.optional(S.String),
    Status: S.optional(GrantStatus),
    Version: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateGrantVersionResponse",
}) as any as S.Schema<CreateGrantVersionResponse>;
export interface CreateLicenseRequest {
  LicenseName: string;
  ProductName: string;
  ProductSKU: string;
  Issuer: Issuer;
  HomeRegion: string;
  Validity: DatetimeRange;
  Entitlements: Entitlement[];
  Beneficiary: string;
  ConsumptionConfiguration: ConsumptionConfiguration;
  LicenseMetadata?: Metadata[];
  ClientToken: string;
  Tags?: Tag[];
}
export const CreateLicenseRequest = S.suspend(() =>
  S.Struct({
    LicenseName: S.String,
    ProductName: S.String,
    ProductSKU: S.String,
    Issuer: Issuer,
    HomeRegion: S.String,
    Validity: DatetimeRange,
    Entitlements: EntitlementList,
    Beneficiary: S.String,
    ConsumptionConfiguration: ConsumptionConfiguration,
    LicenseMetadata: S.optional(MetadataList),
    ClientToken: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLicenseRequest",
}) as any as S.Schema<CreateLicenseRequest>;
export interface CreateLicenseAssetGroupResponse {
  LicenseAssetGroupArn: string;
  Status: string;
}
export const CreateLicenseAssetGroupResponse = S.suspend(() =>
  S.Struct({ LicenseAssetGroupArn: S.String, Status: S.String }).pipe(ns),
).annotations({
  identifier: "CreateLicenseAssetGroupResponse",
}) as any as S.Schema<CreateLicenseAssetGroupResponse>;
export interface CreateLicenseConfigurationRequest {
  Name: string;
  Description?: string;
  LicenseCountingType: LicenseCountingType;
  LicenseCount?: number;
  LicenseCountHardLimit?: boolean;
  LicenseRules?: string[];
  Tags?: Tag[];
  DisassociateWhenNotFound?: boolean;
  ProductInformationList?: ProductInformation[];
  LicenseExpiry?: number;
}
export const CreateLicenseConfigurationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    LicenseCountingType: LicenseCountingType,
    LicenseCount: S.optional(S.Number),
    LicenseCountHardLimit: S.optional(S.Boolean),
    LicenseRules: S.optional(StringList),
    Tags: S.optional(TagList),
    DisassociateWhenNotFound: S.optional(S.Boolean),
    ProductInformationList: S.optional(ProductInformationList),
    LicenseExpiry: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLicenseConfigurationRequest",
}) as any as S.Schema<CreateLicenseConfigurationRequest>;
export interface CreateLicenseConversionTaskForResourceRequest {
  ResourceArn: string;
  SourceLicenseContext: LicenseConversionContext;
  DestinationLicenseContext: LicenseConversionContext;
}
export const CreateLicenseConversionTaskForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    SourceLicenseContext: LicenseConversionContext,
    DestinationLicenseContext: LicenseConversionContext,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLicenseConversionTaskForResourceRequest",
}) as any as S.Schema<CreateLicenseConversionTaskForResourceRequest>;
export interface CreateLicenseManagerReportGeneratorResponse {
  LicenseManagerReportGeneratorArn?: string;
}
export const CreateLicenseManagerReportGeneratorResponse = S.suspend(() =>
  S.Struct({ LicenseManagerReportGeneratorArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateLicenseManagerReportGeneratorResponse",
}) as any as S.Schema<CreateLicenseManagerReportGeneratorResponse>;
export interface GetGrantResponse {
  Grant?: Grant;
}
export const GetGrantResponse = S.suspend(() =>
  S.Struct({ Grant: S.optional(Grant) }).pipe(ns),
).annotations({
  identifier: "GetGrantResponse",
}) as any as S.Schema<GetGrantResponse>;
export interface GetLicenseAssetGroupResponse {
  LicenseAssetGroup: LicenseAssetGroup;
}
export const GetLicenseAssetGroupResponse = S.suspend(() =>
  S.Struct({ LicenseAssetGroup: LicenseAssetGroup }).pipe(ns),
).annotations({
  identifier: "GetLicenseAssetGroupResponse",
}) as any as S.Schema<GetLicenseAssetGroupResponse>;
export interface GetLicenseAssetRulesetResponse {
  LicenseAssetRuleset: LicenseAssetRuleset;
}
export const GetLicenseAssetRulesetResponse = S.suspend(() =>
  S.Struct({ LicenseAssetRuleset: LicenseAssetRuleset }).pipe(ns),
).annotations({
  identifier: "GetLicenseAssetRulesetResponse",
}) as any as S.Schema<GetLicenseAssetRulesetResponse>;
export interface GetLicenseConfigurationResponse {
  LicenseConfigurationId?: string;
  LicenseConfigurationArn?: string;
  Name?: string;
  Description?: string;
  LicenseCountingType?: LicenseCountingType;
  LicenseRules?: string[];
  LicenseCount?: number;
  LicenseCountHardLimit?: boolean;
  ConsumedLicenses?: number;
  Status?: string;
  OwnerAccountId?: string;
  ConsumedLicenseSummaryList?: ConsumedLicenseSummary[];
  ManagedResourceSummaryList?: ManagedResourceSummary[];
  Tags?: Tag[];
  ProductInformationList?: ProductInformation[];
  AutomatedDiscoveryInformation?: AutomatedDiscoveryInformation;
  DisassociateWhenNotFound?: boolean;
  LicenseExpiry?: number;
}
export const GetLicenseConfigurationResponse = S.suspend(() =>
  S.Struct({
    LicenseConfigurationId: S.optional(S.String),
    LicenseConfigurationArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LicenseCountingType: S.optional(LicenseCountingType),
    LicenseRules: S.optional(StringList),
    LicenseCount: S.optional(S.Number),
    LicenseCountHardLimit: S.optional(S.Boolean),
    ConsumedLicenses: S.optional(S.Number),
    Status: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    ConsumedLicenseSummaryList: S.optional(ConsumedLicenseSummaryList),
    ManagedResourceSummaryList: S.optional(ManagedResourceSummaryList),
    Tags: S.optional(TagList),
    ProductInformationList: S.optional(ProductInformationList),
    AutomatedDiscoveryInformation: S.optional(AutomatedDiscoveryInformation),
    DisassociateWhenNotFound: S.optional(S.Boolean),
    LicenseExpiry: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "GetLicenseConfigurationResponse",
}) as any as S.Schema<GetLicenseConfigurationResponse>;
export interface ListAssetsForLicenseAssetGroupResponse {
  Assets?: Asset[];
  NextToken?: string;
}
export const ListAssetsForLicenseAssetGroupResponse = S.suspend(() =>
  S.Struct({
    Assets: S.optional(AssetList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAssetsForLicenseAssetGroupResponse",
}) as any as S.Schema<ListAssetsForLicenseAssetGroupResponse>;
export interface ListAssociationsForLicenseConfigurationResponse {
  LicenseConfigurationAssociations?: LicenseConfigurationAssociation[];
  NextToken?: string;
}
export const ListAssociationsForLicenseConfigurationResponse = S.suspend(() =>
  S.Struct({
    LicenseConfigurationAssociations: S.optional(
      LicenseConfigurationAssociations,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAssociationsForLicenseConfigurationResponse",
}) as any as S.Schema<ListAssociationsForLicenseConfigurationResponse>;
export interface ListDistributedGrantsResponse {
  Grants?: Grant[];
  NextToken?: string;
}
export const ListDistributedGrantsResponse = S.suspend(() =>
  S.Struct({
    Grants: S.optional(GrantList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDistributedGrantsResponse",
}) as any as S.Schema<ListDistributedGrantsResponse>;
export interface ListFailuresForLicenseConfigurationOperationsResponse {
  LicenseOperationFailureList?: LicenseOperationFailure[];
  NextToken?: string;
}
export const ListFailuresForLicenseConfigurationOperationsResponse = S.suspend(
  () =>
    S.Struct({
      LicenseOperationFailureList: S.optional(LicenseOperationFailureList),
      NextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "ListFailuresForLicenseConfigurationOperationsResponse",
}) as any as S.Schema<ListFailuresForLicenseConfigurationOperationsResponse>;
export interface ListLicenseConfigurationsResponse {
  LicenseConfigurations?: LicenseConfiguration[];
  NextToken?: string;
}
export const ListLicenseConfigurationsResponse = S.suspend(() =>
  S.Struct({
    LicenseConfigurations: S.optional(LicenseConfigurations),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLicenseConfigurationsResponse",
}) as any as S.Schema<ListLicenseConfigurationsResponse>;
export interface ListLicenseConversionTasksResponse {
  LicenseConversionTasks?: LicenseConversionTask[];
  NextToken?: string;
}
export const ListLicenseConversionTasksResponse = S.suspend(() =>
  S.Struct({
    LicenseConversionTasks: S.optional(LicenseConversionTasks),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLicenseConversionTasksResponse",
}) as any as S.Schema<ListLicenseConversionTasksResponse>;
export interface ListTokensResponse {
  Tokens?: TokenData[];
  NextToken?: string;
}
export const ListTokensResponse = S.suspend(() =>
  S.Struct({
    Tokens: S.optional(TokenList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTokensResponse",
}) as any as S.Schema<ListTokensResponse>;
export interface ListUsageForLicenseConfigurationResponse {
  LicenseConfigurationUsageList?: LicenseConfigurationUsage[];
  NextToken?: string;
}
export const ListUsageForLicenseConfigurationResponse = S.suspend(() =>
  S.Struct({
    LicenseConfigurationUsageList: S.optional(LicenseConfigurationUsageList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUsageForLicenseConfigurationResponse",
}) as any as S.Schema<ListUsageForLicenseConfigurationResponse>;
export interface EntitlementUsage {
  Name: string;
  ConsumedValue: string;
  MaxCount?: string;
  Unit: EntitlementDataUnit;
}
export const EntitlementUsage = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ConsumedValue: S.String,
    MaxCount: S.optional(S.String),
    Unit: EntitlementDataUnit,
  }),
).annotations({
  identifier: "EntitlementUsage",
}) as any as S.Schema<EntitlementUsage>;
export type EntitlementUsageList = EntitlementUsage[];
export const EntitlementUsageList = S.Array(EntitlementUsage);
export interface RegionStatus {
  Status?: string;
}
export const RegionStatus = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({ identifier: "RegionStatus" }) as any as S.Schema<RegionStatus>;
export interface LicenseUsage {
  EntitlementUsages?: EntitlementUsage[];
}
export const LicenseUsage = S.suspend(() =>
  S.Struct({ EntitlementUsages: S.optional(EntitlementUsageList) }),
).annotations({ identifier: "LicenseUsage" }) as any as S.Schema<LicenseUsage>;
export interface ResourceInventory {
  ResourceId?: string;
  ResourceType?: ResourceType;
  ResourceArn?: string;
  Platform?: string;
  PlatformVersion?: string;
  ResourceOwningAccountId?: string;
  MarketplaceProductCodes?: string[];
  UsageOperation?: string;
  AmiId?: string;
  HostId?: string;
  Region?: string;
  InstanceType?: string;
}
export const ResourceInventory = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
    ResourceArn: S.optional(S.String),
    Platform: S.optional(S.String),
    PlatformVersion: S.optional(S.String),
    ResourceOwningAccountId: S.optional(S.String),
    MarketplaceProductCodes: S.optional(StringList),
    UsageOperation: S.optional(S.String),
    AmiId: S.optional(S.String),
    HostId: S.optional(S.String),
    Region: S.optional(S.String),
    InstanceType: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceInventory",
}) as any as S.Schema<ResourceInventory>;
export type ResourceInventoryList = ResourceInventory[];
export const ResourceInventoryList = S.Array(ResourceInventory);
export type RegionStatusMap = { [key: string]: RegionStatus };
export const RegionStatusMap = S.Record({ key: S.String, value: RegionStatus });
export interface CreateLicenseResponse {
  LicenseArn?: string;
  Status?: LicenseStatus;
  Version?: string;
}
export const CreateLicenseResponse = S.suspend(() =>
  S.Struct({
    LicenseArn: S.optional(S.String),
    Status: S.optional(LicenseStatus),
    Version: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateLicenseResponse",
}) as any as S.Schema<CreateLicenseResponse>;
export interface CreateLicenseConfigurationResponse {
  LicenseConfigurationArn?: string;
}
export const CreateLicenseConfigurationResponse = S.suspend(() =>
  S.Struct({ LicenseConfigurationArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateLicenseConfigurationResponse",
}) as any as S.Schema<CreateLicenseConfigurationResponse>;
export interface CreateLicenseConversionTaskForResourceResponse {
  LicenseConversionTaskId?: string;
}
export const CreateLicenseConversionTaskForResourceResponse = S.suspend(() =>
  S.Struct({ LicenseConversionTaskId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateLicenseConversionTaskForResourceResponse",
}) as any as S.Schema<CreateLicenseConversionTaskForResourceResponse>;
export interface GetLicenseResponse {
  License?: License;
}
export const GetLicenseResponse = S.suspend(() =>
  S.Struct({ License: S.optional(License) }).pipe(ns),
).annotations({
  identifier: "GetLicenseResponse",
}) as any as S.Schema<GetLicenseResponse>;
export interface GetLicenseManagerReportGeneratorResponse {
  ReportGenerator?: ReportGenerator;
}
export const GetLicenseManagerReportGeneratorResponse = S.suspend(() =>
  S.Struct({ ReportGenerator: S.optional(ReportGenerator) }).pipe(ns),
).annotations({
  identifier: "GetLicenseManagerReportGeneratorResponse",
}) as any as S.Schema<GetLicenseManagerReportGeneratorResponse>;
export interface GetLicenseUsageResponse {
  LicenseUsage?: LicenseUsage;
}
export const GetLicenseUsageResponse = S.suspend(() =>
  S.Struct({ LicenseUsage: S.optional(LicenseUsage) }).pipe(ns),
).annotations({
  identifier: "GetLicenseUsageResponse",
}) as any as S.Schema<GetLicenseUsageResponse>;
export interface ListReceivedLicensesResponse {
  Licenses?: GrantedLicense[];
  NextToken?: string;
}
export const ListReceivedLicensesResponse = S.suspend(() =>
  S.Struct({
    Licenses: S.optional(GrantedLicenseList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListReceivedLicensesResponse",
}) as any as S.Schema<ListReceivedLicensesResponse>;
export interface ListResourceInventoryResponse {
  ResourceInventoryList?: ResourceInventory[];
  NextToken?: string;
}
export const ListResourceInventoryResponse = S.suspend(() =>
  S.Struct({
    ResourceInventoryList: S.optional(ResourceInventoryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResourceInventoryResponse",
}) as any as S.Schema<ListResourceInventoryResponse>;
export interface CrossRegionDiscoveryStatus {
  Message?: { [key: string]: RegionStatus };
}
export const CrossRegionDiscoveryStatus = S.suspend(() =>
  S.Struct({ Message: S.optional(RegionStatusMap) }),
).annotations({
  identifier: "CrossRegionDiscoveryStatus",
}) as any as S.Schema<CrossRegionDiscoveryStatus>;
export interface ServiceStatus {
  CrossAccountDiscovery?: CrossAccountDiscoveryServiceStatus;
  CrossRegionDiscovery?: CrossRegionDiscoveryStatus;
}
export const ServiceStatus = S.suspend(() =>
  S.Struct({
    CrossAccountDiscovery: S.optional(CrossAccountDiscoveryServiceStatus),
    CrossRegionDiscovery: S.optional(CrossRegionDiscoveryStatus),
  }),
).annotations({
  identifier: "ServiceStatus",
}) as any as S.Schema<ServiceStatus>;
export interface CreateLicenseAssetRulesetRequest {
  Name: string;
  Description?: string;
  Rules: LicenseAssetRule[];
  Tags?: Tag[];
  ClientToken: string;
}
export const CreateLicenseAssetRulesetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Rules: LicenseAssetRuleList,
    Tags: S.optional(TagList),
    ClientToken: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLicenseAssetRulesetRequest",
}) as any as S.Schema<CreateLicenseAssetRulesetRequest>;
export interface GetServiceSettingsResponse {
  S3BucketArn?: string;
  SnsTopicArn?: string;
  OrganizationConfiguration?: OrganizationConfiguration;
  EnableCrossAccountsDiscovery?: boolean;
  LicenseManagerResourceShareArn?: string;
  CrossRegionDiscoveryHomeRegion?: string;
  CrossRegionDiscoverySourceRegions?: string[];
  ServiceStatus?: ServiceStatus;
}
export const GetServiceSettingsResponse = S.suspend(() =>
  S.Struct({
    S3BucketArn: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    OrganizationConfiguration: S.optional(OrganizationConfiguration),
    EnableCrossAccountsDiscovery: S.optional(S.Boolean),
    LicenseManagerResourceShareArn: S.optional(S.String),
    CrossRegionDiscoveryHomeRegion: S.optional(S.String),
    CrossRegionDiscoverySourceRegions: S.optional(StringList),
    ServiceStatus: S.optional(ServiceStatus),
  }).pipe(ns),
).annotations({
  identifier: "GetServiceSettingsResponse",
}) as any as S.Schema<GetServiceSettingsResponse>;
export interface CreateLicenseAssetRulesetResponse {
  LicenseAssetRulesetArn: string;
}
export const CreateLicenseAssetRulesetResponse = S.suspend(() =>
  S.Struct({ LicenseAssetRulesetArn: S.String }).pipe(ns),
).annotations({
  identifier: "CreateLicenseAssetRulesetResponse",
}) as any as S.Schema<CreateLicenseAssetRulesetResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceAccessDenied", httpResponseCode: 401 }),
).pipe(C.withAuthError) {}
export class AuthorizationException extends S.TaggedError<AuthorizationException>()(
  "AuthorizationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AuthorizationFailure", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConflictException", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class EntitlementNotAllowedException extends S.TaggedError<EntitlementNotAllowedException>()(
  "EntitlementNotAllowedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidParameterValueProvided",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class FilterLimitExceededException extends S.TaggedError<FilterLimitExceededException>()(
  "FilterLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "FilterLimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class RateLimitExceededException extends S.TaggedError<RateLimitExceededException>()(
  "RateLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "RateLimitExceeded", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class FailedDependencyException extends S.TaggedError<FailedDependencyException>()(
  "FailedDependencyException",
  { Message: S.optional(S.String), ErrorCode: S.optional(S.String) },
  T.AwsQueryError({ code: "FailedDependency", httpResponseCode: 424 }),
) {}
export class ServerInternalException extends S.TaggedError<ServerInternalException>()(
  "ServerInternalException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalError", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class RedirectException extends S.TaggedError<RedirectException>()(
  "RedirectException",
  {
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    Message: S.optional(S.String),
  },
) {}
export class InvalidResourceStateException extends S.TaggedError<InvalidResourceStateException>()(
  "InvalidResourceStateException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidResourceState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceLimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NoEntitlementsAllowedException extends S.TaggedError<NoEntitlementsAllowedException>()(
  "NoEntitlementsAllowedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidResource.NotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LicenseUsageException extends S.TaggedError<LicenseUsageException>()(
  "LicenseUsageException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LicenseUsageFailure", httpResponseCode: 412 }),
) {}
export class UnsupportedDigitalSignatureMethodException extends S.TaggedError<UnsupportedDigitalSignatureMethodException>()(
  "UnsupportedDigitalSignatureMethodException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Modifies the attributes of an existing license configuration.
 */
export const updateLicenseConfiguration: (
  input: UpdateLicenseConfigurationRequest,
) => effect.Effect<
  UpdateLicenseConfigurationResponse,
  | AccessDeniedException
  | AuthorizationException
  | ConflictException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLicenseConfigurationRequest,
  output: UpdateLicenseConfigurationResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    ConflictException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Gets detailed information about the specified license configuration.
 */
export const getLicenseConfiguration: (
  input: GetLicenseConfigurationRequest,
) => effect.Effect<
  GetLicenseConfigurationResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseConfigurationRequest,
  output: GetLicenseConfigurationResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists the license configuration operations that failed.
 */
export const listFailuresForLicenseConfigurationOperations: (
  input: ListFailuresForLicenseConfigurationOperationsRequest,
) => effect.Effect<
  ListFailuresForLicenseConfigurationOperationsResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFailuresForLicenseConfigurationOperationsRequest,
  output: ListFailuresForLicenseConfigurationOperationsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists the license type conversion tasks for your account.
 */
export const listLicenseConversionTasks: (
  input: ListLicenseConversionTasksRequest,
) => effect.Effect<
  ListLicenseConversionTasksResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicenseConversionTasksRequest,
  output: ListLicenseConversionTasksResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Gets information about the specified license type conversion task.
 */
export const getLicenseConversionTask: (
  input: GetLicenseConversionTaskRequest,
) => effect.Effect<
  GetLicenseConversionTaskResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseConversionTaskRequest,
  output: GetLicenseConversionTaskResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Describes the license configurations for the specified resource.
 */
export const listLicenseSpecificationsForResource: (
  input: ListLicenseSpecificationsForResourceRequest,
) => effect.Effect<
  ListLicenseSpecificationsForResourceResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicenseSpecificationsForResourceRequest,
  output: ListLicenseSpecificationsForResourceResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists all versions of the specified license.
 */
export const listLicenseVersions: (
  input: ListLicenseVersionsRequest,
) => effect.Effect<
  ListLicenseVersionsResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicenseVersionsRequest,
  output: ListLicenseVersionsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Deletes the specified license configuration.
 *
 * You cannot delete a license configuration that is in use.
 */
export const deleteLicenseConfiguration: (
  input: DeleteLicenseConfigurationRequest,
) => effect.Effect<
  DeleteLicenseConfigurationResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLicenseConfigurationRequest,
  output: DeleteLicenseConfigurationResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists the license configurations for your account.
 */
export const listLicenseConfigurations: (
  input: ListLicenseConfigurationsRequest,
) => effect.Effect<
  ListLicenseConfigurationsResponse,
  | AccessDeniedException
  | AuthorizationException
  | FilterLimitExceededException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicenseConfigurationsRequest,
  output: ListLicenseConfigurationsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    FilterLimitExceededException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists all license usage records for a license configuration, displaying license
 * consumption details by resource at a selected point in time. Use this action to audit the
 * current license consumption for any license inventory and configuration.
 */
export const listUsageForLicenseConfiguration: (
  input: ListUsageForLicenseConfigurationRequest,
) => effect.Effect<
  ListUsageForLicenseConfigurationResponse,
  | AccessDeniedException
  | AuthorizationException
  | FilterLimitExceededException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUsageForLicenseConfigurationRequest,
  output: ListUsageForLicenseConfigurationResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    FilterLimitExceededException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists license configurations for an organization.
 */
export const listLicenseConfigurationsForOrganization: (
  input: ListLicenseConfigurationsForOrganizationRequest,
) => effect.Effect<
  ListLicenseConfigurationsForOrganizationResponse,
  | AccessDeniedException
  | AuthorizationException
  | FilterLimitExceededException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicenseConfigurationsForOrganizationRequest,
  output: ListLicenseConfigurationsForOrganizationResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    FilterLimitExceededException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists the resource associations for the specified license configuration.
 *
 * Resource associations need not consume licenses from a license configuration.
 * For example, an AMI or a stopped instance might not consume a license (depending on
 * the license rules).
 */
export const listAssociationsForLicenseConfiguration: (
  input: ListAssociationsForLicenseConfigurationRequest,
) => effect.Effect<
  ListAssociationsForLicenseConfigurationResponse,
  | AccessDeniedException
  | AuthorizationException
  | FilterLimitExceededException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssociationsForLicenseConfigurationRequest,
  output: ListAssociationsForLicenseConfigurationResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    FilterLimitExceededException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Gets the License Manager settings for the current Region.
 */
export const getServiceSettings: (
  input: GetServiceSettingsRequest,
) => effect.Effect<
  GetServiceSettingsResponse,
  | AccessDeniedException
  | AuthorizationException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceSettingsRequest,
  output: GetServiceSettingsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists resources managed using Systems Manager inventory.
 */
export const listResourceInventory: (
  input: ListResourceInventoryRequest,
) => effect.Effect<
  ListResourceInventoryResponse,
  | AccessDeniedException
  | AuthorizationException
  | FailedDependencyException
  | FilterLimitExceededException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResourceInventoryRequest,
  output: ListResourceInventoryResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    FailedDependencyException,
    FilterLimitExceededException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Creates a license configuration.
 *
 * A license configuration is an abstraction of a customer license agreement that can be
 * consumed and enforced by License Manager. Components include specifications for the license
 * type (licensing by instance, socket, CPU, or vCPU), allowed tenancy (shared tenancy,
 * Dedicated Instance, Dedicated Host, or all of these), license affinity to host (how long a
 * license must be associated with a host), and the number of licenses purchased and used.
 */
export const createLicenseConfiguration: (
  input: CreateLicenseConfigurationRequest,
) => effect.Effect<
  CreateLicenseConfigurationResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLicenseConfigurationRequest,
  output: CreateLicenseConfigurationResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists your tokens.
 */
export const listTokens: (
  input: ListTokensRequest,
) => effect.Effect<
  ListTokensResponse,
  | AccessDeniedException
  | AuthorizationException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTokensRequest,
  output: ListTokensResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Adds or removes the specified license configurations for the specified Amazon Web Services resource.
 *
 * You can update the license specifications of AMIs, instances, and hosts.
 * You cannot update the license specifications for launch templates and CloudFormation templates,
 * as they send license configurations to the operation that creates the resource.
 */
export const updateLicenseSpecificationsForResource: (
  input: UpdateLicenseSpecificationsForResourceRequest,
) => effect.Effect<
  UpdateLicenseSpecificationsForResourceResponse,
  | AccessDeniedException
  | AuthorizationException
  | ConflictException
  | InvalidParameterValueException
  | InvalidResourceStateException
  | LicenseUsageException
  | RateLimitExceededException
  | ServerInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLicenseSpecificationsForResourceRequest,
  output: UpdateLicenseSpecificationsForResourceResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    ConflictException,
    InvalidParameterValueException,
    InvalidResourceStateException,
    LicenseUsageException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Extends the expiration date for license consumption.
 */
export const extendLicenseConsumption: (
  input: ExtendLicenseConsumptionRequest,
) => effect.Effect<
  ExtendLicenseConsumptionResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExtendLicenseConsumptionRequest,
  output: ExtendLicenseConsumptionResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Updates License Manager settings for the current Region.
 */
export const updateServiceSettings: (
  input: UpdateServiceSettingsRequest,
) => effect.Effect<
  UpdateServiceSettingsResponse,
  | AccessDeniedException
  | AuthorizationException
  | ConflictException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceSettingsRequest,
  output: UpdateServiceSettingsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    ConflictException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a license asset group.
 */
export const createLicenseAssetGroup: (
  input: CreateLicenseAssetGroupRequest,
) => effect.Effect<
  CreateLicenseAssetGroupResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLicenseAssetGroupRequest,
  output: CreateLicenseAssetGroupResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets a license asset group.
 */
export const getLicenseAssetGroup: (
  input: GetLicenseAssetGroupRequest,
) => effect.Effect<
  GetLicenseAssetGroupResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseAssetGroupRequest,
  output: GetLicenseAssetGroupResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets a license asset ruleset.
 */
export const getLicenseAssetRuleset: (
  input: GetLicenseAssetRulesetRequest,
) => effect.Effect<
  GetLicenseAssetRulesetResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseAssetRulesetRequest,
  output: GetLicenseAssetRulesetResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists assets for a license asset group.
 */
export const listAssetsForLicenseAssetGroup: (
  input: ListAssetsForLicenseAssetGroupRequest,
) => effect.Effect<
  ListAssetsForLicenseAssetGroupResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssetsForLicenseAssetGroupRequest,
  output: ListAssetsForLicenseAssetGroupResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Deletes a license asset group.
 */
export const deleteLicenseAssetGroup: (
  input: DeleteLicenseAssetGroupRequest,
) => effect.Effect<
  DeleteLicenseAssetGroupResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLicenseAssetGroupRequest,
  output: DeleteLicenseAssetGroupResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists license asset groups.
 */
export const listLicenseAssetGroups: (
  input: ListLicenseAssetGroupsRequest,
) => effect.Effect<
  ListLicenseAssetGroupsResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicenseAssetGroupsRequest,
  output: ListLicenseAssetGroupsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists license asset rulesets.
 */
export const listLicenseAssetRulesets: (
  input: ListLicenseAssetRulesetsRequest,
) => effect.Effect<
  ListLicenseAssetRulesetsResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicenseAssetRulesetsRequest,
  output: ListLicenseAssetRulesetsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists the licenses for your account.
 */
export const listLicenses: (
  input: ListLicensesRequest,
) => effect.Effect<
  ListLicensesResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicensesRequest,
  output: ListLicensesResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists the tags for the specified resource. For more information about tagging support in
 * License Manager, see the TagResource operation.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Updates a license asset group.
 */
export const updateLicenseAssetGroup: (
  input: UpdateLicenseAssetGroupRequest,
) => effect.Effect<
  UpdateLicenseAssetGroupResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLicenseAssetGroupRequest,
  output: UpdateLicenseAssetGroupResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Updates a license asset ruleset.
 */
export const updateLicenseAssetRuleset: (
  input: UpdateLicenseAssetRulesetRequest,
) => effect.Effect<
  UpdateLicenseAssetRulesetResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLicenseAssetRulesetRequest,
  output: UpdateLicenseAssetRulesetResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Deletes a license asset ruleset.
 */
export const deleteLicenseAssetRuleset: (
  input: DeleteLicenseAssetRulesetRequest,
) => effect.Effect<
  DeleteLicenseAssetRulesetResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLicenseAssetRulesetRequest,
  output: DeleteLicenseAssetRulesetResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Adds the specified tags to the specified resource. The following resources support
 * tagging in License Manager:
 *
 * - Licenses
 *
 * - Grants
 *
 * - License configurations
 *
 * - Report generators
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets a temporary access token to use with AssumeRoleWithWebIdentity. Access tokens
 * are valid for one hour.
 */
export const getAccessToken: (
  input: GetAccessTokenRequest,
) => effect.Effect<
  GetAccessTokenResponse,
  | AccessDeniedException
  | AuthorizationException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessTokenRequest,
  output: GetAccessTokenResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a new license conversion task.
 */
export const createLicenseConversionTaskForResource: (
  input: CreateLicenseConversionTaskForResourceRequest,
) => effect.Effect<
  CreateLicenseConversionTaskForResourceResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLicenseConversionTaskForResourceRequest,
  output: CreateLicenseConversionTaskForResourceResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets detailed information about the specified license.
 */
export const getLicense: (
  input: GetLicenseRequest,
) => effect.Effect<
  GetLicenseResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseRequest,
  output: GetLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets detailed information about the usage of the specified license.
 */
export const getLicenseUsage: (
  input: GetLicenseUsageRequest,
) => effect.Effect<
  GetLicenseUsageResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseUsageRequest,
  output: GetLicenseUsageResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified license.
 */
export const deleteLicense: (
  input: DeleteLicenseRequest,
) => effect.Effect<
  DeleteLicenseResponse,
  | AccessDeniedException
  | AuthorizationException
  | ConflictException
  | InvalidParameterValueException
  | RateLimitExceededException
  | RedirectException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLicenseRequest,
  output: DeleteLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    ConflictException,
    InvalidParameterValueException,
    RateLimitExceededException,
    RedirectException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a long-lived token.
 *
 * A refresh token is a JWT token used to get an access token. With an access token,
 * you can call AssumeRoleWithWebIdentity to get role credentials that you can use to
 * call License Manager to manage the specified license.
 */
export const createToken: (
  input: CreateTokenRequest,
) => effect.Effect<
  CreateTokenResponse,
  | AccessDeniedException
  | AuthorizationException
  | RateLimitExceededException
  | RedirectException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTokenRequest,
  output: CreateTokenResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    RedirectException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified token. Must be called in the license home Region.
 */
export const deleteToken: (
  input: DeleteTokenRequest,
) => effect.Effect<
  DeleteTokenResponse,
  | AccessDeniedException
  | AuthorizationException
  | RateLimitExceededException
  | RedirectException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTokenRequest,
  output: DeleteTokenResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    RedirectException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a license.
 */
export const createLicense: (
  input: CreateLicenseRequest,
) => effect.Effect<
  CreateLicenseResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | RedirectException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLicenseRequest,
  output: CreateLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    RedirectException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a new version of the specified grant. For more information, see
 * Granted licenses in License Manager in the *License Manager User Guide*.
 */
export const createGrantVersion: (
  input: CreateGrantVersionRequest,
) => effect.Effect<
  CreateGrantVersionResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGrantVersionRequest,
  output: CreateGrantVersionResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a report generator.
 */
export const createLicenseManagerReportGenerator: (
  input: CreateLicenseManagerReportGeneratorRequest,
) => effect.Effect<
  CreateLicenseManagerReportGeneratorResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLicenseManagerReportGeneratorRequest,
  output: CreateLicenseManagerReportGeneratorResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets detailed information about the specified grant.
 */
export const getGrant: (
  input: GetGrantRequest,
) => effect.Effect<
  GetGrantResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGrantRequest,
  output: GetGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists the grants distributed for the specified license.
 */
export const listDistributedGrants: (
  input: ListDistributedGrantsRequest,
) => effect.Effect<
  ListDistributedGrantsResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDistributedGrantsRequest,
  output: ListDistributedGrantsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified grant.
 */
export const deleteGrant: (
  input: DeleteGrantRequest,
) => effect.Effect<
  DeleteGrantResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGrantRequest,
  output: DeleteGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists the report generators for your account.
 */
export const listLicenseManagerReportGenerators: (
  input: ListLicenseManagerReportGeneratorsRequest,
) => effect.Effect<
  ListLicenseManagerReportGeneratorsResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicenseManagerReportGeneratorsRequest,
  output: ListLicenseManagerReportGeneratorsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists grants that are received. Received grants are grants created while specifying the
 * recipient as this Amazon Web Services account, your organization, or an organizational unit
 * (OU) to which this member account belongs.
 */
export const listReceivedGrants: (
  input: ListReceivedGrantsRequest,
) => effect.Effect<
  ListReceivedGrantsResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReceivedGrantsRequest,
  output: ListReceivedGrantsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists the grants received for all accounts in the organization.
 */
export const listReceivedGrantsForOrganization: (
  input: ListReceivedGrantsForOrganizationRequest,
) => effect.Effect<
  ListReceivedGrantsForOrganizationResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReceivedGrantsForOrganizationRequest,
  output: ListReceivedGrantsForOrganizationResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists the licenses received for all accounts in the organization.
 */
export const listReceivedLicensesForOrganization: (
  input: ListReceivedLicensesForOrganizationRequest,
) => effect.Effect<
  ListReceivedLicensesForOrganizationResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReceivedLicensesForOrganizationRequest,
  output: ListReceivedLicensesForOrganizationResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Rejects the specified grant.
 */
export const rejectGrant: (
  input: RejectGrantRequest,
) => effect.Effect<
  RejectGrantResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectGrantRequest,
  output: RejectGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified report generator.
 *
 * This action deletes the report generator, which stops it from generating future reports.
 * The action cannot be reversed. It has no effect on the previous reports from this generator.
 */
export const deleteLicenseManagerReportGenerator: (
  input: DeleteLicenseManagerReportGeneratorRequest,
) => effect.Effect<
  DeleteLicenseManagerReportGeneratorResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLicenseManagerReportGeneratorRequest,
  output: DeleteLicenseManagerReportGeneratorResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Updates a report generator.
 *
 * After you make changes to a report generator, it starts generating new reports within 60 minutes of being updated.
 */
export const updateLicenseManagerReportGenerator: (
  input: UpdateLicenseManagerReportGeneratorRequest,
) => effect.Effect<
  UpdateLicenseManagerReportGeneratorResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLicenseManagerReportGeneratorRequest,
  output: UpdateLicenseManagerReportGeneratorResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Accepts the specified grant.
 */
export const acceptGrant: (
  input: AcceptGrantRequest,
) => effect.Effect<
  AcceptGrantResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptGrantRequest,
  output: AcceptGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a grant for the specified license. A grant shares the use of license
 * entitlements with a specific Amazon Web Services account, an organization, or an
 * organizational unit (OU). For more information, see Granted licenses in License Manager in the *License Manager User Guide*.
 */
export const createGrant: (
  input: CreateGrantRequest,
) => effect.Effect<
  CreateGrantResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGrantRequest,
  output: CreateGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified report generator.
 */
export const getLicenseManagerReportGenerator: (
  input: GetLicenseManagerReportGeneratorRequest,
) => effect.Effect<
  GetLicenseManagerReportGeneratorResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseManagerReportGeneratorRequest,
  output: GetLicenseManagerReportGeneratorResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists received licenses.
 */
export const listReceivedLicenses: (
  input: ListReceivedLicensesRequest,
) => effect.Effect<
  ListReceivedLicensesResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReceivedLicensesRequest,
  output: ListReceivedLicensesResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Checks in the specified license. Check in a license when it is no longer in use.
 */
export const checkInLicense: (
  input: CheckInLicenseRequest,
) => effect.Effect<
  CheckInLicenseResponse,
  | AccessDeniedException
  | AuthorizationException
  | ConflictException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckInLicenseRequest,
  output: CheckInLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    ConflictException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a new version of the specified license.
 */
export const createLicenseVersion: (
  input: CreateLicenseVersionRequest,
) => effect.Effect<
  CreateLicenseVersionResponse,
  | AccessDeniedException
  | AuthorizationException
  | ConflictException
  | RateLimitExceededException
  | RedirectException
  | ResourceNotFoundException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLicenseVersionRequest,
  output: CreateLicenseVersionResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    ConflictException,
    RateLimitExceededException,
    RedirectException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a license asset ruleset.
 */
export const createLicenseAssetRuleset: (
  input: CreateLicenseAssetRulesetRequest,
) => effect.Effect<
  CreateLicenseAssetRulesetResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | RateLimitExceededException
  | ServerInternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLicenseAssetRulesetRequest,
  output: CreateLicenseAssetRulesetResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Checks out the specified license for offline use.
 */
export const checkoutBorrowLicense: (
  input: CheckoutBorrowLicenseRequest,
) => effect.Effect<
  CheckoutBorrowLicenseResponse,
  | AccessDeniedException
  | AuthorizationException
  | EntitlementNotAllowedException
  | InvalidParameterValueException
  | NoEntitlementsAllowedException
  | RateLimitExceededException
  | RedirectException
  | ResourceNotFoundException
  | ServerInternalException
  | UnsupportedDigitalSignatureMethodException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckoutBorrowLicenseRequest,
  output: CheckoutBorrowLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    EntitlementNotAllowedException,
    InvalidParameterValueException,
    NoEntitlementsAllowedException,
    RateLimitExceededException,
    RedirectException,
    ResourceNotFoundException,
    ServerInternalException,
    UnsupportedDigitalSignatureMethodException,
    ValidationException,
  ],
}));
/**
 * Checks out the specified license.
 *
 * If the account that created the license is the same that is performing the check out, you must
 * specify the account as the beneficiary.
 */
export const checkoutLicense: (
  input: CheckoutLicenseRequest,
) => effect.Effect<
  CheckoutLicenseResponse,
  | AccessDeniedException
  | AuthorizationException
  | InvalidParameterValueException
  | NoEntitlementsAllowedException
  | RateLimitExceededException
  | RedirectException
  | ResourceNotFoundException
  | ServerInternalException
  | UnsupportedDigitalSignatureMethodException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckoutLicenseRequest,
  output: CheckoutLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    NoEntitlementsAllowedException,
    RateLimitExceededException,
    RedirectException,
    ResourceNotFoundException,
    ServerInternalException,
    UnsupportedDigitalSignatureMethodException,
    ValidationException,
  ],
}));

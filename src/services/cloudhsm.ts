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
  sdkId: "CloudHSM",
  serviceShapeName: "CloudHsmFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "cloudhsm" });
const ver = T.ServiceVersion("2014-05-30");
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
              `https://cloudhsm-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cloudhsm-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cloudhsm.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cloudhsm.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Label = string;
export type SubnetId = string;
export type SshKey = string;
export type IpAddress = string;
export type IamRoleArn = string;
export type ExternalId = string;
export type ClientToken = string;
export type ClientLabel = string;
export type Certificate = string;
export type HapgArn = string;
export type HsmArn = string;
export type ClientArn = string;
export type HsmSerialNumber = string;
export type CertificateFingerprint = string;
export type AZ = string;
export type PaginationToken = string;
export type PartitionSerial = string;
export type TagKey = string;
export type TagValue = string;
export type Timestamp = string;
export type EniId = string;
export type VpcId = string;
export type PartitionArn = string;

//# Schemas
export interface ListAvailableZonesRequest {}
export const ListAvailableZonesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAvailableZonesRequest",
}) as any as S.Schema<ListAvailableZonesRequest>;
export type HapgList = string[];
export const HapgList = S.Array(S.String);
export type AZList = string[];
export const AZList = S.Array(S.String);
export type PartitionSerialList = string[];
export const PartitionSerialList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateHapgRequest {
  Label: string;
}
export const CreateHapgRequest = S.suspend(() =>
  S.Struct({ Label: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateHapgRequest",
}) as any as S.Schema<CreateHapgRequest>;
export interface CreateHsmRequest {
  SubnetId: string;
  SshKey: string;
  EniIp?: string;
  IamRoleArn: string;
  ExternalId?: string;
  SubscriptionType: string;
  ClientToken?: string;
  SyslogIp?: string;
}
export const CreateHsmRequest = S.suspend(() =>
  S.Struct({
    SubnetId: S.String.pipe(T.XmlName("SubnetId")),
    SshKey: S.String.pipe(T.XmlName("SshKey")),
    EniIp: S.optional(S.String).pipe(T.XmlName("EniIp")),
    IamRoleArn: S.String.pipe(T.XmlName("IamRoleArn")),
    ExternalId: S.optional(S.String).pipe(T.XmlName("ExternalId")),
    SubscriptionType: S.String.pipe(T.XmlName("SubscriptionType")),
    ClientToken: S.optional(S.String).pipe(T.XmlName("ClientToken")),
    SyslogIp: S.optional(S.String).pipe(T.XmlName("SyslogIp")),
  }).pipe(
    T.all(
      T.XmlName("CreateHsmRequest"),
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateHsmRequest",
}) as any as S.Schema<CreateHsmRequest>;
export interface CreateLunaClientRequest {
  Label?: string;
  Certificate: string;
}
export const CreateLunaClientRequest = S.suspend(() =>
  S.Struct({ Label: S.optional(S.String), Certificate: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLunaClientRequest",
}) as any as S.Schema<CreateLunaClientRequest>;
export interface DeleteHapgRequest {
  HapgArn: string;
}
export const DeleteHapgRequest = S.suspend(() =>
  S.Struct({ HapgArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteHapgRequest",
}) as any as S.Schema<DeleteHapgRequest>;
export interface DeleteHsmRequest {
  HsmArn: string;
}
export const DeleteHsmRequest = S.suspend(() =>
  S.Struct({ HsmArn: S.String.pipe(T.XmlName("HsmArn")) }).pipe(
    T.all(
      T.XmlName("DeleteHsmRequest"),
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteHsmRequest",
}) as any as S.Schema<DeleteHsmRequest>;
export interface DeleteLunaClientRequest {
  ClientArn: string;
}
export const DeleteLunaClientRequest = S.suspend(() =>
  S.Struct({ ClientArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteLunaClientRequest",
}) as any as S.Schema<DeleteLunaClientRequest>;
export interface DescribeHapgRequest {
  HapgArn: string;
}
export const DescribeHapgRequest = S.suspend(() =>
  S.Struct({ HapgArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeHapgRequest",
}) as any as S.Schema<DescribeHapgRequest>;
export interface DescribeHsmRequest {
  HsmArn?: string;
  HsmSerialNumber?: string;
}
export const DescribeHsmRequest = S.suspend(() =>
  S.Struct({
    HsmArn: S.optional(S.String),
    HsmSerialNumber: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeHsmRequest",
}) as any as S.Schema<DescribeHsmRequest>;
export interface DescribeLunaClientRequest {
  ClientArn?: string;
  CertificateFingerprint?: string;
}
export const DescribeLunaClientRequest = S.suspend(() =>
  S.Struct({
    ClientArn: S.optional(S.String),
    CertificateFingerprint: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLunaClientRequest",
}) as any as S.Schema<DescribeLunaClientRequest>;
export interface GetConfigRequest {
  ClientArn: string;
  ClientVersion: string;
  HapgList: HapgList;
}
export const GetConfigRequest = S.suspend(() =>
  S.Struct({
    ClientArn: S.String,
    ClientVersion: S.String,
    HapgList: HapgList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetConfigRequest",
}) as any as S.Schema<GetConfigRequest>;
export interface ListAvailableZonesResponse {
  AZList?: AZList;
}
export const ListAvailableZonesResponse = S.suspend(() =>
  S.Struct({ AZList: S.optional(AZList) }),
).annotations({
  identifier: "ListAvailableZonesResponse",
}) as any as S.Schema<ListAvailableZonesResponse>;
export interface ListHapgsRequest {
  NextToken?: string;
}
export const ListHapgsRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListHapgsRequest",
}) as any as S.Schema<ListHapgsRequest>;
export interface ListHsmsRequest {
  NextToken?: string;
}
export const ListHsmsRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListHsmsRequest",
}) as any as S.Schema<ListHsmsRequest>;
export interface ListLunaClientsRequest {
  NextToken?: string;
}
export const ListLunaClientsRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLunaClientsRequest",
}) as any as S.Schema<ListLunaClientsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ModifyHapgRequest {
  HapgArn: string;
  Label?: string;
  PartitionSerialList?: PartitionSerialList;
}
export const ModifyHapgRequest = S.suspend(() =>
  S.Struct({
    HapgArn: S.String,
    Label: S.optional(S.String),
    PartitionSerialList: S.optional(PartitionSerialList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ModifyHapgRequest",
}) as any as S.Schema<ModifyHapgRequest>;
export interface ModifyHsmRequest {
  HsmArn: string;
  SubnetId?: string;
  EniIp?: string;
  IamRoleArn?: string;
  ExternalId?: string;
  SyslogIp?: string;
}
export const ModifyHsmRequest = S.suspend(() =>
  S.Struct({
    HsmArn: S.String.pipe(T.XmlName("HsmArn")),
    SubnetId: S.optional(S.String).pipe(T.XmlName("SubnetId")),
    EniIp: S.optional(S.String).pipe(T.XmlName("EniIp")),
    IamRoleArn: S.optional(S.String).pipe(T.XmlName("IamRoleArn")),
    ExternalId: S.optional(S.String).pipe(T.XmlName("ExternalId")),
    SyslogIp: S.optional(S.String).pipe(T.XmlName("SyslogIp")),
  }).pipe(
    T.all(
      T.XmlName("ModifyHsmRequest"),
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyHsmRequest",
}) as any as S.Schema<ModifyHsmRequest>;
export interface ModifyLunaClientRequest {
  ClientArn: string;
  Certificate: string;
}
export const ModifyLunaClientRequest = S.suspend(() =>
  S.Struct({ ClientArn: S.String, Certificate: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ModifyLunaClientRequest",
}) as any as S.Schema<ModifyLunaClientRequest>;
export interface RemoveTagsFromResourceRequest {
  ResourceArn: string;
  TagKeyList: TagKeyList;
}
export const RemoveTagsFromResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeyList: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RemoveTagsFromResourceRequest",
}) as any as S.Schema<RemoveTagsFromResourceRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type HsmList = string[];
export const HsmList = S.Array(S.String);
export type PartitionList = string[];
export const PartitionList = S.Array(S.String);
export type ClientList = string[];
export const ClientList = S.Array(S.String);
export interface AddTagsToResourceRequest {
  ResourceArn: string;
  TagList: TagList;
}
export const AddTagsToResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagList: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AddTagsToResourceRequest",
}) as any as S.Schema<AddTagsToResourceRequest>;
export interface CreateHapgResponse {
  HapgArn?: string;
}
export const CreateHapgResponse = S.suspend(() =>
  S.Struct({ HapgArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateHapgResponse",
}) as any as S.Schema<CreateHapgResponse>;
export interface CreateHsmResponse {
  HsmArn?: string;
}
export const CreateHsmResponse = S.suspend(() =>
  S.Struct({ HsmArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateHsmResponse",
}) as any as S.Schema<CreateHsmResponse>;
export interface CreateLunaClientResponse {
  ClientArn?: string;
}
export const CreateLunaClientResponse = S.suspend(() =>
  S.Struct({ ClientArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLunaClientResponse",
}) as any as S.Schema<CreateLunaClientResponse>;
export interface DeleteHapgResponse {
  Status: string;
}
export const DeleteHapgResponse = S.suspend(() =>
  S.Struct({ Status: S.String }),
).annotations({
  identifier: "DeleteHapgResponse",
}) as any as S.Schema<DeleteHapgResponse>;
export interface DeleteHsmResponse {
  Status: string;
}
export const DeleteHsmResponse = S.suspend(() =>
  S.Struct({ Status: S.String }),
).annotations({
  identifier: "DeleteHsmResponse",
}) as any as S.Schema<DeleteHsmResponse>;
export interface DeleteLunaClientResponse {
  Status: string;
}
export const DeleteLunaClientResponse = S.suspend(() =>
  S.Struct({ Status: S.String }),
).annotations({
  identifier: "DeleteLunaClientResponse",
}) as any as S.Schema<DeleteLunaClientResponse>;
export interface DescribeHapgResponse {
  HapgArn?: string;
  HapgSerial?: string;
  HsmsLastActionFailed?: HsmList;
  HsmsPendingDeletion?: HsmList;
  HsmsPendingRegistration?: HsmList;
  Label?: string;
  LastModifiedTimestamp?: string;
  PartitionSerialList?: PartitionSerialList;
  State?: string;
}
export const DescribeHapgResponse = S.suspend(() =>
  S.Struct({
    HapgArn: S.optional(S.String),
    HapgSerial: S.optional(S.String),
    HsmsLastActionFailed: S.optional(HsmList),
    HsmsPendingDeletion: S.optional(HsmList),
    HsmsPendingRegistration: S.optional(HsmList),
    Label: S.optional(S.String),
    LastModifiedTimestamp: S.optional(S.String),
    PartitionSerialList: S.optional(PartitionSerialList),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeHapgResponse",
}) as any as S.Schema<DescribeHapgResponse>;
export interface DescribeHsmResponse {
  HsmArn?: string;
  Status?: string;
  StatusDetails?: string;
  AvailabilityZone?: string;
  EniId?: string;
  EniIp?: string;
  SubscriptionType?: string;
  SubscriptionStartDate?: string;
  SubscriptionEndDate?: string;
  VpcId?: string;
  SubnetId?: string;
  IamRoleArn?: string;
  SerialNumber?: string;
  VendorName?: string;
  HsmType?: string;
  SoftwareVersion?: string;
  SshPublicKey?: string;
  SshKeyLastUpdated?: string;
  ServerCertUri?: string;
  ServerCertLastUpdated?: string;
  Partitions?: PartitionList;
}
export const DescribeHsmResponse = S.suspend(() =>
  S.Struct({
    HsmArn: S.optional(S.String),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    EniId: S.optional(S.String),
    EniIp: S.optional(S.String),
    SubscriptionType: S.optional(S.String),
    SubscriptionStartDate: S.optional(S.String),
    SubscriptionEndDate: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetId: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
    SerialNumber: S.optional(S.String),
    VendorName: S.optional(S.String),
    HsmType: S.optional(S.String),
    SoftwareVersion: S.optional(S.String),
    SshPublicKey: S.optional(S.String),
    SshKeyLastUpdated: S.optional(S.String),
    ServerCertUri: S.optional(S.String),
    ServerCertLastUpdated: S.optional(S.String),
    Partitions: S.optional(PartitionList),
  }),
).annotations({
  identifier: "DescribeHsmResponse",
}) as any as S.Schema<DescribeHsmResponse>;
export interface DescribeLunaClientResponse {
  ClientArn?: string;
  Certificate?: string;
  CertificateFingerprint?: string;
  LastModifiedTimestamp?: string;
  Label?: string;
}
export const DescribeLunaClientResponse = S.suspend(() =>
  S.Struct({
    ClientArn: S.optional(S.String),
    Certificate: S.optional(S.String),
    CertificateFingerprint: S.optional(S.String),
    LastModifiedTimestamp: S.optional(S.String),
    Label: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeLunaClientResponse",
}) as any as S.Schema<DescribeLunaClientResponse>;
export interface GetConfigResponse {
  ConfigType?: string;
  ConfigFile?: string;
  ConfigCred?: string;
}
export const GetConfigResponse = S.suspend(() =>
  S.Struct({
    ConfigType: S.optional(S.String),
    ConfigFile: S.optional(S.String),
    ConfigCred: S.optional(S.String),
  }),
).annotations({
  identifier: "GetConfigResponse",
}) as any as S.Schema<GetConfigResponse>;
export interface ListHapgsResponse {
  HapgList: HapgList;
  NextToken?: string;
}
export const ListHapgsResponse = S.suspend(() =>
  S.Struct({ HapgList: HapgList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListHapgsResponse",
}) as any as S.Schema<ListHapgsResponse>;
export interface ListHsmsResponse {
  HsmList?: HsmList;
  NextToken?: string;
}
export const ListHsmsResponse = S.suspend(() =>
  S.Struct({ HsmList: S.optional(HsmList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListHsmsResponse",
}) as any as S.Schema<ListHsmsResponse>;
export interface ListLunaClientsResponse {
  ClientList: ClientList;
  NextToken?: string;
}
export const ListLunaClientsResponse = S.suspend(() =>
  S.Struct({ ClientList: ClientList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListLunaClientsResponse",
}) as any as S.Schema<ListLunaClientsResponse>;
export interface ListTagsForResourceResponse {
  TagList: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ TagList: TagList }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ModifyHapgResponse {
  HapgArn?: string;
}
export const ModifyHapgResponse = S.suspend(() =>
  S.Struct({ HapgArn: S.optional(S.String) }),
).annotations({
  identifier: "ModifyHapgResponse",
}) as any as S.Schema<ModifyHapgResponse>;
export interface ModifyHsmResponse {
  HsmArn?: string;
}
export const ModifyHsmResponse = S.suspend(() =>
  S.Struct({ HsmArn: S.optional(S.String) }),
).annotations({
  identifier: "ModifyHsmResponse",
}) as any as S.Schema<ModifyHsmResponse>;
export interface ModifyLunaClientResponse {
  ClientArn?: string;
}
export const ModifyLunaClientResponse = S.suspend(() =>
  S.Struct({ ClientArn: S.optional(S.String) }),
).annotations({
  identifier: "ModifyLunaClientResponse",
}) as any as S.Schema<ModifyLunaClientResponse>;
export interface RemoveTagsFromResourceResponse {
  Status: string;
}
export const RemoveTagsFromResourceResponse = S.suspend(() =>
  S.Struct({ Status: S.String }),
).annotations({
  identifier: "RemoveTagsFromResourceResponse",
}) as any as S.Schema<RemoveTagsFromResourceResponse>;
export interface AddTagsToResourceResponse {
  Status: string;
}
export const AddTagsToResourceResponse = S.suspend(() =>
  S.Struct({ Status: S.String }),
).annotations({
  identifier: "AddTagsToResourceResponse",
}) as any as S.Schema<AddTagsToResourceResponse>;

//# Errors
export class CloudHsmInternalException extends S.TaggedError<CloudHsmInternalException>()(
  "CloudHsmInternalException",
  { message: S.optional(S.String), retryable: S.optional(S.Boolean) },
) {}
export class CloudHsmServiceException extends S.TaggedError<CloudHsmServiceException>()(
  "CloudHsmServiceException",
  { message: S.optional(S.String), retryable: S.optional(S.Boolean) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String), retryable: S.optional(S.Boolean) },
) {}

//# Operations
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Modifies the certificate used by the client.
 *
 * This action can potentially start a workflow to install the new certificate on the
 * client's HSMs.
 */
export const modifyLunaClient: (
  input: ModifyLunaClientRequest,
) => Effect.Effect<
  ModifyLunaClientResponse,
  CloudHsmServiceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyLunaClientRequest,
  output: ModifyLunaClientResponse,
  errors: [CloudHsmServiceException],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Lists the Availability Zones that have available AWS CloudHSM capacity.
 */
export const listAvailableZones: (
  input: ListAvailableZonesRequest,
) => Effect.Effect<
  ListAvailableZonesResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAvailableZonesRequest,
  output: ListAvailableZonesResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Lists the high-availability partition groups for the account.
 *
 * This operation supports pagination with the use of the `NextToken` member.
 * If more results are available, the `NextToken` member of the response contains a
 * token that you pass in the next call to `ListHapgs` to retrieve the next set of
 * items.
 */
export const listHapgs: (
  input: ListHapgsRequest,
) => Effect.Effect<
  ListHapgsResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHapgsRequest,
  output: ListHapgsResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Retrieves the identifiers of all of the HSMs provisioned for the current
 * customer.
 *
 * This operation supports pagination with the use of the `NextToken` member.
 * If more results are available, the `NextToken` member of the response contains a
 * token that you pass in the next call to `ListHsms` to retrieve the next set of
 * items.
 */
export const listHsms: (
  input: ListHsmsRequest,
) => Effect.Effect<
  ListHsmsResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHsmsRequest,
  output: ListHsmsResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Lists all of the clients.
 *
 * This operation supports pagination with the use of the `NextToken` member.
 * If more results are available, the `NextToken` member of the response contains a
 * token that you pass in the next call to `ListLunaClients` to retrieve the next set
 * of items.
 */
export const listLunaClients: (
  input: ListLunaClientsRequest,
) => Effect.Effect<
  ListLunaClientsResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLunaClientsRequest,
  output: ListLunaClientsResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Returns a list of all tags for the specified AWS CloudHSM resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Modifies an existing high-availability partition group.
 */
export const modifyHapg: (
  input: ModifyHapgRequest,
) => Effect.Effect<
  ModifyHapgResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyHapgRequest,
  output: ModifyHapgResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Modifies an HSM.
 *
 * This operation can result in the HSM being offline for up to 15 minutes while the AWS
 * CloudHSM service is reconfigured. If you are modifying a production HSM, you should ensure
 * that your AWS CloudHSM service is configured for high availability, and consider executing this
 * operation during a maintenance window.
 */
export const modifyHsm: (
  input: ModifyHsmRequest,
) => Effect.Effect<
  ModifyHsmResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyHsmRequest,
  output: ModifyHsmResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Removes one or more tags from the specified AWS CloudHSM resource.
 *
 * To remove a tag, specify only the tag key to remove (not the value). To overwrite the
 * value for an existing tag, use AddTagsToResource.
 */
export const removeTagsFromResource: (
  input: RemoveTagsFromResourceRequest,
) => Effect.Effect<
  RemoveTagsFromResourceResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsFromResourceRequest,
  output: RemoveTagsFromResourceResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Creates a high-availability partition group. A high-availability partition group is a
 * group of partitions that spans multiple physical HSMs.
 */
export const createHapg: (
  input: CreateHapgRequest,
) => Effect.Effect<
  CreateHapgResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHapgRequest,
  output: CreateHapgResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Creates an uninitialized HSM instance.
 *
 * There is an upfront fee charged for each HSM instance that you create with the
 * `CreateHsm` operation. If you accidentally provision an HSM and want to request a
 * refund, delete the instance using the DeleteHsm operation, go to the AWS Support Center, create a new case, and select
 * **Account and Billing Support**.
 *
 * It can take up to 20 minutes to create and provision an HSM. You can monitor the
 * status of the HSM with the DescribeHsm operation. The HSM is ready to be
 * initialized when the status changes to `RUNNING`.
 */
export const createHsm: (
  input: CreateHsmRequest,
) => Effect.Effect<
  CreateHsmResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHsmRequest,
  output: CreateHsmResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Creates an HSM client.
 */
export const createLunaClient: (
  input: CreateLunaClientRequest,
) => Effect.Effect<
  CreateLunaClientResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLunaClientRequest,
  output: CreateLunaClientResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Deletes a high-availability partition group.
 */
export const deleteHapg: (
  input: DeleteHapgRequest,
) => Effect.Effect<
  DeleteHapgResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHapgRequest,
  output: DeleteHapgResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Deletes an HSM. After completion, this operation cannot be undone and your key material
 * cannot be recovered.
 */
export const deleteHsm: (
  input: DeleteHsmRequest,
) => Effect.Effect<
  DeleteHsmResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHsmRequest,
  output: DeleteHsmResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Deletes a client.
 */
export const deleteLunaClient: (
  input: DeleteLunaClientRequest,
) => Effect.Effect<
  DeleteLunaClientResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLunaClientRequest,
  output: DeleteLunaClientResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Retrieves information about a high-availability partition group.
 */
export const describeHapg: (
  input: DescribeHapgRequest,
) => Effect.Effect<
  DescribeHapgResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHapgRequest,
  output: DescribeHapgResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Retrieves information about an HSM. You can identify the HSM by its ARN or its serial
 * number.
 */
export const describeHsm: (
  input: DescribeHsmRequest,
) => Effect.Effect<
  DescribeHsmResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHsmRequest,
  output: DescribeHsmResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Retrieves information about an HSM client.
 */
export const describeLunaClient: (
  input: DescribeLunaClientRequest,
) => Effect.Effect<
  DescribeLunaClientResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLunaClientRequest,
  output: DescribeLunaClientResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Gets the configuration files necessary to connect to all high availability partition
 * groups the client is associated with.
 */
export const getConfig: (
  input: GetConfigRequest,
) => Effect.Effect<
  GetConfigResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigRequest,
  output: GetConfigResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Adds or overwrites one or more tags for the specified AWS CloudHSM resource.
 *
 * Each tag consists of a key and a value. Tag keys must be unique to each
 * resource.
 */
export const addTagsToResource: (
  input: AddTagsToResourceRequest,
) => Effect.Effect<
  AddTagsToResourceResponse,
  | CloudHsmInternalException
  | CloudHsmServiceException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceRequest,
  output: AddTagsToResourceResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));

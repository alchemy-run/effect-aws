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
  sdkId: "Pca Connector Ad",
  serviceShapeName: "PcaConnectorAd",
});
const auth = T.AwsAuthSigv4({ name: "pca-connector-ad" });
const ver = T.ServiceVersion("2018-05-10");
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
              `https://pca-connector-ad-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://pca-connector-ad-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://pca-connector-ad.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://pca-connector-ad.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DirectoryId = string;
export type CertificateAuthorityArn = string;
export type ClientToken = string;
export type ConnectorArn = string;
export type MaxResults = number;
export type NextToken = string;
export type DirectoryRegistrationArn = string;
export type TemplateArn = string;
export type GroupSecurityIdentifier = string;
export type DisplayName = string;
export type TemplateName = string;
export type SecurityGroupId = string;
export type CustomObjectIdentifier = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export interface GetConnectorRequest {
  ConnectorArn: string;
}
export const GetConnectorRequest = S.suspend(() =>
  S.Struct({ ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connectors/{ConnectorArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectorRequest",
}) as any as S.Schema<GetConnectorRequest>;
export interface DeleteConnectorRequest {
  ConnectorArn: string;
}
export const DeleteConnectorRequest = S.suspend(() =>
  S.Struct({ ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/connectors/{ConnectorArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectorRequest",
}) as any as S.Schema<DeleteConnectorRequest>;
export interface DeleteConnectorResponse {}
export const DeleteConnectorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectorResponse",
}) as any as S.Schema<DeleteConnectorResponse>;
export interface ListConnectorsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListConnectorsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectorsRequest",
}) as any as S.Schema<ListConnectorsRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateDirectoryRegistrationRequest {
  DirectoryId: string;
  ClientToken?: string;
  Tags?: Tags;
}
export const CreateDirectoryRegistrationRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/directoryRegistrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDirectoryRegistrationRequest",
}) as any as S.Schema<CreateDirectoryRegistrationRequest>;
export interface GetDirectoryRegistrationRequest {
  DirectoryRegistrationArn: string;
}
export const GetDirectoryRegistrationRequest = S.suspend(() =>
  S.Struct({
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/directoryRegistrations/{DirectoryRegistrationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDirectoryRegistrationRequest",
}) as any as S.Schema<GetDirectoryRegistrationRequest>;
export interface DeleteDirectoryRegistrationRequest {
  DirectoryRegistrationArn: string;
}
export const DeleteDirectoryRegistrationRequest = S.suspend(() =>
  S.Struct({
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/directoryRegistrations/{DirectoryRegistrationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDirectoryRegistrationRequest",
}) as any as S.Schema<DeleteDirectoryRegistrationRequest>;
export interface DeleteDirectoryRegistrationResponse {}
export const DeleteDirectoryRegistrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDirectoryRegistrationResponse",
}) as any as S.Schema<DeleteDirectoryRegistrationResponse>;
export interface ListDirectoryRegistrationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListDirectoryRegistrationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/directoryRegistrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDirectoryRegistrationsRequest",
}) as any as S.Schema<ListDirectoryRegistrationsRequest>;
export interface CreateServicePrincipalNameRequest {
  DirectoryRegistrationArn: string;
  ConnectorArn: string;
  ClientToken?: string;
}
export const CreateServicePrincipalNameRequest = S.suspend(() =>
  S.Struct({
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
    ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/directoryRegistrations/{DirectoryRegistrationArn}/servicePrincipalNames/{ConnectorArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateServicePrincipalNameRequest",
}) as any as S.Schema<CreateServicePrincipalNameRequest>;
export interface CreateServicePrincipalNameResponse {}
export const CreateServicePrincipalNameResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateServicePrincipalNameResponse",
}) as any as S.Schema<CreateServicePrincipalNameResponse>;
export interface GetServicePrincipalNameRequest {
  DirectoryRegistrationArn: string;
  ConnectorArn: string;
}
export const GetServicePrincipalNameRequest = S.suspend(() =>
  S.Struct({
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
    ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/directoryRegistrations/{DirectoryRegistrationArn}/servicePrincipalNames/{ConnectorArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServicePrincipalNameRequest",
}) as any as S.Schema<GetServicePrincipalNameRequest>;
export interface DeleteServicePrincipalNameRequest {
  DirectoryRegistrationArn: string;
  ConnectorArn: string;
}
export const DeleteServicePrincipalNameRequest = S.suspend(() =>
  S.Struct({
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
    ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/directoryRegistrations/{DirectoryRegistrationArn}/servicePrincipalNames/{ConnectorArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteServicePrincipalNameRequest",
}) as any as S.Schema<DeleteServicePrincipalNameRequest>;
export interface DeleteServicePrincipalNameResponse {}
export const DeleteServicePrincipalNameResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteServicePrincipalNameResponse",
}) as any as S.Schema<DeleteServicePrincipalNameResponse>;
export interface ListServicePrincipalNamesRequest {
  MaxResults?: number;
  NextToken?: string;
  DirectoryRegistrationArn: string;
}
export const ListServicePrincipalNamesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/directoryRegistrations/{DirectoryRegistrationArn}/servicePrincipalNames",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListServicePrincipalNamesRequest",
}) as any as S.Schema<ListServicePrincipalNamesRequest>;
export interface GetTemplateGroupAccessControlEntryRequest {
  TemplateArn: string;
  GroupSecurityIdentifier: string;
}
export const GetTemplateGroupAccessControlEntryRequest = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    GroupSecurityIdentifier: S.String.pipe(
      T.HttpLabel("GroupSecurityIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/templates/{TemplateArn}/accessControlEntries/{GroupSecurityIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTemplateGroupAccessControlEntryRequest",
}) as any as S.Schema<GetTemplateGroupAccessControlEntryRequest>;
export interface AccessRights {
  Enroll?: string;
  AutoEnroll?: string;
}
export const AccessRights = S.suspend(() =>
  S.Struct({ Enroll: S.optional(S.String), AutoEnroll: S.optional(S.String) }),
).annotations({ identifier: "AccessRights" }) as any as S.Schema<AccessRights>;
export interface UpdateTemplateGroupAccessControlEntryRequest {
  TemplateArn: string;
  GroupSecurityIdentifier: string;
  GroupDisplayName?: string;
  AccessRights?: AccessRights;
}
export const UpdateTemplateGroupAccessControlEntryRequest = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    GroupSecurityIdentifier: S.String.pipe(
      T.HttpLabel("GroupSecurityIdentifier"),
    ),
    GroupDisplayName: S.optional(S.String),
    AccessRights: S.optional(AccessRights),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/templates/{TemplateArn}/accessControlEntries/{GroupSecurityIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTemplateGroupAccessControlEntryRequest",
}) as any as S.Schema<UpdateTemplateGroupAccessControlEntryRequest>;
export interface UpdateTemplateGroupAccessControlEntryResponse {}
export const UpdateTemplateGroupAccessControlEntryResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTemplateGroupAccessControlEntryResponse",
}) as any as S.Schema<UpdateTemplateGroupAccessControlEntryResponse>;
export interface DeleteTemplateGroupAccessControlEntryRequest {
  TemplateArn: string;
  GroupSecurityIdentifier: string;
}
export const DeleteTemplateGroupAccessControlEntryRequest = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    GroupSecurityIdentifier: S.String.pipe(
      T.HttpLabel("GroupSecurityIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/templates/{TemplateArn}/accessControlEntries/{GroupSecurityIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTemplateGroupAccessControlEntryRequest",
}) as any as S.Schema<DeleteTemplateGroupAccessControlEntryRequest>;
export interface DeleteTemplateGroupAccessControlEntryResponse {}
export const DeleteTemplateGroupAccessControlEntryResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTemplateGroupAccessControlEntryResponse",
}) as any as S.Schema<DeleteTemplateGroupAccessControlEntryResponse>;
export interface ListTemplateGroupAccessControlEntriesRequest {
  MaxResults?: number;
  NextToken?: string;
  TemplateArn: string;
}
export const ListTemplateGroupAccessControlEntriesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/templates/{TemplateArn}/accessControlEntries",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTemplateGroupAccessControlEntriesRequest",
}) as any as S.Schema<ListTemplateGroupAccessControlEntriesRequest>;
export interface GetTemplateRequest {
  TemplateArn: string;
}
export const GetTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templates/{TemplateArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTemplateRequest",
}) as any as S.Schema<GetTemplateRequest>;
export interface ValidityPeriod {
  PeriodType: string;
  Period: number;
}
export const ValidityPeriod = S.suspend(() =>
  S.Struct({ PeriodType: S.String, Period: S.Number }),
).annotations({
  identifier: "ValidityPeriod",
}) as any as S.Schema<ValidityPeriod>;
export interface CertificateValidity {
  ValidityPeriod: ValidityPeriod;
  RenewalPeriod: ValidityPeriod;
}
export const CertificateValidity = S.suspend(() =>
  S.Struct({ ValidityPeriod: ValidityPeriod, RenewalPeriod: ValidityPeriod }),
).annotations({
  identifier: "CertificateValidity",
}) as any as S.Schema<CertificateValidity>;
export type TemplateNameList = string[];
export const TemplateNameList = S.Array(S.String);
export type CryptoProvidersList = string[];
export const CryptoProvidersList = S.Array(S.String);
export interface PrivateKeyAttributesV2 {
  MinimalKeyLength: number;
  KeySpec: string;
  CryptoProviders?: CryptoProvidersList;
}
export const PrivateKeyAttributesV2 = S.suspend(() =>
  S.Struct({
    MinimalKeyLength: S.Number,
    KeySpec: S.String,
    CryptoProviders: S.optional(CryptoProvidersList),
  }),
).annotations({
  identifier: "PrivateKeyAttributesV2",
}) as any as S.Schema<PrivateKeyAttributesV2>;
export interface PrivateKeyFlagsV2 {
  ExportableKey?: boolean;
  StrongKeyProtectionRequired?: boolean;
  ClientVersion: string;
}
export const PrivateKeyFlagsV2 = S.suspend(() =>
  S.Struct({
    ExportableKey: S.optional(S.Boolean),
    StrongKeyProtectionRequired: S.optional(S.Boolean),
    ClientVersion: S.String,
  }),
).annotations({
  identifier: "PrivateKeyFlagsV2",
}) as any as S.Schema<PrivateKeyFlagsV2>;
export interface EnrollmentFlagsV2 {
  IncludeSymmetricAlgorithms?: boolean;
  UserInteractionRequired?: boolean;
  RemoveInvalidCertificateFromPersonalStore?: boolean;
  NoSecurityExtension?: boolean;
  EnableKeyReuseOnNtTokenKeysetStorageFull?: boolean;
}
export const EnrollmentFlagsV2 = S.suspend(() =>
  S.Struct({
    IncludeSymmetricAlgorithms: S.optional(S.Boolean),
    UserInteractionRequired: S.optional(S.Boolean),
    RemoveInvalidCertificateFromPersonalStore: S.optional(S.Boolean),
    NoSecurityExtension: S.optional(S.Boolean),
    EnableKeyReuseOnNtTokenKeysetStorageFull: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EnrollmentFlagsV2",
}) as any as S.Schema<EnrollmentFlagsV2>;
export interface SubjectNameFlagsV2 {
  SanRequireDomainDns?: boolean;
  SanRequireSpn?: boolean;
  SanRequireDirectoryGuid?: boolean;
  SanRequireUpn?: boolean;
  SanRequireEmail?: boolean;
  SanRequireDns?: boolean;
  RequireDnsAsCn?: boolean;
  RequireEmail?: boolean;
  RequireCommonName?: boolean;
  RequireDirectoryPath?: boolean;
}
export const SubjectNameFlagsV2 = S.suspend(() =>
  S.Struct({
    SanRequireDomainDns: S.optional(S.Boolean),
    SanRequireSpn: S.optional(S.Boolean),
    SanRequireDirectoryGuid: S.optional(S.Boolean),
    SanRequireUpn: S.optional(S.Boolean),
    SanRequireEmail: S.optional(S.Boolean),
    SanRequireDns: S.optional(S.Boolean),
    RequireDnsAsCn: S.optional(S.Boolean),
    RequireEmail: S.optional(S.Boolean),
    RequireCommonName: S.optional(S.Boolean),
    RequireDirectoryPath: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SubjectNameFlagsV2",
}) as any as S.Schema<SubjectNameFlagsV2>;
export interface GeneralFlagsV2 {
  AutoEnrollment?: boolean;
  MachineType?: boolean;
}
export const GeneralFlagsV2 = S.suspend(() =>
  S.Struct({
    AutoEnrollment: S.optional(S.Boolean),
    MachineType: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GeneralFlagsV2",
}) as any as S.Schema<GeneralFlagsV2>;
export interface KeyUsageFlags {
  DigitalSignature?: boolean;
  NonRepudiation?: boolean;
  KeyEncipherment?: boolean;
  DataEncipherment?: boolean;
  KeyAgreement?: boolean;
}
export const KeyUsageFlags = S.suspend(() =>
  S.Struct({
    DigitalSignature: S.optional(S.Boolean),
    NonRepudiation: S.optional(S.Boolean),
    KeyEncipherment: S.optional(S.Boolean),
    DataEncipherment: S.optional(S.Boolean),
    KeyAgreement: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "KeyUsageFlags",
}) as any as S.Schema<KeyUsageFlags>;
export interface KeyUsage {
  Critical?: boolean;
  UsageFlags: KeyUsageFlags;
}
export const KeyUsage = S.suspend(() =>
  S.Struct({ Critical: S.optional(S.Boolean), UsageFlags: KeyUsageFlags }),
).annotations({ identifier: "KeyUsage" }) as any as S.Schema<KeyUsage>;
export type ApplicationPolicy =
  | { PolicyType: string }
  | { PolicyObjectIdentifier: string };
export const ApplicationPolicy = S.Union(
  S.Struct({ PolicyType: S.String }),
  S.Struct({ PolicyObjectIdentifier: S.String }),
);
export type ApplicationPolicyList = (typeof ApplicationPolicy)["Type"][];
export const ApplicationPolicyList = S.Array(ApplicationPolicy);
export interface ApplicationPolicies {
  Critical?: boolean;
  Policies: ApplicationPolicyList;
}
export const ApplicationPolicies = S.suspend(() =>
  S.Struct({
    Critical: S.optional(S.Boolean),
    Policies: ApplicationPolicyList,
  }),
).annotations({
  identifier: "ApplicationPolicies",
}) as any as S.Schema<ApplicationPolicies>;
export interface ExtensionsV2 {
  KeyUsage: KeyUsage;
  ApplicationPolicies?: ApplicationPolicies;
}
export const ExtensionsV2 = S.suspend(() =>
  S.Struct({
    KeyUsage: KeyUsage,
    ApplicationPolicies: S.optional(ApplicationPolicies),
  }),
).annotations({ identifier: "ExtensionsV2" }) as any as S.Schema<ExtensionsV2>;
export interface TemplateV2 {
  CertificateValidity: CertificateValidity;
  SupersededTemplates?: TemplateNameList;
  PrivateKeyAttributes: PrivateKeyAttributesV2;
  PrivateKeyFlags: PrivateKeyFlagsV2;
  EnrollmentFlags: EnrollmentFlagsV2;
  SubjectNameFlags: SubjectNameFlagsV2;
  GeneralFlags: GeneralFlagsV2;
  Extensions: ExtensionsV2;
}
export const TemplateV2 = S.suspend(() =>
  S.Struct({
    CertificateValidity: CertificateValidity,
    SupersededTemplates: S.optional(TemplateNameList),
    PrivateKeyAttributes: PrivateKeyAttributesV2,
    PrivateKeyFlags: PrivateKeyFlagsV2,
    EnrollmentFlags: EnrollmentFlagsV2,
    SubjectNameFlags: SubjectNameFlagsV2,
    GeneralFlags: GeneralFlagsV2,
    Extensions: ExtensionsV2,
  }),
).annotations({ identifier: "TemplateV2" }) as any as S.Schema<TemplateV2>;
export interface KeyUsagePropertyFlags {
  Decrypt?: boolean;
  KeyAgreement?: boolean;
  Sign?: boolean;
}
export const KeyUsagePropertyFlags = S.suspend(() =>
  S.Struct({
    Decrypt: S.optional(S.Boolean),
    KeyAgreement: S.optional(S.Boolean),
    Sign: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "KeyUsagePropertyFlags",
}) as any as S.Schema<KeyUsagePropertyFlags>;
export type KeyUsageProperty =
  | { PropertyType: string }
  | { PropertyFlags: KeyUsagePropertyFlags };
export const KeyUsageProperty = S.Union(
  S.Struct({ PropertyType: S.String }),
  S.Struct({ PropertyFlags: KeyUsagePropertyFlags }),
);
export interface PrivateKeyAttributesV3 {
  MinimalKeyLength: number;
  KeySpec: string;
  CryptoProviders?: CryptoProvidersList;
  KeyUsageProperty: (typeof KeyUsageProperty)["Type"];
  Algorithm: string;
}
export const PrivateKeyAttributesV3 = S.suspend(() =>
  S.Struct({
    MinimalKeyLength: S.Number,
    KeySpec: S.String,
    CryptoProviders: S.optional(CryptoProvidersList),
    KeyUsageProperty: KeyUsageProperty,
    Algorithm: S.String,
  }),
).annotations({
  identifier: "PrivateKeyAttributesV3",
}) as any as S.Schema<PrivateKeyAttributesV3>;
export interface PrivateKeyFlagsV3 {
  ExportableKey?: boolean;
  StrongKeyProtectionRequired?: boolean;
  RequireAlternateSignatureAlgorithm?: boolean;
  ClientVersion: string;
}
export const PrivateKeyFlagsV3 = S.suspend(() =>
  S.Struct({
    ExportableKey: S.optional(S.Boolean),
    StrongKeyProtectionRequired: S.optional(S.Boolean),
    RequireAlternateSignatureAlgorithm: S.optional(S.Boolean),
    ClientVersion: S.String,
  }),
).annotations({
  identifier: "PrivateKeyFlagsV3",
}) as any as S.Schema<PrivateKeyFlagsV3>;
export interface EnrollmentFlagsV3 {
  IncludeSymmetricAlgorithms?: boolean;
  UserInteractionRequired?: boolean;
  RemoveInvalidCertificateFromPersonalStore?: boolean;
  NoSecurityExtension?: boolean;
  EnableKeyReuseOnNtTokenKeysetStorageFull?: boolean;
}
export const EnrollmentFlagsV3 = S.suspend(() =>
  S.Struct({
    IncludeSymmetricAlgorithms: S.optional(S.Boolean),
    UserInteractionRequired: S.optional(S.Boolean),
    RemoveInvalidCertificateFromPersonalStore: S.optional(S.Boolean),
    NoSecurityExtension: S.optional(S.Boolean),
    EnableKeyReuseOnNtTokenKeysetStorageFull: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EnrollmentFlagsV3",
}) as any as S.Schema<EnrollmentFlagsV3>;
export interface SubjectNameFlagsV3 {
  SanRequireDomainDns?: boolean;
  SanRequireSpn?: boolean;
  SanRequireDirectoryGuid?: boolean;
  SanRequireUpn?: boolean;
  SanRequireEmail?: boolean;
  SanRequireDns?: boolean;
  RequireDnsAsCn?: boolean;
  RequireEmail?: boolean;
  RequireCommonName?: boolean;
  RequireDirectoryPath?: boolean;
}
export const SubjectNameFlagsV3 = S.suspend(() =>
  S.Struct({
    SanRequireDomainDns: S.optional(S.Boolean),
    SanRequireSpn: S.optional(S.Boolean),
    SanRequireDirectoryGuid: S.optional(S.Boolean),
    SanRequireUpn: S.optional(S.Boolean),
    SanRequireEmail: S.optional(S.Boolean),
    SanRequireDns: S.optional(S.Boolean),
    RequireDnsAsCn: S.optional(S.Boolean),
    RequireEmail: S.optional(S.Boolean),
    RequireCommonName: S.optional(S.Boolean),
    RequireDirectoryPath: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SubjectNameFlagsV3",
}) as any as S.Schema<SubjectNameFlagsV3>;
export interface GeneralFlagsV3 {
  AutoEnrollment?: boolean;
  MachineType?: boolean;
}
export const GeneralFlagsV3 = S.suspend(() =>
  S.Struct({
    AutoEnrollment: S.optional(S.Boolean),
    MachineType: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GeneralFlagsV3",
}) as any as S.Schema<GeneralFlagsV3>;
export interface ExtensionsV3 {
  KeyUsage: KeyUsage;
  ApplicationPolicies?: ApplicationPolicies;
}
export const ExtensionsV3 = S.suspend(() =>
  S.Struct({
    KeyUsage: KeyUsage,
    ApplicationPolicies: S.optional(ApplicationPolicies),
  }),
).annotations({ identifier: "ExtensionsV3" }) as any as S.Schema<ExtensionsV3>;
export interface TemplateV3 {
  CertificateValidity: CertificateValidity;
  SupersededTemplates?: TemplateNameList;
  PrivateKeyAttributes: PrivateKeyAttributesV3;
  PrivateKeyFlags: PrivateKeyFlagsV3;
  EnrollmentFlags: EnrollmentFlagsV3;
  SubjectNameFlags: SubjectNameFlagsV3;
  GeneralFlags: GeneralFlagsV3;
  HashAlgorithm: string;
  Extensions: ExtensionsV3;
}
export const TemplateV3 = S.suspend(() =>
  S.Struct({
    CertificateValidity: CertificateValidity,
    SupersededTemplates: S.optional(TemplateNameList),
    PrivateKeyAttributes: PrivateKeyAttributesV3,
    PrivateKeyFlags: PrivateKeyFlagsV3,
    EnrollmentFlags: EnrollmentFlagsV3,
    SubjectNameFlags: SubjectNameFlagsV3,
    GeneralFlags: GeneralFlagsV3,
    HashAlgorithm: S.String,
    Extensions: ExtensionsV3,
  }),
).annotations({ identifier: "TemplateV3" }) as any as S.Schema<TemplateV3>;
export interface PrivateKeyAttributesV4 {
  MinimalKeyLength: number;
  KeySpec: string;
  CryptoProviders?: CryptoProvidersList;
  KeyUsageProperty?: (typeof KeyUsageProperty)["Type"];
  Algorithm?: string;
}
export const PrivateKeyAttributesV4 = S.suspend(() =>
  S.Struct({
    MinimalKeyLength: S.Number,
    KeySpec: S.String,
    CryptoProviders: S.optional(CryptoProvidersList),
    KeyUsageProperty: S.optional(KeyUsageProperty),
    Algorithm: S.optional(S.String),
  }),
).annotations({
  identifier: "PrivateKeyAttributesV4",
}) as any as S.Schema<PrivateKeyAttributesV4>;
export interface PrivateKeyFlagsV4 {
  ExportableKey?: boolean;
  StrongKeyProtectionRequired?: boolean;
  RequireAlternateSignatureAlgorithm?: boolean;
  RequireSameKeyRenewal?: boolean;
  UseLegacyProvider?: boolean;
  ClientVersion: string;
}
export const PrivateKeyFlagsV4 = S.suspend(() =>
  S.Struct({
    ExportableKey: S.optional(S.Boolean),
    StrongKeyProtectionRequired: S.optional(S.Boolean),
    RequireAlternateSignatureAlgorithm: S.optional(S.Boolean),
    RequireSameKeyRenewal: S.optional(S.Boolean),
    UseLegacyProvider: S.optional(S.Boolean),
    ClientVersion: S.String,
  }),
).annotations({
  identifier: "PrivateKeyFlagsV4",
}) as any as S.Schema<PrivateKeyFlagsV4>;
export interface EnrollmentFlagsV4 {
  IncludeSymmetricAlgorithms?: boolean;
  UserInteractionRequired?: boolean;
  RemoveInvalidCertificateFromPersonalStore?: boolean;
  NoSecurityExtension?: boolean;
  EnableKeyReuseOnNtTokenKeysetStorageFull?: boolean;
}
export const EnrollmentFlagsV4 = S.suspend(() =>
  S.Struct({
    IncludeSymmetricAlgorithms: S.optional(S.Boolean),
    UserInteractionRequired: S.optional(S.Boolean),
    RemoveInvalidCertificateFromPersonalStore: S.optional(S.Boolean),
    NoSecurityExtension: S.optional(S.Boolean),
    EnableKeyReuseOnNtTokenKeysetStorageFull: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EnrollmentFlagsV4",
}) as any as S.Schema<EnrollmentFlagsV4>;
export interface SubjectNameFlagsV4 {
  SanRequireDomainDns?: boolean;
  SanRequireSpn?: boolean;
  SanRequireDirectoryGuid?: boolean;
  SanRequireUpn?: boolean;
  SanRequireEmail?: boolean;
  SanRequireDns?: boolean;
  RequireDnsAsCn?: boolean;
  RequireEmail?: boolean;
  RequireCommonName?: boolean;
  RequireDirectoryPath?: boolean;
}
export const SubjectNameFlagsV4 = S.suspend(() =>
  S.Struct({
    SanRequireDomainDns: S.optional(S.Boolean),
    SanRequireSpn: S.optional(S.Boolean),
    SanRequireDirectoryGuid: S.optional(S.Boolean),
    SanRequireUpn: S.optional(S.Boolean),
    SanRequireEmail: S.optional(S.Boolean),
    SanRequireDns: S.optional(S.Boolean),
    RequireDnsAsCn: S.optional(S.Boolean),
    RequireEmail: S.optional(S.Boolean),
    RequireCommonName: S.optional(S.Boolean),
    RequireDirectoryPath: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SubjectNameFlagsV4",
}) as any as S.Schema<SubjectNameFlagsV4>;
export interface GeneralFlagsV4 {
  AutoEnrollment?: boolean;
  MachineType?: boolean;
}
export const GeneralFlagsV4 = S.suspend(() =>
  S.Struct({
    AutoEnrollment: S.optional(S.Boolean),
    MachineType: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GeneralFlagsV4",
}) as any as S.Schema<GeneralFlagsV4>;
export interface ExtensionsV4 {
  KeyUsage: KeyUsage;
  ApplicationPolicies?: ApplicationPolicies;
}
export const ExtensionsV4 = S.suspend(() =>
  S.Struct({
    KeyUsage: KeyUsage,
    ApplicationPolicies: S.optional(ApplicationPolicies),
  }),
).annotations({ identifier: "ExtensionsV4" }) as any as S.Schema<ExtensionsV4>;
export interface TemplateV4 {
  CertificateValidity: CertificateValidity;
  SupersededTemplates?: TemplateNameList;
  PrivateKeyAttributes: PrivateKeyAttributesV4;
  PrivateKeyFlags: PrivateKeyFlagsV4;
  EnrollmentFlags: EnrollmentFlagsV4;
  SubjectNameFlags: SubjectNameFlagsV4;
  GeneralFlags: GeneralFlagsV4;
  HashAlgorithm?: string;
  Extensions: ExtensionsV4;
}
export const TemplateV4 = S.suspend(() =>
  S.Struct({
    CertificateValidity: CertificateValidity,
    SupersededTemplates: S.optional(TemplateNameList),
    PrivateKeyAttributes: PrivateKeyAttributesV4,
    PrivateKeyFlags: PrivateKeyFlagsV4,
    EnrollmentFlags: EnrollmentFlagsV4,
    SubjectNameFlags: SubjectNameFlagsV4,
    GeneralFlags: GeneralFlagsV4,
    HashAlgorithm: S.optional(S.String),
    Extensions: ExtensionsV4,
  }),
).annotations({ identifier: "TemplateV4" }) as any as S.Schema<TemplateV4>;
export type TemplateDefinition =
  | { TemplateV2: TemplateV2 }
  | { TemplateV3: TemplateV3 }
  | { TemplateV4: TemplateV4 };
export const TemplateDefinition = S.Union(
  S.Struct({ TemplateV2: TemplateV2 }),
  S.Struct({ TemplateV3: TemplateV3 }),
  S.Struct({ TemplateV4: TemplateV4 }),
);
export interface UpdateTemplateRequest {
  TemplateArn: string;
  Definition?: (typeof TemplateDefinition)["Type"];
  ReenrollAllCertificateHolders?: boolean;
}
export const UpdateTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    Definition: S.optional(TemplateDefinition),
    ReenrollAllCertificateHolders: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/templates/{TemplateArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTemplateRequest",
}) as any as S.Schema<UpdateTemplateRequest>;
export interface UpdateTemplateResponse {}
export const UpdateTemplateResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateTemplateResponse" },
) as any as S.Schema<UpdateTemplateResponse>;
export interface DeleteTemplateRequest {
  TemplateArn: string;
}
export const DeleteTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/templates/{TemplateArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTemplateRequest",
}) as any as S.Schema<DeleteTemplateRequest>;
export interface DeleteTemplateResponse {}
export const DeleteTemplateResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteTemplateResponse" },
) as any as S.Schema<DeleteTemplateResponse>;
export interface ListTemplatesRequest {
  MaxResults?: number;
  NextToken?: string;
  ConnectorArn: string;
}
export const ListTemplatesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    ConnectorArn: S.String.pipe(T.HttpQuery("ConnectorArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTemplatesRequest",
}) as any as S.Schema<ListTemplatesRequest>;
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface VpcInformation {
  IpAddressType?: string;
  SecurityGroupIds: SecurityGroupIdList;
}
export const VpcInformation = S.suspend(() =>
  S.Struct({
    IpAddressType: S.optional(S.String),
    SecurityGroupIds: SecurityGroupIdList,
  }),
).annotations({
  identifier: "VpcInformation",
}) as any as S.Schema<VpcInformation>;
export interface ListTagsForResourceResponse {
  Tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags,
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
export interface CreateConnectorRequest {
  DirectoryId: string;
  CertificateAuthorityArn: string;
  VpcInformation: VpcInformation;
  ClientToken?: string;
  Tags?: Tags;
}
export const CreateConnectorRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    CertificateAuthorityArn: S.String,
    VpcInformation: VpcInformation,
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectorRequest",
}) as any as S.Schema<CreateConnectorRequest>;
export interface CreateDirectoryRegistrationResponse {
  DirectoryRegistrationArn?: string;
}
export const CreateDirectoryRegistrationResponse = S.suspend(() =>
  S.Struct({ DirectoryRegistrationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateDirectoryRegistrationResponse",
}) as any as S.Schema<CreateDirectoryRegistrationResponse>;
export interface CreateTemplateGroupAccessControlEntryRequest {
  TemplateArn: string;
  GroupSecurityIdentifier: string;
  GroupDisplayName: string;
  AccessRights: AccessRights;
  ClientToken?: string;
}
export const CreateTemplateGroupAccessControlEntryRequest = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    GroupSecurityIdentifier: S.String,
    GroupDisplayName: S.String,
    AccessRights: AccessRights,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/templates/{TemplateArn}/accessControlEntries",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTemplateGroupAccessControlEntryRequest",
}) as any as S.Schema<CreateTemplateGroupAccessControlEntryRequest>;
export interface CreateTemplateGroupAccessControlEntryResponse {}
export const CreateTemplateGroupAccessControlEntryResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateTemplateGroupAccessControlEntryResponse",
}) as any as S.Schema<CreateTemplateGroupAccessControlEntryResponse>;
export interface Connector {
  Arn?: string;
  CertificateAuthorityArn?: string;
  CertificateEnrollmentPolicyServerEndpoint?: string;
  DirectoryId?: string;
  VpcInformation?: VpcInformation;
  Status?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const Connector = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CertificateAuthorityArn: S.optional(S.String),
    CertificateEnrollmentPolicyServerEndpoint: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    VpcInformation: S.optional(VpcInformation),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Connector" }) as any as S.Schema<Connector>;
export interface ConnectorSummary {
  Arn?: string;
  CertificateAuthorityArn?: string;
  CertificateEnrollmentPolicyServerEndpoint?: string;
  DirectoryId?: string;
  VpcInformation?: VpcInformation;
  Status?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const ConnectorSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CertificateAuthorityArn: S.optional(S.String),
    CertificateEnrollmentPolicyServerEndpoint: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    VpcInformation: S.optional(VpcInformation),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ConnectorSummary",
}) as any as S.Schema<ConnectorSummary>;
export type ConnectorList = ConnectorSummary[];
export const ConnectorList = S.Array(ConnectorSummary);
export interface DirectoryRegistration {
  Arn?: string;
  DirectoryId?: string;
  Status?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const DirectoryRegistration = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DirectoryRegistration",
}) as any as S.Schema<DirectoryRegistration>;
export interface DirectoryRegistrationSummary {
  Arn?: string;
  DirectoryId?: string;
  Status?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const DirectoryRegistrationSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DirectoryRegistrationSummary",
}) as any as S.Schema<DirectoryRegistrationSummary>;
export type DirectoryRegistrationList = DirectoryRegistrationSummary[];
export const DirectoryRegistrationList = S.Array(DirectoryRegistrationSummary);
export interface ServicePrincipalName {
  DirectoryRegistrationArn?: string;
  ConnectorArn?: string;
  Status?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const ServicePrincipalName = S.suspend(() =>
  S.Struct({
    DirectoryRegistrationArn: S.optional(S.String),
    ConnectorArn: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ServicePrincipalName",
}) as any as S.Schema<ServicePrincipalName>;
export interface ServicePrincipalNameSummary {
  DirectoryRegistrationArn?: string;
  ConnectorArn?: string;
  Status?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const ServicePrincipalNameSummary = S.suspend(() =>
  S.Struct({
    DirectoryRegistrationArn: S.optional(S.String),
    ConnectorArn: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ServicePrincipalNameSummary",
}) as any as S.Schema<ServicePrincipalNameSummary>;
export type ServicePrincipalNameList = ServicePrincipalNameSummary[];
export const ServicePrincipalNameList = S.Array(ServicePrincipalNameSummary);
export interface AccessControlEntry {
  GroupDisplayName?: string;
  GroupSecurityIdentifier?: string;
  AccessRights?: AccessRights;
  TemplateArn?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const AccessControlEntry = S.suspend(() =>
  S.Struct({
    GroupDisplayName: S.optional(S.String),
    GroupSecurityIdentifier: S.optional(S.String),
    AccessRights: S.optional(AccessRights),
    TemplateArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AccessControlEntry",
}) as any as S.Schema<AccessControlEntry>;
export interface AccessControlEntrySummary {
  GroupDisplayName?: string;
  GroupSecurityIdentifier?: string;
  AccessRights?: AccessRights;
  TemplateArn?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const AccessControlEntrySummary = S.suspend(() =>
  S.Struct({
    GroupDisplayName: S.optional(S.String),
    GroupSecurityIdentifier: S.optional(S.String),
    AccessRights: S.optional(AccessRights),
    TemplateArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AccessControlEntrySummary",
}) as any as S.Schema<AccessControlEntrySummary>;
export type AccessControlEntryList = AccessControlEntrySummary[];
export const AccessControlEntryList = S.Array(AccessControlEntrySummary);
export interface TemplateRevision {
  MajorRevision: number;
  MinorRevision: number;
}
export const TemplateRevision = S.suspend(() =>
  S.Struct({ MajorRevision: S.Number, MinorRevision: S.Number }),
).annotations({
  identifier: "TemplateRevision",
}) as any as S.Schema<TemplateRevision>;
export interface TemplateSummary {
  Arn?: string;
  ConnectorArn?: string;
  Definition?: (typeof TemplateDefinition)["Type"];
  Name?: string;
  ObjectIdentifier?: string;
  PolicySchema?: number;
  Status?: string;
  Revision?: TemplateRevision;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const TemplateSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ConnectorArn: S.optional(S.String),
    Definition: S.optional(TemplateDefinition),
    Name: S.optional(S.String),
    ObjectIdentifier: S.optional(S.String),
    PolicySchema: S.optional(S.Number),
    Status: S.optional(S.String),
    Revision: S.optional(TemplateRevision),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "TemplateSummary",
}) as any as S.Schema<TemplateSummary>;
export type TemplateList = TemplateSummary[];
export const TemplateList = S.Array(TemplateSummary);
export interface CreateConnectorResponse {
  ConnectorArn?: string;
}
export const CreateConnectorResponse = S.suspend(() =>
  S.Struct({ ConnectorArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateConnectorResponse",
}) as any as S.Schema<CreateConnectorResponse>;
export interface GetConnectorResponse {
  Connector?: Connector;
}
export const GetConnectorResponse = S.suspend(() =>
  S.Struct({ Connector: S.optional(Connector) }),
).annotations({
  identifier: "GetConnectorResponse",
}) as any as S.Schema<GetConnectorResponse>;
export interface ListConnectorsResponse {
  Connectors?: ConnectorList;
  NextToken?: string;
}
export const ListConnectorsResponse = S.suspend(() =>
  S.Struct({
    Connectors: S.optional(ConnectorList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectorsResponse",
}) as any as S.Schema<ListConnectorsResponse>;
export interface GetDirectoryRegistrationResponse {
  DirectoryRegistration?: DirectoryRegistration;
}
export const GetDirectoryRegistrationResponse = S.suspend(() =>
  S.Struct({ DirectoryRegistration: S.optional(DirectoryRegistration) }),
).annotations({
  identifier: "GetDirectoryRegistrationResponse",
}) as any as S.Schema<GetDirectoryRegistrationResponse>;
export interface ListDirectoryRegistrationsResponse {
  DirectoryRegistrations?: DirectoryRegistrationList;
  NextToken?: string;
}
export const ListDirectoryRegistrationsResponse = S.suspend(() =>
  S.Struct({
    DirectoryRegistrations: S.optional(DirectoryRegistrationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDirectoryRegistrationsResponse",
}) as any as S.Schema<ListDirectoryRegistrationsResponse>;
export interface GetServicePrincipalNameResponse {
  ServicePrincipalName?: ServicePrincipalName;
}
export const GetServicePrincipalNameResponse = S.suspend(() =>
  S.Struct({ ServicePrincipalName: S.optional(ServicePrincipalName) }),
).annotations({
  identifier: "GetServicePrincipalNameResponse",
}) as any as S.Schema<GetServicePrincipalNameResponse>;
export interface ListServicePrincipalNamesResponse {
  ServicePrincipalNames?: ServicePrincipalNameList;
  NextToken?: string;
}
export const ListServicePrincipalNamesResponse = S.suspend(() =>
  S.Struct({
    ServicePrincipalNames: S.optional(ServicePrincipalNameList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListServicePrincipalNamesResponse",
}) as any as S.Schema<ListServicePrincipalNamesResponse>;
export interface GetTemplateGroupAccessControlEntryResponse {
  AccessControlEntry?: AccessControlEntry;
}
export const GetTemplateGroupAccessControlEntryResponse = S.suspend(() =>
  S.Struct({ AccessControlEntry: S.optional(AccessControlEntry) }),
).annotations({
  identifier: "GetTemplateGroupAccessControlEntryResponse",
}) as any as S.Schema<GetTemplateGroupAccessControlEntryResponse>;
export interface ListTemplateGroupAccessControlEntriesResponse {
  AccessControlEntries?: AccessControlEntryList;
  NextToken?: string;
}
export const ListTemplateGroupAccessControlEntriesResponse = S.suspend(() =>
  S.Struct({
    AccessControlEntries: S.optional(AccessControlEntryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTemplateGroupAccessControlEntriesResponse",
}) as any as S.Schema<ListTemplateGroupAccessControlEntriesResponse>;
export interface ListTemplatesResponse {
  Templates?: TemplateList;
  NextToken?: string;
}
export const ListTemplatesResponse = S.suspend(() =>
  S.Struct({
    Templates: S.optional(TemplateList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTemplatesResponse",
}) as any as S.Schema<ListTemplatesResponse>;
export interface Template {
  Arn?: string;
  ConnectorArn?: string;
  Definition?: (typeof TemplateDefinition)["Type"];
  Name?: string;
  ObjectIdentifier?: string;
  PolicySchema?: number;
  Status?: string;
  Revision?: TemplateRevision;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const Template = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ConnectorArn: S.optional(S.String),
    Definition: S.optional(TemplateDefinition),
    Name: S.optional(S.String),
    ObjectIdentifier: S.optional(S.String),
    PolicySchema: S.optional(S.Number),
    Status: S.optional(S.String),
    Revision: S.optional(TemplateRevision),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Template" }) as any as S.Schema<Template>;
export interface GetTemplateResponse {
  Template?: Template;
}
export const GetTemplateResponse = S.suspend(() =>
  S.Struct({ Template: S.optional(Template) }),
).annotations({
  identifier: "GetTemplateResponse",
}) as any as S.Schema<GetTemplateResponse>;
export interface CreateTemplateRequest {
  ConnectorArn: string;
  Name: string;
  Definition: (typeof TemplateDefinition)["Type"];
  ClientToken?: string;
  Tags?: Tags;
}
export const CreateTemplateRequest = S.suspend(() =>
  S.Struct({
    ConnectorArn: S.String,
    Name: S.String,
    Definition: TemplateDefinition,
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTemplateRequest",
}) as any as S.Schema<CreateTemplateRequest>;
export interface CreateTemplateResponse {
  TemplateArn?: string;
}
export const CreateTemplateResponse = S.suspend(() =>
  S.Struct({ TemplateArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateTemplateResponse",
}) as any as S.Schema<CreateTemplateResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    ServiceCode: S.optional(S.String),
    QuotaCode: S.optional(S.String),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String, Reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    ServiceCode: S.String,
    QuotaCode: S.String,
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Lists the connectors that you created by using the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateConnector action.
 */
export const listConnectors: {
  (
    input: ListConnectorsRequest,
  ): Effect.Effect<
    ListConnectorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectorsRequest,
  ) => Stream.Stream<
    ListConnectorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectorsRequest,
  ) => Stream.Stream<
    ConnectorSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectorsRequest,
  output: ListConnectorsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Connectors",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Create a group access control entry. Allow or deny Active Directory groups from enrolling and/or
 * autoenrolling with the template based on the group security identifiers (SIDs).
 */
export const createTemplateGroupAccessControlEntry: (
  input: CreateTemplateGroupAccessControlEntryRequest,
) => Effect.Effect<
  CreateTemplateGroupAccessControlEntryResponse,
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
  input: CreateTemplateGroupAccessControlEntryRequest,
  output: CreateTemplateGroupAccessControlEntryResponse,
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
 * Retrieves a certificate template that the connector uses to issue certificates from a
 * private CA.
 */
export const getTemplate: (
  input: GetTemplateRequest,
) => Effect.Effect<
  GetTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateRequest,
  output: GetTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists information about your connector. You specify the connector on input by its ARN
 * (Amazon Resource Name).
 */
export const getConnector: (
  input: GetConnectorRequest,
) => Effect.Effect<
  GetConnectorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectorRequest,
  output: GetConnectorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a directory registration that authorizes communication between Amazon Web Services Private CA and an
 * Active Directory
 */
export const createDirectoryRegistration: (
  input: CreateDirectoryRegistrationRequest,
) => Effect.Effect<
  CreateDirectoryRegistrationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDirectoryRegistrationRequest,
  output: CreateDirectoryRegistrationResponse,
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
 * A structure that contains information about your directory registration.
 */
export const getDirectoryRegistration: (
  input: GetDirectoryRegistrationRequest,
) => Effect.Effect<
  GetDirectoryRegistrationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDirectoryRegistrationRequest,
  output: GetDirectoryRegistrationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the service principal name that the connector uses to authenticate with
 * Active Directory.
 */
export const getServicePrincipalName: (
  input: GetServicePrincipalNameRequest,
) => Effect.Effect<
  GetServicePrincipalNameResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServicePrincipalNameRequest,
  output: GetServicePrincipalNameResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the service principal names that the connector uses to authenticate with
 * Active Directory.
 */
export const listServicePrincipalNames: {
  (
    input: ListServicePrincipalNamesRequest,
  ): Effect.Effect<
    ListServicePrincipalNamesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicePrincipalNamesRequest,
  ) => Stream.Stream<
    ListServicePrincipalNamesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicePrincipalNamesRequest,
  ) => Stream.Stream<
    ServicePrincipalNameSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicePrincipalNamesRequest,
  output: ListServicePrincipalNamesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ServicePrincipalNames",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the group access control entries for a template.
 */
export const getTemplateGroupAccessControlEntry: (
  input: GetTemplateGroupAccessControlEntryRequest,
) => Effect.Effect<
  GetTemplateGroupAccessControlEntryResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateGroupAccessControlEntryRequest,
  output: GetTemplateGroupAccessControlEntryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists group access control entries you created.
 */
export const listTemplateGroupAccessControlEntries: {
  (
    input: ListTemplateGroupAccessControlEntriesRequest,
  ): Effect.Effect<
    ListTemplateGroupAccessControlEntriesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTemplateGroupAccessControlEntriesRequest,
  ) => Stream.Stream<
    ListTemplateGroupAccessControlEntriesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTemplateGroupAccessControlEntriesRequest,
  ) => Stream.Stream<
    AccessControlEntrySummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTemplateGroupAccessControlEntriesRequest,
  output: ListTemplateGroupAccessControlEntriesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AccessControlEntries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the templates, if any, that are associated with a connector.
 */
export const listTemplates: {
  (
    input: ListTemplatesRequest,
  ): Effect.Effect<
    ListTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTemplatesRequest,
  ) => Stream.Stream<
    ListTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTemplatesRequest,
  ) => Stream.Stream<
    TemplateSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTemplatesRequest,
  output: ListTemplatesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Templates",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the tags, if any, that are associated with your resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tags to your resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a connector for Active Directory. You must provide the Amazon Resource Name (ARN) of the
 * connector that you want to delete. You can find the ARN by calling the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_ListConnectors
 * action. Deleting a connector does not deregister your directory with Amazon Web Services Private CA. You can
 * deregister your directory by calling the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_DeleteDirectoryRegistration
 * action.
 */
export const deleteConnector: (
  input: DeleteConnectorRequest,
) => Effect.Effect<
  DeleteConnectorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorRequest,
  output: DeleteConnectorResponse,
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
 * Creates a service principal name (SPN) for the service account in Active Directory. Kerberos
 * authentication uses SPNs to associate a service instance with a service sign-in
 * account.
 */
export const createServicePrincipalName: (
  input: CreateServicePrincipalNameRequest,
) => Effect.Effect<
  CreateServicePrincipalNameResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServicePrincipalNameRequest,
  output: CreateServicePrincipalNameResponse,
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
 * Update a group access control entry you created using CreateTemplateGroupAccessControlEntry.
 */
export const updateTemplateGroupAccessControlEntry: (
  input: UpdateTemplateGroupAccessControlEntryRequest,
) => Effect.Effect<
  UpdateTemplateGroupAccessControlEntryResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateGroupAccessControlEntryRequest,
  output: UpdateTemplateGroupAccessControlEntryResponse,
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
 * Deletes a group access control entry.
 */
export const deleteTemplateGroupAccessControlEntry: (
  input: DeleteTemplateGroupAccessControlEntryRequest,
) => Effect.Effect<
  DeleteTemplateGroupAccessControlEntryResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateGroupAccessControlEntryRequest,
  output: DeleteTemplateGroupAccessControlEntryResponse,
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
 * Update template configuration to define the information included in certificates.
 */
export const updateTemplate: (
  input: UpdateTemplateRequest,
) => Effect.Effect<
  UpdateTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateRequest,
  output: UpdateTemplateResponse,
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
 * Deletes a template. Certificates issued using the template are still valid until they
 * are revoked or expired.
 */
export const deleteTemplate: (
  input: DeleteTemplateRequest,
) => Effect.Effect<
  DeleteTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateRequest,
  output: DeleteTemplateResponse,
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
 * Lists the directory registrations that you created by using the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateDirectoryRegistration
 * action.
 */
export const listDirectoryRegistrations: {
  (
    input: ListDirectoryRegistrationsRequest,
  ): Effect.Effect<
    ListDirectoryRegistrationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDirectoryRegistrationsRequest,
  ) => Stream.Stream<
    ListDirectoryRegistrationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDirectoryRegistrationsRequest,
  ) => Stream.Stream<
    DirectoryRegistrationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDirectoryRegistrationsRequest,
  output: ListDirectoryRegistrationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DirectoryRegistrations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes a directory registration. Deleting a directory registration deauthorizes
 * Amazon Web Services Private CA with the directory.
 */
export const deleteDirectoryRegistration: (
  input: DeleteDirectoryRegistrationRequest,
) => Effect.Effect<
  DeleteDirectoryRegistrationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDirectoryRegistrationRequest,
  output: DeleteDirectoryRegistrationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the service principal name (SPN) used by a connector to authenticate with your
 * Active Directory.
 */
export const deleteServicePrincipalName: (
  input: DeleteServicePrincipalNameRequest,
) => Effect.Effect<
  DeleteServicePrincipalNameResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServicePrincipalNameRequest,
  output: DeleteServicePrincipalNameResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from your resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a connector between Amazon Web Services Private CA and an Active Directory. You must specify the private CA,
 * directory ID, and security groups.
 */
export const createConnector: (
  input: CreateConnectorRequest,
) => Effect.Effect<
  CreateConnectorResponse,
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
  input: CreateConnectorRequest,
  output: CreateConnectorResponse,
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
 * Creates an Active Directory compatible certificate template. The connectors issues certificates
 * using these templates based on the requester’s Active Directory group membership.
 */
export const createTemplate: (
  input: CreateTemplateRequest,
) => Effect.Effect<
  CreateTemplateResponse,
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
  input: CreateTemplateRequest,
  output: CreateTemplateResponse,
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

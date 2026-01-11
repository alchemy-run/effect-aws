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
const ns = T.XmlNamespace("https://iam.amazonaws.com/doc/2010-05-08/");
const svc = T.AwsApiService({
  sdkId: "IAM",
  serviceShapeName: "AWSIdentityManagementV20100508",
});
const auth = T.AwsAuthSigv4({ name: "iam" });
const ver = T.ServiceVersion("2010-05-08");
const proto = T.AwsProtocolsAwsQuery();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "us-east-1" }],
  });
  const _p1 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "cn-north-1" }],
  });
  const _p2 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "us-gov-west-1" }],
  });
  const _p3 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "us-iso-east-1" }],
  });
  const _p4 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "us-isob-east-1" }],
  });
  const _p5 = (_0: unknown) => ({
    authSchemes: [
      {
        name: "sigv4",
        signingRegion: `${_.getAttr(_0, "implicitGlobalRegion")}`,
      },
    ],
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e("https://iam.global.api.aws", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e("https://iam-fips.global.api.aws", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            "https://iam.global.api.amazonwebservices.com.cn",
            _p1(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://iam.cn-north-1.amazonaws.com.cn", _p1(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e("https://iam.us-gov.api.aws", _p2(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e("https://iam.us-gov.api.aws", _p2(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://iam.us-gov.amazonaws.com", _p2(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e("https://iam.us-gov.amazonaws.com", _p2(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://iam.us-iso-east-1.c2s.ic.gov", _p3(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e("https://iam-fips.us-iso-east-1.c2s.ic.gov", _p3(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://iam.us-isob-east-1.sc2s.sgov.gov", _p4(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e("https://iam-fips.us-isob-east-1.sc2s.sgov.gov", _p4(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-e" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://iam.eu-isoe-west-1.cloud.adc-e.uk",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "eu-isoe-west-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://iam.us-isof-south-1.csp.hci.ic.gov",
            {
              authSchemes: [
                { name: "sigv4", signingRegion: "us-isof-south-1" },
              ],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://iam.eusc-de-east-1.amazonaws.eu",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "eusc-de-east-1" }],
            },
            {},
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://iam-fips.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p5(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://iam-fips.${_.getAttr(PartitionResult, "dnsSuffix")}`,
              _p5(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://iam.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p5(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://iam.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p5(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DelegationRequestIdType = string;
export type ArnType = string;
export type ClientIDType = string;
export type InstanceProfileNameType = string;
export type RoleNameType = string;
export type GroupNameType = string;
export type ExistingUserNameType = string;
export type UserNameType = string;
export type PasswordType = string | redacted.Redacted<string>;
export type AccountAliasType = string;
export type AccountIdType = string;
export type DelegationRequestDescriptionType = string;
export type RequestMessageType = string;
export type RequestorWorkflowIdType = string;
export type RedirectUrlType = string;
export type NotificationChannelType = string;
export type SessionDurationType = number;
export type PathType = string;
export type OpenIDConnectProviderUrlType = string;
export type ThumbprintType = string;
export type PolicyNameType = string;
export type PolicyPathType = string;
export type PolicyDocumentType = string;
export type PolicyDescriptionType = string;
export type RoleDescriptionType = string;
export type RoleMaxSessionDurationType = number;
export type SAMLMetadataDocumentType = string;
export type SAMLProviderNameType = string;
export type PrivateKeyType = string | redacted.Redacted<string>;
export type CustomSuffixType = string;
export type ServiceName = string;
export type CredentialAgeDays = number;
export type VirtualMFADeviceName = string;
export type SerialNumberType = string;
export type AccessKeyIdType = string;
export type LimitExceededMessage = string;
export type PolicyVersionIdType = string;
export type ServerCertificateNameType = string;
export type ServiceSpecificCredentialId = string;
export type CertificateIdType = string;
export type PublicKeyIdType = string;
export type OrganizationIdType = string;
export type FeatureDisabledMessage = string;
export type AuthenticationCodeType = string;
export type StringType = string;
export type ReportStateDescriptionType = string;
export type OrganizationsEntityPathType = string;
export type OrganizationsPolicyIdType = string;
export type MaxItemsType = number;
export type MarkerType = string;
export type ReportContentType = Uint8Array;
export type LocaleType = string;
export type JobIDType = string;
export type ServiceNamespaceType = string;
export type DeletionTaskIdType = string;
export type OwnerIdType = string;
export type PathPrefixType = string;
export type AllUsers = boolean;
export type NotesType = string;
export type ActionNameType = string;
export type ResourceNameType = string;
export type ResourceHandlingOptionType = string;
export type TagKeyType = string;
export type MinimumPasswordLengthType = number;
export type MaxPasswordAgeType = number;
export type PasswordReusePreventionType = number;
export type BooleanObjectType = boolean;
export type PrivateKeyIdType = string;
export type CertificateBodyType = string;
export type CertificateChainType = string;
export type PublicKeyMaterialType = string;
export type TagValueType = string;
export type SummaryValueType = number;
export type ContextKeyNameType = string;
export type ContextKeyValueType = string;
export type ConcurrentModificationMessage = string;
export type EntityAlreadyExistsMessage = string;
export type InvalidInputMessage = string;
export type EntityTemporarilyUnmodifiableMessage = string;
export type NoSuchEntityMessage = string;
export type DeleteConflictMessage = string;
export type ExceptionMessage = string;
export type FeatureEnabledMessage = string;
export type ServiceFailureExceptionMessage = string;
export type ResponseMarkerType = string;
export type CredentialReportExpiredExceptionMessage = string;
export type SummaryContentType = string;
export type IntegerType = number;
export type MalformedPolicyDocumentMessage = string;
export type PolicyParameterNameType = string;
export type PolicyParameterValueType = string;
export type AccessKeySecretType = string | redacted.Redacted<string>;
export type IdType = string;
export type AttachmentCountType = number;
export type ServiceUserName = string;
export type ServicePassword = string | redacted.Redacted<string>;
export type ServiceCredentialAlias = string;
export type ServiceCredentialSecret = string | redacted.Redacted<string>;
export type BootstrapDatum = Uint8Array | redacted.Redacted<Uint8Array>;
export type PermissionType = string;
export type RequestorNameType = string;
export type CertificationKeyType = string;
export type CertificationValueType = string;
export type ServiceNameType = string;
export type ReasonType = string;
export type PublicKeyFingerprintType = string;
export type InvalidUserTypeMessage = string;
export type OpenIdIdpCommunicationErrorExceptionMessage = string;
export type ReportGenerationLimitExceededMessage = string;
export type CredentialReportNotPresentExceptionMessage = string;
export type PolicyEvaluationErrorMessage = string;
export type UnmodifiableEntityMessage = string;
export type KeyPairMismatchMessage = string;
export type DuplicateCertificateMessage = string;
export type DuplicateSSHPublicKeyMessage = string;
export type InvalidAuthenticationCodeMessage = string;
export type PolicyNotAttachableMessage = string;
export type PasswordPolicyViolationMessage = string;
export type RegionNameType = string;
export type EntityNameType = string;
export type PolicyIdentifierType = string;
export type EvalDecisionSourceType = string;
export type LineNumber = number;
export type ColumnNumber = number;
export type ConsoleDeepLinkType = string;
export type ServiceNotSupportedMessage = string;
export type CredentialReportNotReadyExceptionMessage = string;
export type UnrecognizedPublicKeyEncodingMessage = string;
export type MalformedCertificateMessage = string;
export type InvalidCertificateMessage = string;
export type InvalidPublicKeyMessage = string;

//# Schemas
export interface DeleteAccountPasswordPolicyRequest {}
export const DeleteAccountPasswordPolicyRequest = S.suspend(() =>
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
  identifier: "DeleteAccountPasswordPolicyRequest",
}) as any as S.Schema<DeleteAccountPasswordPolicyRequest>;
export interface DeleteAccountPasswordPolicyResponse {}
export const DeleteAccountPasswordPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccountPasswordPolicyResponse",
}) as any as S.Schema<DeleteAccountPasswordPolicyResponse>;
export interface DisableOrganizationsRootCredentialsManagementRequest {}
export const DisableOrganizationsRootCredentialsManagementRequest = S.suspend(
  () =>
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
  identifier: "DisableOrganizationsRootCredentialsManagementRequest",
}) as any as S.Schema<DisableOrganizationsRootCredentialsManagementRequest>;
export interface DisableOrganizationsRootSessionsRequest {}
export const DisableOrganizationsRootSessionsRequest = S.suspend(() =>
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
  identifier: "DisableOrganizationsRootSessionsRequest",
}) as any as S.Schema<DisableOrganizationsRootSessionsRequest>;
export interface DisableOutboundWebIdentityFederationRequest {}
export const DisableOutboundWebIdentityFederationRequest = S.suspend(() =>
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
  identifier: "DisableOutboundWebIdentityFederationRequest",
}) as any as S.Schema<DisableOutboundWebIdentityFederationRequest>;
export interface DisableOutboundWebIdentityFederationResponse {}
export const DisableOutboundWebIdentityFederationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableOutboundWebIdentityFederationResponse",
}) as any as S.Schema<DisableOutboundWebIdentityFederationResponse>;
export interface EnableOrganizationsRootCredentialsManagementRequest {}
export const EnableOrganizationsRootCredentialsManagementRequest = S.suspend(
  () =>
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
  identifier: "EnableOrganizationsRootCredentialsManagementRequest",
}) as any as S.Schema<EnableOrganizationsRootCredentialsManagementRequest>;
export interface EnableOrganizationsRootSessionsRequest {}
export const EnableOrganizationsRootSessionsRequest = S.suspend(() =>
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
  identifier: "EnableOrganizationsRootSessionsRequest",
}) as any as S.Schema<EnableOrganizationsRootSessionsRequest>;
export interface EnableOutboundWebIdentityFederationRequest {}
export const EnableOutboundWebIdentityFederationRequest = S.suspend(() =>
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
  identifier: "EnableOutboundWebIdentityFederationRequest",
}) as any as S.Schema<EnableOutboundWebIdentityFederationRequest>;
export interface GenerateCredentialReportRequest {}
export const GenerateCredentialReportRequest = S.suspend(() =>
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
  identifier: "GenerateCredentialReportRequest",
}) as any as S.Schema<GenerateCredentialReportRequest>;
export interface GetAccountPasswordPolicyRequest {}
export const GetAccountPasswordPolicyRequest = S.suspend(() =>
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
  identifier: "GetAccountPasswordPolicyRequest",
}) as any as S.Schema<GetAccountPasswordPolicyRequest>;
export interface GetAccountSummaryRequest {}
export const GetAccountSummaryRequest = S.suspend(() =>
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
  identifier: "GetAccountSummaryRequest",
}) as any as S.Schema<GetAccountSummaryRequest>;
export interface GetCredentialReportRequest {}
export const GetCredentialReportRequest = S.suspend(() =>
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
  identifier: "GetCredentialReportRequest",
}) as any as S.Schema<GetCredentialReportRequest>;
export interface GetOutboundWebIdentityFederationInfoRequest {}
export const GetOutboundWebIdentityFederationInfoRequest = S.suspend(() =>
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
  identifier: "GetOutboundWebIdentityFederationInfoRequest",
}) as any as S.Schema<GetOutboundWebIdentityFederationInfoRequest>;
export interface ListOpenIDConnectProvidersRequest {}
export const ListOpenIDConnectProvidersRequest = S.suspend(() =>
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
  identifier: "ListOpenIDConnectProvidersRequest",
}) as any as S.Schema<ListOpenIDConnectProvidersRequest>;
export interface ListOrganizationsFeaturesRequest {}
export const ListOrganizationsFeaturesRequest = S.suspend(() =>
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
  identifier: "ListOrganizationsFeaturesRequest",
}) as any as S.Schema<ListOrganizationsFeaturesRequest>;
export interface ListSAMLProvidersRequest {}
export const ListSAMLProvidersRequest = S.suspend(() =>
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
  identifier: "ListSAMLProvidersRequest",
}) as any as S.Schema<ListSAMLProvidersRequest>;
export type ClientIDListType = string[];
export const ClientIDListType = S.Array(S.String);
export type ThumbprintListType = string[];
export const ThumbprintListType = S.Array(S.String);
export type AssertionEncryptionModeType =
  | "Required"
  | "Allowed"
  | (string & {});
export const AssertionEncryptionModeType = S.String;
export type FeatureType =
  | "RootCredentialsManagement"
  | "RootSessions"
  | (string & {});
export const FeatureType = S.String;
export type FeaturesListType = FeatureType[];
export const FeaturesListType = S.Array(FeatureType);
export type ReportStateType =
  | "STARTED"
  | "INPROGRESS"
  | "COMPLETE"
  | (string & {});
export const ReportStateType = S.String;
export type AccessAdvisorUsageGranularityType =
  | "SERVICE_LEVEL"
  | "ACTION_LEVEL"
  | (string & {});
export const AccessAdvisorUsageGranularityType = S.String;
export type EntityType =
  | "User"
  | "Role"
  | "Group"
  | "LocalManagedPolicy"
  | "AWSManagedPolicy"
  | (string & {});
export const EntityType = S.String;
export type EntityListType = EntityType[];
export const EntityListType = S.Array(EntityType);
export type SimulationPolicyListType = string[];
export const SimulationPolicyListType = S.Array(S.String);
export type ReportFormatType = "text/csv" | (string & {});
export const ReportFormatType = S.String;
export type SortKeyType =
  | "SERVICE_NAMESPACE_ASCENDING"
  | "SERVICE_NAMESPACE_DESCENDING"
  | "LAST_AUTHENTICATED_TIME_ASCENDING"
  | "LAST_AUTHENTICATED_TIME_DESCENDING"
  | (string & {});
export const SortKeyType = S.String;
export type EncodingType = "SSH" | "PEM" | (string & {});
export const EncodingType = S.String;
export type PolicyUsageType =
  | "PermissionsPolicy"
  | "PermissionsBoundary"
  | (string & {});
export const PolicyUsageType = S.String;
export type PolicyScopeType = "All" | "AWS" | "Local" | (string & {});
export const PolicyScopeType = S.String;
export type ServiceNamespaceListType = string[];
export const ServiceNamespaceListType = S.Array(S.String);
export type AssignmentStatusType =
  | "Assigned"
  | "Unassigned"
  | "Any"
  | (string & {});
export const AssignmentStatusType = S.String;
export type GlobalEndpointTokenVersion = "v1Token" | "v2Token" | (string & {});
export const GlobalEndpointTokenVersion = S.String;
export type ActionNameListType = string[];
export const ActionNameListType = S.Array(S.String);
export type ResourceNameListType = string[];
export const ResourceNameListType = S.Array(S.String);
export type TagKeyListType = string[];
export const TagKeyListType = S.Array(S.String);
export type StatusType = "Active" | "Inactive" | "Expired" | (string & {});
export const StatusType = S.String;
export interface AcceptDelegationRequestRequest {
  DelegationRequestId: string;
}
export const AcceptDelegationRequestRequest = S.suspend(() =>
  S.Struct({ DelegationRequestId: S.String }).pipe(
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
  identifier: "AcceptDelegationRequestRequest",
}) as any as S.Schema<AcceptDelegationRequestRequest>;
export interface AcceptDelegationRequestResponse {}
export const AcceptDelegationRequestResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AcceptDelegationRequestResponse",
}) as any as S.Schema<AcceptDelegationRequestResponse>;
export interface AddClientIDToOpenIDConnectProviderRequest {
  OpenIDConnectProviderArn: string;
  ClientID: string;
}
export const AddClientIDToOpenIDConnectProviderRequest = S.suspend(() =>
  S.Struct({ OpenIDConnectProviderArn: S.String, ClientID: S.String }).pipe(
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
  identifier: "AddClientIDToOpenIDConnectProviderRequest",
}) as any as S.Schema<AddClientIDToOpenIDConnectProviderRequest>;
export interface AddClientIDToOpenIDConnectProviderResponse {}
export const AddClientIDToOpenIDConnectProviderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddClientIDToOpenIDConnectProviderResponse",
}) as any as S.Schema<AddClientIDToOpenIDConnectProviderResponse>;
export interface AddRoleToInstanceProfileRequest {
  InstanceProfileName: string;
  RoleName: string;
}
export const AddRoleToInstanceProfileRequest = S.suspend(() =>
  S.Struct({ InstanceProfileName: S.String, RoleName: S.String }).pipe(
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
  identifier: "AddRoleToInstanceProfileRequest",
}) as any as S.Schema<AddRoleToInstanceProfileRequest>;
export interface AddRoleToInstanceProfileResponse {}
export const AddRoleToInstanceProfileResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddRoleToInstanceProfileResponse",
}) as any as S.Schema<AddRoleToInstanceProfileResponse>;
export interface AddUserToGroupRequest {
  GroupName: string;
  UserName: string;
}
export const AddUserToGroupRequest = S.suspend(() =>
  S.Struct({ GroupName: S.String, UserName: S.String }).pipe(
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
  identifier: "AddUserToGroupRequest",
}) as any as S.Schema<AddUserToGroupRequest>;
export interface AddUserToGroupResponse {}
export const AddUserToGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddUserToGroupResponse",
}) as any as S.Schema<AddUserToGroupResponse>;
export interface AssociateDelegationRequestRequest {
  DelegationRequestId: string;
}
export const AssociateDelegationRequestRequest = S.suspend(() =>
  S.Struct({ DelegationRequestId: S.String }).pipe(
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
  identifier: "AssociateDelegationRequestRequest",
}) as any as S.Schema<AssociateDelegationRequestRequest>;
export interface AssociateDelegationRequestResponse {}
export const AssociateDelegationRequestResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateDelegationRequestResponse",
}) as any as S.Schema<AssociateDelegationRequestResponse>;
export interface AttachGroupPolicyRequest {
  GroupName: string;
  PolicyArn: string;
}
export const AttachGroupPolicyRequest = S.suspend(() =>
  S.Struct({ GroupName: S.String, PolicyArn: S.String }).pipe(
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
  identifier: "AttachGroupPolicyRequest",
}) as any as S.Schema<AttachGroupPolicyRequest>;
export interface AttachGroupPolicyResponse {}
export const AttachGroupPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AttachGroupPolicyResponse",
}) as any as S.Schema<AttachGroupPolicyResponse>;
export interface AttachRolePolicyRequest {
  RoleName: string;
  PolicyArn: string;
}
export const AttachRolePolicyRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String, PolicyArn: S.String }).pipe(
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
  identifier: "AttachRolePolicyRequest",
}) as any as S.Schema<AttachRolePolicyRequest>;
export interface AttachRolePolicyResponse {}
export const AttachRolePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AttachRolePolicyResponse",
}) as any as S.Schema<AttachRolePolicyResponse>;
export interface AttachUserPolicyRequest {
  UserName: string;
  PolicyArn: string;
}
export const AttachUserPolicyRequest = S.suspend(() =>
  S.Struct({ UserName: S.String, PolicyArn: S.String }).pipe(
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
  identifier: "AttachUserPolicyRequest",
}) as any as S.Schema<AttachUserPolicyRequest>;
export interface AttachUserPolicyResponse {}
export const AttachUserPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AttachUserPolicyResponse",
}) as any as S.Schema<AttachUserPolicyResponse>;
export interface ChangePasswordRequest {
  OldPassword: string | redacted.Redacted<string>;
  NewPassword: string | redacted.Redacted<string>;
}
export const ChangePasswordRequest = S.suspend(() =>
  S.Struct({ OldPassword: SensitiveString, NewPassword: SensitiveString }).pipe(
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
  identifier: "ChangePasswordRequest",
}) as any as S.Schema<ChangePasswordRequest>;
export interface ChangePasswordResponse {}
export const ChangePasswordResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ChangePasswordResponse",
}) as any as S.Schema<ChangePasswordResponse>;
export interface CreateAccessKeyRequest {
  UserName?: string;
}
export const CreateAccessKeyRequest = S.suspend(() =>
  S.Struct({ UserName: S.optional(S.String) }).pipe(
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
  identifier: "CreateAccessKeyRequest",
}) as any as S.Schema<CreateAccessKeyRequest>;
export interface CreateAccountAliasRequest {
  AccountAlias: string;
}
export const CreateAccountAliasRequest = S.suspend(() =>
  S.Struct({ AccountAlias: S.String }).pipe(
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
  identifier: "CreateAccountAliasRequest",
}) as any as S.Schema<CreateAccountAliasRequest>;
export interface CreateAccountAliasResponse {}
export const CreateAccountAliasResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateAccountAliasResponse",
}) as any as S.Schema<CreateAccountAliasResponse>;
export interface CreateGroupRequest {
  Path?: string;
  GroupName: string;
}
export const CreateGroupRequest = S.suspend(() =>
  S.Struct({ Path: S.optional(S.String), GroupName: S.String }).pipe(
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
  identifier: "CreateGroupRequest",
}) as any as S.Schema<CreateGroupRequest>;
export interface CreateLoginProfileRequest {
  UserName?: string;
  Password?: string | redacted.Redacted<string>;
  PasswordResetRequired?: boolean;
}
export const CreateLoginProfileRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    Password: S.optional(SensitiveString),
    PasswordResetRequired: S.optional(S.Boolean),
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
  identifier: "CreateLoginProfileRequest",
}) as any as S.Schema<CreateLoginProfileRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagListType = Tag[];
export const TagListType = S.Array(Tag);
export interface CreateOpenIDConnectProviderRequest {
  Url: string;
  ClientIDList?: string[];
  ThumbprintList?: string[];
  Tags?: Tag[];
}
export const CreateOpenIDConnectProviderRequest = S.suspend(() =>
  S.Struct({
    Url: S.String,
    ClientIDList: S.optional(ClientIDListType),
    ThumbprintList: S.optional(ThumbprintListType),
    Tags: S.optional(TagListType),
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
  identifier: "CreateOpenIDConnectProviderRequest",
}) as any as S.Schema<CreateOpenIDConnectProviderRequest>;
export interface CreatePolicyRequest {
  PolicyName: string;
  Path?: string;
  PolicyDocument: string;
  Description?: string;
  Tags?: Tag[];
}
export const CreatePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyName: S.String,
    Path: S.optional(S.String),
    PolicyDocument: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagListType),
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
  identifier: "CreatePolicyRequest",
}) as any as S.Schema<CreatePolicyRequest>;
export interface CreatePolicyVersionRequest {
  PolicyArn: string;
  PolicyDocument: string;
  SetAsDefault?: boolean;
}
export const CreatePolicyVersionRequest = S.suspend(() =>
  S.Struct({
    PolicyArn: S.String,
    PolicyDocument: S.String,
    SetAsDefault: S.optional(S.Boolean),
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
  identifier: "CreatePolicyVersionRequest",
}) as any as S.Schema<CreatePolicyVersionRequest>;
export interface CreateRoleRequest {
  Path?: string;
  RoleName: string;
  AssumeRolePolicyDocument: string;
  Description?: string;
  MaxSessionDuration?: number;
  PermissionsBoundary?: string;
  Tags?: Tag[];
}
export const CreateRoleRequest = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    RoleName: S.String,
    AssumeRolePolicyDocument: S.String,
    Description: S.optional(S.String),
    MaxSessionDuration: S.optional(S.Number),
    PermissionsBoundary: S.optional(S.String),
    Tags: S.optional(TagListType),
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
  identifier: "CreateRoleRequest",
}) as any as S.Schema<CreateRoleRequest>;
export interface CreateSAMLProviderRequest {
  SAMLMetadataDocument: string;
  Name: string;
  Tags?: Tag[];
  AssertionEncryptionMode?: AssertionEncryptionModeType;
  AddPrivateKey?: string | redacted.Redacted<string>;
}
export const CreateSAMLProviderRequest = S.suspend(() =>
  S.Struct({
    SAMLMetadataDocument: S.String,
    Name: S.String,
    Tags: S.optional(TagListType),
    AssertionEncryptionMode: S.optional(AssertionEncryptionModeType),
    AddPrivateKey: S.optional(SensitiveString),
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
  identifier: "CreateSAMLProviderRequest",
}) as any as S.Schema<CreateSAMLProviderRequest>;
export interface CreateServiceLinkedRoleRequest {
  AWSServiceName: string;
  Description?: string;
  CustomSuffix?: string;
}
export const CreateServiceLinkedRoleRequest = S.suspend(() =>
  S.Struct({
    AWSServiceName: S.String,
    Description: S.optional(S.String),
    CustomSuffix: S.optional(S.String),
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
  identifier: "CreateServiceLinkedRoleRequest",
}) as any as S.Schema<CreateServiceLinkedRoleRequest>;
export interface CreateServiceSpecificCredentialRequest {
  UserName: string;
  ServiceName: string;
  CredentialAgeDays?: number;
}
export const CreateServiceSpecificCredentialRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    ServiceName: S.String,
    CredentialAgeDays: S.optional(S.Number),
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
  identifier: "CreateServiceSpecificCredentialRequest",
}) as any as S.Schema<CreateServiceSpecificCredentialRequest>;
export interface CreateUserRequest {
  Path?: string;
  UserName: string;
  PermissionsBoundary?: string;
  Tags?: Tag[];
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    UserName: S.String,
    PermissionsBoundary: S.optional(S.String),
    Tags: S.optional(TagListType),
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
  identifier: "CreateUserRequest",
}) as any as S.Schema<CreateUserRequest>;
export interface CreateVirtualMFADeviceRequest {
  Path?: string;
  VirtualMFADeviceName: string;
  Tags?: Tag[];
}
export const CreateVirtualMFADeviceRequest = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    VirtualMFADeviceName: S.String,
    Tags: S.optional(TagListType),
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
  identifier: "CreateVirtualMFADeviceRequest",
}) as any as S.Schema<CreateVirtualMFADeviceRequest>;
export interface DeactivateMFADeviceRequest {
  UserName?: string;
  SerialNumber: string;
}
export const DeactivateMFADeviceRequest = S.suspend(() =>
  S.Struct({ UserName: S.optional(S.String), SerialNumber: S.String }).pipe(
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
  identifier: "DeactivateMFADeviceRequest",
}) as any as S.Schema<DeactivateMFADeviceRequest>;
export interface DeactivateMFADeviceResponse {}
export const DeactivateMFADeviceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeactivateMFADeviceResponse",
}) as any as S.Schema<DeactivateMFADeviceResponse>;
export interface DeleteAccessKeyRequest {
  UserName?: string;
  AccessKeyId: string;
}
export const DeleteAccessKeyRequest = S.suspend(() =>
  S.Struct({ UserName: S.optional(S.String), AccessKeyId: S.String }).pipe(
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
  identifier: "DeleteAccessKeyRequest",
}) as any as S.Schema<DeleteAccessKeyRequest>;
export interface DeleteAccessKeyResponse {}
export const DeleteAccessKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessKeyResponse",
}) as any as S.Schema<DeleteAccessKeyResponse>;
export interface DeleteAccountAliasRequest {
  AccountAlias: string;
}
export const DeleteAccountAliasRequest = S.suspend(() =>
  S.Struct({ AccountAlias: S.String }).pipe(
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
  identifier: "DeleteAccountAliasRequest",
}) as any as S.Schema<DeleteAccountAliasRequest>;
export interface DeleteAccountAliasResponse {}
export const DeleteAccountAliasResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccountAliasResponse",
}) as any as S.Schema<DeleteAccountAliasResponse>;
export interface DeleteGroupRequest {
  GroupName: string;
}
export const DeleteGroupRequest = S.suspend(() =>
  S.Struct({ GroupName: S.String }).pipe(
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
  identifier: "DeleteGroupRequest",
}) as any as S.Schema<DeleteGroupRequest>;
export interface DeleteGroupResponse {}
export const DeleteGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteGroupResponse",
}) as any as S.Schema<DeleteGroupResponse>;
export interface DeleteGroupPolicyRequest {
  GroupName: string;
  PolicyName: string;
}
export const DeleteGroupPolicyRequest = S.suspend(() =>
  S.Struct({ GroupName: S.String, PolicyName: S.String }).pipe(
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
  identifier: "DeleteGroupPolicyRequest",
}) as any as S.Schema<DeleteGroupPolicyRequest>;
export interface DeleteGroupPolicyResponse {}
export const DeleteGroupPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteGroupPolicyResponse",
}) as any as S.Schema<DeleteGroupPolicyResponse>;
export interface DeleteInstanceProfileRequest {
  InstanceProfileName: string;
}
export const DeleteInstanceProfileRequest = S.suspend(() =>
  S.Struct({ InstanceProfileName: S.String }).pipe(
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
  identifier: "DeleteInstanceProfileRequest",
}) as any as S.Schema<DeleteInstanceProfileRequest>;
export interface DeleteInstanceProfileResponse {}
export const DeleteInstanceProfileResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteInstanceProfileResponse",
}) as any as S.Schema<DeleteInstanceProfileResponse>;
export interface DeleteLoginProfileRequest {
  UserName?: string;
}
export const DeleteLoginProfileRequest = S.suspend(() =>
  S.Struct({ UserName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteLoginProfileRequest",
}) as any as S.Schema<DeleteLoginProfileRequest>;
export interface DeleteLoginProfileResponse {}
export const DeleteLoginProfileResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLoginProfileResponse",
}) as any as S.Schema<DeleteLoginProfileResponse>;
export interface DeleteOpenIDConnectProviderRequest {
  OpenIDConnectProviderArn: string;
}
export const DeleteOpenIDConnectProviderRequest = S.suspend(() =>
  S.Struct({ OpenIDConnectProviderArn: S.String }).pipe(
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
  identifier: "DeleteOpenIDConnectProviderRequest",
}) as any as S.Schema<DeleteOpenIDConnectProviderRequest>;
export interface DeleteOpenIDConnectProviderResponse {}
export const DeleteOpenIDConnectProviderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOpenIDConnectProviderResponse",
}) as any as S.Schema<DeleteOpenIDConnectProviderResponse>;
export interface DeletePolicyRequest {
  PolicyArn: string;
}
export const DeletePolicyRequest = S.suspend(() =>
  S.Struct({ PolicyArn: S.String }).pipe(
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
  identifier: "DeletePolicyRequest",
}) as any as S.Schema<DeletePolicyRequest>;
export interface DeletePolicyResponse {}
export const DeletePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePolicyResponse",
}) as any as S.Schema<DeletePolicyResponse>;
export interface DeletePolicyVersionRequest {
  PolicyArn: string;
  VersionId: string;
}
export const DeletePolicyVersionRequest = S.suspend(() =>
  S.Struct({ PolicyArn: S.String, VersionId: S.String }).pipe(
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
  identifier: "DeletePolicyVersionRequest",
}) as any as S.Schema<DeletePolicyVersionRequest>;
export interface DeletePolicyVersionResponse {}
export const DeletePolicyVersionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePolicyVersionResponse",
}) as any as S.Schema<DeletePolicyVersionResponse>;
export interface DeleteRoleRequest {
  RoleName: string;
}
export const DeleteRoleRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String }).pipe(
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
  identifier: "DeleteRoleRequest",
}) as any as S.Schema<DeleteRoleRequest>;
export interface DeleteRoleResponse {}
export const DeleteRoleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRoleResponse",
}) as any as S.Schema<DeleteRoleResponse>;
export interface DeleteRolePermissionsBoundaryRequest {
  RoleName: string;
}
export const DeleteRolePermissionsBoundaryRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String }).pipe(
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
  identifier: "DeleteRolePermissionsBoundaryRequest",
}) as any as S.Schema<DeleteRolePermissionsBoundaryRequest>;
export interface DeleteRolePermissionsBoundaryResponse {}
export const DeleteRolePermissionsBoundaryResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRolePermissionsBoundaryResponse",
}) as any as S.Schema<DeleteRolePermissionsBoundaryResponse>;
export interface DeleteRolePolicyRequest {
  RoleName: string;
  PolicyName: string;
}
export const DeleteRolePolicyRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String, PolicyName: S.String }).pipe(
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
  identifier: "DeleteRolePolicyRequest",
}) as any as S.Schema<DeleteRolePolicyRequest>;
export interface DeleteRolePolicyResponse {}
export const DeleteRolePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRolePolicyResponse",
}) as any as S.Schema<DeleteRolePolicyResponse>;
export interface DeleteSAMLProviderRequest {
  SAMLProviderArn: string;
}
export const DeleteSAMLProviderRequest = S.suspend(() =>
  S.Struct({ SAMLProviderArn: S.String }).pipe(
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
  identifier: "DeleteSAMLProviderRequest",
}) as any as S.Schema<DeleteSAMLProviderRequest>;
export interface DeleteSAMLProviderResponse {}
export const DeleteSAMLProviderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSAMLProviderResponse",
}) as any as S.Schema<DeleteSAMLProviderResponse>;
export interface DeleteServerCertificateRequest {
  ServerCertificateName: string;
}
export const DeleteServerCertificateRequest = S.suspend(() =>
  S.Struct({ ServerCertificateName: S.String }).pipe(
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
  identifier: "DeleteServerCertificateRequest",
}) as any as S.Schema<DeleteServerCertificateRequest>;
export interface DeleteServerCertificateResponse {}
export const DeleteServerCertificateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteServerCertificateResponse",
}) as any as S.Schema<DeleteServerCertificateResponse>;
export interface DeleteServiceLinkedRoleRequest {
  RoleName: string;
}
export const DeleteServiceLinkedRoleRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String }).pipe(
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
  identifier: "DeleteServiceLinkedRoleRequest",
}) as any as S.Schema<DeleteServiceLinkedRoleRequest>;
export interface DeleteServiceSpecificCredentialRequest {
  UserName?: string;
  ServiceSpecificCredentialId: string;
}
export const DeleteServiceSpecificCredentialRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    ServiceSpecificCredentialId: S.String,
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
  identifier: "DeleteServiceSpecificCredentialRequest",
}) as any as S.Schema<DeleteServiceSpecificCredentialRequest>;
export interface DeleteServiceSpecificCredentialResponse {}
export const DeleteServiceSpecificCredentialResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteServiceSpecificCredentialResponse",
}) as any as S.Schema<DeleteServiceSpecificCredentialResponse>;
export interface DeleteSigningCertificateRequest {
  UserName?: string;
  CertificateId: string;
}
export const DeleteSigningCertificateRequest = S.suspend(() =>
  S.Struct({ UserName: S.optional(S.String), CertificateId: S.String }).pipe(
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
  identifier: "DeleteSigningCertificateRequest",
}) as any as S.Schema<DeleteSigningCertificateRequest>;
export interface DeleteSigningCertificateResponse {}
export const DeleteSigningCertificateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSigningCertificateResponse",
}) as any as S.Schema<DeleteSigningCertificateResponse>;
export interface DeleteSSHPublicKeyRequest {
  UserName: string;
  SSHPublicKeyId: string;
}
export const DeleteSSHPublicKeyRequest = S.suspend(() =>
  S.Struct({ UserName: S.String, SSHPublicKeyId: S.String }).pipe(
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
  identifier: "DeleteSSHPublicKeyRequest",
}) as any as S.Schema<DeleteSSHPublicKeyRequest>;
export interface DeleteSSHPublicKeyResponse {}
export const DeleteSSHPublicKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSSHPublicKeyResponse",
}) as any as S.Schema<DeleteSSHPublicKeyResponse>;
export interface DeleteUserRequest {
  UserName: string;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({ UserName: S.String }).pipe(
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
  identifier: "DeleteUserRequest",
}) as any as S.Schema<DeleteUserRequest>;
export interface DeleteUserResponse {}
export const DeleteUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserResponse",
}) as any as S.Schema<DeleteUserResponse>;
export interface DeleteUserPermissionsBoundaryRequest {
  UserName: string;
}
export const DeleteUserPermissionsBoundaryRequest = S.suspend(() =>
  S.Struct({ UserName: S.String }).pipe(
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
  identifier: "DeleteUserPermissionsBoundaryRequest",
}) as any as S.Schema<DeleteUserPermissionsBoundaryRequest>;
export interface DeleteUserPermissionsBoundaryResponse {}
export const DeleteUserPermissionsBoundaryResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserPermissionsBoundaryResponse",
}) as any as S.Schema<DeleteUserPermissionsBoundaryResponse>;
export interface DeleteUserPolicyRequest {
  UserName: string;
  PolicyName: string;
}
export const DeleteUserPolicyRequest = S.suspend(() =>
  S.Struct({ UserName: S.String, PolicyName: S.String }).pipe(
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
  identifier: "DeleteUserPolicyRequest",
}) as any as S.Schema<DeleteUserPolicyRequest>;
export interface DeleteUserPolicyResponse {}
export const DeleteUserPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserPolicyResponse",
}) as any as S.Schema<DeleteUserPolicyResponse>;
export interface DeleteVirtualMFADeviceRequest {
  SerialNumber: string;
}
export const DeleteVirtualMFADeviceRequest = S.suspend(() =>
  S.Struct({ SerialNumber: S.String }).pipe(
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
  identifier: "DeleteVirtualMFADeviceRequest",
}) as any as S.Schema<DeleteVirtualMFADeviceRequest>;
export interface DeleteVirtualMFADeviceResponse {}
export const DeleteVirtualMFADeviceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteVirtualMFADeviceResponse",
}) as any as S.Schema<DeleteVirtualMFADeviceResponse>;
export interface DetachGroupPolicyRequest {
  GroupName: string;
  PolicyArn: string;
}
export const DetachGroupPolicyRequest = S.suspend(() =>
  S.Struct({ GroupName: S.String, PolicyArn: S.String }).pipe(
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
  identifier: "DetachGroupPolicyRequest",
}) as any as S.Schema<DetachGroupPolicyRequest>;
export interface DetachGroupPolicyResponse {}
export const DetachGroupPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DetachGroupPolicyResponse",
}) as any as S.Schema<DetachGroupPolicyResponse>;
export interface DetachRolePolicyRequest {
  RoleName: string;
  PolicyArn: string;
}
export const DetachRolePolicyRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String, PolicyArn: S.String }).pipe(
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
  identifier: "DetachRolePolicyRequest",
}) as any as S.Schema<DetachRolePolicyRequest>;
export interface DetachRolePolicyResponse {}
export const DetachRolePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DetachRolePolicyResponse",
}) as any as S.Schema<DetachRolePolicyResponse>;
export interface DetachUserPolicyRequest {
  UserName: string;
  PolicyArn: string;
}
export const DetachUserPolicyRequest = S.suspend(() =>
  S.Struct({ UserName: S.String, PolicyArn: S.String }).pipe(
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
  identifier: "DetachUserPolicyRequest",
}) as any as S.Schema<DetachUserPolicyRequest>;
export interface DetachUserPolicyResponse {}
export const DetachUserPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DetachUserPolicyResponse",
}) as any as S.Schema<DetachUserPolicyResponse>;
export interface DisableOrganizationsRootCredentialsManagementResponse {
  OrganizationId?: string;
  EnabledFeatures?: FeatureType[];
}
export const DisableOrganizationsRootCredentialsManagementResponse = S.suspend(
  () =>
    S.Struct({
      OrganizationId: S.optional(S.String),
      EnabledFeatures: S.optional(FeaturesListType),
    }).pipe(ns),
).annotations({
  identifier: "DisableOrganizationsRootCredentialsManagementResponse",
}) as any as S.Schema<DisableOrganizationsRootCredentialsManagementResponse>;
export interface DisableOrganizationsRootSessionsResponse {
  OrganizationId?: string;
  EnabledFeatures?: FeatureType[];
}
export const DisableOrganizationsRootSessionsResponse = S.suspend(() =>
  S.Struct({
    OrganizationId: S.optional(S.String),
    EnabledFeatures: S.optional(FeaturesListType),
  }).pipe(ns),
).annotations({
  identifier: "DisableOrganizationsRootSessionsResponse",
}) as any as S.Schema<DisableOrganizationsRootSessionsResponse>;
export interface EnableMFADeviceRequest {
  UserName: string;
  SerialNumber: string;
  AuthenticationCode1: string;
  AuthenticationCode2: string;
}
export const EnableMFADeviceRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    SerialNumber: S.String,
    AuthenticationCode1: S.String,
    AuthenticationCode2: S.String,
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
  identifier: "EnableMFADeviceRequest",
}) as any as S.Schema<EnableMFADeviceRequest>;
export interface EnableMFADeviceResponse {}
export const EnableMFADeviceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableMFADeviceResponse",
}) as any as S.Schema<EnableMFADeviceResponse>;
export interface EnableOrganizationsRootCredentialsManagementResponse {
  OrganizationId?: string;
  EnabledFeatures?: FeatureType[];
}
export const EnableOrganizationsRootCredentialsManagementResponse = S.suspend(
  () =>
    S.Struct({
      OrganizationId: S.optional(S.String),
      EnabledFeatures: S.optional(FeaturesListType),
    }).pipe(ns),
).annotations({
  identifier: "EnableOrganizationsRootCredentialsManagementResponse",
}) as any as S.Schema<EnableOrganizationsRootCredentialsManagementResponse>;
export interface EnableOrganizationsRootSessionsResponse {
  OrganizationId?: string;
  EnabledFeatures?: FeatureType[];
}
export const EnableOrganizationsRootSessionsResponse = S.suspend(() =>
  S.Struct({
    OrganizationId: S.optional(S.String),
    EnabledFeatures: S.optional(FeaturesListType),
  }).pipe(ns),
).annotations({
  identifier: "EnableOrganizationsRootSessionsResponse",
}) as any as S.Schema<EnableOrganizationsRootSessionsResponse>;
export interface EnableOutboundWebIdentityFederationResponse {
  IssuerIdentifier?: string;
}
export const EnableOutboundWebIdentityFederationResponse = S.suspend(() =>
  S.Struct({ IssuerIdentifier: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "EnableOutboundWebIdentityFederationResponse",
}) as any as S.Schema<EnableOutboundWebIdentityFederationResponse>;
export interface GenerateCredentialReportResponse {
  State?: ReportStateType;
  Description?: string;
}
export const GenerateCredentialReportResponse = S.suspend(() =>
  S.Struct({
    State: S.optional(ReportStateType),
    Description: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GenerateCredentialReportResponse",
}) as any as S.Schema<GenerateCredentialReportResponse>;
export interface GenerateOrganizationsAccessReportRequest {
  EntityPath: string;
  OrganizationsPolicyId?: string;
}
export const GenerateOrganizationsAccessReportRequest = S.suspend(() =>
  S.Struct({
    EntityPath: S.String,
    OrganizationsPolicyId: S.optional(S.String),
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
  identifier: "GenerateOrganizationsAccessReportRequest",
}) as any as S.Schema<GenerateOrganizationsAccessReportRequest>;
export interface GenerateServiceLastAccessedDetailsRequest {
  Arn: string;
  Granularity?: AccessAdvisorUsageGranularityType;
}
export const GenerateServiceLastAccessedDetailsRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Granularity: S.optional(AccessAdvisorUsageGranularityType),
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
  identifier: "GenerateServiceLastAccessedDetailsRequest",
}) as any as S.Schema<GenerateServiceLastAccessedDetailsRequest>;
export interface GetAccessKeyLastUsedRequest {
  AccessKeyId: string;
}
export const GetAccessKeyLastUsedRequest = S.suspend(() =>
  S.Struct({ AccessKeyId: S.String }).pipe(
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
  identifier: "GetAccessKeyLastUsedRequest",
}) as any as S.Schema<GetAccessKeyLastUsedRequest>;
export interface GetAccountAuthorizationDetailsRequest {
  Filter?: EntityType[];
  MaxItems?: number;
  Marker?: string;
}
export const GetAccountAuthorizationDetailsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(EntityListType),
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "GetAccountAuthorizationDetailsRequest",
}) as any as S.Schema<GetAccountAuthorizationDetailsRequest>;
export interface GetContextKeysForCustomPolicyRequest {
  PolicyInputList: string[];
}
export const GetContextKeysForCustomPolicyRequest = S.suspend(() =>
  S.Struct({ PolicyInputList: SimulationPolicyListType }).pipe(
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
  identifier: "GetContextKeysForCustomPolicyRequest",
}) as any as S.Schema<GetContextKeysForCustomPolicyRequest>;
export interface GetContextKeysForPrincipalPolicyRequest {
  PolicySourceArn: string;
  PolicyInputList?: string[];
}
export const GetContextKeysForPrincipalPolicyRequest = S.suspend(() =>
  S.Struct({
    PolicySourceArn: S.String,
    PolicyInputList: S.optional(SimulationPolicyListType),
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
  identifier: "GetContextKeysForPrincipalPolicyRequest",
}) as any as S.Schema<GetContextKeysForPrincipalPolicyRequest>;
export interface GetCredentialReportResponse {
  Content?: Uint8Array;
  ReportFormat?: ReportFormatType;
  GeneratedTime?: Date;
}
export const GetCredentialReportResponse = S.suspend(() =>
  S.Struct({
    Content: S.optional(T.Blob),
    ReportFormat: S.optional(ReportFormatType),
    GeneratedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }).pipe(ns),
).annotations({
  identifier: "GetCredentialReportResponse",
}) as any as S.Schema<GetCredentialReportResponse>;
export interface GetDelegationRequestRequest {
  DelegationRequestId: string;
  DelegationPermissionCheck?: boolean;
}
export const GetDelegationRequestRequest = S.suspend(() =>
  S.Struct({
    DelegationRequestId: S.String,
    DelegationPermissionCheck: S.optional(S.Boolean),
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
  identifier: "GetDelegationRequestRequest",
}) as any as S.Schema<GetDelegationRequestRequest>;
export interface GetGroupRequest {
  GroupName: string;
  Marker?: string;
  MaxItems?: number;
}
export const GetGroupRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "GetGroupRequest",
}) as any as S.Schema<GetGroupRequest>;
export interface GetGroupPolicyRequest {
  GroupName: string;
  PolicyName: string;
}
export const GetGroupPolicyRequest = S.suspend(() =>
  S.Struct({ GroupName: S.String, PolicyName: S.String }).pipe(
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
  identifier: "GetGroupPolicyRequest",
}) as any as S.Schema<GetGroupPolicyRequest>;
export interface GetHumanReadableSummaryRequest {
  EntityArn: string;
  Locale?: string;
}
export const GetHumanReadableSummaryRequest = S.suspend(() =>
  S.Struct({ EntityArn: S.String, Locale: S.optional(S.String) }).pipe(
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
  identifier: "GetHumanReadableSummaryRequest",
}) as any as S.Schema<GetHumanReadableSummaryRequest>;
export interface GetInstanceProfileRequest {
  InstanceProfileName: string;
}
export const GetInstanceProfileRequest = S.suspend(() =>
  S.Struct({ InstanceProfileName: S.String }).pipe(
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
  identifier: "GetInstanceProfileRequest",
}) as any as S.Schema<GetInstanceProfileRequest>;
export interface GetLoginProfileRequest {
  UserName?: string;
}
export const GetLoginProfileRequest = S.suspend(() =>
  S.Struct({ UserName: S.optional(S.String) }).pipe(
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
  identifier: "GetLoginProfileRequest",
}) as any as S.Schema<GetLoginProfileRequest>;
export interface GetMFADeviceRequest {
  SerialNumber: string;
  UserName?: string;
}
export const GetMFADeviceRequest = S.suspend(() =>
  S.Struct({ SerialNumber: S.String, UserName: S.optional(S.String) }).pipe(
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
  identifier: "GetMFADeviceRequest",
}) as any as S.Schema<GetMFADeviceRequest>;
export interface GetOpenIDConnectProviderRequest {
  OpenIDConnectProviderArn: string;
}
export const GetOpenIDConnectProviderRequest = S.suspend(() =>
  S.Struct({ OpenIDConnectProviderArn: S.String }).pipe(
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
  identifier: "GetOpenIDConnectProviderRequest",
}) as any as S.Schema<GetOpenIDConnectProviderRequest>;
export interface GetOrganizationsAccessReportRequest {
  JobId: string;
  MaxItems?: number;
  Marker?: string;
  SortKey?: SortKeyType;
}
export const GetOrganizationsAccessReportRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
    SortKey: S.optional(SortKeyType),
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
  identifier: "GetOrganizationsAccessReportRequest",
}) as any as S.Schema<GetOrganizationsAccessReportRequest>;
export interface GetOutboundWebIdentityFederationInfoResponse {
  IssuerIdentifier?: string;
  JwtVendingEnabled?: boolean;
}
export const GetOutboundWebIdentityFederationInfoResponse = S.suspend(() =>
  S.Struct({
    IssuerIdentifier: S.optional(S.String),
    JwtVendingEnabled: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "GetOutboundWebIdentityFederationInfoResponse",
}) as any as S.Schema<GetOutboundWebIdentityFederationInfoResponse>;
export interface GetPolicyRequest {
  PolicyArn: string;
}
export const GetPolicyRequest = S.suspend(() =>
  S.Struct({ PolicyArn: S.String }).pipe(
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
  identifier: "GetPolicyRequest",
}) as any as S.Schema<GetPolicyRequest>;
export interface GetPolicyVersionRequest {
  PolicyArn: string;
  VersionId: string;
}
export const GetPolicyVersionRequest = S.suspend(() =>
  S.Struct({ PolicyArn: S.String, VersionId: S.String }).pipe(
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
  identifier: "GetPolicyVersionRequest",
}) as any as S.Schema<GetPolicyVersionRequest>;
export interface GetRoleRequest {
  RoleName: string;
}
export const GetRoleRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String }).pipe(
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
  identifier: "GetRoleRequest",
}) as any as S.Schema<GetRoleRequest>;
export interface GetRolePolicyRequest {
  RoleName: string;
  PolicyName: string;
}
export const GetRolePolicyRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String, PolicyName: S.String }).pipe(
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
  identifier: "GetRolePolicyRequest",
}) as any as S.Schema<GetRolePolicyRequest>;
export interface GetSAMLProviderRequest {
  SAMLProviderArn: string;
}
export const GetSAMLProviderRequest = S.suspend(() =>
  S.Struct({ SAMLProviderArn: S.String }).pipe(
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
  identifier: "GetSAMLProviderRequest",
}) as any as S.Schema<GetSAMLProviderRequest>;
export interface GetServerCertificateRequest {
  ServerCertificateName: string;
}
export const GetServerCertificateRequest = S.suspend(() =>
  S.Struct({ ServerCertificateName: S.String }).pipe(
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
  identifier: "GetServerCertificateRequest",
}) as any as S.Schema<GetServerCertificateRequest>;
export interface GetServiceLastAccessedDetailsRequest {
  JobId: string;
  MaxItems?: number;
  Marker?: string;
}
export const GetServiceLastAccessedDetailsRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "GetServiceLastAccessedDetailsRequest",
}) as any as S.Schema<GetServiceLastAccessedDetailsRequest>;
export interface GetServiceLastAccessedDetailsWithEntitiesRequest {
  JobId: string;
  ServiceNamespace: string;
  MaxItems?: number;
  Marker?: string;
}
export const GetServiceLastAccessedDetailsWithEntitiesRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    ServiceNamespace: S.String,
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "GetServiceLastAccessedDetailsWithEntitiesRequest",
}) as any as S.Schema<GetServiceLastAccessedDetailsWithEntitiesRequest>;
export interface GetServiceLinkedRoleDeletionStatusRequest {
  DeletionTaskId: string;
}
export const GetServiceLinkedRoleDeletionStatusRequest = S.suspend(() =>
  S.Struct({ DeletionTaskId: S.String }).pipe(
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
  identifier: "GetServiceLinkedRoleDeletionStatusRequest",
}) as any as S.Schema<GetServiceLinkedRoleDeletionStatusRequest>;
export interface GetSSHPublicKeyRequest {
  UserName: string;
  SSHPublicKeyId: string;
  Encoding: EncodingType;
}
export const GetSSHPublicKeyRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    SSHPublicKeyId: S.String,
    Encoding: EncodingType,
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
  identifier: "GetSSHPublicKeyRequest",
}) as any as S.Schema<GetSSHPublicKeyRequest>;
export interface GetUserRequest {
  UserName?: string;
}
export const GetUserRequest = S.suspend(() =>
  S.Struct({ UserName: S.optional(S.String) }).pipe(
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
  identifier: "GetUserRequest",
}) as any as S.Schema<GetUserRequest>;
export interface GetUserPolicyRequest {
  UserName: string;
  PolicyName: string;
}
export const GetUserPolicyRequest = S.suspend(() =>
  S.Struct({ UserName: S.String, PolicyName: S.String }).pipe(
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
  identifier: "GetUserPolicyRequest",
}) as any as S.Schema<GetUserPolicyRequest>;
export interface ListAccessKeysRequest {
  UserName?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListAccessKeysRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListAccessKeysRequest",
}) as any as S.Schema<ListAccessKeysRequest>;
export interface ListAccountAliasesRequest {
  Marker?: string;
  MaxItems?: number;
}
export const ListAccountAliasesRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListAccountAliasesRequest",
}) as any as S.Schema<ListAccountAliasesRequest>;
export interface ListAttachedGroupPoliciesRequest {
  GroupName: string;
  PathPrefix?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListAttachedGroupPoliciesRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListAttachedGroupPoliciesRequest",
}) as any as S.Schema<ListAttachedGroupPoliciesRequest>;
export interface ListAttachedRolePoliciesRequest {
  RoleName: string;
  PathPrefix?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListAttachedRolePoliciesRequest = S.suspend(() =>
  S.Struct({
    RoleName: S.String,
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListAttachedRolePoliciesRequest",
}) as any as S.Schema<ListAttachedRolePoliciesRequest>;
export interface ListAttachedUserPoliciesRequest {
  UserName: string;
  PathPrefix?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListAttachedUserPoliciesRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListAttachedUserPoliciesRequest",
}) as any as S.Schema<ListAttachedUserPoliciesRequest>;
export interface ListDelegationRequestsRequest {
  OwnerId?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListDelegationRequestsRequest = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListDelegationRequestsRequest",
}) as any as S.Schema<ListDelegationRequestsRequest>;
export interface ListEntitiesForPolicyRequest {
  PolicyArn: string;
  EntityFilter?: EntityType;
  PathPrefix?: string;
  PolicyUsageFilter?: PolicyUsageType;
  Marker?: string;
  MaxItems?: number;
}
export const ListEntitiesForPolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyArn: S.String,
    EntityFilter: S.optional(EntityType),
    PathPrefix: S.optional(S.String),
    PolicyUsageFilter: S.optional(PolicyUsageType),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListEntitiesForPolicyRequest",
}) as any as S.Schema<ListEntitiesForPolicyRequest>;
export interface ListGroupPoliciesRequest {
  GroupName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListGroupPoliciesRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListGroupPoliciesRequest",
}) as any as S.Schema<ListGroupPoliciesRequest>;
export interface ListGroupsRequest {
  PathPrefix?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListGroupsRequest = S.suspend(() =>
  S.Struct({
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListGroupsRequest",
}) as any as S.Schema<ListGroupsRequest>;
export interface ListGroupsForUserRequest {
  UserName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListGroupsForUserRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListGroupsForUserRequest",
}) as any as S.Schema<ListGroupsForUserRequest>;
export interface ListInstanceProfilesRequest {
  PathPrefix?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListInstanceProfilesRequest = S.suspend(() =>
  S.Struct({
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListInstanceProfilesRequest",
}) as any as S.Schema<ListInstanceProfilesRequest>;
export interface ListInstanceProfilesForRoleRequest {
  RoleName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListInstanceProfilesForRoleRequest = S.suspend(() =>
  S.Struct({
    RoleName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListInstanceProfilesForRoleRequest",
}) as any as S.Schema<ListInstanceProfilesForRoleRequest>;
export interface ListInstanceProfileTagsRequest {
  InstanceProfileName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListInstanceProfileTagsRequest = S.suspend(() =>
  S.Struct({
    InstanceProfileName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListInstanceProfileTagsRequest",
}) as any as S.Schema<ListInstanceProfileTagsRequest>;
export interface ListMFADevicesRequest {
  UserName?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListMFADevicesRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListMFADevicesRequest",
}) as any as S.Schema<ListMFADevicesRequest>;
export interface ListMFADeviceTagsRequest {
  SerialNumber: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListMFADeviceTagsRequest = S.suspend(() =>
  S.Struct({
    SerialNumber: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListMFADeviceTagsRequest",
}) as any as S.Schema<ListMFADeviceTagsRequest>;
export interface ListOpenIDConnectProviderTagsRequest {
  OpenIDConnectProviderArn: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListOpenIDConnectProviderTagsRequest = S.suspend(() =>
  S.Struct({
    OpenIDConnectProviderArn: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListOpenIDConnectProviderTagsRequest",
}) as any as S.Schema<ListOpenIDConnectProviderTagsRequest>;
export interface ListOrganizationsFeaturesResponse {
  OrganizationId?: string;
  EnabledFeatures?: FeatureType[];
}
export const ListOrganizationsFeaturesResponse = S.suspend(() =>
  S.Struct({
    OrganizationId: S.optional(S.String),
    EnabledFeatures: S.optional(FeaturesListType),
  }).pipe(ns),
).annotations({
  identifier: "ListOrganizationsFeaturesResponse",
}) as any as S.Schema<ListOrganizationsFeaturesResponse>;
export interface ListPoliciesRequest {
  Scope?: PolicyScopeType;
  OnlyAttached?: boolean;
  PathPrefix?: string;
  PolicyUsageFilter?: PolicyUsageType;
  Marker?: string;
  MaxItems?: number;
}
export const ListPoliciesRequest = S.suspend(() =>
  S.Struct({
    Scope: S.optional(PolicyScopeType),
    OnlyAttached: S.optional(S.Boolean),
    PathPrefix: S.optional(S.String),
    PolicyUsageFilter: S.optional(PolicyUsageType),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListPoliciesRequest",
}) as any as S.Schema<ListPoliciesRequest>;
export interface ListPoliciesGrantingServiceAccessRequest {
  Marker?: string;
  Arn: string;
  ServiceNamespaces: string[];
}
export const ListPoliciesGrantingServiceAccessRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Arn: S.String,
    ServiceNamespaces: ServiceNamespaceListType,
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
  identifier: "ListPoliciesGrantingServiceAccessRequest",
}) as any as S.Schema<ListPoliciesGrantingServiceAccessRequest>;
export interface ListPolicyTagsRequest {
  PolicyArn: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListPolicyTagsRequest = S.suspend(() =>
  S.Struct({
    PolicyArn: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListPolicyTagsRequest",
}) as any as S.Schema<ListPolicyTagsRequest>;
export interface ListPolicyVersionsRequest {
  PolicyArn: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListPolicyVersionsRequest = S.suspend(() =>
  S.Struct({
    PolicyArn: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListPolicyVersionsRequest",
}) as any as S.Schema<ListPolicyVersionsRequest>;
export interface ListRolePoliciesRequest {
  RoleName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListRolePoliciesRequest = S.suspend(() =>
  S.Struct({
    RoleName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListRolePoliciesRequest",
}) as any as S.Schema<ListRolePoliciesRequest>;
export interface ListRolesRequest {
  PathPrefix?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListRolesRequest = S.suspend(() =>
  S.Struct({
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListRolesRequest",
}) as any as S.Schema<ListRolesRequest>;
export interface ListRoleTagsRequest {
  RoleName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListRoleTagsRequest = S.suspend(() =>
  S.Struct({
    RoleName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListRoleTagsRequest",
}) as any as S.Schema<ListRoleTagsRequest>;
export interface ListSAMLProviderTagsRequest {
  SAMLProviderArn: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListSAMLProviderTagsRequest = S.suspend(() =>
  S.Struct({
    SAMLProviderArn: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListSAMLProviderTagsRequest",
}) as any as S.Schema<ListSAMLProviderTagsRequest>;
export interface ListServerCertificatesRequest {
  PathPrefix?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListServerCertificatesRequest = S.suspend(() =>
  S.Struct({
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListServerCertificatesRequest",
}) as any as S.Schema<ListServerCertificatesRequest>;
export interface ListServerCertificateTagsRequest {
  ServerCertificateName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListServerCertificateTagsRequest = S.suspend(() =>
  S.Struct({
    ServerCertificateName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListServerCertificateTagsRequest",
}) as any as S.Schema<ListServerCertificateTagsRequest>;
export interface ListServiceSpecificCredentialsRequest {
  UserName?: string;
  ServiceName?: string;
  AllUsers?: boolean;
  Marker?: string;
  MaxItems?: number;
}
export const ListServiceSpecificCredentialsRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    ServiceName: S.optional(S.String),
    AllUsers: S.optional(S.Boolean),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListServiceSpecificCredentialsRequest",
}) as any as S.Schema<ListServiceSpecificCredentialsRequest>;
export interface ListSigningCertificatesRequest {
  UserName?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListSigningCertificatesRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListSigningCertificatesRequest",
}) as any as S.Schema<ListSigningCertificatesRequest>;
export interface ListSSHPublicKeysRequest {
  UserName?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListSSHPublicKeysRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListSSHPublicKeysRequest",
}) as any as S.Schema<ListSSHPublicKeysRequest>;
export interface ListUserPoliciesRequest {
  UserName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListUserPoliciesRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListUserPoliciesRequest",
}) as any as S.Schema<ListUserPoliciesRequest>;
export interface ListUsersRequest {
  PathPrefix?: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListUsersRequest = S.suspend(() =>
  S.Struct({
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListUsersRequest",
}) as any as S.Schema<ListUsersRequest>;
export interface ListUserTagsRequest {
  UserName: string;
  Marker?: string;
  MaxItems?: number;
}
export const ListUserTagsRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListUserTagsRequest",
}) as any as S.Schema<ListUserTagsRequest>;
export interface ListVirtualMFADevicesRequest {
  AssignmentStatus?: AssignmentStatusType;
  Marker?: string;
  MaxItems?: number;
}
export const ListVirtualMFADevicesRequest = S.suspend(() =>
  S.Struct({
    AssignmentStatus: S.optional(AssignmentStatusType),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
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
  identifier: "ListVirtualMFADevicesRequest",
}) as any as S.Schema<ListVirtualMFADevicesRequest>;
export interface PutGroupPolicyRequest {
  GroupName: string;
  PolicyName: string;
  PolicyDocument: string;
}
export const PutGroupPolicyRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    PolicyName: S.String,
    PolicyDocument: S.String,
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
  identifier: "PutGroupPolicyRequest",
}) as any as S.Schema<PutGroupPolicyRequest>;
export interface PutGroupPolicyResponse {}
export const PutGroupPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutGroupPolicyResponse",
}) as any as S.Schema<PutGroupPolicyResponse>;
export interface PutRolePermissionsBoundaryRequest {
  RoleName: string;
  PermissionsBoundary: string;
}
export const PutRolePermissionsBoundaryRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String, PermissionsBoundary: S.String }).pipe(
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
  identifier: "PutRolePermissionsBoundaryRequest",
}) as any as S.Schema<PutRolePermissionsBoundaryRequest>;
export interface PutRolePermissionsBoundaryResponse {}
export const PutRolePermissionsBoundaryResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutRolePermissionsBoundaryResponse",
}) as any as S.Schema<PutRolePermissionsBoundaryResponse>;
export interface PutRolePolicyRequest {
  RoleName: string;
  PolicyName: string;
  PolicyDocument: string;
}
export const PutRolePolicyRequest = S.suspend(() =>
  S.Struct({
    RoleName: S.String,
    PolicyName: S.String,
    PolicyDocument: S.String,
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
  identifier: "PutRolePolicyRequest",
}) as any as S.Schema<PutRolePolicyRequest>;
export interface PutRolePolicyResponse {}
export const PutRolePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutRolePolicyResponse",
}) as any as S.Schema<PutRolePolicyResponse>;
export interface PutUserPermissionsBoundaryRequest {
  UserName: string;
  PermissionsBoundary: string;
}
export const PutUserPermissionsBoundaryRequest = S.suspend(() =>
  S.Struct({ UserName: S.String, PermissionsBoundary: S.String }).pipe(
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
  identifier: "PutUserPermissionsBoundaryRequest",
}) as any as S.Schema<PutUserPermissionsBoundaryRequest>;
export interface PutUserPermissionsBoundaryResponse {}
export const PutUserPermissionsBoundaryResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutUserPermissionsBoundaryResponse",
}) as any as S.Schema<PutUserPermissionsBoundaryResponse>;
export interface PutUserPolicyRequest {
  UserName: string;
  PolicyName: string;
  PolicyDocument: string;
}
export const PutUserPolicyRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    PolicyName: S.String,
    PolicyDocument: S.String,
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
  identifier: "PutUserPolicyRequest",
}) as any as S.Schema<PutUserPolicyRequest>;
export interface PutUserPolicyResponse {}
export const PutUserPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutUserPolicyResponse",
}) as any as S.Schema<PutUserPolicyResponse>;
export interface RejectDelegationRequestRequest {
  DelegationRequestId: string;
  Notes?: string;
}
export const RejectDelegationRequestRequest = S.suspend(() =>
  S.Struct({ DelegationRequestId: S.String, Notes: S.optional(S.String) }).pipe(
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
  identifier: "RejectDelegationRequestRequest",
}) as any as S.Schema<RejectDelegationRequestRequest>;
export interface RejectDelegationRequestResponse {}
export const RejectDelegationRequestResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RejectDelegationRequestResponse",
}) as any as S.Schema<RejectDelegationRequestResponse>;
export interface RemoveClientIDFromOpenIDConnectProviderRequest {
  OpenIDConnectProviderArn: string;
  ClientID: string;
}
export const RemoveClientIDFromOpenIDConnectProviderRequest = S.suspend(() =>
  S.Struct({ OpenIDConnectProviderArn: S.String, ClientID: S.String }).pipe(
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
  identifier: "RemoveClientIDFromOpenIDConnectProviderRequest",
}) as any as S.Schema<RemoveClientIDFromOpenIDConnectProviderRequest>;
export interface RemoveClientIDFromOpenIDConnectProviderResponse {}
export const RemoveClientIDFromOpenIDConnectProviderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveClientIDFromOpenIDConnectProviderResponse",
}) as any as S.Schema<RemoveClientIDFromOpenIDConnectProviderResponse>;
export interface RemoveRoleFromInstanceProfileRequest {
  InstanceProfileName: string;
  RoleName: string;
}
export const RemoveRoleFromInstanceProfileRequest = S.suspend(() =>
  S.Struct({ InstanceProfileName: S.String, RoleName: S.String }).pipe(
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
  identifier: "RemoveRoleFromInstanceProfileRequest",
}) as any as S.Schema<RemoveRoleFromInstanceProfileRequest>;
export interface RemoveRoleFromInstanceProfileResponse {}
export const RemoveRoleFromInstanceProfileResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveRoleFromInstanceProfileResponse",
}) as any as S.Schema<RemoveRoleFromInstanceProfileResponse>;
export interface RemoveUserFromGroupRequest {
  GroupName: string;
  UserName: string;
}
export const RemoveUserFromGroupRequest = S.suspend(() =>
  S.Struct({ GroupName: S.String, UserName: S.String }).pipe(
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
  identifier: "RemoveUserFromGroupRequest",
}) as any as S.Schema<RemoveUserFromGroupRequest>;
export interface RemoveUserFromGroupResponse {}
export const RemoveUserFromGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveUserFromGroupResponse",
}) as any as S.Schema<RemoveUserFromGroupResponse>;
export interface ResetServiceSpecificCredentialRequest {
  UserName?: string;
  ServiceSpecificCredentialId: string;
}
export const ResetServiceSpecificCredentialRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    ServiceSpecificCredentialId: S.String,
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
  identifier: "ResetServiceSpecificCredentialRequest",
}) as any as S.Schema<ResetServiceSpecificCredentialRequest>;
export interface ResyncMFADeviceRequest {
  UserName: string;
  SerialNumber: string;
  AuthenticationCode1: string;
  AuthenticationCode2: string;
}
export const ResyncMFADeviceRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    SerialNumber: S.String,
    AuthenticationCode1: S.String,
    AuthenticationCode2: S.String,
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
  identifier: "ResyncMFADeviceRequest",
}) as any as S.Schema<ResyncMFADeviceRequest>;
export interface ResyncMFADeviceResponse {}
export const ResyncMFADeviceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ResyncMFADeviceResponse",
}) as any as S.Schema<ResyncMFADeviceResponse>;
export interface SendDelegationTokenRequest {
  DelegationRequestId: string;
}
export const SendDelegationTokenRequest = S.suspend(() =>
  S.Struct({ DelegationRequestId: S.String }).pipe(
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
  identifier: "SendDelegationTokenRequest",
}) as any as S.Schema<SendDelegationTokenRequest>;
export interface SendDelegationTokenResponse {}
export const SendDelegationTokenResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SendDelegationTokenResponse",
}) as any as S.Schema<SendDelegationTokenResponse>;
export interface SetDefaultPolicyVersionRequest {
  PolicyArn: string;
  VersionId: string;
}
export const SetDefaultPolicyVersionRequest = S.suspend(() =>
  S.Struct({ PolicyArn: S.String, VersionId: S.String }).pipe(
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
  identifier: "SetDefaultPolicyVersionRequest",
}) as any as S.Schema<SetDefaultPolicyVersionRequest>;
export interface SetDefaultPolicyVersionResponse {}
export const SetDefaultPolicyVersionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetDefaultPolicyVersionResponse",
}) as any as S.Schema<SetDefaultPolicyVersionResponse>;
export interface SetSecurityTokenServicePreferencesRequest {
  GlobalEndpointTokenVersion: GlobalEndpointTokenVersion;
}
export const SetSecurityTokenServicePreferencesRequest = S.suspend(() =>
  S.Struct({ GlobalEndpointTokenVersion: GlobalEndpointTokenVersion }).pipe(
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
  identifier: "SetSecurityTokenServicePreferencesRequest",
}) as any as S.Schema<SetSecurityTokenServicePreferencesRequest>;
export interface SetSecurityTokenServicePreferencesResponse {}
export const SetSecurityTokenServicePreferencesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetSecurityTokenServicePreferencesResponse",
}) as any as S.Schema<SetSecurityTokenServicePreferencesResponse>;
export type ContextKeyValueListType = string[];
export const ContextKeyValueListType = S.Array(S.String);
export type ContextKeyTypeEnum =
  | "string"
  | "stringList"
  | "numeric"
  | "numericList"
  | "boolean"
  | "booleanList"
  | "ip"
  | "ipList"
  | "binary"
  | "binaryList"
  | "date"
  | "dateList"
  | (string & {});
export const ContextKeyTypeEnum = S.String;
export interface ContextEntry {
  ContextKeyName?: string;
  ContextKeyValues?: string[];
  ContextKeyType?: ContextKeyTypeEnum;
}
export const ContextEntry = S.suspend(() =>
  S.Struct({
    ContextKeyName: S.optional(S.String),
    ContextKeyValues: S.optional(ContextKeyValueListType),
    ContextKeyType: S.optional(ContextKeyTypeEnum),
  }),
).annotations({ identifier: "ContextEntry" }) as any as S.Schema<ContextEntry>;
export type ContextEntryListType = ContextEntry[];
export const ContextEntryListType = S.Array(ContextEntry);
export interface SimulatePrincipalPolicyRequest {
  PolicySourceArn: string;
  PolicyInputList?: string[];
  PermissionsBoundaryPolicyInputList?: string[];
  ActionNames: string[];
  ResourceArns?: string[];
  ResourcePolicy?: string;
  ResourceOwner?: string;
  CallerArn?: string;
  ContextEntries?: ContextEntry[];
  ResourceHandlingOption?: string;
  MaxItems?: number;
  Marker?: string;
}
export const SimulatePrincipalPolicyRequest = S.suspend(() =>
  S.Struct({
    PolicySourceArn: S.String,
    PolicyInputList: S.optional(SimulationPolicyListType),
    PermissionsBoundaryPolicyInputList: S.optional(SimulationPolicyListType),
    ActionNames: ActionNameListType,
    ResourceArns: S.optional(ResourceNameListType),
    ResourcePolicy: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    CallerArn: S.optional(S.String),
    ContextEntries: S.optional(ContextEntryListType),
    ResourceHandlingOption: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "SimulatePrincipalPolicyRequest",
}) as any as S.Schema<SimulatePrincipalPolicyRequest>;
export interface TagInstanceProfileRequest {
  InstanceProfileName: string;
  Tags: Tag[];
}
export const TagInstanceProfileRequest = S.suspend(() =>
  S.Struct({ InstanceProfileName: S.String, Tags: TagListType }).pipe(
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
  identifier: "TagInstanceProfileRequest",
}) as any as S.Schema<TagInstanceProfileRequest>;
export interface TagInstanceProfileResponse {}
export const TagInstanceProfileResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagInstanceProfileResponse",
}) as any as S.Schema<TagInstanceProfileResponse>;
export interface TagMFADeviceRequest {
  SerialNumber: string;
  Tags: Tag[];
}
export const TagMFADeviceRequest = S.suspend(() =>
  S.Struct({ SerialNumber: S.String, Tags: TagListType }).pipe(
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
  identifier: "TagMFADeviceRequest",
}) as any as S.Schema<TagMFADeviceRequest>;
export interface TagMFADeviceResponse {}
export const TagMFADeviceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagMFADeviceResponse",
}) as any as S.Schema<TagMFADeviceResponse>;
export interface TagOpenIDConnectProviderRequest {
  OpenIDConnectProviderArn: string;
  Tags: Tag[];
}
export const TagOpenIDConnectProviderRequest = S.suspend(() =>
  S.Struct({ OpenIDConnectProviderArn: S.String, Tags: TagListType }).pipe(
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
  identifier: "TagOpenIDConnectProviderRequest",
}) as any as S.Schema<TagOpenIDConnectProviderRequest>;
export interface TagOpenIDConnectProviderResponse {}
export const TagOpenIDConnectProviderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagOpenIDConnectProviderResponse",
}) as any as S.Schema<TagOpenIDConnectProviderResponse>;
export interface TagPolicyRequest {
  PolicyArn: string;
  Tags: Tag[];
}
export const TagPolicyRequest = S.suspend(() =>
  S.Struct({ PolicyArn: S.String, Tags: TagListType }).pipe(
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
  identifier: "TagPolicyRequest",
}) as any as S.Schema<TagPolicyRequest>;
export interface TagPolicyResponse {}
export const TagPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagPolicyResponse",
}) as any as S.Schema<TagPolicyResponse>;
export interface TagRoleRequest {
  RoleName: string;
  Tags: Tag[];
}
export const TagRoleRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String, Tags: TagListType }).pipe(
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
  identifier: "TagRoleRequest",
}) as any as S.Schema<TagRoleRequest>;
export interface TagRoleResponse {}
export const TagRoleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagRoleResponse",
}) as any as S.Schema<TagRoleResponse>;
export interface TagSAMLProviderRequest {
  SAMLProviderArn: string;
  Tags: Tag[];
}
export const TagSAMLProviderRequest = S.suspend(() =>
  S.Struct({ SAMLProviderArn: S.String, Tags: TagListType }).pipe(
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
  identifier: "TagSAMLProviderRequest",
}) as any as S.Schema<TagSAMLProviderRequest>;
export interface TagSAMLProviderResponse {}
export const TagSAMLProviderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagSAMLProviderResponse",
}) as any as S.Schema<TagSAMLProviderResponse>;
export interface TagServerCertificateRequest {
  ServerCertificateName: string;
  Tags: Tag[];
}
export const TagServerCertificateRequest = S.suspend(() =>
  S.Struct({ ServerCertificateName: S.String, Tags: TagListType }).pipe(
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
  identifier: "TagServerCertificateRequest",
}) as any as S.Schema<TagServerCertificateRequest>;
export interface TagServerCertificateResponse {}
export const TagServerCertificateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagServerCertificateResponse",
}) as any as S.Schema<TagServerCertificateResponse>;
export interface TagUserRequest {
  UserName: string;
  Tags: Tag[];
}
export const TagUserRequest = S.suspend(() =>
  S.Struct({ UserName: S.String, Tags: TagListType }).pipe(
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
  identifier: "TagUserRequest",
}) as any as S.Schema<TagUserRequest>;
export interface TagUserResponse {}
export const TagUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagUserResponse",
}) as any as S.Schema<TagUserResponse>;
export interface UntagInstanceProfileRequest {
  InstanceProfileName: string;
  TagKeys: string[];
}
export const UntagInstanceProfileRequest = S.suspend(() =>
  S.Struct({ InstanceProfileName: S.String, TagKeys: TagKeyListType }).pipe(
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
  identifier: "UntagInstanceProfileRequest",
}) as any as S.Schema<UntagInstanceProfileRequest>;
export interface UntagInstanceProfileResponse {}
export const UntagInstanceProfileResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagInstanceProfileResponse",
}) as any as S.Schema<UntagInstanceProfileResponse>;
export interface UntagMFADeviceRequest {
  SerialNumber: string;
  TagKeys: string[];
}
export const UntagMFADeviceRequest = S.suspend(() =>
  S.Struct({ SerialNumber: S.String, TagKeys: TagKeyListType }).pipe(
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
  identifier: "UntagMFADeviceRequest",
}) as any as S.Schema<UntagMFADeviceRequest>;
export interface UntagMFADeviceResponse {}
export const UntagMFADeviceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagMFADeviceResponse",
}) as any as S.Schema<UntagMFADeviceResponse>;
export interface UntagOpenIDConnectProviderRequest {
  OpenIDConnectProviderArn: string;
  TagKeys: string[];
}
export const UntagOpenIDConnectProviderRequest = S.suspend(() =>
  S.Struct({
    OpenIDConnectProviderArn: S.String,
    TagKeys: TagKeyListType,
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
  identifier: "UntagOpenIDConnectProviderRequest",
}) as any as S.Schema<UntagOpenIDConnectProviderRequest>;
export interface UntagOpenIDConnectProviderResponse {}
export const UntagOpenIDConnectProviderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagOpenIDConnectProviderResponse",
}) as any as S.Schema<UntagOpenIDConnectProviderResponse>;
export interface UntagPolicyRequest {
  PolicyArn: string;
  TagKeys: string[];
}
export const UntagPolicyRequest = S.suspend(() =>
  S.Struct({ PolicyArn: S.String, TagKeys: TagKeyListType }).pipe(
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
  identifier: "UntagPolicyRequest",
}) as any as S.Schema<UntagPolicyRequest>;
export interface UntagPolicyResponse {}
export const UntagPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagPolicyResponse",
}) as any as S.Schema<UntagPolicyResponse>;
export interface UntagRoleRequest {
  RoleName: string;
  TagKeys: string[];
}
export const UntagRoleRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String, TagKeys: TagKeyListType }).pipe(
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
  identifier: "UntagRoleRequest",
}) as any as S.Schema<UntagRoleRequest>;
export interface UntagRoleResponse {}
export const UntagRoleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagRoleResponse",
}) as any as S.Schema<UntagRoleResponse>;
export interface UntagSAMLProviderRequest {
  SAMLProviderArn: string;
  TagKeys: string[];
}
export const UntagSAMLProviderRequest = S.suspend(() =>
  S.Struct({ SAMLProviderArn: S.String, TagKeys: TagKeyListType }).pipe(
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
  identifier: "UntagSAMLProviderRequest",
}) as any as S.Schema<UntagSAMLProviderRequest>;
export interface UntagSAMLProviderResponse {}
export const UntagSAMLProviderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagSAMLProviderResponse",
}) as any as S.Schema<UntagSAMLProviderResponse>;
export interface UntagServerCertificateRequest {
  ServerCertificateName: string;
  TagKeys: string[];
}
export const UntagServerCertificateRequest = S.suspend(() =>
  S.Struct({ ServerCertificateName: S.String, TagKeys: TagKeyListType }).pipe(
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
  identifier: "UntagServerCertificateRequest",
}) as any as S.Schema<UntagServerCertificateRequest>;
export interface UntagServerCertificateResponse {}
export const UntagServerCertificateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagServerCertificateResponse",
}) as any as S.Schema<UntagServerCertificateResponse>;
export interface UntagUserRequest {
  UserName: string;
  TagKeys: string[];
}
export const UntagUserRequest = S.suspend(() =>
  S.Struct({ UserName: S.String, TagKeys: TagKeyListType }).pipe(
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
  identifier: "UntagUserRequest",
}) as any as S.Schema<UntagUserRequest>;
export interface UntagUserResponse {}
export const UntagUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagUserResponse",
}) as any as S.Schema<UntagUserResponse>;
export interface UpdateAccessKeyRequest {
  UserName?: string;
  AccessKeyId: string;
  Status: StatusType;
}
export const UpdateAccessKeyRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    AccessKeyId: S.String,
    Status: StatusType,
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
  identifier: "UpdateAccessKeyRequest",
}) as any as S.Schema<UpdateAccessKeyRequest>;
export interface UpdateAccessKeyResponse {}
export const UpdateAccessKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateAccessKeyResponse",
}) as any as S.Schema<UpdateAccessKeyResponse>;
export interface UpdateAccountPasswordPolicyRequest {
  MinimumPasswordLength?: number;
  RequireSymbols?: boolean;
  RequireNumbers?: boolean;
  RequireUppercaseCharacters?: boolean;
  RequireLowercaseCharacters?: boolean;
  AllowUsersToChangePassword?: boolean;
  MaxPasswordAge?: number;
  PasswordReusePrevention?: number;
  HardExpiry?: boolean;
}
export const UpdateAccountPasswordPolicyRequest = S.suspend(() =>
  S.Struct({
    MinimumPasswordLength: S.optional(S.Number),
    RequireSymbols: S.optional(S.Boolean),
    RequireNumbers: S.optional(S.Boolean),
    RequireUppercaseCharacters: S.optional(S.Boolean),
    RequireLowercaseCharacters: S.optional(S.Boolean),
    AllowUsersToChangePassword: S.optional(S.Boolean),
    MaxPasswordAge: S.optional(S.Number),
    PasswordReusePrevention: S.optional(S.Number),
    HardExpiry: S.optional(S.Boolean),
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
  identifier: "UpdateAccountPasswordPolicyRequest",
}) as any as S.Schema<UpdateAccountPasswordPolicyRequest>;
export interface UpdateAccountPasswordPolicyResponse {}
export const UpdateAccountPasswordPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateAccountPasswordPolicyResponse",
}) as any as S.Schema<UpdateAccountPasswordPolicyResponse>;
export interface UpdateAssumeRolePolicyRequest {
  RoleName: string;
  PolicyDocument: string;
}
export const UpdateAssumeRolePolicyRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String, PolicyDocument: S.String }).pipe(
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
  identifier: "UpdateAssumeRolePolicyRequest",
}) as any as S.Schema<UpdateAssumeRolePolicyRequest>;
export interface UpdateAssumeRolePolicyResponse {}
export const UpdateAssumeRolePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateAssumeRolePolicyResponse",
}) as any as S.Schema<UpdateAssumeRolePolicyResponse>;
export interface UpdateDelegationRequestRequest {
  DelegationRequestId: string;
  Notes?: string;
}
export const UpdateDelegationRequestRequest = S.suspend(() =>
  S.Struct({ DelegationRequestId: S.String, Notes: S.optional(S.String) }).pipe(
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
  identifier: "UpdateDelegationRequestRequest",
}) as any as S.Schema<UpdateDelegationRequestRequest>;
export interface UpdateDelegationRequestResponse {}
export const UpdateDelegationRequestResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDelegationRequestResponse",
}) as any as S.Schema<UpdateDelegationRequestResponse>;
export interface UpdateGroupRequest {
  GroupName: string;
  NewPath?: string;
  NewGroupName?: string;
}
export const UpdateGroupRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    NewPath: S.optional(S.String),
    NewGroupName: S.optional(S.String),
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
  identifier: "UpdateGroupRequest",
}) as any as S.Schema<UpdateGroupRequest>;
export interface UpdateGroupResponse {}
export const UpdateGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateGroupResponse",
}) as any as S.Schema<UpdateGroupResponse>;
export interface UpdateLoginProfileRequest {
  UserName: string;
  Password?: string | redacted.Redacted<string>;
  PasswordResetRequired?: boolean;
}
export const UpdateLoginProfileRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    Password: S.optional(SensitiveString),
    PasswordResetRequired: S.optional(S.Boolean),
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
  identifier: "UpdateLoginProfileRequest",
}) as any as S.Schema<UpdateLoginProfileRequest>;
export interface UpdateLoginProfileResponse {}
export const UpdateLoginProfileResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateLoginProfileResponse",
}) as any as S.Schema<UpdateLoginProfileResponse>;
export interface UpdateOpenIDConnectProviderThumbprintRequest {
  OpenIDConnectProviderArn: string;
  ThumbprintList: string[];
}
export const UpdateOpenIDConnectProviderThumbprintRequest = S.suspend(() =>
  S.Struct({
    OpenIDConnectProviderArn: S.String,
    ThumbprintList: ThumbprintListType,
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
  identifier: "UpdateOpenIDConnectProviderThumbprintRequest",
}) as any as S.Schema<UpdateOpenIDConnectProviderThumbprintRequest>;
export interface UpdateOpenIDConnectProviderThumbprintResponse {}
export const UpdateOpenIDConnectProviderThumbprintResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateOpenIDConnectProviderThumbprintResponse",
}) as any as S.Schema<UpdateOpenIDConnectProviderThumbprintResponse>;
export interface UpdateRoleRequest {
  RoleName: string;
  Description?: string;
  MaxSessionDuration?: number;
}
export const UpdateRoleRequest = S.suspend(() =>
  S.Struct({
    RoleName: S.String,
    Description: S.optional(S.String),
    MaxSessionDuration: S.optional(S.Number),
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
  identifier: "UpdateRoleRequest",
}) as any as S.Schema<UpdateRoleRequest>;
export interface UpdateRoleResponse {}
export const UpdateRoleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateRoleResponse",
}) as any as S.Schema<UpdateRoleResponse>;
export interface UpdateRoleDescriptionRequest {
  RoleName: string;
  Description: string;
}
export const UpdateRoleDescriptionRequest = S.suspend(() =>
  S.Struct({ RoleName: S.String, Description: S.String }).pipe(
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
  identifier: "UpdateRoleDescriptionRequest",
}) as any as S.Schema<UpdateRoleDescriptionRequest>;
export interface UpdateSAMLProviderRequest {
  SAMLMetadataDocument?: string;
  SAMLProviderArn: string;
  AssertionEncryptionMode?: AssertionEncryptionModeType;
  AddPrivateKey?: string | redacted.Redacted<string>;
  RemovePrivateKey?: string;
}
export const UpdateSAMLProviderRequest = S.suspend(() =>
  S.Struct({
    SAMLMetadataDocument: S.optional(S.String),
    SAMLProviderArn: S.String,
    AssertionEncryptionMode: S.optional(AssertionEncryptionModeType),
    AddPrivateKey: S.optional(SensitiveString),
    RemovePrivateKey: S.optional(S.String),
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
  identifier: "UpdateSAMLProviderRequest",
}) as any as S.Schema<UpdateSAMLProviderRequest>;
export interface UpdateServerCertificateRequest {
  ServerCertificateName: string;
  NewPath?: string;
  NewServerCertificateName?: string;
}
export const UpdateServerCertificateRequest = S.suspend(() =>
  S.Struct({
    ServerCertificateName: S.String,
    NewPath: S.optional(S.String),
    NewServerCertificateName: S.optional(S.String),
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
  identifier: "UpdateServerCertificateRequest",
}) as any as S.Schema<UpdateServerCertificateRequest>;
export interface UpdateServerCertificateResponse {}
export const UpdateServerCertificateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateServerCertificateResponse",
}) as any as S.Schema<UpdateServerCertificateResponse>;
export interface UpdateServiceSpecificCredentialRequest {
  UserName?: string;
  ServiceSpecificCredentialId: string;
  Status: StatusType;
}
export const UpdateServiceSpecificCredentialRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    ServiceSpecificCredentialId: S.String,
    Status: StatusType,
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
  identifier: "UpdateServiceSpecificCredentialRequest",
}) as any as S.Schema<UpdateServiceSpecificCredentialRequest>;
export interface UpdateServiceSpecificCredentialResponse {}
export const UpdateServiceSpecificCredentialResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateServiceSpecificCredentialResponse",
}) as any as S.Schema<UpdateServiceSpecificCredentialResponse>;
export interface UpdateSigningCertificateRequest {
  UserName?: string;
  CertificateId: string;
  Status: StatusType;
}
export const UpdateSigningCertificateRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    CertificateId: S.String,
    Status: StatusType,
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
  identifier: "UpdateSigningCertificateRequest",
}) as any as S.Schema<UpdateSigningCertificateRequest>;
export interface UpdateSigningCertificateResponse {}
export const UpdateSigningCertificateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateSigningCertificateResponse",
}) as any as S.Schema<UpdateSigningCertificateResponse>;
export interface UpdateSSHPublicKeyRequest {
  UserName: string;
  SSHPublicKeyId: string;
  Status: StatusType;
}
export const UpdateSSHPublicKeyRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    SSHPublicKeyId: S.String,
    Status: StatusType,
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
  identifier: "UpdateSSHPublicKeyRequest",
}) as any as S.Schema<UpdateSSHPublicKeyRequest>;
export interface UpdateSSHPublicKeyResponse {}
export const UpdateSSHPublicKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateSSHPublicKeyResponse",
}) as any as S.Schema<UpdateSSHPublicKeyResponse>;
export interface UpdateUserRequest {
  UserName: string;
  NewPath?: string;
  NewUserName?: string;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    NewPath: S.optional(S.String),
    NewUserName: S.optional(S.String),
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
  identifier: "UpdateUserRequest",
}) as any as S.Schema<UpdateUserRequest>;
export interface UpdateUserResponse {}
export const UpdateUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export interface UploadServerCertificateRequest {
  Path?: string;
  ServerCertificateName: string;
  CertificateBody: string;
  PrivateKey: string | redacted.Redacted<string>;
  CertificateChain?: string;
  Tags?: Tag[];
}
export const UploadServerCertificateRequest = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    ServerCertificateName: S.String,
    CertificateBody: S.String,
    PrivateKey: SensitiveString,
    CertificateChain: S.optional(S.String),
    Tags: S.optional(TagListType),
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
  identifier: "UploadServerCertificateRequest",
}) as any as S.Schema<UploadServerCertificateRequest>;
export interface UploadSigningCertificateRequest {
  UserName?: string;
  CertificateBody: string;
}
export const UploadSigningCertificateRequest = S.suspend(() =>
  S.Struct({ UserName: S.optional(S.String), CertificateBody: S.String }).pipe(
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
  identifier: "UploadSigningCertificateRequest",
}) as any as S.Schema<UploadSigningCertificateRequest>;
export interface UploadSSHPublicKeyRequest {
  UserName: string;
  SSHPublicKeyBody: string;
}
export const UploadSSHPublicKeyRequest = S.suspend(() =>
  S.Struct({ UserName: S.String, SSHPublicKeyBody: S.String }).pipe(
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
  identifier: "UploadSSHPublicKeyRequest",
}) as any as S.Schema<UploadSSHPublicKeyRequest>;
export type SummaryKeyType =
  | "Users"
  | "UsersQuota"
  | "Groups"
  | "GroupsQuota"
  | "ServerCertificates"
  | "ServerCertificatesQuota"
  | "UserPolicySizeQuota"
  | "GroupPolicySizeQuota"
  | "GroupsPerUserQuota"
  | "SigningCertificatesPerUserQuota"
  | "AccessKeysPerUserQuota"
  | "MFADevices"
  | "MFADevicesInUse"
  | "AccountMFAEnabled"
  | "AccountAccessKeysPresent"
  | "AccountPasswordPresent"
  | "AccountSigningCertificatesPresent"
  | "AttachedPoliciesPerGroupQuota"
  | "AttachedPoliciesPerRoleQuota"
  | "AttachedPoliciesPerUserQuota"
  | "Policies"
  | "PoliciesQuota"
  | "PolicySizeQuota"
  | "PolicyVersionsInUse"
  | "PolicyVersionsInUseQuota"
  | "VersionsPerPolicyQuota"
  | "GlobalEndpointTokenVersion"
  | "AssumeRolePolicySizeQuota"
  | "InstanceProfiles"
  | "InstanceProfilesQuota"
  | "Providers"
  | "RolePolicySizeQuota"
  | "Roles"
  | "RolesQuota"
  | (string & {});
export const SummaryKeyType = S.String;
export interface PasswordPolicy {
  MinimumPasswordLength?: number;
  RequireSymbols?: boolean;
  RequireNumbers?: boolean;
  RequireUppercaseCharacters?: boolean;
  RequireLowercaseCharacters?: boolean;
  AllowUsersToChangePassword?: boolean;
  ExpirePasswords?: boolean;
  MaxPasswordAge?: number;
  PasswordReusePrevention?: number;
  HardExpiry?: boolean;
}
export const PasswordPolicy = S.suspend(() =>
  S.Struct({
    MinimumPasswordLength: S.optional(S.Number),
    RequireSymbols: S.optional(S.Boolean),
    RequireNumbers: S.optional(S.Boolean),
    RequireUppercaseCharacters: S.optional(S.Boolean),
    RequireLowercaseCharacters: S.optional(S.Boolean),
    AllowUsersToChangePassword: S.optional(S.Boolean),
    ExpirePasswords: S.optional(S.Boolean),
    MaxPasswordAge: S.optional(S.Number),
    PasswordReusePrevention: S.optional(S.Number),
    HardExpiry: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PasswordPolicy",
}) as any as S.Schema<PasswordPolicy>;
export type SummaryMapType = { [key in SummaryKeyType]?: number };
export const SummaryMapType = S.partial(
  S.Record({ key: SummaryKeyType, value: S.UndefinedOr(S.Number) }),
);
export type ContextKeyNamesResultListType = string[];
export const ContextKeyNamesResultListType = S.Array(S.String);
export type PermissionCheckStatusType =
  | "COMPLETE"
  | "IN_PROGRESS"
  | "FAILED"
  | (string & {});
export const PermissionCheckStatusType = S.String;
export type PermissionCheckResultType =
  | "ALLOWED"
  | "DENIED"
  | "UNSURE"
  | (string & {});
export const PermissionCheckResultType = S.String;
export type PermissionsBoundaryAttachmentType =
  | "PermissionsBoundaryPolicy"
  | (string & {});
export const PermissionsBoundaryAttachmentType = S.String;
export interface AttachedPermissionsBoundary {
  PermissionsBoundaryType?: PermissionsBoundaryAttachmentType;
  PermissionsBoundaryArn?: string;
}
export const AttachedPermissionsBoundary = S.suspend(() =>
  S.Struct({
    PermissionsBoundaryType: S.optional(PermissionsBoundaryAttachmentType),
    PermissionsBoundaryArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AttachedPermissionsBoundary",
}) as any as S.Schema<AttachedPermissionsBoundary>;
export interface User {
  Path: string;
  UserName: string;
  UserId: string;
  Arn: string;
  CreateDate: Date;
  PasswordLastUsed?: Date;
  PermissionsBoundary?: AttachedPermissionsBoundary;
  Tags?: Tag[];
}
export const User = S.suspend(() =>
  S.Struct({
    Path: S.String,
    UserName: S.String,
    UserId: S.String,
    Arn: S.String,
    CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
    PasswordLastUsed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PermissionsBoundary: S.optional(AttachedPermissionsBoundary),
    Tags: S.optional(TagListType),
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type UserListType = User[];
export const UserListType = S.Array(User);
export type SummaryStateType =
  | "AVAILABLE"
  | "NOT_AVAILABLE"
  | "NOT_SUPPORTED"
  | "FAILED"
  | (string & {});
export const SummaryStateType = S.String;
export type JobStatusType =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | (string & {});
export const JobStatusType = S.String;
export type DeletionTaskStatusType =
  | "SUCCEEDED"
  | "IN_PROGRESS"
  | "FAILED"
  | "NOT_STARTED"
  | (string & {});
export const DeletionTaskStatusType = S.String;
export type AccountAliasListType = string[];
export const AccountAliasListType = S.Array(S.String);
export type PolicyParameterValuesListType = string[];
export const PolicyParameterValuesListType = S.Array(S.String);
export type PolicyParameterTypeEnum = "string" | "stringList" | (string & {});
export const PolicyParameterTypeEnum = S.String;
export interface PolicyParameter {
  Name?: string;
  Values?: string[];
  Type?: PolicyParameterTypeEnum;
}
export const PolicyParameter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(PolicyParameterValuesListType),
    Type: S.optional(PolicyParameterTypeEnum),
  }),
).annotations({
  identifier: "PolicyParameter",
}) as any as S.Schema<PolicyParameter>;
export type PolicyParameterListType = PolicyParameter[];
export const PolicyParameterListType = S.Array(PolicyParameter);
export interface DelegationPermission {
  PolicyTemplateArn?: string;
  Parameters?: PolicyParameter[];
}
export const DelegationPermission = S.suspend(() =>
  S.Struct({
    PolicyTemplateArn: S.optional(S.String),
    Parameters: S.optional(PolicyParameterListType),
  }),
).annotations({
  identifier: "DelegationPermission",
}) as any as S.Schema<DelegationPermission>;
export type RolePermissionRestrictionArnListType = string[];
export const RolePermissionRestrictionArnListType = S.Array(S.String);
export type StateType =
  | "UNASSIGNED"
  | "ASSIGNED"
  | "PENDING_APPROVAL"
  | "FINALIZED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | (string & {});
export const StateType = S.String;
export interface DelegationRequest {
  DelegationRequestId?: string;
  OwnerAccountId?: string;
  Description?: string;
  RequestMessage?: string;
  Permissions?: DelegationPermission;
  PermissionPolicy?: string;
  RolePermissionRestrictionArns?: string[];
  OwnerId?: string;
  ApproverId?: string;
  State?: StateType;
  ExpirationTime?: Date;
  RequestorId?: string;
  RequestorName?: string;
  CreateDate?: Date;
  SessionDuration?: number;
  RedirectUrl?: string;
  Notes?: string;
  RejectionReason?: string;
  OnlySendByOwner?: boolean;
  UpdatedTime?: Date;
}
export const DelegationRequest = S.suspend(() =>
  S.Struct({
    DelegationRequestId: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    Description: S.optional(S.String),
    RequestMessage: S.optional(S.String),
    Permissions: S.optional(DelegationPermission),
    PermissionPolicy: S.optional(S.String),
    RolePermissionRestrictionArns: S.optional(
      RolePermissionRestrictionArnListType,
    ),
    OwnerId: S.optional(S.String),
    ApproverId: S.optional(S.String),
    State: S.optional(StateType),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    RequestorId: S.optional(S.String),
    RequestorName: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SessionDuration: S.optional(S.Number),
    RedirectUrl: S.optional(S.String),
    Notes: S.optional(S.String),
    RejectionReason: S.optional(S.String),
    OnlySendByOwner: S.optional(S.Boolean),
    UpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "DelegationRequest",
}) as any as S.Schema<DelegationRequest>;
export type DelegationRequestsListType = DelegationRequest[];
export const DelegationRequestsListType = S.Array(DelegationRequest);
export type PolicyNameListType = string[];
export const PolicyNameListType = S.Array(S.String);
export interface Group {
  Path: string;
  GroupName: string;
  GroupId: string;
  Arn: string;
  CreateDate: Date;
}
export const Group = S.suspend(() =>
  S.Struct({
    Path: S.String,
    GroupName: S.String,
    GroupId: S.String,
    Arn: S.String,
    CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({ identifier: "Group" }) as any as S.Schema<Group>;
export type GroupListType = Group[];
export const GroupListType = S.Array(Group);
export interface RoleLastUsed {
  LastUsedDate?: Date;
  Region?: string;
}
export const RoleLastUsed = S.suspend(() =>
  S.Struct({
    LastUsedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Region: S.optional(S.String),
  }),
).annotations({ identifier: "RoleLastUsed" }) as any as S.Schema<RoleLastUsed>;
export interface Role {
  Path: string;
  RoleName: string;
  RoleId: string;
  Arn: string;
  CreateDate: Date;
  AssumeRolePolicyDocument?: string;
  Description?: string;
  MaxSessionDuration?: number;
  PermissionsBoundary?: AttachedPermissionsBoundary;
  Tags?: Tag[];
  RoleLastUsed?: RoleLastUsed;
}
export const Role = S.suspend(() =>
  S.Struct({
    Path: S.String,
    RoleName: S.String,
    RoleId: S.String,
    Arn: S.String,
    CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
    AssumeRolePolicyDocument: S.optional(S.String),
    Description: S.optional(S.String),
    MaxSessionDuration: S.optional(S.Number),
    PermissionsBoundary: S.optional(AttachedPermissionsBoundary),
    Tags: S.optional(TagListType),
    RoleLastUsed: S.optional(RoleLastUsed),
  }),
).annotations({ identifier: "Role" }) as any as S.Schema<Role>;
export type RoleListType = Role[];
export const RoleListType = S.Array(Role);
export interface InstanceProfile {
  Path: string;
  InstanceProfileName: string;
  InstanceProfileId: string;
  Arn: string;
  CreateDate: Date;
  Roles: Role[];
  Tags?: Tag[];
}
export const InstanceProfile = S.suspend(() =>
  S.Struct({
    Path: S.String,
    InstanceProfileName: S.String,
    InstanceProfileId: S.String,
    Arn: S.String,
    CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
    Roles: RoleListType,
    Tags: S.optional(TagListType),
  }),
).annotations({
  identifier: "InstanceProfile",
}) as any as S.Schema<InstanceProfile>;
export type InstanceProfileListType = InstanceProfile[];
export const InstanceProfileListType = S.Array(InstanceProfile);
export interface OpenIDConnectProviderListEntry {
  Arn?: string;
}
export const OpenIDConnectProviderListEntry = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "OpenIDConnectProviderListEntry",
}) as any as S.Schema<OpenIDConnectProviderListEntry>;
export type OpenIDConnectProviderListType = OpenIDConnectProviderListEntry[];
export const OpenIDConnectProviderListType = S.Array(
  OpenIDConnectProviderListEntry,
);
export interface Policy {
  PolicyName?: string;
  PolicyId?: string;
  Arn?: string;
  Path?: string;
  DefaultVersionId?: string;
  AttachmentCount?: number;
  PermissionsBoundaryUsageCount?: number;
  IsAttachable?: boolean;
  Description?: string;
  CreateDate?: Date;
  UpdateDate?: Date;
  Tags?: Tag[];
}
export const Policy = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    PolicyId: S.optional(S.String),
    Arn: S.optional(S.String),
    Path: S.optional(S.String),
    DefaultVersionId: S.optional(S.String),
    AttachmentCount: S.optional(S.Number),
    PermissionsBoundaryUsageCount: S.optional(S.Number),
    IsAttachable: S.optional(S.Boolean),
    Description: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(TagListType),
  }),
).annotations({ identifier: "Policy" }) as any as S.Schema<Policy>;
export type PolicyListType = Policy[];
export const PolicyListType = S.Array(Policy);
export interface PolicyVersion {
  Document?: string;
  VersionId?: string;
  IsDefaultVersion?: boolean;
  CreateDate?: Date;
}
export const PolicyVersion = S.suspend(() =>
  S.Struct({
    Document: S.optional(S.String),
    VersionId: S.optional(S.String),
    IsDefaultVersion: S.optional(S.Boolean),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "PolicyVersion",
}) as any as S.Schema<PolicyVersion>;
export type PolicyDocumentVersionListType = PolicyVersion[];
export const PolicyDocumentVersionListType = S.Array(PolicyVersion);
export interface SAMLProviderListEntry {
  Arn?: string;
  ValidUntil?: Date;
  CreateDate?: Date;
}
export const SAMLProviderListEntry = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ValidUntil: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "SAMLProviderListEntry",
}) as any as S.Schema<SAMLProviderListEntry>;
export type SAMLProviderListType = SAMLProviderListEntry[];
export const SAMLProviderListType = S.Array(SAMLProviderListEntry);
export interface VirtualMFADevice {
  SerialNumber: string;
  Base32StringSeed?: Uint8Array | redacted.Redacted<Uint8Array>;
  QRCodePNG?: Uint8Array | redacted.Redacted<Uint8Array>;
  User?: User;
  EnableDate?: Date;
  Tags?: Tag[];
}
export const VirtualMFADevice = S.suspend(() =>
  S.Struct({
    SerialNumber: S.String,
    Base32StringSeed: S.optional(SensitiveBlob),
    QRCodePNG: S.optional(SensitiveBlob),
    User: S.optional(User),
    EnableDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(TagListType),
  }),
).annotations({
  identifier: "VirtualMFADevice",
}) as any as S.Schema<VirtualMFADevice>;
export type VirtualMFADeviceListType = VirtualMFADevice[];
export const VirtualMFADeviceListType = S.Array(VirtualMFADevice);
export interface CreateInstanceProfileRequest {
  InstanceProfileName: string;
  Path?: string;
  Tags?: Tag[];
}
export const CreateInstanceProfileRequest = S.suspend(() =>
  S.Struct({
    InstanceProfileName: S.String,
    Path: S.optional(S.String),
    Tags: S.optional(TagListType),
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
  identifier: "CreateInstanceProfileRequest",
}) as any as S.Schema<CreateInstanceProfileRequest>;
export interface CreateOpenIDConnectProviderResponse {
  OpenIDConnectProviderArn?: string;
  Tags?: Tag[];
}
export const CreateOpenIDConnectProviderResponse = S.suspend(() =>
  S.Struct({
    OpenIDConnectProviderArn: S.optional(S.String),
    Tags: S.optional(TagListType),
  }).pipe(ns),
).annotations({
  identifier: "CreateOpenIDConnectProviderResponse",
}) as any as S.Schema<CreateOpenIDConnectProviderResponse>;
export interface CreateSAMLProviderResponse {
  SAMLProviderArn?: string;
  Tags?: Tag[];
}
export const CreateSAMLProviderResponse = S.suspend(() =>
  S.Struct({
    SAMLProviderArn: S.optional(S.String),
    Tags: S.optional(TagListType),
  }).pipe(ns),
).annotations({
  identifier: "CreateSAMLProviderResponse",
}) as any as S.Schema<CreateSAMLProviderResponse>;
export interface CreateServiceLinkedRoleResponse {
  Role?: Role;
}
export const CreateServiceLinkedRoleResponse = S.suspend(() =>
  S.Struct({ Role: S.optional(Role) }).pipe(ns),
).annotations({
  identifier: "CreateServiceLinkedRoleResponse",
}) as any as S.Schema<CreateServiceLinkedRoleResponse>;
export interface DeleteServiceLinkedRoleResponse {
  DeletionTaskId: string;
}
export const DeleteServiceLinkedRoleResponse = S.suspend(() =>
  S.Struct({ DeletionTaskId: S.String }).pipe(ns),
).annotations({
  identifier: "DeleteServiceLinkedRoleResponse",
}) as any as S.Schema<DeleteServiceLinkedRoleResponse>;
export interface GenerateOrganizationsAccessReportResponse {
  JobId?: string;
}
export const GenerateOrganizationsAccessReportResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GenerateOrganizationsAccessReportResponse",
}) as any as S.Schema<GenerateOrganizationsAccessReportResponse>;
export interface GenerateServiceLastAccessedDetailsResponse {
  JobId?: string;
}
export const GenerateServiceLastAccessedDetailsResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GenerateServiceLastAccessedDetailsResponse",
}) as any as S.Schema<GenerateServiceLastAccessedDetailsResponse>;
export interface GetAccountPasswordPolicyResponse {
  PasswordPolicy: PasswordPolicy;
}
export const GetAccountPasswordPolicyResponse = S.suspend(() =>
  S.Struct({ PasswordPolicy: PasswordPolicy }).pipe(ns),
).annotations({
  identifier: "GetAccountPasswordPolicyResponse",
}) as any as S.Schema<GetAccountPasswordPolicyResponse>;
export interface GetAccountSummaryResponse {
  SummaryMap?: { [key: string]: number | undefined };
}
export const GetAccountSummaryResponse = S.suspend(() =>
  S.Struct({ SummaryMap: S.optional(SummaryMapType) }).pipe(ns),
).annotations({
  identifier: "GetAccountSummaryResponse",
}) as any as S.Schema<GetAccountSummaryResponse>;
export interface GetContextKeysForPolicyResponse {
  ContextKeyNames?: string[];
}
export const GetContextKeysForPolicyResponse = S.suspend(() =>
  S.Struct({ ContextKeyNames: S.optional(ContextKeyNamesResultListType) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetContextKeysForPolicyResponse",
}) as any as S.Schema<GetContextKeysForPolicyResponse>;
export interface GetGroupResponse {
  Group: Group;
  Users: User[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const GetGroupResponse = S.suspend(() =>
  S.Struct({
    Group: Group,
    Users: UserListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetGroupResponse",
}) as any as S.Schema<GetGroupResponse>;
export interface GetGroupPolicyResponse {
  GroupName: string;
  PolicyName: string;
  PolicyDocument: string;
}
export const GetGroupPolicyResponse = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    PolicyName: S.String,
    PolicyDocument: S.String,
  }).pipe(ns),
).annotations({
  identifier: "GetGroupPolicyResponse",
}) as any as S.Schema<GetGroupPolicyResponse>;
export interface GetHumanReadableSummaryResponse {
  SummaryContent?: string;
  Locale?: string;
  SummaryState?: SummaryStateType;
}
export const GetHumanReadableSummaryResponse = S.suspend(() =>
  S.Struct({
    SummaryContent: S.optional(S.String),
    Locale: S.optional(S.String),
    SummaryState: S.optional(SummaryStateType),
  }).pipe(ns),
).annotations({
  identifier: "GetHumanReadableSummaryResponse",
}) as any as S.Schema<GetHumanReadableSummaryResponse>;
export interface LoginProfile {
  UserName: string;
  CreateDate: Date;
  PasswordResetRequired?: boolean;
}
export const LoginProfile = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
    PasswordResetRequired: S.optional(S.Boolean),
  }),
).annotations({ identifier: "LoginProfile" }) as any as S.Schema<LoginProfile>;
export interface GetLoginProfileResponse {
  LoginProfile: LoginProfile;
}
export const GetLoginProfileResponse = S.suspend(() =>
  S.Struct({ LoginProfile: LoginProfile }).pipe(ns),
).annotations({
  identifier: "GetLoginProfileResponse",
}) as any as S.Schema<GetLoginProfileResponse>;
export interface GetOpenIDConnectProviderResponse {
  Url?: string;
  ClientIDList?: string[];
  ThumbprintList?: string[];
  CreateDate?: Date;
  Tags?: Tag[];
}
export const GetOpenIDConnectProviderResponse = S.suspend(() =>
  S.Struct({
    Url: S.optional(S.String),
    ClientIDList: S.optional(ClientIDListType),
    ThumbprintList: S.optional(ThumbprintListType),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(TagListType),
  }).pipe(ns),
).annotations({
  identifier: "GetOpenIDConnectProviderResponse",
}) as any as S.Schema<GetOpenIDConnectProviderResponse>;
export interface GetPolicyResponse {
  Policy?: Policy;
}
export const GetPolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(Policy) }).pipe(ns),
).annotations({
  identifier: "GetPolicyResponse",
}) as any as S.Schema<GetPolicyResponse>;
export interface GetPolicyVersionResponse {
  PolicyVersion?: PolicyVersion;
}
export const GetPolicyVersionResponse = S.suspend(() =>
  S.Struct({ PolicyVersion: S.optional(PolicyVersion) }).pipe(ns),
).annotations({
  identifier: "GetPolicyVersionResponse",
}) as any as S.Schema<GetPolicyVersionResponse>;
export interface GetRoleResponse {
  Role: Role;
}
export const GetRoleResponse = S.suspend(() =>
  S.Struct({ Role: Role }).pipe(ns),
).annotations({
  identifier: "GetRoleResponse",
}) as any as S.Schema<GetRoleResponse>;
export interface GetRolePolicyResponse {
  RoleName: string;
  PolicyName: string;
  PolicyDocument: string;
}
export const GetRolePolicyResponse = S.suspend(() =>
  S.Struct({
    RoleName: S.String,
    PolicyName: S.String,
    PolicyDocument: S.String,
  }).pipe(ns),
).annotations({
  identifier: "GetRolePolicyResponse",
}) as any as S.Schema<GetRolePolicyResponse>;
export interface GetUserResponse {
  User: User;
}
export const GetUserResponse = S.suspend(() =>
  S.Struct({ User: User }).pipe(ns),
).annotations({
  identifier: "GetUserResponse",
}) as any as S.Schema<GetUserResponse>;
export interface GetUserPolicyResponse {
  UserName: string;
  PolicyName: string;
  PolicyDocument: string;
}
export const GetUserPolicyResponse = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    PolicyName: S.String,
    PolicyDocument: S.String,
  }).pipe(ns),
).annotations({
  identifier: "GetUserPolicyResponse",
}) as any as S.Schema<GetUserPolicyResponse>;
export interface ListAccountAliasesResponse {
  AccountAliases: string[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListAccountAliasesResponse = S.suspend(() =>
  S.Struct({
    AccountAliases: AccountAliasListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAccountAliasesResponse",
}) as any as S.Schema<ListAccountAliasesResponse>;
export interface AttachedPolicy {
  PolicyName?: string;
  PolicyArn?: string;
}
export const AttachedPolicy = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    PolicyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AttachedPolicy",
}) as any as S.Schema<AttachedPolicy>;
export type AttachedPoliciesListType = AttachedPolicy[];
export const AttachedPoliciesListType = S.Array(AttachedPolicy);
export interface ListAttachedRolePoliciesResponse {
  AttachedPolicies?: AttachedPolicy[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListAttachedRolePoliciesResponse = S.suspend(() =>
  S.Struct({
    AttachedPolicies: S.optional(AttachedPoliciesListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAttachedRolePoliciesResponse",
}) as any as S.Schema<ListAttachedRolePoliciesResponse>;
export interface ListAttachedUserPoliciesResponse {
  AttachedPolicies?: AttachedPolicy[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListAttachedUserPoliciesResponse = S.suspend(() =>
  S.Struct({
    AttachedPolicies: S.optional(AttachedPoliciesListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAttachedUserPoliciesResponse",
}) as any as S.Schema<ListAttachedUserPoliciesResponse>;
export interface ListDelegationRequestsResponse {
  DelegationRequests?: DelegationRequest[];
  Marker?: string;
  isTruncated?: boolean;
}
export const ListDelegationRequestsResponse = S.suspend(() =>
  S.Struct({
    DelegationRequests: S.optional(DelegationRequestsListType),
    Marker: S.optional(S.String),
    isTruncated: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ListDelegationRequestsResponse",
}) as any as S.Schema<ListDelegationRequestsResponse>;
export interface ListGroupPoliciesResponse {
  PolicyNames: string[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListGroupPoliciesResponse = S.suspend(() =>
  S.Struct({
    PolicyNames: PolicyNameListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListGroupPoliciesResponse",
}) as any as S.Schema<ListGroupPoliciesResponse>;
export interface ListGroupsResponse {
  Groups: Group[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListGroupsResponse = S.suspend(() =>
  S.Struct({
    Groups: GroupListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListGroupsResponse",
}) as any as S.Schema<ListGroupsResponse>;
export interface ListGroupsForUserResponse {
  Groups: Group[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListGroupsForUserResponse = S.suspend(() =>
  S.Struct({
    Groups: GroupListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListGroupsForUserResponse",
}) as any as S.Schema<ListGroupsForUserResponse>;
export interface ListInstanceProfilesResponse {
  InstanceProfiles: InstanceProfile[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListInstanceProfilesResponse = S.suspend(() =>
  S.Struct({
    InstanceProfiles: InstanceProfileListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInstanceProfilesResponse",
}) as any as S.Schema<ListInstanceProfilesResponse>;
export interface ListInstanceProfilesForRoleResponse {
  InstanceProfiles: InstanceProfile[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListInstanceProfilesForRoleResponse = S.suspend(() =>
  S.Struct({
    InstanceProfiles: InstanceProfileListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInstanceProfilesForRoleResponse",
}) as any as S.Schema<ListInstanceProfilesForRoleResponse>;
export interface ListInstanceProfileTagsResponse {
  Tags: Tag[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListInstanceProfileTagsResponse = S.suspend(() =>
  S.Struct({
    Tags: TagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInstanceProfileTagsResponse",
}) as any as S.Schema<ListInstanceProfileTagsResponse>;
export interface ListMFADeviceTagsResponse {
  Tags: Tag[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListMFADeviceTagsResponse = S.suspend(() =>
  S.Struct({
    Tags: TagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListMFADeviceTagsResponse",
}) as any as S.Schema<ListMFADeviceTagsResponse>;
export interface ListOpenIDConnectProvidersResponse {
  OpenIDConnectProviderList?: OpenIDConnectProviderListEntry[];
}
export const ListOpenIDConnectProvidersResponse = S.suspend(() =>
  S.Struct({
    OpenIDConnectProviderList: S.optional(OpenIDConnectProviderListType),
  }).pipe(ns),
).annotations({
  identifier: "ListOpenIDConnectProvidersResponse",
}) as any as S.Schema<ListOpenIDConnectProvidersResponse>;
export interface ListOpenIDConnectProviderTagsResponse {
  Tags: Tag[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListOpenIDConnectProviderTagsResponse = S.suspend(() =>
  S.Struct({
    Tags: TagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListOpenIDConnectProviderTagsResponse",
}) as any as S.Schema<ListOpenIDConnectProviderTagsResponse>;
export interface ListPoliciesResponse {
  Policies?: Policy[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListPoliciesResponse = S.suspend(() =>
  S.Struct({
    Policies: S.optional(PolicyListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPoliciesResponse",
}) as any as S.Schema<ListPoliciesResponse>;
export interface ListPolicyTagsResponse {
  Tags: Tag[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListPolicyTagsResponse = S.suspend(() =>
  S.Struct({
    Tags: TagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPolicyTagsResponse",
}) as any as S.Schema<ListPolicyTagsResponse>;
export interface ListPolicyVersionsResponse {
  Versions?: PolicyVersion[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListPolicyVersionsResponse = S.suspend(() =>
  S.Struct({
    Versions: S.optional(PolicyDocumentVersionListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPolicyVersionsResponse",
}) as any as S.Schema<ListPolicyVersionsResponse>;
export interface ListRolePoliciesResponse {
  PolicyNames: string[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListRolePoliciesResponse = S.suspend(() =>
  S.Struct({
    PolicyNames: PolicyNameListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRolePoliciesResponse",
}) as any as S.Schema<ListRolePoliciesResponse>;
export interface ListRolesResponse {
  Roles: Role[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListRolesResponse = S.suspend(() =>
  S.Struct({
    Roles: RoleListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRolesResponse",
}) as any as S.Schema<ListRolesResponse>;
export interface ListRoleTagsResponse {
  Tags: Tag[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListRoleTagsResponse = S.suspend(() =>
  S.Struct({
    Tags: TagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRoleTagsResponse",
}) as any as S.Schema<ListRoleTagsResponse>;
export interface ListSAMLProvidersResponse {
  SAMLProviderList?: SAMLProviderListEntry[];
}
export const ListSAMLProvidersResponse = S.suspend(() =>
  S.Struct({ SAMLProviderList: S.optional(SAMLProviderListType) }).pipe(ns),
).annotations({
  identifier: "ListSAMLProvidersResponse",
}) as any as S.Schema<ListSAMLProvidersResponse>;
export interface ListSAMLProviderTagsResponse {
  Tags: Tag[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListSAMLProviderTagsResponse = S.suspend(() =>
  S.Struct({
    Tags: TagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSAMLProviderTagsResponse",
}) as any as S.Schema<ListSAMLProviderTagsResponse>;
export interface ListServerCertificateTagsResponse {
  Tags: Tag[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListServerCertificateTagsResponse = S.suspend(() =>
  S.Struct({
    Tags: TagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListServerCertificateTagsResponse",
}) as any as S.Schema<ListServerCertificateTagsResponse>;
export interface ListUserPoliciesResponse {
  PolicyNames: string[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListUserPoliciesResponse = S.suspend(() =>
  S.Struct({
    PolicyNames: PolicyNameListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUserPoliciesResponse",
}) as any as S.Schema<ListUserPoliciesResponse>;
export interface ListUsersResponse {
  Users: User[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListUsersResponse = S.suspend(() =>
  S.Struct({
    Users: UserListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUsersResponse",
}) as any as S.Schema<ListUsersResponse>;
export interface ListUserTagsResponse {
  Tags: Tag[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListUserTagsResponse = S.suspend(() =>
  S.Struct({
    Tags: TagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUserTagsResponse",
}) as any as S.Schema<ListUserTagsResponse>;
export interface ListVirtualMFADevicesResponse {
  VirtualMFADevices: VirtualMFADevice[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListVirtualMFADevicesResponse = S.suspend(() =>
  S.Struct({
    VirtualMFADevices: VirtualMFADeviceListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListVirtualMFADevicesResponse",
}) as any as S.Schema<ListVirtualMFADevicesResponse>;
export interface ServiceSpecificCredential {
  CreateDate: Date;
  ExpirationDate?: Date;
  ServiceName: string;
  ServiceUserName?: string;
  ServicePassword?: string | redacted.Redacted<string>;
  ServiceCredentialAlias?: string;
  ServiceCredentialSecret?: string | redacted.Redacted<string>;
  ServiceSpecificCredentialId: string;
  UserName: string;
  Status: StatusType;
}
export const ServiceSpecificCredential = S.suspend(() =>
  S.Struct({
    CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ServiceName: S.String,
    ServiceUserName: S.optional(S.String),
    ServicePassword: S.optional(SensitiveString),
    ServiceCredentialAlias: S.optional(S.String),
    ServiceCredentialSecret: S.optional(SensitiveString),
    ServiceSpecificCredentialId: S.String,
    UserName: S.String,
    Status: StatusType,
  }),
).annotations({
  identifier: "ServiceSpecificCredential",
}) as any as S.Schema<ServiceSpecificCredential>;
export interface ResetServiceSpecificCredentialResponse {
  ServiceSpecificCredential?: ServiceSpecificCredential;
}
export const ResetServiceSpecificCredentialResponse = S.suspend(() =>
  S.Struct({
    ServiceSpecificCredential: S.optional(ServiceSpecificCredential),
  }).pipe(ns),
).annotations({
  identifier: "ResetServiceSpecificCredentialResponse",
}) as any as S.Schema<ResetServiceSpecificCredentialResponse>;
export interface SimulateCustomPolicyRequest {
  PolicyInputList: string[];
  PermissionsBoundaryPolicyInputList?: string[];
  ActionNames: string[];
  ResourceArns?: string[];
  ResourcePolicy?: string;
  ResourceOwner?: string;
  CallerArn?: string;
  ContextEntries?: ContextEntry[];
  ResourceHandlingOption?: string;
  MaxItems?: number;
  Marker?: string;
}
export const SimulateCustomPolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyInputList: SimulationPolicyListType,
    PermissionsBoundaryPolicyInputList: S.optional(SimulationPolicyListType),
    ActionNames: ActionNameListType,
    ResourceArns: S.optional(ResourceNameListType),
    ResourcePolicy: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    CallerArn: S.optional(S.String),
    ContextEntries: S.optional(ContextEntryListType),
    ResourceHandlingOption: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "SimulateCustomPolicyRequest",
}) as any as S.Schema<SimulateCustomPolicyRequest>;
export interface UpdateRoleDescriptionResponse {
  Role?: Role;
}
export const UpdateRoleDescriptionResponse = S.suspend(() =>
  S.Struct({ Role: S.optional(Role) }).pipe(ns),
).annotations({
  identifier: "UpdateRoleDescriptionResponse",
}) as any as S.Schema<UpdateRoleDescriptionResponse>;
export interface UpdateSAMLProviderResponse {
  SAMLProviderArn?: string;
}
export const UpdateSAMLProviderResponse = S.suspend(() =>
  S.Struct({ SAMLProviderArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateSAMLProviderResponse",
}) as any as S.Schema<UpdateSAMLProviderResponse>;
export interface ServerCertificateMetadata {
  Path: string;
  ServerCertificateName: string;
  ServerCertificateId: string;
  Arn: string;
  UploadDate?: Date;
  Expiration?: Date;
}
export const ServerCertificateMetadata = S.suspend(() =>
  S.Struct({
    Path: S.String,
    ServerCertificateName: S.String,
    ServerCertificateId: S.String,
    Arn: S.String,
    UploadDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ServerCertificateMetadata",
}) as any as S.Schema<ServerCertificateMetadata>;
export interface UploadServerCertificateResponse {
  ServerCertificateMetadata?: ServerCertificateMetadata;
  Tags?: Tag[];
}
export const UploadServerCertificateResponse = S.suspend(() =>
  S.Struct({
    ServerCertificateMetadata: S.optional(ServerCertificateMetadata),
    Tags: S.optional(TagListType),
  }).pipe(ns),
).annotations({
  identifier: "UploadServerCertificateResponse",
}) as any as S.Schema<UploadServerCertificateResponse>;
export interface SigningCertificate {
  UserName: string;
  CertificateId: string;
  CertificateBody: string;
  Status: StatusType;
  UploadDate?: Date;
}
export const SigningCertificate = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    CertificateId: S.String,
    CertificateBody: S.String,
    Status: StatusType,
    UploadDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "SigningCertificate",
}) as any as S.Schema<SigningCertificate>;
export interface UploadSigningCertificateResponse {
  Certificate: SigningCertificate;
}
export const UploadSigningCertificateResponse = S.suspend(() =>
  S.Struct({ Certificate: SigningCertificate }).pipe(ns),
).annotations({
  identifier: "UploadSigningCertificateResponse",
}) as any as S.Schema<UploadSigningCertificateResponse>;
export interface SSHPublicKey {
  UserName: string;
  SSHPublicKeyId: string;
  Fingerprint: string;
  SSHPublicKeyBody: string;
  Status: StatusType;
  UploadDate?: Date;
}
export const SSHPublicKey = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    SSHPublicKeyId: S.String,
    Fingerprint: S.String,
    SSHPublicKeyBody: S.String,
    Status: StatusType,
    UploadDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "SSHPublicKey" }) as any as S.Schema<SSHPublicKey>;
export interface UploadSSHPublicKeyResponse {
  SSHPublicKey?: SSHPublicKey;
}
export const UploadSSHPublicKeyResponse = S.suspend(() =>
  S.Struct({ SSHPublicKey: S.optional(SSHPublicKey) }).pipe(ns),
).annotations({
  identifier: "UploadSSHPublicKeyResponse",
}) as any as S.Schema<UploadSSHPublicKeyResponse>;
export type GroupNameListType = string[];
export const GroupNameListType = S.Array(S.String);
export type PolicyEvaluationDecisionType =
  | "allowed"
  | "explicitDeny"
  | "implicitDeny"
  | (string & {});
export const PolicyEvaluationDecisionType = S.String;
export interface AccessKey {
  UserName: string;
  AccessKeyId: string;
  Status: StatusType;
  SecretAccessKey: string | redacted.Redacted<string>;
  CreateDate?: Date;
}
export const AccessKey = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    AccessKeyId: S.String,
    Status: StatusType,
    SecretAccessKey: SensitiveString,
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "AccessKey" }) as any as S.Schema<AccessKey>;
export interface AccessKeyLastUsed {
  LastUsedDate?: Date;
  ServiceName: string;
  Region: string;
}
export const AccessKeyLastUsed = S.suspend(() =>
  S.Struct({
    LastUsedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ServiceName: S.String,
    Region: S.String,
  }),
).annotations({
  identifier: "AccessKeyLastUsed",
}) as any as S.Schema<AccessKeyLastUsed>;
export interface PolicyDetail {
  PolicyName?: string;
  PolicyDocument?: string;
}
export const PolicyDetail = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    PolicyDocument: S.optional(S.String),
  }),
).annotations({ identifier: "PolicyDetail" }) as any as S.Schema<PolicyDetail>;
export type PolicyDetailListType = PolicyDetail[];
export const PolicyDetailListType = S.Array(PolicyDetail);
export interface GroupDetail {
  Path?: string;
  GroupName?: string;
  GroupId?: string;
  Arn?: string;
  CreateDate?: Date;
  GroupPolicyList?: PolicyDetail[];
  AttachedManagedPolicies?: AttachedPolicy[];
}
export const GroupDetail = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    GroupName: S.optional(S.String),
    GroupId: S.optional(S.String),
    Arn: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    GroupPolicyList: S.optional(PolicyDetailListType),
    AttachedManagedPolicies: S.optional(AttachedPoliciesListType),
  }),
).annotations({ identifier: "GroupDetail" }) as any as S.Schema<GroupDetail>;
export type GroupDetailListType = GroupDetail[];
export const GroupDetailListType = S.Array(GroupDetail);
export interface RoleDetail {
  Path?: string;
  RoleName?: string;
  RoleId?: string;
  Arn?: string;
  CreateDate?: Date;
  AssumeRolePolicyDocument?: string;
  InstanceProfileList?: InstanceProfile[];
  RolePolicyList?: PolicyDetail[];
  AttachedManagedPolicies?: AttachedPolicy[];
  PermissionsBoundary?: AttachedPermissionsBoundary;
  Tags?: Tag[];
  RoleLastUsed?: RoleLastUsed;
}
export const RoleDetail = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    RoleName: S.optional(S.String),
    RoleId: S.optional(S.String),
    Arn: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    AssumeRolePolicyDocument: S.optional(S.String),
    InstanceProfileList: S.optional(InstanceProfileListType),
    RolePolicyList: S.optional(PolicyDetailListType),
    AttachedManagedPolicies: S.optional(AttachedPoliciesListType),
    PermissionsBoundary: S.optional(AttachedPermissionsBoundary),
    Tags: S.optional(TagListType),
    RoleLastUsed: S.optional(RoleLastUsed),
  }),
).annotations({ identifier: "RoleDetail" }) as any as S.Schema<RoleDetail>;
export type RoleDetailListType = RoleDetail[];
export const RoleDetailListType = S.Array(RoleDetail);
export interface ManagedPolicyDetail {
  PolicyName?: string;
  PolicyId?: string;
  Arn?: string;
  Path?: string;
  DefaultVersionId?: string;
  AttachmentCount?: number;
  PermissionsBoundaryUsageCount?: number;
  IsAttachable?: boolean;
  Description?: string;
  CreateDate?: Date;
  UpdateDate?: Date;
  PolicyVersionList?: PolicyVersion[];
}
export const ManagedPolicyDetail = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    PolicyId: S.optional(S.String),
    Arn: S.optional(S.String),
    Path: S.optional(S.String),
    DefaultVersionId: S.optional(S.String),
    AttachmentCount: S.optional(S.Number),
    PermissionsBoundaryUsageCount: S.optional(S.Number),
    IsAttachable: S.optional(S.Boolean),
    Description: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PolicyVersionList: S.optional(PolicyDocumentVersionListType),
  }),
).annotations({
  identifier: "ManagedPolicyDetail",
}) as any as S.Schema<ManagedPolicyDetail>;
export type ManagedPolicyDetailListType = ManagedPolicyDetail[];
export const ManagedPolicyDetailListType = S.Array(ManagedPolicyDetail);
export type CertificationMapType = { [key: string]: string | undefined };
export const CertificationMapType = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface AccessDetail {
  ServiceName: string;
  ServiceNamespace: string;
  Region?: string;
  EntityPath?: string;
  LastAuthenticatedTime?: Date;
  TotalAuthenticatedEntities?: number;
}
export const AccessDetail = S.suspend(() =>
  S.Struct({
    ServiceName: S.String,
    ServiceNamespace: S.String,
    Region: S.optional(S.String),
    EntityPath: S.optional(S.String),
    LastAuthenticatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    TotalAuthenticatedEntities: S.optional(S.Number),
  }),
).annotations({ identifier: "AccessDetail" }) as any as S.Schema<AccessDetail>;
export type AccessDetails = AccessDetail[];
export const AccessDetails = S.Array(AccessDetail);
export interface ErrorDetails {
  Message: string;
  Code: string;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({ Message: S.String, Code: S.String }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export interface SAMLPrivateKey {
  KeyId?: string;
  Timestamp?: Date;
}
export const SAMLPrivateKey = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "SAMLPrivateKey",
}) as any as S.Schema<SAMLPrivateKey>;
export type PrivateKeyList = SAMLPrivateKey[];
export const PrivateKeyList = S.Array(SAMLPrivateKey);
export interface ServerCertificate {
  ServerCertificateMetadata: ServerCertificateMetadata;
  CertificateBody: string;
  CertificateChain?: string;
  Tags?: Tag[];
}
export const ServerCertificate = S.suspend(() =>
  S.Struct({
    ServerCertificateMetadata: ServerCertificateMetadata,
    CertificateBody: S.String,
    CertificateChain: S.optional(S.String),
    Tags: S.optional(TagListType),
  }),
).annotations({
  identifier: "ServerCertificate",
}) as any as S.Schema<ServerCertificate>;
export interface AccessKeyMetadata {
  UserName?: string;
  AccessKeyId?: string;
  Status?: StatusType;
  CreateDate?: Date;
}
export const AccessKeyMetadata = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    AccessKeyId: S.optional(S.String),
    Status: S.optional(StatusType),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "AccessKeyMetadata",
}) as any as S.Schema<AccessKeyMetadata>;
export type AccessKeyMetadataListType = AccessKeyMetadata[];
export const AccessKeyMetadataListType = S.Array(AccessKeyMetadata);
export interface PolicyGroup {
  GroupName?: string;
  GroupId?: string;
}
export const PolicyGroup = S.suspend(() =>
  S.Struct({ GroupName: S.optional(S.String), GroupId: S.optional(S.String) }),
).annotations({ identifier: "PolicyGroup" }) as any as S.Schema<PolicyGroup>;
export type PolicyGroupListType = PolicyGroup[];
export const PolicyGroupListType = S.Array(PolicyGroup);
export interface PolicyUser {
  UserName?: string;
  UserId?: string;
}
export const PolicyUser = S.suspend(() =>
  S.Struct({ UserName: S.optional(S.String), UserId: S.optional(S.String) }),
).annotations({ identifier: "PolicyUser" }) as any as S.Schema<PolicyUser>;
export type PolicyUserListType = PolicyUser[];
export const PolicyUserListType = S.Array(PolicyUser);
export interface PolicyRole {
  RoleName?: string;
  RoleId?: string;
}
export const PolicyRole = S.suspend(() =>
  S.Struct({ RoleName: S.optional(S.String), RoleId: S.optional(S.String) }),
).annotations({ identifier: "PolicyRole" }) as any as S.Schema<PolicyRole>;
export type PolicyRoleListType = PolicyRole[];
export const PolicyRoleListType = S.Array(PolicyRole);
export interface MFADevice {
  UserName: string;
  SerialNumber: string;
  EnableDate: Date;
}
export const MFADevice = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    SerialNumber: S.String,
    EnableDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({ identifier: "MFADevice" }) as any as S.Schema<MFADevice>;
export type MfaDeviceListType = MFADevice[];
export const MfaDeviceListType = S.Array(MFADevice);
export type ServerCertificateMetadataListType = ServerCertificateMetadata[];
export const ServerCertificateMetadataListType = S.Array(
  ServerCertificateMetadata,
);
export interface ServiceSpecificCredentialMetadata {
  UserName: string;
  Status: StatusType;
  ServiceUserName?: string;
  ServiceCredentialAlias?: string;
  CreateDate: Date;
  ExpirationDate?: Date;
  ServiceSpecificCredentialId: string;
  ServiceName: string;
}
export const ServiceSpecificCredentialMetadata = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    Status: StatusType,
    ServiceUserName: S.optional(S.String),
    ServiceCredentialAlias: S.optional(S.String),
    CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ServiceSpecificCredentialId: S.String,
    ServiceName: S.String,
  }),
).annotations({
  identifier: "ServiceSpecificCredentialMetadata",
}) as any as S.Schema<ServiceSpecificCredentialMetadata>;
export type ServiceSpecificCredentialsListType =
  ServiceSpecificCredentialMetadata[];
export const ServiceSpecificCredentialsListType = S.Array(
  ServiceSpecificCredentialMetadata,
);
export type CertificateListType = SigningCertificate[];
export const CertificateListType = S.Array(SigningCertificate);
export interface SSHPublicKeyMetadata {
  UserName: string;
  SSHPublicKeyId: string;
  Status: StatusType;
  UploadDate: Date;
}
export const SSHPublicKeyMetadata = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    SSHPublicKeyId: S.String,
    Status: StatusType,
    UploadDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "SSHPublicKeyMetadata",
}) as any as S.Schema<SSHPublicKeyMetadata>;
export type SSHPublicKeyListType = SSHPublicKeyMetadata[];
export const SSHPublicKeyListType = S.Array(SSHPublicKeyMetadata);
export type PolicyOwnerEntityType = "USER" | "ROLE" | "GROUP" | (string & {});
export const PolicyOwnerEntityType = S.String;
export type ArnListType = string[];
export const ArnListType = S.Array(S.String);
export type PolicyType = "INLINE" | "MANAGED" | (string & {});
export const PolicyType = S.String;
export type PolicySourceType =
  | "user"
  | "group"
  | "role"
  | "aws-managed"
  | "user-managed"
  | "resource"
  | "none"
  | (string & {});
export const PolicySourceType = S.String;
export interface CreateAccessKeyResponse {
  AccessKey: AccessKey;
}
export const CreateAccessKeyResponse = S.suspend(() =>
  S.Struct({ AccessKey: AccessKey }).pipe(ns),
).annotations({
  identifier: "CreateAccessKeyResponse",
}) as any as S.Schema<CreateAccessKeyResponse>;
export interface CreateDelegationRequestRequest {
  OwnerAccountId?: string;
  Description: string;
  Permissions: DelegationPermission;
  RequestMessage?: string;
  RequestorWorkflowId: string;
  RedirectUrl?: string;
  NotificationChannel: string;
  SessionDuration: number;
  OnlySendByOwner?: boolean;
}
export const CreateDelegationRequestRequest = S.suspend(() =>
  S.Struct({
    OwnerAccountId: S.optional(S.String),
    Description: S.String,
    Permissions: DelegationPermission,
    RequestMessage: S.optional(S.String),
    RequestorWorkflowId: S.String,
    RedirectUrl: S.optional(S.String),
    NotificationChannel: S.String,
    SessionDuration: S.Number,
    OnlySendByOwner: S.optional(S.Boolean),
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
  identifier: "CreateDelegationRequestRequest",
}) as any as S.Schema<CreateDelegationRequestRequest>;
export interface CreateGroupResponse {
  Group: Group;
}
export const CreateGroupResponse = S.suspend(() =>
  S.Struct({ Group: Group }).pipe(ns),
).annotations({
  identifier: "CreateGroupResponse",
}) as any as S.Schema<CreateGroupResponse>;
export interface CreateInstanceProfileResponse {
  InstanceProfile: InstanceProfile;
}
export const CreateInstanceProfileResponse = S.suspend(() =>
  S.Struct({ InstanceProfile: InstanceProfile }).pipe(ns),
).annotations({
  identifier: "CreateInstanceProfileResponse",
}) as any as S.Schema<CreateInstanceProfileResponse>;
export interface CreateLoginProfileResponse {
  LoginProfile: LoginProfile;
}
export const CreateLoginProfileResponse = S.suspend(() =>
  S.Struct({ LoginProfile: LoginProfile }).pipe(ns),
).annotations({
  identifier: "CreateLoginProfileResponse",
}) as any as S.Schema<CreateLoginProfileResponse>;
export interface CreatePolicyResponse {
  Policy?: Policy;
}
export const CreatePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(Policy) }).pipe(ns),
).annotations({
  identifier: "CreatePolicyResponse",
}) as any as S.Schema<CreatePolicyResponse>;
export interface CreatePolicyVersionResponse {
  PolicyVersion?: PolicyVersion;
}
export const CreatePolicyVersionResponse = S.suspend(() =>
  S.Struct({ PolicyVersion: S.optional(PolicyVersion) }).pipe(ns),
).annotations({
  identifier: "CreatePolicyVersionResponse",
}) as any as S.Schema<CreatePolicyVersionResponse>;
export interface CreateServiceSpecificCredentialResponse {
  ServiceSpecificCredential?: ServiceSpecificCredential;
}
export const CreateServiceSpecificCredentialResponse = S.suspend(() =>
  S.Struct({
    ServiceSpecificCredential: S.optional(ServiceSpecificCredential),
  }).pipe(ns),
).annotations({
  identifier: "CreateServiceSpecificCredentialResponse",
}) as any as S.Schema<CreateServiceSpecificCredentialResponse>;
export interface CreateUserResponse {
  User?: User;
}
export const CreateUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }).pipe(ns),
).annotations({
  identifier: "CreateUserResponse",
}) as any as S.Schema<CreateUserResponse>;
export interface CreateVirtualMFADeviceResponse {
  VirtualMFADevice: VirtualMFADevice;
}
export const CreateVirtualMFADeviceResponse = S.suspend(() =>
  S.Struct({ VirtualMFADevice: VirtualMFADevice }).pipe(ns),
).annotations({
  identifier: "CreateVirtualMFADeviceResponse",
}) as any as S.Schema<CreateVirtualMFADeviceResponse>;
export interface GetAccessKeyLastUsedResponse {
  UserName?: string;
  AccessKeyLastUsed?: AccessKeyLastUsed;
}
export const GetAccessKeyLastUsedResponse = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    AccessKeyLastUsed: S.optional(AccessKeyLastUsed),
  }).pipe(ns),
).annotations({
  identifier: "GetAccessKeyLastUsedResponse",
}) as any as S.Schema<GetAccessKeyLastUsedResponse>;
export interface GetDelegationRequestResponse {
  DelegationRequest?: DelegationRequest;
  PermissionCheckStatus?: PermissionCheckStatusType;
  PermissionCheckResult?: PermissionCheckResultType;
}
export const GetDelegationRequestResponse = S.suspend(() =>
  S.Struct({
    DelegationRequest: S.optional(DelegationRequest),
    PermissionCheckStatus: S.optional(PermissionCheckStatusType),
    PermissionCheckResult: S.optional(PermissionCheckResultType),
  }).pipe(ns),
).annotations({
  identifier: "GetDelegationRequestResponse",
}) as any as S.Schema<GetDelegationRequestResponse>;
export interface GetInstanceProfileResponse {
  InstanceProfile: InstanceProfile;
}
export const GetInstanceProfileResponse = S.suspend(() =>
  S.Struct({ InstanceProfile: InstanceProfile }).pipe(ns),
).annotations({
  identifier: "GetInstanceProfileResponse",
}) as any as S.Schema<GetInstanceProfileResponse>;
export interface GetMFADeviceResponse {
  UserName?: string;
  SerialNumber: string;
  EnableDate?: Date;
  Certifications?: { [key: string]: string | undefined };
}
export const GetMFADeviceResponse = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    SerialNumber: S.String,
    EnableDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Certifications: S.optional(CertificationMapType),
  }).pipe(ns),
).annotations({
  identifier: "GetMFADeviceResponse",
}) as any as S.Schema<GetMFADeviceResponse>;
export interface GetOrganizationsAccessReportResponse {
  JobStatus: JobStatusType;
  JobCreationDate: Date;
  JobCompletionDate?: Date;
  NumberOfServicesAccessible?: number;
  NumberOfServicesNotAccessed?: number;
  AccessDetails?: AccessDetail[];
  IsTruncated?: boolean;
  Marker?: string;
  ErrorDetails?: ErrorDetails;
}
export const GetOrganizationsAccessReportResponse = S.suspend(() =>
  S.Struct({
    JobStatus: JobStatusType,
    JobCreationDate: S.Date.pipe(T.TimestampFormat("date-time")),
    JobCompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NumberOfServicesAccessible: S.optional(S.Number),
    NumberOfServicesNotAccessed: S.optional(S.Number),
    AccessDetails: S.optional(AccessDetails),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
    ErrorDetails: S.optional(ErrorDetails),
  }).pipe(ns),
).annotations({
  identifier: "GetOrganizationsAccessReportResponse",
}) as any as S.Schema<GetOrganizationsAccessReportResponse>;
export interface GetSAMLProviderResponse {
  SAMLProviderUUID?: string;
  SAMLMetadataDocument?: string;
  CreateDate?: Date;
  ValidUntil?: Date;
  Tags?: Tag[];
  AssertionEncryptionMode?: AssertionEncryptionModeType;
  PrivateKeyList?: SAMLPrivateKey[];
}
export const GetSAMLProviderResponse = S.suspend(() =>
  S.Struct({
    SAMLProviderUUID: S.optional(S.String),
    SAMLMetadataDocument: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ValidUntil: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(TagListType),
    AssertionEncryptionMode: S.optional(AssertionEncryptionModeType),
    PrivateKeyList: S.optional(PrivateKeyList),
  }).pipe(ns),
).annotations({
  identifier: "GetSAMLProviderResponse",
}) as any as S.Schema<GetSAMLProviderResponse>;
export interface GetServerCertificateResponse {
  ServerCertificate: ServerCertificate;
}
export const GetServerCertificateResponse = S.suspend(() =>
  S.Struct({ ServerCertificate: ServerCertificate }).pipe(ns),
).annotations({
  identifier: "GetServerCertificateResponse",
}) as any as S.Schema<GetServerCertificateResponse>;
export interface GetSSHPublicKeyResponse {
  SSHPublicKey?: SSHPublicKey;
}
export const GetSSHPublicKeyResponse = S.suspend(() =>
  S.Struct({ SSHPublicKey: S.optional(SSHPublicKey) }).pipe(ns),
).annotations({
  identifier: "GetSSHPublicKeyResponse",
}) as any as S.Schema<GetSSHPublicKeyResponse>;
export interface ListAccessKeysResponse {
  AccessKeyMetadata: AccessKeyMetadata[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListAccessKeysResponse = S.suspend(() =>
  S.Struct({
    AccessKeyMetadata: AccessKeyMetadataListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAccessKeysResponse",
}) as any as S.Schema<ListAccessKeysResponse>;
export interface ListAttachedGroupPoliciesResponse {
  AttachedPolicies?: AttachedPolicy[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListAttachedGroupPoliciesResponse = S.suspend(() =>
  S.Struct({
    AttachedPolicies: S.optional(AttachedPoliciesListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAttachedGroupPoliciesResponse",
}) as any as S.Schema<ListAttachedGroupPoliciesResponse>;
export interface ListEntitiesForPolicyResponse {
  PolicyGroups?: PolicyGroup[];
  PolicyUsers?: PolicyUser[];
  PolicyRoles?: PolicyRole[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListEntitiesForPolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyGroups: S.optional(PolicyGroupListType),
    PolicyUsers: S.optional(PolicyUserListType),
    PolicyRoles: S.optional(PolicyRoleListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListEntitiesForPolicyResponse",
}) as any as S.Schema<ListEntitiesForPolicyResponse>;
export interface ListMFADevicesResponse {
  MFADevices: MFADevice[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListMFADevicesResponse = S.suspend(() =>
  S.Struct({
    MFADevices: MfaDeviceListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListMFADevicesResponse",
}) as any as S.Schema<ListMFADevicesResponse>;
export interface ListServerCertificatesResponse {
  ServerCertificateMetadataList: ServerCertificateMetadata[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListServerCertificatesResponse = S.suspend(() =>
  S.Struct({
    ServerCertificateMetadataList: ServerCertificateMetadataListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListServerCertificatesResponse",
}) as any as S.Schema<ListServerCertificatesResponse>;
export interface ListServiceSpecificCredentialsResponse {
  ServiceSpecificCredentials?: ServiceSpecificCredentialMetadata[];
  Marker?: string;
  IsTruncated?: boolean;
}
export const ListServiceSpecificCredentialsResponse = S.suspend(() =>
  S.Struct({
    ServiceSpecificCredentials: S.optional(ServiceSpecificCredentialsListType),
    Marker: S.optional(S.String),
    IsTruncated: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ListServiceSpecificCredentialsResponse",
}) as any as S.Schema<ListServiceSpecificCredentialsResponse>;
export interface ListSigningCertificatesResponse {
  Certificates: SigningCertificate[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListSigningCertificatesResponse = S.suspend(() =>
  S.Struct({
    Certificates: CertificateListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSigningCertificatesResponse",
}) as any as S.Schema<ListSigningCertificatesResponse>;
export interface ListSSHPublicKeysResponse {
  SSHPublicKeys?: SSHPublicKeyMetadata[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListSSHPublicKeysResponse = S.suspend(() =>
  S.Struct({
    SSHPublicKeys: S.optional(SSHPublicKeyListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSSHPublicKeysResponse",
}) as any as S.Schema<ListSSHPublicKeysResponse>;
export interface TrackedActionLastAccessed {
  ActionName?: string;
  LastAccessedEntity?: string;
  LastAccessedTime?: Date;
  LastAccessedRegion?: string;
}
export const TrackedActionLastAccessed = S.suspend(() =>
  S.Struct({
    ActionName: S.optional(S.String),
    LastAccessedEntity: S.optional(S.String),
    LastAccessedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastAccessedRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "TrackedActionLastAccessed",
}) as any as S.Schema<TrackedActionLastAccessed>;
export type TrackedActionsLastAccessed = TrackedActionLastAccessed[];
export const TrackedActionsLastAccessed = S.Array(TrackedActionLastAccessed);
export interface EntityInfo {
  Arn: string;
  Name: string;
  Type: PolicyOwnerEntityType;
  Id: string;
  Path?: string;
}
export const EntityInfo = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.String,
    Type: PolicyOwnerEntityType,
    Id: S.String,
    Path: S.optional(S.String),
  }),
).annotations({ identifier: "EntityInfo" }) as any as S.Schema<EntityInfo>;
export interface RoleUsageType {
  Region?: string;
  Resources?: string[];
}
export const RoleUsageType = S.suspend(() =>
  S.Struct({
    Region: S.optional(S.String),
    Resources: S.optional(ArnListType),
  }),
).annotations({
  identifier: "RoleUsageType",
}) as any as S.Schema<RoleUsageType>;
export type RoleUsageListType = RoleUsageType[];
export const RoleUsageListType = S.Array(RoleUsageType);
export interface PolicyGrantingServiceAccess {
  PolicyName: string;
  PolicyType: PolicyType;
  PolicyArn?: string;
  EntityType?: PolicyOwnerEntityType;
  EntityName?: string;
}
export const PolicyGrantingServiceAccess = S.suspend(() =>
  S.Struct({
    PolicyName: S.String,
    PolicyType: PolicyType,
    PolicyArn: S.optional(S.String),
    EntityType: S.optional(PolicyOwnerEntityType),
    EntityName: S.optional(S.String),
  }),
).annotations({
  identifier: "PolicyGrantingServiceAccess",
}) as any as S.Schema<PolicyGrantingServiceAccess>;
export type PolicyGrantingServiceAccessListType = PolicyGrantingServiceAccess[];
export const PolicyGrantingServiceAccessListType = S.Array(
  PolicyGrantingServiceAccess,
);
export interface OrganizationsDecisionDetail {
  AllowedByOrganizations?: boolean;
}
export const OrganizationsDecisionDetail = S.suspend(() =>
  S.Struct({ AllowedByOrganizations: S.optional(S.Boolean) }),
).annotations({
  identifier: "OrganizationsDecisionDetail",
}) as any as S.Schema<OrganizationsDecisionDetail>;
export interface PermissionsBoundaryDecisionDetail {
  AllowedByPermissionsBoundary?: boolean;
}
export const PermissionsBoundaryDecisionDetail = S.suspend(() =>
  S.Struct({ AllowedByPermissionsBoundary: S.optional(S.Boolean) }),
).annotations({
  identifier: "PermissionsBoundaryDecisionDetail",
}) as any as S.Schema<PermissionsBoundaryDecisionDetail>;
export type EvalDecisionDetailsType = {
  [key: string]: PolicyEvaluationDecisionType | undefined;
};
export const EvalDecisionDetailsType = S.Record({
  key: S.String,
  value: S.UndefinedOr(PolicyEvaluationDecisionType),
});
export interface Position {
  Line?: number;
  Column?: number;
}
export const Position = S.suspend(() =>
  S.Struct({ Line: S.optional(S.Number), Column: S.optional(S.Number) }),
).annotations({ identifier: "Position" }) as any as S.Schema<Position>;
export interface Statement {
  SourcePolicyId?: string;
  SourcePolicyType?: PolicySourceType;
  StartPosition?: Position;
  EndPosition?: Position;
}
export const Statement = S.suspend(() =>
  S.Struct({
    SourcePolicyId: S.optional(S.String),
    SourcePolicyType: S.optional(PolicySourceType),
    StartPosition: S.optional(Position),
    EndPosition: S.optional(Position),
  }),
).annotations({ identifier: "Statement" }) as any as S.Schema<Statement>;
export type StatementListType = Statement[];
export const StatementListType = S.Array(Statement);
export interface ResourceSpecificResult {
  EvalResourceName: string;
  EvalResourceDecision: PolicyEvaluationDecisionType;
  MatchedStatements?: Statement[];
  MissingContextValues?: string[];
  EvalDecisionDetails?: {
    [key: string]: PolicyEvaluationDecisionType | undefined;
  };
  PermissionsBoundaryDecisionDetail?: PermissionsBoundaryDecisionDetail;
}
export const ResourceSpecificResult = S.suspend(() =>
  S.Struct({
    EvalResourceName: S.String,
    EvalResourceDecision: PolicyEvaluationDecisionType,
    MatchedStatements: S.optional(StatementListType),
    MissingContextValues: S.optional(ContextKeyNamesResultListType),
    EvalDecisionDetails: S.optional(EvalDecisionDetailsType),
    PermissionsBoundaryDecisionDetail: S.optional(
      PermissionsBoundaryDecisionDetail,
    ),
  }),
).annotations({
  identifier: "ResourceSpecificResult",
}) as any as S.Schema<ResourceSpecificResult>;
export type ResourceSpecificResultListType = ResourceSpecificResult[];
export const ResourceSpecificResultListType = S.Array(ResourceSpecificResult);
export interface UserDetail {
  Path?: string;
  UserName?: string;
  UserId?: string;
  Arn?: string;
  CreateDate?: Date;
  UserPolicyList?: PolicyDetail[];
  GroupList?: string[];
  AttachedManagedPolicies?: AttachedPolicy[];
  PermissionsBoundary?: AttachedPermissionsBoundary;
  Tags?: Tag[];
}
export const UserDetail = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    UserName: S.optional(S.String),
    UserId: S.optional(S.String),
    Arn: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UserPolicyList: S.optional(PolicyDetailListType),
    GroupList: S.optional(GroupNameListType),
    AttachedManagedPolicies: S.optional(AttachedPoliciesListType),
    PermissionsBoundary: S.optional(AttachedPermissionsBoundary),
    Tags: S.optional(TagListType),
  }),
).annotations({ identifier: "UserDetail" }) as any as S.Schema<UserDetail>;
export type UserDetailListType = UserDetail[];
export const UserDetailListType = S.Array(UserDetail);
export interface ServiceLastAccessed {
  ServiceName: string;
  LastAuthenticated?: Date;
  ServiceNamespace: string;
  LastAuthenticatedEntity?: string;
  LastAuthenticatedRegion?: string;
  TotalAuthenticatedEntities?: number;
  TrackedActionsLastAccessed?: TrackedActionLastAccessed[];
}
export const ServiceLastAccessed = S.suspend(() =>
  S.Struct({
    ServiceName: S.String,
    LastAuthenticated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ServiceNamespace: S.String,
    LastAuthenticatedEntity: S.optional(S.String),
    LastAuthenticatedRegion: S.optional(S.String),
    TotalAuthenticatedEntities: S.optional(S.Number),
    TrackedActionsLastAccessed: S.optional(TrackedActionsLastAccessed),
  }),
).annotations({
  identifier: "ServiceLastAccessed",
}) as any as S.Schema<ServiceLastAccessed>;
export type ServicesLastAccessed = ServiceLastAccessed[];
export const ServicesLastAccessed = S.Array(ServiceLastAccessed);
export interface EntityDetails {
  EntityInfo: EntityInfo;
  LastAuthenticated?: Date;
}
export const EntityDetails = S.suspend(() =>
  S.Struct({
    EntityInfo: EntityInfo,
    LastAuthenticated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "EntityDetails",
}) as any as S.Schema<EntityDetails>;
export type EntityDetailsListType = EntityDetails[];
export const EntityDetailsListType = S.Array(EntityDetails);
export interface DeletionTaskFailureReasonType {
  Reason?: string;
  RoleUsageList?: RoleUsageType[];
}
export const DeletionTaskFailureReasonType = S.suspend(() =>
  S.Struct({
    Reason: S.optional(S.String),
    RoleUsageList: S.optional(RoleUsageListType),
  }),
).annotations({
  identifier: "DeletionTaskFailureReasonType",
}) as any as S.Schema<DeletionTaskFailureReasonType>;
export interface ListPoliciesGrantingServiceAccessEntry {
  ServiceNamespace?: string;
  Policies?: PolicyGrantingServiceAccess[];
}
export const ListPoliciesGrantingServiceAccessEntry = S.suspend(() =>
  S.Struct({
    ServiceNamespace: S.optional(S.String),
    Policies: S.optional(PolicyGrantingServiceAccessListType),
  }),
).annotations({
  identifier: "ListPoliciesGrantingServiceAccessEntry",
}) as any as S.Schema<ListPoliciesGrantingServiceAccessEntry>;
export type ListPolicyGrantingServiceAccessResponseListType =
  ListPoliciesGrantingServiceAccessEntry[];
export const ListPolicyGrantingServiceAccessResponseListType = S.Array(
  ListPoliciesGrantingServiceAccessEntry,
);
export interface CreateDelegationRequestResponse {
  ConsoleDeepLink?: string;
  DelegationRequestId?: string;
}
export const CreateDelegationRequestResponse = S.suspend(() =>
  S.Struct({
    ConsoleDeepLink: S.optional(S.String),
    DelegationRequestId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateDelegationRequestResponse",
}) as any as S.Schema<CreateDelegationRequestResponse>;
export interface CreateRoleResponse {
  Role: Role;
}
export const CreateRoleResponse = S.suspend(() =>
  S.Struct({ Role: Role }).pipe(ns),
).annotations({
  identifier: "CreateRoleResponse",
}) as any as S.Schema<CreateRoleResponse>;
export interface GetAccountAuthorizationDetailsResponse {
  UserDetailList?: UserDetail[];
  GroupDetailList?: GroupDetail[];
  RoleDetailList?: RoleDetail[];
  Policies?: ManagedPolicyDetail[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const GetAccountAuthorizationDetailsResponse = S.suspend(() =>
  S.Struct({
    UserDetailList: S.optional(UserDetailListType),
    GroupDetailList: S.optional(GroupDetailListType),
    RoleDetailList: S.optional(RoleDetailListType),
    Policies: S.optional(ManagedPolicyDetailListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAccountAuthorizationDetailsResponse",
}) as any as S.Schema<GetAccountAuthorizationDetailsResponse>;
export interface GetServiceLastAccessedDetailsResponse {
  JobStatus: JobStatusType;
  JobType?: AccessAdvisorUsageGranularityType;
  JobCreationDate: Date;
  ServicesLastAccessed: ServiceLastAccessed[];
  JobCompletionDate: Date;
  IsTruncated?: boolean;
  Marker?: string;
  Error?: ErrorDetails;
}
export const GetServiceLastAccessedDetailsResponse = S.suspend(() =>
  S.Struct({
    JobStatus: JobStatusType,
    JobType: S.optional(AccessAdvisorUsageGranularityType),
    JobCreationDate: S.Date.pipe(T.TimestampFormat("date-time")),
    ServicesLastAccessed: ServicesLastAccessed,
    JobCompletionDate: S.Date.pipe(T.TimestampFormat("date-time")),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
    Error: S.optional(ErrorDetails),
  }).pipe(ns),
).annotations({
  identifier: "GetServiceLastAccessedDetailsResponse",
}) as any as S.Schema<GetServiceLastAccessedDetailsResponse>;
export interface GetServiceLastAccessedDetailsWithEntitiesResponse {
  JobStatus: JobStatusType;
  JobCreationDate: Date;
  JobCompletionDate: Date;
  EntityDetailsList: EntityDetails[];
  IsTruncated?: boolean;
  Marker?: string;
  Error?: ErrorDetails;
}
export const GetServiceLastAccessedDetailsWithEntitiesResponse = S.suspend(() =>
  S.Struct({
    JobStatus: JobStatusType,
    JobCreationDate: S.Date.pipe(T.TimestampFormat("date-time")),
    JobCompletionDate: S.Date.pipe(T.TimestampFormat("date-time")),
    EntityDetailsList: EntityDetailsListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
    Error: S.optional(ErrorDetails),
  }).pipe(ns),
).annotations({
  identifier: "GetServiceLastAccessedDetailsWithEntitiesResponse",
}) as any as S.Schema<GetServiceLastAccessedDetailsWithEntitiesResponse>;
export interface GetServiceLinkedRoleDeletionStatusResponse {
  Status: DeletionTaskStatusType;
  Reason?: DeletionTaskFailureReasonType;
}
export const GetServiceLinkedRoleDeletionStatusResponse = S.suspend(() =>
  S.Struct({
    Status: DeletionTaskStatusType,
    Reason: S.optional(DeletionTaskFailureReasonType),
  }).pipe(ns),
).annotations({
  identifier: "GetServiceLinkedRoleDeletionStatusResponse",
}) as any as S.Schema<GetServiceLinkedRoleDeletionStatusResponse>;
export interface ListPoliciesGrantingServiceAccessResponse {
  PoliciesGrantingServiceAccess: ListPoliciesGrantingServiceAccessEntry[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const ListPoliciesGrantingServiceAccessResponse = S.suspend(() =>
  S.Struct({
    PoliciesGrantingServiceAccess:
      ListPolicyGrantingServiceAccessResponseListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPoliciesGrantingServiceAccessResponse",
}) as any as S.Schema<ListPoliciesGrantingServiceAccessResponse>;
export interface EvaluationResult {
  EvalActionName: string;
  EvalResourceName?: string;
  EvalDecision: PolicyEvaluationDecisionType;
  MatchedStatements?: Statement[];
  MissingContextValues?: string[];
  OrganizationsDecisionDetail?: OrganizationsDecisionDetail;
  PermissionsBoundaryDecisionDetail?: PermissionsBoundaryDecisionDetail;
  EvalDecisionDetails?: {
    [key: string]: PolicyEvaluationDecisionType | undefined;
  };
  ResourceSpecificResults?: ResourceSpecificResult[];
}
export const EvaluationResult = S.suspend(() =>
  S.Struct({
    EvalActionName: S.String,
    EvalResourceName: S.optional(S.String),
    EvalDecision: PolicyEvaluationDecisionType,
    MatchedStatements: S.optional(StatementListType),
    MissingContextValues: S.optional(ContextKeyNamesResultListType),
    OrganizationsDecisionDetail: S.optional(OrganizationsDecisionDetail),
    PermissionsBoundaryDecisionDetail: S.optional(
      PermissionsBoundaryDecisionDetail,
    ),
    EvalDecisionDetails: S.optional(EvalDecisionDetailsType),
    ResourceSpecificResults: S.optional(ResourceSpecificResultListType),
  }),
).annotations({
  identifier: "EvaluationResult",
}) as any as S.Schema<EvaluationResult>;
export type EvaluationResultsListType = EvaluationResult[];
export const EvaluationResultsListType = S.Array(EvaluationResult);
export interface SimulatePolicyResponse {
  EvaluationResults?: EvaluationResult[];
  IsTruncated?: boolean;
  Marker?: string;
}
export const SimulatePolicyResponse = S.suspend(() =>
  S.Struct({
    EvaluationResults: S.optional(EvaluationResultsListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "SimulatePolicyResponse",
}) as any as S.Schema<SimulatePolicyResponse>;

//# Errors
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class FeatureDisabledException extends S.TaggedError<FeatureDisabledException>()(
  "FeatureDisabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "FeatureDisabled", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConcurrentModification", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class EntityAlreadyExistsException extends S.TaggedError<EntityAlreadyExistsException>()(
  "EntityAlreadyExistsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "EntityAlreadyExists", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidInput", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EntityTemporarilyUnmodifiableException extends S.TaggedError<EntityTemporarilyUnmodifiableException>()(
  "EntityTemporarilyUnmodifiableException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EntityTemporarilyUnmodifiable",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class NoSuchEntityException extends S.TaggedError<NoSuchEntityException>()(
  "NoSuchEntityException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NoSuchEntity", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DeleteConflictException extends S.TaggedError<DeleteConflictException>()(
  "DeleteConflictException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DeleteConflict", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class AccountNotManagementOrDelegatedAdministratorException extends S.TaggedError<AccountNotManagementOrDelegatedAdministratorException>()(
  "AccountNotManagementOrDelegatedAdministratorException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FeatureEnabledException extends S.TaggedError<FeatureEnabledException>()(
  "FeatureEnabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "FeatureEnabled", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceFailure", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class CredentialReportExpiredException extends S.TaggedError<CredentialReportExpiredException>()(
  "CredentialReportExpiredException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReportExpired", httpResponseCode: 410 }),
).pipe(C.withBadRequestError) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "MalformedPolicyDocument", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidUserTypeException extends S.TaggedError<InvalidUserTypeException>()(
  "InvalidUserTypeException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidUserType", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class OpenIdIdpCommunicationErrorException extends S.TaggedError<OpenIdIdpCommunicationErrorException>()(
  "OpenIdIdpCommunicationErrorException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpenIdIdpCommunicationError",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class OrganizationNotFoundException extends S.TaggedError<OrganizationNotFoundException>()(
  "OrganizationNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ReportGenerationLimitExceededException extends S.TaggedError<ReportGenerationLimitExceededException>()(
  "ReportGenerationLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReportGenerationLimitExceeded",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class CredentialReportNotPresentException extends S.TaggedError<CredentialReportNotPresentException>()(
  "CredentialReportNotPresentException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReportNotPresent", httpResponseCode: 410 }),
).pipe(C.withBadRequestError) {}
export class PolicyEvaluationException extends S.TaggedError<PolicyEvaluationException>()(
  "PolicyEvaluationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "PolicyEvaluation", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class UnmodifiableEntityException extends S.TaggedError<UnmodifiableEntityException>()(
  "UnmodifiableEntityException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnmodifiableEntity", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KeyPairMismatchException extends S.TaggedError<KeyPairMismatchException>()(
  "KeyPairMismatchException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KeyPairMismatch", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateCertificateException extends S.TaggedError<DuplicateCertificateException>()(
  "DuplicateCertificateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateCertificate", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class DuplicateSSHPublicKeyException extends S.TaggedError<DuplicateSSHPublicKeyException>()(
  "DuplicateSSHPublicKeyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateSSHPublicKey", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidAuthenticationCodeException extends S.TaggedError<InvalidAuthenticationCodeException>()(
  "InvalidAuthenticationCodeException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidAuthenticationCode", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class PolicyNotAttachableException extends S.TaggedError<PolicyNotAttachableException>()(
  "PolicyNotAttachableException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "PolicyNotAttachable", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class PasswordPolicyViolationException extends S.TaggedError<PasswordPolicyViolationException>()(
  "PasswordPolicyViolationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "PasswordPolicyViolation", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CallerIsNotManagementAccountException extends S.TaggedError<CallerIsNotManagementAccountException>()(
  "CallerIsNotManagementAccountException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceNotSupportedException extends S.TaggedError<ServiceNotSupportedException>()(
  "ServiceNotSupportedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NotSupportedService", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class OrganizationNotInAllFeaturesModeException extends S.TaggedError<OrganizationNotInAllFeaturesModeException>()(
  "OrganizationNotInAllFeaturesModeException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CredentialReportNotReadyException extends S.TaggedError<CredentialReportNotReadyException>()(
  "CredentialReportNotReadyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReportInProgress", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class UnrecognizedPublicKeyEncodingException extends S.TaggedError<UnrecognizedPublicKeyEncodingException>()(
  "UnrecognizedPublicKeyEncodingException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnrecognizedPublicKeyEncoding",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class MalformedCertificateException extends S.TaggedError<MalformedCertificateException>()(
  "MalformedCertificateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "MalformedCertificate", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidCertificateException extends S.TaggedError<InvalidCertificateException>()(
  "InvalidCertificateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidCertificate", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidPublicKeyException extends S.TaggedError<InvalidPublicKeyException>()(
  "InvalidPublicKeyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidPublicKey", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class RequestLimitExceeded extends S.TaggedError<RequestLimitExceeded>()(
  "RequestLimitExceeded",
  {},
) {}
export class InvalidInput extends S.TaggedError<InvalidInput>()(
  "InvalidInput",
  {},
) {}
export class ServiceAccessNotEnabledException extends S.TaggedError<ServiceAccessNotEnabledException>()(
  "ServiceAccessNotEnabledException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Disables the outbound identity federation feature for your Amazon Web Services account. When disabled, IAM principals in the account cannot
 * use the `GetWebIdentityToken` API to obtain JSON Web Tokens (JWTs) for authentication with external services. This operation
 * does not affect tokens that were issued before the feature was disabled.
 */
export const disableOutboundWebIdentityFederation: (
  input: DisableOutboundWebIdentityFederationRequest,
) => effect.Effect<
  DisableOutboundWebIdentityFederationResponse,
  FeatureDisabledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableOutboundWebIdentityFederationRequest,
  output: DisableOutboundWebIdentityFederationResponse,
  errors: [FeatureDisabledException],
}));
/**
 * Retrieves the configuration information for the outbound identity federation feature in your Amazon Web Services account. The response includes the unique issuer URL for your
 * Amazon Web Services account and the current enabled/disabled status of the feature. Use this operation to obtain the issuer URL that you need to configure trust relationships with external services.
 */
export const getOutboundWebIdentityFederationInfo: (
  input: GetOutboundWebIdentityFederationInfoRequest,
) => effect.Effect<
  GetOutboundWebIdentityFederationInfoResponse,
  FeatureDisabledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOutboundWebIdentityFederationInfoRequest,
  output: GetOutboundWebIdentityFederationInfoResponse,
  errors: [FeatureDisabledException],
}));
/**
 * Enables the outbound identity federation feature for your Amazon Web Services account. When enabled, IAM principals in your account
 * can use the `GetWebIdentityToken` API to obtain JSON Web Tokens (JWTs) for secure authentication with external services.
 * This operation also generates a unique issuer URL for your Amazon Web Services account.
 */
export const enableOutboundWebIdentityFederation: (
  input: EnableOutboundWebIdentityFederationRequest,
) => effect.Effect<
  EnableOutboundWebIdentityFederationResponse,
  FeatureEnabledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableOutboundWebIdentityFederationRequest,
  output: EnableOutboundWebIdentityFederationResponse,
  errors: [FeatureEnabledException],
}));
/**
 * Generates a credential report for the Amazon Web Services account. For more information about the
 * credential report, see Getting credential reports in
 * the *IAM User Guide*.
 */
export const generateCredentialReport: (
  input: GenerateCredentialReportRequest,
) => effect.Effect<
  GenerateCredentialReportResponse,
  LimitExceededException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateCredentialReportRequest,
  output: GenerateCredentialReportResponse,
  errors: [LimitExceededException, ServiceFailureException],
}));
/**
 * Generates a report that includes details about when an IAM resource (user, group,
 * role, or policy) was last used in an attempt to access Amazon Web Services services. Recent activity
 * usually appears within four hours. IAM reports activity for at least the last 400
 * days, or less if your Region began supporting this feature within the last year. For
 * more information, see Regions where data is tracked. For more information about services and
 * actions for which action last accessed information is displayed, see IAM
 * action last accessed information services and actions.
 *
 * The service last accessed data includes all attempts to access an Amazon Web Services API, not
 * just the successful ones. This includes all attempts that were made using the
 * Amazon Web Services Management Console, the Amazon Web Services API through any of the SDKs, or any of the command line tools.
 * An unexpected entry in the service last accessed data does not mean that your
 * account has been compromised, because the request might have been denied. Refer to
 * your CloudTrail logs as the authoritative source for information about all API calls
 * and whether they were successful or denied access. For more information, see Logging
 * IAM events with CloudTrail in the
 * *IAM User Guide*.
 *
 * The `GenerateServiceLastAccessedDetails` operation returns a
 * `JobId`. Use this parameter in the following operations to retrieve the
 * following details from your report:
 *
 * - GetServiceLastAccessedDetails – Use this operation for
 * users, groups, roles, or policies to list every Amazon Web Services service that the resource
 * could access using permissions policies. For each service, the response includes
 * information about the most recent access attempt.
 *
 * The `JobId` returned by
 * `GenerateServiceLastAccessedDetail` must be used by the same role
 * within a session, or by the same user when used to call
 * `GetServiceLastAccessedDetail`.
 *
 * - GetServiceLastAccessedDetailsWithEntities – Use this
 * operation for groups and policies to list information about the associated
 * entities (users or roles) that attempted to access a specific Amazon Web Services service.
 *
 * To check the status of the `GenerateServiceLastAccessedDetails` request,
 * use the `JobId` parameter in the same operations and test the
 * `JobStatus` response parameter.
 *
 * For additional information about the permissions policies that allow an identity
 * (user, group, or role) to access specific services, use the ListPoliciesGrantingServiceAccess operation.
 *
 * Service last accessed data does not use other policy types when determining
 * whether a resource could access a service. These other policy types include
 * resource-based policies, access control lists, Organizations policies, IAM permissions
 * boundaries, and STS assume role policies. It only applies permissions policy
 * logic. For more about the evaluation of policy types, see Evaluating policies in the
 * *IAM User Guide*.
 *
 * For more information about service and action last accessed data, see Reducing permissions using service last accessed data in the
 * *IAM User Guide*.
 */
export const generateServiceLastAccessedDetails: (
  input: GenerateServiceLastAccessedDetailsRequest,
) => effect.Effect<
  GenerateServiceLastAccessedDetailsResponse,
  InvalidInputException | NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateServiceLastAccessedDetailsRequest,
  output: GenerateServiceLastAccessedDetailsResponse,
  errors: [InvalidInputException, NoSuchEntityException],
}));
/**
 * Retrieves the password policy for the Amazon Web Services account. This tells you the complexity
 * requirements and mandatory rotation periods for the IAM user passwords in your account.
 * For more information about using a password policy, see Managing an IAM password
 * policy.
 */
export const getAccountPasswordPolicy: (
  input: GetAccountPasswordPolicyRequest,
) => effect.Effect<
  GetAccountPasswordPolicyResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountPasswordPolicyRequest,
  output: GetAccountPasswordPolicyResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves information about IAM entity usage and IAM quotas in the Amazon Web Services
 * account.
 *
 * For information about IAM quotas, see IAM and STS quotas in the
 * *IAM User Guide*.
 */
export const getAccountSummary: (
  input: GetAccountSummaryRequest,
) => effect.Effect<
  GetAccountSummaryResponse,
  ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSummaryRequest,
  output: GetAccountSummaryResponse,
  errors: [ServiceFailureException],
}));
/**
 * Gets a list of all of the context keys referenced in the input policies. The policies
 * are supplied as a list of one or more strings. To get the context keys from policies
 * associated with an IAM user, group, or role, use GetContextKeysForPrincipalPolicy.
 *
 * Context keys are variables maintained by Amazon Web Services and its services that provide details
 * about the context of an API query request. Context keys can be evaluated by testing
 * against a value specified in an IAM policy. Use
 * `GetContextKeysForCustomPolicy` to understand what key names and values
 * you must supply when you call SimulateCustomPolicy. Note that all parameters are shown in unencoded form
 * here for clarity but must be URL encoded to be included as a part of a real HTML
 * request.
 */
export const getContextKeysForCustomPolicy: (
  input: GetContextKeysForCustomPolicyRequest,
) => effect.Effect<
  GetContextKeysForPolicyResponse,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContextKeysForCustomPolicyRequest,
  output: GetContextKeysForPolicyResponse,
  errors: [InvalidInputException],
}));
/**
 * Returns a list of IAM users that are in the specified IAM group. You can paginate
 * the results using the `MaxItems` and `Marker` parameters.
 */
export const getGroup: {
  (
    input: GetGroupRequest,
  ): effect.Effect<
    GetGroupResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetGroupRequest,
  ) => stream.Stream<
    GetGroupResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetGroupRequest,
  ) => stream.Stream<
    User,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetGroupRequest,
  output: GetGroupResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Users",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Retrieves the specified inline policy document that is embedded in the specified IAM
 * group.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * An IAM group can also have managed policies attached to it. To retrieve a managed
 * policy document that is attached to a group, use GetPolicy to determine the
 * policy's default version, then use GetPolicyVersion to
 * retrieve the policy document.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const getGroupPolicy: (
  input: GetGroupPolicyRequest,
) => effect.Effect<
  GetGroupPolicyResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupPolicyRequest,
  output: GetGroupPolicyResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves a human readable summary for a given entity. At this time, the only supported
 * entity type is `delegation-request`
 *
 * This method uses a Large Language Model (LLM) to generate the summary.
 *
 * If a delegation request has no owner or owner account, `GetHumanReadableSummary` for that delegation request can be called by any account.
 * If the owner account is assigned but there is
 * no owner id, only identities within that owner account can call `GetHumanReadableSummary`
 * for the delegation request to retrieve a summary of that request.
 * Once the delegation request is fully owned, the owner of the request gets
 * a default permission to get that delegation request. For more details, read
 * default permissions granted to delegation requests. These rules are identical to
 * GetDelegationRequest
 * API behavior, such that a party who has permissions to call
 * GetDelegationRequest
 * for a given delegation request will always be able to retrieve the human readable summary for that request.
 */
export const getHumanReadableSummary: (
  input: GetHumanReadableSummaryRequest,
) => effect.Effect<
  GetHumanReadableSummaryResponse,
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHumanReadableSummaryRequest,
  output: GetHumanReadableSummaryResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves the user name for the specified IAM user. A login profile is created when
 * you create a password for the user to access the Amazon Web Services Management Console. If the user does not exist
 * or does not have a password, the operation returns a 404 (`NoSuchEntity`)
 * error.
 *
 * If you create an IAM user with access to the console, the `CreateDate`
 * reflects the date you created the initial password for the user.
 *
 * If you create an IAM user with programmatic access, and then later add a password
 * for the user to access the Amazon Web Services Management Console, the `CreateDate` reflects the initial
 * password creation date. A user with programmatic access does not have a login profile
 * unless you create a password for the user to access the Amazon Web Services Management Console.
 */
export const getLoginProfile: (
  input: GetLoginProfileRequest,
) => effect.Effect<
  GetLoginProfileResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoginProfileRequest,
  output: GetLoginProfileResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Returns information about the specified OpenID Connect (OIDC) provider resource object
 * in IAM.
 */
export const getOpenIDConnectProvider: (
  input: GetOpenIDConnectProviderRequest,
) => effect.Effect<
  GetOpenIDConnectProviderResponse,
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOpenIDConnectProviderRequest,
  output: GetOpenIDConnectProviderResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves information about the specified managed policy, including the policy's
 * default version and the total number of IAM users, groups, and roles to which the
 * policy is attached. To retrieve the list of the specific users, groups, and roles that
 * the policy is attached to, use ListEntitiesForPolicy. This operation returns metadata about the policy. To
 * retrieve the actual policy document for a specific version of the policy, use GetPolicyVersion.
 *
 * This operation retrieves information about managed policies. To retrieve information
 * about an inline policy that is embedded with an IAM user, group, or role, use GetUserPolicy, GetGroupPolicy, or
 * GetRolePolicy.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const getPolicy: (
  input: GetPolicyRequest,
) => effect.Effect<
  GetPolicyResponse,
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves information about the specified version of the specified managed policy,
 * including the policy document.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * To list the available versions for a policy, use ListPolicyVersions.
 *
 * This operation retrieves information about managed policies. To retrieve information
 * about an inline policy that is embedded in a user, group, or role, use GetUserPolicy, GetGroupPolicy, or
 * GetRolePolicy.
 *
 * For more information about the types of policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * For more information about managed policy versions, see Versioning for managed
 * policies in the *IAM User Guide*.
 */
export const getPolicyVersion: (
  input: GetPolicyVersionRequest,
) => effect.Effect<
  GetPolicyVersionResponse,
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyVersionRequest,
  output: GetPolicyVersionResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves information about the specified role, including the role's path, GUID, ARN,
 * and the role's trust policy that grants permission to assume the role. For more
 * information about roles, see IAM roles in the
 * *IAM User Guide*.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 */
export const getRole: (
  input: GetRoleRequest,
) => effect.Effect<
  GetRoleResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoleRequest,
  output: GetRoleResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves the specified inline policy document that is embedded with the specified
 * IAM role.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * An IAM role can also have managed policies attached to it. To retrieve a managed
 * policy document that is attached to a role, use GetPolicy to determine the
 * policy's default version, then use GetPolicyVersion to
 * retrieve the policy document.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * For more information about roles, see IAM roles in the
 * *IAM User Guide*.
 */
export const getRolePolicy: (
  input: GetRolePolicyRequest,
) => effect.Effect<
  GetRolePolicyResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRolePolicyRequest,
  output: GetRolePolicyResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves information about the specified IAM user, including the user's creation
 * date, path, unique ID, and ARN.
 *
 * If you do not specify a user name, IAM determines the user name implicitly based on
 * the Amazon Web Services access key ID used to sign the request to this operation.
 */
export const getUser: (
  input: GetUserRequest,
) => effect.Effect<
  GetUserResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserRequest,
  output: GetUserResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves the specified inline policy document that is embedded in the specified IAM
 * user.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * An IAM user can also have managed policies attached to it. To retrieve a managed
 * policy document that is attached to a user, use GetPolicy to determine the
 * policy's default version. Then use GetPolicyVersion to
 * retrieve the policy document.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const getUserPolicy: (
  input: GetUserPolicyRequest,
) => effect.Effect<
  GetUserPolicyResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserPolicyRequest,
  output: GetUserPolicyResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists the account alias associated with the Amazon Web Services account (Note: you can have only
 * one). For information about using an Amazon Web Services account alias, see Creating,
 * deleting, and listing an Amazon Web Services account alias in the
 * *IAM User Guide*.
 */
export const listAccountAliases: {
  (
    input: ListAccountAliasesRequest,
  ): effect.Effect<
    ListAccountAliasesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountAliasesRequest,
  ) => stream.Stream<
    ListAccountAliasesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountAliasesRequest,
  ) => stream.Stream<
    AccountAliasType,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountAliasesRequest,
  output: ListAccountAliasesResponse,
  errors: [ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "AccountAliases",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists all managed policies that are attached to the specified IAM role.
 *
 * An IAM role can also have inline policies embedded with it. To list the inline
 * policies for a role, use ListRolePolicies.
 * For information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. You can use the `PathPrefix` parameter to limit the list of
 * policies to only those matching the specified path prefix. If there are no policies
 * attached to the specified role (or none that match the specified path prefix), the
 * operation returns an empty list.
 */
export const listAttachedRolePolicies: {
  (
    input: ListAttachedRolePoliciesRequest,
  ): effect.Effect<
    ListAttachedRolePoliciesResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttachedRolePoliciesRequest,
  ) => stream.Stream<
    ListAttachedRolePoliciesResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttachedRolePoliciesRequest,
  ) => stream.Stream<
    AttachedPolicy,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttachedRolePoliciesRequest,
  output: ListAttachedRolePoliciesResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "AttachedPolicies",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists all managed policies that are attached to the specified IAM user.
 *
 * An IAM user can also have inline policies embedded with it. To list the inline
 * policies for a user, use ListUserPolicies.
 * For information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. You can use the `PathPrefix` parameter to limit the list of
 * policies to only those matching the specified path prefix. If there are no policies
 * attached to the specified group (or none that match the specified path prefix), the
 * operation returns an empty list.
 */
export const listAttachedUserPolicies: {
  (
    input: ListAttachedUserPoliciesRequest,
  ): effect.Effect<
    ListAttachedUserPoliciesResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttachedUserPoliciesRequest,
  ) => stream.Stream<
    ListAttachedUserPoliciesResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttachedUserPoliciesRequest,
  ) => stream.Stream<
    AttachedPolicy,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttachedUserPoliciesRequest,
  output: ListAttachedUserPoliciesResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "AttachedPolicies",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists delegation requests based on the specified criteria.
 *
 * If a delegation request has no owner, even if it is assigned to a specific account, it will not be part of the
 * `ListDelegationRequests` output for that account.
 *
 * For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const listDelegationRequests: (
  input: ListDelegationRequestsRequest,
) => effect.Effect<
  ListDelegationRequestsResponse,
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDelegationRequestsRequest,
  output: ListDelegationRequestsResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Lists the names of the inline policies that are embedded in the specified IAM
 * group.
 *
 * An IAM group can also have managed policies attached to it. To list the managed
 * policies that are attached to a group, use ListAttachedGroupPolicies. For more information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. If there are no inline policies embedded with the specified group, the
 * operation returns an empty list.
 */
export const listGroupPolicies: {
  (
    input: ListGroupPoliciesRequest,
  ): effect.Effect<
    ListGroupPoliciesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupPoliciesRequest,
  ) => stream.Stream<
    ListGroupPoliciesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupPoliciesRequest,
  ) => stream.Stream<
    PolicyNameType,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupPoliciesRequest,
  output: ListGroupPoliciesResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "PolicyNames",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the IAM groups that have the specified path prefix.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listGroups: {
  (
    input: ListGroupsRequest,
  ): effect.Effect<
    ListGroupsResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsRequest,
  ) => stream.Stream<
    ListGroupsResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsRequest,
  ) => stream.Stream<
    Group,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Groups",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the IAM groups that the specified IAM user belongs to.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listGroupsForUser: {
  (
    input: ListGroupsForUserRequest,
  ): effect.Effect<
    ListGroupsForUserResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsForUserRequest,
  ) => stream.Stream<
    ListGroupsForUserResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsForUserRequest,
  ) => stream.Stream<
    Group,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsForUserRequest,
  output: ListGroupsForUserResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Groups",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the instance profiles that have the specified path prefix. If there are none,
 * the operation returns an empty list. For more information about instance profiles, see
 * Using
 * instance profiles in the *IAM User Guide*.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for an instance profile, see
 * GetInstanceProfile.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listInstanceProfiles: {
  (
    input: ListInstanceProfilesRequest,
  ): effect.Effect<
    ListInstanceProfilesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstanceProfilesRequest,
  ) => stream.Stream<
    ListInstanceProfilesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstanceProfilesRequest,
  ) => stream.Stream<
    InstanceProfile,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInstanceProfilesRequest,
  output: ListInstanceProfilesResponse,
  errors: [ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "InstanceProfiles",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the instance profiles that have the specified associated IAM role. If there
 * are none, the operation returns an empty list. For more information about instance
 * profiles, go to Using
 * instance profiles in the *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listInstanceProfilesForRole: {
  (
    input: ListInstanceProfilesForRoleRequest,
  ): effect.Effect<
    ListInstanceProfilesForRoleResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstanceProfilesForRoleRequest,
  ) => stream.Stream<
    ListInstanceProfilesForRoleResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstanceProfilesForRoleRequest,
  ) => stream.Stream<
    InstanceProfile,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInstanceProfilesForRoleRequest,
  output: ListInstanceProfilesForRoleResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "InstanceProfiles",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the tags that are attached to the specified IAM instance profile. The returned list of tags is sorted by tag key.
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listInstanceProfileTags: {
  (
    input: ListInstanceProfileTagsRequest,
  ): effect.Effect<
    ListInstanceProfileTagsResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstanceProfileTagsRequest,
  ) => stream.Stream<
    ListInstanceProfileTagsResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstanceProfileTagsRequest,
  ) => stream.Stream<
    Tag,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInstanceProfileTagsRequest,
  output: ListInstanceProfileTagsResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tags",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the tags that are attached to the specified IAM virtual multi-factor authentication (MFA) device. The returned list of tags is
 * sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listMFADeviceTags: {
  (
    input: ListMFADeviceTagsRequest,
  ): effect.Effect<
    ListMFADeviceTagsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMFADeviceTagsRequest,
  ) => stream.Stream<
    ListMFADeviceTagsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMFADeviceTagsRequest,
  ) => stream.Stream<
    Tag,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMFADeviceTagsRequest,
  output: ListMFADeviceTagsResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tags",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists information about the IAM OpenID Connect (OIDC) provider resource objects
 * defined in the Amazon Web Services account.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for an OIDC provider, see GetOpenIDConnectProvider.
 */
export const listOpenIDConnectProviders: (
  input: ListOpenIDConnectProvidersRequest,
) => effect.Effect<
  ListOpenIDConnectProvidersResponse,
  ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOpenIDConnectProvidersRequest,
  output: ListOpenIDConnectProvidersResponse,
  errors: [ServiceFailureException],
}));
/**
 * Lists the tags that are attached to the specified OpenID Connect (OIDC)-compatible
 * identity provider. The returned list of tags is sorted by tag key. For more information, see About web identity
 * federation.
 *
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listOpenIDConnectProviderTags: {
  (
    input: ListOpenIDConnectProviderTagsRequest,
  ): effect.Effect<
    ListOpenIDConnectProviderTagsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOpenIDConnectProviderTagsRequest,
  ) => stream.Stream<
    ListOpenIDConnectProviderTagsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOpenIDConnectProviderTagsRequest,
  ) => stream.Stream<
    Tag,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOpenIDConnectProviderTagsRequest,
  output: ListOpenIDConnectProviderTagsResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tags",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists all the managed policies that are available in your Amazon Web Services account, including
 * your own customer-defined managed policies and all Amazon Web Services managed policies.
 *
 * You can filter the list of policies that is returned using the optional
 * `OnlyAttached`, `Scope`, and `PathPrefix`
 * parameters. For example, to list only the customer managed policies in your Amazon Web Services
 * account, set `Scope` to `Local`. To list only Amazon Web Services managed
 * policies, set `Scope` to `AWS`.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 *
 * For more information about managed policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a customer manged policy, see
 * GetPolicy.
 */
export const listPolicies: {
  (
    input: ListPoliciesRequest,
  ): effect.Effect<
    ListPoliciesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPoliciesRequest,
  ) => stream.Stream<
    ListPoliciesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPoliciesRequest,
  ) => stream.Stream<
    Policy,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Policies",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the tags that are attached to the specified IAM customer managed policy.
 * The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listPolicyTags: {
  (
    input: ListPolicyTagsRequest,
  ): effect.Effect<
    ListPolicyTagsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyTagsRequest,
  ) => stream.Stream<
    ListPolicyTagsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyTagsRequest,
  ) => stream.Stream<
    Tag,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPolicyTagsRequest,
  output: ListPolicyTagsResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tags",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists information about the versions of the specified managed policy, including the
 * version that is currently set as the policy's default version.
 *
 * For more information about managed policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const listPolicyVersions: {
  (
    input: ListPolicyVersionsRequest,
  ): effect.Effect<
    ListPolicyVersionsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyVersionsRequest,
  ) => stream.Stream<
    ListPolicyVersionsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyVersionsRequest,
  ) => stream.Stream<
    PolicyVersion,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPolicyVersionsRequest,
  output: ListPolicyVersionsResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Versions",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the names of the inline policies that are embedded in the specified IAM
 * role.
 *
 * An IAM role can also have managed policies attached to it. To list the managed
 * policies that are attached to a role, use ListAttachedRolePolicies. For more information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. If there are no inline policies embedded with the specified role, the
 * operation returns an empty list.
 */
export const listRolePolicies: {
  (
    input: ListRolePoliciesRequest,
  ): effect.Effect<
    ListRolePoliciesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRolePoliciesRequest,
  ) => stream.Stream<
    ListRolePoliciesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRolePoliciesRequest,
  ) => stream.Stream<
    PolicyNameType,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRolePoliciesRequest,
  output: ListRolePoliciesResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "PolicyNames",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the IAM roles that have the specified path prefix. If there are none, the
 * operation returns an empty list. For more information about roles, see IAM roles in the
 * *IAM User Guide*.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. This operation does not return the following attributes, even though they are an attribute of the returned object:
 *
 * - PermissionsBoundary
 *
 * - RoleLastUsed
 *
 * - Tags
 *
 * To view all of the information for a role, see GetRole.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listRoles: {
  (
    input: ListRolesRequest,
  ): effect.Effect<
    ListRolesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRolesRequest,
  ) => stream.Stream<
    ListRolesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRolesRequest,
  ) => stream.Stream<
    Role,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRolesRequest,
  output: ListRolesResponse,
  errors: [ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Roles",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the tags that are attached to the specified role. The returned list of tags is
 * sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listRoleTags: {
  (
    input: ListRoleTagsRequest,
  ): effect.Effect<
    ListRoleTagsResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoleTagsRequest,
  ) => stream.Stream<
    ListRoleTagsResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRoleTagsRequest,
  ) => stream.Stream<
    Tag,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoleTagsRequest,
  output: ListRoleTagsResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tags",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the SAML provider resource objects defined in IAM in the account.
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a SAML provider, see GetSAMLProvider.
 *
 * This operation requires Signature Version 4.
 */
export const listSAMLProviders: (
  input: ListSAMLProvidersRequest,
) => effect.Effect<
  ListSAMLProvidersResponse,
  ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSAMLProvidersRequest,
  output: ListSAMLProvidersResponse,
  errors: [ServiceFailureException],
}));
/**
 * Lists the tags that are attached to the specified Security Assertion Markup Language
 * (SAML) identity provider. The returned list of tags is sorted by tag key. For more information, see About SAML 2.0-based
 * federation.
 *
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listSAMLProviderTags: {
  (
    input: ListSAMLProviderTagsRequest,
  ): effect.Effect<
    ListSAMLProviderTagsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSAMLProviderTagsRequest,
  ) => stream.Stream<
    ListSAMLProviderTagsResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSAMLProviderTagsRequest,
  ) => stream.Stream<
    Tag,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSAMLProviderTagsRequest,
  output: ListSAMLProviderTagsResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tags",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the tags that are attached to the specified IAM server certificate. The
 * returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * For certificates in a Region supported by Certificate Manager (ACM), we
 * recommend that you don't use IAM server certificates. Instead, use ACM to provision,
 * manage, and deploy your server certificates. For more information about IAM server
 * certificates, Working with server
 * certificates in the *IAM User Guide*.
 */
export const listServerCertificateTags: {
  (
    input: ListServerCertificateTagsRequest,
  ): effect.Effect<
    ListServerCertificateTagsResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServerCertificateTagsRequest,
  ) => stream.Stream<
    ListServerCertificateTagsResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServerCertificateTagsRequest,
  ) => stream.Stream<
    Tag,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServerCertificateTagsRequest,
  output: ListServerCertificateTagsResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tags",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the names of the inline policies embedded in the specified IAM user.
 *
 * An IAM user can also have managed policies attached to it. To list the managed
 * policies that are attached to a user, use ListAttachedUserPolicies. For more information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. If there are no inline policies embedded with the specified user, the
 * operation returns an empty list.
 */
export const listUserPolicies: {
  (
    input: ListUserPoliciesRequest,
  ): effect.Effect<
    ListUserPoliciesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUserPoliciesRequest,
  ) => stream.Stream<
    ListUserPoliciesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUserPoliciesRequest,
  ) => stream.Stream<
    PolicyNameType,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUserPoliciesRequest,
  output: ListUserPoliciesResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "PolicyNames",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the IAM users that have the specified path prefix. If no path prefix is
 * specified, the operation returns all users in the Amazon Web Services account. If there are none, the
 * operation returns an empty list.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. This operation does not return the following attributes, even though they are an attribute of the returned object:
 *
 * - PermissionsBoundary
 *
 * - Tags
 *
 * To view all of the information for a user, see GetUser.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listUsers: {
  (
    input: ListUsersRequest,
  ): effect.Effect<
    ListUsersResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsersRequest,
  ) => stream.Stream<
    ListUsersResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsersRequest,
  ) => stream.Stream<
    User,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Users",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the tags that are attached to the specified IAM user. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listUserTags: {
  (
    input: ListUserTagsRequest,
  ): effect.Effect<
    ListUserTagsResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUserTagsRequest,
  ) => stream.Stream<
    ListUserTagsResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUserTagsRequest,
  ) => stream.Stream<
    Tag,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUserTagsRequest,
  output: ListUserTagsResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tags",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the virtual MFA devices defined in the Amazon Web Services account by assignment status. If
 * you do not specify an assignment status, the operation returns a list of all virtual MFA
 * devices. Assignment status can be `Assigned`, `Unassigned`, or
 * `Any`.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view tag information for a virtual MFA device, see ListMFADeviceTags.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listVirtualMFADevices: {
  (
    input: ListVirtualMFADevicesRequest,
  ): effect.Effect<
    ListVirtualMFADevicesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVirtualMFADevicesRequest,
  ) => stream.Stream<
    ListVirtualMFADevicesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVirtualMFADevicesRequest,
  ) => stream.Stream<
    VirtualMFADevice,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVirtualMFADevicesRequest,
  output: ListVirtualMFADevicesResponse,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "VirtualMFADevices",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Adds or updates an inline policy document that is embedded in the specified IAM
 * group.
 *
 * A user can also have managed policies attached to it. To attach a managed policy to a
 * group, use
 * `AttachGroupPolicy`
 * . To create a new managed policy, use
 *
 * `CreatePolicy`
 * . For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * For information about the maximum number of inline policies that you can embed in a
 * group, see IAM and STS quotas in the *IAM User Guide*.
 *
 * Because policy documents can be large, you should use POST rather than GET when
 * calling `PutGroupPolicy`. For general information about using the Query
 * API with IAM, see Making query requests in the
 * *IAM User Guide*.
 */
export const putGroupPolicy: (
  input: PutGroupPolicyRequest,
) => effect.Effect<
  PutGroupPolicyResponse,
  | LimitExceededException
  | MalformedPolicyDocumentException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutGroupPolicyRequest,
  output: PutGroupPolicyResponse,
  errors: [
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Resets the password for a service-specific credential. The new password is Amazon Web Services
 * generated and cryptographically strong. It cannot be configured by the user. Resetting
 * the password immediately invalidates the previous password associated with this
 * user.
 */
export const resetServiceSpecificCredential: (
  input: ResetServiceSpecificCredentialRequest,
) => effect.Effect<
  ResetServiceSpecificCredentialResponse,
  NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetServiceSpecificCredentialRequest,
  output: ResetServiceSpecificCredentialResponse,
  errors: [NoSuchEntityException],
}));
/**
 * Updates the metadata document, SAML encryption settings, and private keys for an
 * existing SAML provider. To rotate private keys, add your new private key and then remove
 * the old key in a separate request.
 */
export const updateSAMLProvider: (
  input: UpdateSAMLProviderRequest,
) => effect.Effect<
  UpdateSAMLProviderResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSAMLProviderRequest,
  output: UpdateSAMLProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds a new client ID (also known as audience) to the list of client IDs already
 * registered for the specified IAM OpenID Connect (OIDC) provider resource.
 *
 * This operation is idempotent; it does not fail or return an error if you add an
 * existing client ID to the provider.
 */
export const addClientIDToOpenIDConnectProvider: (
  input: AddClientIDToOpenIDConnectProviderRequest,
) => effect.Effect<
  AddClientIDToOpenIDConnectProviderResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddClientIDToOpenIDConnectProviderRequest,
  output: AddClientIDToOpenIDConnectProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Associates a delegation request with the current identity.
 *
 * If the partner that created the delegation request has specified the owner account during creation,
 * only an identity from that owner account can call the `AssociateDelegationRequest` API for
 * the specified delegation request. Once the `AssociateDelegationRequest` API call is successful,
 * the ARN of the current calling identity will be stored as the
 * `ownerId`
 * of the request.
 *
 * If the partner that created the delegation request has not specified the owner account during creation,
 * any caller from any account can call the `AssociateDelegationRequest` API for
 * the delegation request. Once this API call is successful, the ARN of the current calling identity will be stored as the
 * `ownerId`
 * and the Amazon Web Services account ID of the current calling identity will be stored as the
 * `ownerAccount`
 * of the request.
 *
 * For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const associateDelegationRequest: (
  input: AssociateDelegationRequestRequest,
) => effect.Effect<
  AssociateDelegationRequestResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateDelegationRequestRequest,
  output: AssociateDelegationRequestResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates an alias for your Amazon Web Services account. For information about using an Amazon Web Services account
 * alias, see Creating, deleting, and
 * listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User
 * Guide.
 */
export const createAccountAlias: (
  input: CreateAccountAliasRequest,
) => effect.Effect<
  CreateAccountAliasResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | LimitExceededException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccountAliasRequest,
  output: CreateAccountAliasResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    LimitExceededException,
    ServiceFailureException,
  ],
}));
/**
 * Deactivates the specified MFA device and removes it from association with the user
 * name for which it was originally enabled.
 *
 * For more information about creating and working with virtual MFA devices, see Enabling a virtual
 * multi-factor authentication (MFA) device in the
 * *IAM User Guide*.
 */
export const deactivateMFADevice: (
  input: DeactivateMFADeviceRequest,
) => effect.Effect<
  DeactivateMFADeviceResponse,
  | ConcurrentModificationException
  | EntityTemporarilyUnmodifiableException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateMFADeviceRequest,
  output: DeactivateMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    EntityTemporarilyUnmodifiableException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified Amazon Web Services account alias. For information about using an Amazon Web Services
 * account alias, see Creating, deleting, and
 * listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User
 * Guide.
 */
export const deleteAccountAlias: (
  input: DeleteAccountAliasRequest,
) => effect.Effect<
  DeleteAccountAliasResponse,
  | ConcurrentModificationException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountAliasRequest,
  output: DeleteAccountAliasResponse,
  errors: [
    ConcurrentModificationException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes a signing certificate associated with the specified IAM user.
 *
 * If you do not specify a user name, IAM determines the user name implicitly based on
 * the Amazon Web Services access key ID signing the request. This operation works for access keys under
 * the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root
 * user credentials even if the Amazon Web Services account has no associated IAM users.
 */
export const deleteSigningCertificate: (
  input: DeleteSigningCertificateRequest,
) => effect.Effect<
  DeleteSigningCertificateResponse,
  | ConcurrentModificationException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSigningCertificateRequest,
  output: DeleteSigningCertificateResponse,
  errors: [
    ConcurrentModificationException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified IAM user. Unlike the Amazon Web Services Management Console, when you delete a user
 * programmatically, you must delete the items attached to the user manually, or the
 * deletion fails. For more information, see Deleting an IAM
 * user. Before attempting to delete a user, remove the following items:
 *
 * - Password (DeleteLoginProfile)
 *
 * - Access keys (DeleteAccessKey)
 *
 * - Signing certificate (DeleteSigningCertificate)
 *
 * - SSH public key (DeleteSSHPublicKey)
 *
 * - Git credentials (DeleteServiceSpecificCredential)
 *
 * - Multi-factor authentication (MFA) device (DeactivateMFADevice, DeleteVirtualMFADevice)
 *
 * - Inline policies (DeleteUserPolicy)
 *
 * - Attached managed policies (DetachUserPolicy)
 *
 * - Group memberships (RemoveUserFromGroup)
 */
export const deleteUser: (
  input: DeleteUserRequest,
) => effect.Effect<
  DeleteUserResponse,
  | ConcurrentModificationException
  | DeleteConflictException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    ConcurrentModificationException,
    DeleteConflictException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes a virtual MFA device.
 *
 * You must deactivate a user's virtual MFA device before you can delete it. For
 * information about deactivating MFA devices, see DeactivateMFADevice.
 */
export const deleteVirtualMFADevice: (
  input: DeleteVirtualMFADeviceRequest,
) => effect.Effect<
  DeleteVirtualMFADeviceResponse,
  | ConcurrentModificationException
  | DeleteConflictException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVirtualMFADeviceRequest,
  output: DeleteVirtualMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    DeleteConflictException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Rejects a delegation request, denying the requested temporary access.
 *
 * Once a request is rejected, it cannot be accepted or updated later. Rejected requests expire after 7 days.
 *
 * When rejecting a request, an optional explanation can be added using the `Notes` request parameter.
 *
 * For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const rejectDelegationRequest: (
  input: RejectDelegationRequestRequest,
) => effect.Effect<
  RejectDelegationRequestResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectDelegationRequestRequest,
  output: RejectDelegationRequestResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified client ID (also known as audience) from the list of client IDs
 * registered for the specified IAM OpenID Connect (OIDC) provider resource
 * object.
 *
 * This operation is idempotent; it does not fail or return an error if you try to remove
 * a client ID that does not exist.
 */
export const removeClientIDFromOpenIDConnectProvider: (
  input: RemoveClientIDFromOpenIDConnectProviderRequest,
) => effect.Effect<
  RemoveClientIDFromOpenIDConnectProviderResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveClientIDFromOpenIDConnectProviderRequest,
  output: RemoveClientIDFromOpenIDConnectProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Sends the exchange token for an accepted delegation request.
 *
 * The exchange token is sent to the partner via an asynchronous notification channel, established by the partner.
 *
 * The delegation request must be in the `ACCEPTED` state when calling this API. After the
 * `SendDelegationToken` API
 * call is successful, the request transitions to a `FINALIZED` state and cannot be rolled back. However, a user may reject
 * an accepted request before the `SendDelegationToken` API is called.
 *
 * For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const sendDelegationToken: (
  input: SendDelegationTokenRequest,
) => effect.Effect<
  SendDelegationTokenResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendDelegationTokenRequest,
  output: SendDelegationTokenResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an IAM instance profile. If a tag with the same key name
 * already exists, then that tag is overwritten with the new value.
 *
 * Each tag consists of a key name and an associated value. By assigning tags to your resources, you can do the
 * following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only an IAM instance
 * profile that has a specified tag attached. For examples of policies that show how to use
 * tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagInstanceProfile: (
  input: TagInstanceProfileRequest,
) => effect.Effect<
  TagInstanceProfileResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagInstanceProfileRequest,
  output: TagInstanceProfileResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an IAM virtual multi-factor authentication (MFA) device. If
 * a tag with the same key name already exists, then that tag is overwritten with the new
 * value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only an IAM virtual
 * MFA device that has a specified tag attached. For examples of policies that show how to
 * use tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagMFADevice: (
  input: TagMFADeviceRequest,
) => effect.Effect<
  TagMFADeviceResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagMFADeviceRequest,
  output: TagMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an OpenID Connect (OIDC)-compatible identity provider. For
 * more information about these providers, see About web identity federation. If
 * a tag with the same key name already exists, then that tag is overwritten with the new
 * value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM identity-based
 * and resource-based policies. You can use tags to restrict access to only an OIDC provider
 * that has a specified tag attached. For examples of policies that show how to use tags to
 * control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagOpenIDConnectProvider: (
  input: TagOpenIDConnectProviderRequest,
) => effect.Effect<
  TagOpenIDConnectProviderResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagOpenIDConnectProviderRequest,
  output: TagOpenIDConnectProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an IAM customer managed policy. If a tag with the same key
 * name already exists, then that tag is overwritten with the new value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only an IAM customer
 * managed policy that has a specified tag attached. For examples of policies that show how
 * to use tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagPolicy: (
  input: TagPolicyRequest,
) => effect.Effect<
  TagPolicyResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagPolicyRequest,
  output: TagPolicyResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an IAM role. The role can be a regular role or a
 * service-linked role. If a tag with the same key name already exists, then that tag is
 * overwritten with the new value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only an IAM role
 * that has a specified tag attached. You can also restrict access to only those resources
 * that have a certain tag attached. For examples of policies that show how to use tags to
 * control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - **Cost allocation** - Use tags to help track which
 * individuals and teams are using which Amazon Web Services resources.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 *
 * For more information about tagging, see Tagging IAM identities in the
 * *IAM User Guide*.
 */
export const tagRole: (
  input: TagRoleRequest,
) => effect.Effect<
  TagRoleResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagRoleRequest,
  output: TagRoleResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to a Security Assertion Markup Language (SAML) identity provider.
 * For more information about these providers, see About SAML 2.0-based federation .
 * If a tag with the same key name already exists, then that tag is overwritten with the new
 * value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only a SAML identity
 * provider that has a specified tag attached. For examples of policies that show how to use
 * tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagSAMLProvider: (
  input: TagSAMLProviderRequest,
) => effect.Effect<
  TagSAMLProviderResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagSAMLProviderRequest,
  output: TagSAMLProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an IAM server certificate. If a tag with the same key name
 * already exists, then that tag is overwritten with the new value.
 *
 * For certificates in a Region supported by Certificate Manager (ACM), we
 * recommend that you don't use IAM server certificates. Instead, use ACM to provision,
 * manage, and deploy your server certificates. For more information about IAM server
 * certificates, Working with server
 * certificates in the *IAM User Guide*.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only a server
 * certificate that has a specified tag attached. For examples of policies that show how to
 * use tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - **Cost allocation** - Use tags to help track which
 * individuals and teams are using which Amazon Web Services resources.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagServerCertificate: (
  input: TagServerCertificateRequest,
) => effect.Effect<
  TagServerCertificateResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagServerCertificateRequest,
  output: TagServerCertificateResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an IAM user. If a tag with the same key name already exists,
 * then that tag is overwritten with the new value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM identity-based
 * and resource-based policies. You can use tags to restrict access to only an IAM
 * requesting user that has a specified tag attached. You can also restrict access to only
 * those resources that have a certain tag attached. For examples of policies that show how
 * to use tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - **Cost allocation** - Use tags to help track which
 * individuals and teams are using which Amazon Web Services resources.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 *
 * For more information about tagging, see Tagging IAM identities in the
 * *IAM User Guide*.
 */
export const tagUser: (
  input: TagUserRequest,
) => effect.Effect<
  TagUserResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagUserRequest,
  output: TagUserResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the IAM instance profile. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagInstanceProfile: (
  input: UntagInstanceProfileRequest,
) => effect.Effect<
  UntagInstanceProfileResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagInstanceProfileRequest,
  output: UntagInstanceProfileResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the IAM virtual multi-factor authentication (MFA)
 * device. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagMFADevice: (
  input: UntagMFADeviceRequest,
) => effect.Effect<
  UntagMFADeviceResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagMFADeviceRequest,
  output: UntagMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the specified OpenID Connect (OIDC)-compatible identity
 * provider in IAM. For more information about OIDC providers, see About web identity federation.
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagOpenIDConnectProvider: (
  input: UntagOpenIDConnectProviderRequest,
) => effect.Effect<
  UntagOpenIDConnectProviderResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagOpenIDConnectProviderRequest,
  output: UntagOpenIDConnectProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the customer managed policy. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagPolicy: (
  input: UntagPolicyRequest,
) => effect.Effect<
  UntagPolicyResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagPolicyRequest,
  output: UntagPolicyResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the role. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagRole: (
  input: UntagRoleRequest,
) => effect.Effect<
  UntagRoleResponse,
  | ConcurrentModificationException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagRoleRequest,
  output: UntagRoleResponse,
  errors: [
    ConcurrentModificationException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the specified Security Assertion Markup Language (SAML)
 * identity provider in IAM. For more information about these providers, see About web identity
 * federation. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagSAMLProvider: (
  input: UntagSAMLProviderRequest,
) => effect.Effect<
  UntagSAMLProviderResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagSAMLProviderRequest,
  output: UntagSAMLProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the IAM server certificate.
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * For certificates in a Region supported by Certificate Manager (ACM), we
 * recommend that you don't use IAM server certificates. Instead, use ACM to provision,
 * manage, and deploy your server certificates. For more information about IAM server
 * certificates, Working with server
 * certificates in the *IAM User Guide*.
 */
export const untagServerCertificate: (
  input: UntagServerCertificateRequest,
) => effect.Effect<
  UntagServerCertificateResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagServerCertificateRequest,
  output: UntagServerCertificateResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the user. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagUser: (
  input: UntagUserRequest,
) => effect.Effect<
  UntagUserResponse,
  | ConcurrentModificationException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagUserRequest,
  output: UntagUserResponse,
  errors: [
    ConcurrentModificationException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Updates an existing delegation request with additional information. When the delegation
 * request is updated, it reaches the `PENDING_APPROVAL` state.
 *
 * Once a delegation request has an owner, that owner gets a default permission to update the
 * delegation request. For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const updateDelegationRequest: (
  input: UpdateDelegationRequestRequest,
) => effect.Effect<
  UpdateDelegationRequestResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDelegationRequestRequest,
  output: UpdateDelegationRequestResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Replaces the existing list of server certificate thumbprints associated with an OpenID
 * Connect (OIDC) provider resource object with a new list of thumbprints.
 *
 * The list that you pass with this operation completely replaces the existing list of
 * thumbprints. (The lists are not merged.)
 *
 * Typically, you need to update a thumbprint only when the identity provider certificate
 * changes, which occurs rarely. However, if the provider's certificate
 * *does* change, any attempt to assume an IAM role that specifies
 * the OIDC provider as a principal fails until the certificate thumbprint is
 * updated.
 *
 * Amazon Web Services secures communication with OIDC identity providers (IdPs) using our library of
 * trusted root certificate authorities (CAs) to verify the JSON Web Key Set (JWKS)
 * endpoint's TLS certificate. If your OIDC IdP relies on a certificate that is not signed
 * by one of these trusted CAs, only then we secure communication using the thumbprints set
 * in the IdP's configuration.
 *
 * Trust for the OIDC provider is derived from the provider certificate and is
 * validated by the thumbprint. Therefore, it is best to limit access to the
 * `UpdateOpenIDConnectProviderThumbprint` operation to highly
 * privileged users.
 */
export const updateOpenIDConnectProviderThumbprint: (
  input: UpdateOpenIDConnectProviderThumbprintRequest,
) => effect.Effect<
  UpdateOpenIDConnectProviderThumbprintResponse,
  | ConcurrentModificationException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOpenIDConnectProviderThumbprintRequest,
  output: UpdateOpenIDConnectProviderThumbprintResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Updates the name and/or the path of the specified IAM user.
 *
 * You should understand the implications of changing an IAM user's path or
 * name. For more information, see Renaming an IAM
 * user and Renaming an IAM
 * group in the *IAM User Guide*.
 *
 * To change a user name, the requester must have appropriate permissions on both
 * the source object and the target object. For example, to change Bob to Robert, the
 * entity making the request must have permission on Bob and Robert, or must have
 * permission on all (*). For more information about permissions, see Permissions and policies.
 */
export const updateUser: (
  input: UpdateUserRequest,
) => effect.Effect<
  UpdateUserResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | EntityTemporarilyUnmodifiableException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    EntityTemporarilyUnmodifiableException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Updates the name and/or the path of the specified IAM group.
 *
 * You should understand the implications of changing a group's path or name. For
 * more information, see Renaming users and
 * groups in the *IAM User Guide*.
 *
 * The person making the request (the principal), must have permission to change the
 * role group with the old name and the new name. For example, to change the group
 * named `Managers` to `MGRs`, the principal must have a policy
 * that allows them to update both groups. If the principal has permission to update
 * the `Managers` group, but not the `MGRs` group, then the
 * update fails. For more information about permissions, see Access management.
 */
export const updateGroup: (
  input: UpdateGroupRequest,
) => effect.Effect<
  UpdateGroupResponse,
  | EntityAlreadyExistsException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResponse,
  errors: [
    EntityAlreadyExistsException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Updates the name and/or the path of the specified server certificate stored in
 * IAM.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic also includes a list of Amazon Web Services services that can use the server certificates that
 * you manage with IAM.
 *
 * You should understand the implications of changing a server certificate's path or
 * name. For more information, see Renaming a server certificate in the
 * *IAM User Guide*.
 *
 * The person making the request (the principal), must have permission to change the
 * server certificate with the old name and the new name. For example, to change the
 * certificate named `ProductionCert` to `ProdCert`, the
 * principal must have a policy that allows them to update both certificates. If the
 * principal has permission to update the `ProductionCert` group, but not
 * the `ProdCert` certificate, then the update fails. For more information
 * about permissions, see Access management in the *IAM User Guide*.
 */
export const updateServerCertificate: (
  input: UpdateServerCertificateRequest,
) => effect.Effect<
  UpdateServerCertificateResponse,
  | EntityAlreadyExistsException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServerCertificateRequest,
  output: UpdateServerCertificateResponse,
  errors: [
    EntityAlreadyExistsException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes an OpenID Connect identity provider (IdP) resource object in IAM.
 *
 * Deleting an IAM OIDC provider resource does not update any roles that reference the
 * provider as a principal in their trust policies. Any attempt to assume a role that
 * references a deleted provider fails.
 *
 * This operation is idempotent; it does not fail or return an error if you call the
 * operation for a provider that does not exist.
 */
export const deleteOpenIDConnectProvider: (
  input: DeleteOpenIDConnectProviderRequest,
) => effect.Effect<
  DeleteOpenIDConnectProviderResponse,
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOpenIDConnectProviderRequest,
  output: DeleteOpenIDConnectProviderResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes a SAML provider resource in IAM.
 *
 * Deleting the provider resource from IAM does not update any roles that reference the
 * SAML provider resource's ARN as a principal in their trust policies. Any attempt to
 * assume a role that references a non-existent provider resource ARN fails.
 *
 * This operation requires Signature Version 4.
 */
export const deleteSAMLProvider: (
  input: DeleteSAMLProviderRequest,
) => effect.Effect<
  DeleteSAMLProviderResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSAMLProviderRequest,
  output: DeleteSAMLProviderResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified managed policy from the specified IAM group.
 *
 * A group can also have inline policies embedded with it. To delete an inline policy,
 * use DeleteGroupPolicy. For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 */
export const detachGroupPolicy: (
  input: DetachGroupPolicyRequest,
) => effect.Effect<
  DetachGroupPolicyResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachGroupPolicyRequest,
  output: DetachGroupPolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified managed policy from the specified user.
 *
 * A user can also have inline policies embedded with it. To delete an inline policy, use
 * DeleteUserPolicy. For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 */
export const detachUserPolicy: (
  input: DetachUserPolicyRequest,
) => effect.Effect<
  DetachUserPolicyResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachUserPolicyRequest,
  output: DetachUserPolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Gets a list of all of the context keys referenced in all the IAM policies that are
 * attached to the specified IAM entity. The entity can be an IAM user, group, or role.
 * If you specify a user, then the request also includes all of the policies attached to
 * groups that the user is a member of.
 *
 * You can optionally include a list of one or more additional policies, specified as
 * strings. If you want to include *only* a list of policies by string,
 * use GetContextKeysForCustomPolicy instead.
 *
 * **Note:** This operation discloses information about the
 * permissions granted to other users. If you do not want users to see other user's
 * permissions, then consider allowing them to use GetContextKeysForCustomPolicy instead.
 *
 * Context keys are variables maintained by Amazon Web Services and its services that provide details
 * about the context of an API query request. Context keys can be evaluated by testing
 * against a value in an IAM policy. Use GetContextKeysForPrincipalPolicy to understand what key names and values
 * you must supply when you call SimulatePrincipalPolicy.
 */
export const getContextKeysForPrincipalPolicy: (
  input: GetContextKeysForPrincipalPolicyRequest,
) => effect.Effect<
  GetContextKeysForPolicyResponse,
  InvalidInputException | NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContextKeysForPrincipalPolicyRequest,
  output: GetContextKeysForPolicyResponse,
  errors: [InvalidInputException, NoSuchEntityException],
}));
/**
 * Sets the specified version of the specified policy as the policy's default (operative)
 * version.
 *
 * This operation affects all users, groups, and roles that the policy is attached to. To
 * list the users, groups, and roles that the policy is attached to, use ListEntitiesForPolicy.
 *
 * For information about managed policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const setDefaultPolicyVersion: (
  input: SetDefaultPolicyVersionRequest,
) => effect.Effect<
  SetDefaultPolicyVersionResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetDefaultPolicyVersionRequest,
  output: SetDefaultPolicyVersionResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Changes the status of the specified access key from Active to Inactive, or vice versa.
 * This operation can be used to disable a user's key as part of a key rotation
 * workflow.
 *
 * If the `UserName` is not specified, the user name is determined implicitly
 * based on the Amazon Web Services access key ID used to sign the request. If a temporary access key is
 * used, then `UserName` is required. If a long-term key is assigned to the
 * user, then `UserName` is not required. This operation works for access keys
 * under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user
 * credentials even if the Amazon Web Services account has no associated users.
 *
 * For information about rotating keys, see Managing keys and certificates
 * in the *IAM User Guide*.
 */
export const updateAccessKey: (
  input: UpdateAccessKeyRequest,
) => effect.Effect<
  UpdateAccessKeyResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessKeyRequest,
  output: UpdateAccessKeyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Changes the status of the specified user signing certificate from active to disabled,
 * or vice versa. This operation can be used to disable an IAM user's signing
 * certificate as part of a certificate rotation work flow.
 *
 * If the `UserName` field is not specified, the user name is determined
 * implicitly based on the Amazon Web Services access key ID used to sign the request. This operation
 * works for access keys under the Amazon Web Services account. Consequently, you can use this operation
 * to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated
 * users.
 */
export const updateSigningCertificate: (
  input: UpdateSigningCertificateRequest,
) => effect.Effect<
  UpdateSigningCertificateResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSigningCertificateRequest,
  output: UpdateSigningCertificateResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Sets the status of an IAM user's SSH public key to active or inactive. SSH public
 * keys that are inactive cannot be used for authentication. This operation can be used to
 * disable a user's SSH public key as part of a key rotation work flow.
 *
 * The SSH public key affected by this operation is used only for authenticating the
 * associated IAM user to an CodeCommit repository. For more information about using SSH keys
 * to authenticate to an CodeCommit repository, see Set up CodeCommit for
 * SSH connections in the *CodeCommit User Guide*.
 */
export const updateSSHPublicKey: (
  input: UpdateSSHPublicKeyRequest,
) => effect.Effect<
  UpdateSSHPublicKeyResponse,
  InvalidInputException | NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSSHPublicKeyRequest,
  output: UpdateSSHPublicKeyResponse,
  errors: [InvalidInputException, NoSuchEntityException],
}));
/**
 * Deletes the password for the specified IAM user or root user, For more information, see
 * Managing
 * passwords for IAM users.
 *
 * You can use the CLI, the Amazon Web Services API, or the **Users**
 * page in the IAM console to delete a password for any IAM user. You can use ChangePassword to update, but not delete, your own password in the
 * **My Security Credentials** page in the
 * Amazon Web Services Management Console.
 *
 * Deleting a user's password does not prevent a user from accessing Amazon Web Services through
 * the command line interface or the API. To prevent all user access, you must also
 * either make any access keys inactive or delete them. For more information about
 * making keys inactive or deleting them, see UpdateAccessKey
 * and DeleteAccessKey.
 */
export const deleteLoginProfile: (
  input: DeleteLoginProfileRequest,
) => effect.Effect<
  DeleteLoginProfileResponse,
  | EntityTemporarilyUnmodifiableException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoginProfileRequest,
  output: DeleteLoginProfileResponse,
  errors: [
    EntityTemporarilyUnmodifiableException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified inline policy that is embedded in the specified IAM
 * group.
 *
 * A group can also have managed policies attached to it. To detach a managed policy from
 * a group, use DetachGroupPolicy.
 * For more information about policies, refer to Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const deleteGroupPolicy: (
  input: DeleteGroupPolicyRequest,
) => effect.Effect<
  DeleteGroupPolicyResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupPolicyRequest,
  output: DeleteGroupPolicyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified service-specific credential.
 */
export const deleteServiceSpecificCredential: (
  input: DeleteServiceSpecificCredentialRequest,
) => effect.Effect<
  DeleteServiceSpecificCredentialResponse,
  NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceSpecificCredentialRequest,
  output: DeleteServiceSpecificCredentialResponse,
  errors: [NoSuchEntityException],
}));
/**
 * Deletes the specified SSH public key.
 *
 * The SSH public key deleted by this operation is used only for authenticating the
 * associated IAM user to an CodeCommit repository. For more information about using SSH keys
 * to authenticate to an CodeCommit repository, see Set up CodeCommit for
 * SSH connections in the *CodeCommit User Guide*.
 */
export const deleteSSHPublicKey: (
  input: DeleteSSHPublicKeyRequest,
) => effect.Effect<
  DeleteSSHPublicKeyResponse,
  NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSSHPublicKeyRequest,
  output: DeleteSSHPublicKeyResponse,
  errors: [NoSuchEntityException],
}));
/**
 * Deletes the permissions boundary for the specified IAM user.
 *
 * Deleting the permissions boundary for a user might increase its permissions by
 * allowing the user to perform all the actions granted in its permissions policies.
 */
export const deleteUserPermissionsBoundary: (
  input: DeleteUserPermissionsBoundaryRequest,
) => effect.Effect<
  DeleteUserPermissionsBoundaryResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserPermissionsBoundaryRequest,
  output: DeleteUserPermissionsBoundaryResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Deletes the specified inline policy that is embedded in the specified IAM
 * user.
 *
 * A user can also have managed policies attached to it. To detach a managed policy from
 * a user, use DetachUserPolicy.
 * For more information about policies, refer to Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const deleteUserPolicy: (
  input: DeleteUserPolicyRequest,
) => effect.Effect<
  DeleteUserPolicyResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserPolicyRequest,
  output: DeleteUserPolicyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified user from the specified group.
 */
export const removeUserFromGroup: (
  input: RemoveUserFromGroupRequest,
) => effect.Effect<
  RemoveUserFromGroupResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveUserFromGroupRequest,
  output: RemoveUserFromGroupResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Sets the status of a service-specific credential to `Active` or
 * `Inactive`. Service-specific credentials that are inactive cannot be used
 * for authentication to the service. This operation can be used to disable a user's
 * service-specific credential as part of a credential rotation work flow.
 */
export const updateServiceSpecificCredential: (
  input: UpdateServiceSpecificCredentialRequest,
) => effect.Effect<
  UpdateServiceSpecificCredentialResponse,
  NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceSpecificCredentialRequest,
  output: UpdateServiceSpecificCredentialResponse,
  errors: [NoSuchEntityException],
}));
/**
 * Adds the specified user to the specified group.
 */
export const addUserToGroup: (
  input: AddUserToGroupRequest,
) => effect.Effect<
  AddUserToGroupResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddUserToGroupRequest,
  output: AddUserToGroupResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the access key pair associated with the specified IAM user.
 *
 * If you do not specify a user name, IAM determines the user name implicitly based on
 * the Amazon Web Services access key ID signing the request. This operation works for access keys under
 * the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root
 * user credentials even if the Amazon Web Services account has no associated users.
 */
export const deleteAccessKey: (
  input: DeleteAccessKeyRequest,
) => effect.Effect<
  DeleteAccessKeyResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessKeyRequest,
  output: DeleteAccessKeyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Accepts a delegation request, granting the requested temporary access.
 *
 * Once the delegation request is accepted, it is eligible to send the exchange token to the partner.
 * The SendDelegationToken
 * API has to be explicitly called to send the delegation token.
 *
 * At the time of acceptance, IAM records the details and the state of the identity that called this API.
 * This is the identity that gets mapped to the delegated credential.
 *
 * An accepted request may be rejected before the exchange token is sent to the partner.
 */
export const acceptDelegationRequest: (
  input: AcceptDelegationRequestRequest,
) => effect.Effect<
  AcceptDelegationRequestResponse,
  | ConcurrentModificationException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptDelegationRequestRequest,
  output: AcceptDelegationRequestResponse,
  errors: [
    ConcurrentModificationException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates an IAM role that is linked to a specific Amazon Web Services service. The service controls
 * the attached policies and when the role can be deleted. This helps ensure that the
 * service is not broken by an unexpectedly changed or deleted role, which could put your
 * Amazon Web Services resources into an unknown state. Allowing the service to control the role helps
 * improve service stability and proper cleanup when a service and its role are no longer
 * needed. For more information, see Using service-linked
 * roles in the *IAM User Guide*.
 *
 * To attach a policy to this service-linked role, you must make the request using the
 * Amazon Web Services service that depends on this role.
 */
export const createServiceLinkedRole: (
  input: CreateServiceLinkedRoleRequest,
) => effect.Effect<
  CreateServiceLinkedRoleResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceLinkedRoleRequest,
  output: CreateServiceLinkedRoleResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified instance profile. The instance profile must not have an
 * associated role.
 *
 * Make sure that you do not have any Amazon EC2 instances running with the instance
 * profile you are about to delete. Deleting a role or instance profile that is
 * associated with a running instance will break any applications running on the
 * instance.
 *
 * For more information about instance profiles, see Using
 * instance profiles in the *IAM User Guide*.
 */
export const deleteInstanceProfile: (
  input: DeleteInstanceProfileRequest,
) => effect.Effect<
  DeleteInstanceProfileResponse,
  | DeleteConflictException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInstanceProfileRequest,
  output: DeleteInstanceProfileResponse,
  errors: [
    DeleteConflictException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified managed policy.
 *
 * Before you can delete a managed policy, you must first detach the policy from all
 * users, groups, and roles that it is attached to. In addition, you must delete all the
 * policy's versions. The following steps describe the process for deleting a managed
 * policy:
 *
 * - Detach the policy from all users, groups, and roles that the policy is
 * attached to, using DetachUserPolicy, DetachGroupPolicy, or DetachRolePolicy. To list all the users, groups, and roles that a
 * policy is attached to, use ListEntitiesForPolicy.
 *
 * - Delete all versions of the policy using DeletePolicyVersion. To list the policy's versions, use ListPolicyVersions. You cannot use DeletePolicyVersion to delete the version that is marked as the
 * default version. You delete the policy's default version in the next step of the
 * process.
 *
 * - Delete the policy (this automatically deletes the policy's default version)
 * using this operation.
 *
 * For information about managed policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const deletePolicy: (
  input: DeletePolicyRequest,
) => effect.Effect<
  DeletePolicyResponse,
  | DeleteConflictException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    DeleteConflictException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified version from the specified managed policy.
 *
 * You cannot delete the default version from a policy using this operation. To delete
 * the default version from a policy, use DeletePolicy. To find
 * out which version of a policy is marked as the default version, use ListPolicyVersions.
 *
 * For information about versions for managed policies, see Versioning for managed
 * policies in the *IAM User Guide*.
 */
export const deletePolicyVersion: (
  input: DeletePolicyVersionRequest,
) => effect.Effect<
  DeletePolicyVersionResponse,
  | DeleteConflictException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyVersionRequest,
  output: DeletePolicyVersionResponse,
  errors: [
    DeleteConflictException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified server certificate.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic also includes a list of Amazon Web Services services that can use the server certificates that
 * you manage with IAM.
 *
 * If you are using a server certificate with Elastic Load Balancing, deleting the
 * certificate could have implications for your application. If Elastic Load Balancing
 * doesn't detect the deletion of bound certificates, it may continue to use the
 * certificates. This could cause Elastic Load Balancing to stop accepting traffic. We
 * recommend that you remove the reference to the certificate from Elastic Load
 * Balancing before using this command to delete the certificate. For more information,
 * see DeleteLoadBalancerListeners in the Elastic Load Balancing API
 * Reference.
 */
export const deleteServerCertificate: (
  input: DeleteServerCertificateRequest,
) => effect.Effect<
  DeleteServerCertificateResponse,
  | DeleteConflictException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServerCertificateRequest,
  output: DeleteServerCertificateResponse,
  errors: [
    DeleteConflictException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Sets the specified version of the global endpoint token as the token version used for
 * the Amazon Web Services account.
 *
 * By default, Security Token Service (STS) is available as a global service, and all STS requests
 * go to a single endpoint at `https://sts.amazonaws.com`. Amazon Web Services recommends
 * using Regional STS endpoints to reduce latency, build in redundancy, and increase
 * session token availability. For information about Regional endpoints for STS, see
 * Security Token Service
 * endpoints and quotas in the *Amazon Web Services General Reference*.
 *
 * If you make an STS call to the global endpoint, the resulting session tokens might
 * be valid in some Regions but not others. It depends on the version that is set in this
 * operation. Version 1 tokens are valid only in Amazon Web Services Regions that are
 * available by default. These tokens do not work in manually enabled Regions, such as Asia
 * Pacific (Hong Kong). Version 2 tokens are valid in all Regions. However, version 2
 * tokens are longer and might affect systems where you temporarily store tokens. For
 * information, see Activating and
 * deactivating STS in an Amazon Web Services Region in the
 * *IAM User Guide*.
 *
 * To view the current session token version, see the
 * `GlobalEndpointTokenVersion` entry in the response of the GetAccountSummary operation.
 */
export const setSecurityTokenServicePreferences: (
  input: SetSecurityTokenServicePreferencesRequest,
) => effect.Effect<
  SetSecurityTokenServicePreferencesResponse,
  ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetSecurityTokenServicePreferencesRequest,
  output: SetSecurityTokenServicePreferencesResponse,
  errors: [ServiceFailureException],
}));
/**
 * Creates an IAM resource that describes an identity provider (IdP) that supports SAML
 * 2.0.
 *
 * The SAML provider resource that you create with this operation can be used as a
 * principal in an IAM role's trust policy. Such a policy can enable federated users who
 * sign in using the SAML IdP to assume the role. You can create an IAM role that
 * supports Web-based single sign-on (SSO) to the Amazon Web Services Management Console or one that supports API access
 * to Amazon Web Services.
 *
 * When you create the SAML provider resource, you upload a SAML metadata document that
 * you get from your IdP. That document includes the issuer's name, expiration information,
 * and keys that can be used to validate the SAML authentication response (assertions) that
 * the IdP sends. You must generate the metadata document using the identity management
 * software that is used as your organization's IdP.
 *
 * This operation requires Signature Version 4.
 *
 * For more information, see Enabling SAML 2.0
 * federated users to access the Amazon Web Services Management Console and About SAML 2.0-based
 * federation in the *IAM User Guide*.
 */
export const createSAMLProvider: (
  input: CreateSAMLProviderRequest,
) => effect.Effect<
  CreateSAMLProviderResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | InvalidInputException
  | LimitExceededException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSAMLProviderRequest,
  output: CreateSAMLProviderResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the password policy for the Amazon Web Services account. There are no parameters.
 */
export const deleteAccountPasswordPolicy: (
  input: DeleteAccountPasswordPolicyRequest,
) => effect.Effect<
  DeleteAccountPasswordPolicyResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountPasswordPolicyRequest,
  output: DeleteAccountPasswordPolicyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified IAM group. The group must not contain any users or have any
 * attached policies.
 */
export const deleteGroup: (
  input: DeleteGroupRequest,
) => effect.Effect<
  DeleteGroupResponse,
  | DeleteConflictException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [
    DeleteConflictException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Submits a service-linked role deletion request and returns a
 * `DeletionTaskId`, which you can use to check the status of the deletion.
 * Before you call this operation, confirm that the role has no active sessions and that
 * any resources used by the role in the linked service are deleted. If you call this
 * operation more than once for the same service-linked role and an earlier deletion task
 * is not complete, then the `DeletionTaskId` of the earlier request is
 * returned.
 *
 * If you submit a deletion request for a service-linked role whose linked service is
 * still accessing a resource, then the deletion task fails. If it fails, the GetServiceLinkedRoleDeletionStatus operation returns the reason for the
 * failure, usually including the resources that must be deleted. To delete the
 * service-linked role, you must first remove those resources from the linked service and
 * then submit the deletion request again. Resources are specific to the service that is
 * linked to the role. For more information about removing resources from a service, see
 * the Amazon Web Services documentation for your
 * service.
 *
 * For more information about service-linked roles, see Roles terms and concepts: Amazon Web Services service-linked role in the
 * *IAM User Guide*.
 */
export const deleteServiceLinkedRole: (
  input: DeleteServiceLinkedRoleRequest,
) => effect.Effect<
  DeleteServiceLinkedRoleResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceLinkedRoleRequest,
  output: DeleteServiceLinkedRoleResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds or updates an inline policy document that is embedded in the specified IAM
 * user.
 *
 * An IAM user can also have a managed policy attached to it. To attach a managed
 * policy to a user, use
 * `AttachUserPolicy`
 * . To create a new managed policy, use
 *
 * `CreatePolicy`
 * . For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * For information about the maximum number of inline policies that you can embed in a
 * user, see IAM and STS quotas in the *IAM User Guide*.
 *
 * Because policy documents can be large, you should use POST rather than GET when
 * calling `PutUserPolicy`. For general information about using the Query
 * API with IAM, see Making query requests in the
 * *IAM User Guide*.
 */
export const putUserPolicy: (
  input: PutUserPolicyRequest,
) => effect.Effect<
  PutUserPolicyResponse,
  | LimitExceededException
  | MalformedPolicyDocumentException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutUserPolicyRequest,
  output: PutUserPolicyResponse,
  errors: [
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Updates the password policy settings for the Amazon Web Services account.
 *
 * This operation does not support partial updates. No parameters are required, but
 * if you do not specify a parameter, that parameter's value reverts to its default
 * value. See the **Request Parameters** section for each
 * parameter's default value. Also note that some parameters do not allow the default
 * parameter to be explicitly set. Instead, to invoke the default value, do not include
 * that parameter when you invoke the operation.
 *
 * For more information about using a password policy, see Managing an IAM password
 * policy in the *IAM User Guide*.
 */
export const updateAccountPasswordPolicy: (
  input: UpdateAccountPasswordPolicyRequest,
) => effect.Effect<
  UpdateAccountPasswordPolicyResponse,
  | LimitExceededException
  | MalformedPolicyDocumentException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountPasswordPolicyRequest,
  output: UpdateAccountPasswordPolicyResponse,
  errors: [
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new Amazon Web Services secret access key and corresponding Amazon Web Services access key ID for the
 * specified user. The default status for new keys is `Active`.
 *
 * If you do not specify a user name, IAM determines the user name implicitly based on
 * the Amazon Web Services access key ID signing the request. This operation works for access keys under
 * the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root
 * user credentials. This is true even if the Amazon Web Services account has no associated users.
 *
 * For information about quotas on the number of keys you can create, see IAM and STS
 * quotas in the *IAM User Guide*.
 *
 * To ensure the security of your Amazon Web Services account, the secret access key is accessible
 * only during key and user creation. You must save the key (for example, in a text
 * file) if you want to be able to access it again. If a secret key is lost, you can
 * delete the access keys for the associated user and then create new keys.
 */
export const createAccessKey: (
  input: CreateAccessKeyRequest,
) => effect.Effect<
  CreateAccessKeyResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessKeyRequest,
  output: CreateAccessKeyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new group.
 *
 * For information about the number of groups you can create, see IAM and STS
 * quotas in the *IAM User Guide*.
 */
export const createGroup: (
  input: CreateGroupRequest,
) => effect.Effect<
  CreateGroupResponse,
  | EntityAlreadyExistsException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [
    EntityAlreadyExistsException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new instance profile. For information about instance profiles, see Using
 * roles for applications on Amazon EC2 in the
 * *IAM User Guide*, and Instance profiles in the *Amazon EC2 User Guide*.
 *
 * For information about the number of instance profiles you can create, see IAM object
 * quotas in the *IAM User Guide*.
 */
export const createInstanceProfile: (
  input: CreateInstanceProfileRequest,
) => effect.Effect<
  CreateInstanceProfileResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | InvalidInputException
  | LimitExceededException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInstanceProfileRequest,
  output: CreateInstanceProfileResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    ServiceFailureException,
  ],
}));
/**
 * Creates an IAM entity to describe an identity provider (IdP) that supports OpenID Connect (OIDC).
 *
 * The OIDC provider that you create with this operation can be used as a principal in a
 * role's trust policy. Such a policy establishes a trust relationship between Amazon Web Services and
 * the OIDC provider.
 *
 * If you are using an OIDC identity provider from Google, Facebook, or Amazon Cognito, you don't
 * need to create a separate IAM identity provider. These OIDC identity providers are
 * already built-in to Amazon Web Services and are available for your use. Instead, you can move directly
 * to creating new roles using your identity provider. To learn more, see Creating
 * a role for web identity or OpenID connect federation in the IAM
 * User Guide.
 *
 * When you create the IAM OIDC provider, you specify the following:
 *
 * - The URL of the OIDC identity provider (IdP) to trust
 *
 * - A list of client IDs (also known as audiences) that identify the application
 * or applications allowed to authenticate using the OIDC provider
 *
 * - A list of tags that are attached to the specified IAM OIDC provider
 *
 * - A list of thumbprints of one or more server certificates that the IdP
 * uses
 *
 * You get all of this information from the OIDC IdP you want to use to access
 * Amazon Web Services.
 *
 * Amazon Web Services secures communication with OIDC identity providers (IdPs) using our library of
 * trusted root certificate authorities (CAs) to verify the JSON Web Key Set (JWKS)
 * endpoint's TLS certificate. If your OIDC IdP relies on a certificate that is not signed
 * by one of these trusted CAs, only then we secure communication using the thumbprints set
 * in the IdP's configuration.
 *
 * The trust for the OIDC provider is derived from the IAM provider that this
 * operation creates. Therefore, it is best to limit access to the CreateOpenIDConnectProvider operation to highly privileged
 * users.
 */
export const createOpenIDConnectProvider: (
  input: CreateOpenIDConnectProviderRequest,
) => effect.Effect<
  CreateOpenIDConnectProviderResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | InvalidInputException
  | LimitExceededException
  | OpenIdIdpCommunicationErrorException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOpenIDConnectProviderRequest,
  output: CreateOpenIDConnectProviderResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    OpenIdIdpCommunicationErrorException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new managed policy for your Amazon Web Services account.
 *
 * This operation creates a policy version with a version identifier of `v1`
 * and sets v1 as the policy's default version. For more information about policy versions,
 * see Versioning for managed policies in the
 * *IAM User Guide*.
 *
 * As a best practice, you can validate your IAM policies.
 * To learn more, see Validating IAM policies
 * in the *IAM User Guide*.
 *
 * For more information about managed policies in general, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 */
export const createPolicy: (
  input: CreatePolicyRequest,
) => effect.Effect<
  CreatePolicyResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | InvalidInputException
  | LimitExceededException
  | MalformedPolicyDocumentException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyRequest,
  output: CreatePolicyResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new version of the specified managed policy. To update a managed policy, you
 * create a new policy version. A managed policy can have up to five versions. If the
 * policy has five versions, you must delete an existing version using DeletePolicyVersion before you create a new version.
 *
 * Optionally, you can set the new version as the policy's default version. The default
 * version is the version that is in effect for the IAM users, groups, and roles to which
 * the policy is attached.
 *
 * For more information about managed policy versions, see Versioning for managed
 * policies in the *IAM User Guide*.
 */
export const createPolicyVersion: (
  input: CreatePolicyVersionRequest,
) => effect.Effect<
  CreatePolicyVersionResponse,
  | InvalidInputException
  | LimitExceededException
  | MalformedPolicyDocumentException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyVersionRequest,
  output: CreatePolicyVersionResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new IAM user for your Amazon Web Services account.
 *
 * For information about quotas for the number of IAM users you can create, see IAM and STS
 * quotas in the *IAM User Guide*.
 */
export const createUser: (
  input: CreateUserRequest,
) => effect.Effect<
  CreateUserResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new virtual MFA device for the Amazon Web Services account. After creating the virtual
 * MFA, use EnableMFADevice to
 * attach the MFA device to an IAM user. For more information about creating and working
 * with virtual MFA devices, see Using a virtual MFA device in the
 * *IAM User Guide*.
 *
 * For information about the maximum number of MFA devices you can create, see IAM and STS
 * quotas in the *IAM User Guide*.
 *
 * The seed information contained in the QR code and the Base32 string should be
 * treated like any other secret access information. In other words, protect the seed
 * information as you would your Amazon Web Services access keys or your passwords. After you
 * provision your virtual device, you should ensure that the information is destroyed
 * following secure procedures.
 */
export const createVirtualMFADevice: (
  input: CreateVirtualMFADeviceRequest,
) => effect.Effect<
  CreateVirtualMFADeviceResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | InvalidInputException
  | LimitExceededException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVirtualMFADeviceRequest,
  output: CreateVirtualMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    ServiceFailureException,
  ],
}));
/**
 * Generates a report for service last accessed data for Organizations. You can generate a
 * report for any entities (organization root, organizational unit, or account) or policies
 * in your organization.
 *
 * To call this operation, you must be signed in using your Organizations management account
 * credentials. You can use your long-term IAM user or root user credentials, or temporary
 * credentials from assuming an IAM role. SCPs must be enabled for your organization
 * root. You must have the required IAM and Organizations permissions. For more information, see
 * Refining permissions using service last accessed data in the
 * *IAM User Guide*.
 *
 * You can generate a service last accessed data report for entities by specifying only
 * the entity's path. This data includes a list of services that are allowed by any service
 * control policies (SCPs) that apply to the entity.
 *
 * You can generate a service last accessed data report for a policy by specifying an
 * entity's path and an optional Organizations policy ID. This data includes a list of services that
 * are allowed by the specified SCP.
 *
 * For each service in both report types, the data includes the most recent account
 * activity that the policy allows to account principals in the entity or the entity's
 * children. For important information about the data, reporting period, permissions
 * required, troubleshooting, and supported Regions see Reducing permissions using
 * service last accessed data in the
 * *IAM User Guide*.
 *
 * The data includes all attempts to access Amazon Web Services, not just the successful ones. This
 * includes all attempts that were made using the Amazon Web Services Management Console, the Amazon Web Services API through any
 * of the SDKs, or any of the command line tools. An unexpected entry in the service
 * last accessed data does not mean that an account has been compromised, because the
 * request might have been denied. Refer to your CloudTrail logs as the authoritative
 * source for information about all API calls and whether they were successful or
 * denied access. For more information, see Logging IAM events with
 * CloudTrail in the *IAM User Guide*.
 *
 * This operation returns a `JobId`. Use this parameter in the
 * GetOrganizationsAccessReport
 * operation to check the status of
 * the report generation. To check the status of this request, use the `JobId`
 * parameter in the
 * GetOrganizationsAccessReport
 * operation and test the
 * `JobStatus` response parameter. When the job is complete, you can
 * retrieve the report.
 *
 * To generate a service last accessed data report for entities, specify an entity path
 * without specifying the optional Organizations policy ID. The type of entity that you specify
 * determines the data returned in the report.
 *
 * - **Root** – When you specify the
 * organizations root as the entity, the resulting report lists all of the services
 * allowed by SCPs that are attached to your root. For each service, the report
 * includes data for all accounts in your organization except the
 * management account, because the management account is not limited by SCPs.
 *
 * - **OU** – When you specify an
 * organizational unit (OU) as the entity, the resulting report lists all of the
 * services allowed by SCPs that are attached to the OU and its parents. For each
 * service, the report includes data for all accounts in the OU or its children.
 * This data excludes the management account, because the management account is not
 * limited by SCPs.
 *
 * - **management account** – When you specify the
 * management account, the resulting report lists all Amazon Web Services services, because the
 * management account is not limited by SCPs. For each service, the report includes
 * data for only the management account.
 *
 * - **Account** – When you specify another
 * account as the entity, the resulting report lists all of the services allowed by
 * SCPs that are attached to the account and its parents. For each service, the
 * report includes data for only the specified account.
 *
 * To generate a service last accessed data report for policies, specify an entity path
 * and the optional Organizations policy ID. The type of entity that you specify determines the data
 * returned for each service.
 *
 * - **Root** – When you specify the root
 * entity and a policy ID, the resulting report lists all of the services that are
 * allowed by the specified SCP. For each service, the report includes data for all
 * accounts in your organization to which the SCP applies. This data excludes the
 * management account, because the management account is not limited by SCPs. If the
 * SCP is not attached to any entities in the organization, then the report will
 * return a list of services with no data.
 *
 * - **OU** – When you specify an OU entity and
 * a policy ID, the resulting report lists all of the services that are allowed by
 * the specified SCP. For each service, the report includes data for all accounts
 * in the OU or its children to which the SCP applies. This means that other
 * accounts outside the OU that are affected by the SCP might not be included in
 * the data. This data excludes the management account, because the
 * management account is not limited by SCPs. If the SCP is not attached to the OU
 * or one of its children, the report will return a list of services with no
 * data.
 *
 * - **management account** – When you specify the
 * management account, the resulting report lists all Amazon Web Services services, because the
 * management account is not limited by SCPs. If you specify a policy ID in the CLI
 * or API, the policy is ignored. For each service, the report includes data for
 * only the management account.
 *
 * - **Account** – When you specify another
 * account entity and a policy ID, the resulting report lists all of the services
 * that are allowed by the specified SCP. For each service, the report includes
 * data for only the specified account. This means that other accounts in the
 * organization that are affected by the SCP might not be included in the data. If
 * the SCP is not attached to the account, the report will return a list of
 * services with no data.
 *
 * Service last accessed data does not use other policy types when determining
 * whether a principal could access a service. These other policy types include
 * identity-based policies, resource-based policies, access control lists, IAM
 * permissions boundaries, and STS assume role policies. It only applies SCP logic.
 * For more about the evaluation of policy types, see Evaluating policies in the
 * *IAM User Guide*.
 *
 * For more information about service last accessed data, see Reducing policy scope by
 * viewing user activity in the *IAM User Guide*.
 */
export const generateOrganizationsAccessReport: (
  input: GenerateOrganizationsAccessReportRequest,
) => effect.Effect<
  GenerateOrganizationsAccessReportResponse,
  ReportGenerationLimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateOrganizationsAccessReportRequest,
  output: GenerateOrganizationsAccessReportResponse,
  errors: [ReportGenerationLimitExceededException],
}));
/**
 * Retrieves information about when the specified access key was last used. The
 * information includes the date and time of last use, along with the Amazon Web Services service and
 * Region that were specified in the last request made with that key.
 */
export const getAccessKeyLastUsed: (
  input: GetAccessKeyLastUsedRequest,
) => effect.Effect<
  GetAccessKeyLastUsedResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessKeyLastUsedRequest,
  output: GetAccessKeyLastUsedResponse,
  errors: [],
}));
/**
 * Retrieves information about a specific delegation request.
 *
 * If a delegation request has no owner or owner account, `GetDelegationRequest` for that delegation request can be called by any account.
 * If the owner account is assigned but there is
 * no owner id, only identities within that owner account can call `GetDelegationRequest`
 * for the delegation request. Once the delegation request is fully owned, the owner of the request gets
 * a default permission to get that delegation request. For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const getDelegationRequest: (
  input: GetDelegationRequestRequest,
) => effect.Effect<
  GetDelegationRequestResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDelegationRequestRequest,
  output: GetDelegationRequestResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves information about the specified instance profile, including the instance
 * profile's path, GUID, ARN, and role. For more information about instance profiles, see
 * Using
 * instance profiles in the *IAM User Guide*.
 */
export const getInstanceProfile: (
  input: GetInstanceProfileRequest,
) => effect.Effect<
  GetInstanceProfileResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceProfileRequest,
  output: GetInstanceProfileResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves information about an MFA device for a specified user.
 */
export const getMFADevice: (
  input: GetMFADeviceRequest,
) => effect.Effect<
  GetMFADeviceResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMFADeviceRequest,
  output: GetMFADeviceResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves the service last accessed data report for Organizations that was previously
 * generated using the
 * GenerateOrganizationsAccessReport
 * operation. This operation
 * retrieves the status of your report job and the report contents.
 *
 * Depending on the parameters that you passed when you generated the report, the data
 * returned could include different information. For details, see GenerateOrganizationsAccessReport.
 *
 * To call this operation, you must be signed in to the management account in your
 * organization. SCPs must be enabled for your organization root. You must have permissions
 * to perform this operation. For more information, see Refining permissions using
 * service last accessed data in the
 * *IAM User Guide*.
 *
 * For each service that principals in an account (root user, IAM users, or IAM roles)
 * could access using SCPs, the operation returns details about the most recent access
 * attempt. If there was no attempt, the service is listed without details about the most
 * recent attempt to access the service. If the operation fails, it returns the reason that
 * it failed.
 *
 * By default, the list is sorted by service namespace.
 */
export const getOrganizationsAccessReport: (
  input: GetOrganizationsAccessReportRequest,
) => effect.Effect<
  GetOrganizationsAccessReportResponse,
  NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOrganizationsAccessReportRequest,
  output: GetOrganizationsAccessReportResponse,
  errors: [NoSuchEntityException],
}));
/**
 * Returns the SAML provider metadocument that was uploaded when the IAM SAML provider
 * resource object was created or updated.
 *
 * This operation requires Signature Version 4.
 */
export const getSAMLProvider: (
  input: GetSAMLProviderRequest,
) => effect.Effect<
  GetSAMLProviderResponse,
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSAMLProviderRequest,
  output: GetSAMLProviderResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves information about the specified server certificate stored in IAM.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic includes a list of Amazon Web Services services that can use the server certificates that you
 * manage with IAM.
 */
export const getServerCertificate: (
  input: GetServerCertificateRequest,
) => effect.Effect<
  GetServerCertificateResponse,
  NoSuchEntityException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServerCertificateRequest,
  output: GetServerCertificateResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Returns information about the access key IDs associated with the specified IAM user.
 * If there is none, the operation returns an empty list.
 *
 * Although each user is limited to a small number of keys, you can still paginate the
 * results using the `MaxItems` and `Marker` parameters.
 *
 * If the `UserName` is not specified, the user name is determined implicitly
 * based on the Amazon Web Services access key ID used to sign the request. If a temporary access key is
 * used, then `UserName` is required. If a long-term key is assigned to the
 * user, then `UserName` is not required.
 *
 * This operation works for access keys under the Amazon Web Services account. If the Amazon Web Services account has
 * no associated users, the root user returns it's own access key IDs by running this
 * command.
 *
 * To ensure the security of your Amazon Web Services account, the secret access key is accessible
 * only during key and user creation.
 */
export const listAccessKeys: {
  (
    input: ListAccessKeysRequest,
  ): effect.Effect<
    ListAccessKeysResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessKeysRequest,
  ) => stream.Stream<
    ListAccessKeysResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessKeysRequest,
  ) => stream.Stream<
    AccessKeyMetadata,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessKeysRequest,
  output: ListAccessKeysResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "AccessKeyMetadata",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists all managed policies that are attached to the specified IAM group.
 *
 * An IAM group can also have inline policies embedded with it. To list the inline
 * policies for a group, use ListGroupPolicies.
 * For information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. You can use the `PathPrefix` parameter to limit the list of
 * policies to only those matching the specified path prefix. If there are no policies
 * attached to the specified group (or none that match the specified path prefix), the
 * operation returns an empty list.
 */
export const listAttachedGroupPolicies: {
  (
    input: ListAttachedGroupPoliciesRequest,
  ): effect.Effect<
    ListAttachedGroupPoliciesResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttachedGroupPoliciesRequest,
  ) => stream.Stream<
    ListAttachedGroupPoliciesResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttachedGroupPoliciesRequest,
  ) => stream.Stream<
    AttachedPolicy,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttachedGroupPoliciesRequest,
  output: ListAttachedGroupPoliciesResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "AttachedPolicies",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists all IAM users, groups, and roles that the specified managed policy is attached
 * to.
 *
 * You can use the optional `EntityFilter` parameter to limit the results to a
 * particular type of entity (users, groups, or roles). For example, to list only the roles
 * that are attached to the specified policy, set `EntityFilter` to
 * `Role`.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listEntitiesForPolicy: {
  (
    input: ListEntitiesForPolicyRequest,
  ): effect.Effect<
    ListEntitiesForPolicyResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEntitiesForPolicyRequest,
  ) => stream.Stream<
    ListEntitiesForPolicyResponse,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEntitiesForPolicyRequest,
  ) => stream.Stream<
    unknown,
    | InvalidInputException
    | NoSuchEntityException
    | ServiceFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEntitiesForPolicyRequest,
  output: ListEntitiesForPolicyResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the MFA devices for an IAM user. If the request includes a IAM user name,
 * then this operation lists all the MFA devices associated with the specified user. If you
 * do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services
 * access key ID signing the request for this operation.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listMFADevices: {
  (
    input: ListMFADevicesRequest,
  ): effect.Effect<
    ListMFADevicesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMFADevicesRequest,
  ) => stream.Stream<
    ListMFADevicesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMFADevicesRequest,
  ) => stream.Stream<
    MFADevice,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMFADevicesRequest,
  output: ListMFADevicesResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "MFADevices",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists the server certificates stored in IAM that have the specified path prefix. If
 * none exist, the operation returns an empty list.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic also includes a list of Amazon Web Services services that can use the server certificates that
 * you manage with IAM.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a servercertificate, see
 * GetServerCertificate.
 */
export const listServerCertificates: {
  (
    input: ListServerCertificatesRequest,
  ): effect.Effect<
    ListServerCertificatesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServerCertificatesRequest,
  ) => stream.Stream<
    ListServerCertificatesResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServerCertificatesRequest,
  ) => stream.Stream<
    ServerCertificateMetadata,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServerCertificatesRequest,
  output: ListServerCertificatesResponse,
  errors: [ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ServerCertificateMetadataList",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns information about the signing certificates associated with the specified IAM
 * user. If none exists, the operation returns an empty list.
 *
 * Although each user is limited to a small number of signing certificates, you can still
 * paginate the results using the `MaxItems` and `Marker`
 * parameters.
 *
 * If the `UserName` field is not specified, the user name is determined
 * implicitly based on the Amazon Web Services access key ID used to sign the request for this operation.
 * This operation works for access keys under the Amazon Web Services account. Consequently, you can use
 * this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no
 * associated users.
 */
export const listSigningCertificates: {
  (
    input: ListSigningCertificatesRequest,
  ): effect.Effect<
    ListSigningCertificatesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSigningCertificatesRequest,
  ) => stream.Stream<
    ListSigningCertificatesResponse,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSigningCertificatesRequest,
  ) => stream.Stream<
    SigningCertificate,
    NoSuchEntityException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSigningCertificatesRequest,
  output: ListSigningCertificatesResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Certificates",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns information about the SSH public keys associated with the specified IAM
 * user. If none exists, the operation returns an empty list.
 *
 * The SSH public keys returned by this operation are used only for authenticating the
 * IAM user to an CodeCommit repository. For more information about using SSH keys to
 * authenticate to an CodeCommit repository, see Set up CodeCommit for
 * SSH connections in the *CodeCommit User Guide*.
 *
 * Although each user is limited to a small number of keys, you can still paginate the
 * results using the `MaxItems` and `Marker` parameters.
 */
export const listSSHPublicKeys: {
  (
    input: ListSSHPublicKeysRequest,
  ): effect.Effect<
    ListSSHPublicKeysResponse,
    NoSuchEntityException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSSHPublicKeysRequest,
  ) => stream.Stream<
    ListSSHPublicKeysResponse,
    NoSuchEntityException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSSHPublicKeysRequest,
  ) => stream.Stream<
    SSHPublicKeyMetadata,
    NoSuchEntityException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSSHPublicKeysRequest,
  output: ListSSHPublicKeysResponse,
  errors: [NoSuchEntityException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "SSHPublicKeys",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Simulate how a set of IAM policies and optionally a resource-based policy works with
 * a list of API operations and Amazon Web Services resources to determine the policies' effective
 * permissions. The policies are provided as strings.
 *
 * The simulation does not perform the API operations; it only checks the authorization
 * to determine if the simulated policies allow or deny the operations. You can simulate
 * resources that don't exist in your account.
 *
 * If you want to simulate existing policies that are attached to an IAM user, group,
 * or role, use SimulatePrincipalPolicy instead.
 *
 * Context keys are variables that are maintained by Amazon Web Services and its services and which
 * provide details about the context of an API query request. You can use the
 * `Condition` element of an IAM policy to evaluate context keys. To get
 * the list of context keys that the policies require for correct simulation, use GetContextKeysForCustomPolicy.
 *
 * If the output is long, you can use `MaxItems` and `Marker`
 * parameters to paginate the results.
 *
 * The IAM policy simulator evaluates statements in the identity-based policy and
 * the inputs that you provide during simulation. The policy simulator results can
 * differ from your live Amazon Web Services environment. We recommend that you check your policies
 * against your live Amazon Web Services environment after testing using the policy simulator to
 * confirm that you have the desired results. For more information about using the
 * policy simulator, see Testing IAM
 * policies with the IAM policy simulator in the
 * *IAM User Guide*.
 */
export const simulateCustomPolicy: {
  (
    input: SimulateCustomPolicyRequest,
  ): effect.Effect<
    SimulatePolicyResponse,
    InvalidInputException | PolicyEvaluationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SimulateCustomPolicyRequest,
  ) => stream.Stream<
    SimulatePolicyResponse,
    InvalidInputException | PolicyEvaluationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SimulateCustomPolicyRequest,
  ) => stream.Stream<
    EvaluationResult,
    InvalidInputException | PolicyEvaluationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SimulateCustomPolicyRequest,
  output: SimulatePolicyResponse,
  errors: [InvalidInputException, PolicyEvaluationException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "EvaluationResults",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Use UpdateRole instead.
 *
 * Modifies only the description of a role. This operation performs the same function as
 * the `Description` parameter in the `UpdateRole` operation.
 */
export const updateRoleDescription: (
  input: UpdateRoleDescriptionRequest,
) => effect.Effect<
  UpdateRoleDescriptionResponse,
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRoleDescriptionRequest,
  output: UpdateRoleDescriptionResponse,
  errors: [
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Enables the specified MFA device and associates it with the specified IAM user. When
 * enabled, the MFA device is required for every subsequent login by the IAM user
 * associated with the device.
 */
export const enableMFADevice: (
  input: EnableMFADeviceRequest,
) => effect.Effect<
  EnableMFADeviceResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | EntityTemporarilyUnmodifiableException
  | InvalidAuthenticationCodeException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableMFADeviceRequest,
  output: EnableMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    EntityTemporarilyUnmodifiableException,
    InvalidAuthenticationCodeException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Attaches the specified managed policy to the specified IAM role. When you attach a
 * managed policy to a role, the managed policy becomes part of the role's permission
 * (access) policy.
 *
 * You cannot use a managed policy as the role's trust policy. The role's trust
 * policy is created at the same time as the role, using
 * `CreateRole`
 * . You can update a role's trust policy using
 *
 * `UpdateAssumerolePolicy`
 * .
 *
 * Use this operation to attach a *managed* policy to a role. To embed
 * an inline policy in a role, use
 * `PutRolePolicy`
 * . For more information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * As a best practice, you can validate your IAM policies.
 * To learn more, see Validating IAM policies
 * in the *IAM User Guide*.
 */
export const attachRolePolicy: (
  input: AttachRolePolicyRequest,
) => effect.Effect<
  AttachRolePolicyResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | PolicyNotAttachableException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachRolePolicyRequest,
  output: AttachRolePolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    PolicyNotAttachableException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Changes the password for the specified IAM user. You can use the CLI, the Amazon Web Services
 * API, or the **Users** page in the IAM console to change
 * the password for any IAM user. Use ChangePassword to
 * change your own password in the **My Security Credentials**
 * page in the Amazon Web Services Management Console.
 *
 * For more information about modifying passwords, see Managing passwords in the
 * *IAM User Guide*.
 */
export const updateLoginProfile: (
  input: UpdateLoginProfileRequest,
) => effect.Effect<
  UpdateLoginProfileResponse,
  | EntityTemporarilyUnmodifiableException
  | LimitExceededException
  | NoSuchEntityException
  | PasswordPolicyViolationException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLoginProfileRequest,
  output: UpdateLoginProfileResponse,
  errors: [
    EntityTemporarilyUnmodifiableException,
    LimitExceededException,
    NoSuchEntityException,
    PasswordPolicyViolationException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified role. Unlike the Amazon Web Services Management Console, when you delete a role
 * programmatically, you must delete the items attached to the role manually, or the
 * deletion fails. For more information, see Deleting an IAM role. Before attempting to delete a role, remove the
 * following attached items:
 *
 * - Inline policies (DeleteRolePolicy)
 *
 * - Attached managed policies (DetachRolePolicy)
 *
 * - Instance profile (RemoveRoleFromInstanceProfile)
 *
 * - Optional – Delete instance profile after detaching from role for
 * resource clean up (DeleteInstanceProfile)
 *
 * Make sure that you do not have any Amazon EC2 instances running with the role you are
 * about to delete. Deleting a role or instance profile that is associated with a
 * running instance will break any applications running on the instance.
 */
export const deleteRole: (
  input: DeleteRoleRequest,
) => effect.Effect<
  DeleteRoleResponse,
  | ConcurrentModificationException
  | DeleteConflictException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoleRequest,
  output: DeleteRoleResponse,
  errors: [
    ConcurrentModificationException,
    DeleteConflictException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Removes the specified managed policy from the specified role.
 *
 * A role can also have inline policies embedded with it. To delete an inline policy, use
 * DeleteRolePolicy. For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 */
export const detachRolePolicy: (
  input: DetachRolePolicyRequest,
) => effect.Effect<
  DetachRolePolicyResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachRolePolicyRequest,
  output: DetachRolePolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Deletes the permissions boundary for the specified IAM role.
 *
 * You cannot set the boundary for a service-linked role.
 *
 * Deleting the permissions boundary for a role might increase its permissions. For
 * example, it might allow anyone who assumes the role to perform all the actions
 * granted in its permissions policies.
 */
export const deleteRolePermissionsBoundary: (
  input: DeleteRolePermissionsBoundaryRequest,
) => effect.Effect<
  DeleteRolePermissionsBoundaryResponse,
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRolePermissionsBoundaryRequest,
  output: DeleteRolePermissionsBoundaryResponse,
  errors: [
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Deletes the specified inline policy that is embedded in the specified IAM
 * role.
 *
 * A role can also have managed policies attached to it. To detach a managed policy from
 * a role, use DetachRolePolicy.
 * For more information about policies, refer to Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const deleteRolePolicy: (
  input: DeleteRolePolicyRequest,
) => effect.Effect<
  DeleteRolePolicyResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRolePolicyRequest,
  output: DeleteRolePolicyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Removes the specified IAM role from the specified Amazon EC2 instance profile.
 *
 * Make sure that you do not have any Amazon EC2 instances running with the role you are
 * about to remove from the instance profile. Removing a role from an instance profile
 * that is associated with a running instance might break any applications running on
 * the instance.
 *
 * For more information about roles, see IAM roles in the
 * *IAM User Guide*. For more information about instance profiles,
 * see Using
 * instance profiles in the *IAM User Guide*.
 */
export const removeRoleFromInstanceProfile: (
  input: RemoveRoleFromInstanceProfileRequest,
) => effect.Effect<
  RemoveRoleFromInstanceProfileResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveRoleFromInstanceProfileRequest,
  output: RemoveRoleFromInstanceProfileResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Updates the description or maximum session duration setting of a role.
 */
export const updateRole: (
  input: UpdateRoleRequest,
) => effect.Effect<
  UpdateRoleResponse,
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRoleRequest,
  output: UpdateRoleResponse,
  errors: [
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Adds the specified IAM role to the specified instance profile. An instance profile
 * can contain only one role, and this quota cannot be increased. You can remove the
 * existing role and then add a different role to an instance profile. You must then wait
 * for the change to appear across all of Amazon Web Services because of eventual
 * consistency. To force the change, you must disassociate the instance profile and then associate the
 * instance profile, or you can stop your instance and then restart it.
 *
 * The caller of this operation must be granted the `PassRole` permission
 * on the IAM role by a permissions policy.
 *
 * When using the iam:AssociatedResourceArn condition in a policy to restrict the PassRole IAM action, special considerations apply if the policy is
 * intended to define access for the `AddRoleToInstanceProfile` action. In
 * this case, you cannot specify a Region or instance ID in the EC2 instance ARN. The
 * ARN value must be `arn:aws:ec2:*:CallerAccountId:instance/*`. Using any
 * other ARN value may lead to unexpected evaluation results.
 *
 * For more information about roles, see IAM roles in the
 * *IAM User Guide*. For more information about instance profiles,
 * see Using
 * instance profiles in the *IAM User Guide*.
 */
export const addRoleToInstanceProfile: (
  input: AddRoleToInstanceProfileRequest,
) => effect.Effect<
  AddRoleToInstanceProfileResponse,
  | EntityAlreadyExistsException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddRoleToInstanceProfileRequest,
  output: AddRoleToInstanceProfileResponse,
  errors: [
    EntityAlreadyExistsException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Adds or updates an inline policy document that is embedded in the specified IAM
 * role.
 *
 * When you embed an inline policy in a role, the inline policy is used as part of the
 * role's access (permissions) policy. The role's trust policy is created at the same time
 * as the role, using
 * `CreateRole`
 * .
 * You can update a role's trust policy using
 * `UpdateAssumeRolePolicy`
 * . For more information about roles,
 * see IAM
 * roles in the *IAM User Guide*.
 *
 * A role can also have a managed policy attached to it. To attach a managed policy to a
 * role, use
 * `AttachRolePolicy`
 * . To create a new managed policy, use
 *
 * `CreatePolicy`
 * . For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * For information about the maximum number of inline policies that you can embed with a
 * role, see IAM and STS quotas in the *IAM User Guide*.
 *
 * Because policy documents can be large, you should use POST rather than GET when
 * calling `PutRolePolicy`. For general information about using the Query
 * API with IAM, see Making query requests in the
 * *IAM User Guide*.
 */
export const putRolePolicy: (
  input: PutRolePolicyRequest,
) => effect.Effect<
  PutRolePolicyResponse,
  | LimitExceededException
  | MalformedPolicyDocumentException
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRolePolicyRequest,
  output: PutRolePolicyResponse,
  errors: [
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Updates the policy that grants an IAM entity permission to assume a role. This is
 * typically referred to as the "role trust policy". For more information about roles, see
 * Using roles to
 * delegate permissions and federate identities.
 */
export const updateAssumeRolePolicy: (
  input: UpdateAssumeRolePolicyRequest,
) => effect.Effect<
  UpdateAssumeRolePolicyResponse,
  | LimitExceededException
  | MalformedPolicyDocumentException
  | NoSuchEntityException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssumeRolePolicyRequest,
  output: UpdateAssumeRolePolicyResponse,
  errors: [
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Synchronizes the specified MFA device with its IAM resource object on the Amazon Web Services
 * servers.
 *
 * For more information about creating and working with virtual MFA devices, see Using a virtual MFA
 * device in the *IAM User Guide*.
 */
export const resyncMFADevice: (
  input: ResyncMFADeviceRequest,
) => effect.Effect<
  ResyncMFADeviceResponse,
  | ConcurrentModificationException
  | InvalidAuthenticationCodeException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResyncMFADeviceRequest,
  output: ResyncMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidAuthenticationCodeException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Attaches the specified managed policy to the specified user.
 *
 * You use this operation to attach a *managed* policy to a user. To
 * embed an inline policy in a user, use
 * `PutUserPolicy`
 * .
 *
 * As a best practice, you can validate your IAM policies.
 * To learn more, see Validating IAM policies
 * in the *IAM User Guide*.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const attachUserPolicy: (
  input: AttachUserPolicyRequest,
) => effect.Effect<
  AttachUserPolicyResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | PolicyNotAttachableException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachUserPolicyRequest,
  output: AttachUserPolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    PolicyNotAttachableException,
    ServiceFailureException,
  ],
}));
/**
 * Adds or updates the policy that is specified as the IAM role's permissions boundary.
 * You can use an Amazon Web Services managed policy or a customer managed policy to set the boundary for
 * a role. Use the boundary to control the maximum permissions that the role can have.
 * Setting a permissions boundary is an advanced feature that can affect the permissions
 * for the role.
 *
 * You cannot set the boundary for a service-linked role.
 *
 * Policies used as permissions boundaries do not provide permissions. You must also
 * attach a permissions policy to the role. To learn how the effective permissions for
 * a role are evaluated, see IAM JSON policy
 * evaluation logic in the IAM User Guide.
 */
export const putRolePermissionsBoundary: (
  input: PutRolePermissionsBoundaryRequest,
) => effect.Effect<
  PutRolePermissionsBoundaryResponse,
  | InvalidInputException
  | NoSuchEntityException
  | PolicyNotAttachableException
  | ServiceFailureException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRolePermissionsBoundaryRequest,
  output: PutRolePermissionsBoundaryResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    PolicyNotAttachableException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Adds or updates the policy that is specified as the IAM user's permissions
 * boundary. You can use an Amazon Web Services managed policy or a customer managed policy to set the
 * boundary for a user. Use the boundary to control the maximum permissions that the user
 * can have. Setting a permissions boundary is an advanced feature that can affect the
 * permissions for the user.
 *
 * Policies that are used as permissions boundaries do not provide permissions. You
 * must also attach a permissions policy to the user. To learn how the effective
 * permissions for a user are evaluated, see IAM JSON policy
 * evaluation logic in the IAM User Guide.
 */
export const putUserPermissionsBoundary: (
  input: PutUserPermissionsBoundaryRequest,
) => effect.Effect<
  PutUserPermissionsBoundaryResponse,
  | InvalidInputException
  | NoSuchEntityException
  | PolicyNotAttachableException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutUserPermissionsBoundaryRequest,
  output: PutUserPermissionsBoundaryResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    PolicyNotAttachableException,
    ServiceFailureException,
  ],
}));
/**
 * Attaches the specified managed policy to the specified IAM group.
 *
 * You use this operation to attach a managed policy to a group. To embed an inline
 * policy in a group, use
 * `PutGroupPolicy`
 * .
 *
 * As a best practice, you can validate your IAM policies.
 * To learn more, see Validating IAM policies
 * in the *IAM User Guide*.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const attachGroupPolicy: (
  input: AttachGroupPolicyRequest,
) => effect.Effect<
  AttachGroupPolicyResponse,
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | PolicyNotAttachableException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachGroupPolicyRequest,
  output: AttachGroupPolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    PolicyNotAttachableException,
    ServiceFailureException,
  ],
}));
/**
 * Changes the password of the IAM user who is calling this operation. This operation
 * can be performed using the CLI, the Amazon Web Services API, or the My
 * Security Credentials page in the Amazon Web Services Management Console. The Amazon Web Services account root user password is
 * not affected by this operation.
 *
 * Use UpdateLoginProfile
 * to use the CLI, the Amazon Web Services API, or the **Users** page in
 * the IAM console to change the password for any IAM user. For more information about
 * modifying passwords, see Managing passwords in the
 * *IAM User Guide*.
 */
export const changePassword: (
  input: ChangePasswordRequest,
) => effect.Effect<
  ChangePasswordResponse,
  | EntityTemporarilyUnmodifiableException
  | InvalidUserTypeException
  | LimitExceededException
  | NoSuchEntityException
  | PasswordPolicyViolationException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChangePasswordRequest,
  output: ChangePasswordResponse,
  errors: [
    EntityTemporarilyUnmodifiableException,
    InvalidUserTypeException,
    LimitExceededException,
    NoSuchEntityException,
    PasswordPolicyViolationException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a password for the specified IAM user. A password allows an IAM user to
 * access Amazon Web Services services through the Amazon Web Services Management Console.
 *
 * You can use the CLI, the Amazon Web Services API, or the **Users**
 * page in the IAM console to create a password for any IAM user. Use ChangePassword to update your own existing password in the **My Security Credentials** page in the Amazon Web Services Management Console.
 *
 * For more information about managing passwords, see Managing passwords in the
 * *IAM User Guide*.
 */
export const createLoginProfile: (
  input: CreateLoginProfileRequest,
) => effect.Effect<
  CreateLoginProfileResponse,
  | EntityAlreadyExistsException
  | LimitExceededException
  | NoSuchEntityException
  | PasswordPolicyViolationException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLoginProfileRequest,
  output: CreateLoginProfileResponse,
  errors: [
    EntityAlreadyExistsException,
    LimitExceededException,
    NoSuchEntityException,
    PasswordPolicyViolationException,
    ServiceFailureException,
  ],
}));
/**
 * Creates an IAM delegation request for temporary access delegation.
 *
 * This API is not available for general use. In order to use this API, a caller first need to
 * go through an onboarding process described in the
 * partner onboarding documentation.
 */
export const createDelegationRequest: (
  input: CreateDelegationRequestRequest,
) => effect.Effect<
  CreateDelegationRequestResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | InvalidInputException
  | LimitExceededException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDelegationRequestRequest,
  output: CreateDelegationRequestResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new role for your Amazon Web Services account.
 *
 * For more information about roles, see IAM roles in the
 * *IAM User Guide*. For information about quotas for role names
 * and the number of roles you can create, see IAM and STS quotas in the
 * *IAM User Guide*.
 */
export const createRole: (
  input: CreateRoleRequest,
) => effect.Effect<
  CreateRoleResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | InvalidInputException
  | LimitExceededException
  | MalformedPolicyDocumentException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRoleRequest,
  output: CreateRoleResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    ServiceFailureException,
  ],
}));
/**
 * Generates a set of credentials consisting of a user name and password that can be used
 * to access the service specified in the request. These credentials are generated by
 * IAM, and can be used only for the specified service.
 *
 * You can have a maximum of two sets of service-specific credentials for each supported
 * service per user.
 *
 * You can create service-specific credentials for Amazon Bedrock, CodeCommit and Amazon Keyspaces (for Apache Cassandra).
 *
 * You can reset the password to a new service-generated value by calling ResetServiceSpecificCredential.
 *
 * For more information about service-specific credentials, see Service-specific credentials for IAM users in the
 * *IAM User Guide*.
 */
export const createServiceSpecificCredential: (
  input: CreateServiceSpecificCredentialRequest,
) => effect.Effect<
  CreateServiceSpecificCredentialResponse,
  | LimitExceededException
  | NoSuchEntityException
  | ServiceNotSupportedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceSpecificCredentialRequest,
  output: CreateServiceSpecificCredentialResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceNotSupportedException,
  ],
}));
/**
 * Retrieves information about all IAM users, groups, roles, and policies in your Amazon Web Services
 * account, including their relationships to one another. Use this operation to obtain a
 * snapshot of the configuration of IAM permissions (users, groups, roles, and policies)
 * in your account.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * You can optionally filter the results using the `Filter` parameter. You can
 * paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const getAccountAuthorizationDetails: {
  (
    input: GetAccountAuthorizationDetailsRequest,
  ): effect.Effect<
    GetAccountAuthorizationDetailsResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAccountAuthorizationDetailsRequest,
  ) => stream.Stream<
    GetAccountAuthorizationDetailsResponse,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAccountAuthorizationDetailsRequest,
  ) => stream.Stream<
    unknown,
    ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAccountAuthorizationDetailsRequest,
  output: GetAccountAuthorizationDetailsResponse,
  errors: [ServiceFailureException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Retrieves a credential report for the Amazon Web Services account. For more information about the
 * credential report, see Getting credential reports in
 * the *IAM User Guide*.
 */
export const getCredentialReport: (
  input: GetCredentialReportRequest,
) => effect.Effect<
  GetCredentialReportResponse,
  | CredentialReportExpiredException
  | CredentialReportNotPresentException
  | CredentialReportNotReadyException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCredentialReportRequest,
  output: GetCredentialReportResponse,
  errors: [
    CredentialReportExpiredException,
    CredentialReportNotPresentException,
    CredentialReportNotReadyException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves a service last accessed report that was created using the
 * `GenerateServiceLastAccessedDetails` operation. You can use the
 * `JobId` parameter in `GetServiceLastAccessedDetails` to
 * retrieve the status of your report job. When the report is complete, you can retrieve
 * the generated report. The report includes a list of Amazon Web Services services that the resource
 * (user, group, role, or managed policy) can access.
 *
 * Service last accessed data does not use other policy types when determining
 * whether a resource could access a service. These other policy types include
 * resource-based policies, access control lists, Organizations policies, IAM permissions
 * boundaries, and STS assume role policies. It only applies permissions policy
 * logic. For more about the evaluation of policy types, see Evaluating policies in the
 * *IAM User Guide*.
 *
 * For each service that the resource could access using permissions policies, the
 * operation returns details about the most recent access attempt. If there was no attempt,
 * the service is listed without details about the most recent attempt to access the
 * service. If the operation fails, the `GetServiceLastAccessedDetails`
 * operation returns the reason that it failed.
 *
 * The `GetServiceLastAccessedDetails` operation returns a list of services.
 * This list includes the number of entities that have attempted to access the service and
 * the date and time of the last attempt. It also returns the ARN of the following entity,
 * depending on the resource ARN that you used to generate the report:
 *
 * - **User** – Returns the user ARN that you
 * used to generate the report
 *
 * - **Group** – Returns the ARN of the group
 * member (user) that last attempted to access the service
 *
 * - **Role** – Returns the role ARN that you
 * used to generate the report
 *
 * - **Policy** – Returns the ARN of the user
 * or role that last used the policy to attempt to access the service
 *
 * By default, the list is sorted by service namespace.
 *
 * If you specified `ACTION_LEVEL` granularity when you generated the report,
 * this operation returns service and action last accessed data. This includes the most
 * recent access attempt for each tracked action within a service. Otherwise, this
 * operation returns only service data.
 *
 * For more information about service and action last accessed data, see Reducing permissions using service last accessed data in the
 * *IAM User Guide*.
 */
export const getServiceLastAccessedDetails: (
  input: GetServiceLastAccessedDetailsRequest,
) => effect.Effect<
  GetServiceLastAccessedDetailsResponse,
  InvalidInputException | NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceLastAccessedDetailsRequest,
  output: GetServiceLastAccessedDetailsResponse,
  errors: [InvalidInputException, NoSuchEntityException],
}));
/**
 * After you generate a group or policy report using the
 * `GenerateServiceLastAccessedDetails` operation, you can use the
 * `JobId` parameter in
 * `GetServiceLastAccessedDetailsWithEntities`. This operation retrieves the
 * status of your report job and a list of entities that could have used group or policy
 * permissions to access the specified service.
 *
 * - **Group** – For a group report, this
 * operation returns a list of users in the group that could have used the group’s
 * policies in an attempt to access the service.
 *
 * - **Policy** – For a policy report, this
 * operation returns a list of entities (users or roles) that could have used the
 * policy in an attempt to access the service.
 *
 * You can also use this operation for user or role reports to retrieve details about
 * those entities.
 *
 * If the operation fails, the `GetServiceLastAccessedDetailsWithEntities`
 * operation returns the reason that it failed.
 *
 * By default, the list of associated entities is sorted by date, with the most recent
 * access listed first.
 */
export const getServiceLastAccessedDetailsWithEntities: (
  input: GetServiceLastAccessedDetailsWithEntitiesRequest,
) => effect.Effect<
  GetServiceLastAccessedDetailsWithEntitiesResponse,
  InvalidInputException | NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceLastAccessedDetailsWithEntitiesRequest,
  output: GetServiceLastAccessedDetailsWithEntitiesResponse,
  errors: [InvalidInputException, NoSuchEntityException],
}));
/**
 * Retrieves the status of your service-linked role deletion. After you use DeleteServiceLinkedRole to submit a service-linked role for deletion, you
 * can use the `DeletionTaskId` parameter in
 * `GetServiceLinkedRoleDeletionStatus` to check the status of the deletion.
 * If the deletion fails, this operation returns the reason that it failed, if that
 * information is returned by the service.
 */
export const getServiceLinkedRoleDeletionStatus: (
  input: GetServiceLinkedRoleDeletionStatusRequest,
) => effect.Effect<
  GetServiceLinkedRoleDeletionStatusResponse,
  | InvalidInputException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceLinkedRoleDeletionStatusRequest,
  output: GetServiceLinkedRoleDeletionStatusResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves the specified SSH public key, including metadata about the key.
 *
 * The SSH public key retrieved by this operation is used only for authenticating the
 * associated IAM user to an CodeCommit repository. For more information about using SSH keys
 * to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH
 * connections in the *CodeCommit User Guide*.
 */
export const getSSHPublicKey: (
  input: GetSSHPublicKeyRequest,
) => effect.Effect<
  GetSSHPublicKeyResponse,
  NoSuchEntityException | UnrecognizedPublicKeyEncodingException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSSHPublicKeyRequest,
  output: GetSSHPublicKeyResponse,
  errors: [NoSuchEntityException, UnrecognizedPublicKeyEncodingException],
}));
/**
 * Retrieves a list of policies that the IAM identity (user, group, or role) can use to
 * access each specified service.
 *
 * This operation does not use other policy types when determining whether a resource
 * could access a service. These other policy types include resource-based policies,
 * access control lists, Organizations policies, IAM permissions boundaries, and STS
 * assume role policies. It only applies permissions policy logic. For more about the
 * evaluation of policy types, see Evaluating policies in the
 * *IAM User Guide*.
 *
 * The list of policies returned by the operation depends on the ARN of the identity that
 * you provide.
 *
 * - **User** – The list of policies includes
 * the managed and inline policies that are attached to the user directly. The list
 * also includes any additional managed and inline policies that are attached to
 * the group to which the user belongs.
 *
 * - **Group** – The list of policies includes
 * only the managed and inline policies that are attached to the group directly.
 * Policies that are attached to the group’s user are not included.
 *
 * - **Role** – The list of policies includes
 * only the managed and inline policies that are attached to the role.
 *
 * For each managed policy, this operation returns the ARN and policy name. For each
 * inline policy, it returns the policy name and the entity to which it is attached. Inline
 * policies do not have an ARN. For more information about these policy types, see Managed policies and inline policies in the
 * *IAM User Guide*.
 *
 * Policies that are attached to users and roles as permissions boundaries are not
 * returned. To view which managed policy is currently used to set the permissions boundary
 * for a user or role, use the GetUser or GetRole
 * operations.
 */
export const listPoliciesGrantingServiceAccess: (
  input: ListPoliciesGrantingServiceAccessRequest,
) => effect.Effect<
  ListPoliciesGrantingServiceAccessResponse,
  InvalidInputException | NoSuchEntityException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPoliciesGrantingServiceAccessRequest,
  output: ListPoliciesGrantingServiceAccessResponse,
  errors: [InvalidInputException, NoSuchEntityException],
}));
/**
 * Uploads a server certificate entity for the Amazon Web Services account. The server certificate
 * entity includes a public key certificate, a private key, and an optional certificate
 * chain, which should all be PEM-encoded.
 *
 * We recommend that you use Certificate Manager to
 * provision, manage, and deploy your server certificates. With ACM you can request a
 * certificate, deploy it to Amazon Web Services resources, and let ACM handle certificate renewals for
 * you. Certificates provided by ACM are free. For more information about using ACM,
 * see the Certificate Manager User
 * Guide.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic includes a list of Amazon Web Services services that can use the server certificates that you
 * manage with IAM.
 *
 * For information about the number of server certificates you can upload, see IAM and STS
 * quotas in the *IAM User Guide*.
 *
 * Because the body of the public key certificate, private key, and the certificate
 * chain can be large, you should use POST rather than GET when calling
 * `UploadServerCertificate`. For information about setting up
 * signatures and authorization through the API, see Signing Amazon Web Services API
 * requests in the *Amazon Web Services General Reference*. For general
 * information about using the Query API with IAM, see Calling the API by making HTTP query
 * requests in the *IAM User Guide*.
 */
export const uploadServerCertificate: (
  input: UploadServerCertificateRequest,
) => effect.Effect<
  UploadServerCertificateResponse,
  | ConcurrentModificationException
  | EntityAlreadyExistsException
  | InvalidInputException
  | KeyPairMismatchException
  | LimitExceededException
  | MalformedCertificateException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadServerCertificateRequest,
  output: UploadServerCertificateResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    KeyPairMismatchException,
    LimitExceededException,
    MalformedCertificateException,
    ServiceFailureException,
  ],
}));
/**
 * Uploads an X.509 signing certificate and associates it with the specified IAM user.
 * Some Amazon Web Services services require you to use certificates to validate requests that are signed
 * with a corresponding private key. When you upload the certificate, its default status is
 * `Active`.
 *
 * For information about when you would use an X.509 signing certificate, see Managing
 * server certificates in IAM in the
 * *IAM User Guide*.
 *
 * If the `UserName` is not specified, the IAM user name is determined
 * implicitly based on the Amazon Web Services access key ID used to sign the request. This operation
 * works for access keys under the Amazon Web Services account. Consequently, you can use this operation
 * to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated
 * users.
 *
 * Because the body of an X.509 certificate can be large, you should use POST rather
 * than GET when calling `UploadSigningCertificate`. For information about
 * setting up signatures and authorization through the API, see Signing
 * Amazon Web Services API requests in the *Amazon Web Services General Reference*. For
 * general information about using the Query API with IAM, see Making query
 * requests in the *IAM User Guide*.
 */
export const uploadSigningCertificate: (
  input: UploadSigningCertificateRequest,
) => effect.Effect<
  UploadSigningCertificateResponse,
  | ConcurrentModificationException
  | DuplicateCertificateException
  | EntityAlreadyExistsException
  | InvalidCertificateException
  | LimitExceededException
  | MalformedCertificateException
  | NoSuchEntityException
  | ServiceFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadSigningCertificateRequest,
  output: UploadSigningCertificateResponse,
  errors: [
    ConcurrentModificationException,
    DuplicateCertificateException,
    EntityAlreadyExistsException,
    InvalidCertificateException,
    LimitExceededException,
    MalformedCertificateException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Uploads an SSH public key and associates it with the specified IAM user.
 *
 * The SSH public key uploaded by this operation can be used only for authenticating the
 * associated IAM user to an CodeCommit repository. For more information about using SSH keys
 * to authenticate to an CodeCommit repository, see Set up CodeCommit for
 * SSH connections in the *CodeCommit User Guide*.
 */
export const uploadSSHPublicKey: (
  input: UploadSSHPublicKeyRequest,
) => effect.Effect<
  UploadSSHPublicKeyResponse,
  | DuplicateSSHPublicKeyException
  | InvalidPublicKeyException
  | LimitExceededException
  | NoSuchEntityException
  | UnrecognizedPublicKeyEncodingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadSSHPublicKeyRequest,
  output: UploadSSHPublicKeyResponse,
  errors: [
    DuplicateSSHPublicKeyException,
    InvalidPublicKeyException,
    LimitExceededException,
    NoSuchEntityException,
    UnrecognizedPublicKeyEncodingException,
  ],
}));
/**
 * Returns information about the service-specific credentials associated with the
 * specified IAM user. If none exists, the operation returns an empty list. The
 * service-specific credentials returned by this operation are used only for authenticating
 * the IAM user to a specific service. For more information about using service-specific
 * credentials to authenticate to an Amazon Web Services service, see Set up service-specific credentials
 * in the CodeCommit User Guide.
 */
export const listServiceSpecificCredentials: (
  input: ListServiceSpecificCredentialsRequest,
) => effect.Effect<
  ListServiceSpecificCredentialsResponse,
  | NoSuchEntityException
  | ServiceNotSupportedException
  | RequestLimitExceeded
  | InvalidInput
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServiceSpecificCredentialsRequest,
  output: ListServiceSpecificCredentialsResponse,
  errors: [
    NoSuchEntityException,
    ServiceNotSupportedException,
    RequestLimitExceeded,
    InvalidInput,
  ],
}));
/**
 * Disables the management of privileged root user credentials across member accounts in
 * your organization. When you disable this feature, the management account and the
 * delegated administrator for IAM can no longer manage root user credentials for member
 * accounts in your organization.
 */
export const disableOrganizationsRootCredentialsManagement: (
  input: DisableOrganizationsRootCredentialsManagementRequest,
) => effect.Effect<
  DisableOrganizationsRootCredentialsManagementResponse,
  | AccountNotManagementOrDelegatedAdministratorException
  | OrganizationNotFoundException
  | OrganizationNotInAllFeaturesModeException
  | ServiceAccessNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableOrganizationsRootCredentialsManagementRequest,
  output: DisableOrganizationsRootCredentialsManagementResponse,
  errors: [
    AccountNotManagementOrDelegatedAdministratorException,
    OrganizationNotFoundException,
    OrganizationNotInAllFeaturesModeException,
    ServiceAccessNotEnabledException,
  ],
}));
/**
 * Simulate how a set of IAM policies attached to an IAM entity works with a list of
 * API operations and Amazon Web Services resources to determine the policies' effective permissions. The
 * entity can be an IAM user, group, or role. If you specify a user, then the simulation
 * also includes all of the policies that are attached to groups that the user belongs to.
 * You can simulate resources that don't exist in your account.
 *
 * You can optionally include a list of one or more additional policies specified as
 * strings to include in the simulation. If you want to simulate only policies specified as
 * strings, use SimulateCustomPolicy instead.
 *
 * You can also optionally include one resource-based policy to be evaluated with each of
 * the resources included in the simulation for IAM users only.
 *
 * The simulation does not perform the API operations; it only checks the authorization
 * to determine if the simulated policies allow or deny the operations.
 *
 * **Note:** This operation discloses information about the
 * permissions granted to other users. If you do not want users to see other user's
 * permissions, then consider allowing them to use SimulateCustomPolicy instead.
 *
 * Context keys are variables maintained by Amazon Web Services and its services that provide details
 * about the context of an API query request. You can use the `Condition`
 * element of an IAM policy to evaluate context keys. To get the list of context keys
 * that the policies require for correct simulation, use GetContextKeysForPrincipalPolicy.
 *
 * If the output is long, you can use the `MaxItems` and `Marker`
 * parameters to paginate the results.
 *
 * The IAM policy simulator evaluates statements in the identity-based policy and
 * the inputs that you provide during simulation. The policy simulator results can
 * differ from your live Amazon Web Services environment. We recommend that you check your policies
 * against your live Amazon Web Services environment after testing using the policy simulator to
 * confirm that you have the desired results. For more information about using the
 * policy simulator, see Testing IAM
 * policies with the IAM policy simulator in the
 * *IAM User Guide*.
 */
export const simulatePrincipalPolicy: {
  (
    input: SimulatePrincipalPolicyRequest,
  ): effect.Effect<
    SimulatePolicyResponse,
    | InvalidInputException
    | NoSuchEntityException
    | PolicyEvaluationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SimulatePrincipalPolicyRequest,
  ) => stream.Stream<
    SimulatePolicyResponse,
    | InvalidInputException
    | NoSuchEntityException
    | PolicyEvaluationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SimulatePrincipalPolicyRequest,
  ) => stream.Stream<
    EvaluationResult,
    | InvalidInputException
    | NoSuchEntityException
    | PolicyEvaluationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SimulatePrincipalPolicyRequest,
  output: SimulatePolicyResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    PolicyEvaluationException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "EvaluationResults",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Enables the management of privileged root user credentials across member accounts in your
 * organization. When you enable root credentials management for centralized root access, the management account and the delegated
 * administrator for IAM can manage root user credentials for member accounts in your
 * organization.
 *
 * Before you enable centralized root access, you must have an account configured with
 * the following settings:
 *
 * - You must manage your Amazon Web Services accounts in Organizations.
 *
 * - Enable trusted access for Identity and Access Management in Organizations. For details, see
 * IAM and Organizations in the Organizations User
 * Guide.
 */
export const enableOrganizationsRootCredentialsManagement: (
  input: EnableOrganizationsRootCredentialsManagementRequest,
) => effect.Effect<
  EnableOrganizationsRootCredentialsManagementResponse,
  | AccountNotManagementOrDelegatedAdministratorException
  | CallerIsNotManagementAccountException
  | OrganizationNotFoundException
  | OrganizationNotInAllFeaturesModeException
  | ServiceAccessNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableOrganizationsRootCredentialsManagementRequest,
  output: EnableOrganizationsRootCredentialsManagementResponse,
  errors: [
    AccountNotManagementOrDelegatedAdministratorException,
    CallerIsNotManagementAccountException,
    OrganizationNotFoundException,
    OrganizationNotInAllFeaturesModeException,
    ServiceAccessNotEnabledException,
  ],
}));
/**
 * Disables root user sessions for privileged tasks across member accounts in your
 * organization. When you disable this feature, the management account and the delegated
 * administrator for IAM can no longer perform privileged tasks on member accounts in
 * your organization.
 */
export const disableOrganizationsRootSessions: (
  input: DisableOrganizationsRootSessionsRequest,
) => effect.Effect<
  DisableOrganizationsRootSessionsResponse,
  | AccountNotManagementOrDelegatedAdministratorException
  | OrganizationNotFoundException
  | OrganizationNotInAllFeaturesModeException
  | ServiceAccessNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableOrganizationsRootSessionsRequest,
  output: DisableOrganizationsRootSessionsResponse,
  errors: [
    AccountNotManagementOrDelegatedAdministratorException,
    OrganizationNotFoundException,
    OrganizationNotInAllFeaturesModeException,
    ServiceAccessNotEnabledException,
  ],
}));
/**
 * Lists the centralized root access features enabled for your organization. For more
 * information, see Centrally manage root access for member accounts.
 */
export const listOrganizationsFeatures: (
  input: ListOrganizationsFeaturesRequest,
) => effect.Effect<
  ListOrganizationsFeaturesResponse,
  | AccountNotManagementOrDelegatedAdministratorException
  | OrganizationNotFoundException
  | OrganizationNotInAllFeaturesModeException
  | ServiceAccessNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOrganizationsFeaturesRequest,
  output: ListOrganizationsFeaturesResponse,
  errors: [
    AccountNotManagementOrDelegatedAdministratorException,
    OrganizationNotFoundException,
    OrganizationNotInAllFeaturesModeException,
    ServiceAccessNotEnabledException,
  ],
}));
/**
 * Allows the management account or delegated administrator to perform privileged tasks
 * on member accounts in your organization. For more information, see Centrally manage root access for member accounts in the Identity and Access Management
 * User Guide.
 *
 * Before you enable this feature, you must have an account configured with the following
 * settings:
 *
 * - You must manage your Amazon Web Services accounts in Organizations.
 *
 * - Enable trusted access for Identity and Access Management in Organizations. For details, see
 * IAM and Organizations in the Organizations User
 * Guide.
 */
export const enableOrganizationsRootSessions: (
  input: EnableOrganizationsRootSessionsRequest,
) => effect.Effect<
  EnableOrganizationsRootSessionsResponse,
  | AccountNotManagementOrDelegatedAdministratorException
  | CallerIsNotManagementAccountException
  | OrganizationNotFoundException
  | OrganizationNotInAllFeaturesModeException
  | ServiceAccessNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableOrganizationsRootSessionsRequest,
  output: EnableOrganizationsRootSessionsResponse,
  errors: [
    AccountNotManagementOrDelegatedAdministratorException,
    CallerIsNotManagementAccountException,
    OrganizationNotFoundException,
    OrganizationNotInAllFeaturesModeException,
    ServiceAccessNotEnabledException,
  ],
}));

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
const ns = T.XmlNamespace("http://organizations.amazonaws.com/doc/2016-11-28/");
const svc = T.AwsApiService({
  sdkId: "Organizations",
  serviceShapeName: "AWSOrganizationsV20161128",
});
const auth = T.AwsAuthSigv4({ name: "organizations" });
const ver = T.ServiceVersion("2016-11-28");
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
  const _p0 = () => ({
    authSchemes: [
      {
        name: "sigv4",
        signingName: "organizations",
        signingRegion: "us-east-1",
      },
    ],
  });
  const _p1 = () => ({
    authSchemes: [
      {
        name: "sigv4",
        signingName: "organizations",
        signingRegion: "us-gov-west-1",
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
          UseDualStack === false
        ) {
          return e("https://organizations.us-east-1.amazonaws.com", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            "https://organizations-fips.us-east-1.amazonaws.com",
            _p0(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://organizations.cn-northwest-1.amazonaws.com.cn",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "organizations",
                  signingRegion: "cn-northwest-1",
                },
              ],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://organizations.us-gov-west-1.amazonaws.com",
            _p1(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            "https://organizations.us-gov-west-1.amazonaws.com",
            _p1(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://organizations.us-iso-east-1.c2s.ic.gov",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "organizations",
                  signingRegion: "us-iso-east-1",
                },
              ],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://organizations.us-isob-east-1.sc2s.sgov.gov",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "organizations",
                  signingRegion: "us-isob-east-1",
                },
              ],
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
            "https://organizations.us-isof-south-1.csp.hci.ic.gov",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "organizations",
                  signingRegion: "us-isof-south-1",
                },
              ],
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
              `https://organizations-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://organizations-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://organizations.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://organizations.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type HandshakeId = string;
export type PolicyId = string;
export type PolicyTargetId = string;
export type AccountId = string;
export type Email = string | redacted.Redacted<string>;
export type CreateAccountName = string | redacted.Redacted<string>;
export type RoleName = string;
export type ParentId = string;
export type OrganizationalUnitName = string;
export type PolicyContent = string;
export type PolicyDescription = string;
export type PolicyName = string;
export type ExceptionMessage = string;
export type OrganizationalUnitId = string;
export type ServicePrincipal = string;
export type CreateAccountRequestId = string;
export type ResponsibilityTransferId = string;
export type RootId = string;
export type HandshakeNotes = string | redacted.Redacted<string>;
export type ResponsibilityTransferName = string | redacted.Redacted<string>;
export type NextToken = string;
export type MaxResults = number;
export type ChildId = string;
export type TaggableResourceId = string;
export type ResourcePolicyContent = string;
export type TagKey = string;
export type TagValue = string;
export type OrganizationId = string;
export type OrganizationArn = string;
export type AccountArn = string;
export type HandshakeArn = string;
export type HandshakePartyId = string | redacted.Redacted<string>;
export type Path = string;
export type ResourcePolicyId = string;
export type ResourcePolicyArn = string;
export type HandshakeResourceValue = string | redacted.Redacted<string>;
export type OrganizationalUnitArn = string;
export type AccountName = string | redacted.Redacted<string>;
export type ResponsibilityTransferArn = string;
export type RootArn = string;
export type RootName = string;
export type ErrorCode = string;
export type ErrorMessage = string;
export type PathToError = string;
export type PolicyArn = string;
export type AwsManagedPolicy = boolean;
export type GenericArn = string;
export type TargetName = string;
export type ExceptionType = string;

//# Schemas
export interface DeleteOrganizationRequest {}
export const DeleteOrganizationRequest = S.suspend(() =>
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
  identifier: "DeleteOrganizationRequest",
}) as any as S.Schema<DeleteOrganizationRequest>;
export interface DeleteOrganizationResponse {}
export const DeleteOrganizationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOrganizationResponse",
}) as any as S.Schema<DeleteOrganizationResponse>;
export interface DeleteResourcePolicyRequest {}
export const DeleteResourcePolicyRequest = S.suspend(() =>
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
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DescribeOrganizationRequest {}
export const DescribeOrganizationRequest = S.suspend(() =>
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
  identifier: "DescribeOrganizationRequest",
}) as any as S.Schema<DescribeOrganizationRequest>;
export interface DescribeResourcePolicyRequest {}
export const DescribeResourcePolicyRequest = S.suspend(() =>
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
  identifier: "DescribeResourcePolicyRequest",
}) as any as S.Schema<DescribeResourcePolicyRequest>;
export interface EnableAllFeaturesRequest {}
export const EnableAllFeaturesRequest = S.suspend(() =>
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
  identifier: "EnableAllFeaturesRequest",
}) as any as S.Schema<EnableAllFeaturesRequest>;
export interface LeaveOrganizationRequest {}
export const LeaveOrganizationRequest = S.suspend(() =>
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
  identifier: "LeaveOrganizationRequest",
}) as any as S.Schema<LeaveOrganizationRequest>;
export interface LeaveOrganizationResponse {}
export const LeaveOrganizationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "LeaveOrganizationResponse",
}) as any as S.Schema<LeaveOrganizationResponse>;
export type IAMUserAccessToBilling = "ALLOW" | "DENY" | (string & {});
export const IAMUserAccessToBilling = S.String;
export type OrganizationFeatureSet =
  | "ALL"
  | "CONSOLIDATED_BILLING"
  | (string & {});
export const OrganizationFeatureSet = S.String;
export type PolicyType =
  | "SERVICE_CONTROL_POLICY"
  | "RESOURCE_CONTROL_POLICY"
  | "TAG_POLICY"
  | "BACKUP_POLICY"
  | "AISERVICES_OPT_OUT_POLICY"
  | "CHATBOT_POLICY"
  | "DECLARATIVE_POLICY_EC2"
  | "SECURITYHUB_POLICY"
  | "INSPECTOR_POLICY"
  | "UPGRADE_ROLLOUT_POLICY"
  | "BEDROCK_POLICY"
  | "S3_POLICY"
  | "NETWORK_SECURITY_DIRECTOR_POLICY"
  | (string & {});
export const PolicyType = S.String;
export type EffectivePolicyType =
  | "TAG_POLICY"
  | "BACKUP_POLICY"
  | "AISERVICES_OPT_OUT_POLICY"
  | "CHATBOT_POLICY"
  | "DECLARATIVE_POLICY_EC2"
  | "SECURITYHUB_POLICY"
  | "INSPECTOR_POLICY"
  | "UPGRADE_ROLLOUT_POLICY"
  | "BEDROCK_POLICY"
  | "S3_POLICY"
  | "NETWORK_SECURITY_DIRECTOR_POLICY"
  | (string & {});
export const EffectivePolicyType = S.String;
export type ResponsibilityTransferType = "BILLING" | (string & {});
export const ResponsibilityTransferType = S.String;
export type ChildType = "ACCOUNT" | "ORGANIZATIONAL_UNIT" | (string & {});
export const ChildType = S.String;
export type CreateAccountState =
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | (string & {});
export const CreateAccountState = S.String;
export type CreateAccountStates = CreateAccountState[];
export const CreateAccountStates = S.Array(CreateAccountState);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface AcceptHandshakeRequest {
  HandshakeId: string;
}
export const AcceptHandshakeRequest = S.suspend(() =>
  S.Struct({ HandshakeId: S.String }).pipe(
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
  identifier: "AcceptHandshakeRequest",
}) as any as S.Schema<AcceptHandshakeRequest>;
export interface AttachPolicyRequest {
  PolicyId: string;
  TargetId: string;
}
export const AttachPolicyRequest = S.suspend(() =>
  S.Struct({ PolicyId: S.String, TargetId: S.String }).pipe(
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
  identifier: "AttachPolicyRequest",
}) as any as S.Schema<AttachPolicyRequest>;
export interface AttachPolicyResponse {}
export const AttachPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AttachPolicyResponse",
}) as any as S.Schema<AttachPolicyResponse>;
export interface CancelHandshakeRequest {
  HandshakeId: string;
}
export const CancelHandshakeRequest = S.suspend(() =>
  S.Struct({ HandshakeId: S.String }).pipe(
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
  identifier: "CancelHandshakeRequest",
}) as any as S.Schema<CancelHandshakeRequest>;
export interface CloseAccountRequest {
  AccountId: string;
}
export const CloseAccountRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String }).pipe(
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
  identifier: "CloseAccountRequest",
}) as any as S.Schema<CloseAccountRequest>;
export interface CloseAccountResponse {}
export const CloseAccountResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CloseAccountResponse",
}) as any as S.Schema<CloseAccountResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateGovCloudAccountRequest {
  Email: string | redacted.Redacted<string>;
  AccountName: string | redacted.Redacted<string>;
  RoleName?: string;
  IamUserAccessToBilling?: IAMUserAccessToBilling;
  Tags?: Tag[];
}
export const CreateGovCloudAccountRequest = S.suspend(() =>
  S.Struct({
    Email: SensitiveString,
    AccountName: SensitiveString,
    RoleName: S.optional(S.String),
    IamUserAccessToBilling: S.optional(IAMUserAccessToBilling),
    Tags: S.optional(Tags),
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
  identifier: "CreateGovCloudAccountRequest",
}) as any as S.Schema<CreateGovCloudAccountRequest>;
export interface CreateOrganizationRequest {
  FeatureSet?: OrganizationFeatureSet;
}
export const CreateOrganizationRequest = S.suspend(() =>
  S.Struct({ FeatureSet: S.optional(OrganizationFeatureSet) }).pipe(
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
  identifier: "CreateOrganizationRequest",
}) as any as S.Schema<CreateOrganizationRequest>;
export interface CreateOrganizationalUnitRequest {
  ParentId: string;
  Name: string;
  Tags?: Tag[];
}
export const CreateOrganizationalUnitRequest = S.suspend(() =>
  S.Struct({ ParentId: S.String, Name: S.String, Tags: S.optional(Tags) }).pipe(
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
  identifier: "CreateOrganizationalUnitRequest",
}) as any as S.Schema<CreateOrganizationalUnitRequest>;
export interface CreatePolicyRequest {
  Content: string;
  Description: string;
  Name: string;
  Type: PolicyType;
  Tags?: Tag[];
}
export const CreatePolicyRequest = S.suspend(() =>
  S.Struct({
    Content: S.String,
    Description: S.String,
    Name: S.String,
    Type: PolicyType,
    Tags: S.optional(Tags),
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
export interface DeclineHandshakeRequest {
  HandshakeId: string;
}
export const DeclineHandshakeRequest = S.suspend(() =>
  S.Struct({ HandshakeId: S.String }).pipe(
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
  identifier: "DeclineHandshakeRequest",
}) as any as S.Schema<DeclineHandshakeRequest>;
export interface DeleteOrganizationalUnitRequest {
  OrganizationalUnitId: string;
}
export const DeleteOrganizationalUnitRequest = S.suspend(() =>
  S.Struct({ OrganizationalUnitId: S.String }).pipe(
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
  identifier: "DeleteOrganizationalUnitRequest",
}) as any as S.Schema<DeleteOrganizationalUnitRequest>;
export interface DeleteOrganizationalUnitResponse {}
export const DeleteOrganizationalUnitResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOrganizationalUnitResponse",
}) as any as S.Schema<DeleteOrganizationalUnitResponse>;
export interface DeletePolicyRequest {
  PolicyId: string;
}
export const DeletePolicyRequest = S.suspend(() =>
  S.Struct({ PolicyId: S.String }).pipe(
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
export interface DeregisterDelegatedAdministratorRequest {
  AccountId: string;
  ServicePrincipal: string;
}
export const DeregisterDelegatedAdministratorRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String, ServicePrincipal: S.String }).pipe(
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
  identifier: "DeregisterDelegatedAdministratorRequest",
}) as any as S.Schema<DeregisterDelegatedAdministratorRequest>;
export interface DeregisterDelegatedAdministratorResponse {}
export const DeregisterDelegatedAdministratorResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterDelegatedAdministratorResponse",
}) as any as S.Schema<DeregisterDelegatedAdministratorResponse>;
export interface DescribeAccountRequest {
  AccountId: string;
}
export const DescribeAccountRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String }).pipe(
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
  identifier: "DescribeAccountRequest",
}) as any as S.Schema<DescribeAccountRequest>;
export interface DescribeCreateAccountStatusRequest {
  CreateAccountRequestId: string;
}
export const DescribeCreateAccountStatusRequest = S.suspend(() =>
  S.Struct({ CreateAccountRequestId: S.String }).pipe(
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
  identifier: "DescribeCreateAccountStatusRequest",
}) as any as S.Schema<DescribeCreateAccountStatusRequest>;
export interface DescribeEffectivePolicyRequest {
  PolicyType: EffectivePolicyType;
  TargetId?: string;
}
export const DescribeEffectivePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyType: EffectivePolicyType,
    TargetId: S.optional(S.String),
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
  identifier: "DescribeEffectivePolicyRequest",
}) as any as S.Schema<DescribeEffectivePolicyRequest>;
export interface DescribeHandshakeRequest {
  HandshakeId: string;
}
export const DescribeHandshakeRequest = S.suspend(() =>
  S.Struct({ HandshakeId: S.String }).pipe(
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
  identifier: "DescribeHandshakeRequest",
}) as any as S.Schema<DescribeHandshakeRequest>;
export interface DescribeOrganizationalUnitRequest {
  OrganizationalUnitId: string;
}
export const DescribeOrganizationalUnitRequest = S.suspend(() =>
  S.Struct({ OrganizationalUnitId: S.String }).pipe(
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
  identifier: "DescribeOrganizationalUnitRequest",
}) as any as S.Schema<DescribeOrganizationalUnitRequest>;
export interface DescribePolicyRequest {
  PolicyId: string;
}
export const DescribePolicyRequest = S.suspend(() =>
  S.Struct({ PolicyId: S.String }).pipe(
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
  identifier: "DescribePolicyRequest",
}) as any as S.Schema<DescribePolicyRequest>;
export interface DescribeResponsibilityTransferRequest {
  Id: string;
}
export const DescribeResponsibilityTransferRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
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
  identifier: "DescribeResponsibilityTransferRequest",
}) as any as S.Schema<DescribeResponsibilityTransferRequest>;
export interface DetachPolicyRequest {
  PolicyId: string;
  TargetId: string;
}
export const DetachPolicyRequest = S.suspend(() =>
  S.Struct({ PolicyId: S.String, TargetId: S.String }).pipe(
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
  identifier: "DetachPolicyRequest",
}) as any as S.Schema<DetachPolicyRequest>;
export interface DetachPolicyResponse {}
export const DetachPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DetachPolicyResponse",
}) as any as S.Schema<DetachPolicyResponse>;
export interface DisableAWSServiceAccessRequest {
  ServicePrincipal: string;
}
export const DisableAWSServiceAccessRequest = S.suspend(() =>
  S.Struct({ ServicePrincipal: S.String }).pipe(
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
  identifier: "DisableAWSServiceAccessRequest",
}) as any as S.Schema<DisableAWSServiceAccessRequest>;
export interface DisableAWSServiceAccessResponse {}
export const DisableAWSServiceAccessResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableAWSServiceAccessResponse",
}) as any as S.Schema<DisableAWSServiceAccessResponse>;
export interface DisablePolicyTypeRequest {
  RootId: string;
  PolicyType: PolicyType;
}
export const DisablePolicyTypeRequest = S.suspend(() =>
  S.Struct({ RootId: S.String, PolicyType: PolicyType }).pipe(
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
  identifier: "DisablePolicyTypeRequest",
}) as any as S.Schema<DisablePolicyTypeRequest>;
export interface EnableAWSServiceAccessRequest {
  ServicePrincipal: string;
}
export const EnableAWSServiceAccessRequest = S.suspend(() =>
  S.Struct({ ServicePrincipal: S.String }).pipe(
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
  identifier: "EnableAWSServiceAccessRequest",
}) as any as S.Schema<EnableAWSServiceAccessRequest>;
export interface EnableAWSServiceAccessResponse {}
export const EnableAWSServiceAccessResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableAWSServiceAccessResponse",
}) as any as S.Schema<EnableAWSServiceAccessResponse>;
export interface EnablePolicyTypeRequest {
  RootId: string;
  PolicyType: PolicyType;
}
export const EnablePolicyTypeRequest = S.suspend(() =>
  S.Struct({ RootId: S.String, PolicyType: PolicyType }).pipe(
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
  identifier: "EnablePolicyTypeRequest",
}) as any as S.Schema<EnablePolicyTypeRequest>;
export type HandshakePartyType =
  | "ACCOUNT"
  | "ORGANIZATION"
  | "EMAIL"
  | (string & {});
export const HandshakePartyType = S.String;
export interface HandshakeParty {
  Id: string | redacted.Redacted<string>;
  Type: HandshakePartyType;
}
export const HandshakeParty = S.suspend(() =>
  S.Struct({ Id: SensitiveString, Type: HandshakePartyType }),
).annotations({
  identifier: "HandshakeParty",
}) as any as S.Schema<HandshakeParty>;
export interface InviteOrganizationToTransferResponsibilityRequest {
  Type: ResponsibilityTransferType;
  Target: HandshakeParty;
  Notes?: string | redacted.Redacted<string>;
  StartTimestamp: Date;
  SourceName: string | redacted.Redacted<string>;
  Tags?: Tag[];
}
export const InviteOrganizationToTransferResponsibilityRequest = S.suspend(() =>
  S.Struct({
    Type: ResponsibilityTransferType,
    Target: HandshakeParty,
    Notes: S.optional(SensitiveString),
    StartTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    SourceName: SensitiveString,
    Tags: S.optional(Tags),
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
  identifier: "InviteOrganizationToTransferResponsibilityRequest",
}) as any as S.Schema<InviteOrganizationToTransferResponsibilityRequest>;
export interface ListAccountsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListAccountsRequest = S.suspend(() =>
  S.Struct({
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
  identifier: "ListAccountsRequest",
}) as any as S.Schema<ListAccountsRequest>;
export interface ListAccountsForParentRequest {
  ParentId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAccountsForParentRequest = S.suspend(() =>
  S.Struct({
    ParentId: S.String,
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
  identifier: "ListAccountsForParentRequest",
}) as any as S.Schema<ListAccountsForParentRequest>;
export interface ListAccountsWithInvalidEffectivePolicyRequest {
  PolicyType: EffectivePolicyType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAccountsWithInvalidEffectivePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyType: EffectivePolicyType,
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
  identifier: "ListAccountsWithInvalidEffectivePolicyRequest",
}) as any as S.Schema<ListAccountsWithInvalidEffectivePolicyRequest>;
export interface ListAWSServiceAccessForOrganizationRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListAWSServiceAccessForOrganizationRequest = S.suspend(() =>
  S.Struct({
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
  identifier: "ListAWSServiceAccessForOrganizationRequest",
}) as any as S.Schema<ListAWSServiceAccessForOrganizationRequest>;
export interface ListChildrenRequest {
  ParentId: string;
  ChildType: ChildType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListChildrenRequest = S.suspend(() =>
  S.Struct({
    ParentId: S.String,
    ChildType: ChildType,
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
  identifier: "ListChildrenRequest",
}) as any as S.Schema<ListChildrenRequest>;
export interface ListCreateAccountStatusRequest {
  States?: CreateAccountState[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListCreateAccountStatusRequest = S.suspend(() =>
  S.Struct({
    States: S.optional(CreateAccountStates),
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
  identifier: "ListCreateAccountStatusRequest",
}) as any as S.Schema<ListCreateAccountStatusRequest>;
export interface ListDelegatedAdministratorsRequest {
  ServicePrincipal?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDelegatedAdministratorsRequest = S.suspend(() =>
  S.Struct({
    ServicePrincipal: S.optional(S.String),
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
  identifier: "ListDelegatedAdministratorsRequest",
}) as any as S.Schema<ListDelegatedAdministratorsRequest>;
export interface ListDelegatedServicesForAccountRequest {
  AccountId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDelegatedServicesForAccountRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
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
  identifier: "ListDelegatedServicesForAccountRequest",
}) as any as S.Schema<ListDelegatedServicesForAccountRequest>;
export interface ListEffectivePolicyValidationErrorsRequest {
  AccountId: string;
  PolicyType: EffectivePolicyType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListEffectivePolicyValidationErrorsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    PolicyType: EffectivePolicyType,
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
  identifier: "ListEffectivePolicyValidationErrorsRequest",
}) as any as S.Schema<ListEffectivePolicyValidationErrorsRequest>;
export type ActionType =
  | "INVITE"
  | "ENABLE_ALL_FEATURES"
  | "APPROVE_ALL_FEATURES"
  | "ADD_ORGANIZATIONS_SERVICE_LINKED_ROLE"
  | "TRANSFER_RESPONSIBILITY"
  | (string & {});
export const ActionType = S.String;
export interface HandshakeFilter {
  ActionType?: ActionType;
  ParentHandshakeId?: string;
}
export const HandshakeFilter = S.suspend(() =>
  S.Struct({
    ActionType: S.optional(ActionType),
    ParentHandshakeId: S.optional(S.String),
  }),
).annotations({
  identifier: "HandshakeFilter",
}) as any as S.Schema<HandshakeFilter>;
export interface ListHandshakesForOrganizationRequest {
  Filter?: HandshakeFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListHandshakesForOrganizationRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(HandshakeFilter),
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
  identifier: "ListHandshakesForOrganizationRequest",
}) as any as S.Schema<ListHandshakesForOrganizationRequest>;
export interface ListInboundResponsibilityTransfersRequest {
  Type: ResponsibilityTransferType;
  Id?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListInboundResponsibilityTransfersRequest = S.suspend(() =>
  S.Struct({
    Type: ResponsibilityTransferType,
    Id: S.optional(S.String),
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
  identifier: "ListInboundResponsibilityTransfersRequest",
}) as any as S.Schema<ListInboundResponsibilityTransfersRequest>;
export interface ListOrganizationalUnitsForParentRequest {
  ParentId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListOrganizationalUnitsForParentRequest = S.suspend(() =>
  S.Struct({
    ParentId: S.String,
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
  identifier: "ListOrganizationalUnitsForParentRequest",
}) as any as S.Schema<ListOrganizationalUnitsForParentRequest>;
export interface ListOutboundResponsibilityTransfersRequest {
  Type: ResponsibilityTransferType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListOutboundResponsibilityTransfersRequest = S.suspend(() =>
  S.Struct({
    Type: ResponsibilityTransferType,
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
  identifier: "ListOutboundResponsibilityTransfersRequest",
}) as any as S.Schema<ListOutboundResponsibilityTransfersRequest>;
export interface ListParentsRequest {
  ChildId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListParentsRequest = S.suspend(() =>
  S.Struct({
    ChildId: S.String,
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
  identifier: "ListParentsRequest",
}) as any as S.Schema<ListParentsRequest>;
export interface ListPoliciesRequest {
  Filter: PolicyType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPoliciesRequest = S.suspend(() =>
  S.Struct({
    Filter: PolicyType,
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
  identifier: "ListPoliciesRequest",
}) as any as S.Schema<ListPoliciesRequest>;
export interface ListPoliciesForTargetRequest {
  TargetId: string;
  Filter: PolicyType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPoliciesForTargetRequest = S.suspend(() =>
  S.Struct({
    TargetId: S.String,
    Filter: PolicyType,
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
  identifier: "ListPoliciesForTargetRequest",
}) as any as S.Schema<ListPoliciesForTargetRequest>;
export interface ListRootsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListRootsRequest = S.suspend(() =>
  S.Struct({
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
  identifier: "ListRootsRequest",
}) as any as S.Schema<ListRootsRequest>;
export interface ListTagsForResourceRequest {
  ResourceId: string;
  NextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, NextToken: S.optional(S.String) }).pipe(
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
export interface ListTargetsForPolicyRequest {
  PolicyId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListTargetsForPolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyId: S.String,
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
  identifier: "ListTargetsForPolicyRequest",
}) as any as S.Schema<ListTargetsForPolicyRequest>;
export interface MoveAccountRequest {
  AccountId: string;
  SourceParentId: string;
  DestinationParentId: string;
}
export const MoveAccountRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    SourceParentId: S.String,
    DestinationParentId: S.String,
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
  identifier: "MoveAccountRequest",
}) as any as S.Schema<MoveAccountRequest>;
export interface MoveAccountResponse {}
export const MoveAccountResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "MoveAccountResponse",
}) as any as S.Schema<MoveAccountResponse>;
export interface PutResourcePolicyRequest {
  Content: string;
  Tags?: Tag[];
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({ Content: S.String, Tags: S.optional(Tags) }).pipe(
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
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface RegisterDelegatedAdministratorRequest {
  AccountId: string;
  ServicePrincipal: string;
}
export const RegisterDelegatedAdministratorRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String, ServicePrincipal: S.String }).pipe(
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
  identifier: "RegisterDelegatedAdministratorRequest",
}) as any as S.Schema<RegisterDelegatedAdministratorRequest>;
export interface RegisterDelegatedAdministratorResponse {}
export const RegisterDelegatedAdministratorResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterDelegatedAdministratorResponse",
}) as any as S.Schema<RegisterDelegatedAdministratorResponse>;
export interface RemoveAccountFromOrganizationRequest {
  AccountId: string;
}
export const RemoveAccountFromOrganizationRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String }).pipe(
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
  identifier: "RemoveAccountFromOrganizationRequest",
}) as any as S.Schema<RemoveAccountFromOrganizationRequest>;
export interface RemoveAccountFromOrganizationResponse {}
export const RemoveAccountFromOrganizationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveAccountFromOrganizationResponse",
}) as any as S.Schema<RemoveAccountFromOrganizationResponse>;
export interface TagResourceRequest {
  ResourceId: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, Tags: Tags }).pipe(
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
export interface TerminateResponsibilityTransferRequest {
  Id: string;
  EndTimestamp?: Date;
}
export const TerminateResponsibilityTransferRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
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
  identifier: "TerminateResponsibilityTransferRequest",
}) as any as S.Schema<TerminateResponsibilityTransferRequest>;
export interface UntagResourceRequest {
  ResourceId: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, TagKeys: TagKeys }).pipe(
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
export interface UpdateOrganizationalUnitRequest {
  OrganizationalUnitId: string;
  Name?: string;
}
export const UpdateOrganizationalUnitRequest = S.suspend(() =>
  S.Struct({ OrganizationalUnitId: S.String, Name: S.optional(S.String) }).pipe(
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
  identifier: "UpdateOrganizationalUnitRequest",
}) as any as S.Schema<UpdateOrganizationalUnitRequest>;
export interface UpdatePolicyRequest {
  PolicyId: string;
  Name?: string;
  Description?: string;
  Content?: string;
}
export const UpdatePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Content: S.optional(S.String),
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
  identifier: "UpdatePolicyRequest",
}) as any as S.Schema<UpdatePolicyRequest>;
export interface UpdateResponsibilityTransferRequest {
  Id: string;
  Name: string | redacted.Redacted<string>;
}
export const UpdateResponsibilityTransferRequest = S.suspend(() =>
  S.Struct({ Id: S.String, Name: SensitiveString }).pipe(
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
  identifier: "UpdateResponsibilityTransferRequest",
}) as any as S.Schema<UpdateResponsibilityTransferRequest>;
export type HandshakeParties = HandshakeParty[];
export const HandshakeParties = S.Array(HandshakeParty);
export type HandshakeState =
  | "REQUESTED"
  | "OPEN"
  | "CANCELED"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | (string & {});
export const HandshakeState = S.String;
export type AccountStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "PENDING_CLOSURE"
  | (string & {});
export const AccountStatus = S.String;
export type AccountState =
  | "PENDING_ACTIVATION"
  | "ACTIVE"
  | "SUSPENDED"
  | "PENDING_CLOSURE"
  | "CLOSED"
  | (string & {});
export const AccountState = S.String;
export type AccountJoinedMethod = "INVITED" | "CREATED" | (string & {});
export const AccountJoinedMethod = S.String;
export interface Account {
  Id?: string;
  Arn?: string;
  Email?: string | redacted.Redacted<string>;
  Name?: string | redacted.Redacted<string>;
  Status?: AccountStatus;
  State?: AccountState;
  JoinedMethod?: AccountJoinedMethod;
  JoinedTimestamp?: Date;
}
export const Account = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Email: S.optional(SensitiveString),
    Name: S.optional(SensitiveString),
    Status: S.optional(AccountStatus),
    State: S.optional(AccountState),
    JoinedMethod: S.optional(AccountJoinedMethod),
    JoinedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Account" }) as any as S.Schema<Account>;
export type Accounts = Account[];
export const Accounts = S.Array(Account);
export type CreateAccountFailureReason =
  | "ACCOUNT_LIMIT_EXCEEDED"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_ADDRESS"
  | "INVALID_EMAIL"
  | "CONCURRENT_ACCOUNT_MODIFICATION"
  | "INTERNAL_FAILURE"
  | "GOVCLOUD_ACCOUNT_ALREADY_EXISTS"
  | "MISSING_BUSINESS_VALIDATION"
  | "FAILED_BUSINESS_VALIDATION"
  | "PENDING_BUSINESS_VALIDATION"
  | "INVALID_IDENTITY_FOR_BUSINESS_VALIDATION"
  | "UNKNOWN_BUSINESS_VALIDATION"
  | "MISSING_PAYMENT_INSTRUMENT"
  | "INVALID_PAYMENT_INSTRUMENT"
  | "UPDATE_EXISTING_RESOURCE_POLICY_WITH_TAGS_NOT_SUPPORTED"
  | (string & {});
export const CreateAccountFailureReason = S.String;
export interface CreateAccountStatus {
  Id?: string;
  AccountName?: string | redacted.Redacted<string>;
  State?: CreateAccountState;
  RequestedTimestamp?: Date;
  CompletedTimestamp?: Date;
  AccountId?: string;
  GovCloudAccountId?: string;
  FailureReason?: CreateAccountFailureReason;
}
export const CreateAccountStatus = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    AccountName: S.optional(SensitiveString),
    State: S.optional(CreateAccountState),
    RequestedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CompletedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AccountId: S.optional(S.String),
    GovCloudAccountId: S.optional(S.String),
    FailureReason: S.optional(CreateAccountFailureReason),
  }),
).annotations({
  identifier: "CreateAccountStatus",
}) as any as S.Schema<CreateAccountStatus>;
export type CreateAccountStatuses = CreateAccountStatus[];
export const CreateAccountStatuses = S.Array(CreateAccountStatus);
export type HandshakeResources = HandshakeResource[];
export const HandshakeResources = S.Array(
  S.suspend(
    (): S.Schema<HandshakeResource, any> => HandshakeResource,
  ).annotations({ identifier: "HandshakeResource" }),
) as any as S.Schema<HandshakeResources>;
export interface Handshake {
  Id?: string;
  Arn?: string;
  Parties?: HandshakeParty[];
  State?: HandshakeState;
  RequestedTimestamp?: Date;
  ExpirationTimestamp?: Date;
  Action?: ActionType;
  Resources?: HandshakeResource[];
}
export const Handshake = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Parties: S.optional(HandshakeParties),
    State: S.optional(HandshakeState),
    RequestedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExpirationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Action: S.optional(ActionType),
    Resources: S.optional(HandshakeResources),
  }),
).annotations({ identifier: "Handshake" }) as any as S.Schema<Handshake>;
export type Handshakes = Handshake[];
export const Handshakes = S.Array(Handshake);
export type ResponsibilityTransferStatus =
  | "REQUESTED"
  | "DECLINED"
  | "CANCELED"
  | "EXPIRED"
  | "ACCEPTED"
  | "WITHDRAWN"
  | (string & {});
export const ResponsibilityTransferStatus = S.String;
export interface TransferParticipant {
  ManagementAccountId?: string;
  ManagementAccountEmail?: string | redacted.Redacted<string>;
}
export const TransferParticipant = S.suspend(() =>
  S.Struct({
    ManagementAccountId: S.optional(S.String),
    ManagementAccountEmail: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "TransferParticipant",
}) as any as S.Schema<TransferParticipant>;
export interface ResponsibilityTransfer {
  Arn?: string;
  Name?: string | redacted.Redacted<string>;
  Id?: string;
  Type?: ResponsibilityTransferType;
  Status?: ResponsibilityTransferStatus;
  Source?: TransferParticipant;
  Target?: TransferParticipant;
  StartTimestamp?: Date;
  EndTimestamp?: Date;
  ActiveHandshakeId?: string;
}
export const ResponsibilityTransfer = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Id: S.optional(S.String),
    Type: S.optional(ResponsibilityTransferType),
    Status: S.optional(ResponsibilityTransferStatus),
    Source: S.optional(TransferParticipant),
    Target: S.optional(TransferParticipant),
    StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ActiveHandshakeId: S.optional(S.String),
  }),
).annotations({
  identifier: "ResponsibilityTransfer",
}) as any as S.Schema<ResponsibilityTransfer>;
export type ResponsibilityTransfers = ResponsibilityTransfer[];
export const ResponsibilityTransfers = S.Array(ResponsibilityTransfer);
export interface OrganizationalUnit {
  Id?: string;
  Arn?: string;
  Name?: string;
}
export const OrganizationalUnit = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "OrganizationalUnit",
}) as any as S.Schema<OrganizationalUnit>;
export type OrganizationalUnits = OrganizationalUnit[];
export const OrganizationalUnits = S.Array(OrganizationalUnit);
export type PolicyTypeStatus =
  | "ENABLED"
  | "PENDING_ENABLE"
  | "PENDING_DISABLE"
  | (string & {});
export const PolicyTypeStatus = S.String;
export interface PolicyTypeSummary {
  Type?: PolicyType;
  Status?: PolicyTypeStatus;
}
export const PolicyTypeSummary = S.suspend(() =>
  S.Struct({
    Type: S.optional(PolicyType),
    Status: S.optional(PolicyTypeStatus),
  }),
).annotations({
  identifier: "PolicyTypeSummary",
}) as any as S.Schema<PolicyTypeSummary>;
export type PolicyTypes = PolicyTypeSummary[];
export const PolicyTypes = S.Array(PolicyTypeSummary);
export interface Root {
  Id?: string;
  Arn?: string;
  Name?: string;
  PolicyTypes?: PolicyTypeSummary[];
}
export const Root = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    PolicyTypes: S.optional(PolicyTypes),
  }),
).annotations({ identifier: "Root" }) as any as S.Schema<Root>;
export type Roots = Root[];
export const Roots = S.Array(Root);
export type HandshakeResourceType =
  | "ACCOUNT"
  | "ORGANIZATION"
  | "ORGANIZATION_FEATURE_SET"
  | "EMAIL"
  | "MASTER_EMAIL"
  | "MASTER_NAME"
  | "NOTES"
  | "PARENT_HANDSHAKE"
  | "RESPONSIBILITY_TRANSFER"
  | "TRANSFER_START_TIMESTAMP"
  | "TRANSFER_TYPE"
  | "MANAGEMENT_ACCOUNT"
  | "MANAGEMENT_EMAIL"
  | "MANAGEMENT_NAME"
  | (string & {});
export const HandshakeResourceType = S.String;
export interface AcceptHandshakeResponse {
  Handshake?: Handshake;
}
export const AcceptHandshakeResponse = S.suspend(() =>
  S.Struct({ Handshake: S.optional(Handshake) }).pipe(ns),
).annotations({
  identifier: "AcceptHandshakeResponse",
}) as any as S.Schema<AcceptHandshakeResponse>;
export interface CancelHandshakeResponse {
  Handshake?: Handshake;
}
export const CancelHandshakeResponse = S.suspend(() =>
  S.Struct({ Handshake: S.optional(Handshake) }).pipe(ns),
).annotations({
  identifier: "CancelHandshakeResponse",
}) as any as S.Schema<CancelHandshakeResponse>;
export interface CreateAccountRequest {
  Email: string | redacted.Redacted<string>;
  AccountName: string | redacted.Redacted<string>;
  RoleName?: string;
  IamUserAccessToBilling?: IAMUserAccessToBilling;
  Tags?: Tag[];
}
export const CreateAccountRequest = S.suspend(() =>
  S.Struct({
    Email: SensitiveString,
    AccountName: SensitiveString,
    RoleName: S.optional(S.String),
    IamUserAccessToBilling: S.optional(IAMUserAccessToBilling),
    Tags: S.optional(Tags),
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
  identifier: "CreateAccountRequest",
}) as any as S.Schema<CreateAccountRequest>;
export interface Organization {
  Id?: string;
  Arn?: string;
  FeatureSet?: OrganizationFeatureSet;
  MasterAccountArn?: string;
  MasterAccountId?: string;
  MasterAccountEmail?: string | redacted.Redacted<string>;
  AvailablePolicyTypes?: PolicyTypeSummary[];
}
export const Organization = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    FeatureSet: S.optional(OrganizationFeatureSet),
    MasterAccountArn: S.optional(S.String),
    MasterAccountId: S.optional(S.String),
    MasterAccountEmail: S.optional(SensitiveString),
    AvailablePolicyTypes: S.optional(PolicyTypes),
  }),
).annotations({ identifier: "Organization" }) as any as S.Schema<Organization>;
export interface CreateOrganizationResponse {
  Organization?: Organization;
}
export const CreateOrganizationResponse = S.suspend(() =>
  S.Struct({ Organization: S.optional(Organization) }).pipe(ns),
).annotations({
  identifier: "CreateOrganizationResponse",
}) as any as S.Schema<CreateOrganizationResponse>;
export interface DeclineHandshakeResponse {
  Handshake?: Handshake;
}
export const DeclineHandshakeResponse = S.suspend(() =>
  S.Struct({ Handshake: S.optional(Handshake) }).pipe(ns),
).annotations({
  identifier: "DeclineHandshakeResponse",
}) as any as S.Schema<DeclineHandshakeResponse>;
export interface DescribeCreateAccountStatusResponse {
  CreateAccountStatus?: CreateAccountStatus;
}
export const DescribeCreateAccountStatusResponse = S.suspend(() =>
  S.Struct({ CreateAccountStatus: S.optional(CreateAccountStatus) }).pipe(ns),
).annotations({
  identifier: "DescribeCreateAccountStatusResponse",
}) as any as S.Schema<DescribeCreateAccountStatusResponse>;
export interface DescribeHandshakeResponse {
  Handshake?: Handshake;
}
export const DescribeHandshakeResponse = S.suspend(() =>
  S.Struct({ Handshake: S.optional(Handshake) }).pipe(ns),
).annotations({
  identifier: "DescribeHandshakeResponse",
}) as any as S.Schema<DescribeHandshakeResponse>;
export interface DescribeOrganizationalUnitResponse {
  OrganizationalUnit?: OrganizationalUnit;
}
export const DescribeOrganizationalUnitResponse = S.suspend(() =>
  S.Struct({ OrganizationalUnit: S.optional(OrganizationalUnit) }).pipe(ns),
).annotations({
  identifier: "DescribeOrganizationalUnitResponse",
}) as any as S.Schema<DescribeOrganizationalUnitResponse>;
export interface PolicySummary {
  Id?: string;
  Arn?: string;
  Name?: string;
  Description?: string;
  Type?: PolicyType;
  AwsManaged?: boolean;
}
export const PolicySummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Type: S.optional(PolicyType),
    AwsManaged: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PolicySummary",
}) as any as S.Schema<PolicySummary>;
export interface Policy {
  PolicySummary?: PolicySummary;
  Content?: string;
}
export const Policy = S.suspend(() =>
  S.Struct({
    PolicySummary: S.optional(PolicySummary),
    Content: S.optional(S.String),
  }),
).annotations({ identifier: "Policy" }) as any as S.Schema<Policy>;
export interface DescribePolicyResponse {
  Policy?: Policy;
}
export const DescribePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(Policy) }).pipe(ns),
).annotations({
  identifier: "DescribePolicyResponse",
}) as any as S.Schema<DescribePolicyResponse>;
export interface EnablePolicyTypeResponse {
  Root?: Root;
}
export const EnablePolicyTypeResponse = S.suspend(() =>
  S.Struct({ Root: S.optional(Root) }).pipe(ns),
).annotations({
  identifier: "EnablePolicyTypeResponse",
}) as any as S.Schema<EnablePolicyTypeResponse>;
export interface InviteAccountToOrganizationRequest {
  Target: HandshakeParty;
  Notes?: string | redacted.Redacted<string>;
  Tags?: Tag[];
}
export const InviteAccountToOrganizationRequest = S.suspend(() =>
  S.Struct({
    Target: HandshakeParty,
    Notes: S.optional(SensitiveString),
    Tags: S.optional(Tags),
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
  identifier: "InviteAccountToOrganizationRequest",
}) as any as S.Schema<InviteAccountToOrganizationRequest>;
export interface InviteOrganizationToTransferResponsibilityResponse {
  Handshake?: Handshake;
}
export const InviteOrganizationToTransferResponsibilityResponse = S.suspend(
  () => S.Struct({ Handshake: S.optional(Handshake) }).pipe(ns),
).annotations({
  identifier: "InviteOrganizationToTransferResponsibilityResponse",
}) as any as S.Schema<InviteOrganizationToTransferResponsibilityResponse>;
export interface ListAccountsResponse {
  Accounts?: Account[];
  NextToken?: string;
}
export const ListAccountsResponse = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(Accounts),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAccountsResponse",
}) as any as S.Schema<ListAccountsResponse>;
export interface ListAccountsForParentResponse {
  Accounts?: Account[];
  NextToken?: string;
}
export const ListAccountsForParentResponse = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(Accounts),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAccountsForParentResponse",
}) as any as S.Schema<ListAccountsForParentResponse>;
export interface ListAccountsWithInvalidEffectivePolicyResponse {
  Accounts?: Account[];
  PolicyType?: EffectivePolicyType;
  NextToken?: string;
}
export const ListAccountsWithInvalidEffectivePolicyResponse = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(Accounts),
    PolicyType: S.optional(EffectivePolicyType),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAccountsWithInvalidEffectivePolicyResponse",
}) as any as S.Schema<ListAccountsWithInvalidEffectivePolicyResponse>;
export interface ListCreateAccountStatusResponse {
  CreateAccountStatuses?: CreateAccountStatus[];
  NextToken?: string;
}
export const ListCreateAccountStatusResponse = S.suspend(() =>
  S.Struct({
    CreateAccountStatuses: S.optional(CreateAccountStatuses),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListCreateAccountStatusResponse",
}) as any as S.Schema<ListCreateAccountStatusResponse>;
export interface ListHandshakesForAccountRequest {
  Filter?: HandshakeFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListHandshakesForAccountRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(HandshakeFilter),
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
  identifier: "ListHandshakesForAccountRequest",
}) as any as S.Schema<ListHandshakesForAccountRequest>;
export interface ListHandshakesForOrganizationResponse {
  Handshakes?: Handshake[];
  NextToken?: string;
}
export const ListHandshakesForOrganizationResponse = S.suspend(() =>
  S.Struct({
    Handshakes: S.optional(Handshakes),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListHandshakesForOrganizationResponse",
}) as any as S.Schema<ListHandshakesForOrganizationResponse>;
export interface ListInboundResponsibilityTransfersResponse {
  ResponsibilityTransfers?: ResponsibilityTransfer[];
  NextToken?: string;
}
export const ListInboundResponsibilityTransfersResponse = S.suspend(() =>
  S.Struct({
    ResponsibilityTransfers: S.optional(ResponsibilityTransfers),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInboundResponsibilityTransfersResponse",
}) as any as S.Schema<ListInboundResponsibilityTransfersResponse>;
export interface ListOrganizationalUnitsForParentResponse {
  OrganizationalUnits?: OrganizationalUnit[];
  NextToken?: string;
}
export const ListOrganizationalUnitsForParentResponse = S.suspend(() =>
  S.Struct({
    OrganizationalUnits: S.optional(OrganizationalUnits),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListOrganizationalUnitsForParentResponse",
}) as any as S.Schema<ListOrganizationalUnitsForParentResponse>;
export interface ListOutboundResponsibilityTransfersResponse {
  ResponsibilityTransfers?: ResponsibilityTransfer[];
  NextToken?: string;
}
export const ListOutboundResponsibilityTransfersResponse = S.suspend(() =>
  S.Struct({
    ResponsibilityTransfers: S.optional(ResponsibilityTransfers),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListOutboundResponsibilityTransfersResponse",
}) as any as S.Schema<ListOutboundResponsibilityTransfersResponse>;
export type Policies = PolicySummary[];
export const Policies = S.Array(PolicySummary);
export interface ListPoliciesForTargetResponse {
  Policies?: PolicySummary[];
  NextToken?: string;
}
export const ListPoliciesForTargetResponse = S.suspend(() =>
  S.Struct({
    Policies: S.optional(Policies),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPoliciesForTargetResponse",
}) as any as S.Schema<ListPoliciesForTargetResponse>;
export interface ListRootsResponse {
  Roots?: Root[];
  NextToken?: string;
}
export const ListRootsResponse = S.suspend(() =>
  S.Struct({ Roots: S.optional(Roots), NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListRootsResponse",
}) as any as S.Schema<ListRootsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
  NextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags), NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ResourcePolicySummary {
  Id?: string;
  Arn?: string;
}
export const ResourcePolicySummary = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "ResourcePolicySummary",
}) as any as S.Schema<ResourcePolicySummary>;
export interface ResourcePolicy {
  ResourcePolicySummary?: ResourcePolicySummary;
  Content?: string;
}
export const ResourcePolicy = S.suspend(() =>
  S.Struct({
    ResourcePolicySummary: S.optional(ResourcePolicySummary),
    Content: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourcePolicy",
}) as any as S.Schema<ResourcePolicy>;
export interface PutResourcePolicyResponse {
  ResourcePolicy?: ResourcePolicy;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({ ResourcePolicy: S.optional(ResourcePolicy) }).pipe(ns),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface TerminateResponsibilityTransferResponse {
  ResponsibilityTransfer?: ResponsibilityTransfer;
}
export const TerminateResponsibilityTransferResponse = S.suspend(() =>
  S.Struct({ ResponsibilityTransfer: S.optional(ResponsibilityTransfer) }).pipe(
    ns,
  ),
).annotations({
  identifier: "TerminateResponsibilityTransferResponse",
}) as any as S.Schema<TerminateResponsibilityTransferResponse>;
export interface UpdateOrganizationalUnitResponse {
  OrganizationalUnit?: OrganizationalUnit;
}
export const UpdateOrganizationalUnitResponse = S.suspend(() =>
  S.Struct({ OrganizationalUnit: S.optional(OrganizationalUnit) }).pipe(ns),
).annotations({
  identifier: "UpdateOrganizationalUnitResponse",
}) as any as S.Schema<UpdateOrganizationalUnitResponse>;
export interface UpdatePolicyResponse {
  Policy?: Policy;
}
export const UpdatePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(Policy) }).pipe(ns),
).annotations({
  identifier: "UpdatePolicyResponse",
}) as any as S.Schema<UpdatePolicyResponse>;
export interface UpdateResponsibilityTransferResponse {
  ResponsibilityTransfer?: ResponsibilityTransfer;
}
export const UpdateResponsibilityTransferResponse = S.suspend(() =>
  S.Struct({ ResponsibilityTransfer: S.optional(ResponsibilityTransfer) }).pipe(
    ns,
  ),
).annotations({
  identifier: "UpdateResponsibilityTransferResponse",
}) as any as S.Schema<UpdateResponsibilityTransferResponse>;
export interface HandshakeResource {
  Value?: string | redacted.Redacted<string>;
  Type?: HandshakeResourceType;
  Resources?: HandshakeResource[];
}
export const HandshakeResource = S.suspend(() =>
  S.Struct({
    Value: S.optional(SensitiveString),
    Type: S.optional(HandshakeResourceType),
    Resources: S.optional(
      S.suspend(() => HandshakeResources).annotations({
        identifier: "HandshakeResources",
      }),
    ),
  }),
).annotations({
  identifier: "HandshakeResource",
}) as any as S.Schema<HandshakeResource>;
export type PolicyIds = string[];
export const PolicyIds = S.Array(S.String);
export type ParentType = "ROOT" | "ORGANIZATIONAL_UNIT" | (string & {});
export const ParentType = S.String;
export type TargetType =
  | "ACCOUNT"
  | "ORGANIZATIONAL_UNIT"
  | "ROOT"
  | (string & {});
export const TargetType = S.String;
export type AccessDeniedForDependencyExceptionReason =
  | "ACCESS_DENIED_DURING_CREATE_SERVICE_LINKED_ROLE"
  | (string & {});
export const AccessDeniedForDependencyExceptionReason = S.String;
export interface EffectivePolicy {
  PolicyContent?: string;
  LastUpdatedTimestamp?: Date;
  TargetId?: string;
  PolicyType?: EffectivePolicyType;
}
export const EffectivePolicy = S.suspend(() =>
  S.Struct({
    PolicyContent: S.optional(S.String),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TargetId: S.optional(S.String),
    PolicyType: S.optional(EffectivePolicyType),
  }),
).annotations({
  identifier: "EffectivePolicy",
}) as any as S.Schema<EffectivePolicy>;
export type InvalidInputExceptionReason =
  | "INVALID_PARTY_TYPE_TARGET"
  | "INVALID_SYNTAX_ORGANIZATION_ARN"
  | "INVALID_SYNTAX_POLICY_ID"
  | "INVALID_ENUM"
  | "INVALID_ENUM_POLICY_TYPE"
  | "INVALID_LIST_MEMBER"
  | "MAX_LENGTH_EXCEEDED"
  | "MAX_VALUE_EXCEEDED"
  | "MIN_LENGTH_EXCEEDED"
  | "MIN_VALUE_EXCEEDED"
  | "IMMUTABLE_POLICY"
  | "INVALID_PATTERN"
  | "INVALID_PATTERN_TARGET_ID"
  | "INPUT_REQUIRED"
  | "INVALID_NEXT_TOKEN"
  | "MAX_LIMIT_EXCEEDED_FILTER"
  | "MOVING_ACCOUNT_BETWEEN_DIFFERENT_ROOTS"
  | "INVALID_FULL_NAME_TARGET"
  | "UNRECOGNIZED_SERVICE_PRINCIPAL"
  | "INVALID_ROLE_NAME"
  | "INVALID_SYSTEM_TAGS_PARAMETER"
  | "DUPLICATE_TAG_KEY"
  | "TARGET_NOT_SUPPORTED"
  | "INVALID_EMAIL_ADDRESS_TARGET"
  | "INVALID_RESOURCE_POLICY_JSON"
  | "INVALID_PRINCIPAL"
  | "UNSUPPORTED_ACTION_IN_RESOURCE_POLICY"
  | "UNSUPPORTED_POLICY_TYPE_IN_RESOURCE_POLICY"
  | "UNSUPPORTED_RESOURCE_IN_RESOURCE_POLICY"
  | "NON_DETACHABLE_POLICY"
  | "CALLER_REQUIRED_FIELD_MISSING"
  | "UNSUPPORTED_ACTION_IN_RESPONSIBILITY_TRANSFER"
  | "START_DATE_NOT_BEGINNING_OF_MONTH"
  | "START_DATE_NOT_BEGINNING_OF_DAY"
  | "START_DATE_TOO_EARLY"
  | "START_DATE_TOO_LATE"
  | "INVALID_START_DATE"
  | "END_DATE_NOT_END_OF_MONTH"
  | "END_DATE_TOO_EARLY"
  | "INVALID_END_DATE"
  | (string & {});
export const InvalidInputExceptionReason = S.String;
export type ConstraintViolationExceptionReason =
  | "ACCOUNT_NUMBER_LIMIT_EXCEEDED"
  | "HANDSHAKE_RATE_LIMIT_EXCEEDED"
  | "OU_NUMBER_LIMIT_EXCEEDED"
  | "OU_DEPTH_LIMIT_EXCEEDED"
  | "POLICY_NUMBER_LIMIT_EXCEEDED"
  | "POLICY_CONTENT_LIMIT_EXCEEDED"
  | "MAX_POLICY_TYPE_ATTACHMENT_LIMIT_EXCEEDED"
  | "MIN_POLICY_TYPE_ATTACHMENT_LIMIT_EXCEEDED"
  | "ACCOUNT_CANNOT_LEAVE_ORGANIZATION"
  | "ACCOUNT_CANNOT_LEAVE_WITHOUT_EULA"
  | "ACCOUNT_CANNOT_LEAVE_WITHOUT_PHONE_VERIFICATION"
  | "MASTER_ACCOUNT_PAYMENT_INSTRUMENT_REQUIRED"
  | "MEMBER_ACCOUNT_PAYMENT_INSTRUMENT_REQUIRED"
  | "ACCOUNT_CREATION_RATE_LIMIT_EXCEEDED"
  | "MASTER_ACCOUNT_ADDRESS_DOES_NOT_MATCH_MARKETPLACE"
  | "MASTER_ACCOUNT_MISSING_CONTACT_INFO"
  | "MASTER_ACCOUNT_NOT_GOVCLOUD_ENABLED"
  | "ORGANIZATION_NOT_IN_ALL_FEATURES_MODE"
  | "CREATE_ORGANIZATION_IN_BILLING_MODE_UNSUPPORTED_REGION"
  | "EMAIL_VERIFICATION_CODE_EXPIRED"
  | "WAIT_PERIOD_ACTIVE"
  | "MAX_TAG_LIMIT_EXCEEDED"
  | "TAG_POLICY_VIOLATION"
  | "MAX_DELEGATED_ADMINISTRATORS_FOR_SERVICE_LIMIT_EXCEEDED"
  | "CANNOT_REGISTER_MASTER_AS_DELEGATED_ADMINISTRATOR"
  | "CANNOT_REMOVE_DELEGATED_ADMINISTRATOR_FROM_ORG"
  | "DELEGATED_ADMINISTRATOR_EXISTS_FOR_THIS_SERVICE"
  | "POLICY_TYPE_ENABLED_FOR_THIS_SERVICE"
  | "MASTER_ACCOUNT_MISSING_BUSINESS_LICENSE"
  | "CANNOT_CLOSE_MANAGEMENT_ACCOUNT"
  | "CLOSE_ACCOUNT_QUOTA_EXCEEDED"
  | "CLOSE_ACCOUNT_REQUESTS_LIMIT_EXCEEDED"
  | "SERVICE_ACCESS_NOT_ENABLED"
  | "INVALID_PAYMENT_INSTRUMENT"
  | "ACCOUNT_CREATION_NOT_COMPLETE"
  | "CANNOT_REGISTER_SUSPENDED_ACCOUNT_AS_DELEGATED_ADMINISTRATOR"
  | "ALL_FEATURES_MIGRATION_ORGANIZATION_SIZE_LIMIT_EXCEEDED"
  | "RESPONSIBILITY_TRANSFER_MAX_LEVEL_VIOLATION"
  | "RESPONSIBILITY_TRANSFER_MAX_INBOUND_QUOTA_VIOLATION"
  | "RESPONSIBILITY_TRANSFER_MAX_OUTBOUND_QUOTA_VIOLATION"
  | "RESPONSIBILITY_TRANSFER_MAX_TRANSFERS_QUOTA_VIOLATION"
  | "ACTIVE_RESPONSIBILITY_TRANSFER_PROCESS"
  | "TRANSFER_RESPONSIBILITY_TARGET_DELETION_IN_PROGRESS"
  | "TRANSFER_RESPONSIBILITY_SOURCE_DELETION_IN_PROGRESS"
  | "UNSUPPORTED_PRICING"
  | (string & {});
export const ConstraintViolationExceptionReason = S.String;
export interface EnabledServicePrincipal {
  ServicePrincipal?: string;
  DateEnabled?: Date;
}
export const EnabledServicePrincipal = S.suspend(() =>
  S.Struct({
    ServicePrincipal: S.optional(S.String),
    DateEnabled: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "EnabledServicePrincipal",
}) as any as S.Schema<EnabledServicePrincipal>;
export type EnabledServicePrincipals = EnabledServicePrincipal[];
export const EnabledServicePrincipals = S.Array(EnabledServicePrincipal);
export interface Child {
  Id?: string;
  Type?: ChildType;
}
export const Child = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Type: S.optional(ChildType) }),
).annotations({ identifier: "Child" }) as any as S.Schema<Child>;
export type Children = Child[];
export const Children = S.Array(Child);
export interface DelegatedAdministrator {
  Id?: string;
  Arn?: string;
  Email?: string | redacted.Redacted<string>;
  Name?: string | redacted.Redacted<string>;
  Status?: AccountStatus;
  State?: AccountState;
  JoinedMethod?: AccountJoinedMethod;
  JoinedTimestamp?: Date;
  DelegationEnabledDate?: Date;
}
export const DelegatedAdministrator = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Email: S.optional(SensitiveString),
    Name: S.optional(SensitiveString),
    Status: S.optional(AccountStatus),
    State: S.optional(AccountState),
    JoinedMethod: S.optional(AccountJoinedMethod),
    JoinedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DelegationEnabledDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DelegatedAdministrator",
}) as any as S.Schema<DelegatedAdministrator>;
export type DelegatedAdministrators = DelegatedAdministrator[];
export const DelegatedAdministrators = S.Array(DelegatedAdministrator);
export interface DelegatedService {
  ServicePrincipal?: string;
  DelegationEnabledDate?: Date;
}
export const DelegatedService = S.suspend(() =>
  S.Struct({
    ServicePrincipal: S.optional(S.String),
    DelegationEnabledDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DelegatedService",
}) as any as S.Schema<DelegatedService>;
export type DelegatedServices = DelegatedService[];
export const DelegatedServices = S.Array(DelegatedService);
export interface EffectivePolicyValidationError {
  ErrorCode?: string;
  ErrorMessage?: string;
  PathToError?: string;
  ContributingPolicies?: string[];
}
export const EffectivePolicyValidationError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    PathToError: S.optional(S.String),
    ContributingPolicies: S.optional(PolicyIds),
  }),
).annotations({
  identifier: "EffectivePolicyValidationError",
}) as any as S.Schema<EffectivePolicyValidationError>;
export type EffectivePolicyValidationErrors = EffectivePolicyValidationError[];
export const EffectivePolicyValidationErrors = S.Array(
  EffectivePolicyValidationError,
);
export interface Parent {
  Id?: string;
  Type?: ParentType;
}
export const Parent = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Type: S.optional(ParentType) }),
).annotations({ identifier: "Parent" }) as any as S.Schema<Parent>;
export type Parents = Parent[];
export const Parents = S.Array(Parent);
export interface PolicyTargetSummary {
  TargetId?: string;
  Arn?: string;
  Name?: string;
  Type?: TargetType;
}
export const PolicyTargetSummary = S.suspend(() =>
  S.Struct({
    TargetId: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(TargetType),
  }),
).annotations({
  identifier: "PolicyTargetSummary",
}) as any as S.Schema<PolicyTargetSummary>;
export type PolicyTargets = PolicyTargetSummary[];
export const PolicyTargets = S.Array(PolicyTargetSummary);
export interface CreateAccountResponse {
  CreateAccountStatus?: CreateAccountStatus;
}
export const CreateAccountResponse = S.suspend(() =>
  S.Struct({ CreateAccountStatus: S.optional(CreateAccountStatus) }).pipe(ns),
).annotations({
  identifier: "CreateAccountResponse",
}) as any as S.Schema<CreateAccountResponse>;
export interface CreateGovCloudAccountResponse {
  CreateAccountStatus?: CreateAccountStatus;
}
export const CreateGovCloudAccountResponse = S.suspend(() =>
  S.Struct({ CreateAccountStatus: S.optional(CreateAccountStatus) }).pipe(ns),
).annotations({
  identifier: "CreateGovCloudAccountResponse",
}) as any as S.Schema<CreateGovCloudAccountResponse>;
export interface CreateOrganizationalUnitResponse {
  OrganizationalUnit?: OrganizationalUnit;
}
export const CreateOrganizationalUnitResponse = S.suspend(() =>
  S.Struct({ OrganizationalUnit: S.optional(OrganizationalUnit) }).pipe(ns),
).annotations({
  identifier: "CreateOrganizationalUnitResponse",
}) as any as S.Schema<CreateOrganizationalUnitResponse>;
export interface CreatePolicyResponse {
  Policy?: Policy;
}
export const CreatePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(Policy) }).pipe(ns),
).annotations({
  identifier: "CreatePolicyResponse",
}) as any as S.Schema<CreatePolicyResponse>;
export interface DescribeAccountResponse {
  Account?: Account;
}
export const DescribeAccountResponse = S.suspend(() =>
  S.Struct({ Account: S.optional(Account) }).pipe(ns),
).annotations({
  identifier: "DescribeAccountResponse",
}) as any as S.Schema<DescribeAccountResponse>;
export interface DescribeEffectivePolicyResponse {
  EffectivePolicy?: EffectivePolicy;
}
export const DescribeEffectivePolicyResponse = S.suspend(() =>
  S.Struct({ EffectivePolicy: S.optional(EffectivePolicy) }).pipe(ns),
).annotations({
  identifier: "DescribeEffectivePolicyResponse",
}) as any as S.Schema<DescribeEffectivePolicyResponse>;
export interface DescribeOrganizationResponse {
  Organization?: Organization;
}
export const DescribeOrganizationResponse = S.suspend(() =>
  S.Struct({ Organization: S.optional(Organization) }).pipe(ns),
).annotations({
  identifier: "DescribeOrganizationResponse",
}) as any as S.Schema<DescribeOrganizationResponse>;
export interface DescribeResourcePolicyResponse {
  ResourcePolicy?: ResourcePolicy;
}
export const DescribeResourcePolicyResponse = S.suspend(() =>
  S.Struct({ ResourcePolicy: S.optional(ResourcePolicy) }).pipe(ns),
).annotations({
  identifier: "DescribeResourcePolicyResponse",
}) as any as S.Schema<DescribeResourcePolicyResponse>;
export interface DisablePolicyTypeResponse {
  Root?: Root;
}
export const DisablePolicyTypeResponse = S.suspend(() =>
  S.Struct({ Root: S.optional(Root) }).pipe(ns),
).annotations({
  identifier: "DisablePolicyTypeResponse",
}) as any as S.Schema<DisablePolicyTypeResponse>;
export interface EnableAllFeaturesResponse {
  Handshake?: Handshake;
}
export const EnableAllFeaturesResponse = S.suspend(() =>
  S.Struct({ Handshake: S.optional(Handshake) }).pipe(ns),
).annotations({
  identifier: "EnableAllFeaturesResponse",
}) as any as S.Schema<EnableAllFeaturesResponse>;
export interface InviteAccountToOrganizationResponse {
  Handshake?: Handshake;
}
export const InviteAccountToOrganizationResponse = S.suspend(() =>
  S.Struct({ Handshake: S.optional(Handshake) }).pipe(ns),
).annotations({
  identifier: "InviteAccountToOrganizationResponse",
}) as any as S.Schema<InviteAccountToOrganizationResponse>;
export interface ListAWSServiceAccessForOrganizationResponse {
  EnabledServicePrincipals?: EnabledServicePrincipal[];
  NextToken?: string;
}
export const ListAWSServiceAccessForOrganizationResponse = S.suspend(() =>
  S.Struct({
    EnabledServicePrincipals: S.optional(EnabledServicePrincipals),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAWSServiceAccessForOrganizationResponse",
}) as any as S.Schema<ListAWSServiceAccessForOrganizationResponse>;
export interface ListChildrenResponse {
  Children?: Child[];
  NextToken?: string;
}
export const ListChildrenResponse = S.suspend(() =>
  S.Struct({
    Children: S.optional(Children),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListChildrenResponse",
}) as any as S.Schema<ListChildrenResponse>;
export interface ListDelegatedAdministratorsResponse {
  DelegatedAdministrators?: DelegatedAdministrator[];
  NextToken?: string;
}
export const ListDelegatedAdministratorsResponse = S.suspend(() =>
  S.Struct({
    DelegatedAdministrators: S.optional(DelegatedAdministrators),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDelegatedAdministratorsResponse",
}) as any as S.Schema<ListDelegatedAdministratorsResponse>;
export interface ListDelegatedServicesForAccountResponse {
  DelegatedServices?: DelegatedService[];
  NextToken?: string;
}
export const ListDelegatedServicesForAccountResponse = S.suspend(() =>
  S.Struct({
    DelegatedServices: S.optional(DelegatedServices),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDelegatedServicesForAccountResponse",
}) as any as S.Schema<ListDelegatedServicesForAccountResponse>;
export interface ListEffectivePolicyValidationErrorsResponse {
  AccountId?: string;
  PolicyType?: EffectivePolicyType;
  Path?: string;
  EvaluationTimestamp?: Date;
  NextToken?: string;
  EffectivePolicyValidationErrors?: EffectivePolicyValidationError[];
}
export const ListEffectivePolicyValidationErrorsResponse = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    PolicyType: S.optional(EffectivePolicyType),
    Path: S.optional(S.String),
    EvaluationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NextToken: S.optional(S.String),
    EffectivePolicyValidationErrors: S.optional(
      EffectivePolicyValidationErrors,
    ),
  }).pipe(ns),
).annotations({
  identifier: "ListEffectivePolicyValidationErrorsResponse",
}) as any as S.Schema<ListEffectivePolicyValidationErrorsResponse>;
export interface ListHandshakesForAccountResponse {
  Handshakes?: Handshake[];
  NextToken?: string;
}
export const ListHandshakesForAccountResponse = S.suspend(() =>
  S.Struct({
    Handshakes: S.optional(Handshakes),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListHandshakesForAccountResponse",
}) as any as S.Schema<ListHandshakesForAccountResponse>;
export interface ListParentsResponse {
  Parents?: Parent[];
  NextToken?: string;
}
export const ListParentsResponse = S.suspend(() =>
  S.Struct({
    Parents: S.optional(Parents),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListParentsResponse",
}) as any as S.Schema<ListParentsResponse>;
export interface ListPoliciesResponse {
  Policies?: PolicySummary[];
  NextToken?: string;
}
export const ListPoliciesResponse = S.suspend(() =>
  S.Struct({
    Policies: S.optional(Policies),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPoliciesResponse",
}) as any as S.Schema<ListPoliciesResponse>;
export interface ListTargetsForPolicyResponse {
  Targets?: PolicyTargetSummary[];
  NextToken?: string;
}
export const ListTargetsForPolicyResponse = S.suspend(() =>
  S.Struct({
    Targets: S.optional(PolicyTargets),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTargetsForPolicyResponse",
}) as any as S.Schema<ListTargetsForPolicyResponse>;
export type HandshakeConstraintViolationExceptionReason =
  | "ACCOUNT_NUMBER_LIMIT_EXCEEDED"
  | "HANDSHAKE_RATE_LIMIT_EXCEEDED"
  | "ALREADY_IN_AN_ORGANIZATION"
  | "ORGANIZATION_ALREADY_HAS_ALL_FEATURES"
  | "ORGANIZATION_IS_ALREADY_PENDING_ALL_FEATURES_MIGRATION"
  | "INVITE_DISABLED_DURING_ENABLE_ALL_FEATURES"
  | "PAYMENT_INSTRUMENT_REQUIRED"
  | "ORGANIZATION_FROM_DIFFERENT_SELLER_OF_RECORD"
  | "ORGANIZATION_MEMBERSHIP_CHANGE_RATE_LIMIT_EXCEEDED"
  | "MANAGEMENT_ACCOUNT_EMAIL_NOT_VERIFIED"
  | "RESPONSIBILITY_TRANSFER_ALREADY_EXISTS"
  | "SOURCE_AND_TARGET_CANNOT_MATCH"
  | "UNUSED_PREPAYMENT_BALANCE"
  | "LEGACY_PERMISSIONS_STILL_IN_USE"
  | (string & {});
export const HandshakeConstraintViolationExceptionReason = S.String;
export interface DescribeResponsibilityTransferResponse {
  ResponsibilityTransfer?: ResponsibilityTransfer;
}
export const DescribeResponsibilityTransferResponse = S.suspend(() =>
  S.Struct({ ResponsibilityTransfer: S.optional(ResponsibilityTransfer) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeResponsibilityTransferResponse",
}) as any as S.Schema<DescribeResponsibilityTransferResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class AWSOrganizationsNotInUseException extends S.TaggedError<AWSOrganizationsNotInUseException>()(
  "AWSOrganizationsNotInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccountNotFoundException extends S.TaggedError<AccountNotFoundException>()(
  "AccountNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccountAlreadyRegisteredException extends S.TaggedError<AccountAlreadyRegisteredException>()(
  "AccountAlreadyRegisteredException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class AccountAlreadyClosedException extends S.TaggedError<AccountAlreadyClosedException>()(
  "AccountAlreadyClosedException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class AccessDeniedForDependencyException extends S.TaggedError<AccessDeniedForDependencyException>()(
  "AccessDeniedForDependencyException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(AccessDeniedForDependencyExceptionReason),
  },
).pipe(C.withAuthError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class AccountNotRegisteredException extends S.TaggedError<AccountNotRegisteredException>()(
  "AccountNotRegisteredException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class CreateAccountStatusNotFoundException extends S.TaggedError<CreateAccountStatusNotFoundException>()(
  "CreateAccountStatusNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(InvalidInputExceptionReason),
  },
).pipe(C.withBadRequestError) {}
export class ConstraintViolationException extends S.TaggedError<ConstraintViolationException>()(
  "ConstraintViolationException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(ConstraintViolationExceptionReason),
  },
).pipe(C.withConflictError) {}
export class HandshakeAlreadyInStateException extends S.TaggedError<HandshakeAlreadyInStateException>()(
  "HandshakeAlreadyInStateException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class OrganizationalUnitNotFoundException extends S.TaggedError<OrganizationalUnitNotFoundException>()(
  "OrganizationalUnitNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccountOwnerNotVerifiedException extends S.TaggedError<AccountOwnerNotVerifiedException>()(
  "AccountOwnerNotVerifiedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class EffectivePolicyNotFoundException extends S.TaggedError<EffectivePolicyNotFoundException>()(
  "EffectivePolicyNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ParentNotFoundException extends S.TaggedError<ParentNotFoundException>()(
  "ParentNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ChildNotFoundException extends S.TaggedError<ChildNotFoundException>()(
  "ChildNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PolicyNotFoundException extends S.TaggedError<PolicyNotFoundException>()(
  "PolicyNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AlreadyInOrganizationException extends S.TaggedError<AlreadyInOrganizationException>()(
  "AlreadyInOrganizationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class OrganizationNotEmptyException extends S.TaggedError<OrganizationNotEmptyException>()(
  "OrganizationNotEmptyException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class HandshakeNotFoundException extends S.TaggedError<HandshakeNotFoundException>()(
  "HandshakeNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PolicyChangesInProgressException extends S.TaggedError<PolicyChangesInProgressException>()(
  "PolicyChangesInProgressException",
  { Message: S.optional(S.String) },
) {}
export class DuplicateHandshakeException extends S.TaggedError<DuplicateHandshakeException>()(
  "DuplicateHandshakeException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidResponsibilityTransferTransitionException extends S.TaggedError<InvalidResponsibilityTransferTransitionException>()(
  "InvalidResponsibilityTransferTransitionException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DuplicateOrganizationalUnitException extends S.TaggedError<DuplicateOrganizationalUnitException>()(
  "DuplicateOrganizationalUnitException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DuplicatePolicyException extends S.TaggedError<DuplicatePolicyException>()(
  "DuplicatePolicyException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class OrganizationalUnitNotEmptyException extends S.TaggedError<OrganizationalUnitNotEmptyException>()(
  "OrganizationalUnitNotEmptyException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class PolicyInUseException extends S.TaggedError<PolicyInUseException>()(
  "PolicyInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourcePolicyNotFoundException extends S.TaggedError<ResourcePolicyNotFoundException>()(
  "ResourcePolicyNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DuplicatePolicyAttachmentException extends S.TaggedError<DuplicatePolicyAttachmentException>()(
  "DuplicatePolicyAttachmentException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DestinationParentNotFoundException extends S.TaggedError<DestinationParentNotFoundException>()(
  "DestinationParentNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MasterCannotLeaveOrganizationException extends S.TaggedError<MasterCannotLeaveOrganizationException>()(
  "MasterCannotLeaveOrganizationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResponsibilityTransferNotFoundException extends S.TaggedError<ResponsibilityTransferNotFoundException>()(
  "ResponsibilityTransferNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FinalizingOrganizationException extends S.TaggedError<FinalizingOrganizationException>()(
  "FinalizingOrganizationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class HandshakeConstraintViolationException extends S.TaggedError<HandshakeConstraintViolationException>()(
  "HandshakeConstraintViolationException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(HandshakeConstraintViolationExceptionReason),
  },
).pipe(C.withConflictError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Type: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class PolicyTypeAlreadyEnabledException extends S.TaggedError<PolicyTypeAlreadyEnabledException>()(
  "PolicyTypeAlreadyEnabledException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResponsibilityTransferAlreadyInStatusException extends S.TaggedError<ResponsibilityTransferAlreadyInStatusException>()(
  "ResponsibilityTransferAlreadyInStatusException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PolicyTypeNotEnabledException extends S.TaggedError<PolicyTypeNotEnabledException>()(
  "PolicyTypeNotEnabledException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DuplicateAccountException extends S.TaggedError<DuplicateAccountException>()(
  "DuplicateAccountException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidHandshakeTransitionException extends S.TaggedError<InvalidHandshakeTransitionException>()(
  "InvalidHandshakeTransitionException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class TargetNotFoundException extends S.TaggedError<TargetNotFoundException>()(
  "TargetNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PolicyNotAttachedException extends S.TaggedError<PolicyNotAttachedException>()(
  "PolicyNotAttachedException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class PolicyTypeNotAvailableForOrganizationException extends S.TaggedError<PolicyTypeNotAvailableForOrganizationException>()(
  "PolicyTypeNotAvailableForOrganizationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class UnsupportedAPIEndpointException extends S.TaggedError<UnsupportedAPIEndpointException>()(
  "UnsupportedAPIEndpointException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class SourceParentNotFoundException extends S.TaggedError<SourceParentNotFoundException>()(
  "SourceParentNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RootNotFoundException extends S.TaggedError<RootNotFoundException>()(
  "RootNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves information about the organization that the user's account belongs
 * to.
 *
 * You can call this operation from any account in a organization.
 *
 * Even if a policy type is shown as available in the organization, you can disable
 * it separately at the root level with DisablePolicyType. Use ListRoots to see the status of policy types for a specified
 * root.
 */
export const describeOrganization: (
  input: DescribeOrganizationRequest,
) => effect.Effect<
  DescribeOrganizationResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOrganizationRequest,
  output: DescribeOrganizationResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Declines a Handshake.
 *
 * Only the account that receives a handshake can call this operation. The sender of the handshake can use CancelHandshake to
 * cancel if the handshake hasn't yet been responded to.
 *
 * You can view canceled handshakes in API responses for 30 days before they are
 * deleted.
 */
export const declineHandshake: (
  input: DeclineHandshakeRequest,
) => effect.Effect<
  DeclineHandshakeResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | HandshakeAlreadyInStateException
  | HandshakeNotFoundException
  | InvalidHandshakeTransitionException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeclineHandshakeRequest,
  output: DeclineHandshakeResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    HandshakeAlreadyInStateException,
    HandshakeNotFoundException,
    InvalidHandshakeTransitionException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds one or more tags to the specified resource.
 *
 * Currently, you can attach tags to the following resources in Organizations.
 *
 * - Amazon Web Services account
 *
 * - Organization root
 *
 * - Organizational unit (OU)
 *
 * - Policy (any type)
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TargetNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TargetNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about an organizational unit (OU).
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const describeOrganizationalUnit: (
  input: DescribeOrganizationalUnitRequest,
) => effect.Effect<
  DescribeOrganizationalUnitResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | InvalidInputException
  | OrganizationalUnitNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOrganizationalUnitRequest,
  output: DescribeOrganizationalUnitResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    OrganizationalUnitNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists all of the organizational units (OUs) or accounts that are contained in the
 * specified parent OU or root. This operation, along with ListParents
 * enables you to traverse the tree structure that makes up this root.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listChildren: {
  (
    input: ListChildrenRequest,
  ): effect.Effect<
    ListChildrenResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ParentNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChildrenRequest,
  ) => stream.Stream<
    ListChildrenResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ParentNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChildrenRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ParentNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChildrenRequest,
  output: ListChildrenResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ParentNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the root or organizational units (OUs) that serve as the immediate parent of the
 * specified child OU or account. This operation, along with ListChildren
 * enables you to traverse the tree structure that makes up this root.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 *
 * In the current release, a child can have only a single parent.
 */
export const listParents: {
  (
    input: ListParentsRequest,
  ): effect.Effect<
    ListParentsResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ChildNotFoundException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListParentsRequest,
  ) => stream.Stream<
    ListParentsResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ChildNotFoundException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListParentsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ChildNotFoundException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListParentsRequest,
  output: ListParentsResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ChildNotFoundException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates an Amazon Web Services organization. The account whose user is calling the
 * `CreateOrganization` operation automatically becomes the management account of the new organization.
 *
 * This operation must be called using credentials from the account that is to become the
 * new organization's management account. The principal must also have the relevant IAM
 * permissions.
 *
 * By default (or if you set the `FeatureSet` parameter to `ALL`),
 * the new organization is created with all features enabled and service control policies
 * automatically enabled in the root. If you instead choose to create the organization
 * supporting only the consolidated billing features by setting the `FeatureSet`
 * parameter to `CONSOLIDATED_BILLING`, no policy types are enabled by default
 * and you can't use organization policies.
 */
export const createOrganization: (
  input: CreateOrganizationRequest,
) => effect.Effect<
  CreateOrganizationResponse,
  | AccessDeniedException
  | AccessDeniedForDependencyException
  | AlreadyInOrganizationException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOrganizationRequest,
  output: CreateOrganizationResponse,
  errors: [
    AccessDeniedException,
    AccessDeniedForDependencyException,
    AlreadyInOrganizationException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the organization. You can delete an organization only by using credentials
 * from the management account. The organization must be empty of member accounts.
 */
export const deleteOrganization: (
  input: DeleteOrganizationRequest,
) => effect.Effect<
  DeleteOrganizationResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | OrganizationNotEmptyException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOrganizationRequest,
  output: DeleteOrganizationResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    OrganizationNotEmptyException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns details for a handshake. A handshake is the secure exchange of information
 * between two Amazon Web Services accounts: a sender and a recipient.
 *
 * You can view `ACCEPTED`, `DECLINED`, or `CANCELED`
 * handshakes in API Responses for 30 days before they are deleted.
 *
 * You can call this operation from any account in a organization.
 */
export const describeHandshake: (
  input: DescribeHandshakeRequest,
) => effect.Effect<
  DescribeHandshakeResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | HandshakeNotFoundException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHandshakeRequest,
  output: DescribeHandshakeResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    HandshakeNotFoundException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Renames the specified organizational unit (OU). The ID and ARN don't change. The child
 * OUs and accounts remain in place, and any attached policies of the OU remain
 * attached.
 *
 * You can only call this operation from the management account.
 */
export const updateOrganizationalUnit: (
  input: UpdateOrganizationalUnitRequest,
) => effect.Effect<
  UpdateOrganizationalUnitResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | DuplicateOrganizationalUnitException
  | InvalidInputException
  | OrganizationalUnitNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOrganizationalUnitRequest,
  output: UpdateOrganizationalUnitResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    DuplicateOrganizationalUnitException,
    InvalidInputException,
    OrganizationalUnitNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an organizational unit (OU) from a root or another OU. You must first remove
 * all accounts and child OUs from the OU that you want to delete.
 *
 * You can only call this operation from the management account.
 */
export const deleteOrganizationalUnit: (
  input: DeleteOrganizationalUnitRequest,
) => effect.Effect<
  DeleteOrganizationalUnitResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | InvalidInputException
  | OrganizationalUnitNotEmptyException
  | OrganizationalUnitNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOrganizationalUnitRequest,
  output: DeleteOrganizationalUnitResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    InvalidInputException,
    OrganizationalUnitNotEmptyException,
    OrganizationalUnitNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes the specified account from the organization.
 *
 * The removed account becomes a standalone account that isn't a member of any
 * organization. It's no longer subject to any policies and is responsible for its own bill
 * payments. The organization's management account is no longer charged for any expenses
 * accrued by the member account after it's removed from the organization.
 *
 * You can only call this operation from the management account. Member accounts can remove themselves with LeaveOrganization instead.
 *
 * - You can remove an account from your organization only if the account is
 * configured with the information required to operate as a standalone account.
 * When you create an account in an organization using the Organizations console,
 * API, or CLI commands, the information required of standalone accounts is
 * *not* automatically collected. For more information,
 * see Considerations before removing an account from an organization
 * in the *Organizations User Guide*.
 *
 * - The account that you want to leave must not be a delegated administrator
 * account for any Amazon Web Services service enabled for your organization. If the account
 * is a delegated administrator, you must first change the delegated
 * administrator account to another account that is remaining in the
 * organization.
 *
 * - After the account leaves the organization, all tags that were attached to
 * the account object in the organization are deleted. Amazon Web Services accounts outside
 * of an organization do not support tags.
 */
export const removeAccountFromOrganization: (
  input: RemoveAccountFromOrganizationRequest,
) => effect.Effect<
  RemoveAccountFromOrganizationResponse,
  | AccessDeniedException
  | AccountNotFoundException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | MasterCannotLeaveOrganizationException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveAccountFromOrganizationRequest,
  output: RemoveAccountFromOrganizationResponse,
  errors: [
    AccessDeniedException,
    AccountNotFoundException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    MasterCannotLeaveOrganizationException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the recent handshakes that you have received.
 *
 * You can view `CANCELED`, `ACCEPTED`, `DECLINED`, or
 * `EXPIRED` handshakes in API responses for 30 days before they are
 * deleted.
 *
 * You can call this operation from any account in a organization.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 */
export const listHandshakesForAccount: {
  (
    input: ListHandshakesForAccountRequest,
  ): effect.Effect<
    ListHandshakesForAccountResponse,
    | AccessDeniedException
    | ConcurrentModificationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHandshakesForAccountRequest,
  ) => stream.Stream<
    ListHandshakesForAccountResponse,
    | AccessDeniedException
    | ConcurrentModificationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHandshakesForAccountRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConcurrentModificationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHandshakesForAccountRequest,
  output: ListHandshakesForAccountResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the recent handshakes that you have sent.
 *
 * You can view `CANCELED`, `ACCEPTED`, `DECLINED`, or
 * `EXPIRED` handshakes in API responses for 30 days before they are
 * deleted.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 */
export const listHandshakesForOrganization: {
  (
    input: ListHandshakesForOrganizationRequest,
  ): effect.Effect<
    ListHandshakesForOrganizationResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConcurrentModificationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHandshakesForOrganizationRequest,
  ) => stream.Stream<
    ListHandshakesForOrganizationResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConcurrentModificationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHandshakesForOrganizationRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConcurrentModificationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHandshakesForOrganizationRequest,
  output: ListHandshakesForOrganizationResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the accounts in the organization. To request only the accounts in a
 * specified root or organizational unit (OU), use the ListAccountsForParent operation instead.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listAccounts: {
  (
    input: ListAccountsRequest,
  ): effect.Effect<
    ListAccountsResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountsRequest,
  ) => stream.Stream<
    ListAccountsResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountsRequest,
  output: ListAccountsResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the roots that are defined in the current organization.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 *
 * Policy types can be enabled and disabled in roots. This is distinct from whether
 * they're available in the organization. When you enable all features, you make policy
 * types available for use in that organization. Individual policy types can then be
 * enabled and disabled in a root. To see the availability of a policy type in an
 * organization, use DescribeOrganization.
 */
export const listRoots: {
  (
    input: ListRootsRequest,
  ): effect.Effect<
    ListRootsResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRootsRequest,
  ) => stream.Stream<
    ListRootsResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRootsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRootsRequest,
  output: ListRootsResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves Organizations-related information about the specified account.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const describeAccount: (
  input: DescribeAccountRequest,
) => effect.Effect<
  DescribeAccountResponse,
  | AccessDeniedException
  | AccountNotFoundException
  | AWSOrganizationsNotInUseException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountRequest,
  output: DescribeAccountResponse,
  errors: [
    AccessDeniedException,
    AccountNotFoundException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Enables all features in an organization. This enables the use of organization policies
 * that can restrict the services and actions that can be called in each account. Until you
 * enable all features, you have access only to consolidated billing, and you can't use any
 * of the advanced account administration features that Organizations supports. For more
 * information, see Enabling all features in your organization in the
 * *Organizations User Guide*.
 *
 * This operation is required only for organizations that were created explicitly
 * with only the consolidated billing features enabled. Calling this operation sends a
 * handshake to every invited account in the organization. The feature set change can
 * be finalized and the additional features enabled only after all administrators in
 * the invited accounts approve the change by accepting the handshake.
 *
 * After you enable all features, you can separately enable or disable individual policy
 * types in a root using EnablePolicyType and DisablePolicyType. To see the status of policy types in a root, use
 * ListRoots.
 *
 * After all invited member accounts accept the handshake, you finalize the feature set
 * change by accepting the handshake that contains "Action":
 * "ENABLE_ALL_FEATURES". This completes the change.
 *
 * After you enable all features in your organization, the management account in the
 * organization can apply policies on all member accounts. These policies can restrict what
 * users and even administrators in those accounts can do. The management account can apply
 * policies that prevent accounts from leaving the organization. Ensure that your account
 * administrators are aware of this.
 *
 * You can only call this operation from the management account.
 */
export const enableAllFeatures: (
  input: EnableAllFeaturesRequest,
) => effect.Effect<
  EnableAllFeaturesResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | HandshakeConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableAllFeaturesRequest,
  output: EnableAllFeaturesResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    HandshakeConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the accounts in an organization that are contained by the specified target root
 * or organizational unit (OU). If you specify the root, you get a list of all the accounts
 * that aren't in any OU. If you specify an OU, you get a list of all the accounts in only
 * that OU and not in any child OUs. To get a list of all accounts in the organization, use
 * the ListAccounts operation.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listAccountsForParent: {
  (
    input: ListAccountsForParentRequest,
  ): effect.Effect<
    ListAccountsForParentResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ParentNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountsForParentRequest,
  ) => stream.Stream<
    ListAccountsForParentResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ParentNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountsForParentRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ParentNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountsForParentRequest,
  output: ListAccountsForParentResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ParentNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the organizational units (OUs) in a parent organizational unit or root.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listOrganizationalUnitsForParent: {
  (
    input: ListOrganizationalUnitsForParentRequest,
  ): effect.Effect<
    ListOrganizationalUnitsForParentResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ParentNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationalUnitsForParentRequest,
  ) => stream.Stream<
    ListOrganizationalUnitsForParentResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ParentNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationalUnitsForParentRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ParentNotFoundException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOrganizationalUnitsForParentRequest,
  output: ListOrganizationalUnitsForParentResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ParentNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Sends an invitation to another account to join your organization as a member account.
 * Organizations sends email on your behalf to the email address that is associated with the
 * other account's owner. The invitation is implemented as a Handshake
 * whose details are in the response.
 *
 * If you receive an exception that indicates that you exceeded your account limits
 * for the organization or that the operation failed because your organization is still
 * initializing, wait one hour and then try again. If the error persists after an hour,
 * contact Amazon Web Services
 * Support.
 *
 * If the request includes tags, then the requester must have the
 * `organizations:TagResource` permission.
 *
 * You can only call this operation from the management account.
 */
export const inviteAccountToOrganization: (
  input: InviteAccountToOrganizationRequest,
) => effect.Effect<
  InviteAccountToOrganizationResponse,
  | AccessDeniedException
  | AccountOwnerNotVerifiedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | DuplicateHandshakeException
  | FinalizingOrganizationException
  | HandshakeConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InviteAccountToOrganizationRequest,
  output: InviteAccountToOrganizationResponse,
  errors: [
    AccessDeniedException,
    AccountOwnerNotVerifiedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    DuplicateHandshakeException,
    FinalizingOrganizationException,
    HandshakeConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an organizational unit (OU) within a root or parent OU. An OU is a container
 * for accounts that enables you to organize your accounts to apply policies according to
 * your business requirements. The number of levels deep that you can nest OUs is dependent
 * upon the policy types enabled for that root. For service control policies, the limit is
 * five.
 *
 * For more information about OUs, see Managing organizational units (OUs) in the
 * *Organizations User Guide*.
 *
 * If the request includes tags, then the requester must have the
 * `organizations:TagResource` permission.
 *
 * You can only call this operation from the management account.
 */
export const createOrganizationalUnit: (
  input: CreateOrganizationalUnitRequest,
) => effect.Effect<
  CreateOrganizationalUnitResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | DuplicateOrganizationalUnitException
  | InvalidInputException
  | ParentNotFoundException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOrganizationalUnitRequest,
  output: CreateOrganizationalUnitResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    DuplicateOrganizationalUnitException,
    InvalidInputException,
    ParentNotFoundException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes a member account from its parent organization. This version of the operation
 * is performed by the account that wants to leave. To remove a member account as a user in
 * the management account, use RemoveAccountFromOrganization
 * instead.
 *
 * You can only call from operation from a member account.
 *
 * - The management account in an organization with all features enabled can
 * set service control policies (SCPs) that can restrict what administrators of
 * member accounts can do. This includes preventing them from successfully
 * calling `LeaveOrganization` and leaving the organization.
 *
 * - You can leave an organization as a member account only if the account is
 * configured with the information required to operate as a standalone account.
 * When you create an account in an organization using the Organizations console,
 * API, or CLI commands, the information required of standalone accounts is
 * *not* automatically collected. For each account that
 * you want to make standalone, you must perform the following steps. If any of
 * the steps are already completed for this account, that step doesn't
 * appear.
 *
 * - Choose a support plan
 *
 * - Provide and verify the required contact information
 *
 * - Provide a current payment method
 *
 * Amazon Web Services uses the payment method to charge for any billable (not free tier)
 * Amazon Web Services activity that occurs while the account isn't attached to an
 * organization. For more information, see Considerations before removing an account from an organization
 * in the *Organizations User Guide*.
 *
 * - The account that you want to leave must not be a delegated administrator
 * account for any Amazon Web Services service enabled for your organization. If the account
 * is a delegated administrator, you must first change the delegated
 * administrator account to another account that is remaining in the
 * organization.
 *
 * - After the account leaves the organization, all tags that were attached to
 * the account object in the organization are deleted. Amazon Web Services accounts outside
 * of an organization do not support tags.
 *
 * - A newly created account has a waiting period before it can be removed from
 * its organization. You must wait until at least four days after the account
 * was created. Invited accounts aren't subject to this waiting period.
 *
 * - If you are using an organization principal to call
 * `LeaveOrganization` across multiple accounts, you can only do
 * this up to 5 accounts per second in a single organization.
 */
export const leaveOrganization: (
  input: LeaveOrganizationRequest,
) => effect.Effect<
  LeaveOrganizationResponse,
  | AccessDeniedException
  | AccountNotFoundException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | MasterCannotLeaveOrganizationException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: LeaveOrganizationRequest,
  output: LeaveOrganizationResponse,
  errors: [
    AccessDeniedException,
    AccountNotFoundException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    MasterCannotLeaveOrganizationException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Cancels a Handshake.
 *
 * Only the account that sent a handshake can call this operation. The recipient of the handshake can't cancel it, but can use DeclineHandshake to decline. After a handshake is canceled, the
 * recipient can no longer respond to the handshake.
 *
 * You can view canceled handshakes in API responses for 30 days before they are
 * deleted.
 */
export const cancelHandshake: (
  input: CancelHandshakeRequest,
) => effect.Effect<
  CancelHandshakeResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | HandshakeAlreadyInStateException
  | HandshakeNotFoundException
  | InvalidHandshakeTransitionException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelHandshakeRequest,
  output: CancelHandshakeResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    HandshakeAlreadyInStateException,
    HandshakeNotFoundException,
    InvalidHandshakeTransitionException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Accepts a handshake by sending an `ACCEPTED` response to the sender. You
 * can view accepted handshakes in API responses for 30 days before they are
 * deleted.
 *
 * Only the management account can accept the following
 * handshakes:
 *
 * - Enable all features final confirmation
 * (`APPROVE_ALL_FEATURES`)
 *
 * - Billing transfer (`TRANSFER_RESPONSIBILITY`)
 *
 * For more information, see Enabling all features and Responding to a billing transfer invitation in the
 * *Organizations User Guide*.
 *
 * Only a member account can accept the following
 * handshakes:
 *
 * - Invitation to join (`INVITE`)
 *
 * - Approve all features request (`ENABLE_ALL_FEATURES`)
 *
 * For more information, see Responding to invitations and Enabling all features in the *Organizations User Guide*.
 */
export const acceptHandshake: (
  input: AcceptHandshakeRequest,
) => effect.Effect<
  AcceptHandshakeResponse,
  | AccessDeniedException
  | AccessDeniedForDependencyException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | HandshakeAlreadyInStateException
  | HandshakeConstraintViolationException
  | HandshakeNotFoundException
  | InvalidHandshakeTransitionException
  | InvalidInputException
  | MasterCannotLeaveOrganizationException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptHandshakeRequest,
  output: AcceptHandshakeResponse,
  errors: [
    AccessDeniedException,
    AccessDeniedForDependencyException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    HandshakeAlreadyInStateException,
    HandshakeConstraintViolationException,
    HandshakeNotFoundException,
    InvalidHandshakeTransitionException,
    InvalidInputException,
    MasterCannotLeaveOrganizationException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes any tags with the specified keys from the specified resource.
 *
 * You can attach tags to the following resources in Organizations.
 *
 * - Amazon Web Services account
 *
 * - Organization root
 *
 * - Organizational unit (OU)
 *
 * - Policy (any type)
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TargetNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TargetNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists tags that are attached to the specified resource.
 *
 * You can attach tags to the following resources in Organizations.
 *
 * - Amazon Web Services account
 *
 * - Organization root
 *
 * - Organizational unit (OU)
 *
 * - Policy (any type)
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): effect.Effect<
    ListTagsForResourceResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TargetNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    ListTagsForResourceResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TargetNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    Tag,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TargetNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ServiceException,
    TargetNotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
  } as const,
}));
/**
 * Ends a transfer. A *transfer* is an arrangement between two
 * management accounts where one account designates the other with specified
 * responsibilities for their organization.
 */
export const terminateResponsibilityTransfer: (
  input: TerminateResponsibilityTransferRequest,
) => effect.Effect<
  TerminateResponsibilityTransferResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | InvalidResponsibilityTransferTransitionException
  | ResponsibilityTransferAlreadyInStatusException
  | ResponsibilityTransferNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateResponsibilityTransferRequest,
  output: TerminateResponsibilityTransferResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    InvalidResponsibilityTransferTransitionException,
    ResponsibilityTransferAlreadyInStatusException,
    ResponsibilityTransferNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Moves an account from its current source parent root or organizational unit (OU) to
 * the specified destination parent root or OU.
 *
 * You can only call this operation from the management account.
 */
export const moveAccount: (
  input: MoveAccountRequest,
) => effect.Effect<
  MoveAccountResponse,
  | AccessDeniedException
  | AccountNotFoundException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | DestinationParentNotFoundException
  | DuplicateAccountException
  | InvalidInputException
  | ServiceException
  | SourceParentNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MoveAccountRequest,
  output: MoveAccountResponse,
  errors: [
    AccessDeniedException,
    AccountNotFoundException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    DestinationParentNotFoundException,
    DuplicateAccountException,
    InvalidInputException,
    ServiceException,
    SourceParentNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a policy of a specified type that you can attach to a root, an organizational
 * unit (OU), or an individual Amazon Web Services account.
 *
 * For more information about policies and their use, see Managing
 * Organizations policies.
 *
 * If the request includes tags, then the requester must have the
 * `organizations:TagResource` permission.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const createPolicy: (
  input: CreatePolicyRequest,
) => effect.Effect<
  CreatePolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | DuplicatePolicyException
  | InvalidInputException
  | MalformedPolicyDocumentException
  | PolicyTypeNotAvailableForOrganizationException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyRequest,
  output: CreatePolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    DuplicatePolicyException,
    InvalidInputException,
    MalformedPolicyDocumentException,
    PolicyTypeNotAvailableForOrganizationException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Updates an existing policy with a new name, description, or content. If you don't
 * supply any parameter, that value remains unchanged. You can't change a policy's
 * type.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const updatePolicy: (
  input: UpdatePolicyRequest,
) => effect.Effect<
  UpdatePolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | DuplicatePolicyException
  | InvalidInputException
  | MalformedPolicyDocumentException
  | PolicyChangesInProgressException
  | PolicyNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePolicyRequest,
  output: UpdatePolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    DuplicatePolicyException,
    InvalidInputException,
    MalformedPolicyDocumentException,
    PolicyChangesInProgressException,
    PolicyNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Lists all the accounts in an organization that have invalid effective policies. An
 * *invalid effective policy* is an effective
 * policy that fails validation checks, resulting in the effective policy not
 * being fully enforced on all the intended accounts within an organization.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listAccountsWithInvalidEffectivePolicy: {
  (
    input: ListAccountsWithInvalidEffectivePolicyRequest,
  ): effect.Effect<
    ListAccountsWithInvalidEffectivePolicyResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | EffectivePolicyNotFoundException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountsWithInvalidEffectivePolicyRequest,
  ) => stream.Stream<
    ListAccountsWithInvalidEffectivePolicyResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | EffectivePolicyNotFoundException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountsWithInvalidEffectivePolicyRequest,
  ) => stream.Stream<
    Account,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | EffectivePolicyNotFoundException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountsWithInvalidEffectivePolicyRequest,
  output: ListAccountsWithInvalidEffectivePolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    EffectivePolicyNotFoundException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Accounts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the roots, organizational units (OUs), and accounts that the specified
 * policy is attached to.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listTargetsForPolicy: {
  (
    input: ListTargetsForPolicyRequest,
  ): effect.Effect<
    ListTargetsForPolicyResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | PolicyNotFoundException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTargetsForPolicyRequest,
  ) => stream.Stream<
    ListTargetsForPolicyResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | PolicyNotFoundException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTargetsForPolicyRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | PolicyNotFoundException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTargetsForPolicyRequest,
  output: ListTargetsForPolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    PolicyNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Closes an Amazon Web Services member account within an organization. You can close an account when
 * all
 * features are enabled . You can't close the management account with this API.
 * This is an asynchronous request that Amazon Web Services performs in the background. Because
 * `CloseAccount` operates asynchronously, it can return a successful
 * completion message even though account closure might still be in progress. You need to
 * wait a few minutes before the account is fully closed. To check the status of the
 * request, do one of the following:
 *
 * - Use the `AccountId` that you sent in the `CloseAccount`
 * request to provide as a parameter to the DescribeAccount
 * operation.
 *
 * While the close account request is in progress, Account status will indicate
 * PENDING_CLOSURE. When the close account request completes, the status will
 * change to SUSPENDED.
 *
 * - Check the CloudTrail log for the `CloseAccountResult` event that gets
 * published after the account closes successfully. For information on using CloudTrail
 * with Organizations, see Logging and monitoring in Organizations in the
 * *Organizations User Guide*.
 *
 * - You can close only 10% of member accounts, between 10 and 1000, within a
 * rolling 30 day period. This quota is not bound by a calendar month, but
 * starts when you close an account. After you reach this limit, you can't
 * close additional accounts. For more information, see Closing a member
 * account in your organization and Quotas for
 * Organizations in the *Organizations User Guide*.
 *
 * - To reinstate a closed account, contact Amazon Web Services Support within the 90-day
 * grace period while the account is in SUSPENDED status.
 *
 * - If the Amazon Web Services account you attempt to close is linked to an Amazon Web Services GovCloud
 * (US) account, the `CloseAccount` request will close both
 * accounts. To learn important pre-closure details, see
 * Closing an Amazon Web Services GovCloud (US) account in the
 * Amazon Web Services GovCloud User Guide.
 */
export const closeAccount: (
  input: CloseAccountRequest,
) => effect.Effect<
  CloseAccountResponse,
  | AccessDeniedException
  | AccountAlreadyClosedException
  | AccountNotFoundException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConflictException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CloseAccountRequest,
  output: CloseAccountResponse,
  errors: [
    AccessDeniedException,
    AccountAlreadyClosedException,
    AccountNotFoundException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConflictException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Deletes the specified policy from your organization. Before you perform this
 * operation, you must first detach the policy from all organizational units (OUs), roots,
 * and accounts.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const deletePolicy: (
  input: DeletePolicyRequest,
) => effect.Effect<
  DeletePolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | InvalidInputException
  | PolicyInUseException
  | PolicyNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    InvalidInputException,
    PolicyInUseException,
    PolicyNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Deletes the resource policy from your organization.
 *
 * You can only call this operation from the management account.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | ResourcePolicyNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    ResourcePolicyNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Returns a list of the Amazon Web Services services that you enabled to integrate with your
 * organization. After a service on this list creates the resources that it requires for
 * the integration, it can perform operations on your organization and its accounts.
 *
 * For more information about integrating other services with Organizations, including the
 * list of services that currently work with Organizations, see Using Organizations with other Amazon Web Services
 * services in the *Organizations User Guide*.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listAWSServiceAccessForOrganization: {
  (
    input: ListAWSServiceAccessForOrganizationRequest,
  ): effect.Effect<
    ListAWSServiceAccessForOrganizationResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAWSServiceAccessForOrganizationRequest,
  ) => stream.Stream<
    ListAWSServiceAccessForOrganizationResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAWSServiceAccessForOrganizationRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAWSServiceAccessForOrganizationRequest,
  output: ListAWSServiceAccessForOrganizationResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the Amazon Web Services accounts that are designated as delegated administrators in this
 * organization.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listDelegatedAdministrators: {
  (
    input: ListDelegatedAdministratorsRequest,
  ): effect.Effect<
    ListDelegatedAdministratorsResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDelegatedAdministratorsRequest,
  ) => stream.Stream<
    ListDelegatedAdministratorsResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDelegatedAdministratorsRequest,
  ) => stream.Stream<
    DelegatedAdministrator,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDelegatedAdministratorsRequest,
  output: ListDelegatedAdministratorsResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DelegatedAdministrators",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the Amazon Web Services services for which the specified account is a delegated
 * administrator.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listDelegatedServicesForAccount: {
  (
    input: ListDelegatedServicesForAccountRequest,
  ): effect.Effect<
    ListDelegatedServicesForAccountResponse,
    | AccessDeniedException
    | AccountNotFoundException
    | AccountNotRegisteredException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDelegatedServicesForAccountRequest,
  ) => stream.Stream<
    ListDelegatedServicesForAccountResponse,
    | AccessDeniedException
    | AccountNotFoundException
    | AccountNotRegisteredException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDelegatedServicesForAccountRequest,
  ) => stream.Stream<
    DelegatedService,
    | AccessDeniedException
    | AccountNotFoundException
    | AccountNotRegisteredException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDelegatedServicesForAccountRequest,
  output: ListDelegatedServicesForAccountResponse,
  errors: [
    AccessDeniedException,
    AccountNotFoundException,
    AccountNotRegisteredException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DelegatedServices",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the list of all policies in an organization of a specified type.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listPolicies: {
  (
    input: ListPoliciesRequest,
  ): effect.Effect<
    ListPoliciesResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPoliciesRequest,
  ) => stream.Stream<
    ListPoliciesResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPoliciesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates or updates a resource policy.
 *
 * You can only call this operation from the management account..
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Enables the specified member account to administer the Organizations features of the specified
 * Amazon Web Services service. It grants read-only access to Organizations service data. The account still
 * requires IAM permissions to access and administer the Amazon Web Services service.
 *
 * You can run this action only for Amazon Web Services services that support this
 * feature. For a current list of services that support it, see the column Supports
 * Delegated Administrator in the table at Amazon Web Services Services that you can use with
 * Organizations in the *Organizations User Guide.*
 *
 * You can only call this operation from the management account.
 */
export const registerDelegatedAdministrator: (
  input: RegisterDelegatedAdministratorRequest,
) => effect.Effect<
  RegisterDelegatedAdministratorResponse,
  | AccessDeniedException
  | AccountAlreadyRegisteredException
  | AccountNotFoundException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterDelegatedAdministratorRequest,
  output: RegisterDelegatedAdministratorResponse,
  errors: [
    AccessDeniedException,
    AccountAlreadyRegisteredException,
    AccountNotFoundException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Disables the integration of an Amazon Web Services service (the service that is specified by
 * `ServicePrincipal`) with Organizations. When you disable integration, the
 * specified service no longer can create a service-linked role in
 * *new* accounts in your organization. This means the service can't
 * perform operations on your behalf on any new accounts in your organization. The service
 * can still perform operations in older accounts until the service completes its clean-up
 * from Organizations.
 *
 * We
 * *strongly recommend*
 * that
 * you don't use this command to disable integration between Organizations and the specified
 * Amazon Web Services service. Instead, use the console or commands that are provided by the
 * specified service. This lets the trusted service perform any required initialization
 * when enabling trusted access, such as creating any required resources and any
 * required clean up of resources when disabling trusted access.
 *
 * For information about how to disable trusted service access to your organization
 * using the trusted service, see the **Learn more** link
 * under the **Supports Trusted Access** column at Amazon Web Services services that you can use with Organizations. on this page.
 *
 * If you disable access by using this command, it causes the following actions to
 * occur:
 *
 * - The service can no longer create a service-linked role in the accounts in
 * your organization. This means that the service can't perform operations on
 * your behalf on any new accounts in your organization. The service can still
 * perform operations in older accounts until the service completes its
 * clean-up from Organizations.
 *
 * - The service can no longer perform tasks in the member accounts in the
 * organization, unless those operations are explicitly permitted by the IAM
 * policies that are attached to your roles. This includes any data aggregation
 * from the member accounts to the management account, or to a delegated
 * administrator account, where relevant.
 *
 * - Some services detect this and clean up any remaining data or resources
 * related to the integration, while other services stop accessing the
 * organization but leave any historical data and configuration in place to
 * support a possible re-enabling of the integration.
 *
 * Using the other service's console or commands to disable the integration ensures
 * that the other service is aware that it can clean up any resources that are required
 * only for the integration. How the service cleans up its resources in the
 * organization's accounts depends on that service. For more information, see the
 * documentation for the other Amazon Web Services service.
 *
 * After you perform the `DisableAWSServiceAccess` operation, the specified
 * service can no longer perform operations in your organization's accounts
 *
 * For more information about integrating other services with Organizations, including the
 * list of services that work with Organizations, see Using Organizations with other Amazon Web Services
 * services in the *Organizations User Guide*.
 *
 * You can only call this operation from the management account.
 */
export const disableAWSServiceAccess: (
  input: DisableAWSServiceAccessRequest,
) => effect.Effect<
  DisableAWSServiceAccessResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableAWSServiceAccessRequest,
  output: DisableAWSServiceAccessResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Provides an Amazon Web Services service (the service that is specified by
 * `ServicePrincipal`) with permissions to view the structure of an
 * organization, create a service-linked role in
 * all the accounts in the organization, and allow the service to perform operations on
 * behalf of the organization and its accounts. Establishing these permissions can be a
 * first step in enabling the integration of an Amazon Web Services service with Organizations.
 *
 * We recommend that you enable integration between Organizations and the specified Amazon Web Services
 * service by using the console or commands that are provided by the specified service.
 * Doing so ensures that the service is aware that it can create the resources that are
 * required for the integration. How the service creates those resources in the
 * organization's accounts depends on that service. For more information, see the
 * documentation for the other Amazon Web Services service.
 *
 * For more information about enabling services to integrate with Organizations, see Using
 * Organizations with other Amazon Web Services services in the
 * *Organizations User Guide*.
 *
 * You can only call this operation from the management account.
 */
export const enableAWSServiceAccess: (
  input: EnableAWSServiceAccessRequest,
) => effect.Effect<
  EnableAWSServiceAccessResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableAWSServiceAccessRequest,
  output: EnableAWSServiceAccessResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Lists the account creation requests that match the specified status that is currently
 * being tracked for the organization.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listCreateAccountStatus: {
  (
    input: ListCreateAccountStatusRequest,
  ): effect.Effect<
    ListCreateAccountStatusResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCreateAccountStatusRequest,
  ) => stream.Stream<
    ListCreateAccountStatusResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCreateAccountStatusRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCreateAccountStatusRequest,
  output: ListCreateAccountStatusResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the current status of an asynchronous request to create an account.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const describeCreateAccountStatus: (
  input: DescribeCreateAccountStatusRequest,
) => effect.Effect<
  DescribeCreateAccountStatusResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | CreateAccountStatusNotFoundException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCreateAccountStatusRequest,
  output: DescribeCreateAccountStatusResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    CreateAccountStatusNotFoundException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Lists transfers that allow an account outside your organization to manage the
 * specified responsibilities for your organization. This operation returns both transfer
 * invitations and transfers.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 */
export const listOutboundResponsibilityTransfers: (
  input: ListOutboundResponsibilityTransfersRequest,
) => effect.Effect<
  ListOutboundResponsibilityTransfersResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOutboundResponsibilityTransfersRequest,
  output: ListOutboundResponsibilityTransfersResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Removes the specified member Amazon Web Services account as a delegated administrator for the
 * specified Amazon Web Services service.
 *
 * Deregistering a delegated administrator can have unintended impacts on the
 * functionality of the enabled Amazon Web Services service. See the documentation for the enabled
 * service before you deregister a delegated administrator so that you understand any
 * potential impacts.
 *
 * You can run this action only for Amazon Web Services services that support this
 * feature. For a current list of services that support it, see the column Supports
 * Delegated Administrator in the table at Amazon Web Services Services that you can use with
 * Organizations in the *Organizations User Guide.*
 *
 * You can only call this operation from the management account.
 */
export const deregisterDelegatedAdministrator: (
  input: DeregisterDelegatedAdministratorRequest,
) => effect.Effect<
  DeregisterDelegatedAdministratorResponse,
  | AccessDeniedException
  | AccountNotFoundException
  | AccountNotRegisteredException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterDelegatedAdministratorRequest,
  output: DeregisterDelegatedAdministratorResponse,
  errors: [
    AccessDeniedException,
    AccountNotFoundException,
    AccountNotRegisteredException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Lists transfers that allow you to manage the specified responsibilities for another
 * organization. This operation returns both transfer invitations and transfers.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 */
export const listInboundResponsibilityTransfers: (
  input: ListInboundResponsibilityTransfersRequest,
) => effect.Effect<
  ListInboundResponsibilityTransfersResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConstraintViolationException
  | InvalidInputException
  | ResponsibilityTransferNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInboundResponsibilityTransfersRequest,
  output: ListInboundResponsibilityTransfersResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    InvalidInputException,
    ResponsibilityTransferNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Creates an Amazon Web Services account that is automatically a member of the organization whose
 * credentials made the request. This is an asynchronous request that Amazon Web Services performs in the
 * background. Because `CreateAccount` operates asynchronously, it can return a
 * successful completion message even though account initialization might still be in
 * progress. You might need to wait a few minutes before you can successfully access the
 * account. To check the status of the request, do one of the following:
 *
 * - Use the `Id` value of the `CreateAccountStatus` response
 * element from this operation to provide as a parameter to the DescribeCreateAccountStatus operation.
 *
 * - Check the CloudTrail log for the `CreateAccountResult` event. For
 * information on using CloudTrail with Organizations, see Logging and monitoring in Organizations in the
 * *Organizations User Guide*.
 *
 * The user who calls the API to create an account must have the
 * `organizations:CreateAccount` permission. If you enabled all features in
 * the organization, Organizations creates the required service-linked role named
 * `AWSServiceRoleForOrganizations`. For more information, see Organizations and service-linked roles in the
 * *Organizations User Guide*.
 *
 * If the request includes tags, then the requester must have the
 * `organizations:TagResource` permission.
 *
 * Organizations preconfigures the new member account with a role (named
 * `OrganizationAccountAccessRole` by default) that grants users in the
 * management account administrator permissions in the new member account. Principals in
 * the management account can assume the role. Organizations clones the company name and address
 * information for the new account from the organization's management account.
 *
 * You can only call this operation from the management account.
 *
 * For more information about creating accounts, see Creating
 * a member account in your organization in the
 * *Organizations User Guide*.
 *
 * - When you create an account in an organization using the Organizations console,
 * API, or CLI commands, the information required for the account to operate
 * as a standalone account, such as a payment method is
 * *not* automatically collected. If you must remove an
 * account from your organization later, you can do so only after you provide
 * the missing information. For more information, see Considerations before removing an account from an organization
 * in the *Organizations User Guide*.
 *
 * - If you get an exception that indicates that you exceeded your account
 * limits for the organization, contact Amazon Web Services Support.
 *
 * - If you get an exception that indicates that the operation failed because
 * your organization is still initializing, wait one hour and then try again.
 * If the error persists, contact Amazon Web Services Support.
 *
 * - It isn't recommended to use `CreateAccount` to create multiple
 * temporary accounts, and using the `CreateAccount` API to close
 * accounts is subject to a 30-day usage quota. For information on the
 * requirements and process for closing an account, see Closing a member
 * account in your organization in the
 * *Organizations User Guide*.
 *
 * When you create a member account with this operation, you can choose whether to
 * create the account with the IAM User and Role Access to
 * Billing Information switch enabled. If you enable it, IAM users and
 * roles that have appropriate permissions can view billing information for the
 * account. If you disable it, only the account root user can access billing
 * information. For information about how to disable this switch for an account, see
 * Granting access to
 * your billing information and tools.
 */
export const createAccount: (
  input: CreateAccountRequest,
) => effect.Effect<
  CreateAccountResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FinalizingOrganizationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccountRequest,
  output: CreateAccountResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    FinalizingOrganizationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Lists all the validation errors on an effective
 * policy for a specified account and policy type.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listEffectivePolicyValidationErrors: {
  (
    input: ListEffectivePolicyValidationErrorsRequest,
  ): effect.Effect<
    ListEffectivePolicyValidationErrorsResponse,
    | AccessDeniedException
    | AccountNotFoundException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | EffectivePolicyNotFoundException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEffectivePolicyValidationErrorsRequest,
  ) => stream.Stream<
    ListEffectivePolicyValidationErrorsResponse,
    | AccessDeniedException
    | AccountNotFoundException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | EffectivePolicyNotFoundException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEffectivePolicyValidationErrorsRequest,
  ) => stream.Stream<
    EffectivePolicyValidationError,
    | AccessDeniedException
    | AccountNotFoundException
    | AWSOrganizationsNotInUseException
    | ConstraintViolationException
    | EffectivePolicyNotFoundException
    | InvalidInputException
    | ServiceException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEffectivePolicyValidationErrorsRequest,
  output: ListEffectivePolicyValidationErrorsResponse,
  errors: [
    AccessDeniedException,
    AccountNotFoundException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    EffectivePolicyNotFoundException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EffectivePolicyValidationErrors",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves information about a policy.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const describePolicy: (
  input: DescribePolicyRequest,
) => effect.Effect<
  DescribePolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | InvalidInputException
  | PolicyNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePolicyRequest,
  output: DescribePolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    PolicyNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Retrieves information about a resource policy.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const describeResourcePolicy: (
  input: DescribeResourcePolicyRequest,
) => effect.Effect<
  DescribeResourcePolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConstraintViolationException
  | ResourcePolicyNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourcePolicyRequest,
  output: DescribeResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    ResourcePolicyNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Updates a transfer. A *transfer* is the arrangement between two
 * management accounts where one account designates the other with specified
 * responsibilities for their organization.
 *
 * You can update the name assigned to a transfer.
 */
export const updateResponsibilityTransfer: (
  input: UpdateResponsibilityTransferRequest,
) => effect.Effect<
  UpdateResponsibilityTransferResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConstraintViolationException
  | InvalidInputException
  | ResponsibilityTransferNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResponsibilityTransferRequest,
  output: UpdateResponsibilityTransferResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    InvalidInputException,
    ResponsibilityTransferNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Returns details for a transfer. A *transfer* is an arrangement
 * between two management accounts where one account designates the other with specified
 * responsibilities for their organization.
 */
export const describeResponsibilityTransfer: (
  input: DescribeResponsibilityTransferRequest,
) => effect.Effect<
  DescribeResponsibilityTransferResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | InvalidInputException
  | ResponsibilityTransferNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResponsibilityTransferRequest,
  output: DescribeResponsibilityTransferResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ResponsibilityTransferNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * This action is available if all of the following are true:
 *
 * - You're authorized to create accounts in the Amazon Web Services GovCloud (US) Region. For
 * more information on the Amazon Web Services GovCloud (US) Region, see the
 * *Amazon Web Services GovCloud User Guide*.
 *
 * - You already have an account in the Amazon Web Services GovCloud (US) Region that is paired
 * with a management account of an organization in the commercial Region.
 *
 * - You call this action from the management account of your organization in the
 * commercial Region.
 *
 * - You have the `organizations:CreateGovCloudAccount` permission.
 *
 * Organizations automatically creates the required service-linked role named
 * `AWSServiceRoleForOrganizations`. For more information, see Organizations and service-linked roles in the
 * *Organizations User Guide*.
 *
 * Amazon Web Services automatically enables CloudTrail for Amazon Web Services GovCloud (US) accounts, but you should also
 * do the following:
 *
 * - Verify that CloudTrail is enabled to store logs.
 *
 * - Create an Amazon S3 bucket for CloudTrail log storage.
 *
 * For more information, see Verifying CloudTrail Is
 * Enabled in the *Amazon Web Services GovCloud User Guide*.
 *
 * If the request includes tags, then the requester must have the
 * `organizations:TagResource` permission. The tags are attached to the
 * commercial account associated with the GovCloud account, rather than the GovCloud
 * account itself. To add tags to the GovCloud account, call the TagResource operation in the GovCloud Region after the new GovCloud
 * account exists.
 *
 * You call this action from the management account of your organization in the
 * commercial Region to create a standalone Amazon Web Services account in the Amazon Web Services GovCloud (US)
 * Region. After the account is created, the management account of an organization in the
 * Amazon Web Services GovCloud (US) Region can invite it to that organization. For more information on
 * inviting standalone accounts in the Amazon Web Services GovCloud (US) to join an organization, see
 * Organizations in the
 * *Amazon Web Services GovCloud User Guide*.
 *
 * Calling `CreateGovCloudAccount` is an asynchronous request that Amazon Web Services
 * performs in the background. Because `CreateGovCloudAccount` operates
 * asynchronously, it can return a successful completion message even though account
 * initialization might still be in progress. You might need to wait a few minutes before
 * you can successfully access the account. To check the status of the request, do one of
 * the following:
 *
 * - Use the `OperationId` response element from this operation to
 * provide as a parameter to the DescribeCreateAccountStatus
 * operation.
 *
 * - Check the CloudTrail log for the `CreateAccountResult` event. For
 * information on using CloudTrail with Organizations, see Logging and
 * monitoring in Organizations in the
 * *Organizations User Guide*.
 *
 * When you call the `CreateGovCloudAccount` action, you create two accounts:
 * a standalone account in the Amazon Web Services GovCloud (US) Region and an associated account in the
 * commercial Region for billing and support purposes. The account in the commercial Region
 * is automatically a member of the organization whose credentials made the request. Both
 * accounts are associated with the same email address.
 *
 * A role is created in the new account in the commercial Region that allows the
 * management account in the organization in the commercial Region to assume it. An Amazon Web Services
 * GovCloud (US) account is then created and associated with the commercial account that
 * you just created. A role is also created in the new Amazon Web Services GovCloud (US) account that can
 * be assumed by the Amazon Web Services GovCloud (US) account that is associated with the management
 * account of the commercial organization. For more information and to view a diagram that
 * explains how account access works, see Organizations in the
 * *Amazon Web Services GovCloud User Guide*.
 *
 * For more information about creating accounts, see Creating
 * a member account in your organization in the
 * *Organizations User Guide*.
 *
 * - When you create an account in an organization using the Organizations console,
 * API, or CLI commands, the information required for the account to operate as
 * a standalone account is *not* automatically collected.
 * This includes a payment method and signing the end user license agreement
 * (EULA). If you must remove an account from your organization later, you can
 * do so only after you provide the missing information. For more information,
 * see Considerations before removing an account from an organization
 * in the *Organizations User Guide*.
 *
 * - If you get an exception that indicates that you exceeded your account
 * limits for the organization, contact Amazon Web Services Support.
 *
 * - If you get an exception that indicates that the operation failed because
 * your organization is still initializing, wait one hour and then try again.
 * If the error persists, contact Amazon Web Services Support.
 *
 * - Using `CreateGovCloudAccount` to create multiple temporary
 * accounts isn't recommended. You can only close an account from the Amazon Web Services
 * Billing and Cost Management console, and you must be signed in as the root user. For information on
 * the requirements and process for closing an account, see Closing a member
 * account in your organization in the
 * *Organizations User Guide*.
 *
 * When you create a member account with this operation, you can choose whether to
 * create the account with the IAM User and Role Access to
 * Billing Information switch enabled. If you enable it, IAM users and
 * roles that have appropriate permissions can view billing information for the
 * account. If you disable it, only the account root user can access billing
 * information. For information about how to disable this switch for an account, see
 * Granting
 * access to your billing information and tools.
 */
export const createGovCloudAccount: (
  input: CreateGovCloudAccountRequest,
) => effect.Effect<
  CreateGovCloudAccountResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FinalizingOrganizationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGovCloudAccountRequest,
  output: CreateGovCloudAccountResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    FinalizingOrganizationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Sends an invitation to another organization's management account to designate your
 * account with the specified responsibilities for their organization. The invitation is
 * implemented as a Handshake whose details are in the response.
 *
 * You can only call this operation from the management account.
 */
export const inviteOrganizationToTransferResponsibility: (
  input: InviteOrganizationToTransferResponsibilityRequest,
) => effect.Effect<
  InviteOrganizationToTransferResponsibilityResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | DuplicateHandshakeException
  | HandshakeConstraintViolationException
  | InvalidInputException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InviteOrganizationToTransferResponsibilityRequest,
  output: InviteOrganizationToTransferResponsibilityResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    DuplicateHandshakeException,
    HandshakeConstraintViolationException,
    InvalidInputException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Detaches a policy from a target root, organizational unit (OU), or account.
 *
 * If the policy being detached is a service control policy (SCP), the changes to
 * permissions for Identity and Access Management (IAM) users and roles in affected accounts are
 * immediate.
 *
 * Every root, OU, and account must have at least one SCP attached. If you want to
 * replace the default `FullAWSAccess` policy with an SCP that limits the
 * permissions that can be delegated, you must attach the replacement SCP before you can
 * remove the default SCP. This is the authorization strategy of an "allow list". If you instead attach a second SCP and
 * leave the `FullAWSAccess` SCP still attached, and specify "Effect":
 * "Deny" in the second SCP to override the `"Effect": "Allow"` in
 * the `FullAWSAccess` policy (or any other attached SCP), you're using the
 * authorization strategy of a "deny list".
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const detachPolicy: (
  input: DetachPolicyRequest,
) => effect.Effect<
  DetachPolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | PolicyChangesInProgressException
  | PolicyNotAttachedException
  | PolicyNotFoundException
  | ServiceException
  | TargetNotFoundException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachPolicyRequest,
  output: DetachPolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    PolicyChangesInProgressException,
    PolicyNotAttachedException,
    PolicyNotFoundException,
    ServiceException,
    TargetNotFoundException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Lists the policies that are directly attached to the specified target root,
 * organizational unit (OU), or account. You must specify the policy type that you want
 * included in the returned list.
 *
 * When calling List* operations, always check the `NextToken` response parameter value, even if you receive an empty result set.
 * These operations can occasionally return an empty set of results even when more results are available.
 * Continue making requests until `NextToken` returns null. A null `NextToken` value indicates that you have retrieved all available results.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const listPoliciesForTarget: {
  (
    input: ListPoliciesForTargetRequest,
  ): effect.Effect<
    ListPoliciesForTargetResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TargetNotFoundException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPoliciesForTargetRequest,
  ) => stream.Stream<
    ListPoliciesForTargetResponse,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TargetNotFoundException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPoliciesForTargetRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | AWSOrganizationsNotInUseException
    | InvalidInputException
    | ServiceException
    | TargetNotFoundException
    | TooManyRequestsException
    | UnsupportedAPIEndpointException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPoliciesForTargetRequest,
  output: ListPoliciesForTargetResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    InvalidInputException,
    ServiceException,
    TargetNotFoundException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the contents of the effective policy for specified policy type and account.
 * The effective policy is the aggregation of any policies of the specified type that the
 * account inherits, plus any policy of that type that is directly attached to the
 * account.
 *
 * This operation applies only to management policies. It does not apply to authorization
 * policies: service control policies (SCPs) and resource control policies (RCPs).
 *
 * For more information about policy inheritance, see Understanding
 * management policy inheritance in the
 * *Organizations User Guide*.
 *
 * You can call this operation from any account in a organization.
 */
export const describeEffectivePolicy: (
  input: DescribeEffectivePolicyRequest,
) => effect.Effect<
  DescribeEffectivePolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConstraintViolationException
  | EffectivePolicyNotFoundException
  | InvalidInputException
  | ServiceException
  | TargetNotFoundException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEffectivePolicyRequest,
  output: DescribeEffectivePolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConstraintViolationException,
    EffectivePolicyNotFoundException,
    InvalidInputException,
    ServiceException,
    TargetNotFoundException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Attaches a policy to a root, an organizational unit (OU), or an individual account.
 * How the policy affects accounts depends on the type of policy. Refer to the
 * *Organizations User Guide* for information about each policy type:
 *
 * - SERVICE_CONTROL_POLICY
 *
 * - RESOURCE_CONTROL_POLICY
 *
 * - DECLARATIVE_POLICY_EC2
 *
 * - BACKUP_POLICY
 *
 * - TAG_POLICY
 *
 * - CHATBOT_POLICY
 *
 * - AISERVICES_OPT_OUT_POLICY
 *
 * - SECURITYHUB_POLICY
 *
 * - UPGRADE_ROLLOUT_POLICY
 *
 * - INSPECTOR_POLICY
 *
 * - BEDROCK_POLICY
 *
 * - S3_POLICY
 *
 * - NETWORK_SECURITY_DIRECTOR_POLICY
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 */
export const attachPolicy: (
  input: AttachPolicyRequest,
) => effect.Effect<
  AttachPolicyResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | DuplicatePolicyAttachmentException
  | InvalidInputException
  | PolicyChangesInProgressException
  | PolicyNotFoundException
  | PolicyTypeNotEnabledException
  | ServiceException
  | TargetNotFoundException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachPolicyRequest,
  output: AttachPolicyResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    DuplicatePolicyAttachmentException,
    InvalidInputException,
    PolicyChangesInProgressException,
    PolicyNotFoundException,
    PolicyTypeNotEnabledException,
    ServiceException,
    TargetNotFoundException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Disables an organizational policy type in a root. A policy of a certain type can be
 * attached to entities in a root only if that type is enabled in the root. After you
 * perform this operation, you no longer can attach policies of the specified type to that
 * root or to any organizational unit (OU) or account in that root. You can undo this by
 * using the EnablePolicyType operation.
 *
 * This is an asynchronous request that Amazon Web Services performs in the background. If you disable
 * a policy type for a root, it still appears enabled for the organization if all features are enabled for the organization. Amazon Web Services recommends that you
 * first use ListRoots to see the status of policy types for a specified
 * root, and then use this operation.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 *
 * To view the status of available policy types in the organization, use ListRoots.
 */
export const disablePolicyType: (
  input: DisablePolicyTypeRequest,
) => effect.Effect<
  DisablePolicyTypeResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | PolicyChangesInProgressException
  | PolicyTypeNotEnabledException
  | RootNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisablePolicyTypeRequest,
  output: DisablePolicyTypeResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    PolicyChangesInProgressException,
    PolicyTypeNotEnabledException,
    RootNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));
/**
 * Enables a policy type in a root. After you enable a policy type in a root, you can
 * attach policies of that type to the root, any organizational unit (OU), or account in
 * that root. You can undo this by using the DisablePolicyType
 * operation.
 *
 * This is an asynchronous request that Amazon Web Services performs in the background. Amazon Web Services
 * recommends that you first use ListRoots to see the status of policy
 * types for a specified root, and then use this operation.
 *
 * You can only call this operation from the management account or a member account that is a delegated administrator.
 *
 * You can enable a policy type in a root only if that policy type is available in the
 * organization. To view the status of available policy types in the organization, use
 * ListRoots.
 */
export const enablePolicyType: (
  input: EnablePolicyTypeRequest,
) => effect.Effect<
  EnablePolicyTypeResponse,
  | AccessDeniedException
  | AWSOrganizationsNotInUseException
  | ConcurrentModificationException
  | ConstraintViolationException
  | InvalidInputException
  | PolicyChangesInProgressException
  | PolicyTypeAlreadyEnabledException
  | PolicyTypeNotAvailableForOrganizationException
  | RootNotFoundException
  | ServiceException
  | TooManyRequestsException
  | UnsupportedAPIEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnablePolicyTypeRequest,
  output: EnablePolicyTypeResponse,
  errors: [
    AccessDeniedException,
    AWSOrganizationsNotInUseException,
    ConcurrentModificationException,
    ConstraintViolationException,
    InvalidInputException,
    PolicyChangesInProgressException,
    PolicyTypeAlreadyEnabledException,
    PolicyTypeNotAvailableForOrganizationException,
    RootNotFoundException,
    ServiceException,
    TooManyRequestsException,
    UnsupportedAPIEndpointException,
  ],
}));

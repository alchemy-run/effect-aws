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
  sdkId: "SecurityHub",
  serviceShapeName: "SecurityHubAPIService",
});
const auth = T.AwsAuthSigv4({ name: "securityhub" });
const ver = T.ServiceVersion("2018-10-26");
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
              `https://securityhub-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://securityhub-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://securityhub.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://securityhub.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type NonEmptyString = string;
export type RatioScale = number;
export type ClientToken = string;
export type RuleOrderValue = number;
export type RuleOrderValueV2 = number;
export type NextToken = string;
export type MaxResults = number;
export type MaxStatisticResults = number;
export type CrossAccountMaxResults = number;
export type AdminsMaxResults = number;
export type ResourceArn = string;
export type TagKey = string;
export type AlphaNumericNonEmptyString = string;
export type TagValue = string;
export type AccountId = string;
export type SizeBytes = number;
export type AwsIamRoleAssumeRolePolicyDocument = string;
export type AwsLambdaLayerVersionNumber = number;
export type OcsfFinding = unknown;
export type ResourceConfig = unknown;
export type TrendsValueCount = number;

//# Schemas
export interface DescribeOrganizationConfigurationRequest {}
export const DescribeOrganizationConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/organization/configuration" }),
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
export interface DescribeSecurityHubV2Request {}
export const DescribeSecurityHubV2Request = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/hubv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSecurityHubV2Request",
}) as any as S.Schema<DescribeSecurityHubV2Request>;
export interface DisableSecurityHubRequest {}
export const DisableSecurityHubRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableSecurityHubRequest",
}) as any as S.Schema<DisableSecurityHubRequest>;
export interface DisableSecurityHubResponse {}
export const DisableSecurityHubResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisableSecurityHubResponse",
}) as any as S.Schema<DisableSecurityHubResponse>;
export interface DisableSecurityHubV2Request {}
export const DisableSecurityHubV2Request = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/hubv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableSecurityHubV2Request",
}) as any as S.Schema<DisableSecurityHubV2Request>;
export interface DisableSecurityHubV2Response {}
export const DisableSecurityHubV2Response = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisableSecurityHubV2Response",
}) as any as S.Schema<DisableSecurityHubV2Response>;
export interface DisassociateFromAdministratorAccountRequest {}
export const DisassociateFromAdministratorAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/administrator/disassociate" }),
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
export interface DisassociateFromMasterAccountRequest {}
export const DisassociateFromMasterAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/master/disassociate" }),
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
export interface GetAdministratorAccountRequest {}
export const GetAdministratorAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/administrator" }),
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
export interface GetInvitationsCountRequest {}
export const GetInvitationsCountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/invitations/count" }),
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
export interface GetMasterAccountRequest {}
export const GetMasterAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/master" }),
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
export type AutomationRulesArnsList = string[];
export const AutomationRulesArnsList = S.Array(S.String);
export type StandardsSubscriptionArns = string[];
export const StandardsSubscriptionArns = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type VerificationState =
  | "UNKNOWN"
  | "TRUE_POSITIVE"
  | "FALSE_POSITIVE"
  | "BENIGN_POSITIVE"
  | (string & {});
export const VerificationState = S.String;
export type TypeList = string[];
export const TypeList = S.Array(S.String);
export type MetadataUidList = string[];
export const MetadataUidList = S.Array(S.String);
export type RuleStatus = "ENABLED" | "DISABLED" | (string & {});
export const RuleStatus = S.String;
export type RuleStatusV2 = "ENABLED" | "DISABLED" | (string & {});
export const RuleStatusV2 = S.String;
export type TicketCreationMode = "DRYRUN" | (string & {});
export const TicketCreationMode = S.String;
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type ArnList = string[];
export const ArnList = S.Array(S.String);
export type AutoEnableStandards = "NONE" | "DEFAULT" | (string & {});
export const AutoEnableStandards = S.String;
export type SecurityHubFeature =
  | "SecurityHub"
  | "SecurityHubV2"
  | (string & {});
export const SecurityHubFeature = S.String;
export type ControlFindingGenerator =
  | "STANDARD_CONTROL"
  | "SECURITY_CONTROL"
  | (string & {});
export const ControlFindingGenerator = S.String;
export type SortOrder = "asc" | "desc" | (string & {});
export const SortOrder = S.String;
export type ConnectorProviderName = "JIRA_CLOUD" | "SERVICENOW" | (string & {});
export const ConnectorProviderName = S.String;
export type ConnectorStatus =
  | "CONNECTED"
  | "FAILED_TO_CONNECT"
  | "PENDING_CONFIGURATION"
  | "PENDING_AUTHORIZATION"
  | (string & {});
export const ConnectorStatus = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type RecordState = "ACTIVE" | "ARCHIVED" | (string & {});
export const RecordState = S.String;
export type ControlStatus = "ENABLED" | "DISABLED" | (string & {});
export const ControlStatus = S.String;
export interface AcceptAdministratorInvitationRequest {
  AdministratorId?: string;
  InvitationId?: string;
}
export const AcceptAdministratorInvitationRequest = S.suspend(() =>
  S.Struct({
    AdministratorId: S.optional(S.String),
    InvitationId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/administrator" }),
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
  MasterId?: string;
  InvitationId?: string;
}
export const AcceptInvitationRequest = S.suspend(() =>
  S.Struct({
    MasterId: S.optional(S.String),
    InvitationId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/master" }),
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
export interface BatchDeleteAutomationRulesRequest {
  AutomationRulesArns?: string[];
}
export const BatchDeleteAutomationRulesRequest = S.suspend(() =>
  S.Struct({ AutomationRulesArns: S.optional(AutomationRulesArnsList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/automationrules/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteAutomationRulesRequest",
}) as any as S.Schema<BatchDeleteAutomationRulesRequest>;
export interface BatchDisableStandardsRequest {
  StandardsSubscriptionArns?: string[];
}
export const BatchDisableStandardsRequest = S.suspend(() =>
  S.Struct({
    StandardsSubscriptionArns: S.optional(StandardsSubscriptionArns),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/standards/deregister" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDisableStandardsRequest",
}) as any as S.Schema<BatchDisableStandardsRequest>;
export interface BatchGetAutomationRulesRequest {
  AutomationRulesArns?: string[];
}
export const BatchGetAutomationRulesRequest = S.suspend(() =>
  S.Struct({ AutomationRulesArns: S.optional(AutomationRulesArnsList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/automationrules/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetAutomationRulesRequest",
}) as any as S.Schema<BatchGetAutomationRulesRequest>;
export interface BatchGetSecurityControlsRequest {
  SecurityControlIds?: string[];
}
export const BatchGetSecurityControlsRequest = S.suspend(() =>
  S.Struct({ SecurityControlIds: S.optional(StringList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/securityControls/batchGet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetSecurityControlsRequest",
}) as any as S.Schema<BatchGetSecurityControlsRequest>;
export interface CreateActionTargetRequest {
  Name?: string;
  Description?: string;
  Id?: string;
}
export const CreateActionTargetRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Id: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/actionTargets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateActionTargetRequest",
}) as any as S.Schema<CreateActionTargetRequest>;
export interface CreateFindingAggregatorRequest {
  RegionLinkingMode?: string;
  Regions?: string[];
}
export const CreateFindingAggregatorRequest = S.suspend(() =>
  S.Struct({
    RegionLinkingMode: S.optional(S.String),
    Regions: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findingAggregator/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFindingAggregatorRequest",
}) as any as S.Schema<CreateFindingAggregatorRequest>;
export interface CreateTicketV2Request {
  ConnectorId?: string;
  FindingMetadataUid?: string;
  ClientToken?: string;
  Mode?: TicketCreationMode;
}
export const CreateTicketV2Request = S.suspend(() =>
  S.Struct({
    ConnectorId: S.optional(S.String),
    FindingMetadataUid: S.optional(S.String),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Mode: S.optional(TicketCreationMode),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ticketsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTicketV2Request",
}) as any as S.Schema<CreateTicketV2Request>;
export interface DeclineInvitationsRequest {
  AccountIds?: string[];
}
export const DeclineInvitationsRequest = S.suspend(() =>
  S.Struct({ AccountIds: S.optional(AccountIdList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/invitations/decline" }),
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
export interface DeleteActionTargetRequest {
  ActionTargetArn: string;
}
export const DeleteActionTargetRequest = S.suspend(() =>
  S.Struct({
    ActionTargetArn: S.String.pipe(T.HttpLabel("ActionTargetArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/actionTargets/{ActionTargetArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteActionTargetRequest",
}) as any as S.Schema<DeleteActionTargetRequest>;
export interface DeleteAggregatorV2Request {
  AggregatorV2Arn: string;
}
export const DeleteAggregatorV2Request = S.suspend(() =>
  S.Struct({
    AggregatorV2Arn: S.String.pipe(T.HttpLabel("AggregatorV2Arn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/aggregatorv2/delete/{AggregatorV2Arn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAggregatorV2Request",
}) as any as S.Schema<DeleteAggregatorV2Request>;
export interface DeleteAggregatorV2Response {}
export const DeleteAggregatorV2Response = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAggregatorV2Response",
}) as any as S.Schema<DeleteAggregatorV2Response>;
export interface DeleteAutomationRuleV2Request {
  Identifier: string;
}
export const DeleteAutomationRuleV2Request = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/automationrulesv2/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAutomationRuleV2Request",
}) as any as S.Schema<DeleteAutomationRuleV2Request>;
export interface DeleteAutomationRuleV2Response {}
export const DeleteAutomationRuleV2Response = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAutomationRuleV2Response",
}) as any as S.Schema<DeleteAutomationRuleV2Response>;
export interface DeleteConfigurationPolicyRequest {
  Identifier: string;
}
export const DeleteConfigurationPolicyRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/configurationPolicy/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationPolicyRequest",
}) as any as S.Schema<DeleteConfigurationPolicyRequest>;
export interface DeleteConfigurationPolicyResponse {}
export const DeleteConfigurationPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfigurationPolicyResponse",
}) as any as S.Schema<DeleteConfigurationPolicyResponse>;
export interface DeleteConnectorV2Request {
  ConnectorId: string;
}
export const DeleteConnectorV2Request = S.suspend(() =>
  S.Struct({ ConnectorId: S.String.pipe(T.HttpLabel("ConnectorId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/connectorsv2/{ConnectorId+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectorV2Request",
}) as any as S.Schema<DeleteConnectorV2Request>;
export interface DeleteConnectorV2Response {}
export const DeleteConnectorV2Response = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectorV2Response",
}) as any as S.Schema<DeleteConnectorV2Response>;
export interface DeleteFindingAggregatorRequest {
  FindingAggregatorArn: string;
}
export const DeleteFindingAggregatorRequest = S.suspend(() =>
  S.Struct({
    FindingAggregatorArn: S.String.pipe(T.HttpLabel("FindingAggregatorArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/findingAggregator/delete/{FindingAggregatorArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFindingAggregatorRequest",
}) as any as S.Schema<DeleteFindingAggregatorRequest>;
export interface DeleteFindingAggregatorResponse {}
export const DeleteFindingAggregatorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFindingAggregatorResponse",
}) as any as S.Schema<DeleteFindingAggregatorResponse>;
export interface DeleteInsightRequest {
  InsightArn: string;
}
export const DeleteInsightRequest = S.suspend(() =>
  S.Struct({ InsightArn: S.String.pipe(T.HttpLabel("InsightArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/insights/{InsightArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInsightRequest",
}) as any as S.Schema<DeleteInsightRequest>;
export interface DeleteInvitationsRequest {
  AccountIds?: string[];
}
export const DeleteInvitationsRequest = S.suspend(() =>
  S.Struct({ AccountIds: S.optional(AccountIdList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/invitations/delete" }),
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
export interface DeleteMembersRequest {
  AccountIds?: string[];
}
export const DeleteMembersRequest = S.suspend(() =>
  S.Struct({ AccountIds: S.optional(AccountIdList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/members/delete" }),
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
export interface DescribeActionTargetsRequest {
  ActionTargetArns?: string[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeActionTargetsRequest = S.suspend(() =>
  S.Struct({
    ActionTargetArns: S.optional(ArnList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/actionTargets/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeActionTargetsRequest",
}) as any as S.Schema<DescribeActionTargetsRequest>;
export interface DescribeHubRequest {
  HubArn?: string;
}
export const DescribeHubRequest = S.suspend(() =>
  S.Struct({ HubArn: S.optional(S.String).pipe(T.HttpQuery("HubArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeHubRequest",
}) as any as S.Schema<DescribeHubRequest>;
export interface DescribeProductsRequest {
  NextToken?: string;
  MaxResults?: number;
  ProductArn?: string;
}
export const DescribeProductsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    ProductArn: S.optional(S.String).pipe(T.HttpQuery("ProductArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/products" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeProductsRequest",
}) as any as S.Schema<DescribeProductsRequest>;
export interface DescribeProductsV2Request {
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeProductsV2Request = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/productsV2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeProductsV2Request",
}) as any as S.Schema<DescribeProductsV2Request>;
export interface DescribeSecurityHubV2Response {
  HubV2Arn?: string;
  SubscribedAt?: string;
}
export const DescribeSecurityHubV2Response = S.suspend(() =>
  S.Struct({
    HubV2Arn: S.optional(S.String),
    SubscribedAt: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSecurityHubV2Response",
}) as any as S.Schema<DescribeSecurityHubV2Response>;
export interface DescribeStandardsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeStandardsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/standards" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeStandardsRequest",
}) as any as S.Schema<DescribeStandardsRequest>;
export interface DescribeStandardsControlsRequest {
  StandardsSubscriptionArn: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeStandardsControlsRequest = S.suspend(() =>
  S.Struct({
    StandardsSubscriptionArn: S.String.pipe(
      T.HttpLabel("StandardsSubscriptionArn"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/standards/controls/{StandardsSubscriptionArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeStandardsControlsRequest",
}) as any as S.Schema<DescribeStandardsControlsRequest>;
export interface DisableImportFindingsForProductRequest {
  ProductSubscriptionArn: string;
}
export const DisableImportFindingsForProductRequest = S.suspend(() =>
  S.Struct({
    ProductSubscriptionArn: S.String.pipe(
      T.HttpLabel("ProductSubscriptionArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/productSubscriptions/{ProductSubscriptionArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableImportFindingsForProductRequest",
}) as any as S.Schema<DisableImportFindingsForProductRequest>;
export interface DisableImportFindingsForProductResponse {}
export const DisableImportFindingsForProductResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisableImportFindingsForProductResponse",
}) as any as S.Schema<DisableImportFindingsForProductResponse>;
export interface DisableOrganizationAdminAccountRequest {
  AdminAccountId?: string;
  Feature?: SecurityHubFeature;
}
export const DisableOrganizationAdminAccountRequest = S.suspend(() =>
  S.Struct({
    AdminAccountId: S.optional(S.String),
    Feature: S.optional(SecurityHubFeature),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/organization/admin/disable" }),
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
export interface DisassociateMembersRequest {
  AccountIds?: string[];
}
export const DisassociateMembersRequest = S.suspend(() =>
  S.Struct({ AccountIds: S.optional(AccountIdList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/members/disassociate" }),
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
export interface DisassociateMembersResponse {}
export const DisassociateMembersResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateMembersResponse",
}) as any as S.Schema<DisassociateMembersResponse>;
export interface EnableImportFindingsForProductRequest {
  ProductArn?: string;
}
export const EnableImportFindingsForProductRequest = S.suspend(() =>
  S.Struct({ ProductArn: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/productSubscriptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableImportFindingsForProductRequest",
}) as any as S.Schema<EnableImportFindingsForProductRequest>;
export interface EnableOrganizationAdminAccountRequest {
  AdminAccountId?: string;
  Feature?: SecurityHubFeature;
}
export const EnableOrganizationAdminAccountRequest = S.suspend(() =>
  S.Struct({
    AdminAccountId: S.optional(S.String),
    Feature: S.optional(SecurityHubFeature),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/organization/admin/enable" }),
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
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface EnableSecurityHubRequest {
  Tags?: { [key: string]: string | undefined };
  EnableDefaultStandards?: boolean;
  ControlFindingGenerator?: ControlFindingGenerator;
}
export const EnableSecurityHubRequest = S.suspend(() =>
  S.Struct({
    Tags: S.optional(TagMap),
    EnableDefaultStandards: S.optional(S.Boolean),
    ControlFindingGenerator: S.optional(ControlFindingGenerator),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableSecurityHubRequest",
}) as any as S.Schema<EnableSecurityHubRequest>;
export interface EnableSecurityHubResponse {}
export const EnableSecurityHubResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "EnableSecurityHubResponse",
}) as any as S.Schema<EnableSecurityHubResponse>;
export interface EnableSecurityHubV2Request {
  Tags?: { [key: string]: string | undefined };
}
export const EnableSecurityHubV2Request = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/hubv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableSecurityHubV2Request",
}) as any as S.Schema<EnableSecurityHubV2Request>;
export interface GetAggregatorV2Request {
  AggregatorV2Arn: string;
}
export const GetAggregatorV2Request = S.suspend(() =>
  S.Struct({
    AggregatorV2Arn: S.String.pipe(T.HttpLabel("AggregatorV2Arn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/aggregatorv2/get/{AggregatorV2Arn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAggregatorV2Request",
}) as any as S.Schema<GetAggregatorV2Request>;
export interface GetAutomationRuleV2Request {
  Identifier: string;
}
export const GetAutomationRuleV2Request = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/automationrulesv2/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutomationRuleV2Request",
}) as any as S.Schema<GetAutomationRuleV2Request>;
export interface GetConfigurationPolicyRequest {
  Identifier: string;
}
export const GetConfigurationPolicyRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configurationPolicy/get/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfigurationPolicyRequest",
}) as any as S.Schema<GetConfigurationPolicyRequest>;
export interface GetConnectorV2Request {
  ConnectorId: string;
}
export const GetConnectorV2Request = S.suspend(() =>
  S.Struct({ ConnectorId: S.String.pipe(T.HttpLabel("ConnectorId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connectorsv2/{ConnectorId+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectorV2Request",
}) as any as S.Schema<GetConnectorV2Request>;
export interface GetEnabledStandardsRequest {
  StandardsSubscriptionArns?: string[];
  NextToken?: string;
  MaxResults?: number;
}
export const GetEnabledStandardsRequest = S.suspend(() =>
  S.Struct({
    StandardsSubscriptionArns: S.optional(StandardsSubscriptionArns),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/standards/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnabledStandardsRequest",
}) as any as S.Schema<GetEnabledStandardsRequest>;
export interface GetFindingAggregatorRequest {
  FindingAggregatorArn: string;
}
export const GetFindingAggregatorRequest = S.suspend(() =>
  S.Struct({
    FindingAggregatorArn: S.String.pipe(T.HttpLabel("FindingAggregatorArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/findingAggregator/get/{FindingAggregatorArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingAggregatorRequest",
}) as any as S.Schema<GetFindingAggregatorRequest>;
export interface AwsSecurityFindingIdentifier {
  Id?: string;
  ProductArn?: string;
}
export const AwsSecurityFindingIdentifier = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), ProductArn: S.optional(S.String) }),
).annotations({
  identifier: "AwsSecurityFindingIdentifier",
}) as any as S.Schema<AwsSecurityFindingIdentifier>;
export interface GetFindingHistoryRequest {
  FindingIdentifier?: AwsSecurityFindingIdentifier;
  StartTime?: Date;
  EndTime?: Date;
  NextToken?: string;
  MaxResults?: number;
}
export const GetFindingHistoryRequest = S.suspend(() =>
  S.Struct({
    FindingIdentifier: S.optional(AwsSecurityFindingIdentifier),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findingHistory/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingHistoryRequest",
}) as any as S.Schema<GetFindingHistoryRequest>;
export interface GetInsightResultsRequest {
  InsightArn: string;
}
export const GetInsightResultsRequest = S.suspend(() =>
  S.Struct({ InsightArn: S.String.pipe(T.HttpLabel("InsightArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/insights/results/{InsightArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInsightResultsRequest",
}) as any as S.Schema<GetInsightResultsRequest>;
export interface GetInsightsRequest {
  InsightArns?: string[];
  NextToken?: string;
  MaxResults?: number;
}
export const GetInsightsRequest = S.suspend(() =>
  S.Struct({
    InsightArns: S.optional(ArnList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/insights/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInsightsRequest",
}) as any as S.Schema<GetInsightsRequest>;
export interface GetInvitationsCountResponse {
  InvitationsCount?: number;
}
export const GetInvitationsCountResponse = S.suspend(() =>
  S.Struct({ InvitationsCount: S.optional(S.Number) }),
).annotations({
  identifier: "GetInvitationsCountResponse",
}) as any as S.Schema<GetInvitationsCountResponse>;
export interface Invitation {
  AccountId?: string;
  InvitationId?: string;
  InvitedAt?: Date;
  MemberStatus?: string;
}
export const Invitation = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    InvitationId: S.optional(S.String),
    InvitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    MemberStatus: S.optional(S.String),
  }),
).annotations({ identifier: "Invitation" }) as any as S.Schema<Invitation>;
export interface GetMasterAccountResponse {
  Master?: Invitation;
}
export const GetMasterAccountResponse = S.suspend(() =>
  S.Struct({ Master: S.optional(Invitation) }),
).annotations({
  identifier: "GetMasterAccountResponse",
}) as any as S.Schema<GetMasterAccountResponse>;
export interface GetMembersRequest {
  AccountIds?: string[];
}
export const GetMembersRequest = S.suspend(() =>
  S.Struct({ AccountIds: S.optional(AccountIdList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/members/get" }),
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
export interface GetSecurityControlDefinitionRequest {
  SecurityControlId?: string;
}
export const GetSecurityControlDefinitionRequest = S.suspend(() =>
  S.Struct({
    SecurityControlId: S.optional(S.String).pipe(
      T.HttpQuery("SecurityControlId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/securityControl/definition" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSecurityControlDefinitionRequest",
}) as any as S.Schema<GetSecurityControlDefinitionRequest>;
export interface InviteMembersRequest {
  AccountIds?: string[];
}
export const InviteMembersRequest = S.suspend(() =>
  S.Struct({ AccountIds: S.optional(AccountIdList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/members/invite" }),
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
export interface ListAggregatorsV2Request {
  NextToken?: string;
  MaxResults?: number;
}
export const ListAggregatorsV2Request = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/aggregatorv2/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAggregatorsV2Request",
}) as any as S.Schema<ListAggregatorsV2Request>;
export interface ListAutomationRulesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListAutomationRulesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/automationrules/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAutomationRulesRequest",
}) as any as S.Schema<ListAutomationRulesRequest>;
export interface ListAutomationRulesV2Request {
  NextToken?: string;
  MaxResults?: number;
}
export const ListAutomationRulesV2Request = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/automationrulesv2/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAutomationRulesV2Request",
}) as any as S.Schema<ListAutomationRulesV2Request>;
export interface ListConfigurationPoliciesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListConfigurationPoliciesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configurationPolicy/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationPoliciesRequest",
}) as any as S.Schema<ListConfigurationPoliciesRequest>;
export interface ListConnectorsV2Request {
  NextToken?: string;
  MaxResults?: number;
  ProviderName?: ConnectorProviderName;
  ConnectorStatus?: ConnectorStatus;
}
export const ListConnectorsV2Request = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    ProviderName: S.optional(ConnectorProviderName).pipe(
      T.HttpQuery("ProviderName"),
    ),
    ConnectorStatus: S.optional(ConnectorStatus).pipe(
      T.HttpQuery("ConnectorStatus"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connectorsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectorsV2Request",
}) as any as S.Schema<ListConnectorsV2Request>;
export interface ListEnabledProductsForImportRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListEnabledProductsForImportRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/productSubscriptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnabledProductsForImportRequest",
}) as any as S.Schema<ListEnabledProductsForImportRequest>;
export interface ListFindingAggregatorsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListFindingAggregatorsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/findingAggregator/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFindingAggregatorsRequest",
}) as any as S.Schema<ListFindingAggregatorsRequest>;
export interface ListInvitationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListInvitationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/invitations" }),
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
export interface ListMembersRequest {
  OnlyAssociated?: boolean;
  MaxResults?: number;
  NextToken?: string;
}
export const ListMembersRequest = S.suspend(() =>
  S.Struct({
    OnlyAssociated: S.optional(S.Boolean).pipe(T.HttpQuery("OnlyAssociated")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/members" }),
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
  Feature?: SecurityHubFeature;
}
export const ListOrganizationAdminAccountsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    Feature: S.optional(SecurityHubFeature).pipe(T.HttpQuery("Feature")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/organization/admin" }),
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
export interface ListSecurityControlDefinitionsRequest {
  StandardsArn?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListSecurityControlDefinitionsRequest = S.suspend(() =>
  S.Struct({
    StandardsArn: S.optional(S.String).pipe(T.HttpQuery("StandardsArn")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/securityControls/definitions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSecurityControlDefinitionsRequest",
}) as any as S.Schema<ListSecurityControlDefinitionsRequest>;
export interface ListStandardsControlAssociationsRequest {
  SecurityControlId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListStandardsControlAssociationsRequest = S.suspend(() =>
  S.Struct({
    SecurityControlId: S.optional(S.String).pipe(
      T.HttpQuery("SecurityControlId"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStandardsControlAssociationsRequest",
}) as any as S.Schema<ListStandardsControlAssociationsRequest>;
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
export interface RegisterConnectorV2Request {
  AuthCode?: string;
  AuthState?: string;
}
export const RegisterConnectorV2Request = S.suspend(() =>
  S.Struct({
    AuthCode: S.optional(S.String),
    AuthState: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/connectorsv2/register" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterConnectorV2Request",
}) as any as S.Schema<RegisterConnectorV2Request>;
export type Target =
  | { AccountId: string; OrganizationalUnitId?: never; RootId?: never }
  | { AccountId?: never; OrganizationalUnitId: string; RootId?: never }
  | { AccountId?: never; OrganizationalUnitId?: never; RootId: string };
export const Target = S.Union(
  S.Struct({ AccountId: S.String }),
  S.Struct({ OrganizationalUnitId: S.String }),
  S.Struct({ RootId: S.String }),
);
export interface StartConfigurationPolicyAssociationRequest {
  ConfigurationPolicyIdentifier?: string;
  Target?: Target;
}
export const StartConfigurationPolicyAssociationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationPolicyIdentifier: S.optional(S.String),
    Target: S.optional(Target),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/configurationPolicyAssociation/associate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartConfigurationPolicyAssociationRequest",
}) as any as S.Schema<StartConfigurationPolicyAssociationRequest>;
export interface StartConfigurationPolicyDisassociationRequest {
  Target?: Target;
  ConfigurationPolicyIdentifier?: string;
}
export const StartConfigurationPolicyDisassociationRequest = S.suspend(() =>
  S.Struct({
    Target: S.optional(Target),
    ConfigurationPolicyIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/configurationPolicyAssociation/disassociate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartConfigurationPolicyDisassociationRequest",
}) as any as S.Schema<StartConfigurationPolicyDisassociationRequest>;
export interface StartConfigurationPolicyDisassociationResponse {}
export const StartConfigurationPolicyDisassociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartConfigurationPolicyDisassociationResponse",
}) as any as S.Schema<StartConfigurationPolicyDisassociationResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(TagMap),
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(TagKeyList).pipe(T.HttpQuery("tagKeys")),
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
export interface UpdateActionTargetRequest {
  ActionTargetArn: string;
  Name?: string;
  Description?: string;
}
export const UpdateActionTargetRequest = S.suspend(() =>
  S.Struct({
    ActionTargetArn: S.String.pipe(T.HttpLabel("ActionTargetArn")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/actionTargets/{ActionTargetArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateActionTargetRequest",
}) as any as S.Schema<UpdateActionTargetRequest>;
export interface UpdateActionTargetResponse {}
export const UpdateActionTargetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateActionTargetResponse",
}) as any as S.Schema<UpdateActionTargetResponse>;
export interface UpdateAggregatorV2Request {
  AggregatorV2Arn: string;
  RegionLinkingMode?: string;
  LinkedRegions?: string[];
}
export const UpdateAggregatorV2Request = S.suspend(() =>
  S.Struct({
    AggregatorV2Arn: S.String.pipe(T.HttpLabel("AggregatorV2Arn")),
    RegionLinkingMode: S.optional(S.String),
    LinkedRegions: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/aggregatorv2/update/{AggregatorV2Arn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAggregatorV2Request",
}) as any as S.Schema<UpdateAggregatorV2Request>;
export type CompositeFilterList = CompositeFilter[];
export const CompositeFilterList = S.Array(
  S.suspend((): S.Schema<CompositeFilter, any> => CompositeFilter).annotations({
    identifier: "CompositeFilter",
  }),
) as any as S.Schema<CompositeFilterList>;
export type AllowedOperators = "AND" | "OR" | (string & {});
export const AllowedOperators = S.String;
export interface OcsfFindingFilters {
  CompositeFilters?: CompositeFilter[];
  CompositeOperator?: AllowedOperators;
}
export const OcsfFindingFilters = S.suspend(() =>
  S.Struct({
    CompositeFilters: S.optional(CompositeFilterList),
    CompositeOperator: S.optional(AllowedOperators),
  }),
).annotations({
  identifier: "OcsfFindingFilters",
}) as any as S.Schema<OcsfFindingFilters>;
export type Criteria = { OcsfFindingCriteria: OcsfFindingFilters };
export const Criteria = S.Union(
  S.Struct({ OcsfFindingCriteria: OcsfFindingFilters }),
);
export type AutomationRulesActionTypeV2 =
  | "FINDING_FIELDS_UPDATE"
  | "EXTERNAL_INTEGRATION"
  | (string & {});
export const AutomationRulesActionTypeV2 = S.String;
export interface AutomationRulesFindingFieldsUpdateV2 {
  SeverityId?: number;
  Comment?: string;
  StatusId?: number;
}
export const AutomationRulesFindingFieldsUpdateV2 = S.suspend(() =>
  S.Struct({
    SeverityId: S.optional(S.Number),
    Comment: S.optional(S.String),
    StatusId: S.optional(S.Number),
  }),
).annotations({
  identifier: "AutomationRulesFindingFieldsUpdateV2",
}) as any as S.Schema<AutomationRulesFindingFieldsUpdateV2>;
export interface ExternalIntegrationConfiguration {
  ConnectorArn?: string;
}
export const ExternalIntegrationConfiguration = S.suspend(() =>
  S.Struct({ ConnectorArn: S.optional(S.String) }),
).annotations({
  identifier: "ExternalIntegrationConfiguration",
}) as any as S.Schema<ExternalIntegrationConfiguration>;
export interface AutomationRulesActionV2 {
  Type?: AutomationRulesActionTypeV2;
  FindingFieldsUpdate?: AutomationRulesFindingFieldsUpdateV2;
  ExternalIntegrationConfiguration?: ExternalIntegrationConfiguration;
}
export const AutomationRulesActionV2 = S.suspend(() =>
  S.Struct({
    Type: S.optional(AutomationRulesActionTypeV2),
    FindingFieldsUpdate: S.optional(AutomationRulesFindingFieldsUpdateV2),
    ExternalIntegrationConfiguration: S.optional(
      ExternalIntegrationConfiguration,
    ),
  }),
).annotations({
  identifier: "AutomationRulesActionV2",
}) as any as S.Schema<AutomationRulesActionV2>;
export type AutomationRulesActionListV2 = AutomationRulesActionV2[];
export const AutomationRulesActionListV2 = S.Array(AutomationRulesActionV2);
export interface UpdateAutomationRuleV2Request {
  Identifier: string;
  RuleStatus?: RuleStatusV2;
  RuleOrder?: number;
  Description?: string;
  RuleName?: string;
  Criteria?: Criteria;
  Actions?: AutomationRulesActionV2[];
}
export const UpdateAutomationRuleV2Request = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    RuleStatus: S.optional(RuleStatusV2),
    RuleOrder: S.optional(S.Number),
    Description: S.optional(S.String),
    RuleName: S.optional(S.String),
    Criteria: S.optional(Criteria),
    Actions: S.optional(AutomationRulesActionListV2),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/automationrulesv2/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAutomationRuleV2Request",
}) as any as S.Schema<UpdateAutomationRuleV2Request>;
export interface UpdateAutomationRuleV2Response {}
export const UpdateAutomationRuleV2Response = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAutomationRuleV2Response",
}) as any as S.Schema<UpdateAutomationRuleV2Response>;
export type EnabledStandardIdentifierList = string[];
export const EnabledStandardIdentifierList = S.Array(S.String);
export type EnabledSecurityControlIdentifierList = string[];
export const EnabledSecurityControlIdentifierList = S.Array(S.String);
export type DisabledSecurityControlIdentifierList = string[];
export const DisabledSecurityControlIdentifierList = S.Array(S.String);
export type ParameterValueType = "DEFAULT" | "CUSTOM" | (string & {});
export const ParameterValueType = S.String;
export type IntegerList = number[];
export const IntegerList = S.Array(S.Number);
export type ParameterValue =
  | {
      Integer: number;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList: number[];
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double: number;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String: string;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList: string[];
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean: boolean;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum: string;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList: string[];
    };
export const ParameterValue = S.Union(
  S.Struct({ Integer: S.Number }),
  S.Struct({ IntegerList: IntegerList }),
  S.Struct({ Double: S.Number }),
  S.Struct({ String: S.String }),
  S.Struct({ StringList: StringList }),
  S.Struct({ Boolean: S.Boolean }),
  S.Struct({ Enum: S.String }),
  S.Struct({ EnumList: StringList }),
);
export interface ParameterConfiguration {
  ValueType?: ParameterValueType;
  Value?: ParameterValue;
}
export const ParameterConfiguration = S.suspend(() =>
  S.Struct({
    ValueType: S.optional(ParameterValueType),
    Value: S.optional(ParameterValue),
  }),
).annotations({
  identifier: "ParameterConfiguration",
}) as any as S.Schema<ParameterConfiguration>;
export type Parameters = { [key: string]: ParameterConfiguration | undefined };
export const Parameters = S.Record({
  key: S.String,
  value: S.UndefinedOr(ParameterConfiguration),
});
export interface SecurityControlCustomParameter {
  SecurityControlId?: string;
  Parameters?: { [key: string]: ParameterConfiguration | undefined };
}
export const SecurityControlCustomParameter = S.suspend(() =>
  S.Struct({
    SecurityControlId: S.optional(S.String),
    Parameters: S.optional(Parameters),
  }),
).annotations({
  identifier: "SecurityControlCustomParameter",
}) as any as S.Schema<SecurityControlCustomParameter>;
export type SecurityControlCustomParametersList =
  SecurityControlCustomParameter[];
export const SecurityControlCustomParametersList = S.Array(
  SecurityControlCustomParameter,
);
export interface SecurityControlsConfiguration {
  EnabledSecurityControlIdentifiers?: string[];
  DisabledSecurityControlIdentifiers?: string[];
  SecurityControlCustomParameters?: SecurityControlCustomParameter[];
}
export const SecurityControlsConfiguration = S.suspend(() =>
  S.Struct({
    EnabledSecurityControlIdentifiers: S.optional(
      EnabledSecurityControlIdentifierList,
    ),
    DisabledSecurityControlIdentifiers: S.optional(
      DisabledSecurityControlIdentifierList,
    ),
    SecurityControlCustomParameters: S.optional(
      SecurityControlCustomParametersList,
    ),
  }),
).annotations({
  identifier: "SecurityControlsConfiguration",
}) as any as S.Schema<SecurityControlsConfiguration>;
export interface SecurityHubPolicy {
  ServiceEnabled?: boolean;
  EnabledStandardIdentifiers?: string[];
  SecurityControlsConfiguration?: SecurityControlsConfiguration;
}
export const SecurityHubPolicy = S.suspend(() =>
  S.Struct({
    ServiceEnabled: S.optional(S.Boolean),
    EnabledStandardIdentifiers: S.optional(EnabledStandardIdentifierList),
    SecurityControlsConfiguration: S.optional(SecurityControlsConfiguration),
  }),
).annotations({
  identifier: "SecurityHubPolicy",
}) as any as S.Schema<SecurityHubPolicy>;
export type Policy = { SecurityHub: SecurityHubPolicy };
export const Policy = S.Union(S.Struct({ SecurityHub: SecurityHubPolicy }));
export interface UpdateConfigurationPolicyRequest {
  Identifier: string;
  Name?: string;
  Description?: string;
  UpdatedReason?: string;
  ConfigurationPolicy?: Policy;
}
export const UpdateConfigurationPolicyRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    UpdatedReason: S.optional(S.String),
    ConfigurationPolicy: S.optional(Policy),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/configurationPolicy/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationPolicyRequest",
}) as any as S.Schema<UpdateConfigurationPolicyRequest>;
export interface UpdateFindingAggregatorRequest {
  FindingAggregatorArn?: string;
  RegionLinkingMode?: string;
  Regions?: string[];
}
export const UpdateFindingAggregatorRequest = S.suspend(() =>
  S.Struct({
    FindingAggregatorArn: S.optional(S.String),
    RegionLinkingMode: S.optional(S.String),
    Regions: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/findingAggregator/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFindingAggregatorRequest",
}) as any as S.Schema<UpdateFindingAggregatorRequest>;
export type StringFilterComparison =
  | "EQUALS"
  | "PREFIX"
  | "NOT_EQUALS"
  | "PREFIX_NOT_EQUALS"
  | "CONTAINS"
  | "NOT_CONTAINS"
  | "CONTAINS_WORD"
  | (string & {});
export const StringFilterComparison = S.String;
export interface StringFilter {
  Value?: string;
  Comparison?: StringFilterComparison;
}
export const StringFilter = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String),
    Comparison: S.optional(StringFilterComparison),
  }),
).annotations({ identifier: "StringFilter" }) as any as S.Schema<StringFilter>;
export type StringFilterList = StringFilter[];
export const StringFilterList = S.Array(StringFilter);
export type DateRangeUnit = "DAYS" | (string & {});
export const DateRangeUnit = S.String;
export interface DateRange {
  Value?: number;
  Unit?: DateRangeUnit;
}
export const DateRange = S.suspend(() =>
  S.Struct({ Value: S.optional(S.Number), Unit: S.optional(DateRangeUnit) }),
).annotations({ identifier: "DateRange" }) as any as S.Schema<DateRange>;
export interface DateFilter {
  Start?: string;
  End?: string;
  DateRange?: DateRange;
}
export const DateFilter = S.suspend(() =>
  S.Struct({
    Start: S.optional(S.String),
    End: S.optional(S.String),
    DateRange: S.optional(DateRange),
  }),
).annotations({ identifier: "DateFilter" }) as any as S.Schema<DateFilter>;
export type DateFilterList = DateFilter[];
export const DateFilterList = S.Array(DateFilter);
export interface NumberFilter {
  Gte?: number;
  Lte?: number;
  Eq?: number;
  Gt?: number;
  Lt?: number;
}
export const NumberFilter = S.suspend(() =>
  S.Struct({
    Gte: S.optional(S.Number),
    Lte: S.optional(S.Number),
    Eq: S.optional(S.Number),
    Gt: S.optional(S.Number),
    Lt: S.optional(S.Number),
  }),
).annotations({ identifier: "NumberFilter" }) as any as S.Schema<NumberFilter>;
export type NumberFilterList = NumberFilter[];
export const NumberFilterList = S.Array(NumberFilter);
export type MapFilterComparison =
  | "EQUALS"
  | "NOT_EQUALS"
  | "CONTAINS"
  | "NOT_CONTAINS"
  | (string & {});
export const MapFilterComparison = S.String;
export interface MapFilter {
  Key?: string;
  Value?: string;
  Comparison?: MapFilterComparison;
}
export const MapFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    Comparison: S.optional(MapFilterComparison),
  }),
).annotations({ identifier: "MapFilter" }) as any as S.Schema<MapFilter>;
export type MapFilterList = MapFilter[];
export const MapFilterList = S.Array(MapFilter);
export interface IpFilter {
  Cidr?: string;
}
export const IpFilter = S.suspend(() =>
  S.Struct({ Cidr: S.optional(S.String) }),
).annotations({ identifier: "IpFilter" }) as any as S.Schema<IpFilter>;
export type IpFilterList = IpFilter[];
export const IpFilterList = S.Array(IpFilter);
export interface KeywordFilter {
  Value?: string;
}
export const KeywordFilter = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String) }),
).annotations({
  identifier: "KeywordFilter",
}) as any as S.Schema<KeywordFilter>;
export type KeywordFilterList = KeywordFilter[];
export const KeywordFilterList = S.Array(KeywordFilter);
export interface BooleanFilter {
  Value?: boolean;
}
export const BooleanFilter = S.suspend(() =>
  S.Struct({ Value: S.optional(S.Boolean) }),
).annotations({
  identifier: "BooleanFilter",
}) as any as S.Schema<BooleanFilter>;
export type BooleanFilterList = BooleanFilter[];
export const BooleanFilterList = S.Array(BooleanFilter);
export interface AwsSecurityFindingFilters {
  ProductArn?: StringFilter[];
  AwsAccountId?: StringFilter[];
  Id?: StringFilter[];
  GeneratorId?: StringFilter[];
  Region?: StringFilter[];
  Type?: StringFilter[];
  FirstObservedAt?: DateFilter[];
  LastObservedAt?: DateFilter[];
  CreatedAt?: DateFilter[];
  UpdatedAt?: DateFilter[];
  SeverityProduct?: NumberFilter[];
  SeverityNormalized?: NumberFilter[];
  SeverityLabel?: StringFilter[];
  Confidence?: NumberFilter[];
  Criticality?: NumberFilter[];
  Title?: StringFilter[];
  Description?: StringFilter[];
  RecommendationText?: StringFilter[];
  SourceUrl?: StringFilter[];
  ProductFields?: MapFilter[];
  ProductName?: StringFilter[];
  CompanyName?: StringFilter[];
  UserDefinedFields?: MapFilter[];
  MalwareName?: StringFilter[];
  MalwareType?: StringFilter[];
  MalwarePath?: StringFilter[];
  MalwareState?: StringFilter[];
  NetworkDirection?: StringFilter[];
  NetworkProtocol?: StringFilter[];
  NetworkSourceIpV4?: IpFilter[];
  NetworkSourceIpV6?: IpFilter[];
  NetworkSourcePort?: NumberFilter[];
  NetworkSourceDomain?: StringFilter[];
  NetworkSourceMac?: StringFilter[];
  NetworkDestinationIpV4?: IpFilter[];
  NetworkDestinationIpV6?: IpFilter[];
  NetworkDestinationPort?: NumberFilter[];
  NetworkDestinationDomain?: StringFilter[];
  ProcessName?: StringFilter[];
  ProcessPath?: StringFilter[];
  ProcessPid?: NumberFilter[];
  ProcessParentPid?: NumberFilter[];
  ProcessLaunchedAt?: DateFilter[];
  ProcessTerminatedAt?: DateFilter[];
  ThreatIntelIndicatorType?: StringFilter[];
  ThreatIntelIndicatorValue?: StringFilter[];
  ThreatIntelIndicatorCategory?: StringFilter[];
  ThreatIntelIndicatorLastObservedAt?: DateFilter[];
  ThreatIntelIndicatorSource?: StringFilter[];
  ThreatIntelIndicatorSourceUrl?: StringFilter[];
  ResourceType?: StringFilter[];
  ResourceId?: StringFilter[];
  ResourcePartition?: StringFilter[];
  ResourceRegion?: StringFilter[];
  ResourceTags?: MapFilter[];
  ResourceAwsEc2InstanceType?: StringFilter[];
  ResourceAwsEc2InstanceImageId?: StringFilter[];
  ResourceAwsEc2InstanceIpV4Addresses?: IpFilter[];
  ResourceAwsEc2InstanceIpV6Addresses?: IpFilter[];
  ResourceAwsEc2InstanceKeyName?: StringFilter[];
  ResourceAwsEc2InstanceIamInstanceProfileArn?: StringFilter[];
  ResourceAwsEc2InstanceVpcId?: StringFilter[];
  ResourceAwsEc2InstanceSubnetId?: StringFilter[];
  ResourceAwsEc2InstanceLaunchedAt?: DateFilter[];
  ResourceAwsS3BucketOwnerId?: StringFilter[];
  ResourceAwsS3BucketOwnerName?: StringFilter[];
  ResourceAwsIamAccessKeyUserName?: StringFilter[];
  ResourceAwsIamAccessKeyPrincipalName?: StringFilter[];
  ResourceAwsIamAccessKeyStatus?: StringFilter[];
  ResourceAwsIamAccessKeyCreatedAt?: DateFilter[];
  ResourceAwsIamUserUserName?: StringFilter[];
  ResourceContainerName?: StringFilter[];
  ResourceContainerImageId?: StringFilter[];
  ResourceContainerImageName?: StringFilter[];
  ResourceContainerLaunchedAt?: DateFilter[];
  ResourceDetailsOther?: MapFilter[];
  ComplianceStatus?: StringFilter[];
  VerificationState?: StringFilter[];
  WorkflowState?: StringFilter[];
  WorkflowStatus?: StringFilter[];
  RecordState?: StringFilter[];
  RelatedFindingsProductArn?: StringFilter[];
  RelatedFindingsId?: StringFilter[];
  NoteText?: StringFilter[];
  NoteUpdatedAt?: DateFilter[];
  NoteUpdatedBy?: StringFilter[];
  Keyword?: KeywordFilter[];
  FindingProviderFieldsConfidence?: NumberFilter[];
  FindingProviderFieldsCriticality?: NumberFilter[];
  FindingProviderFieldsRelatedFindingsId?: StringFilter[];
  FindingProviderFieldsRelatedFindingsProductArn?: StringFilter[];
  FindingProviderFieldsSeverityLabel?: StringFilter[];
  FindingProviderFieldsSeverityOriginal?: StringFilter[];
  FindingProviderFieldsTypes?: StringFilter[];
  Sample?: BooleanFilter[];
  ComplianceSecurityControlId?: StringFilter[];
  ComplianceAssociatedStandardsId?: StringFilter[];
  VulnerabilitiesExploitAvailable?: StringFilter[];
  VulnerabilitiesFixAvailable?: StringFilter[];
  ComplianceSecurityControlParametersName?: StringFilter[];
  ComplianceSecurityControlParametersValue?: StringFilter[];
  AwsAccountName?: StringFilter[];
  ResourceApplicationName?: StringFilter[];
  ResourceApplicationArn?: StringFilter[];
}
export const AwsSecurityFindingFilters = S.suspend(() =>
  S.Struct({
    ProductArn: S.optional(StringFilterList),
    AwsAccountId: S.optional(StringFilterList),
    Id: S.optional(StringFilterList),
    GeneratorId: S.optional(StringFilterList),
    Region: S.optional(StringFilterList),
    Type: S.optional(StringFilterList),
    FirstObservedAt: S.optional(DateFilterList),
    LastObservedAt: S.optional(DateFilterList),
    CreatedAt: S.optional(DateFilterList),
    UpdatedAt: S.optional(DateFilterList),
    SeverityProduct: S.optional(NumberFilterList),
    SeverityNormalized: S.optional(NumberFilterList),
    SeverityLabel: S.optional(StringFilterList),
    Confidence: S.optional(NumberFilterList),
    Criticality: S.optional(NumberFilterList),
    Title: S.optional(StringFilterList),
    Description: S.optional(StringFilterList),
    RecommendationText: S.optional(StringFilterList),
    SourceUrl: S.optional(StringFilterList),
    ProductFields: S.optional(MapFilterList),
    ProductName: S.optional(StringFilterList),
    CompanyName: S.optional(StringFilterList),
    UserDefinedFields: S.optional(MapFilterList),
    MalwareName: S.optional(StringFilterList),
    MalwareType: S.optional(StringFilterList),
    MalwarePath: S.optional(StringFilterList),
    MalwareState: S.optional(StringFilterList),
    NetworkDirection: S.optional(StringFilterList),
    NetworkProtocol: S.optional(StringFilterList),
    NetworkSourceIpV4: S.optional(IpFilterList),
    NetworkSourceIpV6: S.optional(IpFilterList),
    NetworkSourcePort: S.optional(NumberFilterList),
    NetworkSourceDomain: S.optional(StringFilterList),
    NetworkSourceMac: S.optional(StringFilterList),
    NetworkDestinationIpV4: S.optional(IpFilterList),
    NetworkDestinationIpV6: S.optional(IpFilterList),
    NetworkDestinationPort: S.optional(NumberFilterList),
    NetworkDestinationDomain: S.optional(StringFilterList),
    ProcessName: S.optional(StringFilterList),
    ProcessPath: S.optional(StringFilterList),
    ProcessPid: S.optional(NumberFilterList),
    ProcessParentPid: S.optional(NumberFilterList),
    ProcessLaunchedAt: S.optional(DateFilterList),
    ProcessTerminatedAt: S.optional(DateFilterList),
    ThreatIntelIndicatorType: S.optional(StringFilterList),
    ThreatIntelIndicatorValue: S.optional(StringFilterList),
    ThreatIntelIndicatorCategory: S.optional(StringFilterList),
    ThreatIntelIndicatorLastObservedAt: S.optional(DateFilterList),
    ThreatIntelIndicatorSource: S.optional(StringFilterList),
    ThreatIntelIndicatorSourceUrl: S.optional(StringFilterList),
    ResourceType: S.optional(StringFilterList),
    ResourceId: S.optional(StringFilterList),
    ResourcePartition: S.optional(StringFilterList),
    ResourceRegion: S.optional(StringFilterList),
    ResourceTags: S.optional(MapFilterList),
    ResourceAwsEc2InstanceType: S.optional(StringFilterList),
    ResourceAwsEc2InstanceImageId: S.optional(StringFilterList),
    ResourceAwsEc2InstanceIpV4Addresses: S.optional(IpFilterList),
    ResourceAwsEc2InstanceIpV6Addresses: S.optional(IpFilterList),
    ResourceAwsEc2InstanceKeyName: S.optional(StringFilterList),
    ResourceAwsEc2InstanceIamInstanceProfileArn: S.optional(StringFilterList),
    ResourceAwsEc2InstanceVpcId: S.optional(StringFilterList),
    ResourceAwsEc2InstanceSubnetId: S.optional(StringFilterList),
    ResourceAwsEc2InstanceLaunchedAt: S.optional(DateFilterList),
    ResourceAwsS3BucketOwnerId: S.optional(StringFilterList),
    ResourceAwsS3BucketOwnerName: S.optional(StringFilterList),
    ResourceAwsIamAccessKeyUserName: S.optional(StringFilterList),
    ResourceAwsIamAccessKeyPrincipalName: S.optional(StringFilterList),
    ResourceAwsIamAccessKeyStatus: S.optional(StringFilterList),
    ResourceAwsIamAccessKeyCreatedAt: S.optional(DateFilterList),
    ResourceAwsIamUserUserName: S.optional(StringFilterList),
    ResourceContainerName: S.optional(StringFilterList),
    ResourceContainerImageId: S.optional(StringFilterList),
    ResourceContainerImageName: S.optional(StringFilterList),
    ResourceContainerLaunchedAt: S.optional(DateFilterList),
    ResourceDetailsOther: S.optional(MapFilterList),
    ComplianceStatus: S.optional(StringFilterList),
    VerificationState: S.optional(StringFilterList),
    WorkflowState: S.optional(StringFilterList),
    WorkflowStatus: S.optional(StringFilterList),
    RecordState: S.optional(StringFilterList),
    RelatedFindingsProductArn: S.optional(StringFilterList),
    RelatedFindingsId: S.optional(StringFilterList),
    NoteText: S.optional(StringFilterList),
    NoteUpdatedAt: S.optional(DateFilterList),
    NoteUpdatedBy: S.optional(StringFilterList),
    Keyword: S.optional(KeywordFilterList),
    FindingProviderFieldsConfidence: S.optional(NumberFilterList),
    FindingProviderFieldsCriticality: S.optional(NumberFilterList),
    FindingProviderFieldsRelatedFindingsId: S.optional(StringFilterList),
    FindingProviderFieldsRelatedFindingsProductArn:
      S.optional(StringFilterList),
    FindingProviderFieldsSeverityLabel: S.optional(StringFilterList),
    FindingProviderFieldsSeverityOriginal: S.optional(StringFilterList),
    FindingProviderFieldsTypes: S.optional(StringFilterList),
    Sample: S.optional(BooleanFilterList),
    ComplianceSecurityControlId: S.optional(StringFilterList),
    ComplianceAssociatedStandardsId: S.optional(StringFilterList),
    VulnerabilitiesExploitAvailable: S.optional(StringFilterList),
    VulnerabilitiesFixAvailable: S.optional(StringFilterList),
    ComplianceSecurityControlParametersName: S.optional(StringFilterList),
    ComplianceSecurityControlParametersValue: S.optional(StringFilterList),
    AwsAccountName: S.optional(StringFilterList),
    ResourceApplicationName: S.optional(StringFilterList),
    ResourceApplicationArn: S.optional(StringFilterList),
  }),
).annotations({
  identifier: "AwsSecurityFindingFilters",
}) as any as S.Schema<AwsSecurityFindingFilters>;
export interface NoteUpdate {
  Text?: string;
  UpdatedBy?: string;
}
export const NoteUpdate = S.suspend(() =>
  S.Struct({ Text: S.optional(S.String), UpdatedBy: S.optional(S.String) }),
).annotations({ identifier: "NoteUpdate" }) as any as S.Schema<NoteUpdate>;
export interface UpdateFindingsRequest {
  Filters?: AwsSecurityFindingFilters;
  Note?: NoteUpdate;
  RecordState?: RecordState;
}
export const UpdateFindingsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(AwsSecurityFindingFilters),
    Note: S.optional(NoteUpdate),
    RecordState: S.optional(RecordState),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/findings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFindingsRequest",
}) as any as S.Schema<UpdateFindingsRequest>;
export interface UpdateFindingsResponse {}
export const UpdateFindingsResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateFindingsResponse" },
) as any as S.Schema<UpdateFindingsResponse>;
export interface UpdateInsightRequest {
  InsightArn: string;
  Name?: string;
  Filters?: AwsSecurityFindingFilters;
  GroupByAttribute?: string;
}
export const UpdateInsightRequest = S.suspend(() =>
  S.Struct({
    InsightArn: S.String.pipe(T.HttpLabel("InsightArn")),
    Name: S.optional(S.String),
    Filters: S.optional(AwsSecurityFindingFilters),
    GroupByAttribute: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/insights/{InsightArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInsightRequest",
}) as any as S.Schema<UpdateInsightRequest>;
export interface UpdateInsightResponse {}
export const UpdateInsightResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateInsightResponse",
}) as any as S.Schema<UpdateInsightResponse>;
export type OrganizationConfigurationConfigurationType =
  | "CENTRAL"
  | "LOCAL"
  | (string & {});
export const OrganizationConfigurationConfigurationType = S.String;
export type OrganizationConfigurationStatus =
  | "PENDING"
  | "ENABLED"
  | "FAILED"
  | (string & {});
export const OrganizationConfigurationStatus = S.String;
export interface OrganizationConfiguration {
  ConfigurationType?: OrganizationConfigurationConfigurationType;
  Status?: OrganizationConfigurationStatus;
  StatusMessage?: string;
}
export const OrganizationConfiguration = S.suspend(() =>
  S.Struct({
    ConfigurationType: S.optional(OrganizationConfigurationConfigurationType),
    Status: S.optional(OrganizationConfigurationStatus),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "OrganizationConfiguration",
}) as any as S.Schema<OrganizationConfiguration>;
export interface UpdateOrganizationConfigurationRequest {
  AutoEnable?: boolean;
  AutoEnableStandards?: AutoEnableStandards;
  OrganizationConfiguration?: OrganizationConfiguration;
}
export const UpdateOrganizationConfigurationRequest = S.suspend(() =>
  S.Struct({
    AutoEnable: S.optional(S.Boolean),
    AutoEnableStandards: S.optional(AutoEnableStandards),
    OrganizationConfiguration: S.optional(OrganizationConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/organization/configuration" }),
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
export interface UpdateSecurityHubConfigurationRequest {
  AutoEnableControls?: boolean;
  ControlFindingGenerator?: ControlFindingGenerator;
}
export const UpdateSecurityHubConfigurationRequest = S.suspend(() =>
  S.Struct({
    AutoEnableControls: S.optional(S.Boolean),
    ControlFindingGenerator: S.optional(ControlFindingGenerator),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSecurityHubConfigurationRequest",
}) as any as S.Schema<UpdateSecurityHubConfigurationRequest>;
export interface UpdateSecurityHubConfigurationResponse {}
export const UpdateSecurityHubConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateSecurityHubConfigurationResponse",
}) as any as S.Schema<UpdateSecurityHubConfigurationResponse>;
export interface UpdateStandardsControlRequest {
  StandardsControlArn: string;
  ControlStatus?: ControlStatus;
  DisabledReason?: string;
}
export const UpdateStandardsControlRequest = S.suspend(() =>
  S.Struct({
    StandardsControlArn: S.String.pipe(T.HttpLabel("StandardsControlArn")),
    ControlStatus: S.optional(ControlStatus),
    DisabledReason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/standards/control/{StandardsControlArn+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateStandardsControlRequest",
}) as any as S.Schema<UpdateStandardsControlRequest>;
export interface UpdateStandardsControlResponse {}
export const UpdateStandardsControlResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateStandardsControlResponse",
}) as any as S.Schema<UpdateStandardsControlResponse>;
export type WorkflowState =
  | "NEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "DEFERRED"
  | "RESOLVED"
  | (string & {});
export const WorkflowState = S.String;
export type SeverityLabel =
  | "INFORMATIONAL"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL"
  | (string & {});
export const SeverityLabel = S.String;
export type WorkflowStatus =
  | "NEW"
  | "NOTIFIED"
  | "RESOLVED"
  | "SUPPRESSED"
  | (string & {});
export const WorkflowStatus = S.String;
export type AssociationStatus = "ENABLED" | "DISABLED" | (string & {});
export const AssociationStatus = S.String;
export type AutomationRulesActionType = "FINDING_FIELDS_UPDATE" | (string & {});
export const AutomationRulesActionType = S.String;
export type GroupByField =
  | "activity_name"
  | "cloud.account.uid"
  | "cloud.provider"
  | "cloud.region"
  | "compliance.assessments.name"
  | "compliance.status"
  | "compliance.control"
  | "finding_info.title"
  | "finding_info.related_events.traits.category"
  | "finding_info.types"
  | "metadata.product.name"
  | "metadata.product.uid"
  | "resources.type"
  | "resources.uid"
  | "severity"
  | "status"
  | "vulnerabilities.fix_coverage"
  | "class_name"
  | "vulnerabilities.affected_packages.name"
  | "finding_info.analytic.name"
  | "compliance.standards"
  | "cloud.account.name"
  | "vendor_attributes.severity"
  | (string & {});
export const GroupByField = S.String;
export type ResourceGroupByField =
  | "AccountId"
  | "Region"
  | "ResourceCategory"
  | "ResourceType"
  | "ResourceName"
  | "FindingsSummary.FindingType"
  | (string & {});
export const ResourceGroupByField = S.String;
export type AssociationType = "INHERITED" | "APPLIED" | (string & {});
export const AssociationType = S.String;
export type ConfigurationPolicyAssociationStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | (string & {});
export const ConfigurationPolicyAssociationStatus = S.String;
export interface ConfigurationPolicyAssociation {
  Target?: Target;
}
export const ConfigurationPolicyAssociation = S.suspend(() =>
  S.Struct({ Target: S.optional(Target) }),
).annotations({
  identifier: "ConfigurationPolicyAssociation",
}) as any as S.Schema<ConfigurationPolicyAssociation>;
export type ConfigurationPolicyAssociationsList =
  ConfigurationPolicyAssociation[];
export const ConfigurationPolicyAssociationsList = S.Array(
  ConfigurationPolicyAssociation,
);
export interface StandardsControlAssociationId {
  SecurityControlId?: string;
  StandardsArn?: string;
}
export const StandardsControlAssociationId = S.suspend(() =>
  S.Struct({
    SecurityControlId: S.optional(S.String),
    StandardsArn: S.optional(S.String),
  }),
).annotations({
  identifier: "StandardsControlAssociationId",
}) as any as S.Schema<StandardsControlAssociationId>;
export type StandardsControlAssociationIds = StandardsControlAssociationId[];
export const StandardsControlAssociationIds = S.Array(
  StandardsControlAssociationId,
);
export interface AutomationRulesFindingFilters {
  ProductArn?: StringFilter[];
  AwsAccountId?: StringFilter[];
  Id?: StringFilter[];
  GeneratorId?: StringFilter[];
  Type?: StringFilter[];
  FirstObservedAt?: DateFilter[];
  LastObservedAt?: DateFilter[];
  CreatedAt?: DateFilter[];
  UpdatedAt?: DateFilter[];
  Confidence?: NumberFilter[];
  Criticality?: NumberFilter[];
  Title?: StringFilter[];
  Description?: StringFilter[];
  SourceUrl?: StringFilter[];
  ProductName?: StringFilter[];
  CompanyName?: StringFilter[];
  SeverityLabel?: StringFilter[];
  ResourceType?: StringFilter[];
  ResourceId?: StringFilter[];
  ResourcePartition?: StringFilter[];
  ResourceRegion?: StringFilter[];
  ResourceTags?: MapFilter[];
  ResourceDetailsOther?: MapFilter[];
  ComplianceStatus?: StringFilter[];
  ComplianceSecurityControlId?: StringFilter[];
  ComplianceAssociatedStandardsId?: StringFilter[];
  VerificationState?: StringFilter[];
  WorkflowStatus?: StringFilter[];
  RecordState?: StringFilter[];
  RelatedFindingsProductArn?: StringFilter[];
  RelatedFindingsId?: StringFilter[];
  NoteText?: StringFilter[];
  NoteUpdatedAt?: DateFilter[];
  NoteUpdatedBy?: StringFilter[];
  UserDefinedFields?: MapFilter[];
  ResourceApplicationArn?: StringFilter[];
  ResourceApplicationName?: StringFilter[];
  AwsAccountName?: StringFilter[];
}
export const AutomationRulesFindingFilters = S.suspend(() =>
  S.Struct({
    ProductArn: S.optional(StringFilterList),
    AwsAccountId: S.optional(StringFilterList),
    Id: S.optional(StringFilterList),
    GeneratorId: S.optional(StringFilterList),
    Type: S.optional(StringFilterList),
    FirstObservedAt: S.optional(DateFilterList),
    LastObservedAt: S.optional(DateFilterList),
    CreatedAt: S.optional(DateFilterList),
    UpdatedAt: S.optional(DateFilterList),
    Confidence: S.optional(NumberFilterList),
    Criticality: S.optional(NumberFilterList),
    Title: S.optional(StringFilterList),
    Description: S.optional(StringFilterList),
    SourceUrl: S.optional(StringFilterList),
    ProductName: S.optional(StringFilterList),
    CompanyName: S.optional(StringFilterList),
    SeverityLabel: S.optional(StringFilterList),
    ResourceType: S.optional(StringFilterList),
    ResourceId: S.optional(StringFilterList),
    ResourcePartition: S.optional(StringFilterList),
    ResourceRegion: S.optional(StringFilterList),
    ResourceTags: S.optional(MapFilterList),
    ResourceDetailsOther: S.optional(MapFilterList),
    ComplianceStatus: S.optional(StringFilterList),
    ComplianceSecurityControlId: S.optional(StringFilterList),
    ComplianceAssociatedStandardsId: S.optional(StringFilterList),
    VerificationState: S.optional(StringFilterList),
    WorkflowStatus: S.optional(StringFilterList),
    RecordState: S.optional(StringFilterList),
    RelatedFindingsProductArn: S.optional(StringFilterList),
    RelatedFindingsId: S.optional(StringFilterList),
    NoteText: S.optional(StringFilterList),
    NoteUpdatedAt: S.optional(DateFilterList),
    NoteUpdatedBy: S.optional(StringFilterList),
    UserDefinedFields: S.optional(MapFilterList),
    ResourceApplicationArn: S.optional(StringFilterList),
    ResourceApplicationName: S.optional(StringFilterList),
    AwsAccountName: S.optional(StringFilterList),
  }),
).annotations({
  identifier: "AutomationRulesFindingFilters",
}) as any as S.Schema<AutomationRulesFindingFilters>;
export interface SeverityUpdate {
  Normalized?: number;
  Product?: number;
  Label?: SeverityLabel;
}
export const SeverityUpdate = S.suspend(() =>
  S.Struct({
    Normalized: S.optional(S.Number),
    Product: S.optional(S.Number),
    Label: S.optional(SeverityLabel),
  }),
).annotations({
  identifier: "SeverityUpdate",
}) as any as S.Schema<SeverityUpdate>;
export type FieldMap = { [key: string]: string | undefined };
export const FieldMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface WorkflowUpdate {
  Status?: WorkflowStatus;
}
export const WorkflowUpdate = S.suspend(() =>
  S.Struct({ Status: S.optional(WorkflowStatus) }),
).annotations({
  identifier: "WorkflowUpdate",
}) as any as S.Schema<WorkflowUpdate>;
export interface RelatedFinding {
  ProductArn?: string;
  Id?: string;
}
export const RelatedFinding = S.suspend(() =>
  S.Struct({ ProductArn: S.optional(S.String), Id: S.optional(S.String) }),
).annotations({
  identifier: "RelatedFinding",
}) as any as S.Schema<RelatedFinding>;
export type RelatedFindingList = RelatedFinding[];
export const RelatedFindingList = S.Array(RelatedFinding);
export interface AutomationRulesFindingFieldsUpdate {
  Note?: NoteUpdate;
  Severity?: SeverityUpdate;
  VerificationState?: VerificationState;
  Confidence?: number;
  Criticality?: number;
  Types?: string[];
  UserDefinedFields?: { [key: string]: string | undefined };
  Workflow?: WorkflowUpdate;
  RelatedFindings?: RelatedFinding[];
}
export const AutomationRulesFindingFieldsUpdate = S.suspend(() =>
  S.Struct({
    Note: S.optional(NoteUpdate),
    Severity: S.optional(SeverityUpdate),
    VerificationState: S.optional(VerificationState),
    Confidence: S.optional(S.Number),
    Criticality: S.optional(S.Number),
    Types: S.optional(TypeList),
    UserDefinedFields: S.optional(FieldMap),
    Workflow: S.optional(WorkflowUpdate),
    RelatedFindings: S.optional(RelatedFindingList),
  }),
).annotations({
  identifier: "AutomationRulesFindingFieldsUpdate",
}) as any as S.Schema<AutomationRulesFindingFieldsUpdate>;
export interface AutomationRulesAction {
  Type?: AutomationRulesActionType;
  FindingFieldsUpdate?: AutomationRulesFindingFieldsUpdate;
}
export const AutomationRulesAction = S.suspend(() =>
  S.Struct({
    Type: S.optional(AutomationRulesActionType),
    FindingFieldsUpdate: S.optional(AutomationRulesFindingFieldsUpdate),
  }),
).annotations({
  identifier: "AutomationRulesAction",
}) as any as S.Schema<AutomationRulesAction>;
export type ActionList = AutomationRulesAction[];
export const ActionList = S.Array(AutomationRulesAction);
export interface UpdateAutomationRulesRequestItem {
  RuleArn?: string;
  RuleStatus?: RuleStatus;
  RuleOrder?: number;
  Description?: string;
  RuleName?: string;
  IsTerminal?: boolean;
  Criteria?: AutomationRulesFindingFilters;
  Actions?: AutomationRulesAction[];
}
export const UpdateAutomationRulesRequestItem = S.suspend(() =>
  S.Struct({
    RuleArn: S.optional(S.String),
    RuleStatus: S.optional(RuleStatus),
    RuleOrder: S.optional(S.Number),
    Description: S.optional(S.String),
    RuleName: S.optional(S.String),
    IsTerminal: S.optional(S.Boolean),
    Criteria: S.optional(AutomationRulesFindingFilters),
    Actions: S.optional(ActionList),
  }),
).annotations({
  identifier: "UpdateAutomationRulesRequestItem",
}) as any as S.Schema<UpdateAutomationRulesRequestItem>;
export type UpdateAutomationRulesRequestItemsList =
  UpdateAutomationRulesRequestItem[];
export const UpdateAutomationRulesRequestItemsList = S.Array(
  UpdateAutomationRulesRequestItem,
);
export type AwsSecurityFindingIdentifierList = AwsSecurityFindingIdentifier[];
export const AwsSecurityFindingIdentifierList = S.Array(
  AwsSecurityFindingIdentifier,
);
export interface OcsfFindingIdentifier {
  CloudAccountUid?: string;
  FindingInfoUid?: string;
  MetadataProductUid?: string;
}
export const OcsfFindingIdentifier = S.suspend(() =>
  S.Struct({
    CloudAccountUid: S.optional(S.String),
    FindingInfoUid: S.optional(S.String),
    MetadataProductUid: S.optional(S.String),
  }),
).annotations({
  identifier: "OcsfFindingIdentifier",
}) as any as S.Schema<OcsfFindingIdentifier>;
export type OcsfFindingIdentifierList = OcsfFindingIdentifier[];
export const OcsfFindingIdentifierList = S.Array(OcsfFindingIdentifier);
export interface StandardsControlAssociationUpdate {
  StandardsArn?: string;
  SecurityControlId?: string;
  AssociationStatus?: AssociationStatus;
  UpdatedReason?: string;
}
export const StandardsControlAssociationUpdate = S.suspend(() =>
  S.Struct({
    StandardsArn: S.optional(S.String),
    SecurityControlId: S.optional(S.String),
    AssociationStatus: S.optional(AssociationStatus),
    UpdatedReason: S.optional(S.String),
  }),
).annotations({
  identifier: "StandardsControlAssociationUpdate",
}) as any as S.Schema<StandardsControlAssociationUpdate>;
export type StandardsControlAssociationUpdates =
  StandardsControlAssociationUpdate[];
export const StandardsControlAssociationUpdates = S.Array(
  StandardsControlAssociationUpdate,
);
export interface AccountDetails {
  AccountId?: string;
  Email?: string;
}
export const AccountDetails = S.suspend(() =>
  S.Struct({ AccountId: S.optional(S.String), Email: S.optional(S.String) }),
).annotations({
  identifier: "AccountDetails",
}) as any as S.Schema<AccountDetails>;
export type AccountDetailsList = AccountDetails[];
export const AccountDetailsList = S.Array(AccountDetails);
export interface SortCriterion {
  Field?: string;
  SortOrder?: SortOrder;
}
export const SortCriterion = S.suspend(() =>
  S.Struct({ Field: S.optional(S.String), SortOrder: S.optional(SortOrder) }),
).annotations({
  identifier: "SortCriterion",
}) as any as S.Schema<SortCriterion>;
export type SortCriteria = SortCriterion[];
export const SortCriteria = S.Array(SortCriterion);
export interface GroupByRule {
  Filters?: OcsfFindingFilters;
  GroupByField?: GroupByField;
}
export const GroupByRule = S.suspend(() =>
  S.Struct({
    Filters: S.optional(OcsfFindingFilters),
    GroupByField: S.optional(GroupByField),
  }),
).annotations({ identifier: "GroupByRule" }) as any as S.Schema<GroupByRule>;
export type GroupByRules = GroupByRule[];
export const GroupByRules = S.Array(GroupByRule);
export type ResourcesCompositeFilterList = ResourcesCompositeFilter[];
export const ResourcesCompositeFilterList = S.Array(
  S.suspend(
    (): S.Schema<ResourcesCompositeFilter, any> => ResourcesCompositeFilter,
  ).annotations({ identifier: "ResourcesCompositeFilter" }),
) as any as S.Schema<ResourcesCompositeFilterList>;
export interface ResourcesFilters {
  CompositeFilters?: ResourcesCompositeFilter[];
  CompositeOperator?: AllowedOperators;
}
export const ResourcesFilters = S.suspend(() =>
  S.Struct({
    CompositeFilters: S.optional(ResourcesCompositeFilterList),
    CompositeOperator: S.optional(AllowedOperators),
  }),
).annotations({
  identifier: "ResourcesFilters",
}) as any as S.Schema<ResourcesFilters>;
export interface ResourceGroupByRule {
  GroupByField?: ResourceGroupByField;
  Filters?: ResourcesFilters;
}
export const ResourceGroupByRule = S.suspend(() =>
  S.Struct({
    GroupByField: S.optional(ResourceGroupByField),
    Filters: S.optional(ResourcesFilters),
  }),
).annotations({
  identifier: "ResourceGroupByRule",
}) as any as S.Schema<ResourceGroupByRule>;
export type ResourceGroupByRules = ResourceGroupByRule[];
export const ResourceGroupByRules = S.Array(ResourceGroupByRule);
export interface AssociationFilters {
  ConfigurationPolicyId?: string;
  AssociationType?: AssociationType;
  AssociationStatus?: ConfigurationPolicyAssociationStatus;
}
export const AssociationFilters = S.suspend(() =>
  S.Struct({
    ConfigurationPolicyId: S.optional(S.String),
    AssociationType: S.optional(AssociationType),
    AssociationStatus: S.optional(ConfigurationPolicyAssociationStatus),
  }),
).annotations({
  identifier: "AssociationFilters",
}) as any as S.Schema<AssociationFilters>;
export type ProductSubscriptionArnList = string[];
export const ProductSubscriptionArnList = S.Array(S.String);
export type InvitationList = Invitation[];
export const InvitationList = S.Array(Invitation);
export type SeverityRating =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL"
  | (string & {});
export const SeverityRating = S.String;
export type RegionAvailabilityStatus =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | (string & {});
export const RegionAvailabilityStatus = S.String;
export type SecurityControlProperty = "Parameters" | (string & {});
export const SecurityControlProperty = S.String;
export type CustomizableProperties = SecurityControlProperty[];
export const CustomizableProperties = S.Array(SecurityControlProperty);
export interface IntegerConfigurationOptions {
  DefaultValue?: number;
  Min?: number;
  Max?: number;
}
export const IntegerConfigurationOptions = S.suspend(() =>
  S.Struct({
    DefaultValue: S.optional(S.Number),
    Min: S.optional(S.Number),
    Max: S.optional(S.Number),
  }),
).annotations({
  identifier: "IntegerConfigurationOptions",
}) as any as S.Schema<IntegerConfigurationOptions>;
export interface IntegerListConfigurationOptions {
  DefaultValue?: number[];
  Min?: number;
  Max?: number;
  MaxItems?: number;
}
export const IntegerListConfigurationOptions = S.suspend(() =>
  S.Struct({
    DefaultValue: S.optional(IntegerList),
    Min: S.optional(S.Number),
    Max: S.optional(S.Number),
    MaxItems: S.optional(S.Number),
  }),
).annotations({
  identifier: "IntegerListConfigurationOptions",
}) as any as S.Schema<IntegerListConfigurationOptions>;
export interface DoubleConfigurationOptions {
  DefaultValue?: number;
  Min?: number;
  Max?: number;
}
export const DoubleConfigurationOptions = S.suspend(() =>
  S.Struct({
    DefaultValue: S.optional(S.Number),
    Min: S.optional(S.Number),
    Max: S.optional(S.Number),
  }),
).annotations({
  identifier: "DoubleConfigurationOptions",
}) as any as S.Schema<DoubleConfigurationOptions>;
export interface StringConfigurationOptions {
  DefaultValue?: string;
  Re2Expression?: string;
  ExpressionDescription?: string;
}
export const StringConfigurationOptions = S.suspend(() =>
  S.Struct({
    DefaultValue: S.optional(S.String),
    Re2Expression: S.optional(S.String),
    ExpressionDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "StringConfigurationOptions",
}) as any as S.Schema<StringConfigurationOptions>;
export interface StringListConfigurationOptions {
  DefaultValue?: string[];
  Re2Expression?: string;
  MaxItems?: number;
  ExpressionDescription?: string;
}
export const StringListConfigurationOptions = S.suspend(() =>
  S.Struct({
    DefaultValue: S.optional(StringList),
    Re2Expression: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    ExpressionDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "StringListConfigurationOptions",
}) as any as S.Schema<StringListConfigurationOptions>;
export interface BooleanConfigurationOptions {
  DefaultValue?: boolean;
}
export const BooleanConfigurationOptions = S.suspend(() =>
  S.Struct({ DefaultValue: S.optional(S.Boolean) }),
).annotations({
  identifier: "BooleanConfigurationOptions",
}) as any as S.Schema<BooleanConfigurationOptions>;
export interface EnumConfigurationOptions {
  DefaultValue?: string;
  AllowedValues?: string[];
}
export const EnumConfigurationOptions = S.suspend(() =>
  S.Struct({
    DefaultValue: S.optional(S.String),
    AllowedValues: S.optional(StringList),
  }),
).annotations({
  identifier: "EnumConfigurationOptions",
}) as any as S.Schema<EnumConfigurationOptions>;
export interface EnumListConfigurationOptions {
  DefaultValue?: string[];
  MaxItems?: number;
  AllowedValues?: string[];
}
export const EnumListConfigurationOptions = S.suspend(() =>
  S.Struct({
    DefaultValue: S.optional(StringList),
    MaxItems: S.optional(S.Number),
    AllowedValues: S.optional(StringList),
  }),
).annotations({
  identifier: "EnumListConfigurationOptions",
}) as any as S.Schema<EnumListConfigurationOptions>;
export type ConfigurationOptions =
  | {
      Integer: IntegerConfigurationOptions;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList: IntegerListConfigurationOptions;
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double: DoubleConfigurationOptions;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String: StringConfigurationOptions;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList: StringListConfigurationOptions;
      Boolean?: never;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean: BooleanConfigurationOptions;
      Enum?: never;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum: EnumConfigurationOptions;
      EnumList?: never;
    }
  | {
      Integer?: never;
      IntegerList?: never;
      Double?: never;
      String?: never;
      StringList?: never;
      Boolean?: never;
      Enum?: never;
      EnumList: EnumListConfigurationOptions;
    };
export const ConfigurationOptions = S.Union(
  S.Struct({ Integer: IntegerConfigurationOptions }),
  S.Struct({ IntegerList: IntegerListConfigurationOptions }),
  S.Struct({ Double: DoubleConfigurationOptions }),
  S.Struct({ String: StringConfigurationOptions }),
  S.Struct({ StringList: StringListConfigurationOptions }),
  S.Struct({ Boolean: BooleanConfigurationOptions }),
  S.Struct({ Enum: EnumConfigurationOptions }),
  S.Struct({ EnumList: EnumListConfigurationOptions }),
);
export interface ParameterDefinition {
  Description?: string;
  ConfigurationOptions?: ConfigurationOptions;
}
export const ParameterDefinition = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    ConfigurationOptions: S.optional(ConfigurationOptions),
  }),
).annotations({
  identifier: "ParameterDefinition",
}) as any as S.Schema<ParameterDefinition>;
export type ParameterDefinitions = {
  [key: string]: ParameterDefinition | undefined;
};
export const ParameterDefinitions = S.Record({
  key: S.String,
  value: S.UndefinedOr(ParameterDefinition),
});
export interface SecurityControlDefinition {
  SecurityControlId?: string;
  Title?: string;
  Description?: string;
  RemediationUrl?: string;
  SeverityRating?: SeverityRating;
  CurrentRegionAvailability?: RegionAvailabilityStatus;
  CustomizableProperties?: SecurityControlProperty[];
  ParameterDefinitions?: { [key: string]: ParameterDefinition | undefined };
}
export const SecurityControlDefinition = S.suspend(() =>
  S.Struct({
    SecurityControlId: S.optional(S.String),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    RemediationUrl: S.optional(S.String),
    SeverityRating: S.optional(SeverityRating),
    CurrentRegionAvailability: S.optional(RegionAvailabilityStatus),
    CustomizableProperties: S.optional(CustomizableProperties),
    ParameterDefinitions: S.optional(ParameterDefinitions),
  }),
).annotations({
  identifier: "SecurityControlDefinition",
}) as any as S.Schema<SecurityControlDefinition>;
export type SecurityControlDefinitions = SecurityControlDefinition[];
export const SecurityControlDefinitions = S.Array(SecurityControlDefinition);
export type TargetType =
  | "ACCOUNT"
  | "ORGANIZATIONAL_UNIT"
  | "ROOT"
  | (string & {});
export const TargetType = S.String;
export type MalwareType =
  | "ADWARE"
  | "BLENDED_THREAT"
  | "BOTNET_AGENT"
  | "COIN_MINER"
  | "EXPLOIT_KIT"
  | "KEYLOGGER"
  | "MACRO"
  | "POTENTIALLY_UNWANTED"
  | "SPYWARE"
  | "RANSOMWARE"
  | "REMOTE_ACCESS"
  | "ROOTKIT"
  | "TROJAN"
  | "VIRUS"
  | "WORM"
  | (string & {});
export const MalwareType = S.String;
export type MalwareState =
  | "OBSERVED"
  | "REMOVAL_FAILED"
  | "REMOVED"
  | (string & {});
export const MalwareState = S.String;
export type NetworkDirection = "IN" | "OUT" | (string & {});
export const NetworkDirection = S.String;
export type ThreatIntelIndicatorType =
  | "DOMAIN"
  | "EMAIL_ADDRESS"
  | "HASH_MD5"
  | "HASH_SHA1"
  | "HASH_SHA256"
  | "HASH_SHA512"
  | "IPV4_ADDRESS"
  | "IPV6_ADDRESS"
  | "MUTEX"
  | "PROCESS"
  | "URL"
  | (string & {});
export const ThreatIntelIndicatorType = S.String;
export type ThreatIntelIndicatorCategory =
  | "BACKDOOR"
  | "CARD_STEALER"
  | "COMMAND_AND_CONTROL"
  | "DROP_SITE"
  | "EXPLOIT_SITE"
  | "KEYLOGGER"
  | (string & {});
export const ThreatIntelIndicatorCategory = S.String;
export type Partition = "aws" | "aws-cn" | "aws-us-gov" | (string & {});
export const Partition = S.String;
export type ComplianceStatus =
  | "PASSED"
  | "WARNING"
  | "FAILED"
  | "NOT_AVAILABLE"
  | (string & {});
export const ComplianceStatus = S.String;
export type RelatedRequirementsList = string[];
export const RelatedRequirementsList = S.Array(S.String);
export type VulnerabilityFixAvailable =
  | "YES"
  | "NO"
  | "PARTIAL"
  | (string & {});
export const VulnerabilityFixAvailable = S.String;
export type VulnerabilityExploitAvailable = "YES" | "NO" | (string & {});
export const VulnerabilityExploitAvailable = S.String;
export interface BatchGetConfigurationPolicyAssociationsRequest {
  ConfigurationPolicyAssociationIdentifiers?: ConfigurationPolicyAssociation[];
}
export const BatchGetConfigurationPolicyAssociationsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationPolicyAssociationIdentifiers: S.optional(
      ConfigurationPolicyAssociationsList,
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/configurationPolicyAssociation/batchget",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetConfigurationPolicyAssociationsRequest",
}) as any as S.Schema<BatchGetConfigurationPolicyAssociationsRequest>;
export interface BatchGetStandardsControlAssociationsRequest {
  StandardsControlAssociationIds?: StandardsControlAssociationId[];
}
export const BatchGetStandardsControlAssociationsRequest = S.suspend(() =>
  S.Struct({
    StandardsControlAssociationIds: S.optional(StandardsControlAssociationIds),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/associations/batchGet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetStandardsControlAssociationsRequest",
}) as any as S.Schema<BatchGetStandardsControlAssociationsRequest>;
export interface BatchUpdateAutomationRulesRequest {
  UpdateAutomationRulesRequestItems?: UpdateAutomationRulesRequestItem[];
}
export const BatchUpdateAutomationRulesRequest = S.suspend(() =>
  S.Struct({
    UpdateAutomationRulesRequestItems: S.optional(
      UpdateAutomationRulesRequestItemsList,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/automationrules/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateAutomationRulesRequest",
}) as any as S.Schema<BatchUpdateAutomationRulesRequest>;
export interface BatchUpdateFindingsRequest {
  FindingIdentifiers?: AwsSecurityFindingIdentifier[];
  Note?: NoteUpdate;
  Severity?: SeverityUpdate;
  VerificationState?: VerificationState;
  Confidence?: number;
  Criticality?: number;
  Types?: string[];
  UserDefinedFields?: { [key: string]: string | undefined };
  Workflow?: WorkflowUpdate;
  RelatedFindings?: RelatedFinding[];
}
export const BatchUpdateFindingsRequest = S.suspend(() =>
  S.Struct({
    FindingIdentifiers: S.optional(AwsSecurityFindingIdentifierList),
    Note: S.optional(NoteUpdate),
    Severity: S.optional(SeverityUpdate),
    VerificationState: S.optional(VerificationState),
    Confidence: S.optional(S.Number),
    Criticality: S.optional(S.Number),
    Types: S.optional(TypeList),
    UserDefinedFields: S.optional(FieldMap),
    Workflow: S.optional(WorkflowUpdate),
    RelatedFindings: S.optional(RelatedFindingList),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/findings/batchupdate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateFindingsRequest",
}) as any as S.Schema<BatchUpdateFindingsRequest>;
export interface BatchUpdateFindingsV2Request {
  MetadataUids?: string[];
  FindingIdentifiers?: OcsfFindingIdentifier[];
  Comment?: string;
  SeverityId?: number;
  StatusId?: number;
}
export const BatchUpdateFindingsV2Request = S.suspend(() =>
  S.Struct({
    MetadataUids: S.optional(MetadataUidList),
    FindingIdentifiers: S.optional(OcsfFindingIdentifierList),
    Comment: S.optional(S.String),
    SeverityId: S.optional(S.Number),
    StatusId: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/findingsv2/batchupdatev2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateFindingsV2Request",
}) as any as S.Schema<BatchUpdateFindingsV2Request>;
export interface BatchUpdateStandardsControlAssociationsRequest {
  StandardsControlAssociationUpdates?: StandardsControlAssociationUpdate[];
}
export const BatchUpdateStandardsControlAssociationsRequest = S.suspend(() =>
  S.Struct({
    StandardsControlAssociationUpdates: S.optional(
      StandardsControlAssociationUpdates,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateStandardsControlAssociationsRequest",
}) as any as S.Schema<BatchUpdateStandardsControlAssociationsRequest>;
export interface CreateActionTargetResponse {
  ActionTargetArn: string;
}
export const CreateActionTargetResponse = S.suspend(() =>
  S.Struct({ ActionTargetArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateActionTargetResponse",
}) as any as S.Schema<CreateActionTargetResponse>;
export interface CreateAggregatorV2Request {
  RegionLinkingMode?: string;
  LinkedRegions?: string[];
  Tags?: { [key: string]: string | undefined };
  ClientToken?: string;
}
export const CreateAggregatorV2Request = S.suspend(() =>
  S.Struct({
    RegionLinkingMode: S.optional(S.String),
    LinkedRegions: S.optional(StringList),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/aggregatorv2/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAggregatorV2Request",
}) as any as S.Schema<CreateAggregatorV2Request>;
export interface CreateFindingAggregatorResponse {
  FindingAggregatorArn?: string;
  FindingAggregationRegion?: string;
  RegionLinkingMode?: string;
  Regions?: string[];
}
export const CreateFindingAggregatorResponse = S.suspend(() =>
  S.Struct({
    FindingAggregatorArn: S.optional(S.String),
    FindingAggregationRegion: S.optional(S.String),
    RegionLinkingMode: S.optional(S.String),
    Regions: S.optional(StringList),
  }),
).annotations({
  identifier: "CreateFindingAggregatorResponse",
}) as any as S.Schema<CreateFindingAggregatorResponse>;
export interface CreateMembersRequest {
  AccountDetails?: AccountDetails[];
}
export const CreateMembersRequest = S.suspend(() =>
  S.Struct({ AccountDetails: S.optional(AccountDetailsList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/members" }),
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
export interface CreateTicketV2Response {
  TicketId: string;
  TicketSrcUrl?: string;
}
export const CreateTicketV2Response = S.suspend(() =>
  S.Struct({
    TicketId: S.optional(S.String),
    TicketSrcUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateTicketV2Response",
}) as any as S.Schema<CreateTicketV2Response>;
export interface DeleteActionTargetResponse {
  ActionTargetArn: string;
}
export const DeleteActionTargetResponse = S.suspend(() =>
  S.Struct({ ActionTargetArn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteActionTargetResponse",
}) as any as S.Schema<DeleteActionTargetResponse>;
export interface DeleteInsightResponse {
  InsightArn: string;
}
export const DeleteInsightResponse = S.suspend(() =>
  S.Struct({ InsightArn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteInsightResponse",
}) as any as S.Schema<DeleteInsightResponse>;
export interface Result {
  AccountId?: string;
  ProcessingResult?: string;
}
export const Result = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ProcessingResult: S.optional(S.String),
  }),
).annotations({ identifier: "Result" }) as any as S.Schema<Result>;
export type ResultList = Result[];
export const ResultList = S.Array(Result);
export interface DeleteInvitationsResponse {
  UnprocessedAccounts?: Result[];
}
export const DeleteInvitationsResponse = S.suspend(() =>
  S.Struct({ UnprocessedAccounts: S.optional(ResultList) }),
).annotations({
  identifier: "DeleteInvitationsResponse",
}) as any as S.Schema<DeleteInvitationsResponse>;
export interface DeleteMembersResponse {
  UnprocessedAccounts?: Result[];
}
export const DeleteMembersResponse = S.suspend(() =>
  S.Struct({ UnprocessedAccounts: S.optional(ResultList) }),
).annotations({
  identifier: "DeleteMembersResponse",
}) as any as S.Schema<DeleteMembersResponse>;
export interface DescribeHubResponse {
  HubArn?: string;
  SubscribedAt?: string;
  AutoEnableControls?: boolean;
  ControlFindingGenerator?: ControlFindingGenerator;
}
export const DescribeHubResponse = S.suspend(() =>
  S.Struct({
    HubArn: S.optional(S.String),
    SubscribedAt: S.optional(S.String),
    AutoEnableControls: S.optional(S.Boolean),
    ControlFindingGenerator: S.optional(ControlFindingGenerator),
  }),
).annotations({
  identifier: "DescribeHubResponse",
}) as any as S.Schema<DescribeHubResponse>;
export interface DescribeOrganizationConfigurationResponse {
  AutoEnable?: boolean;
  MemberAccountLimitReached?: boolean;
  AutoEnableStandards?: AutoEnableStandards;
  OrganizationConfiguration?: OrganizationConfiguration;
}
export const DescribeOrganizationConfigurationResponse = S.suspend(() =>
  S.Struct({
    AutoEnable: S.optional(S.Boolean),
    MemberAccountLimitReached: S.optional(S.Boolean),
    AutoEnableStandards: S.optional(AutoEnableStandards),
    OrganizationConfiguration: S.optional(OrganizationConfiguration),
  }),
).annotations({
  identifier: "DescribeOrganizationConfigurationResponse",
}) as any as S.Schema<DescribeOrganizationConfigurationResponse>;
export interface EnableImportFindingsForProductResponse {
  ProductSubscriptionArn?: string;
}
export const EnableImportFindingsForProductResponse = S.suspend(() =>
  S.Struct({ ProductSubscriptionArn: S.optional(S.String) }),
).annotations({
  identifier: "EnableImportFindingsForProductResponse",
}) as any as S.Schema<EnableImportFindingsForProductResponse>;
export interface EnableOrganizationAdminAccountResponse {
  AdminAccountId?: string;
  Feature?: SecurityHubFeature;
}
export const EnableOrganizationAdminAccountResponse = S.suspend(() =>
  S.Struct({
    AdminAccountId: S.optional(S.String),
    Feature: S.optional(SecurityHubFeature),
  }),
).annotations({
  identifier: "EnableOrganizationAdminAccountResponse",
}) as any as S.Schema<EnableOrganizationAdminAccountResponse>;
export interface EnableSecurityHubV2Response {
  HubV2Arn?: string;
}
export const EnableSecurityHubV2Response = S.suspend(() =>
  S.Struct({ HubV2Arn: S.optional(S.String) }),
).annotations({
  identifier: "EnableSecurityHubV2Response",
}) as any as S.Schema<EnableSecurityHubV2Response>;
export interface GetAdministratorAccountResponse {
  Administrator?: Invitation;
}
export const GetAdministratorAccountResponse = S.suspend(() =>
  S.Struct({ Administrator: S.optional(Invitation) }),
).annotations({
  identifier: "GetAdministratorAccountResponse",
}) as any as S.Schema<GetAdministratorAccountResponse>;
export interface GetAggregatorV2Response {
  AggregatorV2Arn?: string;
  AggregationRegion?: string;
  RegionLinkingMode?: string;
  LinkedRegions?: string[];
}
export const GetAggregatorV2Response = S.suspend(() =>
  S.Struct({
    AggregatorV2Arn: S.optional(S.String),
    AggregationRegion: S.optional(S.String),
    RegionLinkingMode: S.optional(S.String),
    LinkedRegions: S.optional(StringList),
  }),
).annotations({
  identifier: "GetAggregatorV2Response",
}) as any as S.Schema<GetAggregatorV2Response>;
export interface GetAutomationRuleV2Response {
  RuleArn?: string;
  RuleId?: string;
  RuleOrder?: number;
  RuleName?: string;
  RuleStatus?: RuleStatusV2;
  Description?: string;
  Criteria?: Criteria;
  Actions?: (AutomationRulesActionV2 & { Type: AutomationRulesActionTypeV2 })[];
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const GetAutomationRuleV2Response = S.suspend(() =>
  S.Struct({
    RuleArn: S.optional(S.String),
    RuleId: S.optional(S.String),
    RuleOrder: S.optional(S.Number),
    RuleName: S.optional(S.String),
    RuleStatus: S.optional(RuleStatusV2),
    Description: S.optional(S.String),
    Criteria: S.optional(Criteria),
    Actions: S.optional(AutomationRulesActionListV2),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetAutomationRuleV2Response",
}) as any as S.Schema<GetAutomationRuleV2Response>;
export interface GetConfigurationPolicyResponse {
  Arn?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  UpdatedAt?: Date;
  CreatedAt?: Date;
  ConfigurationPolicy?: Policy;
}
export const GetConfigurationPolicyResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ConfigurationPolicy: S.optional(Policy),
  }),
).annotations({
  identifier: "GetConfigurationPolicyResponse",
}) as any as S.Schema<GetConfigurationPolicyResponse>;
export interface GetConfigurationPolicyAssociationRequest {
  Target?: Target;
}
export const GetConfigurationPolicyAssociationRequest = S.suspend(() =>
  S.Struct({ Target: S.optional(Target) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configurationPolicyAssociation/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfigurationPolicyAssociationRequest",
}) as any as S.Schema<GetConfigurationPolicyAssociationRequest>;
export type StandardsInputParameterMap = { [key: string]: string | undefined };
export const StandardsInputParameterMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type StandardsStatus =
  | "PENDING"
  | "READY"
  | "FAILED"
  | "DELETING"
  | "INCOMPLETE"
  | (string & {});
export const StandardsStatus = S.String;
export type StandardsControlsUpdatable =
  | "READY_FOR_UPDATES"
  | "NOT_READY_FOR_UPDATES"
  | (string & {});
export const StandardsControlsUpdatable = S.String;
export type StatusReasonCode =
  | "NO_AVAILABLE_CONFIGURATION_RECORDER"
  | "MAXIMUM_NUMBER_OF_CONFIG_RULES_EXCEEDED"
  | "INTERNAL_ERROR"
  | (string & {});
export const StatusReasonCode = S.String;
export interface StandardsStatusReason {
  StatusReasonCode?: StatusReasonCode;
}
export const StandardsStatusReason = S.suspend(() =>
  S.Struct({ StatusReasonCode: S.optional(StatusReasonCode) }),
).annotations({
  identifier: "StandardsStatusReason",
}) as any as S.Schema<StandardsStatusReason>;
export interface StandardsSubscription {
  StandardsSubscriptionArn?: string;
  StandardsArn?: string;
  StandardsInput?: { [key: string]: string | undefined };
  StandardsStatus?: StandardsStatus;
  StandardsControlsUpdatable?: StandardsControlsUpdatable;
  StandardsStatusReason?: StandardsStatusReason;
}
export const StandardsSubscription = S.suspend(() =>
  S.Struct({
    StandardsSubscriptionArn: S.optional(S.String),
    StandardsArn: S.optional(S.String),
    StandardsInput: S.optional(StandardsInputParameterMap),
    StandardsStatus: S.optional(StandardsStatus),
    StandardsControlsUpdatable: S.optional(StandardsControlsUpdatable),
    StandardsStatusReason: S.optional(StandardsStatusReason),
  }),
).annotations({
  identifier: "StandardsSubscription",
}) as any as S.Schema<StandardsSubscription>;
export type StandardsSubscriptions = StandardsSubscription[];
export const StandardsSubscriptions = S.Array(StandardsSubscription);
export interface GetEnabledStandardsResponse {
  StandardsSubscriptions?: (StandardsSubscription & {
    StandardsSubscriptionArn: NonEmptyString;
    StandardsArn: NonEmptyString;
    StandardsInput: StandardsInputParameterMap;
    StandardsStatus: StandardsStatus;
    StandardsStatusReason: StandardsStatusReason & {
      StatusReasonCode: StatusReasonCode;
    };
  })[];
  NextToken?: string;
}
export const GetEnabledStandardsResponse = S.suspend(() =>
  S.Struct({
    StandardsSubscriptions: S.optional(StandardsSubscriptions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEnabledStandardsResponse",
}) as any as S.Schema<GetEnabledStandardsResponse>;
export interface GetFindingAggregatorResponse {
  FindingAggregatorArn?: string;
  FindingAggregationRegion?: string;
  RegionLinkingMode?: string;
  Regions?: string[];
}
export const GetFindingAggregatorResponse = S.suspend(() =>
  S.Struct({
    FindingAggregatorArn: S.optional(S.String),
    FindingAggregationRegion: S.optional(S.String),
    RegionLinkingMode: S.optional(S.String),
    Regions: S.optional(StringList),
  }),
).annotations({
  identifier: "GetFindingAggregatorResponse",
}) as any as S.Schema<GetFindingAggregatorResponse>;
export interface GetFindingsRequest {
  Filters?: AwsSecurityFindingFilters;
  SortCriteria?: SortCriterion[];
  NextToken?: string;
  MaxResults?: number;
}
export const GetFindingsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(AwsSecurityFindingFilters),
    SortCriteria: S.optional(SortCriteria),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findings" }),
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
export interface GetFindingStatisticsV2Request {
  GroupByRules?: GroupByRule[];
  SortOrder?: SortOrder;
  MaxStatisticResults?: number;
}
export const GetFindingStatisticsV2Request = S.suspend(() =>
  S.Struct({
    GroupByRules: S.optional(GroupByRules),
    SortOrder: S.optional(SortOrder),
    MaxStatisticResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findingsv2/statistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingStatisticsV2Request",
}) as any as S.Schema<GetFindingStatisticsV2Request>;
export interface GetResourcesStatisticsV2Request {
  GroupByRules?: ResourceGroupByRule[];
  SortOrder?: SortOrder;
  MaxStatisticResults?: number;
}
export const GetResourcesStatisticsV2Request = S.suspend(() =>
  S.Struct({
    GroupByRules: S.optional(ResourceGroupByRules),
    SortOrder: S.optional(SortOrder),
    MaxStatisticResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resourcesv2/statistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcesStatisticsV2Request",
}) as any as S.Schema<GetResourcesStatisticsV2Request>;
export interface InviteMembersResponse {
  UnprocessedAccounts?: Result[];
}
export const InviteMembersResponse = S.suspend(() =>
  S.Struct({ UnprocessedAccounts: S.optional(ResultList) }),
).annotations({
  identifier: "InviteMembersResponse",
}) as any as S.Schema<InviteMembersResponse>;
export interface ListConfigurationPolicyAssociationsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: AssociationFilters;
}
export const ListConfigurationPolicyAssociationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(AssociationFilters),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configurationPolicyAssociation/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationPolicyAssociationsRequest",
}) as any as S.Schema<ListConfigurationPolicyAssociationsRequest>;
export interface ListEnabledProductsForImportResponse {
  ProductSubscriptions?: string[];
  NextToken?: string;
}
export const ListEnabledProductsForImportResponse = S.suspend(() =>
  S.Struct({
    ProductSubscriptions: S.optional(ProductSubscriptionArnList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnabledProductsForImportResponse",
}) as any as S.Schema<ListEnabledProductsForImportResponse>;
export interface ListInvitationsResponse {
  Invitations?: Invitation[];
  NextToken?: string;
}
export const ListInvitationsResponse = S.suspend(() =>
  S.Struct({
    Invitations: S.optional(InvitationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInvitationsResponse",
}) as any as S.Schema<ListInvitationsResponse>;
export interface Member {
  AccountId?: string;
  Email?: string;
  MasterId?: string;
  AdministratorId?: string;
  MemberStatus?: string;
  InvitedAt?: Date;
  UpdatedAt?: Date;
}
export const Member = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    Email: S.optional(S.String),
    MasterId: S.optional(S.String),
    AdministratorId: S.optional(S.String),
    MemberStatus: S.optional(S.String),
    InvitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "Member" }) as any as S.Schema<Member>;
export type MemberList = Member[];
export const MemberList = S.Array(Member);
export interface ListMembersResponse {
  Members?: Member[];
  NextToken?: string;
}
export const ListMembersResponse = S.suspend(() =>
  S.Struct({
    Members: S.optional(MemberList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMembersResponse",
}) as any as S.Schema<ListMembersResponse>;
export interface ListSecurityControlDefinitionsResponse {
  SecurityControlDefinitions: (SecurityControlDefinition & {
    SecurityControlId: NonEmptyString;
    Title: NonEmptyString;
    Description: NonEmptyString;
    RemediationUrl: NonEmptyString;
    SeverityRating: SeverityRating;
    CurrentRegionAvailability: RegionAvailabilityStatus;
    ParameterDefinitions: {
      [key: string]:
        | (ParameterDefinition & {
            Description: NonEmptyString;
            ConfigurationOptions: ConfigurationOptions;
          })
        | undefined;
    };
  })[];
  NextToken?: string;
}
export const ListSecurityControlDefinitionsResponse = S.suspend(() =>
  S.Struct({
    SecurityControlDefinitions: S.optional(SecurityControlDefinitions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSecurityControlDefinitionsResponse",
}) as any as S.Schema<ListSecurityControlDefinitionsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RegisterConnectorV2Response {
  ConnectorArn?: string;
  ConnectorId: string;
}
export const RegisterConnectorV2Response = S.suspend(() =>
  S.Struct({
    ConnectorArn: S.optional(S.String),
    ConnectorId: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterConnectorV2Response",
}) as any as S.Schema<RegisterConnectorV2Response>;
export interface StartConfigurationPolicyAssociationResponse {
  ConfigurationPolicyId?: string;
  TargetId?: string;
  TargetType?: TargetType;
  AssociationType?: AssociationType;
  UpdatedAt?: Date;
  AssociationStatus?: ConfigurationPolicyAssociationStatus;
  AssociationStatusMessage?: string;
}
export const StartConfigurationPolicyAssociationResponse = S.suspend(() =>
  S.Struct({
    ConfigurationPolicyId: S.optional(S.String),
    TargetId: S.optional(S.String),
    TargetType: S.optional(TargetType),
    AssociationType: S.optional(AssociationType),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    AssociationStatus: S.optional(ConfigurationPolicyAssociationStatus),
    AssociationStatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "StartConfigurationPolicyAssociationResponse",
}) as any as S.Schema<StartConfigurationPolicyAssociationResponse>;
export interface UpdateAggregatorV2Response {
  AggregatorV2Arn?: string;
  AggregationRegion?: string;
  RegionLinkingMode?: string;
  LinkedRegions?: string[];
}
export const UpdateAggregatorV2Response = S.suspend(() =>
  S.Struct({
    AggregatorV2Arn: S.optional(S.String),
    AggregationRegion: S.optional(S.String),
    RegionLinkingMode: S.optional(S.String),
    LinkedRegions: S.optional(StringList),
  }),
).annotations({
  identifier: "UpdateAggregatorV2Response",
}) as any as S.Schema<UpdateAggregatorV2Response>;
export interface UpdateConfigurationPolicyResponse {
  Arn?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  UpdatedAt?: Date;
  CreatedAt?: Date;
  ConfigurationPolicy?: Policy;
}
export const UpdateConfigurationPolicyResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ConfigurationPolicy: S.optional(Policy),
  }),
).annotations({
  identifier: "UpdateConfigurationPolicyResponse",
}) as any as S.Schema<UpdateConfigurationPolicyResponse>;
export interface UpdateFindingAggregatorResponse {
  FindingAggregatorArn?: string;
  FindingAggregationRegion?: string;
  RegionLinkingMode?: string;
  Regions?: string[];
}
export const UpdateFindingAggregatorResponse = S.suspend(() =>
  S.Struct({
    FindingAggregatorArn: S.optional(S.String),
    FindingAggregationRegion: S.optional(S.String),
    RegionLinkingMode: S.optional(S.String),
    Regions: S.optional(StringList),
  }),
).annotations({
  identifier: "UpdateFindingAggregatorResponse",
}) as any as S.Schema<UpdateFindingAggregatorResponse>;
export type UpdateStatus = "READY" | "UPDATING" | (string & {});
export const UpdateStatus = S.String;
export type UnprocessedErrorCode =
  | "INVALID_INPUT"
  | "ACCESS_DENIED"
  | "NOT_FOUND"
  | "RESOURCE_NOT_FOUND"
  | "LIMIT_EXCEEDED"
  | (string & {});
export const UnprocessedErrorCode = S.String;
export interface Severity {
  Product?: number;
  Label?: SeverityLabel;
  Normalized?: number;
  Original?: string;
}
export const Severity = S.suspend(() =>
  S.Struct({
    Product: S.optional(S.Number),
    Label: S.optional(SeverityLabel),
    Normalized: S.optional(S.Number),
    Original: S.optional(S.String),
  }),
).annotations({ identifier: "Severity" }) as any as S.Schema<Severity>;
export interface Malware {
  Name?: string;
  Type?: MalwareType;
  Path?: string;
  State?: MalwareState;
}
export const Malware = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(MalwareType),
    Path: S.optional(S.String),
    State: S.optional(MalwareState),
  }),
).annotations({ identifier: "Malware" }) as any as S.Schema<Malware>;
export type MalwareList = Malware[];
export const MalwareList = S.Array(Malware);
export interface ProcessDetails {
  Name?: string;
  Path?: string;
  Pid?: number;
  ParentPid?: number;
  LaunchedAt?: string;
  TerminatedAt?: string;
}
export const ProcessDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Path: S.optional(S.String),
    Pid: S.optional(S.Number),
    ParentPid: S.optional(S.Number),
    LaunchedAt: S.optional(S.String),
    TerminatedAt: S.optional(S.String),
  }),
).annotations({
  identifier: "ProcessDetails",
}) as any as S.Schema<ProcessDetails>;
export interface ThreatIntelIndicator {
  Type?: ThreatIntelIndicatorType;
  Value?: string;
  Category?: ThreatIntelIndicatorCategory;
  LastObservedAt?: string;
  Source?: string;
  SourceUrl?: string;
}
export const ThreatIntelIndicator = S.suspend(() =>
  S.Struct({
    Type: S.optional(ThreatIntelIndicatorType),
    Value: S.optional(S.String),
    Category: S.optional(ThreatIntelIndicatorCategory),
    LastObservedAt: S.optional(S.String),
    Source: S.optional(S.String),
    SourceUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "ThreatIntelIndicator",
}) as any as S.Schema<ThreatIntelIndicator>;
export type ThreatIntelIndicatorList = ThreatIntelIndicator[];
export const ThreatIntelIndicatorList = S.Array(ThreatIntelIndicator);
export interface Workflow {
  Status?: WorkflowStatus;
}
export const Workflow = S.suspend(() =>
  S.Struct({ Status: S.optional(WorkflowStatus) }),
).annotations({ identifier: "Workflow" }) as any as S.Schema<Workflow>;
export interface Note {
  Text?: string;
  UpdatedBy?: string;
  UpdatedAt?: string;
}
export const Note = S.suspend(() =>
  S.Struct({
    Text: S.optional(S.String),
    UpdatedBy: S.optional(S.String),
    UpdatedAt: S.optional(S.String),
  }),
).annotations({ identifier: "Note" }) as any as S.Schema<Note>;
export interface PatchSummary {
  Id?: string;
  InstalledCount?: number;
  MissingCount?: number;
  FailedCount?: number;
  InstalledOtherCount?: number;
  InstalledRejectedCount?: number;
  InstalledPendingReboot?: number;
  OperationStartTime?: string;
  OperationEndTime?: string;
  RebootOption?: string;
  Operation?: string;
}
export const PatchSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    InstalledCount: S.optional(S.Number),
    MissingCount: S.optional(S.Number),
    FailedCount: S.optional(S.Number),
    InstalledOtherCount: S.optional(S.Number),
    InstalledRejectedCount: S.optional(S.Number),
    InstalledPendingReboot: S.optional(S.Number),
    OperationStartTime: S.optional(S.String),
    OperationEndTime: S.optional(S.String),
    RebootOption: S.optional(S.String),
    Operation: S.optional(S.String),
  }),
).annotations({ identifier: "PatchSummary" }) as any as S.Schema<PatchSummary>;
export interface GeneratorDetails {
  Name?: string;
  Description?: string;
  Labels?: string[];
}
export const GeneratorDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Labels: S.optional(TypeList),
  }),
).annotations({
  identifier: "GeneratorDetails",
}) as any as S.Schema<GeneratorDetails>;
export interface JiraCloudProviderConfiguration {
  ProjectKey?: string;
}
export const JiraCloudProviderConfiguration = S.suspend(() =>
  S.Struct({ ProjectKey: S.optional(S.String) }),
).annotations({
  identifier: "JiraCloudProviderConfiguration",
}) as any as S.Schema<JiraCloudProviderConfiguration>;
export interface ServiceNowProviderConfiguration {
  InstanceName?: string;
  SecretArn?: string;
}
export const ServiceNowProviderConfiguration = S.suspend(() =>
  S.Struct({
    InstanceName: S.optional(S.String),
    SecretArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceNowProviderConfiguration",
}) as any as S.Schema<ServiceNowProviderConfiguration>;
export type CategoryList = string[];
export const CategoryList = S.Array(S.String);
export type IntegrationType =
  | "SEND_FINDINGS_TO_SECURITY_HUB"
  | "RECEIVE_FINDINGS_FROM_SECURITY_HUB"
  | "UPDATE_FINDINGS_IN_SECURITY_HUB"
  | (string & {});
export const IntegrationType = S.String;
export type IntegrationTypeList = IntegrationType[];
export const IntegrationTypeList = S.Array(IntegrationType);
export type IntegrationV2Type =
  | "SEND_FINDINGS_TO_SECURITY_HUB"
  | "RECEIVE_FINDINGS_FROM_SECURITY_HUB"
  | "UPDATE_FINDINGS_IN_SECURITY_HUB"
  | (string & {});
export const IntegrationV2Type = S.String;
export type IntegrationV2TypeList = IntegrationV2Type[];
export const IntegrationV2TypeList = S.Array(IntegrationV2Type);
export type AdminStatus = "ENABLED" | "DISABLE_IN_PROGRESS" | (string & {});
export const AdminStatus = S.String;
export interface JiraCloudUpdateConfiguration {
  ProjectKey?: string;
}
export const JiraCloudUpdateConfiguration = S.suspend(() =>
  S.Struct({ ProjectKey: S.optional(S.String) }),
).annotations({
  identifier: "JiraCloudUpdateConfiguration",
}) as any as S.Schema<JiraCloudUpdateConfiguration>;
export interface ServiceNowUpdateConfiguration {
  SecretArn?: string;
}
export const ServiceNowUpdateConfiguration = S.suspend(() =>
  S.Struct({ SecretArn: S.optional(S.String) }),
).annotations({
  identifier: "ServiceNowUpdateConfiguration",
}) as any as S.Schema<ServiceNowUpdateConfiguration>;
export type FindingsTrendsStringField =
  | "account_id"
  | "region"
  | "finding_types"
  | "finding_status"
  | "finding_cve_ids"
  | "finding_compliance_status"
  | "finding_control_id"
  | "finding_class_name"
  | "finding_provider"
  | "finding_activity_name"
  | (string & {});
export const FindingsTrendsStringField = S.String;
export type OcsfStringField =
  | "metadata.uid"
  | "activity_name"
  | "cloud.account.uid"
  | "cloud.provider"
  | "cloud.region"
  | "compliance.assessments.category"
  | "compliance.assessments.name"
  | "compliance.control"
  | "compliance.status"
  | "compliance.standards"
  | "finding_info.desc"
  | "finding_info.src_url"
  | "finding_info.title"
  | "finding_info.types"
  | "finding_info.uid"
  | "finding_info.related_events.traits.category"
  | "finding_info.related_events.uid"
  | "finding_info.related_events.product.uid"
  | "finding_info.related_events.title"
  | "metadata.product.name"
  | "metadata.product.uid"
  | "metadata.product.vendor_name"
  | "remediation.desc"
  | "remediation.references"
  | "resources.cloud_partition"
  | "resources.region"
  | "resources.type"
  | "resources.uid"
  | "severity"
  | "status"
  | "comment"
  | "vulnerabilities.fix_coverage"
  | "class_name"
  | "databucket.encryption_details.algorithm"
  | "databucket.encryption_details.key_uid"
  | "databucket.file.data_classifications.classifier_details.type"
  | "evidences.actor.user.account.uid"
  | "evidences.api.operation"
  | "evidences.api.response.error_message"
  | "evidences.api.service.name"
  | "evidences.connection_info.direction"
  | "evidences.connection_info.protocol_name"
  | "evidences.dst_endpoint.autonomous_system.name"
  | "evidences.dst_endpoint.location.city"
  | "evidences.dst_endpoint.location.country"
  | "evidences.src_endpoint.autonomous_system.name"
  | "evidences.src_endpoint.hostname"
  | "evidences.src_endpoint.location.city"
  | "evidences.src_endpoint.location.country"
  | "finding_info.analytic.name"
  | "malware.name"
  | "malware_scan_info.uid"
  | "malware.severity"
  | "resources.cloud_function.layers.uid_alt"
  | "resources.cloud_function.runtime"
  | "resources.cloud_function.user.uid"
  | "resources.device.encryption_details.key_uid"
  | "resources.device.image.uid"
  | "resources.image.architecture"
  | "resources.image.registry_uid"
  | "resources.image.repository_name"
  | "resources.image.uid"
  | "resources.subnet_info.uid"
  | "resources.vpc_uid"
  | "vulnerabilities.affected_code.file.path"
  | "vulnerabilities.affected_packages.name"
  | "vulnerabilities.cve.epss.score"
  | "vulnerabilities.cve.uid"
  | "vulnerabilities.related_vulnerabilities"
  | "cloud.account.name"
  | "vendor_attributes.severity"
  | (string & {});
export const OcsfStringField = S.String;
export type OcsfDateField =
  | "finding_info.created_time_dt"
  | "finding_info.first_seen_time_dt"
  | "finding_info.last_seen_time_dt"
  | "finding_info.modified_time_dt"
  | "resources.image.created_time_dt"
  | "resources.image.last_used_time_dt"
  | "resources.modified_time_dt"
  | (string & {});
export const OcsfDateField = S.String;
export type OcsfBooleanField =
  | "compliance.assessments.meets_criteria"
  | "vulnerabilities.is_exploit_available"
  | "vulnerabilities.is_fix_available"
  | (string & {});
export const OcsfBooleanField = S.String;
export type OcsfNumberField =
  | "activity_id"
  | "compliance.status_id"
  | "confidence_score"
  | "severity_id"
  | "status_id"
  | "finding_info.related_events_count"
  | "evidences.api.response.code"
  | "evidences.dst_endpoint.autonomous_system.number"
  | "evidences.dst_endpoint.port"
  | "evidences.src_endpoint.autonomous_system.number"
  | "evidences.src_endpoint.port"
  | "resources.image.in_use_count"
  | "vulnerabilities.cve.cvss.base_score"
  | "vendor_attributes.severity_id"
  | (string & {});
export const OcsfNumberField = S.String;
export type OcsfMapField =
  | "resources.tags"
  | "compliance.control_parameters"
  | "databucket.tags"
  | "finding_info.tags"
  | (string & {});
export const OcsfMapField = S.String;
export type OcsfIpField =
  | "evidences.dst_endpoint.ip"
  | "evidences.src_endpoint.ip"
  | (string & {});
export const OcsfIpField = S.String;
export type ResourcesTrendsStringField =
  | "account_id"
  | "region"
  | "resource_type"
  | "resource_category"
  | (string & {});
export const ResourcesTrendsStringField = S.String;
export type ResourcesStringField =
  | "ResourceGuid"
  | "ResourceId"
  | "AccountId"
  | "Region"
  | "ResourceCategory"
  | "ResourceType"
  | "ResourceName"
  | "FindingsSummary.FindingType"
  | "FindingsSummary.ProductName"
  | (string & {});
export const ResourcesStringField = S.String;
export type ResourcesDateField =
  | "ResourceDetailCaptureTime"
  | "ResourceCreationTime"
  | (string & {});
export const ResourcesDateField = S.String;
export type ResourcesNumberField =
  | "FindingsSummary.TotalFindings"
  | "FindingsSummary.Severities.Other"
  | "FindingsSummary.Severities.Fatal"
  | "FindingsSummary.Severities.Critical"
  | "FindingsSummary.Severities.High"
  | "FindingsSummary.Severities.Medium"
  | "FindingsSummary.Severities.Low"
  | "FindingsSummary.Severities.Informational"
  | "FindingsSummary.Severities.Unknown"
  | (string & {});
export const ResourcesNumberField = S.String;
export type ResourcesMapField = "ResourceTags" | (string & {});
export const ResourcesMapField = S.String;
export interface UnprocessedAutomationRule {
  RuleArn?: string;
  ErrorCode?: number;
  ErrorMessage?: string;
}
export const UnprocessedAutomationRule = S.suspend(() =>
  S.Struct({
    RuleArn: S.optional(S.String),
    ErrorCode: S.optional(S.Number),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedAutomationRule",
}) as any as S.Schema<UnprocessedAutomationRule>;
export type UnprocessedAutomationRulesList = UnprocessedAutomationRule[];
export const UnprocessedAutomationRulesList = S.Array(
  UnprocessedAutomationRule,
);
export interface StandardsSubscriptionRequest {
  StandardsArn?: string;
  StandardsInput?: { [key: string]: string | undefined };
}
export const StandardsSubscriptionRequest = S.suspend(() =>
  S.Struct({
    StandardsArn: S.optional(S.String),
    StandardsInput: S.optional(StandardsInputParameterMap),
  }),
).annotations({
  identifier: "StandardsSubscriptionRequest",
}) as any as S.Schema<StandardsSubscriptionRequest>;
export type StandardsSubscriptionRequests = StandardsSubscriptionRequest[];
export const StandardsSubscriptionRequests = S.Array(
  StandardsSubscriptionRequest,
);
export interface AutomationRulesConfig {
  RuleArn?: string;
  RuleStatus?: RuleStatus;
  RuleOrder?: number;
  RuleName?: string;
  Description?: string;
  IsTerminal?: boolean;
  Criteria?: AutomationRulesFindingFilters;
  Actions?: AutomationRulesAction[];
  CreatedAt?: Date;
  UpdatedAt?: Date;
  CreatedBy?: string;
}
export const AutomationRulesConfig = S.suspend(() =>
  S.Struct({
    RuleArn: S.optional(S.String),
    RuleStatus: S.optional(RuleStatus),
    RuleOrder: S.optional(S.Number),
    RuleName: S.optional(S.String),
    Description: S.optional(S.String),
    IsTerminal: S.optional(S.Boolean),
    Criteria: S.optional(AutomationRulesFindingFilters),
    Actions: S.optional(ActionList),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "AutomationRulesConfig",
}) as any as S.Schema<AutomationRulesConfig>;
export type AutomationRulesConfigList = AutomationRulesConfig[];
export const AutomationRulesConfigList = S.Array(AutomationRulesConfig);
export interface SecurityControl {
  SecurityControlId?: string;
  SecurityControlArn?: string;
  Title?: string;
  Description?: string;
  RemediationUrl?: string;
  SeverityRating?: SeverityRating;
  SecurityControlStatus?: ControlStatus;
  UpdateStatus?: UpdateStatus;
  Parameters?: { [key: string]: ParameterConfiguration | undefined };
  LastUpdateReason?: string;
}
export const SecurityControl = S.suspend(() =>
  S.Struct({
    SecurityControlId: S.optional(S.String),
    SecurityControlArn: S.optional(S.String),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    RemediationUrl: S.optional(S.String),
    SeverityRating: S.optional(SeverityRating),
    SecurityControlStatus: S.optional(ControlStatus),
    UpdateStatus: S.optional(UpdateStatus),
    Parameters: S.optional(Parameters),
    LastUpdateReason: S.optional(S.String),
  }),
).annotations({
  identifier: "SecurityControl",
}) as any as S.Schema<SecurityControl>;
export type SecurityControls = SecurityControl[];
export const SecurityControls = S.Array(SecurityControl);
export interface UnprocessedSecurityControl {
  SecurityControlId?: string;
  ErrorCode?: UnprocessedErrorCode;
  ErrorReason?: string;
}
export const UnprocessedSecurityControl = S.suspend(() =>
  S.Struct({
    SecurityControlId: S.optional(S.String),
    ErrorCode: S.optional(UnprocessedErrorCode),
    ErrorReason: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedSecurityControl",
}) as any as S.Schema<UnprocessedSecurityControl>;
export type UnprocessedSecurityControls = UnprocessedSecurityControl[];
export const UnprocessedSecurityControls = S.Array(UnprocessedSecurityControl);
export type ProviderConfiguration =
  | { JiraCloud: JiraCloudProviderConfiguration; ServiceNow?: never }
  | { JiraCloud?: never; ServiceNow: ServiceNowProviderConfiguration };
export const ProviderConfiguration = S.Union(
  S.Struct({ JiraCloud: JiraCloudProviderConfiguration }),
  S.Struct({ ServiceNow: ServiceNowProviderConfiguration }),
);
export interface ActionTarget {
  ActionTargetArn?: string;
  Name?: string;
  Description?: string;
}
export const ActionTarget = S.suspend(() =>
  S.Struct({
    ActionTargetArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "ActionTarget" }) as any as S.Schema<ActionTarget>;
export type ActionTargetList = ActionTarget[];
export const ActionTargetList = S.Array(ActionTarget);
export interface Product {
  ProductArn?: string;
  ProductName?: string;
  CompanyName?: string;
  Description?: string;
  Categories?: string[];
  IntegrationTypes?: IntegrationType[];
  MarketplaceUrl?: string;
  ActivationUrl?: string;
  ProductSubscriptionResourcePolicy?: string;
}
export const Product = S.suspend(() =>
  S.Struct({
    ProductArn: S.optional(S.String),
    ProductName: S.optional(S.String),
    CompanyName: S.optional(S.String),
    Description: S.optional(S.String),
    Categories: S.optional(CategoryList),
    IntegrationTypes: S.optional(IntegrationTypeList),
    MarketplaceUrl: S.optional(S.String),
    ActivationUrl: S.optional(S.String),
    ProductSubscriptionResourcePolicy: S.optional(S.String),
  }),
).annotations({ identifier: "Product" }) as any as S.Schema<Product>;
export type ProductsList = Product[];
export const ProductsList = S.Array(Product);
export interface ProductV2 {
  ProductV2Name?: string;
  CompanyName?: string;
  Description?: string;
  Categories?: string[];
  IntegrationV2Types?: IntegrationV2Type[];
  MarketplaceUrl?: string;
  ActivationUrl?: string;
}
export const ProductV2 = S.suspend(() =>
  S.Struct({
    ProductV2Name: S.optional(S.String),
    CompanyName: S.optional(S.String),
    Description: S.optional(S.String),
    Categories: S.optional(CategoryList),
    IntegrationV2Types: S.optional(IntegrationV2TypeList),
    MarketplaceUrl: S.optional(S.String),
    ActivationUrl: S.optional(S.String),
  }),
).annotations({ identifier: "ProductV2" }) as any as S.Schema<ProductV2>;
export type ProductsV2List = ProductV2[];
export const ProductsV2List = S.Array(ProductV2);
export interface StandardsControl {
  StandardsControlArn?: string;
  ControlStatus?: ControlStatus;
  DisabledReason?: string;
  ControlStatusUpdatedAt?: Date;
  ControlId?: string;
  Title?: string;
  Description?: string;
  RemediationUrl?: string;
  SeverityRating?: SeverityRating;
  RelatedRequirements?: string[];
}
export const StandardsControl = S.suspend(() =>
  S.Struct({
    StandardsControlArn: S.optional(S.String),
    ControlStatus: S.optional(ControlStatus),
    DisabledReason: S.optional(S.String),
    ControlStatusUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ControlId: S.optional(S.String),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    RemediationUrl: S.optional(S.String),
    SeverityRating: S.optional(SeverityRating),
    RelatedRequirements: S.optional(RelatedRequirementsList),
  }),
).annotations({
  identifier: "StandardsControl",
}) as any as S.Schema<StandardsControl>;
export type StandardsControls = StandardsControl[];
export const StandardsControls = S.Array(StandardsControl);
export interface HealthCheck {
  ConnectorStatus?: ConnectorStatus;
  Message?: string;
  LastCheckedAt?: Date;
}
export const HealthCheck = S.suspend(() =>
  S.Struct({
    ConnectorStatus: S.optional(ConnectorStatus),
    Message: S.optional(S.String),
    LastCheckedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "HealthCheck" }) as any as S.Schema<HealthCheck>;
export interface Recommendation {
  Text?: string;
  Url?: string;
}
export const Recommendation = S.suspend(() =>
  S.Struct({ Text: S.optional(S.String), Url: S.optional(S.String) }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export interface Remediation {
  Recommendation?: Recommendation;
}
export const Remediation = S.suspend(() =>
  S.Struct({ Recommendation: S.optional(Recommendation) }),
).annotations({ identifier: "Remediation" }) as any as S.Schema<Remediation>;
export interface PortRange {
  Begin?: number;
  End?: number;
}
export const PortRange = S.suspend(() =>
  S.Struct({ Begin: S.optional(S.Number), End: S.optional(S.Number) }),
).annotations({ identifier: "PortRange" }) as any as S.Schema<PortRange>;
export interface Network {
  Direction?: NetworkDirection;
  Protocol?: string;
  OpenPortRange?: PortRange;
  SourceIpV4?: string;
  SourceIpV6?: string;
  SourcePort?: number;
  SourceDomain?: string;
  SourceMac?: string;
  DestinationIpV4?: string;
  DestinationIpV6?: string;
  DestinationPort?: number;
  DestinationDomain?: string;
}
export const Network = S.suspend(() =>
  S.Struct({
    Direction: S.optional(NetworkDirection),
    Protocol: S.optional(S.String),
    OpenPortRange: S.optional(PortRange),
    SourceIpV4: S.optional(S.String),
    SourceIpV6: S.optional(S.String),
    SourcePort: S.optional(S.Number),
    SourceDomain: S.optional(S.String),
    SourceMac: S.optional(S.String),
    DestinationIpV4: S.optional(S.String),
    DestinationIpV6: S.optional(S.String),
    DestinationPort: S.optional(S.Number),
    DestinationDomain: S.optional(S.String),
  }),
).annotations({ identifier: "Network" }) as any as S.Schema<Network>;
export type PortRangeList = PortRange[];
export const PortRangeList = S.Array(PortRange);
export interface NetworkPathComponentDetails {
  Address?: string[];
  PortRanges?: PortRange[];
}
export const NetworkPathComponentDetails = S.suspend(() =>
  S.Struct({
    Address: S.optional(StringList),
    PortRanges: S.optional(PortRangeList),
  }),
).annotations({
  identifier: "NetworkPathComponentDetails",
}) as any as S.Schema<NetworkPathComponentDetails>;
export interface NetworkHeader {
  Protocol?: string;
  Destination?: NetworkPathComponentDetails;
  Source?: NetworkPathComponentDetails;
}
export const NetworkHeader = S.suspend(() =>
  S.Struct({
    Protocol: S.optional(S.String),
    Destination: S.optional(NetworkPathComponentDetails),
    Source: S.optional(NetworkPathComponentDetails),
  }),
).annotations({
  identifier: "NetworkHeader",
}) as any as S.Schema<NetworkHeader>;
export interface NetworkPathComponent {
  ComponentId?: string;
  ComponentType?: string;
  Egress?: NetworkHeader;
  Ingress?: NetworkHeader;
}
export const NetworkPathComponent = S.suspend(() =>
  S.Struct({
    ComponentId: S.optional(S.String),
    ComponentType: S.optional(S.String),
    Egress: S.optional(NetworkHeader),
    Ingress: S.optional(NetworkHeader),
  }),
).annotations({
  identifier: "NetworkPathComponent",
}) as any as S.Schema<NetworkPathComponent>;
export type NetworkPathList = NetworkPathComponent[];
export const NetworkPathList = S.Array(NetworkPathComponent);
export interface FilePaths {
  FilePath?: string;
  FileName?: string;
  ResourceId?: string;
  Hash?: string;
}
export const FilePaths = S.suspend(() =>
  S.Struct({
    FilePath: S.optional(S.String),
    FileName: S.optional(S.String),
    ResourceId: S.optional(S.String),
    Hash: S.optional(S.String),
  }),
).annotations({ identifier: "FilePaths" }) as any as S.Schema<FilePaths>;
export type FilePathList = FilePaths[];
export const FilePathList = S.Array(FilePaths);
export interface Threat {
  Name?: string;
  Severity?: string;
  ItemCount?: number;
  FilePaths?: FilePaths[];
}
export const Threat = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Severity: S.optional(S.String),
    ItemCount: S.optional(S.Number),
    FilePaths: S.optional(FilePathList),
  }),
).annotations({ identifier: "Threat" }) as any as S.Schema<Threat>;
export type ThreatList = Threat[];
export const ThreatList = S.Array(Threat);
export interface ClassificationStatus {
  Code?: string;
  Reason?: string;
}
export const ClassificationStatus = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Reason: S.optional(S.String) }),
).annotations({
  identifier: "ClassificationStatus",
}) as any as S.Schema<ClassificationStatus>;
export interface Range {
  Start?: number;
  End?: number;
  StartColumn?: number;
}
export const Range = S.suspend(() =>
  S.Struct({
    Start: S.optional(S.Number),
    End: S.optional(S.Number),
    StartColumn: S.optional(S.Number),
  }),
).annotations({ identifier: "Range" }) as any as S.Schema<Range>;
export type Ranges = Range[];
export const Ranges = S.Array(Range);
export interface Page {
  PageNumber?: number;
  LineRange?: Range;
  OffsetRange?: Range;
}
export const Page = S.suspend(() =>
  S.Struct({
    PageNumber: S.optional(S.Number),
    LineRange: S.optional(Range),
    OffsetRange: S.optional(Range),
  }),
).annotations({ identifier: "Page" }) as any as S.Schema<Page>;
export type Pages = Page[];
export const Pages = S.Array(Page);
export interface Record {
  JsonPath?: string;
  RecordIndex?: number;
}
export const Record = S.suspend(() =>
  S.Struct({
    JsonPath: S.optional(S.String),
    RecordIndex: S.optional(S.Number),
  }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type Records = Record[];
export const Records = S.Array(Record);
export interface Cell {
  Column?: number;
  Row?: number;
  ColumnName?: string;
  CellReference?: string;
}
export const Cell = S.suspend(() =>
  S.Struct({
    Column: S.optional(S.Number),
    Row: S.optional(S.Number),
    ColumnName: S.optional(S.String),
    CellReference: S.optional(S.String),
  }),
).annotations({ identifier: "Cell" }) as any as S.Schema<Cell>;
export type Cells = Cell[];
export const Cells = S.Array(Cell);
export interface Occurrences {
  LineRanges?: Range[];
  OffsetRanges?: Range[];
  Pages?: Page[];
  Records?: Record[];
  Cells?: Cell[];
}
export const Occurrences = S.suspend(() =>
  S.Struct({
    LineRanges: S.optional(Ranges),
    OffsetRanges: S.optional(Ranges),
    Pages: S.optional(Pages),
    Records: S.optional(Records),
    Cells: S.optional(Cells),
  }),
).annotations({ identifier: "Occurrences" }) as any as S.Schema<Occurrences>;
export interface SensitiveDataDetections {
  Count?: number;
  Type?: string;
  Occurrences?: Occurrences;
}
export const SensitiveDataDetections = S.suspend(() =>
  S.Struct({
    Count: S.optional(S.Number),
    Type: S.optional(S.String),
    Occurrences: S.optional(Occurrences),
  }),
).annotations({
  identifier: "SensitiveDataDetections",
}) as any as S.Schema<SensitiveDataDetections>;
export type SensitiveDataDetectionsList = SensitiveDataDetections[];
export const SensitiveDataDetectionsList = S.Array(SensitiveDataDetections);
export interface SensitiveDataResult {
  Category?: string;
  Detections?: SensitiveDataDetections[];
  TotalCount?: number;
}
export const SensitiveDataResult = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String),
    Detections: S.optional(SensitiveDataDetectionsList),
    TotalCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "SensitiveDataResult",
}) as any as S.Schema<SensitiveDataResult>;
export type SensitiveDataResultList = SensitiveDataResult[];
export const SensitiveDataResultList = S.Array(SensitiveDataResult);
export interface CustomDataIdentifiersDetections {
  Count?: number;
  Arn?: string;
  Name?: string;
  Occurrences?: Occurrences;
}
export const CustomDataIdentifiersDetections = S.suspend(() =>
  S.Struct({
    Count: S.optional(S.Number),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Occurrences: S.optional(Occurrences),
  }),
).annotations({
  identifier: "CustomDataIdentifiersDetections",
}) as any as S.Schema<CustomDataIdentifiersDetections>;
export type CustomDataIdentifiersDetectionsList =
  CustomDataIdentifiersDetections[];
export const CustomDataIdentifiersDetectionsList = S.Array(
  CustomDataIdentifiersDetections,
);
export interface CustomDataIdentifiersResult {
  Detections?: CustomDataIdentifiersDetections[];
  TotalCount?: number;
}
export const CustomDataIdentifiersResult = S.suspend(() =>
  S.Struct({
    Detections: S.optional(CustomDataIdentifiersDetectionsList),
    TotalCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "CustomDataIdentifiersResult",
}) as any as S.Schema<CustomDataIdentifiersResult>;
export interface ClassificationResult {
  MimeType?: string;
  SizeClassified?: number;
  AdditionalOccurrences?: boolean;
  Status?: ClassificationStatus;
  SensitiveData?: SensitiveDataResult[];
  CustomDataIdentifiers?: CustomDataIdentifiersResult;
}
export const ClassificationResult = S.suspend(() =>
  S.Struct({
    MimeType: S.optional(S.String),
    SizeClassified: S.optional(S.Number),
    AdditionalOccurrences: S.optional(S.Boolean),
    Status: S.optional(ClassificationStatus),
    SensitiveData: S.optional(SensitiveDataResultList),
    CustomDataIdentifiers: S.optional(CustomDataIdentifiersResult),
  }),
).annotations({
  identifier: "ClassificationResult",
}) as any as S.Schema<ClassificationResult>;
export interface DataClassificationDetails {
  DetailedResultsLocation?: string;
  Result?: ClassificationResult;
}
export const DataClassificationDetails = S.suspend(() =>
  S.Struct({
    DetailedResultsLocation: S.optional(S.String),
    Result: S.optional(ClassificationResult),
  }),
).annotations({
  identifier: "DataClassificationDetails",
}) as any as S.Schema<DataClassificationDetails>;
export interface AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails {
  OnDemandAllocationStrategy?: string;
  OnDemandBaseCapacity?: number;
  OnDemandPercentageAboveBaseCapacity?: number;
  SpotAllocationStrategy?: string;
  SpotInstancePools?: number;
  SpotMaxPrice?: string;
}
export const AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails =
  S.suspend(() =>
    S.Struct({
      OnDemandAllocationStrategy: S.optional(S.String),
      OnDemandBaseCapacity: S.optional(S.Number),
      OnDemandPercentageAboveBaseCapacity: S.optional(S.Number),
      SpotAllocationStrategy: S.optional(S.String),
      SpotInstancePools: S.optional(S.Number),
      SpotMaxPrice: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails",
  }) as any as S.Schema<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails>;
export interface AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification {
  LaunchTemplateId?: string;
  LaunchTemplateName?: string;
  Version?: string;
}
export const AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification =
  S.suspend(() =>
    S.Struct({
      LaunchTemplateId: S.optional(S.String),
      LaunchTemplateName: S.optional(S.String),
      Version: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification",
  }) as any as S.Schema<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification>;
export interface AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails {
  InstanceType?: string;
  WeightedCapacity?: string;
}
export const AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails =
  S.suspend(() =>
    S.Struct({
      InstanceType: S.optional(S.String),
      WeightedCapacity: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails",
  }) as any as S.Schema<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails>;
export type AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesList =
  AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails[];
export const AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesList =
  S.Array(
    AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails,
  );
export interface AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails {
  LaunchTemplateSpecification?: AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification;
  Overrides?: AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails[];
}
export const AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails =
  S.suspend(() =>
    S.Struct({
      LaunchTemplateSpecification: S.optional(
        AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification,
      ),
      Overrides: S.optional(
        AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesList,
      ),
    }),
  ).annotations({
    identifier:
      "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails",
  }) as any as S.Schema<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails>;
export interface AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails {
  InstancesDistribution?: AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails;
  LaunchTemplate?: AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails;
}
export const AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails =
  S.suspend(() =>
    S.Struct({
      InstancesDistribution: S.optional(
        AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails,
      ),
      LaunchTemplate: S.optional(
        AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails,
      ),
    }),
  ).annotations({
    identifier: "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails",
  }) as any as S.Schema<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails>;
export interface AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails {
  Value?: string;
}
export const AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails =
  S.suspend(() => S.Struct({ Value: S.optional(S.String) })).annotations({
    identifier: "AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails",
  }) as any as S.Schema<AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails>;
export type AwsAutoScalingAutoScalingGroupAvailabilityZonesList =
  AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails[];
export const AwsAutoScalingAutoScalingGroupAvailabilityZonesList = S.Array(
  AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails,
);
export interface AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification {
  LaunchTemplateId?: string;
  LaunchTemplateName?: string;
  Version?: string;
}
export const AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification =
  S.suspend(() =>
    S.Struct({
      LaunchTemplateId: S.optional(S.String),
      LaunchTemplateName: S.optional(S.String),
      Version: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification",
  }) as any as S.Schema<AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification>;
export interface AwsAutoScalingAutoScalingGroupDetails {
  LaunchConfigurationName?: string;
  LoadBalancerNames?: string[];
  HealthCheckType?: string;
  HealthCheckGracePeriod?: number;
  CreatedTime?: string;
  MixedInstancesPolicy?: AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails;
  AvailabilityZones?: AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails[];
  LaunchTemplate?: AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification;
  CapacityRebalance?: boolean;
}
export const AwsAutoScalingAutoScalingGroupDetails = S.suspend(() =>
  S.Struct({
    LaunchConfigurationName: S.optional(S.String),
    LoadBalancerNames: S.optional(StringList),
    HealthCheckType: S.optional(S.String),
    HealthCheckGracePeriod: S.optional(S.Number),
    CreatedTime: S.optional(S.String),
    MixedInstancesPolicy: S.optional(
      AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails,
    ),
    AvailabilityZones: S.optional(
      AwsAutoScalingAutoScalingGroupAvailabilityZonesList,
    ),
    LaunchTemplate: S.optional(
      AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification,
    ),
    CapacityRebalance: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsAutoScalingAutoScalingGroupDetails",
}) as any as S.Schema<AwsAutoScalingAutoScalingGroupDetails>;
export interface AwsCodeBuildProjectArtifactsDetails {
  ArtifactIdentifier?: string;
  EncryptionDisabled?: boolean;
  Location?: string;
  Name?: string;
  NamespaceType?: string;
  OverrideArtifactName?: boolean;
  Packaging?: string;
  Path?: string;
  Type?: string;
}
export const AwsCodeBuildProjectArtifactsDetails = S.suspend(() =>
  S.Struct({
    ArtifactIdentifier: S.optional(S.String),
    EncryptionDisabled: S.optional(S.Boolean),
    Location: S.optional(S.String),
    Name: S.optional(S.String),
    NamespaceType: S.optional(S.String),
    OverrideArtifactName: S.optional(S.Boolean),
    Packaging: S.optional(S.String),
    Path: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCodeBuildProjectArtifactsDetails",
}) as any as S.Schema<AwsCodeBuildProjectArtifactsDetails>;
export type AwsCodeBuildProjectArtifactsList =
  AwsCodeBuildProjectArtifactsDetails[];
export const AwsCodeBuildProjectArtifactsList = S.Array(
  AwsCodeBuildProjectArtifactsDetails,
);
export interface AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails {
  Name?: string;
  Type?: string;
  Value?: string;
}
export const AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails =
  S.suspend(() =>
    S.Struct({
      Name: S.optional(S.String),
      Type: S.optional(S.String),
      Value: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails",
  }) as any as S.Schema<AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails>;
export type AwsCodeBuildProjectEnvironmentEnvironmentVariablesList =
  AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails[];
export const AwsCodeBuildProjectEnvironmentEnvironmentVariablesList = S.Array(
  AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails,
);
export interface AwsCodeBuildProjectEnvironmentRegistryCredential {
  Credential?: string;
  CredentialProvider?: string;
}
export const AwsCodeBuildProjectEnvironmentRegistryCredential = S.suspend(() =>
  S.Struct({
    Credential: S.optional(S.String),
    CredentialProvider: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCodeBuildProjectEnvironmentRegistryCredential",
}) as any as S.Schema<AwsCodeBuildProjectEnvironmentRegistryCredential>;
export interface AwsCodeBuildProjectEnvironment {
  Certificate?: string;
  EnvironmentVariables?: AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails[];
  PrivilegedMode?: boolean;
  ImagePullCredentialsType?: string;
  RegistryCredential?: AwsCodeBuildProjectEnvironmentRegistryCredential;
  Type?: string;
}
export const AwsCodeBuildProjectEnvironment = S.suspend(() =>
  S.Struct({
    Certificate: S.optional(S.String),
    EnvironmentVariables: S.optional(
      AwsCodeBuildProjectEnvironmentEnvironmentVariablesList,
    ),
    PrivilegedMode: S.optional(S.Boolean),
    ImagePullCredentialsType: S.optional(S.String),
    RegistryCredential: S.optional(
      AwsCodeBuildProjectEnvironmentRegistryCredential,
    ),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCodeBuildProjectEnvironment",
}) as any as S.Schema<AwsCodeBuildProjectEnvironment>;
export interface AwsCodeBuildProjectSource {
  Type?: string;
  Location?: string;
  GitCloneDepth?: number;
  InsecureSsl?: boolean;
}
export const AwsCodeBuildProjectSource = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Location: S.optional(S.String),
    GitCloneDepth: S.optional(S.Number),
    InsecureSsl: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsCodeBuildProjectSource",
}) as any as S.Schema<AwsCodeBuildProjectSource>;
export interface AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails {
  GroupName?: string;
  Status?: string;
  StreamName?: string;
}
export const AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails = S.suspend(
  () =>
    S.Struct({
      GroupName: S.optional(S.String),
      Status: S.optional(S.String),
      StreamName: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails",
}) as any as S.Schema<AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails>;
export interface AwsCodeBuildProjectLogsConfigS3LogsDetails {
  EncryptionDisabled?: boolean;
  Location?: string;
  Status?: string;
}
export const AwsCodeBuildProjectLogsConfigS3LogsDetails = S.suspend(() =>
  S.Struct({
    EncryptionDisabled: S.optional(S.Boolean),
    Location: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCodeBuildProjectLogsConfigS3LogsDetails",
}) as any as S.Schema<AwsCodeBuildProjectLogsConfigS3LogsDetails>;
export interface AwsCodeBuildProjectLogsConfigDetails {
  CloudWatchLogs?: AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails;
  S3Logs?: AwsCodeBuildProjectLogsConfigS3LogsDetails;
}
export const AwsCodeBuildProjectLogsConfigDetails = S.suspend(() =>
  S.Struct({
    CloudWatchLogs: S.optional(
      AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails,
    ),
    S3Logs: S.optional(AwsCodeBuildProjectLogsConfigS3LogsDetails),
  }),
).annotations({
  identifier: "AwsCodeBuildProjectLogsConfigDetails",
}) as any as S.Schema<AwsCodeBuildProjectLogsConfigDetails>;
export type NonEmptyStringList = string[];
export const NonEmptyStringList = S.Array(S.String);
export interface AwsCodeBuildProjectVpcConfig {
  VpcId?: string;
  Subnets?: string[];
  SecurityGroupIds?: string[];
}
export const AwsCodeBuildProjectVpcConfig = S.suspend(() =>
  S.Struct({
    VpcId: S.optional(S.String),
    Subnets: S.optional(NonEmptyStringList),
    SecurityGroupIds: S.optional(NonEmptyStringList),
  }),
).annotations({
  identifier: "AwsCodeBuildProjectVpcConfig",
}) as any as S.Schema<AwsCodeBuildProjectVpcConfig>;
export interface AwsCodeBuildProjectDetails {
  EncryptionKey?: string;
  Artifacts?: AwsCodeBuildProjectArtifactsDetails[];
  Environment?: AwsCodeBuildProjectEnvironment;
  Name?: string;
  Source?: AwsCodeBuildProjectSource;
  ServiceRole?: string;
  LogsConfig?: AwsCodeBuildProjectLogsConfigDetails;
  VpcConfig?: AwsCodeBuildProjectVpcConfig;
  SecondaryArtifacts?: AwsCodeBuildProjectArtifactsDetails[];
}
export const AwsCodeBuildProjectDetails = S.suspend(() =>
  S.Struct({
    EncryptionKey: S.optional(S.String),
    Artifacts: S.optional(AwsCodeBuildProjectArtifactsList),
    Environment: S.optional(AwsCodeBuildProjectEnvironment),
    Name: S.optional(S.String),
    Source: S.optional(AwsCodeBuildProjectSource),
    ServiceRole: S.optional(S.String),
    LogsConfig: S.optional(AwsCodeBuildProjectLogsConfigDetails),
    VpcConfig: S.optional(AwsCodeBuildProjectVpcConfig),
    SecondaryArtifacts: S.optional(AwsCodeBuildProjectArtifactsList),
  }),
).annotations({
  identifier: "AwsCodeBuildProjectDetails",
}) as any as S.Schema<AwsCodeBuildProjectDetails>;
export interface AwsCloudFrontDistributionCacheBehavior {
  ViewerProtocolPolicy?: string;
}
export const AwsCloudFrontDistributionCacheBehavior = S.suspend(() =>
  S.Struct({ ViewerProtocolPolicy: S.optional(S.String) }),
).annotations({
  identifier: "AwsCloudFrontDistributionCacheBehavior",
}) as any as S.Schema<AwsCloudFrontDistributionCacheBehavior>;
export type AwsCloudFrontDistributionCacheBehaviorsItemList =
  AwsCloudFrontDistributionCacheBehavior[];
export const AwsCloudFrontDistributionCacheBehaviorsItemList = S.Array(
  AwsCloudFrontDistributionCacheBehavior,
);
export interface AwsCloudFrontDistributionCacheBehaviors {
  Items?: AwsCloudFrontDistributionCacheBehavior[];
}
export const AwsCloudFrontDistributionCacheBehaviors = S.suspend(() =>
  S.Struct({
    Items: S.optional(AwsCloudFrontDistributionCacheBehaviorsItemList),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionCacheBehaviors",
}) as any as S.Schema<AwsCloudFrontDistributionCacheBehaviors>;
export interface AwsCloudFrontDistributionDefaultCacheBehavior {
  ViewerProtocolPolicy?: string;
}
export const AwsCloudFrontDistributionDefaultCacheBehavior = S.suspend(() =>
  S.Struct({ ViewerProtocolPolicy: S.optional(S.String) }),
).annotations({
  identifier: "AwsCloudFrontDistributionDefaultCacheBehavior",
}) as any as S.Schema<AwsCloudFrontDistributionDefaultCacheBehavior>;
export interface AwsCloudFrontDistributionLogging {
  Bucket?: string;
  Enabled?: boolean;
  IncludeCookies?: boolean;
  Prefix?: string;
}
export const AwsCloudFrontDistributionLogging = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    IncludeCookies: S.optional(S.Boolean),
    Prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionLogging",
}) as any as S.Schema<AwsCloudFrontDistributionLogging>;
export interface AwsCloudFrontDistributionOriginS3OriginConfig {
  OriginAccessIdentity?: string;
}
export const AwsCloudFrontDistributionOriginS3OriginConfig = S.suspend(() =>
  S.Struct({ OriginAccessIdentity: S.optional(S.String) }),
).annotations({
  identifier: "AwsCloudFrontDistributionOriginS3OriginConfig",
}) as any as S.Schema<AwsCloudFrontDistributionOriginS3OriginConfig>;
export interface AwsCloudFrontDistributionOriginSslProtocols {
  Items?: string[];
  Quantity?: number;
}
export const AwsCloudFrontDistributionOriginSslProtocols = S.suspend(() =>
  S.Struct({
    Items: S.optional(NonEmptyStringList),
    Quantity: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionOriginSslProtocols",
}) as any as S.Schema<AwsCloudFrontDistributionOriginSslProtocols>;
export interface AwsCloudFrontDistributionOriginCustomOriginConfig {
  HttpPort?: number;
  HttpsPort?: number;
  OriginKeepaliveTimeout?: number;
  OriginProtocolPolicy?: string;
  OriginReadTimeout?: number;
  OriginSslProtocols?: AwsCloudFrontDistributionOriginSslProtocols;
}
export const AwsCloudFrontDistributionOriginCustomOriginConfig = S.suspend(() =>
  S.Struct({
    HttpPort: S.optional(S.Number),
    HttpsPort: S.optional(S.Number),
    OriginKeepaliveTimeout: S.optional(S.Number),
    OriginProtocolPolicy: S.optional(S.String),
    OriginReadTimeout: S.optional(S.Number),
    OriginSslProtocols: S.optional(AwsCloudFrontDistributionOriginSslProtocols),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionOriginCustomOriginConfig",
}) as any as S.Schema<AwsCloudFrontDistributionOriginCustomOriginConfig>;
export interface AwsCloudFrontDistributionOriginItem {
  DomainName?: string;
  Id?: string;
  OriginPath?: string;
  S3OriginConfig?: AwsCloudFrontDistributionOriginS3OriginConfig;
  CustomOriginConfig?: AwsCloudFrontDistributionOriginCustomOriginConfig;
}
export const AwsCloudFrontDistributionOriginItem = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    Id: S.optional(S.String),
    OriginPath: S.optional(S.String),
    S3OriginConfig: S.optional(AwsCloudFrontDistributionOriginS3OriginConfig),
    CustomOriginConfig: S.optional(
      AwsCloudFrontDistributionOriginCustomOriginConfig,
    ),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionOriginItem",
}) as any as S.Schema<AwsCloudFrontDistributionOriginItem>;
export type AwsCloudFrontDistributionOriginItemList =
  AwsCloudFrontDistributionOriginItem[];
export const AwsCloudFrontDistributionOriginItemList = S.Array(
  AwsCloudFrontDistributionOriginItem,
);
export interface AwsCloudFrontDistributionOrigins {
  Items?: AwsCloudFrontDistributionOriginItem[];
}
export const AwsCloudFrontDistributionOrigins = S.suspend(() =>
  S.Struct({ Items: S.optional(AwsCloudFrontDistributionOriginItemList) }),
).annotations({
  identifier: "AwsCloudFrontDistributionOrigins",
}) as any as S.Schema<AwsCloudFrontDistributionOrigins>;
export type AwsCloudFrontDistributionOriginGroupFailoverStatusCodesItemList =
  number[];
export const AwsCloudFrontDistributionOriginGroupFailoverStatusCodesItemList =
  S.Array(S.Number);
export interface AwsCloudFrontDistributionOriginGroupFailoverStatusCodes {
  Items?: number[];
  Quantity?: number;
}
export const AwsCloudFrontDistributionOriginGroupFailoverStatusCodes =
  S.suspend(() =>
    S.Struct({
      Items: S.optional(
        AwsCloudFrontDistributionOriginGroupFailoverStatusCodesItemList,
      ),
      Quantity: S.optional(S.Number),
    }),
  ).annotations({
    identifier: "AwsCloudFrontDistributionOriginGroupFailoverStatusCodes",
  }) as any as S.Schema<AwsCloudFrontDistributionOriginGroupFailoverStatusCodes>;
export interface AwsCloudFrontDistributionOriginGroupFailover {
  StatusCodes?: AwsCloudFrontDistributionOriginGroupFailoverStatusCodes;
}
export const AwsCloudFrontDistributionOriginGroupFailover = S.suspend(() =>
  S.Struct({
    StatusCodes: S.optional(
      AwsCloudFrontDistributionOriginGroupFailoverStatusCodes,
    ),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionOriginGroupFailover",
}) as any as S.Schema<AwsCloudFrontDistributionOriginGroupFailover>;
export interface AwsCloudFrontDistributionOriginGroup {
  FailoverCriteria?: AwsCloudFrontDistributionOriginGroupFailover;
}
export const AwsCloudFrontDistributionOriginGroup = S.suspend(() =>
  S.Struct({
    FailoverCriteria: S.optional(AwsCloudFrontDistributionOriginGroupFailover),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionOriginGroup",
}) as any as S.Schema<AwsCloudFrontDistributionOriginGroup>;
export type AwsCloudFrontDistributionOriginGroupsItemList =
  AwsCloudFrontDistributionOriginGroup[];
export const AwsCloudFrontDistributionOriginGroupsItemList = S.Array(
  AwsCloudFrontDistributionOriginGroup,
);
export interface AwsCloudFrontDistributionOriginGroups {
  Items?: AwsCloudFrontDistributionOriginGroup[];
}
export const AwsCloudFrontDistributionOriginGroups = S.suspend(() =>
  S.Struct({
    Items: S.optional(AwsCloudFrontDistributionOriginGroupsItemList),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionOriginGroups",
}) as any as S.Schema<AwsCloudFrontDistributionOriginGroups>;
export interface AwsCloudFrontDistributionViewerCertificate {
  AcmCertificateArn?: string;
  Certificate?: string;
  CertificateSource?: string;
  CloudFrontDefaultCertificate?: boolean;
  IamCertificateId?: string;
  MinimumProtocolVersion?: string;
  SslSupportMethod?: string;
}
export const AwsCloudFrontDistributionViewerCertificate = S.suspend(() =>
  S.Struct({
    AcmCertificateArn: S.optional(S.String),
    Certificate: S.optional(S.String),
    CertificateSource: S.optional(S.String),
    CloudFrontDefaultCertificate: S.optional(S.Boolean),
    IamCertificateId: S.optional(S.String),
    MinimumProtocolVersion: S.optional(S.String),
    SslSupportMethod: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionViewerCertificate",
}) as any as S.Schema<AwsCloudFrontDistributionViewerCertificate>;
export interface AwsCloudFrontDistributionDetails {
  CacheBehaviors?: AwsCloudFrontDistributionCacheBehaviors;
  DefaultCacheBehavior?: AwsCloudFrontDistributionDefaultCacheBehavior;
  DefaultRootObject?: string;
  DomainName?: string;
  ETag?: string;
  LastModifiedTime?: string;
  Logging?: AwsCloudFrontDistributionLogging;
  Origins?: AwsCloudFrontDistributionOrigins;
  OriginGroups?: AwsCloudFrontDistributionOriginGroups;
  ViewerCertificate?: AwsCloudFrontDistributionViewerCertificate;
  Status?: string;
  WebAclId?: string;
}
export const AwsCloudFrontDistributionDetails = S.suspend(() =>
  S.Struct({
    CacheBehaviors: S.optional(AwsCloudFrontDistributionCacheBehaviors),
    DefaultCacheBehavior: S.optional(
      AwsCloudFrontDistributionDefaultCacheBehavior,
    ),
    DefaultRootObject: S.optional(S.String),
    DomainName: S.optional(S.String),
    ETag: S.optional(S.String),
    LastModifiedTime: S.optional(S.String),
    Logging: S.optional(AwsCloudFrontDistributionLogging),
    Origins: S.optional(AwsCloudFrontDistributionOrigins),
    OriginGroups: S.optional(AwsCloudFrontDistributionOriginGroups),
    ViewerCertificate: S.optional(AwsCloudFrontDistributionViewerCertificate),
    Status: S.optional(S.String),
    WebAclId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCloudFrontDistributionDetails",
}) as any as S.Schema<AwsCloudFrontDistributionDetails>;
export interface AwsEc2InstanceNetworkInterfacesDetails {
  NetworkInterfaceId?: string;
}
export const AwsEc2InstanceNetworkInterfacesDetails = S.suspend(() =>
  S.Struct({ NetworkInterfaceId: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2InstanceNetworkInterfacesDetails",
}) as any as S.Schema<AwsEc2InstanceNetworkInterfacesDetails>;
export type AwsEc2InstanceNetworkInterfacesList =
  AwsEc2InstanceNetworkInterfacesDetails[];
export const AwsEc2InstanceNetworkInterfacesList = S.Array(
  AwsEc2InstanceNetworkInterfacesDetails,
);
export interface AwsEc2InstanceMetadataOptions {
  HttpEndpoint?: string;
  HttpProtocolIpv6?: string;
  HttpPutResponseHopLimit?: number;
  HttpTokens?: string;
  InstanceMetadataTags?: string;
}
export const AwsEc2InstanceMetadataOptions = S.suspend(() =>
  S.Struct({
    HttpEndpoint: S.optional(S.String),
    HttpProtocolIpv6: S.optional(S.String),
    HttpPutResponseHopLimit: S.optional(S.Number),
    HttpTokens: S.optional(S.String),
    InstanceMetadataTags: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2InstanceMetadataOptions",
}) as any as S.Schema<AwsEc2InstanceMetadataOptions>;
export interface AwsEc2InstanceMonitoringDetails {
  State?: string;
}
export const AwsEc2InstanceMonitoringDetails = S.suspend(() =>
  S.Struct({ State: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2InstanceMonitoringDetails",
}) as any as S.Schema<AwsEc2InstanceMonitoringDetails>;
export interface AwsEc2InstanceDetails {
  Type?: string;
  ImageId?: string;
  IpV4Addresses?: string[];
  IpV6Addresses?: string[];
  KeyName?: string;
  IamInstanceProfileArn?: string;
  VpcId?: string;
  SubnetId?: string;
  LaunchedAt?: string;
  NetworkInterfaces?: AwsEc2InstanceNetworkInterfacesDetails[];
  VirtualizationType?: string;
  MetadataOptions?: AwsEc2InstanceMetadataOptions;
  Monitoring?: AwsEc2InstanceMonitoringDetails;
}
export const AwsEc2InstanceDetails = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    ImageId: S.optional(S.String),
    IpV4Addresses: S.optional(StringList),
    IpV6Addresses: S.optional(StringList),
    KeyName: S.optional(S.String),
    IamInstanceProfileArn: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetId: S.optional(S.String),
    LaunchedAt: S.optional(S.String),
    NetworkInterfaces: S.optional(AwsEc2InstanceNetworkInterfacesList),
    VirtualizationType: S.optional(S.String),
    MetadataOptions: S.optional(AwsEc2InstanceMetadataOptions),
    Monitoring: S.optional(AwsEc2InstanceMonitoringDetails),
  }),
).annotations({
  identifier: "AwsEc2InstanceDetails",
}) as any as S.Schema<AwsEc2InstanceDetails>;
export interface AwsEc2NetworkInterfaceAttachment {
  AttachTime?: string;
  AttachmentId?: string;
  DeleteOnTermination?: boolean;
  DeviceIndex?: number;
  InstanceId?: string;
  InstanceOwnerId?: string;
  Status?: string;
}
export const AwsEc2NetworkInterfaceAttachment = S.suspend(() =>
  S.Struct({
    AttachTime: S.optional(S.String),
    AttachmentId: S.optional(S.String),
    DeleteOnTermination: S.optional(S.Boolean),
    DeviceIndex: S.optional(S.Number),
    InstanceId: S.optional(S.String),
    InstanceOwnerId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2NetworkInterfaceAttachment",
}) as any as S.Schema<AwsEc2NetworkInterfaceAttachment>;
export interface AwsEc2NetworkInterfaceSecurityGroup {
  GroupName?: string;
  GroupId?: string;
}
export const AwsEc2NetworkInterfaceSecurityGroup = S.suspend(() =>
  S.Struct({ GroupName: S.optional(S.String), GroupId: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2NetworkInterfaceSecurityGroup",
}) as any as S.Schema<AwsEc2NetworkInterfaceSecurityGroup>;
export type AwsEc2NetworkInterfaceSecurityGroupList =
  AwsEc2NetworkInterfaceSecurityGroup[];
export const AwsEc2NetworkInterfaceSecurityGroupList = S.Array(
  AwsEc2NetworkInterfaceSecurityGroup,
);
export interface AwsEc2NetworkInterfaceIpV6AddressDetail {
  IpV6Address?: string;
}
export const AwsEc2NetworkInterfaceIpV6AddressDetail = S.suspend(() =>
  S.Struct({ IpV6Address: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2NetworkInterfaceIpV6AddressDetail",
}) as any as S.Schema<AwsEc2NetworkInterfaceIpV6AddressDetail>;
export type AwsEc2NetworkInterfaceIpV6AddressList =
  AwsEc2NetworkInterfaceIpV6AddressDetail[];
export const AwsEc2NetworkInterfaceIpV6AddressList = S.Array(
  AwsEc2NetworkInterfaceIpV6AddressDetail,
);
export interface AwsEc2NetworkInterfacePrivateIpAddressDetail {
  PrivateIpAddress?: string;
  PrivateDnsName?: string;
}
export const AwsEc2NetworkInterfacePrivateIpAddressDetail = S.suspend(() =>
  S.Struct({
    PrivateIpAddress: S.optional(S.String),
    PrivateDnsName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2NetworkInterfacePrivateIpAddressDetail",
}) as any as S.Schema<AwsEc2NetworkInterfacePrivateIpAddressDetail>;
export type AwsEc2NetworkInterfacePrivateIpAddressList =
  AwsEc2NetworkInterfacePrivateIpAddressDetail[];
export const AwsEc2NetworkInterfacePrivateIpAddressList = S.Array(
  AwsEc2NetworkInterfacePrivateIpAddressDetail,
);
export interface AwsEc2NetworkInterfaceDetails {
  Attachment?: AwsEc2NetworkInterfaceAttachment;
  NetworkInterfaceId?: string;
  SecurityGroups?: AwsEc2NetworkInterfaceSecurityGroup[];
  SourceDestCheck?: boolean;
  IpV6Addresses?: AwsEc2NetworkInterfaceIpV6AddressDetail[];
  PrivateIpAddresses?: AwsEc2NetworkInterfacePrivateIpAddressDetail[];
  PublicDnsName?: string;
  PublicIp?: string;
}
export const AwsEc2NetworkInterfaceDetails = S.suspend(() =>
  S.Struct({
    Attachment: S.optional(AwsEc2NetworkInterfaceAttachment),
    NetworkInterfaceId: S.optional(S.String),
    SecurityGroups: S.optional(AwsEc2NetworkInterfaceSecurityGroupList),
    SourceDestCheck: S.optional(S.Boolean),
    IpV6Addresses: S.optional(AwsEc2NetworkInterfaceIpV6AddressList),
    PrivateIpAddresses: S.optional(AwsEc2NetworkInterfacePrivateIpAddressList),
    PublicDnsName: S.optional(S.String),
    PublicIp: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2NetworkInterfaceDetails",
}) as any as S.Schema<AwsEc2NetworkInterfaceDetails>;
export interface AwsEc2SecurityGroupUserIdGroupPair {
  GroupId?: string;
  GroupName?: string;
  PeeringStatus?: string;
  UserId?: string;
  VpcId?: string;
  VpcPeeringConnectionId?: string;
}
export const AwsEc2SecurityGroupUserIdGroupPair = S.suspend(() =>
  S.Struct({
    GroupId: S.optional(S.String),
    GroupName: S.optional(S.String),
    PeeringStatus: S.optional(S.String),
    UserId: S.optional(S.String),
    VpcId: S.optional(S.String),
    VpcPeeringConnectionId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2SecurityGroupUserIdGroupPair",
}) as any as S.Schema<AwsEc2SecurityGroupUserIdGroupPair>;
export type AwsEc2SecurityGroupUserIdGroupPairList =
  AwsEc2SecurityGroupUserIdGroupPair[];
export const AwsEc2SecurityGroupUserIdGroupPairList = S.Array(
  AwsEc2SecurityGroupUserIdGroupPair,
);
export interface AwsEc2SecurityGroupIpRange {
  CidrIp?: string;
}
export const AwsEc2SecurityGroupIpRange = S.suspend(() =>
  S.Struct({ CidrIp: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2SecurityGroupIpRange",
}) as any as S.Schema<AwsEc2SecurityGroupIpRange>;
export type AwsEc2SecurityGroupIpRangeList = AwsEc2SecurityGroupIpRange[];
export const AwsEc2SecurityGroupIpRangeList = S.Array(
  AwsEc2SecurityGroupIpRange,
);
export interface AwsEc2SecurityGroupIpv6Range {
  CidrIpv6?: string;
}
export const AwsEc2SecurityGroupIpv6Range = S.suspend(() =>
  S.Struct({ CidrIpv6: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2SecurityGroupIpv6Range",
}) as any as S.Schema<AwsEc2SecurityGroupIpv6Range>;
export type AwsEc2SecurityGroupIpv6RangeList = AwsEc2SecurityGroupIpv6Range[];
export const AwsEc2SecurityGroupIpv6RangeList = S.Array(
  AwsEc2SecurityGroupIpv6Range,
);
export interface AwsEc2SecurityGroupPrefixListId {
  PrefixListId?: string;
}
export const AwsEc2SecurityGroupPrefixListId = S.suspend(() =>
  S.Struct({ PrefixListId: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2SecurityGroupPrefixListId",
}) as any as S.Schema<AwsEc2SecurityGroupPrefixListId>;
export type AwsEc2SecurityGroupPrefixListIdList =
  AwsEc2SecurityGroupPrefixListId[];
export const AwsEc2SecurityGroupPrefixListIdList = S.Array(
  AwsEc2SecurityGroupPrefixListId,
);
export interface AwsEc2SecurityGroupIpPermission {
  IpProtocol?: string;
  FromPort?: number;
  ToPort?: number;
  UserIdGroupPairs?: AwsEc2SecurityGroupUserIdGroupPair[];
  IpRanges?: AwsEc2SecurityGroupIpRange[];
  Ipv6Ranges?: AwsEc2SecurityGroupIpv6Range[];
  PrefixListIds?: AwsEc2SecurityGroupPrefixListId[];
}
export const AwsEc2SecurityGroupIpPermission = S.suspend(() =>
  S.Struct({
    IpProtocol: S.optional(S.String),
    FromPort: S.optional(S.Number),
    ToPort: S.optional(S.Number),
    UserIdGroupPairs: S.optional(AwsEc2SecurityGroupUserIdGroupPairList),
    IpRanges: S.optional(AwsEc2SecurityGroupIpRangeList),
    Ipv6Ranges: S.optional(AwsEc2SecurityGroupIpv6RangeList),
    PrefixListIds: S.optional(AwsEc2SecurityGroupPrefixListIdList),
  }),
).annotations({
  identifier: "AwsEc2SecurityGroupIpPermission",
}) as any as S.Schema<AwsEc2SecurityGroupIpPermission>;
export type AwsEc2SecurityGroupIpPermissionList =
  AwsEc2SecurityGroupIpPermission[];
export const AwsEc2SecurityGroupIpPermissionList = S.Array(
  AwsEc2SecurityGroupIpPermission,
);
export interface AwsEc2SecurityGroupDetails {
  GroupName?: string;
  GroupId?: string;
  OwnerId?: string;
  VpcId?: string;
  IpPermissions?: AwsEc2SecurityGroupIpPermission[];
  IpPermissionsEgress?: AwsEc2SecurityGroupIpPermission[];
}
export const AwsEc2SecurityGroupDetails = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    GroupId: S.optional(S.String),
    OwnerId: S.optional(S.String),
    VpcId: S.optional(S.String),
    IpPermissions: S.optional(AwsEc2SecurityGroupIpPermissionList),
    IpPermissionsEgress: S.optional(AwsEc2SecurityGroupIpPermissionList),
  }),
).annotations({
  identifier: "AwsEc2SecurityGroupDetails",
}) as any as S.Schema<AwsEc2SecurityGroupDetails>;
export interface AwsEc2VolumeAttachment {
  AttachTime?: string;
  DeleteOnTermination?: boolean;
  InstanceId?: string;
  Status?: string;
}
export const AwsEc2VolumeAttachment = S.suspend(() =>
  S.Struct({
    AttachTime: S.optional(S.String),
    DeleteOnTermination: S.optional(S.Boolean),
    InstanceId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2VolumeAttachment",
}) as any as S.Schema<AwsEc2VolumeAttachment>;
export type AwsEc2VolumeAttachmentList = AwsEc2VolumeAttachment[];
export const AwsEc2VolumeAttachmentList = S.Array(AwsEc2VolumeAttachment);
export interface AwsEc2VolumeDetails {
  CreateTime?: string;
  DeviceName?: string;
  Encrypted?: boolean;
  Size?: number;
  SnapshotId?: string;
  Status?: string;
  KmsKeyId?: string;
  Attachments?: AwsEc2VolumeAttachment[];
  VolumeId?: string;
  VolumeType?: string;
  VolumeScanStatus?: string;
}
export const AwsEc2VolumeDetails = S.suspend(() =>
  S.Struct({
    CreateTime: S.optional(S.String),
    DeviceName: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    Size: S.optional(S.Number),
    SnapshotId: S.optional(S.String),
    Status: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Attachments: S.optional(AwsEc2VolumeAttachmentList),
    VolumeId: S.optional(S.String),
    VolumeType: S.optional(S.String),
    VolumeScanStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2VolumeDetails",
}) as any as S.Schema<AwsEc2VolumeDetails>;
export interface CidrBlockAssociation {
  AssociationId?: string;
  CidrBlock?: string;
  CidrBlockState?: string;
}
export const CidrBlockAssociation = S.suspend(() =>
  S.Struct({
    AssociationId: S.optional(S.String),
    CidrBlock: S.optional(S.String),
    CidrBlockState: S.optional(S.String),
  }),
).annotations({
  identifier: "CidrBlockAssociation",
}) as any as S.Schema<CidrBlockAssociation>;
export type CidrBlockAssociationList = CidrBlockAssociation[];
export const CidrBlockAssociationList = S.Array(CidrBlockAssociation);
export interface Ipv6CidrBlockAssociation {
  AssociationId?: string;
  Ipv6CidrBlock?: string;
  CidrBlockState?: string;
}
export const Ipv6CidrBlockAssociation = S.suspend(() =>
  S.Struct({
    AssociationId: S.optional(S.String),
    Ipv6CidrBlock: S.optional(S.String),
    CidrBlockState: S.optional(S.String),
  }),
).annotations({
  identifier: "Ipv6CidrBlockAssociation",
}) as any as S.Schema<Ipv6CidrBlockAssociation>;
export type Ipv6CidrBlockAssociationList = Ipv6CidrBlockAssociation[];
export const Ipv6CidrBlockAssociationList = S.Array(Ipv6CidrBlockAssociation);
export interface AwsEc2VpcDetails {
  CidrBlockAssociationSet?: CidrBlockAssociation[];
  Ipv6CidrBlockAssociationSet?: Ipv6CidrBlockAssociation[];
  DhcpOptionsId?: string;
  State?: string;
}
export const AwsEc2VpcDetails = S.suspend(() =>
  S.Struct({
    CidrBlockAssociationSet: S.optional(CidrBlockAssociationList),
    Ipv6CidrBlockAssociationSet: S.optional(Ipv6CidrBlockAssociationList),
    DhcpOptionsId: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2VpcDetails",
}) as any as S.Schema<AwsEc2VpcDetails>;
export interface AwsEc2EipDetails {
  InstanceId?: string;
  PublicIp?: string;
  AllocationId?: string;
  AssociationId?: string;
  Domain?: string;
  PublicIpv4Pool?: string;
  NetworkBorderGroup?: string;
  NetworkInterfaceId?: string;
  NetworkInterfaceOwnerId?: string;
  PrivateIpAddress?: string;
}
export const AwsEc2EipDetails = S.suspend(() =>
  S.Struct({
    InstanceId: S.optional(S.String),
    PublicIp: S.optional(S.String),
    AllocationId: S.optional(S.String),
    AssociationId: S.optional(S.String),
    Domain: S.optional(S.String),
    PublicIpv4Pool: S.optional(S.String),
    NetworkBorderGroup: S.optional(S.String),
    NetworkInterfaceId: S.optional(S.String),
    NetworkInterfaceOwnerId: S.optional(S.String),
    PrivateIpAddress: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2EipDetails",
}) as any as S.Schema<AwsEc2EipDetails>;
export interface AwsEc2SubnetDetails {
  AssignIpv6AddressOnCreation?: boolean;
  AvailabilityZone?: string;
  AvailabilityZoneId?: string;
  AvailableIpAddressCount?: number;
  CidrBlock?: string;
  DefaultForAz?: boolean;
  MapPublicIpOnLaunch?: boolean;
  OwnerId?: string;
  State?: string;
  SubnetArn?: string;
  SubnetId?: string;
  VpcId?: string;
  Ipv6CidrBlockAssociationSet?: Ipv6CidrBlockAssociation[];
}
export const AwsEc2SubnetDetails = S.suspend(() =>
  S.Struct({
    AssignIpv6AddressOnCreation: S.optional(S.Boolean),
    AvailabilityZone: S.optional(S.String),
    AvailabilityZoneId: S.optional(S.String),
    AvailableIpAddressCount: S.optional(S.Number),
    CidrBlock: S.optional(S.String),
    DefaultForAz: S.optional(S.Boolean),
    MapPublicIpOnLaunch: S.optional(S.Boolean),
    OwnerId: S.optional(S.String),
    State: S.optional(S.String),
    SubnetArn: S.optional(S.String),
    SubnetId: S.optional(S.String),
    VpcId: S.optional(S.String),
    Ipv6CidrBlockAssociationSet: S.optional(Ipv6CidrBlockAssociationList),
  }),
).annotations({
  identifier: "AwsEc2SubnetDetails",
}) as any as S.Schema<AwsEc2SubnetDetails>;
export interface AwsEc2NetworkAclAssociation {
  NetworkAclAssociationId?: string;
  NetworkAclId?: string;
  SubnetId?: string;
}
export const AwsEc2NetworkAclAssociation = S.suspend(() =>
  S.Struct({
    NetworkAclAssociationId: S.optional(S.String),
    NetworkAclId: S.optional(S.String),
    SubnetId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2NetworkAclAssociation",
}) as any as S.Schema<AwsEc2NetworkAclAssociation>;
export type AwsEc2NetworkAclAssociationList = AwsEc2NetworkAclAssociation[];
export const AwsEc2NetworkAclAssociationList = S.Array(
  AwsEc2NetworkAclAssociation,
);
export interface IcmpTypeCode {
  Code?: number;
  Type?: number;
}
export const IcmpTypeCode = S.suspend(() =>
  S.Struct({ Code: S.optional(S.Number), Type: S.optional(S.Number) }),
).annotations({ identifier: "IcmpTypeCode" }) as any as S.Schema<IcmpTypeCode>;
export interface PortRangeFromTo {
  From?: number;
  To?: number;
}
export const PortRangeFromTo = S.suspend(() =>
  S.Struct({ From: S.optional(S.Number), To: S.optional(S.Number) }),
).annotations({
  identifier: "PortRangeFromTo",
}) as any as S.Schema<PortRangeFromTo>;
export interface AwsEc2NetworkAclEntry {
  CidrBlock?: string;
  Egress?: boolean;
  IcmpTypeCode?: IcmpTypeCode;
  Ipv6CidrBlock?: string;
  PortRange?: PortRangeFromTo;
  Protocol?: string;
  RuleAction?: string;
  RuleNumber?: number;
}
export const AwsEc2NetworkAclEntry = S.suspend(() =>
  S.Struct({
    CidrBlock: S.optional(S.String),
    Egress: S.optional(S.Boolean),
    IcmpTypeCode: S.optional(IcmpTypeCode),
    Ipv6CidrBlock: S.optional(S.String),
    PortRange: S.optional(PortRangeFromTo),
    Protocol: S.optional(S.String),
    RuleAction: S.optional(S.String),
    RuleNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsEc2NetworkAclEntry",
}) as any as S.Schema<AwsEc2NetworkAclEntry>;
export type AwsEc2NetworkAclEntryList = AwsEc2NetworkAclEntry[];
export const AwsEc2NetworkAclEntryList = S.Array(AwsEc2NetworkAclEntry);
export interface AwsEc2NetworkAclDetails {
  IsDefault?: boolean;
  NetworkAclId?: string;
  OwnerId?: string;
  VpcId?: string;
  Associations?: AwsEc2NetworkAclAssociation[];
  Entries?: AwsEc2NetworkAclEntry[];
}
export const AwsEc2NetworkAclDetails = S.suspend(() =>
  S.Struct({
    IsDefault: S.optional(S.Boolean),
    NetworkAclId: S.optional(S.String),
    OwnerId: S.optional(S.String),
    VpcId: S.optional(S.String),
    Associations: S.optional(AwsEc2NetworkAclAssociationList),
    Entries: S.optional(AwsEc2NetworkAclEntryList),
  }),
).annotations({
  identifier: "AwsEc2NetworkAclDetails",
}) as any as S.Schema<AwsEc2NetworkAclDetails>;
export interface AvailabilityZone {
  ZoneName?: string;
  SubnetId?: string;
}
export const AvailabilityZone = S.suspend(() =>
  S.Struct({ ZoneName: S.optional(S.String), SubnetId: S.optional(S.String) }),
).annotations({
  identifier: "AvailabilityZone",
}) as any as S.Schema<AvailabilityZone>;
export type AvailabilityZones = AvailabilityZone[];
export const AvailabilityZones = S.Array(AvailabilityZone);
export type SecurityGroups = string[];
export const SecurityGroups = S.Array(S.String);
export interface LoadBalancerState {
  Code?: string;
  Reason?: string;
}
export const LoadBalancerState = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Reason: S.optional(S.String) }),
).annotations({
  identifier: "LoadBalancerState",
}) as any as S.Schema<LoadBalancerState>;
export interface AwsElbv2LoadBalancerAttribute {
  Key?: string;
  Value?: string;
}
export const AwsElbv2LoadBalancerAttribute = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "AwsElbv2LoadBalancerAttribute",
}) as any as S.Schema<AwsElbv2LoadBalancerAttribute>;
export type AwsElbv2LoadBalancerAttributes = AwsElbv2LoadBalancerAttribute[];
export const AwsElbv2LoadBalancerAttributes = S.Array(
  AwsElbv2LoadBalancerAttribute,
);
export interface AwsElbv2LoadBalancerDetails {
  AvailabilityZones?: AvailabilityZone[];
  CanonicalHostedZoneId?: string;
  CreatedTime?: string;
  DNSName?: string;
  IpAddressType?: string;
  Scheme?: string;
  SecurityGroups?: string[];
  State?: LoadBalancerState;
  Type?: string;
  VpcId?: string;
  LoadBalancerAttributes?: AwsElbv2LoadBalancerAttribute[];
}
export const AwsElbv2LoadBalancerDetails = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    CanonicalHostedZoneId: S.optional(S.String),
    CreatedTime: S.optional(S.String),
    DNSName: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    Scheme: S.optional(S.String),
    SecurityGroups: S.optional(SecurityGroups),
    State: S.optional(LoadBalancerState),
    Type: S.optional(S.String),
    VpcId: S.optional(S.String),
    LoadBalancerAttributes: S.optional(AwsElbv2LoadBalancerAttributes),
  }),
).annotations({
  identifier: "AwsElbv2LoadBalancerDetails",
}) as any as S.Schema<AwsElbv2LoadBalancerDetails>;
export interface AwsElasticBeanstalkEnvironmentEnvironmentLink {
  EnvironmentName?: string;
  LinkName?: string;
}
export const AwsElasticBeanstalkEnvironmentEnvironmentLink = S.suspend(() =>
  S.Struct({
    EnvironmentName: S.optional(S.String),
    LinkName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElasticBeanstalkEnvironmentEnvironmentLink",
}) as any as S.Schema<AwsElasticBeanstalkEnvironmentEnvironmentLink>;
export type AwsElasticBeanstalkEnvironmentEnvironmentLinks =
  AwsElasticBeanstalkEnvironmentEnvironmentLink[];
export const AwsElasticBeanstalkEnvironmentEnvironmentLinks = S.Array(
  AwsElasticBeanstalkEnvironmentEnvironmentLink,
);
export interface AwsElasticBeanstalkEnvironmentOptionSetting {
  Namespace?: string;
  OptionName?: string;
  ResourceName?: string;
  Value?: string;
}
export const AwsElasticBeanstalkEnvironmentOptionSetting = S.suspend(() =>
  S.Struct({
    Namespace: S.optional(S.String),
    OptionName: S.optional(S.String),
    ResourceName: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElasticBeanstalkEnvironmentOptionSetting",
}) as any as S.Schema<AwsElasticBeanstalkEnvironmentOptionSetting>;
export type AwsElasticBeanstalkEnvironmentOptionSettings =
  AwsElasticBeanstalkEnvironmentOptionSetting[];
export const AwsElasticBeanstalkEnvironmentOptionSettings = S.Array(
  AwsElasticBeanstalkEnvironmentOptionSetting,
);
export interface AwsElasticBeanstalkEnvironmentTier {
  Name?: string;
  Type?: string;
  Version?: string;
}
export const AwsElasticBeanstalkEnvironmentTier = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElasticBeanstalkEnvironmentTier",
}) as any as S.Schema<AwsElasticBeanstalkEnvironmentTier>;
export interface AwsElasticBeanstalkEnvironmentDetails {
  ApplicationName?: string;
  Cname?: string;
  DateCreated?: string;
  DateUpdated?: string;
  Description?: string;
  EndpointUrl?: string;
  EnvironmentArn?: string;
  EnvironmentId?: string;
  EnvironmentLinks?: AwsElasticBeanstalkEnvironmentEnvironmentLink[];
  EnvironmentName?: string;
  OptionSettings?: AwsElasticBeanstalkEnvironmentOptionSetting[];
  PlatformArn?: string;
  SolutionStackName?: string;
  Status?: string;
  Tier?: AwsElasticBeanstalkEnvironmentTier;
  VersionLabel?: string;
}
export const AwsElasticBeanstalkEnvironmentDetails = S.suspend(() =>
  S.Struct({
    ApplicationName: S.optional(S.String),
    Cname: S.optional(S.String),
    DateCreated: S.optional(S.String),
    DateUpdated: S.optional(S.String),
    Description: S.optional(S.String),
    EndpointUrl: S.optional(S.String),
    EnvironmentArn: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    EnvironmentLinks: S.optional(
      AwsElasticBeanstalkEnvironmentEnvironmentLinks,
    ),
    EnvironmentName: S.optional(S.String),
    OptionSettings: S.optional(AwsElasticBeanstalkEnvironmentOptionSettings),
    PlatformArn: S.optional(S.String),
    SolutionStackName: S.optional(S.String),
    Status: S.optional(S.String),
    Tier: S.optional(AwsElasticBeanstalkEnvironmentTier),
    VersionLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElasticBeanstalkEnvironmentDetails",
}) as any as S.Schema<AwsElasticBeanstalkEnvironmentDetails>;
export interface AwsElasticsearchDomainDomainEndpointOptions {
  EnforceHTTPS?: boolean;
  TLSSecurityPolicy?: string;
}
export const AwsElasticsearchDomainDomainEndpointOptions = S.suspend(() =>
  S.Struct({
    EnforceHTTPS: S.optional(S.Boolean),
    TLSSecurityPolicy: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElasticsearchDomainDomainEndpointOptions",
}) as any as S.Schema<AwsElasticsearchDomainDomainEndpointOptions>;
export interface AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails {
  AvailabilityZoneCount?: number;
}
export const AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails =
  S.suspend(() =>
    S.Struct({ AvailabilityZoneCount: S.optional(S.Number) }),
  ).annotations({
    identifier:
      "AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails",
  }) as any as S.Schema<AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails>;
export interface AwsElasticsearchDomainElasticsearchClusterConfigDetails {
  DedicatedMasterCount?: number;
  DedicatedMasterEnabled?: boolean;
  DedicatedMasterType?: string;
  InstanceCount?: number;
  InstanceType?: string;
  ZoneAwarenessConfig?: AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails;
  ZoneAwarenessEnabled?: boolean;
}
export const AwsElasticsearchDomainElasticsearchClusterConfigDetails =
  S.suspend(() =>
    S.Struct({
      DedicatedMasterCount: S.optional(S.Number),
      DedicatedMasterEnabled: S.optional(S.Boolean),
      DedicatedMasterType: S.optional(S.String),
      InstanceCount: S.optional(S.Number),
      InstanceType: S.optional(S.String),
      ZoneAwarenessConfig: S.optional(
        AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails,
      ),
      ZoneAwarenessEnabled: S.optional(S.Boolean),
    }),
  ).annotations({
    identifier: "AwsElasticsearchDomainElasticsearchClusterConfigDetails",
  }) as any as S.Schema<AwsElasticsearchDomainElasticsearchClusterConfigDetails>;
export interface AwsElasticsearchDomainEncryptionAtRestOptions {
  Enabled?: boolean;
  KmsKeyId?: string;
}
export const AwsElasticsearchDomainEncryptionAtRestOptions = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean), KmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "AwsElasticsearchDomainEncryptionAtRestOptions",
}) as any as S.Schema<AwsElasticsearchDomainEncryptionAtRestOptions>;
export interface AwsElasticsearchDomainLogPublishingOptionsLogConfig {
  CloudWatchLogsLogGroupArn?: string;
  Enabled?: boolean;
}
export const AwsElasticsearchDomainLogPublishingOptionsLogConfig = S.suspend(
  () =>
    S.Struct({
      CloudWatchLogsLogGroupArn: S.optional(S.String),
      Enabled: S.optional(S.Boolean),
    }),
).annotations({
  identifier: "AwsElasticsearchDomainLogPublishingOptionsLogConfig",
}) as any as S.Schema<AwsElasticsearchDomainLogPublishingOptionsLogConfig>;
export interface AwsElasticsearchDomainLogPublishingOptions {
  IndexSlowLogs?: AwsElasticsearchDomainLogPublishingOptionsLogConfig;
  SearchSlowLogs?: AwsElasticsearchDomainLogPublishingOptionsLogConfig;
  AuditLogs?: AwsElasticsearchDomainLogPublishingOptionsLogConfig;
}
export const AwsElasticsearchDomainLogPublishingOptions = S.suspend(() =>
  S.Struct({
    IndexSlowLogs: S.optional(
      AwsElasticsearchDomainLogPublishingOptionsLogConfig,
    ),
    SearchSlowLogs: S.optional(
      AwsElasticsearchDomainLogPublishingOptionsLogConfig,
    ),
    AuditLogs: S.optional(AwsElasticsearchDomainLogPublishingOptionsLogConfig),
  }),
).annotations({
  identifier: "AwsElasticsearchDomainLogPublishingOptions",
}) as any as S.Schema<AwsElasticsearchDomainLogPublishingOptions>;
export interface AwsElasticsearchDomainNodeToNodeEncryptionOptions {
  Enabled?: boolean;
}
export const AwsElasticsearchDomainNodeToNodeEncryptionOptions = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AwsElasticsearchDomainNodeToNodeEncryptionOptions",
}) as any as S.Schema<AwsElasticsearchDomainNodeToNodeEncryptionOptions>;
export interface AwsElasticsearchDomainServiceSoftwareOptions {
  AutomatedUpdateDate?: string;
  Cancellable?: boolean;
  CurrentVersion?: string;
  Description?: string;
  NewVersion?: string;
  UpdateAvailable?: boolean;
  UpdateStatus?: string;
}
export const AwsElasticsearchDomainServiceSoftwareOptions = S.suspend(() =>
  S.Struct({
    AutomatedUpdateDate: S.optional(S.String),
    Cancellable: S.optional(S.Boolean),
    CurrentVersion: S.optional(S.String),
    Description: S.optional(S.String),
    NewVersion: S.optional(S.String),
    UpdateAvailable: S.optional(S.Boolean),
    UpdateStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElasticsearchDomainServiceSoftwareOptions",
}) as any as S.Schema<AwsElasticsearchDomainServiceSoftwareOptions>;
export interface AwsElasticsearchDomainVPCOptions {
  AvailabilityZones?: string[];
  SecurityGroupIds?: string[];
  SubnetIds?: string[];
  VPCId?: string;
}
export const AwsElasticsearchDomainVPCOptions = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(NonEmptyStringList),
    SecurityGroupIds: S.optional(NonEmptyStringList),
    SubnetIds: S.optional(NonEmptyStringList),
    VPCId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElasticsearchDomainVPCOptions",
}) as any as S.Schema<AwsElasticsearchDomainVPCOptions>;
export interface AwsElasticsearchDomainDetails {
  AccessPolicies?: string;
  DomainEndpointOptions?: AwsElasticsearchDomainDomainEndpointOptions;
  DomainId?: string;
  DomainName?: string;
  Endpoint?: string;
  Endpoints?: { [key: string]: string | undefined };
  ElasticsearchVersion?: string;
  ElasticsearchClusterConfig?: AwsElasticsearchDomainElasticsearchClusterConfigDetails;
  EncryptionAtRestOptions?: AwsElasticsearchDomainEncryptionAtRestOptions;
  LogPublishingOptions?: AwsElasticsearchDomainLogPublishingOptions;
  NodeToNodeEncryptionOptions?: AwsElasticsearchDomainNodeToNodeEncryptionOptions;
  ServiceSoftwareOptions?: AwsElasticsearchDomainServiceSoftwareOptions;
  VPCOptions?: AwsElasticsearchDomainVPCOptions;
}
export const AwsElasticsearchDomainDetails = S.suspend(() =>
  S.Struct({
    AccessPolicies: S.optional(S.String),
    DomainEndpointOptions: S.optional(
      AwsElasticsearchDomainDomainEndpointOptions,
    ),
    DomainId: S.optional(S.String),
    DomainName: S.optional(S.String),
    Endpoint: S.optional(S.String),
    Endpoints: S.optional(FieldMap),
    ElasticsearchVersion: S.optional(S.String),
    ElasticsearchClusterConfig: S.optional(
      AwsElasticsearchDomainElasticsearchClusterConfigDetails,
    ),
    EncryptionAtRestOptions: S.optional(
      AwsElasticsearchDomainEncryptionAtRestOptions,
    ),
    LogPublishingOptions: S.optional(
      AwsElasticsearchDomainLogPublishingOptions,
    ),
    NodeToNodeEncryptionOptions: S.optional(
      AwsElasticsearchDomainNodeToNodeEncryptionOptions,
    ),
    ServiceSoftwareOptions: S.optional(
      AwsElasticsearchDomainServiceSoftwareOptions,
    ),
    VPCOptions: S.optional(AwsElasticsearchDomainVPCOptions),
  }),
).annotations({
  identifier: "AwsElasticsearchDomainDetails",
}) as any as S.Schema<AwsElasticsearchDomainDetails>;
export interface AwsS3BucketServerSideEncryptionByDefault {
  SSEAlgorithm?: string;
  KMSMasterKeyID?: string;
}
export const AwsS3BucketServerSideEncryptionByDefault = S.suspend(() =>
  S.Struct({
    SSEAlgorithm: S.optional(S.String),
    KMSMasterKeyID: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsS3BucketServerSideEncryptionByDefault",
}) as any as S.Schema<AwsS3BucketServerSideEncryptionByDefault>;
export interface AwsS3BucketServerSideEncryptionRule {
  ApplyServerSideEncryptionByDefault?: AwsS3BucketServerSideEncryptionByDefault;
}
export const AwsS3BucketServerSideEncryptionRule = S.suspend(() =>
  S.Struct({
    ApplyServerSideEncryptionByDefault: S.optional(
      AwsS3BucketServerSideEncryptionByDefault,
    ),
  }),
).annotations({
  identifier: "AwsS3BucketServerSideEncryptionRule",
}) as any as S.Schema<AwsS3BucketServerSideEncryptionRule>;
export type AwsS3BucketServerSideEncryptionRules =
  AwsS3BucketServerSideEncryptionRule[];
export const AwsS3BucketServerSideEncryptionRules = S.Array(
  AwsS3BucketServerSideEncryptionRule,
);
export interface AwsS3BucketServerSideEncryptionConfiguration {
  Rules?: AwsS3BucketServerSideEncryptionRule[];
}
export const AwsS3BucketServerSideEncryptionConfiguration = S.suspend(() =>
  S.Struct({ Rules: S.optional(AwsS3BucketServerSideEncryptionRules) }),
).annotations({
  identifier: "AwsS3BucketServerSideEncryptionConfiguration",
}) as any as S.Schema<AwsS3BucketServerSideEncryptionConfiguration>;
export interface AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails {
  DaysAfterInitiation?: number;
}
export const AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails =
  S.suspend(() =>
    S.Struct({ DaysAfterInitiation: S.optional(S.Number) }),
  ).annotations({
    identifier:
      "AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails",
  }) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails>;
export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails {
  Key?: string;
  Value?: string;
}
export const AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails =
  S.suspend(() =>
    S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails",
  }) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails>;
export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails {
  Prefix?: string;
  Tag?: AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails;
  Type?: string;
}
export const AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails =
  S.suspend(() =>
    S.Struct({
      Prefix: S.optional(S.String),
      Tag: S.optional(
        AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails,
      ),
      Type: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails",
  }) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails>;
export type AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsList =
  AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails[];
export const AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsList =
  S.Array(
    AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails,
  );
export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails {
  Key?: string;
  Value?: string;
}
export const AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails =
  S.suspend(() =>
    S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails",
  }) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails>;
export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails {
  Operands?: AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails[];
  Prefix?: string;
  Tag?: AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails;
  Type?: string;
}
export const AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails =
  S.suspend(() =>
    S.Struct({
      Operands: S.optional(
        AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsList,
      ),
      Prefix: S.optional(S.String),
      Tag: S.optional(
        AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails,
      ),
      Type: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails",
  }) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails>;
export interface AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails {
  Predicate?: AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails;
}
export const AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails =
  S.suspend(() =>
    S.Struct({
      Predicate: S.optional(
        AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails,
      ),
    }),
  ).annotations({
    identifier: "AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails",
  }) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails>;
export interface AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails {
  Days?: number;
  StorageClass?: string;
}
export const AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails =
  S.suspend(() =>
    S.Struct({
      Days: S.optional(S.Number),
      StorageClass: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails",
  }) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails>;
export type AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsList =
  AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails[];
export const AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsList =
  S.Array(
    AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails,
  );
export interface AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails {
  Date?: string;
  Days?: number;
  StorageClass?: string;
}
export const AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails =
  S.suspend(() =>
    S.Struct({
      Date: S.optional(S.String),
      Days: S.optional(S.Number),
      StorageClass: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails",
  }) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails>;
export type AwsS3BucketBucketLifecycleConfigurationRulesTransitionsList =
  AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails[];
export const AwsS3BucketBucketLifecycleConfigurationRulesTransitionsList =
  S.Array(AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails);
export interface AwsS3BucketBucketLifecycleConfigurationRulesDetails {
  AbortIncompleteMultipartUpload?: AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails;
  ExpirationDate?: string;
  ExpirationInDays?: number;
  ExpiredObjectDeleteMarker?: boolean;
  Filter?: AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails;
  ID?: string;
  NoncurrentVersionExpirationInDays?: number;
  NoncurrentVersionTransitions?: AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails[];
  Prefix?: string;
  Status?: string;
  Transitions?: AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails[];
}
export const AwsS3BucketBucketLifecycleConfigurationRulesDetails = S.suspend(
  () =>
    S.Struct({
      AbortIncompleteMultipartUpload: S.optional(
        AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails,
      ),
      ExpirationDate: S.optional(S.String),
      ExpirationInDays: S.optional(S.Number),
      ExpiredObjectDeleteMarker: S.optional(S.Boolean),
      Filter: S.optional(
        AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails,
      ),
      ID: S.optional(S.String),
      NoncurrentVersionExpirationInDays: S.optional(S.Number),
      NoncurrentVersionTransitions: S.optional(
        AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsList,
      ),
      Prefix: S.optional(S.String),
      Status: S.optional(S.String),
      Transitions: S.optional(
        AwsS3BucketBucketLifecycleConfigurationRulesTransitionsList,
      ),
    }),
).annotations({
  identifier: "AwsS3BucketBucketLifecycleConfigurationRulesDetails",
}) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationRulesDetails>;
export type AwsS3BucketBucketLifecycleConfigurationRulesList =
  AwsS3BucketBucketLifecycleConfigurationRulesDetails[];
export const AwsS3BucketBucketLifecycleConfigurationRulesList = S.Array(
  AwsS3BucketBucketLifecycleConfigurationRulesDetails,
);
export interface AwsS3BucketBucketLifecycleConfigurationDetails {
  Rules?: AwsS3BucketBucketLifecycleConfigurationRulesDetails[];
}
export const AwsS3BucketBucketLifecycleConfigurationDetails = S.suspend(() =>
  S.Struct({
    Rules: S.optional(AwsS3BucketBucketLifecycleConfigurationRulesList),
  }),
).annotations({
  identifier: "AwsS3BucketBucketLifecycleConfigurationDetails",
}) as any as S.Schema<AwsS3BucketBucketLifecycleConfigurationDetails>;
export interface AwsS3AccountPublicAccessBlockDetails {
  BlockPublicAcls?: boolean;
  BlockPublicPolicy?: boolean;
  IgnorePublicAcls?: boolean;
  RestrictPublicBuckets?: boolean;
}
export const AwsS3AccountPublicAccessBlockDetails = S.suspend(() =>
  S.Struct({
    BlockPublicAcls: S.optional(S.Boolean),
    BlockPublicPolicy: S.optional(S.Boolean),
    IgnorePublicAcls: S.optional(S.Boolean),
    RestrictPublicBuckets: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsS3AccountPublicAccessBlockDetails",
}) as any as S.Schema<AwsS3AccountPublicAccessBlockDetails>;
export interface AwsS3BucketLoggingConfiguration {
  DestinationBucketName?: string;
  LogFilePrefix?: string;
}
export const AwsS3BucketLoggingConfiguration = S.suspend(() =>
  S.Struct({
    DestinationBucketName: S.optional(S.String),
    LogFilePrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsS3BucketLoggingConfiguration",
}) as any as S.Schema<AwsS3BucketLoggingConfiguration>;
export interface AwsS3BucketWebsiteConfigurationRedirectTo {
  Hostname?: string;
  Protocol?: string;
}
export const AwsS3BucketWebsiteConfigurationRedirectTo = S.suspend(() =>
  S.Struct({ Hostname: S.optional(S.String), Protocol: S.optional(S.String) }),
).annotations({
  identifier: "AwsS3BucketWebsiteConfigurationRedirectTo",
}) as any as S.Schema<AwsS3BucketWebsiteConfigurationRedirectTo>;
export interface AwsS3BucketWebsiteConfigurationRoutingRuleCondition {
  HttpErrorCodeReturnedEquals?: string;
  KeyPrefixEquals?: string;
}
export const AwsS3BucketWebsiteConfigurationRoutingRuleCondition = S.suspend(
  () =>
    S.Struct({
      HttpErrorCodeReturnedEquals: S.optional(S.String),
      KeyPrefixEquals: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsS3BucketWebsiteConfigurationRoutingRuleCondition",
}) as any as S.Schema<AwsS3BucketWebsiteConfigurationRoutingRuleCondition>;
export interface AwsS3BucketWebsiteConfigurationRoutingRuleRedirect {
  Hostname?: string;
  HttpRedirectCode?: string;
  Protocol?: string;
  ReplaceKeyPrefixWith?: string;
  ReplaceKeyWith?: string;
}
export const AwsS3BucketWebsiteConfigurationRoutingRuleRedirect = S.suspend(
  () =>
    S.Struct({
      Hostname: S.optional(S.String),
      HttpRedirectCode: S.optional(S.String),
      Protocol: S.optional(S.String),
      ReplaceKeyPrefixWith: S.optional(S.String),
      ReplaceKeyWith: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsS3BucketWebsiteConfigurationRoutingRuleRedirect",
}) as any as S.Schema<AwsS3BucketWebsiteConfigurationRoutingRuleRedirect>;
export interface AwsS3BucketWebsiteConfigurationRoutingRule {
  Condition?: AwsS3BucketWebsiteConfigurationRoutingRuleCondition;
  Redirect?: AwsS3BucketWebsiteConfigurationRoutingRuleRedirect;
}
export const AwsS3BucketWebsiteConfigurationRoutingRule = S.suspend(() =>
  S.Struct({
    Condition: S.optional(AwsS3BucketWebsiteConfigurationRoutingRuleCondition),
    Redirect: S.optional(AwsS3BucketWebsiteConfigurationRoutingRuleRedirect),
  }),
).annotations({
  identifier: "AwsS3BucketWebsiteConfigurationRoutingRule",
}) as any as S.Schema<AwsS3BucketWebsiteConfigurationRoutingRule>;
export type AwsS3BucketWebsiteConfigurationRoutingRules =
  AwsS3BucketWebsiteConfigurationRoutingRule[];
export const AwsS3BucketWebsiteConfigurationRoutingRules = S.Array(
  AwsS3BucketWebsiteConfigurationRoutingRule,
);
export interface AwsS3BucketWebsiteConfiguration {
  ErrorDocument?: string;
  IndexDocumentSuffix?: string;
  RedirectAllRequestsTo?: AwsS3BucketWebsiteConfigurationRedirectTo;
  RoutingRules?: AwsS3BucketWebsiteConfigurationRoutingRule[];
}
export const AwsS3BucketWebsiteConfiguration = S.suspend(() =>
  S.Struct({
    ErrorDocument: S.optional(S.String),
    IndexDocumentSuffix: S.optional(S.String),
    RedirectAllRequestsTo: S.optional(
      AwsS3BucketWebsiteConfigurationRedirectTo,
    ),
    RoutingRules: S.optional(AwsS3BucketWebsiteConfigurationRoutingRules),
  }),
).annotations({
  identifier: "AwsS3BucketWebsiteConfiguration",
}) as any as S.Schema<AwsS3BucketWebsiteConfiguration>;
export type AwsS3BucketNotificationConfigurationEvents = string[];
export const AwsS3BucketNotificationConfigurationEvents = S.Array(S.String);
export type AwsS3BucketNotificationConfigurationS3KeyFilterRuleName =
  | "Prefix"
  | "Suffix"
  | (string & {});
export const AwsS3BucketNotificationConfigurationS3KeyFilterRuleName = S.String;
export interface AwsS3BucketNotificationConfigurationS3KeyFilterRule {
  Name?: AwsS3BucketNotificationConfigurationS3KeyFilterRuleName;
  Value?: string;
}
export const AwsS3BucketNotificationConfigurationS3KeyFilterRule = S.suspend(
  () =>
    S.Struct({
      Name: S.optional(AwsS3BucketNotificationConfigurationS3KeyFilterRuleName),
      Value: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsS3BucketNotificationConfigurationS3KeyFilterRule",
}) as any as S.Schema<AwsS3BucketNotificationConfigurationS3KeyFilterRule>;
export type AwsS3BucketNotificationConfigurationS3KeyFilterRules =
  AwsS3BucketNotificationConfigurationS3KeyFilterRule[];
export const AwsS3BucketNotificationConfigurationS3KeyFilterRules = S.Array(
  AwsS3BucketNotificationConfigurationS3KeyFilterRule,
);
export interface AwsS3BucketNotificationConfigurationS3KeyFilter {
  FilterRules?: AwsS3BucketNotificationConfigurationS3KeyFilterRule[];
}
export const AwsS3BucketNotificationConfigurationS3KeyFilter = S.suspend(() =>
  S.Struct({
    FilterRules: S.optional(
      AwsS3BucketNotificationConfigurationS3KeyFilterRules,
    ),
  }),
).annotations({
  identifier: "AwsS3BucketNotificationConfigurationS3KeyFilter",
}) as any as S.Schema<AwsS3BucketNotificationConfigurationS3KeyFilter>;
export interface AwsS3BucketNotificationConfigurationFilter {
  S3KeyFilter?: AwsS3BucketNotificationConfigurationS3KeyFilter;
}
export const AwsS3BucketNotificationConfigurationFilter = S.suspend(() =>
  S.Struct({
    S3KeyFilter: S.optional(AwsS3BucketNotificationConfigurationS3KeyFilter),
  }),
).annotations({
  identifier: "AwsS3BucketNotificationConfigurationFilter",
}) as any as S.Schema<AwsS3BucketNotificationConfigurationFilter>;
export interface AwsS3BucketNotificationConfigurationDetail {
  Events?: string[];
  Filter?: AwsS3BucketNotificationConfigurationFilter;
  Destination?: string;
  Type?: string;
}
export const AwsS3BucketNotificationConfigurationDetail = S.suspend(() =>
  S.Struct({
    Events: S.optional(AwsS3BucketNotificationConfigurationEvents),
    Filter: S.optional(AwsS3BucketNotificationConfigurationFilter),
    Destination: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsS3BucketNotificationConfigurationDetail",
}) as any as S.Schema<AwsS3BucketNotificationConfigurationDetail>;
export type AwsS3BucketNotificationConfigurationDetails =
  AwsS3BucketNotificationConfigurationDetail[];
export const AwsS3BucketNotificationConfigurationDetails = S.Array(
  AwsS3BucketNotificationConfigurationDetail,
);
export interface AwsS3BucketNotificationConfiguration {
  Configurations?: AwsS3BucketNotificationConfigurationDetail[];
}
export const AwsS3BucketNotificationConfiguration = S.suspend(() =>
  S.Struct({
    Configurations: S.optional(AwsS3BucketNotificationConfigurationDetails),
  }),
).annotations({
  identifier: "AwsS3BucketNotificationConfiguration",
}) as any as S.Schema<AwsS3BucketNotificationConfiguration>;
export interface AwsS3BucketBucketVersioningConfiguration {
  IsMfaDeleteEnabled?: boolean;
  Status?: string;
}
export const AwsS3BucketBucketVersioningConfiguration = S.suspend(() =>
  S.Struct({
    IsMfaDeleteEnabled: S.optional(S.Boolean),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsS3BucketBucketVersioningConfiguration",
}) as any as S.Schema<AwsS3BucketBucketVersioningConfiguration>;
export interface AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails {
  Days?: number;
  Mode?: string;
  Years?: number;
}
export const AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails =
  S.suspend(() =>
    S.Struct({
      Days: S.optional(S.Number),
      Mode: S.optional(S.String),
      Years: S.optional(S.Number),
    }),
  ).annotations({
    identifier: "AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails",
  }) as any as S.Schema<AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails>;
export interface AwsS3BucketObjectLockConfigurationRuleDetails {
  DefaultRetention?: AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails;
}
export const AwsS3BucketObjectLockConfigurationRuleDetails = S.suspend(() =>
  S.Struct({
    DefaultRetention: S.optional(
      AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails,
    ),
  }),
).annotations({
  identifier: "AwsS3BucketObjectLockConfigurationRuleDetails",
}) as any as S.Schema<AwsS3BucketObjectLockConfigurationRuleDetails>;
export interface AwsS3BucketObjectLockConfiguration {
  ObjectLockEnabled?: string;
  Rule?: AwsS3BucketObjectLockConfigurationRuleDetails;
}
export const AwsS3BucketObjectLockConfiguration = S.suspend(() =>
  S.Struct({
    ObjectLockEnabled: S.optional(S.String),
    Rule: S.optional(AwsS3BucketObjectLockConfigurationRuleDetails),
  }),
).annotations({
  identifier: "AwsS3BucketObjectLockConfiguration",
}) as any as S.Schema<AwsS3BucketObjectLockConfiguration>;
export interface AwsS3BucketDetails {
  OwnerId?: string;
  OwnerName?: string;
  OwnerAccountId?: string;
  CreatedAt?: string;
  ServerSideEncryptionConfiguration?: AwsS3BucketServerSideEncryptionConfiguration;
  BucketLifecycleConfiguration?: AwsS3BucketBucketLifecycleConfigurationDetails;
  PublicAccessBlockConfiguration?: AwsS3AccountPublicAccessBlockDetails;
  AccessControlList?: string;
  BucketLoggingConfiguration?: AwsS3BucketLoggingConfiguration;
  BucketWebsiteConfiguration?: AwsS3BucketWebsiteConfiguration;
  BucketNotificationConfiguration?: AwsS3BucketNotificationConfiguration;
  BucketVersioningConfiguration?: AwsS3BucketBucketVersioningConfiguration;
  ObjectLockConfiguration?: AwsS3BucketObjectLockConfiguration;
  Name?: string;
}
export const AwsS3BucketDetails = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    OwnerName: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedAt: S.optional(S.String),
    ServerSideEncryptionConfiguration: S.optional(
      AwsS3BucketServerSideEncryptionConfiguration,
    ),
    BucketLifecycleConfiguration: S.optional(
      AwsS3BucketBucketLifecycleConfigurationDetails,
    ),
    PublicAccessBlockConfiguration: S.optional(
      AwsS3AccountPublicAccessBlockDetails,
    ),
    AccessControlList: S.optional(S.String),
    BucketLoggingConfiguration: S.optional(AwsS3BucketLoggingConfiguration),
    BucketWebsiteConfiguration: S.optional(AwsS3BucketWebsiteConfiguration),
    BucketNotificationConfiguration: S.optional(
      AwsS3BucketNotificationConfiguration,
    ),
    BucketVersioningConfiguration: S.optional(
      AwsS3BucketBucketVersioningConfiguration,
    ),
    ObjectLockConfiguration: S.optional(AwsS3BucketObjectLockConfiguration),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsS3BucketDetails",
}) as any as S.Schema<AwsS3BucketDetails>;
export interface AwsS3ObjectDetails {
  LastModified?: string;
  ETag?: string;
  VersionId?: string;
  ContentType?: string;
  ServerSideEncryption?: string;
  SSEKMSKeyId?: string;
}
export const AwsS3ObjectDetails = S.suspend(() =>
  S.Struct({
    LastModified: S.optional(S.String),
    ETag: S.optional(S.String),
    VersionId: S.optional(S.String),
    ContentType: S.optional(S.String),
    ServerSideEncryption: S.optional(S.String),
    SSEKMSKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsS3ObjectDetails",
}) as any as S.Schema<AwsS3ObjectDetails>;
export interface AwsSecretsManagerSecretRotationRules {
  AutomaticallyAfterDays?: number;
}
export const AwsSecretsManagerSecretRotationRules = S.suspend(() =>
  S.Struct({ AutomaticallyAfterDays: S.optional(S.Number) }),
).annotations({
  identifier: "AwsSecretsManagerSecretRotationRules",
}) as any as S.Schema<AwsSecretsManagerSecretRotationRules>;
export interface AwsSecretsManagerSecretDetails {
  RotationRules?: AwsSecretsManagerSecretRotationRules;
  RotationOccurredWithinFrequency?: boolean;
  KmsKeyId?: string;
  RotationEnabled?: boolean;
  RotationLambdaArn?: string;
  Deleted?: boolean;
  Name?: string;
  Description?: string;
}
export const AwsSecretsManagerSecretDetails = S.suspend(() =>
  S.Struct({
    RotationRules: S.optional(AwsSecretsManagerSecretRotationRules),
    RotationOccurredWithinFrequency: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    RotationEnabled: S.optional(S.Boolean),
    RotationLambdaArn: S.optional(S.String),
    Deleted: S.optional(S.Boolean),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsSecretsManagerSecretDetails",
}) as any as S.Schema<AwsSecretsManagerSecretDetails>;
export type AwsIamAccessKeyStatus = "Active" | "Inactive" | (string & {});
export const AwsIamAccessKeyStatus = S.String;
export interface AwsIamAccessKeySessionContextAttributes {
  MfaAuthenticated?: boolean;
  CreationDate?: string;
}
export const AwsIamAccessKeySessionContextAttributes = S.suspend(() =>
  S.Struct({
    MfaAuthenticated: S.optional(S.Boolean),
    CreationDate: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsIamAccessKeySessionContextAttributes",
}) as any as S.Schema<AwsIamAccessKeySessionContextAttributes>;
export interface AwsIamAccessKeySessionContextSessionIssuer {
  Type?: string;
  PrincipalId?: string;
  Arn?: string;
  AccountId?: string;
  UserName?: string;
}
export const AwsIamAccessKeySessionContextSessionIssuer = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    PrincipalId: S.optional(S.String),
    Arn: S.optional(S.String),
    AccountId: S.optional(S.String),
    UserName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsIamAccessKeySessionContextSessionIssuer",
}) as any as S.Schema<AwsIamAccessKeySessionContextSessionIssuer>;
export interface AwsIamAccessKeySessionContext {
  Attributes?: AwsIamAccessKeySessionContextAttributes;
  SessionIssuer?: AwsIamAccessKeySessionContextSessionIssuer;
}
export const AwsIamAccessKeySessionContext = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(AwsIamAccessKeySessionContextAttributes),
    SessionIssuer: S.optional(AwsIamAccessKeySessionContextSessionIssuer),
  }),
).annotations({
  identifier: "AwsIamAccessKeySessionContext",
}) as any as S.Schema<AwsIamAccessKeySessionContext>;
export interface AwsIamAccessKeyDetails {
  UserName?: string;
  Status?: AwsIamAccessKeyStatus;
  CreatedAt?: string;
  PrincipalId?: string;
  PrincipalType?: string;
  PrincipalName?: string;
  AccountId?: string;
  AccessKeyId?: string;
  SessionContext?: AwsIamAccessKeySessionContext;
}
export const AwsIamAccessKeyDetails = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    Status: S.optional(AwsIamAccessKeyStatus),
    CreatedAt: S.optional(S.String),
    PrincipalId: S.optional(S.String),
    PrincipalType: S.optional(S.String),
    PrincipalName: S.optional(S.String),
    AccountId: S.optional(S.String),
    AccessKeyId: S.optional(S.String),
    SessionContext: S.optional(AwsIamAccessKeySessionContext),
  }),
).annotations({
  identifier: "AwsIamAccessKeyDetails",
}) as any as S.Schema<AwsIamAccessKeyDetails>;
export interface AwsIamAttachedManagedPolicy {
  PolicyName?: string;
  PolicyArn?: string;
}
export const AwsIamAttachedManagedPolicy = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    PolicyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsIamAttachedManagedPolicy",
}) as any as S.Schema<AwsIamAttachedManagedPolicy>;
export type AwsIamAttachedManagedPolicyList = AwsIamAttachedManagedPolicy[];
export const AwsIamAttachedManagedPolicyList = S.Array(
  AwsIamAttachedManagedPolicy,
);
export interface AwsIamPermissionsBoundary {
  PermissionsBoundaryArn?: string;
  PermissionsBoundaryType?: string;
}
export const AwsIamPermissionsBoundary = S.suspend(() =>
  S.Struct({
    PermissionsBoundaryArn: S.optional(S.String),
    PermissionsBoundaryType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsIamPermissionsBoundary",
}) as any as S.Schema<AwsIamPermissionsBoundary>;
export interface AwsIamUserPolicy {
  PolicyName?: string;
}
export const AwsIamUserPolicy = S.suspend(() =>
  S.Struct({ PolicyName: S.optional(S.String) }),
).annotations({
  identifier: "AwsIamUserPolicy",
}) as any as S.Schema<AwsIamUserPolicy>;
export type AwsIamUserPolicyList = AwsIamUserPolicy[];
export const AwsIamUserPolicyList = S.Array(AwsIamUserPolicy);
export interface AwsIamUserDetails {
  AttachedManagedPolicies?: AwsIamAttachedManagedPolicy[];
  CreateDate?: string;
  GroupList?: string[];
  Path?: string;
  PermissionsBoundary?: AwsIamPermissionsBoundary;
  UserId?: string;
  UserName?: string;
  UserPolicyList?: AwsIamUserPolicy[];
}
export const AwsIamUserDetails = S.suspend(() =>
  S.Struct({
    AttachedManagedPolicies: S.optional(AwsIamAttachedManagedPolicyList),
    CreateDate: S.optional(S.String),
    GroupList: S.optional(StringList),
    Path: S.optional(S.String),
    PermissionsBoundary: S.optional(AwsIamPermissionsBoundary),
    UserId: S.optional(S.String),
    UserName: S.optional(S.String),
    UserPolicyList: S.optional(AwsIamUserPolicyList),
  }),
).annotations({
  identifier: "AwsIamUserDetails",
}) as any as S.Schema<AwsIamUserDetails>;
export interface AwsIamPolicyVersion {
  VersionId?: string;
  IsDefaultVersion?: boolean;
  CreateDate?: string;
}
export const AwsIamPolicyVersion = S.suspend(() =>
  S.Struct({
    VersionId: S.optional(S.String),
    IsDefaultVersion: S.optional(S.Boolean),
    CreateDate: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsIamPolicyVersion",
}) as any as S.Schema<AwsIamPolicyVersion>;
export type AwsIamPolicyVersionList = AwsIamPolicyVersion[];
export const AwsIamPolicyVersionList = S.Array(AwsIamPolicyVersion);
export interface AwsIamPolicyDetails {
  AttachmentCount?: number;
  CreateDate?: string;
  DefaultVersionId?: string;
  Description?: string;
  IsAttachable?: boolean;
  Path?: string;
  PermissionsBoundaryUsageCount?: number;
  PolicyId?: string;
  PolicyName?: string;
  PolicyVersionList?: AwsIamPolicyVersion[];
  UpdateDate?: string;
}
export const AwsIamPolicyDetails = S.suspend(() =>
  S.Struct({
    AttachmentCount: S.optional(S.Number),
    CreateDate: S.optional(S.String),
    DefaultVersionId: S.optional(S.String),
    Description: S.optional(S.String),
    IsAttachable: S.optional(S.Boolean),
    Path: S.optional(S.String),
    PermissionsBoundaryUsageCount: S.optional(S.Number),
    PolicyId: S.optional(S.String),
    PolicyName: S.optional(S.String),
    PolicyVersionList: S.optional(AwsIamPolicyVersionList),
    UpdateDate: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsIamPolicyDetails",
}) as any as S.Schema<AwsIamPolicyDetails>;
export interface AwsApiGatewayV2RouteSettings {
  DetailedMetricsEnabled?: boolean;
  LoggingLevel?: string;
  DataTraceEnabled?: boolean;
  ThrottlingBurstLimit?: number;
  ThrottlingRateLimit?: number;
}
export const AwsApiGatewayV2RouteSettings = S.suspend(() =>
  S.Struct({
    DetailedMetricsEnabled: S.optional(S.Boolean),
    LoggingLevel: S.optional(S.String),
    DataTraceEnabled: S.optional(S.Boolean),
    ThrottlingBurstLimit: S.optional(S.Number),
    ThrottlingRateLimit: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsApiGatewayV2RouteSettings",
}) as any as S.Schema<AwsApiGatewayV2RouteSettings>;
export interface AwsApiGatewayAccessLogSettings {
  Format?: string;
  DestinationArn?: string;
}
export const AwsApiGatewayAccessLogSettings = S.suspend(() =>
  S.Struct({
    Format: S.optional(S.String),
    DestinationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsApiGatewayAccessLogSettings",
}) as any as S.Schema<AwsApiGatewayAccessLogSettings>;
export interface AwsApiGatewayV2StageDetails {
  ClientCertificateId?: string;
  CreatedDate?: string;
  Description?: string;
  DefaultRouteSettings?: AwsApiGatewayV2RouteSettings;
  DeploymentId?: string;
  LastUpdatedDate?: string;
  RouteSettings?: AwsApiGatewayV2RouteSettings;
  StageName?: string;
  StageVariables?: { [key: string]: string | undefined };
  AccessLogSettings?: AwsApiGatewayAccessLogSettings;
  AutoDeploy?: boolean;
  LastDeploymentStatusMessage?: string;
  ApiGatewayManaged?: boolean;
}
export const AwsApiGatewayV2StageDetails = S.suspend(() =>
  S.Struct({
    ClientCertificateId: S.optional(S.String),
    CreatedDate: S.optional(S.String),
    Description: S.optional(S.String),
    DefaultRouteSettings: S.optional(AwsApiGatewayV2RouteSettings),
    DeploymentId: S.optional(S.String),
    LastUpdatedDate: S.optional(S.String),
    RouteSettings: S.optional(AwsApiGatewayV2RouteSettings),
    StageName: S.optional(S.String),
    StageVariables: S.optional(FieldMap),
    AccessLogSettings: S.optional(AwsApiGatewayAccessLogSettings),
    AutoDeploy: S.optional(S.Boolean),
    LastDeploymentStatusMessage: S.optional(S.String),
    ApiGatewayManaged: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsApiGatewayV2StageDetails",
}) as any as S.Schema<AwsApiGatewayV2StageDetails>;
export interface AwsCorsConfiguration {
  AllowOrigins?: string[];
  AllowCredentials?: boolean;
  ExposeHeaders?: string[];
  MaxAge?: number;
  AllowMethods?: string[];
  AllowHeaders?: string[];
}
export const AwsCorsConfiguration = S.suspend(() =>
  S.Struct({
    AllowOrigins: S.optional(NonEmptyStringList),
    AllowCredentials: S.optional(S.Boolean),
    ExposeHeaders: S.optional(NonEmptyStringList),
    MaxAge: S.optional(S.Number),
    AllowMethods: S.optional(NonEmptyStringList),
    AllowHeaders: S.optional(NonEmptyStringList),
  }),
).annotations({
  identifier: "AwsCorsConfiguration",
}) as any as S.Schema<AwsCorsConfiguration>;
export interface AwsApiGatewayV2ApiDetails {
  ApiEndpoint?: string;
  ApiId?: string;
  ApiKeySelectionExpression?: string;
  CreatedDate?: string;
  Description?: string;
  Version?: string;
  Name?: string;
  ProtocolType?: string;
  RouteSelectionExpression?: string;
  CorsConfiguration?: AwsCorsConfiguration;
}
export const AwsApiGatewayV2ApiDetails = S.suspend(() =>
  S.Struct({
    ApiEndpoint: S.optional(S.String),
    ApiId: S.optional(S.String),
    ApiKeySelectionExpression: S.optional(S.String),
    CreatedDate: S.optional(S.String),
    Description: S.optional(S.String),
    Version: S.optional(S.String),
    Name: S.optional(S.String),
    ProtocolType: S.optional(S.String),
    RouteSelectionExpression: S.optional(S.String),
    CorsConfiguration: S.optional(AwsCorsConfiguration),
  }),
).annotations({
  identifier: "AwsApiGatewayV2ApiDetails",
}) as any as S.Schema<AwsApiGatewayV2ApiDetails>;
export interface AwsDynamoDbTableAttributeDefinition {
  AttributeName?: string;
  AttributeType?: string;
}
export const AwsDynamoDbTableAttributeDefinition = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    AttributeType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsDynamoDbTableAttributeDefinition",
}) as any as S.Schema<AwsDynamoDbTableAttributeDefinition>;
export type AwsDynamoDbTableAttributeDefinitionList =
  AwsDynamoDbTableAttributeDefinition[];
export const AwsDynamoDbTableAttributeDefinitionList = S.Array(
  AwsDynamoDbTableAttributeDefinition,
);
export interface AwsDynamoDbTableBillingModeSummary {
  BillingMode?: string;
  LastUpdateToPayPerRequestDateTime?: string;
}
export const AwsDynamoDbTableBillingModeSummary = S.suspend(() =>
  S.Struct({
    BillingMode: S.optional(S.String),
    LastUpdateToPayPerRequestDateTime: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsDynamoDbTableBillingModeSummary",
}) as any as S.Schema<AwsDynamoDbTableBillingModeSummary>;
export interface AwsDynamoDbTableKeySchema {
  AttributeName?: string;
  KeyType?: string;
}
export const AwsDynamoDbTableKeySchema = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    KeyType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsDynamoDbTableKeySchema",
}) as any as S.Schema<AwsDynamoDbTableKeySchema>;
export type AwsDynamoDbTableKeySchemaList = AwsDynamoDbTableKeySchema[];
export const AwsDynamoDbTableKeySchemaList = S.Array(AwsDynamoDbTableKeySchema);
export interface AwsDynamoDbTableProjection {
  NonKeyAttributes?: string[];
  ProjectionType?: string;
}
export const AwsDynamoDbTableProjection = S.suspend(() =>
  S.Struct({
    NonKeyAttributes: S.optional(StringList),
    ProjectionType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsDynamoDbTableProjection",
}) as any as S.Schema<AwsDynamoDbTableProjection>;
export interface AwsDynamoDbTableProvisionedThroughput {
  LastDecreaseDateTime?: string;
  LastIncreaseDateTime?: string;
  NumberOfDecreasesToday?: number;
  ReadCapacityUnits?: number;
  WriteCapacityUnits?: number;
}
export const AwsDynamoDbTableProvisionedThroughput = S.suspend(() =>
  S.Struct({
    LastDecreaseDateTime: S.optional(S.String),
    LastIncreaseDateTime: S.optional(S.String),
    NumberOfDecreasesToday: S.optional(S.Number),
    ReadCapacityUnits: S.optional(S.Number),
    WriteCapacityUnits: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsDynamoDbTableProvisionedThroughput",
}) as any as S.Schema<AwsDynamoDbTableProvisionedThroughput>;
export interface AwsDynamoDbTableGlobalSecondaryIndex {
  Backfilling?: boolean;
  IndexArn?: string;
  IndexName?: string;
  IndexSizeBytes?: number;
  IndexStatus?: string;
  ItemCount?: number;
  KeySchema?: AwsDynamoDbTableKeySchema[];
  Projection?: AwsDynamoDbTableProjection;
  ProvisionedThroughput?: AwsDynamoDbTableProvisionedThroughput;
}
export const AwsDynamoDbTableGlobalSecondaryIndex = S.suspend(() =>
  S.Struct({
    Backfilling: S.optional(S.Boolean),
    IndexArn: S.optional(S.String),
    IndexName: S.optional(S.String),
    IndexSizeBytes: S.optional(S.Number),
    IndexStatus: S.optional(S.String),
    ItemCount: S.optional(S.Number),
    KeySchema: S.optional(AwsDynamoDbTableKeySchemaList),
    Projection: S.optional(AwsDynamoDbTableProjection),
    ProvisionedThroughput: S.optional(AwsDynamoDbTableProvisionedThroughput),
  }),
).annotations({
  identifier: "AwsDynamoDbTableGlobalSecondaryIndex",
}) as any as S.Schema<AwsDynamoDbTableGlobalSecondaryIndex>;
export type AwsDynamoDbTableGlobalSecondaryIndexList =
  AwsDynamoDbTableGlobalSecondaryIndex[];
export const AwsDynamoDbTableGlobalSecondaryIndexList = S.Array(
  AwsDynamoDbTableGlobalSecondaryIndex,
);
export interface AwsDynamoDbTableLocalSecondaryIndex {
  IndexArn?: string;
  IndexName?: string;
  KeySchema?: AwsDynamoDbTableKeySchema[];
  Projection?: AwsDynamoDbTableProjection;
}
export const AwsDynamoDbTableLocalSecondaryIndex = S.suspend(() =>
  S.Struct({
    IndexArn: S.optional(S.String),
    IndexName: S.optional(S.String),
    KeySchema: S.optional(AwsDynamoDbTableKeySchemaList),
    Projection: S.optional(AwsDynamoDbTableProjection),
  }),
).annotations({
  identifier: "AwsDynamoDbTableLocalSecondaryIndex",
}) as any as S.Schema<AwsDynamoDbTableLocalSecondaryIndex>;
export type AwsDynamoDbTableLocalSecondaryIndexList =
  AwsDynamoDbTableLocalSecondaryIndex[];
export const AwsDynamoDbTableLocalSecondaryIndexList = S.Array(
  AwsDynamoDbTableLocalSecondaryIndex,
);
export interface AwsDynamoDbTableProvisionedThroughputOverride {
  ReadCapacityUnits?: number;
}
export const AwsDynamoDbTableProvisionedThroughputOverride = S.suspend(() =>
  S.Struct({ ReadCapacityUnits: S.optional(S.Number) }),
).annotations({
  identifier: "AwsDynamoDbTableProvisionedThroughputOverride",
}) as any as S.Schema<AwsDynamoDbTableProvisionedThroughputOverride>;
export interface AwsDynamoDbTableReplicaGlobalSecondaryIndex {
  IndexName?: string;
  ProvisionedThroughputOverride?: AwsDynamoDbTableProvisionedThroughputOverride;
}
export const AwsDynamoDbTableReplicaGlobalSecondaryIndex = S.suspend(() =>
  S.Struct({
    IndexName: S.optional(S.String),
    ProvisionedThroughputOverride: S.optional(
      AwsDynamoDbTableProvisionedThroughputOverride,
    ),
  }),
).annotations({
  identifier: "AwsDynamoDbTableReplicaGlobalSecondaryIndex",
}) as any as S.Schema<AwsDynamoDbTableReplicaGlobalSecondaryIndex>;
export type AwsDynamoDbTableReplicaGlobalSecondaryIndexList =
  AwsDynamoDbTableReplicaGlobalSecondaryIndex[];
export const AwsDynamoDbTableReplicaGlobalSecondaryIndexList = S.Array(
  AwsDynamoDbTableReplicaGlobalSecondaryIndex,
);
export interface AwsDynamoDbTableReplica {
  GlobalSecondaryIndexes?: AwsDynamoDbTableReplicaGlobalSecondaryIndex[];
  KmsMasterKeyId?: string;
  ProvisionedThroughputOverride?: AwsDynamoDbTableProvisionedThroughputOverride;
  RegionName?: string;
  ReplicaStatus?: string;
  ReplicaStatusDescription?: string;
}
export const AwsDynamoDbTableReplica = S.suspend(() =>
  S.Struct({
    GlobalSecondaryIndexes: S.optional(
      AwsDynamoDbTableReplicaGlobalSecondaryIndexList,
    ),
    KmsMasterKeyId: S.optional(S.String),
    ProvisionedThroughputOverride: S.optional(
      AwsDynamoDbTableProvisionedThroughputOverride,
    ),
    RegionName: S.optional(S.String),
    ReplicaStatus: S.optional(S.String),
    ReplicaStatusDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsDynamoDbTableReplica",
}) as any as S.Schema<AwsDynamoDbTableReplica>;
export type AwsDynamoDbTableReplicaList = AwsDynamoDbTableReplica[];
export const AwsDynamoDbTableReplicaList = S.Array(AwsDynamoDbTableReplica);
export interface AwsDynamoDbTableRestoreSummary {
  SourceBackupArn?: string;
  SourceTableArn?: string;
  RestoreDateTime?: string;
  RestoreInProgress?: boolean;
}
export const AwsDynamoDbTableRestoreSummary = S.suspend(() =>
  S.Struct({
    SourceBackupArn: S.optional(S.String),
    SourceTableArn: S.optional(S.String),
    RestoreDateTime: S.optional(S.String),
    RestoreInProgress: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsDynamoDbTableRestoreSummary",
}) as any as S.Schema<AwsDynamoDbTableRestoreSummary>;
export interface AwsDynamoDbTableSseDescription {
  InaccessibleEncryptionDateTime?: string;
  Status?: string;
  SseType?: string;
  KmsMasterKeyArn?: string;
}
export const AwsDynamoDbTableSseDescription = S.suspend(() =>
  S.Struct({
    InaccessibleEncryptionDateTime: S.optional(S.String),
    Status: S.optional(S.String),
    SseType: S.optional(S.String),
    KmsMasterKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsDynamoDbTableSseDescription",
}) as any as S.Schema<AwsDynamoDbTableSseDescription>;
export interface AwsDynamoDbTableStreamSpecification {
  StreamEnabled?: boolean;
  StreamViewType?: string;
}
export const AwsDynamoDbTableStreamSpecification = S.suspend(() =>
  S.Struct({
    StreamEnabled: S.optional(S.Boolean),
    StreamViewType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsDynamoDbTableStreamSpecification",
}) as any as S.Schema<AwsDynamoDbTableStreamSpecification>;
export interface AwsDynamoDbTableDetails {
  AttributeDefinitions?: AwsDynamoDbTableAttributeDefinition[];
  BillingModeSummary?: AwsDynamoDbTableBillingModeSummary;
  CreationDateTime?: string;
  GlobalSecondaryIndexes?: AwsDynamoDbTableGlobalSecondaryIndex[];
  GlobalTableVersion?: string;
  ItemCount?: number;
  KeySchema?: AwsDynamoDbTableKeySchema[];
  LatestStreamArn?: string;
  LatestStreamLabel?: string;
  LocalSecondaryIndexes?: AwsDynamoDbTableLocalSecondaryIndex[];
  ProvisionedThroughput?: AwsDynamoDbTableProvisionedThroughput;
  Replicas?: AwsDynamoDbTableReplica[];
  RestoreSummary?: AwsDynamoDbTableRestoreSummary;
  SseDescription?: AwsDynamoDbTableSseDescription;
  StreamSpecification?: AwsDynamoDbTableStreamSpecification;
  TableId?: string;
  TableName?: string;
  TableSizeBytes?: number;
  TableStatus?: string;
  DeletionProtectionEnabled?: boolean;
}
export const AwsDynamoDbTableDetails = S.suspend(() =>
  S.Struct({
    AttributeDefinitions: S.optional(AwsDynamoDbTableAttributeDefinitionList),
    BillingModeSummary: S.optional(AwsDynamoDbTableBillingModeSummary),
    CreationDateTime: S.optional(S.String),
    GlobalSecondaryIndexes: S.optional(
      AwsDynamoDbTableGlobalSecondaryIndexList,
    ),
    GlobalTableVersion: S.optional(S.String),
    ItemCount: S.optional(S.Number),
    KeySchema: S.optional(AwsDynamoDbTableKeySchemaList),
    LatestStreamArn: S.optional(S.String),
    LatestStreamLabel: S.optional(S.String),
    LocalSecondaryIndexes: S.optional(AwsDynamoDbTableLocalSecondaryIndexList),
    ProvisionedThroughput: S.optional(AwsDynamoDbTableProvisionedThroughput),
    Replicas: S.optional(AwsDynamoDbTableReplicaList),
    RestoreSummary: S.optional(AwsDynamoDbTableRestoreSummary),
    SseDescription: S.optional(AwsDynamoDbTableSseDescription),
    StreamSpecification: S.optional(AwsDynamoDbTableStreamSpecification),
    TableId: S.optional(S.String),
    TableName: S.optional(S.String),
    TableSizeBytes: S.optional(S.Number),
    TableStatus: S.optional(S.String),
    DeletionProtectionEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsDynamoDbTableDetails",
}) as any as S.Schema<AwsDynamoDbTableDetails>;
export interface AwsApiGatewayMethodSettings {
  MetricsEnabled?: boolean;
  LoggingLevel?: string;
  DataTraceEnabled?: boolean;
  ThrottlingBurstLimit?: number;
  ThrottlingRateLimit?: number;
  CachingEnabled?: boolean;
  CacheTtlInSeconds?: number;
  CacheDataEncrypted?: boolean;
  RequireAuthorizationForCacheControl?: boolean;
  UnauthorizedCacheControlHeaderStrategy?: string;
  HttpMethod?: string;
  ResourcePath?: string;
}
export const AwsApiGatewayMethodSettings = S.suspend(() =>
  S.Struct({
    MetricsEnabled: S.optional(S.Boolean),
    LoggingLevel: S.optional(S.String),
    DataTraceEnabled: S.optional(S.Boolean),
    ThrottlingBurstLimit: S.optional(S.Number),
    ThrottlingRateLimit: S.optional(S.Number),
    CachingEnabled: S.optional(S.Boolean),
    CacheTtlInSeconds: S.optional(S.Number),
    CacheDataEncrypted: S.optional(S.Boolean),
    RequireAuthorizationForCacheControl: S.optional(S.Boolean),
    UnauthorizedCacheControlHeaderStrategy: S.optional(S.String),
    HttpMethod: S.optional(S.String),
    ResourcePath: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsApiGatewayMethodSettings",
}) as any as S.Schema<AwsApiGatewayMethodSettings>;
export type AwsApiGatewayMethodSettingsList = AwsApiGatewayMethodSettings[];
export const AwsApiGatewayMethodSettingsList = S.Array(
  AwsApiGatewayMethodSettings,
);
export interface AwsApiGatewayCanarySettings {
  PercentTraffic?: number;
  DeploymentId?: string;
  StageVariableOverrides?: { [key: string]: string | undefined };
  UseStageCache?: boolean;
}
export const AwsApiGatewayCanarySettings = S.suspend(() =>
  S.Struct({
    PercentTraffic: S.optional(S.Number),
    DeploymentId: S.optional(S.String),
    StageVariableOverrides: S.optional(FieldMap),
    UseStageCache: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsApiGatewayCanarySettings",
}) as any as S.Schema<AwsApiGatewayCanarySettings>;
export interface AwsApiGatewayStageDetails {
  DeploymentId?: string;
  ClientCertificateId?: string;
  StageName?: string;
  Description?: string;
  CacheClusterEnabled?: boolean;
  CacheClusterSize?: string;
  CacheClusterStatus?: string;
  MethodSettings?: AwsApiGatewayMethodSettings[];
  Variables?: { [key: string]: string | undefined };
  DocumentationVersion?: string;
  AccessLogSettings?: AwsApiGatewayAccessLogSettings;
  CanarySettings?: AwsApiGatewayCanarySettings;
  TracingEnabled?: boolean;
  CreatedDate?: string;
  LastUpdatedDate?: string;
  WebAclArn?: string;
}
export const AwsApiGatewayStageDetails = S.suspend(() =>
  S.Struct({
    DeploymentId: S.optional(S.String),
    ClientCertificateId: S.optional(S.String),
    StageName: S.optional(S.String),
    Description: S.optional(S.String),
    CacheClusterEnabled: S.optional(S.Boolean),
    CacheClusterSize: S.optional(S.String),
    CacheClusterStatus: S.optional(S.String),
    MethodSettings: S.optional(AwsApiGatewayMethodSettingsList),
    Variables: S.optional(FieldMap),
    DocumentationVersion: S.optional(S.String),
    AccessLogSettings: S.optional(AwsApiGatewayAccessLogSettings),
    CanarySettings: S.optional(AwsApiGatewayCanarySettings),
    TracingEnabled: S.optional(S.Boolean),
    CreatedDate: S.optional(S.String),
    LastUpdatedDate: S.optional(S.String),
    WebAclArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsApiGatewayStageDetails",
}) as any as S.Schema<AwsApiGatewayStageDetails>;
export interface AwsApiGatewayEndpointConfiguration {
  Types?: string[];
}
export const AwsApiGatewayEndpointConfiguration = S.suspend(() =>
  S.Struct({ Types: S.optional(NonEmptyStringList) }),
).annotations({
  identifier: "AwsApiGatewayEndpointConfiguration",
}) as any as S.Schema<AwsApiGatewayEndpointConfiguration>;
export interface AwsApiGatewayRestApiDetails {
  Id?: string;
  Name?: string;
  Description?: string;
  CreatedDate?: string;
  Version?: string;
  BinaryMediaTypes?: string[];
  MinimumCompressionSize?: number;
  ApiKeySource?: string;
  EndpointConfiguration?: AwsApiGatewayEndpointConfiguration;
}
export const AwsApiGatewayRestApiDetails = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedDate: S.optional(S.String),
    Version: S.optional(S.String),
    BinaryMediaTypes: S.optional(NonEmptyStringList),
    MinimumCompressionSize: S.optional(S.Number),
    ApiKeySource: S.optional(S.String),
    EndpointConfiguration: S.optional(AwsApiGatewayEndpointConfiguration),
  }),
).annotations({
  identifier: "AwsApiGatewayRestApiDetails",
}) as any as S.Schema<AwsApiGatewayRestApiDetails>;
export interface AwsCloudTrailTrailDetails {
  CloudWatchLogsLogGroupArn?: string;
  CloudWatchLogsRoleArn?: string;
  HasCustomEventSelectors?: boolean;
  HomeRegion?: string;
  IncludeGlobalServiceEvents?: boolean;
  IsMultiRegionTrail?: boolean;
  IsOrganizationTrail?: boolean;
  KmsKeyId?: string;
  LogFileValidationEnabled?: boolean;
  Name?: string;
  S3BucketName?: string;
  S3KeyPrefix?: string;
  SnsTopicArn?: string;
  SnsTopicName?: string;
  TrailArn?: string;
}
export const AwsCloudTrailTrailDetails = S.suspend(() =>
  S.Struct({
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    HasCustomEventSelectors: S.optional(S.Boolean),
    HomeRegion: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    IsOrganizationTrail: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    LogFileValidationEnabled: S.optional(S.Boolean),
    Name: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    TrailArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCloudTrailTrailDetails",
}) as any as S.Schema<AwsCloudTrailTrailDetails>;
export interface AwsSsmComplianceSummary {
  Status?: string;
  CompliantCriticalCount?: number;
  CompliantHighCount?: number;
  CompliantMediumCount?: number;
  ExecutionType?: string;
  NonCompliantCriticalCount?: number;
  CompliantInformationalCount?: number;
  NonCompliantInformationalCount?: number;
  CompliantUnspecifiedCount?: number;
  NonCompliantLowCount?: number;
  NonCompliantHighCount?: number;
  CompliantLowCount?: number;
  ComplianceType?: string;
  PatchBaselineId?: string;
  OverallSeverity?: string;
  NonCompliantMediumCount?: number;
  NonCompliantUnspecifiedCount?: number;
  PatchGroup?: string;
}
export const AwsSsmComplianceSummary = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    CompliantCriticalCount: S.optional(S.Number),
    CompliantHighCount: S.optional(S.Number),
    CompliantMediumCount: S.optional(S.Number),
    ExecutionType: S.optional(S.String),
    NonCompliantCriticalCount: S.optional(S.Number),
    CompliantInformationalCount: S.optional(S.Number),
    NonCompliantInformationalCount: S.optional(S.Number),
    CompliantUnspecifiedCount: S.optional(S.Number),
    NonCompliantLowCount: S.optional(S.Number),
    NonCompliantHighCount: S.optional(S.Number),
    CompliantLowCount: S.optional(S.Number),
    ComplianceType: S.optional(S.String),
    PatchBaselineId: S.optional(S.String),
    OverallSeverity: S.optional(S.String),
    NonCompliantMediumCount: S.optional(S.Number),
    NonCompliantUnspecifiedCount: S.optional(S.Number),
    PatchGroup: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsSsmComplianceSummary",
}) as any as S.Schema<AwsSsmComplianceSummary>;
export interface AwsSsmPatch {
  ComplianceSummary?: AwsSsmComplianceSummary;
}
export const AwsSsmPatch = S.suspend(() =>
  S.Struct({ ComplianceSummary: S.optional(AwsSsmComplianceSummary) }),
).annotations({ identifier: "AwsSsmPatch" }) as any as S.Schema<AwsSsmPatch>;
export interface AwsSsmPatchComplianceDetails {
  Patch?: AwsSsmPatch;
}
export const AwsSsmPatchComplianceDetails = S.suspend(() =>
  S.Struct({ Patch: S.optional(AwsSsmPatch) }),
).annotations({
  identifier: "AwsSsmPatchComplianceDetails",
}) as any as S.Schema<AwsSsmPatchComplianceDetails>;
export interface AwsCertificateManagerCertificateResourceRecord {
  Name?: string;
  Type?: string;
  Value?: string;
}
export const AwsCertificateManagerCertificateResourceRecord = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCertificateManagerCertificateResourceRecord",
}) as any as S.Schema<AwsCertificateManagerCertificateResourceRecord>;
export interface AwsCertificateManagerCertificateDomainValidationOption {
  DomainName?: string;
  ResourceRecord?: AwsCertificateManagerCertificateResourceRecord;
  ValidationDomain?: string;
  ValidationEmails?: string[];
  ValidationMethod?: string;
  ValidationStatus?: string;
}
export const AwsCertificateManagerCertificateDomainValidationOption = S.suspend(
  () =>
    S.Struct({
      DomainName: S.optional(S.String),
      ResourceRecord: S.optional(
        AwsCertificateManagerCertificateResourceRecord,
      ),
      ValidationDomain: S.optional(S.String),
      ValidationEmails: S.optional(StringList),
      ValidationMethod: S.optional(S.String),
      ValidationStatus: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsCertificateManagerCertificateDomainValidationOption",
}) as any as S.Schema<AwsCertificateManagerCertificateDomainValidationOption>;
export type AwsCertificateManagerCertificateDomainValidationOptions =
  AwsCertificateManagerCertificateDomainValidationOption[];
export const AwsCertificateManagerCertificateDomainValidationOptions = S.Array(
  AwsCertificateManagerCertificateDomainValidationOption,
);
export interface AwsCertificateManagerCertificateExtendedKeyUsage {
  Name?: string;
  OId?: string;
}
export const AwsCertificateManagerCertificateExtendedKeyUsage = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), OId: S.optional(S.String) }),
).annotations({
  identifier: "AwsCertificateManagerCertificateExtendedKeyUsage",
}) as any as S.Schema<AwsCertificateManagerCertificateExtendedKeyUsage>;
export type AwsCertificateManagerCertificateExtendedKeyUsages =
  AwsCertificateManagerCertificateExtendedKeyUsage[];
export const AwsCertificateManagerCertificateExtendedKeyUsages = S.Array(
  AwsCertificateManagerCertificateExtendedKeyUsage,
);
export interface AwsCertificateManagerCertificateKeyUsage {
  Name?: string;
}
export const AwsCertificateManagerCertificateKeyUsage = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "AwsCertificateManagerCertificateKeyUsage",
}) as any as S.Schema<AwsCertificateManagerCertificateKeyUsage>;
export type AwsCertificateManagerCertificateKeyUsages =
  AwsCertificateManagerCertificateKeyUsage[];
export const AwsCertificateManagerCertificateKeyUsages = S.Array(
  AwsCertificateManagerCertificateKeyUsage,
);
export interface AwsCertificateManagerCertificateOptions {
  CertificateTransparencyLoggingPreference?: string;
}
export const AwsCertificateManagerCertificateOptions = S.suspend(() =>
  S.Struct({ CertificateTransparencyLoggingPreference: S.optional(S.String) }),
).annotations({
  identifier: "AwsCertificateManagerCertificateOptions",
}) as any as S.Schema<AwsCertificateManagerCertificateOptions>;
export interface AwsCertificateManagerCertificateRenewalSummary {
  DomainValidationOptions?: AwsCertificateManagerCertificateDomainValidationOption[];
  RenewalStatus?: string;
  RenewalStatusReason?: string;
  UpdatedAt?: string;
}
export const AwsCertificateManagerCertificateRenewalSummary = S.suspend(() =>
  S.Struct({
    DomainValidationOptions: S.optional(
      AwsCertificateManagerCertificateDomainValidationOptions,
    ),
    RenewalStatus: S.optional(S.String),
    RenewalStatusReason: S.optional(S.String),
    UpdatedAt: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCertificateManagerCertificateRenewalSummary",
}) as any as S.Schema<AwsCertificateManagerCertificateRenewalSummary>;
export interface AwsCertificateManagerCertificateDetails {
  CertificateAuthorityArn?: string;
  CreatedAt?: string;
  DomainName?: string;
  DomainValidationOptions?: AwsCertificateManagerCertificateDomainValidationOption[];
  ExtendedKeyUsages?: AwsCertificateManagerCertificateExtendedKeyUsage[];
  FailureReason?: string;
  ImportedAt?: string;
  InUseBy?: string[];
  IssuedAt?: string;
  Issuer?: string;
  KeyAlgorithm?: string;
  KeyUsages?: AwsCertificateManagerCertificateKeyUsage[];
  NotAfter?: string;
  NotBefore?: string;
  Options?: AwsCertificateManagerCertificateOptions;
  RenewalEligibility?: string;
  RenewalSummary?: AwsCertificateManagerCertificateRenewalSummary;
  Serial?: string;
  SignatureAlgorithm?: string;
  Status?: string;
  Subject?: string;
  SubjectAlternativeNames?: string[];
  Type?: string;
}
export const AwsCertificateManagerCertificateDetails = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.optional(S.String),
    CreatedAt: S.optional(S.String),
    DomainName: S.optional(S.String),
    DomainValidationOptions: S.optional(
      AwsCertificateManagerCertificateDomainValidationOptions,
    ),
    ExtendedKeyUsages: S.optional(
      AwsCertificateManagerCertificateExtendedKeyUsages,
    ),
    FailureReason: S.optional(S.String),
    ImportedAt: S.optional(S.String),
    InUseBy: S.optional(StringList),
    IssuedAt: S.optional(S.String),
    Issuer: S.optional(S.String),
    KeyAlgorithm: S.optional(S.String),
    KeyUsages: S.optional(AwsCertificateManagerCertificateKeyUsages),
    NotAfter: S.optional(S.String),
    NotBefore: S.optional(S.String),
    Options: S.optional(AwsCertificateManagerCertificateOptions),
    RenewalEligibility: S.optional(S.String),
    RenewalSummary: S.optional(AwsCertificateManagerCertificateRenewalSummary),
    Serial: S.optional(S.String),
    SignatureAlgorithm: S.optional(S.String),
    Status: S.optional(S.String),
    Subject: S.optional(S.String),
    SubjectAlternativeNames: S.optional(StringList),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCertificateManagerCertificateDetails",
}) as any as S.Schema<AwsCertificateManagerCertificateDetails>;
export interface AwsRedshiftClusterClusterNode {
  NodeRole?: string;
  PrivateIpAddress?: string;
  PublicIpAddress?: string;
}
export const AwsRedshiftClusterClusterNode = S.suspend(() =>
  S.Struct({
    NodeRole: S.optional(S.String),
    PrivateIpAddress: S.optional(S.String),
    PublicIpAddress: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterClusterNode",
}) as any as S.Schema<AwsRedshiftClusterClusterNode>;
export type AwsRedshiftClusterClusterNodes = AwsRedshiftClusterClusterNode[];
export const AwsRedshiftClusterClusterNodes = S.Array(
  AwsRedshiftClusterClusterNode,
);
export interface AwsRedshiftClusterClusterParameterStatus {
  ParameterName?: string;
  ParameterApplyStatus?: string;
  ParameterApplyErrorDescription?: string;
}
export const AwsRedshiftClusterClusterParameterStatus = S.suspend(() =>
  S.Struct({
    ParameterName: S.optional(S.String),
    ParameterApplyStatus: S.optional(S.String),
    ParameterApplyErrorDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterClusterParameterStatus",
}) as any as S.Schema<AwsRedshiftClusterClusterParameterStatus>;
export type AwsRedshiftClusterClusterParameterStatusList =
  AwsRedshiftClusterClusterParameterStatus[];
export const AwsRedshiftClusterClusterParameterStatusList = S.Array(
  AwsRedshiftClusterClusterParameterStatus,
);
export interface AwsRedshiftClusterClusterParameterGroup {
  ClusterParameterStatusList?: AwsRedshiftClusterClusterParameterStatus[];
  ParameterApplyStatus?: string;
  ParameterGroupName?: string;
}
export const AwsRedshiftClusterClusterParameterGroup = S.suspend(() =>
  S.Struct({
    ClusterParameterStatusList: S.optional(
      AwsRedshiftClusterClusterParameterStatusList,
    ),
    ParameterApplyStatus: S.optional(S.String),
    ParameterGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterClusterParameterGroup",
}) as any as S.Schema<AwsRedshiftClusterClusterParameterGroup>;
export type AwsRedshiftClusterClusterParameterGroups =
  AwsRedshiftClusterClusterParameterGroup[];
export const AwsRedshiftClusterClusterParameterGroups = S.Array(
  AwsRedshiftClusterClusterParameterGroup,
);
export interface AwsRedshiftClusterClusterSecurityGroup {
  ClusterSecurityGroupName?: string;
  Status?: string;
}
export const AwsRedshiftClusterClusterSecurityGroup = S.suspend(() =>
  S.Struct({
    ClusterSecurityGroupName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterClusterSecurityGroup",
}) as any as S.Schema<AwsRedshiftClusterClusterSecurityGroup>;
export type AwsRedshiftClusterClusterSecurityGroups =
  AwsRedshiftClusterClusterSecurityGroup[];
export const AwsRedshiftClusterClusterSecurityGroups = S.Array(
  AwsRedshiftClusterClusterSecurityGroup,
);
export interface AwsRedshiftClusterClusterSnapshotCopyStatus {
  DestinationRegion?: string;
  ManualSnapshotRetentionPeriod?: number;
  RetentionPeriod?: number;
  SnapshotCopyGrantName?: string;
}
export const AwsRedshiftClusterClusterSnapshotCopyStatus = S.suspend(() =>
  S.Struct({
    DestinationRegion: S.optional(S.String),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    RetentionPeriod: S.optional(S.Number),
    SnapshotCopyGrantName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterClusterSnapshotCopyStatus",
}) as any as S.Schema<AwsRedshiftClusterClusterSnapshotCopyStatus>;
export interface AwsRedshiftClusterDeferredMaintenanceWindow {
  DeferMaintenanceEndTime?: string;
  DeferMaintenanceIdentifier?: string;
  DeferMaintenanceStartTime?: string;
}
export const AwsRedshiftClusterDeferredMaintenanceWindow = S.suspend(() =>
  S.Struct({
    DeferMaintenanceEndTime: S.optional(S.String),
    DeferMaintenanceIdentifier: S.optional(S.String),
    DeferMaintenanceStartTime: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterDeferredMaintenanceWindow",
}) as any as S.Schema<AwsRedshiftClusterDeferredMaintenanceWindow>;
export type AwsRedshiftClusterDeferredMaintenanceWindows =
  AwsRedshiftClusterDeferredMaintenanceWindow[];
export const AwsRedshiftClusterDeferredMaintenanceWindows = S.Array(
  AwsRedshiftClusterDeferredMaintenanceWindow,
);
export interface AwsRedshiftClusterElasticIpStatus {
  ElasticIp?: string;
  Status?: string;
}
export const AwsRedshiftClusterElasticIpStatus = S.suspend(() =>
  S.Struct({ ElasticIp: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "AwsRedshiftClusterElasticIpStatus",
}) as any as S.Schema<AwsRedshiftClusterElasticIpStatus>;
export interface AwsRedshiftClusterEndpoint {
  Address?: string;
  Port?: number;
}
export const AwsRedshiftClusterEndpoint = S.suspend(() =>
  S.Struct({ Address: S.optional(S.String), Port: S.optional(S.Number) }),
).annotations({
  identifier: "AwsRedshiftClusterEndpoint",
}) as any as S.Schema<AwsRedshiftClusterEndpoint>;
export interface AwsRedshiftClusterHsmStatus {
  HsmClientCertificateIdentifier?: string;
  HsmConfigurationIdentifier?: string;
  Status?: string;
}
export const AwsRedshiftClusterHsmStatus = S.suspend(() =>
  S.Struct({
    HsmClientCertificateIdentifier: S.optional(S.String),
    HsmConfigurationIdentifier: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterHsmStatus",
}) as any as S.Schema<AwsRedshiftClusterHsmStatus>;
export interface AwsRedshiftClusterIamRole {
  ApplyStatus?: string;
  IamRoleArn?: string;
}
export const AwsRedshiftClusterIamRole = S.suspend(() =>
  S.Struct({
    ApplyStatus: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterIamRole",
}) as any as S.Schema<AwsRedshiftClusterIamRole>;
export type AwsRedshiftClusterIamRoles = AwsRedshiftClusterIamRole[];
export const AwsRedshiftClusterIamRoles = S.Array(AwsRedshiftClusterIamRole);
export interface AwsRedshiftClusterPendingModifiedValues {
  AutomatedSnapshotRetentionPeriod?: number;
  ClusterIdentifier?: string;
  ClusterType?: string;
  ClusterVersion?: string;
  EncryptionType?: string;
  EnhancedVpcRouting?: boolean;
  MaintenanceTrackName?: string;
  MasterUserPassword?: string;
  NodeType?: string;
  NumberOfNodes?: number;
  PubliclyAccessible?: boolean;
}
export const AwsRedshiftClusterPendingModifiedValues = S.suspend(() =>
  S.Struct({
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    ClusterIdentifier: S.optional(S.String),
    ClusterType: S.optional(S.String),
    ClusterVersion: S.optional(S.String),
    EncryptionType: S.optional(S.String),
    EnhancedVpcRouting: S.optional(S.Boolean),
    MaintenanceTrackName: S.optional(S.String),
    MasterUserPassword: S.optional(S.String),
    NodeType: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsRedshiftClusterPendingModifiedValues",
}) as any as S.Schema<AwsRedshiftClusterPendingModifiedValues>;
export interface AwsRedshiftClusterResizeInfo {
  AllowCancelResize?: boolean;
  ResizeType?: string;
}
export const AwsRedshiftClusterResizeInfo = S.suspend(() =>
  S.Struct({
    AllowCancelResize: S.optional(S.Boolean),
    ResizeType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterResizeInfo",
}) as any as S.Schema<AwsRedshiftClusterResizeInfo>;
export interface AwsRedshiftClusterRestoreStatus {
  CurrentRestoreRateInMegaBytesPerSecond?: number;
  ElapsedTimeInSeconds?: number;
  EstimatedTimeToCompletionInSeconds?: number;
  ProgressInMegaBytes?: number;
  SnapshotSizeInMegaBytes?: number;
  Status?: string;
}
export const AwsRedshiftClusterRestoreStatus = S.suspend(() =>
  S.Struct({
    CurrentRestoreRateInMegaBytesPerSecond: S.optional(S.Number),
    ElapsedTimeInSeconds: S.optional(S.Number),
    EstimatedTimeToCompletionInSeconds: S.optional(S.Number),
    ProgressInMegaBytes: S.optional(S.Number),
    SnapshotSizeInMegaBytes: S.optional(S.Number),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterRestoreStatus",
}) as any as S.Schema<AwsRedshiftClusterRestoreStatus>;
export interface AwsRedshiftClusterVpcSecurityGroup {
  Status?: string;
  VpcSecurityGroupId?: string;
}
export const AwsRedshiftClusterVpcSecurityGroup = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    VpcSecurityGroupId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterVpcSecurityGroup",
}) as any as S.Schema<AwsRedshiftClusterVpcSecurityGroup>;
export type AwsRedshiftClusterVpcSecurityGroups =
  AwsRedshiftClusterVpcSecurityGroup[];
export const AwsRedshiftClusterVpcSecurityGroups = S.Array(
  AwsRedshiftClusterVpcSecurityGroup,
);
export interface AwsRedshiftClusterLoggingStatus {
  BucketName?: string;
  LastFailureMessage?: string;
  LastFailureTime?: string;
  LastSuccessfulDeliveryTime?: string;
  LoggingEnabled?: boolean;
  S3KeyPrefix?: string;
}
export const AwsRedshiftClusterLoggingStatus = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String),
    LastFailureMessage: S.optional(S.String),
    LastFailureTime: S.optional(S.String),
    LastSuccessfulDeliveryTime: S.optional(S.String),
    LoggingEnabled: S.optional(S.Boolean),
    S3KeyPrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRedshiftClusterLoggingStatus",
}) as any as S.Schema<AwsRedshiftClusterLoggingStatus>;
export interface AwsRedshiftClusterDetails {
  AllowVersionUpgrade?: boolean;
  AutomatedSnapshotRetentionPeriod?: number;
  AvailabilityZone?: string;
  ClusterAvailabilityStatus?: string;
  ClusterCreateTime?: string;
  ClusterIdentifier?: string;
  ClusterNodes?: AwsRedshiftClusterClusterNode[];
  ClusterParameterGroups?: AwsRedshiftClusterClusterParameterGroup[];
  ClusterPublicKey?: string;
  ClusterRevisionNumber?: string;
  ClusterSecurityGroups?: AwsRedshiftClusterClusterSecurityGroup[];
  ClusterSnapshotCopyStatus?: AwsRedshiftClusterClusterSnapshotCopyStatus;
  ClusterStatus?: string;
  ClusterSubnetGroupName?: string;
  ClusterVersion?: string;
  DBName?: string;
  DeferredMaintenanceWindows?: AwsRedshiftClusterDeferredMaintenanceWindow[];
  ElasticIpStatus?: AwsRedshiftClusterElasticIpStatus;
  ElasticResizeNumberOfNodeOptions?: string;
  Encrypted?: boolean;
  Endpoint?: AwsRedshiftClusterEndpoint;
  EnhancedVpcRouting?: boolean;
  ExpectedNextSnapshotScheduleTime?: string;
  ExpectedNextSnapshotScheduleTimeStatus?: string;
  HsmStatus?: AwsRedshiftClusterHsmStatus;
  IamRoles?: AwsRedshiftClusterIamRole[];
  KmsKeyId?: string;
  MaintenanceTrackName?: string;
  ManualSnapshotRetentionPeriod?: number;
  MasterUsername?: string;
  NextMaintenanceWindowStartTime?: string;
  NodeType?: string;
  NumberOfNodes?: number;
  PendingActions?: string[];
  PendingModifiedValues?: AwsRedshiftClusterPendingModifiedValues;
  PreferredMaintenanceWindow?: string;
  PubliclyAccessible?: boolean;
  ResizeInfo?: AwsRedshiftClusterResizeInfo;
  RestoreStatus?: AwsRedshiftClusterRestoreStatus;
  SnapshotScheduleIdentifier?: string;
  SnapshotScheduleState?: string;
  VpcId?: string;
  VpcSecurityGroups?: AwsRedshiftClusterVpcSecurityGroup[];
  LoggingStatus?: AwsRedshiftClusterLoggingStatus;
}
export const AwsRedshiftClusterDetails = S.suspend(() =>
  S.Struct({
    AllowVersionUpgrade: S.optional(S.Boolean),
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    ClusterAvailabilityStatus: S.optional(S.String),
    ClusterCreateTime: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    ClusterNodes: S.optional(AwsRedshiftClusterClusterNodes),
    ClusterParameterGroups: S.optional(
      AwsRedshiftClusterClusterParameterGroups,
    ),
    ClusterPublicKey: S.optional(S.String),
    ClusterRevisionNumber: S.optional(S.String),
    ClusterSecurityGroups: S.optional(AwsRedshiftClusterClusterSecurityGroups),
    ClusterSnapshotCopyStatus: S.optional(
      AwsRedshiftClusterClusterSnapshotCopyStatus,
    ),
    ClusterStatus: S.optional(S.String),
    ClusterSubnetGroupName: S.optional(S.String),
    ClusterVersion: S.optional(S.String),
    DBName: S.optional(S.String),
    DeferredMaintenanceWindows: S.optional(
      AwsRedshiftClusterDeferredMaintenanceWindows,
    ),
    ElasticIpStatus: S.optional(AwsRedshiftClusterElasticIpStatus),
    ElasticResizeNumberOfNodeOptions: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    Endpoint: S.optional(AwsRedshiftClusterEndpoint),
    EnhancedVpcRouting: S.optional(S.Boolean),
    ExpectedNextSnapshotScheduleTime: S.optional(S.String),
    ExpectedNextSnapshotScheduleTimeStatus: S.optional(S.String),
    HsmStatus: S.optional(AwsRedshiftClusterHsmStatus),
    IamRoles: S.optional(AwsRedshiftClusterIamRoles),
    KmsKeyId: S.optional(S.String),
    MaintenanceTrackName: S.optional(S.String),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    MasterUsername: S.optional(S.String),
    NextMaintenanceWindowStartTime: S.optional(S.String),
    NodeType: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    PendingActions: S.optional(StringList),
    PendingModifiedValues: S.optional(AwsRedshiftClusterPendingModifiedValues),
    PreferredMaintenanceWindow: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    ResizeInfo: S.optional(AwsRedshiftClusterResizeInfo),
    RestoreStatus: S.optional(AwsRedshiftClusterRestoreStatus),
    SnapshotScheduleIdentifier: S.optional(S.String),
    SnapshotScheduleState: S.optional(S.String),
    VpcId: S.optional(S.String),
    VpcSecurityGroups: S.optional(AwsRedshiftClusterVpcSecurityGroups),
    LoggingStatus: S.optional(AwsRedshiftClusterLoggingStatus),
  }),
).annotations({
  identifier: "AwsRedshiftClusterDetails",
}) as any as S.Schema<AwsRedshiftClusterDetails>;
export interface AwsElbLoadBalancerBackendServerDescription {
  InstancePort?: number;
  PolicyNames?: string[];
}
export const AwsElbLoadBalancerBackendServerDescription = S.suspend(() =>
  S.Struct({
    InstancePort: S.optional(S.Number),
    PolicyNames: S.optional(StringList),
  }),
).annotations({
  identifier: "AwsElbLoadBalancerBackendServerDescription",
}) as any as S.Schema<AwsElbLoadBalancerBackendServerDescription>;
export type AwsElbLoadBalancerBackendServerDescriptions =
  AwsElbLoadBalancerBackendServerDescription[];
export const AwsElbLoadBalancerBackendServerDescriptions = S.Array(
  AwsElbLoadBalancerBackendServerDescription,
);
export interface AwsElbLoadBalancerHealthCheck {
  HealthyThreshold?: number;
  Interval?: number;
  Target?: string;
  Timeout?: number;
  UnhealthyThreshold?: number;
}
export const AwsElbLoadBalancerHealthCheck = S.suspend(() =>
  S.Struct({
    HealthyThreshold: S.optional(S.Number),
    Interval: S.optional(S.Number),
    Target: S.optional(S.String),
    Timeout: S.optional(S.Number),
    UnhealthyThreshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsElbLoadBalancerHealthCheck",
}) as any as S.Schema<AwsElbLoadBalancerHealthCheck>;
export interface AwsElbLoadBalancerInstance {
  InstanceId?: string;
}
export const AwsElbLoadBalancerInstance = S.suspend(() =>
  S.Struct({ InstanceId: S.optional(S.String) }),
).annotations({
  identifier: "AwsElbLoadBalancerInstance",
}) as any as S.Schema<AwsElbLoadBalancerInstance>;
export type AwsElbLoadBalancerInstances = AwsElbLoadBalancerInstance[];
export const AwsElbLoadBalancerInstances = S.Array(AwsElbLoadBalancerInstance);
export interface AwsElbLoadBalancerListener {
  InstancePort?: number;
  InstanceProtocol?: string;
  LoadBalancerPort?: number;
  Protocol?: string;
  SslCertificateId?: string;
}
export const AwsElbLoadBalancerListener = S.suspend(() =>
  S.Struct({
    InstancePort: S.optional(S.Number),
    InstanceProtocol: S.optional(S.String),
    LoadBalancerPort: S.optional(S.Number),
    Protocol: S.optional(S.String),
    SslCertificateId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElbLoadBalancerListener",
}) as any as S.Schema<AwsElbLoadBalancerListener>;
export interface AwsElbLoadBalancerListenerDescription {
  Listener?: AwsElbLoadBalancerListener;
  PolicyNames?: string[];
}
export const AwsElbLoadBalancerListenerDescription = S.suspend(() =>
  S.Struct({
    Listener: S.optional(AwsElbLoadBalancerListener),
    PolicyNames: S.optional(StringList),
  }),
).annotations({
  identifier: "AwsElbLoadBalancerListenerDescription",
}) as any as S.Schema<AwsElbLoadBalancerListenerDescription>;
export type AwsElbLoadBalancerListenerDescriptions =
  AwsElbLoadBalancerListenerDescription[];
export const AwsElbLoadBalancerListenerDescriptions = S.Array(
  AwsElbLoadBalancerListenerDescription,
);
export interface AwsElbLoadBalancerAccessLog {
  EmitInterval?: number;
  Enabled?: boolean;
  S3BucketName?: string;
  S3BucketPrefix?: string;
}
export const AwsElbLoadBalancerAccessLog = S.suspend(() =>
  S.Struct({
    EmitInterval: S.optional(S.Number),
    Enabled: S.optional(S.Boolean),
    S3BucketName: S.optional(S.String),
    S3BucketPrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElbLoadBalancerAccessLog",
}) as any as S.Schema<AwsElbLoadBalancerAccessLog>;
export interface AwsElbLoadBalancerConnectionDraining {
  Enabled?: boolean;
  Timeout?: number;
}
export const AwsElbLoadBalancerConnectionDraining = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean), Timeout: S.optional(S.Number) }),
).annotations({
  identifier: "AwsElbLoadBalancerConnectionDraining",
}) as any as S.Schema<AwsElbLoadBalancerConnectionDraining>;
export interface AwsElbLoadBalancerConnectionSettings {
  IdleTimeout?: number;
}
export const AwsElbLoadBalancerConnectionSettings = S.suspend(() =>
  S.Struct({ IdleTimeout: S.optional(S.Number) }),
).annotations({
  identifier: "AwsElbLoadBalancerConnectionSettings",
}) as any as S.Schema<AwsElbLoadBalancerConnectionSettings>;
export interface AwsElbLoadBalancerCrossZoneLoadBalancing {
  Enabled?: boolean;
}
export const AwsElbLoadBalancerCrossZoneLoadBalancing = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AwsElbLoadBalancerCrossZoneLoadBalancing",
}) as any as S.Schema<AwsElbLoadBalancerCrossZoneLoadBalancing>;
export interface AwsElbLoadBalancerAdditionalAttribute {
  Key?: string;
  Value?: string;
}
export const AwsElbLoadBalancerAdditionalAttribute = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "AwsElbLoadBalancerAdditionalAttribute",
}) as any as S.Schema<AwsElbLoadBalancerAdditionalAttribute>;
export type AwsElbLoadBalancerAdditionalAttributeList =
  AwsElbLoadBalancerAdditionalAttribute[];
export const AwsElbLoadBalancerAdditionalAttributeList = S.Array(
  AwsElbLoadBalancerAdditionalAttribute,
);
export interface AwsElbLoadBalancerAttributes {
  AccessLog?: AwsElbLoadBalancerAccessLog;
  ConnectionDraining?: AwsElbLoadBalancerConnectionDraining;
  ConnectionSettings?: AwsElbLoadBalancerConnectionSettings;
  CrossZoneLoadBalancing?: AwsElbLoadBalancerCrossZoneLoadBalancing;
  AdditionalAttributes?: AwsElbLoadBalancerAdditionalAttribute[];
}
export const AwsElbLoadBalancerAttributes = S.suspend(() =>
  S.Struct({
    AccessLog: S.optional(AwsElbLoadBalancerAccessLog),
    ConnectionDraining: S.optional(AwsElbLoadBalancerConnectionDraining),
    ConnectionSettings: S.optional(AwsElbLoadBalancerConnectionSettings),
    CrossZoneLoadBalancing: S.optional(
      AwsElbLoadBalancerCrossZoneLoadBalancing,
    ),
    AdditionalAttributes: S.optional(AwsElbLoadBalancerAdditionalAttributeList),
  }),
).annotations({
  identifier: "AwsElbLoadBalancerAttributes",
}) as any as S.Schema<AwsElbLoadBalancerAttributes>;
export interface AwsElbAppCookieStickinessPolicy {
  CookieName?: string;
  PolicyName?: string;
}
export const AwsElbAppCookieStickinessPolicy = S.suspend(() =>
  S.Struct({
    CookieName: S.optional(S.String),
    PolicyName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElbAppCookieStickinessPolicy",
}) as any as S.Schema<AwsElbAppCookieStickinessPolicy>;
export type AwsElbAppCookieStickinessPolicies =
  AwsElbAppCookieStickinessPolicy[];
export const AwsElbAppCookieStickinessPolicies = S.Array(
  AwsElbAppCookieStickinessPolicy,
);
export interface AwsElbLbCookieStickinessPolicy {
  CookieExpirationPeriod?: number;
  PolicyName?: string;
}
export const AwsElbLbCookieStickinessPolicy = S.suspend(() =>
  S.Struct({
    CookieExpirationPeriod: S.optional(S.Number),
    PolicyName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElbLbCookieStickinessPolicy",
}) as any as S.Schema<AwsElbLbCookieStickinessPolicy>;
export type AwsElbLbCookieStickinessPolicies = AwsElbLbCookieStickinessPolicy[];
export const AwsElbLbCookieStickinessPolicies = S.Array(
  AwsElbLbCookieStickinessPolicy,
);
export interface AwsElbLoadBalancerPolicies {
  AppCookieStickinessPolicies?: AwsElbAppCookieStickinessPolicy[];
  LbCookieStickinessPolicies?: AwsElbLbCookieStickinessPolicy[];
  OtherPolicies?: string[];
}
export const AwsElbLoadBalancerPolicies = S.suspend(() =>
  S.Struct({
    AppCookieStickinessPolicies: S.optional(AwsElbAppCookieStickinessPolicies),
    LbCookieStickinessPolicies: S.optional(AwsElbLbCookieStickinessPolicies),
    OtherPolicies: S.optional(StringList),
  }),
).annotations({
  identifier: "AwsElbLoadBalancerPolicies",
}) as any as S.Schema<AwsElbLoadBalancerPolicies>;
export interface AwsElbLoadBalancerSourceSecurityGroup {
  GroupName?: string;
  OwnerAlias?: string;
}
export const AwsElbLoadBalancerSourceSecurityGroup = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    OwnerAlias: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElbLoadBalancerSourceSecurityGroup",
}) as any as S.Schema<AwsElbLoadBalancerSourceSecurityGroup>;
export interface AwsElbLoadBalancerDetails {
  AvailabilityZones?: string[];
  BackendServerDescriptions?: AwsElbLoadBalancerBackendServerDescription[];
  CanonicalHostedZoneName?: string;
  CanonicalHostedZoneNameID?: string;
  CreatedTime?: string;
  DnsName?: string;
  HealthCheck?: AwsElbLoadBalancerHealthCheck;
  Instances?: AwsElbLoadBalancerInstance[];
  ListenerDescriptions?: AwsElbLoadBalancerListenerDescription[];
  LoadBalancerAttributes?: AwsElbLoadBalancerAttributes;
  LoadBalancerName?: string;
  Policies?: AwsElbLoadBalancerPolicies;
  Scheme?: string;
  SecurityGroups?: string[];
  SourceSecurityGroup?: AwsElbLoadBalancerSourceSecurityGroup;
  Subnets?: string[];
  VpcId?: string;
}
export const AwsElbLoadBalancerDetails = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(StringList),
    BackendServerDescriptions: S.optional(
      AwsElbLoadBalancerBackendServerDescriptions,
    ),
    CanonicalHostedZoneName: S.optional(S.String),
    CanonicalHostedZoneNameID: S.optional(S.String),
    CreatedTime: S.optional(S.String),
    DnsName: S.optional(S.String),
    HealthCheck: S.optional(AwsElbLoadBalancerHealthCheck),
    Instances: S.optional(AwsElbLoadBalancerInstances),
    ListenerDescriptions: S.optional(AwsElbLoadBalancerListenerDescriptions),
    LoadBalancerAttributes: S.optional(AwsElbLoadBalancerAttributes),
    LoadBalancerName: S.optional(S.String),
    Policies: S.optional(AwsElbLoadBalancerPolicies),
    Scheme: S.optional(S.String),
    SecurityGroups: S.optional(StringList),
    SourceSecurityGroup: S.optional(AwsElbLoadBalancerSourceSecurityGroup),
    Subnets: S.optional(StringList),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsElbLoadBalancerDetails",
}) as any as S.Schema<AwsElbLoadBalancerDetails>;
export interface AwsIamGroupPolicy {
  PolicyName?: string;
}
export const AwsIamGroupPolicy = S.suspend(() =>
  S.Struct({ PolicyName: S.optional(S.String) }),
).annotations({
  identifier: "AwsIamGroupPolicy",
}) as any as S.Schema<AwsIamGroupPolicy>;
export type AwsIamGroupPolicyList = AwsIamGroupPolicy[];
export const AwsIamGroupPolicyList = S.Array(AwsIamGroupPolicy);
export interface AwsIamGroupDetails {
  AttachedManagedPolicies?: AwsIamAttachedManagedPolicy[];
  CreateDate?: string;
  GroupId?: string;
  GroupName?: string;
  GroupPolicyList?: AwsIamGroupPolicy[];
  Path?: string;
}
export const AwsIamGroupDetails = S.suspend(() =>
  S.Struct({
    AttachedManagedPolicies: S.optional(AwsIamAttachedManagedPolicyList),
    CreateDate: S.optional(S.String),
    GroupId: S.optional(S.String),
    GroupName: S.optional(S.String),
    GroupPolicyList: S.optional(AwsIamGroupPolicyList),
    Path: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsIamGroupDetails",
}) as any as S.Schema<AwsIamGroupDetails>;
export interface AwsIamInstanceProfileRole {
  Arn?: string;
  AssumeRolePolicyDocument?: string;
  CreateDate?: string;
  Path?: string;
  RoleId?: string;
  RoleName?: string;
}
export const AwsIamInstanceProfileRole = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AssumeRolePolicyDocument: S.optional(S.String),
    CreateDate: S.optional(S.String),
    Path: S.optional(S.String),
    RoleId: S.optional(S.String),
    RoleName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsIamInstanceProfileRole",
}) as any as S.Schema<AwsIamInstanceProfileRole>;
export type AwsIamInstanceProfileRoles = AwsIamInstanceProfileRole[];
export const AwsIamInstanceProfileRoles = S.Array(AwsIamInstanceProfileRole);
export interface AwsIamInstanceProfile {
  Arn?: string;
  CreateDate?: string;
  InstanceProfileId?: string;
  InstanceProfileName?: string;
  Path?: string;
  Roles?: AwsIamInstanceProfileRole[];
}
export const AwsIamInstanceProfile = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreateDate: S.optional(S.String),
    InstanceProfileId: S.optional(S.String),
    InstanceProfileName: S.optional(S.String),
    Path: S.optional(S.String),
    Roles: S.optional(AwsIamInstanceProfileRoles),
  }),
).annotations({
  identifier: "AwsIamInstanceProfile",
}) as any as S.Schema<AwsIamInstanceProfile>;
export type AwsIamInstanceProfileList = AwsIamInstanceProfile[];
export const AwsIamInstanceProfileList = S.Array(AwsIamInstanceProfile);
export interface AwsIamRolePolicy {
  PolicyName?: string;
}
export const AwsIamRolePolicy = S.suspend(() =>
  S.Struct({ PolicyName: S.optional(S.String) }),
).annotations({
  identifier: "AwsIamRolePolicy",
}) as any as S.Schema<AwsIamRolePolicy>;
export type AwsIamRolePolicyList = AwsIamRolePolicy[];
export const AwsIamRolePolicyList = S.Array(AwsIamRolePolicy);
export interface AwsIamRoleDetails {
  AssumeRolePolicyDocument?: string;
  AttachedManagedPolicies?: AwsIamAttachedManagedPolicy[];
  CreateDate?: string;
  InstanceProfileList?: AwsIamInstanceProfile[];
  PermissionsBoundary?: AwsIamPermissionsBoundary;
  RoleId?: string;
  RoleName?: string;
  RolePolicyList?: AwsIamRolePolicy[];
  MaxSessionDuration?: number;
  Path?: string;
}
export const AwsIamRoleDetails = S.suspend(() =>
  S.Struct({
    AssumeRolePolicyDocument: S.optional(S.String),
    AttachedManagedPolicies: S.optional(AwsIamAttachedManagedPolicyList),
    CreateDate: S.optional(S.String),
    InstanceProfileList: S.optional(AwsIamInstanceProfileList),
    PermissionsBoundary: S.optional(AwsIamPermissionsBoundary),
    RoleId: S.optional(S.String),
    RoleName: S.optional(S.String),
    RolePolicyList: S.optional(AwsIamRolePolicyList),
    MaxSessionDuration: S.optional(S.Number),
    Path: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsIamRoleDetails",
}) as any as S.Schema<AwsIamRoleDetails>;
export interface AwsKmsKeyDetails {
  AWSAccountId?: string;
  CreationDate?: number;
  KeyId?: string;
  KeyManager?: string;
  KeyState?: string;
  Origin?: string;
  Description?: string;
  KeyRotationStatus?: boolean;
}
export const AwsKmsKeyDetails = S.suspend(() =>
  S.Struct({
    AWSAccountId: S.optional(S.String),
    CreationDate: S.optional(S.Number),
    KeyId: S.optional(S.String),
    KeyManager: S.optional(S.String),
    KeyState: S.optional(S.String),
    Origin: S.optional(S.String),
    Description: S.optional(S.String),
    KeyRotationStatus: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsKmsKeyDetails",
}) as any as S.Schema<AwsKmsKeyDetails>;
export interface AwsLambdaFunctionCode {
  S3Bucket?: string;
  S3Key?: string;
  S3ObjectVersion?: string;
  ZipFile?: string;
}
export const AwsLambdaFunctionCode = S.suspend(() =>
  S.Struct({
    S3Bucket: S.optional(S.String),
    S3Key: S.optional(S.String),
    S3ObjectVersion: S.optional(S.String),
    ZipFile: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsLambdaFunctionCode",
}) as any as S.Schema<AwsLambdaFunctionCode>;
export interface AwsLambdaFunctionDeadLetterConfig {
  TargetArn?: string;
}
export const AwsLambdaFunctionDeadLetterConfig = S.suspend(() =>
  S.Struct({ TargetArn: S.optional(S.String) }),
).annotations({
  identifier: "AwsLambdaFunctionDeadLetterConfig",
}) as any as S.Schema<AwsLambdaFunctionDeadLetterConfig>;
export interface AwsLambdaFunctionEnvironmentError {
  ErrorCode?: string;
  Message?: string;
}
export const AwsLambdaFunctionEnvironmentError = S.suspend(() =>
  S.Struct({ ErrorCode: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "AwsLambdaFunctionEnvironmentError",
}) as any as S.Schema<AwsLambdaFunctionEnvironmentError>;
export interface AwsLambdaFunctionEnvironment {
  Variables?: { [key: string]: string | undefined };
  Error?: AwsLambdaFunctionEnvironmentError;
}
export const AwsLambdaFunctionEnvironment = S.suspend(() =>
  S.Struct({
    Variables: S.optional(FieldMap),
    Error: S.optional(AwsLambdaFunctionEnvironmentError),
  }),
).annotations({
  identifier: "AwsLambdaFunctionEnvironment",
}) as any as S.Schema<AwsLambdaFunctionEnvironment>;
export interface AwsLambdaFunctionLayer {
  Arn?: string;
  CodeSize?: number;
}
export const AwsLambdaFunctionLayer = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), CodeSize: S.optional(S.Number) }),
).annotations({
  identifier: "AwsLambdaFunctionLayer",
}) as any as S.Schema<AwsLambdaFunctionLayer>;
export type AwsLambdaFunctionLayerList = AwsLambdaFunctionLayer[];
export const AwsLambdaFunctionLayerList = S.Array(AwsLambdaFunctionLayer);
export interface AwsLambdaFunctionTracingConfig {
  Mode?: string;
}
export const AwsLambdaFunctionTracingConfig = S.suspend(() =>
  S.Struct({ Mode: S.optional(S.String) }),
).annotations({
  identifier: "AwsLambdaFunctionTracingConfig",
}) as any as S.Schema<AwsLambdaFunctionTracingConfig>;
export interface AwsLambdaFunctionVpcConfig {
  SecurityGroupIds?: string[];
  SubnetIds?: string[];
  VpcId?: string;
}
export const AwsLambdaFunctionVpcConfig = S.suspend(() =>
  S.Struct({
    SecurityGroupIds: S.optional(NonEmptyStringList),
    SubnetIds: S.optional(NonEmptyStringList),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsLambdaFunctionVpcConfig",
}) as any as S.Schema<AwsLambdaFunctionVpcConfig>;
export interface AwsLambdaFunctionDetails {
  Code?: AwsLambdaFunctionCode;
  CodeSha256?: string;
  DeadLetterConfig?: AwsLambdaFunctionDeadLetterConfig;
  Environment?: AwsLambdaFunctionEnvironment;
  FunctionName?: string;
  Handler?: string;
  KmsKeyArn?: string;
  LastModified?: string;
  Layers?: AwsLambdaFunctionLayer[];
  MasterArn?: string;
  MemorySize?: number;
  RevisionId?: string;
  Role?: string;
  Runtime?: string;
  Timeout?: number;
  TracingConfig?: AwsLambdaFunctionTracingConfig;
  VpcConfig?: AwsLambdaFunctionVpcConfig;
  Version?: string;
  Architectures?: string[];
  PackageType?: string;
}
export const AwsLambdaFunctionDetails = S.suspend(() =>
  S.Struct({
    Code: S.optional(AwsLambdaFunctionCode),
    CodeSha256: S.optional(S.String),
    DeadLetterConfig: S.optional(AwsLambdaFunctionDeadLetterConfig),
    Environment: S.optional(AwsLambdaFunctionEnvironment),
    FunctionName: S.optional(S.String),
    Handler: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    LastModified: S.optional(S.String),
    Layers: S.optional(AwsLambdaFunctionLayerList),
    MasterArn: S.optional(S.String),
    MemorySize: S.optional(S.Number),
    RevisionId: S.optional(S.String),
    Role: S.optional(S.String),
    Runtime: S.optional(S.String),
    Timeout: S.optional(S.Number),
    TracingConfig: S.optional(AwsLambdaFunctionTracingConfig),
    VpcConfig: S.optional(AwsLambdaFunctionVpcConfig),
    Version: S.optional(S.String),
    Architectures: S.optional(NonEmptyStringList),
    PackageType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsLambdaFunctionDetails",
}) as any as S.Schema<AwsLambdaFunctionDetails>;
export interface AwsLambdaLayerVersionDetails {
  Version?: number;
  CompatibleRuntimes?: string[];
  CreatedDate?: string;
}
export const AwsLambdaLayerVersionDetails = S.suspend(() =>
  S.Struct({
    Version: S.optional(S.Number),
    CompatibleRuntimes: S.optional(NonEmptyStringList),
    CreatedDate: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsLambdaLayerVersionDetails",
}) as any as S.Schema<AwsLambdaLayerVersionDetails>;
export interface AwsRdsDbInstanceAssociatedRole {
  RoleArn?: string;
  FeatureName?: string;
  Status?: string;
}
export const AwsRdsDbInstanceAssociatedRole = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    FeatureName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbInstanceAssociatedRole",
}) as any as S.Schema<AwsRdsDbInstanceAssociatedRole>;
export type AwsRdsDbInstanceAssociatedRoles = AwsRdsDbInstanceAssociatedRole[];
export const AwsRdsDbInstanceAssociatedRoles = S.Array(
  AwsRdsDbInstanceAssociatedRole,
);
export interface AwsRdsDbInstanceEndpoint {
  Address?: string;
  Port?: number;
  HostedZoneId?: string;
}
export const AwsRdsDbInstanceEndpoint = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    Port: S.optional(S.Number),
    HostedZoneId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbInstanceEndpoint",
}) as any as S.Schema<AwsRdsDbInstanceEndpoint>;
export interface AwsRdsDbInstanceVpcSecurityGroup {
  VpcSecurityGroupId?: string;
  Status?: string;
}
export const AwsRdsDbInstanceVpcSecurityGroup = S.suspend(() =>
  S.Struct({
    VpcSecurityGroupId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbInstanceVpcSecurityGroup",
}) as any as S.Schema<AwsRdsDbInstanceVpcSecurityGroup>;
export type AwsRdsDbInstanceVpcSecurityGroups =
  AwsRdsDbInstanceVpcSecurityGroup[];
export const AwsRdsDbInstanceVpcSecurityGroups = S.Array(
  AwsRdsDbInstanceVpcSecurityGroup,
);
export interface AwsRdsDbParameterGroup {
  DbParameterGroupName?: string;
  ParameterApplyStatus?: string;
}
export const AwsRdsDbParameterGroup = S.suspend(() =>
  S.Struct({
    DbParameterGroupName: S.optional(S.String),
    ParameterApplyStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbParameterGroup",
}) as any as S.Schema<AwsRdsDbParameterGroup>;
export type AwsRdsDbParameterGroups = AwsRdsDbParameterGroup[];
export const AwsRdsDbParameterGroups = S.Array(AwsRdsDbParameterGroup);
export interface AwsRdsDbSubnetGroupSubnetAvailabilityZone {
  Name?: string;
}
export const AwsRdsDbSubnetGroupSubnetAvailabilityZone = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "AwsRdsDbSubnetGroupSubnetAvailabilityZone",
}) as any as S.Schema<AwsRdsDbSubnetGroupSubnetAvailabilityZone>;
export interface AwsRdsDbSubnetGroupSubnet {
  SubnetIdentifier?: string;
  SubnetAvailabilityZone?: AwsRdsDbSubnetGroupSubnetAvailabilityZone;
  SubnetStatus?: string;
}
export const AwsRdsDbSubnetGroupSubnet = S.suspend(() =>
  S.Struct({
    SubnetIdentifier: S.optional(S.String),
    SubnetAvailabilityZone: S.optional(
      AwsRdsDbSubnetGroupSubnetAvailabilityZone,
    ),
    SubnetStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbSubnetGroupSubnet",
}) as any as S.Schema<AwsRdsDbSubnetGroupSubnet>;
export type AwsRdsDbSubnetGroupSubnets = AwsRdsDbSubnetGroupSubnet[];
export const AwsRdsDbSubnetGroupSubnets = S.Array(AwsRdsDbSubnetGroupSubnet);
export interface AwsRdsDbSubnetGroup {
  DbSubnetGroupName?: string;
  DbSubnetGroupDescription?: string;
  VpcId?: string;
  SubnetGroupStatus?: string;
  Subnets?: AwsRdsDbSubnetGroupSubnet[];
  DbSubnetGroupArn?: string;
}
export const AwsRdsDbSubnetGroup = S.suspend(() =>
  S.Struct({
    DbSubnetGroupName: S.optional(S.String),
    DbSubnetGroupDescription: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetGroupStatus: S.optional(S.String),
    Subnets: S.optional(AwsRdsDbSubnetGroupSubnets),
    DbSubnetGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbSubnetGroup",
}) as any as S.Schema<AwsRdsDbSubnetGroup>;
export interface AwsRdsPendingCloudWatchLogsExports {
  LogTypesToEnable?: string[];
  LogTypesToDisable?: string[];
}
export const AwsRdsPendingCloudWatchLogsExports = S.suspend(() =>
  S.Struct({
    LogTypesToEnable: S.optional(StringList),
    LogTypesToDisable: S.optional(StringList),
  }),
).annotations({
  identifier: "AwsRdsPendingCloudWatchLogsExports",
}) as any as S.Schema<AwsRdsPendingCloudWatchLogsExports>;
export interface AwsRdsDbProcessorFeature {
  Name?: string;
  Value?: string;
}
export const AwsRdsDbProcessorFeature = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "AwsRdsDbProcessorFeature",
}) as any as S.Schema<AwsRdsDbProcessorFeature>;
export type AwsRdsDbProcessorFeatures = AwsRdsDbProcessorFeature[];
export const AwsRdsDbProcessorFeatures = S.Array(AwsRdsDbProcessorFeature);
export interface AwsRdsDbPendingModifiedValues {
  DbInstanceClass?: string;
  AllocatedStorage?: number;
  MasterUserPassword?: string;
  Port?: number;
  BackupRetentionPeriod?: number;
  MultiAZ?: boolean;
  EngineVersion?: string;
  LicenseModel?: string;
  Iops?: number;
  DbInstanceIdentifier?: string;
  StorageType?: string;
  CaCertificateIdentifier?: string;
  DbSubnetGroupName?: string;
  PendingCloudWatchLogsExports?: AwsRdsPendingCloudWatchLogsExports;
  ProcessorFeatures?: AwsRdsDbProcessorFeature[];
}
export const AwsRdsDbPendingModifiedValues = S.suspend(() =>
  S.Struct({
    DbInstanceClass: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    MasterUserPassword: S.optional(S.String),
    Port: S.optional(S.Number),
    BackupRetentionPeriod: S.optional(S.Number),
    MultiAZ: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    Iops: S.optional(S.Number),
    DbInstanceIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    CaCertificateIdentifier: S.optional(S.String),
    DbSubnetGroupName: S.optional(S.String),
    PendingCloudWatchLogsExports: S.optional(
      AwsRdsPendingCloudWatchLogsExports,
    ),
    ProcessorFeatures: S.optional(AwsRdsDbProcessorFeatures),
  }),
).annotations({
  identifier: "AwsRdsDbPendingModifiedValues",
}) as any as S.Schema<AwsRdsDbPendingModifiedValues>;
export interface AwsRdsDbOptionGroupMembership {
  OptionGroupName?: string;
  Status?: string;
}
export const AwsRdsDbOptionGroupMembership = S.suspend(() =>
  S.Struct({
    OptionGroupName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbOptionGroupMembership",
}) as any as S.Schema<AwsRdsDbOptionGroupMembership>;
export type AwsRdsDbOptionGroupMemberships = AwsRdsDbOptionGroupMembership[];
export const AwsRdsDbOptionGroupMemberships = S.Array(
  AwsRdsDbOptionGroupMembership,
);
export interface AwsRdsDbStatusInfo {
  StatusType?: string;
  Normal?: boolean;
  Status?: string;
  Message?: string;
}
export const AwsRdsDbStatusInfo = S.suspend(() =>
  S.Struct({
    StatusType: S.optional(S.String),
    Normal: S.optional(S.Boolean),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbStatusInfo",
}) as any as S.Schema<AwsRdsDbStatusInfo>;
export type AwsRdsDbStatusInfos = AwsRdsDbStatusInfo[];
export const AwsRdsDbStatusInfos = S.Array(AwsRdsDbStatusInfo);
export interface AwsRdsDbDomainMembership {
  Domain?: string;
  Status?: string;
  Fqdn?: string;
  IamRoleName?: string;
}
export const AwsRdsDbDomainMembership = S.suspend(() =>
  S.Struct({
    Domain: S.optional(S.String),
    Status: S.optional(S.String),
    Fqdn: S.optional(S.String),
    IamRoleName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbDomainMembership",
}) as any as S.Schema<AwsRdsDbDomainMembership>;
export type AwsRdsDbDomainMemberships = AwsRdsDbDomainMembership[];
export const AwsRdsDbDomainMemberships = S.Array(AwsRdsDbDomainMembership);
export interface AwsRdsDbInstanceDetails {
  AssociatedRoles?: AwsRdsDbInstanceAssociatedRole[];
  CACertificateIdentifier?: string;
  DBClusterIdentifier?: string;
  DBInstanceIdentifier?: string;
  DBInstanceClass?: string;
  DbInstancePort?: number;
  DbiResourceId?: string;
  DBName?: string;
  DeletionProtection?: boolean;
  Endpoint?: AwsRdsDbInstanceEndpoint;
  Engine?: string;
  EngineVersion?: string;
  IAMDatabaseAuthenticationEnabled?: boolean;
  InstanceCreateTime?: string;
  KmsKeyId?: string;
  PubliclyAccessible?: boolean;
  StorageEncrypted?: boolean;
  TdeCredentialArn?: string;
  VpcSecurityGroups?: AwsRdsDbInstanceVpcSecurityGroup[];
  MultiAz?: boolean;
  EnhancedMonitoringResourceArn?: string;
  DbInstanceStatus?: string;
  MasterUsername?: string;
  AllocatedStorage?: number;
  PreferredBackupWindow?: string;
  BackupRetentionPeriod?: number;
  DbSecurityGroups?: string[];
  DbParameterGroups?: AwsRdsDbParameterGroup[];
  AvailabilityZone?: string;
  DbSubnetGroup?: AwsRdsDbSubnetGroup;
  PreferredMaintenanceWindow?: string;
  PendingModifiedValues?: AwsRdsDbPendingModifiedValues;
  LatestRestorableTime?: string;
  AutoMinorVersionUpgrade?: boolean;
  ReadReplicaSourceDBInstanceIdentifier?: string;
  ReadReplicaDBInstanceIdentifiers?: string[];
  ReadReplicaDBClusterIdentifiers?: string[];
  LicenseModel?: string;
  Iops?: number;
  OptionGroupMemberships?: AwsRdsDbOptionGroupMembership[];
  CharacterSetName?: string;
  SecondaryAvailabilityZone?: string;
  StatusInfos?: AwsRdsDbStatusInfo[];
  StorageType?: string;
  DomainMemberships?: AwsRdsDbDomainMembership[];
  CopyTagsToSnapshot?: boolean;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  PromotionTier?: number;
  Timezone?: string;
  PerformanceInsightsEnabled?: boolean;
  PerformanceInsightsKmsKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  EnabledCloudWatchLogsExports?: string[];
  ProcessorFeatures?: AwsRdsDbProcessorFeature[];
  ListenerEndpoint?: AwsRdsDbInstanceEndpoint;
  MaxAllocatedStorage?: number;
}
export const AwsRdsDbInstanceDetails = S.suspend(() =>
  S.Struct({
    AssociatedRoles: S.optional(AwsRdsDbInstanceAssociatedRoles),
    CACertificateIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    DBInstanceIdentifier: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    DbInstancePort: S.optional(S.Number),
    DbiResourceId: S.optional(S.String),
    DBName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    Endpoint: S.optional(AwsRdsDbInstanceEndpoint),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
    InstanceCreateTime: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    StorageEncrypted: S.optional(S.Boolean),
    TdeCredentialArn: S.optional(S.String),
    VpcSecurityGroups: S.optional(AwsRdsDbInstanceVpcSecurityGroups),
    MultiAz: S.optional(S.Boolean),
    EnhancedMonitoringResourceArn: S.optional(S.String),
    DbInstanceStatus: S.optional(S.String),
    MasterUsername: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    PreferredBackupWindow: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    DbSecurityGroups: S.optional(StringList),
    DbParameterGroups: S.optional(AwsRdsDbParameterGroups),
    AvailabilityZone: S.optional(S.String),
    DbSubnetGroup: S.optional(AwsRdsDbSubnetGroup),
    PreferredMaintenanceWindow: S.optional(S.String),
    PendingModifiedValues: S.optional(AwsRdsDbPendingModifiedValues),
    LatestRestorableTime: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    ReadReplicaSourceDBInstanceIdentifier: S.optional(S.String),
    ReadReplicaDBInstanceIdentifiers: S.optional(StringList),
    ReadReplicaDBClusterIdentifiers: S.optional(StringList),
    LicenseModel: S.optional(S.String),
    Iops: S.optional(S.Number),
    OptionGroupMemberships: S.optional(AwsRdsDbOptionGroupMemberships),
    CharacterSetName: S.optional(S.String),
    SecondaryAvailabilityZone: S.optional(S.String),
    StatusInfos: S.optional(AwsRdsDbStatusInfos),
    StorageType: S.optional(S.String),
    DomainMemberships: S.optional(AwsRdsDbDomainMemberships),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    PromotionTier: S.optional(S.Number),
    Timezone: S.optional(S.String),
    PerformanceInsightsEnabled: S.optional(S.Boolean),
    PerformanceInsightsKmsKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    EnabledCloudWatchLogsExports: S.optional(StringList),
    ProcessorFeatures: S.optional(AwsRdsDbProcessorFeatures),
    ListenerEndpoint: S.optional(AwsRdsDbInstanceEndpoint),
    MaxAllocatedStorage: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsRdsDbInstanceDetails",
}) as any as S.Schema<AwsRdsDbInstanceDetails>;
export interface AwsSnsTopicSubscription {
  Endpoint?: string;
  Protocol?: string;
}
export const AwsSnsTopicSubscription = S.suspend(() =>
  S.Struct({ Endpoint: S.optional(S.String), Protocol: S.optional(S.String) }),
).annotations({
  identifier: "AwsSnsTopicSubscription",
}) as any as S.Schema<AwsSnsTopicSubscription>;
export type AwsSnsTopicSubscriptionList = AwsSnsTopicSubscription[];
export const AwsSnsTopicSubscriptionList = S.Array(AwsSnsTopicSubscription);
export interface AwsSnsTopicDetails {
  KmsMasterKeyId?: string;
  Subscription?: AwsSnsTopicSubscription[];
  TopicName?: string;
  Owner?: string;
  SqsSuccessFeedbackRoleArn?: string;
  SqsFailureFeedbackRoleArn?: string;
  ApplicationSuccessFeedbackRoleArn?: string;
  FirehoseSuccessFeedbackRoleArn?: string;
  FirehoseFailureFeedbackRoleArn?: string;
  HttpSuccessFeedbackRoleArn?: string;
  HttpFailureFeedbackRoleArn?: string;
}
export const AwsSnsTopicDetails = S.suspend(() =>
  S.Struct({
    KmsMasterKeyId: S.optional(S.String),
    Subscription: S.optional(AwsSnsTopicSubscriptionList),
    TopicName: S.optional(S.String),
    Owner: S.optional(S.String),
    SqsSuccessFeedbackRoleArn: S.optional(S.String),
    SqsFailureFeedbackRoleArn: S.optional(S.String),
    ApplicationSuccessFeedbackRoleArn: S.optional(S.String),
    FirehoseSuccessFeedbackRoleArn: S.optional(S.String),
    FirehoseFailureFeedbackRoleArn: S.optional(S.String),
    HttpSuccessFeedbackRoleArn: S.optional(S.String),
    HttpFailureFeedbackRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsSnsTopicDetails",
}) as any as S.Schema<AwsSnsTopicDetails>;
export interface AwsSqsQueueDetails {
  KmsDataKeyReusePeriodSeconds?: number;
  KmsMasterKeyId?: string;
  QueueName?: string;
  DeadLetterTargetArn?: string;
}
export const AwsSqsQueueDetails = S.suspend(() =>
  S.Struct({
    KmsDataKeyReusePeriodSeconds: S.optional(S.Number),
    KmsMasterKeyId: S.optional(S.String),
    QueueName: S.optional(S.String),
    DeadLetterTargetArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsSqsQueueDetails",
}) as any as S.Schema<AwsSqsQueueDetails>;
export interface WafAction {
  Type?: string;
}
export const WafAction = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String) }),
).annotations({ identifier: "WafAction" }) as any as S.Schema<WafAction>;
export interface WafExcludedRule {
  RuleId?: string;
}
export const WafExcludedRule = S.suspend(() =>
  S.Struct({ RuleId: S.optional(S.String) }),
).annotations({
  identifier: "WafExcludedRule",
}) as any as S.Schema<WafExcludedRule>;
export type WafExcludedRuleList = WafExcludedRule[];
export const WafExcludedRuleList = S.Array(WafExcludedRule);
export interface WafOverrideAction {
  Type?: string;
}
export const WafOverrideAction = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String) }),
).annotations({
  identifier: "WafOverrideAction",
}) as any as S.Schema<WafOverrideAction>;
export interface AwsWafWebAclRule {
  Action?: WafAction;
  ExcludedRules?: WafExcludedRule[];
  OverrideAction?: WafOverrideAction;
  Priority?: number;
  RuleId?: string;
  Type?: string;
}
export const AwsWafWebAclRule = S.suspend(() =>
  S.Struct({
    Action: S.optional(WafAction),
    ExcludedRules: S.optional(WafExcludedRuleList),
    OverrideAction: S.optional(WafOverrideAction),
    Priority: S.optional(S.Number),
    RuleId: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafWebAclRule",
}) as any as S.Schema<AwsWafWebAclRule>;
export type AwsWafWebAclRuleList = AwsWafWebAclRule[];
export const AwsWafWebAclRuleList = S.Array(AwsWafWebAclRule);
export interface AwsWafWebAclDetails {
  Name?: string;
  DefaultAction?: string;
  Rules?: AwsWafWebAclRule[];
  WebAclId?: string;
}
export const AwsWafWebAclDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    DefaultAction: S.optional(S.String),
    Rules: S.optional(AwsWafWebAclRuleList),
    WebAclId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafWebAclDetails",
}) as any as S.Schema<AwsWafWebAclDetails>;
export interface AwsRdsDbSnapshotDetails {
  DbSnapshotIdentifier?: string;
  DbInstanceIdentifier?: string;
  SnapshotCreateTime?: string;
  Engine?: string;
  AllocatedStorage?: number;
  Status?: string;
  Port?: number;
  AvailabilityZone?: string;
  VpcId?: string;
  InstanceCreateTime?: string;
  MasterUsername?: string;
  EngineVersion?: string;
  LicenseModel?: string;
  SnapshotType?: string;
  Iops?: number;
  OptionGroupName?: string;
  PercentProgress?: number;
  SourceRegion?: string;
  SourceDbSnapshotIdentifier?: string;
  StorageType?: string;
  TdeCredentialArn?: string;
  Encrypted?: boolean;
  KmsKeyId?: string;
  Timezone?: string;
  IamDatabaseAuthenticationEnabled?: boolean;
  ProcessorFeatures?: AwsRdsDbProcessorFeature[];
  DbiResourceId?: string;
}
export const AwsRdsDbSnapshotDetails = S.suspend(() =>
  S.Struct({
    DbSnapshotIdentifier: S.optional(S.String),
    DbInstanceIdentifier: S.optional(S.String),
    SnapshotCreateTime: S.optional(S.String),
    Engine: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    Status: S.optional(S.String),
    Port: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    VpcId: S.optional(S.String),
    InstanceCreateTime: S.optional(S.String),
    MasterUsername: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    Iops: S.optional(S.Number),
    OptionGroupName: S.optional(S.String),
    PercentProgress: S.optional(S.Number),
    SourceRegion: S.optional(S.String),
    SourceDbSnapshotIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    TdeCredentialArn: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    Timezone: S.optional(S.String),
    IamDatabaseAuthenticationEnabled: S.optional(S.Boolean),
    ProcessorFeatures: S.optional(AwsRdsDbProcessorFeatures),
    DbiResourceId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbSnapshotDetails",
}) as any as S.Schema<AwsRdsDbSnapshotDetails>;
export interface AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute {
  AttributeName?: string;
  AttributeValues?: string[];
}
export const AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    AttributeValues: S.optional(NonEmptyStringList),
  }),
).annotations({
  identifier: "AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute",
}) as any as S.Schema<AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute>;
export type AwsRdsDbClusterSnapshotDbClusterSnapshotAttributes =
  AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute[];
export const AwsRdsDbClusterSnapshotDbClusterSnapshotAttributes = S.Array(
  AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute,
);
export interface AwsRdsDbClusterSnapshotDetails {
  AvailabilityZones?: string[];
  SnapshotCreateTime?: string;
  Engine?: string;
  AllocatedStorage?: number;
  Status?: string;
  Port?: number;
  VpcId?: string;
  ClusterCreateTime?: string;
  MasterUsername?: string;
  EngineVersion?: string;
  LicenseModel?: string;
  SnapshotType?: string;
  PercentProgress?: number;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  DbClusterIdentifier?: string;
  DbClusterSnapshotIdentifier?: string;
  IamDatabaseAuthenticationEnabled?: boolean;
  DbClusterSnapshotAttributes?: AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute[];
}
export const AwsRdsDbClusterSnapshotDetails = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(StringList),
    SnapshotCreateTime: S.optional(S.String),
    Engine: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    Status: S.optional(S.String),
    Port: S.optional(S.Number),
    VpcId: S.optional(S.String),
    ClusterCreateTime: S.optional(S.String),
    MasterUsername: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    PercentProgress: S.optional(S.Number),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    DbClusterIdentifier: S.optional(S.String),
    DbClusterSnapshotIdentifier: S.optional(S.String),
    IamDatabaseAuthenticationEnabled: S.optional(S.Boolean),
    DbClusterSnapshotAttributes: S.optional(
      AwsRdsDbClusterSnapshotDbClusterSnapshotAttributes,
    ),
  }),
).annotations({
  identifier: "AwsRdsDbClusterSnapshotDetails",
}) as any as S.Schema<AwsRdsDbClusterSnapshotDetails>;
export interface AwsRdsDbClusterAssociatedRole {
  RoleArn?: string;
  Status?: string;
}
export const AwsRdsDbClusterAssociatedRole = S.suspend(() =>
  S.Struct({ RoleArn: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "AwsRdsDbClusterAssociatedRole",
}) as any as S.Schema<AwsRdsDbClusterAssociatedRole>;
export type AwsRdsDbClusterAssociatedRoles = AwsRdsDbClusterAssociatedRole[];
export const AwsRdsDbClusterAssociatedRoles = S.Array(
  AwsRdsDbClusterAssociatedRole,
);
export interface AwsRdsDbClusterOptionGroupMembership {
  DbClusterOptionGroupName?: string;
  Status?: string;
}
export const AwsRdsDbClusterOptionGroupMembership = S.suspend(() =>
  S.Struct({
    DbClusterOptionGroupName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbClusterOptionGroupMembership",
}) as any as S.Schema<AwsRdsDbClusterOptionGroupMembership>;
export type AwsRdsDbClusterOptionGroupMemberships =
  AwsRdsDbClusterOptionGroupMembership[];
export const AwsRdsDbClusterOptionGroupMemberships = S.Array(
  AwsRdsDbClusterOptionGroupMembership,
);
export interface AwsRdsDbClusterMember {
  IsClusterWriter?: boolean;
  PromotionTier?: number;
  DbInstanceIdentifier?: string;
  DbClusterParameterGroupStatus?: string;
}
export const AwsRdsDbClusterMember = S.suspend(() =>
  S.Struct({
    IsClusterWriter: S.optional(S.Boolean),
    PromotionTier: S.optional(S.Number),
    DbInstanceIdentifier: S.optional(S.String),
    DbClusterParameterGroupStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbClusterMember",
}) as any as S.Schema<AwsRdsDbClusterMember>;
export type AwsRdsDbClusterMembers = AwsRdsDbClusterMember[];
export const AwsRdsDbClusterMembers = S.Array(AwsRdsDbClusterMember);
export interface AwsRdsDbClusterDetails {
  AllocatedStorage?: number;
  AvailabilityZones?: string[];
  BackupRetentionPeriod?: number;
  DatabaseName?: string;
  Status?: string;
  Endpoint?: string;
  ReaderEndpoint?: string;
  CustomEndpoints?: string[];
  MultiAz?: boolean;
  Engine?: string;
  EngineVersion?: string;
  Port?: number;
  MasterUsername?: string;
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  ReadReplicaIdentifiers?: string[];
  VpcSecurityGroups?: AwsRdsDbInstanceVpcSecurityGroup[];
  HostedZoneId?: string;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  DbClusterResourceId?: string;
  AssociatedRoles?: AwsRdsDbClusterAssociatedRole[];
  ClusterCreateTime?: string;
  EnabledCloudWatchLogsExports?: string[];
  EngineMode?: string;
  DeletionProtection?: boolean;
  HttpEndpointEnabled?: boolean;
  ActivityStreamStatus?: string;
  CopyTagsToSnapshot?: boolean;
  CrossAccountClone?: boolean;
  DomainMemberships?: AwsRdsDbDomainMembership[];
  DbClusterParameterGroup?: string;
  DbSubnetGroup?: string;
  DbClusterOptionGroupMemberships?: AwsRdsDbClusterOptionGroupMembership[];
  DbClusterIdentifier?: string;
  DbClusterMembers?: AwsRdsDbClusterMember[];
  IamDatabaseAuthenticationEnabled?: boolean;
  AutoMinorVersionUpgrade?: boolean;
}
export const AwsRdsDbClusterDetails = S.suspend(() =>
  S.Struct({
    AllocatedStorage: S.optional(S.Number),
    AvailabilityZones: S.optional(StringList),
    BackupRetentionPeriod: S.optional(S.Number),
    DatabaseName: S.optional(S.String),
    Status: S.optional(S.String),
    Endpoint: S.optional(S.String),
    ReaderEndpoint: S.optional(S.String),
    CustomEndpoints: S.optional(StringList),
    MultiAz: S.optional(S.Boolean),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    MasterUsername: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    ReadReplicaIdentifiers: S.optional(StringList),
    VpcSecurityGroups: S.optional(AwsRdsDbInstanceVpcSecurityGroups),
    HostedZoneId: S.optional(S.String),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    DbClusterResourceId: S.optional(S.String),
    AssociatedRoles: S.optional(AwsRdsDbClusterAssociatedRoles),
    ClusterCreateTime: S.optional(S.String),
    EnabledCloudWatchLogsExports: S.optional(StringList),
    EngineMode: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    HttpEndpointEnabled: S.optional(S.Boolean),
    ActivityStreamStatus: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    CrossAccountClone: S.optional(S.Boolean),
    DomainMemberships: S.optional(AwsRdsDbDomainMemberships),
    DbClusterParameterGroup: S.optional(S.String),
    DbSubnetGroup: S.optional(S.String),
    DbClusterOptionGroupMemberships: S.optional(
      AwsRdsDbClusterOptionGroupMemberships,
    ),
    DbClusterIdentifier: S.optional(S.String),
    DbClusterMembers: S.optional(AwsRdsDbClusterMembers),
    IamDatabaseAuthenticationEnabled: S.optional(S.Boolean),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsRdsDbClusterDetails",
}) as any as S.Schema<AwsRdsDbClusterDetails>;
export interface AwsEcsClusterClusterSettingsDetails {
  Name?: string;
  Value?: string;
}
export const AwsEcsClusterClusterSettingsDetails = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "AwsEcsClusterClusterSettingsDetails",
}) as any as S.Schema<AwsEcsClusterClusterSettingsDetails>;
export type AwsEcsClusterClusterSettingsList =
  AwsEcsClusterClusterSettingsDetails[];
export const AwsEcsClusterClusterSettingsList = S.Array(
  AwsEcsClusterClusterSettingsDetails,
);
export interface AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails {
  CloudWatchEncryptionEnabled?: boolean;
  CloudWatchLogGroupName?: string;
  S3BucketName?: string;
  S3EncryptionEnabled?: boolean;
  S3KeyPrefix?: string;
}
export const AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails =
  S.suspend(() =>
    S.Struct({
      CloudWatchEncryptionEnabled: S.optional(S.Boolean),
      CloudWatchLogGroupName: S.optional(S.String),
      S3BucketName: S.optional(S.String),
      S3EncryptionEnabled: S.optional(S.Boolean),
      S3KeyPrefix: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails",
  }) as any as S.Schema<AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails>;
export interface AwsEcsClusterConfigurationExecuteCommandConfigurationDetails {
  KmsKeyId?: string;
  LogConfiguration?: AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails;
  Logging?: string;
}
export const AwsEcsClusterConfigurationExecuteCommandConfigurationDetails =
  S.suspend(() =>
    S.Struct({
      KmsKeyId: S.optional(S.String),
      LogConfiguration: S.optional(
        AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails,
      ),
      Logging: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsEcsClusterConfigurationExecuteCommandConfigurationDetails",
  }) as any as S.Schema<AwsEcsClusterConfigurationExecuteCommandConfigurationDetails>;
export interface AwsEcsClusterConfigurationDetails {
  ExecuteCommandConfiguration?: AwsEcsClusterConfigurationExecuteCommandConfigurationDetails;
}
export const AwsEcsClusterConfigurationDetails = S.suspend(() =>
  S.Struct({
    ExecuteCommandConfiguration: S.optional(
      AwsEcsClusterConfigurationExecuteCommandConfigurationDetails,
    ),
  }),
).annotations({
  identifier: "AwsEcsClusterConfigurationDetails",
}) as any as S.Schema<AwsEcsClusterConfigurationDetails>;
export interface AwsEcsClusterDefaultCapacityProviderStrategyDetails {
  Base?: number;
  CapacityProvider?: string;
  Weight?: number;
}
export const AwsEcsClusterDefaultCapacityProviderStrategyDetails = S.suspend(
  () =>
    S.Struct({
      Base: S.optional(S.Number),
      CapacityProvider: S.optional(S.String),
      Weight: S.optional(S.Number),
    }),
).annotations({
  identifier: "AwsEcsClusterDefaultCapacityProviderStrategyDetails",
}) as any as S.Schema<AwsEcsClusterDefaultCapacityProviderStrategyDetails>;
export type AwsEcsClusterDefaultCapacityProviderStrategyList =
  AwsEcsClusterDefaultCapacityProviderStrategyDetails[];
export const AwsEcsClusterDefaultCapacityProviderStrategyList = S.Array(
  AwsEcsClusterDefaultCapacityProviderStrategyDetails,
);
export interface AwsEcsClusterDetails {
  ClusterArn?: string;
  ActiveServicesCount?: number;
  CapacityProviders?: string[];
  ClusterSettings?: AwsEcsClusterClusterSettingsDetails[];
  Configuration?: AwsEcsClusterConfigurationDetails;
  DefaultCapacityProviderStrategy?: AwsEcsClusterDefaultCapacityProviderStrategyDetails[];
  ClusterName?: string;
  RegisteredContainerInstancesCount?: number;
  RunningTasksCount?: number;
  Status?: string;
}
export const AwsEcsClusterDetails = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String),
    ActiveServicesCount: S.optional(S.Number),
    CapacityProviders: S.optional(NonEmptyStringList),
    ClusterSettings: S.optional(AwsEcsClusterClusterSettingsList),
    Configuration: S.optional(AwsEcsClusterConfigurationDetails),
    DefaultCapacityProviderStrategy: S.optional(
      AwsEcsClusterDefaultCapacityProviderStrategyList,
    ),
    ClusterName: S.optional(S.String),
    RegisteredContainerInstancesCount: S.optional(S.Number),
    RunningTasksCount: S.optional(S.Number),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcsClusterDetails",
}) as any as S.Schema<AwsEcsClusterDetails>;
export interface AwsMountPoint {
  SourceVolume?: string;
  ContainerPath?: string;
}
export const AwsMountPoint = S.suspend(() =>
  S.Struct({
    SourceVolume: S.optional(S.String),
    ContainerPath: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsMountPoint",
}) as any as S.Schema<AwsMountPoint>;
export type AwsMountPointList = AwsMountPoint[];
export const AwsMountPointList = S.Array(AwsMountPoint);
export interface AwsEcsContainerDetails {
  Name?: string;
  Image?: string;
  MountPoints?: AwsMountPoint[];
  Privileged?: boolean;
}
export const AwsEcsContainerDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Image: S.optional(S.String),
    MountPoints: S.optional(AwsMountPointList),
    Privileged: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsEcsContainerDetails",
}) as any as S.Schema<AwsEcsContainerDetails>;
export interface AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails {
  Condition?: string;
  ContainerName?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails =
  S.suspend(() =>
    S.Struct({
      Condition: S.optional(S.String),
      ContainerName: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsDependsOnList =
  AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsDependsOnList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails,
);
export interface AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails {
  Name?: string;
  Value?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails =
  S.suspend(() =>
    S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsEnvironmentList =
  AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsEnvironmentList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails,
);
export interface AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails {
  Type?: string;
  Value?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails =
  S.suspend(() =>
    S.Struct({ Type: S.optional(S.String), Value: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesList =
  AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesList =
  S.Array(AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails);
export interface AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails {
  Hostname?: string;
  IpAddress?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails =
  S.suspend(() =>
    S.Struct({
      Hostname: S.optional(S.String),
      IpAddress: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsExtraHostsList =
  AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsExtraHostsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails,
);
export interface AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails {
  Options?: { [key: string]: string | undefined };
  Type?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails =
  S.suspend(() =>
    S.Struct({ Options: S.optional(FieldMap), Type: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails>;
export interface AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails {
  Command?: string[];
  Interval?: number;
  Retries?: number;
  StartPeriod?: number;
  Timeout?: number;
}
export const AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails =
  S.suspend(() =>
    S.Struct({
      Command: S.optional(NonEmptyStringList),
      Interval: S.optional(S.Number),
      Retries: S.optional(S.Number),
      StartPeriod: S.optional(S.Number),
      Timeout: S.optional(S.Number),
    }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails>;
export interface AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails {
  Add?: string[];
  Drop?: string[];
}
export const AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails =
  S.suspend(() =>
    S.Struct({
      Add: S.optional(NonEmptyStringList),
      Drop: S.optional(NonEmptyStringList),
    }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails>;
export interface AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails {
  ContainerPath?: string;
  HostPath?: string;
  Permissions?: string[];
}
export const AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails =
  S.suspend(() =>
    S.Struct({
      ContainerPath: S.optional(S.String),
      HostPath: S.optional(S.String),
      Permissions: S.optional(NonEmptyStringList),
    }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesList =
  AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesList =
  S.Array(
    AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails,
  );
export interface AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails {
  ContainerPath?: string;
  MountOptions?: string[];
  Size?: number;
}
export const AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails =
  S.suspend(() =>
    S.Struct({
      ContainerPath: S.optional(S.String),
      MountOptions: S.optional(NonEmptyStringList),
      Size: S.optional(S.Number),
    }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsList =
  AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsList =
  S.Array(AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails);
export interface AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails {
  Capabilities?: AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails;
  Devices?: AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails[];
  InitProcessEnabled?: boolean;
  MaxSwap?: number;
  SharedMemorySize?: number;
  Swappiness?: number;
  Tmpfs?: AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails[];
}
export const AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails =
  S.suspend(() =>
    S.Struct({
      Capabilities: S.optional(
        AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails,
      ),
      Devices: S.optional(
        AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesList,
      ),
      InitProcessEnabled: S.optional(S.Boolean),
      MaxSwap: S.optional(S.Number),
      SharedMemorySize: S.optional(S.Number),
      Swappiness: S.optional(S.Number),
      Tmpfs: S.optional(
        AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsList,
      ),
    }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails>;
export interface AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails {
  Name?: string;
  ValueFrom?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails =
  S.suspend(() =>
    S.Struct({ Name: S.optional(S.String), ValueFrom: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsList =
  AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsList =
  S.Array(
    AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails,
  );
export interface AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails {
  LogDriver?: string;
  Options?: { [key: string]: string | undefined };
  SecretOptions?: AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails[];
}
export const AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails =
  S.suspend(() =>
    S.Struct({
      LogDriver: S.optional(S.String),
      Options: S.optional(FieldMap),
      SecretOptions: S.optional(
        AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsList,
      ),
    }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails>;
export interface AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails {
  ContainerPath?: string;
  ReadOnly?: boolean;
  SourceVolume?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails =
  S.suspend(() =>
    S.Struct({
      ContainerPath: S.optional(S.String),
      ReadOnly: S.optional(S.Boolean),
      SourceVolume: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsMountPointsList =
  AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsMountPointsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails,
);
export interface AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails {
  ContainerPort?: number;
  HostPort?: number;
  Protocol?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails =
  S.suspend(() =>
    S.Struct({
      ContainerPort: S.optional(S.Number),
      HostPort: S.optional(S.Number),
      Protocol: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsPortMappingsList =
  AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsPortMappingsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails,
);
export interface AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails {
  CredentialsParameter?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails =
  S.suspend(() =>
    S.Struct({ CredentialsParameter: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails>;
export interface AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails {
  Type?: string;
  Value?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails =
  S.suspend(() =>
    S.Struct({ Type: S.optional(S.String), Value: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsList =
  AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsList =
  S.Array(AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails);
export interface AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails {
  Name?: string;
  ValueFrom?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails = S.suspend(
  () =>
    S.Struct({ Name: S.optional(S.String), ValueFrom: S.optional(S.String) }),
).annotations({
  identifier: "AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails",
}) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsSecretsList =
  AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsSecretsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails,
);
export interface AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails {
  Namespace?: string;
  Value?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails =
  S.suspend(() =>
    S.Struct({ Namespace: S.optional(S.String), Value: S.optional(S.String) }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsSystemControlsList =
  AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsSystemControlsList =
  S.Array(AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails);
export interface AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails {
  HardLimit?: number;
  Name?: string;
  SoftLimit?: number;
}
export const AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails = S.suspend(
  () =>
    S.Struct({
      HardLimit: S.optional(S.Number),
      Name: S.optional(S.String),
      SoftLimit: S.optional(S.Number),
    }),
).annotations({
  identifier: "AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails",
}) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsUlimitsList =
  AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsUlimitsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails,
);
export interface AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails {
  ReadOnly?: boolean;
  SourceContainer?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails =
  S.suspend(() =>
    S.Struct({
      ReadOnly: S.optional(S.Boolean),
      SourceContainer: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsVolumesFromList =
  AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsVolumesFromList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails,
);
export interface AwsEcsTaskDefinitionContainerDefinitionsDetails {
  Command?: string[];
  Cpu?: number;
  DependsOn?: AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails[];
  DisableNetworking?: boolean;
  DnsSearchDomains?: string[];
  DnsServers?: string[];
  DockerLabels?: { [key: string]: string | undefined };
  DockerSecurityOptions?: string[];
  EntryPoint?: string[];
  Environment?: AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails[];
  EnvironmentFiles?: AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails[];
  Essential?: boolean;
  ExtraHosts?: AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails[];
  FirelensConfiguration?: AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails;
  HealthCheck?: AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails;
  Hostname?: string;
  Image?: string;
  Interactive?: boolean;
  Links?: string[];
  LinuxParameters?: AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails;
  LogConfiguration?: AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails;
  Memory?: number;
  MemoryReservation?: number;
  MountPoints?: AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails[];
  Name?: string;
  PortMappings?: AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails[];
  Privileged?: boolean;
  PseudoTerminal?: boolean;
  ReadonlyRootFilesystem?: boolean;
  RepositoryCredentials?: AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails;
  ResourceRequirements?: AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails[];
  Secrets?: AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails[];
  StartTimeout?: number;
  StopTimeout?: number;
  SystemControls?: AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails[];
  Ulimits?: AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails[];
  User?: string;
  VolumesFrom?: AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails[];
  WorkingDirectory?: string;
}
export const AwsEcsTaskDefinitionContainerDefinitionsDetails = S.suspend(() =>
  S.Struct({
    Command: S.optional(NonEmptyStringList),
    Cpu: S.optional(S.Number),
    DependsOn: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsDependsOnList,
    ),
    DisableNetworking: S.optional(S.Boolean),
    DnsSearchDomains: S.optional(NonEmptyStringList),
    DnsServers: S.optional(NonEmptyStringList),
    DockerLabels: S.optional(FieldMap),
    DockerSecurityOptions: S.optional(NonEmptyStringList),
    EntryPoint: S.optional(NonEmptyStringList),
    Environment: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsEnvironmentList,
    ),
    EnvironmentFiles: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesList,
    ),
    Essential: S.optional(S.Boolean),
    ExtraHosts: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsExtraHostsList,
    ),
    FirelensConfiguration: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails,
    ),
    HealthCheck: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails,
    ),
    Hostname: S.optional(S.String),
    Image: S.optional(S.String),
    Interactive: S.optional(S.Boolean),
    Links: S.optional(NonEmptyStringList),
    LinuxParameters: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails,
    ),
    LogConfiguration: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails,
    ),
    Memory: S.optional(S.Number),
    MemoryReservation: S.optional(S.Number),
    MountPoints: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsMountPointsList,
    ),
    Name: S.optional(S.String),
    PortMappings: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsPortMappingsList,
    ),
    Privileged: S.optional(S.Boolean),
    PseudoTerminal: S.optional(S.Boolean),
    ReadonlyRootFilesystem: S.optional(S.Boolean),
    RepositoryCredentials: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails,
    ),
    ResourceRequirements: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsList,
    ),
    Secrets: S.optional(AwsEcsTaskDefinitionContainerDefinitionsSecretsList),
    StartTimeout: S.optional(S.Number),
    StopTimeout: S.optional(S.Number),
    SystemControls: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsSystemControlsList,
    ),
    Ulimits: S.optional(AwsEcsTaskDefinitionContainerDefinitionsUlimitsList),
    User: S.optional(S.String),
    VolumesFrom: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsVolumesFromList,
    ),
    WorkingDirectory: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcsTaskDefinitionContainerDefinitionsDetails",
}) as any as S.Schema<AwsEcsTaskDefinitionContainerDefinitionsDetails>;
export type AwsEcsTaskDefinitionContainerDefinitionsList =
  AwsEcsTaskDefinitionContainerDefinitionsDetails[];
export const AwsEcsTaskDefinitionContainerDefinitionsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsDetails,
);
export interface AwsEcsTaskDefinitionInferenceAcceleratorsDetails {
  DeviceName?: string;
  DeviceType?: string;
}
export const AwsEcsTaskDefinitionInferenceAcceleratorsDetails = S.suspend(() =>
  S.Struct({
    DeviceName: S.optional(S.String),
    DeviceType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcsTaskDefinitionInferenceAcceleratorsDetails",
}) as any as S.Schema<AwsEcsTaskDefinitionInferenceAcceleratorsDetails>;
export type AwsEcsTaskDefinitionInferenceAcceleratorsList =
  AwsEcsTaskDefinitionInferenceAcceleratorsDetails[];
export const AwsEcsTaskDefinitionInferenceAcceleratorsList = S.Array(
  AwsEcsTaskDefinitionInferenceAcceleratorsDetails,
);
export interface AwsEcsTaskDefinitionPlacementConstraintsDetails {
  Expression?: string;
  Type?: string;
}
export const AwsEcsTaskDefinitionPlacementConstraintsDetails = S.suspend(() =>
  S.Struct({ Expression: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "AwsEcsTaskDefinitionPlacementConstraintsDetails",
}) as any as S.Schema<AwsEcsTaskDefinitionPlacementConstraintsDetails>;
export type AwsEcsTaskDefinitionPlacementConstraintsList =
  AwsEcsTaskDefinitionPlacementConstraintsDetails[];
export const AwsEcsTaskDefinitionPlacementConstraintsList = S.Array(
  AwsEcsTaskDefinitionPlacementConstraintsDetails,
);
export interface AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails {
  Name?: string;
  Value?: string;
}
export const AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails =
  S.suspend(() =>
    S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails>;
export type AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesList =
  AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails[];
export const AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesList =
  S.Array(
    AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails,
  );
export interface AwsEcsTaskDefinitionProxyConfigurationDetails {
  ContainerName?: string;
  ProxyConfigurationProperties?: AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails[];
  Type?: string;
}
export const AwsEcsTaskDefinitionProxyConfigurationDetails = S.suspend(() =>
  S.Struct({
    ContainerName: S.optional(S.String),
    ProxyConfigurationProperties: S.optional(
      AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesList,
    ),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcsTaskDefinitionProxyConfigurationDetails",
}) as any as S.Schema<AwsEcsTaskDefinitionProxyConfigurationDetails>;
export interface AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails {
  Autoprovision?: boolean;
  Driver?: string;
  DriverOpts?: { [key: string]: string | undefined };
  Labels?: { [key: string]: string | undefined };
  Scope?: string;
}
export const AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails =
  S.suspend(() =>
    S.Struct({
      Autoprovision: S.optional(S.Boolean),
      Driver: S.optional(S.String),
      DriverOpts: S.optional(FieldMap),
      Labels: S.optional(FieldMap),
      Scope: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails>;
export interface AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails {
  AccessPointId?: string;
  Iam?: string;
}
export const AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails =
  S.suspend(() =>
    S.Struct({
      AccessPointId: S.optional(S.String),
      Iam: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails>;
export interface AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails {
  AuthorizationConfig?: AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails;
  FilesystemId?: string;
  RootDirectory?: string;
  TransitEncryption?: string;
  TransitEncryptionPort?: number;
}
export const AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails =
  S.suspend(() =>
    S.Struct({
      AuthorizationConfig: S.optional(
        AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails,
      ),
      FilesystemId: S.optional(S.String),
      RootDirectory: S.optional(S.String),
      TransitEncryption: S.optional(S.String),
      TransitEncryptionPort: S.optional(S.Number),
    }),
  ).annotations({
    identifier: "AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails",
  }) as any as S.Schema<AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails>;
export interface AwsEcsTaskDefinitionVolumesHostDetails {
  SourcePath?: string;
}
export const AwsEcsTaskDefinitionVolumesHostDetails = S.suspend(() =>
  S.Struct({ SourcePath: S.optional(S.String) }),
).annotations({
  identifier: "AwsEcsTaskDefinitionVolumesHostDetails",
}) as any as S.Schema<AwsEcsTaskDefinitionVolumesHostDetails>;
export interface AwsEcsTaskDefinitionVolumesDetails {
  DockerVolumeConfiguration?: AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails;
  EfsVolumeConfiguration?: AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails;
  Host?: AwsEcsTaskDefinitionVolumesHostDetails;
  Name?: string;
}
export const AwsEcsTaskDefinitionVolumesDetails = S.suspend(() =>
  S.Struct({
    DockerVolumeConfiguration: S.optional(
      AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails,
    ),
    EfsVolumeConfiguration: S.optional(
      AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails,
    ),
    Host: S.optional(AwsEcsTaskDefinitionVolumesHostDetails),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcsTaskDefinitionVolumesDetails",
}) as any as S.Schema<AwsEcsTaskDefinitionVolumesDetails>;
export type AwsEcsTaskDefinitionVolumesList =
  AwsEcsTaskDefinitionVolumesDetails[];
export const AwsEcsTaskDefinitionVolumesList = S.Array(
  AwsEcsTaskDefinitionVolumesDetails,
);
export interface AwsEcsTaskDefinitionDetails {
  ContainerDefinitions?: AwsEcsTaskDefinitionContainerDefinitionsDetails[];
  Cpu?: string;
  ExecutionRoleArn?: string;
  Family?: string;
  InferenceAccelerators?: AwsEcsTaskDefinitionInferenceAcceleratorsDetails[];
  IpcMode?: string;
  Memory?: string;
  NetworkMode?: string;
  PidMode?: string;
  PlacementConstraints?: AwsEcsTaskDefinitionPlacementConstraintsDetails[];
  ProxyConfiguration?: AwsEcsTaskDefinitionProxyConfigurationDetails;
  RequiresCompatibilities?: string[];
  TaskRoleArn?: string;
  Volumes?: AwsEcsTaskDefinitionVolumesDetails[];
  Status?: string;
}
export const AwsEcsTaskDefinitionDetails = S.suspend(() =>
  S.Struct({
    ContainerDefinitions: S.optional(
      AwsEcsTaskDefinitionContainerDefinitionsList,
    ),
    Cpu: S.optional(S.String),
    ExecutionRoleArn: S.optional(S.String),
    Family: S.optional(S.String),
    InferenceAccelerators: S.optional(
      AwsEcsTaskDefinitionInferenceAcceleratorsList,
    ),
    IpcMode: S.optional(S.String),
    Memory: S.optional(S.String),
    NetworkMode: S.optional(S.String),
    PidMode: S.optional(S.String),
    PlacementConstraints: S.optional(
      AwsEcsTaskDefinitionPlacementConstraintsList,
    ),
    ProxyConfiguration: S.optional(
      AwsEcsTaskDefinitionProxyConfigurationDetails,
    ),
    RequiresCompatibilities: S.optional(NonEmptyStringList),
    TaskRoleArn: S.optional(S.String),
    Volumes: S.optional(AwsEcsTaskDefinitionVolumesList),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcsTaskDefinitionDetails",
}) as any as S.Schema<AwsEcsTaskDefinitionDetails>;
export interface VolumeMount {
  Name?: string;
  MountPath?: string;
}
export const VolumeMount = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), MountPath: S.optional(S.String) }),
).annotations({ identifier: "VolumeMount" }) as any as S.Schema<VolumeMount>;
export type VolumeMountList = VolumeMount[];
export const VolumeMountList = S.Array(VolumeMount);
export interface ContainerDetails {
  ContainerRuntime?: string;
  Name?: string;
  ImageId?: string;
  ImageName?: string;
  LaunchedAt?: string;
  VolumeMounts?: VolumeMount[];
  Privileged?: boolean;
}
export const ContainerDetails = S.suspend(() =>
  S.Struct({
    ContainerRuntime: S.optional(S.String),
    Name: S.optional(S.String),
    ImageId: S.optional(S.String),
    ImageName: S.optional(S.String),
    LaunchedAt: S.optional(S.String),
    VolumeMounts: S.optional(VolumeMountList),
    Privileged: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ContainerDetails",
}) as any as S.Schema<ContainerDetails>;
export interface AwsRdsEventSubscriptionDetails {
  CustSubscriptionId?: string;
  CustomerAwsId?: string;
  Enabled?: boolean;
  EventCategoriesList?: string[];
  EventSubscriptionArn?: string;
  SnsTopicArn?: string;
  SourceIdsList?: string[];
  SourceType?: string;
  Status?: string;
  SubscriptionCreationTime?: string;
}
export const AwsRdsEventSubscriptionDetails = S.suspend(() =>
  S.Struct({
    CustSubscriptionId: S.optional(S.String),
    CustomerAwsId: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    EventCategoriesList: S.optional(NonEmptyStringList),
    EventSubscriptionArn: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    SourceIdsList: S.optional(NonEmptyStringList),
    SourceType: S.optional(S.String),
    Status: S.optional(S.String),
    SubscriptionCreationTime: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsEventSubscriptionDetails",
}) as any as S.Schema<AwsRdsEventSubscriptionDetails>;
export interface AwsEcsServiceCapacityProviderStrategyDetails {
  Base?: number;
  CapacityProvider?: string;
  Weight?: number;
}
export const AwsEcsServiceCapacityProviderStrategyDetails = S.suspend(() =>
  S.Struct({
    Base: S.optional(S.Number),
    CapacityProvider: S.optional(S.String),
    Weight: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsEcsServiceCapacityProviderStrategyDetails",
}) as any as S.Schema<AwsEcsServiceCapacityProviderStrategyDetails>;
export type AwsEcsServiceCapacityProviderStrategyList =
  AwsEcsServiceCapacityProviderStrategyDetails[];
export const AwsEcsServiceCapacityProviderStrategyList = S.Array(
  AwsEcsServiceCapacityProviderStrategyDetails,
);
export interface AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails {
  Enable?: boolean;
  Rollback?: boolean;
}
export const AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails =
  S.suspend(() =>
    S.Struct({
      Enable: S.optional(S.Boolean),
      Rollback: S.optional(S.Boolean),
    }),
  ).annotations({
    identifier:
      "AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails",
  }) as any as S.Schema<AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails>;
export interface AwsEcsServiceDeploymentConfigurationDetails {
  DeploymentCircuitBreaker?: AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails;
  MaximumPercent?: number;
  MinimumHealthyPercent?: number;
}
export const AwsEcsServiceDeploymentConfigurationDetails = S.suspend(() =>
  S.Struct({
    DeploymentCircuitBreaker: S.optional(
      AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails,
    ),
    MaximumPercent: S.optional(S.Number),
    MinimumHealthyPercent: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsEcsServiceDeploymentConfigurationDetails",
}) as any as S.Schema<AwsEcsServiceDeploymentConfigurationDetails>;
export interface AwsEcsServiceDeploymentControllerDetails {
  Type?: string;
}
export const AwsEcsServiceDeploymentControllerDetails = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String) }),
).annotations({
  identifier: "AwsEcsServiceDeploymentControllerDetails",
}) as any as S.Schema<AwsEcsServiceDeploymentControllerDetails>;
export interface AwsEcsServiceLoadBalancersDetails {
  ContainerName?: string;
  ContainerPort?: number;
  LoadBalancerName?: string;
  TargetGroupArn?: string;
}
export const AwsEcsServiceLoadBalancersDetails = S.suspend(() =>
  S.Struct({
    ContainerName: S.optional(S.String),
    ContainerPort: S.optional(S.Number),
    LoadBalancerName: S.optional(S.String),
    TargetGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcsServiceLoadBalancersDetails",
}) as any as S.Schema<AwsEcsServiceLoadBalancersDetails>;
export type AwsEcsServiceLoadBalancersList =
  AwsEcsServiceLoadBalancersDetails[];
export const AwsEcsServiceLoadBalancersList = S.Array(
  AwsEcsServiceLoadBalancersDetails,
);
export interface AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails {
  AssignPublicIp?: string;
  SecurityGroups?: string[];
  Subnets?: string[];
}
export const AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails =
  S.suspend(() =>
    S.Struct({
      AssignPublicIp: S.optional(S.String),
      SecurityGroups: S.optional(NonEmptyStringList),
      Subnets: S.optional(NonEmptyStringList),
    }),
  ).annotations({
    identifier: "AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails",
  }) as any as S.Schema<AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails>;
export interface AwsEcsServiceNetworkConfigurationDetails {
  AwsVpcConfiguration?: AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails;
}
export const AwsEcsServiceNetworkConfigurationDetails = S.suspend(() =>
  S.Struct({
    AwsVpcConfiguration: S.optional(
      AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails,
    ),
  }),
).annotations({
  identifier: "AwsEcsServiceNetworkConfigurationDetails",
}) as any as S.Schema<AwsEcsServiceNetworkConfigurationDetails>;
export interface AwsEcsServicePlacementConstraintsDetails {
  Expression?: string;
  Type?: string;
}
export const AwsEcsServicePlacementConstraintsDetails = S.suspend(() =>
  S.Struct({ Expression: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "AwsEcsServicePlacementConstraintsDetails",
}) as any as S.Schema<AwsEcsServicePlacementConstraintsDetails>;
export type AwsEcsServicePlacementConstraintsList =
  AwsEcsServicePlacementConstraintsDetails[];
export const AwsEcsServicePlacementConstraintsList = S.Array(
  AwsEcsServicePlacementConstraintsDetails,
);
export interface AwsEcsServicePlacementStrategiesDetails {
  Field?: string;
  Type?: string;
}
export const AwsEcsServicePlacementStrategiesDetails = S.suspend(() =>
  S.Struct({ Field: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "AwsEcsServicePlacementStrategiesDetails",
}) as any as S.Schema<AwsEcsServicePlacementStrategiesDetails>;
export type AwsEcsServicePlacementStrategiesList =
  AwsEcsServicePlacementStrategiesDetails[];
export const AwsEcsServicePlacementStrategiesList = S.Array(
  AwsEcsServicePlacementStrategiesDetails,
);
export interface AwsEcsServiceServiceRegistriesDetails {
  ContainerName?: string;
  ContainerPort?: number;
  Port?: number;
  RegistryArn?: string;
}
export const AwsEcsServiceServiceRegistriesDetails = S.suspend(() =>
  S.Struct({
    ContainerName: S.optional(S.String),
    ContainerPort: S.optional(S.Number),
    Port: S.optional(S.Number),
    RegistryArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcsServiceServiceRegistriesDetails",
}) as any as S.Schema<AwsEcsServiceServiceRegistriesDetails>;
export type AwsEcsServiceServiceRegistriesList =
  AwsEcsServiceServiceRegistriesDetails[];
export const AwsEcsServiceServiceRegistriesList = S.Array(
  AwsEcsServiceServiceRegistriesDetails,
);
export interface AwsEcsServiceDetails {
  CapacityProviderStrategy?: AwsEcsServiceCapacityProviderStrategyDetails[];
  Cluster?: string;
  DeploymentConfiguration?: AwsEcsServiceDeploymentConfigurationDetails;
  DeploymentController?: AwsEcsServiceDeploymentControllerDetails;
  DesiredCount?: number;
  EnableEcsManagedTags?: boolean;
  EnableExecuteCommand?: boolean;
  HealthCheckGracePeriodSeconds?: number;
  LaunchType?: string;
  LoadBalancers?: AwsEcsServiceLoadBalancersDetails[];
  Name?: string;
  NetworkConfiguration?: AwsEcsServiceNetworkConfigurationDetails;
  PlacementConstraints?: AwsEcsServicePlacementConstraintsDetails[];
  PlacementStrategies?: AwsEcsServicePlacementStrategiesDetails[];
  PlatformVersion?: string;
  PropagateTags?: string;
  Role?: string;
  SchedulingStrategy?: string;
  ServiceArn?: string;
  ServiceName?: string;
  ServiceRegistries?: AwsEcsServiceServiceRegistriesDetails[];
  TaskDefinition?: string;
}
export const AwsEcsServiceDetails = S.suspend(() =>
  S.Struct({
    CapacityProviderStrategy: S.optional(
      AwsEcsServiceCapacityProviderStrategyList,
    ),
    Cluster: S.optional(S.String),
    DeploymentConfiguration: S.optional(
      AwsEcsServiceDeploymentConfigurationDetails,
    ),
    DeploymentController: S.optional(AwsEcsServiceDeploymentControllerDetails),
    DesiredCount: S.optional(S.Number),
    EnableEcsManagedTags: S.optional(S.Boolean),
    EnableExecuteCommand: S.optional(S.Boolean),
    HealthCheckGracePeriodSeconds: S.optional(S.Number),
    LaunchType: S.optional(S.String),
    LoadBalancers: S.optional(AwsEcsServiceLoadBalancersList),
    Name: S.optional(S.String),
    NetworkConfiguration: S.optional(AwsEcsServiceNetworkConfigurationDetails),
    PlacementConstraints: S.optional(AwsEcsServicePlacementConstraintsList),
    PlacementStrategies: S.optional(AwsEcsServicePlacementStrategiesList),
    PlatformVersion: S.optional(S.String),
    PropagateTags: S.optional(S.String),
    Role: S.optional(S.String),
    SchedulingStrategy: S.optional(S.String),
    ServiceArn: S.optional(S.String),
    ServiceName: S.optional(S.String),
    ServiceRegistries: S.optional(AwsEcsServiceServiceRegistriesList),
    TaskDefinition: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcsServiceDetails",
}) as any as S.Schema<AwsEcsServiceDetails>;
export interface AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails {
  DeleteOnTermination?: boolean;
  Encrypted?: boolean;
  Iops?: number;
  SnapshotId?: string;
  VolumeSize?: number;
  VolumeType?: string;
}
export const AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails =
  S.suspend(() =>
    S.Struct({
      DeleteOnTermination: S.optional(S.Boolean),
      Encrypted: S.optional(S.Boolean),
      Iops: S.optional(S.Number),
      SnapshotId: S.optional(S.String),
      VolumeSize: S.optional(S.Number),
      VolumeType: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails",
  }) as any as S.Schema<AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails>;
export interface AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails {
  DeviceName?: string;
  Ebs?: AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails;
  NoDevice?: boolean;
  VirtualName?: string;
}
export const AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails =
  S.suspend(() =>
    S.Struct({
      DeviceName: S.optional(S.String),
      Ebs: S.optional(
        AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails,
      ),
      NoDevice: S.optional(S.Boolean),
      VirtualName: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails",
  }) as any as S.Schema<AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails>;
export type AwsAutoScalingLaunchConfigurationBlockDeviceMappingsList =
  AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails[];
export const AwsAutoScalingLaunchConfigurationBlockDeviceMappingsList = S.Array(
  AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails,
);
export interface AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails {
  Enabled?: boolean;
}
export const AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails =
  S.suspend(() => S.Struct({ Enabled: S.optional(S.Boolean) })).annotations({
    identifier: "AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails",
  }) as any as S.Schema<AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails>;
export interface AwsAutoScalingLaunchConfigurationMetadataOptions {
  HttpEndpoint?: string;
  HttpPutResponseHopLimit?: number;
  HttpTokens?: string;
}
export const AwsAutoScalingLaunchConfigurationMetadataOptions = S.suspend(() =>
  S.Struct({
    HttpEndpoint: S.optional(S.String),
    HttpPutResponseHopLimit: S.optional(S.Number),
    HttpTokens: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsAutoScalingLaunchConfigurationMetadataOptions",
}) as any as S.Schema<AwsAutoScalingLaunchConfigurationMetadataOptions>;
export interface AwsAutoScalingLaunchConfigurationDetails {
  AssociatePublicIpAddress?: boolean;
  BlockDeviceMappings?: AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails[];
  ClassicLinkVpcId?: string;
  ClassicLinkVpcSecurityGroups?: string[];
  CreatedTime?: string;
  EbsOptimized?: boolean;
  IamInstanceProfile?: string;
  ImageId?: string;
  InstanceMonitoring?: AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails;
  InstanceType?: string;
  KernelId?: string;
  KeyName?: string;
  LaunchConfigurationName?: string;
  PlacementTenancy?: string;
  RamdiskId?: string;
  SecurityGroups?: string[];
  SpotPrice?: string;
  UserData?: string;
  MetadataOptions?: AwsAutoScalingLaunchConfigurationMetadataOptions;
}
export const AwsAutoScalingLaunchConfigurationDetails = S.suspend(() =>
  S.Struct({
    AssociatePublicIpAddress: S.optional(S.Boolean),
    BlockDeviceMappings: S.optional(
      AwsAutoScalingLaunchConfigurationBlockDeviceMappingsList,
    ),
    ClassicLinkVpcId: S.optional(S.String),
    ClassicLinkVpcSecurityGroups: S.optional(NonEmptyStringList),
    CreatedTime: S.optional(S.String),
    EbsOptimized: S.optional(S.Boolean),
    IamInstanceProfile: S.optional(S.String),
    ImageId: S.optional(S.String),
    InstanceMonitoring: S.optional(
      AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails,
    ),
    InstanceType: S.optional(S.String),
    KernelId: S.optional(S.String),
    KeyName: S.optional(S.String),
    LaunchConfigurationName: S.optional(S.String),
    PlacementTenancy: S.optional(S.String),
    RamdiskId: S.optional(S.String),
    SecurityGroups: S.optional(NonEmptyStringList),
    SpotPrice: S.optional(S.String),
    UserData: S.optional(S.String),
    MetadataOptions: S.optional(
      AwsAutoScalingLaunchConfigurationMetadataOptions,
    ),
  }),
).annotations({
  identifier: "AwsAutoScalingLaunchConfigurationDetails",
}) as any as S.Schema<AwsAutoScalingLaunchConfigurationDetails>;
export interface AwsEc2VpnConnectionVgwTelemetryDetails {
  AcceptedRouteCount?: number;
  CertificateArn?: string;
  LastStatusChange?: string;
  OutsideIpAddress?: string;
  Status?: string;
  StatusMessage?: string;
}
export const AwsEc2VpnConnectionVgwTelemetryDetails = S.suspend(() =>
  S.Struct({
    AcceptedRouteCount: S.optional(S.Number),
    CertificateArn: S.optional(S.String),
    LastStatusChange: S.optional(S.String),
    OutsideIpAddress: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2VpnConnectionVgwTelemetryDetails",
}) as any as S.Schema<AwsEc2VpnConnectionVgwTelemetryDetails>;
export type AwsEc2VpnConnectionVgwTelemetryList =
  AwsEc2VpnConnectionVgwTelemetryDetails[];
export const AwsEc2VpnConnectionVgwTelemetryList = S.Array(
  AwsEc2VpnConnectionVgwTelemetryDetails,
);
export interface AwsEc2VpnConnectionOptionsTunnelOptionsDetails {
  DpdTimeoutSeconds?: number;
  IkeVersions?: string[];
  OutsideIpAddress?: string;
  Phase1DhGroupNumbers?: number[];
  Phase1EncryptionAlgorithms?: string[];
  Phase1IntegrityAlgorithms?: string[];
  Phase1LifetimeSeconds?: number;
  Phase2DhGroupNumbers?: number[];
  Phase2EncryptionAlgorithms?: string[];
  Phase2IntegrityAlgorithms?: string[];
  Phase2LifetimeSeconds?: number;
  PreSharedKey?: string;
  RekeyFuzzPercentage?: number;
  RekeyMarginTimeSeconds?: number;
  ReplayWindowSize?: number;
  TunnelInsideCidr?: string;
}
export const AwsEc2VpnConnectionOptionsTunnelOptionsDetails = S.suspend(() =>
  S.Struct({
    DpdTimeoutSeconds: S.optional(S.Number),
    IkeVersions: S.optional(NonEmptyStringList),
    OutsideIpAddress: S.optional(S.String),
    Phase1DhGroupNumbers: S.optional(IntegerList),
    Phase1EncryptionAlgorithms: S.optional(NonEmptyStringList),
    Phase1IntegrityAlgorithms: S.optional(NonEmptyStringList),
    Phase1LifetimeSeconds: S.optional(S.Number),
    Phase2DhGroupNumbers: S.optional(IntegerList),
    Phase2EncryptionAlgorithms: S.optional(NonEmptyStringList),
    Phase2IntegrityAlgorithms: S.optional(NonEmptyStringList),
    Phase2LifetimeSeconds: S.optional(S.Number),
    PreSharedKey: S.optional(S.String),
    RekeyFuzzPercentage: S.optional(S.Number),
    RekeyMarginTimeSeconds: S.optional(S.Number),
    ReplayWindowSize: S.optional(S.Number),
    TunnelInsideCidr: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2VpnConnectionOptionsTunnelOptionsDetails",
}) as any as S.Schema<AwsEc2VpnConnectionOptionsTunnelOptionsDetails>;
export type AwsEc2VpnConnectionOptionsTunnelOptionsList =
  AwsEc2VpnConnectionOptionsTunnelOptionsDetails[];
export const AwsEc2VpnConnectionOptionsTunnelOptionsList = S.Array(
  AwsEc2VpnConnectionOptionsTunnelOptionsDetails,
);
export interface AwsEc2VpnConnectionOptionsDetails {
  StaticRoutesOnly?: boolean;
  TunnelOptions?: AwsEc2VpnConnectionOptionsTunnelOptionsDetails[];
}
export const AwsEc2VpnConnectionOptionsDetails = S.suspend(() =>
  S.Struct({
    StaticRoutesOnly: S.optional(S.Boolean),
    TunnelOptions: S.optional(AwsEc2VpnConnectionOptionsTunnelOptionsList),
  }),
).annotations({
  identifier: "AwsEc2VpnConnectionOptionsDetails",
}) as any as S.Schema<AwsEc2VpnConnectionOptionsDetails>;
export interface AwsEc2VpnConnectionRoutesDetails {
  DestinationCidrBlock?: string;
  State?: string;
}
export const AwsEc2VpnConnectionRoutesDetails = S.suspend(() =>
  S.Struct({
    DestinationCidrBlock: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2VpnConnectionRoutesDetails",
}) as any as S.Schema<AwsEc2VpnConnectionRoutesDetails>;
export type AwsEc2VpnConnectionRoutesList = AwsEc2VpnConnectionRoutesDetails[];
export const AwsEc2VpnConnectionRoutesList = S.Array(
  AwsEc2VpnConnectionRoutesDetails,
);
export interface AwsEc2VpnConnectionDetails {
  VpnConnectionId?: string;
  State?: string;
  CustomerGatewayId?: string;
  CustomerGatewayConfiguration?: string;
  Type?: string;
  VpnGatewayId?: string;
  Category?: string;
  VgwTelemetry?: AwsEc2VpnConnectionVgwTelemetryDetails[];
  Options?: AwsEc2VpnConnectionOptionsDetails;
  Routes?: AwsEc2VpnConnectionRoutesDetails[];
  TransitGatewayId?: string;
}
export const AwsEc2VpnConnectionDetails = S.suspend(() =>
  S.Struct({
    VpnConnectionId: S.optional(S.String),
    State: S.optional(S.String),
    CustomerGatewayId: S.optional(S.String),
    CustomerGatewayConfiguration: S.optional(S.String),
    Type: S.optional(S.String),
    VpnGatewayId: S.optional(S.String),
    Category: S.optional(S.String),
    VgwTelemetry: S.optional(AwsEc2VpnConnectionVgwTelemetryList),
    Options: S.optional(AwsEc2VpnConnectionOptionsDetails),
    Routes: S.optional(AwsEc2VpnConnectionRoutesList),
    TransitGatewayId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2VpnConnectionDetails",
}) as any as S.Schema<AwsEc2VpnConnectionDetails>;
export interface AwsEcrContainerImageDetails {
  RegistryId?: string;
  RepositoryName?: string;
  Architecture?: string;
  ImageDigest?: string;
  ImageTags?: string[];
  ImagePublishedAt?: string;
}
export const AwsEcrContainerImageDetails = S.suspend(() =>
  S.Struct({
    RegistryId: S.optional(S.String),
    RepositoryName: S.optional(S.String),
    Architecture: S.optional(S.String),
    ImageDigest: S.optional(S.String),
    ImageTags: S.optional(NonEmptyStringList),
    ImagePublishedAt: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcrContainerImageDetails",
}) as any as S.Schema<AwsEcrContainerImageDetails>;
export interface AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails {
  Enabled?: boolean;
  KmsKeyId?: string;
}
export const AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails =
  S.suspend(() =>
    S.Struct({
      Enabled: S.optional(S.Boolean),
      KmsKeyId: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails",
  }) as any as S.Schema<AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails>;
export interface AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails {
  Enabled?: boolean;
}
export const AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails =
  S.suspend(() => S.Struct({ Enabled: S.optional(S.Boolean) })).annotations({
    identifier: "AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails",
  }) as any as S.Schema<AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails>;
export interface AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails {
  AutomatedUpdateDate?: string;
  Cancellable?: boolean;
  CurrentVersion?: string;
  Description?: string;
  NewVersion?: string;
  UpdateAvailable?: boolean;
  UpdateStatus?: string;
  OptionalDeployment?: boolean;
}
export const AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails =
  S.suspend(() =>
    S.Struct({
      AutomatedUpdateDate: S.optional(S.String),
      Cancellable: S.optional(S.Boolean),
      CurrentVersion: S.optional(S.String),
      Description: S.optional(S.String),
      NewVersion: S.optional(S.String),
      UpdateAvailable: S.optional(S.Boolean),
      UpdateStatus: S.optional(S.String),
      OptionalDeployment: S.optional(S.Boolean),
    }),
  ).annotations({
    identifier: "AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails",
  }) as any as S.Schema<AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails>;
export interface AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails {
  AvailabilityZoneCount?: number;
}
export const AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails =
  S.suspend(() =>
    S.Struct({ AvailabilityZoneCount: S.optional(S.Number) }),
  ).annotations({
    identifier:
      "AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails",
  }) as any as S.Schema<AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails>;
export interface AwsOpenSearchServiceDomainClusterConfigDetails {
  InstanceCount?: number;
  WarmEnabled?: boolean;
  WarmCount?: number;
  DedicatedMasterEnabled?: boolean;
  ZoneAwarenessConfig?: AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails;
  DedicatedMasterCount?: number;
  InstanceType?: string;
  WarmType?: string;
  ZoneAwarenessEnabled?: boolean;
  DedicatedMasterType?: string;
}
export const AwsOpenSearchServiceDomainClusterConfigDetails = S.suspend(() =>
  S.Struct({
    InstanceCount: S.optional(S.Number),
    WarmEnabled: S.optional(S.Boolean),
    WarmCount: S.optional(S.Number),
    DedicatedMasterEnabled: S.optional(S.Boolean),
    ZoneAwarenessConfig: S.optional(
      AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails,
    ),
    DedicatedMasterCount: S.optional(S.Number),
    InstanceType: S.optional(S.String),
    WarmType: S.optional(S.String),
    ZoneAwarenessEnabled: S.optional(S.Boolean),
    DedicatedMasterType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsOpenSearchServiceDomainClusterConfigDetails",
}) as any as S.Schema<AwsOpenSearchServiceDomainClusterConfigDetails>;
export interface AwsOpenSearchServiceDomainDomainEndpointOptionsDetails {
  CustomEndpointCertificateArn?: string;
  CustomEndpointEnabled?: boolean;
  EnforceHTTPS?: boolean;
  CustomEndpoint?: string;
  TLSSecurityPolicy?: string;
}
export const AwsOpenSearchServiceDomainDomainEndpointOptionsDetails = S.suspend(
  () =>
    S.Struct({
      CustomEndpointCertificateArn: S.optional(S.String),
      CustomEndpointEnabled: S.optional(S.Boolean),
      EnforceHTTPS: S.optional(S.Boolean),
      CustomEndpoint: S.optional(S.String),
      TLSSecurityPolicy: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsOpenSearchServiceDomainDomainEndpointOptionsDetails",
}) as any as S.Schema<AwsOpenSearchServiceDomainDomainEndpointOptionsDetails>;
export interface AwsOpenSearchServiceDomainVpcOptionsDetails {
  SecurityGroupIds?: string[];
  SubnetIds?: string[];
}
export const AwsOpenSearchServiceDomainVpcOptionsDetails = S.suspend(() =>
  S.Struct({
    SecurityGroupIds: S.optional(NonEmptyStringList),
    SubnetIds: S.optional(NonEmptyStringList),
  }),
).annotations({
  identifier: "AwsOpenSearchServiceDomainVpcOptionsDetails",
}) as any as S.Schema<AwsOpenSearchServiceDomainVpcOptionsDetails>;
export interface AwsOpenSearchServiceDomainLogPublishingOption {
  CloudWatchLogsLogGroupArn?: string;
  Enabled?: boolean;
}
export const AwsOpenSearchServiceDomainLogPublishingOption = S.suspend(() =>
  S.Struct({
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsOpenSearchServiceDomainLogPublishingOption",
}) as any as S.Schema<AwsOpenSearchServiceDomainLogPublishingOption>;
export interface AwsOpenSearchServiceDomainLogPublishingOptionsDetails {
  IndexSlowLogs?: AwsOpenSearchServiceDomainLogPublishingOption;
  SearchSlowLogs?: AwsOpenSearchServiceDomainLogPublishingOption;
  AuditLogs?: AwsOpenSearchServiceDomainLogPublishingOption;
}
export const AwsOpenSearchServiceDomainLogPublishingOptionsDetails = S.suspend(
  () =>
    S.Struct({
      IndexSlowLogs: S.optional(AwsOpenSearchServiceDomainLogPublishingOption),
      SearchSlowLogs: S.optional(AwsOpenSearchServiceDomainLogPublishingOption),
      AuditLogs: S.optional(AwsOpenSearchServiceDomainLogPublishingOption),
    }),
).annotations({
  identifier: "AwsOpenSearchServiceDomainLogPublishingOptionsDetails",
}) as any as S.Schema<AwsOpenSearchServiceDomainLogPublishingOptionsDetails>;
export interface AwsOpenSearchServiceDomainMasterUserOptionsDetails {
  MasterUserArn?: string;
  MasterUserName?: string;
  MasterUserPassword?: string;
}
export const AwsOpenSearchServiceDomainMasterUserOptionsDetails = S.suspend(
  () =>
    S.Struct({
      MasterUserArn: S.optional(S.String),
      MasterUserName: S.optional(S.String),
      MasterUserPassword: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsOpenSearchServiceDomainMasterUserOptionsDetails",
}) as any as S.Schema<AwsOpenSearchServiceDomainMasterUserOptionsDetails>;
export interface AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails {
  Enabled?: boolean;
  InternalUserDatabaseEnabled?: boolean;
  MasterUserOptions?: AwsOpenSearchServiceDomainMasterUserOptionsDetails;
}
export const AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails =
  S.suspend(() =>
    S.Struct({
      Enabled: S.optional(S.Boolean),
      InternalUserDatabaseEnabled: S.optional(S.Boolean),
      MasterUserOptions: S.optional(
        AwsOpenSearchServiceDomainMasterUserOptionsDetails,
      ),
    }),
  ).annotations({
    identifier: "AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails",
  }) as any as S.Schema<AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails>;
export interface AwsOpenSearchServiceDomainDetails {
  Arn?: string;
  AccessPolicies?: string;
  DomainName?: string;
  Id?: string;
  DomainEndpoint?: string;
  EngineVersion?: string;
  EncryptionAtRestOptions?: AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails;
  NodeToNodeEncryptionOptions?: AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails;
  ServiceSoftwareOptions?: AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails;
  ClusterConfig?: AwsOpenSearchServiceDomainClusterConfigDetails;
  DomainEndpointOptions?: AwsOpenSearchServiceDomainDomainEndpointOptionsDetails;
  VpcOptions?: AwsOpenSearchServiceDomainVpcOptionsDetails;
  LogPublishingOptions?: AwsOpenSearchServiceDomainLogPublishingOptionsDetails;
  DomainEndpoints?: { [key: string]: string | undefined };
  AdvancedSecurityOptions?: AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails;
}
export const AwsOpenSearchServiceDomainDetails = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AccessPolicies: S.optional(S.String),
    DomainName: S.optional(S.String),
    Id: S.optional(S.String),
    DomainEndpoint: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    EncryptionAtRestOptions: S.optional(
      AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails,
    ),
    NodeToNodeEncryptionOptions: S.optional(
      AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails,
    ),
    ServiceSoftwareOptions: S.optional(
      AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails,
    ),
    ClusterConfig: S.optional(AwsOpenSearchServiceDomainClusterConfigDetails),
    DomainEndpointOptions: S.optional(
      AwsOpenSearchServiceDomainDomainEndpointOptionsDetails,
    ),
    VpcOptions: S.optional(AwsOpenSearchServiceDomainVpcOptionsDetails),
    LogPublishingOptions: S.optional(
      AwsOpenSearchServiceDomainLogPublishingOptionsDetails,
    ),
    DomainEndpoints: S.optional(FieldMap),
    AdvancedSecurityOptions: S.optional(
      AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails,
    ),
  }),
).annotations({
  identifier: "AwsOpenSearchServiceDomainDetails",
}) as any as S.Schema<AwsOpenSearchServiceDomainDetails>;
export interface AwsEc2VpcEndpointServiceServiceTypeDetails {
  ServiceType?: string;
}
export const AwsEc2VpcEndpointServiceServiceTypeDetails = S.suspend(() =>
  S.Struct({ ServiceType: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2VpcEndpointServiceServiceTypeDetails",
}) as any as S.Schema<AwsEc2VpcEndpointServiceServiceTypeDetails>;
export type AwsEc2VpcEndpointServiceServiceTypeList =
  AwsEc2VpcEndpointServiceServiceTypeDetails[];
export const AwsEc2VpcEndpointServiceServiceTypeList = S.Array(
  AwsEc2VpcEndpointServiceServiceTypeDetails,
);
export interface AwsEc2VpcEndpointServiceDetails {
  AcceptanceRequired?: boolean;
  AvailabilityZones?: string[];
  BaseEndpointDnsNames?: string[];
  ManagesVpcEndpoints?: boolean;
  GatewayLoadBalancerArns?: string[];
  NetworkLoadBalancerArns?: string[];
  PrivateDnsName?: string;
  ServiceId?: string;
  ServiceName?: string;
  ServiceState?: string;
  ServiceType?: AwsEc2VpcEndpointServiceServiceTypeDetails[];
}
export const AwsEc2VpcEndpointServiceDetails = S.suspend(() =>
  S.Struct({
    AcceptanceRequired: S.optional(S.Boolean),
    AvailabilityZones: S.optional(NonEmptyStringList),
    BaseEndpointDnsNames: S.optional(NonEmptyStringList),
    ManagesVpcEndpoints: S.optional(S.Boolean),
    GatewayLoadBalancerArns: S.optional(NonEmptyStringList),
    NetworkLoadBalancerArns: S.optional(NonEmptyStringList),
    PrivateDnsName: S.optional(S.String),
    ServiceId: S.optional(S.String),
    ServiceName: S.optional(S.String),
    ServiceState: S.optional(S.String),
    ServiceType: S.optional(AwsEc2VpcEndpointServiceServiceTypeList),
  }),
).annotations({
  identifier: "AwsEc2VpcEndpointServiceDetails",
}) as any as S.Schema<AwsEc2VpcEndpointServiceDetails>;
export interface AwsXrayEncryptionConfigDetails {
  KeyId?: string;
  Status?: string;
  Type?: string;
}
export const AwsXrayEncryptionConfigDetails = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    Status: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsXrayEncryptionConfigDetails",
}) as any as S.Schema<AwsXrayEncryptionConfigDetails>;
export interface AwsWafRateBasedRuleMatchPredicate {
  DataId?: string;
  Negated?: boolean;
  Type?: string;
}
export const AwsWafRateBasedRuleMatchPredicate = S.suspend(() =>
  S.Struct({
    DataId: S.optional(S.String),
    Negated: S.optional(S.Boolean),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRateBasedRuleMatchPredicate",
}) as any as S.Schema<AwsWafRateBasedRuleMatchPredicate>;
export type AwsWafRateBasedRuleMatchPredicateList =
  AwsWafRateBasedRuleMatchPredicate[];
export const AwsWafRateBasedRuleMatchPredicateList = S.Array(
  AwsWafRateBasedRuleMatchPredicate,
);
export interface AwsWafRateBasedRuleDetails {
  MetricName?: string;
  Name?: string;
  RateKey?: string;
  RateLimit?: number;
  RuleId?: string;
  MatchPredicates?: AwsWafRateBasedRuleMatchPredicate[];
}
export const AwsWafRateBasedRuleDetails = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Name: S.optional(S.String),
    RateKey: S.optional(S.String),
    RateLimit: S.optional(S.Number),
    RuleId: S.optional(S.String),
    MatchPredicates: S.optional(AwsWafRateBasedRuleMatchPredicateList),
  }),
).annotations({
  identifier: "AwsWafRateBasedRuleDetails",
}) as any as S.Schema<AwsWafRateBasedRuleDetails>;
export interface AwsWafRegionalRateBasedRuleMatchPredicate {
  DataId?: string;
  Negated?: boolean;
  Type?: string;
}
export const AwsWafRegionalRateBasedRuleMatchPredicate = S.suspend(() =>
  S.Struct({
    DataId: S.optional(S.String),
    Negated: S.optional(S.Boolean),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRegionalRateBasedRuleMatchPredicate",
}) as any as S.Schema<AwsWafRegionalRateBasedRuleMatchPredicate>;
export type AwsWafRegionalRateBasedRuleMatchPredicateList =
  AwsWafRegionalRateBasedRuleMatchPredicate[];
export const AwsWafRegionalRateBasedRuleMatchPredicateList = S.Array(
  AwsWafRegionalRateBasedRuleMatchPredicate,
);
export interface AwsWafRegionalRateBasedRuleDetails {
  MetricName?: string;
  Name?: string;
  RateKey?: string;
  RateLimit?: number;
  RuleId?: string;
  MatchPredicates?: AwsWafRegionalRateBasedRuleMatchPredicate[];
}
export const AwsWafRegionalRateBasedRuleDetails = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Name: S.optional(S.String),
    RateKey: S.optional(S.String),
    RateLimit: S.optional(S.Number),
    RuleId: S.optional(S.String),
    MatchPredicates: S.optional(AwsWafRegionalRateBasedRuleMatchPredicateList),
  }),
).annotations({
  identifier: "AwsWafRegionalRateBasedRuleDetails",
}) as any as S.Schema<AwsWafRegionalRateBasedRuleDetails>;
export interface AwsEcrRepositoryImageScanningConfigurationDetails {
  ScanOnPush?: boolean;
}
export const AwsEcrRepositoryImageScanningConfigurationDetails = S.suspend(() =>
  S.Struct({ ScanOnPush: S.optional(S.Boolean) }),
).annotations({
  identifier: "AwsEcrRepositoryImageScanningConfigurationDetails",
}) as any as S.Schema<AwsEcrRepositoryImageScanningConfigurationDetails>;
export interface AwsEcrRepositoryLifecyclePolicyDetails {
  LifecyclePolicyText?: string;
  RegistryId?: string;
}
export const AwsEcrRepositoryLifecyclePolicyDetails = S.suspend(() =>
  S.Struct({
    LifecyclePolicyText: S.optional(S.String),
    RegistryId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcrRepositoryLifecyclePolicyDetails",
}) as any as S.Schema<AwsEcrRepositoryLifecyclePolicyDetails>;
export interface AwsEcrRepositoryDetails {
  Arn?: string;
  ImageScanningConfiguration?: AwsEcrRepositoryImageScanningConfigurationDetails;
  ImageTagMutability?: string;
  LifecyclePolicy?: AwsEcrRepositoryLifecyclePolicyDetails;
  RepositoryName?: string;
  RepositoryPolicyText?: string;
}
export const AwsEcrRepositoryDetails = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ImageScanningConfiguration: S.optional(
      AwsEcrRepositoryImageScanningConfigurationDetails,
    ),
    ImageTagMutability: S.optional(S.String),
    LifecyclePolicy: S.optional(AwsEcrRepositoryLifecyclePolicyDetails),
    RepositoryName: S.optional(S.String),
    RepositoryPolicyText: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcrRepositoryDetails",
}) as any as S.Schema<AwsEcrRepositoryDetails>;
export interface AwsEksClusterResourcesVpcConfigDetails {
  SecurityGroupIds?: string[];
  SubnetIds?: string[];
  EndpointPublicAccess?: boolean;
}
export const AwsEksClusterResourcesVpcConfigDetails = S.suspend(() =>
  S.Struct({
    SecurityGroupIds: S.optional(NonEmptyStringList),
    SubnetIds: S.optional(NonEmptyStringList),
    EndpointPublicAccess: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsEksClusterResourcesVpcConfigDetails",
}) as any as S.Schema<AwsEksClusterResourcesVpcConfigDetails>;
export interface AwsEksClusterLoggingClusterLoggingDetails {
  Enabled?: boolean;
  Types?: string[];
}
export const AwsEksClusterLoggingClusterLoggingDetails = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    Types: S.optional(NonEmptyStringList),
  }),
).annotations({
  identifier: "AwsEksClusterLoggingClusterLoggingDetails",
}) as any as S.Schema<AwsEksClusterLoggingClusterLoggingDetails>;
export type AwsEksClusterLoggingClusterLoggingList =
  AwsEksClusterLoggingClusterLoggingDetails[];
export const AwsEksClusterLoggingClusterLoggingList = S.Array(
  AwsEksClusterLoggingClusterLoggingDetails,
);
export interface AwsEksClusterLoggingDetails {
  ClusterLogging?: AwsEksClusterLoggingClusterLoggingDetails[];
}
export const AwsEksClusterLoggingDetails = S.suspend(() =>
  S.Struct({
    ClusterLogging: S.optional(AwsEksClusterLoggingClusterLoggingList),
  }),
).annotations({
  identifier: "AwsEksClusterLoggingDetails",
}) as any as S.Schema<AwsEksClusterLoggingDetails>;
export interface AwsEksClusterDetails {
  Arn?: string;
  CertificateAuthorityData?: string;
  ClusterStatus?: string;
  Endpoint?: string;
  Name?: string;
  ResourcesVpcConfig?: AwsEksClusterResourcesVpcConfigDetails;
  RoleArn?: string;
  Version?: string;
  Logging?: AwsEksClusterLoggingDetails;
}
export const AwsEksClusterDetails = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CertificateAuthorityData: S.optional(S.String),
    ClusterStatus: S.optional(S.String),
    Endpoint: S.optional(S.String),
    Name: S.optional(S.String),
    ResourcesVpcConfig: S.optional(AwsEksClusterResourcesVpcConfigDetails),
    RoleArn: S.optional(S.String),
    Version: S.optional(S.String),
    Logging: S.optional(AwsEksClusterLoggingDetails),
  }),
).annotations({
  identifier: "AwsEksClusterDetails",
}) as any as S.Schema<AwsEksClusterDetails>;
export interface FirewallPolicyStatefulRuleGroupReferencesDetails {
  ResourceArn?: string;
}
export const FirewallPolicyStatefulRuleGroupReferencesDetails = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String) }),
).annotations({
  identifier: "FirewallPolicyStatefulRuleGroupReferencesDetails",
}) as any as S.Schema<FirewallPolicyStatefulRuleGroupReferencesDetails>;
export type FirewallPolicyStatefulRuleGroupReferencesList =
  FirewallPolicyStatefulRuleGroupReferencesDetails[];
export const FirewallPolicyStatefulRuleGroupReferencesList = S.Array(
  FirewallPolicyStatefulRuleGroupReferencesDetails,
);
export interface StatelessCustomPublishMetricActionDimension {
  Value?: string;
}
export const StatelessCustomPublishMetricActionDimension = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String) }),
).annotations({
  identifier: "StatelessCustomPublishMetricActionDimension",
}) as any as S.Schema<StatelessCustomPublishMetricActionDimension>;
export type StatelessCustomPublishMetricActionDimensionsList =
  StatelessCustomPublishMetricActionDimension[];
export const StatelessCustomPublishMetricActionDimensionsList = S.Array(
  StatelessCustomPublishMetricActionDimension,
);
export interface StatelessCustomPublishMetricAction {
  Dimensions?: StatelessCustomPublishMetricActionDimension[];
}
export const StatelessCustomPublishMetricAction = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(StatelessCustomPublishMetricActionDimensionsList),
  }),
).annotations({
  identifier: "StatelessCustomPublishMetricAction",
}) as any as S.Schema<StatelessCustomPublishMetricAction>;
export interface StatelessCustomActionDefinition {
  PublishMetricAction?: StatelessCustomPublishMetricAction;
}
export const StatelessCustomActionDefinition = S.suspend(() =>
  S.Struct({
    PublishMetricAction: S.optional(StatelessCustomPublishMetricAction),
  }),
).annotations({
  identifier: "StatelessCustomActionDefinition",
}) as any as S.Schema<StatelessCustomActionDefinition>;
export interface FirewallPolicyStatelessCustomActionsDetails {
  ActionDefinition?: StatelessCustomActionDefinition;
  ActionName?: string;
}
export const FirewallPolicyStatelessCustomActionsDetails = S.suspend(() =>
  S.Struct({
    ActionDefinition: S.optional(StatelessCustomActionDefinition),
    ActionName: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallPolicyStatelessCustomActionsDetails",
}) as any as S.Schema<FirewallPolicyStatelessCustomActionsDetails>;
export type FirewallPolicyStatelessCustomActionsList =
  FirewallPolicyStatelessCustomActionsDetails[];
export const FirewallPolicyStatelessCustomActionsList = S.Array(
  FirewallPolicyStatelessCustomActionsDetails,
);
export interface FirewallPolicyStatelessRuleGroupReferencesDetails {
  Priority?: number;
  ResourceArn?: string;
}
export const FirewallPolicyStatelessRuleGroupReferencesDetails = S.suspend(() =>
  S.Struct({
    Priority: S.optional(S.Number),
    ResourceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "FirewallPolicyStatelessRuleGroupReferencesDetails",
}) as any as S.Schema<FirewallPolicyStatelessRuleGroupReferencesDetails>;
export type FirewallPolicyStatelessRuleGroupReferencesList =
  FirewallPolicyStatelessRuleGroupReferencesDetails[];
export const FirewallPolicyStatelessRuleGroupReferencesList = S.Array(
  FirewallPolicyStatelessRuleGroupReferencesDetails,
);
export interface FirewallPolicyDetails {
  StatefulRuleGroupReferences?: FirewallPolicyStatefulRuleGroupReferencesDetails[];
  StatelessCustomActions?: FirewallPolicyStatelessCustomActionsDetails[];
  StatelessDefaultActions?: string[];
  StatelessFragmentDefaultActions?: string[];
  StatelessRuleGroupReferences?: FirewallPolicyStatelessRuleGroupReferencesDetails[];
}
export const FirewallPolicyDetails = S.suspend(() =>
  S.Struct({
    StatefulRuleGroupReferences: S.optional(
      FirewallPolicyStatefulRuleGroupReferencesList,
    ),
    StatelessCustomActions: S.optional(
      FirewallPolicyStatelessCustomActionsList,
    ),
    StatelessDefaultActions: S.optional(NonEmptyStringList),
    StatelessFragmentDefaultActions: S.optional(NonEmptyStringList),
    StatelessRuleGroupReferences: S.optional(
      FirewallPolicyStatelessRuleGroupReferencesList,
    ),
  }),
).annotations({
  identifier: "FirewallPolicyDetails",
}) as any as S.Schema<FirewallPolicyDetails>;
export interface AwsNetworkFirewallFirewallPolicyDetails {
  FirewallPolicy?: FirewallPolicyDetails;
  FirewallPolicyArn?: string;
  FirewallPolicyId?: string;
  FirewallPolicyName?: string;
  Description?: string;
}
export const AwsNetworkFirewallFirewallPolicyDetails = S.suspend(() =>
  S.Struct({
    FirewallPolicy: S.optional(FirewallPolicyDetails),
    FirewallPolicyArn: S.optional(S.String),
    FirewallPolicyId: S.optional(S.String),
    FirewallPolicyName: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsNetworkFirewallFirewallPolicyDetails",
}) as any as S.Schema<AwsNetworkFirewallFirewallPolicyDetails>;
export interface AwsNetworkFirewallFirewallSubnetMappingsDetails {
  SubnetId?: string;
}
export const AwsNetworkFirewallFirewallSubnetMappingsDetails = S.suspend(() =>
  S.Struct({ SubnetId: S.optional(S.String) }),
).annotations({
  identifier: "AwsNetworkFirewallFirewallSubnetMappingsDetails",
}) as any as S.Schema<AwsNetworkFirewallFirewallSubnetMappingsDetails>;
export type AwsNetworkFirewallFirewallSubnetMappingsList =
  AwsNetworkFirewallFirewallSubnetMappingsDetails[];
export const AwsNetworkFirewallFirewallSubnetMappingsList = S.Array(
  AwsNetworkFirewallFirewallSubnetMappingsDetails,
);
export interface AwsNetworkFirewallFirewallDetails {
  DeleteProtection?: boolean;
  Description?: string;
  FirewallArn?: string;
  FirewallId?: string;
  FirewallName?: string;
  FirewallPolicyArn?: string;
  FirewallPolicyChangeProtection?: boolean;
  SubnetChangeProtection?: boolean;
  SubnetMappings?: AwsNetworkFirewallFirewallSubnetMappingsDetails[];
  VpcId?: string;
}
export const AwsNetworkFirewallFirewallDetails = S.suspend(() =>
  S.Struct({
    DeleteProtection: S.optional(S.Boolean),
    Description: S.optional(S.String),
    FirewallArn: S.optional(S.String),
    FirewallId: S.optional(S.String),
    FirewallName: S.optional(S.String),
    FirewallPolicyArn: S.optional(S.String),
    FirewallPolicyChangeProtection: S.optional(S.Boolean),
    SubnetChangeProtection: S.optional(S.Boolean),
    SubnetMappings: S.optional(AwsNetworkFirewallFirewallSubnetMappingsList),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsNetworkFirewallFirewallDetails",
}) as any as S.Schema<AwsNetworkFirewallFirewallDetails>;
export interface RuleGroupVariablesIpSetsDetails {
  Definition?: string[];
}
export const RuleGroupVariablesIpSetsDetails = S.suspend(() =>
  S.Struct({ Definition: S.optional(NonEmptyStringList) }),
).annotations({
  identifier: "RuleGroupVariablesIpSetsDetails",
}) as any as S.Schema<RuleGroupVariablesIpSetsDetails>;
export interface RuleGroupVariablesPortSetsDetails {
  Definition?: string[];
}
export const RuleGroupVariablesPortSetsDetails = S.suspend(() =>
  S.Struct({ Definition: S.optional(NonEmptyStringList) }),
).annotations({
  identifier: "RuleGroupVariablesPortSetsDetails",
}) as any as S.Schema<RuleGroupVariablesPortSetsDetails>;
export interface RuleGroupVariables {
  IpSets?: RuleGroupVariablesIpSetsDetails;
  PortSets?: RuleGroupVariablesPortSetsDetails;
}
export const RuleGroupVariables = S.suspend(() =>
  S.Struct({
    IpSets: S.optional(RuleGroupVariablesIpSetsDetails),
    PortSets: S.optional(RuleGroupVariablesPortSetsDetails),
  }),
).annotations({
  identifier: "RuleGroupVariables",
}) as any as S.Schema<RuleGroupVariables>;
export interface RuleGroupSourceListDetails {
  GeneratedRulesType?: string;
  TargetTypes?: string[];
  Targets?: string[];
}
export const RuleGroupSourceListDetails = S.suspend(() =>
  S.Struct({
    GeneratedRulesType: S.optional(S.String),
    TargetTypes: S.optional(NonEmptyStringList),
    Targets: S.optional(NonEmptyStringList),
  }),
).annotations({
  identifier: "RuleGroupSourceListDetails",
}) as any as S.Schema<RuleGroupSourceListDetails>;
export interface RuleGroupSourceStatefulRulesHeaderDetails {
  Destination?: string;
  DestinationPort?: string;
  Direction?: string;
  Protocol?: string;
  Source?: string;
  SourcePort?: string;
}
export const RuleGroupSourceStatefulRulesHeaderDetails = S.suspend(() =>
  S.Struct({
    Destination: S.optional(S.String),
    DestinationPort: S.optional(S.String),
    Direction: S.optional(S.String),
    Protocol: S.optional(S.String),
    Source: S.optional(S.String),
    SourcePort: S.optional(S.String),
  }),
).annotations({
  identifier: "RuleGroupSourceStatefulRulesHeaderDetails",
}) as any as S.Schema<RuleGroupSourceStatefulRulesHeaderDetails>;
export type RuleGroupSourceStatefulRulesRuleOptionsSettingsList = string[];
export const RuleGroupSourceStatefulRulesRuleOptionsSettingsList = S.Array(
  S.String,
);
export interface RuleGroupSourceStatefulRulesOptionsDetails {
  Keyword?: string;
  Settings?: string[];
}
export const RuleGroupSourceStatefulRulesOptionsDetails = S.suspend(() =>
  S.Struct({
    Keyword: S.optional(S.String),
    Settings: S.optional(RuleGroupSourceStatefulRulesRuleOptionsSettingsList),
  }),
).annotations({
  identifier: "RuleGroupSourceStatefulRulesOptionsDetails",
}) as any as S.Schema<RuleGroupSourceStatefulRulesOptionsDetails>;
export type RuleGroupSourceStatefulRulesOptionsList =
  RuleGroupSourceStatefulRulesOptionsDetails[];
export const RuleGroupSourceStatefulRulesOptionsList = S.Array(
  RuleGroupSourceStatefulRulesOptionsDetails,
);
export interface RuleGroupSourceStatefulRulesDetails {
  Action?: string;
  Header?: RuleGroupSourceStatefulRulesHeaderDetails;
  RuleOptions?: RuleGroupSourceStatefulRulesOptionsDetails[];
}
export const RuleGroupSourceStatefulRulesDetails = S.suspend(() =>
  S.Struct({
    Action: S.optional(S.String),
    Header: S.optional(RuleGroupSourceStatefulRulesHeaderDetails),
    RuleOptions: S.optional(RuleGroupSourceStatefulRulesOptionsList),
  }),
).annotations({
  identifier: "RuleGroupSourceStatefulRulesDetails",
}) as any as S.Schema<RuleGroupSourceStatefulRulesDetails>;
export type RuleGroupSourceStatefulRulesList =
  RuleGroupSourceStatefulRulesDetails[];
export const RuleGroupSourceStatefulRulesList = S.Array(
  RuleGroupSourceStatefulRulesDetails,
);
export interface RuleGroupSourceCustomActionsDetails {
  ActionDefinition?: StatelessCustomActionDefinition;
  ActionName?: string;
}
export const RuleGroupSourceCustomActionsDetails = S.suspend(() =>
  S.Struct({
    ActionDefinition: S.optional(StatelessCustomActionDefinition),
    ActionName: S.optional(S.String),
  }),
).annotations({
  identifier: "RuleGroupSourceCustomActionsDetails",
}) as any as S.Schema<RuleGroupSourceCustomActionsDetails>;
export type RuleGroupSourceCustomActionsList =
  RuleGroupSourceCustomActionsDetails[];
export const RuleGroupSourceCustomActionsList = S.Array(
  RuleGroupSourceCustomActionsDetails,
);
export interface RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts {
  FromPort?: number;
  ToPort?: number;
}
export const RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts =
  S.suspend(() =>
    S.Struct({ FromPort: S.optional(S.Number), ToPort: S.optional(S.Number) }),
  ).annotations({
    identifier: "RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts",
  }) as any as S.Schema<RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts>;
export type RuleGroupSourceStatelessRuleMatchAttributesDestinationPortsList =
  RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts[];
export const RuleGroupSourceStatelessRuleMatchAttributesDestinationPortsList =
  S.Array(RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts);
export interface RuleGroupSourceStatelessRuleMatchAttributesDestinations {
  AddressDefinition?: string;
}
export const RuleGroupSourceStatelessRuleMatchAttributesDestinations =
  S.suspend(() =>
    S.Struct({ AddressDefinition: S.optional(S.String) }),
  ).annotations({
    identifier: "RuleGroupSourceStatelessRuleMatchAttributesDestinations",
  }) as any as S.Schema<RuleGroupSourceStatelessRuleMatchAttributesDestinations>;
export type RuleGroupSourceStatelessRuleMatchAttributesDestinationsList =
  RuleGroupSourceStatelessRuleMatchAttributesDestinations[];
export const RuleGroupSourceStatelessRuleMatchAttributesDestinationsList =
  S.Array(RuleGroupSourceStatelessRuleMatchAttributesDestinations);
export type RuleGroupSourceStatelessRuleMatchAttributesProtocolsList = number[];
export const RuleGroupSourceStatelessRuleMatchAttributesProtocolsList = S.Array(
  S.Number,
);
export interface RuleGroupSourceStatelessRuleMatchAttributesSourcePorts {
  FromPort?: number;
  ToPort?: number;
}
export const RuleGroupSourceStatelessRuleMatchAttributesSourcePorts = S.suspend(
  () =>
    S.Struct({ FromPort: S.optional(S.Number), ToPort: S.optional(S.Number) }),
).annotations({
  identifier: "RuleGroupSourceStatelessRuleMatchAttributesSourcePorts",
}) as any as S.Schema<RuleGroupSourceStatelessRuleMatchAttributesSourcePorts>;
export type RuleGroupSourceStatelessRuleMatchAttributesSourcePortsList =
  RuleGroupSourceStatelessRuleMatchAttributesSourcePorts[];
export const RuleGroupSourceStatelessRuleMatchAttributesSourcePortsList =
  S.Array(RuleGroupSourceStatelessRuleMatchAttributesSourcePorts);
export interface RuleGroupSourceStatelessRuleMatchAttributesSources {
  AddressDefinition?: string;
}
export const RuleGroupSourceStatelessRuleMatchAttributesSources = S.suspend(
  () => S.Struct({ AddressDefinition: S.optional(S.String) }),
).annotations({
  identifier: "RuleGroupSourceStatelessRuleMatchAttributesSources",
}) as any as S.Schema<RuleGroupSourceStatelessRuleMatchAttributesSources>;
export type RuleGroupSourceStatelessRuleMatchAttributesSourcesList =
  RuleGroupSourceStatelessRuleMatchAttributesSources[];
export const RuleGroupSourceStatelessRuleMatchAttributesSourcesList = S.Array(
  RuleGroupSourceStatelessRuleMatchAttributesSources,
);
export interface RuleGroupSourceStatelessRuleMatchAttributesTcpFlags {
  Flags?: string[];
  Masks?: string[];
}
export const RuleGroupSourceStatelessRuleMatchAttributesTcpFlags = S.suspend(
  () =>
    S.Struct({
      Flags: S.optional(NonEmptyStringList),
      Masks: S.optional(NonEmptyStringList),
    }),
).annotations({
  identifier: "RuleGroupSourceStatelessRuleMatchAttributesTcpFlags",
}) as any as S.Schema<RuleGroupSourceStatelessRuleMatchAttributesTcpFlags>;
export type RuleGroupSourceStatelessRuleMatchAttributesTcpFlagsList =
  RuleGroupSourceStatelessRuleMatchAttributesTcpFlags[];
export const RuleGroupSourceStatelessRuleMatchAttributesTcpFlagsList = S.Array(
  RuleGroupSourceStatelessRuleMatchAttributesTcpFlags,
);
export interface RuleGroupSourceStatelessRuleMatchAttributes {
  DestinationPorts?: RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts[];
  Destinations?: RuleGroupSourceStatelessRuleMatchAttributesDestinations[];
  Protocols?: number[];
  SourcePorts?: RuleGroupSourceStatelessRuleMatchAttributesSourcePorts[];
  Sources?: RuleGroupSourceStatelessRuleMatchAttributesSources[];
  TcpFlags?: RuleGroupSourceStatelessRuleMatchAttributesTcpFlags[];
}
export const RuleGroupSourceStatelessRuleMatchAttributes = S.suspend(() =>
  S.Struct({
    DestinationPorts: S.optional(
      RuleGroupSourceStatelessRuleMatchAttributesDestinationPortsList,
    ),
    Destinations: S.optional(
      RuleGroupSourceStatelessRuleMatchAttributesDestinationsList,
    ),
    Protocols: S.optional(
      RuleGroupSourceStatelessRuleMatchAttributesProtocolsList,
    ),
    SourcePorts: S.optional(
      RuleGroupSourceStatelessRuleMatchAttributesSourcePortsList,
    ),
    Sources: S.optional(RuleGroupSourceStatelessRuleMatchAttributesSourcesList),
    TcpFlags: S.optional(
      RuleGroupSourceStatelessRuleMatchAttributesTcpFlagsList,
    ),
  }),
).annotations({
  identifier: "RuleGroupSourceStatelessRuleMatchAttributes",
}) as any as S.Schema<RuleGroupSourceStatelessRuleMatchAttributes>;
export interface RuleGroupSourceStatelessRuleDefinition {
  Actions?: string[];
  MatchAttributes?: RuleGroupSourceStatelessRuleMatchAttributes;
}
export const RuleGroupSourceStatelessRuleDefinition = S.suspend(() =>
  S.Struct({
    Actions: S.optional(NonEmptyStringList),
    MatchAttributes: S.optional(RuleGroupSourceStatelessRuleMatchAttributes),
  }),
).annotations({
  identifier: "RuleGroupSourceStatelessRuleDefinition",
}) as any as S.Schema<RuleGroupSourceStatelessRuleDefinition>;
export interface RuleGroupSourceStatelessRulesDetails {
  Priority?: number;
  RuleDefinition?: RuleGroupSourceStatelessRuleDefinition;
}
export const RuleGroupSourceStatelessRulesDetails = S.suspend(() =>
  S.Struct({
    Priority: S.optional(S.Number),
    RuleDefinition: S.optional(RuleGroupSourceStatelessRuleDefinition),
  }),
).annotations({
  identifier: "RuleGroupSourceStatelessRulesDetails",
}) as any as S.Schema<RuleGroupSourceStatelessRulesDetails>;
export type RuleGroupSourceStatelessRulesList =
  RuleGroupSourceStatelessRulesDetails[];
export const RuleGroupSourceStatelessRulesList = S.Array(
  RuleGroupSourceStatelessRulesDetails,
);
export interface RuleGroupSourceStatelessRulesAndCustomActionsDetails {
  CustomActions?: RuleGroupSourceCustomActionsDetails[];
  StatelessRules?: RuleGroupSourceStatelessRulesDetails[];
}
export const RuleGroupSourceStatelessRulesAndCustomActionsDetails = S.suspend(
  () =>
    S.Struct({
      CustomActions: S.optional(RuleGroupSourceCustomActionsList),
      StatelessRules: S.optional(RuleGroupSourceStatelessRulesList),
    }),
).annotations({
  identifier: "RuleGroupSourceStatelessRulesAndCustomActionsDetails",
}) as any as S.Schema<RuleGroupSourceStatelessRulesAndCustomActionsDetails>;
export interface RuleGroupSource {
  RulesSourceList?: RuleGroupSourceListDetails;
  RulesString?: string;
  StatefulRules?: RuleGroupSourceStatefulRulesDetails[];
  StatelessRulesAndCustomActions?: RuleGroupSourceStatelessRulesAndCustomActionsDetails;
}
export const RuleGroupSource = S.suspend(() =>
  S.Struct({
    RulesSourceList: S.optional(RuleGroupSourceListDetails),
    RulesString: S.optional(S.String),
    StatefulRules: S.optional(RuleGroupSourceStatefulRulesList),
    StatelessRulesAndCustomActions: S.optional(
      RuleGroupSourceStatelessRulesAndCustomActionsDetails,
    ),
  }),
).annotations({
  identifier: "RuleGroupSource",
}) as any as S.Schema<RuleGroupSource>;
export interface RuleGroupDetails {
  RuleVariables?: RuleGroupVariables;
  RulesSource?: RuleGroupSource;
}
export const RuleGroupDetails = S.suspend(() =>
  S.Struct({
    RuleVariables: S.optional(RuleGroupVariables),
    RulesSource: S.optional(RuleGroupSource),
  }),
).annotations({
  identifier: "RuleGroupDetails",
}) as any as S.Schema<RuleGroupDetails>;
export interface AwsNetworkFirewallRuleGroupDetails {
  Capacity?: number;
  Description?: string;
  RuleGroup?: RuleGroupDetails;
  RuleGroupArn?: string;
  RuleGroupId?: string;
  RuleGroupName?: string;
  Type?: string;
}
export const AwsNetworkFirewallRuleGroupDetails = S.suspend(() =>
  S.Struct({
    Capacity: S.optional(S.Number),
    Description: S.optional(S.String),
    RuleGroup: S.optional(RuleGroupDetails),
    RuleGroupArn: S.optional(S.String),
    RuleGroupId: S.optional(S.String),
    RuleGroupName: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsNetworkFirewallRuleGroupDetails",
}) as any as S.Schema<AwsNetworkFirewallRuleGroupDetails>;
export interface AwsRdsDbSecurityGroupEc2SecurityGroup {
  Ec2SecurityGroupId?: string;
  Ec2SecurityGroupName?: string;
  Ec2SecurityGroupOwnerId?: string;
  Status?: string;
}
export const AwsRdsDbSecurityGroupEc2SecurityGroup = S.suspend(() =>
  S.Struct({
    Ec2SecurityGroupId: S.optional(S.String),
    Ec2SecurityGroupName: S.optional(S.String),
    Ec2SecurityGroupOwnerId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbSecurityGroupEc2SecurityGroup",
}) as any as S.Schema<AwsRdsDbSecurityGroupEc2SecurityGroup>;
export type AwsRdsDbSecurityGroupEc2SecurityGroups =
  AwsRdsDbSecurityGroupEc2SecurityGroup[];
export const AwsRdsDbSecurityGroupEc2SecurityGroups = S.Array(
  AwsRdsDbSecurityGroupEc2SecurityGroup,
);
export interface AwsRdsDbSecurityGroupIpRange {
  CidrIp?: string;
  Status?: string;
}
export const AwsRdsDbSecurityGroupIpRange = S.suspend(() =>
  S.Struct({ CidrIp: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "AwsRdsDbSecurityGroupIpRange",
}) as any as S.Schema<AwsRdsDbSecurityGroupIpRange>;
export type AwsRdsDbSecurityGroupIpRanges = AwsRdsDbSecurityGroupIpRange[];
export const AwsRdsDbSecurityGroupIpRanges = S.Array(
  AwsRdsDbSecurityGroupIpRange,
);
export interface AwsRdsDbSecurityGroupDetails {
  DbSecurityGroupArn?: string;
  DbSecurityGroupDescription?: string;
  DbSecurityGroupName?: string;
  Ec2SecurityGroups?: AwsRdsDbSecurityGroupEc2SecurityGroup[];
  IpRanges?: AwsRdsDbSecurityGroupIpRange[];
  OwnerId?: string;
  VpcId?: string;
}
export const AwsRdsDbSecurityGroupDetails = S.suspend(() =>
  S.Struct({
    DbSecurityGroupArn: S.optional(S.String),
    DbSecurityGroupDescription: S.optional(S.String),
    DbSecurityGroupName: S.optional(S.String),
    Ec2SecurityGroups: S.optional(AwsRdsDbSecurityGroupEc2SecurityGroups),
    IpRanges: S.optional(AwsRdsDbSecurityGroupIpRanges),
    OwnerId: S.optional(S.String),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsRdsDbSecurityGroupDetails",
}) as any as S.Schema<AwsRdsDbSecurityGroupDetails>;
export interface AwsKinesisStreamStreamEncryptionDetails {
  EncryptionType?: string;
  KeyId?: string;
}
export const AwsKinesisStreamStreamEncryptionDetails = S.suspend(() =>
  S.Struct({
    EncryptionType: S.optional(S.String),
    KeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsKinesisStreamStreamEncryptionDetails",
}) as any as S.Schema<AwsKinesisStreamStreamEncryptionDetails>;
export interface AwsKinesisStreamDetails {
  Name?: string;
  Arn?: string;
  StreamEncryption?: AwsKinesisStreamStreamEncryptionDetails;
  ShardCount?: number;
  RetentionPeriodHours?: number;
}
export const AwsKinesisStreamDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    StreamEncryption: S.optional(AwsKinesisStreamStreamEncryptionDetails),
    ShardCount: S.optional(S.Number),
    RetentionPeriodHours: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsKinesisStreamDetails",
}) as any as S.Schema<AwsKinesisStreamDetails>;
export interface AwsEc2TransitGatewayDetails {
  Id?: string;
  Description?: string;
  DefaultRouteTablePropagation?: string;
  AutoAcceptSharedAttachments?: string;
  DefaultRouteTableAssociation?: string;
  TransitGatewayCidrBlocks?: string[];
  AssociationDefaultRouteTableId?: string;
  PropagationDefaultRouteTableId?: string;
  VpnEcmpSupport?: string;
  DnsSupport?: string;
  MulticastSupport?: string;
  AmazonSideAsn?: number;
}
export const AwsEc2TransitGatewayDetails = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Description: S.optional(S.String),
    DefaultRouteTablePropagation: S.optional(S.String),
    AutoAcceptSharedAttachments: S.optional(S.String),
    DefaultRouteTableAssociation: S.optional(S.String),
    TransitGatewayCidrBlocks: S.optional(NonEmptyStringList),
    AssociationDefaultRouteTableId: S.optional(S.String),
    PropagationDefaultRouteTableId: S.optional(S.String),
    VpnEcmpSupport: S.optional(S.String),
    DnsSupport: S.optional(S.String),
    MulticastSupport: S.optional(S.String),
    AmazonSideAsn: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsEc2TransitGatewayDetails",
}) as any as S.Schema<AwsEc2TransitGatewayDetails>;
export interface AwsEfsAccessPointPosixUserDetails {
  Gid?: string;
  SecondaryGids?: string[];
  Uid?: string;
}
export const AwsEfsAccessPointPosixUserDetails = S.suspend(() =>
  S.Struct({
    Gid: S.optional(S.String),
    SecondaryGids: S.optional(NonEmptyStringList),
    Uid: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEfsAccessPointPosixUserDetails",
}) as any as S.Schema<AwsEfsAccessPointPosixUserDetails>;
export interface AwsEfsAccessPointRootDirectoryCreationInfoDetails {
  OwnerGid?: string;
  OwnerUid?: string;
  Permissions?: string;
}
export const AwsEfsAccessPointRootDirectoryCreationInfoDetails = S.suspend(() =>
  S.Struct({
    OwnerGid: S.optional(S.String),
    OwnerUid: S.optional(S.String),
    Permissions: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEfsAccessPointRootDirectoryCreationInfoDetails",
}) as any as S.Schema<AwsEfsAccessPointRootDirectoryCreationInfoDetails>;
export interface AwsEfsAccessPointRootDirectoryDetails {
  CreationInfo?: AwsEfsAccessPointRootDirectoryCreationInfoDetails;
  Path?: string;
}
export const AwsEfsAccessPointRootDirectoryDetails = S.suspend(() =>
  S.Struct({
    CreationInfo: S.optional(AwsEfsAccessPointRootDirectoryCreationInfoDetails),
    Path: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEfsAccessPointRootDirectoryDetails",
}) as any as S.Schema<AwsEfsAccessPointRootDirectoryDetails>;
export interface AwsEfsAccessPointDetails {
  AccessPointId?: string;
  Arn?: string;
  ClientToken?: string;
  FileSystemId?: string;
  PosixUser?: AwsEfsAccessPointPosixUserDetails;
  RootDirectory?: AwsEfsAccessPointRootDirectoryDetails;
}
export const AwsEfsAccessPointDetails = S.suspend(() =>
  S.Struct({
    AccessPointId: S.optional(S.String),
    Arn: S.optional(S.String),
    ClientToken: S.optional(S.String),
    FileSystemId: S.optional(S.String),
    PosixUser: S.optional(AwsEfsAccessPointPosixUserDetails),
    RootDirectory: S.optional(AwsEfsAccessPointRootDirectoryDetails),
  }),
).annotations({
  identifier: "AwsEfsAccessPointDetails",
}) as any as S.Schema<AwsEfsAccessPointDetails>;
export interface AwsCloudFormationStackDriftInformationDetails {
  StackDriftStatus?: string;
}
export const AwsCloudFormationStackDriftInformationDetails = S.suspend(() =>
  S.Struct({ StackDriftStatus: S.optional(S.String) }),
).annotations({
  identifier: "AwsCloudFormationStackDriftInformationDetails",
}) as any as S.Schema<AwsCloudFormationStackDriftInformationDetails>;
export interface AwsCloudFormationStackOutputsDetails {
  Description?: string;
  OutputKey?: string;
  OutputValue?: string;
}
export const AwsCloudFormationStackOutputsDetails = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    OutputKey: S.optional(S.String),
    OutputValue: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCloudFormationStackOutputsDetails",
}) as any as S.Schema<AwsCloudFormationStackOutputsDetails>;
export type AwsCloudFormationStackOutputsList =
  AwsCloudFormationStackOutputsDetails[];
export const AwsCloudFormationStackOutputsList = S.Array(
  AwsCloudFormationStackOutputsDetails,
);
export interface AwsCloudFormationStackDetails {
  Capabilities?: string[];
  CreationTime?: string;
  Description?: string;
  DisableRollback?: boolean;
  DriftInformation?: AwsCloudFormationStackDriftInformationDetails;
  EnableTerminationProtection?: boolean;
  LastUpdatedTime?: string;
  NotificationArns?: string[];
  Outputs?: AwsCloudFormationStackOutputsDetails[];
  RoleArn?: string;
  StackId?: string;
  StackName?: string;
  StackStatus?: string;
  StackStatusReason?: string;
  TimeoutInMinutes?: number;
}
export const AwsCloudFormationStackDetails = S.suspend(() =>
  S.Struct({
    Capabilities: S.optional(NonEmptyStringList),
    CreationTime: S.optional(S.String),
    Description: S.optional(S.String),
    DisableRollback: S.optional(S.Boolean),
    DriftInformation: S.optional(AwsCloudFormationStackDriftInformationDetails),
    EnableTerminationProtection: S.optional(S.Boolean),
    LastUpdatedTime: S.optional(S.String),
    NotificationArns: S.optional(NonEmptyStringList),
    Outputs: S.optional(AwsCloudFormationStackOutputsList),
    RoleArn: S.optional(S.String),
    StackId: S.optional(S.String),
    StackName: S.optional(S.String),
    StackStatus: S.optional(S.String),
    StackStatusReason: S.optional(S.String),
    TimeoutInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsCloudFormationStackDetails",
}) as any as S.Schema<AwsCloudFormationStackDetails>;
export interface AwsCloudWatchAlarmDimensionsDetails {
  Name?: string;
  Value?: string;
}
export const AwsCloudWatchAlarmDimensionsDetails = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "AwsCloudWatchAlarmDimensionsDetails",
}) as any as S.Schema<AwsCloudWatchAlarmDimensionsDetails>;
export type AwsCloudWatchAlarmDimensionsList =
  AwsCloudWatchAlarmDimensionsDetails[];
export const AwsCloudWatchAlarmDimensionsList = S.Array(
  AwsCloudWatchAlarmDimensionsDetails,
);
export interface AwsCloudWatchAlarmDetails {
  ActionsEnabled?: boolean;
  AlarmActions?: string[];
  AlarmArn?: string;
  AlarmConfigurationUpdatedTimestamp?: string;
  AlarmDescription?: string;
  AlarmName?: string;
  ComparisonOperator?: string;
  DatapointsToAlarm?: number;
  Dimensions?: AwsCloudWatchAlarmDimensionsDetails[];
  EvaluateLowSampleCountPercentile?: string;
  EvaluationPeriods?: number;
  ExtendedStatistic?: string;
  InsufficientDataActions?: string[];
  MetricName?: string;
  Namespace?: string;
  OkActions?: string[];
  Period?: number;
  Statistic?: string;
  Threshold?: number;
  ThresholdMetricId?: string;
  TreatMissingData?: string;
  Unit?: string;
}
export const AwsCloudWatchAlarmDetails = S.suspend(() =>
  S.Struct({
    ActionsEnabled: S.optional(S.Boolean),
    AlarmActions: S.optional(NonEmptyStringList),
    AlarmArn: S.optional(S.String),
    AlarmConfigurationUpdatedTimestamp: S.optional(S.String),
    AlarmDescription: S.optional(S.String),
    AlarmName: S.optional(S.String),
    ComparisonOperator: S.optional(S.String),
    DatapointsToAlarm: S.optional(S.Number),
    Dimensions: S.optional(AwsCloudWatchAlarmDimensionsList),
    EvaluateLowSampleCountPercentile: S.optional(S.String),
    EvaluationPeriods: S.optional(S.Number),
    ExtendedStatistic: S.optional(S.String),
    InsufficientDataActions: S.optional(NonEmptyStringList),
    MetricName: S.optional(S.String),
    Namespace: S.optional(S.String),
    OkActions: S.optional(NonEmptyStringList),
    Period: S.optional(S.Number),
    Statistic: S.optional(S.String),
    Threshold: S.optional(S.Number),
    ThresholdMetricId: S.optional(S.String),
    TreatMissingData: S.optional(S.String),
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsCloudWatchAlarmDetails",
}) as any as S.Schema<AwsCloudWatchAlarmDetails>;
export interface VpcInfoCidrBlockSetDetails {
  CidrBlock?: string;
}
export const VpcInfoCidrBlockSetDetails = S.suspend(() =>
  S.Struct({ CidrBlock: S.optional(S.String) }),
).annotations({
  identifier: "VpcInfoCidrBlockSetDetails",
}) as any as S.Schema<VpcInfoCidrBlockSetDetails>;
export type VpcInfoCidrBlockSetList = VpcInfoCidrBlockSetDetails[];
export const VpcInfoCidrBlockSetList = S.Array(VpcInfoCidrBlockSetDetails);
export interface VpcInfoIpv6CidrBlockSetDetails {
  Ipv6CidrBlock?: string;
}
export const VpcInfoIpv6CidrBlockSetDetails = S.suspend(() =>
  S.Struct({ Ipv6CidrBlock: S.optional(S.String) }),
).annotations({
  identifier: "VpcInfoIpv6CidrBlockSetDetails",
}) as any as S.Schema<VpcInfoIpv6CidrBlockSetDetails>;
export type VpcInfoIpv6CidrBlockSetList = VpcInfoIpv6CidrBlockSetDetails[];
export const VpcInfoIpv6CidrBlockSetList = S.Array(
  VpcInfoIpv6CidrBlockSetDetails,
);
export interface VpcInfoPeeringOptionsDetails {
  AllowDnsResolutionFromRemoteVpc?: boolean;
  AllowEgressFromLocalClassicLinkToRemoteVpc?: boolean;
  AllowEgressFromLocalVpcToRemoteClassicLink?: boolean;
}
export const VpcInfoPeeringOptionsDetails = S.suspend(() =>
  S.Struct({
    AllowDnsResolutionFromRemoteVpc: S.optional(S.Boolean),
    AllowEgressFromLocalClassicLinkToRemoteVpc: S.optional(S.Boolean),
    AllowEgressFromLocalVpcToRemoteClassicLink: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "VpcInfoPeeringOptionsDetails",
}) as any as S.Schema<VpcInfoPeeringOptionsDetails>;
export interface AwsEc2VpcPeeringConnectionVpcInfoDetails {
  CidrBlock?: string;
  CidrBlockSet?: VpcInfoCidrBlockSetDetails[];
  Ipv6CidrBlockSet?: VpcInfoIpv6CidrBlockSetDetails[];
  OwnerId?: string;
  PeeringOptions?: VpcInfoPeeringOptionsDetails;
  Region?: string;
  VpcId?: string;
}
export const AwsEc2VpcPeeringConnectionVpcInfoDetails = S.suspend(() =>
  S.Struct({
    CidrBlock: S.optional(S.String),
    CidrBlockSet: S.optional(VpcInfoCidrBlockSetList),
    Ipv6CidrBlockSet: S.optional(VpcInfoIpv6CidrBlockSetList),
    OwnerId: S.optional(S.String),
    PeeringOptions: S.optional(VpcInfoPeeringOptionsDetails),
    Region: S.optional(S.String),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2VpcPeeringConnectionVpcInfoDetails",
}) as any as S.Schema<AwsEc2VpcPeeringConnectionVpcInfoDetails>;
export interface AwsEc2VpcPeeringConnectionStatusDetails {
  Code?: string;
  Message?: string;
}
export const AwsEc2VpcPeeringConnectionStatusDetails = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2VpcPeeringConnectionStatusDetails",
}) as any as S.Schema<AwsEc2VpcPeeringConnectionStatusDetails>;
export interface AwsEc2VpcPeeringConnectionDetails {
  AccepterVpcInfo?: AwsEc2VpcPeeringConnectionVpcInfoDetails;
  ExpirationTime?: string;
  RequesterVpcInfo?: AwsEc2VpcPeeringConnectionVpcInfoDetails;
  Status?: AwsEc2VpcPeeringConnectionStatusDetails;
  VpcPeeringConnectionId?: string;
}
export const AwsEc2VpcPeeringConnectionDetails = S.suspend(() =>
  S.Struct({
    AccepterVpcInfo: S.optional(AwsEc2VpcPeeringConnectionVpcInfoDetails),
    ExpirationTime: S.optional(S.String),
    RequesterVpcInfo: S.optional(AwsEc2VpcPeeringConnectionVpcInfoDetails),
    Status: S.optional(AwsEc2VpcPeeringConnectionStatusDetails),
    VpcPeeringConnectionId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2VpcPeeringConnectionDetails",
}) as any as S.Schema<AwsEc2VpcPeeringConnectionDetails>;
export interface AwsWafRegionalRuleGroupRulesActionDetails {
  Type?: string;
}
export const AwsWafRegionalRuleGroupRulesActionDetails = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String) }),
).annotations({
  identifier: "AwsWafRegionalRuleGroupRulesActionDetails",
}) as any as S.Schema<AwsWafRegionalRuleGroupRulesActionDetails>;
export interface AwsWafRegionalRuleGroupRulesDetails {
  Action?: AwsWafRegionalRuleGroupRulesActionDetails;
  Priority?: number;
  RuleId?: string;
  Type?: string;
}
export const AwsWafRegionalRuleGroupRulesDetails = S.suspend(() =>
  S.Struct({
    Action: S.optional(AwsWafRegionalRuleGroupRulesActionDetails),
    Priority: S.optional(S.Number),
    RuleId: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRegionalRuleGroupRulesDetails",
}) as any as S.Schema<AwsWafRegionalRuleGroupRulesDetails>;
export type AwsWafRegionalRuleGroupRulesList =
  AwsWafRegionalRuleGroupRulesDetails[];
export const AwsWafRegionalRuleGroupRulesList = S.Array(
  AwsWafRegionalRuleGroupRulesDetails,
);
export interface AwsWafRegionalRuleGroupDetails {
  MetricName?: string;
  Name?: string;
  RuleGroupId?: string;
  Rules?: AwsWafRegionalRuleGroupRulesDetails[];
}
export const AwsWafRegionalRuleGroupDetails = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Name: S.optional(S.String),
    RuleGroupId: S.optional(S.String),
    Rules: S.optional(AwsWafRegionalRuleGroupRulesList),
  }),
).annotations({
  identifier: "AwsWafRegionalRuleGroupDetails",
}) as any as S.Schema<AwsWafRegionalRuleGroupDetails>;
export interface AwsWafRegionalRulePredicateListDetails {
  DataId?: string;
  Negated?: boolean;
  Type?: string;
}
export const AwsWafRegionalRulePredicateListDetails = S.suspend(() =>
  S.Struct({
    DataId: S.optional(S.String),
    Negated: S.optional(S.Boolean),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRegionalRulePredicateListDetails",
}) as any as S.Schema<AwsWafRegionalRulePredicateListDetails>;
export type AwsWafRegionalRulePredicateList =
  AwsWafRegionalRulePredicateListDetails[];
export const AwsWafRegionalRulePredicateList = S.Array(
  AwsWafRegionalRulePredicateListDetails,
);
export interface AwsWafRegionalRuleDetails {
  MetricName?: string;
  Name?: string;
  PredicateList?: AwsWafRegionalRulePredicateListDetails[];
  RuleId?: string;
}
export const AwsWafRegionalRuleDetails = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Name: S.optional(S.String),
    PredicateList: S.optional(AwsWafRegionalRulePredicateList),
    RuleId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRegionalRuleDetails",
}) as any as S.Schema<AwsWafRegionalRuleDetails>;
export interface AwsWafRegionalWebAclRulesListActionDetails {
  Type?: string;
}
export const AwsWafRegionalWebAclRulesListActionDetails = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String) }),
).annotations({
  identifier: "AwsWafRegionalWebAclRulesListActionDetails",
}) as any as S.Schema<AwsWafRegionalWebAclRulesListActionDetails>;
export interface AwsWafRegionalWebAclRulesListOverrideActionDetails {
  Type?: string;
}
export const AwsWafRegionalWebAclRulesListOverrideActionDetails = S.suspend(
  () => S.Struct({ Type: S.optional(S.String) }),
).annotations({
  identifier: "AwsWafRegionalWebAclRulesListOverrideActionDetails",
}) as any as S.Schema<AwsWafRegionalWebAclRulesListOverrideActionDetails>;
export interface AwsWafRegionalWebAclRulesListDetails {
  Action?: AwsWafRegionalWebAclRulesListActionDetails;
  OverrideAction?: AwsWafRegionalWebAclRulesListOverrideActionDetails;
  Priority?: number;
  RuleId?: string;
  Type?: string;
}
export const AwsWafRegionalWebAclRulesListDetails = S.suspend(() =>
  S.Struct({
    Action: S.optional(AwsWafRegionalWebAclRulesListActionDetails),
    OverrideAction: S.optional(
      AwsWafRegionalWebAclRulesListOverrideActionDetails,
    ),
    Priority: S.optional(S.Number),
    RuleId: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRegionalWebAclRulesListDetails",
}) as any as S.Schema<AwsWafRegionalWebAclRulesListDetails>;
export type AwsWafRegionalWebAclRulesList =
  AwsWafRegionalWebAclRulesListDetails[];
export const AwsWafRegionalWebAclRulesList = S.Array(
  AwsWafRegionalWebAclRulesListDetails,
);
export interface AwsWafRegionalWebAclDetails {
  DefaultAction?: string;
  MetricName?: string;
  Name?: string;
  RulesList?: AwsWafRegionalWebAclRulesListDetails[];
  WebAclId?: string;
}
export const AwsWafRegionalWebAclDetails = S.suspend(() =>
  S.Struct({
    DefaultAction: S.optional(S.String),
    MetricName: S.optional(S.String),
    Name: S.optional(S.String),
    RulesList: S.optional(AwsWafRegionalWebAclRulesList),
    WebAclId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRegionalWebAclDetails",
}) as any as S.Schema<AwsWafRegionalWebAclDetails>;
export interface AwsWafRulePredicateListDetails {
  DataId?: string;
  Negated?: boolean;
  Type?: string;
}
export const AwsWafRulePredicateListDetails = S.suspend(() =>
  S.Struct({
    DataId: S.optional(S.String),
    Negated: S.optional(S.Boolean),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRulePredicateListDetails",
}) as any as S.Schema<AwsWafRulePredicateListDetails>;
export type AwsWafRulePredicateList = AwsWafRulePredicateListDetails[];
export const AwsWafRulePredicateList = S.Array(AwsWafRulePredicateListDetails);
export interface AwsWafRuleDetails {
  MetricName?: string;
  Name?: string;
  PredicateList?: AwsWafRulePredicateListDetails[];
  RuleId?: string;
}
export const AwsWafRuleDetails = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Name: S.optional(S.String),
    PredicateList: S.optional(AwsWafRulePredicateList),
    RuleId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRuleDetails",
}) as any as S.Schema<AwsWafRuleDetails>;
export interface AwsWafRuleGroupRulesActionDetails {
  Type?: string;
}
export const AwsWafRuleGroupRulesActionDetails = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String) }),
).annotations({
  identifier: "AwsWafRuleGroupRulesActionDetails",
}) as any as S.Schema<AwsWafRuleGroupRulesActionDetails>;
export interface AwsWafRuleGroupRulesDetails {
  Action?: AwsWafRuleGroupRulesActionDetails;
  Priority?: number;
  RuleId?: string;
  Type?: string;
}
export const AwsWafRuleGroupRulesDetails = S.suspend(() =>
  S.Struct({
    Action: S.optional(AwsWafRuleGroupRulesActionDetails),
    Priority: S.optional(S.Number),
    RuleId: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsWafRuleGroupRulesDetails",
}) as any as S.Schema<AwsWafRuleGroupRulesDetails>;
export type AwsWafRuleGroupRulesList = AwsWafRuleGroupRulesDetails[];
export const AwsWafRuleGroupRulesList = S.Array(AwsWafRuleGroupRulesDetails);
export interface AwsWafRuleGroupDetails {
  MetricName?: string;
  Name?: string;
  RuleGroupId?: string;
  Rules?: AwsWafRuleGroupRulesDetails[];
}
export const AwsWafRuleGroupDetails = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Name: S.optional(S.String),
    RuleGroupId: S.optional(S.String),
    Rules: S.optional(AwsWafRuleGroupRulesList),
  }),
).annotations({
  identifier: "AwsWafRuleGroupDetails",
}) as any as S.Schema<AwsWafRuleGroupDetails>;
export interface AwsEcsTaskVolumeHostDetails {
  SourcePath?: string;
}
export const AwsEcsTaskVolumeHostDetails = S.suspend(() =>
  S.Struct({ SourcePath: S.optional(S.String) }),
).annotations({
  identifier: "AwsEcsTaskVolumeHostDetails",
}) as any as S.Schema<AwsEcsTaskVolumeHostDetails>;
export interface AwsEcsTaskVolumeDetails {
  Name?: string;
  Host?: AwsEcsTaskVolumeHostDetails;
}
export const AwsEcsTaskVolumeDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Host: S.optional(AwsEcsTaskVolumeHostDetails),
  }),
).annotations({
  identifier: "AwsEcsTaskVolumeDetails",
}) as any as S.Schema<AwsEcsTaskVolumeDetails>;
export type AwsEcsTaskVolumeDetailsList = AwsEcsTaskVolumeDetails[];
export const AwsEcsTaskVolumeDetailsList = S.Array(AwsEcsTaskVolumeDetails);
export type AwsEcsContainerDetailsList = AwsEcsContainerDetails[];
export const AwsEcsContainerDetailsList = S.Array(AwsEcsContainerDetails);
export interface AwsEcsTaskDetails {
  ClusterArn?: string;
  TaskDefinitionArn?: string;
  Version?: string;
  CreatedAt?: string;
  StartedAt?: string;
  StartedBy?: string;
  Group?: string;
  Volumes?: AwsEcsTaskVolumeDetails[];
  Containers?: AwsEcsContainerDetails[];
}
export const AwsEcsTaskDetails = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String),
    TaskDefinitionArn: S.optional(S.String),
    Version: S.optional(S.String),
    CreatedAt: S.optional(S.String),
    StartedAt: S.optional(S.String),
    StartedBy: S.optional(S.String),
    Group: S.optional(S.String),
    Volumes: S.optional(AwsEcsTaskVolumeDetailsList),
    Containers: S.optional(AwsEcsContainerDetailsList),
  }),
).annotations({
  identifier: "AwsEcsTaskDetails",
}) as any as S.Schema<AwsEcsTaskDetails>;
export interface AwsBackupBackupVaultNotificationsDetails {
  BackupVaultEvents?: string[];
  SnsTopicArn?: string;
}
export const AwsBackupBackupVaultNotificationsDetails = S.suspend(() =>
  S.Struct({
    BackupVaultEvents: S.optional(NonEmptyStringList),
    SnsTopicArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsBackupBackupVaultNotificationsDetails",
}) as any as S.Schema<AwsBackupBackupVaultNotificationsDetails>;
export interface AwsBackupBackupVaultDetails {
  BackupVaultArn?: string;
  BackupVaultName?: string;
  EncryptionKeyArn?: string;
  Notifications?: AwsBackupBackupVaultNotificationsDetails;
  AccessPolicy?: string;
}
export const AwsBackupBackupVaultDetails = S.suspend(() =>
  S.Struct({
    BackupVaultArn: S.optional(S.String),
    BackupVaultName: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    Notifications: S.optional(AwsBackupBackupVaultNotificationsDetails),
    AccessPolicy: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsBackupBackupVaultDetails",
}) as any as S.Schema<AwsBackupBackupVaultDetails>;
export interface AwsBackupBackupPlanAdvancedBackupSettingsDetails {
  BackupOptions?: { [key: string]: string | undefined };
  ResourceType?: string;
}
export const AwsBackupBackupPlanAdvancedBackupSettingsDetails = S.suspend(() =>
  S.Struct({
    BackupOptions: S.optional(FieldMap),
    ResourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsBackupBackupPlanAdvancedBackupSettingsDetails",
}) as any as S.Schema<AwsBackupBackupPlanAdvancedBackupSettingsDetails>;
export type AwsBackupBackupPlanAdvancedBackupSettingsList =
  AwsBackupBackupPlanAdvancedBackupSettingsDetails[];
export const AwsBackupBackupPlanAdvancedBackupSettingsList = S.Array(
  AwsBackupBackupPlanAdvancedBackupSettingsDetails,
);
export interface AwsBackupBackupPlanLifecycleDetails {
  DeleteAfterDays?: number;
  MoveToColdStorageAfterDays?: number;
}
export const AwsBackupBackupPlanLifecycleDetails = S.suspend(() =>
  S.Struct({
    DeleteAfterDays: S.optional(S.Number),
    MoveToColdStorageAfterDays: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsBackupBackupPlanLifecycleDetails",
}) as any as S.Schema<AwsBackupBackupPlanLifecycleDetails>;
export interface AwsBackupBackupPlanRuleCopyActionsDetails {
  DestinationBackupVaultArn?: string;
  Lifecycle?: AwsBackupBackupPlanLifecycleDetails;
}
export const AwsBackupBackupPlanRuleCopyActionsDetails = S.suspend(() =>
  S.Struct({
    DestinationBackupVaultArn: S.optional(S.String),
    Lifecycle: S.optional(AwsBackupBackupPlanLifecycleDetails),
  }),
).annotations({
  identifier: "AwsBackupBackupPlanRuleCopyActionsDetails",
}) as any as S.Schema<AwsBackupBackupPlanRuleCopyActionsDetails>;
export type AwsBackupBackupPlanRuleCopyActionsList =
  AwsBackupBackupPlanRuleCopyActionsDetails[];
export const AwsBackupBackupPlanRuleCopyActionsList = S.Array(
  AwsBackupBackupPlanRuleCopyActionsDetails,
);
export interface AwsBackupBackupPlanRuleDetails {
  TargetBackupVault?: string;
  StartWindowMinutes?: number;
  ScheduleExpression?: string;
  RuleName?: string;
  RuleId?: string;
  EnableContinuousBackup?: boolean;
  CompletionWindowMinutes?: number;
  CopyActions?: AwsBackupBackupPlanRuleCopyActionsDetails[];
  Lifecycle?: AwsBackupBackupPlanLifecycleDetails;
}
export const AwsBackupBackupPlanRuleDetails = S.suspend(() =>
  S.Struct({
    TargetBackupVault: S.optional(S.String),
    StartWindowMinutes: S.optional(S.Number),
    ScheduleExpression: S.optional(S.String),
    RuleName: S.optional(S.String),
    RuleId: S.optional(S.String),
    EnableContinuousBackup: S.optional(S.Boolean),
    CompletionWindowMinutes: S.optional(S.Number),
    CopyActions: S.optional(AwsBackupBackupPlanRuleCopyActionsList),
    Lifecycle: S.optional(AwsBackupBackupPlanLifecycleDetails),
  }),
).annotations({
  identifier: "AwsBackupBackupPlanRuleDetails",
}) as any as S.Schema<AwsBackupBackupPlanRuleDetails>;
export type AwsBackupBackupPlanRuleList = AwsBackupBackupPlanRuleDetails[];
export const AwsBackupBackupPlanRuleList = S.Array(
  AwsBackupBackupPlanRuleDetails,
);
export interface AwsBackupBackupPlanBackupPlanDetails {
  BackupPlanName?: string;
  AdvancedBackupSettings?: AwsBackupBackupPlanAdvancedBackupSettingsDetails[];
  BackupPlanRule?: AwsBackupBackupPlanRuleDetails[];
}
export const AwsBackupBackupPlanBackupPlanDetails = S.suspend(() =>
  S.Struct({
    BackupPlanName: S.optional(S.String),
    AdvancedBackupSettings: S.optional(
      AwsBackupBackupPlanAdvancedBackupSettingsList,
    ),
    BackupPlanRule: S.optional(AwsBackupBackupPlanRuleList),
  }),
).annotations({
  identifier: "AwsBackupBackupPlanBackupPlanDetails",
}) as any as S.Schema<AwsBackupBackupPlanBackupPlanDetails>;
export interface AwsBackupBackupPlanDetails {
  BackupPlan?: AwsBackupBackupPlanBackupPlanDetails;
  BackupPlanArn?: string;
  BackupPlanId?: string;
  VersionId?: string;
}
export const AwsBackupBackupPlanDetails = S.suspend(() =>
  S.Struct({
    BackupPlan: S.optional(AwsBackupBackupPlanBackupPlanDetails),
    BackupPlanArn: S.optional(S.String),
    BackupPlanId: S.optional(S.String),
    VersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsBackupBackupPlanDetails",
}) as any as S.Schema<AwsBackupBackupPlanDetails>;
export interface AwsBackupRecoveryPointCalculatedLifecycleDetails {
  DeleteAt?: string;
  MoveToColdStorageAt?: string;
}
export const AwsBackupRecoveryPointCalculatedLifecycleDetails = S.suspend(() =>
  S.Struct({
    DeleteAt: S.optional(S.String),
    MoveToColdStorageAt: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsBackupRecoveryPointCalculatedLifecycleDetails",
}) as any as S.Schema<AwsBackupRecoveryPointCalculatedLifecycleDetails>;
export interface AwsBackupRecoveryPointCreatedByDetails {
  BackupPlanArn?: string;
  BackupPlanId?: string;
  BackupPlanVersion?: string;
  BackupRuleId?: string;
}
export const AwsBackupRecoveryPointCreatedByDetails = S.suspend(() =>
  S.Struct({
    BackupPlanArn: S.optional(S.String),
    BackupPlanId: S.optional(S.String),
    BackupPlanVersion: S.optional(S.String),
    BackupRuleId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsBackupRecoveryPointCreatedByDetails",
}) as any as S.Schema<AwsBackupRecoveryPointCreatedByDetails>;
export interface AwsBackupRecoveryPointLifecycleDetails {
  DeleteAfterDays?: number;
  MoveToColdStorageAfterDays?: number;
}
export const AwsBackupRecoveryPointLifecycleDetails = S.suspend(() =>
  S.Struct({
    DeleteAfterDays: S.optional(S.Number),
    MoveToColdStorageAfterDays: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsBackupRecoveryPointLifecycleDetails",
}) as any as S.Schema<AwsBackupRecoveryPointLifecycleDetails>;
export interface AwsBackupRecoveryPointDetails {
  BackupSizeInBytes?: number;
  BackupVaultArn?: string;
  BackupVaultName?: string;
  CalculatedLifecycle?: AwsBackupRecoveryPointCalculatedLifecycleDetails;
  CompletionDate?: string;
  CreatedBy?: AwsBackupRecoveryPointCreatedByDetails;
  CreationDate?: string;
  EncryptionKeyArn?: string;
  IamRoleArn?: string;
  IsEncrypted?: boolean;
  LastRestoreTime?: string;
  Lifecycle?: AwsBackupRecoveryPointLifecycleDetails;
  RecoveryPointArn?: string;
  ResourceArn?: string;
  ResourceType?: string;
  SourceBackupVaultArn?: string;
  Status?: string;
  StatusMessage?: string;
  StorageClass?: string;
}
export const AwsBackupRecoveryPointDetails = S.suspend(() =>
  S.Struct({
    BackupSizeInBytes: S.optional(S.Number),
    BackupVaultArn: S.optional(S.String),
    BackupVaultName: S.optional(S.String),
    CalculatedLifecycle: S.optional(
      AwsBackupRecoveryPointCalculatedLifecycleDetails,
    ),
    CompletionDate: S.optional(S.String),
    CreatedBy: S.optional(AwsBackupRecoveryPointCreatedByDetails),
    CreationDate: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
    IsEncrypted: S.optional(S.Boolean),
    LastRestoreTime: S.optional(S.String),
    Lifecycle: S.optional(AwsBackupRecoveryPointLifecycleDetails),
    RecoveryPointArn: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    ResourceType: S.optional(S.String),
    SourceBackupVaultArn: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    StorageClass: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsBackupRecoveryPointDetails",
}) as any as S.Schema<AwsBackupRecoveryPointDetails>;
export interface AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails {
  DeleteOnTermination?: boolean;
  Encrypted?: boolean;
  Iops?: number;
  KmsKeyId?: string;
  SnapshotId?: string;
  Throughput?: number;
  VolumeSize?: number;
  VolumeType?: string;
}
export const AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails =
  S.suspend(() =>
    S.Struct({
      DeleteOnTermination: S.optional(S.Boolean),
      Encrypted: S.optional(S.Boolean),
      Iops: S.optional(S.Number),
      KmsKeyId: S.optional(S.String),
      SnapshotId: S.optional(S.String),
      Throughput: S.optional(S.Number),
      VolumeSize: S.optional(S.Number),
      VolumeType: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails>;
export interface AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails {
  DeviceName?: string;
  Ebs?: AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails;
  NoDevice?: string;
  VirtualName?: string;
}
export const AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails = S.suspend(
  () =>
    S.Struct({
      DeviceName: S.optional(S.String),
      Ebs: S.optional(AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails),
      NoDevice: S.optional(S.String),
      VirtualName: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails>;
export type AwsEc2LaunchTemplateDataBlockDeviceMappingSetList =
  AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails[];
export const AwsEc2LaunchTemplateDataBlockDeviceMappingSetList = S.Array(
  AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails,
);
export interface AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails {
  CapacityReservationId?: string;
  CapacityReservationResourceGroupArn?: string;
}
export const AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails =
  S.suspend(() =>
    S.Struct({
      CapacityReservationId: S.optional(S.String),
      CapacityReservationResourceGroupArn: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails>;
export interface AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails {
  CapacityReservationPreference?: string;
  CapacityReservationTarget?: AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails;
}
export const AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails =
  S.suspend(() =>
    S.Struct({
      CapacityReservationPreference: S.optional(S.String),
      CapacityReservationTarget: S.optional(
        AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails,
      ),
    }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails>;
export interface AwsEc2LaunchTemplateDataCpuOptionsDetails {
  CoreCount?: number;
  ThreadsPerCore?: number;
}
export const AwsEc2LaunchTemplateDataCpuOptionsDetails = S.suspend(() =>
  S.Struct({
    CoreCount: S.optional(S.Number),
    ThreadsPerCore: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataCpuOptionsDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataCpuOptionsDetails>;
export interface AwsEc2LaunchTemplateDataCreditSpecificationDetails {
  CpuCredits?: string;
}
export const AwsEc2LaunchTemplateDataCreditSpecificationDetails = S.suspend(
  () => S.Struct({ CpuCredits: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataCreditSpecificationDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataCreditSpecificationDetails>;
export interface AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails {
  Type?: string;
}
export const AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails =
  S.suspend(() => S.Struct({ Type: S.optional(S.String) })).annotations({
    identifier: "AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails>;
export type AwsEc2LaunchTemplateDataElasticGpuSpecificationSetList =
  AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails[];
export const AwsEc2LaunchTemplateDataElasticGpuSpecificationSetList = S.Array(
  AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails,
);
export interface AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails {
  Count?: number;
  Type?: string;
}
export const AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails =
  S.suspend(() =>
    S.Struct({ Count: S.optional(S.Number), Type: S.optional(S.String) }),
  ).annotations({
    identifier: "AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails>;
export type AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetList =
  AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails[];
export const AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetList =
  S.Array(AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails);
export interface AwsEc2LaunchTemplateDataEnclaveOptionsDetails {
  Enabled?: boolean;
}
export const AwsEc2LaunchTemplateDataEnclaveOptionsDetails = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataEnclaveOptionsDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataEnclaveOptionsDetails>;
export interface AwsEc2LaunchTemplateDataHibernationOptionsDetails {
  Configured?: boolean;
}
export const AwsEc2LaunchTemplateDataHibernationOptionsDetails = S.suspend(() =>
  S.Struct({ Configured: S.optional(S.Boolean) }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataHibernationOptionsDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataHibernationOptionsDetails>;
export interface AwsEc2LaunchTemplateDataIamInstanceProfileDetails {
  Arn?: string;
  Name?: string;
}
export const AwsEc2LaunchTemplateDataIamInstanceProfileDetails = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataIamInstanceProfileDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataIamInstanceProfileDetails>;
export interface AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails {
  BlockDurationMinutes?: number;
  InstanceInterruptionBehavior?: string;
  MaxPrice?: string;
  SpotInstanceType?: string;
  ValidUntil?: string;
}
export const AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails =
  S.suspend(() =>
    S.Struct({
      BlockDurationMinutes: S.optional(S.Number),
      InstanceInterruptionBehavior: S.optional(S.String),
      MaxPrice: S.optional(S.String),
      SpotInstanceType: S.optional(S.String),
      ValidUntil: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails>;
export interface AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails {
  MarketType?: string;
  SpotOptions?: AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails;
}
export const AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails = S.suspend(
  () =>
    S.Struct({
      MarketType: S.optional(S.String),
      SpotOptions: S.optional(
        AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails,
      ),
    }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails>;
export interface AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails {
  Max?: number;
  Min?: number;
}
export const AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails =
  S.suspend(() =>
    S.Struct({ Max: S.optional(S.Number), Min: S.optional(S.Number) }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails>;
export interface AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails {
  Max?: number;
  Min?: number;
}
export const AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails =
  S.suspend(() =>
    S.Struct({ Max: S.optional(S.Number), Min: S.optional(S.Number) }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails>;
export interface AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails {
  Max?: number;
  Min?: number;
}
export const AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails =
  S.suspend(() =>
    S.Struct({ Max: S.optional(S.Number), Min: S.optional(S.Number) }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails>;
export interface AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails {
  Max?: number;
  Min?: number;
}
export const AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails =
  S.suspend(() =>
    S.Struct({ Max: S.optional(S.Number), Min: S.optional(S.Number) }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails>;
export interface AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails {
  Max?: number;
  Min?: number;
}
export const AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails =
  S.suspend(() =>
    S.Struct({ Max: S.optional(S.Number), Min: S.optional(S.Number) }),
  ).annotations({
    identifier: "AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails>;
export interface AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails {
  Max?: number;
  Min?: number;
}
export const AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails =
  S.suspend(() =>
    S.Struct({ Max: S.optional(S.Number), Min: S.optional(S.Number) }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails>;
export interface AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails {
  Max?: number;
  Min?: number;
}
export const AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails =
  S.suspend(() =>
    S.Struct({ Max: S.optional(S.Number), Min: S.optional(S.Number) }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails>;
export interface AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails {
  Max?: number;
  Min?: number;
}
export const AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails =
  S.suspend(() =>
    S.Struct({ Max: S.optional(S.Number), Min: S.optional(S.Number) }),
  ).annotations({
    identifier: "AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails>;
export interface AwsEc2LaunchTemplateDataInstanceRequirementsDetails {
  AcceleratorCount?: AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails;
  AcceleratorManufacturers?: string[];
  AcceleratorNames?: string[];
  AcceleratorTotalMemoryMiB?: AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails;
  AcceleratorTypes?: string[];
  BareMetal?: string;
  BaselineEbsBandwidthMbps?: AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails;
  BurstablePerformance?: string;
  CpuManufacturers?: string[];
  ExcludedInstanceTypes?: string[];
  InstanceGenerations?: string[];
  LocalStorage?: string;
  LocalStorageTypes?: string[];
  MemoryGiBPerVCpu?: AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails;
  MemoryMiB?: AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails;
  NetworkInterfaceCount?: AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails;
  OnDemandMaxPricePercentageOverLowestPrice?: number;
  RequireHibernateSupport?: boolean;
  SpotMaxPricePercentageOverLowestPrice?: number;
  TotalLocalStorageGB?: AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails;
  VCpuCount?: AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails;
}
export const AwsEc2LaunchTemplateDataInstanceRequirementsDetails = S.suspend(
  () =>
    S.Struct({
      AcceleratorCount: S.optional(
        AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails,
      ),
      AcceleratorManufacturers: S.optional(NonEmptyStringList),
      AcceleratorNames: S.optional(NonEmptyStringList),
      AcceleratorTotalMemoryMiB: S.optional(
        AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails,
      ),
      AcceleratorTypes: S.optional(NonEmptyStringList),
      BareMetal: S.optional(S.String),
      BaselineEbsBandwidthMbps: S.optional(
        AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails,
      ),
      BurstablePerformance: S.optional(S.String),
      CpuManufacturers: S.optional(NonEmptyStringList),
      ExcludedInstanceTypes: S.optional(NonEmptyStringList),
      InstanceGenerations: S.optional(NonEmptyStringList),
      LocalStorage: S.optional(S.String),
      LocalStorageTypes: S.optional(NonEmptyStringList),
      MemoryGiBPerVCpu: S.optional(
        AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails,
      ),
      MemoryMiB: S.optional(
        AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails,
      ),
      NetworkInterfaceCount: S.optional(
        AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails,
      ),
      OnDemandMaxPricePercentageOverLowestPrice: S.optional(S.Number),
      RequireHibernateSupport: S.optional(S.Boolean),
      SpotMaxPricePercentageOverLowestPrice: S.optional(S.Number),
      TotalLocalStorageGB: S.optional(
        AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails,
      ),
      VCpuCount: S.optional(
        AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails,
      ),
    }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataInstanceRequirementsDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataInstanceRequirementsDetails>;
export interface AwsEc2LaunchTemplateDataLicenseSetDetails {
  LicenseConfigurationArn?: string;
}
export const AwsEc2LaunchTemplateDataLicenseSetDetails = S.suspend(() =>
  S.Struct({ LicenseConfigurationArn: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataLicenseSetDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataLicenseSetDetails>;
export type AwsEc2LaunchTemplateDataLicenseSetList =
  AwsEc2LaunchTemplateDataLicenseSetDetails[];
export const AwsEc2LaunchTemplateDataLicenseSetList = S.Array(
  AwsEc2LaunchTemplateDataLicenseSetDetails,
);
export interface AwsEc2LaunchTemplateDataMaintenanceOptionsDetails {
  AutoRecovery?: string;
}
export const AwsEc2LaunchTemplateDataMaintenanceOptionsDetails = S.suspend(() =>
  S.Struct({ AutoRecovery: S.optional(S.String) }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataMaintenanceOptionsDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataMaintenanceOptionsDetails>;
export interface AwsEc2LaunchTemplateDataMetadataOptionsDetails {
  HttpEndpoint?: string;
  HttpProtocolIpv6?: string;
  HttpTokens?: string;
  HttpPutResponseHopLimit?: number;
  InstanceMetadataTags?: string;
}
export const AwsEc2LaunchTemplateDataMetadataOptionsDetails = S.suspend(() =>
  S.Struct({
    HttpEndpoint: S.optional(S.String),
    HttpProtocolIpv6: S.optional(S.String),
    HttpTokens: S.optional(S.String),
    HttpPutResponseHopLimit: S.optional(S.Number),
    InstanceMetadataTags: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataMetadataOptionsDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataMetadataOptionsDetails>;
export interface AwsEc2LaunchTemplateDataMonitoringDetails {
  Enabled?: boolean;
}
export const AwsEc2LaunchTemplateDataMonitoringDetails = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataMonitoringDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataMonitoringDetails>;
export interface AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails {
  Ipv4Prefix?: string;
}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails =
  S.suspend(() => S.Struct({ Ipv4Prefix: S.optional(S.String) })).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails>;
export type AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesList =
  AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails[];
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesList =
  S.Array(AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails);
export interface AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails {
  Ipv6Address?: string;
}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails =
  S.suspend(() => S.Struct({ Ipv6Address: S.optional(S.String) })).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails>;
export type AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesList =
  AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails[];
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesList =
  S.Array(AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails);
export interface AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails {
  Ipv6Prefix?: string;
}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails =
  S.suspend(() => S.Struct({ Ipv6Prefix: S.optional(S.String) })).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails>;
export type AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesList =
  AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails[];
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesList =
  S.Array(AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails);
export interface AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails {
  Primary?: boolean;
  PrivateIpAddress?: string;
}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails =
  S.suspend(() =>
    S.Struct({
      Primary: S.optional(S.Boolean),
      PrivateIpAddress: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails",
  }) as any as S.Schema<AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails>;
export type AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesList =
  AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails[];
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesList =
  S.Array(AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails);
export interface AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails {
  AssociateCarrierIpAddress?: boolean;
  AssociatePublicIpAddress?: boolean;
  DeleteOnTermination?: boolean;
  Description?: string;
  DeviceIndex?: number;
  Groups?: string[];
  InterfaceType?: string;
  Ipv4PrefixCount?: number;
  Ipv4Prefixes?: AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails[];
  Ipv6AddressCount?: number;
  Ipv6Addresses?: AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails[];
  Ipv6PrefixCount?: number;
  Ipv6Prefixes?: AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails[];
  NetworkCardIndex?: number;
  NetworkInterfaceId?: string;
  PrivateIpAddress?: string;
  PrivateIpAddresses?: AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails[];
  SecondaryPrivateIpAddressCount?: number;
  SubnetId?: string;
}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails = S.suspend(
  () =>
    S.Struct({
      AssociateCarrierIpAddress: S.optional(S.Boolean),
      AssociatePublicIpAddress: S.optional(S.Boolean),
      DeleteOnTermination: S.optional(S.Boolean),
      Description: S.optional(S.String),
      DeviceIndex: S.optional(S.Number),
      Groups: S.optional(NonEmptyStringList),
      InterfaceType: S.optional(S.String),
      Ipv4PrefixCount: S.optional(S.Number),
      Ipv4Prefixes: S.optional(
        AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesList,
      ),
      Ipv6AddressCount: S.optional(S.Number),
      Ipv6Addresses: S.optional(
        AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesList,
      ),
      Ipv6PrefixCount: S.optional(S.Number),
      Ipv6Prefixes: S.optional(
        AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesList,
      ),
      NetworkCardIndex: S.optional(S.Number),
      NetworkInterfaceId: S.optional(S.String),
      PrivateIpAddress: S.optional(S.String),
      PrivateIpAddresses: S.optional(
        AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesList,
      ),
      SecondaryPrivateIpAddressCount: S.optional(S.Number),
      SubnetId: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails>;
export type AwsEc2LaunchTemplateDataNetworkInterfaceSetList =
  AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails[];
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetList = S.Array(
  AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails,
);
export interface AwsEc2LaunchTemplateDataPlacementDetails {
  Affinity?: string;
  AvailabilityZone?: string;
  GroupName?: string;
  HostId?: string;
  HostResourceGroupArn?: string;
  PartitionNumber?: number;
  SpreadDomain?: string;
  Tenancy?: string;
}
export const AwsEc2LaunchTemplateDataPlacementDetails = S.suspend(() =>
  S.Struct({
    Affinity: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    GroupName: S.optional(S.String),
    HostId: S.optional(S.String),
    HostResourceGroupArn: S.optional(S.String),
    PartitionNumber: S.optional(S.Number),
    SpreadDomain: S.optional(S.String),
    Tenancy: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataPlacementDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataPlacementDetails>;
export interface AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails {
  EnableResourceNameDnsAAAARecord?: boolean;
  EnableResourceNameDnsARecord?: boolean;
  HostnameType?: string;
}
export const AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails = S.suspend(
  () =>
    S.Struct({
      EnableResourceNameDnsAAAARecord: S.optional(S.Boolean),
      EnableResourceNameDnsARecord: S.optional(S.Boolean),
      HostnameType: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails>;
export interface AwsEc2LaunchTemplateDataDetails {
  BlockDeviceMappingSet?: AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails[];
  CapacityReservationSpecification?: AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails;
  CpuOptions?: AwsEc2LaunchTemplateDataCpuOptionsDetails;
  CreditSpecification?: AwsEc2LaunchTemplateDataCreditSpecificationDetails;
  DisableApiStop?: boolean;
  DisableApiTermination?: boolean;
  EbsOptimized?: boolean;
  ElasticGpuSpecificationSet?: AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails[];
  ElasticInferenceAcceleratorSet?: AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails[];
  EnclaveOptions?: AwsEc2LaunchTemplateDataEnclaveOptionsDetails;
  HibernationOptions?: AwsEc2LaunchTemplateDataHibernationOptionsDetails;
  IamInstanceProfile?: AwsEc2LaunchTemplateDataIamInstanceProfileDetails;
  ImageId?: string;
  InstanceInitiatedShutdownBehavior?: string;
  InstanceMarketOptions?: AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails;
  InstanceRequirements?: AwsEc2LaunchTemplateDataInstanceRequirementsDetails;
  InstanceType?: string;
  KernelId?: string;
  KeyName?: string;
  LicenseSet?: AwsEc2LaunchTemplateDataLicenseSetDetails[];
  MaintenanceOptions?: AwsEc2LaunchTemplateDataMaintenanceOptionsDetails;
  MetadataOptions?: AwsEc2LaunchTemplateDataMetadataOptionsDetails;
  Monitoring?: AwsEc2LaunchTemplateDataMonitoringDetails;
  NetworkInterfaceSet?: AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails[];
  Placement?: AwsEc2LaunchTemplateDataPlacementDetails;
  PrivateDnsNameOptions?: AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails;
  RamDiskId?: string;
  SecurityGroupIdSet?: string[];
  SecurityGroupSet?: string[];
  UserData?: string;
}
export const AwsEc2LaunchTemplateDataDetails = S.suspend(() =>
  S.Struct({
    BlockDeviceMappingSet: S.optional(
      AwsEc2LaunchTemplateDataBlockDeviceMappingSetList,
    ),
    CapacityReservationSpecification: S.optional(
      AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails,
    ),
    CpuOptions: S.optional(AwsEc2LaunchTemplateDataCpuOptionsDetails),
    CreditSpecification: S.optional(
      AwsEc2LaunchTemplateDataCreditSpecificationDetails,
    ),
    DisableApiStop: S.optional(S.Boolean),
    DisableApiTermination: S.optional(S.Boolean),
    EbsOptimized: S.optional(S.Boolean),
    ElasticGpuSpecificationSet: S.optional(
      AwsEc2LaunchTemplateDataElasticGpuSpecificationSetList,
    ),
    ElasticInferenceAcceleratorSet: S.optional(
      AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetList,
    ),
    EnclaveOptions: S.optional(AwsEc2LaunchTemplateDataEnclaveOptionsDetails),
    HibernationOptions: S.optional(
      AwsEc2LaunchTemplateDataHibernationOptionsDetails,
    ),
    IamInstanceProfile: S.optional(
      AwsEc2LaunchTemplateDataIamInstanceProfileDetails,
    ),
    ImageId: S.optional(S.String),
    InstanceInitiatedShutdownBehavior: S.optional(S.String),
    InstanceMarketOptions: S.optional(
      AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails,
    ),
    InstanceRequirements: S.optional(
      AwsEc2LaunchTemplateDataInstanceRequirementsDetails,
    ),
    InstanceType: S.optional(S.String),
    KernelId: S.optional(S.String),
    KeyName: S.optional(S.String),
    LicenseSet: S.optional(AwsEc2LaunchTemplateDataLicenseSetList),
    MaintenanceOptions: S.optional(
      AwsEc2LaunchTemplateDataMaintenanceOptionsDetails,
    ),
    MetadataOptions: S.optional(AwsEc2LaunchTemplateDataMetadataOptionsDetails),
    Monitoring: S.optional(AwsEc2LaunchTemplateDataMonitoringDetails),
    NetworkInterfaceSet: S.optional(
      AwsEc2LaunchTemplateDataNetworkInterfaceSetList,
    ),
    Placement: S.optional(AwsEc2LaunchTemplateDataPlacementDetails),
    PrivateDnsNameOptions: S.optional(
      AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails,
    ),
    RamDiskId: S.optional(S.String),
    SecurityGroupIdSet: S.optional(NonEmptyStringList),
    SecurityGroupSet: S.optional(NonEmptyStringList),
    UserData: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDataDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDataDetails>;
export interface AwsEc2LaunchTemplateDetails {
  LaunchTemplateName?: string;
  Id?: string;
  LaunchTemplateData?: AwsEc2LaunchTemplateDataDetails;
  DefaultVersionNumber?: number;
  LatestVersionNumber?: number;
}
export const AwsEc2LaunchTemplateDetails = S.suspend(() =>
  S.Struct({
    LaunchTemplateName: S.optional(S.String),
    Id: S.optional(S.String),
    LaunchTemplateData: S.optional(AwsEc2LaunchTemplateDataDetails),
    DefaultVersionNumber: S.optional(S.Number),
    LatestVersionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsEc2LaunchTemplateDetails",
}) as any as S.Schema<AwsEc2LaunchTemplateDetails>;
export interface AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails {
  MinimumInstanceMetadataServiceVersion?: string;
}
export const AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails =
  S.suspend(() =>
    S.Struct({ MinimumInstanceMetadataServiceVersion: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails",
  }) as any as S.Schema<AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails>;
export interface AwsSageMakerNotebookInstanceDetails {
  AcceleratorTypes?: string[];
  AdditionalCodeRepositories?: string[];
  DefaultCodeRepository?: string;
  DirectInternetAccess?: string;
  FailureReason?: string;
  InstanceMetadataServiceConfiguration?: AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails;
  InstanceType?: string;
  KmsKeyId?: string;
  NetworkInterfaceId?: string;
  NotebookInstanceArn?: string;
  NotebookInstanceLifecycleConfigName?: string;
  NotebookInstanceName?: string;
  NotebookInstanceStatus?: string;
  PlatformIdentifier?: string;
  RoleArn?: string;
  RootAccess?: string;
  SecurityGroups?: string[];
  SubnetId?: string;
  Url?: string;
  VolumeSizeInGB?: number;
}
export const AwsSageMakerNotebookInstanceDetails = S.suspend(() =>
  S.Struct({
    AcceleratorTypes: S.optional(NonEmptyStringList),
    AdditionalCodeRepositories: S.optional(NonEmptyStringList),
    DefaultCodeRepository: S.optional(S.String),
    DirectInternetAccess: S.optional(S.String),
    FailureReason: S.optional(S.String),
    InstanceMetadataServiceConfiguration: S.optional(
      AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails,
    ),
    InstanceType: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    NetworkInterfaceId: S.optional(S.String),
    NotebookInstanceArn: S.optional(S.String),
    NotebookInstanceLifecycleConfigName: S.optional(S.String),
    NotebookInstanceName: S.optional(S.String),
    NotebookInstanceStatus: S.optional(S.String),
    PlatformIdentifier: S.optional(S.String),
    RoleArn: S.optional(S.String),
    RootAccess: S.optional(S.String),
    SecurityGroups: S.optional(NonEmptyStringList),
    SubnetId: S.optional(S.String),
    Url: S.optional(S.String),
    VolumeSizeInGB: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsSageMakerNotebookInstanceDetails",
}) as any as S.Schema<AwsSageMakerNotebookInstanceDetails>;
export interface AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails {
  ImmunityTime?: number;
}
export const AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails = S.suspend(
  () => S.Struct({ ImmunityTime: S.optional(S.Number) }),
).annotations({
  identifier: "AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails",
}) as any as S.Schema<AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails>;
export interface AwsWafv2WebAclCaptchaConfigDetails {
  ImmunityTimeProperty?: AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails;
}
export const AwsWafv2WebAclCaptchaConfigDetails = S.suspend(() =>
  S.Struct({
    ImmunityTimeProperty: S.optional(
      AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails,
    ),
  }),
).annotations({
  identifier: "AwsWafv2WebAclCaptchaConfigDetails",
}) as any as S.Schema<AwsWafv2WebAclCaptchaConfigDetails>;
export interface AwsWafv2CustomHttpHeader {
  Name?: string;
  Value?: string;
}
export const AwsWafv2CustomHttpHeader = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "AwsWafv2CustomHttpHeader",
}) as any as S.Schema<AwsWafv2CustomHttpHeader>;
export type AwsWafv2InsertHeadersList = AwsWafv2CustomHttpHeader[];
export const AwsWafv2InsertHeadersList = S.Array(AwsWafv2CustomHttpHeader);
export interface AwsWafv2CustomRequestHandlingDetails {
  InsertHeaders?: AwsWafv2CustomHttpHeader[];
}
export const AwsWafv2CustomRequestHandlingDetails = S.suspend(() =>
  S.Struct({ InsertHeaders: S.optional(AwsWafv2InsertHeadersList) }),
).annotations({
  identifier: "AwsWafv2CustomRequestHandlingDetails",
}) as any as S.Schema<AwsWafv2CustomRequestHandlingDetails>;
export interface AwsWafv2ActionAllowDetails {
  CustomRequestHandling?: AwsWafv2CustomRequestHandlingDetails;
}
export const AwsWafv2ActionAllowDetails = S.suspend(() =>
  S.Struct({
    CustomRequestHandling: S.optional(AwsWafv2CustomRequestHandlingDetails),
  }),
).annotations({
  identifier: "AwsWafv2ActionAllowDetails",
}) as any as S.Schema<AwsWafv2ActionAllowDetails>;
export interface AwsWafv2CustomResponseDetails {
  CustomResponseBodyKey?: string;
  ResponseCode?: number;
  ResponseHeaders?: AwsWafv2CustomHttpHeader[];
}
export const AwsWafv2CustomResponseDetails = S.suspend(() =>
  S.Struct({
    CustomResponseBodyKey: S.optional(S.String),
    ResponseCode: S.optional(S.Number),
    ResponseHeaders: S.optional(AwsWafv2InsertHeadersList),
  }),
).annotations({
  identifier: "AwsWafv2CustomResponseDetails",
}) as any as S.Schema<AwsWafv2CustomResponseDetails>;
export interface AwsWafv2ActionBlockDetails {
  CustomResponse?: AwsWafv2CustomResponseDetails;
}
export const AwsWafv2ActionBlockDetails = S.suspend(() =>
  S.Struct({ CustomResponse: S.optional(AwsWafv2CustomResponseDetails) }),
).annotations({
  identifier: "AwsWafv2ActionBlockDetails",
}) as any as S.Schema<AwsWafv2ActionBlockDetails>;
export interface AwsWafv2WebAclActionDetails {
  Allow?: AwsWafv2ActionAllowDetails;
  Block?: AwsWafv2ActionBlockDetails;
}
export const AwsWafv2WebAclActionDetails = S.suspend(() =>
  S.Struct({
    Allow: S.optional(AwsWafv2ActionAllowDetails),
    Block: S.optional(AwsWafv2ActionBlockDetails),
  }),
).annotations({
  identifier: "AwsWafv2WebAclActionDetails",
}) as any as S.Schema<AwsWafv2WebAclActionDetails>;
export interface AwsWafv2RulesActionCaptchaDetails {
  CustomRequestHandling?: AwsWafv2CustomRequestHandlingDetails;
}
export const AwsWafv2RulesActionCaptchaDetails = S.suspend(() =>
  S.Struct({
    CustomRequestHandling: S.optional(AwsWafv2CustomRequestHandlingDetails),
  }),
).annotations({
  identifier: "AwsWafv2RulesActionCaptchaDetails",
}) as any as S.Schema<AwsWafv2RulesActionCaptchaDetails>;
export interface AwsWafv2RulesActionCountDetails {
  CustomRequestHandling?: AwsWafv2CustomRequestHandlingDetails;
}
export const AwsWafv2RulesActionCountDetails = S.suspend(() =>
  S.Struct({
    CustomRequestHandling: S.optional(AwsWafv2CustomRequestHandlingDetails),
  }),
).annotations({
  identifier: "AwsWafv2RulesActionCountDetails",
}) as any as S.Schema<AwsWafv2RulesActionCountDetails>;
export interface AwsWafv2RulesActionDetails {
  Allow?: AwsWafv2ActionAllowDetails;
  Block?: AwsWafv2ActionBlockDetails;
  Captcha?: AwsWafv2RulesActionCaptchaDetails;
  Count?: AwsWafv2RulesActionCountDetails;
}
export const AwsWafv2RulesActionDetails = S.suspend(() =>
  S.Struct({
    Allow: S.optional(AwsWafv2ActionAllowDetails),
    Block: S.optional(AwsWafv2ActionBlockDetails),
    Captcha: S.optional(AwsWafv2RulesActionCaptchaDetails),
    Count: S.optional(AwsWafv2RulesActionCountDetails),
  }),
).annotations({
  identifier: "AwsWafv2RulesActionDetails",
}) as any as S.Schema<AwsWafv2RulesActionDetails>;
export interface AwsWafv2VisibilityConfigDetails {
  CloudWatchMetricsEnabled?: boolean;
  MetricName?: string;
  SampledRequestsEnabled?: boolean;
}
export const AwsWafv2VisibilityConfigDetails = S.suspend(() =>
  S.Struct({
    CloudWatchMetricsEnabled: S.optional(S.Boolean),
    MetricName: S.optional(S.String),
    SampledRequestsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsWafv2VisibilityConfigDetails",
}) as any as S.Schema<AwsWafv2VisibilityConfigDetails>;
export interface AwsWafv2RulesDetails {
  Action?: AwsWafv2RulesActionDetails;
  Name?: string;
  OverrideAction?: string;
  Priority?: number;
  VisibilityConfig?: AwsWafv2VisibilityConfigDetails;
}
export const AwsWafv2RulesDetails = S.suspend(() =>
  S.Struct({
    Action: S.optional(AwsWafv2RulesActionDetails),
    Name: S.optional(S.String),
    OverrideAction: S.optional(S.String),
    Priority: S.optional(S.Number),
    VisibilityConfig: S.optional(AwsWafv2VisibilityConfigDetails),
  }),
).annotations({
  identifier: "AwsWafv2RulesDetails",
}) as any as S.Schema<AwsWafv2RulesDetails>;
export type AwsWafv2RulesList = AwsWafv2RulesDetails[];
export const AwsWafv2RulesList = S.Array(AwsWafv2RulesDetails);
export interface AwsWafv2WebAclDetails {
  Name?: string;
  Arn?: string;
  ManagedbyFirewallManager?: boolean;
  Id?: string;
  Capacity?: number;
  CaptchaConfig?: AwsWafv2WebAclCaptchaConfigDetails;
  DefaultAction?: AwsWafv2WebAclActionDetails;
  Description?: string;
  Rules?: AwsWafv2RulesDetails[];
  VisibilityConfig?: AwsWafv2VisibilityConfigDetails;
}
export const AwsWafv2WebAclDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    ManagedbyFirewallManager: S.optional(S.Boolean),
    Id: S.optional(S.String),
    Capacity: S.optional(S.Number),
    CaptchaConfig: S.optional(AwsWafv2WebAclCaptchaConfigDetails),
    DefaultAction: S.optional(AwsWafv2WebAclActionDetails),
    Description: S.optional(S.String),
    Rules: S.optional(AwsWafv2RulesList),
    VisibilityConfig: S.optional(AwsWafv2VisibilityConfigDetails),
  }),
).annotations({
  identifier: "AwsWafv2WebAclDetails",
}) as any as S.Schema<AwsWafv2WebAclDetails>;
export interface AwsWafv2RuleGroupDetails {
  Capacity?: number;
  Description?: string;
  Id?: string;
  Name?: string;
  Arn?: string;
  Rules?: AwsWafv2RulesDetails[];
  Scope?: string;
  VisibilityConfig?: AwsWafv2VisibilityConfigDetails;
}
export const AwsWafv2RuleGroupDetails = S.suspend(() =>
  S.Struct({
    Capacity: S.optional(S.Number),
    Description: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Rules: S.optional(AwsWafv2RulesList),
    Scope: S.optional(S.String),
    VisibilityConfig: S.optional(AwsWafv2VisibilityConfigDetails),
  }),
).annotations({
  identifier: "AwsWafv2RuleGroupDetails",
}) as any as S.Schema<AwsWafv2RuleGroupDetails>;
export interface AssociationStateDetails {
  State?: string;
  StatusMessage?: string;
}
export const AssociationStateDetails = S.suspend(() =>
  S.Struct({
    State: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociationStateDetails",
}) as any as S.Schema<AssociationStateDetails>;
export interface AssociationSetDetails {
  AssociationState?: AssociationStateDetails;
  GatewayId?: string;
  Main?: boolean;
  RouteTableAssociationId?: string;
  RouteTableId?: string;
  SubnetId?: string;
}
export const AssociationSetDetails = S.suspend(() =>
  S.Struct({
    AssociationState: S.optional(AssociationStateDetails),
    GatewayId: S.optional(S.String),
    Main: S.optional(S.Boolean),
    RouteTableAssociationId: S.optional(S.String),
    RouteTableId: S.optional(S.String),
    SubnetId: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociationSetDetails",
}) as any as S.Schema<AssociationSetDetails>;
export type AssociationSetList = AssociationSetDetails[];
export const AssociationSetList = S.Array(AssociationSetDetails);
export interface PropagatingVgwSetDetails {
  GatewayId?: string;
}
export const PropagatingVgwSetDetails = S.suspend(() =>
  S.Struct({ GatewayId: S.optional(S.String) }),
).annotations({
  identifier: "PropagatingVgwSetDetails",
}) as any as S.Schema<PropagatingVgwSetDetails>;
export type PropagatingVgwSetList = PropagatingVgwSetDetails[];
export const PropagatingVgwSetList = S.Array(PropagatingVgwSetDetails);
export interface RouteSetDetails {
  CarrierGatewayId?: string;
  CoreNetworkArn?: string;
  DestinationCidrBlock?: string;
  DestinationIpv6CidrBlock?: string;
  DestinationPrefixListId?: string;
  EgressOnlyInternetGatewayId?: string;
  GatewayId?: string;
  InstanceId?: string;
  InstanceOwnerId?: string;
  LocalGatewayId?: string;
  NatGatewayId?: string;
  NetworkInterfaceId?: string;
  Origin?: string;
  State?: string;
  TransitGatewayId?: string;
  VpcPeeringConnectionId?: string;
}
export const RouteSetDetails = S.suspend(() =>
  S.Struct({
    CarrierGatewayId: S.optional(S.String),
    CoreNetworkArn: S.optional(S.String),
    DestinationCidrBlock: S.optional(S.String),
    DestinationIpv6CidrBlock: S.optional(S.String),
    DestinationPrefixListId: S.optional(S.String),
    EgressOnlyInternetGatewayId: S.optional(S.String),
    GatewayId: S.optional(S.String),
    InstanceId: S.optional(S.String),
    InstanceOwnerId: S.optional(S.String),
    LocalGatewayId: S.optional(S.String),
    NatGatewayId: S.optional(S.String),
    NetworkInterfaceId: S.optional(S.String),
    Origin: S.optional(S.String),
    State: S.optional(S.String),
    TransitGatewayId: S.optional(S.String),
    VpcPeeringConnectionId: S.optional(S.String),
  }),
).annotations({
  identifier: "RouteSetDetails",
}) as any as S.Schema<RouteSetDetails>;
export type RouteSetList = RouteSetDetails[];
export const RouteSetList = S.Array(RouteSetDetails);
export interface AwsEc2RouteTableDetails {
  AssociationSet?: AssociationSetDetails[];
  OwnerId?: string;
  PropagatingVgwSet?: PropagatingVgwSetDetails[];
  RouteTableId?: string;
  RouteSet?: RouteSetDetails[];
  VpcId?: string;
}
export const AwsEc2RouteTableDetails = S.suspend(() =>
  S.Struct({
    AssociationSet: S.optional(AssociationSetList),
    OwnerId: S.optional(S.String),
    PropagatingVgwSet: S.optional(PropagatingVgwSetList),
    RouteTableId: S.optional(S.String),
    RouteSet: S.optional(RouteSetList),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEc2RouteTableDetails",
}) as any as S.Schema<AwsEc2RouteTableDetails>;
export interface AwsAmazonMqBrokerEncryptionOptionsDetails {
  KmsKeyId?: string;
  UseAwsOwnedKey?: boolean;
}
export const AwsAmazonMqBrokerEncryptionOptionsDetails = S.suspend(() =>
  S.Struct({
    KmsKeyId: S.optional(S.String),
    UseAwsOwnedKey: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsAmazonMqBrokerEncryptionOptionsDetails",
}) as any as S.Schema<AwsAmazonMqBrokerEncryptionOptionsDetails>;
export interface AwsAmazonMqBrokerLdapServerMetadataDetails {
  Hosts?: string[];
  RoleBase?: string;
  RoleName?: string;
  RoleSearchMatching?: string;
  RoleSearchSubtree?: boolean;
  ServiceAccountUsername?: string;
  UserBase?: string;
  UserRoleName?: string;
  UserSearchMatching?: string;
  UserSearchSubtree?: boolean;
}
export const AwsAmazonMqBrokerLdapServerMetadataDetails = S.suspend(() =>
  S.Struct({
    Hosts: S.optional(StringList),
    RoleBase: S.optional(S.String),
    RoleName: S.optional(S.String),
    RoleSearchMatching: S.optional(S.String),
    RoleSearchSubtree: S.optional(S.Boolean),
    ServiceAccountUsername: S.optional(S.String),
    UserBase: S.optional(S.String),
    UserRoleName: S.optional(S.String),
    UserSearchMatching: S.optional(S.String),
    UserSearchSubtree: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AwsAmazonMqBrokerLdapServerMetadataDetails",
}) as any as S.Schema<AwsAmazonMqBrokerLdapServerMetadataDetails>;
export interface AwsAmazonMqBrokerLogsPendingDetails {
  Audit?: boolean;
  General?: boolean;
}
export const AwsAmazonMqBrokerLogsPendingDetails = S.suspend(() =>
  S.Struct({ Audit: S.optional(S.Boolean), General: S.optional(S.Boolean) }),
).annotations({
  identifier: "AwsAmazonMqBrokerLogsPendingDetails",
}) as any as S.Schema<AwsAmazonMqBrokerLogsPendingDetails>;
export interface AwsAmazonMqBrokerLogsDetails {
  Audit?: boolean;
  General?: boolean;
  AuditLogGroup?: string;
  GeneralLogGroup?: string;
  Pending?: AwsAmazonMqBrokerLogsPendingDetails;
}
export const AwsAmazonMqBrokerLogsDetails = S.suspend(() =>
  S.Struct({
    Audit: S.optional(S.Boolean),
    General: S.optional(S.Boolean),
    AuditLogGroup: S.optional(S.String),
    GeneralLogGroup: S.optional(S.String),
    Pending: S.optional(AwsAmazonMqBrokerLogsPendingDetails),
  }),
).annotations({
  identifier: "AwsAmazonMqBrokerLogsDetails",
}) as any as S.Schema<AwsAmazonMqBrokerLogsDetails>;
export interface AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails {
  DayOfWeek?: string;
  TimeOfDay?: string;
  TimeZone?: string;
}
export const AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails = S.suspend(
  () =>
    S.Struct({
      DayOfWeek: S.optional(S.String),
      TimeOfDay: S.optional(S.String),
      TimeZone: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails",
}) as any as S.Schema<AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails>;
export interface AwsAmazonMqBrokerUsersDetails {
  PendingChange?: string;
  Username?: string;
}
export const AwsAmazonMqBrokerUsersDetails = S.suspend(() =>
  S.Struct({
    PendingChange: S.optional(S.String),
    Username: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsAmazonMqBrokerUsersDetails",
}) as any as S.Schema<AwsAmazonMqBrokerUsersDetails>;
export type AwsAmazonMqBrokerUsersList = AwsAmazonMqBrokerUsersDetails[];
export const AwsAmazonMqBrokerUsersList = S.Array(
  AwsAmazonMqBrokerUsersDetails,
);
export interface AwsAmazonMqBrokerDetails {
  AuthenticationStrategy?: string;
  AutoMinorVersionUpgrade?: boolean;
  BrokerArn?: string;
  BrokerName?: string;
  DeploymentMode?: string;
  EncryptionOptions?: AwsAmazonMqBrokerEncryptionOptionsDetails;
  EngineType?: string;
  EngineVersion?: string;
  HostInstanceType?: string;
  BrokerId?: string;
  LdapServerMetadata?: AwsAmazonMqBrokerLdapServerMetadataDetails;
  Logs?: AwsAmazonMqBrokerLogsDetails;
  MaintenanceWindowStartTime?: AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails;
  PubliclyAccessible?: boolean;
  SecurityGroups?: string[];
  StorageType?: string;
  SubnetIds?: string[];
  Users?: AwsAmazonMqBrokerUsersDetails[];
}
export const AwsAmazonMqBrokerDetails = S.suspend(() =>
  S.Struct({
    AuthenticationStrategy: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    BrokerArn: S.optional(S.String),
    BrokerName: S.optional(S.String),
    DeploymentMode: S.optional(S.String),
    EncryptionOptions: S.optional(AwsAmazonMqBrokerEncryptionOptionsDetails),
    EngineType: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    HostInstanceType: S.optional(S.String),
    BrokerId: S.optional(S.String),
    LdapServerMetadata: S.optional(AwsAmazonMqBrokerLdapServerMetadataDetails),
    Logs: S.optional(AwsAmazonMqBrokerLogsDetails),
    MaintenanceWindowStartTime: S.optional(
      AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails,
    ),
    PubliclyAccessible: S.optional(S.Boolean),
    SecurityGroups: S.optional(StringList),
    StorageType: S.optional(S.String),
    SubnetIds: S.optional(StringList),
    Users: S.optional(AwsAmazonMqBrokerUsersList),
  }),
).annotations({
  identifier: "AwsAmazonMqBrokerDetails",
}) as any as S.Schema<AwsAmazonMqBrokerDetails>;
export interface AwsAppSyncGraphQlApiOpenIdConnectConfigDetails {
  AuthTtL?: number;
  ClientId?: string;
  IatTtL?: number;
  Issuer?: string;
}
export const AwsAppSyncGraphQlApiOpenIdConnectConfigDetails = S.suspend(() =>
  S.Struct({
    AuthTtL: S.optional(S.Number),
    ClientId: S.optional(S.String),
    IatTtL: S.optional(S.Number),
    Issuer: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsAppSyncGraphQlApiOpenIdConnectConfigDetails",
}) as any as S.Schema<AwsAppSyncGraphQlApiOpenIdConnectConfigDetails>;
export interface AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails {
  AuthorizerResultTtlInSeconds?: number;
  AuthorizerUri?: string;
  IdentityValidationExpression?: string;
}
export const AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails = S.suspend(() =>
  S.Struct({
    AuthorizerResultTtlInSeconds: S.optional(S.Number),
    AuthorizerUri: S.optional(S.String),
    IdentityValidationExpression: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails",
}) as any as S.Schema<AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails>;
export interface AwsAppSyncGraphQlApiUserPoolConfigDetails {
  AppIdClientRegex?: string;
  AwsRegion?: string;
  DefaultAction?: string;
  UserPoolId?: string;
}
export const AwsAppSyncGraphQlApiUserPoolConfigDetails = S.suspend(() =>
  S.Struct({
    AppIdClientRegex: S.optional(S.String),
    AwsRegion: S.optional(S.String),
    DefaultAction: S.optional(S.String),
    UserPoolId: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsAppSyncGraphQlApiUserPoolConfigDetails",
}) as any as S.Schema<AwsAppSyncGraphQlApiUserPoolConfigDetails>;
export interface AwsAppSyncGraphQlApiLogConfigDetails {
  CloudWatchLogsRoleArn?: string;
  ExcludeVerboseContent?: boolean;
  FieldLogLevel?: string;
}
export const AwsAppSyncGraphQlApiLogConfigDetails = S.suspend(() =>
  S.Struct({
    CloudWatchLogsRoleArn: S.optional(S.String),
    ExcludeVerboseContent: S.optional(S.Boolean),
    FieldLogLevel: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsAppSyncGraphQlApiLogConfigDetails",
}) as any as S.Schema<AwsAppSyncGraphQlApiLogConfigDetails>;
export interface AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails {
  AuthenticationType?: string;
  LambdaAuthorizerConfig?: AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails;
  OpenIdConnectConfig?: AwsAppSyncGraphQlApiOpenIdConnectConfigDetails;
  UserPoolConfig?: AwsAppSyncGraphQlApiUserPoolConfigDetails;
}
export const AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails =
  S.suspend(() =>
    S.Struct({
      AuthenticationType: S.optional(S.String),
      LambdaAuthorizerConfig: S.optional(
        AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails,
      ),
      OpenIdConnectConfig: S.optional(
        AwsAppSyncGraphQlApiOpenIdConnectConfigDetails,
      ),
      UserPoolConfig: S.optional(AwsAppSyncGraphQlApiUserPoolConfigDetails),
    }),
  ).annotations({
    identifier: "AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails",
  }) as any as S.Schema<AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails>;
export type AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersList =
  AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails[];
export const AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersList =
  S.Array(AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails);
export interface AwsAppSyncGraphQlApiDetails {
  ApiId?: string;
  Id?: string;
  OpenIdConnectConfig?: AwsAppSyncGraphQlApiOpenIdConnectConfigDetails;
  Name?: string;
  LambdaAuthorizerConfig?: AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails;
  XrayEnabled?: boolean;
  Arn?: string;
  UserPoolConfig?: AwsAppSyncGraphQlApiUserPoolConfigDetails;
  AuthenticationType?: string;
  LogConfig?: AwsAppSyncGraphQlApiLogConfigDetails;
  AdditionalAuthenticationProviders?: AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails[];
  WafWebAclArn?: string;
}
export const AwsAppSyncGraphQlApiDetails = S.suspend(() =>
  S.Struct({
    ApiId: S.optional(S.String),
    Id: S.optional(S.String),
    OpenIdConnectConfig: S.optional(
      AwsAppSyncGraphQlApiOpenIdConnectConfigDetails,
    ),
    Name: S.optional(S.String),
    LambdaAuthorizerConfig: S.optional(
      AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails,
    ),
    XrayEnabled: S.optional(S.Boolean),
    Arn: S.optional(S.String),
    UserPoolConfig: S.optional(AwsAppSyncGraphQlApiUserPoolConfigDetails),
    AuthenticationType: S.optional(S.String),
    LogConfig: S.optional(AwsAppSyncGraphQlApiLogConfigDetails),
    AdditionalAuthenticationProviders: S.optional(
      AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersList,
    ),
    WafWebAclArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsAppSyncGraphQlApiDetails",
}) as any as S.Schema<AwsAppSyncGraphQlApiDetails>;
export interface AwsEventSchemasRegistryDetails {
  Description?: string;
  RegistryArn?: string;
  RegistryName?: string;
}
export const AwsEventSchemasRegistryDetails = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    RegistryArn: S.optional(S.String),
    RegistryName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEventSchemasRegistryDetails",
}) as any as S.Schema<AwsEventSchemasRegistryDetails>;
export interface AwsGuardDutyDetectorDataSourcesCloudTrailDetails {
  Status?: string;
}
export const AwsGuardDutyDetectorDataSourcesCloudTrailDetails = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "AwsGuardDutyDetectorDataSourcesCloudTrailDetails",
}) as any as S.Schema<AwsGuardDutyDetectorDataSourcesCloudTrailDetails>;
export interface AwsGuardDutyDetectorDataSourcesDnsLogsDetails {
  Status?: string;
}
export const AwsGuardDutyDetectorDataSourcesDnsLogsDetails = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "AwsGuardDutyDetectorDataSourcesDnsLogsDetails",
}) as any as S.Schema<AwsGuardDutyDetectorDataSourcesDnsLogsDetails>;
export interface AwsGuardDutyDetectorDataSourcesFlowLogsDetails {
  Status?: string;
}
export const AwsGuardDutyDetectorDataSourcesFlowLogsDetails = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "AwsGuardDutyDetectorDataSourcesFlowLogsDetails",
}) as any as S.Schema<AwsGuardDutyDetectorDataSourcesFlowLogsDetails>;
export interface AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails {
  Status?: string;
}
export const AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails =
  S.suspend(() => S.Struct({ Status: S.optional(S.String) })).annotations({
    identifier: "AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails",
  }) as any as S.Schema<AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails>;
export interface AwsGuardDutyDetectorDataSourcesKubernetesDetails {
  AuditLogs?: AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails;
}
export const AwsGuardDutyDetectorDataSourcesKubernetesDetails = S.suspend(() =>
  S.Struct({
    AuditLogs: S.optional(
      AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails,
    ),
  }),
).annotations({
  identifier: "AwsGuardDutyDetectorDataSourcesKubernetesDetails",
}) as any as S.Schema<AwsGuardDutyDetectorDataSourcesKubernetesDetails>;
export interface AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails {
  Reason?: string;
  Status?: string;
}
export const AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails =
  S.suspend(() =>
    S.Struct({ Reason: S.optional(S.String), Status: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails",
  }) as any as S.Schema<AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails>;
export interface AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails {
  EbsVolumes?: AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails;
}
export const AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails =
  S.suspend(() =>
    S.Struct({
      EbsVolumes: S.optional(
        AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails,
      ),
    }),
  ).annotations({
    identifier:
      "AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails",
  }) as any as S.Schema<AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails>;
export interface AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails {
  ScanEc2InstanceWithFindings?: AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails;
  ServiceRole?: string;
}
export const AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails =
  S.suspend(() =>
    S.Struct({
      ScanEc2InstanceWithFindings: S.optional(
        AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails,
      ),
      ServiceRole: S.optional(S.String),
    }),
  ).annotations({
    identifier: "AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails",
  }) as any as S.Schema<AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails>;
export interface AwsGuardDutyDetectorDataSourcesS3LogsDetails {
  Status?: string;
}
export const AwsGuardDutyDetectorDataSourcesS3LogsDetails = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "AwsGuardDutyDetectorDataSourcesS3LogsDetails",
}) as any as S.Schema<AwsGuardDutyDetectorDataSourcesS3LogsDetails>;
export interface AwsGuardDutyDetectorDataSourcesDetails {
  CloudTrail?: AwsGuardDutyDetectorDataSourcesCloudTrailDetails;
  DnsLogs?: AwsGuardDutyDetectorDataSourcesDnsLogsDetails;
  FlowLogs?: AwsGuardDutyDetectorDataSourcesFlowLogsDetails;
  Kubernetes?: AwsGuardDutyDetectorDataSourcesKubernetesDetails;
  MalwareProtection?: AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails;
  S3Logs?: AwsGuardDutyDetectorDataSourcesS3LogsDetails;
}
export const AwsGuardDutyDetectorDataSourcesDetails = S.suspend(() =>
  S.Struct({
    CloudTrail: S.optional(AwsGuardDutyDetectorDataSourcesCloudTrailDetails),
    DnsLogs: S.optional(AwsGuardDutyDetectorDataSourcesDnsLogsDetails),
    FlowLogs: S.optional(AwsGuardDutyDetectorDataSourcesFlowLogsDetails),
    Kubernetes: S.optional(AwsGuardDutyDetectorDataSourcesKubernetesDetails),
    MalwareProtection: S.optional(
      AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails,
    ),
    S3Logs: S.optional(AwsGuardDutyDetectorDataSourcesS3LogsDetails),
  }),
).annotations({
  identifier: "AwsGuardDutyDetectorDataSourcesDetails",
}) as any as S.Schema<AwsGuardDutyDetectorDataSourcesDetails>;
export interface AwsGuardDutyDetectorFeaturesDetails {
  Name?: string;
  Status?: string;
}
export const AwsGuardDutyDetectorFeaturesDetails = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "AwsGuardDutyDetectorFeaturesDetails",
}) as any as S.Schema<AwsGuardDutyDetectorFeaturesDetails>;
export type AwsGuardDutyDetectorFeaturesList =
  AwsGuardDutyDetectorFeaturesDetails[];
export const AwsGuardDutyDetectorFeaturesList = S.Array(
  AwsGuardDutyDetectorFeaturesDetails,
);
export interface AwsGuardDutyDetectorDetails {
  DataSources?: AwsGuardDutyDetectorDataSourcesDetails;
  Features?: AwsGuardDutyDetectorFeaturesDetails[];
  FindingPublishingFrequency?: string;
  ServiceRole?: string;
  Status?: string;
}
export const AwsGuardDutyDetectorDetails = S.suspend(() =>
  S.Struct({
    DataSources: S.optional(AwsGuardDutyDetectorDataSourcesDetails),
    Features: S.optional(AwsGuardDutyDetectorFeaturesList),
    FindingPublishingFrequency: S.optional(S.String),
    ServiceRole: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsGuardDutyDetectorDetails",
}) as any as S.Schema<AwsGuardDutyDetectorDetails>;
export interface AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails {
  LogGroupArn?: string;
}
export const AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails =
  S.suspend(() => S.Struct({ LogGroupArn: S.optional(S.String) })).annotations({
    identifier:
      "AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails",
  }) as any as S.Schema<AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails>;
export interface AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails {
  CloudWatchLogsLogGroup?: AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails;
}
export const AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails =
  S.suspend(() =>
    S.Struct({
      CloudWatchLogsLogGroup: S.optional(
        AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails,
      ),
    }),
  ).annotations({
    identifier:
      "AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails",
  }) as any as S.Schema<AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails>;
export type AwsStepFunctionStateMachineLoggingConfigurationDestinationsList =
  AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails[];
export const AwsStepFunctionStateMachineLoggingConfigurationDestinationsList =
  S.Array(AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails);
export interface AwsStepFunctionStateMachineLoggingConfigurationDetails {
  Destinations?: AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails[];
  IncludeExecutionData?: boolean;
  Level?: string;
}
export const AwsStepFunctionStateMachineLoggingConfigurationDetails = S.suspend(
  () =>
    S.Struct({
      Destinations: S.optional(
        AwsStepFunctionStateMachineLoggingConfigurationDestinationsList,
      ),
      IncludeExecutionData: S.optional(S.Boolean),
      Level: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsStepFunctionStateMachineLoggingConfigurationDetails",
}) as any as S.Schema<AwsStepFunctionStateMachineLoggingConfigurationDetails>;
export interface AwsStepFunctionStateMachineTracingConfigurationDetails {
  Enabled?: boolean;
}
export const AwsStepFunctionStateMachineTracingConfigurationDetails = S.suspend(
  () => S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AwsStepFunctionStateMachineTracingConfigurationDetails",
}) as any as S.Schema<AwsStepFunctionStateMachineTracingConfigurationDetails>;
export interface AwsStepFunctionStateMachineDetails {
  Label?: string;
  LoggingConfiguration?: AwsStepFunctionStateMachineLoggingConfigurationDetails;
  Name?: string;
  RoleArn?: string;
  StateMachineArn?: string;
  Status?: string;
  TracingConfiguration?: AwsStepFunctionStateMachineTracingConfigurationDetails;
  Type?: string;
}
export const AwsStepFunctionStateMachineDetails = S.suspend(() =>
  S.Struct({
    Label: S.optional(S.String),
    LoggingConfiguration: S.optional(
      AwsStepFunctionStateMachineLoggingConfigurationDetails,
    ),
    Name: S.optional(S.String),
    RoleArn: S.optional(S.String),
    StateMachineArn: S.optional(S.String),
    Status: S.optional(S.String),
    TracingConfiguration: S.optional(
      AwsStepFunctionStateMachineTracingConfigurationDetails,
    ),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsStepFunctionStateMachineDetails",
}) as any as S.Schema<AwsStepFunctionStateMachineDetails>;
export interface AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails {
  EncryptionOption?: string;
  KmsKey?: string;
}
export const AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails =
  S.suspend(() =>
    S.Struct({
      EncryptionOption: S.optional(S.String),
      KmsKey: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails",
  }) as any as S.Schema<AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails>;
export interface AwsAthenaWorkGroupConfigurationResultConfigurationDetails {
  EncryptionConfiguration?: AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails;
}
export const AwsAthenaWorkGroupConfigurationResultConfigurationDetails =
  S.suspend(() =>
    S.Struct({
      EncryptionConfiguration: S.optional(
        AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails,
      ),
    }),
  ).annotations({
    identifier: "AwsAthenaWorkGroupConfigurationResultConfigurationDetails",
  }) as any as S.Schema<AwsAthenaWorkGroupConfigurationResultConfigurationDetails>;
export interface AwsAthenaWorkGroupConfigurationDetails {
  ResultConfiguration?: AwsAthenaWorkGroupConfigurationResultConfigurationDetails;
}
export const AwsAthenaWorkGroupConfigurationDetails = S.suspend(() =>
  S.Struct({
    ResultConfiguration: S.optional(
      AwsAthenaWorkGroupConfigurationResultConfigurationDetails,
    ),
  }),
).annotations({
  identifier: "AwsAthenaWorkGroupConfigurationDetails",
}) as any as S.Schema<AwsAthenaWorkGroupConfigurationDetails>;
export interface AwsAthenaWorkGroupDetails {
  Name?: string;
  Description?: string;
  State?: string;
  Configuration?: AwsAthenaWorkGroupConfigurationDetails;
}
export const AwsAthenaWorkGroupDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    State: S.optional(S.String),
    Configuration: S.optional(AwsAthenaWorkGroupConfigurationDetails),
  }),
).annotations({
  identifier: "AwsAthenaWorkGroupDetails",
}) as any as S.Schema<AwsAthenaWorkGroupDetails>;
export interface AwsEventsEventbusDetails {
  Arn?: string;
  Name?: string;
  Policy?: string;
}
export const AwsEventsEventbusDetails = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Policy: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEventsEventbusDetails",
}) as any as S.Schema<AwsEventsEventbusDetails>;
export interface AwsDmsEndpointDetails {
  CertificateArn?: string;
  DatabaseName?: string;
  EndpointArn?: string;
  EndpointIdentifier?: string;
  EndpointType?: string;
  EngineName?: string;
  ExternalId?: string;
  ExtraConnectionAttributes?: string;
  KmsKeyId?: string;
  Port?: number;
  ServerName?: string;
  SslMode?: string;
  Username?: string;
}
export const AwsDmsEndpointDetails = S.suspend(() =>
  S.Struct({
    CertificateArn: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    EndpointArn: S.optional(S.String),
    EndpointIdentifier: S.optional(S.String),
    EndpointType: S.optional(S.String),
    EngineName: S.optional(S.String),
    ExternalId: S.optional(S.String),
    ExtraConnectionAttributes: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Port: S.optional(S.Number),
    ServerName: S.optional(S.String),
    SslMode: S.optional(S.String),
    Username: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsDmsEndpointDetails",
}) as any as S.Schema<AwsDmsEndpointDetails>;
export interface AwsEventsEndpointEventBusesDetails {
  EventBusArn?: string;
}
export const AwsEventsEndpointEventBusesDetails = S.suspend(() =>
  S.Struct({ EventBusArn: S.optional(S.String) }),
).annotations({
  identifier: "AwsEventsEndpointEventBusesDetails",
}) as any as S.Schema<AwsEventsEndpointEventBusesDetails>;
export type AwsEventsEndpointEventBusesList =
  AwsEventsEndpointEventBusesDetails[];
export const AwsEventsEndpointEventBusesList = S.Array(
  AwsEventsEndpointEventBusesDetails,
);
export interface AwsEventsEndpointReplicationConfigDetails {
  State?: string;
}
export const AwsEventsEndpointReplicationConfigDetails = S.suspend(() =>
  S.Struct({ State: S.optional(S.String) }),
).annotations({
  identifier: "AwsEventsEndpointReplicationConfigDetails",
}) as any as S.Schema<AwsEventsEndpointReplicationConfigDetails>;
export interface AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails {
  HealthCheck?: string;
}
export const AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails =
  S.suspend(() => S.Struct({ HealthCheck: S.optional(S.String) })).annotations({
    identifier: "AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails",
  }) as any as S.Schema<AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails>;
export interface AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails {
  Route?: string;
}
export const AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails =
  S.suspend(() => S.Struct({ Route: S.optional(S.String) })).annotations({
    identifier: "AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails",
  }) as any as S.Schema<AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails>;
export interface AwsEventsEndpointRoutingConfigFailoverConfigDetails {
  Primary?: AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails;
  Secondary?: AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails;
}
export const AwsEventsEndpointRoutingConfigFailoverConfigDetails = S.suspend(
  () =>
    S.Struct({
      Primary: S.optional(
        AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails,
      ),
      Secondary: S.optional(
        AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails,
      ),
    }),
).annotations({
  identifier: "AwsEventsEndpointRoutingConfigFailoverConfigDetails",
}) as any as S.Schema<AwsEventsEndpointRoutingConfigFailoverConfigDetails>;
export interface AwsEventsEndpointRoutingConfigDetails {
  FailoverConfig?: AwsEventsEndpointRoutingConfigFailoverConfigDetails;
}
export const AwsEventsEndpointRoutingConfigDetails = S.suspend(() =>
  S.Struct({
    FailoverConfig: S.optional(
      AwsEventsEndpointRoutingConfigFailoverConfigDetails,
    ),
  }),
).annotations({
  identifier: "AwsEventsEndpointRoutingConfigDetails",
}) as any as S.Schema<AwsEventsEndpointRoutingConfigDetails>;
export interface AwsEventsEndpointDetails {
  Arn?: string;
  Description?: string;
  EndpointId?: string;
  EndpointUrl?: string;
  EventBuses?: AwsEventsEndpointEventBusesDetails[];
  Name?: string;
  ReplicationConfig?: AwsEventsEndpointReplicationConfigDetails;
  RoleArn?: string;
  RoutingConfig?: AwsEventsEndpointRoutingConfigDetails;
  State?: string;
  StateReason?: string;
}
export const AwsEventsEndpointDetails = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Description: S.optional(S.String),
    EndpointId: S.optional(S.String),
    EndpointUrl: S.optional(S.String),
    EventBuses: S.optional(AwsEventsEndpointEventBusesList),
    Name: S.optional(S.String),
    ReplicationConfig: S.optional(AwsEventsEndpointReplicationConfigDetails),
    RoleArn: S.optional(S.String),
    RoutingConfig: S.optional(AwsEventsEndpointRoutingConfigDetails),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEventsEndpointDetails",
}) as any as S.Schema<AwsEventsEndpointDetails>;
export interface AwsDmsReplicationTaskDetails {
  CdcStartPosition?: string;
  CdcStartTime?: string;
  CdcStopPosition?: string;
  MigrationType?: string;
  Id?: string;
  ResourceIdentifier?: string;
  ReplicationInstanceArn?: string;
  ReplicationTaskIdentifier?: string;
  ReplicationTaskSettings?: string;
  SourceEndpointArn?: string;
  TableMappings?: string;
  TargetEndpointArn?: string;
  TaskData?: string;
}
export const AwsDmsReplicationTaskDetails = S.suspend(() =>
  S.Struct({
    CdcStartPosition: S.optional(S.String),
    CdcStartTime: S.optional(S.String),
    CdcStopPosition: S.optional(S.String),
    MigrationType: S.optional(S.String),
    Id: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    ReplicationInstanceArn: S.optional(S.String),
    ReplicationTaskIdentifier: S.optional(S.String),
    ReplicationTaskSettings: S.optional(S.String),
    SourceEndpointArn: S.optional(S.String),
    TableMappings: S.optional(S.String),
    TargetEndpointArn: S.optional(S.String),
    TaskData: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsDmsReplicationTaskDetails",
}) as any as S.Schema<AwsDmsReplicationTaskDetails>;
export interface AwsDmsReplicationInstanceReplicationSubnetGroupDetails {
  ReplicationSubnetGroupIdentifier?: string;
}
export const AwsDmsReplicationInstanceReplicationSubnetGroupDetails = S.suspend(
  () => S.Struct({ ReplicationSubnetGroupIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "AwsDmsReplicationInstanceReplicationSubnetGroupDetails",
}) as any as S.Schema<AwsDmsReplicationInstanceReplicationSubnetGroupDetails>;
export interface AwsDmsReplicationInstanceVpcSecurityGroupsDetails {
  VpcSecurityGroupId?: string;
}
export const AwsDmsReplicationInstanceVpcSecurityGroupsDetails = S.suspend(() =>
  S.Struct({ VpcSecurityGroupId: S.optional(S.String) }),
).annotations({
  identifier: "AwsDmsReplicationInstanceVpcSecurityGroupsDetails",
}) as any as S.Schema<AwsDmsReplicationInstanceVpcSecurityGroupsDetails>;
export type AwsDmsReplicationInstanceVpcSecurityGroupsList =
  AwsDmsReplicationInstanceVpcSecurityGroupsDetails[];
export const AwsDmsReplicationInstanceVpcSecurityGroupsList = S.Array(
  AwsDmsReplicationInstanceVpcSecurityGroupsDetails,
);
export interface AwsDmsReplicationInstanceDetails {
  AllocatedStorage?: number;
  AutoMinorVersionUpgrade?: boolean;
  AvailabilityZone?: string;
  EngineVersion?: string;
  KmsKeyId?: string;
  MultiAZ?: boolean;
  PreferredMaintenanceWindow?: string;
  PubliclyAccessible?: boolean;
  ReplicationInstanceClass?: string;
  ReplicationInstanceIdentifier?: string;
  ReplicationSubnetGroup?: AwsDmsReplicationInstanceReplicationSubnetGroupDetails;
  VpcSecurityGroups?: AwsDmsReplicationInstanceVpcSecurityGroupsDetails[];
}
export const AwsDmsReplicationInstanceDetails = S.suspend(() =>
  S.Struct({
    AllocatedStorage: S.optional(S.Number),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    AvailabilityZone: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    PreferredMaintenanceWindow: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    ReplicationInstanceClass: S.optional(S.String),
    ReplicationInstanceIdentifier: S.optional(S.String),
    ReplicationSubnetGroup: S.optional(
      AwsDmsReplicationInstanceReplicationSubnetGroupDetails,
    ),
    VpcSecurityGroups: S.optional(
      AwsDmsReplicationInstanceVpcSecurityGroupsList,
    ),
  }),
).annotations({
  identifier: "AwsDmsReplicationInstanceDetails",
}) as any as S.Schema<AwsDmsReplicationInstanceDetails>;
export interface AwsRoute53HostedZoneConfigDetails {
  Comment?: string;
}
export const AwsRoute53HostedZoneConfigDetails = S.suspend(() =>
  S.Struct({ Comment: S.optional(S.String) }),
).annotations({
  identifier: "AwsRoute53HostedZoneConfigDetails",
}) as any as S.Schema<AwsRoute53HostedZoneConfigDetails>;
export interface AwsRoute53HostedZoneObjectDetails {
  Id?: string;
  Name?: string;
  Config?: AwsRoute53HostedZoneConfigDetails;
}
export const AwsRoute53HostedZoneObjectDetails = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Config: S.optional(AwsRoute53HostedZoneConfigDetails),
  }),
).annotations({
  identifier: "AwsRoute53HostedZoneObjectDetails",
}) as any as S.Schema<AwsRoute53HostedZoneObjectDetails>;
export interface AwsRoute53HostedZoneVpcDetails {
  Id?: string;
  Region?: string;
}
export const AwsRoute53HostedZoneVpcDetails = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Region: S.optional(S.String) }),
).annotations({
  identifier: "AwsRoute53HostedZoneVpcDetails",
}) as any as S.Schema<AwsRoute53HostedZoneVpcDetails>;
export type AwsRoute53HostedZoneVpcsList = AwsRoute53HostedZoneVpcDetails[];
export const AwsRoute53HostedZoneVpcsList = S.Array(
  AwsRoute53HostedZoneVpcDetails,
);
export type AwsRoute53HostedZoneNameServersList = string[];
export const AwsRoute53HostedZoneNameServersList = S.Array(S.String);
export interface CloudWatchLogsLogGroupArnConfigDetails {
  CloudWatchLogsLogGroupArn?: string;
  HostedZoneId?: string;
  Id?: string;
}
export const CloudWatchLogsLogGroupArnConfigDetails = S.suspend(() =>
  S.Struct({
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    HostedZoneId: S.optional(S.String),
    Id: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudWatchLogsLogGroupArnConfigDetails",
}) as any as S.Schema<CloudWatchLogsLogGroupArnConfigDetails>;
export interface AwsRoute53QueryLoggingConfigDetails {
  CloudWatchLogsLogGroupArn?: CloudWatchLogsLogGroupArnConfigDetails;
}
export const AwsRoute53QueryLoggingConfigDetails = S.suspend(() =>
  S.Struct({
    CloudWatchLogsLogGroupArn: S.optional(
      CloudWatchLogsLogGroupArnConfigDetails,
    ),
  }),
).annotations({
  identifier: "AwsRoute53QueryLoggingConfigDetails",
}) as any as S.Schema<AwsRoute53QueryLoggingConfigDetails>;
export interface AwsRoute53HostedZoneDetails {
  HostedZone?: AwsRoute53HostedZoneObjectDetails;
  Vpcs?: AwsRoute53HostedZoneVpcDetails[];
  NameServers?: string[];
  QueryLoggingConfig?: AwsRoute53QueryLoggingConfigDetails;
}
export const AwsRoute53HostedZoneDetails = S.suspend(() =>
  S.Struct({
    HostedZone: S.optional(AwsRoute53HostedZoneObjectDetails),
    Vpcs: S.optional(AwsRoute53HostedZoneVpcsList),
    NameServers: S.optional(AwsRoute53HostedZoneNameServersList),
    QueryLoggingConfig: S.optional(AwsRoute53QueryLoggingConfigDetails),
  }),
).annotations({
  identifier: "AwsRoute53HostedZoneDetails",
}) as any as S.Schema<AwsRoute53HostedZoneDetails>;
export interface AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails {
  InCluster?: boolean;
  ClientBroker?: string;
}
export const AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails =
  S.suspend(() =>
    S.Struct({
      InCluster: S.optional(S.Boolean),
      ClientBroker: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails",
  }) as any as S.Schema<AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails>;
export interface AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails {
  DataVolumeKMSKeyId?: string;
}
export const AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails =
  S.suspend(() =>
    S.Struct({ DataVolumeKMSKeyId: S.optional(S.String) }),
  ).annotations({
    identifier: "AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails",
  }) as any as S.Schema<AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails>;
export interface AwsMskClusterClusterInfoEncryptionInfoDetails {
  EncryptionInTransit?: AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails;
  EncryptionAtRest?: AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails;
}
export const AwsMskClusterClusterInfoEncryptionInfoDetails = S.suspend(() =>
  S.Struct({
    EncryptionInTransit: S.optional(
      AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails,
    ),
    EncryptionAtRest: S.optional(
      AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails,
    ),
  }),
).annotations({
  identifier: "AwsMskClusterClusterInfoEncryptionInfoDetails",
}) as any as S.Schema<AwsMskClusterClusterInfoEncryptionInfoDetails>;
export interface AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails {
  Enabled?: boolean;
}
export const AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails =
  S.suspend(() => S.Struct({ Enabled: S.optional(S.Boolean) })).annotations({
    identifier: "AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails",
  }) as any as S.Schema<AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails>;
export interface AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails {
  Enabled?: boolean;
}
export const AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails =
  S.suspend(() => S.Struct({ Enabled: S.optional(S.Boolean) })).annotations({
    identifier: "AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails",
  }) as any as S.Schema<AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails>;
export interface AwsMskClusterClusterInfoClientAuthenticationSaslDetails {
  Iam?: AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails;
  Scram?: AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails;
}
export const AwsMskClusterClusterInfoClientAuthenticationSaslDetails =
  S.suspend(() =>
    S.Struct({
      Iam: S.optional(
        AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails,
      ),
      Scram: S.optional(
        AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails,
      ),
    }),
  ).annotations({
    identifier: "AwsMskClusterClusterInfoClientAuthenticationSaslDetails",
  }) as any as S.Schema<AwsMskClusterClusterInfoClientAuthenticationSaslDetails>;
export interface AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails {
  Enabled?: boolean;
}
export const AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails =
  S.suspend(() => S.Struct({ Enabled: S.optional(S.Boolean) })).annotations({
    identifier:
      "AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails",
  }) as any as S.Schema<AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails>;
export interface AwsMskClusterClusterInfoClientAuthenticationTlsDetails {
  CertificateAuthorityArnList?: string[];
  Enabled?: boolean;
}
export const AwsMskClusterClusterInfoClientAuthenticationTlsDetails = S.suspend(
  () =>
    S.Struct({
      CertificateAuthorityArnList: S.optional(StringList),
      Enabled: S.optional(S.Boolean),
    }),
).annotations({
  identifier: "AwsMskClusterClusterInfoClientAuthenticationTlsDetails",
}) as any as S.Schema<AwsMskClusterClusterInfoClientAuthenticationTlsDetails>;
export interface AwsMskClusterClusterInfoClientAuthenticationDetails {
  Sasl?: AwsMskClusterClusterInfoClientAuthenticationSaslDetails;
  Unauthenticated?: AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails;
  Tls?: AwsMskClusterClusterInfoClientAuthenticationTlsDetails;
}
export const AwsMskClusterClusterInfoClientAuthenticationDetails = S.suspend(
  () =>
    S.Struct({
      Sasl: S.optional(AwsMskClusterClusterInfoClientAuthenticationSaslDetails),
      Unauthenticated: S.optional(
        AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails,
      ),
      Tls: S.optional(AwsMskClusterClusterInfoClientAuthenticationTlsDetails),
    }),
).annotations({
  identifier: "AwsMskClusterClusterInfoClientAuthenticationDetails",
}) as any as S.Schema<AwsMskClusterClusterInfoClientAuthenticationDetails>;
export interface AwsMskClusterClusterInfoDetails {
  EncryptionInfo?: AwsMskClusterClusterInfoEncryptionInfoDetails;
  CurrentVersion?: string;
  NumberOfBrokerNodes?: number;
  ClusterName?: string;
  ClientAuthentication?: AwsMskClusterClusterInfoClientAuthenticationDetails;
  EnhancedMonitoring?: string;
}
export const AwsMskClusterClusterInfoDetails = S.suspend(() =>
  S.Struct({
    EncryptionInfo: S.optional(AwsMskClusterClusterInfoEncryptionInfoDetails),
    CurrentVersion: S.optional(S.String),
    NumberOfBrokerNodes: S.optional(S.Number),
    ClusterName: S.optional(S.String),
    ClientAuthentication: S.optional(
      AwsMskClusterClusterInfoClientAuthenticationDetails,
    ),
    EnhancedMonitoring: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsMskClusterClusterInfoDetails",
}) as any as S.Schema<AwsMskClusterClusterInfoDetails>;
export interface AwsMskClusterDetails {
  ClusterInfo?: AwsMskClusterClusterInfoDetails;
}
export const AwsMskClusterDetails = S.suspend(() =>
  S.Struct({ ClusterInfo: S.optional(AwsMskClusterClusterInfoDetails) }),
).annotations({
  identifier: "AwsMskClusterDetails",
}) as any as S.Schema<AwsMskClusterDetails>;
export interface AwsS3AccessPointVpcConfigurationDetails {
  VpcId?: string;
}
export const AwsS3AccessPointVpcConfigurationDetails = S.suspend(() =>
  S.Struct({ VpcId: S.optional(S.String) }),
).annotations({
  identifier: "AwsS3AccessPointVpcConfigurationDetails",
}) as any as S.Schema<AwsS3AccessPointVpcConfigurationDetails>;
export interface AwsS3AccessPointDetails {
  AccessPointArn?: string;
  Alias?: string;
  Bucket?: string;
  BucketAccountId?: string;
  Name?: string;
  NetworkOrigin?: string;
  PublicAccessBlockConfiguration?: AwsS3AccountPublicAccessBlockDetails;
  VpcConfiguration?: AwsS3AccessPointVpcConfigurationDetails;
}
export const AwsS3AccessPointDetails = S.suspend(() =>
  S.Struct({
    AccessPointArn: S.optional(S.String),
    Alias: S.optional(S.String),
    Bucket: S.optional(S.String),
    BucketAccountId: S.optional(S.String),
    Name: S.optional(S.String),
    NetworkOrigin: S.optional(S.String),
    PublicAccessBlockConfiguration: S.optional(
      AwsS3AccountPublicAccessBlockDetails,
    ),
    VpcConfiguration: S.optional(AwsS3AccessPointVpcConfigurationDetails),
  }),
).annotations({
  identifier: "AwsS3AccessPointDetails",
}) as any as S.Schema<AwsS3AccessPointDetails>;
export interface AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails {
  DirectoryId?: string;
}
export const AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails =
  S.suspend(() => S.Struct({ DirectoryId: S.optional(S.String) })).annotations({
    identifier:
      "AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails",
  }) as any as S.Schema<AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails>;
export interface AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails {
  ClientRootCertificateChain?: string;
}
export const AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails =
  S.suspend(() =>
    S.Struct({ ClientRootCertificateChain: S.optional(S.String) }),
  ).annotations({
    identifier:
      "AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails",
  }) as any as S.Schema<AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails>;
export interface AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails {
  SamlProviderArn?: string;
  SelfServiceSamlProviderArn?: string;
}
export const AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails =
  S.suspend(() =>
    S.Struct({
      SamlProviderArn: S.optional(S.String),
      SelfServiceSamlProviderArn: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails",
  }) as any as S.Schema<AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails>;
export interface AwsEc2ClientVpnEndpointAuthenticationOptionsDetails {
  Type?: string;
  ActiveDirectory?: AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails;
  MutualAuthentication?: AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails;
  FederatedAuthentication?: AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails;
}
export const AwsEc2ClientVpnEndpointAuthenticationOptionsDetails = S.suspend(
  () =>
    S.Struct({
      Type: S.optional(S.String),
      ActiveDirectory: S.optional(
        AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails,
      ),
      MutualAuthentication: S.optional(
        AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails,
      ),
      FederatedAuthentication: S.optional(
        AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails,
      ),
    }),
).annotations({
  identifier: "AwsEc2ClientVpnEndpointAuthenticationOptionsDetails",
}) as any as S.Schema<AwsEc2ClientVpnEndpointAuthenticationOptionsDetails>;
export type AwsEc2ClientVpnEndpointAuthenticationOptionsList =
  AwsEc2ClientVpnEndpointAuthenticationOptionsDetails[];
export const AwsEc2ClientVpnEndpointAuthenticationOptionsList = S.Array(
  AwsEc2ClientVpnEndpointAuthenticationOptionsDetails,
);
export interface AwsEc2ClientVpnEndpointConnectionLogOptionsDetails {
  Enabled?: boolean;
  CloudwatchLogGroup?: string;
  CloudwatchLogStream?: string;
}
export const AwsEc2ClientVpnEndpointConnectionLogOptionsDetails = S.suspend(
  () =>
    S.Struct({
      Enabled: S.optional(S.Boolean),
      CloudwatchLogGroup: S.optional(S.String),
      CloudwatchLogStream: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsEc2ClientVpnEndpointConnectionLogOptionsDetails",
}) as any as S.Schema<AwsEc2ClientVpnEndpointConnectionLogOptionsDetails>;
export interface AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails {
  Code?: string;
  Message?: string;
}
export const AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails =
  S.suspend(() =>
    S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
  ).annotations({
    identifier: "AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails",
  }) as any as S.Schema<AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails>;
export interface AwsEc2ClientVpnEndpointClientConnectOptionsDetails {
  Enabled?: boolean;
  LambdaFunctionArn?: string;
  Status?: AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails;
}
export const AwsEc2ClientVpnEndpointClientConnectOptionsDetails = S.suspend(
  () =>
    S.Struct({
      Enabled: S.optional(S.Boolean),
      LambdaFunctionArn: S.optional(S.String),
      Status: S.optional(
        AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails,
      ),
    }),
).annotations({
  identifier: "AwsEc2ClientVpnEndpointClientConnectOptionsDetails",
}) as any as S.Schema<AwsEc2ClientVpnEndpointClientConnectOptionsDetails>;
export interface AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails {
  Enabled?: boolean;
  BannerText?: string;
}
export const AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails = S.suspend(
  () =>
    S.Struct({
      Enabled: S.optional(S.Boolean),
      BannerText: S.optional(S.String),
    }),
).annotations({
  identifier: "AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails",
}) as any as S.Schema<AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails>;
export interface AwsEc2ClientVpnEndpointDetails {
  ClientVpnEndpointId?: string;
  Description?: string;
  ClientCidrBlock?: string;
  DnsServer?: string[];
  SplitTunnel?: boolean;
  TransportProtocol?: string;
  VpnPort?: number;
  ServerCertificateArn?: string;
  AuthenticationOptions?: AwsEc2ClientVpnEndpointAuthenticationOptionsDetails[];
  ConnectionLogOptions?: AwsEc2ClientVpnEndpointConnectionLogOptionsDetails;
  SecurityGroupIdSet?: string[];
  VpcId?: string;
  SelfServicePortalUrl?: string;
  ClientConnectOptions?: AwsEc2ClientVpnEndpointClientConnectOptionsDetails;
  SessionTimeoutHours?: number;
  ClientLoginBannerOptions?: AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails;
}
export const AwsEc2ClientVpnEndpointDetails = S.suspend(() =>
  S.Struct({
    ClientVpnEndpointId: S.optional(S.String),
    Description: S.optional(S.String),
    ClientCidrBlock: S.optional(S.String),
    DnsServer: S.optional(StringList),
    SplitTunnel: S.optional(S.Boolean),
    TransportProtocol: S.optional(S.String),
    VpnPort: S.optional(S.Number),
    ServerCertificateArn: S.optional(S.String),
    AuthenticationOptions: S.optional(
      AwsEc2ClientVpnEndpointAuthenticationOptionsList,
    ),
    ConnectionLogOptions: S.optional(
      AwsEc2ClientVpnEndpointConnectionLogOptionsDetails,
    ),
    SecurityGroupIdSet: S.optional(StringList),
    VpcId: S.optional(S.String),
    SelfServicePortalUrl: S.optional(S.String),
    ClientConnectOptions: S.optional(
      AwsEc2ClientVpnEndpointClientConnectOptionsDetails,
    ),
    SessionTimeoutHours: S.optional(S.Number),
    ClientLoginBannerOptions: S.optional(
      AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails,
    ),
  }),
).annotations({
  identifier: "AwsEc2ClientVpnEndpointDetails",
}) as any as S.Schema<AwsEc2ClientVpnEndpointDetails>;
export interface CodeRepositoryDetails {
  ProviderType?: string;
  ProjectName?: string;
  CodeSecurityIntegrationArn?: string;
}
export const CodeRepositoryDetails = S.suspend(() =>
  S.Struct({
    ProviderType: S.optional(S.String),
    ProjectName: S.optional(S.String),
    CodeSecurityIntegrationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CodeRepositoryDetails",
}) as any as S.Schema<CodeRepositoryDetails>;
export interface ResourceDetails {
  AwsAutoScalingAutoScalingGroup?: AwsAutoScalingAutoScalingGroupDetails;
  AwsCodeBuildProject?: AwsCodeBuildProjectDetails;
  AwsCloudFrontDistribution?: AwsCloudFrontDistributionDetails;
  AwsEc2Instance?: AwsEc2InstanceDetails;
  AwsEc2NetworkInterface?: AwsEc2NetworkInterfaceDetails;
  AwsEc2SecurityGroup?: AwsEc2SecurityGroupDetails;
  AwsEc2Volume?: AwsEc2VolumeDetails;
  AwsEc2Vpc?: AwsEc2VpcDetails;
  AwsEc2Eip?: AwsEc2EipDetails;
  AwsEc2Subnet?: AwsEc2SubnetDetails;
  AwsEc2NetworkAcl?: AwsEc2NetworkAclDetails;
  AwsElbv2LoadBalancer?: AwsElbv2LoadBalancerDetails;
  AwsElasticBeanstalkEnvironment?: AwsElasticBeanstalkEnvironmentDetails;
  AwsElasticsearchDomain?: AwsElasticsearchDomainDetails;
  AwsS3Bucket?: AwsS3BucketDetails;
  AwsS3AccountPublicAccessBlock?: AwsS3AccountPublicAccessBlockDetails;
  AwsS3Object?: AwsS3ObjectDetails;
  AwsSecretsManagerSecret?: AwsSecretsManagerSecretDetails;
  AwsIamAccessKey?: AwsIamAccessKeyDetails;
  AwsIamUser?: AwsIamUserDetails;
  AwsIamPolicy?: AwsIamPolicyDetails;
  AwsApiGatewayV2Stage?: AwsApiGatewayV2StageDetails;
  AwsApiGatewayV2Api?: AwsApiGatewayV2ApiDetails;
  AwsDynamoDbTable?: AwsDynamoDbTableDetails;
  AwsApiGatewayStage?: AwsApiGatewayStageDetails;
  AwsApiGatewayRestApi?: AwsApiGatewayRestApiDetails;
  AwsCloudTrailTrail?: AwsCloudTrailTrailDetails;
  AwsSsmPatchCompliance?: AwsSsmPatchComplianceDetails;
  AwsCertificateManagerCertificate?: AwsCertificateManagerCertificateDetails;
  AwsRedshiftCluster?: AwsRedshiftClusterDetails;
  AwsElbLoadBalancer?: AwsElbLoadBalancerDetails;
  AwsIamGroup?: AwsIamGroupDetails;
  AwsIamRole?: AwsIamRoleDetails;
  AwsKmsKey?: AwsKmsKeyDetails;
  AwsLambdaFunction?: AwsLambdaFunctionDetails;
  AwsLambdaLayerVersion?: AwsLambdaLayerVersionDetails;
  AwsRdsDbInstance?: AwsRdsDbInstanceDetails;
  AwsSnsTopic?: AwsSnsTopicDetails;
  AwsSqsQueue?: AwsSqsQueueDetails;
  AwsWafWebAcl?: AwsWafWebAclDetails;
  AwsRdsDbSnapshot?: AwsRdsDbSnapshotDetails;
  AwsRdsDbClusterSnapshot?: AwsRdsDbClusterSnapshotDetails;
  AwsRdsDbCluster?: AwsRdsDbClusterDetails;
  AwsEcsCluster?: AwsEcsClusterDetails;
  AwsEcsContainer?: AwsEcsContainerDetails;
  AwsEcsTaskDefinition?: AwsEcsTaskDefinitionDetails;
  Container?: ContainerDetails;
  Other?: { [key: string]: string | undefined };
  AwsRdsEventSubscription?: AwsRdsEventSubscriptionDetails;
  AwsEcsService?: AwsEcsServiceDetails;
  AwsAutoScalingLaunchConfiguration?: AwsAutoScalingLaunchConfigurationDetails;
  AwsEc2VpnConnection?: AwsEc2VpnConnectionDetails;
  AwsEcrContainerImage?: AwsEcrContainerImageDetails;
  AwsOpenSearchServiceDomain?: AwsOpenSearchServiceDomainDetails;
  AwsEc2VpcEndpointService?: AwsEc2VpcEndpointServiceDetails;
  AwsXrayEncryptionConfig?: AwsXrayEncryptionConfigDetails;
  AwsWafRateBasedRule?: AwsWafRateBasedRuleDetails;
  AwsWafRegionalRateBasedRule?: AwsWafRegionalRateBasedRuleDetails;
  AwsEcrRepository?: AwsEcrRepositoryDetails;
  AwsEksCluster?: AwsEksClusterDetails;
  AwsNetworkFirewallFirewallPolicy?: AwsNetworkFirewallFirewallPolicyDetails;
  AwsNetworkFirewallFirewall?: AwsNetworkFirewallFirewallDetails;
  AwsNetworkFirewallRuleGroup?: AwsNetworkFirewallRuleGroupDetails;
  AwsRdsDbSecurityGroup?: AwsRdsDbSecurityGroupDetails;
  AwsKinesisStream?: AwsKinesisStreamDetails;
  AwsEc2TransitGateway?: AwsEc2TransitGatewayDetails;
  AwsEfsAccessPoint?: AwsEfsAccessPointDetails;
  AwsCloudFormationStack?: AwsCloudFormationStackDetails;
  AwsCloudWatchAlarm?: AwsCloudWatchAlarmDetails;
  AwsEc2VpcPeeringConnection?: AwsEc2VpcPeeringConnectionDetails;
  AwsWafRegionalRuleGroup?: AwsWafRegionalRuleGroupDetails;
  AwsWafRegionalRule?: AwsWafRegionalRuleDetails;
  AwsWafRegionalWebAcl?: AwsWafRegionalWebAclDetails;
  AwsWafRule?: AwsWafRuleDetails;
  AwsWafRuleGroup?: AwsWafRuleGroupDetails;
  AwsEcsTask?: AwsEcsTaskDetails;
  AwsBackupBackupVault?: AwsBackupBackupVaultDetails;
  AwsBackupBackupPlan?: AwsBackupBackupPlanDetails;
  AwsBackupRecoveryPoint?: AwsBackupRecoveryPointDetails;
  AwsEc2LaunchTemplate?: AwsEc2LaunchTemplateDetails;
  AwsSageMakerNotebookInstance?: AwsSageMakerNotebookInstanceDetails;
  AwsWafv2WebAcl?: AwsWafv2WebAclDetails;
  AwsWafv2RuleGroup?: AwsWafv2RuleGroupDetails;
  AwsEc2RouteTable?: AwsEc2RouteTableDetails;
  AwsAmazonMqBroker?: AwsAmazonMqBrokerDetails;
  AwsAppSyncGraphQlApi?: AwsAppSyncGraphQlApiDetails;
  AwsEventSchemasRegistry?: AwsEventSchemasRegistryDetails;
  AwsGuardDutyDetector?: AwsGuardDutyDetectorDetails;
  AwsStepFunctionStateMachine?: AwsStepFunctionStateMachineDetails;
  AwsAthenaWorkGroup?: AwsAthenaWorkGroupDetails;
  AwsEventsEventbus?: AwsEventsEventbusDetails;
  AwsDmsEndpoint?: AwsDmsEndpointDetails;
  AwsEventsEndpoint?: AwsEventsEndpointDetails;
  AwsDmsReplicationTask?: AwsDmsReplicationTaskDetails;
  AwsDmsReplicationInstance?: AwsDmsReplicationInstanceDetails;
  AwsRoute53HostedZone?: AwsRoute53HostedZoneDetails;
  AwsMskCluster?: AwsMskClusterDetails;
  AwsS3AccessPoint?: AwsS3AccessPointDetails;
  AwsEc2ClientVpnEndpoint?: AwsEc2ClientVpnEndpointDetails;
  CodeRepository?: CodeRepositoryDetails;
}
export const ResourceDetails = S.suspend(() =>
  S.Struct({
    AwsAutoScalingAutoScalingGroup: S.optional(
      AwsAutoScalingAutoScalingGroupDetails,
    ),
    AwsCodeBuildProject: S.optional(AwsCodeBuildProjectDetails),
    AwsCloudFrontDistribution: S.optional(AwsCloudFrontDistributionDetails),
    AwsEc2Instance: S.optional(AwsEc2InstanceDetails),
    AwsEc2NetworkInterface: S.optional(AwsEc2NetworkInterfaceDetails),
    AwsEc2SecurityGroup: S.optional(AwsEc2SecurityGroupDetails),
    AwsEc2Volume: S.optional(AwsEc2VolumeDetails),
    AwsEc2Vpc: S.optional(AwsEc2VpcDetails),
    AwsEc2Eip: S.optional(AwsEc2EipDetails),
    AwsEc2Subnet: S.optional(AwsEc2SubnetDetails),
    AwsEc2NetworkAcl: S.optional(AwsEc2NetworkAclDetails),
    AwsElbv2LoadBalancer: S.optional(AwsElbv2LoadBalancerDetails),
    AwsElasticBeanstalkEnvironment: S.optional(
      AwsElasticBeanstalkEnvironmentDetails,
    ),
    AwsElasticsearchDomain: S.optional(AwsElasticsearchDomainDetails),
    AwsS3Bucket: S.optional(AwsS3BucketDetails),
    AwsS3AccountPublicAccessBlock: S.optional(
      AwsS3AccountPublicAccessBlockDetails,
    ),
    AwsS3Object: S.optional(AwsS3ObjectDetails),
    AwsSecretsManagerSecret: S.optional(AwsSecretsManagerSecretDetails),
    AwsIamAccessKey: S.optional(AwsIamAccessKeyDetails),
    AwsIamUser: S.optional(AwsIamUserDetails),
    AwsIamPolicy: S.optional(AwsIamPolicyDetails),
    AwsApiGatewayV2Stage: S.optional(AwsApiGatewayV2StageDetails),
    AwsApiGatewayV2Api: S.optional(AwsApiGatewayV2ApiDetails),
    AwsDynamoDbTable: S.optional(AwsDynamoDbTableDetails),
    AwsApiGatewayStage: S.optional(AwsApiGatewayStageDetails),
    AwsApiGatewayRestApi: S.optional(AwsApiGatewayRestApiDetails),
    AwsCloudTrailTrail: S.optional(AwsCloudTrailTrailDetails),
    AwsSsmPatchCompliance: S.optional(AwsSsmPatchComplianceDetails),
    AwsCertificateManagerCertificate: S.optional(
      AwsCertificateManagerCertificateDetails,
    ),
    AwsRedshiftCluster: S.optional(AwsRedshiftClusterDetails),
    AwsElbLoadBalancer: S.optional(AwsElbLoadBalancerDetails),
    AwsIamGroup: S.optional(AwsIamGroupDetails),
    AwsIamRole: S.optional(AwsIamRoleDetails),
    AwsKmsKey: S.optional(AwsKmsKeyDetails),
    AwsLambdaFunction: S.optional(AwsLambdaFunctionDetails),
    AwsLambdaLayerVersion: S.optional(AwsLambdaLayerVersionDetails),
    AwsRdsDbInstance: S.optional(AwsRdsDbInstanceDetails),
    AwsSnsTopic: S.optional(AwsSnsTopicDetails),
    AwsSqsQueue: S.optional(AwsSqsQueueDetails),
    AwsWafWebAcl: S.optional(AwsWafWebAclDetails),
    AwsRdsDbSnapshot: S.optional(AwsRdsDbSnapshotDetails),
    AwsRdsDbClusterSnapshot: S.optional(AwsRdsDbClusterSnapshotDetails),
    AwsRdsDbCluster: S.optional(AwsRdsDbClusterDetails),
    AwsEcsCluster: S.optional(AwsEcsClusterDetails),
    AwsEcsContainer: S.optional(AwsEcsContainerDetails),
    AwsEcsTaskDefinition: S.optional(AwsEcsTaskDefinitionDetails),
    Container: S.optional(ContainerDetails),
    Other: S.optional(FieldMap),
    AwsRdsEventSubscription: S.optional(AwsRdsEventSubscriptionDetails),
    AwsEcsService: S.optional(AwsEcsServiceDetails),
    AwsAutoScalingLaunchConfiguration: S.optional(
      AwsAutoScalingLaunchConfigurationDetails,
    ),
    AwsEc2VpnConnection: S.optional(AwsEc2VpnConnectionDetails),
    AwsEcrContainerImage: S.optional(AwsEcrContainerImageDetails),
    AwsOpenSearchServiceDomain: S.optional(AwsOpenSearchServiceDomainDetails),
    AwsEc2VpcEndpointService: S.optional(AwsEc2VpcEndpointServiceDetails),
    AwsXrayEncryptionConfig: S.optional(AwsXrayEncryptionConfigDetails),
    AwsWafRateBasedRule: S.optional(AwsWafRateBasedRuleDetails),
    AwsWafRegionalRateBasedRule: S.optional(AwsWafRegionalRateBasedRuleDetails),
    AwsEcrRepository: S.optional(AwsEcrRepositoryDetails),
    AwsEksCluster: S.optional(AwsEksClusterDetails),
    AwsNetworkFirewallFirewallPolicy: S.optional(
      AwsNetworkFirewallFirewallPolicyDetails,
    ),
    AwsNetworkFirewallFirewall: S.optional(AwsNetworkFirewallFirewallDetails),
    AwsNetworkFirewallRuleGroup: S.optional(AwsNetworkFirewallRuleGroupDetails),
    AwsRdsDbSecurityGroup: S.optional(AwsRdsDbSecurityGroupDetails),
    AwsKinesisStream: S.optional(AwsKinesisStreamDetails),
    AwsEc2TransitGateway: S.optional(AwsEc2TransitGatewayDetails),
    AwsEfsAccessPoint: S.optional(AwsEfsAccessPointDetails),
    AwsCloudFormationStack: S.optional(AwsCloudFormationStackDetails),
    AwsCloudWatchAlarm: S.optional(AwsCloudWatchAlarmDetails),
    AwsEc2VpcPeeringConnection: S.optional(AwsEc2VpcPeeringConnectionDetails),
    AwsWafRegionalRuleGroup: S.optional(AwsWafRegionalRuleGroupDetails),
    AwsWafRegionalRule: S.optional(AwsWafRegionalRuleDetails),
    AwsWafRegionalWebAcl: S.optional(AwsWafRegionalWebAclDetails),
    AwsWafRule: S.optional(AwsWafRuleDetails),
    AwsWafRuleGroup: S.optional(AwsWafRuleGroupDetails),
    AwsEcsTask: S.optional(AwsEcsTaskDetails),
    AwsBackupBackupVault: S.optional(AwsBackupBackupVaultDetails),
    AwsBackupBackupPlan: S.optional(AwsBackupBackupPlanDetails),
    AwsBackupRecoveryPoint: S.optional(AwsBackupRecoveryPointDetails),
    AwsEc2LaunchTemplate: S.optional(AwsEc2LaunchTemplateDetails),
    AwsSageMakerNotebookInstance: S.optional(
      AwsSageMakerNotebookInstanceDetails,
    ),
    AwsWafv2WebAcl: S.optional(AwsWafv2WebAclDetails),
    AwsWafv2RuleGroup: S.optional(AwsWafv2RuleGroupDetails),
    AwsEc2RouteTable: S.optional(AwsEc2RouteTableDetails),
    AwsAmazonMqBroker: S.optional(AwsAmazonMqBrokerDetails),
    AwsAppSyncGraphQlApi: S.optional(AwsAppSyncGraphQlApiDetails),
    AwsEventSchemasRegistry: S.optional(AwsEventSchemasRegistryDetails),
    AwsGuardDutyDetector: S.optional(AwsGuardDutyDetectorDetails),
    AwsStepFunctionStateMachine: S.optional(AwsStepFunctionStateMachineDetails),
    AwsAthenaWorkGroup: S.optional(AwsAthenaWorkGroupDetails),
    AwsEventsEventbus: S.optional(AwsEventsEventbusDetails),
    AwsDmsEndpoint: S.optional(AwsDmsEndpointDetails),
    AwsEventsEndpoint: S.optional(AwsEventsEndpointDetails),
    AwsDmsReplicationTask: S.optional(AwsDmsReplicationTaskDetails),
    AwsDmsReplicationInstance: S.optional(AwsDmsReplicationInstanceDetails),
    AwsRoute53HostedZone: S.optional(AwsRoute53HostedZoneDetails),
    AwsMskCluster: S.optional(AwsMskClusterDetails),
    AwsS3AccessPoint: S.optional(AwsS3AccessPointDetails),
    AwsEc2ClientVpnEndpoint: S.optional(AwsEc2ClientVpnEndpointDetails),
    CodeRepository: S.optional(CodeRepositoryDetails),
  }),
).annotations({
  identifier: "ResourceDetails",
}) as any as S.Schema<ResourceDetails>;
export interface Resource {
  Type?: string;
  Id?: string;
  Partition?: Partition;
  Region?: string;
  ResourceRole?: string;
  Tags?: { [key: string]: string | undefined };
  DataClassification?: DataClassificationDetails;
  Details?: ResourceDetails;
  ApplicationName?: string;
  ApplicationArn?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Id: S.optional(S.String),
    Partition: S.optional(Partition),
    Region: S.optional(S.String),
    ResourceRole: S.optional(S.String),
    Tags: S.optional(FieldMap),
    DataClassification: S.optional(DataClassificationDetails),
    Details: S.optional(ResourceDetails),
    ApplicationName: S.optional(S.String),
    ApplicationArn: S.optional(S.String),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type ResourceList = Resource[];
export const ResourceList = S.Array(Resource);
export interface StatusReason {
  ReasonCode?: string;
  Description?: string;
}
export const StatusReason = S.suspend(() =>
  S.Struct({
    ReasonCode: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "StatusReason" }) as any as S.Schema<StatusReason>;
export type StatusReasonsList = StatusReason[];
export const StatusReasonsList = S.Array(StatusReason);
export interface AssociatedStandard {
  StandardsId?: string;
}
export const AssociatedStandard = S.suspend(() =>
  S.Struct({ StandardsId: S.optional(S.String) }),
).annotations({
  identifier: "AssociatedStandard",
}) as any as S.Schema<AssociatedStandard>;
export type AssociatedStandardsList = AssociatedStandard[];
export const AssociatedStandardsList = S.Array(AssociatedStandard);
export interface SecurityControlParameter {
  Name?: string;
  Value?: string[];
}
export const SecurityControlParameter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(TypeList) }),
).annotations({
  identifier: "SecurityControlParameter",
}) as any as S.Schema<SecurityControlParameter>;
export type SecurityControlParametersList = SecurityControlParameter[];
export const SecurityControlParametersList = S.Array(SecurityControlParameter);
export interface Compliance {
  Status?: ComplianceStatus;
  RelatedRequirements?: string[];
  StatusReasons?: StatusReason[];
  SecurityControlId?: string;
  AssociatedStandards?: AssociatedStandard[];
  SecurityControlParameters?: SecurityControlParameter[];
}
export const Compliance = S.suspend(() =>
  S.Struct({
    Status: S.optional(ComplianceStatus),
    RelatedRequirements: S.optional(RelatedRequirementsList),
    StatusReasons: S.optional(StatusReasonsList),
    SecurityControlId: S.optional(S.String),
    AssociatedStandards: S.optional(AssociatedStandardsList),
    SecurityControlParameters: S.optional(SecurityControlParametersList),
  }),
).annotations({ identifier: "Compliance" }) as any as S.Schema<Compliance>;
export interface SoftwarePackage {
  Name?: string;
  Version?: string;
  Epoch?: string;
  Release?: string;
  Architecture?: string;
  PackageManager?: string;
  FilePath?: string;
  FixedInVersion?: string;
  Remediation?: string;
  SourceLayerHash?: string;
  SourceLayerArn?: string;
}
export const SoftwarePackage = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Version: S.optional(S.String),
    Epoch: S.optional(S.String),
    Release: S.optional(S.String),
    Architecture: S.optional(S.String),
    PackageManager: S.optional(S.String),
    FilePath: S.optional(S.String),
    FixedInVersion: S.optional(S.String),
    Remediation: S.optional(S.String),
    SourceLayerHash: S.optional(S.String),
    SourceLayerArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SoftwarePackage",
}) as any as S.Schema<SoftwarePackage>;
export type SoftwarePackageList = SoftwarePackage[];
export const SoftwarePackageList = S.Array(SoftwarePackage);
export interface Adjustment {
  Metric?: string;
  Reason?: string;
}
export const Adjustment = S.suspend(() =>
  S.Struct({ Metric: S.optional(S.String), Reason: S.optional(S.String) }),
).annotations({ identifier: "Adjustment" }) as any as S.Schema<Adjustment>;
export type AdjustmentList = Adjustment[];
export const AdjustmentList = S.Array(Adjustment);
export interface Cvss {
  Version?: string;
  BaseScore?: number;
  BaseVector?: string;
  Source?: string;
  Adjustments?: Adjustment[];
}
export const Cvss = S.suspend(() =>
  S.Struct({
    Version: S.optional(S.String),
    BaseScore: S.optional(S.Number),
    BaseVector: S.optional(S.String),
    Source: S.optional(S.String),
    Adjustments: S.optional(AdjustmentList),
  }),
).annotations({ identifier: "Cvss" }) as any as S.Schema<Cvss>;
export type CvssList = Cvss[];
export const CvssList = S.Array(Cvss);
export interface VulnerabilityVendor {
  Name?: string;
  Url?: string;
  VendorSeverity?: string;
  VendorCreatedAt?: string;
  VendorUpdatedAt?: string;
}
export const VulnerabilityVendor = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Url: S.optional(S.String),
    VendorSeverity: S.optional(S.String),
    VendorCreatedAt: S.optional(S.String),
    VendorUpdatedAt: S.optional(S.String),
  }),
).annotations({
  identifier: "VulnerabilityVendor",
}) as any as S.Schema<VulnerabilityVendor>;
export interface CodeVulnerabilitiesFilePath {
  EndLine?: number;
  FileName?: string;
  FilePath?: string;
  StartLine?: number;
}
export const CodeVulnerabilitiesFilePath = S.suspend(() =>
  S.Struct({
    EndLine: S.optional(S.Number),
    FileName: S.optional(S.String),
    FilePath: S.optional(S.String),
    StartLine: S.optional(S.Number),
  }),
).annotations({
  identifier: "CodeVulnerabilitiesFilePath",
}) as any as S.Schema<CodeVulnerabilitiesFilePath>;
export interface VulnerabilityCodeVulnerabilities {
  Cwes?: string[];
  FilePath?: CodeVulnerabilitiesFilePath;
  SourceArn?: string;
}
export const VulnerabilityCodeVulnerabilities = S.suspend(() =>
  S.Struct({
    Cwes: S.optional(TypeList),
    FilePath: S.optional(CodeVulnerabilitiesFilePath),
    SourceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "VulnerabilityCodeVulnerabilities",
}) as any as S.Schema<VulnerabilityCodeVulnerabilities>;
export type VulnerabilityCodeVulnerabilitiesList =
  VulnerabilityCodeVulnerabilities[];
export const VulnerabilityCodeVulnerabilitiesList = S.Array(
  VulnerabilityCodeVulnerabilities,
);
export interface Vulnerability {
  Id?: string;
  VulnerablePackages?: SoftwarePackage[];
  Cvss?: Cvss[];
  RelatedVulnerabilities?: string[];
  Vendor?: VulnerabilityVendor;
  ReferenceUrls?: string[];
  FixAvailable?: VulnerabilityFixAvailable;
  EpssScore?: number;
  ExploitAvailable?: VulnerabilityExploitAvailable;
  LastKnownExploitAt?: string;
  CodeVulnerabilities?: VulnerabilityCodeVulnerabilities[];
}
export const Vulnerability = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    VulnerablePackages: S.optional(SoftwarePackageList),
    Cvss: S.optional(CvssList),
    RelatedVulnerabilities: S.optional(StringList),
    Vendor: S.optional(VulnerabilityVendor),
    ReferenceUrls: S.optional(StringList),
    FixAvailable: S.optional(VulnerabilityFixAvailable),
    EpssScore: S.optional(S.Number),
    ExploitAvailable: S.optional(VulnerabilityExploitAvailable),
    LastKnownExploitAt: S.optional(S.String),
    CodeVulnerabilities: S.optional(VulnerabilityCodeVulnerabilitiesList),
  }),
).annotations({
  identifier: "Vulnerability",
}) as any as S.Schema<Vulnerability>;
export type VulnerabilityList = Vulnerability[];
export const VulnerabilityList = S.Array(Vulnerability);
export interface IpOrganizationDetails {
  Asn?: number;
  AsnOrg?: string;
  Isp?: string;
  Org?: string;
}
export const IpOrganizationDetails = S.suspend(() =>
  S.Struct({
    Asn: S.optional(S.Number),
    AsnOrg: S.optional(S.String),
    Isp: S.optional(S.String),
    Org: S.optional(S.String),
  }),
).annotations({
  identifier: "IpOrganizationDetails",
}) as any as S.Schema<IpOrganizationDetails>;
export interface Country {
  CountryCode?: string;
  CountryName?: string;
}
export const Country = S.suspend(() =>
  S.Struct({
    CountryCode: S.optional(S.String),
    CountryName: S.optional(S.String),
  }),
).annotations({ identifier: "Country" }) as any as S.Schema<Country>;
export interface City {
  CityName?: string;
}
export const City = S.suspend(() =>
  S.Struct({ CityName: S.optional(S.String) }),
).annotations({ identifier: "City" }) as any as S.Schema<City>;
export interface GeoLocation {
  Lon?: number;
  Lat?: number;
}
export const GeoLocation = S.suspend(() =>
  S.Struct({ Lon: S.optional(S.Number), Lat: S.optional(S.Number) }),
).annotations({ identifier: "GeoLocation" }) as any as S.Schema<GeoLocation>;
export interface ActionRemoteIpDetails {
  IpAddressV4?: string;
  Organization?: IpOrganizationDetails;
  Country?: Country;
  City?: City;
  GeoLocation?: GeoLocation;
}
export const ActionRemoteIpDetails = S.suspend(() =>
  S.Struct({
    IpAddressV4: S.optional(S.String),
    Organization: S.optional(IpOrganizationDetails),
    Country: S.optional(Country),
    City: S.optional(City),
    GeoLocation: S.optional(GeoLocation),
  }),
).annotations({
  identifier: "ActionRemoteIpDetails",
}) as any as S.Schema<ActionRemoteIpDetails>;
export interface ActionRemotePortDetails {
  Port?: number;
  PortName?: string;
}
export const ActionRemotePortDetails = S.suspend(() =>
  S.Struct({ Port: S.optional(S.Number), PortName: S.optional(S.String) }),
).annotations({
  identifier: "ActionRemotePortDetails",
}) as any as S.Schema<ActionRemotePortDetails>;
export interface ActionLocalPortDetails {
  Port?: number;
  PortName?: string;
}
export const ActionLocalPortDetails = S.suspend(() =>
  S.Struct({ Port: S.optional(S.Number), PortName: S.optional(S.String) }),
).annotations({
  identifier: "ActionLocalPortDetails",
}) as any as S.Schema<ActionLocalPortDetails>;
export interface NetworkConnectionAction {
  ConnectionDirection?: string;
  RemoteIpDetails?: ActionRemoteIpDetails;
  RemotePortDetails?: ActionRemotePortDetails;
  LocalPortDetails?: ActionLocalPortDetails;
  Protocol?: string;
  Blocked?: boolean;
}
export const NetworkConnectionAction = S.suspend(() =>
  S.Struct({
    ConnectionDirection: S.optional(S.String),
    RemoteIpDetails: S.optional(ActionRemoteIpDetails),
    RemotePortDetails: S.optional(ActionRemotePortDetails),
    LocalPortDetails: S.optional(ActionLocalPortDetails),
    Protocol: S.optional(S.String),
    Blocked: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "NetworkConnectionAction",
}) as any as S.Schema<NetworkConnectionAction>;
export interface AwsApiCallActionDomainDetails {
  Domain?: string;
}
export const AwsApiCallActionDomainDetails = S.suspend(() =>
  S.Struct({ Domain: S.optional(S.String) }),
).annotations({
  identifier: "AwsApiCallActionDomainDetails",
}) as any as S.Schema<AwsApiCallActionDomainDetails>;
export interface AwsApiCallAction {
  Api?: string;
  ServiceName?: string;
  CallerType?: string;
  RemoteIpDetails?: ActionRemoteIpDetails;
  DomainDetails?: AwsApiCallActionDomainDetails;
  AffectedResources?: { [key: string]: string | undefined };
  FirstSeen?: string;
  LastSeen?: string;
}
export const AwsApiCallAction = S.suspend(() =>
  S.Struct({
    Api: S.optional(S.String),
    ServiceName: S.optional(S.String),
    CallerType: S.optional(S.String),
    RemoteIpDetails: S.optional(ActionRemoteIpDetails),
    DomainDetails: S.optional(AwsApiCallActionDomainDetails),
    AffectedResources: S.optional(FieldMap),
    FirstSeen: S.optional(S.String),
    LastSeen: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsApiCallAction",
}) as any as S.Schema<AwsApiCallAction>;
export interface DnsRequestAction {
  Domain?: string;
  Protocol?: string;
  Blocked?: boolean;
}
export const DnsRequestAction = S.suspend(() =>
  S.Struct({
    Domain: S.optional(S.String),
    Protocol: S.optional(S.String),
    Blocked: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DnsRequestAction",
}) as any as S.Schema<DnsRequestAction>;
export interface ActionLocalIpDetails {
  IpAddressV4?: string;
}
export const ActionLocalIpDetails = S.suspend(() =>
  S.Struct({ IpAddressV4: S.optional(S.String) }),
).annotations({
  identifier: "ActionLocalIpDetails",
}) as any as S.Schema<ActionLocalIpDetails>;
export interface PortProbeDetail {
  LocalPortDetails?: ActionLocalPortDetails;
  LocalIpDetails?: ActionLocalIpDetails;
  RemoteIpDetails?: ActionRemoteIpDetails;
}
export const PortProbeDetail = S.suspend(() =>
  S.Struct({
    LocalPortDetails: S.optional(ActionLocalPortDetails),
    LocalIpDetails: S.optional(ActionLocalIpDetails),
    RemoteIpDetails: S.optional(ActionRemoteIpDetails),
  }),
).annotations({
  identifier: "PortProbeDetail",
}) as any as S.Schema<PortProbeDetail>;
export type PortProbeDetailList = PortProbeDetail[];
export const PortProbeDetailList = S.Array(PortProbeDetail);
export interface PortProbeAction {
  PortProbeDetails?: PortProbeDetail[];
  Blocked?: boolean;
}
export const PortProbeAction = S.suspend(() =>
  S.Struct({
    PortProbeDetails: S.optional(PortProbeDetailList),
    Blocked: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PortProbeAction",
}) as any as S.Schema<PortProbeAction>;
export interface Action {
  ActionType?: string;
  NetworkConnectionAction?: NetworkConnectionAction;
  AwsApiCallAction?: AwsApiCallAction;
  DnsRequestAction?: DnsRequestAction;
  PortProbeAction?: PortProbeAction;
}
export const Action = S.suspend(() =>
  S.Struct({
    ActionType: S.optional(S.String),
    NetworkConnectionAction: S.optional(NetworkConnectionAction),
    AwsApiCallAction: S.optional(AwsApiCallAction),
    DnsRequestAction: S.optional(DnsRequestAction),
    PortProbeAction: S.optional(PortProbeAction),
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export interface FindingProviderSeverity {
  Label?: SeverityLabel;
  Original?: string;
}
export const FindingProviderSeverity = S.suspend(() =>
  S.Struct({
    Label: S.optional(SeverityLabel),
    Original: S.optional(S.String),
  }),
).annotations({
  identifier: "FindingProviderSeverity",
}) as any as S.Schema<FindingProviderSeverity>;
export interface FindingProviderFields {
  Confidence?: number;
  Criticality?: number;
  RelatedFindings?: RelatedFinding[];
  Severity?: FindingProviderSeverity;
  Types?: string[];
}
export const FindingProviderFields = S.suspend(() =>
  S.Struct({
    Confidence: S.optional(S.Number),
    Criticality: S.optional(S.Number),
    RelatedFindings: S.optional(RelatedFindingList),
    Severity: S.optional(FindingProviderSeverity),
    Types: S.optional(TypeList),
  }),
).annotations({
  identifier: "FindingProviderFields",
}) as any as S.Schema<FindingProviderFields>;
export interface UserAccount {
  Uid?: string;
  Name?: string;
}
export const UserAccount = S.suspend(() =>
  S.Struct({ Uid: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({ identifier: "UserAccount" }) as any as S.Schema<UserAccount>;
export interface ActorUser {
  Name?: string;
  Uid?: string;
  Type?: string;
  CredentialUid?: string;
  Account?: UserAccount;
}
export const ActorUser = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Uid: S.optional(S.String),
    Type: S.optional(S.String),
    CredentialUid: S.optional(S.String),
    Account: S.optional(UserAccount),
  }),
).annotations({ identifier: "ActorUser" }) as any as S.Schema<ActorUser>;
export type ActorSessionMfaStatus = "ENABLED" | "DISABLED" | (string & {});
export const ActorSessionMfaStatus = S.String;
export interface ActorSession {
  Uid?: string;
  MfaStatus?: ActorSessionMfaStatus;
  CreatedTime?: number;
  Issuer?: string;
}
export const ActorSession = S.suspend(() =>
  S.Struct({
    Uid: S.optional(S.String),
    MfaStatus: S.optional(ActorSessionMfaStatus),
    CreatedTime: S.optional(S.Number),
    Issuer: S.optional(S.String),
  }),
).annotations({ identifier: "ActorSession" }) as any as S.Schema<ActorSession>;
export interface Actor {
  Id?: string;
  User?: ActorUser;
  Session?: ActorSession;
}
export const Actor = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    User: S.optional(ActorUser),
    Session: S.optional(ActorSession),
  }),
).annotations({ identifier: "Actor" }) as any as S.Schema<Actor>;
export type ActorsList = Actor[];
export const ActorsList = S.Array(Actor);
export interface NetworkGeoLocation {
  City?: string;
  Country?: string;
  Lat?: number;
  Lon?: number;
}
export const NetworkGeoLocation = S.suspend(() =>
  S.Struct({
    City: S.optional(S.String),
    Country: S.optional(S.String),
    Lat: S.optional(S.Number),
    Lon: S.optional(S.Number),
  }),
).annotations({
  identifier: "NetworkGeoLocation",
}) as any as S.Schema<NetworkGeoLocation>;
export interface NetworkAutonomousSystem {
  Name?: string;
  Number?: number;
}
export const NetworkAutonomousSystem = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Number: S.optional(S.Number) }),
).annotations({
  identifier: "NetworkAutonomousSystem",
}) as any as S.Schema<NetworkAutonomousSystem>;
export type ConnectionDirection = "INBOUND" | "OUTBOUND" | (string & {});
export const ConnectionDirection = S.String;
export interface NetworkConnection {
  Direction?: ConnectionDirection;
}
export const NetworkConnection = S.suspend(() =>
  S.Struct({ Direction: S.optional(ConnectionDirection) }),
).annotations({
  identifier: "NetworkConnection",
}) as any as S.Schema<NetworkConnection>;
export interface NetworkEndpoint {
  Id?: string;
  Ip?: string;
  Domain?: string;
  Port?: number;
  Location?: NetworkGeoLocation;
  AutonomousSystem?: NetworkAutonomousSystem;
  Connection?: NetworkConnection;
}
export const NetworkEndpoint = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Ip: S.optional(S.String),
    Domain: S.optional(S.String),
    Port: S.optional(S.Number),
    Location: S.optional(NetworkGeoLocation),
    AutonomousSystem: S.optional(NetworkAutonomousSystem),
    Connection: S.optional(NetworkConnection),
  }),
).annotations({
  identifier: "NetworkEndpoint",
}) as any as S.Schema<NetworkEndpoint>;
export type NetworkEndpointsList = NetworkEndpoint[];
export const NetworkEndpointsList = S.Array(NetworkEndpoint);
export interface Indicator {
  Key?: string;
  Values?: string[];
  Title?: string;
  Type?: string;
}
export const Indicator = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(NonEmptyStringList),
    Title: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "Indicator" }) as any as S.Schema<Indicator>;
export type IndicatorsList = Indicator[];
export const IndicatorsList = S.Array(Indicator);
export interface Signal {
  Type?: string;
  Id?: string;
  Title?: string;
  ProductArn?: string;
  ResourceIds?: string[];
  SignalIndicators?: Indicator[];
  Name?: string;
  CreatedAt?: number;
  UpdatedAt?: number;
  FirstSeenAt?: number;
  LastSeenAt?: number;
  Severity?: number;
  Count?: number;
  ActorIds?: string[];
  EndpointIds?: string[];
}
export const Signal = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Id: S.optional(S.String),
    Title: S.optional(S.String),
    ProductArn: S.optional(S.String),
    ResourceIds: S.optional(NonEmptyStringList),
    SignalIndicators: S.optional(IndicatorsList),
    Name: S.optional(S.String),
    CreatedAt: S.optional(S.Number),
    UpdatedAt: S.optional(S.Number),
    FirstSeenAt: S.optional(S.Number),
    LastSeenAt: S.optional(S.Number),
    Severity: S.optional(S.Number),
    Count: S.optional(S.Number),
    ActorIds: S.optional(NonEmptyStringList),
    EndpointIds: S.optional(NonEmptyStringList),
  }),
).annotations({ identifier: "Signal" }) as any as S.Schema<Signal>;
export type SignalsList = Signal[];
export const SignalsList = S.Array(Signal);
export interface Sequence {
  Uid?: string;
  Actors?: Actor[];
  Endpoints?: NetworkEndpoint[];
  Signals?: Signal[];
  SequenceIndicators?: Indicator[];
}
export const Sequence = S.suspend(() =>
  S.Struct({
    Uid: S.optional(S.String),
    Actors: S.optional(ActorsList),
    Endpoints: S.optional(NetworkEndpointsList),
    Signals: S.optional(SignalsList),
    SequenceIndicators: S.optional(IndicatorsList),
  }),
).annotations({ identifier: "Sequence" }) as any as S.Schema<Sequence>;
export interface Detection {
  Sequence?: Sequence;
}
export const Detection = S.suspend(() =>
  S.Struct({ Sequence: S.optional(Sequence) }),
).annotations({ identifier: "Detection" }) as any as S.Schema<Detection>;
export interface AwsSecurityFinding {
  SchemaVersion?: string;
  Id?: string;
  ProductArn?: string;
  ProductName?: string;
  CompanyName?: string;
  Region?: string;
  GeneratorId?: string;
  AwsAccountId?: string;
  Types?: string[];
  FirstObservedAt?: string;
  LastObservedAt?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  Severity?: Severity;
  Confidence?: number;
  Criticality?: number;
  Title?: string;
  Description?: string;
  Remediation?: Remediation;
  SourceUrl?: string;
  ProductFields?: { [key: string]: string | undefined };
  UserDefinedFields?: { [key: string]: string | undefined };
  Malware?: Malware[];
  Network?: Network;
  NetworkPath?: NetworkPathComponent[];
  Process?: ProcessDetails;
  Threats?: Threat[];
  ThreatIntelIndicators?: ThreatIntelIndicator[];
  Resources?: Resource[];
  Compliance?: Compliance;
  VerificationState?: VerificationState;
  WorkflowState?: WorkflowState;
  Workflow?: Workflow;
  RecordState?: RecordState;
  RelatedFindings?: RelatedFinding[];
  Note?: Note;
  Vulnerabilities?: Vulnerability[];
  PatchSummary?: PatchSummary;
  Action?: Action;
  FindingProviderFields?: FindingProviderFields;
  Sample?: boolean;
  GeneratorDetails?: GeneratorDetails;
  ProcessedAt?: string;
  AwsAccountName?: string;
  Detection?: Detection;
}
export const AwsSecurityFinding = S.suspend(() =>
  S.Struct({
    SchemaVersion: S.optional(S.String),
    Id: S.optional(S.String),
    ProductArn: S.optional(S.String),
    ProductName: S.optional(S.String),
    CompanyName: S.optional(S.String),
    Region: S.optional(S.String),
    GeneratorId: S.optional(S.String),
    AwsAccountId: S.optional(S.String),
    Types: S.optional(TypeList),
    FirstObservedAt: S.optional(S.String),
    LastObservedAt: S.optional(S.String),
    CreatedAt: S.optional(S.String),
    UpdatedAt: S.optional(S.String),
    Severity: S.optional(Severity),
    Confidence: S.optional(S.Number),
    Criticality: S.optional(S.Number),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    Remediation: S.optional(Remediation),
    SourceUrl: S.optional(S.String),
    ProductFields: S.optional(FieldMap),
    UserDefinedFields: S.optional(FieldMap),
    Malware: S.optional(MalwareList),
    Network: S.optional(Network),
    NetworkPath: S.optional(NetworkPathList),
    Process: S.optional(ProcessDetails),
    Threats: S.optional(ThreatList),
    ThreatIntelIndicators: S.optional(ThreatIntelIndicatorList),
    Resources: S.optional(ResourceList),
    Compliance: S.optional(Compliance),
    VerificationState: S.optional(VerificationState),
    WorkflowState: S.optional(WorkflowState),
    Workflow: S.optional(Workflow),
    RecordState: S.optional(RecordState),
    RelatedFindings: S.optional(RelatedFindingList),
    Note: S.optional(Note),
    Vulnerabilities: S.optional(VulnerabilityList),
    PatchSummary: S.optional(PatchSummary),
    Action: S.optional(Action),
    FindingProviderFields: S.optional(FindingProviderFields),
    Sample: S.optional(S.Boolean),
    GeneratorDetails: S.optional(GeneratorDetails),
    ProcessedAt: S.optional(S.String),
    AwsAccountName: S.optional(S.String),
    Detection: S.optional(Detection),
  }),
).annotations({
  identifier: "AwsSecurityFinding",
}) as any as S.Schema<AwsSecurityFinding>;
export type AwsSecurityFindingList = AwsSecurityFinding[];
export const AwsSecurityFindingList = S.Array(AwsSecurityFinding);
export interface Insight {
  InsightArn?: string;
  Name?: string;
  Filters?: AwsSecurityFindingFilters;
  GroupByAttribute?: string;
}
export const Insight = S.suspend(() =>
  S.Struct({
    InsightArn: S.optional(S.String),
    Name: S.optional(S.String),
    Filters: S.optional(AwsSecurityFindingFilters),
    GroupByAttribute: S.optional(S.String),
  }),
).annotations({ identifier: "Insight" }) as any as S.Schema<Insight>;
export type InsightList = Insight[];
export const InsightList = S.Array(Insight);
export interface AggregatorV2 {
  AggregatorV2Arn?: string;
}
export const AggregatorV2 = S.suspend(() =>
  S.Struct({ AggregatorV2Arn: S.optional(S.String) }),
).annotations({ identifier: "AggregatorV2" }) as any as S.Schema<AggregatorV2>;
export type AggregatorV2List = AggregatorV2[];
export const AggregatorV2List = S.Array(AggregatorV2);
export interface AutomationRulesMetadata {
  RuleArn?: string;
  RuleStatus?: RuleStatus;
  RuleOrder?: number;
  RuleName?: string;
  Description?: string;
  IsTerminal?: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  CreatedBy?: string;
}
export const AutomationRulesMetadata = S.suspend(() =>
  S.Struct({
    RuleArn: S.optional(S.String),
    RuleStatus: S.optional(RuleStatus),
    RuleOrder: S.optional(S.Number),
    RuleName: S.optional(S.String),
    Description: S.optional(S.String),
    IsTerminal: S.optional(S.Boolean),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "AutomationRulesMetadata",
}) as any as S.Schema<AutomationRulesMetadata>;
export type AutomationRulesMetadataList = AutomationRulesMetadata[];
export const AutomationRulesMetadataList = S.Array(AutomationRulesMetadata);
export interface ConfigurationPolicySummary {
  Arn?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  UpdatedAt?: Date;
  ServiceEnabled?: boolean;
}
export const ConfigurationPolicySummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ServiceEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ConfigurationPolicySummary",
}) as any as S.Schema<ConfigurationPolicySummary>;
export type ConfigurationPolicySummaryList = ConfigurationPolicySummary[];
export const ConfigurationPolicySummaryList = S.Array(
  ConfigurationPolicySummary,
);
export interface ConfigurationPolicyAssociationSummary {
  ConfigurationPolicyId?: string;
  TargetId?: string;
  TargetType?: TargetType;
  AssociationType?: AssociationType;
  UpdatedAt?: Date;
  AssociationStatus?: ConfigurationPolicyAssociationStatus;
  AssociationStatusMessage?: string;
}
export const ConfigurationPolicyAssociationSummary = S.suspend(() =>
  S.Struct({
    ConfigurationPolicyId: S.optional(S.String),
    TargetId: S.optional(S.String),
    TargetType: S.optional(TargetType),
    AssociationType: S.optional(AssociationType),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    AssociationStatus: S.optional(ConfigurationPolicyAssociationStatus),
    AssociationStatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationPolicyAssociationSummary",
}) as any as S.Schema<ConfigurationPolicyAssociationSummary>;
export type ConfigurationPolicyAssociationSummaryList =
  ConfigurationPolicyAssociationSummary[];
export const ConfigurationPolicyAssociationSummaryList = S.Array(
  ConfigurationPolicyAssociationSummary,
);
export interface FindingAggregator {
  FindingAggregatorArn?: string;
}
export const FindingAggregator = S.suspend(() =>
  S.Struct({ FindingAggregatorArn: S.optional(S.String) }),
).annotations({
  identifier: "FindingAggregator",
}) as any as S.Schema<FindingAggregator>;
export type FindingAggregatorList = FindingAggregator[];
export const FindingAggregatorList = S.Array(FindingAggregator);
export interface AdminAccount {
  AccountId?: string;
  Status?: AdminStatus;
}
export const AdminAccount = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    Status: S.optional(AdminStatus),
  }),
).annotations({ identifier: "AdminAccount" }) as any as S.Schema<AdminAccount>;
export type AdminAccounts = AdminAccount[];
export const AdminAccounts = S.Array(AdminAccount);
export interface StandardsControlAssociationSummary {
  StandardsArn?: string;
  SecurityControlId?: string;
  SecurityControlArn?: string;
  AssociationStatus?: AssociationStatus;
  RelatedRequirements?: string[];
  UpdatedAt?: Date;
  UpdatedReason?: string;
  StandardsControlTitle?: string;
  StandardsControlDescription?: string;
}
export const StandardsControlAssociationSummary = S.suspend(() =>
  S.Struct({
    StandardsArn: S.optional(S.String),
    SecurityControlId: S.optional(S.String),
    SecurityControlArn: S.optional(S.String),
    AssociationStatus: S.optional(AssociationStatus),
    RelatedRequirements: S.optional(RelatedRequirementsList),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedReason: S.optional(S.String),
    StandardsControlTitle: S.optional(S.String),
    StandardsControlDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "StandardsControlAssociationSummary",
}) as any as S.Schema<StandardsControlAssociationSummary>;
export type StandardsControlAssociationSummaries =
  StandardsControlAssociationSummary[];
export const StandardsControlAssociationSummaries = S.Array(
  StandardsControlAssociationSummary,
);
export type ProviderUpdateConfiguration =
  | { JiraCloud: JiraCloudUpdateConfiguration; ServiceNow?: never }
  | { JiraCloud?: never; ServiceNow: ServiceNowUpdateConfiguration };
export const ProviderUpdateConfiguration = S.Union(
  S.Struct({ JiraCloud: JiraCloudUpdateConfiguration }),
  S.Struct({ ServiceNow: ServiceNowUpdateConfiguration }),
);
export type ConnectorAuthStatus = "ACTIVE" | "FAILED" | (string & {});
export const ConnectorAuthStatus = S.String;
export type FindingHistoryUpdateSourceType =
  | "BATCH_UPDATE_FINDINGS"
  | "BATCH_IMPORT_FINDINGS"
  | (string & {});
export const FindingHistoryUpdateSourceType = S.String;
export interface FindingsTrendsStringFilter {
  FieldName?: FindingsTrendsStringField;
  Filter?: StringFilter;
}
export const FindingsTrendsStringFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(FindingsTrendsStringField),
    Filter: S.optional(StringFilter),
  }),
).annotations({
  identifier: "FindingsTrendsStringFilter",
}) as any as S.Schema<FindingsTrendsStringFilter>;
export type FindingsTrendsStringFilterList = FindingsTrendsStringFilter[];
export const FindingsTrendsStringFilterList = S.Array(
  FindingsTrendsStringFilter,
);
export interface OcsfStringFilter {
  FieldName?: OcsfStringField;
  Filter?: StringFilter;
}
export const OcsfStringFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(OcsfStringField),
    Filter: S.optional(StringFilter),
  }),
).annotations({
  identifier: "OcsfStringFilter",
}) as any as S.Schema<OcsfStringFilter>;
export type OcsfStringFilterList = OcsfStringFilter[];
export const OcsfStringFilterList = S.Array(OcsfStringFilter);
export interface OcsfDateFilter {
  FieldName?: OcsfDateField;
  Filter?: DateFilter;
}
export const OcsfDateFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(OcsfDateField),
    Filter: S.optional(DateFilter),
  }),
).annotations({
  identifier: "OcsfDateFilter",
}) as any as S.Schema<OcsfDateFilter>;
export type OcsfDateFilterList = OcsfDateFilter[];
export const OcsfDateFilterList = S.Array(OcsfDateFilter);
export interface OcsfBooleanFilter {
  FieldName?: OcsfBooleanField;
  Filter?: BooleanFilter;
}
export const OcsfBooleanFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(OcsfBooleanField),
    Filter: S.optional(BooleanFilter),
  }),
).annotations({
  identifier: "OcsfBooleanFilter",
}) as any as S.Schema<OcsfBooleanFilter>;
export type OcsfBooleanFilterList = OcsfBooleanFilter[];
export const OcsfBooleanFilterList = S.Array(OcsfBooleanFilter);
export interface OcsfNumberFilter {
  FieldName?: OcsfNumberField;
  Filter?: NumberFilter;
}
export const OcsfNumberFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(OcsfNumberField),
    Filter: S.optional(NumberFilter),
  }),
).annotations({
  identifier: "OcsfNumberFilter",
}) as any as S.Schema<OcsfNumberFilter>;
export type OcsfNumberFilterList = OcsfNumberFilter[];
export const OcsfNumberFilterList = S.Array(OcsfNumberFilter);
export interface OcsfMapFilter {
  FieldName?: OcsfMapField;
  Filter?: MapFilter;
}
export const OcsfMapFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(OcsfMapField),
    Filter: S.optional(MapFilter),
  }),
).annotations({
  identifier: "OcsfMapFilter",
}) as any as S.Schema<OcsfMapFilter>;
export type OcsfMapFilterList = OcsfMapFilter[];
export const OcsfMapFilterList = S.Array(OcsfMapFilter);
export interface OcsfIpFilter {
  FieldName?: OcsfIpField;
  Filter?: IpFilter;
}
export const OcsfIpFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(OcsfIpField),
    Filter: S.optional(IpFilter),
  }),
).annotations({ identifier: "OcsfIpFilter" }) as any as S.Schema<OcsfIpFilter>;
export type OcsfIpFilterList = OcsfIpFilter[];
export const OcsfIpFilterList = S.Array(OcsfIpFilter);
export interface ResourcesTrendsStringFilter {
  FieldName?: ResourcesTrendsStringField;
  Filter?: StringFilter;
}
export const ResourcesTrendsStringFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(ResourcesTrendsStringField),
    Filter: S.optional(StringFilter),
  }),
).annotations({
  identifier: "ResourcesTrendsStringFilter",
}) as any as S.Schema<ResourcesTrendsStringFilter>;
export type ResourcesTrendsStringFilterList = ResourcesTrendsStringFilter[];
export const ResourcesTrendsStringFilterList = S.Array(
  ResourcesTrendsStringFilter,
);
export interface ResourcesStringFilter {
  FieldName?: ResourcesStringField;
  Filter?: StringFilter;
}
export const ResourcesStringFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(ResourcesStringField),
    Filter: S.optional(StringFilter),
  }),
).annotations({
  identifier: "ResourcesStringFilter",
}) as any as S.Schema<ResourcesStringFilter>;
export type ResourcesStringFilterList = ResourcesStringFilter[];
export const ResourcesStringFilterList = S.Array(ResourcesStringFilter);
export interface ResourcesDateFilter {
  FieldName?: ResourcesDateField;
  Filter?: DateFilter;
}
export const ResourcesDateFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(ResourcesDateField),
    Filter: S.optional(DateFilter),
  }),
).annotations({
  identifier: "ResourcesDateFilter",
}) as any as S.Schema<ResourcesDateFilter>;
export type ResourcesDateFilterList = ResourcesDateFilter[];
export const ResourcesDateFilterList = S.Array(ResourcesDateFilter);
export interface ResourcesNumberFilter {
  FieldName?: ResourcesNumberField;
  Filter?: NumberFilter;
}
export const ResourcesNumberFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(ResourcesNumberField),
    Filter: S.optional(NumberFilter),
  }),
).annotations({
  identifier: "ResourcesNumberFilter",
}) as any as S.Schema<ResourcesNumberFilter>;
export type ResourcesNumberFilterList = ResourcesNumberFilter[];
export const ResourcesNumberFilterList = S.Array(ResourcesNumberFilter);
export interface ResourcesMapFilter {
  FieldName?: ResourcesMapField;
  Filter?: MapFilter;
}
export const ResourcesMapFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(ResourcesMapField),
    Filter: S.optional(MapFilter),
  }),
).annotations({
  identifier: "ResourcesMapFilter",
}) as any as S.Schema<ResourcesMapFilter>;
export type ResourcesMapFilterList = ResourcesMapFilter[];
export const ResourcesMapFilterList = S.Array(ResourcesMapFilter);
export interface BatchDeleteAutomationRulesResponse {
  ProcessedAutomationRules?: string[];
  UnprocessedAutomationRules?: UnprocessedAutomationRule[];
}
export const BatchDeleteAutomationRulesResponse = S.suspend(() =>
  S.Struct({
    ProcessedAutomationRules: S.optional(AutomationRulesArnsList),
    UnprocessedAutomationRules: S.optional(UnprocessedAutomationRulesList),
  }),
).annotations({
  identifier: "BatchDeleteAutomationRulesResponse",
}) as any as S.Schema<BatchDeleteAutomationRulesResponse>;
export interface BatchEnableStandardsRequest {
  StandardsSubscriptionRequests?: StandardsSubscriptionRequest[];
}
export const BatchEnableStandardsRequest = S.suspend(() =>
  S.Struct({
    StandardsSubscriptionRequests: S.optional(StandardsSubscriptionRequests),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/standards/register" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchEnableStandardsRequest",
}) as any as S.Schema<BatchEnableStandardsRequest>;
export interface BatchGetAutomationRulesResponse {
  Rules?: (AutomationRulesConfig & {
    Actions: (AutomationRulesAction & {
      FindingFieldsUpdate: AutomationRulesFindingFieldsUpdate & {
        Note: NoteUpdate & { Text: NonEmptyString; UpdatedBy: NonEmptyString };
        RelatedFindings: (RelatedFinding & {
          ProductArn: NonEmptyString;
          Id: NonEmptyString;
        })[];
      };
    })[];
  })[];
  UnprocessedAutomationRules?: UnprocessedAutomationRule[];
}
export const BatchGetAutomationRulesResponse = S.suspend(() =>
  S.Struct({
    Rules: S.optional(AutomationRulesConfigList),
    UnprocessedAutomationRules: S.optional(UnprocessedAutomationRulesList),
  }),
).annotations({
  identifier: "BatchGetAutomationRulesResponse",
}) as any as S.Schema<BatchGetAutomationRulesResponse>;
export interface BatchGetSecurityControlsResponse {
  SecurityControls: (SecurityControl & {
    SecurityControlId: NonEmptyString;
    SecurityControlArn: NonEmptyString;
    Title: NonEmptyString;
    Description: NonEmptyString;
    RemediationUrl: NonEmptyString;
    SeverityRating: SeverityRating;
    SecurityControlStatus: ControlStatus;
    Parameters: {
      [key: string]:
        | (ParameterConfiguration & { ValueType: ParameterValueType })
        | undefined;
    };
  })[];
  UnprocessedIds?: (UnprocessedSecurityControl & {
    SecurityControlId: NonEmptyString;
    ErrorCode: UnprocessedErrorCode;
  })[];
}
export const BatchGetSecurityControlsResponse = S.suspend(() =>
  S.Struct({
    SecurityControls: S.optional(SecurityControls),
    UnprocessedIds: S.optional(UnprocessedSecurityControls),
  }),
).annotations({
  identifier: "BatchGetSecurityControlsResponse",
}) as any as S.Schema<BatchGetSecurityControlsResponse>;
export interface BatchUpdateAutomationRulesResponse {
  ProcessedAutomationRules?: string[];
  UnprocessedAutomationRules?: UnprocessedAutomationRule[];
}
export const BatchUpdateAutomationRulesResponse = S.suspend(() =>
  S.Struct({
    ProcessedAutomationRules: S.optional(AutomationRulesArnsList),
    UnprocessedAutomationRules: S.optional(UnprocessedAutomationRulesList),
  }),
).annotations({
  identifier: "BatchUpdateAutomationRulesResponse",
}) as any as S.Schema<BatchUpdateAutomationRulesResponse>;
export interface CreateAggregatorV2Response {
  AggregatorV2Arn?: string;
  AggregationRegion?: string;
  RegionLinkingMode?: string;
  LinkedRegions?: string[];
}
export const CreateAggregatorV2Response = S.suspend(() =>
  S.Struct({
    AggregatorV2Arn: S.optional(S.String),
    AggregationRegion: S.optional(S.String),
    RegionLinkingMode: S.optional(S.String),
    LinkedRegions: S.optional(StringList),
  }),
).annotations({
  identifier: "CreateAggregatorV2Response",
}) as any as S.Schema<CreateAggregatorV2Response>;
export interface CreateAutomationRuleV2Request {
  RuleName?: string;
  RuleStatus?: RuleStatusV2;
  Description?: string;
  RuleOrder?: number;
  Criteria?: Criteria;
  Actions?: AutomationRulesActionV2[];
  Tags?: { [key: string]: string | undefined };
  ClientToken?: string;
}
export const CreateAutomationRuleV2Request = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    RuleStatus: S.optional(RuleStatusV2),
    Description: S.optional(S.String),
    RuleOrder: S.optional(S.Number),
    Criteria: S.optional(Criteria),
    Actions: S.optional(AutomationRulesActionListV2),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/automationrulesv2/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAutomationRuleV2Request",
}) as any as S.Schema<CreateAutomationRuleV2Request>;
export interface CreateConnectorV2Request {
  Name?: string;
  Description?: string;
  Provider?: ProviderConfiguration;
  KmsKeyArn?: string;
  Tags?: { [key: string]: string | undefined };
  ClientToken?: string;
}
export const CreateConnectorV2Request = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Provider: S.optional(ProviderConfiguration),
    KmsKeyArn: S.optional(S.String),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/connectorsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectorV2Request",
}) as any as S.Schema<CreateConnectorV2Request>;
export interface CreateInsightRequest {
  Name?: string;
  Filters?: AwsSecurityFindingFilters;
  GroupByAttribute?: string;
}
export const CreateInsightRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Filters: S.optional(AwsSecurityFindingFilters),
    GroupByAttribute: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/insights" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInsightRequest",
}) as any as S.Schema<CreateInsightRequest>;
export interface CreateMembersResponse {
  UnprocessedAccounts?: Result[];
}
export const CreateMembersResponse = S.suspend(() =>
  S.Struct({ UnprocessedAccounts: S.optional(ResultList) }),
).annotations({
  identifier: "CreateMembersResponse",
}) as any as S.Schema<CreateMembersResponse>;
export interface DeclineInvitationsResponse {
  UnprocessedAccounts?: Result[];
}
export const DeclineInvitationsResponse = S.suspend(() =>
  S.Struct({ UnprocessedAccounts: S.optional(ResultList) }),
).annotations({
  identifier: "DeclineInvitationsResponse",
}) as any as S.Schema<DeclineInvitationsResponse>;
export interface DescribeActionTargetsResponse {
  ActionTargets: (ActionTarget & {
    ActionTargetArn: NonEmptyString;
    Name: NonEmptyString;
    Description: NonEmptyString;
  })[];
  NextToken?: string;
}
export const DescribeActionTargetsResponse = S.suspend(() =>
  S.Struct({
    ActionTargets: S.optional(ActionTargetList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeActionTargetsResponse",
}) as any as S.Schema<DescribeActionTargetsResponse>;
export interface DescribeProductsResponse {
  Products: (Product & { ProductArn: NonEmptyString })[];
  NextToken?: string;
}
export const DescribeProductsResponse = S.suspend(() =>
  S.Struct({
    Products: S.optional(ProductsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProductsResponse",
}) as any as S.Schema<DescribeProductsResponse>;
export interface DescribeProductsV2Response {
  ProductsV2: ProductV2[];
  NextToken?: string;
}
export const DescribeProductsV2Response = S.suspend(() =>
  S.Struct({
    ProductsV2: S.optional(ProductsV2List),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProductsV2Response",
}) as any as S.Schema<DescribeProductsV2Response>;
export interface DescribeStandardsControlsResponse {
  Controls?: StandardsControl[];
  NextToken?: string;
}
export const DescribeStandardsControlsResponse = S.suspend(() =>
  S.Struct({
    Controls: S.optional(StandardsControls),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeStandardsControlsResponse",
}) as any as S.Schema<DescribeStandardsControlsResponse>;
export interface GetConfigurationPolicyAssociationResponse {
  ConfigurationPolicyId?: string;
  TargetId?: string;
  TargetType?: TargetType;
  AssociationType?: AssociationType;
  UpdatedAt?: Date;
  AssociationStatus?: ConfigurationPolicyAssociationStatus;
  AssociationStatusMessage?: string;
}
export const GetConfigurationPolicyAssociationResponse = S.suspend(() =>
  S.Struct({
    ConfigurationPolicyId: S.optional(S.String),
    TargetId: S.optional(S.String),
    TargetType: S.optional(TargetType),
    AssociationType: S.optional(AssociationType),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    AssociationStatus: S.optional(ConfigurationPolicyAssociationStatus),
    AssociationStatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "GetConfigurationPolicyAssociationResponse",
}) as any as S.Schema<GetConfigurationPolicyAssociationResponse>;
export interface GetFindingsResponse {
  Findings: (AwsSecurityFinding & {
    SchemaVersion: NonEmptyString;
    Id: NonEmptyString;
    ProductArn: NonEmptyString;
    GeneratorId: NonEmptyString;
    AwsAccountId: NonEmptyString;
    CreatedAt: NonEmptyString;
    UpdatedAt: NonEmptyString;
    Title: NonEmptyString;
    Description: NonEmptyString;
    Resources: (Resource & { Type: NonEmptyString; Id: NonEmptyString })[];
    Malware: (Malware & { Name: NonEmptyString })[];
    Compliance: Compliance & {
      StatusReasons: (StatusReason & { ReasonCode: NonEmptyString })[];
    };
    RelatedFindings: (RelatedFinding & {
      ProductArn: NonEmptyString;
      Id: NonEmptyString;
    })[];
    Note: Note & {
      Text: NonEmptyString;
      UpdatedBy: NonEmptyString;
      UpdatedAt: NonEmptyString;
    };
    Vulnerabilities: (Vulnerability & {
      Id: NonEmptyString;
      Vendor: VulnerabilityVendor & { Name: NonEmptyString };
    })[];
    PatchSummary: PatchSummary & { Id: NonEmptyString };
    FindingProviderFields: FindingProviderFields & {
      RelatedFindings: (RelatedFinding & {
        ProductArn: NonEmptyString;
        Id: NonEmptyString;
      })[];
    };
  })[];
  NextToken?: string;
}
export const GetFindingsResponse = S.suspend(() =>
  S.Struct({
    Findings: S.optional(AwsSecurityFindingList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetFindingsResponse",
}) as any as S.Schema<GetFindingsResponse>;
export interface GetInsightsResponse {
  Insights: (Insight & {
    InsightArn: NonEmptyString;
    Name: NonEmptyString;
    Filters: AwsSecurityFindingFilters;
    GroupByAttribute: NonEmptyString;
  })[];
  NextToken?: string;
}
export const GetInsightsResponse = S.suspend(() =>
  S.Struct({
    Insights: S.optional(InsightList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetInsightsResponse",
}) as any as S.Schema<GetInsightsResponse>;
export interface GetMembersResponse {
  Members?: Member[];
  UnprocessedAccounts?: Result[];
}
export const GetMembersResponse = S.suspend(() =>
  S.Struct({
    Members: S.optional(MemberList),
    UnprocessedAccounts: S.optional(ResultList),
  }),
).annotations({
  identifier: "GetMembersResponse",
}) as any as S.Schema<GetMembersResponse>;
export interface GroupByValue {
  FieldValue?: string;
  Count?: number;
}
export const GroupByValue = S.suspend(() =>
  S.Struct({ FieldValue: S.optional(S.String), Count: S.optional(S.Number) }),
).annotations({ identifier: "GroupByValue" }) as any as S.Schema<GroupByValue>;
export type GroupByValues = GroupByValue[];
export const GroupByValues = S.Array(GroupByValue);
export interface GroupByResult {
  GroupByField?: string;
  GroupByValues?: GroupByValue[];
}
export const GroupByResult = S.suspend(() =>
  S.Struct({
    GroupByField: S.optional(S.String),
    GroupByValues: S.optional(GroupByValues),
  }),
).annotations({
  identifier: "GroupByResult",
}) as any as S.Schema<GroupByResult>;
export type GroupByResults = GroupByResult[];
export const GroupByResults = S.Array(GroupByResult);
export interface GetResourcesStatisticsV2Response {
  GroupByResults: GroupByResult[];
}
export const GetResourcesStatisticsV2Response = S.suspend(() =>
  S.Struct({ GroupByResults: S.optional(GroupByResults) }),
).annotations({
  identifier: "GetResourcesStatisticsV2Response",
}) as any as S.Schema<GetResourcesStatisticsV2Response>;
export interface ListAggregatorsV2Response {
  AggregatorsV2?: AggregatorV2[];
  NextToken?: string;
}
export const ListAggregatorsV2Response = S.suspend(() =>
  S.Struct({
    AggregatorsV2: S.optional(AggregatorV2List),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAggregatorsV2Response",
}) as any as S.Schema<ListAggregatorsV2Response>;
export interface ListAutomationRulesResponse {
  AutomationRulesMetadata?: AutomationRulesMetadata[];
  NextToken?: string;
}
export const ListAutomationRulesResponse = S.suspend(() =>
  S.Struct({
    AutomationRulesMetadata: S.optional(AutomationRulesMetadataList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomationRulesResponse",
}) as any as S.Schema<ListAutomationRulesResponse>;
export interface ListConfigurationPoliciesResponse {
  ConfigurationPolicySummaries?: ConfigurationPolicySummary[];
  NextToken?: string;
}
export const ListConfigurationPoliciesResponse = S.suspend(() =>
  S.Struct({
    ConfigurationPolicySummaries: S.optional(ConfigurationPolicySummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationPoliciesResponse",
}) as any as S.Schema<ListConfigurationPoliciesResponse>;
export interface ListConfigurationPolicyAssociationsResponse {
  ConfigurationPolicyAssociationSummaries?: ConfigurationPolicyAssociationSummary[];
  NextToken?: string;
}
export const ListConfigurationPolicyAssociationsResponse = S.suspend(() =>
  S.Struct({
    ConfigurationPolicyAssociationSummaries: S.optional(
      ConfigurationPolicyAssociationSummaryList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationPolicyAssociationsResponse",
}) as any as S.Schema<ListConfigurationPolicyAssociationsResponse>;
export interface ListFindingAggregatorsResponse {
  FindingAggregators?: FindingAggregator[];
  NextToken?: string;
}
export const ListFindingAggregatorsResponse = S.suspend(() =>
  S.Struct({
    FindingAggregators: S.optional(FindingAggregatorList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFindingAggregatorsResponse",
}) as any as S.Schema<ListFindingAggregatorsResponse>;
export interface ListOrganizationAdminAccountsResponse {
  AdminAccounts?: AdminAccount[];
  NextToken?: string;
  Feature?: SecurityHubFeature;
}
export const ListOrganizationAdminAccountsResponse = S.suspend(() =>
  S.Struct({
    AdminAccounts: S.optional(AdminAccounts),
    NextToken: S.optional(S.String),
    Feature: S.optional(SecurityHubFeature),
  }),
).annotations({
  identifier: "ListOrganizationAdminAccountsResponse",
}) as any as S.Schema<ListOrganizationAdminAccountsResponse>;
export interface ListStandardsControlAssociationsResponse {
  StandardsControlAssociationSummaries: (StandardsControlAssociationSummary & {
    StandardsArn: NonEmptyString;
    SecurityControlId: NonEmptyString;
    SecurityControlArn: NonEmptyString;
    AssociationStatus: AssociationStatus;
  })[];
  NextToken?: string;
}
export const ListStandardsControlAssociationsResponse = S.suspend(() =>
  S.Struct({
    StandardsControlAssociationSummaries: S.optional(
      StandardsControlAssociationSummaries,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStandardsControlAssociationsResponse",
}) as any as S.Schema<ListStandardsControlAssociationsResponse>;
export interface UpdateConnectorV2Request {
  ConnectorId: string;
  Description?: string;
  Provider?: ProviderUpdateConfiguration;
}
export const UpdateConnectorV2Request = S.suspend(() =>
  S.Struct({
    ConnectorId: S.String.pipe(T.HttpLabel("ConnectorId")),
    Description: S.optional(S.String),
    Provider: S.optional(ProviderUpdateConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/connectorsv2/{ConnectorId+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectorV2Request",
}) as any as S.Schema<UpdateConnectorV2Request>;
export interface UpdateConnectorV2Response {}
export const UpdateConnectorV2Response = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateConnectorV2Response",
}) as any as S.Schema<UpdateConnectorV2Response>;
export type StandardsControlArnList = string[];
export const StandardsControlArnList = S.Array(S.String);
export type BatchUpdateFindingsV2UnprocessedFindingErrorCode =
  | "ResourceNotFoundException"
  | "ValidationException"
  | "InternalServerException"
  | "ConflictException"
  | (string & {});
export const BatchUpdateFindingsV2UnprocessedFindingErrorCode = S.String;
export interface StandardsManagedBy {
  Company?: string;
  Product?: string;
}
export const StandardsManagedBy = S.suspend(() =>
  S.Struct({ Company: S.optional(S.String), Product: S.optional(S.String) }),
).annotations({
  identifier: "StandardsManagedBy",
}) as any as S.Schema<StandardsManagedBy>;
export interface JiraCloudDetail {
  CloudId?: string;
  ProjectKey?: string;
  Domain?: string;
  AuthUrl?: string;
  AuthStatus?: ConnectorAuthStatus;
}
export const JiraCloudDetail = S.suspend(() =>
  S.Struct({
    CloudId: S.optional(S.String),
    ProjectKey: S.optional(S.String),
    Domain: S.optional(S.String),
    AuthUrl: S.optional(S.String),
    AuthStatus: S.optional(ConnectorAuthStatus),
  }),
).annotations({
  identifier: "JiraCloudDetail",
}) as any as S.Schema<JiraCloudDetail>;
export interface ServiceNowDetail {
  InstanceName?: string;
  SecretArn?: string;
  AuthStatus?: ConnectorAuthStatus;
}
export const ServiceNowDetail = S.suspend(() =>
  S.Struct({
    InstanceName: S.optional(S.String),
    SecretArn: S.optional(S.String),
    AuthStatus: S.optional(ConnectorAuthStatus),
  }),
).annotations({
  identifier: "ServiceNowDetail",
}) as any as S.Schema<ServiceNowDetail>;
export interface FindingHistoryUpdateSource {
  Type?: FindingHistoryUpdateSourceType;
  Identity?: string;
}
export const FindingHistoryUpdateSource = S.suspend(() =>
  S.Struct({
    Type: S.optional(FindingHistoryUpdateSourceType),
    Identity: S.optional(S.String),
  }),
).annotations({
  identifier: "FindingHistoryUpdateSource",
}) as any as S.Schema<FindingHistoryUpdateSource>;
export interface FindingHistoryUpdate {
  UpdatedField?: string;
  OldValue?: string;
  NewValue?: string;
}
export const FindingHistoryUpdate = S.suspend(() =>
  S.Struct({
    UpdatedField: S.optional(S.String),
    OldValue: S.optional(S.String),
    NewValue: S.optional(S.String),
  }),
).annotations({
  identifier: "FindingHistoryUpdate",
}) as any as S.Schema<FindingHistoryUpdate>;
export type FindingHistoryUpdatesList = FindingHistoryUpdate[];
export const FindingHistoryUpdatesList = S.Array(FindingHistoryUpdate);
export interface FindingsTrendsCompositeFilter {
  StringFilters?: FindingsTrendsStringFilter[];
  NestedCompositeFilters?: FindingsTrendsCompositeFilter[];
  Operator?: AllowedOperators;
}
export const FindingsTrendsCompositeFilter = S.suspend(() =>
  S.Struct({
    StringFilters: S.optional(FindingsTrendsStringFilterList),
    NestedCompositeFilters: S.optional(
      S.suspend(() => FindingsTrendsCompositeFilterList).annotations({
        identifier: "FindingsTrendsCompositeFilterList",
      }),
    ),
    Operator: S.optional(AllowedOperators),
  }),
).annotations({
  identifier: "FindingsTrendsCompositeFilter",
}) as any as S.Schema<FindingsTrendsCompositeFilter>;
export type FindingsTrendsCompositeFilterList = FindingsTrendsCompositeFilter[];
export const FindingsTrendsCompositeFilterList = S.Array(
  S.suspend(
    (): S.Schema<FindingsTrendsCompositeFilter, any> =>
      FindingsTrendsCompositeFilter,
  ).annotations({ identifier: "FindingsTrendsCompositeFilter" }),
) as any as S.Schema<FindingsTrendsCompositeFilterList>;
export interface CompositeFilter {
  StringFilters?: OcsfStringFilter[];
  DateFilters?: OcsfDateFilter[];
  BooleanFilters?: OcsfBooleanFilter[];
  NumberFilters?: OcsfNumberFilter[];
  MapFilters?: OcsfMapFilter[];
  IpFilters?: OcsfIpFilter[];
  NestedCompositeFilters?: CompositeFilter[];
  Operator?: AllowedOperators;
}
export const CompositeFilter = S.suspend(() =>
  S.Struct({
    StringFilters: S.optional(OcsfStringFilterList),
    DateFilters: S.optional(OcsfDateFilterList),
    BooleanFilters: S.optional(OcsfBooleanFilterList),
    NumberFilters: S.optional(OcsfNumberFilterList),
    MapFilters: S.optional(OcsfMapFilterList),
    IpFilters: S.optional(OcsfIpFilterList),
    NestedCompositeFilters: S.optional(
      S.suspend(() => CompositeFilterList).annotations({
        identifier: "CompositeFilterList",
      }),
    ),
    Operator: S.optional(AllowedOperators),
  }),
).annotations({
  identifier: "CompositeFilter",
}) as any as S.Schema<CompositeFilter>;
export interface InsightResultValue {
  GroupByAttributeValue?: string;
  Count?: number;
}
export const InsightResultValue = S.suspend(() =>
  S.Struct({
    GroupByAttributeValue: S.optional(S.String),
    Count: S.optional(S.Number),
  }),
).annotations({
  identifier: "InsightResultValue",
}) as any as S.Schema<InsightResultValue>;
export type InsightResultValueList = InsightResultValue[];
export const InsightResultValueList = S.Array(InsightResultValue);
export interface ResourcesTrendsCompositeFilter {
  StringFilters?: ResourcesTrendsStringFilter[];
  NestedCompositeFilters?: ResourcesTrendsCompositeFilter[];
  Operator?: AllowedOperators;
}
export const ResourcesTrendsCompositeFilter = S.suspend(() =>
  S.Struct({
    StringFilters: S.optional(ResourcesTrendsStringFilterList),
    NestedCompositeFilters: S.optional(
      S.suspend(() => ResourcesTrendsCompositeFilterList).annotations({
        identifier: "ResourcesTrendsCompositeFilterList",
      }),
    ),
    Operator: S.optional(AllowedOperators),
  }),
).annotations({
  identifier: "ResourcesTrendsCompositeFilter",
}) as any as S.Schema<ResourcesTrendsCompositeFilter>;
export type ResourcesTrendsCompositeFilterList =
  ResourcesTrendsCompositeFilter[];
export const ResourcesTrendsCompositeFilterList = S.Array(
  S.suspend(
    (): S.Schema<ResourcesTrendsCompositeFilter, any> =>
      ResourcesTrendsCompositeFilter,
  ).annotations({ identifier: "ResourcesTrendsCompositeFilter" }),
) as any as S.Schema<ResourcesTrendsCompositeFilterList>;
export interface ResourcesCompositeFilter {
  StringFilters?: ResourcesStringFilter[];
  DateFilters?: ResourcesDateFilter[];
  NumberFilters?: ResourcesNumberFilter[];
  MapFilters?: ResourcesMapFilter[];
  NestedCompositeFilters?: ResourcesCompositeFilter[];
  Operator?: AllowedOperators;
}
export const ResourcesCompositeFilter = S.suspend(() =>
  S.Struct({
    StringFilters: S.optional(ResourcesStringFilterList),
    DateFilters: S.optional(ResourcesDateFilterList),
    NumberFilters: S.optional(ResourcesNumberFilterList),
    MapFilters: S.optional(ResourcesMapFilterList),
    NestedCompositeFilters: S.optional(
      S.suspend(() => ResourcesCompositeFilterList).annotations({
        identifier: "ResourcesCompositeFilterList",
      }),
    ),
    Operator: S.optional(AllowedOperators),
  }),
).annotations({
  identifier: "ResourcesCompositeFilter",
}) as any as S.Schema<ResourcesCompositeFilter>;
export interface AutomationRulesActionTypeObjectV2 {
  Type?: AutomationRulesActionTypeV2;
}
export const AutomationRulesActionTypeObjectV2 = S.suspend(() =>
  S.Struct({ Type: S.optional(AutomationRulesActionTypeV2) }),
).annotations({
  identifier: "AutomationRulesActionTypeObjectV2",
}) as any as S.Schema<AutomationRulesActionTypeObjectV2>;
export type AutomationRulesActionTypeListV2 =
  AutomationRulesActionTypeObjectV2[];
export const AutomationRulesActionTypeListV2 = S.Array(
  AutomationRulesActionTypeObjectV2,
);
export interface ProviderSummary {
  ProviderName?: ConnectorProviderName;
  ConnectorStatus?: ConnectorStatus;
}
export const ProviderSummary = S.suspend(() =>
  S.Struct({
    ProviderName: S.optional(ConnectorProviderName),
    ConnectorStatus: S.optional(ConnectorStatus),
  }),
).annotations({
  identifier: "ProviderSummary",
}) as any as S.Schema<ProviderSummary>;
export type ConfigurationPolicyAssociationList =
  ConfigurationPolicyAssociationSummary[];
export const ConfigurationPolicyAssociationList = S.Array(
  ConfigurationPolicyAssociationSummary,
);
export interface UnprocessedConfigurationPolicyAssociation {
  ConfigurationPolicyAssociationIdentifiers?: ConfigurationPolicyAssociation;
  ErrorCode?: string;
  ErrorReason?: string;
}
export const UnprocessedConfigurationPolicyAssociation = S.suspend(() =>
  S.Struct({
    ConfigurationPolicyAssociationIdentifiers: S.optional(
      ConfigurationPolicyAssociation,
    ),
    ErrorCode: S.optional(S.String),
    ErrorReason: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedConfigurationPolicyAssociation",
}) as any as S.Schema<UnprocessedConfigurationPolicyAssociation>;
export type UnprocessedConfigurationPolicyAssociationList =
  UnprocessedConfigurationPolicyAssociation[];
export const UnprocessedConfigurationPolicyAssociationList = S.Array(
  UnprocessedConfigurationPolicyAssociation,
);
export interface StandardsControlAssociationDetail {
  StandardsArn?: string;
  SecurityControlId?: string;
  SecurityControlArn?: string;
  AssociationStatus?: AssociationStatus;
  RelatedRequirements?: string[];
  UpdatedAt?: Date;
  UpdatedReason?: string;
  StandardsControlTitle?: string;
  StandardsControlDescription?: string;
  StandardsControlArns?: string[];
}
export const StandardsControlAssociationDetail = S.suspend(() =>
  S.Struct({
    StandardsArn: S.optional(S.String),
    SecurityControlId: S.optional(S.String),
    SecurityControlArn: S.optional(S.String),
    AssociationStatus: S.optional(AssociationStatus),
    RelatedRequirements: S.optional(RelatedRequirementsList),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedReason: S.optional(S.String),
    StandardsControlTitle: S.optional(S.String),
    StandardsControlDescription: S.optional(S.String),
    StandardsControlArns: S.optional(StandardsControlArnList),
  }),
).annotations({
  identifier: "StandardsControlAssociationDetail",
}) as any as S.Schema<StandardsControlAssociationDetail>;
export type StandardsControlAssociationDetails =
  StandardsControlAssociationDetail[];
export const StandardsControlAssociationDetails = S.Array(
  StandardsControlAssociationDetail,
);
export interface UnprocessedStandardsControlAssociation {
  StandardsControlAssociationId?: StandardsControlAssociationId;
  ErrorCode?: UnprocessedErrorCode;
  ErrorReason?: string;
}
export const UnprocessedStandardsControlAssociation = S.suspend(() =>
  S.Struct({
    StandardsControlAssociationId: S.optional(StandardsControlAssociationId),
    ErrorCode: S.optional(UnprocessedErrorCode),
    ErrorReason: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedStandardsControlAssociation",
}) as any as S.Schema<UnprocessedStandardsControlAssociation>;
export type UnprocessedStandardsControlAssociations =
  UnprocessedStandardsControlAssociation[];
export const UnprocessedStandardsControlAssociations = S.Array(
  UnprocessedStandardsControlAssociation,
);
export interface BatchUpdateFindingsUnprocessedFinding {
  FindingIdentifier?: AwsSecurityFindingIdentifier;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const BatchUpdateFindingsUnprocessedFinding = S.suspend(() =>
  S.Struct({
    FindingIdentifier: S.optional(AwsSecurityFindingIdentifier),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchUpdateFindingsUnprocessedFinding",
}) as any as S.Schema<BatchUpdateFindingsUnprocessedFinding>;
export type BatchUpdateFindingsUnprocessedFindingsList =
  BatchUpdateFindingsUnprocessedFinding[];
export const BatchUpdateFindingsUnprocessedFindingsList = S.Array(
  BatchUpdateFindingsUnprocessedFinding,
);
export interface BatchUpdateFindingsV2ProcessedFinding {
  FindingIdentifier?: OcsfFindingIdentifier;
  MetadataUid?: string;
}
export const BatchUpdateFindingsV2ProcessedFinding = S.suspend(() =>
  S.Struct({
    FindingIdentifier: S.optional(OcsfFindingIdentifier),
    MetadataUid: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchUpdateFindingsV2ProcessedFinding",
}) as any as S.Schema<BatchUpdateFindingsV2ProcessedFinding>;
export type BatchUpdateFindingsV2ProcessedFindingsList =
  BatchUpdateFindingsV2ProcessedFinding[];
export const BatchUpdateFindingsV2ProcessedFindingsList = S.Array(
  BatchUpdateFindingsV2ProcessedFinding,
);
export interface BatchUpdateFindingsV2UnprocessedFinding {
  FindingIdentifier?: OcsfFindingIdentifier;
  MetadataUid?: string;
  ErrorCode?: BatchUpdateFindingsV2UnprocessedFindingErrorCode;
  ErrorMessage?: string;
}
export const BatchUpdateFindingsV2UnprocessedFinding = S.suspend(() =>
  S.Struct({
    FindingIdentifier: S.optional(OcsfFindingIdentifier),
    MetadataUid: S.optional(S.String),
    ErrorCode: S.optional(BatchUpdateFindingsV2UnprocessedFindingErrorCode),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchUpdateFindingsV2UnprocessedFinding",
}) as any as S.Schema<BatchUpdateFindingsV2UnprocessedFinding>;
export type BatchUpdateFindingsV2UnprocessedFindingsList =
  BatchUpdateFindingsV2UnprocessedFinding[];
export const BatchUpdateFindingsV2UnprocessedFindingsList = S.Array(
  BatchUpdateFindingsV2UnprocessedFinding,
);
export interface UnprocessedStandardsControlAssociationUpdate {
  StandardsControlAssociationUpdate?: StandardsControlAssociationUpdate;
  ErrorCode?: UnprocessedErrorCode;
  ErrorReason?: string;
}
export const UnprocessedStandardsControlAssociationUpdate = S.suspend(() =>
  S.Struct({
    StandardsControlAssociationUpdate: S.optional(
      StandardsControlAssociationUpdate,
    ),
    ErrorCode: S.optional(UnprocessedErrorCode),
    ErrorReason: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedStandardsControlAssociationUpdate",
}) as any as S.Schema<UnprocessedStandardsControlAssociationUpdate>;
export type UnprocessedStandardsControlAssociationUpdates =
  UnprocessedStandardsControlAssociationUpdate[];
export const UnprocessedStandardsControlAssociationUpdates = S.Array(
  UnprocessedStandardsControlAssociationUpdate,
);
export interface Standard {
  StandardsArn?: string;
  Name?: string;
  Description?: string;
  EnabledByDefault?: boolean;
  StandardsManagedBy?: StandardsManagedBy;
}
export const Standard = S.suspend(() =>
  S.Struct({
    StandardsArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    EnabledByDefault: S.optional(S.Boolean),
    StandardsManagedBy: S.optional(StandardsManagedBy),
  }),
).annotations({ identifier: "Standard" }) as any as S.Schema<Standard>;
export type Standards = Standard[];
export const Standards = S.Array(Standard);
export type ProviderDetail =
  | { JiraCloud: JiraCloudDetail; ServiceNow?: never }
  | { JiraCloud?: never; ServiceNow: ServiceNowDetail };
export const ProviderDetail = S.Union(
  S.Struct({ JiraCloud: JiraCloudDetail }),
  S.Struct({ ServiceNow: ServiceNowDetail }),
);
export interface FindingHistoryRecord {
  FindingIdentifier?: AwsSecurityFindingIdentifier;
  UpdateTime?: Date;
  FindingCreated?: boolean;
  UpdateSource?: FindingHistoryUpdateSource;
  Updates?: FindingHistoryUpdate[];
  NextToken?: string;
}
export const FindingHistoryRecord = S.suspend(() =>
  S.Struct({
    FindingIdentifier: S.optional(AwsSecurityFindingIdentifier),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    FindingCreated: S.optional(S.Boolean),
    UpdateSource: S.optional(FindingHistoryUpdateSource),
    Updates: S.optional(FindingHistoryUpdatesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "FindingHistoryRecord",
}) as any as S.Schema<FindingHistoryRecord>;
export type FindingHistoryRecordList = FindingHistoryRecord[];
export const FindingHistoryRecordList = S.Array(FindingHistoryRecord);
export interface FindingsTrendsFilters {
  CompositeFilters?: FindingsTrendsCompositeFilter[];
  CompositeOperator?: AllowedOperators;
}
export const FindingsTrendsFilters = S.suspend(() =>
  S.Struct({
    CompositeFilters: S.optional(FindingsTrendsCompositeFilterList),
    CompositeOperator: S.optional(AllowedOperators),
  }),
).annotations({
  identifier: "FindingsTrendsFilters",
}) as any as S.Schema<FindingsTrendsFilters>;
export interface InsightResults {
  InsightArn?: string;
  GroupByAttribute?: string;
  ResultValues?: InsightResultValue[];
}
export const InsightResults = S.suspend(() =>
  S.Struct({
    InsightArn: S.optional(S.String),
    GroupByAttribute: S.optional(S.String),
    ResultValues: S.optional(InsightResultValueList),
  }),
).annotations({
  identifier: "InsightResults",
}) as any as S.Schema<InsightResults>;
export interface ResourcesTrendsFilters {
  CompositeFilters?: ResourcesTrendsCompositeFilter[];
  CompositeOperator?: AllowedOperators;
}
export const ResourcesTrendsFilters = S.suspend(() =>
  S.Struct({
    CompositeFilters: S.optional(ResourcesTrendsCompositeFilterList),
    CompositeOperator: S.optional(AllowedOperators),
  }),
).annotations({
  identifier: "ResourcesTrendsFilters",
}) as any as S.Schema<ResourcesTrendsFilters>;
export interface AutomationRulesMetadataV2 {
  RuleArn?: string;
  RuleId?: string;
  RuleOrder?: number;
  RuleName?: string;
  RuleStatus?: RuleStatusV2;
  Description?: string;
  Actions?: AutomationRulesActionTypeObjectV2[];
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const AutomationRulesMetadataV2 = S.suspend(() =>
  S.Struct({
    RuleArn: S.optional(S.String),
    RuleId: S.optional(S.String),
    RuleOrder: S.optional(S.Number),
    RuleName: S.optional(S.String),
    RuleStatus: S.optional(RuleStatusV2),
    Description: S.optional(S.String),
    Actions: S.optional(AutomationRulesActionTypeListV2),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "AutomationRulesMetadataV2",
}) as any as S.Schema<AutomationRulesMetadataV2>;
export type AutomationRulesMetadataListV2 = AutomationRulesMetadataV2[];
export const AutomationRulesMetadataListV2 = S.Array(AutomationRulesMetadataV2);
export interface ConnectorSummary {
  ConnectorArn?: string;
  ConnectorId?: string;
  Name?: string;
  Description?: string;
  ProviderSummary?: ProviderSummary;
  CreatedAt?: Date;
}
export const ConnectorSummary = S.suspend(() =>
  S.Struct({
    ConnectorArn: S.optional(S.String),
    ConnectorId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ProviderSummary: S.optional(ProviderSummary),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ConnectorSummary",
}) as any as S.Schema<ConnectorSummary>;
export type ConnectorSummaryList = ConnectorSummary[];
export const ConnectorSummaryList = S.Array(ConnectorSummary);
export interface BatchDisableStandardsResponse {
  StandardsSubscriptions?: (StandardsSubscription & {
    StandardsSubscriptionArn: NonEmptyString;
    StandardsArn: NonEmptyString;
    StandardsInput: StandardsInputParameterMap;
    StandardsStatus: StandardsStatus;
    StandardsStatusReason: StandardsStatusReason & {
      StatusReasonCode: StatusReasonCode;
    };
  })[];
}
export const BatchDisableStandardsResponse = S.suspend(() =>
  S.Struct({ StandardsSubscriptions: S.optional(StandardsSubscriptions) }),
).annotations({
  identifier: "BatchDisableStandardsResponse",
}) as any as S.Schema<BatchDisableStandardsResponse>;
export interface BatchEnableStandardsResponse {
  StandardsSubscriptions?: (StandardsSubscription & {
    StandardsSubscriptionArn: NonEmptyString;
    StandardsArn: NonEmptyString;
    StandardsInput: StandardsInputParameterMap;
    StandardsStatus: StandardsStatus;
    StandardsStatusReason: StandardsStatusReason & {
      StatusReasonCode: StatusReasonCode;
    };
  })[];
}
export const BatchEnableStandardsResponse = S.suspend(() =>
  S.Struct({ StandardsSubscriptions: S.optional(StandardsSubscriptions) }),
).annotations({
  identifier: "BatchEnableStandardsResponse",
}) as any as S.Schema<BatchEnableStandardsResponse>;
export interface BatchGetConfigurationPolicyAssociationsResponse {
  ConfigurationPolicyAssociations?: ConfigurationPolicyAssociationSummary[];
  UnprocessedConfigurationPolicyAssociations?: UnprocessedConfigurationPolicyAssociation[];
}
export const BatchGetConfigurationPolicyAssociationsResponse = S.suspend(() =>
  S.Struct({
    ConfigurationPolicyAssociations: S.optional(
      ConfigurationPolicyAssociationList,
    ),
    UnprocessedConfigurationPolicyAssociations: S.optional(
      UnprocessedConfigurationPolicyAssociationList,
    ),
  }),
).annotations({
  identifier: "BatchGetConfigurationPolicyAssociationsResponse",
}) as any as S.Schema<BatchGetConfigurationPolicyAssociationsResponse>;
export interface BatchGetStandardsControlAssociationsResponse {
  StandardsControlAssociationDetails: (StandardsControlAssociationDetail & {
    StandardsArn: NonEmptyString;
    SecurityControlId: NonEmptyString;
    SecurityControlArn: NonEmptyString;
    AssociationStatus: AssociationStatus;
  })[];
  UnprocessedAssociations?: (UnprocessedStandardsControlAssociation & {
    StandardsControlAssociationId: StandardsControlAssociationId & {
      SecurityControlId: NonEmptyString;
      StandardsArn: NonEmptyString;
    };
    ErrorCode: UnprocessedErrorCode;
  })[];
}
export const BatchGetStandardsControlAssociationsResponse = S.suspend(() =>
  S.Struct({
    StandardsControlAssociationDetails: S.optional(
      StandardsControlAssociationDetails,
    ),
    UnprocessedAssociations: S.optional(
      UnprocessedStandardsControlAssociations,
    ),
  }),
).annotations({
  identifier: "BatchGetStandardsControlAssociationsResponse",
}) as any as S.Schema<BatchGetStandardsControlAssociationsResponse>;
export interface BatchUpdateFindingsResponse {
  ProcessedFindings: (AwsSecurityFindingIdentifier & {
    Id: NonEmptyString;
    ProductArn: NonEmptyString;
  })[];
  UnprocessedFindings: (BatchUpdateFindingsUnprocessedFinding & {
    FindingIdentifier: AwsSecurityFindingIdentifier & {
      Id: NonEmptyString;
      ProductArn: NonEmptyString;
    };
    ErrorCode: NonEmptyString;
    ErrorMessage: NonEmptyString;
  })[];
}
export const BatchUpdateFindingsResponse = S.suspend(() =>
  S.Struct({
    ProcessedFindings: S.optional(AwsSecurityFindingIdentifierList),
    UnprocessedFindings: S.optional(BatchUpdateFindingsUnprocessedFindingsList),
  }),
).annotations({
  identifier: "BatchUpdateFindingsResponse",
}) as any as S.Schema<BatchUpdateFindingsResponse>;
export interface BatchUpdateFindingsV2Response {
  ProcessedFindings: (BatchUpdateFindingsV2ProcessedFinding & {
    FindingIdentifier: OcsfFindingIdentifier & {
      CloudAccountUid: NonEmptyString;
      FindingInfoUid: NonEmptyString;
      MetadataProductUid: NonEmptyString;
    };
  })[];
  UnprocessedFindings: (BatchUpdateFindingsV2UnprocessedFinding & {
    FindingIdentifier: OcsfFindingIdentifier & {
      CloudAccountUid: NonEmptyString;
      FindingInfoUid: NonEmptyString;
      MetadataProductUid: NonEmptyString;
    };
  })[];
}
export const BatchUpdateFindingsV2Response = S.suspend(() =>
  S.Struct({
    ProcessedFindings: S.optional(BatchUpdateFindingsV2ProcessedFindingsList),
    UnprocessedFindings: S.optional(
      BatchUpdateFindingsV2UnprocessedFindingsList,
    ),
  }),
).annotations({
  identifier: "BatchUpdateFindingsV2Response",
}) as any as S.Schema<BatchUpdateFindingsV2Response>;
export interface BatchUpdateStandardsControlAssociationsResponse {
  UnprocessedAssociationUpdates?: (UnprocessedStandardsControlAssociationUpdate & {
    StandardsControlAssociationUpdate: StandardsControlAssociationUpdate & {
      StandardsArn: NonEmptyString;
      SecurityControlId: NonEmptyString;
      AssociationStatus: AssociationStatus;
    };
    ErrorCode: UnprocessedErrorCode;
  })[];
}
export const BatchUpdateStandardsControlAssociationsResponse = S.suspend(() =>
  S.Struct({
    UnprocessedAssociationUpdates: S.optional(
      UnprocessedStandardsControlAssociationUpdates,
    ),
  }),
).annotations({
  identifier: "BatchUpdateStandardsControlAssociationsResponse",
}) as any as S.Schema<BatchUpdateStandardsControlAssociationsResponse>;
export interface CreateAutomationRuleRequest {
  Tags?: { [key: string]: string | undefined };
  RuleStatus?: RuleStatus;
  RuleOrder?: number;
  RuleName?: string;
  Description?: string;
  IsTerminal?: boolean;
  Criteria?: AutomationRulesFindingFilters;
  Actions?: AutomationRulesAction[];
}
export const CreateAutomationRuleRequest = S.suspend(() =>
  S.Struct({
    Tags: S.optional(TagMap),
    RuleStatus: S.optional(RuleStatus),
    RuleOrder: S.optional(S.Number),
    RuleName: S.optional(S.String),
    Description: S.optional(S.String),
    IsTerminal: S.optional(S.Boolean),
    Criteria: S.optional(AutomationRulesFindingFilters),
    Actions: S.optional(ActionList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/automationrules/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAutomationRuleRequest",
}) as any as S.Schema<CreateAutomationRuleRequest>;
export interface CreateAutomationRuleV2Response {
  RuleArn?: string;
  RuleId?: string;
}
export const CreateAutomationRuleV2Response = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String), RuleId: S.optional(S.String) }),
).annotations({
  identifier: "CreateAutomationRuleV2Response",
}) as any as S.Schema<CreateAutomationRuleV2Response>;
export interface CreateConnectorV2Response {
  ConnectorArn: string;
  ConnectorId: string;
  AuthUrl?: string;
  ConnectorStatus?: ConnectorStatus;
}
export const CreateConnectorV2Response = S.suspend(() =>
  S.Struct({
    ConnectorArn: S.optional(S.String),
    ConnectorId: S.optional(S.String),
    AuthUrl: S.optional(S.String),
    ConnectorStatus: S.optional(ConnectorStatus),
  }),
).annotations({
  identifier: "CreateConnectorV2Response",
}) as any as S.Schema<CreateConnectorV2Response>;
export interface CreateInsightResponse {
  InsightArn: string;
}
export const CreateInsightResponse = S.suspend(() =>
  S.Struct({ InsightArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateInsightResponse",
}) as any as S.Schema<CreateInsightResponse>;
export interface DescribeStandardsResponse {
  Standards?: Standard[];
  NextToken?: string;
}
export const DescribeStandardsResponse = S.suspend(() =>
  S.Struct({
    Standards: S.optional(Standards),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeStandardsResponse",
}) as any as S.Schema<DescribeStandardsResponse>;
export interface GetConnectorV2Response {
  ConnectorArn?: string;
  ConnectorId: string;
  Name: string;
  Description?: string;
  KmsKeyArn?: string;
  CreatedAt: Date;
  LastUpdatedAt: Date;
  Health: HealthCheck & {
    ConnectorStatus: ConnectorStatus;
    LastCheckedAt: Date;
  };
  ProviderDetail: ProviderDetail;
}
export const GetConnectorV2Response = S.suspend(() =>
  S.Struct({
    ConnectorArn: S.optional(S.String),
    ConnectorId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Health: S.optional(HealthCheck),
    ProviderDetail: S.optional(ProviderDetail),
  }),
).annotations({
  identifier: "GetConnectorV2Response",
}) as any as S.Schema<GetConnectorV2Response>;
export interface GetFindingHistoryResponse {
  Records?: (FindingHistoryRecord & {
    FindingIdentifier: AwsSecurityFindingIdentifier & {
      Id: NonEmptyString;
      ProductArn: NonEmptyString;
    };
  })[];
  NextToken?: string;
}
export const GetFindingHistoryResponse = S.suspend(() =>
  S.Struct({
    Records: S.optional(FindingHistoryRecordList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetFindingHistoryResponse",
}) as any as S.Schema<GetFindingHistoryResponse>;
export interface GetFindingsTrendsV2Request {
  Filters?: FindingsTrendsFilters;
  StartTime?: Date;
  EndTime?: Date;
  NextToken?: string;
  MaxResults?: number;
}
export const GetFindingsTrendsV2Request = S.suspend(() =>
  S.Struct({
    Filters: S.optional(FindingsTrendsFilters),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findingsTrendsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingsTrendsV2Request",
}) as any as S.Schema<GetFindingsTrendsV2Request>;
export interface GetFindingsV2Request {
  Filters?: OcsfFindingFilters;
  SortCriteria?: SortCriterion[];
  NextToken?: string;
  MaxResults?: number;
}
export const GetFindingsV2Request = S.suspend(() =>
  S.Struct({
    Filters: S.optional(OcsfFindingFilters),
    SortCriteria: S.optional(SortCriteria),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findingsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingsV2Request",
}) as any as S.Schema<GetFindingsV2Request>;
export interface GetInsightResultsResponse {
  InsightResults: InsightResults & {
    InsightArn: NonEmptyString;
    GroupByAttribute: NonEmptyString;
    ResultValues: (InsightResultValue & {
      GroupByAttributeValue: NonEmptyString;
      Count: number;
    })[];
  };
}
export const GetInsightResultsResponse = S.suspend(() =>
  S.Struct({ InsightResults: S.optional(InsightResults) }),
).annotations({
  identifier: "GetInsightResultsResponse",
}) as any as S.Schema<GetInsightResultsResponse>;
export interface GetResourcesTrendsV2Request {
  Filters?: ResourcesTrendsFilters;
  StartTime?: Date;
  EndTime?: Date;
  NextToken?: string;
  MaxResults?: number;
}
export const GetResourcesTrendsV2Request = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ResourcesTrendsFilters),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resourcesTrendsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcesTrendsV2Request",
}) as any as S.Schema<GetResourcesTrendsV2Request>;
export interface GetResourcesV2Request {
  Filters?: ResourcesFilters;
  SortCriteria?: SortCriterion[];
  NextToken?: string;
  MaxResults?: number;
}
export const GetResourcesV2Request = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ResourcesFilters),
    SortCriteria: S.optional(SortCriteria),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resourcesv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcesV2Request",
}) as any as S.Schema<GetResourcesV2Request>;
export interface ListAutomationRulesV2Response {
  Rules?: AutomationRulesMetadataV2[];
  NextToken?: string;
}
export const ListAutomationRulesV2Response = S.suspend(() =>
  S.Struct({
    Rules: S.optional(AutomationRulesMetadataListV2),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomationRulesV2Response",
}) as any as S.Schema<ListAutomationRulesV2Response>;
export interface ListConnectorsV2Response {
  NextToken?: string;
  Connectors: (ConnectorSummary & {
    ConnectorId: NonEmptyString;
    Name: NonEmptyString;
    ProviderSummary: ProviderSummary;
    CreatedAt: Date;
  })[];
}
export const ListConnectorsV2Response = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Connectors: S.optional(ConnectorSummaryList),
  }),
).annotations({
  identifier: "ListConnectorsV2Response",
}) as any as S.Schema<ListConnectorsV2Response>;
export interface UpdateSecurityControlRequest {
  SecurityControlId?: string;
  Parameters?: { [key: string]: ParameterConfiguration | undefined };
  LastUpdateReason?: string;
}
export const UpdateSecurityControlRequest = S.suspend(() =>
  S.Struct({
    SecurityControlId: S.optional(S.String),
    Parameters: S.optional(Parameters),
    LastUpdateReason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/securityControl/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSecurityControlRequest",
}) as any as S.Schema<UpdateSecurityControlRequest>;
export interface UpdateSecurityControlResponse {}
export const UpdateSecurityControlResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateSecurityControlResponse",
}) as any as S.Schema<UpdateSecurityControlResponse>;
export type GranularityField = "Daily" | "Weekly" | "Monthly" | (string & {});
export const GranularityField = S.String;
export type OcsfFindingsList = any[];
export const OcsfFindingsList = S.Array(S.Any);
export interface CreateAutomationRuleResponse {
  RuleArn?: string;
}
export const CreateAutomationRuleResponse = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateAutomationRuleResponse",
}) as any as S.Schema<CreateAutomationRuleResponse>;
export interface CreateConfigurationPolicyRequest {
  Name?: string;
  Description?: string;
  ConfigurationPolicy?: Policy;
  Tags?: { [key: string]: string | undefined };
}
export const CreateConfigurationPolicyRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ConfigurationPolicy: S.optional(Policy),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configurationPolicy/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationPolicyRequest",
}) as any as S.Schema<CreateConfigurationPolicyRequest>;
export interface GetFindingStatisticsV2Response {
  GroupByResults?: GroupByResult[];
}
export const GetFindingStatisticsV2Response = S.suspend(() =>
  S.Struct({ GroupByResults: S.optional(GroupByResults) }),
).annotations({
  identifier: "GetFindingStatisticsV2Response",
}) as any as S.Schema<GetFindingStatisticsV2Response>;
export interface GetFindingsV2Response {
  Findings?: any[];
  NextToken?: string;
}
export const GetFindingsV2Response = S.suspend(() =>
  S.Struct({
    Findings: S.optional(OcsfFindingsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetFindingsV2Response",
}) as any as S.Schema<GetFindingsV2Response>;
export type ResourceCategory =
  | "Compute"
  | "Database"
  | "Storage"
  | "Code"
  | "AI/ML"
  | "Identity"
  | "Network"
  | "Other"
  | (string & {});
export const ResourceCategory = S.String;
export interface CreateConfigurationPolicyResponse {
  Arn?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  UpdatedAt?: Date;
  CreatedAt?: Date;
  ConfigurationPolicy?: Policy;
}
export const CreateConfigurationPolicyResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ConfigurationPolicy: S.optional(Policy),
  }),
).annotations({
  identifier: "CreateConfigurationPolicyResponse",
}) as any as S.Schema<CreateConfigurationPolicyResponse>;
export interface ResourceTag {
  Key?: string;
  Value?: string;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTagList = ResourceTag[];
export const ResourceTagList = S.Array(ResourceTag);
export interface SeverityTrendsCount {
  Unknown?: number;
  Informational?: number;
  Low?: number;
  Medium?: number;
  High?: number;
  Critical?: number;
  Fatal?: number;
  Other?: number;
}
export const SeverityTrendsCount = S.suspend(() =>
  S.Struct({
    Unknown: S.optional(S.Number),
    Informational: S.optional(S.Number),
    Low: S.optional(S.Number),
    Medium: S.optional(S.Number),
    High: S.optional(S.Number),
    Critical: S.optional(S.Number),
    Fatal: S.optional(S.Number),
    Other: S.optional(S.Number),
  }),
).annotations({
  identifier: "SeverityTrendsCount",
}) as any as S.Schema<SeverityTrendsCount>;
export interface ResourcesCount {
  AllResources?: number;
}
export const ResourcesCount = S.suspend(() =>
  S.Struct({ AllResources: S.optional(S.Number) }),
).annotations({
  identifier: "ResourcesCount",
}) as any as S.Schema<ResourcesCount>;
export interface ResourceSeverityBreakdown {
  Other?: number;
  Fatal?: number;
  Critical?: number;
  High?: number;
  Medium?: number;
  Low?: number;
  Informational?: number;
  Unknown?: number;
}
export const ResourceSeverityBreakdown = S.suspend(() =>
  S.Struct({
    Other: S.optional(S.Number),
    Fatal: S.optional(S.Number),
    Critical: S.optional(S.Number),
    High: S.optional(S.Number),
    Medium: S.optional(S.Number),
    Low: S.optional(S.Number),
    Informational: S.optional(S.Number),
    Unknown: S.optional(S.Number),
  }),
).annotations({
  identifier: "ResourceSeverityBreakdown",
}) as any as S.Schema<ResourceSeverityBreakdown>;
export interface GetSecurityControlDefinitionResponse {
  SecurityControlDefinition: SecurityControlDefinition & {
    SecurityControlId: NonEmptyString;
    Title: NonEmptyString;
    Description: NonEmptyString;
    RemediationUrl: NonEmptyString;
    SeverityRating: SeverityRating;
    CurrentRegionAvailability: RegionAvailabilityStatus;
    ParameterDefinitions: {
      [key: string]:
        | (ParameterDefinition & {
            Description: NonEmptyString;
            ConfigurationOptions: ConfigurationOptions;
          })
        | undefined;
    };
  };
}
export const GetSecurityControlDefinitionResponse = S.suspend(() =>
  S.Struct({
    SecurityControlDefinition: S.optional(SecurityControlDefinition),
  }),
).annotations({
  identifier: "GetSecurityControlDefinitionResponse",
}) as any as S.Schema<GetSecurityControlDefinitionResponse>;
export interface TrendsValues {
  SeverityTrends?: SeverityTrendsCount;
}
export const TrendsValues = S.suspend(() =>
  S.Struct({ SeverityTrends: S.optional(SeverityTrendsCount) }),
).annotations({ identifier: "TrendsValues" }) as any as S.Schema<TrendsValues>;
export interface ResourcesTrendsValues {
  ResourcesCount?: ResourcesCount;
}
export const ResourcesTrendsValues = S.suspend(() =>
  S.Struct({ ResourcesCount: S.optional(ResourcesCount) }),
).annotations({
  identifier: "ResourcesTrendsValues",
}) as any as S.Schema<ResourcesTrendsValues>;
export interface ResourceFindingsSummary {
  FindingType?: string;
  ProductName?: string;
  TotalFindings?: number;
  Severities?: ResourceSeverityBreakdown;
}
export const ResourceFindingsSummary = S.suspend(() =>
  S.Struct({
    FindingType: S.optional(S.String),
    ProductName: S.optional(S.String),
    TotalFindings: S.optional(S.Number),
    Severities: S.optional(ResourceSeverityBreakdown),
  }),
).annotations({
  identifier: "ResourceFindingsSummary",
}) as any as S.Schema<ResourceFindingsSummary>;
export type ResourceFindingsSummaryList = ResourceFindingsSummary[];
export const ResourceFindingsSummaryList = S.Array(ResourceFindingsSummary);
export interface TrendsMetricsResult {
  Timestamp?: Date;
  TrendsValues?: TrendsValues;
}
export const TrendsMetricsResult = S.suspend(() =>
  S.Struct({
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TrendsValues: S.optional(TrendsValues),
  }),
).annotations({
  identifier: "TrendsMetricsResult",
}) as any as S.Schema<TrendsMetricsResult>;
export type TrendsMetrics = TrendsMetricsResult[];
export const TrendsMetrics = S.Array(TrendsMetricsResult);
export interface ResourcesTrendsMetricsResult {
  Timestamp?: Date;
  TrendsValues?: ResourcesTrendsValues;
}
export const ResourcesTrendsMetricsResult = S.suspend(() =>
  S.Struct({
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TrendsValues: S.optional(ResourcesTrendsValues),
  }),
).annotations({
  identifier: "ResourcesTrendsMetricsResult",
}) as any as S.Schema<ResourcesTrendsMetricsResult>;
export type ResourcesTrendsMetrics = ResourcesTrendsMetricsResult[];
export const ResourcesTrendsMetrics = S.Array(ResourcesTrendsMetricsResult);
export interface ResourceResult {
  ResourceGuid?: string;
  ResourceId?: string;
  AccountId?: string;
  Region?: string;
  ResourceCategory?: ResourceCategory;
  ResourceType?: string;
  ResourceName?: string;
  ResourceCreationTimeDt?: string;
  ResourceDetailCaptureTimeDt?: string;
  FindingsSummary?: ResourceFindingsSummary[];
  ResourceTags?: ResourceTag[];
  ResourceConfig?: any;
}
export const ResourceResult = S.suspend(() =>
  S.Struct({
    ResourceGuid: S.optional(S.String),
    ResourceId: S.optional(S.String),
    AccountId: S.optional(S.String),
    Region: S.optional(S.String),
    ResourceCategory: S.optional(ResourceCategory),
    ResourceType: S.optional(S.String),
    ResourceName: S.optional(S.String),
    ResourceCreationTimeDt: S.optional(S.String),
    ResourceDetailCaptureTimeDt: S.optional(S.String),
    FindingsSummary: S.optional(ResourceFindingsSummaryList),
    ResourceTags: S.optional(ResourceTagList),
    ResourceConfig: S.optional(S.Any),
  }),
).annotations({
  identifier: "ResourceResult",
}) as any as S.Schema<ResourceResult>;
export type Resources = ResourceResult[];
export const Resources = S.Array(ResourceResult);
export interface GetFindingsTrendsV2Response {
  Granularity: GranularityField;
  TrendsMetrics: (TrendsMetricsResult & {
    Timestamp: Date;
    TrendsValues: TrendsValues & {
      SeverityTrends: SeverityTrendsCount & {
        Unknown: TrendsValueCount;
        Informational: TrendsValueCount;
        Low: TrendsValueCount;
        Medium: TrendsValueCount;
        High: TrendsValueCount;
        Critical: TrendsValueCount;
        Fatal: TrendsValueCount;
        Other: TrendsValueCount;
      };
    };
  })[];
  NextToken?: string;
}
export const GetFindingsTrendsV2Response = S.suspend(() =>
  S.Struct({
    Granularity: S.optional(GranularityField),
    TrendsMetrics: S.optional(TrendsMetrics),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetFindingsTrendsV2Response",
}) as any as S.Schema<GetFindingsTrendsV2Response>;
export interface GetResourcesTrendsV2Response {
  Granularity: GranularityField;
  TrendsMetrics: (ResourcesTrendsMetricsResult & {
    Timestamp: Date;
    TrendsValues: ResourcesTrendsValues & {
      ResourcesCount: ResourcesCount & { AllResources: TrendsValueCount };
    };
  })[];
  NextToken?: string;
}
export const GetResourcesTrendsV2Response = S.suspend(() =>
  S.Struct({
    Granularity: S.optional(GranularityField),
    TrendsMetrics: S.optional(ResourcesTrendsMetrics),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourcesTrendsV2Response",
}) as any as S.Schema<GetResourcesTrendsV2Response>;
export interface GetResourcesV2Response {
  Resources: (ResourceResult & {
    ResourceId: NonEmptyString;
    AccountId: NonEmptyString;
    Region: NonEmptyString;
    ResourceDetailCaptureTimeDt: NonEmptyString;
    ResourceConfig: ResourceConfig;
    FindingsSummary: (ResourceFindingsSummary & {
      FindingType: NonEmptyString;
      ProductName: NonEmptyString;
      TotalFindings: number;
    })[];
    ResourceTags: (ResourceTag & {
      Key: NonEmptyString;
      Value: NonEmptyString;
    })[];
  })[];
  NextToken?: string;
}
export const GetResourcesV2Response = S.suspend(() =>
  S.Struct({
    Resources: S.optional(Resources),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourcesV2Response",
}) as any as S.Schema<GetResourcesV2Response>;
export type BatchImportFindingsRequestFindingList = AwsSecurityFinding[];
export const BatchImportFindingsRequestFindingList =
  S.Array(AwsSecurityFinding);
export interface BatchImportFindingsRequest {
  Findings?: AwsSecurityFinding[];
}
export const BatchImportFindingsRequest = S.suspend(() =>
  S.Struct({
    Findings: S.optional(BatchImportFindingsRequestFindingList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findings/import" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchImportFindingsRequest",
}) as any as S.Schema<BatchImportFindingsRequest>;
export interface ImportFindingsError {
  Id?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const ImportFindingsError = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ImportFindingsError",
}) as any as S.Schema<ImportFindingsError>;
export type ImportFindingsErrorList = ImportFindingsError[];
export const ImportFindingsErrorList = S.Array(ImportFindingsError);
export interface BatchImportFindingsResponse {
  FailedCount: number;
  SuccessCount: number;
  FailedFindings?: (ImportFindingsError & {
    Id: NonEmptyString;
    ErrorCode: NonEmptyString;
    ErrorMessage: NonEmptyString;
  })[];
}
export const BatchImportFindingsResponse = S.suspend(() =>
  S.Struct({
    FailedCount: S.optional(S.Number),
    SuccessCount: S.optional(S.Number),
    FailedFindings: S.optional(ImportFindingsErrorList),
  }),
).annotations({
  identifier: "BatchImportFindingsResponse",
}) as any as S.Schema<BatchImportFindingsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidAccessException extends S.TaggedError<InvalidAccessException>()(
  "InvalidAccessException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of security standards controls.
 *
 * For each control, the results include information about whether it is currently enabled,
 * the severity, and a link to remediation information.
 *
 * This operation returns an empty list for standard subscriptions where `StandardsControlsUpdatable` has value `NOT_READY_FOR_UPDATES`.
 */
export const describeStandardsControls: {
  (
    input: DescribeStandardsControlsRequest,
  ): effect.Effect<
    DescribeStandardsControlsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeStandardsControlsRequest,
  ) => stream.Stream<
    DescribeStandardsControlsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeStandardsControlsRequest,
  ) => stream.Stream<
    StandardsControl,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeStandardsControlsRequest,
  output: DescribeStandardsControlsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Controls",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all findings-generating solutions (products) that you are subscribed to receive
 * findings from in Security Hub.
 */
export const listEnabledProductsForImport: {
  (
    input: ListEnabledProductsForImportRequest,
  ): effect.Effect<
    ListEnabledProductsForImportResponse,
    | InternalException
    | InvalidAccessException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnabledProductsForImportRequest,
  ) => stream.Stream<
    ListEnabledProductsForImportResponse,
    | InternalException
    | InvalidAccessException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnabledProductsForImportRequest,
  ) => stream.Stream<
    NonEmptyString,
    | InternalException
    | InvalidAccessException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnabledProductsForImportRequest,
  output: ListEnabledProductsForImportResponse,
  errors: [InternalException, InvalidAccessException, LimitExceededException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ProductSubscriptions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * If cross-Region aggregation is enabled, then `ListFindingAggregators` returns the Amazon Resource Name (ARN)
 * of the finding aggregator. You can run this operation from any Amazon Web Services Region.
 */
export const listFindingAggregators: {
  (
    input: ListFindingAggregatorsRequest,
  ): effect.Effect<
    ListFindingAggregatorsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFindingAggregatorsRequest,
  ) => stream.Stream<
    ListFindingAggregatorsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFindingAggregatorsRequest,
  ) => stream.Stream<
    FindingAggregator,
    | AccessDeniedException
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFindingAggregatorsRequest,
  output: ListFindingAggregatorsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "FindingAggregators",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the Security Hub administrator accounts. Can only be called by the organization
 * management account.
 */
export const listOrganizationAdminAccounts: {
  (
    input: ListOrganizationAdminAccountsRequest,
  ): effect.Effect<
    ListOrganizationAdminAccountsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationAdminAccountsRequest,
  ) => stream.Stream<
    ListOrganizationAdminAccountsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationAdminAccountsRequest,
  ) => stream.Stream<
    AdminAccount,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOrganizationAdminAccountsRequest,
  output: ListOrganizationAdminAccountsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AdminAccounts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Specifies whether a control is currently enabled or disabled in each enabled standard in the calling account.
 *
 * This operation omits standards control associations for standard subscriptions where `StandardsControlsUpdatable` has value `NOT_READY_FOR_UPDATES`.
 */
export const listStandardsControlAssociations: {
  (
    input: ListStandardsControlAssociationsRequest,
  ): effect.Effect<
    ListStandardsControlAssociationsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStandardsControlAssociationsRequest,
  ) => stream.Stream<
    ListStandardsControlAssociationsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStandardsControlAssociationsRequest,
  ) => stream.Stream<
    StandardsControlAssociationSummary,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStandardsControlAssociationsRequest,
  output: ListStandardsControlAssociationsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StandardsControlAssociationSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds one or more tags to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InternalException, InvalidInputException, ResourceNotFoundException],
}));
/**
 * Updates the name and description of a custom action target in Security Hub.
 */
export const updateActionTarget: (
  input: UpdateActionTargetRequest,
) => effect.Effect<
  UpdateActionTargetResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateActionTargetRequest,
  output: UpdateActionTargetResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Used to control whether an individual security standard control is enabled or
 * disabled.
 *
 * Calls to this operation return a `RESOURCE_NOT_FOUND_EXCEPTION` error when the standard subscription for the control has `StandardsControlsUpdatable` value `NOT_READY_FOR_UPDATES`.
 */
export const updateStandardsControl: (
  input: UpdateStandardsControlRequest,
) => effect.Effect<
  UpdateStandardsControlResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStandardsControlRequest,
  output: UpdateStandardsControlResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a custom action target from Security Hub.
 *
 * Deleting a custom action target does not affect any findings or insights that were
 * already sent to Amazon CloudWatch Events using the custom action.
 */
export const deleteActionTarget: (
  input: DeleteActionTargetRequest,
) => effect.Effect<
  DeleteActionTargetResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteActionTargetRequest,
  output: DeleteActionTargetResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes one or more tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalException, InvalidInputException, ResourceNotFoundException],
}));
/**
 * Returns a list of tags associated with a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InternalException, InvalidInputException, ResourceNotFoundException],
}));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Declines invitations to become a Security Hub member account.
 *
 * A prospective member account uses this operation to decline an invitation to become a member.
 *
 * Only member accounts that aren't part of an Amazon Web Services organization should use this operation.
 * Organization accounts don't receive invitations.
 */
export const declineInvitations: (
  input: DeclineInvitationsRequest,
) => effect.Effect<
  DeclineInvitationsResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeclineInvitationsRequest,
  output: DeclineInvitationsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of the custom action targets in Security Hub in your account.
 */
export const describeActionTargets: {
  (
    input: DescribeActionTargetsRequest,
  ): effect.Effect<
    DescribeActionTargetsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeActionTargetsRequest,
  ) => stream.Stream<
    DescribeActionTargetsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeActionTargetsRequest,
  ) => stream.Stream<
    ActionTarget,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeActionTargetsRequest,
  output: DescribeActionTargetsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ActionTargets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The *aggregation Region* is now called the *home Region*.
 *
 * Updates cross-Region aggregation settings. You can use this operation to update the Region linking mode and the list
 * of included or excluded Amazon Web Services Regions. However, you can't use this operation to change the home Region.
 *
 * You can invoke this operation from the current home Region only.
 */
export const updateFindingAggregator: (
  input: UpdateFindingAggregatorRequest,
) => effect.Effect<
  UpdateFindingAggregatorResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFindingAggregatorRequest,
  output: UpdateFindingAggregatorResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates the specified member accounts from the associated administrator account.
 *
 * Can be used to disassociate both accounts that are managed using Organizations and accounts that
 * were invited manually.
 */
export const disassociateMembers: (
  input: DisassociateMembersRequest,
) => effect.Effect<
  DisassociateMembersResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMembersRequest,
  output: DisassociateMembersResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Returns the count of all Security Hub membership invitations that were sent to the
 * calling member account, not including the currently accepted invitation.
 */
export const getInvitationsCount: (
  input: GetInvitationsCountRequest,
) => effect.Effect<
  GetInvitationsCountResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvitationsCountRequest,
  output: GetInvitationsCountResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * This method is deprecated. Instead, use `GetAdministratorAccount`.
 *
 * The Security Hub console continues to use `GetMasterAccount`. It will eventually change to use `GetAdministratorAccount`. Any IAM policies that specifically control access to this function must continue to use `GetMasterAccount`. You should also add `GetAdministratorAccount` to your policies to ensure that the correct permissions are in place after the console begins to use `GetAdministratorAccount`.
 *
 * Provides the details for the Security Hub administrator account for the current member account.
 *
 * Can be used by both member accounts that are managed using Organizations and accounts that were
 * invited manually.
 */
export const getMasterAccount: (
  input: GetMasterAccountRequest,
) => effect.Effect<
  GetMasterAccountResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMasterAccountRequest,
  output: GetMasterAccountResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates a target account, organizational unit, or the root from a specified configuration. When you
 * disassociate a configuration from its target, the target inherits the configuration of the closest parent. If there’s no
 * configuration to inherit, the target retains its settings but becomes a self-managed account. A target can be disassociated from
 * a configuration policy or self-managed behavior. Only the Security Hub delegated administrator can invoke this
 * operation from the home Region.
 */
export const startConfigurationPolicyDisassociation: (
  input: StartConfigurationPolicyDisassociationRequest,
) => effect.Effect<
  StartConfigurationPolicyDisassociationResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartConfigurationPolicyDisassociationRequest,
  output: StartConfigurationPolicyDisassociationResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * `UpdateFindings` is a deprecated operation. Instead of `UpdateFindings`, use
 * the `BatchUpdateFindings` operation.
 *
 * The `UpdateFindings` operation updates the `Note` and `RecordState` of the Security Hub aggregated
 * findings that the filter attributes specify. Any member account that can view the finding
 * can also see the update to the finding.
 *
 * Finding updates made with `UpdateFindings` aren't persisted if the same finding is later updated by the
 * finding provider through the `BatchImportFindings` operation. In addition, Security Hub doesn't
 * record updates made with `UpdateFindings` in the finding history.
 */
export const updateFindings: (
  input: UpdateFindingsRequest,
) => effect.Effect<
  UpdateFindingsResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFindingsRequest,
  output: UpdateFindingsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the Security Hub insight identified by the specified insight ARN.
 */
export const updateInsight: (
  input: UpdateInsightRequest,
) => effect.Effect<
  UpdateInsightResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInsightRequest,
  output: UpdateInsightResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates configuration options for Security Hub.
 */
export const updateSecurityHubConfiguration: (
  input: UpdateSecurityHubConfigurationRequest,
) => effect.Effect<
  UpdateSecurityHubConfigurationResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSecurityHubConfigurationRequest,
  output: UpdateSecurityHubConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * The *aggregation Region* is now called the *home Region*.
 *
 * Deletes a finding aggregator. When you delete the finding aggregator, you stop cross-Region aggregation. Finding replication stops
 * occurring from the linked Regions to the home Region.
 *
 * When you stop cross-Region aggregation, findings that were already replicated and sent to the home Region are still visible from
 * the home Region. However, new findings and finding updates are no longer replicated and sent to the home Region.
 */
export const deleteFindingAggregator: (
  input: DeleteFindingAggregatorRequest,
) => effect.Effect<
  DeleteFindingAggregatorResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFindingAggregatorRequest,
  output: DeleteFindingAggregatorResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disables a Security Hub administrator account. Can only be called by the organization
 * management account.
 */
export const disableOrganizationAdminAccount: (
  input: DisableOrganizationAdminAccountRequest,
) => effect.Effect<
  DisableOrganizationAdminAccountResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableOrganizationAdminAccountRequest,
  output: DisableOrganizationAdminAccountResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * This method is deprecated. Instead, use `DisassociateFromAdministratorAccount`.
 *
 * The Security Hub console continues to use `DisassociateFromMasterAccount`. It will eventually change to use `DisassociateFromAdministratorAccount`. Any IAM policies that specifically control access to this function must continue to use `DisassociateFromMasterAccount`. You should also add `DisassociateFromAdministratorAccount` to your policies to ensure that the correct permissions are in place after the console begins to use `DisassociateFromAdministratorAccount`.
 *
 * Disassociates the current Security Hub member account from the associated administrator
 * account.
 *
 * This operation is only used by accounts that are not part of an organization. For
 * organization accounts, only the administrator account can
 * disassociate a member account.
 */
export const disassociateFromMasterAccount: (
  input: DisassociateFromMasterAccountRequest,
) => effect.Effect<
  DisassociateFromMasterAccountResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFromMasterAccountRequest,
  output: DisassociateFromMasterAccountResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Accepts the invitation to be a member account and be monitored by the Security Hub administrator
 * account that the invitation was sent from.
 *
 * This operation is only used by member accounts that are not added through
 * Organizations.
 *
 * When the member account accepts the invitation, permission is granted to the administrator
 * account to view findings generated in the member account.
 */
export const acceptAdministratorInvitation: (
  input: AcceptAdministratorInvitationRequest,
) => effect.Effect<
  AcceptAdministratorInvitationResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptAdministratorInvitationRequest,
  output: AcceptAdministratorInvitationResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * This method is deprecated. Instead, use `AcceptAdministratorInvitation`.
 *
 * The Security Hub console continues to use `AcceptInvitation`. It will eventually change to use `AcceptAdministratorInvitation`. Any IAM policies that specifically control access to this function must continue to use `AcceptInvitation`. You should also add `AcceptAdministratorInvitation` to your policies to ensure that the correct permissions are in place after the console begins to use `AcceptAdministratorInvitation`.
 *
 * Accepts the invitation to be a member account and be monitored by the Security Hub administrator
 * account that the invitation was sent from.
 *
 * This operation is only used by member accounts that are not added through
 * Organizations.
 *
 * When the member account accepts the invitation, permission is granted to the administrator
 * account to view findings generated in the member account.
 */
export const acceptInvitation: (
  input: AcceptInvitationRequest,
) => effect.Effect<
  AcceptInvitationResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptInvitationRequest,
  output: AcceptInvitationResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disables the integration of the specified product with Security Hub. After the integration is
 * disabled, findings from that product are no longer sent to Security Hub.
 */
export const disableImportFindingsForProduct: (
  input: DisableImportFindingsForProductRequest,
) => effect.Effect<
  DisableImportFindingsForProductResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableImportFindingsForProductRequest,
  output: DisableImportFindingsForProductResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disables Security Hub in your account only in the current Amazon Web Services Region. To disable Security Hub in all
 * Regions, you must submit one request per Region where you have enabled Security Hub.
 *
 * You can't disable Security Hub in an account that is currently the Security Hub administrator.
 *
 * When you disable Security Hub, your existing findings and insights and any Security Hub configuration
 * settings are deleted after 90 days and cannot be recovered. Any standards that were enabled
 * are disabled, and your administrator and member account associations are removed.
 *
 * If you want to save your existing findings, you must export them before you disable
 * Security Hub.
 */
export const disableSecurityHub: (
  input: DisableSecurityHubRequest,
) => effect.Effect<
  DisableSecurityHubResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableSecurityHubRequest,
  output: DisableSecurityHubResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * The *aggregation Region* is now called the *home Region*.
 *
 * Used to enable cross-Region aggregation. This operation can be invoked from the home Region only.
 *
 * For information about how cross-Region aggregation works, see Understanding cross-Region aggregation in Security Hub in the *Security Hub User Guide*.
 */
export const createFindingAggregator: (
  input: CreateFindingAggregatorRequest,
) => effect.Effect<
  CreateFindingAggregatorResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFindingAggregatorRequest,
  output: CreateFindingAggregatorResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Deletes the insight specified by the `InsightArn`.
 */
export const deleteInsight: (
  input: DeleteInsightRequest,
) => effect.Effect<
  DeleteInsightResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInsightRequest,
  output: DeleteInsightResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Deletes invitations to become a Security Hub member account.
 *
 * A Security Hub administrator account can use this operation to delete invitations sent to one or more prospective member accounts.
 *
 * This operation is only used to delete invitations that are sent to prospective member accounts that aren't part of an Amazon Web Services organization.
 * Organization accounts don't receive invitations.
 */
export const deleteInvitations: (
  input: DeleteInvitationsRequest,
) => effect.Effect<
  DeleteInvitationsResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInvitationsRequest,
  output: DeleteInvitationsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified member accounts from Security Hub.
 *
 * You can invoke this API only to delete accounts that became members through invitation. You can't invoke this
 * API to delete accounts that belong to an Organizations organization.
 */
export const deleteMembers: (
  input: DeleteMembersRequest,
) => effect.Effect<
  DeleteMembersResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMembersRequest,
  output: DeleteMembersResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns details about the Hub resource in your account, including the
 * `HubArn` and the time when you enabled Security Hub.
 */
export const describeHub: (
  input: DescribeHubRequest,
) => effect.Effect<
  DescribeHubResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHubRequest,
  output: DescribeHubResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about the way your organization is configured in Security Hub. Only the
 * Security Hub administrator account can invoke this operation.
 */
export const describeOrganizationConfiguration: (
  input: DescribeOrganizationConfigurationRequest,
) => effect.Effect<
  DescribeOrganizationConfigurationResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOrganizationConfigurationRequest,
  output: DescribeOrganizationConfigurationResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Disassociates the current Security Hub member account from the associated administrator
 * account.
 *
 * This operation is only used by accounts that are not part of an organization. For
 * organization accounts, only the administrator account can
 * disassociate a member account.
 */
export const disassociateFromAdministratorAccount: (
  input: DisassociateFromAdministratorAccountRequest,
) => effect.Effect<
  DisassociateFromAdministratorAccountResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFromAdministratorAccountRequest,
  output: DisassociateFromAdministratorAccountResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Designates the Security Hub administrator account for an organization. Can only be called by
 * the organization management account.
 */
export const enableOrganizationAdminAccount: (
  input: EnableOrganizationAdminAccountRequest,
) => effect.Effect<
  EnableOrganizationAdminAccountResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableOrganizationAdminAccountRequest,
  output: EnableOrganizationAdminAccountResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Provides the details for the Security Hub administrator account for the current member account.
 *
 * Can be used by both member accounts that are managed using Organizations and accounts that were
 * invited manually.
 */
export const getAdministratorAccount: (
  input: GetAdministratorAccountRequest,
) => effect.Effect<
  GetAdministratorAccountResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAdministratorAccountRequest,
  output: GetAdministratorAccountResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Provides information about a configuration policy. Only the Security Hub delegated administrator can invoke
 * this operation from the home Region.
 */
export const getConfigurationPolicy: (
  input: GetConfigurationPolicyRequest,
) => effect.Effect<
  GetConfigurationPolicyResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationPolicyRequest,
  output: GetConfigurationPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of the standards that are currently enabled.
 */
export const getEnabledStandards: {
  (
    input: GetEnabledStandardsRequest,
  ): effect.Effect<
    GetEnabledStandardsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetEnabledStandardsRequest,
  ) => stream.Stream<
    GetEnabledStandardsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetEnabledStandardsRequest,
  ) => stream.Stream<
    StandardsSubscription,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetEnabledStandardsRequest,
  output: GetEnabledStandardsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StandardsSubscriptions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The *aggregation Region* is now called the *home Region*.
 *
 * Returns the current configuration in the calling account for cross-Region aggregation. A finding aggregator is a resource that establishes
 * the home Region and any linked Regions.
 */
export const getFindingAggregator: (
  input: GetFindingAggregatorRequest,
) => effect.Effect<
  GetFindingAggregatorResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingAggregatorRequest,
  output: GetFindingAggregatorResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Invites other Amazon Web Services accounts to become member accounts for the Security Hub administrator account that
 * the invitation is sent from.
 *
 * This operation is only used to invite accounts that don't belong to an Amazon Web Services organization.
 * Organization accounts don't receive invitations.
 *
 * Before you can use this action to invite a member, you must first use the `CreateMembers` action to create the member account in Security Hub.
 *
 * When the account owner enables Security Hub and accepts the invitation to become a member
 * account, the administrator account can view the findings generated in the member account.
 */
export const inviteMembers: (
  input: InviteMembersRequest,
) => effect.Effect<
  InviteMembersResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InviteMembersRequest,
  output: InviteMembersResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Lists all Security Hub membership invitations that were sent to the calling account.
 *
 * Only accounts that are managed by invitation can use this operation.
 * Accounts that are managed using the integration with Organizations don't receive invitations.
 */
export const listInvitations: {
  (
    input: ListInvitationsRequest,
  ): effect.Effect<
    ListInvitationsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvitationsRequest,
  ) => stream.Stream<
    ListInvitationsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvitationsRequest,
  ) => stream.Stream<
    Invitation,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInvitationsRequest,
  output: ListInvitationsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Invitations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists details about all member accounts for the current Security Hub administrator
 * account.
 *
 * The results include both member accounts that belong to an organization and member
 * accounts that were invited manually.
 */
export const listMembers: {
  (
    input: ListMembersRequest,
  ): effect.Effect<
    ListMembersResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMembersRequest,
  ) => stream.Stream<
    ListMembersResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMembersRequest,
  ) => stream.Stream<
    Member,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMembersRequest,
  output: ListMembersResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Members",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all of the security controls that apply to a specified standard.
 */
export const listSecurityControlDefinitions: {
  (
    input: ListSecurityControlDefinitionsRequest,
  ): effect.Effect<
    ListSecurityControlDefinitionsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityControlDefinitionsRequest,
  ) => stream.Stream<
    ListSecurityControlDefinitionsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityControlDefinitionsRequest,
  ) => stream.Stream<
    SecurityControlDefinition,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSecurityControlDefinitionsRequest,
  output: ListSecurityControlDefinitionsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SecurityControlDefinitions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Associates a target account, organizational unit, or the root with a specified configuration. The target can be
 * associated with a configuration policy or self-managed behavior. Only the Security Hub delegated administrator can
 * invoke this operation from the home Region.
 */
export const startConfigurationPolicyAssociation: (
  input: StartConfigurationPolicyAssociationRequest,
) => effect.Effect<
  StartConfigurationPolicyAssociationResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartConfigurationPolicyAssociationRequest,
  output: StartConfigurationPolicyAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes one or more automation rules.
 */
export const batchDeleteAutomationRules: (
  input: BatchDeleteAutomationRulesRequest,
) => effect.Effect<
  BatchDeleteAutomationRulesResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteAutomationRulesRequest,
  output: BatchDeleteAutomationRulesResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves a list of details for automation rules based on rule Amazon Resource Names
 * (ARNs).
 */
export const batchGetAutomationRules: (
  input: BatchGetAutomationRulesRequest,
) => effect.Effect<
  BatchGetAutomationRulesResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetAutomationRulesRequest,
  output: BatchGetAutomationRulesResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Provides details about a batch of security controls for the current Amazon Web Services account and Amazon Web Services Region.
 */
export const batchGetSecurityControls: (
  input: BatchGetSecurityControlsRequest,
) => effect.Effect<
  BatchGetSecurityControlsResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetSecurityControlsRequest,
  output: BatchGetSecurityControlsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Updates one or more automation rules based on rule Amazon Resource Names (ARNs)
 * and input parameters.
 */
export const batchUpdateAutomationRules: (
  input: BatchUpdateAutomationRulesRequest,
) => effect.Effect<
  BatchUpdateAutomationRulesResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateAutomationRulesRequest,
  output: BatchUpdateAutomationRulesResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about product integrations in Security Hub.
 *
 * You can optionally provide an integration ARN. If you provide an integration ARN, then
 * the results only include that integration.
 *
 * If you don't provide an integration ARN, then the results include all of the available
 * product integrations.
 */
export const describeProducts: {
  (
    input: DescribeProductsRequest,
  ): effect.Effect<
    DescribeProductsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeProductsRequest,
  ) => stream.Stream<
    DescribeProductsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeProductsRequest,
  ) => stream.Stream<
    Product,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeProductsRequest,
  output: DescribeProductsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Products",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the association between a configuration and a target account, organizational unit, or the root. The
 * configuration can be a configuration policy or self-managed behavior. Only the Security Hub delegated administrator can
 * invoke this operation from the home Region.
 */
export const getConfigurationPolicyAssociation: (
  input: GetConfigurationPolicyAssociationRequest,
) => effect.Effect<
  GetConfigurationPolicyAssociationResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationPolicyAssociationRequest,
  output: GetConfigurationPolicyAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of findings that match the specified criteria.
 *
 * If cross-Region aggregation is enabled, then when you call `GetFindings` from the home Region, the results include all of the matching findings from both the home Region and linked Regions.
 */
export const getFindings: {
  (
    input: GetFindingsRequest,
  ): effect.Effect<
    GetFindingsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetFindingsRequest,
  ) => stream.Stream<
    GetFindingsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetFindingsRequest,
  ) => stream.Stream<
    AwsSecurityFinding,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetFindingsRequest,
  output: GetFindingsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Findings",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists and describes insights for the specified insight ARNs.
 */
export const getInsights: {
  (
    input: GetInsightsRequest,
  ): effect.Effect<
    GetInsightsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetInsightsRequest,
  ) => stream.Stream<
    GetInsightsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetInsightsRequest,
  ) => stream.Stream<
    Insight,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetInsightsRequest,
  output: GetInsightsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Insights",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the details for the Security Hub member accounts for the specified account IDs.
 *
 * An administrator account can be either the delegated Security Hub administrator account for an
 * organization or an administrator account that enabled Security Hub manually.
 *
 * The results include both member accounts that are managed using Organizations and accounts that
 * were invited manually.
 */
export const getMembers: (
  input: GetMembersRequest,
) => effect.Effect<
  GetMembersResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMembersRequest,
  output: GetMembersResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * A list of automation rules and their metadata for the calling account.
 */
export const listAutomationRules: (
  input: ListAutomationRulesRequest,
) => effect.Effect<
  ListAutomationRulesResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAutomationRulesRequest,
  output: ListAutomationRulesResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Lists the configuration policies that the Security Hub delegated administrator has created for your
 * organization. Only the delegated administrator can invoke this operation from the home Region.
 */
export const listConfigurationPolicies: {
  (
    input: ListConfigurationPoliciesRequest,
  ): effect.Effect<
    ListConfigurationPoliciesResponse,
    | AccessDeniedException
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationPoliciesRequest,
  ) => stream.Stream<
    ListConfigurationPoliciesResponse,
    | AccessDeniedException
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationPoliciesRequest,
  ) => stream.Stream<
    ConfigurationPolicySummary,
    | AccessDeniedException
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationPoliciesRequest,
  output: ListConfigurationPoliciesResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfigurationPolicySummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides information about the associations for your configuration policies and self-managed behavior. Only the
 * Security Hub delegated administrator can invoke this operation from the home Region.
 */
export const listConfigurationPolicyAssociations: {
  (
    input: ListConfigurationPolicyAssociationsRequest,
  ): effect.Effect<
    ListConfigurationPolicyAssociationsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationPolicyAssociationsRequest,
  ) => stream.Stream<
    ListConfigurationPolicyAssociationsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationPolicyAssociationsRequest,
  ) => stream.Stream<
    ConfigurationPolicyAssociationSummary,
    | AccessDeniedException
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationPolicyAssociationsRequest,
  output: ListConfigurationPolicyAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfigurationPolicyAssociationSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Disables the standards specified by the provided
 * `StandardsSubscriptionArns`.
 *
 * For more information, see Security Standards section of the Security Hub User
 * Guide.
 */
export const batchDisableStandards: (
  input: BatchDisableStandardsRequest,
) => effect.Effect<
  BatchDisableStandardsResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDisableStandardsRequest,
  output: BatchDisableStandardsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Enables the standards specified by the provided `StandardsArn`. To obtain the
 * ARN for a standard, use the `DescribeStandards`
 * operation.
 *
 * For more information, see the Security Standards
 * section of the *Security Hub User Guide*.
 */
export const batchEnableStandards: (
  input: BatchEnableStandardsRequest,
) => effect.Effect<
  BatchEnableStandardsResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchEnableStandardsRequest,
  output: BatchEnableStandardsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Returns associations between an Security Hub configuration and a batch of target accounts, organizational units, or the root.
 * Only the Security Hub delegated administrator can invoke this operation from the home Region. A configuration
 * can refer to a configuration policy or to a self-managed configuration.
 */
export const batchGetConfigurationPolicyAssociations: (
  input: BatchGetConfigurationPolicyAssociationsRequest,
) => effect.Effect<
  BatchGetConfigurationPolicyAssociationsResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetConfigurationPolicyAssociationsRequest,
  output: BatchGetConfigurationPolicyAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * For a batch of security controls and standards, identifies whether each control is currently enabled or disabled in a standard.
 *
 * Calls to this operation return a `RESOURCE_NOT_FOUND_EXCEPTION` error when the standard subscription for the association has a `NOT_READY_FOR_UPDATES` value for `StandardsControlsUpdatable`.
 */
export const batchGetStandardsControlAssociations: (
  input: BatchGetStandardsControlAssociationsRequest,
) => effect.Effect<
  BatchGetStandardsControlAssociationsResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetStandardsControlAssociationsRequest,
  output: BatchGetStandardsControlAssociationsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Used by Security Hub customers to update information about their investigation into one or more findings.
 * Requested by administrator accounts or member accounts.
 * Administrator accounts can update findings for their account and their member accounts.
 * A member account can update findings only for their own account.
 * Administrator and member accounts can use this operation to update the following fields and objects for one or more findings:
 *
 * - `Confidence`
 *
 * - `Criticality`
 *
 * - `Note`
 *
 * - `RelatedFindings`
 *
 * - `Severity`
 *
 * - `Types`
 *
 * - `UserDefinedFields`
 *
 * - `VerificationState`
 *
 * - `Workflow`
 *
 * If you use this operation to update a finding, your updates don’t affect the value for the `UpdatedAt` field of the finding.
 * Also note that it can take several minutes for Security Hub to process your request and update each finding specified in the request.
 *
 * You can configure IAM policies to restrict access to fields and field values.
 * For example, you might not want member accounts to be able to suppress findings or change the finding severity.
 * For more information see Configuring access to BatchUpdateFindings in the *Security Hub User Guide*.
 */
export const batchUpdateFindings: (
  input: BatchUpdateFindingsRequest,
) => effect.Effect<
  BatchUpdateFindingsResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateFindingsRequest,
  output: BatchUpdateFindingsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * For a batch of security controls and standards, this operation updates the enablement status of a control in a standard.
 */
export const batchUpdateStandardsControlAssociations: (
  input: BatchUpdateStandardsControlAssociationsRequest,
) => effect.Effect<
  BatchUpdateStandardsControlAssociationsResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateStandardsControlAssociationsRequest,
  output: BatchUpdateStandardsControlAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Returns a list of the available standards in Security Hub.
 *
 * For each standard, the results include the standard ARN, the name, and a description.
 */
export const describeStandards: {
  (
    input: DescribeStandardsRequest,
  ): effect.Effect<
    DescribeStandardsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeStandardsRequest,
  ) => stream.Stream<
    DescribeStandardsResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeStandardsRequest,
  ) => stream.Stream<
    Standard,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeStandardsRequest,
  output: DescribeStandardsResponse,
  errors: [InternalException, InvalidAccessException, InvalidInputException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Standards",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Enables the service in account for the current Amazon Web Services Region or specified Amazon Web Services Region.
 */
export const enableSecurityHubV2: (
  input: EnableSecurityHubV2Request,
) => effect.Effect<
  EnableSecurityHubV2Response,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableSecurityHubV2Request,
  output: EnableSecurityHubV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Grants permission to retrieve details for a connectorV2 based on connector id.
 */
export const getConnectorV2: (
  input: GetConnectorV2Request,
) => effect.Effect<
  GetConnectorV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectorV2Request,
  output: GetConnectorV2Response,
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
 * Returns the history of a Security Hub finding. The history includes changes made to any fields in
 * the Amazon Web Services Security Finding Format (ASFF) except top-level timestamp fields, such as the `CreatedAt` and
 * `UpdatedAt` fields.
 *
 * This operation might return fewer results than the maximum number of results (`MaxResults`) specified in a request, even
 * when more results are available. If this occurs, the response includes a `NextToken` value, which you should use to retrieve
 * the next set of results in the response. The presence of a `NextToken` value in a response doesn't necessarily indicate
 * that the results are incomplete. However, you should continue to specify a `NextToken` value until you receive a
 * response that doesn't include this value.
 */
export const getFindingHistory: {
  (
    input: GetFindingHistoryRequest,
  ): effect.Effect<
    GetFindingHistoryResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetFindingHistoryRequest,
  ) => stream.Stream<
    GetFindingHistoryResponse,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetFindingHistoryRequest,
  ) => stream.Stream<
    FindingHistoryRecord,
    | InternalException
    | InvalidAccessException
    | InvalidInputException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetFindingHistoryRequest,
  output: GetFindingHistoryResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Records",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the results of the Security Hub insight specified by the insight ARN.
 */
export const getInsightResults: (
  input: GetInsightResultsRequest,
) => effect.Effect<
  GetInsightResultsResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightResultsRequest,
  output: GetInsightResultsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of automation rules and metadata for the calling account.
 */
export const listAutomationRulesV2: (
  input: ListAutomationRulesV2Request,
) => effect.Effect<
  ListAutomationRulesV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAutomationRulesV2Request,
  output: ListAutomationRulesV2Response,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Grants permission to retrieve a list of connectorsV2 and their metadata for the calling account.
 */
export const listConnectorsV2: (
  input: ListConnectorsV2Request,
) => effect.Effect<
  ListConnectorsV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConnectorsV2Request,
  output: ListConnectorsV2Response,
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
 * Enables aggregation across Amazon Web Services Regions.
 */
export const createAggregatorV2: (
  input: CreateAggregatorV2Request,
) => effect.Effect<
  CreateAggregatorV2Response,
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
  input: CreateAggregatorV2Request,
  output: CreateAggregatorV2Response,
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
 * Retrieves statistical information about Amazon Web Services resources and their associated security findings.
 */
export const getResourcesStatisticsV2: (
  input: GetResourcesStatisticsV2Request,
) => effect.Effect<
  GetResourcesStatisticsV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcesStatisticsV2Request,
  output: GetResourcesStatisticsV2Response,
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
 * Retrieves a list of V2 aggregators.
 */
export const listAggregatorsV2: {
  (
    input: ListAggregatorsV2Request,
  ): effect.Effect<
    ListAggregatorsV2Response,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAggregatorsV2Request,
  ) => stream.Stream<
    ListAggregatorsV2Response,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAggregatorsV2Request,
  ) => stream.Stream<
    AggregatorV2,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAggregatorsV2Request,
  output: ListAggregatorsV2Response,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AggregatorsV2",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Grants permission to update a connectorV2 based on its id and input parameters.
 */
export const updateConnectorV2: (
  input: UpdateConnectorV2Request,
) => effect.Effect<
  UpdateConnectorV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectorV2Request,
  output: UpdateConnectorV2Response,
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
 * Updates a V2 automation rule.
 */
export const updateAutomationRuleV2: (
  input: UpdateAutomationRuleV2Request,
) => effect.Effect<
  UpdateAutomationRuleV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutomationRuleV2Request,
  output: UpdateAutomationRuleV2Response,
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
 * Deletes the Aggregator V2.
 */
export const deleteAggregatorV2: (
  input: DeleteAggregatorV2Request,
) => effect.Effect<
  DeleteAggregatorV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAggregatorV2Request,
  output: DeleteAggregatorV2Response,
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
 * Deletes a V2 automation rule.
 */
export const deleteAutomationRuleV2: (
  input: DeleteAutomationRuleV2Request,
) => effect.Effect<
  DeleteAutomationRuleV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutomationRuleV2Request,
  output: DeleteAutomationRuleV2Response,
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
 * Grants permission to delete a connectorV2.
 */
export const deleteConnectorV2: (
  input: DeleteConnectorV2Request,
) => effect.Effect<
  DeleteConnectorV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorV2Request,
  output: DeleteConnectorV2Response,
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
 * Grants permission to create a ticket in the chosen ITSM based on finding information for the provided finding metadata UID.
 */
export const createTicketV2: (
  input: CreateTicketV2Request,
) => effect.Effect<
  CreateTicketV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTicketV2Request,
  output: CreateTicketV2Response,
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
 * Returns the configuration of the specified Aggregator V2.
 */
export const getAggregatorV2: (
  input: GetAggregatorV2Request,
) => effect.Effect<
  GetAggregatorV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAggregatorV2Request,
  output: GetAggregatorV2Response,
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
 * Returns an automation rule for the V2 service.
 */
export const getAutomationRuleV2: (
  input: GetAutomationRuleV2Request,
) => effect.Effect<
  GetAutomationRuleV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomationRuleV2Request,
  output: GetAutomationRuleV2Response,
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
 * Grants permission to complete the authorization based on input parameters.
 */
export const registerConnectorV2: (
  input: RegisterConnectorV2Request,
) => effect.Effect<
  RegisterConnectorV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterConnectorV2Request,
  output: RegisterConnectorV2Response,
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
 * Udpates the configuration for the Aggregator V2.
 */
export const updateAggregatorV2: (
  input: UpdateAggregatorV2Request,
) => effect.Effect<
  UpdateAggregatorV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAggregatorV2Request,
  output: UpdateAggregatorV2Response,
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
 * Disable the service for the current Amazon Web Services Region or specified Amazon Web Services Region.
 */
export const disableSecurityHubV2: (
  input: DisableSecurityHubV2Request,
) => effect.Effect<
  DisableSecurityHubV2Response,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableSecurityHubV2Request,
  output: DisableSecurityHubV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about the product integration.
 */
export const describeProductsV2: {
  (
    input: DescribeProductsV2Request,
  ): effect.Effect<
    DescribeProductsV2Response,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeProductsV2Request,
  ) => stream.Stream<
    DescribeProductsV2Response,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeProductsV2Request,
  ) => stream.Stream<
    ProductV2,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeProductsV2Request,
  output: DescribeProductsV2Response,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ProductsV2",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns details about the service resource in your account.
 */
export const describeSecurityHubV2: (
  input: DescribeSecurityHubV2Request,
) => effect.Effect<
  DescribeSecurityHubV2Response,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSecurityHubV2Request,
  output: DescribeSecurityHubV2Response,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Used by customers to update information about their investigation into a finding.
 * Requested by delegated administrator accounts or member accounts.
 * Delegated administrator accounts can update findings for their account and their member accounts.
 * Member accounts can update findings for their account. `BatchUpdateFindings` and `BatchUpdateFindingV2` both use `securityhub:BatchUpdateFindings` in the `Action` element of an IAM policy statement.
 * You must have permission to perform the `securityhub:BatchUpdateFindings` action.
 * Updates from `BatchUpdateFindingsV2` don't affect the value of f`inding_info.modified_time`, `finding_info.modified_time_dt`, `time`, `time_dt for a finding`.
 */
export const batchUpdateFindingsV2: (
  input: BatchUpdateFindingsV2Request,
) => effect.Effect<
  BatchUpdateFindingsV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateFindingsV2Request,
  output: BatchUpdateFindingsV2Response,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a configuration policy. Only the Security Hub delegated
 * administrator can invoke this operation from the home Region.
 */
export const updateConfigurationPolicy: (
  input: UpdateConfigurationPolicyRequest,
) => effect.Effect<
  UpdateConfigurationPolicyResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceConflictException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationPolicyRequest,
  output: UpdateConfigurationPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a V2 automation rule.
 */
export const createAutomationRuleV2: (
  input: CreateAutomationRuleV2Request,
) => effect.Effect<
  CreateAutomationRuleV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutomationRuleV2Request,
  output: CreateAutomationRuleV2Response,
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
 * Grants permission to create a connectorV2 based on input parameters.
 */
export const createConnectorV2: (
  input: CreateConnectorV2Request,
) => effect.Effect<
  CreateConnectorV2Response,
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
  input: CreateConnectorV2Request,
  output: CreateConnectorV2Response,
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
 * Enables Security Hub for your account in the current Region or the Region you specify in the
 * request.
 *
 * When you enable Security Hub, you grant to Security Hub the permissions necessary to gather findings
 * from other services that are integrated with Security Hub.
 *
 * When you use the `EnableSecurityHub` operation to enable Security Hub, you also
 * automatically enable the following standards:
 *
 * - Center for Internet Security (CIS) Amazon Web Services Foundations Benchmark v1.2.0
 *
 * - Amazon Web Services Foundational Security Best Practices
 *
 * Other standards are not automatically enabled.
 *
 * To opt out of automatically enabled standards, set
 * `EnableDefaultStandards` to `false`.
 *
 * After you enable Security Hub, to enable a standard, use the `BatchEnableStandards` operation. To disable a standard, use the
 * `BatchDisableStandards` operation.
 *
 * To learn more, see the setup information in the *Security Hub User Guide*.
 */
export const enableSecurityHub: (
  input: EnableSecurityHubRequest,
) => effect.Effect<
  EnableSecurityHubResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | LimitExceededException
  | ResourceConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableSecurityHubRequest,
  output: EnableSecurityHubResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * Updates the configuration of your organization in Security Hub. Only the
 * Security Hub administrator account can invoke this operation.
 */
export const updateOrganizationConfiguration: (
  input: UpdateOrganizationConfigurationRequest,
) => effect.Effect<
  UpdateOrganizationConfigurationResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceConflictException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOrganizationConfigurationRequest,
  output: UpdateOrganizationConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a configuration policy. Only the Security Hub delegated administrator can invoke this operation
 * from the home Region. For the deletion to succeed, you must first disassociate a configuration policy from target accounts,
 * organizational units, or the root by invoking the `StartConfigurationPolicyDisassociation` operation.
 */
export const deleteConfigurationPolicy: (
  input: DeleteConfigurationPolicyRequest,
) => effect.Effect<
  DeleteConfigurationPolicyResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceConflictException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationPolicyRequest,
  output: DeleteConfigurationPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a custom action target in Security Hub.
 *
 * You can use custom actions on findings and insights in Security Hub to trigger target actions
 * in Amazon CloudWatch Events.
 */
export const createActionTarget: (
  input: CreateActionTargetRequest,
) => effect.Effect<
  CreateActionTargetResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateActionTargetRequest,
  output: CreateActionTargetResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * Enables the integration of a partner product with Security Hub. Integrated products send
 * findings to Security Hub.
 *
 * When you enable a product integration, a permissions policy that grants permission for
 * the product to send findings to Security Hub is applied.
 */
export const enableImportFindingsForProduct: (
  input: EnableImportFindingsForProductRequest,
) => effect.Effect<
  EnableImportFindingsForProductResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableImportFindingsForProductRequest,
  output: EnableImportFindingsForProductResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * Creates a member association in Security Hub between the specified accounts and the account
 * used to make the request, which is the administrator account. If you are integrated with
 * Organizations, then the administrator account is designated by the organization management account.
 *
 * `CreateMembers` is always used to add accounts that are not organization
 * members.
 *
 * For accounts that are managed using Organizations, `CreateMembers` is only used
 * in the following cases:
 *
 * - Security Hub is not configured to automatically add new organization accounts.
 *
 * - The account was disassociated or deleted in Security Hub.
 *
 * This action can only be used by an account that has Security Hub enabled. To enable Security Hub, you
 * can use the `EnableSecurityHub` operation.
 *
 * For accounts that are not organization members, you create the account association and
 * then send an invitation to the member account. To send the invitation, you use the
 * `InviteMembers` operation. If the account owner accepts
 * the invitation, the account becomes a member account in Security Hub.
 *
 * Accounts that are managed using Organizations don't receive an invitation. They
 * automatically become a member account in Security Hub.
 *
 * - If the organization account does not have Security Hub enabled, then Security Hub and the default standards are automatically enabled. Note that Security Hub cannot be enabled automatically for the organization management account. The organization management account must enable Security Hub before the administrator account enables it as a member account.
 *
 * - For organization accounts that already have Security Hub enabled, Security Hub does not make any other changes to those accounts. It does not change their enabled standards or controls.
 *
 * A permissions policy is added that permits the administrator account to view the findings
 * generated in the member account.
 *
 * To remove the association between the administrator and member accounts, use the `DisassociateFromMasterAccount` or `DisassociateMembers` operation.
 */
export const createMembers: (
  input: CreateMembersRequest,
) => effect.Effect<
  CreateMembersResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMembersRequest,
  output: CreateMembersResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * Creates a custom insight in Security Hub. An insight is a consolidation of findings that relate
 * to a security issue that requires attention or remediation.
 *
 * To group the related findings in the insight, use the
 * `GroupByAttribute`.
 */
export const createInsight: (
  input: CreateInsightRequest,
) => effect.Effect<
  CreateInsightResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInsightRequest,
  output: CreateInsightResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * Creates an automation rule based on input parameters.
 */
export const createAutomationRule: (
  input: CreateAutomationRuleRequest,
) => effect.Effect<
  CreateAutomationRuleResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutomationRuleRequest,
  output: CreateAutomationRuleResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Returns aggregated statistical data about findings.
 * `GetFindingStatisticsV2` use `securityhub:GetAdhocInsightResults` in the `Action` element of an IAM policy statement.
 * You must have permission to perform the `s` action.
 */
export const getFindingStatisticsV2: (
  input: GetFindingStatisticsV2Request,
) => effect.Effect<
  GetFindingStatisticsV2Response,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingStatisticsV2Request,
  output: GetFindingStatisticsV2Response,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Return a list of findings that match the specified criteria.
 * `GetFindings` and `GetFindingsV2` both use `securityhub:GetFindings` in the `Action` element of an IAM policy statement.
 * You must have permission to perform the `securityhub:GetFindings` action.
 */
export const getFindingsV2: {
  (
    input: GetFindingsV2Request,
  ): effect.Effect<
    GetFindingsV2Response,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetFindingsV2Request,
  ) => stream.Stream<
    GetFindingsV2Response,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetFindingsV2Request,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetFindingsV2Request,
  output: GetFindingsV2Response,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Findings",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the properties of a security control.
 */
export const updateSecurityControl: (
  input: UpdateSecurityControlRequest,
) => effect.Effect<
  UpdateSecurityControlResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSecurityControlRequest,
  output: UpdateSecurityControlResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a configuration policy with the defined configuration. Only the Security Hub delegated administrator
 * can invoke this operation from the home Region.
 */
export const createConfigurationPolicy: (
  input: CreateConfigurationPolicyRequest,
) => effect.Effect<
  CreateConfigurationPolicyResponse,
  | AccessDeniedException
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationPolicyRequest,
  output: CreateConfigurationPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * Retrieves the definition of a security control. The definition includes the control title, description, Region availability, parameter definitions, and other details.
 */
export const getSecurityControlDefinition: (
  input: GetSecurityControlDefinitionRequest,
) => effect.Effect<
  GetSecurityControlDefinitionResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSecurityControlDefinitionRequest,
  output: GetSecurityControlDefinitionResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns findings trend data based on the specified criteria. This operation helps you analyze patterns and changes in findings over time.
 */
export const getFindingsTrendsV2: {
  (
    input: GetFindingsTrendsV2Request,
  ): effect.Effect<
    GetFindingsTrendsV2Response,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetFindingsTrendsV2Request,
  ) => stream.Stream<
    GetFindingsTrendsV2Response,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetFindingsTrendsV2Request,
  ) => stream.Stream<
    TrendsMetricsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetFindingsTrendsV2Request,
  output: GetFindingsTrendsV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TrendsMetrics",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns resource trend data based on the specified criteria. This operation helps you analyze patterns and changes in resource compliance over time.
 */
export const getResourcesTrendsV2: {
  (
    input: GetResourcesTrendsV2Request,
  ): effect.Effect<
    GetResourcesTrendsV2Response,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourcesTrendsV2Request,
  ) => stream.Stream<
    GetResourcesTrendsV2Response,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourcesTrendsV2Request,
  ) => stream.Stream<
    ResourcesTrendsMetricsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourcesTrendsV2Request,
  output: GetResourcesTrendsV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TrendsMetrics",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of resources.
 */
export const getResourcesV2: {
  (
    input: GetResourcesV2Request,
  ): effect.Effect<
    GetResourcesV2Response,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourcesV2Request,
  ) => stream.Stream<
    GetResourcesV2Response,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourcesV2Request,
  ) => stream.Stream<
    ResourceResult,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourcesV2Request,
  output: GetResourcesV2Response,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Resources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Imports security findings generated by a finding provider into Security Hub.
 * This action is requested by the finding provider to import its findings into
 * Security Hub.
 *
 * `BatchImportFindings` must be called by one of the following:
 *
 * - The Amazon Web Services account that is associated with a finding if you are using
 * the default product ARN
 * or are a partner sending findings from within a customer's Amazon Web Services account.
 * In these cases, the identifier of the account that you are calling `BatchImportFindings`
 * from needs to be the same as the `AwsAccountId` attribute for the finding.
 *
 * - An Amazon Web Services account that Security Hub has allow-listed for an official partner
 * integration. In this case, you can call `BatchImportFindings` from the allow-listed
 * account and send findings from different customer accounts in the same batch.
 *
 * The maximum allowed size for a finding is 240 Kb. An error is returned for any finding
 * larger than 240 Kb.
 *
 * After a finding is created, `BatchImportFindings` cannot be used to update
 * the following finding fields and objects, which Security Hub customers use to manage their
 * investigation workflow.
 *
 * - `Note`
 *
 * - `UserDefinedFields`
 *
 * - `VerificationState`
 *
 * - `Workflow`
 *
 * Finding providers also should not use `BatchImportFindings` to update the following attributes.
 *
 * - `Confidence`
 *
 * - `Criticality`
 *
 * - `RelatedFindings`
 *
 * - `Severity`
 *
 * - `Types`
 *
 * Instead, finding providers use `FindingProviderFields` to provide values for these attributes.
 */
export const batchImportFindings: (
  input: BatchImportFindingsRequest,
) => effect.Effect<
  BatchImportFindingsResponse,
  | InternalException
  | InvalidAccessException
  | InvalidInputException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchImportFindingsRequest,
  output: BatchImportFindingsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));

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
  sdkId: "billingconductor",
  serviceShapeName: "AWSBillingConductor",
});
const auth = T.AwsAuthSigv4({ name: "billingconductor" });
const ver = T.ServiceVersion("2021-07-30");
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://billingconductor.us-east-1.amazonaws.com",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "billingconductor",
                  signingRegion: "us-east-1",
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
              `https://billingconductor-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://billingconductor-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://billingconductor.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://billingconductor.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type BillingGroupArn = string;
export type MaxBillingGroupCostReportResults = number;
export type Token = string;
export type BillingPeriod = string;
export type MaxBillingGroupResults = number;
export type Arn = string;
export type TagKey = string;
export type ClientToken = string;
export type BillingGroupName = string | Redacted.Redacted<string>;
export type AccountId = string;
export type BillingGroupDescription = string | Redacted.Redacted<string>;
export type CustomLineItemName = string | Redacted.Redacted<string>;
export type CustomLineItemDescription = string | Redacted.Redacted<string>;
export type CustomLineItemArn = string;
export type MaxCustomLineItemResults = number;
export type CustomLineItemAssociationElement = string;
export type PricingPlanName = string | Redacted.Redacted<string>;
export type PricingPlanDescription = string | Redacted.Redacted<string>;
export type PricingRuleArn = string;
export type PricingPlanArn = string;
export type MaxPricingPlanResults = number;
export type MaxPricingRuleResults = number;
export type PricingRuleName = string | Redacted.Redacted<string>;
export type PricingRuleDescription = string | Redacted.Redacted<string>;
export type ModifierPercentage = number;
export type Service = string;
export type BillingEntity = string;
export type UsageType = string;
export type Operation = string;
export type Association = string;
export type TagValue = string;
export type ResponsibilityTransferArn = string;
export type PricingPlanFullArn = string;
export type NumberOfAssociatedPricingRules = number;
export type Instant = number;
export type SearchValue = string;
export type CustomLineItemChargeValue = number;
export type CustomLineItemPercentageChargeValue = number;
export type AttributeValue = string;
export type RetryAfterSeconds = number;
export type NumberOfAccounts = number;
export type BillingGroupStatusReason = string;
export type AWSCost = string;
export type ProformaCost = string;
export type Margin = string;
export type MarginPercentage = string;
export type Currency = string;
export type AccountName = string | Redacted.Redacted<string>;
export type AccountEmail = string | Redacted.Redacted<string>;
export type CustomLineItemProductCode = string;
export type NumberOfAssociations = number;
export type NumberOfPricingPlansAssociatedWith = number;
export type BillingGroupFullArn = string;

//# Schemas
export type GroupByAttributesList = string[];
export const GroupByAttributesList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type CustomLineItemBatchAssociationsList = string[];
export const CustomLineItemBatchAssociationsList = S.Array(S.String);
export type CustomLineItemBatchDisassociationsList = string[];
export const CustomLineItemBatchDisassociationsList = S.Array(S.String);
export type PricingRuleArnsInput = string[];
export const PricingRuleArnsInput = S.Array(S.String);
export type PricingRuleArnsNonEmptyInput = string[];
export const PricingRuleArnsNonEmptyInput = S.Array(S.String);
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
export interface DeleteBillingGroupInput {
  Arn: string;
}
export const DeleteBillingGroupInput = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-billing-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBillingGroupInput",
}) as any as S.Schema<DeleteBillingGroupInput>;
export interface AssociateAccountsInput {
  Arn: string;
  AccountIds: AccountIdList;
}
export const AssociateAccountsInput = S.suspend(() =>
  S.Struct({ Arn: S.String, AccountIds: AccountIdList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/associate-accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateAccountsInput",
}) as any as S.Schema<AssociateAccountsInput>;
export interface DisassociateAccountsInput {
  Arn: string;
  AccountIds: AccountIdList;
}
export const DisassociateAccountsInput = S.suspend(() =>
  S.Struct({ Arn: S.String, AccountIds: AccountIdList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/disassociate-accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateAccountsInput",
}) as any as S.Schema<DisassociateAccountsInput>;
export interface CustomLineItemBillingPeriodRange {
  InclusiveStartBillingPeriod: string;
  ExclusiveEndBillingPeriod?: string;
}
export const CustomLineItemBillingPeriodRange = S.suspend(() =>
  S.Struct({
    InclusiveStartBillingPeriod: S.String,
    ExclusiveEndBillingPeriod: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomLineItemBillingPeriodRange",
}) as any as S.Schema<CustomLineItemBillingPeriodRange>;
export interface DeleteCustomLineItemInput {
  Arn: string;
  BillingPeriodRange?: CustomLineItemBillingPeriodRange;
}
export const DeleteCustomLineItemInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-custom-line-item" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomLineItemInput",
}) as any as S.Schema<DeleteCustomLineItemInput>;
export interface BatchAssociateResourcesToCustomLineItemInput {
  TargetArn: string;
  ResourceArns: CustomLineItemBatchAssociationsList;
  BillingPeriodRange?: CustomLineItemBillingPeriodRange;
}
export const BatchAssociateResourcesToCustomLineItemInput = S.suspend(() =>
  S.Struct({
    TargetArn: S.String,
    ResourceArns: CustomLineItemBatchAssociationsList,
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/batch-associate-resources-to-custom-line-item",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchAssociateResourcesToCustomLineItemInput",
}) as any as S.Schema<BatchAssociateResourcesToCustomLineItemInput>;
export interface BatchDisassociateResourcesFromCustomLineItemInput {
  TargetArn: string;
  ResourceArns: CustomLineItemBatchDisassociationsList;
  BillingPeriodRange?: CustomLineItemBillingPeriodRange;
}
export const BatchDisassociateResourcesFromCustomLineItemInput = S.suspend(() =>
  S.Struct({
    TargetArn: S.String,
    ResourceArns: CustomLineItemBatchDisassociationsList,
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/batch-disassociate-resources-from-custom-line-item",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDisassociateResourcesFromCustomLineItemInput",
}) as any as S.Schema<BatchDisassociateResourcesFromCustomLineItemInput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreatePricingPlanInput {
  ClientToken?: string;
  Name: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  PricingRuleArns?: PricingRuleArnsInput;
  Tags?: TagMap;
}
export const CreatePricingPlanInput = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    Name: SensitiveString,
    Description: S.optional(SensitiveString),
    PricingRuleArns: S.optional(PricingRuleArnsInput),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-pricing-plan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePricingPlanInput",
}) as any as S.Schema<CreatePricingPlanInput>;
export interface UpdatePricingPlanInput {
  Arn: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
}
export const UpdatePricingPlanInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/update-pricing-plan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePricingPlanInput",
}) as any as S.Schema<UpdatePricingPlanInput>;
export interface DeletePricingPlanInput {
  Arn: string;
}
export const DeletePricingPlanInput = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-pricing-plan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePricingPlanInput",
}) as any as S.Schema<DeletePricingPlanInput>;
export interface AssociatePricingRulesInput {
  Arn: string;
  PricingRuleArns: PricingRuleArnsNonEmptyInput;
}
export const AssociatePricingRulesInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    PricingRuleArns: PricingRuleArnsNonEmptyInput,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/associate-pricing-rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociatePricingRulesInput",
}) as any as S.Schema<AssociatePricingRulesInput>;
export interface DisassociatePricingRulesInput {
  Arn: string;
  PricingRuleArns: PricingRuleArnsNonEmptyInput;
}
export const DisassociatePricingRulesInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    PricingRuleArns: PricingRuleArnsNonEmptyInput,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/disassociate-pricing-rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociatePricingRulesInput",
}) as any as S.Schema<DisassociatePricingRulesInput>;
export interface ListPricingPlansAssociatedWithPricingRuleInput {
  BillingPeriod?: string;
  PricingRuleArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPricingPlansAssociatedWithPricingRuleInput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    PricingRuleArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/list-pricing-plans-associated-with-pricing-rule",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPricingPlansAssociatedWithPricingRuleInput",
}) as any as S.Schema<ListPricingPlansAssociatedWithPricingRuleInput>;
export interface DeletePricingRuleInput {
  Arn: string;
}
export const DeletePricingRuleInput = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-pricing-rule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePricingRuleInput",
}) as any as S.Schema<DeletePricingRuleInput>;
export interface ListPricingRulesAssociatedToPricingPlanInput {
  BillingPeriod?: string;
  PricingPlanArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPricingRulesAssociatedToPricingPlanInput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    PricingPlanArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/list-pricing-rules-associated-to-pricing-plan",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPricingRulesAssociatedToPricingPlanInput",
}) as any as S.Schema<ListPricingRulesAssociatedToPricingPlanInput>;
export type AccountIdFilterList = string[];
export const AccountIdFilterList = S.Array(S.String);
export type BillingGroupArnList = string[];
export const BillingGroupArnList = S.Array(S.String);
export type BillingGroupStatusList = string[];
export const BillingGroupStatusList = S.Array(S.String);
export type PrimaryAccountIdList = string[];
export const PrimaryAccountIdList = S.Array(S.String);
export type BillingGroupTypeList = string[];
export const BillingGroupTypeList = S.Array(S.String);
export type ResponsibilityTransferArnsList = string[];
export const ResponsibilityTransferArnsList = S.Array(S.String);
export type CustomLineItemNameList = string | Redacted.Redacted<string>[];
export const CustomLineItemNameList = S.Array(SensitiveString);
export type CustomLineItemArns = string[];
export const CustomLineItemArns = S.Array(S.String);
export type PricingPlanArns = string[];
export const PricingPlanArns = S.Array(S.String);
export type PricingRuleArns = string[];
export const PricingRuleArns = S.Array(S.String);
export interface BillingPeriodRange {
  InclusiveStartBillingPeriod: string;
  ExclusiveEndBillingPeriod: string;
}
export const BillingPeriodRange = S.suspend(() =>
  S.Struct({
    InclusiveStartBillingPeriod: S.String,
    ExclusiveEndBillingPeriod: S.String,
  }),
).annotations({
  identifier: "BillingPeriodRange",
}) as any as S.Schema<BillingPeriodRange>;
export interface ListAccountAssociationsFilter {
  Association?: string;
  AccountId?: string;
  AccountIds?: AccountIdFilterList;
}
export const ListAccountAssociationsFilter = S.suspend(() =>
  S.Struct({
    Association: S.optional(S.String),
    AccountId: S.optional(S.String),
    AccountIds: S.optional(AccountIdFilterList),
  }),
).annotations({
  identifier: "ListAccountAssociationsFilter",
}) as any as S.Schema<ListAccountAssociationsFilter>;
export interface ListBillingGroupCostReportsFilter {
  BillingGroupArns?: BillingGroupArnList;
}
export const ListBillingGroupCostReportsFilter = S.suspend(() =>
  S.Struct({ BillingGroupArns: S.optional(BillingGroupArnList) }),
).annotations({
  identifier: "ListBillingGroupCostReportsFilter",
}) as any as S.Schema<ListBillingGroupCostReportsFilter>;
export interface AccountGrouping {
  LinkedAccountIds?: AccountIdList;
  AutoAssociate?: boolean;
  ResponsibilityTransferArn?: string;
}
export const AccountGrouping = S.suspend(() =>
  S.Struct({
    LinkedAccountIds: S.optional(AccountIdList),
    AutoAssociate: S.optional(S.Boolean),
    ResponsibilityTransferArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountGrouping",
}) as any as S.Schema<AccountGrouping>;
export interface ComputationPreference {
  PricingPlanArn: string;
}
export const ComputationPreference = S.suspend(() =>
  S.Struct({ PricingPlanArn: S.String }),
).annotations({
  identifier: "ComputationPreference",
}) as any as S.Schema<ComputationPreference>;
export interface UpdateBillingGroupAccountGrouping {
  AutoAssociate?: boolean;
  ResponsibilityTransferArn?: string;
}
export const UpdateBillingGroupAccountGrouping = S.suspend(() =>
  S.Struct({
    AutoAssociate: S.optional(S.Boolean),
    ResponsibilityTransferArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateBillingGroupAccountGrouping",
}) as any as S.Schema<UpdateBillingGroupAccountGrouping>;
export interface PresentationObject {
  Service: string;
}
export const PresentationObject = S.suspend(() =>
  S.Struct({ Service: S.String }),
).annotations({
  identifier: "PresentationObject",
}) as any as S.Schema<PresentationObject>;
export interface ListCustomLineItemsFilter {
  Names?: CustomLineItemNameList;
  BillingGroups?: BillingGroupArnList;
  Arns?: CustomLineItemArns;
  AccountIds?: AccountIdList;
}
export const ListCustomLineItemsFilter = S.suspend(() =>
  S.Struct({
    Names: S.optional(CustomLineItemNameList),
    BillingGroups: S.optional(BillingGroupArnList),
    Arns: S.optional(CustomLineItemArns),
    AccountIds: S.optional(AccountIdList),
  }),
).annotations({
  identifier: "ListCustomLineItemsFilter",
}) as any as S.Schema<ListCustomLineItemsFilter>;
export interface ListResourcesAssociatedToCustomLineItemFilter {
  Relationship?: string;
}
export const ListResourcesAssociatedToCustomLineItemFilter = S.suspend(() =>
  S.Struct({ Relationship: S.optional(S.String) }),
).annotations({
  identifier: "ListResourcesAssociatedToCustomLineItemFilter",
}) as any as S.Schema<ListResourcesAssociatedToCustomLineItemFilter>;
export interface ListPricingPlansFilter {
  Arns?: PricingPlanArns;
}
export const ListPricingPlansFilter = S.suspend(() =>
  S.Struct({ Arns: S.optional(PricingPlanArns) }),
).annotations({
  identifier: "ListPricingPlansFilter",
}) as any as S.Schema<ListPricingPlansFilter>;
export interface ListPricingRulesFilter {
  Arns?: PricingRuleArns;
}
export const ListPricingRulesFilter = S.suspend(() =>
  S.Struct({ Arns: S.optional(PricingRuleArns) }),
).annotations({
  identifier: "ListPricingRulesFilter",
}) as any as S.Schema<ListPricingRulesFilter>;
export type CustomLineItemAssociationsList = string[];
export const CustomLineItemAssociationsList = S.Array(S.String);
export type LineItemFilterValuesList = string[];
export const LineItemFilterValuesList = S.Array(S.String);
export type AttributeValueList = string[];
export const AttributeValueList = S.Array(S.String);
export interface GetBillingGroupCostReportInput {
  Arn: string;
  BillingPeriodRange?: BillingPeriodRange;
  GroupBy?: GroupByAttributesList;
  MaxResults?: number;
  NextToken?: string;
}
export const GetBillingGroupCostReportInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    BillingPeriodRange: S.optional(BillingPeriodRange),
    GroupBy: S.optional(GroupByAttributesList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-billing-group-cost-report" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBillingGroupCostReportInput",
}) as any as S.Schema<GetBillingGroupCostReportInput>;
export interface ListAccountAssociationsInput {
  BillingPeriod?: string;
  Filters?: ListAccountAssociationsFilter;
  NextToken?: string;
}
export const ListAccountAssociationsInput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    Filters: S.optional(ListAccountAssociationsFilter),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-account-associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccountAssociationsInput",
}) as any as S.Schema<ListAccountAssociationsInput>;
export interface ListBillingGroupCostReportsInput {
  BillingPeriod?: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: ListBillingGroupCostReportsFilter;
}
export const ListBillingGroupCostReportsInput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListBillingGroupCostReportsFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-billing-group-cost-reports" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBillingGroupCostReportsInput",
}) as any as S.Schema<ListBillingGroupCostReportsInput>;
export interface ListTagsForResourceResponse {
  Tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
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
export interface CreateBillingGroupInput {
  ClientToken?: string;
  Name: string | Redacted.Redacted<string>;
  AccountGrouping: AccountGrouping;
  ComputationPreference: ComputationPreference;
  PrimaryAccountId?: string;
  Description?: string | Redacted.Redacted<string>;
  Tags?: TagMap;
}
export const CreateBillingGroupInput = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    Name: SensitiveString,
    AccountGrouping: AccountGrouping,
    ComputationPreference: ComputationPreference,
    PrimaryAccountId: S.optional(S.String),
    Description: S.optional(SensitiveString),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-billing-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBillingGroupInput",
}) as any as S.Schema<CreateBillingGroupInput>;
export interface UpdateBillingGroupInput {
  Arn: string;
  Name?: string | Redacted.Redacted<string>;
  Status?: string;
  ComputationPreference?: ComputationPreference;
  Description?: string | Redacted.Redacted<string>;
  AccountGrouping?: UpdateBillingGroupAccountGrouping;
}
export const UpdateBillingGroupInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.optional(SensitiveString),
    Status: S.optional(S.String),
    ComputationPreference: S.optional(ComputationPreference),
    Description: S.optional(SensitiveString),
    AccountGrouping: S.optional(UpdateBillingGroupAccountGrouping),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-billing-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBillingGroupInput",
}) as any as S.Schema<UpdateBillingGroupInput>;
export interface DeleteBillingGroupOutput {
  Arn?: string;
}
export const DeleteBillingGroupOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteBillingGroupOutput",
}) as any as S.Schema<DeleteBillingGroupOutput>;
export interface AssociateAccountsOutput {
  Arn?: string;
}
export const AssociateAccountsOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "AssociateAccountsOutput",
}) as any as S.Schema<AssociateAccountsOutput>;
export interface DisassociateAccountsOutput {
  Arn?: string;
}
export const DisassociateAccountsOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DisassociateAccountsOutput",
}) as any as S.Schema<DisassociateAccountsOutput>;
export interface DeleteCustomLineItemOutput {
  Arn?: string;
}
export const DeleteCustomLineItemOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteCustomLineItemOutput",
}) as any as S.Schema<DeleteCustomLineItemOutput>;
export interface ListCustomLineItemsInput {
  BillingPeriod?: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: ListCustomLineItemsFilter;
}
export const ListCustomLineItemsInput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListCustomLineItemsFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-custom-line-items" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomLineItemsInput",
}) as any as S.Schema<ListCustomLineItemsInput>;
export interface ListResourcesAssociatedToCustomLineItemInput {
  BillingPeriod?: string;
  Arn: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: ListResourcesAssociatedToCustomLineItemFilter;
}
export const ListResourcesAssociatedToCustomLineItemInput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    Arn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListResourcesAssociatedToCustomLineItemFilter),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/list-resources-associated-to-custom-line-item",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourcesAssociatedToCustomLineItemInput",
}) as any as S.Schema<ListResourcesAssociatedToCustomLineItemInput>;
export interface CreatePricingPlanOutput {
  Arn?: string;
}
export const CreatePricingPlanOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreatePricingPlanOutput",
}) as any as S.Schema<CreatePricingPlanOutput>;
export interface UpdatePricingPlanOutput {
  Arn?: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  Size?: number;
  LastModifiedTime?: number;
}
export const UpdatePricingPlanOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
    Size: S.optional(S.Number),
    LastModifiedTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdatePricingPlanOutput",
}) as any as S.Schema<UpdatePricingPlanOutput>;
export interface DeletePricingPlanOutput {
  Arn?: string;
}
export const DeletePricingPlanOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DeletePricingPlanOutput",
}) as any as S.Schema<DeletePricingPlanOutput>;
export interface ListPricingPlansInput {
  BillingPeriod?: string;
  Filters?: ListPricingPlansFilter;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPricingPlansInput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    Filters: S.optional(ListPricingPlansFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-pricing-plans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPricingPlansInput",
}) as any as S.Schema<ListPricingPlansInput>;
export interface AssociatePricingRulesOutput {
  Arn?: string;
}
export const AssociatePricingRulesOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "AssociatePricingRulesOutput",
}) as any as S.Schema<AssociatePricingRulesOutput>;
export interface DisassociatePricingRulesOutput {
  Arn?: string;
}
export const DisassociatePricingRulesOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DisassociatePricingRulesOutput",
}) as any as S.Schema<DisassociatePricingRulesOutput>;
export interface ListPricingPlansAssociatedWithPricingRuleOutput {
  BillingPeriod?: string;
  PricingRuleArn?: string;
  PricingPlanArns?: PricingPlanArns;
  NextToken?: string;
}
export const ListPricingPlansAssociatedWithPricingRuleOutput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    PricingRuleArn: S.optional(S.String),
    PricingPlanArns: S.optional(PricingPlanArns),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPricingPlansAssociatedWithPricingRuleOutput",
}) as any as S.Schema<ListPricingPlansAssociatedWithPricingRuleOutput>;
export interface DeletePricingRuleOutput {
  Arn?: string;
}
export const DeletePricingRuleOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DeletePricingRuleOutput",
}) as any as S.Schema<DeletePricingRuleOutput>;
export interface ListPricingRulesInput {
  BillingPeriod?: string;
  Filters?: ListPricingRulesFilter;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPricingRulesInput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    Filters: S.optional(ListPricingRulesFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-pricing-rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPricingRulesInput",
}) as any as S.Schema<ListPricingRulesInput>;
export interface ListPricingRulesAssociatedToPricingPlanOutput {
  BillingPeriod?: string;
  PricingPlanArn?: string;
  PricingRuleArns?: PricingRuleArns;
  NextToken?: string;
}
export const ListPricingRulesAssociatedToPricingPlanOutput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    PricingPlanArn: S.optional(S.String),
    PricingRuleArns: S.optional(PricingRuleArns),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPricingRulesAssociatedToPricingPlanOutput",
}) as any as S.Schema<ListPricingRulesAssociatedToPricingPlanOutput>;
export interface StringSearch {
  SearchOption: string;
  SearchValue: string;
}
export const StringSearch = S.suspend(() =>
  S.Struct({ SearchOption: S.String, SearchValue: S.String }),
).annotations({ identifier: "StringSearch" }) as any as S.Schema<StringSearch>;
export type StringSearches = StringSearch[];
export const StringSearches = S.Array(StringSearch);
export interface CustomLineItemFlatChargeDetails {
  ChargeValue: number;
}
export const CustomLineItemFlatChargeDetails = S.suspend(() =>
  S.Struct({ ChargeValue: S.Number }),
).annotations({
  identifier: "CustomLineItemFlatChargeDetails",
}) as any as S.Schema<CustomLineItemFlatChargeDetails>;
export interface CustomLineItemPercentageChargeDetails {
  PercentageValue: number;
  AssociatedValues?: CustomLineItemAssociationsList;
}
export const CustomLineItemPercentageChargeDetails = S.suspend(() =>
  S.Struct({
    PercentageValue: S.Number,
    AssociatedValues: S.optional(CustomLineItemAssociationsList),
  }),
).annotations({
  identifier: "CustomLineItemPercentageChargeDetails",
}) as any as S.Schema<CustomLineItemPercentageChargeDetails>;
export interface LineItemFilter {
  Attribute: string;
  MatchOption: string;
  Values?: LineItemFilterValuesList;
  AttributeValues?: AttributeValueList;
}
export const LineItemFilter = S.suspend(() =>
  S.Struct({
    Attribute: S.String,
    MatchOption: S.String,
    Values: S.optional(LineItemFilterValuesList),
    AttributeValues: S.optional(AttributeValueList),
  }),
).annotations({
  identifier: "LineItemFilter",
}) as any as S.Schema<LineItemFilter>;
export type LineItemFiltersList = LineItemFilter[];
export const LineItemFiltersList = S.Array(LineItemFilter);
export interface UpdateCustomLineItemFlatChargeDetails {
  ChargeValue: number;
}
export const UpdateCustomLineItemFlatChargeDetails = S.suspend(() =>
  S.Struct({ ChargeValue: S.Number }),
).annotations({
  identifier: "UpdateCustomLineItemFlatChargeDetails",
}) as any as S.Schema<UpdateCustomLineItemFlatChargeDetails>;
export interface UpdateCustomLineItemPercentageChargeDetails {
  PercentageValue: number;
}
export const UpdateCustomLineItemPercentageChargeDetails = S.suspend(() =>
  S.Struct({ PercentageValue: S.Number }),
).annotations({
  identifier: "UpdateCustomLineItemPercentageChargeDetails",
}) as any as S.Schema<UpdateCustomLineItemPercentageChargeDetails>;
export interface ListCustomLineItemVersionsBillingPeriodRangeFilter {
  StartBillingPeriod?: string;
  EndBillingPeriod?: string;
}
export const ListCustomLineItemVersionsBillingPeriodRangeFilter = S.suspend(
  () =>
    S.Struct({
      StartBillingPeriod: S.optional(S.String),
      EndBillingPeriod: S.optional(S.String),
    }),
).annotations({
  identifier: "ListCustomLineItemVersionsBillingPeriodRangeFilter",
}) as any as S.Schema<ListCustomLineItemVersionsBillingPeriodRangeFilter>;
export interface CreateFreeTierConfig {
  Activated: boolean;
}
export const CreateFreeTierConfig = S.suspend(() =>
  S.Struct({ Activated: S.Boolean }),
).annotations({
  identifier: "CreateFreeTierConfig",
}) as any as S.Schema<CreateFreeTierConfig>;
export interface UpdateFreeTierConfig {
  Activated: boolean;
}
export const UpdateFreeTierConfig = S.suspend(() =>
  S.Struct({ Activated: S.Boolean }),
).annotations({
  identifier: "UpdateFreeTierConfig",
}) as any as S.Schema<UpdateFreeTierConfig>;
export interface ListBillingGroupsFilter {
  Arns?: BillingGroupArnList;
  PricingPlan?: string;
  Statuses?: BillingGroupStatusList;
  AutoAssociate?: boolean;
  PrimaryAccountIds?: PrimaryAccountIdList;
  BillingGroupTypes?: BillingGroupTypeList;
  Names?: StringSearches;
  ResponsibilityTransferArns?: ResponsibilityTransferArnsList;
}
export const ListBillingGroupsFilter = S.suspend(() =>
  S.Struct({
    Arns: S.optional(BillingGroupArnList),
    PricingPlan: S.optional(S.String),
    Statuses: S.optional(BillingGroupStatusList),
    AutoAssociate: S.optional(S.Boolean),
    PrimaryAccountIds: S.optional(PrimaryAccountIdList),
    BillingGroupTypes: S.optional(BillingGroupTypeList),
    Names: S.optional(StringSearches),
    ResponsibilityTransferArns: S.optional(ResponsibilityTransferArnsList),
  }),
).annotations({
  identifier: "ListBillingGroupsFilter",
}) as any as S.Schema<ListBillingGroupsFilter>;
export interface CustomLineItemChargeDetails {
  Flat?: CustomLineItemFlatChargeDetails;
  Percentage?: CustomLineItemPercentageChargeDetails;
  Type: string;
  LineItemFilters?: LineItemFiltersList;
}
export const CustomLineItemChargeDetails = S.suspend(() =>
  S.Struct({
    Flat: S.optional(CustomLineItemFlatChargeDetails),
    Percentage: S.optional(CustomLineItemPercentageChargeDetails),
    Type: S.String,
    LineItemFilters: S.optional(LineItemFiltersList),
  }),
).annotations({
  identifier: "CustomLineItemChargeDetails",
}) as any as S.Schema<CustomLineItemChargeDetails>;
export interface UpdateCustomLineItemChargeDetails {
  Flat?: UpdateCustomLineItemFlatChargeDetails;
  Percentage?: UpdateCustomLineItemPercentageChargeDetails;
  LineItemFilters?: LineItemFiltersList;
}
export const UpdateCustomLineItemChargeDetails = S.suspend(() =>
  S.Struct({
    Flat: S.optional(UpdateCustomLineItemFlatChargeDetails),
    Percentage: S.optional(UpdateCustomLineItemPercentageChargeDetails),
    LineItemFilters: S.optional(LineItemFiltersList),
  }),
).annotations({
  identifier: "UpdateCustomLineItemChargeDetails",
}) as any as S.Schema<UpdateCustomLineItemChargeDetails>;
export interface AssociateResourceError {
  Message?: string;
  Reason?: string;
}
export const AssociateResourceError = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String), Reason: S.optional(S.String) }),
).annotations({
  identifier: "AssociateResourceError",
}) as any as S.Schema<AssociateResourceError>;
export interface DisassociateResourceResponseElement {
  Arn?: string;
  Error?: AssociateResourceError;
}
export const DisassociateResourceResponseElement = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Error: S.optional(AssociateResourceError),
  }),
).annotations({
  identifier: "DisassociateResourceResponseElement",
}) as any as S.Schema<DisassociateResourceResponseElement>;
export type DisassociateResourcesResponseList =
  DisassociateResourceResponseElement[];
export const DisassociateResourcesResponseList = S.Array(
  DisassociateResourceResponseElement,
);
export interface ListCustomLineItemVersionsFilter {
  BillingPeriodRange?: ListCustomLineItemVersionsBillingPeriodRangeFilter;
}
export const ListCustomLineItemVersionsFilter = S.suspend(() =>
  S.Struct({
    BillingPeriodRange: S.optional(
      ListCustomLineItemVersionsBillingPeriodRangeFilter,
    ),
  }),
).annotations({
  identifier: "ListCustomLineItemVersionsFilter",
}) as any as S.Schema<ListCustomLineItemVersionsFilter>;
export interface CreateTieringInput {
  FreeTier: CreateFreeTierConfig;
}
export const CreateTieringInput = S.suspend(() =>
  S.Struct({ FreeTier: CreateFreeTierConfig }),
).annotations({
  identifier: "CreateTieringInput",
}) as any as S.Schema<CreateTieringInput>;
export interface UpdateTieringInput {
  FreeTier: UpdateFreeTierConfig;
}
export const UpdateTieringInput = S.suspend(() =>
  S.Struct({ FreeTier: UpdateFreeTierConfig }),
).annotations({
  identifier: "UpdateTieringInput",
}) as any as S.Schema<UpdateTieringInput>;
export interface CreateBillingGroupOutput {
  Arn?: string;
}
export const CreateBillingGroupOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateBillingGroupOutput",
}) as any as S.Schema<CreateBillingGroupOutput>;
export interface UpdateBillingGroupOutput {
  Arn?: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  PrimaryAccountId?: string;
  PricingPlanArn?: string;
  Size?: number;
  LastModifiedTime?: number;
  Status?: string;
  StatusReason?: string;
  AccountGrouping?: UpdateBillingGroupAccountGrouping;
}
export const UpdateBillingGroupOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
    PrimaryAccountId: S.optional(S.String),
    PricingPlanArn: S.optional(S.String),
    Size: S.optional(S.Number),
    LastModifiedTime: S.optional(S.Number),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    AccountGrouping: S.optional(UpdateBillingGroupAccountGrouping),
  }),
).annotations({
  identifier: "UpdateBillingGroupOutput",
}) as any as S.Schema<UpdateBillingGroupOutput>;
export interface ListBillingGroupsInput {
  BillingPeriod?: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: ListBillingGroupsFilter;
}
export const ListBillingGroupsInput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListBillingGroupsFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-billing-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBillingGroupsInput",
}) as any as S.Schema<ListBillingGroupsInput>;
export interface CreateCustomLineItemInput {
  ClientToken?: string;
  Name: string | Redacted.Redacted<string>;
  Description: string | Redacted.Redacted<string>;
  BillingGroupArn: string;
  BillingPeriodRange?: CustomLineItemBillingPeriodRange;
  Tags?: TagMap;
  ChargeDetails: CustomLineItemChargeDetails;
  AccountId?: string;
  ComputationRule?: string;
  PresentationDetails?: PresentationObject;
}
export const CreateCustomLineItemInput = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    Name: SensitiveString,
    Description: SensitiveString,
    BillingGroupArn: S.String,
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
    Tags: S.optional(TagMap),
    ChargeDetails: CustomLineItemChargeDetails,
    AccountId: S.optional(S.String),
    ComputationRule: S.optional(S.String),
    PresentationDetails: S.optional(PresentationObject),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-custom-line-item" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomLineItemInput",
}) as any as S.Schema<CreateCustomLineItemInput>;
export interface UpdateCustomLineItemInput {
  Arn: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  ChargeDetails?: UpdateCustomLineItemChargeDetails;
  BillingPeriodRange?: CustomLineItemBillingPeriodRange;
}
export const UpdateCustomLineItemInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
    ChargeDetails: S.optional(UpdateCustomLineItemChargeDetails),
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-custom-line-item" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCustomLineItemInput",
}) as any as S.Schema<UpdateCustomLineItemInput>;
export interface BatchDisassociateResourcesFromCustomLineItemOutput {
  SuccessfullyDisassociatedResources?: DisassociateResourcesResponseList;
  FailedDisassociatedResources?: DisassociateResourcesResponseList;
}
export const BatchDisassociateResourcesFromCustomLineItemOutput = S.suspend(
  () =>
    S.Struct({
      SuccessfullyDisassociatedResources: S.optional(
        DisassociateResourcesResponseList,
      ),
      FailedDisassociatedResources: S.optional(
        DisassociateResourcesResponseList,
      ),
    }),
).annotations({
  identifier: "BatchDisassociateResourcesFromCustomLineItemOutput",
}) as any as S.Schema<BatchDisassociateResourcesFromCustomLineItemOutput>;
export interface ListCustomLineItemVersionsInput {
  Arn: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: ListCustomLineItemVersionsFilter;
}
export const ListCustomLineItemVersionsInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListCustomLineItemVersionsFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-custom-line-item-versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomLineItemVersionsInput",
}) as any as S.Schema<ListCustomLineItemVersionsInput>;
export interface CreatePricingRuleInput {
  ClientToken?: string;
  Name: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  Scope: string;
  Type: string;
  ModifierPercentage?: number;
  Service?: string;
  Tags?: TagMap;
  BillingEntity?: string;
  Tiering?: CreateTieringInput;
  UsageType?: string;
  Operation?: string;
}
export const CreatePricingRuleInput = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    Name: SensitiveString,
    Description: S.optional(SensitiveString),
    Scope: S.String,
    Type: S.String,
    ModifierPercentage: S.optional(S.Number),
    Service: S.optional(S.String),
    Tags: S.optional(TagMap),
    BillingEntity: S.optional(S.String),
    Tiering: S.optional(CreateTieringInput),
    UsageType: S.optional(S.String),
    Operation: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-pricing-rule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePricingRuleInput",
}) as any as S.Schema<CreatePricingRuleInput>;
export interface UpdatePricingRuleInput {
  Arn: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  Type?: string;
  ModifierPercentage?: number;
  Tiering?: UpdateTieringInput;
}
export const UpdatePricingRuleInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
    Type: S.optional(S.String),
    ModifierPercentage: S.optional(S.Number),
    Tiering: S.optional(UpdateTieringInput),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/update-pricing-rule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePricingRuleInput",
}) as any as S.Schema<UpdatePricingRuleInput>;
export interface AccountAssociationsListElement {
  AccountId?: string;
  BillingGroupArn?: string;
  AccountName?: string | Redacted.Redacted<string>;
  AccountEmail?: string | Redacted.Redacted<string>;
}
export const AccountAssociationsListElement = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    BillingGroupArn: S.optional(S.String),
    AccountName: S.optional(SensitiveString),
    AccountEmail: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AccountAssociationsListElement",
}) as any as S.Schema<AccountAssociationsListElement>;
export type AccountAssociationsList = AccountAssociationsListElement[];
export const AccountAssociationsList = S.Array(AccountAssociationsListElement);
export interface BillingGroupCostReportElement {
  Arn?: string;
  AWSCost?: string;
  ProformaCost?: string;
  Margin?: string;
  MarginPercentage?: string;
  Currency?: string;
}
export const BillingGroupCostReportElement = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AWSCost: S.optional(S.String),
    ProformaCost: S.optional(S.String),
    Margin: S.optional(S.String),
    MarginPercentage: S.optional(S.String),
    Currency: S.optional(S.String),
  }),
).annotations({
  identifier: "BillingGroupCostReportElement",
}) as any as S.Schema<BillingGroupCostReportElement>;
export type BillingGroupCostReportList = BillingGroupCostReportElement[];
export const BillingGroupCostReportList = S.Array(
  BillingGroupCostReportElement,
);
export interface AssociateResourceResponseElement {
  Arn?: string;
  Error?: AssociateResourceError;
}
export const AssociateResourceResponseElement = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Error: S.optional(AssociateResourceError),
  }),
).annotations({
  identifier: "AssociateResourceResponseElement",
}) as any as S.Schema<AssociateResourceResponseElement>;
export type AssociateResourcesResponseList = AssociateResourceResponseElement[];
export const AssociateResourcesResponseList = S.Array(
  AssociateResourceResponseElement,
);
export interface ListResourcesAssociatedToCustomLineItemResponseElement {
  Arn?: string;
  Relationship?: string;
  EndBillingPeriod?: string;
}
export const ListResourcesAssociatedToCustomLineItemResponseElement = S.suspend(
  () =>
    S.Struct({
      Arn: S.optional(S.String),
      Relationship: S.optional(S.String),
      EndBillingPeriod: S.optional(S.String),
    }),
).annotations({
  identifier: "ListResourcesAssociatedToCustomLineItemResponseElement",
}) as any as S.Schema<ListResourcesAssociatedToCustomLineItemResponseElement>;
export type ListResourcesAssociatedToCustomLineItemResponseList =
  ListResourcesAssociatedToCustomLineItemResponseElement[];
export const ListResourcesAssociatedToCustomLineItemResponseList = S.Array(
  ListResourcesAssociatedToCustomLineItemResponseElement,
);
export interface PricingPlanListElement {
  Name?: string | Redacted.Redacted<string>;
  Arn?: string;
  Description?: string | Redacted.Redacted<string>;
  Size?: number;
  CreationTime?: number;
  LastModifiedTime?: number;
}
export const PricingPlanListElement = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    Arn: S.optional(S.String),
    Description: S.optional(SensitiveString),
    Size: S.optional(S.Number),
    CreationTime: S.optional(S.Number),
    LastModifiedTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "PricingPlanListElement",
}) as any as S.Schema<PricingPlanListElement>;
export type PricingPlanList = PricingPlanListElement[];
export const PricingPlanList = S.Array(PricingPlanListElement);
export interface ListAccountAssociationsOutput {
  LinkedAccounts?: AccountAssociationsList;
  NextToken?: string;
}
export const ListAccountAssociationsOutput = S.suspend(() =>
  S.Struct({
    LinkedAccounts: S.optional(AccountAssociationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccountAssociationsOutput",
}) as any as S.Schema<ListAccountAssociationsOutput>;
export interface ListBillingGroupCostReportsOutput {
  BillingGroupCostReports?: BillingGroupCostReportList;
  NextToken?: string;
}
export const ListBillingGroupCostReportsOutput = S.suspend(() =>
  S.Struct({
    BillingGroupCostReports: S.optional(BillingGroupCostReportList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillingGroupCostReportsOutput",
}) as any as S.Schema<ListBillingGroupCostReportsOutput>;
export interface CreateCustomLineItemOutput {
  Arn?: string;
}
export const CreateCustomLineItemOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateCustomLineItemOutput",
}) as any as S.Schema<CreateCustomLineItemOutput>;
export interface ListCustomLineItemFlatChargeDetails {
  ChargeValue: number;
}
export const ListCustomLineItemFlatChargeDetails = S.suspend(() =>
  S.Struct({ ChargeValue: S.Number }),
).annotations({
  identifier: "ListCustomLineItemFlatChargeDetails",
}) as any as S.Schema<ListCustomLineItemFlatChargeDetails>;
export interface ListCustomLineItemPercentageChargeDetails {
  PercentageValue: number;
}
export const ListCustomLineItemPercentageChargeDetails = S.suspend(() =>
  S.Struct({ PercentageValue: S.Number }),
).annotations({
  identifier: "ListCustomLineItemPercentageChargeDetails",
}) as any as S.Schema<ListCustomLineItemPercentageChargeDetails>;
export interface ListCustomLineItemChargeDetails {
  Flat?: ListCustomLineItemFlatChargeDetails;
  Percentage?: ListCustomLineItemPercentageChargeDetails;
  Type: string;
  LineItemFilters?: LineItemFiltersList;
}
export const ListCustomLineItemChargeDetails = S.suspend(() =>
  S.Struct({
    Flat: S.optional(ListCustomLineItemFlatChargeDetails),
    Percentage: S.optional(ListCustomLineItemPercentageChargeDetails),
    Type: S.String,
    LineItemFilters: S.optional(LineItemFiltersList),
  }),
).annotations({
  identifier: "ListCustomLineItemChargeDetails",
}) as any as S.Schema<ListCustomLineItemChargeDetails>;
export interface UpdateCustomLineItemOutput {
  Arn?: string;
  BillingGroupArn?: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  ChargeDetails?: ListCustomLineItemChargeDetails;
  LastModifiedTime?: number;
  AssociationSize?: number;
}
export const UpdateCustomLineItemOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    BillingGroupArn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
    ChargeDetails: S.optional(ListCustomLineItemChargeDetails),
    LastModifiedTime: S.optional(S.Number),
    AssociationSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdateCustomLineItemOutput",
}) as any as S.Schema<UpdateCustomLineItemOutput>;
export interface BatchAssociateResourcesToCustomLineItemOutput {
  SuccessfullyAssociatedResources?: AssociateResourcesResponseList;
  FailedAssociatedResources?: AssociateResourcesResponseList;
}
export const BatchAssociateResourcesToCustomLineItemOutput = S.suspend(() =>
  S.Struct({
    SuccessfullyAssociatedResources: S.optional(AssociateResourcesResponseList),
    FailedAssociatedResources: S.optional(AssociateResourcesResponseList),
  }),
).annotations({
  identifier: "BatchAssociateResourcesToCustomLineItemOutput",
}) as any as S.Schema<BatchAssociateResourcesToCustomLineItemOutput>;
export interface ListResourcesAssociatedToCustomLineItemOutput {
  Arn?: string;
  AssociatedResources?: ListResourcesAssociatedToCustomLineItemResponseList;
  NextToken?: string;
}
export const ListResourcesAssociatedToCustomLineItemOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AssociatedResources: S.optional(
      ListResourcesAssociatedToCustomLineItemResponseList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourcesAssociatedToCustomLineItemOutput",
}) as any as S.Schema<ListResourcesAssociatedToCustomLineItemOutput>;
export interface ListPricingPlansOutput {
  BillingPeriod?: string;
  PricingPlans?: PricingPlanList;
  NextToken?: string;
}
export const ListPricingPlansOutput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    PricingPlans: S.optional(PricingPlanList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPricingPlansOutput",
}) as any as S.Schema<ListPricingPlansOutput>;
export interface CreatePricingRuleOutput {
  Arn?: string;
}
export const CreatePricingRuleOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreatePricingRuleOutput",
}) as any as S.Schema<CreatePricingRuleOutput>;
export interface UpdatePricingRuleOutput {
  Arn?: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  Scope?: string;
  Type?: string;
  ModifierPercentage?: number;
  Service?: string;
  AssociatedPricingPlanCount?: number;
  LastModifiedTime?: number;
  BillingEntity?: string;
  Tiering?: UpdateTieringInput;
  UsageType?: string;
  Operation?: string;
}
export const UpdatePricingRuleOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
    Scope: S.optional(S.String),
    Type: S.optional(S.String),
    ModifierPercentage: S.optional(S.Number),
    Service: S.optional(S.String),
    AssociatedPricingPlanCount: S.optional(S.Number),
    LastModifiedTime: S.optional(S.Number),
    BillingEntity: S.optional(S.String),
    Tiering: S.optional(UpdateTieringInput),
    UsageType: S.optional(S.String),
    Operation: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdatePricingRuleOutput",
}) as any as S.Schema<UpdatePricingRuleOutput>;
export interface Attribute {
  Key?: string;
  Value?: string;
}
export const Attribute = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Attribute" }) as any as S.Schema<Attribute>;
export type AttributesList = Attribute[];
export const AttributesList = S.Array(Attribute);
export interface BillingGroupCostReportResultElement {
  Arn?: string;
  AWSCost?: string;
  ProformaCost?: string;
  Margin?: string;
  MarginPercentage?: string;
  Currency?: string;
  Attributes?: AttributesList;
}
export const BillingGroupCostReportResultElement = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AWSCost: S.optional(S.String),
    ProformaCost: S.optional(S.String),
    Margin: S.optional(S.String),
    MarginPercentage: S.optional(S.String),
    Currency: S.optional(S.String),
    Attributes: S.optional(AttributesList),
  }),
).annotations({
  identifier: "BillingGroupCostReportResultElement",
}) as any as S.Schema<BillingGroupCostReportResultElement>;
export type BillingGroupCostReportResultsList =
  BillingGroupCostReportResultElement[];
export const BillingGroupCostReportResultsList = S.Array(
  BillingGroupCostReportResultElement,
);
export interface CustomLineItemVersionListElement {
  Name?: string | Redacted.Redacted<string>;
  ChargeDetails?: ListCustomLineItemChargeDetails;
  CurrencyCode?: string;
  Description?: string | Redacted.Redacted<string>;
  ProductCode?: string;
  BillingGroupArn?: string;
  CreationTime?: number;
  LastModifiedTime?: number;
  AssociationSize?: number;
  StartBillingPeriod?: string;
  EndBillingPeriod?: string;
  Arn?: string;
  StartTime?: number;
  AccountId?: string;
  ComputationRule?: string;
  PresentationDetails?: PresentationObject;
}
export const CustomLineItemVersionListElement = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    ChargeDetails: S.optional(ListCustomLineItemChargeDetails),
    CurrencyCode: S.optional(S.String),
    Description: S.optional(SensitiveString),
    ProductCode: S.optional(S.String),
    BillingGroupArn: S.optional(S.String),
    CreationTime: S.optional(S.Number),
    LastModifiedTime: S.optional(S.Number),
    AssociationSize: S.optional(S.Number),
    StartBillingPeriod: S.optional(S.String),
    EndBillingPeriod: S.optional(S.String),
    Arn: S.optional(S.String),
    StartTime: S.optional(S.Number),
    AccountId: S.optional(S.String),
    ComputationRule: S.optional(S.String),
    PresentationDetails: S.optional(PresentationObject),
  }),
).annotations({
  identifier: "CustomLineItemVersionListElement",
}) as any as S.Schema<CustomLineItemVersionListElement>;
export type CustomLineItemVersionList = CustomLineItemVersionListElement[];
export const CustomLineItemVersionList = S.Array(
  CustomLineItemVersionListElement,
);
export interface FreeTierConfig {
  Activated: boolean;
}
export const FreeTierConfig = S.suspend(() =>
  S.Struct({ Activated: S.Boolean }),
).annotations({
  identifier: "FreeTierConfig",
}) as any as S.Schema<FreeTierConfig>;
export interface GetBillingGroupCostReportOutput {
  BillingGroupCostReportResults?: BillingGroupCostReportResultsList;
  NextToken?: string;
}
export const GetBillingGroupCostReportOutput = S.suspend(() =>
  S.Struct({
    BillingGroupCostReportResults: S.optional(
      BillingGroupCostReportResultsList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBillingGroupCostReportOutput",
}) as any as S.Schema<GetBillingGroupCostReportOutput>;
export interface ListCustomLineItemVersionsOutput {
  CustomLineItemVersions?: CustomLineItemVersionList;
  NextToken?: string;
}
export const ListCustomLineItemVersionsOutput = S.suspend(() =>
  S.Struct({
    CustomLineItemVersions: S.optional(CustomLineItemVersionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomLineItemVersionsOutput",
}) as any as S.Schema<ListCustomLineItemVersionsOutput>;
export interface ListBillingGroupAccountGrouping {
  AutoAssociate?: boolean;
  ResponsibilityTransferArn?: string;
}
export const ListBillingGroupAccountGrouping = S.suspend(() =>
  S.Struct({
    AutoAssociate: S.optional(S.Boolean),
    ResponsibilityTransferArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillingGroupAccountGrouping",
}) as any as S.Schema<ListBillingGroupAccountGrouping>;
export interface Tiering {
  FreeTier: FreeTierConfig;
}
export const Tiering = S.suspend(() =>
  S.Struct({ FreeTier: FreeTierConfig }),
).annotations({ identifier: "Tiering" }) as any as S.Schema<Tiering>;
export interface BillingGroupListElement {
  Name?: string | Redacted.Redacted<string>;
  Arn?: string;
  Description?: string | Redacted.Redacted<string>;
  PrimaryAccountId?: string;
  ComputationPreference?: ComputationPreference;
  Size?: number;
  CreationTime?: number;
  LastModifiedTime?: number;
  Status?: string;
  StatusReason?: string;
  AccountGrouping?: ListBillingGroupAccountGrouping;
  BillingGroupType?: string;
}
export const BillingGroupListElement = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    Arn: S.optional(S.String),
    Description: S.optional(SensitiveString),
    PrimaryAccountId: S.optional(S.String),
    ComputationPreference: S.optional(ComputationPreference),
    Size: S.optional(S.Number),
    CreationTime: S.optional(S.Number),
    LastModifiedTime: S.optional(S.Number),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    AccountGrouping: S.optional(ListBillingGroupAccountGrouping),
    BillingGroupType: S.optional(S.String),
  }),
).annotations({
  identifier: "BillingGroupListElement",
}) as any as S.Schema<BillingGroupListElement>;
export type BillingGroupList = BillingGroupListElement[];
export const BillingGroupList = S.Array(BillingGroupListElement);
export interface CustomLineItemListElement {
  Arn?: string;
  Name?: string | Redacted.Redacted<string>;
  ChargeDetails?: ListCustomLineItemChargeDetails;
  CurrencyCode?: string;
  Description?: string | Redacted.Redacted<string>;
  ProductCode?: string;
  BillingGroupArn?: string;
  CreationTime?: number;
  LastModifiedTime?: number;
  AssociationSize?: number;
  AccountId?: string;
  ComputationRule?: string;
  PresentationDetails?: PresentationObject;
}
export const CustomLineItemListElement = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    ChargeDetails: S.optional(ListCustomLineItemChargeDetails),
    CurrencyCode: S.optional(S.String),
    Description: S.optional(SensitiveString),
    ProductCode: S.optional(S.String),
    BillingGroupArn: S.optional(S.String),
    CreationTime: S.optional(S.Number),
    LastModifiedTime: S.optional(S.Number),
    AssociationSize: S.optional(S.Number),
    AccountId: S.optional(S.String),
    ComputationRule: S.optional(S.String),
    PresentationDetails: S.optional(PresentationObject),
  }),
).annotations({
  identifier: "CustomLineItemListElement",
}) as any as S.Schema<CustomLineItemListElement>;
export type CustomLineItemList = CustomLineItemListElement[];
export const CustomLineItemList = S.Array(CustomLineItemListElement);
export interface PricingRuleListElement {
  Name?: string | Redacted.Redacted<string>;
  Arn?: string;
  Description?: string | Redacted.Redacted<string>;
  Scope?: string;
  Type?: string;
  ModifierPercentage?: number;
  Service?: string;
  AssociatedPricingPlanCount?: number;
  CreationTime?: number;
  LastModifiedTime?: number;
  BillingEntity?: string;
  Tiering?: Tiering;
  UsageType?: string;
  Operation?: string;
}
export const PricingRuleListElement = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    Arn: S.optional(S.String),
    Description: S.optional(SensitiveString),
    Scope: S.optional(S.String),
    Type: S.optional(S.String),
    ModifierPercentage: S.optional(S.Number),
    Service: S.optional(S.String),
    AssociatedPricingPlanCount: S.optional(S.Number),
    CreationTime: S.optional(S.Number),
    LastModifiedTime: S.optional(S.Number),
    BillingEntity: S.optional(S.String),
    Tiering: S.optional(Tiering),
    UsageType: S.optional(S.String),
    Operation: S.optional(S.String),
  }),
).annotations({
  identifier: "PricingRuleListElement",
}) as any as S.Schema<PricingRuleListElement>;
export type PricingRuleList = PricingRuleListElement[];
export const PricingRuleList = S.Array(PricingRuleListElement);
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface ListBillingGroupsOutput {
  BillingGroups?: BillingGroupList;
  NextToken?: string;
}
export const ListBillingGroupsOutput = S.suspend(() =>
  S.Struct({
    BillingGroups: S.optional(BillingGroupList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillingGroupsOutput",
}) as any as S.Schema<ListBillingGroupsOutput>;
export interface ListCustomLineItemsOutput {
  CustomLineItems?: CustomLineItemList;
  NextToken?: string;
}
export const ListCustomLineItemsOutput = S.suspend(() =>
  S.Struct({
    CustomLineItems: S.optional(CustomLineItemList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomLineItemsOutput",
}) as any as S.Schema<ListCustomLineItemsOutput>;
export interface ListPricingRulesOutput {
  BillingPeriod?: string;
  PricingRules?: PricingRuleList;
  NextToken?: string;
}
export const ListPricingRulesOutput = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.optional(S.String),
    PricingRules: S.optional(PricingRuleList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPricingRulesOutput",
}) as any as S.Schema<ListPricingRulesOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    Reason: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ServiceLimitExceededException extends S.TaggedError<ServiceLimitExceededException>()(
  "ServiceLimitExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    LimitCode: S.String,
    ServiceCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes a billing group.
 */
export const deleteBillingGroup: (
  input: DeleteBillingGroupInput,
) => Effect.Effect<
  DeleteBillingGroupOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBillingGroupInput,
  output: DeleteBillingGroupOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a batch of resources from a percentage custom line item.
 */
export const batchDisassociateResourcesFromCustomLineItem: (
  input: BatchDisassociateResourcesFromCustomLineItemInput,
) => Effect.Effect<
  BatchDisassociateResourcesFromCustomLineItemOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDisassociateResourcesFromCustomLineItemInput,
  output: BatchDisassociateResourcesFromCustomLineItemOutput,
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
 * A list of the pricing plans that are associated with a pricing rule.
 */
export const listPricingPlansAssociatedWithPricingRule: {
  (
    input: ListPricingPlansAssociatedWithPricingRuleInput,
  ): Effect.Effect<
    ListPricingPlansAssociatedWithPricingRuleOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPricingPlansAssociatedWithPricingRuleInput,
  ) => Stream.Stream<
    ListPricingPlansAssociatedWithPricingRuleOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPricingPlansAssociatedWithPricingRuleInput,
  ) => Stream.Stream<
    PricingPlanArn,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPricingPlansAssociatedWithPricingRuleInput,
  output: ListPricingPlansAssociatedWithPricingRuleOutput,
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
    items: "PricingPlanArns",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the pricing rules that are associated with a pricing plan.
 */
export const listPricingRulesAssociatedToPricingPlan: {
  (
    input: ListPricingRulesAssociatedToPricingPlanInput,
  ): Effect.Effect<
    ListPricingRulesAssociatedToPricingPlanOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPricingRulesAssociatedToPricingPlanInput,
  ) => Stream.Stream<
    ListPricingRulesAssociatedToPricingPlanOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPricingRulesAssociatedToPricingPlanInput,
  ) => Stream.Stream<
    PricingRuleArn,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPricingRulesAssociatedToPricingPlanInput,
  output: ListPricingRulesAssociatedToPricingPlanOutput,
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
    items: "PricingRuleArns",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * A list the tags for a resource.
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
 * Associates the specified tags to a resource with the specified `resourceArn`. If existing tags on a resource are not specified in the request parameters, they are not changed.
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
 * Removes the specified list of account IDs from the given billing group.
 */
export const disassociateAccounts: (
  input: DisassociateAccountsInput,
) => Effect.Effect<
  DisassociateAccountsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAccountsInput,
  output: DisassociateAccountsOutput,
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
 * This updates an existing pricing plan.
 */
export const updatePricingPlan: (
  input: UpdatePricingPlanInput,
) => Effect.Effect<
  UpdatePricingPlanOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePricingPlanInput,
  output: UpdatePricingPlanOutput,
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
 * Disassociates a list of pricing rules from a pricing plan.
 */
export const disassociatePricingRules: (
  input: DisassociatePricingRulesInput,
) => Effect.Effect<
  DisassociatePricingRulesOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociatePricingRulesInput,
  output: DisassociatePricingRulesOutput,
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
 * This updates an existing billing group.
 */
export const updateBillingGroup: (
  input: UpdateBillingGroupInput,
) => Effect.Effect<
  UpdateBillingGroupOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBillingGroupInput,
  output: UpdateBillingGroupOutput,
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
 * This is a paginated call to list linked accounts that are linked to the payer account for the specified time period. If no information is provided, the current billing period is used. The response will optionally include the billing group that's associated with the linked account.
 */
export const listAccountAssociations: {
  (
    input: ListAccountAssociationsInput,
  ): Effect.Effect<
    ListAccountAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountAssociationsInput,
  ) => Stream.Stream<
    ListAccountAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountAssociationsInput,
  ) => Stream.Stream<
    AccountAssociationsListElement,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountAssociationsInput,
  output: ListAccountAssociationsOutput,
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
    items: "LinkedAccounts",
  } as const,
}));
/**
 * A paginated call to retrieve a summary report of actual Amazon Web Services charges and the calculated Amazon Web Services charges based on the associated pricing plan of a billing group.
 */
export const listBillingGroupCostReports: {
  (
    input: ListBillingGroupCostReportsInput,
  ): Effect.Effect<
    ListBillingGroupCostReportsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillingGroupCostReportsInput,
  ) => Stream.Stream<
    ListBillingGroupCostReportsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillingGroupCostReportsInput,
  ) => Stream.Stream<
    BillingGroupCostReportElement,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBillingGroupCostReportsInput,
  output: ListBillingGroupCostReportsOutput,
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
    items: "BillingGroupCostReports",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a billing group that resembles a consolidated billing family that Amazon Web Services charges, based off of the predefined pricing plan computation.
 */
export const createBillingGroup: (
  input: CreateBillingGroupInput,
) => Effect.Effect<
  CreateBillingGroupOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBillingGroupInput,
  output: CreateBillingGroupOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the custom line item identified by the given ARN in the current, or previous billing period.
 */
export const deleteCustomLineItem: (
  input: DeleteCustomLineItemInput,
) => Effect.Effect<
  DeleteCustomLineItemOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomLineItemInput,
  output: DeleteCustomLineItemOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a pricing plan. The pricing plan must not be associated with any billing groups to delete successfully.
 */
export const deletePricingPlan: (
  input: DeletePricingPlanInput,
) => Effect.Effect<
  DeletePricingPlanOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePricingPlanInput,
  output: DeletePricingPlanOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the pricing rule that's identified by the input Amazon Resource Name (ARN).
 */
export const deletePricingRule: (
  input: DeletePricingRuleInput,
) => Effect.Effect<
  DeletePricingRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePricingRuleInput,
  output: DeletePricingRuleOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes specified tags from a resource.
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
 * Update an existing custom line item in the current or previous billing period.
 */
export const updateCustomLineItem: (
  input: UpdateCustomLineItemInput,
) => Effect.Effect<
  UpdateCustomLineItemOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomLineItemInput,
  output: UpdateCustomLineItemOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List the resources that are associated to a custom line item.
 */
export const listResourcesAssociatedToCustomLineItem: {
  (
    input: ListResourcesAssociatedToCustomLineItemInput,
  ): Effect.Effect<
    ListResourcesAssociatedToCustomLineItemOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcesAssociatedToCustomLineItemInput,
  ) => Stream.Stream<
    ListResourcesAssociatedToCustomLineItemOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcesAssociatedToCustomLineItemInput,
  ) => Stream.Stream<
    ListResourcesAssociatedToCustomLineItemResponseElement,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourcesAssociatedToCustomLineItemInput,
  output: ListResourcesAssociatedToCustomLineItemOutput,
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
    items: "AssociatedResources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * A paginated call to get pricing plans for the given billing period. If you don't provide a billing period, the current billing period is used.
 */
export const listPricingPlans: {
  (
    input: ListPricingPlansInput,
  ): Effect.Effect<
    ListPricingPlansOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPricingPlansInput,
  ) => Stream.Stream<
    ListPricingPlansOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPricingPlansInput,
  ) => Stream.Stream<
    PricingPlanListElement,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPricingPlansInput,
  output: ListPricingPlansOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PricingPlans",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates an existing pricing rule.
 */
export const updatePricingRule: (
  input: UpdatePricingRuleInput,
) => Effect.Effect<
  UpdatePricingRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePricingRuleInput,
  output: UpdatePricingRuleOutput,
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
 * Creates a custom line item that can be used to create a one-time fixed charge that can be applied to a single billing group for the current or previous billing period. The one-time fixed charge is either a fee or discount.
 */
export const createCustomLineItem: (
  input: CreateCustomLineItemInput,
) => Effect.Effect<
  CreateCustomLineItemOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomLineItemInput,
  output: CreateCustomLineItemOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates a batch of resources to a percentage custom line item.
 */
export const batchAssociateResourcesToCustomLineItem: (
  input: BatchAssociateResourcesToCustomLineItemInput,
) => Effect.Effect<
  BatchAssociateResourcesToCustomLineItemOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAssociateResourcesToCustomLineItemInput,
  output: BatchAssociateResourcesToCustomLineItemOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a pricing rule can be associated to a pricing plan, or a set of pricing plans.
 */
export const createPricingRule: (
  input: CreatePricingRuleInput,
) => Effect.Effect<
  CreatePricingRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePricingRuleInput,
  output: CreatePricingRuleOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Connects an array of account IDs in a consolidated billing family to a predefined billing group. The account IDs must be a part of the consolidated billing family during the current month, and not already associated with another billing group. The maximum number of accounts that can be associated in one call is 30.
 */
export const associateAccounts: (
  input: AssociateAccountsInput,
) => Effect.Effect<
  AssociateAccountsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAccountsInput,
  output: AssociateAccountsOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a pricing plan that is used for computing Amazon Web Services charges for billing groups.
 */
export const createPricingPlan: (
  input: CreatePricingPlanInput,
) => Effect.Effect<
  CreatePricingPlanOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePricingPlanInput,
  output: CreatePricingPlanOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Connects an array of `PricingRuleArns` to a defined `PricingPlan`. The maximum number `PricingRuleArn` that can be associated in one call is 30.
 */
export const associatePricingRules: (
  input: AssociatePricingRulesInput,
) => Effect.Effect<
  AssociatePricingRulesOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociatePricingRulesInput,
  output: AssociatePricingRulesOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the margin summary report, which includes the Amazon Web Services cost and charged amount (pro forma cost) by Amazon Web Services service for a specific billing group.
 */
export const getBillingGroupCostReport: {
  (
    input: GetBillingGroupCostReportInput,
  ): Effect.Effect<
    GetBillingGroupCostReportOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBillingGroupCostReportInput,
  ) => Stream.Stream<
    GetBillingGroupCostReportOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBillingGroupCostReportInput,
  ) => Stream.Stream<
    BillingGroupCostReportResultElement,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBillingGroupCostReportInput,
  output: GetBillingGroupCostReportOutput,
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
    items: "BillingGroupCostReportResults",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * A paginated call to get a list of all custom line item versions.
 */
export const listCustomLineItemVersions: {
  (
    input: ListCustomLineItemVersionsInput,
  ): Effect.Effect<
    ListCustomLineItemVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomLineItemVersionsInput,
  ) => Stream.Stream<
    ListCustomLineItemVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomLineItemVersionsInput,
  ) => Stream.Stream<
    CustomLineItemVersionListElement,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomLineItemVersionsInput,
  output: ListCustomLineItemVersionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CustomLineItemVersions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * A paginated call to retrieve a list of billing groups for the given billing period. If you don't provide a billing group, the current billing period is used.
 */
export const listBillingGroups: {
  (
    input: ListBillingGroupsInput,
  ): Effect.Effect<
    ListBillingGroupsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillingGroupsInput,
  ) => Stream.Stream<
    ListBillingGroupsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillingGroupsInput,
  ) => Stream.Stream<
    BillingGroupListElement,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBillingGroupsInput,
  output: ListBillingGroupsOutput,
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
    items: "BillingGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * A paginated call to get a list of all custom line items (FFLIs) for the given billing period. If you don't provide a billing period, the current billing period is used.
 */
export const listCustomLineItems: {
  (
    input: ListCustomLineItemsInput,
  ): Effect.Effect<
    ListCustomLineItemsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomLineItemsInput,
  ) => Stream.Stream<
    ListCustomLineItemsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomLineItemsInput,
  ) => Stream.Stream<
    CustomLineItemListElement,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomLineItemsInput,
  output: ListCustomLineItemsOutput,
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
    items: "CustomLineItems",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes a pricing rule that can be associated to a pricing plan, or set of pricing plans.
 */
export const listPricingRules: {
  (
    input: ListPricingRulesInput,
  ): Effect.Effect<
    ListPricingRulesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPricingRulesInput,
  ) => Stream.Stream<
    ListPricingRulesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPricingRulesInput,
  ) => Stream.Stream<
    PricingRuleListElement,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPricingRulesInput,
  output: ListPricingRulesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PricingRules",
    pageSize: "MaxResults",
  } as const,
}));

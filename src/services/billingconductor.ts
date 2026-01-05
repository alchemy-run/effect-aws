import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "billingconductor",
  serviceShapeName: "AWSBillingConductor",
});
const auth = T.AwsAuthSigv4({ name: "billingconductor" });
const ver = T.ServiceVersion("2021-07-30");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          error:
            "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Region" }] }],
      rules: [
        {
          conditions: [
            {
              fn: "aws.partition",
              argv: [{ ref: "Region" }],
              assign: "PartitionResult",
            },
          ],
          rules: [
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, false] },
              ],
              endpoint: {
                url: "https://billingconductor.us-east-1.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "billingconductor",
                      signingRegion: "us-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                      ],
                    },
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://billingconductor-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS and DualStack are enabled, but this partition does not support one or both",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://billingconductor-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS is enabled but this partition does not support FIPS",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://billingconductor.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "DualStack is enabled but this partition does not support DualStack",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://billingconductor.{Region}.{PartitionResult#dnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      error: "Invalid Configuration: Missing Region",
      type: "error",
    },
  ],
});

//# Schemas
export const GroupByAttributesList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const AccountIdList = S.Array(S.String);
export const CustomLineItemBatchAssociationsList = S.Array(S.String);
export const CustomLineItemBatchDisassociationsList = S.Array(S.String);
export const PricingRuleArnsInput = S.Array(S.String);
export const PricingRuleArnsNonEmptyInput = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class DeleteBillingGroupInput extends S.Class<DeleteBillingGroupInput>(
  "DeleteBillingGroupInput",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/delete-billing-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateAccountsInput extends S.Class<AssociateAccountsInput>(
  "AssociateAccountsInput",
)(
  { Arn: S.String, AccountIds: AccountIdList },
  T.all(
    T.Http({ method: "POST", uri: "/associate-accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAccountsInput extends S.Class<DisassociateAccountsInput>(
  "DisassociateAccountsInput",
)(
  { Arn: S.String, AccountIds: AccountIdList },
  T.all(
    T.Http({ method: "POST", uri: "/disassociate-accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CustomLineItemBillingPeriodRange extends S.Class<CustomLineItemBillingPeriodRange>(
  "CustomLineItemBillingPeriodRange",
)({
  InclusiveStartBillingPeriod: S.String,
  ExclusiveEndBillingPeriod: S.optional(S.String),
}) {}
export class DeleteCustomLineItemInput extends S.Class<DeleteCustomLineItemInput>(
  "DeleteCustomLineItemInput",
)(
  {
    Arn: S.String,
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
  },
  T.all(
    T.Http({ method: "POST", uri: "/delete-custom-line-item" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchAssociateResourcesToCustomLineItemInput extends S.Class<BatchAssociateResourcesToCustomLineItemInput>(
  "BatchAssociateResourcesToCustomLineItemInput",
)(
  {
    TargetArn: S.String,
    ResourceArns: CustomLineItemBatchAssociationsList,
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
  },
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
) {}
export class BatchDisassociateResourcesFromCustomLineItemInput extends S.Class<BatchDisassociateResourcesFromCustomLineItemInput>(
  "BatchDisassociateResourcesFromCustomLineItemInput",
)(
  {
    TargetArn: S.String,
    ResourceArns: CustomLineItemBatchDisassociationsList,
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
  },
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
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreatePricingPlanInput extends S.Class<CreatePricingPlanInput>(
  "CreatePricingPlanInput",
)(
  {
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    Name: S.String,
    Description: S.optional(S.String),
    PricingRuleArns: S.optional(PricingRuleArnsInput),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-pricing-plan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePricingPlanInput extends S.Class<UpdatePricingPlanInput>(
  "UpdatePricingPlanInput",
)(
  {
    Arn: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/update-pricing-plan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePricingPlanInput extends S.Class<DeletePricingPlanInput>(
  "DeletePricingPlanInput",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/delete-pricing-plan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociatePricingRulesInput extends S.Class<AssociatePricingRulesInput>(
  "AssociatePricingRulesInput",
)(
  { Arn: S.String, PricingRuleArns: PricingRuleArnsNonEmptyInput },
  T.all(
    T.Http({ method: "PUT", uri: "/associate-pricing-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociatePricingRulesInput extends S.Class<DisassociatePricingRulesInput>(
  "DisassociatePricingRulesInput",
)(
  { Arn: S.String, PricingRuleArns: PricingRuleArnsNonEmptyInput },
  T.all(
    T.Http({ method: "PUT", uri: "/disassociate-pricing-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPricingPlansAssociatedWithPricingRuleInput extends S.Class<ListPricingPlansAssociatedWithPricingRuleInput>(
  "ListPricingPlansAssociatedWithPricingRuleInput",
)(
  {
    BillingPeriod: S.optional(S.String),
    PricingRuleArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
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
) {}
export class DeletePricingRuleInput extends S.Class<DeletePricingRuleInput>(
  "DeletePricingRuleInput",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/delete-pricing-rule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPricingRulesAssociatedToPricingPlanInput extends S.Class<ListPricingRulesAssociatedToPricingPlanInput>(
  "ListPricingRulesAssociatedToPricingPlanInput",
)(
  {
    BillingPeriod: S.optional(S.String),
    PricingPlanArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
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
) {}
export const AccountIdFilterList = S.Array(S.String);
export const BillingGroupArnList = S.Array(S.String);
export const BillingGroupStatusList = S.Array(S.String);
export const PrimaryAccountIdList = S.Array(S.String);
export const BillingGroupTypeList = S.Array(S.String);
export const ResponsibilityTransferArnsList = S.Array(S.String);
export const CustomLineItemNameList = S.Array(S.String);
export const CustomLineItemArns = S.Array(S.String);
export const PricingPlanArns = S.Array(S.String);
export const PricingRuleArns = S.Array(S.String);
export class BillingPeriodRange extends S.Class<BillingPeriodRange>(
  "BillingPeriodRange",
)({
  InclusiveStartBillingPeriod: S.String,
  ExclusiveEndBillingPeriod: S.String,
}) {}
export class ListAccountAssociationsFilter extends S.Class<ListAccountAssociationsFilter>(
  "ListAccountAssociationsFilter",
)({
  Association: S.optional(S.String),
  AccountId: S.optional(S.String),
  AccountIds: S.optional(AccountIdFilterList),
}) {}
export class ListBillingGroupCostReportsFilter extends S.Class<ListBillingGroupCostReportsFilter>(
  "ListBillingGroupCostReportsFilter",
)({ BillingGroupArns: S.optional(BillingGroupArnList) }) {}
export class AccountGrouping extends S.Class<AccountGrouping>(
  "AccountGrouping",
)({
  LinkedAccountIds: S.optional(AccountIdList),
  AutoAssociate: S.optional(S.Boolean),
  ResponsibilityTransferArn: S.optional(S.String),
}) {}
export class ComputationPreference extends S.Class<ComputationPreference>(
  "ComputationPreference",
)({ PricingPlanArn: S.String }) {}
export class UpdateBillingGroupAccountGrouping extends S.Class<UpdateBillingGroupAccountGrouping>(
  "UpdateBillingGroupAccountGrouping",
)({
  AutoAssociate: S.optional(S.Boolean),
  ResponsibilityTransferArn: S.optional(S.String),
}) {}
export class PresentationObject extends S.Class<PresentationObject>(
  "PresentationObject",
)({ Service: S.String }) {}
export class ListCustomLineItemsFilter extends S.Class<ListCustomLineItemsFilter>(
  "ListCustomLineItemsFilter",
)({
  Names: S.optional(CustomLineItemNameList),
  BillingGroups: S.optional(BillingGroupArnList),
  Arns: S.optional(CustomLineItemArns),
  AccountIds: S.optional(AccountIdList),
}) {}
export class ListResourcesAssociatedToCustomLineItemFilter extends S.Class<ListResourcesAssociatedToCustomLineItemFilter>(
  "ListResourcesAssociatedToCustomLineItemFilter",
)({ Relationship: S.optional(S.String) }) {}
export class ListPricingPlansFilter extends S.Class<ListPricingPlansFilter>(
  "ListPricingPlansFilter",
)({ Arns: S.optional(PricingPlanArns) }) {}
export class ListPricingRulesFilter extends S.Class<ListPricingRulesFilter>(
  "ListPricingRulesFilter",
)({ Arns: S.optional(PricingRuleArns) }) {}
export const CustomLineItemAssociationsList = S.Array(S.String);
export const LineItemFilterValuesList = S.Array(S.String);
export const AttributeValueList = S.Array(S.String);
export class GetBillingGroupCostReportInput extends S.Class<GetBillingGroupCostReportInput>(
  "GetBillingGroupCostReportInput",
)(
  {
    Arn: S.String,
    BillingPeriodRange: S.optional(BillingPeriodRange),
    GroupBy: S.optional(GroupByAttributesList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/get-billing-group-cost-report" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccountAssociationsInput extends S.Class<ListAccountAssociationsInput>(
  "ListAccountAssociationsInput",
)(
  {
    BillingPeriod: S.optional(S.String),
    Filters: S.optional(ListAccountAssociationsFilter),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-account-associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBillingGroupCostReportsInput extends S.Class<ListBillingGroupCostReportsInput>(
  "ListBillingGroupCostReportsInput",
)(
  {
    BillingPeriod: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListBillingGroupCostReportsFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-billing-group-cost-reports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class CreateBillingGroupInput extends S.Class<CreateBillingGroupInput>(
  "CreateBillingGroupInput",
)(
  {
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    Name: S.String,
    AccountGrouping: AccountGrouping,
    ComputationPreference: ComputationPreference,
    PrimaryAccountId: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-billing-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBillingGroupInput extends S.Class<UpdateBillingGroupInput>(
  "UpdateBillingGroupInput",
)(
  {
    Arn: S.String,
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    ComputationPreference: S.optional(ComputationPreference),
    Description: S.optional(S.String),
    AccountGrouping: S.optional(UpdateBillingGroupAccountGrouping),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-billing-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBillingGroupOutput extends S.Class<DeleteBillingGroupOutput>(
  "DeleteBillingGroupOutput",
)({ Arn: S.optional(S.String) }) {}
export class AssociateAccountsOutput extends S.Class<AssociateAccountsOutput>(
  "AssociateAccountsOutput",
)({ Arn: S.optional(S.String) }) {}
export class DisassociateAccountsOutput extends S.Class<DisassociateAccountsOutput>(
  "DisassociateAccountsOutput",
)({ Arn: S.optional(S.String) }) {}
export class DeleteCustomLineItemOutput extends S.Class<DeleteCustomLineItemOutput>(
  "DeleteCustomLineItemOutput",
)({ Arn: S.optional(S.String) }) {}
export class ListCustomLineItemsInput extends S.Class<ListCustomLineItemsInput>(
  "ListCustomLineItemsInput",
)(
  {
    BillingPeriod: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListCustomLineItemsFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-custom-line-items" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourcesAssociatedToCustomLineItemInput extends S.Class<ListResourcesAssociatedToCustomLineItemInput>(
  "ListResourcesAssociatedToCustomLineItemInput",
)(
  {
    BillingPeriod: S.optional(S.String),
    Arn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListResourcesAssociatedToCustomLineItemFilter),
  },
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
) {}
export class CreatePricingPlanOutput extends S.Class<CreatePricingPlanOutput>(
  "CreatePricingPlanOutput",
)({ Arn: S.optional(S.String) }) {}
export class UpdatePricingPlanOutput extends S.Class<UpdatePricingPlanOutput>(
  "UpdatePricingPlanOutput",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Size: S.optional(S.Number),
  LastModifiedTime: S.optional(S.Number),
}) {}
export class DeletePricingPlanOutput extends S.Class<DeletePricingPlanOutput>(
  "DeletePricingPlanOutput",
)({ Arn: S.optional(S.String) }) {}
export class ListPricingPlansInput extends S.Class<ListPricingPlansInput>(
  "ListPricingPlansInput",
)(
  {
    BillingPeriod: S.optional(S.String),
    Filters: S.optional(ListPricingPlansFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-pricing-plans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociatePricingRulesOutput extends S.Class<AssociatePricingRulesOutput>(
  "AssociatePricingRulesOutput",
)({ Arn: S.optional(S.String) }) {}
export class DisassociatePricingRulesOutput extends S.Class<DisassociatePricingRulesOutput>(
  "DisassociatePricingRulesOutput",
)({ Arn: S.optional(S.String) }) {}
export class ListPricingPlansAssociatedWithPricingRuleOutput extends S.Class<ListPricingPlansAssociatedWithPricingRuleOutput>(
  "ListPricingPlansAssociatedWithPricingRuleOutput",
)({
  BillingPeriod: S.optional(S.String),
  PricingRuleArn: S.optional(S.String),
  PricingPlanArns: S.optional(PricingPlanArns),
  NextToken: S.optional(S.String),
}) {}
export class DeletePricingRuleOutput extends S.Class<DeletePricingRuleOutput>(
  "DeletePricingRuleOutput",
)({ Arn: S.optional(S.String) }) {}
export class ListPricingRulesInput extends S.Class<ListPricingRulesInput>(
  "ListPricingRulesInput",
)(
  {
    BillingPeriod: S.optional(S.String),
    Filters: S.optional(ListPricingRulesFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-pricing-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPricingRulesAssociatedToPricingPlanOutput extends S.Class<ListPricingRulesAssociatedToPricingPlanOutput>(
  "ListPricingRulesAssociatedToPricingPlanOutput",
)({
  BillingPeriod: S.optional(S.String),
  PricingPlanArn: S.optional(S.String),
  PricingRuleArns: S.optional(PricingRuleArns),
  NextToken: S.optional(S.String),
}) {}
export class StringSearch extends S.Class<StringSearch>("StringSearch")({
  SearchOption: S.String,
  SearchValue: S.String,
}) {}
export const StringSearches = S.Array(StringSearch);
export class CustomLineItemFlatChargeDetails extends S.Class<CustomLineItemFlatChargeDetails>(
  "CustomLineItemFlatChargeDetails",
)({ ChargeValue: S.Number }) {}
export class CustomLineItemPercentageChargeDetails extends S.Class<CustomLineItemPercentageChargeDetails>(
  "CustomLineItemPercentageChargeDetails",
)({
  PercentageValue: S.Number,
  AssociatedValues: S.optional(CustomLineItemAssociationsList),
}) {}
export class LineItemFilter extends S.Class<LineItemFilter>("LineItemFilter")({
  Attribute: S.String,
  MatchOption: S.String,
  Values: S.optional(LineItemFilterValuesList),
  AttributeValues: S.optional(AttributeValueList),
}) {}
export const LineItemFiltersList = S.Array(LineItemFilter);
export class UpdateCustomLineItemFlatChargeDetails extends S.Class<UpdateCustomLineItemFlatChargeDetails>(
  "UpdateCustomLineItemFlatChargeDetails",
)({ ChargeValue: S.Number }) {}
export class UpdateCustomLineItemPercentageChargeDetails extends S.Class<UpdateCustomLineItemPercentageChargeDetails>(
  "UpdateCustomLineItemPercentageChargeDetails",
)({ PercentageValue: S.Number }) {}
export class ListCustomLineItemVersionsBillingPeriodRangeFilter extends S.Class<ListCustomLineItemVersionsBillingPeriodRangeFilter>(
  "ListCustomLineItemVersionsBillingPeriodRangeFilter",
)({
  StartBillingPeriod: S.optional(S.String),
  EndBillingPeriod: S.optional(S.String),
}) {}
export class CreateFreeTierConfig extends S.Class<CreateFreeTierConfig>(
  "CreateFreeTierConfig",
)({ Activated: S.Boolean }) {}
export class UpdateFreeTierConfig extends S.Class<UpdateFreeTierConfig>(
  "UpdateFreeTierConfig",
)({ Activated: S.Boolean }) {}
export class ListBillingGroupsFilter extends S.Class<ListBillingGroupsFilter>(
  "ListBillingGroupsFilter",
)({
  Arns: S.optional(BillingGroupArnList),
  PricingPlan: S.optional(S.String),
  Statuses: S.optional(BillingGroupStatusList),
  AutoAssociate: S.optional(S.Boolean),
  PrimaryAccountIds: S.optional(PrimaryAccountIdList),
  BillingGroupTypes: S.optional(BillingGroupTypeList),
  Names: S.optional(StringSearches),
  ResponsibilityTransferArns: S.optional(ResponsibilityTransferArnsList),
}) {}
export class CustomLineItemChargeDetails extends S.Class<CustomLineItemChargeDetails>(
  "CustomLineItemChargeDetails",
)({
  Flat: S.optional(CustomLineItemFlatChargeDetails),
  Percentage: S.optional(CustomLineItemPercentageChargeDetails),
  Type: S.String,
  LineItemFilters: S.optional(LineItemFiltersList),
}) {}
export class UpdateCustomLineItemChargeDetails extends S.Class<UpdateCustomLineItemChargeDetails>(
  "UpdateCustomLineItemChargeDetails",
)({
  Flat: S.optional(UpdateCustomLineItemFlatChargeDetails),
  Percentage: S.optional(UpdateCustomLineItemPercentageChargeDetails),
  LineItemFilters: S.optional(LineItemFiltersList),
}) {}
export class AssociateResourceError extends S.Class<AssociateResourceError>(
  "AssociateResourceError",
)({ Message: S.optional(S.String), Reason: S.optional(S.String) }) {}
export class DisassociateResourceResponseElement extends S.Class<DisassociateResourceResponseElement>(
  "DisassociateResourceResponseElement",
)({ Arn: S.optional(S.String), Error: S.optional(AssociateResourceError) }) {}
export const DisassociateResourcesResponseList = S.Array(
  DisassociateResourceResponseElement,
);
export class ListCustomLineItemVersionsFilter extends S.Class<ListCustomLineItemVersionsFilter>(
  "ListCustomLineItemVersionsFilter",
)({
  BillingPeriodRange: S.optional(
    ListCustomLineItemVersionsBillingPeriodRangeFilter,
  ),
}) {}
export class CreateTieringInput extends S.Class<CreateTieringInput>(
  "CreateTieringInput",
)({ FreeTier: CreateFreeTierConfig }) {}
export class UpdateTieringInput extends S.Class<UpdateTieringInput>(
  "UpdateTieringInput",
)({ FreeTier: UpdateFreeTierConfig }) {}
export class CreateBillingGroupOutput extends S.Class<CreateBillingGroupOutput>(
  "CreateBillingGroupOutput",
)({ Arn: S.optional(S.String) }) {}
export class UpdateBillingGroupOutput extends S.Class<UpdateBillingGroupOutput>(
  "UpdateBillingGroupOutput",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  PrimaryAccountId: S.optional(S.String),
  PricingPlanArn: S.optional(S.String),
  Size: S.optional(S.Number),
  LastModifiedTime: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  AccountGrouping: S.optional(UpdateBillingGroupAccountGrouping),
}) {}
export class ListBillingGroupsInput extends S.Class<ListBillingGroupsInput>(
  "ListBillingGroupsInput",
)(
  {
    BillingPeriod: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListBillingGroupsFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-billing-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCustomLineItemInput extends S.Class<CreateCustomLineItemInput>(
  "CreateCustomLineItemInput",
)(
  {
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    Name: S.String,
    Description: S.String,
    BillingGroupArn: S.String,
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
    Tags: S.optional(TagMap),
    ChargeDetails: CustomLineItemChargeDetails,
    AccountId: S.optional(S.String),
    ComputationRule: S.optional(S.String),
    PresentationDetails: S.optional(PresentationObject),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-custom-line-item" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCustomLineItemInput extends S.Class<UpdateCustomLineItemInput>(
  "UpdateCustomLineItemInput",
)(
  {
    Arn: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ChargeDetails: S.optional(UpdateCustomLineItemChargeDetails),
    BillingPeriodRange: S.optional(CustomLineItemBillingPeriodRange),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-custom-line-item" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDisassociateResourcesFromCustomLineItemOutput extends S.Class<BatchDisassociateResourcesFromCustomLineItemOutput>(
  "BatchDisassociateResourcesFromCustomLineItemOutput",
)({
  SuccessfullyDisassociatedResources: S.optional(
    DisassociateResourcesResponseList,
  ),
  FailedDisassociatedResources: S.optional(DisassociateResourcesResponseList),
}) {}
export class ListCustomLineItemVersionsInput extends S.Class<ListCustomLineItemVersionsInput>(
  "ListCustomLineItemVersionsInput",
)(
  {
    Arn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(ListCustomLineItemVersionsFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-custom-line-item-versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePricingRuleInput extends S.Class<CreatePricingRuleInput>(
  "CreatePricingRuleInput",
)(
  {
    ClientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    Name: S.String,
    Description: S.optional(S.String),
    Scope: S.String,
    Type: S.String,
    ModifierPercentage: S.optional(S.Number),
    Service: S.optional(S.String),
    Tags: S.optional(TagMap),
    BillingEntity: S.optional(S.String),
    Tiering: S.optional(CreateTieringInput),
    UsageType: S.optional(S.String),
    Operation: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-pricing-rule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePricingRuleInput extends S.Class<UpdatePricingRuleInput>(
  "UpdatePricingRuleInput",
)(
  {
    Arn: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    ModifierPercentage: S.optional(S.Number),
    Tiering: S.optional(UpdateTieringInput),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/update-pricing-rule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AccountAssociationsListElement extends S.Class<AccountAssociationsListElement>(
  "AccountAssociationsListElement",
)({
  AccountId: S.optional(S.String),
  BillingGroupArn: S.optional(S.String),
  AccountName: S.optional(S.String),
  AccountEmail: S.optional(S.String),
}) {}
export const AccountAssociationsList = S.Array(AccountAssociationsListElement);
export class BillingGroupCostReportElement extends S.Class<BillingGroupCostReportElement>(
  "BillingGroupCostReportElement",
)({
  Arn: S.optional(S.String),
  AWSCost: S.optional(S.String),
  ProformaCost: S.optional(S.String),
  Margin: S.optional(S.String),
  MarginPercentage: S.optional(S.String),
  Currency: S.optional(S.String),
}) {}
export const BillingGroupCostReportList = S.Array(
  BillingGroupCostReportElement,
);
export class AssociateResourceResponseElement extends S.Class<AssociateResourceResponseElement>(
  "AssociateResourceResponseElement",
)({ Arn: S.optional(S.String), Error: S.optional(AssociateResourceError) }) {}
export const AssociateResourcesResponseList = S.Array(
  AssociateResourceResponseElement,
);
export class ListResourcesAssociatedToCustomLineItemResponseElement extends S.Class<ListResourcesAssociatedToCustomLineItemResponseElement>(
  "ListResourcesAssociatedToCustomLineItemResponseElement",
)({
  Arn: S.optional(S.String),
  Relationship: S.optional(S.String),
  EndBillingPeriod: S.optional(S.String),
}) {}
export const ListResourcesAssociatedToCustomLineItemResponseList = S.Array(
  ListResourcesAssociatedToCustomLineItemResponseElement,
);
export class PricingPlanListElement extends S.Class<PricingPlanListElement>(
  "PricingPlanListElement",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  Size: S.optional(S.Number),
  CreationTime: S.optional(S.Number),
  LastModifiedTime: S.optional(S.Number),
}) {}
export const PricingPlanList = S.Array(PricingPlanListElement);
export class ListAccountAssociationsOutput extends S.Class<ListAccountAssociationsOutput>(
  "ListAccountAssociationsOutput",
)({
  LinkedAccounts: S.optional(AccountAssociationsList),
  NextToken: S.optional(S.String),
}) {}
export class ListBillingGroupCostReportsOutput extends S.Class<ListBillingGroupCostReportsOutput>(
  "ListBillingGroupCostReportsOutput",
)({
  BillingGroupCostReports: S.optional(BillingGroupCostReportList),
  NextToken: S.optional(S.String),
}) {}
export class CreateCustomLineItemOutput extends S.Class<CreateCustomLineItemOutput>(
  "CreateCustomLineItemOutput",
)({ Arn: S.optional(S.String) }) {}
export class ListCustomLineItemFlatChargeDetails extends S.Class<ListCustomLineItemFlatChargeDetails>(
  "ListCustomLineItemFlatChargeDetails",
)({ ChargeValue: S.Number }) {}
export class ListCustomLineItemPercentageChargeDetails extends S.Class<ListCustomLineItemPercentageChargeDetails>(
  "ListCustomLineItemPercentageChargeDetails",
)({ PercentageValue: S.Number }) {}
export class ListCustomLineItemChargeDetails extends S.Class<ListCustomLineItemChargeDetails>(
  "ListCustomLineItemChargeDetails",
)({
  Flat: S.optional(ListCustomLineItemFlatChargeDetails),
  Percentage: S.optional(ListCustomLineItemPercentageChargeDetails),
  Type: S.String,
  LineItemFilters: S.optional(LineItemFiltersList),
}) {}
export class UpdateCustomLineItemOutput extends S.Class<UpdateCustomLineItemOutput>(
  "UpdateCustomLineItemOutput",
)({
  Arn: S.optional(S.String),
  BillingGroupArn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  ChargeDetails: S.optional(ListCustomLineItemChargeDetails),
  LastModifiedTime: S.optional(S.Number),
  AssociationSize: S.optional(S.Number),
}) {}
export class BatchAssociateResourcesToCustomLineItemOutput extends S.Class<BatchAssociateResourcesToCustomLineItemOutput>(
  "BatchAssociateResourcesToCustomLineItemOutput",
)({
  SuccessfullyAssociatedResources: S.optional(AssociateResourcesResponseList),
  FailedAssociatedResources: S.optional(AssociateResourcesResponseList),
}) {}
export class ListResourcesAssociatedToCustomLineItemOutput extends S.Class<ListResourcesAssociatedToCustomLineItemOutput>(
  "ListResourcesAssociatedToCustomLineItemOutput",
)({
  Arn: S.optional(S.String),
  AssociatedResources: S.optional(
    ListResourcesAssociatedToCustomLineItemResponseList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListPricingPlansOutput extends S.Class<ListPricingPlansOutput>(
  "ListPricingPlansOutput",
)({
  BillingPeriod: S.optional(S.String),
  PricingPlans: S.optional(PricingPlanList),
  NextToken: S.optional(S.String),
}) {}
export class CreatePricingRuleOutput extends S.Class<CreatePricingRuleOutput>(
  "CreatePricingRuleOutput",
)({ Arn: S.optional(S.String) }) {}
export class UpdatePricingRuleOutput extends S.Class<UpdatePricingRuleOutput>(
  "UpdatePricingRuleOutput",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
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
}) {}
export class Attribute extends S.Class<Attribute>("Attribute")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const AttributesList = S.Array(Attribute);
export class BillingGroupCostReportResultElement extends S.Class<BillingGroupCostReportResultElement>(
  "BillingGroupCostReportResultElement",
)({
  Arn: S.optional(S.String),
  AWSCost: S.optional(S.String),
  ProformaCost: S.optional(S.String),
  Margin: S.optional(S.String),
  MarginPercentage: S.optional(S.String),
  Currency: S.optional(S.String),
  Attributes: S.optional(AttributesList),
}) {}
export const BillingGroupCostReportResultsList = S.Array(
  BillingGroupCostReportResultElement,
);
export class CustomLineItemVersionListElement extends S.Class<CustomLineItemVersionListElement>(
  "CustomLineItemVersionListElement",
)({
  Name: S.optional(S.String),
  ChargeDetails: S.optional(ListCustomLineItemChargeDetails),
  CurrencyCode: S.optional(S.String),
  Description: S.optional(S.String),
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
}) {}
export const CustomLineItemVersionList = S.Array(
  CustomLineItemVersionListElement,
);
export class FreeTierConfig extends S.Class<FreeTierConfig>("FreeTierConfig")({
  Activated: S.Boolean,
}) {}
export class GetBillingGroupCostReportOutput extends S.Class<GetBillingGroupCostReportOutput>(
  "GetBillingGroupCostReportOutput",
)({
  BillingGroupCostReportResults: S.optional(BillingGroupCostReportResultsList),
  NextToken: S.optional(S.String),
}) {}
export class ListCustomLineItemVersionsOutput extends S.Class<ListCustomLineItemVersionsOutput>(
  "ListCustomLineItemVersionsOutput",
)({
  CustomLineItemVersions: S.optional(CustomLineItemVersionList),
  NextToken: S.optional(S.String),
}) {}
export class ListBillingGroupAccountGrouping extends S.Class<ListBillingGroupAccountGrouping>(
  "ListBillingGroupAccountGrouping",
)({
  AutoAssociate: S.optional(S.Boolean),
  ResponsibilityTransferArn: S.optional(S.String),
}) {}
export class Tiering extends S.Class<Tiering>("Tiering")({
  FreeTier: FreeTierConfig,
}) {}
export class BillingGroupListElement extends S.Class<BillingGroupListElement>(
  "BillingGroupListElement",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  PrimaryAccountId: S.optional(S.String),
  ComputationPreference: S.optional(ComputationPreference),
  Size: S.optional(S.Number),
  CreationTime: S.optional(S.Number),
  LastModifiedTime: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  AccountGrouping: S.optional(ListBillingGroupAccountGrouping),
  BillingGroupType: S.optional(S.String),
}) {}
export const BillingGroupList = S.Array(BillingGroupListElement);
export class CustomLineItemListElement extends S.Class<CustomLineItemListElement>(
  "CustomLineItemListElement",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  ChargeDetails: S.optional(ListCustomLineItemChargeDetails),
  CurrencyCode: S.optional(S.String),
  Description: S.optional(S.String),
  ProductCode: S.optional(S.String),
  BillingGroupArn: S.optional(S.String),
  CreationTime: S.optional(S.Number),
  LastModifiedTime: S.optional(S.Number),
  AssociationSize: S.optional(S.Number),
  AccountId: S.optional(S.String),
  ComputationRule: S.optional(S.String),
  PresentationDetails: S.optional(PresentationObject),
}) {}
export const CustomLineItemList = S.Array(CustomLineItemListElement);
export class PricingRuleListElement extends S.Class<PricingRuleListElement>(
  "PricingRuleListElement",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
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
}) {}
export const PricingRuleList = S.Array(PricingRuleListElement);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, Message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class ListBillingGroupsOutput extends S.Class<ListBillingGroupsOutput>(
  "ListBillingGroupsOutput",
)({
  BillingGroups: S.optional(BillingGroupList),
  NextToken: S.optional(S.String),
}) {}
export class ListCustomLineItemsOutput extends S.Class<ListCustomLineItemsOutput>(
  "ListCustomLineItemsOutput",
)({
  CustomLineItems: S.optional(CustomLineItemList),
  NextToken: S.optional(S.String),
}) {}
export class ListPricingRulesOutput extends S.Class<ListPricingRulesOutput>(
  "ListPricingRulesOutput",
)({
  BillingPeriod: S.optional(S.String),
  PricingRules: S.optional(PricingRuleList),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    Reason: S.optional(S.String),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceLimitExceededException extends S.TaggedError<ServiceLimitExceededException>()(
  "ServiceLimitExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    LimitCode: S.String,
    ServiceCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Deletes a billing group.
 */
export const deleteBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDisassociateResourcesFromCustomLineItem =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPricingPlansAssociatedWithPricingRule =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPricingRulesAssociatedToPricingPlan =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * This updates an existing pricing plan.
 */
export const updatePricingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociatePricingRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * This updates an existing billing group.
 */
export const updateBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAccountAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listBillingGroupCostReports =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCustomLineItem = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCustomLineItemInput,
    output: DeleteCustomLineItemOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a pricing plan. The pricing plan must not be associated with any billing groups to delete successfully.
 */
export const deletePricingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePricingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCustomLineItem = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCustomLineItemInput,
    output: UpdateCustomLineItemOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * List the resources that are associated to a custom line item.
 */
export const listResourcesAssociatedToCustomLineItem =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPricingPlans = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Updates an existing pricing rule.
 */
export const updatePricingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCustomLineItem = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Associates a batch of resources to a percentage custom line item.
 */
export const batchAssociateResourcesToCustomLineItem =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPricingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPricingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associatePricingRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves the margin summary report, which includes the Amazon Web Services cost and charged amount (pro forma cost) by Amazon Web Services service for a specific billing group.
 */
export const getBillingGroupCostReport =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCustomLineItemVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listBillingGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * A paginated call to get a list of all custom line items (FFLIs) for the given billing period. If you don't provide a billing period, the current billing period is used.
 */
export const listCustomLineItems =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPricingRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);

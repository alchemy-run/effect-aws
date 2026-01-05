import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ConnectCases",
  serviceShapeName: "AmazonConnectCases",
});
const auth = T.AwsAuthSigv4({ name: "cases" });
const ver = T.ServiceVersion("2022-10-03");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://cases-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://cases-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://cases.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cases.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export const ValuesList = S.Array(S.String);
export class FieldIdentifier extends S.Class<FieldIdentifier>(
  "FieldIdentifier",
)({ id: S.String }) {}
export const BatchGetFieldIdentifierList = S.Array(FieldIdentifier);
export const TemplateStatusFilters = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{arn}" }),
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
    arn: S.String.pipe(T.HttpLabel("arn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{arn}" }),
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
export class EmptyFieldValue extends S.Class<EmptyFieldValue>(
  "EmptyFieldValue",
)({}) {}
export const FieldValueUnion = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ emptyValue: EmptyFieldValue }),
  S.Struct({ userArnValue: S.String }),
);
export class FieldValue extends S.Class<FieldValue>("FieldValue")({
  id: S.String,
  value: FieldValueUnion,
}) {}
export const FieldValueList = S.Array(FieldValue);
export const UserUnion = S.Union(
  S.Struct({ userArn: S.String }),
  S.Struct({ customEntity: S.String }),
);
export class UpdateCaseRequest extends S.Class<UpdateCaseRequest>(
  "UpdateCaseRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    fields: FieldValueList,
    performedBy: S.optional(UserUnion),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/domains/{domainId}/cases/{caseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCaseResponse extends S.Class<UpdateCaseResponse>(
  "UpdateCaseResponse",
)({}) {}
export class DeleteCaseRequest extends S.Class<DeleteCaseRequest>(
  "DeleteCaseRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/domains/{domainId}/cases/{caseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCaseResponse extends S.Class<DeleteCaseResponse>(
  "DeleteCaseResponse",
)({}) {}
export class GetCaseAuditEventsRequest extends S.Class<GetCaseAuditEventsRequest>(
  "GetCaseAuditEventsRequest",
)(
  {
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/domains/{domainId}/cases/{caseId}/audit-history",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCasesForContactRequest extends S.Class<ListCasesForContactRequest>(
  "ListCasesForContactRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    contactArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/domains/{domainId}/list-cases-for-contact",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRelatedItemRequest extends S.Class<DeleteRelatedItemRequest>(
  "DeleteRelatedItemRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    relatedItemId: S.String.pipe(T.HttpLabel("relatedItemId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/domains/{domainId}/cases/{caseId}/related-items/{relatedItemId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRelatedItemResponse extends S.Class<DeleteRelatedItemResponse>(
  "DeleteRelatedItemResponse",
)({}) {}
export const OperandOne = S.Union(S.Struct({ fieldId: S.String }));
export class EmptyOperandValue extends S.Class<EmptyOperandValue>(
  "EmptyOperandValue",
)({}) {}
export const OperandTwo = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ emptyValue: EmptyOperandValue }),
);
export class BooleanOperands extends S.Class<BooleanOperands>(
  "BooleanOperands",
)({ operandOne: OperandOne, operandTwo: OperandTwo, result: S.Boolean }) {}
export const BooleanCondition = S.Union(
  S.Struct({ equalTo: BooleanOperands }),
  S.Struct({ notEqualTo: BooleanOperands }),
);
export const BooleanConditionList = S.Array(BooleanCondition);
export class RequiredCaseRule extends S.Class<RequiredCaseRule>(
  "RequiredCaseRule",
)({ defaultValue: S.Boolean, conditions: BooleanConditionList }) {}
export const ParentChildFieldOptionValueList = S.Array(S.String);
export class ParentChildFieldOptionsMapping extends S.Class<ParentChildFieldOptionsMapping>(
  "ParentChildFieldOptionsMapping",
)({
  parentFieldOptionValue: S.String,
  childFieldOptionValues: ParentChildFieldOptionValueList,
}) {}
export const ParentChildFieldOptionsMappingList = S.Array(
  ParentChildFieldOptionsMapping,
);
export class FieldOptionsCaseRule extends S.Class<FieldOptionsCaseRule>(
  "FieldOptionsCaseRule",
)({
  parentFieldId: S.optional(S.String),
  childFieldId: S.optional(S.String),
  parentChildFieldOptionsMappings: ParentChildFieldOptionsMappingList,
}) {}
export class HiddenCaseRule extends S.Class<HiddenCaseRule>("HiddenCaseRule")({
  defaultValue: S.Boolean,
  conditions: BooleanConditionList,
}) {}
export const CaseRuleDetails = S.Union(
  S.Struct({ required: RequiredCaseRule }),
  S.Struct({ fieldOptions: FieldOptionsCaseRule }),
  S.Struct({ hidden: HiddenCaseRule }),
);
export class UpdateCaseRuleRequest extends S.Class<UpdateCaseRuleRequest>(
  "UpdateCaseRuleRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseRuleId: S.String.pipe(T.HttpLabel("caseRuleId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    rule: S.optional(CaseRuleDetails),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/domains/{domainId}/case-rules/{caseRuleId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCaseRuleResponse extends S.Class<UpdateCaseRuleResponse>(
  "UpdateCaseRuleResponse",
)({}) {}
export class DeleteCaseRuleRequest extends S.Class<DeleteCaseRuleRequest>(
  "DeleteCaseRuleRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseRuleId: S.String.pipe(T.HttpLabel("caseRuleId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/domains/{domainId}/case-rules/{caseRuleId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCaseRuleResponse extends S.Class<DeleteCaseRuleResponse>(
  "DeleteCaseRuleResponse",
)({}) {}
export class ListCaseRulesRequest extends S.Class<ListCaseRulesRequest>(
  "ListCaseRulesRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/rules-list/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDomainRequest extends S.Class<CreateDomainRequest>(
  "CreateDomainRequest",
)(
  { name: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainRequest extends S.Class<GetDomainRequest>(
  "GetDomainRequest",
)(
  { domainId: S.String.pipe(T.HttpLabel("domainId")) },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainRequest extends S.Class<DeleteDomainRequest>(
  "DeleteDomainRequest",
)(
  { domainId: S.String.pipe(T.HttpLabel("domainId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/domains/{domainId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainResponse extends S.Class<DeleteDomainResponse>(
  "DeleteDomainResponse",
)({}) {}
export class ListDomainsRequest extends S.Class<ListDomainsRequest>(
  "ListDomainsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains-list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCaseEventConfigurationRequest extends S.Class<GetCaseEventConfigurationRequest>(
  "GetCaseEventConfigurationRequest",
)(
  { domainId: S.String.pipe(T.HttpLabel("domainId")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/domains/{domainId}/case-event-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFieldRequest extends S.Class<CreateFieldRequest>(
  "CreateFieldRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    name: S.String,
    type: S.String,
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/fields" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFieldRequest extends S.Class<UpdateFieldRequest>(
  "UpdateFieldRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fieldId: S.String.pipe(T.HttpLabel("fieldId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/domains/{domainId}/fields/{fieldId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFieldResponse extends S.Class<UpdateFieldResponse>(
  "UpdateFieldResponse",
)({}) {}
export class DeleteFieldRequest extends S.Class<DeleteFieldRequest>(
  "DeleteFieldRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fieldId: S.String.pipe(T.HttpLabel("fieldId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/domains/{domainId}/fields/{fieldId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFieldResponse extends S.Class<DeleteFieldResponse>(
  "DeleteFieldResponse",
)({}) {}
export class ListFieldsRequest extends S.Class<ListFieldsRequest>(
  "ListFieldsRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/fields-list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFieldOptionsRequest extends S.Class<ListFieldOptionsRequest>(
  "ListFieldOptionsRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fieldId: S.String.pipe(T.HttpLabel("fieldId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    values: S.optional(ValuesList).pipe(T.HttpQuery("values")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/domains/{domainId}/fields/{fieldId}/options-list",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetFieldRequest extends S.Class<BatchGetFieldRequest>(
  "BatchGetFieldRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fields: BatchGetFieldIdentifierList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/fields-batch" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLayoutRequest extends S.Class<GetLayoutRequest>(
  "GetLayoutRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    layoutId: S.String.pipe(T.HttpLabel("layoutId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/layouts/{layoutId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FieldItem extends S.Class<FieldItem>("FieldItem")({
  id: S.String,
}) {}
export const FieldList = S.Array(FieldItem);
export class FieldGroup extends S.Class<FieldGroup>("FieldGroup")({
  name: S.optional(S.String),
  fields: FieldList,
}) {}
export const Section = S.Union(S.Struct({ fieldGroup: FieldGroup }));
export const SectionsList = S.Array(Section);
export class LayoutSections extends S.Class<LayoutSections>("LayoutSections")({
  sections: S.optional(SectionsList),
}) {}
export class BasicLayout extends S.Class<BasicLayout>("BasicLayout")({
  topPanel: S.optional(LayoutSections),
  moreInfo: S.optional(LayoutSections),
}) {}
export const LayoutContent = S.Union(S.Struct({ basic: BasicLayout }));
export class UpdateLayoutRequest extends S.Class<UpdateLayoutRequest>(
  "UpdateLayoutRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    layoutId: S.String.pipe(T.HttpLabel("layoutId")),
    name: S.optional(S.String),
    content: S.optional(LayoutContent),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/domains/{domainId}/layouts/{layoutId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLayoutResponse extends S.Class<UpdateLayoutResponse>(
  "UpdateLayoutResponse",
)({}) {}
export class DeleteLayoutRequest extends S.Class<DeleteLayoutRequest>(
  "DeleteLayoutRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    layoutId: S.String.pipe(T.HttpLabel("layoutId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/domains/{domainId}/layouts/{layoutId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLayoutResponse extends S.Class<DeleteLayoutResponse>(
  "DeleteLayoutResponse",
)({}) {}
export class ListLayoutsRequest extends S.Class<ListLayoutsRequest>(
  "ListLayoutsRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/layouts-list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTemplateRequest extends S.Class<GetTemplateRequest>(
  "GetTemplateRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    templateId: S.String.pipe(T.HttpLabel("templateId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/domains/{domainId}/templates/{templateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LayoutConfiguration extends S.Class<LayoutConfiguration>(
  "LayoutConfiguration",
)({ defaultLayout: S.optional(S.String) }) {}
export class RequiredField extends S.Class<RequiredField>("RequiredField")({
  fieldId: S.String,
}) {}
export const RequiredFieldList = S.Array(RequiredField);
export class TemplateRule extends S.Class<TemplateRule>("TemplateRule")({
  caseRuleId: S.String,
  fieldId: S.optional(S.String),
}) {}
export const TemplateCaseRuleList = S.Array(TemplateRule);
export class UpdateTemplateRequest extends S.Class<UpdateTemplateRequest>(
  "UpdateTemplateRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    templateId: S.String.pipe(T.HttpLabel("templateId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    layoutConfiguration: S.optional(LayoutConfiguration),
    requiredFields: S.optional(RequiredFieldList),
    status: S.optional(S.String),
    rules: S.optional(TemplateCaseRuleList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/domains/{domainId}/templates/{templateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTemplateResponse extends S.Class<UpdateTemplateResponse>(
  "UpdateTemplateResponse",
)({}) {}
export class DeleteTemplateRequest extends S.Class<DeleteTemplateRequest>(
  "DeleteTemplateRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    templateId: S.String.pipe(T.HttpLabel("templateId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/domains/{domainId}/templates/{templateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTemplateResponse extends S.Class<DeleteTemplateResponse>(
  "DeleteTemplateResponse",
)({}) {}
export class ListTemplatesRequest extends S.Class<ListTemplatesRequest>(
  "ListTemplatesRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(TemplateStatusFilters).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/templates-list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export type CaseFilterList = CaseFilter[];
export const CaseFilterList = S.Array(
  S.suspend(() => CaseFilter),
) as any as S.Schema<CaseFilterList>;
export class CommentFilter extends S.Class<CommentFilter>("CommentFilter")(
  {},
) {}
export const Tags = S.Record({ key: S.String, value: S.String }).pipe(
  T.Sparse(),
);
export const FieldIdentifierList = S.Array(FieldIdentifier);
export class Sort extends S.Class<Sort>("Sort")({
  fieldId: S.String,
  sortOrder: S.String,
}) {}
export const SortList = S.Array(Sort);
export class CaseRuleIdentifier extends S.Class<CaseRuleIdentifier>(
  "CaseRuleIdentifier",
)({ id: S.String }) {}
export const CaseRuleIdentifierList = S.Array(CaseRuleIdentifier);
export class SearchAllRelatedItemsSort extends S.Class<SearchAllRelatedItemsSort>(
  "SearchAllRelatedItemsSort",
)({ sortProperty: S.String, sortOrder: S.String }) {}
export const SearchAllRelatedItemsSortList = S.Array(SearchAllRelatedItemsSort);
export class FieldOption extends S.Class<FieldOption>("FieldOption")({
  name: S.String,
  value: S.String,
  active: S.Boolean,
}) {}
export const FieldOptionsList = S.Array(FieldOption);
export const ChannelList = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{arn}" }),
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
export class GetCaseRequest extends S.Class<GetCaseRequest>("GetCaseRequest")(
  {
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fields: FieldIdentifierList,
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/cases/{caseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetCaseRuleRequest extends S.Class<BatchGetCaseRuleRequest>(
  "BatchGetCaseRuleRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseRules: CaseRuleIdentifierList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/rules-batch" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDomainResponse extends S.Class<CreateDomainResponse>(
  "CreateDomainResponse",
)({ domainId: S.String, domainArn: S.String, domainStatus: S.String }) {}
export class GetDomainResponse extends S.Class<GetDomainResponse>(
  "GetDomainResponse",
)({
  domainId: S.String,
  domainArn: S.String,
  name: S.String,
  createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
  domainStatus: S.String,
  tags: S.optional(Tags),
}) {}
export class CaseEventIncludedData extends S.Class<CaseEventIncludedData>(
  "CaseEventIncludedData",
)({ fields: FieldIdentifierList }) {}
export class RelatedItemEventIncludedData extends S.Class<RelatedItemEventIncludedData>(
  "RelatedItemEventIncludedData",
)({ includeContent: S.Boolean }) {}
export class EventIncludedData extends S.Class<EventIncludedData>(
  "EventIncludedData",
)({
  caseData: S.optional(CaseEventIncludedData),
  relatedItemData: S.optional(RelatedItemEventIncludedData),
}) {}
export class EventBridgeConfiguration extends S.Class<EventBridgeConfiguration>(
  "EventBridgeConfiguration",
)({ enabled: S.Boolean, includedData: S.optional(EventIncludedData) }) {}
export class GetCaseEventConfigurationResponse extends S.Class<GetCaseEventConfigurationResponse>(
  "GetCaseEventConfigurationResponse",
)({ eventBridge: EventBridgeConfiguration }) {}
export class ContactFilter extends S.Class<ContactFilter>("ContactFilter")({
  channel: S.optional(ChannelList),
  contactArn: S.optional(S.String),
}) {}
export class FileFilter extends S.Class<FileFilter>("FileFilter")({
  fileArn: S.optional(S.String),
}) {}
export class SlaFilter extends S.Class<SlaFilter>("SlaFilter")({
  name: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class ConnectCaseFilter extends S.Class<ConnectCaseFilter>(
  "ConnectCaseFilter",
)({ caseId: S.optional(S.String) }) {}
export const FieldFilter = S.Union(
  S.Struct({ equalTo: FieldValue }),
  S.Struct({ contains: FieldValue }),
  S.Struct({ greaterThan: FieldValue }),
  S.Struct({ greaterThanOrEqualTo: FieldValue }),
  S.Struct({ lessThan: FieldValue }),
  S.Struct({ lessThanOrEqualTo: FieldValue }),
);
export type CustomFieldsFilter =
  | { field: (typeof FieldFilter)["Type"] }
  | { not: CustomFieldsFilter }
  | { andAll: CustomFieldsFilterList }
  | { orAll: CustomFieldsFilterList };
export const CustomFieldsFilter = S.Union(
  S.Struct({ field: FieldFilter }),
  S.Struct({ not: S.suspend(() => CustomFieldsFilter) }),
  S.Struct({ andAll: S.suspend(() => CustomFieldsFilterList) }),
  S.Struct({ orAll: S.suspend(() => CustomFieldsFilterList) }),
) as any as S.Schema<CustomFieldsFilter>;
export class CustomFilter extends S.Class<CustomFilter>("CustomFilter")({
  fields: S.optional(CustomFieldsFilter),
}) {}
export const RelatedItemTypeFilter = S.Union(
  S.Struct({ contact: ContactFilter }),
  S.Struct({ comment: CommentFilter }),
  S.Struct({ file: FileFilter }),
  S.Struct({ sla: SlaFilter }),
  S.Struct({ connectCase: ConnectCaseFilter }),
  S.Struct({ custom: CustomFilter }),
);
export const RelatedItemFilterList = S.Array(RelatedItemTypeFilter);
export class SearchAllRelatedItemsRequest extends S.Class<SearchAllRelatedItemsRequest>(
  "SearchAllRelatedItemsRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(RelatedItemFilterList),
    sorts: S.optional(SearchAllRelatedItemsSortList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/related-items-search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFieldResponse extends S.Class<CreateFieldResponse>(
  "CreateFieldResponse",
)({ fieldId: S.String, fieldArn: S.String }) {}
export class BatchPutFieldOptionsRequest extends S.Class<BatchPutFieldOptionsRequest>(
  "BatchPutFieldOptionsRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fieldId: S.String.pipe(T.HttpLabel("fieldId")),
    options: FieldOptionsList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/domains/{domainId}/fields/{fieldId}/options",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFieldOptionsResponse extends S.Class<ListFieldOptionsResponse>(
  "ListFieldOptionsResponse",
)({ options: FieldOptionsList, nextToken: S.optional(S.String) }) {}
export class GetLayoutResponse extends S.Class<GetLayoutResponse>(
  "GetLayoutResponse",
)({
  layoutId: S.String,
  layoutArn: S.String,
  name: S.String,
  content: LayoutContent,
  tags: S.optional(Tags),
  deleted: S.optional(S.Boolean),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CreateTemplateRequest extends S.Class<CreateTemplateRequest>(
  "CreateTemplateRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    name: S.String,
    description: S.optional(S.String),
    layoutConfiguration: S.optional(LayoutConfiguration),
    requiredFields: S.optional(RequiredFieldList),
    status: S.optional(S.String),
    rules: S.optional(TemplateCaseRuleList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTemplateResponse extends S.Class<GetTemplateResponse>(
  "GetTemplateResponse",
)({
  templateId: S.String,
  templateArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  layoutConfiguration: S.optional(LayoutConfiguration),
  requiredFields: S.optional(RequiredFieldList),
  tags: S.optional(Tags),
  status: S.String,
  deleted: S.optional(S.Boolean),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  rules: S.optional(TemplateCaseRuleList),
}) {}
export class Contact extends S.Class<Contact>("Contact")({
  contactArn: S.String,
}) {}
export class CommentContent extends S.Class<CommentContent>("CommentContent")({
  body: S.String,
  contentType: S.String,
}) {}
export class FileContent extends S.Class<FileContent>("FileContent")({
  fileArn: S.String,
}) {}
export class ConnectCaseInputContent extends S.Class<ConnectCaseInputContent>(
  "ConnectCaseInputContent",
)({ caseId: S.String }) {}
export class CustomInputContent extends S.Class<CustomInputContent>(
  "CustomInputContent",
)({ fields: FieldValueList }) {}
export const SlaFieldValueUnionList = S.Array(FieldValueUnion);
export type CustomFieldsFilterList = CustomFieldsFilter[];
export const CustomFieldsFilterList = S.Array(
  S.suspend(() => CustomFieldsFilter),
) as any as S.Schema<CustomFieldsFilterList>;
export class CaseSummary extends S.Class<CaseSummary>("CaseSummary")({
  caseId: S.String,
  templateId: S.String,
}) {}
export const CaseSummaryList = S.Array(CaseSummary);
export type CaseFilter =
  | { field: (typeof FieldFilter)["Type"] }
  | { not: CaseFilter }
  | { andAll: CaseFilterList }
  | { orAll: CaseFilterList };
export const CaseFilter = S.Union(
  S.Struct({ field: FieldFilter }),
  S.Struct({ not: S.suspend(() => CaseFilter) }),
  S.Struct({ andAll: S.suspend(() => CaseFilterList) }),
  S.Struct({ orAll: S.suspend(() => CaseFilterList) }),
) as any as S.Schema<CaseFilter>;
export class CaseRuleSummary extends S.Class<CaseRuleSummary>(
  "CaseRuleSummary",
)({
  caseRuleId: S.String,
  name: S.String,
  caseRuleArn: S.String,
  ruleType: S.String,
  description: S.optional(S.String),
}) {}
export const CaseRuleSummaryList = S.Array(CaseRuleSummary);
export const BatchGetCaseRuleUnprocessedList = S.Array(S.String);
export class DomainSummary extends S.Class<DomainSummary>("DomainSummary")({
  domainId: S.String,
  domainArn: S.String,
  name: S.String,
}) {}
export const DomainSummaryList = S.Array(DomainSummary);
export class FieldSummary extends S.Class<FieldSummary>("FieldSummary")({
  fieldId: S.String,
  fieldArn: S.String,
  name: S.String,
  type: S.String,
  namespace: S.String,
}) {}
export const FieldSummaryList = S.Array(FieldSummary);
export class GetFieldResponse extends S.Class<GetFieldResponse>(
  "GetFieldResponse",
)({
  fieldId: S.String,
  name: S.String,
  fieldArn: S.String,
  description: S.optional(S.String),
  type: S.String,
  namespace: S.String,
  tags: S.optional(Tags),
  deleted: S.optional(S.Boolean),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const BatchGetFieldList = S.Array(GetFieldResponse);
export class FieldError extends S.Class<FieldError>("FieldError")({
  id: S.String,
  errorCode: S.String,
  message: S.optional(S.String),
}) {}
export const BatchGetFieldErrorList = S.Array(FieldError);
export class LayoutSummary extends S.Class<LayoutSummary>("LayoutSummary")({
  layoutId: S.String,
  layoutArn: S.String,
  name: S.String,
}) {}
export const LayoutSummaryList = S.Array(LayoutSummary);
export class TemplateSummary extends S.Class<TemplateSummary>(
  "TemplateSummary",
)({
  templateId: S.String,
  templateArn: S.String,
  name: S.String,
  status: S.String,
}) {}
export const TemplateSummaryList = S.Array(TemplateSummary);
export class SlaInputConfiguration extends S.Class<SlaInputConfiguration>(
  "SlaInputConfiguration",
)({
  name: S.String,
  type: S.String,
  fieldId: S.optional(S.String),
  targetFieldValues: S.optional(SlaFieldValueUnionList),
  targetSlaMinutes: S.Number,
}) {}
export class CreateCaseRequest extends S.Class<CreateCaseRequest>(
  "CreateCaseRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    templateId: S.String,
    fields: FieldValueList,
    clientToken: S.optional(S.String),
    performedBy: S.optional(UserUnion),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/cases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCaseResponse extends S.Class<GetCaseResponse>(
  "GetCaseResponse",
)({
  fields: FieldValueList,
  templateId: S.String,
  nextToken: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class ListCasesForContactResponse extends S.Class<ListCasesForContactResponse>(
  "ListCasesForContactResponse",
)({ cases: CaseSummaryList, nextToken: S.optional(S.String) }) {}
export class SearchCasesRequest extends S.Class<SearchCasesRequest>(
  "SearchCasesRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    searchTerm: S.optional(S.String),
    filter: S.optional(CaseFilter),
    sorts: S.optional(SortList),
    fields: S.optional(FieldIdentifierList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/cases-search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCaseRulesResponse extends S.Class<ListCaseRulesResponse>(
  "ListCaseRulesResponse",
)({ caseRules: CaseRuleSummaryList, nextToken: S.optional(S.String) }) {}
export class ListDomainsResponse extends S.Class<ListDomainsResponse>(
  "ListDomainsResponse",
)({ domains: DomainSummaryList, nextToken: S.optional(S.String) }) {}
export class ListFieldsResponse extends S.Class<ListFieldsResponse>(
  "ListFieldsResponse",
)({ fields: FieldSummaryList, nextToken: S.optional(S.String) }) {}
export class BatchGetFieldResponse extends S.Class<BatchGetFieldResponse>(
  "BatchGetFieldResponse",
)({ fields: BatchGetFieldList, errors: BatchGetFieldErrorList }) {}
export class ListLayoutsResponse extends S.Class<ListLayoutsResponse>(
  "ListLayoutsResponse",
)({ layouts: LayoutSummaryList, nextToken: S.optional(S.String) }) {}
export class CreateTemplateResponse extends S.Class<CreateTemplateResponse>(
  "CreateTemplateResponse",
)({ templateId: S.String, templateArn: S.String }) {}
export class ListTemplatesResponse extends S.Class<ListTemplatesResponse>(
  "ListTemplatesResponse",
)({ templates: TemplateSummaryList, nextToken: S.optional(S.String) }) {}
export class AuditEventPerformedBy extends S.Class<AuditEventPerformedBy>(
  "AuditEventPerformedBy",
)({ user: S.optional(UserUnion), iamPrincipalArn: S.String }) {}
export const SlaInputContent = S.Union(
  S.Struct({ slaInputConfiguration: SlaInputConfiguration }),
);
export const RelatedItemInputContent = S.Union(
  S.Struct({ contact: Contact }),
  S.Struct({ comment: CommentContent }),
  S.Struct({ file: FileContent }),
  S.Struct({ sla: SlaInputContent }),
  S.Struct({ connectCase: ConnectCaseInputContent }),
  S.Struct({ custom: CustomInputContent }),
);
export class GetCaseRuleResponse extends S.Class<GetCaseRuleResponse>(
  "GetCaseRuleResponse",
)({
  caseRuleId: S.String,
  name: S.String,
  caseRuleArn: S.String,
  rule: CaseRuleDetails,
  description: S.optional(S.String),
  deleted: S.optional(S.Boolean),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(Tags),
}) {}
export const BatchGetCaseRuleList = S.Array(GetCaseRuleResponse);
export class CaseRuleError extends S.Class<CaseRuleError>("CaseRuleError")({
  id: S.String,
  errorCode: S.String,
  message: S.optional(S.String),
}) {}
export const BatchGetCaseRuleErrorList = S.Array(CaseRuleError);
export class FieldOptionError extends S.Class<FieldOptionError>(
  "FieldOptionError",
)({ message: S.String, errorCode: S.String, value: S.String }) {}
export const FieldOptionErrorList = S.Array(FieldOptionError);
export const AuditEventFieldValueUnion = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ emptyValue: EmptyFieldValue }),
  S.Struct({ userArnValue: S.String }),
);
export class CreateCaseResponse extends S.Class<CreateCaseResponse>(
  "CreateCaseResponse",
)({ caseId: S.String, caseArn: S.String }) {}
export class CreateRelatedItemRequest extends S.Class<CreateRelatedItemRequest>(
  "CreateRelatedItemRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    type: S.String,
    content: RelatedItemInputContent,
    performedBy: S.optional(UserUnion),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/domains/{domainId}/cases/{caseId}/related-items/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchRelatedItemsRequest extends S.Class<SearchRelatedItemsRequest>(
  "SearchRelatedItemsRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(RelatedItemFilterList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/domains/{domainId}/cases/{caseId}/related-items-search",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetCaseRuleResponse extends S.Class<BatchGetCaseRuleResponse>(
  "BatchGetCaseRuleResponse",
)({
  caseRules: BatchGetCaseRuleList,
  errors: BatchGetCaseRuleErrorList,
  unprocessedCaseRules: S.optional(BatchGetCaseRuleUnprocessedList),
}) {}
export class PutCaseEventConfigurationRequest extends S.Class<PutCaseEventConfigurationRequest>(
  "PutCaseEventConfigurationRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    eventBridge: EventBridgeConfiguration,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/domains/{domainId}/case-event-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutCaseEventConfigurationResponse extends S.Class<PutCaseEventConfigurationResponse>(
  "PutCaseEventConfigurationResponse",
)({}) {}
export class BatchPutFieldOptionsResponse extends S.Class<BatchPutFieldOptionsResponse>(
  "BatchPutFieldOptionsResponse",
)({ errors: S.optional(FieldOptionErrorList) }) {}
export class AuditEventField extends S.Class<AuditEventField>(
  "AuditEventField",
)({
  eventFieldId: S.String,
  oldValue: S.optional(AuditEventFieldValueUnion),
  newValue: AuditEventFieldValueUnion,
}) {}
export const AuditEventFieldList = S.Array(AuditEventField).pipe(T.Sparse());
export class AuditEvent extends S.Class<AuditEvent>("AuditEvent")({
  eventId: S.String,
  type: S.String,
  relatedItemType: S.optional(S.String),
  performedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  fields: AuditEventFieldList,
  performedBy: S.optional(AuditEventPerformedBy),
}) {}
export const AuditEventsList = S.Array(AuditEvent).pipe(T.Sparse());
export class SearchCasesResponseItem extends S.Class<SearchCasesResponseItem>(
  "SearchCasesResponseItem",
)({
  caseId: S.String,
  templateId: S.String,
  fields: FieldValueList,
  tags: S.optional(Tags),
}) {}
export const SearchCasesResponseItemList = S.Array(
  SearchCasesResponseItem,
).pipe(T.Sparse());
export class ContactContent extends S.Class<ContactContent>("ContactContent")({
  contactArn: S.String,
  channel: S.String,
  connectedToSystemTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ConnectCaseContent extends S.Class<ConnectCaseContent>(
  "ConnectCaseContent",
)({ caseId: S.String }) {}
export class CustomContent extends S.Class<CustomContent>("CustomContent")({
  fields: FieldValueList,
}) {}
export class GetCaseAuditEventsResponse extends S.Class<GetCaseAuditEventsResponse>(
  "GetCaseAuditEventsResponse",
)({ nextToken: S.optional(S.String), auditEvents: AuditEventsList }) {}
export class SearchCasesResponse extends S.Class<SearchCasesResponse>(
  "SearchCasesResponse",
)({ nextToken: S.optional(S.String), cases: SearchCasesResponseItemList }) {}
export class CreateRelatedItemResponse extends S.Class<CreateRelatedItemResponse>(
  "CreateRelatedItemResponse",
)({ relatedItemId: S.String, relatedItemArn: S.String }) {}
export class SlaConfiguration extends S.Class<SlaConfiguration>(
  "SlaConfiguration",
)({
  name: S.String,
  type: S.String,
  status: S.String,
  fieldId: S.optional(S.String),
  targetFieldValues: S.optional(SlaFieldValueUnionList),
  targetTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class SlaContent extends S.Class<SlaContent>("SlaContent")({
  slaConfiguration: SlaConfiguration,
}) {}
export const RelatedItemContent = S.Union(
  S.Struct({ contact: ContactContent }),
  S.Struct({ comment: CommentContent }),
  S.Struct({ file: FileContent }),
  S.Struct({ sla: SlaContent }),
  S.Struct({ connectCase: ConnectCaseContent }),
  S.Struct({ custom: CustomContent }),
);
export class SearchRelatedItemsResponseItem extends S.Class<SearchRelatedItemsResponseItem>(
  "SearchRelatedItemsResponseItem",
)({
  relatedItemId: S.String,
  type: S.String,
  associationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  content: RelatedItemContent,
  tags: S.optional(Tags),
  performedBy: S.optional(UserUnion),
}) {}
export const SearchRelatedItemsResponseItemList = S.Array(
  SearchRelatedItemsResponseItem,
).pipe(T.Sparse());
export class SearchRelatedItemsResponse extends S.Class<SearchRelatedItemsResponse>(
  "SearchRelatedItemsResponse",
)({
  nextToken: S.optional(S.String),
  relatedItems: SearchRelatedItemsResponseItemList,
}) {}
export class CreateCaseRuleRequest extends S.Class<CreateCaseRuleRequest>(
  "CreateCaseRuleRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    name: S.String,
    description: S.optional(S.String),
    rule: CaseRuleDetails,
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/case-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchAllRelatedItemsResponseItem extends S.Class<SearchAllRelatedItemsResponseItem>(
  "SearchAllRelatedItemsResponseItem",
)({
  relatedItemId: S.String,
  caseId: S.String,
  type: S.String,
  associationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  content: RelatedItemContent,
  performedBy: S.optional(UserUnion),
  tags: S.optional(Tags),
}) {}
export const SearchAllRelatedItemsResponseItemList = S.Array(
  SearchAllRelatedItemsResponseItem,
).pipe(T.Sparse());
export class CreateCaseRuleResponse extends S.Class<CreateCaseRuleResponse>(
  "CreateCaseRuleResponse",
)({ caseRuleId: S.String, caseRuleArn: S.String }) {}
export class SearchAllRelatedItemsResponse extends S.Class<SearchAllRelatedItemsResponse>(
  "SearchAllRelatedItemsResponse",
)({
  nextToken: S.optional(S.String),
  relatedItems: SearchAllRelatedItemsResponseItemList,
}) {}
export class CreateLayoutRequest extends S.Class<CreateLayoutRequest>(
  "CreateLayoutRequest",
)(
  {
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    name: S.String,
    content: LayoutContent,
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{domainId}/layouts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLayoutResponse extends S.Class<CreateLayoutResponse>(
  "CreateLayoutResponse",
)({ layoutId: S.String, layoutArn: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}

//# Operations
/**
 * Deletes a case rule. In the Amazon Connect admin website, case rules are known as *case field conditions*. For more information about case field conditions, see Add case field conditions to a case template.
 */
export const deleteCaseRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCaseRuleRequest,
  output: DeleteCaseRuleResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all cases domains in the Amazon Web Services account. Each list item is a condensed summary object of the domain.
 */
export const listDomains = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDomainsRequest,
    output: ListDomainsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Adds case event publishing configuration. For a complete list of fields you can add to the event message, see Create case fields in the *Amazon Connect Administrator Guide*
 */
export const putCaseEventConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutCaseEventConfigurationRequest,
    output: PutCaseEventConfigurationResponse,
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
 * Creates and updates a set of field options for a single select field in a Cases domain.
 */
export const batchPutFieldOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchPutFieldOptionsRequest,
    output: BatchPutFieldOptionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about a specific case if it exists.
 */
export const getCase = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCaseRequest,
  output: GetCaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * Lists cases for a given contact.
 */
export const listCasesForContact =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCasesForContactRequest,
    output: ListCasesForContactResponse,
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
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all case rules in a Cases domain. In the Amazon Connect admin website, case rules are known as *case field conditions*. For more information about case field conditions, see Add case field conditions to a case template.
 */
export const listCaseRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCaseRulesRequest,
    output: ListCaseRulesResponse,
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
      items: "caseRules",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all fields in a Cases domain.
 */
export const listFields = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFieldsRequest,
  output: ListFieldsResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the description for the list of fields in the request parameters.
 */
export const batchGetField = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetFieldRequest,
  output: BatchGetFieldResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all layouts in the given cases domain. Each list item is a condensed summary object of the layout.
 */
export const listLayouts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLayoutsRequest,
    output: ListLayoutsResponse,
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
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a template in the Cases domain. This template is used to define the case object model (that is, to define what data can be captured on cases) in a Cases domain. A template must have a unique name within a domain, and it must reference existing field IDs and layout IDs. Additionally, multiple fields with same IDs are not allowed within the same Template. A template can be either Active or Inactive, as indicated by its status. Inactive templates cannot be used to create cases.
 *
 * Other template APIs are:
 *
 * - DeleteTemplate
 *
 * - GetTemplate
 *
 * - ListTemplates
 *
 * - UpdateTemplate
 */
export const createTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Lists all of the templates in a Cases domain. Each list item is a condensed summary object of the template.
 *
 * Other template APIs are:
 *
 * - CreateTemplate
 *
 * - DeleteTemplate
 *
 * - GetTemplate
 *
 * - UpdateTemplate
 */
export const listTemplates = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns information about a specific domain if it exists.
 */
export const getDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainRequest,
  output: GetDomainResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the case event publishing configuration.
 */
export const getCaseEventConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCaseEventConfigurationRequest,
    output: GetCaseEventConfigurationResponse,
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
 * Lists all of the field options for a field identifier in the domain.
 */
export const listFieldOptions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFieldOptionsRequest,
    output: ListFieldOptionsResponse,
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
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns the details for the requested layout.
 */
export const getLayout = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLayoutRequest,
  output: GetLayoutResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the details for the requested template. Other template APIs are:
 *
 * - CreateTemplate
 *
 * - DeleteTemplate
 *
 * - ListTemplates
 *
 * - UpdateTemplate
 */
export const getTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * If you provide a value for `PerformedBy.UserArn` you must also have connect:DescribeUser permission on the User ARN resource that you provide
 *
 * Updates the values of fields on a case. Fields to be updated are received as an array of id/value pairs identical to the `CreateCase` input .
 *
 * If the action is successful, the service sends back an HTTP 200 response with an empty HTTP body.
 */
export const updateCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCaseRequest,
  output: UpdateCaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The DeleteCase API permanently deletes a case and all its associated resources from the cases data store. After a successful deletion, you cannot:
 *
 * - Retrieve related items
 *
 * - Access audit history
 *
 * - Perform any operations that require the CaseID
 *
 * This action is irreversible. After you delete a case, you cannot recover its data.
 */
export const deleteCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCaseRequest,
  output: DeleteCaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the related item resource under a case.
 *
 * This API cannot be used on a FILE type related attachment. To delete this type of file, use the DeleteAttachedFile API
 */
export const deleteRelatedItem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRelatedItemRequest,
  output: DeleteRelatedItemResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists tags for a resource.
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
 * Adds tags to a resource.
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
 * Creates a field in the Cases domain. This field is used to define the case object model (that is, defines what data can be captured on cases) in a Cases domain.
 */
export const createField = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFieldRequest,
  output: CreateFieldResponse,
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
 * Updates a case rule. In the Amazon Connect admin website, case rules are known as *case field conditions*. For more information about case field conditions, see Add case field conditions to a case template.
 */
export const updateCaseRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCaseRuleRequest,
  output: UpdateCaseRuleResponse,
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
 * Deletes a Cases domain.
 *
 * After deleting your domain you must disassociate the deleted domain from your Amazon Connect instance with another API call before being able to use Cases again with this Amazon Connect instance. See DeleteIntegrationAssociation.
 */
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResponse,
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
 * Updates the properties of an existing field.
 */
export const updateField = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFieldRequest,
  output: UpdateFieldResponse,
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
 * Deletes a field from a cases template. You can delete up to 100 fields per domain.
 *
 * After a field is deleted:
 *
 * - You can still retrieve the field by calling `BatchGetField`.
 *
 * - You cannot update a deleted field by calling `UpdateField`; it throws a `ValidationException`.
 *
 * - Deleted fields are not included in the `ListFields` response.
 *
 * - Calling `CreateCase` with a deleted field throws a `ValidationException` denoting which field identifiers in the request have been deleted.
 *
 * - Calling `GetCase` with a deleted field identifier returns the deleted field's value if one exists.
 *
 * - Calling `UpdateCase` with a deleted field ID throws a `ValidationException` if the case does not already contain a value for the deleted field. Otherwise it succeeds, allowing you to update or remove (using `emptyValue: {}`) the field's value from the case.
 *
 * - `GetTemplate` does not return field IDs for deleted fields.
 *
 * - `GetLayout` does not return field IDs for deleted fields.
 *
 * - Calling `SearchCases` with the deleted field ID as a filter returns any cases that have a value for the deleted field that matches the filter criteria.
 *
 * - Calling `SearchCases` with a `searchTerm` value that matches a deleted field's value on a case returns the case in the response.
 *
 * - Calling `BatchPutFieldOptions` with a deleted field ID throw a `ValidationException`.
 *
 * - Calling `GetCaseEventConfiguration` does not return field IDs for deleted fields.
 */
export const deleteField = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFieldRequest,
  output: DeleteFieldResponse,
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
 * Updates the attributes of an existing layout.
 *
 * If the action is successful, the service sends back an HTTP 200 response with an empty HTTP body.
 *
 * A `ValidationException` is returned when you add non-existent `fieldIds` to a layout.
 *
 * Title and Status fields cannot be part of layouts because they are not configurable.
 */
export const updateLayout = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLayoutRequest,
  output: UpdateLayoutResponse,
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
 * Deletes a layout from a cases template. You can delete up to 100 layouts per domain.
 *
 * After a layout is deleted:
 *
 * - You can still retrieve the layout by calling `GetLayout`.
 *
 * - You cannot update a deleted layout by calling `UpdateLayout`; it throws a `ValidationException`.
 *
 * - Deleted layouts are not included in the `ListLayouts` response.
 */
export const deleteLayout = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLayoutRequest,
  output: DeleteLayoutResponse,
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
 * Updates the attributes of an existing template. The template attributes that can be modified include `name`, `description`, `layoutConfiguration`, `requiredFields`, and `status`. At least one of these attributes must not be null. If a null value is provided for a given attribute, that attribute is ignored and its current value is preserved.
 *
 * Other template APIs are:
 *
 * - CreateTemplate
 *
 * - DeleteTemplate
 *
 * - GetTemplate
 *
 * - ListTemplates
 */
export const updateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateRequest,
  output: UpdateTemplateResponse,
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
 * Deletes a cases template. You can delete up to 100 templates per domain.
 *
 * After a cases template is deleted:
 *
 * - You can still retrieve the template by calling `GetTemplate`.
 *
 * - You cannot update the template.
 *
 * - You cannot create a case by using the deleted template.
 *
 * - Deleted templates are not included in the `ListTemplates` response.
 */
export const deleteTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Untags a resource.
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
 * If you provide a value for `PerformedBy.UserArn` you must also have connect:DescribeUser permission on the User ARN resource that you provide
 *
 * Creates a case in the specified Cases domain. Case system and custom fields are taken as an array id/value pairs with a declared data types.
 *
 * The following fields are required when creating a case:
 *
 * - `customer_id` - You must provide the full customer profile ARN in this format: `arn:aws:profile:your_AWS_Region:your_AWS_account ID:domains/your_profiles_domain_name/profiles/profile_ID`
 *
 * - `title`
 */
export const createCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCaseRequest,
  output: CreateCaseResponse,
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
 * Gets a batch of case rules. In the Amazon Connect admin website, case rules are known as *case field conditions*. For more information about case field conditions, see Add case field conditions to a case template.
 */
export const batchGetCaseRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCaseRuleRequest,
  output: BatchGetCaseRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a domain, which is a container for all case data, such as cases, fields, templates and layouts. Each Amazon Connect instance can be associated with only one Cases domain.
 *
 * This will not associate your connect instance to Cases domain. Instead, use the Amazon Connect CreateIntegrationAssociation API. You need specific IAM permissions to successfully associate the Cases domain. For more information, see Onboard to Cases.
 */
export const createDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainRequest,
  output: CreateDomainResponse,
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
 * Returns the audit history about a specific case if it exists.
 */
export const getCaseAuditEvents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetCaseAuditEventsRequest,
    output: GetCaseAuditEventsResponse,
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
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Searches for cases within their associated Cases domain. Search results are returned as a paginated list of abridged case documents.
 *
 * For `customer_id` you must provide the full customer profile ARN in this format: ` arn:aws:profile:your AWS Region:your AWS account ID:domains/profiles domain name/profiles/profile ID`.
 */
export const searchCases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchCasesRequest,
    output: SearchCasesResponse,
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
      items: "cases",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a related item (comments, tasks, and contacts) and associates it with a case.
 *
 * There's a quota for the number of fields allowed in a Custom type related item. See Amazon Connect Cases quotas.
 *
 * **Use cases**
 *
 * Following are examples of related items that you may want to associate with a case:
 *
 * - Related contacts, such as calls, chats, emails tasks
 *
 * - Comments, for agent notes
 *
 * - SLAs, to capture target resolution goals
 *
 * - Cases, to capture related Amazon Connect Cases
 *
 * - Files, such as policy documentation or customer-provided attachments
 *
 * - Custom related items, which provide flexibility for you to define related items that such as bookings, orders, products, notices, and more
 *
 * **Important things to know**
 *
 * - If you are associating a contact to a case by passing in `Contact` for a `type`, you must have DescribeContact permission on the ARN of the contact that you provide in `content.contact.contactArn`.
 *
 * - A Related Item is a resource that is associated with a case. It may or may not have an external identifier linking it to an external resource (for example, a `contactArn`). All Related Items have their own internal identifier, the `relatedItemArn`. Examples of related items include `comments` and `contacts`.
 *
 * - If you provide a value for `performedBy.userArn` you must also have DescribeUser permission on the ARN of the user that you provide.
 *
 * - The `type` field is reserved for internal use only.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const createRelatedItem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRelatedItemRequest,
  output: CreateRelatedItemResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Searches for related items that are associated with a case.
 *
 * If no filters are provided, this returns all related items associated with a case.
 */
export const searchRelatedItems = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchRelatedItemsRequest,
    output: SearchRelatedItemsResponse,
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
      items: "relatedItems",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a new case rule. In the Amazon Connect admin website, case rules are known as *case field conditions*. For more information about case field conditions, see Add case field conditions to a case template.
 */
export const createCaseRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCaseRuleRequest,
  output: CreateCaseRuleResponse,
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
 * Searches for related items across all cases within a domain. This is a global search operation that returns related items from multiple cases, unlike the case-specific SearchRelatedItems API.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - Find cases with similar issues across the domain. For example, search for all cases containing comments about "product defect" to identify patterns and existing solutions.
 *
 * - Locate all cases associated with specific contacts or orders. For example, find all cases linked to a contactArn to understand the complete customer journey.
 *
 * - Monitor SLA compliance across cases. For example, search for all cases with "Active" SLA status to prioritize remediation efforts.
 *
 * **Important things to know**
 *
 * - This API returns case identifiers, not complete case objects. To retrieve full case details, you must make additional calls to the GetCase API for each returned case ID.
 *
 * - This API searches across related items content, not case fields. Use the SearchCases API to search within case field values.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const searchAllRelatedItems =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchAllRelatedItemsRequest,
    output: SearchAllRelatedItemsResponse,
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
      items: "relatedItems",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a layout in the Cases domain. Layouts define the following configuration in the top section and More Info tab of the Cases user interface:
 *
 * - Fields to display to the users
 *
 * - Field ordering
 *
 * Title and Status fields cannot be part of layouts since they are not configurable.
 */
export const createLayout = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLayoutRequest,
  output: CreateLayoutResponse,
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

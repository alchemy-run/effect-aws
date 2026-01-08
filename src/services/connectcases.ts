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
  sdkId: "ConnectCases",
  serviceShapeName: "AmazonConnectCases",
});
const auth = T.AwsAuthSigv4({ name: "cases" });
const ver = T.ServiceVersion("2022-10-03");
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
              `https://cases-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cases-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cases.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cases.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type TagKey = string;
export type DomainId = string;
export type TemplateId = string;
export type CaseId = string;
export type NextToken = string;
export type ContactArn = string;
export type RelatedItemType = string;
export type RelatedItemId = string;
export type CaseRuleName = string;
export type CaseRuleDescription = string;
export type CaseRuleId = string;
export type MaxResults = number;
export type DomainName = string;
export type FieldName = string;
export type FieldType = string;
export type FieldDescription = string;
export type FieldId = string;
export type Value = string;
export type LayoutName = string;
export type LayoutId = string;
export type TemplateName = string;
export type TemplateDescription = string;
export type TemplateStatus = string;
export type UserArn = string;
export type CustomEntity = string | Redacted.Redacted<string>;
export type Order = string;
export type SearchAllRelatedItemsSortProperty = string;
export type FieldOptionName = string;
export type FieldOptionValue = string;
export type DomainArn = string;
export type DomainStatus = string;
export type FieldArn = string;
export type LayoutArn = string;
export type TemplateArn = string;
export type CommentBody = string;
export type CommentBodyTextType = string;
export type FileArn = string;
export type Channel = string;
export type SlaName = string | Redacted.Redacted<string>;
export type SlaStatus = string;
export type AuditEventId = string;
export type AuditEventType = string;
export type CaseRuleArn = string;
export type RuleType = string;
export type FieldNamespace = string;
export type SlaType = string;
export type TargetSlaMinutes = number;
export type ParentChildFieldOptionValue = string;
export type AuditEventFieldId = string;
export type IamPrincipalArn = string;
export type CaseArn = string;
export type RelatedItemArn = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type ValuesList = string[];
export const ValuesList = S.Array(S.String);
export interface FieldIdentifier {
  id: string;
}
export const FieldIdentifier = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "FieldIdentifier",
}) as any as S.Schema<FieldIdentifier>;
export type BatchGetFieldIdentifierList = FieldIdentifier[];
export const BatchGetFieldIdentifierList = S.Array(FieldIdentifier);
export type TemplateStatusFilters = string[];
export const TemplateStatusFilters = S.Array(S.String);
export interface ListTagsForResourceRequest {
  arn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{arn}" }),
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
  arn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    arn: S.String.pipe(T.HttpLabel("arn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{arn}" }),
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
export interface EmptyFieldValue {}
export const EmptyFieldValue = S.suspend(() => S.Struct({})).annotations({
  identifier: "EmptyFieldValue",
}) as any as S.Schema<EmptyFieldValue>;
export type FieldValueUnion =
  | { stringValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { emptyValue: EmptyFieldValue }
  | { userArnValue: string };
export const FieldValueUnion = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ emptyValue: EmptyFieldValue }),
  S.Struct({ userArnValue: S.String }),
);
export interface FieldValue {
  id: string;
  value: (typeof FieldValueUnion)["Type"];
}
export const FieldValue = S.suspend(() =>
  S.Struct({ id: S.String, value: FieldValueUnion }),
).annotations({ identifier: "FieldValue" }) as any as S.Schema<FieldValue>;
export type FieldValueList = FieldValue[];
export const FieldValueList = S.Array(FieldValue);
export type UserUnion =
  | { userArn: string }
  | { customEntity: string | Redacted.Redacted<string> };
export const UserUnion = S.Union(
  S.Struct({ userArn: S.String }),
  S.Struct({ customEntity: SensitiveString }),
);
export interface UpdateCaseRequest {
  domainId: string;
  caseId: string;
  fields: FieldValueList;
  performedBy?: (typeof UserUnion)["Type"];
}
export const UpdateCaseRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    fields: FieldValueList,
    performedBy: S.optional(UserUnion),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/domains/{domainId}/cases/{caseId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCaseRequest",
}) as any as S.Schema<UpdateCaseRequest>;
export interface UpdateCaseResponse {}
export const UpdateCaseResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateCaseResponse",
}) as any as S.Schema<UpdateCaseResponse>;
export interface DeleteCaseRequest {
  domainId: string;
  caseId: string;
}
export const DeleteCaseRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/domains/{domainId}/cases/{caseId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCaseRequest",
}) as any as S.Schema<DeleteCaseRequest>;
export interface DeleteCaseResponse {}
export const DeleteCaseResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteCaseResponse",
}) as any as S.Schema<DeleteCaseResponse>;
export interface GetCaseAuditEventsRequest {
  caseId: string;
  domainId: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetCaseAuditEventsRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCaseAuditEventsRequest",
}) as any as S.Schema<GetCaseAuditEventsRequest>;
export interface ListCasesForContactRequest {
  domainId: string;
  contactArn: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListCasesForContactRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    contactArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListCasesForContactRequest",
}) as any as S.Schema<ListCasesForContactRequest>;
export interface DeleteRelatedItemRequest {
  domainId: string;
  caseId: string;
  relatedItemId: string;
}
export const DeleteRelatedItemRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    relatedItemId: S.String.pipe(T.HttpLabel("relatedItemId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteRelatedItemRequest",
}) as any as S.Schema<DeleteRelatedItemRequest>;
export interface DeleteRelatedItemResponse {}
export const DeleteRelatedItemResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRelatedItemResponse",
}) as any as S.Schema<DeleteRelatedItemResponse>;
export type OperandOne = { fieldId: string };
export const OperandOne = S.Union(S.Struct({ fieldId: S.String }));
export interface EmptyOperandValue {}
export const EmptyOperandValue = S.suspend(() => S.Struct({})).annotations({
  identifier: "EmptyOperandValue",
}) as any as S.Schema<EmptyOperandValue>;
export type OperandTwo =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { doubleValue: number }
  | { emptyValue: EmptyOperandValue };
export const OperandTwo = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ emptyValue: EmptyOperandValue }),
);
export interface BooleanOperands {
  operandOne: (typeof OperandOne)["Type"];
  operandTwo: (typeof OperandTwo)["Type"];
  result: boolean;
}
export const BooleanOperands = S.suspend(() =>
  S.Struct({
    operandOne: OperandOne,
    operandTwo: OperandTwo,
    result: S.Boolean,
  }),
).annotations({
  identifier: "BooleanOperands",
}) as any as S.Schema<BooleanOperands>;
export type BooleanCondition =
  | { equalTo: BooleanOperands }
  | { notEqualTo: BooleanOperands };
export const BooleanCondition = S.Union(
  S.Struct({ equalTo: BooleanOperands }),
  S.Struct({ notEqualTo: BooleanOperands }),
);
export type BooleanConditionList = (typeof BooleanCondition)["Type"][];
export const BooleanConditionList = S.Array(BooleanCondition);
export interface RequiredCaseRule {
  defaultValue: boolean;
  conditions: BooleanConditionList;
}
export const RequiredCaseRule = S.suspend(() =>
  S.Struct({ defaultValue: S.Boolean, conditions: BooleanConditionList }),
).annotations({
  identifier: "RequiredCaseRule",
}) as any as S.Schema<RequiredCaseRule>;
export type ParentChildFieldOptionValueList = string[];
export const ParentChildFieldOptionValueList = S.Array(S.String);
export interface ParentChildFieldOptionsMapping {
  parentFieldOptionValue: string;
  childFieldOptionValues: ParentChildFieldOptionValueList;
}
export const ParentChildFieldOptionsMapping = S.suspend(() =>
  S.Struct({
    parentFieldOptionValue: S.String,
    childFieldOptionValues: ParentChildFieldOptionValueList,
  }),
).annotations({
  identifier: "ParentChildFieldOptionsMapping",
}) as any as S.Schema<ParentChildFieldOptionsMapping>;
export type ParentChildFieldOptionsMappingList =
  ParentChildFieldOptionsMapping[];
export const ParentChildFieldOptionsMappingList = S.Array(
  ParentChildFieldOptionsMapping,
);
export interface FieldOptionsCaseRule {
  parentFieldId?: string;
  childFieldId?: string;
  parentChildFieldOptionsMappings: ParentChildFieldOptionsMappingList;
}
export const FieldOptionsCaseRule = S.suspend(() =>
  S.Struct({
    parentFieldId: S.optional(S.String),
    childFieldId: S.optional(S.String),
    parentChildFieldOptionsMappings: ParentChildFieldOptionsMappingList,
  }),
).annotations({
  identifier: "FieldOptionsCaseRule",
}) as any as S.Schema<FieldOptionsCaseRule>;
export interface HiddenCaseRule {
  defaultValue: boolean;
  conditions: BooleanConditionList;
}
export const HiddenCaseRule = S.suspend(() =>
  S.Struct({ defaultValue: S.Boolean, conditions: BooleanConditionList }),
).annotations({
  identifier: "HiddenCaseRule",
}) as any as S.Schema<HiddenCaseRule>;
export type CaseRuleDetails =
  | { required: RequiredCaseRule }
  | { fieldOptions: FieldOptionsCaseRule }
  | { hidden: HiddenCaseRule };
export const CaseRuleDetails = S.Union(
  S.Struct({ required: RequiredCaseRule }),
  S.Struct({ fieldOptions: FieldOptionsCaseRule }),
  S.Struct({ hidden: HiddenCaseRule }),
);
export interface UpdateCaseRuleRequest {
  domainId: string;
  caseRuleId: string;
  name?: string;
  description?: string;
  rule?: (typeof CaseRuleDetails)["Type"];
}
export const UpdateCaseRuleRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseRuleId: S.String.pipe(T.HttpLabel("caseRuleId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    rule: S.optional(CaseRuleDetails),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateCaseRuleRequest",
}) as any as S.Schema<UpdateCaseRuleRequest>;
export interface UpdateCaseRuleResponse {}
export const UpdateCaseRuleResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateCaseRuleResponse" },
) as any as S.Schema<UpdateCaseRuleResponse>;
export interface DeleteCaseRuleRequest {
  domainId: string;
  caseRuleId: string;
}
export const DeleteCaseRuleRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseRuleId: S.String.pipe(T.HttpLabel("caseRuleId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCaseRuleRequest",
}) as any as S.Schema<DeleteCaseRuleRequest>;
export interface DeleteCaseRuleResponse {}
export const DeleteCaseRuleResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteCaseRuleResponse" },
) as any as S.Schema<DeleteCaseRuleResponse>;
export interface ListCaseRulesRequest {
  domainId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListCaseRulesRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/rules-list/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCaseRulesRequest",
}) as any as S.Schema<ListCaseRulesRequest>;
export interface CreateDomainRequest {
  name: string;
}
export const CreateDomainRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainRequest",
}) as any as S.Schema<CreateDomainRequest>;
export interface GetDomainRequest {
  domainId: string;
}
export const GetDomainRequest = S.suspend(() =>
  S.Struct({ domainId: S.String.pipe(T.HttpLabel("domainId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainRequest",
}) as any as S.Schema<GetDomainRequest>;
export interface DeleteDomainRequest {
  domainId: string;
}
export const DeleteDomainRequest = S.suspend(() =>
  S.Struct({ domainId: S.String.pipe(T.HttpLabel("domainId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/domains/{domainId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainRequest",
}) as any as S.Schema<DeleteDomainRequest>;
export interface DeleteDomainResponse {}
export const DeleteDomainResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteDomainResponse",
}) as any as S.Schema<DeleteDomainResponse>;
export interface ListDomainsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListDomainsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainsRequest",
}) as any as S.Schema<ListDomainsRequest>;
export interface GetCaseEventConfigurationRequest {
  domainId: string;
}
export const GetCaseEventConfigurationRequest = S.suspend(() =>
  S.Struct({ domainId: S.String.pipe(T.HttpLabel("domainId")) }).pipe(
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
  ),
).annotations({
  identifier: "GetCaseEventConfigurationRequest",
}) as any as S.Schema<GetCaseEventConfigurationRequest>;
export interface CreateFieldRequest {
  domainId: string;
  name: string;
  type: string;
  description?: string;
}
export const CreateFieldRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    name: S.String,
    type: S.String,
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/fields" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFieldRequest",
}) as any as S.Schema<CreateFieldRequest>;
export interface UpdateFieldRequest {
  domainId: string;
  fieldId: string;
  name?: string;
  description?: string;
}
export const UpdateFieldRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fieldId: S.String.pipe(T.HttpLabel("fieldId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/domains/{domainId}/fields/{fieldId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFieldRequest",
}) as any as S.Schema<UpdateFieldRequest>;
export interface UpdateFieldResponse {}
export const UpdateFieldResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateFieldResponse",
}) as any as S.Schema<UpdateFieldResponse>;
export interface DeleteFieldRequest {
  domainId: string;
  fieldId: string;
}
export const DeleteFieldRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fieldId: S.String.pipe(T.HttpLabel("fieldId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/domains/{domainId}/fields/{fieldId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFieldRequest",
}) as any as S.Schema<DeleteFieldRequest>;
export interface DeleteFieldResponse {}
export const DeleteFieldResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFieldResponse",
}) as any as S.Schema<DeleteFieldResponse>;
export interface ListFieldsRequest {
  domainId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListFieldsRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/fields-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFieldsRequest",
}) as any as S.Schema<ListFieldsRequest>;
export interface ListFieldOptionsRequest {
  domainId: string;
  fieldId: string;
  maxResults?: number;
  nextToken?: string;
  values?: ValuesList;
}
export const ListFieldOptionsRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fieldId: S.String.pipe(T.HttpLabel("fieldId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    values: S.optional(ValuesList).pipe(T.HttpQuery("values")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListFieldOptionsRequest",
}) as any as S.Schema<ListFieldOptionsRequest>;
export interface BatchGetFieldRequest {
  domainId: string;
  fields: BatchGetFieldIdentifierList;
}
export const BatchGetFieldRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fields: BatchGetFieldIdentifierList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/fields-batch" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetFieldRequest",
}) as any as S.Schema<BatchGetFieldRequest>;
export interface GetLayoutRequest {
  domainId: string;
  layoutId: string;
}
export const GetLayoutRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    layoutId: S.String.pipe(T.HttpLabel("layoutId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/layouts/{layoutId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLayoutRequest",
}) as any as S.Schema<GetLayoutRequest>;
export interface FieldItem {
  id: string;
}
export const FieldItem = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({ identifier: "FieldItem" }) as any as S.Schema<FieldItem>;
export type FieldList = FieldItem[];
export const FieldList = S.Array(FieldItem);
export interface FieldGroup {
  name?: string;
  fields: FieldList;
}
export const FieldGroup = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), fields: FieldList }),
).annotations({ identifier: "FieldGroup" }) as any as S.Schema<FieldGroup>;
export type Section = { fieldGroup: FieldGroup };
export const Section = S.Union(S.Struct({ fieldGroup: FieldGroup }));
export type SectionsList = (typeof Section)["Type"][];
export const SectionsList = S.Array(Section);
export interface LayoutSections {
  sections?: SectionsList;
}
export const LayoutSections = S.suspend(() =>
  S.Struct({ sections: S.optional(SectionsList) }),
).annotations({
  identifier: "LayoutSections",
}) as any as S.Schema<LayoutSections>;
export interface BasicLayout {
  topPanel?: LayoutSections;
  moreInfo?: LayoutSections;
}
export const BasicLayout = S.suspend(() =>
  S.Struct({
    topPanel: S.optional(LayoutSections),
    moreInfo: S.optional(LayoutSections),
  }),
).annotations({ identifier: "BasicLayout" }) as any as S.Schema<BasicLayout>;
export type LayoutContent = { basic: BasicLayout };
export const LayoutContent = S.Union(S.Struct({ basic: BasicLayout }));
export interface UpdateLayoutRequest {
  domainId: string;
  layoutId: string;
  name?: string;
  content?: (typeof LayoutContent)["Type"];
}
export const UpdateLayoutRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    layoutId: S.String.pipe(T.HttpLabel("layoutId")),
    name: S.optional(S.String),
    content: S.optional(LayoutContent),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/domains/{domainId}/layouts/{layoutId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLayoutRequest",
}) as any as S.Schema<UpdateLayoutRequest>;
export interface UpdateLayoutResponse {}
export const UpdateLayoutResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateLayoutResponse",
}) as any as S.Schema<UpdateLayoutResponse>;
export interface DeleteLayoutRequest {
  domainId: string;
  layoutId: string;
}
export const DeleteLayoutRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    layoutId: S.String.pipe(T.HttpLabel("layoutId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{domainId}/layouts/{layoutId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLayoutRequest",
}) as any as S.Schema<DeleteLayoutRequest>;
export interface DeleteLayoutResponse {}
export const DeleteLayoutResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteLayoutResponse",
}) as any as S.Schema<DeleteLayoutResponse>;
export interface ListLayoutsRequest {
  domainId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListLayoutsRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/layouts-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLayoutsRequest",
}) as any as S.Schema<ListLayoutsRequest>;
export interface GetTemplateRequest {
  domainId: string;
  templateId: string;
}
export const GetTemplateRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    templateId: S.String.pipe(T.HttpLabel("templateId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTemplateRequest",
}) as any as S.Schema<GetTemplateRequest>;
export interface LayoutConfiguration {
  defaultLayout?: string;
}
export const LayoutConfiguration = S.suspend(() =>
  S.Struct({ defaultLayout: S.optional(S.String) }),
).annotations({
  identifier: "LayoutConfiguration",
}) as any as S.Schema<LayoutConfiguration>;
export interface RequiredField {
  fieldId: string;
}
export const RequiredField = S.suspend(() =>
  S.Struct({ fieldId: S.String }),
).annotations({
  identifier: "RequiredField",
}) as any as S.Schema<RequiredField>;
export type RequiredFieldList = RequiredField[];
export const RequiredFieldList = S.Array(RequiredField);
export interface TemplateRule {
  caseRuleId: string;
  fieldId?: string;
}
export const TemplateRule = S.suspend(() =>
  S.Struct({ caseRuleId: S.String, fieldId: S.optional(S.String) }),
).annotations({ identifier: "TemplateRule" }) as any as S.Schema<TemplateRule>;
export type TemplateCaseRuleList = TemplateRule[];
export const TemplateCaseRuleList = S.Array(TemplateRule);
export interface UpdateTemplateRequest {
  domainId: string;
  templateId: string;
  name?: string;
  description?: string;
  layoutConfiguration?: LayoutConfiguration;
  requiredFields?: RequiredFieldList;
  status?: string;
  rules?: TemplateCaseRuleList;
}
export const UpdateTemplateRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    templateId: S.String.pipe(T.HttpLabel("templateId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    layoutConfiguration: S.optional(LayoutConfiguration),
    requiredFields: S.optional(RequiredFieldList),
    status: S.optional(S.String),
    rules: S.optional(TemplateCaseRuleList),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateTemplateRequest",
}) as any as S.Schema<UpdateTemplateRequest>;
export interface UpdateTemplateResponse {}
export const UpdateTemplateResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateTemplateResponse" },
) as any as S.Schema<UpdateTemplateResponse>;
export interface DeleteTemplateRequest {
  domainId: string;
  templateId: string;
}
export const DeleteTemplateRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    templateId: S.String.pipe(T.HttpLabel("templateId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteTemplateRequest",
}) as any as S.Schema<DeleteTemplateRequest>;
export interface DeleteTemplateResponse {}
export const DeleteTemplateResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteTemplateResponse" },
) as any as S.Schema<DeleteTemplateResponse>;
export interface ListTemplatesRequest {
  domainId: string;
  maxResults?: number;
  nextToken?: string;
  status?: TemplateStatusFilters;
}
export const ListTemplatesRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(TemplateStatusFilters).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/templates-list" }),
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
export type CaseFilterList = CaseFilter[];
export const CaseFilterList = S.Array(
  S.suspend(() => CaseFilter).annotations({ identifier: "CaseFilter" }),
) as any as S.Schema<CaseFilterList>;
export interface CommentFilter {}
export const CommentFilter = S.suspend(() => S.Struct({})).annotations({
  identifier: "CommentFilter",
}) as any as S.Schema<CommentFilter>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String }).pipe(
  T.Sparse(),
);
export type FieldIdentifierList = FieldIdentifier[];
export const FieldIdentifierList = S.Array(FieldIdentifier);
export interface Sort {
  fieldId: string;
  sortOrder: string;
}
export const Sort = S.suspend(() =>
  S.Struct({ fieldId: S.String, sortOrder: S.String }),
).annotations({ identifier: "Sort" }) as any as S.Schema<Sort>;
export type SortList = Sort[];
export const SortList = S.Array(Sort);
export interface CaseRuleIdentifier {
  id: string;
}
export const CaseRuleIdentifier = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "CaseRuleIdentifier",
}) as any as S.Schema<CaseRuleIdentifier>;
export type CaseRuleIdentifierList = CaseRuleIdentifier[];
export const CaseRuleIdentifierList = S.Array(CaseRuleIdentifier);
export interface SearchAllRelatedItemsSort {
  sortProperty: string;
  sortOrder: string;
}
export const SearchAllRelatedItemsSort = S.suspend(() =>
  S.Struct({ sortProperty: S.String, sortOrder: S.String }),
).annotations({
  identifier: "SearchAllRelatedItemsSort",
}) as any as S.Schema<SearchAllRelatedItemsSort>;
export type SearchAllRelatedItemsSortList = SearchAllRelatedItemsSort[];
export const SearchAllRelatedItemsSortList = S.Array(SearchAllRelatedItemsSort);
export interface FieldOption {
  name: string;
  value: string;
  active: boolean;
}
export const FieldOption = S.suspend(() =>
  S.Struct({ name: S.String, value: S.String, active: S.Boolean }),
).annotations({ identifier: "FieldOption" }) as any as S.Schema<FieldOption>;
export type FieldOptionsList = FieldOption[];
export const FieldOptionsList = S.Array(FieldOption);
export type ChannelList = string[];
export const ChannelList = S.Array(S.String);
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  arn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")), tags: Tags }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{arn}" }),
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
export interface GetCaseRequest {
  caseId: string;
  domainId: string;
  fields: FieldIdentifierList;
  nextToken?: string;
}
export const GetCaseRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fields: FieldIdentifierList,
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/cases/{caseId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCaseRequest",
}) as any as S.Schema<GetCaseRequest>;
export interface BatchGetCaseRuleRequest {
  domainId: string;
  caseRules: CaseRuleIdentifierList;
}
export const BatchGetCaseRuleRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseRules: CaseRuleIdentifierList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/rules-batch" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetCaseRuleRequest",
}) as any as S.Schema<BatchGetCaseRuleRequest>;
export interface CreateDomainResponse {
  domainId: string;
  domainArn: string;
  domainStatus: string;
}
export const CreateDomainResponse = S.suspend(() =>
  S.Struct({ domainId: S.String, domainArn: S.String, domainStatus: S.String }),
).annotations({
  identifier: "CreateDomainResponse",
}) as any as S.Schema<CreateDomainResponse>;
export interface GetDomainResponse {
  domainId: string;
  domainArn: string;
  name: string;
  createdTime: Date;
  domainStatus: string;
  tags?: Tags;
}
export const GetDomainResponse = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    domainArn: S.String,
    name: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
    domainStatus: S.String,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "GetDomainResponse",
}) as any as S.Schema<GetDomainResponse>;
export interface CaseEventIncludedData {
  fields: FieldIdentifierList;
}
export const CaseEventIncludedData = S.suspend(() =>
  S.Struct({ fields: FieldIdentifierList }),
).annotations({
  identifier: "CaseEventIncludedData",
}) as any as S.Schema<CaseEventIncludedData>;
export interface RelatedItemEventIncludedData {
  includeContent: boolean;
}
export const RelatedItemEventIncludedData = S.suspend(() =>
  S.Struct({ includeContent: S.Boolean }),
).annotations({
  identifier: "RelatedItemEventIncludedData",
}) as any as S.Schema<RelatedItemEventIncludedData>;
export interface EventIncludedData {
  caseData?: CaseEventIncludedData;
  relatedItemData?: RelatedItemEventIncludedData;
}
export const EventIncludedData = S.suspend(() =>
  S.Struct({
    caseData: S.optional(CaseEventIncludedData),
    relatedItemData: S.optional(RelatedItemEventIncludedData),
  }),
).annotations({
  identifier: "EventIncludedData",
}) as any as S.Schema<EventIncludedData>;
export interface EventBridgeConfiguration {
  enabled: boolean;
  includedData?: EventIncludedData;
}
export const EventBridgeConfiguration = S.suspend(() =>
  S.Struct({ enabled: S.Boolean, includedData: S.optional(EventIncludedData) }),
).annotations({
  identifier: "EventBridgeConfiguration",
}) as any as S.Schema<EventBridgeConfiguration>;
export interface GetCaseEventConfigurationResponse {
  eventBridge: EventBridgeConfiguration;
}
export const GetCaseEventConfigurationResponse = S.suspend(() =>
  S.Struct({ eventBridge: EventBridgeConfiguration }),
).annotations({
  identifier: "GetCaseEventConfigurationResponse",
}) as any as S.Schema<GetCaseEventConfigurationResponse>;
export interface ContactFilter {
  channel?: ChannelList;
  contactArn?: string;
}
export const ContactFilter = S.suspend(() =>
  S.Struct({
    channel: S.optional(ChannelList),
    contactArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ContactFilter",
}) as any as S.Schema<ContactFilter>;
export interface FileFilter {
  fileArn?: string;
}
export const FileFilter = S.suspend(() =>
  S.Struct({ fileArn: S.optional(S.String) }),
).annotations({ identifier: "FileFilter" }) as any as S.Schema<FileFilter>;
export interface SlaFilter {
  name?: string | Redacted.Redacted<string>;
  status?: string;
}
export const SlaFilter = S.suspend(() =>
  S.Struct({ name: S.optional(SensitiveString), status: S.optional(S.String) }),
).annotations({ identifier: "SlaFilter" }) as any as S.Schema<SlaFilter>;
export interface ConnectCaseFilter {
  caseId?: string;
}
export const ConnectCaseFilter = S.suspend(() =>
  S.Struct({ caseId: S.optional(S.String) }),
).annotations({
  identifier: "ConnectCaseFilter",
}) as any as S.Schema<ConnectCaseFilter>;
export type FieldFilter =
  | { equalTo: FieldValue }
  | { contains: FieldValue }
  | { greaterThan: FieldValue }
  | { greaterThanOrEqualTo: FieldValue }
  | { lessThan: FieldValue }
  | { lessThanOrEqualTo: FieldValue };
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
  S.Struct({
    not: S.suspend(() => CustomFieldsFilter).annotations({
      identifier: "CustomFieldsFilter",
    }),
  }),
  S.Struct({
    andAll: S.suspend(() => CustomFieldsFilterList).annotations({
      identifier: "CustomFieldsFilterList",
    }),
  }),
  S.Struct({
    orAll: S.suspend(() => CustomFieldsFilterList).annotations({
      identifier: "CustomFieldsFilterList",
    }),
  }),
) as any as S.Schema<CustomFieldsFilter>;
export interface CustomFilter {
  fields?: CustomFieldsFilter;
}
export const CustomFilter = S.suspend(() =>
  S.Struct({ fields: S.optional(CustomFieldsFilter) }),
).annotations({ identifier: "CustomFilter" }) as any as S.Schema<CustomFilter>;
export type RelatedItemTypeFilter =
  | { contact: ContactFilter }
  | { comment: CommentFilter }
  | { file: FileFilter }
  | { sla: SlaFilter }
  | { connectCase: ConnectCaseFilter }
  | { custom: CustomFilter };
export const RelatedItemTypeFilter = S.Union(
  S.Struct({ contact: ContactFilter }),
  S.Struct({ comment: CommentFilter }),
  S.Struct({ file: FileFilter }),
  S.Struct({ sla: SlaFilter }),
  S.Struct({ connectCase: ConnectCaseFilter }),
  S.Struct({ custom: CustomFilter }),
);
export type RelatedItemFilterList = (typeof RelatedItemTypeFilter)["Type"][];
export const RelatedItemFilterList = S.Array(RelatedItemTypeFilter);
export interface SearchAllRelatedItemsRequest {
  domainId: string;
  maxResults?: number;
  nextToken?: string;
  filters?: RelatedItemFilterList;
  sorts?: SearchAllRelatedItemsSortList;
}
export const SearchAllRelatedItemsRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(RelatedItemFilterList),
    sorts: S.optional(SearchAllRelatedItemsSortList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{domainId}/related-items-search",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchAllRelatedItemsRequest",
}) as any as S.Schema<SearchAllRelatedItemsRequest>;
export interface CreateFieldResponse {
  fieldId: string;
  fieldArn: string;
}
export const CreateFieldResponse = S.suspend(() =>
  S.Struct({ fieldId: S.String, fieldArn: S.String }),
).annotations({
  identifier: "CreateFieldResponse",
}) as any as S.Schema<CreateFieldResponse>;
export interface BatchPutFieldOptionsRequest {
  domainId: string;
  fieldId: string;
  options: FieldOptionsList;
}
export const BatchPutFieldOptionsRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    fieldId: S.String.pipe(T.HttpLabel("fieldId")),
    options: FieldOptionsList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchPutFieldOptionsRequest",
}) as any as S.Schema<BatchPutFieldOptionsRequest>;
export interface ListFieldOptionsResponse {
  options: FieldOptionsList;
  nextToken?: string;
}
export const ListFieldOptionsResponse = S.suspend(() =>
  S.Struct({ options: FieldOptionsList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFieldOptionsResponse",
}) as any as S.Schema<ListFieldOptionsResponse>;
export interface GetLayoutResponse {
  layoutId: string;
  layoutArn: string;
  name: string;
  content: (typeof LayoutContent)["Type"];
  tags?: Tags;
  deleted?: boolean;
  createdTime?: Date;
  lastModifiedTime?: Date;
}
export const GetLayoutResponse = S.suspend(() =>
  S.Struct({
    layoutId: S.String,
    layoutArn: S.String,
    name: S.String,
    content: LayoutContent,
    tags: S.optional(Tags),
    deleted: S.optional(S.Boolean),
    createdTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetLayoutResponse",
}) as any as S.Schema<GetLayoutResponse>;
export interface CreateTemplateRequest {
  domainId: string;
  name: string;
  description?: string;
  layoutConfiguration?: LayoutConfiguration;
  requiredFields?: RequiredFieldList;
  status?: string;
  rules?: TemplateCaseRuleList;
}
export const CreateTemplateRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    name: S.String,
    description: S.optional(S.String),
    layoutConfiguration: S.optional(LayoutConfiguration),
    requiredFields: S.optional(RequiredFieldList),
    status: S.optional(S.String),
    rules: S.optional(TemplateCaseRuleList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/templates" }),
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
export interface GetTemplateResponse {
  templateId: string;
  templateArn: string;
  name: string;
  description?: string;
  layoutConfiguration?: LayoutConfiguration;
  requiredFields?: RequiredFieldList;
  tags?: Tags;
  status: string;
  deleted?: boolean;
  createdTime?: Date;
  lastModifiedTime?: Date;
  rules?: TemplateCaseRuleList;
}
export const GetTemplateResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetTemplateResponse",
}) as any as S.Schema<GetTemplateResponse>;
export interface Contact {
  contactArn: string;
}
export const Contact = S.suspend(() =>
  S.Struct({ contactArn: S.String }),
).annotations({ identifier: "Contact" }) as any as S.Schema<Contact>;
export interface CommentContent {
  body: string;
  contentType: string;
}
export const CommentContent = S.suspend(() =>
  S.Struct({ body: S.String, contentType: S.String }),
).annotations({
  identifier: "CommentContent",
}) as any as S.Schema<CommentContent>;
export interface FileContent {
  fileArn: string;
}
export const FileContent = S.suspend(() =>
  S.Struct({ fileArn: S.String }),
).annotations({ identifier: "FileContent" }) as any as S.Schema<FileContent>;
export interface ConnectCaseInputContent {
  caseId: string;
}
export const ConnectCaseInputContent = S.suspend(() =>
  S.Struct({ caseId: S.String }),
).annotations({
  identifier: "ConnectCaseInputContent",
}) as any as S.Schema<ConnectCaseInputContent>;
export interface CustomInputContent {
  fields: FieldValueList;
}
export const CustomInputContent = S.suspend(() =>
  S.Struct({ fields: FieldValueList }),
).annotations({
  identifier: "CustomInputContent",
}) as any as S.Schema<CustomInputContent>;
export type SlaFieldValueUnionList = (typeof FieldValueUnion)["Type"][];
export const SlaFieldValueUnionList = S.Array(FieldValueUnion);
export type CustomFieldsFilterList = CustomFieldsFilter[];
export const CustomFieldsFilterList = S.Array(
  S.suspend(() => CustomFieldsFilter).annotations({
    identifier: "CustomFieldsFilter",
  }),
) as any as S.Schema<CustomFieldsFilterList>;
export interface CaseSummary {
  caseId: string;
  templateId: string;
}
export const CaseSummary = S.suspend(() =>
  S.Struct({ caseId: S.String, templateId: S.String }),
).annotations({ identifier: "CaseSummary" }) as any as S.Schema<CaseSummary>;
export type CaseSummaryList = CaseSummary[];
export const CaseSummaryList = S.Array(CaseSummary);
export type CaseFilter =
  | { field: (typeof FieldFilter)["Type"] }
  | { not: CaseFilter }
  | { andAll: CaseFilterList }
  | { orAll: CaseFilterList };
export const CaseFilter = S.Union(
  S.Struct({ field: FieldFilter }),
  S.Struct({
    not: S.suspend(() => CaseFilter).annotations({ identifier: "CaseFilter" }),
  }),
  S.Struct({
    andAll: S.suspend(() => CaseFilterList).annotations({
      identifier: "CaseFilterList",
    }),
  }),
  S.Struct({
    orAll: S.suspend(() => CaseFilterList).annotations({
      identifier: "CaseFilterList",
    }),
  }),
) as any as S.Schema<CaseFilter>;
export interface CaseRuleSummary {
  caseRuleId: string;
  name: string;
  caseRuleArn: string;
  ruleType: string;
  description?: string;
}
export const CaseRuleSummary = S.suspend(() =>
  S.Struct({
    caseRuleId: S.String,
    name: S.String,
    caseRuleArn: S.String,
    ruleType: S.String,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "CaseRuleSummary",
}) as any as S.Schema<CaseRuleSummary>;
export type CaseRuleSummaryList = CaseRuleSummary[];
export const CaseRuleSummaryList = S.Array(CaseRuleSummary);
export type BatchGetCaseRuleUnprocessedList = string[];
export const BatchGetCaseRuleUnprocessedList = S.Array(S.String);
export interface DomainSummary {
  domainId: string;
  domainArn: string;
  name: string;
}
export const DomainSummary = S.suspend(() =>
  S.Struct({ domainId: S.String, domainArn: S.String, name: S.String }),
).annotations({
  identifier: "DomainSummary",
}) as any as S.Schema<DomainSummary>;
export type DomainSummaryList = DomainSummary[];
export const DomainSummaryList = S.Array(DomainSummary);
export interface FieldSummary {
  fieldId: string;
  fieldArn: string;
  name: string;
  type: string;
  namespace: string;
}
export const FieldSummary = S.suspend(() =>
  S.Struct({
    fieldId: S.String,
    fieldArn: S.String,
    name: S.String,
    type: S.String,
    namespace: S.String,
  }),
).annotations({ identifier: "FieldSummary" }) as any as S.Schema<FieldSummary>;
export type FieldSummaryList = FieldSummary[];
export const FieldSummaryList = S.Array(FieldSummary);
export interface GetFieldResponse {
  fieldId: string;
  name: string;
  fieldArn: string;
  description?: string;
  type: string;
  namespace: string;
  tags?: Tags;
  deleted?: boolean;
  createdTime?: Date;
  lastModifiedTime?: Date;
}
export const GetFieldResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetFieldResponse",
}) as any as S.Schema<GetFieldResponse>;
export type BatchGetFieldList = GetFieldResponse[];
export const BatchGetFieldList = S.Array(GetFieldResponse);
export interface FieldError {
  id: string;
  errorCode: string;
  message?: string;
}
export const FieldError = S.suspend(() =>
  S.Struct({
    id: S.String,
    errorCode: S.String,
    message: S.optional(S.String),
  }),
).annotations({ identifier: "FieldError" }) as any as S.Schema<FieldError>;
export type BatchGetFieldErrorList = FieldError[];
export const BatchGetFieldErrorList = S.Array(FieldError);
export interface LayoutSummary {
  layoutId: string;
  layoutArn: string;
  name: string;
}
export const LayoutSummary = S.suspend(() =>
  S.Struct({ layoutId: S.String, layoutArn: S.String, name: S.String }),
).annotations({
  identifier: "LayoutSummary",
}) as any as S.Schema<LayoutSummary>;
export type LayoutSummaryList = LayoutSummary[];
export const LayoutSummaryList = S.Array(LayoutSummary);
export interface TemplateSummary {
  templateId: string;
  templateArn: string;
  name: string;
  status: string;
}
export const TemplateSummary = S.suspend(() =>
  S.Struct({
    templateId: S.String,
    templateArn: S.String,
    name: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "TemplateSummary",
}) as any as S.Schema<TemplateSummary>;
export type TemplateSummaryList = TemplateSummary[];
export const TemplateSummaryList = S.Array(TemplateSummary);
export interface SlaInputConfiguration {
  name: string | Redacted.Redacted<string>;
  type: string;
  fieldId?: string;
  targetFieldValues?: SlaFieldValueUnionList;
  targetSlaMinutes: number;
}
export const SlaInputConfiguration = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    type: S.String,
    fieldId: S.optional(S.String),
    targetFieldValues: S.optional(SlaFieldValueUnionList),
    targetSlaMinutes: S.Number,
  }),
).annotations({
  identifier: "SlaInputConfiguration",
}) as any as S.Schema<SlaInputConfiguration>;
export interface CreateCaseRequest {
  domainId: string;
  templateId: string;
  fields: FieldValueList;
  clientToken?: string;
  performedBy?: (typeof UserUnion)["Type"];
}
export const CreateCaseRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    templateId: S.String,
    fields: FieldValueList,
    clientToken: S.optional(S.String),
    performedBy: S.optional(UserUnion),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/cases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCaseRequest",
}) as any as S.Schema<CreateCaseRequest>;
export interface GetCaseResponse {
  fields: FieldValueList;
  templateId: string;
  nextToken?: string;
  tags?: Tags;
}
export const GetCaseResponse = S.suspend(() =>
  S.Struct({
    fields: FieldValueList,
    templateId: S.String,
    nextToken: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "GetCaseResponse",
}) as any as S.Schema<GetCaseResponse>;
export interface ListCasesForContactResponse {
  cases: CaseSummaryList;
  nextToken?: string;
}
export const ListCasesForContactResponse = S.suspend(() =>
  S.Struct({ cases: CaseSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListCasesForContactResponse",
}) as any as S.Schema<ListCasesForContactResponse>;
export interface SearchCasesRequest {
  domainId: string;
  maxResults?: number;
  nextToken?: string;
  searchTerm?: string;
  filter?: CaseFilter;
  sorts?: SortList;
  fields?: FieldIdentifierList;
}
export const SearchCasesRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    searchTerm: S.optional(S.String),
    filter: S.optional(CaseFilter),
    sorts: S.optional(SortList),
    fields: S.optional(FieldIdentifierList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/cases-search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchCasesRequest",
}) as any as S.Schema<SearchCasesRequest>;
export interface ListCaseRulesResponse {
  caseRules: CaseRuleSummaryList;
  nextToken?: string;
}
export const ListCaseRulesResponse = S.suspend(() =>
  S.Struct({ caseRules: CaseRuleSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListCaseRulesResponse",
}) as any as S.Schema<ListCaseRulesResponse>;
export interface ListDomainsResponse {
  domains: DomainSummaryList;
  nextToken?: string;
}
export const ListDomainsResponse = S.suspend(() =>
  S.Struct({ domains: DomainSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDomainsResponse",
}) as any as S.Schema<ListDomainsResponse>;
export interface ListFieldsResponse {
  fields: FieldSummaryList;
  nextToken?: string;
}
export const ListFieldsResponse = S.suspend(() =>
  S.Struct({ fields: FieldSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFieldsResponse",
}) as any as S.Schema<ListFieldsResponse>;
export interface BatchGetFieldResponse {
  fields: BatchGetFieldList;
  errors: BatchGetFieldErrorList;
}
export const BatchGetFieldResponse = S.suspend(() =>
  S.Struct({ fields: BatchGetFieldList, errors: BatchGetFieldErrorList }),
).annotations({
  identifier: "BatchGetFieldResponse",
}) as any as S.Schema<BatchGetFieldResponse>;
export interface ListLayoutsResponse {
  layouts: LayoutSummaryList;
  nextToken?: string;
}
export const ListLayoutsResponse = S.suspend(() =>
  S.Struct({ layouts: LayoutSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListLayoutsResponse",
}) as any as S.Schema<ListLayoutsResponse>;
export interface CreateTemplateResponse {
  templateId: string;
  templateArn: string;
}
export const CreateTemplateResponse = S.suspend(() =>
  S.Struct({ templateId: S.String, templateArn: S.String }),
).annotations({
  identifier: "CreateTemplateResponse",
}) as any as S.Schema<CreateTemplateResponse>;
export interface ListTemplatesResponse {
  templates: TemplateSummaryList;
  nextToken?: string;
}
export const ListTemplatesResponse = S.suspend(() =>
  S.Struct({ templates: TemplateSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTemplatesResponse",
}) as any as S.Schema<ListTemplatesResponse>;
export interface AuditEventPerformedBy {
  user?: (typeof UserUnion)["Type"];
  iamPrincipalArn: string;
}
export const AuditEventPerformedBy = S.suspend(() =>
  S.Struct({ user: S.optional(UserUnion), iamPrincipalArn: S.String }),
).annotations({
  identifier: "AuditEventPerformedBy",
}) as any as S.Schema<AuditEventPerformedBy>;
export type SlaInputContent = { slaInputConfiguration: SlaInputConfiguration };
export const SlaInputContent = S.Union(
  S.Struct({ slaInputConfiguration: SlaInputConfiguration }),
);
export type RelatedItemInputContent =
  | { contact: Contact }
  | { comment: CommentContent }
  | { file: FileContent }
  | { sla: (typeof SlaInputContent)["Type"] }
  | { connectCase: ConnectCaseInputContent }
  | { custom: CustomInputContent };
export const RelatedItemInputContent = S.Union(
  S.Struct({ contact: Contact }),
  S.Struct({ comment: CommentContent }),
  S.Struct({ file: FileContent }),
  S.Struct({ sla: SlaInputContent }),
  S.Struct({ connectCase: ConnectCaseInputContent }),
  S.Struct({ custom: CustomInputContent }),
);
export interface GetCaseRuleResponse {
  caseRuleId: string;
  name: string;
  caseRuleArn: string;
  rule: (typeof CaseRuleDetails)["Type"];
  description?: string;
  deleted?: boolean;
  createdTime?: Date;
  lastModifiedTime?: Date;
  tags?: Tags;
}
export const GetCaseRuleResponse = S.suspend(() =>
  S.Struct({
    caseRuleId: S.String,
    name: S.String,
    caseRuleArn: S.String,
    rule: CaseRuleDetails,
    description: S.optional(S.String),
    deleted: S.optional(S.Boolean),
    createdTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "GetCaseRuleResponse",
}) as any as S.Schema<GetCaseRuleResponse>;
export type BatchGetCaseRuleList = GetCaseRuleResponse[];
export const BatchGetCaseRuleList = S.Array(GetCaseRuleResponse);
export interface CaseRuleError {
  id: string;
  errorCode: string;
  message?: string;
}
export const CaseRuleError = S.suspend(() =>
  S.Struct({
    id: S.String,
    errorCode: S.String,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "CaseRuleError",
}) as any as S.Schema<CaseRuleError>;
export type BatchGetCaseRuleErrorList = CaseRuleError[];
export const BatchGetCaseRuleErrorList = S.Array(CaseRuleError);
export interface FieldOptionError {
  message: string;
  errorCode: string;
  value: string;
}
export const FieldOptionError = S.suspend(() =>
  S.Struct({ message: S.String, errorCode: S.String, value: S.String }),
).annotations({
  identifier: "FieldOptionError",
}) as any as S.Schema<FieldOptionError>;
export type FieldOptionErrorList = FieldOptionError[];
export const FieldOptionErrorList = S.Array(FieldOptionError);
export type AuditEventFieldValueUnion =
  | { stringValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { emptyValue: EmptyFieldValue }
  | { userArnValue: string };
export const AuditEventFieldValueUnion = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ emptyValue: EmptyFieldValue }),
  S.Struct({ userArnValue: S.String }),
);
export interface CreateCaseResponse {
  caseId: string;
  caseArn: string;
}
export const CreateCaseResponse = S.suspend(() =>
  S.Struct({ caseId: S.String, caseArn: S.String }),
).annotations({
  identifier: "CreateCaseResponse",
}) as any as S.Schema<CreateCaseResponse>;
export interface CreateRelatedItemRequest {
  domainId: string;
  caseId: string;
  type: string;
  content: (typeof RelatedItemInputContent)["Type"];
  performedBy?: (typeof UserUnion)["Type"];
}
export const CreateRelatedItemRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    type: S.String,
    content: RelatedItemInputContent,
    performedBy: S.optional(UserUnion),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateRelatedItemRequest",
}) as any as S.Schema<CreateRelatedItemRequest>;
export interface SearchRelatedItemsRequest {
  domainId: string;
  caseId: string;
  maxResults?: number;
  nextToken?: string;
  filters?: RelatedItemFilterList;
}
export const SearchRelatedItemsRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(RelatedItemFilterList),
  }).pipe(
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
  ),
).annotations({
  identifier: "SearchRelatedItemsRequest",
}) as any as S.Schema<SearchRelatedItemsRequest>;
export interface BatchGetCaseRuleResponse {
  caseRules: BatchGetCaseRuleList;
  errors: BatchGetCaseRuleErrorList;
  unprocessedCaseRules?: BatchGetCaseRuleUnprocessedList;
}
export const BatchGetCaseRuleResponse = S.suspend(() =>
  S.Struct({
    caseRules: BatchGetCaseRuleList,
    errors: BatchGetCaseRuleErrorList,
    unprocessedCaseRules: S.optional(BatchGetCaseRuleUnprocessedList),
  }),
).annotations({
  identifier: "BatchGetCaseRuleResponse",
}) as any as S.Schema<BatchGetCaseRuleResponse>;
export interface PutCaseEventConfigurationRequest {
  domainId: string;
  eventBridge: EventBridgeConfiguration;
}
export const PutCaseEventConfigurationRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    eventBridge: EventBridgeConfiguration,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutCaseEventConfigurationRequest",
}) as any as S.Schema<PutCaseEventConfigurationRequest>;
export interface PutCaseEventConfigurationResponse {}
export const PutCaseEventConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutCaseEventConfigurationResponse",
}) as any as S.Schema<PutCaseEventConfigurationResponse>;
export interface BatchPutFieldOptionsResponse {
  errors?: FieldOptionErrorList;
}
export const BatchPutFieldOptionsResponse = S.suspend(() =>
  S.Struct({ errors: S.optional(FieldOptionErrorList) }),
).annotations({
  identifier: "BatchPutFieldOptionsResponse",
}) as any as S.Schema<BatchPutFieldOptionsResponse>;
export interface AuditEventField {
  eventFieldId: string;
  oldValue?: (typeof AuditEventFieldValueUnion)["Type"];
  newValue: (typeof AuditEventFieldValueUnion)["Type"];
}
export const AuditEventField = S.suspend(() =>
  S.Struct({
    eventFieldId: S.String,
    oldValue: S.optional(AuditEventFieldValueUnion),
    newValue: AuditEventFieldValueUnion,
  }),
).annotations({
  identifier: "AuditEventField",
}) as any as S.Schema<AuditEventField>;
export type AuditEventFieldList = AuditEventField[];
export const AuditEventFieldList = S.Array(AuditEventField).pipe(T.Sparse());
export interface AuditEvent {
  eventId: string;
  type: string;
  relatedItemType?: string;
  performedTime: Date;
  fields: AuditEventFieldList;
  performedBy?: AuditEventPerformedBy;
}
export const AuditEvent = S.suspend(() =>
  S.Struct({
    eventId: S.String,
    type: S.String,
    relatedItemType: S.optional(S.String),
    performedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    fields: AuditEventFieldList,
    performedBy: S.optional(AuditEventPerformedBy),
  }),
).annotations({ identifier: "AuditEvent" }) as any as S.Schema<AuditEvent>;
export type AuditEventsList = AuditEvent[];
export const AuditEventsList = S.Array(AuditEvent).pipe(T.Sparse());
export interface SearchCasesResponseItem {
  caseId: string;
  templateId: string;
  fields: FieldValueList;
  tags?: Tags;
}
export const SearchCasesResponseItem = S.suspend(() =>
  S.Struct({
    caseId: S.String,
    templateId: S.String,
    fields: FieldValueList,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "SearchCasesResponseItem",
}) as any as S.Schema<SearchCasesResponseItem>;
export type SearchCasesResponseItemList = SearchCasesResponseItem[];
export const SearchCasesResponseItemList = S.Array(
  SearchCasesResponseItem,
).pipe(T.Sparse());
export interface ContactContent {
  contactArn: string;
  channel: string;
  connectedToSystemTime: Date;
}
export const ContactContent = S.suspend(() =>
  S.Struct({
    contactArn: S.String,
    channel: S.String,
    connectedToSystemTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ContactContent",
}) as any as S.Schema<ContactContent>;
export interface ConnectCaseContent {
  caseId: string;
}
export const ConnectCaseContent = S.suspend(() =>
  S.Struct({ caseId: S.String }),
).annotations({
  identifier: "ConnectCaseContent",
}) as any as S.Schema<ConnectCaseContent>;
export interface CustomContent {
  fields: FieldValueList;
}
export const CustomContent = S.suspend(() =>
  S.Struct({ fields: FieldValueList }),
).annotations({
  identifier: "CustomContent",
}) as any as S.Schema<CustomContent>;
export interface GetCaseAuditEventsResponse {
  nextToken?: string;
  auditEvents: AuditEventsList;
}
export const GetCaseAuditEventsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), auditEvents: AuditEventsList }),
).annotations({
  identifier: "GetCaseAuditEventsResponse",
}) as any as S.Schema<GetCaseAuditEventsResponse>;
export interface SearchCasesResponse {
  nextToken?: string;
  cases: SearchCasesResponseItemList;
}
export const SearchCasesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    cases: SearchCasesResponseItemList,
  }),
).annotations({
  identifier: "SearchCasesResponse",
}) as any as S.Schema<SearchCasesResponse>;
export interface CreateRelatedItemResponse {
  relatedItemId: string;
  relatedItemArn: string;
}
export const CreateRelatedItemResponse = S.suspend(() =>
  S.Struct({ relatedItemId: S.String, relatedItemArn: S.String }),
).annotations({
  identifier: "CreateRelatedItemResponse",
}) as any as S.Schema<CreateRelatedItemResponse>;
export interface SlaConfiguration {
  name: string | Redacted.Redacted<string>;
  type: string;
  status: string;
  fieldId?: string;
  targetFieldValues?: SlaFieldValueUnionList;
  targetTime: Date;
  completionTime?: Date;
}
export const SlaConfiguration = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    type: S.String,
    status: S.String,
    fieldId: S.optional(S.String),
    targetFieldValues: S.optional(SlaFieldValueUnionList),
    targetTime: S.Date.pipe(T.TimestampFormat("date-time")),
    completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "SlaConfiguration",
}) as any as S.Schema<SlaConfiguration>;
export interface SlaContent {
  slaConfiguration: SlaConfiguration;
}
export const SlaContent = S.suspend(() =>
  S.Struct({ slaConfiguration: SlaConfiguration }),
).annotations({ identifier: "SlaContent" }) as any as S.Schema<SlaContent>;
export type RelatedItemContent =
  | { contact: ContactContent }
  | { comment: CommentContent }
  | { file: FileContent }
  | { sla: SlaContent }
  | { connectCase: ConnectCaseContent }
  | { custom: CustomContent };
export const RelatedItemContent = S.Union(
  S.Struct({ contact: ContactContent }),
  S.Struct({ comment: CommentContent }),
  S.Struct({ file: FileContent }),
  S.Struct({ sla: SlaContent }),
  S.Struct({ connectCase: ConnectCaseContent }),
  S.Struct({ custom: CustomContent }),
);
export interface SearchRelatedItemsResponseItem {
  relatedItemId: string;
  type: string;
  associationTime: Date;
  content: (typeof RelatedItemContent)["Type"];
  tags?: Tags;
  performedBy?: (typeof UserUnion)["Type"];
}
export const SearchRelatedItemsResponseItem = S.suspend(() =>
  S.Struct({
    relatedItemId: S.String,
    type: S.String,
    associationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    content: RelatedItemContent,
    tags: S.optional(Tags),
    performedBy: S.optional(UserUnion),
  }),
).annotations({
  identifier: "SearchRelatedItemsResponseItem",
}) as any as S.Schema<SearchRelatedItemsResponseItem>;
export type SearchRelatedItemsResponseItemList =
  SearchRelatedItemsResponseItem[];
export const SearchRelatedItemsResponseItemList = S.Array(
  SearchRelatedItemsResponseItem,
).pipe(T.Sparse());
export interface SearchRelatedItemsResponse {
  nextToken?: string;
  relatedItems: SearchRelatedItemsResponseItemList;
}
export const SearchRelatedItemsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    relatedItems: SearchRelatedItemsResponseItemList,
  }),
).annotations({
  identifier: "SearchRelatedItemsResponse",
}) as any as S.Schema<SearchRelatedItemsResponse>;
export interface CreateCaseRuleRequest {
  domainId: string;
  name: string;
  description?: string;
  rule: (typeof CaseRuleDetails)["Type"];
}
export const CreateCaseRuleRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    name: S.String,
    description: S.optional(S.String),
    rule: CaseRuleDetails,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/case-rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCaseRuleRequest",
}) as any as S.Schema<CreateCaseRuleRequest>;
export interface SearchAllRelatedItemsResponseItem {
  relatedItemId: string;
  caseId: string;
  type: string;
  associationTime: Date;
  content: (typeof RelatedItemContent)["Type"];
  performedBy?: (typeof UserUnion)["Type"];
  tags?: Tags;
}
export const SearchAllRelatedItemsResponseItem = S.suspend(() =>
  S.Struct({
    relatedItemId: S.String,
    caseId: S.String,
    type: S.String,
    associationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    content: RelatedItemContent,
    performedBy: S.optional(UserUnion),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "SearchAllRelatedItemsResponseItem",
}) as any as S.Schema<SearchAllRelatedItemsResponseItem>;
export type SearchAllRelatedItemsResponseItemList =
  SearchAllRelatedItemsResponseItem[];
export const SearchAllRelatedItemsResponseItemList = S.Array(
  SearchAllRelatedItemsResponseItem,
).pipe(T.Sparse());
export interface CreateCaseRuleResponse {
  caseRuleId: string;
  caseRuleArn: string;
}
export const CreateCaseRuleResponse = S.suspend(() =>
  S.Struct({ caseRuleId: S.String, caseRuleArn: S.String }),
).annotations({
  identifier: "CreateCaseRuleResponse",
}) as any as S.Schema<CreateCaseRuleResponse>;
export interface SearchAllRelatedItemsResponse {
  nextToken?: string;
  relatedItems: SearchAllRelatedItemsResponseItemList;
}
export const SearchAllRelatedItemsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    relatedItems: SearchAllRelatedItemsResponseItemList,
  }),
).annotations({
  identifier: "SearchAllRelatedItemsResponse",
}) as any as S.Schema<SearchAllRelatedItemsResponse>;
export interface CreateLayoutRequest {
  domainId: string;
  name: string;
  content: (typeof LayoutContent)["Type"];
}
export const CreateLayoutRequest = S.suspend(() =>
  S.Struct({
    domainId: S.String.pipe(T.HttpLabel("domainId")),
    name: S.String,
    content: LayoutContent,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{domainId}/layouts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLayoutRequest",
}) as any as S.Schema<CreateLayoutRequest>;
export interface CreateLayoutResponse {
  layoutId: string;
  layoutArn: string;
}
export const CreateLayoutResponse = S.suspend(() =>
  S.Struct({ layoutId: S.String, layoutArn: S.String }),
).annotations({
  identifier: "CreateLayoutResponse",
}) as any as S.Schema<CreateLayoutResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes a case rule. In the Amazon Connect admin website, case rules are known as *case field conditions*. For more information about case field conditions, see Add case field conditions to a case template.
 */
export const deleteCaseRule: (
  input: DeleteCaseRuleRequest,
) => Effect.Effect<
  DeleteCaseRuleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDomains: {
  (
    input: ListDomainsRequest,
  ): Effect.Effect<
    ListDomainsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainsRequest,
  ) => Stream.Stream<
    ListDomainsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Adds case event publishing configuration. For a complete list of fields you can add to the event message, see Create case fields in the *Amazon Connect Administrator Guide*
 */
export const putCaseEventConfiguration: (
  input: PutCaseEventConfigurationRequest,
) => Effect.Effect<
  PutCaseEventConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates and updates a set of field options for a single select field in a Cases domain.
 */
export const batchPutFieldOptions: (
  input: BatchPutFieldOptionsRequest,
) => Effect.Effect<
  BatchPutFieldOptionsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns information about a specific case if it exists.
 */
export const getCase: {
  (
    input: GetCaseRequest,
  ): Effect.Effect<
    GetCaseResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCaseRequest,
  ) => Stream.Stream<
    GetCaseResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCaseRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCasesForContact: {
  (
    input: ListCasesForContactRequest,
  ): Effect.Effect<
    ListCasesForContactResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCasesForContactRequest,
  ) => Stream.Stream<
    ListCasesForContactResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCasesForContactRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCaseRules: {
  (
    input: ListCaseRulesRequest,
  ): Effect.Effect<
    ListCaseRulesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCaseRulesRequest,
  ) => Stream.Stream<
    ListCaseRulesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCaseRulesRequest,
  ) => Stream.Stream<
    CaseRuleSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all fields in a Cases domain.
 */
export const listFields: {
  (
    input: ListFieldsRequest,
  ): Effect.Effect<
    ListFieldsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFieldsRequest,
  ) => Stream.Stream<
    ListFieldsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFieldsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const batchGetField: (
  input: BatchGetFieldRequest,
) => Effect.Effect<
  BatchGetFieldResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listLayouts: {
  (
    input: ListLayoutsRequest,
  ): Effect.Effect<
    ListLayoutsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLayoutsRequest,
  ) => Stream.Stream<
    ListLayoutsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLayoutsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
    unknown,
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
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a specific domain if it exists.
 */
export const getDomain: (
  input: GetDomainRequest,
) => Effect.Effect<
  GetDomainResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCaseEventConfiguration: (
  input: GetCaseEventConfigurationRequest,
) => Effect.Effect<
  GetCaseEventConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCaseEventConfigurationRequest,
  output: GetCaseEventConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all of the field options for a field identifier in the domain.
 */
export const listFieldOptions: {
  (
    input: ListFieldOptionsRequest,
  ): Effect.Effect<
    ListFieldOptionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFieldOptionsRequest,
  ) => Stream.Stream<
    ListFieldOptionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFieldOptionsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns the details for the requested layout.
 */
export const getLayout: (
  input: GetLayoutRequest,
) => Effect.Effect<
  GetLayoutResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * If you provide a value for `PerformedBy.UserArn` you must also have connect:DescribeUser permission on the User ARN resource that you provide
 *
 * Updates the values of fields on a case. Fields to be updated are received as an array of id/value pairs identical to the `CreateCase` input .
 *
 * If the action is successful, the service sends back an HTTP 200 response with an empty HTTP body.
 */
export const updateCase: (
  input: UpdateCaseRequest,
) => Effect.Effect<
  UpdateCaseResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCase: (
  input: DeleteCaseRequest,
) => Effect.Effect<
  DeleteCaseResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRelatedItem: (
  input: DeleteRelatedItemRequest,
) => Effect.Effect<
  DeleteRelatedItemResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds tags to a resource.
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
 * Creates a field in the Cases domain. This field is used to define the case object model (that is, defines what data can be captured on cases) in a Cases domain.
 */
export const createField: (
  input: CreateFieldRequest,
) => Effect.Effect<
  CreateFieldResponse,
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
export const updateCaseRule: (
  input: UpdateCaseRuleRequest,
) => Effect.Effect<
  UpdateCaseRuleResponse,
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
export const deleteDomain: (
  input: DeleteDomainRequest,
) => Effect.Effect<
  DeleteDomainResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateField: (
  input: UpdateFieldRequest,
) => Effect.Effect<
  UpdateFieldResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteField: (
  input: DeleteFieldRequest,
) => Effect.Effect<
  DeleteFieldResponse,
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
export const updateLayout: (
  input: UpdateLayoutRequest,
) => Effect.Effect<
  UpdateLayoutResponse,
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
export const deleteLayout: (
  input: DeleteLayoutRequest,
) => Effect.Effect<
  DeleteLayoutResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTemplate: (
  input: UpdateTemplateRequest,
) => Effect.Effect<
  UpdateTemplateResponse,
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
 * Untags a resource.
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
export const createCase: (
  input: CreateCaseRequest,
) => Effect.Effect<
  CreateCaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetCaseRule: (
  input: BatchGetCaseRuleRequest,
) => Effect.Effect<
  BatchGetCaseRuleResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDomain: (
  input: CreateDomainRequest,
) => Effect.Effect<
  CreateDomainResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCaseAuditEvents: {
  (
    input: GetCaseAuditEventsRequest,
  ): Effect.Effect<
    GetCaseAuditEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCaseAuditEventsRequest,
  ) => Stream.Stream<
    GetCaseAuditEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCaseAuditEventsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Searches for cases within their associated Cases domain. Search results are returned as a paginated list of abridged case documents.
 *
 * For `customer_id` you must provide the full customer profile ARN in this format: ` arn:aws:profile:your AWS Region:your AWS account ID:domains/profiles domain name/profiles/profile ID`.
 */
export const searchCases: {
  (
    input: SearchCasesRequest,
  ): Effect.Effect<
    SearchCasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchCasesRequest,
  ) => Stream.Stream<
    SearchCasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchCasesRequest,
  ) => Stream.Stream<
    SearchCasesResponseItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const createRelatedItem: (
  input: CreateRelatedItemRequest,
) => Effect.Effect<
  CreateRelatedItemResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchRelatedItems: {
  (
    input: SearchRelatedItemsRequest,
  ): Effect.Effect<
    SearchRelatedItemsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchRelatedItemsRequest,
  ) => Stream.Stream<
    SearchRelatedItemsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchRelatedItemsRequest,
  ) => Stream.Stream<
    SearchRelatedItemsResponseItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates a new case rule. In the Amazon Connect admin website, case rules are known as *case field conditions*. For more information about case field conditions, see Add case field conditions to a case template.
 */
export const createCaseRule: (
  input: CreateCaseRuleRequest,
) => Effect.Effect<
  CreateCaseRuleResponse,
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
export const searchAllRelatedItems: {
  (
    input: SearchAllRelatedItemsRequest,
  ): Effect.Effect<
    SearchAllRelatedItemsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchAllRelatedItemsRequest,
  ) => Stream.Stream<
    SearchAllRelatedItemsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchAllRelatedItemsRequest,
  ) => Stream.Stream<
    SearchAllRelatedItemsResponseItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createLayout: (
  input: CreateLayoutRequest,
) => Effect.Effect<
  CreateLayoutResponse,
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

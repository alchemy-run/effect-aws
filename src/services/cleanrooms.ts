import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CleanRooms",
  serviceShapeName: "AWSBastionControlPlaneServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "cleanrooms" });
const ver = T.ServiceVersion("2022-02-17");
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
                                url: "https://cleanrooms-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://cleanrooms-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://cleanrooms.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cleanrooms.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const MemberAbilities = S.Array(S.String);
export const AutoApprovedChangeTypeList = S.Array(S.String);
export const AllowedResultRegions = S.Array(S.String);
export const AnalysisTemplateArnList = S.Array(S.String);
export const TableAliasList = S.Array(S.String);
export const AllowedColumnList = S.Array(S.String);
export const SelectedAnalysisMethods = S.Array(S.String);
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class GetAnalysisTemplateInput extends S.Class<GetAnalysisTemplateInput>(
  "GetAnalysisTemplateInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    analysisTemplateIdentifier: S.String.pipe(
      T.HttpLabel("analysisTemplateIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/analysistemplates/{analysisTemplateIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAnalysisTemplateInput extends S.Class<UpdateAnalysisTemplateInput>(
  "UpdateAnalysisTemplateInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    analysisTemplateIdentifier: S.String.pipe(
      T.HttpLabel("analysisTemplateIdentifier"),
    ),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/analysistemplates/{analysisTemplateIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnalysisTemplateInput extends S.Class<DeleteAnalysisTemplateInput>(
  "DeleteAnalysisTemplateInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    analysisTemplateIdentifier: S.String.pipe(
      T.HttpLabel("analysisTemplateIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/analysistemplates/{analysisTemplateIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnalysisTemplateOutput extends S.Class<DeleteAnalysisTemplateOutput>(
  "DeleteAnalysisTemplateOutput",
)({}) {}
export class ListAnalysisTemplatesInput extends S.Class<ListAnalysisTemplatesInput>(
  "ListAnalysisTemplatesInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/analysistemplates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCollaborationInput extends S.Class<GetCollaborationInput>(
  "GetCollaborationInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/collaborations/{collaborationIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCollaborationInput extends S.Class<UpdateCollaborationInput>(
  "UpdateCollaborationInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    name: S.optional(S.String),
    description: S.optional(S.String),
    analyticsEngine: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/collaborations/{collaborationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCollaborationInput extends S.Class<DeleteCollaborationInput>(
  "DeleteCollaborationInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/collaborations/{collaborationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCollaborationOutput extends S.Class<DeleteCollaborationOutput>(
  "DeleteCollaborationOutput",
)({}) {}
export class ListCollaborationsInput extends S.Class<ListCollaborationsInput>(
  "ListCollaborationsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    memberStatus: S.optional(S.String).pipe(T.HttpQuery("memberStatus")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/collaborations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetCollaborationAnalysisTemplateInput extends S.Class<BatchGetCollaborationAnalysisTemplateInput>(
  "BatchGetCollaborationAnalysisTemplateInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    analysisTemplateArns: AnalysisTemplateArnList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/collaborations/{collaborationIdentifier}/batch-analysistemplates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetSchemaInput extends S.Class<BatchGetSchemaInput>(
  "BatchGetSchemaInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    names: TableAliasList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/collaborations/{collaborationIdentifier}/batch-schema",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMemberInput extends S.Class<DeleteMemberInput>(
  "DeleteMemberInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    accountId: S.String.pipe(T.HttpLabel("accountId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/collaborations/{collaborationIdentifier}/member/{accountId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMemberOutput extends S.Class<DeleteMemberOutput>(
  "DeleteMemberOutput",
)({}) {}
export class GetCollaborationAnalysisTemplateInput extends S.Class<GetCollaborationAnalysisTemplateInput>(
  "GetCollaborationAnalysisTemplateInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    analysisTemplateArn: S.String.pipe(T.HttpLabel("analysisTemplateArn")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/analysistemplates/{analysisTemplateArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCollaborationChangeRequestInput extends S.Class<GetCollaborationChangeRequestInput>(
  "GetCollaborationChangeRequestInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    changeRequestIdentifier: S.String.pipe(
      T.HttpLabel("changeRequestIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/changeRequests/{changeRequestIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCollaborationConfiguredAudienceModelAssociationInput extends S.Class<GetCollaborationConfiguredAudienceModelAssociationInput>(
  "GetCollaborationConfiguredAudienceModelAssociationInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    configuredAudienceModelAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredAudienceModelAssociationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/configuredaudiencemodelassociations/{configuredAudienceModelAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCollaborationIdNamespaceAssociationInput extends S.Class<GetCollaborationIdNamespaceAssociationInput>(
  "GetCollaborationIdNamespaceAssociationInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    idNamespaceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("idNamespaceAssociationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/idnamespaceassociations/{idNamespaceAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCollaborationPrivacyBudgetTemplateInput extends S.Class<GetCollaborationPrivacyBudgetTemplateInput>(
  "GetCollaborationPrivacyBudgetTemplateInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    privacyBudgetTemplateIdentifier: S.String.pipe(
      T.HttpLabel("privacyBudgetTemplateIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/privacybudgettemplates/{privacyBudgetTemplateIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSchemaInput extends S.Class<GetSchemaInput>("GetSchemaInput")(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/schemas/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSchemaAnalysisRuleInput extends S.Class<GetSchemaAnalysisRuleInput>(
  "GetSchemaAnalysisRuleInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    name: S.String.pipe(T.HttpLabel("name")),
    type: S.String.pipe(T.HttpLabel("type")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/schemas/{name}/analysisRule/{type}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationAnalysisTemplatesInput extends S.Class<ListCollaborationAnalysisTemplatesInput>(
  "ListCollaborationAnalysisTemplatesInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/analysistemplates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationChangeRequestsInput extends S.Class<ListCollaborationChangeRequestsInput>(
  "ListCollaborationChangeRequestsInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/changeRequests",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationConfiguredAudienceModelAssociationsInput extends S.Class<ListCollaborationConfiguredAudienceModelAssociationsInput>(
  "ListCollaborationConfiguredAudienceModelAssociationsInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/configuredaudiencemodelassociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationIdNamespaceAssociationsInput extends S.Class<ListCollaborationIdNamespaceAssociationsInput>(
  "ListCollaborationIdNamespaceAssociationsInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/idnamespaceassociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationPrivacyBudgetsInput extends S.Class<ListCollaborationPrivacyBudgetsInput>(
  "ListCollaborationPrivacyBudgetsInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    privacyBudgetType: S.String.pipe(T.HttpQuery("privacyBudgetType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    accessBudgetResourceArn: S.optional(S.String).pipe(
      T.HttpQuery("accessBudgetResourceArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/privacybudgets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationPrivacyBudgetTemplatesInput extends S.Class<ListCollaborationPrivacyBudgetTemplatesInput>(
  "ListCollaborationPrivacyBudgetTemplatesInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/privacybudgettemplates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMembersInput extends S.Class<ListMembersInput>(
  "ListMembersInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/members",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSchemasInput extends S.Class<ListSchemasInput>(
  "ListSchemasInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    schemaType: S.optional(S.String).pipe(T.HttpQuery("schemaType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/schemas",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCollaborationChangeRequestInput extends S.Class<UpdateCollaborationChangeRequestInput>(
  "UpdateCollaborationChangeRequestInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    changeRequestIdentifier: S.String.pipe(
      T.HttpLabel("changeRequestIdentifier"),
    ),
    action: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/collaborations/{collaborationIdentifier}/changeRequests/{changeRequestIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateConfiguredAudienceModelAssociationInput extends S.Class<CreateConfiguredAudienceModelAssociationInput>(
  "CreateConfiguredAudienceModelAssociationInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredAudienceModelArn: S.String,
    configuredAudienceModelAssociationName: S.String,
    manageResourcePolicies: S.Boolean,
    tags: S.optional(TagMap),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfiguredAudienceModelAssociationInput extends S.Class<GetConfiguredAudienceModelAssociationInput>(
  "GetConfiguredAudienceModelAssociationInput",
)(
  {
    configuredAudienceModelAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredAudienceModelAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations/{configuredAudienceModelAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConfiguredAudienceModelAssociationInput extends S.Class<UpdateConfiguredAudienceModelAssociationInput>(
  "UpdateConfiguredAudienceModelAssociationInput",
)(
  {
    configuredAudienceModelAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredAudienceModelAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    description: S.optional(S.String),
    name: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations/{configuredAudienceModelAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredAudienceModelAssociationInput extends S.Class<DeleteConfiguredAudienceModelAssociationInput>(
  "DeleteConfiguredAudienceModelAssociationInput",
)(
  {
    configuredAudienceModelAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredAudienceModelAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations/{configuredAudienceModelAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredAudienceModelAssociationOutput extends S.Class<DeleteConfiguredAudienceModelAssociationOutput>(
  "DeleteConfiguredAudienceModelAssociationOutput",
)({}) {}
export class ListConfiguredAudienceModelAssociationsInput extends S.Class<ListConfiguredAudienceModelAssociationsInput>(
  "ListConfiguredAudienceModelAssociationsInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConfiguredTableAssociationInput extends S.Class<CreateConfiguredTableAssociationInput>(
  "CreateConfiguredTableAssociationInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableIdentifier: S.String,
    roleArn: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/configuredTableAssociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfiguredTableAssociationInput extends S.Class<GetConfiguredTableAssociationInput>(
  "GetConfiguredTableAssociationInput",
)(
  {
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConfiguredTableAssociationInput extends S.Class<UpdateConfiguredTableAssociationInput>(
  "UpdateConfiguredTableAssociationInput",
)(
  {
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    description: S.optional(S.String),
    roleArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredTableAssociationInput extends S.Class<DeleteConfiguredTableAssociationInput>(
  "DeleteConfiguredTableAssociationInput",
)(
  {
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredTableAssociationOutput extends S.Class<DeleteConfiguredTableAssociationOutput>(
  "DeleteConfiguredTableAssociationOutput",
)({}) {}
export class ListConfiguredTableAssociationsInput extends S.Class<ListConfiguredTableAssociationsInput>(
  "ListConfiguredTableAssociationsInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/configuredTableAssociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredTableAssociationAnalysisRuleInput extends S.Class<DeleteConfiguredTableAssociationAnalysisRuleInput>(
  "DeleteConfiguredTableAssociationAnalysisRuleInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    analysisRuleType: S.String.pipe(T.HttpLabel("analysisRuleType")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}/analysisRule/{analysisRuleType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredTableAssociationAnalysisRuleOutput extends S.Class<DeleteConfiguredTableAssociationAnalysisRuleOutput>(
  "DeleteConfiguredTableAssociationAnalysisRuleOutput",
)({}) {}
export class GetConfiguredTableAssociationAnalysisRuleInput extends S.Class<GetConfiguredTableAssociationAnalysisRuleInput>(
  "GetConfiguredTableAssociationAnalysisRuleInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    analysisRuleType: S.String.pipe(T.HttpLabel("analysisRuleType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}/analysisRule/{analysisRuleType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AllowedResultReceivers = S.Array(S.String);
export const AllowedAdditionalAnalyses = S.Array(S.String);
export class ConfiguredTableAssociationAnalysisRuleList extends S.Class<ConfiguredTableAssociationAnalysisRuleList>(
  "ConfiguredTableAssociationAnalysisRuleList",
)({
  allowedResultReceivers: S.optional(AllowedResultReceivers),
  allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
}) {}
export class ConfiguredTableAssociationAnalysisRuleAggregation extends S.Class<ConfiguredTableAssociationAnalysisRuleAggregation>(
  "ConfiguredTableAssociationAnalysisRuleAggregation",
)({
  allowedResultReceivers: S.optional(AllowedResultReceivers),
  allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
}) {}
export class ConfiguredTableAssociationAnalysisRuleCustom extends S.Class<ConfiguredTableAssociationAnalysisRuleCustom>(
  "ConfiguredTableAssociationAnalysisRuleCustom",
)({
  allowedResultReceivers: S.optional(AllowedResultReceivers),
  allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
}) {}
export const ConfiguredTableAssociationAnalysisRulePolicyV1 = S.Union(
  S.Struct({ list: ConfiguredTableAssociationAnalysisRuleList }),
  S.Struct({ aggregation: ConfiguredTableAssociationAnalysisRuleAggregation }),
  S.Struct({ custom: ConfiguredTableAssociationAnalysisRuleCustom }),
);
export const ConfiguredTableAssociationAnalysisRulePolicy = S.Union(
  S.Struct({ v1: ConfiguredTableAssociationAnalysisRulePolicyV1 }),
);
export class UpdateConfiguredTableAssociationAnalysisRuleInput extends S.Class<UpdateConfiguredTableAssociationAnalysisRuleInput>(
  "UpdateConfiguredTableAssociationAnalysisRuleInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    analysisRuleType: S.String.pipe(T.HttpLabel("analysisRuleType")),
    analysisRulePolicy: ConfiguredTableAssociationAnalysisRulePolicy,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}/analysisRule/{analysisRuleType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfiguredTableInput extends S.Class<GetConfiguredTableInput>(
  "GetConfiguredTableInput",
)(
  {
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/configuredTables/{configuredTableIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GlueTableReference extends S.Class<GlueTableReference>(
  "GlueTableReference",
)({
  region: S.optional(S.String),
  tableName: S.String,
  databaseName: S.String,
}) {}
export class SnowflakeTableSchemaV1 extends S.Class<SnowflakeTableSchemaV1>(
  "SnowflakeTableSchemaV1",
)({ columnName: S.String, columnType: S.String }) {}
export const SnowflakeTableSchemaList = S.Array(SnowflakeTableSchemaV1);
export const SnowflakeTableSchema = S.Union(
  S.Struct({ v1: SnowflakeTableSchemaList }),
);
export class SnowflakeTableReference extends S.Class<SnowflakeTableReference>(
  "SnowflakeTableReference",
)({
  secretArn: S.String,
  accountIdentifier: S.String,
  databaseName: S.String,
  tableName: S.String,
  schemaName: S.String,
  tableSchema: SnowflakeTableSchema,
}) {}
export class AthenaTableReference extends S.Class<AthenaTableReference>(
  "AthenaTableReference",
)({
  region: S.optional(S.String),
  workGroup: S.String,
  outputLocation: S.optional(S.String),
  databaseName: S.String,
  tableName: S.String,
}) {}
export const TableReference = S.Union(
  S.Struct({ glue: GlueTableReference }),
  S.Struct({ snowflake: SnowflakeTableReference }),
  S.Struct({ athena: AthenaTableReference }),
);
export class UpdateConfiguredTableInput extends S.Class<UpdateConfiguredTableInput>(
  "UpdateConfiguredTableInput",
)(
  {
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    name: S.optional(S.String),
    description: S.optional(S.String),
    tableReference: S.optional(TableReference),
    allowedColumns: S.optional(AllowedColumnList),
    analysisMethod: S.optional(S.String),
    selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/configuredTables/{configuredTableIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredTableInput extends S.Class<DeleteConfiguredTableInput>(
  "DeleteConfiguredTableInput",
)(
  {
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/configuredTables/{configuredTableIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredTableOutput extends S.Class<DeleteConfiguredTableOutput>(
  "DeleteConfiguredTableOutput",
)({}) {}
export class ListConfiguredTablesInput extends S.Class<ListConfiguredTablesInput>(
  "ListConfiguredTablesInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/configuredTables" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredTableAnalysisRuleInput extends S.Class<DeleteConfiguredTableAnalysisRuleInput>(
  "DeleteConfiguredTableAnalysisRuleInput",
)(
  {
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    analysisRuleType: S.String.pipe(T.HttpLabel("analysisRuleType")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/configuredTables/{configuredTableIdentifier}/analysisRule/{analysisRuleType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredTableAnalysisRuleOutput extends S.Class<DeleteConfiguredTableAnalysisRuleOutput>(
  "DeleteConfiguredTableAnalysisRuleOutput",
)({}) {}
export class GetConfiguredTableAnalysisRuleInput extends S.Class<GetConfiguredTableAnalysisRuleInput>(
  "GetConfiguredTableAnalysisRuleInput",
)(
  {
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    analysisRuleType: S.String.pipe(T.HttpLabel("analysisRuleType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/configuredTables/{configuredTableIdentifier}/analysisRule/{analysisRuleType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AnalysisRuleColumnList = S.Array(S.String);
export const JoinOperatorsList = S.Array(S.String);
export class AnalysisRuleList extends S.Class<AnalysisRuleList>(
  "AnalysisRuleList",
)({
  joinColumns: AnalysisRuleColumnList,
  allowedJoinOperators: S.optional(JoinOperatorsList),
  listColumns: AnalysisRuleColumnList,
  additionalAnalyses: S.optional(S.String),
}) {}
export const AnalysisRuleColumnNameList = S.Array(S.String);
export class AggregateColumn extends S.Class<AggregateColumn>(
  "AggregateColumn",
)({ columnNames: AnalysisRuleColumnNameList, function: S.String }) {}
export const AggregateColumnList = S.Array(AggregateColumn);
export const ScalarFunctionsList = S.Array(S.String);
export class AggregationConstraint extends S.Class<AggregationConstraint>(
  "AggregationConstraint",
)({ columnName: S.String, minimum: S.Number, type: S.String }) {}
export const AggregationConstraints = S.Array(AggregationConstraint);
export class AnalysisRuleAggregation extends S.Class<AnalysisRuleAggregation>(
  "AnalysisRuleAggregation",
)({
  aggregateColumns: AggregateColumnList,
  joinColumns: AnalysisRuleColumnList,
  joinRequired: S.optional(S.String),
  allowedJoinOperators: S.optional(JoinOperatorsList),
  dimensionColumns: AnalysisRuleColumnList,
  scalarFunctions: ScalarFunctionsList,
  outputConstraints: AggregationConstraints,
  additionalAnalyses: S.optional(S.String),
}) {}
export const AllowedAnalysesList = S.Array(S.String);
export const AllowedAnalysisProviderList = S.Array(S.String);
export class DifferentialPrivacyColumn extends S.Class<DifferentialPrivacyColumn>(
  "DifferentialPrivacyColumn",
)({ name: S.String }) {}
export const DifferentialPrivacyColumnList = S.Array(DifferentialPrivacyColumn);
export class DifferentialPrivacyConfiguration extends S.Class<DifferentialPrivacyConfiguration>(
  "DifferentialPrivacyConfiguration",
)({ columns: DifferentialPrivacyColumnList }) {}
export class AnalysisRuleCustom extends S.Class<AnalysisRuleCustom>(
  "AnalysisRuleCustom",
)({
  allowedAnalyses: AllowedAnalysesList,
  allowedAnalysisProviders: S.optional(AllowedAnalysisProviderList),
  additionalAnalyses: S.optional(S.String),
  disallowedOutputColumns: S.optional(AnalysisRuleColumnList),
  differentialPrivacy: S.optional(DifferentialPrivacyConfiguration),
}) {}
export const ConfiguredTableAnalysisRulePolicyV1 = S.Union(
  S.Struct({ list: AnalysisRuleList }),
  S.Struct({ aggregation: AnalysisRuleAggregation }),
  S.Struct({ custom: AnalysisRuleCustom }),
);
export const ConfiguredTableAnalysisRulePolicy = S.Union(
  S.Struct({ v1: ConfiguredTableAnalysisRulePolicyV1 }),
);
export class UpdateConfiguredTableAnalysisRuleInput extends S.Class<UpdateConfiguredTableAnalysisRuleInput>(
  "UpdateConfiguredTableAnalysisRuleInput",
)(
  {
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    analysisRuleType: S.String.pipe(T.HttpLabel("analysisRuleType")),
    analysisRulePolicy: ConfiguredTableAnalysisRulePolicy,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/configuredTables/{configuredTableIdentifier}/analysisRule/{analysisRuleType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdMappingTableInput extends S.Class<GetIdMappingTableInput>(
  "GetIdMappingTableInput",
)(
  {
    idMappingTableIdentifier: S.String.pipe(
      T.HttpLabel("idMappingTableIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/idmappingtables/{idMappingTableIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateIdMappingTableInput extends S.Class<UpdateIdMappingTableInput>(
  "UpdateIdMappingTableInput",
)(
  {
    idMappingTableIdentifier: S.String.pipe(
      T.HttpLabel("idMappingTableIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    description: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/idmappingtables/{idMappingTableIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdMappingTableInput extends S.Class<DeleteIdMappingTableInput>(
  "DeleteIdMappingTableInput",
)(
  {
    idMappingTableIdentifier: S.String.pipe(
      T.HttpLabel("idMappingTableIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/idmappingtables/{idMappingTableIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdMappingTableOutput extends S.Class<DeleteIdMappingTableOutput>(
  "DeleteIdMappingTableOutput",
)({}) {}
export class ListIdMappingTablesInput extends S.Class<ListIdMappingTablesInput>(
  "ListIdMappingTablesInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/idmappingtables",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PopulateIdMappingTableInput extends S.Class<PopulateIdMappingTableInput>(
  "PopulateIdMappingTableInput",
)(
  {
    idMappingTableIdentifier: S.String.pipe(
      T.HttpLabel("idMappingTableIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    jobType: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/idmappingtables/{idMappingTableIdentifier}/populate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdNamespaceAssociationInput extends S.Class<GetIdNamespaceAssociationInput>(
  "GetIdNamespaceAssociationInput",
)(
  {
    idNamespaceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("idNamespaceAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/idnamespaceassociations/{idNamespaceAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IdMappingConfig extends S.Class<IdMappingConfig>(
  "IdMappingConfig",
)({ allowUseAsDimensionColumn: S.Boolean }) {}
export class UpdateIdNamespaceAssociationInput extends S.Class<UpdateIdNamespaceAssociationInput>(
  "UpdateIdNamespaceAssociationInput",
)(
  {
    idNamespaceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("idNamespaceAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    idMappingConfig: S.optional(IdMappingConfig),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/idnamespaceassociations/{idNamespaceAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdNamespaceAssociationInput extends S.Class<DeleteIdNamespaceAssociationInput>(
  "DeleteIdNamespaceAssociationInput",
)(
  {
    idNamespaceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("idNamespaceAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/idnamespaceassociations/{idNamespaceAssociationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdNamespaceAssociationOutput extends S.Class<DeleteIdNamespaceAssociationOutput>(
  "DeleteIdNamespaceAssociationOutput",
)({}) {}
export class ListIdNamespaceAssociationsInput extends S.Class<ListIdNamespaceAssociationsInput>(
  "ListIdNamespaceAssociationsInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/idnamespaceassociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMembershipInput extends S.Class<GetMembershipInput>(
  "GetMembershipInput",
)(
  { membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/memberships/{membershipIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ProtectedQueryS3OutputConfiguration extends S.Class<ProtectedQueryS3OutputConfiguration>(
  "ProtectedQueryS3OutputConfiguration",
)({
  resultFormat: S.String,
  bucket: S.String,
  keyPrefix: S.optional(S.String),
  singleFileOutput: S.optional(S.Boolean),
}) {}
export const MembershipProtectedQueryOutputConfiguration = S.Union(
  S.Struct({ s3: ProtectedQueryS3OutputConfiguration }),
);
export class MembershipProtectedQueryResultConfiguration extends S.Class<MembershipProtectedQueryResultConfiguration>(
  "MembershipProtectedQueryResultConfiguration",
)({
  outputConfiguration: MembershipProtectedQueryOutputConfiguration,
  roleArn: S.optional(S.String),
}) {}
export class ProtectedJobS3OutputConfigurationInput extends S.Class<ProtectedJobS3OutputConfigurationInput>(
  "ProtectedJobS3OutputConfigurationInput",
)({ bucket: S.String, keyPrefix: S.optional(S.String) }) {}
export const MembershipProtectedJobOutputConfiguration = S.Union(
  S.Struct({ s3: ProtectedJobS3OutputConfigurationInput }),
);
export class MembershipProtectedJobResultConfiguration extends S.Class<MembershipProtectedJobResultConfiguration>(
  "MembershipProtectedJobResultConfiguration",
)({
  outputConfiguration: MembershipProtectedJobOutputConfiguration,
  roleArn: S.String,
}) {}
export class UpdateMembershipInput extends S.Class<UpdateMembershipInput>(
  "UpdateMembershipInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    queryLogStatus: S.optional(S.String),
    jobLogStatus: S.optional(S.String),
    defaultResultConfiguration: S.optional(
      MembershipProtectedQueryResultConfiguration,
    ),
    defaultJobResultConfiguration: S.optional(
      MembershipProtectedJobResultConfiguration,
    ),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/memberships/{membershipIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMembershipInput extends S.Class<DeleteMembershipInput>(
  "DeleteMembershipInput",
)(
  { membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/memberships/{membershipIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMembershipOutput extends S.Class<DeleteMembershipOutput>(
  "DeleteMembershipOutput",
)({}) {}
export class ListMembershipsInput extends S.Class<ListMembershipsInput>(
  "ListMembershipsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/memberships" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProtectedJobInput extends S.Class<GetProtectedJobInput>(
  "GetProtectedJobInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    protectedJobIdentifier: S.String.pipe(
      T.HttpLabel("protectedJobIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/protectedJobs/{protectedJobIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProtectedQueryInput extends S.Class<GetProtectedQueryInput>(
  "GetProtectedQueryInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    protectedQueryIdentifier: S.String.pipe(
      T.HttpLabel("protectedQueryIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/protectedQueries/{protectedQueryIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPrivacyBudgetsInput extends S.Class<ListPrivacyBudgetsInput>(
  "ListPrivacyBudgetsInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    privacyBudgetType: S.String.pipe(T.HttpQuery("privacyBudgetType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    accessBudgetResourceArn: S.optional(S.String).pipe(
      T.HttpQuery("accessBudgetResourceArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/privacybudgets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProtectedJobsInput extends S.Class<ListProtectedJobsInput>(
  "ListProtectedJobsInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/protectedJobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProtectedQueriesInput extends S.Class<ListProtectedQueriesInput>(
  "ListProtectedQueriesInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/protectedQueries",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProtectedJobInput extends S.Class<UpdateProtectedJobInput>(
  "UpdateProtectedJobInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    protectedJobIdentifier: S.String.pipe(
      T.HttpLabel("protectedJobIdentifier"),
    ),
    targetStatus: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/protectedJobs/{protectedJobIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProtectedQueryInput extends S.Class<UpdateProtectedQueryInput>(
  "UpdateProtectedQueryInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    protectedQueryIdentifier: S.String.pipe(
      T.HttpLabel("protectedQueryIdentifier"),
    ),
    targetStatus: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/protectedQueries/{protectedQueryIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPrivacyBudgetTemplateInput extends S.Class<GetPrivacyBudgetTemplateInput>(
  "GetPrivacyBudgetTemplateInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    privacyBudgetTemplateIdentifier: S.String.pipe(
      T.HttpLabel("privacyBudgetTemplateIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/privacybudgettemplates/{privacyBudgetTemplateIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePrivacyBudgetTemplateInput extends S.Class<DeletePrivacyBudgetTemplateInput>(
  "DeletePrivacyBudgetTemplateInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    privacyBudgetTemplateIdentifier: S.String.pipe(
      T.HttpLabel("privacyBudgetTemplateIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/privacybudgettemplates/{privacyBudgetTemplateIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePrivacyBudgetTemplateOutput extends S.Class<DeletePrivacyBudgetTemplateOutput>(
  "DeletePrivacyBudgetTemplateOutput",
)({}) {}
export class ListPrivacyBudgetTemplatesInput extends S.Class<ListPrivacyBudgetTemplatesInput>(
  "ListPrivacyBudgetTemplatesInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/privacybudgettemplates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const QueryTables = S.Array(S.String);
export const CustomMLMemberAbilities = S.Array(S.String);
export class AnalysisParameter extends S.Class<AnalysisParameter>(
  "AnalysisParameter",
)({ name: S.String, type: S.String, defaultValue: S.optional(S.String) }) {}
export const AnalysisParameterList = S.Array(AnalysisParameter);
export class AnalysisSchema extends S.Class<AnalysisSchema>("AnalysisSchema")({
  referencedTables: S.optional(QueryTables),
}) {}
export class ErrorMessageConfiguration extends S.Class<ErrorMessageConfiguration>(
  "ErrorMessageConfiguration",
)({ type: S.String }) {}
export class MLMemberAbilities extends S.Class<MLMemberAbilities>(
  "MLMemberAbilities",
)({ customMLMemberAbilities: CustomMLMemberAbilities }) {}
export class QueryComputePaymentConfig extends S.Class<QueryComputePaymentConfig>(
  "QueryComputePaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class ModelTrainingPaymentConfig extends S.Class<ModelTrainingPaymentConfig>(
  "ModelTrainingPaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class ModelInferencePaymentConfig extends S.Class<ModelInferencePaymentConfig>(
  "ModelInferencePaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class SyntheticDataGenerationPaymentConfig extends S.Class<SyntheticDataGenerationPaymentConfig>(
  "SyntheticDataGenerationPaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class MLPaymentConfig extends S.Class<MLPaymentConfig>(
  "MLPaymentConfig",
)({
  modelTraining: S.optional(ModelTrainingPaymentConfig),
  modelInference: S.optional(ModelInferencePaymentConfig),
  syntheticDataGeneration: S.optional(SyntheticDataGenerationPaymentConfig),
}) {}
export class JobComputePaymentConfig extends S.Class<JobComputePaymentConfig>(
  "JobComputePaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class PaymentConfiguration extends S.Class<PaymentConfiguration>(
  "PaymentConfiguration",
)({
  queryCompute: QueryComputePaymentConfig,
  machineLearning: S.optional(MLPaymentConfig),
  jobCompute: S.optional(JobComputePaymentConfig),
}) {}
export class MemberSpecification extends S.Class<MemberSpecification>(
  "MemberSpecification",
)({
  accountId: S.String,
  memberAbilities: MemberAbilities,
  mlMemberAbilities: S.optional(MLMemberAbilities),
  displayName: S.String,
  paymentConfiguration: S.optional(PaymentConfiguration),
}) {}
export const MemberList = S.Array(MemberSpecification);
export class DataEncryptionMetadata extends S.Class<DataEncryptionMetadata>(
  "DataEncryptionMetadata",
)({
  allowCleartext: S.Boolean,
  allowDuplicates: S.Boolean,
  allowJoinsOnColumnsWithDifferentNames: S.Boolean,
  preserveNulls: S.Boolean,
}) {}
export class SchemaAnalysisRuleRequest extends S.Class<SchemaAnalysisRuleRequest>(
  "SchemaAnalysisRuleRequest",
)({ name: S.String, type: S.String }) {}
export const SchemaAnalysisRuleRequestList = S.Array(SchemaAnalysisRuleRequest);
export class IdMappingTableInputReferenceConfig extends S.Class<IdMappingTableInputReferenceConfig>(
  "IdMappingTableInputReferenceConfig",
)({ inputReferenceArn: S.String, manageResourcePolicies: S.Boolean }) {}
export class IdNamespaceAssociationInputReferenceConfig extends S.Class<IdNamespaceAssociationInputReferenceConfig>(
  "IdNamespaceAssociationInputReferenceConfig",
)({ inputReferenceArn: S.String, manageResourcePolicies: S.Boolean }) {}
export class ProtectedJobParameters extends S.Class<ProtectedJobParameters>(
  "ProtectedJobParameters",
)({ analysisTemplateArn: S.String }) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucket: S.String,
  key: S.String,
}) {}
export class AnalysisTemplateArtifact extends S.Class<AnalysisTemplateArtifact>(
  "AnalysisTemplateArtifact",
)({ location: S3Location }) {}
export const AnalysisTemplateArtifactList = S.Array(AnalysisTemplateArtifact);
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: TagMap }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class AnalysisTemplateArtifacts extends S.Class<AnalysisTemplateArtifacts>(
  "AnalysisTemplateArtifacts",
)({
  entryPoint: AnalysisTemplateArtifact,
  additionalArtifacts: S.optional(AnalysisTemplateArtifactList),
  roleArn: S.String,
}) {}
export const AnalysisSource = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ artifacts: AnalysisTemplateArtifacts }),
);
export class Hash extends S.Class<Hash>("Hash")({
  sha256: S.optional(S.String),
}) {}
export const HashList = S.Array(Hash);
export class AnalysisTemplateArtifactMetadata extends S.Class<AnalysisTemplateArtifactMetadata>(
  "AnalysisTemplateArtifactMetadata",
)({ entryPointHash: Hash, additionalArtifactHashes: S.optional(HashList) }) {}
export const AnalysisSourceMetadata = S.Union(
  S.Struct({ artifacts: AnalysisTemplateArtifactMetadata }),
);
export class AnalysisTemplateValidationStatusReason extends S.Class<AnalysisTemplateValidationStatusReason>(
  "AnalysisTemplateValidationStatusReason",
)({ message: S.String }) {}
export const AnalysisTemplateValidationStatusReasonList = S.Array(
  AnalysisTemplateValidationStatusReason,
);
export class AnalysisTemplateValidationStatusDetail extends S.Class<AnalysisTemplateValidationStatusDetail>(
  "AnalysisTemplateValidationStatusDetail",
)({
  type: S.String,
  status: S.String,
  reasons: S.optional(AnalysisTemplateValidationStatusReasonList),
}) {}
export const AnalysisTemplateValidationStatusDetailList = S.Array(
  AnalysisTemplateValidationStatusDetail,
);
export class SyntheticDataColumnProperties extends S.Class<SyntheticDataColumnProperties>(
  "SyntheticDataColumnProperties",
)({
  columnName: S.String,
  columnType: S.String,
  isPredictiveValue: S.Boolean,
}) {}
export const ColumnMappingList = S.Array(SyntheticDataColumnProperties);
export class ColumnClassificationDetails extends S.Class<ColumnClassificationDetails>(
  "ColumnClassificationDetails",
)({ columnMapping: ColumnMappingList }) {}
export class MLSyntheticDataParameters extends S.Class<MLSyntheticDataParameters>(
  "MLSyntheticDataParameters",
)({
  epsilon: S.Number,
  maxMembershipInferenceAttackScore: S.Number,
  columnClassification: ColumnClassificationDetails,
}) {}
export const SyntheticDataParameters = S.Union(
  S.Struct({ mlSyntheticDataParameters: MLSyntheticDataParameters }),
);
export class AnalysisTemplate extends S.Class<AnalysisTemplate>(
  "AnalysisTemplate",
)({
  id: S.String,
  arn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  description: S.optional(S.String),
  name: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  schema: AnalysisSchema,
  format: S.String,
  source: AnalysisSource,
  sourceMetadata: S.optional(AnalysisSourceMetadata),
  analysisParameters: S.optional(AnalysisParameterList),
  validations: S.optional(AnalysisTemplateValidationStatusDetailList),
  errorMessageConfiguration: S.optional(ErrorMessageConfiguration),
  syntheticDataParameters: S.optional(SyntheticDataParameters),
}) {}
export class UpdateAnalysisTemplateOutput extends S.Class<UpdateAnalysisTemplateOutput>(
  "UpdateAnalysisTemplateOutput",
)({ analysisTemplate: AnalysisTemplate }) {}
export class Collaboration extends S.Class<Collaboration>("Collaboration")({
  id: S.String,
  arn: S.String,
  name: S.String,
  description: S.optional(S.String),
  creatorAccountId: S.String,
  creatorDisplayName: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  memberStatus: S.String,
  membershipId: S.optional(S.String),
  membershipArn: S.optional(S.String),
  dataEncryptionMetadata: S.optional(DataEncryptionMetadata),
  queryLogStatus: S.String,
  jobLogStatus: S.optional(S.String),
  analyticsEngine: S.optional(S.String),
  autoApprovedChangeTypes: S.optional(AutoApprovedChangeTypeList),
  allowedResultRegions: S.optional(AllowedResultRegions),
}) {}
export class UpdateCollaborationOutput extends S.Class<UpdateCollaborationOutput>(
  "UpdateCollaborationOutput",
)({ collaboration: Collaboration }) {}
export class BatchGetSchemaAnalysisRuleInput extends S.Class<BatchGetSchemaAnalysisRuleInput>(
  "BatchGetSchemaAnalysisRuleInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    schemaAnalysisRuleRequests: SchemaAnalysisRuleRequestList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/collaborations/{collaborationIdentifier}/batch-schema-analysis-rule",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CollaborationAnalysisTemplate extends S.Class<CollaborationAnalysisTemplate>(
  "CollaborationAnalysisTemplate",
)({
  id: S.String,
  arn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  description: S.optional(S.String),
  creatorAccountId: S.String,
  name: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  schema: AnalysisSchema,
  format: S.String,
  source: S.optional(AnalysisSource),
  sourceMetadata: S.optional(AnalysisSourceMetadata),
  analysisParameters: S.optional(AnalysisParameterList),
  validations: S.optional(AnalysisTemplateValidationStatusDetailList),
  errorMessageConfiguration: S.optional(ErrorMessageConfiguration),
  syntheticDataParameters: S.optional(SyntheticDataParameters),
}) {}
export class GetCollaborationAnalysisTemplateOutput extends S.Class<GetCollaborationAnalysisTemplateOutput>(
  "GetCollaborationAnalysisTemplateOutput",
)({ collaborationAnalysisTemplate: CollaborationAnalysisTemplate }) {}
export class Column extends S.Class<Column>("Column")({
  name: S.String,
  type: S.String,
}) {}
export const ColumnList = S.Array(Column);
export const AnalysisRuleTypeList = S.Array(S.String);
export class SchemaStatusReason extends S.Class<SchemaStatusReason>(
  "SchemaStatusReason",
)({ code: S.String, message: S.String }) {}
export const SchemaStatusReasonList = S.Array(SchemaStatusReason);
export const SchemaConfigurationList = S.Array(S.String);
export class SchemaStatusDetail extends S.Class<SchemaStatusDetail>(
  "SchemaStatusDetail",
)({
  status: S.String,
  reasons: S.optional(SchemaStatusReasonList),
  analysisRuleType: S.optional(S.String),
  configurations: S.optional(SchemaConfigurationList),
  analysisType: S.String,
}) {}
export const SchemaStatusDetailList = S.Array(SchemaStatusDetail);
export class IdMappingTableInputSource extends S.Class<IdMappingTableInputSource>(
  "IdMappingTableInputSource",
)({ idNamespaceAssociationId: S.String, type: S.String }) {}
export const IdMappingTableInputSourceList = S.Array(IdMappingTableInputSource);
export class IdMappingTableSchemaTypeProperties extends S.Class<IdMappingTableSchemaTypeProperties>(
  "IdMappingTableSchemaTypeProperties",
)({ idMappingTableInputSource: IdMappingTableInputSourceList }) {}
export const SchemaTypeProperties = S.Union(
  S.Struct({ idMappingTable: IdMappingTableSchemaTypeProperties }),
);
export class Schema extends S.Class<Schema>("Schema")({
  columns: ColumnList,
  partitionKeys: ColumnList,
  analysisRuleTypes: AnalysisRuleTypeList,
  analysisMethod: S.optional(S.String),
  selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
  creatorAccountId: S.String,
  name: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  description: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  type: S.String,
  schemaStatusDetails: SchemaStatusDetailList,
  resourceArn: S.optional(S.String),
  schemaTypeProperties: S.optional(SchemaTypeProperties),
}) {}
export class GetSchemaOutput extends S.Class<GetSchemaOutput>(
  "GetSchemaOutput",
)({ schema: Schema }) {}
export class MemberChangeSpecification extends S.Class<MemberChangeSpecification>(
  "MemberChangeSpecification",
)({
  accountId: S.String,
  memberAbilities: MemberAbilities,
  displayName: S.optional(S.String),
}) {}
export class CollaborationChangeSpecification extends S.Class<CollaborationChangeSpecification>(
  "CollaborationChangeSpecification",
)({ autoApprovedChangeTypes: S.optional(AutoApprovedChangeTypeList) }) {}
export const ChangeSpecification = S.Union(
  S.Struct({ member: MemberChangeSpecification }),
  S.Struct({ collaboration: CollaborationChangeSpecification }),
);
export const ChangeTypeList = S.Array(S.String);
export class Change extends S.Class<Change>("Change")({
  specificationType: S.String,
  specification: ChangeSpecification,
  types: ChangeTypeList,
}) {}
export const ChangeList = S.Array(Change);
export class ApprovalStatusDetails extends S.Class<ApprovalStatusDetails>(
  "ApprovalStatusDetails",
)({ status: S.String }) {}
export const ApprovalStatuses = S.Record({
  key: S.String,
  value: ApprovalStatusDetails,
});
export class CollaborationChangeRequest extends S.Class<CollaborationChangeRequest>(
  "CollaborationChangeRequest",
)({
  id: S.String,
  collaborationId: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  isAutoApproved: S.Boolean,
  changes: ChangeList,
  approvals: S.optional(ApprovalStatuses),
}) {}
export class UpdateCollaborationChangeRequestOutput extends S.Class<UpdateCollaborationChangeRequestOutput>(
  "UpdateCollaborationChangeRequestOutput",
)({ collaborationChangeRequest: CollaborationChangeRequest }) {}
export class ConfiguredAudienceModelAssociation extends S.Class<ConfiguredAudienceModelAssociation>(
  "ConfiguredAudienceModelAssociation",
)({
  id: S.String,
  arn: S.String,
  configuredAudienceModelArn: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  name: S.String,
  manageResourcePolicies: S.Boolean,
  description: S.optional(S.String),
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class GetConfiguredAudienceModelAssociationOutput extends S.Class<GetConfiguredAudienceModelAssociationOutput>(
  "GetConfiguredAudienceModelAssociationOutput",
)({ configuredAudienceModelAssociation: ConfiguredAudienceModelAssociation }) {}
export class UpdateConfiguredAudienceModelAssociationOutput extends S.Class<UpdateConfiguredAudienceModelAssociationOutput>(
  "UpdateConfiguredAudienceModelAssociationOutput",
)({ configuredAudienceModelAssociation: ConfiguredAudienceModelAssociation }) {}
export const ConfiguredTableAssociationAnalysisRuleTypeList = S.Array(S.String);
export class ConfiguredTableAssociation extends S.Class<ConfiguredTableAssociation>(
  "ConfiguredTableAssociation",
)({
  arn: S.String,
  id: S.String,
  configuredTableId: S.String,
  configuredTableArn: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  roleArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  analysisRuleTypes: S.optional(ConfiguredTableAssociationAnalysisRuleTypeList),
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class GetConfiguredTableAssociationOutput extends S.Class<GetConfiguredTableAssociationOutput>(
  "GetConfiguredTableAssociationOutput",
)({ configuredTableAssociation: ConfiguredTableAssociation }) {}
export class UpdateConfiguredTableAssociationOutput extends S.Class<UpdateConfiguredTableAssociationOutput>(
  "UpdateConfiguredTableAssociationOutput",
)({ configuredTableAssociation: ConfiguredTableAssociation }) {}
export class ConfiguredTableAssociationAnalysisRule extends S.Class<ConfiguredTableAssociationAnalysisRule>(
  "ConfiguredTableAssociationAnalysisRule",
)({
  membershipIdentifier: S.String,
  configuredTableAssociationId: S.String,
  configuredTableAssociationArn: S.String,
  policy: ConfiguredTableAssociationAnalysisRulePolicy,
  type: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateConfiguredTableAssociationAnalysisRuleOutput extends S.Class<UpdateConfiguredTableAssociationAnalysisRuleOutput>(
  "UpdateConfiguredTableAssociationAnalysisRuleOutput",
)({ analysisRule: ConfiguredTableAssociationAnalysisRule }) {}
export const ConfiguredTableAnalysisRuleTypeList = S.Array(S.String);
export class ConfiguredTable extends S.Class<ConfiguredTable>(
  "ConfiguredTable",
)({
  id: S.String,
  arn: S.String,
  name: S.String,
  description: S.optional(S.String),
  tableReference: TableReference,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  analysisRuleTypes: ConfiguredTableAnalysisRuleTypeList,
  analysisMethod: S.String,
  allowedColumns: AllowedColumnList,
  selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
}) {}
export class UpdateConfiguredTableOutput extends S.Class<UpdateConfiguredTableOutput>(
  "UpdateConfiguredTableOutput",
)({ configuredTable: ConfiguredTable }) {}
export class ConfiguredTableAnalysisRule extends S.Class<ConfiguredTableAnalysisRule>(
  "ConfiguredTableAnalysisRule",
)({
  configuredTableId: S.String,
  configuredTableArn: S.String,
  policy: ConfiguredTableAnalysisRulePolicy,
  type: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateConfiguredTableAnalysisRuleOutput extends S.Class<UpdateConfiguredTableAnalysisRuleOutput>(
  "UpdateConfiguredTableAnalysisRuleOutput",
)({ analysisRule: ConfiguredTableAnalysisRule }) {}
export class CreateIdMappingTableInput extends S.Class<CreateIdMappingTableInput>(
  "CreateIdMappingTableInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    inputReferenceConfig: IdMappingTableInputReferenceConfig,
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/idmappingtables",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IdMappingTableInputReferenceProperties extends S.Class<IdMappingTableInputReferenceProperties>(
  "IdMappingTableInputReferenceProperties",
)({ idMappingTableInputSource: IdMappingTableInputSourceList }) {}
export class IdMappingTable extends S.Class<IdMappingTable>("IdMappingTable")({
  id: S.String,
  arn: S.String,
  inputReferenceConfig: IdMappingTableInputReferenceConfig,
  membershipId: S.String,
  membershipArn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  description: S.optional(S.String),
  name: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  inputReferenceProperties: IdMappingTableInputReferenceProperties,
  kmsKeyArn: S.optional(S.String),
}) {}
export class UpdateIdMappingTableOutput extends S.Class<UpdateIdMappingTableOutput>(
  "UpdateIdMappingTableOutput",
)({ idMappingTable: IdMappingTable }) {}
export class PopulateIdMappingTableOutput extends S.Class<PopulateIdMappingTableOutput>(
  "PopulateIdMappingTableOutput",
)({ idMappingJobId: S.String }) {}
export class CreateIdNamespaceAssociationInput extends S.Class<CreateIdNamespaceAssociationInput>(
  "CreateIdNamespaceAssociationInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
    tags: S.optional(TagMap),
    name: S.String,
    description: S.optional(S.String),
    idMappingConfig: S.optional(IdMappingConfig),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/idnamespaceassociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IdMappingWorkflowsSupported = S.Array(S.Any);
export class IdNamespaceAssociationInputReferenceProperties extends S.Class<IdNamespaceAssociationInputReferenceProperties>(
  "IdNamespaceAssociationInputReferenceProperties",
)({
  idNamespaceType: S.String,
  idMappingWorkflowsSupported: IdMappingWorkflowsSupported,
}) {}
export class IdNamespaceAssociation extends S.Class<IdNamespaceAssociation>(
  "IdNamespaceAssociation",
)({
  id: S.String,
  arn: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
  inputReferenceProperties: IdNamespaceAssociationInputReferenceProperties,
  idMappingConfig: S.optional(IdMappingConfig),
}) {}
export class UpdateIdNamespaceAssociationOutput extends S.Class<UpdateIdNamespaceAssociationOutput>(
  "UpdateIdNamespaceAssociationOutput",
)({ idNamespaceAssociation: IdNamespaceAssociation }) {}
export class MembershipQueryComputePaymentConfig extends S.Class<MembershipQueryComputePaymentConfig>(
  "MembershipQueryComputePaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class MembershipModelTrainingPaymentConfig extends S.Class<MembershipModelTrainingPaymentConfig>(
  "MembershipModelTrainingPaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class MembershipModelInferencePaymentConfig extends S.Class<MembershipModelInferencePaymentConfig>(
  "MembershipModelInferencePaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class MembershipSyntheticDataGenerationPaymentConfig extends S.Class<MembershipSyntheticDataGenerationPaymentConfig>(
  "MembershipSyntheticDataGenerationPaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class MembershipMLPaymentConfig extends S.Class<MembershipMLPaymentConfig>(
  "MembershipMLPaymentConfig",
)({
  modelTraining: S.optional(MembershipModelTrainingPaymentConfig),
  modelInference: S.optional(MembershipModelInferencePaymentConfig),
  syntheticDataGeneration: S.optional(
    MembershipSyntheticDataGenerationPaymentConfig,
  ),
}) {}
export class MembershipJobComputePaymentConfig extends S.Class<MembershipJobComputePaymentConfig>(
  "MembershipJobComputePaymentConfig",
)({ isResponsible: S.Boolean }) {}
export class MembershipPaymentConfiguration extends S.Class<MembershipPaymentConfiguration>(
  "MembershipPaymentConfiguration",
)({
  queryCompute: MembershipQueryComputePaymentConfig,
  machineLearning: S.optional(MembershipMLPaymentConfig),
  jobCompute: S.optional(MembershipJobComputePaymentConfig),
}) {}
export class Membership extends S.Class<Membership>("Membership")({
  id: S.String,
  arn: S.String,
  collaborationArn: S.String,
  collaborationId: S.String,
  collaborationCreatorAccountId: S.String,
  collaborationCreatorDisplayName: S.String,
  collaborationName: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  memberAbilities: MemberAbilities,
  mlMemberAbilities: S.optional(MLMemberAbilities),
  queryLogStatus: S.String,
  jobLogStatus: S.optional(S.String),
  defaultResultConfiguration: S.optional(
    MembershipProtectedQueryResultConfiguration,
  ),
  defaultJobResultConfiguration: S.optional(
    MembershipProtectedJobResultConfiguration,
  ),
  paymentConfiguration: MembershipPaymentConfiguration,
}) {}
export class UpdateMembershipOutput extends S.Class<UpdateMembershipOutput>(
  "UpdateMembershipOutput",
)({ membership: Membership }) {}
export class ProtectedJobS3OutputConfigurationOutput extends S.Class<ProtectedJobS3OutputConfigurationOutput>(
  "ProtectedJobS3OutputConfigurationOutput",
)({ bucket: S.String, keyPrefix: S.optional(S.String) }) {}
export class ProtectedJobMemberOutputConfigurationOutput extends S.Class<ProtectedJobMemberOutputConfigurationOutput>(
  "ProtectedJobMemberOutputConfigurationOutput",
)({ accountId: S.String }) {}
export const ProtectedJobOutputConfigurationOutput = S.Union(
  S.Struct({ s3: ProtectedJobS3OutputConfigurationOutput }),
  S.Struct({ member: ProtectedJobMemberOutputConfigurationOutput }),
);
export class ProtectedJobResultConfigurationOutput extends S.Class<ProtectedJobResultConfigurationOutput>(
  "ProtectedJobResultConfigurationOutput",
)({ outputConfiguration: ProtectedJobOutputConfigurationOutput }) {}
export class BilledJobResourceUtilization extends S.Class<BilledJobResourceUtilization>(
  "BilledJobResourceUtilization",
)({ units: S.Number }) {}
export class ProtectedJobStatistics extends S.Class<ProtectedJobStatistics>(
  "ProtectedJobStatistics",
)({
  totalDurationInMillis: S.optional(S.Number),
  billedResourceUtilization: S.optional(BilledJobResourceUtilization),
}) {}
export class ProtectedJobS3Output extends S.Class<ProtectedJobS3Output>(
  "ProtectedJobS3Output",
)({ location: S.String }) {}
export class ProtectedJobSingleMemberOutput extends S.Class<ProtectedJobSingleMemberOutput>(
  "ProtectedJobSingleMemberOutput",
)({ accountId: S.String }) {}
export const ProtectedJobMemberOutputList = S.Array(
  ProtectedJobSingleMemberOutput,
);
export const ProtectedJobOutput = S.Union(
  S.Struct({ s3: ProtectedJobS3Output }),
  S.Struct({ memberList: ProtectedJobMemberOutputList }),
);
export class ProtectedJobResult extends S.Class<ProtectedJobResult>(
  "ProtectedJobResult",
)({ output: ProtectedJobOutput }) {}
export class ProtectedJobError extends S.Class<ProtectedJobError>(
  "ProtectedJobError",
)({ message: S.String, code: S.String }) {}
export class ProtectedJobWorkerComputeConfiguration extends S.Class<ProtectedJobWorkerComputeConfiguration>(
  "ProtectedJobWorkerComputeConfiguration",
)({ type: S.String, number: S.Number }) {}
export const ProtectedJobComputeConfiguration = S.Union(
  S.Struct({ worker: ProtectedJobWorkerComputeConfiguration }),
);
export class ProtectedJob extends S.Class<ProtectedJob>("ProtectedJob")({
  id: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  jobParameters: S.optional(ProtectedJobParameters),
  status: S.String,
  resultConfiguration: S.optional(ProtectedJobResultConfigurationOutput),
  statistics: S.optional(ProtectedJobStatistics),
  result: S.optional(ProtectedJobResult),
  error: S.optional(ProtectedJobError),
  computeConfiguration: S.optional(ProtectedJobComputeConfiguration),
}) {}
export class UpdateProtectedJobOutput extends S.Class<UpdateProtectedJobOutput>(
  "UpdateProtectedJobOutput",
)({ protectedJob: ProtectedJob }) {}
export const ParameterMap = S.Record({ key: S.String, value: S.String });
export class ProtectedQuerySQLParameters extends S.Class<ProtectedQuerySQLParameters>(
  "ProtectedQuerySQLParameters",
)({
  queryString: S.optional(S.String),
  analysisTemplateArn: S.optional(S.String),
  parameters: S.optional(ParameterMap),
}) {}
export class ProtectedQueryMemberOutputConfiguration extends S.Class<ProtectedQueryMemberOutputConfiguration>(
  "ProtectedQueryMemberOutputConfiguration",
)({ accountId: S.String }) {}
export const ProtectedQueryDistributeOutputConfigurationLocation = S.Union(
  S.Struct({ s3: ProtectedQueryS3OutputConfiguration }),
  S.Struct({ member: ProtectedQueryMemberOutputConfiguration }),
);
export const ProtectedQueryDistributeOutputConfigurationLocations = S.Array(
  ProtectedQueryDistributeOutputConfigurationLocation,
);
export class ProtectedQueryDistributeOutputConfiguration extends S.Class<ProtectedQueryDistributeOutputConfiguration>(
  "ProtectedQueryDistributeOutputConfiguration",
)({ locations: ProtectedQueryDistributeOutputConfigurationLocations }) {}
export const ProtectedQueryOutputConfiguration = S.Union(
  S.Struct({ s3: ProtectedQueryS3OutputConfiguration }),
  S.Struct({ member: ProtectedQueryMemberOutputConfiguration }),
  S.Struct({ distribute: ProtectedQueryDistributeOutputConfiguration }),
);
export class ProtectedQueryResultConfiguration extends S.Class<ProtectedQueryResultConfiguration>(
  "ProtectedQueryResultConfiguration",
)({ outputConfiguration: ProtectedQueryOutputConfiguration }) {}
export class BilledResourceUtilization extends S.Class<BilledResourceUtilization>(
  "BilledResourceUtilization",
)({ units: S.Number }) {}
export class ProtectedQueryStatistics extends S.Class<ProtectedQueryStatistics>(
  "ProtectedQueryStatistics",
)({
  totalDurationInMillis: S.optional(S.Number),
  billedResourceUtilization: S.optional(BilledResourceUtilization),
}) {}
export class ProtectedQueryS3Output extends S.Class<ProtectedQueryS3Output>(
  "ProtectedQueryS3Output",
)({ location: S.String }) {}
export class ProtectedQuerySingleMemberOutput extends S.Class<ProtectedQuerySingleMemberOutput>(
  "ProtectedQuerySingleMemberOutput",
)({ accountId: S.String }) {}
export const ProtectedQueryMemberOutputList = S.Array(
  ProtectedQuerySingleMemberOutput,
);
export class ProtectedQueryDistributeOutput extends S.Class<ProtectedQueryDistributeOutput>(
  "ProtectedQueryDistributeOutput",
)({
  s3: S.optional(ProtectedQueryS3Output),
  memberList: S.optional(ProtectedQueryMemberOutputList),
}) {}
export const ProtectedQueryOutput = S.Union(
  S.Struct({ s3: ProtectedQueryS3Output }),
  S.Struct({ memberList: ProtectedQueryMemberOutputList }),
  S.Struct({ distribute: ProtectedQueryDistributeOutput }),
);
export class ProtectedQueryResult extends S.Class<ProtectedQueryResult>(
  "ProtectedQueryResult",
)({ output: ProtectedQueryOutput }) {}
export class ProtectedQueryError extends S.Class<ProtectedQueryError>(
  "ProtectedQueryError",
)({ message: S.String, code: S.String }) {}
export class DifferentialPrivacySensitivityParameters extends S.Class<DifferentialPrivacySensitivityParameters>(
  "DifferentialPrivacySensitivityParameters",
)({
  aggregationType: S.String,
  aggregationExpression: S.String,
  userContributionLimit: S.Number,
  minColumnValue: S.optional(S.Number),
  maxColumnValue: S.optional(S.Number),
}) {}
export const DifferentialPrivacySensitivityParametersList = S.Array(
  DifferentialPrivacySensitivityParameters,
);
export class DifferentialPrivacyParameters extends S.Class<DifferentialPrivacyParameters>(
  "DifferentialPrivacyParameters",
)({ sensitivityParameters: DifferentialPrivacySensitivityParametersList }) {}
export const SparkProperties = S.Record({ key: S.String, value: S.String });
export const WorkerComputeConfigurationProperties = S.Union(
  S.Struct({ spark: SparkProperties }),
);
export class WorkerComputeConfiguration extends S.Class<WorkerComputeConfiguration>(
  "WorkerComputeConfiguration",
)({
  type: S.optional(S.String),
  number: S.optional(S.Number),
  properties: S.optional(WorkerComputeConfigurationProperties),
}) {}
export const ComputeConfiguration = S.Union(
  S.Struct({ worker: WorkerComputeConfiguration }),
);
export class ProtectedQuery extends S.Class<ProtectedQuery>("ProtectedQuery")({
  id: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  sqlParameters: S.optional(ProtectedQuerySQLParameters),
  status: S.String,
  resultConfiguration: S.optional(ProtectedQueryResultConfiguration),
  statistics: S.optional(ProtectedQueryStatistics),
  result: S.optional(ProtectedQueryResult),
  error: S.optional(ProtectedQueryError),
  differentialPrivacy: S.optional(DifferentialPrivacyParameters),
  computeConfiguration: S.optional(ComputeConfiguration),
}) {}
export class UpdateProtectedQueryOutput extends S.Class<UpdateProtectedQueryOutput>(
  "UpdateProtectedQueryOutput",
)({ protectedQuery: ProtectedQuery }) {}
export class DifferentialPrivacyPreviewParametersInput extends S.Class<DifferentialPrivacyPreviewParametersInput>(
  "DifferentialPrivacyPreviewParametersInput",
)({ epsilon: S.Number, usersNoisePerQuery: S.Number }) {}
export class DifferentialPrivacyTemplateParametersInput extends S.Class<DifferentialPrivacyTemplateParametersInput>(
  "DifferentialPrivacyTemplateParametersInput",
)({ epsilon: S.Number, usersNoisePerQuery: S.Number }) {}
export class DifferentialPrivacyTemplateUpdateParameters extends S.Class<DifferentialPrivacyTemplateUpdateParameters>(
  "DifferentialPrivacyTemplateUpdateParameters",
)({
  epsilon: S.optional(S.Number),
  usersNoisePerQuery: S.optional(S.Number),
}) {}
export class BudgetParameter extends S.Class<BudgetParameter>(
  "BudgetParameter",
)({ type: S.String, budget: S.Number, autoRefresh: S.optional(S.String) }) {}
export const BudgetParameters = S.Array(BudgetParameter);
export class AccessBudgetsPrivacyTemplateUpdateParameters extends S.Class<AccessBudgetsPrivacyTemplateUpdateParameters>(
  "AccessBudgetsPrivacyTemplateUpdateParameters",
)({ budgetParameters: BudgetParameters }) {}
export class AnalysisTemplateSummary extends S.Class<AnalysisTemplateSummary>(
  "AnalysisTemplateSummary",
)({
  arn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  id: S.String,
  name: S.String,
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  membershipArn: S.String,
  membershipId: S.String,
  collaborationArn: S.String,
  collaborationId: S.String,
  description: S.optional(S.String),
  isSyntheticData: S.optional(S.Boolean),
}) {}
export const AnalysisTemplateSummaryList = S.Array(AnalysisTemplateSummary);
export class CollaborationSummary extends S.Class<CollaborationSummary>(
  "CollaborationSummary",
)({
  id: S.String,
  arn: S.String,
  name: S.String,
  creatorAccountId: S.String,
  creatorDisplayName: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  memberStatus: S.String,
  membershipId: S.optional(S.String),
  membershipArn: S.optional(S.String),
  analyticsEngine: S.optional(S.String),
}) {}
export const CollaborationSummaryList = S.Array(CollaborationSummary);
export const CollaborationAnalysisTemplateList = S.Array(
  CollaborationAnalysisTemplate,
);
export class BatchGetCollaborationAnalysisTemplateError extends S.Class<BatchGetCollaborationAnalysisTemplateError>(
  "BatchGetCollaborationAnalysisTemplateError",
)({ arn: S.String, code: S.String, message: S.String }) {}
export const BatchGetCollaborationAnalysisTemplateErrorList = S.Array(
  BatchGetCollaborationAnalysisTemplateError,
);
export class BatchGetSchemaError extends S.Class<BatchGetSchemaError>(
  "BatchGetSchemaError",
)({ name: S.String, code: S.String, message: S.String }) {}
export const BatchGetSchemaErrorList = S.Array(BatchGetSchemaError);
export class QueryConstraintRequireOverlap extends S.Class<QueryConstraintRequireOverlap>(
  "QueryConstraintRequireOverlap",
)({ columns: S.optional(AnalysisRuleColumnList) }) {}
export const QueryConstraint = S.Union(
  S.Struct({ requireOverlap: QueryConstraintRequireOverlap }),
);
export const QueryConstraintList = S.Array(QueryConstraint);
export class AnalysisRuleIdMappingTable extends S.Class<AnalysisRuleIdMappingTable>(
  "AnalysisRuleIdMappingTable",
)({
  joinColumns: AnalysisRuleColumnList,
  queryConstraints: QueryConstraintList,
  dimensionColumns: S.optional(AnalysisRuleColumnList),
}) {}
export const AnalysisRulePolicyV1 = S.Union(
  S.Struct({ list: AnalysisRuleList }),
  S.Struct({ aggregation: AnalysisRuleAggregation }),
  S.Struct({ custom: AnalysisRuleCustom }),
  S.Struct({ idMappingTable: AnalysisRuleIdMappingTable }),
);
export const AnalysisRulePolicy = S.Union(
  S.Struct({ v1: AnalysisRulePolicyV1 }),
);
export class ConsolidatedPolicyList extends S.Class<ConsolidatedPolicyList>(
  "ConsolidatedPolicyList",
)({
  joinColumns: AnalysisRuleColumnList,
  allowedJoinOperators: S.optional(JoinOperatorsList),
  listColumns: AnalysisRuleColumnList,
  additionalAnalyses: S.optional(S.String),
  allowedResultReceivers: S.optional(AllowedResultReceivers),
  allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
}) {}
export class ConsolidatedPolicyAggregation extends S.Class<ConsolidatedPolicyAggregation>(
  "ConsolidatedPolicyAggregation",
)({
  aggregateColumns: AggregateColumnList,
  joinColumns: AnalysisRuleColumnList,
  joinRequired: S.optional(S.String),
  allowedJoinOperators: S.optional(JoinOperatorsList),
  dimensionColumns: AnalysisRuleColumnList,
  scalarFunctions: ScalarFunctionsList,
  outputConstraints: AggregationConstraints,
  additionalAnalyses: S.optional(S.String),
  allowedResultReceivers: S.optional(AllowedResultReceivers),
  allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
}) {}
export class ConsolidatedPolicyCustom extends S.Class<ConsolidatedPolicyCustom>(
  "ConsolidatedPolicyCustom",
)({
  allowedAnalyses: AllowedAnalysesList,
  allowedAnalysisProviders: S.optional(AllowedAnalysisProviderList),
  additionalAnalyses: S.optional(S.String),
  disallowedOutputColumns: S.optional(AnalysisRuleColumnList),
  differentialPrivacy: S.optional(DifferentialPrivacyConfiguration),
  allowedResultReceivers: S.optional(AllowedResultReceivers),
  allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
}) {}
export const ConsolidatedPolicyV1 = S.Union(
  S.Struct({ list: ConsolidatedPolicyList }),
  S.Struct({ aggregation: ConsolidatedPolicyAggregation }),
  S.Struct({ custom: ConsolidatedPolicyCustom }),
);
export const ConsolidatedPolicy = S.Union(
  S.Struct({ v1: ConsolidatedPolicyV1 }),
);
export class AnalysisRule extends S.Class<AnalysisRule>("AnalysisRule")({
  collaborationId: S.String,
  type: S.String,
  name: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  policy: AnalysisRulePolicy,
  collaborationPolicy: S.optional(ConfiguredTableAssociationAnalysisRulePolicy),
  consolidatedPolicy: S.optional(ConsolidatedPolicy),
}) {}
export const SchemaAnalysisRuleList = S.Array(AnalysisRule);
export class CollaborationConfiguredAudienceModelAssociation extends S.Class<CollaborationConfiguredAudienceModelAssociation>(
  "CollaborationConfiguredAudienceModelAssociation",
)({
  id: S.String,
  arn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  configuredAudienceModelArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  creatorAccountId: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class CollaborationAnalysisTemplateSummary extends S.Class<CollaborationAnalysisTemplateSummary>(
  "CollaborationAnalysisTemplateSummary",
)({
  arn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  id: S.String,
  name: S.String,
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  collaborationArn: S.String,
  collaborationId: S.String,
  creatorAccountId: S.String,
  description: S.optional(S.String),
  isSyntheticData: S.optional(S.Boolean),
}) {}
export const CollaborationAnalysisTemplateSummaryList = S.Array(
  CollaborationAnalysisTemplateSummary,
);
export class CollaborationChangeRequestSummary extends S.Class<CollaborationChangeRequestSummary>(
  "CollaborationChangeRequestSummary",
)({
  id: S.String,
  collaborationId: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  isAutoApproved: S.Boolean,
  changes: ChangeList,
  approvals: S.optional(ApprovalStatuses),
}) {}
export const CollaborationChangeRequestSummaryList = S.Array(
  CollaborationChangeRequestSummary,
);
export class CollaborationConfiguredAudienceModelAssociationSummary extends S.Class<CollaborationConfiguredAudienceModelAssociationSummary>(
  "CollaborationConfiguredAudienceModelAssociationSummary",
)({
  arn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  id: S.String,
  name: S.String,
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  collaborationArn: S.String,
  collaborationId: S.String,
  creatorAccountId: S.String,
  description: S.optional(S.String),
}) {}
export const CollaborationConfiguredAudienceModelAssociationSummaryList =
  S.Array(CollaborationConfiguredAudienceModelAssociationSummary);
export class CollaborationPrivacyBudgetTemplateSummary extends S.Class<CollaborationPrivacyBudgetTemplateSummary>(
  "CollaborationPrivacyBudgetTemplateSummary",
)({
  id: S.String,
  arn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  creatorAccountId: S.String,
  privacyBudgetType: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const CollaborationPrivacyBudgetTemplateSummaryList = S.Array(
  CollaborationPrivacyBudgetTemplateSummary,
);
export class MemberSummary extends S.Class<MemberSummary>("MemberSummary")({
  accountId: S.String,
  status: S.String,
  displayName: S.String,
  abilities: MemberAbilities,
  mlAbilities: S.optional(MLMemberAbilities),
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  membershipId: S.optional(S.String),
  membershipArn: S.optional(S.String),
  paymentConfiguration: PaymentConfiguration,
}) {}
export const MemberSummaryList = S.Array(MemberSummary);
export class SchemaSummary extends S.Class<SchemaSummary>("SchemaSummary")({
  name: S.String,
  type: S.String,
  creatorAccountId: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  collaborationId: S.String,
  collaborationArn: S.String,
  analysisRuleTypes: AnalysisRuleTypeList,
  analysisMethod: S.optional(S.String),
  resourceArn: S.optional(S.String),
  selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
}) {}
export const SchemaSummaryList = S.Array(SchemaSummary);
export class ConfiguredAudienceModelAssociationSummary extends S.Class<ConfiguredAudienceModelAssociationSummary>(
  "ConfiguredAudienceModelAssociationSummary",
)({
  membershipId: S.String,
  membershipArn: S.String,
  collaborationArn: S.String,
  collaborationId: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  id: S.String,
  arn: S.String,
  name: S.String,
  configuredAudienceModelArn: S.String,
  description: S.optional(S.String),
}) {}
export const ConfiguredAudienceModelAssociationSummaryList = S.Array(
  ConfiguredAudienceModelAssociationSummary,
);
export class ConfiguredTableAssociationSummary extends S.Class<ConfiguredTableAssociationSummary>(
  "ConfiguredTableAssociationSummary",
)({
  configuredTableId: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  name: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  id: S.String,
  arn: S.String,
  analysisRuleTypes: S.optional(ConfiguredTableAssociationAnalysisRuleTypeList),
}) {}
export const ConfiguredTableAssociationSummaryList = S.Array(
  ConfiguredTableAssociationSummary,
);
export class ConfiguredTableSummary extends S.Class<ConfiguredTableSummary>(
  "ConfiguredTableSummary",
)({
  id: S.String,
  arn: S.String,
  name: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  analysisRuleTypes: ConfiguredTableAnalysisRuleTypeList,
  analysisMethod: S.String,
  selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
}) {}
export const ConfiguredTableSummaryList = S.Array(ConfiguredTableSummary);
export class IdMappingTableSummary extends S.Class<IdMappingTableSummary>(
  "IdMappingTableSummary",
)({
  collaborationArn: S.String,
  collaborationId: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  id: S.String,
  arn: S.String,
  description: S.optional(S.String),
  inputReferenceConfig: IdMappingTableInputReferenceConfig,
  name: S.String,
}) {}
export const IdMappingTableSummaryList = S.Array(IdMappingTableSummary);
export class IdNamespaceAssociationInputReferencePropertiesSummary extends S.Class<IdNamespaceAssociationInputReferencePropertiesSummary>(
  "IdNamespaceAssociationInputReferencePropertiesSummary",
)({ idNamespaceType: S.String }) {}
export class IdNamespaceAssociationSummary extends S.Class<IdNamespaceAssociationSummary>(
  "IdNamespaceAssociationSummary",
)({
  membershipId: S.String,
  membershipArn: S.String,
  collaborationArn: S.String,
  collaborationId: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  id: S.String,
  arn: S.String,
  inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
  name: S.String,
  description: S.optional(S.String),
  inputReferenceProperties:
    IdNamespaceAssociationInputReferencePropertiesSummary,
}) {}
export const IdNamespaceAssociationSummaryList = S.Array(
  IdNamespaceAssociationSummary,
);
export class MembershipSummary extends S.Class<MembershipSummary>(
  "MembershipSummary",
)({
  id: S.String,
  arn: S.String,
  collaborationArn: S.String,
  collaborationId: S.String,
  collaborationCreatorAccountId: S.String,
  collaborationCreatorDisplayName: S.String,
  collaborationName: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  memberAbilities: MemberAbilities,
  mlMemberAbilities: S.optional(MLMemberAbilities),
  paymentConfiguration: MembershipPaymentConfiguration,
}) {}
export const MembershipSummaryList = S.Array(MembershipSummary);
export class DifferentialPrivacyPrivacyBudgetAggregation extends S.Class<DifferentialPrivacyPrivacyBudgetAggregation>(
  "DifferentialPrivacyPrivacyBudgetAggregation",
)({ type: S.String, maxCount: S.Number, remainingCount: S.Number }) {}
export const DifferentialPrivacyPrivacyBudgetAggregationList = S.Array(
  DifferentialPrivacyPrivacyBudgetAggregation,
);
export class DifferentialPrivacyPrivacyBudget extends S.Class<DifferentialPrivacyPrivacyBudget>(
  "DifferentialPrivacyPrivacyBudget",
)({
  aggregations: DifferentialPrivacyPrivacyBudgetAggregationList,
  epsilon: S.Number,
}) {}
export class AccessBudgetDetails extends S.Class<AccessBudgetDetails>(
  "AccessBudgetDetails",
)({
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  remainingBudget: S.Number,
  budget: S.Number,
  budgetType: S.String,
  autoRefresh: S.optional(S.String),
}) {}
export const AccessBudgetDetailsList = S.Array(AccessBudgetDetails);
export class AccessBudget extends S.Class<AccessBudget>("AccessBudget")({
  resourceArn: S.String,
  details: AccessBudgetDetailsList,
  aggregateRemainingBudget: S.Number,
}) {}
export const PrivacyBudget = S.Union(
  S.Struct({ differentialPrivacy: DifferentialPrivacyPrivacyBudget }),
  S.Struct({ accessBudget: AccessBudget }),
);
export class PrivacyBudgetSummary extends S.Class<PrivacyBudgetSummary>(
  "PrivacyBudgetSummary",
)({
  id: S.String,
  privacyBudgetTemplateId: S.String,
  privacyBudgetTemplateArn: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  type: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  budget: PrivacyBudget,
}) {}
export const PrivacyBudgetSummaryList = S.Array(PrivacyBudgetSummary);
export const PreviewPrivacyImpactParametersInput = S.Union(
  S.Struct({ differentialPrivacy: DifferentialPrivacyPreviewParametersInput }),
);
export class DifferentialPrivacyTemplateParametersOutput extends S.Class<DifferentialPrivacyTemplateParametersOutput>(
  "DifferentialPrivacyTemplateParametersOutput",
)({ epsilon: S.Number, usersNoisePerQuery: S.Number }) {}
export class AccessBudgetsPrivacyTemplateParametersOutput extends S.Class<AccessBudgetsPrivacyTemplateParametersOutput>(
  "AccessBudgetsPrivacyTemplateParametersOutput",
)({ budgetParameters: BudgetParameters, resourceArn: S.String }) {}
export const PrivacyBudgetTemplateParametersOutput = S.Union(
  S.Struct({
    differentialPrivacy: DifferentialPrivacyTemplateParametersOutput,
  }),
  S.Struct({ accessBudget: AccessBudgetsPrivacyTemplateParametersOutput }),
);
export class PrivacyBudgetTemplate extends S.Class<PrivacyBudgetTemplate>(
  "PrivacyBudgetTemplate",
)({
  id: S.String,
  arn: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  privacyBudgetType: S.String,
  autoRefresh: S.String,
  parameters: PrivacyBudgetTemplateParametersOutput,
}) {}
export const PrivacyBudgetTemplateUpdateParameters = S.Union(
  S.Struct({
    differentialPrivacy: DifferentialPrivacyTemplateUpdateParameters,
  }),
  S.Struct({ accessBudget: AccessBudgetsPrivacyTemplateUpdateParameters }),
);
export class PrivacyBudgetTemplateSummary extends S.Class<PrivacyBudgetTemplateSummary>(
  "PrivacyBudgetTemplateSummary",
)({
  id: S.String,
  arn: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  privacyBudgetType: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const PrivacyBudgetTemplateSummaryList = S.Array(
  PrivacyBudgetTemplateSummary,
);
export class ProtectedJobMemberOutputConfigurationInput extends S.Class<ProtectedJobMemberOutputConfigurationInput>(
  "ProtectedJobMemberOutputConfigurationInput",
)({ accountId: S.String }) {}
export class ListAnalysisTemplatesOutput extends S.Class<ListAnalysisTemplatesOutput>(
  "ListAnalysisTemplatesOutput",
)({
  nextToken: S.optional(S.String),
  analysisTemplateSummaries: AnalysisTemplateSummaryList,
}) {}
export class GetCollaborationOutput extends S.Class<GetCollaborationOutput>(
  "GetCollaborationOutput",
)({ collaboration: Collaboration }) {}
export class ListCollaborationsOutput extends S.Class<ListCollaborationsOutput>(
  "ListCollaborationsOutput",
)({
  nextToken: S.optional(S.String),
  collaborationList: CollaborationSummaryList,
}) {}
export class BatchGetCollaborationAnalysisTemplateOutput extends S.Class<BatchGetCollaborationAnalysisTemplateOutput>(
  "BatchGetCollaborationAnalysisTemplateOutput",
)({
  collaborationAnalysisTemplates: CollaborationAnalysisTemplateList,
  errors: BatchGetCollaborationAnalysisTemplateErrorList,
}) {}
export class GetCollaborationConfiguredAudienceModelAssociationOutput extends S.Class<GetCollaborationConfiguredAudienceModelAssociationOutput>(
  "GetCollaborationConfiguredAudienceModelAssociationOutput",
)({
  collaborationConfiguredAudienceModelAssociation:
    CollaborationConfiguredAudienceModelAssociation,
}) {}
export class ListCollaborationAnalysisTemplatesOutput extends S.Class<ListCollaborationAnalysisTemplatesOutput>(
  "ListCollaborationAnalysisTemplatesOutput",
)({
  nextToken: S.optional(S.String),
  collaborationAnalysisTemplateSummaries:
    CollaborationAnalysisTemplateSummaryList,
}) {}
export class ListCollaborationChangeRequestsOutput extends S.Class<ListCollaborationChangeRequestsOutput>(
  "ListCollaborationChangeRequestsOutput",
)({
  collaborationChangeRequestSummaries: CollaborationChangeRequestSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListCollaborationConfiguredAudienceModelAssociationsOutput extends S.Class<ListCollaborationConfiguredAudienceModelAssociationsOutput>(
  "ListCollaborationConfiguredAudienceModelAssociationsOutput",
)({
  collaborationConfiguredAudienceModelAssociationSummaries:
    CollaborationConfiguredAudienceModelAssociationSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListCollaborationPrivacyBudgetTemplatesOutput extends S.Class<ListCollaborationPrivacyBudgetTemplatesOutput>(
  "ListCollaborationPrivacyBudgetTemplatesOutput",
)({
  nextToken: S.optional(S.String),
  collaborationPrivacyBudgetTemplateSummaries:
    CollaborationPrivacyBudgetTemplateSummaryList,
}) {}
export class ListMembersOutput extends S.Class<ListMembersOutput>(
  "ListMembersOutput",
)({ nextToken: S.optional(S.String), memberSummaries: MemberSummaryList }) {}
export class ListSchemasOutput extends S.Class<ListSchemasOutput>(
  "ListSchemasOutput",
)({ schemaSummaries: SchemaSummaryList, nextToken: S.optional(S.String) }) {}
export class CreateConfiguredAudienceModelAssociationOutput extends S.Class<CreateConfiguredAudienceModelAssociationOutput>(
  "CreateConfiguredAudienceModelAssociationOutput",
)({ configuredAudienceModelAssociation: ConfiguredAudienceModelAssociation }) {}
export class ListConfiguredAudienceModelAssociationsOutput extends S.Class<ListConfiguredAudienceModelAssociationsOutput>(
  "ListConfiguredAudienceModelAssociationsOutput",
)({
  configuredAudienceModelAssociationSummaries:
    ConfiguredAudienceModelAssociationSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateConfiguredTableAssociationOutput extends S.Class<CreateConfiguredTableAssociationOutput>(
  "CreateConfiguredTableAssociationOutput",
)({ configuredTableAssociation: ConfiguredTableAssociation }) {}
export class ListConfiguredTableAssociationsOutput extends S.Class<ListConfiguredTableAssociationsOutput>(
  "ListConfiguredTableAssociationsOutput",
)({
  configuredTableAssociationSummaries: ConfiguredTableAssociationSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class GetConfiguredTableAssociationAnalysisRuleOutput extends S.Class<GetConfiguredTableAssociationAnalysisRuleOutput>(
  "GetConfiguredTableAssociationAnalysisRuleOutput",
)({ analysisRule: ConfiguredTableAssociationAnalysisRule }) {}
export class GetConfiguredTableOutput extends S.Class<GetConfiguredTableOutput>(
  "GetConfiguredTableOutput",
)({ configuredTable: ConfiguredTable }) {}
export class ListConfiguredTablesOutput extends S.Class<ListConfiguredTablesOutput>(
  "ListConfiguredTablesOutput",
)({
  configuredTableSummaries: ConfiguredTableSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class GetConfiguredTableAnalysisRuleOutput extends S.Class<GetConfiguredTableAnalysisRuleOutput>(
  "GetConfiguredTableAnalysisRuleOutput",
)({ analysisRule: ConfiguredTableAnalysisRule }) {}
export class CreateIdMappingTableOutput extends S.Class<CreateIdMappingTableOutput>(
  "CreateIdMappingTableOutput",
)({ idMappingTable: IdMappingTable }) {}
export class ListIdMappingTablesOutput extends S.Class<ListIdMappingTablesOutput>(
  "ListIdMappingTablesOutput",
)({
  idMappingTableSummaries: IdMappingTableSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateIdNamespaceAssociationOutput extends S.Class<CreateIdNamespaceAssociationOutput>(
  "CreateIdNamespaceAssociationOutput",
)({ idNamespaceAssociation: IdNamespaceAssociation }) {}
export class GetIdNamespaceAssociationOutput extends S.Class<GetIdNamespaceAssociationOutput>(
  "GetIdNamespaceAssociationOutput",
)({ idNamespaceAssociation: IdNamespaceAssociation }) {}
export class ListIdNamespaceAssociationsOutput extends S.Class<ListIdNamespaceAssociationsOutput>(
  "ListIdNamespaceAssociationsOutput",
)({
  nextToken: S.optional(S.String),
  idNamespaceAssociationSummaries: IdNamespaceAssociationSummaryList,
}) {}
export class GetMembershipOutput extends S.Class<GetMembershipOutput>(
  "GetMembershipOutput",
)({ membership: Membership }) {}
export class ListMembershipsOutput extends S.Class<ListMembershipsOutput>(
  "ListMembershipsOutput",
)({
  nextToken: S.optional(S.String),
  membershipSummaries: MembershipSummaryList,
}) {}
export class ListPrivacyBudgetsOutput extends S.Class<ListPrivacyBudgetsOutput>(
  "ListPrivacyBudgetsOutput",
)({
  privacyBudgetSummaries: PrivacyBudgetSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class PreviewPrivacyImpactInput extends S.Class<PreviewPrivacyImpactInput>(
  "PreviewPrivacyImpactInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    parameters: PreviewPrivacyImpactParametersInput,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/previewprivacyimpact",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPrivacyBudgetTemplateOutput extends S.Class<GetPrivacyBudgetTemplateOutput>(
  "GetPrivacyBudgetTemplateOutput",
)({ privacyBudgetTemplate: PrivacyBudgetTemplate }) {}
export class UpdatePrivacyBudgetTemplateInput extends S.Class<UpdatePrivacyBudgetTemplateInput>(
  "UpdatePrivacyBudgetTemplateInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    privacyBudgetTemplateIdentifier: S.String.pipe(
      T.HttpLabel("privacyBudgetTemplateIdentifier"),
    ),
    privacyBudgetType: S.String,
    parameters: S.optional(PrivacyBudgetTemplateUpdateParameters),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/privacybudgettemplates/{privacyBudgetTemplateIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPrivacyBudgetTemplatesOutput extends S.Class<ListPrivacyBudgetTemplatesOutput>(
  "ListPrivacyBudgetTemplatesOutput",
)({
  nextToken: S.optional(S.String),
  privacyBudgetTemplateSummaries: PrivacyBudgetTemplateSummaryList,
}) {}
export const ProtectedJobOutputConfigurationInput = S.Union(
  S.Struct({ member: ProtectedJobMemberOutputConfigurationInput }),
);
export class AccessBudgetsPrivacyTemplateParametersInput extends S.Class<AccessBudgetsPrivacyTemplateParametersInput>(
  "AccessBudgetsPrivacyTemplateParametersInput",
)({ budgetParameters: BudgetParameters, resourceArn: S.String }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class BatchGetSchemaAnalysisRuleError extends S.Class<BatchGetSchemaAnalysisRuleError>(
  "BatchGetSchemaAnalysisRuleError",
)({ name: S.String, type: S.String, code: S.String, message: S.String }) {}
export const BatchGetSchemaAnalysisRuleErrorList = S.Array(
  BatchGetSchemaAnalysisRuleError,
);
export class ChangeInput extends S.Class<ChangeInput>("ChangeInput")({
  specificationType: S.String,
  specification: ChangeSpecification,
}) {}
export const ChangeInputList = S.Array(ChangeInput);
export class CollaborationIdNamespaceAssociation extends S.Class<CollaborationIdNamespaceAssociation>(
  "CollaborationIdNamespaceAssociation",
)({
  id: S.String,
  arn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  creatorAccountId: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
  inputReferenceProperties: IdNamespaceAssociationInputReferenceProperties,
  idMappingConfig: S.optional(IdMappingConfig),
}) {}
export class CollaborationIdNamespaceAssociationSummary extends S.Class<CollaborationIdNamespaceAssociationSummary>(
  "CollaborationIdNamespaceAssociationSummary",
)({
  arn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  id: S.String,
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  collaborationArn: S.String,
  collaborationId: S.String,
  creatorAccountId: S.String,
  inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
  name: S.String,
  description: S.optional(S.String),
  inputReferenceProperties:
    IdNamespaceAssociationInputReferencePropertiesSummary,
}) {}
export const CollaborationIdNamespaceAssociationSummaryList = S.Array(
  CollaborationIdNamespaceAssociationSummary,
);
export class ProtectedJobResultConfigurationInput extends S.Class<ProtectedJobResultConfigurationInput>(
  "ProtectedJobResultConfigurationInput",
)({ outputConfiguration: ProtectedJobOutputConfigurationInput }) {}
export const PrivacyBudgetTemplateParametersInput = S.Union(
  S.Struct({ differentialPrivacy: DifferentialPrivacyTemplateParametersInput }),
  S.Struct({ accessBudget: AccessBudgetsPrivacyTemplateParametersInput }),
);
export class CreateCollaborationInput extends S.Class<CreateCollaborationInput>(
  "CreateCollaborationInput",
)(
  {
    members: MemberList,
    name: S.String,
    description: S.String,
    creatorMemberAbilities: MemberAbilities,
    creatorMLMemberAbilities: S.optional(MLMemberAbilities),
    creatorDisplayName: S.String,
    dataEncryptionMetadata: S.optional(DataEncryptionMetadata),
    queryLogStatus: S.String,
    jobLogStatus: S.optional(S.String),
    tags: S.optional(TagMap),
    creatorPaymentConfiguration: S.optional(PaymentConfiguration),
    analyticsEngine: S.optional(S.String),
    autoApprovedChangeRequestTypes: S.optional(AutoApprovedChangeTypeList),
    allowedResultRegions: S.optional(AllowedResultRegions),
  },
  T.all(
    T.Http({ method: "POST", uri: "/collaborations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetSchemaAnalysisRuleOutput extends S.Class<BatchGetSchemaAnalysisRuleOutput>(
  "BatchGetSchemaAnalysisRuleOutput",
)({
  analysisRules: SchemaAnalysisRuleList,
  errors: BatchGetSchemaAnalysisRuleErrorList,
}) {}
export class CreateCollaborationChangeRequestInput extends S.Class<CreateCollaborationChangeRequestInput>(
  "CreateCollaborationChangeRequestInput",
)(
  {
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    changes: ChangeInputList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/collaborations/{collaborationIdentifier}/changeRequests",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCollaborationIdNamespaceAssociationOutput extends S.Class<GetCollaborationIdNamespaceAssociationOutput>(
  "GetCollaborationIdNamespaceAssociationOutput",
)({
  collaborationIdNamespaceAssociation: CollaborationIdNamespaceAssociation,
}) {}
export class ListCollaborationIdNamespaceAssociationsOutput extends S.Class<ListCollaborationIdNamespaceAssociationsOutput>(
  "ListCollaborationIdNamespaceAssociationsOutput",
)({
  nextToken: S.optional(S.String),
  collaborationIdNamespaceAssociationSummaries:
    CollaborationIdNamespaceAssociationSummaryList,
}) {}
export class CreateConfiguredTableAssociationAnalysisRuleInput extends S.Class<CreateConfiguredTableAssociationAnalysisRuleInput>(
  "CreateConfiguredTableAssociationAnalysisRuleInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    analysisRuleType: S.String,
    analysisRulePolicy: ConfiguredTableAssociationAnalysisRulePolicy,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}/analysisRule",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMembershipInput extends S.Class<CreateMembershipInput>(
  "CreateMembershipInput",
)(
  {
    collaborationIdentifier: S.String,
    queryLogStatus: S.String,
    jobLogStatus: S.optional(S.String),
    tags: S.optional(TagMap),
    defaultResultConfiguration: S.optional(
      MembershipProtectedQueryResultConfiguration,
    ),
    defaultJobResultConfiguration: S.optional(
      MembershipProtectedJobResultConfiguration,
    ),
    paymentConfiguration: S.optional(MembershipPaymentConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/memberships" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ProtectedJobReceiverAccountIds = S.Array(S.String);
export const ReceiverAccountIds = S.Array(S.String);
export class StartProtectedJobInput extends S.Class<StartProtectedJobInput>(
  "StartProtectedJobInput",
)(
  {
    type: S.String,
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    jobParameters: ProtectedJobParameters,
    resultConfiguration: S.optional(ProtectedJobResultConfigurationInput),
    computeConfiguration: S.optional(ProtectedJobComputeConfiguration),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/protectedJobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePrivacyBudgetTemplateInput extends S.Class<CreatePrivacyBudgetTemplateInput>(
  "CreatePrivacyBudgetTemplateInput",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    autoRefresh: S.optional(S.String),
    privacyBudgetType: S.String,
    parameters: PrivacyBudgetTemplateParametersInput,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/privacybudgettemplates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePrivacyBudgetTemplateOutput extends S.Class<UpdatePrivacyBudgetTemplateOutput>(
  "UpdatePrivacyBudgetTemplateOutput",
)({ privacyBudgetTemplate: PrivacyBudgetTemplate }) {}
export class ProtectedJobDirectAnalysisConfigurationDetails extends S.Class<ProtectedJobDirectAnalysisConfigurationDetails>(
  "ProtectedJobDirectAnalysisConfigurationDetails",
)({ receiverAccountIds: S.optional(ProtectedJobReceiverAccountIds) }) {}
export class DirectAnalysisConfigurationDetails extends S.Class<DirectAnalysisConfigurationDetails>(
  "DirectAnalysisConfigurationDetails",
)({ receiverAccountIds: S.optional(ReceiverAccountIds) }) {}
export const SchemaList = S.Array(Schema);
export class CollaborationPrivacyBudgetTemplate extends S.Class<CollaborationPrivacyBudgetTemplate>(
  "CollaborationPrivacyBudgetTemplate",
)({
  id: S.String,
  arn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  creatorAccountId: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  privacyBudgetType: S.String,
  autoRefresh: S.String,
  parameters: PrivacyBudgetTemplateParametersOutput,
}) {}
export const ProtectedJobConfigurationDetails = S.Union(
  S.Struct({
    directAnalysisConfigurationDetails:
      ProtectedJobDirectAnalysisConfigurationDetails,
  }),
);
export const ConfigurationDetails = S.Union(
  S.Struct({
    directAnalysisConfigurationDetails: DirectAnalysisConfigurationDetails,
  }),
);
export class CreateAnalysisTemplateInput extends S.Class<CreateAnalysisTemplateInput>(
  "CreateAnalysisTemplateInput",
)(
  {
    description: S.optional(S.String),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.String,
    format: S.String,
    source: AnalysisSource,
    tags: S.optional(TagMap),
    analysisParameters: S.optional(AnalysisParameterList),
    schema: S.optional(AnalysisSchema),
    errorMessageConfiguration: S.optional(ErrorMessageConfiguration),
    syntheticDataParameters: S.optional(SyntheticDataParameters),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/analysistemplates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCollaborationOutput extends S.Class<CreateCollaborationOutput>(
  "CreateCollaborationOutput",
)({ collaboration: Collaboration }) {}
export class BatchGetSchemaOutput extends S.Class<BatchGetSchemaOutput>(
  "BatchGetSchemaOutput",
)({ schemas: SchemaList, errors: BatchGetSchemaErrorList }) {}
export class CreateCollaborationChangeRequestOutput extends S.Class<CreateCollaborationChangeRequestOutput>(
  "CreateCollaborationChangeRequestOutput",
)({ collaborationChangeRequest: CollaborationChangeRequest }) {}
export class GetCollaborationChangeRequestOutput extends S.Class<GetCollaborationChangeRequestOutput>(
  "GetCollaborationChangeRequestOutput",
)({ collaborationChangeRequest: CollaborationChangeRequest }) {}
export class GetCollaborationPrivacyBudgetTemplateOutput extends S.Class<GetCollaborationPrivacyBudgetTemplateOutput>(
  "GetCollaborationPrivacyBudgetTemplateOutput",
)({ collaborationPrivacyBudgetTemplate: CollaborationPrivacyBudgetTemplate }) {}
export class CreateConfiguredTableAssociationAnalysisRuleOutput extends S.Class<CreateConfiguredTableAssociationAnalysisRuleOutput>(
  "CreateConfiguredTableAssociationAnalysisRuleOutput",
)({ analysisRule: ConfiguredTableAssociationAnalysisRule }) {}
export class CreateConfiguredTableInput extends S.Class<CreateConfiguredTableInput>(
  "CreateConfiguredTableInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    tableReference: TableReference,
    allowedColumns: AllowedColumnList,
    analysisMethod: S.String,
    selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/configuredTables" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdMappingTableOutput extends S.Class<GetIdMappingTableOutput>(
  "GetIdMappingTableOutput",
)({ idMappingTable: IdMappingTable }) {}
export class CreateMembershipOutput extends S.Class<CreateMembershipOutput>(
  "CreateMembershipOutput",
)({ membership: Membership }) {}
export class StartProtectedJobOutput extends S.Class<StartProtectedJobOutput>(
  "StartProtectedJobOutput",
)({ protectedJob: ProtectedJob }) {}
export class StartProtectedQueryInput extends S.Class<StartProtectedQueryInput>(
  "StartProtectedQueryInput",
)(
  {
    type: S.String,
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    sqlParameters: ProtectedQuerySQLParameters,
    resultConfiguration: S.optional(ProtectedQueryResultConfiguration),
    computeConfiguration: S.optional(ComputeConfiguration),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/protectedQueries",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePrivacyBudgetTemplateOutput extends S.Class<CreatePrivacyBudgetTemplateOutput>(
  "CreatePrivacyBudgetTemplateOutput",
)({ privacyBudgetTemplate: PrivacyBudgetTemplate }) {}
export class ProtectedJobReceiverConfiguration extends S.Class<ProtectedJobReceiverConfiguration>(
  "ProtectedJobReceiverConfiguration",
)({
  analysisType: S.String,
  configurationDetails: S.optional(ProtectedJobConfigurationDetails),
}) {}
export const ProtectedJobReceiverConfigurations = S.Array(
  ProtectedJobReceiverConfiguration,
);
export class ReceiverConfiguration extends S.Class<ReceiverConfiguration>(
  "ReceiverConfiguration",
)({
  analysisType: S.String,
  configurationDetails: S.optional(ConfigurationDetails),
}) {}
export const ReceiverConfigurationsList = S.Array(ReceiverConfiguration);
export class CollaborationPrivacyBudgetSummary extends S.Class<CollaborationPrivacyBudgetSummary>(
  "CollaborationPrivacyBudgetSummary",
)({
  id: S.String,
  privacyBudgetTemplateId: S.String,
  privacyBudgetTemplateArn: S.String,
  collaborationId: S.String,
  collaborationArn: S.String,
  creatorAccountId: S.String,
  type: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  budget: PrivacyBudget,
}) {}
export const CollaborationPrivacyBudgetSummaryList = S.Array(
  CollaborationPrivacyBudgetSummary,
);
export class ProtectedJobSummary extends S.Class<ProtectedJobSummary>(
  "ProtectedJobSummary",
)({
  id: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  receiverConfigurations: ProtectedJobReceiverConfigurations,
}) {}
export const ProtectedJobSummaryList = S.Array(ProtectedJobSummary);
export class ProtectedQuerySummary extends S.Class<ProtectedQuerySummary>(
  "ProtectedQuerySummary",
)({
  id: S.String,
  membershipId: S.String,
  membershipArn: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  receiverConfigurations: ReceiverConfigurationsList,
}) {}
export const ProtectedQuerySummaryList = S.Array(ProtectedQuerySummary);
export class DifferentialPrivacyPreviewAggregation extends S.Class<DifferentialPrivacyPreviewAggregation>(
  "DifferentialPrivacyPreviewAggregation",
)({ type: S.String, maxCount: S.Number }) {}
export const DifferentialPrivacyPreviewAggregationList = S.Array(
  DifferentialPrivacyPreviewAggregation,
);
export class CreateAnalysisTemplateOutput extends S.Class<CreateAnalysisTemplateOutput>(
  "CreateAnalysisTemplateOutput",
)({ analysisTemplate: AnalysisTemplate }) {}
export class GetAnalysisTemplateOutput extends S.Class<GetAnalysisTemplateOutput>(
  "GetAnalysisTemplateOutput",
)({ analysisTemplate: AnalysisTemplate }) {}
export class ListCollaborationPrivacyBudgetsOutput extends S.Class<ListCollaborationPrivacyBudgetsOutput>(
  "ListCollaborationPrivacyBudgetsOutput",
)({
  collaborationPrivacyBudgetSummaries: CollaborationPrivacyBudgetSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateConfiguredTableOutput extends S.Class<CreateConfiguredTableOutput>(
  "CreateConfiguredTableOutput",
)({ configuredTable: ConfiguredTable }) {}
export class CreateConfiguredTableAnalysisRuleInput extends S.Class<CreateConfiguredTableAnalysisRuleInput>(
  "CreateConfiguredTableAnalysisRuleInput",
)(
  {
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    analysisRuleType: S.String,
    analysisRulePolicy: ConfiguredTableAnalysisRulePolicy,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/configuredTables/{configuredTableIdentifier}/analysisRule",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProtectedJobOutput extends S.Class<GetProtectedJobOutput>(
  "GetProtectedJobOutput",
)({ protectedJob: ProtectedJob }) {}
export class GetProtectedQueryOutput extends S.Class<GetProtectedQueryOutput>(
  "GetProtectedQueryOutput",
)({ protectedQuery: ProtectedQuery }) {}
export class ListProtectedJobsOutput extends S.Class<ListProtectedJobsOutput>(
  "ListProtectedJobsOutput",
)({
  nextToken: S.optional(S.String),
  protectedJobs: ProtectedJobSummaryList,
}) {}
export class ListProtectedQueriesOutput extends S.Class<ListProtectedQueriesOutput>(
  "ListProtectedQueriesOutput",
)({
  nextToken: S.optional(S.String),
  protectedQueries: ProtectedQuerySummaryList,
}) {}
export class StartProtectedQueryOutput extends S.Class<StartProtectedQueryOutput>(
  "StartProtectedQueryOutput",
)({ protectedQuery: ProtectedQuery }) {}
export class DifferentialPrivacyPrivacyImpact extends S.Class<DifferentialPrivacyPrivacyImpact>(
  "DifferentialPrivacyPrivacyImpact",
)({ aggregations: DifferentialPrivacyPreviewAggregationList }) {}
export const PrivacyImpact = S.Union(
  S.Struct({ differentialPrivacy: DifferentialPrivacyPrivacyImpact }),
);
export class CreateConfiguredTableAnalysisRuleOutput extends S.Class<CreateConfiguredTableAnalysisRuleOutput>(
  "CreateConfiguredTableAnalysisRuleOutput",
)({ analysisRule: ConfiguredTableAnalysisRule }) {}
export class PreviewPrivacyImpactOutput extends S.Class<PreviewPrivacyImpactOutput>(
  "PreviewPrivacyImpactOutput",
)({ privacyImpact: PrivacyImpact }) {}
export class GetSchemaAnalysisRuleOutput extends S.Class<GetSchemaAnalysisRuleOutput>(
  "GetSchemaAnalysisRuleOutput",
)({ analysisRule: AnalysisRule }) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), reason: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    reason: S.optional(S.String),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String, quotaName: S.String, quotaValue: S.Number },
) {}

//# Operations
/**
 * Removes a tag or list of tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes an analysis template.
 */
export const deleteAnalysisTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAnalysisTemplateInput,
    output: DeleteAnalysisTemplateOutput,
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
 * Retrieves multiple analysis rule schemas.
 */
export const batchGetSchemaAnalysisRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetSchemaAnalysisRuleInput,
    output: BatchGetSchemaAnalysisRuleOutput,
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
 * Retrieves an ID namespace association from a specific collaboration.
 */
export const getCollaborationIdNamespaceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCollaborationIdNamespaceAssociationInput,
    output: GetCollaborationIdNamespaceAssociationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of the ID namespace associations in a collaboration.
 */
export const listCollaborationIdNamespaceAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCollaborationIdNamespaceAssociationsInput,
    output: ListCollaborationIdNamespaceAssociationsOutput,
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
      items: "collaborationIdNamespaceAssociationSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Provides the details necessary to create a configured audience model association.
 */
export const createConfiguredAudienceModelAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfiguredAudienceModelAssociationInput,
    output: CreateConfiguredAudienceModelAssociationOutput,
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
 * Updates the privacy budget template for the specified collaboration.
 */
export const updatePrivacyBudgetTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePrivacyBudgetTemplateInput,
    output: UpdatePrivacyBudgetTemplateOutput,
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
 * Lists all of the tags that have been added to a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Tags a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Lists analysis templates that the caller owns.
 */
export const listAnalysisTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAnalysisTemplatesInput,
    output: ListAnalysisTemplatesOutput,
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
      items: "analysisTemplateSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns metadata about a collaboration.
 */
export const getCollaboration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationInput,
  output: GetCollaborationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists collaborations the caller owns, is active in, or has been invited to.
 */
export const listCollaborations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCollaborationsInput,
    output: ListCollaborationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "collaborationList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves multiple analysis templates within a collaboration by their Amazon Resource Names (ARNs).
 */
export const batchGetCollaborationAnalysisTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetCollaborationAnalysisTemplateInput,
    output: BatchGetCollaborationAnalysisTemplateOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a configured audience model association within a collaboration.
 */
export const getCollaborationConfiguredAudienceModelAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCollaborationConfiguredAudienceModelAssociationInput,
    output: GetCollaborationConfiguredAudienceModelAssociationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists analysis templates within a collaboration.
 */
export const listCollaborationAnalysisTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCollaborationAnalysisTemplatesInput,
    output: ListCollaborationAnalysisTemplatesOutput,
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
      items: "collaborationAnalysisTemplateSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all change requests for a collaboration with pagination support. Returns change requests sorted by creation time.
 */
export const listCollaborationChangeRequests =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCollaborationChangeRequestsInput,
    output: ListCollaborationChangeRequestsOutput,
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
      items: "collaborationChangeRequestSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists configured audience model associations within a collaboration.
 */
export const listCollaborationConfiguredAudienceModelAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCollaborationConfiguredAudienceModelAssociationsInput,
    output: ListCollaborationConfiguredAudienceModelAssociationsOutput,
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
      items: "collaborationConfiguredAudienceModelAssociationSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns an array that summarizes each privacy budget template in a specified collaboration.
 */
export const listCollaborationPrivacyBudgetTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCollaborationPrivacyBudgetTemplatesInput,
    output: ListCollaborationPrivacyBudgetTemplatesOutput,
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
      items: "collaborationPrivacyBudgetTemplateSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all members within a collaboration.
 */
export const listMembers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMembersInput,
    output: ListMembersOutput,
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
      items: "memberSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the schemas for relations within a collaboration.
 */
export const listSchemas = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSchemasInput,
    output: ListSchemasOutput,
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
      items: "schemaSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates an existing collaboration change request. This operation allows approval actions for pending change requests in collaborations (APPROVE, DENY, CANCEL, COMMIT).
 *
 * For change requests without automatic approval, a member in the collaboration can manually APPROVE or DENY a change request. The collaboration owner can manually CANCEL or COMMIT a change request.
 */
export const updateCollaborationChangeRequest =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCollaborationChangeRequestInput,
    output: UpdateCollaborationChangeRequestOutput,
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
 * Lists information about requested configured audience model associations.
 */
export const listConfiguredAudienceModelAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListConfiguredAudienceModelAssociationsInput,
    output: ListConfiguredAudienceModelAssociationsOutput,
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
      items: "configuredAudienceModelAssociationSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists configured table associations for a membership.
 */
export const listConfiguredTableAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListConfiguredTableAssociationsInput,
    output: ListConfiguredTableAssociationsOutput,
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
      items: "configuredTableAssociationSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves the analysis rule for a configured table association.
 */
export const getConfiguredTableAssociationAnalysisRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfiguredTableAssociationAnalysisRuleInput,
    output: GetConfiguredTableAssociationAnalysisRuleOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a configured table.
 */
export const getConfiguredTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredTableInput,
  output: GetConfiguredTableOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists configured tables.
 */
export const listConfiguredTables =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListConfiguredTablesInput,
    output: ListConfiguredTablesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "configuredTableSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a configured table analysis rule.
 */
export const getConfiguredTableAnalysisRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfiguredTableAnalysisRuleInput,
    output: GetConfiguredTableAnalysisRuleOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of ID mapping tables.
 */
export const listIdMappingTables =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIdMappingTablesInput,
    output: ListIdMappingTablesOutput,
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
      items: "idMappingTableSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves an ID namespace association.
 */
export const getIdNamespaceAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIdNamespaceAssociationInput,
    output: GetIdNamespaceAssociationOutput,
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
 * Returns a list of ID namespace associations.
 */
export const listIdNamespaceAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIdNamespaceAssociationsInput,
    output: ListIdNamespaceAssociationsOutput,
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
      items: "idNamespaceAssociationSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a specified membership for an identifier.
 */
export const getMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMembershipInput,
  output: GetMembershipOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all memberships resources within the caller's account.
 */
export const listMemberships = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMembershipsInput,
    output: ListMembershipsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "membershipSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns detailed information about the privacy budgets in a specified membership.
 */
export const listPrivacyBudgets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPrivacyBudgetsInput,
    output: ListPrivacyBudgetsOutput,
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
      items: "privacyBudgetSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns details for a specified privacy budget template.
 */
export const getPrivacyBudgetTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPrivacyBudgetTemplateInput,
    output: GetPrivacyBudgetTemplateOutput,
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
 * Returns detailed information about the privacy budget templates in a specified membership.
 */
export const listPrivacyBudgetTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPrivacyBudgetTemplatesInput,
    output: ListPrivacyBudgetTemplatesOutput,
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
      items: "privacyBudgetTemplateSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Updates collaboration metadata and can only be called by the collaboration owner.
 */
export const updateCollaboration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCollaborationInput,
  output: UpdateCollaborationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves an analysis template within a collaboration.
 */
export const getCollaborationAnalysisTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCollaborationAnalysisTemplateInput,
    output: GetCollaborationAnalysisTemplateOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the schema for a relation within a collaboration.
 */
export const getSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaInput,
  output: GetSchemaOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a configured audience model association.
 */
export const getConfiguredAudienceModelAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfiguredAudienceModelAssociationInput,
    output: GetConfiguredAudienceModelAssociationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Provides the details necessary to update a configured audience model association.
 */
export const updateConfiguredAudienceModelAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfiguredAudienceModelAssociationInput,
    output: UpdateConfiguredAudienceModelAssociationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a configured table association.
 */
export const getConfiguredTableAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfiguredTableAssociationInput,
    output: GetConfiguredTableAssociationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Provides the details that are necessary to update an ID mapping table.
 */
export const updateIdMappingTable = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateIdMappingTableInput,
    output: UpdateIdMappingTableOutput,
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
 * Provides the details that are necessary to update an ID namespace association.
 */
export const updateIdNamespaceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateIdNamespaceAssociationInput,
    output: UpdateIdNamespaceAssociationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes a collaboration. It can only be called by the collaboration owner.
 */
export const deleteCollaboration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCollaborationInput,
  output: DeleteCollaborationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides the information necessary to delete a configured audience model association.
 */
export const deleteConfiguredAudienceModelAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfiguredAudienceModelAssociationInput,
    output: DeleteConfiguredAudienceModelAssociationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes an ID mapping table.
 */
export const deleteIdMappingTable = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIdMappingTableInput,
    output: DeleteIdMappingTableOutput,
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
 * Deletes an ID namespace association.
 */
export const deleteIdNamespaceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteIdNamespaceAssociationInput,
    output: DeleteIdNamespaceAssociationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes a privacy budget template for a specified collaboration.
 */
export const deletePrivacyBudgetTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePrivacyBudgetTemplateInput,
    output: DeletePrivacyBudgetTemplateOutput,
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
 * Updates the analysis template metadata.
 */
export const updateAnalysisTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAnalysisTemplateInput,
    output: UpdateAnalysisTemplateOutput,
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
 * Updates a configured table association.
 */
export const updateConfiguredTableAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfiguredTableAssociationInput,
    output: UpdateConfiguredTableAssociationOutput,
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
 * Updates the analysis rule for a configured table association.
 */
export const updateConfiguredTableAssociationAnalysisRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfiguredTableAssociationAnalysisRuleInput,
    output: UpdateConfiguredTableAssociationAnalysisRuleOutput,
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
 * Updates a configured table analysis rule.
 */
export const updateConfiguredTableAnalysisRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfiguredTableAnalysisRuleInput,
    output: UpdateConfiguredTableAnalysisRuleOutput,
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
 * Updates a membership.
 */
export const updateMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMembershipInput,
  output: UpdateMembershipOutput,
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
 * Updates the processing of a currently running job.
 */
export const updateProtectedJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProtectedJobInput,
  output: UpdateProtectedJobOutput,
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
 * Updates the processing of a currently running query.
 */
export const updateProtectedQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProtectedQueryInput,
    output: UpdateProtectedQueryOutput,
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
 * Removes the specified member from a collaboration. The removed member is placed in the Removed status and can't interact with the collaboration. The removed member's data is inaccessible to active members of the collaboration.
 */
export const deleteMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMemberInput,
  output: DeleteMemberOutput,
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
 * Deletes a configured table association.
 */
export const deleteConfiguredTableAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfiguredTableAssociationInput,
    output: DeleteConfiguredTableAssociationOutput,
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
 * Deletes an analysis rule for a configured table association.
 */
export const deleteConfiguredTableAssociationAnalysisRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfiguredTableAssociationAnalysisRuleInput,
    output: DeleteConfiguredTableAssociationAnalysisRuleOutput,
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
 * Deletes a configured table.
 */
export const deleteConfiguredTable = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConfiguredTableInput,
    output: DeleteConfiguredTableOutput,
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
 * Deletes a configured table analysis rule.
 */
export const deleteConfiguredTableAnalysisRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfiguredTableAnalysisRuleInput,
    output: DeleteConfiguredTableAnalysisRuleOutput,
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
 * Deletes a specified membership. All resources under a membership must be deleted.
 */
export const deleteMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMembershipInput,
  output: DeleteMembershipOutput,
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
 * Creates a configured table association. A configured table association links a configured table with a collaboration.
 */
export const createConfiguredTableAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfiguredTableAssociationInput,
    output: CreateConfiguredTableAssociationOutput,
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
 * Creates an ID mapping table.
 */
export const createIdMappingTable = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIdMappingTableInput,
    output: CreateIdMappingTableOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an ID namespace association.
 */
export const createIdNamespaceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateIdNamespaceAssociationInput,
    output: CreateIdNamespaceAssociationOutput,
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
 * Updates a configured table.
 */
export const updateConfiguredTable = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConfiguredTableInput,
    output: UpdateConfiguredTableOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Defines the information that's necessary to populate an ID mapping table.
 */
export const populateIdMappingTable = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PopulateIdMappingTableInput,
    output: PopulateIdMappingTableOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new collaboration.
 */
export const createCollaboration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCollaborationInput,
  output: CreateCollaborationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves multiple schemas by their identifiers.
 */
export const batchGetSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetSchemaInput,
  output: BatchGetSchemaOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new change request to modify an existing collaboration. This enables post-creation modifications to collaborations through a structured API-driven approach.
 */
export const createCollaborationChangeRequest =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCollaborationChangeRequestInput,
    output: CreateCollaborationChangeRequestOutput,
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
 * Retrieves detailed information about a specific collaboration change request.
 */
export const getCollaborationChangeRequest =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCollaborationChangeRequestInput,
    output: GetCollaborationChangeRequestOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns details about a specified privacy budget template.
 */
export const getCollaborationPrivacyBudgetTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCollaborationPrivacyBudgetTemplateInput,
    output: GetCollaborationPrivacyBudgetTemplateOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a new analysis rule for an associated configured table.
 */
export const createConfiguredTableAssociationAnalysisRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfiguredTableAssociationAnalysisRuleInput,
    output: CreateConfiguredTableAssociationAnalysisRuleOutput,
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
 * Retrieves an ID mapping table.
 */
export const getIdMappingTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdMappingTableInput,
  output: GetIdMappingTableOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a membership for a specific collaboration identifier and joins the collaboration.
 */
export const createMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMembershipInput,
  output: CreateMembershipOutput,
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
 * Creates a protected job that is started by Clean Rooms.
 */
export const startProtectedJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartProtectedJobInput,
  output: StartProtectedJobOutput,
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
 * Creates a privacy budget template for a specified collaboration. Each collaboration can have only one privacy budget template. If you need to change the privacy budget template, use the UpdatePrivacyBudgetTemplate operation.
 */
export const createPrivacyBudgetTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePrivacyBudgetTemplateInput,
    output: CreatePrivacyBudgetTemplateOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new analysis template.
 */
export const createAnalysisTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAnalysisTemplateInput,
    output: CreateAnalysisTemplateOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves an analysis template.
 */
export const getAnalysisTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAnalysisTemplateInput,
  output: GetAnalysisTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns an array that summarizes each privacy budget in a specified collaboration. The summary includes the collaboration ARN, creation time, creating account, and privacy budget details.
 */
export const listCollaborationPrivacyBudgets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCollaborationPrivacyBudgetsInput,
    output: ListCollaborationPrivacyBudgetsOutput,
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
      items: "collaborationPrivacyBudgetSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a new configured table resource.
 */
export const createConfiguredTable = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConfiguredTableInput,
    output: CreateConfiguredTableOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns job processing metadata.
 */
export const getProtectedJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProtectedJobInput,
  output: GetProtectedJobOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns query processing metadata.
 */
export const getProtectedQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProtectedQueryInput,
  output: GetProtectedQueryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists protected jobs, sorted by most recent job.
 */
export const listProtectedJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListProtectedJobsInput,
    output: ListProtectedJobsOutput,
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
      items: "protectedJobs",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists protected queries, sorted by the most recent query.
 */
export const listProtectedQueries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProtectedQueriesInput,
    output: ListProtectedQueriesOutput,
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
      items: "protectedQueries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a protected query that is started by Clean Rooms.
 */
export const startProtectedQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartProtectedQueryInput,
  output: StartProtectedQueryOutput,
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
 * Creates a new analysis rule for a configured table. Currently, only one analysis rule can be created for a given configured table.
 */
export const createConfiguredTableAnalysisRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfiguredTableAnalysisRuleInput,
    output: CreateConfiguredTableAnalysisRuleOutput,
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
 * An estimate of the number of aggregation functions that the member who can query can run given epsilon and noise parameters.
 */
export const previewPrivacyImpact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PreviewPrivacyImpactInput,
    output: PreviewPrivacyImpactOutput,
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
 * Retrieves a schema analysis rule.
 */
export const getSchemaAnalysisRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSchemaAnalysisRuleInput,
    output: GetSchemaAnalysisRuleOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
